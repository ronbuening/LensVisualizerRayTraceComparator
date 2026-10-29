// Rung R12b from end to end on stand-ins: the report is golden, and says only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R12B_GOLDEN, r12bCycle } from "./r12Fixture.ts";
import { goldenFile } from "./support.ts";

test("R12b: every line sorted before a difference; the rear focus and the banded figures mark the pair", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r12b-"));
  try {
    const { comparisons, report } = await r12bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    assert.ok(pairs.every((pair) => pair.class === "recorded" && pair.verdict === "ATTENTION"));
    const [pairwise] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    const value = (name: string) => pairwise.pairs[0].metrics.find((metric) => metric.name === name)?.value;
    assert.equal(value("entrancePupilDiameter.maxAbs"), 1 / 64);
    assert.equal(value("imageSpaceFNumber.maxAbs"), Math.abs(50.5 / (12.625 + 1 / 64) - 4));
    assert.equal(value("paraxialWorkingFNumber.maxAbs"), undefined);
    assert.equal(value("rearFocus.maxAbs"), 2 ** -12);
    assert.equal(value("workingFNumber.maxAbs"), undefined);
    assert.deepEqual(
      ["compared", "data", "unavailable"].map((kind) => value(`lines.${kind}`)),
      [1, 1, 0],
    );
    const reason = pairwise.pairs[0].reason ?? "";
    // The pupil 1/64 mm wider and its image-space f-number are outside their bands; the rear foci apart set line 1 aside.
    assert.match(
      reason,
      /^entrancePupilDiameter\.maxAbs 1\.56e-2 is outside its attention band 2\.00e-12 at line 0; imageSpaceFNumber\.maxAbs 4\.94e-3 is outside its attention band 2\.00e-13 at line 0; rearFocus\.maxAbs 2\.44e-4 is outside its attention band 1\.00e-5 at line 1; /,
    );
    assert.match(reason, /paraxialWorkingFNumber\.maxAbs was not measured: lv-summary-tab states none/);
    assert.match(reason, /line 1: data, chief-landing-apart \(the rear focal points lie 2\.44e-4 mm apart\)/);
    assert.ok(!reason.includes("focalLength"), "a figure without a band marks nothing");
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R12B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
