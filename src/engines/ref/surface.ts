// The surface evaluator of the reference engine: sag, slope and unit normal of a surface of revolution, in closed
// form. The sag is the contract's (contract/CONTRACT.md, "Sag"):
//
//   z(r) = c r^2 / (1 + sqrt(1 - (1 + K) c^2 r^2)) + sum of a_n r^n
//
// Only IEEE 754 basic operations are used (+, -, *, / and square root, each correctly rounded), and a power is
// built by multiplication, so a result does not depend on a math library and is the same bits on every platform.
//
// The polynomial is the one sum of a surface that cancels: the terms of a real asphere reach 1e5 mm and add up to a
// sag of a millimetre. It is therefore summed with the rounding error of every product and of every addition
// carried along (`polynomial`), which gives the sum as if it had been computed in twice the working precision.
import type { AsphereTerm, SurfaceShape } from "../../contract/case.ts";
import { twoProductError, twoSumError } from "../../core/numeric/exact.ts";

/** A surface of revolution as the reference engine holds it. */
export interface SurfaceProfile {
  /** The base curvature c, 1/mm: 1/radius, and 0 for a plane and for an asphere on a flat base. */
  readonly curvature: number;
  /** The conic constant K as the shape states it; 0 for a plane. It has no effect where the curvature is 0. */
  readonly conic: number;
  /** The polynomial terms whose coefficient is not 0, by ascending power. A zero coefficient adds nothing. */
  readonly terms: readonly AsphereTerm[];
}

/** The profile of a contract shape. The curvature is one division, 1/radius, so it is the same bits everywhere. */
export function profileOf(shape: SurfaceShape): SurfaceProfile {
  if (shape.kind === "plane") return { curvature: 0, conic: 0, terms: [] };
  const curvature = shape.radius === null ? 0 : 1 / shape.radius;
  const terms = shape.kind === "asphere" ? shape.terms.filter((term) => term.coeff !== 0) : [];
  return { curvature, conic: shape.conic, terms: terms.map(({ power, coeff }) => ({ power, coeff })).sort(byPower) };
}

function byPower(a: AsphereTerm, b: AsphereTerm): number {
  return a.power - b.power;
}

/**
 * The polynomial part of a sag and its derivative at the radial height `r`: the sum of `coeff * r^power` over the
 * terms, and the sum of `power * coeff * r^(power - 1)`, as `[value, slope]`.
 *
 * Both are compensated sums. A power of `r` is carried as two doubles, a value and what its rounding left out, and
 * raised one multiplication at a time; each term's product with it, and each addition to the running sum, has its
 * rounding error computed exactly (`twoProductError`, `twoSumError`) and added up beside the sum. The result is
 * each sum rounded once from a value that is exact to about 1e-32 of the magnitudes added, so terms that cancel by
 * five orders of magnitude cost no digit. The terms are taken in the order given, which `profileOf` makes ascending.
 */
export function polynomial(terms: readonly AsphereTerm[], r: number): [value: number, slope: number] {
  // r^reached as power + powerRest, and r^(reached - 1) as below + belowRest.
  let reached = 0;
  let power = 1;
  let powerRest = 0;
  let below = 0;
  let belowRest = 0;
  let value = 0;
  let valueRest = 0;
  let slope = 0;
  let slopeRest = 0;
  for (const term of terms) {
    while (reached < term.power) {
      below = power;
      belowRest = powerRest;
      const raised = power * r;
      const rest = twoProductError(power, r, raised) + powerRest * r;
      power = raised + rest;
      powerRest = rest - (power - raised);
      reached++;
    }
    const product = term.coeff * power;
    const productRest = twoProductError(term.coeff, power, product) + term.coeff * powerRest;
    const sum = value + product;
    valueRest += twoSumError(value, product, sum) + productRest;
    value = sum;

    // power * coeff need not be a double: a small whole number times 53 bits can have 58.
    const factor = term.power * term.coeff;
    const factorRest = twoProductError(term.power, term.coeff, factor);
    const steepness = factor * below;
    const steepnessRest = twoProductError(factor, below, steepness) + (factor * belowRest + factorRest * below);
    const slopeSum = slope + steepness;
    slopeRest += twoSumError(slope, steepness, slopeSum) + steepnessRest;
    slope = slopeSum;
  }
  return [value + valueRest, slope + slopeRest];
}

/**
 * The root sqrt(1 - (1 + K) c^2 r^2) that the conic part of the sag, of the slope and of the normal share; it is
 * the cosine of the angle between the conic's normal and the axis, times sqrt(1 - K c^2 r^2). NaN beyond the
 * height at which the conic ends, where 1 - (1 + K) c^2 r^2 is below 0; 1 on a flat base.
 */
export function conicRoot(profile: SurfaceProfile, r: number): number {
  const u = profile.curvature * r;
  return Math.sqrt(1 - (1 + profile.conic) * u * u);
}

/**
 * The sag of a surface at the radial height `r` (mm, not negative), measured from its vertex along +z, mm.
 *
 * The conic part is written c r^2 / (1 + root), which adds two positive numbers where the textbook form
 * (1 - root) / ((1 + K) c) subtracts two nearly equal ones, so it keeps its precision near the vertex and is
 * defined for a paraboloid. Beyond the height at which the conic ends the root is not real and the sag is NaN.
 * The polynomial is a compensated sum (`polynomial`), added to the conic part in one addition.
 */
export function sag(profile: SurfaceProfile, r: number): number {
  const { curvature, terms } = profile;
  const conicPart = curvature === 0 ? 0 : (curvature * r * r) / (1 + conicRoot(profile, r));
  return terms.length === 0 ? conicPart : conicPart + polynomial(terms, r)[0];
}

/**
 * The slope dz/dr of a surface at the radial height `r` (mm, not negative): c r / root for the conic part plus the
 * derivative of the polynomial. It is infinite at the height where the conic ends and NaN beyond it.
 */
export function slope(profile: SurfaceProfile, r: number): number {
  const { curvature, terms } = profile;
  const conicPart = curvature === 0 ? 0 : (curvature * r) / conicRoot(profile, r);
  return terms.length === 0 ? conicPart : conicPart + polynomial(terms, r)[1];
}

/**
 * The unit normal of a surface at the point above (x, y), as [nx, ny, nz], turned toward +z: nz is never negative.
 *
 * It is (-g x/r, -g y/r, root) / sqrt(g^2 + root^2) with g = c r + root p'(r), which is the gradient of
 * z - sag(r) multiplied by the root. In that form nothing is divided by the root, so the normal stays finite where
 * the slope is infinite: at the rim of a hemisphere it lies in the plane of the rim. On the axis it is (0, 0, 1);
 * a surface with a term of power 1 has a corner there and the normal is NaN. Beyond the height at which the conic
 * ends every component is NaN.
 */
export function unitNormal(profile: SurfaceProfile, x: number, y: number): [nx: number, ny: number, nz: number] {
  const r = Math.sqrt(x * x + y * y);
  return unitNormalAt(profile, x, y, profile.curvature === 0 ? 1 : conicRoot(profile, r));
}

/**
 * The unit normal of a surface at the point above (x, y) (`unitNormal`), for a caller that knows the conic's root
 * there by another way than from the height: on the surface the root is 1 - (1 + K) c w, with w the conic part of
 * the sag, which is exact where the square root of `conicRoot` has lost its digits: near the height at which the
 * conic ends. On a flat base the root is 1.
 */
export function unitNormalAt(
  profile: SurfaceProfile,
  x: number,
  y: number,
  root: number,
): [nx: number, ny: number, nz: number] {
  const r = Math.sqrt(x * x + y * y);
  const polynomialSlope = profile.terms.length === 0 ? 0 : polynomial(profile.terms, r)[1];
  const g = profile.curvature * r + root * polynomialSlope;
  if (r === 0) return g === 0 ? [0, 0, 1] : [NaN, NaN, NaN];
  const length = Math.sqrt(g * g + root * root);
  const radial = -g / (r * length);
  return [radial * x, radial * y, root / length];
}
