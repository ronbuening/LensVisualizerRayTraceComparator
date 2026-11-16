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
 * 7b756ee6 (177 files) at ab0fd4cf, and every figure was measured again there and found unchanged; at Stage 6.6b, at
 * LV 098c91ef6 (closure fef2e248, 178 files), every grid and case was measured again and found unchanged (worst R4f
 * mtf.maxAbs 1.69e-14); at Stage 6.8b, at LV 607ff23ae (closure f016b35b, 184 files: every stop resized by LV #933, and
 * #936's stop lattice refined to a cap of 256 cells across the stop), every case and grid moved and was pinned anew
 * (worst R4f mtf.maxAbs 1.30e-14); at LV 6287f4393 (closure fc5ae923, 184 files: LV #940), every case and grid was
 * measured again and found unchanged, the 192 answers the same bytes as at 607ff23ae (worst 1.2989609388114332e-14); at
 * LV 55ddfb1e1 (closure ff0d938d, 184 files: LV #942), every case and grid was measured again: unchanged but the Sigma
 * 35 mm's two cases, which moved with its authored rims (LV #943), its reference run's grid at 25 % with them (worst
 * again 1.2989609388114332e-14); at LV ff57c4469 (closure 0b6c085a, 184 files: LV #954), 290c6dd85 (closure 0516a7c7:
 * LV #949) and 25f65d4b4 (closure 4669921b: LV #950), every case and grid was measured again and found unchanged; at
 * LV 420b47555 (closure c5c5ba6d, 187 files: LV #960's curved image surfaces), every case and grid was measured again
 * and found unchanged (worst again 1.2989609388114332e-14); at LV f5b456fec (closure f0066505, 193 files: LV #988's
 * nine photopic lines and line-weighted unresolved share), the 12 reference-line runs the same cases and grids and the
 * 12 photopic runs new cases, measured and pinned anew: three grids moved (the Canon EF 135 mm's axis 64 to 32, the
 * Z 50 mm's 75 % field 64 to 128, the Sony FE 400 mm's full field 64 to 128), and the worst is again
 * 1.2989609388114332e-14, on a reference-line run.
 */
const PINNED_CLOSURE = "f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61";

/**
 * For each run of a lens as it opens: the case the figures are of, and the grid LensVisualizer's refinement ended
 * at for each of its five fields (0, 25, 50, 75 and 100 % of the image height), which the replay ended at too.
 */
const PINNED: Readonly<Record<string, readonly [caseId: string, grids: readonly number[]]>> = {
  "canon-ef-135-f2l-usm-ref": [
    "b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60",
    [32, 64, 32, 32, 128],
  ],
  "canon-ef-135-f2l-usm-photopic": [
    "b5db810e50204c2dc4f40c8720eec2acc118a3f5ba43ad7718e8e361f62c9a8c",
    [32, 64, 32, 32, 64],
  ],
  "fujifilm-fujinon-gf-63mm-f28-r-wr-ref": [
    "650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f",
    [64, 64, 128, 64, 128],
  ],
  "fujifilm-fujinon-gf-63mm-f28-r-wr-photopic": [
    "45f1fc0b454f809de9f793d565d6aa7bd8ca0460ea03e89c675039251c296a60",
    [64, 64, 64, 64, 128],
  ],
  "sigma-35mm-f14-dg-hsm-a-ref": [
    "18ef72984fad20ad086ba18f8b839edb2d9d142a51397b4b7c1a3cdf1565d456",
    [32, 128, 64, 128, 256],
  ],
  "sigma-35mm-f14-dg-hsm-a-photopic": [
    "49eae83980d3a2b089251ac79188e8e6f11910bfd72f33cb245397531e11cf16",
    [64, 64, 64, 128, 256],
  ],
  "nikkor-z50f12-ref": ["861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22", [64, 128, 64, 128, 256]],
  "nikkor-z50f12-photopic": [
    "84400e63b4de00e35171d3bd0bf8df3aa8e940f3d5dade0ee298761249c637e2",
    [64, 64, 64, 128, 128],
  ],
  "sony-fe-20mm-f18-g-ref": [
    "b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5",
    [64, 64, 128, 128, 256],
  ],
  "sony-fe-20mm-f18-g-photopic": [
    "3ef2cff569dc2714ff638c58f6b0ca0c1a10f180c31a8cf76095e96b3648dbda",
    [64, 64, 64, 64, 128],
  ],
  "sony-fe-400mm-f28-gm-oss-ref": [
    "75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5",
    [64, 64, 64, 64, 128],
  ],
  "sony-fe-400mm-f28-gm-oss-photopic": [
    "a58e00887093c8578107118a6f861e957b3ba012781c0061a213fc938268fd6d",
    [64, 64, 64, 32, 128],
  ],
  "sigma-105mm-f28-dg-dn-macro-art-ref": [
    "e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9",
    [64, 64, 64, 64, 64],
  ],
  "sigma-105mm-f28-dg-dn-macro-art-photopic": [
    "a164cd6b31901aed41e804b10704df98977ca3559bc547c2f876eefea0af010f",
    [64, 64, 64, 64, 64],
  ],
  "nikon-z-24-70f4s-wide-ref": [
    "baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997",
    [64, 64, 64, 64, 128],
  ],
  "nikon-z-24-70f4s-wide-photopic": [
    "392526a2d4fb6800be21455fb7097f75e53156a130b490f79830e62460359a12",
    [64, 64, 64, 64, 64],
  ],
  "nikon-z-24-70f4s-tele-ref": [
    "8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a",
    [64, 64, 64, 64, 128],
  ],
  "nikon-z-24-70f4s-tele-photopic": [
    "9e3b47006624814732c91d238b73f183b938f21c947092003915ea16b13a4827",
    [32, 64, 64, 64, 128],
  ],
  "nikon-z-mc-105f28-ref": ["70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb", [32, 64, 32, 64, 128]],
  "nikon-z-mc-105f28-photopic": [
    "ceaed4b7737a40f115bd46b8c7fff24f61a9b7586604a0c02db850a74702fc97",
    [32, 32, 32, 64, 128],
  ],
  "nikon-z-135f18-plena-ref": [
    "449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab",
    [64, 64, 64, 64, 64],
  ],
  "nikon-z-135f18-plena-photopic": [
    "47a027ecb521ce8e8589f9605124d6b966785de4024b1793e9961dbcfcc75afa",
    [64, 64, 64, 64, 64],
  ],
  "sigma-45mm-f28-dg-dn-contemporary-ref": [
    "2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8",
    [64, 64, 64, 64, 128],
  ],
  "sigma-45mm-f28-dg-dn-contemporary-photopic": [
    "e88166a19b0d185b63ed16ca4c493102684d84578284592096743da5fd9f8bdd",
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
  "lvrtc run --checks lv-mtf-replay on the benchmark: the replay of LensVisualizer's sampling is its own geometric MTF, on all 480 fields",
  { skip, timeout: 900_000 },
  async (t) => {
    const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-fidelity-"));
    t.after(() => rmSync(runsDir, { recursive: true, force: true }));
    // No --engines: the suite names lv and ref, and the rung is asked of lv and of the replay whatever a run names.
    const ran = lvrtc(runsDir, "run", suitePath("benchmark"), "--checks", "lv-mtf-replay");
    assert.equal(ran.code, 0, ran.err);
    assert.match(ran.out, /^benchmark: 192 jobs: 192 answered \(192 asked now\)$/m);
    const compared = lvrtc(runsDir, "compare", "benchmark");
    const notPassing = compared.out.split("\n").filter((line) => / (Fail|Error|Not computed|Not judged)$/.test(line));
    assert.equal(compared.code, 0, notPassing.join("\n"));
    assert.match(compared.out, /^benchmark: 192 pairs: 192 Pass$/m);

    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "benchmark", MANIFEST_FILE), "utf8"));
    const comparisons: ComparisonFile = JSON.parse(readFileSync(join(runsDir, "benchmark", COMPARISONS_FILE), "utf8"));
    assert.deepEqual(
      manifest.engines.map((engine) => [engine.id, engine.status]),
      [
        ["lv", "available"],
        ["replay-of-lv-mtf", "available"],
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
      // LV #988's nine photopic lines (five before f5b456fec).
      assert.equal(recipe.lines.length, condition.lines === "ref" ? 1 : 9, run.name);
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
    const gate = loadPolicy().rungs["lv-mtf-replay"].metrics["mtf.maxAbs"].tolerance;
    assert.equal(gate, 1e-9);
    const worst = { value: 0, at: "" };
    const table: string[] = [];
    for (const run of manifest.runs) {
      const set = comparisons.comparisons.find((each) => each.run === run.name && each.mode === "pairwise");
      assert.ok(set !== undefined && set.rung === "lv-mtf-replay" && set.quantity === "mtf.native", run.name);
      const [pair] = set.pairs;
      assert.deepEqual(
        [set.pairs.length, pair.a, pair.b, pair.verdict],
        [1, "lv", "replay-of-lv-mtf", "PASS"],
        run.name,
      );
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
      for (const grid of ofLv.gridSize) assert.ok([32, 64, 128, 256].includes(grid as number), `${run.name}: ${grid}`);
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
