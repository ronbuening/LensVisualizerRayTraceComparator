// The comparator of `vignetting.native` for rung R11b: every field is sorted before a difference is taken, by R9b's
// sorting (R5's classes, then indices that are not the case's, then the chief rays' landing); only a field of two
// methods is in a figure, and the three figures separate the geometric transmission from the falloff of the light
// that gets through. Every number is synthetic and dyadic, so that every expected difference is exact.
import assert from "node:assert/strict";
import { test } from "node:test";

import { classifyChiefField } from "../../src/compare/chiefNative.ts";
import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import {
  CHIEF_LANDING_METRIC,
  vignettingFactsOf,
  vignettingFactsOfRecorded,
  vignettingNativeComparator,
} from "../../src/compare/vignettingNative.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { VignettingNativeData, VignettingNativeField } from "../../src/contract/quantities/vignettingNative.ts";

const POLICY: RungPolicy = loadPolicy().rungs.r11b;

function field(fieldAngleDeg: number, more: Partial<VignettingNativeField> = {}): VignettingNativeField {
  return {
    line: 0,
    wavelengthNm: 587.5,
    fieldAngleDeg,
    status: "ok",
    chiefLandingMm: -fieldAngleDeg / 2,
    geometricTransmission: 1 - fieldAngleDeg / 64,
    relativeIllumination: 1 - fieldAngleDeg / 32,
    sampling: {},
    ...more,
  };
}

function answer(fields: VignettingNativeField[], name = "one"): VignettingNativeData {
  return { fields, method: { name, params: {} }, notes: [] };
}

function compared(
  a: VignettingNativeData,
  b: VignettingNativeData,
  policy: RungPolicy | undefined = POLICY,
): ComparatorOutcome {
  return vignettingNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, { policy });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

test("the policy gives the landing its limit of 1e-5 mm and no figure a band: it is recorded, and never judged", () => {
  assert.deepEqual(POLICY.metrics, { [CHIEF_LANDING_METRIC]: { attention: 1e-5, unit: "mm" } });
  const a = answer([field(0), field(8)]);
  const b = answer([field(0), field(8, { geometricTransmission: 0.5, relativeIllumination: 0.25 })], "two");
  const pair = comparePair(
    { engine: "lv", fingerprint: "a", status: "ok", data: a as unknown as JsonObject },
    { engine: "flux", fingerprint: "b", status: "ok", data: b as unknown as JsonObject },
    POLICY,
    vignettingNativeComparator,
  );
  assert.equal(pair.verdict, "RECORDED");
});

test("the three figures: the transmissions, the falloffs of the light that gets through, and the illuminations", () => {
  // At 8 degrees: transmissions 7/8 and 5/8, illuminations 3/4 and 5/16; falloffs 6/7 and 1/2.
  const a = answer([field(0), field(8)]);
  const b = answer([field(0), field(8, { geometricTransmission: 5 / 8, relativeIllumination: 5 / 16 })], "two");
  const outcome = compared(a, b);
  assert.deepEqual(metric(outcome, "geometricTransmission.maxAbs"), {
    name: "geometricTransmission.maxAbs",
    value: 1 / 4,
    where: { line: 0, field: 8 },
  });
  assert.equal(metric(outcome, "relativeIllumination.maxAbs")!.value, 3 / 4 - 5 / 16);
  assert.equal(metric(outcome, "falloff.maxAbs")!.value, Math.abs(3 / 4 / (7 / 8) - 5 / 16 / (5 / 8)));
  assert.equal(metric(outcome, CHIEF_LANDING_METRIC)!.value, 0);
  assert.deepEqual(
    ["compared", "data", "unconverged", "unavailable"].map((kind) => metric(outcome, `fields.${kind}`)!.value),
    [2, 0, 0, 0],
  );
  // The same transmission and a falloff of its own: the falloff alone is the illumination's difference over it.
  const falloff = compared(a, answer([field(0), field(8, { relativeIllumination: 7 / 16 })]));
  assert.equal(metric(falloff, "geometricTransmission.maxAbs")!.value, 0);
  assert.equal(metric(falloff, "falloff.maxAbs")!.value, Math.abs(3 / 4 / (7 / 8) - 7 / 16 / (7 / 8)));
});

test("a field is sorted first: no figures is unavailable, unconverged is numerical, a landing apart is data", () => {
  const a = answer([field(0), field(4), field(8), field(12), field(16)]);
  const b = answer(
    [
      field(0),
      field(4, {
        status: "unavailable",
        reason: "lv-no-curve",
        chiefLandingMm: null,
        geometricTransmission: null,
        relativeIllumination: null,
      }),
      field(8, { status: "unconverged", reason: "not-converged", geometricTransmission: 0.5 }),
      field(12, { chiefLandingMm: -6 + 2 ** -16 }),
      field(16, { chiefLandingMm: null }),
    ],
    "two",
  );
  const outcome = compared(a, b);
  assert.deepEqual(
    ["compared", "data", "unconverged", "unavailable"].map((kind) => metric(outcome, `fields.${kind}`)!.value),
    [1, 2, 1, 1],
  );
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.notes, [
    "line 0, field 4: unsupported, no-curve (two: unavailable (lv-no-curve))",
    "line 0, field 8: numerical, unconverged (two: unconverged (not-converged))",
    "line 0, field 12: data, chief-landing-apart (the chief rays land 1.53e-5 mm apart)",
    "line 0, field 16: data, chief-landing-unknown (two states no landing of its chief ray)",
  ]);
  // The unconverged field's transmission of 0.5 is in no figure: only the axis is of two methods.
  assert.equal(metric(outcome, "geometricTransmission.maxAbs")!.value, 0);
  // The sorting is R9b's, read of each answer's facts and of the facts it records alike.
  const recordedA = vignettingNativeComparator.recorded!(a as unknown as JsonObject);
  const recordedB = vignettingNativeComparator.recorded!(b as unknown as JsonObject);
  a.fields.forEach((fieldA, index) => {
    const live = classifyChiefField(vignettingFactsOf(fieldA), vignettingFactsOf(b.fields[index]), true, 1e-5);
    const again = classifyChiefField(
      vignettingFactsOfRecorded(recordedA, index),
      vignettingFactsOfRecorded(recordedB, index),
      true,
      1e-5,
    );
    assert.deepEqual(again, live, `field ${index}`);
  });
});

test("without a limit of the landing no field is set aside by it, and the pair's notes say so", () => {
  const unlimited: RungPolicy = { ...POLICY, metrics: {} };
  const outcome = compared(
    answer([field(0), field(12)]),
    answer([field(0), field(12, { chiefLandingMm: 1 })]),
    unlimited,
  );
  assert.equal(metric(outcome, "fields.compared")!.value, 2);
  assert.ok(outcome.comparable && outcome.notes?.[0]?.includes("sets no limit on chiefLanding.maxAbs"));
});

test("a field neither answer lets light through has no falloff, and the reason says so", () => {
  const dark = { geometricTransmission: 0, relativeIllumination: 0 };
  const outcome = compared(answer([field(0, dark)]), answer([field(0, dark)]));
  assert.equal(metric(outcome, "geometricTransmission.maxAbs")!.value, 0);
  assert.equal(metric(outcome, "falloff.maxAbs"), undefined);
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.unmeasured, [
    { name: "falloff.maxAbs", reason: "no field of two methods lets light through in both answers" },
  ]);
});

test("answers of other fields, lines or angles are not comparable", () => {
  const a = answer([field(0), field(8)]);
  for (const [b, reason] of [
    [answer([field(0)]), /for 1 and 2 fields/],
    [answer([field(0), field(8, { line: 1 })]), /entry 1 is of line 0 in one answer and 1/],
    [answer([field(0), field(9)]), /entry 1 is of the field at 8 degrees in one answer and 9/],
  ] as const) {
    const outcome = compared(a, b);
    assert.equal(outcome.comparable, false);
    assert.match(outcome.comparable ? "" : outcome.reason, reason);
  }
});
