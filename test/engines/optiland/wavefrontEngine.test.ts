import assert from "node:assert/strict";
import { test } from "node:test";
import { engineStamp } from "../../../src/contract/engine.ts";
import type { EngineDescriptor } from "../../../src/contract/engine.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { makeResult } from "../../../src/contract/result.ts";
import { wavefrontTransport } from "../../../src/engines/optiland/wavefrontEngine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { createProtocolHandler } from "../../../src/engines/protocolHandler.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { ALL_FEATURES_CASE, SINGLET_CASE, WAVEFRONT_DATA } from "../../contract/corpus.ts";
import { encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { WavefrontNativeData } from "../../../src/contract/quantities/wavefrontNative.ts";
import { wavefrontMtf } from "../../../src/engines/optiland/wavefrontMtf.ts";
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
    features: { supported: [], limits: {} },
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

function setup(version = 1, body = sourceData()) {
  const asked: QuantityRequest[] = [];
  const inner = createInProcessTransport(
    createProtocolHandler({
      descriptor: {
        ...descriptor,
        capabilities: { ...descriptor.capabilities, quantities: { "wavefront.native": { version } } },
      },
      run: (request) => {
        asked.push(request);
        return makeResult(request, engineStamp(descriptor.identity), { status: "ok", data: body });
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
    assert.equal(result.status, "ok", JSON.stringify(result.error));
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

test("another raw quantity version is unsupported without a run call; a photopic request is unsupported", async () => {
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
    assert.equal(photopic.unsupported?.[0].item, "lines.polychromatic");
  } finally {
    await s.adapter.close();
  }
});

test("malformed raw arrays and mismatched field/line/grid answers become errors", async () => {
  for (const kind of ["array", "field", "wavelength", "index", "grid", "plane"]) {
    const body = structuredClone(sourceData());
    if (kind === "array") Object.assign(body.fields[0].samples[0], { gridSize: 6 });
    if (kind === "field") Object.assign(body.fields[0], { field: 1 });
    if (kind === "wavelength") Object.assign(body.line, { wavelengthNm: 400 });
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
  assert.deepEqual(r6cRung.buildRequests(ALL_FEATURES_CASE, run, inputs), []);
  assert.deepEqual(r6cRung.engineOptions?.(run, inputs, "optiland-wave"), { fieldAnglesDeg: [0, 5, 10] });
  const policy = loadPolicy();
  assert.equal(policy.version, 12);
  assert.deepEqual(policy.rungs.r6c, policy.rungs.r5);
  assert.ok(!followUpsOf(policy).some((f) => f.rung === "r6c"));
});

test("a raw unavailable field keeps its reason and has no derived number", () => {
  const data = wavefrontMtf({ ...WAVEFRONT_DATA, fields: [WAVEFRONT_DATA.fields[1]] }, spec);
  assert.equal(data.fields[0].status, "unavailable");
  assert.equal(data.fields[0].reason, "optiland-raised-ValueError");
});
