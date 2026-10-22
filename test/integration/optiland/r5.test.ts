// Rung R5 on the real engines: LensVisualizer's product MTF beside optiland's FFT MTF and the comparator's wave
// estimator, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark: a lens wide open on the
// reference line, a fast lens wide open and at the f/8 comparison, and one run on the photopic lines. The rung on
// all 96 runs is a measurement of its own (docs/IMPLEMENTATION_PLAN.md, "Amendments since approval"), 8 minutes.
// Each test skips with the reason when LensVisualizer or optiland is missing. Run output goes to a temporary
// directory.
//
// The rung is recorded: nothing here is held to a figure of an MTF, and no test needs a row to be marked. What is
// held is that every engine answers or says why not, that no pair is an error, that the chief rays of
// LensVisualizer and optiland land within the policy's limit of each other wherever both have curves, that every
// field has a class, that optiland is asked again exactly for the runs whose first figures are outside a band, and
// that the report claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R5 = loadPolicy().rungs.r5;
const band = (name: string): number => R5.metrics[name].attention as number;

const PHOTOPIC = "canon-ef-135-f2l-usm-photopic";
const RUNS = ["sony-fe-400mm-f28-gm-oss-ref", "nikkor-z50f12-ref", "nikkor-z50f12-f8-ref", PHOTOPIC];

test(
  "R5: LensVisualizer's MTF beside optiland's FFT MTF and the wave estimator, on four runs",
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
      rungs: "r5",
    });

    const first = manifest.jobs.filter((job) => job.step === undefined);
    assert.deepEqual([...new Set(first.map((job) => job.engine))].sort(), ["lv", "optiland", "wave"]);
    assert.equal(first.length, 3 * RUNS.length);
    for (const job of first) {
      const expected = job.run === PHOTOPIC && job.engine === "optiland" ? "unsupported" : "ok";
      assert.equal(job.status, expected, `${job.run} ${job.engine}`);
    }
    const refused = first.find((job) => job.status === "unsupported");
    assert.deepEqual(refused?.unsupported, [{ code: "feature", item: "lines.polychromatic" }]);

    const pairs = pairsOf(comparisons, "r5", MTF_NATIVE);
    assert.equal(pairs.length, 3 * RUNS.length);
    for (const pair of pairs) {
      const unsupported = pair.run === PHOTOPIC && pair.engines.includes("optiland");
      const allowed = unsupported ? ["UNSUPPORTED"] : ["RECORDED", "ATTENTION"];
      assert.ok(allowed.includes(pair.verdict), `${pair.run} ${pair.engines}: ${pair.verdict} (${pair.reason ?? ""})`);
    }

    const steps = manifest.jobs.filter((job) => job.step !== undefined);
    for (const pair of pairs.filter(
      (candidate) => candidate.engines === "lv / optiland" && candidate.run !== PHOTOPIC,
    )) {
      const value = (name: string): number | null | undefined => pair.metrics[name]?.value;
      // The check that precedes any row: the two chief rays are of one field, and no field is of class data.
      const landing = value("chiefLanding.maxAbs");
      assert.ok(typeof landing === "number" && landing <= band("chiefLanding.maxAbs"), `${pair.run}: ${landing}`);
      assert.equal(value("fields.data"), 0, pair.run);
      // Every field has a class.
      const counted = ["compared", "flagged", "rimLost", "data", "unavailable"].map((kind) => value(`fields.${kind}`));
      assert.equal(
        counted.reduce((sum: number, count) => sum + (count ?? Number.NaN), 0),
        3,
        pair.run,
      );
      // optiland was asked again for this run exactly where a figure of the first answers is outside its band.
      const outside = (["mtfOnAxis", "mtfOffAxis"] as const).some((subject) => {
        const firstStep = value(`${subject}.firstStepMaxAbs`) ?? value(`${subject}.maxAbs`);
        return typeof firstStep === "number" && firstStep > band(`${subject}.maxAbs`);
      });
      const again = steps.filter((job) => job.run === pair.run);
      assert.deepEqual(
        again.map((job) => `${job.engine} ${job.step} ${job.status}`),
        outside ? ["optiland fft512 ok"] : [],
        pair.run,
      );
      assert.equal(
        value("mtfOnAxis.firstStepMaxAbs") !== undefined || value("mtfOffAxis.firstStepMaxAbs") !== undefined,
        outside,
      );
    }
    assert.ok(steps.every((job) => job.rung === "r5" && job.engine === "optiland"));

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    assert.equal(markdown.match(/^The engines' own MTF, side by side\./gm)?.length, RUNS.length);
    assert.match(
      markdown,
      /^`lv` against `optiland` is UNSUPPORTED: optiland is unsupported \(feature lines\.polychromatic\)\.$/m,
    );
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
