// The distortion estimator held to its definition: every expected value is worked out in the test, in closed form or
// in exact fractions (whole numbers over powers of two), never taken from an engine. A carried rest of the estimator
// that is removed turns a test here red: a displacement whose landing and ideal height cancel is held to the bit,
// which the plain formula misses, and the displacements of a series of rays to the nearest double of the exact one.
import assert from "node:assert/strict";
import { test } from "node:test";

import { twoProductError } from "../../src/core/numeric/exact.ts";
import { estimateDistortion } from "../../src/estimators/distortion.ts";
import type { DistortionRays } from "../../src/estimators/distortion.ts";
import { dyadicOf, minus, nearestQuotient, series, times, ulp } from "./support.ts";
import type { Dyadic } from "./support.ts";

const ONE: Dyadic = { numerator: 1n, shift: 0 };
const ZERO: Dyadic = { numerator: 0n, shift: 0 };

/** The exact displacement `landing - probe * ratio` of doubles, as the nearest double. */
function exactDisplacement(landing: number, probe: number, ratio: number): number {
  return nearestQuotient(minus(dyadicOf(landing), times(dyadicOf(probe), dyadicOf(ratio))), ONE);
}

/** A set of rays whose probe is ray 0, on the meridian. */
function setOf(rays: { x: number[]; y: number[]; slopeX: number[]; slopeY: number[] }): DistortionRays {
  return { ...rays, reference: 0 };
}

test("a perfect rectilinear image has no distortion, to the bit, and its scale is the probe's height over its slope", () => {
  // Dyadic numbers, so that every ideal point is a double and every landing on it is exact: the probe's slope a power
  // of two, the scale 50.5 mm.
  const scale = 50.5;
  const probeSlope = -(2 ** -6);
  const slopes = [
    [0, -0.125],
    [0.25, -0.375],
    [-0.5, 0.0625],
    [0.75, 0],
  ];
  const estimate = estimateDistortion(
    setOf({
      x: [0, ...slopes.map(([sx]) => scale * sx)],
      y: [scale * probeSlope, ...slopes.map(([, sy]) => scale * sy)],
      slopeX: [0, ...slopes.map(([sx]) => sx)],
      slopeY: [probeSlope, ...slopes.map(([, sy]) => sy)],
    }),
  );
  assert.ok(estimate.available);
  assert.equal(estimate.scaleMm, scale);
  assert.deepEqual(estimate.reason, ["reference", null, null, null, null]);
  for (let ray = 1; ray <= slopes.length; ray++) {
    assert.ok(Object.is(estimate.displacementX[ray], 0) || Object.is(estimate.displacementX[ray], -0), `ray ${ray}`);
    assert.equal(estimate.displacementY[ray], 0, `ray ${ray}`);
    assert.equal(estimate.percent[ray], 0, `ray ${ray}`);
    assert.equal(estimate.idealX[ray], scale * slopes[ray - 1][0]);
    assert.equal(estimate.idealY[ray], scale * slopes[ray - 1][1]);
  }
});

test("a barrel image has the displacement s k u^3 and the percent 100 k u^2 of its closed form", () => {
  // The landing of a slope u on the meridian is s u (1 + k u^2): a barrel for k < 0. Every number is dyadic and
  // short, so the closed forms are doubles and the estimator, rounding once, gives them back.
  const [scale, k, probeSlope] = [64, -(2 ** -4), -(2 ** -8)];
  const fields = [-0.125, -0.25, -0.5, -0.75];
  const landing = (u: number) => scale * u * (1 + k * u * u);
  const estimate = estimateDistortion(
    setOf({
      x: [0, ...fields.map(() => 0)],
      // The probe lands where the scale says: its own distortion, s k u^3 of 2^-24 mm, is no part of the reference.
      y: [scale * probeSlope, ...fields.map(landing)],
      slopeX: [0, ...fields.map(() => 0)],
      slopeY: [probeSlope, ...fields],
    }),
  );
  assert.ok(estimate.available);
  fields.forEach((u, at) => {
    const ray = at + 1;
    assert.equal(estimate.displacementY[ray], scale * k * u * u * u, `ray ${ray}`);
    assert.equal(estimate.percent[ray], 100 * k * u * u, `ray ${ray}`);
  });
});

test("a displacement whose landing and ideal height nearly cancel keeps the rest of the ideal height's product", () => {
  // probe (1 + 2^-30) at the slope 1, a ray of slope (1 + 2^-30): its ideal height is (1 + 2^-30)^2, exactly
  // 1 + 2^-29 + 2^-60, which a double rounds to 1 + 2^-29; the ray lands there, so the exact displacement is -2^-60,
  // which the plain `landing - probe * ratio` gives as 0.
  const a = 1 + 2 ** -30;
  const estimate = estimateDistortion(setOf({ x: [0, 0], y: [a, 1 + 2 ** -29], slopeX: [0, 0], slopeY: [1, a] }));
  assert.ok(estimate.available);
  assert.equal(estimate.displacementY[1], -(2 ** -60));
  assert.equal(1 + 2 ** -29 - a * a, 0, "the plain formula loses the whole displacement");
});

test("a displacement is the exact displacement of the doubles it is given, rounded to the nearest double", () => {
  const next = series(19);
  let plainMisses = 0;
  for (let ray = 0; ray < 5000; ray++) {
    const probeSlope = -(0.001 + next() * 0.01);
    const probe = (next() * 200 + 10) * probeSlope;
    const slope = -(next() * 0.9);
    const ratio = slope / probeSlope;
    // Landings near their ideal heights, distorted by a part in 10^3 to 10^12, where the product's rounding counts.
    const ideal = probe * ratio;
    const landing = ideal * (1 + (next() - 0.5) * 10 ** -(3 + Math.floor(next() * 10)));
    const estimate = estimateDistortion(
      setOf({ x: [0, 0], y: [probe, landing], slopeX: [0, 0], slopeY: [probeSlope, slope] }),
    );
    assert.ok(estimate.available);
    const exact = exactDisplacement(landing, probe, ratio);
    assert.equal(estimate.displacementY[1], exact, `ray ${ray}: ${estimate.displacementY[1]} against ${exact}`);
    if (landing - probe * ratio !== exact) plainMisses++;
    // The percent is 100 D I / I^2 of the rounded ideal height, four roundings: within four units of the exact
    // 100 D / I of the doubles D and I.
    const [numerator, denominator] = [times({ numerator: 100n, shift: 0 }, dyadicOf(exact)), dyadicOf(ideal)];
    const percent =
      ideal > 0
        ? nearestQuotient(numerator, denominator)
        : nearestQuotient(minus(ZERO, numerator), minus(ZERO, denominator));
    assert.ok(Math.abs(estimate.percent[1] - percent) <= 4 * ulp(percent), `ray ${ray}: percent`);
  }
  // The plain formula misses the nearest double of a good share of them: the test can tell the two apart.
  assert.ok(plainMisses > 500, `${plainMisses}`);

  // Landings anywhere, far from their ideal heights: the difference is no longer exact, and its rest and the
  // product's together decide the rounding of a few (found with the rests removed one at a time).
  let restDecides = 0;
  for (let ray = 0; ray < 200000; ray++) {
    const probe = 1 + next();
    const slope = (next() + 0.5) * 2 ** -(2 + Math.floor(next() * 3));
    const landing = 1 + next();
    const estimate = estimateDistortion(setOf({ x: [0, 0], y: [probe, landing], slopeX: [0, 0], slopeY: [1, slope] }));
    assert.ok(estimate.available);
    const exact = exactDisplacement(landing, probe, slope);
    assert.equal(estimate.displacementY[1], exact, `far ray ${ray}`);
    // Without the difference's rest: the landing less the rounded ideal height, less the product's rest.
    const ideal = probe * slope;
    if (landing - ideal - twoProductError(probe, slope, ideal) !== exact) restDecides++;
  }
  assert.ok(restDecides > 0, "the series has rays whose rounding the difference's rest decides");
});

test("a ray off the meridian is displaced in both coordinates, its percent radial", () => {
  // A probe of slope -2^-4 landing at -2 mm: scale 32 mm. A ray of slopes (0.25, -0.5) has the ideal point (8, -16)
  // and lands at (8.5, -17): displaced (0.5, -1), radially by (0.5 * 8 + 1 * 16) / 320 = 1/16, 6.25 percent.
  const estimate = estimateDistortion(
    setOf({ x: [0, 8.5], y: [-2, -17], slopeX: [0, 0.25], slopeY: [-(2 ** -4), -0.5] }),
  );
  assert.ok(estimate.available);
  assert.equal(estimate.scaleMm, 32);
  assert.deepEqual(
    [estimate.idealX[1], estimate.idealY[1], estimate.displacementX[1], estimate.displacementY[1], estimate.percent[1]],
    [8, -16, 0.5, -1, 6.25],
  );
});

test("a ray without a distortion says why; a set without a scale says why; arrays of another set throw", () => {
  const set = {
    x: [0, 0, Number.NaN, 0, 1e300, 0],
    y: [-1, -2, 0, 0, 0, -3],
    slopeX: [0, 0, 0, 0, 0, 0],
    slopeY: [-0.5, -1, -1, 0, -1e-300, -1.5],
    valid: [1, 1, 1, 1, 1, 0],
    reference: 0,
  };
  const estimate = estimateDistortion(set);
  assert.ok(estimate.available);
  assert.deepEqual(estimate.reason, ["reference", null, "bad-landing", "on-axis", "out-of-range", "not-taken"]);
  for (const ray of [0, 2, 3, 4, 5]) {
    assert.ok(Number.isNaN(estimate.displacementY[ray]) && Number.isNaN(estimate.percent[ray]), `ray ${ray}`);
  }
  assert.deepEqual(
    [
      estimateDistortion({ ...set, valid: [0, 1, 1, 1, 1, 1] }),
      estimateDistortion({ ...set, y: [0, ...set.y.slice(1)] }),
      estimateDistortion({ ...set, slopeY: [0, ...set.slopeY.slice(1)] }),
      estimateDistortion({ ...set, y: [Number.NaN, ...set.y.slice(1)] }),
    ].map((outcome) => (outcome.available ? "available" : outcome.reason)),
    ["no-reference", "no-scale", "no-scale", "no-scale"],
  );
  assert.throws(() => estimateDistortion({ ...set, slopeX: [0] }), RangeError);
  assert.throws(() => estimateDistortion({ ...set, valid: [1] }), RangeError);
  assert.throws(() => estimateDistortion({ ...set, reference: 6 }), RangeError);
});

test("a probe off the meridian scales nothing: the reference is rectilinear about the meridian, where its scale is", () => {
  // A perfect rectilinear image of scale 32 mm: a ray of slopes (sx, sy) lands at 32 (sx, sy). The probe is the first
  // ray. Every value is a binary fraction, so each product below is exact.
  const scale = 32;
  const slopeX = [0, 0.125, -0.25];
  const slopeY = [-(2 ** -10), -0.5, 0.375];
  const meridional = {
    x: slopeX.map((sx) => scale * sx),
    y: slopeY.map((sy) => scale * sy),
    slopeX,
    slopeY,
    reference: 0,
  };
  const exact = estimateDistortion(meridional);
  assert.ok(exact.available);
  assert.equal(exact.scaleMm, scale);
  assert.deepEqual([...exact.displacementX.slice(1), ...exact.displacementY.slice(1)], [0, 0, 0, 0]);
  // A meridional probe whose x is a negative zero is on the meridian.
  const signed = estimateDistortion({ ...meridional, x: [-0, ...meridional.x.slice(1)], slopeX: [-0, 0.125, -0.25] });
  assert.ok(signed.available);
  // Launched at the slopes (2^-10, -2^-10), the same image puts the probe at 32 (2^-10, -2^-10): its height over its y
  // slope is still 32, but the reference is no longer one about the meridian, and the estimator says so.
  const skewSlopeX = [2 ** -10, 0.125, -0.25];
  const skew = estimateDistortion({ ...meridional, slopeX: skewSlopeX, x: skewSlopeX.map((sx) => scale * sx) });
  assert.ok(!skew.available);
  assert.equal(skew.reason, "no-scale");
  assert.match(skew.message, /^the probe, ray 0, is off the meridian: its x slope is 0\.0009765625/);
  // A meridional launch that lands off the meridian (an engine's x landing of the probe is not 0) scales nothing either.
  const landed = estimateDistortion({ ...meridional, x: [2 ** -40, ...meridional.x.slice(1)] });
  assert.ok(!landed.available);
  assert.equal(landed.reason, "no-scale");
  assert.match(landed.message, /lands at x = 9\.094947017729282e-13 mm$/);
});
