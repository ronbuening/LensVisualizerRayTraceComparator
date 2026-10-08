// The reference engine's paraxial kernel, against first-order optics worked out here another way: the lensmaker's
// and the thick-lens formulas, and Gaussian imaging surface by surface with the conjugate equation
// n'/l' = n/l + (n' - n)/R. The kernel multiplies ray-transfer matrices; nothing below does.
import assert from "node:assert/strict";
import { test } from "node:test";

import { FIRST_ORDER_VALUES } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import {
  AFOCAL_RELATIVE_POWER,
  firstOrder,
  systemMatrices,
  vertexCurvature,
} from "../../../src/engines/ref/paraxial.ts";
import type { FirstOrderInput, ParaxialSurface } from "../../../src/engines/ref/paraxial.ts";
import { profileOf } from "../../../src/engines/ref/surface.ts";

/** A surface of radius `radius` (Infinity for a plane) at `z`, followed by a medium of index `indexAfter`. */
function at(z: number, radius: number, indexAfter: number): ParaxialSurface {
  return { z, curvature: Number.isFinite(radius) ? 1 / radius : 0, indexAfter };
}

/** A thin lens in air at `z`: two surfaces on one vertex whose powers add up to 1 / focalLength. */
function thinLens(z: number, focalLength: number): ParaxialSurface[] {
  // An equiconvex lens of index 1.5 has the focal length of its radius: (n - 1)(1/R + 1/R) = 1/R.
  return [at(z, focalLength, 1.5), at(z, -focalLength, 1)];
}

function input(surfaces: readonly ParaxialSurface[], more: Partial<FirstOrderInput> = {}): FirstOrderInput {
  return {
    surfaces,
    stopIndex: 0,
    stopSemiDiameter: 1,
    lastLensSurfaceIndex: surfaces.length - 1,
    objectZ: null,
    ...more,
  };
}

/** The first-order data of a system that has some; fails the test for an afocal one. */
function data(surfaces: readonly ParaxialSurface[], more: Partial<FirstOrderInput> = {}) {
  const output = firstOrder(input(surfaces, more));
  assert.ok(output !== null, "the system is afocal");
  return output;
}

/** Asserts that `actual` is `expected` within `relative` of its size, or of 1 for a value near 0. */
function close(actual: number, expected: number, message: string, relative = 1e-13): void {
  const allowed = relative * Math.max(1, Math.abs(expected));
  assert.ok(Math.abs(actual - expected) <= allowed, `${message}: ${actual} is not ${expected} ± ${allowed}`);
}

/**
 * Gaussian imaging by hand. An object point on the axis at `objectZ` (null: at infinity), in a medium of index
 * `objectIndex`, is imaged by one surface after the other: with the vergence V = n / l of the light arriving at a
 * surface, the surface adds its power, V' = V + (n' - n) c, and the image is n' / V' behind its vertex. That image
 * is the object of the next surface, a gap further on. Returns where the last image is, the lateral magnification
 * (the product of V / V' over the surfaces), and, for an object at infinity, the ratio of the height at which a ray
 * leaves the last surface to the height at which it entered the first.
 */
function imaged(
  surfaces: readonly ParaxialSurface[],
  objectZ: number | null,
  objectIndex = 1,
): { imageZ: number; magnification: number; heightRatio: number } {
  let vergence = objectZ === null ? 0 : objectIndex / (objectZ - surfaces[0].z);
  let indexBefore = objectIndex;
  let magnification = 1;
  let heightRatio = 1;
  let imageZ = NaN;
  surfaces.forEach((surface, index) => {
    const leaving = vergence + (surface.indexAfter - indexBefore) * surface.curvature;
    magnification *= vergence / leaving;
    imageZ = surface.z + surface.indexAfter / leaving;
    if (index + 1 < surfaces.length) {
      const gap = surfaces[index + 1].z - surface.z;
      const shrink = 1 - (gap * leaving) / surface.indexAfter;
      heightRatio *= shrink;
      vergence = leaving / shrink;
    }
    indexBefore = surface.indexAfter;
  });
  return { imageZ, magnification, heightRatio };
}

/**
 * The surfaces in front of `count`, as light travelling backwards meets them: in reverse order, mirrored in z, each
 * followed by the medium that was in front of it. An image formed by them, mirrored back, is an image in the
 * object space of the system.
 */
function reversed(surfaces: readonly ParaxialSurface[], count: number): ParaxialSurface[] {
  return surfaces
    .slice(0, count)
    .map((surface, index) => ({
      z: -surface.z,
      curvature: -surface.curvature,
      indexAfter: index === 0 ? 1 : surfaces[index - 1].indexAfter,
    }))
    .reverse();
}

/** Both pupils of a system by Gaussian imaging of the centre of its stop, of radius 1. */
function pupilsByHand(surfaces: readonly ParaxialSurface[], stopIndex: number) {
  const stop = surfaces[stopIndex];
  const entrance =
    stopIndex === 0
      ? { z: stop.z, radius: 1 }
      : (() => {
          const back = imaged(reversed(surfaces, stopIndex), -stop.z, surfaces[stopIndex - 1].indexAfter);
          return { z: -back.imageZ, radius: Math.abs(back.magnification) };
        })();
  const behind = surfaces.slice(stopIndex + 1);
  const exit =
    behind.length === 0
      ? { z: stop.z, radius: 1 }
      : (() => {
          const forth = imaged(behind, stop.z, stop.indexAfter);
          return { z: forth.imageZ, radius: Math.abs(forth.magnification) };
        })();
  return { entrance, exit };
}

// ── Singlets ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("a thin lens has the focal length of the lensmaker's formula, and its principal points at the lens", () => {
  // 1/f = (n - 1)(1/R1 - 1/R2): n = 1.5, R1 = 50, R2 = -50 gives f = 50.
  const equiconvex = data([at(0, 50, 1.5), at(0, -50, 1)]).values;
  close(equiconvex.efl, 50, "efl");
  close(equiconvex.rearFocalZ, 50, "rearFocalZ");
  close(equiconvex.frontFocalZ, -50, "frontFocalZ");
  close(equiconvex.frontPrincipalZ, 0, "frontPrincipalZ");
  close(equiconvex.rearPrincipalZ, 0, "rearPrincipalZ");
  close(equiconvex.backFocus, 50, "backFocus");

  // A meniscus and a negative lens, anywhere on the axis: n = 1.62, R1 = 30, R2 = 80, at z = 7.
  const n = 1.62;
  const meniscus = data([at(7, 30, n), at(7, 80, 1)]).values;
  const f = 1 / ((n - 1) * (1 / 30 - 1 / 80));
  close(meniscus.efl, f, "meniscus efl");
  close(meniscus.rearFocalZ, 7 + f, "meniscus rearFocalZ");
  const negative = data([at(0, -40, 1.5), at(0, 40, 1)]).values;
  close(negative.efl, -40, "negative efl");
  // The rear focal point of a negative lens is in front of it.
  close(negative.rearFocalZ, -40, "negative rearFocalZ");
  close(negative.frontFocalZ, 40, "negative frontFocalZ");
});

test("a thick lens has the power P1 + P2 - P1 P2 t / n, and principal points moved by f P t / n", () => {
  const systems: [r1: number, r2: number, t: number, n: number, z: number][] = [
    [100, -100, 30, 1.5, 0],
    [50, -50, 4, 1.5168, 0],
    [42.7, 315.2, 11.3, 1.7725, -5],
    [-61.3, -24.9, 8.8, 1.6204, 2.5],
    [Infinity, -38.6, 6, 1.5168, 0],
    [38.6, Infinity, 6, 1.5168, 0],
  ];
  for (const [r1, r2, t, n, z] of systems) {
    const [p1, p2] = [(n - 1) / r1, (1 - n) / r2];
    const f = 1 / (p1 + p2 - (p1 * p2 * t) / n);
    const rearPrincipal = z + t - (f * p1 * t) / n;
    const frontPrincipal = z + (f * p2 * t) / n;
    const { values } = data([at(z, r1, n), at(z + t, r2, 1)]);
    const name = `R1 ${r1}, R2 ${r2}`;
    close(values.efl, f, `${name}: efl`);
    close(values.rearPrincipalZ, rearPrincipal, `${name}: rearPrincipalZ`);
    close(values.frontPrincipalZ, frontPrincipal, `${name}: frontPrincipalZ`);
    close(values.rearFocalZ, rearPrincipal + f, `${name}: rearFocalZ`);
    close(values.frontFocalZ, frontPrincipal - f, `${name}: frontFocalZ`);
    close(values.backFocus, rearPrincipal + f - (z + t), `${name}: backFocus`);
  }
  // The first of them in numbers: P1 = P2 = 0.005, P = 0.0095, f = 2000/19; each principal point 200/19 inside.
  const { values } = data([at(0, 100, 1.5), at(30, -100, 1)]);
  close(values.efl, 2000 / 19, "efl");
  close(values.frontPrincipalZ, 200 / 19, "frontPrincipalZ");
  close(values.rearPrincipalZ, 30 - 200 / 19, "rearPrincipalZ");
});

test("a plano-convex lens has one principal point on its curved vertex and the other t / n inside the plane one", () => {
  // Convex first: P2 = 0, so the front principal point is the front vertex and f = R / (n - 1).
  const convexFirst = data([at(0, 25.84, 1.5168), at(5, Infinity, 1)]).values;
  close(convexFirst.efl, 25.84 / 0.5168, "efl");
  close(convexFirst.frontPrincipalZ, 0, "frontPrincipalZ");
  // The rear one lies t / n in front of the plane side.
  close(convexFirst.rearPrincipalZ, 5 - 5 / 1.5168, "rearPrincipalZ");
  // Turned round, the focal length is the same and the principal points swap sides.
  const planeFirst = data([at(0, Infinity, 1.5168), at(5, -25.84, 1)]).values;
  close(planeFirst.efl, 25.84 / 0.5168, "turned efl");
  close(planeFirst.rearPrincipalZ, 5, "turned rearPrincipalZ");
  close(planeFirst.frontPrincipalZ, 5 / 1.5168, "turned frontPrincipalZ");
});

test("a single refracting surface into glass: f' = n R / (n - 1) behind it, f = R / (n - 1) in front", () => {
  // The image space is glass: the effective focal length is the rear one, n' times 1 / power.
  const { values } = data([at(3, 20, 1.6)]);
  close(values.efl, (1.6 * 20) / 0.6, "efl");
  close(values.rearFocalZ, 3 + (1.6 * 20) / 0.6, "rearFocalZ");
  close(values.frontFocalZ, 3 - 20 / 0.6, "frontFocalZ");
  close(values.frontPrincipalZ, 3, "frontPrincipalZ");
  close(values.rearPrincipalZ, 3, "rearPrincipalZ");
  // It is its own stop, so both pupils are the stop.
  close(values.entrancePupilZ, 3, "entrancePupilZ");
  close(values.exitPupilZ, 3, "exitPupilZ");
});

// ── Several surfaces ─────────────────────────────────────────────────────────────────────────────────────────────

test("a cemented doublet, imaged by hand surface by surface, has the kernel's focal points and focal length", () => {
  // Crown in front, flint behind, cemented: three surfaces, two glasses.
  const doublet = [at(0, 61.47, 1.5168), at(6, -43.47, 1.6727), at(8.5, -124.6, 1)];
  const { values } = data(doublet);

  // By hand, from infinity. Surface 1: V' = 0.5168 / 61.47; its image is 1.5168 / V' behind it.
  const v1 = 0.5168 / 61.47;
  const l1 = 1.5168 / v1;
  // Surface 2, 6 mm on: the object is l1 - 6 away, in crown; the surface adds (1.6727 - 1.5168) / -43.47.
  const v2 = 1.5168 / (l1 - 6) + (1.6727 - 1.5168) / -43.47;
  const l2 = 1.6727 / v2;
  // Surface 3, 2.5 mm on: the object is l2 - 2.5 away, in flint; the surface adds (1 - 1.6727) / -124.6.
  const v3 = 1.6727 / (l2 - 2.5) + (1 - 1.6727) / -124.6;
  const l3 = 1 / v3;
  close(values.rearFocalZ, 8.5 + l3, "rearFocalZ");
  close(values.backFocus, l3, "backFocus");
  // A ray entering at height 1 leaves at (l1 - 6) / l1 * (l2 - 2.5) / l2; the focal length is l3 over that.
  const height = ((l1 - 6) / l1) * ((l2 - 2.5) / l2);
  close(values.efl, l3 / height, "efl");
  close(values.rearPrincipalZ, 8.5 + l3 - l3 / height, "rearPrincipalZ");

  // And backwards, for the front focal point: the same lens turned round, imaged from infinity.
  const back = imaged(reversed(doublet, 3), null);
  close(values.frontFocalZ, -back.imageZ, "frontFocalZ");
  close(values.efl, (back.imageZ - -doublet[0].z) / back.heightRatio, "efl from the front");
  close(values.frontPrincipalZ, -back.imageZ + values.efl, "frontPrincipalZ");
  // The general helper agrees with the three steps written out above.
  close(imaged(doublet, null).imageZ, 8.5 + l3, "imaged");
});

test("two thin lenses a distance apart: 1/f = 1/f1 + 1/f2 - d / (f1 f2)", () => {
  const [f1, f2, d] = [80, -45, 30];
  const { values } = data([...thinLens(0, f1), ...thinLens(d, f2)]);
  const f = 1 / (1 / f1 + 1 / f2 - d / (f1 * f2));
  close(values.efl, f, "efl");
  // The back focal distance of the pair: f (f1 - d) / f1.
  close(values.backFocus, (f * (f1 - d)) / f1, "backFocus");
  close(values.frontFocalZ, -(f * (f2 - d)) / f2, "frontFocalZ");
});

test("a plane-parallel plate behind a lens moves the focus back by t (1 - 1/n), and changes nothing else", () => {
  const lens = [at(0, 60, 1.5168), at(5, -60, 1)];
  const [t, n] = [2.5, 1.5168];
  const plate = [at(12, Infinity, n), at(12 + t, Infinity, 1)];
  const bare = data(lens).values;
  const covered = data([...lens, ...plate], { lastLensSurfaceIndex: 1 }).values;
  const shift = t * (1 - 1 / n);
  close(covered.rearFocalZ, bare.rearFocalZ + shift, "rearFocalZ");
  close(covered.efl, bare.efl, "efl");
  close(covered.frontFocalZ, bare.frontFocalZ, "frontFocalZ");
  close(covered.frontPrincipalZ, bare.frontPrincipalZ, "frontPrincipalZ");
  // The principal point moves with the focus: the focal length is their distance.
  close(covered.rearPrincipalZ, bare.rearPrincipalZ + shift, "rearPrincipalZ");
  // The back focus is measured from the last lens vertex, so the plate lies inside it.
  close(covered.backFocus, bare.backFocus + shift, "backFocus");
  // Measured from the plate's rear face, as for a system without a rear plate, it would be shorter by the plate.
  const fromPlate = data([...lens, ...plate]).values;
  close(fromPlate.backFocus, covered.backFocus - (12 + t - 5), "backFocus from the last surface");
});

// ── Afocal systems ───────────────────────────────────────────────────────────────────────────────────────────────

test("a system without power has no first-order data: a plate, a window pair, a telescope", () => {
  assert.equal(firstOrder(input([at(0, Infinity, 1.5168), at(3, Infinity, 1)])), null);
  assert.equal(firstOrder(input([at(0, Infinity, 1)])), null);
  // A Keplerian and a Galilean telescope: the lenses are the sum of their focal lengths apart.
  assert.equal(firstOrder(input([...thinLens(0, 100), ...thinLens(150, 50)])), null);
  assert.equal(firstOrder(input([...thinLens(0, 100), ...thinLens(75, -25)])), null);
  // Thick lenses whose separation is found by the kernel's own focal points: the power left is rounding.
  const objective = [at(0, 91.3, 1.5168), at(7.7, -214.6, 1)];
  const eyepiece = [at(0, 19.4, 1.6204), at(4.1, -33.9, 1)];
  const [first, second] = [data(objective).values, data(eyepiece).values];
  const gap = first.rearFocalZ - second.frontFocalZ;
  const telescope = [...objective, ...eyepiece.map((surface) => ({ ...surface, z: surface.z + gap }))];
  const { total, powerScale } = systemMatrices(telescope, 0);
  assert.ok(total.c !== 0 && Math.abs(total.c) < 1e-15 * powerScale, `a residue of rounding: ${total.c}`);
  assert.equal(firstOrder(input(telescope)), null);
});

test("a weak lens is not afocal: only a power that is rounding against the surfaces' own is", () => {
  // Two surfaces of nearly opposite power: 1e-9 of them is left, a focal length of 4e10 mm.
  const weak = [at(0, 20, 1.5), at(0, 20 * (1 + 1e-9), 1)];
  const { total, powerScale } = systemMatrices(weak, 0);
  assert.ok(Math.abs(total.c) > AFOCAL_RELATIVE_POWER * powerScale);
  close(data(weak).values.efl, 1 / (0.5 * (1 / 20 - 1 / (20 * (1 + 1e-9)))), "efl", 1e-6);
  assert.equal(AFOCAL_RELATIVE_POWER, 1e-12);
});

// ── Pupils ───────────────────────────────────────────────────────────────────────────────────────────────────────

test("a stop in front of a lens is its own entrance pupil; the exit pupil is its image through the lens", () => {
  // A stop of radius 3 in air, 20 mm in front of a thin lens of f = 50, inside its focal length.
  const system = [at(0, Infinity, 1), ...thinLens(20, 50)];
  const { values } = data(system, { stopSemiDiameter: 3 });
  close(values.entrancePupilZ, 0, "entrancePupilZ");
  close(values.entrancePupilSemiDiameter, 3, "entrancePupilSemiDiameter");
  // 1/l' = 1/l + 1/f with l = -20: l' = -100/3, a virtual image in front of the lens, 5/3 times the size.
  close(values.exitPupilZ, 20 - 100 / 3, "exitPupilZ");
  close(values.exitPupilSemiDiameter, 5, "exitPupilSemiDiameter");

  // Beyond the focal length the image is real: l = -75 gives l' = 150, twice the size.
  const far = data([at(0, Infinity, 1), ...thinLens(75, 50)], { stopSemiDiameter: 3 }).values;
  close(far.exitPupilZ, 75 + 150, "far exitPupilZ");
  close(far.exitPupilSemiDiameter, 6, "far exitPupilSemiDiameter");
});

test("a stop behind a lens is its own exit pupil; the entrance pupil is its image through the lens, backwards", () => {
  // A thin lens of f = 50 at 0, and the stop 20 mm behind it.
  const system = [...thinLens(0, 50), at(20, Infinity, 1)];
  const { values } = data(system, { stopIndex: 2, stopSemiDiameter: 3 });
  close(values.exitPupilZ, 20, "exitPupilZ");
  close(values.exitPupilSemiDiameter, 3, "exitPupilSemiDiameter");
  // Seen from the front, the stop is 20 mm inside the lens of f = 50: a virtual image 100/3 behind the lens,
  // 5/3 times the size.
  close(values.entrancePupilZ, 100 / 3, "entrancePupilZ");
  close(values.entrancePupilSemiDiameter, 5, "entrancePupilSemiDiameter");
});

test("a stop inside a lens: both pupils are its images, through the glass in front of it and behind it", () => {
  // A stop between two thin lenses: f1 = 80 at 0, the stop at 10, f2 = 60 at 25.
  const split = [...thinLens(0, 80), at(10, Infinity, 1), ...thinLens(25, 60)];
  const { values } = data(split, { stopIndex: 2, stopSemiDiameter: 4 });
  // Forward through f2: l = -15, 1/l' = -1/15 + 1/60 = -1/20, so l' = -20 and the size is 4/3.
  close(values.exitPupilZ, 25 - 20, "exitPupilZ");
  close(values.exitPupilSemiDiameter, 4 * (4 / 3), "exitPupilSemiDiameter");
  // Backward through f1: the stop is 10 inside a lens of 80: 1/l' = -1/10 + 1/80 = -7/80, 8/7 times the size.
  close(values.entrancePupilZ, 80 / 7, "entrancePupilZ");
  close(values.entrancePupilSemiDiameter, 4 * (8 / 7), "entrancePupilSemiDiameter");

  // A stop inside an element: a plane in the glass of a thick lens, with the same glass on both sides.
  const n = 1.5168;
  const element = [at(0, 40, n), at(3, Infinity, n), at(8, -55, 1)];
  const inside = data(element, { stopIndex: 1 }).values;
  const byHand = pupilsByHand(element, 1);
  close(inside.entrancePupilZ, byHand.entrance.z, "inside: entrancePupilZ");
  close(inside.entrancePupilSemiDiameter, byHand.entrance.radius, "inside: entrancePupilSemiDiameter");
  close(inside.exitPupilZ, byHand.exit.z, "inside: exitPupilZ");
  close(inside.exitPupilSemiDiameter, byHand.exit.radius, "inside: exitPupilSemiDiameter");
  // Written out for the front: the stop is 3 mm deep in glass behind a surface of power (n - 1) / 40.
  const depth = 1 / (n / 3 - (n - 1) / 40);
  close(inside.entrancePupilZ, depth, "inside: the apparent depth of the stop");
  close(inside.entrancePupilSemiDiameter, (n * depth) / 3, "inside: its apparent size");
});

test("a stop on a refracting surface is not moved by that surface: on the first it is the entrance pupil", () => {
  const lens = [at(0, 50, 1.5168), at(4, -50, 1)];
  const onFirst = data(lens, { stopIndex: 0, stopSemiDiameter: 5 }).values;
  close(onFirst.entrancePupilZ, 0, "entrancePupilZ");
  close(onFirst.entrancePupilSemiDiameter, 5, "entrancePupilSemiDiameter");
  const first = pupilsByHand(lens, 0);
  close(onFirst.exitPupilZ, first.exit.z, "exitPupilZ");
  close(onFirst.exitPupilSemiDiameter, 5 * first.exit.radius, "exitPupilSemiDiameter");

  // On the last surface it is the exit pupil, and the entrance pupil is its image through the first.
  const onLast = data(lens, { stopIndex: 1, stopSemiDiameter: 5 }).values;
  close(onLast.exitPupilZ, 4, "last: exitPupilZ");
  close(onLast.exitPupilSemiDiameter, 5, "last: exitPupilSemiDiameter");
  const last = pupilsByHand(lens, 1);
  close(onLast.entrancePupilZ, last.entrance.z, "last: entrancePupilZ");
  close(onLast.entrancePupilSemiDiameter, 5 * last.entrance.radius, "last: entrancePupilSemiDiameter");

  // The matrices say the same: the identity in front of a first-surface stop and behind a last-surface one.
  const identity = { a: 1, b: 0, c: 0, d: 1 };
  assert.deepEqual(systemMatrices(lens, 0).front, identity);
  assert.deepEqual(systemMatrices(lens, 1).rear, identity);
  // And a system matrix has determinant 1, as has each part of it.
  for (const matrix of Object.values(systemMatrices(lens, 1)).filter((value) => typeof value === "object")) {
    close(matrix.a * matrix.d - matrix.b * matrix.c, 1, "determinant");
  }
});

test("in a six-surface lens the pupils are the Gaussian images of the stop, whichever surface carries it", () => {
  const lens = [
    at(0, 38.2, 1.6204),
    at(5.1, -212.5, 1),
    at(9.7, -44.6, 1.6727),
    at(11.2, 36.9, 1),
    at(17.9, 151.3, 1.6204),
    at(22.4, -33.8, 1),
  ];
  for (let stopIndex = 0; stopIndex < lens.length; stopIndex++) {
    const { values } = data(lens, { stopIndex, stopSemiDiameter: 2.5 });
    const { entrance, exit } = pupilsByHand(lens, stopIndex);
    const name = `stop on surface ${stopIndex}`;
    close(values.entrancePupilZ, entrance.z, `${name}: entrancePupilZ`, 1e-12);
    close(values.entrancePupilSemiDiameter, 2.5 * entrance.radius, `${name}: entrancePupilSemiDiameter`, 1e-12);
    close(values.exitPupilZ, exit.z, `${name}: exitPupilZ`, 1e-12);
    close(values.exitPupilSemiDiameter, 2.5 * exit.radius, `${name}: exitPupilSemiDiameter`, 1e-12);
  }
  // The focal points do not depend on where the stop is.
  const [first, last] = [data(lens, { stopIndex: 0 }).values, data(lens, { stopIndex: 5 }).values];
  for (const name of ["efl", "frontFocalZ", "rearFocalZ", "frontPrincipalZ", "rearPrincipalZ", "backFocus"] as const) {
    assert.equal(first[name], last[name], name);
  }
});

test("a stop in the front focal plane of what follows it has its exit pupil at infinity", () => {
  // The stop 50 mm in front of a thin lens of f = 50: image-space telecentric.
  const { values } = data([at(0, Infinity, 1), ...thinLens(50, 50)], { stopSemiDiameter: 2 });
  assert.equal(Math.abs(values.exitPupilZ), Infinity);
  assert.equal(values.exitPupilSemiDiameter, Infinity);
  assert.equal(values.entrancePupilZ, 0);
  // And the mirror image of it: object-space telecentric.
  const mirrored = data([...thinLens(0, 50), at(50, Infinity, 1)], { stopIndex: 2, stopSemiDiameter: 2 }).values;
  assert.equal(Math.abs(mirrored.entrancePupilZ), Infinity);
  assert.equal(mirrored.entrancePupilSemiDiameter, Infinity);
  assert.equal(mirrored.exitPupilZ, 50);
});

// ── What a paraxial ray sees of a surface ────────────────────────────────────────────────────────────────────────

test("the vertex curvature is the base curvature plus twice a term of power 2, and nothing else of the shape", () => {
  const curvatureOf = (shape: Parameters<typeof profileOf>[0]): number | null => vertexCurvature(profileOf(shape));
  assert.equal(curvatureOf({ kind: "plane" }), 0);
  assert.equal(curvatureOf({ kind: "conic", radius: 40, conic: 0 }), 1 / 40);
  // The conic constant bends the surface only from the fourth order on.
  assert.equal(curvatureOf({ kind: "conic", radius: 40, conic: -3.5 }), 1 / 40);
  const higher = [
    { power: 3, coeff: 2e-4 },
    { power: 4, coeff: -1e-5 },
    { power: 20, coeff: 1e-30 },
  ];
  assert.equal(curvatureOf({ kind: "asphere", radius: -25, conic: -1, terms: higher }), 1 / -25);
  assert.equal(curvatureOf({ kind: "asphere", radius: null, conic: 0, terms: higher }), 0);
  // a r^2 is, near the axis, a sphere of radius 1 / (2a).
  const parabolic = [{ power: 2, coeff: 0.0125 }, ...higher];
  assert.equal(curvatureOf({ kind: "asphere", radius: null, conic: 0, terms: parabolic }), 0.025);
  assert.equal(curvatureOf({ kind: "asphere", radius: 40, conic: 0, terms: parabolic }), 1 / 40 + 0.025);
  // A cone has no curvature at its apex; a coefficient of 0 is no term.
  assert.equal(curvatureOf({ kind: "asphere", radius: 40, conic: 0, terms: [{ power: 1, coeff: 1e-3 }] }), null);
  assert.equal(
    curvatureOf({
      kind: "asphere",
      radius: 40,
      conic: 0,
      terms: [
        { power: 1, coeff: 0 },
        { power: 4, coeff: 1e-6 },
      ],
    }),
    1 / 40,
  );
});

// ── Finite objects ───────────────────────────────────────────────────────────────────────────────────────────────

test("an object at infinity has no magnification; a finite one has that of Gaussian imaging", () => {
  const lens = thinLens(0, 50);
  assert.equal(data(lens).magnification, null);
  // At twice the focal length the image is as large as the object, upside down.
  close(data(lens, { objectZ: -100 }).magnification ?? NaN, -1, "2f");
  // At 75: 1/l' = 1/50 - 1/75 = 1/150, so the image is twice the size.
  close(data(lens, { objectZ: -75 }).magnification ?? NaN, -2, "1.5f");
  // Inside the focal length the image is virtual and upright: l = -25 gives l' = -50.
  close(data(lens, { objectZ: -25 }).magnification ?? NaN, 2, "f/2");
  // A thick system, against the hand imaging.
  const doublet = [at(0, 61.47, 1.5168), at(6, -43.47, 1.6727), at(8.5, -124.6, 1)];
  close(data(doublet, { objectZ: -400 }).magnification ?? NaN, imaged(doublet, -400).magnification, "doublet");
  // The object distance changes nothing but the magnification.
  const [near, far] = [data(doublet, { objectZ: -400 }).values, data(doublet).values];
  for (const name of FIRST_ORDER_VALUES) assert.equal(near[name], far[name], name);
});
