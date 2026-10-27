// The comparator of `rays.trace` for rung R10a: where two engines put the tangential and the sagittal focus of each
// field of the same rays. One estimator, the comparator's own (`relativeFocus`, src/estimators/fieldFocus.ts), is
// applied to where each engine lands the rays on the image plane of the case and their directions there: the rays
// LensVisualizer's field-curve and astigmatism sections launch, field by field, its four parabasal rays or its
// real-ray fans beside its chief ray (src/rays/curvatureSets.ts). Which rays got through is judged here too, as R2
// judges it: no other rung traces these rays.
//
// A focus is judged on the transverse scale. Two foci of a fan that are `δ` apart along the axis put its rays `δ Δu`
// apart from the chief ray there, `Δu` a ray's slope relative to the chief ray's, and a parabasal ray's is small (0.01
// mm over the focal length, 5e-4 to 2.5e-5 on the benchmark, 1.25e-5 on the diffractive suite): a difference of the
// landings relative to the chief ray of a rounding moves the focus `1 / Δu`, 2,000 to 80,000 times further, along the
// axis. The difference of the two foci
// times the larger of the two answers' RMS relative slopes is the distance across the field at which the one engine's
// rays pass the other's focus, the distance a gate of R2 and R7a is of: that is the figure judged
// (`tangentialFocus.maxScaled`, `sagittalFocus.maxScaled`). The plain differences along the axis are shown beside them
// (`tangentialFocus.maxAbs`, `sagittalFocus.maxAbs`, and their difference, the astigmatism, `astigmatism.maxAbs`).
// Taking the larger slope keeps an engine whose relative slopes are wrong and small from scaling its own difference
// away. The scaled figure is about `|δΔc + s δΔu|`, the difference of the rays' relative coordinates on the plane
// plus the difference of their relative slopes over the distance `s` from the plane to the focus: a difference of the
// exit slopes is amplified by that distance, and the focus figures are the rung's only sign of one.
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { relativeFocus } from "../estimators/fieldFocus.ts";
import type { FocusAxis, FocusRays, RelativeFocus } from "../estimators/fieldFocus.ts";
import { intersectValidity, maskWhere } from "../estimators/validity.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { maskMetrics, rayEndings, tracedSurfaces } from "./raysGeometry.ts";
import { decodeTrace, noWorst, placeOf, takeWorst, whereOf } from "./raysRead.ts";
import type { DecodedTrace } from "./raysRead.ts";

/** The rung of the field curves of identical rays. */
export const CURVATURE_RAYS_RUNG = "r10a";

/** The figures of a focus, by its fan, in the order the comparator reports them. */
const FOCUS_FIGURES: { readonly [axis in FocusAxis]: readonly [scaled: string, along: string] } = {
  tangential: ["tangentialFocus.maxScaled", "tangentialFocus.maxAbs"],
  sagittal: ["sagittalFocus.maxScaled", "sagittalFocus.maxAbs"],
};
const ASTIGMATISM = "astigmatism.maxAbs";

/** One field of a curvature set: its chief ray, and the rays of its tangential and its sagittal fan. */
export interface CurvatureField {
  readonly chief: number;
  readonly tangential: readonly number[];
  readonly sagittal: readonly number[];
}

/**
 * The fields of a curvature set, from its spec (src/rays/curvatureSets.ts): each a block of consecutive rays launched
 * along one direction, its chief ray last; a ray of the block whose start is the chief ray's but along y is of the
 * tangential fan, but along x of the sagittal fan, and one that starts where the chief ray starts is in neither (the
 * centre of a fan, which adds nothing to a focus). A ray offset along both, or along z, says the set is no curvature
 * set: the reason it cannot be compared.
 */
export function curvatureFieldsOf(spec: JsonObject | undefined, rays: number): CurvatureField[] | string {
  if (spec === undefined) return "the spec of the request is not at hand: it says which rays are of which field";
  const { origins, directions } = spec as RaysTraceSpec;
  const [o, d] = [decodeNdArray(origins).values as Float64Array, decodeNdArray(directions).values as Float64Array];
  if (o.length !== 3 * rays) return `the request is of ${o.length / 3} rays, and the answers are for ${rays}`;
  const sameDirection = (a: number, b: number) => [0, 1, 2].every((at) => d[3 * a + at] === d[3 * b + at]);
  const fields: CurvatureField[] = [];
  let first = 0;
  while (first < rays) {
    let end = first;
    while (end + 1 < rays && sameDirection(end + 1, first)) end++;
    const chief = end;
    const tangential: number[] = [];
    const sagittal: number[] = [];
    for (let ray = first; ray < chief; ray++) {
      const [dx, dy, dz] = [0, 1, 2].map((at) => o[3 * ray + at] !== o[3 * chief + at]);
      if (dz || (dx && dy)) {
        return `ray ${ray} starts beside its field's chief ray, ray ${chief}, other than along x or along y alone`;
      }
      if (dy) tangential.push(ray);
      else if (dx) sagittal.push(ray);
    }
    fields.push({ chief, tangential, sagittal });
    first = end + 1;
  }
  return fields;
}

/** The two foci of a field in one answer. */
type FieldFoci = { readonly [axis in FocusAxis]: RelativeFocus };

function fociOf(rays: FocusRays, field: CurvatureField): FieldFoci {
  return {
    tangential: relativeFocus(rays, field.chief, field.tangential, "tangential"),
    sagittal: relativeFocus(rays, field.chief, field.sagittal, "sagittal"),
  };
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [decodeTrace(dataA), decodeTrace(dataB)];
  const surfaces = tracedSurfaces(a, b, context);
  if ("reason" in surfaces) return { comparable: false, reason: surfaces.reason };
  const fields = curvatureFieldsOf(context?.spec, a.rays);
  if (typeof fields === "string") return { comparable: false, reason: fields };
  const place = placeOf(context?.spec);

  // The rays both engines brought to the image: the only ones either estimate is of.
  const valid = intersectValidity([maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)]);
  let dropped = 0;
  let firstDropped = -1;
  const landing = noWorst();
  let compared = 0;
  for (let ray = 0; ray < a.rays; ray++) {
    if ((a.status[ray] === RAY_STATUS.ok) !== (b.status[ray] === RAY_STATUS.ok) && dropped++ === 0) firstDropped = ray;
    if (valid[ray] === 0) continue;
    const along = Math.abs(a.imagePoint[3 * ray] - b.imagePoint[3 * ray]);
    const across = Math.abs(a.imagePoint[3 * ray + 1] - b.imagePoint[3 * ray + 1]);
    takeWorst(landing, Math.max(along, across), ray);
    compared++;
  }
  const [mismatches, rimBand] = maskMetrics(a, b, surfaces, place);

  // Field by field, each fan's focus in both answers, of the rays taken in both.
  const raysOf = (trace: DecodedTrace): FocusRays => ({
    landing: trace.imagePoint,
    direction: trace.exitDirection,
    valid,
  });
  const [first, second] = [raysOf(a), raysOf(b)];
  const scaled = { tangential: noWorst(), sagittal: noWorst() };
  const along = { tangential: noWorst(), sagittal: noWorst() };
  const astigmatism = noWorst();
  const measured = { tangential: 0, sagittal: 0 };
  // Why a fan has no focus in both answers, the first of each fan's own: a figure of one fan is never said to be
  // unmeasured for a reason of the other.
  const missing: { [axis in FocusAxis]?: string } = {};
  let both = 0;
  for (const field of fields) {
    const [fociA, fociB] = [fociOf(first, field), fociOf(second, field)];
    for (const axis of ["tangential", "sagittal"] as const) {
      // A field without rays of a fan has no such fan: nothing of it is missing.
      if (field[axis].length === 0) continue;
      const [one, two] = [fociA[axis], fociB[axis]];
      if (one.available && two.available) {
        const difference = Math.abs(one.shiftMm - two.shiftMm);
        takeWorst(scaled[axis], difference * Math.max(one.rmsSlope, two.rmsSlope), field.chief);
        takeWorst(along[axis], difference, field.chief);
        measured[axis]++;
        continue;
      }
      if (!one.available && !two.available && one.reason === two.reason) {
        missing[axis] ??= `${one.reason}: the ${axis} fan of the field of chief ray ${field.chief}: ${one.message}`;
        continue;
      }
      const said = (focus: RelativeFocus): string => (focus.available ? "has a focus" : `has none: ${focus.reason}`);
      return {
        comparable: false,
        reason: `the field of chief ray ${field.chief}: its ${axis} fan in the first answer ${said(one)}, in the second ${said(two)}`,
      };
    }
    const [{ tangential: ta, sagittal: sa }, { tangential: tb, sagittal: sb }] = [fociA, fociB];
    if (ta.available && sa.available && tb.available && sb.available) {
      takeWorst(astigmatism, Math.abs(sa.shiftMm - ta.shiftMm - (sb.shiftMm - tb.shiftMm)), field.chief);
      both++;
    }
  }

  const whyNone = (axis: FocusAxis): string => missing[axis] ?? `no field of the set has a ${axis} fan`;
  const metrics: ComputedMetric[] = [];
  const unmeasured: { name: string; reason: string }[] = [];
  if (compared > 0) metrics.push({ name: "landing.maxAbs", value: landing.value, where: whereOf(place, landing) });
  else unmeasured.push({ name: "landing.maxAbs", reason: "no-rays: no ray is ok in both answers" });
  for (const axis of ["tangential", "sagittal"] as const) {
    const [scaledName, alongName] = FOCUS_FIGURES[axis];
    if (measured[axis] > 0) {
      metrics.push(
        { name: scaledName, value: scaled[axis].value, where: whereOf(place, scaled[axis]) },
        { name: alongName, value: along[axis].value, where: whereOf(place, along[axis]) },
      );
    } else {
      unmeasured.push({ name: scaledName, reason: whyNone(axis) }, { name: alongName, reason: whyNone(axis) });
    }
  }
  if (both > 0) metrics.push({ name: ASTIGMATISM, value: astigmatism.value, where: whereOf(place, astigmatism) });
  else {
    // The astigmatism is of both foci: the reason is that of a fan with none, or that no one field has both.
    const none = (["tangential", "sagittal"] as const).find((axis) => measured[axis] === 0);
    unmeasured.push({
      name: ASTIGMATISM,
      reason: none === undefined ? "no field of the set has both foci" : whyNone(none),
    });
  }
  metrics.push(
    mismatches,
    rimBand,
    { name: "rays.compared", value: compared },
    { name: "rays.dropped", value: dropped, ...(dropped === 0 ? {} : { where: { ...place, ray: firstDropped } }) },
    { name: "fields.compared", value: both },
  );
  return { comparable: true, metrics, ...(unmeasured.length === 0 ? {} : { unmeasured }) };
}

/** What one answer reports beside what is compared: how many of its rays ended in each way, as R2 records them. */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  return rayEndings(data);
}

/**
 * The comparator of `rays.trace` for rung R10a: where two engines put the tangential and the sagittal focus of each
 * field of the same rays.
 *
 * - **The rays** are a curvature set of LensVisualizer's field-curve sections: fields of rays launched along one
 *   direction, each its chief ray last (`curvatureFieldsOf`). A focus is of the rays that are ok in both answers;
 *   which rays those are is judged here as R2 judges it (`mask.mismatches`, `mask.rimBand`).
 * - **The landing** of a ray is the engine's own `imagePoint`; its direction there is `exitDirection`.
 * - **The focus** of a fan is the least-squares focus of its rays relative to the field's chief ray, along the axis
 *   from the image plane of the case (`relativeFocus`).
 *
 * Metrics, each with the `line` of the set and the `ray` of its largest value in `where` (for a focus, the field's
 * chief ray), the first on a tie:
 *
 * - `landing.maxAbs`: the largest difference of a landing, along x or y, mm;
 * - `tangentialFocus.maxScaled`, `sagittalFocus.maxScaled`: the largest difference of a field's two foci times the
 *   larger of the two answers' RMS slopes of the fan relative to the chief ray, mm;
 * - `tangentialFocus.maxAbs`, `sagittalFocus.maxAbs`: the largest difference of a field's two foci along the axis, mm;
 * - `astigmatism.maxAbs`: the largest difference of the two answers' sagittal less tangential focus, mm;
 * - `mask.mismatches` and `mask.rimBand`: as R2's;
 * - `rays.compared`: the rays ok in both answers; `rays.dropped`: those ok in one answer only, with the first in
 *   `where`; `fields.compared`: the fields with both foci in both answers.
 *
 * Not measured: a figure no field has in both answers (no ray of a fan taken, its chief ray not taken, every ray of
 * it parallel to the chief ray). Not comparable: without the case or the spec of the request; answers for different
 * numbers of rays or surfaces; a set that is no curvature set; a fan that has a focus in one answer and none, or none
 * for another reason, in the other.
 */
export const raysCurvatureComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: CURVATURE_RAYS_RUNG,
  metrics: Object.freeze([
    { name: "landing.maxAbs", unit: "mm" },
    { name: "tangentialFocus.maxScaled", unit: "mm" },
    { name: "tangentialFocus.maxAbs", unit: "mm" },
    { name: "sagittalFocus.maxScaled", unit: "mm" },
    { name: "sagittalFocus.maxAbs", unit: "mm" },
    { name: ASTIGMATISM, unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
    { name: "fields.compared", unit: "elements" },
  ]),
  compare,
  recorded,
});
