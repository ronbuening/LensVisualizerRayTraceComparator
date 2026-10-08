// Ray sets in a run: the seam between the source of a run's case and the rungs that trace rays. The orchestrator
// asks the source once per run, only when such a rung is run, hands the sets to the rung, and records them.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import { RAYS_TRACE, RAYS_TRACE_VERSION } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import type { SuiteRunResult } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import { r2Rung, r3Rung, rayTraceRequests, selftestRung } from "../../src/core/rungs.ts";
import { createFixtureCaseSource } from "../../src/core/suite.ts";
import type { CaseSource } from "../../src/core/suite.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import { probeRaySets } from "../../src/rays/probe.ts";
import { raySetId } from "../../src/rays/raySets.ts";
import type { RaySetResolution } from "../../src/rays/raySets.ts";
import { ALL_FEATURES_CASE, RAYS_SPEC_LATTICE, RAYS_SPEC_SINGLET } from "../contract/corpus.ts";
import { DOUBLE_GAUSS, SINGLET, fakeEngine, suiteOf, tempDir, watchedRegistry } from "./support.ts";
import type { EngineMaker } from "./support.ts";

/** A trace in which every ray was blocked at the first surface: valid data for any rays through any surfaces. */
function allBlocked(spec: RaysTraceSpec, surfaces: number): RaysTraceData {
  const [rays] = spec.weights.$nd.shape;
  const nan = (...shape: number[]) =>
    encodeNdArray(new Float64Array(shape.reduce((count, extent) => count * extent, 1)).fill(NaN), shape);
  return {
    status: encodeNdArray(new Uint8Array(rays).fill(1)),
    endSurface: encodeNdArray(new Int32Array(rays)),
    hits: nan(surfaces, rays, 3),
    exitPoint: nan(rays, 3),
    exitDirection: nan(rays, 3),
    imagePoint: nan(rays, 3),
    opticalPath: nan(rays),
    opticalPathToImage: nan(rays),
  };
}

/** An engine that offers `rays.trace` and nothing else, and blocks every ray it is handed at the first surface. */
const tracer: EngineMaker = (id) => {
  const descriptor: EngineDescriptor = {
    contract: { min: CONTRACT_VERSION, max: CONTRACT_VERSION },
    identity: { id, version: "1", fingerprint: `${id}-sources`, details: {} },
    capabilities: {
      features: { supported: [...ALL_FEATURES_CASE.features], limits: {} },
      quantities: { [RAYS_TRACE]: { version: RAYS_TRACE_VERSION } },
      deterministic: true,
      maxConcurrency: 1,
    },
  };
  return {
    id,
    describe: async () => descriptor,
    run: async (request, opticalCase) =>
      makeResult(request, engineStamp(descriptor.identity), {
        status: "ok",
        data: allBlocked(request.spec as RaysTraceSpec, opticalCase.system.surfaces.length),
      }),
    close: async () => undefined,
  };
};

/** A source of rays that says what it was asked, and answers each run with what `sets` gives for it. */
function watchedSource(sets: (run: string) => RaySetResolution): { source: CaseSource; asked: string[] } {
  const asked: string[] = [];
  const source: CaseSource = {
    resolve: async () => ({ ok: false, problems: ["the suites of these tests are built in memory"] }),
    raySets: (run, opticalCase) => {
      asked.push(`${run.name} ${opticalCase.id.slice(0, 8)}`);
      return sets(run.name);
    },
  };
  return { source, asked };
}

const LATTICE: RaysTraceSpec = { ...RAYS_SPEC_LATTICE, line: 0 };
const BOTH: RaySetResolution = { sets: [RAYS_SPEC_SINGLET, LATTICE], problems: [] };

function rows(result: SuiteRunResult): string[] {
  return result.outcomes.map(({ job, source }) => `${job.run} ${job.rung} ${job.engine} ${job.status} ${source}`);
}

test("a rung that traces rays is handed the sets of the run's source, and asks one request for each", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  const { source, asked } = watchedSource(() => BOTH);
  const engines = watchedRegistry({ tracer, fake: fakeEngine() });
  const suite = suiteOf("rays", [
    { name: "singlet", opticalCase: SINGLET },
    { name: "double-gauss", opticalCase: DOUBLE_GAUSS },
  ]);
  const result = await runSuite({
    suite,
    registry: engines.registry,
    runsDir,
    sources: { fixture: source },
    rungs: ["r2"],
  });

  // The source was asked once for each run, with the run and its case.
  assert.deepEqual(asked, [`singlet ${SINGLET.id.slice(0, 8)}`, `double-gauss ${DOUBLE_GAUSS.id.slice(0, 8)}`]);
  // Two sets a run: two requests for each engine. The fake does not offer the quantity and is not asked.
  assert.deepEqual(rows(result), [
    "singlet r2 fake unsupported negotiated",
    "singlet r2 fake unsupported negotiated",
    "singlet r2 tracer ok computed",
    "singlet r2 tracer ok computed",
    "double-gauss r2 fake unsupported negotiated",
    "double-gauss r2 fake unsupported negotiated",
    "double-gauss r2 tracer ok computed",
    "double-gauss r2 tracer ok computed",
  ]);
  for (const [index, opticalCase] of [SINGLET, DOUBLE_GAUSS].entries()) {
    const expected = rayTraceRequests(opticalCase, { raySets: BOTH.sets });
    const jobs = result.manifest.jobs.filter((job) => job.caseId === opticalCase.id && job.engine === "tracer");
    assert.deepEqual(
      jobs.map((job) => [job.quantity, job.requestId]),
      expected.map((request) => [RAYS_TRACE, request.id]),
    );
    // What the engine was handed is the set, bit for bit, in a request about the run's case.
    assert.deepEqual(engines.requests.slice(2 * index, 2 * index + 2), expected);
    assert.deepEqual(
      expected[0],
      makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec: RAYS_SPEC_SINGLET }),
    );
  }

  // The manifest records the identity of each set, and no ray: the rays are in the requests of the store.
  const identities = { sets: [raySetId(RAYS_SPEC_SINGLET), raySetId(LATTICE)], problems: [] };
  assert.deepEqual(
    result.manifest.runs.map((run) => run.raySets),
    [identities, identities],
  );
  const text = readFileSync(join(runsDir, "rays", MANIFEST_FILE), "utf8");
  assert.ok(!text.includes(RAYS_SPEC_SINGLET.origins.$nd.data));
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const stored = store.get(result.manifest.jobs.find((job) => job.status === "ok")?.storeKey ?? "");
  assert.ok(stored.kind === "hit");
  assert.deepEqual(stored.entry.request.spec, RAYS_SPEC_SINGLET);
  assert.deepEqual(raysTraceQuantity.validateData(stored.entry.result.data), []);
});

test("two rungs that trace rays share the sets and the answers: the source is asked once, the engine once", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  const { source, asked } = watchedSource(() => BOTH);
  const engines = watchedRegistry({ tracer });
  // Rungs R2 and R3 of the ladder: two rungs of one quantity, asking the same requests.
  const suite = suiteOf("shared", [{ name: "singlet", opticalCase: SINGLET }]);
  const result = await runSuite({
    suite,
    registry: engines.registry,
    runsDir,
    sources: { fixture: source },
    rungDefinitions: [selftestRung, r2Rung, r3Rung],
    rungs: ["r2", "r3"],
  });
  assert.equal(asked.length, 1);
  assert.deepEqual(rows(result), [
    "singlet r2 tracer ok computed",
    "singlet r2 tracer ok computed",
    "singlet r3 tracer ok cached",
    "singlet r3 tracer ok cached",
  ]);
  assert.equal(engines.ran.length, 2);
  const [first, second, third, fourth] = result.manifest.jobs;
  assert.deepEqual([third.requestId, third.storeKey], [first.requestId, first.storeKey]);
  assert.deepEqual([fourth.requestId, fourth.storeKey], [second.requestId, second.storeKey]);
});

test("the sets are generated only when a rung that needs them is run, and never for a run without a case", async (t) => {
  const { source, asked } = watchedSource(() => BOTH);
  const suite = suiteOf("lazy", [
    { name: "singlet", opticalCase: SINGLET },
    { name: "no-case", opticalCase: null, problems: ["its lens has no case"] },
  ]);
  const sources = { fixture: source };
  // A run of rungs none of which traces rays: the source is not asked, and the manifest states no sets.
  const plain = await runSuite({
    suite,
    registry: watchedRegistry({ fake: fakeEngine() }).registry,
    runsDir: tempDir(t),
    sources,
    rungs: ["selftest", "r0", "r1"],
  });
  assert.deepEqual(asked, []);
  assert.deepEqual(
    plain.manifest.jobs.map((job) => job.rung),
    ["selftest", "r0", "r1"],
  );
  assert.deepEqual(
    plain.manifest.runs.map((run) => Object.hasOwn(run, "raySets")),
    [false, false],
  );
  // A run that names no rung gets every rung, the two of traced rays among them: the sets are made once for both.
  const every = await runSuite({
    suite,
    registry: watchedRegistry({ tracer }).registry,
    runsDir: tempDir(t),
    sources,
  });
  assert.deepEqual(asked.splice(0), [`singlet ${SINGLET.id.slice(0, 8)}`]);
  assert.deepEqual(
    every.manifest.jobs.map((job) => `${job.rung} ${job.status}`),
    ["selftest unsupported", "r0 unsupported", "r1 unsupported", "r2 ok", "r2 ok", "r3 ok", "r3 ok"],
  );

  const traced = await runSuite({
    suite,
    registry: watchedRegistry({ tracer }).registry,
    runsDir: tempDir(t),
    sources,
    rungs: ["r0", "r2"],
  });
  assert.deepEqual(asked, [`singlet ${SINGLET.id.slice(0, 8)}`]);
  assert.deepEqual(traced.manifest.runs[1], { name: "no-case", caseId: null, problems: ["its lens has no case"] });
  assert.equal(traced.manifest.runs[0].raySets?.sets.length, 2);
  // A rung that needs no rays is handed none: r0 asks what it always asks.
  assert.deepEqual(
    traced.manifest.jobs.map((job) => `${job.rung} ${job.status}`),
    ["r0 unsupported", "r2 ok", "r2 ok"],
  );
});

test("a field without rays is recorded with its code and fails nothing; the run traces the sets there are", async (t) => {
  const problems = [
    "outside-modeled-field: the image height 21.6 mm (fraction 1) lies beyond the modeled edge of the field at 20 mm",
  ];
  const { source } = watchedSource((run) => (run === "short" ? { sets: [RAYS_SPEC_SINGLET], problems } : BOTH));
  const suite = suiteOf("fields", [
    { name: "short", opticalCase: SINGLET },
    { name: "whole", opticalCase: DOUBLE_GAUSS },
  ]);
  const result = await runSuite({
    suite,
    registry: watchedRegistry({ tracer }).registry,
    runsDir: tempDir(t),
    sources: { fixture: source },
    rungs: ["r2"],
  });
  assert.deepEqual(
    result.manifest.runs.map((run) => [run.name, run.problems, run.raySets?.sets.length, run.raySets?.problems]),
    [
      ["short", [], 1, problems],
      ["whole", [], 2, []],
    ],
  );
  assert.deepEqual(rows(result), [
    "short r2 tracer ok computed",
    "whole r2 tracer ok computed",
    "whole r2 tracer ok computed",
  ]);
  assert.deepEqual(result.warnings, []);
});

test("a lens whose source makes no rays has no ray jobs, and the manifest says why", async (t) => {
  const suite = suiteOf("none", [{ name: "singlet", opticalCase: SINGLET }]);
  const without = { resolve: watchedSource(() => BOTH).source.resolve };
  for (const sources of [undefined, {}, { fixture: without }]) {
    const result = await runSuite({
      suite,
      registry: watchedRegistry({ tracer }).registry,
      runsDir: tempDir(t),
      sources,
      rungs: ["r2"],
    });
    assert.deepEqual(result.manifest.jobs, []);
    assert.deepEqual(result.manifest.runs[0].raySets, {
      sets: [],
      problems: ["ray-sets-unavailable: no case source generates rays for this lens"],
    });
  }
});

test("a case read from a file is traced with its probe lattices, at each of its fields and lines", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  const options = { fields: { kind: "angles-deg", values: [0, 2] }, sampling: { bundleGrid: 4 } } as const;
  const suite = suiteOf("probe", [
    { name: "two-lines", opticalCase: ALL_FEATURES_CASE, ...options },
    { name: "default-fields", opticalCase: SINGLET, sampling: { bundleGrid: 4 } },
  ]);
  const run = () =>
    runSuite({
      suite,
      registry: watchedRegistry({ tracer }).registry,
      runsDir,
      sources: { fixture: createFixtureCaseSource("/nowhere") },
      rungs: ["r2"],
    });
  const result = await run();
  const probe = probeRaySets(ALL_FEATURES_CASE, options);
  assert.equal(probe.sets.length, 4);
  // Two fields at two lines, then the axis of the case that states no field: the fractions 0.5 and 1 have no rays.
  assert.deepEqual(
    result.manifest.runs.map((each) => [each.raySets?.sets, each.raySets?.problems.map((text) => text.split(":")[0])]),
    [
      [probe.sets.map(raySetId), []],
      [
        probeRaySets(SINGLET, { sampling: { bundleGrid: 4 } }).sets.map(raySetId),
        ["field-fraction-unresolved", "field-fraction-unresolved"],
      ],
    ],
  );
  assert.deepEqual(rows(result), [
    ...new Array(4).fill("two-lines r2 tracer ok computed"),
    "default-fields r2 tracer ok computed",
  ]);
  assert.deepEqual(
    result.manifest.jobs.slice(0, 4).map((job) => job.requestId),
    rayTraceRequests(ALL_FEATURES_CASE, { raySets: probe.sets }).map((request) => request.id),
  );
  // The same run again generates the same rays: every request has the id it had, and its answer is in the store.
  const manifest = readFileSync(join(runsDir, "probe", MANIFEST_FILE), "utf8");
  const second = await run();
  assert.ok(second.outcomes.every((outcome) => outcome.source === "cached"));
  assert.equal(readFileSync(join(runsDir, "probe", MANIFEST_FILE), "utf8"), manifest);
});
