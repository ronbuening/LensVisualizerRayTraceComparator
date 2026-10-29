// The comparator of `axial.native` for rung R8b: two engines' own axial figures of one case, each from its own pupil,
// its own indices and its own arithmetic, set beside each other line by line. LensVisualizer's spherical-aberration
// and axial-colour sections beside optiland's own rays and paraxial focus at each line is the pair the rung is named
// for. Nothing here is gated, and no figure of it says that one method is right.
//
// An engine states its figures (LensVisualizer's sections) or the real rays it traced for them (optiland); the
// figures of rays are the comparator's own estimator's (`sphericalFigures`, `colourFigures` in
// src/estimators/axialIntercept.ts), formed at the marginal fraction the other answer took where it states one, so
// that two answers' marginal figures are of the same zone.
//
// A line is sorted before any difference is taken (`classifyAxialLine`): by R5's sorting first
// (`classifyNativeField`, src/compare/mtfNative.ts) and R5's classes in their order, unsupported (no figures), data,
// method. Data are: other wavelengths; then, this rung's own, an answer that traced the line at indices other than
// the case's (`sampling.indexMaxDelta` above 0: two traces of one source are the same bits), and pupils whose radii
// differ by more than the rung's relative limit (the same fractions of other radii are other rays); then identifying
// rays that land further apart than the rung's limit, or an answer that states no landing. The identifying ray is the
// near-axis pair of spherical aberration, whose mean lands on the axis by symmetry and so identifies nothing of the
// pupil, which the pupil's own limit does; and the marginal ray of colour. Only a line of two methods enters a figure.
import type { OpticalCase } from "../contract/case.ts";
import type { JsonObject } from "../contract/json.ts";
import { AXIAL_NATIVE } from "../contract/quantities/axialNative.ts";
import type {
  AxialNativeData,
  AxialNativeField,
  AxialNativeSpec,
  AxialRays,
} from "../contract/quantities/axialNative.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { axialIntercepts, colourFigures, sphericalFigures } from "../estimators/axialIntercept.ts";
import type { AxialInterceptSet } from "../estimators/axialIntercept.ts";
import type {
  ComparatorOutcome,
  ComparisonContext,
  ComputedMetric,
  QuantityComparator,
  UnmeasuredMetric,
} from "./comparator.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import { numberText } from "./metricText.ts";
import { classifyNativeField } from "./mtfNative.ts";
import type { NativeDifferenceClass, NativeFieldFacts, NativeFieldReason } from "./mtfNative.ts";

/** The rung of the engines' own axial figures. */
export const AXIAL_NATIVE_RUNG = "r8b";

/** How far apart two answers' identifying rays land on the image plane, mm: the limit of the sorting is its band. */
export const LANDING_METRIC = "landing.maxAbs";
/** How far apart the two answers' pupil radii are, of the larger: the limit of the sorting is its band. */
export const PUPIL_METRIC = "pupilRadius.relative";
/** Of spherical aberration, the marginal pair's intercept; of colour, each line's focus, its marginal ray's. */
export const MARGINAL_METRIC = "marginalIntercept.maxAbs";
export const LINE_FOCUS_METRIC = "lineFocus.maxAbs";
export const NEAR_AXIS_METRIC = "nearAxisIntercept.maxAbs";
export const LONGITUDINAL_METRIC = "longitudinalSa.maxAbs";
export const FOCUS_METRIC = "bestFocus.maxAbs";
export const RMS_METRIC = "bestFocusRms.maxAbs";
export const PROFILE_METRIC = "profile.maxAbs";
export const RELATIVE_METRIC = "relativeFocus.maxAbs";
export const PARAXIAL_METRIC = "paraxialFocalShift.maxAbs";

const SPHERICAL_METRICS = [
  MARGINAL_METRIC,
  NEAR_AXIS_METRIC,
  LONGITUDINAL_METRIC,
  FOCUS_METRIC,
  RMS_METRIC,
  PROFILE_METRIC,
];
const COLOUR_METRICS = [LINE_FOCUS_METRIC, RELATIVE_METRIC, PARAXIAL_METRIC];

/** What a line presents, whoever formed it: the engine's own figures or the comparator's of the engine's rays. */
interface LineFigures {
  readonly landingMm: number;
  readonly marginalFraction: number;
  readonly marginalInterceptZ: number;
  readonly nearAxisInterceptZ: number | null;
  readonly bestFocusZ: number | null;
  readonly bestFocusRmsMm: number | null;
  readonly profileMm: Float64Array | null;
}

/** The intercepts of the rays an engine traced for a line, and the signed fraction of each. */
function interceptsOf(rays: AxialRays): { readonly set: AxialInterceptSet; readonly fractions: Float64Array } {
  const values = (wire: AxialRays["fractions"]): Float64Array => decodeNdArray(wire).values as Float64Array;
  return {
    set: axialIntercepts({
      exitPoint: values(rays.exitPoint),
      exitDirection: values(rays.exitDirection),
      valid: decodeNdArray(rays.arrived).values,
    }),
    fractions: values(rays.fractions),
  };
}

/** The figures an engine states of a line, as they are compared. */
function stated(field: AxialNativeField): LineFigures | null {
  const { figures } = field;
  if (field.status !== "ok" || figures === null) return null;
  return {
    ...figures,
    profileMm: figures.profileMm === null ? null : (decodeNdArray(figures.profileMm).values as Float64Array),
  };
}

/** The marginal fraction an answer's figures took at its first line that has figures, or undefined. */
function fractionTaken(data: AxialNativeData): number | undefined {
  return data.fields.map(stated).find((figures) => figures !== null)?.marginalFraction;
}

/**
 * The figures of every line of an answer: those it states, or the comparator's of its rays. `fraction` is the marginal
 * fraction the other answer took, where it states figures: the rays' figures are formed there.
 */
function figuresOf(
  data: AxialNativeData,
  spec: AxialNativeSpec,
  imageZ: number,
  fraction: number | undefined,
): (LineFigures | null)[] {
  if (data.fields.every((field) => field.rays === null)) return data.fields.map(stated);
  if (spec.kind === "spherical") {
    return data.fields.map((field) => {
      if (field.status !== "ok" || field.rays === null) return stated(field);
      const { set, fractions } = interceptsOf(field.rays);
      const roles = {
        fractions,
        nearAxis: spec.nearAxis,
        marginal: fraction === undefined ? spec.marginal : [fraction],
        profile: spec.profile,
      };
      const made = sphericalFigures(set, roles, imageZ);
      return "reason" in made ? null : made.figures;
    });
  }
  const traced = data.fields.map((field) =>
    field.status === "ok" && field.rays !== null ? interceptsOf(field.rays) : null,
  );
  const present = traced.flatMap((line) => (line === null ? [] : [line]));
  const made = colourFigures(present, spec.marginal, imageZ, fraction);
  let at = 0;
  return traced.map((line, index) => {
    if (line === null) return stated(data.fields[index]);
    const figures = made[at++];
    return figures === null
      ? null
      : { ...figures, nearAxisInterceptZ: null, bestFocusZ: null, bestFocusRmsMm: null, profileMm: null };
  });
}

/**
 * What the sorting reads of one line of an answer: R5's facts (whether it has figures, where its identifying ray
 * lands), the radius of the answer's pupil, and how far the indices it traced the line at are from the case's, null
 * where it does not say (an engine that traces the case's own).
 */
export interface AxialLineFacts extends NativeFieldFacts {
  readonly pupilRadiusMm: number;
  readonly indexMaxDelta: number | null;
}

/** Why a line has its class: R5's reasons, and this rung's two of class `data`. */
export type AxialLineReason = NativeFieldReason | "indices-differ" | "pupils-apart";

/** How one line was sorted. */
export interface AxialLineSorting {
  readonly class: NativeDifferenceClass;
  readonly reason: AxialLineReason;
  /** How far apart the identifying rays land, mm; null where an answer does not say where its own lands. */
  readonly landingMm: number | null;
  /** How far apart the pupils' radii are, of the larger. */
  readonly pupilRelative: number;
  /** True for a line whose difference enters a figure: class `method`, reason `two-methods`. */
  readonly banded: boolean;
}

/** |a - b| over the larger magnitude, 0 for two radii of 0. */
function relativeDifference(a: number, b: number): number {
  const larger = Math.max(Math.abs(a), Math.abs(b));
  return larger === 0 ? 0 : Math.abs(a - b) / larger;
}

/**
 * Sorts one line of two answers. R5's sorting decides first (`classifyNativeField`): a line without figures is
 * `unsupported`, a line of other wavelengths `data`. Then this rung's own reasons of class `data`, in this order:
 * `indices-differ`, where an answer states that it traced the line at indices other than the case's (an
 * `indexMaxDelta` above 0); `pupils-apart`, where the pupils' radii differ by more than `pupilLimit` of the larger (a
 * limit that is no number is no limit). Then R5's again: the landing of the identifying rays, against
 * `landingLimitMm`. Swapping the two answers changes nothing.
 */
export function classifyAxialLine(
  a: AxialLineFacts,
  b: AxialLineFacts,
  sameLines: boolean,
  landingLimitMm: number,
  pupilLimit: number,
): AxialLineSorting {
  const base = classifyNativeField(a, b, sameLines, landingLimitMm);
  const pupilRelative = relativeDifference(a.pupilRadiusMm, b.pupilRadiusMm);
  const sorted = (kind: NativeDifferenceClass, reason: AxialLineReason, banded = false): AxialLineSorting => ({
    class: kind,
    reason,
    landingMm: base.landingMm,
    pupilRelative,
    banded,
  });
  if (base.class === "unsupported" || base.reason === "lines-differ") return sorted(base.class, base.reason);
  if ((a.indexMaxDelta ?? 0) > 0 || (b.indexMaxDelta ?? 0) > 0) return sorted("data", "indices-differ");
  if (pupilRelative > pupilLimit) return sorted("data", "pupils-apart");
  return sorted(base.class, base.reason, base.banded);
}

/** A value of a line's sampling, or null where the line states none under the name. */
function sampledOf(field: AxialNativeField, name: string): number | null {
  return Object.hasOwn(field.sampling, name) ? field.sampling[name] : null;
}

/** What the sorting reads of one line of an answer, of its figures (the engine's own, or of its rays). */
function factsOf(data: AxialNativeData, field: AxialNativeField, figures: LineFigures | null): AxialLineFacts {
  return {
    settled: figures === null ? null : 1,
    imageHeightMm: figures?.landingMm ?? null,
    rimRaysLost: null,
    pupilRadiusMm: data.pupilRadiusMm,
    indexMaxDelta: sampledOf(field, "indexMaxDelta"),
  };
}

/**
 * What the sorting reads of line `index` of the values a comparison records of an answer (`recorded`): a report
 * repeats the sorting from them (`classifyAxialLine`). A line of rays is recorded at the answer's own marginal
 * fraction: where the two answers took different fractions (`marginalFraction`), the comparator formed the rays'
 * landing at the other's, and the repeated landing may differ.
 */
export function axialFactsOfRecorded(recorded: RecordedValues, index: number): AxialLineFacts {
  const at = (name: string, place = index): number | null => {
    const value = Object.hasOwn(recorded, name) ? recorded[name][place] : undefined;
    return value === undefined || Number.isNaN(value) ? null : value;
  };
  return {
    settled: at("settled"),
    imageHeightMm: at("landingMm"),
    rimRaysLost: null,
    pupilRadiusMm: at("pupilRadiusMm", 0) ?? Number.NaN,
    indexMaxDelta: at("indexMaxDelta"),
  };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: AxialNativeData, b: AxialNativeData): string | null {
  if (a.kind !== b.kind) return `one answer is of ${a.kind} and the other of ${b.kind}`;
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((first, second) => first - second);
    return `the answers are for ${fewer} and ${more} lines: they answer different requests`;
  }
  const at = a.fields.findIndex((field, index) => field.line !== b.fields[index].line);
  if (at >= 0) return `entry ${at} is of line ${a.fields[at].line} in one answer and ${b.fields[at].line} in the other`;
  return null;
}

/** What is said of a line that is in no figure, after its class and reason, the engines named by their methods. */
function whyOf(
  sorting: AxialLineSorting,
  sides: readonly {
    readonly data: AxialNativeData;
    readonly field: AxialNativeField;
    readonly figures: LineFigures | null;
  }[],
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the identifying rays land ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "lines-differ":
      return `the answers traced ${each(({ field }) => String(field.wavelengthNm)).join(" and ")} nm`;
    case "indices-differ":
      return each(({ data, field }) => {
        const delta = sampledOf(field, "indexMaxDelta") ?? 0;
        return delta > 0 ? `${data.method.name} traced indices up to ${numberText(delta)} from the case's` : null;
      }).join("; ");
    case "pupils-apart":
      return `the pupils' radii differ by ${numberText(sorting.pupilRelative)} of the larger`;
    default:
      return each(({ data, field, figures }) =>
        figures !== null
          ? null
          : `${data.method.name}: ${field.status === "ok" ? "no figures of its rays" : `${field.status} (${field.reason ?? "no reason"})`}`,
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
  const [a, b] = [dataA as AxialNativeData, dataB as AxialNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  const spec = context?.spec as AxialNativeSpec | undefined;
  const opticalCase: OpticalCase | undefined = context?.opticalCase;
  const hasRays = [a, b].some((data) => data.fields.some((field) => field.rays !== null));
  if (hasRays && (spec === undefined || opticalCase === undefined)) {
    return {
      comparable: false,
      reason: "the spec or the case is not at hand: the figures of rays are formed from both",
    };
  }
  const imageZ = opticalCase?.conditions.imageZ ?? Number.NaN;
  const [figuresA, figuresB] = [
    figuresOf(a, spec!, imageZ, fractionTaken(b)),
    figuresOf(b, spec!, imageZ, fractionTaken(a)),
  ];
  // The limits of the sorting are the owner's to set; without one no line is set aside by what it is of.
  const limit = context?.policy?.metrics[LANDING_METRIC]?.attention;
  const pupilLimit = context?.policy?.metrics[PUPIL_METRIC]?.attention;
  const notes: string[] = [];
  if (limit === undefined)
    notes.push(`the rung sets no limit on ${LANDING_METRIC}: no line is set aside by its landing`);
  if (pupilLimit === undefined)
    notes.push(`the rung sets no limit on ${PUPIL_METRIC}: no line is set aside by its pupil`);

  const largest = Object.fromEntries(
    [LANDING_METRIC, ...SPHERICAL_METRICS, ...COLOUR_METRICS].map((name) => [name, largestOf(name)]),
  );
  const marginalMetric = a.kind === "spherical" ? MARGINAL_METRIC : LINE_FOCUS_METRIC;
  const counts = { compared: 0, data: 0, unavailable: 0 };
  const banded: boolean[] = [];
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const [one, two] = [figuresA[index], figuresB[index]];
    const sorting = classifyAxialLine(
      factsOf(a, fieldA, one),
      factsOf(b, fieldB, two),
      fieldA.wavelengthNm === fieldB.wavelengthNm,
      limit ?? Number.POSITIVE_INFINITY,
      pupilLimit ?? Number.POSITIVE_INFINITY,
    );
    const where = { line: fieldA.line };
    if (sorting.landingMm !== null && sorting.class !== "unsupported")
      largest[LANDING_METRIC].take(sorting.landingMm, where);
    banded.push(sorting.banded);
    if (!sorting.banded) {
      const why = whyOf(sorting, [
        { data: a, field: fieldA, figures: one },
        { data: b, field: fieldB, figures: two },
      ]);
      notes.push(`line ${fieldA.line}: ${sorting.class}, ${sorting.reason} (${why})`);
      if (sorting.class === "unsupported") counts.unavailable++;
      else counts.data++;
      continue;
    }
    counts.compared++;
    const [x, y] = [one!, two!];
    if (x.marginalFraction !== y.marginalFraction) {
      notes.push(`line ${fieldA.line}: the marginal fractions are ${x.marginalFraction} and ${y.marginalFraction}`);
    } else largest[marginalMetric].take(Math.abs(x.marginalInterceptZ - y.marginalInterceptZ), where);
    if (a.kind === "spherical") {
      largest[NEAR_AXIS_METRIC].take(Math.abs(x.nearAxisInterceptZ! - y.nearAxisInterceptZ!), where);
      if (x.marginalFraction === y.marginalFraction) {
        const [sa, sb] = [x.marginalInterceptZ - x.nearAxisInterceptZ!, y.marginalInterceptZ - y.nearAxisInterceptZ!];
        largest[LONGITUDINAL_METRIC].take(Math.abs(sa - sb), where);
      }
      largest[FOCUS_METRIC].take(Math.abs(x.bestFocusZ! - y.bestFocusZ!), where);
      largest[RMS_METRIC].take(Math.abs(x.bestFocusRmsMm! - y.bestFocusRmsMm!), where);
      const [pa, pb] = [x.profileMm!, y.profileMm!];
      if (pa.length !== pb.length) {
        return {
          comparable: false,
          reason: `the profiles of line ${fieldA.line} have ${pa.length} and ${pb.length} zones`,
        };
      }
      pa.forEach((value, zone) => {
        if (Number.isFinite(value) && Number.isFinite(pb[zone])) {
          largest[PROFILE_METRIC].take(Math.abs(value - pb[zone]), { ...where, ray: zone });
        }
      });
    }
  }

  // Colour: each line's focus relative to the first line of the request, real against real and real against the
  // other engine's paraxial focal shift, where the first line and the line are both of two methods.
  if (a.kind === "colour" && banded[0]) {
    const [firstA, firstB] = [figuresA[0]!, figuresB[0]!];
    for (let index = 1; index < a.fields.length; index++) {
      if (!banded[index]) continue;
      const where = { line: a.fields[index].line };
      const realA = figuresA[index]!.marginalInterceptZ - firstA.marginalInterceptZ;
      const realB = figuresB[index]!.marginalInterceptZ - firstB.marginalInterceptZ;
      if (firstA.marginalFraction === firstB.marginalFraction)
        largest[RELATIVE_METRIC].take(Math.abs(realA - realB), where);
      for (const [real, other] of [
        [realA, b],
        [realB, a],
      ] as const) {
        const [focus, first] = [other.fields[index].paraxialFocusZ, other.fields[0].paraxialFocusZ];
        if (focus !== null && first !== null) largest[PARAXIAL_METRIC].take(Math.abs(real - (focus - first)), where);
      }
    }
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  const own = a.kind === "spherical" ? SPHERICAL_METRICS : COLOUR_METRICS;
  metrics.push({ name: PUPIL_METRIC, value: relativeDifference(a.pupilRadiusMm, b.pupilRadiusMm) });
  for (const name of [LANDING_METRIC, ...own]) {
    const value = largest[name].value();
    if (value !== null) metrics.push(value);
    else
      unmeasured.push({
        name,
        reason:
          name === PARAXIAL_METRIC
            ? "no line of two methods has a paraxial focus beside a real one"
            : "no line of two methods has the figure in both answers",
      });
  }
  metrics.push(
    { name: "fields.compared", value: counts.compared },
    { name: "fields.data", value: counts.data },
    { name: "fields.unavailable", value: counts.unavailable },
  );
  return {
    comparable: true,
    // Spherical aberration has no line focus or relative focus, and colour no marginal or near-axis pair, best focus
    // or profile.
    inapplicable: a.kind === "spherical" ? COLOUR_METRICS : SPHERICAL_METRICS,
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states of each line, one value a line: the line, the wavelength traced, whether it has figures
 * (`settled`: 1, NaN for a line without), the paraxial focus, and its figures, the engine's own or the comparator's
 * of its rays (NaN where it has none, or where the spec or the case is not at hand), with the profile of each line
 * one after the other under `profileMm`, and its sampling by every name it states. `pupilRadiusMm` is the radius.
 */
function recorded(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] } {
  const answer = data as AxialNativeData;
  const spec = context?.spec as AxialNativeSpec | undefined;
  const imageZ = context?.opticalCase?.conditions.imageZ;
  const figures =
    spec === undefined || imageZ === undefined ? answer.fields.map(stated) : figuresOf(answer, spec, imageZ, undefined);
  const of = (name: Exclude<keyof LineFigures, "profileMm">): number[] =>
    figures.map((each) => each?.[name] ?? Number.NaN);
  const names = [...new Set(answer.fields.flatMap((field) => Object.keys(field.sampling)))].sort();
  return {
    line: answer.fields.map((field) => field.line),
    wavelengthNm: answer.fields.map((field) => field.wavelengthNm),
    settled: figures.map((each) => (each === null ? Number.NaN : 1)),
    paraxialFocusZ: answer.fields.map((field) => field.paraxialFocusZ ?? Number.NaN),
    landingMm: of("landingMm"),
    marginalFraction: of("marginalFraction"),
    marginalInterceptZ: of("marginalInterceptZ"),
    ...(answer.kind === "spherical"
      ? {
          nearAxisInterceptZ: of("nearAxisInterceptZ"),
          bestFocusZ: of("bestFocusZ"),
          bestFocusRmsMm: of("bestFocusRmsMm"),
          profileMm: figures.flatMap((each) => [...(each?.profileMm ?? [])]),
        }
      : {}),
    ...Object.fromEntries(
      names.map((name) => [
        name,
        answer.fields.map((field) => (Object.hasOwn(field.sampling, name) ? field.sampling[name] : Number.NaN)),
      ]),
    ),
    pupilRadiusMm: [answer.pupilRadiusMm],
  };
}

/**
 * The comparator of `axial.native` for rung R8b: two engines' own axial figures of one case. Recorded: a figure is
 * written down, and judged only against an attention band the policy gives it.
 *
 * Each line is sorted first (`classifyAxialLine`), and only a line of two methods is in a figure:
 *
 * - `pupilRadius.relative`: how far apart the two answers' pupil radii are, of the larger. A band of it in the policy
 *   is a limit of the sorting: beyond it every line is of class `data`. Without one, no line is set aside by its
 *   pupil, and the pair's reason says so;
 * - `landing.maxAbs`: how far apart the two answers' identifying rays land on the image plane, the largest over the
 *   lines both have figures for. A band of it in the policy is the other limit of the sorting, as in R5: a line beyond
 *   it is of class `data`. Without one, no line is set aside by its landing, and the pair's reason says so;
 * - of spherical aberration, the differences of the marginal intercepts where both took one fraction
 *   (`marginalIntercept.maxAbs`), of the near-axis intercepts (`nearAxisIntercept.maxAbs`), of the longitudinal
 *   spherical aberration, marginal less near-axis (`longitudinalSa.maxAbs`), of the best focus (`bestFocus.maxAbs`),
 *   of the RMS there (`bestFocusRms.maxAbs`) and of the profile, zone by zone where both have the zone
 *   (`profile.maxAbs`, the zone in `where` as its `ray`);
 * - of colour, the difference of each line's real focus, its marginal ray's intercept, where both took one fraction
 *   (`lineFocus.maxAbs`); of each line's real focus relative to the first line (`relativeFocus.maxAbs`); and of one
 *   engine's real relative focus from the other's paraxial chromatic focal shift (`paraxialFocalShift.maxAbs`), a
 *   different quantity: it is the size of the spherochromatism of the marginal zone and of everything else apart;
 * - `fields.compared`, `fields.data`, `fields.unavailable`: how many lines are of each kind.
 *
 * Every line that is in no figure is named in the notes with its class and reason. Answers of different kinds, for
 * different numbers of lines or for other lines, profiles of different lengths, and an answer of rays without the spec
 * or the case at hand, are not comparable.
 */
export const axialNativeComparator: QuantityComparator = Object.freeze({
  quantity: AXIAL_NATIVE,
  rung: AXIAL_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: PUPIL_METRIC, unit: "1" },
    { name: LANDING_METRIC, unit: "mm" },
    { name: MARGINAL_METRIC, unit: "mm" },
    { name: NEAR_AXIS_METRIC, unit: "mm" },
    { name: LONGITUDINAL_METRIC, unit: "mm" },
    { name: FOCUS_METRIC, unit: "mm" },
    { name: RMS_METRIC, unit: "mm" },
    { name: PROFILE_METRIC, unit: "mm" },
    { name: LINE_FOCUS_METRIC, unit: "mm" },
    { name: RELATIVE_METRIC, unit: "mm" },
    { name: PARAXIAL_METRIC, unit: "mm" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
  ]),
  compare,
  recorded,
});
