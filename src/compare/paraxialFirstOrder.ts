// The comparator of `paraxial.first-order`, which is rung R1: how far the first-order data of two engines are apart.
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import {
  FIRST_ORDER_VALUES,
  PARAXIAL_FIRST_ORDER,
  PUPIL_DISTANCE_SCALE_MM,
  PUPIL_POSITIONS,
} from "../contract/quantities/paraxialFirstOrder.ts";
import type { ParaxialFirstOrderData } from "../contract/quantities/paraxialFirstOrder.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";

/** The values of one array of an answer, one per line. */
function perLine(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== "f8") throw new Error(`${PARAXIAL_FIRST_ORDER}: an array is ${decoded.dtype}, not f8`);
  return decoded.values;
}

/** The largest of a series of differences and where it is; a NaN, once met, stays. */
interface Worst {
  value: number;
  where?: NonNullable<ComparisonMetric["where"]>;
}

function note(worst: Worst, value: number, where: NonNullable<ComparisonMetric["where"]>): void {
  if (Number.isNaN(worst.value)) return;
  if (Number.isNaN(value) || worst.where === undefined || value > worst.value) {
    worst.value = value;
    worst.where = where;
  }
}

function metricOf(name: string, worst: Worst): ComputedMetric {
  return { name, value: worst.value, ...(worst.where === undefined ? {} : { where: worst.where }) };
}

function compare(a: ParaxialFirstOrderData, b: ParaxialFirstOrderData, context?: ComparisonContext): ComparatorOutcome {
  const [lines, linesB] = [a.efl.$nd.shape[0], b.efl.$nd.shape[0]];
  if (lines !== linesB) {
    return { comparable: false, reason: `the answers are for different numbers of lines: ${lines} and ${linesB}` };
  }
  const imageZ = context?.opticalCase?.conditions.imageZ;
  if (imageZ === undefined) {
    return { comparable: false, reason: "the case is not at hand: a pupil is measured from its image plane" };
  }
  const firstOrder: Worst = { value: 0 };
  const pupilAbs: Worst = { value: 0 };
  const pupilScaled: Worst = { value: 0 };
  for (const quantity of FIRST_ORDER_VALUES) {
    const [one, other] = [perLine(a[quantity]), perLine(b[quantity])];
    const pupil = PUPIL_POSITIONS.includes(quantity);
    for (let line = 0; line < lines; line++) {
      // Equal values differ by 0, also where both are the same infinity: a pupil at infinity in both answers.
      const difference = one[line] === other[line] ? 0 : Math.abs(one[line] - other[line]);
      const where = { quantity, line };
      if (!pupil) {
        note(firstOrder, difference, where);
        continue;
      }
      note(pupilAbs, difference, where);
      // The farther of the two answers from the image plane sets the scale, so that swapping them changes nothing.
      const distance = Math.max(Math.abs(one[line] - imageZ), Math.abs(other[line] - imageZ));
      // An infinite difference stays one: a pupil at infinity in one answer only is at no distance to scale by.
      const scale = Math.max(1, distance / PUPIL_DISTANCE_SCALE_MM);
      note(pupilScaled, Number.isFinite(difference) && difference !== 0 ? difference / scale : difference, where);
    }
  }
  return {
    comparable: true,
    metrics: [
      metricOf("firstOrder.maxAbs", firstOrder),
      metricOf("pupilZ.maxScaled", pupilScaled),
      metricOf("pupilZ.maxAbs", pupilAbs),
    ],
  };
}

/**
 * The comparator of `paraxial.first-order`. Each metric has the `quantity` and the `line` it occurs at in `where`:
 * the first, in the order of `FIRST_ORDER_VALUES` and then of the lines, on a tie.
 *
 * - `firstOrder.maxAbs` is the largest |a - b|, in mm, over the eight compared values that are not the position
 *   of a pupil, and the lines.
 * - `pupilZ.maxAbs` is the largest |a - b|, in mm, over the two pupil positions (`PUPIL_POSITIONS`).
 * - `pupilZ.maxScaled` is the largest |a - b| / max(1, d / 1000 mm) over them, in mm, with d the pupil's distance
 *   from the image plane of the case, the farther of the two answers. It is the plain difference for a pupil
 *   within a metre of the image plane; beyond that it is the difference as a fraction of the distance, in units
 *   of 1e-3: a value of 1e-9 is a difference of 1e-12 of the distance. A pupil metres away is a quotient of a
 *   number near 1 and one near 0, and no arithmetic places it to a fixed fraction of a millimetre.
 *
 * Two values that are the same infinity differ by 0 in every metric; a NaN in either answer makes the metric a
 * NaN, at the first place one occurs, and an infinity against anything else an infinity. `recorded` is not
 * compared: `recorded(data)` gives its values, by name, for whoever lists them.
 *
 * Answers for different numbers of lines are not comparable, and no two answers are without the case, whose image
 * plane the pupils are measured from.
 */
export const paraxialFirstOrderComparator: QuantityComparator = Object.freeze({
  quantity: PARAXIAL_FIRST_ORDER,
  metrics: Object.freeze([
    { name: "firstOrder.maxAbs", unit: "mm" },
    { name: "pupilZ.maxScaled", unit: "mm" },
    { name: "pupilZ.maxAbs", unit: "mm" },
  ]),
  compare: (a: JsonObject, b: JsonObject, context?: ComparisonContext) =>
    compare(a as ParaxialFirstOrderData, b as ParaxialFirstOrderData, context),
  recorded: (data: JsonObject) => {
    const { recorded } = data as ParaxialFirstOrderData;
    return Object.fromEntries(Object.keys(recorded).map((name) => [name, [...perLine(recorded[name])]]));
  },
});
