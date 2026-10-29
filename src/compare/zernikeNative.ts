// The comparator of `zernike.native` for rung R14b: two engines' own wavefront figures of one case at one line, field
// by field. optiland's own `ZernikeFit` of its wavefront beside the comparator's estimator (src/estimators/zernike.ts)
// on optiland's raw samples of the same wavefront (`optiland-wave`) is the pair the rung is named for: the same data
// and two fits, so a difference is of the fits (their bases, orderings, normalisations and solutions) and of the
// figures' arithmetic, never of the wavefront. Nothing here is gated.
//
// A field is sorted before any difference is taken, by R5's sorting (`classifyNativeField`, src/compare/mtfNative.ts):
// unsupported (an answer has no figures of it), data (other wavelengths; chief rays that land further apart than the
// rung's limit `chiefLanding.maxAbs`, or an answer that states no landing), numerical (an answer states a condition of
// its normal equations above the rung's limit `fitCondition.max`: the samples light a strip of the disc, on which the
// polynomials are nearly dependent, and the coefficients carry that many fewer digits in either fit; R5's reason
// `unconverged`), method. Only a field of two methods enters a figure. A field set aside as numerical is R5's
// unconverged field: counted (`fields.numerical`), its condition shown apart (`fitCondition.setAsideMax`, unbanded),
// and never a reason for ATTENTION; the judged `fitCondition.max` is of the fields of two methods alone.
import type { JsonObject } from "../contract/json.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import { ZERNIKE_NATIVE } from "../contract/quantities/zernikeNative.ts";
import type { ZernikeNativeData, ZernikeNativeField } from "../contract/quantities/zernikeNative.ts";
import type {
  ComparatorOutcome,
  ComparisonContext,
  ComputedMetric,
  QuantityComparator,
  UnmeasuredMetric,
} from "./comparator.ts";
import { numberText } from "./metricText.ts";
import { classifyNativeField } from "./mtfNative.ts";
import type { NativeFieldFacts, NativeFieldSorting } from "./mtfNative.ts";

/** The rung of the engines' own Zernike fits. */
export const ZERNIKE_NATIVE_RUNG = "r14b";

/** How far apart two answers' chief rays land, mm: the limit of the sorting, R5's name. */
export const CHIEF_LANDING_METRIC = "chiefLanding.maxAbs";

/** The figures of a field of two methods, each the difference of one value of the two answers, in waves. */
export const ZERNIKE_FIGURES: readonly {
  readonly name: string;
  readonly value: "rmsToChiefWaves" | "pvToChiefWaves" | "fitResidualRmsWaves";
}[] = Object.freeze([
  { name: "rmsToChief.maxAbs", value: "rmsToChiefWaves" },
  { name: "pvToChief.maxAbs", value: "pvToChiefWaves" },
  { name: "fitResidualRms.maxAbs", value: "fitResidualRmsWaves" },
]);

/** The largest difference of a coefficient, in waves, with the field and the term. */
export const COEFFICIENTS_METRIC = "coefficients.maxAbs";

/**
 * The largest condition of the normal equations either answer states of a field of two methods. Its band in the policy
 * is the limit of the sorting: a field above it is numerical and in no figure, this one included.
 */
export const CONDITION_METRIC = "fitCondition.max";

/**
 * The largest condition either answer states of a field the sorting set aside as numerical: a figure of the fields in
 * no figure, shown and never judged (the policy gives it no band), as R5 shows nothing of an unconverged field's moduli.
 */
export const SET_ASIDE_CONDITION_METRIC = "fitCondition.setAsideMax";

function settledOf(field: ZernikeNativeField): number | null {
  return field.status === "ok" ? 1 : null;
}

/** 1 for a field of figures whose condition is within `limit` (or states none, or of no limit), 0 above it. */
function settledWithin(settled: number | null, condition: number | null, limit: number | undefined): number | null {
  if (settled === null) return null;
  return limit !== undefined && condition !== null && condition > limit ? 0 : 1;
}

/**
 * What the sorting reads of one field of an answer: whether it has figures and, of a condition above `conditionLimit`,
 * that it does not stand by them as R5's unconverged field (settled 0), and where its chief ray lands.
 */
export function zernikeFactsOf(field: ZernikeNativeField, conditionLimit?: number): NativeFieldFacts {
  return {
    settled: settledWithin(settledOf(field), field.fitCondition, conditionLimit),
    imageHeightMm: field.imageHeightMm,
    rimRaysLost: null,
  };
}

/** What the sorting reads of field `index` of the values a comparison records of an answer (`recorded`). */
export function zernikeFactsOfRecorded(
  recorded: RecordedValues,
  index: number,
  conditionLimit?: number,
): NativeFieldFacts {
  const at = (name: string): number | null => {
    const value = Object.hasOwn(recorded, name) ? recorded[name][index] : undefined;
    return value === undefined || Number.isNaN(value) ? null : value;
  };
  return {
    settled: settledWithin(at("settled"), at("fitCondition"), conditionLimit),
    imageHeightMm: at("imageHeightMm"),
    rimRaysLost: null,
  };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: ZernikeNativeData, b: ZernikeNativeData): string | null {
  if (a.line.index !== b.line.index || a.grid !== b.grid || a.ordering !== b.ordering || a.terms !== b.terms) {
    return "the answers are of other lines, grids, orderings or numbers of terms";
  }
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((p, q) => p - q);
    return `the answers are for ${fewer} and ${more} fields: they answer different requests`;
  }
  const at = a.fields.findIndex((field, index) => field.fieldAngleDeg !== b.fields[index].fieldAngleDeg);
  if (at >= 0) return `field ${at} is of other angles in the two answers`;
  return null;
}

/** What is said of a field that is in no figure, after its class and reason, the engines named by their methods. */
function whyOf(
  sorting: NativeFieldSorting,
  sides: readonly { data: ZernikeNativeData; field: ZernikeNativeField }[],
  conditionLimit?: number,
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the chief rays land ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "chief-landing-unknown":
      return each(({ data, field }) =>
        field.imageHeightMm === null ? `${data.method.name} states no landing` : null,
      ).join("; ");
    case "lines-differ":
      return `the answers are of ${each(({ data }) => String(data.line.wavelengthNm)).join(" and ")} nm`;
    case "unconverged":
      return each(({ data, field }) =>
        field.fitCondition !== null && conditionLimit !== undefined && field.fitCondition > conditionLimit
          ? `${data.method.name}: normal equations of condition ${numberText(field.fitCondition)}, above ${numberText(conditionLimit)}`
          : null,
      ).join("; ");
    default:
      return each(({ data, field }) =>
        field.status === "ok" ? null : `${data.method.name}: ${field.status} (${field.reason ?? "no reason"})`,
      ).join("; ");
  }
}

/** The largest of a series of values and where it occurs; the first of equal values is kept, and a NaN stays. */
function largestOf(name: string): {
  readonly value: () => ComputedMetric | null;
  readonly take: (value: number, where: ComputedMetric["where"]) => void;
} {
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
  const [a, b] = [dataA as ZernikeNativeData, dataB as ZernikeNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  const limit = context?.policy?.metrics[CHIEF_LANDING_METRIC]?.attention;
  const conditionLimit = context?.policy?.metrics[CONDITION_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined) {
    notes.push(`the rung sets no limit on ${CHIEF_LANDING_METRIC}: no field is set aside by its chief ray's landing`);
  }
  if (conditionLimit === undefined) {
    notes.push(`the rung sets no limit on ${CONDITION_METRIC}: no field is set aside by the condition of its fit`);
  }
  const names = [
    CHIEF_LANDING_METRIC,
    CONDITION_METRIC,
    COEFFICIENTS_METRIC,
    ...ZERNIKE_FIGURES.map(({ name }) => name),
  ];
  const largest = Object.fromEntries(names.map((name) => [name, largestOf(name)]));
  const setAside = largestOf(SET_ASIDE_CONDITION_METRIC);
  const counts = { compared: 0, data: 0, numerical: 0, unavailable: 0 };
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const sorting = classifyNativeField(
      zernikeFactsOf(fieldA, conditionLimit),
      zernikeFactsOf(fieldB, conditionLimit),
      a.line.wavelengthNm === b.line.wavelengthNm,
      limit ?? Number.POSITIVE_INFINITY,
    );
    const where = { field: fieldA.fieldAngleDeg };
    if (sorting.landingMm !== null && sorting.class !== "unsupported") {
      largest[CHIEF_LANDING_METRIC].take(sorting.landingMm, where);
    }
    if (sorting.class === "method" || sorting.class === "numerical") {
      const into = sorting.class === "method" ? largest[CONDITION_METRIC] : setAside;
      for (const condition of [fieldA.fitCondition, fieldB.fitCondition]) {
        if (condition !== null) into.take(condition, where);
      }
    }
    if (!sorting.banded) {
      const why = whyOf(
        sorting,
        [
          { data: a, field: fieldA },
          { data: b, field: fieldB },
        ],
        conditionLimit,
      );
      notes.push(`field ${fieldA.fieldAngleDeg}: ${sorting.class}, ${sorting.reason} (${why})`);
      if (sorting.class === "unsupported") counts.unavailable++;
      else if (sorting.class === "numerical") counts.numerical++;
      else counts.data++;
      continue;
    }
    counts.compared++;
    fieldA.coefficients.forEach((value, term) =>
      largest[COEFFICIENTS_METRIC].take(Math.abs(value - fieldB.coefficients[term]), { ...where, term: term + 1 }),
    );
    for (const { name, value } of ZERNIKE_FIGURES) {
      const [va, vb] = [fieldA[value], fieldB[value]];
      if (va !== null && vb !== null) largest[name].take(Math.abs(va - vb), where);
    }
  }
  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  for (const name of names) {
    const value = largest[name].value();
    if (value !== null) metrics.push(value);
    else {
      const reason =
        name === CHIEF_LANDING_METRIC
          ? "no field has a landing in both answers"
          : name === CONDITION_METRIC
            ? "no answer states the condition of a field of two methods"
            : "no field of two methods states it in both answers";
      unmeasured.push({ name, reason });
    }
  }
  // Only where a field was set aside by its condition: of none there is nothing to show.
  const setAsideValue = setAside.value();
  if (setAsideValue !== null) metrics.push(setAsideValue);
  metrics.push(
    { name: "fields.compared", value: counts.compared },
    { name: "fields.data", value: counts.data },
    { name: "fields.numerical", value: counts.numerical },
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
 * What an answer states of each field, one value a field: its angle, whether it has figures (`settled`: 1, NaN for
 * none), its chief ray's landing, its figures and valid samples, every coefficient as `Z<j>` (NaN where it states
 * none), and its sampling by every name it states.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const answer = data as ZernikeNativeData;
  const nan = (value: number | null | undefined): number => value ?? Number.NaN;
  const names = [...new Set(answer.fields.flatMap((field) => Object.keys(field.sampling)))].sort();
  return {
    fieldAngleDeg: answer.fields.map((field) => field.fieldAngleDeg),
    settled: answer.fields.map((field) => nan(settledOf(field))),
    imageHeightMm: answer.fields.map((field) => nan(field.imageHeightMm)),
    rmsToChiefWaves: answer.fields.map((field) => nan(field.rmsToChiefWaves)),
    pvToChiefWaves: answer.fields.map((field) => nan(field.pvToChiefWaves)),
    fitResidualRmsWaves: answer.fields.map((field) => nan(field.fitResidualRmsWaves)),
    fitCondition: answer.fields.map((field) => nan(field.fitCondition)),
    validSamples: answer.fields.map((field) => field.validSamples),
    ...Object.fromEntries(
      Array.from({ length: answer.terms }, (_, term) => [
        `Z${term + 1}`,
        answer.fields.map((field) => nan(field.coefficients[term])),
      ]),
    ),
    ...Object.fromEntries(
      names.map((name) => [
        name,
        answer.fields.map((field) => nan(Object.hasOwn(field.sampling, name) ? field.sampling[name] : null)),
      ]),
    ),
  };
}

/**
 * The comparator of `zernike.native` for rung R14b: two engines' own wavefront figures of one case at one line.
 * Recorded: a figure is written down, and judged only against an attention band the policy gives it.
 *
 * Each field is sorted first (`classifyNativeField`), and only a field of two methods is in a figure:
 *
 * - `chiefLanding.maxAbs`: how far apart the two answers' chief rays land, the largest over the fields both state
 *   one of. A band of it in the policy is the limit of the sorting, as in R5;
 * - `fitCondition.max`: the largest condition of the normal equations either answer states of a field of two methods.
 *   A band of it in the policy is the second limit of the sorting: a field above it is numerical, R5's unconverged
 *   field, and in no figure, so it never makes a pair ATTENTION;
 * - `fitCondition.setAsideMax`: the largest condition either answer states of a field set aside as numerical, only
 *   where there is one; shown beside `fitCondition.max` and never banded;
 * - `coefficients.maxAbs`: the largest difference of a Zernike coefficient, waves, with the field and the term;
 * - `rmsToChief.maxAbs`, `pvToChief.maxAbs`, `fitResidualRms.maxAbs`: the difference of each figure, waves;
 * - `fields.compared`, `fields.data`, `fields.numerical`, `fields.unavailable`: how many fields are of each kind.
 *
 * Every field in no figure is named in the notes with its class and reason. Answers of other lines, grids, orderings,
 * numbers of terms or fields are not comparable.
 */
export const zernikeNativeComparator: QuantityComparator = Object.freeze({
  quantity: ZERNIKE_NATIVE,
  rung: ZERNIKE_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: CHIEF_LANDING_METRIC, unit: "mm" },
    { name: CONDITION_METRIC, unit: "1" },
    { name: SET_ASIDE_CONDITION_METRIC, unit: "1" },
    { name: COEFFICIENTS_METRIC, unit: "waves" },
    ...ZERNIKE_FIGURES.map(({ name }) => ({ name, unit: "waves" })),
    { name: "fields.compared", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.numerical", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
