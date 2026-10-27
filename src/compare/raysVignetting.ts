// The comparator of `rays.trace` for rung R11a: how much light of each field of LensVisualizer's vignetting tab two
// engines let through the same rays. A comparator of spans (`spanOf`): the beam sets of one line of a run are compared
// together, since every figure of a field is relative to the axis (src/rays/vignettingSets.ts).
//
// A beam set is the tab's own trace of one field (src/engines/lv/vignettingRaySets.ts): the cells of its launch
// lattice the tab traces, stated as a lattice of their own (`groups.lattice`), and after them the chief rays of the
// tab's image mapping, the field's own (`groups.chiefIndex`) and those 0.01 degrees to either side of it.
//
// Which rays got through is judged as R2 judges it (`mask.mismatches`, `mask.rimBand`): no other rung traces these
// rays, and it is the rung's first figure. Three figures more:
//
// - **The relative illumination** of each field, the flux its lit cells bring into the image (weight times the area
//   each cell covers in the optical direction cosines of the image space, the comparator's own estimator,
//   src/estimators/illumination.ts) over the axis's, on the rays ok in both answers: the two answers' difference
//   (`illumination.maxAbs`). The rays are the same and the weights are the request's, so what can differ is the exit
//   directions, through the area of the cells. The area of a beam in cosine space is of its rim (the central
//   differences of the cells telescope along a row and a column): an interior cell's direction enters it to second
//   order, and a difference `δ` of the rim's cosines moves the figure by about `2 δ / ρ`, `ρ` the beam's radius in
//   optical cosines (0.040 to 0.40 on the benchmark). Where the tab traces one half of a beam, the lattice is that half,
//   cut along the meridian, and the figure is that of the half over the axis's half.
// - **The transmission** of each field: the flux of the rays of `mask.mismatches` that one answer lets through and the
//   other does not (R2's mismatches: neither in the rim band nor failed by an engine) over the axis's flux on the rays
//   ok in both, on the launch plane (a cell's flux times the square of its lattice's step): how far each answer's own
//   transmitted fraction of the field is from the other's for want of a ray R2 would fail (`transmission.maxAbs`,
//   gated). Of the rays ok in both every estimate is the same bits in both answers, the same weights summed in the same
//   order; so this figure is of the disagreeing rays alone, and is 0 where they agree. It is a count over a total: one
//   cell of a field moves it by about one over the cells the axis lets through (about 1/1600 of a half lattice of 64
//   cells across). The flux of the other rays one answer lets through and the other does not, those in the rim band
//   and those an engine failed, which R2 judges in no count, is shown beside it the same way and never judged
//   (`transmission.rimBandOrFailed`).
// - **The landing** of each chief ray of the image mapping, ok in both answers: the largest difference along x or y
//   (`landing.maxAbs`), the transverse figure R2, R9a and R10a judge. The tab's image area of a field is
//   `(dh/dθ)(h / sin θ)` of these landings 0.01 degrees apart, so a landing's difference `δ` moves it by about
//   `δ / (f · 1.75e-4)` relative to it, `f` the focal length: the tab's own figure is that ill-conditioned, and the rung
//   judges the landings themselves.
//
// The members of a span are taken in an order of their own, the axis first, then by field angle and line, never in the
// order they are handed over: the first ray of a count and the field of a tie do not depend on it.
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { blockFlux, cosineFlux, launchArea } from "../estimators/illumination.ts";
import type { CosineFlux, IlluminationUnavailable } from "../estimators/illumination.ts";
import { intersectValidity, maskWhere } from "../estimators/validity.ts";
import { imageSpaceIndices } from "../rays/wavefront.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { maskMetrics, maskRay, rayEndings, tracedSurfaces } from "./raysGeometry.ts";
import { decodeTrace, placeOf } from "./raysRead.ts";
import type { DecodedTrace, Where } from "./raysRead.ts";
import type { SpanAnswer, SpanMember } from "./span.ts";

/** The rung of the vignetting tab's fields on identical rays. */
export const VIGNETTING_RAYS_RUNG = "r11a";

export const ILLUMINATION_METRIC = "illumination.maxAbs";
export const TRANSMISSION_METRIC = "transmission.maxAbs";
/** The landing of the chief rays of the tab's image mapping. */
export const LANDING_METRIC = "landing.maxAbs";
/** The transmission of the rays R2 judges in no count, shown beside `transmission.maxAbs` and never judged. */
export const RIM_OR_FAILED_TRANSMISSION_METRIC = "transmission.rimBandOrFailed";

/** The span of a request: the beam sets of one line of the run. */
function spanOf(spec: JsonObject): string {
  return canonicalJson({ pattern: "beam", line: (spec as RaysTraceSpec).line });
}

/**
 * The order the members of a span are taken in, whatever order they are handed over: the axis first, then by field
 * angle, then by line, then by request id.
 */
function memberOrder(one: SpanMember, two: SpanMember): number {
  const [specOne, specTwo] = [one.spec as RaysTraceSpec, two.spec as RaysTraceSpec];
  const angle = (spec: RaysTraceSpec) => spec.groups?.field?.angleDeg ?? Infinity;
  const [angleOne, angleTwo] = [angle(specOne), angle(specTwo)];
  const offAxis = (value: number) => (value === 0 ? 0 : 1);
  if (offAxis(angleOne) !== offAxis(angleTwo)) return offAxis(angleOne) - offAxis(angleTwo);
  if (angleOne !== angleTwo) return angleOne < angleTwo ? -1 : 1;
  if (specOne.line !== specTwo.line) return specOne.line - specTwo.line;
  return one.requestId < two.requestId ? -1 : one.requestId > two.requestId ? 1 : 0;
}

/** One member of a span as two engines traced it. */
interface Traced {
  readonly spec: RaysTraceSpec;
  readonly place: Where;
  readonly a: DecodedTrace;
  readonly b: DecodedTrace;
  /** The rays ok in both answers. */
  readonly valid: Uint8Array;
  /** The rays ok in exactly one that R2 counts as mask mismatches. */
  readonly mismatched: Uint8Array;
  /** The rays ok in exactly one that R2 counts in neither of its counts: in the rim band, or failed by an engine. */
  readonly rimOrFailed: Uint8Array;
  readonly weights: Float64Array;
}

/** The largest of a series of a figure and the place of the field it is of; the first of equal values is kept. */
interface Largest {
  value: number;
  where: Where | null;
}

function take(series: Largest, value: number, where: Where): void {
  if (series.where !== null && Number.isNaN(series.value)) return;
  if (series.where === null || Number.isNaN(value) || value > series.value) {
    series.value = value;
    series.where = where;
  }
}

/** The flux of the rays of a block that a mask takes, 0 where it takes none. */
function fluxOf(weights: Float64Array, mask: Uint8Array, first: number, end: number): number | IlluminationUnavailable {
  const made = blockFlux(weights, mask, first, end);
  if (made.available) return made.flux;
  return made.reason === "no-rays" ? 0 : made;
}

/** What a figure could not be measured of, the first reason. */
type Missing = { reason: string } | null;

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const never = (reason: string): ComparatorOutcome => ({ comparable: false, reason });
  const [membersA, membersB] = [(dataA as SpanAnswer).members, (dataB as SpanAnswer).members];
  if (
    membersA.length !== membersB.length ||
    membersA.some((member, at) => member.requestId !== membersB[at].requestId)
  ) {
    return never("the answers are not to the same requests of the span");
  }
  const pairs = membersA
    .map((member, at): readonly [SpanMember, SpanMember] => [member, membersB[at]])
    .sort(([one], [two]) => memberOrder(one, two));
  const traced: Traced[] = [];
  let [mismatches, rimBand, compared, dropped] = [0, 0, 0, 0];
  let [firstMismatch, firstRim, firstDropped]: (Where | null)[] = [null, null, null];
  for (const [member, other] of pairs) {
    const [a, b] = [decodeTrace(member.data), decodeTrace(other.data)];
    const surfaces = tracedSurfaces(a, b, context);
    if ("reason" in surfaces) return never(surfaces.reason);
    const spec = member.spec as RaysTraceSpec;
    const place = placeOf(member.spec);
    const [okA, okB] = [maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)];
    const valid = intersectValidity([okA, okB]);
    const [mismatched, rimOrFailed] = [new Uint8Array(a.rays), new Uint8Array(a.rays)];
    for (let ray = 0; ray < a.rays; ray++) {
      if (okA[ray] !== okB[ray]) {
        // Ok in one and not in the other: R2's mismatch, or a ray in the rim band or one an engine failed.
        (maskRay(a, b, surfaces, ray).kind === "mismatch" ? mismatched : rimOrFailed)[ray] = 1;
        if (dropped++ === 0) firstDropped = { ...place, ray };
      }
      if (valid[ray]) compared++;
    }
    const [mismatch, rim] = maskMetrics(a, b, surfaces, place);
    if (mismatch.value > 0 && firstMismatch === null) firstMismatch = mismatch.where ?? place;
    if (rim.value > 0 && firstRim === null) firstRim = rim.where ?? place;
    mismatches += mismatch.value;
    rimBand += rim.value;
    const weights = decodeNdArray(spec.weights).values as Float64Array;
    traced.push({ spec, place, a, b, valid, mismatched, rimOrFailed, weights });
  }

  // Every member is a beam: a lattice of the cells the tab traces, and its chief rays right after them.
  const unlike = traced.find(({ spec, a }) => {
    const { lattice, chiefIndex } = spec.groups ?? {};
    return lattice === undefined || chiefIndex !== lattice.columns * lattice.rows || !(chiefIndex < a.rays);
  });
  if (unlike !== undefined) {
    return never(`the set of ${JSON.stringify(unlike.place)} is no beam: no lattice with its chief ray right after it`);
  }
  const illumination: Largest = { value: 0, where: null };
  const transmission: Largest = { value: 0, where: null };
  const rimOrFailed: Largest = { value: 0, where: null };
  const landing: Largest = { value: 0, where: null };
  let illuminationMissing: Missing = null;
  let transmissionMissing: Missing = null;
  let fields = 0;
  // The fields with no flux into the image in either answer, for the same reason: named when others are measured.
  const skipped: string[] = [];

  // The landings of the chief rays of the tab's image mapping, ok in both answers.
  for (const { spec, a, b, valid, place } of traced) {
    for (let ray = spec.groups!.chiefIndex!; ray < a.rays; ray++) {
      if (!valid[ray]) continue;
      const along = Math.abs(a.imagePoint[3 * ray] - b.imagePoint[3 * ray]);
      const across = Math.abs(a.imagePoint[3 * ray + 1] - b.imagePoint[3 * ray + 1]);
      take(landing, Math.max(along, across), { ...place, ray });
    }
  }

  const axis = traced.find((member) => member.spec.groups?.field?.angleDeg === 0);
  if (axis === undefined) {
    const reason = "no-axis: the span has no lattice of the axis, which every field is relative to";
    [illuminationMissing, transmissionMissing] = [{ reason }, { reason }];
  } else {
    if (context?.opticalCase === undefined) {
      return never("the case is not at hand: the index of its image space is what the cosines are of");
    }
    const imageIndex = imageSpaceIndices(context.opticalCase)[axis.spec.line];
    const cosine = (member: Traced, trace: DecodedTrace): CosineFlux | IlluminationUnavailable => {
      const { columns, rows, step } = member.spec.groups!.lattice!;
      return cosineFlux({
        columns,
        rows,
        step,
        weight: member.weights,
        valid: member.valid,
        point: trace.imagePoint,
        direction: trace.exitDirection,
        imageIndex,
      });
    };
    // The transmission: the flux of the rays one answer lets through and the other does not, on the launch plane,
    // over the axis's: of R2's mismatches (judged), and of the rays in the rim band or failed (shown).
    const launchFlux = (member: Traced, mask: Uint8Array): number | IlluminationUnavailable => {
      const { columns, rows, step } = member.spec.groups!.lattice!;
      const flux = fluxOf(member.weights, mask, 0, columns * rows);
      return typeof flux === "number" ? flux * (step * step) : flux;
    };
    const axisFlux = launchFlux(axis, axis.valid);
    if (typeof axisFlux !== "number") {
      transmissionMissing = { reason: `${axisFlux.reason}: the axis: ${axisFlux.message}` };
    } else if (!(axisFlux > 0)) {
      transmissionMissing = { reason: "no-flux: no cell of the axis is ok in both answers" };
    } else {
      for (const member of traced) {
        for (const [series, mask] of [
          [transmission, member.mismatched],
          [rimOrFailed, member.rimOrFailed],
        ] as const) {
          const apart = launchFlux(member, mask);
          if (typeof apart !== "number") return never(`the field at ${member.place.field} degrees: ${apart.message}`);
          take(series, apart / axisFlux, member.place);
        }
      }
    }
    // The relative illumination: each answer's flux into the image of a field over its flux of the axis.
    const [axisA, axisB] = [cosine(axis, axis.a), cosine(axis, axis.b)];
    if (axisA.available !== axisB.available) {
      const missing = (axisA.available ? axisB : axisA) as IlluminationUnavailable;
      return never(`the axis has a flux into the image in one answer and none in the other: ${missing.reason}`);
    }
    if (!axisA.available || !axisB.available) {
      const missing = axisA as IlluminationUnavailable;
      illuminationMissing = { reason: `${missing.reason}: the axis: ${missing.message}` };
    } else {
      for (const member of traced) {
        const [fieldA, fieldB] = [cosine(member, member.a), cosine(member, member.b)];
        if (fieldA.available && fieldB.available) {
          take(illumination, Math.abs(fieldA.flux / axisA.flux - fieldB.flux / axisB.flux), member.place);
          fields++;
          continue;
        }
        if (!fieldA.available && !fieldB.available && fieldA.reason === fieldB.reason) {
          const at = `the field at ${member.place.field} degrees`;
          illuminationMissing ??= { reason: `${fieldA.reason}: ${at}: ${fieldA.message}` };
          skipped.push(`${at}: ${fieldA.reason}`);
          continue;
        }
        const said = (made: CosineFlux | IlluminationUnavailable) =>
          made.available ? "has a flux into the image" : `has none: ${made.reason}`;
        return never(
          `the field at ${member.place.field} degrees in the first answer ${said(fieldA)}, in the second ${said(fieldB)}`,
        );
      }
    }
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: { name: string; reason: string }[] = [];
  const figure = (name: string, series: Largest, missing: Missing, none: string): void => {
    if (series.where !== null) metrics.push({ name, value: series.value, where: series.where });
    else unmeasured.push({ name, reason: missing?.reason ?? none });
  };
  const notes: string[] = [];
  figure(ILLUMINATION_METRIC, illumination, illuminationMissing, "no-rays: no field is ok in both answers");
  // A field in no figure of the others' is named, never passed over.
  if (illumination.where !== null) for (const field of skipped) notes.push(`${ILLUMINATION_METRIC} is not of ${field}`);
  figure(TRANSMISSION_METRIC, transmission, transmissionMissing, "no-rays: no field is ok in both answers");
  figure(
    RIM_OR_FAILED_TRANSMISSION_METRIC,
    rimOrFailed,
    transmissionMissing,
    "no-rays: no field is ok in both answers",
  );
  figure(LANDING_METRIC, landing, null, "no-rays: no chief ray of the image mapping is ok in both answers");
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
    { name: "fields.compared", value: fields },
  );
  return {
    comparable: true,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What one answer reports beside what is compared, one value a field of the span in the span's order (the axis first,
 * then by field angle: `memberOrder`), whatever order the members are handed over in: how many of its rays ended in
 * each way (as R2 records them, of the field's set), and the field's own figures of the cells it brought to the image:
 * the transmitted area on the launch plane and the flux into the image, each over the axis's (`geometricTransmission`,
 * `relativeIllumination`). NaN where the answer has none. Written down, never judged.
 */
function recorded(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] } {
  const members = [...(data as SpanAnswer).members].sort(memberOrder);
  const values: { [name: string]: number[] } = {};
  const push = (name: string, value: number) => (values[name] ??= []).push(value);
  const indices = context?.opticalCase === undefined ? undefined : imageSpaceIndices(context.opticalCase);
  const own = members.map((member) => {
    const spec = member.spec as RaysTraceSpec;
    const trace = decodeTrace(member.data);
    const { columns, rows, step } = spec.groups!.lattice!;
    const valid = maskWhere(trace.status, RAY_STATUS.ok);
    const weight = decodeNdArray(spec.weights).values as Float64Array;
    const area = launchArea({ columns, rows, step, valid });
    const flux =
      indices === undefined
        ? null
        : cosineFlux({
            columns,
            rows,
            step,
            weight,
            valid,
            point: trace.imagePoint,
            direction: trace.exitDirection,
            imageIndex: indices[spec.line],
          });
    return { spec, area, flux };
  });
  const axis = own.find(({ spec }) => spec.groups?.field?.angleDeg === 0);
  for (const [at, member] of members.entries()) {
    for (const [name, [value]] of Object.entries(rayEndings(member.data))) push(name, value);
    const { spec, area, flux } = own[at];
    push("fieldAngleDeg", spec.groups?.field?.angleDeg ?? Number.NaN);
    push(
      "geometricTransmission",
      axis !== undefined && area.available && axis.area.available ? area.areaMm2 / axis.area.areaMm2 : Number.NaN,
    );
    push(
      "relativeIllumination",
      axis !== undefined && flux?.available === true && axis.flux?.available === true
        ? flux.flux / axis.flux.flux
        : Number.NaN,
    );
  }
  return values;
}

/**
 * The comparator of `rays.trace` for rung R11a: how much light of each field of LensVisualizer's vignetting tab two
 * engines let through the same rays. A comparator of spans (`spanOf`: the beam sets of one line), each answer a
 * `SpanAnswer`, its members taken in an order of their own (`memberOrder`).
 *
 * Metrics, each with the `line` and the `field` of its largest value in `where` (and the `ray` of a landing), the first
 * on a tie:
 *
 * - `illumination.maxAbs`: the largest difference of a field's flux into the image over the axis's, on the rays ok in
 *   both answers;
 * - `transmission.maxAbs`: the largest flux of a field's cells that are ok in one answer and not in the other and are
 *   R2's mask mismatches, over the axis's flux on the rays ok in both, on the launch plane;
 * - `transmission.rimBandOrFailed`: the same of the rays ok in one answer only that R2 counts as no mismatch, those in
 *   the rim band and those an engine failed; shown, never judged;
 * - `landing.maxAbs`: the largest difference of a landing of a chief ray of the image mapping, along x or y, mm;
 * - `mask.mismatches` and `mask.rimBand`: as R2's, summed over the span;
 * - `rays.compared`: the rays ok in both answers; `rays.dropped`: those ok in one answer only, with the first in
 *   `where`; `fields.compared`: the fields with a flux into the image in both answers.
 *
 * Not measured: a figure without the axis (no beam of the axis in the span, no ray of it ok in both, a flux of 0 or
 * an axis whose lit cells have no area in cosine space in either answer), or with no field of both; a landing of no
 * chief ray ok in both. A field whose lit cells have no area in cosine space in either answer, for the same reason, is
 * named in a note when others are measured. Not comparable: without the case; answers for different rays or surfaces,
 * or to different requests; a set that is no beam (no lattice with its chief ray right after it); a field with a flux
 * into the image in one answer and none, or none for another reason, in the other.
 */
export const raysVignettingComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: VIGNETTING_RAYS_RUNG,
  metrics: Object.freeze([
    { name: ILLUMINATION_METRIC, unit: "1" },
    { name: TRANSMISSION_METRIC, unit: "1" },
    { name: RIM_OR_FAILED_TRANSMISSION_METRIC, unit: "1" },
    { name: LANDING_METRIC, unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
    { name: "fields.compared", unit: "elements" },
  ]),
  spanOf,
  compare,
  recorded,
});
