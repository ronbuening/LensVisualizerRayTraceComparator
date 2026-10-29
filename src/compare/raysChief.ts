// The comparator of `rays.trace` for rung R9a: where the same chief rays land in two engines, and what
// LensVisualizer's distortion, pupils and lateral-colour tabs make of the landings. The rays are a set of chief rays a
// tab launches (its distortion curve's or its grid's, with the near-axis probe that scales the reference; its pupils
// tab's; its lateral-colour section's), traced at every line of the case: a figure is of the set at all of its lines,
// so the comparator is one of spans (`spanOf`), each answer an engine's traces of one set at every line.
//
// - **The landing** of a ray is the engine's own `imagePoint`, on the image plane of the case: the transverse figure a
//   gate of R2 and R7a is of.
// - **Lateral colour** is how a ray's landing moves from the first line of the span to each other: the difference of
//   the two engines' moves.
// - **Distortion** is of a set that states its probe (`groups.chiefIndex`): each ray's landing less the ideal point of
//   the rectilinear reference the probe's landing scales (`estimateDistortion`, src/estimators/distortion.ts). The
//   percent is ill-conditioned near the axis, a displacement over a small ideal height: it is judged as the
//   displacement it is a percentage of (`distortion.maxScaled`), and the percent is shown beside it
//   (`distortion.maxAbs`), never judged. The displacement is not on the transverse scale for the probe: a difference
//   of the probe's landing enters it times the ray's slope over the probe's (about 100 to 270), so the figure holds the
//   probe's landing to about 4e-11 mm (docs/REFERENCE.md, "Stage 6.4").
// - **The exit pupil** of a chief ray is where it crosses the axis behind the system (`axialIntercept`,
//   src/estimators/axialIntercept.ts), as the pupils tab presents it. An intercept is judged on the transverse scale,
//   as R8a judges one: the difference times the larger of the two slopes (`exitPupil.maxScaled`), the plain
//   difference along the axis shown (`exitPupil.maxAbs`). It is the rung's sign of a difference of the exit slopes,
//   which a landing alone does not separate from a difference of the exit heights.
//
// Which rays got through is judged here too, as R2 judges it: no other rung traces these rays.
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { axialIntercepts } from "../estimators/axialIntercept.ts";
import type { AxialInterceptSet, InterceptReason } from "../estimators/axialIntercept.ts";
import { estimateDistortion } from "../estimators/distortion.ts";
import type { DistortionEstimate } from "../estimators/distortion.ts";
import { intersectValidity, maskWhere } from "../estimators/validity.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { maskMetrics, rayEndings, tracedSurfaces } from "./raysGeometry.ts";
import { decodeTrace, noWorst, placeOf, takeWorst, whereOf } from "./raysRead.ts";
import type { DecodedTrace, Where, WorstRay } from "./raysRead.ts";
import type { SpanAnswer, SpanMember } from "./span.ts";

/** The rung of the chief rays of identical launches. */
export const CHIEF_RAYS_RUNG = "r9a";

const DISTORTION_FIGURES = ["distortion.maxScaled", "distortion.maxAbs"] as const;
const PUPIL_FIGURES = ["exitPupil.maxScaled", "exitPupil.maxAbs"] as const;

/** The reasons an intercept has none that two answers may share and leave the ray out of the figure. */
const NO_CROSSING: readonly InterceptReason[] = ["skew", "on-axis", "parallel", "out-of-range"];

/** A set of chief rays at every line it was traced at: its rays, apart from the line, are its key. */
function spanOf(spec: JsonObject): string {
  const { origins, directions, weights, groups } = spec as RaysTraceSpec;
  return canonicalJson({ origins, directions, weights, ...(groups === undefined ? {} : { groups }) });
}

/** One line of a span as two engines traced it. */
interface TracedLine {
  readonly spec: RaysTraceSpec;
  readonly place: Where;
  readonly a: DecodedTrace;
  readonly b: DecodedTrace;
  readonly dataA: JsonObject;
  readonly dataB: JsonObject;
  /** The rays that are ok in both answers. */
  readonly valid: Uint8Array;
}

/** The exit points of an answer: `[n, 3]`, flat. */
function exitPointOf(data: JsonObject): Float64Array {
  return decodeNdArray((data as { exitPoint: Parameters<typeof decodeNdArray>[0] }).exitPoint).values as Float64Array;
}

/** The launch slopes of every ray of a request, dx/dz and dy/dz of its direction: the same for every engine. */
function slopesOf(spec: RaysTraceSpec): { readonly slopeX: Float64Array; readonly slopeY: Float64Array } {
  const directions = decodeNdArray(spec.directions).values as Float64Array;
  const rays = directions.length / 3;
  const slopeX = new Float64Array(rays);
  const slopeY = new Float64Array(rays);
  for (let ray = 0; ray < rays; ray++) {
    slopeX[ray] = directions[3 * ray] / directions[3 * ray + 2];
    slopeY[ray] = directions[3 * ray + 1] / directions[3 * ray + 2];
  }
  return { slopeX, slopeY };
}

/** The distortion an answer's landings have against its own probe, with the rays both answers brought to the image. */
function distortionOf(trace: DecodedTrace, spec: RaysTraceSpec, valid: Uint8Array, probe: number): DistortionEstimate {
  const x = new Float64Array(trace.rays);
  const y = new Float64Array(trace.rays);
  for (let ray = 0; ray < trace.rays; ray++) {
    x[ray] = trace.imagePoint[3 * ray];
    y[ray] = trace.imagePoint[3 * ray + 1];
  }
  return estimateDistortion({ x, y, ...slopesOf(spec), reference: probe, valid });
}

/** The largest of a series and where it occurs, with the place of its set. */
interface Largest {
  readonly worst: WorstRay;
  place: Where;
}

function largest(): Largest {
  return { worst: noWorst(), place: {} };
}

/** `takeWorst` with the place of the set the value is of: the first of equal values is kept, a NaN stays. */
function take(series: Largest, value: number, ray: number, place: Where): void {
  const { worst } = series;
  if (Number.isNaN(worst.value)) return;
  if (Number.isNaN(value) || worst.ray < 0 || value > worst.value) {
    takeWorst(worst, value, ray);
    series.place = place;
  }
}

function metricOf(name: string, series: Largest): ComputedMetric {
  return { name, value: series.worst.value, where: whereOf(series.place, series.worst) };
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const never = (reason: string): ComparatorOutcome => ({ comparable: false, reason });
  const [membersA, membersB] = [(dataA as SpanAnswer).members, (dataB as SpanAnswer).members];
  if (
    membersA.length !== membersB.length ||
    membersA.some((member, at) => member.requestId !== membersB[at].requestId)
  ) {
    return never("the answers are not to the same requests of the span");
  }
  const lines: TracedLine[] = [];
  for (const [at, member] of membersA.entries()) {
    const other: SpanMember = membersB[at];
    const [a, b] = [decodeTrace(member.data), decodeTrace(other.data)];
    const surfaces = tracedSurfaces(a, b, context);
    if ("reason" in surfaces) return never(surfaces.reason);
    const spec = member.spec as RaysTraceSpec;
    const valid = intersectValidity([maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)]);
    lines.push({ spec, place: placeOf(member.spec), a, b, dataA: member.data, dataB: other.data, valid });
  }
  // The first line of the span is the line of the case it has the smallest index of: the reference of lateral colour.
  lines.sort((one, two) => one.spec.line - two.spec.line);
  const { rays } = lines[0].a;
  const probe = lines[0].spec.groups?.chiefIndex;
  if (probe !== undefined && !(probe < rays)) return never(`the probe ${probe} is no ray of a set of ${rays}`);

  let [mismatches, rimBand, compared, dropped] = [0, 0, 0, 0];
  let [firstMismatch, firstRim, firstDropped]: (Where | null)[] = [null, null, null];
  const landing = largest();
  const pupilScaled = largest();
  const pupilAlong = largest();
  const distortionScaled = largest();
  const distortionPercent = largest();
  const distortionMissing: string[] = [];
  let crossings = 0;
  let displaced = 0;

  for (const line of lines) {
    const { a, b, valid, place, spec } = line;
    const surfaces = tracedSurfaces(a, b, context) as Parameters<typeof maskMetrics>[2];
    const [mismatch, rim] = maskMetrics(a, b, surfaces, place);
    if (mismatch.value > 0 && firstMismatch === null) firstMismatch = mismatch.where ?? place;
    if (rim.value > 0 && firstRim === null) firstRim = rim.where ?? place;
    mismatches += mismatch.value;
    rimBand += rim.value;
    for (let ray = 0; ray < rays; ray++) {
      if ((a.status[ray] === RAY_STATUS.ok) !== (b.status[ray] === RAY_STATUS.ok)) {
        if (dropped++ === 0) firstDropped = { ...place, ray };
      }
      if (valid[ray] === 0) continue;
      compared++;
      const along = Math.abs(a.imagePoint[3 * ray] - b.imagePoint[3 * ray]);
      const across = Math.abs(a.imagePoint[3 * ray + 1] - b.imagePoint[3 * ray + 1]);
      take(landing, Math.max(along, across), ray, place);
    }

    // The exit pupil: where each chief ray both engines brought to the image crosses the axis.
    const [first, second]: AxialInterceptSet[] = [
      axialIntercepts({ exitPoint: exitPointOf(line.dataA), exitDirection: a.exitDirection, valid }),
      axialIntercepts({ exitPoint: exitPointOf(line.dataB), exitDirection: b.exitDirection, valid }),
    ];
    for (let ray = 0; ray < rays; ray++) {
      if (valid[ray] === 0) continue;
      const [reasonA, reasonB] = [first.reason[ray], second.reason[ray]];
      if (reasonA === null && reasonB === null) {
        const difference = Math.abs(first.z[ray] - second.z[ray]);
        const slope = Math.max(Math.abs(first.slope[ray]), Math.abs(second.slope[ray]));
        take(pupilScaled, difference * slope, ray, place);
        take(pupilAlong, difference, ray, place);
        crossings++;
        continue;
      }
      if (reasonA === reasonB && reasonA !== null && NO_CROSSING.includes(reasonA)) continue;
      const said = (reason: string | null): string => reason ?? "crosses the axis";
      return never(
        `line ${spec.line}, ray ${ray}: in the first answer it ${said(reasonA)}, in the second ${said(reasonB)}`,
      );
    }

    // Distortion, of a set that states its probe.
    if (probe === undefined) continue;
    const [distortionA, distortionB] = [distortionOf(a, spec, valid, probe), distortionOf(b, spec, valid, probe)];
    const missing = [distortionA, distortionB].find(
      (estimate): estimate is Extract<DistortionEstimate, { available: false }> => !estimate.available,
    );
    if (missing !== undefined) {
      distortionMissing.push(`line ${spec.line}: ${missing.reason}: ${missing.message}`);
      continue;
    }
    if (!distortionA.available || !distortionB.available) continue;
    for (let ray = 0; ray < rays; ray++) {
      const [reasonA, reasonB] = [distortionA.reason[ray], distortionB.reason[ray]];
      if (reasonA === null && reasonB === null) {
        const scaled = Math.max(
          Math.abs(distortionA.displacementX[ray] - distortionB.displacementX[ray]),
          Math.abs(distortionA.displacementY[ray] - distortionB.displacementY[ray]),
        );
        take(distortionScaled, scaled, ray, place);
        take(distortionPercent, Math.abs(distortionA.percent[ray] - distortionB.percent[ray]), ray, place);
        displaced++;
        continue;
      }
      if (reasonA === reasonB) continue;
      const said = (reason: string | null): string => reason ?? "has a distortion";
      return never(
        `line ${spec.line}, ray ${ray}: in the first answer it ${said(reasonA)}, in the second ${said(reasonB)}`,
      );
    }
  }

  // Lateral colour: each ray's move from the first line to every other, in both answers.
  const lateral = largest();
  let moves = 0;
  const [reference, ...others] = lines;
  for (const line of others) {
    for (let ray = 0; ray < rays; ray++) {
      if (reference.valid[ray] === 0 || line.valid[ray] === 0) continue;
      const [ra, rb, la, lb] = [reference.a.imagePoint, reference.b.imagePoint, line.a.imagePoint, line.b.imagePoint];
      const moved = (axis: number) =>
        Math.abs(la[3 * ray + axis] - ra[3 * ray + axis] - (lb[3 * ray + axis] - rb[3 * ray + axis]));
      take(lateral, Math.max(moved(0), moved(1)), ray, line.place);
      moves++;
    }
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: { name: string; reason: string }[] = [];
  const inapplicable: string[] = [];
  const notes: string[] = [];
  if (compared > 0) metrics.push(metricOf("landing.maxAbs", landing));
  else unmeasured.push({ name: "landing.maxAbs", reason: "no-rays: no ray is ok in both answers" });
  if (others.length === 0) inapplicable.push("lateralColour.maxAbs");
  else if (moves > 0) metrics.push(metricOf("lateralColour.maxAbs", lateral));
  else unmeasured.push({ name: "lateralColour.maxAbs", reason: "no-rays: no ray is ok in both answers at two lines" });
  if (probe === undefined) inapplicable.push(...DISTORTION_FIGURES);
  else if (displaced > 0) {
    metrics.push(metricOf(DISTORTION_FIGURES[0], distortionScaled), metricOf(DISTORTION_FIGURES[1], distortionPercent));
    // A line whose distortion an answer has none of is in no figure of the others': it is named, never passed over.
    for (const line of distortionMissing) notes.push(`${DISTORTION_FIGURES[0]} is not of ${line}`);
  } else {
    const reason = distortionMissing[0] ?? "no-rays: no ray but the probe is ok in both answers";
    unmeasured.push(...DISTORTION_FIGURES.map((name) => ({ name, reason })));
  }
  if (crossings > 0) metrics.push(metricOf(PUPIL_FIGURES[0], pupilScaled), metricOf(PUPIL_FIGURES[1], pupilAlong));
  else {
    const reason = "no-rays: no ray both engines brought to the image crosses the axis behind the system";
    unmeasured.push(...PUPIL_FIGURES.map((name) => ({ name, reason })));
  }
  const count = (name: string, value: number, where: Where | null): ComputedMetric => ({
    name,
    value,
    ...(where === null ? {} : { where }),
  });
  metrics.push(
    count("mask.mismatches", mismatches, firstMismatch),
    count("mask.rimBand", rimBand, firstRim),
    { name: "rays.compared", value: compared },
    count("rays.dropped", dropped, firstDropped),
  );
  return {
    comparable: true,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(inapplicable.length === 0 ? {} : { inapplicable }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What one answer reports beside what is compared, one value a line of the span in the order of its lines: how many
 * of its rays ended in each way (as R2 records them), and for a set that states its probe the scale of the reference
 * the answer's own probe gives, mm, NaN where it gives none. Written down, never judged.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const members = [...(data as SpanAnswer).members].sort(
    (one, two) => (one.spec as RaysTraceSpec).line - (two.spec as RaysTraceSpec).line,
  );
  const values: { [name: string]: number[] } = {};
  for (const member of members) {
    for (const [name, [value]] of Object.entries(rayEndings(member.data))) (values[name] ??= []).push(value);
    const spec = member.spec as RaysTraceSpec;
    const probe = spec.groups?.chiefIndex;
    if (probe === undefined) continue;
    const trace = decodeTrace(member.data);
    const estimate =
      probe < trace.rays ? distortionOf(trace, spec, maskWhere(trace.status, RAY_STATUS.ok), probe) : null;
    (values["distortion.scaleMm"] ??= []).push(estimate?.available === true ? estimate.scaleMm : Number.NaN);
  }
  return values;
}

/**
 * The comparator of `rays.trace` for rung R9a: where the same chief rays land in two engines, and what the tabs make
 * of the landings. A comparator of spans (`spanOf`: the sets of the same rays at every line), each answer a
 * `SpanAnswer`.
 *
 * - **The rays** of each line are those ok in both answers; which rays those are is judged here as R2 judges it
 *   (`mask.mismatches`, `mask.rimBand`).
 * - **The landing** of a ray is the engine's own `imagePoint`; its exit is `exitPoint` and `exitDirection`.
 *
 * Metrics, each with the `line` and the `ray` of its largest value in `where`, the first on a tie:
 *
 * - `landing.maxAbs`: the largest difference of a landing, along x or y, mm;
 * - `lateralColour.maxAbs`: the largest difference of the two engines' moves of a landing from the span's first line
 *   to another, along x or y, mm; inapplicable to a case of one line;
 * - `distortion.maxScaled`: the largest difference of a ray's displacement from its ideal point, along x or y, mm:
 *   what the percent distortion is a percentage of; `distortion.maxAbs`: the largest difference of the radial percent
 *   distortion, shown and never judged; both inapplicable to a set without a probe;
 * - `exitPupil.maxScaled`: the largest difference of where a chief ray crosses the axis behind the system, times the
 *   larger of its two slopes there, mm; `exitPupil.maxAbs`: the difference along the axis, shown;
 * - `mask.mismatches` and `mask.rimBand`: as R2's, summed over the lines;
 * - `rays.compared`: the rays ok in both answers, over the lines; `rays.dropped`: those ok in one answer only.
 *
 * Not measured: a figure no ray of the span has in both answers (no ray ok in both, no crossing, a probe not ok in
 * both or of no scale). A line whose probe gives no distortion while other lines do is named in a note, with why. Not comparable: without the case; answers for different rays or surfaces, or to different
 * requests; a probe that is no ray of the set; a ray that crosses the axis in one answer and not in the other, or has
 * a distortion in one and not in the other.
 */
export const raysChiefComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: CHIEF_RAYS_RUNG,
  metrics: Object.freeze([
    { name: "landing.maxAbs", unit: "mm" },
    { name: "lateralColour.maxAbs", unit: "mm" },
    { name: "distortion.maxScaled", unit: "mm" },
    { name: "distortion.maxAbs", unit: "percent" },
    { name: "exitPupil.maxScaled", unit: "mm" },
    { name: "exitPupil.maxAbs", unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
  ]),
  spanOf,
  compare,
  recorded,
});
