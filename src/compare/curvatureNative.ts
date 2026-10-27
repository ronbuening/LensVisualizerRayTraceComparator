// The comparator of `curvature.native` for rung R10b: two engines' own field curves of one case, each from its own
// rays, its own chief rays and its own indices, set beside each other field by field. LensVisualizer's field-curve and
// astigmatism sections beside optiland's own `FieldCurvature` is the pair the rung is named for. Nothing here is
// gated, and no figure of it says that one method is right.
//
// A field is sorted before any difference is taken, by the sorting of R9b (`classifyChiefField`,
// src/compare/chiefNative.ts): R5's sorting first (`classifyNativeField`, src/compare/mtfNative.ts) and R5's classes in
// their order, unsupported (no foci), data, method. Data are: other wavelengths; then an answer that traced the field
// at indices other than the case's (`sampling.indexMaxDelta` above 0, which LensVisualizer's chromatic channels
// state); then chief rays that land further apart than the rung's limit, or an answer that states no landing. The
// identifying ray is the field's chief ray through the centre of the stop, whose landing moves with the field angle:
// two fields of other angles land apart. Only a field of two methods enters a figure.
import type { JsonObject } from "../contract/json.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import { CURVATURE_NATIVE } from "../contract/quantities/curvatureNative.ts";
import type { CurvatureNativeData, CurvatureNativeField } from "../contract/quantities/curvatureNative.ts";
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

/** The rung of the engines' own field curves. */
export const CURVATURE_NATIVE_RUNG = "r10b";

/** How far apart two answers' chief rays of a field land on the image plane, mm: the limit of the sorting. */
export const CHIEF_LANDING_METRIC = "chiefLanding.maxAbs";
export const TANGENTIAL_METRIC = "tangentialShift.maxAbs";
export const SAGITTAL_METRIC = "sagittalShift.maxAbs";
export const ASTIGMATISM_METRIC = "astigmatism.maxAbs";

/** The figures of a field of two methods, in the order the comparator reports them. */
const FIGURES = [TANGENTIAL_METRIC, SAGITTAL_METRIC, ASTIGMATISM_METRIC] as const;

/** A value of a field's sampling, or null where the field states none under the name. */
function sampledOf(field: CurvatureNativeField, name: string): number | null {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : null;
}

/**
 * What the sorting reads of one field of an answer: whether it has foci (`settled` 1, null for none), where its chief
 * ray lands (null where it states no landing), and how far the indices it traced the field at are from the case's
 * (null where it does not say: an engine that traces the case's own).
 */
export function curvatureFactsOf(field: CurvatureNativeField): ChiefFieldFacts {
  return {
    settled: field.status === "ok" ? 1 : null,
    imageHeightMm: field.chiefLandingMm,
    rimRaysLost: null,
    indexMaxDelta: sampledOf(field, "indexMaxDelta"),
  };
}

/**
 * What the sorting reads of field `index` of the values a comparison records of an answer (`recorded`): a report
 * repeats the sorting from them (`classifyChiefField`), and a test holds it to the sorting of the answers.
 */
export function curvatureFactsOfRecorded(recorded: RecordedValues, index: number): ChiefFieldFacts {
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
function mismatch(a: CurvatureNativeData, b: CurvatureNativeData): string | null {
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((first, second) => first - second);
    return `the answers are for ${fewer} and ${more} fields: they answer different requests`;
  }
  const at = a.fields.findIndex((field, index) => field.line !== b.fields[index].line);
  if (at >= 0) return `entry ${at} is of line ${a.fields[at].line} in one answer and ${b.fields[at].line} in the other`;
  return null;
}

/** What is said of a field that is in no figure, after its class and reason, the engines named by their methods. */
function whyOf(
  sorting: ChiefFieldSorting,
  sides: readonly { data: CurvatureNativeData; field: CurvatureNativeField }[],
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
  const [a, b] = [dataA as CurvatureNativeData, dataB as CurvatureNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  // The limit of the sorting is the owner's to set; without one no field is set aside by its landing.
  const limit = context?.policy?.metrics[CHIEF_LANDING_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined) {
    notes.push(`the rung sets no limit on ${CHIEF_LANDING_METRIC}: no field is set aside by its landing`);
  }
  const largest = Object.fromEntries([CHIEF_LANDING_METRIC, ...FIGURES].map((name) => [name, largestOf(name)]));
  const counts = { compared: 0, data: 0, unavailable: 0 };
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const sorting = classifyChiefField(
      curvatureFactsOf(fieldA),
      curvatureFactsOf(fieldB),
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
      else counts.data++;
      continue;
    }
    counts.compared++;
    const [ta, sa, tb, sb] = [
      fieldA.tangentialShiftMm!,
      fieldA.sagittalShiftMm!,
      fieldB.tangentialShiftMm!,
      fieldB.sagittalShiftMm!,
    ];
    largest[TANGENTIAL_METRIC].take(Math.abs(ta - tb), where);
    largest[SAGITTAL_METRIC].take(Math.abs(sa - sb), where);
    largest[ASTIGMATISM_METRIC].take(Math.abs(sa - ta - (sb - tb)), where);
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
          : "no field of two methods has the figure in both answers";
      unmeasured.push({ name, reason });
    }
  }
  metrics.push(
    { name: "fields.compared", value: counts.compared },
    { name: "fields.data", value: counts.data },
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
 * has foci (`settled`: 1, NaN for a field without), where its chief ray lands, its two foci (NaN where it has none),
 * and its sampling by every name it states.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const answer = data as CurvatureNativeData;
  const nan = (value: number | null | undefined): number => value ?? Number.NaN;
  const names = [...new Set(answer.fields.flatMap((field) => Object.keys(field.sampling)))].sort();
  return {
    line: answer.fields.map((field) => field.line),
    wavelengthNm: answer.fields.map((field) => field.wavelengthNm),
    fieldAngleDeg: answer.fields.map((field) => field.fieldAngleDeg),
    settled: answer.fields.map((field) => (curvatureFactsOf(field).settled === null ? Number.NaN : 1)),
    chiefLandingMm: answer.fields.map((field) => nan(field.chiefLandingMm)),
    tangentialShiftMm: answer.fields.map((field) => nan(field.tangentialShiftMm)),
    sagittalShiftMm: answer.fields.map((field) => nan(field.sagittalShiftMm)),
    ...Object.fromEntries(names.map((name) => [name, answer.fields.map((field) => nan(sampledOf(field, name)))])),
  };
}

/**
 * The comparator of `curvature.native` for rung R10b: two engines' own field curves of one case. Recorded: a figure
 * is written down, and judged only against an attention band the policy gives it.
 *
 * Each field is sorted first (`classifyChiefField`), and only a field of two methods is in a figure:
 *
 * - `chiefLanding.maxAbs`: how far apart the two answers' chief rays land on the image plane, the largest over the
 *   fields both have a landing of. A band of it in the policy is the limit of the sorting, as in R5: a field beyond it
 *   is of class `data`. Without one, no field is set aside by its landing, and the pair's reason says so;
 * - `tangentialShift.maxAbs`, `sagittalShift.maxAbs`: the differences of the two foci along the axis, mm;
 * - `astigmatism.maxAbs`: the difference of the sagittal less the tangential focus, mm;
 * - `fields.compared`, `fields.data`, `fields.unavailable`: how many fields are of each kind.
 *
 * Every field that is in no figure is named in the notes with its class and reason. Answers for different numbers of
 * fields, or for other lines, are not comparable.
 */
export const curvatureNativeComparator: QuantityComparator = Object.freeze({
  quantity: CURVATURE_NATIVE,
  rung: CURVATURE_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: CHIEF_LANDING_METRIC, unit: "mm" },
    { name: TANGENTIAL_METRIC, unit: "mm" },
    { name: SAGITTAL_METRIC, unit: "mm" },
    { name: ASTIGMATISM_METRIC, unit: "mm" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
