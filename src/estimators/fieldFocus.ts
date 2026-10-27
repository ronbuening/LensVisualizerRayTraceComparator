// The tangential and the sagittal focus of a field relative to its chief ray, from where the rays of the field meet a
// plane and their directions there: the comparator's own estimator of what LensVisualizer's field-curve and
// astigmatism sections present, applied alike to every engine's trace of the same rays.
//
// A ray that meets the plane at (x, y) along the direction (l, m, n) is, at the distance s behind the plane,
//
//   tangential coordinate   y(s) = y + s u,   u = m / n      (dy/dz behind the system)
//   sagittal coordinate     x(s) = x + s v,   v = l / n      (dx/dz)
//
// and relative to the field's chief ray (index 0 below) a ray of the tangential fan is Δy(s) = (y_i - y_0) + s (u_i -
// u_0), of the sagittal fan Δx(s) likewise. The focus of a fan is the plane where the sum of the squared relative
// coordinates is least, at the distance
//
//   shift      s* = - sum of Δc_i Δu_i / sum of Δu_i^2            (mm along z, + toward the image; c, u the fan's own)
//   scale      rms(Δu) = sqrt( sum of Δu_i^2 / k )                 (k the rays of the fan taken)
//
// from the plane: LensVisualizer's `bestRelativeFocusPlane` (shared.ts), the least-squares focus of the hits relative
// to the reference hit, which its field curves take of their four parabasal rays (`computeStandardizedFieldFocus`) and
// of their real-ray fans (`bestFocusPlaneForDirection`), less the image plane. A shift `δ` of the focus moves the rays'
// relative coordinates there by `δ Δu_i`, `δ rms(Δu)` in the root mean square: the scale is what turns a difference of
// two foci into a distance across the field, the transverse distance a gate of R2 is of.
//
// Arithmetic. Only IEEE 754 basic operations are used (+, -, *, / and the square root, each correctly rounded), in the
// order of the rays given, so a result is the same bits on every platform. The relative coordinates and slopes of a
// parabasal ray are tiny differences of large numbers (a chief ray 20 mm off the axis, a parabasal ray 1e-5 mm beside
// it on the plane, slopes 1e-4 apart), and each is carried in two doubles:
//
// - Δc is the difference of the two coordinates and its rest (`twoSumError`), exactly.
// - A slope is the quotient m / n and its rest, the remainder of the quotient (formed exactly with `twoProductError`)
//   over n; Δu is the difference of the two quotients, with the rest of that difference and the difference of the two
//   rests: the slope difference of the doubles given to about 2^-104 of itself.
// - The two sums are of the exact products of those pairs (`twoProductError`), compensated (each addition's rounding
//   error added up apart, `twoSumError`), and kept as a value and a rest: the sum of the moments cancels between rays
//   on either side of the focus, and the rest is what the plain sum loses there.
// - The shift is the quotient of the two sums, with the remainder of the first double of it: within a unit in its
//   last place of the focus of the doubles given.
// - A slope that is no finite double (a direction with no z), or a sum that overflows, is `out-of-range`: an outcome
//   with a reason, never a NaN or an infinity handed on.
import { twoProductError, twoSumError } from "../core/numeric/exact.ts";

/** The two fans of a field: the tangential one in the meridional section (y), the sagittal one across it (x). */
export type FocusAxis = "tangential" | "sagittal";

/** The rays of one set where they meet a plane, as the estimator reads them. */
export interface FocusRays {
  /** x, y, z of each ray's point on the plane, mm: `[n, 3]`, flat. Every z is the plane's; only x and y are read. */
  readonly landing: ArrayLike<number>;
  /** The direction of each ray there: `[n, 3]`, flat. Only the ratios of its components are read. */
  readonly direction: ArrayLike<number>;
  /** Which rays are taken: an element that is 0 leaves its ray out. Without it every ray is taken. */
  readonly valid?: ArrayLike<number>;
}

/** Why a fan has no focus. */
export type FocusReason =
  /** The chief ray is not taken: no ray of the fan has a reference. */
  | "no-reference"
  /** No ray of the fan is taken. */
  | "no-rays"
  /** A ray taken has a point or a direction that is not finite numbers. */
  | "bad-ray"
  /** Every ray taken runs parallel to the chief ray in the fan's section: no plane is better than another. */
  | "no-slope"
  /** A slope or a sum is no finite double. */
  | "out-of-range";

/** The focus of a fan relative to its chief ray, or why it has none. */
export type RelativeFocus =
  | {
      readonly available: true;
      /** The distance of the focus behind the plane, along z, mm: + toward the image. */
      readonly shiftMm: number;
      /** The root mean square of the rays' slopes relative to the chief ray's: the transverse scale of the shift. */
      readonly rmsSlope: number;
      /** How many rays of the fan are taken. */
      readonly rays: number;
    }
  | { readonly available: false; readonly reason: FocusReason; readonly message: string };

/** A number carried in two doubles: a value and what its rounding left out. */
interface Pair {
  readonly value: number;
  readonly rest: number;
}

/** The difference `a - b` of two doubles, exactly, as a double and its rest. */
function difference(a: number, b: number): Pair {
  const value = a - b;
  return { value, rest: twoSumError(a, -b, value) };
}

/**
 * The quotient `numerator / denominator` of two doubles as a double and its rest: the first double of it, and the
 * remainder that double leaves, formed exactly, over the denominator. The remainder is exact: the product of the
 * quotient and the denominator is within a rounding of the numerator, so their difference is (Sterbenz), and the
 * product's own rounding is `twoProductError`'s.
 */
function quotient(numerator: number, denominator: number): Pair {
  const value = numerator / denominator;
  const back = value * denominator;
  const remainder = numerator - back - twoProductError(value, denominator, back);
  return { value, rest: remainder / denominator };
}

/** The difference of two pairs, `a - b`, renormalised: the difference of the two values, then every rest. */
function pairDifference(a: Pair, b: Pair): Pair {
  const first = a.value - b.value;
  const rest = twoSumError(a.value, -b.value, first) + (a.rest - b.rest);
  const value = first + rest;
  return { value, rest: twoSumError(first, rest, value) };
}

/**
 * A running sum of products of pairs, compensated: `add(a, b)` adds `(a.value + a.rest)(b.value + b.rest)` but for
 * the product of the two rests, which is below every rounding of the sum. The rounding error of every product of the
 * values and of every addition is added up apart, and `parts()` is the sum as a value and a rest, renormalised.
 */
function pairSum(): { add(a: Pair, b: Pair): void; parts(): Pair } {
  let sum = 0;
  let rest = 0;
  const addTerm = (term: number, error: number): void => {
    const next = sum + term;
    rest += twoSumError(sum, term, next) + error;
    sum = next;
  };
  return {
    add: (a, b) => {
      const product = a.value * b.value;
      addTerm(product, twoProductError(a.value, b.value, product));
      const cross = a.value * b.rest + a.rest * b.value;
      addTerm(cross, 0);
    },
    parts: () => {
      const value = sum + rest;
      return { value, rest: twoSumError(sum, rest, value) };
    },
  };
}

/**
 * The quotient of two pairs, `numerator / denominator`, rounded once: the first double of the quotient of the values,
 * and the remainder it leaves of the whole numerator (formed exactly but for the denominator's rest times the
 * quotient), over the denominator's value.
 */
function pairQuotient(numerator: Pair, denominator: Pair): number {
  const first = numerator.value / denominator.value;
  const back = first * denominator.value;
  const remainder =
    numerator.value -
    back -
    twoProductError(first, denominator.value, back) +
    numerator.rest -
    first * denominator.rest;
  return first + remainder / denominator.value;
}

/** The axis of a fan's coordinate and of its slope's numerator in a point or a direction: x for sagittal, y else. */
function componentOf(axis: FocusAxis): 0 | 1 {
  return axis === "sagittal" ? 0 : 1;
}

/**
 * The focus of a fan of a field relative to its chief ray (see above): the rays `members` of `rays`, of which those
 * taken (`rays.valid`) are summed, in the section `axis`, against the ray `chief`. A member that is the chief ray's
 * own index adds nothing and is taken as any other.
 *
 * What cannot be computed is an outcome with a reason: the chief ray not taken (`no-reference`), no member taken
 * (`no-rays`), a ray taken that is not finite numbers (`bad-ray`), every member taken parallel to the chief ray in the
 * section (`no-slope`), a slope or a sum that is no finite double (`out-of-range`). Arrays that are not of one set of
 * rays, and an index that is no ray of it, throw a RangeError.
 */
export function relativeFocus(
  rays: FocusRays,
  chief: number,
  members: readonly number[],
  axis: FocusAxis,
): RelativeFocus {
  const count = rays.landing.length / 3;
  if (!Number.isInteger(count) || rays.direction.length !== 3 * count) {
    throw new RangeError("relativeFocus: the points and the directions are not of one set of rays");
  }
  if (rays.valid !== undefined && rays.valid.length !== count) {
    throw new RangeError(`relativeFocus: the validity is of ${rays.valid.length} rays, the set of ${count}`);
  }
  for (const ray of [chief, ...members]) {
    if (!(Number.isInteger(ray) && ray >= 0 && ray < count)) {
      throw new RangeError(`relativeFocus: ${ray} is no ray of a set of ${count}`);
    }
  }
  const unavailable = (reason: FocusReason, message: string): RelativeFocus => ({ available: false, reason, message });
  const taken = (ray: number): boolean => rays.valid === undefined || rays.valid[ray] !== 0;
  const at = componentOf(axis);
  const finite = (ray: number): boolean =>
    [0, 1, 2].every((part) => Number.isFinite(rays.landing[3 * ray + part])) &&
    [0, 1, 2].every((part) => Number.isFinite(rays.direction[3 * ray + part]));
  if (!taken(chief)) return unavailable("no-reference", `the chief ray, ray ${chief}, is not taken`);
  if (!finite(chief)) return unavailable("bad-ray", `the chief ray, ray ${chief}, is not finite numbers`);
  const slopeOf = (ray: number): Pair => quotient(rays.direction[3 * ray + at], rays.direction[3 * ray + 2]);
  const reference = slopeOf(chief);
  if (!Number.isFinite(reference.value) || !Number.isFinite(reference.rest)) {
    return unavailable("out-of-range", `the chief ray, ray ${chief}, has no finite ${axis} slope`);
  }
  const moments = pairSum();
  const weights = pairSum();
  let taking = 0;
  for (const ray of members) {
    if (!taken(ray)) continue;
    if (!finite(ray)) return unavailable("bad-ray", `ray ${ray} is taken and is not finite numbers`);
    const slope = slopeOf(ray);
    if (!Number.isFinite(slope.value) || !Number.isFinite(slope.rest)) {
      return unavailable("out-of-range", `ray ${ray} has no finite ${axis} slope`);
    }
    const coordinate = difference(rays.landing[3 * ray + at], rays.landing[3 * chief + at]);
    const relativeSlope = pairDifference(slope, reference);
    moments.add(coordinate, relativeSlope);
    weights.add(relativeSlope, relativeSlope);
    taking++;
  }
  if (taking === 0) return unavailable("no-rays", `no ray of the ${axis} fan is taken`);
  const [moment, weight] = [moments.parts(), weights.parts()];
  if (!Number.isFinite(moment.value) || !Number.isFinite(weight.value)) {
    return unavailable("out-of-range", `a sum of the ${axis} focus is no finite number`);
  }
  if (weight.value === 0) {
    return unavailable("no-slope", `the ${taking} rays of the ${axis} fan taken run parallel to the chief ray`);
  }
  const shiftMm = -pairQuotient(moment, weight);
  const rmsSlope = Math.sqrt(weight.value / taking);
  if (!Number.isFinite(shiftMm) || !Number.isFinite(rmsSlope)) {
    return unavailable("out-of-range", `the ${axis} focus is no finite number`);
  }
  return { available: true, shiftMm, rmsSlope, rays: taking };
}
