// Rung R6b on the real LensVisualizer: its own diffraction MTF beside the comparator's wave estimator on the rays
// LensVisualizer launches and traces, through `lvrtc run` and `lvrtc compare`, on six runs of the benchmark: one
// lens in its four conditions on the reference line, and a fast lens wide open and at the f/8 comparison. The rung
// on all 96 runs is a measurement of its own (docs/REFERENCE.md): the estimator traces every lattice of 64 cells
// through LensVisualizer, about 13 minutes. Run output goes to a temporary directory.
//
// The rung is recorded: nothing here is held to a figure. What is held is that both engines answer every run,
// that a pair is RECORDED or marked for ATTENTION and never an error, that every field is of one class or
// another, and that what each side says of its sampling is written down beside the comparison.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { COMPARISONS_FILE } from "../../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const R6B = loadPolicy().rungs.r6b;

/** The runs of the benchmark that are run here. */
const RUNS = [
  "sony-fe-400mm-f28-gm-oss-ref",
  "sony-fe-400mm-f28-gm-oss-best-ref",
  "sony-fe-400mm-f28-gm-oss-f8-ref",
  "sony-fe-400mm-f28-gm-oss-f8-best-ref",
  "nikkor-z50f12-ref",
  "nikkor-z50f12-f8-ref",
];

function lvrtc(runsDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
  const child = spawnSync(process.execPath, [BIN, ...args], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

test("the engine wave conforms on the real LensVisualizer", { skip, timeout: 300_000 }, (t) => {
  const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-wave-"));
  t.after(() => rmSync(runsDir, { recursive: true, force: true }));
  const conformed = lvrtc(runsDir, "engine", "conformance", "wave");
  assert.equal(conformed.code, 0, conformed.out + conformed.err);
  assert.match(conformed.out, /^wave: conforms: \d+ passed, 0 failed, \d+ skipped$/m);
});

test(
  "lvrtc run --rungs r6b: LensVisualizer's diffraction MTF beside the wave estimator on its rays, on six runs",
  { skip, timeout: 900_000 },
  (t) => {
    const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-wave-"));
    t.after(() => rmSync(runsDir, { recursive: true, force: true }));
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(runsDir, "benchmark.json");
    writeFileSync(
      suite,
      JSON.stringify({ ...committed, runs: committed.runs.filter((run) => RUNS.includes(run.name)) }),
    );

    // No --engines: the suite names lv and ref, and the rung is asked of lv and of wave whatever a run names.
    const ran = lvrtc(runsDir, "run", suite, "--rungs", "r6b");
    assert.equal(ran.code, 0, ran.err);
    assert.match(ran.out, /^benchmark: 12 jobs: 12 ok, 0 unsupported, 0 error, 0 pending \(12 computed, 0 cached\)$/m);
    const compared = lvrtc(runsDir, "compare", "benchmark");
    // A recorded rung fails nothing.
    assert.equal(compared.code, 0, compared.out);
    assert.match(
      compared.out,
      /^benchmark: 12 pairs: 0 PASS, 0 FLOOR, 0 FAIL, \d+ RECORDED, \d+ ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
    );

    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "benchmark", MANIFEST_FILE), "utf8"));
    const comparisons: ComparisonFile = JSON.parse(readFileSync(join(runsDir, "benchmark", COMPARISONS_FILE), "utf8"));
    assert.deepEqual(
      manifest.engines.map((engine) => [engine.id, engine.status]),
      [
        ["lv", "available"],
        ["wave", "available"],
      ],
    );
    assert.deepEqual(manifest.runs.map((run) => run.name).sort(), [...RUNS].sort());
    // The rung traces no ray set of the run: the estimator asks LensVisualizer for its lattices itself.
    assert.ok(manifest.runs.every((run) => run.raySets === undefined && run.fineRaySets === undefined));

    const sets = comparisons.comparisons.filter((set) => set.mode === "pairwise");
    assert.equal(sets.length, RUNS.length);
    for (const set of sets) {
      assert.deepEqual([set.rung, set.quantity], ["r6b", "mtf.native"], set.run);
      const [pair] = set.pairs;
      assert.deepEqual([pair.a, pair.b, pair.class], ["lv", "wave", "recorded"], set.run);
      assert.ok(["RECORDED", "ATTENTION"].includes(pair.verdict), `${set.run}: ${pair.verdict} ${pair.reason ?? ""}`);
      const metrics = Object.fromEntries(pair.metrics.map((metric) => [metric.name, metric.value as number]));
      // The three fields a run traces rays for, each of one class.
      const counted = ["fields.compared", "fields.flagged", "fields.unavailable"].map((name) => metrics[name]);
      assert.equal(counted[0] + counted[1] + counted[2], 3, set.run);
      assert.equal(metrics["fields.unavailable"], 0, set.run);
      // A band is marked exactly where its figure is outside it.
      const outside = Object.entries(R6B.metrics).filter(
        ([name, { attention }]) => metrics[name] > (attention as number),
      );
      assert.equal(pair.verdict === "ATTENTION", outside.length > 0, `${set.run}: ${pair.reason ?? ""}`);

      // Each side's sampling and whether it stands by a field, a value a field: the estimator's lattice is of 64
      // cells and it states the step of its wavefront; LensVisualizer's grid is its own refinement's.
      const [ofLv, ofWave] = set.participants.map((participant) => participant.recorded);
      assert.deepEqual(ofWave?.gridSize, [64, 64, 64], set.run);
      assert.ok(
        ofLv?.gridSize.every((grid) => [16, 32, 64, 128].includes(grid as number)),
        set.run,
      );
      assert.ok(
        ofWave?.phaseStepWaves.every((step) => typeof step === "number" && step >= 0),
        set.run,
      );
      assert.ok(
        ofWave?.maxDelta.every((moved) => typeof moved === "number" && moved >= 0),
        set.run,
      );
      assert.deepEqual(ofLv?.phaseStepWaves, [null, null, null], set.run);
      const flagged = [...(ofLv?.settled ?? []), ...(ofWave?.settled ?? [])].filter((settled) => settled === 0).length;
      assert.ok(flagged >= metrics["fields.flagged"], set.run);
      t.diagnostic(
        `${set.run}: ${pair.verdict}; on the axis ${metrics["mtfOnAxis.maxAbs"]}, off it ${metrics["mtfOffAxis.maxAbs"]}, ` +
          `flagged ${metrics["mtfFlagged.maxAbs"]}; grids lv ${ofLv?.gridSize.join("/")}, wave settled ${ofWave?.settled.join("")}`,
      );
    }

    // Stopped down, the estimator's lattice of 64 cells samples every wavefront: no field of it is undersampled.
    for (const set of sets.filter((each) => each.run.includes("-f8-"))) {
      const ofWave = set.participants.find((participant) => participant.engine === "wave")?.recorded;
      assert.ok(
        ofWave?.phaseStepWaves.every((step) => (step as number) <= 0.25),
        set.run,
      );
    }
    // Wide open the fast lens is undersampled in every field: the estimator stands by none, and none is in a band.
    const fast = sets.find((set) => set.run === "nikkor-z50f12-ref");
    const ofFast = fast?.participants.find((participant) => participant.engine === "wave")?.recorded;
    assert.deepEqual(ofFast?.settled, [0, 0, 0]);
    assert.ok(ofFast?.phaseStepWaves.every((step) => (step as number) > 0.25));
    assert.equal(fast?.pairs[0].verdict, "RECORDED");
    assert.match(
      fast?.pairs[0].reason ?? "",
      /mtfOnAxis\.maxAbs was not measured: .*hopkins-autocorrelation: unconverged \(undersampled/,
    );
  },
);
