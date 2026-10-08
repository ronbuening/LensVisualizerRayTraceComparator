import { join, resolve } from "node:path";

import { readComparisonFile } from "../../compare/comparisonFile.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { readRunManifest } from "../../core/manifest.ts";
import { UsageError } from "../../core/usageError.ts";
import { floorFileNames, floorOf, renderFloorReport } from "../../report/floor.ts";
import { REPORT_JSON_FILE, REPORT_MARKDOWN_FILE, renderReport } from "../../report/index.ts";
import { reportInputProblems } from "../../report/model.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { parseTargetArguments, resolveRunDirectory } from "../runTarget.ts";
import type { RunTargetInputs } from "../runTarget.ts";

/** What `lvrtc report` is wired to, injected so that tests choose it. */
export interface ReportCommandInputs extends RunTargetInputs {
  /** The policy the comparisons were judged by; the comparator's own (`policy/rungs.v1.json`) unless given. */
  readonly policy?: Policy;
}

const SYNOPSIS = "Usage: lvrtc report <suite name | run directory> [--root <dir>] [--floor <dir>]\n";
const HELP = [
  SYNOPSIS,
  "Writes the report of a run that has been compared: report.json and report.md in the run directory, from the",
  "run's manifest, its comparisons.json and the policy. Both files are the same, byte for byte, whenever and",
  "wherever they are written from the same three.",
  "",
  "  --root <dir>   the directory that holds lvrtc.config.json, whose runsDir a suite name is looked up in",
  "                 (default: this repository)",
  "  --floor <dir>  also write the numerical-floor digest of the run into <dir>, as <engine>-floor.json and",
  "                 <engine>-floor.md, for the engine the policy gives a floor (lv) against its arbiter (ref):",
  "                 per run and rung the worst of every metric, the verdicts and how the rays ended. It holds",
  "                 results, counts, run names and hashes only, and is what is committed of a benchmark",
  "",
  "Exit code: 0 when the report was written, whatever its verdicts are (lvrtc compare is what fails on them); 2",
  "when it was not, because the run has no manifest or no comparisons, or they do not belong together.",
  "",
].join("\n");

/**
 * Builds `lvrtc report <suite name | run directory> [--root <dir>] [--floor <dir>]`.
 *
 * It finds the run directory (`resolveRunDirectory`), reads its manifest and its `comparisons.json`, and writes
 * `report.json` and `report.md` beside them (`renderReport`), then prints the two paths. The files hold no time,
 * no path and nothing of the machine, so two reports of the same manifest, comparisons and policy are the same
 * bytes.
 *
 * With `--floor <dir>` it also writes the numerical-floor digest of the run (`renderFloorReport`) into that
 * directory, relative to the directory the command was started in: `<engine>-floor.json` and `<engine>-floor.md`
 * for the engine the policy gives a floor, against the policy's arbiter. A policy without a floor has no digest,
 * which is a usage error.
 *
 * Exit codes: 0 when the report was written; 2, with nothing written, for a command line that is not the synopsis,
 * a `--root` that is not a directory, a run that has no manifest or no comparisons or one of the two that cannot
 * be read, and comparisons that were made from another manifest or judged by another policy than the ones at hand
 * (`lvrtc compare` makes them anew). A configuration or policy file that cannot be used is an error like any other.
 */
export function createReportCommand(inputs: ReportCommandInputs): CliCommand {
  return {
    name: "report",
    summary: "Write the report of a compared run as JSON and Markdown",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let directory: string;
      let texts: { json: string; markdown: string };
      const written: [path: string, text: string][] = [];
      try {
        const asked = parseTargetArguments(args, ["--root", "--floor"], []);
        directory = resolveRunDirectory(asked.target, asked.values.get("--root"), inputs);
        const manifest = readRunManifest(directory);
        const comparisons = readComparisonFile(directory);
        const policy = inputs.policy ?? loadPolicy();
        const problems = reportInputProblems(manifest, comparisons, policy);
        if (problems.length > 0) throw new UsageError(`${directory}: ${problems.join("; ")}; run lvrtc compare again`);
        texts = renderReport(manifest, comparisons, policy);
        const floorDirectory = asked.values.get("--floor");
        if (floorDirectory !== undefined) {
          const floor = floorOf(policy);
          if (floor === undefined) throw new UsageError("--floor: the policy gives no engine a floor");
          const digest = renderFloorReport(manifest, comparisons, policy, floor);
          const names = floorFileNames(floor.engine);
          written.push([join(resolve(inputs.cwd, floorDirectory), names.markdown), digest.markdown]);
          written.push([join(resolve(inputs.cwd, floorDirectory), names.json), digest.json]);
        }
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc report: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      const jsonPath = join(directory, REPORT_JSON_FILE);
      const markdownPath = join(directory, REPORT_MARKDOWN_FILE);
      writeFileAtomic(jsonPath, texts.json);
      writeFileAtomic(markdownPath, texts.markdown);
      for (const [path, text] of written) writeFileAtomic(path, text);
      io.stdout(
        `report: ${markdownPath}\nreport: ${jsonPath}\n${written.map(([path]) => `floor: ${path}\n`).join("")}`,
      );
      return EXIT_OK;
    },
  };
}

/** `lvrtc report` wired to this repository, the process environment and the directory the process was started in. */
export const reportCommand: CliCommand = createReportCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
