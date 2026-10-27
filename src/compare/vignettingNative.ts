// The comparator of `vignetting.native` for rung R11b: two engines' own vignetting and relative illumination of one
// case, each by its own method, set beside each other field by field. LensVisualizer's vignetting tab (one meridional
// sweep across a fixed pupil, times cos^4 of the field angle) beside the comparator's flux in two dimensions on
// LensVisualizer's lattice over each field's whole beam is the pair the rung is named for. Nothing here is gated, and
// no figure of it says that one method is right.
//
// A field is sorted before any difference is taken, by the sorting of R9b (`classifyChiefField`,
// src/compare/chiefNative.ts): R5's sorting first (`classifyNativeField`, src/compare/mtfNative.ts) and R5's classes in
// their order, unsupported (no figures), data, numerical, method. Data are: other wavelengths; an answer that traced
// the field at indices other than the case's; chief rays that land further apart than the rung's limit, or an answer
// that states no landing. The rung adds no reason of its own: both answers are of the same fields at the same line,
// and what remains is the method. Numerical is a field an answer does not stand by (unconverged). Only a field of two
// methods enters a figure.
//
// Three figures separate what the methods differ in:
//
// - `geometricTransmission.maxAbs`: how much of the beam gets through, over the axis's: the tab's fraction of one
//   meridional chord of a fixed pupil against an area in two dimensions over the whole beam. Neither applies a law of
//   the field angle.
// - `falloff.maxAbs`: the relative illumination over the geometric transmission, of each answer: the tab's cos^4 of the
//   field angle (times its transmitted intensity over its count) against the flux into the image per unit of
//   transmitted area, which the traced directions give. It is of no vignetting.
// - `relativeIllumination.maxAbs`: the two together.
import type { JsonObject } from "../contract/json.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import { VIGNETTING_NATIVE } from "../contract/quantities/vignettingNative.ts";
import type { VignettingNativeData, VignettingNativeField } from "../contract/quantities/vignettingNative.ts";
import { classifyChiefField } from "./chiefNative.ts";
import type { ChiefFieldFacts, ChiefFieldSorting } from "./chiefNative.ts";
import type {
  ComparatorOutcome,
  ComparisonContext,
  ComputedMetric,
  QuantityComparator,
  UnmeasuredMetric,
} from "./comparator.ts";
import { numberText } from "./metricText.ts";

/** The rung of the engines' own vignetting. */
export const VIGNETTING_NATIVE_RUNG = "r11b";

/** How far apart two answers' chief rays of a field land on the image plane, mm: the limit of the sorting. */
export const CHIEF_LANDING_METRIC = "chiefLanding.maxAbs";
export const TRANSMISSION_METRIC = "geometricTransmission.maxAbs";
export const FALLOFF_METRIC = "falloff.maxAbs";
export const ILLUMINATION_METRIC = "relativeIllumination.maxAbs";

/** The figures of a field of two methods, in the order the comparator reports them. */
const FIGURES = [TRANSMISSION_METRIC, FALLOFF_METRIC, ILLUMINATION_METRIC] as const;

/** A value of a field's sampling, or null where the field states none under the name. */
function sampledOf(field: VignettingNativeField, name: string): number | null {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : null;
}

function settledOf(field: VignettingNativeField): number | null {
  return field.status === "ok" ? 1 : field.status === "unconverged" ? 0 : null;
}

/**
 * What the sorting reads of one field of an answer: whether it has figures it stands by (`settled` 1, 0 for figures it
 * does not stand by, null for none), where its chief ray lands (null where it states no landing), and how far the
 * indices it traced the field at are from the case's (null where it does not say: an engine that traces the case's
 * own).
 */
export function vignettingFactsOf(field: VignettingNativeField): ChiefFieldFacts {
  return {
    settled: settledOf(field),
    imageHeightMm: field.chiefLandingMm,
    rimRaysLost: null,
    indexMaxDelta: sampledOf(field, "indexMaxDelta"),
  };
}

/**
 * What the sorting reads of field `index` of the values a comparison records of an answer (`recorded`): a report
 * repeats the sorting from them (`classifyChiefField`), and a test holds it to the sorting of the answers.
 */
export function vignettingFactsOfRecorded(recorded: RecordedValues, index: number): ChiefFieldFacts {
  const at = (name: string): number | null => {
    const value = Object.hasOwn(recorded, name) ? recorded[name][index] : undefined;
    return value === undefined || Number.isNaN(value) ? null : value;
  };
  return {
    settled: at("settled"),
    imageHeightMm: at("chiefLandingMm"),
    rimRaysLost: null,
    indexMaxDelta: at("indexMaxDelta"),
  };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: VignettingNativeData, b: VignettingNativeData): string | null {
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((first, second) => first - second);
    return `the answers are for ${fewer} and ${more} fields: they answer different requests`;
  }
  const at = a.fields.findIndex((field, index) => field.line !== b.fields[index].line);
  if (at >= 0) return `entry ${at} is of line ${a.fields[at].line} in one answer and ${b.fields[at].line} in the other`;
  const angle = a.fields.findIndex((field, index) => field.fieldAngleDeg !== b.fields[index].fieldAngleDeg);
  if (angle >= 0) {
    const [one, two] = [a.fields[angle].fieldAngleDeg, b.fields[angle].fieldAngleDeg];
    return `entry ${angle} is of the field at ${one} degrees in one answer and ${two} in the other`;
  }
  return null;
}

/** What is said of a field that is in no figure, after its class and reason, the engines named by their methods. */
function whyOf(
  sorting: ChiefFieldSorting,
  sides: readonly { data: VignettingNativeData; field: VignettingNativeField }[],
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the chief rays land ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "chief-landing-unknown":
      return each(({ data, field }) =>
        field.chiefLandingMm === null ? `${data.method.name} states no landing of its chief ray` : null,
      ).join("; ");
    case "lines-differ":
      return `the answers traced ${each(({ field }) => String(field.wavelengthNm)).join(" and ")} nm`;
    case "indices-differ":
      return each(({ data, field }) => {
        const delta = sampledOf(field, "indexMaxDelta") ?? 0;
        return delta > 0 ? `${data.method.name} traced indices up to ${numberText(delta)} from the case's` : null;
      }).join("; ");
    default:
      return each(({ data, field }) =>
        field.status === "ok" ? null : `${data.method.name}: ${field.status} (${field.reason ?? "no reason"})`,
      ).join("; ");
  }
}

/** The largest of a series of values and where it occurs; the first of equal values is kept, and a NaN stays. */
interface Largest {
  readonly value: () => ComputedMetric | null;
  readonly take: (value: number, where: ComputedMetric["where"]) => void;
}

function largestOf(name: string): Largest {
  let largest: ComputedMetric | null = null;
  return {
    value: () => largest,
    take: (value, where) => {
      if (largest !== null && Number.isNaN(largest.value)) return;
      if (largest === null || Number.isNaN(value) || value > largest.value) {
        largest = { name, value, ...(where === undefined ? {} : { where }) };
      }
    },
  };
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as VignettingNativeData, dataB as VignettingNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  // The limit of the sorting is the owner's to set; without one no field is set aside by its landing.
  const limit = context?.policy?.metrics[CHIEF_LANDING_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined) {
    notes.push(`the rung sets no limit on ${CHIEF_LANDING_METRIC}: no field is set aside by its landing`);
  }
  const largest = Object.fromEntries([CHIEF_LANDING_METRIC, ...FIGURES].map((name) => [name, largestOf(name)]));
  const counts = { compared: 0, data: 0, unconverged: 0, unavailable: 0 };
  let blind = 0;
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const sorting = classifyChiefField(
      vignettingFactsOf(fieldA),
      vignettingFactsOf(fieldB),
      fieldA.wavelengthNm === fieldB.wavelengthNm,
      limit ?? Number.POSITIVE_INFINITY,
    );
    const where = { line: fieldA.line, field: fieldA.fieldAngleDeg };
    if (sorting.landingMm !== null && sorting.class !== "unsupported") {
      largest[CHIEF_LANDING_METRIC].take(sorting.landingMm, where);
    }
    if (!sorting.banded) {
      const why = whyOf(sorting, [
        { data: a, field: fieldA },
        { data: b, field: fieldB },
      ]);
      notes.push(`line ${fieldA.line}, field ${fieldA.fieldAngleDeg}: ${sorting.class}, ${sorting.reason} (${why})`);
      if (sorting.class === "unsupported") counts.unavailable++;
      else if (sorting.class === "numerical") counts.unconverged++;
      else counts.data++;
      continue;
    }
    counts.compared++;
    const [ta, ra, tb, rb] = [
      fieldA.geometricTransmission!,
      fieldA.relativeIllumination!,
      fieldB.geometricTransmission!,
      fieldB.relativeIllumination!,
    ];
    largest[TRANSMISSION_METRIC].take(Math.abs(ta - tb), where);
    largest[ILLUMINATION_METRIC].take(Math.abs(ra - rb), where);
    // The falloff is of transmitted light: a field either answer lets none through has none.
    if (ta > 0 && tb > 0) largest[FALLOFF_METRIC].take(Math.abs(ra / ta - rb / tb), where);
    else blind++;
  }
  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  for (const name of [CHIEF_LANDING_METRIC, ...FIGURES]) {
    const value = largest[name].value();
    if (value !== null) metrics.push(value);
    else {
      const reason =
        name === CHIEF_LANDING_METRIC
          ? "no field has a landing of its chief ray in both answers"
          : name === FALLOFF_METRIC && blind > 0
            ? "no field of two methods lets light through in both answers"
            : "no field of two methods has the figure in both answers";
      unmeasured.push({ name, reason });
    }
  }
  metrics.push(
    { name: "fields.compared", value: counts.compared },
    { name: "fields.data", value: counts.data },
    { name: "fields.unconverged", value: counts.unconverged },
    { name: "fields.unavailable", value: counts.unavailable },
  );
  return {
    comparable: true,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states of each field, one value a field: the line, the wavelength traced, the field angle, whether it
 * has figures it stands by (`settled`: 1, 0 for figures it does not stand by, NaN for none), where its chief ray lands,
 * its two figures (NaN where it has none), and its sampling by every name it states.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const answer = data as VignettingNativeData;
  const nan = (value: number | null | undefined): number => value ?? Number.NaN;
  const names = [...new Set(answer.fields.flatMap((field) => Object.keys(field.sampling)))].sort();
  return {
    line: answer.fields.map((field) => field.line),
    wavelengthNm: answer.fields.map((field) => field.wavelengthNm),
    fieldAngleDeg: answer.fields.map((field) => field.fieldAngleDeg),
    settled: answer.fields.map((field) => nan(settledOf(field))),
    chiefLandingMm: answer.fields.map((field) => nan(field.chiefLandingMm)),
    geometricTransmission: answer.fields.map((field) => nan(field.geometricTransmission)),
    relativeIllumination: answer.fields.map((field) => nan(field.relativeIllumination)),
    ...Object.fromEntries(names.map((name) => [name, answer.fields.map((field) => nan(sampledOf(field, name)))])),
  };
}

/**
 * The comparator of `vignetting.native` for rung R11b: two engines' own vignetting and relative illumination of one
 * case. Recorded: a figure is written down, and judged only against an attention band the policy gives it.
 *
 * Each field is sorted first (`classifyChiefField`), and only a field of two methods is in a figure:
 *
 * - `chiefLanding.maxAbs`: how far apart the two answers' chief rays land on the image plane, the largest over the
 *   fields both have a landing of. A band of it in the policy is the limit of the sorting, as in R5: a field beyond it
 *   is of class `data`. Without one, no field is set aside by its landing, and the pair's reason says so;
 * - `geometricTransmission.maxAbs`: the difference of the two geometric transmissions, each over the axis's;
 * - `falloff.maxAbs`: the difference of the two relative illuminations each over its geometric transmission, of the
 *   fields both answers let light through;
 * - `relativeIllumination.maxAbs`: the difference of the two relative illuminations;
 * - `fields.compared`, `fields.data`, `fields.unconverged`, `fields.unavailable`: how many fields are of each kind.
 *
 * Every field that is in no figure is named in the notes with its class and reason. Answers for different numbers of
 * fields, or of other lines or angles, are not comparable.
 */
export const vignettingNativeComparator: QuantityComparator = Object.freeze({
  quantity: VIGNETTING_NATIVE,
  rung: VIGNETTING_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: CHIEF_LANDING_METRIC, unit: "mm" },
    { name: TRANSMISSION_METRIC, unit: "1" },
    { name: FALLOFF_METRIC, unit: "1" },
    { name: ILLUMINATION_METRIC, unit: "1" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.unconverged", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
