// The "LV vs optiland" pages of the dashboard (Stage 8.5): a lens at a time, in one condition chosen by chips, a card
// for each of LensVisualizer's tabs (the rows of the validation matrix that have a tab), and a page of each card's
// details. A card has two kinds of line, kept apart:
//
// - the identical rays of the tab (its gated rungs): the pairs of the run directories' comparisons of the condition's
//   case, or else of the baselines' records of that case, each pair's verdict, and the largest of one metric of the
//   rung against its gate;
// - the tab beside its counterpart (its recorded rungs, the pairs of LensVisualizer and optiland, optiland-wave or
//   flux): the comparison's verdict, its figures against the attention bands of the policy at hand ("no attention
//   band" where it gives none), and how many fields the comparison sorted into each class.
//
// Pure functions of the documents they are handed, as the other views are: every number read from a file is a Figure
// with its pointer, every number computed a Derived, every count under a key of `COUNT_KEYS`. A condition is a case:
// the chips are the facts of the lens's cases (zoom and focus positions, stop, image plane, lines), and a run of
// another directory with the same case is of the same condition.
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { gravestVerdict } from "../contract/baseline.ts";
import type { Baseline } from "../contract/baseline.ts";
import type { ComparisonSet, Verdict } from "../contract/comparison.ts";
import type { Policy } from "../contract/policy.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { RUNGS } from "../core/rungs.ts";
import { DASHBOARD_TEXT, MATRIX_ROWS } from "../report/wording.ts";
import { answerOf, samePair } from "./chartViews.ts";
import type { Answer, MtfDifferenceView, MtfOverlayView, SectionCharts, StoreReader } from "./chartViews.ts";
import { pairDetails } from "./compareCharts.ts";
import type { PairDetail } from "./compareCharts.ts";
import { caseDocument, figureAt, optionalFigureAt } from "./figure.ts";
import type { DocumentName, Figure } from "./figure.ts";
import type { LensRunRef } from "./lens.ts";
import type { CaseSummary, Loaded } from "./sources.ts";

const TEXT = DASHBOARD_TEXT.compare;

/** The engines a recorded rung sets beside LensVisualizer's own analysis: its counterparts. */
export const COUNTERPARTS: readonly string[] = Object.freeze(["optiland", "optiland-wave", "flux"]);
/** LensVisualizer's engine. */
export const LV_ENGINE = "lv";

/** The parameters of a compare page's address: one for each facet of a condition. */
export const CONDITION_FACETS = ["position", "stop", "plane", "lines"] as const;
/** A facet of a condition. */
export type ConditionFacet = (typeof CONDITION_FACETS)[number];

/** The metric of a gated rung a card's line names: the one of the rung's metrics that says most of the tab's rays. */
export const GATED_HEADLINES: Readonly<Record<string, string>> = Object.freeze({
  r0: "sag.maxScaled",
  r1: "firstOrder.maxAbs",
  r2: "hits.maxDistance",
  r3: "opticalPath.maxAbs",
  r4: "mtf.maxAbs",
  r4f: "mtf.maxAbs",
  r6a: "waveMtf.maxAbs",
  r7a: "transverseError.maxAbs",
  r8a: "intercept.maxScaled",
  r9a: "landing.maxAbs",
  r10a: "tangentialFocus.maxScaled",
  r11a: "illumination.maxAbs",
});

/** The metrics of a recorded rung that are limits of its sorting (an element beyond one is `data`), not bands. */
export const SORTING_METRICS: readonly string[] = Object.freeze([
  "chiefLanding.maxAbs",
  "landing.maxAbs",
  "pupilRadius.relative",
  "rearFocus.maxAbs",
]);

/** Whether a recorded metric counts elements: how many fields or lines the comparison sorted into a class. */
function isCount(name: string): boolean {
  return name.startsWith("fields.") || name.startsWith("lines.") || name.startsWith("fanSamples.");
}

/** A card of the page: a tab of LensVisualizer, its gated rungs and its recorded rungs that have a counterpart. */
export interface CompareTab {
  readonly tab: string;
  readonly title: string;
  readonly gated: readonly string[];
  readonly recorded: readonly string[];
}

/** Whether a recorded rung sets LensVisualizer beside a counterpart: its own engines name one. */
function hasCounterpart(rung: string): boolean {
  const engines = RUNGS.find((each) => each.id === rung)?.engines ?? [];
  return engines.includes(LV_ENGINE) && engines.some((engine) => COUNTERPARTS.includes(engine));
}

/** The cards, in the order of the validation matrix's rows, without the row of analyses LensVisualizer has no tab of. */
export const COMPARE_TABS: readonly CompareTab[] = Object.freeze(
  MATRIX_ROWS.filter((row) => row.tab !== "no-tab").map((row) => ({
    tab: row.tab,
    title: row.title,
    gated: [...row.gated],
    recorded: row.recorded.filter(hasCounterpart),
  })),
);

/** Whether a pair is of LensVisualizer and a counterpart. */
function counterpartPair(a: string, b: string): boolean {
  return (a === LV_ENGINE && COUNTERPARTS.includes(b)) || (b === LV_ENGINE && COUNTERPARTS.includes(a));
}

// ── Inputs ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** A run directory as the compare pages read it: its manifest and comparisons, indexed by case and by section. */
export interface CompareDirectory {
  readonly suite: string;
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile | null;
  /** The places of the comparison sets of each case. */
  readonly setsOfCase: ReadonlyMap<string, readonly number[]>;
  /** The section of the run directory a set is in (`sectionSetGroups`): its page's number. */
  readonly sectionOfSet: ReadonlyMap<number, number>;
}

/** A baseline as the compare pages read it: the places of its runs of each case. */
export interface CompareBaseline {
  readonly stem: string;
  readonly baseline: Baseline;
  readonly runsOfCase: ReadonlyMap<string, readonly number[]>;
}

/** A run of the lens with its case. */
export interface CompareRun {
  readonly ref: LensRunRef;
  readonly caseSummary: Loaded<CaseSummary>;
}

/** What a compare page is built from. */
export interface CompareInputs {
  readonly key: string;
  readonly runs: readonly CompareRun[];
  /** The run directories of the lens's runs, by name; null for one that cannot be read. */
  readonly directory: (suite: string) => CompareDirectory | null;
  readonly baselines: readonly CompareBaseline[];
  readonly policy: { readonly document: DocumentName; readonly policy: Policy } | null;
  readonly stored: StoreReader;
  /** The address's query, without `?`. */
  readonly query: string;
  /** The charts of a section of a run directory (Stage 8.2), for an MTF card's details. */
  readonly sectionCharts?: (suite: string, section: number) => SectionCharts | null;
}

/** Sets by case and sections by set, for a run directory: what `CompareDirectory` holds, computed once per file. */
export function indexComparisons(
  file: ComparisonFile,
  groups: readonly (readonly number[])[],
): {
  readonly setsOfCase: ReadonlyMap<string, readonly number[]>;
  readonly sectionOfSet: ReadonlyMap<number, number>;
} {
  const setsOfCase = new Map<string, number[]>();
  file.comparisons.forEach((set, index) => setsOfCase.set(set.caseId, [...(setsOfCase.get(set.caseId) ?? []), index]));
  const sectionOfSet = new Map<number, number>();
  groups.forEach((group, section) => group.forEach((set) => sectionOfSet.set(set, section)));
  return { setsOfCase, sectionOfSet };
}

/** The places of a baseline's runs of each case. */
export function indexBaseline(baseline: Baseline): ReadonlyMap<string, readonly number[]> {
  const runs = new Map<string, number[]>();
  baseline.runs.forEach((run, place) => {
    if (run.caseId !== null) runs.set(run.caseId, [...(runs.get(run.caseId) ?? []), place]);
  });
  return runs;
}

// ── Conditions ───────────────────────────────────────────────────────────────────────────────────────────────────

/** What a chip of a facet says: the case's own figures, or the recipe's kind of plane. */
export type ConditionLabel =
  | { readonly facet: "position"; readonly zoomT: Figure | null; readonly focusT: Figure | null }
  | { readonly facet: "stop"; readonly stopSemiDiameterMm: Figure }
  | { readonly facet: "plane"; readonly plane: string | null; readonly imageZ: Figure | null }
  | { readonly facet: "lines"; readonly lines: readonly { readonly wavelengthNm: Figure }[] };

/** A chip: a value of a facet, whether it is chosen, and the query that chooses it. */
export interface ConditionOption {
  readonly id: string;
  readonly chosen: boolean;
  /** Whether a case of this value (among those the facets before it leave) has a comparison beside a counterpart. */
  readonly compared: boolean;
  readonly query: string;
  readonly label: ConditionLabel;
}

/** A facet of the conditions of the lens: its values among the cases the facets before it leave. */
export interface ConditionFacetView {
  readonly facet: ConditionFacet;
  readonly options: readonly ConditionOption[];
}

/** A case of the lens, with what its runs and the manifests say of it. */
interface LensCase {
  readonly caseId: string;
  readonly refs: readonly LensRunRef[];
  readonly summary: CaseSummary;
  readonly document: DocumentName;
  /** The kind of image plane of the MTF recipe of a run of the case (`design`, `lv-best-axial`); null for none. */
  readonly plane: string | null;
}

/** The cases of the lens's runs, in the order of their first runs; runs whose case cannot be read are left out. */
function casesOf(runs: readonly CompareRun[], directory: CompareInputs["directory"]): LensCase[] {
  const cases = new Map<
    string,
    { refs: LensRunRef[]; summary: CaseSummary; document: DocumentName; plane: string | null }
  >();
  for (const { ref, caseSummary } of runs) {
    if (caseSummary.state !== "ok") continue;
    const recipe = directory(ref.suite)?.manifest.runs[ref.place]?.recipe?.recipe as
      { plane?: { kind?: unknown } } | null | undefined;
    const kind = typeof recipe?.plane?.kind === "string" ? recipe.plane.kind : null;
    const known = cases.get(ref.caseId);
    if (known === undefined) {
      cases.set(ref.caseId, {
        refs: [ref],
        summary: caseSummary.value,
        document: caseDocument(ref.suite, ref.caseId),
        plane: kind,
      });
    } else {
      known.refs.push(ref);
      if (known.plane === null) known.plane = kind;
    }
  }
  return [...cases].map(([caseId, each]) => ({ caseId, ...each }));
}

/** The value of a facet of a case, as a chip names it. */
function facetId(facet: ConditionFacet, lensCase: LensCase): string {
  const { label, conditions } = lensCase.summary;
  switch (facet) {
    case "position":
      return `${label.zoomT === undefined ? "-" : String(label.zoomT)}/${label.focusT === undefined ? "-" : String(label.focusT)}`;
    case "stop":
      return String(conditions.stopSemiDiameter);
    case "plane":
      return lensCase.plane ?? `z:${String(conditions.imageZ)}`;
    case "lines":
      return conditions.lines.map((line) => String(line.wavelengthNm)).join("+");
  }
}

/** The order of a facet's values: positions and planes ascending, the largest stop first, the fewest lines first. */
function facetOrder(facet: ConditionFacet, one: LensCase, two: LensCase): number {
  const [a, b] = [one.summary, two.summary];
  switch (facet) {
    case "position":
      return (a.label.zoomT ?? -1) - (b.label.zoomT ?? -1) || (a.label.focusT ?? -1) - (b.label.focusT ?? -1);
    case "stop":
      return b.conditions.stopSemiDiameter - a.conditions.stopSemiDiameter;
    case "plane": {
      const rank = (lensCase: LensCase): number =>
        lensCase.plane === "design" ? 0 : lensCase.plane === "lv-best-axial" ? 1 : lensCase.plane === null ? 3 : 2;
      const [ra, rb] = [rank(one), rank(two)];
      if (ra !== rb) return ra - rb;
      if (one.plane !== null && two.plane !== null) return one.plane < two.plane ? -1 : one.plane > two.plane ? 1 : 0;
      return a.conditions.imageZ - b.conditions.imageZ;
    }
    case "lines": {
      const [ia, ib] = [facetId("lines", one), facetId("lines", two)];
      return a.conditions.lines.length - b.conditions.lines.length || (ia < ib ? -1 : ia > ib ? 1 : 0);
    }
  }
}

/** A chip's label: the figures of the case it is the value of. */
function labelOf(facet: ConditionFacet, lensCase: LensCase): ConditionLabel {
  const { document, summary } = lensCase;
  switch (facet) {
    case "position":
      return {
        facet,
        zoomT: optionalFigureAt(document, summary, ["label", "zoomT"]),
        focusT: optionalFigureAt(document, summary, ["label", "focusT"]),
      };
    case "stop":
      return { facet, stopSemiDiameterMm: figureAt(document, summary, ["conditions", "stopSemiDiameter"]) };
    case "plane":
      return {
        facet,
        plane: lensCase.plane,
        imageZ: lensCase.plane === null ? figureAt(document, summary, ["conditions", "imageZ"]) : null,
      };
    case "lines":
      return {
        facet,
        lines: summary.conditions.lines.map((_line, index) => ({
          wavelengthNm: figureAt(document, summary, ["conditions", "lines", index, "wavelengthNm"]),
        })),
      };
  }
}

/** The chosen condition: the chips of each facet, the cases it leaves, and what the address asked that is not there. */
interface Resolved {
  readonly facets: readonly ConditionFacetView[];
  readonly cases: readonly LensCase[];
  readonly notes: readonly string[];
}

/**
 * Resolves the address's choice facet by facet, in the order of `CONDITION_FACETS`: each facet's values are those of
 * the cases the facets before it leave, and a value asked that is none of them gives way to the first, with a note.
 * Where nothing is asked of a facet, its first value of a case `compared` holds (a case with a comparison beside a
 * counterpart) is chosen, else its first value: a case of an older run directory alone is listed but not chosen.
 */
function resolveCondition(
  cases: readonly LensCase[],
  query: string,
  compared: (lensCase: LensCase) => boolean,
): Resolved {
  const params = new URLSearchParams(query);
  const notes: string[] = [];
  const unknown = [...new Set(params.keys())].filter((name) => !(CONDITION_FACETS as readonly string[]).includes(name));
  if (unknown.length > 0) notes.push(TEXT.unknownParameters(unknown.join(", ")));
  const chosen = new Map<ConditionFacet, string>();
  const views: { facet: ConditionFacet; options: { id: string; first: LensCase; compared: boolean }[] }[] = [];
  let left = [...cases];
  for (const facet of CONDITION_FACETS) {
    const ordered = [...left].sort((one, two) => facetOrder(facet, one, two));
    const options: { id: string; first: LensCase; compared: boolean }[] = [];
    for (const lensCase of ordered) {
      const id = facetId(facet, lensCase);
      const known = options.find((option) => option.id === id);
      if (known === undefined) options.push({ id, first: lensCase, compared: compared(lensCase) });
      else if (!known.compared && compared(lensCase)) known.compared = true;
    }
    if (options.length === 0) break;
    const asked = params.get(facet);
    const fallback = (options.find((option) => option.compared) ?? options[0]).id;
    const value = asked !== null && options.some((option) => option.id === asked) ? asked : fallback;
    if (asked !== null && asked !== value) notes.push(TEXT.conditionGaveWay(facet, asked));
    chosen.set(facet, value);
    views.push({ facet, options });
    left = left.filter((lensCase) => facetId(facet, lensCase) === value);
  }
  const queryWith = (facet: ConditionFacet, id: string): string => {
    const next = new URLSearchParams();
    for (const each of CONDITION_FACETS) {
      const value = each === facet ? id : chosen.get(each);
      if (value !== undefined) next.append(each, value);
    }
    return next.toString();
  };
  return {
    facets: views.map(({ facet, options }) => ({
      facet,
      options: options.map(({ id, first, compared: withCounterpart }) => ({
        id,
        chosen: chosen.get(facet) === id,
        compared: withCounterpart,
        query: queryWith(facet, id),
        label: labelOf(facet, first),
      })),
    })),
    cases: left,
    notes,
  };
}

// ── Cards ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A verdict and how many requests (or baseline records' requests) came to it. */
export interface VerdictCountView {
  readonly verdict: Verdict;
  readonly count: number;
}

/** A pair of a gated rung: its gravest verdict, and its requests by verdict. */
export interface GatedPair {
  readonly a: string;
  readonly b: string;
  readonly verdict: Verdict;
  readonly verdicts: readonly VerdictCountView[];
}

/** Where a line of a card is read: the lens's run directories, or the baselines' records of the case. */
export type LineSource =
  | { readonly kind: "runs"; readonly suites: readonly string[] }
  | { readonly kind: "baselines"; readonly stems: readonly string[] }
  | { readonly kind: "none" };

/** The identical rays of a tab in one gated rung. */
export interface GatedLine {
  readonly rung: string;
  readonly source: LineSource;
  readonly pairs: readonly GatedPair[];
  /** The rung's headline metric where no pair of the line measured it; null where one did, or there are no pairs. */
  readonly unmeasured: string | null;
  /** The largest value of the rung's headline metric over its pairs, the pair it is of, and the gate at hand. */
  readonly headline: {
    readonly metric: string;
    readonly a: string;
    readonly b: string;
    readonly value: Figure;
    readonly gate: Figure | null;
  } | null;
}

/** A figure of a recorded pair: its value, and the band (or, for a limit of the sorting, the limit) at hand. */
export interface RecordedMetricView {
  readonly name: string;
  readonly unit: string;
  readonly value: Figure;
  /** The attention band the policy at hand gives the metric; null where it gives none. */
  readonly band: Figure | null;
  /** For a limit of the sorting (`SORTING_METRICS`): the limit at hand; null otherwise. */
  readonly limit: Figure | null;
}

/** Where a recorded line was read. */
export type RecordedSource =
  | { readonly kind: "run"; readonly suite: string; readonly run: string; readonly section: number | null }
  | { readonly kind: "baseline"; readonly stem: string; readonly run: string };

/** A recorded comparison of LensVisualizer's own analysis beside its counterpart's. */
export interface RecordedLine {
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string | null;
  /** What the request asks, from its spec (`diffraction`, `fan tangential`, `spherical`, ...); null where unsaid. */
  readonly label: string | null;
  readonly source: RecordedSource;
  /** LensVisualizer, then its counterpart. */
  readonly a: string;
  readonly b: string;
  readonly verdict: Verdict;
  readonly metrics: readonly RecordedMetricView[];
  /** How many fields or lines the comparison sorted into each class, as it records them. */
  readonly counts: readonly { readonly name: string; readonly value: Figure }[];
  readonly reason: string | null;
  /** Other run directories that compare the same request of the same case. */
  readonly alsoIn: readonly string[];
  /** The details of the comparison (a tab's page only); null on the cards' page. */
  readonly detail: RecordedDetail | null;
}

/** The details of a recorded comparison: an MTF section's charts of the pair, or the charts of its recorded values. */
export interface RecordedDetail {
  readonly overlays: readonly MtfOverlayView[];
  readonly differences: readonly MtfDifferenceView[];
  readonly charts: readonly PairDetail[];
  readonly problems: readonly string[];
}

/** A card: a tab's identical rays and its recorded comparisons in the chosen condition. */
export interface CompareCard {
  readonly tab: string;
  readonly title: string;
  readonly gated: readonly GatedLine[];
  readonly recorded: readonly RecordedLine[];
  /** The recorded rungs of the tab with no comparison of LensVisualizer and a counterpart in this condition. */
  readonly notCompared: readonly string[];
  /** The gravest verdict of the gated lines' pairs, and of the recorded lines; null where there is none. */
  readonly gatedVerdict: Verdict | null;
  readonly recordedVerdict: Verdict | null;
}

/** One pair of a set, with where it is. */
interface FoundPair {
  readonly suite: string;
  readonly set: number;
  readonly pair: number;
  readonly comparison: ComparisonSet;
}

/**
 * The pairs of the chosen cases' sets of a rung in a run directory, each request's pair once (of either mode, and of
 * any run of the same case: the same request is the same question). `seen` carries the requests' pairs already taken
 * from other directories, so that a request compared in two run directories counts once.
 */
function pairsIn(
  directory: CompareDirectory,
  caseIds: readonly string[],
  rung: string,
  seen: Set<string> = new Set(),
): FoundPair[] {
  if (directory.comparisons === null) return [];
  const found: FoundPair[] = [];
  for (const caseId of caseIds) {
    for (const set of directory.setsOfCase.get(caseId) ?? []) {
      const comparison = directory.comparisons.comparisons[set];
      if (comparison.rung !== rung) continue;
      comparison.pairs.forEach((pair, index) => {
        const [x, y] = [pair.a, pair.b].sort();
        const key = JSON.stringify([comparison.requestId, x, y]);
        if (seen.has(key)) return;
        seen.add(key);
        found.push({ suite: directory.suite, set, pair: index, comparison });
      });
    }
  }
  return found;
}

/** The verdicts of a list, counted, in the order of the gravity of the first met. */
function countVerdicts(verdicts: readonly { readonly verdict: Verdict; readonly count: number }[]): VerdictCountView[] {
  const out: { verdict: Verdict; count: number }[] = [];
  for (const { verdict, count } of verdicts) {
    const known = out.find((each) => each.verdict === verdict);
    if (known === undefined) out.push({ verdict, count });
    else known.count += count;
  }
  return out;
}

/** The largest of figures by value, the first of equal ones; a figure of no finite number only where none has one. */
function largest<T extends { readonly value: Figure }>(items: readonly T[]): T | null {
  let found: T | null = null;
  for (const item of items) {
    if (found === null) found = item;
    else if (item.value.value !== null && (found.value.value === null || item.value.value > found.value.value)) {
      found = item;
    }
  }
  return found;
}

/** The gate of a metric of a rung in the policy at hand. */
function gateOf(inputs: CompareInputs, rung: string, metric: string): Figure | null {
  if (inputs.policy === null) return null;
  return optionalFigureAt(inputs.policy.document, inputs.policy.policy, [
    "rungs",
    rung,
    "metrics",
    metric,
    "tolerance",
  ]);
}

/** A gated line from the run directories' comparisons of the cases, else from the baselines' records of them. */
function gatedLine(
  inputs: CompareInputs,
  suites: readonly string[],
  caseIds: readonly string[],
  rung: string,
): GatedLine {
  const metric = GATED_HEADLINES[rung] ?? null;
  const byPair = new Map<string, { a: string; b: string; verdicts: { verdict: Verdict; count: number }[] }>();
  const candidates: { a: string; b: string; value: Figure }[] = [];
  const add = (a: string, b: string, verdicts: readonly { verdict: Verdict; count: number }[]): void => {
    const key = JSON.stringify([a, b]);
    const known = byPair.get(key) ?? { a, b, verdicts: [] };
    known.verdicts.push(...verdicts);
    byPair.set(key, known);
  };
  const fromRuns: string[] = [];
  const seen = new Set<string>();
  for (const suite of suites) {
    const directory = inputs.directory(suite);
    if (directory === null) continue;
    const found = pairsIn(directory, caseIds, rung, seen);
    if (found.length > 0) fromRuns.push(suite);
    for (const { set, pair, comparison } of found) {
      const { a, b, verdict, metrics } = comparison.pairs[pair];
      const [x, y] = [a, b].sort();
      add(x, y, [{ verdict, count: 1 }]);
      const at = metrics.findIndex((each) => each.name === metric);
      if (at >= 0) {
        const tokens = ["comparisons", set, "pairs", pair, "metrics", at, "value"];
        candidates.push({ a: x, b: y, value: figureAt(`comparisons:${suite}`, directory.comparisons, tokens) });
      }
    }
  }
  let source: LineSource = fromRuns.length > 0 ? { kind: "runs", suites: fromRuns } : { kind: "none" };
  if (fromRuns.length === 0) {
    const stems: string[] = [];
    for (const { stem, baseline, runsOfCase } of inputs.baselines) {
      for (const caseId of caseIds) {
        for (const place of runsOfCase.get(caseId) ?? []) {
          const rungAt = baseline.runs[place].rungs.findIndex((each) => each.rung === rung);
          if (rungAt < 0) continue;
          if (!stems.includes(stem)) stems.push(stem);
          baseline.runs[place].rungs[rungAt].pairs.forEach((record, pairAt) => {
            add(record.a, record.b, record.verdicts);
            const at = record.metrics.findIndex((each) => each.name === metric);
            if (at < 0) return;
            const tokens = ["runs", place, "rungs", rungAt, "pairs", pairAt, "metrics", at, "value"];
            candidates.push({ a: record.a, b: record.b, value: figureAt(`baseline:${stem}`, baseline, tokens) });
          });
        }
      }
    }
    if (stems.length > 0) source = { kind: "baselines", stems };
  }
  const pairs = [...byPair.values()]
    .sort((one, two) => (one.a !== two.a ? (one.a < two.a ? -1 : 1) : one.b < two.b ? -1 : one.b > two.b ? 1 : 0))
    .map(({ a, b, verdicts }) => ({
      a,
      b,
      verdict: gravestVerdict(verdicts.map((each) => each.verdict)) ?? "UNSUPPORTED",
      verdicts: countVerdicts(verdicts),
    }));
  const top = largest(candidates);
  return {
    rung,
    source,
    pairs,
    unmeasured: top === null && pairs.length > 0 ? metric : null,
    headline:
      top === null || metric === null
        ? null
        : { metric, a: top.a, b: top.b, value: top.value, gate: gateOf(inputs, rung, metric) },
  };
}

/** The label of a request, from the spec of its first answer in the store. */
function labelOfSpec(quantity: string, spec: Record<string, unknown> | undefined): string | null {
  if (spec === undefined) return null;
  if (quantity === MTF_NATIVE) {
    const fields = spec.fields as { values?: unknown } | undefined;
    const values = Array.isArray(fields?.values) ? fields.values.map(String).join(", ") : "";
    return typeof spec.method === "string" ? TEXT.labelMtf(spec.method, values) : null;
  }
  const pupil = spec.pupil as { kind?: unknown; axis?: unknown } | undefined;
  if (pupil?.kind === "fan") return TEXT.labelFan(String(pupil.axis));
  if (pupil?.kind === "rings") return TEXT.labelRings;
  return typeof spec.kind === "string" ? spec.kind : null;
}

/** The first job (no step) of an engine for a request of a run. */
function firstJob(manifest: RunManifest, run: string, rung: string, requestId: string, engine: string) {
  return manifest.jobs.find(
    (job: ManifestJob) =>
      job.run === run && job.rung === rung && job.requestId === requestId && job.engine === engine && !job.step,
  );
}

/** The metric views of a recorded pair: its figures with the policy's bands, and its counts. */
function metricViews(
  inputs: CompareInputs,
  rung: string,
  document: DocumentName,
  root: unknown,
  base: readonly (string | number)[],
  metrics: readonly { readonly name: string; readonly unit: string }[],
): Pick<RecordedLine, "metrics" | "counts"> {
  const out: RecordedMetricView[] = [];
  const counts: { name: string; value: Figure }[] = [];
  metrics.forEach(({ name, unit }, index) => {
    const value = figureAt(document, root, [...base, index, "value"]);
    if (isCount(name)) {
      counts.push({ name, value });
      return;
    }
    const attention =
      inputs.policy === null
        ? null
        : optionalFigureAt(inputs.policy.document, inputs.policy.policy, ["rungs", rung, "metrics", name, "attention"]);
    const sorting = SORTING_METRICS.includes(name);
    out.push({ name, unit, value, band: sorting ? null : attention, limit: sorting ? attention : null });
  });
  return { metrics: out, counts };
}

/** The lens's own run directories first (the profiles' `mtf-<key>`, `tabs-<key>`), then the others, each sorted. */
function directoryOrder(key: string, suites: readonly string[]): string[] {
  const own = (suite: string): boolean => suite === `mtf-${key}` || suite === `tabs-${key}`;
  return [...suites.filter(own).sort(), ...suites.filter((suite) => !own(suite)).sort()];
}

/** The recorded lines of a rung: each request's pair of LensVisualizer and a counterpart, once. */
function recordedLines(
  inputs: CompareInputs,
  suites: readonly string[],
  caseIds: readonly string[],
  rung: string,
  details: boolean,
): RecordedLine[] {
  const lines: RecordedLine[] = [];
  const keys: string[] = [];
  const also = new Map<string, string[]>();
  for (const suite of suites) {
    const directory = inputs.directory(suite);
    if (directory === null || directory.comparisons === null) continue;
    for (const { set, pair, comparison } of pairsIn(directory, caseIds, rung)) {
      const record = comparison.pairs[pair];
      if (!counterpartPair(record.a, record.b)) continue;
      const [a, b] = record.a === LV_ENGINE ? [record.a, record.b] : [record.b, record.a];
      const key = JSON.stringify([comparison.requestId, a, b]);
      if (keys.includes(key)) {
        const others = also.get(key) ?? [];
        if (!others.includes(suite)) also.set(key, [...others, suite]);
        continue;
      }
      keys.push(key);
      const document: DocumentName = `comparisons:${suite}`;
      const answerFor = (engine: string): Answer | null => {
        const job = firstJob(directory.manifest, comparison.run, rung, comparison.requestId, engine);
        return job === undefined ? null : answerOf(job, inputs.stored);
      };
      const lvAnswer = answerFor(a);
      const label = labelOfSpec(comparison.quantity, lvAnswer?.entry?.request.spec as Record<string, unknown>);
      const section = directory.sectionOfSet.get(set) ?? null;
      lines.push({
        rung,
        quantity: comparison.quantity,
        requestId: comparison.requestId,
        label,
        source: { kind: "run", suite, run: comparison.run, section },
        a,
        b,
        verdict: record.verdict,
        ...metricViews(
          inputs,
          rung,
          document,
          directory.comparisons,
          ["comparisons", set, "pairs", pair, "metrics"],
          record.metrics,
        ),
        reason: record.reason ?? null,
        alsoIn: [],
        detail: details ? detailOf(inputs, suite, directory, set, a, b, section, lvAnswer, answerFor(b)) : null,
      });
    }
  }
  if (lines.length > 0) {
    return lines.map((line, index) => ({ ...line, alsoIn: also.get(keys[index]) ?? [] }));
  }
  // None in the run directories: the baselines' records of the cases (an MTF baseline holds R5, R5g and R6c).
  for (const { stem, baseline, runsOfCase } of inputs.baselines) {
    for (const caseId of caseIds) {
      for (const place of runsOfCase.get(caseId) ?? []) {
        const run = baseline.runs[place];
        const rungAt = run.rungs.findIndex((each) => each.rung === rung);
        if (rungAt < 0) continue;
        run.rungs[rungAt].pairs.forEach((record, pairAt) => {
          if (!counterpartPair(record.a, record.b)) return;
          const [a, b] = record.a === LV_ENGINE ? [record.a, record.b] : [record.b, record.a];
          lines.push({
            rung,
            quantity: run.rungs[rungAt].quantity,
            requestId: null,
            label: null,
            source: { kind: "baseline", stem, run: run.name },
            a,
            b,
            verdict: record.verdict,
            ...metricViews(
              inputs,
              rung,
              `baseline:${stem}`,
              baseline,
              ["runs", place, "rungs", rungAt, "pairs", pairAt, "metrics"],
              record.metrics,
            ),
            reason: null,
            alsoIn: [],
            detail: null,
          });
        });
      }
    }
  }
  return lines;
}

/** The details of a recorded comparison of a run directory: the MTF section's charts of the pair, or its values'. */
function detailOf(
  inputs: CompareInputs,
  suite: string,
  directory: CompareDirectory,
  set: number,
  a: string,
  b: string,
  section: number | null,
  answerA: Answer | null,
  answerB: Answer | null,
): RecordedDetail {
  const comparisons = directory.comparisons!;
  const comparison = comparisons.comparisons[set];
  const problems = [answerA, answerB].flatMap((answer) =>
    answer !== null && answer.document !== null && answer.entry === null && answer.missing !== null
      ? [answer.missing]
      : [],
  );
  if (comparison.quantity === MTF_NATIVE) {
    const charts = section === null ? null : (inputs.sectionCharts?.(suite, section) ?? null);
    if (charts === null) return { overlays: [], differences: [], charts: [], problems: [TEXT.noSectionCharts] };
    const ours = (engine: string): boolean => engine === a || engine === b;
    return {
      overlays: charts.overlays.map((view) => ({
        ...view,
        series: view.series.filter((series) => ours(series.engine)),
        setAside: view.setAside.filter((aside) => samePair(aside, { a, b })),
      })),
      differences: charts.differences.map((view) => ({
        ...view,
        pairs: view.pairs.filter((pair) => samePair(pair, { a, b })),
      })),
      charts: [],
      problems: [...charts.problems],
    };
  }
  const participant = (engine: string): number => comparison.participants.findIndex((each) => each.engine === engine);
  const charts = pairDetails(
    {
      suite,
      comparisons,
      set,
      a: { engine: a, participant: participant(a) },
      b: { engine: b, participant: participant(b) },
      policyDocument: inputs.policy?.document ?? null,
      policy: inputs.policy?.policy ?? null,
      answers: { a: answerA, b: answerB },
    },
    comparison.rung,
    comparison.quantity,
  );
  return { overlays: [], differences: [], charts, problems };
}

/** The cards of the chosen cases, with each recorded comparison's details where `details` names the tab. */
function cardsOf(
  inputs: CompareInputs,
  suites: readonly string[],
  caseIds: readonly string[],
  details: string | null,
): CompareCard[] {
  return COMPARE_TABS.map((tab) => {
    const gated = tab.gated.map((rung) => gatedLine(inputs, suites, caseIds, rung));
    const recorded = tab.recorded.flatMap((rung) => recordedLines(inputs, suites, caseIds, rung, details === tab.tab));
    const notCompared = tab.recorded.filter((rung) => !recorded.some((line) => line.rung === rung));
    return {
      tab: tab.tab,
      title: tab.title,
      gated,
      recorded,
      notCompared,
      gatedVerdict: gravestVerdict(gated.flatMap((line) => line.pairs.map((pair) => pair.verdict))) ?? null,
      recordedVerdict: gravestVerdict(recorded.map((line) => line.verdict)) ?? null,
    };
  });
}

// ── The pages ────────────────────────────────────────────────────────────────────────────────────────────────────

/** A run of the chosen condition: its run directory, its name and its place there. */
export interface ConditionRun {
  readonly suite: string;
  readonly run: string;
  readonly place: number;
}

/** The view of a compare page, or of one tab's details (`tab` not null). */
export interface CompareView {
  readonly kind: "dashboard-compare";
  readonly key: string;
  readonly name: string | null;
  /** The tab whose details the page shows; null for the page of every card. */
  readonly tab: string | null;
  readonly facets: readonly ConditionFacetView[];
  /** The query of the chosen condition, every facet stated: what a card's link and a detail page's chips keep. */
  readonly query: string;
  /** The runs of the chosen condition's cases. */
  readonly runs: readonly ConditionRun[];
  /** How many cases the chosen condition is: one, unless two cases share every facet. */
  readonly count: number;
  readonly notes: readonly string[];
  readonly cards: readonly CompareCard[];
}

/** The query of a resolved condition, every facet stated. */
function chosenQuery(facets: readonly ConditionFacetView[]): string {
  const query = new URLSearchParams();
  for (const facet of facets) {
    const chosen = facet.options.find((option) => option.chosen);
    if (chosen !== undefined) query.append(facet.facet, chosen.id);
  }
  return query.toString();
}

/**
 * The view of a compare page: the chips of the lens's conditions, the runs of the chosen one, and a card for each
 * tab; with `tab`, only that tab's card, its recorded comparisons with their details.
 */
export function buildCompareView(inputs: CompareInputs, tab: string | null = null): CompareView {
  const cases = casesOf(inputs.runs, inputs.directory);
  const compared = (lensCase: LensCase): boolean =>
    hasCounterpartComparison({
      runs: inputs.runs.filter((run) => run.ref.caseId === lensCase.caseId),
      directory: inputs.directory,
    });
  const resolved = resolveCondition(cases, inputs.query, compared);
  const caseIds = resolved.cases.map((lensCase) => lensCase.caseId);
  const suites = directoryOrder(inputs.key, [...new Set(inputs.runs.map((run) => run.ref.suite))]);
  const cards = cardsOf(inputs, suites, caseIds, tab).filter((card) => tab === null || card.tab === tab);
  const first = inputs.runs.find((run) => run.caseSummary.state === "ok");
  const notes = [...resolved.notes];
  if (cases.length === 0) notes.push(TEXT.noCases);
  return {
    kind: "dashboard-compare",
    key: inputs.key,
    name: first !== undefined && first.caseSummary.state === "ok" ? first.caseSummary.value.label.name : null,
    tab,
    facets: resolved.facets,
    query: chosenQuery(resolved.facets),
    runs: resolved.cases.flatMap((lensCase) =>
      lensCase.refs.map((ref) => ({ suite: ref.suite, run: ref.run, place: ref.place })),
    ),
    count: resolved.cases.length,
    notes,
    cards,
  };
}

/** A lens on the index's "LV vs optiland" table: its cards' verdicts in its first condition. */
export interface CompareSummary {
  readonly key: string;
  readonly name: string | null;
  readonly cards: readonly {
    readonly tab: string;
    readonly gated: Verdict | null;
    readonly recorded: Verdict | null;
  }[];
}

/** Whether a lens has a recorded comparison of LensVisualizer and a counterpart in any run directory of its runs. */
export function hasCounterpartComparison(inputs: Pick<CompareInputs, "runs" | "directory">): boolean {
  const recorded = COMPARE_TABS.flatMap((tab) => tab.recorded);
  return inputs.runs.some(({ ref }) => {
    const directory = inputs.directory(ref.suite);
    if (directory === null || directory.comparisons === null) return false;
    return (directory.setsOfCase.get(ref.caseId) ?? []).some((set) => {
      const comparison = directory.comparisons!.comparisons[set];
      return (
        comparison.run === ref.run &&
        recorded.includes(comparison.rung) &&
        comparison.pairs.some((pair) => counterpartPair(pair.a, pair.b))
      );
    });
  });
}

/** The summary of a lens for the index: its cards' verdicts in its first condition (no store entry is read). */
export function compareSummary(inputs: CompareInputs): CompareSummary {
  const view = buildCompareView({ ...inputs, query: "", stored: () => ({ state: "missing" }) });
  return {
    key: view.key,
    name: view.name,
    cards: view.cards.map((card) => ({ tab: card.tab, gated: card.gatedVerdict, recorded: card.recordedVerdict })),
  };
}
