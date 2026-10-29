// Rungs R8a and R8b on the real engines, through `lvrtc run`, `compare` and `report`, on three runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, and at the best axial
// focus. The two rungs on all 96 runs are a measurement of their own (docs/REFERENCE.md, "Stage 6.3"), under a
// minute. Each test skips with the reason when LensVisualizer or optiland is missing. Run output goes to a temporary
// directory.
//
// R8a is gated: every pair of the three engines passes, every figure is measured, and no ray is valid in one engine
// and not in another. R8b is recorded: nothing here is held to a figure of an intercept. What is held is that
// LensVisualizer answers exactly the asks its sections answer and says why not of the others, that optiland answers
// every ask, and that the report claims nothing it may not. Since LensVisualizer #927 the sections' zones are fractions
// of the real stop's radius and optiland's worker's of its paraxial entrance pupil at the first line: both pairs of the
// design run, the spherical aberration and the colour, are ATTENTION by their pupils' radii and no figure is measured,
// until optiland's axial aim moves to the real stop (the owner deferred it until after Phase 6; docs/gotchas.md,
// "Axial rays"). LensVisualizer #925's anchored G channel (the d line, 587.56 nm, for a lens of d-line
// indices) still traces the case's index to the bit.
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
/** The colour set (LensVisualizer #930): one more at a line that is a channel's, as the d line of these runs. */
const COLOUR_SETS = 1;

/** The rung's limit of the sorting by pupils: two pupils' radii differ by no more than it of the larger, or the line
 * is data. */
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
    // One line, the d line, LensVisualizer's G channel: the profile, the marginal rays and the colour.
    assert.equal(sets.get(DESIGN), SETS + COLOUR_SETS);
    assert.equal(sets.get(BEST), SETS + COLOUR_SETS);
    // The photopic lines are no channel's: the profile and the marginal rays at each line, no colour set.
    const photopicSets = sets.get(PHOTOPIC) ?? 0;
    assert.ok(photopicSets > SETS && photopicSets % SETS === 0, `${photopicSets}`);
    const total = 2 * (SETS + COLOUR_SETS) + photopicSets;
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
    // Both lines of the design run are of two pupils (LensVisualizer's real stop, 19.70 mm, optiland's paraxial
    // entrance pupil, 20.85 mm, 5.5e-2 apart at LensVisualizer 607ff23ae): each pair ATTENTION by
    // `pupilRadius.relative` beyond its limit, and no figure measured. On this lens the line is not even set aside as
    // data: the figures are formed at the marginal fraction LensVisualizer took, 0.97, and optiland's rays at 0.97 of
    // its larger pupil do not arrive (its own first arriving marginal pair is at 0.95), so they give no figures and the
    // line is unsupported.
    for (const [pair, figures] of [
      [spherical, ["marginalIntercept.maxAbs", "longitudinalSa.maxAbs", "bestFocus.maxAbs", "profile.maxAbs"]],
      [colour, ["lineFocus.maxAbs"]],
    ] as const) {
      assert.equal(pair.verdict, "ATTENTION", pair.reason ?? "");
      assert.deepEqual(
        [value(pair, "fields.compared"), value(pair, "fields.data"), value(pair, "fields.unavailable")],
        [0, 0, 1],
        pair.reason ?? "",
      );
      const pupil = value(pair, "pupilRadius.relative");
      assert.ok(typeof pupil === "number" && pupil > SAME_PUPIL, `${pupil}`);
      assert.match(pair.reason ?? "", /^pupilRadius\.relative \S+ is outside its attention band/);
      assert.match(pair.reason ?? "", /line 0: unsupported, no-curve \(optiland-real-rays: no figures of its rays\)/);
      for (const figure of [...figures, "landing.maxAbs"]) assert.equal(value(pair, figure), undefined, figure);
    }
    // Axial colour at the reference line, LensVisualizer's G channel (the d line for these d-line indices): since
    // LensVisualizer #925 its indices are the authored ones, the case's to the bit (docs/gotchas.md, "Axial rays").
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === colour.requestId && candidate.mode === "pairwise",
    );
    const lv = set?.participants.find((participant) => participant.engine === "lv");
    assert.equal(lv?.recorded?.indexMaxDelta?.[0], 0);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
