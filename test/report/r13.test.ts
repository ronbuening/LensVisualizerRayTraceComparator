// Rungs R13b and R14b from end to end on stand-ins: each report is golden, and says only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R13B_GOLDEN, R14B_GOLDEN, r13bCycle, r14bCycle } from "./r13Fixture.ts";
import { goldenFile } from "./support.ts";

test("R13b: the sums of two methods are recorded, the colour one engine states none of unmeasured", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r13b-"));
  try {
    const { comparisons, report } = await r13bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    // The stand-ins' SPHA 2^-30 apart over the 0.75 that cancels is 1.24e-9 scaled, beyond policy 24's band of 8e-15.
    assert.ok(pairs.every((pair) => pair.class === "recorded" && pair.verdict === "ATTENTION"));
    const [pairwise] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    const value = (name: string) => pairwise.pairs[0].metrics.find((metric) => metric.name === name)?.value;
    assert.equal(value("SPHA.maxAbs"), 2 ** -30);
    assert.equal(value("surfaces.maxAbs"), 2 ** -30);
    assert.equal(value("invariant.maxAbs"), 0);
    assert.equal(value("CLA.maxAbs"), undefined);
    const reason = pairwise.pairs[0].reason ?? "";
    assert.match(reason, /^total\.maxScaled \S+ is outside its attention band 8\.00e-15/);
    assert.match(reason, /CLA\.maxAbs was not measured: optiland-seidels states none/);
    assert.doesNotMatch(reason, /the rung sets no limit/);
    const recorded = pairwise.participants.find((participant) => participant.engine === "ref-seidel")?.recorded;
    assert.ok(recorded !== undefined && Number.isFinite(recorded.W040[0]) && Number.isFinite(recorded.W020[0]));
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R13B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R14b: a field one engine has no figures of is set aside, the other's coefficients recorded with field and term", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r14b-"));
  try {
    const { comparisons, report } = await r14bCycle(root);
    const [pairwise] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    const pair = pairwise.pairs[0];
    assert.equal(pair.verdict, "RECORDED");
    const metric = (name: string) => pair.metrics.find((entry) => entry.name === name);
    assert.deepEqual(metric("coefficients.maxAbs")?.where, { field: 0, term: 4 });
    assert.equal(metric("coefficients.maxAbs")?.value, 2 ** -40);
    assert.deepEqual(
      ["compared", "data", "unavailable"].map((kind) => metric(`fields.${kind}`)?.value),
      [1, 0, 1],
    );
    assert.match(pair.reason ?? "", /field 20: unsupported, no-curve \(optiland-zernike-fit: unavailable/);
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R14B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
