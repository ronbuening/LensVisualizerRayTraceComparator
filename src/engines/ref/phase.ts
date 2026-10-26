// Generalized Snell law from the surface eikonal, independent of either external engine.
import type { DiffractivePhase } from "../../contract/case.ts";
import { createExactSum, twoProductError } from "../../core/numeric/exact.ts";
import type { Vec3 } from "../../estimators/imageProjection.ts";

/** W or dW/dr, with compensated polynomial sums. W is an unwrapped optical path in mm. */
export function phasePolynomial(phase: DiffractivePhase, r: number, derivative = false): number {
  const sum = createExactSum();
  for (const term of phase.terms) {
    const factor = derivative ? term.radialPower : 1;
    const coefficient = term.coefficient * factor;
    const power = r ** (term.radialPower - (derivative ? 1 : 0));
    sum.add(coefficient, power);
    sum.add(twoProductError(term.coefficient, factor, coefficient), power);
  }
  return sum.value();
}
export function phaseScale(phase: DiffractivePhase, wavelengthNm: number): number {
  return (phase.diffractionOrder * wavelengthNm) / phase.referenceWavelengthNm;
}
export function phasePower(phase: DiffractivePhase | undefined, wavelengthNm: number): number {
  const coefficient = phase?.terms.find((term) => term.radialPower === 2)?.coefficient ?? 0;
  return phase === undefined || coefficient === 0 ? 0 : -2 * coefficient * phaseScale(phase, wavelengthNm);
}
function dot(a: Vec3, b: Vec3): number {
  const sum = createExactSum();
  for (let axis = 0; axis < 3; axis++) sum.add(a[axis], b[axis]);
  return sum.value();
}
/** n_out d_out,t = n_in d_in,t + (m lambda/lambda0) grad_surface W. */
export function diffract(
  direction: Vec3,
  normal: Vec3,
  point: Vec3,
  before: number,
  after: number,
  phase: DiffractivePhase,
  wavelengthNm: number,
): Vec3 | null {
  const length = Math.sqrt(dot(direction, direction));
  const d = direction.map((value) => value / length) as unknown as Vec3;
  const n = (dot(d, normal) < 0 ? normal.map((value) => -value) : normal) as Vec3;
  const along = dot(d, n);
  const r = Math.sqrt(point[0] ** 2 + point[1] ** 2);
  const gradient: Vec3 = r === 0 ? [0, 0, 0] : [point[0] / r, point[1] / r, 0];
  const projected = dot(gradient, n);
  const kick = phaseScale(phase, wavelengthNm) * phasePolynomial(phase, r, true);
  const tangent = d.map((value, axis) => {
    const sum = createExactSum();
    sum.add(before, value - along * n[axis]);
    sum.add(kick, gradient[axis] - projected * n[axis]);
    return sum.value();
  }) as unknown as Vec3;
  const radicand = after * after - dot(tangent, tangent);
  if (radicand < 0) return null;
  const out = tangent.map((value, axis) => (value + Math.sqrt(radicand) * n[axis]) / after) as unknown as Vec3;
  const norm = Math.sqrt(dot(out, out));
  return out.map((value) => value / norm) as unknown as Vec3;
}
