// Rewrites the golden reports of test/fixtures/golden. Run it after a change that is meant to change a report:
//
//   node test/report/writeGolden.ts
//
// Each fixture suite is run, compared and reported into a temporary runs directory, and its report.md is copied.
// The suite that needs Python is left alone, with a note, where Python is missing. Read the diff before committing
// it: the golden files are what the reports are held to.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { MTF_BASELINE, buildBaseline } from "../../src/baseline/build.ts";
import { renderMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { REPORT_MARKDOWN_FILE, renderReport } from "../../src/report/index.ts";
import { PYTHON_MISSING } from "../engines/support.ts";
import { COMPARISONS, MANIFEST, POLICY } from "./handBuilt.ts";
import { R5_GOLDEN, R5_POLICY, r5Cycle } from "./r5Fixture.ts";
import { R5G_GOLDEN, R5G_POLICY, r5gCycle } from "./r5gFixture.ts";
import { GOLDEN_DIR, GOLDEN_SUITES, cycle, goldenFile, mtfGoldenFile } from "./support.ts";

mkdirSync(GOLDEN_DIR, { recursive: true });
writeFileSync(goldenFile("hand-built"), renderReport(MANIFEST, COMPARISONS, POLICY).markdown);
// Rungs R5 and R5g on stand-ins that know no optics: a run, a comparison and a report in this process.
for (const [golden, standIns, policy] of [
  [R5_GOLDEN, r5Cycle, R5_POLICY],
  [R5G_GOLDEN, r5gCycle, R5G_POLICY],
] as const) {
  const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-golden-"));
  try {
    const { manifest, comparisons, report } = await standIns(runsDir);
    writeFileSync(goldenFile(golden), report.markdown);
    // The MTF report of the same run's MTF baseline: what is committed beside a suite's as reports/<suite>/mtf.md.
    const baseline = buildBaseline(manifest, comparisons, policy, MTF_BASELINE);
    writeFileSync(mtfGoldenFile(golden), renderMtfBaselineReport(baseline).markdown);
    console.log(`${golden}: written`);
  } finally {
    rmSync(runsDir, { recursive: true, force: true });
  }
}
for (const suite of GOLDEN_SUITES) {
  if (suite.needsPython && PYTHON_MISSING !== false) {
    console.log(`${suite.name}: not written: ${PYTHON_MISSING}`);
    continue;
  }
  const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-golden-"));
  try {
    const { files } = await cycle(suite, runsDir);
    writeFileSync(goldenFile(suite.name), files[REPORT_MARKDOWN_FILE]);
    console.log(`${suite.name}: written`);
  } finally {
    rmSync(runsDir, { recursive: true, force: true });
  }
}
