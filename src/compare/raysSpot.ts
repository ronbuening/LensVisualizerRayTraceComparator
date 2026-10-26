// The comparator of `rays.trace` for rung R7a: the spot and the ray fan of the same rays in two engines. One
// estimator, the comparator's own (src/estimators/spot.ts), is applied to where each engine lands the rays a tab of
// LensVisualizer launches (its coma point cloud, its two coma fans, a bokeh tile), on the rays both engines bring to
// the image, relative to each engine's own landing of the chief ray, as the tabs present them; the two spots are
// then set against each other, ray by ray and as a whole. Which rays got through is judged here too, as R2 judges
// it: no other rung traces these rays.
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { estimateSpot } from "../estimators/spot.ts";
import type { SpotEstimate, SpotRays, SpotUnavailable } from "../estimators/spot.ts";
import { intersectValidity, maskWhere } from "../estimators/validity.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { maskMetrics, rayEndings, tracedSurfaces } from "./raysGeometry.ts";
import { decodeTrace, placeOf } from "./raysRead.ts";
import type { DecodedTrace } from "./raysRead.ts";

/** The rung of the spot and the ray fan on identical rays. */
export const SPOT_RAYS_RUNG = "r7a";

/** The figures of a spot, in the order the comparator reports them. */
const SPOT_FIGURES = ["transverseError.maxAbs", "centroid.maxAbs", "rmsRadius.maxAbs"] as const;

/**
 * The reasons of the estimator that say two answers have no spot to compare: no chief ray both landed, no ray but
 * the chief that both landed, no flux in those. Any other reason is a defect of an answer or of the request.
 */
const NOTHING_TO_MEASURE: readonly SpotUnavailable["reason"][] = ["no-reference", "no-rays", "no-flux"];

/** The rays of one answer as the estimator reads them: the request's weights, the answer's landings. */
function spotRays(trace: DecodedTrace, weight: Float64Array, valid: Uint8Array, chief: number): SpotRays {
  const x = new Float64Array(trace.rays);
  const y = new Float64Array(trace.rays);
  for (let ray = 0; ray < trace.rays; ray++) {
    x[ray] = trace.imagePoint[3 * ray];
    y[ray] = trace.imagePoint[3 * ray + 1];
  }
  return { x, y, weight, valid, chief };
}

/** The weights of a request and the index of its chief ray, or why a spot of it has no reference. */
function setOf(spec: JsonObject | undefined, rays: number): { weight: Float64Array; chief: number } | string {
  if (spec === undefined) return "the spec of the request is not at hand: it says which ray is the chief ray";
  const { weights, groups } = spec as RaysTraceSpec;
  const chief = groups?.chiefIndex;
  if (chief === undefined) return "the set states no chief ray: a spot of a tab is relative to it";
  const weight = decodeNdArray(weights).values as Float64Array;
  if (weight.length !== rays) return `the request is of ${weight.length} rays, and the answers are for ${rays}`;
  if (chief >= rays) return `the chief ray ${chief} is no ray of a set of ${rays}`;
  return { weight, chief };
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [decodeTrace(dataA), decodeTrace(dataB)];
  const surfaces = tracedSurfaces(a, b, context);
  if ("reason" in surfaces) return { comparable: false, reason: surfaces.reason };
  const set = setOf(context?.spec, a.rays);
  if (typeof set === "string") return { comparable: false, reason: set };
  const place = placeOf(context?.spec);

  // The rays both engines brought to the image: the only ones either spot is of.
  const valid = intersectValidity([maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)]);
  let dropped = 0;
  let firstDropped = -1;
  for (let ray = 0; ray < a.rays; ray++) {
    if ((a.status[ray] === RAY_STATUS.ok) === (b.status[ray] === RAY_STATUS.ok)) continue;
    if (dropped++ === 0) firstDropped = ray;
  }
  const [mismatches, rimBand] = maskMetrics(a, b, surfaces, place);
  const [spotA, spotB] = [
    estimateSpot(spotRays(a, set.weight, valid, set.chief)),
    estimateSpot(spotRays(b, set.weight, valid, set.chief)),
  ];
  const counts: ComputedMetric[] = [
    mismatches,
    rimBand,
    { name: "rays.compared", value: spotA.available ? spotA.rays : 0 },
    { name: "rays.dropped", value: dropped, ...(dropped === 0 ? {} : { where: { ...place, ray: firstDropped } }) },
  ];
  const missing = [spotA, spotB].find((spot): spot is SpotUnavailable => !spot.available);
  if (missing !== undefined) {
    const said = `${missing.reason}: ${missing.message}`;
    if (!NOTHING_TO_MEASURE.includes(missing.reason)) return { comparable: false, reason: `no spot: ${said}` };
    const unmeasured = SPOT_FIGURES.map((name) => ({ name, reason: said }));
    return { comparable: true, metrics: counts, unmeasured };
  }
  const [first, second] = [spotA as SpotEstimate, spotB as SpotEstimate];

  // Ray by ray: the transverse error of each ray taken, relative to each engine's own chief ray, along x and y.
  let error: ComputedMetric = { name: SPOT_FIGURES[0], value: 0 };
  let found = false;
  for (let ray = 0; ray < a.rays; ray++) {
    if (ray === set.chief || valid[ray] === 0) continue;
    const value = Math.max(
      Math.abs(first.errorX[ray] - second.errorX[ray]),
      Math.abs(first.errorY[ray] - second.errorY[ray]),
    );
    // The first of equal values is kept.
    if (!found || value > error.value) error = { name: SPOT_FIGURES[0], value, where: { ...place, ray } };
    found = true;
  }
  const centroid = Math.max(
    Math.abs(first.centroid.x - second.centroid.x),
    Math.abs(first.centroid.y - second.centroid.y),
  );
  return {
    comparable: true,
    metrics: [
      error,
      { name: SPOT_FIGURES[1], value: centroid, where: place },
      { name: SPOT_FIGURES[2], value: Math.abs(first.rmsRadius - second.rmsRadius), where: place },
      ...counts,
    ],
  };
}

/**
 * What one answer reports beside what is compared: how many of its rays ended in each way (as R2 records them),
 * and the spot the estimator makes of its own rays that landed, on its own: the centroid relative to its chief ray
 * and the RMS radius, NaN where the estimator has none. Written down, never judged.
 */
function recorded(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] } {
  const trace = decodeTrace(data);
  const set = setOf(context?.spec, trace.rays);
  const spot =
    typeof set === "string"
      ? null
      : estimateSpot(spotRays(trace, set.weight, maskWhere(trace.status, RAY_STATUS.ok), set.chief));
  const figures = spot?.available === true ? spot : null;
  return {
    ...rayEndings(data),
    "spot.centroidX": [figures?.centroid.x ?? Number.NaN],
    "spot.centroidY": [figures?.centroid.y ?? Number.NaN],
    "spot.rmsRadius": [figures?.rmsRadius ?? Number.NaN],
  };
}

/**
 * The comparator of `rays.trace` for rung R7a: the spot and the ray fan of the same rays in two engines.
 *
 * - **The rays** are a set of a tab of LensVisualizer, its pupil samples and its chief ray (`groups.chiefIndex`),
 *   and a spot is of the ones that are ok in both answers: a ray one engine did not bring to the image is in
 *   neither spot. Which rays those are is judged here as R2 judges it (`mask.mismatches`, `mask.rimBand`).
 * - **The landing** of a ray is the engine's own `imagePoint`, on the image plane of the case.
 * - **The reference** of each engine's spot is its own landing of the chief ray, as the tabs draw them.
 * - **The flux** of a ray is its weight in the request, the same for both engines.
 *
 * Metrics, of the rays taken (the chief ray not among them):
 *
 * - `transverseError.maxAbs`: the largest difference of a ray's transverse error, along x or y, mm, with the `ray`
 *   in `where`, the first on a tie: the fan of a fan, the spot of a spot, point by point;
 * - `centroid.maxAbs`: the larger difference of the two centroids along x and along y, mm;
 * - `rmsRadius.maxAbs`: the difference of the two RMS radii about the centroids, mm;
 * - `mask.mismatches` and `mask.rimBand`: as R2's;
 * - `rays.compared`: the rays the spots are of; `rays.dropped`: the rays that are ok in one answer and not in the
 *   other, with the `ray` of the first in `where`.
 *
 * The three figures of a spot are not measured where no chief ray is ok in both answers, where no other ray is, or
 * where those carry no flux. Not comparable: without the case or the spec of the request; answers for different
 * numbers of rays or surfaces; a set without a chief ray; whatever else leaves the estimator without a value (a
 * landing of an ok ray that is no finite point, a weight that is no number).
 */
export const raysSpotComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: SPOT_RAYS_RUNG,
  metrics: Object.freeze([
    { name: "transverseError.maxAbs", unit: "mm" },
    { name: "centroid.maxAbs", unit: "mm" },
    { name: "rmsRadius.maxAbs", unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
  ]),
  compare,
  recorded,
});
