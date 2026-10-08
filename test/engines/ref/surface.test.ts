// The reference engine's surface evaluator, against closed forms worked out here: conic sections chosen so that
// their sag is a whole or a simple number, polynomials summed exactly in whole-number arithmetic, and normals from
// the geometry of a sphere.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { AsphereTerm, SurfaceShape } from "../../../src/contract/case.ts";
import { profileOf, sag, slope, unitNormal } from "../../../src/engines/ref/surface.ts";
import type { SurfaceProfile } from "../../../src/engines/ref/surface.ts";
import { exactPolynomial, termScale, ulp } from "./support.ts";

function conic(radius: number, k = 0): SurfaceProfile {
  return profileOf({ kind: "conic", radius, conic: k });
}

function asphere(radius: number | null, k: number, terms: readonly AsphereTerm[]): SurfaceProfile {
  return profileOf({ kind: "asphere", radius, conic: k, terms });
}

/** Asserts that `actual` is within `ulps` units in the last place of `expected`. */
function near(actual: number, expected: number, ulps: number, message?: string): void {
  const allowed = ulps * ulp(expected);
  assert.ok(Math.abs(actual - expected) <= allowed, `${message ?? "value"}: ${actual} is not ${expected} ± ${allowed}`);
}

/** Asserts that two vectors agree in every component within `tolerance`. */
function nearVector(actual: readonly number[], expected: readonly number[], tolerance = 1e-15): void {
  assert.equal(actual.length, 3);
  expected.forEach((component, axis) => {
    assert.ok(Math.abs(actual[axis] - component) <= tolerance, `axis ${axis}: [${actual}] is not [${expected}]`);
  });
}

// ── exactPolynomial, the yardstick ───────────────────────────────────────────────────────────────────────────────

test("the exact polynomial of the tests is exact: whole numbers, cancellation and a tiny sum all come out right", () => {
  assert.equal(exactPolynomial([{ power: 3, coeff: 0.125 }], 2), 1);
  assert.equal(
    exactPolynomial(
      [
        { power: 2, coeff: 3 },
        { power: 1, coeff: -12 },
      ],
      4,
    ),
    0,
  );
  // 1e30 r^2 - 1e30 r^2 + 2^-60 r: a double sum would lose the small term; the exact sum is the small term.
  const terms = [
    { power: 2, coeff: 1e30 },
    { power: 1, coeff: 2 ** -60 },
    { power: 2, coeff: -1e30 },
  ];
  assert.equal(exactPolynomial(terms, 3), 3 * 2 ** -60);
  // A coefficient and a power far below a double's smallest power of two, once multiplied out.
  assert.equal(exactPolynomial([{ power: 20, coeff: 2 ** -200 }], 2 ** -40), 2 ** -1000);
  assert.equal(ulp(1), 2 ** -52);
  assert.equal(ulp(-8), 2 ** -49);
});

// ── Profiles ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("a profile holds the curvature as one division, the conic constant as stated, and the terms that add something", () => {
  assert.deepEqual(profileOf({ kind: "plane" }), { curvature: 0, conic: 0, terms: [] });
  assert.deepEqual(conic(50), { curvature: 1 / 50, conic: 0, terms: [] });
  assert.deepEqual(conic(-37.5, -0.8), { curvature: 1 / -37.5, conic: -0.8, terms: [] });

  const shape: SurfaceShape = {
    kind: "asphere",
    radius: 40,
    conic: -1,
    terms: [
      { power: 6, coeff: -3.4e-9 },
      { power: 3, coeff: 0 },
      { power: 4, coeff: 1.2e-6 },
      { power: 8, coeff: -0 },
    ],
  };
  // Sorted by power; a coefficient of 0, of either sign, is no term.
  assert.deepEqual(profileOf(shape), {
    curvature: 1 / 40,
    conic: -1,
    terms: [
      { power: 4, coeff: 1.2e-6 },
      { power: 6, coeff: -3.4e-9 },
    ],
  });
  // The shape it was made from is not changed, and not shared.
  assert.equal(shape.terms[0].power, 6);
  assert.notEqual(profileOf(shape).terms[0], shape.terms[2]);

  // A flat base has no curvature; its conic constant is kept as stated, and does nothing.
  const flat = asphere(null, -0.8, [{ power: 4, coeff: 1e-5 }]);
  assert.deepEqual(flat, { curvature: 0, conic: -0.8, terms: [{ power: 4, coeff: 1e-5 }] });
  assert.equal(sag(flat, 2), 1e-5 * 16);
});

// ── The conic part of the sag ────────────────────────────────────────────────────────────────────────────────────

test("a plane has no sag, no slope, and the axis as its normal everywhere", () => {
  const plane = profileOf({ kind: "plane" });
  for (const r of [0, 1, 12.5, 1e6]) {
    assert.equal(sag(plane, r), 0);
    assert.equal(slope(plane, r), 0);
  }
  // Compared as numbers: a zero of either sign is the same direction.
  nearVector(unitNormal(plane, 3, -4), [0, 0, 1], 0);
  nearVector(unitNormal(plane, 0, 0), [0, 0, 1], 0);
});

test("a sphere's sag is R - sqrt(R^2 - r^2): Pythagorean triples make it a whole number", () => {
  // (3, 4, 5): at r = 3 the sphere of radius 5 has dropped 5 - 4 = 1; at r = 4, 5 - 3 = 2.
  near(sag(conic(5), 3), 1, 2);
  near(sag(conic(5), 4), 2, 2);
  // (5, 12, 13) and (8, 15, 17).
  near(sag(conic(13), 5), 1, 2);
  near(sag(conic(13), 12), 8, 2);
  near(sag(conic(17), 15), 9, 2);
  // A radius below 0 puts the centre toward -z, and the surface falls away toward -z.
  near(sag(conic(-5), 3), -1, 2);
  near(sag(conic(-13), 12), -8, 2);
  // The vertex is at 0, and a zero of either sign is that.
  assert.ok(sag(conic(5), 0) === 0 && sag(conic(-5), 0) === 0);
});

test("a paraboloid's sag is r^2 / (2R) at any height", () => {
  near(sag(conic(10, -1), 4), 0.8, 2);
  near(sag(conic(10, -1), 1000), 50000, 2);
  near(sag(conic(-8, -1), 4), -1, 2);
  // The form that divides by (1 + K) has no value here; this one has.
  assert.ok(Number.isFinite(sag(conic(10, -1), 1e8)));
});

test("an ellipsoid, an oblate ellipsoid and a hyperboloid satisfy r^2 - 2Rz + (1 + K)z^2 = 0", () => {
  // K = -0.75, R = 10, r = 12: 144 - 160 + 0.25 * 64 = 0, so z = 8.
  near(sag(conic(10, -0.75), 12), 8, 2);
  // K = 3 (oblate), R = 10, r = 4: 16 - 20 + 4 * 1 = 0, so z = 1.
  near(sag(conic(10, 3), 4), 1, 2);
  // K = -2 (hyperboloid), R = 3, r = 4: 16 - 12 - 4 = 0, so z = 2: sqrt(R^2 + r^2) - R.
  near(sag(conic(3, -2), 4), 2, 2);
  near(sag(conic(-3, -2), 4), -2, 2);
  // Any height at all: the conic equation holds to rounding for a general conic.
  for (const [radius, k, r] of [
    [25.4, -0.6, 11.3],
    [-61.7, 0.35, 20.9],
    [18.2, -3.4, 30.1],
  ]) {
    const z = sag(conic(radius, k), r);
    const residual = r * r - 2 * radius * z + (1 + k) * z * z;
    assert.ok(Math.abs(residual) <= 8 * ulp(r * r + Math.abs(2 * radius * z)), `K = ${k}: residual ${residual}`);
  }
});

test("the conic part keeps its precision near the vertex, where the textbook form loses all of it", () => {
  const [radius, r] = [1e6, 1e-3];
  // To the sixteenth digit the sag here is r^2 / (2R): the next term of its series is 2.5e-19 of that.
  const expected = (r * r) / (2 * radius);
  near(sag(conic(radius), r), expected, 4);
  // R - sqrt(R^2 - r^2), the form the evaluator does not use: the two numbers it subtracts are the same double.
  assert.equal(radius - Math.sqrt(radius * radius - r * r), 0);
  near(sag(conic(-radius), r), -expected, 4);
  near(sag(conic(radius, -0.7), r), expected, 4);
});

test("at the height where a conic ends the sag is the last one it has, and beyond it there is none: NaN", () => {
  // A hemisphere: at r = R the sag is R.
  assert.equal(sag(conic(5), 5), 5);
  assert.equal(sag(conic(-5), 5), -5);
  assert.ok(Number.isNaN(sag(conic(5), 5.000001)));
  assert.ok(Number.isNaN(sag(conic(-5), 6)));
  // An ellipsoid of K = -0.75 and R = 10 ends at r = R / sqrt(1 + K) = 20, where z = R / (1 + K) = 40.
  assert.equal(sag(conic(10, -0.75), 20), 40);
  assert.ok(Number.isNaN(sag(conic(10, -0.75), 20.001)));
  // An oblate ellipsoid of K = 3 ends at r = R / 2.
  assert.equal(sag(conic(10, 3), 5), 2.5);
  assert.ok(Number.isNaN(sag(conic(10, 3), 5.001)));
  // A paraboloid and a hyperboloid go on for ever.
  assert.ok(Number.isFinite(sag(conic(5, -1), 1e9)));
  assert.ok(Number.isFinite(sag(conic(5, -2.5), 1e9)));
  // A term does not bring a sag back: the surface is not there.
  assert.ok(Number.isNaN(sag(asphere(5, 0, [{ power: 4, coeff: 1e-3 }]), 6)));
});

// ── The polynomial part ──────────────────────────────────────────────────────────────────────────────────────────

test("terms add coeff * r^power, of even and of odd power: whole-number examples on a flat base", () => {
  const flat = asphere(null, 0, [
    { power: 3, coeff: 0.125 },
    { power: 4, coeff: 0.0625 },
  ]);
  assert.equal(sag(flat, 2), 2);
  assert.equal(sag(flat, 4), 8 + 16);
  assert.equal(sag(flat, 0), 0);
  // A term of power 1 is a cone and a term of power 2 a paraboloid; the contract allows both.
  assert.equal(sag(asphere(null, 0, [{ power: 1, coeff: 0.75 }]), 4), 3);
  assert.equal(sag(asphere(null, 0, [{ power: 2, coeff: 0.5 }]), 4), 8);
  // The highest power LensVisualizer has, as an exact power of two: 2^-20 * 2^20 = 1.
  assert.equal(sag(asphere(null, 0, [{ power: 20, coeff: 2 ** -20 }]), 2), 1);
  assert.equal(sag(asphere(null, 0, [{ power: 19, coeff: 1 }]), 2), 2 ** 19);
});

test("a polynomial is summed to within rounding of its exact value, however many terms and whatever the powers", () => {
  const terms: AsphereTerm[] = [
    { power: 3, coeff: -2.117e-5 },
    { power: 4, coeff: 1.2345e-6 },
    { power: 5, coeff: 3.3e-8 },
    { power: 6, coeff: -3.4567e-9 },
    { power: 8, coeff: 2.2e-12 },
    { power: 10, coeff: -7.1e-16 },
    { power: 12, coeff: 4.4e-19 },
    { power: 14, coeff: -1.9e-22 },
    { power: 16, coeff: 3.6e-26 },
    { power: 18, coeff: -5.5e-30 },
    { power: 19, coeff: 1.1e-31 },
    { power: 20, coeff: 8.2e-34 },
  ];
  const flat = asphere(null, 0, terms);
  for (const r of [0.37, 5.06, 12.5, 16.8, 23.999]) {
    const exact = exactPolynomial(terms, r);
    // Twelve terms, each a rounded product of rounded powers: a few units of rounding of what is added up.
    const allowed = 12 * 2 ** -52 * termScale(terms, r);
    assert.ok(Math.abs(sag(flat, r) - exact) <= allowed, `r = ${r}: ${sag(flat, r)} against ${exact}`);
  }
  // Where nothing cancels, that is a few units in the last place of the sag itself.
  const positive = terms.map(({ power, coeff }) => ({ power, coeff: Math.abs(coeff) }));
  near(sag(asphere(null, 0, positive), 16.8), exactPolynomial(positive, 16.8), 12);
});

test("a conic and its terms add up: the sag is the conic's plus the exact polynomial", () => {
  const terms = [
    { power: 4, coeff: 1.2e-6 },
    { power: 6, coeff: -3.4e-9 },
    { power: 7, coeff: 2.5e-11 },
  ];
  // The (5, 12, 13) sphere at r = 12: the conic part is 8, to rounding.
  const surface = asphere(13, 0, terms);
  const expected = 8 + exactPolynomial(terms, 12);
  assert.ok(Math.abs(sag(surface, 12) - expected) <= 4 * ulp(8));
  // The paraboloid of R = 10 at r = 4, with the same terms.
  const paraboloid = asphere(10, -1, terms);
  assert.ok(Math.abs(sag(paraboloid, 4) - (0.8 + exactPolynomial(terms, 4))) <= 4 * ulp(0.8));
});

// ── Slope ────────────────────────────────────────────────────────────────────────────────────────────────────────

test("a sphere's slope is r / sqrt(R^2 - r^2), a paraboloid's r / R, and a term's n a r^(n - 1)", () => {
  near(slope(conic(5), 3), 0.75, 2);
  near(slope(conic(5), 4), 4 / 3, 2);
  near(slope(conic(-5), 3), -0.75, 2);
  near(slope(conic(13), 12), 12 / 5, 4);
  near(slope(conic(10, -1), 4), 0.4, 2);
  // K = -0.75, R = 10, r = 12: dz/dr = r / (R - (1 + K) z) = 12 / (10 - 2) = 1.5.
  near(slope(conic(10, -0.75), 12), 1.5, 2);
  // K = -2, R = 3, r = 4: 4 / (3 + 2) = 0.8.
  near(slope(conic(3, -2), 4), 0.8, 2);
  assert.equal(slope(conic(5), 0), 0);

  const flat = asphere(null, 0, [
    { power: 3, coeff: 0.125 },
    { power: 4, coeff: 0.0625 },
  ]);
  // 3 * 0.125 * 4 + 4 * 0.0625 * 8 = 1.5 + 2.
  assert.equal(slope(flat, 2), 3.5);
  assert.equal(slope(asphere(null, 0, [{ power: 1, coeff: 0.75 }]), 0), 0.75);
  assert.equal(slope(asphere(null, 0, [{ power: 2, coeff: 0.5 }]), 4), 4);
  // Conic and terms add: 0.75 from the sphere and 4 * 0.001 * 27 from the term.
  near(slope(asphere(5, 0, [{ power: 4, coeff: 0.001 }]), 3), 0.75 + 0.108, 2);
});

test("the slope is the derivative of the sag: a fourth-order difference of the sag agrees to nine digits", () => {
  const surfaces: SurfaceProfile[] = [
    conic(31.7, -0.42),
    conic(-58.3, 1.7),
    asphere(44.1, -1.3, [
      { power: 4, coeff: 3.1e-6 },
      { power: 6, coeff: -8.2e-9 },
      { power: 8, coeff: 1.4e-11 },
    ]),
    asphere(-27.9, 0, [
      { power: 3, coeff: -4.4e-5 },
      { power: 5, coeff: 6.6e-8 },
      { power: 10, coeff: 2.2e-14 },
    ]),
    asphere(null, 0, [
      { power: 2, coeff: 1.5e-2 },
      { power: 3, coeff: 2e-5 },
      { power: 4, coeff: -1e-6 },
    ]),
  ];
  for (const [at, surface] of surfaces.entries()) {
    for (const r of [0.5, 4, 9.25, 14]) {
      const h = 1e-3 * r;
      // The five-point stencil: its error is of the order h^4, far below the rounding of the differences.
      const difference =
        (sag(surface, r - 2 * h) - 8 * sag(surface, r - h) + 8 * sag(surface, r + h) - sag(surface, r + 2 * h)) /
        (12 * h);
      const analytic = slope(surface, r);
      assert.ok(
        Math.abs(analytic - difference) <= 1e-9 * Math.max(1, Math.abs(analytic)),
        `surface ${at} at r = ${r}: slope ${analytic}, difference ${difference}`,
      );
    }
  }
});

test("the slope is infinite where a conic ends and NaN beyond", () => {
  assert.equal(slope(conic(5), 5), Infinity);
  assert.equal(slope(conic(-5), 5), -Infinity);
  assert.ok(Number.isNaN(slope(conic(5), 5.5)));
  assert.equal(slope(conic(10, -0.75), 20), Infinity);
  assert.ok(Number.isFinite(slope(conic(5, -1), 1e9)));
});

// ── Unit normal ──────────────────────────────────────────────────────────────────────────────────────────────────

test("a sphere's normal points along the line to its centre, turned toward +z", () => {
  // R = 5, centre at (0, 0, 5). At (3, 0) the surface is at z = 1: (centre - point) / R = (-0.6, 0, 0.8).
  nearVector(unitNormal(conic(5), 3, 0), [-0.6, 0, 0.8]);
  nearVector(unitNormal(conic(5), 0, 4), [0, -0.8, 0.6]);
  nearVector(unitNormal(conic(5), -3, 0), [0.6, 0, 0.8]);
  // R = -5, centre at (0, 0, -5). At (3, 0) the surface is at z = -1: (point - centre) / 5 = (0.6, 0, 0.8).
  nearVector(unitNormal(conic(-5), 3, 0), [0.6, 0, 0.8]);
  // Off both axes: the point (1.8, 2.4) is at r = 3.
  nearVector(unitNormal(conic(5), 1.8, 2.4), [-0.36, -0.48, 0.8]);
  assert.deepEqual(unitNormal(conic(5), 0, 0), [0, 0, 1]);
  assert.deepEqual(unitNormal(conic(-5), 0, 0), [0, 0, 1]);
});

test("a normal has length 1, is perpendicular to the surface, and lies in the plane of the axis and the point", () => {
  const surface = asphere(44.1, -1.3, [
    { power: 3, coeff: -4.4e-5 },
    { power: 4, coeff: 3.1e-6 },
    { power: 6, coeff: -8.2e-9 },
  ]);
  for (const [x, y] of [
    [2, 0],
    [0, -7.5],
    [6, 8],
    [-9.1, 3.3],
  ]) {
    const [nx, ny, nz] = unitNormal(surface, x, y);
    const r = Math.sqrt(x * x + y * y);
    assert.ok(Math.abs(nx * nx + ny * ny + nz * nz - 1) <= 4e-16, `length at (${x}, ${y})`);
    assert.ok(nz > 0);
    // The tangent along the radius is (x/r, y/r, slope); the one around the axis is (-y, x, 0).
    const radial = (nx * x) / r + (ny * y) / r + nz * slope(surface, r);
    assert.ok(Math.abs(radial) <= 4e-16, `radial tangent at (${x}, ${y}): ${radial}`);
    assert.ok(Math.abs(-nx * y + ny * x) <= 4e-16 * r, `tangent around the axis at (${x}, ${y})`);
  }
});

test("the normal stays finite where the slope is infinite: at the rim of a hemisphere it lies in the rim's plane", () => {
  nearVector(unitNormal(conic(5), 5, 0), [-1, 0, 0]);
  nearVector(unitNormal(conic(5), 0, -5), [0, 1, 0]);
  nearVector(unitNormal(conic(-5), 3, 4), [0.6, 0.8, 0]);
  // Beyond the rim there is no surface, and no normal.
  for (const component of unitNormal(conic(5), 5.5, 0)) assert.ok(Number.isNaN(component));
});

test("a cone has the normal of its side everywhere but at its apex, where it has none", () => {
  // z = 0.75 r: the side makes the 3-4-5 triangle with the axis.
  const cone = asphere(null, 0, [{ power: 1, coeff: 0.75 }]);
  nearVector(unitNormal(cone, 2, 0), [-0.6, 0, 0.8]);
  nearVector(unitNormal(cone, 0, -11), [0, 0.6, 0.8]);
  for (const component of unitNormal(cone, 0, 0)) assert.ok(Number.isNaN(component));
  // Every other surface is smooth on the axis.
  assert.deepEqual(unitNormal(asphere(null, 0, [{ power: 3, coeff: 1e-3 }]), 0, 0), [0, 0, 1]);
  assert.deepEqual(unitNormal(asphere(20, -1, [{ power: 2, coeff: 0.5 }]), 0, 0), [0, 0, 1]);
});
