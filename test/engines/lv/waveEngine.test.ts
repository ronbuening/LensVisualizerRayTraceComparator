// The engine `wave`, with no LensVisualizer: on the fake LV tree, whose launch and tracer have LensVisualizer's
// names and numbers of their own. What is held here is what the engine does with a request: what it refuses, which
// rays it asks for, and that its answer is the estimator's on those very rays. What the estimator computes is
// test/estimators/waveOtf.test.ts, and what a lattice may carry test/estimators/waveValidity.test.ts.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../../src/contract/quantities/mtfNative.ts";
import { RAY_STATUS } from "../../../src/contract/quantities/raysTrace.ts";
import type { RayLattice } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { adapterRevision, importClosure } from "../../../src/engines/adapterRevision.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { LV_ENGINE_MODULE } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvFieldAngles, lvFieldRaySets, lvLaunchSetup, lvRaySets } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import {
  LV_WAVE_ENGINE_ID,
  LV_WAVE_ENGINE_MODULE,
  LV_WAVE_METHOD,
  answerLvWave,
  createLvWaveEngineOn,
} from "../../../src/engines/lv/waveEngine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { maskWhere } from "../../../src/estimators/validity.ts";
import { gridConvergence } from "../../../src/estimators/waveOtf.ts";
import { waveFlags } from "../../../src/estimators/waveValidity.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import {
  decodeWavefront,
  fieldWaveOtf,
  fluxCentroid,
  imageSpaceIndices,
  launchedSet,
} from "../../../src/rays/wavefront.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { SINGLET as FIXTURE_CASE } from "../../core/support.ts";
import { bind, freshLv } from "./support.ts";

const SINGLET = "acme-singlet-50";

/** Three fields at three frequencies: the diffraction MTF, on the plane of the case. */
const SPEC: MtfNativeSpec = {
  frequenciesPerMm: [0, 10, 30],
  fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
  method: "diffraction",
  focus: "design",
};
const GRID: JsonObject = { bundleGrid: 8 };

async function modelOf(
  binding: LvBinding,
  key: string,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return { opticalCase: exported.opticalCase, model: rebuilt.model };
}

function curve(data: MtfNativeData, field: number, cut: "sagittal" | "tangential"): number[] {
  return [...decodeNdArray(data.fields[field][cut]).values];
}

async function answered(t: TestContext, options: RunOptions = {}) {
  const binding = await bind(t, freshLv(t));
  const { opticalCase, model } = await modelOf(binding, SINGLET, options);
  return { binding, opticalCase, model };
}

test("the engine is wave: LensVisualizer's fingerprint, an adapter revision of its own that holds the estimator", async (t) => {
  const binding = await bind(t, freshLv(t));
  const adapter = new RemoteEngineAdapter({
    id: LV_WAVE_ENGINE_ID,
    transport: createInProcessTransport(createLvWaveEngineOn(binding)),
  });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.equal(LV_WAVE_ENGINE_ID, "wave");
  assert.equal(descriptor.identity.id, "wave");
  assert.equal(descriptor.identity.fingerprint, binding.fingerprint().engineClosureHash);
  assert.equal(descriptor.identity.adapterRevision, adapterRevision(LV_WAVE_ENGINE_MODULE).revision);
  assert.deepEqual(descriptor.capabilities.quantities, { [MTF_NATIVE]: { version: 1 } });
  // The estimator and what holds a lattice to its limits are the engine's own code, and are not `lv`'s.
  const closure = importClosure(LV_WAVE_ENGINE_MODULE);
  for (const file of [
    "estimators/waveOtf.ts",
    "estimators/waveValidity.ts",
    "rays/wavefront.ts",
    "engines/lv/raySets.ts",
  ]) {
    assert.ok(closure.includes(file), file);
  }
  const ofLv = importClosure(LV_ENGINE_MODULE);
  for (const file of ["estimators/waveOtf.ts", "estimators/waveValidity.ts", "rays/wavefront.ts"]) {
    assert.ok(!ofLv.includes(file), file);
  }
  // A case that no LensVisualizer lens is the source of is unsupported, as for every engine on LensVisualizer.
  const request = makeRequest({ caseId: FIXTURE_CASE.id, quantity: MTF_NATIVE, spec: SPEC });
  const refused = await adapter.run(request, FIXTURE_CASE);
  assert.equal(refused.status, "unsupported");
  assert.deepEqual(
    refused.unsupported?.map((item) => item.code),
    ["case-source"],
  );
});

test("what the engine does not answer is unsupported, each with its item", async (t) => {
  const { binding, model } = await answered(t);
  const itemOf = (spec: MtfNativeSpec, options: JsonObject = GRID): string => {
    const answer = answerLvWave(binding.api, model, spec, options);
    assert.ok("unsupported" in answer, JSON.stringify(answer).slice(0, 200));
    assert.equal(answer.unsupported.length, 1);
    return `${answer.unsupported[0].code} ${answer.unsupported[0].item}`;
  };
  assert.equal(itemOf({ ...SPEC, method: "geometric" }), "option method.geometric");
  assert.equal(itemOf({ ...SPEC, profile: "lv-tab-default" }), "option profile");
  assert.equal(itemOf({ ...SPEC, focus: "engine-best" }), "option focus.engine-best");
  for (const bundleGrid of [0, 1, 7.5, 130, "16", null]) {
    assert.equal(itemOf(SPEC, { bundleGrid }), "option option.bundleGrid", String(bundleGrid));
  }
});

test("the answer is the estimator's on the run's own ray sets, as LensVisualizer traces them, on the finer lattice", async (t) => {
  const { binding, model } = await answered(t);
  const answer = answerLvWave(binding.api, model, SPEC, GRID);
  assert.ok("data" in answer, JSON.stringify(answer).slice(0, 300));
  const data = answer.data as MtfNativeData;
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  assert.equal(data.method.name, LV_WAVE_METHOD);
  assert.deepEqual(data.method.params, {
    bundleGrid: 8,
    fineGrid: 16,
    quarterWave: 0.25,
    convergenceOnAxis: 0.005,
    convergenceOffAxis: 0.01,
    stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter,
  });
  assert.deepEqual(data.focus, { mode: "design", appliedShiftMm: 0 });
  assert.deepEqual(data.aperture, {});
  assert.deepEqual(
    data.lines,
    model.exported.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
  );
  assert.deepEqual(answer.counts, { fields: 3, frequencies: 3, unavailableFields: 0 });

  // The same figures by the same steps, written out: the sets a run of this case traces at 16 and at 8 cells, each
  // traced as `lv` answers `rays.trace`, on the rays that land, about the centre of the first line's flux.
  const { api } = binding;
  const { exported } = model;
  const indices = imageSpaceIndices(exported);
  const estimate = (cells: number, field: number) => {
    const { sets } = lvRaySets(api, model, { fields: SPEC.fields, sampling: { bundleGrid: cells } });
    const ofField = sets.filter((set) => set.groups?.field?.heightFraction === SPEC.fields.values[field]);
    assert.equal(ofField.length, exported.conditions.lines.length);
    const lines = ofField.map((set) => {
      const traced = answerLvRays(api, model, set);
      assert.ok("data" in traced);
      const trace = decodeWavefront(traced.data);
      return { set: launchedSet(set, exported), trace, valid: maskWhere(trace.status, RAY_STATUS.ok) };
    });
    const centre = fluxCentroid(lines[0].trace, lines[0].set.weights, lines[0].valid);
    assert.ok(centre !== null);
    const lattice = ofField[0].groups?.lattice as RayLattice;
    const otf = fieldWaveOtf(
      exported,
      indices,
      lattice,
      lines,
      { ...centre, z: exported.conditions.imageZ },
      SPEC.frequenciesPerMm,
    );
    assert.ok(otf.available, otf.available ? "" : otf.message);
    return { otf, lines, lattice, chief: ofField[0].groups?.chiefIndex as number };
  };
  for (const [index, stated] of data.fields.entries()) {
    const [fine, coarse] = [estimate(16, index), estimate(8, index)];
    assert.deepEqual(
      curve(data, index, "sagittal"),
      [...fine.otf.sagittal.modulus].map((value) => Math.min(1, value)),
    );
    assert.deepEqual(
      curve(data, index, "tangential"),
      [...fine.otf.tangential.modulus].map((value) => Math.min(1, value)),
    );
    // At frequency 0 a transfer function is exactly 1.
    assert.equal(curve(data, index, "sagittal")[0], 1);
    const moved = gridConvergence(coarse.otf, fine.otf).maxAbs;
    const flags = waveFlags(fine.otf.phaseStep.waves, moved, stated.fieldAngleDeg === 0);
    assert.equal(stated.status, flags.length === 0 ? "ok" : "unconverged");
    assert.equal(stated.reason, flags.length === 0 ? undefined : flags.join("+"));
    const cells = fine.lattice.columns * fine.lattice.rows;
    const count = (status: number): number =>
      fine.lines.reduce(
        (sum, line) => sum + line.trace.status.subarray(0, cells).filter((each) => each === status).length,
        0,
      );
    assert.deepEqual(stated.sampling, {
      gridSize: 16,
      coarseGridSize: 8,
      validRays: count(RAY_STATUS.ok),
      blockedRays: count(RAY_STATUS.blocked),
      failedRays: count(RAY_STATUS.failed),
      phaseStepWaves: fine.otf.phaseStep.waves,
      maxDelta: moved,
    });
    // Every cell is counted once, and the chief ray, which follows the cells, is none of them.
    assert.equal(count(0) + count(1) + count(2), cells * fine.lines.length);
    const [{ trace }] = fine.lines;
    assert.equal(stated.imageHeightMm, Math.hypot(trace.x[fine.chief], trace.y[fine.chief]));
    assert.equal(stated.field, SPEC.fields.values[index]);
  }
  // The angles are LensVisualizer's own for the fractions, and a field that is no arbiter has a note that says why.
  const setup = lvLaunchSetup(api, model);
  assert.ok(!("problem" in setup));
  const angles = lvFieldAngles(api, model, setup, SPEC.fields);
  assert.deepEqual(
    data.fields.map((field) => field.fieldAngleDeg),
    angles.map((field) => ("problem" in field ? null : field.angleDeg)),
  );
  const flagged = data.fields.filter((field) => field.status === "unconverged");
  assert.equal(data.notes.length, flagged.length);
  for (const field of flagged) {
    assert.ok(
      data.notes.some(
        (note) => note.startsWith(`field ${field.field}: the lattice of `) && note.includes("is no arbiter"),
      ),
    );
  }

  // Without the option the coarser lattice is the default bundle grid, 32, and the finer 64; and the sets of a
  // field are the run's own, to the byte, whichever way they are asked for.
  const first = angles[0];
  assert.ok(!("problem" in first));
  const direct = lvFieldRaySets(api, model, setup, first, 8);
  assert.ok("sets" in direct);
  const all = lvRaySets(api, model, { fields: SPEC.fields, sampling: { bundleGrid: 8 } });
  assert.deepEqual(direct.sets, all.sets.slice(0, direct.sets.length));
});

test("a field without rays is unavailable with LensVisualizer's code, and the others are answered", async (t) => {
  const { binding, model } = await answered(t);
  // A fraction beyond the modeled field has no chief-ray angle.
  const spec: MtfNativeSpec = { ...SPEC, fields: { kind: "image-height-fractions", values: [0, 5] } };
  const setup = lvLaunchSetup(binding.api, model);
  assert.ok(!("problem" in setup));
  const [, beyond] = lvFieldAngles(binding.api, model, setup, spec.fields);
  const answer = answerLvWave(binding.api, model, spec, GRID);
  assert.ok("data" in answer, JSON.stringify(answer).slice(0, 300));
  const data = answer.data as MtfNativeData;
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  if ("problem" in beyond) {
    assert.equal(data.fields[1].status, "unavailable");
    assert.equal(data.fields[1].reason, beyond.problem.slice(0, beyond.problem.indexOf(":")));
    assert.ok(curve(data, 1, "sagittal").every(Number.isNaN));
    assert.deepEqual(answer.counts, { fields: 2, frequencies: 3, unavailableFields: 1 });
  }
  assert.notEqual(data.fields[0].status, "unavailable");
});
