// Rungs R10a and R10b on the real engines, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, the same at the best
// axial focus, and a long telephoto on its reference line. The two rungs on all 96 runs are a measurement of their
// own (docs/REFERENCE.md, "Stage 6.5"), a few minutes. Each test skips with the reason when LensVisualizer or optiland
// is missing. Run output goes to a temporary directory.
//
// R10a is gated: every pair of the three engines passes, every focus is measured, and no ray is valid in one engine
// and not in another. R10b is recorded, with attention bands of 1e-5 mm on its three figures. What is held is that
// LensVisualizer answers exactly the ask its sections answer and says why not of the other, that optiland answers
// every ask, that every field of the design run is of two methods within the limit of the sorting and within its bands
// (LensVisualizer's parabasal pencil of 0.01 mm against optiland's infinitesimal pair, docs/gotchas.md, "Field
// curves"), so its pair is RECORDED and not ATTENTION, that the telephoto's tangential foci below one degree are those
// of LensVisualizer's paraxial chief ray, and that the report claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { CURVATURE_NATIVE } from "../../../src/contract/quantities/curvatureNative.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir, worstOf } from "./support.ts";
import type { RungPair } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R10A = loadPolicy().rungs.r10a;
const R10B = loadPolicy().rungs.r10b;
const tolerance = (name: string): number => R10A.metrics[name].tolerance as number;

const DESIGN = "nikkor-z50f12-ref";
const PHOTOPIC = "nikkor-z50f12-photopic";
const BEST = "nikkor-z50f12-best-ref";
const LONG = "sony-fe-400mm-f28-gm-oss-ref";
const RUNS = [DESIGN, PHOTOPIC, BEST, LONG];

/** The sets of a run at each line, one for each pattern: the parabasal rays and the real-ray fans. */
const PATTERNS = 2;
/** The fields of LensVisualizer's field curves: its marked fields and its curve's, each fraction once. */
const FIELDS = 17;

/** The rung's limit of the sorting: two identifying chief rays land within it, or the field is data. */
const SAME_FIELD_MM = R10B.metrics["chiefLanding.maxAbs"].attention as number;

test(
  "R10a and R10b: LensVisualizer's field-curve rays in three engines, and its field curves beside optiland's",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );
    // R10b is asked of its own two engines whatever is named; R10a of the engines named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r10a,r10b",
    });

    // R10a: every set is traced by the three engines, and every pair passes with its foci measured.
    const traced = manifest.jobs.filter((job) => job.rung === "r10a");
    const sets = new Map(manifest.runs.map((run) => [run.name, run.curvatureRaySets?.sets.length ?? 0]));
    for (const run of [DESIGN, BEST, LONG]) assert.equal(sets.get(run), PATTERNS, run);
    const photopicSets = sets.get(PHOTOPIC) ?? 0;
    assert.ok(photopicSets > PATTERNS && photopicSets % PATTERNS === 0, `${photopicSets}`);
    const total = [...sets.values()].reduce((sum, count) => sum + count, 0);
    assert.equal(traced.length, 3 * total);
    for (const job of traced) assert.equal(job.status, "ok", `${job.run} ${job.engine} ${job.requestId}`);
    const gated = pairsOf(comparisons, "r10a", RAYS_TRACE);
    assert.equal(gated.length, 3 * total);
    for (const pair of gated) {
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      assert.equal(pair.metrics["mask.mismatches"].value, 0, pair.run);
      assert.equal(pair.metrics["rays.dropped"].value, 0, pair.run);
      // Every field of every set has both foci in both answers: the rung does not pass vacuously.
      assert.equal(pair.metrics["fields.compared"].value, FIELDS, pair.run);
      for (const figure of ["landing.maxAbs", "tangentialFocus.maxScaled", "sagittalFocus.maxScaled"]) {
        assert.equal(typeof pair.metrics[figure]?.value, "number", `${pair.run} ${figure}`);
      }
    }
    for (const metric of ["landing.maxAbs", "tangentialFocus.maxScaled", "sagittalFocus.maxScaled"]) {
      const worst = worstOf(gated, metric);
      assert.ok(worst.value <= tolerance(metric), `${metric} ${worst.value} at ${worst.at}`);
      t.diagnostic(`R10a ${metric}: ${worst.value} at ${worst.at}`);
    }
    // Along the axis a parabasal focus moves by a rounding of a landing over its small relative slope: the plain
    // difference is shown, far above the scaled one, and is never judged.
    const along = worstOf(gated, "tangentialFocus.maxAbs");
    assert.ok(along.value > 1000 * worstOf(gated, "tangentialFocus.maxScaled").value, `${along.value}`);
    t.diagnostic(`R10a tangentialFocus.maxAbs, shown: ${along.value} at ${along.at}`);

    // R10b: LensVisualizer answers its sections' ask at the authored line; a photopic run has no line of theirs and no
    // ask, and a case off the design plane is refused.
    const native = manifest.jobs.filter((job) => job.rung === "r10b");
    assert.deepEqual([...new Set(native.map((job) => job.engine))].sort(), ["lv", "optiland"]);
    assert.equal(native.length, 2 * 3);
    assert.ok(!native.some((job) => job.run === PHOTOPIC));
    const statuses = (run: string, engine: string): string[] =>
      native
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    assert.deepEqual(statuses(DESIGN, "lv"), ["ok"]);
    assert.deepEqual(statuses(LONG, "lv"), ["ok"]);
    assert.deepEqual(statuses(BEST, "lv"), ["focus.off-design"]);
    for (const run of [DESIGN, BEST, LONG]) assert.deepEqual(statuses(run, "optiland"), ["ok"], run);

    const recorded = pairsOf(comparisons, "r10b", CURVATURE_NATIVE);
    assert.equal(recorded.length, 3);
    const of = (run: string): RungPair => recorded.find((pair) => pair.run === run)!;
    assert.equal(of(BEST).verdict, "UNSUPPORTED");
    const value = (pair: RungPair, name: string): number | null | undefined => pair.metrics[name]?.value;
    for (const run of [DESIGN, LONG]) {
      const pair = of(run);
      assert.equal(pair.verdict, "RECORDED", `${run}: ${pair.reason ?? ""}`);
      assert.deepEqual(
        [value(pair, "fields.compared"), value(pair, "fields.data"), value(pair, "fields.unavailable")],
        [FIELDS, 0, 0],
        run,
      );
      const landing = value(pair, "chiefLanding.maxAbs");
      assert.ok(typeof landing === "number" && landing <= SAME_FIELD_MM, `${run} ${landing}`);
      for (const figure of ["tangentialShift.maxAbs", "sagittalShift.maxAbs", "astigmatism.maxAbs"]) {
        const difference = value(pair, figure);
        const band = R10B.metrics[figure].attention as number;
        assert.ok(typeof difference === "number" && difference <= band, `${run} ${figure} ${difference}`);
        t.diagnostic(`R10b ${run} ${figure}: ${difference}`);
      }
    }

    // The telephoto below one degree: LensVisualizer's chief ray there is its paraxial estimate, and the parabasal
    // pair about it has its tangential focus about two millionths of a millimetre from optiland's about the stop's
    // centre; its sagittal focus, which no coma moves, a tenth of that.
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === of(LONG).requestId && candidate.mode === "pairwise",
    );
    const side = (engine: string) => set?.participants.find((participant) => participant.engine === engine)?.recorded;
    const [lv, optiland] = [side("lv"), side("optiland")];
    assert.ok(lv !== undefined && optiland !== undefined);
    const number = (values: readonly (number | null)[], at: number): number => values[at] ?? Number.NaN;
    let below = 0;
    let sagittalBelow = 0;
    for (const at of lv.fieldAngleDeg.keys()) {
      const angle = number(lv.fieldAngleDeg, at);
      if (!(angle > 0 && angle < 1)) continue;
      below = Math.max(below, Math.abs(number(lv.tangentialShiftMm, at) - number(optiland.tangentialShiftMm, at)));
      sagittalBelow = Math.max(
        sagittalBelow,
        Math.abs(number(lv.sagittalShiftMm, at) - number(optiland.sagittalShiftMm, at)),
      );
    }
    assert.ok(below > 1e-6, `${below}`);
    assert.ok(sagittalBelow < below / 5, `${sagittalBelow} against ${below}`);
    t.diagnostic(`${LONG} below one degree: tangential ${below} mm, sagittal ${sagittalBelow} mm apart`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
