// The image projection: a ray behind the last surface carried to the image plane, by arithmetic that is the same
// bits everywhere.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  IMAGE_PLANE_TOLERANCE_MM,
  continuedOpticalPath,
  projectToImagePlane,
} from "../../src/estimators/imageProjection.ts";

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
