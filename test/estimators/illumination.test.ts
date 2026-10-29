// The flux estimator (src/estimators/illumination.ts) against what is known without it: sums of fractions worked out
// in whole numbers, lattices whose cosines are exactly an affine map of their cells, a disc of whole cells, and the
// projected solid angle of a rectangle seen from a point, in closed form. No engine's output is used.
import assert from "node:assert/strict";
import { test } from "node:test";

import { blockFlux, cosineFlux, launchArea } from "../../src/estimators/illumination.ts";
import type { IlluminationLattice, IlluminationUnavailable } from "../../src/estimators/illumination.ts";
import { dyadicOf, nearestQuotient, plus, times } from "./support.ts";

function refused<T extends { available: boolean }>(made: T | IlluminationUnavailable): IlluminationUnavailable {
  assert.equal(made.available, false, JSON.stringify(made));
  return made as IlluminationUnavailable;
}

function taken<T extends { available: boolean }>(made: T | IlluminationUnavailable): T {
  assert.equal(made.available, true, JSON.stringify(made));
  return made as T;
}

/** The double nearest an exact fraction. */
function nearest(value: ReturnType<typeof dyadicOf>): number {
  return nearestQuotient(value, { numerator: 1n, shift: 0 });
}

// ── The flux of a block ──────────────────────────────────────────────────────────────────────────────────────────

test("the flux of a block is the sum of the weights of its rays taken, worked out in whole numbers", () => {
  const weights = Float64Array.of(0.1, 0.7, 0.3, 1 / 3, 2.5, 0.2);
  const valid = Uint8Array.of(1, 0, 1, 1, 1, 0);
  const made = taken(blockFlux(weights, valid, 1, 5));
  assert.equal(made.rays, 3);
  assert.equal(made.flux, nearest(plus(dyadicOf(0.3), dyadicOf(1 / 3), dyadicOf(2.5))));
  // A block of no ray taken has no flux to say, and a block whose rays are all stopped transmits 0: a value.
  assert.equal(refused(blockFlux(weights, valid, 5, 6)).reason, "no-rays");
  assert.deepEqual(blockFlux(Float64Array.of(0, 0), Uint8Array.of(1, 1), 0, 2), { available: true, rays: 2, flux: 0 });
});

test("the flux is carried in two doubles: weights far below the first are not lost to its rounding", () => {
  // 1 and then 1023 weights of 2^-60: added plainly, each is lost to the rounding of 1; their sum, 1023 * 2^-60, is
  // just under 2^-50, which a double beside 1 holds to the nearest 2^-52.
  const weights = new Float64Array(1024).fill(2 ** -60);
  weights[0] = 1;
  const made = taken(blockFlux(weights, new Uint8Array(1024).fill(1), 0, 1024));
  const exact = plus(dyadicOf(1), times(dyadicOf(1023), dyadicOf(2 ** -60)));
  assert.equal(made.flux, nearest(exact));
  assert.equal(made.flux, 1 + 2 ** -50);
  let plain = 0;
  for (const weight of weights) plain += weight;
  assert.equal(plain, 1, "the plain sum loses every small weight: the test tells the two apart");
});

test("a weight that is no number of at least 0 is refused, with its ray; a ray left out is never read", () => {
  for (const bad of [Number.NaN, -0.5, Infinity]) {
    const made = refused(blockFlux(Float64Array.of(1, bad, 1), Uint8Array.of(1, 1, 1), 0, 3));
    assert.deepEqual([made.reason, made.ray], ["bad-weight", 1]);
  }
  assert.equal(taken(blockFlux(Float64Array.of(1, Number.NaN, 1), Uint8Array.of(1, 0, 1), 0, 3)).flux, 2);
});

// ── The area on the launch plane ─────────────────────────────────────────────────────────────────────────────────

test("the launch area is the cells taken times the square of the step, rounded once, in whole numbers", () => {
  // Steps whose square is no double: the area is the nearest double to the exact product, which a plain product of
  // the cells and the rounded square misses for some of them.
  const valid = new Uint8Array(12 * 10);
  let cells = 0;
  for (let ray = 0; ray < valid.length; ray++) {
    if (ray % 7 === 3) continue;
    valid[ray] = 1;
    cells++;
  }
  let missed = 0;
  for (const step of [0.1, 0.3, 1 / 3, 0.7, 1.1, 0.123456789, 2 / 7, 0.05]) {
    const made = taken(launchArea({ columns: 12, rows: 10, step, valid }));
    assert.equal(made.cells, cells);
    const exact = times(dyadicOf(cells), times(dyadicOf(step), dyadicOf(step)));
    assert.equal(made.areaMm2, nearest(exact), `step ${step}`);
    if (cells * (step * step) !== made.areaMm2) missed++;
  }
  assert.ok(missed > 0, "a plain product misses some of these steps: the test tells the two apart");
  assert.equal(refused(launchArea({ columns: 2, rows: 2, step: 1, valid: new Uint8Array(4) })).reason, "no-rays");
});

test("only the cells of the lattice count: a ray after them, the chief ray of a set, is no cell", () => {
  const valid = Uint8Array.of(1, 1, 0, 1, 1);
  assert.equal(taken(launchArea({ columns: 2, rows: 2, step: 0.5, valid })).cells, 3);
});

// ── The flux into the image ──────────────────────────────────────────────────────────────────────────────────────

/**
 * A unit direction whose x and y are `x` and `y` exactly and whose length the estimator takes for exactly 1: the z
 * nearest to sqrt(1 - x^2 - y^2), stepped by units in its last place until the squares, added without rounding,
 * round to a double whose root is 1. Its optical cosines at an index of a power of two are then those of x and y,
 * scaled, to the bit.
 */
function unitWith(x: number, y: number): [number, number, number] {
  let z = Math.sqrt(1 - x * x - y * y);
  for (let step = 0; step < 64; step++) {
    const squares = plus(
      times(dyadicOf(x), dyadicOf(x)),
      times(dyadicOf(y), dyadicOf(y)),
      times(dyadicOf(z), dyadicOf(z)),
    );
    const length = Math.sqrt(nearest(squares));
    if (length === 1) return [x, y, z];
    z = length > 1 ? z - Number.EPSILON / 2 : z + Number.EPSILON / 2;
  }
  throw new Error(`no z makes (${x}, ${y}, z) of the length 1`);
}

/** A lattice of `columns` by `rows` cells whose cosines are `scale` times the cell's offset from `centre`, exactly. */
function affineLattice(
  columns: number,
  rows: number,
  scale: number,
  lit: (column: number, row: number) => boolean,
  weightOf: (ray: number) => number = () => 1,
): IlluminationLattice {
  const rays = columns * rows + 1;
  const direction = new Float64Array(3 * rays);
  const point = new Float64Array(3 * rays);
  const valid = new Uint8Array(rays);
  const weight = new Float64Array(rays);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const ray = row * columns + column;
      direction.set(unitWith(scale * (column - columns / 2), scale * (row - rows / 2)), 3 * ray);
      valid[ray] = lit(column, row) ? 1 : 0;
      weight[ray] = weightOf(ray);
    }
  }
  // The chief ray after the cells: of weight 0, never a cell.
  direction.set([0, 0, 1], 3 * (rays - 1));
  valid[rays - 1] = 1;
  return { columns, rows, step: 0.25, weight, valid, point, direction, imageIndex: 1 };
}

test("on cosines that are exactly an affine map of the cells, every lit cell covers the square of the map's step", () => {
  // A disc of whole cells: the flux is the number of lit cells, counted in whole numbers, times the area of one.
  const [columns, rows, scale] = [24, 20, 2 ** -7];
  const inside = (column: number, row: number) => (2 * column - 23) ** 2 + (2 * row - 19) ** 2 <= 19 ** 2;
  let count = 0;
  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++) if (inside(column, row)) count++;
  const disc = taken(cosineFlux(affineLattice(columns, rows, scale, inside)));
  assert.equal(disc.cells, count);
  assert.equal(disc.flux, count * scale * scale);
  // Weights times areas: each cell's weight a fraction, the sum of the products exact.
  const weightOf = (ray: number) => 1 / (1 + (ray % 5));
  const weighted = taken(cosineFlux(affineLattice(columns, rows, scale, inside, weightOf)));
  const terms = [];
  for (let ray = 0; ray < columns * rows; ray++) {
    if (inside(ray % columns, Math.floor(ray / columns)))
      terms.push(times(dyadicOf(weightOf(ray)), dyadicOf(scale * scale)));
  }
  assert.equal(weighted.flux, nearest(plus(...terms)));
});

test("the flux into the image is the flux in optical cosines: an index n multiplies it by n^2", () => {
  const lattice = affineLattice(16, 16, 2 ** -6, (column, row) => column > 2 && row < 13);
  const [air, two] = [taken(cosineFlux(lattice)), taken(cosineFlux({ ...lattice, imageIndex: 2 }))];
  assert.equal(two.flux, 4 * air.flux);
});

test("the products of weight and area are carried in two doubles: a cell's small share is not lost to the first", () => {
  // The first lit cell weighs 1 and the 1023 others 2^-60 each, every one covering 2^-12 of cosine space.
  const lattice = affineLattice(
    32,
    32,
    2 ** -6,
    () => true,
    (ray) => (ray === 0 ? 1 : 2 ** -60),
  );
  const made = taken(cosineFlux(lattice));
  assert.equal(made.flux, (1 + 2 ** -50) * 2 ** -12);
  assert.notEqual(made.flux, 2 ** -12, "a plain sum would give the first cell's share alone");
});

/**
 * The projected solid angle, in direction cosines, of the rectangle [0, x] x [0, y] of a plane seen from a point at
 * the distance f from it above the rectangle's corner: the integral of f^2 / (u^2 + v^2 + f^2)^2 over it, which is
 * pi times the configuration factor of a parallel element to the rectangle, in closed form. Odd in x and in y.
 */
function cornerSolidAngle(x: number, y: number, f: number): number {
  const [X, Y] = [x / f, y / f];
  const [p, q] = [Math.sqrt(1 + X * X), Math.sqrt(1 + Y * Y)];
  return ((X / p) * Math.atan(Y / p) + (Y / q) * Math.atan(X / q)) / 2;
}

/** The same of the square [-a, a]^2 seen from (0, h, f): four corner rectangles, signed. */
function squareSolidAngle(a: number, h: number, f: number): number {
  return (
    cornerSolidAngle(a, a - h, f) -
    cornerSolidAngle(-a, a - h, f) -
    cornerSolidAngle(a, -a - h, f) +
    cornerSolidAngle(-a, -a - h, f)
  );
}

/** A lattice of `cells` by `cells` over the square stop [-a, a]^2 at z = 0, every ray converging on (0, h, f). */
function convergingLattice(cells: number, a: number, h: number, f: number): IlluminationLattice {
  const rays = cells * cells;
  const step = (2 * a) / cells;
  const direction = new Float64Array(3 * rays);
  for (let row = 0; row < cells; row++) {
    for (let column = 0; column < cells; column++) {
      const [x, y] = [-a + (column + 0.5) * step, -a + (row + 0.5) * step];
      direction.set([-x, h - y, f], 3 * (row * cells + column));
    }
  }
  const ones = new Uint8Array(rays).fill(1);
  return {
    columns: cells,
    rows: cells,
    step,
    weight: new Float64Array(rays).fill(1),
    valid: ones,
    point: new Float64Array(3 * rays),
    direction,
    imageIndex: 1,
  };
}

test("an ideal stop seen from a field's image point: the relative illumination is the closed form's, to second order", () => {
  // A square stop of half-width a = 10 mm, f = 50 mm before the image plane, and the image points of the axis and of
  // fields 15, 25 and 35 mm off it. The exact relative illumination is the ratio of the projected solid angles, which
  // for a small stop tends to cos^4 of the image-side angle. A lattice of n cells across that covers the stop exactly
  // has no staircase, and its error is of second order, from two terms, each a share of the flux:
  //
  // - inside, the midpoint rule on the integrand f^2 / rho^4 of the stop's plane, whose Laplacian over itself is at
  //   most 8 / f^2 in magnitude: (h^2 / 24) (8 / f^2) = 4 a^2 / (3 f^2 n^2), with h = 2 a / n;
  // - at the rim, where the cosines of a cell beyond it are continued along a line, a central difference becomes a
  //   forward one, off by half a step times the map's second derivative: over its first, 3 (a + |y|) / f^2 at most
  //   for an image point y off the axis, so (a / n) 3 (a + |y|) / f^2 on each of the 4 n rim cells of the n^2.
  //
  // The field's error and the axis's add in the ratio, which is below 1: a bound of
  // (4 a^2 / 3 + 12 a (a + |y|) + 4 a^2 / 3 + 12 a^2) / (f^2 n^2). The error must also fall by four on each doubling
  // of the cells (by more than 3.5), the mark of second order.
  const [a, f] = [10, 50];
  for (const y of [15, 25, 35]) {
    const exact = squareSolidAngle(a, y, f) / squareSolidAngle(a, 0, f);
    const sizes = [32, 64, 128, 256];
    const errors = sizes.map((cells) => {
      const field = taken(cosineFlux(convergingLattice(cells, a, y, f))).flux;
      const axis = taken(cosineFlux(convergingLattice(cells, a, 0, f))).flux;
      return Math.abs(field / axis - exact);
    });
    sizes.forEach((cells, at) => {
      const bound = ((8 * a * a) / 3 + 12 * a * (a + y) + 12 * a * a) / (f * f * cells * cells);
      assert.ok(errors[at] <= bound, `y ${y}, ${cells} cells: ${errors[at]} against ${bound}`);
      if (at > 0) assert.ok(errors[at] < errors[at - 1] / 3.5, `y ${y}: ${errors.join(", ")}`);
    });
    // Far from cos^4 of the angle at the stop's centre at this aperture: the law is no part of the estimate.
    const cos4 = (f / Math.hypot(y, f)) ** 4;
    assert.ok(Math.abs(exact - cos4) > 1e-2, `y ${y}`);
  }
});

test("what the flux into the image cannot be of is a reason, never a number", () => {
  const lattice = affineLattice(8, 8, 2 ** -5, () => true);
  assert.equal(refused(cosineFlux({ ...lattice, imageIndex: 0 })).reason, "bad-line");
  assert.equal(refused(cosineFlux({ ...lattice, valid: new Uint8Array(65) })).reason, "no-rays");
  assert.equal(refused(cosineFlux({ ...lattice, weight: new Float64Array(65) })).reason, "no-flux");
  const direction = Float64Array.from(lattice.direction);
  direction[3 * 9] = Number.NaN;
  const bad = refused(cosineFlux({ ...lattice, direction }));
  assert.deepEqual([bad.reason, bad.ray], ["bad-ray", 9]);
  // One row of lit cells covers no area of cosine space.
  const line = affineLattice(8, 8, 2 ** -5, (_column, row) => row === 3);
  assert.equal(refused(cosineFlux(line)).reason, "degenerate-pupil");
  const weight = Float64Array.from(lattice.weight);
  weight[4] = -1;
  assert.deepEqual([refused(cosineFlux({ ...lattice, weight })).reason], ["bad-weight"]);
});
