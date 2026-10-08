// The comparator of `paraxial.first-order`, which is rung R1: how far the first-order data of two engines are apart.
import type { JsonObject } from "../contract/json.ts";
import { FIRST_ORDER_VALUES, PARAXIAL_FIRST_ORDER } from "../contract/quantities/paraxialFirstOrder.ts";
import type { ParaxialFirstOrderData } from "../contract/quantities/paraxialFirstOrder.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, ComputedMetric, QuantityComparator } from "./comparator.ts";

/** The values of one array of an answer, one per line. */
function perLine(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== "f8") throw new Error(`${PARAXIAL_FIRST_ORDER}: an array is ${decoded.dtype}, not f8`);
  return decoded.values;
}

function compare(a: ParaxialFirstOrderData, b: ParaxialFirstOrderData): ComparatorOutcome {
  const [lines, linesB] = [a.efl.$nd.shape[0], b.efl.$nd.shape[0]];
  if (lines !== linesB) {
    return { comparable: false, reason: `the answers are for different numbers of lines: ${lines} and ${linesB}` };
  }
  let worst: ComputedMetric = { name: "firstOrder.maxAbs", value: 0 };
  for (const quantity of FIRST_ORDER_VALUES) {
    const [one, other] = [perLine(a[quantity]), perLine(b[quantity])];
    for (let line = 0; line < lines; line++) {
      // Equal values differ by 0, also where both are the same infinity: a pupil at infinity in both answers.
      const difference = one[line] === other[line] ? 0 : Math.abs(one[line] - other[line]);
      // A NaN, once met, stays: it is never hidden by a larger difference after it.
      if (Number.isNaN(worst.value)) continue;
      if (Number.isNaN(difference) || worst.where === undefined || difference > worst.value) {
        worst = { name: worst.name, value: difference, where: { quantity, line } };
      }
    }
  }
  return { comparable: true, metrics: [worst] };
}

/**
 * The comparator of `paraxial.first-order`.
 *
 * - `firstOrder.maxAbs` is the largest |a - b|, in mm, over the ten compared values (`FIRST_ORDER_VALUES`) and
 *   the lines, with the `quantity` and the `line` it occurs at in `where`: the first, in that order, on a tie.
 *   Two values that are the same infinity differ by 0; a NaN in either answer makes the metric a NaN, at the
 *   first place one occurs, and an infinity against anything else an infinity.
 * - `recorded` is not compared. `recorded(data)` gives its values, by name, for whoever lists them.
 *
 * Answers for different numbers of lines are not comparable.
 */
export const paraxialFirstOrderComparator: QuantityComparator = Object.freeze({
  quantity: PARAXIAL_FIRST_ORDER,
  metrics: Object.freeze([{ name: "firstOrder.maxAbs", unit: "mm" }]),
  compare: (a: JsonObject, b: JsonObject) => compare(a as ParaxialFirstOrderData, b as ParaxialFirstOrderData),
  recorded: (data: JsonObject) => {
    const { recorded } = data as ParaxialFirstOrderData;
    return Object.fromEntries(Object.keys(recorded).map((name) => [name, [...perLine(recorded[name])]]));
  },
});
