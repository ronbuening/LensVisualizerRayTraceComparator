import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { MTF_BASELINE, buildBaseline } from "../../src/baseline/build.ts";
import { renderMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { buildReport } from "../../src/report/model.ts";
import { wordingProblems } from "../../src/report/wording.ts";
import { goldenFile, mtfGoldenFile } from "./support.ts";
import { R6C_GOLDEN, R6C_POLICY, r6cCycle } from "./r6cFixture.ts";

test("R6c records four columns and sorts every difference independently; report and MTF stand-ins are golden", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r6c-"));
  try {
    const cycle = await r6cCycle(root);
    const model = buildReport(cycle.manifest, cycle.comparisons, R6C_POLICY);
    const tables = model.sections.flatMap((s) => s.mtf ?? []);
    assert.ok(tables.length > 0);
    for (const table of tables) {
      assert.deepEqual(
        table.columns.map((c) => c.engine),
        ["lv", "wave", "optiland", "optiland-wave"],
      );
      assert.equal(table.peers?.length, 2);
      assert.equal(table.pair.b, "optiland-wave");
    }
    const methods = tables.flatMap((t) => [t, ...(t.peers ?? [])]);
    for (const kind of ["unsupported", "data", "numerical", "method"])
      assert.ok(
        methods.some((t) => t.rows.some((r) => r.class === kind)),
        kind,
      );
    assert.ok(
      methods
        .flatMap((t) => t.rows)
        .filter((r) => r.class === "data" || r.class === "unsupported")
        .every((r) => r.difference === null),
    );
    assert.ok(
      methods
        .flatMap((t) => t.rows)
        .filter((r) => r.class === "numerical")
        .every((r) => r.band === null),
    );
    assert.deepEqual(wordingProblems(cycle.report.markdown), []);
    assert.equal(cycle.report.markdown, readFileSync(goldenFile(R6C_GOLDEN), "utf8"));
    const baseline = buildBaseline(cycle.manifest, cycle.comparisons, R6C_POLICY, MTF_BASELINE);
    const report = renderMtfBaselineReport(baseline);
    assert.equal(report.markdown, readFileSync(mtfGoldenFile(R6C_GOLDEN), "utf8"));
    assert.deepEqual(wordingProblems(report.markdown), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
