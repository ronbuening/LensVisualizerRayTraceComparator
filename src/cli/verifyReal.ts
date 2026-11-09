// `npm run verify:real`: the committed baselines held against the live engines, one `lvrtc baseline check` at a
// time. Every check is a child `bin/lvrtc.mjs` of its own, so each ends, and gives its memory back, before the next
// starts. Nothing here writes a file: the run directories and the store are what `baseline check` writes.
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { availableParallelism } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { baselineFile, mtfBaselineFile } from "../baseline/files.ts";
import { REPO_ROOT } from "../core/config.ts";
import { defaultMemoryBudgetGiB, jobEstimateGiB } from "../core/memoryBudget.ts";
import { UsageError } from "../core/usageError.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "./command.ts";
import type { CliIo } from "./command.ts";
import type { DoctorReport } from "./commands/doctor.ts";
import { maxJobs } from "./jobs.ts";
import { currentCheckId } from "../core/legacyIds.ts";
import { helpText, options, paragraph } from "./help.ts";
import { CHECK_LV_OUTPUT_TEXT, IDENTIFIERS_TEXT, STALE_REASON_TEXT, outcomeLabel } from "../vocabulary/index.ts";
import { countsText, legendLines } from "./output.ts";

/** The two kinds of baseline a suite can have: `<suite>.json` (rays) and `<suite>.mtf.json` (`--mtf`). */
export type BaselineKind = "rays" | "mtf";

/** A suite to check and the kinds of its baseline that are checked, rays before MTF. */
export interface SuiteKinds {
  readonly suite: string;
  readonly kinds: readonly BaselineKind[];
}

/**
 * The committed suites of the routine check, in the order `--all` checks them: the benchmark first. Folded and
 * diffractive have no MTF baseline.
 */
export const VERIFY_REAL_SUITES: readonly SuiteKinds[] = [
  { suite: "benchmark", kinds: ["rays", "mtf"] },
  { suite: "features", kinds: ["rays", "mtf"] },
  { suite: "states", kinds: ["rays", "mtf"] },
  { suite: "focus-stations", kinds: ["rays", "mtf"] },
  { suite: "folded", kinds: ["rays"] },
  { suite: "diffractive", kinds: ["rays"] },
];

/**
 * Committed suites whose baselines are a dated snapshot, not refreshed until the project's end (the catalog: policy
 * 15, LensVisualizer 879c06102). They are not in `--all`, and are checked only when `--suite` or `--suites` names them.
 */
export const SNAPSHOT_SUITES: readonly SuiteKinds[] = [{ suite: "catalog", kinds: ["rays", "mtf"] }];

const SNAPSHOT_NOTE =
  "a dated snapshot, not refreshed until the project's end: checked only when named, never by --all";

/** The suite checked without `--all`, `--suite` or `--suites`. */
export const DEFAULT_VERIFY_SUITE = "benchmark";
/** The most jobs a check is given without `--jobs`; the memory budget may give it fewer. */
export const DEFAULT_VERIFY_JOBS = 4;

/** The outcomes of `baseline check` a clean verification admits. MOVED is of a recorded rung and fails nothing. */
export const CLEAN_OUTCOMES: readonly string[] = ["OK", "REFRESHABLE", "MOVED"];

const SYNOPSIS =
  "Usage: npm run verify:real -- [--all | --suite <name> | --suites <a,b,...>] [--jobs <n>] [--root <dir>] [--details]\n";

const CLEAN_LABELS = CLEAN_OUTCOMES.map((outcome) => `"${outcomeLabel(outcome)}" (${outcome})`);

/**
 * The help of the real-engine check after its synopsis: the same words for `npm run verify:real` and for
 * `lvrtc check-lv`, which run the one implementation below.
 */
export function verifyRealHelpBody(): string[] {
  return [
    ...paragraph(
      `Checks LensVisualizer the way its committed results were made. First it checks that this machine is ready, as lvrtc doctor does, and refuses (exit 2), running nothing, unless Node is in range, LensVisualizer is a clean git checkout that loads, and optiland answers. Then it runs the checks of each committed baseline again against the live LensVisualizer and optiland, one suite at a time, each in a process of its own, and sets every result beside the committed one. For each suite and kind of baseline it prints "${CHECK_LV_OUTPUT_TEXT.status.clean}" or "${CHECK_LV_OUTPUT_TEXT.status["not clean"]}" and how many results came out as each outcome: ${["OK", "REFRESHABLE", "MOVED", "DRIFT"].map((outcome) => `"${outcomeLabel(outcome)}"`).join(", ")} and the rest; then a summary of every one.`,
    ),
    ...paragraph(
      `Without options it checks the benchmark suite: its ray checks, then its MTF checks. --all checks every committed suite in this order: ${VERIFY_REAL_SUITES.map(({ suite }) => suite).join(", ")}. The catalog's results are a dated snapshot, not refreshed until the project's end: --all leaves them out, and --suite catalog checks them.`,
    ),
    ...paragraph(
      "How long it takes: an answer already in the result cache (the store directory under the runs directory) is reused, and everything else is computed. With a warm cache the benchmark takes minutes; from an empty cache its MTF checks take many hours, so try --suite features first. Set LVRTC_RUNS_DIR to a temporary directory to keep a trial out of this repository's runs/. Nothing is written into baselines/ or reports/.",
    ),
    ...options([
      ["--all", "every committed suite of the routine check, in that order (not the catalog)"],
      ["--suite <name>", "this suite alone, with the kinds of baseline it has (rays, then MTF)"],
      ["--suites <names>", "these suites, in this order, each with the kinds of baseline it has"],
      [
        "--jobs <n>",
        `the most jobs a check runs at once (default ${DEFAULT_VERIFY_JOBS}); a check is given fewer when the default memory budget holds fewer of its jobs (two for the benchmark's MTF checks on a 48 GB machine)`,
      ],
      ["--root <dir>", "the directory that holds lvrtc.config.json, suites/ and baselines/ (default: this repository)"],
      [
        "--details",
        "also show the identifiers of LensVisualizer and optiland: the hash of LensVisualizer's engine files and of optiland's code",
      ],
    ]),
    ...paragraph(
      `Exit code: 0 when every result of every suite is ${CLEAN_LABELS.join(", ")}, with no failure that docs/known-failures.json does not list and no engine that could not be used (a side-by-side figure that moved is reported and fails nothing); 1 otherwise, or when a check was interrupted (the checks after it are not run); 2 when nothing was checked: a command line, suite or baseline that is not there, or a machine that is not ready.`,
    ),
  ];
}

/** How the real-engine check names itself: the prefix of its lines, its synopsis and its help. */
export interface VerifyRealProgram {
  readonly prefix: string;
  readonly synopsis: string;
  readonly help: string;
}

/** `npm run verify:real`. */
export const VERIFY_REAL_PROGRAM: VerifyRealProgram = {
  prefix: "verify:real",
  synopsis: SYNOPSIS,
  help: helpText([SYNOPSIS, ...verifyRealHelpBody(), "lvrtc check-lv runs the same check."]),
};

/** What the command line asks for. `suites` null is the default, the benchmark. */
export interface VerifyRealOptions {
  readonly help: boolean;
  readonly suites: readonly string[] | null;
  readonly all: boolean;
  readonly jobs: number;
  readonly root: string | undefined;
  /** Show the hashes of LensVisualizer's engine files and of optiland's code. */
  readonly details?: boolean;
}

const SUITE_NAME = /^[a-z0-9][a-z0-9._-]*$/;

/** Reads the command line; a `UsageError` for anything that is not the synopsis. */
export function parseVerifyRealArgs(args: readonly string[]): VerifyRealOptions {
  let all = false;
  let details = false;
  let suites: string[] | null = null;
  let jobs: number | undefined;
  let root: string | undefined;
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "-h" || arg === "--help") return { help: true, suites: null, all: false, jobs: 0, root: undefined };
    if (seen.has(arg)) throw new UsageError(`${arg} is given twice`);
    seen.add(arg);
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg === "--details") {
      details = true;
      continue;
    }
    if (arg !== "--suite" && arg !== "--suites" && arg !== "--jobs" && arg !== "--root") {
      throw new UsageError(`unknown argument "${arg}"`);
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) throw new UsageError(`${arg} needs a value`);
    index += 1;
    if (arg === "--root") root = value;
    else if (arg === "--jobs") {
      if (!/^[1-9][0-9]*$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new UsageError(`--jobs must be a positive integer, got ${JSON.stringify(value)}`);
      }
      jobs = Number(value);
    } else {
      if (suites !== null) throw new UsageError("--suite and --suites cannot be given together");
      const names = arg === "--suite" ? [value] : value.split(",");
      const bad = names.find((name) => !SUITE_NAME.test(name));
      if (bad !== undefined) throw new UsageError(`${arg}: ${JSON.stringify(bad)} is not a suite name`);
      if (new Set(names).size !== names.length) throw new UsageError("--suites names a suite twice");
      suites = names;
    }
  }
  if (all && suites !== null) throw new UsageError("--all cannot be given with --suite or --suites");
  return { help: false, suites, all, jobs: jobs ?? DEFAULT_VERIFY_JOBS, root, ...(details ? { details } : {}) };
}

/** One `lvrtc baseline check`: its suite, kind, baseline file, the rungs that baseline has and the jobs it is given. */
export interface CheckStep {
  readonly suite: string;
  readonly kind: BaselineKind;
  readonly baseline: string;
  readonly rungs: readonly string[];
  readonly jobs: number;
  /** The planning estimate of one job of those rungs, in GiB (`jobEstimateGiB`). */
  readonly perJobGiB: number;
  /** A suite of `SNAPSHOT_SUITES`: checked because it was named, and said to be a dated snapshot. */
  readonly snapshot?: true;
}

/** What the machine holds, injected so that tests choose it. */
export interface PlanMachine {
  readonly budgetGiB: number;
  readonly cpus: number;
}

function baselineOf(rootDir: string, suite: string, kind: BaselineKind): string {
  return kind === "mtf" ? mtfBaselineFile(rootDir, suite) : baselineFile(rootDir, suite);
}

/**
 * The rungs a baseline file has, in the order it first names them, each by its id of today: a baseline committed
 * before a check was renamed names it by its old id (`currentCheckId`).
 */
function rungsOf(file: string): string[] {
  let runs: unknown;
  try {
    runs = (JSON.parse(readFileSync(file, "utf8")) as { runs?: unknown }).runs;
  } catch (error) {
    throw new UsageError(`${file}: not readable as a baseline: ${error instanceof Error ? error.message : error}`);
  }
  if (!Array.isArray(runs)) throw new UsageError(`${file}: not a baseline: it has no runs`);
  const rungs: string[] = [];
  for (const run of runs as { rungs?: { rung?: unknown }[] }[]) {
    for (const { rung } of run.rungs ?? []) {
      if (typeof rung !== "string") continue;
      const now = currentCheckId(rung);
      if (!rungs.includes(now)) rungs.push(now);
    }
  }
  return rungs;
}

/**
 * The suites and kinds the options select: the committed tables' kinds, or for another suite those it has. `--all` is
 * the routine table alone; a snapshot suite is selected only by name.
 */
export function selectedSuites(options: VerifyRealOptions, rootDir: string): SuiteKinds[] {
  if (options.all) return VERIFY_REAL_SUITES.map((entry) => ({ ...entry }));
  return (options.suites ?? [DEFAULT_VERIFY_SUITE]).map((suite) => {
    const known = [...VERIFY_REAL_SUITES, ...SNAPSHOT_SUITES].find((entry) => entry.suite === suite);
    if (known !== undefined) return { ...known };
    const kinds = (["rays", "mtf"] as const).filter((kind) => existsSync(baselineOf(rootDir, suite, kind)));
    if (kinds.length === 0) {
      throw new UsageError(`the suite ${suite} has no baseline: lvrtc baseline write ${suite} writes one`);
    }
    return { suite, kinds };
  });
}

/**
 * The checks, in the order they run: per suite, rays then MTF. Every suite file and baseline must be there before
 * anything is run. A check is given `options.jobs`, or fewer where the memory budget holds fewer jobs of its rungs.
 */
export function planChecks(options: VerifyRealOptions, rootDir: string, machine: PlanMachine): CheckStep[] {
  const steps: CheckStep[] = [];
  for (const { suite, kinds } of selectedSuites(options, rootDir)) {
    const suiteFile = join(rootDir, "suites", `${suite}.json`);
    if (!existsSync(suiteFile)) throw new UsageError(`${suiteFile}: no suite file is there`);
    for (const kind of kinds) {
      const baseline = baselineOf(rootDir, suite, kind);
      if (!existsSync(baseline)) {
        throw new UsageError(
          `${baseline}: the suite ${suite} has no ${kind === "mtf" ? "MTF " : ""}baseline to check; ` +
            `lvrtc baseline write ${suite}${kind === "mtf" ? " --mtf" : ""} writes one`,
        );
      }
      const rungs = rungsOf(baseline);
      const perJobGiB = jobEstimateGiB(rungs);
      const jobs = Math.min(options.jobs, maxJobs(machine.budgetGiB, perJobGiB, machine.cpus));
      const snapshot = SNAPSHOT_SUITES.some((entry) => entry.suite === suite);
      steps.push({ suite, kind, baseline, rungs, jobs, perJobGiB, ...(snapshot ? { snapshot: true as const } : {}) });
    }
  }
  return steps;
}

/** The command line of one check, as `bin/lvrtc.mjs` takes it. */
export function checkArgs(step: CheckStep, rootDir: string): string[] {
  return [
    "baseline",
    "check",
    step.suite,
    "--root",
    rootDir,
    ...(step.kind === "mtf" ? ["--mtf"] : []),
    "--jobs",
    String(step.jobs),
    "--json",
  ];
}

/**
 * Why the machine is not one to check the baselines on, from `lvrtc doctor --json`: empty when it is. LensVisualizer
 * must be present, loadable, a git checkout and clean, so that what is checked is a commit; optiland must answer.
 */
export function doctorRefusals(report: DoctorReport): string[] {
  const refusals: string[] = [];
  if (!report.node.ok)
    refusals.push(`Node ${report.node.version} is outside the supported range ${report.node.required}`);
  const lv = report.lensVisualizer;
  if (lv.status === "not configured") {
    refusals.push("LensVisualizer is not configured: set LVRTC_LV_PATH, or lvPath in lvrtc.local.json");
  } else if (lv.status === "missing") {
    refusals.push(`LensVisualizer is not at ${lv.path}: no LensVisualizer checkout is there`);
  } else {
    if (lv.git === null) {
      refusals.push(`LensVisualizer at ${lv.path} is not a git checkout: no commit can be named for what is checked`);
    } else if (lv.git.dirty) {
      refusals.push(
        `LensVisualizer at ${lv.path} has uncommitted changes (at ${lv.git.commit}): ` +
          "a real-engine check is of a committed LensVisualizer; commit or set aside the changes in LensVisualizer first",
      );
    }
    if (lv.binding === null || lv.binding.status !== "loaded") {
      const why = lv.binding === null ? "it was not loaded" : `${lv.binding.code}: ${lv.binding.message}`;
      refusals.push(`LensVisualizer at ${lv.path} cannot be loaded through the binding (${why})`);
    }
  }
  const optiland = report.optiland;
  if (optiland.interpreter === "not configured") {
    refusals.push(
      "optiland is not configured: set LVRTC_OPTILAND_PYTHON, or engines.optiland.python in lvrtc.local.json",
    );
  } else if (optiland.interpreter === "missing") {
    refusals.push(`optiland's interpreter ${optiland.python} does not run`);
  } else if (optiland.engine === null || optiland.engine.status !== "available") {
    const why = optiland.engine === null ? "it was not started" : `${optiland.engine.code}: ${optiland.engine.message}`;
    refusals.push(`the engine optiland cannot be used (${why})`);
  }
  return refusals;
}

/**
 * Who the engines are, from the doctor's report of a machine with no refusal: two lines, each with its hash under
 * `details` (LensVisualizer's engine files, optiland's code).
 */
export function identityLines(report: DoctorReport, details = false): string[] {
  const t = CHECK_LV_OUTPUT_TEXT;
  const i = IDENTIFIERS_TEXT;
  const lines: string[] = [];
  const { git, binding, path } = report.lensVisualizer;
  if (git !== null && binding?.status === "loaded") {
    const hash = details ? `, ${i.lvFiles} ${binding.engineClosureHash}` : "";
    lines.push(`LensVisualizer ${git.commit} (${t.clean}) at ${path}, ${binding.engineFileCount} ${t.files}${hash}`);
  }
  const engine = report.optiland.engine;
  if (engine?.status === "available") {
    const { commit, dirty } = engine.details;
    const checkout =
      commit === null || commit === undefined ? t.notGit : `${commit} (${dirty === true ? t.dirty : t.clean})`;
    const hash = details ? `, ${i.engineCode} ${engine.fingerprint}` : "";
    lines.push(`optiland ${report.optiland.version ?? t.noVersion}, ${t.checkout} ${checkout}${hash}`);
  }
  return lines;
}

/** How a child `bin/lvrtc.mjs` ended. */
export interface LvrtcEnded {
  readonly code: number | null;
  readonly signal: string | null;
  readonly stdout: string;
  /** Why it could not be started, when it could not. */
  readonly error?: string;
}

/** Runs `bin/lvrtc.mjs` with arguments and resolves when it has ended; never rejects. */
export interface VerifyRealRunner {
  lvrtc(args: readonly string[]): Promise<LvrtcEnded>;
}

/** What one check came to. */
export interface CheckOutcome {
  readonly step: CheckStep;
  /** `interrupted` is a check ended by a signal: nothing after it is run. */
  readonly status: "clean" | "not clean" | "interrupted";
  readonly records: number;
  readonly counts: Readonly<Record<string, number>> | null;
  readonly stale: Readonly<Record<string, number>> | null;
  /** Pairs that are FAIL today and are listed in docs/known-failures.json: admitted, as the check admits them. */
  readonly listedFails: number;
  /** Why the check is not clean; empty when it is. */
  readonly problems: readonly string[];
  /** What is said and fails nothing (MOVED, a suite file that is not the baseline's). */
  readonly notes: readonly string[];
}

interface CheckJson {
  readonly records: readonly { outcome: string; verdict?: string; knownFailure?: boolean }[];
  readonly counts: Record<string, number>;
  readonly stale: Record<string, number>;
  readonly errors: readonly string[];
  readonly failed: boolean;
  readonly suiteChanged?: boolean;
}

function checkJson(stdout: string): CheckJson | null {
  try {
    const said = JSON.parse(stdout) as Partial<CheckJson>;
    const ok =
      Array.isArray(said.records) &&
      typeof said.counts === "object" &&
      typeof said.stale === "object" &&
      Array.isArray(said.errors) &&
      typeof said.failed === "boolean";
    return ok ? (said as CheckJson) : null;
  } catch {
    return null;
  }
}

/**
 * The rule of a clean check: `baseline check` exited 0, said it did not fail, and every record is OK, REFRESHABLE
 * or MOVED. A DRIFT, an unlisted FAIL or ERROR, an engine that could not be used, a NEW or a GONE record (the suite
 * is not the baseline's) and a check with no record are not clean; a signal is an interruption.
 */
export function judgeCheck(step: CheckStep, ended: LvrtcEnded): CheckOutcome {
  const empty = { records: 0, counts: null, stale: null, listedFails: 0, notes: [] };
  if (ended.signal !== null) {
    return { step, status: "interrupted", ...empty, problems: [`baseline check was ended by ${ended.signal}`] };
  }
  const said = ended.code === 0 || ended.code === 1 ? checkJson(ended.stdout) : null;
  if (said === null) {
    const why =
      ended.error === undefined
        ? `baseline check exited ${ended.code} without a report: nothing was checked (its message is above)`
        : `baseline check could not be started: ${ended.error}`;
    return { step, status: "not clean", ...empty, problems: [why] };
  }
  const problems: string[] = [...said.errors];
  const failing = said.records.filter(
    (record) => (record.verdict === "FAIL" || record.verdict === "ERROR") && record.knownFailure !== true,
  ).length;
  const listedFails = said.records.filter((record) => record.verdict === "FAIL" && record.knownFailure === true).length;
  const count = (outcome: string): number => said.counts[outcome] ?? 0;
  const t = CHECK_LV_OUTPUT_TEXT;
  const records = (n: number): string => `${n} ${n === 1 ? t.record : t.records}`;
  if (count("DRIFT") > 0) problems.push(`${records(count("DRIFT"))} ${t.drift}`);
  if (failing > 0) problems.push(`${failing} ${failing === 1 ? t.failingOne : t.failing}`);
  if (count("NEW") > 0) problems.push(`${count("NEW")} ${t.newProblem}`);
  if (count("GONE") > 0) problems.push(`${count("GONE")} ${t.goneProblem}`);
  const unclean = said.records.filter((record) => !CLEAN_OUTCOMES.includes(record.outcome)).length;
  if (unclean > 0 && problems.length === 0) problems.push(`${records(unclean)} ${t.otherProblem}`);
  if (said.records.length === 0) problems.push(t.noRecords);
  if ((said.failed || ended.code !== 0) && problems.length === 0) problems.push(`${t.exited} ${ended.code}`);
  const notes: string[] = [];
  if (count("MOVED") > 0) notes.push(`${records(count("MOVED"))} ${t.moved}`);
  if (said.suiteChanged === true) notes.push(t.suiteNote);
  return {
    step,
    status: problems.length === 0 ? "clean" : "not clean",
    records: said.records.length,
    counts: said.counts,
    stale: said.stale,
    listedFails,
    problems,
    notes,
  };
}

const KIND_WIDTH = 4;

function stepName(step: CheckStep): string {
  return `${step.suite} ${step.kind.padEnd(KIND_WIDTH)}`;
}

/** "4 jobs at once". */
function jobsText(jobs: number): string {
  return `${jobs} ${jobs === 1 ? CHECK_LV_OUTPUT_TEXT.jobAtOnce : CHECK_LV_OUTPUT_TEXT.jobsAtOnce}`;
}

/**
 * The line of one set of committed results in the summary: what it came to, how many results came out as each
 * outcome (by label, those above zero), what made them out of date, the failures docs/known-failures.json lists, its
 * jobs and how long it took; then, on a line of their own, why it is not clean and what is noted.
 */
export function summaryLine(outcome: CheckOutcome, seconds: number | null): string {
  const t = CHECK_LV_OUTPUT_TEXT;
  const { step, counts, stale } = outcome;
  const parts: string[] = [];
  if (counts !== null) {
    const byOutcome = ["OK", "REFRESHABLE", "MOVED", "DRIFT", "NEW", "GONE"].map(
      (key) => [outcomeLabel(key), counts[key] ?? 0] as const,
    );
    parts.push(`${outcome.records} ${outcome.records === 1 ? t.record : t.records}: ${countsText(byOutcome)}`);
  }
  if (stale !== null) {
    const by = Object.keys(STALE_REASON_TEXT).filter((reason) => (stale[reason] ?? 0) > 0);
    if (by.length > 0) {
      parts.push(
        `${t.outOfDate}: ${by.map((reason) => `${STALE_REASON_TEXT[reason].label} ${t.changedIn} ${stale[reason]}`).join(", ")}`,
      );
    }
  }
  if (outcome.listedFails > 0) parts.push(`${outcome.listedFails} ${t.listedFails}`);
  parts.push(jobsText(step.jobs));
  if (seconds !== null) parts.push(`${seconds.toFixed(0)} s`);
  const said = [...outcome.problems, ...outcome.notes];
  return `${stepName(step)}  ${t.status[outcome.status]}  ${parts.join("; ")}${said.length > 0 ? `\n    ${said.join("; ")}` : ""}`;
}

/** What `verifyReal` is wired to. */
export interface VerifyRealInputs {
  readonly rootDir: string;
  readonly cwd: string;
  readonly io: CliIo;
  readonly runner: VerifyRealRunner;
  readonly machine?: PlanMachine;
  /** Seconds since some origin; the summary says how long each check took. */
  readonly now?: () => number;
  /** The signal the verification was asked to stop by, or null: no check is started after one. */
  readonly stopped?: () => string | null;
  /** How it names itself: `npm run verify:real` unless given (`lvrtc check-lv`). */
  readonly program?: VerifyRealProgram;
}

function doctorReportOf(stdout: string): DoctorReport | null {
  try {
    const report = JSON.parse(stdout) as Partial<DoctorReport>;
    return typeof report.node === "object" &&
      typeof report.lensVisualizer === "object" &&
      typeof report.optiland === "object"
      ? (report as DoctorReport)
      : null;
  } catch {
    return null;
  }
}

/**
 * Runs the verification: plans every check (exit 2 for a command line, suite or baseline that is not there), asks
 * `lvrtc doctor` (exit 2 on a refusal), then runs the checks one after the other, prints each one's line as it ends
 * and the summary of all, and resolves to the exit code.
 */
export async function verifyReal(args: readonly string[], inputs: VerifyRealInputs): Promise<number> {
  const { io } = inputs;
  const program = inputs.program ?? VERIFY_REAL_PROGRAM;
  const p = program.prefix;
  const now = inputs.now ?? (() => performance.now() / 1000);
  const stopped = inputs.stopped ?? (() => null);
  let steps: CheckStep[];
  let rootDir: string;
  let details = false;
  try {
    const options = parseVerifyRealArgs(args);
    if (options.help) {
      io.stdout(program.help);
      return EXIT_OK;
    }
    details = options.details === true;
    rootDir = options.root === undefined ? inputs.rootDir : resolve(inputs.cwd, options.root);
    if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
      throw new UsageError(`--root ${options.root}: not a directory`);
    }
    const machine = inputs.machine ?? { budgetGiB: defaultMemoryBudgetGiB(), cpus: availableParallelism() };
    steps = planChecks(options, rootDir, machine);
  } catch (error) {
    if (!(error instanceof UsageError)) throw error;
    io.stderr(`${p}: ${error.message}\n${program.synopsis}`);
    return EXIT_USAGE;
  }

  const t = CHECK_LV_OUTPUT_TEXT;
  io.stdout(`${p}: ${steps.length} ${steps.length === 1 ? t.set : t.sets} ${t.plan} ${rootDir}:\n`);
  for (const step of steps) {
    io.stdout(
      `  ${stepName(step)}  ${t.checks} ${step.rungs.join(", ")}  ${t.atMost} ${jobsText(step.jobs)} (${step.perJobGiB} ${t.perJob})\n`,
    );
    if (step.snapshot === true) io.stdout(`    ${step.suite}: ${SNAPSHOT_NOTE}\n`);
  }
  for (const line of legendLines({ checks: steps.flatMap((step) => step.rungs) }, 2)) io.stdout(`${line}\n`);

  const doctor = await inputs.runner.lvrtc(["doctor", "--root", rootDir, "--json"]);
  const report = doctor.signal === null ? doctorReportOf(doctor.stdout) : null;
  const refusals =
    report === null
      ? [
          `lvrtc doctor gave no report (${doctor.signal === null ? `exit ${doctor.code}` : `ended by ${doctor.signal}`}${doctor.error === undefined ? "" : `: ${doctor.error}`})`,
        ]
      : doctorRefusals(report);
  if (refusals.length > 0) {
    for (const refusal of refusals) io.stderr(`${p}: refused: ${refusal}\n`);
    io.stderr(`${p}: nothing was checked; lvrtc doctor shows the machine as it is\n`);
    return EXIT_USAGE;
  }
  for (const line of identityLines(report as DoctorReport, details)) io.stdout(`${p}: ${line}\n`);

  const outcomes: { outcome: CheckOutcome; seconds: number }[] = [];
  let halted: string | null = null;
  for (const step of steps) {
    const signal = stopped();
    if (signal !== null) {
      halted = `${t.stoppedBy} ${signal}`;
      break;
    }
    io.stdout(`${p}: ${t.checking} ${stepName(step).trimEnd()} ${t.with} ${jobsText(step.jobs)}\n`);
    const started = now();
    const ended = await inputs.runner.lvrtc(checkArgs(step, rootDir));
    const outcome = judgeCheck(step, ended);
    const seconds = now() - started;
    outcomes.push({ outcome, seconds });
    io.stdout(`${summaryLine(outcome, seconds)}\n`);
    if (outcome.status === "interrupted") {
      halted = `${stepName(step).trimEnd()} ${t.interruptedHint}`;
      break;
    }
  }

  io.stdout(`\n${p}: ${t.summary}\n`);
  for (const { outcome, seconds } of outcomes) io.stdout(`${summaryLine(outcome, seconds)}\n`);
  for (const step of steps.slice(outcomes.length)) io.stdout(`${stepName(step)}  ${t.notRun}\n`);
  const unclean = outcomes.filter(({ outcome }) => outcome.status !== "clean");
  if (halted !== null) io.stdout(`${p}: ${halted}; ${t.remaining}\n`);
  if (unclean.length === 0 && halted === null) {
    const sets = `${steps.length} ${steps.length === 1 ? t.set : t.sets}`;
    io.stdout(`${p}: ${t.status.clean}: ${t.cleanAll} ${sets} ${t.cleanMeans}\n`);
    return EXIT_OK;
  }
  const named = unclean.map(({ outcome }) => stepName(outcome.step).trimEnd());
  io.stdout(`${p}: ${t.notClean}${named.length > 0 ? `: ${named.join(", ")}` : ""}\n`);
  return EXIT_FAILURE;
}

/** The comparator's own command line. */
export const LVRTC_BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));

/**
 * A runner that starts `bin/lvrtc.mjs` under this Node, one child at a time: its standard output is collected (the
 * JSON), its standard error is handed on as it comes. `stop` sends a signal to the child that is running, if any.
 */
export function spawnLvrtcRunner(options: {
  readonly cwd: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly stderr?: (text: string) => void;
}): VerifyRealRunner & { stop(signal: NodeJS.Signals): void } {
  let active: ChildProcess | null = null;
  const stderr = options.stderr ?? ((text: string) => void process.stderr.write(text));
  return {
    lvrtc: (args) =>
      new Promise((resolveEnded) => {
        if (active !== null) throw new Error("verify:real runs one lvrtc at a time");
        const child = spawn(process.execPath, [LVRTC_BIN, ...args], {
          cwd: options.cwd,
          env: options.env ?? process.env,
          stdio: ["ignore", "pipe", "pipe"],
        });
        active = child;
        const chunks: Buffer[] = [];
        let error: string | undefined;
        child.stdout?.on("data", (chunk: Buffer) => chunks.push(chunk));
        child.stderr?.on("data", (chunk: Buffer) => stderr(chunk.toString("utf8")));
        child.on("error", (failure) => {
          error = failure.message;
        });
        child.on("close", (code, signal) => {
          active = null;
          const stdout = Buffer.concat(chunks).toString("utf8");
          resolveEnded({ code, signal, stdout, ...(error === undefined ? {} : { error }) });
        });
      }),
    stop: (signal) => {
      active?.kill(signal);
    },
  };
}

/** What signals are taken from: `process`, or a stand-in in a test. */
export interface SignalSource {
  on(event: NodeJS.Signals, listener: (signal: NodeJS.Signals) => void): unknown;
  off(event: NodeJS.Signals, listener: (signal: NodeJS.Signals) => void): unknown;
}

/** The signals verify:real is stopped by, and hands on to the check that is running. */
export const STOP_SIGNALS: readonly NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

/**
 * Listens for SIGINT and SIGTERM on `source`: each is remembered (`stopped`, the last one received) and handed on at
 * once to the check that is running (`stop`), so an interrupt ends that check promptly rather than after it, also
 * when the signal was sent to verify:real alone. A check that also had the terminal's SIGINT gets it twice; the
 * suite's controller ignores a second signal while it cleans up (`src/core/processRegistry.ts`). `dispose` stops
 * listening.
 */
export function forwardStopSignals(
  stop: (signal: NodeJS.Signals) => void,
  source: SignalSource = process,
): { stopped(): string | null; dispose(): void } {
  let signal: string | null = null;
  const onSignal = (received: NodeJS.Signals): void => {
    signal = received;
    stop(received);
  };
  for (const name of STOP_SIGNALS) source.on(name, onSignal);
  return {
    stopped: () => signal,
    dispose: () => {
      for (const name of STOP_SIGNALS) source.off(name, onSignal);
    },
  };
}

/**
 * The real-engine check on this machine, with a child `bin/lvrtc.mjs` for the doctor and for each check. SIGINT and
 * SIGTERM are handed on to the check that is running (`forwardStopSignals`); no check is started after either. The
 * one path of `npm run verify:real` and `lvrtc check-lv`, which differ only in how they name themselves.
 */
export async function verifyRealHere(
  args: readonly string[],
  options: {
    readonly io: CliIo;
    readonly program?: VerifyRealProgram;
    readonly rootDir?: string;
    readonly cwd?: string;
    readonly source?: SignalSource;
  },
): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const runner = spawnLvrtcRunner({ cwd, stderr: options.io.stderr });
  const signals = forwardStopSignals((signal) => runner.stop(signal), options.source ?? process);
  try {
    return await verifyReal(args, {
      rootDir: options.rootDir ?? REPO_ROOT,
      cwd,
      io: options.io,
      runner,
      stopped: signals.stopped,
      ...(options.program === undefined ? {} : { program: options.program }),
    });
  } finally {
    signals.dispose();
  }
}

/** `npm run verify:real` on this repository and this machine. */
export async function mainVerifyReal(args: readonly string[], source: SignalSource = process): Promise<number> {
  return verifyRealHere(args, {
    io: { stdout: (text) => void process.stdout.write(text), stderr: (text) => void process.stderr.write(text) },
    source,
  });
}
