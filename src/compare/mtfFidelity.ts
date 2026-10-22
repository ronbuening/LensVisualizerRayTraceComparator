// The comparator of `mtf.native` for rung R4f: two answers to one request, LensVisualizer's own geometric MTF and
// the comparator's estimator on a replay of the same sampling, held to each other curve by curve and count by
// count. It reads nothing but the two answers and, for the frequencies, the request.
import type { JsonObject } from "../contract/json.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeField, MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";

/**
 * What both answers state of how a field was sampled, and what must be equal for the replay to be of the same
 * sampling: the grid the refinement ended at, and how many rays landed, were stopped and were not resolved, summed
 * over the lines.
 */
export const FIDELITY_SAMPLING = ["gridSize", "validRays", "blockedRays", "failedRays"] as const;

const CUTS = ["sagittal", "tangential"] as const;

/** A value of a sampling record, or NaN where the record has none under the name. */
function sampled(field: MtfNativeField, name: string): number {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : Number.NaN;
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as MtfNativeData, dataB as MtfNativeData];
  if (a.fields.length !== b.fields.length) {
    const reason = `the answers are for ${a.fields.length} and ${b.fields.length} fields: they answer different requests`;
    return { comparable: false, reason };
  }
  const at = a.fields.findIndex((field, index) => field.field !== b.fields[index].field);
  if (at >= 0) {
    const reason = `field ${at} is ${a.fields[at].field} in one answer and ${b.fields[at].field} in the other`;
    return { comparable: false, reason };
  }
  if (a.focus.mode !== b.focus.mode || a.focus.appliedShiftMm !== b.focus.appliedShiftMm) {
    const said = (data: MtfNativeData): string => `${data.focus.mode} at ${data.focus.appliedShiftMm} mm`;
    return { comparable: false, reason: `the answers are of different planes: ${said(a)} and ${said(b)}` };
  }
  const frequencies = (context?.spec as MtfNativeSpec | undefined)?.frequenciesPerMm;

  let fieldMismatches = 0;
  let samplingMismatches = 0;
  let worst: ComputedMetric | null = null;
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const sameStatus = fieldA.status === fieldB.status && fieldA.reason === fieldB.reason;
    if (!sameStatus) fieldMismatches++;
    for (const name of FIDELITY_SAMPLING) {
      // A count both answers lack is no difference; one that only one has, or that is another number, is.
      if (!Object.is(sampled(fieldA, name), sampled(fieldB, name))) samplingMismatches++;
    }
    if (fieldA.status === "unavailable" || fieldB.status === "unavailable") continue;
    for (const cut of CUTS) {
      const [curveA, curveB] = [decodeNdArray(fieldA[cut]).values, decodeNdArray(fieldB[cut]).values];
      if (curveA.length !== curveB.length) {
        const reason = `the ${cut} curves of field ${fieldA.field} hold ${curveA.length} and ${curveB.length} values`;
        return { comparable: false, reason };
      }
      for (let frequency = 0; frequency < curveA.length; frequency++) {
        const value = Math.abs((curveA[frequency] as number) - (curveB[frequency] as number));
        // The first of equal values is kept, and a NaN, which no curve of an available field holds, would stay.
        if (worst !== null && (Number.isNaN(worst.value) || !(value > worst.value || Number.isNaN(value)))) continue;
        const where: ComputedMetric["where"] =
          frequencies === undefined
            ? { field: fieldA.field, cut, frequencyIndex: frequency }
            : { field: fieldA.field, cut, frequencyPerMm: frequencies[frequency] };
        worst = { name: "mtf.maxAbs", value, where };
      }
    }
  }
  const counts: ComputedMetric[] = [
    { name: "sampling.mismatches", value: samplingMismatches },
    { name: "fields.mismatches", value: fieldMismatches },
  ];
  if (worst !== null) return { comparable: true, metrics: [worst, ...counts] };
  const reason = "no field has curves in both answers";
  return { comparable: true, metrics: counts, unmeasured: [{ name: "mtf.maxAbs", reason }] };
}

/** What an answer states of each field's sampling, in the order of the fields; NaN where it states none. */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const { fields } = data as MtfNativeData;
  return Object.fromEntries(FIDELITY_SAMPLING.map((name) => [name, fields.map((field) => sampled(field, name))]));
}

/**
 * The comparator of `mtf.native` for rung R4f: LensVisualizer's own geometric MTF against the comparator's estimator
 * on a replay of the same sampling.
 *
 * - `mtf.maxAbs`: the largest difference of two MTF values, over every field that has curves in both answers, both
 *   cuts and every frequency, with the `field` as it was requested, the `cut` and the frequency in `where`
 *   (`frequencyPerMm` where the request is at hand, else `frequencyIndex`), the first on a tie. Where no field has
 *   curves in both answers it is not measured.
 * - `sampling.mismatches`: how many of the values of `FIDELITY_SAMPLING`, over the fields, are not the same number
 *   in both answers: the grid a field's refinement ended at, and its counts of rays. A value only one answer
 *   states is one.
 * - `fields.mismatches`: how many fields have another status in one answer than in the other, or another reason.
 *
 * What each answer states of every field's sampling is recorded beside the comparison, by the names of
 * `FIDELITY_SAMPLING`, one value a field.
 *
 * Answers for different numbers of fields, for other fields, of other planes, or with curves of different lengths
 * are not comparable: they do not answer the same request.
 */
export const mtfFidelityComparator: QuantityComparator = Object.freeze({
  quantity: MTF_NATIVE,
  rung: "r4f",
  metrics: Object.freeze([
    { name: "mtf.maxAbs", unit: "1" },
    { name: "sampling.mismatches", unit: "elements" },
    { name: "fields.mismatches", unit: "elements" },
  ]),
  compare,
  recorded,
});
