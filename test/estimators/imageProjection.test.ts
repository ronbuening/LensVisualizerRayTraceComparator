// The image projection: a ray behind the last surface carried to the image plane, by arithmetic that is the same
// bits everywhere.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  IMAGE_PLANE_TOLERANCE_MM,
  continuedOpticalPath,
  projectToImagePlane,
} from "../../src/estimators/imageProjection.ts";
import { compare, dyadicOf, plus, series, times, ulp } from "./support.ts";

test("a ray lands where its line meets the plane: one division, then one multiplication and addition a component", () => {
  // The 3-4-5 direction: 4 mm along z is 5 mm along the ray and 3 mm toward -y.
  const landing = projectToImagePlane([1, 2, 10], [0, -0.6, 0.8], 14);
  assert.ok(landing !== null);
  assert.deepEqual(landing.point, [1, 2 + ((14 - 10) / 0.8) * -0.6, 14]);
  assert.equal(landing.distance, (14 - 10) / 0.8);
  assert.equal(landing.distance, 5);
  assert.ok(Math.abs(landing.point[1] - -1) < 1e-15);

  // A ray along the axis lands at its own x and y, any distance away.
  assert.deepEqual(projectToImagePlane([0.25, -0.5, 3], [0, 0, 1], 103), { point: [0.25, -0.5, 103], distance: 100 });
  // The z of a landing is the plane's z itself, never a sum that rounds beside it.
  const far = projectToImagePlane(
    [0.1, 0.2, 0.3],
    [0.1 / Math.hypot(0.1, 0.2, 1), 0.2 / Math.hypot(0.1, 0.2, 1), 1 / Math.hypot(0.1, 0.2, 1)],
    77.7,
  );
  assert.equal(far?.point[2], 77.7);
});

test("a skew ray moves in x and in y by its direction, independently", () => {
  const norm = Math.hypot(0.02, -0.03, 1);
  const direction = [0.02 / norm, -0.03 / norm, 1 / norm] as const;
  const landing = projectToImagePlane([5, 6, 40], direction, 90);
  assert.ok(landing !== null);
  // The slopes dx/dz and dy/dz are 0.02 and -0.03 over 50 mm.
  assert.ok(Math.abs(landing.point[0] - 6) < 1e-13 && Math.abs(landing.point[1] - 4.5) < 1e-13);
  assert.ok(Math.abs(landing.distance - 50 * norm) < 1e-12);
  // Equal inputs give equal bits.
  assert.deepEqual(projectToImagePlane([5, 6, 40], direction, 90), landing);
});

test("an exit point on the plane, or within the tolerance behind it, lands where it is", () => {
  assert.equal(IMAGE_PLANE_TOLERANCE_MM, 1e-9);
  const direction = [0, 0.6, 0.8] as const;
  // On the plane exactly: no distance at all.
  assert.deepEqual(projectToImagePlane([1, 2, 50], direction, 50), { point: [1, 2, 50], distance: 0 });
  // A rounding behind it, as the rear face of a plate that is the image plane leaves a hit: still on the plane.
  for (const beyond of [1e-15, 1e-12, 7e-10]) {
    const landing = projectToImagePlane([1, 2, 50 + beyond], direction, 50);
    assert.deepEqual(landing, { point: [1, 2, 50], distance: 0 }, String(beyond));
    assert.ok(Object.is(landing?.distance, 0), "the distance is 0, not -0");
  }
  // The tolerance is along the ray: 0.8e-9 mm of z is 1e-9 mm of this ray.
  assert.ok(projectToImagePlane([1, 2, 50 + 0.79e-9], direction, 50) !== null);
  assert.equal(projectToImagePlane([1, 2, 50 + 0.81e-9], direction, 50), null);
  // A rounding in front of it is a distance like any other.
  const short = projectToImagePlane([1, 2, 50 - 1e-12], direction, 50);
  assert.ok(short !== null && short.distance > 0 && short.distance < 2e-12);
});

test("a ray that does not arrive has no landing", () => {
  // The plane lies behind the exit point.
  assert.equal(projectToImagePlane([0, 0, 60], [0, 0, 1], 50), null);
  assert.equal(projectToImagePlane([0, 0, 50.001], [0, 0.6, 0.8], 50), null);
  // The ray does not travel toward +z: parallel to the plane, or away from it, even with the plane "ahead".
  assert.equal(projectToImagePlane([0, 0, 40], [0, 1, 0], 50), null);
  assert.equal(projectToImagePlane([0, 0, 40], [0, 1, -0], 50), null);
  assert.equal(projectToImagePlane([0, 0, 60], [0, 0.6, -0.8], 50), null);
  // Nothing that is not a number lands.
  assert.equal(projectToImagePlane([NaN, 0, 40], [0, 0, 1], 50), null);
  assert.equal(projectToImagePlane([0, 0, NaN], [0, 0, 1], 50), null);
  assert.equal(projectToImagePlane([0, 0, 40], [0, NaN, 1], 50), null);
  assert.equal(projectToImagePlane([0, 0, 40], [0, 0, NaN], 50), null);
  assert.equal(projectToImagePlane([0, 0, 40], [0, 0, 1], NaN), null);
  assert.equal(projectToImagePlane([0, 0, 40], [0, 0, 1], Infinity), null);
  // A ray that grazes the plane's direction lands far away, and finitely.
  const grazing = projectToImagePlane([0, 0, 40], [0, Math.sqrt(1 - 1e-12), 1e-6], 50);
  assert.ok(grazing !== null && grazing.point[1] > 9.9e6 && Number.isFinite(grazing.distance));
});

test("the optical path continues by the index times the distance", () => {
  assert.equal(continuedOpticalPath(16.0672, 1, 96), 16.0672 + 96);
  assert.equal(continuedOpticalPath(10, 1.5, 4), 16);
  assert.equal(continuedOpticalPath(10, 1.5168, 0), 10);
  // One multiplication and one addition, in that order.
  const [path, index, distance] = [123.4375, 1.00029, 0.7025];
  assert.equal(continuedOpticalPath(path, index, distance), path + index * distance);
});

test("the distance of a landing is a length, whatever the length of the direction", () => {
  // The same line held by a direction twice as long: half the parameter, the same landing, the same 5 mm.
  const doubled = projectToImagePlane([1, 2, 10], [0, -1.2, 1.6], 14);
  assert.deepEqual(doubled?.point, projectToImagePlane([1, 2, 10], [0, -0.6, 0.8], 14)?.point);
  assert.equal(doubled?.distance, 5);
  // Whole numbers: along (0, 3, 4) the plane 4 mm ahead is at the parameter 1, 5 mm away, 3 mm up.
  assert.deepEqual(projectToImagePlane([0, 0, 0], [0, 3, 4], 4), { point: [0, 3, 4], distance: 5 });
  assert.deepEqual(projectToImagePlane([0, 0, 0], [0.75, 0, 1], 8), { point: [6, 0, 8], distance: 10 });
  // Along the axis the distance is the gap, however long or short the direction is.
  for (const length of [2, 0.5, 2 ** -30, 2 ** 40]) {
    assert.deepEqual(projectToImagePlane([0, 0, 1], [0, 0, length], 4), { point: [0, 0, 4], distance: 3 }, `${length}`);
  }
  // A direction longer than a unit vector by 2^-40, some 1e-12: the limit the contract sets for a given ray. The
  // plane 3 (1 + 2^-40) mm ahead is at the parameter 3 exactly, and that far away: 2.7e-12 mm more than 3.
  const long = 1 + 2 ** -40;
  const landing = projectToImagePlane([0, 0, 0], [0, 0, long], 3 * long);
  assert.equal((3 * long) / long, 3);
  assert.equal(landing?.distance, 3 * long);
  assert.notEqual(landing?.distance, 3);
  // Which rays land is decided as before, and as LensVisualizer's own landing decides it: by the parameter of the
  // line, which is a millimetre of the ray for a unit vector. A direction twice as long has the plane 1.5e-9 mm of
  // z behind it at the parameter -0.94e-9, within the tolerance, and 1.7e-9 mm at -1.06e-9, beyond it.
  assert.deepEqual(projectToImagePlane([1, 2, 50 + 1.5e-9], [0, 1.2, 1.6], 50), { point: [1, 2, 50], distance: 0 });
  assert.equal(projectToImagePlane([1, 2, 50 + 1.7e-9], [0, 1.2, 1.6], 50), null);
});

test("the distance is the length of the stretch to one rounding, for a direction that is a unit vector only nearly", () => {
  // The length of the stretch is the parameter t times the length of the direction d, and t^2 (d.d) is a fraction
  // of whole numbers that BigInt holds exactly. The distance is within half a unit of its last place of the
  // length, and a thousandth more for the roundings behind the last one, when the square of the distance less
  // that much, and of the distance plus that much, lie on either side of t^2 (d.d).
  const within = (distance: number, t: number, d: readonly number[], units: number): boolean => {
    const squared = times(
      times(dyadicOf(t), dyadicOf(t)),
      plus(...d.map((component) => times(dyadicOf(component), dyadicOf(component)))),
    );
    const margin = times(dyadicOf(ulp(distance)), dyadicOf(units));
    const low = plus(dyadicOf(distance), times(margin, dyadicOf(-1)));
    const high = plus(dyadicOf(distance), margin);
    return compare(times(low, low), squared) <= 0 && compare(squared, times(high, high)) <= 0;
  };
  const next = series(20261009);
  let plainIsWorse = 0;
  let moved = 0;
  for (let sample = 0; sample < 400; sample++) {
    // A direction made a unit vector in doubles, as an engine makes one, and in every fourth sample left longer or
    // shorter than one by up to 1e-12, as the contract lets a given direction be.
    const [a, b] = [next() - 0.5, next() - 0.5];
    const norm = Math.sqrt(a * a + b * b + 1);
    const scale = sample % 4 === 0 ? 1 + (next() - 0.5) * 2e-12 : 1;
    const direction = [(a / norm) * scale, (b / norm) * scale, (1 / norm) * scale] as const;
    const point = [next() * 20 - 10, next() * 20 - 10, next() * 50] as const;
    const imageZ = point[2] + 1 + next() * 80;
    const landing = projectToImagePlane(point, direction, imageZ);
    assert.ok(landing !== null);
    const t = (imageZ - point[2]) / direction[2];
    assert.ok(within(landing.distance, t, direction, 0.501), `sample ${sample}: ${landing.distance}`);
    // The plain product of the parameter and a square root rounds three times more, and is the worse for it.
    const plain = t * Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
    if (!within(plain, t, direction, 0.501)) plainIsWorse++;
    // The parameter itself is the length only where the direction is a unit vector to the last place of both.
    if (landing.distance !== t) moved++;
    assert.ok(Math.abs(landing.distance - t) <= (scale === 1 ? 2 : 1e4) * ulp(t), `sample ${sample}`);
  }
  assert.ok(plainIsWorse > 0 && moved > 0, `${plainIsWorse} and ${moved}`);
});

test("a direction that is a unit vector exactly gives the parameter itself for the distance, in every bit", () => {
  // The squares of these add up to 1 without rounding: an axis, and 3-4-5 over a power of two short of one.
  for (const direction of [
    [0, 0, 1],
    [0.6, 0, 0.8],
    [0, -0.6, 0.8],
  ] as const) {
    for (const [z, imageZ] of [
      [10, 14],
      [0.1, 77.7],
      [-3.25, 1e7],
      [40, 40],
    ] as const) {
      const landing = projectToImagePlane([1, 2, z], direction, imageZ);
      assert.ok(landing !== null && Object.is(landing.distance, (imageZ - z) / direction[2]), `${direction} from ${z}`);
    }
  }
  // 0.6 and 0.8 as doubles are a unit vector to 2.2e-17, a tenth of a rounding of 1: no distance shows it.
  const [p, q] = [dyadicOf(0.6), dyadicOf(0.8)];
  const excess = plus(times(p, p), times(q, q), dyadicOf(-1));
  assert.ok(compare(excess, dyadicOf(0)) > 0 && compare(excess, dyadicOf(2 ** -54)) < 0);
});
