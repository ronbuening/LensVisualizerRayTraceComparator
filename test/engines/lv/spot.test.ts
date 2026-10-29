// `spot.native` of the engine `lv`, with no LensVisualizer: on the fake LV tree, whose coma and bokeh tabs have
// LensVisualizer's names and numbers of their own. What is held here is what the engine asks of the tabs and how it
// writes their numbers down; what the tabs compute is the fake's, and LensVisualizer's own is tier 2.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { SpotNativeData, SpotNativeSpec } from "../../../src/contract/quantities/spotNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { LV_BOKEH_TAB, LV_COMA_TAB, answerLvSpot } from "../../../src/engines/lv/spot.ts";
import type { LvSpotAnswer } from "../../../src/engines/lv/spot.ts";
import { lvSpotRaySets, lvSpotSetup } from "../../../src/engines/lv/spotRaySets.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { spotNativeQuantity } from "../../../src/quantities/spotNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { bind, freshLv } from "./support.ts";

const SINGLET = "acme-singlet-50";

async function modelOf(binding: LvBinding, options: RunOptions = {}): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(SINGLET, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return rebuilt.model;
}

function dataOf(answer: LvSpotAnswer): SpotNativeData {
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual(spotNativeQuantity.validateData(answer.data), []);
  return answer.data;
}

function itemsOf(answer: LvSpotAnswer): string[] {
  assert.ok("unsupported" in answer, JSON.stringify(answer));
  return answer.unsupported.map(({ item }) => item);
}

/** The tab request the engine makes: the drawer's, with the sampling of the spec. */
function tabRequest(binding: LvBinding, model: LvCaseModel, sampling: object) {
  const setup = lvSpotSetup(binding.api, model);
  return binding.api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: setup.pupilSemiDiameterMm,
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: setup.fieldGeometry,
    sampling,
  });
}

test("the coma tab's point cloud is written down as the tab has it: centroid x and y, radius, chief landing", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const [rings] = lvSpotRaySets(binding.api, model).asks;
  const data = dataOf(answerLvSpot(binding.api, model, rings.spec));
  const preview = binding.api.computeComaAnalysis(tabRequest(binding, model, {})).pointCloudPreview;
  assert.ok(preview !== null);
  assert.equal(data.pattern, "rings");
  assert.deepEqual(data.method.name, LV_COMA_TAB);
  assert.deepEqual(data.lines, [{ wavelengthNm: model.exported.conditions.lines[0].wavelengthNm, weight: 1 }]);
  data.fields.forEach((field, index) => {
    const tab = preview.fields[index];
    assert.deepEqual(
      [field.field, field.fieldAngleDeg, field.imageHeightMm, field.status],
      [tab.fieldFraction, tab.fieldAngleDeg, Math.abs(tab.chiefIntercept), "ok"],
    );
    assert.deepEqual(field.spot, {
      centroidMm: [tab.centroidSagittalImageHeight, tab.centroidTangentialImageHeight],
      rmsRadiusMm: tab.rmsRadiusMm,
    });
    assert.deepEqual(field.sampling, { raysLaunched: tab.sampleCount, raysLanded: tab.validSampleCount });
  });
});

test("a fan is the tab's detail fan at the field asked: its samples' errors, NaN where one did not land", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const [, tangential, sagittal] = lvSpotRaySets(binding.api, model).asks;
  const analysis = binding.api.computeComaAnalysis(
    tabRequest(binding, model, { comaDetailFieldFraction: 0.7, comaFanSampleCount: 7 }),
  );
  for (const [ask, fan, axis] of [
    [tangential, analysis.meridionalComa, "tangential"],
    [sagittal, analysis.sagittalComa, "sagittal"],
  ] as const) {
    const [field] = dataOf(answerLvSpot(binding.api, model, ask.spec)).fields;
    assert.ok(fan !== null && field.fan !== null);
    assert.deepEqual(
      [...decodeNdArray(field.fan.pupil).values],
      fan.samples.map((sample) => sample.pupilFraction),
    );
    const errors = fan.samples.map((sample) => {
      const relative = axis === "tangential" ? sample.relativeImageHeight : sample.relativeImageX;
      return relative ?? NaN;
    });
    assert.deepEqual([...decodeNdArray(field.fan.errorMm).values], errors);
    // The chief ray of both fans is one; the meridional fan says where it lands.
    assert.equal(field.imageHeightMm, Math.abs(analysis.meridionalComa?.centerIntercept ?? NaN));
  }
});

test("a bokeh tile is intercepted at the plane of the case, which may be any plane; the coma tab only its own", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.5 } });
  const asks = lvSpotRaySets(binding.api, model).asks;
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, model, asks[0].spec)), ["focus.off-design"]);
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, model, asks[1].spec)), ["focus.off-design"]);
  const bokeh = dataOf(answerLvSpot(binding.api, model, asks[3].spec));
  assert.equal(bokeh.method.name, LV_BOKEH_TAB);
  const imageZ = model.exported.conditions.imageZ;
  bokeh.fields.forEach((field, index) => {
    const tile = binding.api.computeBokehFieldFootprint(tabRequest(binding, model, {}), field.field, imageZ);
    assert.ok(tile !== null);
    assert.deepEqual(field.spot, {
      centroidMm: [tile.centroidSagittal, tile.centroidTangential],
      rmsRadiusMm: tile.rmsRadiusMm,
    });
    assert.equal(field.sampling.maxRadiusMm, tile.maxRadiusMm);
    assert.equal(
      index === 0 ? field.imageHeightMm : field.imageHeightMm !== null && field.imageHeightMm > 0,
      index === 0 ? 0 : true,
    );
  });
  // A tile samples only LensVisualizer's own rings.
  const rings = {
    ...asks[3].spec,
    pupil: { kind: "rings", rings: [1, 6], weighting: "area-transmission" },
  } as SpotNativeSpec;
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, model, rings)), ["pupil.rings"]);
});

test("what the tabs do not draw is unsupported: another line, fields as angles, a finite object", async (t) => {
  const binding = await bind(t, freshLv(t));
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const [rings] = lvSpotRaySets(binding.api, photopic).asks;
  // The tabs trace the authored indices: the photopic case's line 0, at 555 nm, has other indices, and another
  // line is not the reference line at all.
  assert.equal(photopic.exported.conditions.lines[0].indexSource, "anchored");
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, photopic, rings.spec)), ["lines.not-authored-reference"]);
  const model = await modelOf(binding);
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, model, { ...rings.spec, line: 1 })), [
    "lines.not-authored-reference",
  ]);
  const angles = { ...rings.spec, fields: { kind: "angles-deg", values: [0, 10] } } as SpotNativeSpec;
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, model, angles)), ["fields.angles-deg"]);
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  assert.deepEqual(itemsOf(answerLvSpot(binding.api, close, rings.spec)), ["object.finite"]);
});

/** The binding's api with every function of LensVisualizer replaced by one that throws: nothing may be asked of it. */
function unasked(api: LvBinding["api"]): LvBinding["api"] {
  return new Proxy(api, {
    get(target, name, receiver) {
      const value: unknown = Reflect.get(target, name, receiver);
      if (typeof value !== "function") return value;
      return () => {
        throw new Error(`LensVisualizer was asked ${String(name)}`);
      };
    },
  });
}

test("a spec the case refuses is answered unsupported before LensVisualizer is asked anything", async (t) => {
  const binding = await bind(t, freshLv(t));
  const api = unasked(binding.api);
  const model = await modelOf(binding);
  const sets = lvSpotRaySets(binding.api, model);
  const [rings] = sets.asks;
  const bokeh = sets.asks.find(({ spec }) => spec.pupil.kind === "rings" && spec.pupil.weighting !== "area");
  assert.ok(bokeh !== undefined && bokeh.spec.pupil.kind === "rings");
  // The api asks: an accepted spec reaches LensVisualizer, and this api throws there.
  assert.throws(() => answerLvSpot(api, model, rings.spec), /LensVisualizer was asked/);
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  const angles = { ...rings.spec, fields: { kind: "angles-deg", values: [0, 10] } } as SpotNativeSpec;
  const otherRings = { ...bokeh.spec, pupil: { ...bokeh.spec.pupil, rings: [1, 3] } };
  for (const [refusedModel, spec, items] of [
    [photopic, rings.spec, ["lines.not-authored-reference"]],
    [model, angles, ["fields.angles-deg"]],
    [close, rings.spec, ["object.finite"]],
    [model, otherRings, ["pupil.rings"]],
    [close, { ...angles, line: 1 }, ["lines.not-authored-reference", "fields.angles-deg", "object.finite"]],
  ] as const) {
    assert.deepEqual(itemsOf(answerLvSpot(api, refusedModel, spec as SpotNativeSpec)), items);
  }
});

test("the engine offers spot.native, answers it through the protocol, and states the tab it asked", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.capabilities.quantities["spot.native"], { version: 1 });
  const [rings] = lvSpotRaySets(binding.api, model).asks;
  const request = makeRequest({ caseId: model.exported.id, quantity: "spot.native", spec: rings.spec });
  const result = await adapter.run(request, model.exported);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.method, { name: "analysis-tabs", params: {} });
  assert.equal((result.data as SpotNativeData).method.name, LV_COMA_TAB);
});
