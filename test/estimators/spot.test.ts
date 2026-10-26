// The spot estimator, held to closed forms derived here (a perfect focus, a pure defocus disc, the comet of pure
// coma, a tilted plane of transverse error) and to its definition carried out in whole numbers. No expected value
// is another estimator's or an engine's.
import assert from "node:assert/strict";
import { test } from "node:test";

import { estimateSpot } from "../../src/estimators/spot.ts";
import type { SpotEstimate, SpotRays, SpotUnavailable } from "../../src/estimators/spot.ts";
import { dyadicOf, minus, nearestQuotient, nearestRoot, plus, series, times } from "./support.ts";
import type { Dyadic } from "./support.ts";

/** One unit in the last place of 1: the relative rounding of one IEEE 754 operation is at most half of it. */
const U = 2 ** -53;

function available(outcome: SpotEstimate | SpotUnavailable): SpotEstimate {
  if (!outcome.available) assert.fail(`unavailable: ${outcome.reason}: ${outcome.message}`);
  return outcome;
}

function assertNear(actual: number, expected: number, tolerance: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} against ${expected}, within ${tolerance}`);
}

// ── A pupil on which the spot's moments are exact ────────────────────────────────────────────────────────────────
//
// The mean of a polynomial of degree at most 4 in the pupil coordinates over the unit disc is the mean over this
// cubature, exactly: two radii whose squares are the Gauss-Legendre nodes 1/2 -+ sqrt(3)/6 of [0, 1] (exact for a
// polynomial of degree 3 in t = r^2, and every even monomial of degree 4 or less is one of degree 2 in t), times
// eight even azimuths (exact for a trigonometric polynomial of degree below 8; every odd monomial has a mean 0 over
// the azimuths, whatever the radius). Each of the sixteen points has the same weight. The means it needs:
//
//   <x^2> = <y^2> = 1/4,   <xy> = 0,   <x^4> = <y^4> = 1/8,   <x^2 y^2> = 1/24,   every odd moment 0.
//
// The azimuths' cosines and sines are 0, -+1 and -+sqrt(1/2), so the points are symmetric in both axes to the bit.
// In doubles each coordinate is within 5 roundings of the node (two square roots, a division, a subtraction, a
// product), a moment of degree 4 within 20, the estimator within 16 more of its definition on the rounded points:
// every comparison with a closed form below is held to 64 roundings of the expected value.
const CLOSED_FORM = 64 * U;

/**
 * A landing is the chief ray's place plus the error, rounded once: within half a unit in the last place of a number
 * below 32 (the chief ray lies at y 17.6875, and no error below reaches 14), so an error read back as the difference
 * of two landings is within 2^-49 mm of the one the spot was made with, in each coordinate. A centroid and a radius
 * are within twice that of the closed form on top of the roundings of the closed form itself.
 */
const LANDING = 2 * 2 ** -49;

const ROOT_HALF = Math.SQRT1_2;
const AZIMUTHS: readonly (readonly [cosine: number, sine: number])[] = [
  [1, 0],
  [ROOT_HALF, ROOT_HALF],
  [0, 1],
  [-ROOT_HALF, ROOT_HALF],
  [-1, 0],
  [-ROOT_HALF, -ROOT_HALF],
  [0, -1],
  [ROOT_HALF, -ROOT_HALF],
];
const RADII = [Math.sqrt(0.5 - Math.sqrt(3) / 6), Math.sqrt(0.5 + Math.sqrt(3) / 6)];
const PUPIL: readonly (readonly [px: number, py: number])[] = RADII.flatMap((radius) =>
  AZIMUTHS.map(([cosine, sine]) => [radius * cosine, radius * sine] as const),
);

/** A chief ray at a place that is no round number, so that every landing is a difference of two doubles. */
const CHIEF = { x: -0.375, y: 17.6875 };

/**
 * The rays of a spot whose transverse error at each pupil point is `error(px, py)`: the chief ray last, weight 0,
 * and every pupil point a ray of weight 1.
 */
function spotOf(error: (px: number, py: number) => readonly [ex: number, ey: number]): SpotRays {
  const x = PUPIL.map(([px, py]) => CHIEF.x + error(px, py)[0]);
  const y = PUPIL.map(([px, py]) => CHIEF.y + error(px, py)[1]);
  return {
    x: [...x, CHIEF.x],
    y: [...y, CHIEF.y],
    weight: [...PUPIL.map(() => 1), 0],
    chief: PUPIL.length,
  };
}

// ── The definition, in whole numbers ─────────────────────────────────────────────────────────────────────────────

/**
 * The centroid and the RMS radius of the definition, worked out exactly on the doubles given and rounded once:
 * e = p - p_chief, W = sum of w, S = sum of w e, centroid S / W, and the RMS radius the root of
 * (W sum of w |e|^2 - |S|^2) / W^2, which is the mean of w |e - S / W|^2. Shares no line with the estimator.
 */
function exactSpot(rays: SpotRays): { centroid: { x: number; y: number }; rmsRadius: number; scale: number } {
  const zero: Dyadic = { numerator: 0n, shift: 0 };
  let flux = zero;
  let sumX = zero;
  let sumY = zero;
  let squares = zero;
  let magnitudes = 0;
  for (let ray = 0; ray < rays.x.length; ray++) {
    if (ray === rays.chief || (rays.valid !== undefined && rays.valid[ray] === 0)) continue;
    const w = dyadicOf(rays.weight[ray]);
    const ex = minus(dyadicOf(rays.x[ray]), dyadicOf(rays.x[rays.chief]));
    const ey = minus(dyadicOf(rays.y[ray]), dyadicOf(rays.y[rays.chief]));
    flux = plus(flux, w);
    sumX = plus(sumX, times(w, ex));
    sumY = plus(sumY, times(w, ey));
    squares = plus(squares, times(w, plus(times(ex, ex), times(ey, ey))));
    magnitudes += rays.weight[ray] * Math.hypot(rays.x[ray] - rays.x[rays.chief], rays.y[ray] - rays.y[rays.chief]);
  }
  const variance = minus(times(flux, squares), plus(times(sumX, sumX), times(sumY, sumY)));
  return {
    centroid: { x: nearestQuotient(sumX, flux), y: nearestQuotient(sumY, flux) },
    rmsRadius: nearestRoot(variance, times(flux, flux)),
    // The mean distance of a ray from the chief ray: what a sum that cancels to nearly 0 is to be measured against.
    scale: magnitudes / Array.from(rays.weight).reduce((sum, w, ray) => sum + (ray === rays.chief ? 0 : w), 0),
  };
}

/**
 * The estimator against the definition: the centroid within 4 roundings of its value, or of the spot's scale where
 * the value cancels to nearly 0 (the compensated sums leave at most a rounding of the sum and a rounding of a
 * rounding of every term), and the radius within 16 roundings (two for a deviation, two for its square and weight,
 * one for the sum, one for the quotient, half for the root, with room).
 */
function assertDefinition(rays: SpotRays, message: string): SpotEstimate {
  const spot = available(estimateSpot(rays));
  const exact = exactSpot(rays);
  for (const axis of ["x", "y"] as const) {
    const tolerance = 4 * U * Math.abs(exact.centroid[axis]) + 2 ** -100 * exact.scale;
    assertNear(spot.centroid[axis], exact.centroid[axis], tolerance, `${message}: centroid ${axis}`);
  }
  assertNear(spot.rmsRadius, exact.rmsRadius, 16 * U * exact.rmsRadius, `${message}: RMS radius`);
  for (let ray = 0; ray < rays.x.length; ray++) {
    const taken = ray === rays.chief || rays.valid === undefined || rays.valid[ray] !== 0;
    // The transverse error is the difference of two doubles, rounded once.
    const [ex, ey] = taken ? [rays.x[ray] - rays.x[rays.chief], rays.y[ray] - rays.y[rays.chief]] : [NaN, NaN];
    assert.equal(Object.is(spot.errorX[ray], ex) || (Number.isNaN(ex) && Number.isNaN(spot.errorX[ray])), true);
    assert.equal(Object.is(spot.errorY[ray], ey) || (Number.isNaN(ey) && Number.isNaN(spot.errorY[ray])), true);
  }
  return spot;
}

// ── Closed forms ─────────────────────────────────────────────────────────────────────────────────────────────────

test("a perfect focus: every ray on the chief ray, so the centroid, the radius and every error are 0", () => {
  const spot = assertDefinition(
    spotOf(() => [0, 0]),
    "perfect focus",
  );
  assert.deepEqual([spot.centroid.x, spot.centroid.y, spot.rmsRadius], [0, 0, 0]);
  assert.ok(spot.errorX.every((error) => error === 0) && spot.errorY.every((error) => error === 0));
  assert.equal(spot.rays, PUPIL.length);
  assert.equal(spot.flux, PUPIL.length);
  assert.deepEqual(spot.chief, CHIEF);
});

test("a pure defocus disc: e = D p, centroid 0, RMS radius D / sqrt(2)", () => {
  // A disc of radius D filled evenly has <|e|^2> = D^2 (<x^2> + <y^2>) = D^2 / 2 about its centre, the chief ray.
  for (const radius of [2 ** -10, 0.0371, 0.25, 3]) {
    const spot = assertDefinition(
      spotOf((px, py) => [radius * px, radius * py]),
      `defocus ${radius}`,
    );
    // Every point has its mirror image in the chief ray: the centroid is 0 up to the roundings of the landings.
    assertNear(spot.centroid.x, 0, LANDING, `defocus ${radius}: centroid x`);
    assertNear(spot.centroid.y, 0, LANDING, `defocus ${radius}: centroid y`);
    const expected = radius / Math.SQRT2;
    assertNear(spot.rmsRadius, expected, CLOSED_FORM * expected + LANDING, `defocus ${radius}`);
  }
});

test("the comet of pure coma: e = C (2xy, x^2 + 3y^2), centroid (0, C), RMS radius C sqrt(2/3)", () => {
  // Third-order coma in the tangential direction. With the disc's moments:
  //   <e_x> = 2C <xy> = 0,          <e_y> = C (<x^2> + 3<y^2>) = C,
  //   <e_x^2> = 4C^2 <x^2 y^2> = C^2 / 6,
  //   <e_y^2> = C^2 (<x^4> + 6<x^2 y^2> + 9<y^4>) = C^2 (1/8 + 1/4 + 9/8) = 3C^2 / 2,
  // so the variance is C^2 / 6 + 3C^2 / 2 - C^2 = 2C^2 / 3 about the centroid (0, C): the comet's head is the chief
  // ray, its tail runs 3C toward +y and it is 2C wide.
  for (const coma of [2 ** -12, 0.0123, -0.5]) {
    const spot = assertDefinition(
      spotOf((px, py) => [coma * (2 * px * py), coma * (px * px + 3 * py * py)]),
      `coma ${coma}`,
    );
    assertNear(spot.centroid.x, 0, CLOSED_FORM * Math.abs(coma) + LANDING, `coma ${coma}: centroid x`);
    assertNear(spot.centroid.y, coma, CLOSED_FORM * Math.abs(coma) + LANDING, `coma ${coma}: centroid y`);
    const expected = Math.abs(coma) * Math.sqrt(2 / 3);
    assertNear(spot.rmsRadius, expected, CLOSED_FORM * expected + LANDING, `coma ${coma}: RMS radius`);
    // Where the pupil points land: the tail of the comet is the ray of the rim on the meridian, 3C r^2 from the chief.
    const rim = RADII[1] ** 2;
    const tail = Math.max(...spot.errorY.slice(0, PUPIL.length).map((error) => Math.sign(coma) * error));
    assertNear(tail, 3 * Math.abs(coma) * rim, CLOSED_FORM * 3 * Math.abs(coma) + LANDING, `coma ${coma}: tail`);
  }
});

test("a tilted plane of transverse error: e = a + B p, centroid a, RMS radius |B| / 2", () => {
  // A tilt a (the spot displaced from the chief ray as a whole) and a linear map B of the pupil (a defocus, sheared
  // and of a different scale in x and in y). <B p> = 0 and <|B p|^2> = (B11^2 + B12^2 + B21^2 + B22^2) / 4 over the
  // disc, so the centroid is the tilt and the radius half the Frobenius norm of B.
  const cases = [
    { a: [0.0625, -0.125], b: [0.01, 0, 0, 0.03] },
    { a: [-1.5, 2.25], b: [0.02, -0.007, 0.004, -0.011] },
    { a: [0, 1e-9], b: [1e-6, 3e-7, -2e-7, 5e-7] },
  ];
  for (const { a, b } of cases) {
    const spot = assertDefinition(
      spotOf((px, py) => [a[0] + b[0] * px + b[1] * py, a[1] + b[2] * px + b[3] * py]),
      `tilted plane ${a} ${b}`,
    );
    const radius = Math.sqrt(b[0] ** 2 + b[1] ** 2 + b[2] ** 2 + b[3] ** 2) / 2;
    const scale = Math.hypot(a[0], a[1]) + radius;
    assertNear(spot.centroid.x, a[0], CLOSED_FORM * scale + LANDING, `tilted plane ${a} ${b}: centroid x`);
    assertNear(spot.centroid.y, a[1], CLOSED_FORM * scale + LANDING, `tilted plane ${a} ${b}: centroid y`);
    // The radius is of the deviations from the centroid, so the tilt leaves only its roundings in it.
    assertNear(spot.rmsRadius, radius, CLOSED_FORM * scale + LANDING, `tilted plane ${a} ${b}: RMS radius`);
  }
});

// ── The definition on spots of no closed form ────────────────────────────────────────────────────────────────────

test("on scattered spots of any weight the estimator is its definition taken exactly, to a few roundings", () => {
  const next = series(20261026);
  for (let trial = 0; trial < 40; trial++) {
    const count = 3 + Math.floor(next() * 200);
    const centre = { x: (next() - 0.5) * 40, y: (next() - 0.5) * 40 };
    const size = 10 ** (-6 + 6 * next());
    const x: number[] = [];
    const y: number[] = [];
    const weight: number[] = [];
    const valid: number[] = [];
    for (let ray = 0; ray < count; ray++) {
      x.push(centre.x + (next() - 0.5) * size);
      y.push(centre.y + (next() - 0.3) * size);
      weight.push(next() < 0.1 ? 0 : next());
      valid.push(next() < 0.15 ? 0 : 1);
    }
    const chief = Math.floor(next() * count);
    valid[chief] = 1;
    // A ray that is not taken is no number at all: what an engine answers for a ray that did not arrive.
    for (let ray = 0; ray < count; ray++) if (valid[ray] === 0) [x[ray], y[ray]] = [NaN, NaN];
    if (!weight.some((w, ray) => w > 0 && ray !== chief && valid[ray] === 1)) continue;
    assertDefinition({ x, y, weight, valid, chief }, `trial ${trial}`);
  }
});

test("a spot that cancels: two rays on either side of the chief ray, far from the origin, centroid to the bit", () => {
  // 1e3 + 2^-40 and 1e3 - 2^-40 against a chief at 1e3: the differences are exact, and they cancel to 0.
  const big = 1000;
  const step = 2 ** -40;
  const spot = assertDefinition(
    { x: [big + step, big - step, big], y: [big, big, big], weight: [1, 1, 0], chief: 2 },
    "cancelling pair",
  );
  assert.equal(spot.centroid.x, 0);
  assert.equal(spot.rmsRadius, step);
});

test("a spot far from its chief ray: its differences are inexact, and what their rounding left out is kept", () => {
  // The chief ray lands at (1024, -768), the other rays near (0.1, 0.3): a difference is near -1024 or 768, where
  // the doubles step by 2^-43, while the spot's own spread is in steps of 2^-50, a 128th of that step. Rounded, the
  // differences fall on two or three doubles and the spread is gone; the definition is of the exact differences,
  // which the estimator keeps by carrying the rest of every rounding into its centroid and its deviations.
  const x: number[] = [];
  const y: number[] = [];
  const weight: number[] = [];
  for (let ray = 0; ray < 12; ray++) {
    x.push(0.1 + ray * 2 ** -50);
    y.push(0.3 - ((ray * 5) % 12) * 2 ** -50);
    weight.push(1 + (ray % 3));
  }
  x.push(1024);
  y.push(-768);
  weight.push(0);
  // Every landing is the double written (0.1 steps by 2^-56 and 0.3 by 2^-54), and no difference is exact: added
  // back to the chief ray's landing, a rounded difference does not give the landing again.
  for (let ray = 0; ray < 12; ray++) {
    assert.notEqual(x[ray] - 1024 + 1024, x[ray], `ray ${ray}: x - 1024 is exact`);
    assert.notEqual(y[ray] + 768 - 768, y[ray], `ray ${ray}: y + 768 is exact`);
  }
  const rays = { x, y, weight, chief: 12 };
  const spot = assertDefinition(rays, "a far chief ray");
  // The centroid in two doubles, rounded once at the end: the exact centroid's nearest double, to the bit.
  const exact = exactSpot(rays);
  assert.deepEqual([spot.centroid.x, spot.centroid.y], [exact.centroid.x, exact.centroid.y]);
  // The spread is of the order of its steps, 2^-50, far below the 2^-43 the rounded differences resolve.
  assert.ok(spot.rmsRadius > 2 ** -50 && spot.rmsRadius < 2 ** -46, `${spot.rmsRadius}`);
});

// ── What is taken, and what is not ───────────────────────────────────────────────────────────────────────────────

test("the chief ray is in no sum, a ray left out has no error, and a ray of weight 0 has an error and no part", () => {
  const rays: SpotRays = {
    x: [1, 3, NaN, 5, 2],
    y: [0, 0, NaN, 4, 0],
    weight: [1, 1, 1, 0, 7],
    valid: [1, 1, 0, 1, 1],
    chief: 4,
  };
  const spot = available(estimateSpot(rays));
  // Taken: rays 0 and 1 (weight 1 each) and ray 3 (weight 0); the chief, ray 4 at (2, 0), weighs 7 and adds nothing.
  assert.deepEqual([spot.centroid.x, spot.centroid.y], [0, 0]);
  assert.equal(spot.rmsRadius, 1);
  assert.equal(spot.rays, 3);
  assert.equal(spot.flux, 2);
  assert.deepEqual([...spot.errorX], [-1, 1, NaN, 3, 0]);
  assert.deepEqual([...spot.errorY], [0, 0, NaN, 4, 0]);
});

test("what cannot be estimated is a reason, never a number", () => {
  const base = { x: [0, 1, 2], y: [0, 0, 0], weight: [0, 1, 1], chief: 0 };
  const reasonOf = (rays: SpotRays): string => {
    const outcome = estimateSpot(rays);
    return outcome.available ? "available" : `${outcome.reason}${outcome.ray === undefined ? "" : `@${outcome.ray}`}`;
  };
  assert.equal(reasonOf(base), "available");
  assert.equal(reasonOf({ ...base, valid: [0, 1, 1] }), "no-reference@0");
  assert.equal(reasonOf({ ...base, x: [NaN, 1, 2] }), "no-reference@0");
  assert.equal(reasonOf({ ...base, y: [0, Infinity, 0] }), "bad-landing@1");
  assert.equal(reasonOf({ ...base, weight: [0, -1, 1] }), "bad-weight@1");
  assert.equal(reasonOf({ ...base, weight: [0, NaN, 1] }), "bad-weight@1");
  assert.equal(reasonOf({ ...base, valid: [1, 0, 0] }), "no-rays");
  assert.equal(reasonOf({ ...base, weight: [5, 0, 0] }), "no-flux");
  // A ray that is left out may be anything: its landing and weight are not read.
  assert.equal(reasonOf({ ...base, x: [0, NaN, 2], weight: [0, NaN, 1], valid: [1, 0, 1] }), "available");
  assert.equal(reasonOf({ ...base, x: [0, 1e308, -1e308], y: [0, 1e308, -1e308] }), "out-of-range");
  assert.throws(() => estimateSpot({ ...base, y: [0, 0] }), RangeError);
  assert.throws(() => estimateSpot({ ...base, chief: 3 }), RangeError);
  assert.throws(() => estimateSpot({ ...base, chief: 0.5 }), RangeError);
});

test("equal input gives equal bits, and the order of the other rays changes a figure by roundings only", () => {
  const rays = spotOf((px, py) => [0.013 * (2 * px * py) + 0.002 * px, 0.013 * (px * px + 3 * py * py)]);
  const first = available(estimateSpot(rays));
  const again = available(estimateSpot(rays));
  assert.deepEqual(again, first);
  // Reversed, chief kept last: the compensated sums are within a rounding of the exact ones either way.
  const order = [...PUPIL.keys()].reverse();
  const reversed = available(
    estimateSpot({
      x: [...order.map((ray) => rays.x[ray]), CHIEF.x],
      y: [...order.map((ray) => rays.y[ray]), CHIEF.y],
      weight: [...order.map(() => 1), 0],
      chief: PUPIL.length,
    }),
  );
  assertNear(reversed.rmsRadius, first.rmsRadius, 4 * U * first.rmsRadius, "RMS radius reversed");
  assertNear(reversed.centroid.y, first.centroid.y, 4 * U * Math.abs(first.centroid.y), "centroid reversed");
});
