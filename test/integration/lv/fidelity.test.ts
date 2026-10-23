// Rung R4f on the real LensVisualizer: the comparator's geometric estimator on a replay of LensVisualizer's own MTF
// sampling, against LensVisualizer's own `computeMtf`, through `lvrtc run` and `lvrtc compare` on the benchmark
// suite as it is committed. 12 configurations in four conditions (wide open and the f/8 comparison of the MTF tab,
// each at the design plane and at LensVisualizer's own best axial focus), on the reference line and on the photopic
// lines: 96 runs of LensVisualizer's five default fields, 480 fields. Run output goes to a temporary directory.
//
// The figures below were measured at LV commit 33ebdb30 with the engine closure 78215d72. The largest difference
// of an MTF value over all of it is 1.25e-14 (nikkor-z50f12 at its best focus on the reference line, half field,
// sagittal, 6 cycles/mm): the rounding of two ways of adding the same terms up, LensVisualizer's plain sums and its
// rotated phasor against the estimator's compensated ones. The gate of the rung, 1e-9, is 80 000 times that. Not
// one grid size and not one ray count differs.
//
// What is pinned (the grid each field's refinement ends at) is compared only while the engine closure and the case
// of a run are still the ones it was measured with: the checkout changes by the day, and a lens that was edited is
// another lens.
import { lvMtfInputs } from "../../../src/engines/lv/tabRequest.ts";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { COMPARISONS_FILE } from "../../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { MtfNativeData } from "../../../src/contract/quantities/mtfNative.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { STORE_DIRECTORY, createResultStore } from "../../../src/core/resultStore.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { lvGeneralMtfOptions } from "../../../src/engines/lv/focus.ts";
import { lvHookAperture, lvTabRequest } from "../../../src/engines/lv/tabRequest.ts";
import { suitePath } from "../../suites/support.ts";
import { BENCHMARK_CONDITIONS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));

/**
 * The engine closure the pinned figures are compared at. They were measured at LV 643ef5d0 (closure 94778d3d, 175
 * files; the same at ab0fd4cf); at Stage 4.4 the binding's import of src/optics/publishedStations.ts made it
 * 7b756ee6 (177 files) at ab0fd4cf, and every figure was measured again there and found unchanged.
 */
const PINNED_CLOSURE = "7b756ee63bd252b76b978a1dbc18185a9c565c118ed662ec694def8ca72c6a56";

/**
 * For each run of a lens as it opens: the case the figures are of, and the grid LensVisualizer's refinement ended
 * at for each of its five fields (0, 25, 50, 75 and 100 % of the image height), which the replay ended at too.
 */
const PINNED: Readonly<Record<string, readonly [caseId: string, grids: readonly number[]]>> = {
  "canon-ef-135-f2l-usm-ref": [
    "8f1f7d95653af82da64d44b73a272e7eb84232c67ee643e47207e067064ee070",
    [32, 32, 32, 64, 64],
  ],
  "canon-ef-135-f2l-usm-photopic": [
    "e9e741608e3f5f054625e1189a93c16f57e44893080a8ee4a9451df894df4c60",
    [32, 32, 32, 64, 64],
  ],
  "fujifilm-fujinon-gf-63mm-f28-r-wr-ref": [
    "a878f44443376f43150577ade0fdbfbebd809fc9bd062250397b27b0ac3eeea6",
    [64, 64, 128, 128, 128],
  ],
  "fujifilm-fujinon-gf-63mm-f28-r-wr-photopic": [
    "a193bba6b71293a0b4bac4f7d5a5aff691fc23bc2499284e1c033ad238daec10",
    [64, 64, 128, 64, 128],
  ],
  "sigma-35mm-f14-dg-hsm-a-ref": [
    "ccc14e33b434a6ec5fa8af08a14217b9ff7dc32c9d4f8b92125186fa3a45c97b",
    [32, 64, 128, 128, 128],
  ],
  "sigma-35mm-f14-dg-hsm-a-photopic": [
    "ecd0befffe5b28039511a637f8bd5c08c0932c526a143b07acfdc6e88c6c1ffa",
    [32, 64, 128, 128, 128],
  ],
  "nikkor-z50f12-ref": ["167e686b31a7497ca34af22c245b0c6cc3ddc6ccd060343c987f04ec18ae4c5f", [128, 128, 128, 128, 128]],
  "nikkor-z50f12-photopic": [
    "6981c5efa2e0f14d167c0ff9b3465552a294ef75eece6e3af725cabc027843c2",
    [64, 128, 64, 128, 128],
  ],
  "sony-fe-20mm-f18-g-ref": [
    "2e2afa23bd756f5a1091b5d7f1e7f85e104c97472530f52a0ea0076b336b4cab",
    [64, 64, 128, 128, 128],
  ],
  "sony-fe-20mm-f18-g-photopic": [
    "23b051950216b1004d67e9984a3181b877a25e5c1f50e7588fe868ade50fed35",
    [64, 64, 64, 64, 64],
  ],
  "sony-fe-400mm-f28-gm-oss-ref": [
    "f0819763fb3976af512ce84e17ce149008c06fed4c2f0280f03abc3fe7313fe8",
    [32, 64, 64, 64, 64],
  ],
  "sony-fe-400mm-f28-gm-oss-photopic": [
    "e3fb8ca13685378d51194b1fdc6cc573018861b1913f5e65407774b352c9b811",
    [64, 64, 64, 64, 64],
  ],
  "sigma-105mm-f28-dg-dn-macro-art-ref": [
    "e11ed3cae518f0c789667ce443bee69fbbe7fadd303e7a960b052999300848b1",
    [32, 64, 32, 32, 64],
  ],
  "sigma-105mm-f28-dg-dn-macro-art-photopic": [
    "50d94ea9ff30e0960b74dae45269cecd622dd75af41ca41a945e4761f1839d66",
    [32, 64, 64, 32, 64],
  ],
  "nikon-z-24-70f4s-wide-ref": [
    "327403ce09e2fc94b6122c0799aba12156ffad3f9b726829aeccb18d31efd709",
    [64, 128, 64, 64, 128],
  ],
  "nikon-z-24-70f4s-wide-photopic": [
    "06eff99a7dc852d126aa09c9eea6d4e7b19d5fc77d79c520b5624c3211295979",
    [64, 64, 64, 32, 64],
  ],
  "nikon-z-24-70f4s-tele-ref": [
    "ab9c8205a728d127b2ec6bf4b38f868de47d255de7807c917d0ba35ec4b8ca24",
    [32, 64, 64, 128, 128],
  ],
  "nikon-z-24-70f4s-tele-photopic": [
    "e7c0aa4bf2ee5a2b0afc8ac68e8a6115e586e7adcb01a741e880c320dba248bf",
    [32, 64, 64, 128, 128],
  ],
  "nikon-z-mc-105f28-ref": ["b5caeb649af604b677236805c0045528ed083c75a1164f65a9148a11a7bfbc54", [32, 32, 32, 128, 64]],
  "nikon-z-mc-105f28-photopic": [
    "98d1037760a2c357308bccbe8a4ca815d8c9cce422e54b913d74275645db123d",
    [32, 32, 32, 128, 64],
  ],
  "nikon-z-135f18-plena-ref": [
    "0403f9a540eed64c9b7aeed98d14bde823ac3dc2167b69b0ce5c8447d26227be",
    [64, 64, 64, 64, 128],
  ],
  "nikon-z-135f18-plena-photopic": [
    "d99ccec01961ff60514d1ae14ec6b29e59a96d0d11e3f02ea70dbd82169e30d3",
    [64, 64, 32, 64, 128],
  ],
  "sigma-45mm-f28-dg-dn-contemporary-ref": [
    "de1fd91c6b96ca5484034ae48a27924000fb59f1e8f719f78e2ee193da29d561",
    [64, 64, 64, 64, 128],
  ],
  "sigma-45mm-f28-dg-dn-contemporary-photopic": [
    "3a3ae023a4365a29b0c93a8c939aa2f8c31db5cc4786aa230701c72effd5aac4",
    [64, 64, 64, 64, 64],
  ],
};

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

/** The condition a run of the benchmark is named after: whether it is the f/8 comparison, at the best focus, its lines. */
function conditionOf(name: string): { readonly f8: boolean; readonly best: boolean; readonly lines: string } {
  const named = /(-f8)?(-best)?-(ref|photopic)$/.exec(name);
  assert.ok(named !== null, name);
  return { f8: named[1] !== undefined, best: named[2] !== undefined, lines: named[3] };
}

test(
  "lvrtc run --rungs r4f on the benchmark: the replay of LensVisualizer's sampling is its own geometric MTF, on all 480 fields",
  { skip, timeout: 900_000 },
  async (t) => {
    const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-fidelity-"));
    t.after(() => rmSync(runsDir, { recursive: true, force: true }));
    // No --engines: the suite names lv and ref, and the rung is asked of lv and of the replay whatever a run names.
    const ran = lvrtc(runsDir, "run", suitePath("benchmark"), "--rungs", "r4f");
    assert.equal(ran.code, 0, ran.err);
    assert.match(
      ran.out,
      /^benchmark: 192 jobs: 192 ok, 0 unsupported, 0 error, 0 pending \(192 computed, 0 cached\)$/m,
    );
    const compared = lvrtc(runsDir, "compare", "benchmark");
    const notPassing = compared.out.split("\n").filter((line) => / (FAIL|ERROR|UNSUPPORTED|BLOCKED)$/.test(line));
    assert.equal(compared.code, 0, notPassing.join("\n"));
    assert.match(compared.out, /^benchmark: 192 pairs: 192 PASS, 0 FLOOR, 0 FAIL, .* 0 ERROR$/m);

    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "benchmark", MANIFEST_FILE), "utf8"));
    const comparisons: ComparisonFile = JSON.parse(readFileSync(join(runsDir, "benchmark", COMPARISONS_FILE), "utf8"));
    assert.deepEqual(
      manifest.engines.map((engine) => [engine.id, engine.status]),
      [
        ["lv", "available"],
        ["replay", "available"],
      ],
    );
    const [lv] = manifest.engines;
    assert.ok(lv.status === "available");
    assert.equal(manifest.runs.length, 96);

    // ── The recipes: the plane and the stop of each run are LensVisualizer's own, asked a second time ──
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const store = createResultStore(join(runsDir, STORE_DIRECTORY));
    const frequencies = [...api.mtfDefaultFrequencies];
    let fields = 0;
    for (const run of manifest.runs) {
      const recipe = run.recipe?.recipe;
      assert.ok(recipe !== undefined && recipe !== null, `${run.name}: ${JSON.stringify(run.recipe?.problems)}`);
      const condition = conditionOf(run.name);
      const key = run.name.replace(/(-wide|-tele)?(-f8)?(-best)?-(ref|photopic)$/, "");
      const runtime = api.buildLens((await binding.lens(key)).data);
      const state = api.prepareRuntimeState(runtime, 0, /-tele-/.test(run.name) ? 1 : 0);

      // The request: LensVisualizer's own default fields and frequencies, on the lines of the run.
      assert.deepEqual(recipe.frequenciesPerMm, frequencies, run.name);
      assert.deepEqual(
        recipe.fields.map((field) => field.fraction),
        [...api.mtfDefaultFields],
        run.name,
      );
      assert.equal(recipe.lines.length, condition.lines === "ref" ? 1 : 5, run.name);
      for (const field of recipe.fields) assert.equal(field.problem, undefined, `${run.name} ${field.fraction}`);

      // The stop: the iris of the prepared state, or the tab's own f/8 comparison, to the bit; the tab offers it.
      const tab = lvTabRequest(api, runtime, state, "f8-comparison");
      assert.equal(tab.unavailable, null, key);
      const iris = state.surfaces[state.lens.stop.surfaceIndex].sd;
      const stop = condition.f8 ? tab.options.stopSemiDiameterMm : iris;
      assert.equal(recipe.stopSemiDiameter, stop, run.name);
      // The seed of the footprint scan is the tab's own for either stop.
      const options = lvGeneralMtfOptions(api, runtime, state, stop);
      const seed = condition.f8 ? tab.options.pupilSemiDiameterMm : lvHookAperture(api, runtime, state).currentEPSD;
      assert.equal(options.pupilSemiDiameterMm, seed, run.name);

      // The plane: the design plane, or the plane a whole computeMtf of the same request says it applied.
      if (condition.best) {
        const spectrum = condition.lines === "ref" ? "reference" : "photopic";
        const whole = api.computeMtf(
          ...lvMtfInputs(api, state, { ...options, spectrum, focus: "best-axial", fieldFractions: [0] }),
        );
        assert.ok(whole.focus !== null && whole.focus.mode === "best-axial", run.name);
        const shift = whole.focus.appliedShiftMm;
        assert.equal(recipe.plane.kind, "lv-best-axial", run.name);
        assert.equal(recipe.plane.lvBestAxialShiftMm, shift, run.name);
        assert.equal(recipe.imageZ, state.imgZ + shift, run.name);
        assert.ok(shift !== 0 && Math.abs(shift) < 1, `${run.name}: ${shift}`);
      } else {
        assert.deepEqual([recipe.plane.kind, recipe.plane.shiftMm, recipe.imageZ], ["design", 0, state.imgZ]);
      }

      // The answers: every field has curves in both, at the frequencies of the request, on the plane of the case.
      for (const job of manifest.jobs.filter((each) => each.run === run.name)) {
        const found = store.get(job.storeKey ?? "");
        assert.ok(found.kind === "hit", `${run.name} ${job.engine}`);
        const data = found.entry.result.data as MtfNativeData;
        assert.equal(data.fields.length, 5, run.name);
        assert.deepEqual(data.focus, { mode: "design", appliedShiftMm: 0 }, `${run.name} ${job.engine}`);
        assert.equal(data.method.params.focus, condition.best ? "best-axial" : "design", run.name);
        for (const field of data.fields) {
          assert.notEqual(field.status, "unavailable", `${run.name} ${job.engine} field ${field.field}`);
          assert.equal(field.sagittal.$nd.shape[0], frequencies.length);
          if (job.engine === "lv") fields++;
        }
      }
    }
    assert.equal(fields, 480);

    // ── The comparison ──
    const gate = loadPolicy().rungs.r4f.metrics["mtf.maxAbs"].tolerance;
    assert.equal(gate, 1e-9);
    const worst = { value: 0, at: "" };
    const table: string[] = [];
    for (const run of manifest.runs) {
      const set = comparisons.comparisons.find((each) => each.run === run.name && each.mode === "pairwise");
      assert.ok(set !== undefined && set.rung === "r4f" && set.quantity === "mtf.native", run.name);
      const [pair] = set.pairs;
      assert.deepEqual([set.pairs.length, pair.a, pair.b, pair.verdict], [1, "lv", "replay", "PASS"], run.name);
      const metrics = Object.fromEntries(pair.metrics.map((metric) => [metric.name, metric]));
      assert.equal(metrics["sampling.mismatches"].value, 0, run.name);
      assert.equal(metrics["fields.mismatches"].value, 0, run.name);
      const value = metrics["mtf.maxAbs"].value as number;
      if (value > worst.value) {
        Object.assign(worst, { value, at: `${run.name} ${JSON.stringify(metrics["mtf.maxAbs"].where)}` });
      }
      // What each answer states of its sampling, a value a field: the same grids and the same counts of rays.
      const [ofLv, ofReplay] = set.participants.map((participant) => participant.recorded);
      assert.ok(ofLv !== undefined);
      assert.deepEqual(ofReplay, ofLv, run.name);
      for (const grid of ofLv.gridSize) assert.ok([32, 64, 128].includes(grid as number), `${run.name}: ${grid}`);
      for (const rays of ofLv.validRays) assert.ok((rays as number) >= 16, `${run.name}: ${rays}`);
      table.push(`${run.name} ${value.toExponential(2)} [${ofLv.gridSize.join(",")}]`);

      const pinned = PINNED[run.name];
      if (pinned !== undefined && lv.fingerprint === PINNED_CLOSURE && run.caseId === pinned[0]) {
        assert.deepEqual(ofLv.gridSize, pinned[1], run.name);
      }
    }
    t.diagnostic(`R4f: worst mtf.maxAbs ${worst.value} (${worst.at}); per run, worst and grids: ${table.join("; ")}`);
    // Two ways of adding up the same terms: far below the gate, on every field of every condition.
    assert.ok(worst.value < 1e-12, `${worst.value} at ${worst.at}`);
    // Every condition of the benchmark was looked at: 12 runs of each, on each set of lines.
    for (const condition of BENCHMARK_CONDITIONS) {
      for (const lines of ["ref", "photopic"]) {
        const named = manifest.runs.filter(
          (run) => /(-f8)?(-best)?-(ref|photopic)$/.exec(run.name)?.[0] === `${condition}-${lines}`,
        );
        assert.equal(named.length, 12, `${condition}-${lines}`);
      }
    }
  },
);
