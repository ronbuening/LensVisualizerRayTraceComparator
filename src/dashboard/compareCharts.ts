// The detail views of an "LV vs optiland" tab (Stage 8.5): for one recorded comparison of LensVisualizer's answer
// beside its counterpart's (optiland's, optiland-wave's or flux's), each value both answers recorded, as a Figure of
// the comparison file (`participants[].recorded`), set on shared axes, and their differences as Derived numbers with
// the attention band the policy at hand gives the metric of that value. A fan is read from the two answers' store
// entries, by the keys the manifest names for their jobs. Nothing is judged here: the pair's verdict is the
// comparison's, and the sorting of each element (field or line) is repeated from the recorded values by the
// comparator's own functions, as the MTF report repeats R5's; only an element of two methods has a difference drawn.
import { classifyAxialLine, axialFactsOfRecorded, LANDING_METRIC, PUPIL_METRIC } from "../compare/axialNative.ts";
import { CHIEF_LANDING_METRIC, chiefFactsOfRecorded, classifyChiefField } from "../compare/chiefNative.ts";
import { curvatureFactsOfRecorded } from "../compare/curvatureNative.ts";
import { classifyNativeField, factsOfRecorded, sameWavelengths } from "../compare/mtfNative.ts";
import { REAR_FOCUS_METRIC, SUMMARY_FIGURES, summaryFactsOfRecorded } from "../compare/summaryNative.ts";
import { vignettingFactsOfRecorded } from "../compare/vignettingNative.ts";
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import type { RecordedValues } from "../contract/comparison.ts";
import type { Policy } from "../contract/policy.ts";
import { AXIAL_NATIVE } from "../contract/quantities/axialNative.ts";
import { CHIEF_NATIVE } from "../contract/quantities/chiefNative.ts";
import { CURVATURE_NATIVE } from "../contract/quantities/curvatureNative.ts";
import { SPOT_NATIVE } from "../contract/quantities/spotNative.ts";
import { SUMMARY_NATIVE, SUMMARY_VALUES } from "../contract/quantities/summaryNative.ts";
import { VIGNETTING_NATIVE } from "../contract/quantities/vignettingNative.ts";
import type { StoreEntry } from "../core/resultStore.ts";
import { DASHBOARD_TEXT } from "../report/wording.ts";
import { curveAt } from "./chartViews.ts";
import type { Answer } from "./chartViews.ts";
import { figureAt, optionalFigureAt } from "./figure.ts";
import type { Curve, Derived, DocumentName, Figure } from "./figure.ts";

const TEXT = DASHBOARD_TEXT.compare;

/** A figure with the name of the recorded value (or the spec's member) it is of. */
export interface Keyed {
  readonly key: string;
  readonly value: Figure;
}

/** How the comparison's sorting places one element (a field or a line) of a pair, repeated from what it recorded. */
export interface ElementSorting {
  readonly class: string;
  readonly reason: string;
  /** True for an element of two methods: its differences enter the figures and the band. */
  readonly banded: boolean;
}

/** An element the sorting sets aside: no difference of it is drawn. */
export interface SetAsideElement {
  readonly element: number;
  /** Where the element is on the chart's axis, as the first engine recorded it; null where it records none. */
  readonly at: Keyed | null;
  readonly class: string;
  readonly reason: string;
}

/** One engine's values of one group (a line, or a component) on the chart's two axes. */
export interface PairSeries {
  readonly engine: string;
  readonly group: string | null;
  readonly points: readonly { readonly element: number; readonly x: Keyed; readonly y: Keyed }[];
}

/** A chart of a recorded value against a recorded axis: both answers, and their differences. */
export interface PairChartView {
  readonly kind: "points";
  /** The recorded values the chart plots, one name for each group. */
  readonly values: readonly string[];
  /** The recorded value (or the spec's member) the horizontal axis is. */
  readonly axis: string;
  readonly a: string;
  readonly b: string;
  readonly series: readonly PairSeries[];
  /** The first engine's value minus the second's, at each element of two methods where both are finite numbers. */
  readonly differences: readonly {
    readonly group: string | null;
    readonly points: readonly { readonly element: number; readonly x: Keyed; readonly difference: Derived }[];
  }[];
  /** The policy's metric of these values, and its attention band at hand; null where it gives none. */
  readonly metric: string | null;
  readonly band: Figure | null;
  readonly setAside: readonly SetAsideElement[];
}

/** One engine's ray fan of one field, as its store entry holds it. */
export interface FanSeries {
  readonly engine: string;
  readonly pupil: Curve | null;
  readonly error: Curve | null;
  /** Why the engine has no fan to draw; null where it has one. */
  readonly missing: string | null;
}

/** The ray fan of one field of both answers, and the transverse error of one minus the other's at each sample. */
export interface FanChartView {
  readonly kind: "fan";
  readonly element: number;
  readonly field: Figure | null;
  readonly axis: string | null;
  readonly a: string;
  readonly b: string;
  readonly series: readonly FanSeries[];
  /** At each sample (by its place in the fan) where both errors are finite numbers, for a field of two methods. */
  readonly differences: readonly { readonly element: number; readonly difference: Derived }[];
  readonly metric: string;
  readonly band: Figure | null;
  readonly sorting: ElementSorting;
}

/** One value of one element in both answers: a row of a table, with its difference and the band. */
export interface ValuesRow {
  readonly element: number;
  readonly group: string | null;
  readonly name: string;
  readonly a: Keyed | null;
  readonly b: Keyed | null;
  readonly difference: Derived | null;
  readonly metric: string | null;
  readonly band: Figure | null;
}

/** The values of a recorded comparison as a table, where a chart has no axis to plot them on. */
export interface ValuesTableView {
  readonly kind: "values";
  readonly a: string;
  readonly b: string;
  readonly rows: readonly ValuesRow[];
  readonly setAside: readonly SetAsideElement[];
}

/** A detail of a recorded comparison. */
export type PairDetail = PairChartView | FanChartView | ValuesTableView;

/** One recorded comparison set's pair, where its values are read. */
export interface PairPlace {
  readonly suite: string;
  readonly comparisons: ComparisonFile;
  /** The set, its participants of the two engines, and the pair's own place in the set. */
  readonly set: number;
  readonly a: { readonly engine: string; readonly participant: number };
  readonly b: { readonly engine: string; readonly participant: number };
  readonly policyDocument: DocumentName | null;
  readonly policy: Policy | null;
  /** The answers of the two engines' first jobs of the request: where a fan and the request's spec are read. */
  readonly answers: { readonly a: Answer | null; readonly b: Answer | null };
}

/** The recorded values of one engine of a set; an empty record where it recorded none. */
function recordedOf(place: PairPlace, side: "a" | "b"): RecordedValues {
  const set = place.comparisons.comparisons[place.set];
  return set.participants[place[side].participant]?.recorded ?? {};
}

/** The keyed figure of a recorded value at one element; null where the record has no such value there. */
function recordedFigure(place: PairPlace, side: "a" | "b", name: string, element: number): Keyed | null {
  const document: DocumentName = `comparisons:${place.suite}`;
  const tokens = ["comparisons", place.set, "participants", place[side].participant, "recorded", name, element];
  const figure = optionalFigureAt(document, place.comparisons, tokens);
  return figure === null ? null : { key: name, value: figure };
}

/** The attention band the policy at hand gives a metric of the rung; null where it gives none. */
function bandOf(place: PairPlace, rung: string, metric: string | null): Figure | null {
  if (metric === null || place.policyDocument === null || place.policy === null) return null;
  return optionalFigureAt(place.policyDocument, place.policy, ["rungs", rung, "metrics", metric, "attention"]);
}

/** A limit of the sorting: the attention of a metric of the rung in the policy, or no limit. */
function limitOf(policy: Policy | null, rung: string, metric: string): number {
  return policy?.rungs[rung]?.metrics[metric]?.attention ?? Number.POSITIVE_INFINITY;
}

/** The value of a record at an element as a number, or null. */
function at(recorded: RecordedValues, name: string, element: number): number | null {
  const value = Object.hasOwn(recorded, name) ? recorded[name][element] : undefined;
  return value === undefined || value === null || Number.isNaN(value) ? null : value;
}

/**
 * The sorting of each element of a pair of recorded answers, by the comparator of the quantity, repeated from the
 * values it recorded: R5's classes and reasons, and the rung's own (`indices-differ`, `pupils-apart`).
 */
export function elementSortings(
  quantity: string,
  rung: string,
  a: RecordedValues,
  b: RecordedValues,
  policy: Policy | null,
): ElementSorting[] {
  const count = Math.max(a.settled?.length ?? 0, b.settled?.length ?? 0);
  const sameAt = (element: number): boolean =>
    at(a, "wavelengthNm", element) !== null && at(a, "wavelengthNm", element) === at(b, "wavelengthNm", element);
  const sorted = (sorting: { class: string; reason: string; banded: boolean }): ElementSorting => ({
    class: sorting.class,
    reason: sorting.reason,
    banded: sorting.banded,
  });
  return Array.from({ length: count }, (_unused, element) => {
    switch (quantity) {
      case SPOT_NATIVE:
        return sorted(
          classifyNativeField(
            factsOfRecorded(a, element),
            factsOfRecorded(b, element),
            sameWavelengths(a.lineWavelengthNm ?? [], b.lineWavelengthNm ?? []),
            limitOf(policy, rung, CHIEF_LANDING_METRIC),
          ),
        );
      case AXIAL_NATIVE:
        return sorted(
          classifyAxialLine(
            axialFactsOfRecorded(a, element),
            axialFactsOfRecorded(b, element),
            sameAt(element),
            limitOf(policy, rung, LANDING_METRIC),
            limitOf(policy, rung, PUPIL_METRIC),
          ),
        );
      case CHIEF_NATIVE:
        return sorted(
          classifyChiefField(
            chiefFactsOfRecorded(a, element),
            chiefFactsOfRecorded(b, element),
            sameAt(element),
            limitOf(policy, rung, CHIEF_LANDING_METRIC),
          ),
        );
      case CURVATURE_NATIVE:
        return sorted(
          classifyChiefField(
            curvatureFactsOfRecorded(a, element),
            curvatureFactsOfRecorded(b, element),
            sameAt(element),
            limitOf(policy, rung, CHIEF_LANDING_METRIC),
          ),
        );
      case VIGNETTING_NATIVE:
        return sorted(
          classifyChiefField(
            vignettingFactsOfRecorded(a, element),
            vignettingFactsOfRecorded(b, element),
            sameAt(element),
            limitOf(policy, rung, CHIEF_LANDING_METRIC),
          ),
        );
      default:
        return sorted(
          classifyNativeField(
            summaryFactsOfRecorded(a, element),
            summaryFactsOfRecorded(b, element),
            sameAt(element),
            limitOf(policy, rung, REAR_FOCUS_METRIC),
          ),
        );
    }
  });
}

/** The difference of two keyed figures, as a Derived; null where either is not a finite number. */
function differenceOf(a: string, b: string, one: Keyed | null, two: Keyed | null): Derived | null {
  if (one === null || two === null || one.value.value === null || two.value.value === null) return null;
  return {
    value: one.value.value - two.value.value,
    derivation: TEXT.derivedPair(a, b, one.key),
    of: [one.value.source, two.value.source],
  };
}

/** The elements a sorting sets aside, each where the chart's axis has it. */
function setAsideOf(
  place: PairPlace,
  sortings: readonly ElementSorting[],
  axis: string | null,
  elements: readonly number[],
): SetAsideElement[] {
  return elements.flatMap((element) => {
    const sorting = sortings[element];
    if (sorting === undefined || sorting.banded) return [];
    const where = axis === null ? null : recordedFigure(place, "a", axis, element);
    return [{ element, at: where, class: sorting.class, reason: sorting.reason }];
  });
}

/** A group of elements: those of one line (by the wavelength the first engine recorded), or all of them. */
function groupsOf(
  place: PairPlace,
  count: number,
  byLine: boolean,
): { readonly group: string | null; readonly elements: number[] }[] {
  const elements = Array.from({ length: count }, (_unused, element) => element);
  if (!byLine) return [{ group: null, elements }];
  const recorded = recordedOf(place, "a");
  const groups = new Map<string, number[]>();
  for (const element of elements) {
    const wavelength = at(recorded, "wavelengthNm", element);
    const group = wavelength === null ? TEXT.groupNoLine : TEXT.groupLine(String(wavelength));
    groups.set(group, [...(groups.get(group) ?? []), element]);
  }
  return [...groups].map(([group, members]) => ({ group, elements: members }));
}

/**
 * A chart of recorded values against a recorded axis: for each group and each of `values` (one per group where
 * `values` names several components, which then are the groups), both engines' points, and the differences at each
 * element of two methods.
 */
function pointsChart(
  place: PairPlace,
  rung: string,
  sortings: readonly ElementSorting[],
  options: {
    readonly values: readonly string[];
    readonly axis: string;
    readonly metric: string | null;
    readonly byLine: boolean;
    /** Names a group for each of several values (`centroidXMm` as x): the values are the groups. */
    readonly components?: readonly string[];
  },
): PairChartView {
  const { a, b } = place;
  const count = sortings.length;
  const groups: { group: string | null; elements: number[]; value: string }[] =
    options.components === undefined
      ? groupsOf(place, count, options.byLine).map((each) => ({ ...each, value: options.values[0] }))
      : options.values.map((value, index) => ({
          group: options.components![index],
          elements: Array.from({ length: count }, (_unused, element) => element),
          value,
        }));
  const series: PairSeries[] = [];
  const differences: PairChartView["differences"][number][] = [];
  for (const { group, elements, value } of groups) {
    for (const side of ["a", "b"] as const) {
      const points = elements.flatMap((element) => {
        const x = recordedFigure(place, side, options.axis, element);
        const y = recordedFigure(place, side, value, element);
        return x === null || y === null ? [] : [{ element, x, y }];
      });
      series.push({ engine: place[side].engine, group, points });
    }
    const points = elements.flatMap((element) => {
      if (!sortings[element]?.banded) return [];
      const x = recordedFigure(place, "a", options.axis, element);
      const difference = differenceOf(
        a.engine,
        b.engine,
        recordedFigure(place, "a", value, element),
        recordedFigure(place, "b", value, element),
      );
      return x === null || difference === null ? [] : [{ element, x, difference }];
    });
    differences.push({ group, points });
  }
  const all = Array.from({ length: count }, (_unused, element) => element);
  return {
    kind: "points",
    values: [...options.values],
    axis: options.axis,
    a: a.engine,
    b: b.engine,
    series,
    differences,
    metric: options.metric,
    band: bandOf(place, rung, options.metric),
    setAside: setAsideOf(place, sortings, options.axis, all),
  };
}

/** A table of recorded values, one row for each element and value. */
function valuesTable(
  place: PairPlace,
  rung: string,
  sortings: readonly ElementSorting[],
  values: readonly { readonly name: string; readonly metric: string | null }[],
): ValuesTableView {
  const groups = groupsOf(place, sortings.length, true);
  const rows: ValuesRow[] = [];
  for (const { group, elements } of groups) {
    for (const element of elements) {
      for (const { name, metric } of values) {
        const [one, two] = [recordedFigure(place, "a", name, element), recordedFigure(place, "b", name, element)];
        if (one === null && two === null) continue;
        rows.push({
          element,
          group,
          name,
          a: one,
          b: two,
          difference: sortings[element]?.banded ? differenceOf(place.a.engine, place.b.engine, one, two) : null,
          metric,
          band: bandOf(place, rung, metric),
        });
      }
    }
  }
  const all = Array.from({ length: sortings.length }, (_unused, element) => element);
  return {
    kind: "values",
    a: place.a.engine,
    b: place.b.engine,
    rows,
    setAside: setAsideOf(place, sortings, "wavelengthNm", all),
  };
}

/** The spec member of the request a store entry is of, by a path; undefined where there is none. */
function specOf(entry: StoreEntry | null | undefined): Record<string, unknown> | undefined {
  return entry?.request.spec as Record<string, unknown> | undefined;
}

/** The fan charts of a `spot.native` request of the pattern "fan": one chart for each field, read from the store. */
function fanCharts(place: PairPlace, rung: string, sortings: readonly ElementSorting[]): FanChartView[] {
  const metric = "fanError.maxAbs";
  const band = bandOf(place, rung, metric);
  const fieldsOf = (answer: Answer | null): unknown[] => {
    const fields = (answer?.entry?.result.data as { fields?: unknown } | undefined)?.fields;
    return answer?.missing === null && Array.isArray(fields) ? fields : [];
  };
  const axis = (specOf(place.answers.a?.entry)?.pupil as { axis?: unknown } | undefined)?.axis;
  const count = Math.max(fieldsOf(place.answers.a).length, fieldsOf(place.answers.b).length);
  return Array.from({ length: count }, (_unused, element): FanChartView => {
    const seriesOf = (side: "a" | "b"): FanSeries => {
      const answer = place.answers[side];
      const engine = place[side].engine;
      if (answer === null) return { engine, pupil: null, error: null, missing: TEXT.noJob(engine) };
      if (answer.missing !== null || answer.document === null || answer.entry === null) {
        return { engine, pupil: null, error: null, missing: answer.missing ?? TEXT.noJob(engine) };
      }
      const pupil = curveAt(answer.document, answer.entry, ["result", "data", "fields", element, "fan", "pupil"]);
      const error = curveAt(answer.document, answer.entry, ["result", "data", "fields", element, "fan", "errorMm"]);
      return { engine, pupil, error, missing: pupil === null || error === null ? TEXT.noFan(engine) : null };
    };
    const [one, two] = [seriesOf("a"), seriesOf("b")];
    const sorting = sortings[element] ?? { class: "unsupported", reason: "no-curve", banded: false };
    const differences: FanChartView["differences"][number][] = [];
    if (sorting.banded && one.error !== null && two.error !== null) {
      one.error.values.forEach((value, index) => {
        const other = two.error?.values[index];
        if (value === null || other === null || other === undefined) return;
        differences.push({
          element: index,
          difference: {
            value: value - other,
            derivation: DASHBOARD_TEXT.charts.derivedDifference(one.engine, two.engine, String(index)),
            of: [one.error!.source, two.error!.source],
          },
        });
      });
    }
    const answer = place.answers.a;
    const field =
      answer?.document && answer.entry
        ? optionalFigureAt(answer.document, answer.entry, ["result", "data", "fields", element, "field"])
        : null;
    return {
      kind: "fan",
      element,
      field,
      axis: typeof axis === "string" ? axis : null,
      a: place.a.engine,
      b: place.b.engine,
      series: [one, two],
      differences,
      metric,
      band,
      sorting,
    };
  });
}

/** The spherical-aberration profile of both answers against the spec's zones, read from the request in the store. */
function profileChart(place: PairPlace, rung: string, sortings: readonly ElementSorting[]): PairChartView | null {
  const answer = place.answers.a;
  const zones = specOf(answer?.entry)?.profile;
  if (answer?.document == null || answer.entry == null || !Array.isArray(zones)) return null;
  const metric = "profile.maxAbs";
  const zoneOf = (index: number): Keyed => ({
    key: "profile",
    value: figureAt(answer.document!, answer.entry!, ["request", "spec", "profile", index]),
  });
  const banded = sortings[0]?.banded === true;
  const series: PairSeries[] = (["a", "b"] as const).map((side) => ({
    engine: place[side].engine,
    group: null,
    points: zones.flatMap((_zone, index) => {
      const y = recordedFigure(place, side, "profileMm", index);
      return y === null ? [] : [{ element: index, x: zoneOf(index), y }];
    }),
  }));
  const points = banded
    ? zones.flatMap((_zone, index) => {
        const difference = differenceOf(
          place.a.engine,
          place.b.engine,
          recordedFigure(place, "a", "profileMm", index),
          recordedFigure(place, "b", "profileMm", index),
        );
        return difference === null ? [] : [{ element: index, x: zoneOf(index), difference }];
      })
    : [];
  return {
    kind: "points",
    values: ["profileMm"],
    axis: "profile",
    a: place.a.engine,
    b: place.b.engine,
    series,
    differences: [{ group: null, points }],
    metric,
    band: bandOf(place, rung, metric),
    setAside: setAsideOf(place, sortings, null, [0]),
  };
}

/**
 * The details of one recorded comparison of a quantity other than `mtf.native`: its charts, or its table, by the
 * quantity and the kind of its request (the spec of the first engine's answer in the store).
 */
export function pairDetails(place: PairPlace, rung: string, quantity: string): PairDetail[] {
  const recordedA = recordedOf(place, "a");
  const recordedB = recordedOf(place, "b");
  const sortings = elementSortings(quantity, rung, recordedA, recordedB, place.policy);
  const spec = specOf(place.answers.a?.entry ?? place.answers.b?.entry);
  const kind = typeof spec?.kind === "string" ? spec.kind : null;
  const chart = (options: Parameters<typeof pointsChart>[3]): PairChartView =>
    pointsChart(place, rung, sortings, options);
  switch (quantity) {
    case SPOT_NATIVE: {
      const pattern = (spec?.pupil as { kind?: unknown } | undefined)?.kind;
      if (pattern === "fan" || Object.hasOwn(recordedA, "fanErrorMm")) return fanCharts(place, rung, sortings);
      return [
        chart({ values: ["rmsRadiusMm"], axis: "field", metric: "spotRmsRadius.maxAbs", byLine: false }),
        chart({
          values: ["centroidXMm", "centroidYMm"],
          components: ["x", "y"],
          axis: "field",
          metric: "spotCentroid.maxAbs",
          byLine: false,
        }),
      ];
    }
    case AXIAL_NATIVE: {
      const figures = [
        { name: "marginalInterceptZ", metric: kind === "colour" ? "lineFocus.maxAbs" : "marginalIntercept.maxAbs" },
        { name: "nearAxisInterceptZ", metric: "nearAxisIntercept.maxAbs" },
        { name: "bestFocusZ", metric: "bestFocus.maxAbs" },
        { name: "bestFocusRmsMm", metric: "bestFocusRms.maxAbs" },
        { name: "paraxialFocusZ", metric: null },
      ];
      if (kind === "colour" || !Object.hasOwn(recordedA, "profileMm")) {
        return [
          chart({ values: ["marginalInterceptZ"], axis: "wavelengthNm", metric: "lineFocus.maxAbs", byLine: false }),
          valuesTable(place, rung, sortings, figures),
        ];
      }
      const profile = profileChart(place, rung, sortings);
      return [...(profile === null ? [] : [profile]), valuesTable(place, rung, sortings, figures)];
    }
    case CHIEF_NATIVE:
      if (kind === "distortion" || Object.hasOwn(recordedA, "percent")) {
        return [
          chart({ values: ["percent"], axis: "fieldAngleDeg", metric: "distortionPercent.maxAbs", byLine: false }),
          chart({ values: ["realHeightMm"], axis: "fieldAngleDeg", metric: "realHeight.maxAbs", byLine: false }),
        ];
      }
      if (kind === "pupils" || Object.hasOwn(recordedA, "entrancePupilZ")) {
        return [
          chart({ values: ["entrancePupilZ"], axis: "fieldAngleDeg", metric: "entrancePupil.maxAbs", byLine: false }),
          chart({ values: ["exitPupilZ"], axis: "fieldAngleDeg", metric: "exitPupil.maxAbs", byLine: false }),
        ];
      }
      return [chart({ values: ["chiefLandingMm"], axis: "fieldAngleDeg", metric: null, byLine: true })];
    case CURVATURE_NATIVE:
      return [
        chart({ values: ["tangentialShiftMm"], axis: "fieldAngleDeg", metric: "tangentialShift.maxAbs", byLine: true }),
        chart({ values: ["sagittalShiftMm"], axis: "fieldAngleDeg", metric: "sagittalShift.maxAbs", byLine: true }),
      ];
    case VIGNETTING_NATIVE:
      return [
        chart({
          values: ["geometricTransmission"],
          axis: "fieldAngleDeg",
          metric: "geometricTransmission.maxAbs",
          byLine: true,
        }),
        chart({
          values: ["relativeIllumination"],
          axis: "fieldAngleDeg",
          metric: "relativeIllumination.maxAbs",
          byLine: true,
        }),
      ];
    case SUMMARY_NATIVE: {
      const metricOf = (name: string): string | null =>
        name === "rearFocalZ"
          ? REAR_FOCUS_METRIC
          : (SUMMARY_FIGURES.find((figure) => figure.value === name)?.name ?? null);
      return [
        valuesTable(
          place,
          rung,
          sortings,
          SUMMARY_VALUES.map((name) => ({ name, metric: metricOf(name) })),
        ),
      ];
    }
    default:
      return [];
  }
}
