// Raw Wavefront.get_data and the TypeScript adapter on real optiland, no LV values or prescriptions pinned.
import assert from "node:assert/strict";
import { test } from "node:test";
import { makeRequest } from "../../../src/contract/request.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { wavefrontNativeQuantity } from "../../../src/quantities/wavefrontNative.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import type { WavefrontNativeData } from "../../../src/contract/quantities/wavefrontNative.ts";
import type { MtfNativeData } from "../../../src/contract/quantities/mtfNative.ts";
import { caseFixture } from "../../core/support.ts";
import { readFileSync } from "node:fs";
import type { OpticalCase } from "../../../src/contract/case.ts";
import { OPTILAND_UNAVAILABLE, optilandRoot } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE;
test(
  "real optiland raw wavefronts preserve available fields around one that raises, and validate at v1",
  { skip },
  async (t) => {
    const root = optilandRoot(t);
    const engine = await createEngineRegistry(root).create("optiland");
    t.after(() => engine.close());
    const c = JSON.parse(readFileSync(caseFixture("double-gauss"), "utf8")) as OpticalCase;
    const result = await engine.run(
      makeRequest({
        caseId: c.id,
        quantity: "wavefront.native",
        spec: { line: 0, fields: { kind: "angles-deg", values: [0, 40, 14] }, grids: [8, 16] },
      }),
      c,
    );
    assert.equal(result.status, "ok", JSON.stringify(result.error));
    assert.deepEqual(wavefrontNativeQuantity.validateData(result.data), []);
    const data = result.data as WavefrontNativeData;
    assert.deepEqual(
      data.fields.map((f) => f.status),
      ["ok", "unavailable", "ok"],
    );
    assert.equal(data.fields[1].reason, "optiland-raised-ValueError");
    assert.equal(data.fields[0].samples[1].reference.strategy, "chief_ray");
  },
);

test(
  "real optiland-wave answers native-shaped comparator OTFs and leaves failed fields unavailable",
  { skip },
  async (t) => {
    const engine = await createEngineRegistry(optilandRoot(t)).create("optiland-wave");
    t.after(() => engine.close());
    const c = JSON.parse(readFileSync(caseFixture("double-gauss"), "utf8")) as OpticalCase;
    const result = await engine.run(
      makeRequest({
        caseId: c.id,
        quantity: "mtf.native",
        engineOptions: { wavefrontGrids: [16, 32] },
        spec: {
          fields: { kind: "angles-deg", values: [0, 40, 14] },
          frequenciesPerMm: [0, 10, 30, 50],
          method: "diffraction",
          focus: "design",
        },
      }),
      c,
    );
    assert.equal(result.status, "ok", JSON.stringify(result.error));
    assert.deepEqual(mtfNativeQuantity.validateData(result.data), []);
    const data = result.data as MtfNativeData;
    assert.equal(data.method.name, "hopkins-optiland-wavefront");
    assert.equal(data.fields[1].status, "unavailable");
    assert.notEqual(data.fields[0].status, "unavailable");
    assert.notEqual(data.fields[2].status, "unavailable");
  },
);
