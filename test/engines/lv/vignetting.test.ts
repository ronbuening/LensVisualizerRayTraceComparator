// `vignetting.native` of the engines `lv` and `flux`, with no LensVisualizer: on the fake LV tree, whose vignetting tab,
// launch lattice and tracer have LensVisualizer's names and numbers of their own. What is held here is what each engine
// asks and how it writes the numbers down: `lv`, the tab's curve as the tab presents it, refusing before it asks
// anything what the case decides; `flux`, the estimator's figures of LensVisualizer's lattices as LensVisualizer traces
// them. What the estimator computes is test/estimators/illumination.test.ts; LensVisualizer's own tab is tier 2.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { RayLattice } from "../../../src/contract/quantities/raysTrace.ts";
import { VIGNETTING_NATIVE } from "../../../src/contract/quantities/vignettingNative.ts";
import type { VignettingNativeData, VignettingNativeSpec } from "../../../src/contract/quantities/vignettingNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { adapterRevision, importClosure } from "../../../src/engines/adapterRevision.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefGeometry, lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { LV_ENGINE_MODULE, createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import {
  LV_FLUX_DEFAULT_GRID,
  LV_FLUX_ENGINE_ID,
  LV_FLUX_ENGINE_MODULE,
  LV_FLUX_METHOD,
  answerLvFlux,
  createLvFluxEngineOn,
} from "../../../src/engines/lv/fluxEngine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvFieldRaySets, lvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { LV_VIGNETTING_TAB, answerLvVignetting } from "../../../src/engines/lv/vignetting.ts";
import type { LvVignettingAnswer } from "../../../src/engines/lv/vignetting.ts";
import { lvVignettingFieldAngles } from "../../../src/engines/lv/vignettingFields.ts";
import { lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { cosineFlux } from "../../../src/estimators/illumination.ts";
import { maskWhere } from "../../../src/estimators/validity.ts";
import { vignettingNativeQuantity } from "../../../src/quantities/vignettingNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";
const SINGLET_FILE = "src/lens-data/acme/AcmeSinglet50.data.ts";

async function modelOf(binding: LvBinding, options: RunOptions = {}, key = SINGLET): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return rebuilt.model;
}

function dataOf(answer: LvVignettingAnswer | { data?: unknown }): VignettingNativeData {
  assert.ok("data" in answer && answer.data !== undefined, JSON.stringify(answer).slice(0, 400));
  const data = answer.data as VignettingNativeData;
  assert.deepEqual(vignettingNativeQuantity.validateData(data), []);
  return data;
}

function itemsOf(answer: { unsupported?: readonly { item: string }[] } | object): string[] {
  assert.ok("unsupported" in answer, JSON.stringify(answer).slice(0, 400));
  return (answer as { unsupported: { item: string }[] }).unsupported.map(({ item }) => item);
}

/** The ask of a model's own case source. */
function askOf(binding: LvBinding, model: LvCaseModel): VignettingNativeSpec {
  const [ask] = lvVignettingRaySets(binding.api, model).asks;
  assert.ok(ask !== undefined);
  return ask;
}

// ── lv: the tab ──────────────────────────────────────────────────────────────────────────────────────────────────

test("lv's answer is the tab's curve as the tab presents it, each field identified by its solved chief ray", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  const data = dataOf(answerLvVignetting(api, model, ask));
  const curve = api.computeVignettingCurve(lvChiefRequest(api, model));
  assert.equal(data.method.name, LV_VIGNETTING_TAB);
  assert.deepEqual(
    data.fields.map((field) => [field.line, field.fieldAngleDeg, field.status]),
    curve.samples.map((sample) => [0, sample.fieldAngleDeg, "ok"]),
  );
  const geometry = lvChiefGeometry(api, model)!;
  data.fields.forEach((field, at) => {
    const sample = curve.samples[at];
    // The unvignetted fraction, absolute (LV #931), and Rimmer's relative illumination, over the axis's.
    assert.equal(field.geometricTransmission, sample.unvignettedFraction);
    assert.equal(field.relativeIllumination, sample.relativeIllumination);
    const landing = api.chiefRayImageHeightAccurateForRuntimeLens(
      field.fieldAngleDeg,
      [...model.state.z],
      model.state.focusT,
      model.state.zoomT,
      model.runtime,
      geometry,
      0,
    );
    assert.equal(field.chiefLandingMm, landing);
    assert.deepEqual(field.sampling, {
      gridCells: 64,
      fieldSamples: 8,
      mirrored: 1,
      samples: sample.sampleCount,
      transmitted: sample.transmittedCount,
      blocked: sample.blockedCount,
      unaimed: sample.unaimedCount,
      failed: sample.failedCount,
    });
  });
  assert.equal(data.method.params.gridCells, 64);
});

test("a field the tab has a fraction and no relative illumination of is unavailable with the tab's reason", async (t) => {
  // The fake made to give no relative illumination beyond half its field.
  const lv = variantOf(freshLv(t), "dark-edge", {
    "src/optics/analysis/vignetting.ts": (text) =>
      text.replace(
        '    rimmerSum: sum,\n    unavailableReason: null,\n    relativeIlluminationReason: sum === null ? "isolated-cell" : null,',
        '    rimmerSum: fieldFraction > 0.5 ? null : sum,\n    unavailableReason: null,\n    relativeIlluminationReason: sum === null || fieldFraction > 0.5 ? "isolated-cell" : null,',
      ),
  });
  const binding = await bind(t, lv);
  const model = await modelOf(binding);
  const data = dataOf(answerLvVignetting(binding.api, model, askOf(binding, model)));
  const curve = binding.api.computeVignettingCurve(lvChiefRequest(binding.api, model));
  data.fields.forEach((field, at) => {
    const sample = curve.samples[at];
    if (sample.fieldFraction > 0.5) {
      assert.deepEqual(
        [field.status, field.reason, field.relativeIllumination],
        ["unavailable", "lv-isolated-cell", null],
      );
      assert.equal(field.sampling.unvignettedFraction, sample.unvignettedFraction);
    } else assert.equal(field.status, "ok");
  });
  assert.ok(data.fields.some((field) => field.status === "unavailable"));
});

/**
 * The binding's api with every function of LensVisualizer replaced by one that throws: the tab's refusals read the
 * case and the prepared state alone.
 */
function unasked(api: LvBinding["api"]): LvBinding["api"] {
  return Object.fromEntries(
    Object.entries(api).map(([name, value]) => [
      name,
      typeof value !== "function"
        ? value
        : () => {
            throw new Error(`LensVisualizer was asked ${name}`);
          },
    ]),
  ) as unknown as LvBinding["api"];
}

test("a spec the case refuses is answered unsupported before LensVisualizer is asked anything", async (t) => {
  const binding = await bind(t, freshLv(t));
  const api = unasked(binding.api);
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  assert.throws(() => answerLvVignetting(api, model, ask), /LensVisualizer was asked/);
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  const shifted = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } });
  const folded = await modelOf(binding, {}, "zz-folded-mirror");
  for (const [refusedModel, spec, items] of [
    [photopic, { ...ask, lines: [0, 1] }, ["lines.not-authored-reference"]],
    [close, ask, ["object.finite"]],
    // A folded path's design plane is no last vertex and gap, which the tab's landing is of: off it as well.
    [folded, ask, ["path.folded", "focus.off-design"]],
    // A line the case does not have is refused before anything is read of it.
    [model, { ...ask, lines: [0, 3] }, ["line"]],
    [close, { ...ask, lines: [4] }, ["object.finite", "line"]],
    [shifted, ask, ["focus.off-design"]],
  ] as const) {
    assert.deepEqual(itemsOf(answerLvVignetting(api, refusedModel, spec)), items);
  }
});

test("an angle of no field of the tab's is unsupported, and a tab without a curve leaves every field unavailable", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  const other = { ...ask, fieldAnglesDeg: [0, ask.fieldAnglesDeg[1] * (1 + 2 ** -52)] };
  assert.deepEqual(itemsOf(answerLvVignetting(binding.api, model, other)), ["fields.angles"]);
  const some = { ...ask, fieldAnglesDeg: [0, ask.fieldAnglesDeg[3]] };
  assert.deepEqual(
    dataOf(answerLvVignetting(binding.api, model, some)).fields.map((field) => field.fieldAngleDeg),
    some.fieldAnglesDeg,
  );
  binding.close();
  // The fake's tab made to draw no curve: every field is the answer's, unavailable with the tab's reason.
  const blank = variantOf(lv, "blank", {
    "src/optics/analysis/vignetting.ts": (text) =>
      text.replace(
        'if (!(request.aperture.stopSemiDiameterMm > 0)) return none("invalid-state");',
        'return none("invalid-state");',
      ),
  });
  const bound = await bind(t, blank);
  const blankModel = await modelOf(bound);
  const data = dataOf(answerLvVignetting(bound.api, blankModel, askOf(bound, blankModel)));
  assert.ok(data.fields.every((field) => field.status === "unavailable" && field.reason === "lv-invalid-state"));
});

test("a state the tab draws no curve of is asked nothing, and answered unavailable at each of the tab's fields", async (t) => {
  const vector = variantOf(freshLv(t), "vector", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: 12 },"),
  });
  const binding = await bind(t, vector);
  const model = await modelOf(binding);
  assert.deepEqual(lvVignettingRaySets(binding.api, model).asks, []);
  // Asked anyway, at the tab's own angles: no curve, at every field, with the reason.
  const angles = lvVignettingFieldAngles(binding.api, lvChiefGeometry(binding.api, model)!.halfFieldDeg);
  const spec = { lines: [0], maxFieldDeg: 20, fieldAnglesDeg: angles };
  const data = dataOf(answerLvVignetting(binding.api, model, spec));
  assert.deepEqual(
    data.fields.map((field) => [field.status, field.reason]),
    angles.map(() => ["unavailable", "lv-bounding-sphere-field"]),
  );
  const curve = binding.api.computeVignettingCurve(lvChiefRequest(binding.api, model));
  assert.deepEqual([curve.available, curve.reason, curve.samples], [false, "bounding-sphere-field", []]);
  assert.deepEqual(itemsOf(answerLvVignetting(binding.api, model, { ...spec, fieldAnglesDeg: [0, 1] })), [
    "fields.angles",
  ]);
});

test("the engine lv offers vignetting.native, answers it through the protocol, and states the tab it asked", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.capabilities.quantities[VIGNETTING_NATIVE], { version: 1 });
  const request = makeRequest({ caseId: model.exported.id, quantity: VIGNETTING_NATIVE, spec: askOf(binding, model) });
  const result = await adapter.run(request, model.exported);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.method, { name: "analysis-tabs", params: {} });
  assert.equal((result.data as VignettingNativeData).method.name, LV_VIGNETTING_TAB);
});

// ── flux: the estimator on LensVisualizer's lattices ─────────────────────────────────────────────────────────────

test("the engine is flux: LensVisualizer's fingerprint, an adapter revision of its own that holds the estimator", async (t) => {
  const binding = await bind(t, freshLv(t));
  const adapter = new RemoteEngineAdapter({
    id: LV_FLUX_ENGINE_ID,
    transport: createInProcessTransport(createLvFluxEngineOn(binding)),
  });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.equal(descriptor.identity.id, "flux");
  assert.equal(descriptor.identity.fingerprint, binding.fingerprint().engineClosureHash);
  assert.equal(descriptor.identity.adapterRevision, adapterRevision(LV_FLUX_ENGINE_MODULE).revision);
  assert.deepEqual(descriptor.capabilities.quantities, { [VIGNETTING_NATIVE]: { version: 1 } });
  // The estimator is the engine's own code, and is not lv's.
  assert.ok(importClosure(LV_FLUX_ENGINE_MODULE).includes("estimators/illumination.ts"));
  assert.ok(!importClosure(LV_ENGINE_MODULE).includes("estimators/illumination.ts"));
});

test("flux's answer is the estimator's on LensVisualizer's lattice of each field, as LensVisualizer traces it", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  const options = { bundleGrid: 8 };
  const data = dataOf(answerLvFlux(api, model, ask, options));
  assert.equal(data.method.name, LV_FLUX_METHOD);
  assert.deepEqual(data.method.params.bundleGrid, 8);
  assert.deepEqual(data.method.params.fineGrid, 16);
  const setup = lvLaunchSetup(api, model);
  assert.ok(!("problem" in setup));
  // The two figures of a field on the finer lattice, worked out here from the same lattice and trace.
  const figures = (angleDeg: number, cells: number) => {
    const made = lvFieldRaySets(api, model, setup, { angleDeg }, cells);
    assert.ok("sets" in made);
    const [set] = made.sets;
    const answer = answerLvRays(api, model, set);
    assert.ok("data" in answer);
    const { columns, rows, step } = set.groups!.lattice as RayLattice;
    const status = decodeNdArray(answer.data.status).values;
    const valid = maskWhere(status, 0);
    // A cell of weight 0 is no sample of the stop (outside its disc, or unaimed: the chief ray holds it); of the
    // others, those the trace failed are left out, as LensVisualizer's tab leaves them out (LV #931).
    const weights = decodeNdArray(set.weights).values;
    const samples = weights.filter((weight, ray) => ray < columns * rows && weight > 0 && status[ray] !== 2).length;
    const lit = valid.map((taken, ray) => (taken && weights[ray] > 0 ? 1 : 0));
    const transmitted = lit.filter((each, ray) => ray < columns * rows && each === 1).length;
    const flux = cosineFlux({
      columns,
      rows,
      step,
      weight: decodeNdArray(set.weights).values,
      valid,
      point: decodeNdArray(answer.data.imagePoint).values,
      direction: decodeNdArray(answer.data.exitDirection).values,
      imageIndex: 1,
    });
    assert.ok(flux.available && samples > 0);
    return { share: transmitted / samples, flux: flux.flux };
  };
  const axis = figures(0, 16);
  data.fields.forEach((field) => {
    const own = figures(field.fieldAngleDeg, 16);
    // The share of the stop's samples that reach the image, absolute, as LensVisualizer's tab takes it since #931.
    assert.equal(field.geometricTransmission, own.share);
    assert.equal(field.relativeIllumination, own.flux / axis.flux);
    assert.equal(field.sampling.gridSize, 16);
    assert.equal(field.sampling.coarseGridSize, 8);
    assert.ok(field.status === "ok" || field.reason?.match(/^(not-converged|lattice-edge-lit)/), field.reason);
  });
  assert.equal(data.fields[0].geometricTransmission, 1);
  assert.equal(data.fields[0].relativeIllumination, 1);
  // On the fake's coarse lattices the figures move on doubling: no arbiter there. A stop lattice has no rim a beam could
  // reach past (LV #936): the stop's disc bounds it, and no field is flagged for its rim.
  assert.ok(data.fields.every((field) => !field.reason?.includes("lattice-edge-lit")));
  assert.ok(data.fields.every((field) => field.sampling.edgeCells === 0));
  // Without the option the coarser lattice has twice a run's own cells.
  assert.equal(LV_FLUX_DEFAULT_GRID, 64);
});

test("flux makes a field's lattices once whatever line is asked: an answer of several lines is each line's alone", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding, { lines: { kind: "photopic" } });
  const ask = { ...askOf(binding, await modelOf(binding)), lines: [0, 2, 4] };
  const options = { bundleGrid: 8 };
  const together = dataOf(answerLvFlux(binding.api, model, ask, options));
  for (const line of ask.lines) {
    const alone = dataOf(answerLvFlux(binding.api, model, { ...ask, lines: [line] }, options));
    assert.equal(
      JSON.stringify(together.fields.filter((field) => field.line === line)),
      JSON.stringify(alone.fields),
      `line ${line}`,
    );
  }
  assert.equal(together.fields.length, 3 * ask.fieldAnglesDeg.length);
});

test("what flux does not answer is unsupported, each with its item", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  for (const bundleGrid of [0, 1, 7.5, 130, "16", null]) {
    assert.deepEqual(itemsOf(answerLvFlux(binding.api, model, ask, { bundleGrid })), ["option.bundleGrid"]);
  }
  assert.deepEqual(itemsOf(answerLvFlux(binding.api, model, { ...ask, lines: [2] }, { bundleGrid: 8 })), ["line"]);
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  assert.deepEqual(itemsOf(answerLvFlux(binding.api, close, ask)), ["object.finite"]);
  const folded = await modelOf(binding, {}, "zz-folded-mirror");
  assert.deepEqual(itemsOf(answerLvFlux(binding.api, folded, ask)), ["path.folded"]);
});
