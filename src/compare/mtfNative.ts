// The comparator of `mtf.native` for rung R5: two engines' own diffraction MTF of one case, each by its own method
// and its own sampling, set beside each other field by field. LensVisualizer's product MTF beside optiland's FFT
// MTF is the pair the rung is named for; the comparator's wave estimator on LensVisualizer's rays stands beside
// both. Nothing here is gated, and no figure of it says that one method is right.
//
// A field is sorted before any difference is taken (`classifyNativeField`), by the classes of the comparison
// ladder in their order, and only a field of two methods that both stand by their curves, of one image point,
// with frequency axes of the beam, enters a band. The sorting reads a few numbers of each answer and nothing
// else, so that a report can repeat it from the values a comparison records.
import type { RecordedValues } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeField, MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type {
  ComparatorOutcome,
  ComparisonContext,
  ComputedMetric,
  QuantityComparator,
  UnmeasuredMetric,
} from "./comparator.ts";
import { numberText } from "./metricText.ts";

/** The rung this comparator is of. */
export const NATIVE_MTF_RUNG = "r5";

/** The two cuts of an MTF, in the order a table lists them. */
export const MTF_CUTS = ["sagittal", "tangential"] as const;
/** One cut of an MTF. */
export type MtfCut = (typeof MTF_CUTS)[number];

/** The metric whose band in the policy says how far apart two chief rays may land and be of one field, mm. */
export const CHIEF_LANDING_METRIC = "chiefLanding.maxAbs";
/** The metrics of the fields in a band: the field on the axis, and every other. */
export const ON_AXIS_METRIC = "mtfOnAxis.maxAbs";
export const OFF_AXIS_METRIC = "mtfOffAxis.maxAbs";

/**
 * What each answer states of how a field was sampled, recorded beside the comparison, by the engines' own names:
 * the grid and the rays its curves are of, how far they moved between its last two samplings, and, of optiland,
 * what became of the four rim rays it calibrates its frequency axes with. An engine states the ones it has.
 */
export const NATIVE_SAMPLING = [
  "gridSize",
  "numRays",
  "coarseNumRays",
  "validRays",
  "maxDelta",
  "phaseStepWaves",
  "convergedThroughLpMm",
  "rimRaysLit",
  "rimRaysLost",
  "rimLandingSpreadMm",
  "workingFNumber",
] as const;

/** The name a recorded MTF value has: the cut and the frequency, cycles/mm, as `sagittal@30`. */
export function curveValueName(cut: MtfCut, frequencyPerMm: number): string {
  return `${cut}@${String(frequencyPerMm)}`;
}

/**
 * The class of the difference of one field, of the classes of the comparison ladder, decided in their order:
 *
 * - `unsupported`: an answer has no curve of the field, so there is no difference;
 * - `data`: the two answers are not of the same input: they are of different lines, or their chief rays land
 *   further apart than the policy allows for one field, or an answer does not say where its chief ray lands. No
 *   difference is shown: it would be of two image points;
 * - `convention`: a declared transform that is missing. This rung has none to miss: both answers state their cuts
 *   by the image axes of the contract, on the plane of the case, so the class is never given here;
 * - `numerical`: an answer says that its sampling of the field did not settle;
 * - `method`: both answers stand by their curves.
 */
export type NativeDifferenceClass = "unsupported" | "data" | "numerical" | "method";

/**
 * Why a field has its class, as a code:
 *
 * - `no-curve` (unsupported);
 * - `lines-differ`, `chief-landing-unknown`, `chief-landing-apart` (data);
 * - `unconverged` (numerical);
 * - `rim-rays-lost` (method): an answer calibrated a frequency axis with a rim ray that has no landing or no
 *   direction, or left the lens (optiland, docs/gotchas.md): its frequencies are not the beam's, and the field is
 *   kept out of the bands;
 * - `two-methods` (method): the one reason with which a field enters a band.
 */
export type NativeFieldReason =
  | "no-curve"
  | "lines-differ"
  | "chief-landing-unknown"
  | "chief-landing-apart"
  | "unconverged"
  | "rim-rays-lost"
  | "two-methods";

/** What an answer says of one field that the sorting reads. */
export interface NativeFieldFacts {
  /** 1 for a field the engine stands by, 0 for one it calls unconverged, null for one it has no curve of. */
  readonly settled: number | null;
  /** How far from the axis its chief ray lands, mm; null where the answer does not say. */
  readonly imageHeightMm: number | null;
  /** How many of its rim rays were lost; null for an engine that has none. */
  readonly rimRaysLost: number | null;
}

/** How one field was sorted. */
export interface NativeFieldSorting {
  readonly class: NativeDifferenceClass;
  readonly reason: NativeFieldReason;
  /** How far apart the two chief rays land, mm; null where an answer does not say where its own lands. */
  readonly landingMm: number | null;
  /** True for a field whose difference enters a band: class `method`, reason `two-methods`. */
  readonly banded: boolean;
  /** True where a difference of the two curves is shown at all: every class but `unsupported` and `data`. */
  readonly shown: boolean;
}

/**
 * Sorts one field of two answers. `sameLines` says whether the two are of the same lines; `chiefLandingLimitMm` is
 * how far apart their chief rays may land. The order is that of the classes, and within `data` and `method` that
 * of `NativeFieldReason`. Swapping the two answers changes nothing.
 */
export function classifyNativeField(
  a: NativeFieldFacts,
  b: NativeFieldFacts,
  sameLines: boolean,
  chiefLandingLimitMm: number,
): NativeFieldSorting {
  const landingMm =
    a.imageHeightMm === null || b.imageHeightMm === null ? null : Math.abs(a.imageHeightMm - b.imageHeightMm);
  const sorted = (
    kind: NativeDifferenceClass,
    reason: NativeFieldReason,
    shown: boolean,
    banded = false,
  ): NativeFieldSorting => ({ class: kind, reason, landingMm, banded, shown });
  if (a.settled === null || b.settled === null) return sorted("unsupported", "no-curve", false);
  if (!sameLines) return sorted("data", "lines-differ", false);
  if (landingMm === null) return sorted("data", "chief-landing-unknown", false);
  // A landing that is no number is not within any limit.
  if (!(landingMm <= chiefLandingLimitMm)) return sorted("data", "chief-landing-apart", false);
  if (a.settled !== 1 || b.settled !== 1) return sorted("numerical", "unconverged", true);
  if ((a.rimRaysLost ?? 0) > 0 || (b.rimRaysLost ?? 0) > 0) return sorted("method", "rim-rays-lost", true);
  return sorted("method", "two-methods", true, true);
}

/** A value of a sampling record, or NaN where the record has none under the name. */
function sampled(field: MtfNativeField, name: string): number {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : Number.NaN;
}

function settledOf(field: MtfNativeField): number | null {
  return field.status === "ok" ? 1 : field.status === "unconverged" ? 0 : null;
}

/** What the sorting reads of one field of an answer. */
export function factsOfField(field: MtfNativeField): NativeFieldFacts {
  const lost = sampled(field, "rimRaysLost");
  return {
    settled: settledOf(field),
    imageHeightMm: field.imageHeightMm,
    rimRaysLost: Number.isNaN(lost) ? null : lost,
  };
}

/** What the sorting reads of field `index` of the values a comparison records of an answer (`recorded`). */
export function factsOfRecorded(recorded: RecordedValues, index: number): NativeFieldFacts {
  const at = (name: string): number | null => (Object.hasOwn(recorded, name) ? (recorded[name][index] ?? null) : null);
  return { settled: at("settled"), imageHeightMm: at("imageHeightMm"), rimRaysLost: at("rimRaysLost") };
}

/** Whether two lists of wavelengths, as answers or their recorded values state them, are the same lines. */
export function sameWavelengths(a: readonly (number | null)[], b: readonly (number | null)[]): boolean {
  return a.length === b.length && a.every((wavelength, index) => wavelength === b[index]);
}

/** What an answer says of a field that is not "ok", as `<method>: <status> (<reason>)`. */
function saidOf(data: MtfNativeData, field: MtfNativeField): string {
  return `${data.method.name}: ${field.status}${field.reason === undefined ? "" : ` (${field.reason})`}`;
}

/** The figures of two answers: the worst difference of each kind of field, how many fields are of each, and why. */
interface Figures {
  readonly worst: { readonly [slot in Slot]: ComputedMetric | null };
  readonly landing: ComputedMetric | null;
  readonly counts: { compared: number; flagged: number; rimLost: number; data: number; unavailable: number };
  /** What is said of each field that is in no band, in the order of the fields. */
  readonly notes: readonly string[];
  /** The same, for each band, of the fields that would have been in it. */
  readonly leftOut: { readonly onAxis: string[]; readonly offAxis: string[] };
}

type Slot = "onAxis" | "offAxis" | "flagged" | "rimLost";
const SLOT_NAMES: { readonly [slot in Slot]: string } = {
  onAxis: ON_AXIS_METRIC,
  offAxis: OFF_AXIS_METRIC,
  flagged: "mtfFlagged.maxAbs",
  rimLost: "mtfRimLost.maxAbs",
};

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: MtfNativeData, b: MtfNativeData): string | null {
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((first, second) => first - second);
    return `the answers are for ${fewer} and ${more} fields: they answer different requests`;
  }
  const at = a.fields.findIndex((field, index) => field.field !== b.fields[index].field);
  if (at >= 0) {
    const [low, high] = [a.fields[at].field, b.fields[at].field].sort((first, second) => first - second);
    return `field ${at} is ${low} in one answer and ${high} in the other`;
  }
  if (a.focus.mode !== b.focus.mode || a.focus.appliedShiftMm !== b.focus.appliedShiftMm) {
    const said = [a, b].map((data) => `${data.focus.mode} at ${data.focus.appliedShiftMm} mm`).sort();
    return `the answers are of different planes: ${said.join(" and ")}`;
  }
  return null;
}

/**
 * What is said of a field that is in no band, after its class and reason. The two answers are named by their
 * methods, in the order of the names, so that the text is the same whichever answer comes first.
 */
function whyOf(
  sorting: NativeFieldSorting,
  sides: readonly { readonly data: MtfNativeData; readonly field: MtfNativeField }[],
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the chief rays land ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "chief-landing-unknown": {
      const silent = each(({ data, field }) => (field.imageHeightMm === null ? data.method.name : null));
      return `no chief-ray landing from ${silent.join(" and ")}`;
    }
    case "lines-differ": {
      const lines = each(({ data }) => data.lines.map((line) => String(line.wavelengthNm)).join("+"));
      return `the answers are of the lines ${lines.join(" and ")} nm`;
    }
    case "rim-rays-lost":
      return each(({ data, field }) => {
        const lost = sampled(field, "rimRaysLost");
        return lost > 0 ? `${data.method.name} lost ${numberText(lost)} rim rays` : null;
      }).join("; ");
    default:
      return each(({ data, field }) => (field.status === "ok" ? null : saidOf(data, field))).join("; ");
  }
}

function figuresOf(
  a: MtfNativeData,
  b: MtfNativeData,
  frequencies: readonly number[],
  chiefLandingLimitMm: number,
): Figures | string {
  const sameLines = sameWavelengths(
    a.lines.map((line) => line.wavelengthNm),
    b.lines.map((line) => line.wavelengthNm),
  );
  const worst: { [slot in Slot]: ComputedMetric | null } = {
    onAxis: null,
    offAxis: null,
    flagged: null,
    rimLost: null,
  };
  let landing: ComputedMetric | null = null;
  const counts = { compared: 0, flagged: 0, rimLost: 0, data: 0, unavailable: 0 };
  const notes: string[] = [];
  const leftOut: Figures["leftOut"] = { onAxis: [], offAxis: [] };
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const band = fieldA.field === 0 ? "onAxis" : "offAxis";
    const sorting = classifyNativeField(factsOfField(fieldA), factsOfField(fieldB), sameLines, chiefLandingLimitMm);
    if (sorting.landingMm !== null && sorting.class !== "unsupported") {
      // The first of equal values is kept; a NaN is kept, since it is within no limit.
      if (landing === null || sorting.landingMm > landing.value || Number.isNaN(sorting.landingMm)) {
        landing = { name: CHIEF_LANDING_METRIC, value: sorting.landingMm, where: { field: fieldA.field } };
      }
    }
    if (!sorting.banded) {
      const why = whyOf(sorting, [
        { data: a, field: fieldA },
        { data: b, field: fieldB },
      ]);
      const note = `field ${fieldA.field}: ${sorting.class}, ${sorting.reason} (${why})`;
      notes.push(note);
      leftOut[band].push(note);
    }
    if (sorting.class === "unsupported") counts.unavailable++;
    else if (sorting.class === "data") counts.data++;
    else if (sorting.class === "numerical") counts.flagged++;
    else if (sorting.banded) counts.compared++;
    else counts.rimLost++;
    if (!sorting.shown) continue;
    const slot: Slot = sorting.banded ? band : sorting.class === "numerical" ? "flagged" : "rimLost";
    for (const cut of MTF_CUTS) {
      const [curveA, curveB] = [decodeNdArray(fieldA[cut]).values, decodeNdArray(fieldB[cut]).values];
      if (curveA.length !== frequencies.length || curveB.length !== frequencies.length) {
        const held = [curveA.length, curveB.length].sort((first, second) => first - second).join(" and ");
        return `the ${cut} curves of field ${fieldA.field} hold ${held} values for ${frequencies.length} frequencies`;
      }
      for (let frequency = 0; frequency < frequencies.length; frequency++) {
        const value = Math.abs((curveA[frequency] as number) - (curveB[frequency] as number));
        const held = worst[slot];
        // The first of equal values is kept; no curve of a field that has curves holds a NaN.
        if (held !== null && !(value > held.value)) continue;
        const where = { field: fieldA.field, cut, frequencyPerMm: frequencies[frequency] };
        worst[slot] = { name: SLOT_NAMES[slot], value, where };
      }
    }
  }
  return { worst, landing, counts, notes, leftOut };
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as MtfNativeData, dataB as MtfNativeData];
  const frequencies = (context?.spec as MtfNativeSpec | undefined)?.frequenciesPerMm;
  if (frequencies === undefined) {
    return {
      comparable: false,
      reason: "the spec of the request is not at hand: nothing says which frequency a value is of",
    };
  }
  const limit = context?.policy?.metrics[CHIEF_LANDING_METRIC]?.attention;
  if (limit === undefined) {
    const reason = `the policy of the rung gives ${CHIEF_LANDING_METRIC} no band: nothing says when two answers are of one field`;
    return { comparable: false, reason };
  }
  // An engine that was asked again is judged by its last answer; its first is written down beside it.
  const [stepsA, stepsB] = context?.steps ?? [[], []];
  const [lastA, lastB] = [stepsA.at(-1), stepsB.at(-1)];
  const [finalA, finalB] = [(lastA?.data ?? a) as MtfNativeData, (lastB?.data ?? b) as MtfNativeData];
  for (const [first, second] of [
    [finalA, finalB],
    [a, b],
  ] as const) {
    const reason = mismatch(first, second);
    if (reason !== null) return { comparable: false, reason };
  }
  const judged = figuresOf(finalA, finalB, frequencies, limit);
  if (typeof judged === "string") return { comparable: false, reason: judged };

  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  if (judged.landing !== null) metrics.push(judged.landing);
  else {
    const reason = "no field has curves and a chief-ray landing in both answers";
    unmeasured.push({ name: CHIEF_LANDING_METRIC, reason });
  }
  for (const band of ["onAxis", "offAxis"] as const) {
    const figure = judged.worst[band];
    if (figure !== null) metrics.push(figure);
    else {
      const none = judged.leftOut[band].length === 0;
      const where = band === "onAxis" ? "on the axis" : "off the axis";
      const reason = none ? `the request has no field ${where}` : `no field ${where} is in a band`;
      unmeasured.push({ name: SLOT_NAMES[band], reason });
    }
  }
  const notes = [...judged.notes];
  if (lastA !== undefined || lastB !== undefined) {
    const first = figuresOf(a, b, frequencies, limit);
    if (typeof first === "string") return { comparable: false, reason: first };
    for (const band of ["onAxis", "offAxis"] as const) {
      const figure = first.worst[band];
      if (figure !== null) metrics.push({ ...figure, name: SLOT_NAMES[band].replace(".maxAbs", ".firstStepMaxAbs") });
    }
    const asked = [[finalA, lastA] as const, [finalB, lastB] as const]
      .filter(([, last]) => last !== undefined)
      .map(([data, last]) => `${data.method.name} at its step ${last?.step ?? ""}`)
      .sort();
    notes.unshift(`judged with ${asked.join(" and ")}; the figures of the first answers are beside them`);
  }
  for (const slot of ["flagged", "rimLost"] as const) {
    const figure = judged.worst[slot];
    if (figure !== null) metrics.push(figure);
  }
  metrics.push(
    { name: "fields.compared", value: judged.counts.compared },
    { name: "fields.flagged", value: judged.counts.flagged },
    { name: "fields.rimLost", value: judged.counts.rimLost },
    { name: "fields.data", value: judged.counts.data },
    { name: "fields.unavailable", value: judged.counts.unavailable },
  );
  return {
    comparable: true,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states of each field, one value a field: the field as it was requested (`field`), the angle the
 * engine computed with, where its chief ray lands, whether it stands by the field (`settled`: 1 for "ok", 0 for
 * "unconverged", NaN for a field without curves), its sampling by those names of `NATIVE_SAMPLING` it states for
 * any field, and, where the
 * request is at hand, every value of both curves under `curveValueName`. `lineWavelengthNm` is one value a line
 * the answer is of. NaN wherever the answer states none.
 */
function recorded(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] } {
  const { fields, lines } = data as MtfNativeData;
  const frequencies = (context?.spec as MtfNativeSpec | undefined)?.frequenciesPerMm ?? [];
  const curves: [string, number[]][] = [];
  for (const cut of MTF_CUTS) {
    const decoded = fields.map((field) => decodeNdArray(field[cut]).values);
    if (decoded.some((curve) => curve.length !== frequencies.length)) continue;
    for (const [at, frequency] of frequencies.entries()) {
      curves.push([curveValueName(cut, frequency), decoded.map((curve) => curve[at] as number)]);
    }
  }
  return {
    field: fields.map((field) => field.field),
    fieldAngleDeg: fields.map((field) => field.fieldAngleDeg ?? Number.NaN),
    imageHeightMm: fields.map((field) => field.imageHeightMm ?? Number.NaN),
    settled: fields.map((field) => settledOf(field) ?? Number.NaN),
    // A name the answer states for no field is left out: it is another engine's.
    ...Object.fromEntries(
      NATIVE_SAMPLING.map((name) => [name, fields.map((field) => sampled(field, name))] as const).filter(([, values]) =>
        values.some((value) => !Number.isNaN(value)),
      ),
    ),
    lineWavelengthNm: lines.map((line) => line.wavelengthNm),
    ...Object.fromEntries(curves),
  };
}

/**
 * The comparator of `mtf.native` for rung R5: two engines' own diffraction MTF of one case. The rung is recorded:
 * a figure outside its band is marked for attention and fails nothing, and one inside it is a difference that was
 * written down, not a tolerance that was met.
 *
 * Each field is sorted first (`classifyNativeField`), and each kind of field has its own figure:
 *
 * - `chiefLanding.maxAbs`: how far apart the two answers' chief rays land, the largest over the fields both have
 *   curves of and a landing for. Its band in the policy is the limit of the sorting: a field beyond it is of
 *   class `data`, shows no difference, and the pair is marked for attention;
 * - `mtfOnAxis.maxAbs` and `mtfOffAxis.maxAbs`: the largest difference of two MTF values over both cuts and every
 *   frequency, on the field requested as 0 and on every other, over the fields in a band. The policy gives them
 *   the plan's bands, 0.005 and 0.01. One that has no such field is not measured, and the reason says why;
 * - `mtfFlagged.maxAbs` (class `numerical`) and `mtfRimLost.maxAbs` (class `method`, reason `rim-rays-lost`): the
 *   same over the fields an answer calls "unconverged", and over those an answer lost rim rays of. Written down,
 *   in no band, and left out where there is none;
 * - `fields.compared`, `fields.flagged`, `fields.rimLost`, `fields.data`, `fields.unavailable`: how many fields
 *   are of each kind.
 *
 * An engine that was asked the request again (`ComparisonContext.steps`) is judged by its last answer, and the
 * band figures of the first answers are written down as `mtfOnAxis.firstStepMaxAbs` and
 * `mtfOffAxis.firstStepMaxAbs`. Every field that is in no band is named in the notes with its class and reason.
 *
 * It needs the spec of the request, for the frequencies, and the policy of the rung, for the limit of the chief
 * rays' landing; without either the answers are not comparable. Answers for different numbers of fields, for
 * other fields, of other planes, or with curves that have not one value a frequency are not comparable.
 */
export const mtfNativeComparator: QuantityComparator = Object.freeze({
  quantity: MTF_NATIVE,
  rung: NATIVE_MTF_RUNG,
  metrics: Object.freeze([
    { name: CHIEF_LANDING_METRIC, unit: "mm" },
    { name: ON_AXIS_METRIC, unit: "1" },
    { name: OFF_AXIS_METRIC, unit: "1" },
    { name: "mtfOnAxis.firstStepMaxAbs", unit: "1" },
    { name: "mtfOffAxis.firstStepMaxAbs", unit: "1" },
    { name: "mtfFlagged.maxAbs", unit: "1" },
    { name: "mtfRimLost.maxAbs", unit: "1" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.flagged", unit: "elements" },
    { name: "fields.rimLost", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
