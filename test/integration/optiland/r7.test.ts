// Rungs R7a and R7b on the real engines, through `lvrtc run`, `compare` and `report`, on three runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, and at the best axial
// focus. The two rungs on all 96 runs are a measurement of their own (docs/REFERENCE.md, "Stage 6.2"), under two
// minutes. Each test skips with the reason when LensVisualizer or optiland is missing. Run output goes to a
// temporary directory.
//
// R7a is gated: every pair of the three engines passes, every figure is measured, and no ray is valid in one engine
// and not in another. R7b is recorded: nothing here is held to a figure of a spot or a fan. What is held is that
// LensVisualizer answers exactly the asks its tabs answer and says why not of the others, that optiland answers
// every ask, that no field of two answers is set aside, and that the report claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import { SPOT_NATIVE } from "../../../src/contract/quantities/spotNative.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir, worstOf } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R7A = loadPolicy().rungs.r7a;
const tolerance = (name: string): number => R7A.metrics[name].tolerance as number;

const DESIGN = "nikkor-z50f12-ref";
const PHOTOPIC = "nikkor-z50f12-photopic";
const BEST = "nikkor-z50f12-best-ref";
const RUNS = [DESIGN, PHOTOPIC, BEST];

/** The four asks of a run, in the order the case source makes them: the coma cloud, its two fans, a bokeh tile. */
const ASKS = 4;
/** The sets of a run at each line: four coma fields, two fans, four bokeh fields, each with the chief ray last. */
const SETS = 10;

/**
 * The rung's limit of the sorting: two chief rays of one field land within it, or the field is data and the pair is
 * marked (1e-5 mm, owner decision 2026-10-26); the benchmark's largest distance is 1.40e-6 mm.
 */
const SAME_FIELD_MM = loadPolicy().rungs.r7b.metrics["chiefLanding.maxAbs"].attention as number;

test(
  "R7a and R7b: the rays of LensVisualizer's coma and bokeh tabs in three engines, and its tabs beside optiland's",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );
    // R7b is asked of its own two engines whatever is named; R7a of the engines named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r7a,r7b",
    });

    // R7a: every set is traced by the three engines, and every pair passes with every figure measured.
    const traced = manifest.jobs.filter((job) => job.rung === "r7a");
    // A set at every line of the case: R7a traces the photopic lines too, which LensVisualizer's tabs do not.
    const sets = new Map(manifest.runs.map((run) => [run.name, run.spotRaySets?.sets.length ?? 0]));
    assert.equal(sets.get(DESIGN), SETS);
    assert.equal(sets.get(BEST), SETS);
    const photopicSets = sets.get(PHOTOPIC) ?? 0;
    assert.ok(photopicSets > SETS && photopicSets % SETS === 0, `${photopicSets}`);
    const total = 2 * SETS + photopicSets;
    assert.equal(traced.length, 3 * total);
    for (const job of traced) assert.equal(job.status, "ok", `${job.run} ${job.engine} ${job.requestId}`);
    const gated = pairsOf(comparisons, "r7a", RAYS_TRACE);
    assert.equal(gated.length, 3 * total);
    for (const pair of gated) {
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      assert.equal(pair.metrics["mask.mismatches"].value, 0, pair.run);
      assert.equal(pair.metrics["rays.dropped"].value, 0, pair.run);
      assert.ok((pair.metrics["rays.compared"].value ?? 0) > 0, pair.run);
    }
    for (const metric of ["transverseError.maxAbs", "centroid.maxAbs", "rmsRadius.maxAbs"]) {
      const worst = worstOf(gated, metric);
      assert.ok(worst.value <= tolerance(metric), `${metric} ${worst.value} at ${worst.at}`);
    }

    // R7b: LensVisualizer answers its tabs' own asks: none on lines that are not its authored indices, and of a
    // case off the design plane only the bokeh tile, which the tab draws at a plane of its choosing.
    const native = manifest.jobs.filter((job) => job.rung === "r7b");
    assert.deepEqual([...new Set(native.map((job) => job.engine))].sort(), ["lv", "optiland"]);
    assert.equal(native.length, 2 * ASKS * RUNS.length);
    const statuses = (run: string, engine: string): string[] =>
      native
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    assert.deepEqual(statuses(DESIGN, "lv"), ["ok", "ok", "ok", "ok"]);
    assert.deepEqual(statuses(PHOTOPIC, "lv"), Array(ASKS).fill("lines.not-authored-reference"));
    assert.deepEqual(statuses(BEST, "lv"), ["focus.off-design", "focus.off-design", "focus.off-design", "ok"]);
    for (const run of RUNS) assert.deepEqual(statuses(run, "optiland"), Array(ASKS).fill("ok"), run);

    const recorded = pairsOf(comparisons, "r7b", SPOT_NATIVE);
    assert.equal(recorded.length, ASKS * RUNS.length);
    const answered = recorded.filter((pair) => pair.verdict === "RECORDED");
    assert.equal(answered.length, ASKS + 1);
    for (const pair of recorded.filter((candidate) => candidate.verdict !== "RECORDED")) {
      assert.equal(pair.verdict, "UNSUPPORTED", `${pair.run}: ${pair.reason ?? ""}`);
    }
    for (const pair of answered) {
      const value = (name: string): number | null | undefined => pair.metrics[name]?.value;
      const landing = value("chiefLanding.maxAbs");
      assert.ok(typeof landing === "number" && landing <= SAME_FIELD_MM, `${pair.run}: ${landing}`);
      assert.equal(value("fields.data"), 0, pair.run);
      assert.ok((value("fields.compared") ?? 0) >= 1, pair.run);
      // Each figure of the pattern was measured on two methods' fields.
      const figures =
        value("fanError.maxAbs") === undefined ? ["spotCentroid.maxAbs", "spotRmsRadius.maxAbs"] : ["fanError.maxAbs"];
      for (const figure of figures) assert.equal(typeof value(figure), "number", `${pair.run} ${figure}`);
    }

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
