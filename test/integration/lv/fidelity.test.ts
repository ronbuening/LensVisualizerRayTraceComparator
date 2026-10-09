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

/** The engine closure the pinned figures were measured with, at LV commit 33ebdb30. */
const PINNED_CLOSURE = "78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322";

/**
 * For each run of a lens as it opens: the case the figures are of, and the grid LensVisualizer's refinement ended
 * at for each of its five fields (0, 25, 50, 75 and 100 % of the image height), which the replay ended at too.
 */
const PINNED: Readonly<Record<string, readonly [caseId: string, grids: readonly number[]]>> = {
  "canon-ef-135-f2l-usm-ref": [
    "a6d48ab35a2b156dfd289972da3c241235e5719e4f44394dba994b88ef855811",
    [32, 32, 32, 64, 64],
  ],
  "canon-ef-135-f2l-usm-photopic": [
    "7546b205d77d460b81f5677e6f68df4e9dd48411a4daf40ae81d369241376dfb",
    [32, 32, 32, 64, 64],
  ],
  "fujifilm-fujinon-gf-63mm-f28-r-wr-ref": [
    "0def626662ce8a5a044699cc91f10cdfc2451c31abcd493d9937ea5bdc45c0ec",
    [64, 64, 128, 128, 128],
  ],
  "fujifilm-fujinon-gf-63mm-f28-r-wr-photopic": [
    "b8f48f28bf24a2f9c1b3a21a1bc99860d4e459b20d1281ec2af3069c9a3111c6",
    [64, 64, 128, 64, 128],
  ],
  "sigma-35mm-f14-dg-hsm-a-ref": [
    "cdac8e4c2106aa6698e08404431909cc479c67ce822c7ec38f4c42fe8c072a4e",
    [32, 64, 128, 128, 128],
  ],
  "sigma-35mm-f14-dg-hsm-a-photopic": [
    "1c6f0b1cef5938e7761eb57799b4c1a56426c888a5cd008ac534ec3aed4bc295",
    [32, 64, 128, 128, 128],
  ],
  "nikkor-z50f12-ref": ["e1be649bb890ed1a95b7b63fa4aa669de231ce9fb83905644a5845e327992132", [128, 128, 128, 128, 128]],
  "nikkor-z50f12-photopic": [
    "a48cd12c268fce7f40073f4073332978ffe6aa0b31c3df5430eda49655dc8743",
    [64, 128, 64, 128, 128],
  ],
  "sony-fe-20mm-f18-g-ref": [
    "50516f089be0c4b129c64debab14519ba562b703940872ad3a5ec7347087014f",
    [64, 64, 128, 128, 128],
  ],
  "sony-fe-20mm-f18-g-photopic": [
    "578066dcc4d993c9e2998eed77b34361e33cb29701fa3bfa8ff2c694db137b3c",
    [64, 64, 64, 64, 64],
  ],
  "sony-fe-400mm-f28-gm-oss-ref": [
    "6c7a2ee7b7e696475bf459c1e274cb8ab63631b0662c947d03c3b185a1babfb4",
    [32, 64, 64, 64, 64],
  ],
  "sony-fe-400mm-f28-gm-oss-photopic": [
    "2a0ec3806b69968108caa7beaf501604584cfad203f842420a3fb7aefa4c6828",
    [64, 64, 64, 64, 64],
  ],
  "sigma-105mm-f28-dg-dn-macro-art-ref": [
    "2c260cf3bcac5229f06ba783a895a8a2d1764c7160a4db212fa8fc82b3b080b4",
    [32, 64, 32, 32, 64],
  ],
  "sigma-105mm-f28-dg-dn-macro-art-photopic": [
    "8894694fd3bae9f442610f1015ab84b93b6e4e002d18d38b39ac103232f48f85",
    [32, 64, 64, 32, 64],
  ],
  "nikon-z-24-70f4s-wide-ref": [
    "674bf87ee00a2855de1cc25379ed3059c489c6dbce8d3217c4d1569ac61001a9",
    [64, 128, 64, 64, 128],
  ],
  "nikon-z-24-70f4s-wide-photopic": [
    "028766236f660e50f5758c50196a3781bb32d228d8d7b9536f143cdad27d83c4",
    [64, 64, 64, 32, 64],
  ],
  "nikon-z-24-70f4s-tele-ref": [
    "7a9c860bd996825e31a09fd968074bbe7b78fd6e0751b9f24a5f078654aaeada",
    [32, 64, 64, 128, 128],
  ],
  "nikon-z-24-70f4s-tele-photopic": [
    "b59d35d7c806b2049983b82296e1bd9c09410a057c81fcc475e497554e09b6aa",
    [32, 64, 64, 128, 128],
  ],
  "nikon-z-mc-105f28-ref": ["49213d8444e9b7728378948db9623f6ab5c3224c3b423aa3d49a397150931851", [32, 32, 32, 128, 64]],
  "nikon-z-mc-105f28-photopic": [
    "4f58ff165467b6c0b7bfccdbd29cf02ede1979a7978f3be4737ac4b0a29d05b1",
    [32, 32, 32, 128, 64],
  ],
  "nikon-z-135f18-plena-ref": [
    "d793020832ec36218155ce810f9a12833e80ffdb25c3a8fa5f1ff9365e4a288d",
    [64, 64, 64, 64, 128],
  ],
  "nikon-z-135f18-plena-photopic": [
    "783c198b65d92ad17c8fd60a0b2ebf6db6bb170fe7cecbe9ff5c1d72b5da4cdd",
    [64, 64, 32, 64, 128],
  ],
  "sigma-45mm-f28-dg-dn-contemporary-ref": [
    "35e161a10718741831dac37bbd61a43e14e8850254481ddaeba9e5411e27bab4",
    [64, 64, 64, 64, 128],
  ],
  "sigma-45mm-f28-dg-dn-contemporary-photopic": [
    "0d6bf53241b18117397d8e5ed7e0ea2c198ce050f6af301e88ae5e0fffbf2ea7",
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
        const whole = api.computeMtf(state, { ...options, spectrum, focus: "best-axial", fieldFractions: [0] });
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
