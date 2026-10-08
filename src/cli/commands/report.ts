import { join } from "node:path";

import { readComparisonFile } from "../../compare/comparisonFile.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { readRunManifest } from "../../core/manifest.ts";
import { UsageError } from "../../core/usageError.ts";
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

const SYNOPSIS = "Usage: lvrtc report <suite name | run directory> [--root <dir>]\n";
const HELP = [
  SYNOPSIS,
  "Writes the report of a run that has been compared: report.json and report.md in the run directory, from the",
  "run's manifest, its comparisons.json and the policy. Both files are the same, byte for byte, whenever and",
  "wherever they are written from the same three.",
  "",
  "  --root <dir>  the directory that holds lvrtc.config.json, whose runsDir a suite name is looked up in",
  "                (default: this repository)",
  "",
  "Exit code: 0 when the report was written, whatever its verdicts are (lvrtc compare is what fails on them); 2",
  "when it was not, because the run has no manifest or no comparisons, or they do not belong together.",
  "",
].join("\n");

/**
 * Builds `lvrtc report <suite name | run directory> [--root <dir>]`.
 *
 * It finds the run directory (`resolveRunDirectory`), reads its manifest and its `comparisons.json`, and writes
 * `report.json` and `report.md` beside them (`renderReport`), then prints the two paths. The files hold no time,
 * no path and nothing of the machine, so two reports of the same manifest, comparisons and policy are the same
 * bytes.
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
      try {
        const asked = parseTargetArguments(args, ["--root"], []);
        directory = resolveRunDirectory(asked.target, asked.values.get("--root"), inputs);
        const manifest = readRunManifest(directory);
        const comparisons = readComparisonFile(directory);
        const policy = inputs.policy ?? loadPolicy();
        const problems = reportInputProblems(manifest, comparisons, policy);
        if (problems.length > 0) throw new UsageError(`${directory}: ${problems.join("; ")}; run lvrtc compare again`);
        texts = renderReport(manifest, comparisons, policy);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc report: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      const jsonPath = join(directory, REPORT_JSON_FILE);
      const markdownPath = join(directory, REPORT_MARKDOWN_FILE);
      writeFileAtomic(jsonPath, texts.json);
      writeFileAtomic(markdownPath, texts.markdown);
      io.stdout(`report: ${markdownPath}\nreport: ${jsonPath}\n`);
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
