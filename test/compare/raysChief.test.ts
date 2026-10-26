// The comparator of `rays.trace` for rung R9a, on the reference engine's trace of a set of chief rays through a small
// lens at two lines, and on copies of it with a landing moved, the probe moved, an exit turned, a ray stopped. Every
// number is synthetic; the distortion of a landing is the estimator's, whose proofs are
// test/estimators/distortion.test.ts, and the crossing of an exit the axial estimator's (axialIntercept.test.ts).
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { raysChiefComparator } from "../../src/compare/raysChief.ts";
import type { SpanAnswer } from "../../src/compare/span.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { axialIntercept } from "../../src/estimators/axialIntercept.ts";
import { estimateDistortion } from "../../src/estimators/distortion.ts";
import { caseOf, sphere } from "../engines/ref/support.ts";
import { changed, stopAt, traceOf } from "./raysSupport.ts";

/** A singlet and a stop 7 mm behind it at two lines, no obstruction: every chief ray through the stop's centre lands. */
const LENS = caseOf(
  [
    { z: 0, shape: sphere(40), index: [1.5, 1.52] },
    { z: 5, shape: sphere(-60), index: [1, 1] },
    { z: 7, shape: sphere(Infinity), index: [1, 1], semiDiameter: 3, clipRadius: 3 },
  ],
  { stopIndex: 2, stopSemiDiameter: 3, lines: 2, imageZ: 60 },
);

/** The slopes of the set: a near-axis probe first, then fields of growing angle. */
const SLOPES = [-0.001, -0.02, -0.05, -0.08] as const;

/**
 * Chief rays aimed at the stop's vertex as if the singlet were not there, launched 10 mm ahead of the first vertex
 * along `(0, u, 1)` made a unit vector, as LensVisualizer's meridional launch makes them; the probe first, stated
 * under `groups.chiefIndex` where `probe` is set.
 */
function chiefSpec(line: number, probe = true): RaysTraceSpec {
  const origins = SLOPES.flatMap((u) => [0, -u * 17, -10]);
  const directions = SLOPES.flatMap((u) => {
    const length = Math.sqrt(u * u + 1);
    return [0, u / length, 1 / length];
  });
  return {
    line,
    origins: encodeNdArray(Float64Array.from(origins), [SLOPES.length, 3]),
    directions: encodeNdArray(Float64Array.from(directions), [SLOPES.length, 3]),
    weights: encodeNdArray(new Float64Array(SLOPES.length).fill(1)),
    ...(probe ? { groups: { chiefIndex: 0 } } : {}),
  };
}

const SPECS = [chiefSpec(0), chiefSpec(1)];
const BASES = SPECS.map((spec) => traceOf(spec, LENS));
const CONTEXT = { spec: SPECS[0] as unknown as JsonObject, opticalCase: LENS };

/** A span answer of traces, one for each spec. */
function span(traces: readonly RaysTraceData[], specs: readonly RaysTraceSpec[] = SPECS): SpanAnswer {
  return {
    members: traces.map((data, at) => ({
      requestId: `request-${at}`,
      spec: specs[at] as unknown as JsonObject,
      data: data as unknown as JsonObject,
    })),
  };
}

function compared(a: SpanAnswer, b: SpanAnswer, context: object = CONTEXT): ComparatorOutcome {
  return raysChiefComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, context);
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

const GATE = 1e-8;

test("the set of chief rays lands at both lines, and the comparator keys a span by its rays without the line", () => {
  for (const base of BASES) assert.deepEqual([...decodeNdArray(base.status).values], [0, 0, 0, 0]);
  const keys = SPECS.map((spec) => raysChiefComparator.spanOf!(spec as unknown as JsonObject));
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], raysChiefComparator.spanOf!(chiefSpec(0, false) as unknown as JsonObject));
});

test("a faithful copy differs by nothing: every figure 0, every ray compared at both lines, none dropped", () => {
  const outcome = compared(span(BASES), span(BASES.map((base) => structuredClone(base))));
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["landing.maxAbs", 0],
      ["lateralColour.maxAbs", 0],
      ["distortion.maxScaled", 0],
      ["distortion.maxAbs", 0],
      ["exitPupil.maxScaled", 0],
      ["exitPupil.maxAbs", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", 8],
      ["rays.dropped", 0],
    ],
  );
  assert.equal(outcome.unmeasured, undefined);
  assert.equal(outcome.inapplicable, undefined);
});

test("a landing moved at the second line is a landing, a lateral colour and a distortion of that step", () => {
  const step = 2 ** -30;
  const moved = changed(BASES[1], (arrays) => {
    arrays.imagePoint[3 * 2 + 1] += step;
  });
  const outcome = compared(span(BASES), span([BASES[0], moved]));
  for (const name of ["landing.maxAbs", "lateralColour.maxAbs", "distortion.maxScaled"]) {
    const found = metric(outcome, name);
    assert.deepEqual([found?.value, found?.where], [step, { line: 1, ray: 2 }], name);
  }
  // The percent is that step over the ideal height, shown and not judged.
  const ideal = estimateOf(BASES[1], SPECS[1]).idealY[2];
  const percent = (100 * step) / Math.abs(ideal);
  assert.ok(Math.abs((metric(outcome, "distortion.maxAbs")?.value ?? 0) - percent) <= 1e-6 * percent);
  // The same move at both lines is a landing and no lateral colour; opposite moves are twice the step of colour.
  const both = [0, 1].map((line) =>
    changed(BASES[line], (arrays) => {
      arrays.imagePoint[3 * 2 + 1] += line === 0 ? step : step;
    }),
  );
  assert.equal(metric(compared(span(BASES), span(both)), "lateralColour.maxAbs")?.value, 0);
  const apart = [0, 1].map((line) =>
    changed(BASES[line], (arrays) => {
      arrays.imagePoint[3 * 2 + 1] += line === 0 ? step : -step;
    }),
  );
  assert.equal(metric(compared(span(BASES), span(apart)), "lateralColour.maxAbs")?.value, 2 * step);
  assert.deepEqual(compared(span([BASES[0], moved]), span(BASES)), outcome);
});

/** The estimator's distortion of one answer at one line. */
function estimateOf(data: RaysTraceData, spec: RaysTraceSpec) {
  const image = decodeNdArray(data.imagePoint).values as Float64Array;
  const directions = decodeNdArray(spec.directions).values as Float64Array;
  const pick = (array: Float64Array, axis: number) => SLOPES.map((_slope, ray) => array[3 * ray + axis]);
  const estimate = estimateDistortion({
    x: pick(image, 0),
    y: pick(image, 1),
    slopeX: SLOPES.map((_slope, ray) => directions[3 * ray] / directions[3 * ray + 2]),
    slopeY: SLOPES.map((_slope, ray) => directions[3 * ray + 1] / directions[3 * ray + 2]),
    reference: 0,
  });
  assert.ok(estimate.available);
  return estimate;
}

test("a probe moved by less than the gate moves every ideal point by its slope ratio: the distortion fires alone", () => {
  // The probe's slope is 1/80 of the steepest field's: its landing, moved 2^-27 mm (7.5e-9, inside the gate), moves
  // that field's ideal height 80 times as far (6e-7), which the distortion figure judges and the landing does not.
  const step = 2 ** -27;
  const moved = SPECS.map((_spec, line) =>
    changed(BASES[line], (arrays) => {
      arrays.imagePoint[1] += step;
    }),
  );
  const outcome = compared(span(BASES), span(moved));
  assert.equal(metric(outcome, "landing.maxAbs")?.value, step);
  assert.ok(step < GATE);
  const distortion = metric(outcome, "distortion.maxScaled");
  const ratio = SLOPES[3] / SLOPES[0];
  assert.equal(distortion?.where?.ray, 3);
  assert.ok(Math.abs((distortion?.value ?? 0) - ratio * step) <= 1e-6 * ratio * step, `${distortion?.value}`);
  assert.ok((distortion?.value ?? 0) > GATE);
  assert.equal(metric(outcome, "lateralColour.maxAbs")?.value, 0);
});

/** Where ray 3 of an answer leaves the last surface crosses the axis. */
function exitOf(data: RaysTraceData) {
  const point = decodeNdArray(data.exitPoint).values as Float64Array;
  const direction = decodeNdArray(data.exitDirection).values as Float64Array;
  const crossing = axialIntercept(point.subarray(9, 12), direction.subarray(9, 12));
  assert.ok(crossing.available);
  return crossing;
}

/**
 * A copy of `data` in which ray 3 leaves the last surface at its slope times `factor`, from the height at which it
 * crosses the axis `shift` behind where it did, or, without a shift, at which it lands where it did on the image plane.
 */
function turned(data: RaysTraceData, factor: number, shift?: number): RaysTraceData {
  const crossing = exitOf(data);
  return changed(data, (arrays) => {
    const [y, z, m, n] = [
      arrays.imagePoint[10],
      arrays.exitPoint[11],
      arrays.exitDirection[10] * factor,
      arrays.exitDirection[11],
    ];
    arrays.exitDirection[10] = m;
    arrays.exitPoint[10] = shift === undefined ? y - ((60 - z) * m) / n : ((z - (crossing.z + shift)) * m) / n;
  });
}

test("an exit turned about its landing shows only in the exit pupil: the rung's sign of a wrong exit slope", () => {
  // Ray 3 leaves at 1 + 2^-20 of its slope and lands where it did: the landing figures are a rounding, and its
  // crossing behind the system moves far beyond the gate.
  const wrong = turned(BASES[0], 1 + 2 ** -20);
  const outcome = compared(span(BASES), span([wrong, BASES[1]]));
  assert.ok((metric(outcome, "landing.maxAbs")?.value ?? 1) < 1e-13);
  assert.ok((metric(outcome, "distortion.maxScaled")?.value ?? 1) < 1e-13);
  const [base, moved] = [exitOf(BASES[0]), exitOf(wrong)];
  const along = Math.abs(base.z - moved.z);
  const scaled = metric(outcome, "exitPupil.maxScaled");
  assert.deepEqual(
    [scaled?.value, scaled?.where],
    [along * Math.max(Math.abs(base.slope), Math.abs(moved.slope)), { line: 0, ray: 3 }],
  );
  assert.ok((scaled?.value ?? 0) > GATE);
  assert.equal(metric(outcome, "exitPupil.maxAbs")?.value, along);
});

test("an engine's wrong, shallow exit slope cannot hide its crossing: the larger slope scales it, either way round", () => {
  // Ray 3 of the copy crosses the axis 2^-16 mm behind the base's at 2^-20 of its slope: on the base's slope a
  // height far above the gate, on the copy's far below it. Whichever answer comes first, the larger is taken.
  const wrong = turned(BASES[0], 2 ** -20, 2 ** -16);
  const [steep, shallow] = [exitOf(BASES[0]), exitOf(wrong)];
  const along = Math.abs(steep.z - shallow.z);
  assert.ok(along * Math.abs(steep.slope) > GATE && along * Math.abs(shallow.slope) < GATE);
  for (const outcome of [
    compared(span(BASES), span([wrong, BASES[1]])),
    compared(span([wrong, BASES[1]]), span(BASES)),
  ]) {
    const scaled = metric(outcome, "exitPupil.maxScaled");
    assert.deepEqual([scaled?.value, scaled?.where], [along * Math.abs(steep.slope), { line: 0, ray: 3 }]);
    assert.equal(metric(outcome, "exitPupil.maxAbs")?.value, along);
  }
});

test("a ray one engine stops is counted as R2 counts it and taken in no figure; a stopped probe has no distortion", () => {
  const stopped = changed(BASES[1], (arrays) => stopAt(arrays, 2, 2));
  const outcome = compared(span(BASES), span([BASES[0], stopped]));
  const mismatches = metric(outcome, "mask.mismatches");
  assert.deepEqual([mismatches?.value, mismatches?.where], [1, { line: 1, ray: 2, surface: 2 }]);
  const dropped = metric(outcome, "rays.dropped");
  assert.deepEqual([dropped?.value, dropped?.where], [1, { line: 1, ray: 2 }]);
  assert.equal(metric(outcome, "rays.compared")?.value, 7);
  assert.equal(metric(outcome, "lateralColour.maxAbs")?.value, 0);
  const probe = SPECS.map((_spec, line) => changed(BASES[line], (arrays) => stopAt(arrays, 0, 1)));
  const unprobed = compared(span(probe), span(probe.map((each) => structuredClone(each))));
  assert.ok(unprobed.comparable);
  assert.deepEqual(
    unprobed.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["distortion.maxScaled", "line 0"],
      ["distortion.maxAbs", "line 0"],
    ],
  );
  assert.match(unprobed.unmeasured?.[0].reason ?? "", /no-reference/);
  assert.equal(unprobed.notes, undefined);
  // A probe stopped at the second line alone: the distortion is of the first line, and the second is named, not
  // passed over in silence.
  const second = changed(BASES[1], (arrays) => stopAt(arrays, 0, 1));
  const half = compared(span([BASES[0], second]), span([BASES[0], structuredClone(second)]));
  assert.equal(metric(half, "distortion.maxScaled")?.value, 0);
  assert.equal(metric(half, "distortion.maxScaled")?.where?.line, 0);
  assert.ok(half.comparable);
  assert.equal(half.unmeasured, undefined);
  assert.deepEqual(half.notes, ["distortion.maxScaled is not of line 1: no-reference: the probe, ray 0, is not taken"]);
  const faithful = compared(span(BASES), span(BASES.map((base) => structuredClone(base))));
  assert.ok(faithful.comparable);
  assert.equal(faithful.notes, undefined);
});

test("a span of one line has no lateral colour, and a set without its probe no distortion: neither is judged", () => {
  const one = compared(span([BASES[0]], [SPECS[0]]), span([structuredClone(BASES[0])], [SPECS[0]]));
  assert.ok(one.comparable);
  assert.deepEqual(one.inapplicable, ["lateralColour.maxAbs"]);
  const plain = [chiefSpec(0, false), chiefSpec(1, false)];
  const traced = plain.map((spec) => traceOf(spec, LENS));
  const outcome = compared(
    span(traced, plain),
    span(
      traced.map((each) => structuredClone(each)),
      plain,
    ),
  );
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.inapplicable, ["distortion.maxScaled", "distortion.maxAbs"]);
});

test("a ray that crosses the axis in one answer and runs parallel to it in the other is not comparable", () => {
  const parallel = changed(BASES[0], (arrays) => {
    arrays.exitDirection.set([0, 0, 1], 3 * 3);
  });
  assert.deepEqual(compared(span(BASES), span([parallel, BASES[1]])), {
    comparable: false,
    reason: "line 0, ray 3: in the first answer it crosses the axis, in the second parallel",
  });
});

test("answers to other requests, or without the case, are not comparable", () => {
  const other: SpanAnswer = { members: [span(BASES).members[1], span(BASES).members[0]] };
  assert.deepEqual(compared(span(BASES), other), {
    comparable: false,
    reason: "the answers are not to the same requests of the span",
  });
  assert.equal(compared(span(BASES), span(BASES), { spec: SPECS[0] }).comparable, false);
});

test("an answer records its endings and the scale of its own probe, one value a line", () => {
  const recorded = raysChiefComparator.recorded!(span(BASES) as unknown as JsonObject, CONTEXT);
  assert.deepEqual(recorded["rays.ok"], [4, 4]);
  assert.deepEqual(recorded["rays.blocked"], [0, 0]);
  assert.deepEqual(
    recorded["distortion.scaleMm"],
    BASES.map((base, line) => estimateOf(base, SPECS[line]).scaleMm),
  );
});
