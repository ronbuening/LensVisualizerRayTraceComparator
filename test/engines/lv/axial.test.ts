// `axial.native` of the engine `lv`, with no LensVisualizer: on the fake LV tree, whose spherical-aberration and
// axial-colour sections have LensVisualizer's names and numbers of their own. What is held here is what the engine asks
// of the sections and how it writes their numbers down; what the sections compute is the fake's, and LensVisualizer's
// own is tier 2.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { AxialNativeData, AxialNativeSpec } from "../../../src/contract/quantities/axialNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray, ndRow } from "../../../src/core/numeric/ndarray.ts";
import {
  LV_COLOUR_SECTION,
  LV_SPHERICAL_SECTION,
  answerLvAxial,
  lvChannelLines,
} from "../../../src/engines/lv/axial.ts";
import type { LvAxialAnswer } from "../../../src/engines/lv/axial.ts";
import { lvAxialRaySets } from "../../../src/engines/lv/axialRaySets.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvTabPupilSemiDiameter } from "../../../src/engines/lv/spotSetup.ts";
import type { LvElement } from "../../../src/engines/lv/types.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { axialNativeQuantity } from "../../../src/quantities/axialNative.ts";
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

function dataOf(answer: LvAxialAnswer): AxialNativeData {
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual(axialNativeQuantity.validateData(answer.data), []);
  return answer.data;
}

function itemsOf(answer: LvAxialAnswer): string[] {
  assert.ok("unsupported" in answer, JSON.stringify(answer));
  return answer.unsupported.map(({ item }) => item);
}

/** The request the sections are asked with: the drawer's, as the engine makes it. */
function sectionRequest(binding: LvBinding, model: LvCaseModel) {
  return binding.api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: lvTabPupilSemiDiameter(binding.api, model),
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
  });
}

test("spherical aberration is written down as the section has it: intercepts, best focus, RMS and the profile", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const [spherical] = lvAxialRaySets(binding.api, model).asks;
  const data = dataOf(answerLvAxial(binding.api, model, spherical));
  const request = sectionRequest(binding, model);
  const result = binding.api.computeSphericalAberration(request);
  assert.ok(result !== null);
  assert.equal(data.kind, "spherical");
  assert.equal(data.method.name, LV_SPHERICAL_SECTION);
  assert.equal(data.pupilRadiusMm, lvTabPupilSemiDiameter(binding.api, model));
  const [field] = data.fields;
  assert.deepEqual(
    [field.line, field.wavelengthNm, field.status, field.paraxialFocusZ, field.rays],
    [0, model.exported.conditions.lines[0].wavelengthNm, "ok", null, null],
  );
  const figures = field.figures!;
  assert.deepEqual(
    [figures.landingMm, figures.marginalFraction, figures.marginalInterceptZ, figures.nearAxisInterceptZ],
    [result.nearAxisImageHeight, result.marginalFraction, result.marginalRealIntercept, result.nearAxisRealIntercept],
  );
  assert.deepEqual([figures.bestFocusZ, figures.bestFocusRmsMm], [result.bestFocusZ, result.bestFocusRmsMm]);
  // One value a zone of the spec: the section's point, NaN where it has none.
  const points = binding.api.computeSAProfile(request);
  const profile = Array.from(decodeNdArray(figures.profileMm!).values as Float64Array);
  assert.equal(profile.length, spherical.kind === "spherical" ? spherical.profile.length : -1);
  assert.deepEqual(
    profile.filter((value) => !Number.isNaN(value)),
    points.map((point) => point.transverseSaMm),
  );
  assert.deepEqual(field.sampling, { raysArrived: result.validSampleCount, profilePoints: points.length });
});

test("axial colour is each line's channel of the section, with how far its indices are from the case's", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding, { lines: { kind: "cdf" } });
  const lines = model.exported.conditions.lines;
  assert.deepEqual(
    lines.map((line) => line.wavelengthNm),
    [587.5618, 656.2725, 486.1327],
  );
  const colour = lvAxialRaySets(binding.api, model).asks[1];
  const data = dataOf(answerLvAxial(binding.api, model, colour));
  const result = binding.api.computeLongitudinalChromaticFocus(sectionRequest(binding, model));
  assert.ok(result !== null);
  assert.equal(data.method.name, LV_COLOUR_SECTION);
  // The case's d, C and F lines are the section's channels G, R and B.
  const channels = ["G", "R", "B"];
  const table = decodeNdArray(model.exported.conditions.indexAfterSurface);
  data.fields.forEach((field, at) => {
    const sample = result.samples.find((each) => each.channel === channels[at])!;
    assert.deepEqual(field.figures, {
      landingMm: sample.imageHeightMm,
      marginalFraction: result.marginalFraction,
      marginalInterceptZ: sample.focusZ,
      nearAxisInterceptZ: null,
      bestFocusZ: null,
      bestFocusRmsMm: null,
      profileMm: null,
    });
    // The fake's channels trace a glass 1e-6 from the case's anchored index at the d line, and more at C and F.
    const traced = model.state.surfaces.map((surface, index) =>
      surface.nd === 1 ? 1 : model.state.lens.dispersion![index]!.indexAt(channels[at]),
    );
    const delta = Math.max(...traced.map((index, surface) => Math.abs(index - ndRow(table, at)[surface])));
    assert.deepEqual(field.sampling, { validChannels: result.validChannelCount, indexMaxDelta: delta });
    assert.ok(delta > 0);
  });
  assert.ok(data.notes.some((note) => note.includes("indices of its own")));
  // On a reference case, the one line is LensVisualizer's G channel (the fake's d line), and the spec asks it alone.
  const reference = await modelOf(binding);
  const one = dataOf(answerLvAxial(binding.api, reference, lvAxialRaySets(binding.api, reference).asks[1]));
  assert.deepEqual(
    one.fields.map((field) => field.figures?.marginalInterceptZ),
    [result.samples.find((each) => each.channel === "G")?.focusZ],
  );
});

test("the line of each channel is LensVisualizer's reference of the runtime lens's elements; a mix has none", () => {
  // A stand-in of LensVisualizer's lensChromaticReference, by its rule (a canary holds the line): every call is noted,
  // so that what it is asked is held too, the runtime lens's own elements and each of them alone.
  const asked: number[][] = [];
  const api = {
    chromaticChannelWavelengthsNm: { R: 656.2725, G: 587.5618, B: 486.1327, V: 435.8343 },
    eLineChannelWavelengthsNm: { R: 643.8469, G: 546.074, B: 479.9914, V: 435.8343 },
    lensChromaticReference: (elements: readonly LvElement[]) => {
      asked.push(elements.map((element) => element.id));
      return elements.length > 0 && elements.every((element) => element.indexReference === "e") ? "e" : "d";
    },
  } as unknown as Parameters<typeof lvChannelLines>[0];
  const modelWith = (references: (string | undefined)[]) =>
    ({
      runtime: {
        elements: references.map((indexReference, at) => ({
          id: at + 1,
          ...(indexReference === undefined ? {} : { indexReference }),
        })),
      },
      // The prepared state's lens is not read: its elements would include the rear plates.
      state: { lens: {} },
    }) as unknown as LvCaseModel;
  assert.equal(lvChannelLines(api, modelWith([undefined, "d"])), api.chromaticChannelWavelengthsNm);
  assert.deepEqual(asked, [[1, 2], [1], [2]]);
  assert.equal(lvChannelLines(api, modelWith(["e", "e"])), api.eLineChannelWavelengthsNm);
  assert.equal(lvChannelLines(api, modelWith(["e", undefined])), null);
  assert.equal(lvChannelLines(api, modelWith([undefined, "e"])), null);
});

test("what the sections do not present is unsupported: other lines, other zones, a finite object", async (t) => {
  const binding = await bind(t, freshLv(t));
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const [spherical, colour] = lvAxialRaySets(binding.api, photopic).asks;
  assert.deepEqual(itemsOf(answerLvAxial(binding.api, photopic, spherical)), ["lines.not-authored-reference"]);
  assert.deepEqual(itemsOf(answerLvAxial(binding.api, photopic, colour)), ["lines.not-chromatic-channels"]);
  const model = await modelOf(binding);
  const other = { ...spherical, profile: [0.5, 0.75] } as AxialNativeSpec;
  assert.deepEqual(itemsOf(answerLvAxial(binding.api, model, other)), ["pupil.fractions"]);
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  assert.deepEqual(itemsOf(answerLvAxial(binding.api, close, spherical)), ["object.finite"]);
  // A line of the case that is no channel is a line of the answer without figures.
  const cdf = await modelOf(binding, { lines: { kind: "explicit", wavelengthsNm: [587.5618, 600] } });
  const lines = dataOf(answerLvAxial(binding.api, cdf, { kind: "colour", lines: [0, 1], marginal: colour.marginal }));
  assert.deepEqual(
    lines.fields.map((field) => [field.status, field.reason]),
    [
      ["ok", undefined],
      ["unavailable", "lv-no-channel-at-line"],
    ],
  );
});

/**
 * The binding's api with every function of LensVisualizer replaced by one that throws, but the one that reads which
 * line a lens's channels are of from its elements (`lensChromaticReference`): nothing else may be asked of it.
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

test("a spec the case refuses is answered unsupported before LensVisualizer is asked anything but its channels' line", async (t) => {
  const binding = await bind(t, freshLv(t));
  const api = unasked(binding.api);
  const model = await modelOf(binding);
  const [spherical, colour] = lvAxialRaySets(binding.api, model).asks;
  assert.throws(() => answerLvAxial(api, model, spherical), /LensVisualizer was asked/);
  const photopic = await modelOf(binding, { lines: { kind: "photopic" } });
  const close = await modelOf(binding, { state: { focus: { kind: "focusT", value: 1 } } });
  for (const [refusedModel, spec, items] of [
    [photopic, spherical, ["lines.not-authored-reference"]],
    [photopic, { ...colour, lines: [0, 1] }, ["lines.not-chromatic-channels"]],
    [close, { ...colour, marginal: [0.5] }, ["object.finite", "pupil.fractions"]],
  ] as const) {
    assert.deepEqual(itemsOf(answerLvAxial(api, refusedModel, spec as AxialNativeSpec)), items);
  }
});

test("a case off the design plane is unsupported once the section says where its plane is", async (t) => {
  const binding = await bind(t, freshLv(t));
  const shifted = await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } });
  const [spherical, colour] = lvAxialRaySets(binding.api, shifted).asks;
  assert.deepEqual(itemsOf(answerLvAxial(binding.api, shifted, spherical)), ["focus.off-design"]);
  assert.deepEqual(itemsOf(answerLvAxial(binding.api, shifted, colour)), ["focus.off-design"]);
});

test("the engine offers axial.native, answers it through the protocol, and states the section it asked", async (t) => {
  const binding = await bind(t, freshLv(t));
  const model = await modelOf(binding);
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.capabilities.quantities["axial.native"], { version: 1 });
  const [spherical] = lvAxialRaySets(binding.api, model).asks;
  const request = makeRequest({ caseId: model.exported.id, quantity: "axial.native", spec: spherical });
  const result = await adapter.run(request, model.exported);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.method, { name: "analysis-tabs", params: {} });
  assert.equal((result.data as AxialNativeData).method.name, LV_SPHERICAL_SECTION);
});
