import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { parseBaseline } from "../../baseline/build.ts";
import {
  BASELINES_DIRECTORY,
  MTF_BASELINE_MARK,
  REPORTS_DIRECTORY,
  baselineReportFiles,
  mtfBaselineReportFiles,
} from "../../baseline/files.ts";
import { MTF_REPORT_JSON, MTF_REPORT_MARKDOWN, renderMtfBaselineReport } from "../../baseline/mtfReport.ts";
import { BASELINE_REPORT_JSON, BASELINE_REPORT_MARKDOWN, renderBaselineReport } from "../../baseline/report.ts";
import { loadPolicy } from "../../compare/policyFile.ts";
import type { Policy } from "../../contract/policy.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { hashCanonical } from "../../core/numeric/hash.ts";
import { UsageError } from "../../core/usageError.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

/** What `lvrtc verify` is wired to, injected so that tests choose it. */
export interface VerifyCommandInputs {
  /** The root when `--root` does not name one. */
  readonly rootDir: string;
  /** The directory that `--root` is relative to. */
  readonly cwd: string;
  /** The policy the baselines are held to; the comparator's own (`policy/rungs.v1.json`) unless given. */
  readonly policy?: Policy;
}

const SYNOPSIS = "Usage: lvrtc verify [--root <dir>] [--write]\n";
const HELP = [
  SYNOPSIS,
  "Holds the committed baselines and the reports rendered from them together, with no engine: neither",
  "LensVisualizer nor optiland is read. Every <root>/baselines/<suite>.json must be a baseline by its schema and",
  "its rules, be the canonical text of what it holds, be named after its suite and be judged by the policy at",
  "hand; <root>/reports/<suite>/rays.md and rays.json must be, byte for byte, what the baseline renders; and no",
  "such report may be without its baseline. An MTF baseline, <root>/baselines/<suite>.mtf.json, is held the same",
  "way with its reports, <root>/reports/<suite>/mtf.md and mtf.json.",
  "",
  "It cannot see a case or an engine that has changed since a baseline was written (STALE): that needs the",
  "engines, and is what lvrtc baseline check says.",
  "",
  "  --root <dir>  the directory that holds baselines/ and reports/ (default: this repository)",
  "  --write       write the reports anew from the baselines in place of comparing them; a baseline is never",
  "                written here",
  "",
  "Exit code: 0 when everything holds; 1 otherwise.",
  "",
].join("\n");

function readText(file: string): string | undefined {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return undefined;
  }
}

/**
 * Builds `lvrtc verify [--root <dir>] [--write]`: hermetic, a function of the files under the root and the policy.
 *
 * For each `baselines/*.json`, in the order of the names: the file is read as a baseline (`parseBaseline`: schema,
 * contract version, the rules of a baseline, canonical text), its name must be its suite's, and its policy hash
 * that of the policy at hand, since a baseline judged by other limits is no record of these. The two report files
 * under `reports/<suite>/` must be what `renderBaselineReport` gives, byte for byte; with `--write` they are
 * written instead. A `reports/<name>/rays.md` or `rays.json` whose suite has no baseline is a problem too. A file
 * `baselines/<suite>.mtf.json` is the MTF baseline of the suite (unless a suite is itself named `<suite>.mtf`): it
 * is held the same way, to `reports/<suite>/mtf.md` and `mtf.json` as `renderMtfBaselineReport` gives them. Each
 * problem is a line on the error stream; each baseline that holds is a line on the output.
 *
 * Exit codes: 0 when nothing is wrong, also when there is no baseline at all; 1 when something is; 2 for a command
 * line that is not the synopsis and a `--root` that is not a directory.
 */
export function createVerifyCommand(inputs: VerifyCommandInputs): CliCommand {
  return {
    name: "verify",
    summary: "Check the committed baselines and their reports, with no engine",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let rootDir: string;
      let rewrite: boolean;
      try {
        const { positionals, values, flags } = parseArguments(args, ["--root"], ["--write"]);
        if (positionals.length > 0) throw new UsageError(`unexpected argument "${positionals[0]}"`);
        const root = values.get("--root");
        rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
        if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${root}: not a directory`);
        }
        rewrite = flags.has("--write");
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc verify: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }

      const policy = inputs.policy ?? loadPolicy();
      const policyHash = hashCanonical(policy);
      const list = (directory: string): string[] => {
        try {
          return readdirSync(directory).sort();
        } catch {
          return [];
        }
      };
      const problems: string[] = [];
      // The suites that have a rays baseline, and those that have an MTF baseline.
      const suites = new Set<string>();
      const mtfSuites = new Set<string>();
      const files = list(join(rootDir, BASELINES_DIRECTORY)).filter((name) => name.endsWith(".json"));
      for (const name of files) {
        const at = `${BASELINES_DIRECTORY}/${name}`;
        const stem = name.slice(0, -".json".length);
        const marked = stem.endsWith(MTF_BASELINE_MARK) ? stem.slice(0, -MTF_BASELINE_MARK.length) : undefined;
        const read = parseBaseline(readText(join(rootDir, BASELINES_DIRECTORY, name)) ?? "");
        if ("problems" in read) {
          // Whichever baseline it was to be, its reports are not strays.
          suites.add(stem);
          if (marked !== undefined) mtfSuites.add(marked);
          problems.push(`${at}: not a baseline: ${read.problems.join("; ")}`);
          continue;
        }
        const { baseline } = read;
        // A file named `<suite>.mtf.json` is the MTF baseline of the suite, unless a suite is itself named so.
        const mtf = marked !== undefined && baseline.suite.name !== stem;
        const suite = mtf ? marked : stem;
        (mtf ? mtfSuites : suites).add(suite);
        const [reportMarkdown, reportJson] = mtf
          ? [MTF_REPORT_MARKDOWN, MTF_REPORT_JSON]
          : [BASELINE_REPORT_MARKDOWN, BASELINE_REPORT_JSON];
        const check = mtf ? `lvrtc baseline check ${suite} --mtf` : `lvrtc baseline check ${suite}`;
        const before = problems.length;
        if (baseline.suite.name !== suite)
          problems.push(`${at}: it is the baseline of the suite ${baseline.suite.name}`);
        if (baseline.policy.hash !== policyHash) {
          problems.push(
            `${at}: it was judged by policy v${baseline.policy.version} (${baseline.policy.hash}), not by the policy ` +
              `at hand, v${policy.version}: ${check} says whether it still holds, and ${check.replace(" check ", " write ")} ` +
              `records it`,
          );
        }
        const rendered = mtf ? renderMtfBaselineReport(baseline) : renderBaselineReport(baseline);
        const reports = mtf ? mtfBaselineReportFiles(rootDir, suite) : baselineReportFiles(rootDir, suite);
        for (const [file, text, said] of [
          [reports.markdown, rendered.markdown, `${REPORTS_DIRECTORY}/${suite}/${reportMarkdown}`],
          [reports.json, rendered.json, `${REPORTS_DIRECTORY}/${suite}/${reportJson}`],
        ] as const) {
          if (rewrite) {
            writeFileAtomic(file, text);
            continue;
          }
          const committed = readText(file);
          if (committed === undefined)
            problems.push(`${said}: it is missing; lvrtc verify --write writes it from ${at}`);
          else if (committed !== text) {
            problems.push(
              `${said}: it is not what ${at} renders: it was edited by hand or is of another baseline; lvrtc verify ` +
                `--write writes it anew`,
            );
          }
        }
        if (problems.length === before) {
          const records = baseline.runs.reduce(
            (sum, run) => sum + run.rungs.reduce((n, rung) => n + rung.pairs.length, 0),
            0,
          );
          io.stdout(
            `${at}: a baseline of ${baseline.runs.length} runs and ${records} records, policy v${baseline.policy.version}; ` +
              `${REPORTS_DIRECTORY}/${suite}/${reportMarkdown} and ${reportJson} are ${rewrite ? "written from it" : "what it renders"}\n`,
          );
        }
      }
      for (const suite of list(join(rootDir, REPORTS_DIRECTORY))) {
        for (const [has, names, mark] of [
          [suites, [BASELINE_REPORT_MARKDOWN, BASELINE_REPORT_JSON], ""],
          [mtfSuites, [MTF_REPORT_MARKDOWN, MTF_REPORT_JSON], MTF_BASELINE_MARK],
        ] as const) {
          if (has.has(suite)) continue;
          for (const name of names) {
            if (readText(join(rootDir, REPORTS_DIRECTORY, suite, name)) !== undefined) {
              problems.push(
                `${REPORTS_DIRECTORY}/${suite}/${name}: there is no ${BASELINES_DIRECTORY}/${suite}${mark}.json it is rendered from`,
              );
            }
          }
        }
      }
      for (const problem of problems) io.stderr(`lvrtc verify: ${problem}\n`);
      const count = `${files.length} ${files.length === 1 ? "baseline" : "baselines"}`;
      io.stdout(
        `verify: ${count}, ${problems.length} ${problems.length === 1 ? "problem" : "problems"}. No engine was read: a case ` +
          `or an engine that has changed since (STALE) is seen by lvrtc baseline check, not here.\n`,
      );
      return problems.length > 0 ? EXIT_FAILURE : EXIT_OK;
    },
  };
}

/** `lvrtc verify` wired to this repository and the directory the process was started in. */
export const verifyCommand: CliCommand = createVerifyCommand({ rootDir: REPO_ROOT, cwd: process.cwd() });
