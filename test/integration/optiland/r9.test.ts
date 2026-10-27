// Rungs R9a and R9b on the real engines, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark:
// a lens wide open on its reference line at its design plane, the same on the photopic lines, the same at the best
// axial focus, and a long telephoto on its reference line. The two rungs on all 96 runs are a measurement of their
// own (docs/REFERENCE.md, "Stage 6.4"), a few minutes. Each test skips with the reason when LensVisualizer or optiland
// is missing. Run output goes to a temporary directory.
//
// R9a is gated: every pair of the three engines passes, every figure is measured where it applies, and no ray is valid
// in one engine and not in another. R9b is recorded: nothing here is held to a figure of a distortion or a pupil. What
// is held is that LensVisualizer answers exactly the asks its tabs answer and says why not of the others, that optiland
// answers every ask, that the distortion and the pupils of the design run are of two methods within the limit of the
// sorting, that the lateral colour of one line is of two methods since LensVisualizer #925 anchored its G channel to
// the authored index and solves each channel's own chief ray, that LensVisualizer's pupils of a field below one degree
// are of a chief ray through the stop's centre since #925 too (docs/gotchas.md, "Chief rays"), and that the report
// claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { CHIEF_NATIVE } from "../../../src/contract/quantities/chiefNative.ts";
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
const R9A = loadPolicy().rungs.r9a;
const tolerance = (name: string): number => R9A.metrics[name].tolerance as number;

const DESIGN = "nikkor-z50f12-ref";
const PHOTOPIC = "nikkor-z50f12-photopic";
const BEST = "nikkor-z50f12-best-ref";
const LONG = "sony-fe-400mm-f28-gm-oss-ref";
const RUNS = [DESIGN, PHOTOPIC, BEST, LONG];

/** The sets of a run at each line, one for each pattern: the distortion curve and grid, the pupils, lateral colour. */
const PATTERNS = 4;
/** The three asks of a run, in the order the case source makes them: distortion, pupils, lateral colour. */
const ASKS = 3;

/** The rung's limit of the sorting: two identifying chief rays land within it, or the field is data. */
const SAME_FIELD_MM = loadPolicy().rungs.r9b.metrics["chiefLanding.maxAbs"].attention as number;

test(
  "R9a and R9b: LensVisualizer's chief rays in three engines, and its distortion, pupils and lateral-colour tabs beside optiland's",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );
    // R9b is asked of its own two engines whatever is named; R9a of the engines named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r9a,r9b",
    });

    // R9a: every set is traced by the three engines at every line, and every pair of a span passes.
    const traced = manifest.jobs.filter((job) => job.rung === "r9a");
    const lines = new Map(manifest.runs.map((run) => [run.name, run.chiefRaySets?.sets.length ?? 0]));
    for (const run of [DESIGN, BEST, LONG]) assert.equal(lines.get(run), PATTERNS, run);
    const photopicSets = lines.get(PHOTOPIC) ?? 0;
    assert.ok(photopicSets > PATTERNS && photopicSets % PATTERNS === 0, `${photopicSets}`);
    const total = [...lines.values()].reduce((sum, count) => sum + count, 0);
    assert.equal(traced.length, 3 * total);
    for (const job of traced) assert.equal(job.status, "ok", `${job.run} ${job.engine} ${job.requestId}`);
    // The lines of a set are one span: three pairs of each pattern of each run.
    const gated = pairsOf(comparisons, "r9a", RAYS_TRACE);
    assert.equal(gated.length, 3 * PATTERNS * RUNS.length);
    for (const pair of gated) {
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      assert.equal(pair.metrics["mask.mismatches"].value, 0, pair.run);
      assert.equal(pair.metrics["rays.dropped"].value, 0, pair.run);
      assert.ok((pair.metrics["rays.compared"].value ?? 0) > 0, pair.run);
      for (const figure of ["landing.maxAbs", "exitPupil.maxScaled"]) {
        assert.equal(typeof pair.metrics[figure]?.value, "number", `${pair.run} ${figure}`);
      }
    }
    const having = (metric: string): RungPair[] => gated.filter((pair) => pair.metrics[metric] !== undefined);
    // Distortion is measured on the two sets with a probe, at every run; lateral colour on the photopic run's spans.
    assert.equal(having("distortion.maxScaled").length, 3 * 2 * RUNS.length);
    assert.equal(having("lateralColour.maxAbs").length, 3 * PATTERNS);
    assert.ok(having("lateralColour.maxAbs").every((pair) => pair.run === PHOTOPIC));
    for (const metric of ["landing.maxAbs", "lateralColour.maxAbs", "distortion.maxScaled", "exitPupil.maxScaled"]) {
      const worst = worstOf(having(metric), metric);
      assert.ok(worst.value <= tolerance(metric), `${metric} ${worst.value} at ${worst.at}`);
      t.diagnostic(`R9a ${metric}: ${worst.value} at ${worst.at}`);
    }

    // R9b: LensVisualizer answers its tabs' own asks: none on lines that are not its authored indices or its
    // channels, and none of a case off the design plane.
    const native = manifest.jobs.filter((job) => job.rung === "r9b");
    assert.deepEqual([...new Set(native.map((job) => job.engine))].sort(), ["lv", "optiland"]);
    assert.equal(native.length, 2 * ASKS * RUNS.length);
    const statuses = (run: string, engine: string): string[] =>
      native
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    assert.deepEqual(statuses(DESIGN, "lv"), ["ok", "ok", "ok"]);
    assert.deepEqual(statuses(LONG, "lv"), ["ok", "ok", "ok"]);
    assert.deepEqual(statuses(PHOTOPIC, "lv"), [
      "lines.not-authored-reference",
      "lines.not-authored-reference",
      "lines.not-chromatic-channels",
    ]);
    assert.deepEqual(statuses(BEST, "lv"), Array(ASKS).fill("focus.off-design"));
    for (const run of RUNS) assert.deepEqual(statuses(run, "optiland"), Array(ASKS).fill("ok"), run);

    const recorded = pairsOf(comparisons, "r9b", CHIEF_NATIVE);
    assert.equal(recorded.length, ASKS * RUNS.length);
    const of = (run: string): RungPair[] => recorded.filter((pair) => pair.run === run);
    for (const run of [PHOTOPIC, BEST]) {
      for (const pair of of(run)) assert.equal(pair.verdict, "UNSUPPORTED", `${pair.run}: ${pair.reason ?? ""}`);
    }
    const value = (pair: RungPair, name: string): number | null | undefined => pair.metrics[name]?.value;
    for (const run of [DESIGN, LONG]) {
      const [distortion, pupils, lateral] = of(run);
      // Distortion and pupils at the authored indices: two methods at every field, each figure measured.
      for (const pair of [distortion, pupils]) {
        assert.equal(pair.verdict, "RECORDED", `${run}: ${pair.reason ?? ""}`);
        assert.equal(value(pair, "fields.data"), 0, run);
        assert.equal(value(pair, "fields.unavailable"), 0, run);
        assert.ok((value(pair, "fields.compared") ?? 0) > 0, run);
        const landing = value(pair, "chiefLanding.maxAbs");
        assert.ok(typeof landing === "number" && landing <= SAME_FIELD_MM, `${run} ${landing}`);
      }
      for (const figure of [
        "distortionPercent.maxAbs",
        "realHeight.maxAbs",
        "idealHeight.maxAbs",
        "focalScale.relative",
      ]) {
        assert.equal(typeof value(distortion, figure), "number", `${run} ${figure}`);
      }
      for (const figure of ["entrancePupil.maxAbs", "exitPupil.maxAbs", "paraxialEntrancePupil.maxAbs"]) {
        assert.equal(typeof value(pupils, figure), "number", `${run} ${figure}`);
      }
      // Lateral colour on the reference line alone, LensVisualizer's G channel (the d line for these d-line indices):
      // since LensVisualizer #925 its indices are the case's to the bit and its chief ray is its own through the stop,
      // so every field is of two methods (at 098c91ef6 the landings within 1.2e-10 mm on the benchmark).
      assert.equal(lateral.verdict, "RECORDED", `${run}: ${lateral.reason ?? ""}`);
      assert.equal(value(lateral, "fields.data"), 0, run);
      assert.ok((value(lateral, "fields.compared") ?? 0) > 0, run);
      const lateralLanding = value(lateral, "chiefLanding.maxAbs");
      assert.ok(typeof lateralLanding === "number" && lateralLanding <= SAME_FIELD_MM, `${run} ${lateralLanding}`);
    }

    // Since LensVisualizer #925 its pupils of a field below one degree are of a chief ray solved through the stop's
    // centre, its entrance pupil shifted from the paraxial one: within a hundred-thousandth of a millimetre of
    // optiland's real chief ray there as above one degree (at 098c91ef6, 3.8e-6 mm at 0.2°; it was 1.30 mm).
    const pupils = of(LONG)[1];
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === pupils.requestId && candidate.mode === "pairwise",
    );
    const side = (engine: string) => set?.participants.find((participant) => participant.engine === engine)?.recorded;
    const [lv, optiland] = [side("lv"), side("optiland")];
    assert.ok(lv !== undefined && optiland !== undefined);
    let below = 0;
    let above = 0;
    // A value that is no finite number is recorded as null: none is here.
    const number = (values: readonly (number | null)[], at: number): number => values[at] ?? Number.NaN;
    for (const at of lv.fieldAngleDeg.keys()) {
      const angle = number(lv.fieldAngleDeg, at);
      const apart = Math.abs(number(lv.entrancePupilZ, at) - number(optiland.entrancePupilZ, at));
      assert.ok(Number.isFinite(apart), `${angle} degrees`);
      if (angle < 1) {
        assert.notEqual(lv.epShiftMm[at], 0, `${angle} degrees`);
        below = Math.max(below, apart);
      } else above = Math.max(above, apart);
    }
    assert.ok(below > 0 && below <= 1e-5, `${below}`);
    assert.ok(above <= 1e-5, `${above}`);
    t.diagnostic(`${LONG} entrance pupils: ${below} mm apart below one degree, ${above} above`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
