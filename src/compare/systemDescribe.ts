// The comparator of `system.describe`, which is rung R0: whether two engines built the same system. Everything an
// engine copies from the case must come back as the same numbers; only the sag, which each engine evaluates with
// its own arithmetic, may differ, and then by no more than rounding.
import type { AsphereTerm } from "../contract/case.ts";
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import { SYSTEM_DESCRIBE } from "../contract/quantities/systemDescribe.ts";
import type { SystemDescribeData } from "../contract/quantities/systemDescribe.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";
import type { ComparatorOutcome, ComputedMetric, QuantityComparator } from "./comparator.ts";

type Where = NonNullable<ComparisonMetric["where"]>;

/** The elements of a float64 array of an answer, flat and in C order. */
function elements(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== "f8") throw new Error(`${SYSTEM_DESCRIBE}: an array is ${decoded.dtype}, not f8`);
  return decoded.values;
}

/**
 * Whether two elements are the same number: equal, where -0 equals 0 as it does in a case's identity, or both a
 * NaN. Nothing else is: there is no tolerance.
 */
function sameNumber(a: number, b: number): boolean {
  return a === b || (Number.isNaN(a) && Number.isNaN(b));
}

/** How many elements of a group of fields are not the same in two answers, and where the first of them is. */
interface Tally {
  count: number;
  first?: Where;
}

function miss(tally: Tally, where: Where): void {
  tally.count++;
  tally.first ??= where;
}

function countMetric(name: string, tally: Tally): ComputedMetric {
  return { name, value: tally.count, ...(tally.first === undefined ? {} : { where: tally.first }) };
}

/** The largest of a series of differences and where it is; a NaN, once met, stays, as in `maxAbsDiff`. */
interface Worst {
  value: number;
  where?: Where;
}

function note(worst: Worst, value: number, where: Where): void {
  if (Number.isNaN(worst.value)) return;
  if (Number.isNaN(value) || worst.where === undefined || value > worst.value) {
    worst.value = value;
    worst.where = where;
  }
}

function worstMetric(name: string, worst: Worst): ComputedMetric {
  return { name, value: worst.value, ...(worst.where === undefined ? {} : { where: worst.where }) };
}

/**
 * The first term by which two lists of terms differ, the one of the lower power when the two at that place are of
 * different powers; undefined when they are the same list: as long, and term by term of one power and coefficient.
 */
function firstDifferentTerm(a: readonly AsphereTerm[], b: readonly AsphereTerm[]): AsphereTerm | undefined {
  for (let index = 0; index < Math.max(a.length, b.length); index++) {
    const [one, other] = [a[index], b[index]];
    if (one === undefined || other === undefined) return one ?? other;
    if (one.power !== other.power || !sameNumber(one.coeff, other.coeff)) {
      return one.power <= other.power ? one : other;
    }
  }
  return undefined;
}

/**
 * How large a rounding error of a sag can be, as a length in mm: the scale a difference of two evaluations is
 * measured against. With u = c r, q = (1 + K) u^2 and root = sqrt(1 - q), the sag is u r / (1 + root) plus the sum
 * of the terms a_n r^n. A relative rounding in the conic part is magnified by 1 + q / (root (1 + root)), which
 * grows without bound as the height nears that at which the conic ends; a rounding in a term is of the size of the
 * term, however far the terms cancel. The scale is the sum of both, in magnitudes. It is a pure function of what
 * the answer itself states, in IEEE 754 basic operations.
 */
function sagScale(curvature: number, conic: number, terms: readonly AsphereTerm[], r: number): number {
  let scale = 0;
  if (curvature !== 0) {
    const u = curvature * r;
    const q = (1 + conic) * u * u;
    const root = Math.sqrt(Math.max(0, 1 - q));
    scale = Math.abs((u * r) / (1 + root)) * (1 + Math.abs(q) / (root * (1 + root)));
  }
  for (const { power, coeff } of terms) {
    let term = Math.abs(coeff);
    for (let factor = 0; factor < power; factor++) term *= r;
    scale += term;
  }
  return scale;
}

function compare(a: SystemDescribeData, b: SystemDescribeData): ComparatorOutcome {
  const [linesA, linesB] = [a.indexAfterSurface.$nd.shape[0], b.indexAfterSurface.$nd.shape[0]];
  if (linesA !== linesB) {
    return { comparable: false, reason: `the answers are for different numbers of lines: ${linesA} and ${linesB}` };
  }
  const [samples, samplesB] = [a.sagRadii.$nd.shape[1], b.sagRadii.$nd.shape[1]];
  if (samples !== samplesB) {
    const reason = `the answers give the sag at different numbers of radii: ${samples} and ${samplesB}`;
    return { comparable: false, reason };
  }
  // The surfaces both answers have. Another number of surfaces is itself a mismatch, counted below.
  const surfaces = Math.min(a.surfaceCount, b.surfaceCount);

  const layout: Tally = { count: 0 };
  const shape: Tally = { count: 0 };
  const aperture: Tally = { count: 0 };
  const index: Tally = { count: 0 };
  type SurfaceField = "vertexZ" | "curvature" | "conic" | "clipRadius" | "innerClipRadius";
  const perSurface = (tally: Tally, field: SurfaceField): void => {
    const [one, other] = [elements(a[field]), elements(b[field])];
    for (let surface = 0; surface < surfaces; surface++) {
      if (!sameNumber(one[surface], other[surface])) miss(tally, { field, surface });
    }
  };

  if (a.surfaceCount !== b.surfaceCount) miss(layout, { field: "surfaceCount" });
  perSurface(layout, "vertexZ");
  if (!sameNumber(a.imageZ, b.imageZ)) miss(layout, { field: "imageZ" });

  perSurface(shape, "curvature");
  perSurface(shape, "conic");
  for (let surface = 0; surface < surfaces; surface++) {
    const different = firstDifferentTerm(a.terms[surface], b.terms[surface]);
    if (different !== undefined) miss(shape, { field: "terms", surface, power: different.power });
  }

  if (a.stopIndex !== b.stopIndex) miss(aperture, { field: "stopIndex" });
  if (!sameNumber(a.stopSemiDiameter, b.stopSemiDiameter)) miss(aperture, { field: "stopSemiDiameter" });
  perSurface(aperture, "clipRadius");
  perSurface(aperture, "innerClipRadius");
  const [radiiA, radiiB] = [elements(a.sagRadii), elements(b.sagRadii)];
  for (let element = 0; element < surfaces * samples; element++) {
    if (sameNumber(radiiA[element], radiiB[element])) continue;
    miss(aperture, { field: "sagRadii", surface: Math.floor(element / samples), sample: element % samples });
  }

  const [indexA, indexB] = [elements(a.indexAfterSurface), elements(b.indexAfterSurface)];
  for (let line = 0; line < linesA; line++) {
    for (let surface = 0; surface < surfaces; surface++) {
      const [one, other] = [indexA[line * a.surfaceCount + surface], indexB[line * b.surfaceCount + surface]];
      if (!sameNumber(one, other)) miss(index, { field: "indexAfterSurface", line, surface });
    }
  }

  const scaled: Worst = { value: 0 };
  const absolute: Worst = { value: 0 };
  const [sagA, sagB] = [elements(a.sag), elements(b.sag)];
  const [curvatureA, curvatureB] = [elements(a.curvature), elements(b.curvature)];
  const [conicA, conicB] = [elements(a.conic), elements(b.conic)];
  for (let surface = 0; surface < surfaces; surface++) {
    for (let sample = 0; sample < samples; sample++) {
      const element = surface * samples + sample;
      const where = { surface, sample };
      // No sag in either answer, or the same one, is no difference; a sag in only one of them is a NaN.
      const difference = sameNumber(sagA[element], sagB[element]) ? 0 : Math.abs(sagA[element] - sagB[element]);
      note(absolute, difference, where);
      if (difference === 0) {
        note(scaled, 0, where);
        continue;
      }
      const scale = Math.max(
        1,
        sagScale(curvatureA[surface], conicA[surface], a.terms[surface], radiiA[element]),
        sagScale(curvatureB[surface], conicB[surface], b.terms[surface], radiiB[element]),
      );
      note(scaled, difference / scale, where);
    }
  }

  return {
    comparable: true,
    metrics: [
      countMetric("layout.mismatches", layout),
      countMetric("shape.mismatches", shape),
      countMetric("aperture.mismatches", aperture),
      countMetric("index.mismatches", index),
      worstMetric("sag.maxScaled", scaled),
      worstMetric("sag.maxAbs", absolute),
    ],
  };
}

/**
 * The comparator of `system.describe`.
 *
 * Four metrics count the elements that are not the same number in both answers, where -0 is 0 and a NaN is a NaN;
 * `where` names the first of them by `field`, and by `surface` (with `line`, `sample` or `power`) where the field
 * has one per surface. The fields are counted in the order given:
 *
 * - `layout.mismatches`: `surfaceCount`, `vertexZ`, `imageZ`;
 * - `shape.mismatches`: `curvature`, `conic`, and `terms`, where a surface counts once when its two lists of terms
 *   are not the same list, with the `power` of the first term that differs;
 * - `aperture.mismatches`: `stopIndex`, `stopSemiDiameter`, `clipRadius`, `innerClipRadius`, `sagRadii`;
 * - `index.mismatches`: `indexAfterSurface`.
 *
 * Two are of the sag, each with the `surface` and the `sample` (the index of the radius) of its largest value:
 *
 * - `sag.maxAbs`: the largest |a - b|, in mm;
 * - `sag.maxScaled`: the largest |a - b| / max(1 mm, scale), where the scale is how large a rounding error of that
 *   sag can be (`sagScale`): the size of what is summed, and of the conic part once more for each time the root
 *   magnifies a rounding. So it is the difference in mm for a sag that is evaluated without cancellation, and
 *   relative to what cancels for one that is not; the larger scale of the two answers is used.
 *
 * In both, a sag that neither answer has (a NaN in both) is no difference, and a sag that only one has is a NaN,
 * which no limit admits.
 *
 * Answers for different numbers of lines, or with the sag at different numbers of radii, are not comparable.
 * Answers with different numbers of surfaces are: `surfaceCount` is a mismatch, and every per-surface field is
 * compared over the surfaces both answers have.
 */
export const systemDescribeComparator: QuantityComparator = Object.freeze({
  quantity: SYSTEM_DESCRIBE,
  metrics: Object.freeze([
    { name: "layout.mismatches", unit: "elements" },
    { name: "shape.mismatches", unit: "elements" },
    { name: "aperture.mismatches", unit: "elements" },
    { name: "index.mismatches", unit: "elements" },
    { name: "sag.maxScaled", unit: "1" },
    { name: "sag.maxAbs", unit: "mm" },
  ]),
  compare: (a: JsonObject, b: JsonObject) => compare(a as SystemDescribeData, b as SystemDescribeData),
});
