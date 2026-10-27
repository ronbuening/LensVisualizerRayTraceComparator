import { renderCatalog } from "../../src/report/catalog.ts";
import { catalogInputs } from "./catalogFixture.ts";
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
import { renderStatement } from "../../src/report/statement.ts";
import { statementInputs } from "./statementFixture.ts";
import { REPORT_MARKDOWN_FILE, renderReport } from "../../src/report/index.ts";
import { PYTHON_MISSING } from "../engines/support.ts";
import { COMPARISONS, MANIFEST, POLICY } from "./handBuilt.ts";
import { R5_GOLDEN, R5_POLICY, r5Cycle } from "./r5Fixture.ts";
import { R5G_GOLDEN, R5G_POLICY, r5gCycle } from "./r5gFixture.ts";
import { R6C_GOLDEN, R6C_POLICY, r6cCycle } from "./r6cFixture.ts";
import { R7A_GOLDEN, R7B_GOLDEN, r7aCycle, r7bCycle } from "./r7Fixture.ts";
import { R8A_GOLDEN, R8B_GOLDEN, r8aCycle, r8bCycle } from "./r8Fixture.ts";
import { R9A_GOLDEN, R9B_GOLDEN, r9aCycle, r9bCycle } from "./r9Fixture.ts";
import { R10A_GOLDEN, R10B_GOLDEN, r10aCycle, r10bCycle } from "./r10Fixture.ts";
import { R11A_GOLDEN, R11B_GOLDEN, r11aCycle, r11bCycle } from "./r11Fixture.ts";
import { R12B_GOLDEN, r12bCycle } from "./r12Fixture.ts";
import { GOLDEN_DIR, GOLDEN_SUITES, cycle, goldenFile, mtfGoldenFile } from "./support.ts";

mkdirSync(GOLDEN_DIR, { recursive: true });
const catalog = renderCatalog(catalogInputs());
writeFileSync(join(GOLDEN_DIR, "catalog.md"), catalog.markdown);
writeFileSync(join(GOLDEN_DIR, "catalog.json"), catalog.json);
const statement = renderStatement(statementInputs());
writeFileSync(join(GOLDEN_DIR, "validation-statement.md"), statement.markdown);
writeFileSync(join(GOLDEN_DIR, "validation-statement.json"), statement.json);
writeFileSync(goldenFile("hand-built"), renderReport(MANIFEST, COMPARISONS, POLICY).markdown);
// Rungs R5 and R5g on stand-ins that know no optics: a run, a comparison and a report in this process.
for (const [golden, standIns, policy] of [
  [R5_GOLDEN, r5Cycle, R5_POLICY],
  [R5G_GOLDEN, r5gCycle, R5G_POLICY],
  [R6C_GOLDEN, r6cCycle, R6C_POLICY],
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
// Rungs R7a and R7b: the reference engine and its altered copies on a set with a chief ray, and spot stand-ins;
// rungs R8a and R8b: the same on mirror pairs along the axis, and axial stand-ins; rungs R9a and R9b: the same on a
// set of chief rays with a near-axis probe at two lines, and chief-ray stand-ins; rungs R10a and R10b: the same on a
// curvature set of two fields at two lines, and field-curve stand-ins; rungs R11a and R11b: the same on a vignetting
// sweep and two fields' lattices, and vignetting stand-ins; rung R12b: summary stand-ins at two lines.
for (const [golden, standIns] of [
  [R7A_GOLDEN, r7aCycle],
  [R7B_GOLDEN, r7bCycle],
  [R8A_GOLDEN, r8aCycle],
  [R8B_GOLDEN, r8bCycle],
  [R9A_GOLDEN, r9aCycle],
  [R9B_GOLDEN, r9bCycle],
  [R10A_GOLDEN, r10aCycle],
  [R10B_GOLDEN, r10bCycle],
  [R11A_GOLDEN, r11aCycle],
  [R11B_GOLDEN, r11bCycle],
  [R12B_GOLDEN, r12bCycle],
] as const) {
  const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-golden-"));
  try {
    writeFileSync(goldenFile(golden), (await standIns(runsDir)).report.markdown);
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
