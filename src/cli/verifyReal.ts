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
  "Usage: npm run verify:real -- [--all | --suite <name> | --suites <a,b,...>] [--jobs <n>] [--root <dir>]\n";
const HELP = [
  SYNOPSIS,
  "Holds the committed baselines to the live LensVisualizer and optiland, one check at a time. First",
  "lvrtc doctor: it refuses (exit 2) when LensVisualizer or optiland is not usable, or when LensVisualizer's",
  "checkout is dirty or not a git checkout. Then lvrtc baseline check <suite> and lvrtc baseline check <suite>",
  "--mtf, each in a process of its own, never two at once: the benchmark, or with --all every committed suite",
  `in this order: ${VERIFY_REAL_SUITES.map(({ suite }) => suite).join(", ")}. The catalog's baselines are`,
  "a dated snapshot, not refreshed until the project's end: --all leaves them out, --suite catalog checks them.",
  "Each check computes what the configured store does not hold, so a cold store takes long.",
  "",
  "  --all             every committed suite of the routine check, in that order (not the catalog)",
  "  --suite <name>    this suite alone, with the kinds of baseline it has (rays, then MTF)",
  "  --suites <names>  these suites, in this order: each with the kinds of baseline it has",
  `  --jobs <n>        the most jobs a check is given (default ${DEFAULT_VERIFY_JOBS}); a check is given fewer when the`,
  "                    default memory budget holds fewer of its rungs' jobs (two with R6c on a 48 GB machine)",
  "  --root <dir>      the directory that holds lvrtc.config.json, suites/ and baselines/ (default: this repository)",
  "",
  "Exit code: 0 when every record of every check is OK, REFRESHABLE or MOVED (MOVED, of a recorded rung, is",
  "reported and fails nothing), with no unlisted FAIL or ERROR and no engine that could not be used; 1 otherwise,",
  "or when a check was interrupted (the remaining checks are not run); 2 when nothing was checked.",
  "Nothing is written into baselines/ or reports/.",
  "",
].join("\n");

/** What the command line asks for. `suites` null is the default, the benchmark. */
export interface VerifyRealOptions {
  readonly help: boolean;
  readonly suites: readonly string[] | null;
  readonly all: boolean;
  readonly jobs: number;
  readonly root: string | undefined;
}

const SUITE_NAME = /^[a-z0-9][a-z0-9._-]*$/;

/** Reads the command line; a `UsageError` for anything that is not the synopsis. */
export function parseVerifyRealArgs(args: readonly string[]): VerifyRealOptions {
  let all = false;
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
  return { help: false, suites, all, jobs: jobs ?? DEFAULT_VERIFY_JOBS, root };
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

/** The rungs a baseline file has, in the order it first names them. */
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
    for (const { rung } of run.rungs ?? []) if (typeof rung === "string" && !rungs.includes(rung)) rungs.push(rung);
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
    refusals.push("LensVisualizer is not configured: set LVRTC_LV_PATH, or lvPath in lvrtc.config.json");
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
      "optiland is not configured: set LVRTC_OPTILAND_PYTHON, or engines.optiland.python in lvrtc.config.json",
    );
  } else if (optiland.interpreter === "missing") {
    refusals.push(`optiland's interpreter ${optiland.python} does not run`);
  } else if (optiland.engine === null || optiland.engine.status !== "available") {
    const why = optiland.engine === null ? "it was not started" : `${optiland.engine.code}: ${optiland.engine.message}`;
    refusals.push(`the engine optiland cannot be used (${why})`);
  }
  return refusals;
}

/** Who the engines are, from the doctor's report of a machine with no refusal: two lines. */
export function identityLines(report: DoctorReport): string[] {
  const lines: string[] = [];
  const { git, binding, path } = report.lensVisualizer;
  if (git !== null && binding?.status === "loaded") {
    lines.push(
      `LensVisualizer ${git.commit} (clean) at ${path}, engine closure ${binding.engineClosureHash} (${binding.engineFileCount} files)`,
    );
  }
  const engine = report.optiland.engine;
  if (engine?.status === "available") {
    const { commit, dirty } = engine.details;
    const checkout =
      commit === null || commit === undefined
        ? "not a git checkout"
        : `${commit} (${dirty === true ? "dirty" : "clean"})`;
    lines.push(
      `optiland ${report.optiland.version ?? "(no version)"}, fingerprint ${engine.fingerprint}, checkout ${checkout}`,
    );
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
  if (count("DRIFT") > 0) problems.push(`${count("DRIFT")} DRIFT`);
  if (failing > 0) problems.push(`${failing} pair${failing === 1 ? "" : "s"} FAIL or ERROR today and not listed`);
  for (const outcome of ["NEW", "GONE"]) {
    if (count(outcome) > 0) problems.push(`${count(outcome)} ${outcome}: the suite is not the baseline's`);
  }
  const unclean = said.records.filter((record) => !CLEAN_OUTCOMES.includes(record.outcome)).length;
  if (unclean > 0 && problems.length === 0) problems.push(`${unclean} records neither OK, REFRESHABLE nor MOVED`);
  if (said.records.length === 0) problems.push("no record was checked");
  if ((said.failed || ended.code !== 0) && problems.length === 0) problems.push(`baseline check exited ${ended.code}`);
  const notes: string[] = [];
  if (count("MOVED") > 0) notes.push(`${count("MOVED")} MOVED, of a recorded rung: fails nothing`);
  if (said.suiteChanged === true) notes.push("the suite file is not the one the baseline names");
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

/** The line of one check in the summary: what it came to, its counts, its jobs and how long it took. */
export function summaryLine(outcome: CheckOutcome, seconds: number | null): string {
  const { step, counts, stale } = outcome;
  const parts: string[] = [];
  if (counts !== null) {
    parts.push(
      `${outcome.records} records: ${["OK", "REFRESHABLE", "MOVED", "DRIFT", "NEW", "GONE"].map((key) => `${counts[key] ?? 0} ${key}`).join(", ")}`,
    );
  }
  if (stale !== null) {
    parts.push(`stale by case ${stale.case ?? 0}, engine ${stale.engine ?? 0}, policy ${stale.policy ?? 0}`);
  }
  if (outcome.listedFails > 0) parts.push(`${outcome.listedFails} listed FAIL (docs/known-failures.json)`);
  parts.push(`--jobs ${step.jobs}`);
  if (seconds !== null) parts.push(`${seconds.toFixed(0)} s`);
  const said = [...outcome.problems, ...outcome.notes];
  return `${stepName(step)}  ${outcome.status.toUpperCase()}  ${parts.join("; ")}${said.length > 0 ? `\n    ${said.join("; ")}` : ""}`;
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
  const now = inputs.now ?? (() => performance.now() / 1000);
  const stopped = inputs.stopped ?? (() => null);
  let steps: CheckStep[];
  let rootDir: string;
  try {
    const options = parseVerifyRealArgs(args);
    if (options.help) {
      io.stdout(HELP);
      return EXIT_OK;
    }
    rootDir = options.root === undefined ? inputs.rootDir : resolve(inputs.cwd, options.root);
    if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
      throw new UsageError(`--root ${options.root}: not a directory`);
    }
    const machine = inputs.machine ?? { budgetGiB: defaultMemoryBudgetGiB(), cpus: availableParallelism() };
    steps = planChecks(options, rootDir, machine);
  } catch (error) {
    if (!(error instanceof UsageError)) throw error;
    io.stderr(`verify:real: ${error.message}\n${SYNOPSIS}`);
    return EXIT_USAGE;
  }

  io.stdout(`verify:real: ${steps.length} check${steps.length === 1 ? "" : "s"}, one at a time, of ${rootDir}:\n`);
  for (const step of steps) {
    io.stdout(
      `  ${stepName(step)}  rungs ${step.rungs.join(",")}  --jobs ${step.jobs} (${step.perJobGiB} GiB a job)\n`,
    );
    if (step.snapshot === true) io.stdout(`    ${step.suite}: ${SNAPSHOT_NOTE}\n`);
  }

  const doctor = await inputs.runner.lvrtc(["doctor", "--root", rootDir, "--json"]);
  const report = doctor.signal === null ? doctorReportOf(doctor.stdout) : null;
  const refusals =
    report === null
      ? [
          `lvrtc doctor gave no report (${doctor.signal === null ? `exit ${doctor.code}` : `ended by ${doctor.signal}`}${doctor.error === undefined ? "" : `: ${doctor.error}`})`,
        ]
      : doctorRefusals(report);
  if (refusals.length > 0) {
    for (const refusal of refusals) io.stderr(`verify:real: refused: ${refusal}\n`);
    io.stderr("verify:real: nothing was checked; lvrtc doctor shows the machine as it is\n");
    return EXIT_USAGE;
  }
  for (const line of identityLines(report as DoctorReport)) io.stdout(`verify:real: ${line}\n`);

  const outcomes: { outcome: CheckOutcome; seconds: number }[] = [];
  let halted: string | null = null;
  for (const step of steps) {
    const signal = stopped();
    if (signal !== null) {
      halted = `stopped by ${signal}`;
      break;
    }
    io.stdout(`verify:real: checking ${stepName(step).trimEnd()} with --jobs ${step.jobs}\n`);
    const started = now();
    const ended = await inputs.runner.lvrtc(checkArgs(step, rootDir));
    const outcome = judgeCheck(step, ended);
    const seconds = now() - started;
    outcomes.push({ outcome, seconds });
    io.stdout(`${summaryLine(outcome, seconds)}\n`);
    if (outcome.status === "interrupted") {
      halted = `${stepName(step).trimEnd()} was interrupted; if the memory watchdog ended it, run again with fewer --jobs`;
      break;
    }
  }

  io.stdout("\nverify:real: summary\n");
  for (const { outcome, seconds } of outcomes) io.stdout(`${summaryLine(outcome, seconds)}\n`);
  for (const step of steps.slice(outcomes.length)) io.stdout(`${stepName(step)}  NOT RUN\n`);
  const unclean = outcomes.filter(({ outcome }) => outcome.status !== "clean");
  if (halted !== null) io.stdout(`verify:real: ${halted}; the remaining checks were not run\n`);
  if (unclean.length === 0 && halted === null) {
    io.stdout(`verify:real: clean: every record of ${steps.length} checks is OK, REFRESHABLE or MOVED\n`);
    return EXIT_OK;
  }
  const named = unclean.map(({ outcome }) => stepName(outcome.step).trimEnd());
  io.stdout(`verify:real: not clean${named.length > 0 ? `: ${named.join(", ")}` : ""}\n`);
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

/**
 * `npm run verify:real` on this repository and this machine. SIGTERM is handed on to the check that is running; a
 * SIGINT from the terminal reaches it already. No check is started after either.
 */
export async function mainVerifyReal(args: readonly string[]): Promise<number> {
  const runner = spawnLvrtcRunner({ cwd: process.cwd() });
  let signal: string | null = null;
  const onSignal = (received: NodeJS.Signals): void => {
    signal = received;
    if (received === "SIGTERM") runner.stop(received);
  };
  process.on("SIGINT", onSignal);
  process.on("SIGTERM", onSignal);
  try {
    return await verifyReal(args, {
      rootDir: REPO_ROOT,
      cwd: process.cwd(),
      io: { stdout: (text) => void process.stdout.write(text), stderr: (text) => void process.stderr.write(text) },
      runner,
      stopped: () => signal,
    });
  } finally {
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
  }
}
