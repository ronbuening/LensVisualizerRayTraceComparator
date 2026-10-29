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
 * `LENS` clips (4.5 mm), its sagittal pair and the sagittal fan's centre, where the chief ray starts; and 4 degrees,
 * with its pairs. The chief rays are rays 6 and 11.
 */
const SPEC = specOf([...field(0, [-0.5, 0.5, 4.5], [-0.4, 0.4, 0], 0.75), ...field(4, [-0.25, 0.25], [-0.25, 0.25])]);
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

const ALL_OK = [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1];

test("the fields of a curvature set are its blocks of one direction, each its chief ray last, its fans by place", () => {
  assert.deepEqual(curvatureFieldsOf(SPEC as unknown as JsonObject, 12), [
    { chief: 6, tangential: [0, 1, 2], sagittal: [3, 4] },
    { chief: 11, tangential: [7, 8], sagittal: [9, 10] },
  ]);
  // A ray where its chief ray starts is the centre of a fan, or a sample held by the chief ray, in neither, in either
  // half; a ray of the sagittal half off the chief ray along x is of the sagittal fan whatever its y (an aimed sagittal
  // ray starts off the chief ray's height too).
  const centred = specOf([...field(0, [0, 0.5], [0.5, 0])]);
  assert.deepEqual(curvatureFieldsOf(centred as unknown as JsonObject, 5), [
    { chief: 4, tangential: [1], sagittal: [2] },
  ]);
  const lifted = specOf([
    [0, 0.25, -10, 0, 0, 1],
    [0.5, 2 ** -20, -10, 0, 0, 1],
    [0, 0, -10, 0, 0, 1],
  ]);
  assert.deepEqual(curvatureFieldsOf(lifted as unknown as JsonObject, 3), [
    { chief: 2, tangential: [0], sagittal: [1] },
  ]);
  // Exactly where its half says, or the set is no curvature set: a skew or stray ray is refused, never read into a fan.
  for (const [launches, reason] of [
    // The sagittal fan first: a ray off the chief ray along x in the tangential half.
    [
      [
        [0.5, 0, -10, 0, 0, 1],
        [0, 0.25, -10, 0, 0, 1],
        [0, 0, -10, 0, 0, 1],
      ],
      /^ray 0, of the tangential half of the field of chief ray 2, starts off it along x/,
    ],
    // A skew ray in the tangential half, off along x by the least step there is.
    [
      [
        [2 ** -1074, 0.25, -10, 0, 0, 1],
        [0.5, 0, -10, 0, 0, 1],
        [0, 0, -10, 0, 0, 1],
      ],
      /^ray 0, of the tangential half of the field of chief ray 2, starts off it along x/,
    ],
    // A ray off the chief ray along y alone in the sagittal half.
    [
      [
        [0, 0.25, -10, 0, 0, 1],
        [0, -0.25, -10, 0, 0, 1],
        [0, 0, -10, 0, 0, 1],
      ],
      /^ray 1, of the sagittal half of the field of chief ray 2, starts off it along y/,
    ],
    // Fans of different numbers of rays.
    [
      [
        [0, 0.25, -10, 0, 0, 1],
        [0, -0.25, -10, 0, 0, 1],
        [0.5, 0, -10, 0, 0, 1],
        [0, 0, -10, 0, 0, 1],
      ],
      /^the field of chief ray 3 has 3 rays beside it: its two fans cannot be of one number/,
    ],
  ] as const) {
    const malformed = specOf(launches as unknown as Launch[]);
    assert.match(String(curvatureFieldsOf(malformed as unknown as JsonObject, launches.length)), reason);
    const answer = traceOf(malformed);
    const refused = compared(answer, answer, { spec: malformed, opticalCase: LENS });
    assert.ok(!refused.comparable);
    assert.match(refused.reason, reason);
  }
  const behind = specOf([
    [0, 0.5, -11, 0, 0, 1],
    [0.5, 0, -10, 0, 0, 1],
    [0, 0, -10, 0, 0, 1],
  ]);
  assert.match(
    String(curvatureFieldsOf(behind as unknown as JsonObject, 3)),
    /^ray 0 starts beside its field's chief ray, ray 2, off its plane of launch/,
  );
  assert.match(String(curvatureFieldsOf(undefined, 11)), /the spec of the request is not at hand/);
  assert.match(String(curvatureFieldsOf(SPEC as unknown as JsonObject, 7)), /the request is of 12 rays/);
});

test("the reference engine brings every ray to the image but the one the stop clips", () => {
  assert.deepEqual([...decodeNdArray(BASE.status).values], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
      ["rays.compared", 11],
      ["rays.dropped", 0],
      ["fields.compared", 2],
    ],
  );
  assert.equal(outcome.unmeasured, undefined);
});

test("a landing moved along y moves the tangential focus by the step over the relative slope, judged as half the step", () => {
  const step = 2 ** -26;
  const moved = changed(BASE, (arrays) => {
    arrays.imagePoint[3 * 8 + 1] += step;
  });
  const outcome = compared(BASE, moved);
  const [first, second] = [
    focusOf(BASE, 11, [7, 8], "tangential", ALL_OK),
    focusOf(moved, 11, [7, 8], "tangential", ALL_OK),
  ];
  const along = Math.abs(first.shiftMm - second.shiftMm);
  const scaled = metric(outcome, "tangentialFocus.maxScaled");
  assert.deepEqual(
    [scaled?.value, scaled?.where],
    [along * Math.max(first.rmsSlope, second.rmsSlope), { line: 0, ray: 11 }],
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
    const chief = arrays.exitDirection[3 * 6];
    for (const ray of [3, 4]) {
      arrays.exitDirection[3 * ray] = chief + (arrays.exitDirection[3 * ray] - chief) / 4;
    }
  });
  const [reference, wrong] = [
    focusOf(BASE, 6, [3, 4], "sagittal", ALL_OK),
    focusOf(smaller, 6, [3, 4], "sagittal", ALL_OK),
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
    stopAt(arrays, 6, 2);
    stopAt(arrays, 11, 2);
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
  // The two fields' sagittal pairs alone, each tangential half held by the chief ray; the axis's pair is stopped in
  // both answers, so the first reason met is of a sagittal fan, and it is never said of the tangential figures.
  const sagittal = specOf([...field(0, [0, 0], [-0.4, 0.4], 0.75), ...field(4, [0, 0], [-0.25, 0.25])]);
  assert.deepEqual(curvatureFieldsOf(sagittal as unknown as JsonObject, 10), [
    { chief: 4, tangential: [], sagittal: [2, 3] },
    { chief: 9, tangential: [], sagittal: [7, 8] },
  ]);
  const both = changed(traceOf(sagittal), (arrays) => {
    stopAt(arrays, 2, 2);
    stopAt(arrays, 3, 2);
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
    stopAt(arrays, 7, 2);
    stopAt(arrays, 8, 2);
  });
  const lost = compared(none, structuredClone(none), { spec: sagittal, opticalCase: LENS });
  assert.ok(lost.comparable);
  const reasons = Object.fromEntries((lost.unmeasured ?? []).map(({ name, reason }) => [name, reason]));
  assert.equal(
    reasons["sagittalFocus.maxScaled"],
    "no-rays: the sagittal fan of the field of chief ray 4: no ray of the sagittal fan is taken",
  );
  assert.equal(reasons["tangentialFocus.maxAbs"], "no field of the set has a tangential fan");
  assert.equal(reasons["astigmatism.maxAbs"], "no field of the set has a tangential fan");
});

test("a fan with a focus in one answer and none in the other, and a set that is no curvature set, are not comparable", () => {
  // The sagittal rays of the 4 degree field leave parallel to the chief ray in one answer: no plane is its focus.
  const parallel = changed(BASE, (arrays) => {
    for (const ray of [9, 10]) {
      for (let at = 0; at < 3; at++) arrays.exitDirection[3 * ray + at] = arrays.exitDirection[3 * 11 + at];
    }
  });
  const outcome = compared(BASE, parallel);
  assert.ok(!outcome.comparable);
  assert.match(
    outcome.reason,
    /the field of chief ray 11: its sagittal fan in the first answer has a focus, in the second has none: no-slope/,
  );
  const behind = specOf([
    [0, 0.5, -11, 0, 0, 1],
    [0.5, 0, -10, 0, 0, 1],
    [0, 0, -10, 0, 0, 1],
  ]);
  const answer = traceOf(behind);
  const refused = compared(answer, answer, { spec: behind, opticalCase: LENS });
  assert.ok(!refused.comparable);
  assert.match(refused.reason, /^ray 0 starts beside its field's chief ray, ray 2, off its plane of launch/);
});
