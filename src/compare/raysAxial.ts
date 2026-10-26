// The comparator of `rays.trace` for rung R8a: where the same rays cross the axis in two engines. One estimator, the
// comparator's own (src/estimators/axialIntercept.ts), is applied to where each engine has the rays leave the last
// surface: the rays LensVisualizer's spherical-aberration and axial-colour sections launch parallel to the axis, each
// beside its mirror image. The two engines' intercepts are set against each other ray by ray, and the least-squares
// focus of each set's pairs and the RMS of their heights there, as the spherical-aberration section presents them.
// Which rays got through is judged here too, as R2 judges it: no other rung traces these rays.
//
// An intercept is judged on the transverse scale. Two traces of a ray that differ by a transverse distance d near
// the focus cross the axis d / |u| apart, u the ray's slope: a ray near the axis, of a small slope, crosses it where
// a rounding of its height moves the crossing far along the axis. The difference of the two intercepts times the
// larger of the two slopes is the height at which each engine's ray passes the other's crossing, the distance a gate
// of R2 and R7a is of: that is the figure judged (`intercept.maxScaled`). The plain difference along the axis is
// shown beside it (`intercept.maxAbs`). The focus of a set is judged alike, its difference times the larger RMS slope.
// Taking the larger slope, of a ray or of a set, keeps an engine whose slope is wrong and small from scaling its own
// difference away. The focus figures are the rung's only sign of a difference of the exit slopes: two answers whose
// intercepts agree and whose slopes differ weight their zones differently, and their foci and RMS heights part.
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { axialIntercepts, leastSquaresFocus, pairsTaken } from "../estimators/axialIntercept.ts";
import type { AxialFocus, AxialInterceptSet } from "../estimators/axialIntercept.ts";
import { intersectValidity, maskWhere } from "../estimators/validity.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { maskMetrics, rayEndings, tracedSurfaces } from "./raysGeometry.ts";
import { decodeTrace, noWorst, placeOf, takeWorst, whereOf } from "./raysRead.ts";
import type { DecodedTrace } from "./raysRead.ts";

/** The rung of the axial intercepts of identical rays. */
export const AXIAL_RAYS_RUNG = "r8a";

/** The figures of a set's focus, in the order the comparator reports them. */
const FOCUS_FIGURES = ["focus.maxScaled", "focus.maxAbs", "focusRms.maxAbs"] as const;

/** The exit points of an answer: `[n, 3]`, flat. */
function exitPointOf(data: JsonObject): Float64Array {
  return decodeNdArray((data as { exitPoint: Parameters<typeof decodeNdArray>[0] }).exitPoint).values as Float64Array;
}

/** The intercepts of one answer's rays that are taken. */
function interceptsOf(data: JsonObject, trace: DecodedTrace, valid: Uint8Array): AxialInterceptSet {
  return axialIntercepts({ exitPoint: exitPointOf(data), exitDirection: trace.exitDirection, valid });
}

/**
 * What a set is, from its spec: whether every ray lies in the meridional plane (x and the x of the direction 0) and
 * whether the rays are mirror pairs (ray `2k + 1` is ray `2k` with y and the y of the direction negated); or why the
 * set cannot be compared at all.
 */
function setOf(spec: JsonObject | undefined, rays: number): { readonly pairs: boolean } | string {
  if (spec === undefined) return "the spec of the request is not at hand: it says which rays are mirror pairs";
  const { origins, directions } = spec as RaysTraceSpec;
  const [o, d] = [decodeNdArray(origins).values as Float64Array, decodeNdArray(directions).values as Float64Array];
  if (o.length !== 3 * rays) return `the request is of ${o.length / 3} rays, and the answers are for ${rays}`;
  for (let ray = 0; ray < rays; ray++) {
    if (o[3 * ray] !== 0 || d[3 * ray] !== 0) return `ray ${ray} of the set is not in the meridional plane`;
  }
  if (rays % 2 !== 0) return { pairs: false };
  for (let ray = 0; ray < rays; ray += 2) {
    const mirrored =
      o[3 * ray + 4] === -o[3 * ray + 1] &&
      o[3 * ray + 5] === o[3 * ray + 2] &&
      d[3 * ray + 4] === -d[3 * ray + 1] &&
      d[3 * ray + 5] === d[3 * ray + 2];
    if (!mirrored) return { pairs: false };
  }
  return { pairs: true };
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [decodeTrace(dataA), decodeTrace(dataB)];
  const surfaces = tracedSurfaces(a, b, context);
  if ("reason" in surfaces) return { comparable: false, reason: surfaces.reason };
  const set = setOf(context?.spec, a.rays);
  if (typeof set === "string") return { comparable: false, reason: set };
  const place = placeOf(context?.spec);

  // The rays both engines brought to the image: the only ones either estimate is of.
  const valid = intersectValidity([maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)]);
  let dropped = 0;
  let firstDropped = -1;
  for (let ray = 0; ray < a.rays; ray++) {
    if ((a.status[ray] === RAY_STATUS.ok) === (b.status[ray] === RAY_STATUS.ok)) continue;
    if (dropped++ === 0) firstDropped = ray;
  }
  const [mismatches, rimBand] = maskMetrics(a, b, surfaces, place);
  const [first, second] = [interceptsOf(dataA, a, valid), interceptsOf(dataB, b, valid)];

  // Ray by ray. A ray both engines brought to the image crosses the axis in both, or in neither for one reason.
  const intercept = noWorst();
  const along = noWorst();
  let compared = 0;
  for (let ray = 0; ray < a.rays; ray++) {
    if (valid[ray] === 0) continue;
    const [reasonA, reasonB] = [first.reason[ray], second.reason[ray]];
    if (reasonA !== reasonB) {
      const said = (reason: string | null): string => reason ?? "crosses the axis";
      return {
        comparable: false,
        reason: `ray ${ray}: in the first answer it ${said(reasonA)}, in the second ${said(reasonB)}`,
      };
    }
    if (reasonA === "bad-exit" || reasonA === "skew") {
      return { comparable: false, reason: `ray ${ray} has no intercept in either answer: ${reasonA}` };
    }
    if (reasonA !== null) continue;
    const difference = Math.abs(first.z[ray] - second.z[ray]);
    const slope = Math.max(Math.abs(first.slope[ray]), Math.abs(second.slope[ray]));
    takeWorst(intercept, difference * slope, ray);
    takeWorst(along, difference, ray);
    compared++;
  }
  const counts: ComputedMetric[] = [
    mismatches,
    rimBand,
    { name: "rays.compared", value: compared },
    { name: "rays.dropped", value: dropped, ...(dropped === 0 ? {} : { where: { ...place, ray: firstDropped } }) },
  ];
  const rays: ComputedMetric[] =
    compared === 0
      ? []
      : [
          { name: "intercept.maxScaled", value: intercept.value, where: whereOf(place, intercept) },
          { name: "intercept.maxAbs", value: along.value, where: whereOf(place, along) },
        ];
  const unmeasured = compared === 0 ? ["intercept.maxScaled", "intercept.maxAbs"].map(nothingCrosses) : [];

  // The set's focus: of its pairs whose two rays cross the axis in both answers.
  if (!set.pairs) {
    const reason = "the set is not of mirror pairs: a focus is of pairs";
    return {
      comparable: true,
      metrics: [...rays, ...counts],
      unmeasured: [...unmeasured, ...FOCUS_FIGURES.map((name) => ({ name, reason }))],
    };
  }
  const taken = pairsTaken(first);
  const [focusA, focusB] = [leastSquaresFocus(first, taken), leastSquaresFocus(second, taken)];
  if (!focusA.available || !focusB.available) {
    const missing = !focusA.available ? focusA : (focusB as Extract<AxialFocus, { available: false }>);
    const said = `${missing.reason}: ${missing.message}`;
    if (missing.reason === "out-of-range") return { comparable: false, reason: `no focus: ${said}` };
    return {
      comparable: true,
      metrics: [...rays, ...counts],
      unmeasured: [...unmeasured, ...FOCUS_FIGURES.map((name) => ({ name, reason: said }))],
    };
  }
  const shift = Math.abs(focusA.z - focusB.z);
  const focus: ComputedMetric[] = [
    { name: "focus.maxScaled", value: shift * Math.max(focusA.rmsSlope, focusB.rmsSlope), where: place },
    { name: "focus.maxAbs", value: shift, where: place },
    { name: "focusRms.maxAbs", value: Math.abs(focusA.rmsMm - focusB.rmsMm), where: place },
  ];
  return { comparable: true, metrics: [...rays, ...focus, ...counts], unmeasured };
}

/** An intercept figure without a ray that crosses the axis in both answers. */
function nothingCrosses(name: string): { readonly name: string; readonly reason: string } {
  return { name, reason: "no-rays: no ray both engines brought to the image crosses the axis" };
}

/**
 * What one answer reports beside what is compared: how many of its rays ended in each way (as R2 records them), and
 * the least-squares focus of its own pairs that crossed the axis, on its own: the focus and the RMS height there, NaN
 * where it has none. Written down, never judged.
 */
function recorded(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] } {
  const trace = decodeTrace(data);
  const set = setOf(context?.spec, trace.rays);
  let focus: AxialFocus | null = null;
  if (typeof set !== "string" && set.pairs) {
    const intercepts = interceptsOf(data, trace, maskWhere(trace.status, RAY_STATUS.ok));
    if (!intercepts.reason.some((reason) => reason === "skew" || reason === "bad-exit")) {
      focus = leastSquaresFocus(intercepts, pairsTaken(intercepts));
    }
  }
  const figures = focus?.available === true ? focus : null;
  return {
    ...rayEndings(data),
    "axial.focusZ": [figures?.z ?? Number.NaN],
    "axial.focusRmsMm": [figures?.rmsMm ?? Number.NaN],
  };
}

/**
 * The comparator of `rays.trace` for rung R8a: where the same rays cross the axis in two engines.
 *
 * - **The rays** are a set of LensVisualizer's axial sections, launched parallel to the axis in the meridional plane,
 *   each beside its mirror image; an intercept is of the rays that are ok in both answers. Which rays those are is
 *   judged here as R2 judges it (`mask.mismatches`, `mask.rimBand`).
 * - **The intercept** of a ray is where its exit, the engine's `exitPoint` and `exitDirection`, crosses the axis.
 * - **The focus** of a set is the least-squares focus of its pairs whose two rays cross the axis.
 *
 * Metrics:
 *
 * - `intercept.maxScaled`: the largest difference of a ray's two intercepts times the larger of its two slopes, mm,
 *   the height at which one engine's ray passes the other's crossing, with the `ray` in `where`, the first on a tie;
 * - `intercept.maxAbs`: the largest difference of a ray's two intercepts along the axis, mm, with its `ray`;
 * - `focus.maxScaled`: the difference of the two foci times the larger RMS slope of the pairs, mm;
 * - `focus.maxAbs`: the difference of the two foci along the axis, mm;
 * - `focusRms.maxAbs`: the difference of the two RMS heights of the pairs on their focus, mm;
 * - `mask.mismatches` and `mask.rimBand`: as R2's;
 * - `rays.compared`: the rays whose intercepts are compared; `rays.dropped`: the rays that are ok in one answer and
 *   not in the other, with the `ray` of the first in `where`.
 *
 * The intercept figures are not measured where no ray both engines brought to the image crosses the axis; the focus
 * figures where the set is not of mirror pairs, where no pair is taken, or where every ray taken is parallel to the
 * axis. Not comparable: without the case or the spec of the request; answers for different numbers of rays or
 * surfaces; a set off the meridional plane; a ray that crosses the axis in one answer and not in the other, or that
 * leaves the meridional plane or has an exit that is not finite numbers in both.
 */
export const raysAxialComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: AXIAL_RAYS_RUNG,
  metrics: Object.freeze([
    { name: "intercept.maxScaled", unit: "mm" },
    { name: "intercept.maxAbs", unit: "mm" },
    { name: "focus.maxScaled", unit: "mm" },
    { name: "focus.maxAbs", unit: "mm" },
    { name: "focusRms.maxAbs", unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
  ]),
  compare,
  recorded,
});
