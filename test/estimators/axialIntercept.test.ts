// The axial-intercept estimator held to its definition: every expected value is worked out in the test, in closed
// form or in exact fractions (whole numbers over powers of two), never taken from an engine. A carried rest of the
// estimator that is removed turns a test here red: the intercepts of a series of rays are held to the nearest double
// of the exact intercept, which the plain formula misses; a focus about which the moments cancel is held to one unit
// in its last place, which a plain sum misses; the weight of a focus, whose squares leave rests that add up, is held
// to the bit; and a height to the nearest double of the exact one.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  axialIntercept,
  axialIntercepts,
  colourFigures,
  heightAt,
  leastSquaresFocus,
  meanOfTwo,
  pairsTaken,
  sphericalFigures,
} from "../../src/estimators/axialIntercept.ts";
import type { AxialInterceptSet } from "../../src/estimators/axialIntercept.ts";
import { dyadicOf, minus, nearestQuotient, nearestRoot, plus, series, times, ulp } from "./support.ts";
import type { Dyadic } from "./support.ts";

const ZERO: Dyadic = { numerator: 0n, shift: 0 };

/** The exact intercept z - y n / m of doubles, as the nearest double: (z m - y n) / m in exact fractions. */
function exactIntercept(y: number, z: number, m: number, n: number): number {
  const numerator = minus(times(dyadicOf(z), dyadicOf(m)), times(dyadicOf(y), dyadicOf(n)));
  const denominator = dyadicOf(m);
  return m > 0
    ? nearestQuotient(numerator, denominator)
    : nearestQuotient(minus(ZERO, numerator), minus(ZERO, denominator));
}

/** A set of intercepts and slopes, every ray with an intercept. */
function setOf(z: readonly number[], slope: readonly number[]): AxialInterceptSet {
  return { z: Float64Array.from(z), slope: Float64Array.from(slope), reason: z.map(() => null) };
}

test("rays aimed at one point of the axis cross it there, to the bit, and their slope is m / n rounded once", () => {
  // Dyadic vertices, so that f - z is a double and the exact intercept is f, which the estimator, rounding once,
  // gives back; the heights are any doubles.
  const next = series(11);
  const focus = 100.5;
  for (let ray = 0; ray < 2000; ray++) {
    const y = (next() - 0.5) * 40;
    if (y === 0) continue;
    const z = 50 + Math.round(next() * 1280) / 128;
    // Toward (0, 0, focus), not scaled to a unit vector: the intercept does not depend on the direction's length.
    const [m, n] = [-y, focus - z];
    const crossing = axialIntercept([0, y, z], [0, m, n]);
    assert.ok(crossing.available);
    assert.equal(crossing.z, focus, `ray ${ray}`);
    assert.equal(crossing.slope, m / n);
  }
});

test("an intercept is the exact intercept of the doubles it is given, rounded to the nearest double", () => {
  const next = series(7);
  let plainMisses = 0;
  for (let ray = 0; ray < 5000; ray++) {
    const y = (next() - 0.5) * 40;
    const z = 40 + next() * 20;
    const angle = (next() - 0.5) * 0.8;
    // A unit direction, as an engine reports one; its two components are rounded, which changes nothing here.
    const [m, n] = [Math.sin(angle), Math.cos(angle)];
    if (m === 0) continue;
    const crossing = axialIntercept([0, y, z], [0, m, n]);
    assert.ok(crossing.available);
    const exact = exactIntercept(y, z, m, n);
    assert.equal(crossing.z, exact, `ray ${ray}: y ${y}, z ${z}, m ${m}, n ${n}`);
    if (z - (y * n) / m !== exact) plainMisses++;
  }
  assert.ok(plainMisses > 100, `the plain formula misses ${plainMisses} of 5000: the test does not hold the rests`);
});

test("a ray off the meridional plane, parallel to the axis, on it, of no finite exit or none in range has no intercept", () => {
  const reasonOf = (point: number[], direction: number[]): string => {
    const crossing = axialIntercept(point, direction);
    return crossing.available ? "crosses" : crossing.reason;
  };
  assert.equal(reasonOf([1e-300, 1, 10], [0, -0.1, 1]), "skew");
  assert.equal(reasonOf([0, 1, 10], [-1e-300, -0.1, 1]), "skew");
  assert.equal(reasonOf([0, 1, 10], [0, 0, 1]), "parallel");
  assert.equal(reasonOf([0, 0, 10], [0, 0, 1]), "on-axis");
  assert.equal(reasonOf([0, Number.NaN, 10], [0, -0.1, 1]), "bad-exit");
  assert.equal(reasonOf([0, 1, 10], [0, -0.1, Number.POSITIVE_INFINITY]), "bad-exit");
  // -0 is 0: a ray of the meridional plane may carry a negative zero.
  assert.equal(reasonOf([-0, 1, 10], [-0, -0.5, 1]), "crosses");
  // A ray of so small a slope that y n / m overflows: 1 / 1e-310 is beyond the largest double, and the intercept would
  // be a NaN, never a figure.
  assert.equal(reasonOf([0, 1, 100], [0, -1e-310, 1]), "out-of-range");
  assert.equal(reasonOf([0, 1e300, 100], [0, -1e-10, 1]), "out-of-range");
  // A finite intercept of a slope that overflows: m / n is 1 / 1e-310. And a ray across the axis at right angles,
  // whose direction has no z: its slope is infinite.
  assert.equal(reasonOf([0, 1, 100], [0, -1, 1e-310]), "out-of-range");
  assert.equal(reasonOf([0, 2, 10], [0, -1, 0]), "out-of-range");
  // Far along the axis, and within the range of the splitting of the products, the intercept is still the nearest
  // double of the exact one: y n / m is 2^600 here.
  const far = axialIntercept([0, 2 ** 300, 100], [0, -(2 ** -300), 1]);
  assert.ok(far.available);
  assert.equal(far.z, 100 + 2 ** 600);
  assert.equal(far.slope, -(2 ** -300));
});

test("a set's intercepts name every ray without one, the rays left out not-taken", () => {
  const exitPoint = [0, 1, 10, 0, -1, 10, 0, 1, 10, 0, 2, 10];
  const exitDirection = [0, -0.5, 1, 0, 0.5, 1, 0, 0, 1, 0, -1, 1];
  const set = axialIntercepts({ exitPoint, exitDirection, valid: [1, 1, 1, 0] });
  assert.deepEqual(set.reason, [null, null, "parallel", "not-taken"]);
  assert.deepEqual([...set.z], [12, 12, Number.NaN, Number.NaN]);
  assert.deepEqual([...set.slope], [-0.5, 0.5, Number.NaN, Number.NaN]);
  assert.throws(() => axialIntercepts({ exitPoint, exitDirection: exitDirection.slice(3) }), RangeError);
  assert.throws(() => axialIntercepts({ exitPoint, exitDirection, valid: [1] }), RangeError);
});

test("a height on a plane is the slope times the distance from the intercept, rounded once", () => {
  const next = series(3);
  for (let ray = 0; ray < 1000; ray++) {
    // Planes far from the intercepts too, where their difference is no double.
    const [z, slope, plane] = [next() * 1000, (next() - 0.5) * 0.6, 100 + next()];
    const exact = times(dyadicOf(slope), minus(dyadicOf(plane), dyadicOf(z)));
    const nearest = nearestQuotient(exact, { numerator: 1n, shift: 0 });
    assert.equal(heightAt(z, slope, plane), nearest, `ray ${ray}`);
  }
});

test("rays that meet at one point have that point as their focus, and nothing to spread", () => {
  const slopes = [-0.3, 0.3, -0.125, 0.125, -0.0625, 0.0625];
  const focus = leastSquaresFocus(
    setOf(
      slopes.map(() => 98.25),
      slopes,
    ),
    slopes.map(() => 1),
  );
  assert.ok(focus.available);
  assert.equal(focus.z, 98.25);
  assert.equal(focus.rmsMm, 0);
  assert.equal(focus.peakMm, 0);
  assert.equal(focus.rays, 6);
  // The RMS slope is that of the six: sqrt((2 * 0.09 + 2 * 0.015625 + 2 * 0.00390625) / 6), within a rounding.
  const exact = Math.sqrt((0.18 + 0.03125 + 0.0078125) / 6);
  assert.ok(Math.abs(focus.rmsSlope - exact) <= 2 * ulp(exact));
});

test("an undercorrected zone pattern has the least-squares focus and RMS of the closed form", () => {
  // Slopes u = -k h and intercepts z = f - c h^2 of zones h = +-1 and +-2. The squared heights at a plane Z are
  // k^2 h^2 (Z - f + c h^2)^2, least at Z = f - c (sum h^4) / (sum h^2) = f - c 34 / 10 = f - 3.4 c; there the
  // heights are k c h (h^2 - 3.4), +-2.4 k c and +-1.2 k c, whose RMS is k c sqrt((2 * 2.4^2 + 2 * 1.2^2) / 4).
  const [k, c, f] = [0.125, 0.0625, 120];
  const h = [1, -1, 2, -2];
  const set = setOf(
    h.map((zone) => f - c * zone * zone),
    h.map((zone) => -k * zone),
  );
  const focus = leastSquaresFocus(set, [1, 1, 1, 1]);
  assert.ok(focus.available);
  const expectedFocus = f - 3.4 * c;
  assert.ok(Math.abs(focus.z - expectedFocus) <= ulp(expectedFocus), `${focus.z} against ${expectedFocus}`);
  const expectedRms = k * c * Math.sqrt((2 * 2.4 * 2.4 + 2 * 1.2 * 1.2) / 4);
  assert.ok(Math.abs(focus.rmsMm - expectedRms) <= 1e-12 * expectedRms, `${focus.rmsMm} against ${expectedRms}`);
  const expectedPeak = 2.4 * k * c;
  assert.ok(Math.abs(focus.peakMm - expectedPeak) <= 1e-12 * expectedPeak);
});

/** The exact least-squares focus of intercepts and slopes, sum u^2 z / sum u^2, as the nearest double. */
function exactFocus(z: readonly number[], slope: readonly number[]): number {
  const squares = slope.map((u) => times(dyadicOf(u), dyadicOf(u)));
  const numerator = plus(...squares.map((square, at) => times(square, dyadicOf(z[at]))));
  return nearestQuotient(numerator, plus(...squares));
}

test("a focus is within one unit of its last place of the exact focus, also where the moments cancel", () => {
  const next = series(19);
  for (let bundle = 0; bundle < 200; bundle++) {
    const count = 4 + Math.floor(next() * 40);
    const z = Array.from({ length: count }, () => 90 + next() * 20);
    const slope = Array.from({ length: count }, () => (next() - 0.5) * 0.8);
    const focus = leastSquaresFocus(
      setOf(z, slope),
      z.map(() => 1),
    );
    assert.ok(focus.available);
    const exact = exactFocus(z, slope);
    assert.ok(Math.abs(focus.z - exact) <= ulp(exact), `bundle ${bundle}: ${focus.z} against ${exact}`);
  }
  // Intercepts far on either side of the first, which is no dyadic number, at slopes whose squared moments cancel
  // to a small remainder: the focus is still within a unit of its last place. Dropping either rest of the moments,
  // of a square or of a difference from the first intercept, misses it; so does a plain sum.
  const first = 100.1;
  const z = [first];
  const slope = [0.1];
  for (const [u, v, far] of [
    [0.3, 0.29, 2 ** 20 + 0.123],
    [0.31, 0.33, 2 ** 19 + 0.456],
  ]) {
    z.push(first + far, first - (far * u * u) / (v * v));
    slope.push(u, v);
  }
  const focus = leastSquaresFocus(
    setOf(z, slope),
    z.map(() => 1),
  );
  assert.ok(focus.available);
  const exact = exactFocus(z, slope);
  assert.ok(Math.abs(focus.z - exact) <= ulp(exact), `${focus.z} against ${exact}`);
  const plain =
    z.reduce((sum, value, at) => sum + slope[at] * slope[at] * value, 0) / slope.reduce((s, u) => s + u * u, 0);
  assert.ok(Math.abs(plain - exact) > ulp(exact), "the plain sum is exact here: the test does not hold the rests");
});

test("the weight of a focus is the exact sum of the squared slopes rounded once, the rest of each square carried", () => {
  // Three slopes just above 1 whose squares each leave a rest of nearly half a unit (2^-53): the rests add up to more
  // than half a unit of the sum (2^-52, the sum above 2), so the sum of the rounded squares is one unit below the sum
  // of the squares. The first intercept is 0 and the others whole numbers, so the moment about it is exact too: the
  // focus is the moment rounded once over the weight rounded once, and the RMS slope the root of a third of that weight.
  const slope = [1.0000005216687173, 1.0000009091833824, 1.000000298214675];
  const z = [0, 1, 2];
  const squares = slope.map((u) => times(dyadicOf(u), dyadicOf(u)));
  const one: Dyadic = { numerator: 1n, shift: 0 };
  const weight = nearestQuotient(plus(...squares), one);
  const moment = nearestQuotient(plus(...squares.map((square, at) => times(square, dyadicOf(z[at])))), one);
  const focus = leastSquaresFocus(setOf(z, slope), [1, 1, 1]);
  assert.ok(focus.available);
  assert.equal(focus.z, moment / weight);
  assert.equal(focus.rmsSlope, Math.sqrt(weight / 3));
  // The rounded squares give another weight, and another focus and RMS slope: the test holds the rest of each square.
  const rounded = nearestQuotient(plus(...slope.map((u) => dyadicOf(u * u))), one);
  assert.notEqual(rounded, weight);
  assert.notEqual(moment / rounded, moment / weight);
  assert.notEqual(Math.sqrt(rounded / 3), Math.sqrt(weight / 3));
});

test("the RMS height at a focus is the exact RMS of the heights on the plane of that focus, within two units", () => {
  const next = series(23);
  for (let bundle = 0; bundle < 100; bundle++) {
    const count = 2 + 2 * Math.floor(next() * 20);
    const z = Array.from({ length: count }, () => 95 + next() * 10);
    const slope = Array.from({ length: count }, () => (next() - 0.5) * 0.6);
    const focus = leastSquaresFocus(
      setOf(z, slope),
      z.map(() => 1),
    );
    assert.ok(focus.available);
    // The heights at the double the focus is, exactly; their mean square; its root.
    const plane = dyadicOf(focus.z);
    const squares = z.map((at, ray) => {
      const height = times(dyadicOf(slope[ray]), minus(plane, dyadicOf(at)));
      return times(height, height);
    });
    const exact = nearestRoot(plus(...squares), { numerator: BigInt(count), shift: 0 });
    assert.ok(Math.abs(focus.rmsMm - exact) <= 2 * ulp(exact), `bundle ${bundle}: ${focus.rmsMm} against ${exact}`);
  }
});

test("the RMS at a focus is the root of the exact sum of the squares of its heights, rounded once, to the bit", () => {
  // The heights are the estimator's own on the plane of its focus (heightAt, held to the bit above); the sum of their
  // squares is formed exactly here and rounded once, divided by the count and its root taken, as the definition says.
  // The sum of the rounded squares misses some of them: the test holds the rest of each square.
  const next = series(29);
  const one: Dyadic = { numerator: 1n, shift: 0 };
  let plainMisses = 0;
  for (let bundle = 0; bundle < 300; bundle++) {
    const count = 2 + 2 * Math.floor(next() * 20);
    const z = Array.from({ length: count }, () => 95 + next() * 10);
    const slope = Array.from({ length: count }, () => (next() - 0.5) * 0.6);
    const focus = leastSquaresFocus(
      setOf(z, slope),
      z.map(() => 1),
    );
    assert.ok(focus.available);
    const heights = z.map((at, ray) => heightAt(at, slope[ray], focus.z));
    const exact = nearestQuotient(plus(...heights.map((height) => times(dyadicOf(height), dyadicOf(height)))), one);
    assert.equal(focus.rmsMm, Math.sqrt(exact / count), `bundle ${bundle}`);
    const rounded = nearestQuotient(plus(...heights.map((height) => dyadicOf(height * height))), one);
    if (Math.sqrt(rounded / count) !== focus.rmsMm) plainMisses++;
  }
  assert.ok(plainMisses > 0, "the rounded squares are exact here: the test does not hold their rests");
});

test("a focus says why it has none: no ray taken, no slope; a ray taken without an intercept throws", () => {
  const set = setOf([10, 10], [0, 0]);
  const none = leastSquaresFocus(set, [0, 0]);
  assert.ok(!none.available && none.reason === "no-rays");
  const flat = leastSquaresFocus(set, [1, 1]);
  assert.ok(!flat.available && flat.reason === "no-slope");
  const without: AxialInterceptSet = {
    z: Float64Array.of(Number.NaN),
    slope: Float64Array.of(Number.NaN),
    reason: ["parallel"],
  };
  assert.throws(() => leastSquaresFocus(without, [1]), RangeError);
  assert.throws(() => leastSquaresFocus(set, [1]), RangeError);
});

test("rays are taken in pairs, only where both of a pair cross the axis; the mean of two is rounded once", () => {
  const set: AxialInterceptSet = {
    z: Float64Array.of(1, 1, 2, Number.NaN, 3, 3),
    slope: Float64Array.of(1, -1, 1, Number.NaN, 1, -1),
    reason: [null, null, null, "not-taken", null, null],
  };
  assert.deepEqual([...pairsTaken(set)], [1, 1, 0, 0, 1, 1]);
  assert.throws(() => pairsTaken(setOf([1], [1])), RangeError);
  // Halving is exact, so half the rounded sum is the nearest double of the mean.
  const next = series(5);
  for (let at = 0; at < 1000; at++) {
    const [a, b] = [next() * 200, next() * 200];
    const exact = nearestQuotient(plus(dyadicOf(a), dyadicOf(b)), { numerator: 2n, shift: 0 });
    assert.equal(meanOfTwo(a, b), exact);
  }
});

/** A set of signed fractions and the intercepts and slopes of their rays; a fraction mapped to null does not cross. */
function zoneSet(rays: readonly (readonly [number, number, number] | readonly [number, null, null])[]) {
  return {
    fractions: Float64Array.from(rays, (ray) => ray[0]),
    set: {
      z: Float64Array.from(rays, (ray) => ray[1] ?? Number.NaN),
      slope: Float64Array.from(rays, (ray) => ray[2] ?? Number.NaN),
      reason: rays.map((ray) => (ray[1] === null ? ("not-taken" as const) : null)),
    } satisfies AxialInterceptSet,
  };
}

test("the spherical figures of a line are the section's: pair means, the first marginal pair, the profile", () => {
  // Zones 0.25 (near axis), 0.5, 0.75 (one ray lost), 1; slopes -k h, intercepts f - c h^2 of h = 8 fraction.
  const [k, c, f] = [0.0625, 0.03125, 64];
  const ray = (fraction: number): readonly [number, number, number] => {
    const h = 8 * Math.abs(fraction);
    return [fraction, f - c * h * h, -k * 8 * fraction];
  };
  const { fractions, set } = zoneSet([
    ray(0.25),
    ray(-0.25),
    ray(0.5),
    ray(-0.5),
    ray(0.75),
    [-0.75, null, null],
    ray(1),
    ray(-1),
  ]);
  const roles = { fractions, nearAxis: 0.25, marginal: [0.9, 0.75, 0.5], profile: [0.25, 0.5, 0.75, 1] };
  const made = sphericalFigures(set, roles, 63);
  assert.ok("figures" in made);
  const { figures } = made;
  // The near-axis pair crosses at f - c 4, the marginal candidates 0.9 (no ray) and 0.75 (one lost) are passed over.
  assert.equal(figures.nearAxisInterceptZ, f - c * 4);
  assert.equal(figures.marginalFraction, 0.5);
  assert.equal(figures.marginalInterceptZ, f - c * 16);
  // The near-axis pair lands symmetrically: its mean height on any plane is 0.
  assert.equal(figures.landingMm, 0);
  // The focus of the zones 2, 4 and 8 (h), closed form: f - c (sum h^4) / (sum h^2) = f - c 4368 / 84 = f - 52 c.
  const focus = f - 52 * c;
  assert.ok(Math.abs(figures.bestFocusZ - focus) <= ulp(focus));
  // The profile: each zone's plus ray at the focus, relative to the near-axis plus ray: -k h (Z - f + c h^2) less
  // that of h = 2; the lost zone is NaN.
  const height = (h: number): number => -k * h * (focus - f + c * h * h);
  const expected = [0, height(4) - height(2), Number.NaN, height(8) - height(2)];
  figures.profileMm.forEach((value, zone) => {
    if (Number.isNaN(expected[zone])) assert.ok(Number.isNaN(value));
    else assert.ok(Math.abs(value - expected[zone]) <= 1e-12, `zone ${zone}: ${value} against ${expected[zone]}`);
  });
  // The RMS of the six rays of the three whole zones at the focus.
  const rms = Math.sqrt((2 * height(2) ** 2 + 2 * height(4) ** 2 + 2 * height(8) ** 2) / 6);
  assert.ok(Math.abs(figures.bestFocusRmsMm - rms) <= 1e-12 * rms);
});

test("spherical figures say which part is missing", () => {
  const { fractions, set } = zoneSet([
    [0.25, 10, -0.1],
    [-0.25, 10, 0.1],
    [0.5, 9, -0.2],
    [-0.5, null, null],
  ]);
  const roles = { fractions, nearAxis: 0.25, marginal: [0.5], profile: [0.25, 0.5] };
  assert.deepEqual(sphericalFigures(set, roles, 10), { reason: "no-marginal" });
  assert.deepEqual(sphericalFigures(set, { ...roles, nearAxis: 0.5 }, 10), { reason: "no-near-axis" });
  assert.deepEqual(sphericalFigures(set, { ...roles, marginal: [0.25] }, 10), { reason: "no-profile" });
  const whole = zoneSet([
    [0.25, 10, -0.1],
    [-0.25, 10, 0.1],
    [0.5, 9, -0.2],
    [-0.5, 9, 0.2],
  ]);
  // The near-axis zone is no zone of the profile: no reference for it.
  const outside = { fractions: whole.fractions, nearAxis: 0.25, marginal: [0.5], profile: [0.5, 0.5] };
  assert.deepEqual(sphericalFigures(whole.set, outside, 10), { reason: "no-focus" });
});

test("the colour figures take the first fraction that crosses at two lines, or the one they are given", () => {
  const line = (rays: readonly (readonly [number, number, number] | readonly [number, null, null])[]) => zoneSet(rays);
  const lines = [
    line([
      [0.9, null, null],
      [0.7, 50, -0.2],
    ]),
    line([
      [0.9, 51, -0.3],
      [0.7, 50.5, -0.2],
    ]),
    line([
      [0.9, null, null],
      [0.7, null, null],
    ]),
  ];
  const figures = colourFigures(lines, [0.9, 0.7], 50.25);
  assert.equal(figures[0]?.marginalFraction, 0.7);
  assert.equal(figures[0]?.marginalInterceptZ, 50);
  assert.equal(figures[1]?.marginalInterceptZ, 50.5);
  assert.equal(figures[2], null);
  assert.equal(figures[0]?.landingMm, heightAt(50, -0.2, 50.25));
  // Asked at a fraction: the first line has no ray there that crosses.
  const at = colourFigures(lines, [0.9, 0.7], 50.25, 0.9);
  assert.deepEqual(
    at.map((each) => each?.marginalInterceptZ ?? null),
    [null, 51, null],
  );
  // One line: its own first crossing.
  assert.equal(colourFigures([lines[1]], [0.9, 0.7], 50)[0]?.marginalFraction, 0.9);
  // No fraction crosses at two lines.
  assert.deepEqual(colourFigures([lines[0], lines[2]], [0.9, 0.7], 50), [null, null]);
});
