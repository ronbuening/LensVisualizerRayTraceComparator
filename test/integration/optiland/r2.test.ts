// Rung R2 with optiland: the same rays in three engines. Every engine is handed the rays LensVisualizer launches,
// or the probe lattice of a case file, and what optiland's own tracer makes of them is set against the reference
// engine's and LensVisualizer's, through the commands as a user runs them: where each ray meets each surface, the
// direction it leaves in, where it lands, and which rays got through.
//
// The contract's cases and the systems made for the rung need optiland only; the suites need LensVisualizer too.
// Each test skips with the reason when one of them is missing. Run output goes to a temporary directory, and the
// worker's caches under this repository's gitignored cache directory. What a pair is held to is `assertR2`
// (traced.ts), which the focus stations (stations.test.ts) are held to as well.
//
// The figures quoted in comments were measured at optiland 4e893f53 and LensVisualizer 14da71d9 (engine closure
// 78215d72, 151 files). Nothing is pinned to them: every gate is the policy's, a pair of LensVisualizer may be PASS
// or FLOOR, and none is asked to be a floor, so a LensVisualizer that meets its surfaces more closely turns nothing
// red.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { raysGeometryComparator } from "../../../src/compare/raysGeometry.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { paraxialFirstOrderQuantity } from "../../../src/quantities/paraxialFirstOrder.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { systemDescribeQuantity } from "../../../src/quantities/systemDescribe.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { RAYS_DATA_SINGLET, RAYS_SPEC_SINGLET } from "../../contract/corpus.ts";
import { caseFixture } from "../../core/support.ts";
import { caseOf } from "../../engines/ref/support.ts";
import { CASE } from "../../engines/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import {
  OPTILAND_UNAVAILABLE,
  WRAPPER_UNAVAILABLE,
  optilandRoot,
  runAndCompare,
  rungSuite,
  watchedInterpreter,
} from "./support.ts";
import type { RunCycle, RungPair } from "./support.ts";
import { AGREEMENT, GEOMETRY, SYSTEMS, assertR2, f8, figuresOf, optilandAnswers } from "./traced.ts";
import type { R2Summary } from "./traced.ts";

const skip = OPTILAND_UNAVAILABLE;
/** The suites are of LensVisualizer lenses, and are run on an interpreter that is watched. */
const skipSuites = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE || WRAPPER_UNAVAILABLE;

// ── One request, straight to the engine ──────────────────────────────────────────────────────────────────────────

test(
  "optiland traces the contract's worked rays to a rounding, says how, and refuses rays that are none",
  { skip, timeout: 600_000 },
  async (t) => {
    const adapter = await createEngineRegistry(optilandRoot(t)).create("optiland");
    t.after(() => adapter.close());
    const descriptor = await adapter.describe();
    assert.deepEqual(descriptor.capabilities.quantities, {
      [systemDescribeQuantity.id]: { version: systemDescribeQuantity.version },
      [paraxialFirstOrderQuantity.id]: { version: paraxialFirstOrderQuantity.version },
      [RAYS_TRACE]: { version: raysTraceQuantity.version },
    });

    const request = makeRequest({ caseId: CASE.id, quantity: RAYS_TRACE, spec: RAYS_SPEC_SINGLET });
    const result = await adapter.run(request, CASE);
    assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
    // The quantity's own rule: a number in every member of a ray that is ok, and NaN from where any other ended.
    assert.deepEqual(raysTraceQuantity.validateData(result.data), []);
    const data = result.data as RaysTraceData;
    // A ray along the axis, and one that meets the first surface outside its clip radius: exact in the worked
    // answer, and optiland's but for the last bit of the direction it refracts the first to.
    assert.deepEqual(data.status, RAYS_DATA_SINGLET.status);
    assert.deepEqual(data.endSurface, RAYS_DATA_SINGLET.endSurface);
    for (const name of [
      "hits",
      "exitPoint",
      "exitDirection",
      "imagePoint",
      "opticalPath",
      "opticalPathToImage",
    ] as const) {
      const [got, expected] = [f8(data[name]), f8(RAYS_DATA_SINGLET[name])];
      assert.deepEqual(data[name].$nd.shape, RAYS_DATA_SINGLET[name].$nd.shape, name);
      got.forEach((value, at) => {
        if (Number.isNaN(expected[at])) assert.ok(Number.isNaN(value), `${name}[${at}]`);
        else assert.ok(Math.abs(value - expected[at]) <= 2e-14, `${name}[${at}] ${value}, expected ${expected[at]}`);
      });
    }
    assert.deepEqual(result.method, {
      name: "surfaces-trace",
      params: {
        asphereTolerance: 1e-12,
        asphereMaxIterations: 100,
        onSurfaceTolerance: 1e-6,
        imagePlaneTolerance: 1e-9,
        maxBatchRays: 16384,
        landing: "image-surface",
        opticalPath: "opd-stretches-times-direction-length",
      },
    });
    assert.deepEqual(result.diagnostics, {
      warnings: [],
      counts: { surfaces: 2, rays: 2, ok: 1, blocked: 1, failed: 0, batches: 1 },
    });
    // The same request again is the same answer, in every bit.
    assert.deepEqual(await adapter.run(request, CASE), result);

    // A line the case does not have, and a direction that is no unit vector: the engine's own error, before a ray
    // is handed to optiland, which would take the second for a direction.
    const noLine = makeRequest({ caseId: CASE.id, quantity: RAYS_TRACE, spec: { ...RAYS_SPEC_SINGLET, line: 1 } });
    const refused = await adapter.run(noLine, CASE);
    assert.deepEqual([refused.status, refused.error?.code], ["error", "bad-spec"]);
    assert.match(refused.error?.message ?? "", /\/line \[invariant\] 1 is not a line of the case, which has 1$/);
    const long = encodeNdArray(Float64Array.from([0, 0, 1, 0, 0.6, 0.9]), [2, 3]);
    const skewed = makeRequest({
      caseId: CASE.id,
      quantity: RAYS_TRACE,
      spec: { ...RAYS_SPEC_SINGLET, directions: long },
    });
    const unbent = await adapter.run(skewed, CASE);
    assert.deepEqual([unbent.status, unbent.error?.code], ["error", "bad-spec"]);
    assert.match(unbent.error?.message ?? "", /the direction of ray 1 is not a unit vector with a z component above 0/);
  },
);

test(
  "a request of 20 000 rays is traced in two batches inside the worker, and is the reference engine's answer",
  { skip, timeout: 600_000 },
  async (t) => {
    const optiland = await createEngineRegistry(optilandRoot(t)).create("optiland");
    const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
    t.after(() => Promise.all([optiland.close(), ref.close()]));
    const opticalCase: OpticalCase = JSON.parse(readFileSync(caseFixture("double-gauss"), "utf8"));

    // A fan across the first surface and past its rim on both sides, at 8 degrees: more rays than one batch holds.
    const rays = 20_000;
    const reach = 1.2 * opticalCase.system.surfaces[0].aperture.semiDiameter;
    const [sine, cosine] = [Math.sin((8 * Math.PI) / 180), Math.cos((8 * Math.PI) / 180)];
    const origins = new Float64Array(3 * rays);
    const directions = new Float64Array(3 * rays);
    for (let ray = 0; ray < rays; ray++) {
      const along = -reach + (2 * reach * (ray + 0.5)) / rays;
      origins.set([0.37 * along, along, -30], 3 * ray);
      directions.set([0, -sine, cosine], 3 * ray);
    }
    const spec: RaysTraceSpec = {
      line: 0,
      origins: encodeNdArray(origins, [rays, 3]),
      directions: encodeNdArray(directions, [rays, 3]),
      weights: encodeNdArray(new Float64Array(rays).fill(1)),
      groups: { field: { angleDeg: 8 } },
    };
    assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
    const request = makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec });

    // The worker is started and has said who it is before the clock runs.
    await optiland.describe();
    const started = performance.now();
    const traced = await optiland.run(request, opticalCase);
    const optilandMs = performance.now() - started;
    const exact = await ref.run(request, opticalCase);
    assert.deepEqual([traced.status, exact.status], ["ok", "ok"], JSON.stringify(traced.error ?? exact.error));
    assert.deepEqual(raysTraceQuantity.validateData(traced.data), []);
    const counts = traced.diagnostics.counts;
    assert.equal(counts.batches, 2, "16 384 rays, and the rest");
    assert.deepEqual([counts.rays, counts.failed, counts.ok + counts.blocked], [rays, 0, rays]);
    assert.ok(counts.ok > 1000 && counts.blocked > 1000, JSON.stringify(counts));

    // The comparator of R2 on the two answers: the same rays got through, and they went the same way.
    const outcome = raysGeometryComparator.compare(traced.data as JsonObject, exact.data as JsonObject, {
      opticalCase,
      spec,
    });
    assert.ok(outcome.comparable);
    const metrics = Object.fromEntries(outcome.metrics.map((metric) => [metric.name, metric.value]));
    assert.equal(metrics["rays.compared"], counts.ok);
    assert.deepEqual([metrics["mask.mismatches"], metrics["mask.rimBand"]], [0, 0]);
    for (const name of GEOMETRY) assert.ok(metrics[name] <= AGREEMENT[name], `${name} ${metrics[name]}`);
    t.diagnostic(
      `20 000 rays through ${opticalCase.system.surfaces.length} surfaces: ${optilandMs.toFixed(0)} ms from request ` +
        `to answer; ${JSON.stringify(counts)}; against ref ${GEOMETRY.map((name) => `${name} ${metrics[name]}`).join(", ")}`,
    );
    // Ray by ray the two engines say the same, across the seam of the two batches as anywhere: the ends of the fan
    // start beyond the rim, and a stretch in the middle of it lands.
    const status = decodeNdArray((traced.data as RaysTraceData).status).values;
    assert.deepEqual((traced.data as RaysTraceData).status, (exact.data as RaysTraceData).status);
    assert.deepEqual((traced.data as RaysTraceData).endSurface, (exact.data as RaysTraceData).endSurface);
    assert.deepEqual([status[0], status[rays - 1]], [RAY_STATUS.blocked, RAY_STATUS.blocked]);
    assert.ok(
      status.slice(16_000, 16_800).includes(RAY_STATUS.ok) || status.slice(8_000, 12_000).includes(RAY_STATUS.ok),
    );
  },
);

// ── The contract's cases and systems made for the rung: optiland against the reference engine ────────────────────

test(
  "R2 of the contract's cases and of systems made for it: optiland's rays are ref's, ray by ray and surface by surface",
  { skip, timeout: 900_000 },
  (t) => {
    const { rootDir } = optilandRoot(t);
    const fixtures = ["singlet", "double-gauss", "all-features"];
    const made = Object.entries(SYSTEMS).map(([name, [surfaces, more]]) => [name, caseOf(surfaces, more)] as const);
    mkdirSync(join(rootDir, "cases"));
    for (const name of fixtures) writeFileSync(join(rootDir, "cases", `${name}.json`), readFileSync(caseFixture(name)));
    for (const [name, opticalCase] of made) {
      writeFileSync(join(rootDir, "cases", `${name}.json`), JSON.stringify(opticalCase));
    }
    const names = [...fixtures, ...made.map(([name]) => name)];
    // A case file states no image height: its fields are angles, and its rays a lattice over the first surface
    // and past its rim.
    const suite = {
      contract: CONTRACT_VERSION,
      kind: "suite",
      name: "made-for-r2",
      defaults: { fields: { kind: "angles-deg", values: [0, 5, 12] }, sampling: { bundleGrid: 32 } },
      runs: names.map((name) => ({ name, lens: { kind: "fixture", path: `cases/${name}.json` } })),
    };
    writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));

    const cycle = runAndCompare(t, {
      suite: "suite.json",
      name: "made-for-r2",
      engines: "ref,optiland",
      rungs: "r2",
      root: rootDir,
    });
    const manifest: RunManifest = cycle.manifest;
    assert.deepEqual(
      manifest.jobs.filter((job) => job.status !== "ok").map((job) => [job.run, job.engine, job.status, job.error]),
      [],
    );
    // Three fields a line: 14 lines over the 12 cases, 42 ray sets, each traced by both.
    const sets = manifest.runs.reduce((total, run) => total + (run.raySets?.sets.length ?? 0), 0);
    assert.equal(sets, 3 * 14);
    assert.equal(manifest.jobs.length, 2 * sets);
    assert.deepEqual(
      manifest.runs.flatMap((run) => run.raySets?.problems ?? []),
      [],
    );
    const { pairs, counts } = assertR2(t, "made for R2", cycle.comparisons);
    assert.deepEqual([...new Set(pairs.map((pair) => pair.engines))], ["optiland / ref"]);
    assert.equal(pairs.length, sets);
    // The two engines stopped the same rays, at the same surfaces, for whatever reason each has.
    assert.deepEqual(counts.optiland, counts.ref);

    // What each system is there for happened, in optiland's answers: rays ended at the surface that reflects and
    // at the obstruction, and rays that landed stepped backwards onto a surface set into the curve before it.
    const answers = optilandAnswers(cycle);
    const ofRun = (run: string): RaysTraceData[] =>
      [...answers].filter(([key]) => key.startsWith(`${run} `)).map(([, data]) => data);
    const ended = (run: string): number[] =>
      [...new Set(ofRun(run).flatMap((data) => [...decodeNdArray(data.endSurface).values]))].sort((a, b) => a - b);
    assert.ok(
      ended("hemisphere-out-of-glass").includes(1),
      "a ray was totally reflected, or met the rim, at the sphere",
    );
    assert.ok(ended("annulus").includes(2), "a ray met the obstruction");
    for (const run of ["plane-set-into-a-curve", "sphere-set-into-a-curve", "asphere-set-into-a-curve"]) {
      const backwards = ofRun(run).some((data) => {
        const [status, hits] = [decodeNdArray(data.status).values, f8(data.hits)];
        const rays = status.length;
        // The z of a ray's hit on the second surface against that of its hit on the first.
        return [...status].some(
          (ended, ray) => ended === RAY_STATUS.ok && hits[(rays + ray) * 3 + 2] < hits[ray * 3 + 2],
        );
      });
      assert.ok(backwards, `${run}: a ray that landed met the second surface behind its hit on the first`);
    }
  },
);

// ── The suites: lv, ref and optiland ─────────────────────────────────────────────────────────────────────────────

/**
 * A suite on rung R2 by all three engines, then once more with optiland run without numba's JIT, into the same
 * runs directory, so that `lv` and `ref` are found in the result store and only optiland computes again.
 */
function threeWays(t: TestContext, suite: "benchmark" | "features"): { on: R2Summary; cycle: RunCycle } {
  const engines = "lv,ref,optiland";
  const compiled = watchedInterpreter(t);
  const suiteFile = rungSuite(t, suite);
  const cycle = runAndCompare(t, {
    suite: suiteFile,
    name: suite,
    engines,
    rungs: "r2",
    python: compiled.python,
  });
  // One worker process for the run: every ray set of it went to the process that answered hello.
  assert.equal(compiled.starts(), 1);
  const { manifest } = cycle;
  assert.ok(manifest.jobs.every((job) => job.status === "ok" && job.rung === "r2"));
  const sets = manifest.runs.reduce((total, run) => total + (run.raySets?.sets.length ?? 0), 0);
  assert.equal(manifest.jobs.length, 3 * sets);
  const on = assertR2(t, suite, cycle.comparisons);
  assert.equal(on.pairs.length, 3 * sets);
  assert.deepEqual([...new Set(on.pairs.map((pair) => pair.engines))].sort(), [
    "lv / optiland",
    "lv / ref",
    "optiland / ref",
  ]);
  const optiland = manifest.engines.find((engine) => engine.id === "optiland");
  assert.ok(optiland !== undefined && optiland.status === "available" && optiland.details.jit === true);

  // The same again without the JIT. It is another engine to the result store: its fingerprint says so.
  const interpreted = watchedInterpreter(t, { jit: "off" });
  const again = runAndCompare(t, {
    suite: suiteFile,
    name: suite,
    engines,
    rungs: "r2",
    python: interpreted.python,
    runsDir: cycle.runsDir,
  });
  assert.equal(interpreted.starts(), 1);
  const plain = again.manifest.engines.find((engine) => engine.id === "optiland");
  assert.ok(plain !== undefined && plain.status === "available" && plain.details.jit === false);
  assert.notEqual(plain.fingerprint, optiland.fingerprint);
  assert.equal(plain.adapterRevision, optiland.adapterRevision);
  const off = assertR2(t, `${suite}, optiland without the JIT`, again.comparisons);
  assert.deepEqual(off.verdicts, on.verdicts);
  assert.deepEqual(off.counts, on.counts);

  // Figure by figure: compiling changes nothing beyond a rounding, in any pair of any ray set.
  const [withJit, without] = [figuresOf(on.pairs), figuresOf(off.pairs)];
  assert.deepEqual([...without.keys()], [...withJit.keys()]);
  let moved = 0;
  for (const [key, pair] of withJit) {
    const other = without.get(key) as RungPair;
    for (const [name, { value }] of Object.entries(pair.metrics)) {
      const interpretedValue = other.metrics[name]?.value;
      const change = Math.abs((value ?? NaN) - (interpretedValue ?? NaN));
      assert.ok(change <= 1e-13, `${key} ${name}: ${value} with the JIT, ${interpretedValue} without`);
      moved = Math.max(moved, change);
    }
  }
  // And answer by answer: how many are the same bytes, and how far the others are apart.
  const [compiledAnswers, plainAnswers] = [optilandAnswers(cycle), optilandAnswers(again)];
  assert.deepEqual([...plainAnswers.keys()], [...compiledAnswers.keys()]);
  assert.equal(compiledAnswers.size, sets);
  let same = 0;
  let apart = 0;
  for (const [key, data] of compiledAnswers) {
    const other = plainAnswers.get(key) as RaysTraceData;
    assert.deepEqual([other.status, other.endSurface], [data.status, data.endSurface], `${key}: the rays ended alike`);
    const names = Object.keys(data) as (keyof RaysTraceData)[];
    if (names.every((name) => data[name].$nd.sha256 === other[name].$nd.sha256)) {
      same++;
      continue;
    }
    for (const name of names) {
      if (data[name].$nd.dtype !== "f8" || data[name].$nd.sha256 === other[name].$nd.sha256) continue;
      const [a, b] = [f8(data[name]), f8(other[name])];
      a.forEach((value, at) => {
        if (Number.isNaN(value) && Number.isNaN(b[at])) return;
        apart = Math.max(apart, Math.abs(value - b[at]));
      });
    }
  }
  assert.ok(apart <= 1e-12, `an answer differs by ${apart} between the JIT and none`);
  t.diagnostic(
    `${suite}: lvrtc run on three engines ${cycle.runSeconds.toFixed(1)} s (${sets} ray sets); with optiland ` +
      `without the JIT, lv and ref from the store, ${again.runSeconds.toFixed(1)} s; ${same} of ${sets} answers of ` +
      `optiland are the same bytes either way, the others within ${apart}; no figure of a pair moved by more ` +
      `than ${moved}`,
  );
  return { on, cycle };
}

test(
  "the benchmark on R2, three ways: every pair passes, optiland is ref's witness on every ray set, JIT or none",
  { skip: skipSuites, timeout: 1_800_000 },
  (t) => {
    const { on, cycle } = threeWays(t, "benchmark");
    // 12 configurations, three fields, the reference line and the five photopic ones.
    assert.equal(cycle.manifest.runs.length, 24);
    assert.equal(on.pairs.length / 3, 216);
    // Measured: optiland and ref within 1.2e-12 mm in every hit, 2.1e-14 in direction and 8.9e-13 mm in landing,
    // over 137 596 rays; every pair of LensVisualizer inside its gates, so the benchmark has no floor.
    assert.match(
      cycle.verdicts,
      /^benchmark: 1080 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
  },
);

test(
  "the feature suite on R2, three ways: every translation path passes, and a floor would name its witness",
  { skip: skipSuites, timeout: 1_800_000 },
  (t) => {
    const { on, cycle } = threeWays(t, "features");
    // 16 runs as written, 18 as run: the fixed-iris zoom is run at both ends.
    assert.equal(cycle.manifest.runs.length, 18);
    assert.equal(on.pairs.length / 3, 162);
    assert.match(
      cycle.verdicts,
      /^features: 810 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
    // Measured: four floors, of the Hologon at its full field at 470 nm and 510 nm, against ref and against
    // optiland alike, where its landing is 1.10e-8 mm from both and the two are 2.2e-13 mm from each other. None is
    // asked for here: `assertR2` holds whatever is a floor to naming both figures, and a LensVisualizer that meets
    // its surfaces more closely has none.
    const floors = on.pairs.filter((pair) => pair.verdict === "FLOOR");
    t.diagnostic(`features: floors ${JSON.stringify(floors.map((pair) => `${pair.run} ${pair.engines}`))}`);
    for (const pair of floors) t.diagnostic(`features: ${pair.run}, ${pair.engines}: ${pair.reason ?? ""}`);
  },
);
