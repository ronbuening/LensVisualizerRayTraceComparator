// `mtf.native` of the engine `lv` against the fake LV tree: no LensVisualizer is needed. The fake has a "product
// MTF" and an "MTF tab" of its own, with LV's names: its curves are a closed form of the request, so what the engine
// asked shows in what comes back, and its defaults are none of LensVisualizer's. Its numbers describe no real lens.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import {
  LV_DEFAULT_GRID_CAP,
  LV_GRID_CAPS,
  LV_MTF_SPECTRA,
  LV_MTF_UNSUPPORTED,
  answerLvMtf,
  lvSpectrumOf,
} from "../../../src/engines/lv/mtf.ts";
import type { LvMtfApi } from "../../../src/engines/lv/mtf.ts";
import { createLvTabProfileResolver } from "../../../src/engines/lv/tabProfile.ts";
import type { LvTabProfileResolution } from "../../../src/engines/lv/tabProfile.ts";
import { LV_TAB_PROFILE } from "../../../src/engines/lv/tabRequest.ts";
import type { LvMtfOptions, LvMtfResult } from "../../../src/engines/lv/types.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { FAKE_LENS_FILES, bind, freshLv, variantOf } from "./support.ts";

const [SINGLET_FILE, ZOOM_FILE] = FAKE_LENS_FILES.map(([file]) => file);
const SINGLET = "acme-singlet-50";
const ZOOM = "acme-zoom-24-48";
const DOUBLET = "zenith-doublet-100";

/** Three fields at 10 and 30 cycles/mm: geometric, on the plane of the case, by no profile. */
const SPEC: MtfNativeSpec = {
  frequenciesPerMm: [10, 30],
  fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
  method: "geometric",
  focus: "design",
};

/** The singlet with an entrance pupil that is not its stop: a ray is 0.8 as high at the stop as at the pupil. */
function withPupil(lv: string, name = "pupil"): string {
  return variantOf(lv, name, {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  pupilRatio: 0.8,"),
  });
}

/** The case of a lens of a bound tree under a run's options, and its model as the engine holds it. */
async function modelOf(
  binding: LvBinding,
  key: string,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  return { opticalCase: exported.opticalCase, model: await modelOfCase(binding, exported.opticalCase) };
}

async function modelOfCase(binding: LvBinding, opticalCase: OpticalCase): Promise<LvCaseModel> {
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return rebuilt.model;
}

/** The profile's case and spec for a lens of a bound tree. */
async function tabOf(
  binding: LvBinding,
  lensKey: string,
  view: "wide-open" | "f8-comparison" = "wide-open",
  zoomT = 0,
): Promise<Extract<LvTabProfileResolution, { ok: true }>> {
  const resolved = await createLvTabProfileResolver(binding)({ lensKey, zoomT, view });
  assert.ok(resolved.ok, JSON.stringify(resolved));
  return resolved;
}

/** The engine `lv` on a bound tree, behind an adapter, as a run reaches it; closed when the test ends. */
function engineOn(t: TestContext, binding: LvBinding): RemoteEngineAdapter {
  const adapter = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  t.after(() => adapter.close());
  return adapter;
}

function ask(
  engine: RemoteEngineAdapter,
  opticalCase: OpticalCase,
  spec: MtfNativeSpec,
  engineOptions?: JsonObject,
): Promise<ResultEnvelope> {
  return engine.run(makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec, engineOptions }), opticalCase);
}

/** The data of an "ok" answer, checked as the orchestrator checks it before it stores it. */
function dataOf(result: ResultEnvelope): MtfNativeData {
  assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, result.data), []);
  return result.data as MtfNativeData;
}

function curve(wire: NdArrayWire): number[] {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return [...decoded.values];
}

/** The API of a binding with its `computeMtf` watched: every request it was made with, in order. */
function watched(binding: LvBinding): { api: LvMtfApi; asked: LvMtfOptions[] } {
  const asked: LvMtfOptions[] = [];
  const computeMtf = (state: LvCaseModel["state"], options: LvMtfOptions): LvMtfResult => {
    asked.push(options);
    return binding.api.computeMtf(state, options);
  };
  return { api: { ...binding.api, computeMtf }, asked };
}

/** The fake's curves: a straight fall to a cutoff that is the method's and the stop's, lowered with the field. */
function fakeCurves(
  method: "geometric" | "diffraction",
  stop: number,
  fraction: number,
  frequencies: readonly number[],
): { sagittal: number[]; tangential: number[] } {
  const cutoff = (method === "diffraction" ? 32 : 64) * stop;
  const fall = 1 - fraction / 4;
  return {
    sagittal: frequencies.map((frequency) => Math.max(0, 1 - frequency / cutoff) * fall),
    tangential: frequencies.map((frequency) => Math.max(0, 1 - frequency / cutoff) * fall * fall),
  };
}

// ── Without a profile ────────────────────────────────────────────────────────────────────────────────────────────

test("without a profile the request is the spec's, with the stop of the case and the seed the tab's hook would hand over", async (t) => {
  const binding = await bind(t, withPupil(freshLv(t)));
  const { model } = await modelOf(binding, SINGLET);
  const { api, asked } = watched(binding);
  const answer = answerLvMtf(api, model, SPEC);
  assert.ok("data" in answer, JSON.stringify(answer));

  // The iris is 6.25 mm wide open and the pupil 6.25 / 0.8: the seed is the pupil, never the stop radius.
  assert.deepEqual(asked, [
    {
      method: "geometric",
      spectrum: "reference",
      focus: "design",
      pupilSemiDiameterMm: 7.8125,
      stopSemiDiameterMm: 6.25,
      movementActive: false,
      maxGridSize: 128,
      fieldFractions: [0, 0.5, 1],
      frequenciesPerMm: [10, 30],
    },
  ]);
  assert.equal(LV_DEFAULT_GRID_CAP, 128);

  const { data } = answer;
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  // The fake images 0.5 mm a degree and models 20 degrees: its 100 % field is 10 mm off the axis.
  assert.deepEqual(
    data.fields.map(({ field, fieldAngleDeg, imageHeightMm, status, reason }) => [
      field,
      fieldAngleDeg,
      imageHeightMm,
      status,
      reason,
    ]),
    [
      [0, 0, 0, "ok", undefined],
      [0.5, 10, 5, "ok", undefined],
      [1, 20, 10, "ok", undefined],
    ],
  );
  for (const field of data.fields) {
    const expected = fakeCurves("geometric", 6.25, field.field, SPEC.frequenciesPerMm);
    assert.deepEqual(curve(field.sagittal), expected.sagittal);
    assert.deepEqual(curve(field.tangential), expected.tangential);
    assert.deepEqual(field.sampling, {
      gridSize: 32,
      validRays: 800,
      blockedRays: 224,
      failedRays: 0,
      unknownFluxFraction: 0,
      maxDelta: 0.00390625,
      convergedThroughLpMm: 30,
    });
  }
  assert.deepEqual(curve(data.fields[1].sagittal), [0.975 * 0.875, 0.925 * 0.875]);
  assert.deepEqual(data.method, {
    name: "geometric",
    params: {
      spectrum: "reference",
      focus: "design",
      maxGridSize: 128,
      pupilSemiDiameterMm: 7.8125,
      stopSemiDiameterMm: 6.25,
      referenceHeightMm: 10,
      fieldBasis: "modeled-edge",
    },
  });
  assert.deepEqual(data.focus, { mode: "design", appliedShiftMm: 0 });
  // The fake "traces" the f-number of its image distance over the seed; its iris is surface 2, and limits the beam.
  assert.deepEqual(data.aperture, { tracedFNumber: 52.5 / 15.625, limitingSurfaceIndex: 2 });
  assert.deepEqual(data.lines, [{ wavelengthNm: 587.5618, weight: 1 }]);
  assert.deepEqual(data.notes, []);
  assert.deepEqual(answer.counts, { fields: 3, frequencies: 2, unavailableFields: 0 });
});

test("a stopped-down case is asked with its own stop radius and the hook's seed for that radius", async (t) => {
  const binding = await bind(t, withPupil(freshLv(t)));
  // The fake opens at f/2: at f/4 the stop is 6.25 x 2 / 4, and the hook's pupil for it 7.8125 x 2 / 4.
  const { model } = await modelOf(binding, SINGLET, { aperture: { kind: "f-number", value: 4 } });
  const { api, asked } = watched(binding);
  const answer = answerLvMtf(api, model, SPEC);
  assert.ok("data" in answer);
  assert.deepEqual(
    [asked[0].stopSemiDiameterMm, asked[0].pupilSemiDiameterMm],
    [3.125, (7.8125 * 2) / ((6.25 * 2) / 3.125)],
  );
  assert.equal(asked[0].pupilSemiDiameterMm, 3.90625);
  assert.deepEqual(curve(answer.data.fields[0].sagittal), fakeCurves("geometric", 3.125, 0, [10, 30]).sagittal);
});

test("engine-best is LensVisualizer's best axial focus, and the answer says the shift it applied; lvGridCap caps the grid", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { opticalCase } = await modelOf(binding, SINGLET);
  const engine = engineOn(t, binding);
  const spec: MtfNativeSpec = { ...SPEC, method: "diffraction", focus: "engine-best" };
  const result = await ask(engine, opticalCase, spec, { lvGridCap: 64 });
  const data = dataOf(result);
  assert.deepEqual(result.method, { name: "product-mtf", params: {} });
  assert.deepEqual(result.diagnostics.counts, {
    surfaces: 3,
    lines: 1,
    fields: 3,
    frequencies: 2,
    unavailableFields: 0,
  });
  assert.equal(data.method.name, "diffraction");
  assert.deepEqual(
    [data.method.params.focus, data.method.params.maxGridSize, data.method.params.spectrum],
    ["best-axial", 64, "reference"],
  );
  // The fake's best focus lies a 128th of the stop radius in front of the design plane.
  assert.deepEqual(data.focus, { mode: "best-axial", appliedShiftMm: -6.25 / 128 });
  assert.deepEqual(curve(data.fields[2].tangential), fakeCurves("diffraction", 6.25, 1, [10, 30]).tangential);

  // The same request twice is the same answer: the engine says it is deterministic.
  assert.deepEqual(await ask(engine, opticalCase, spec, { lvGridCap: 64 }), result);

  assert.deepEqual(LV_GRID_CAPS, [32, 64, 128, 256]);
  for (const cap of [48, "64", null]) {
    const refused = await ask(engine, opticalCase, spec, { lvGridCap: cap });
    assert.deepEqual(refused.unsupported, [
      {
        code: "option",
        item: "lvGridCap",
        message: `lvGridCap is ${JSON.stringify(cap)}: LensVisualizer caps its grid at 32, 64, 128, 256`,
      },
    ]);
  }
});

// ── The spectrum ─────────────────────────────────────────────────────────────────────────────────────────────────

test("the spectrum is the one of LensVisualizer whose lines the case has; any other line set is unsupported", async (t) => {
  const binding = await bind(t, freshLv(t));
  const engine = engineOn(t, binding);
  assert.deepEqual(LV_MTF_SPECTRA, ["reference", "cdf", "photopic"]);
  for (const spectrum of LV_MTF_SPECTRA) {
    const { opticalCase, model } = await modelOf(binding, ZOOM, { lines: { kind: spectrum } });
    const probe = {
      method: "geometric",
      spectrum: "reference",
      focus: "design",
      pupilSemiDiameterMm: 3,
      stopSemiDiameterMm: 3,
    };
    assert.equal(lvSpectrumOf(binding.api, model.state, probe, opticalCase.conditions.lines), spectrum);
    const data = dataOf(await ask(engine, opticalCase, SPEC));
    assert.equal(data.method.params.spectrum, spectrum);
    // The lines of the answer are LensVisualizer's for the spectrum, which are those of the case.
    assert.deepEqual(
      data.lines,
      opticalCase.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
    );
    // The fake counts 800 rays a line: every line of the spectrum was "traced".
    assert.equal(data.fields[0].sampling.validRays, 800 * opticalCase.conditions.lines.length);
  }

  const custom = await modelOf(binding, ZOOM, { lines: { kind: "explicit", wavelengthsNm: [600, 500] } });
  assert.equal(
    lvSpectrumOf(
      binding.api,
      custom.model.state,
      { method: "geometric", spectrum: "reference", focus: "design", pupilSemiDiameterMm: 3, stopSemiDiameterMm: 3 },
      custom.opticalCase.conditions.lines,
    ),
    null,
  );
  const refused = await ask(engine, custom.opticalCase, SPEC);
  assert.equal(refused.status, "unsupported");
  assert.deepEqual(refused.unsupported, [
    {
      code: "feature",
      item: "lines.custom-spectrum",
      message:
        "LensVisualizer's MTF has the spectra reference, cdf, photopic and no other: " +
        "the lines of the case (600, 500 nm) are none of them",
    },
  ]);
  assert.equal(LV_MTF_UNSUPPORTED.customSpectrum, "lines.custom-spectrum");

  // The reference wavelength asked for by number is traced with anchored indices, which is not the reference
  // spectrum: LensVisualizer traces that one with the indices of the prescription.
  const anchored = await modelOf(binding, ZOOM, { lines: { kind: "explicit", wavelengthsNm: [587.5618] } });
  assert.equal(anchored.opticalCase.conditions.lines[0].indexSource, "anchored");
  assert.equal((await ask(engine, anchored.opticalCase, SPEC)).unsupported?.[0].item, "lines.custom-spectrum");
});

// ── What LensVisualizer's MTF does not compute ───────────────────────────────────────────────────────────────────

test("a shifted image plane, fields as angles, an unknown profile: each is unsupported, and says why", async (t) => {
  const binding = await bind(t, freshLv(t));
  const engine = engineOn(t, binding);
  const design = await modelOf(binding, SINGLET);

  const shifted = await modelOf(binding, SINGLET, { imagePlane: { kind: "shift", mm: 0.25 } });
  for (const focus of ["design", "engine-best"] as const) {
    assert.deepEqual((await ask(engine, shifted.opticalCase, { ...SPEC, focus })).unsupported, [
      {
        code: "feature",
        item: "image-plane.shifted",
        message:
          "LensVisualizer's MTF is of its design image plane or of its own best axial focus, and of no plane it " +
          "is given: the image plane of the case lies 0.25 mm from the design plane",
      },
    ]);
  }

  const angles: MtfNativeSpec = { ...SPEC, fields: { kind: "angles-deg", values: [0, 10] } };
  assert.deepEqual((await ask(engine, design.opticalCase, angles)).unsupported, [
    {
      code: "option",
      item: "fields.angles-deg",
      message: "LensVisualizer's MTF takes its fields as fractions of its reference image height, not as angles",
    },
  ]);

  assert.deepEqual((await ask(engine, design.opticalCase, { ...SPEC, profile: "zemax-default" })).unsupported, [
    {
      code: "option",
      item: "profile",
      message: 'the engine has no profile "zemax-default": its one profile is lv-tab-default',
    },
  ]);

  // A spec that is not the quantity's is an error, as for every quantity.
  const descending = await ask(engine, design.opticalCase, { ...SPEC, frequenciesPerMm: [30, 10] });
  assert.equal(descending.error?.code, "bad-spec");
});

test("more fields or frequencies than LensVisualizer takes in one request are unsupported, with its gate's message", async (t) => {
  const binding = await bind(t, freshLv(t));
  const engine = engineOn(t, binding);
  const { opticalCase } = await modelOf(binding, SINGLET);
  // The fake takes 8 fields, 12 frequencies and 400 cycles/mm in one request. The engine restates no limit: it
  // asks the gate with the spec's fields, then with its frequencies, and passes on what the gate says.
  const said = "MTF requires fields and image-space frequencies within its limits.";
  const fractions = (count: number): MtfNativeSpec["fields"] => ({
    kind: "image-height-fractions",
    values: Array.from({ length: count }, (_unused, index) => index / (count - 1)),
  });
  const steps = (count: number, step: number) => Array.from({ length: count }, (_unused, index) => step * index);

  assert.deepEqual((await ask(engine, opticalCase, { ...SPEC, fields: fractions(9) })).unsupported, [
    {
      code: "option",
      item: "fields.limits",
      message: `LensVisualizer's MTF does not take the 9 fields of the spec in one request: ${said}`,
    },
  ]);
  assert.deepEqual((await ask(engine, opticalCase, { ...SPEC, frequenciesPerMm: steps(13, 10) })).unsupported, [
    {
      code: "option",
      item: "frequenciesPerMm.limits",
      message:
        "LensVisualizer's MTF does not take the 13 frequencies of the spec, up to 120 cycles/mm, in one request: " +
        said,
    },
  ]);
  const high = await ask(engine, opticalCase, { ...SPEC, frequenciesPerMm: [10, 500] });
  assert.deepEqual(
    high.unsupported?.map(({ code, item }) => [code, item]),
    [["option", "frequenciesPerMm.limits"]],
  );
  assert.match(high.unsupported?.[0].message ?? "", /the 2 frequencies of the spec, up to 500 cycles\/mm, in one/);
  assert.deepEqual(
    [LV_MTF_UNSUPPORTED.fieldLimits, LV_MTF_UNSUPPORTED.frequencyLimits],
    ["fields.limits", "frequenciesPerMm.limits"],
  );

  // At the fake's limits the request is answered.
  const most: MtfNativeSpec = { ...SPEC, fields: fractions(8), frequenciesPerMm: [...steps(11, 10), 400] };
  const data = dataOf(await ask(engine, opticalCase, most));
  assert.equal(data.fields.length, 8);
  assert.equal(curve(data.fields[7].sagittal).length, 12);
});

test("a state LensVisualizer's own gate refuses is answered as the gate does, with its reason, whatever is asked", async (t) => {
  const lv = variantOf(freshLv(t), "unverified", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  unverifiedScale: true,"),
  });
  const binding = await bind(t, lv);
  // Such a lens has a case on its reference line and on no other: LensVisualizer gives no index at another line.
  const { opticalCase } = await modelOf(binding, SINGLET);
  const refusal = [
    {
      code: "feature",
      item: "unverified-scale",
      message: "Prescription scale needs verification before reporting lp/mm.",
    },
  ];
  const engine = engineOn(t, binding);
  assert.deepEqual((await ask(engine, opticalCase, SPEC)).unsupported, refusal);
  // The gate comes first: an angle or an unknown profile in the spec does not change the answer.
  const other: MtfNativeSpec = { ...SPEC, fields: { kind: "angles-deg", values: [0] }, profile: "zemax-default" };
  assert.deepEqual((await ask(engine, opticalCase, other)).unsupported, refusal);

  // The profile makes the case such a lens has, and the engine answers it the same way.
  const tab = await tabOf(binding, SINGLET);
  assert.equal(tab.opticalCase.id, opticalCase.id);
  assert.deepEqual((await ask(engine, tab.opticalCase, tab.spec)).unsupported, refusal);
});

test("a request LensVisualizer calls invalid, and an answer that is not one to the request, are failures of the engine", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { opticalCase, model } = await modelOf(binding, SINGLET);
  const invalid: LvMtfApi = {
    ...binding.api,
    assessMtfSupport: (state, options) => ({
      ...binding.api.assessMtfSupport(state, options),
      available: false,
      reason: "invalid-input",
      message: "MTF requires an explicit image-plane focus mode.",
    }),
  };
  assert.throws(() => answerLvMtf(invalid, model, SPEC), {
    message:
      "LensVisualizer refuses the engine's own MTF request (invalid-input): " +
      "MTF requires an explicit image-plane focus mode.",
  });

  const bent = (change: (result: LvMtfResult) => LvMtfResult): LvMtfApi => ({
    ...binding.api,
    computeMtf: (state, options) => change(binding.api.computeMtf(state, options)),
  });
  const pending = bent((result) => ({
    ...result,
    fields: result.fields.map((field) => ({ ...field, status: "pending" })),
  }));
  assert.throws(() => answerLvMtf(pending, model, SPEC), { message: "LensVisualizer left the field 0 pending" });
  const fewer = bent((result) => ({ ...result, fields: result.fields.slice(1) }));
  assert.throws(() => answerLvMtf(fewer, model, SPEC), { message: "LensVisualizer answers 3 fields with 2" });
  const swapped = bent((result) => ({ ...result, fields: result.fields.toReversed() }));
  assert.throws(() => answerLvMtf(swapped, model, SPEC), {
    message: "LensVisualizer answers the field 0 with the field 1",
  });
  const short = bent((result) => ({
    ...result,
    fields: result.fields.map((field) => ({ ...field, sagittal: field.sagittal.slice(1) })),
  }));
  assert.throws(() => answerLvMtf(short, model, SPEC), {
    message: "LensVisualizer's sagittal curve of the field 0 has 1 values",
  });
  const others = bent((result) => ({ ...result, frequenciesPerMm: [10, 20] }));
  assert.throws(
    () => answerLvMtf(others, model, SPEC),
    /^Error: LensVisualizer answers 2 frequencies where 2 were asked/,
  );

  // Through the engine such a throw is a result of status "error", as for every quantity.
  const broken = variantOf(freshLv(t), "broken", {
    "src/optics/analysis/mtf.ts": (text) =>
      text.replace('status: unsettled ? "unconverged" : "converged"', 'status: "pending"'),
  });
  binding.close();
  const brokenBinding = await bind(t, broken);
  const again = await modelOf(brokenBinding, SINGLET);
  const failed = await ask(engineOn(t, brokenBinding), again.opticalCase, SPEC);
  assert.deepEqual(failed.error, { code: "engine-failure", message: "LensVisualizer left the field 0 pending" });
  assert.equal(again.opticalCase.id, opticalCase.id);
});

// ── Status and what LensVisualizer says of a field ───────────────────────────────────────────────────────────────

test("converged is ok, unconverged keeps its curves, and an unavailable field is NaN with LensVisualizer's reason", async (t) => {
  // A format corner beyond the modeled edge, a height without a chief-ray angle, a field whose sampling does not
  // settle, one whose chief ray is clipped, and an axial beam that a lens surface limits.
  const lv = variantOf(freshLv(t), "statuses", {
    [SINGLET_FILE]: (text) =>
      text.replace(
        "focusTravel: 5,",
        "focusTravel: 5,\n  field: { referenceHeightMm: 12.5, unsolvedFraction: 0.4 },\n" +
          '  mtf: { unconvergedFraction: 0.2, clippedChiefFraction: 0.6, limitingSurfaceLabel: "2" },',
      ),
  });
  const binding = await bind(t, lv);
  const { opticalCase } = await modelOf(binding, SINGLET);
  const values = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const spec: MtfNativeSpec = { ...SPEC, fields: { kind: "image-height-fractions", values } };
  const result = await ask(engineOn(t, binding), opticalCase, spec);
  const data = dataOf(result);
  assert.deepEqual(
    data.fields.map(({ field, fieldAngleDeg, imageHeightMm, status, reason }) => [
      field,
      fieldAngleDeg,
      imageHeightMm,
      status,
      reason,
    ]),
    [
      [0, 0, 0, "ok", undefined],
      [0.2, 5, 2.5, "unconverged", undefined],
      [0.4, null, null, "unavailable", "chief-ray-failed"],
      [0.6, 15, 7.5, "ok", undefined],
      [0.8, 20, 10, "ok", undefined],
      [1, null, null, "unavailable", "outside-modeled-field"],
    ],
  );
  for (const field of data.fields) {
    const expected = fakeCurves("geometric", 6.25, field.field, SPEC.frequenciesPerMm);
    if (field.status === "unavailable") {
      assert.deepEqual(curve(field.sagittal), [NaN, NaN]);
      assert.deepEqual(curve(field.tangential), [NaN, NaN]);
    } else {
      assert.deepEqual(curve(field.sagittal), expected.sagittal);
      assert.deepEqual(curve(field.tangential), expected.tangential);
    }
  }
  // An unconverged field ran to the grid cap, and has no frequency its sampling is settled through; a field that
  // was not traced has the counts LensVisualizer gives it, which are none.
  assert.deepEqual(data.fields[1].sampling, {
    gridSize: 128,
    validRays: 800,
    blockedRays: 224,
    failedRays: 0,
    unknownFluxFraction: 0,
    maxDelta: 0.03125,
  });
  assert.deepEqual(data.fields[5].sampling, {
    gridSize: 0,
    validRays: 0,
    blockedRays: 0,
    failedRays: 0,
    unknownFluxFraction: 0,
  });
  assert.deepEqual(data.notes, [
    "field 0.2: Sampling has not converged within 0.01 MTF.",
    "field 0.4: No valid chief ray reaches this image height.",
    "field 0.6: A clear aperture stops the chief ray at this height.",
    "field 1: Outside the modeled field: beyond 10.0 mm.",
  ]);
  assert.deepEqual([data.method.params.referenceHeightMm, data.method.params.fieldBasis], [12.5, "format-corner"]);
  // The surface labelled 2 is the second of the case.
  assert.equal(data.aperture.limitingSurfaceIndex, 1);
  assert.equal(opticalCase.system.surfaces[1].label, "2");
  assert.equal(result.diagnostics.counts.unavailableFields, 2);
});

test("a limiting surface whose label two surfaces share is named in a note, and by no index", async (t) => {
  const lv = variantOf(freshLv(t), "twins", {
    [SINGLET_FILE]: (text) =>
      text
        .replace('{ label: "1", R: 50', '{ label: "2", R: 50')
        .replace("focusTravel: 5,", 'focusTravel: 5,\n  mtf: { limitingSurfaceLabel: "2" },'),
  });
  const binding = await bind(t, lv);
  const { opticalCase } = await modelOf(binding, SINGLET);
  const data = dataOf(await ask(engineOn(t, binding), opticalCase, SPEC));
  assert.deepEqual(Object.keys(data.aperture), ["tracedFNumber"]);
  assert.deepEqual(data.notes, ["the axial beam is limited by a surface labelled 2, which 2 surfaces are"]);
});

// ── The profile ──────────────────────────────────────────────────────────────────────────────────────────────────

test("lv-tab-default: the request is the tab's, built from LensVisualizer's own defaults, and the answer says which", async (t) => {
  const binding = await bind(t, freshLv(t));
  const tab = await tabOf(binding, ZOOM, "wide-open", 1);
  // The fake's tab opens with 25 % steps and draws 20 and 40 cycles/mm of the six frequencies the fake computes.
  assert.deepEqual(tab.spec, {
    frequenciesPerMm: [0, 10, 20, 30, 40, 50],
    fields: { kind: "image-height-fractions", values: [0, 0.25, 0.5, 0.75, 1] },
    method: "diffraction",
    focus: "engine-best",
    profile: "lv-tab-default",
  });
  assert.deepEqual([tab.view, tab.fNumber, tab.displayedFrequenciesPerMm], ["wide-open", 4, [20, 40]]);
  // The case is the lens at that zoom position on the lines of the tab's spectrum, with the hook's stop radius:
  // here the very case a run exports for the lens wide open on the photopic lines.
  const plain = await modelOf(binding, ZOOM, { state: { zoomT: 1 }, lines: { kind: "photopic" } });
  assert.equal(tab.opticalCase.id, plain.opticalCase.id);
  assert.equal(tab.opticalCase.conditions.stopSemiDiameter, 6);

  const { api, asked } = watched(binding);
  const answer = answerLvMtf(api, await modelOfCase(binding, tab.opticalCase), tab.spec);
  assert.ok("data" in answer, JSON.stringify(answer));
  // Member for member the tab's options: its grid cap and fields, the hook's two radii, and no frequencies.
  assert.deepEqual(asked, [
    {
      method: "diffraction",
      spectrum: "photopic",
      focus: "best-axial",
      maxGridSize: 64,
      fieldFractions: [0, 0.25, 0.5, 0.75, 1],
      pupilSemiDiameterMm: 6,
      stopSemiDiameterMm: 6,
      movementActive: false,
    },
  ]);
  const { data } = answer;
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  assert.deepEqual(data.method.params, {
    spectrum: "photopic",
    focus: "best-axial",
    maxGridSize: 64,
    pupilSemiDiameterMm: 6,
    stopSemiDiameterMm: 6,
    referenceHeightMm: 10,
    fieldBasis: "modeled-edge",
    profile: "lv-tab-default",
    view: "wide-open",
    fNumber: 4,
    displayedFrequenciesPerMm: [20, 40],
  });
  assert.equal(data.fields.length, 5);
  assert.deepEqual(curve(data.fields[4].sagittal), fakeCurves("diffraction", 6, 1, tab.spec.frequenciesPerMm).sagittal);
  assert.deepEqual(data.focus, { mode: "best-axial", appliedShiftMm: -6 / 128 });
  assert.equal(data.lines.length, 5);
  assert.deepEqual(data.notes, []);

  // The profile fixes the grid cap: the same cap as an option changes nothing, another is not the profile.
  const engine = engineOn(t, binding);
  assert.deepEqual(dataOf(await ask(engine, tab.opticalCase, tab.spec, { lvGridCap: 64 })), data);
  assert.deepEqual((await ask(engine, tab.opticalCase, tab.spec, { lvGridCap: 128 })).error, {
    code: "bad-spec",
    message: "the profile lv-tab-default caps the grid at 64, and lvGridCap asks for 128",
  });
  assert.equal(LV_TAB_PROFILE, "lv-tab-default");
});

test("lv-tab-default follows a change of LensVisualizer's defaults: nothing of the request is the comparator's", async (t) => {
  const lv = variantOf(freshLv(t), "defaults", {
    "src/utils/state/mtfPreferences.ts": (text) =>
      text
        .replace('method: "diffraction"', 'method: "geometric"')
        .replace('focus: "best-axial"', 'focus: "design"')
        .replace('spectrum: "photopic"', 'spectrum: "cdf"')
        .replace("fieldStepPercent: 25", "fieldStepPercent: 50")
        .replace("maxGridSize: 64", "maxGridSize: 256")
        .replace("Object.freeze([20, 40])", "Object.freeze([10])"),
  });
  const binding = await bind(t, lv);
  const tab = await tabOf(binding, SINGLET);
  assert.deepEqual(tab.spec, {
    frequenciesPerMm: [0, 10, 20, 30, 40, 50],
    fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
    method: "geometric",
    focus: "design",
    profile: "lv-tab-default",
  });
  // The case is on the lines of the spectrum those defaults prefer: three, where the fake's photopic has five.
  assert.equal(tab.opticalCase.conditions.lines.length, 3);
  const data = dataOf(await ask(engineOn(t, binding), tab.opticalCase, tab.spec));
  assert.deepEqual(
    [data.method.name, data.method.params.maxGridSize, data.method.params.displayedFrequenciesPerMm],
    ["geometric", 256, [10]],
  );
  assert.deepEqual([data.method.params.spectrum, data.lines.length], ["cdf", 3]);
  assert.deepEqual(data.focus, { mode: "design", appliedShiftMm: 0 });
});

test("lv-tab-default: a lens without the glass data is asked on the reference line, and the fallback is the first note", async (t) => {
  const binding = await bind(t, freshLv(t));
  const tab = await tabOf(binding, DOUBLET);
  assert.deepEqual(
    tab.opticalCase.conditions.lines.map(({ wavelengthNm, indexSource }) => [wavelengthNm, indexSource]),
    [[587.5618, "authored"]],
  );
  const data = dataOf(await ask(engineOn(t, binding), tab.opticalCase, tab.spec));
  assert.equal(data.method.params.spectrum, "reference");
  assert.deepEqual(data.notes, [
    "Photopic MTF is unavailable because a glass has no Abbe number; showing the reference wavelength.",
  ]);
  assert.deepEqual(data.lines, [{ wavelengthNm: 587.5618, weight: 1 }]);
});

test("lv-tab-default is about the tab's own case: other lines, another stop or another request is a bad spec", async (t) => {
  const binding = await bind(t, freshLv(t));
  const engine = engineOn(t, binding);
  const tab = await tabOf(binding, ZOOM, "wide-open", 1);
  const codeOf = async (opticalCase: OpticalCase, spec: MtfNativeSpec) => {
    const result = await ask(engine, opticalCase, spec);
    assert.equal(result.status, "error", JSON.stringify(result));
    assert.equal(result.error?.code, "bad-spec");
    return result.error?.message;
  };

  // The tab asks this lens for its photopic spectrum: the case on the reference line is not the tab's.
  const reference = await modelOf(binding, ZOOM, { state: { zoomT: 1 } });
  assert.equal(
    await codeOf(reference.opticalCase, tab.spec),
    "the profile lv-tab-default is not about this case: LensVisualizer's MTF tab asks for its photopic spectrum for " +
      "this lens, and the lines of the case (587.5618 nm) are its reference spectrum; export the case on the " +
      "photopic lines, as lvrtc mtf does",
  );

  // Stopped down to f/5.6 the stop is neither the tab's wide-open one nor that of its f/8 comparison.
  const stopped = await modelOf(binding, ZOOM, {
    state: { zoomT: 1 },
    aperture: { kind: "f-number", value: 5.6 },
    lines: { kind: "photopic" },
  });
  const stop = stopped.opticalCase.conditions.stopSemiDiameter;
  assert.equal(
    await codeOf(stopped.opticalCase, tab.spec),
    `the profile lv-tab-default is not about this case: the stop radius of the case, ${stop} mm, is neither the ` +
      "one LensVisualizer's MTF tab traces wide open, 6 mm, nor that of its f/8 comparison, 3 mm",
  );

  // A spec that names the profile states what the profile is, and nothing else.
  const said = "the spec names the profile lv-tab-default and its";
  assert.equal(
    await codeOf(tab.opticalCase, { ...tab.spec, method: "geometric" }),
    `${said} method is geometric, and the tab's is diffraction`,
  );
  assert.equal(
    await codeOf(tab.opticalCase, { ...tab.spec, focus: "design" }),
    `${said} focus is design, and the tab's is engine-best`,
  );
  assert.equal(
    await codeOf(tab.opticalCase, { ...tab.spec, fields: { kind: "image-height-fractions", values: [0, 0.5, 1] } }),
    `${said} fields are not the tab's, the fractions 0, 0.25, 0.5, 0.75, 1`,
  );
  assert.equal(
    await codeOf(tab.opticalCase, { ...tab.spec, frequenciesPerMm: [20, 40] }),
    `${said} frequenciesPerMm are not the ones the tab computes (6 from 0 to 50 cycles/mm)`,
  );
});

// ── The f/8 comparison ───────────────────────────────────────────────────────────────────────────────────────────

test("the f/8 comparison is the tab's request with both radii scaled by N over 8, on a case with that stop", async (t) => {
  const binding = await bind(t, freshLv(t));
  const wideOpen = await tabOf(binding, ZOOM, "wide-open", 1);
  const comparison = await tabOf(binding, ZOOM, "f8-comparison", 1);
  // The fake zoom is f/4 with an iris of 6 mm at its long end: at f/8 the tab traces 6 x 4 / 8.
  assert.deepEqual([comparison.view, comparison.fNumber], ["f8-comparison", 8]);
  assert.equal(comparison.opticalCase.conditions.stopSemiDiameter, 3);
  assert.deepEqual(comparison.spec, wideOpen.spec);
  assert.notEqual(comparison.opticalCase.id, wideOpen.opticalCase.id);

  const { api, asked } = watched(binding);
  const answer = answerLvMtf(api, await modelOfCase(binding, comparison.opticalCase), comparison.spec);
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual([asked[0].stopSemiDiameterMm, asked[0].pupilSemiDiameterMm], [3, 3]);
  assert.deepEqual(
    [answer.data.method.params.view, answer.data.method.params.fNumber, answer.data.method.params.stopSemiDiameterMm],
    ["f8-comparison", 8, 3],
  );
  assert.deepEqual(answer.data.focus, { mode: "best-axial", appliedShiftMm: -3 / 128 });
});

test("a lens the tab offers no f/8 comparison for is unsupported, with the tab's reason", async (t) => {
  const lv = freshLv(t);
  const reasonOf = async (name: string, edit: (text: string) => string) => {
    const binding = await bind(t, variantOf(lv, name, { [ZOOM_FILE]: edit }));
    const tab = await tabOf(binding, ZOOM, "f8-comparison", 1);
    const result = await ask(engineOn(t, binding), tab.opticalCase, tab.spec);
    // The lens wide open is answered as ever.
    const wideOpen = await tabOf(binding, ZOOM, "wide-open", 1);
    dataOf(await ask(engineOn(t, binding), wideOpen.opticalCase, wideOpen.spec));
    binding.close();
    assert.equal(result.status, "unsupported", JSON.stringify(result));
    assert.deepEqual(
      result.unsupported?.map(({ code, item }) => [code, item]),
      [["feature", "aperture.f8-comparison"]],
    );
    return result.unsupported?.[0].message;
  };
  assert.equal(
    await reasonOf("short", (text) => text.replace('"fopen": 4,', '"fopen": 4,\n  "maxFstop": 5.6,')),
    "the lens stops down to f/5.6 at most, so LensVisualizer's MTF tab has no f/8 to compare it with",
  );
  assert.equal(
    await reasonOf("slow", (text) => text.replace('"fopen": 4,', '"fopen": 11,')),
    "the lens is at f/11 wide open, and LensVisualizer's MTF tab compares with f/8 only a lens that is faster than f/7.95",
  );
});

// ── The resolver ─────────────────────────────────────────────────────────────────────────────────────────────────

test("a lens that has no case has the exporter's problems, and the tab is not asked", async (t) => {
  const lv = variantOf(freshLv(t), "folded", {
    "src/optics/compat.ts": (text) => text.replace("isFoldedOptics: false", "isFoldedOptics: true"),
  });
  const binding = await bind(t, lv);
  const resolve = createLvTabProfileResolver(binding);
  const folded = await resolve({ lensKey: SINGLET, zoomT: 0, view: "wide-open" });
  assert.ok(!folded.ok);
  assert.deepEqual(
    folded.problems.map((problem) => problem.code),
    ["folded-path"],
  );
  const unknown = await resolve({ lensKey: "acme-singlet-51", zoomT: 0, view: "wide-open" });
  assert.ok(!unknown.ok);
  assert.deepEqual(
    unknown.problems.map((problem) => problem.code),
    ["unknown-lens"],
  );
});
