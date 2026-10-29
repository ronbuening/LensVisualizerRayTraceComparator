// The comparator of `summary.native` for rung R12b: two engines' own first-order summaries of one case, each as the
// engine presents it, set beside each other line by line. LensVisualizer's summary tab and aperture control beside
// optiland's own accessors is the pair the rung is named for. Nothing here is gated, and no figure of it says that one
// engine is right: a summary states the f-numbers an engine presents under the definitions the contract names, and an
// engine that states none under a definition leaves that figure unmeasured.
//
// A line is sorted before any difference is taken, by R5's sorting (`classifyNativeField`, src/compare/mtfNative.ts),
// its classes in their order: unsupported (an answer has no values of the line), data (other wavelengths; rear focal
// points further apart than the rung's limit, or an answer that states none: the two answers are not of one system),
// method. A summary has no field and is no ray's: the "landing" R5 sorts by is the rear focal point, z in the contract
// frame, what identifies the system both answers are of, as the near-axis intercept is R8b's. The rung adds no reason
// of its own. Only a line of two methods enters a figure.
import type { JsonObject } from "../contract/json.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import { SUMMARY_NATIVE, SUMMARY_VALUES } from "../contract/quantities/summaryNative.ts";
import type { SummaryNativeData, SummaryNativeLine, SummaryValue } from "../contract/quantities/summaryNative.ts";
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

/** The rung of the engines' own summaries. */
export const SUMMARY_NATIVE_RUNG = "r12b";

/** How far apart two answers' rear focal points lie, mm: the limit of the sorting. */
export const REAR_FOCUS_METRIC = "rearFocus.maxAbs";

/**
 * The figures of a line of two methods, each the difference of one value of the two answers under one definition, in
 * the order the comparator reports them. The marked f-number and the half field are not among them: neither is
 * computed from the system, and each is recorded beside the figures.
 */
export const SUMMARY_FIGURES: readonly {
  readonly name: string;
  readonly value: SummaryValue;
  readonly unit: string;
}[] = Object.freeze([
  { name: "focalLength.maxAbs", value: "focalLengthMm", unit: "mm" },
  { name: "entrancePupilDiameter.maxAbs", value: "entrancePupilDiameterMm", unit: "mm" },
  { name: "stopDiameter.maxAbs", value: "stopDiameterMm", unit: "mm" },
  { name: "imageSpaceFNumber.maxAbs", value: "imageSpaceFNumber", unit: "1" },
  { name: "paraxialWorkingFNumber.maxAbs", value: "paraxialWorkingFNumber", unit: "1" },
  { name: "workingFNumber.maxAbs", value: "workingFNumber", unit: "1" },
  { name: "totalTrack.maxAbs", value: "totalTrackMm", unit: "mm" },
]);

function settledOf(line: SummaryNativeLine): number | null {
  return line.status === "ok" ? 1 : null;
}

/**
 * What the sorting reads of one line of an answer: whether it has values (`settled` 1, null for none) and where its
 * rear focal point lies, as R5's landing (null where it states none). A summary has no rim rays.
 */
export function summaryFactsOf(line: SummaryNativeLine): NativeFieldFacts {
  return { settled: settledOf(line), imageHeightMm: line.rearFocalZ, rimRaysLost: null };
}

/**
 * What the sorting reads of line `index` of the values a comparison records of an answer (`recorded`): a report
 * repeats the sorting from them (`classifyNativeField`), and a test holds it to the sorting of the answers.
 */
export function summaryFactsOfRecorded(recorded: RecordedValues, index: number): NativeFieldFacts {
  const at = (name: string): number | null => {
    const value = Object.hasOwn(recorded, name) ? recorded[name][index] : undefined;
    return value === undefined || Number.isNaN(value) ? null : value;
  };
  return { settled: at("settled"), imageHeightMm: at("rearFocalZ"), rimRaysLost: null };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: SummaryNativeData, b: SummaryNativeData): string | null {
  if (a.lines.length !== b.lines.length) {
    const [fewer, more] = [a.lines.length, b.lines.length].sort((first, second) => first - second);
    return `the answers are for ${fewer} and ${more} lines: they answer different requests`;
  }
  const at = a.lines.findIndex((line, index) => line.line !== b.lines[index].line);
  if (at >= 0) return `entry ${at} is of line ${a.lines[at].line} in one answer and ${b.lines[at].line} in the other`;
  return null;
}

/** What is said of a line that is in no figure, after its class and reason, the engines named by their methods. */
function whyOf(
  sorting: NativeFieldSorting,
  sides: readonly { data: SummaryNativeData; line: SummaryNativeLine }[],
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the rear focal points lie ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "chief-landing-unknown":
      return each(({ data, line }) =>
        line.rearFocalZ === null ? `${data.method.name} states no rear focal point` : null,
      ).join("; ");
    case "lines-differ":
      return `the answers are of ${each(({ line }) => String(line.wavelengthNm)).join(" and ")} nm`;
    default:
      return each(({ data, line }) =>
        line.status === "ok" ? null : `${data.method.name}: ${line.status} (${line.reason ?? "no reason"})`,
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
  const [a, b] = [dataA as SummaryNativeData, dataB as SummaryNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  // The limit of the sorting is the owner's to set; without one no line is set aside by its rear focal point.
  const limit = context?.policy?.metrics[REAR_FOCUS_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined) {
    notes.push(`the rung sets no limit on ${REAR_FOCUS_METRIC}: no line is set aside by its rear focal point`);
  }
  const names = [REAR_FOCUS_METRIC, ...SUMMARY_FIGURES.map(({ name }) => name)];
  const largest = Object.fromEntries(names.map((name) => [name, largestOf(name)]));
  const stated = Object.fromEntries(SUMMARY_FIGURES.map(({ name }) => [name, { a: 0, b: 0 }]));
  const counts = { compared: 0, data: 0, unavailable: 0 };
  for (const [index, lineA] of a.lines.entries()) {
    const lineB = b.lines[index];
    const sorting = classifyNativeField(
      summaryFactsOf(lineA),
      summaryFactsOf(lineB),
      lineA.wavelengthNm === lineB.wavelengthNm,
      limit ?? Number.POSITIVE_INFINITY,
    );
    const where = { line: lineA.line };
    if (sorting.landingMm !== null && sorting.class !== "unsupported") {
      largest[REAR_FOCUS_METRIC].take(sorting.landingMm, where);
    }
    if (!sorting.banded) {
      const why = whyOf(sorting, [
        { data: a, line: lineA },
        { data: b, line: lineB },
      ]);
      notes.push(`line ${lineA.line}: ${sorting.class}, ${sorting.reason} (${why})`);
      if (sorting.class === "unsupported") counts.unavailable++;
      else counts.data++;
      continue;
    }
    counts.compared++;
    for (const { name, value } of SUMMARY_FIGURES) {
      const [va, vb] = [lineA[value], lineB[value]];
      if (va !== null) stated[name].a++;
      if (vb !== null) stated[name].b++;
      if (va !== null && vb !== null) largest[name].take(Math.abs(va - vb), where);
    }
  }
  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  for (const name of names) {
    const value = largest[name].value();
    if (value !== null) {
      metrics.push(value);
      continue;
    }
    let reason = "no line of two methods states it in both answers";
    if (name === REAR_FOCUS_METRIC) reason = "no line has a rear focal point in both answers";
    else if (counts.compared > 0) {
      const silent = [
        ...(stated[name].a === 0 ? [a.method.name] : []),
        ...(stated[name].b === 0 ? [b.method.name] : []),
      ].sort();
      if (silent.length > 0) reason = `${silent.join(" and ")} ${silent.length > 1 ? "state" : "states"} none`;
    }
    unmeasured.push({ name, reason });
  }
  metrics.push(
    { name: "lines.compared", value: counts.compared },
    { name: "lines.data", value: counts.data },
    { name: "lines.unavailable", value: counts.unavailable },
  );
  return {
    comparable: true,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states of each line, one value a line: the line, the wavelength, whether it has values (`settled`:
 * 1, NaN for none), every value of the contract's (NaN where it states none), and its sampling by every name it
 * states.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const answer = data as SummaryNativeData;
  const nan = (value: number | null | undefined): number => value ?? Number.NaN;
  const names = [...new Set(answer.lines.flatMap((line) => Object.keys(line.sampling)))].sort();
  return {
    line: answer.lines.map((line) => line.line),
    wavelengthNm: answer.lines.map((line) => line.wavelengthNm),
    settled: answer.lines.map((line) => nan(settledOf(line))),
    ...Object.fromEntries(SUMMARY_VALUES.map((name) => [name, answer.lines.map((line) => nan(line[name]))])),
    ...Object.fromEntries(
      names.map((name) => [
        name,
        answer.lines.map((line) => nan(Object.hasOwn(line.sampling, name) ? line.sampling[name] : null)),
      ]),
    ),
  };
}

/**
 * The comparator of `summary.native` for rung R12b: two engines' own first-order summaries of one case. Recorded: a
 * figure is written down, and judged only against an attention band the policy gives it.
 *
 * Each line is sorted first (`classifyNativeField`, the rear focal point as the landing), and only a line of two
 * methods is in a figure:
 *
 * - `rearFocus.maxAbs`: how far apart the two answers' rear focal points lie, the largest over the lines both state
 *   one of. A band of it in the policy is the limit of the sorting, as in R5: a line beyond it is of class `data`.
 *   Without one, no line is set aside by it, and the pair's reason says so;
 * - `focalLength.maxAbs`, `entrancePupilDiameter.maxAbs`, `stopDiameter.maxAbs`, `imageSpaceFNumber.maxAbs`,
 *   `paraxialWorkingFNumber.maxAbs`, `workingFNumber.maxAbs`, `totalTrack.maxAbs`: the difference of each value both
 *   answers state under that definition; one that an answer never states is unmeasured, and the reason names the
 *   engine;
 * - `lines.compared`, `lines.data`, `lines.unavailable`: how many lines are of each kind.
 *
 * Every line that is in no figure is named in the notes with its class and reason. Answers for different numbers of
 * lines, or of other lines, are not comparable.
 */
export const summaryNativeComparator: QuantityComparator = Object.freeze({
  quantity: SUMMARY_NATIVE,
  rung: SUMMARY_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: REAR_FOCUS_METRIC, unit: "mm" },
    ...SUMMARY_FIGURES.map(({ name, unit }) => ({ name, unit })),
    { name: "lines.compared", unit: "elements" },
    { name: "lines.data", unit: "elements" },
    { name: "lines.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
