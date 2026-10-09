import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

import { baselineText, baselineWriteProblems, buildBaseline, parseBaseline } from "../../baseline/build.ts";
import { CHECK_OUTCOMES, STALE_REASONS, checkBaseline, checkFails, stateText } from "../../baseline/check.ts";
import type { CheckRecord } from "../../baseline/check.ts";
import { baselineFile, baselineReportFiles } from "../../baseline/files.ts";
import { renderBaselineReport } from "../../baseline/report.ts";
import { COMPARISONS_FILE, comparisonFileText, readComparisonFile } from "../../compare/comparisonFile.ts";
import { followUpsOf } from "../../compare/followUp.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import type { Baseline } from "../../contract/baseline.ts";
import { FAILING_VERDICTS } from "../../contract/comparison.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { MANIFEST_FILE, SOURCE_CHANGED, readRunManifest } from "../../core/manifest.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { runSuite } from "../../core/orchestrator.ts";
import { RUNGS } from "../../core/rungs.ts";
import { UsageError } from "../../core/usageError.ts";
import { reportInputProblems } from "../../report/model.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { parseTargetArguments, resolveRunDirectory } from "../runTarget.ts";
import type { RunTargetInputs } from "../runTarget.ts";
import { compareRunDirectory } from "./compare.ts";
import { prepareSuiteRun } from "./run.ts";

/** What `lvrtc baseline` is wired to, injected so that tests choose it. */
export interface BaselineCommandInputs extends RunTargetInputs {
  /** The policy to judge by; the comparator's own (`policy/rungs.v1.json`) unless given. */
  readonly policy?: Policy;
}

const SYNOPSIS =
  "Usage: lvrtc baseline write <suite name | run directory> [--root <dir>]\n" +
  "       lvrtc baseline check <suite name | suite.json> [--root <dir>] [--json]\n";
const HELP = [
  SYNOPSIS,
  "write   Writes the baseline of a run that has been compared: <root>/baselines/<suite>.json, and the report that",
  "        is rendered from it, <root>/reports/<suite>/rays.md and rays.json. A baseline holds, for every run as",
  "        it was run, every rung and every pair of engines, the verdict, the metrics and the counts, with the",
  "        hash of the run's case, each engine's fingerprint and adapter revision, and the policy. Nothing is",
  "        asked of any engine. It is refused for a run with an engine that could not be used, a run that was not",
  "        started, a case source that changed during the run, and a pair that is FAIL or ERROR.",
  "check   Needs the engines. Runs the suite of the baseline again on the baseline's engines and rungs, asking an",
  "        engine only for what the result store does not hold, compares it (comparisons.json is written as lvrtc",
  "        compare writes it), and sets every record of the baseline against it:",
  "          OK                        same case, same engines, same policy, and what it was",
  "          STALE(case) REFRESHABLE   LensVisualizer now exports another case for the run; the verdicts are the",
  "                                    same and no judged metric moved by more than its tolerance",
  "          STALE(engine) REFRESHABLE an engine's fingerprint or adapter revision is another; likewise",
  "          DRIFT                     a verdict changed, or a judged metric moved by more than its tolerance",
  "          NEW, GONE                 the suite has a record the baseline lacks, or lacks one it has",
  "        A suite name is <root>/suites/<name>.json.",
  "",
  "  --root <dir>  the directory that holds lvrtc.config.json, baselines/ and reports/ (default: this repository)",
  "  --json        check: print the records as one JSON object in place of the lines",
  "",
  "Exit code: write: 0 when the baseline was written; 1 when a pair is FAIL or ERROR; 2 when the run cannot be a",
  "baseline. check: 0 when no record is DRIFT and no pair is FAIL or ERROR today, STALE or not; 1 otherwise; 2",
  "when nothing was checked.",
  "",
].join("\n");

function rootOf(root: string | undefined, inputs: RunTargetInputs): string {
  const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
  if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
    throw new UsageError(`--root ${root}: not a directory`);
  }
  return rootDir;
}

/** Writes a baseline and its two report files under a root, and returns the three paths. */
export function writeBaselineFiles(rootDir: string, baseline: Baseline): string[] {
  const text = baselineText(baseline);
  const read = parseBaseline(text);
  if ("problems" in read) throw new Error(`the baseline is not one that can be read back: ${read.problems.join("; ")}`);
  const reports = baselineReportFiles(rootDir, baseline.suite.name);
  const rendered = renderBaselineReport(baseline);
  const file = baselineFile(rootDir, baseline.suite.name);
  writeFileAtomic(file, text);
  writeFileAtomic(reports.markdown, rendered.markdown);
  writeFileAtomic(reports.json, rendered.json);
  return [file, reports.markdown, reports.json];
}

async function write(
  args: readonly string[],
  inputs: BaselineCommandInputs,
  io: Parameters<CliCommand["run"]>[1],
): Promise<number> {
  const asked = parseTargetArguments(args, ["--root"], []);
  const rootDir = rootOf(asked.values.get("--root"), inputs);
  const directory = resolveRunDirectory(asked.target, asked.values.get("--root"), inputs);
  const manifest = readRunManifest(directory);
  const comparisons = readComparisonFile(directory);
  const policy = inputs.policy ?? loadPolicy();
  const stale = reportInputProblems(manifest, comparisons, policy);
  if (stale.length > 0) throw new UsageError(`${directory}: ${stale.join("; ")}; run lvrtc compare again`);
  const problems = baselineWriteProblems(manifest);
  if (problems.length > 0)
    throw new UsageError(`${directory}: no baseline is written of this run: ${problems.join("; ")}`);
  const baseline = buildBaseline(manifest, comparisons, policy);
  const failing = baseline.runs.flatMap((run) =>
    run.rungs.flatMap((rung) =>
      rung.pairs
        .filter((pair) => FAILING_VERDICTS.includes(pair.verdict))
        .map((pair) => `${run.name} ${rung.rung} ${pair.a} ${pair.b} ${pair.verdict}`),
    ),
  );
  if (failing.length > 0) {
    for (const line of failing) io.stderr(`lvrtc baseline: ${line}\n`);
    io.stderr(
      "lvrtc baseline: no baseline is written of a run with a pair that is FAIL or ERROR: a baseline records what " +
        "the engines agreed on; lvrtc compare names each pair and its reason\n",
    );
    return EXIT_FAILURE;
  }
  const records = baseline.runs.reduce((sum, run) => sum + run.rungs.reduce((n, rung) => n + rung.pairs.length, 0), 0);
  const [file, markdown, json] = writeBaselineFiles(rootDir, baseline);
  io.stdout(
    `${baseline.suite.name}: ${baseline.runs.length} runs, ${records} records, engines ${baseline.engines.map((engine) => engine.id).join(", ")}, policy v${baseline.policy.version}\n` +
      `baseline: ${file}\nreport: ${markdown}\nreport: ${json}\n`,
  );
  return EXIT_OK;
}

/** What to do about each state there is among the records, one line each. */
function nextSteps(name: string, records: readonly CheckRecord[], failing: boolean): string[] {
  const has = (outcome: string): boolean => records.some((record) => record.outcome === outcome);
  const steps: string[] = [];
  if (has("DRIFT")) {
    steps.push(
      `DRIFT: a verdict changed or a judged metric moved by more than its tolerance. Do not write the baseline anew before the cause is known: lvrtc report ${name} shows the run as it is now, and docs/gotchas.md classifies the causes that are known.`,
    );
  }
  if (failing) steps.push(`FAIL or ERROR today: lvrtc compare ${name} names each pair and its reason.`);
  if (has("REFRESHABLE")) {
    steps.push(
      `REFRESHABLE: the baseline is of another case, engine or policy, and what it records still holds. To record it as it is now: lvrtc baseline write ${name}, then commit baselines/ and reports/.`,
    );
  }
  if (has("NEW") || has("GONE")) {
    steps.push(
      `NEW or GONE: the suite, its engines or its rungs are not those of the baseline. lvrtc baseline write ${name} records the suite as it is.`,
    );
  }
  if (steps.length === 0) steps.push("OK: the baseline is of the cases, engines and policy at hand. Nothing to do.");
  return steps;
}

async function check(
  args: readonly string[],
  inputs: BaselineCommandInputs,
  io: Parameters<CliCommand["run"]>[1],
): Promise<number> {
  const asked = parseTargetArguments(args, ["--root"], ["--json"]);
  const root = asked.values.get("--root");
  const rootDir = rootOf(root, inputs);
  const { target } = asked;
  const isFile = isAbsolute(target) || /[\\/]/.test(target) || target.endsWith(".json");
  const suiteFile = isFile ? resolve(inputs.cwd, target) : join(rootDir, "suites", `${target}.json`);
  if (!existsSync(suiteFile)) throw new UsageError(`${suiteFile}: no suite file is there`);
  const prepared = await prepareSuiteRun(inputs, suiteFile, root);
  const { suite, loaded } = prepared;

  const file = baselineFile(rootDir, suite.name);
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    throw new UsageError(
      `${file}: the suite ${suite.name} has no baseline; lvrtc baseline write ${suite.name} writes one`,
    );
  }
  const read = parseBaseline(text);
  if ("problems" in read) throw new UsageError(`${file}: not a baseline: ${read.problems.join("; ")}`);
  const committed = read.baseline;
  const policy = inputs.policy ?? loadPolicy();

  const rungs: string[] = [];
  for (const run of committed.runs) for (const { rung } of run.rungs) if (!rungs.includes(rung)) rungs.push(rung);
  const result = await runSuite({
    suite,
    registry: prepared.registry,
    runsDir: loaded.config.runsDir,
    sources: prepared.sources,
    engines: runEngines(committed),
    rungs,
    followUps: followUpsOf(policy),
  });
  const directory = dirname(result.manifestPath);
  const comparisons = compareRunDirectory(directory, policy);
  writeFileAtomic(join(directory, COMPARISONS_FILE), comparisonFileText(comparisons));
  const { manifest } = result;
  const fresh = buildBaseline(manifest, comparisons, policy);
  const records = checkBaseline(committed, fresh, policy);

  // What kept the suite from running as the baseline's did: each is an error of the check, whatever the records say.
  const errors: string[] = [];
  for (const engine of manifest.engines) {
    if (engine.status !== "available") errors.push(`engine ${engine.id} could not be used (${engine.code})`);
  }
  for (const run of manifest.runs) if (run.caseId === null) errors.push(`run ${run.name} was not started`);
  if (Object.values(manifest.sources ?? {}).some((source) => source.status === SOURCE_CHANGED)) {
    errors.push("LensVisualizer's files changed while the suite ran: run the check again");
  }
  const failingToday = records.some(
    (record) => record.verdict !== undefined && FAILING_VERDICTS.includes(record.verdict),
  );
  const failed = checkFails(records) || errors.length > 0;

  const counts = Object.fromEntries(
    CHECK_OUTCOMES.map((outcome) => [outcome, records.filter((record) => record.outcome === outcome).length]),
  );
  const staleCounts = Object.fromEntries(
    STALE_REASONS.map((reason) => [reason, records.filter((record) => record.stale.includes(reason)).length]),
  );
  const suiteChanged = committed.suite.hash !== manifest.suite.hash;
  if (asked.flags.has("--json")) {
    const said = { suite: suite.name, records, counts, stale: staleCounts, suiteChanged, errors, failed };
    io.stdout(`${JSON.stringify(JSON.parse(canonicalJson(said)), null, 2)}\n`);
    return failed ? EXIT_FAILURE : EXIT_OK;
  }
  const shown = records.filter(
    (record) => record.outcome !== "OK" || (record.verdict !== undefined && FAILING_VERDICTS.includes(record.verdict)),
  );
  const rows = shown.map((record) => [
    record.run,
    record.rung,
    record.a,
    record.b,
    stateText(record),
    record.verdict ?? "",
    record.moved.join("; "),
  ]);
  const widths = rows.reduce<number[]>(
    (most, row) => row.map((cell, column) => Math.max(most[column] ?? 0, cell.length)),
    [],
  );
  for (const row of rows) {
    io.stdout(
      `${row
        .map((cell, column) => cell.padEnd(widths[column]))
        .join("  ")
        .trimEnd()}\n`,
    );
  }
  for (const error of errors) io.stderr(`lvrtc baseline: ERROR: ${error}\n`);
  if (suiteChanged)
    io.stdout(`${suite.name}: the suite file is not the one the baseline names (its hash is another)\n`);
  io.stdout(
    `${suite.name}: ${records.length} records: ${CHECK_OUTCOMES.map((outcome) => `${counts[outcome]} ${outcome}`).join(", ")}; ` +
      `stale by ${STALE_REASONS.map((reason) => `${reason} ${staleCounts[reason]}`).join(", by ")}\n`,
  );
  for (const step of nextSteps(suite.name, records, failingToday)) io.stdout(`${step}\n`);
  io.stdout(`run: ${join(directory, MANIFEST_FILE)}\n`);
  return failed ? EXIT_FAILURE : EXIT_OK;
}

/**
 * The engines a baseline's suite is run on again: those the baseline names for a rung that compares the engines
 * of a run. A rung that is about engines of its own (`RungDefinition.engines`) asks those itself, whatever a run
 * names, so an engine that only such a rung has (the replay, for `r4f`) is named for no other rung, and no rung is
 * asked of an engine it was never asked of. A baseline of such rungs alone names every engine it has.
 */
function runEngines(baseline: Baseline): string[] {
  const own = new Set(RUNGS.filter((rung) => rung.engines !== undefined).map((rung) => rung.id));
  const shared = new Set(
    baseline.runs.flatMap((run) =>
      run.rungs.filter(({ rung }) => !own.has(rung)).flatMap(({ support }) => support.map(({ engine }) => engine)),
    ),
  );
  const ids = baseline.engines.map((engine) => engine.id);
  return shared.size === 0 ? ids : ids.filter((id) => shared.has(id));
}

/**
 * Builds `lvrtc baseline write <suite name | run directory> [--root <dir>]` and `lvrtc baseline check <suite name |
 * suite.json> [--root <dir>] [--json]`.
 *
 * `write` reads a run directory that has been compared (`resolveRunDirectory`, `readComparisonFile`) and writes
 * its baseline (`buildBaseline`) to `<root>/baselines/<suite>.json` with the report rendered from it
 * (`renderBaselineReport`) under `<root>/reports/<suite>/`. The three files hold no time, no path and nothing of
 * the machine: the same run, comparisons and policy give the same bytes anywhere.
 *
 * `check` loads the suite, runs it on the engines and rungs of its baseline (`runSuite`, into the configured runs
 * directory, with the result store answering whatever has not changed; `runEngines` says which engines the run is
 * handed), compares it and writes `comparisons.json`
 * as `lvrtc compare` does, and sets the baseline against the baseline of that run (`checkBaseline`). Every record
 * that is not `OK` is printed as a line, then the counts, then what to do about each state there is.
 *
 * Exit codes: as the help says; 2, with nothing written, for a command line that is not the synopsis, a `--root`
 * that is not a directory, a run that has no manifest or no comparisons, comparisons of another manifest or
 * policy, a run that cannot be a baseline, a suite file that is not there or is no suite, and a suite without a
 * baseline or with one that cannot be read.
 */
export function createBaselineCommand(inputs: BaselineCommandInputs): CliCommand {
  return {
    name: "baseline",
    summary: "Write the baseline of a compared run, or check a baseline against the engines",
    run: async (args, io) => {
      if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      const [action, ...rest] = args;
      try {
        if (action === "write") return await write(rest, inputs, io);
        if (action === "check") return await check(rest, inputs, io);
        throw new UsageError(`unknown action "${action}": the actions are write and check`);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc baseline: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
    },
  };
}

/** `lvrtc baseline` wired to this repository, the process environment and the directory the process was started in. */
export const baselineCommand: CliCommand = createBaselineCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
