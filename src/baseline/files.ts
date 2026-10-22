// Where the baselines of a configuration root and their reports are kept.
import { join } from "node:path";

import { MTF_REPORT_JSON, MTF_REPORT_MARKDOWN } from "./mtfReport.ts";
import { BASELINE_REPORT_JSON, BASELINE_REPORT_MARKDOWN } from "./report.ts";

/** The directory of a root that holds a baseline per suite, as `<suite name>.json`. */
export const BASELINES_DIRECTORY = "baselines";
/** The directory of a root that holds the reports of each baseline, under `<suite name>/`. */
export const REPORTS_DIRECTORY = "reports";

/** The file of the baseline of the suite `name` under the root `rootDir`. */
export function baselineFile(rootDir: string, name: string): string {
  return join(rootDir, BASELINES_DIRECTORY, `${name}.json`);
}

/** The two report files of the baseline of the suite `name` under the root `rootDir`. */
export function baselineReportFiles(
  rootDir: string,
  name: string,
): { readonly json: string; readonly markdown: string } {
  const directory = join(rootDir, REPORTS_DIRECTORY, name);
  return { json: join(directory, BASELINE_REPORT_JSON), markdown: join(directory, BASELINE_REPORT_MARKDOWN) };
}

/** What the name of an MTF baseline's file has after the suite's name: `<suite name>.mtf.json`. */
export const MTF_BASELINE_MARK = ".mtf";

/**
 * The file of the MTF baseline of the suite `name` under the root `rootDir`: a baseline of its own beside the
 * suite's rays baseline, so that each is written, checked and reported without the other.
 */
export function mtfBaselineFile(rootDir: string, name: string): string {
  return join(rootDir, BASELINES_DIRECTORY, `${name}${MTF_BASELINE_MARK}.json`);
}

/** The two report files of the MTF baseline of the suite `name` under the root `rootDir`. */
export function mtfBaselineReportFiles(
  rootDir: string,
  name: string,
): { readonly json: string; readonly markdown: string } {
  const directory = join(rootDir, REPORTS_DIRECTORY, name);
  return { json: join(directory, MTF_REPORT_JSON), markdown: join(directory, MTF_REPORT_MARKDOWN) };
}
