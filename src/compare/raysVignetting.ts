// The comparator of `rays.trace` for rung R11a: how much light of each field of LensVisualizer's vignetting tab two
// engines let through the same rays. A comparator of spans (`spanOf`): the sets of one pattern at one line of a run
// are compared together, since every figure of a field is relative to the axis (src/rays/vignettingSets.ts).
//
// Which rays got through is judged as R2 judges it (`mask.mismatches`, `mask.rimBand`): no other rung traces these
// rays, and it is the rung's first figure. Two figures more, each of the comparator's own estimator
// (src/estimators/illumination.ts):
//
// - **The relative illumination** of each field of a lattice set, the flux its lit cells bring into the image (weight
//   times the area each cell covers in the optical direction cosines of the image space) over the axis's, on the rays
//   ok in both answers: the two answers' difference (`illumination.maxAbs`). The rays are the same and the weights are
//   the request's, so what can differ is the exit directions, through the area of the cells. The area of a beam in
//   cosine space is of its rim (the central differences of the cells telescope along a row and a column): an interior
//   cell's direction enters it to second order, and a difference `δ` of the rim's cosines moves the figure by about
//   `2 δ / ρ`, `ρ` the beam's radius in optical cosines (0.040 to 0.40 on the benchmark). It is the rung's only figure of
//   the traced numbers.
// - **The transmission** of each field: the flux of the rays of `mask.mismatches` that one answer lets through and the
//   other does not (R2's mismatches: neither in the rim band nor failed by an engine) over the axis's flux on the rays
//   ok in both, on the launch plane (a lattice cell's flux times the square of its lattice's step; a sweep's rays, of
//   one spacing, by their weights alone): how far each answer's own transmitted fraction of the field is from the
//   other's for want of a ray R2 would fail (`transmission.maxAbs`, gated). Of the rays ok in both every estimate is
//   the same bits in both answers, the same weights summed in the same order; so this figure is of the disagreeing rays
//   alone, and is 0 where they agree. It is a count over a total: one ray of a field moves it by about one over the
//   rays the axis lets through (1/192 of the tab's sweep, about 1/800 of a lattice of 32 cells). The flux of the other
//   rays one answer lets through and the other does not, those in the rim band and those an engine failed, which R2
//   judges in no count, is shown beside it the same way and never judged (`transmission.rimBandOrFailed`).
//
// The members of a lattice span are taken in an order of their own, the axis first, then by field angle and line,
// never in the order they are handed over: the first ray of a count and the field of a tie do not depend on it.
//
// LensVisualizer's tab presents its geometric transmission and relative illumination from the sweep's counts alone; a
// sweep set has no area, and only the mask and the transmission are of it.
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
/** The transmission of the rays R2 judges in no count, shown beside `transmission.maxAbs` and never judged. */
export const RIM_OR_FAILED_TRANSMISSION_METRIC = "transmission.rimBandOrFailed";

/** The two patterns of a vignetting set: a sweep states no lattice, a lattice set does. */
type Pattern = "sweep" | "lattice";

function patternOf(spec: JsonObject): Pattern {
  return (spec as RaysTraceSpec).groups?.lattice === undefined ? "sweep" : "lattice";
}

/** The span of a request: the sets of one pattern at one line of the run. */
function spanOf(spec: JsonObject): string {
  return canonicalJson({ pattern: patternOf(spec), line: (spec as RaysTraceSpec).line });
}

/**
 * The order the members of a span are taken in, whatever order they are handed over: the axis first, then by field
 * angle, then by line, then by request id. A sweep set states no field and is alone in its span.
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

/** A block of consecutive rays of a sweep: one field, launched along one direction. */
interface Block {
  readonly first: number;
  readonly end: number;
}

/** The fields of a sweep set: blocks of consecutive rays of one direction, the axis first. */
export function sweepBlocks(spec: RaysTraceSpec): Block[] {
  const d = decodeNdArray(spec.directions).values as Float64Array;
  const rays = d.length / 3;
  const same = (a: number, b: number) =>
    d[3 * a] === d[3 * b] && d[3 * a + 1] === d[3 * b + 1] && d[3 * a + 2] === d[3 * b + 2];
  const blocks: Block[] = [];
  let first = 0;
  while (first < rays) {
    let end = first + 1;
    while (end < rays && same(end, first)) end++;
    blocks.push({ first, end });
    first = end;
  }
  return blocks;
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

  const pattern = patternOf(traced[0].spec);
  const illumination: Largest = { value: 0, where: null };
  const transmission: Largest = { value: 0, where: null };
  const rimOrFailed: Largest = { value: 0, where: null };
  let illuminationMissing: Missing = null;
  let transmissionMissing: Missing = null;
  let fields = 0;
  // The fields with no flux into the image in either answer, for the same reason: named when others are measured.
  const skipped: string[] = [];

  if (pattern === "sweep") {
    // One member: the fields are its blocks, the axis first, of one spacing of rays.
    const [member] = traced;
    const { spec, valid, weights, place } = member;
    const blocks = sweepBlocks(spec);
    const axis = fluxOf(weights, valid, blocks[0].first, blocks[0].end);
    if (typeof axis !== "number") transmissionMissing = { reason: `${axis.reason}: the axis: ${axis.message}` };
    else if (!(axis > 0)) transmissionMissing = { reason: "no-flux: no ray of the axis is ok in both answers" };
    else {
      for (const block of blocks) {
        for (const [series, mask] of [
          [transmission, member.mismatched],
          [rimOrFailed, member.rimOrFailed],
        ] as const) {
          const apart = fluxOf(weights, mask, block.first, block.end);
          if (typeof apart !== "number") return never(`the sweep from ray ${block.first}: ${apart.message}`);
          take(series, apart / axis, { ...place, ray: block.first });
        }
      }
    }
  } else {
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
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: { name: string; reason: string }[] = [];
  const inapplicable: string[] = [];
  const figure = (name: string, series: Largest, missing: Missing, none: string): void => {
    if (series.where !== null) metrics.push({ name, value: series.value, where: series.where });
    else unmeasured.push({ name, reason: missing?.reason ?? none });
  };
  const notes: string[] = [];
  if (pattern === "sweep") inapplicable.push(ILLUMINATION_METRIC);
  else {
    figure(ILLUMINATION_METRIC, illumination, illuminationMissing, "no-rays: no field is ok in both answers");
    // A field in no figure of the others' is named, never passed over.
    if (illumination.where !== null)
      for (const field of skipped) notes.push(`${ILLUMINATION_METRIC} is not of ${field}`);
  }
  figure(TRANSMISSION_METRIC, transmission, transmissionMissing, "no-rays: no field is ok in both answers");
  figure(
    RIM_OR_FAILED_TRANSMISSION_METRIC,
    rimOrFailed,
    transmissionMissing,
    "no-rays: no field is ok in both answers",
  );
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
    ...(inapplicable.length === 0 ? {} : { inapplicable }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What one answer reports beside what is compared, one value a field of the span in the span's order (the axis first,
 * then by field angle: `memberOrder`), whatever order the members are handed over in: how many of its rays
 * ended in each way (as R2 records them, of a lattice field's set; of a sweep, its one set), and each field's own
 * figures of the rays it brought to the image: of a lattice, the transmitted area on the launch plane and the flux into
 * the image, each over the axis's (`geometricTransmission`, `relativeIllumination`); of a sweep, the fraction of its
 * rays and of their flux that got through, over the axis's, the tab's own figures before its cos^4
 * (`geometricTransmission`, `transmittedFlux`). NaN where the answer has none. Written down, never judged.
 */
function recorded(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] } {
  const members = [...(data as SpanAnswer).members].sort(memberOrder);
  const values: { [name: string]: number[] } = {};
  const push = (name: string, value: number) => (values[name] ??= []).push(value);
  const first = members[0].spec as RaysTraceSpec;
  if (patternOf(members[0].spec) === "sweep") {
    const trace = decodeTrace(members[0].data);
    for (const [name, [value]] of Object.entries(rayEndings(members[0].data))) push(name, value);
    const ok = maskWhere(trace.status, RAY_STATUS.ok);
    const weights = decodeNdArray(first.weights).values as Float64Array;
    const blocks = sweepBlocks(first);
    const axis = blockFlux(weights, ok, blocks[0].first, blocks[0].end);
    const axisSize = blocks[0].end - blocks[0].first;
    for (const block of blocks) {
      const made = blockFlux(weights, ok, block.first, block.end);
      const size = block.end - block.first;
      const [rays, flux] = made.available ? [made.rays, made.flux] : [0, 0];
      const share = (field: number, onAxis: number) => (axis.available && onAxis > 0 ? field / onAxis : Number.NaN);
      push("geometricTransmission", share(rays / size, axis.available ? axis.rays / axisSize : 0));
      push("transmittedFlux", share(flux / size, axis.available ? axis.flux / axisSize : 0));
    }
    return values;
  }
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
 * engines let through the same rays. A comparator of spans (`spanOf`: the sets of one pattern, sweep or lattice, at
 * one line), each answer a `SpanAnswer`, its members taken in an order of their own (`memberOrder`).
 *
 * Metrics, each with the `line` and the `field` of its largest value in `where` (of a sweep, which states no field
 * angle, the first ray of the field's block), the first on a tie:
 *
 * - `illumination.maxAbs`: of a lattice span, the largest difference of a field's flux into the image over the axis's,
 *   on the rays ok in both answers; inapplicable to a sweep, which has no area;
 * - `transmission.maxAbs`: the largest flux of a field's rays that are ok in one answer and not in the other and are
 *   R2's mask mismatches, over the axis's flux on the rays ok in both, on the launch plane;
 * - `transmission.rimBandOrFailed`: the same of the rays ok in one answer only that R2 counts as no mismatch, those in
 *   the rim band and those an engine failed; shown, never judged;
 * - `mask.mismatches` and `mask.rimBand`: as R2's, summed over the span;
 * - `rays.compared`: the rays ok in both answers; `rays.dropped`: those ok in one answer only, with the first in
 *   `where`; `fields.compared`: the lattice fields with a flux into the image in both answers.
 *
 * Not measured: a figure without the axis (no lattice of the axis in the span, no ray of it ok in both, a flux of 0 or
 * an axis whose lit cells have no area in cosine space in either answer), or with no field of both. A field whose lit
 * cells have no area in cosine space in either answer, for the same reason, is named in a note when others are
 * measured. Not comparable:
 * without the case; answers for different rays or surfaces, or to different requests; a field with a flux into the
 * image in one answer and none, or none for another reason, in the other.
 */
export const raysVignettingComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: VIGNETTING_RAYS_RUNG,
  metrics: Object.freeze([
    { name: ILLUMINATION_METRIC, unit: "1" },
    { name: TRANSMISSION_METRIC, unit: "1" },
    { name: RIM_OR_FAILED_TRANSMISSION_METRIC, unit: "1" },
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
