// The comparator of `curvature.native` for rung R10b: every field is sorted before a difference is taken, by R9b's
// sorting (R5's classes, then indices that are not the case's, then the chief rays' landing); only a field of two
// methods is in a figure. Every number is synthetic and dyadic, so that every expected difference is exact.
import assert from "node:assert/strict";
import { test } from "node:test";

import { classifyChiefField } from "../../src/compare/chiefNative.ts";
import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import {
  CHIEF_LANDING_METRIC,
  curvatureFactsOf,
  curvatureFactsOfRecorded,
  curvatureNativeComparator,
} from "../../src/compare/curvatureNative.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { CurvatureNativeData, CurvatureNativeField } from "../../src/contract/quantities/curvatureNative.ts";

const POLICY: RungPolicy = loadPolicy().rungs.r10b;
const LIMIT = 1e-5;

function field(line: number, fieldAngleDeg: number, more: Partial<CurvatureNativeField> = {}): CurvatureNativeField {
  return {
    line,
    wavelengthNm: [587.5, 656.25][line] ?? 486.125,
    fieldAngleDeg,
    status: "ok",
    chiefLandingMm: -fieldAngleDeg / 2,
    tangentialShiftMm: fieldAngleDeg / 512,
    sagittalShiftMm: -fieldAngleDeg / 1024,
    sampling: {},
    ...more,
  };
}

function answer(fields: CurvatureNativeField[], name = "one"): CurvatureNativeData {
  return { fields, method: { name, params: {} }, notes: [] };
}

function compared(
  a: CurvatureNativeData,
  b: CurvatureNativeData,
  policy: RungPolicy | undefined = POLICY,
): ComparatorOutcome {
  return curvatureNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, { policy });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

const FIGURES = ["tangentialShift.maxAbs", "sagittalShift.maxAbs", "astigmatism.maxAbs"];

test("the policy gives the landing its limit of 1e-5 mm and each figure an attention band of 1e-5 mm", () => {
  assert.deepEqual(POLICY.metrics[CHIEF_LANDING_METRIC], { attention: LIMIT, unit: "mm" });
  for (const name of FIGURES) assert.deepEqual(POLICY.metrics[name], { attention: LIMIT, unit: "mm" }, name);
});

test("a pair is RECORDED with every figure within its band, and ATTENTION with one figure above it", () => {
  // Below the band 2^-17 mm (7.6e-6), above it 2^-16 mm (1.5e-5): each figure in turn the one above, the others within.
  const [within, above] = [2 ** -17, 2 ** -16];
  const a = answer([field(0, 0), field(0, 10)]);
  const pairOf = (tangential: number, sagittal: number) => {
    const b = answer([
      field(0, 0),
      field(0, 10, { tangentialShiftMm: 10 / 512 + tangential, sagittalShiftMm: -10 / 1024 + sagittal }),
    ]);
    return comparePair(
      { engine: "lv", fingerprint: "a", status: "ok", data: a as unknown as JsonObject },
      { engine: "optiland", fingerprint: "b", status: "ok", data: b as unknown as JsonObject },
      POLICY,
      curvatureNativeComparator,
    );
  };
  const values = (pair: ReturnType<typeof pairOf>) =>
    FIGURES.map((name) => pair.metrics.find((m) => m.name === name)?.value);
  const recorded = pairOf(within, within / 2);
  assert.deepEqual([recorded.verdict, values(recorded)], ["RECORDED", [within, within / 2, within / 2]]);
  for (const [tangential, sagittal, figure, expected] of [
    [above, within, "tangentialShift.maxAbs", [above, within, above - within]],
    [within, above, "sagittalShift.maxAbs", [within, above, above - within]],
    [within, -within, "astigmatism.maxAbs", [within, within, above]],
  ] as const) {
    const pair = pairOf(tangential, sagittal);
    assert.deepEqual([pair.verdict, values(pair)], ["ATTENTION", expected], figure);
    assert.match(
      pair.reason ?? "",
      new RegExp(`^${figure.replace(".", "\\.")} \\S+ is outside its attention band`),
      figure,
    );
    for (const other of FIGURES.filter((name) => name !== figure)) assert.ok(!pair.reason?.includes(other), other);
  }
});

test("the differences of the two foci and of their astigmatism, field by field, of the fields of two methods", () => {
  const a = answer([field(0, 0), field(0, 10), field(0, 20)]);
  const b = answer([
    field(0, 0),
    field(0, 10, { tangentialShiftMm: 10 / 512 + 2 ** -16, chiefLandingMm: -5 + 2 ** -20 }),
    field(0, 20, { sagittalShiftMm: -20 / 1024 - 2 ** -12, tangentialShiftMm: 20 / 512 - 2 ** -14 }),
  ]);
  const outcome = compared(a, b);
  assert.deepEqual(outcome.comparable ? outcome.metrics.map(({ name, value, where }) => [name, value, where]) : [], [
    [CHIEF_LANDING_METRIC, 2 ** -20, { line: 0, field: 10 }],
    ["tangentialShift.maxAbs", 2 ** -14, { line: 0, field: 20 }],
    ["sagittalShift.maxAbs", 2 ** -12, { line: 0, field: 20 }],
    ["astigmatism.maxAbs", 2 ** -12 - 2 ** -14, { line: 0, field: 20 }],
    ["fields.compared", 3, undefined],
    ["fields.data", 0, undefined],
    ["fields.unavailable", 0, undefined],
  ]);
  // Swapping the two answers changes no value.
  assert.deepEqual(compared(b, a), outcome);
});

test("a field is sorted before any difference: unavailable, other indices, landings apart or unknown are in no figure", () => {
  const a = answer(
    [field(0, 0), field(0, 10), field(0, 20), field(1, 0), field(1, 10), field(1, 20)],
    "lv-field-curves",
  );
  const b = answer(
    [
      field(0, 0, { tangentialShiftMm: 1 }),
      field(0, 10, { chiefLandingMm: -5 + 2 ** -10, tangentialShiftMm: 1 }),
      field(0, 20, { status: "unavailable", reason: "no-focus", tangentialShiftMm: null, sagittalShiftMm: null }),
      field(1, 0, { sampling: { indexMaxDelta: 2 ** -30 }, tangentialShiftMm: 1 }),
      field(1, 10, { chiefLandingMm: null, tangentialShiftMm: 1 }),
      field(1, 20),
    ],
    "optiland-field-curvature",
  );
  const outcome = compared(a, b);
  assert.ok(outcome.comparable);
  // Only the axis of line 0 and the edge of line 1 are of two methods: the axis differs by 1, the edge by nothing.
  assert.equal(metric(outcome, "tangentialShift.maxAbs")?.value, 1);
  assert.deepEqual(metric(outcome, "tangentialShift.maxAbs")?.where, { line: 0, field: 0 });
  assert.equal(metric(outcome, "fields.compared")?.value, 2);
  assert.equal(metric(outcome, "fields.data")?.value, 3);
  assert.equal(metric(outcome, "fields.unavailable")?.value, 1);
  assert.deepEqual(outcome.notes, [
    "line 0, field 10: data, chief-landing-apart (the chief rays land 9.77e-4 mm apart)",
    "line 0, field 20: unsupported, no-curve (optiland-field-curvature: unavailable (no-focus))",
    "line 1, field 0: data, indices-differ (optiland-field-curvature traced indices up to 9.31e-10 from the case's)",
    "line 1, field 10: data, chief-landing-unknown (optiland-field-curvature states no landing of its chief ray)",
  ]);
  // The landing of a field set aside by it is still the largest landing; an unavailable field's is in none.
  assert.equal(metric(outcome, CHIEF_LANDING_METRIC)?.value, 2 ** -10);
  // Without a limit, no field is set aside by its landing, and the reason says so.
  const free = compared(a, b, { ...POLICY, metrics: {} });
  assert.equal(metric(free, "fields.compared")?.value, 3);
  assert.ok(free.comparable && free.notes?.[0].startsWith("the rung sets no limit on chiefLanding.maxAbs"));
});

test("no field of two methods leaves every figure unmeasured; answers of other fields or lines are not comparable", () => {
  const a = answer([field(0, 0)]);
  const b = answer([field(0, 0, { chiefLandingMm: 1 })]);
  const outcome = compared(a, b);
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.unmeasured?.map(({ name }) => name),
    ["tangentialShift.maxAbs", "sagittalShift.maxAbs", "astigmatism.maxAbs"],
  );
  assert.equal(compared(a, answer([field(0, 0), field(0, 10)])).comparable, false);
  assert.equal(compared(a, answer([field(1, 0)])).comparable, false);
});

test("the sorting is repeated from what a comparison records, field by field", () => {
  const base = answer([field(0, 0), field(0, 10), field(1, 0), field(1, 10)]);
  const others = [
    answer([
      field(0, 0, { chiefLandingMm: 2 ** -10 }),
      field(0, 10),
      field(1, 0, { chiefLandingMm: null }),
      field(1, 10, { sampling: { indexMaxDelta: 2 ** -30 } }),
    ]),
    answer([
      field(0, 0, {
        status: "unavailable",
        reason: "lost",
        chiefLandingMm: null,
        tangentialShiftMm: null,
        sagittalShiftMm: null,
      }),
      field(0, 10, { wavelengthNm: 600 }),
      field(1, 0),
      field(1, 10, { sampling: { indexMaxDelta: 0 } }),
    ]),
  ];
  for (const other of others) {
    const [a, b] = [base, other].map((data) => curvatureNativeComparator.recorded!(data as unknown as JsonObject));
    base.fields.forEach((fieldA, at) => {
      const fieldB = other.fields[at];
      const same = fieldA.wavelengthNm === fieldB.wavelengthNm;
      const direct = classifyChiefField(curvatureFactsOf(fieldA), curvatureFactsOf(fieldB), same, LIMIT);
      const sameRecorded = a.wavelengthNm[at] === b.wavelengthNm[at];
      const repeated = classifyChiefField(
        curvatureFactsOfRecorded(a, at),
        curvatureFactsOfRecorded(b, at),
        sameRecorded,
        LIMIT,
      );
      assert.deepEqual(repeated, direct, `field ${at}`);
    });
  }
});
