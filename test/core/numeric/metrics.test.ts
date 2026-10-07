import assert from "node:assert/strict";
import { test } from "node:test";

import { maxAbsDiff, maxPointDistance, maxRelDiff, rmsDiff } from "../../../src/core/numeric/metrics.ts";

function throwsMessage(run: () => unknown, message: string): void {
  assert.throws(run, (error: unknown) => error instanceof Error && error.message === message, message);
}

test("maxAbsDiff reports the largest absolute difference and where it is", () => {
  assert.deepEqual(maxAbsDiff([1, 2, 3], [1, 2.5, 2]), { value: 1, index: 2 });
  assert.deepEqual(maxAbsDiff([1, -4, 3], [1, 2.5, 2]), { value: 6.5, index: 1 });
  assert.deepEqual(maxAbsDiff([-7], [7]), { value: 14, index: 0 });
  assert.deepEqual(maxAbsDiff([0.1 + 0.2], [0.3]), { value: 5.551115123125783e-17, index: 0 });
});

test("maxAbsDiff is symmetric and accepts typed arrays alongside plain ones", () => {
  const a = Float64Array.of(1, 2, 3, 4);
  const b = [1, 2, 3.25, 3.5];
  assert.deepEqual(maxAbsDiff(a, b), { value: 0.5, index: 3 });
  assert.deepEqual(maxAbsDiff(b, a), { value: 0.5, index: 3 });
  assert.deepEqual(maxAbsDiff(Int32Array.of(5, -5), Int32Array.of(5, 5)), { value: 10, index: 1 });
});

test("maxAbsDiff keeps the first index on a tie and reports index 0 for equal arrays", () => {
  assert.deepEqual(maxAbsDiff([0, 1, 0, -1], [0, 0, 0, 0]), { value: 1, index: 1 });
  assert.deepEqual(maxAbsDiff([4, 5, 6], [4, 5, 6]), { value: 0, index: 0 });
  // 0 and -0 do not differ, and the value is +0.
  const zeros = maxAbsDiff([-0, 0], [0, -0]);
  assert.ok(Object.is(zeros.value, 0));
  assert.equal(zeros.index, 0);
});

test("empty inputs give value 0 at index -1", () => {
  assert.deepEqual(maxAbsDiff([], []), { value: 0, index: -1 });
  assert.deepEqual(maxAbsDiff(new Float64Array(0), []), { value: 0, index: -1 });
  assert.deepEqual(maxRelDiff([], [], 1e-9), { value: 0, index: -1 });
  assert.deepEqual(maxPointDistance([], []), { value: 0, index: -1 });
  assert.equal(rmsDiff([], []), 0);
});

test("a length mismatch throws, naming both lengths", () => {
  throwsMessage(() => maxAbsDiff([1, 2], [1, 2, 3]), "maxAbsDiff: length mismatch (2 and 3)");
  throwsMessage(() => maxAbsDiff([], [0]), "maxAbsDiff: length mismatch (0 and 1)");
  throwsMessage(() => maxRelDiff([1], [], 1e-9), "maxRelDiff: length mismatch (1 and 0)");
  throwsMessage(() => rmsDiff(new Float64Array(4), new Float64Array(3)), "rmsDiff: length mismatch (4 and 3)");
  throwsMessage(() => maxPointDistance([0, 0, 0], [0, 0, 0, 1, 1, 1]), "maxPointDistance: length mismatch (3 and 6)");
});

test("a NaN in either input makes maxAbsDiff NaN at the first NaN, whatever else differs", () => {
  assert.deepEqual(maxAbsDiff([1, NaN, 100], [1, 1, 1]), { value: NaN, index: 1 });
  assert.deepEqual(maxAbsDiff([1, 1, 100], [1, NaN, 1]), { value: NaN, index: 1 });
  assert.deepEqual(maxAbsDiff([NaN], [NaN]), { value: NaN, index: 0 });
  // A larger difference before or after the NaN does not hide it.
  assert.deepEqual(maxAbsDiff([1e9, 0, NaN], [0, 0, 0]), { value: NaN, index: 2 });
  assert.deepEqual(maxAbsDiff([Infinity, NaN], [0, 0]), { value: NaN, index: 1 });
  // Several NaNs: the first one, from whichever input.
  assert.deepEqual(maxAbsDiff([0, 0, NaN, NaN], [0, NaN, 0, NaN]), { value: NaN, index: 1 });
  assert.deepEqual(maxAbsDiff(Float64Array.of(0, NaN), Float64Array.of(0, 0)), { value: NaN, index: 1 });
});

test("maxAbsDiff follows IEEE arithmetic for infinities", () => {
  assert.deepEqual(maxAbsDiff([1, Infinity], [1, 5]), { value: Infinity, index: 1 });
  assert.deepEqual(maxAbsDiff([-Infinity, 0], [Infinity, 9]), { value: Infinity, index: 0 });
  // Two infinite differences tie; the first is kept.
  assert.deepEqual(maxAbsDiff([Infinity, Infinity], [0, 0]), { value: Infinity, index: 0 });
  // Equal infinities have no defined difference: NaN, not a silent 0.
  assert.deepEqual(maxAbsDiff([0, Infinity], [0, Infinity]), { value: NaN, index: 1 });
  assert.deepEqual(maxAbsDiff([-Infinity], [-Infinity]), { value: NaN, index: 0 });
});

test("maxRelDiff divides by the larger magnitude, with the floor as the least divisor", () => {
  assert.deepEqual(maxRelDiff([100, 1e-12], [101, 2e-12], 1e-9), { value: 1 / 101, index: 0 });
  assert.deepEqual(maxRelDiff([2, 4], [1, 4], 1e-9), { value: 0.5, index: 0 });
  assert.deepEqual(maxRelDiff([-3], [1], 1e-9), { value: 4 / 3, index: 0 });

  // Below the floor the measure is the absolute difference in units of the floor.
  const small = maxRelDiff([0, 1e-12, 0], [0, 3e-12, 0], 1e-9);
  assert.deepEqual(small, { value: Math.abs(1e-12 - 3e-12) / 1e-9, index: 1 });
  assert.ok(small.value > 0.0019 && small.value < 0.0021);
  assert.deepEqual(maxRelDiff([0, 0], [0, 0], 1e-9), { value: 0, index: 0 });
  assert.deepEqual(maxRelDiff([0], [1e-30], 1), { value: 1e-30, index: 0 });
});

test("maxRelDiff is symmetric and can pick a different element than maxAbsDiff", () => {
  const a = [1000, 1];
  const b = [1001, 1.5];
  assert.deepEqual(maxAbsDiff(a, b), { value: 1, index: 0 });
  assert.deepEqual(maxRelDiff(a, b, 1e-9), { value: 0.5 / 1.5, index: 1 });
  assert.deepEqual(maxRelDiff(b, a, 1e-9), maxRelDiff(a, b, 1e-9));
  // A large floor turns the measure back into a scaled absolute difference.
  assert.deepEqual(maxRelDiff(a, b, 1e6), { value: 1e-6, index: 0 });
});

test("maxRelDiff keeps the first index on a tie", () => {
  assert.deepEqual(maxRelDiff([1, 2, 4], [2, 4, 8], 1e-9), { value: 0.5, index: 0 });
});

test("maxRelDiff requires a positive finite floor", () => {
  for (const floor of [0, -0, -1e-9, NaN, Infinity, -Infinity]) {
    assert.throws(
      () => maxRelDiff([1], [1], floor),
      (error: unknown) =>
        error instanceof RangeError &&
        error.message === `maxRelDiff: absFloor must be a positive finite number, got ${floor}`,
    );
  }
  // The floor is checked even when there is nothing to compare.
  assert.throws(() => maxRelDiff([], [], 0), RangeError);
});

test("maxRelDiff is NaN at the first NaN or infinite element", () => {
  assert.deepEqual(maxRelDiff([1, NaN, 100], [1, 1, 1], 1e-9), { value: NaN, index: 1 });
  assert.deepEqual(maxRelDiff([1, 1, 100], [2, 1, NaN], 1e-9), { value: NaN, index: 2 });
  // ∞ / ∞ is undefined, so an infinity is reported as NaN rather than given a made-up ratio.
  assert.deepEqual(maxRelDiff([0, Infinity], [0, 1], 1e-9), { value: NaN, index: 1 });
  assert.deepEqual(maxRelDiff([-Infinity], [Infinity], 1e-9), { value: NaN, index: 0 });
  assert.deepEqual(maxRelDiff([Infinity], [Infinity], 1e-9), { value: NaN, index: 0 });
});

test("rmsDiff is the root mean square of the differences", () => {
  assert.equal(rmsDiff([1, 2, 3], [1, 2, 3]), 0);
  assert.equal(rmsDiff([1, 1, 1, 1], [0, 0, 0, 0]), 1);
  assert.equal(rmsDiff([3, 0], [0, 4]), Math.sqrt(12.5));
  assert.equal(rmsDiff([3, 0], [0, 4]), 3.5355339059327378);
  assert.equal(rmsDiff([0, 4], [3, 0]), 3.5355339059327378);
  assert.equal(rmsDiff([5], [2]), 3);
  assert.equal(rmsDiff(Float64Array.of(1e-9, -1e-9), [0, 0]), 1e-9);
});

test("rmsDiff is NaN when any element is NaN, and follows IEEE arithmetic for infinities", () => {
  assert.equal(rmsDiff([1, NaN, 3], [1, 2, 3]), NaN);
  assert.equal(rmsDiff([1, 2, 3], [1, 2, NaN]), NaN);
  assert.equal(rmsDiff([Infinity, NaN], [0, 0]), NaN);
  assert.equal(rmsDiff([NaN, Infinity], [0, 0]), NaN);
  assert.equal(rmsDiff([Infinity, 1], [Infinity, 1]), NaN);
  assert.equal(rmsDiff([Infinity, 1], [0, 1]), Infinity);
});

test("maxPointDistance reports the farthest pair of points by point index", () => {
  const a = [0, 0, 0, 1, 1, 1, 2, 2, 2];
  const b = [0, 0, 0, 1, 1, 1, 5, 6, 2];
  assert.deepEqual(maxPointDistance(a, b), { value: 5, index: 2 });
  assert.deepEqual(maxPointDistance(b, a), { value: 5, index: 2 });
  assert.deepEqual(maxPointDistance(Float64Array.from(a), Float64Array.from(b)), { value: 5, index: 2 });

  // Every point is looked at, the last one included.
  const many = new Float64Array(15);
  many.set([0, 3, 4], 12);
  assert.deepEqual(maxPointDistance(many, new Float64Array(15)), { value: 5, index: 4 });

  // All three components count: (2, 3, 6) has length 7.
  assert.deepEqual(maxPointDistance([0, 0, 0, 2, -3, 6], [1, 0, 0, 0, 0, 0]), { value: 7, index: 1 });
  // A difference along one axis is returned exactly.
  assert.deepEqual(maxPointDistance([0, 0, 0, 0, 1e-9, 0], [0, 0, 0, 0, 0, 0]), { value: 1e-9, index: 1 });
  assert.deepEqual(maxPointDistance([0.1, 0.2, 0.3], [0.4, 0.6, 0.3]), { value: 0.5, index: 0 });
});

test("maxPointDistance differs from the componentwise maximum", () => {
  // Point 0 has the largest single component difference, point 1 the largest distance.
  const a = [3, 0, 0, 2, 2, 2];
  const b = [0, 0, 0, 0, 0, 0];
  assert.deepEqual(maxAbsDiff(a, b), { value: 3, index: 0 });
  assert.deepEqual(maxPointDistance(a, b), { value: Math.sqrt(12), index: 1 });
});

test("maxPointDistance keeps the first point on a tie and reports point 0 for equal arrays", () => {
  assert.deepEqual(maxPointDistance([1, 0, 0, 0, 1, 0, 0, 0, 1], new Float64Array(9)), { value: 1, index: 0 });
  assert.deepEqual(maxPointDistance([1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6]), { value: 0, index: 0 });
});

test("maxPointDistance needs whole points", () => {
  throwsMessage(() => maxPointDistance([1, 2], [1, 2]), "maxPointDistance: length 2 is not a multiple of 3");
  throwsMessage(
    () => maxPointDistance(new Float64Array(7), new Float64Array(7)),
    "maxPointDistance: length 7 is not a multiple of 3",
  );
});

test("maxPointDistance is NaN at the first point with a NaN component", () => {
  const origin = new Float64Array(9);
  assert.deepEqual(maxPointDistance([0, 0, 0, 0, 0, NaN, 9, 9, 9], origin), { value: NaN, index: 1 });
  assert.deepEqual(maxPointDistance([9, 9, 9, NaN, 0, 0, NaN, 0, 0], origin), { value: NaN, index: 1 });
  assert.deepEqual(maxPointDistance(origin, [0, 0, 0, 0, 0, 0, 0, NaN, 0]), { value: NaN, index: 2 });
  // An infinite component does not hide a NaN in the same point, as Math.hypot would let it.
  assert.deepEqual(maxPointDistance([Infinity, NaN, 0], [0, 0, 0]), { value: NaN, index: 0 });
  assert.deepEqual(maxPointDistance([0, 0, Infinity], [0, 0, Infinity]), { value: NaN, index: 0 });
  assert.deepEqual(maxPointDistance([0, 0, 0, 0, -Infinity, 0], [0, 0, 0, 0, 0, 0]), { value: Infinity, index: 1 });
});
