// `curvature.native` of the engine `lv`, with no LensVisualizer: on the fake LV tree, whose field-curve sections have
// LensVisualizer's names and numbers of their own. What is held here is what the engine asks of the sections and how
// it writes their numbers down; what the sections compute is the fake's, and LensVisualizer's own is tier 2.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { CurvatureNativeData, CurvatureNativeSpec } from "../../../src/contract/quantities/curvatureNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { LV_FIELD_CURVES, answerLvCurvature } from "../../../src/engines/lv/curvature.ts";
import type { LvCurvatureAnswer } from "../../../src/engines/lv/curvature.ts";
import { lvParabasalFraction } from "../../../src/engines/lv/curvatureFields.ts";
import { lvCurvatureRaySets } from "../../../src/engines/lv/curvatureRaySets.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvTabPupilSemiDiameter } from "../../../src/engines/lv/spotSetup.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { curvatureNativeQuantity } from "../../../src/quantities/curvatureNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";
const THREE_LINES: RunOptions = { lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725, 600] } };

async function modelOf(binding: LvBinding, options: RunOptions = {}): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(SINGLET, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return rebuilt.model;
}

function dataOf(answer: LvCurvatureAnswer): CurvatureNativeData {
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual(curvatureNativeQuantity.validateData(answer.data), []);
  return answer.data;
}

function itemsOf(answer: LvCurvatureAnswer): string[] {
  assert.ok("unsupported" in answer, JSON.stringify(answer));
  return answer.unsupported.map(({ item }) => item);
}

/** The ask of a model's own case source. */
function askOf(binding: LvBinding, model: LvCaseModel): CurvatureNativeSpec {
  const [ask] = lvCurvatureRaySets(binding.api, model).asks;
  assert.ok(ask !== undefined);
  return ask;
}

test("at the authored line the answer is the field curves as the sections present them, each field's own", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  const data = dataOf(answerLvCurvature(api, model, ask));
  const base = api.computeFieldCurvatureBundle(lvChiefRequest(api, model)).fieldCurvature!;
  assert.equal(data.method.name, LV_FIELD_CURVES);
  const parabasalFraction = lvParabasalFraction(lvTabPupilSemiDiameter(api, model));
  assert.equal(data.method.params.parabasalFraction, parabasalFraction);
  assert.deepEqual(
    data.fields.map((field) => [field.line, field.fieldAngleDeg, field.status]),
    base.curveFields.map((field) => [0, field.fieldAngleDeg, "ok"]),
  );
  data.fields.forEach((field, at) => {
    const own = base.curveFields[at];
    assert.equal(field.chiefLandingMm, own.chiefImageHeight);
    assert.equal(field.tangentialShiftMm, own.tangentialShiftMm);
    assert.equal(field.sagittalShiftMm, own.sagittalShiftMm);
    assert.deepEqual(field.sampling, {
      parabasalFraction,
      validSampleCount: own.validSampleCount,
      petzvalShiftMm: own.petzvalShiftMm,
      ...(own.diagnosticTangentialShiftMm === undefined
        ? {}
        : {
            realRayTangentialShiftMm: own.diagnosticTangentialShiftMm,
            realRaySagittalShiftMm: own.diagnosticSagittalShiftMm,
          }),
    });
  });
  assert.ok(data.fields.some((field) => field.sampling.realRayTangentialShiftMm !== undefined));
});

test("at a channel's line the answer is the chromatic field curves, without a landing and with the indices' distance", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const model = await modelOf(binding, THREE_LINES);
  const ask = askOf(binding, model);
  assert.deepEqual(ask.lines, [0, 1]);
  const data = dataOf(answerLvCurvature(api, model, { ...ask, lines: [0, 1, 2] }));
  const chromatic = api.computeFieldCurvatureBundle(lvChiefRequest(api, model)).chromaticFieldCurvature!;
  const fields = ask.fieldAnglesDeg.length;
  data.fields.forEach((field, at) => {
    const [line, index] = [Math.floor(at / fields), at % fields];
    assert.equal(field.line, line);
    if (line === 0) {
      assert.ok(field.chiefLandingMm !== null);
      return;
    }
    if (line === 2) {
      assert.deepEqual([field.status, field.reason], ["unavailable", "lv-no-channel-at-line"]);
      return;
    }
    const shift = chromatic.curveFields[index].chromaticFieldShifts!.find((each) => each.channel === "R")!;
    assert.deepEqual(
      [field.status, field.chiefLandingMm, field.tangentialShiftMm, field.sagittalShiftMm],
      ["ok", null, shift.tangentialShiftMm, shift.sagittalShiftMm],
    );
    assert.ok(field.sampling.indexMaxDelta > 0, "the fake's channels are not the case's anchored indices");
  });
  assert.ok(data.notes.some((note) => note.includes("state no landing")));
});

/**
 * The binding's api with every function of LensVisualizer replaced by one that throws, but the readings of a lens
 * itself: which line its channels are of (`lensChromaticReference`).
 */
function unasked(api: LvBinding["api"]): LvBinding["api"] {
  const readings = new Set(["lensChromaticReference"]);
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
  const ask = askOf(binding, model);
  assert.throws(() => answerLvCurvature(api, model, ask), /LensVisualizer was asked/);
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  const shifted = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } });
  for (const [refusedModel, spec, items] of [
    [photopic, { ...ask, lines: [0, 1] }, ["lines.not-traced"]],
    [close, ask, ["object.finite"]],
    // A line the case does not have is refused before anything is read of it.
    [model, { ...ask, lines: [0, 3] }, ["line"]],
    [close, { ...ask, lines: [4] }, ["object.finite", "line"]],
    [shifted, ask, ["focus.off-design"]],
  ] as const) {
    assert.deepEqual(itemsOf(answerLvCurvature(api, refusedModel, spec)), items);
  }
});

test("an angle of no field of the sections' is unsupported, and a field the sections cannot use is unavailable", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const model = await modelOf(binding);
  const ask = askOf(binding, model);
  // An angle a rounding off one of the sections' is no field of theirs; some of their fields, in any order, are.
  const other = { ...ask, fieldAnglesDeg: [ask.fieldAnglesDeg[1] * (1 + 2 ** -52)] };
  assert.deepEqual(itemsOf(answerLvCurvature(binding.api, model, other)), ["fields.angles"]);
  const some = { ...ask, fieldAnglesDeg: [ask.fieldAnglesDeg[2], ask.fieldAnglesDeg[0]] };
  assert.deepEqual(
    dataOf(answerLvCurvature(binding.api, model, some)).fields.map((field) => field.fieldAngleDeg),
    some.fieldAnglesDeg,
  );
  binding.close();
  // The fake's sections, made to find no foci at the edge: the field is the answer's, unavailable with their reason.
  const edge = variantOf(lv, "edge", {
    "src/optics/analysis/curvature.ts": (text) =>
      text.replace("if (focus === null) return empty;", "if (focus === null || fieldFraction === 1) return empty;"),
  });
  const bound = await bind(t, edge);
  const edgeModel = await modelOf(bound);
  const data = dataOf(answerLvCurvature(bound.api, edgeModel, askOf(bound, edgeModel)));
  const last = data.fields[data.fields.length - 1];
  assert.deepEqual([last.status, last.reason, last.chiefLandingMm], ["unavailable", "lv-field-unusable", null]);
});

test("lv answers every ask of its own case source, where LensVisualizer launches some fields from a bounding sphere", async (t) => {
  // Beyond 12 degrees the fake launches a field of its coma tab from a bounding sphere; its field curves launch every
  // field from the solved chief ray and the field's slope, as LensVisualizer's do: the ask is of every field, and lv
  // answers each, at the authored line and at a channel's.
  const lv = freshLv(t);
  const vector = variantOf(lv, "vector", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: 12 },"),
  });
  const binding = await bind(t, vector);
  const { api } = binding;
  for (const options of [{}, THREE_LINES]) {
    const model = await modelOf(binding, options);
    const ask = askOf(binding, model);
    assert.deepEqual(ask.fieldAnglesDeg, [0, 5, 10, 15, 20]);
    const data = dataOf(answerLvCurvature(api, model, ask));
    assert.deepEqual(
      data.fields.map((field) => field.fieldAngleDeg),
      ask.lines.flatMap(() => ask.fieldAnglesDeg),
    );
    assert.ok(data.fields.every((field) => field.status === "ok"));
  }
});

test("the engine offers curvature.native, answers it through the protocol, and states the sections it asked", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.capabilities.quantities["curvature.native"], { version: 1 });
  const request = makeRequest({ caseId: model.exported.id, quantity: "curvature.native", spec: askOf(binding, model) });
  const result = await adapter.run(request, model.exported);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.method, { name: "analysis-tabs", params: {} });
  assert.equal((result.data as CurvatureNativeData).method.name, LV_FIELD_CURVES);
});
