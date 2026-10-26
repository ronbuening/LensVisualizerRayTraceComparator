// Rungs R8a and R8b from end to end on stand-ins: the reports are golden, and say only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R8A_GOLDEN, R8B_GOLDEN, r8aCycle, r8bCycle } from "./r8Fixture.ts";
import { goldenFile } from "./support.ts";

test("R8a: a moved exit fails on its intercept, a stopped ray on the mask, a faithful copy passes", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r8a-"));
  try {
    const { comparisons, report } = await r8aCycle(root);
    const verdicts = comparisons.comparisons
      .filter((set) => set.mode === "reference-vs-each")
      .map((set) => set.pairs.map((pair) => `${pair.b} ${pair.verdict}`));
    assert.deepEqual(verdicts, [
      ["moved PASS", "stopped FAIL"],
      ["moved FAIL", "stopped PASS"],
    ]);
    const moved = comparisons.comparisons[2].pairs[0];
    assert.match(
      moved.reason ?? "",
      /^intercept\.maxScaled 1\.49e-8 exceeds its tolerance 1\.00e-8 at field 0, line 1, ray 2$/,
    );
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R8A_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R8b: every line sorted before a difference; a spherical figure past its band is ATTENTION, colour has none", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r8b-"));
  try {
    const { comparisons, report } = await r8bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    assert.ok(pairs.every((pair) => pair.class === "recorded"));
    const [spherical, colour] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    // The near-axis intercepts differ by a 1024th, beyond the spherical figures' band of 1e-10 mm; the colour
    // figures have no band, and their 2^-20 is recorded.
    assert.equal(spherical.pairs[0].verdict, "ATTENTION");
    assert.match(
      spherical.pairs[0].reason ?? "",
      /^longitudinalSa\.maxAbs 9\.77e-4 is outside its attention band 1\.00e-10/,
    );
    assert.equal(colour.pairs[0].verdict, "RECORDED");
    const value = (set: typeof spherical, name: string) =>
      set.pairs[0].metrics.find((metric) => metric.name === name)?.value;
    assert.equal(value(spherical, "nearAxisIntercept.maxAbs"), 1 / 1024);
    assert.equal(value(colour, "relativeFocus.maxAbs"), 2 ** -20);
    assert.equal(value(colour, "lineFocus.maxAbs"), 2 ** -20);
    assert.equal(value(colour, "fields.compared"), 2);
    assert.equal(value(colour, "paraxialFocalShift.maxAbs"), Math.abs(1 / 64 + 2 ** -20 - 1 / 32));
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R8B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
