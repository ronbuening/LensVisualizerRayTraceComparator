// The comparator of `spot.native` for rung R7b: two engines' own spots and fans, field by field, sorted by R5's
// classes before any difference is taken. Every number is synthetic, a binary fraction.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComparisonContext } from "../../src/compare/comparator.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { spotNativeComparator } from "../../src/compare/spotNative.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { SpotNativeData, SpotNativeField } from "../../src/contract/quantities/spotNative.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { spotNativeQuantity } from "../../src/quantities/spotNative.ts";

const POLICY = loadPolicy().rungs.r7b;

/** The policy of the rung without its limit on the chief rays' landing: what a comparator does with none. */
const UNLIMITED: RungPolicy = {
  ...POLICY,
  metrics: { ...POLICY.metrics, "chiefLanding.maxAbs": { unit: "mm" } },
};

function spotField(field: number, centroid: [number, number], rms: number, height: number | null = 8): SpotNativeField {
  return {
    field,
    fieldAngleDeg: 20 * field,
    imageHeightMm: height,
    status: "ok",
    spot: { centroidMm: centroid, rmsRadiusMm: rms },
    fan: null,
    sampling: { raysLaunched: 121, raysLanded: 100 },
  };
}

function unavailable(field: number, reason: string): SpotNativeField {
  return {
    field,
    fieldAngleDeg: null,
    imageHeightMm: null,
    status: "unavailable",
    reason,
    spot: null,
    fan: null,
    sampling: {},
  };
}

function rings(method: string, fields: SpotNativeField[], wavelengthNm = 587.5): SpotNativeData {
  return {
    pattern: "rings",
    fields,
    method: { name: method, params: {} },
    lines: [{ wavelengthNm, weight: 1 }],
    notes: [],
  };
}

function fanField(errors: number[], pupil?: number[]): SpotNativeField {
  const at = pupil ?? errors.map((_unused, index) => -1 + (2 * index) / (errors.length - 1));
  return {
    field: 0.5,
    fieldAngleDeg: 10,
    imageHeightMm: 8,
    status: "ok",
    spot: null,
    fan: { pupil: encodeNdArray(Float64Array.from(at)), errorMm: encodeNdArray(Float64Array.from(errors)) },
    sampling: { raysLaunched: errors.length, raysLanded: errors.filter((error) => !Number.isNaN(error)).length },
  };
}

function fan(method: string, field: SpotNativeField): SpotNativeData {
  return {
    pattern: "fan",
    fields: [field],
    method: { name: method, params: {} },
    lines: [{ wavelengthNm: 587.5, weight: 1 }],
    notes: [],
  };
}

function compared(a: SpotNativeData, b: SpotNativeData, policy: RungPolicy = POLICY): ComparatorOutcome {
  const context: ComparisonContext = { policy };
  return spotNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, context);
}

function values(outcome: ComparatorOutcome): Record<string, number> {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return Object.fromEntries(outcome.metrics.map(({ name, value }) => [name, value]));
}

const LV = rings("lv-coma-tab", [
  spotField(0, [0, 0], 1 / 64, 0),
  spotField(0.5, [0, -1 / 32], 1 / 16),
  spotField(0.75, [0, -1 / 16], 1 / 8, 12),
]);

test("the fields of two methods give the largest difference of the centroids and of the radii", () => {
  for (const data of [LV]) assert.deepEqual(spotNativeQuantity.validateData(data), []);
  const other = rings("optiland-spot-diagram", [
    spotField(0, [2 ** -40, 0], 1 / 64 + 1 / 1024, 0),
    spotField(0.5, [0, -1 / 32 - 1 / 128], 1 / 16, 8 + 2 ** -30),
    spotField(0.75, [1 / 256, -1 / 16], 1 / 8 - 1 / 512, 12),
  ]);
  const outcome = compared(LV, other);
  assert.deepEqual(values(outcome), {
    "chiefLanding.maxAbs": 2 ** -30,
    "spotCentroid.maxAbs": 1 / 128,
    "spotRmsRadius.maxAbs": 1 / 512,
    "fields.compared": 3,
    "fields.data": 0,
    "fields.unavailable": 0,
  });
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.inapplicable, ["fanError.maxAbs"]);
  assert.deepEqual(outcome.metrics.find(({ name }) => name === "spotCentroid.maxAbs")?.where, { field: 0.5 });
  assert.equal(outcome.notes, undefined);
  // A policy without the limit sets no field aside by its landing, and the notes say so.
  const unlimited = compared(LV, other, UNLIMITED);
  assert.ok(unlimited.comparable);
  assert.deepEqual(unlimited.notes, [
    "the rung sets no limit on chiefLanding.maxAbs: no field is set aside by its landing",
  ]);
  // Swapping the answers changes no value.
  assert.deepEqual(values(compared(other, LV)), values(outcome));
});

test("a field is sorted first: no spot, other lines, an unknown or a distant landing are in no figure", () => {
  const other = rings("optiland-spot-diagram", [
    unavailable(0, "optiland-raised-ValueError"),
    spotField(0.5, [0, 1], 1, null),
    spotField(0.75, [0, -1 / 16], 1 / 8, 12 + 1 / 512),
  ]);
  const banded = compared(LV, other);
  assert.deepEqual(values(banded), {
    "chiefLanding.maxAbs": 1 / 512,
    "fields.compared": 0,
    "fields.data": 2,
    "fields.unavailable": 1,
  });
  assert.ok(banded.comparable);
  assert.deepEqual(banded.notes, [
    "field 0: unsupported, no-curve (optiland-spot-diagram: unavailable (optiland-raised-ValueError))",
    "field 0.5: data, chief-landing-unknown (no chief-ray landing from optiland-spot-diagram)",
    "field 0.75: data, chief-landing-apart (the chief rays land 1.95e-3 mm apart)",
  ]);
  assert.deepEqual(
    banded.unmeasured?.map(({ name }) => name),
    ["spotCentroid.maxAbs", "spotRmsRadius.maxAbs"],
  );
  // Without the limit the distant field is a field of two methods.
  assert.equal(values(compared(LV, other, UNLIMITED))["fields.compared"], 1);
  // The rung's limit is 1e-5 mm, and it sorts at its value: 2^-17 mm apart is within it, 2^-16 mm is not.
  assert.equal(POLICY.metrics["chiefLanding.maxAbs"].attention, 1e-5);
  for (const [apart, kind] of [
    [2 ** -17, "fields.compared"],
    [2 ** -16, "fields.data"],
  ] as const) {
    const near = rings("optiland-spot-diagram", [
      spotField(0, [0, 0], 1 / 64, 0),
      spotField(0.5, [0, -1 / 32], 1 / 16),
      spotField(0.75, [0, -1 / 16], 1 / 8, 12 + apart),
    ]);
    assert.equal(values(compared(LV, near))[kind], kind === "fields.compared" ? 3 : 1, `${apart}`);
  }
  const otherLine = rings("optiland-spot-diagram", LV.fields as SpotNativeField[], 546.07);
  assert.deepEqual(values(compared(LV, otherLine))["fields.data"], 3);
});

test("two fans differ by their largest difference where both landed, and a sample landed in one is counted", () => {
  const lvFan = fan("lv-coma-tab", fanField([NaN, -1 / 8, 0, 1 / 4, 1 / 2]));
  const other = fan("optiland-ray-fan", fanField([-1 / 4, -1 / 8 + 1 / 256, 0, 1 / 4, NaN]));
  for (const data of [lvFan, other]) assert.deepEqual(spotNativeQuantity.validateData(data), []);
  const outcome = compared(lvFan, other);
  assert.deepEqual(values(outcome), {
    "chiefLanding.maxAbs": 0,
    "fanError.maxAbs": 1 / 256,
    "fields.compared": 1,
    "fields.data": 0,
    "fields.unavailable": 0,
    "fanSamples.unpaired": 2,
  });
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.inapplicable, ["spotCentroid.maxAbs", "spotRmsRadius.maxAbs"]);
  assert.deepEqual(outcome.metrics.find(({ name }) => name === "fanError.maxAbs")?.where, { field: 0.5, ray: 1 });
  // Samples at other pupil coordinates are of another fan.
  const elsewhere = fan("optiland-ray-fan", fanField([0, 0, 0, 0, 0], [-1, -0.5, 0, 0.5, 0.75]));
  const refused = compared(lvFan, elsewhere);
  assert.ok(!refused.comparable && /pupil coordinates/.test(refused.reason));
});

test("answers of other patterns, of other fields or of other numbers of fields are not comparable", () => {
  const reasons = [
    compared(LV, fan("optiland-ray-fan", fanField([0, 0, 0]))),
    compared(LV, rings("o", [spotField(0, [0, 0], 1), spotField(0.5, [0, 0], 1)])),
    compared(LV, rings("o", [spotField(0, [0, 0], 1), spotField(0.25, [0, 0], 1), spotField(0.75, [0, 0], 1)])),
  ].map((outcome) => (outcome.comparable ? "comparable" : outcome.reason));
  assert.deepEqual(reasons, [
    "one answer is of rings and the other of fan",
    "the answers are for 2 and 3 fields: they answer different requests",
    "field 1 is 0.25 in one answer and 0.5 in the other",
  ]);
});

test("the policy records every pair: RECORDED whatever the spot figures, ATTENTION past the landing limit", () => {
  const other = rings("optiland-spot-diagram", [
    spotField(0, [1, 1], 2, 0),
    spotField(0.5, [1, 1], 2),
    spotField(0.75, [1, 1], 2, 12),
  ]);
  const pair = comparePair(
    { engine: "lv", fingerprint: "a", status: "ok", data: LV as unknown as JsonObject },
    { engine: "optiland", fingerprint: "b", status: "ok", data: other as unknown as JsonObject },
    POLICY,
    spotNativeComparator,
  );
  assert.equal(pair.verdict, "RECORDED");
  assert.equal(pair.class, "recorded");
  assert.deepEqual(
    pair.metrics.map(({ name }) => name),
    [
      "chiefLanding.maxAbs",
      "spotCentroid.maxAbs",
      "spotRmsRadius.maxAbs",
      "fields.compared",
      "fields.data",
      "fields.unavailable",
    ],
  );
  // Chief rays further apart than the limit: their field is set aside, and the pair is marked for attention.
  const apart = rings("optiland-spot-diagram", [
    spotField(0, [1, 1], 2, 0),
    spotField(0.5, [1, 1], 2),
    spotField(0.75, [1, 1], 2, 12 + 1 / 1024),
  ]);
  const marked = comparePair(
    { engine: "lv", fingerprint: "a", status: "ok", data: LV as unknown as JsonObject },
    { engine: "optiland", fingerprint: "b", status: "ok", data: apart as unknown as JsonObject },
    POLICY,
    spotNativeComparator,
  );
  assert.equal(marked.verdict, "ATTENTION");
  assert.equal(marked.metrics.find(({ name }) => name === "fields.data")?.value, 1);
});

test("policy 24 bands the fans at 9e-10 mm: within it a pair is RECORDED, above it ATTENTION; the spots stay unbanded", () => {
  // The owner's decision of 2026-10-29: since LensVisualizer #927 a fan's rays are aimed at the real stop as optiland's
  // are, one definition; the spots (LV's rings against optiland's hexapolar pattern) are two samplings, unbanded.
  assert.deepEqual(POLICY.metrics["fanError.maxAbs"], { attention: 9e-10, unit: "mm" });
  assert.deepEqual(POLICY.metrics["spotCentroid.maxAbs"], { unit: "mm" });
  assert.deepEqual(POLICY.metrics["spotRmsRadius.maxAbs"], { unit: "mm" });
  const lvFan = fan("lv-coma-tab", fanField([-1 / 4, -1 / 8, 0, 1 / 4, 1 / 2]));
  const pairOf = (errors: number[]) =>
    comparePair(
      { engine: "lv", fingerprint: "a", status: "ok", data: lvFan as unknown as JsonObject },
      {
        engine: "optiland",
        fingerprint: "b",
        status: "ok",
        data: fan("optiland-ray-fan", fanField(errors)) as unknown as JsonObject,
      },
      POLICY,
      spotNativeComparator,
    );
  // 2^-31 mm (4.7e-10) apart at one sample: within the band.
  const within = pairOf([-1 / 4, -1 / 8 + 2 ** -31, 0, 1 / 4, 1 / 2]);
  assert.equal(within.verdict, "RECORDED");
  assert.equal(within.metrics.find(({ name }) => name === "fanError.maxAbs")?.value, 2 ** -31);
  // 2^-30 mm (9.3e-10) apart: above it.
  const above = pairOf([-1 / 4, -1 / 8 + 2 ** -30, 0, 1 / 4, 1 / 2]);
  assert.equal(above.verdict, "ATTENTION");
  assert.match(above.reason ?? "", /^fanError\.maxAbs \S+ is outside its attention band/);
});

test("each answer records its fields, its spot or its fan, its sampling and its line", () => {
  assert.deepEqual(spotNativeComparator.recorded?.(LV as unknown as JsonObject), {
    field: [0, 0.5, 0.75],
    fieldAngleDeg: [0, 10, 15],
    imageHeightMm: [0, 8, 12],
    settled: [1, 1, 1],
    centroidXMm: [0, 0, 0],
    centroidYMm: [0, -1 / 32, -1 / 16],
    rmsRadiusMm: [1 / 64, 1 / 16, 1 / 8],
    raysLanded: [100, 100, 100],
    raysLaunched: [121, 121, 121],
    lineWavelengthNm: [587.5],
  });
  const recorded = spotNativeComparator.recorded?.(fan("lv", fanField([NaN, 0, 1 / 8])) as unknown as JsonObject) ?? {};
  assert.deepEqual(recorded.fanPupil, [-1, 0, 1]);
  assert.deepEqual(recorded.fanErrorMm, [NaN, 0, 1 / 8]);
});
