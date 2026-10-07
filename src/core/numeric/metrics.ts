// Comparison metrics shared by every rung.
//
// The NaN rule, the same in every function here: each element's value is computed in IEEE 754 arithmetic, and a
// NaN element is never skipped. That is always the case when either input is NaN there, and also when the
// expression itself is undefined (∞ − ∞, ∞ / ∞). The functions that report an index return
// `{ value: NaN, index }` for the first such element, whatever comes after it; `rmsDiff` returns NaN.
//
// Only IEEE 754 basic operations are used (+, −, ×, ÷ and square root, each correctly rounded by the hardware), in
// index order, so a result does not depend on a math library and is the same bits on every platform. Squares are
// formed directly, without rescaling: `rmsDiff` and `maxPointDistance` are exact to rounding for differences
// between about 1e-150 and 1e150, far beyond any length, path or MTF value compared here.

/** The largest element value of a comparison and the index it occurs at. */
export interface WorstCase {
  /** The largest element value; 0 when there are no elements; NaN under the NaN rule. */
  readonly value: number;
  /** Where it occurs, the first index on a tie; -1 when there are no elements. */
  readonly index: number;
}

function sameLength(name: string, a: ArrayLike<number>, b: ArrayLike<number>): number {
  if (a.length !== b.length) throw new Error(`${name}: length mismatch (${a.length} and ${b.length})`);
  return a.length;
}

function worstOf(count: number, valueAt: (index: number) => number): WorstCase {
  let value = 0;
  let index = -1;
  for (let candidate = 0; candidate < count; candidate++) {
    const candidateValue = valueAt(candidate);
    if (Number.isNaN(candidateValue)) return { value: NaN, index: candidate };
    if (index === -1 || candidateValue > value) {
      value = candidateValue;
      index = candidate;
    }
  }
  return { value, index };
}

/**
 * The largest |a[i] − b[i]| and its index. Empty inputs give `{ value: 0, index: -1 }`; a tie keeps the first
 * index; a NaN element gives `{ value: NaN, index }` at the first one (the NaN rule above). An infinity against a
 * finite number or the opposite infinity is an infinite difference, not a NaN. Throws on a length mismatch.
 */
export function maxAbsDiff(a: ArrayLike<number>, b: ArrayLike<number>): WorstCase {
  const count = sameLength("maxAbsDiff", a, b);
  return worstOf(count, (index) => Math.abs(a[index] - b[index]));
}

/**
 * The largest relative difference |a[i] − b[i]| / max(|a[i]|, |b[i]|, absFloor) and its index. The measure is
 * symmetric in `a` and `b`; `absFloor` keeps elements near zero from dominating, so below it the measure is the
 * absolute difference in units of `absFloor`. Empty inputs, ties and NaN are as in `maxAbsDiff`; an infinite input
 * makes its element NaN, because ∞ / ∞ is undefined. Throws on a length mismatch and unless `absFloor` is a
 * positive finite number.
 */
export function maxRelDiff(a: ArrayLike<number>, b: ArrayLike<number>, absFloor: number): WorstCase {
  const count = sameLength("maxRelDiff", a, b);
  if (!(absFloor > 0) || !Number.isFinite(absFloor)) {
    throw new RangeError(`maxRelDiff: absFloor must be a positive finite number, got ${absFloor}`);
  }
  return worstOf(count, (index) => {
    const scale = Math.max(Math.abs(a[index]), Math.abs(b[index]), absFloor);
    return Math.abs(a[index] - b[index]) / scale;
  });
}

/**
 * The root mean square of a[i] − b[i]: sqrt(Σ (a[i] − b[i])² / n), summed in index order. Empty inputs give 0. A
 * NaN element makes the result NaN (the NaN rule above). Throws on a length mismatch.
 */
export function rmsDiff(a: ArrayLike<number>, b: ArrayLike<number>): number {
  const count = sameLength("rmsDiff", a, b);
  if (count === 0) return 0;
  let sumOfSquares = 0;
  for (let index = 0; index < count; index++) {
    const difference = a[index] - b[index];
    sumOfSquares += difference * difference;
  }
  return Math.sqrt(sumOfSquares / count);
}

/**
 * For two [n, 3] point arrays given flat in C order (x0, y0, z0, x1, …): the largest Euclidean distance between
 * corresponding points, and the index of that point (the row, not the flat offset). No points give
 * `{ value: 0, index: -1 }`; a tie keeps the first point. A point with a NaN component difference gives
 * `{ value: NaN, index }` at the first such point, even when another component of it differs infinitely (the
 * reason `Math.hypot`, which lets an infinity hide a NaN, is not used). Throws on a length mismatch and when the
 * length is not a multiple of 3.
 */
export function maxPointDistance(a: ArrayLike<number>, b: ArrayLike<number>): WorstCase {
  const length = sameLength("maxPointDistance", a, b);
  if (length % 3 !== 0) throw new Error(`maxPointDistance: length ${length} is not a multiple of 3`);
  return worstOf(length / 3, (point) => {
    const dx = a[3 * point] - b[3 * point];
    const dy = a[3 * point + 1] - b[3 * point + 1];
    const dz = a[3 * point + 2] - b[3 * point + 2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  });
}
