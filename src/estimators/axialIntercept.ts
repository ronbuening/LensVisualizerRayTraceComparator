// Where a ray parallel to the axis crosses it behind the system, from where it leaves the last surface and nothing
// else: the comparator's own estimator of what LensVisualizer's spherical-aberration and axial-colour sections present,
// applied alike to every engine's trace of the same rays.
//
// A ray in the meridional plane (x = 0 and no x in its direction) that leaves the last surface at (0, y, z) along the
// unit direction (0, m, n) crosses the axis at
//
//   intercept   z* = z - y n / m                 (mm, the contract frame)
//   slope       u  = m / n                       (dy/dz behind the system)
//   height      h(Z) = u (Z - z*)                (mm, where the ray is on the plane at Z)
//
// and of a bundle of such rays, each taken with its mirror image, the least-squares focus is the plane where the sum
// of the squared heights is least, which is the mean of the intercepts weighted by the squared slopes:
//
//   focus       Zf = sum of u_i^2 z*_i / sum of u_i^2
//   RMS         sqrt( sum of h_i(Zf)^2 / N )
//
// LensVisualizer's spherical-aberration section presents these of its profile's pairs (`bestFocusPlane`, `rmsAtPlane`
// in shared.ts), its near-axis pair's and its marginal pair's intercepts and their difference, and the height of each
// zone at the focus relative to the near-axis ray's; its axial-colour section presents the intercept of one marginal
// ray at each line (`computeChromaticRayFanSpread`). `sphericalFigures` and `colourFigures` form the same figures.
//
// Arithmetic. Only IEEE 754 basic operations are used (+, -, *, / and the square root, each correctly rounded), in
// the order of the rays, so a result is the same bits on every platform:
//
// - An intercept is z - y n / m formed in twice the precision (`twoProductError`, `twoSumError`: the product y n
//   exactly, the quotient with its remainder) and rounded once: it is within half a unit in its last place, and
//   2^-100 of the exact value besides, of the intercept of the doubles it is given.
// - The focus is formed about the first intercept taken, z0, as z0 + sum of u^2 (z - z0) / sum of u^2: the sum of the
//   moments can cancel, rays on both sides of z0, and is compensated (`createExactSum`) over the exact squares and the
//   exact differences, so the focus is within one rounding of the focus of the intercepts and slopes it is given,
//   and a little more. The sums of squares cannot cancel; they are compensated too, each square with its rest, so the
//   weight and the sum of the squared heights are each their exact sum rounded once.
// - An intercept or a slope that is no finite double (an overflow of y n / m, or of m / n) is `out-of-range`: an
//   outcome with a reason, never a NaN or an infinity handed on.
// - A height is the slope times the difference of the plane and the intercept, formed with the rests of the
//   difference and of the product and rounded once.
import { createExactSum, twoProductError, twoSumError } from "../core/numeric/exact.ts";

/** Why a ray has no intercept. */
export type InterceptReason =
  /** The ray is not taken: it did not arrive in one of the answers the figure is of. */
  | "not-taken"
  /** Its exit point or direction is not finite numbers. */
  | "bad-exit"
  /** It leaves the meridional plane (x or the x of its direction is not 0): it never crosses the axis. */
  | "skew"
  /** It runs parallel to the axis away from it (no y in its direction, y not 0): it never crosses the axis. */
  | "parallel"
  /** It runs along the axis itself (no y in its direction, y 0): every point of it is on the axis. */
  | "on-axis"
  /**
   * Its intercept or its slope is no finite double: it crosses the axis further away than the doubles reach, or runs
   * across it at right angles (no z in its direction).
   */
  | "out-of-range";

/** A ray's crossing of the axis, or why it has none. */
export type AxialIntercept =
  | { readonly available: true; readonly z: number; readonly slope: number }
  | { readonly available: false; readonly reason: InterceptReason };

/**
 * The intercept and the slope of one ray (see above), or why it has none: a ray off the meridional plane (`skew`),
 * one that never crosses the axis (`parallel`) or lies on it (`on-axis`), an exit that is not finite numbers
 * (`bad-exit`), and an intercept or a slope that is no finite double (`out-of-range`): a ray of so small a slope that
 * its crossing overflows, and one whose direction has no z, which runs across the axis at right angles.
 */
export function axialIntercept(point: ArrayLike<number>, direction: ArrayLike<number>): AxialIntercept {
  const [x, y, z] = [point[0], point[1], point[2]];
  const [l, m, n] = [direction[0], direction[1], direction[2]];
  if (![x, y, z, l, m, n].every(Number.isFinite)) return { available: false, reason: "bad-exit" };
  if (x !== 0 || l !== 0) return { available: false, reason: "skew" };
  if (m === 0) return { available: false, reason: y === 0 ? "on-axis" : "parallel" };
  // y n exactly, as a double and its rest.
  const product = y * n;
  const productRest = twoProductError(y, n, product);
  // The quotient (y n) / m: a first double and the quotient of what it leaves of the product.
  const quotient = product / m;
  const back = quotient * m;
  const remainder = product - back - twoProductError(quotient, m, back) + productRest;
  const quotientRest = remainder / m;
  // z - quotient, with the rest of that difference, less the rest of the quotient: rounded once.
  const difference = z - quotient;
  const intercept = difference + (twoSumError(z, -quotient, difference) - quotientRest);
  const slope = m / n;
  // An overflow anywhere above leaves an infinity or a NaN here: never a figure of a ray.
  if (!Number.isFinite(intercept) || !Number.isFinite(slope)) return { available: false, reason: "out-of-range" };
  return { available: true, z: intercept, slope };
}

/** The rays of one set where they leave the last surface, as the estimator reads them. */
export interface AxialRays {
  /** x, y, z of each ray's exit point, mm: `[n, 3]`, flat. */
  readonly exitPoint: ArrayLike<number>;
  /** The unit direction of each ray behind the last surface: `[n, 3]`, flat. */
  readonly exitDirection: ArrayLike<number>;
  /** Which rays are taken: an element that is 0 leaves its ray out. Without it every ray is taken. */
  readonly valid?: ArrayLike<number>;
}

/** The intercepts of a set of rays: one element a ray in each array, NaN where `reason` says why there is none. */
export interface AxialInterceptSet {
  readonly z: Float64Array;
  readonly slope: Float64Array;
  /** Null for a ray that has an intercept. */
  readonly reason: readonly (InterceptReason | null)[];
}

/** The intercept of every ray of a set (`axialIntercept`), `not-taken` for a ray the set leaves out. */
export function axialIntercepts(rays: AxialRays): AxialInterceptSet {
  const count = rays.exitPoint.length / 3;
  if (!Number.isInteger(count) || rays.exitDirection.length !== 3 * count) {
    throw new RangeError("axialIntercepts: the exit points and directions are not of one set of rays");
  }
  if (rays.valid !== undefined && rays.valid.length !== count) {
    throw new RangeError(`axialIntercepts: the validity is of ${rays.valid.length} rays, the set of ${count}`);
  }
  const z = new Float64Array(count).fill(Number.NaN);
  const slope = new Float64Array(count).fill(Number.NaN);
  const reason: (InterceptReason | null)[] = [];
  const of = (array: ArrayLike<number>, ray: number): number[] => [
    array[3 * ray],
    array[3 * ray + 1],
    array[3 * ray + 2],
  ];
  for (let ray = 0; ray < count; ray++) {
    if (rays.valid !== undefined && rays.valid[ray] === 0) {
      reason.push("not-taken");
      continue;
    }
    const crossing = axialIntercept(of(rays.exitPoint, ray), of(rays.exitDirection, ray));
    if (!crossing.available) {
      reason.push(crossing.reason);
      continue;
    }
    z[ray] = crossing.z;
    slope[ray] = crossing.slope;
    reason.push(null);
  }
  return { z, slope, reason };
}

/**
 * The height of a ray of intercept `z` and slope `slope` on the plane at `plane`, `slope (plane - z)`, formed in twice
 * the precision (the difference with its rest, the product with its rest) and rounded once.
 */
export function heightAt(z: number, slope: number, plane: number): number {
  const difference = plane - z;
  const differenceRest = twoSumError(plane, -z, difference);
  const product = slope * difference;
  return product + (twoProductError(slope, difference, product) + slope * differenceRest);
}

/** Why a bundle has no focus. */
export type FocusReason =
  /** No ray of the bundle is taken. */
  | "no-rays"
  /** Every ray taken is parallel to the axis behind the system: no plane is better than another. */
  | "no-slope"
  /** A sum is not a finite number. */
  | "out-of-range";

/** The least-squares focus of a bundle, or why it has none. */
export type AxialFocus =
  | {
      readonly available: true;
      /** The focus Zf, mm. */
      readonly z: number;
      /** The RMS height of the rays taken on the plane of the focus, mm. */
      readonly rmsMm: number;
      /** The largest height there, mm. */
      readonly peakMm: number;
      /** The RMS of the slopes of the rays taken: the transverse scale of a shift of the focus. */
      readonly rmsSlope: number;
      /** How many rays it is of. */
      readonly rays: number;
    }
  | { readonly available: false; readonly reason: FocusReason; readonly message: string };

/**
 * The least-squares focus of the rays `taken` of a set of intercepts, and the RMS and the largest of their heights on
 * its plane (see above). A ray that is taken must have an intercept; one without throws a RangeError, since it is no
 * ray of a focus. What cannot be computed is an outcome with a reason: no ray taken (`no-rays`), no slope in any
 * (`no-slope`), a sum that overflows (`out-of-range`).
 */
export function leastSquaresFocus(set: AxialInterceptSet, taken: ArrayLike<number>): AxialFocus {
  const count = set.z.length;
  if (taken.length !== count) throw new RangeError(`leastSquaresFocus: ${taken.length} flags for ${count} rays`);
  // The focus is formed about the intercept of the first ray taken, z0: Zf = z0 + sum of u^2 (z - z0) / sum of u^2.
  // The second sum can cancel, and is taken of the exact squares and the exact differences.
  const weights = createExactSum();
  const moments = createExactSum();
  let reference = Number.NaN;
  let rays = 0;
  for (let ray = 0; ray < count; ray++) {
    if (taken[ray] === 0) continue;
    if (set.reason[ray] !== null) throw new RangeError(`leastSquaresFocus: ray ${ray} is taken and has no intercept`);
    const [u, z] = [set.slope[ray], set.z[ray]];
    if (rays === 0) reference = z;
    const square = u * u;
    const squareRest = twoProductError(u, u, square);
    const difference = z - reference;
    const differenceRest = twoSumError(z, -reference, difference);
    weights.add(u, u);
    moments.add(square, difference);
    moments.add(square, differenceRest);
    // The product of the two rests is below every rounding of the sum, and is left out.
    moments.add(squareRest, difference);
    rays++;
  }
  if (rays === 0) return { available: false, reason: "no-rays", message: "no ray of the set is taken" };
  const weight = weights.value();
  if (weight === 0) {
    return { available: false, reason: "no-slope", message: `the ${rays} rays taken are parallel to the axis` };
  }
  const focus = reference + moments.value() / weight;
  const squares = createExactSum();
  let peakMm = 0;
  for (let ray = 0; ray < count; ray++) {
    if (taken[ray] === 0) continue;
    const height = heightAt(set.z[ray], set.slope[ray], focus);
    squares.add(height, height);
    peakMm = Math.max(peakMm, Math.abs(height));
  }
  const rmsMm = Math.sqrt(squares.value() / rays);
  const rmsSlope = Math.sqrt(weight / rays);
  if (![focus, rmsMm, peakMm, rmsSlope].every(Number.isFinite)) {
    return { available: false, reason: "out-of-range", message: "a sum of the focus is no finite number" };
  }
  return { available: true, z: focus, rmsMm, peakMm, rmsSlope, rays };
}

/**
 * Which rays of a set of mirror pairs are taken as a pair: ray `2k` and ray `2k + 1` are taken together, only where
 * both have an intercept, as LensVisualizer drops a zone whose plus or minus ray fails (`computeSymmetricRealSample`,
 * the profile of `computeSphericalAberration`). A set of an odd number of rays throws a RangeError.
 */
export function pairsTaken(set: AxialInterceptSet): Uint8Array {
  const count = set.z.length;
  if (count % 2 !== 0) throw new RangeError(`pairsTaken: a set of ${count} rays is not of pairs`);
  const taken = new Uint8Array(count);
  for (let pair = 0; pair < count; pair += 2) {
    const both = set.reason[pair] === null && set.reason[pair + 1] === null ? 1 : 0;
    taken[pair] = both;
    taken[pair + 1] = both;
  }
  return taken;
}

/**
 * The mean of two doubles, rounded once: half their rounded sum, since halving a double is exact (away from the
 * smallest doubles) and so rounding the sum and then halving it is rounding the mean.
 */
export function meanOfTwo(a: number, b: number): number {
  return (a + b) / 2;
}

/**
 * The rays of one line of a spherical-aberration figure, each a pupil fraction: the signed fraction of every ray of
 * `set` (`fractions`), the near-axis fraction, the marginal candidates in the order they are tried and the profile's
 * zones. A ray at `-f` is the mirror image of the one at `f`.
 */
export interface SphericalRoles {
  readonly fractions: ArrayLike<number>;
  readonly nearAxis: number;
  readonly marginal: readonly number[];
  readonly profile: readonly number[];
}

/** What `sphericalFigures` presents of one line, as LensVisualizer's spherical-aberration section does. */
export interface SphericalFigures {
  /** The mean height of the near-axis pair on the plane `imageZ`. */
  readonly landingMm: number;
  readonly nearAxisInterceptZ: number;
  readonly marginalFraction: number;
  readonly marginalInterceptZ: number;
  readonly bestFocusZ: number;
  readonly bestFocusRmsMm: number;
  /** Each profile zone's plus ray at the focus, relative to the near-axis plus ray there; NaN without its pair. */
  readonly profileMm: Float64Array;
}

/** Why a line has no spherical-aberration figures. */
export type SphericalReason = "no-near-axis" | "no-marginal" | "no-profile" | "no-focus";

/**
 * The spherical aberration of one line from its rays' intercepts, as LensVisualizer's section defines it
 * (`computeSphericalAberration`, `computeSAProfile`): the near-axis pair's intercept, the mean of its two rays'; the
 * marginal pair's, of the first candidate whose two rays both cross the axis; the least-squares focus of the pairs
 * of the profile whose two rays both cross it, and their RMS height there; and the height of each such zone's plus
 * ray at the focus, relative to the near-axis plus ray's, which must be a zone of the profile. A fraction that is no
 * ray of the set counts as a ray that did not arrive. Null figures say which part is missing: no near-axis pair, no
 * marginal pair, fewer than two pairs of the profile (as LensVisualizer asks four hits), or no focus.
 */
export function sphericalFigures(
  set: AxialInterceptSet,
  roles: SphericalRoles,
  imageZ: number,
): { readonly figures: SphericalFigures } | { readonly reason: SphericalReason } {
  const at = new Map<number, number>();
  for (let ray = 0; ray < roles.fractions.length; ray++) at.set(roles.fractions[ray], ray);
  const crossing = (fraction: number): number | null => {
    const ray = at.get(fraction);
    return ray !== undefined && set.reason[ray] === null ? ray : null;
  };
  const pair = (fraction: number): readonly [number, number] | null => {
    const [plus, minus] = [crossing(fraction), crossing(-fraction)];
    return plus === null || minus === null ? null : [plus, minus];
  };
  const near = pair(roles.nearAxis);
  if (near === null) return { reason: "no-near-axis" };
  const marginalFraction = roles.marginal.find((fraction) => pair(fraction) !== null);
  if (marginalFraction === undefined) return { reason: "no-marginal" };
  const marginal = pair(marginalFraction)!;
  const zones = roles.profile.map((fraction) => ({ fraction, rays: pair(fraction) }));
  const taken = new Uint8Array(set.z.length);
  for (const { rays } of zones) for (const ray of rays ?? []) taken[ray] = 1;
  if (zones.filter((zone) => zone.rays !== null).length < 2) return { reason: "no-profile" };
  const focus = leastSquaresFocus(set, taken);
  const reference = zones.find((zone) => zone.fraction === roles.nearAxis)?.rays ?? null;
  if (!focus.available || reference === null) return { reason: "no-focus" };
  const referenceHeight = heightAt(set.z[reference[0]], set.slope[reference[0]], focus.z);
  const profileMm = Float64Array.from(zones, ({ rays }) =>
    rays === null ? Number.NaN : heightAt(set.z[rays[0]], set.slope[rays[0]], focus.z) - referenceHeight,
  );
  const landing = (ray: number): number => heightAt(set.z[ray], set.slope[ray], imageZ);
  return {
    figures: {
      landingMm: meanOfTwo(landing(near[0]), landing(near[1])),
      nearAxisInterceptZ: meanOfTwo(set.z[near[0]], set.z[near[1]]),
      marginalFraction,
      marginalInterceptZ: meanOfTwo(set.z[marginal[0]], set.z[marginal[1]]),
      bestFocusZ: focus.z,
      bestFocusRmsMm: focus.rmsMm,
      profileMm,
    },
  };
}

/** What `colourFigures` presents of one line, as LensVisualizer's axial-colour section does. */
export interface ColourFigures {
  /** The height of the marginal ray on the plane `imageZ`. */
  readonly landingMm: number;
  readonly marginalFraction: number;
  readonly marginalInterceptZ: number;
}

/**
 * The axial colour of the lines of a request from each line's rays' intercepts, as LensVisualizer's section defines it
 * (`computeLongitudinalChromaticFocus`): the first candidate fraction whose ray crosses the axis at two lines or more
 * (at the one line of a request of one), and at each line where it does, that ray's intercept. `fraction`, when it
 * is given, is taken in place of the first: the comparator asks an engine's rays at the fraction the other engine
 * took. A line without a crossing at the fraction is null; no fraction is null everywhere.
 */
export function colourFigures(
  lines: readonly { readonly set: AxialInterceptSet; readonly fractions: ArrayLike<number> }[],
  candidates: readonly number[],
  imageZ: number,
  fraction?: number,
): (ColourFigures | null)[] {
  const crossing = (line: (typeof lines)[number], wanted: number): number | null => {
    for (let ray = 0; ray < line.fractions.length; ray++) {
      if (line.fractions[ray] === wanted) return line.set.reason[ray] === null ? ray : null;
    }
    return null;
  };
  const enough = Math.min(2, lines.length);
  const chosen =
    fraction ?? candidates.find((wanted) => lines.filter((line) => crossing(line, wanted) !== null).length >= enough);
  return lines.map((line) => {
    if (chosen === undefined) return null;
    const ray = crossing(line, chosen);
    if (ray === null) return null;
    const { z, slope } = line.set;
    return { landingMm: heightAt(z[ray], slope[ray], imageZ), marginalFraction: chosen, marginalInterceptZ: z[ray] };
  });
}
