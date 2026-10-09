// Where the baselines of a configuration root and their reports are kept.
import { join } from "node:path";

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
