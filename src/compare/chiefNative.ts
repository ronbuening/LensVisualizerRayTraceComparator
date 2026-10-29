// The comparator of `chief.native` for rung R9b: two engines' own figures of the chief rays of one case across its
// field, each from its own chief rays, its own reference and its own indices, set beside each other field by field.
// LensVisualizer's distortion tab, its pupils tab and the lateral-colour section of its chromatic tab beside optiland's
// own distortion model, its chief rays and its paraxial pupils is the pair the rung is named for. Nothing here is
// gated, and no figure of it says that one method is right.
//
// An engine states its figures (LensVisualizer's tabs, optiland's distortion) or, for pupils, the chief ray it traced
// (optiland); the pupils of a chief ray are the comparator's own estimator's (`axialIntercept`,
// src/estimators/axialIntercept.ts): where its line ahead of the system and its line behind it cross the axis.
//
// A field is sorted before any difference is taken (`classifyChiefField`): by R5's sorting first
// (`classifyNativeField`, src/compare/mtfNative.ts) and R5's classes in their order, unsupported (no figures), data,
// method. Data are: other wavelengths; then, this rung's own, an answer that traced the field at indices other than
// the case's (`sampling.indexMaxDelta` above 0, which LensVisualizer's chromatic channels state); then chief rays that
// land further apart than the rung's limit, or an answer that states no landing. The identifying ray is the field's
// chief ray through the centre of the stop, whose landing moves with the field angle: two fields of other angles land
// apart. Only a field of two methods enters a figure.
import type { JsonObject } from "../contract/json.ts";
import { CHIEF_NATIVE } from "../contract/quantities/chiefNative.ts";
import type { ChiefNativeData, ChiefNativeField } from "../contract/quantities/chiefNative.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import { axialIntercept } from "../estimators/axialIntercept.ts";
import type {
  ComparatorOutcome,
  ComparisonContext,
  ComputedMetric,
  QuantityComparator,
  UnmeasuredMetric,
} from "./comparator.ts";
import { numberText } from "./metricText.ts";
import { classifyNativeField } from "./mtfNative.ts";
import type { NativeDifferenceClass, NativeFieldFacts, NativeFieldReason } from "./mtfNative.ts";

/** The rung of the engines' own chief-ray figures. */
export const CHIEF_NATIVE_RUNG = "r9b";

/** How far apart two answers' chief rays of a field land on the image plane, mm: the limit of the sorting. */
export const CHIEF_LANDING_METRIC = "chiefLanding.maxAbs";
export const PERCENT_METRIC = "distortionPercent.maxAbs";
export const REAL_METRIC = "realHeight.maxAbs";
export const IDEAL_METRIC = "idealHeight.maxAbs";
export const SCALE_METRIC = "focalScale.relative";
export const LATERAL_METRIC = "lateralColour.maxAbs";
export const ENTRANCE_METRIC = "entrancePupil.maxAbs";
export const EXIT_METRIC = "exitPupil.maxAbs";
export const PARAXIAL_ENTRANCE_METRIC = "paraxialEntrancePupil.maxAbs";
export const PARAXIAL_EXIT_METRIC = "paraxialExitPupil.maxAbs";

/** The figures of each kind, in the order the comparator reports them. */
const KIND_METRICS: { readonly [kind: string]: readonly string[] } = {
  distortion: [PERCENT_METRIC, REAL_METRIC, IDEAL_METRIC, SCALE_METRIC],
  "lateral-colour": [LATERAL_METRIC],
  pupils: [ENTRANCE_METRIC, EXIT_METRIC, PARAXIAL_ENTRANCE_METRIC, PARAXIAL_EXIT_METRIC],
};
const ALL_KIND_METRICS = Object.values(KIND_METRICS).flat();

/**
 * What the sorting reads of one field of an answer: R5's facts (whether it has figures, where its chief ray lands) and
 * how far the indices it traced the field at are from the case's, null where it does not say (an engine that traces
 * the case's own).
 */
export interface ChiefFieldFacts extends NativeFieldFacts {
  readonly indexMaxDelta: number | null;
}

/** Why a field has its class: R5's reasons, and this rung's one of class `data`. */
export type ChiefFieldReason = NativeFieldReason | "indices-differ";

/** How one field was sorted. */
export interface ChiefFieldSorting {
  readonly class: NativeDifferenceClass;
  readonly reason: ChiefFieldReason;
  /** How far apart the chief rays land, mm; null where an answer does not say where its own lands. */
  readonly landingMm: number | null;
  /** True for a field whose difference enters a figure: class `method`, reason `two-methods`. */
  readonly banded: boolean;
}

/**
 * Sorts one field of two answers. R5's sorting decides first (`classifyNativeField`): a field without figures is
 * `unsupported`, a field of other wavelengths `data`. Then this rung's own reason of class `data`: `indices-differ`,
 * where an answer states that it traced the field at indices other than the case's (an `indexMaxDelta` above 0: two
 * traces of one source of indices are the same bits). Then R5's again: the landing of the chief rays, against
 * `landingLimitMm`. Swapping the two answers changes nothing.
 */
export function classifyChiefField(
  a: ChiefFieldFacts,
  b: ChiefFieldFacts,
  sameLines: boolean,
  landingLimitMm: number,
): ChiefFieldSorting {
  const base = classifyNativeField(a, b, sameLines, landingLimitMm);
  const sorted = (kind: NativeDifferenceClass, reason: ChiefFieldReason, banded = false): ChiefFieldSorting => ({
    class: kind,
    reason,
    landingMm: base.landingMm,
    banded,
  });
  if (base.class === "unsupported" || base.reason === "lines-differ") return sorted(base.class, base.reason);
  if ((a.indexMaxDelta ?? 0) > 0 || (b.indexMaxDelta ?? 0) > 0) return sorted("data", "indices-differ");
  return sorted(base.class, base.reason, base.banded);
}

/** A value of a field's sampling, or null where the field states none under the name. */
function sampledOf(field: ChiefNativeField, name: string): number | null {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : null;
}

/** What the sorting reads of one field of an answer. */
function factsOf(field: ChiefNativeField): ChiefFieldFacts {
  return {
    settled: field.status === "ok" && field.chiefLandingMm !== null ? 1 : null,
    imageHeightMm: field.chiefLandingMm,
    rimRaysLost: null,
    indexMaxDelta: sampledOf(field, "indexMaxDelta"),
  };
}

/**
 * What the sorting reads of field `index` of the values a comparison records of an answer (`recorded`): a report
 * repeats the sorting from them (`classifyChiefField`).
 */
export function chiefFactsOfRecorded(recorded: RecordedValues, index: number): ChiefFieldFacts {
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

/** The pupils of a field of an answer: its own figures, or the crossings of the chief ray it traced; null for none. */
function pupilsOf(field: ChiefNativeField): { readonly entrance: number | null; readonly exit: number | null } {
  if (field.figures !== null) return { entrance: field.figures.entrancePupilZ, exit: field.figures.exitPupilZ };
  if (field.chiefRay === null) return { entrance: null, exit: null };
  const crossing = (point: readonly number[], direction: readonly number[]): number | null => {
    const made = axialIntercept(point, direction);
    return made.available ? made.z : null;
  };
  const ray = field.chiefRay;
  return { entrance: crossing(ray.entryPoint, ray.entryDirection), exit: crossing(ray.exitPoint, ray.exitDirection) };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: ChiefNativeData, b: ChiefNativeData): string | null {
  if (a.kind !== b.kind) return `one answer is of ${a.kind} and the other of ${b.kind}`;
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
  sides: readonly { data: ChiefNativeData; field: ChiefNativeField }[],
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the chief rays land ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "lines-differ":
      return `the answers traced ${each(({ field }) => String(field.wavelengthNm)).join(" and ")} nm`;
    case "indices-differ":
      return each(({ data, field }) => {
        const delta = sampledOf(field, "indexMaxDelta") ?? 0;
        return delta > 0 ? `${data.method.name} traced indices up to ${numberText(delta)} from the case's` : null;
      }).join("; ");
    default:
      return each(({ data, field }) =>
        factsOf(field).settled !== null
          ? null
          : `${data.method.name}: ${field.status === "ok" ? "no landing" : `${field.status} (${field.reason ?? "no reason"})`}`,
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

/** |a - b| over the larger magnitude, 0 for two values of 0. */
function relativeDifference(a: number, b: number): number {
  const larger = Math.max(Math.abs(a), Math.abs(b));
  return larger === 0 ? 0 : Math.abs(a - b) / larger;
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as ChiefNativeData, dataB as ChiefNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  // The limit of the sorting is the owner's to set; without one no field is set aside by its landing.
  const limit = context?.policy?.metrics[CHIEF_LANDING_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined) {
    notes.push(`the rung sets no limit on ${CHIEF_LANDING_METRIC}: no field is set aside by its landing`);
  }
  const largest = Object.fromEntries(
    [CHIEF_LANDING_METRIC, ...ALL_KIND_METRICS].map((name) => [name, largestOf(name)]),
  );
  const counts = { compared: 0, data: 0, unavailable: 0 };
  const banded: boolean[] = [];
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const sorting = classifyChiefField(
      factsOf(fieldA),
      factsOf(fieldB),
      fieldA.wavelengthNm === fieldB.wavelengthNm,
      limit ?? Number.POSITIVE_INFINITY,
    );
    const where = { line: fieldA.line, field: fieldA.fieldAngleDeg };
    if (sorting.landingMm !== null && sorting.class !== "unsupported") {
      largest[CHIEF_LANDING_METRIC].take(sorting.landingMm, where);
    }
    banded.push(sorting.banded);
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
    if (a.kind === "distortion") {
      const [x, y] = [fieldA.figures!, fieldB.figures!];
      largest[PERCENT_METRIC].take(Math.abs(x.percent! - y.percent!), where);
      largest[REAL_METRIC].take(Math.abs(x.realHeightMm! - y.realHeightMm!), where);
      largest[IDEAL_METRIC].take(Math.abs(x.idealHeightMm! - y.idealHeightMm!), where);
    }
    if (a.kind === "pupils") {
      const [x, y] = [pupilsOf(fieldA), pupilsOf(fieldB)];
      for (const [metric, one, two, named] of [
        [ENTRANCE_METRIC, x.entrance, y.entrance, "ahead of"],
        [EXIT_METRIC, x.exit, y.exit, "behind"],
      ] as const) {
        if (one !== null && two !== null) largest[metric].take(Math.abs(one - two), where);
        else
          notes.push(
            `line ${fieldA.line}, field ${fieldA.fieldAngleDeg}: a chief ray does not cross the axis ${named} the system`,
          );
      }
    }
  }

  // Lateral colour: each field's landing relative to the first line of the request, where both lines are of two
  // methods at that field.
  if (a.kind === "lateral-colour") {
    const lines = [...new Set(a.fields.map((field) => field.line))];
    const perLine = a.fields.length / lines.length;
    for (let line = 1; line < lines.length; line++) {
      for (let field = 0; field < perLine; field++) {
        const [first, here] = [field, line * perLine + field];
        if (!banded[first] || !banded[here]) continue;
        const moved = (data: ChiefNativeData) => data.fields[here].chiefLandingMm! - data.fields[first].chiefLandingMm!;
        largest[LATERAL_METRIC].take(Math.abs(moved(a) - moved(b)), {
          line: a.fields[here].line,
          field: a.fields[here].fieldAngleDeg,
        });
      }
    }
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  const reference = [a.reference, b.reference];
  if (a.kind === "distortion") {
    const [one, two] = reference.map((each) => each.focalScaleMm);
    if (one !== null && two !== null) largest[SCALE_METRIC].take(relativeDifference(one, two), undefined);
  }
  if (a.kind === "pupils") {
    for (const [metric, member] of [
      [PARAXIAL_ENTRANCE_METRIC, "paraxialEntrancePupilZ"],
      [PARAXIAL_EXIT_METRIC, "paraxialExitPupilZ"],
    ] as const) {
      const [one, two] = reference.map((each) => each[member]);
      if (one !== null && two !== null) largest[metric].take(Math.abs(one - two), undefined);
    }
  }
  for (const name of [CHIEF_LANDING_METRIC, ...KIND_METRICS[a.kind]]) {
    const value = largest[name].value();
    if (value !== null) metrics.push(value);
    else {
      const reason =
        name === SCALE_METRIC || name === PARAXIAL_ENTRANCE_METRIC || name === PARAXIAL_EXIT_METRIC
          ? "an answer states no reference of it"
          : name === LATERAL_METRIC && new Set(a.fields.map((field) => field.line)).size < 2
            ? "the request is of one line: no landing is relative to another line's"
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
    inapplicable: ALL_KIND_METRICS.filter((name) => !KIND_METRICS[a.kind].includes(name)),
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states of each field, one value a field: the line, the wavelength traced, the field angle, whether
 * it has figures (`settled`: 1, NaN for a field without), where its chief ray lands, its figures (NaN where it has
 * none), its pupils (its own, or of its chief ray), and its sampling by every name it states; and its reference, one
 * value each.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const answer = data as ChiefNativeData;
  const nan = (value: number | null | undefined): number => value ?? Number.NaN;
  const figure = (name: "realHeightMm" | "idealHeightMm" | "percent"): number[] =>
    answer.fields.map((field) => nan(field.figures?.[name]));
  const pupils = answer.fields.map(pupilsOf);
  const names = [...new Set(answer.fields.flatMap((field) => Object.keys(field.sampling)))].sort();
  return {
    line: answer.fields.map((field) => field.line),
    wavelengthNm: answer.fields.map((field) => field.wavelengthNm),
    fieldAngleDeg: answer.fields.map((field) => field.fieldAngleDeg),
    settled: answer.fields.map((field) => (factsOf(field).settled === null ? Number.NaN : 1)),
    chiefLandingMm: answer.fields.map((field) => nan(field.chiefLandingMm)),
    ...(answer.kind === "distortion"
      ? { realHeightMm: figure("realHeightMm"), idealHeightMm: figure("idealHeightMm"), percent: figure("percent") }
      : {}),
    ...(answer.kind === "pupils"
      ? {
          entrancePupilZ: pupils.map((each) => nan(each.entrance)),
          exitPupilZ: pupils.map((each) => nan(each.exit)),
        }
      : {}),
    ...Object.fromEntries(names.map((name) => [name, answer.fields.map((field) => nan(sampledOf(field, name)))])),
    focalScaleMm: [nan(answer.reference.focalScaleMm)],
    probeAngleDeg: [nan(answer.reference.probeAngleDeg)],
    paraxialEntrancePupilZ: [nan(answer.reference.paraxialEntrancePupilZ)],
    paraxialExitPupilZ: [nan(answer.reference.paraxialExitPupilZ)],
  };
}

/**
 * The comparator of `chief.native` for rung R9b: two engines' own chief-ray figures of one case. Recorded: a figure is
 * written down, and judged only against an attention band the policy gives it.
 *
 * Each field is sorted first (`classifyChiefField`), and only a field of two methods is in a figure:
 *
 * - `chiefLanding.maxAbs`: how far apart the two answers' chief rays land on the image plane, the largest over the
 *   fields both have a landing of. A band of it in the policy is the limit of the sorting, as in R5: a field beyond it
 *   is of class `data`. Without one, no field is set aside by its landing, and the pair's reason says so;
 * - of distortion, the differences of the percent distortion (`distortionPercent.maxAbs`, percent points), of the real
 *   heights the curves plot (`realHeight.maxAbs`) and of the ideal heights (`idealHeight.maxAbs`), and of the two
 *   references' scales, of the larger (`focalScale.relative`);
 * - of lateral colour, the difference of each field's landing relative to the request's first line
 *   (`lateralColour.maxAbs`);
 * - of pupils, the differences of the real entrance pupils (`entrancePupil.maxAbs`) and exit pupils
 *   (`exitPupil.maxAbs`), and of the paraxial ones (`paraxialEntrancePupil.maxAbs`, `paraxialExitPupil.maxAbs`);
 * - `fields.compared`, `fields.data`, `fields.unavailable`: how many fields are of each kind.
 *
 * Every field that is in no figure is named in the notes with its class and reason. Answers of different kinds, for
 * different numbers of fields or for other lines, are not comparable.
 */
export const chiefNativeComparator: QuantityComparator = Object.freeze({
  quantity: CHIEF_NATIVE,
  rung: CHIEF_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: CHIEF_LANDING_METRIC, unit: "mm" },
    { name: PERCENT_METRIC, unit: "percent" },
    { name: REAL_METRIC, unit: "mm" },
    { name: IDEAL_METRIC, unit: "mm" },
    { name: SCALE_METRIC, unit: "1" },
    { name: LATERAL_METRIC, unit: "mm" },
    { name: ENTRANCE_METRIC, unit: "mm" },
    { name: EXIT_METRIC, unit: "mm" },
    { name: PARAXIAL_ENTRANCE_METRIC, unit: "mm" },
    { name: PARAXIAL_EXIT_METRIC, unit: "mm" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
