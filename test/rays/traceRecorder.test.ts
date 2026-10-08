// The recorder every engine of the comparator writes a `rays.trace` answer with: NaN from where a ray ended, and
// one landing rule for all.
import assert from "node:assert/strict";
import { test } from "node:test";

import { decodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../src/core/numeric/ndarray.ts";
import { IMAGE_PLANE_TOLERANCE_MM } from "../../src/estimators/imageProjection.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import { createTraceRecorder } from "../../src/rays/traceRecorder.ts";

function values(wire: NdArrayWire): number[] {
  return [...decodeNdArray(wire).values];
}

test("a recorder gives valid data for every way a ray ends, and counts the rays", () => {
  // Four rays through two surfaces, with the image plane at z = 10.
  const recorder = createTraceRecorder(4, 2, 10);
  // Ray 0 lands: it leaves the last surface at z = 6 along (0, 0.6, 0.8), in a medium of index 1.5.
  recorder.hit(0, 0, [0, 1, 0]);
  recorder.hit(0, 1, [0, 2, 6]);
  assert.equal(recorder.exit(0, [0, 2, 6], [0, 0.6, 0.8], 9.5, 1.5), "ok");
  // Ray 1 is blocked at the second surface, ray 2 failed at the first.
  recorder.hit(1, 0, [3, 0, 0.25]);
  recorder.stop(1, "blocked", 1);
  recorder.stop(2, "failed", 0);
  // Ray 3 passed both surfaces and travels away from the image plane.
  recorder.hit(3, 0, [0, -1, 0]);
  recorder.hit(3, 1, [0, -2, 6]);
  assert.equal(recorder.exit(3, [0, -2, 6], [0, 0.6, -0.8], 8.25, 1), "blocked");

  const { data, counts } = recorder.finish();
  assert.deepEqual(raysTraceQuantity.validateData(data), []);
  assert.deepEqual(counts, { rays: 4, ok: 1, blocked: 2, failed: 1 });
  assert.deepEqual(values(data.status), [0, 1, 2, 1]);
  // -1 for the ray that landed; the number of surfaces for the one that passed them all and does not land.
  assert.deepEqual(values(data.endSurface), [-1, 1, 0, 2]);
  assert.deepEqual(data.hits.$nd.shape, [2, 4, 3]);
  const hits = values(data.hits);
  assert.deepEqual(hits.slice(0, 3), [0, 1, 0]);
  assert.deepEqual(hits.slice(3, 6), [3, 0, 0.25]);
  // What was never written is NaN: the hit of a ray on the surface it ended at, and on every one behind it.
  assert.ok(hits.slice(6, 9).every(Number.isNaN) && hits.slice(15, 18).every(Number.isNaN));
  // The landing: 4 mm of z at 0.8 a millimetre is 5 mm along the ray, 3 mm up, and 1.5 * 5 of path.
  assert.deepEqual(values(data.imagePoint).slice(0, 3), [0, 5, 10]);
  assert.deepEqual(values(data.opticalPathToImage), [9.5 + 1.5 * 5, NaN, NaN, NaN]);
  assert.deepEqual(values(data.opticalPath), [9.5, NaN, NaN, 8.25]);
  // The ray that does not land keeps its exit, and has no image point.
  assert.deepEqual(values(data.exitPoint).slice(9), [0, -2, 6]);
  assert.deepEqual(values(data.exitDirection).slice(9), [0, 0.6, -0.8]);
  assert.ok(values(data.imagePoint).slice(3).every(Number.isNaN));
});

test("an exit within the image plane's tolerance behind it lands where it is; one beyond it does not land", () => {
  const recorder = createTraceRecorder(3, 1, 5);
  recorder.hit(0, 0, [1, 2, 5]);
  recorder.hit(1, 0, [1, 2, 5 + IMAGE_PLANE_TOLERANCE_MM / 2]);
  recorder.hit(2, 0, [1, 2, 5 + 3 * IMAGE_PLANE_TOLERANCE_MM]);
  assert.equal(recorder.exit(0, [1, 2, 5], [0, 0, 1], 7, 1), "ok");
  assert.equal(recorder.exit(1, [1, 2, 5 + IMAGE_PLANE_TOLERANCE_MM / 2], [0, 0, 1], 7, 1), "ok");
  assert.equal(recorder.exit(2, [1, 2, 5 + 3 * IMAGE_PLANE_TOLERANCE_MM], [0, 0, 1], 7, 1), "blocked");
  const { data, counts } = recorder.finish();
  assert.deepEqual(raysTraceQuantity.validateData(data), []);
  assert.deepEqual(counts, { rays: 3, ok: 2, blocked: 1, failed: 0 });
  // On the plane, and a hair behind it: the landing is the exit point's x and y on the plane's z, at no distance.
  assert.deepEqual(values(data.imagePoint).slice(0, 6), [1, 2, 5, 1, 2, 5]);
  assert.deepEqual(values(data.opticalPathToImage).slice(0, 2), [7, 7]);
  assert.deepEqual(values(data.endSurface), [-1, -1, 1]);
});

test("the counts of a recorder are its own: a later ray does not change what was returned", () => {
  const recorder = createTraceRecorder(2, 1, 1);
  recorder.stop(0, "blocked", 0);
  const first = recorder.finish().counts;
  recorder.stop(1, "failed", 0);
  assert.deepEqual(first, { rays: 2, ok: 0, blocked: 1, failed: 0 });
  assert.deepEqual(recorder.finish().counts, { rays: 2, ok: 0, blocked: 1, failed: 1 });
});
