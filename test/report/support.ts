// What the report tests and the golden writer share: the fixture suites, and a whole run -> compare -> report cycle
// of one of them into a runs directory of the caller's.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import { REPORT_JSON_FILE, REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { FAKE_ROOT } from "../core/support.ts";
import { PYTHON } from "../engines/support.ts";

/** The fixture root of the engines that fail: one far beyond tolerance, one that errors, one that cannot be loaded. */
export const FAULT_ROOT: string = fileURLToPath(new URL("../fixtures/fault-root", import.meta.url));
/** The directory of the expected reports. */
export const GOLDEN_DIR: string = fileURLToPath(new URL("../fixtures/golden", import.meta.url));

/** A fixture suite with a golden report. */
export interface GoldenSuite {
  /** The suite's name: its file is `test/fixtures/suites/<name>.json`, its golden `<name>.report.md`. */
  readonly name: string;
  readonly root: string;
  readonly needsPython: boolean;
  /** The exit codes of `run`, `compare` and `report`. */
  readonly codes: readonly [number, number, number];
}

/**
 * The suites with a golden report: the Phase 0 benchmark trio (a TypeScript fake as reference, the Python fake
 * with a bias inside the tolerance, a fake that offers no quantity), the same trio all in TypeScript, and the
 * faults (a bias beyond the tolerance, an engine that errors, one that cannot be loaded, a run that cannot start).
 */
export const GOLDEN_SUITES: readonly GoldenSuite[] = [
  { name: "fake-3-engines", root: FAKE_ROOT, needsPython: true, codes: [0, 0, 0] },
  { name: "fake-3-engines-ts", root: FAKE_ROOT, needsPython: false, codes: [0, 0, 0] },
  { name: "fake-faults", root: FAULT_ROOT, needsPython: false, codes: [1, 1, 0] },
];

/** The path of a fixture suite's file. */
export function suiteFile(name: string): string {
  return fileURLToPath(new URL(`../fixtures/suites/${name}.json`, import.meta.url));
}

/** The path of a golden report. */
export function goldenFile(name: string): string {
  return join(GOLDEN_DIR, `${name}.report.md`);
}

/** The files a cycle writes into the run directory, in the order it writes them. */
export const CYCLE_FILES: readonly string[] = [MANIFEST_FILE, COMPARISONS_FILE, REPORT_JSON_FILE, REPORT_MARKDOWN_FILE];

/** What one command of a cycle did. */
export interface Step {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

/**
 * Runs `lvrtc run`, `lvrtc compare` and `lvrtc report` on a fixture suite, in this process, with `runsDir` as the
 * runs directory, and returns what each did and the text of every file of the run directory (`CYCLE_FILES`).
 */
export async function cycle(
  suite: GoldenSuite,
  runsDir: string,
): Promise<{ steps: Step[]; files: Record<string, string> }> {
  const inputs = { rootDir: REPO_ROOT, cwd: REPO_ROOT, env: { LVRTC_RUNS_DIR: runsDir, LVRTC_PYTHON: PYTHON } };
  const commands = [createRunCommand(inputs), createCompareCommand(inputs), createReportCommand(inputs)];
  const steps: Step[] = [];
  for (const args of [
    ["run", suiteFile(suite.name), "--root", suite.root],
    ["compare", suite.name, "--root", suite.root],
    ["report", suite.name, "--root", suite.root],
  ]) {
    const out: string[] = [];
    const err: string[] = [];
    const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
    steps.push({ code: await runCli(args, io, commands), out: out.join(""), err: err.join("") });
  }
  const files = Object.fromEntries(
    CYCLE_FILES.map((file) => [file, readFileSync(join(runsDir, suite.name, file), "utf8")]),
  );
  return { steps, files };
}
