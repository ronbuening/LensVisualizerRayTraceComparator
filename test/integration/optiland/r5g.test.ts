// Rung R5g on the real engines: LensVisualizer's geometric MTF beside optiland's own geometric MTF and the
// comparator's estimator on a replay of LensVisualizer's sampling, through `lvrtc run`, `compare` and `report`, on
// three runs of the benchmark: a fast lens wide open on the reference line, the same at the f/8 comparison, and
// one run on the photopic lines. The rung on all 96 runs is a measurement of its own
// (docs/IMPLEMENTATION_PLAN.md, "Amendments since approval"). Each test skips with the reason when LensVisualizer
// or optiland is missing. Run output goes to a temporary directory.
//
// The rung is recorded: nothing here is held to a figure of an MTF, and no test needs a row to be marked. What is
// held is that every engine answers, that no pair is an error, that optiland computed with the angles
// LensVisualizer resolved (the engine option `fieldAnglesDeg` with the method geometric), that the chief rays of
// the two land within the policy's limit of each other, that every field has a class, that optiland is asked again
// exactly for the runs whose first figures are outside a band, that the photopic run has an optiland column of
// the case's lines, and that the report says whose sum that column is and claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { GEOMETRIC_SEVERAL_LINES, NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R5G = loadPolicy().rungs.r5g;
const band = (name: string): number => R5G.metrics[name].attention as number;

const PHOTOPIC = "canon-ef-135-f2l-usm-photopic";
/** The fields a run traces rays for: the fields of a request each. */
const FIELDS = [0, 0.5, 1];
const RUNS = ["nikkor-z50f12-ref", "nikkor-z50f12-f8-ref", PHOTOPIC];

test(
  "R5g: LensVisualizer's geometric MTF beside optiland's own and the replay, on three runs",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );
    // The rung is asked of its own three engines whatever is named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref",
      rungs: "r5g",
    });

    const first = manifest.jobs.filter((job) => job.step === undefined);
    assert.deepEqual([...new Set(first.map((job) => job.engine))].sort(), ["lv", "optiland", "replay"]);
    // A request a field: the three fields a run traces rays for, of three engines.
    assert.equal(first.length, 3 * FIELDS.length * RUNS.length);
    for (const job of first) assert.equal(job.status, "ok", `${job.run} ${job.engine}`);

    const pairs = pairsOf(comparisons, "r5g", MTF_NATIVE);
    assert.equal(pairs.length, 3 * FIELDS.length * RUNS.length);
    for (const pair of pairs) {
      const allowed = ["RECORDED", "ATTENTION"];
      assert.ok(allowed.includes(pair.verdict), `${pair.run} ${pair.engines}: ${pair.verdict} (${pair.reason ?? ""})`);
    }

    // What each engine's answer to one request records.
    const recordedOf = (run: string, requestId: string, engine: string) => {
      const set = comparisons.comparisons.find(
        (candidate) => candidate.run === run && candidate.rung === "r5g" && candidate.requestId === requestId,
      );
      const recorded = set?.participants.find((participant) => participant.engine === engine)?.recorded;
      assert.ok(recorded !== undefined, `${run} ${engine}`);
      return recorded;
    };
    const steps = manifest.jobs.filter((job) => job.step !== undefined);
    const judged = pairs.filter((candidate) => candidate.engines === "lv / optiland");
    for (const run of RUNS) {
      const fields = judged
        .filter((pair) => pair.run === run)
        .map((pair) => recordedOf(run, pair.requestId, "lv").field);
      assert.deepEqual(
        fields,
        FIELDS.map((field) => [field]),
        run,
      );
    }
    for (const pair of judged) {
      const at = `${pair.run} ${pair.requestId.slice(0, 8)}`;
      const [lv, optiland] = ["lv", "optiland"].map((engine) => recordedOf(pair.run, pair.requestId, engine));
      // optiland was handed a fraction, and its angle as its option: it computed with LensVisualizer's.
      assert.deepEqual(optiland.field, lv.field, at);
      assert.deepEqual(optiland.fieldAngleDeg, lv.fieldAngleDeg, at);
      // Both are of the lines of the case, in its order: one on a reference-line run, several on the photopic one.
      assert.deepEqual(optiland.lineWavelengthNm, lv.lineWavelengthNm, at);
      assert.equal(lv.lineWavelengthNm.length > 1, pair.run === PHOTOPIC, at);

      const value = (name: string): number | null | undefined => pair.metrics[name]?.value;
      // The check that precedes any row: the two chief rays are of one field, and no field is of class data.
      const landing = value("chiefLanding.maxAbs");
      assert.ok(typeof landing === "number" && landing <= band("chiefLanding.maxAbs"), `${at}: ${landing}`);
      assert.equal(value("fields.data"), 0, at);
      // The field has a class, and no rim ray: a geometric MTF calibrates no axis.
      const counted = ["compared", "flagged", "rimLost", "data", "unavailable"].map((kind) => value(`fields.${kind}`));
      assert.equal(
        counted.reduce((sum: number, count) => sum + (count ?? Number.NaN), 0),
        1,
        at,
      );
      assert.equal(value("fields.rimLost"), 0, at);
      // optiland was asked again for this field exactly where a figure of the first answers is outside its band
      // and its answer is of one line.
      const outside = (["mtfOnAxis", "mtfOffAxis"] as const).some((subject) => {
        const firstStep = value(`${subject}.firstStepMaxAbs`) ?? value(`${subject}.maxAbs`);
        return typeof firstStep === "number" && firstStep > band(`${subject}.maxAbs`);
      });
      const again = steps.filter((job) => job.run === pair.run && job.requestId === pair.requestId);
      assert.deepEqual(
        again.map((job) => `${job.engine} ${job.step} ${job.status}`),
        outside && pair.run !== PHOTOPIC ? ["optiland geo512 ok"] : [],
        at,
      );
    }
    assert.ok(steps.every((job) => job.rung === "r5g" && job.engine === "optiland"));

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    assert.equal(
      markdown.match(/^The engines' own geometric MTF, side by side\./gm)?.length,
      FIELDS.length * RUNS.length,
    );
    // The fields of the run of several lines, and no other, say that the sum over optiland's landings is the worker's.
    assert.equal(markdown.split(GEOMETRIC_SEVERAL_LINES.join("\n")).length - 1, FIELDS.length);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
