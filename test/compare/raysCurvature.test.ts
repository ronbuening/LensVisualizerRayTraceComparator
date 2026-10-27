// The comparator of `rays.trace` for rung R10a, on the reference engine's trace of a curvature set of two fields
// through a small lens, and on copies of it with a landing moved, a fan's slopes made smaller, a ray stopped. Every
// number is synthetic; where a fan focuses is the estimator's, whose proofs are test/estimators/fieldFocus.test.ts.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { curvatureFieldsOf, raysCurvatureComparator } from "../../src/compare/raysCurvature.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { relativeFocus } from "../../src/estimators/fieldFocus.ts";
import { LENS, changed, stopAt, traceOf } from "./raysSupport.ts";

/** The launch of one ray: where it starts, and its direction. */
type Launch = readonly [x: number, y: number, z: number, l: number, m: number, n: number];

/**
 * A field of a curvature set: its tangential rays at the heights `ys` beside the chief ray, its sagittal rays at `xs`,
 * then the chief ray, every ray along the field's direction (0, -sin, cos) of `angleDeg`, from z = -10. The chief ray
 * crosses the plane z = 0 at (`x0`, 0): off the axis, the central obstruction of `LENS` passes it.
 */
function field(angleDeg: number, ys: readonly number[], xs: readonly number[], x0 = 0): Launch[] {
  const radians = (angleDeg * Math.PI) / 180;
  const [m, n] = [-Math.sin(radians), Math.cos(radians)];
  const y0 = (10 * -m) / n;
  return [
    ...ys.map((y): Launch => [x0, y0 + y, -10, 0, m, n]),
    ...xs.map((x): Launch => [x0 + x, y0, -10, 0, m, n]),
    [x0, y0, -10, 0, m, n],
  ];
}

function specOf(launches: readonly Launch[], line = 0): RaysTraceSpec {
  const rays = launches.length;
  return {
    line,
    origins: encodeNdArray(Float64Array.from(launches.flatMap((launch) => launch.slice(0, 3))), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(launches.flatMap((launch) => launch.slice(3))), [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1)),
  };
}

/**
 * Two fields: along the axis, its chief ray 0.75 mm off it, with its tangential pair, a tangential ray the stop of
 * `LENS` clips (4.5 mm) and its sagittal pair; and 4 degrees, with its pairs. The chief rays are rays 5 and 10.
 */
const SPEC = specOf([...field(0, [-0.5, 0.5, 4.5], [-0.4, 0.4], 0.75), ...field(4, [-0.25, 0.25], [-0.25, 0.25])]);
const BASE = traceOf(SPEC);
const CONTEXT = { spec: SPEC as unknown as JsonObject, opticalCase: LENS };

function compared(a: RaysTraceData, b: RaysTraceData, context: object = CONTEXT): ComparatorOutcome {
  return raysCurvatureComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, context);
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

/** The estimator's focus of an answer's fan, of the rays ok in both answers (`valid`). */
function focusOf(
  data: RaysTraceData,
  chief: number,
  members: number[],
  axis: "tangential" | "sagittal",
  valid: number[],
) {
  const focus = relativeFocus(
    {
      landing: decodeNdArray(data.imagePoint).values as Float64Array,
      direction: decodeNdArray(data.exitDirection).values as Float64Array,
      valid,
    },
    chief,
    members,
    axis,
  );
  assert.ok(focus.available);
  return focus;
}

const ALL_OK = [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1];

test("the fields of a curvature set are its blocks of one direction, each its chief ray last, its fans by offset", () => {
  assert.deepEqual(curvatureFieldsOf(SPEC as unknown as JsonObject, 11), [
    { chief: 5, tangential: [0, 1, 2], sagittal: [3, 4] },
    { chief: 10, tangential: [6, 7], sagittal: [8, 9] },
  ]);
  // A ray where its chief ray starts is the centre of a fan, in neither; one offset along both is no curvature set.
  const centred = specOf([...field(0, [0, 0.5], [0.5])]);
  assert.deepEqual(curvatureFieldsOf(centred as unknown as JsonObject, 4), [
    { chief: 3, tangential: [1], sagittal: [2] },
  ]);
  const both = specOf([
    [0.5, 0.5, -10, 0, 0, 1],
    [0, 0, -10, 0, 0, 1],
  ]);
  assert.match(
    String(curvatureFieldsOf(both as unknown as JsonObject, 2)),
    /^ray 0 starts beside its field's chief ray/,
  );
  assert.match(String(curvatureFieldsOf(undefined, 11)), /the spec of the request is not at hand/);
  assert.match(String(curvatureFieldsOf(SPEC as unknown as JsonObject, 7)), /the request is of 11 rays/);
});

test("the reference engine brings every ray to the image but the one the stop clips", () => {
  assert.deepEqual([...decodeNdArray(BASE.status).values], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test("a faithful copy differs by nothing: every figure 0, both fields' foci compared", () => {
  const outcome = compared(BASE, structuredClone(BASE));
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["landing.maxAbs", 0],
      ["tangentialFocus.maxScaled", 0],
      ["tangentialFocus.maxAbs", 0],
      ["sagittalFocus.maxScaled", 0],
      ["sagittalFocus.maxAbs", 0],
      ["astigmatism.maxAbs", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", 10],
      ["rays.dropped", 0],
      ["fields.compared", 2],
    ],
  );
  assert.equal(outcome.unmeasured, undefined);
});

test("a landing moved along y moves the tangential focus by the step over the relative slope, judged as half the step", () => {
  const step = 2 ** -26;
  const moved = changed(BASE, (arrays) => {
    arrays.imagePoint[3 * 7 + 1] += step;
  });
  const outcome = compared(BASE, moved);
  const [first, second] = [
    focusOf(BASE, 10, [6, 7], "tangential", ALL_OK),
    focusOf(moved, 10, [6, 7], "tangential", ALL_OK),
  ];
  const along = Math.abs(first.shiftMm - second.shiftMm);
  const scaled = metric(outcome, "tangentialFocus.maxScaled");
  assert.deepEqual(
    [scaled?.value, scaled?.where],
    [along * Math.max(first.rmsSlope, second.rmsSlope), { line: 0, ray: 10 }],
  );
  assert.equal(metric(outcome, "tangentialFocus.maxAbs")?.value, along);
  assert.equal(metric(outcome, "astigmatism.maxAbs")?.value, along);
  assert.equal(metric(outcome, "sagittalFocus.maxAbs")?.value, 0);
  assert.equal(metric(outcome, "landing.maxAbs")?.value, step);
  // The focus moves far along the axis, a step over a relative slope; across it, half the step: of a pair of relative
  // slopes -d and d, the focus moves by step / 2d, and the RMS relative slope is d.
  assert.ok(along > 10 * step);
  assert.ok(Math.abs(scaled!.value - step / 2) < 0.01 * step, `${scaled!.value} against ${step}`);
  // Swapping the two answers changes no value.
  assert.deepEqual(compared(moved, BASE), outcome);
});

test("the focus is scaled by the larger of the two answers' relative slopes, never the one engine's", () => {
  // An engine whose sagittal rays of the axis leave at a quarter of their slope apart from the chief ray's, and land
  // where the reference's do: its focus is about four times as far, and its own RMS slope about a quarter of the
  // reference's.
  const smaller = changed(BASE, (arrays) => {
    const chief = arrays.exitDirection[3 * 5];
    for (const ray of [3, 4]) {
      arrays.exitDirection[3 * ray] = chief + (arrays.exitDirection[3 * ray] - chief) / 4;
    }
  });
  const [reference, wrong] = [
    focusOf(BASE, 5, [3, 4], "sagittal", ALL_OK),
    focusOf(smaller, 5, [3, 4], "sagittal", ALL_OK),
  ];
  const along = Math.abs(reference.shiftMm - wrong.shiftMm);
  assert.ok(wrong.rmsSlope < reference.rmsSlope / 3);
  for (const [a, b] of [
    [BASE, smaller],
    [smaller, BASE],
  ]) {
    const scaled = metric(compared(a, b), "sagittalFocus.maxScaled")?.value;
    assert.equal(scaled, along * reference.rmsSlope);
    assert.ok(scaled! > 3 * along * wrong.rmsSlope, "the wrong engine's slope would scale its own difference away");
  }
});

test("a ray stopped in one answer is a mask mismatch, dropped from both foci; a chief ray stopped leaves its field out", () => {
  const stopped = changed(BASE, (arrays) => stopAt(arrays, 0, 2));
  const outcome = compared(BASE, stopped);
  assert.equal(metric(outcome, "mask.mismatches")?.value, 1);
  assert.deepEqual(metric(outcome, "rays.dropped"), { name: "rays.dropped", value: 1, where: { line: 0, ray: 0 } });
  assert.equal(metric(outcome, "tangentialFocus.maxAbs")?.value, 0, "both foci of the axis are of ray 1 alone");
  const chiefless = changed(BASE, (arrays) => {
    stopAt(arrays, 5, 2);
    stopAt(arrays, 10, 2);
  });
  const lost = compared(BASE, chiefless);
  assert.ok(lost.comparable);
  assert.deepEqual(
    lost.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["tangentialFocus.maxScaled", "no-reference"],
      ["tangentialFocus.maxAbs", "no-reference"],
      ["sagittalFocus.maxScaled", "no-reference"],
      ["sagittalFocus.maxAbs", "no-reference"],
      ["astigmatism.maxAbs", "no-reference"],
    ],
  );
  assert.equal(metric(lost, "fields.compared")?.value, 0);
});

test("a fan's figures are unmeasured for a reason of that fan's own: a set of sagittal fans alone", () => {
  // The two fields' sagittal pairs alone; the axis's pair is stopped in both answers, so the first reason met is of a
  // sagittal fan, and it is never said of the tangential figures.
  const sagittal = specOf([...field(0, [], [-0.4, 0.4], 0.75), ...field(4, [], [-0.25, 0.25])]);
  assert.deepEqual(curvatureFieldsOf(sagittal as unknown as JsonObject, 6), [
    { chief: 2, tangential: [], sagittal: [0, 1] },
    { chief: 5, tangential: [], sagittal: [3, 4] },
  ]);
  const both = changed(traceOf(sagittal), (arrays) => {
    stopAt(arrays, 0, 2);
    stopAt(arrays, 1, 2);
  });
  const outcome = compared(both, structuredClone(both), { spec: sagittal, opticalCase: LENS });
  assert.equal(metric(outcome, "sagittalFocus.maxScaled")?.value, 0);
  assert.equal(metric(outcome, "fields.compared")?.value, 0);
  assert.deepEqual(outcome.comparable ? outcome.unmeasured : undefined, [
    { name: "tangentialFocus.maxScaled", reason: "no field of the set has a tangential fan" },
    { name: "tangentialFocus.maxAbs", reason: "no field of the set has a tangential fan" },
    { name: "astigmatism.maxAbs", reason: "no field of the set has a tangential fan" },
  ]);
  // With every sagittal ray stopped, the sagittal figures say why, of the sagittal fan.
  const none = changed(both, (arrays) => {
    stopAt(arrays, 3, 2);
    stopAt(arrays, 4, 2);
  });
  const lost = compared(none, structuredClone(none), { spec: sagittal, opticalCase: LENS });
  assert.ok(lost.comparable);
  const reasons = Object.fromEntries((lost.unmeasured ?? []).map(({ name, reason }) => [name, reason]));
  assert.equal(
    reasons["sagittalFocus.maxScaled"],
    "no-rays: the sagittal fan of the field of chief ray 2: no ray of the sagittal fan is taken",
  );
  assert.equal(reasons["tangentialFocus.maxAbs"], "no field of the set has a tangential fan");
  assert.equal(reasons["astigmatism.maxAbs"], "no field of the set has a tangential fan");
});

test("a fan with a focus in one answer and none in the other, and a set that is no curvature set, are not comparable", () => {
  // The sagittal rays of the 4 degree field leave parallel to the chief ray in one answer: no plane is its focus.
  const parallel = changed(BASE, (arrays) => {
    for (const ray of [8, 9]) {
      for (let at = 0; at < 3; at++) arrays.exitDirection[3 * ray + at] = arrays.exitDirection[3 * 10 + at];
    }
  });
  const outcome = compared(BASE, parallel);
  assert.ok(!outcome.comparable);
  assert.match(
    outcome.reason,
    /the field of chief ray 10: its sagittal fan in the first answer has a focus, in the second has none: no-slope/,
  );
  const skew = specOf([
    [0.5, 0.5, -10, 0, 0, 1],
    [0, 0, -10, 0, 0, 1],
  ]);
  const answer = traceOf(skew);
  const refused = compared(answer, answer, { spec: skew, opticalCase: LENS });
  assert.ok(!refused.comparable);
  assert.match(refused.reason, /^ray 0 starts beside its field's chief ray/);
});
