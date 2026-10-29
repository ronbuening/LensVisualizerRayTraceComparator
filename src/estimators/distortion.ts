// The distortion of chief-ray landings against a rectilinear reference that one of them scales: the comparator's own
// estimator of what LensVisualizer's distortion tab presents, applied alike to every engine's trace of the same rays.
//
// The tab's reference is rectilinear: a field launched at the slopes (sx, sy), dx/dz and dy/dz in object space, has
// the ideal image point s (sx, sy), where the scale s is the landing height of a near-axis probe over the probe's
// own slope u_p:
//
//   scale          s = y_p / u_p                    (mm; LensVisualizer's `-probeImageHeight / probeTan`)
//   ideal point    I = s (sx, sy) = y_p (sx / u_p, sy / u_p)
//   displacement   D = L - I                        (mm, the landing L less the ideal point)
//   percent        P = 100 (D . I) / (I . I)         (the radial distortion, of the ideal radius; on the meridian,
//                                                    LensVisualizer's `100 (real - ideal) / ideal`)
//
// The displacement is what a percentage of the ideal height is a percentage of: the percent of a ray near the axis is
// the displacement over a small ideal height, so a rung compares the displacements and shows the percents beside them.
// A displacement is a landing on the transverse scale less an ideal point, and the ideal point carries the probe's
// landing times the ray's slope over the probe's: a difference of the probe's landing enters every displacement
// amplified by that ratio (about 100 for a probe at a hundredth of the half field, more where the probe is held at
// half a degree), so the displacement is not on the transverse scale for the probe.
//
// Arithmetic. Only IEEE 754 basic operations are used (+, -, *, / and the square root, each correctly rounded), so a
// result is the same bits on every platform:
//
// - The ratio of a ray's slopes to the probe's, sx / u_p and sy / u_p, is rounded once. It is made of the request
//   alone, the same numbers for every engine that traced the rays, so its rounding is common to all of them.
// - The ideal point is the probe's landing times that ratio, exactly, a double and its rest (`twoProductError`); the
//   displacement is the landing less that double, with the rest of the difference (`twoSumError`), less the product's
//   rest, rounded once: the displacement of the doubles it is given, within half a unit in its last place and a
//   rounding of the two rests besides. Where the landing and the ideal height nearly cancel, which is a distortion
//   far smaller than the height, the product's rest is all of the difference that the plain formula loses.
// - A value that is no finite double is `out-of-range`: an outcome with a reason, never a NaN or an infinity.
import { twoProductError, twoSumError } from "../core/numeric/exact.ts";

/** Why a ray has no distortion. */
export type DistortionRayReason =
  /** The ray is not taken: it did not arrive in one of the answers the figure is of. */
  | "not-taken"
  /** It is the probe: the reference of the others, whose own distortion is not defined. */
  | "reference"
  /** Its landing is not finite numbers. */
  | "bad-landing"
  /** Its slopes are both 0: its ideal point is the axis, of no height to be a percentage of. */
  | "on-axis"
  /** A slope, an ideal point or a displacement is no finite double. */
  | "out-of-range";

/** The landings of one set of chief rays as the estimator reads them. */
export interface DistortionRays {
  /** Where each ray lands on the image plane, mm. */
  readonly x: ArrayLike<number>;
  readonly y: ArrayLike<number>;
  /** Each ray's launch slopes dx/dz and dy/dz in object space: the same for every engine that traced it. */
  readonly slopeX: ArrayLike<number>;
  readonly slopeY: ArrayLike<number>;
  /** The index of the probe, on the meridian (its x slope and its x landing 0), whose landing scales the reference. */
  readonly reference: number;
  /** Which rays are taken: an element that is 0 leaves its ray out. Without it every ray is taken. */
  readonly valid?: ArrayLike<number>;
}

/** The distortion of a set of rays, or why the set has none. */
export type DistortionEstimate =
  | {
      readonly available: true;
      /** The scale of the reference, mm: the probe's landing height over its slope. */
      readonly scaleMm: number;
      /** Each ray's ideal point, displacement and percent; NaN where `reason` says why there is none. */
      readonly idealX: Float64Array;
      readonly idealY: Float64Array;
      readonly displacementX: Float64Array;
      readonly displacementY: Float64Array;
      readonly percent: Float64Array;
      /** Null for a ray that has a distortion. */
      readonly reason: readonly (DistortionRayReason | null)[];
    }
  | {
      readonly available: false;
      /**
       * `no-reference`: the probe is not taken; `no-scale`: its landing or its slope is 0 or no finite number, or it
       * is off the meridian (an x slope or an x landing other than 0), so that it scales nothing.
       */
      readonly reason: "no-reference" | "no-scale";
      readonly message: string;
    };

/** The ideal coordinate `landing * ratio` and the displacement `coordinate - ideal`, formed as described above. */
function displaced(coordinate: number, probe: number, ratio: number): { ideal: number; displacement: number } {
  const ideal = probe * ratio;
  const idealRest = twoProductError(probe, ratio, ideal);
  const difference = coordinate - ideal;
  const differenceRest = twoSumError(coordinate, -ideal, difference);
  return { ideal, displacement: difference + (differenceRest - idealRest) };
}

/**
 * The distortion of every ray of a set against the reference its probe scales (see above), or why the set has none:
 * a probe that is not taken (`no-reference`), and one whose landing height or slope is 0 or no finite number, or
 * that is off the meridian, which scales nothing (`no-scale`). A ray without a distortion says why (`DistortionRayReason`). Throws where the arrays
 * are not of one set of rays or the probe is no ray of it.
 */
export function estimateDistortion(rays: DistortionRays): DistortionEstimate {
  const count = rays.x.length;
  if ([rays.y, rays.slopeX, rays.slopeY].some((array) => array.length !== count)) {
    throw new RangeError("estimateDistortion: the landings and the slopes are not of one set of rays");
  }
  if (rays.valid !== undefined && rays.valid.length !== count) {
    throw new RangeError(`estimateDistortion: the validity is of ${rays.valid.length} rays, the set of ${count}`);
  }
  const reference = rays.reference;
  if (!Number.isInteger(reference) || reference < 0 || reference >= count) {
    throw new RangeError(`estimateDistortion: the probe ${reference} is no ray of a set of ${count}`);
  }
  if (rays.valid !== undefined && rays.valid[reference] === 0) {
    return { available: false, reason: "no-reference", message: `the probe, ray ${reference}, is not taken` };
  }
  // The reference is rectilinear about the meridian: the probe's x slope and x landing are 0, as a meridional launch
  // of every engine keeps them. A probe off the meridian would scale the two coordinates by a ratio neither has.
  const [probeX, probeSlopeX] = [rays.x[reference], rays.slopeX[reference]];
  if (probeSlopeX !== 0 || probeX !== 0) {
    return {
      available: false,
      reason: "no-scale",
      message: `the probe, ray ${reference}, is off the meridian: its x slope is ${probeSlopeX}, and it lands at x = ${probeX} mm`,
    };
  }
  const probe = rays.y[reference];
  const probeSlope = rays.slopeY[reference];
  const scaleMm = probe / probeSlope;
  if (!Number.isFinite(probe) || probe === 0 || !Number.isFinite(probeSlope) || probeSlope === 0) {
    return {
      available: false,
      reason: "no-scale",
      message: `the probe, ray ${reference}, lands at ${probe} mm with the slope ${probeSlope}`,
    };
  }
  if (!Number.isFinite(scaleMm)) {
    return { available: false, reason: "no-scale", message: `the probe's scale ${scaleMm} is no finite number` };
  }
  const nan = () => new Float64Array(count).fill(Number.NaN);
  const [idealX, idealY, displacementX, displacementY, percent] = [nan(), nan(), nan(), nan(), nan()];
  const reason: (DistortionRayReason | null)[] = [];
  for (let ray = 0; ray < count; ray++) {
    if (ray === reference) {
      reason.push("reference");
      continue;
    }
    if (rays.valid !== undefined && rays.valid[ray] === 0) {
      reason.push("not-taken");
      continue;
    }
    const [x, y, sx, sy] = [rays.x[ray], rays.y[ray], rays.slopeX[ray], rays.slopeY[ray]];
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      reason.push("bad-landing");
      continue;
    }
    if (sx === 0 && sy === 0) {
      reason.push("on-axis");
      continue;
    }
    const [along, across] = [displaced(x, probe, sx / probeSlope), displaced(y, probe, sy / probeSlope)];
    const radius = along.ideal * along.ideal + across.ideal * across.ideal;
    const radial = (100 * (along.displacement * along.ideal + across.displacement * across.ideal)) / radius;
    const values = [along.ideal, across.ideal, along.displacement, across.displacement, radial];
    // An overflow anywhere above leaves an infinity or a NaN here: never a figure of a ray.
    if (!values.every(Number.isFinite)) {
      reason.push("out-of-range");
      continue;
    }
    idealX[ray] = along.ideal;
    idealY[ray] = across.ideal;
    displacementX[ray] = along.displacement;
    displacementY[ray] = across.displacement;
    percent[ray] = radial;
    reason.push(null);
  }
  return { available: true, scaleMm, idealX, idealY, displacementX, displacementY, percent, reason };
}
