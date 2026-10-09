// The comparator of `mtf.native` for rung R6b: two answers to one request for the diffraction MTF of a case,
// LensVisualizer's own estimate and the comparator's wave estimator on LensVisualizer's rays, set beside each other
// field by field. Each is an estimate by its own method and its own sampling: nothing here is gated. It reads
// nothing but the two answers and, for the frequencies, the request.
import type { JsonObject } from "../contract/json.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeField, MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";

/**
 * What each answer states of how a field was sampled, recorded beside the comparison: the grid its curves are of,
 * the rays that landed, how far its MTF moved between its last two grids, the largest step of the path between
 * neighbouring cells, in waves, and the frequency its own convergence test passed through. An engine states the
 * ones it has.
 */
export const WAVE_SAMPLING = ["gridSize", "validRays", "maxDelta", "phaseStepWaves", "convergedThroughLpMm"] as const;

const CUTS = ["sagittal", "tangential"] as const;

/**
 * The class of the difference of one field, of the classes of the comparison ladder:
 *
 * - `unsupported`: an answer has no curve of the field, so there is no difference;
 * - `numerical`: an answer says that its sampling of the field did not settle (status "unconverged"): the
 *   difference is of a sampling, and neither figure is an arbiter of the other;
 * - `method`: both answers stand by their curves: the difference is of two methods.
 */
export type WaveDifferenceClass = "unsupported" | "numerical" | "method";

/** The class of the difference of a field from what the two answers say of it. */
export function waveDifferenceClass(a: MtfNativeField, b: MtfNativeField): WaveDifferenceClass {
  if (a.status === "unavailable" || b.status === "unavailable") return "unsupported";
  return a.status === "ok" && b.status === "ok" ? "method" : "numerical";
}

/** A value of a sampling record, or NaN where the record has none under the name. */
function sampled(field: MtfNativeField, name: string): number {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : Number.NaN;
}

/** What an answer says of a field that is not "ok", as `<method>: <status> (<reason>)`. */
function saidOf(data: MtfNativeData, field: MtfNativeField): string {
  return `${data.method.name}: ${field.status}${field.reason === undefined ? "" : ` (${field.reason})`}`;
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as MtfNativeData, dataB as MtfNativeData];
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((first, second) => first - second);
    return {
      comparable: false,
      reason: `the answers are for ${fewer} and ${more} fields: they answer different requests`,
    };
  }
  const at = a.fields.findIndex((field, index) => field.field !== b.fields[index].field);
  if (at >= 0) {
    const [low, high] = [a.fields[at].field, b.fields[at].field].sort((first, second) => first - second);
    return { comparable: false, reason: `field ${at} is ${low} in one answer and ${high} in the other` };
  }
  if (a.focus.mode !== b.focus.mode || a.focus.appliedShiftMm !== b.focus.appliedShiftMm) {
    const said = [a, b].map((data) => `${data.focus.mode} at ${data.focus.appliedShiftMm} mm`).sort();
    return { comparable: false, reason: `the answers are of different planes: ${said.join(" and ")}` };
  }
  const frequencies = (context?.spec as MtfNativeSpec | undefined)?.frequenciesPerMm;

  const worst: { onAxis: ComputedMetric | null; offAxis: ComputedMetric | null; flagged: ComputedMetric | null } = {
    onAxis: null,
    offAxis: null,
    flagged: null,
  };
  const names = { onAxis: "mtfOnAxis.maxAbs", offAxis: "mtfOffAxis.maxAbs", flagged: "mtfFlagged.maxAbs" } as const;
  const counts = { compared: 0, flagged: 0, unavailable: 0 };
  // Why a band has no field: what each answer says of the fields that were left out of it.
  const leftOut: { onAxis: string[]; offAxis: string[] } = { onAxis: [], offAxis: [] };
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const band = fieldA.field === 0 ? "onAxis" : "offAxis";
    const kind = waveDifferenceClass(fieldA, fieldB);
    if (kind !== "method") {
      // In the order of the methods' names, so that the text is the same whichever answer comes first.
      const said = [[a, fieldA] as const, [b, fieldB] as const]
        .filter(([, field]) => field.status !== "ok")
        .map(([data, field]) => saidOf(data, field))
        .sort();
      leftOut[band].push(`field ${fieldA.field}: ${said.join("; ")}`);
    }
    if (kind === "unsupported") {
      counts.unavailable++;
      continue;
    }
    const slot = kind === "method" ? band : "flagged";
    if (kind === "method") counts.compared++;
    else counts.flagged++;
    for (const cut of CUTS) {
      const [curveA, curveB] = [decodeNdArray(fieldA[cut]).values, decodeNdArray(fieldB[cut]).values];
      if (curveA.length !== curveB.length) {
        const [fewer, more] = [curveA.length, curveB.length].sort((first, second) => first - second);
        const reason = `the ${cut} curves of field ${fieldA.field} hold ${fewer} and ${more} values`;
        return { comparable: false, reason };
      }
      for (let frequency = 0; frequency < curveA.length; frequency++) {
        const value = Math.abs((curveA[frequency] as number) - (curveB[frequency] as number));
        const held = worst[slot];
        // The first of equal values is kept; no curve of an available field holds a NaN.
        if (held !== null && !(value > held.value)) continue;
        const where: ComputedMetric["where"] =
          frequencies === undefined
            ? { field: fieldA.field, cut, frequencyIndex: frequency }
            : { field: fieldA.field, cut, frequencyPerMm: frequencies[frequency] };
        worst[slot] = { name: names[slot], value, where };
      }
    }
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: { name: string; reason: string }[] = [];
  for (const band of ["onAxis", "offAxis"] as const) {
    const figure = worst[band];
    if (figure !== null) metrics.push(figure);
    else {
      const why = leftOut[band].length === 0 ? "the request has no such field" : leftOut[band].join(", ");
      const where = band === "onAxis" ? "on the axis" : "off the axis";
      unmeasured.push({
        name: names[band],
        reason: `no field ${where} has curves both answers stand by: ${why}`,
      });
    }
  }
  if (worst.flagged !== null) metrics.push(worst.flagged);
  metrics.push(
    { name: "fields.compared", value: counts.compared },
    { name: "fields.flagged", value: counts.flagged },
    { name: "fields.unavailable", value: counts.unavailable },
  );
  return { comparable: true, metrics, ...(unmeasured.length === 0 ? {} : { unmeasured }) };
}

/** What an answer states of each field's sampling, and whether it stands by the field; NaN where it states none. */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const { fields } = data as MtfNativeData;
  const settled = fields.map((field) => (field.status === "ok" ? 1 : field.status === "unconverged" ? 0 : Number.NaN));
  return {
    ...Object.fromEntries(WAVE_SAMPLING.map((name) => [name, fields.map((field) => sampled(field, name))])),
    settled,
  };
}

/**
 * The comparator of `mtf.native` for rung R6b: LensVisualizer's own diffraction MTF beside the comparator's wave
 * estimator on LensVisualizer's rays. Two methods, each with its own sampling: the rung is recorded, and a figure
 * outside its band is marked for attention and fails nothing.
 *
 * Each field has the class of its difference (`waveDifferenceClass`), and each class its own figure:
 *
 * - `mtfOnAxis.maxAbs` and `mtfOffAxis.maxAbs` (class `method`): the largest difference of two MTF values over
 *   both cuts and every frequency, on the field that was requested as 0 and on every other field, over the fields
 *   both answers stand by (status "ok" in both). They are the figures the policy gives a band, 0.005 and 0.01. One
 *   that has no such field is not measured, and the reason says what each answer says of the fields left out;
 * - `mtfFlagged.maxAbs` (class `numerical`): the same over the fields an answer calls "unconverged": written
 *   down, in no band, and left out where there is none;
 * - `fields.compared`, `fields.flagged`, `fields.unavailable`: how many fields are of each class, the last being
 *   the fields an answer has no curve of (class `unsupported`).
 *
 * Every figure has the `field` as it was requested, the `cut` and the frequency in `where` (`frequencyPerMm` where
 * the request is at hand, else `frequencyIndex`), the first on a tie.
 *
 * What each answer states of every field's sampling is recorded beside the comparison, by the names of
 * `WAVE_SAMPLING`, one value a field, and under `settled` whether it stands by the field: 1 for "ok", 0 for
 * "unconverged".
 *
 * Answers for different numbers of fields, for other fields, of other planes, or with curves of different lengths
 * are not comparable: they do not answer the same request.
 */
export const mtfWaveComparator: QuantityComparator = Object.freeze({
  quantity: MTF_NATIVE,
  rung: "r6b",
  metrics: Object.freeze([
    { name: "mtfOnAxis.maxAbs", unit: "1" },
    { name: "mtfOffAxis.maxAbs", unit: "1" },
    { name: "mtfFlagged.maxAbs", unit: "1" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.flagged", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
