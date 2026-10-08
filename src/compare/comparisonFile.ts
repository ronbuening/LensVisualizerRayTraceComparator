// `comparisons.json`: the comparison sets of one run of a suite, as `lvrtc compare` writes them beside the manifest.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { comparisonInvariantProblems } from "../contract/comparison.ts";
import type { ComparisonSet } from "../contract/comparison.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { isCompatibleContract } from "../contract/version.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { UsageError } from "../core/usageError.ts";

/** The file's name, inside the run directory. */
export const COMPARISONS_FILE = "comparisons.json";

/** Every comparison of one run of a suite, with what it was made from. */
export interface ComparisonFile {
  readonly contract: string;
  readonly kind: "comparison-file";
  /** The name of the suite. */
  readonly suite: string;
  /** The content hash of the manifest the sets were made from (`hashCanonical`). */
  readonly manifest: string;
  /** The content hash of the policy the sets were judged by. */
  readonly policy: string;
  /**
   * The sets: runs in suite order, then rungs and requests in the order of the manifest's jobs, then
   * reference-vs-each before pairwise.
   */
  readonly comparisons: readonly ComparisonSet[];
}

/** A comparison file as it is written: canonical JSON and a newline. Equal files give equal text. */
export function comparisonFileText(file: ComparisonFile): string {
  return `${canonicalJson(file)}\n`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * The comparison file of the run directory `directory`, checked: its own members, and every set against the
 * schema of a `comparison` and the rules of one (`comparisonInvariantProblems`). Throws a `UsageError` when the
 * directory has none, which is what a run that was never compared looks like, and when the file cannot be read, is
 * not JSON or is not a comparison file this code can read.
 */
export function readComparisonFile(directory: string): ComparisonFile {
  const file = join(directory, COMPARISONS_FILE);
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code ?? "unknown error";
    if (code === "ENOENT")
      throw new UsageError(`${directory}: no ${COMPARISONS_FILE} is there; run lvrtc compare first`);
    throw new UsageError(`${file}: cannot be read (${code})`, { cause: error });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new UsageError(`${file}: malformed JSON`, { cause: error });
  }
  const refuse = (problem: string): never => {
    throw new UsageError(`${file}: not a comparison file: ${problem}`);
  };
  if (!isRecord(parsed) || parsed.kind !== "comparison-file") return refuse('its kind is not "comparison-file"');
  if (typeof parsed.contract !== "string" || !isCompatibleContract(parsed.contract)) {
    return refuse("its contract version cannot be read by this code");
  }
  for (const member of ["suite", "manifest", "policy"]) {
    if (typeof parsed[member] !== "string") return refuse(`its ${member} is not a string`);
  }
  if (!Array.isArray(parsed.comparisons)) return refuse("its comparisons are not a list");
  parsed.comparisons.forEach((set: unknown, index) => {
    const issues = validateKind("comparison", set);
    if (issues.length > 0) refuse(`comparison ${index} is not valid: ${formatIssues(issues)}`);
    const broken = comparisonInvariantProblems(set as ComparisonSet);
    if (broken.length > 0) refuse(`comparison ${index}: ${broken.join("; ")}`);
  });
  return parsed as unknown as ComparisonFile;
}
