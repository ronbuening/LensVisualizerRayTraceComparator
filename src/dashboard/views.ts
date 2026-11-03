// The view models of the dashboard: what each page shows, as data. Pure functions of the documents they are handed:
// equal documents give equal views, and nothing in a view depends on when, where or by whom it was built. Every
// number taken from a document is a Figure with its pointer (`figure.ts`); every other number is a count under a key
// of `COUNT_KEYS`. A view names files by their place under the root or the runs directory, never by an absolute path.
import { SNAPSHOT_BASELINE_SUITES } from "../compare/policyFile.ts";
import {
  CHIEF_LANDING_METRIC,
  MTF_CUTS,
  OFF_AXIS_METRIC,
  ON_AXIS_METRIC,
  curveValueName,
} from "../compare/mtfNative.ts";
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { STALE_REASONS } from "../baseline/check.ts";
import type { StaleReason } from "../baseline/check.ts";
import { MTF_BASELINE_MARK } from "../baseline/files.ts";
import { gravestVerdict } from "../contract/baseline.ts";
import type { Baseline } from "../contract/baseline.ts";
import { FAILING_VERDICTS, VERDICTS } from "../contract/comparison.ts";
import type { ComparisonMetric, ComparisonMode, ComparisonParticipant, Verdict } from "../contract/comparison.ts";
import type { Policy, RungClass, RungMode } from "../contract/policy.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import type { ManifestEngine, RunManifest } from "../core/manifest.ts";
import type { GroupConsensus } from "../report/consensus.ts";
import { buildReport, reportInputProblems, sectionSetGroups } from "../report/model.ts";
import type { ReportModel, ReportSection, SupportRow } from "../report/model.ts";
import type { MtfComparison, MtfFieldFlag } from "../report/mtfComparison.ts";
import type { MtfComparisonKind, MtfRowStatus } from "../report/wording.ts";
import type { NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";
import { documentLabel, figureAt, optionalFigureAt } from "./figure.ts";
import type { Derived, DocumentName, Figure, Source } from "./figure.ts";
import type { AskedEngines } from "./identity.ts";
import { caseNowOf, recordStaleness, stalenessBasis } from "./staleness.ts";
import type { StalenessBasis } from "./staleness.ts";
import type { Loaded, PolicyAtHand } from "./sources.ts";

// ── Shared pieces ────────────────────────────────────────────────────────────────────────────────────────────────

/** A document that could not be shown, by its place under the root or the runs directory, and why. */
export interface DocumentProblem {
  readonly document: string;
  readonly problem: string;
}

/** An engine as a run recorded it, or as it said it is when asked, without what only its maker reads (`details`). */
export type ViewEngine =
  | {
      readonly id: string;
      readonly status: "available";
      readonly version: string;
      readonly fingerprint: string;
      readonly adapterRevision: string | null;
    }
  | { readonly id: string; readonly status: "unavailable"; readonly code: string };

/** How many jobs or support cells ended in one way. */
export interface StatusCount {
  readonly status: string;
  readonly count: number;
}

/** How many pairs or records came to one verdict. */
export interface VerdictCount {
  readonly verdict: Verdict;
  readonly count: number;
}

/** The comparisons of a run: none written yet, read, or there and not readable. */
export type ComparisonsState = "none" | "ok" | "invalid";

/** The ways a job of the manifest ends, in the order they are counted. */
export const JOB_STATUSES: readonly string[] = Object.freeze(["ok", "unsupported", "error", "pending"]);
/** The ways a cell of the support matrix ends: a job's status, or "not-run" for an engine that was not asked. */
export const SUPPORT_STATUSES: readonly string[] = Object.freeze([...JOB_STATUSES, "not-run"]);
/** How many requests a run page shows itself; a suite of more has a page for each of its runs. */
export const RUN_PAGE_REQUESTS = 2000;

function viewEngine(engine: ManifestEngine): ViewEngine {
  if (engine.status === "unavailable") return { id: engine.id, status: "unavailable", code: engine.code };
  const { id, version, fingerprint, adapterRevision } = engine;
  return { id, status: "available", version, fingerprint, adapterRevision: adapterRevision ?? null };
}

function problemOf(document: DocumentName, loaded: Loaded<unknown>): DocumentProblem[] {
  if (loaded.state === "invalid") return [{ document: documentLabel(document), problem: loaded.problem }];
  return [];
}

function comparisonsState(loaded: Loaded<unknown>): ComparisonsState {
  return loaded.state === "missing" ? "none" : loaded.state;
}

function verdictCounts(verdicts: readonly Verdict[], all: boolean): VerdictCount[] {
  const counts = new Map<Verdict, number>();
  for (const verdict of verdicts) counts.set(verdict, (counts.get(verdict) ?? 0) + 1);
  return VERDICTS.map((verdict) => ({ verdict, count: counts.get(verdict) ?? 0 })).filter(
    ({ count }) => all || count > 0,
  );
}

/** Groups a list by a key, in the order the keys first come: linear, whatever the list's length. */
function groupBy<T>(items: readonly T[], keyOf: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group === undefined) groups.set(key, [item]);
    else group.push(item);
  }
  return groups;
}

/** A policy of no rung, for a page whose policy at hand could not be read. */
const NO_POLICY: Policy = { contract: CONTRACT_VERSION, kind: "policy", version: 0, rungs: {} };

/** A comparison file of no set, for the report model of a run that was not compared. */
function noComparisons(manifest: RunManifest): ComparisonFile {
  const { name } = manifest.suite;
  return {
    contract: CONTRACT_VERSION,
    kind: "comparison-file",
    suite: name,
    manifest: "",
    policy: "",
    comparisons: [],
  };
}

/**
 * The report model of a run (`buildReport`), as the run and section pages are laid out from: of its comparisons when
 * it was compared, else of its manifest alone. The policy at hand judges its columns; a policy that could not be read
 * gives none.
 */
export function runReport(
  manifest: RunManifest,
  comparisons: Loaded<ComparisonFile>,
  policy: Loaded<PolicyAtHand>,
): ReportModel {
  const file = comparisons.state === "ok" ? comparisons.value : noComparisons(manifest);
  return buildReport(manifest, file, policy.state === "ok" ? policy.value.policy : NO_POLICY);
}

/** Why a run's comparisons, its manifest and the policy at hand do not belong together; none when not compared. */
export function runInputProblems(
  manifest: Loaded<RunManifest>,
  comparisons: Loaded<ComparisonFile>,
  policy: Loaded<PolicyAtHand>,
): string[] {
  if (manifest.state !== "ok" || comparisons.state !== "ok" || policy.state !== "ok") return [];
  return reportInputProblems(manifest.value, comparisons.value, policy.value.policy);
}

// ── The index ────────────────────────────────────────────────────────────────────────────────────────────────────

/** One run directory on the index. */
export interface RunSummary {
  readonly name: string;
  readonly problems: readonly DocumentProblem[];
  /** Whether the run has a manifest the dashboard can read. */
  readonly readable: boolean;
  /** Whether it has comparisons: none, read, or there and not readable (and among `problems`). */
  readonly comparisons: ComparisonsState;
  /** Its jobs by status, in the order of `JOB_STATUSES`. */
  readonly jobs: readonly StatusCount[];
  /** Its pairs over both modes by verdict, each of `VERDICTS`; none when it was not compared. */
  readonly verdicts: readonly VerdictCount[];
  /** How many of its pairs are FAIL or ERROR. */
  readonly failing: number;
  /** Why its comparisons, its manifest and the policy at hand do not belong together (`reportInputProblems`). */
  readonly inputProblems: readonly string[];
}

/** The summary of one run directory: from its manifest and comparisons, never from its full report model. */
export function runSummary(
  name: string,
  manifest: Loaded<RunManifest>,
  comparisons: Loaded<ComparisonFile>,
  inputProblems: readonly string[],
): RunSummary {
  const problems = [...problemOf(`manifest:${name}`, manifest), ...problemOf(`comparisons:${name}`, comparisons)];
  const state = comparisonsState(comparisons);
  if (manifest.state !== "ok") {
    return {
      name,
      problems,
      readable: false,
      comparisons: state,
      jobs: [],
      verdicts: [],
      failing: 0,
      inputProblems: [],
    };
  }
  const statuses = groupBy(manifest.value.jobs, (job) => job.status);
  const jobs = JOB_STATUSES.map((status) => ({ status, count: statuses.get(status)?.length ?? 0 }));
  const verdicts =
    comparisons.state === "ok"
      ? verdictCounts(
          comparisons.value.comparisons.flatMap((set) => set.pairs.map((pair) => pair.verdict)),
          true,
        )
      : [];
  const failing = verdicts
    .filter(({ verdict }) => FAILING_VERDICTS.includes(verdict))
    .reduce((sum, { count }) => sum + count, 0);
  return {
    name,
    problems,
    readable: true,
    comparisons: state,
    jobs,
    verdicts,
    failing,
    inputProblems: [...inputProblems],
  };
}

/**
 * Where a baseline's records are judged from, reason by reason, and what became of asking the engines (which the page
 * says beside the engine basis).
 */
export interface StalenessBases {
  readonly engine: "asked" | "last-run" | "none";
  readonly case: "last-run" | "none";
  readonly policy: "policy-at-hand" | "none";
  readonly asked: AskedEngines["state"];
}

/** How many records have one badge. */
export interface BadgeCount {
  readonly badge: string;
  readonly count: number;
}

/** One baseline file on the index. */
export interface BaselineSummary {
  readonly stem: string;
  /** An MTF baseline (`<suite>.mtf.json`) or a rays baseline. */
  readonly kind: "rays" | "mtf";
  readonly problems: readonly DocumentProblem[];
  readonly suite: string | null;
  readonly policyVersion: Figure | null;
  /** Whether the baseline is a dated snapshot of the policy it records (`SNAPSHOT_BASELINE_SUITES`). */
  readonly snapshot: boolean;
  /** How many records (pairs of one rung of one run) it has. */
  readonly records: number;
  /** Its records by verdict, each verdict that one comes to. */
  readonly verdicts: readonly VerdictCount[];
  /** Its records by badge, the badges sorted. */
  readonly badges: readonly BadgeCount[];
  readonly bases: StalenessBases | null;
}

/** The view of the index page. */
export interface IndexView {
  readonly kind: "dashboard-index";
  /** The policy at hand: its name and version; null when it could not be read. */
  readonly policy: { readonly name: string; readonly version: Figure; readonly hash: string } | null;
  readonly problems: readonly DocumentProblem[];
  /** Whether the engines were asked who they are, and what came of it. */
  readonly engines: { readonly state: AskedEngines["state"]; readonly problem: string | null };
  readonly runs: readonly RunSummary[];
  readonly baselines: readonly BaselineSummary[];
}

function policyHeader(policy: Loaded<PolicyAtHand>): IndexView["policy"] {
  if (policy.state !== "ok") return null;
  const document: DocumentName = `policy:${policy.value.name}`;
  return {
    name: policy.value.name,
    version: figureAt(document, policy.value.policy, ["version"]),
    hash: policy.value.hash,
  };
}

/** The index: the policy at hand, whether the engines were asked, and a summary of each run and each baseline. */
export function buildIndexView(
  policy: Loaded<PolicyAtHand>,
  asked: AskedEngines,
  runs: readonly RunSummary[],
  baselines: readonly BaselineSummary[],
): IndexView {
  return {
    kind: "dashboard-index",
    policy: policyHeader(policy),
    problems: policy.state === "invalid" ? [{ document: "the policy at hand", problem: policy.problem }] : [],
    engines: { state: asked.state, problem: asked.state === "failed" ? asked.problem : null },
    runs,
    baselines,
  };
}

// ── The run page ─────────────────────────────────────────────────────────────────────────────────────────────────

/** One section on a run page: one compared request, with the gravest verdict of its pairs. */
export interface SectionEntry {
  /** Its place among the sections of the run directory, from 0: `/run/<suite>/section/<section>`. */
  readonly section: number;
  readonly run: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  readonly request: string | null;
  readonly verdict: Verdict | null;
}

/** A run of the suite on its run page: its case, problems, how many requests and sections it has. */
export interface RunEntry {
  /** Its place among the runs of the manifest, from 0: `/run/<suite>/run/<place>`. */
  readonly place: number;
  readonly name: string;
  readonly caseId: string | null;
  readonly problems: readonly string[];
  /** How many requests (rows of the support matrix) it has. */
  readonly requests: number;
  /** How many of its requests were compared (sections). */
  readonly sectionCount: number;
  /** The gravest verdict of its sections; null with none. */
  readonly verdict: Verdict | null;
}

/** The view of a run page. */
export interface RunView {
  readonly kind: "dashboard-run";
  readonly name: string;
  readonly problems: readonly DocumentProblem[];
  readonly suite: { readonly name: string; readonly hash: string } | null;
  readonly engines: readonly ViewEngine[];
  /** Every run of the suite, in suite order. */
  readonly runs: readonly RunEntry[];
  readonly comparisons: ComparisonsState;
  readonly inputProblems: readonly string[];
  /** The support matrix added up: a row per rung, a cell per engine, its requests by status (`SUPPORT_STATUSES`). */
  readonly supportByRung: readonly {
    readonly rung: string;
    readonly engines: readonly { readonly engine: string; readonly counts: readonly StatusCount[] }[];
  }[];
  /**
   * True when the suite has more requests than one page shows (`RUN_PAGE_REQUESTS`): the support matrix by request
   * and the sections are then on the page of each run (`RunPartView`), and empty here.
   */
  readonly split: boolean;
  /** The support matrix request by request (as `ReportModel.support`), by run. */
  readonly supportByRun: readonly { readonly run: string; readonly rows: readonly SupportRow[] }[];
  /** The pairs of each mode by verdict. */
  readonly summary: readonly { readonly mode: ComparisonMode; readonly counts: readonly VerdictCount[] }[];
  readonly failing: number;
  readonly sections: readonly SectionEntry[];
  /** The jobs that wait for an answer. */
  readonly pending: readonly {
    readonly run: string;
    readonly rung: string;
    readonly engine: string;
    readonly requestId: string;
    readonly step: string | null;
  }[];
}

/** The page of one run of a suite whose run page is split: its requests and its sections. */
export interface RunPartView {
  readonly kind: "dashboard-run-part";
  readonly name: string;
  readonly place: number;
  readonly run: string;
  readonly caseId: string | null;
  readonly problems: readonly string[];
  /** The engines of the support matrix's columns, in order. */
  readonly engines: readonly string[];
  readonly rows: readonly SupportRow[];
  readonly sections: readonly SectionEntry[];
}

/** The sections of a run directory, with their places and verdicts, from its comparisons and report model. */
function sectionEntries(report: ReportModel, comparisons: Loaded<ComparisonFile>): SectionEntry[] {
  const groups = comparisons.state === "ok" ? sectionSetGroups(comparisons.value.comparisons) : [];
  return report.sections.map((section, index): SectionEntry => {
    const sets = comparisons.state === "ok" ? (groups[index] ?? []).map((at) => comparisons.value.comparisons[at]) : [];
    const verdict = gravestVerdict(sets.flatMap((set) => set.pairs.map((pair) => pair.verdict))) ?? null;
    const { run, rung, quantity, requestId, request } = section;
    return { section: index, run, rung, quantity, requestId, request, verdict };
  });
}

/**
 * The run page of a run directory, from its documents, its report model (`runReport`) and its input problems
 * (`runInputProblems`), when it has a manifest. A suite of more than `splitAbove` requests is split by run.
 */
export function buildRunView(
  name: string,
  manifest: Loaded<RunManifest>,
  comparisons: Loaded<ComparisonFile>,
  report: ReportModel | null,
  inputProblems: readonly string[],
  splitAbove: number = RUN_PAGE_REQUESTS,
): RunView {
  const problems = [...problemOf(`manifest:${name}`, manifest), ...problemOf(`comparisons:${name}`, comparisons)];
  const state = comparisonsState(comparisons);
  if (manifest.state !== "ok" || report === null) {
    return {
      kind: "dashboard-run",
      name,
      problems,
      suite: null,
      engines: [],
      runs: [],
      comparisons: state,
      inputProblems: [],
      supportByRung: [],
      split: false,
      supportByRun: [],
      summary: [],
      failing: 0,
      sections: [],
      pending: [],
    };
  }
  const { value } = manifest;
  const compared = comparisons.state === "ok";
  const engineIds = report.engines.map((engine) => engine.id);
  const supportByRung = [...groupBy(report.support, (row) => row.rung)].map(([rung, rows]) => ({
    rung,
    engines: engineIds.map((engine, column) => {
      const statuses = groupBy(rows, (row) => row.cells[column].status);
      return {
        engine,
        counts: SUPPORT_STATUSES.map((status) => ({ status, count: statuses.get(status)?.length ?? 0 })),
      };
    }),
  }));
  const rowsByRun = groupBy(report.support, (row) => row.run);
  const sections = sectionEntries(report, comparisons);
  const sectionsByRun = groupBy(sections, (section) => section.run);
  const split = report.support.length > splitAbove;
  return {
    kind: "dashboard-run",
    name,
    problems,
    suite: { name: value.suite.name, hash: value.suite.hash },
    engines: value.engines.map(viewEngine),
    runs: value.runs.map(({ name: run, caseId, problems: runProblems }, place): RunEntry => {
      const ofRun = sectionsByRun.get(run) ?? [];
      return {
        place,
        name: run,
        caseId,
        problems: [...runProblems],
        requests: rowsByRun.get(run)?.length ?? 0,
        sectionCount: ofRun.length,
        verdict:
          gravestVerdict(ofRun.flatMap((section) => (section.verdict === null ? [] : [section.verdict]))) ?? null,
      };
    }),
    comparisons: state,
    inputProblems: [...inputProblems],
    supportByRung,
    split,
    supportByRun: split ? [] : [...rowsByRun].map(([run, rows]) => ({ run, rows })),
    summary: compared
      ? report.summary.map(({ mode, counts }) => ({
          mode,
          counts: VERDICTS.map((verdict) => ({ verdict, count: counts[verdict] })),
        }))
      : [],
    failing: compared ? report.failing : 0,
    sections: split ? [] : sections,
    pending: value.jobs
      .filter((job) => job.status === "pending")
      .map(({ run, rung, engine, requestId, step }) => ({ run, rung, engine, requestId, step: step ?? null })),
  };
}

/** The page of the run at `place` of a run directory's manifest; null for a place the manifest does not have. */
export function buildRunPartView(
  name: string,
  place: number,
  manifest: RunManifest,
  comparisons: Loaded<ComparisonFile>,
  report: ReportModel,
): RunPartView | null {
  const run = manifest.runs[place];
  if (run === undefined) return null;
  return {
    kind: "dashboard-run-part",
    name,
    place,
    run: run.name,
    caseId: run.caseId,
    problems: [...run.problems],
    engines: report.engines.map((engine) => engine.id),
    rows: report.support.filter((row) => row.run === run.name),
    sections: sectionEntries(report, comparisons).filter((section) => section.run === run.name),
  };
}

// ── The section page ─────────────────────────────────────────────────────────────────────────────────────────────

/** Where a metric occurs: a name and a figure, or a name and a text. */
export interface WhereEntry {
  readonly key: string;
  readonly value: Figure | string;
}

/** A metric of a pair, its value a figure of the comparison file. */
export interface MetricView {
  readonly name: string;
  readonly unit: string;
  readonly value: Figure;
  readonly where: readonly WhereEntry[];
}

/** A column of a section's tables: a metric, with the limit the policy at hand judges it by. */
export interface ColumnView {
  readonly name: string;
  readonly unit: string | null;
  readonly limit: Figure | Derived | null;
  readonly limitKind: "tolerance" | "attention" | null;
  readonly floorLimit: Figure | null;
}

/** One column of an MTF table. */
export interface MtfColumnView {
  readonly engine: string;
  readonly step: string | null;
  readonly judged: boolean;
}

/** One field of an MTF table. */
export interface MtfFieldView {
  /** The field's place in the recorded lists, from 0. */
  readonly element: number;
  readonly field: Figure | null;
  readonly fieldAngleDeg: Figure | null;
  readonly flags: readonly (MtfFieldFlag | null)[];
  readonly samplings: readonly { readonly across: Figure | null; readonly lastChange: Figure | null }[];
  readonly chiefLandingMm: Derived | null;
  readonly rimRaysLost: Derived | null;
  readonly rimLandingSpreadMm: Derived | null;
  readonly class: NativeDifferenceClass | null;
  readonly reason: NativeFieldReason | null;
}

/** One row of an MTF table: a field, a cut and a frequency (cycles/mm, as the recorded value's name has it). */
export interface MtfRowView {
  /** The place of the row's field in the recorded lists, from 0. */
  readonly element: number;
  readonly field: Figure | null;
  readonly cut: string;
  readonly frequency: string;
  readonly shown: boolean;
  readonly values: readonly (Figure | null)[];
  readonly difference: Derived | null;
  readonly band: Figure | Derived | null;
  readonly status: MtfRowStatus;
  readonly class: NativeDifferenceClass | null;
}

/** The MTF table of a section of a rung of the engines' own MTF, as `buildMtfComparison` lays it out. */
export interface MtfView {
  readonly kind: MtfComparisonKind;
  /** Whether a judged column says its answer is of several lines. */
  readonly severalLines: boolean;
  readonly pair: {
    readonly a: string;
    readonly b: string;
    readonly verdict: Verdict | null;
    readonly reason: string | null;
  };
  readonly columns: readonly MtfColumnView[];
  readonly bands: {
    readonly onAxis: Figure | null;
    readonly offAxis: Figure | null;
    readonly chiefLandingMm: Figure | Derived | null;
  };
  readonly fields: readonly MtfFieldView[];
  readonly rows: readonly MtfRowView[];
  readonly peers: readonly MtfView[];
}

/** The view of a section page: one compared request. */
export interface SectionView {
  readonly kind: "dashboard-section";
  readonly name: string;
  readonly section: number;
  readonly run: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  readonly request: string | null;
  readonly mode: RungMode | null;
  readonly class: RungClass | null;
  readonly verdict: Verdict | null;
  readonly inputProblems: readonly string[];
  readonly columns: readonly ColumnView[];
  readonly referenceVsEach: {
    readonly reference: string;
    readonly rows: readonly {
      readonly engine: string;
      readonly metrics: readonly (MetricView | null)[];
      readonly verdict: Verdict;
      readonly reason: string | null;
    }[];
  } | null;
  readonly pairwise: {
    readonly engines: readonly string[];
    readonly cells: readonly (readonly ({ readonly verdict: Verdict; readonly worst: MetricView | null } | null)[])[];
  } | null;
  readonly consensus: GroupConsensus | null;
  readonly recorded: {
    readonly engines: readonly string[];
    readonly rows: readonly {
      readonly name: string;
      readonly element: number;
      readonly cells: readonly (Figure | null)[];
    }[];
  } | null;
  readonly mtf: MtfView | null;
}

/** The pieces of the comparison file a section's figures are read from. */
interface SectionContext {
  readonly document: DocumentName;
  readonly file: ComparisonFile;
  readonly policyDocument: DocumentName | null;
  readonly policy: Policy;
}

function whereOf(context: SectionContext, base: readonly (string | number)[], metric: ComparisonMetric): WhereEntry[] {
  const where = metric.where ?? {};
  return Object.keys(where)
    .sort()
    .map((key) => {
      const value = where[key];
      return {
        key,
        value: typeof value === "number" ? figureAt(context.document, context.file, [...base, "where", key]) : value,
      };
    });
}

function metricOf(context: SectionContext, setIndex: number, pairIndex: number, metric: ComparisonMetric): MetricView {
  const metrics = context.file.comparisons[setIndex].pairs[pairIndex].metrics;
  const place = metrics.indexOf(metric);
  if (place < 0) throw new Error(`the metric ${metric.name} is not of pair ${pairIndex} of comparison ${setIndex}`);
  const base = ["comparisons", setIndex, "pairs", pairIndex, "metrics", place];
  return {
    name: metric.name,
    unit: metric.unit,
    value: figureAt(context.document, context.file, [...base, "value"]),
    where: whereOf(context, base, metric),
  };
}

/** The figure of a recorded value of a participant, at a name and an element; null where it records none there. */
function recordedFigure(
  context: SectionContext,
  setIndex: number,
  participants: readonly ComparisonParticipant[],
  engine: string,
  name: string,
  element: number,
): Figure | null {
  const place = participants.findIndex((participant) => participant.engine === engine);
  const recorded = participants[place]?.recorded;
  if (recorded === undefined || !Object.hasOwn(recorded, name) || element >= recorded[name].length) return null;
  return figureAt(context.document, context.file, [
    "comparisons",
    setIndex,
    "participants",
    place,
    "recorded",
    name,
    element,
  ]);
}

function derived(value: number | null, derivation: string, of: readonly (Figure | null)[]): Derived {
  return { value, derivation, of: of.flatMap((figure): Source[] => (figure === null ? [] : [figure.source])) };
}

/** The MTF table of a section with Figures for its values (`buildMtfComparison` gives its layout and sorting). */
function mtfOf(context: SectionContext, setIndex: number, rung: string, table: MtfComparison): MtfView {
  const { participants } = context.file.comparisons[setIndex];
  const valueName = (name: string, step: string | null): string => (step === null ? name : `${name}#${step}`);
  const at = (column: MtfColumnView | undefined, name: string, element: number): Figure | null =>
    column === undefined
      ? null
      : recordedFigure(context, setIndex, participants, column.engine, valueName(name, column.step), element);
  const stated = (figure: Figure | null): Figure | null => (figure === null || figure.value === null ? null : figure);
  const [a, b] = [table.pair.a, table.pair.b].map((engine) =>
    table.columns.find((column) => column.engine === engine && column.judged),
  );
  const fieldOwner = [table.pair.a, table.pair.b, ...participants.map((participant) => participant.engine)].find(
    (engine) => participants.find((participant) => participant.engine === engine)?.recorded?.field !== undefined,
  );
  const fieldAt = (element: number): Figure | null =>
    fieldOwner === undefined ? null : recordedFigure(context, setIndex, participants, fieldOwner, "field", element);

  const band = (metric: string): Figure | null =>
    context.policyDocument === null
      ? null
      : optionalFigureAt(context.policyDocument, context.policy, ["rungs", rung, "metrics", metric, "attention"]);
  const onAxis = band(ON_AXIS_METRIC);
  const offAxis = band(OFF_AXIS_METRIC);
  const policyLanding = band(CHIEF_LANDING_METRIC);
  const chiefLandingMm =
    table.bands.chiefLandingMm === null
      ? null
      : policyLanding !== null && Object.is(policyLanding.value, table.bands.chiefLandingMm)
        ? policyLanding
        : derived(
            table.bands.chiefLandingMm,
            "the largest chief-landing limit the two judged columns record at the first field",
            [at(a, "chiefLandingLimitMm", 0), at(b, "chiefLandingLimitMm", 0)],
          );

  const fields = table.fields.map((field, element): MtfFieldView => {
    const largest = (name: string, value: number | null): Derived | null =>
      value === null
        ? null
        : derived(value, `the larger ${name} of the two judged columns`, [at(a, name, element), at(b, name, element)]);
    return {
      element,
      field: fieldAt(element),
      fieldAngleDeg: stated(at(a, "fieldAngleDeg", element)) ?? stated(at(b, "fieldAngleDeg", element)),
      flags: field.flags,
      samplings: table.columns.map((column) => ({
        across: stated(at(column, "gridSize", element)) ?? stated(at(column, "numRays", element)),
        lastChange: stated(at(column, "maxDelta", element)),
      })),
      chiefLandingMm:
        field.chiefLandingMm === null
          ? null
          : derived(field.chiefLandingMm, "the distance between the chief-ray landings of the two judged columns", [
              at(a, "imageHeightMm", element),
              at(b, "imageHeightMm", element),
            ]),
      rimRaysLost: largest("rimRaysLost", field.rimRaysLost),
      rimLandingSpreadMm: largest("rimLandingSpreadMm", field.rimLandingSpreadMm),
      class: field.class,
      reason: field.reason,
    };
  });

  const frequencies = [...new Set(table.rows.map((row) => row.frequencyPerMm))];
  const rows: MtfRowView[] = [];
  let place = 0;
  for (const element of table.fields.keys()) {
    for (const cut of MTF_CUTS) {
      for (const frequency of frequencies) {
        const row = table.rows[place++];
        if (row === undefined || row.cut !== cut || row.frequencyPerMm !== frequency) {
          throw new Error("the MTF table's rows are not in the order of its fields, cuts and frequencies");
        }
        const name = curveValueName(cut, frequency);
        rows.push({
          element,
          field: fieldAt(element),
          cut,
          frequency: String(frequency),
          shown: row.shown,
          values: table.columns.map((column) => at(column, name, element)),
          difference:
            row.difference === null
              ? null
              : derived(row.difference, "the first judged column minus the second", [
                  at(a, name, element),
                  at(b, name, element),
                ]),
          band: row.band === null ? null : row.field === 0 ? onAxis : offAxis,
          status: row.status,
          class: row.class,
        });
      }
    }
  }
  return {
    kind: table.kind,
    severalLines: table.lineCounts.some((count) => count !== null && count > 1),
    pair: { a: table.pair.a, b: table.pair.b, verdict: table.pair.verdict, reason: table.pair.reason ?? null },
    columns: table.columns.map(({ engine, step, judged }) => ({ engine, step, judged })),
    bands: { onAxis, offAxis, chiefLandingMm },
    fields,
    rows,
    peers: (table.peers ?? []).map((peer) => mtfOf(context, setIndex, rung, peer)),
  };
}

/**
 * The section page of the section `index` of a compared run, from its comparison file, its report model
 * (`runReport` of the same documents) and its input problems (`runInputProblems`). Null for a section the run does
 * not have.
 */
export function buildSectionView(
  name: string,
  index: number,
  comparisons: ComparisonFile,
  policy: Loaded<PolicyAtHand>,
  report: ReportModel,
  inputProblems: readonly string[],
): SectionView | null {
  const section: ReportSection | undefined = report.sections[index];
  const indices = sectionSetGroups(comparisons.comparisons)[index];
  if (section === undefined || indices === undefined) return null;
  const context: SectionContext = {
    document: `comparisons:${name}`,
    file: comparisons,
    policyDocument: policy.state === "ok" ? `policy:${policy.value.name}` : null,
    policy: policy.state === "ok" ? policy.value.policy : NO_POLICY,
  };
  const sets = indices.map((at) => ({ at, set: comparisons.comparisons[at] }));
  const against = sets.find(({ set }) => set.mode === "reference-vs-each");
  const each = sets.find(({ set }) => set.mode === "pairwise");
  const mtf = section.mtf === undefined ? null : mtfOf(context, indices[0], section.rung, section.mtf);

  const columns = section.columns.map((column): ColumnView => {
    const metric = ["rungs", section.rung, "metrics", column.name];
    const chief = column.name === CHIEF_LANDING_METRIC && mtf !== null && mtf.bands.chiefLandingMm !== null;
    const limit =
      column.limit === undefined || context.policyDocument === null
        ? null
        : chief && mtf !== null
          ? mtf.bands.chiefLandingMm
          : figureAt(context.policyDocument, context.policy, [...metric, column.limitKind ?? "tolerance"]);
    const floorLimit =
      column.floorLimit === undefined || context.policyDocument === null
        ? null
        : figureAt(context.policyDocument, context.policy, [...metric, "floor", "limit"]);
    return { name: column.name, unit: column.unit, limit, limitKind: column.limitKind ?? null, floorLimit };
  });

  const referenceVsEach =
    section.referenceVsEach === null || against === undefined
      ? null
      : {
          reference: section.referenceVsEach.reference,
          rows: section.referenceVsEach.rows.map((row, place) => ({
            engine: row.engine,
            metrics: row.metrics.map((metric) =>
              metric === null ? null : metricOf(context, against.at, place, metric),
            ),
            verdict: row.verdict,
            reason: row.reason ?? null,
          })),
        };
  const pairwise =
    section.pairwise === null || each === undefined
      ? null
      : {
          engines: section.pairwise.engines,
          cells: section.pairwise.cells.map((cells, row) =>
            cells.map((cell, column) => {
              if (cell === null) return null;
              const [x, y] = [section.pairwise?.engines[row], section.pairwise?.engines[column]];
              const place = each.set.pairs.findIndex(({ a, b }) => (a === x && b === y) || (a === y && b === x));
              return {
                verdict: cell.verdict,
                worst: cell.worst === null ? null : metricOf(context, each.at, place, cell.worst),
              };
            }),
          ),
        };
  const first = comparisons.comparisons[indices[0]];
  const recorded =
    section.recorded === null
      ? null
      : {
          engines: section.recorded.engines,
          rows: section.recorded.rows.map((row) => ({
            name: row.name,
            element: row.index,
            cells: row.cells.map((cell, column) =>
              cell === null
                ? null
                : recordedFigure(
                    context,
                    indices[0],
                    first.participants,
                    section.recorded?.engines[column] ?? "",
                    row.name,
                    row.index,
                  ),
            ),
          })),
        };
  return {
    kind: "dashboard-section",
    name,
    section: index,
    run: section.run,
    rung: section.rung,
    quantity: section.quantity,
    requestId: section.requestId,
    request: section.request,
    mode: section.mode,
    class: section.class,
    verdict: gravestVerdict(sets.flatMap(({ set }) => set.pairs.map((pair) => pair.verdict))) ?? null,
    inputProblems: [...inputProblems],
    columns,
    referenceVsEach,
    pairwise,
    consensus: section.consensus,
    recorded,
    mtf,
  };
}

// ── The baseline pages ───────────────────────────────────────────────────────────────────────────────────────────

/** A metric of a record, its numbers figures of the baseline file. */
export interface BaselineMetricView {
  readonly name: string;
  readonly unit: string;
  readonly value: Figure;
  readonly tolerance: Figure | null;
  readonly measured: Figure | null;
  readonly where: readonly WhereEntry[];
}

/** One record of a baseline: a pair of engines in one rung of one run, with its badge. */
export interface BaselinePairView {
  readonly a: string;
  readonly b: string;
  readonly verdict: Verdict;
  /** How many requests came to each verdict, as the baseline counts them. */
  readonly verdicts: readonly { readonly verdict: Verdict; readonly requests: Figure }[];
  readonly metrics: readonly BaselineMetricView[];
  /** A catalog FAIL's classifications: the metric and its class. */
  readonly failures: readonly { readonly metric: string; readonly class: string }[];
  readonly stale: readonly StaleReason[];
  readonly notKnown: readonly StaleReason[];
  readonly badge: string;
}

/** What a baseline page and the page of each of its runs share: which baseline, its inputs and its bases. */
interface BaselineHead {
  readonly stem: string;
  readonly baselineKind: "rays" | "mtf";
  readonly problems: readonly DocumentProblem[];
  readonly suite: { readonly name: string; readonly hash: string } | null;
  readonly policy: { readonly version: Figure; readonly hash: string; readonly atHand: boolean | null } | null;
  readonly snapshot: boolean;
  readonly bases: StalenessBases | null;
}

/** One run on a baseline page: the gravest verdict of each of its rungs and its records by badge. */
export interface BaselineRunEntry {
  /** Its place among the baseline's runs, from 0: `/baseline/<stem>/run/<place>`. */
  readonly place: number;
  readonly name: string;
  /** How many records it has. */
  readonly records: number;
  /** For each rung of `BaselineView.rungs`, the gravest verdict of its pairs; null where the run has no such rung. */
  readonly verdicts: readonly (Verdict | null)[];
  readonly badges: readonly BadgeCount[];
}

/** The view of a baseline page: its inputs, engines, staleness summary and a row per run. */
export interface BaselineView extends BaselineHead {
  readonly kind: "dashboard-baseline";
  /** The engines of the baseline, each beside what the basis says it is now (null where it says nothing). */
  readonly engines: readonly {
    readonly id: string;
    readonly version: string;
    readonly fingerprint: string;
    readonly adapterRevision: string | null;
    readonly now: ViewEngine | null;
  }[];
  readonly summary: {
    readonly records: number;
    readonly badges: readonly BadgeCount[];
    readonly stale: readonly { readonly reason: StaleReason; readonly count: number }[];
    readonly notKnown: readonly { readonly reason: StaleReason; readonly count: number }[];
  };
  /** Every rung of the baseline, in the order its runs first have them: the columns of `runs`. */
  readonly rungs: readonly string[];
  readonly runs: readonly BaselineRunEntry[];
}

/** The view of the page of one run of a baseline: its records with their figures and badges. */
export interface BaselineRunView extends BaselineHead {
  readonly kind: "dashboard-baseline-run";
  readonly place: number;
  readonly name: string;
  readonly caseId: string | null;
  /** The run in the suite's last run: null where there is no last run, else whether it is there and its case. */
  readonly caseNow: null | { readonly found: false } | { readonly found: true; readonly caseId: string | null };
  readonly runProblems: readonly string[];
  readonly rungs: readonly {
    readonly rung: string;
    readonly quantity: string;
    readonly requests: Figure;
    readonly pairs: readonly BaselinePairView[];
  }[];
}

/** The kind of a baseline, by its file's stem. */
export function baselineKindOf(stem: string): "rays" | "mtf" {
  return stem.endsWith(MTF_BASELINE_MARK) ? "mtf" : "rays";
}

function basesOf(basis: StalenessBasis, asked: AskedEngines): StalenessBases {
  return {
    engine: basis.engines.kind,
    case: basis.cases.kind,
    policy: basis.policyHash === null ? "none" : "policy-at-hand",
    asked: asked.state,
  };
}

function badgeCounts(badges: readonly string[]): BadgeCount[] {
  const counts = new Map<string, number>();
  for (const badge of badges) counts.set(badge, (counts.get(badge) ?? 0) + 1);
  return [...counts.keys()].sort().map((badge) => ({ badge, count: counts.get(badge) ?? 0 }));
}

/** The inputs a baseline is judged with, read once for its pages. */
interface Judged {
  readonly document: DocumentName;
  readonly baseline: Baseline;
  readonly basis: StalenessBasis;
  readonly head: BaselineHead;
}

function judge(
  stem: string,
  loaded: Loaded<Baseline>,
  policy: Loaded<PolicyAtHand>,
  asked: AskedEngines,
  lastRun: Loaded<RunManifest>,
): Judged | BaselineHead {
  const document: DocumentName = `baseline:${stem}`;
  const baselineKind = baselineKindOf(stem);
  if (loaded.state !== "ok") {
    const problems =
      loaded.state === "missing"
        ? [{ document: documentLabel(document), problem: "it is not there" }]
        : problemOf(document, loaded);
    return { stem, baselineKind, problems, suite: null, policy: null, snapshot: false, bases: null };
  }
  const baseline = loaded.value;
  const basis = stalenessBasis(policy.state === "ok" ? policy.value.hash : null, asked, lastRun);
  const head: BaselineHead = {
    stem,
    baselineKind,
    problems: lastRun.state === "invalid" ? problemOf(`manifest:${baseline.suite.name}`, lastRun) : [],
    suite: { name: baseline.suite.name, hash: baseline.suite.hash },
    policy: {
      version: figureAt(document, baseline, ["policy", "version"]),
      hash: baseline.policy.hash,
      atHand: basis.policyHash === null ? null : baseline.policy.hash === basis.policyHash,
    },
    snapshot: SNAPSHOT_BASELINE_SUITES.includes(baseline.suite.name),
    bases: basesOf(basis, asked),
  };
  return { document, baseline, basis, head };
}

/**
 * The baseline page of `baselines/<stem>.json`: its inputs, its engines beside the basis, its staleness summary and a
 * row per run. `lastRun` is the manifest of the suite's own run directory.
 */
export function buildBaselineView(
  stem: string,
  loaded: Loaded<Baseline>,
  policy: Loaded<PolicyAtHand>,
  asked: AskedEngines,
  lastRun: Loaded<RunManifest>,
): BaselineView {
  const judged = judge(stem, loaded, policy, asked, lastRun);
  if (!("baseline" in judged)) {
    const none = { records: 0, badges: [], stale: [], notKnown: [] };
    return { kind: "dashboard-baseline", ...judged, engines: [], summary: none, rungs: [], runs: [] };
  }
  const { baseline, basis, head } = judged;
  const rungs = [...new Set(baseline.runs.flatMap((run) => run.rungs.map((rung) => rung.rung)))];
  const all: { readonly stale: readonly StaleReason[]; readonly notKnown: readonly StaleReason[]; badge: string }[] =
    [];
  const runs = baseline.runs.map((run, place): BaselineRunEntry => {
    const badges: string[] = [];
    let records = 0;
    for (const rung of run.rungs) {
      for (const pair of rung.pairs) {
        const staleness = recordStaleness(baseline, run, pair.a, pair.b, basis);
        all.push(staleness);
        badges.push(staleness.badge);
        records++;
      }
    }
    const byRung = new Map(run.rungs.map((rung) => [rung.rung, rung]));
    return {
      place,
      name: run.name,
      records,
      verdicts: rungs.map((id) => {
        const rung = byRung.get(id);
        return rung === undefined ? null : (gravestVerdict(rung.pairs.map((pair) => pair.verdict)) ?? null);
      }),
      badges: badgeCounts(badges),
    };
  });
  return {
    kind: "dashboard-baseline",
    ...head,
    engines: baseline.engines.map((engine) => {
      const now = basis.engines.kind === "none" ? undefined : basis.engines.engines.get(engine.id);
      return {
        id: engine.id,
        version: engine.version,
        fingerprint: engine.fingerprint,
        adapterRevision: engine.adapterRevision ?? null,
        now: now === undefined ? null : viewEngine(now),
      };
    }),
    summary: {
      records: all.length,
      badges: badgeCounts(all.map((record) => record.badge)),
      stale: STALE_REASONS.map((reason) => ({
        reason,
        count: all.filter((each) => each.stale.includes(reason)).length,
      })),
      notKnown: STALE_REASONS.map((reason) => ({
        reason,
        count: all.filter((each) => each.notKnown.includes(reason)).length,
      })),
    },
    rungs,
    runs,
  };
}

/**
 * The page of the run at `place` of a baseline: every record of it, with its figures and badge. Null for a place the
 * baseline does not have, or a baseline that cannot be read.
 */
export function buildBaselineRunView(
  stem: string,
  place: number,
  loaded: Loaded<Baseline>,
  policy: Loaded<PolicyAtHand>,
  asked: AskedEngines,
  lastRun: Loaded<RunManifest>,
): BaselineRunView | null {
  const judged = judge(stem, loaded, policy, asked, lastRun);
  if (!("baseline" in judged)) return null;
  const { document, baseline, basis, head } = judged;
  const run = baseline.runs[place];
  if (run === undefined) return null;
  const fig = (tokens: readonly (string | number)[]): Figure => figureAt(document, baseline, tokens);
  const optional = (tokens: readonly (string | number)[]): Figure | null =>
    optionalFigureAt(document, baseline, tokens);
  return {
    kind: "dashboard-baseline-run",
    ...head,
    place,
    name: run.name,
    caseId: run.caseId,
    caseNow: caseNowOf(run, basis.cases),
    runProblems: [...(run.problems ?? [])],
    rungs: run.rungs.map((rung, g) => ({
      rung: rung.rung,
      quantity: rung.quantity,
      requests: fig(["runs", place, "rungs", g, "requests"]),
      pairs: rung.pairs.map((pair, p): BaselinePairView => {
        const base = ["runs", place, "rungs", g, "pairs", p];
        return {
          a: pair.a,
          b: pair.b,
          verdict: pair.verdict,
          verdicts: pair.verdicts.map(({ verdict }, v) => ({
            verdict,
            requests: fig([...base, "verdicts", v, "count"]),
          })),
          metrics: pair.metrics.map((metric, m) => {
            const at = [...base, "metrics", m];
            const where = Object.keys(metric.where ?? {})
              .sort()
              .map((key): WhereEntry => {
                const value = metric.where?.[key] ?? "";
                return { key, value: typeof value === "number" ? fig([...at, "where", key]) : value };
              });
            return {
              name: metric.name,
              unit: metric.unit,
              value: fig([...at, "value"]),
              tolerance: optional([...at, "tolerance"]),
              measured: optional([...at, "measured"]),
              where,
            };
          }),
          failures: (pair.failures ?? []).map((failure) => ({ metric: failure.metric, class: failure.class })),
          ...recordStaleness(baseline, run, pair.a, pair.b, basis),
        };
      }),
    })),
  };
}

/**
 * The summary of a baseline on the index: its records by verdict and by badge, judged as its page judges them, without
 * the figures of its runs.
 */
export function baselineSummary(
  stem: string,
  loaded: Loaded<Baseline>,
  policy: Loaded<PolicyAtHand>,
  asked: AskedEngines,
  lastRun: Loaded<RunManifest>,
): BaselineSummary {
  const judged = judge(stem, loaded, policy, asked, lastRun);
  const { head } = "baseline" in judged ? judged : { head: judged };
  const base = {
    stem,
    kind: head.baselineKind,
    problems: head.problems,
    suite: head.suite?.name ?? null,
    policyVersion: head.policy?.version ?? null,
    snapshot: head.snapshot,
    bases: head.bases,
  };
  if (!("baseline" in judged)) return { ...base, records: 0, verdicts: [], badges: [] };
  const { baseline, basis } = judged;
  const verdicts: Verdict[] = [];
  const badges: string[] = [];
  for (const run of baseline.runs) {
    for (const rung of run.rungs) {
      for (const pair of rung.pairs) {
        verdicts.push(pair.verdict);
        badges.push(recordStaleness(baseline, run, pair.a, pair.b, basis).badge);
      }
    }
  }
  return { ...base, records: verdicts.length, verdicts: verdictCounts(verdicts, false), badges: badgeCounts(badges) };
}
