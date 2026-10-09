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

import { REPORT_MARKDOWN_FILE, renderReport } from "../../src/report/index.ts";
import { PYTHON_MISSING } from "../engines/support.ts";
import { COMPARISONS, MANIFEST, POLICY } from "./handBuilt.ts";
import { R5_GOLDEN, r5Cycle } from "./r5Fixture.ts";
import { GOLDEN_DIR, GOLDEN_SUITES, cycle, goldenFile } from "./support.ts";

mkdirSync(GOLDEN_DIR, { recursive: true });
writeFileSync(goldenFile("hand-built"), renderReport(MANIFEST, COMPARISONS, POLICY).markdown);
{
  // Rung R5 on stand-ins that know no optics: a run, a comparison and a report in this process.
  const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-golden-"));
  try {
    writeFileSync(goldenFile(R5_GOLDEN), (await r5Cycle(runsDir)).report.markdown);
    console.log(`${R5_GOLDEN}: written`);
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
