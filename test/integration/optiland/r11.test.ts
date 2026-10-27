// Rungs R11a and R11b on the real engines, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, the same at the best
// axial focus, and a retrofocus wide angle on its reference line. The two rungs on all 96 runs are a measurement of
// their own (docs/REFERENCE.md, "Stage 6.6"), a few minutes. Each test skips with the reason when LensVisualizer or
// optiland is missing. Run output goes to a temporary directory.
//
// R11a is gated: every pair of the three engines passes, no ray is valid in one engine and not in another, and every
// lattice field's flux into the image is measured. R11b is recorded, of LensVisualizer and the engine `flux`. What is
// held is that LensVisualizer answers exactly the ask its tab answers and says why not of the other, that `flux`
// answers every ask, that every field of the design runs is of two methods within the limit of the sorting, and that
// the wide angle's beam grows across the field in two dimensions where the tab's sweep of a fixed width does not see it
// (docs/gotchas.md, "Vignetting"), and that the report claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import { VIGNETTING_NATIVE } from "../../../src/contract/quantities/vignettingNative.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir, worstOf } from "./support.ts";
import type { RungPair } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R11A = loadPolicy().rungs.r11a;
const R11B = loadPolicy().rungs.r11b;

const DESIGN = "nikkor-z50f12-ref";
const PHOTOPIC = "nikkor-z50f12-photopic";
const BEST = "nikkor-z50f12-best-ref";
const WIDE = "sony-fe-20mm-f18-g-ref";
const RUNS = [DESIGN, PHOTOPIC, BEST, WIDE];

/** The vignetting tab's fields of each lens: about every 3 degrees of its half field, at least 7. */
const FIELDS: Readonly<Record<string, number>> = {
  [DESIGN]: 9,
  [PHOTOPIC]: 9,
  [BEST]: 9,
  [WIDE]: 17,
};

/** The rung's limit of the sorting: two identifying chief rays land within it, or the field is data. */
const SAME_FIELD_MM = R11B.metrics["chiefLanding.maxAbs"].attention as number;

test(
  "R11a and R11b: LensVisualizer's vignetting rays in three engines, and its tab beside the flux in two dimensions",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );
    // R11b is asked of its own two engines whatever is named; R11a of the engines named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r11a,r11b",
    });

    // R11a: a sweep set and a lattice of each field at each line, traced by the three engines.
    const traced = manifest.jobs.filter((job) => job.rung === "r11a");
    for (const run of manifest.runs) {
      const lines = run.name === PHOTOPIC ? 5 : 1;
      assert.deepEqual(run.vignettingRaySets?.problems, [], run.name);
      assert.equal(run.vignettingRaySets?.sets.length, lines * (1 + FIELDS[run.name]), run.name);
    }
    const total = manifest.runs.reduce((sum, run) => sum + (run.vignettingRaySets?.sets.length ?? 0), 0);
    assert.equal(traced.length, 3 * total);
    for (const job of traced) assert.equal(job.status, "ok", `${job.run} ${job.engine} ${job.requestId}`);
    // The pairs are of spans: the sweep and the lattices of a line, two a line.
    const gated = pairsOf(comparisons, "r11a", RAYS_TRACE);
    assert.equal(gated.length, 3 * 2 * (1 + 5 + 1 + 1));
    let lattices = 0;
    for (const pair of gated) {
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      assert.equal(pair.metrics["mask.mismatches"].value, 0, pair.run);
      assert.equal(pair.metrics["rays.dropped"].value, 0, pair.run);
      assert.equal(pair.metrics["transmission.maxAbs"].value, 0, pair.run);
      assert.equal(pair.metrics["transmission.rimBandOrFailed"].value, 0, pair.run);
      if (pair.metrics["illumination.maxAbs"] === undefined) continue;
      // Every lattice field has a flux into the image in both answers: the rung does not pass vacuously.
      assert.equal(pair.metrics["fields.compared"].value, FIELDS[pair.run], pair.run);
      lattices++;
    }
    assert.equal(lattices, 3 * (1 + 5 + 1 + 1));
    const worst = worstOf(
      gated.filter((pair) => pair.metrics["illumination.maxAbs"] !== undefined),
      "illumination.maxAbs",
    );
    assert.ok(worst.value <= (R11A.metrics["illumination.maxAbs"].tolerance as number), `${worst.value}`);
    assert.ok(worst.value > 0, "the exit directions of the three engines differ in their last bits somewhere");
    t.diagnostic(`R11a illumination.maxAbs: ${worst.value} at ${worst.at}`);

    // R11b: LensVisualizer answers its tab's ask at the authored line; a photopic run has no line of the tab's and no
    // ask, and a case off the design plane is refused by lv and answered by flux.
    const native = manifest.jobs.filter((job) => job.rung === "r11b");
    assert.deepEqual([...new Set(native.map((job) => job.engine))].sort(), ["flux", "lv"]);
    assert.equal(native.length, 2 * 3);
    assert.ok(!native.some((job) => job.run === PHOTOPIC));
    const statuses = (run: string, engine: string): string[] =>
      native
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    assert.deepEqual(statuses(DESIGN, "lv"), ["ok"]);
    assert.deepEqual(statuses(WIDE, "lv"), ["ok"]);
    assert.deepEqual(statuses(BEST, "lv"), ["focus.off-design"]);
    for (const run of [DESIGN, BEST, WIDE]) assert.deepEqual(statuses(run, "flux"), ["ok"], run);

    const recorded = pairsOf(comparisons, "r11b", VIGNETTING_NATIVE);
    assert.equal(recorded.length, 3);
    const of = (run: string): RungPair => recorded.find((pair) => pair.run === run)!;
    assert.equal(of(BEST).verdict, "UNSUPPORTED");
    const value = (pair: RungPair, name: string): number | null | undefined => pair.metrics[name]?.value;
    for (const run of [DESIGN, WIDE]) {
      const pair = of(run);
      assert.equal(pair.verdict, "RECORDED", `${run}: ${pair.reason ?? ""}`);
      assert.deepEqual(
        ["fields.compared", "fields.data", "fields.unconverged", "fields.unavailable"].map((name) => value(pair, name)),
        [FIELDS[run], 0, 0, 0],
        run,
      );
      const landing = value(pair, "chiefLanding.maxAbs");
      assert.ok(typeof landing === "number" && landing <= SAME_FIELD_MM, `${run} ${landing}`);
      for (const figure of ["geometricTransmission.maxAbs", "falloff.maxAbs", "relativeIllumination.maxAbs"]) {
        t.diagnostic(`R11b ${run} ${figure}: ${value(pair, figure)}`);
      }
    }

    // The wide angle: the tab sweeps a chord of the axis's pupil across each field, which the stop's growing image
    // overfills; the beam's area in two dimensions grows by a third and more toward the edge, where the sweep's
    // fraction cannot pass the axis's by much.
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === of(WIDE).requestId && candidate.mode === "pairwise",
    );
    const side = (engine: string) => set?.participants.find((participant) => participant.engine === engine)?.recorded;
    const [lv, flux] = [side("lv"), side("flux")];
    assert.ok(lv !== undefined && flux !== undefined);
    const largest = (values: readonly (number | null)[]): number => Math.max(...values.map((v) => v ?? Number.NaN));
    const [swept, area] = [largest(lv.geometricTransmission), largest(flux.geometricTransmission)];
    assert.ok(swept < 1.1 && area > 1.3, `the sweep ${swept}, the beam's area ${area}`);
    t.diagnostic(`${WIDE}: the tab's largest geometric transmission ${swept}, the beam's area ${area}`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
