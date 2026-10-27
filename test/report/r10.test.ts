// Rungs R10a and R10b from end to end on stand-ins: the reports are golden, and say only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R10A_GOLDEN, R10B_GOLDEN, r10aCycle, r10bCycle } from "./r10Fixture.ts";
import { goldenFile } from "./support.ts";

test("R10a: a moved landing fails as a landing and as a tangential focus, a stopped ray on the mask", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r10a-"));
  try {
    const { comparisons, report } = await r10aCycle(root);
    // Each line is a request of its own: the first line's set, then the second's.
    const verdicts = comparisons.comparisons.map((set) => [
      set.mode,
      set.pairs.map((pair) => `${pair.a}-${pair.b} ${pair.verdict}`),
    ]);
    assert.deepEqual(verdicts, [
      ["reference-vs-each", ["ref-moved PASS", "ref-stopped FAIL"]],
      ["pairwise", ["moved-ref PASS", "moved-stopped FAIL", "ref-stopped FAIL"]],
      ["reference-vs-each", ["ref-moved FAIL", "ref-stopped PASS"]],
      ["pairwise", ["moved-ref FAIL", "moved-stopped FAIL", "ref-stopped PASS"]],
    ]);
    const moved = comparisons.comparisons[2].pairs[0];
    assert.match(
      moved.reason ?? "",
      /^landing\.maxAbs 2\.98e-8 exceeds its tolerance 1\.00e-8 at line 1, ray 6; tangentialFocus\.maxScaled 1\.49e-8 exceeds its tolerance 1\.00e-8 at line 1, ray 9$/,
    );
    const stopped = comparisons.comparisons[0].pairs[1];
    assert.match(stopped.reason ?? "", /^mask\.mismatches 1 exceeds its tolerance 0/);
    // The stopped ray's field keeps its sagittal focus, of the one ray of its pair both engines brought to the image.
    const sagittal = stopped.metrics.find((metric) => metric.name === "sagittalFocus.maxScaled");
    assert.equal(sagittal?.value, 0);
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R10A_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R10b: every field sorted before a difference, the data set aside; a figure above its band is marked", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r10b-"));
  try {
    const { comparisons, report } = await r10bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    assert.ok(pairs.every((pair) => pair.class === "recorded" && pair.verdict === "ATTENTION"));
    const [pairwise] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    const value = (name: string) => pairwise.pairs[0].metrics.find((metric) => metric.name === name)?.value;
    assert.equal(value("tangentialShift.maxAbs"), 2 ** -20);
    assert.equal(value("sagittalShift.maxAbs"), 2 ** -16);
    assert.equal(value("astigmatism.maxAbs"), 2 ** -16);
    assert.equal(value("chiefLanding.maxAbs"), 0);
    assert.deepEqual([value("fields.compared"), value("fields.data"), value("fields.unavailable")], [3, 2, 1]);
    // The two figures above their bands of 1e-5 mm, and the tangential one within its band, unmarked.
    const reason = pairwise.pairs[0].reason ?? "";
    assert.match(reason, /^astigmatism\.maxAbs 1\.53e-5 is outside its attention band 1\.00e-5 at field 20, line 0; /);
    assert.match(reason, /sagittalShift\.maxAbs 1\.53e-5 is outside its attention band 1\.00e-5 at field 20, line 0; /);
    assert.ok(!reason.includes("tangentialShift"), reason);
    assert.match(
      reason,
      /line 1, field 0: data, indices-differ \(lv-field-curves traced indices up to 1\.53e-5 from the case's\)/,
    );
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R10B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
