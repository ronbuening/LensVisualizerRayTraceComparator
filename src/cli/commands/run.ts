import { statSync } from "node:fs";
import { resolve } from "node:path";

import type { ResultStatus } from "../../contract/result.ts";
import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { SOURCE_CHANGED } from "../../core/manifest.ts";
import { runSuite } from "../../core/orchestrator.ts";
import type { JobOutcome, JobSource, SuiteRunResult } from "../../core/orchestrator.ts";
import { RUNGS } from "../../core/rungs.ts";
import { createFixtureCaseSource, loadSuite } from "../../core/suite.ts";
import type { CaseSources, LoadedSuite } from "../../core/suite.ts";
import { UsageError } from "../../core/usageError.ts";
import { createLvCaseSource } from "../../engines/lv/caseSource.ts";
import { createEngineRegistry } from "../../engines/registry.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

/** What `lvrtc run` is wired to, injected so that tests choose all three. */
export interface RunCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that the suite file and `--root` are relative to. */
  readonly cwd: string;
}

const SYNOPSIS = "Usage: lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]\n";
const HELP = [
  SYNOPSIS,
  "Runs every run of the suite on each selected engine, asking an engine only for what the result store does not",
  "hold, and writes <runsDir>/<suite name>/manifest.json with the cases beside it. A run that names a",
  "LensVisualizer lens has its case built from the configured checkout (lvPath).",
  "",
  "  --root <dir>     the directory that holds lvrtc.config.json (default: this repository)",
  "  --engines <ids>  engines for every run, in place of the run's own list and of every configured engine",
  "  --rungs <ids>    rungs for every run, in place of the run's own list and of every rung",
  "  --json           print one JSON object in place of the lines",
  "",
  "Exit code: 0 when no job ended as an error (unsupported is an answer, not a failure), every run could be",
  "started and LensVisualizer did not change under the run; 1 otherwise; 2 when nothing was run because the suite",
  "file, an engine or a rung cannot be used as asked.",
  "",
].join("\n");

const STATUSES: readonly ResultStatus[] = ["ok", "unsupported", "error", "pending"];
const SOURCES: readonly JobSource[] = ["computed", "cached", "negotiated", "unavailable"];
const VALUE_OPTIONS = ["--root", "--engines", "--rungs"] as const;
type ValueOption = (typeof VALUE_OPTIONS)[number];

/** The command line of `lvrtc run`, read. */
interface RunArguments {
  readonly suite: string;
  readonly root: string | undefined;
  readonly engines: readonly string[] | undefined;
  readonly rungs: readonly string[] | undefined;
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
  return {
    suite: files[0],
    root: values.get("--root"),
    engines: list("--engines"),
    rungs: list("--rungs"),
    json: flags.has("--json"),
  };
}

/** One line per job: run, rung, engine, status and how the status was come by, in columns; then what went wrong. */
function jobLine(outcome: JobOutcome, widths: readonly number[]): string {
  const { job, source, detail } = outcome;
  const cells = [job.run, job.rung, job.engine, job.status, source].map((cell, column) => cell.padEnd(widths[column]));
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
 * Builds `lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]`.
 *
 * It loads the configuration of the root, loads the suite and runs it (`runSuite`), with every engine the
 * configuration defines unless a run or `--engines` names fewer. A fixture lens is read from the root; a
 * LensVisualizer lens is exported from the checkout the configuration names (`lvPath`), which is loaded only when
 * a run asks for one. Each job is printed as it finishes, as a line of run, rung, engine, status and "computed",
 * "cached", "negotiated" or "unavailable", and a summary follows; with `--json` one object is printed in their
 * place. Which jobs were cached is said only here, never in the manifest. A run that could not be started, and a
 * warning, go to the error stream.
 *
 * Exit codes: 0 when no job ended as "error", every run was started ("unsupported" is an answer) and no case source
 * changed during the run; 1 otherwise; 2, with nothing run, for a command line that is not the synopsis, a `--root`
 * that is not a directory, a suite file that is not a suite, an unknown engine or rung, and no engine at all. A
 * configuration file that cannot be used is an error like any other, as for `lvrtc doctor`.
 */
export function createRunCommand(inputs: RunCommandInputs): CliCommand {
  return {
    name: "run",
    summary: "Run a suite on the configured engines, reusing stored results",
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
        const rootDir = asked.root === undefined ? inputs.rootDir : resolve(inputs.cwd, asked.root);
        if (asked.root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${asked.root}: not a directory`);
        }
        const loaded = loadConfig({ rootDir, env: inputs.env });
        const registry = createEngineRegistry(loaded);
        const sources: CaseSources = {
          fixture: createFixtureCaseSource(loaded.rootDir),
          lv: createLvCaseSource(loaded.config.lvPath),
        };
        suite = await loadSuite(resolve(inputs.cwd, asked.suite), { rootDir: loaded.rootDir, sources });

        const widths = [
          Math.max(0, ...suite.runs.map((run) => run.spec.name.length)),
          Math.max(0, ...RUNGS.map((rung) => rung.id.length)),
          Math.max(0, ...registry.ids().map((id) => id.length)),
          Math.max(...STATUSES.map((status) => status.length)),
          Math.max(...SOURCES.map((source) => source.length)),
        ];
        result = await runSuite({
          suite,
          registry,
          runsDir: loaded.config.runsDir,
          sources,
          engines: asked.engines,
          rungs: asked.rungs,
          onJob: asked.json ? undefined : (outcome) => io.stdout(jobLine(outcome, widths)),
        });
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc run: ${error.message}\n`);
        return EXIT_USAGE;
      }

      const notStarted = suite.runs.filter((run) => run.opticalCase === null);
      for (const run of notStarted) {
        for (const problem of run.problems) io.stderr(`lvrtc run: run ${run.spec.name} was not started: ${problem}\n`);
      }
      for (const warning of result.warnings) io.stderr(`lvrtc run: warning: ${warning}\n`);
      io.stdout(asked.json ? jsonText(result) : summaryText(suite, result));

      const failed = result.outcomes.some((outcome) => outcome.job.status === "error");
      const changed = Object.values(result.manifest.sources ?? {}).some((source) => source.status === SOURCE_CHANGED);
      return failed || changed || notStarted.length > 0 ? EXIT_FAILURE : EXIT_OK;
    },
  };
}

/** `lvrtc run` wired to this repository, the process environment and the directory the process was started in. */
export const runCommand: CliCommand = createRunCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
