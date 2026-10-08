// The comparator of `paraxial.first-order`, which is rung R1: how far the first-order data of two engines are apart.
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import {
  FIRST_ORDER_VALUES,
  PARAXIAL_FIRST_ORDER,
  PUPIL_DISTANCE_SCALE_MM,
  PUPIL_POSITIONS,
} from "../contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../contract/quantities/paraxialFirstOrder.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";

/**
 * The compared values that are the radius of a pupil, each with the position of the pupil it is the radius of. A
 * pupil that lies metres away is as large as it is far, by the same quotient of a height and an angle, so its
 * radius is measured against the pupil's distance from the image plane, as its position is.
 */
export const PUPIL_RADII: readonly (readonly [radius: FirstOrderValue, position: FirstOrderValue])[] = Object.freeze([
  Object.freeze(["entrancePupilSemiDiameter", "entrancePupilZ"] as const),
  Object.freeze(["exitPupilSemiDiameter", "exitPupilZ"] as const),
]);

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

/**
 * A difference on the scale of a pupil's distance from the image plane: the difference itself for a pupil within
 * `PUPIL_DISTANCE_SCALE_MM` of the plane, and beyond that divided by the distance in units of that length. `one`
 * and `other` are where the two answers put the pupil; the farther of the two from the image plane sets the scale,
 * so that swapping the answers changes nothing.
 *
 * A difference of 0, an infinite one and a NaN stay what they are: nothing is far enough away to make two pupils
 * of which only one is at infinity alike. So does a difference whose pupil is at no distance that is a finite
 * number, because either answer puts it at infinity or nowhere: two radii are not excused by a scale without size.
 */
function onPupilScale(difference: number, one: number, other: number, imageZ: number): number {
  if (!Number.isFinite(difference) || difference === 0) return difference;
  const distance = Math.max(Math.abs(one - imageZ), Math.abs(other - imageZ));
  return Number.isFinite(distance) ? difference / Math.max(1, distance / PUPIL_DISTANCE_SCALE_MM) : difference;
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
  const radiusAbs: Worst = { value: 0 };
  const radiusScaled: Worst = { value: 0 };
  for (const quantity of FIRST_ORDER_VALUES) {
    const [one, other] = [perLine(a[quantity]), perLine(b[quantity])];
    // Equal values differ by 0, also where both are the same infinity: a pupil at infinity in both answers.
    const differenceAt = (line: number): number => (one[line] === other[line] ? 0 : Math.abs(one[line] - other[line]));
    // The pupil a value is of, by the name of its position: the value itself, for a position.
    const radiusOf = PUPIL_RADII.find(([radius]) => radius === quantity)?.[1];
    const pupil = PUPIL_POSITIONS.includes(quantity) ? quantity : radiusOf;
    if (pupil === undefined) {
      for (let line = 0; line < lines; line++) note(firstOrder, differenceAt(line), { quantity, line });
      continue;
    }
    const [plain, scaled] = radiusOf === undefined ? [pupilAbs, pupilScaled] : [radiusAbs, radiusScaled];
    const [placedOne, placedOther] = [perLine(a[pupil]), perLine(b[pupil])];
    for (let line = 0; line < lines; line++) {
      const difference = differenceAt(line);
      note(plain, difference, { quantity, line });
      note(scaled, onPupilScale(difference, placedOne[line], placedOther[line], imageZ), { quantity, line });
    }
  }
  return {
    comparable: true,
    metrics: [
      metricOf("firstOrder.maxAbs", firstOrder),
      metricOf("pupilZ.maxScaled", pupilScaled),
      metricOf("pupilZ.maxAbs", pupilAbs),
      metricOf("pupilRadius.maxScaled", radiusScaled),
      metricOf("pupilRadius.maxAbs", radiusAbs),
    ],
  };
}

/**
 * The comparator of `paraxial.first-order`. Each metric has the `quantity` and the `line` it occurs at in `where`:
 * the first, in the order of `FIRST_ORDER_VALUES` and then of the lines, on a tie.
 *
 * - `firstOrder.maxAbs` is the largest |a - b|, in mm, over the six compared values that are neither the position
 *   nor the radius of a pupil, and the lines.
 * - `pupilZ.maxAbs` is the largest |a - b|, in mm, over the two pupil positions (`PUPIL_POSITIONS`).
 * - `pupilZ.maxScaled` is the largest |a - b| / max(1, d / 1000 mm) over them, in mm, with d the pupil's distance
 *   from the image plane of the case, the farther of the two answers. It is the plain difference for a pupil
 *   within a metre of the image plane; beyond that it is the difference as a fraction of the distance, in units
 *   of 1e-3: a value of 1e-9 is a difference of 1e-12 of the distance. A pupil metres away is a quotient of a
 *   number near 1 and one near 0, and no arithmetic places it to a fixed fraction of a millimetre.
 * - `pupilRadius.maxAbs` is the largest |a - b|, in mm, over the two pupil radii (`PUPIL_RADII`).
 * - `pupilRadius.maxScaled` is the largest |a - b| / max(1, d / 1000 mm) over them, in mm, with the same d: the
 *   distance of the pupil the radius is of, by the two answers' own positions of it. The radius of a pupil is the
 *   stop's radius times the same quotient, so a pupil metres away is metres wide, and is known as well as it is
 *   placed and no better. Where that distance is no finite number, because an answer puts the pupil at infinity
 *   or gives it no position, a difference of two radii that are numbers is not scaled. A pupil at infinity has
 *   the infinity for its radius, and the same infinity in both answers is no difference at all.
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
    { name: "pupilRadius.maxScaled", unit: "mm" },
    { name: "pupilRadius.maxAbs", unit: "mm" },
  ]),
  compare: (a: JsonObject, b: JsonObject, context?: ComparisonContext) =>
    compare(a as ParaxialFirstOrderData, b as ParaxialFirstOrderData, context),
  recorded: (data: JsonObject) => {
    const { recorded } = data as ParaxialFirstOrderData;
    return Object.fromEntries(Object.keys(recorded).map((name) => [name, [...perLine(recorded[name])]]));
  },
});
