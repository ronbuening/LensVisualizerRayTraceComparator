// The comparator of `spot.native` for rung R7b: two engines' own spot, or own ray fan, of one case, each by its own
// sampling of the pupil and its own aiming, set beside each other field by field. LensVisualizer's coma and bokeh
// tabs beside optiland's SpotDiagram and RayFan is the pair the rung is named for. Nothing here is gated, and no
// figure of it says that one method is right.
//
// A field is sorted before any difference is taken, by R5's sorting (`classifyNativeField`, src/compare/
// mtfNative.ts) and R5's classes in their order: unsupported (no spot or fan), data (other lines; chief rays that
// land further apart than the rung's limit, or an answer that states no landing), numerical (an answer that does not
// stand by its figures; neither engine says so of a spot today), method. Only a field of two methods enters a
// figure. The sorting reads the numbers it reads of R5's answers, so that a report repeats it from the recorded
// values (`factsOfRecorded`).
import type { JsonObject } from "../contract/json.ts";
import { SPOT_NATIVE } from "../contract/quantities/spotNative.ts";
import type { SpotNativeData, SpotNativeField } from "../contract/quantities/spotNative.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type {
  ComparatorOutcome,
  ComparisonContext,
  ComputedMetric,
  QuantityComparator,
  UnmeasuredMetric,
} from "./comparator.ts";
import { numberText } from "./metricText.ts";
import { CHIEF_LANDING_METRIC, classifyNativeField, sameWavelengths } from "./mtfNative.ts";
import type { NativeFieldFacts, NativeFieldSorting } from "./mtfNative.ts";

/** The rung of the engines' own spots and ray fans. */
export const SPOT_NATIVE_RUNG = "r7b";

/** The figures of the fields of two methods: of a spot, its centroid and its radius; of a fan, its errors. */
export const SPOT_CENTROID_METRIC = "spotCentroid.maxAbs";
export const SPOT_RADIUS_METRIC = "spotRmsRadius.maxAbs";
export const FAN_ERROR_METRIC = "fanError.maxAbs";

/**
 * How far apart two engines' pupil coordinates of one fan sample may lie and be of one sample: the spec places them
 * evenly from -1 to 1, which two engines compute by different roundings.
 */
const PUPIL_AGREEMENT = 1e-12;

/** What the sorting reads of one field of an answer: whether it has figures, and where its chief ray lands. */
export function factsOfSpotField(field: SpotNativeField): NativeFieldFacts {
  return { settled: field.status === "ok" ? 1 : null, imageHeightMm: field.imageHeightMm, rimRaysLost: null };
}

/** Why two answers do not answer one request, or null where they do. */
function mismatch(a: SpotNativeData, b: SpotNativeData): string | null {
  if (a.pattern !== b.pattern) return `one answer is of ${a.pattern} and the other of ${b.pattern}`;
  if (a.fields.length !== b.fields.length) {
    const [fewer, more] = [a.fields.length, b.fields.length].sort((first, second) => first - second);
    return `the answers are for ${fewer} and ${more} fields: they answer different requests`;
  }
  const at = a.fields.findIndex((field, index) => field.field !== b.fields[index].field);
  if (at >= 0) {
    const [low, high] = [a.fields[at].field, b.fields[at].field].sort((first, second) => first - second);
    return `field ${at} is ${low} in one answer and ${high} in the other`;
  }
  return null;
}

/** What is said of a field that is in no figure, after its class and reason, the engines named by their methods. */
function whyOf(
  sorting: NativeFieldSorting,
  sides: readonly { readonly data: SpotNativeData; readonly field: SpotNativeField }[],
): string {
  const each = (said: (side: (typeof sides)[number]) => string | null): string[] =>
    sides.flatMap((side) => said(side) ?? []).sort();
  switch (sorting.reason) {
    case "chief-landing-apart":
      return `the chief rays land ${numberText(sorting.landingMm ?? Number.NaN)} mm apart`;
    case "chief-landing-unknown":
      return `no chief-ray landing from ${each(({ data, field }) => (field.imageHeightMm === null ? data.method.name : null)).join(" and ")}`;
    case "lines-differ":
      return `the answers are of the lines ${each(({ data }) => data.lines.map((line) => String(line.wavelengthNm)).join("+")).join(" and ")} nm`;
    default:
      return each(({ data, field }) =>
        field.status === "ok" ? null : `${data.method.name}: ${field.status} (${field.reason ?? "no reason"})`,
      ).join("; ");
  }
}

/** The largest difference of two fans, sample by sample where both landed, and how many samples landed in one. */
function fanDifference(
  a: SpotNativeField,
  b: SpotNativeField,
): { value: number; sample: number; unpaired: number } | string {
  const [errorA, errorB] = [decodeNdArray(a.fan!.errorMm).values, decodeNdArray(b.fan!.errorMm).values];
  const [pupilA, pupilB] = [decodeNdArray(a.fan!.pupil).values, decodeNdArray(b.fan!.pupil).values];
  if (errorA.length !== errorB.length) {
    const held = [errorA.length, errorB.length].sort((first, second) => first - second).join(" and ");
    return `the fans of field ${a.field} have ${held} samples`;
  }
  // The spec asks for samples evenly from -1 to 1: two answers whose samples lie elsewhere answer another fan.
  const apart = pupilA.findIndex(
    (at, sample) => !(Math.abs((at as number) - (pupilB[sample] as number)) <= PUPIL_AGREEMENT),
  );
  if (apart >= 0) {
    return `sample ${apart} of the fans of field ${a.field} is at the pupil coordinates ${pupilA[apart]} and ${pupilB[apart]}`;
  }
  let worst = { value: -1, sample: -1, unpaired: 0 };
  for (let sample = 0; sample < errorA.length; sample++) {
    const [first, second] = [errorA[sample] as number, errorB[sample] as number];
    if (Number.isNaN(first) || Number.isNaN(second)) {
      if (Number.isNaN(first) !== Number.isNaN(second)) worst.unpaired++;
      continue;
    }
    const value = Math.abs(first - second);
    if (value > worst.value) worst = { ...worst, value, sample };
  }
  return worst;
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [dataA as SpotNativeData, dataB as SpotNativeData];
  const different = mismatch(a, b);
  if (different !== null) return { comparable: false, reason: different };
  // The limit of the sorting is the owner's to set; without one no field is set aside by where its chief ray lands.
  const limit = context?.policy?.metrics[CHIEF_LANDING_METRIC]?.attention;
  const sameLines = sameWavelengths(
    a.lines.map((line) => line.wavelengthNm),
    b.lines.map((line) => line.wavelengthNm),
  );
  let landing: ComputedMetric | null = null;
  let centroid: ComputedMetric | null = null;
  let radius: ComputedMetric | null = null;
  let fan: ComputedMetric | null = null;
  const counts = { compared: 0, data: 0, unavailable: 0, unpaired: 0 };
  const notes: string[] = [];
  if (limit === undefined)
    notes.push(`the rung sets no limit on ${CHIEF_LANDING_METRIC}: no field is set aside by its landing`);
  for (const [index, fieldA] of a.fields.entries()) {
    const fieldB = b.fields[index];
    const sorting = classifyNativeField(
      factsOfSpotField(fieldA),
      factsOfSpotField(fieldB),
      sameLines,
      limit ?? Number.POSITIVE_INFINITY,
    );
    const where = { field: fieldA.field };
    if (sorting.landingMm !== null && sorting.class !== "unsupported") {
      // The first of equal values is kept; a NaN is kept, since it is within no limit.
      if (landing === null || sorting.landingMm > landing.value || Number.isNaN(sorting.landingMm)) {
        landing = { name: CHIEF_LANDING_METRIC, value: sorting.landingMm, where };
      }
    }
    if (!sorting.banded) {
      const why = whyOf(sorting, [
        { data: a, field: fieldA },
        { data: b, field: fieldB },
      ]);
      notes.push(`field ${fieldA.field}: ${sorting.class}, ${sorting.reason} (${why})`);
      if (sorting.class === "unsupported") counts.unavailable++;
      else counts.data++;
      continue;
    }
    counts.compared++;
    if (a.pattern === "rings") {
      const [spotA, spotB] = [fieldA.spot!, fieldB.spot!];
      const moved = Math.max(
        Math.abs(spotA.centroidMm[0] - spotB.centroidMm[0]),
        Math.abs(spotA.centroidMm[1] - spotB.centroidMm[1]),
      );
      if (centroid === null || moved > centroid.value) centroid = { name: SPOT_CENTROID_METRIC, value: moved, where };
      const grown = Math.abs(spotA.rmsRadiusMm - spotB.rmsRadiusMm);
      if (radius === null || grown > radius.value) radius = { name: SPOT_RADIUS_METRIC, value: grown, where };
    } else {
      const difference = fanDifference(fieldA, fieldB);
      if (typeof difference === "string") return { comparable: false, reason: difference };
      counts.unpaired += difference.unpaired;
      if (difference.sample >= 0 && (fan === null || difference.value > fan.value)) {
        fan = { name: FAN_ERROR_METRIC, value: difference.value, where: { ...where, ray: difference.sample } };
      }
    }
  }

  const metrics: ComputedMetric[] = [];
  const unmeasured: UnmeasuredMetric[] = [];
  const figure = (value: ComputedMetric | null, name: string, reason: string): void => {
    if (value !== null) metrics.push(value);
    else unmeasured.push({ name, reason });
  };
  figure(landing, CHIEF_LANDING_METRIC, "no field has figures and a chief-ray landing in both answers");
  const none = "no field of two methods has figures in both answers";
  if (a.pattern === "rings") {
    figure(centroid, SPOT_CENTROID_METRIC, none);
    figure(radius, SPOT_RADIUS_METRIC, none);
  } else figure(fan, FAN_ERROR_METRIC, none);
  metrics.push(
    { name: "fields.compared", value: counts.compared },
    { name: "fields.data", value: counts.data },
    { name: "fields.unavailable", value: counts.unavailable },
    ...(a.pattern === "fan" ? [{ name: "fanSamples.unpaired", value: counts.unpaired }] : []),
  );
  return {
    comparable: true,
    // A spot has no fan, and a fan no centroid or radius: those figures are not of this request at all.
    inapplicable: a.pattern === "rings" ? [FAN_ERROR_METRIC] : [SPOT_CENTROID_METRIC, SPOT_RADIUS_METRIC],
    metrics,
    ...(unmeasured.length === 0 ? {} : { unmeasured }),
    ...(notes.length === 0 ? {} : { notes }),
  };
}

/**
 * What an answer states of each field, one value a field: the field as requested, the angle the engine traced it
 * at, where its chief ray lands, whether it has figures (`settled`: 1, NaN for an unavailable field), the centroid
 * and the RMS radius of a spot, and its sampling by every name it states. A fan's samples are recorded under
 * `fanPupil` and `fanErrorMm`, the samples of every field one after the other. `lineWavelengthNm` is the line.
 */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const { fields, lines, pattern } = data as SpotNativeData;
  const names = [...new Set(fields.flatMap((field) => Object.keys(field.sampling)))].sort();
  const fans = pattern === "fan" ? fields.filter((field) => field.fan !== null) : [];
  return {
    field: fields.map((field) => field.field),
    fieldAngleDeg: fields.map((field) => field.fieldAngleDeg ?? Number.NaN),
    imageHeightMm: fields.map((field) => field.imageHeightMm ?? Number.NaN),
    settled: fields.map((field) => (field.status === "ok" ? 1 : Number.NaN)),
    ...(pattern === "rings"
      ? {
          centroidXMm: fields.map((field) => field.spot?.centroidMm[0] ?? Number.NaN),
          centroidYMm: fields.map((field) => field.spot?.centroidMm[1] ?? Number.NaN),
          rmsRadiusMm: fields.map((field) => field.spot?.rmsRadiusMm ?? Number.NaN),
        }
      : {
          fanPupil: fans.flatMap((field) => [...decodeNdArray(field.fan!.pupil).values]),
          fanErrorMm: fans.flatMap((field) => [...decodeNdArray(field.fan!.errorMm).values]),
        }),
    ...Object.fromEntries(
      names.map((name) => [
        name,
        fields.map((field) => (Object.hasOwn(field.sampling, name) ? field.sampling[name] : Number.NaN)),
      ]),
    ),
    lineWavelengthNm: lines.map((line) => line.wavelengthNm),
  };
}

/**
 * The comparator of `spot.native` for rung R7b: two engines' own spot, or own ray fan, of one case. Recorded: a
 * figure is written down, and no figure has an attention band until the owner gives it one.
 *
 * Each field is sorted first (`classifyNativeField`), and only a field of two methods is in a figure:
 *
 * - `chiefLanding.maxAbs`: how far apart the two answers' chief rays land, the largest over the fields both have
 *   figures and a landing for. A band of it in the policy is the limit of the sorting, as in R5: a field beyond it
 *   is of class `data`. Without one, no field is set aside by its landing, and the pair's reason says so;
 * - of a spot, `spotCentroid.maxAbs`, the larger difference of the two centroids along x and y, each relative to
 *   its own engine's chief ray, and `spotRmsRadius.maxAbs`, the difference of the two RMS radii, the largest over
 *   the fields, mm;
 * - of a fan, `fanError.maxAbs`: the largest difference of two transverse errors at one sample, over the samples
 *   both landed and the fields, mm, with the sample in `where` as its `ray`; `fanSamples.unpaired` counts the
 *   samples that landed in one answer only;
 * - `fields.compared`, `fields.data`, `fields.unavailable`: how many fields are of each kind.
 *
 * Every field that is in no figure is named in the notes with its class and reason. Answers of different patterns,
 * for different numbers of fields or for other fields, and fans of different lengths, are not comparable.
 */
export const spotNativeComparator: QuantityComparator = Object.freeze({
  quantity: SPOT_NATIVE,
  rung: SPOT_NATIVE_RUNG,
  metrics: Object.freeze([
    { name: CHIEF_LANDING_METRIC, unit: "mm" },
    { name: SPOT_CENTROID_METRIC, unit: "mm" },
    { name: SPOT_RADIUS_METRIC, unit: "mm" },
    { name: FAN_ERROR_METRIC, unit: "mm" },
    { name: "fields.compared", unit: "elements" },
    { name: "fields.data", unit: "elements" },
    { name: "fields.unavailable", unit: "elements" },
    { name: "fanSamples.unpaired", unit: "elements" },
  ]),
  compare,
  recorded,
});
