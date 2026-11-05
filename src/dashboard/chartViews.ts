// The view models of the dashboard's charts (Stage 8.2): pure functions of the documents they are handed, as the
// other views are. A number read from a file is a Figure or a Curve with its pointer: an MTF curve is the store
// entry's encoded array, decoded by the contract's codec, a value that is not a finite number a null (a gap, never
// 0). A number the dashboard computes is a Derived that names its derivation and its sources: a difference of two
// curves, the largest hit distance on a surface. Store entries are read only by the keys the manifest gives the jobs
// of the request at hand.
import { MTF_CUTS, OFF_AXIS_METRIC, ON_AXIS_METRIC } from "../compare/mtfNative.ts";
import type { MtfCut } from "../compare/mtfNative.ts";
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { decodeTrace, differentRays, okInBoth } from "../compare/raysRead.ts";
import type { DecodedTrace } from "../compare/raysRead.ts";
import { numberText } from "../compare/metricText.ts";
import { gravestVerdict } from "../contract/baseline.ts";
import type { Baseline } from "../contract/baseline.ts";
import { VERDICTS } from "../contract/comparison.ts";
import type { Verdict } from "../contract/comparison.ts";
import type { Policy } from "../contract/policy.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import { RAYS_TRACE } from "../contract/quantities/raysTrace.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { decodeNdArray, isNdArray } from "../core/numeric/ndarray.ts";
import type { StoreEntry } from "../core/resultStore.ts";
import { DASHBOARD_TEXT } from "../report/wording.ts";
import { figureAt, optionalFigureAt, pointerOf, resolvePointer } from "./figure.ts";
import type { Curve, Derived, DocumentName, Figure, Source } from "./figure.ts";
import type { Loaded } from "./sources.ts";

const TEXT = DASHBOARD_TEXT.charts;

/** How a view reads a store entry: by a key the manifest names, as `DashboardSources.storeEntry` does. */
export type StoreReader = (key: string) => Loaded<StoreEntry>;

/** The rung whose `rays.trace` requests have a per-surface deviation chart. */
export const DEVIATION_RUNG = "r2";
/** The metric of R2 the largest bar of a deviation chart is held to, and whose tolerance is its line. */
export const DEVIATION_METRIC = "hits.maxDistance";
/** The most runs a heat map draws a row for; a run directory or a baseline of more has none on its page. */
export const HEAT_MAP_ROWS = 150;

// ── The jobs and answers of a request ────────────────────────────────────────────────────────────────────────────

/** The jobs of one request of a run directory, by engine (sorted by id), each engine's first answer before its steps. */
export function requestJobs(manifest: RunManifest, run: string, rung: string, requestId: string): ManifestJob[] {
  const jobs = manifest.jobs.filter((job) => job.run === run && job.rung === rung && job.requestId === requestId);
  const engines = [...new Set(jobs.map((job) => job.engine))].sort();
  return engines.flatMap((engine) => jobs.filter((job) => job.engine === engine));
}

/** Whether a section of this quantity and rung has charts drawn from the store: `mtf.native`, and R2's `rays.trace`. */
export function chartsReadStore(quantity: string, rung: string): boolean {
  return quantity === MTF_NATIVE || (quantity === RAYS_TRACE && rung === DEVIATION_RUNG);
}

/** The store keys of a request's jobs, each once: the only entries a section page reads. */
export function requestStoreKeys(manifest: RunManifest, run: string, rung: string, requestId: string): string[] {
  const keys = requestJobs(manifest, run, rung, requestId).flatMap((job) =>
    job.storeKey === null ? [] : [job.storeKey],
  );
  return [...new Set(keys)];
}

/** One job of a request with its store entry: read, or why there is nothing to draw. */
export interface Answer {
  readonly job: ManifestJob;
  readonly document: DocumentName | null;
  readonly entry: StoreEntry | null;
  /** Why the job has no answer to draw, as a sentence; null when its entry is an answer of status ok with data. */
  readonly missing: string | null;
  /** The same, as a short status for a legend: missing, unreadable, or the job's or the answer's status. */
  readonly status: string | null;
}

/** A job's name in a legend: its engine, and its step where it is one. */
export function nameOf(job: ManifestJob): string {
  return job.step === undefined ? job.engine : TEXT.legendStep(job.engine, job.step);
}

/** A job's answer: its store entry read by the key the manifest gives it, or why there is nothing to draw. */
export function answerOf(job: ManifestJob, stored: StoreReader): Answer {
  const none = (document: DocumentName | null, missing: string, status: string): Answer => ({
    job,
    document,
    entry: null,
    missing,
    status,
  });
  if (job.storeKey === null) return none(null, TEXT.noAnswer(nameOf(job), job.status), job.status);
  const document: DocumentName = `store:${job.storeKey}`;
  const loaded = stored(job.storeKey);
  if (loaded.state === "missing") return none(document, TEXT.storeMissing(nameOf(job), job.storeKey), "missing");
  if (loaded.state === "invalid") return none(document, TEXT.storeInvalid(nameOf(job), loaded.problem), "unreadable");
  const entry = loaded.value;
  if (entry.result.status !== "ok" || entry.result.data === undefined) {
    const { status } = entry.result;
    return { job, document, entry, missing: TEXT.noAnswer(nameOf(job), status), status };
  }
  return { job, document, entry, missing: null, status: null };
}

/** What became of the store entries of a request: a problem for each that is not there or cannot be read. */
export function storeProblems(answers: readonly Answer[]): string[] {
  const problems = answers.flatMap((answer) =>
    answer.document !== null && answer.entry === null && answer.missing !== null ? [answer.missing] : [],
  );
  return [...new Set(problems)];
}

/**
 * The answer of an engine a comparison judges, by the comparator's own rule (`mtfNative.ts`: `lastA?.data ?? a`): its
 * last step where that step has data, else its first answer. Undefined for an engine without a job.
 */
function judgedAnswer(answers: readonly Answer[], engine: string): Answer | undefined {
  const own = answers.filter((answer) => answer.job.engine === engine);
  const first = own.find((answer) => answer.job.step === undefined);
  const last = own.filter((answer) => answer.job.step !== undefined).at(-1);
  return last !== undefined && last.missing === null ? last : first;
}

// ── MTF overlays and differences ─────────────────────────────────────────────────────────────────────────────────

/** How a field stands in one answer: as its engine states it, or without curves for a reason of the job. */
export type SeriesState = "ok" | "unconverged" | "unavailable" | "no-answer";

/** One answer of one engine at one field and cut: its frequencies and its curve, as the store entry holds them. */
export interface MtfSeriesView {
  readonly engine: string;
  readonly step: string | null;
  readonly state: SeriesState;
  /** The engine's reason for its field's status, or the sentence that says why the job has no answer to draw. */
  readonly reason: string | null;
  /** Why the series has no curves, in a word for its legend (missing, unreadable, pending, error, unsupported). */
  readonly noCurves: string | null;
  readonly frequencies: Curve | null;
  readonly values: Curve | null;
}

/** How the comparison sorts a field of a pair when it sets it aside: the pair, the class and the reason. */
export interface SetAside {
  readonly a: string;
  readonly b: string;
  readonly class: string;
  readonly reason: string;
}

/** The MTF of every answer of a request at one field and cut. */
export interface MtfOverlayView {
  /** The field's place in the answers' list of fields, from 0. */
  readonly element: number;
  readonly field: Figure | null;
  readonly cut: MtfCut;
  readonly series: readonly MtfSeriesView[];
  /** The pairs whose sorting sets the field aside, each naming its pair. */
  readonly setAside: readonly SetAside[];
}

/** One pair's differences at one field and cut: the first engine's value minus the second's, by frequency. */
export interface MtfDifferencePairView {
  readonly a: string;
  readonly b: string;
  /** The verdict of the pair in the comparison; an UNSUPPORTED or ERROR pair has no difference drawn. */
  readonly verdict: Verdict;
  readonly drawn: boolean;
  /** The step of each engine's answer the differences are of (the one the comparison judges); null for its first. */
  readonly aStep: string | null;
  readonly bStep: string | null;
  readonly points: readonly { readonly frequency: Figure; readonly difference: Derived }[];
  /** How the comparison sorts the field for this pair where it sets it aside; null where it does not, or says nothing. */
  readonly setAside: SetAside | null;
}

/** The differences of every pair of a request at one field and cut, with the band the policy gives the field. */
export interface MtfDifferenceView {
  readonly element: number;
  readonly field: Figure | null;
  readonly cut: MtfCut;
  /** The attention band (on or off the axis) or the tolerance of the rung, from the policy at hand: a band about 0. */
  readonly limit: Figure | null;
  readonly limitKind: "attention" | "tolerance" | null;
  /** Whether the field is on the axis, by its value as the answers state it (0), as the comparator decides it. */
  readonly onAxis: boolean | null;
  readonly pairs: readonly MtfDifferencePairView[];
}

/** One bar of a deviation chart: the largest hit distance on a surface (null where no ray is compared there). */
export interface DeviationBar {
  readonly surface: number;
  readonly distance: Derived;
}

/** A pair's largest hit distance on each surface, beside what R2 recorded for the pair and its tolerance. */
export interface DeviationView {
  readonly a: string;
  readonly b: string;
  /** What a bar is of: a surface (`rays.trace` v1), or a visit of the declared path (v2 and later). */
  readonly place: "surface" | "visit";
  readonly bars: readonly DeviationBar[];
  readonly maxDistance: Figure | null;
  readonly gate: Figure | null;
  /** What the bars come to beside the recorded hits.maxDistance, as a sentence. */
  readonly caption: string;
  readonly problems: readonly string[];
}

/** The charts of one section. */
export interface SectionCharts {
  /** Store entries of the request that are not there or cannot be read, and other reasons a chart is not whole. */
  readonly problems: readonly string[];
  readonly overlays: readonly MtfOverlayView[];
  readonly differences: readonly MtfDifferenceView[];
  readonly deviations: readonly DeviationView[];
}

/** How a section's MTF table (or a peer of it) sorts the fields of its pair. */
export interface PairSorting {
  readonly a: string;
  readonly b: string;
  readonly fields: readonly { readonly class: string | null; readonly reason: string | null }[];
}

/** What a section's charts are built from: its documents and where in them the section lies. */
export interface SectionChartInputs {
  readonly name: string;
  readonly run: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  /** The places of the section's comparison sets in the comparison file. */
  readonly sets: readonly number[];
  readonly policyDocument: DocumentName | null;
  readonly policy: Policy;
  /** How the section's MTF table and its peers sort each field, pair by pair, where it has one. */
  readonly sorting: readonly PairSorting[];
  readonly stored: StoreReader;
}

/** The curve at a path of a store entry: a list, or an encoded ndarray decoded (a value not finite is null). */
export function curveAt(document: DocumentName, entry: StoreEntry, tokens: readonly (string | number)[]): Curve | null {
  const pointer = pointerOf(tokens);
  const found = resolvePointer(entry, pointer);
  if (!found.found) return null;
  if (isNdArray(found.value)) {
    const decoded = decodeNdArray(found.value);
    const values = Array.from(decoded.values as ArrayLike<number>, (value) => (Number.isFinite(value) ? value : null));
    return { values, source: { document, pointer } };
  }
  if (Array.isArray(found.value) && found.value.every((value) => typeof value === "number" || value === null)) {
    return { values: [...(found.value as (number | null)[])], source: { document, pointer } };
  }
  return null;
}

/** The fields of an answer with data; none for an answer without. */
export function fieldsOf(answer: Answer): readonly Record<string, unknown>[] {
  const fields = (answer.entry?.result.data as { fields?: unknown } | undefined)?.fields;
  return answer.missing === null && Array.isArray(fields) ? (fields as Record<string, unknown>[]) : [];
}

function seriesOf(answer: Answer, element: number, cut: MtfCut): MtfSeriesView {
  const { job } = answer;
  const step = job.step ?? null;
  const field = fieldsOf(answer)[element];
  if (answer.missing !== null || field === undefined || answer.document === null || answer.entry === null) {
    const reason = answer.missing ?? TEXT.noAnswer(nameOf(job), "missing");
    const noCurves = answer.status ?? "missing";
    return { engine: job.engine, step, state: "no-answer", reason, noCurves, frequencies: null, values: null };
  }
  const status = field.status === "unconverged" || field.status === "unavailable" ? field.status : "ok";
  return {
    engine: job.engine,
    step,
    state: status,
    reason: typeof field.reason === "string" ? field.reason : null,
    noCurves: null,
    frequencies: curveAt(answer.document, answer.entry, ["request", "spec", "frequenciesPerMm"]),
    values: curveAt(answer.document, answer.entry, ["result", "data", "fields", element, cut]),
  };
}

function fieldFigure(answers: readonly Answer[], element: number): Figure | null {
  for (const answer of answers) {
    if (answer.document === null || answer.entry === null || fieldsOf(answer)[element] === undefined) continue;
    const figure = optionalFigureAt(answer.document, answer.entry, ["result", "data", "fields", element, "field"]);
    if (figure !== null) return figure;
  }
  return null;
}

/** The set-aside of a field by one pair's sorting, naming that pair; null where it does not set the field aside. */
function setAsideOf(sorting: PairSorting, element: number): SetAside | null {
  const sorted = sorting.fields[element];
  if (sorted === undefined || sorted.class === null || sorted.class === "method") return null;
  return { a: sorting.a, b: sorting.b, class: sorted.class, reason: sorted.reason ?? "" };
}

/** Whether two pairs are of the same two engines, in either order. */
export const samePair = (one: { a: string; b: string }, two: { a: string; b: string }): boolean =>
  (one.a === two.a && one.b === two.b) || (one.a === two.b && one.b === two.a);

/** The pairs of the section's sets, each pair of engines once, in the order the sets first have it. */
function pairsOf(inputs: SectionChartInputs): {
  readonly a: string;
  readonly b: string;
  readonly set: number;
  readonly pair: number;
  readonly verdict: Verdict;
}[] {
  const out: { a: string; b: string; set: number; pair: number; verdict: Verdict }[] = [];
  for (const set of inputs.sets) {
    inputs.comparisons.comparisons[set].pairs.forEach(({ a, b, verdict }, pair) => {
      if (!out.some((each) => samePair(each, { a, b }))) out.push({ a, b, set, pair, verdict });
    });
  }
  return out;
}

/** The verdicts of a pair no difference is drawn for: the comparison has no two answers it could set side by side. */
const UNDRAWN_VERDICTS: readonly Verdict[] = ["UNSUPPORTED", "ERROR"];

/** The band of the rung at a field: on or off the axis where the policy has those, else the rung's MTF tolerance. */
function limitOf(inputs: SectionChartInputs, onAxis: boolean | null): Pick<MtfDifferenceView, "limit" | "limitKind"> {
  const { policyDocument, policy, rung } = inputs;
  if (policyDocument === null) return { limit: null, limitKind: null };
  const at = (metric: string, kind: "attention" | "tolerance"): Figure | null =>
    optionalFigureAt(policyDocument, policy, ["rungs", rung, "metrics", metric, kind]);
  if (onAxis !== null) {
    const attention = at(onAxis ? ON_AXIS_METRIC : OFF_AXIS_METRIC, "attention");
    if (attention !== null) return { limit: attention, limitKind: "attention" };
  }
  const tolerance = at("mtf.maxAbs", "tolerance");
  return tolerance === null ? { limit: null, limitKind: null } : { limit: tolerance, limitKind: "tolerance" };
}

function differencePair(
  inputs: SectionChartInputs,
  answers: readonly Answer[],
  pair: { readonly a: string; readonly b: string; readonly verdict: Verdict },
  element: number,
  cut: MtfCut,
): MtfDifferencePairView {
  const { a, b, verdict } = pair;
  const [first, second] = [judgedAnswer(answers, a), judgedAnswer(answers, b)];
  const sorting = inputs.sorting.find((each) => samePair(each, pair));
  const setAside = sorting === undefined ? null : setAsideOf(sorting, element);
  const drawn = !UNDRAWN_VERDICTS.includes(verdict);
  const [one, two] = [first, second].map((answer) => (answer === undefined ? null : seriesOf(answer, element, cut)));
  const points: { frequency: Figure; difference: Derived }[] = [];
  if (drawn && one?.values && two?.values && one.frequencies && first?.document && first.entry) {
    for (let index = 0; index < one.values.values.length; index++) {
      const [x, y] = [one.values.values[index], two.values.values[index]];
      if (x === null || x === undefined || y === null || y === undefined) continue;
      if (index >= one.frequencies.values.length) continue;
      points.push({
        frequency: figureAt(first.document, first.entry, ["request", "spec", "frequenciesPerMm", index]),
        difference: {
          value: x - y,
          derivation: TEXT.derivedDifference(a, b, String(index)),
          of: [one.values.source, two.values.source],
        },
      });
    }
  }
  return { a, b, verdict, drawn, aStep: first?.job.step ?? null, bStep: second?.job.step ?? null, points, setAside };
}

function mtfCharts(
  inputs: SectionChartInputs,
  answers: readonly Answer[],
): Pick<SectionCharts, "overlays" | "differences"> {
  const fieldCount = Math.max(0, ...answers.map((answer) => fieldsOf(answer).length));
  const overlays: MtfOverlayView[] = [];
  const differences: MtfDifferenceView[] = [];
  const pairs = pairsOf(inputs);
  for (let element = 0; element < fieldCount; element++) {
    const field = fieldFigure(answers, element);
    const setAside = inputs.sorting.flatMap((sorting) => {
      const aside = setAsideOf(sorting, element);
      return aside === null ? [] : [aside];
    });
    // On the axis by the field's value, as the comparator decides it (`fieldA.field === 0`), never by its place.
    const value = field?.value;
    const onAxis = value === undefined || value === null ? null : value === 0;
    for (const cut of MTF_CUTS) {
      overlays.push({ element, field, cut, series: answers.map((answer) => seriesOf(answer, element, cut)), setAside });
      differences.push({
        element,
        field,
        cut,
        ...limitOf(inputs, onAxis),
        onAxis,
        pairs: pairs.map((pair) => differencePair(inputs, answers, pair, element, cut)),
      });
    }
  }
  return { overlays, differences };
}

// ── Per-surface ray deviation ────────────────────────────────────────────────────────────────────────────────────

/** The sources a bar of a deviation chart is derived from: both answers' hits, statuses and unrecorded visits. */
function traceSources(answer: Answer): Source[] {
  if (answer.document === null || answer.entry === null) return [];
  const document = answer.document;
  const data = answer.entry.result.data ?? {};
  return ["hits", "status", ...(Object.hasOwn(data, "unrecordedHits") ? ["unrecordedHits"] : [])].map((member) => ({
    document,
    pointer: pointerOf(["result", "data", member]),
  }));
}

/** What the bars of a pair come to beside the recorded hits.maxDistance: a caption, and a problem where they differ. */
function deviationVerdict(
  largest: number | null,
  recorded: Figure | null,
): { readonly caption: string; readonly problem: string | null } {
  if (recorded === null) return { caption: TEXT.deviationUnmeasured, problem: null };
  const value = recorded.value;
  if (value === null) {
    if (largest === null) return { caption: TEXT.deviationUnmeasured, problem: null };
    const sentence = TEXT.deviationNotFinite(numberText(largest));
    return { caption: sentence, problem: sentence };
  }
  if (largest === null) {
    // Every visit left out: no bar can be set beside the record, and a record of 0 says the same.
    if (value === 0) return { caption: TEXT.deviationNoBars(numberText(value)), problem: null };
    const sentence = TEXT.deviationNoBarsDiffers(numberText(value));
    return { caption: sentence, problem: sentence };
  }
  const caption = TEXT.deviationLargest(numberText(largest), numberText(value));
  return Object.is(largest, value)
    ? { caption, problem: null }
    : { caption, problem: TEXT.deviationDiffers(numberText(largest), numberText(value)) };
}

function deviationOf(
  inputs: SectionChartInputs,
  answers: readonly Answer[],
  pair: { readonly a: string; readonly b: string; readonly set: number; readonly pair: number },
): DeviationView {
  const { a, b } = pair;
  const comparisonsDocument: DocumentName = `comparisons:${inputs.name}`;
  const metrics = inputs.comparisons.comparisons[pair.set].pairs[pair.pair].metrics;
  const metric = metrics.findIndex((each) => each.name === DEVIATION_METRIC);
  const maxDistance =
    metric < 0
      ? null
      : figureAt(comparisonsDocument, inputs.comparisons, [
          "comparisons",
          pair.set,
          "pairs",
          pair.pair,
          "metrics",
          metric,
          "value",
        ]);
  const gate =
    inputs.policyDocument === null
      ? null
      : optionalFigureAt(inputs.policyDocument, inputs.policy, [
          "rungs",
          inputs.rung,
          "metrics",
          DEVIATION_METRIC,
          "tolerance",
        ]);
  const first = (engine: string): Answer | undefined =>
    answers.find((answer) => answer.job.engine === engine && answer.job.step === undefined);
  const [one, two] = [first(a), first(b)];
  const version = (answer: Answer | undefined): number => answer?.entry?.request.quantityVersion ?? 1;
  const place = Math.max(version(one), version(two)) >= 2 ? "visit" : "surface";
  const problems: string[] = [];
  for (const [engine, answer] of [
    [a, one],
    [b, two],
  ] as const) {
    if (answer === undefined) problems.push(TEXT.noAnswer(engine, "not in the manifest"));
    else if (answer.missing !== null) problems.push(answer.missing);
  }
  const none = (problem: readonly string[]): DeviationView => {
    const { caption } = deviationVerdict(null, null);
    return { a, b, place, bars: [], maxDistance, gate, caption, problems: problem };
  };
  if (problems.length > 0 || one?.entry?.result.data === undefined || two?.entry?.result.data === undefined) {
    return none(problems);
  }
  let traces: [DecodedTrace, DecodedTrace];
  try {
    traces = [decodeTrace(one.entry.result.data), decodeTrace(two.entry.result.data)];
  } catch (error) {
    return none([TEXT.notTraces(error instanceof Error ? error.message : String(error))]);
  }
  const [x, y] = traces;
  const different = differentRays(x, y);
  if (different !== null) return none([TEXT.notTraces(different)]);
  const both = okInBoth(x, y);
  const of = [...traceSources(one), ...traceSources(two)];
  const bars: DeviationBar[] = [];
  for (let surface = 0; surface < x.surfaces; surface++) {
    let largest: number | null = null;
    for (const ray of both) {
      const visit = surface * x.rays + ray;
      // A visit either answer crossed unchanged and records no point for: R2 compares nothing there.
      if (x.unrecordedHits?.[visit] === 1 || y.unrecordedHits?.[visit] === 1) continue;
      const at = visit * 3;
      const [dx, dy, dz] = [x.hits[at] - y.hits[at], x.hits[at + 1] - y.hits[at + 1], x.hits[at + 2] - y.hits[at + 2]];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (largest === null || distance > largest || Number.isNaN(distance)) largest = distance;
      if (Number.isNaN(largest)) break;
    }
    const value = largest === null || !Number.isFinite(largest) ? null : largest;
    bars.push({ surface, distance: { value, derivation: TEXT.derivedDeviation(a, b, place, String(surface)), of } });
  }
  const values = bars.flatMap((bar) => (bar.distance.value === null ? [] : [bar.distance.value]));
  const { caption, problem } = deviationVerdict(values.length === 0 ? null : Math.max(...values), maxDistance);
  return {
    a,
    b,
    place,
    bars,
    maxDistance,
    gate,
    caption,
    problems: problem === null ? problems : [...problems, problem],
  };
}

/** The charts of a section that has none. */
export const NO_CHARTS: SectionCharts = Object.freeze({ problems: [], overlays: [], differences: [], deviations: [] });

/** The charts of a section: MTF overlays and differences of an `mtf.native` request, deviations of an R2 one. */
export function buildSectionCharts(inputs: SectionChartInputs): SectionCharts {
  if (!chartsReadStore(inputs.quantity, inputs.rung)) return NO_CHARTS;
  const jobs = requestJobs(inputs.manifest, inputs.run, inputs.rung, inputs.requestId);
  const answers = jobs.map((job) => answerOf(job, inputs.stored));
  const problems = storeProblems(answers);
  if (inputs.quantity === MTF_NATIVE) {
    return { problems, ...mtfCharts(inputs, answers), deviations: [] };
  }
  const deviations = pairsOf(inputs).map((pair) => deviationOf(inputs, answers, pair));
  return { problems, overlays: [], differences: [], deviations };
}

// ── Ladder heat maps ─────────────────────────────────────────────────────────────────────────────────────────────

/** A cell of a heat map: the gravest verdict of its pairs, and its pairs by verdict (each verdict that one has). */
export interface HeatCellView {
  readonly verdict: Verdict;
  readonly counts: readonly { readonly verdict: Verdict; readonly count: number }[];
}

/** A heat map: a row per run, a column per rung, a cell per run and rung that has pairs. */
export interface HeatMapView {
  readonly rungs: readonly string[];
  readonly rows: readonly { readonly run: string; readonly cells: readonly (HeatCellView | null)[] }[];
  /** How many rows it would have, where that is more than `HEAT_MAP_ROWS` and none are drawn; null otherwise. */
  readonly omitted: { readonly count: number } | null;
}

function cellOf(verdicts: readonly Verdict[]): HeatCellView | null {
  const verdict = gravestVerdict(verdicts);
  if (verdict === undefined) return null;
  const counts = VERDICTS.map((each) => ({ verdict: each, count: verdicts.filter((one) => one === each).length }));
  return { verdict, counts: counts.filter(({ count }) => count > 0) };
}

function heatMap(
  runs: readonly string[],
  rungs: readonly string[],
  verdictsOf: (run: string, rung: string) => readonly Verdict[],
): HeatMapView {
  if (runs.length > HEAT_MAP_ROWS) return { rungs, rows: [], omitted: { count: runs.length } };
  return {
    rungs,
    rows: runs.map((run) => ({ run, cells: rungs.map((rung) => cellOf(verdictsOf(run, rung))) })),
    omitted: null,
  };
}

/** The heat map of a compared run directory: its manifest's runs by the rungs of its comparisons, over both modes. */
export function runHeatMap(manifest: RunManifest, file: ComparisonFile): HeatMapView {
  const rungs = [...new Set(file.comparisons.map((set) => set.rung))];
  const verdicts = new Map<string, Verdict[]>();
  for (const set of file.comparisons) {
    const key = JSON.stringify([set.run, set.rung]);
    verdicts.set(key, [...(verdicts.get(key) ?? []), ...set.pairs.map((pair) => pair.verdict)]);
  }
  return heatMap(
    manifest.runs.map((run) => run.name),
    rungs,
    (run, rung) => verdicts.get(JSON.stringify([run, rung])) ?? [],
  );
}

/** The heat map of a baseline: its runs by `rungs` (the baseline page's columns), a cell's records by verdict. */
export function baselineHeatMap(baseline: Baseline, rungs: readonly string[]): HeatMapView {
  const byRun = new Map(baseline.runs.map((run) => [run.name, run]));
  return heatMap(
    baseline.runs.map((run) => run.name),
    rungs,
    (run, rung) =>
      byRun
        .get(run)
        ?.rungs.find((each) => each.rung === rung)
        ?.pairs.map((pair) => pair.verdict) ?? [],
  );
}
