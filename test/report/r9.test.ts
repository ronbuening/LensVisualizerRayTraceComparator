// Rungs R9a and R9b from end to end on stand-ins: the reports are golden, and say only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R9A_GOLDEN, R9B_GOLDEN, r9aCycle, r9bCycle } from "./r9Fixture.ts";
import { goldenFile } from "./support.ts";

test("R9a: a moved landing fails as a landing, a lateral colour and a distortion, a stopped ray on the mask", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r9a-"));
  try {
    const { comparisons, report } = await r9aCycle(root);
    // The two lines are one span: one comparison of each mode.
    const verdicts = comparisons.comparisons.map((set) => [
      set.mode,
      set.pairs.map((pair) => `${pair.a}-${pair.b} ${pair.verdict}`),
    ]);
    assert.deepEqual(verdicts, [
      ["reference-vs-each", ["ref-moved FAIL", "ref-stopped FAIL"]],
      ["pairwise", ["moved-ref FAIL", "moved-stopped FAIL", "ref-stopped FAIL"]],
    ]);
    const [moved, stopped] = comparisons.comparisons[0].pairs;
    assert.match(
      moved.reason ?? "",
      /^distortion\.maxScaled 1\.49e-8 exceeds its tolerance 1\.00e-8 at line 1, ray 2; landing\.maxAbs 1\.49e-8 exceeds its tolerance 1\.00e-8 at line 1, ray 2; lateralColour\.maxAbs 1\.49e-8 exceeds its tolerance 1\.00e-8 at line 1, ray 2$/,
    );
    assert.match(stopped.reason ?? "", /^mask\.mismatches 1 exceeds its tolerance 0/);
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R9A_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R9b: every field sorted before a difference; no band, so a figure is recorded and only a far landing sorts", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r9b-"));
  try {
    const { comparisons, report } = await r9bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    assert.ok(pairs.every((pair) => pair.class === "recorded" && pair.verdict === "RECORDED"));
    const [distortion, lateral, pupils] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    const value = (set: typeof distortion, name: string) =>
      set.pairs[0].metrics.find((metric) => metric.name === name)?.value;
    assert.equal(value(distortion, "distortionPercent.maxAbs"), Math.abs((100 * 2 ** -12) / -5));
    assert.equal(value(distortion, "realHeight.maxAbs"), 2 ** -12);
    assert.equal(value(distortion, "idealHeight.maxAbs"), 0);
    assert.equal(value(distortion, "focalScale.relative"), 2 ** -14 / (28.5 + 2 ** -14));
    assert.equal(value(distortion, "fields.unavailable"), 1);
    assert.equal(value(lateral, "lateralColour.maxAbs"), 2 ** -20);
    assert.equal(value(lateral, "chiefLanding.maxAbs"), 2 ** -20);
    assert.equal(value(lateral, "fields.data"), 1);
    assert.equal(value(pupils, "entrancePupil.maxAbs"), 2 ** -8);
    assert.equal(value(pupils, "exitPupil.maxAbs"), 0);
    assert.equal(value(pupils, "paraxialEntrancePupil.maxAbs"), 2 ** -20);
    assert.equal(value(pupils, "paraxialExitPupil.maxAbs"), 0);
    assert.match(
      lateral.pairs[0].reason ?? "",
      /line 1, field 20: data, indices-differ \(lv-chromatic-tab traced indices up to 1\.53e-5 from the case's\)/,
    );
    assert.match(
      distortion.pairs[0].reason ?? "",
      /line 0, field 20: unsupported, no-curve \(optiland-distortion: unavailable \(no-scale\)\)/,
    );
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R9B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
