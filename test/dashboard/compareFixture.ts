// The lens of the dashboard's "LV vs optiland" pages (Stage 8.5): the stand-ins of R7a to R12b (test/report), run
// into run directories of their own, whose case files are then given one lens key. A label is in no case id, so the
// relabelled files keep their ids and the comparisons stay of them; each fixture keeps its own case, so the lens has
// one condition for each (R8a and R8b, R9a and R9b, R10a and R10b, R11a and R11b share theirs). R7a's run directory
// is left without its comparisons and stands in a baseline instead: its card reads the baseline's records of the case.
// Every number is the stand-ins' own.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { baselineText, buildBaseline } from "../../src/baseline/build.ts";
import { COMPARISONS_FILE, comparisonFileText } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import type { CompareView } from "../../src/dashboard/compare.ts";
import type { DashboardViews } from "../../src/dashboard/server.ts";
import { R7A_POLICY, r7aCycle, r7bCycle } from "../report/r7Fixture.ts";
import { r8aCycle, r8bCycle } from "../report/r8Fixture.ts";
import { r9aCycle, r9bCycle } from "../report/r9Fixture.ts";
import { r10aCycle, r10bCycle } from "../report/r10Fixture.ts";
import { r11aCycle, r11bCycle } from "../report/r11Fixture.ts";
import { r12bCycle } from "../report/r12Fixture.ts";

/** The lens of the compare pages' fixture. */
export const COMPARE_KEY = "stand-in-tabs";
/** The run directory kept without its comparisons, and the baseline that holds them. */
export const BASELINE_ONLY = "r7a-stand-ins";

/** The cycles whose run directories are compared, each as its fixture runs it. */
const CYCLES: readonly ((runsDir: string) => Promise<{ manifest: RunManifest; comparisons: ComparisonFile }>)[] = [
  r7bCycle,
  r8aCycle,
  r8bCycle,
  r9aCycle,
  r9bCycle,
  r10aCycle,
  r10bCycle,
  r11aCycle,
  r11bCycle,
  r12bCycle,
];

/** Gives every case file of a run directory the lens key of the fixture. */
function relabel(runsDir: string, suite: string): void {
  const directory = join(runsDir, suite, "cases");
  for (const file of readdirSync(directory).sort()) {
    const path = join(directory, file);
    const opticalCase = JSON.parse(readFileSync(path, "utf8")) as { label: Record<string, unknown> };
    opticalCase.label = { ...opticalCase.label, name: "Stand-in tabs", lensKey: COMPARE_KEY };
    writeFileSync(path, `${canonicalJson(opticalCase)}\n`);
  }
}

/** Runs and compares the stand-ins into `runsDir`, and writes R7a's baseline into `rootDir`. */
export async function compareCycles(runsDir: string, rootDir: string): Promise<void> {
  for (const cycle of CYCLES) {
    const { manifest, comparisons } = await cycle(runsDir);
    writeFileSync(join(runsDir, manifest.suite.name, COMPARISONS_FILE), comparisonFileText(comparisons));
    relabel(runsDir, manifest.suite.name);
  }
  const r7a = await r7aCycle(runsDir);
  relabel(runsDir, r7a.manifest.suite.name);
  mkdirSync(join(rootDir, "baselines"), { recursive: true });
  const baseline = buildBaseline(r7a.manifest, r7a.comparisons, R7A_POLICY);
  writeFileSync(join(rootDir, "baselines", `${BASELINE_ONLY}.json`), baselineText(baseline));
}

/**
 * The conditions of the golden charts and pages, by what their cards hold: the shared one of R8 to R12 (two cases of
 * the lens), and the one whose R7b pair is ATTENTION, whose fan is of two methods. Read from the chips.
 */
export function compareGoldenQueries(views: DashboardViews): { readonly shared: string; readonly fan: string } {
  const queries = [""];
  for (let at = 0; at < queries.length; at++) {
    for (const facet of views.compare(COMPARE_KEY, queries[at], null)?.facets ?? []) {
      for (const option of facet.options) if (!queries.includes(option.query)) queries.push(option.query);
    }
  }
  const find = (holds: (view: CompareView) => boolean): string => {
    const query = queries.find((each) => {
      const view = views.compare(COMPARE_KEY, each, null);
      return view !== null && holds(view);
    });
    if (query === undefined) throw new Error("the compare fixture has no such condition");
    return views.compare(COMPARE_KEY, query, null)!.query;
  };
  const card = (view: CompareView, tab: string) => view.cards.find((each) => each.tab === tab);
  return {
    shared: find((view) => (card(view, "chief")?.recorded.length ?? 0) > 0),
    fan: find((view) => card(view, "coma-bokeh")?.recordedVerdict === "ATTENTION"),
  };
}
