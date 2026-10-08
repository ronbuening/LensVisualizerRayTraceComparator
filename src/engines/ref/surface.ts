// The surface evaluator of the reference engine: sag, slope and unit normal of a surface of revolution, in closed
// form. The sag is the contract's (contract/CONTRACT.md, "Sag"):
//
//   z(r) = c r^2 / (1 + sqrt(1 - (1 + K) c^2 r^2)) + sum of a_n r^n
//
// Only IEEE 754 basic operations are used (+, -, *, / and square root, each correctly rounded), and a power is
// built by multiplication, so a result does not depend on a math library and is the same bits on every platform.
import type { AsphereTerm, SurfaceShape } from "../../contract/case.ts";

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

/** `base` to a whole power of at least 0, by squaring and multiplying: at most 2 log2(power) rounded products. */
function wholePower(base: number, power: number): number {
  let result = 1;
  let square = base;
  for (let left = power; left > 0; left = Math.floor(left / 2)) {
    if (left % 2 === 1) result *= square;
    if (left > 1) square *= square;
  }
  return result;
}

/**
 * The root sqrt(1 - (1 + K) c^2 r^2) that the conic part of the sag, of the slope and of the normal share; it is
 * the cosine of the angle between the conic's normal and the axis, times sqrt(1 - K c^2 r^2). NaN beyond the
 * height at which the conic ends, where 1 - (1 + K) c^2 r^2 is below 0; 1 on a flat base.
 */
function conicRoot(profile: SurfaceProfile, r: number): number {
  const u = profile.curvature * r;
  return Math.sqrt(1 - (1 + profile.conic) * u * u);
}

/**
 * The sag of a surface at the radial height `r` (mm, not negative), measured from its vertex along +z, mm.
 *
 * The conic part is written c r^2 / (1 + root), which adds two positive numbers where the textbook form
 * (1 - root) / ((1 + K) c) subtracts two nearly equal ones, so it keeps its precision near the vertex and is
 * defined for a paraboloid. Beyond the height at which the conic ends the root is not real and the sag is NaN.
 * The polynomial is summed term by term in ascending power.
 */
export function sag(profile: SurfaceProfile, r: number): number {
  const { curvature, terms } = profile;
  let z = curvature === 0 ? 0 : (curvature * r * r) / (1 + conicRoot(profile, r));
  for (const { power, coeff } of terms) z += coeff * wholePower(r, power);
  return z;
}

/** The derivative of the polynomial part of the sag: the sum of n a_n r^(n - 1). */
function polynomialSlope(terms: readonly AsphereTerm[], r: number): number {
  let slope = 0;
  for (const { power, coeff } of terms) slope += power * coeff * wholePower(r, power - 1);
  return slope;
}

/**
 * The slope dz/dr of a surface at the radial height `r` (mm, not negative): c r / root for the conic part plus the
 * derivative of the polynomial. It is infinite at the height where the conic ends and NaN beyond it.
 */
export function slope(profile: SurfaceProfile, r: number): number {
  const { curvature, terms } = profile;
  const conicPart = curvature === 0 ? 0 : (curvature * r) / conicRoot(profile, r);
  return conicPart + polynomialSlope(terms, r);
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
  const root = profile.curvature === 0 ? 1 : conicRoot(profile, r);
  const g = profile.curvature * r + root * polynomialSlope(profile.terms, r);
  if (r === 0) return g === 0 ? [0, 0, 1] : [NaN, NaN, NaN];
  const length = Math.sqrt(g * g + root * root);
  const radial = -g / (r * length);
  return [radial * x, radial * y, root / length];
}
