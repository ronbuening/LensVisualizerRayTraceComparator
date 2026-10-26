import assert from "node:assert/strict";
import test from "node:test";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { describeLvSystem } from "../../../src/engines/lv/describe.ts";
import { decodeNdArray, encodeF8 } from "../../../src/core/numeric/ndarray.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { freshLv, bind, variantOf } from "./support.ts";

test("the folded fake exports a fixed path and reports LV geometry with OPL explicitly unavailable", async (t) => {
  const binding = await bind(t, freshLv(t));
  const exported = await createLvExporter(binding).exportLens("zz-folded-mirror", {});
  assert.ok(exported.ok);
  assert.equal(exported.opticalCase.contract, "1.4");
  assert.equal(exported.opticalCase.features.includes("path.folded"), true);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok);
  const description = describeLvSystem(binding.api, rebuilt.model, [0, 1]);
  assert.deepEqual(description.pathSurfaceIndices, [0, 1]);
  assert.deepEqual(description.pathInteractions, ["refract", "reflect"]);
  const answer = answerLvRays(binding.api, rebuilt.model, {
    line: 0,
    origins: encodeF8([0, 2, -10], [1, 3]),
    directions: encodeF8([0, 0, 1], [1, 3]),
    weights: encodeF8([1]),
  });
  assert.ok("data" in answer);
  assert.deepEqual(raysTraceQuantity.validateData(answer.data, 2), []);
  assert.ok(raysTraceQuantity.validateData(answer.data, 1).length);
});

// The fake folded mirror with a transparent hole of 3 mm in M1 and a return visit of STO; image plane at z=-20.
const HOLED: Readonly<Record<string, (text: string) => string>> = {
  "src/lens-data/zz-folded/FoldedMirror.data.ts": (text) =>
    text
      .replace(
        "surfaceOrder: [0, 1], maxInteractions: 3 }, imageZ: 20",
        "surfaceOrder: [0, 1, 0], maxInteractions: 4 }, imageZ: -20",
      )
      .replace(
        '{ label: "M1", R: -120, d: 20, nd: 1, sd: 12,',
        '{ label: "M1", R: -120, d: 20, nd: 1, sd: 12, innerSd: 3,',
      ),
};

async function foldedModel(
  t: Parameters<typeof freshLv>[0],
  edits: Readonly<Record<string, (text: string) => string>>,
) {
  const binding = await bind(t, variantOf(freshLv(t), "variant", edits));
  const exported = await createLvExporter(binding).exportLens("zz-folded-mirror", {});
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return { binding, model: rebuilt.model };
}

const twoRays = {
  line: 0,
  origins: encodeF8([0, 5, -10, 0, 2, -10], [2, 3]),
  directions: encodeF8([0, 0, 1, 0, 0, 1], [2, 3]),
  weights: encodeF8([1, 1]),
};

test("a visit LV crosses without a record is placed by LV's own heights and answered as unrecorded, never computed", async (t) => {
  const { binding, model } = await foldedModel(t, HOLED);
  const answer = answerLvRays(binding.api, model, twoRays);
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual(raysTraceQuantity.validateData(answer.data, 2), []);
  const status = [...decodeNdArray(answer.data.status).values];
  const end = [...decodeNdArray(answer.data.endSurface).values];
  const hits = decodeNdArray(answer.data.hits).values;
  assert.ok(answer.data.unrecordedHits !== undefined);
  const unrecorded = [...decodeNdArray(answer.data.unrecordedHits).values];
  // Ray 0 (h=5) meets all three visits; ray 1 (h=2) crosses M1's hole unrecorded, then cannot step back to STO.
  assert.deepEqual(status, [0, 2]);
  assert.deepEqual(end, [-1, 2]);
  assert.deepEqual(unrecorded, [0, 0, 0, 1, 0, 0]);
  // hits is [visit, ray, xyz]: ray 1's STO hit, its unrecorded M1 visit, and its end; ray 0's return through STO.
  assert.deepEqual([hits[3], hits[4], hits[5]], [0, 2, 0]);
  assert.ok([9, 10, 11, 15, 16, 17].every((at) => Number.isNaN(hits[at])));
  assert.ok([12, 13, 14].every((at) => Number.isFinite(hits[at])));
});

test("LV going on past the declared visits, or a record its heights do not place, makes the request unsupported", async (t) => {
  const after = await foldedModel(t, {
    "src/lens-data/zz-folded/FoldedMirror.data.ts": (text) =>
      text.replace(
        "surfaceOrder: [0, 1], maxInteractions: 3 }",
        "surfaceOrder: [0, 1], maxInteractions: 3, after: [1] }",
      ),
  });
  const continued = answerLvRays(after.binding.api, after.model, twoRays);
  assert.ok("unsupported" in continued);
  assert.equal(continued.unsupported[0].item, "lv-folded-post-path-interaction");
  after.binding.close();
  const misplaced = await foldedModel(t, {
    ...HOLED,
    "src/optics/trace/sequentialTrace.ts": (text) =>
      text.replace("projectCoordinateToZ(hit.point[1],", "projectCoordinateToZ(hit.point[1] + 1,"),
  });
  const unplaced = answerLvRays(misplaced.binding.api, misplaced.model, twoRays);
  assert.ok("unsupported" in unplaced);
  assert.equal(unplaced.unsupported[0].item, "lv-folded-unaligned-visits");
});
