// The report of one run of a suite, as the two texts that are written: `report.json` and `report.md`.
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import type { Policy } from "../contract/policy.ts";
import type { RunManifest } from "../core/manifest.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { renderMarkdown } from "./markdown.ts";
import { buildReport } from "./model.ts";

/** The file name of the report model, inside the run directory. */
export const REPORT_JSON_FILE = "report.json";
/** The file name of the report as Markdown, inside the run directory. */
export const REPORT_MARKDOWN_FILE = "report.md";

/**
 * The report of a manifest, its comparisons and the policy they were judged by, as the texts of its two files:
 * `json`, the report model (`buildReport`) as canonical JSON and a newline, and `markdown` (`renderMarkdown`). A
 * pure function: equal arguments give equal texts, byte for byte, whenever and wherever it runs.
 */
export function renderReport(
  manifest: RunManifest,
  comparisons: ComparisonFile,
  policy: Policy,
): { json: string; markdown: string } {
  const model = buildReport(manifest, comparisons, policy);
  return { json: `${canonicalJson(model)}\n`, markdown: renderMarkdown(model) };
}
