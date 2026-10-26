// Rungs R8a and R8b on the real engines, through `lvrtc run`, `compare` and `report`, on three runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, and at the best axial
// focus. The two rungs on all 96 runs are a measurement of their own (docs/REFERENCE.md, "Stage 6.3"), under a
// minute. Each test skips with the reason when LensVisualizer or optiland is missing. Run output goes to a temporary
// directory.
//
// R8a is gated: every pair of the three engines passes, every figure is measured, and no ray is valid in one engine
// and not in another. R8b is recorded: nothing here is held to a figure of an intercept. What is held is that
// LensVisualizer answers exactly the asks its sections answer and says why not of the others, that optiland answers
// every ask, that the spherical aberration of the design run is of two methods within the pupil limit, that the colour
// line is set aside as data because LensVisualizer's G channel (the d line, 587.56 nm, for a lens of d-line indices)
// traces indices that are not the case's, and that the report claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { AXIAL_NATIVE } from "../../../src/contract/quantities/axialNative.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir, worstOf } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R8A = loadPolicy().rungs.r8a;
const tolerance = (name: string): number => R8A.metrics[name].tolerance as number;

const DESIGN = "nikkor-z50f12-ref";
const PHOTOPIC = "nikkor-z50f12-photopic";
const BEST = "nikkor-z50f12-best-ref";
const RUNS = [DESIGN, PHOTOPIC, BEST];

/** The two asks of a run, in the order the case source makes them: spherical aberration, then axial colour. */
const ASKS = 2;
/** The sets of a run at each line: the profile's pairs, and the near-axis and marginal pairs. */
const SETS = 2;

/** The rung's limits of the sorting: two identifying rays of one line land within the first, two pupils' radii
 * differ by no more than the second of the larger, or the line is data. */
const SAME_LINE_MM = loadPolicy().rungs.r8b.metrics["landing.maxAbs"].attention as number;
const SAME_PUPIL = loadPolicy().rungs.r8b.metrics["pupilRadius.relative"].attention as number;

test(
  "R8a and R8b: the axial rays of LensVisualizer's two sections in three engines, and its sections beside optiland's",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );
    // R8b is asked of its own two engines whatever is named; R8a of the engines named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r8a,r8b",
    });

    // R8a: every set is traced by the three engines, and every pair passes with every figure measured.
    const traced = manifest.jobs.filter((job) => job.rung === "r8a");
    const sets = new Map(manifest.runs.map((run) => [run.name, run.axialRaySets?.sets.length ?? 0]));
    assert.equal(sets.get(DESIGN), SETS);
    assert.equal(sets.get(BEST), SETS);
    const photopicSets = sets.get(PHOTOPIC) ?? 0;
    assert.ok(photopicSets > SETS && photopicSets % SETS === 0, `${photopicSets}`);
    const total = 2 * SETS + photopicSets;
    assert.equal(traced.length, 3 * total);
    for (const job of traced) assert.equal(job.status, "ok", `${job.run} ${job.engine} ${job.requestId}`);
    const gated = pairsOf(comparisons, "r8a", RAYS_TRACE);
    assert.equal(gated.length, 3 * total);
    for (const pair of gated) {
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      assert.equal(pair.metrics["mask.mismatches"].value, 0, pair.run);
      assert.equal(pair.metrics["rays.dropped"].value, 0, pair.run);
      assert.ok((pair.metrics["rays.compared"].value ?? 0) > 0, pair.run);
      for (const figure of ["intercept.maxScaled", "focus.maxScaled", "focusRms.maxAbs"]) {
        assert.equal(typeof pair.metrics[figure]?.value, "number", `${pair.run} ${figure}`);
      }
    }
    for (const metric of ["intercept.maxScaled", "focus.maxScaled", "focusRms.maxAbs"]) {
      const worst = worstOf(gated, metric);
      assert.ok(worst.value <= tolerance(metric), `${metric} ${worst.value} at ${worst.at}`);
    }

    // R8b: LensVisualizer answers its sections' own asks: none on lines that are not its authored indices or its
    // channels, and none of a case off the design plane.
    const native = manifest.jobs.filter((job) => job.rung === "r8b");
    assert.deepEqual([...new Set(native.map((job) => job.engine))].sort(), ["lv", "optiland"]);
    assert.equal(native.length, 2 * ASKS * RUNS.length);
    const statuses = (run: string, engine: string): string[] =>
      native
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    assert.deepEqual(statuses(DESIGN, "lv"), ["ok", "ok"]);
    assert.deepEqual(statuses(PHOTOPIC, "lv"), ["lines.not-authored-reference", "lines.not-chromatic-channels"]);
    assert.deepEqual(statuses(BEST, "lv"), ["focus.off-design", "focus.off-design"]);
    for (const run of RUNS) assert.deepEqual(statuses(run, "optiland"), Array(ASKS).fill("ok"), run);

    const recorded = pairsOf(comparisons, "r8b", AXIAL_NATIVE);
    assert.equal(recorded.length, ASKS * RUNS.length);
    const answered = recorded.filter((pair) => pair.verdict === "RECORDED" || pair.verdict === "ATTENTION");
    assert.equal(answered.length, ASKS);
    for (const pair of recorded.filter((candidate) => !answered.includes(candidate))) {
      assert.equal(pair.verdict, "UNSUPPORTED", `${pair.run}: ${pair.reason ?? ""}`);
    }
    const value = (pair: (typeof answered)[number], name: string): number | null | undefined =>
      pair.metrics[name]?.value;
    const [spherical, colour] = answered;
    // Spherical aberration at the authored indices: two methods, every figure measured.
    assert.equal(spherical.verdict, "RECORDED");
    assert.equal(value(spherical, "fields.compared"), 1);
    const landing = value(spherical, "landing.maxAbs");
    assert.ok(typeof landing === "number" && landing <= SAME_LINE_MM, `${landing}`);
    const pupil = value(spherical, "pupilRadius.relative");
    assert.ok(typeof pupil === "number" && pupil <= SAME_PUPIL, `${pupil}`);
    for (const figure of ["marginalIntercept.maxAbs", "longitudinalSa.maxAbs", "bestFocus.maxAbs", "profile.maxAbs"]) {
      assert.equal(typeof value(spherical, figure), "number", figure);
    }
    // Axial colour at the reference line, LensVisualizer's G channel (the d line for these d-line indices): the line
    // is data, since LensVisualizer traces it at catalog indices that are not the case's (docs/gotchas.md, "Axial
    // rays"), and no colour figure is taken of it.
    assert.equal(value(colour, "fields.data"), 1);
    assert.equal(value(colour, "fields.compared"), 0);
    assert.match(colour.reason ?? "", /line 0: data, indices-differ \(lv-chromatic-tab traced indices up to /);
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === colour.requestId && candidate.mode === "pairwise",
    );
    const lv = set?.participants.find((participant) => participant.engine === "lv");
    const delta = lv?.recorded?.indexMaxDelta?.[0];
    assert.ok(typeof delta === "number" && delta > 0, `${delta}`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
