// `summary.native` of the engine `lv`, with no LensVisualizer: on the fake LV tree, whose summary tab, aperture control
// and paraxial kernel have LensVisualizer's names and rules of their own. What is held here is what the engine asks
// and how it writes the numbers down: the tab's readouts, its three f-numbers (LV #933) and the aperture control's
// marked one as LensVisualizer presents them, refusing before it asks anything what the case decides. LensVisualizer's own tab is tier 2
// (test/integration/lv/summary.test.ts).
import assert from "node:assert/strict";
import { test } from "node:test";

import { SUMMARY_NATIVE } from "../../../src/contract/quantities/summaryNative.ts";
import type { SummaryNativeData, SummaryNativeSpec } from "../../../src/contract/quantities/summaryNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvTabPupilSemiDiameter } from "../../../src/engines/lv/spotSetup.ts";
import {
  LV_SUMMARY_TAB,
  answerLvSummary,
  lvNominalFNumber,
  lvSummaryRequest,
  lvSummaryStopSemiDiameter,
} from "../../../src/engines/lv/summary.ts";
import type { LvSummaryAnswer } from "../../../src/engines/lv/summary.ts";
import { lvHookAperture } from "../../../src/engines/lv/tabRequest.ts";
import type { LvHookAperture } from "../../../src/engines/lv/tabRequest.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { summaryNativeQuantity } from "../../../src/quantities/summaryNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { FAKE_LENS_FILES, bind, freshLv, variantOf } from "./support.ts";

const [SINGLET_FILE] = FAKE_LENS_FILES.map(([file]) => file);

const SINGLET = "acme-singlet-50";
const ASK: SummaryNativeSpec = { lines: [0] };

async function modelOf(binding: LvBinding, options: RunOptions = {}, key = SINGLET): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return rebuilt.model;
}

function dataOf(answer: LvSummaryAnswer): SummaryNativeData {
  assert.ok("data" in answer, JSON.stringify(answer).slice(0, 400));
  assert.deepEqual(summaryNativeQuantity.validateData(answer.data), []);
  return answer.data;
}

function itemsOf(answer: LvSummaryAnswer): string[] {
  assert.ok("unsupported" in answer, JSON.stringify(answer).slice(0, 400));
  return answer.unsupported.map(({ item }) => item);
}

test("lv's answer is the summary tab's readouts and its three f-numbers, as LensVisualizer presents them", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  for (const options of [{}, { aperture: { kind: "f-number" as const, value: 5.6 } }]) {
    const model = await modelOf(binding, options);
    const [line] = dataOf(answerLvSummary(api, model, ASK)).lines;
    const request = lvSummaryRequest(api, model);
    const summary = api.computeOpticalSummary(request);
    // The tab's readouts, to the bit: its "Image-space f/#" is the contract's image-space f-number.
    assert.equal(line.focalLengthMm, summary.currentEFLMm);
    assert.equal(line.entrancePupilDiameterMm, summary.entrancePupilDiameterMm);
    assert.equal(line.stopDiameterMm, summary.physicalStopDiameterMm);
    assert.equal(line.imageSpaceFNumber, summary.imageSpaceFNumber);
    assert.equal(line.totalTrackMm, summary.totalTrackMm);
    assert.equal(line.halfFieldDeg, summary.halfFieldDeg);
    assert.equal(
      line.rearFocalZ,
      (api.computeCardinalElementsFromState(model.state) as { points: { rearFocal: { z: number } } }).points.rearFocal
        .z,
    );
    // At infinity focus the tab's two working f-numbers are of the case's own axial object point: stated.
    assert.equal(line.paraxialWorkingFNumber, summary.paraxialWorkingFNumber);
    assert.equal(line.workingFNumber, (summary.workingFNumber as { value: number }).value);
    assert.equal(line.workingFNumber, (line.imageSpaceFNumber! * 33) / 32, "the fake's own working f-number");
    assert.ok(!("lvThinLensEffectiveFNumber" in line.sampling), "the thin-lens eff. f/ is gone");
    // The drawer's request: the hook's focal length of the state and the hook's pupil for the case's stop.
    assert.equal(request.dynamicEFL, api.computeFocusEFL(request));
    assert.equal(request.aperture.entrancePupilSemiDiameterMm, lvTabPupilSemiDiameter(api, model));
    // The aperture control's mark: the slider's f-number wide open, and otherwise the rule's taken back from the stop.
    const hook = lvHookAperture(api, model.runtime, model.state);
    const { referenceFocalLengthMm, stopHeightRatio } = api.stopRuleGeometry(model.runtime, model.state.zoomT);
    const marked =
      options.aperture === undefined
        ? hook.fNumber
        : Math.abs(referenceFocalLengthMm * stopHeightRatio) / (2 * model.exported.conditions.stopSemiDiameter);
    assert.equal(line.nominalFNumber, marked);
    if (options.aperture !== undefined) assert.ok(Math.abs(marked - 5.6) < 1e-12, String(marked));
    assert.equal(line.wavelengthNm, model.exported.conditions.lines[0].wavelengthNm);
    assert.equal(line.sampling.wideOpenNominalEntrancePupilDiameterMm, 2 * api.epAtZoomClamped(0, model.runtime));
    assert.ok(!("focusDistanceM" in line.sampling), "at infinity the tab has no focus distance");
  }
});

test("at a focus station the working f-numbers are of another object point than the case's: recorded, not stated", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  const [line] = dataOf(answerLvSummary(binding.api, model, ASK)).lines;
  // The fake's own rules: a focus distance of 0.5 m over the focus position, a paraxial working f-number twice the
  // image-space one there, and the working one 33/32 of that.
  assert.equal(line.sampling.focusDistanceM, 0.5);
  assert.equal(line.paraxialWorkingFNumber, null);
  assert.equal(line.workingFNumber, null);
  assert.equal(line.sampling.lvParaxialWorkingFNumberAtParaxialObject, 2 * line.imageSpaceFNumber!);
  assert.equal(line.sampling.lvWorkingFNumberAtParaxialObject, (2 * line.imageSpaceFNumber! * 33) / 32);
  assert.equal(line.imageSpaceFNumber, Math.abs(line.focalLengthMm!) / line.entrancePupilDiameterMm!);
});

test("a vignetted marginal ray has no working f-number, and the surface that stops it is recorded", async (t) => {
  const lv = variantOf(freshLv(t), "vignetted", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", 'focusTravel: 5,\n  mtf: { axialVignettingLabel: "2" },'),
  });
  const binding = await bind(t, lv);
  const model = await modelOf(binding);
  const [line] = dataOf(answerLvSummary(binding.api, model, ASK)).lines;
  assert.equal(line.workingFNumber, null);
  assert.notEqual(line.paraxialWorkingFNumber, null);
  assert.equal(line.sampling.lvMarginalRayVignettedSurfaceIndex, 1);
  assert.equal(line.sampling.lvMarginalRayVignettedBeforeStop, 0);
});

test("the hook's stop and marked f-number of a case's stop", () => {
  const hook: LvHookAperture = {
    currentFOPEN: 2,
    fNumber: 2,
    wideOpenStopSD: 10,
    currentPhysStopSD: 10 + 2 ** -49,
    baseEPSD: 12,
    currentEPSD: 12,
  };
  const api = { stopRuleGeometry: () => ({ referenceFocalLengthMm: 50, stopHeightRatio: 0.8 }) };
  const runtime = {} as Parameters<typeof lvNominalFNumber>[1];
  // Wide open, the hook's own stop, where the slider's widest f-number lies above the zoom position's.
  assert.equal(lvSummaryStopSemiDiameter(hook, 10), 10 + 2 ** -49);
  assert.equal(lvSummaryStopSemiDiameter(hook, 5), 5);
  assert.equal(lvNominalFNumber(api, runtime, 0, hook, 10), 2);
  assert.equal(lvNominalFNumber(api, runtime, 0, hook, 10 + 2 ** -49), 2);
  // Otherwise the rule's f-number taken back from the radius: |F rho| / (2 radius).
  assert.equal(lvNominalFNumber(api, runtime, 0, hook, 5), 4);
  assert.equal(lvNominalFNumber(api, runtime, 0, hook, 2.5), 8);
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
  assert.throws(() => answerLvSummary(api, model, ASK), /LensVisualizer was asked/);
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const shifted = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } });
  const folded = await modelOf(binding, {}, "zz-folded-mirror");
  for (const [refusedModel, spec, items] of [
    [photopic, { lines: [0, 1] }, ["lines.not-authored-reference"]],
    // A folded path's image plane is its prepared state's, which the tab reads: refused for its path alone.
    [folded, ASK, ["path.folded"]],
    // A line the case does not have is refused before anything is read of it.
    [model, { lines: [0, 3] }, ["line"]],
    [shifted, ASK, ["focus.off-design"]],
  ] as const) {
    assert.deepEqual(itemsOf(answerLvSummary(api, refusedModel, spec)), items);
  }
});

test("the engine lv offers summary.native, answers it through the protocol, and states the tab it asked", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.capabilities.quantities[SUMMARY_NATIVE], { version: 1 });
  const request = makeRequest({ caseId: model.exported.id, quantity: SUMMARY_NATIVE, spec: ASK });
  const result = await adapter.run(request, model.exported);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.method, { name: "analysis-tabs", params: {} });
  assert.equal((result.data as SummaryNativeData).method.name, LV_SUMMARY_TAB);
});
