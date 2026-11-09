import { statSync } from "node:fs";
import { resolve } from "node:path";

import { followUpsOf } from "../../compare/followUp.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import type { Policy } from "../../contract/policy.ts";
import type { ResultStatus } from "../../contract/result.ts";
import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import type { LoadedConfig } from "../../core/config.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { SOURCE_CHANGED } from "../../core/manifest.ts";
import { runSuite } from "../../core/orchestrator.ts";
import type { JobOutcome, JobSource, SuiteRunResult } from "../../core/orchestrator.ts";
import { createProcessRegistry } from "../../core/processRegistry.ts";
import { RUNGS } from "../../core/rungs.ts";
import { createFixtureCaseSource, loadSuite } from "../../core/suite.ts";
import type { CaseSources, LoadedSuite } from "../../core/suite.ts";
import { UsageError } from "../../core/usageError.ts";
import { createLvCaseSource } from "../../engines/lv/caseSource.ts";
import { createEngineRegistry } from "../../engines/registry.ts";
import type { EngineRegistry } from "../../engines/registry.ts";
import { assertJobs, jobsOption, memoryBudgetOption, suiteJobEstimate } from "../jobs.ts";
import { parseArguments } from "../arguments.ts";
import { JOBS_OPTIONS, ROOT_OPTION, checkListLines, engineListLines, helpText, options, paragraph } from "../help.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

/** What `lvrtc run` is wired to, injected so that tests choose all three. */
export interface RunCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that the suite file and `--root` are relative to. */
  readonly cwd: string;
  /** The policy the follow-ups of a rung are decided by (`followUpsOf`); the committed one unless given. */
  readonly policy?: Policy;
}

const SYNOPSIS =
  "Usage: lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--checks <id,...>] [--jobs <n>] [--memory-budget <GiB>] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "Runs a suite: every run of the suite file on each of its engines, asking an engine only for what the result cache (the store directory under the runs directory) does not already hold. It writes a run record of the suite, the lens states and the jobs into <runsDir>/<suite name>/, where lvrtc compare and lvrtc report read it. A run that names a LensVisualizer lens has its lens state exported from the configured LensVisualizer checkout (lvPath).",
  ),
  ...paragraph(
    "A LensVisualizer zoom lens run without a zoom position (state.zoomT) is run at both ends, as two runs: <name>-wide at zoom 0 and <name>-tele at zoom 1. A run that states a position is that one state.",
  ),
  ...options([
    ROOT_OPTION,
    [
      "--engines <ids>",
      "the engines of every run, in place of the run's own list and of every configured engine. A built-in engine is run only where it is named; the built-in engines are:",
      (column) => engineListLines(column + 2),
    ],
    [
      "--checks <ids>",
      "the checks of every run, in place of the run's own list (--rungs is the older spelling of this option). Without it every check runs but those run only where named. A check asked of engines of its own is asked of them whatever --engines names. lvrtc checks <id> says what each compares. The checks are:",
      (column) => checkListLines(column + 2),
    ],
    ...JOBS_OPTIONS,
    ["--json", "print one JSON object in place of the lines"],
  ]),
  ...paragraph(
    "Exit code: 0 when no job ended in an error (an engine that answers that it does not compute something has answered, and has not failed), every run could be started and LensVisualizer did not change during the run; 1 otherwise; 2 when nothing was run because the suite file, an engine or a check cannot be used as asked. A field that has no rays is reported and fails nothing.",
  ),
]);

const STATUSES: readonly ResultStatus[] = ["ok", "unsupported", "error", "pending"];
const SOURCES: readonly JobSource[] = ["computed", "cached", "negotiated", "unavailable"];
const VALUE_OPTIONS = ["--root", "--engines", "--checks", "--rungs", "--jobs", "--memory-budget"] as const;
type ValueOption = (typeof VALUE_OPTIONS)[number];

/** The command line of `lvrtc run`, read. */
interface RunArguments {
  readonly suite: string;
  readonly root: string | undefined;
  readonly engines: readonly string[] | undefined;
  readonly rungs: readonly string[] | undefined;
  readonly jobs: number;
  readonly memoryBudgetGiB: number;
  readonly json: boolean;
}

/** Reads the arguments. Throws a `UsageError` for anything that is not the command line the synopsis shows. */
function readArguments(args: readonly string[]): RunArguments {
  const { positionals: files, values, flags } = parseArguments(args, VALUE_OPTIONS, ["--json"]);
  if (files.length === 0) throw new UsageError("no suite file was named");
  if (files.length > 1) throw new UsageError(`more than one suite file was named: ${files.join(", ")}`);

  const list = (option: ValueOption): string[] | undefined => {
    const ids = values.get(option)?.split(",");
    if (ids?.includes("")) throw new UsageError(`${option} needs ids separated by commas, got "${values.get(option)}"`);
    return ids;
  };
  if (values.has("--checks") && values.has("--rungs")) {
    throw new UsageError("--checks and --rungs are two spellings of one option: give one of them");
  }
  const memoryBudgetGiB = memoryBudgetOption(values.get("--memory-budget"));
  return {
    suite: files[0],
    root: values.get("--root"),
    engines: list("--engines"),
    rungs: list("--checks") ?? list("--rungs"),
    jobs: jobsOption(values.get("--jobs"), memoryBudgetGiB),
    memoryBudgetGiB,
    json: flags.has("--json"),
  };
}

/** A suite ready to be run on a configuration root: what `runSuite` is given. */
export interface PreparedSuiteRun {
  readonly loaded: LoadedConfig;
  readonly registry: EngineRegistry;
  readonly sources: CaseSources;
  readonly suite: LoadedSuite;
}

/**
 * Loads the configuration of a root (`root` when given, relative to `inputs.cwd`, else `inputs.rootDir`), makes its
 * engine registry and its case sources (fixture lenses from the root, LensVisualizer lenses from `lvPath`), and
 * loads the suite file, relative to `inputs.cwd`. Throws a `UsageError` for a `root` that is not a directory and
 * for a file that is not a suite.
 */
export async function prepareSuiteRun(
  inputs: RunCommandInputs,
  suiteFile: string,
  root: string | undefined,
  jobs = 1,
  memoryBudgetGiB = memoryBudgetOption(undefined),
  rungs?: readonly string[],
): Promise<PreparedSuiteRun> {
  const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
  if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
    throw new UsageError(`--root ${root}: not a directory`);
  }
  const loaded = loadConfig({ rootDir, env: inputs.env });
  assertJobs(jobs, memoryBudgetGiB, suiteJobEstimate(resolve(inputs.cwd, suiteFile), rungs));
  const pool = jobs > 1 ? createProcessRegistry(loaded, jobs, { memoryBudgetGiB }) : undefined;
  const registry = pool ?? createEngineRegistry(loaded);
  const sources: CaseSources = pool?.sources ?? {
    fixture: createFixtureCaseSource(loaded.rootDir),
    lv: createLvCaseSource(loaded.config.lvPath),
  };
  try {
    const suite = await loadSuite(resolve(inputs.cwd, suiteFile), { rootDir: loaded.rootDir, sources, jobs });
    return { loaded, registry, sources, suite };
  } catch (error) {
    await pool?.close();
    throw error;
  }
}

/** One line per job: run, rung, engine, status and how the status was come by, in columns; then what went wrong. */
function jobLine(outcome: JobOutcome, widths: readonly number[]): string {
  const { job, source, detail } = outcome;
  const engine = job.step === undefined ? job.engine : `${job.engine} +${job.step}`;
  const cells = [job.run, job.rung, engine, job.status, source].map((cell, column) => cell.padEnd(widths[column]));
  const said = job.error === undefined ? detail : `${job.error.code}: ${detail ?? ""}`;
  return `${[...cells, ...(said === null ? [] : [said])].join("  ").trimEnd()}\n`;
}

/** How many of `values` are each of `keys`. */
function countBy<K extends string>(keys: readonly K[], values: readonly K[]): Record<K, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;
  for (const value of values) counts[value]++;
  return counts;
}

/** How many jobs ended in each status, and how many came by their status in each way. */
function countsOf(outcomes: readonly JobOutcome[]): {
  status: Record<ResultStatus, number>;
  source: Record<JobSource, number>;
} {
  const statuses = outcomes.map((outcome) => outcome.job.status);
  const sources = outcomes.map((outcome) => outcome.source);
  return { status: countBy(STATUSES, statuses), source: countBy(SOURCES, sources) };
}

/** The closing lines of the text output. */
function summaryText(suite: LoadedSuite, result: SuiteRunResult): string {
  const { status, source } = countsOf(result.outcomes);
  const jobs = result.outcomes.length;
  const byStatus = STATUSES.map((name) => `${status[name]} ${name}`).join(", ");
  const bySource = `${source.computed} computed, ${source.cached} cached`;
  return [
    `${suite.name}: ${jobs} ${jobs === 1 ? "job" : "jobs"}: ${byStatus} (${bySource})`,
    `manifest: ${result.manifestPath}`,
    "",
  ].join("\n");
}

/** Everything the run did as one JSON object with sorted keys. It is console output: it may hold absolute paths. */
function jsonText(result: SuiteRunResult): string {
  const { manifest, manifestPath, outcomes, warnings } = result;
  const report = {
    suite: manifest.suite,
    manifest: manifestPath,
    sources: manifest.sources ?? {},
    engines: manifest.engines,
    runs: manifest.runs,
    jobs: outcomes.map(({ job, source, detail }) => ({ ...job, source, detail })),
    counts: { jobs: outcomes.length, ...countsOf(outcomes) },
    warnings,
  };
  // Canonical JSON sorts the keys at every depth; parsing it keeps that order for the indented text.
  return `${JSON.stringify(JSON.parse(canonicalJson(report)), null, 2)}\n`;
}

/**
 * Builds `lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--jobs <n>] [--memory-budget <GiB>] [--json]`.
 *
 * It loads the configuration of the root, loads the suite and runs it (`runSuite`), with every engine the
 * configuration defines unless a run or `--engines` names others; a built-in engine, `lv` or `ref`, is run only
 * where it is named. A fixture lens is read from the root; a LensVisualizer lens is exported from the checkout the
 * configuration names (`lvPath`), which is loaded only when a run asks for one or the engine `lv` is run, and the
 * two share the one binding. A run of a LensVisualizer zoom that states no zoom position is two runs, one for each
 * end, by the rule of that case source (`CaseSource.expand`). A run of a rung that traces rays (`r2`, `r3`, `r4`)
 * has its ray sets generated by the source of its case. Each job is printed as it finishes, as a line of run, rung, engine,
 * status and "computed", "cached", "negotiated" or "unavailable", and a summary follows; with `--json` one object is
 * printed in their place. Which jobs were cached is said only here, never in the manifest. A run that could not be
 * started, a field that has no rays, and a warning, go to the error stream.
 *
 * Exit codes: 0 when no job ended as "error", every run was started ("unsupported" is an answer) and no case source
 * changed during the run, whether or not every field had rays; 1 otherwise; 2, with nothing run, for a command line
 * that is not the synopsis, a `--root` that is not a directory, a suite file that is not a suite, an unknown engine
 * or rung, and no engine at all. A configuration file that cannot be used is an error like any other, as for
 * `lvrtc doctor`.
 */
export function createRunCommand(inputs: RunCommandInputs): CliCommand {
  return {
    name: "run",
    summary: "Run a suite on its engines, reusing answers already in the result cache",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let asked: RunArguments;
      try {
        asked = readArguments(args);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc run: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }

      let suite: LoadedSuite;
      let result: SuiteRunResult;
      try {
        const prepared = await prepareSuiteRun(
          inputs,
          asked.suite,
          asked.root,
          asked.jobs,
          asked.memoryBudgetGiB,
          asked.rungs,
        );
        suite = prepared.suite;
        const { registry } = prepared;

        const widths = [
          Math.max(0, ...suite.runs.map((run) => run.spec.name.length)),
          Math.max(0, ...RUNGS.map((rung) => rung.id.length)),
          Math.max(0, ...[...registry.ids(), ...registry.builtinIds()].map((id) => id.length)),
          Math.max(...STATUSES.map((status) => status.length)),
          Math.max(...SOURCES.map((source) => source.length)),
        ];
        result = await runSuite({
          suite,
          registry: registry,
          jobs: asked.jobs,
          runsDir: prepared.loaded.config.runsDir,
          sources: prepared.sources,
          engines: asked.engines,
          rungs: asked.rungs,
          followUps: followUpsOf(inputs.policy ?? loadPolicy()),
          onJob: asked.json ? undefined : (outcome) => io.stdout(jobLine(outcome, widths)),
        });
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc run: ${error.message}\n`);
        return EXIT_USAGE;
      }

      const notStarted = result.manifest.runs.filter((run) => run.caseId === null);
      for (const run of notStarted) {
        for (const problem of run.problems) io.stderr(`lvrtc run: run ${run.name} was not started: ${problem}\n`);
      }
      for (const run of result.manifest.runs) {
        for (const problem of run.raySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: a field has no rays: ${problem}\n`);
        }
        for (const problem of run.fineRaySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: a field has no rays on the finer lattice: ${problem}\n`);
        }
        for (const problem of run.spotRaySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: a spot or fan has no rays: ${problem}\n`);
        }
        for (const problem of run.axialRaySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: the axial tabs have no rays: ${problem}\n`);
        }
        for (const problem of run.chiefRaySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: a chief-ray tab has no rays: ${problem}\n`);
        }
        for (const problem of run.curvatureRaySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: the field curves have no rays: ${problem}\n`);
        }
        for (const problem of run.vignettingRaySets?.problems ?? []) {
          io.stderr(`lvrtc run: run ${run.name}: the vignetting sets: ${problem}\n`);
        }
      }
      for (const warning of result.warnings) io.stderr(`lvrtc run: warning: ${warning}\n`);
      io.stdout(asked.json ? jsonText(result) : summaryText(suite, result));

      const failed = result.outcomes.some((outcome) => outcome.job.status === "error");
      const changed = Object.values(result.manifest.sources ?? {}).some((source) => source.status === SOURCE_CHANGED);
      const refusedOnly = notStarted.every(
        (run) =>
          run.problems.length > 0 &&
          run.problems.every((problem) => problem.startsWith("finite-conjugate-unavailable: ")),
      );
      return failed || changed || !refusedOnly ? EXIT_FAILURE : EXIT_OK;
    },
  };
}

/** `lvrtc run` wired to this repository, the process environment and the directory the process was started in. */
export const runCommand: CliCommand = createRunCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
