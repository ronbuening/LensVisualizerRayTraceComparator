// The comparator of `rays.trace` for rung R3: the optical path of the same rays in two engines, in waves of the
// line they were traced at. It reads the rays that are ok in both answers; which rays those are is rung R2's matter.
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import type { ComparatorOutcome, ComparisonContext, QuantityComparator, UnmeasuredMetric } from "./comparator.ts";
import { NO_COMMON_RAY } from "./raysGeometry.ts";
import { decodeTrace, differentRays, noWorst, okInBoth, placeOf, takeWorst, whereOf } from "./raysRead.ts";

/** Millimetres in a nanometre. */
const MM_PER_NM = 1e-6;

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [decodeTrace(dataA), decodeTrace(dataB)];
  const different = differentRays(a, b);
  if (different !== null) return { comparable: false, reason: different };
  const spec = context?.spec as RaysTraceSpec | undefined;
  const lines = context?.opticalCase?.conditions.lines;
  if (spec === undefined || lines === undefined) {
    const reason = "the request and its case are not at hand: a path is measured in waves of the request's line";
    return { comparable: false, reason };
  }
  if (spec.line >= lines.length) {
    return { comparable: false, reason: `the request is for line ${spec.line}, and the case has ${lines.length}` };
  }
  const wave = lines[spec.line].wavelengthNm * MM_PER_NM;
  const place = placeOf(context?.spec);

  const both = okInBoth(a, b);
  if (both.length === 0) {
    const unmeasured = ["opticalPath.maxAbs", "opticalPathToImage.maxAbs", "opd.maxAbs"].map((name) => ({
      name,
      reason: NO_COMMON_RAY,
    }));
    return { comparable: true, metrics: [], unmeasured };
  }
  const toSurface = noWorst();
  const toImage = noWorst();
  for (const ray of both) {
    takeWorst(toSurface, Math.abs(a.opticalPath[ray] - b.opticalPath[ray]) / wave, ray);
    takeWorst(toImage, Math.abs(a.opticalPathToImage[ray] - b.opticalPathToImage[ray]) / wave, ray);
  }
  const metrics = [
    { name: "opticalPath.maxAbs", value: toSurface.value, where: whereOf(place, toSurface) },
    { name: "opticalPathToImage.maxAbs", value: toImage.value, where: whereOf(place, toImage) },
  ];

  const chief = spec.groups?.chiefIndex;
  const unmeasured: UnmeasuredMetric[] = [];
  if (chief === undefined) unmeasured.push({ name: "opd.maxAbs", reason: "the set has no chief ray" });
  else if (a.status[chief] !== RAY_STATUS.ok || b.status[chief] !== RAY_STATUS.ok) {
    unmeasured.push({ name: "opd.maxAbs", reason: "the chief ray is not ok in both answers" });
  } else {
    const relative = noWorst();
    for (const ray of both) {
      // Each difference is of two paths of one engine that are within a few millimetres of each other, so it is
      // exact; only the last subtraction rounds.
      const ofA = a.opticalPathToImage[chief] - a.opticalPathToImage[ray];
      const ofB = b.opticalPathToImage[chief] - b.opticalPathToImage[ray];
      takeWorst(relative, Math.abs(ofA - ofB) / wave, ray);
    }
    metrics.push({ name: "opd.maxAbs", value: relative.value, where: whereOf(place, relative) });
  }
  return { comparable: true, metrics, unmeasured };
}

/**
 * The comparator of `rays.trace` for rung R3: the optical path of the same rays in two engines. Every metric is a
 * difference in waves of the line the rays were traced at, over the rays that are ok in both answers, with the
 * `ray` of its largest value in `where`, the first on a tie, beside the `line` and the `field` of the set:
 *
 * - `opticalPath.maxAbs`: the path from a ray's origin to its hit on the last surface;
 * - `opticalPathToImage.maxAbs`: the path continued to the image plane;
 * - `opd.maxAbs`: the path to the image plane relative to the chief ray's, W = path(chief) - path(ray): what an
 *   estimator of the wavefront reads, in which whatever the two engines differ by on every ray alike has cancelled.
 *   It is measured where the set states a chief ray that is ok in both answers; elsewhere it is not measured, and
 *   the two metrics above stand alone.
 *
 * Where no ray is ok in both, none of the three is measured. A ray that is not ok in both has no path in one
 * answer: that is a matter of which rays got through, which rung R2 judges.
 *
 * Answers for different numbers of rays or of surfaces are not comparable, and no two answers are without the
 * request and its case: the request names the line, and the case its wavelength.
 */
export const raysPathComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: "r3",
  metrics: Object.freeze([
    { name: "opticalPath.maxAbs", unit: "waves" },
    { name: "opticalPathToImage.maxAbs", unit: "waves" },
    { name: "opd.maxAbs", unit: "waves" },
  ]),
  compare,
});
