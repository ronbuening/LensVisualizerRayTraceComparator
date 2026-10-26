// Rungs R7a and R7b from end to end on stand-ins: the reports are golden, and say only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R7A_GOLDEN, R7B_GOLDEN, r7aCycle, r7bCycle } from "./r7Fixture.ts";
import { goldenFile } from "./support.ts";

test("R7a: a moved landing fails on its transverse error, a stopped ray on the mask, a faithful copy passes", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r7a-"));
  try {
    const { comparisons, report } = await r7aCycle(root);
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
      /^transverseError\.maxAbs 1\.49e-8 exceeds its tolerance 1\.00e-8 at field 0, line 1, ray 2$/,
    );
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R7A_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R7b: every pair is recorded, every field sorted before a difference, and no band is the comparator's own", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r7b-"));
  try {
    const { comparisons, report } = await r7bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    assert.ok(pairs.every((pair) => pair.verdict === "RECORDED" && pair.class === "recorded"));
    const doubleGauss = comparisons.comparisons.filter((set) => set.run === "double-gauss" && set.mode === "pairwise");
    assert.match(doubleGauss[0].pairs[0].reason ?? "", /field 0\.5: data, chief-landing-unknown/);
    assert.match(doubleGauss[0].pairs[0].reason ?? "", /field 0\.75: unsupported, no-curve/);
    assert.match(doubleGauss[1].pairs[0].reason ?? "", /field 0\.75: data, lines-differ/);
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R7B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
