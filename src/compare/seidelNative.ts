// The comparator of `seidel.native` for rung R13b: two engines' own third-order sums of one case at one line, set
// beside each other. The comparator's sums on the reference engine's model (`ref-seidel`) beside optiland's own
// `aberrations` is the pair the rung is named for. Nothing here is gated, and no figure of it says that one engine is
// right: the sums are the paraxial definitions of the contract, and two engines that differ in them differ in the
// rays they traced or in the sums they formed of them.
//
// An answer is sorted before any difference is taken, by R5's sorting (`classifyNativeField`, src/compare/mtfNative.ts),
// its classes in their order: unsupported (an answer has no sums), data (other wavelengths; Lagrange invariants further
// apart than the rung's limit, or an answer that states none: the two answers are not of one field and aperture), method.
// The sums have no field to land: the "landing" R5 sorts by is the Lagrange invariant, n (u_chief y_marginal -
// u_marginal y_chief), which both rays make and which a chief ray of another field, a marginal ray of another stop or
// a slope of another construction (sin for tan) moves. Only an answer of two methods enters a figure.
//
// OpticStudio's wave coefficients (W040 = SPHA / 8 lambda, and so on, CONTRACT.md) are the sums over the line's
// vacuum wavelength: the comparison records them of each answer, and judges none.
import type { JsonObject } from "../contract/json.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import {
  SEIDEL_NATIVE,
  SEIDEL_SUMS,
  THIRD_ORDER_SUMS,
  WAVE_COEFFICIENTS,
} from "../contract/quantities/seidelNative.ts";
import type { SeidelNativeData, SeidelSum } from "../contract/quantities/seidelNative.ts";
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

/** The rung of the engines' own Seidel sums. */
export const SEIDEL_NATIVE_RUNG = "r13b";

/** How far apart two answers' Lagrange invariants lie, mm: the limit of the sorting. */
export const INVARIANT_METRIC = "invariant.maxAbs";

/** The largest difference of a total over the sum of the magnitudes of its surfaces' terms: what cancels in it. */
export const TOTAL_SCALED_METRIC = "total.maxScaled";

/** The largest difference of one surface's sum of the two answers. */
export const SURFACES_METRIC = "surfaces.maxAbs";

/** The figure of each sum's total: `<sum>.maxAbs`, in mm. */
export const SUM_METRICS: readonly { readonly name: string; readonly sum: SeidelSum }[] = Object.freeze(
  SEIDEL_SUMS.map((sum) => ({ name: `${sum}.maxAbs`, sum })),
);

function settledOf(answer: SeidelNativeData): number | null {
  return answer.status === "ok" ? 1 : null;
}

/** What the sorting reads of an answer: whether it has sums, and its Lagrange invariant as R5's landing. */
export function seidelFactsOf(answer: SeidelNativeData): NativeFieldFacts {
  return { settled: settledOf(answer), imageHeightMm: answer.invariant, rimRaysLost: null };
}

/** What the sorting reads of the values a comparison records of an answer (`recorded`). */
export function seidelFactsOfRecorded(recorded: RecordedValues): NativeFieldFacts {
  const at = (name: string): number | null => {
    const value = Object.hasOwn(recorded, name) ? recorded[name][0] : undefined;
    return value === undefined || Number.isNaN(value) ? null : value;
  };
  return { settled: at("settled"), imageHeightMm: at("invariant"), rimRaysLost: null };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: SeidelNativeData, b: SeidelNativeData): string | null {
  const both = (x: number, y: number): string => [x, y].sort((p, q) => p - q).join(" and ");
  if (a.line.index !== b.line.index) return `the answers are of lines ${both(a.line.index, b.line.index)}`;
  if (a.maxFieldDeg !== b.maxFieldDeg)
    return `the answers are of fields of ${both(a.maxFieldDeg, b.maxFieldDeg)} degrees`;
  if (String(a.dispersionLines) !== String(b.dispersionLines)) return "the answers are of other dispersion lines";
  return null;
}

/** What is said of an answer pair that is in no figure, after its class and reason, the engines named by method. */
function whyOf(sorting: NativeFieldSorting, a: SeidelNativeData, b: SeidelNativeData): string {
  const each = (said: (answer: SeidelNativeData) => string | null): string =>
    [a, b]
      .flatMap((answer) => said(answer) ?? [])
      .sort()
      .join("; ");
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the Lagrange invariants lie ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "chief-landing-unknown":
      return each((answer) => (answer.invariant === null ? `${answer.method.name} states no invariant` : null));
    case "lines-differ":
      return `the answers are of ${each((answer) => String(answer.line.wavelengthNm)).replace("; ", " and ")} nm`;
    default:
      return each((answer) =>
        answer.status === "ok" ? null : `${answer.method.name}: ${answer.status} (${answer.reason ?? "no reason"})`,
      );
  }
}

/** The largest of a series of values and where it occurs; the first of equal values is kept, and a NaN stays. */
function largestOf(name: string): {
  readonly value: () => ComputedMetric | null;
  readonly take: (value: number, where?: ComputedMetric["where"]) => void;
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

/** The sum of the magnitudes of a sum's surface terms of an answer: the scale of what cancels in its total. */
function magnitudeOf(answer: SeidelNativeData, sum: SeidelSum): number | null {
  if (answer.surfaces.length === 0) return null;
  let total = 0;
  for (const surface of answer.surfaces) {
    const value = surface[sum];
    if (value === null) return null;
    total += Math.abs(value);
  }
  return total;
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as SeidelNativeData, dataB as SeidelNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  const limit = context?.policy?.metrics[INVARIANT_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined) {
    notes.push(`the rung sets no limit on ${INVARIANT_METRIC}: no answer is set aside by its Lagrange invariant`);
  }
  const sorting = classifyNativeField(
    seidelFactsOf(a),
    seidelFactsOf(b),
    a.line.wavelengthNm === b.line.wavelengthNm,
    limit ?? Number.POSITIVE_INFINITY,
  );
  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  if (sorting.landingMm !== null && sorting.class !== "unsupported") {
    metrics.push({ name: INVARIANT_METRIC, value: sorting.landingMm });
  } else {
    unmeasured.push({ name: INVARIANT_METRIC, reason: "an answer states no Lagrange invariant" });
  }
  const figures = [...SUM_METRICS.map(({ name }) => name), TOTAL_SCALED_METRIC, SURFACES_METRIC];
  if (!sorting.banded) {
    notes.push(`${sorting.class}, ${sorting.reason} (${whyOf(sorting, a, b)})`);
    for (const name of figures) unmeasured.push({ name, reason: `the answers are ${sorting.class}: in no figure` });
    return { comparable: true, metrics, unmeasured, notes };
  }
  const silent = (sum: SeidelSum): string => {
    const names = [a, b].filter((answer) => answer.total[sum] === null).map((answer) => answer.method.name);
    return `${names.sort().join(" and ")} ${names.length > 1 ? "state" : "states"} none`;
  };
  for (const { name, sum } of SUM_METRICS) {
    const [va, vb] = [a.total[sum], b.total[sum]];
    if (va === null || vb === null) unmeasured.push({ name, reason: silent(sum) });
    else metrics.push({ name, value: Math.abs(va - vb) });
  }
  const scaled = largestOf(TOTAL_SCALED_METRIC);
  for (const sum of THIRD_ORDER_SUMS) {
    const [va, vb] = [a.total[sum], b.total[sum]];
    const scale = Math.max(magnitudeOf(a, sum) ?? Number.NaN, magnitudeOf(b, sum) ?? Number.NaN);
    if (va === null || vb === null || !(scale > 0)) continue;
    scaled.take(Math.abs(va - vb) / scale, { sum });
  }
  const scaledValue = scaled.value();
  if (scaledValue === null) {
    unmeasured.push({ name: TOTAL_SCALED_METRIC, reason: "an answer states no sums of its surfaces" });
  } else metrics.push(scaledValue);
  const surfaces = largestOf(SURFACES_METRIC);
  const ofB = new Map(b.surfaces.map((surface) => [surface.surface, surface]));
  for (const surfaceA of a.surfaces) {
    const surfaceB = ofB.get(surfaceA.surface);
    if (surfaceB === undefined) continue;
    for (const sum of SEIDEL_SUMS) {
      const [va, vb] = [surfaceA[sum], surfaceB[sum]];
      if (va !== null && vb !== null) surfaces.take(Math.abs(va - vb), { surface: surfaceA.surface, sum });
    }
  }
  const surfacesValue = surfaces.value();
  if (surfacesValue === null) {
    unmeasured.push({ name: SURFACES_METRIC, reason: "the answers state no sum of one surface both" });
  } else metrics.push(surfacesValue);
  return {
    comparable: true,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states, one value each: the line, the wavelength, whether it has sums (`settled`: 1, NaN for none),
 * the invariant, every total (NaN where it states none), OpticStudio's wave coefficients of the totals in waves of the
 * line's vacuum wavelength, and its sampling by every name it states.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const answer = data as SeidelNativeData;
  const nan = (value: number | null | undefined): number => value ?? Number.NaN;
  const wavelengthMm = answer.line.wavelengthNm * 1e-6;
  return {
    line: [answer.line.index],
    wavelengthNm: [answer.line.wavelengthNm],
    maxFieldDeg: [answer.maxFieldDeg],
    settled: [nan(settledOf(answer))],
    invariant: [nan(answer.invariant)],
    ...Object.fromEntries(SEIDEL_SUMS.map((sum) => [sum, [nan(answer.total[sum])]])),
    ...Object.fromEntries(
      WAVE_COEFFICIENTS.map(({ name, sum, factor }) => {
        const total = answer.total[sum];
        return [name, [total === null ? Number.NaN : total / (factor * wavelengthMm)]];
      }),
    ),
    ...Object.fromEntries(
      Object.keys(answer.sampling)
        .sort()
        .map((name) => [name, [answer.sampling[name]]]),
    ),
  };
}

/**
 * The comparator of `seidel.native` for rung R13b: two engines' own Seidel sums of one case at one line. Recorded: a
 * figure is written down, and judged only against an attention band the policy gives it.
 *
 * The answers are sorted first (`classifyNativeField`, the Lagrange invariant as the landing), and only answers of two
 * methods are in a figure:
 *
 * - `invariant.maxAbs`: how far apart the two answers' invariants lie, mm. A band of it in the policy is the limit of
 *   the sorting, as in R5; without one, no answer is set aside by it, and the pair's reason says so;
 * - `SPHA.maxAbs` to `CTR.maxAbs`: the difference of each total both answers state, mm; one an answer does not state
 *   is unmeasured with the engine named;
 * - `total.maxScaled`: the largest difference of a total of third order over the larger sum of the magnitudes of its
 *   surface terms in the two answers, the scale of what cancels in it, where both state their surfaces;
 * - `surfaces.maxAbs`: the largest difference of one surface's sum both answers state, mm, with the surface and the sum.
 *
 * Answers of other lines, fields or dispersion lines are not comparable.
 */
export const seidelNativeComparator: QuantityComparator = Object.freeze({
  quantity: SEIDEL_NATIVE,
  rung: SEIDEL_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: INVARIANT_METRIC, unit: "mm" },
    ...SUM_METRICS.map(({ name }) => ({ name, unit: "mm" })),
    { name: TOTAL_SCALED_METRIC, unit: "1" },
    { name: SURFACES_METRIC, unit: "mm" },
  ]),
  compare,
  recorded,
});
