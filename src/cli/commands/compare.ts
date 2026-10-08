import { dirname, join } from "node:path";

import { COMPARISONS_FILE, comparisonFileText } from "../../compare/comparisonFile.ts";
import type { ComparisonFile } from "../../compare/comparisonFile.ts";
import { compareManifest } from "../../compare/manifest.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import { COMPARISON_MODES, FAILING_VERDICTS, VERDICTS } from "../../contract/comparison.ts";
import type { ComparisonMode } from "../../contract/comparison.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { readRunManifest } from "../../core/manifest.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { STORE_DIRECTORY, createResultStore } from "../../core/resultStore.ts";
import { UsageError } from "../../core/usageError.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { parseTargetArguments, resolveRunDirectory } from "../runTarget.ts";
import type { RunTargetInputs } from "../runTarget.ts";

/** What `lvrtc compare` is wired to, injected so that tests choose it. */
export interface CompareCommandInputs extends RunTargetInputs {
  /** The policy to judge by; the comparator's own (`policy/rungs.v1.json`) unless given. */
  readonly policy?: Policy;
}

const SYNOPSIS =
  "Usage: lvrtc compare <suite name | run directory> [--root <dir>] [--reference <engine>]\n" +
  "                     [--mode reference-vs-each|pairwise|both] [--json]\n";
const HELP = [
  SYNOPSIS,
  "Compares the answers of a run's engines, request by request, and judges each pair by the policy of its rung.",
  "It reads the run's manifest and the result store beside the run directory, and writes comparisons.json into the",
  "run directory. Nothing is asked of any engine.",
  "",
  "  --root <dir>          the directory that holds lvrtc.config.json, whose runsDir a suite name is looked up in",
  "                        (default: this repository)",
  "  --reference <engine>  the engine every other is compared against (default: each run's referenceEngine, else",
  '                        the first engine, by id, that has an "ok" result)',
  "  --mode <mode>         reference-vs-each, pairwise or both (default: both)",
  "  --json                print the comparisons as one JSON object in place of the lines",
  "",
  "Exit code: 0 when no pair is FAIL or ERROR (UNSUPPORTED, RECORDED and ATTENTION are not failures); 1 otherwise;",
  "2 when nothing was compared because the run has no manifest or the reference is not an engine of the run.",
  "",
].join("\n");

const MODE_CHOICES: Readonly<Record<string, readonly ComparisonMode[]>> = {
  "reference-vs-each": ["reference-vs-each"],
  pairwise: ["pairwise"],
  both: COMPARISON_MODES,
};

/** One line per pair, in columns: run, rung, mode, the two engines, the verdict and its reason; then the counts. */
function linesText(file: ComparisonFile): string {
  const rows = file.comparisons.flatMap((set) =>
    set.pairs.map((pair) => [set.run, set.rung, set.mode, pair.a, pair.b, pair.verdict, pair.reason ?? ""]),
  );
  const widths = rows.reduce<number[]>(
    (most, row) => row.map((cell, column) => Math.max(most[column] ?? 0, cell.length)),
    [],
  );
  const lines = rows.map((row) =>
    row
      .map((cell, column) => cell.padEnd(widths[column]))
      .join("  ")
      .trimEnd(),
  );
  const verdicts = rows.map((row) => row[5]);
  const counts = VERDICTS.map((verdict) => `${verdicts.filter((each) => each === verdict).length} ${verdict}`);
  return [
    ...lines,
    `${file.suite}: ${rows.length} ${rows.length === 1 ? "pair" : "pairs"}: ${counts.join(", ")}`,
    "",
  ].join("\n");
}

/**
 * Builds `lvrtc compare <suite name | run directory> [--root <dir>] [--reference <engine>] [--mode <mode>]
 * [--json]`.
 *
 * It finds the run directory (`resolveRunDirectory`), reads its manifest and compares what the manifest's engines
 * answered (`compareManifest`), taking each answer from the store beside the run directory. The comparisons are
 * written to `comparisons.json` in the run directory as canonical JSON and a newline: the same bytes for the same
 * manifest, store entries and policy, in any directory. Each pair is printed as a line and a count follows, with
 * the path of the file; with `--json` the file's content is printed, indented, in their place.
 *
 * Exit codes: 0 when no pair is `FAIL` or `ERROR`; 1 when one is; 2, with nothing written, for a command line
 * that is not the synopsis, a `--root` that is not a directory, a run that has no manifest or one that cannot be
 * read, a `--reference` that is not an engine of the run, and a run of a rung the policy does not judge. A
 * configuration or policy file that cannot be used is an error like any other.
 */
export function createCompareCommand(inputs: CompareCommandInputs): CliCommand {
  return {
    name: "compare",
    summary: "Compare the engines of a run, against a reference and pairwise",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let file: ComparisonFile;
      let path: string;
      let json: boolean;
      try {
        const asked = parseTargetArguments(args, ["--root", "--reference", "--mode"], ["--json"]);
        const mode = asked.values.get("--mode") ?? "both";
        if (!Object.hasOwn(MODE_CHOICES, mode)) {
          throw new UsageError(`--mode ${mode}: the modes are ${Object.keys(MODE_CHOICES).join(", ")}`);
        }
        json = asked.flags.has("--json");
        const directory = resolveRunDirectory(asked.target, asked.values.get("--root"), inputs);
        file = compareManifest({
          manifest: readRunManifest(directory),
          store: createResultStore(join(dirname(directory), STORE_DIRECTORY)),
          policy: inputs.policy ?? loadPolicy(),
          reference: asked.values.get("--reference"),
          modes: MODE_CHOICES[mode],
        });
        path = join(directory, COMPARISONS_FILE);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc compare: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      writeFileAtomic(path, comparisonFileText(file));
      // Canonical JSON sorts the keys at every depth; parsing it keeps that order for the indented text.
      if (json) io.stdout(`${JSON.stringify(JSON.parse(canonicalJson(file)), null, 2)}\n`);
      else io.stdout(`${linesText(file)}comparisons: ${path}\n`);

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
