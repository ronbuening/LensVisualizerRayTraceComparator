// Rungs R11a and R11b from end to end on stand-ins: the reports are golden, and say only what the wording allows.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { wordingProblems } from "../../src/report/wording.ts";
import { R11A_GOLDEN, R11B_GOLDEN, r11aCycle, r11bCycle } from "./r11Fixture.ts";
import { goldenFile } from "./support.ts";

test("R11a: a turned rim direction fails as the flux into the image, a stopped ray on the mask and the transmission", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r11a-"));
  try {
    const { comparisons, report } = await r11aCycle(root);
    // Two spans: the sweep, and the two lattices of the line together.
    const verdicts = comparisons.comparisons.map((set) => [
      set.mode,
      set.pairs.map((pair) => `${pair.a}-${pair.b} ${pair.verdict}`),
    ]);
    assert.deepEqual(verdicts, [
      ["reference-vs-each", ["ref-stopped FAIL", "ref-turned PASS"]],
      ["pairwise", ["ref-stopped FAIL", "ref-turned PASS", "stopped-turned FAIL"]],
      ["reference-vs-each", ["ref-stopped PASS", "ref-turned FAIL"]],
      ["pairwise", ["ref-stopped PASS", "ref-turned FAIL", "stopped-turned FAIL"]],
    ]);
    const stopped = comparisons.comparisons[0].pairs[0];
    // One ray of the 3-degree field of the 12 the axis lets through in both answers.
    assert.match(
      stopped.reason ?? "",
      /^mask\.mismatches 1 exceeds its tolerance 0 at line 0, ray 20, surface 2; transmission\.maxAbs 8\.33e-2 exceeds its tolerance 0 at line 0, ray 16$/,
    );
    const turned = comparisons.comparisons[2].pairs[1];
    assert.match(
      turned.reason ?? "",
      /^illumination\.maxAbs 1\.\d\de-6 exceeds its tolerance 1\.00e-9 at field 4, line 0$/,
    );
    // The sweep has no area: the flux into the image is no figure of it, neither measured nor missed.
    assert.ok(!stopped.metrics.some((metric) => metric.name === "illumination.maxAbs"));
    assert.ok(!(stopped.reason ?? "").includes("illumination"));
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R11A_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R11b: every field sorted before a difference; the landing marks the pair, the figures are only recorded", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r11b-"));
  try {
    const { comparisons, report } = await r11bCycle(root);
    const pairs = comparisons.comparisons.flatMap((set) => set.pairs);
    assert.ok(pairs.every((pair) => pair.class === "recorded" && pair.verdict === "ATTENTION"));
    const [pairwise] = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    const value = (name: string) => pairwise.pairs[0].metrics.find((metric) => metric.name === name)?.value;
    assert.equal(value("geometricTransmission.maxAbs"), 1 / 16);
    assert.equal(value("relativeIllumination.maxAbs"), 1 / 8);
    assert.equal(value("falloff.maxAbs"), Math.abs((1 - 8 / 32 + 1 / 8) / (1 - 8 / 64 + 1 / 16) - 0.75 / 0.875));
    assert.equal(value("chiefLanding.maxAbs"), 2 ** -12);
    assert.deepEqual(
      ["compared", "data", "unconverged", "unavailable"].map((kind) => value(`fields.${kind}`)),
      [2, 1, 1, 0],
    );
    const reason = pairwise.pairs[0].reason ?? "";
    assert.match(reason, /^chiefLanding\.maxAbs 2\.44e-4 is outside its attention band 1\.00e-5 at field 24, line 0; /);
    assert.match(reason, /line 0, field 16: numerical, unconverged \(lattice-flux: unconverged \(not-converged\)\)/);
    assert.ok(!reason.includes("geometricTransmission"), "no figure has a band");
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown, readFileSync(goldenFile(R11B_GOLDEN), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
