// The comparator of `rays.trace` for rung R8a, on the reference engine's trace of four mirror pairs of rays along the
// axis of a small lens and on copies of it with an exit moved, a ray stopped, a ray turned parallel. Every number is
// synthetic; where a ray crosses the axis is the estimator's, whose proofs are test/estimators/axialIntercept.test.ts.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { raysAxialComparator } from "../../src/compare/raysAxial.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { axialIntercepts, leastSquaresFocus, pairsTaken } from "../../src/estimators/axialIntercept.ts";
import { LENS, STOP_CLIP, changed, stopAt, traceOf } from "./raysSupport.ts";

/** Four pairs along the axis: heights 1, 2 and 2.5 pass the stop of `LENS` (3 mm); 4.5 does not. */
function pairsSpec(heights: readonly number[] = [1, -1, 2, -2, 2.5, -2.5, 4.5, -4.5], x = 0): RaysTraceSpec {
  return {
    line: 0,
    origins: encodeNdArray(Float64Array.from(heights.flatMap((y) => [x, y, -10])), [heights.length, 3]),
    directions: encodeNdArray(Float64Array.from(heights.flatMap(() => [0, 0, 1])), [heights.length, 3]),
    weights: encodeNdArray(new Float64Array(heights.length).fill(1)),
    groups: { field: { angleDeg: 0 } },
  };
}

const SPEC = pairsSpec();
const BASE = traceOf(SPEC);
const CONTEXT = { spec: SPEC as unknown as JsonObject, opticalCase: LENS };

function compared(a: RaysTraceData, b: RaysTraceData, context: object = CONTEXT): ComparatorOutcome {
  return raysAxialComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, context);
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

/** The estimator's focus of an answer's pairs, of the rays whose status is ok in `valid`. */
function focusOf(data: RaysTraceData, valid: readonly number[]) {
  const set = axialIntercepts({
    exitPoint: decodeNdArray(data.exitPoint).values as Float64Array,
    exitDirection: decodeNdArray(data.exitDirection).values as Float64Array,
    valid: Array.from({ length: 8 }, (_unused, ray) => (valid.includes(ray) ? 1 : 0)),
  });
  const focus = leastSquaresFocus(set, pairsTaken(set));
  assert.ok(focus.available);
  return { set, focus };
}

test("the reference engine brings the three inner pairs to the image and stops the outer one at the stop", () => {
  const status = decodeNdArray(BASE.status).values;
  assert.deepEqual([...status], [0, 0, 0, 0, 0, 0, 1, 1]);
  assert.ok(STOP_CLIP < 4.5);
});

test("a faithful copy differs by nothing: every figure 0, every ray that arrived compared, none dropped", () => {
  const outcome = compared(BASE, structuredClone(BASE));
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["intercept.maxScaled", 0],
      ["intercept.maxAbs", 0],
      ["focus.maxScaled", 0],
      ["focus.maxAbs", 0],
      ["focusRms.maxAbs", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", 6],
      ["rays.dropped", 0],
    ],
  );
  assert.deepEqual(outcome.unmeasured, []);
});

test("an exit moved along y moves the ray's intercept by the step over its slope, judged as the step itself", () => {
  const step = 2 ** -24;
  const moved = changed(BASE, (arrays) => {
    arrays.exitPoint[3 * 2 + 1] += step;
  });
  const outcome = compared(BASE, moved);
  const [first, second] = [focusOf(BASE, [0, 1, 2, 3, 4, 5]), focusOf(moved, [0, 1, 2, 3, 4, 5])];
  const along = Math.abs(first.set.z[2] - second.set.z[2]);
  const slope = Math.max(Math.abs(first.set.slope[2]), Math.abs(second.set.slope[2]));
  const scaled = metric(outcome, "intercept.maxScaled");
  assert.deepEqual([scaled?.value, scaled?.where], [along * slope, { line: 0, field: 0, ray: 2 }]);
  assert.equal(metric(outcome, "intercept.maxAbs")?.value, along);
  // The crossing moves by the step over the slope, and the height at which one passes the other's is the step.
  assert.ok(Math.abs(along * Math.abs(first.set.slope[2]) - step) <= 1e-6 * step);
  assert.ok(along > 10 * step, "a ray near the axis moves its crossing far along it");
  // The focus moves by the step weighted by its ray's squared slope, and is judged on the RMS slope.
  const shift = Math.abs(first.focus.z - second.focus.z);
  assert.equal(metric(outcome, "focus.maxAbs")?.value, shift);
  assert.equal(
    metric(outcome, "focus.maxScaled")?.value,
    shift * Math.max(first.focus.rmsSlope, second.focus.rmsSlope),
  );
  assert.ok(shift > 0);
  assert.equal(metric(outcome, "focusRms.maxAbs")?.value, Math.abs(first.focus.rmsMm - second.focus.rmsMm));
  // Swapping the two answers changes no value.
  assert.deepEqual(compared(moved, BASE), outcome);
});

/**
 * A copy of `data` in which each ray of `rays` leaves the last surface where it did, at its slope times `factor`, and
 * with its height moved so that it crosses the axis `shift` behind where it did: an engine whose slope is wrong and
 * whose crossing is nearly right.
 */
function shallower(data: RaysTraceData, rays: readonly number[], factor: number, shift: number): RaysTraceData {
  const { set } = focusOf(data, [0, 1, 2, 3, 4, 5]);
  return changed(data, (arrays) => {
    for (const ray of rays) {
      const [z, m, n] = [
        arrays.exitPoint[3 * ray + 2],
        arrays.exitDirection[3 * ray + 1],
        arrays.exitDirection[3 * ray + 2],
      ];
      arrays.exitDirection[3 * ray + 1] = m * factor;
      arrays.exitPoint[3 * ray + 1] = ((z - (set.z[ray] + shift)) * m * factor) / n;
    }
  });
}

const GATE = 1e-8;

test("an engine's wrong, shallow slope cannot hide its intercept: the difference is scaled by the larger slope", () => {
  // Ray 2 of the copy crosses the axis 2^-16 mm behind the base's at 2^-20 of its slope. On the base's slope that is
  // a height far above R8a's gate; on the copy's, far below it. Whichever answer comes first, the larger is taken.
  const copy = shallower(BASE, [2], 2 ** -20, 2 ** -16);
  const [base, wrong] = [focusOf(BASE, [0, 1, 2, 3, 4, 5]).set, focusOf(copy, [0, 1, 2, 3, 4, 5]).set];
  const along = Math.abs(base.z[2] - wrong.z[2]);
  const [steep, shallow] = [Math.abs(base.slope[2]), Math.abs(wrong.slope[2])];
  assert.ok(steep > shallow * 2 ** 19);
  assert.ok(along * steep > GATE && along * shallow < GATE, `${along * steep}, ${along * shallow}`);
  for (const outcome of [compared(BASE, copy), compared(copy, BASE)]) {
    const scaled = metric(outcome, "intercept.maxScaled");
    assert.deepEqual([scaled?.value, scaled?.where], [along * steep, { line: 0, field: 0, ray: 2 }]);
    assert.equal(metric(outcome, "intercept.maxAbs")?.value, along);
  }
});

test("an engine whose every slope is shallow cannot hide its focus: the shift is scaled by the larger RMS slope", () => {
  // Every ray of the copy crosses the axis 2^-16 mm behind the base's at 2^-20 of its slope: its focus is 2^-16 mm
  // behind, and its RMS slope 2^-20 of the base's. On the base's RMS slope the shift is above the gate.
  const copy = shallower(BASE, [0, 1, 2, 3, 4, 5], 2 ** -20, 2 ** -16);
  const [base, wrong] = [focusOf(BASE, [0, 1, 2, 3, 4, 5]).focus, focusOf(copy, [0, 1, 2, 3, 4, 5]).focus];
  const shift = Math.abs(base.z - wrong.z);
  assert.ok(Math.abs(shift - 2 ** -16) <= 2 ** -30, `${shift}`);
  assert.ok(base.rmsSlope > wrong.rmsSlope * 2 ** 19);
  assert.ok(shift * base.rmsSlope > GATE && shift * wrong.rmsSlope < GATE);
  for (const outcome of [compared(BASE, copy), compared(copy, BASE)]) {
    assert.equal(metric(outcome, "focus.maxScaled")?.value, shift * base.rmsSlope);
    assert.equal(metric(outcome, "focus.maxAbs")?.value, shift);
  }
});

test("slopes that differ with intercepts that agree show only in the focus figures, beyond the intercepts' bound", () => {
  // The same crossings at slopes 1 + 2^-11 times the base's: every intercept figure is a rounding, and the focus
  // figures are R8a's one sign of a difference of the exit slopes on these rays. Every slope alike: the focus stays,
  // and the RMS height there grows by the slopes' ratio.
  const all = shallower(BASE, [0, 1, 2, 3, 4, 5], 1 + 2 ** -11, 0);
  const outcome = compared(BASE, all);
  assert.ok((metric(outcome, "intercept.maxScaled")?.value ?? 1) <= 1e-15);
  const of = (data: RaysTraceData) => focusOf(data, [0, 1, 2, 3, 4, 5]).focus;
  const [base, steeper] = [of(BASE), of(all)];
  assert.equal(metric(outcome, "focusRms.maxAbs")?.value, Math.abs(base.rmsMm - steeper.rmsMm));
  assert.ok(Math.abs(steeper.rmsMm / base.rmsMm - (1 + 2 ** -11)) <= 1e-9);
  assert.ok((metric(outcome, "focusRms.maxAbs")?.value ?? 0) > GATE);
  // One pair's slopes alone: its weight in the focus changes, and the focus moves although no intercept does. The
  // focus figure is then far above the intercept figure: the intercepts bound it only where the slopes agree.
  const pair = shallower(BASE, [2, 3], 1 + 2 ** -11, 0);
  const moved = compared(BASE, pair);
  const intercepts = metric(moved, "intercept.maxScaled")?.value ?? 1;
  const focus = metric(moved, "focus.maxScaled")?.value ?? 0;
  assert.equal(metric(moved, "focus.maxAbs")?.value, Math.abs(base.z - of(pair).z));
  assert.ok(intercepts <= 1e-15 && focus > GATE && focus > 1e6 * intercepts, `${intercepts}, ${focus}`);
});

test("a ray one engine stops is dropped with its mirror from the focus, and counted as R2 counts it", () => {
  const stopped = changed(BASE, (arrays) => stopAt(arrays, 3, 2));
  const outcome = compared(BASE, stopped);
  const mismatches = metric(outcome, "mask.mismatches");
  assert.deepEqual([mismatches?.value, mismatches?.where], [1, { line: 0, field: 0, ray: 3, surface: 2 }]);
  const dropped = metric(outcome, "rays.dropped");
  assert.deepEqual([dropped?.value, dropped?.where], [1, { line: 0, field: 0, ray: 3 }]);
  assert.equal(metric(outcome, "rays.compared")?.value, 5);
  // The focus is of the pairs 0 and 2 only: the pair of the stopped ray is taken in neither answer.
  const two = focusOf(BASE, [0, 1, 4, 5]);
  const same = compared(stopped, structuredClone(stopped));
  assert.equal(metric(same, "focusRms.maxAbs")?.value, 0);
  assert.equal(two.focus.rays, 4);
  assert.equal(metric(outcome, "focus.maxAbs")?.value, 0);
});

test("a ray that crosses the axis in one answer and runs parallel to it in the other is not comparable", () => {
  const parallel = changed(BASE, (arrays) => {
    arrays.exitDirection.set([0, 0, 1], 3 * 4);
  });
  const outcome = compared(BASE, parallel);
  assert.deepEqual(outcome, {
    comparable: false,
    reason: "ray 4: in the first answer it crosses the axis, in the second parallel",
  });
  // Both parallel: the ray is in no figure, and its pair is in no focus.
  const both = compared(parallel, structuredClone(parallel));
  assert.equal(metric(both, "rays.compared")?.value, 5);
  assert.equal(metric(both, "focusRms.maxAbs")?.value, 0);
});

test("a ray that leaves the meridional plane in both answers, or a set off it, is not comparable", () => {
  const skew = changed(BASE, (arrays) => {
    arrays.exitPoint[3 * 1] = 1e-9;
  });
  assert.deepEqual(compared(skew, structuredClone(skew)), {
    comparable: false,
    reason: "ray 1 has no intercept in either answer: skew",
  });
  const off = pairsSpec(undefined, 0.5);
  const traced = traceOf(off);
  const outcome = compared(traced, structuredClone(traced), { spec: off, opticalCase: LENS });
  assert.deepEqual(outcome, { comparable: false, reason: "ray 0 of the set is not in the meridional plane" });
});

test("a set of no mirror pairs has its intercepts compared and no focus", () => {
  const lone = pairsSpec([1, -1.5, 2, -2.5]);
  const traced = traceOf(lone);
  const outcome = compared(traced, structuredClone(traced), { spec: lone, opticalCase: LENS });
  assert.ok(outcome.comparable);
  assert.equal(metric(outcome, "intercept.maxScaled")?.value, 0);
  assert.deepEqual(
    outcome.unmeasured?.map((each) => each.name),
    ["focus.maxScaled", "focus.maxAbs", "focusRms.maxAbs"],
  );
  assert.match(outcome.unmeasured?.[0].reason ?? "", /not of mirror pairs/);
});

test("without a ray both engines brought to the image nothing is measured but the mask", () => {
  const outer = pairsSpec([4.5, -4.5]);
  const traced = traceOf(outer);
  const outcome = compared(traced, structuredClone(traced), { spec: outer, opticalCase: LENS });
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", 0],
      ["rays.dropped", 0],
    ],
  );
  assert.deepEqual(
    outcome.unmeasured?.map((each) => each.name),
    ["intercept.maxScaled", "intercept.maxAbs", "focus.maxScaled", "focus.maxAbs", "focusRms.maxAbs"],
  );
});

test("without the spec or the case the answers are not comparable", () => {
  assert.equal(compared(BASE, BASE, { opticalCase: LENS }).comparable, false);
  assert.equal(compared(BASE, BASE, { spec: SPEC }).comparable, false);
});

test("an answer records its endings and the focus of its own pairs", () => {
  const recorded = raysAxialComparator.recorded!(BASE as unknown as JsonObject, CONTEXT);
  const { focus } = focusOf(BASE, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(recorded["rays.ok"], [6]);
  assert.deepEqual(recorded["rays.blocked"], [2]);
  assert.deepEqual(recorded["axial.focusZ"], [focus.z]);
  assert.deepEqual(recorded["axial.focusRmsMm"], [focus.rmsMm]);
  const none = raysAxialComparator.recorded!(BASE as unknown as JsonObject, { opticalCase: LENS });
  assert.ok(Number.isNaN(none["axial.focusZ"][0]));
});
