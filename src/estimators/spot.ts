// The spot of a bundle on the image plane, from where its rays land and nothing else: the comparator's own
// estimator of what LensVisualizer's coma and bokeh tabs present, applied alike to every engine's trace of the same
// rays.
//
// One ray of the bundle is its chief ray, the reference: every figure is relative to where it lands, as the tabs'
// are. Of every other ray that is taken:
//
//   transverse error  e_i = p_i - p_chief                     (x sagittal, y tangential, mm)
//   centroid          c   = sum of w_i e_i / sum of w_i       (relative to the chief ray)
//   RMS radius        r   = sqrt( sum of w_i |e_i - c|^2 / sum of w_i )
//
// with p_i a ray's landing on the image plane and w_i the flux it stands for. The chief ray is a reference and no
// sample: it is in no sum, whatever its weight. A ray of weight 0 adds nothing to the centroid or the radius, but
// it has a transverse error like any ray that is taken; a fan has no weights of its own and is handed 1 for each.
//
// Arithmetic. Only IEEE 754 basic operations are used (+, -, *, / and the square root, each correctly rounded), in
// the order of the rays, so a result is the same bits on every platform:
//
// - A transverse error is the difference of two landings rounded once. What that rounding leaves out is kept
//   (`twoSumError`) and enters the centroid and the deviations, so both are of the exact differences.
// - The sums of the centroid can cancel, a ray on one side of the chief against one on the other, and are
//   compensated (`createExactSum`): each is within one rounding of the sum taken exactly, and so is the flux.
// - The centroid is carried in two doubles: a first value c, the compensated sum of w e over the flux, and what c
//   leaves out of the centroid of the exact differences, a compensated sum of w (e + rest - c) over the flux. A
//   spot far smaller than its distance from the chief ray needs both: there the rests, and the rounding of c, half
//   a step of the doubles near that distance, can be larger than the spot.
// - The radius is a sum of squares, which cannot cancel; it is compensated too, and each deviation is taken from
//   the exact difference and the centroid in two doubles. It is within a few roundings of the definition above
//   taken exactly.
import { createExactSum, twoSumError } from "../core/numeric/exact.ts";

/** The rays of one bundle where they land, one element a ray in each array, and which of them is the chief ray. */
export interface SpotRays {
  /** Landing along image x, mm: the sagittal direction. */
  readonly x: ArrayLike<number>;
  /** Landing along image y, mm: the tangential direction, in whose plane the field lies. */
  readonly y: ArrayLike<number>;
  /** The flux each ray stands for; at least 0. */
  readonly weight: ArrayLike<number>;
  /**
   * Which rays are taken: an element that is 0 leaves its ray out, whatever its landing and weight are (those of a
   * ray that did not arrive are NaN). Without it every ray is taken. See `intersectValidity`.
   */
  readonly valid?: ArrayLike<number>;
  /** The index of the chief ray: the reference every figure is relative to. It must be taken. */
  readonly chief: number;
}

/** Why a spot could not be estimated. */
export type SpotUnavailableReason =
  /** The chief ray is not taken, or its landing is no finite point: there is nothing to be relative to. */
  | "no-reference"
  /** A ray that is taken has a landing that is not a finite point. */
  | "bad-landing"
  /** A ray that is taken has a weight that is not a finite number of at least 0. */
  | "bad-weight"
  /** No ray but the chief ray is taken. */
  | "no-rays"
  /** The rays taken carry no flux: every one has the weight 0. */
  | "no-flux"
  /** A sum is not a finite number. */
  | "out-of-range";

/** A spot that could not be estimated, and why. Nothing of it is a number. */
export interface SpotUnavailable {
  readonly available: false;
  readonly reason: SpotUnavailableReason;
  /** The reason in words, with the ray it is about. */
  readonly message: string;
  /** The ray the reason is about, where it is about one: its index in the bundle. */
  readonly ray?: number;
}

/** A point, or a displacement, of the image plane, mm. */
export interface SpotPoint {
  readonly x: number;
  readonly y: number;
}

/** The spot of a bundle. */
export interface SpotEstimate {
  readonly available: true;
  /** Where the chief ray lands: the reference. */
  readonly chief: SpotPoint;
  /** The flux-weighted centroid of the rays taken, relative to the chief ray. */
  readonly centroid: SpotPoint;
  /** The flux-weighted RMS distance of the rays taken from their centroid. */
  readonly rmsRadius: number;
  /**
   * The transverse error of every ray, relative to the chief ray, one element a ray: NaN for a ray that is not
   * taken, and 0 for the chief ray itself.
   */
  readonly errorX: Float64Array;
  readonly errorY: Float64Array;
  /** How many rays the figures are of: the rays taken, the chief ray not counted. */
  readonly rays: number;
  /** The flux of those rays. */
  readonly flux: number;
}

function unavailable(reason: SpotUnavailableReason, message: string, ray?: number): SpotUnavailable {
  return { available: false, reason, message, ...(ray === undefined ? {} : { ray }) };
}

/**
 * The spot of a bundle: the chief ray's landing, the transverse error of every ray taken, their centroid and their
 * RMS radius, as defined above. What cannot be computed is an outcome with a reason (`SpotUnavailable`), never a
 * NaN: the chief ray not taken or not landed (`no-reference`), a ray taken whose landing is no finite point
 * (`bad-landing`) or whose weight is no finite number of at least 0 (`bad-weight`), no ray taken but the chief
 * (`no-rays`), no flux (`no-flux`), a sum that overflows (`out-of-range`). Arrays of unequal length, and a chief
 * index that is no ray of them, throw a RangeError: they are not of one bundle. A pure function.
 */
export function estimateSpot(rays: SpotRays): SpotEstimate | SpotUnavailable {
  const { x, y, weight, valid, chief } = rays;
  const count = x.length;
  if (y.length !== count || weight.length !== count || (valid !== undefined && valid.length !== count)) {
    throw new RangeError(`estimateSpot: the arrays are of ${count} rays and do not agree in length`);
  }
  if (!Number.isInteger(chief) || chief < 0 || chief >= count) {
    throw new RangeError(`estimateSpot: the chief ray ${chief} is no ray of a bundle of ${count}`);
  }
  const taken = (ray: number): boolean => valid === undefined || valid[ray] !== 0;
  const [chiefX, chiefY] = [x[chief], y[chief]];
  if (!taken(chief) || !Number.isFinite(chiefX) || !Number.isFinite(chiefY)) {
    return unavailable("no-reference", `the chief ray ${chief} is not taken or has no landing`, chief);
  }

  const errorX = new Float64Array(count).fill(Number.NaN);
  const errorY = new Float64Array(count).fill(Number.NaN);
  // What the rounding of each difference left out: the exact difference is the error plus its rest.
  const restX = new Float64Array(count);
  const restY = new Float64Array(count);
  errorX[chief] = 0;
  errorY[chief] = 0;
  const flux = createExactSum();
  const sumX = createExactSum();
  const sumY = createExactSum();
  let samples = 0;
  for (let ray = 0; ray < count; ray++) {
    if (ray === chief || !taken(ray)) continue;
    const [px, py, w] = [x[ray], y[ray], weight[ray]];
    if (!Number.isFinite(px) || !Number.isFinite(py)) {
      return unavailable("bad-landing", `ray ${ray} is taken and its landing is no finite point`, ray);
    }
    if (!Number.isFinite(w) || !(w >= 0)) {
      return unavailable(
        "bad-weight",
        `ray ${ray} is taken and its weight ${w} is no finite number of at least 0`,
        ray,
      );
    }
    const ex = px - chiefX;
    const ey = py - chiefY;
    errorX[ray] = ex;
    errorY[ray] = ey;
    restX[ray] = twoSumError(px, -chiefX, ex);
    restY[ray] = twoSumError(py, -chiefY, ey);
    flux.add(w, 1);
    sumX.add(w, ex);
    sumY.add(w, ey);
    samples++;
  }
  if (samples === 0) return unavailable("no-rays", "no ray but the chief ray is taken");
  const total = flux.value();
  if (!(total > 0)) return unavailable("no-flux", `the ${samples} rays taken carry no flux`);
  const first = { x: sumX.value() / total, y: sumY.value() / total };
  if (!Number.isFinite(total) || !Number.isFinite(first.x) || !Number.isFinite(first.y)) {
    return unavailable("out-of-range", "a sum of the centroid is not a finite number");
  }
  // What the first centroid leaves out of the centroid of the exact differences: the sum of w (e + rest - c).
  const leftX = createExactSum();
  const leftY = createExactSum();
  for (let ray = 0; ray < count; ray++) {
    if (ray === chief || !taken(ray)) continue;
    const w = weight[ray];
    leftX.add(w, errorX[ray]);
    leftX.add(w, restX[ray]);
    leftX.add(w, -first.x);
    leftY.add(w, errorY[ray]);
    leftY.add(w, restY[ray]);
    leftY.add(w, -first.y);
  }
  const rest = { x: leftX.value() / total, y: leftY.value() / total };
  const centroid = { x: first.x + rest.x, y: first.y + rest.y };

  // The deviation of each ray from the centroid, from its exact difference and the centroid in two doubles.
  const squares = createExactSum();
  for (let ray = 0; ray < count; ray++) {
    if (ray === chief || !taken(ray)) continue;
    const w = weight[ray];
    if (w === 0) continue;
    const dx = errorX[ray] - first.x + (restX[ray] - rest.x);
    const dy = errorY[ray] - first.y + (restY[ray] - rest.y);
    squares.add(w * dx, dx);
    squares.add(w * dy, dy);
  }
  const rmsRadius = Math.sqrt(squares.value() / total);
  if (!Number.isFinite(rmsRadius)) return unavailable("out-of-range", "the sum of the RMS radius is no finite number");
  return {
    available: true,
    chief: { x: chiefX, y: chiefY },
    centroid,
    rmsRadius,
    errorX,
    errorY,
    rays: samples,
    flux: total,
  };
}
