// The engine `lv` against the real LensVisualizer: rungs R0 and R1 of `lv` against `ref` on the committed suites,
// through the commands as a user runs them, and LensVisualizer's own first-order module as the check of what the
// engine assembles from the kernel. Run output goes to a temporary directory.
//
// The numbers quoted in comments, and the pinned ones, were measured at LV commit d36f44b3 with the catalog of that
// commit.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { COMPARISONS_FILE } from "../../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import type { ComputedMetric } from "../../../src/compare/comparator.ts";
import { COMPARATORS } from "../../../src/compare/index.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { finalizeCase } from "../../../src/contract/case.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { PARAXIAL_FIRST_ORDER } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import { SYSTEM_DESCRIBE } from "../../../src/contract/quantities/systemDescribe.ts";
import type { SystemDescribeData } from "../../../src/contract/quantities/systemDescribe.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn, lvDescriptor } from "../../../src/engines/lv/engine.ts";
import { problemCode } from "../../../src/engines/lv/exportProblems.ts";
import { LV_STORED_CONSTANTS } from "../../../src/engines/lv/firstOrder.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { suitePath } from "../../suites/support.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const POLICY = loadPolicy();

/** A temporary directory that is removed when the test ends. */
function tempDir(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-lv-engine-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** Runs one `lvrtc` command as a child process, on the real LensVisualizer, writing runs into `runsDir`. */
function lvrtc(runsDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
  const child = spawnSync(process.execPath, [BIN, ...args], { encoding: "utf8", cwd: REPO_ROOT, env });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

/** The largest value of each metric over the pairs of a comparison file, with the run and the place it occurs at. */
function worstMetrics(file: ComparisonFile): Record<string, { value: number; at: string }> {
  const worst: Record<string, { value: number; at: string }> = {};
  for (const set of file.comparisons) {
    for (const pair of set.pairs) {
      for (const metric of pair.metrics) {
        assert.ok(metric.value !== null, `${set.run} ${metric.name} is not finite`);
        if (worst[metric.name] === undefined || metric.value > worst[metric.name].value) {
          worst[metric.name] = { value: metric.value, at: `${set.run} ${JSON.stringify(metric.where ?? {})}` };
        }
      }
    }
  }
  return worst;
}

/**
 * Runs a committed suite on `lv` and `ref` for R0 and R1 through `lvrtc run`, compares it through `lvrtc compare`,
 * and returns the manifest and the comparisons.
 */
function ranAndCompared(t: TestContext, suite: "benchmark" | "features") {
  const runsDir = tempDir(t);
  const ran = lvrtc(runsDir, "run", suitePath(suite), "--engines", "lv,ref", "--rungs", "r0,r1");
  const compared = lvrtc(runsDir, "compare", suite);
  const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, suite, MANIFEST_FILE), "utf8"));
  const comparisons: ComparisonFile = JSON.parse(readFileSync(join(runsDir, suite, COMPARISONS_FILE), "utf8"));
  return { ran, compared, manifest, comparisons };
}

/** Every pair of a comparison file as `run rung mode: verdict`, for the pairs that are not PASS. */
function notPassing(file: ComparisonFile): string[] {
  return file.comparisons.flatMap((set) =>
    set.pairs
      .filter((pair) => pair.verdict !== "PASS")
      .map((pair) => `${set.run} ${set.rung} ${set.mode}: ${pair.verdict} ${pair.reason ?? ""}`),
  );
}

function f8(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return decoded.values as Float64Array;
}

/** `lv` on the real LensVisualizer and `ref`, each behind an adapter, in this process. */
async function engines(
  t: TestContext,
): Promise<{ binding: LvBinding; lv: RemoteEngineAdapter; ref: RemoteEngineAdapter }> {
  const binding = await loadLvBinding(LV_PATH);
  const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => Promise.all([lv.close(), ref.close()]));
  return { binding, lv, ref };
}

function ask(engine: RemoteEngineAdapter, opticalCase: OpticalCase, quantity: string): Promise<ResultEnvelope> {
  return engine.run(makeRequest({ caseId: opticalCase.id, quantity, spec: {} }), opticalCase);
}

/** The metrics of a quantity's comparator on what `lv` and `ref` answer about a case, by name, and lv's answer. */
async function compared(
  lv: RemoteEngineAdapter,
  ref: RemoteEngineAdapter,
  opticalCase: OpticalCase,
  quantity: string,
  at: string,
): Promise<{ metrics: Record<string, ComputedMetric>; mine: JsonObject }> {
  const results: ResultEnvelope[] = [await ask(lv, opticalCase, quantity), await ask(ref, opticalCase, quantity)];
  for (const result of results) {
    assert.equal(result.status, "ok", `${at} ${quantity}: ${JSON.stringify(result.error ?? result.unsupported)}`);
  }
  const [mine, theirs] = results.map((result) => result.data as JsonObject);
  const outcome = COMPARATORS.get(quantity)?.compare(mine, theirs);
  assert.ok(outcome?.comparable, `${at} ${quantity}`);
  return { metrics: Object.fromEntries(outcome.metrics.map((metric) => [metric.name, metric])), mine };
}

// ── Through the commands ─────────────────────────────────────────────────────────────────────────────────────────

test(
  "lvrtc run and compare: on the benchmark suite lv and ref pass R0 and R1 at the reference and photopic lines",
  { skip },
  (t) => {
    const { ran, compared, manifest, comparisons } = ranAndCompared(t, "benchmark");
    assert.equal(ran.code, 0, ran.err);
    assert.match(ran.out, /^benchmark: 96 jobs: 96 ok, 0 unsupported, 0 error, 0 pending \(96 computed, 0 cached\)$/m);
    assert.equal(compared.code, 0, compared.err);
    assert.match(compared.out, /^benchmark: 96 pairs: 96 PASS, 0 FAIL, .* 0 ERROR$/m);

    // 12 configurations, each on its reference line and on the five photopic lines, in two rungs and two modes.
    assert.equal(manifest.runs.length, 24);
    assert.deepEqual(notPassing(comparisons), []);
    assert.equal(comparisons.comparisons.length, 96);
    const configurations = new Set(manifest.runs.map((run) => run.name.replace(/-(ref|photopic)$/, "")));
    assert.equal(configurations.size, 12);
    for (const key of BENCHMARK_KEYS) {
      assert.ok(
        [...configurations].some((configuration) => configuration.startsWith(key)),
        key,
      );
    }
    for (const configuration of configurations) {
      for (const lines of ["ref", "photopic"]) {
        const sets = comparisons.comparisons.filter((set) => set.run === `${configuration}-${lines}`);
        assert.deepEqual(sets.map((set) => `${set.rung} ${set.mode}`).sort(), [
          "r0 pairwise",
          "r0 reference-vs-each",
          "r1 pairwise",
          "r1 reference-vs-each",
        ]);
        for (const set of sets) assert.deepEqual([set.pairs.length, set.pairs[0].verdict], [1, "PASS"], set.run);
      }
    }

    const worst = worstMetrics(comparisons);
    t.diagnostic(
      `benchmark: worst R0 sag difference ${worst["sag.maxAbs"].value} mm (${worst["sag.maxAbs"].at}), scaled ` +
        `${worst["sag.maxScaled"].value} (${worst["sag.maxScaled"].at}); worst R1 difference ` +
        `${worst["firstOrder.maxAbs"].value} mm (${worst["firstOrder.maxAbs"].at})`,
    );
    for (const count of ["layout", "shape", "aperture", "index"]) assert.equal(worst[`${count}.mismatches`].value, 0);
    // At d36f44b3: the sag differs by at most 3.6e-15 mm (sony-fe-400mm-f28-gm-oss, surface 13) and 4.0e-16 on the
    // scale of its rounding (sony-fe-20mm-f18-g, surface 6); the first-order data by at most 1.6e-12 mm, on the front
    // focal point of sony-fe-400mm-f28-gm-oss at 470 nm, which lies 1.2 m in front of the lens.
    assert.ok(worst["sag.maxAbs"].value < 1e-13, JSON.stringify(worst["sag.maxAbs"]));
    assert.ok(worst["sag.maxScaled"].value < 1e-14, JSON.stringify(worst["sag.maxScaled"]));
    assert.ok(worst["firstOrder.maxAbs"].value < 1e-10, JSON.stringify(worst["firstOrder.maxAbs"]));
  },
);

test(
  "lvrtc run and compare: on the feature suite every lens with a case passes R0 and R1, and the others say why not",
  { skip },
  (t) => {
    const { ran, compared, manifest, comparisons } = ranAndCompared(t, "features");
    // Two runs have no case, which is a failure of the run command and no pair of the comparison.
    assert.equal(ran.code, 1);
    assert.match(ran.out, /^features: 64 jobs: 64 ok, 0 unsupported, 0 error, 0 pending \(64 computed, 0 cached\)$/m);
    const withoutCase = manifest.runs.filter((run) => run.caseId === null);
    assert.deepEqual(
      withoutCase.map((run) => [run.name, run.problems.map(problemCode)]),
      [
        // The one lens that mixes d- and e-referenced glasses lacks wavelength data for some of them.
        ["mixed-d-e-ref", ["mixed-reference"]],
        // Every lens with an annular aperture is a mirror lens.
        ["annular-aperture-ref", ["folded-path", "non-refract-interaction"]],
      ],
    );
    for (const run of withoutCase)
      assert.match(ran.err, new RegExp(`^lvrtc run: run ${run.name} was not started: `, "m"));

    assert.equal(compared.code, 0, compared.err);
    assert.deepEqual(notPassing(comparisons), []);
    const compared16 = new Set(comparisons.comparisons.map((set) => set.run));
    assert.deepEqual(
      [...compared16].sort(),
      manifest.runs
        .filter((run) => run.caseId !== null)
        .map((run) => run.name)
        .sort(),
    );
    assert.equal(compared16.size, 16);
    assert.equal(comparisons.comparisons.length, 64);

    const worst = worstMetrics(comparisons);
    t.diagnostic(
      `features: worst R0 sag difference ${worst["sag.maxAbs"].value} mm (${worst["sag.maxAbs"].at}), scaled ` +
        `${worst["sag.maxScaled"].value} (${worst["sag.maxScaled"].at}); worst R1 difference ` +
        `${worst["firstOrder.maxAbs"].value} mm (${worst["firstOrder.maxAbs"].at})`,
    );
    for (const count of ["layout", "shape", "aperture", "index"]) assert.equal(worst[`${count}.mismatches`].value, 0);
    // At d36f44b3: the sag differs by at most 3.6e-15 mm (zero-asphere-ref, surface 1) and 3.3e-16 scaled
    // (odd-asphere-ref, surface 3); the first-order data by at most 8.5e-14 mm, on the exit pupil of
    // fixed-iris-zoom-tele-photopic at 610 nm.
    assert.ok(worst["sag.maxAbs"].value < 1e-13, JSON.stringify(worst["sag.maxAbs"]));
    assert.ok(worst["sag.maxScaled"].value < 1e-14, JSON.stringify(worst["sag.maxScaled"]));
    assert.ok(worst["firstOrder.maxAbs"].value < 1e-10, JSON.stringify(worst["firstOrder.maxAbs"]));
  },
);

test("lvrtc run: a case with one index nudged is reported stale-case by lv, and answered by ref", { skip }, (t) => {
  const rootDir = tempDir(t);
  mkdirSync(join(rootDir, "cases"));
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: LV_PATH }));
  const runsDir = join(rootDir, "runs");

  const exportedFile = join(rootDir, "cases", "exported.json");
  const exported = lvrtc(runsDir, "export", "nikkor-z50f12", "--lines", "photopic", "--out", exportedFile);
  assert.equal(exported.code, 0, exported.err);
  const opticalCase: OpticalCase = JSON.parse(readFileSync(exportedFile, "utf8"));
  // The index after the first surface at the first line, moved by a part in a million; the case is finished again,
  // so it is a valid case that states its own ids.
  const table = decodeNdArray(opticalCase.conditions.indexAfterSurface);
  assert.ok(table.dtype === "f8" && table.values[0] > 1);
  table.values[0] *= 1 + 1e-6;
  const nudged = finalizeCase({
    label: opticalCase.label,
    system: opticalCase.system,
    conditions: { ...opticalCase.conditions, indexAfterSurface: encodeNdArray(table.values, table.shape) },
    provenance: opticalCase.provenance,
  });
  assert.equal(nudged.systemId, opticalCase.systemId);
  writeFileSync(join(rootDir, "cases", "nudged.json"), `${canonicalJson(nudged)}\n`);
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "stale",
    runs: [
      { name: "exported", lens: { kind: "fixture", path: "cases/exported.json" } },
      { name: "nudged", lens: { kind: "fixture", path: "cases/nudged.json" } },
    ],
  };
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));

  const ran = lvrtc(
    runsDir,
    "run",
    join(rootDir, "suite.json"),
    "--root",
    rootDir,
    "--engines",
    "lv,ref",
    "--rungs",
    "r0,r1",
  );
  assert.equal(ran.code, 1, "a stale case is an error");
  assert.match(ran.out, /^stale: 8 jobs: 6 ok, 0 unsupported, 2 error, 0 pending /m);
  for (const rung of ["r0", "r1"]) {
    assert.match(ran.out, new RegExp(`^exported +${rung} +lv +ok +computed$`, "m"));
    assert.match(
      ran.out,
      new RegExp(
        `^nudged +${rung} +lv +error +computed +stale-case: the case of lens nikkor-z50f12 is stale: its conditions ` +
          "are not the ones LensVisualizer gives for the same lines, stop and focus; neither the lens file nor " +
          "LensVisualizer's engine code has changed since it was exported: the case itself was altered$",
        "m",
      ),
    );
    assert.match(ran.out, new RegExp(`^nudged +${rung} +ref +ok +computed$`, "m"));
  }
  const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "stale", MANIFEST_FILE), "utf8"));
  assert.deepEqual(
    manifest.jobs.filter((job) => job.status === "error").map((job) => [job.run, job.engine, job.error]),
    [
      ["nudged", "lv", { code: "stale-case" }],
      ["nudged", "lv", { code: "stale-case" }],
    ],
  );
});

test(
  "lvrtc engine conformance lv passes, and lv says it is the LensVisualizer the binding loaded",
  { skip },
  async (t) => {
    const conformance = lvrtc(tempDir(t), "engine", "conformance", "lv");
    assert.equal(conformance.code, 0, conformance.out + conformance.err);
    assert.match(conformance.out, /^lv: conforms: 8 passed, 0 failed, 7 skipped$/m);

    const { binding, lv } = await engines(t);
    const descriptor = await lv.describe();
    const fingerprint = binding.fingerprint();
    assert.deepEqual(descriptor, lvDescriptor(fingerprint));
    assert.equal(descriptor.identity.fingerprint, fingerprint.engineClosureHash);
    assert.deepEqual(descriptor.identity.details, {
      commit: fingerprint.commit,
      dirty: fingerprint.dirty,
      engineFileCount: fingerprint.engineFileCount,
    });
    // The closure is complete before any lens is read: reading the catalog and building a lens adds no engine file,
    // so the fingerprint the engine states at hello is the one its last result is computed under.
    await binding.catalog();
    binding.api.prepareRuntimeState(binding.api.buildLens((await binding.lens("nikkor-z50f12")).data), 0, 0);
    assert.equal(binding.engineClosure().engineClosureHash, descriptor.identity.fingerprint);
  },
);

// ── Against LensVisualizer's own first-order module ──────────────────────────────────────────────────────────────

test(
  "at a line traced with the authored indices, lv's cardinal points are LensVisualizer's computeCardinalElements2",
  { skip },
  async (t) => {
    const { binding, lv } = await engines(t);
    let compared = 0;
    const hold = async (at: string, opticalCase: OpticalCase): Promise<void> => {
      const { source } = opticalCase.provenance;
      assert.ok(source.kind === "lv-lens" && source.zoomT !== undefined && source.focusT !== undefined, at);
      const result = await ask(lv, opticalCase, PARAXIAL_FIRST_ORDER);
      assert.equal(result.status, "ok", `${at}: ${JSON.stringify(result.error ?? result.unsupported)}`);
      const data = result.data as ParaxialFirstOrderData;
      const runtime = binding.api.buildLens((await binding.lens(source.lensKey)).data);
      const state = binding.api.prepareRuntimeState(runtime, source.focusT, source.zoomT);
      const theirs = binding.api.computeCardinalElements2(state);
      assert.ok(theirs !== null, at);
      opticalCase.conditions.lines.forEach((line, row) => {
        // LensVisualizer's module reads each surface's authored index, so it speaks for such a line only.
        if (line.indexSource !== "authored") return;
        const pairs: [quantity: FirstOrderValue, theirs: number][] = [
          ["efl", theirs.distances.efl.valueMm],
          ["backFocus", theirs.distances.bfd.valueMm],
          ["frontFocalZ", theirs.points.frontFocal.z],
          ["rearFocalZ", theirs.points.rearFocal.z],
          ["frontPrincipalZ", theirs.points.frontPrincipal.z],
          ["rearPrincipalZ", theirs.points.rearPrincipal.z],
        ];
        // The same kernel on the same radii, gaps and indices, through the same construction: the same doubles.
        for (const [quantity, expected] of pairs) assert.equal(f8(data[quantity])[row], expected, `${at}: ${quantity}`);
        compared++;
      });
    };

    const exporter = createLvExporter(binding);
    for (const { key } of (await binding.catalog()).entries) {
      const result = await exporter.exportLens(key, {});
      if (result.ok) await hold(key, result.opticalCase);
    }
    const lenses = compared;
    const sources = { lv: createLvCaseSource(LV_PATH) };
    for (const name of ["benchmark", "features"] as const) {
      const suite = await loadSuite(suitePath(name), { rootDir: REPO_ROOT, sources });
      for (const { spec, opticalCase } of suite.runs) {
        if (opticalCase !== null) await hold(`${name}/${spec.name}`, opticalCase);
      }
    }
    t.diagnostic(`${lenses} lenses and ${compared - lenses} runs of the suites, each equal to the last bit`);
    // At d36f44b3: 868 lenses, and the 20 runs of the two suites that are on an authored reference line.
    assert.ok(lenses > 800, String(lenses));
    assert.ok(compared - lenses >= 20, String(compared - lenses));
  },
);

test("lv's answers for three benchmark lenses are the numbers measured at LV d36f44b3", { skip }, async (t) => {
  const { binding, lv } = await engines(t);
  const exporter = createLvExporter(binding);
  const firstOrder = async (key: string, options: RunOptions = {}): Promise<Record<string, number[]>> => {
    const exported = await exporter.exportLens(key, options);
    assert.ok(exported.ok, key);
    const result = await ask(lv, exported.opticalCase, PARAXIAL_FIRST_ORDER);
    assert.equal(result.status, "ok", key);
    const { recorded, ...values } = result.data as ParaxialFirstOrderData;
    return Object.fromEntries(Object.entries({ ...values, ...recorded }).map(([name, wire]) => [name, [...f8(wire)]]));
  };
  const near = (actual: number, expected: number, what: string): void =>
    assert.ok(Math.abs(actual - expected) < 1e-9, `${what}: ${actual}, pinned ${expected}`);

  // The focal lengths are the ones optiland gave for the same systems when the plan was researched.
  const z50 = await firstOrder("nikkor-z50f12");
  near(z50.efl[0], 51.28923234165666, "z50 efl");
  near(z50.backFocus[0], 13.112212137842732, "z50 back focus, the rear plate inside it");
  near(z50.entrancePupilZ[0], 50.61955508569735, "z50 entrance pupil");
  near(z50.exitPupilZ[0], 98.69653622287234, "z50 exit pupil");
  near(z50.entrancePupilSemiDiameter[0], 21.615131666794674, "z50 entrance pupil radius");
  // LensVisualizer's stored constants are other numbers: positions found with real rays, 2.4e-7 mm and 1.3e-6 mm
  // from the paraxial ones, and a nominal entrance pupil of f/1.23, 0.77 mm smaller than the image of the stop.
  near(z50.lvStoredEntrancePupilZ[0], 50.61955484914813, "z50 stored entrance pupil");
  near(z50.lvStoredExitPupilZ[0], 98.69653750142477, "z50 stored exit pupil");
  near(z50.lvNominalEntrancePupilSemiDiameter[0], 20.849281439697823, "z50 nominal entrance pupil radius");
  near(z50.lvStoredExitPupilSemiDiameter[0], 26.264095380641113, "z50 stored exit pupil radius");
  assert.equal(z50.lvNominalFNumber[0], 1.23);
  assert.deepEqual(
    Object.keys(z50)
      .filter((name) => name.startsWith("lv"))
      .sort(),
    [...LV_STORED_CONSTANTS].sort(),
  );

  near((await firstOrder("canon-ef-135-f2l-usm")).efl[0], 133.49535810557805, "canon 135 efl");
  near((await firstOrder("sigma-45mm-f28-dg-dn-contemporary")).efl[0], 43.926951714760605, "sigma 45 efl");

  // A zoom at its long end: the stored constants are those of that end, which LensVisualizer interpolates to.
  const tele = await firstOrder("nikon-z-24-70f4s", { state: { zoomT: 1 } });
  near(tele.efl[0], 67.9124223064535, "24-70 at 70 efl");
  near(tele.lvStoredEntrancePupilZ[0], 79.74014924086694, "24-70 at 70 stored entrance pupil");
  assert.equal(tele.lvNominalFNumber[0], 4);

  // At the photopic lines LensVisualizer's own first-order module has nothing to say: the kernel answers each line
  // with its anchored indices, and no stored constant is defined there.
  const photopic = await firstOrder("nikkor-z50f12", { lines: { kind: "photopic" } });
  assert.equal(photopic.efl.length, 5);
  near(photopic.efl[0], 51.260126330933545, "z50 efl at 555 nm");
  near(photopic.efl[1], 51.20538404057052, "z50 efl at 470 nm");
  near(photopic.efl[4], 51.345908811530634, "z50 efl at 650 nm");
  assert.deepEqual(
    Object.keys(photopic).filter((name) => name.startsWith("lv")),
    [],
  );
});

test(
  "at every focus station LensVisualizer certifies, lv and ref pass R0 and R1 and record one magnification",
  { skip },
  async (t) => {
    const { binding, lv, ref } = await engines(t);
    const exporter = createLvExporter(binding);
    const worst = { firstOrder: 0, at: "" };
    let stations = 0;
    for (const { key } of (await binding.catalog()).entries) {
      const stationsOf = (await binding.lens(key)).data.finiteConjugates as
        { focusT: number; zoomT: number }[] | undefined;
      for (const { focusT, zoomT } of stationsOf ?? []) {
        const exported = await exporter.exportLens(key, { state: { zoomT, focus: { kind: "focusT", value: focusT } } });
        assert.ok(exported.ok, `${key}: ${JSON.stringify(exported)}`);
        const at = `${key} at focus ${focusT}, zoom ${zoomT}`;
        assert.equal(exported.opticalCase.conditions.object.kind, "finite", at);
        const echo = (await compared(lv, ref, exported.opticalCase, SYSTEM_DESCRIBE, at)).metrics;
        for (const count of ["layout", "shape", "aperture", "index"])
          assert.equal(echo[`${count}.mismatches`].value, 0);
        assert.ok(echo["sag.maxScaled"].value <= 1e-12, at);
        const first = await compared(lv, ref, exported.opticalCase, PARAXIAL_FIRST_ORDER, at);
        const difference = first.metrics["firstOrder.maxAbs"].value;
        assert.ok(difference <= 1e-9, `${at}: ${difference} mm`);
        if (difference > worst.firstOrder) Object.assign(worst, { firstOrder: difference, at });

        // Away from infinity focus LensVisualizer's stored constants are those of another state: lv records the
        // magnification of the object and nothing else, and ref records the same magnification from its own kernel.
        const mine = (first.mine as ParaxialFirstOrderData).recorded;
        assert.deepEqual(Object.keys(mine), ["magnification"], at);
        const theirs = (await ask(ref, exported.opticalCase, PARAXIAL_FIRST_ORDER)).data as ParaxialFirstOrderData;
        const [m, n] = [f8(mine.magnification)[0], f8(theirs.recorded.magnification)[0]];
        assert.ok(m < 0 && Math.abs(m - n) <= 1e-12 * Math.abs(m), `${at}: ${m} against ${n}`);
        stations++;
      }
    }
    t.diagnostic(`${stations} certified focus stations: worst R1 difference ${worst.firstOrder} mm (${worst.at})`);
    // At d36f44b3: 19 stations of 12 lenses, from 1:40 to 1:1; the first-order data differ by at most 3.8e-13 mm.
    assert.ok(stations >= 10, String(stations));
    assert.ok(worst.firstOrder < 1e-10, `${worst.firstOrder} mm on ${worst.at}`);
  },
);

// ── Against LensVisualizer's own tracer ──────────────────────────────────────────────────────────────────────────

/** One hit of LensVisualizer's tracer, the members read here (its TraceHit). */
interface TracedHit {
  readonly surfaceIndex: number;
  readonly point: readonly [number, number, number];
  readonly radius: number;
  readonly clipped: boolean;
  readonly failureReason: string | null;
}

test(
  "LensVisualizer's own tracer puts its hits on the surfaces lv describes, and clips where lv says it does",
  { skip },
  async (t) => {
    const { binding, lv } = await engines(t);
    const { api } = binding;
    const exporter = createLvExporter(binding);
    // The contract's sag, written out here: the code of neither engine.
    const sagOf = (c: number, k: number, terms: readonly { power: number; coeff: number }[], r: number): number =>
      terms.reduce(
        (z, { power, coeff }) => z + coeff * r ** power,
        c === 0 ? 0 : (c * r * r) / (1 + Math.sqrt(1 - (1 + k) * c * c * r * r)),
      );
    const lenses: [key: string, options: RunOptions][] = [
      // Aspheres to A20 and a rear plate, stopped down: the stop row must be the stop of the case.
      ["nikkor-z50f12", { aperture: { kind: "f-number", value: 4 } }],
      // Odd terms; an asphere on a flat base; a stop inside an element; a zoom at its long end.
      ["zeiss-touit-50mm-f28-macro", {}],
      ["zeiss-zx1-distagon-35mm-f2", {}],
      ["zeiss-hologon-15f8", {}],
      ["nikon-z-24-70f4s", { state: { zoomT: 1 } }],
    ];
    const seen = { hits: 0, clipped: 0, clippedAtStop: 0, worst: 0, worstAt: "" };
    for (const [key, options] of lenses) {
      const exported = await exporter.exportLens(key, options);
      assert.ok(exported.ok, key);
      const opticalCase = exported.opticalCase;
      const { source } = opticalCase.provenance;
      assert.ok(source.kind === "lv-lens" && source.zoomT !== undefined && source.focusT !== undefined, key);
      const described = await ask(lv, opticalCase, SYSTEM_DESCRIBE);
      const first = await ask(lv, opticalCase, PARAXIAL_FIRST_ORDER);
      assert.deepEqual([described.status, first.status], ["ok", "ok"], key);
      const data = described.data as SystemDescribeData;
      const [vertexZ, curvature, conic, clipRadius] = [data.vertexZ, data.curvature, data.conic, data.clipRadius].map(
        f8,
      );
      const [pupilRadius] = f8((first.data as ParaxialFirstOrderData).entrancePupilSemiDiameter);

      const state = api.prepareRuntimeState(api.buildLens((await binding.lens(key)).data), source.focusT, source.zoomT);
      // Rays across the pupil and beyond its rim, along the axis and 2 degrees off it, clipped as a trace clips.
      for (const fraction of [0.15, 0.4, 0.7, 0.95, 1.05, 1.4]) {
        for (const angle of [0, (2 * Math.PI) / 180]) {
          const height = fraction * pupilRadius;
          const traced = api.traceEngineRay2(
            state,
            { origin: [0.3 * height, height, -5], direction: [0, -Math.sin(angle), Math.cos(angle)] },
            { checkSemiDiameter: true, stopSemiDiameter: data.stopSemiDiameter, stopOnClip: true },
          );
          for (const hit of traced.hits as readonly TracedHit[]) {
            if (hit.failureReason !== null) continue;
            const index = hit.surfaceIndex;
            const at = `${key} surface ${index} at radius ${hit.radius}`;
            const onSurface = vertexZ[index] + sagOf(curvature[index], conic[index], data.terms[index], hit.radius);
            const off = Math.abs(hit.point[2] - onSurface);
            if (off > seen.worst) Object.assign(seen, { worst: off, worstAt: at });
            assert.equal(hit.clipped, hit.radius > clipRadius[index], `${at}: clip radius ${clipRadius[index]}`);
            seen.hits++;
            if (hit.clipped) seen.clipped++;
            if (hit.clipped && index === data.stopIndex) seen.clippedAtStop++;
          }
        }
      }
    }
    t.diagnostic(
      `${seen.hits} hits, ${seen.clipped} of them clipped (${seen.clippedAtStop} at a stop): ` +
        `farthest from the surface lv describes ${seen.worst} mm (${seen.worstAt})`,
    );
    // At d36f44b3: LensVisualizer's intersection stops within 1e-9 mm of the surface, which is its own tolerance.
    assert.ok(seen.worst < 5e-9, `${seen.worst} mm on ${seen.worstAt}`);
    assert.ok(seen.hits > 500 && seen.clipped >= 10 && seen.clippedAtStop >= 2, JSON.stringify(seen));
  },
);

// ── Over the catalog ─────────────────────────────────────────────────────────────────────────────────────────────

test(
  "on every exported lens, at the reference and photopic lines, lv and ref pass R0, and R1 but for a far pupil",
  { skip },
  async (t) => {
    const { binding, lv, ref } = await engines(t);
    const exporter = createLvExporter(binding);
    const limits = {
      sag: POLICY.rungs.r0.metrics["sag.maxScaled"].tolerance as number,
      firstOrder: POLICY.rungs.r1.metrics["firstOrder.maxAbs"].tolerance as number,
    };
    assert.deepEqual(limits, { sag: 1e-12, firstOrder: 1e-9 });

    const worst = { scaled: 0, scaledAt: "", abs: 0, absAt: "", firstOrder: 0, firstOrderAt: "" };
    const overR1 = new Map<string, string>();
    let cases = 0;
    for (const { key } of (await binding.catalog()).entries) {
      for (const lines of [{ kind: "reference" }, { kind: "photopic" }] as const) {
        const exported = await exporter.exportLens(key, { lines });
        if (!exported.ok) continue;
        cases++;
        const at = `${key} ${lines.kind}`;

        const echo = (await compared(lv, ref, exported.opticalCase, SYSTEM_DESCRIBE, at)).metrics;
        for (const count of ["layout", "shape", "aperture", "index"]) {
          const mismatches = echo[`${count}.mismatches`];
          assert.equal(mismatches.value, 0, `${at}: ${count} ${JSON.stringify(mismatches.where)}`);
        }
        const [scaled, abs] = [echo["sag.maxScaled"], echo["sag.maxAbs"]];
        assert.ok(scaled.value <= limits.sag, `${at}: sag.maxScaled ${scaled.value} ${JSON.stringify(scaled.where)}`);
        if (scaled.value > worst.scaled) Object.assign(worst, { scaled: scaled.value, scaledAt: at });
        if (abs.value > worst.abs) Object.assign(worst, { abs: abs.value, absAt: at });

        const first = await compared(lv, ref, exported.opticalCase, PARAXIAL_FIRST_ORDER, at);
        const difference = first.metrics["firstOrder.maxAbs"];
        const where = difference.where as { quantity: FirstOrderValue; line: number };
        if (difference.value > worst.firstOrder) {
          Object.assign(worst, { firstOrder: difference.value, firstOrderAt: `${at} ${JSON.stringify(where)}` });
        }
        if (difference.value > limits.firstOrder) {
          // The one way two right kernels are that far apart: a pupil metres away, placed to parts in 1e13.
          const value = f8((first.mine as ParaxialFirstOrderData)[where.quantity])[where.line];
          assert.ok(where.quantity === "exitPupilZ" || where.quantity === "entrancePupilZ", `${at}: ${where.quantity}`);
          assert.ok(Math.abs(value) > 1000, `${at}: ${where.quantity} is only ${value} mm away`);
          assert.ok(difference.value <= limits.firstOrder * (Math.abs(value) / 1000), `${at}: ${difference.value} mm`);
          overR1.set(key, `${difference.value} mm of ${value} mm`);
        }
      }
    }
    const over = [...overR1].map(([key, said]) => `${key} (${said})`).join(", ") || "none";
    t.diagnostic(
      `${cases} cases: worst R0 sag difference ${worst.abs} mm (${worst.absAt}), scaled ${worst.scaled} ` +
        `(${worst.scaledAt}); worst R1 difference ${worst.firstOrder} mm (${worst.firstOrderAt}); above the R1 ` +
        `tolerance: ${over}`,
    );
    assert.ok(cases > 1500, `about 1680 cases export, found ${cases}`);
    // At d36f44b3, over 1676 cases of 868 lenses: the echo is equal throughout, and the sag differs by at most
    // 5.5e-16 on the scale of its rounding (sony-fe-70-200mm-f28-gm-ii) and 1.3e-10 mm in plain terms, on
    // russar-22-70f8, whose second surface ends just short of a hemisphere.
    assert.ok(worst.scaled < 1e-14, `${worst.scaled} on ${worst.scaledAt}`);
    assert.ok(worst.abs < 1e-9, `${worst.abs} mm on ${worst.absAt}`);
    // One lens is above the tolerance of R1: viltrox-af-75mm-f12-pro, whose exit pupil lies 7.7 m away at the d line
    // and up to 20 m away at a photopic one, differs by 1.1e-9 mm and 3.0e-9 mm there. See docs/gotchas.md.
    assert.ok(overR1.size <= 3, `only a nearly telecentric lens is that far off: ${over}`);
    assert.ok(worst.firstOrder < 1e-7, `${worst.firstOrder} mm on ${worst.firstOrderAt}`);
  },
);
