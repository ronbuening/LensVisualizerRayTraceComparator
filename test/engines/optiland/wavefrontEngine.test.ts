import assert from "node:assert/strict";
import { test } from "node:test";
import { finalizeCase } from "../../../src/contract/case.ts";
import { engineStamp } from "../../../src/contract/engine.ts";
import type { EngineDescriptor } from "../../../src/contract/engine.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { makeResult } from "../../../src/contract/result.ts";
import { wavefrontTransport } from "../../../src/engines/optiland/wavefrontEngine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { createProtocolHandler } from "../../../src/engines/protocolHandler.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { ALL_FEATURES_CASE, SINGLET_CASE, WAVEFRONT_DATA } from "../../contract/corpus.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { WavefrontNativeData } from "../../../src/contract/quantities/wavefrontNative.ts";
import { polychromaticWavefrontMtf, wavefrontMtf } from "../../../src/engines/optiland/wavefrontMtf.ts";
import type { QuantityRequest } from "../../../src/contract/request.ts";
import { r6cRung, r6bRung, selectRungs } from "../../../src/core/rungs.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { followUpsOf } from "../../../src/compare/followUp.ts";

const descriptor: EngineDescriptor = {
  contract: { min: "1.0", max: "1.2" },
  identity: {
    id: "optiland",
    version: "test",
    fingerprint: "a".repeat(64),
    adapterRevision: "b".repeat(64),
    details: {},
  },
  capabilities: {
    features: { supported: ALL_FEATURES_CASE.features, limits: {} },
    quantities: { "wavefront.native": { version: 1 } },
    deterministic: true,
    maxConcurrency: 1,
  },
};
const spec = {
  fields: { kind: "angles-deg", values: [0] } as const,
  frequenciesPerMm: [0, 10, 30],
  method: "diffraction",
  focus: "design",
} as const;
function sourceData(): WavefrontNativeData {
  const field = WAVEFRONT_DATA.fields[0];
  const sample = field.samples[0];
  // Move the synthetic sphere bodily to the fixture's image plane; no source values from an engine.
  const pupil = Array.from({ length: 16 }, (_, i) => {
    const x = (2 * (i % 4) + 1) / 4 - 1,
      y = (2 * Math.floor(i / 4) + 1) / 4 - 1;
    return [x, y, SINGLET_CASE.conditions.imageZ - Math.sqrt(100 - x * x - y * y)];
  }).flat();
  return {
    ...WAVEFRONT_DATA,
    line: { ...WAVEFRONT_DATA.line, wavelengthNm: SINGLET_CASE.conditions.lines[0].wavelengthNm },
    fields: [
      {
        ...field,
        samples: [
          {
            ...sample,
            pupilMm: encodeNdArray(Float64Array.from(pupil), [16, 3]),
            reference: {
              ...sample.reference,
              sphereCenterMm: [0, 0, SINGLET_CASE.conditions.imageZ],
              exitPupilMm: [0, 0, SINGLET_CASE.conditions.imageZ - 10],
            },
          },
        ],
      },
    ],
  };
}

function setup(
  version = 1,
  body: WavefrontNativeData | ((request: QuantityRequest) => WavefrontNativeData) = sourceData(),
) {
  const asked: QuantityRequest[] = [];
  const inner = createInProcessTransport(
    createProtocolHandler({
      descriptor: {
        ...descriptor,
        capabilities: { ...descriptor.capabilities, quantities: { "wavefront.native": { version } } },
      },
      run: (request) => {
        asked.push(request);
        return makeResult(request, engineStamp(descriptor.identity), {
          status: "ok",
          data: typeof body === "function" ? body(request) : body,
        });
      },
    }),
  );
  let closes = 0;
  const outer = wavefrontTransport({
    ...inner,
    close: async () => {
      closes++;
      await inner.close();
    },
  });
  return { asked, adapter: new RemoteEngineAdapter({ id: "optiland-wave", transport: outer }), closes: () => closes };
}
const request = () =>
  makeRequest({ caseId: SINGLET_CASE.id, quantity: "mtf.native", spec, engineOptions: { wavefrontGrids: [4] } });

test("the comparator adapter negotiates the raw quantity, preserves ids and fingerprint, combines revisions and owns the worker", async () => {
  const s = setup();
  try {
    const desc = await s.adapter.describe();
    assert.equal(desc.identity.fingerprint, descriptor.identity.fingerprint);
    assert.notEqual(desc.identity.adapterRevision, descriptor.identity.adapterRevision);
    assert.deepEqual(desc.capabilities.quantities, { "mtf.native": { version: 1 } });
    const result = await s.adapter.run(request(), SINGLET_CASE);
    assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
    assert.equal(result.requestId, request().id);
    assert.equal(s.asked.length, 1);
    assert.equal(s.asked[0].quantity, "wavefront.native");
    assert.notEqual(s.asked[0].id, request().id);
    assert.deepEqual(s.asked[0].spec, { fields: spec.fields, line: 0, grids: [4] });
    assert.equal((result.data?.fields as { status: string; reason: string }[])[0].reason, "convergence-unknown");
  } finally {
    await s.adapter.close();
  }
  assert.equal(s.closes(), 1);
});

test("another raw quantity version is unsupported without a run call", async () => {
  const s = setup(2);
  try {
    const result = await s.adapter.run(request(), SINGLET_CASE);
    assert.equal(result.status, "unsupported");
    assert.equal(s.asked.length, 0);
    const photopic = await s.adapter.run(
      makeRequest({ ...request(), caseId: ALL_FEATURES_CASE.id }),
      ALL_FEATURES_CASE,
    );
    assert.equal(photopic.status, "unsupported");
    assert.equal(s.asked.length, 0);
  } finally {
    await s.adapter.close();
  }
});

test("malformed raw arrays and mismatched field/line/grid answers become errors", async () => {
  for (const kind of ["array", "field", "wavelength", "weight", "line", "index", "grid", "plane"]) {
    const body = structuredClone(sourceData());
    if (kind === "array") Object.assign(body.fields[0].samples[0], { gridSize: 6 });
    if (kind === "field") Object.assign(body.fields[0], { field: 1 });
    if (kind === "wavelength") Object.assign(body.line, { wavelengthNm: 400 });
    if (kind === "weight") Object.assign(body.line, { weight: 0.25 });
    if (kind === "line") Object.assign(body.line, { index: 1 });
    if (kind === "index") Object.assign(body.line, { imageIndex: 2 });
    if (kind === "grid") Object.assign(body.fields[0], { samples: [] });
    if (kind === "plane") Object.assign(body.fields[0].samples[0].reference, { sphereCenterMm: [0, 0, 99] });
    const s = setup(1, body);
    try {
      const result = await s.adapter.run(request(), SINGLET_CASE);
      assert.equal(result.status, "error", kind);
    } finally {
      await s.adapter.close();
    }
  }
  // A centre within the worker's 1e-9 mm of the plane is on it: optiland's landing on a plane need not be exact.
  const near = structuredClone(sourceData());
  const centre = near.fields[0].samples[0].reference.sphereCenterMm;
  Object.assign(near.fields[0].samples[0].reference, { sphereCenterMm: [centre[0], centre[1], centre[2] + 2 ** -40] });
  const s = setup(1, near);
  try {
    assert.equal((await s.adapter.run(request(), SINGLET_CASE)).status, "ok");
  } finally {
    await s.adapter.close();
  }
});

test("R6c is named-only, uses R6b's native request and R5's angles, and has no follow-up or gate", () => {
  const run = {
    contract: "1.0",
    kind: "run-spec",
    name: "test",
    lens: { kind: "fixture", path: "case.json" },
  } as const;
  const recipe = {
    source: "lv",
    plane: { kind: "design", shiftMm: 0 },
    stopSemiDiameter: 5,
    lines: SINGLET_CASE.conditions.lines,
    referenceHeightMm: 10,
    fields: [
      { fraction: 0, angleDeg: 0, targetImageHeightMm: 0 },
      { fraction: 0.5, angleDeg: 5, targetImageHeightMm: 5 },
      { fraction: 1, angleDeg: 10, targetImageHeightMm: 10 },
    ],
    frequenciesPerMm: [0, 10, 30],
    imageZ: SINGLET_CASE.conditions.imageZ,
  } as const;
  const inputs = { raySets: [], recipe };
  assert.ok(!selectRungs(undefined).includes(r6cRung));
  assert.deepEqual(r6cRung.buildRequests(SINGLET_CASE, run, inputs), r6bRung.buildRequests(SINGLET_CASE, run, inputs));
  assert.deepEqual(
    r6cRung.buildRequests(ALL_FEATURES_CASE, run, inputs),
    r6bRung.buildRequests(ALL_FEATURES_CASE, run, inputs),
  );
  assert.deepEqual(r6cRung.engineOptions?.(run, inputs, "optiland-wave"), { fieldAnglesDeg: [0, 5, 10] });
  const policy = loadPolicy();
  assert.equal(policy.version, 22);
  assert.deepEqual(policy.rungs.r6c, {
    ...policy.rungs.r5,
    metrics: {
      ...policy.rungs.r5.metrics,
      "chiefLanding.maxAbs": { ...policy.rungs.r5.metrics["chiefLanding.maxAbs"], attentionSeveralLines: 1e-3 },
    },
  });
  assert.ok(!followUpsOf(policy).some((f) => f.rung === "r6c"));
});

test("a raw unavailable field keeps its reason and has no derived number", () => {
  const data = wavefrontMtf({ ...WAVEFRONT_DATA, fields: [WAVEFRONT_DATA.fields[1]] }, spec);
  assert.equal(data.fields[0].status, "unavailable");
  assert.equal(data.fields[0].reason, "optiland-raised-ValueError");
});

test("photopic transport requests every line once, checks its image index, and retains a failed line", async () => {
  const base = ALL_FEATURES_CASE;
  const values = Float64Array.from(decodeNdArray(base.conditions.indexAfterSurface).values);
  const surfaces = base.system.surfaces.length;
  values[2 * surfaces - 1] = 1.5; // The second line must use its own image-index row, not line 0's.
  const c = finalizeCase({
    ...base,
    conditions: {
      ...base.conditions,
      indexAfterSurface: encodeNdArray(values, [base.conditions.lines.length, surfaces]),
    },
  });
  const indices = decodeNdArray(c.conditions.indexAfterSurface).values;
  let fail = false,
    mismatch = false;
  const s = setup(1, (request) => {
    const line = (request.spec as { line: number }).line;
    const raw = sourceData();
    return {
      ...raw,
      line: {
        index: line,
        wavelengthNm: c.conditions.lines[line].wavelengthNm,
        weight: c.conditions.lines[line].weight,
        imageIndex: mismatch && line === 1 ? 99 : indices[(line + 1) * c.system.surfaces.length - 1],
      },
      fields: raw.fields.map((field) => ({
        ...field,
        ...(fail && line === 1
          ? { status: "unavailable" as const, reason: "lost-pupil", samples: [] }
          : {
              samples: field.samples.map((sample) => ({
                ...sample,
                pupilMm: encodeNdArray(
                  Float64Array.from(decodeNdArray(sample.pupilMm).values, (v, i) =>
                    i % 3 === 2 ? v + c.conditions.imageZ - SINGLET_CASE.conditions.imageZ : v,
                  ),
                  [16, 3],
                ),
                reference: { ...sample.reference, sphereCenterMm: [0, 0, c.conditions.imageZ] },
              })),
            }),
      })),
    };
  });
  const asked = makeRequest({ ...request(), caseId: c.id });
  try {
    const result = await s.adapter.run(asked, c);
    assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
    assert.deepEqual(
      s.asked.map((r) => r.spec.line),
      c.conditions.lines.map((_, i) => i),
    );
    assert.deepEqual(
      result.data?.lines,
      c.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
    );
    assert.equal((result.data?.method as { name: string }).name, "hopkins-optiland-wavefront-spectral-sum");
    fail = true;
    const unavailable = await s.adapter.run(asked, c);
    assert.equal(unavailable.status, "ok");
    const field = (unavailable.data?.fields as { status: string; reason: string }[])[0];
    assert.equal(field.status, "unavailable");
    assert.equal(field.reason, "line 1: lost-pupil");
    fail = false;
    mismatch = true;
    assert.equal((await s.adapter.run(asked, c)).status, "error");
  } finally {
    await s.adapter.close();
  }
});

test("a spectral field the estimator cannot compute states the estimator's code and the line it is about", () => {
  const lit = sourceData();
  const dark: WavefrontNativeData = {
    ...lit,
    line: { ...lit.line, index: 1 },
    fields: lit.fields.map((field) => ({
      ...field,
      samples: field.samples.map((sample) => ({
        ...sample,
        intensity: encodeNdArray(new Float64Array(16), decodeNdArray(sample.intensity).shape),
      })),
    })),
  };
  const field = polychromaticWavefrontMtf([lit, dark], spec).fields[0];
  assert.equal(field.status, "unavailable");
  assert.equal(field.reason, "line 1: no-flux");
});
