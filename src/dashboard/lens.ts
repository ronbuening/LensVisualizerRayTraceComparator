// The lens pages of the dashboard (Stage 8.4): every run of one lens across the run directories (a run is of the
// lens its case file names, `label.lensKey`), the condition of each, and the MTF curves of its `mtf.native` answers
// overlaid as the owner picks them, with differences against one curve picked as the reference. Pure functions of
// the documents they are handed, as the other views are: a number read from a file is a Figure or a Curve with its
// pointer, a number the page computes a Derived, and a store entry is read only by a key the manifest names for a job
// of a run of the lens.
//
// Differences are of two kinds, kept apart. A curve that answers the reference's own request (run directory, run,
// rung and request) at its field and cut, of a pair the comparison judges, is drawn as the section page of that
// request draws it (Stage 8.2): with the pair's verdict, R5's sorting of the field and the band or tolerance of the
// policy, all read from that section's own charts. Every other difference (another run, so another condition; another
// request, field or cut; a pair no comparison judges) is a subtraction of two curves and no verdict: it is drawn
// apart, without a band. A curve not taken at the reference's frequencies has no difference at all, with the reason:
// no curve is interpolated.
import { MTF_CUTS } from "../compare/mtfNative.ts";
import type { MtfCut } from "../compare/mtfNative.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { RUNGS } from "../core/rungs.ts";
import { DASHBOARD_TEXT } from "../report/wording.ts";
import { answerOf, curveAt, fieldsOf, samePair, storeProblems } from "./chartViews.ts";
import type {
  Answer,
  MtfDifferencePairView,
  MtfDifferenceView,
  SectionCharts,
  SeriesState,
  StoreReader,
} from "./chartViews.ts";
import { caseDocument, figureAt, optionalFigureAt } from "./figure.ts";
import type { Curve, Derived, DocumentName, Figure } from "./figure.ts";
import type { CaseSummary, Loaded } from "./sources.ts";

const TEXT = DASHBOARD_TEXT.lens;
const CHARTS = DASHBOARD_TEXT.charts;

/** The most curves a lens page draws; a choice of more draws none, and says so. */
export const MAX_LENS_CURVES = 24;

/** The parameters of a lens page's address: what its form sends. */
export const LENS_PARAMETERS: readonly string[] = Object.freeze(["run", "rung", "engine", "field", "cut", "ref"]);

/** The form a lens key of LensVisualizer's catalog has: what a lens page's route and run control accept. */
export const LENS_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._+-]{0,199}$/;

// ── The lenses of the run directories ────────────────────────────────────────────────────────────────────────────

/** A run of a lens: the run at `place` of the manifest of the run directory `suite`, and its case. */
export interface LensRunRef {
  readonly suite: string;
  readonly place: number;
  readonly run: string;
  readonly caseId: string;
}

/** The lenses the cases of the run directories name, each with its runs; and the case files that cannot be read. */
export interface LensIndex {
  /** Lens keys, sorted, each with its runs in the order of the run directories (sorted) and of their manifests. */
  readonly lenses: ReadonlyMap<string, readonly LensRunRef[]>;
  /** Case files of runs that cannot be read, by their place under the runs directory, and why. */
  readonly problems: readonly { readonly document: string; readonly problem: string }[];
}

/**
 * The lenses of the run directories: every run with a case whose label names a lens (`label.lensKey`). A run without
 * a case, or whose case names no lens (a case file of a suite), is of no lens.
 */
export function indexLenses(
  directories: readonly { readonly suite: string; readonly manifest: Loaded<RunManifest> }[],
  caseOf: (suite: string, caseId: string) => Loaded<CaseSummary>,
): LensIndex {
  const lenses = new Map<string, LensRunRef[]>();
  const problems: { document: string; problem: string }[] = [];
  for (const { suite, manifest } of directories) {
    if (manifest.state !== "ok") continue;
    manifest.value.runs.forEach((run, place) => {
      if (run.caseId === null) return;
      const loaded = caseOf(suite, run.caseId);
      if (loaded.state === "invalid") {
        problems.push({ document: `${suite}/cases/${run.caseId}.json`, problem: loaded.problem });
        return;
      }
      if (loaded.state !== "ok" || loaded.value.label.lensKey === undefined) return;
      const key = loaded.value.label.lensKey;
      const runs = lenses.get(key) ?? [];
      runs.push({ suite, place, run: run.name, caseId: run.caseId });
      lenses.set(key, runs);
    });
  }
  const sorted = new Map([...lenses].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  return { lenses: sorted, problems };
}

/** A lens on the index: its key, its name as its first run's case has it, how many runs and in which directories. */
export interface LensSummary {
  readonly key: string;
  readonly name: string | null;
  readonly runCount: number;
  readonly suites: readonly string[];
}

/** The lenses of the index page, from the lens index and the cases (for each lens's name). */
export function lensSummaries(
  index: LensIndex,
  caseOf: (suite: string, caseId: string) => Loaded<CaseSummary>,
): LensSummary[] {
  return [...index.lenses].map(([key, runs]) => {
    const first = runs[0] === undefined ? null : caseOf(runs[0].suite, runs[0].caseId);
    return {
      key,
      name: first !== null && first.state === "ok" ? first.value.label.name : null,
      runCount: runs.length,
      suites: [...new Set(runs.map((run) => run.suite))],
    };
  });
}

// ── The choice ───────────────────────────────────────────────────────────────────────────────────────────────────

/** What a lens page's address chooses: values of each parameter as given, each once, and the reference. */
export interface LensSelection {
  readonly runs: readonly string[];
  readonly rungs: readonly string[];
  readonly engines: readonly string[];
  readonly fields: readonly string[];
  readonly cuts: readonly string[];
  readonly reference: string | null;
  /** Parameters the page does not take, by name, each once. */
  readonly unknownParameters: readonly string[];
}

/** The choice an address's query (what follows `?`, without it) makes. */
export function lensSelection(query: string): LensSelection {
  const params = new URLSearchParams(query);
  const all = (name: string): string[] => [...new Set(params.getAll(name))];
  const names = [...new Set([...params.keys()])];
  return {
    runs: all("run"),
    rungs: all("rung"),
    engines: all("engine"),
    fields: all("field"),
    cuts: all("cut"),
    reference: params.get("ref"),
    unknownParameters: names.filter((name) => !LENS_PARAMETERS.includes(name)),
  };
}

/** A choice as one text, for the cache of a page: equal choices, equal texts. */
export function selectionLabel(selection: LensSelection): string {
  const sorted = (values: readonly string[]): string[] => [...values].sort();
  return JSON.stringify([
    sorted(selection.runs),
    sorted(selection.rungs),
    sorted(selection.engines),
    sorted(selection.fields),
    sorted(selection.cuts),
    selection.reference,
    sorted(selection.unknownParameters),
  ]);
}

/** Whether nothing at all is chosen: a page opened without a choice. */
function chosenNothing(selection: LensSelection): boolean {
  return (
    selection.runs.length +
      selection.rungs.length +
      selection.engines.length +
      selection.fields.length +
      selection.cuts.length ===
      0 && selection.reference === null
  );
}

/** The id a picker sends for a run of the lens: its run directory and its place there. */
export function lensRunId(ref: LensRunRef): string {
  return `${ref.suite}/${ref.place}`;
}

/** An engine as a picker names it: its id, and its step where the job is one (`optiland#fft512`). */
function engineLabel(job: ManifestJob): string {
  return job.step === undefined ? job.engine : `${job.engine}#${job.step}`;
}

/** How a field is named by the kind of its request's fields: a fraction of the image height, or an angle. */
function fieldKindName(kind: unknown): string {
  return kind === "image-height-fractions" ? "fraction" : kind === "angles-deg" ? "angle" : "field";
}

/** The id of a curve: the parts that make it one, each written so that a comma never occurs in one. */
function curveId(parts: readonly string[]): string {
  return parts.map((part) => encodeURIComponent(part)).join(",");
}

// ── The views ────────────────────────────────────────────────────────────────────────────────────────────────────

/** An option of the picker: what the form sends, what it shows, and whether the choice has it. */
export interface PickerOption {
  readonly id: string;
  readonly label: string;
  readonly chosen: boolean;
}

/** A field of the picker: its id (`fraction:0.5`), the kind of its request's fields, and the field as answered. */
export interface FieldOption {
  readonly id: string;
  readonly kind: string;
  readonly field: Figure;
  readonly chosen: boolean;
}

/** The condition of a run: what its case file and its manifest say of its zoom and focus, stop, plane and lines. */
export interface LensCondition {
  readonly zoomT: Figure | null;
  readonly focusT: Figure | null;
  readonly stopSemiDiameterMm: Figure;
  readonly object: { readonly kind: "infinity" } | { readonly kind: "finite"; readonly z: Figure };
  readonly imageZ: Figure;
  /** The image plane of the run's MTF recipe (its kind and shift), where the manifest records one. */
  readonly plane: { readonly kind: string; readonly shiftMm: Figure | null } | null;
  readonly lines: readonly { readonly wavelengthNm: Figure; readonly weight: Figure }[];
}

/** One `mtf.native` request of a run: its rung, its engines and a link that draws it. */
export interface LensRequestView {
  readonly rung: string;
  readonly requestId: string;
  readonly engines: readonly string[];
  /** The query that draws the request at its first field, tangential, of every engine, against the first curve. */
  readonly quick: string | null;
}

/** A run of the lens on its page. */
export interface LensRunView {
  readonly id: string;
  readonly suite: string;
  readonly place: number;
  readonly run: string;
  readonly caseId: string;
  readonly problems: readonly string[];
  readonly condition: LensCondition | null;
  readonly comparisons: "none" | "ok" | "invalid";
  readonly requests: readonly LensRequestView[];
}

/** A curve of the choice: one answer of one job at one field and cut. */
export interface LensCurveView {
  readonly curve: number;
  readonly id: string;
  /** The run of the lens it is of (`LensRunView.id`). */
  readonly run: string;
  readonly suite: string;
  readonly runName: string;
  readonly rung: string;
  readonly requestId: string;
  readonly engine: string;
  readonly step: string | null;
  /** The field's place in the answer's list of fields, from 0. */
  readonly element: number;
  readonly field: Figure | null;
  readonly fieldId: string;
  readonly cut: MtfCut;
  readonly state: SeriesState;
  readonly reason: string | null;
  readonly frequencies: Curve | null;
  readonly values: Curve | null;
  readonly reference: boolean;
}

/** A job of the choice that has no curves to draw: why, in a sentence. */
export interface LensNoAnswer {
  readonly run: string;
  readonly suite: string;
  readonly runName: string;
  readonly rung: string;
  readonly engine: string;
  readonly step: string | null;
  readonly reason: string;
}

/** The differences within the reference's request: a section page's difference chart of its field and cut. */
export interface LensWithinView {
  readonly view: MtfDifferenceView;
  readonly subject: string;
  /** The section page of the request: its run directory and its place there; null where it was not compared. */
  readonly section: { readonly suite: string; readonly section: number } | null;
  readonly notes: readonly string[];
}

/** The differences no comparison judges: each curve minus the reference, and why it is one of these. */
export interface LensOtherView {
  readonly lines: readonly {
    readonly curve: number;
    readonly why: string;
    readonly points: readonly { readonly frequency: Figure; readonly difference: Derived }[];
  }[];
}

/** The view of a lens page. */
export interface LensView {
  readonly kind: "dashboard-lens";
  readonly key: string;
  readonly name: string | null;
  readonly problems: readonly string[];
  readonly runs: readonly LensRunView[];
  readonly picker: {
    readonly runs: readonly PickerOption[];
    readonly rungs: readonly PickerOption[];
    readonly engines: readonly PickerOption[];
    readonly fields: readonly FieldOption[];
    readonly cuts: readonly PickerOption[];
  };
  /** What the page says of the choice: values left out, nothing chosen, too many curves. */
  readonly notes: readonly string[];
  readonly curves: readonly LensCurveView[];
  readonly noAnswers: readonly LensNoAnswer[];
  /** The reference curve, by its number; null where none is chosen or it is not among the curves. */
  readonly reference: { readonly curve: number } | null;
  /** Why no difference is drawn at all; null where differences are drawn. */
  readonly referenceNote: string | null;
  readonly within: LensWithinView | null;
  readonly other: LensOtherView | null;
  /** Curves left out of every difference, each with its reason (another set of frequencies, no values). */
  readonly unresolved: readonly string[];
}

/** A run of the lens with what its page reads of it. */
export interface LensRunInput {
  readonly ref: LensRunRef;
  readonly manifest: RunManifest;
  readonly caseSummary: Loaded<CaseSummary>;
  readonly comparisons: "none" | "ok" | "invalid";
}

/** What a lens page is built from. */
export interface LensInputs {
  readonly key: string;
  readonly runs: readonly LensRunInput[];
  readonly selection: LensSelection;
  readonly stored: StoreReader;
  /**
   * The charts of a section page, by the run directory, run, rung and request it is of, with its place: null where
   * the run directory was not compared or has no such section. Asked only for the reference's request.
   */
  readonly sectionCharts: (
    suite: string,
    run: string,
    rung: string,
    requestId: string,
  ) => { readonly section: number; readonly charts: SectionCharts } | null;
}

/** One job of a run of the lens with its answer. */
interface LensJob {
  readonly ref: LensRunRef;
  readonly job: ManifestJob;
  readonly answer: Answer;
}

/** The `mtf.native` jobs of a run, by request in the order the manifest first has them, each request's by engine. */
function jobsOf(input: LensRunInput, stored: StoreReader): LensJob[] {
  const own = input.manifest.jobs.filter((job) => job.run === input.ref.run && job.quantity === MTF_NATIVE);
  const requests = [...new Set(own.map((job) => JSON.stringify([job.rung, job.requestId])))];
  return requests.flatMap((request) => {
    const [rung, requestId] = JSON.parse(request) as [string, string];
    const jobs = own.filter((job) => job.rung === rung && job.requestId === requestId);
    const engines = [...new Set(jobs.map((job) => job.engine))].sort();
    return engines.flatMap((engine) =>
      jobs
        .filter((job) => job.engine === engine)
        .map((job) => ({ ref: input.ref, job, answer: answerOf(job, stored) })),
    );
  });
}

/** A field of an answer: its id, its kind, and the field as the answer states it. */
function fieldOf(answer: Answer, element: number): { id: string; kind: string; field: Figure } | null {
  if (answer.document === null || answer.entry === null) return null;
  const field = optionalFigureAt(answer.document, answer.entry, ["result", "data", "fields", element, "field"]);
  if (field === null || field.value === null) return null;
  const spec = answer.entry.request.spec as { fields?: { kind?: unknown } };
  const kind = fieldKindName(spec.fields?.kind);
  return { id: `${kind}:${String(field.value)}`, kind, field };
}

/** The rungs in the order of the ladder, those it does not know after them, sorted. */
function ladderOrder(rungs: readonly string[]): string[] {
  const place = (rung: string): number => {
    const at = RUNGS.findIndex((each) => each.id === rung);
    return at < 0 ? RUNGS.length : at;
  };
  return [...rungs].sort((a, b) => place(a) - place(b) || (a < b ? -1 : a > b ? 1 : 0));
}

/** The condition of a run, from its case summary and its manifest's MTF recipe. */
function conditionOf(input: LensRunInput): LensCondition | null {
  if (input.caseSummary.state !== "ok") return null;
  const summary = input.caseSummary.value;
  const document = caseDocument(input.ref.suite, input.ref.caseId);
  const manifestDocument: DocumentName = `manifest:${input.ref.suite}`;
  const recipe = input.manifest.runs[input.ref.place]?.recipe?.recipe ?? null;
  const planeKind = (recipe as { plane?: { kind?: unknown } } | null)?.plane?.kind;
  return {
    zoomT: optionalFigureAt(document, summary, ["label", "zoomT"]),
    focusT: optionalFigureAt(document, summary, ["label", "focusT"]),
    stopSemiDiameterMm: figureAt(document, summary, ["conditions", "stopSemiDiameter"]),
    object:
      summary.conditions.object.kind === "finite"
        ? { kind: "finite", z: figureAt(document, summary, ["conditions", "object", "z"]) }
        : { kind: "infinity" },
    imageZ: figureAt(document, summary, ["conditions", "imageZ"]),
    plane:
      typeof planeKind === "string"
        ? {
            kind: planeKind,
            shiftMm: optionalFigureAt(manifestDocument, input.manifest, [
              "runs",
              input.ref.place,
              "recipe",
              "recipe",
              "plane",
              "shiftMm",
            ]),
          }
        : null,
    lines: summary.conditions.lines.map((_line, index) => ({
      wavelengthNm: figureAt(document, summary, ["conditions", "lines", index, "wavelengthNm"]),
      weight: figureAt(document, summary, ["conditions", "lines", index, "weight"]),
    })),
  };
}

/** A curve with the answer it is read from, kept beside its view to read its frequencies' figures. */
interface Drawn {
  readonly view: LensCurveView;
  readonly answer: Answer;
}

function curveOf(item: LensJob, element: number, fieldId: string, cut: MtfCut, curve: number): Drawn {
  const { answer, job, ref } = item;
  const field = fieldsOf(answer)[element];
  const document = answer.document as DocumentName;
  const entry = answer.entry!;
  const status = field?.status === "unconverged" || field?.status === "unavailable" ? field.status : "ok";
  const id = curveId([lensRunId(ref), job.rung, job.requestId, engineLabel(job), fieldId, cut]);
  return {
    answer,
    view: {
      curve,
      id,
      run: lensRunId(ref),
      suite: ref.suite,
      runName: ref.run,
      rung: job.rung,
      requestId: job.requestId,
      engine: job.engine,
      step: job.step ?? null,
      element,
      field: optionalFigureAt(document, entry, ["result", "data", "fields", element, "field"]),
      fieldId,
      cut,
      state: status,
      reason: typeof field?.reason === "string" ? field.reason : null,
      frequencies: curveAt(document, entry, ["request", "spec", "frequenciesPerMm"]),
      values: curveAt(document, entry, ["result", "data", "fields", element, cut]),
      reference: false,
    },
  };
}

/** Whether two curves are taken at the same frequencies: the same number of them, each the same double. */
function sameFrequencies(one: Curve | null, two: Curve | null): boolean {
  if (one === null || two === null || one.values.length !== two.values.length) return false;
  return one.values.every((value, index) => Object.is(value, two.values[index]));
}

/** A curve's engine as a legend names it: its engine, and its step where its job is one. */
export function curveEngine(curve: Pick<LensCurveView, "engine" | "step">): string {
  return curve.step === null ? curve.engine : CHARTS.legendStep(curve.engine, curve.step);
}

/** Why a curve has no values to subtract, or null where it has some. */
function noValuesWhy(curve: LensCurveView): string | null {
  if (curve.state === "unavailable") return TEXT.unavailable(curve.reason ?? "no reason stated");
  if (curve.values === null || curve.values.values.every((value) => value === null)) {
    return CHARTS.noAnswer(curveEngine(curve), "missing");
  }
  return null;
}

/** Each curve minus the reference at each frequency where both are finite numbers, as Derived numbers. */
function pointsOf(
  curve: Drawn,
  reference: LensCurveView,
): { readonly frequency: Figure; readonly difference: Derived }[] {
  const [x, y] = [curve.view.values, reference.values];
  if (x === null || y === null || curve.answer.document === null || curve.answer.entry === null) return [];
  const points: { frequency: Figure; difference: Derived }[] = [];
  x.values.forEach((value, index) => {
    const other = y.values[index];
    if (value === null || other === null || other === undefined) return;
    points.push({
      frequency: figureAt(curve.answer.document!, curve.answer.entry!, ["request", "spec", "frequenciesPerMm", index]),
      difference: {
        value: value - other,
        derivation: CHARTS.derivedDifference(`curve ${curve.view.curve}`, `curve ${reference.curve}`, String(index)),
        of: [x.source, y.source],
      },
    });
  });
  return points;
}

/** Why a curve's difference is not one of the reference's section, or null where it is. */
function otherReason(curve: LensCurveView, reference: LensCurveView): string | null {
  if (curve.suite !== reference.suite) return TEXT.whyOtherDirectory;
  if (curve.run !== reference.run) return TEXT.whyOtherRun;
  if (curve.rung !== reference.rung || curve.requestId !== reference.requestId) return TEXT.whyOtherRequest;
  if (curve.element !== reference.element) return TEXT.whyOtherField;
  if (curve.cut !== reference.cut) return TEXT.whyOtherCut;
  if (curve.engine === reference.engine) return TEXT.whySameEngine;
  return null;
}

/** The differences against the reference: within its request, the others, and what is left out of both. */
function differencesOf(
  key: string,
  drawn: readonly Drawn[],
  reference: Drawn,
  inputs: LensInputs,
): Pick<LensView, "within" | "other" | "unresolved"> {
  const ref = reference.view;
  const unresolved: string[] = [];
  const otherLines: { curve: number; why: string; points: { frequency: Figure; difference: Derived }[] }[] = [];
  const withinPairs: MtfDifferencePairView[] = [];
  const notes: string[] = [];
  let section: { readonly section: number; readonly charts: SectionCharts } | null | undefined;
  const sectionOf = () => {
    if (section === undefined) section = inputs.sectionCharts(ref.suite, ref.runName, ref.rung, ref.requestId);
    return section;
  };
  const sectionDifference = (): MtfDifferenceView | undefined =>
    sectionOf()?.charts.differences.find((each) => each.element === ref.element && each.cut === ref.cut);
  for (const curve of drawn) {
    if (curve.view.reference) continue;
    const empty = noValuesWhy(curve.view);
    if (empty !== null) {
      unresolved.push(TEXT.noValues(String(curve.view.curve), empty));
      continue;
    }
    if (!sameFrequencies(curve.view.frequencies, ref.frequencies)) {
      unresolved.push(TEXT.frequenciesDiffer(String(curve.view.curve)));
      continue;
    }
    let why = otherReason(curve.view, ref);
    let judged: MtfDifferencePairView | undefined;
    if (why === null) {
      if (sectionOf() === null) why = TEXT.whyNotCompared;
      else {
        judged = sectionDifference()?.pairs.find((pair) => samePair(pair, { a: curve.view.engine, b: ref.engine }));
        if (judged === undefined) why = TEXT.whyNoPair;
      }
    }
    if (why !== null || judged === undefined) {
      otherLines.push({ curve: curve.view.curve, why: why ?? TEXT.whyNoPair, points: pointsOf(curve, ref) });
      continue;
    }
    // As the section page draws the pair: its verdict, whether it is drawn, and how its sorting sets the field aside.
    withinPairs.push({
      a: curve.view.engine,
      b: ref.engine,
      verdict: judged.verdict,
      drawn: judged.drawn,
      aStep: curve.view.step,
      bStep: ref.step,
      points: judged.drawn ? pointsOf(curve, ref) : [],
      setAside: judged.setAside,
    });
    for (const [engine, step] of [
      [curve.view.engine, curve.view.step],
      [ref.engine, ref.step],
    ] as const) {
      const judgedStep = judged.a === engine ? judged.aStep : judged.bStep;
      if (judgedStep === step) continue;
      const which = engine === curve.view.engine ? curve.view.curve : ref.curve;
      const note = TEXT.notJudged(String(which), judgedStep === null ? engine : CHARTS.legendStep(engine, judgedStep));
      if (!notes.includes(note)) notes.push(note);
    }
  }
  const difference = withinPairs.length === 0 ? undefined : sectionDifference();
  const placed = sectionOf();
  return {
    within:
      difference === undefined
        ? null
        : {
            view: {
              element: ref.element,
              field: ref.field,
              cut: ref.cut,
              limit: difference.limit,
              limitKind: difference.limitKind,
              onAxis: difference.onAxis,
              pairs: withinPairs,
            },
            subject: TEXT.withinSubject(key, ref.suite, ref.runName, ref.rung),
            section: placed === null || placed === undefined ? null : { suite: ref.suite, section: placed.section },
            notes,
          },
    other: otherLines.length === 0 ? null : { lines: otherLines },
    unresolved,
  };
}

/**
 * The view of a lens page: its runs with their conditions and requests, the picker over their `mtf.native` answers,
 * the curves the choice draws (at most `MAX_LENS_CURVES`) and, with a reference among them, the differences against
 * it, within its request as its section page draws them, and the others apart.
 */
export function buildLensView(inputs: LensInputs): LensView {
  const { key, runs, selection, stored } = inputs;
  const jobs = runs.map((input) => ({ input, jobs: jobsOf(input, stored) }));
  const nothing = chosenNothing(selection);
  const cutsChosen = nothing ? ["tangential"] : selection.cuts;

  // The picker's options: the runs with an mtf.native job, their rungs, engines and steps, fields and the two cuts.
  const runOptions = jobs
    .filter((each) => each.jobs.length > 0)
    .map(({ input }) => ({
      id: lensRunId(input.ref),
      label: `${input.ref.suite}: ${input.ref.run}`,
      chosen: selection.runs.includes(lensRunId(input.ref)),
    }));
  const everyJob = jobs.flatMap((each) => each.jobs);
  const rungOptions = ladderOrder([...new Set(everyJob.map((item) => item.job.rung))]).map((rung) => ({
    id: rung,
    label: rung,
    chosen: selection.rungs.includes(rung),
  }));
  const labels = [...new Set(everyJob.map((item) => engineLabel(item.job)))].sort((a, b) => {
    const [ea, sa] = a.split("#");
    const [eb, sb] = b.split("#");
    return ea !== eb ? (ea < eb ? -1 : 1) : sa === undefined ? -1 : sb === undefined ? 1 : sa < sb ? -1 : 1;
  });
  const engineOptions = labels.map((label) => {
    const [engine, step] = label.split("#");
    return {
      id: label,
      label: step === undefined ? engine : CHARTS.legendStep(engine, step),
      chosen: selection.engines.includes(label),
    };
  });
  const fields = new Map<string, { kind: string; field: Figure }>();
  for (const item of everyJob) {
    fieldsOf(item.answer).forEach((_field, element) => {
      const found = fieldOf(item.answer, element);
      if (found !== null && !fields.has(found.id)) fields.set(found.id, { kind: found.kind, field: found.field });
    });
  }
  const fieldOptions = [...fields]
    .sort(([, a], [, b]) =>
      a.kind !== b.kind ? (a.kind < b.kind ? -1 : 1) : (a.field.value ?? 0) - (b.field.value ?? 0),
    )
    .map(([id, { kind, field }]) => ({ id, kind, field, chosen: selection.fields.includes(id) }));
  const cutOptions = MTF_CUTS.map((cut) => ({ id: cut, label: cut, chosen: cutsChosen.includes(cut) }));

  // The runs, their conditions and their requests with a link that draws each.
  const runViews = jobs.map(({ input, jobs: own }): LensRunView => {
    const requests = [...new Set(own.map((item) => JSON.stringify([item.job.rung, item.job.requestId])))].map(
      (request): LensRequestView => {
        const [rung, requestId] = JSON.parse(request) as [string, string];
        const ofRequest = own.filter((item) => item.job.rung === rung && item.job.requestId === requestId);
        const engines = ofRequest.map((item) => engineLabel(item.job));
        const first = ofRequest.find((item) => fieldOf(item.answer, 0) !== null);
        const field = first === undefined ? null : fieldOf(first.answer, 0);
        const quick =
          first === undefined || field === null
            ? null
            : new URLSearchParams([
                ["run", lensRunId(input.ref)],
                ["rung", rung],
                ...engines.map((engine): [string, string] => ["engine", engine]),
                ["field", field.id],
                ["cut", "tangential"],
                [
                  "ref",
                  curveId([lensRunId(input.ref), rung, requestId, engineLabel(first.job), field.id, "tangential"]),
                ],
              ]).toString();
        return { rung, requestId, engines, quick };
      },
    );
    const problems = input.caseSummary.state === "invalid" ? [input.caseSummary.problem] : [];
    return {
      id: lensRunId(input.ref),
      suite: input.ref.suite,
      place: input.ref.place,
      run: input.ref.run,
      caseId: input.ref.caseId,
      problems,
      condition: conditionOf(input),
      comparisons: input.comparisons,
      requests,
    };
  });

  // What the choice names that is none of the options, and what it chooses.
  const notes: string[] = [];
  if (selection.unknownParameters.length > 0)
    notes.push(TEXT.unknownParameters(selection.unknownParameters.join(", ")));
  const unknown = [
    ...selection.runs.filter((id) => !runOptions.some((option) => option.id === id)),
    ...selection.rungs.filter((id) => !rungOptions.some((option) => option.id === id)),
    ...selection.engines.filter((id) => !engineOptions.some((option) => option.id === id)),
    ...selection.fields.filter((id) => !fieldOptions.some((option) => option.id === id)),
    ...selection.cuts.filter((id) => !(MTF_CUTS as readonly string[]).includes(id)),
  ];
  if (unknown.length > 0) notes.push(TEXT.unknownValues(unknown.join(", ")));

  const chosenJobs = jobs
    .filter(({ input }) => selection.runs.includes(lensRunId(input.ref)))
    .flatMap((each) => each.jobs)
    .filter((item) => selection.rungs.includes(item.job.rung) && selection.engines.includes(engineLabel(item.job)));
  const candidates: { item: LensJob; element: number; fieldId: string; cut: MtfCut }[] = [];
  const noAnswers: LensNoAnswer[] = [];
  for (const item of chosenJobs) {
    if (item.answer.missing !== null) {
      noAnswers.push({
        run: lensRunId(item.ref),
        suite: item.ref.suite,
        runName: item.ref.run,
        rung: item.job.rung,
        engine: item.job.engine,
        step: item.job.step ?? null,
        reason: item.answer.missing,
      });
      continue;
    }
    fieldsOf(item.answer).forEach((_field, element) => {
      const found = fieldOf(item.answer, element);
      if (found === null || !selection.fields.includes(found.id)) return;
      for (const cut of MTF_CUTS) {
        if (cutsChosen.includes(cut)) candidates.push({ item, element, fieldId: found.id, cut });
      }
    });
  }
  const problems = storeProblems(chosenJobs.map((item) => item.answer));
  const empty = {
    curves: [],
    reference: null,
    within: null,
    other: null,
    unresolved: [],
  };
  const base = {
    kind: "dashboard-lens" as const,
    key,
    name: (() => {
      const first = runs.find((input) => input.caseSummary.state === "ok");
      return first !== undefined && first.caseSummary.state === "ok" ? first.caseSummary.value.label.name : null;
    })(),
    problems,
    runs: runViews,
    picker: { runs: runOptions, rungs: rungOptions, engines: engineOptions, fields: fieldOptions, cuts: cutOptions },
    noAnswers,
  };
  if (nothing) return { ...base, ...empty, notes: [...notes, TEXT.nothingChosen], referenceNote: null };
  if (candidates.length > MAX_LENS_CURVES) {
    const many = TEXT.tooMany(String(candidates.length), String(MAX_LENS_CURVES));
    return { ...base, ...empty, notes: [...notes, many], referenceNote: null };
  }
  if (candidates.length === 0) {
    return { ...base, ...empty, notes: [...notes, TEXT.noCurvesOfChoice], referenceNote: null };
  }
  const drawn = candidates.map(({ item, element, fieldId, cut }, index) =>
    curveOf(item, element, fieldId, cut, index + 1),
  );
  const referenceAt = drawn.findIndex((each) => each.view.id === selection.reference);
  if (referenceAt < 0) {
    const curves = drawn.map((each) => each.view);
    const referenceNote = selection.reference === null ? TEXT.referenceNone : TEXT.referenceNotChosen;
    return { ...base, ...empty, curves, notes, referenceNote };
  }
  const withReference = drawn.map((each, index) =>
    index === referenceAt ? { ...each, view: { ...each.view, reference: true } } : each,
  );
  const reference = withReference[referenceAt];
  const curves = withReference.map((each) => each.view);
  const referenceEmpty = noValuesWhy(reference.view);
  if (referenceEmpty !== null) {
    return {
      ...base,
      ...empty,
      curves,
      notes,
      reference: { curve: reference.view.curve },
      referenceNote: TEXT.referenceNoValues(referenceEmpty),
    };
  }
  return {
    ...base,
    curves,
    notes,
    reference: { curve: reference.view.curve },
    referenceNote: null,
    ...differencesOf(key, withReference, reference, inputs),
  };
}
