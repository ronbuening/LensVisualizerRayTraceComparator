// `chief.native` of the engine `lv`, with no LensVisualizer: on the fake LV tree, whose distortion tab, pupils tab and
// lateral-colour section have LensVisualizer's names and numbers of their own. What is held here is what the engine
// asks of the tabs and how it writes their numbers down; what the tabs compute is the fake's, and LensVisualizer's own
// is tier 2.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ChiefNativeData, ChiefNativeSpec } from "../../../src/contract/quantities/chiefNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import {
  LV_DISTORTION_TAB,
  LV_LATERAL_COLOUR_SECTION,
  LV_PUPILS_TAB,
  answerLvChief,
} from "../../../src/engines/lv/chief.ts";
import type { LvChiefAnswer } from "../../../src/engines/lv/chief.ts";
import { lvChiefRaySets } from "../../../src/engines/lv/chiefRaySets.ts";
import { lvChiefGeometry, lvChiefRequest, lvDistortionReference } from "../../../src/engines/lv/chiefSetup.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { chiefNativeQuantity } from "../../../src/quantities/chiefNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";

async function modelOf(binding: LvBinding, options: RunOptions = {}): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(SINGLET, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return rebuilt.model;
}

function dataOf(answer: LvChiefAnswer): ChiefNativeData {
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual(chiefNativeQuantity.validateData(answer.data), []);
  return answer.data;
}

function itemsOf(answer: LvChiefAnswer): string[] {
  assert.ok("unsupported" in answer, JSON.stringify(answer));
  return answer.unsupported.map(({ item }) => item);
}

/** The asks of a model, by kind. */
function asksOf(binding: LvBinding, model: LvCaseModel): Record<string, ChiefNativeSpec> {
  return Object.fromEntries(lvChiefRaySets(binding.api, model).asks.map((ask) => [ask.kind, ask]));
}

test("distortion is the curve as the tab plots it, the landing of each sample's solved chief ray beside it", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding);
  const data = dataOf(answerLvChief(api, model, asksOf(binding, model).distortion));
  const curve = api.computeDistortionCurve(lvChiefRequest(api, model));
  const geometry = lvChiefGeometry(api, model)!;
  const reference = lvDistortionReference(api, model, geometry)!;
  assert.equal(data.method.name, LV_DISTORTION_TAB);
  assert.deepEqual(data.reference, {
    focalScaleMm: reference.rectilinearScale,
    probeAngleDeg: reference.probeAngleDeg,
    paraxialEntrancePupilZ: null,
    paraxialExitPupilZ: null,
  });
  assert.deepEqual(
    data.fields.map((field) => [
      field.fieldAngleDeg,
      field.figures?.realHeightMm,
      field.figures?.idealHeightMm,
      field.figures?.percent,
    ]),
    curve.samples
      .slice(1)
      .map((sample) => [sample.fieldAngleDeg, sample.realHeight, sample.idealHeight, sample.distortionPercent]),
  );
  for (const field of data.fields) {
    const landing = api.chiefRayImageHeightAccurateForRuntimeLens(
      field.fieldAngleDeg,
      [...model.state.z],
      0,
      0,
      model.runtime,
      geometry,
      0,
    );
    assert.equal(field.chiefLandingMm, landing);
    // The fake plots its landings: the residual from what it plots is 0.
    assert.deepEqual(field.sampling, { inversionResidualMm: 0 });
  }
});

test("pupils are each field's real pupils made absolute from the tab's shifts, and its stored paraxial pupils", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding);
  const data = dataOf(answerLvChief(api, model, asksOf(binding, model).pupils));
  const profiles = api.computeBothPupilAberrationProfiles(lvChiefRequest(api, model));
  const geometry = lvChiefGeometry(api, model)!;
  const { z } = model.state;
  const last = z[z.length - 1];
  assert.equal(data.method.name, LV_PUPILS_TAB);
  assert.deepEqual(data.reference, {
    focalScaleMm: null,
    probeAngleDeg: null,
    paraxialEntrancePupilZ: z[model.state.lens.stop.surfaceIndex] + profiles.ep.paraxialEpZRelStop,
    paraxialExitPupilZ: last + profiles.xp.paraxialXpZRelLastSurf,
  });
  data.fields.forEach((field, at) => {
    const [ep, xp] = [profiles.ep.samples[at + 1], profiles.xp.samples[at + 1]];
    assert.equal(field.fieldAngleDeg, xp.fieldDeg);
    assert.deepEqual(field.figures, {
      realHeightMm: null,
      idealHeightMm: null,
      percent: null,
      entrancePupilZ: z[0] + geometry.epRatio + ep.epShiftMm,
      exitPupilZ: last + xp.xpZRelLastSurf,
    });
    assert.deepEqual(field.sampling, {
      chiefRayCorrection: ep.chiefRayCorrection,
      epShiftMm: ep.epShiftMm,
      xpShiftMm: xp.xpShiftMm,
    });
  });
  // The fake's solved chief ray beyond one degree is a thousandth higher a degree: its entrance pupil shifts.
  assert.ok(data.fields.every((field) => field.sampling.epShiftMm !== 0));
});

test("lateral colour is each line's channel of the section, with how far its indices are from the case's", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding, { lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725, 600] } });
  const data = dataOf(answerLvChief(api, model, { ...asksOf(binding, model)["lateral-colour"], lines: [0, 1, 2] }));
  const lateral = api.computeLateralColorCurve(lvChiefRequest(api, model))!;
  assert.equal(data.method.name, LV_LATERAL_COLOUR_SECTION);
  const channels = ["G", "R"];
  data.fields.forEach((field, at) => {
    const [line, index] = [Math.floor(at / 3), at % 3];
    assert.equal(field.line, line);
    if (line === 2) {
      assert.deepEqual([field.status, field.reason], ["unavailable", "lv-no-channel-at-line"]);
      return;
    }
    const sample = lateral.fields[index].samples.find((each) => each.channel === channels[line]);
    assert.equal(field.chiefLandingMm, sample?.imageHeightMm);
    assert.ok(field.sampling.indexMaxDelta > 0, "the fake's channels are not the case's anchored indices");
  });
});

/**
 * The binding's api with every function of LensVisualizer replaced by one that throws, but the two readings of a
 * lens itself: which line its channels are of (`lensChromaticReference`) and whether its projection is a fisheye.
 */
function unasked(api: LvBinding["api"]): LvBinding["api"] {
  const readings = new Set(["lensChromaticReference", "isFisheyeProjection"]);
  return Object.fromEntries(
    Object.entries(api).map(([name, value]) => [
      name,
      typeof value !== "function" || readings.has(name)
        ? value
        : () => {
            throw new Error(`LensVisualizer was asked ${name}`);
          },
    ]),
  ) as unknown as LvBinding["api"];
}

test("a spec the case refuses is answered unsupported before LensVisualizer is asked anything but readings", async (t) => {
  const binding = await bind(t, freshLv(t));
  const api = unasked(binding.api);
  const model = await modelOf(binding);
  const asks = asksOf(binding, model);
  assert.throws(() => answerLvChief(api, model, asks.distortion), /LensVisualizer was asked/);
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  const shifted = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } });
  for (const [refusedModel, spec, items] of [
    [photopic, asks.distortion, ["lines.not-authored-reference"]],
    [photopic, asks.pupils, ["lines.not-authored-reference"]],
    [photopic, { ...asks["lateral-colour"], lines: [0, 1] }, ["lines.not-chromatic-channels"]],
    [close, asks.pupils, ["object.finite"]],
    // A line the case does not have is refused before anything is read of it.
    [model, { ...asks.pupils, lines: [3] }, ["line"]],
    [model, { ...asks["lateral-colour"], lines: [0, 7] }, ["line"]],
    [close, { ...asks.distortion, lines: [2] }, ["object.finite", "line"]],
    [shifted, asks.distortion, ["focus.off-design"]],
    [shifted, asks.pupils, ["focus.off-design"]],
    // The lateral-colour section is not asked to find out that its plane is not the case's.
    [shifted, asks["lateral-colour"], ["focus.off-design"]],
  ] as const) {
    assert.deepEqual(itemsOf(answerLvChief(api, refusedModel, spec as ChiefNativeSpec)), items);
  }
});

test("fields other than the tab's own, and a lateral colour off the design plane, are unsupported", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const asks = asksOf(binding, model);
  for (const kind of ["distortion", "pupils", "lateral-colour"]) {
    const other = { ...asks[kind], fieldAnglesDeg: asks[kind].fieldAnglesDeg.slice(1) };
    assert.deepEqual(itemsOf(answerLvChief(binding.api, model, other)), ["fields.angles"], kind);
  }
  const shifted = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } });
  assert.deepEqual(itemsOf(answerLvChief(binding.api, shifted, asks["lateral-colour"])), ["focus.off-design"]);
});

test("the engine offers chief.native, answers it through the protocol, and states the tab it asked", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.capabilities.quantities["chief.native"], { version: 1 });
  const request = makeRequest({
    caseId: model.exported.id,
    quantity: "chief.native",
    spec: asksOf(binding, model).pupils,
  });
  const result = await adapter.run(request, model.exported);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.method, { name: "analysis-tabs", params: {} });
  assert.equal((result.data as ChiefNativeData).method.name, LV_PUPILS_TAB);
});

test("lv answers every ask of its own case source, where LensVisualizer launches some fields from a bounding sphere", async (t) => {
  // Beyond 12 degrees the fake launches a chief ray from a bounding sphere, which no rays.trace request states: the
  // case source leaves such a field out of its sets and its asks, and lv out of its answer, by one decision
  // (chiefFields.ts). The pupils tab and the lateral-colour section of the fake still present those fields.
  const lv = freshLv(t);
  const vector = variantOf(lv, "vector", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: 12 },"),
  });
  const binding = await bind(t, vector);
  const { api } = binding;
  for (const lines of [undefined, { kind: "explicit" as const, wavelengthsNm: [587.5618, 656.2725] }]) {
    const model = await modelOf(binding, lines === undefined ? {} : { lines });
    const made = lvChiefRaySets(api, model);
    assert.deepEqual(
      made.asks.map((ask) => [ask.kind, ask.fieldAnglesDeg]),
      [
        ["distortion", [5, 10]],
        ["pupils", [5, 10]],
        ["lateral-colour", [0, 10]],
      ],
    );
    // The tabs present more fields than the asks: the pupils tab five, the lateral-colour section three.
    const request = lvChiefRequest(api, model);
    assert.equal(api.computeBothPupilAberrationProfiles(request).xp.samples.length, 5);
    assert.equal(api.computeLateralColorCurve(request)!.fields.length, 3);
    for (const ask of made.asks) {
      const data = dataOf(answerLvChief(api, model, ask));
      assert.deepEqual(
        data.fields.map((field) => field.fieldAngleDeg),
        ask.lines.flatMap(() => ask.fieldAnglesDeg),
        ask.kind,
      );
      assert.ok(
        data.fields.every((field) => field.status === "ok" || field.status === "unavailable"),
        ask.kind,
      );
      assert.ok(
        data.fields.some((field) => field.status === "ok"),
        ask.kind,
      );
    }
  }
});
