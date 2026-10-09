// The comparator of `rays.trace` for rung R4: the geometric MTF of the same rays in two engines. One estimator, the
// comparator's own binless one (src/estimators/geometricOtf.ts), is applied to where each engine lands the rays of
// a field, on the rays both engines bring to the image, about one reference point, at the frequencies of the run's
// MTF recipe; the two curves are then set against each other. A field's rays at each line are a request of their
// own, and the MTF of a spectrum is of all of them: the comparator is one of spans (`spanOf`), and each of its
// answers is an engine's traces of a field at every line of the case.
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { createExactSum } from "../core/numeric/exact.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { polychromaticOtf } from "../estimators/geometricOtf.ts";
import type { ImagePlanePoint, OtfUnavailable, PolychromaticOtf, SpectralSpots } from "../estimators/geometricOtf.ts";
import { countValid, intersectValidity, maskWhere } from "../estimators/validity.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { decodeLandings } from "./raysRead.ts";
import type { DecodedLandings } from "./raysRead.ts";
import type { SpanAnswer } from "./span.ts";

/** The two cuts of a transfer function: along image x, and along image y, in whose plane the field lies. */
export const MTF_CUTS = ["sagittal", "tangential"] as const;

/**
 * The reasons of the estimator that say two answers have nothing to take an MTF of: no ray of a line is ok in
 * both, or the rays that are carry no flux. Any other reason is a defect of an answer or of the request, and the
 * two are then not comparable.
 */
const NOTHING_TO_MEASURE: readonly OtfUnavailable["reason"][] = ["no-rays", "no-flux"];

/** The rays of a field: every set that states its field is of the span of that field, lattice and chief ray. */
function spanOf(spec: JsonObject): string | undefined {
  const { groups } = spec as RaysTraceSpec;
  return groups?.field === undefined ? undefined : canonicalJson(groups);
}

/** One line of a field as two engines traced it. */
interface TracedLine {
  /** The index of the line in the case. */
  readonly line: number;
  /** The flux each ray stands for, from the request. */
  readonly weights: Float64Array;
  readonly a: DecodedLandings;
  readonly b: DecodedLandings;
  /** The rays that are ok in both answers: the only ones either engine's sum takes. */
  readonly valid: Uint8Array;
}

/**
 * The flux-weighted centroid of the rays `valid` takes, or null when they carry no flux. Every sum is compensated
 * and the rays are added in their order, so equal landings give equal bits.
 */
function centroid(landings: DecodedLandings, weights: Float64Array, valid: Uint8Array): ImagePlanePoint | null {
  const [flux, x, y] = [createExactSum(), createExactSum(), createExactSum()];
  for (let ray = 0; ray < landings.rays; ray++) {
    if (!valid[ray] || !(weights[ray] > 0)) continue;
    flux.add(weights[ray], 1);
    x.add(weights[ray], landings.x[ray]);
    y.add(weights[ray], landings.y[ray]);
  }
  const total = flux.value();
  return total > 0 ? { x: x.value() / total, y: y.value() / total } : null;
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const never = (reason: string): ComparatorOutcome => ({ comparable: false, reason });
  const [membersA, membersB] = [(dataA as SpanAnswer).members, (dataB as SpanAnswer).members];
  const recipe = context?.recipe;
  const conditions = context?.opticalCase?.conditions;
  if (recipe === undefined || conditions === undefined) {
    return never(
      "the MTF recipe of the run and its case are not at hand: the recipe's frequencies say where the MTF is taken, " +
        "and the lines of the case what each line counts for",
    );
  }
  if (recipe.imageZ !== conditions.imageZ) {
    return never(
      `the recipe is of the plane z = ${recipe.imageZ} mm, and the rays land on z = ${conditions.imageZ} mm`,
    );
  }
  if (recipe.frequenciesPerMm.length === 0) return never("the recipe states no frequency");
  if (
    membersA.length !== membersB.length ||
    membersA.some((member, index) => member.requestId !== membersB[index].requestId)
  ) {
    return never("the two answers are to different requests");
  }

  // The lines of the field, in the order of the case: each line of the case once, and no other.
  const traced: TracedLine[] = [];
  for (const [index, member] of membersA.entries()) {
    const spec = member.spec as RaysTraceSpec;
    const [a, b] = [decodeLandings(member.data), decodeLandings(membersB[index].data)];
    const weights = decodeNdArray(spec.weights).values as Float64Array;
    if (a.rays !== b.rays || a.rays !== weights.length) {
      return never(
        `line ${spec.line}: the request is of ${weights.length} rays, and the answers are for ${a.rays} and ${b.rays}`,
      );
    }
    const valid = intersectValidity([maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)]);
    traced.push({ line: spec.line, weights, a, b, valid });
  }
  traced.sort((first, second) => first.line - second.line);
  const lines = traced.map(({ line }) => line);
  if (lines.length !== conditions.lines.length || lines.some((line, index) => line !== index)) {
    return never(
      `the field has rays at the lines ${lines.join(", ")}, and the case has ${conditions.lines.length} lines: ` +
        "a spectrum from which a line is missing, or is there twice, is another spectrum",
    );
  }

  // What was compared, and what was left out of both sums because one engine did not bring it to the image.
  let compared = 0;
  let dropped = 0;
  let firstDropped: ComparisonMetric["where"];
  for (const { line, a, b, valid } of traced) {
    compared += countValid(valid);
    for (let ray = 0; ray < a.rays; ray++) {
      if ((a.status[ray] === RAY_STATUS.ok) === (b.status[ray] === RAY_STATUS.ok)) continue;
      if (dropped++ === 0) firstDropped = { line, ray };
    }
  }
  const angle = (membersA[0].spec as RaysTraceSpec).groups?.field?.angleDeg;
  const place: NonNullable<ComparisonMetric["where"]> = angle === undefined ? {} : { field: angle };
  const counts: ComputedMetric[] = [
    { name: "rays.compared", value: compared },
    {
      name: "rays.dropped",
      value: dropped,
      ...(firstDropped === undefined ? {} : { where: { ...place, ...firstDropped } }),
    },
    { name: "lines.compared", value: traced.length },
  ];
  const unmeasured = (reason: string): ComparatorOutcome => ({
    comparable: true,
    metrics: counts,
    unmeasured: [{ name: "mtf.maxAbs", reason }],
  });

  // One reference point for both engines and every line: midway between where each engine puts the centre of the
  // first line's flux. The modulus does not depend on it; a point amid the spot keeps every phase small.
  const [first] = traced;
  const [centreA, centreB] = [
    centroid(first.a, first.weights, first.valid),
    centroid(first.b, first.weights, first.valid),
  ];
  if (centreA === null || centreB === null)
    return unmeasured("no ray of line 0 that carries flux is ok in both answers");
  const reference = { x: (centreA.x + centreB.x) / 2, y: (centreA.y + centreB.y) / 2 };

  const estimate = (side: "a" | "b"): PolychromaticOtf | OtfUnavailable => {
    const spectrum = traced.map((each): SpectralSpots => {
      const { x, y } = each[side];
      return { weight: conditions.lines[each.line].weight, spots: { x, y, weight: each.weights, valid: each.valid } };
    });
    return polychromaticOtf(spectrum, reference, recipe.frequenciesPerMm);
  };
  const [otfA, otfB] = [estimate("a"), estimate("b")];
  const missing = [otfA, otfB].find((otf): otf is OtfUnavailable => !otf.available);
  if (missing !== undefined) {
    const said = `${missing.reason}: ${missing.message}`;
    return NOTHING_TO_MEASURE.includes(missing.reason)
      ? unmeasured(said)
      : never(`the estimator has no value: ${said}`);
  }

  let worst: ComputedMetric = { name: "mtf.maxAbs", value: -1 };
  for (const cut of MTF_CUTS) {
    const [curveA, curveB] = [(otfA as PolychromaticOtf)[cut].modulus, (otfB as PolychromaticOtf)[cut].modulus];
    recipe.frequenciesPerMm.forEach((frequencyPerMm, index) => {
      const value = Math.abs(curveA[index] - curveB[index]);
      // The first of equal values is kept; no modulus of an available estimate is a NaN.
      if (value > worst.value) worst = { name: "mtf.maxAbs", value, where: { ...place, cut, frequencyPerMm } };
    });
  }
  return { comparable: true, metrics: [worst, ...counts] };
}

/**
 * The comparator of `rays.trace` for rung R4: the binless geometric MTF of the same rays in two engines.
 *
 * It is a comparator of spans: the sets of one field, one for each line of the case, are compared as one
 * (`spanOf`: the sets whose `groups` are equal and state a field), and each answer is a `SpanAnswer`.
 *
 * - **The rays** of each line are the ones that are ok in both answers: a ray one engine did not bring to the
 *   image is in neither engine's sum. Which rays those are is rung R2's to judge.
 * - **The landing** of a ray is the engine's own `imagePoint`, on the image plane of the case, which is the plane
 *   of the run's recipe: a run at another focus has a case at that plane.
 * - **The flux** of a ray is its weight in the request, the same for both engines; a line counts by its weight in
 *   the case times the flux of its rays (`polychromaticOtf`). With one line it is that line's MTF.
 * - **The reference point** is one for both engines and every line: midway between the two engines' flux-weighted
 *   centroids of the first line's rays. It is lost with no chief ray, and the modulus does not depend on it.
 * - **The frequencies** are the recipe's.
 *
 * Metrics:
 *
 * - `mtf.maxAbs`: the largest difference of the two MTFs, over both cuts and every frequency, with the `field`
 *   angle in degrees, the `cut` and the `frequencyPerMm` in `where`, the first on a tie. Not measured where a
 *   line has no ray that is ok in both, or none that carries flux;
 * - `rays.compared`: the rays that are ok in both answers, over the lines;
 * - `rays.dropped`: the rays that are ok in one answer and not in the other, over the lines: left out of both
 *   sums, with the `line` and the `ray` of the first in `where`;
 * - `lines.compared`: how many lines, and so how many requests, the figure is of.
 *
 * Not comparable: without the run's recipe or its case; a recipe of another plane than the case's, or without a
 * frequency; answers to different requests or for other numbers of rays than the request has; a field whose sets
 * are not of every line of the case, each once; and whatever else leaves the estimator without a value (a landing
 * of an ok ray that is no finite point, a weight that is no number).
 */
export const raysMtfComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: "r4",
  metrics: Object.freeze([
    { name: "mtf.maxAbs", unit: "1" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
    { name: "lines.compared", unit: "lines" },
  ]),
  spanOf,
  compare,
});
