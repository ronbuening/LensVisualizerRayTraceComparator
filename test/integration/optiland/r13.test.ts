// Rungs R13b and R14b on the real engines, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark:
// the Canon EF 135 mm wide open on its reference line and on the photopic lines (no term of power 4: optiland answers
// its Seidel sums), the Nikkor Z 50 mm on its reference line (terms of power 4: optiland is refused, and `ref-seidel`
// answers alone), and the Sigma 35 mm on its reference line, whose full field lights a strip of the pupil. The rungs on
// the benchmark are a measurement of their own (docs/REFERENCE.md, "Stage 6.8"), minutes. Each test skips with the reason
// when LensVisualizer or optiland is missing. Run output goes to a temporary directory.
//
// Both rungs are recorded. What is held: R13b asks `ref-seidel` and optiland and nobody else; the sums of the two engines
// agree within 1e-13 of the larger sum of their surfaces' magnitudes (measured 7.2e-16 at the stage); the Lagrange
// invariants within 1e-13 mm; optiland states no chromatic sum, and the pair says so; `ref-seidel` states them of the
// photopic lines. R14b asks optiland and `optiland-wave`; both answer every field of both orderings; the two conditions
// of a field's normal equations agree within 1e-6 of each other below 1e8 (measured 1.1e-8), and within a factor of two
// above it, where each inverse is as ill-determined as the fit; where the condition is below 1e6 the coefficients agree
// within 1e-10 of the largest (measured 3.2e-12), the RMS within 1e-15 waves and the peak to valley to the bit; and the
// Sigma's full field is ill-conditioned (a condition above 1e9). The report claims nothing it may not.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { SEIDEL_NATIVE } from "../../../src/contract/quantities/seidelNative.ts";
import { ZERNIKE_NATIVE } from "../../../src/contract/quantities/zernikeNative.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;

const CANON = "canon-ef-135-f2l-usm-ref";
const PHOTOPIC = "canon-ef-135-f2l-usm-photopic";
const NIKKOR = "nikkor-z50f12-ref";
const SIGMA = "sigma-35mm-f14-dg-hsm-a-ref";

test(
  "R13b and R14b: the comparator's Seidel sums and Zernike fit beside optiland's, recorded",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    const runs = committed.runs.filter((run) => [CANON, PHOTOPIC, NIKKOR, SIGMA].includes(run.name));
    writeFileSync(suite, JSON.stringify({ ...committed, runs }));
    // The rungs are asked of their own engines whatever is named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,ref",
      rungs: "r13b,r14b",
    });
    const jobs = (rung: string) => manifest.jobs.filter((job) => job.rung === rung);
    assert.deepEqual([...new Set(jobs("r13b").map((job) => job.engine))].sort(), ["optiland", "ref-seidel"]);
    assert.deepEqual([...new Set(jobs("r14b").map((job) => job.engine))].sort(), ["optiland", "optiland-wave"]);
    const statuses = (rung: string, run: string, engine: string): string[] =>
      jobs(rung)
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    assert.deepEqual(statuses("r13b", NIKKOR, "optiland"), ["surface.asphere.quartic-term"]);
    for (const run of [CANON, PHOTOPIC, NIKKOR, SIGMA]) assert.deepEqual(statuses("r13b", run, "ref-seidel"), ["ok"]);
    assert.deepEqual(statuses("r13b", SIGMA, "optiland"), ["surface.asphere.quartic-term"]);

    // R13b: the sums of two methods agree to the rounding of what cancels in them.
    const seidel = pairsOf(comparisons, "r13b", SEIDEL_NATIVE);
    for (const run of [CANON, PHOTOPIC]) {
      const pair = seidel.find((entry) => entry.run === run);
      assert.ok(pair !== undefined, run);
      assert.equal(pair.verdict, "RECORDED", `${run}: ${pair.reason ?? ""}`);
      const scaled = pair.metrics["total.maxScaled"]?.value;
      assert.ok(typeof scaled === "number" && scaled <= 1e-13, `${run} ${scaled}`);
      const invariant = pair.metrics["invariant.maxAbs"]?.value;
      assert.ok(typeof invariant === "number" && invariant <= 1e-13, `${run} ${invariant}`);
      // Of one line neither states a chromatic sum; of the photopic lines `ref-seidel` does, and optiland states none.
      const silent =
        run === PHOTOPIC ? "optiland-seidels states none" : "optiland-seidels and paraxial-seidel-sums state none";
      assert.ok((pair.reason ?? "").includes(`CLA.maxAbs was not measured: ${silent}`), `${run}: ${pair.reason ?? ""}`);
    }
    const photopic = comparisons.comparisons.find(
      (set) => set.run === PHOTOPIC && set.rung === "r13b" && set.mode === "pairwise",
    );
    const sums = photopic?.participants.find((participant) => participant.engine === "ref-seidel")?.recorded;
    assert.ok(sums !== undefined && Number.isFinite(sums.CLA[0]) && Number.isFinite(sums.W020[0]));
    assert.equal(seidel.find((entry) => entry.run === NIKKOR)?.verdict, "UNSUPPORTED");

    // R14b: one wavefront, two fits; conditions agree, coefficients agree where the samples determine them.
    const zernike = comparisons.comparisons.filter((set) => set.rung === "r14b" && set.mode === "pairwise");
    assert.equal(zernike.length, 2 * 4);
    let conditioned = 0;
    let illConditioned = 0;
    for (const set of zernike) {
      assert.equal(set.quantity, ZERNIKE_NATIVE);
      assert.equal(set.pairs[0].verdict, "RECORDED", `${set.run}: ${set.pairs[0].reason ?? ""}`);
      const [a, b] = ["optiland", "optiland-wave"].map(
        (engine) => set.participants.find((participant) => participant.engine === engine)?.recorded ?? {},
      );
      const terms = Object.keys(a).filter((name) => /^Z\d+$/.test(name));
      const at = (values: readonly (number | null)[], field: number): number => values[field] ?? Number.NaN;
      a.fieldAngleDeg.forEach((angle, field) => {
        const [ca, cb] = [at(a.fitCondition, field), at(b.fitCondition, field)];
        // Where the normal equations keep half their digits (a condition below 1e8) the two inverses agree as well;
        // above it each inverse is as ill-determined as the fit, and only the size of the condition is held.
        const agree = Math.max(ca, cb) < 1e8 ? 1e-6 : 0.5;
        assert.ok(Math.abs(ca - cb) <= agree * Math.max(ca, cb), `${set.run} ${angle}: ${ca} against ${cb}`);
        const rms = Math.abs(at(a.rmsToChiefWaves, field) - at(b.rmsToChiefWaves, field));
        assert.ok(rms <= 1e-15, `${set.run} ${angle}`);
        assert.equal(a.pvToChiefWaves[field], b.pvToChiefWaves[field]);
        if (ca > 1e9) illConditioned++;
        if (!(ca < 1e6)) return;
        conditioned++;
        const largest = Math.max(...terms.map((name) => Math.abs(at(a[name], field))));
        for (const name of terms) {
          const difference = Math.abs(at(a[name], field) - at(b[name], field));
          assert.ok(difference <= 1e-10 * largest, `${set.run} ${angle} ${name}`);
        }
      });
    }
    assert.ok(conditioned >= 20, `${conditioned} fields of a condition below 1e6`);
    assert.ok(illConditioned >= 2, `${illConditioned} fields of a condition above 1e9`);
    t.diagnostic(`R14b: ${conditioned} fields below a condition of 1e6, ${illConditioned} above 1e9`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
