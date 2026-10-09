// `rays.trace` as the reference engine answers it through the protocol: the contract's worked example to the last
// bit, the shape of an answer for every way a ray ends, and the engine's own account of what it traced. The
// optics of the tracer are held to closed forms in trace.test.ts; here the answer is held to the contract.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { adapterRevision, importClosure } from "../../../src/engines/adapterRevision.ts";
import { REF_ENGINE_MODULE, createRefEngine } from "../../../src/engines/ref/engine.ts";
import { answerRays } from "../../../src/engines/ref/rays.ts";
import { buildRefSystem } from "../../../src/engines/ref/model.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { probeRaySets } from "../../../src/rays/probe.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { ALL_FEATURES_CASE, RAYS_DATA_SINGLET, RAYS_SPEC_SINGLET, SINGLET_CASE } from "../../contract/corpus.ts";
import { DOUBLE_GAUSS } from "../../core/support.ts";
import { caseOf, sphere } from "./support.ts";

function refEngine(t: TestContext): RemoteEngineAdapter {
  const adapter = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => adapter.close());
  return adapter;
}

function ask(engine: RemoteEngineAdapter, opticalCase: OpticalCase, spec: RaysTraceSpec): Promise<ResultEnvelope> {
  return engine.run(makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }), opticalCase);
}

/** The data of an "ok" answer, checked as the orchestrator checks it before it stores it. */
function dataOf(result: ResultEnvelope): RaysTraceData {
  assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
  assert.deepEqual(resultDataProblems(raysTraceQuantity, result.data), []);
  return result.data as RaysTraceData;
}

function values(wire: NdArrayWire): number[] {
  return [...decodeNdArray(wire).values];
}

/** A spec of the given rays, each `[x, y, z, dx, dy, dz]`, at the first line. */
function specOf(rays: readonly (readonly number[])[], line = 0): RaysTraceSpec {
  return {
    line,
    origins: encodeNdArray(Float64Array.from(rays.flatMap((ray) => ray.slice(0, 3))), [rays.length, 3]),
    directions: encodeNdArray(Float64Array.from(rays.flatMap((ray) => ray.slice(3))), [rays.length, 3]),
    weights: encodeNdArray(new Float64Array(rays.length).fill(1)),
  };
}

test("ref answers the contract's worked example of rays.trace to the last bit", async (t) => {
  const result = await ask(refEngine(t), SINGLET_CASE, RAYS_SPEC_SINGLET);
  const data = dataOf(result);
  // A ray along the axis, which nothing bends, and a ray 12 mm off it, stopped at the first surface: every number
  // of the answer is exact, so the engine's is the fixture's, array by array and byte by byte.
  assert.deepEqual(data, RAYS_DATA_SINGLET);
  assert.deepEqual(result.method, { name: "exact-sequential-trace", params: {} });
  assert.deepEqual(result.diagnostics, {
    warnings: [],
    counts: { surfaces: 2, lines: 1, rays: 2, ok: 1, blocked: 1, failed: 0 },
  });
});

test("an answer has a number wherever a ray went and NaN from where it ended, for every way a ray ends", async (t) => {
  // A lens, a stop it clips by, a glass block whose rear face reflects a steep ray totally, and an image plane
  // that lies in front of where a ray at the rim leaves.
  const lens = caseOf(
    [
      { z: 0, shape: sphere(30), index: 1.5 },
      { z: 4, shape: sphere(Infinity), index: 1, semiDiameter: 3, clipRadius: 3 },
      { z: 6, shape: sphere(8), index: 1.7, semiDiameter: 7.9 },
      { z: 16, shape: sphere(Infinity), index: 1 },
      { z: 17, shape: sphere(-9), index: 1, semiDiameter: 8.9 },
    ],
    { stopIndex: 1, stopSemiDiameter: 3, imageZ: 17 },
  );
  const rays = [
    [0, 0, -5, 0, 0, 1], // along the axis: ok, and lands on the last vertex, which is on the image plane
    [0, 2, -5, 0, 0, 1], // through the stop: ok
    [0, 5, -5, 0, 0, 1], // stopped by the stop
    [0, 12, -5, 0, 0, 1], // stopped at the first surface
    [0, -7.5, -5, 0, Math.sin(0.19), Math.cos(0.19)], // through the stop, then lost further on
  ];
  const data = dataOf(await ask(refEngine(t), lens, specOf(rays)));
  const status = values(data.status);
  const end = values(data.endSurface);
  assert.deepEqual(status.slice(0, 4), [0, 0, 1, 1]);
  assert.deepEqual(end.slice(0, 4), [-1, -1, 1, 0]);
  assert.deepEqual(data.hits.$nd.shape, [5, 5, 3]);
  const hits = values(data.hits);
  const hit = (surface: number, ray: number): number[] =>
    hits.slice((surface * 5 + ray) * 3, (surface * 5 + ray) * 3 + 3);
  // The axial ray: every vertex, in order.
  assert.deepEqual(
    [0, 1, 2, 3, 4].map((surface) => hit(surface, 0)),
    [0, 4, 6, 16, 17].map((z) => [0, 0, z]),
  );
  assert.deepEqual(values(data.imagePoint).slice(0, 3), [0, 0, 17]);
  assert.deepEqual(values(data.exitPoint).slice(0, 3), [0, 0, 17]);
  assert.deepEqual(values(data.exitDirection).slice(0, 3), [0, 0, 1]);
  assert.equal(values(data.opticalPath)[0], 5 + 1.5 * 4 + 2 + 1.7 * 10 + 1);
  assert.equal(values(data.opticalPathToImage)[0], values(data.opticalPath)[0]);
  // The ray the stop clipped has its hit on the first surface, and nothing from the stop on.
  assert.ok(hit(0, 2).every(Number.isFinite));
  for (const surface of [1, 2, 3, 4]) assert.ok(hit(surface, 2).every(Number.isNaN), `surface ${surface}`);
  for (const member of ["exitPoint", "exitDirection", "imagePoint"] as const) {
    assert.ok(values(data[member]).slice(6, 9).every(Number.isNaN), member);
  }
  assert.ok(Number.isNaN(values(data.opticalPath)[2]) && Number.isNaN(values(data.opticalPathToImage)[2]));
  // The ray stopped at the first surface has no hit at all.
  for (const surface of [0, 1, 2, 3, 4]) assert.ok(hit(surface, 3).every(Number.isNaN));
  // The last ray is not ok, and whatever stopped it, the quantity's own rules hold for it (checked by dataOf).
  assert.notEqual(status[4], 0);
});

test("the end surface S: a ray whose exit lies behind the image plane keeps its exit and has no landing", () => {
  // The last surface curves toward the image at its rim: a hit there lies behind an image plane that touches the
  // vertex, by the sag, and a ray cannot go back to it.
  const lens = caseOf(
    [
      { z: 0, shape: sphere(Infinity), index: 1.5 },
      { z: 3, shape: sphere(25), index: 1 },
    ],
    { imageZ: 3 },
  );
  const answer = answerRays(
    buildRefSystem(lens),
    specOf([
      [0, 0, -2, 0, 0, 1],
      [0, 6, -2, 0, 0, 1],
    ]),
  );
  assert.ok("data" in answer);
  const { data, counts } = answer;
  assert.deepEqual(raysTraceQuantity.validateData(data), []);
  assert.deepEqual(counts, { rays: 2, ok: 1, blocked: 1, failed: 0 });
  assert.deepEqual(values(data.status), [0, 1]);
  // Two surfaces: the end surface of the ray that passed both and has no landing is 2.
  assert.deepEqual(values(data.endSurface), [-1, 2]);
  const exit = values(data.exitPoint).slice(3);
  assert.ok(exit.every(Number.isFinite) && exit[2] > 3, `the exit lies behind the plane: z = ${exit[2]}`);
  assert.ok(values(data.exitDirection).slice(3).every(Number.isFinite));
  assert.ok(Number.isFinite(values(data.opticalPath)[1]));
  assert.ok(values(data.imagePoint).slice(3).every(Number.isNaN));
  assert.ok(Number.isNaN(values(data.opticalPathToImage)[1]));
});

test("the path to the image plane runs in the medium behind the last surface, whatever its index is", () => {
  // An image plane inside the glass: one flat face at z = 0 into an index of 1.5, and the plane 10 mm behind it.
  // The ray along the axis has 5 mm of air and 10 mm of glass; the one at 30 degrees is bent to asin(0.5 / 1.5) and
  // has 5 / cos 30 of air and 10 / cos t of glass.
  const immersed = caseOf([{ z: 0, shape: sphere(Infinity), index: 1.5 }], { imageZ: 10 });
  const tilt = Math.PI / 6;
  const answer = answerRays(
    buildRefSystem(immersed),
    specOf([
      [0, 0, -5, 0, 0, 1],
      [0, 0, -5, 0, Math.sin(tilt), Math.cos(tilt)],
    ]),
  );
  assert.ok("data" in answer);
  assert.deepEqual(values(answer.data.status), [0, 0]);
  assert.deepEqual(values(answer.data.opticalPath).slice(0, 1), [5]);
  assert.deepEqual(values(answer.data.opticalPathToImage).slice(0, 1), [5 + 1.5 * 10]);
  const inGlass = Math.asin(Math.sin(tilt) / 1.5);
  const expected = 5 / Math.cos(tilt) + (1.5 * 10) / Math.cos(inGlass);
  assert.ok(Math.abs(values(answer.data.opticalPathToImage)[1] - expected) <= 4 * 2 ** -52 * expected);
  assert.ok(Math.abs(values(answer.data.imagePoint)[4] - (5 * Math.tan(tilt) + 10 * Math.tan(inGlass))) <= 1e-14);
});

test("the indices are those of the spec's line, and a line the case does not have is the error bad-spec", async (t) => {
  const twoLines = caseOf(
    [
      { z: 0, shape: sphere(50), index: [1.5, 1.6] },
      { z: 5, shape: sphere(Infinity), index: [1, 1] },
    ],
    { lines: 2 },
  );
  const engine = refEngine(t);
  const ray = [[0, 4, -3, 0, 0, 1]];
  const [first, second] = [
    dataOf(await ask(engine, twoLines, specOf(ray, 0))),
    dataOf(await ask(engine, twoLines, specOf(ray, 1))),
  ];
  // The same ray is bent more by the denser glass, and its path through it is longer.
  const [slow, fast] = [values(first.exitDirection)[1], values(second.exitDirection)[1]];
  assert.ok(fast < slow && slow < 0, `${fast} and ${slow}`);
  assert.ok(values(second.opticalPath)[0] > values(first.opticalPath)[0]);
  // sin of the angle behind the plane is n sin(i - t), with sin i = 4 / 50.
  for (const [data, n] of [
    [first, 1.5],
    [second, 1.6],
  ] as const) {
    const expected = -n * Math.sin(Math.asin(0.08) - Math.asin(0.08 / n));
    assert.ok(Math.abs(values(data.exitDirection)[1] - expected) <= 2 ** -51, `n = ${n}`);
  }

  const refused = await ask(engine, twoLines, specOf(ray, 2));
  assert.equal(refused.status, "error");
  assert.deepEqual(refused.error, { code: "bad-spec", message: "spec.line is 2, and the case has 2 lines" });
  // A spec that is not the quantity's is refused before anything is traced.
  const { weights: _weights, ...broken } = specOf(ray);
  const malformed = await ask(engine, twoLines, broken as RaysTraceSpec);
  assert.equal(malformed.error?.code, "bad-spec");
});

test("equal requests give byte-equal answers, about every kind of case, with the rays counted", async (t) => {
  const engine = refEngine(t);
  for (const opticalCase of [SINGLET_CASE, DOUBLE_GAUSS, ALL_FEATURES_CASE]) {
    const fields = { kind: "angles-deg", values: [0, 6] } as const;
    const { sets, problems } = probeRaySets(opticalCase, { fields, sampling: { bundleGrid: 8 } });
    assert.deepEqual(problems, []);
    for (const spec of sets) {
      const [first, second] = [await ask(engine, opticalCase, spec), await ask(engine, opticalCase, spec)];
      assert.equal(canonicalJson(first), canonicalJson(second));
      const data = dataOf(first);
      const status = values(data.status);
      const counts = first.diagnostics.counts;
      assert.equal(counts.rays, status.length);
      assert.equal(counts.ok, status.filter((each) => each === 0).length);
      assert.equal(counts.blocked, status.filter((each) => each === 1).length);
      assert.equal(counts.failed, 0, opticalCase.label.name);
      // A probe lattice reaches past the rim: some of its rays pass and some are stopped.
      assert.ok(counts.ok > 0 && counts.blocked > 0, `${opticalCase.label.name}: ${JSON.stringify(counts)}`);
      // Another instance gives the same bytes: the engine keeps no state.
      assert.equal(canonicalJson(await ask(refEngine(t), opticalCase, spec)), canonicalJson(first));
    }
  }
});

test("the every-feature case is traced through its annular aperture: rays near the axis are stopped there", async (t) => {
  const annular = ALL_FEATURES_CASE.system.surfaces.findIndex((surface) => surface.aperture.innerSemiDiameter > 0);
  assert.equal(annular, 3);
  const data = dataOf(
    await ask(
      refEngine(t),
      ALL_FEATURES_CASE,
      specOf([
        [0, 0, -5, 0, 0, 1],
        [0, 4.5, -5, 0, 0, 1],
      ]),
    ),
  );
  // Along the axis: through the first three surfaces, and stopped by the obstruction of the fourth.
  assert.deepEqual(values(data.status), [1, 0]);
  assert.deepEqual(values(data.endSurface), [annular, -1]);
});

test("the tracer and the recorder are in the engine's adapter revision, and the tracer in its fingerprint", () => {
  const closure = importClosure(REF_ENGINE_MODULE);
  for (const file of [
    "engines/ref/trace.ts",
    "engines/ref/intersect.ts",
    "engines/ref/refract.ts",
    "core/numeric/exact.ts",
    "engines/ref/rays.ts",
    "rays/traceRecorder.ts",
    "estimators/imageProjection.ts",
  ]) {
    assert.ok(closure.includes(file), file);
  }
  assert.match(adapterRevision(REF_ENGINE_MODULE).revision, /^[0-9a-f]{64}$/);
});
