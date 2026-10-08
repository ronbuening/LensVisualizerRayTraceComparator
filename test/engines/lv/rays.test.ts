// `rays.trace` of the engine `lv`, and the ray sets of a LensVisualizer case, against the fake LV tree: no
// LensVisualizer is needed. The fake has a small tracer and an MTF launch of its own, far cruder than LV's and with
// LV's names, so what the engine and the generator make of them is checked here; its numbers describe no real lens.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { rayTraceRequests } from "../../../src/core/rungs.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvFieldAngles, lvFieldRays, lvLaunchSetup, lvRaySets } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays, lvTraceOptions } from "../../../src/engines/lv/rays.ts";
import { lvHookAperture, lvPupilSeed } from "../../../src/engines/lv/tabRequest.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { startsInFront } from "../../../src/rays/probe.ts";
import { raySetId } from "../../../src/rays/raySets.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { FAKE_LENS_FILES, bind, freshLv, variantOf } from "./support.ts";

const [SINGLET_FILE] = FAKE_LENS_FILES.map(([file]) => file);

function f8(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return decoded.values as Float64Array;
}

function integers(wire: NdArrayWire): number[] {
  return [...decodeNdArray(wire).values];
}

/** The case of a lens of a bound tree under a run's options, and its model as the engine holds it. */
async function modelOf(
  binding: LvBinding,
  key: string,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok);
  return { opticalCase: exported.opticalCase, model: rebuilt.model };
}

/** Rays parallel to the axis in the meridional plane, from 10 mm in front of the first vertex, at these heights. */
function parallelRays(heights: readonly number[], line = 0): RaysTraceSpec {
  return {
    line,
    origins: encodeNdArray(Float64Array.from(heights.flatMap((y) => [0, y, -10])), [heights.length, 3]),
    directions: encodeNdArray(Float64Array.from(heights.flatMap(() => [0, 0, 1])), [heights.length, 3]),
    weights: encodeNdArray(new Float64Array(heights.length).fill(1)),
  };
}

/** The engine `lv` on a bound tree, behind an adapter, as a run reaches it; closed when the test ends. */
function engineOn(t: TestContext, binding: LvBinding): RemoteEngineAdapter {
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
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

/** Row `ray` of an `[n, 3]` array. */
function row(values: Float64Array, ray: number): number[] {
  return [...values.subarray(3 * ray, 3 * ray + 3)];
}

// ── The trace ────────────────────────────────────────────────────────────────────────────────────────────────────

test("lv traces every ray of a request: where it ends, what it hit, where it lands and how long its path is", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { opticalCase } = await modelOf(binding, "acme-singlet-50");
  // On the axis; through the lens; stopped by the iris, the third surface; outside the first surface's rim; and
  // so far out that it meets no surface at all.
  const spec = parallelRays([0, 3, 7, 9, 60]);
  const result = await ask(engineOn(t, binding), opticalCase, spec);
  const data = dataOf(result);
  assert.deepEqual(result.method, { name: "sequential-trace", params: {} });
  assert.deepEqual(result.diagnostics.counts, { surfaces: 3, lines: 1, rays: 5, ok: 2, blocked: 3, failed: 0 });

  assert.deepEqual(integers(data.status), [0, 0, 1, 1, 1]);
  assert.deepEqual(integers(data.endSurface), [-1, -1, 2, 0, 0]);
  assert.deepEqual(data.hits.$nd.shape, [3, 5, 3]);
  const [hits, exitPoint, exitDirection] = [f8(data.hits), f8(data.exitPoint), f8(data.exitDirection)];
  const [imagePoint, path, toImage] = [f8(data.imagePoint), f8(data.opticalPath), f8(data.opticalPathToImage)];
  const hit = (surface: number, ray: number): number[] => row(hits, surface * 5 + ray);

  // The axial ray meets the three vertices, 10 mm of air, 4 mm of glass of index 1.5 and 1 mm of air from its
  // origin, and lands on the axis 47.5 mm further on.
  assert.deepEqual(
    [hit(0, 0), hit(1, 0), hit(2, 0)],
    [
      [0, 0, 0],
      [0, 0, 4],
      [0, 0, 5],
    ],
  );
  assert.deepEqual(row(exitPoint, 0), [0, 0, 5]);
  assert.deepEqual(row(exitDirection, 0), [0, 0, 1]);
  assert.deepEqual(row(imagePoint, 0), [0, 0, 52.5]);
  assert.equal(path[0], 10 + 1.5 * 4 + 1);
  assert.equal(toImage[0], 17 + 47.5);

  // The ray at 3 mm is bent toward the axis: it leaves the last surface lower than it entered, heading down, and
  // lands near the axis. Its exit point is its hit on the last surface, and the image space is air.
  assert.deepEqual(row(exitPoint, 1), hit(2, 1));
  assert.ok(hit(0, 1)[1] === 3 && hit(1, 1)[1] < 3 && hit(2, 1)[1] < hit(1, 1)[1]);
  assert.ok(row(exitDirection, 1)[1] < 0 && Math.abs(Math.hypot(...row(exitDirection, 1)) - 1) < 1e-15);
  assert.ok(Math.abs(row(imagePoint, 1)[1]) < 0.1);
  assert.equal(row(imagePoint, 1)[2], opticalCase.conditions.imageZ);
  const leg = Math.hypot(...row(imagePoint, 1).map((value, axis) => value - row(exitPoint, 1)[axis]));
  assert.ok(Math.abs(toImage[1] - path[1] - leg) < 1e-13);
  // Fermat: to a focus, the path of a ray through the lens is that of the axial ray, nearly.
  assert.ok(Math.abs(toImage[1] - toImage[0]) < 0.01);

  // A ray that was stopped has a hit on every surface before the one that stopped it, and nothing from there on:
  // not the hit on that surface, which the tracer does compute, nor an exit, a landing or a path.
  assert.ok(hit(0, 2).every(Number.isFinite) && hit(1, 2).every(Number.isFinite));
  assert.ok(hit(2, 2).every(Number.isNaN));
  for (const ray of [2, 3, 4]) {
    for (const values of [exitPoint, exitDirection, imagePoint]) assert.ok(row(values, ray).every(Number.isNaN));
    assert.ok(Number.isNaN(path[ray]) && Number.isNaN(toImage[ray]), `ray ${ray}`);
  }
  for (const ray of [3, 4]) {
    for (let surface = 0; surface < 3; surface++) assert.ok(hit(surface, ray).every(Number.isNaN), `ray ${ray}`);
  }
});

test("what LensVisualizer's tracer gives is what lv reports, and its own classification decides blocked and failed", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { opticalCase, model } = await modelOf(binding, "acme-singlet-50");
  const heights = [0, 1.5, 3, 4.5, 6, 6.5, 7, 7.9, 9, 60];
  const spec = parallelRays(heights);
  const answer = answerLvRays(binding.api, model, spec);
  assert.ok("data" in answer);
  const { data } = answer;
  const [status, endSurface] = [integers(data.status), integers(data.endSurface)];
  const options = lvTraceOptions(model, 0);
  assert.deepEqual(
    { ...options, indexAtSurface: undefined },
    {
      checkSemiDiameter: true,
      stopSemiDiameter: opticalCase.conditions.stopSemiDiameter,
      stopOnClip: true,
      directionNormalized: true,
      wavelengthNm: 587.5618,
      recordOpticalPath: true,
      indexAtSurface: undefined,
    },
  );
  assert.deepEqual(
    [0, 1, 2].map((surface) => options.indexAtSurface?.(surface, 9)),
    [1.5, 1, 1],
  );

  heights.forEach((y, ray) => {
    const trace = binding.api.traceEngineRay2(model.state, { origin: [0, y, -10], direction: [0, 0, 1] }, options);
    const outcome = binding.api.mtfTraceClassification(trace, model.state, opticalCase.conditions.stopSemiDiameter);
    assert.equal(status[ray], { valid: 0, blocked: 1, failed: 2 }[outcome], `the ray at ${y} mm`);
    const spot = binding.api.mtfImagePoint(model.state, trace, opticalCase.conditions.imageZ);
    assert.equal(spot !== null, status[ray] === 0);
    if (spot === null) {
      // The surface it did not pass: the one whose hit is marked, or the one it has no hit on.
      const stopped = trace.hits.findIndex((each) => each.clipped);
      assert.equal(endSurface[ray], stopped < 0 ? trace.hits.length : stopped, `the ray at ${y} mm`);
      return;
    }
    // The landing is the comparator's projection, and it is where LensVisualizer's own lands the trace, bit for bit.
    assert.deepEqual(row(f8(data.imagePoint), ray), [spot.x, spot.y, opticalCase.conditions.imageZ]);
    assert.deepEqual(row(f8(data.exitPoint), ray), [...trace.terminalPoint]);
    assert.deepEqual(row(f8(data.exitDirection), ray), [...trace.terminalDirection]);
    assert.equal(f8(data.opticalPath)[ray], trace.opticalPathLengthMm);
    trace.hits.forEach((each, surface) => {
      assert.deepEqual(row(f8(data.hits), surface * heights.length + ray), [...each.point]);
    });
  });
  assert.deepEqual(status, [0, 0, 0, 0, 0, 0, 1, 1, 1, 1]);
  assert.deepEqual(endSurface, [-1, -1, -1, -1, -1, -1, 2, 2, 0, 0]);
  assert.deepEqual(answer.counts, { rays: 10, ok: 6, blocked: 4, failed: 0 });
});

test("a total internal reflection is blocked at the surface that reflects; an unresolved intersection is failed", async (t) => {
  const lv = freshLv(t);
  // The singlet with a rear surface so steep that a ray 6 mm off the axis meets it beyond the critical angle.
  const steep = variantOf(lv, "steep", { [SINGLET_FILE]: (text) => text.replace("R: -50, d: 1", "R: -7, d: 1") });
  const steepBinding = await bind(t, steep);
  const reflected = await modelOf(steepBinding, "acme-singlet-50");
  const spec = parallelRays([1, 6]);
  const trace = steepBinding.api.traceEngineRay2(
    reflected.model.state,
    { origin: [0, 6, -10], direction: [0, 0, 1] },
    lvTraceOptions(reflected.model, 0),
  );
  // LensVisualizer calls the trace failed, with the reflection as the reason; it is the light that is blocked.
  assert.deepEqual([trace.status, trace.failureReason, trace.hits.length], ["failed", "totalInternalReflection", 2]);
  const data = dataOf(await ask(engineOn(t, steepBinding), reflected.opticalCase, spec));
  assert.deepEqual(integers(data.status), [0, 1]);
  assert.deepEqual(integers(data.endSurface), [-1, 1]);
  const hits = f8(data.hits);
  assert.ok(row(hits, 1).every(Number.isFinite), "the hit on the first surface");
  assert.ok(row(hits, 2 + 1).every(Number.isNaN), "no hit on the surface that reflects");
  assert.ok(row(hits, 4 + 1).every(Number.isNaN));
  steepBinding.close();

  // The singlet with a zone of its rear surface in which the fake's tracer does not converge.
  const zone = variantOf(lv, "zone", {
    [SINGLET_FILE]: (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  unresolvedZone: { surface: 1, inner: 2.5, outer: 3.5 },"),
  });
  const zoneBinding = await bind(t, zone);
  const unresolved = await modelOf(zoneBinding, "acme-singlet-50");
  const result = await ask(engineOn(t, zoneBinding), unresolved.opticalCase, parallelRays([1, 3, 9]));
  const failed = dataOf(result);
  // Inside the clear aperture LensVisualizer can prove no miss: the ray is failed, at the surface it was lost on.
  assert.deepEqual(integers(failed.status), [0, 2, 1]);
  assert.deepEqual(integers(failed.endSurface), [-1, 1, 0]);
  assert.deepEqual(result.diagnostics.counts, { surfaces: 3, lines: 1, rays: 3, ok: 1, blocked: 1, failed: 1 });
  assert.ok(row(f8(failed.hits), 1).every(Number.isFinite));
  assert.ok(row(f8(failed.hits), 3 + 1).every(Number.isNaN));
  assert.ok(Number.isNaN(f8(failed.opticalPath)[1]));
});

test("a ray that passes every surface and cannot reach the image plane is blocked behind the last surface", async (t) => {
  const binding = await bind(t, freshLv(t));
  // An image plane 60 mm in front of the design plane lies in front of the lens: no ray can land on it.
  const { opticalCase, model } = await modelOf(binding, "acme-singlet-50", { imagePlane: { kind: "shift", mm: -60 } });
  assert.equal(opticalCase.conditions.imageZ, -7.5);
  const data = dataOf(await ask(engineOn(t, binding), opticalCase, parallelRays([0, 3, 7, 9])));
  assert.deepEqual(integers(data.status), [1, 1, 1, 1]);
  // The end surface of the two that passed is 3, one past the last surface; the others ended where they did.
  assert.deepEqual(integers(data.endSurface), [3, 3, 2, 0]);
  // They keep their hits, their exit and their path to the last surface, and have no landing.
  for (const ray of [0, 1]) {
    for (let surface = 0; surface < 3; surface++)
      assert.ok(row(f8(data.hits), surface * 4 + ray).every(Number.isFinite));
    assert.ok(row(f8(data.exitPoint), ray).every(Number.isFinite));
    assert.ok(row(f8(data.exitDirection), ray).every(Number.isFinite));
    assert.ok(Number.isFinite(f8(data.opticalPath)[ray]));
    assert.ok(row(f8(data.imagePoint), ray).every(Number.isNaN));
    assert.ok(Number.isNaN(f8(data.opticalPathToImage)[ray]));
  }
  assert.equal(f8(data.opticalPath)[0], 17);
  assert.ok(Number.isNaN(f8(data.opticalPath)[2]));
  // LensVisualizer's own tracer calls those two rays "ok": it does not look for the image plane.
  const answer = answerLvRays(binding.api, model, parallelRays([0]));
  assert.ok("counts" in answer && answer.counts.blocked === 1);
});

test("the iris stops a ray at the stop radius of the case, not at the radius the state keeps for it", async (t) => {
  const binding = await bind(t, freshLv(t));
  const lv = engineOn(t, binding);
  // The iris is the third surface. Wide open its radius is 6.25 mm; stopped down, the state still says 6.25 mm,
  // and only the case says 2 mm.
  const open = await modelOf(binding, "acme-singlet-50");
  const stopped = await modelOf(binding, "acme-singlet-50", { aperture: { kind: "stop-radius", mm: 2 } });
  assert.equal(stopped.opticalCase.conditions.stopSemiDiameter, 2);
  assert.equal(stopped.model.state.surfaces[2].sd, 6.25);
  const spec = parallelRays([1, 3]);
  const wide = dataOf(await ask(lv, open.opticalCase, spec));
  assert.deepEqual(
    [integers(wide.status), integers(wide.endSurface)],
    [
      [0, 0],
      [-1, -1],
    ],
  );
  // The ray 3 mm off the axis reaches the iris nearly 3 mm off the axis: the smaller iris stops it there.
  const narrow = dataOf(await ask(lv, stopped.opticalCase, spec));
  assert.deepEqual(
    [integers(narrow.status), integers(narrow.endSurface)],
    [
      [0, 1],
      [-1, 2],
    ],
  );
  const [wideHits, narrowHits] = [f8(wide.hits), f8(narrow.hits)];
  assert.ok(row(wideHits, 4 + 1)[1] > 2 && row(wideHits, 4 + 1)[1] < 3);
  // Up to the iris the two cases trace the same ray; from the iris on the stopped one has nothing.
  for (const surface of [0, 1]) {
    assert.deepEqual(row(narrowHits, surface * 2 + 1), row(wideHits, surface * 2 + 1));
  }
  assert.ok(row(narrowHits, 4 + 1).every(Number.isNaN));
  assert.ok(Number.isNaN(f8(narrow.opticalPath)[1]));
});

test("the path to the image continues in the index behind the last surface, which need not be air", async (t) => {
  // The singlet with its image space filled: behind the last surface, the iris, lies a medium of index 1.25.
  const immersed = variantOf(freshLv(t), "immersed", {
    [SINGLET_FILE]: (text) => text.replace("d: 47.5, nd: 1, sd: 6.25", "d: 47.5, nd: 1.25, sd: 6.25"),
  });
  const binding = await bind(t, immersed);
  const { opticalCase } = await modelOf(binding, "acme-singlet-50");
  assert.deepEqual([...f8(opticalCase.conditions.indexAfterSurface)], [1.5, 1, 1.25]);
  const data = dataOf(await ask(engineOn(t, binding), opticalCase, parallelRays([0, 3])));
  assert.deepEqual(integers(data.status), [0, 0]);
  const [path, toImage] = [f8(data.opticalPath), f8(data.opticalPathToImage)];
  // On the axis: 17 mm of optical path to the last surface, then 47.5 mm at 1.25.
  assert.equal(path[0], 17);
  assert.equal(toImage[0], 17 + 1.25 * 47.5);
  // Off the axis the last stretch is longer than the gap, and counts 1.25 times its own length.
  const [exit, image] = [row(f8(data.exitPoint), 1), row(f8(data.imagePoint), 1)];
  const leg = Math.hypot(...image.map((value, axis) => value - exit[axis]));
  assert.ok(leg > 47.5 && leg < 48);
  assert.ok(Math.abs(toImage[1] - path[1] - 1.25 * leg) < 1e-13);
});

test("the rays are traced with the indices of the spec's line, and a line the case does not have is a bad spec", async (t) => {
  const binding = await bind(t, freshLv(t));
  const lv = engineOn(t, binding);
  const options: RunOptions = { state: { zoomT: 1 }, lines: { kind: "photopic" } };
  const { opticalCase, model } = await modelOf(binding, "acme-zoom-24-48", options);
  assert.equal(opticalCase.conditions.lines.length, 5);
  const landings: number[] = [];
  const paths: number[] = [];
  for (let line = 0; line < 5; line++) {
    const data = dataOf(await ask(lv, opticalCase, parallelRays([2], line)));
    assert.deepEqual(integers(data.status), [0]);
    landings.push(f8(data.imagePoint)[1]);
    paths.push(f8(data.opticalPath)[0]);
    assert.equal(lvTraceOptions(model, line).wavelengthNm, opticalCase.conditions.lines[line].wavelengthNm);
  }
  // Five lines, five glasses' worth of indices: the ray lands at five heights, with five optical paths.
  assert.equal(new Set(landings).size, 5, JSON.stringify(landings));
  assert.equal(new Set(paths).size, 5);
  // The index after the first surface at each line is the one the case states, which is LensVisualizer's own.
  const table = f8(opticalCase.conditions.indexAfterSurface);
  const surfaces = opticalCase.system.surfaces.length;
  for (let line = 0; line < 5; line++) {
    assert.equal(lvTraceOptions(model, line).indexAtSurface?.(0, 0), table[line * surfaces]);
  }

  const beyond = await ask(lv, opticalCase, parallelRays([2], 5));
  assert.equal(beyond.status, "error");
  assert.deepEqual(beyond.error, { code: "bad-spec", message: "spec.line is 5, and the case has 5 lines" });
  // A spec that is not a set of rays is refused before anything is traced.
  const skewed = { ...parallelRays([2]), directions: encodeNdArray(Float64Array.of(0, 0, 2), [1, 3]) };
  const refused = await ask(lv, opticalCase, skewed);
  assert.equal(refused.error?.code, "bad-spec");
  assert.match(refused.error?.message ?? "", /the direction of ray 0 is not a unit vector/);
});

test("lv answers the same request with the same bytes, in two bindings of the same tree", async (t) => {
  const spec = parallelRays([0.5, 2.5, 6.5, 8.5]);
  const answers: ResultEnvelope[] = [];
  for (const name of ["first", "second"]) {
    const binding = await bind(t, variantOf(freshLv(t), name, {}));
    const { opticalCase } = await modelOf(binding, "acme-singlet-50");
    const lv = engineOn(t, binding);
    answers.push(await ask(lv, opticalCase, spec), await ask(lv, opticalCase, spec));
    binding.close();
  }
  for (const answer of answers) assert.deepEqual(answer, answers[0]);
  assert.equal(new Set(answers.map((answer) => answer.requestId)).size, 1);
});

// ── The ray sets ─────────────────────────────────────────────────────────────────────────────────────────────────

test("the ray sets of a case are LensVisualizer's launch lattice, every cell of it, and the chief ray after them", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, "acme-singlet-50");
  const { sets, problems } = lvRaySets(api, model, { sampling: { bundleGrid: 4 } });
  assert.deepEqual(problems, []);
  // The fake's field axis reaches 20 degrees at 10 mm: the fractions 0, 0.5 and 1 are the angles 0, 10 and 20.
  assert.deepEqual(
    sets.map((spec) => spec.groups?.field),
    [0, 0.5, 1].map((heightFraction) => ({ angleDeg: 20 * heightFraction, heightFraction })),
  );
  const setup = lvLaunchSetup(api, model);
  assert.ok(!("problem" in setup));
  // The stop radius is the case's, and the seed of the footprint is the pupil radius the hook of LensVisualizer's
  // MTF tab hands over for it: here the entrance pupil of the iris wide open, which the fake puts at the stop.
  const stop = opticalCase.conditions.stopSemiDiameter;
  assert.equal(lvPupilSeed(lvHookAperture(api, model.runtime, model.state), stop), stop);
  assert.deepEqual(setup.options, {
    method: "geometric",
    spectrum: "reference",
    pupilSemiDiameterMm: stop,
    stopSemiDiameterMm: stop,
    focus: "design",
  });
  assert.deepEqual(setup.support.spectralLines, [{ wavelengthNm: 587.5618, weight: 1 }]);

  for (const spec of sets) {
    assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
    assert.equal(spec.line, 0);
    const angleDeg = spec.groups?.field?.angleDeg as number;
    const launch = api.prepareMtfFieldLaunch(model.state, setup.options, setup.support, angleDeg);
    assert.ok(launch !== null);
    const footprint = api.findMtfFieldFootprint(model.state, setup.options, setup.support, launch);
    assert.ok(footprint !== null);
    const grid = api.mtfLaunchGrid(footprint, 4);
    // Four cells across a beam of 12.5 mm, over a box of 15.625 mm: six columns, which is even, and five rows.
    assert.deepEqual([grid.columns, grid.rows, grid.step], [6, 5, 3.125]);
    assert.deepEqual(spec.groups?.lattice, { columns: 6, rows: 5, step: 3.125 });
    assert.equal(spec.groups?.chiefIndex, 30);
    const [origins, directions, weights] = [f8(spec.origins), f8(spec.directions), f8(spec.weights)];
    assert.equal(weights.length, 31);
    for (let cell = 0; cell < 30; cell++) {
      const [cellRow, column] = [Math.floor(cell / 6), cell % 6];
      const ray = api.mtfLaunchRay(launch, grid.x0 + (column + 0.5) * grid.step, grid.y0 + (cellRow + 0.5) * grid.step);
      assert.deepEqual(row(origins, cell), [...ray.origin], `cell ${cell}`);
      assert.deepEqual(row(directions, cell), [...ray.direction], `cell ${cell}`);
      assert.equal(weights[cell], 1);
      // No cell is on the meridional plane, and none is the chief ray.
      assert.notEqual(origins[3 * cell], 0);
    }
    // The left half is there as rays of its own, not as the mirror image of the right half.
    assert.ok(origins[0] < 0 && origins[3 * 5] > 0);
    const chief = api.mtfLaunchRay(launch, 0, 0);
    assert.deepEqual(row(origins, 30), [...chief.origin]);
    assert.deepEqual(row(directions, 30), [...chief.direction]);
    assert.equal(weights[30], 0, "the chief ray is a reference, not a sample");
    // The rays come from in front of the lens and head toward -y for a field toward +y.
    assert.ok(origins[2] < 0 && directions[2] > 0);
    // LensVisualizer's own numbers are kept as they are: the axial bundle's y component is its -0.
    assert.ok(angleDeg === 0 ? directions[1] === 0 : directions[1] < 0);

    // As many rays of the lattice are ok as LensVisualizer's own bundle counts as valid at the same grid, and as
    // many blocked: the bundle traces half the columns and counts each twice.
    const answer = answerLvRays(api, model, spec);
    assert.ok("data" in answer);
    assert.deepEqual(raysTraceQuantity.validateData(answer.data), []);
    const bundle = api.traceMtfBundle(model.state, setup.options, setup.support, launch, footprint, 4, {
      wavelengthNm: 587.5618,
      weight: 1,
    });
    assert.ok(bundle !== null && bundle.mirrored);
    const status = integers(answer.data.status);
    const lattice = status.slice(0, 30);
    assert.equal(lattice.filter((each) => each === 0).length, bundle.rays.length);
    assert.equal(lattice.filter((each) => each === 1).length, bundle.blocked);
    assert.equal(lattice.filter((each) => each === 2).length, bundle.failed);
    for (const own of bundle.rays) {
      const cell = own.row * 6 + own.column;
      const landed = row(f8(answer.data.imagePoint), cell);
      assert.ok(Math.abs(landed[0] - own.x) < 1e-12 && Math.abs(landed[1] - own.y) < 1e-12, `cell ${cell}`);
    }
    assert.ok(bundle.rays.length > 0 && bundle.blocked > 0);
  }
});

test("a field without rays is a coded problem of that field, and the other fields have theirs", async (t) => {
  const lv = freshLv(t);
  // A lens whose format corner lies beyond what its model reaches, and one height of which has no solved angle.
  const short = variantOf(lv, "short", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { referenceHeightMm: 12.5 },"),
  });
  const shortBinding = await bind(t, short);
  const outside = await modelOf(shortBinding, "acme-singlet-50");
  const fractions = lvRaySets(shortBinding.api, outside.model, { sampling: { bundleGrid: 4 } });
  assert.deepEqual(
    fractions.sets.map((spec) => spec.groups?.field),
    [
      { angleDeg: 0, heightFraction: 0 },
      { angleDeg: 12.5, heightFraction: 0.5 },
    ],
  );
  assert.deepEqual(fractions.problems, [
    "outside-modeled-field: the image height 12.5 mm (fraction 1) lies beyond the modeled edge of the field at 10 mm",
  ]);
  // The order of the fields is kept around a field that has no rays.
  const mixed = lvRaySets(shortBinding.api, outside.model, {
    fields: { kind: "image-height-fractions", values: [1, 0.4, 0.9, 0.2] },
    sampling: { bundleGrid: 4 },
  });
  assert.deepEqual(
    mixed.sets.map((spec) => spec.groups?.field?.heightFraction),
    [0.4, 0.2],
  );
  assert.deepEqual(
    mixed.problems.map((problem) => problem.split(":")[0]),
    ["outside-modeled-field", "outside-modeled-field"],
  );
  shortBinding.close();

  const unsolved = variantOf(lv, "unsolved", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { unsolvedFraction: 0.5 },"),
  });
  const unsolvedBinding = await bind(t, unsolved);
  const model = (await modelOf(unsolvedBinding, "acme-singlet-50")).model;
  const { sets, problems } = lvRaySets(unsolvedBinding.api, model, { sampling: { bundleGrid: 4 } });
  assert.deepEqual(
    sets.map((spec) => spec.groups?.field?.angleDeg),
    [0, 20],
  );
  assert.deepEqual(problems, [
    "chief-ray-failed: LensVisualizer finds no chief-ray angle for the image height 5 mm (fraction 0.5)",
  ]);
  unsolvedBinding.close();

  // A field given as an angle is taken as given; one LensVisualizer finds no chief ray for, and one whose beam an
  // aperture stops altogether, have none.
  const binding = await bind(t, lv);
  const stopped = await modelOf(binding, "acme-singlet-50", { aperture: { kind: "stop-radius", mm: 2 } });
  const angles = lvRaySets(binding.api, stopped.model, {
    fields: { kind: "angles-deg", values: [0, 59, 75, -10] },
    sampling: { bundleGrid: 4 },
  });
  assert.deepEqual(
    angles.sets.map((spec) => spec.groups?.field),
    [{ angleDeg: 0 }, { angleDeg: -10 }],
  );
  assert.deepEqual(angles.problems, [
    "vignetted: no ray of the field at 59 degrees reaches the image through the clear apertures",
    "chief-ray-failed: LensVisualizer finds no chief ray for the field at 75 degrees",
  ]);
  // A field toward -y sends its rays toward +y.
  assert.ok(f8(angles.sets[1].directions)[1] > 0);

  // A lens with no field at all: no chief ray reaches the image, at any fraction.
  const resolved = lvFieldAngles(
    { ...binding.api, resolveMtfFieldGeometry: () => null },
    stopped.model,
    lvLaunchSetup(binding.api, stopped.model) as never,
    { kind: "image-height-fractions", values: [0, 1] },
  );
  const none = "chief-ray-failed: LensVisualizer finds no chief ray that reaches the image plane";
  assert.deepEqual(resolved, [{ problem: none }, { problem: none }]);
});

test("rays that would not start in front of the first surface are no set: the contract is held to, field by field", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { opticalCase, model } = await modelOf(binding, "acme-singlet-50");
  // LensVisualizer launches from in front of the lens, and so does the fake: every set starts in front.
  const sets = lvRaySets(binding.api, model, { sampling: { bundleGrid: 4 } });
  for (const spec of sets.sets) assert.ok(startsInFront(opticalCase.system.surfaces[0], f8(spec.origins)));
  // A stand-in whose launch plane, for one field, is the first vertex plane itself: on the surface, not in front.
  const misplaced = {
    ...binding.api,
    prepareMtfFieldLaunch: (...args: Parameters<typeof binding.api.prepareMtfFieldLaunch>) => {
      const launch = binding.api.prepareMtfFieldLaunch(...args);
      return launch === null || args[3] !== 10 ? launch : { ...launch, leadZ: 0 };
    },
  };
  const { sets: kept, problems } = lvRaySets(misplaced, model, { sampling: { bundleGrid: 4 } });
  assert.deepEqual(
    kept.map((spec) => spec.groups?.field?.angleDeg),
    [0, 20],
  );
  assert.deepEqual(problems, [
    "launch-behind-first-surface: the rays of the field at 10 degrees would not start in front of the first surface",
  ]);
});

test("where LensVisualizer's MTF gate does not pass, no field has rays, and the gate's reason is the code", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { model } = await modelOf(binding, "acme-singlet-50");
  // The fake's gate passes every state the exporter exports, as LensVisualizer's does not: a stand-in refuses.
  const refusing = {
    ...binding.api,
    assessMtfSupport: (...args: Parameters<typeof binding.api.assessMtfSupport>) => ({
      ...binding.api.assessMtfSupport(...args),
      available: false,
      reason: "unsupported-path",
      message: "MTF currently supports centered, sequential refractive prescriptions.",
    }),
  };
  const problem =
    "unsupported-path: LensVisualizer's MTF launch does not cover this state: " +
    "MTF currently supports centered, sequential refractive prescriptions.";
  assert.deepEqual(lvLaunchSetup(refusing, model), { problem });
  assert.deepEqual(lvRaySets(refusing, model, {}), { sets: [], problems: [problem] });
});

test("every line of a case has the rays of its reference line; at a finite conjugate they come from the object point", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const photopic = await modelOf(binding, "acme-zoom-24-48", { state: { zoomT: 1 }, lines: { kind: "photopic" } });
  const { sets, problems } = lvRaySets(api, photopic.model, { sampling: { bundleGrid: 4 } });
  assert.deepEqual(problems, []);
  // Three fields at five lines: field by field, and line by line within a field.
  assert.deepEqual(
    sets.map((spec) => [spec.groups?.field?.heightFraction, spec.line]),
    [0, 0.5, 1].flatMap((fraction) => [0, 1, 2, 3, 4].map((line) => [fraction, line])),
  );
  for (let index = 0; index < 15; index++) assert.deepEqual({ ...sets[index], line: 0 }, sets[index - (index % 5)]);
  assert.equal(new Set(sets.map(raySetId)).size, 15);
  // The launch is asked for a spectral run, with the lines of the case: its first line is the case's reference line.
  const setup = lvLaunchSetup(api, photopic.model);
  assert.ok(!("problem" in setup));
  assert.equal(setup.options.spectrum, "cdf");
  assert.deepEqual(
    setup.support.spectralLines,
    photopic.opticalCase.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
  );
  assert.equal(setup.support.referenceWavelengthNm, 555);
  assert.equal(setup.support.useResolvedReference, true);

  const close = await modelOf(binding, "acme-singlet-50", { state: { focus: { kind: "focusT", value: 1 } } });
  assert.deepEqual(close.opticalCase.conditions.object, { kind: "finite", z: -500 });
  const finite = lvRaySets(api, close.model, {
    fields: { kind: "angles-deg", values: [0, 5] },
    sampling: { bundleGrid: 4 },
  });
  assert.deepEqual(finite.problems, []);
  const closeSetup = lvLaunchSetup(api, close.model);
  assert.ok(!("problem" in closeSetup));
  // A fraction of the image height is resolved by LensVisualizer's rule for the conjugate: its inversion for an
  // object at infinity, and its root solve on the aimed chief ray for a finite one.
  const inversions: boolean[] = [];
  const watching = {
    ...api,
    resolveMtfFieldTargets: (...args: Parameters<typeof api.resolveMtfFieldTargets>) => {
      inversions.push(args[4]);
      return api.resolveMtfFieldTargets(...args);
    },
  };
  const fractions = { kind: "image-height-fractions", values: [0, 1] } as const;
  lvFieldAngles(watching, photopic.model, setup, fractions);
  lvFieldAngles(watching, close.model, closeSetup, fractions);
  assert.deepEqual(inversions, [true, false]);
  for (const spec of finite.sets) {
    assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
    const angleDeg = spec.groups?.field?.angleDeg as number;
    const rays = lvFieldRays(api, close.model, closeSetup, angleDeg, 4);
    assert.ok(!("problem" in rays));
    assert.ok(rays.launch.objectPoint !== undefined);
    const source: readonly number[] = rays.launch.objectPoint;
    assert.equal(source[2], -500);
    const [origins, directions, weights] = [f8(spec.origins), f8(spec.directions), f8(spec.weights)];
    const chief = spec.groups?.chiefIndex as number;
    const chiefDistance = Math.hypot(...row(origins, chief).map((value, axis) => value - source[axis]));
    for (let ray = 0; ray < weights.length; ray++) {
      const offset = row(origins, ray).map((value, axis) => value - source[axis]);
      const distance = Math.hypot(...offset);
      // Each ray is aimed from the object point through its launch point, between the object and the lens.
      assert.deepEqual(
        row(directions, ray),
        offset.map((component) => component / distance),
      );
      assert.equal(origins[3 * ray + 2], rays.launch.leadZ);
      // LensVisualizer's weight of a cell: its solid angle relative to the chief ray's.
      assert.equal(weights[ray], ray === chief ? 0 : (chiefDistance / distance) ** 3, `ray ${ray}`);
    }
    assert.ok(new Set(weights).size > 5 && weights.slice(0, chief).every((weight) => weight > 0.99 && weight < 1.01));
    const answer = answerLvRays(api, close.model, spec);
    assert.ok("data" in answer && answer.counts.ok > 0 && answer.counts.blocked > 0);
    assert.deepEqual(raysTraceQuantity.validateData(answer.data), []);
  }
});

test("where a glass absorbs, a ray's weight is its launch weight times LensVisualizer's transmission at the line", async (t) => {
  const lv = freshLv(t);
  const dark = variantOf(lv, "dark", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  absorptionPerMm: 0.125,"),
  });
  const binding = await bind(t, dark);
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, "acme-singlet-50");
  const { sets } = lvRaySets(api, model, { fields: { kind: "angles-deg", values: [0] }, sampling: { bundleGrid: 4 } });
  const [spec] = sets;
  const weights = f8(spec.weights);
  const answer = answerLvRays(api, model, spec);
  assert.ok("data" in answer);
  const status = integers(answer.data.status);
  const hits = f8(answer.data.hits);
  let transmitted = 0;
  for (let ray = 0; ray < 30; ray++) {
    if (status[ray] !== 0) {
      // A ray that is stopped keeps its launch weight: nothing reads it.
      assert.equal(weights[ray], 1, `ray ${ray}`);
      continue;
    }
    // The glass lies between the first two surfaces: exp(-0.125 / mm x the length of the ray in it).
    const inGlass = Math.hypot(...row(hits, 31 + ray).map((value, axis) => value - row(hits, ray)[axis]));
    assert.ok(Math.abs(weights[ray] - Math.exp(-0.125 * inGlass)) < 1e-15, `ray ${ray}`);
    assert.ok(weights[ray] > 0.55 && weights[ray] < 0.75, String(weights[ray]));
    transmitted++;
  }
  assert.ok(transmitted > 0);
  assert.equal(weights[30], 0);
  // It is what LensVisualizer states as the weight of the ray's image point.
  const options = lvTraceOptions(model, 0);
  const firstOk = status.indexOf(0);
  const origin = row(f8(spec.origins), firstOk) as [number, number, number];
  const direction = row(f8(spec.directions), firstOk) as [number, number, number];
  const spot = api.mtfImagePoint(
    model.state,
    api.traceEngineRay2(model.state, { origin, direction }, options),
    opticalCase.conditions.imageZ,
  );
  assert.equal(weights[firstOk], spot?.weight);
});

// ── Identity ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("the sets of a case are the same in two bindings, bit for bit, and so are the ids of the requests made of them", async (t) => {
  const options: RunOptions = { state: { zoomT: 0.5 }, aperture: { kind: "f-number", value: 5.6 } };
  const run = { fields: { kind: "image-height-fractions", values: [0, 0.7] }, sampling: { bundleGrid: 6 } } as const;
  const made: { sets: readonly RaysTraceSpec[]; ids: string[]; caseId: string }[] = [];
  for (const name of ["first", "second"]) {
    const binding = await bind(t, variantOf(freshLv(t), name, {}));
    const { opticalCase, model } = await modelOf(binding, "acme-zoom-24-48", options);
    const { sets, problems } = lvRaySets(binding.api, model, run);
    assert.deepEqual(problems, []);
    const again = lvRaySets(binding.api, model, run);
    assert.deepEqual(again.sets, sets);
    made.push({
      sets,
      ids: rayTraceRequests(opticalCase, { raySets: sets }).map((request) => request.id),
      caseId: opticalCase.id,
    });
    binding.close();
  }
  assert.deepEqual(made[1], made[0]);
  assert.equal(new Set(made[0].ids).size, 2);
  // Another grid, another field or another stop is another set, with another id.
  const binding = await bind(t, freshLv(t));
  const { model } = await modelOf(binding, "acme-zoom-24-48", options);
  const idsOf = (model_: LvCaseModel, with_: Parameters<typeof lvRaySets>[2]) =>
    lvRaySets(binding.api, model_, with_).sets.map(raySetId);
  const base = idsOf(model, run);
  assert.deepEqual(base, made[0].sets.map(raySetId));
  const others = [
    idsOf(model, { ...run, sampling: { bundleGrid: 8 } }),
    idsOf(model, { ...run, fields: { kind: "image-height-fractions", values: [0, 0.7000000000000001] } }),
    idsOf(
      (await modelOf(binding, "acme-zoom-24-48", { ...options, aperture: { kind: "f-number", value: 8 } })).model,
      run,
    ),
  ];
  for (const ids of others) assert.notEqual(ids[1], base[1]);
  assert.notEqual(others[0][0], base[0]);
});

test("the case source of LensVisualizer lenses gives the ray sets of the cases it resolved", async (t) => {
  const lv = freshLv(t);
  const source = createLvCaseSource(lv);
  const run = {
    contract: "1.0",
    kind: "run-spec",
    name: "a-run",
    lens: { kind: "lv", key: "acme-singlet-50" },
    fields: { kind: "angles-deg", values: [0, 8] },
    sampling: { bundleGrid: 4 },
  } as const;
  const resolved = await source.resolve(run);
  assert.ok(resolved.ok);
  const { sets, problems } = await source.raySets(run, resolved.opticalCase);
  assert.deepEqual(problems, []);
  const binding = await bind(t, lv);
  const { model } = await modelOf(binding, "acme-singlet-50");
  assert.deepEqual(sets, lvRaySets(binding.api, model, run).sets);
  // Asked again, the same sets: a request made of them has the same id however often it is built.
  assert.deepEqual((await source.raySets(run, resolved.opticalCase)).sets, sets);

  // A case that is no longer what LensVisualizer gives has no rays of its own to take: one problem, stale-case.
  const altered = structuredClone(resolved.opticalCase) as OpticalCase & { conditions: { stopSemiDiameter: number } };
  altered.conditions.stopSemiDiameter = 5;
  const stale = await source.raySets(run, altered);
  assert.equal(stale.sets.length, 0);
  assert.match(stale.problems[0], /^stale-case: its /);

  // Without a LensVisualizer there are no rays, and the reason is the one a run without a case is given.
  const unconfigured = await createLvCaseSource(null).raySets(run, resolved.opticalCase);
  assert.deepEqual(unconfigured, {
    sets: [],
    problems: ["lv-not-configured: LensVisualizer is not configured: set lvPath in lvrtc.local.json or LVRTC_LV_PATH"],
  });
});
