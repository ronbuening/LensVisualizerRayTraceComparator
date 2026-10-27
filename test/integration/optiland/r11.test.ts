// Rungs R11a and R11b on the real engines, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, the same at the best
// axial focus, and a retrofocus wide angle on its reference line. The two rungs on all 96 runs are a measurement of
// their own (docs/REFERENCE.md, "Stage 6.6"), a few minutes. Each test skips with the reason when LensVisualizer or
// optiland is missing. Run output goes to a temporary directory.
//
// R11a is gated: every pair of the three engines passes, no ray is valid in one engine and not in another, every
// field's flux into the image is measured and so is the landing of the image mapping's chief rays. R11b is recorded, of
// LensVisualizer and the engine `flux`. What is held is that LensVisualizer answers exactly the ask its tab answers and
// says why not of the other, that `flux` answers every ask, that every field of the design runs is of two methods within
// the limit of the sorting, that since LensVisualizer #925 the tab's beam grows across the wide angle's field as the
// flux's lattice does (docs/gotchas.md, "Vignetting"), and that the report claims nothing it may not.
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

    // R11a: the tab's beam of each field at each line, traced by the three engines.
    const traced = manifest.jobs.filter((job) => job.rung === "r11a");
    for (const run of manifest.runs) {
      const lines = run.name === PHOTOPIC ? 5 : 1;
      assert.deepEqual(run.vignettingRaySets?.problems, [], run.name);
      assert.equal(run.vignettingRaySets?.sets.length, lines * FIELDS[run.name], run.name);
    }
    const total = manifest.runs.reduce((sum, run) => sum + (run.vignettingRaySets?.sets.length ?? 0), 0);
    assert.equal(traced.length, 3 * total);
    for (const job of traced) assert.equal(job.status, "ok", `${job.run} ${job.engine} ${job.requestId}`);
    // The pairs are of spans: the beams of a line, one span a line.
    const gated = pairsOf(comparisons, "r11a", RAYS_TRACE);
    assert.equal(gated.length, 3 * (1 + 5 + 1 + 1));
    for (const pair of gated) {
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      assert.equal(pair.metrics["mask.mismatches"].value, 0, pair.run);
      assert.equal(pair.metrics["rays.dropped"].value, 0, pair.run);
      assert.equal(pair.metrics["transmission.maxAbs"].value, 0, pair.run);
      assert.equal(pair.metrics["transmission.rimBandOrFailed"].value, 0, pair.run);
      // Every field has a flux into the image in both answers and its mapping's chief rays land in both: the rung does
      // not pass vacuously.
      assert.equal(pair.metrics["fields.compared"].value, FIELDS[pair.run], pair.run);
      assert.equal(typeof pair.metrics["landing.maxAbs"]?.value, "number", pair.run);
    }
    for (const figure of ["illumination.maxAbs", "landing.maxAbs"]) {
      const worst = worstOf(gated, figure);
      assert.ok(worst.value <= (R11A.metrics[figure].tolerance as number), `${figure} ${worst.value}`);
      t.diagnostic(`R11a ${figure}: ${worst.value} at ${worst.at}`);
    }
    assert.ok(
      worstOf(gated, "illumination.maxAbs").value > 0,
      "the exit directions of the three engines differ in their last bits somewhere",
    );

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

    // The wide angle: the stop's image grows across the field, and since LensVisualizer #925 the tab's beam in two
    // dimensions grows with it, as the flux's lattice does: both by more than a third toward the edge, within 0.02 of
    // each other at every field (at 098c91ef6, 1.4766 and 1.4774 at their largest, 6.4e-3 apart at worst).
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === of(WIDE).requestId && candidate.mode === "pairwise",
    );
    const side = (engine: string) => set?.participants.find((participant) => participant.engine === engine)?.recorded;
    const [lv, flux] = [side("lv"), side("flux")];
    assert.ok(lv !== undefined && flux !== undefined);
    const largest = (values: readonly (number | null)[]): number => Math.max(...values.map((v) => v ?? Number.NaN));
    const [tab, area] = [largest(lv.geometricTransmission), largest(flux.geometricTransmission)];
    assert.ok(tab > 1.3 && area > 1.3, `the tab's beam ${tab}, the flux's ${area}`);
    lv.geometricTransmission.forEach((value, at) =>
      assert.ok(Math.abs((value ?? Number.NaN) - (flux.geometricTransmission[at] ?? Number.NaN)) <= 0.02, `${at}`),
    );
    t.diagnostic(`${WIDE}: the tab's largest geometric transmission ${tab}, the flux's ${area}`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
