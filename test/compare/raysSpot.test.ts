// The comparator of `rays.trace` for rung R7a, on the reference engine's trace of seven rays of a small lens and on
// copies of it with a landing moved, a ray stopped, a chief ray lost. Every number is synthetic; what the spot of a
// set is, is the estimator's, whose proofs are test/estimators/spot.test.ts.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { raysSpotComparator } from "../../src/compare/raysSpot.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RaysTraceData } from "../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { estimateSpot } from "../../src/estimators/spot.ts";
import type { SpotEstimate } from "../../src/estimators/spot.ts";
import { BASE, CHIEF, LENS, SPEC, STOP_CLIP, changed, hitRadius, stopAt } from "./raysSupport.ts";

const CONTEXT = { spec: SPEC as unknown as JsonObject, opticalCase: LENS };

function compared(a: RaysTraceData, b: RaysTraceData, context: object = CONTEXT): ComparatorOutcome {
  return raysSpotComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, context);
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

/** The estimator's spot of an answer on the rays ok in it, as the comparator takes them where both are ok. */
function spotOf(data: RaysTraceData, valid: readonly number[]): SpotEstimate {
  const points = decodeNdArray(data.imagePoint).values;
  const weights = decodeNdArray(SPEC.weights).values;
  const spot = estimateSpot({
    x: Array.from({ length: 7 }, (_unused, ray) => points[3 * ray] as number),
    y: Array.from({ length: 7 }, (_unused, ray) => points[3 * ray + 1] as number),
    weight: weights as Float64Array,
    valid: Array.from({ length: 7 }, (_unused, ray) => (valid.includes(ray) ? 1 : 0)),
    chief: CHIEF,
  });
  assert.ok(spot.available);
  return spot;
}

/** The rays of `BASE` that are ok: 0 to 3, and the chief ray 6. */
const OK = [0, 1, 2, 3, 6];

test("a faithful copy differs by nothing: every figure 0, every ray compared, none dropped", () => {
  const outcome = compared(BASE, structuredClone(BASE));
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["transverseError.maxAbs", 0],
      ["centroid.maxAbs", 0],
      ["rmsRadius.maxAbs", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", 4],
      ["rays.dropped", 0],
    ],
  );
  assert.equal(outcome.unmeasured, undefined);
});

test("a landing moved along y is that ray's transverse error, a quarter of it the centroid's, and the radius's change", () => {
  const step = 2 ** -20;
  const moved = changed(BASE, (arrays) => {
    arrays.imagePoint[3 * 2 + 1] += step;
  });
  const outcome = compared(BASE, moved);
  const error = metric(outcome, "transverseError.maxAbs");
  assert.deepEqual([error?.value, error?.where], [step, { line: 0, field: 0, ray: 2 }]);
  // Four rays of weight 1: the centroid moves by a quarter of the step, exactly.
  assert.equal(metric(outcome, "centroid.maxAbs")?.value, step / 4);
  const [first, second] = [spotOf(BASE, OK), spotOf(moved, OK)];
  assert.equal(metric(outcome, "rmsRadius.maxAbs")?.value, Math.abs(first.rmsRadius - second.rmsRadius));
  assert.ok(Math.abs(first.rmsRadius - second.rmsRadius) > 0);
  // Swapping the two answers changes no value.
  assert.deepEqual(compared(moved, BASE), outcome);
});

test("a chief ray landed elsewhere moves every transverse error and the centroid by as much, and not the radius", () => {
  const step = 2 ** -24;
  const moved = changed(BASE, (arrays) => {
    arrays.imagePoint[3 * CHIEF] += step;
  });
  const outcome = compared(BASE, moved);
  // Each engine's spot is relative to its own chief ray: the whole spot of the second is a step to -x of the first's.
  assert.equal(metric(outcome, "transverseError.maxAbs")?.value, step);
  assert.equal(metric(outcome, "transverseError.maxAbs")?.where?.ray, 0);
  assert.equal(metric(outcome, "centroid.maxAbs")?.value, step);
  assert.ok((metric(outcome, "rmsRadius.maxAbs")?.value ?? 1) <= 2 ** -52 * spotOf(BASE, OK).rmsRadius);
});

test("a ray one engine stopped away from a rim is a mismatch and is dropped from both spots", () => {
  const stopped = changed(BASE, (arrays) => stopAt(arrays, 1, 0));
  const outcome = compared(BASE, stopped);
  assert.deepEqual(
    ["mask.mismatches", "rays.compared", "rays.dropped"].map((name) => metric(outcome, name)?.value),
    [1, 3, 1],
  );
  assert.deepEqual(metric(outcome, "rays.dropped")?.where, { line: 0, field: 0, ray: 1 });
  // The spots of both are of the three rays left, so they are equal.
  assert.deepEqual(
    ["transverseError.maxAbs", "centroid.maxAbs", "rmsRadius.maxAbs"].map((name) => metric(outcome, name)?.value),
    [0, 0, 0],
  );
  // At the rim of the stop it is counted in the band, and not as a mismatch.
  const rim = changed(BASE, (arrays) => {
    stopAt(arrays, 3, 2);
  });
  const passing = changed(BASE, (arrays) => hitRadius(arrays, 2, 3, STOP_CLIP));
  const inBand = compared(passing, rim);
  assert.deepEqual(
    ["mask.mismatches", "mask.rimBand", "rays.dropped"].map((name) => metric(inBand, name)?.value),
    [0, 1, 1],
  );
});

test("without a chief ray landed in both answers the spot is not measured, and the mask still is", () => {
  const lost = changed(BASE, (arrays) => stopAt(arrays, CHIEF, 2));
  const outcome = compared(BASE, lost);
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["transverseError.maxAbs", "no-reference"],
      ["centroid.maxAbs", "no-reference"],
      ["rmsRadius.maxAbs", "no-reference"],
    ],
  );
  assert.equal(metric(outcome, "mask.mismatches")?.value, 1);
});

test("without the spec, without the case, or of a set without a chief ray, two answers are not comparable", () => {
  const reasons = [
    compared(BASE, BASE, { opticalCase: LENS }),
    compared(BASE, BASE, { spec: CONTEXT.spec }),
    compared(BASE, BASE, { ...CONTEXT, spec: { ...SPEC, groups: { field: { angleDeg: 0 } } } }),
  ].map((outcome) => (outcome.comparable ? "comparable" : outcome.reason));
  assert.match(reasons[0], /spec of the request is not at hand/);
  assert.match(reasons[1], /case is not at hand/);
  assert.match(reasons[2], /states no chief ray/);
});

test("each answer records how its rays ended and the spot of its own landed rays", () => {
  const recorded = raysSpotComparator.recorded?.(BASE as unknown as JsonObject, CONTEXT) ?? {};
  const spot = spotOf(BASE, OK);
  assert.deepEqual(recorded, {
    "rays.ok": [5],
    "rays.blocked": [2],
    "rays.failed": [0],
    "spot.centroidX": [spot.centroid.x],
    "spot.centroidY": [spot.centroid.y],
    "spot.rmsRadius": [spot.rmsRadius],
  });
});
