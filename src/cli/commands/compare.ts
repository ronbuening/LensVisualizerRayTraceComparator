import { dirname, join } from "node:path";

import { COMPARISONS_FILE, comparisonFileText } from "../../compare/comparisonFile.ts";
import type { ComparisonFile } from "../../compare/comparisonFile.ts";
import { compareDirectoryParallel } from "../../compare/parallel.ts";
import { compareManifest } from "../../compare/manifest.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import { COMPARISON_MODES, FAILING_VERDICTS, VERDICTS } from "../../contract/comparison.ts";
import type { OpticalCase } from "../../contract/case.ts";
import type { ComparisonMode } from "../../contract/comparison.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { readRunCase, readRunManifest } from "../../core/manifest.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { STORE_DIRECTORY, createResultStore } from "../../core/resultStore.ts";
import { profileAsync } from "../../core/profile.ts";
import { UsageError } from "../../core/usageError.ts";
import { aliasEngineId } from "../../core/legacyIds.ts";
import { jobsOption, memoryBudgetOption } from "../jobs.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { parseTargetArguments, refuseOldIds, resolveRunDirectory } from "../runTarget.ts";
import type { RunTargetInputs } from "../runTarget.ts";
import { helpText, options, paragraph } from "../help.ts";
import { COMPARE_OUTPUT_TEXT, verdictLabel, verdictShort, modeLabel } from "../../vocabulary/index.ts";
import { columns, countsText, legendLines, usageErrorMeans } from "../output.ts";

/** What `lvrtc compare` is wired to, injected so that tests choose it. */
export interface CompareCommandInputs extends RunTargetInputs {
  /** The policy to judge by; the comparator's own (`policy/rungs.v1.json`) unless given. */
  readonly policy?: Policy;
}

const SYNOPSIS =
  "Usage: lvrtc compare <suite name | run directory> [--root <dir>] [--reference <engine>]\n" +
  "                     [--mode reference-vs-each|pairwise|both] [--jobs <n>] [--memory-budget <GiB>] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "Compares the answers of a run's engines, request by request, and gives each pair of engines a verdict by the limits file of each check. It reads the run record and lens states that lvrtc run wrote, and the answers in the result cache, and writes comparisons.json into the run directory. No engine is asked anything.",
  ),
  ...paragraph(
    "A check held to a limit gives each pair a pass or a fail; a side-by-side check sets the two answers beside each other, marks a difference outside its review band as worth a look, and fails nothing. lvrtc glossary explains each verdict.",
  ),
  ...options([
    [
      "--root <dir>",
      "the directory that holds lvrtc.config.json, whose runs directory a suite name is looked up in (default: this repository)",
    ],
    [
      "--reference <engine>",
      'the engine every other is compared against (default: each run\'s referenceEngine, else the first engine, by id, that has an "ok" answer)',
    ],
    ["--mode <mode>", "reference-vs-each, pairwise or both (default: both)"],
    ["--jobs <n>", "how many runs are compared at once, in threads (default 1: one after another)"],
    [
      "--memory-budget <GiB>",
      "the memory the comparisons may use together (default: a quarter of the installed memory, less 2 GiB); a comparison is counted as 2.5 GiB (it starts no engine)",
    ],
    ["--json", "print the comparisons as one JSON object in place of the lines"],
  ]),
  ...paragraph(
    `Exit code: 0 when no pair is "${verdictLabel("FAIL")}" or "${verdictLabel("ERROR")}" (side-by-side verdicts and answers an engine did not compute fail nothing); 1 otherwise; 2 when nothing was compared because the run has no run record or the reference is not an engine of the run.`,
  ),
]);

const MODE_CHOICES: Readonly<Record<string, readonly ComparisonMode[]>> = {
  "reference-vs-each": ["reference-vs-each"],
  pairwise: ["pairwise"],
  both: COMPARISON_MODES,
};

/**
 * The legend of the check and engine ids and of the ways pairs are formed; then one line per pair, in columns: run,
 * check, how the pair was formed, the two engines, the verdict and its reason (the comparison's own words); then the
 * counts, by verdict.
 */
function linesText(file: ComparisonFile): string {
  const pairs = file.comparisons.flatMap((set) => set.pairs.map((pair) => ({ set, pair })));
  const rows = pairs.map(({ set, pair }) => [
    set.run,
    set.rung,
    modeLabel(set.mode),
    pair.a,
    pair.b,
    verdictShort(pair.verdict),
    pair.reason ?? "",
  ]);
  const legend = legendLines({
    checks: file.comparisons.map((set) => set.rung),
    engines: pairs.flatMap(({ pair }) => [pair.a, pair.b]).sort(),
    modes: file.comparisons.map((set) => set.mode),
    references: file.comparisons.flatMap((set) => (set.reference === undefined ? [] : [set.reference])),
  });
  const counts = countsText(
    VERDICTS.map((verdict) => [verdictShort(verdict), pairs.filter(({ pair }) => pair.verdict === verdict).length]),
  );
  const t = COMPARE_OUTPUT_TEXT;
  return [
    ...legend,
    ...columns(rows),
    `${file.suite}: ${rows.length} ${rows.length === 1 ? t.pair : t.pairs}: ${counts}`,
    "",
  ].join("\n");
}

/**
 * The comparisons of the run directory `directory`, judged by `policy` (`compareManifest`): the manifest and the
 * cases are read from the directory, each answer from the store beside it. Nothing is written. Throws as
 * `readRunManifest` and `compareManifest` do.
 */
export function compareRunDirectory(
  directory: string,
  policy: Policy,
  options: { readonly reference?: string; readonly modes?: readonly ComparisonMode[] } = {},
): ComparisonFile {
  const cases = new Map<string, OpticalCase | undefined>();
  return compareManifest({
    manifest: readRunManifest(directory),
    store: createResultStore(join(dirname(directory), STORE_DIRECTORY)),
    policy,
    reference: options.reference,
    modes: options.modes,
    cases: (caseId) => {
      if (!cases.has(caseId)) cases.set(caseId, readRunCase(directory, caseId));
      return cases.get(caseId);
    },
  });
}

/** The same comparisons, with isolated runs scheduled in parallel when asked. */
export async function compareRunDirectoryWithJobs(
  directory: string,
  policy: Policy,
  jobs: number,
  options: { readonly reference?: string; readonly modes?: readonly ComparisonMode[] } = {},
): Promise<ComparisonFile> {
  return jobs === 1
    ? compareRunDirectory(directory, policy, options)
    : compareDirectoryParallel(directory, policy, jobs, options);
}

/**
 * Builds `lvrtc compare <suite name | run directory> [--root <dir>] [--reference <engine>] [--mode <mode>]
 * [--json]`.
 *
 * It finds the run directory (`resolveRunDirectory`), reads its manifest and compares what the manifest's engines
 * answered (`compareManifest`), taking each answer from the store beside the run directory and each case from the
 * run directory's `cases` (`readRunCase`). The comparisons are written to `comparisons.json` in the run directory
 * as canonical JSON and a newline: the same bytes for the same manifest, cases, store entries and policy, in any
 * directory. Each pair is printed as a line and a count follows, with the path of the file; with `--json` the
 * file's content is printed, indented, in their place.
 *
 * Exit codes: 0 when no pair is `FAIL` or `ERROR`, a `FLOOR` being a pass; 1 when one is; 2, with nothing written,
 * for a command line that is not the synopsis, a `--root` that is not a directory, a run that has no manifest or
 * one that cannot be read, a `--reference` that is not an engine of the run, and a run of a rung the policy does
 * not judge. A configuration or policy file that cannot be used is an error like any other.
 */
export function createCompareCommand(inputs: CompareCommandInputs): CliCommand {
  return {
    name: "compare",
    summary: "Compare the answers of a run's engines and give each pair a verdict",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let file: ComparisonFile;
      let path: string;
      let json: boolean;
      try {
        const asked = parseTargetArguments(
          args,
          ["--root", "--reference", "--mode", "--jobs", "--memory-budget"],
          ["--json"],
        );
        const mode = asked.values.get("--mode") ?? "both";
        if (!Object.hasOwn(MODE_CHOICES, mode)) {
          throw new UsageError(`--mode ${mode}: the modes are ${Object.keys(MODE_CHOICES).join(", ")}`);
        }
        json = asked.flags.has("--json");
        const reference = asked.values.get("--reference");
        const directory = resolveRunDirectory(asked.target, asked.values.get("--root"), inputs);
        const manifest = readRunManifest(directory);
        refuseOldIds(directory, manifest, null, inputs.legacy);
        // An engine the run does not have by the id given, but had before a rename, is that engine (`aliasEngineId`).
        const known = reference === undefined || manifest.engines.some((engine) => engine.id === reference);
        file = await profileAsync("compare", () =>
          compareRunDirectoryWithJobs(
            directory,
            inputs.policy ?? loadPolicy(),
            jobsOption(asked.values.get("--jobs"), memoryBudgetOption(asked.values.get("--memory-budget"))),
            {
              reference: known ? reference : aliasEngineId(reference, inputs.legacy?.engines),
              modes: MODE_CHOICES[mode],
            },
          ),
        );
        path = join(directory, COMPARISONS_FILE);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc compare: ${error.message}\n${usageErrorMeans(error)}${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      writeFileAtomic(path, comparisonFileText(file));
      // Canonical JSON sorts the keys at every depth; parsing it keeps that order for the indented text.
      if (json) io.stdout(`${JSON.stringify(JSON.parse(canonicalJson(file)), null, 2)}\n`);
      else io.stdout(`${linesText(file)}${COMPARE_OUTPUT_TEXT.comparisons}: ${path}\n`);

      const failed = file.comparisons.some((set) => set.pairs.some((pair) => FAILING_VERDICTS.includes(pair.verdict)));
      return failed ? EXIT_FAILURE : EXIT_OK;
    },
  };
}

/** `lvrtc compare` wired to this repository, the process environment and the directory the process was started in. */
export const compareCommand: CliCommand = createCompareCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
