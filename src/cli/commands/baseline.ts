import { catalogFeatures, classifyCatalog, readKnownFailures, unclassifiedFailures } from "../../baseline/catalog.ts";
import type { KnownFailure } from "../../baseline/catalog.ts";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

import {
  MTF_BASELINE,
  MTF_BASELINE_RUNGS,
  baselineText,
  baselineWriteProblems,
  buildBaseline,
  parseBaseline,
} from "../../baseline/build.ts";
import { CHECK_OUTCOMES, STALE_REASONS, checkBaseline, checkFails, summarizeChanges } from "../../baseline/check.ts";
import type { CheckRecord } from "../../baseline/check.ts";
import { baselineFile, baselineReportFiles, mtfBaselineFile, mtfBaselineReportFiles } from "../../baseline/files.ts";
import { renderMtfBaselineReport } from "../../baseline/mtfReport.ts";
import { renderBaselineReport } from "../../baseline/report.ts";
import { numberText } from "../../compare/metricText.ts";
import { COMPARISONS_FILE, comparisonFileText, readComparisonFile } from "../../compare/comparisonFile.ts";
import { followUpsOf } from "../../compare/followUp.ts";
import {
  POLICY_SNAPSHOTS,
  SNAPSHOT_BASELINE_SUITES,
  loadPolicy,
  loadPolicySnapshot,
  policySnapshotName,
} from "../../compare/policyFile.ts";
import type { Baseline } from "../../contract/baseline.ts";
import { FAILING_VERDICTS } from "../../contract/comparison.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { MANIFEST_FILE, SOURCE_CHANGED, readRunManifest } from "../../core/manifest.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { runSuite } from "../../core/orchestrator.ts";
import type { ProcessRegistry } from "../../core/processRegistry.ts";
import { RUNGS } from "../../core/rungs.ts";
import { UsageError } from "../../core/usageError.ts";
import { jobEstimateGiB } from "../../core/memoryBudget.ts";
import { reportInputProblems } from "../../report/model.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { assertJobs, jobsOption, memoryBudgetOption } from "../jobs.ts";
import { parseTargetArguments, refuseOldIds, resolveRunDirectory } from "../runTarget.ts";
import type { RunTargetInputs } from "../runTarget.ts";
import { compareRunDirectoryWithJobs } from "./compare.ts";
import { prepareSuiteRun } from "./run.ts";
import { JOBS_OPTIONS, helpText, options, paragraph, wrap } from "../help.ts";
import type { OptionRow } from "../help.ts";
import {
  BASELINE_OUTPUT_TEXT,
  IDENTIFIERS_TEXT,
  OUTCOME_TEXT,
  STALE_REASON_TEXT,
  metricLabel,
  outcomeLabel,
  reasonsText,
  verdictLabel,
  verdictShort,
  LIMIT_KIND_TEXT,
  MOVED_TEXT,
  SORTING_LIMITS,
  SORTING_LIMIT_LABEL,
} from "../../vocabulary/index.ts";
import { codeLines, columns, countsText, engineIdentifierLines, legendLines, usageErrorMeans } from "../output.ts";
import { LEGACY_IDS, currentIds, snapshotIds, snapshotPolicyIds } from "../../core/legacyIds.ts";
import type { LegacyMaps } from "../../core/legacyIds.ts";

/** What `lvrtc baseline` is wired to, injected so that tests choose it. */

/**
 * What moved in a record, as a line shows it: the words `checkBaseline` states (`--json` keeps them as they are), with
 * each verdict by its short label, lists of verdicts separated by "; " (a label may hold a comma), "— now" between
 * what was and what is, and each limit by what it is: `limit` for a tolerance, `review band` for a band, `sorting
 * limit` for a band of a metric that sorts a field (`SORTING_LIMITS`). A text of another form is returned unchanged.
 */
export function movedText(moved: string): string {
  const verdicts = (list: string): string =>
    list
      .split(", ")
      .map((each) => each.replace(/^(\d+) (\S+)$/, (_, n: string, verdict: string) => `${n} ${verdictShort(verdict)}`))
      .join("; ");
  const listed = /^verdicts were (.*), are (.*)$/.exec(moved);
  if (listed !== null) return MOVED_TEXT.verdicts(verdicts(listed[1]), verdicts(listed[2]));
  const figure = /^(\S+) was (.+), is (.+) \((tolerance|band) ([^)]+)\)$/.exec(moved);
  if (figure !== null) {
    const [, name, was, now, kind, limit] = figure;
    const called =
      kind === "tolerance"
        ? LIMIT_KIND_TEXT.tolerance
        : SORTING_LIMITS.includes(name)
          ? SORTING_LIMIT_LABEL
          : LIMIT_KIND_TEXT.attention;
    return MOVED_TEXT.figure(name, was, now, `${called} ${limit}`);
  }
  if (moved === "new, changed or unclassified catalog FAIL") return MOVED_TEXT.catalogFailure;
  return moved;
}

export interface BaselineCommandInputs extends RunTargetInputs {
  /** The policy to judge by; the comparator's own (`policy/rungs.v1.json`) unless given. */
  readonly policy?: Policy;
  /** Where the frozen policies of the snapshot baselines are; this repository's `policy/snapshots/` unless given. */
  readonly policySnapshots?: string;
}

const SYNOPSIS =
  "Usage: lvrtc baseline write <suite name | run directory> [--root <dir>] [--mtf] [--replace]\n" +
  "       lvrtc baseline check <suite name | suite.json> [--root <dir>] [--mtf] [--jobs <n>] [--memory-budget <GiB>] [--details] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "A baseline is the committed record of a suite's results: for every run, check and pair of engines, the verdict and the figures, with a hash of each lens state, the version of each engine and the limits file they were judged by. It holds no rays and no prescriptions.",
  ),
  ...options([
    [
      "check",
      "Needs the engines. Runs the suite of the baseline again on the baseline's engines and checks, asking an engine only for what the result cache does not hold, compares the answers (writing comparisons.json as lvrtc compare does), and sets every record of the baseline beside today's result. Each record comes out as one of these:",
      (column) => [
        ...Object.entries(OUTCOME_TEXT).flatMap(([outcome, text]) =>
          wrap(`${text.label} (${outcome}): ${text.meaning}`, column + 4, " ".repeat(column + 2)),
        ),
        ...wrap(
          `A record that is out of date says why: ${Object.values(STALE_REASON_TEXT)
            .map(
              (reason) => `${reason.label} (${reason.meaning.charAt(0).toLowerCase()}${reason.meaning.slice(1, -1)})`,
            )
            .join("; ")}.`,
          column,
          " ".repeat(column),
        ),
        ...wrap(
          "Then, for each check, pair and figure that is not what the baseline has, however little it moved: in how many records, and the largest change with its run. A suite name is <root>/suites/<name>.json.",
          column,
          " ".repeat(column),
        ),
      ],
    ],
    [
      "write",
      `For maintainers. Writes the baseline of a run that has been compared: <root>/baselines/<suite>.json, and the report rendered from it, <root>/reports/<suite>/rays.md and rays.json. Nothing is asked of any engine. It is refused for a run with an engine that could not be used, a run that was not started, LensVisualizer changing during the run, and a pair that is "${verdictLabel("FAIL")}" or "${verdictLabel("ERROR")}"; the catalog alone admits a failure listed exactly in docs/known-failures.json, keeping it as a failure with its class.`,
    ],
  ]),
  ...options([
    ["--root <dir>", "the directory that holds lvrtc.config.json, baselines/ and reports/ (default: this repository)"],
    [
      "--mtf",
      `the MTF baseline of the suite, <root>/baselines/<suite>.mtf.json, with its reports mtf.md and mtf.json: the MTF checks ${MTF_BASELINE_RUNGS.join(", ")} of the run, each figure with the number of requests it was measured in, and the engines' own MTF as they were compared. Without it, the rays baseline: <suite>.json, rays.md and rays.json, every check of the run`,
    ],
    ...JOBS_OPTIONS.map(([name, description]): OptionRow => [name, `check: ${description}`]),
    [
      "--replace",
      "write: write the baseline although the one that is there has a check this run lacks. Without it such a run is refused: a run directory holds the last run of its suite, which may have run other checks (those of the other kind of baseline, or those lvrtc run --checks named)",
    ],
    ["--details", `check: ${IDENTIFIERS_TEXT.option}`],
    ["--json", "check: print the records as one JSON object in place of the lines"],
  ]),
  ...paragraph(
    `Exit code: write: 0 when the baseline was written; 1 when a pair is "${verdictLabel("FAIL")}" or "${verdictLabel("ERROR")}"; 2 when the run cannot be a baseline. check: 0 when no record is "${outcomeLabel("DRIFT")}" (DRIFT) and no pair that docs/known-failures.json does not list fails or is an error today, out of date or not; 1 otherwise; 2 when nothing was checked.`,
  ),
]);

function rootOf(root: string | undefined, inputs: RunTargetInputs): string {
  const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
  if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
    throw new UsageError(`--root ${root}: not a directory`);
  }
  return rootDir;
}

/**
 * Writes a baseline and its two report files under a root, and returns the three paths: the rays baseline with
 * `rays.md` and `rays.json`, or, with `mtf`, the MTF baseline with `mtf.md` and `mtf.json`.
 */
export function writeBaselineFiles(rootDir: string, baseline: Baseline, mtf = false): string[] {
  const text = baselineText(baseline);
  const read = parseBaseline(text);
  if ("problems" in read) throw new Error(`the baseline is not one that can be read back: ${read.problems.join("; ")}`);
  const { name } = baseline.suite;
  const reports = mtf ? mtfBaselineReportFiles(rootDir, name) : baselineReportFiles(rootDir, name);
  const rendered = mtf ? renderMtfBaselineReport(baseline) : renderBaselineReport(baseline);
  const file = mtf ? mtfBaselineFile(rootDir, name) : baselineFile(rootDir, name);
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
  const asked = parseTargetArguments(args, ["--root"], ["--mtf", "--replace"]);
  const mtf = asked.flags.has("--mtf");
  const rootDir = rootOf(asked.values.get("--root"), inputs);
  const directory = resolveRunDirectory(asked.target, asked.values.get("--root"), inputs);
  const manifest = readRunManifest(directory);
  const comparisons = readComparisonFile(directory);
  refuseOldIds(directory, manifest, comparisons, inputs.legacy);
  const policy = inputs.policy ?? loadPolicy();
  const stale = reportInputProblems(manifest, comparisons, policy);
  if (stale.length > 0) throw new UsageError(`${directory}: ${stale.join("; ")}; run lvrtc compare again`);
  const problems = baselineWriteProblems(manifest);
  if (problems.length > 0)
    throw new UsageError(`${directory}: no baseline is written of this run: ${problems.join("; ")}`);
  const raw = catalogFeatures(buildBaseline(manifest, comparisons, policy, mtf ? MTF_BASELINE : {}), directory);
  const baseline = classifyCatalog(raw, raw.suite.name === "catalog" ? readKnownFailures(rootDir) : []);
  if (mtf && baseline.runs.every((run) => run.rungs.length === 0)) {
    throw new UsageError(
      `${directory}: no MTF baseline is written of this run: it has none of the MTF checks ${MTF_BASELINE_RUNGS.join(", ")}`,
    );
  }
  const failing = unclassifiedFailures(baseline);
  if (failing.length > 0) {
    for (const line of failing) io.stderr(`lvrtc baseline: ${line}\n`);
    io.stderr(
      (baseline.suite.name === "catalog"
        ? `lvrtc baseline: no baseline is written with a "${verdictShort("FAIL")}" that docs/known-failures.json does not list as it is, or any "${verdictShort("ERROR")}": `
        : `lvrtc baseline: no baseline is written of a run with a pair that is "${verdictShort("FAIL")}" or "${verdictShort("ERROR")}": `) +
        "a baseline holds what " +
        "the engines agreed on; lvrtc compare names each pair and its reason\n",
    );
    return EXIT_FAILURE;
  }
  // The run directory of a suite is of its last run, which may be the run of other rungs: a baseline is not
  // replaced by one that has lost a rung unless that is asked for.
  const target = mtf ? mtfBaselineFile(rootDir, baseline.suite.name) : baselineFile(rootDir, baseline.suite.name);
  const before = existsSync(target) ? parseBaseline(readFileSync(target, "utf8")) : undefined;
  if (before !== undefined && "baseline" in before && !asked.flags.has("--replace")) {
    const rungsOf = (each: Baseline): string[] => [
      ...new Set(each.runs.flatMap((run) => run.rungs.map(({ rung }) => rung))),
    ];
    const has = rungsOf(baseline);
    // The baseline written before may name a check by an id it had before it was renamed: the same check.
    const lost = rungsOf(currentIds(before.baseline, inputs.legacy ?? LEGACY_IDS)).filter(
      (rung) => !has.includes(rung),
    );
    if (lost.length > 0) {
      throw new UsageError(
        `${directory}: the run has no check ${lost.join(", ")}, which ${target} has: it is the run of other checks. ` +
          `Run the suite on the checks of the baseline first (lvrtc baseline check ${baseline.suite.name}${mtf ? " --mtf" : ""} does), ` +
          "or write it all the same with --replace",
      );
    }
  }
  const records = baseline.runs.reduce((sum, run) => sum + run.rungs.reduce((n, rung) => n + rung.pairs.length, 0), 0);
  const [file, markdown, json] = writeBaselineFiles(rootDir, baseline, mtf);
  const t = BASELINE_OUTPUT_TEXT;
  const engines = baseline.engines.map((engine) => engine.id);
  io.stdout(
    `${baseline.suite.name}: ${baseline.runs.length} ${baseline.runs.length === 1 ? t.run : t.runs}, ${records} ${records === 1 ? t.record : t.records}; ${t.engines} ${engines.join(", ")}; ${t.limitsFile} v${baseline.policy.version}\n` +
      [file, markdown, json].map((path) => `${t.wrote} ${path}\n`).join(""),
  );
  if (SNAPSHOT_BASELINE_SUITES.includes(baseline.suite.name)) {
    // A snapshot is held by lvrtc verify to the frozen copy of the policy it records, never to a later policy.
    const frozen = loadPolicySnapshot(baseline.policy, inputs.policySnapshots ?? POLICY_SNAPSHOTS);
    const name = policySnapshotName(baseline.policy.version);
    io.stdout(
      `${baseline.suite.name} ${t.snapshot} v${baseline.policy.version}; ${t.heldTo} ` +
        ("policy" in frozen
          ? `${name}\n`
          : `${name}, ${t.notFrozen}: cp policy/rungs.v1.json ${name}, and commit it with the baseline\n`),
    );
  }
  return EXIT_OK;
}

/**
 * What the states there are among the records mean, for anyone, and what a maintainer does about each: two lists of
 * lines.
 */
function nextSteps(
  suite: string,
  records: readonly CheckRecord[],
  failing: boolean,
  mtf: boolean,
): { means: string[]; maintainers: string[] } {
  const t = BASELINE_OUTPUT_TEXT;
  const name = mtf ? `${suite} --mtf` : suite;
  const fill = (text: string): string => text.replace("<suite>", suite).replace("<name>", name);
  const has = (outcome: string): boolean => records.some((record) => record.outcome === outcome);
  const means: string[] = [];
  const maintainers: string[] = [];
  const step = (meaning: string, advice?: string): void => {
    means.push(meaning);
    if (advice !== undefined) maintainers.push(fill(advice));
  };
  if (has("DRIFT")) step(t.means.DRIFT, t.maintainers.DRIFT);
  if (has("MOVED")) step(t.means.MOVED, t.maintainers.MOVED);
  if (failing) step(t.means.failing, t.maintainers.failing);
  if (has("REFRESHABLE")) step(t.means.REFRESHABLE, t.maintainers.REFRESHABLE);
  if (has("NEW") || has("GONE")) step(t.means.newOrGone, t.maintainers.newOrGone);
  if (means.length === 0) step(t.means.OK);
  return { means, maintainers };
}

/** A record's outcome by its label, with what made it out of date: "Out of date, still within limits (engine code changed)". */
function stateLabel(record: CheckRecord): string {
  const label = outcomeLabel(record.outcome);
  return record.stale.length === 0 ? label : `${label} (${reasonsText(record.stale)} changed)`;
}

async function check(
  args: readonly string[],
  inputs: BaselineCommandInputs,
  io: Parameters<CliCommand["run"]>[1],
): Promise<number> {
  const asked = parseTargetArguments(args, ["--root", "--jobs", "--memory-budget"], ["--json", "--mtf", "--details"]);
  const memoryBudgetGiB = memoryBudgetOption(asked.values.get("--memory-budget"));
  const jobs = jobsOption(asked.values.get("--jobs"), memoryBudgetGiB);
  const mtf = asked.flags.has("--mtf");
  const root = asked.values.get("--root");
  const rootDir = rootOf(root, inputs);
  const { target } = asked;
  const isFile = isAbsolute(target) || /[\\/]/.test(target) || target.endsWith(".json");
  const suiteFile = isFile ? resolve(inputs.cwd, target) : join(rootDir, "suites", `${target}.json`);
  if (!existsSync(suiteFile)) throw new UsageError(`${suiteFile}: no suite file is there`);
  const prepared = await prepareSuiteRun(inputs, suiteFile, root, jobs, memoryBudgetGiB, []);
  try {
    const { suite, loaded } = prepared;

    const file = mtf ? mtfBaselineFile(rootDir, suite.name) : baselineFile(rootDir, suite.name);
    let text: string;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      throw new UsageError(
        `${file}: the suite ${suite.name} has no ${mtf ? "MTF " : ""}baseline; lvrtc baseline write ${suite.name}${mtf ? " --mtf" : ""} writes one`,
      );
    }
    const read = parseBaseline(text);
    if ("problems" in read) throw new UsageError(`${file}: not a baseline: ${read.problems.join("; ")}`);
    const maps = inputs.legacy ?? LEGACY_IDS;
    // What the suite is run on again is named by the ids of today, whatever ids the baseline was written with.
    const named = currentIds(read.baseline, maps);
    const policy = inputs.policy ?? loadPolicy();

    const rungs: string[] = [];
    for (const run of named.runs) for (const { rung } of run.rungs) if (!rungs.includes(rung)) rungs.push(rung);
    assertJobs(jobs, memoryBudgetGiB, jobEstimateGiB(rungs));
    const result = await runSuite({
      suite,
      registry: prepared.registry,
      jobs,
      runsDir: loaded.config.runsDir,
      sources: prepared.sources,
      engines: runEngines(named),
      rungs,
      followUps: followUpsOf(policy),
    });
    const directory = dirname(result.manifestPath);
    const comparisons = await compareRunDirectoryWithJobs(directory, policy, jobs);
    writeFileAtomic(join(directory, COMPARISONS_FILE), comparisonFileText(comparisons));
    const { manifest } = result;
    const built = catalogFeatures(buildBaseline(manifest, comparisons, policy, mtf ? MTF_BASELINE : {}), directory);
    const known = built.suite.name === "catalog" ? readKnownFailures(rootDir) : [];
    const { committed, records } = checkInIdSpace(read.baseline, built, known, policy, maps);
    const changes = summarizeChanges(records);

    // What kept the suite from running as the baseline's did: each is an error of the check, whatever the records say.
    // `errors` is what --json states, as it always has; the lines also say what a code means.
    const shownErrors: { readonly text: string; readonly code: string | null; readonly engine?: string }[] = [];
    for (const engine of manifest.engines) {
      if (engine.status !== "available")
        shownErrors.push({
          text: `engine ${engine.id} could not be used (${engine.code})`,
          code: engine.code,
          engine: engine.id,
        });
    }
    for (const run of manifest.runs)
      if (run.caseId === null && run.problems.length === 0)
        shownErrors.push({ text: `run ${run.name} was not started`, code: null });
    if (Object.values(manifest.sources ?? {}).some((source) => source.status === SOURCE_CHANGED)) {
      shownErrors.push({ text: "LensVisualizer's files changed while the suite ran: run the check again", code: null });
    }
    const errors = shownErrors.map((error) => error.text);
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
      const said = { suite: suite.name, records, counts, stale: staleCounts, changes, suiteChanged, errors, failed };
      io.stdout(`${JSON.stringify(JSON.parse(canonicalJson(said)), null, 2)}\n`);
      return failed ? EXIT_FAILURE : EXIT_OK;
    }
    const t = BASELINE_OUTPUT_TEXT;
    const shown = records.filter(
      (record) =>
        record.outcome !== "OK" || (record.verdict !== undefined && FAILING_VERDICTS.includes(record.verdict)),
    );
    const legend = legendLines({
      checks: [...shown.map((record) => record.rung), ...changes.map((change) => change.rung)],
      engines: [...shown, ...changes].flatMap((each) => [each.a, each.b]).sort(),
    });
    const rows = shown.map((record) => [
      record.run,
      record.rung,
      record.a,
      record.b,
      stateLabel(record),
      record.verdict === undefined ? "" : verdictShort(record.verdict),
      record.moved.map(movedText).join(MOVED_TEXT.separator),
    ]);
    for (const line of [...legend, ...columns(rows)]) io.stdout(`${line}\n`);
    for (const error of shownErrors) {
      io.stderr(
        [`lvrtc baseline: ${t.error}: ${error.text}`, ...codeLines(error.code, 4, error.engine)]
          .map((line) => `${line}\n`)
          .join(""),
      );
    }
    if (suiteChanged) io.stdout(`${suite.name}: ${t.suiteChanged}\n`);
    io.stdout(
      `${suite.name}: ${records.length} ${records.length === 1 ? t.record : t.records}: ${countsText(CHECK_OUTCOMES.map((outcome) => [outcomeLabel(outcome), counts[outcome]]))}\n`,
    );
    const staleBy = STALE_REASONS.filter((reason) => staleCounts[reason] > 0);
    if (staleBy.length > 0) {
      const said = staleBy.map((reason) => `${STALE_REASON_TEXT[reason].label} ${t.changedIn} ${staleCounts[reason]}`);
      const many = staleBy.length > 1 || staleCounts[staleBy[0]] !== 1;
      io.stdout(`${suite.name}: ${t.outOfDate}: ${said.join(", ")} ${many ? t.records : t.record}\n`);
    }
    if (changes.length > 0) {
      io.stdout(`${t.changes}\n`);
      for (const change of changes) {
        const size = change.largest === null ? t.notANumber : numberText(change.largest);
        io.stdout(
          `  ${change.rung}  ${change.a} ${change.b}  ${metricLabel(change.name)} (${change.name}): ${change.records} ${t.of} ${change.of} ${change.of === 1 ? t.record : t.records}, ${t.atMost} ${size} (${change.run})\n`,
        );
      }
    }
    const steps = nextSteps(suite.name, records, failingToday, mtf);
    io.stdout(`${t.meansTitle}\n${steps.means.map((line) => `  ${line}\n`).join("")}`);
    if (steps.maintainers.length > 0)
      io.stdout(`${t.maintainersTitle}\n${steps.maintainers.map((line) => `  ${line}\n`).join("")}`);
    io.stdout(`${t.runRecord}: ${join(directory, MANIFEST_FILE)}\n`);
    if (asked.flags.has("--details")) {
      const i = IDENTIFIERS_TEXT;
      io.stdout(
        [
          `${i.title}:`,
          `  ${i.suite} ${i.committed} ${committed.suite.hash}, ${i.today} ${manifest.suite.hash}`,
          `  ${i.committed}:`,
          ...engineIdentifierLines(committed.engines, 4),
          `  ${i.today}:`,
          ...engineIdentifierLines(manifest.engines, 4),
          "",
        ].join("\n"),
      );
    }
    return failed ? EXIT_FAILURE : EXIT_OK;
  } finally {
    await (prepared.registry as Partial<ProcessRegistry>).close?.();
  }
}

/**
 * The records of a committed baseline against the baseline of today's run (`built`, not yet classified), each in the
 * id space they can be held in together. A dated snapshot (`SNAPSHOT_BASELINE_SUITES`, the catalog) stays as written,
 * and today's baseline is read back under the ids the snapshot and its known failures were written with
 * (`snapshotIds`) before it is classified (`classifyCatalog`) and checked: a listed FAIL is then the same FAIL, its
 * evidence hashed over the same pair, and judged by the limits of the policy at hand under those ids
 * (`snapshotPolicyIds`). A snapshot already written under the ids of today (one written since the rename, as the
 * end-of-project refresh writes it) names no old id and is held to today's run as it is. Any other baseline is read
 * under the ids of today (`currentIds`). Returns the two baselines as held and the records. A pure function.
 */
export function checkInIdSpace(
  file: Baseline,
  built: Baseline,
  known: readonly KnownFailure[],
  policy: Policy,
  maps: LegacyMaps = LEGACY_IDS,
): { readonly committed: Baseline; readonly fresh: Baseline; readonly records: CheckRecord[] } {
  const snapshot = SNAPSHOT_BASELINE_SUITES.includes(file.suite.name);
  // A snapshot written before the rename: it names an old id, so reading it under today's ids would change it.
  const before = snapshot && currentIds(file, maps) !== file;
  const committed = snapshot ? file : currentIds(file, maps);
  const fresh = classifyCatalog(before ? snapshotIds(built, maps) : built, known);
  return {
    committed,
    fresh,
    records: checkBaseline(committed, fresh, before ? snapshotPolicyIds(policy, maps) : policy),
  };
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
 * that is not `OK` is printed as a line, then the counts, then every figure that is not what the baseline has
 * (`summarizeChanges`), then what to do about each state there is. With `--mtf` both actions are of the suite's MTF
 * baseline (`MTF_BASELINE`, `<suite>.mtf.json`, `mtf.md`, `mtf.json`), which is written, checked and reported
 * without the rays baseline.
 *
 * Exit codes: as the help says; 2, with nothing written, for a command line that is not the synopsis, a `--root`
 * that is not a directory, a run that has no manifest or no comparisons, comparisons of another manifest or
 * policy, a run that cannot be a baseline, a suite file that is not there or is no suite, and a suite without a
 * baseline or with one that cannot be read.
 */
export function createBaselineCommand(inputs: BaselineCommandInputs): CliCommand {
  return {
    name: "baseline",
    summary: "Check a suite's committed results against the engines, or write them anew",
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
        io.stderr(`lvrtc baseline: ${error.message}\n${usageErrorMeans(error)}${SYNOPSIS}`);
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
