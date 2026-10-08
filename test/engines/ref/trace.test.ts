// The reference engine's ray tracer, against optics worked out here: closed forms of textbook systems, each derived
// in the test from geometry and Snell's law in angles, never from the tracer's own vector arithmetic. A tracer that
// is to say whose rounding a difference of 1e-9 mm is must itself be right to rounding, and these are the proof.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { AsphereTerm, OpticalCase, SurfaceShape } from "../../../src/contract/case.ts";
import type { Vec3 } from "../../../src/estimators/imageProjection.ts";
import { buildRefSystem } from "../../../src/engines/ref/model.ts";
import { firstOrder, vertexCurvature } from "../../../src/engines/ref/paraxial.ts";
import { refract } from "../../../src/engines/ref/refract.ts";
import { traceSurfaces } from "../../../src/engines/ref/trace.ts";
import type { SurfaceTrace } from "../../../src/engines/ref/trace.ts";
import { DOUBLE_GAUSS } from "../../core/support.ts";
import { caseOf, exactPolynomial, sphere, ulp } from "./support.ts";
import type { SurfaceOf, SystemOf } from "./support.ts";

/** Traces one ray through a case at its first line. */
function trace(opticalCase: OpticalCase, origin: Vec3, direction: Vec3, line = 0): SurfaceTrace {
  const system = buildRefSystem(opticalCase);
  return traceSurfaces(system, system.indexAfter[line], origin, direction);
}

/** A case of the given surfaces with wide apertures unless a surface states its own. */
function systemOf(surfaces: readonly SurfaceOf[], more: SystemOf = {}): OpticalCase {
  return caseOf(
    surfaces.map((surface) => ({ semiDiameter: 1e3, ...surface })),
    more,
  );
}

function unit(x: number, y: number, z: number): Vec3 {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

/** Asserts that `actual` is within `allowed` of `expected`. */
function near(actual: number, expected: number, allowed: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= allowed, `${message}: ${actual} is not ${expected} ± ${allowed}`);
}

function nearPoint(actual: Vec3, expected: Vec3, allowed: number, message: string): void {
  for (let axis = 0; axis < 3; axis++) near(actual[axis], expected[axis], allowed, `${message}, axis ${axis}`);
}

/** The distance of a point from the line through `point` along the unit vector `direction`. */
function distanceFromLine(target: Vec3, point: Vec3, direction: Vec3): number {
  const to: Vec3 = [target[0] - point[0], target[1] - point[1], target[2] - point[2]];
  const along = to[0] * direction[0] + to[1] * direction[1] + to[2] * direction[2];
  return Math.hypot(to[0] - along * direction[0], to[1] - along * direction[1], to[2] - along * direction[2]);
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

// ── A plane-parallel plate ───────────────────────────────────────────────────────────────────────────────────────

test("a plate displaces a ray sideways by d sin i (1 - cos i / sqrt(n^2 - sin^2 i)) and leaves its direction", () => {
  const [n, d] = [1.5168, 7.25];
  const plate = systemOf([
    { z: 0, shape: sphere(Infinity), index: n },
    { z: d, shape: sphere(Infinity), index: 1 },
  ]);
  for (const degrees of [0, 0.01, 5, 30, 60, 85]) {
    const i = (degrees * Math.PI) / 180;
    // In the plate the ray makes the angle t with the axis, by Snell's law.
    const t = Math.asin(Math.sin(i) / n);
    const origin: Vec3 = [0, 2, -10];
    const direction: Vec3 = [0, Math.sin(i), Math.cos(i)];
    const traced = trace(plate, origin, direction);
    assert.equal(traced.status, "ok", `${degrees} degrees`);
    assert.equal(traced.endSurface, 2);
    const allowed = 4 * ulp(20 * Math.max(1, Math.tan(i)));

    const y1 = 2 + 10 * Math.tan(i);
    nearPoint(traced.hits[0], [0, y1, 0], allowed, `first face at ${degrees} degrees`);
    nearPoint(traced.hits[1], [0, y1 + d * Math.tan(t), d], allowed, `second face at ${degrees} degrees`);
    // A plane is met where it is: its z is the vertex's, to the last bit.
    assert.deepEqual([traced.hits[0][2], traced.hits[1][2]], [0, d]);
    // Behind the plate the ray is parallel to itself, displaced across its direction.
    nearPoint(traced.direction, direction, 2 ** -52, `direction at ${degrees} degrees`);
    const displacement = d * Math.sin(i) * (1 - Math.cos(i) / Math.sqrt(n * n - Math.sin(i) ** 2));
    const undeviated: Vec3 = [0, y1 + d * Math.tan(i), d];
    near(
      (undeviated[1] - traced.hits[1][1]) * Math.cos(i),
      displacement,
      allowed,
      `lateral displacement at ${degrees} degrees`,
    );
    // The path: 10 / cos i in air, and n d / cos t in the glass.
    const path = 10 / Math.cos(i) + (n * d) / Math.cos(t);
    near(traced.opticalPath, path, 4 * ulp(path), `optical path at ${degrees} degrees`);
  }
});

test("two media of one index bend nothing: the direction comes through bit for bit, of any length it was given with", () => {
  const air = systemOf([
    { z: 0, shape: sphere(40), index: 1 },
    { z: 3, shape: sphere(-25), index: 1 },
  ]);
  // A direction a hair off unit length, as the contract admits one: it is traced as given and comes back as given.
  const direction: Vec3 = [0.1 * (1 + 2e-13), 0.2 * (1 + 2e-13), Math.sqrt(1 - 0.05) * (1 + 2e-13)];
  const traced = trace(air, [0.5, -1, -4], direction);
  assert.equal(traced.status, "ok");
  assert.deepEqual(traced.direction, direction);
  // The hits lie on the line the ray was given by, and the path is the distance along it in air.
  for (const hit of traced.hits) assert.ok(distanceFromLine(hit, [0.5, -1, -4], unit(...direction)) <= 4 * ulp(8));
  near(traced.opticalPath, distance(traced.hits[1], [0.5, -1, -4]), 4 * ulp(8), "path in air");
});

// ── One spherical surface ────────────────────────────────────────────────────────────────────────────────────────

test("refraction at a sphere, by hand: the 3-4-5 triangle gives the hit, the normal and both angles", () => {
  // R = 5, centre at z = 5. A ray along the axis at the height 3 meets the sphere at z = 1: 3^2 + 4^2 = 5^2.
  // The normal there makes the angle i with the axis, sin i = 3/5: the angle of incidence.
  const n = 1.5;
  const surface = systemOf([{ z: 0, shape: sphere(5), index: n }]);
  const traced = trace(surface, [0, 3, -10], [0, 0, 1]);
  assert.equal(traced.status, "ok");
  nearPoint(traced.hits[0], [0, 3, 1], 2 * ulp(3), "hit");
  near(traced.opticalPath, 11, 2 * ulp(11), "path");

  // sin t = sin i / n = 0.4. The ray is turned toward the axis by i - t.
  const [sinI, cosI, sinT, cosT] = [0.6, 0.8, 0.4, Math.sqrt(0.84)];
  const turnSin = sinI * cosT - cosI * sinT;
  const turnCos = cosI * cosT + sinI * sinT;
  nearPoint(traced.direction, [0, -turnSin, turnCos], 2 ** -52, "refracted direction");
  // It crosses the axis 3 / tan(i - t) behind the hit.
  const crossing = 1 + (3 * turnCos) / turnSin;
  const [, y, z] = traced.hits[0];
  near(z - (y * traced.direction[2]) / traced.direction[1], crossing, 8 * ulp(crossing), "axis crossing");

  // The same surface seen from the glass: a ray in glass along the axis leaves it, bent away from the axis.
  // sin t = n sin i = 0.9 for the concave side of a sphere of R = -5 at the height 3.
  const leaving = systemOf([
    { z: 0, shape: sphere(Infinity), index: n },
    { z: 10, shape: sphere(-5), index: 1 },
  ]);
  const out = trace(leaving, [0, 3, -10], [0, 0, 1]);
  assert.equal(out.status, "ok");
  nearPoint(out.hits[1], [0, 3, 9], 2 * ulp(9), "hit on the concave side");
  const [outSin, outCos] = [0.9, Math.sqrt(0.19)];
  // The normal is tilted toward +y by i; the ray leaves at t from it, on the side of the axis: turned by t - i.
  nearPoint(out.direction, [0, -(outSin * 0.8 - outCos * 0.6), outCos * 0.8 + outSin * 0.6], 2 ** -52, "leaving ray");
  near(out.opticalPath, 10 + n * 9, 2 * ulp(24), "path through the glass");
});

// ── The aplanatic points of a sphere ─────────────────────────────────────────────────────────────────────────────

test("a beam aimed at the outer aplanatic point of a sphere meets at the inner one, for every aperture angle", () => {
  // A sphere of radius R and index n in air has two points on a line through its centre C, at R n and R / n from
  // C, for which it is free of aberration to every order: a beam converging on the outer one is refracted to the
  // inner one. The sphere is the set of points whose distances to the two are in the ratio n (Apollonius).
  for (const [n, radius] of [
    [1.5, 10],
    [1.7234, 4.2],
    [2.4, 25],
  ]) {
    const centre = radius;
    const outer: Vec3 = [0, 0, centre + radius * n];
    const inner: Vec3 = [0, 0, centre + radius / n];
    const ball = systemOf([{ z: 0, shape: sphere(radius), index: n }]);
    let rays = 0;
    // Rays from all over the front of the sphere, in and out of the meridional plane, all aimed at the outer point.
    for (const height of [0.05, 0.3, 0.6, 0.9, 0.97]) {
      for (const azimuth of [0, 0.7, 2.1, 4.4]) {
        const from: Vec3 = [radius * height * Math.cos(azimuth), radius * height * Math.sin(azimuth), -3];
        const direction = unit(outer[0] - from[0], outer[1] - from[1], outer[2] - from[2]);
        const traced = trace(ball, from, direction);
        assert.equal(traced.status, "ok", `n ${n}, height ${height}`);
        const [hit] = traced.hits;
        // The hit is a point of the sphere, and so n times as far from the outer point as from the inner one.
        near(distance(hit, [0, 0, centre]), radius, 4 * ulp(radius), "on the sphere");
        near(distance(hit, outer) / distance(hit, inner), n, 8 * ulp(n), `Apollonius at ${height}`);
        // The refracted ray passes through the inner point: not near it, through it.
        const miss = distanceFromLine(inner, hit, traced.direction);
        assert.ok(miss <= 8 * ulp(radius), `n ${n}, height ${height}, azimuth ${azimuth}: misses by ${miss} mm`);
        // The sine condition, exactly: the sines of the angles the ray makes with the axis are in the ratio n.
        const sinBefore = Math.hypot(direction[0], direction[1]);
        const sinAfter = Math.hypot(traced.direction[0], traced.direction[1]);
        near(sinAfter / sinBefore, n, 16 * ulp(n), `sine condition at ${height}`);
        rays++;
      }
    }
    assert.equal(rays, 20);
  }
});

// ── Cartesian surfaces ───────────────────────────────────────────────────────────────────────────────────────────

test("an ellipsoid of eccentricity 1/n brings a collimated beam to one point in the glass, by equal paths", () => {
  // Air to glass: the conic with K = -1/n^2 and the vertex radius R focuses every ray that is parallel to the
  // axis at its far focus, R n / (n - 1) behind the vertex, and the optical path to it is the same for all.
  for (const [n, radius] of [
    [1.5, 20],
    [1.8052, 7.5],
  ]) {
    const ellipsoid: SurfaceShape = { kind: "conic", radius, conic: -1 / (n * n) };
    const lens = systemOf([{ z: 0, shape: ellipsoid, index: n }]);
    const focus: Vec3 = [0, 0, (radius * n) / (n - 1)];
    const axial = 10 + n * focus[2];
    // The ellipsoid ends at the height R / sqrt(1 + K): rays out to nine tenths of it.
    const end = radius / Math.sqrt(1 - 1 / (n * n));
    for (const fraction of [0, 0.01, 0.25, 0.5, 0.75, 0.9]) {
      for (const azimuth of [0.3, 2.9]) {
        const h = fraction * end;
        const traced = trace(lens, [h * Math.cos(azimuth), h * Math.sin(azimuth), -10], [0, 0, 1]);
        assert.equal(traced.status, "ok");
        const [hit] = traced.hits;
        const miss = distanceFromLine(focus, hit, traced.direction);
        assert.ok(miss <= 16 * ulp(focus[2]), `n ${n}, ${fraction} of the aperture: misses the focus by ${miss} mm`);
        const path = traced.opticalPath + n * distance(hit, focus);
        near(path, axial, 8 * ulp(axial), `optical path at ${fraction} of the aperture`);
      }
    }
  }
});

test("a hyperboloid of eccentricity n brings a collimated beam in glass to one point in air, by equal paths", () => {
  // Glass to air: the conic with K = -n^2. A plane front face passes the beam unbent; the rear face, convex
  // toward the image, focuses it R / (n - 1) behind its vertex. The surface is one sheet of a hyperboloid of two:
  // a tracer that took the root of the other sheet would be metres off.
  for (const [n, radius, thickness] of [
    [1.5, 30, 6],
    [1.92286, 12, 3.5],
  ]) {
    const hyperboloid: SurfaceShape = { kind: "conic", radius: -radius, conic: -n * n };
    const lens = systemOf([
      { z: 0, shape: sphere(Infinity), index: n },
      { z: thickness, shape: hyperboloid, index: 1 },
    ]);
    const focus: Vec3 = [0, 0, thickness + radius / (n - 1)];
    const axial = 5 + n * thickness + radius / (n - 1);
    for (const h of [0, 0.02, 0.4, 1.1, 2.3].map((fraction) => fraction * radius)) {
      const traced = trace(lens, [h * Math.cos(1.1), h * Math.sin(1.1), -5], [0, 0, 1]);
      assert.equal(traced.status, "ok");
      const hit = traced.hits[1];
      // The rear face falls away toward the object: its sag is negative, and it is the near sheet.
      assert.ok(hit[2] <= thickness && hit[2] > thickness - 3 * radius, `sheet at h = ${h}: z = ${hit[2]}`);
      const miss = distanceFromLine(focus, hit, traced.direction);
      assert.ok(miss <= 32 * ulp(focus[2]), `n ${n}, h ${h}: misses the focus by ${miss} mm`);
      near(traced.opticalPath + distance(hit, focus), axial, 16 * ulp(axial), `optical path at h = ${h}`);
    }
  }
});

test("a paraboloid's intersection is a single root: a ray along the axis meets it at h^2 / (2 R)", () => {
  // K = -1: the quadratic of the intersection has no square term for a ray parallel to the axis.
  const paraboloid = systemOf([{ z: 0, shape: { kind: "conic", radius: 16, conic: -1 }, index: 1.5 }]);
  for (const h of [0, 1, 4, 24, 1000]) {
    const traced = trace(paraboloid, [h, 0, -50], [0, 0, 1]);
    assert.equal(traced.status, "ok");
    nearPoint(traced.hits[0], [h, 0, (h * h) / 32], 2 * ulp((h * h) / 32), `h = ${h}`);
    near(traced.opticalPath, 50 + (h * h) / 32, 2 * ulp(50 + (h * h) / 32), `path at h = ${h}`);
  }
});

// ── The paraxial limit ───────────────────────────────────────────────────────────────────────────────────────────

test("close to the axis the tracer is the paraxial kernel: the focus and the focal length, to second order", () => {
  const cases: OpticalCase[] = [
    DOUBLE_GAUSS,
    caseOf(
      [
        { z: 0, shape: { kind: "asphere", radius: 28, conic: -0.6, terms: [{ power: 4, coeff: 2e-6 }] }, index: 1.62 },
        { z: 4, shape: sphere(-90), index: 1.75 },
        { z: 5.5, shape: sphere(140), index: 1 },
      ],
      { stopIndex: 1 },
    ),
  ];
  for (const opticalCase of cases) {
    const system = buildRefSystem(opticalCase);
    const kernel = firstOrder({
      surfaces: system.surfaces.map((surface, index) => ({
        z: surface.z,
        curvature: vertexCurvature(surface.profile) as number,
        indexAfter: system.indexAfter[0][index],
      })),
      stopIndex: system.stopIndex,
      stopSemiDiameter: system.stopSemiDiameter,
      lastLensSurfaceIndex: system.lastLensSurfaceIndex,
      objectZ: null,
    });
    assert.ok(kernel !== null);
    const { efl, rearFocalZ } = kernel.values;

    /** Where a ray along the axis at the height h crosses the axis, and the focal length its slope gives. */
    const real = (h: number): { focus: number; efl: number } => {
      const traced = trace(opticalCase, [0, h, -20], [0, 0, 1]);
      assert.equal(traced.status, "ok");
      const [, y, z] = traced.hits[traced.hits.length - 1];
      const slope = traced.direction[1] / traced.direction[2];
      return { focus: z - y / slope, efl: -h / slope };
    };
    // Spherical aberration is of the second order in the height: halving the height quarters what is left.
    const [coarse, fine] = [real(0.2), real(0.1)];
    const [focusCoarse, focusFine] = [coarse.focus - rearFocalZ, fine.focus - rearFocalZ];
    assert.ok(Math.abs(focusFine) < 1e-3 && Math.abs(focusFine) > 1e-9, `longitudinal aberration ${focusFine} mm`);
    near(focusCoarse / focusFine, 4, 0.01, "the focus converges as h^2");
    near((coarse.efl - efl) / (fine.efl - efl), 4, 0.01, "the focal length converges as h^2");
    // And in the limit they are the kernel's: at a height of a micrometre, to the ninth digit.
    const limit = real(1e-3);
    near(limit.focus, rearFocalZ, 1e-8 * Math.abs(efl), "the paraxial focus");
    near(limit.efl, efl, 1e-8 * Math.abs(efl), "the focal length");
  }
});

// ── Aspheres ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** The contract's sag, written out here with the polynomial summed exactly: the code of no engine. */
function sagOf(shape: Exclude<SurfaceShape, { kind: "plane" }>, r: number): number {
  const c = shape.radius === null ? 0 : 1 / shape.radius;
  const terms: readonly AsphereTerm[] = shape.kind === "asphere" ? shape.terms : [];
  const conicPart = c === 0 ? 0 : (c * r * r) / (1 + Math.sqrt(1 - (1 + shape.conic) * c * c * r * r));
  return conicPart + (terms.length === 0 ? 0 : exactPolynomial(terms, r));
}

/** Where a line crosses a sag, by halving a bracket until its ends are neighbouring doubles. */
function bisected(shape: Exclude<SurfaceShape, { kind: "plane" }>, origin: Vec3, direction: Vec3): number {
  const above = (t: number): number => {
    const [x, y, z] = [origin[0] + t * direction[0], origin[1] + t * direction[1], origin[2] + t * direction[2]];
    return z - sagOf(shape, Math.hypot(x, y));
  };
  let [low, high] = [(-3 - origin[2]) / direction[2], (3 - origin[2]) / direction[2]];
  assert.ok(above(low) < 0 && above(high) > 0, "the bracket holds the crossing");
  for (;;) {
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) return Math.abs(above(low)) <= Math.abs(above(high)) ? low : high;
    if (above(middle) < 0) low = middle;
    else high = middle;
  }
}

const ASPHERES: readonly Exclude<SurfaceShape, { kind: "plane" }>[] = [
  // Even terms on a conic, as most camera aspheres are.
  {
    kind: "asphere",
    radius: 22.5,
    conic: -0.8,
    terms: [
      { power: 4, coeff: 1.7e-5 },
      { power: 6, coeff: -4.1e-8 },
      { power: 8, coeff: 3.3e-11 },
      { power: 10, coeff: -2.9e-14 },
    ],
  },
  // Odd terms too, on a base that curves the other way.
  {
    kind: "asphere",
    radius: -31.4,
    conic: 1.6,
    terms: [
      { power: 3, coeff: -6.2e-5 },
      { power: 4, coeff: 9.1e-6 },
      { power: 5, coeff: 1.8e-7 },
      { power: 7, coeff: -2.2e-10 },
    ],
  },
  // A flat base: the polynomial is the whole surface.
  {
    kind: "asphere",
    radius: null,
    conic: 0,
    terms: [
      { power: 2, coeff: 1.1e-2 },
      { power: 4, coeff: -3.5e-5 },
      { power: 6, coeff: 6.0e-8 },
    ],
  },
  // Terms that cancel: 3e-4 r^4 (1 - r^2 / 100)^2, each term an order and more above their sum toward the rim.
  {
    kind: "asphere",
    radius: 18,
    conic: 0,
    terms: [
      { power: 4, coeff: 3.0e-4 },
      { power: 6, coeff: -6.0e-6 },
      { power: 8, coeff: 3.0000001e-8 },
    ],
  },
];

test("an asphere is met where a bisection of the contract's own sag puts the crossing, to a few units of rounding", () => {
  let rays = 0;
  for (const [at, shape] of ASPHERES.entries()) {
    const lens = systemOf([{ z: 0, shape, index: 1.6 }]);
    for (const [x, y] of [
      [0, 0],
      [1.5, 0],
      [-4, 3],
      [2.5, -7.5],
      [6, 6.5],
    ]) {
      for (const direction of [unit(0, 0, 1), unit(0.1, -0.2, 1), unit(-0.35, 0.3, 1)]) {
        const origin: Vec3 = [x - 12 * direction[0], y - 12 * direction[1], -12 * direction[2]];
        const traced = trace(lens, origin, direction);
        assert.equal(traced.status, "ok", `asphere ${at}`);
        const [hit] = traced.hits;
        const t = bisected(shape, origin, direction);
        const expected: Vec3 = [
          origin[0] + t * direction[0],
          origin[1] + t * direction[1],
          origin[2] + t * direction[2],
        ];
        // The bisection knows the crossing to one rounding of the sag's own evaluation: a few units in the last
        // place of the ray's parameter.
        nearPoint(hit, expected, 8 * ulp(12), `asphere ${at} from (${x}, ${y})`);
        // And the hit lies on the surface: its z is the sag at its own height.
        near(hit[2], sagOf(shape, Math.hypot(hit[0], hit[1])), 8 * ulp(Math.max(1, Math.abs(hit[2]))), "on the sag");
        rays++;
      }
    }
  }
  assert.equal(rays, 60);
});

test("a polynomial that diverges beyond the rim loses no ray: one that crosses the clear aperture is met in it", () => {
  // Terms of the tenth order, harmless inside 8 mm and enormous at 30: a ray that starts far out and comes in
  // steeply passes through where the formula is wild before it meets the surface where it is glass.
  const shape: SurfaceShape = {
    kind: "asphere",
    radius: 40,
    conic: 0,
    terms: [
      { power: 4, coeff: -2e-5 },
      { power: 10, coeff: 3e-9 },
    ],
  };
  const lens = systemOf([{ z: 0, shape, index: 1.5, semiDiameter: 8 }]);
  const direction = unit(0, -0.9, 1);
  const inside = trace(lens, [0, 4 + 36, -40], direction);
  assert.equal(inside.status, "ok");
  near(inside.hits[0][2], sagOf(shape, Math.hypot(...inside.hits[0].slice(0, 2))), 1e-14, "on the sag");
  assert.ok(Math.hypot(inside.hits[0][0], inside.hits[0][1]) < 8);
  // One that crosses the surface's formula only beyond the rim is blocked there, and one that never comes within
  // the rim's radius of the axis is blocked without the formula being asked at all.
  assert.deepEqual(
    [trace(lens, [0, 12 + 36, -40], direction).status, trace(lens, [0, 12 + 36, -40], direction).endSurface],
    ["blocked", 0],
  );
  assert.equal(trace(lens, [30, 30, -40], [0, 0, 1]).status, "blocked");
});

/** The slope dz/dr of the contract's sag at the height r, differentiated by hand: c r / root plus the terms'. */
function slopeOf(shape: Exclude<SurfaceShape, { kind: "plane" }>, r: number): number {
  const c = shape.radius === null ? 0 : 1 / shape.radius;
  const terms: readonly AsphereTerm[] = shape.kind === "asphere" ? shape.terms : [];
  const conicPart = c === 0 ? 0 : (c * r) / Math.sqrt(1 - (1 + shape.conic) * c * c * r * r);
  return terms.reduce((sum, { power, coeff }) => sum + power * coeff * r ** (power - 1), conicPart);
}

test("refraction at an asphere, by hand: the slope of the contract's sag at the hit is the tangent of the normal's lean", () => {
  // A ray along the axis keeps its height h up to the surface, whose normal there leans from the axis by the angle
  // a with tan a = dz/dr: that is the angle of incidence. Snell's law in angles, sin t = sin a / n, turns the ray
  // toward the normal: behind the surface it makes the angle t - a with the axis, in the plane of the axis.
  let rays = 0;
  for (const [at, shape] of ASPHERES.entries()) {
    for (const n of [1.4587, 1.9]) {
      const lens = systemOf([{ z: 0, shape, index: n }]);
      for (const h of [0.5, 2, 4.5, 7.5]) {
        const traced = trace(lens, [0, h, -6], [0, 0, 1]);
        assert.equal(traced.status, "ok", `asphere ${at} at ${h}`);
        assert.equal(traced.hits[0][1], h);
        const lean = Math.atan(slopeOf(shape, h));
        const refraction = Math.asin(Math.sin(lean) / n);
        const expected: Vec3 = [0, Math.sin(refraction - lean), Math.cos(refraction - lean)];
        nearPoint(traced.direction, expected, 2 ** -48, `asphere ${at}, n ${n}, height ${h}`);
        // The surface does bend the ray there: the test is of a refraction, not of a ray that goes straight on.
        assert.ok(Math.abs(traced.direction[1]) > 1e-3, `asphere ${at} at ${h} bends the ray`);
        rays++;
      }
    }
  }
  assert.equal(rays, 32);
});

test("a line that cuts an asphere twice inside its clear aperture meets it at the crossing nearest the vertex plane", () => {
  // The base sphere of radius 5 about (0, 0, 5) has the point P = (0, 3, 1): 3^2 + 4^2 = 5^2. The line through P
  // along (0, 0.8, 0.6) is tangent to that sphere there, so the sphere alone has one hit, a double one. The term
  // -1e-3 r^4 moves the surface 0.08 mm toward the object at that height: the line now enters the glass before P
  // and leaves it behind P, both within the clear aperture of 4.5 mm. Newton's method, started at the sphere's own
  // hit, has no slope to go by there. The ray meets the surface where it enters: the crossing nearer the vertex.
  const shape: SurfaceShape = { kind: "asphere", radius: 5, conic: 0, terms: [{ power: 4, coeff: -1e-3 }] };
  const n = 1.6;
  const lens = systemOf([{ z: 0, shape, index: n, semiDiameter: 4.5, clipRadius: 4.5 }]);
  const direction: Vec3 = [0, 0.8, 0.6];
  const point: Vec3 = [0, 3, 1];
  /** How far the line's point at the parameter t from P lies above the contract's sag. */
  const above = (t: number): number => 1 + 0.6 * t - sagOf(shape, 3 + 0.8 * t);
  /** The crossing between two parameters of opposite sign, by halving until they are neighbouring doubles. */
  const crossing = (from: number, to: number): number => {
    let [low, high] = [from, to];
    assert.ok(above(low) < 0 !== above(high) < 0, "the bracket holds a crossing");
    for (;;) {
      const middle = low + (high - low) / 2;
      if (middle === low || middle === high) return Math.abs(above(low)) <= Math.abs(above(high)) ? low : high;
      if (above(middle) < 0 === above(low) < 0) low = middle;
      else high = middle;
    }
  };
  // In air, in the glass, in air again: the line is in the glass for almost 2 mm about P.
  assert.ok(above(-2) < 0 && above(0) > 0.08 && above(1.5) < 0);
  const [entering, leaving] = [crossing(-2, 0), crossing(0, 1.5)];
  const at = (t: number): Vec3 => [0, 3 + 0.8 * t, 1 + 0.6 * t];
  assert.ok(Math.abs(at(entering)[1]) < 4.5 && Math.abs(at(leaving)[1]) < 4.5, "both inside the clear aperture");
  assert.ok(at(entering)[2] < at(leaving)[2] && at(entering)[2] > 0, "the entering one is nearer the vertex plane");

  // Tangent to the base sphere exactly, and a hair to either side of it, where the sphere has two hits or none.
  for (const shift of [0, -5e-4, 5e-4, -1e-9, 1e-9]) {
    assert.ok(Math.abs(shift) < 1e-3);
    // The shifted line is another line: its crossings are worked out again, from its own points.
    const start: Vec3 = [0, point[1] + 0.6 * shift - 8, point[2] - 0.8 * shift - 6];
    const aboveShifted = (t: number): number => start[2] + 0.6 * t - sagOf(shape, start[1] + 0.8 * t);
    let [low, high] = [8, 10];
    assert.ok(aboveShifted(low) < 0 && aboveShifted(high) > 0, `shift ${shift}`);
    for (;;) {
      const middle = low + (high - low) / 2;
      if (middle === low || middle === high) break;
      if (aboveShifted(middle) < 0) low = middle;
      else high = middle;
    }
    const traced = trace(lens, start, direction);
    assert.deepEqual([traced.status, traced.hits.length], ["ok", 1], `shift ${shift}`);
    const [hit] = traced.hits;
    nearPoint(hit, [0, start[1] + 0.8 * low, start[2] + 0.6 * low], 8 * ulp(10), `shift ${shift}`);
    near(hit[2], sagOf(shape, Math.abs(hit[1])), 8 * ulp(1), `on the sag at shift ${shift}`);
    near(traced.opticalPath, low, 8 * ulp(10), `path at shift ${shift}`);
    if (shift === 0) nearPoint(hit, at(entering), 8 * ulp(10), "the entering crossing");

    // And it is refracted there by the surface's own normal, which leans from the axis by atan(dz/dr), toward -y.
    // The ray comes at 53.13 degrees to the axis from the other side of it: the two angles add up to the angle of
    // incidence, and the ray leaves at the angle of refraction from the normal, on the side it came from.
    const lean = Math.atan(slopeOf(shape, hit[1]));
    const incidence = Math.atan2(0.8, 0.6) + lean;
    assert.ok(incidence > 1.3 && incidence < Math.PI / 2, "a steep incidence, short of grazing");
    const refraction = Math.asin(Math.sin(incidence) / n);
    const expected: Vec3 = [0, Math.sin(refraction - lean), Math.cos(refraction - lean)];
    nearPoint(traced.direction, expected, 2 ** -46, `direction at shift ${shift}`);
  }

  // A line that passes the surface by, 0.2 mm outside the sphere, does not meet it: blocked, with nothing claimed.
  const beside: Vec3 = [0, point[1] + 0.6 * 0.2 - 8, point[2] - 0.8 * 0.2 - 6];
  const besideAbove = (t: number): number => beside[2] + 0.6 * t - sagOf(shape, Math.abs(beside[1] + 0.8 * t));
  for (let t = 0; t <= 20; t += 1 / 64) {
    if (Math.abs(beside[1] + 0.8 * t) <= 4.5) assert.ok(besideAbove(t) < 0, `in air at ${t}`);
  }
  assert.deepEqual([trace(lens, beside, direction).status, trace(lens, beside, direction).endSurface], ["blocked", 0]);
});

test("of two crossings inside the clear aperture the hit is the nearer to the vertex plane, also where it is the later", () => {
  // The same surface turned round: R = -5 with +1e-3 r^4, whose rim leans toward the object. The line through
  // P = (0, 3, -1) along (0, -0.8, 0.6) is tangent to the base sphere, and the term lifts the surface 0.08 mm past
  // the line there. So the line comes out of the surface 1.3 mm before P, from behind it, runs in front of it, and
  // goes in through its front 0.6 mm after P. The second crossing is the nearer to the vertex plane, and it is the
  // one at which a ray in front of the surface meets it.
  const shape: SurfaceShape = { kind: "asphere", radius: -5, conic: 0, terms: [{ power: 4, coeff: 1e-3 }] };
  const n = 1.6;
  const lens = systemOf([{ z: 0, shape, index: n, semiDiameter: 4.5, clipRadius: 4.5 }]);
  const direction: Vec3 = [0, -0.8, 0.6];
  const start: Vec3 = [0, 3 + 8, -1 - 6];
  const point = (t: number): Vec3 => [0, start[1] - 0.8 * t, start[2] + 0.6 * t];
  const above = (t: number): number => point(t)[2] - sagOf(shape, point(t)[1]);
  // Behind the surface, in front of it, behind it again; and both crossings are within the clear aperture.
  assert.ok(above(8.2) > 0 && above(10) < -0.08 && above(11) > 0);
  assert.ok(point(8.2)[1] < 4.5 && point(8.2)[1] > 0 && point(11)[1] > 0);
  let [low, high] = [10, 11];
  for (;;) {
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) break;
    if (above(middle) < 0) low = middle;
    else high = middle;
  }
  assert.ok(
    Math.abs(point(low)[2]) < 0.7 && point(8.2)[2] < -2,
    "the later crossing is the nearer to the vertex plane",
  );

  const traced = trace(lens, start, direction);
  assert.deepEqual([traced.status, traced.hits.length], ["ok", 1]);
  const [hit] = traced.hits;
  nearPoint(hit, point(low), 8 * ulp(11), "the crossing through the front of the surface");
  near(hit[2], sagOf(shape, hit[1]), 8 * ulp(1), "on the sag");
  near(traced.opticalPath, low, 8 * ulp(11), "path");
  // Refracted by the surface's own normal there, as in the test before, with every angle the other way round.
  const lean = Math.atan(slopeOf(shape, hit[1]));
  const incidence = Math.atan2(direction[1], direction[2]) + lean;
  assert.ok(lean < 0 && incidence < -1.3 && incidence > -Math.PI / 2, "a steep incidence, short of grazing");
  const refraction = Math.asin(Math.sin(incidence) / n);
  nearPoint(traced.direction, [0, Math.sin(refraction - lean), Math.cos(refraction - lean)], 2 ** -46, "direction");
});

test("a line that only grazes an asphere is met where it dips into it, however short the stretch inside is", () => {
  // The same surface and the same direction, with the line moved outward until it just dips into the glass: the
  // two crossings close up on each other and are, at last, nearer than any scan of the line would tell apart. The
  // line touches the surface where the surface's slope dz/dr is the line's, 0.6 / 0.8; it is moved out to there,
  // less a hair.
  const shape: SurfaceShape = { kind: "asphere", radius: 5, conic: 0, terms: [{ power: 4, coeff: -1e-3 }] };
  const lens = systemOf([{ z: 0, shape, index: 1.6, semiDiameter: 4.5, clipRadius: 4.5 }]);
  const direction: Vec3 = [0, 0.8, 0.6];
  // The height at which dz/dr = 0.6 / 0.8, by halving: the slope grows with the height here.
  let [inner, outer] = [2, 4];
  assert.ok(slopeOf(shape, inner) < 0.75 && slopeOf(shape, outer) > 0.75);
  for (let halving = 0; halving < 60; halving++) {
    const middle = (inner + outer) / 2;
    if (slopeOf(shape, middle) < 0.75) inner = middle;
    else outer = middle;
  }
  const touch: Vec3 = [0, inner, sagOf(shape, inner)];
  for (const depth of [1e-3, 1e-6, 1e-9, 1e-12]) {
    // The line through the point `depth` below the point of touch, across the line: inside the glass by that much.
    const through: Vec3 = [0, touch[1] - 0.6 * depth, touch[2] + 0.8 * depth];
    const start: Vec3 = [0, through[1] - 8, through[2] - 6];
    const traced = trace(lens, start, direction);
    assert.deepEqual([traced.status, traced.hits.length], ["ok", 1], `depth ${depth}`);
    const [hit] = traced.hits;
    near(hit[2], sagOf(shape, Math.abs(hit[1])), 8 * ulp(1), `on the sag at depth ${depth}`);
    // The chord inside the glass is about sqrt(8 depth / curvature) long, and the hit is its near end: before the
    // point the line was put through, and by no more than that chord.
    const along = (hit[1] - through[1]) * 0.8 + (hit[2] - through[2]) * 0.6;
    assert.ok(along < 0 && along > -4 * Math.sqrt(depth) - 1e-7, `depth ${depth}: ${along} mm along the line`);
  }
  // Moved out past the point of touch by as little as 1e-9 mm, the line does not meet the surface at all.
  for (const height of [1e-9, 1e-6, 1e-3]) {
    const through: Vec3 = [0, touch[1] + 0.6 * height, touch[2] - 0.8 * height];
    const traced = trace(lens, [0, through[1] - 8, through[2] - 6], direction);
    assert.deepEqual([traced.status, traced.endSurface], ["blocked", 0], `height ${height}`);
  }

  // The two at once: a dip too short for a scan to see, on a line Newton's method has no slope to follow. The line
  // is tangent to the base sphere at P = (0, 3, 1), and a term of -1e-9 r^4 takes the surface 8.1e-8 mm toward the
  // object there. Beside P the line is t^2 / 8 outside the sphere, at t along it, so it is in the glass from
  // t = -8e-4 to 8e-4: 1.6 micrometres of the 11 mm it runs within the clear aperture.
  const faint: SurfaceShape = { kind: "asphere", radius: 5, conic: 0, terms: [{ power: 4, coeff: -1e-9 }] };
  const above = (t: number): number => 1 + 0.6 * t - sagOf(faint, 3 + 0.8 * t);
  let [low, high] = [-0.01, 0];
  assert.ok(above(low) < 0 && above(high) > 8e-8 && above(0.01) < 0);
  for (;;) {
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) break;
    if (above(middle) < 0) low = middle;
    else high = middle;
  }
  near(low, -Math.sqrt(8 * 8.1e-8), 1e-6, "where the line enters the glass");
  const faintLens = systemOf([{ z: 0, shape: faint, index: 1.6, semiDiameter: 4.5, clipRadius: 4.5 }]);
  const traced = trace(faintLens, [0, 3 - 8, 1 - 6], direction);
  assert.deepEqual([traced.status, traced.hits.length], ["ok", 1]);
  const [hit] = traced.hits;
  near(hit[2], sagOf(faint, hit[1]), 8 * ulp(1), "on the sag");
  // The line meets the surface at a slope of 2e-4 there: one rounding of the sag is 1e-12 mm along the line.
  nearPoint(hit, [0, 3 + 0.8 * low, 1 + 0.6 * low], 1e-11, "the entering crossing");
});

test("a line across a surface whose rim turns back is met where it enters the glass, however it comes and goes", () => {
  // A gull wing: z = 0.1 r^2 - 0.004 r^4 rises from the vertex to 0.625 mm at the height 3.54 and falls back to
  // 0.576 at its rim of 4 mm. A line that climbs 0.04 mm per mm across it runs away from the surface over the wing,
  // toward it over the bowl and away again: neither end of its stretch within the clear aperture says what it does
  // between, and beyond the rim the formula dives, so a search that follows the slope from there finds a crossing
  // that is no part of the surface.
  const shape: SurfaceShape = {
    kind: "asphere",
    radius: null,
    conic: 0,
    terms: [
      { power: 2, coeff: 0.1 },
      { power: 4, coeff: -0.004 },
    ],
  };
  assert.ok(sagOf(shape, 3.54) > 0.62 && sagOf(shape, 4) < 0.58 && slopeOf(shape, 4) < 0);
  const lens = systemOf([{ z: 0, shape, index: 1.5, semiDiameter: 4, clipRadius: 4 }]);
  const direction = unit(0, 1, 0.04);
  /** The line along `direction` through `through`, from 10 mm before it, and how far above the sag it is at t. */
  const lineThrough = (through: Vec3) => {
    const start: Vec3 = [0, through[1] - 10 * direction[1], through[2] - 10 * direction[2]];
    const point = (t: number): Vec3 => [0, start[1] + t * direction[1], start[2] + t * direction[2]];
    return { start, point, above: (t: number): number => point(t)[2] - sagOf(shape, Math.abs(point(t)[1])) };
  };

  // 0.3 mm above the vertex: in air over both wings, in the glass over the bowl between them.
  const over = lineThrough([0, 0, 0.3]);
  assert.ok(over.above(6) < 0 && over.above(7) < 0 && over.above(10) > 0 && over.above(13) < 0 && over.above(14) < 0);
  let [low, high] = [7, 10];
  for (;;) {
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) break;
    if (over.above(middle) < 0) low = middle;
    else high = middle;
  }
  const entered = trace(lens, over.start, direction);
  assert.deepEqual([entered.status, entered.hits.length], ["ok", 1]);
  nearPoint(entered.hits[0], over.point(low), 16 * ulp(10), "where the line enters the glass");
  assert.ok(entered.hits[0][1] < -1.5 && entered.hits[0][1] > -2.5, String(entered.hits[0][1]));
  near(entered.opticalPath, low, 16 * ulp(10), "path");

  // Grazing the bowl: the line touches the surface where dz/dr is the line's own 0.04, a fifth of a millimetre
  // from the axis. Put through a point just inside the glass there it has two crossings very close together.
  let [inner, outer] = [0.1, 0.3];
  assert.ok(slopeOf(shape, inner) < 0.04 && slopeOf(shape, outer) > 0.04);
  for (let halving = 0; halving < 60; halving++) {
    const middle = (inner + outer) / 2;
    if (slopeOf(shape, middle) < 0.04) inner = middle;
    else outer = middle;
  }
  const touch: Vec3 = [0, inner, sagOf(shape, inner)];
  // Across the line, toward the glass: (0, -dz, dy).
  const into = (depth: number): Vec3 => [0, touch[1] - direction[2] * depth, touch[2] + direction[1] * depth];
  for (const depth of [1e-3, 1e-6, 1e-9, 1e-12]) {
    const line = lineThrough(into(depth));
    const traced = trace(lens, line.start, direction);
    assert.deepEqual([traced.status, traced.hits.length], ["ok", 1], `depth ${depth}`);
    const [hit] = traced.hits;
    near(hit[2], sagOf(shape, Math.abs(hit[1])), 8 * ulp(0.1), `on the sag at depth ${depth}`);
    // The stretch in the glass is 2 sqrt(10 depth) long, and the hit is its near end.
    const along = (hit[1] - line.point(10)[1]) * direction[1] + (hit[2] - line.point(10)[2]) * direction[2];
    assert.ok(along < 0 && along > -4 * Math.sqrt(depth) - 1e-7, `depth ${depth}: ${along} mm along the line`);
  }
  for (const height of [1e-9, 1e-6, 1e-3]) {
    const traced = trace(lens, lineThrough(into(-height)).start, direction);
    assert.deepEqual([traced.status, traced.endSurface], ["blocked", 0], `height ${height}`);
  }
});

test("a dip too short for a scan to see is found on a line that Newton's method has no slope to follow", () => {
  // z = (0.05 / 9) r^4 - 0.05 r^2: a ring-shaped trough that comes back up through the vertex plane at the height
  // 3, at the slope 0.3 and curving upward. The line through that point at that slope touches the surface there
  // from the air, and it crosses the vertex plane there, which is where the search for a hit on a flat base
  // starts: at the one point where the line runs along the surface and Newton's method divides by nothing.
  const shape: SurfaceShape = {
    kind: "asphere",
    radius: null,
    conic: 0,
    terms: [
      { power: 2, coeff: -0.05 },
      { power: 4, coeff: 0.05 / 9 },
    ],
  };
  // A clear aperture of 4.1 mm: no even division of the line's stretch within it falls on the point of touch.
  const lens = systemOf([{ z: 0, shape, index: 1.5, semiDiameter: 4.1, clipRadius: 4.1 }]);
  const touch: Vec3 = [0, 3, sagOf(shape, 3)];
  assert.ok(Math.abs(touch[2]) < 1e-15);
  near(slopeOf(shape, 3), 0.3, 1e-15, "the slope at the point of touch");
  const direction = unit(0, 1, slopeOf(shape, 3));
  // Everywhere else within the clear aperture the tangent line is in air: below the surface, toward the object.
  for (let y = -4.125; y <= 4.125; y += 1 / 32) {
    const above = touch[2] + (y - 3) * (direction[2] / direction[1]) - sagOf(shape, Math.abs(y));
    assert.ok(Math.abs(y - 3) < 1e-9 ? Math.abs(above) < 1e-15 : above < 0, `at the height ${y}: ${above}`);
  }
  // Across the line, toward the glass: (0, -dz, dy).
  const into = (depth: number): Vec3 => [0, touch[1] - direction[2] * depth, touch[2] + direction[1] * depth];
  const startOf = (through: Vec3): Vec3 => [0, through[1] - 10 * direction[1], through[2] - 10 * direction[2]];
  for (const depth of [1e-3, 1e-6, 1e-9, 1e-12]) {
    const through = into(depth);
    const traced = trace(lens, startOf(through), direction);
    assert.deepEqual([traced.status, traced.hits.length], ["ok", 1], `depth ${depth}`);
    const [hit] = traced.hits;
    near(hit[2], sagOf(shape, Math.abs(hit[1])), 1e-15, `on the sag at depth ${depth}`);
    // The line is in the glass over 4.3 sqrt(depth) mm, and the hit is the near end of that: where it enters.
    const along = (hit[1] - through[1]) * direction[1] + (hit[2] - through[2]) * direction[2];
    assert.ok(along < 0 && along > -3 * Math.sqrt(depth), `depth ${depth}: ${along} mm along the line`);
    assert.ok(along < -1.5 * Math.sqrt(depth), `depth ${depth}: ${along} mm along the line`);
  }
  for (const height of [1e-12, 1e-9, 1e-6, 1e-3]) {
    const traced = trace(lens, startOf(into(-height)), direction);
    assert.deepEqual([traced.status, traced.endSurface], ["blocked", 0], `height ${height}`);
  }
});

// ── Snell's law as vectors ───────────────────────────────────────────────────────────────────────────────────────

test("Snell's law does not ask which way the normal is turned, nor from which side the ray comes", () => {
  const degrees = (angle: number): number => (angle * Math.PI) / 180;
  for (const [before, after] of [
    [1, 1.5],
    [1.7, 1.2],
  ]) {
    for (const lean of [0, 20, 75, 110, 160]) {
      // A normal that leans by `lean` from the axis, and rays at angles of incidence up to the steepest that is
      // refracted, on either side of it. Beyond 90 degrees of lean the normal points against the ray.
      const normal: Vec3 = [0, Math.sin(degrees(lean)), Math.cos(degrees(lean))];
      for (const incidence of [-35, -10, 0, 5, 30]) {
        const from = degrees(lean > 90 ? lean - 180 : lean) + degrees(incidence);
        const ray: Vec3 = [0, Math.sin(from), Math.cos(from)];
        const bent = refract(ray, normal, before, after);
        assert.ok(bent !== null, `lean ${lean}, incidence ${incidence}`);
        // Snell's law in angles: the ray leaves at asin(n sin i / n') from the line of the normal, on its own side.
        const to = from - degrees(incidence) + Math.asin((before / after) * Math.sin(degrees(incidence)));
        nearPoint(bent, [0, Math.sin(to), Math.cos(to)], 2 ** -51, `lean ${lean}, incidence ${incidence}`);
        // The same surface with its normal written the other way round is the same surface.
        assert.deepEqual(refract(ray, [-normal[0], -normal[1], -normal[2]], before, after), bent);
      }
    }
  }
});

// ── Total internal reflection, and a ray turned back ─────────────────────────────────────────────────────────────

test("glass to air beyond the critical angle is a total reflection: blocked at that surface, with no hit on it", () => {
  const n = 1.5;
  const critical = Math.asin(1 / n);
  // A plane front face at normal incidence, then a plane rear face: the ray in the glass is the ray in air, bent.
  const plate = systemOf([
    { z: 0, shape: sphere(Infinity), index: n },
    { z: 5, shape: sphere(Infinity), index: 1 },
    { z: 9, shape: sphere(Infinity), index: 1 },
  ]);
  /** A ray that travels in the glass at the angle `inside` to the axis: Snell's law at the front face. */
  const inGlass = (inside: number): SurfaceTrace => {
    const outside = Math.asin(n * Math.sin(inside));
    return trace(plate, [0, 0, -1], [0, Math.sin(outside), Math.cos(outside)]);
  };
  // Nothing in air reaches the critical angle in the glass: a front face cannot make its own total reflection.
  assert.ok(Number.isNaN(Math.asin(n * Math.sin(critical + 1e-3))));
  // So the glass is entered through a sphere, which a ray along the axis leaves bent by as much as wanted.
  const ball = (height: number): SurfaceTrace =>
    trace(
      systemOf([
        { z: 0, shape: sphere(10), index: n },
        { z: 12, shape: sphere(Infinity), index: 1 },
        { z: 20, shape: sphere(Infinity), index: 1 },
      ]),
      [0, height, -5],
      [0, 0, 1],
    );
  /** The angle to the axis, in the glass, of the ray that entered the sphere at the height h. */
  const angleInGlass = (height: number): number => Math.asin(height / 10) - Math.asin(height / 10 / n);

  // Well inside the critical angle the ray leaves, by Snell's law.
  const leaves = inGlass(0.5);
  assert.equal(leaves.status, "ok");
  near(leaves.direction[1], n * Math.sin(0.5), 2 ** -51, "sine of the angle in air");
  // The sphere bends a ray at the height 9.99 by 45.7 degrees: beyond the critical angle of 41.8 at the flat face.
  assert.ok(angleInGlass(9.99) > critical && angleInGlass(8) < critical);
  const reflected = ball(9.99);
  assert.deepEqual([reflected.status, reflected.endSurface, reflected.hits.length], ["blocked", 1, 1]);
  const passed = ball(8);
  assert.equal(passed.status, "ok");
  near(Math.hypot(passed.direction[0], passed.direction[1]), n * Math.sin(angleInGlass(8)), 2 ** -50, "Snell");
  // The path of a ray that was reflected is the path to its last hit: nothing is added at the surface it ended on.
  near(reflected.opticalPath, distance(reflected.hits[0], [0, 9.99, -5]), 4 * ulp(15), "path to the last hit");
});

test("a ray bent past the perpendicular to the axis goes to no further surface: blocked at the next one", () => {
  // Glass to air, just inside the critical angle, at a point where the surface's normal leans from the axis the
  // way the ray is going: the ray leaves along the surface, which there is backwards.
  //
  // The ray travels at 56 degrees to the axis. It enters the glass through a sphere of radius 10 whose centre C1 it
  // is aimed at, so that front face does not bend it. The rear face is a sphere of radius 10 about C2, convex
  // toward the image, which the ray meets where the normal leans 15 degrees: at 41 degrees of incidence.
  const n = 1.5;
  const degrees = (angle: number): number => (angle * Math.PI) / 180;
  const [heading, lean] = [degrees(56), degrees(15)];
  const incidence = heading - lean;
  assert.ok(Math.sin(incidence) < 1 / n, "inside the critical angle");
  const direction: Vec3 = [0, Math.sin(heading), Math.cos(heading)];
  // From C1 = (0, 0, 10) the ray runs s to the rear face, where it is 10 sin(lean) off the axis.
  const s = (10 * Math.sin(lean)) / Math.sin(heading);
  const hit: Vec3 = [0, 10 * Math.sin(lean), 10 + s * Math.cos(heading)];
  const rearVertex = hit[2] - 10 * Math.cos(lean) + 10;
  const lens = systemOf([
    { z: 0, shape: sphere(10), index: n },
    { z: rearVertex, shape: sphere(-10), index: 1 },
    { z: rearVertex + 0.5, shape: sphere(Infinity), index: 1 },
  ]);
  const origin: Vec3 = [0, -19 * direction[1], 10 - 19 * direction[2]];
  assert.ok(origin[2] < 0, "the ray starts in front of the lens");

  const traced = trace(lens, origin, direction);
  // It passed the two faces of the glass and goes to no third surface.
  assert.deepEqual([traced.status, traced.endSurface, traced.hits.length], ["blocked", 2, 2]);
  nearPoint(traced.hits[0], [0, -10 * direction[1], 10 - 10 * direction[2]], 8 * ulp(10), "front face");
  nearPoint(traced.hits[1], hit, 8 * ulp(12), "rear face");
  near(traced.opticalPath, 9 + n * (10 + s), 8 * ulp(30), "path to the rear face");
  // It leaves at the angle t from the normal, on the far side of it from the axis: lean + t from the axis.
  const refraction = Math.asin(n * Math.sin(incidence));
  assert.ok(lean + refraction > Math.PI / 2, "past the perpendicular");
  nearPoint(traced.direction, [0, Math.sin(lean + refraction), Math.cos(lean + refraction)], 2 ** -48, "direction");
  assert.ok(traced.direction[2] < 0);
  // The plane behind is crossed by the ray's line behind the ray: that is no hit, and the tracer takes none. A
  // ray that leaves the same point less steeply does go on to it.
  assert.ok((rearVertex + 0.5 - hit[2]) / traced.direction[2] < 0);
  const gentler: Vec3 = [0, Math.sin(degrees(40)), Math.cos(degrees(40))];
  const on = trace(lens, [0, -19 * gentler[1], 10 - 19 * gentler[2]], gentler);
  assert.deepEqual([on.status, on.hits.length], ["ok", 3]);
});

// ── Missing a surface ────────────────────────────────────────────────────────────────────────────────────────────

test("a ray that passes a steep surface by is blocked: beside a sphere, and across the far half of one", () => {
  // A sphere of radius 5 whose clear aperture is stated wider than the sphere is.
  const ball = systemOf([{ z: 0, shape: sphere(5), index: 1.5, semiDiameter: 8 }]);
  // Beside it: no point of the sphere is 6 mm from the axis.
  assert.deepEqual(
    [trace(ball, [0, 6, -5], [0, 0, 1]).status, trace(ball, [0, 6, -5], [0, 0, 1]).endSurface],
    ["blocked", 0],
  );
  // Just inside its equator it is met, and just outside it is not.
  assert.equal(trace(ball, [0, 5 - 1e-9, -5], [0, 0, 1]).status, "ok");
  assert.equal(trace(ball, [0, 5 + 1e-9, -5], [0, 0, 1]).status, "blocked");
  // Across its far half only: the line enters the sphere behind the equator, where the sag formula has no surface.
  const steep = unit(0, -1, 0.2);
  const across = trace(ball, [0, 10, 5.5], steep);
  assert.equal(across.status, "blocked");
  // The same sphere is met by that line, twice, at z = 6.3 and z = 6.9: both beyond the centre at z = 5.
  const centre: Vec3 = [0, 0, 5];
  assert.ok(distanceFromLine(centre, [0, 10, 5.5], steep) < 5);
  // An ellipsoid ends too: K = 3 and R = 10 end at the height 5.
  const oblate = systemOf([{ z: 0, shape: { kind: "conic", radius: 10, conic: 3 }, index: 1.5, semiDiameter: 9 }]);
  assert.equal(trace(oblate, [0, 4.9, -5], [0, 0, 1]).status, "ok");
  assert.equal(trace(oblate, [0, 5.1, -5], [0, 0, 1]).status, "blocked");
  // And an asphere on such a base has no surface beyond its base's end, whatever its terms are.
  const terms = [{ power: 4, coeff: 1e-4 }];
  const capped = systemOf([
    { z: 0, shape: { kind: "asphere", radius: 5, conic: 0, terms }, index: 1.5, semiDiameter: 8 },
  ]);
  assert.equal(trace(capped, [0, 4.5, -5], [0, 0, 1]).status, "ok");
  assert.equal(trace(capped, [0, 6, -5], [0, 0, 1]).status, "blocked");
});

// ── Clear apertures ──────────────────────────────────────────────────────────────────────────────────────────────

test("the clip radius is inclusive: a ray exactly at it passes, one unit of rounding beyond it is blocked", () => {
  for (const shape of [sphere(Infinity), sphere(50), sphere(-50)]) {
    const lens = systemOf([
      { z: 0, shape: sphere(Infinity), index: 1 },
      { z: 2, shape, index: 1.5, clipRadius: 4 },
      { z: 6, shape: sphere(Infinity), index: 1 },
    ]);
    // A ray along the axis keeps its height, so the height of its hit is the height it was given.
    const at = (height: number): SurfaceTrace => trace(lens, [0, height, -5], [0, 0, 1]);
    assert.equal(at(4).status, "ok", "exactly at the clip radius");
    assert.equal(Math.hypot(at(4).hits[1][0], at(4).hits[1][1]), 4);
    assert.equal(at(4 - ulp(4)).status, "ok", "just inside");
    const outside = at(4 + ulp(4));
    assert.deepEqual([outside.status, outside.endSurface, outside.hits.length], ["blocked", 1, 1]);
    // Off the meridional plane the height is a square root: 2.4 and 3.2 make 4 exactly.
    assert.equal(trace(lens, [2.4, 3.2, -5], [0, 0, 1]).status, "ok");
    assert.equal(trace(lens, [2.4, 3.2000000001, -5], [0, 0, 1]).status, "blocked");
  }
});

test("an annular aperture stops a ray inside its inner radius, and passes one exactly at it", () => {
  const ring = systemOf([
    { z: 0, shape: sphere(80), index: 1.5 },
    { z: 3, shape: sphere(Infinity), index: 1, semiDiameter: 6, clipRadius: 6, innerSemiDiameter: 1.5 },
  ]);
  assert.ok(ring.features.includes("aperture.annular"));
  // The first surface bends a ray along the axis toward it, so the heights at the plate are worked back from there:
  // a ray that is to reach the plate at the height h is aimed from the plate, through nothing but that surface.
  const at = (height: number): SurfaceTrace => {
    const plate = systemOf([
      { z: 0, shape: sphere(80), index: 1.5 },
      { z: 3, shape: sphere(Infinity), index: 1, semiDiameter: 6, clipRadius: 6, innerSemiDiameter: height },
    ]);
    return trace(plate, [0, 2, -5], [0, 0, 1]);
  };
  // One ray, and rings that begin a hair inside, exactly at and a hair outside the height it arrives at.
  const arrival = Math.hypot(...at(0).hits[1].slice(0, 2));
  assert.ok(arrival > 1.9 && arrival < 2);
  assert.equal(at(arrival - ulp(arrival)).status, "ok");
  assert.equal(at(arrival).status, "ok", "exactly at the inner radius");
  const stopped = at(arrival + ulp(arrival));
  assert.deepEqual([stopped.status, stopped.endSurface, stopped.hits.length], ["blocked", 1, 1]);
  // The ring of 1.5 mm: the axis and everything near it is stopped, the zone outside it passes, the rim clips.
  assert.equal(trace(ring, [0, 0, -5], [0, 0, 1]).status, "blocked");
  assert.equal(trace(ring, [1, 0.5, -5], [0, 0, 1]).status, "blocked");
  assert.equal(trace(ring, [1.2, 1.2, -5], [0, 0, 1]).status, "ok");
  assert.equal(trace(ring, [0, 6.5, -5], [0, 0, 1]).status, "blocked");
  // An asphere with a hole in it stops what a plane with one stops: the hit inside the hole is no hit, however
  // it was found.
  const holed = systemOf([
    { z: 0, shape: ASPHERES[0], index: 1.5, semiDiameter: 6, clipRadius: 6, innerSemiDiameter: 1.5 },
  ]);
  for (const direction of [unit(0, 0, 1), unit(0.02, -0.03, 1)]) {
    const inHole = trace(holed, [0.3 - 5 * direction[0], -0.4 - 5 * direction[1], -5 * direction[2]], direction);
    assert.deepEqual([inHole.status, inHole.endSurface, inHole.hits.length], ["blocked", 0, 0]);
    assert.equal(trace(holed, [2 - 5 * direction[0], 2 - 5 * direction[1], -5 * direction[2]], direction).status, "ok");
  }
});

// ── Surfaces that cross ──────────────────────────────────────────────────────────────────────────────────────────

test("a surface that lies behind the last hit is met by a step backwards, and the path counts it with its sign", () => {
  // A sphere of R = 20 and, 0.5 mm behind its vertex, a plane: at the height 6 the sphere has run 0.917 mm ahead,
  // so the plane lies behind the hit on the sphere. A sequential trace meets it there all the same.
  const n = 1.6;
  const lens = systemOf([
    { z: 0, shape: sphere(20), index: n },
    { z: 0.5, shape: sphere(Infinity), index: 1 },
  ]);
  const traced = trace(lens, [0, 6, -4], [0, 0, 1]);
  assert.equal(traced.status, "ok");
  const sag = 20 - Math.sqrt(400 - 36);
  assert.ok(sag > 0.5);
  nearPoint(traced.hits[0], [0, 6, sag], 4 * ulp(6), "on the sphere");
  // In the glass the ray is turned toward the axis by i - t, with sin i = 6 / 20.
  const turn = Math.asin(0.3) - Math.asin(0.3 / n);
  // To the plane it steps back: by the distance (sag - 0.5) / cos(turn), against its direction.
  const back = (sag - 0.5) / Math.cos(turn);
  nearPoint(traced.hits[1], [0, 6 + back * Math.sin(turn), 0.5], 4 * ulp(6), "on the plane, behind the sphere's hit");
  assert.ok(traced.hits[1][2] < traced.hits[0][2]);
  near(traced.opticalPath, 4 + sag - n * back, 8 * ulp(5), "the path with the backward stretch subtracted");
  // Near the axis the sphere has not reached the plane, and the step is forward as ever.
  const forward = trace(lens, [0, 1, -4], [0, 0, 1]);
  assert.ok(forward.hits[1][2] > forward.hits[0][2]);
  // Behind the plane the two rays are in air again, bent by Snell's law at the plane.
  near(traced.direction[1], -n * Math.sin(turn), 2 ** -51, "the sine behind the plane");
});

// ── Skew rays ────────────────────────────────────────────────────────────────────────────────────────────────────

const SKEW_LENS = caseOf(
  [
    { z: 0, shape: ASPHERES[0], index: 1.6935 },
    { z: 4.5, shape: sphere(-48), index: 1.8052 },
    { z: 6, shape: sphere(95), index: 1 },
    { z: 9, shape: sphere(Infinity), index: 1, semiDiameter: 7 },
    { z: 11, shape: ASPHERES[1], index: 1.5891 },
    { z: 14, shape: { kind: "conic", radius: -19, conic: -0.4 }, index: 1 },
  ],
  { stopIndex: 3 },
);

test("a lens of revolution traces a rotated ray to the rotated hits: no direction across the axis is special", () => {
  const origin: Vec3 = [0, 4.5, -8];
  const direction = unit(0, -0.12, 1);
  const meridional = trace(SKEW_LENS, origin, direction);
  assert.equal(meridional.status, "ok");
  // A meridional ray stays in its plane.
  for (const hit of meridional.hits) assert.equal(hit[0], 0);
  for (const angle of [0.4, 1.3, Math.PI / 2, 2.8, 4.1, 5.9]) {
    const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
    const turned = (vector: Vec3): Vec3 => [
      cos * vector[0] - sin * vector[1],
      sin * vector[0] + cos * vector[1],
      vector[2],
    ];
    const traced = trace(SKEW_LENS, turned(origin), turned(direction));
    assert.equal(traced.status, "ok");
    traced.hits.forEach((hit, surface) => {
      nearPoint(hit, turned(meridional.hits[surface]), 16 * ulp(8), `surface ${surface} at ${angle} rad`);
    });
    nearPoint(traced.direction, turned(meridional.direction), 2 ** -48, `direction at ${angle} rad`);
    near(traced.opticalPath, meridional.opticalPath, 16 * ulp(meridional.opticalPath), `path at ${angle} rad`);
  }
});

test("a skew ray keeps its skewness through every surface of revolution: n (x dy - y dx) is one number", () => {
  // The component along the axis of n r x d is conserved by a refraction whose normal lies in the plane of the
  // axis and the hit, and by a straight stretch: an invariant of every ray, which only a skew one has not as 0.
  const indices = buildRefSystem(SKEW_LENS).indexAfter[0];
  let rays = 0;
  for (const [origin, direction] of [
    [[3, 1, -8], unit(-0.05, 0.14, 1)],
    [[-2.5, 4, -8], unit(0.17, 0.02, 1)],
    [[0.5, -5, -8], unit(0.2, 0.1, 1)],
  ] as [Vec3, Vec3][]) {
    const traced = trace(SKEW_LENS, origin, direction);
    assert.equal(traced.status, "ok");
    const skewness = origin[0] * direction[1] - origin[1] * direction[0];
    assert.ok(Math.abs(skewness) > 0.1, "a ray that is skew");
    traced.hits.forEach((hit, surface) => {
      // The direction behind the surface is the unit vector from this hit to the next, or the ray's last one.
      const next = traced.hits[surface + 1];
      const after = next === undefined ? traced.direction : unit(next[0] - hit[0], next[1] - hit[1], next[2] - hit[2]);
      const behind = indices[surface] * (hit[0] * after[1] - hit[1] * after[0]);
      near(behind, skewness, 64 * ulp(skewness), `skewness behind surface ${surface}`);
    });
    rays++;
  }
  assert.equal(rays, 3);
});

// ── What it cannot decide ────────────────────────────────────────────────────────────────────────────────────────

test("a ray the tracer cannot place is failed, never blocked: the apex of a cone, and a line it cannot follow", () => {
  // A cone has no normal at its apex: the ray along the axis meets the surface, and cannot be refracted.
  const cone = systemOf([
    { z: 0, shape: { kind: "asphere", radius: null, conic: 0, terms: [{ power: 1, coeff: 0.2 }] }, index: 1.5 },
  ]);
  const apex = trace(cone, [0, 0, -5], [0, 0, 1]);
  assert.deepEqual([apex.status, apex.endSurface, apex.hits.length], ["failed", 0, 0]);
  // Off the apex the cone is a surface like any other: the ray along the axis meets it at 0.2 times its height.
  const side = trace(cone, [0, 3, -5], [0, 0, 1]);
  assert.equal(side.status, "ok");
  nearPoint(side.hits[0], [0, 3, 0.6], 4 * ulp(3), "on the cone");
  // A direction so nearly across the axis that the vertex plane is beyond every number.
  const lens = systemOf([{ z: 0, shape: sphere(30), index: 1.5 }]);
  const lost = trace(lens, [0, 0, -5], [1, 0, 5e-324]);
  assert.deepEqual([lost.status, lost.endSurface], ["failed", 0]);
});
