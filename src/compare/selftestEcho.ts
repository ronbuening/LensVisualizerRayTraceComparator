// The comparator of `selftest.echo`: how far the arrays and the sums of two answers are apart.
import type { JsonObject } from "../contract/json.ts";
import { SELFTEST_ECHO } from "../contract/quantities/selftestEcho.ts";
import type { SelftestEchoData } from "../contract/quantities/selftestEcho.ts";
import { maxAbsDiff } from "../core/numeric/metrics.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, QuantityComparator } from "./comparator.ts";

/** The elements of an answer as a fresh float64 array, with their shape. */
function elementsOf(wire: NdArrayWire): { shape: readonly number[]; values: Float64Array } {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== "f8") throw new Error(`${SELFTEST_ECHO}: values are ${decoded.dtype}, not f8`);
  return { shape: decoded.shape, values: decoded.values.slice() };
}

function compare(a: SelftestEchoData, b: SelftestEchoData): ComparatorOutcome {
  const left = elementsOf(a.values);
  const right = elementsOf(b.values);
  if (left.shape.length !== right.shape.length || left.shape.some((extent, axis) => extent !== right.shape[axis])) {
    const shapes = `[${left.shape.join(", ")}] and [${right.shape.join(", ")}]`;
    return { comparable: false, reason: `the values have different shapes: ${shapes}` };
  }
  // An element that is the same NaN or the same infinity in both is the same element. Its difference would be a
  // NaN, so both copies are set to 0 there; every other element keeps the difference IEEE 754 gives it.
  const leftBits = new BigUint64Array(left.values.buffer);
  const rightBits = new BigUint64Array(right.values.buffer);
  for (let index = 0; index < left.values.length; index++) {
    const neitherFinite = !Number.isFinite(left.values[index]) && !Number.isFinite(right.values[index]);
    if (neitherFinite && leftBits[index] === rightBits[index]) {
      leftBits[index] = 0n;
      rightBits[index] = 0n;
    }
  }
  const worst = maxAbsDiff(left.values, right.values);
  const sum = a.sum === null || b.sum === null ? (a.sum === b.sum ? 0 : NaN) : Math.abs(a.sum - b.sum);
  return {
    comparable: true,
    metrics: [
      { name: "values.maxAbs", value: worst.value, ...(worst.index < 0 ? {} : { where: { index: worst.index } }) },
      { name: "sum.abs", value: sum },
    ],
  };
}

/**
 * The comparator of `selftest.echo`.
 *
 * - `values.maxAbs` is the largest |a[i] − b[i]| over the elements, with the flat index (C order) of the first
 *   element that has it in `where`; 0 without `where` for two empty arrays. An element that is not finite in both
 *   answers and has the same bits in both counts as equal, so two engines that echo the same NaN agree. Any other
 *   element that is not finite gives the value IEEE 754 does: a NaN against anything is a NaN, at the index of the
 *   first such element, and an infinity against a finite number or the other infinity is an infinity.
 * - `sum.abs` is |a.sum − b.sum|; 0 when neither answer has a finite sum, a NaN when only one has.
 *
 * Arrays of different shapes are not comparable, even with the same elements.
 */
export const selftestEchoComparator: QuantityComparator = Object.freeze({
  quantity: SELFTEST_ECHO,
  metrics: Object.freeze([
    { name: "values.maxAbs", unit: "1" },
    { name: "sum.abs", unit: "1" },
  ]),
  compare: (a: JsonObject, b: JsonObject) => compare(a as SelftestEchoData, b as SelftestEchoData),
});
