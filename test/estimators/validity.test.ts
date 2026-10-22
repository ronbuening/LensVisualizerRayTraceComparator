// The masks that cut every engine's bundle down to the same rays.
import assert from "node:assert/strict";
import { test } from "node:test";

import { RAY_STATUS } from "../../src/contract/quantities/raysTrace.ts";
import { geometricOtf } from "../../src/estimators/geometricOtf.ts";
import { countValid, intersectValidity, maskWhere } from "../../src/estimators/validity.ts";

test("a mask of a status is the rays that have it", () => {
  // The status of a trace: 0 ok, 1 blocked, 2 failed.
  const status = Uint8Array.of(0, 1, 0, 2, 0, 0);
  assert.deepEqual(maskWhere(status, RAY_STATUS.ok), Uint8Array.of(1, 0, 1, 0, 1, 1));
  assert.deepEqual(maskWhere(status, RAY_STATUS.blocked), Uint8Array.of(0, 1, 0, 0, 0, 0));
  assert.deepEqual(maskWhere([0, NaN, -0, 0.5], 0), Uint8Array.of(1, 0, 1, 0));
  assert.deepEqual(maskWhere([], 0), new Uint8Array(0));
  assert.equal(countValid(maskWhere(status, RAY_STATUS.ok)), 4);
});

test("the rays valid in every engine are those no engine lost", () => {
  // Three engines on six rays: each lost another ray, and two of them the same one.
  const lv = maskWhere(Uint8Array.of(0, 1, 0, 0, 0, 0), RAY_STATUS.ok);
  const ref = maskWhere(Uint8Array.of(0, 1, 0, 2, 0, 0), RAY_STATUS.ok);
  const optiland = maskWhere(Uint8Array.of(0, 0, 0, 0, 0, 1), RAY_STATUS.ok);
  const every = intersectValidity([lv, ref, optiland]);
  assert.deepEqual(every, Uint8Array.of(1, 0, 1, 0, 1, 0));
  assert.equal(countValid(every), 3);
  // The order of the engines is no part of it, and a mask is left as it was.
  assert.deepEqual(intersectValidity([optiland, lv, ref]), every);
  assert.deepEqual(lv, Uint8Array.of(1, 0, 1, 1, 1, 1));
  // One mask is itself, as 0 and 1; a mask of anything that is not 0 takes its ray, and NaN takes none.
  assert.deepEqual(intersectValidity([ref]), ref);
  assert.deepEqual(intersectValidity([[2, 0, -1, NaN, 0.5]]), Uint8Array.of(1, 0, 1, 0, 1));
  assert.deepEqual(intersectValidity([[], []]), new Uint8Array(0));
  // Masks of different lengths are not of the same rays, and no mask at all is of no rays that could be counted.
  assert.throws(() => intersectValidity([lv, Uint8Array.of(1, 1)]), /array 1 has 2 rays and array 0 6/);
  assert.throws(() => intersectValidity([]), RangeError);
});

test("one estimator on the same subset: a masked bundle is the bundle of the rays the mask takes", () => {
  // Two engines land the same five rays a rounding apart, and each lost one the other kept.
  const first = { x: [0.001, NaN, -0.002, 0.004, 0.0005], y: [0.003, NaN, 0.001, -0.002, 0], status: [0, 1, 0, 0, 0] };
  const second = {
    x: [0.001, 0.0031, -0.002, NaN, 0.0005],
    y: [0.003, 0.0007, 0.001, NaN, 0],
    status: [0, 0, 0, 2, 0],
  };
  const weight = [1, 1, 0.5, 0.25, 0];
  const valid = intersectValidity([first, second].map(({ status }) => maskWhere(status, RAY_STATUS.ok)));
  assert.deepEqual(valid, Uint8Array.of(1, 0, 1, 0, 1));
  const frequencies = [10, 30];
  const [a, b] = [first, second].map(({ x, y }) => geometricOtf({ x, y, weight, valid }, { x: 0, y: 0 }, frequencies));
  assert.ok(a.available && b.available);
  // The rays both kept land at the same points here: the two transfer functions are the same bits, and are of the
  // three rays alone, the last of which weighs nothing.
  assert.deepEqual(a, b);
  assert.deepEqual(
    a,
    geometricOtf({ x: [0.001, -0.002], y: [0.003, 0.001], weight: [1, 0.5] }, { x: 0, y: 0 }, frequencies),
  );
  assert.deepEqual([a.rays, a.flux], [2, 1.5]);
  // Each on its own rays would have been another sum, of another bundle.
  const own = geometricOtf(
    { ...first, weight, valid: maskWhere(first.status, RAY_STATUS.ok) },
    { x: 0, y: 0 },
    frequencies,
  );
  assert.ok(own.available && own.rays === 3 && own.sagittal.real[1] !== a.sagittal.real[1]);
});
