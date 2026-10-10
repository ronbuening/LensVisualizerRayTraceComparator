// `lvrtc mtf <lensKey> --profile benchmark` from end to end on the real engines, and the committed MTF baseline
// against it: one lens of the benchmark at the f/8 comparison, at both planes and on both sets of lines, on
// LensVisualizer, the reference tracer and optiland, every MTF rung. Needs both checkouts; the test skips with the
// reason when one is missing. Run output goes to a temporary directory: nothing is written into the repository,
// into LensVisualizer or into optiland.
//
// The four runs are four of the 96 of `baselines/benchmark.mtf.json`, under the names the suite gives them, so the
// run is set against the committed records as `lvrtc baseline check benchmark --mtf` sets all of them, which takes
// an hour from an empty store and is run by hand. The baseline was written at LensVisualizer 33ebdb30 (engine
// closure 78215d72, 151 files) and optiland 4e893f53 (source hash 279af5c5). A record is held to what it was only
// while its case and its engines are the ones the baseline names: a record of an edited lens or engine is stale,
// which is reported and is no failure of this test.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { MTF_BASELINE, buildBaseline, parseBaseline } from "../../../src/baseline/build.ts";
import { checkBaseline } from "../../../src/baseline/check.ts";
import { mtfBaselineFile } from "../../../src/baseline/files.ts";
import { MTF_REPORT_MARKDOWN } from "../../../src/baseline/mtfReport.ts";
import { COMPARISONS_FILE } from "../../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, lvrtc, tempDir } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;

/** A lens of the benchmark that is no zoom: its runs have the names the benchmark suite gives them. */
const LENS = "sigma-45mm-f28-dg-dn-contemporary";
const RUNS = ["ref", "photopic", "best-ref", "best-photopic"].map((condition) => `${LENS}-f8-${condition}`);
const GATED = ["r4", "r4f", "r6a"];
const RECORDED = ["r5", "r5g", "r6b"];

test(
  "lvrtc mtf --profile benchmark: one lens at f/8 on three engines, every MTF rung, and the committed records of it",
  { skip, timeout: 900_000 },
  (t) => {
    const runsDir = tempDir(t);
    const ended = lvrtc(runsDir, REPO_ROOT, [
      "mtf",
      LENS,
      "--profile",
      "benchmark",
      "--engines",
      "lv,ref,optiland",
      "--aperture",
      "f/8",
    ]);
    assert.equal(ended.code, 0, ended.err);
    const directory = join(runsDir, `mtf-${LENS}`);
    const manifest: RunManifest = JSON.parse(readFileSync(join(directory, MANIFEST_FILE), "utf8"));
    const comparisons: ComparisonFile = JSON.parse(readFileSync(join(directory, COMPARISONS_FILE), "utf8"));
    assert.deepEqual(
      manifest.runs.map((run) => run.name),
      RUNS,
    );
    assert.deepEqual([...new Set(manifest.jobs.map((job) => job.rung))].sort(), [...GATED, ...RECORDED].sort());
    for (const job of manifest.jobs) {
      // optiland's FFT MTF is of one line: on the photopic lines it says so, and that is an answer.
      const allowed = job.rung === "r5" && job.engine === "optiland" ? ["ok", "unsupported"] : ["ok"];
      assert.ok(allowed.includes(job.status), `${job.run} ${job.rung} ${job.engine}: ${job.status}`);
    }

    // What is printed is the report that was written, with every rung, the table and the fixed block.
    assert.equal(ended.out, readFileSync(join(directory, MTF_REPORT_MARKDOWN), "utf8"));
    for (const rung of [...GATED, ...RECORDED]) assert.match(ended.out, new RegExp(`^## ${rung}$`, "m"));
    assert.match(ended.out, /^The engines' own MTF, side by side\./m);
    assert.match(ended.out, /^The engines' own geometric MTF, side by side\./m);
    for (const sentence of NOT_COVERED) assert.ok(ended.out.includes(`- ${sentence}`), sentence);
    assert.deepEqual(wordingProblems(ended.out), []);

    const policy = loadPolicy();
    const fresh = buildBaseline(manifest, comparisons, policy, MTF_BASELINE);
    for (const run of fresh.runs) {
      for (const rung of run.rungs) {
        for (const pair of rung.pairs) {
          const at = `${run.name} ${rung.rung} ${pair.a} ${pair.b}`;
          if (GATED.includes(rung.rung)) assert.equal(pair.verdict, "PASS", at);
          else assert.ok(["RECORDED", "ATTENTION", "UNSUPPORTED"].includes(pair.verdict), `${at}: ${pair.verdict}`);
        }
      }
    }

    // The committed MTF baseline holds these four runs: each record of a case and of engines that are still the
    // baseline's is what it was.
    const read = parseBaseline(readFileSync(mtfBaselineFile(REPO_ROOT, "benchmark"), "utf8"));
    assert.ok("baseline" in read, "baselines/benchmark.mtf.json is a baseline");
    const committed = { ...read.baseline, runs: read.baseline.runs.filter((run) => RUNS.includes(run.name)) };
    assert.deepEqual(
      committed.runs.map((run) => run.name),
      RUNS,
    );
    const records = checkBaseline(committed, fresh, policy);
    assert.equal(records.filter((record) => record.outcome === "NEW" || record.outcome === "GONE").length, 0);
    const current = records.filter((record) => record.stale.filter((reason) => reason !== "policy").length === 0);
    t.diagnostic(`${current.length} of ${records.length} records are of the cases and engines of the baseline`);
    for (const record of current) {
      const at = `${record.run} ${record.rung} ${record.a} ${record.b}`;
      assert.ok(record.outcome === "OK" || record.outcome === "REFRESHABLE", `${at}: ${record.moved.join("; ")}`);
      assert.equal(record.changes, undefined, `${at}: a figure is not what the baseline has`);
    }
    for (const record of records.filter((each) => each.outcome === "DRIFT" || each.outcome === "MOVED")) {
      t.diagnostic(
        `${record.run} ${record.rung} ${record.a} ${record.b}: stale by ${record.stale.join(", ")}, ${record.outcome}: ${record.moved.join("; ")}`,
      );
    }
  },
);
