// The comparator of `chief.native` for rung R9b: every field is sorted before a difference is taken, by R5's classes
// and this rung's own data reason; only a field of two methods is in a figure. Every number is synthetic and dyadic,
// so that every expected difference is exact.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CHIEF_LANDING_METRIC,
  chiefFactsOfRecorded,
  chiefNativeComparator,
  classifyChiefField,
} from "../../src/compare/chiefNative.ts";
import type { ChiefFieldFacts } from "../../src/compare/chiefNative.ts";
import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { ChiefNativeData, ChiefNativeField } from "../../src/contract/quantities/chiefNative.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";

const POLICY: RungPolicy = loadPolicy().rungs.r9b;
const LIMIT = 1e-5;

const NO_FIGURES = { realHeightMm: null, idealHeightMm: null, percent: null, entrancePupilZ: null, exitPupilZ: null };
const NO_REFERENCE = {
  focalScaleMm: null,
  probeAngleDeg: null,
  paraxialEntrancePupilZ: null,
  paraxialExitPupilZ: null,
};

function field(line: number, fieldAngleDeg: number, more: Partial<ChiefNativeField> = {}): ChiefNativeField {
  return {
    line,
    wavelengthNm: [587.5, 656.25][line] ?? 486.125,
    fieldAngleDeg,
    status: "ok",
    chiefLandingMm: -fieldAngleDeg / 2,
    figures: null,
    chiefRay: null,
    sampling: {},
    ...more,
  };
}

function compared(a: ChiefNativeData, b: ChiefNativeData, policy: RungPolicy | undefined = POLICY): ComparatorOutcome {
  return chiefNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, { policy });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

const FACTS: ChiefFieldFacts = { settled: 1, imageHeightMm: -5, rimRaysLost: null, indexMaxDelta: null };

test("a field is sorted by R5's classes first, then by indices that are not the case's, then by its landing", () => {
  const sorted = (a: ChiefFieldFacts, b: ChiefFieldFacts, same = true) => {
    const one = classifyChiefField(a, b, same, LIMIT);
    // Swapping the two answers changes nothing.
    assert.deepEqual(classifyChiefField(b, a, same, LIMIT), one);
    return [one.class, one.reason, one.banded];
  };
  assert.deepEqual(sorted(FACTS, { ...FACTS }), ["method", "two-methods", true]);
  assert.deepEqual(sorted(FACTS, { ...FACTS, settled: null }), ["unsupported", "no-curve", false]);
  assert.deepEqual(sorted(FACTS, FACTS, false), ["data", "lines-differ", false]);
  // One engine states indices off the case's, the other none: either way round, the field is data.
  assert.deepEqual(sorted(FACTS, { ...FACTS, indexMaxDelta: 2 ** -30 }), ["data", "indices-differ", false]);
  assert.deepEqual(sorted({ ...FACTS, indexMaxDelta: 0 }, { ...FACTS, indexMaxDelta: 0 }), [
    "method",
    "two-methods",
    true,
  ]);
  // The indices come before the landing: a field of other indices whose chief rays land apart is data by its indices.
  assert.deepEqual(sorted({ ...FACTS, indexMaxDelta: 2 ** -30 }, { ...FACTS, imageHeightMm: -4 }), [
    "data",
    "indices-differ",
    false,
  ]);
  assert.deepEqual(sorted(FACTS, { ...FACTS, imageHeightMm: -5 + 2 ** -10 }), ["data", "chief-landing-apart", false]);
  assert.deepEqual(sorted(FACTS, { ...FACTS, imageHeightMm: -5 + 2 ** -20 }), ["method", "two-methods", true]);
});

function distortion(percent: number[], real: number[], ideal: number[], scale: number): ChiefNativeData {
  return {
    kind: "distortion",
    fields: [5, 10].map((angle, at) =>
      field(0, angle, {
        figures: { ...NO_FIGURES, realHeightMm: real[at], idealHeightMm: ideal[at], percent: percent[at] },
      }),
    ),
    reference: { ...NO_REFERENCE, focalScaleMm: scale, probeAngleDeg: 0.25 },
    method: { name: "one", params: {} },
    notes: [],
  };
}

test("distortion: the differences of the percent, the real and ideal heights and the scales, field by field", () => {
  const a = distortion([-0.5, -1], [-2.5, -5], [-2.5 + 2 ** -10, -5 + 2 ** -8], 50);
  const b = distortion([-0.5 + 2 ** -12, -1 - 2 ** -9], [-2.5 + 2 ** -14, -5], [-2.5, -5], 50.5);
  const outcome = compared(a, b);
  assert.deepEqual(outcome.comparable ? outcome.metrics.map(({ name, value }) => [name, value]) : outcome.reason, [
    [CHIEF_LANDING_METRIC, 0],
    ["distortionPercent.maxAbs", 2 ** -9],
    ["realHeight.maxAbs", 2 ** -14],
    ["idealHeight.maxAbs", 2 ** -8],
    ["focalScale.relative", 0.5 / 50.5],
    ["fields.compared", 2],
    ["fields.data", 0],
    ["fields.unavailable", 0],
  ]);
  assert.deepEqual(metric(outcome, "distortionPercent.maxAbs")?.where, { line: 0, field: 10 });
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.inapplicable, [
    "lateralColour.maxAbs",
    "entrancePupil.maxAbs",
    "exitPupil.maxAbs",
    "paraxialEntrancePupil.maxAbs",
    "paraxialExitPupil.maxAbs",
  ]);
  assert.deepEqual(compared(b, a), outcome);
});

test("a field whose chief rays land apart is in no figure, named with its reason; without a limit none is set aside", () => {
  const a = distortion([-0.5, -1], [-2.5, -5], [-2.5, -5], 50);
  const apart = structuredClone(a);
  (apart.fields[1] as { chiefLandingMm: number }).chiefLandingMm = -5 + 2 ** -10;
  (apart.fields[1].figures as { percent: number }).percent = -2;
  const outcome = compared(a, apart);
  assert.equal(metric(outcome, CHIEF_LANDING_METRIC)?.value, 2 ** -10);
  assert.equal(metric(outcome, "distortionPercent.maxAbs")?.value, 0);
  assert.equal(metric(outcome, "fields.data")?.value, 1);
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.notes, [
    "line 0, field 10: data, chief-landing-apart (the chief rays land 9.77e-4 mm apart)",
  ]);
  const unlimited = compared(a, apart, { ...POLICY, metrics: {} });
  assert.equal(metric(unlimited, "distortionPercent.maxAbs")?.value, 1);
  assert.ok(unlimited.comparable);
  assert.match(unlimited.notes?.[0] ?? "", /sets no limit on chiefLanding\.maxAbs/);
});

function lateral(landings: number[][], index: number | null): ChiefNativeData {
  return {
    kind: "lateral-colour",
    fields: landings.flatMap((line, at) =>
      line.map((landing, f) =>
        field(at, [0, 10][f], { chiefLandingMm: landing, sampling: index === null ? {} : { indexMaxDelta: index } }),
      ),
    ),
    reference: NO_REFERENCE,
    method: { name: "chief", params: {} },
    notes: [],
  };
}

test("lateral colour: each landing relative to the first line, where both lines are of two methods", () => {
  const a = lateral(
    [
      [0, -5],
      [0, -5 + 2 ** -12],
    ],
    0,
  );
  const b = lateral(
    [
      [0, -5 + 2 ** -18],
      [0, -5 + 2 ** -12 - 2 ** -18],
    ],
    null,
  );
  const outcome = compared(a, b);
  assert.equal(metric(outcome, "lateralColour.maxAbs")?.value, 2 ** -17);
  assert.deepEqual(metric(outcome, "lateralColour.maxAbs")?.where, { line: 1, field: 10 });
  assert.equal(metric(outcome, CHIEF_LANDING_METRIC)?.value, 2 ** -18);
  // A second line set aside by its landing takes its field out of the colour.
  const apart = lateral(
    [
      [0, -5],
      [0, -5 + 2 ** -12 + 2 ** -14],
    ],
    0,
  );
  assert.equal(metric(compared(a, apart), "fields.data")?.value, 1);
  assert.equal(metric(compared(a, apart), "lateralColour.maxAbs")?.value, 0);
  // An engine that traced other indices: every field is data, and no colour is taken.
  const other = compared(
    lateral(
      [
        [0, -5],
        [0, -5],
      ],
      2 ** -30,
    ),
    b,
  );
  assert.equal(metric(other, "fields.data")?.value, 4);
  assert.ok(other.comparable);
  assert.deepEqual(
    other.unmeasured?.map(({ name }) => name),
    ["lateralColour.maxAbs"],
  );
  assert.match(other.notes?.[0] ?? "", /data, indices-differ \(chief traced indices up to 9\.31e-10 from the case's\)/);
  // A request of one line has no colour to take, and says so.
  const single = compared(lateral([[0, -5]], null), lateral([[0, -5]], null));
  assert.ok(single.comparable);
  assert.match(single.unmeasured?.[0].reason ?? "", /of one line/);
});

function pupils(rays: boolean): ChiefNativeData {
  // Of the field at 10 degrees: a chief ray that enters at (0, 2, 0) heading (0, -1/4, 1) and leaves at (0, -1, 50)
  // heading (0, -1/8, 1) crosses the axis at z = 8 ahead and at z = 42 behind; the figures say the same.
  const figures = { ...NO_FIGURES, entrancePupilZ: 8, exitPupilZ: 42 };
  const chiefRay = {
    entryPoint: [0, 2, 0],
    entryDirection: [0, -0.25, 1],
    exitPoint: [0, -1, 50],
    exitDirection: [0, -0.125, 1],
  };
  return {
    kind: "pupils",
    fields: [field(0, 10, rays ? { chiefRay } : { figures })],
    reference: { ...NO_REFERENCE, paraxialEntrancePupilZ: 8.5, paraxialExitPupilZ: rays ? 41.75 : 42 },
    method: { name: rays ? "rays" : "figures", params: {} },
    notes: [],
  };
}

test("pupils: an engine's figures beside the crossings of the other's chief ray, and the paraxial pupils", () => {
  const outcome = compared(pupils(false), pupils(true));
  assert.deepEqual(outcome.comparable ? outcome.metrics.map(({ name, value }) => [name, value]) : outcome.reason, [
    [CHIEF_LANDING_METRIC, 0],
    ["entrancePupil.maxAbs", 0],
    ["exitPupil.maxAbs", 0],
    ["paraxialEntrancePupil.maxAbs", 0],
    ["paraxialExitPupil.maxAbs", 0.25],
    ["fields.compared", 1],
    ["fields.data", 0],
    ["fields.unavailable", 0],
  ]);
  // A chief ray that runs parallel to the axis behind the system has no exit pupil: noted, and no figure of it.
  const parallel = pupils(true);
  (parallel.fields[0].chiefRay as unknown as { exitDirection: number[] }).exitDirection = [0, 0, 1];
  const noted = compared(pupils(false), parallel);
  assert.ok(noted.comparable);
  assert.deepEqual(
    noted.unmeasured?.map(({ name }) => name),
    ["exitPupil.maxAbs"],
  );
  assert.deepEqual(noted.notes, ["line 0, field 10: a chief ray does not cross the axis behind the system"]);
});

test("answers of other kinds, of other numbers of fields or of other lines are not comparable", () => {
  const a = distortion([0, 0], [-2.5, -5], [-2.5, -5], 50);
  assert.equal(compared(a, pupils(false)).comparable, false);
  assert.equal(compared(a, { ...a, fields: a.fields.slice(1) }).comparable, false);
  const other = structuredClone(a);
  (other.fields[1] as { line: number }).line = 1;
  assert.equal(compared(a, other).comparable, false);
});

test("the sorting is repeated from what a comparison records, class by class", () => {
  const answers = [
    lateral(
      [
        [0, -5],
        [0, -5],
      ],
      0,
    ),
    lateral(
      [
        [0, -5 + 2 ** -10],
        [0, -5],
      ],
      null,
    ),
    lateral(
      [
        [0, -5],
        [0, -5],
      ],
      2 ** -30,
    ),
  ];
  const unavailable = structuredClone(answers[0]);
  Object.assign(unavailable.fields[3], { status: "unavailable", reason: "lost", chiefLandingMm: null });
  for (const [one, two] of [
    [answers[0], answers[1]],
    [answers[0], answers[2]],
    [answers[0], unavailable],
  ]) {
    const [a, b] = [one, two].map((data) => chiefNativeComparator.recorded!(data as unknown as JsonObject));
    one.fields.forEach((fieldA, at) => {
      const direct = classifyChiefField(
        {
          settled: fieldA.chiefLandingMm === null || fieldA.status !== "ok" ? null : 1,
          imageHeightMm: fieldA.chiefLandingMm,
          rimRaysLost: null,
          indexMaxDelta: fieldA.sampling.indexMaxDelta ?? null,
        },
        {
          settled: two.fields[at].chiefLandingMm === null || two.fields[at].status !== "ok" ? null : 1,
          imageHeightMm: two.fields[at].chiefLandingMm,
          rimRaysLost: null,
          indexMaxDelta: two.fields[at].sampling.indexMaxDelta ?? null,
        },
        true,
        LIMIT,
      );
      const repeated = classifyChiefField(chiefFactsOfRecorded(a, at), chiefFactsOfRecorded(b, at), true, LIMIT);
      assert.deepEqual(repeated, direct, `field ${at}`);
    });
  }
});
