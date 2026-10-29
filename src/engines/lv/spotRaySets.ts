// Spot sets from LensVisualizer: the rays its coma tab and its bokeh tab launch, every sample of their pupil
// patterns, as `rays.trace` specs. "Identical rays" for the rung R7a are these: each tab's own launch, traced as
// given by every engine.
//
// The field of a pattern, its pupil samples and, since LensVisualizer #927, each sample's ray are LensVisualizer's own
// functions (`computeOffAxisFieldGeometry`, `sampleCircularPupil`, `sampleOrthogonalPupilFan`, and the shared aimed
// launch `prepareAimedPupilLaunch`, which aims a sample at (px, py) at its point (px R, py R) of the real stop): the
// rays are kept verbatim. What the tabs do inline, and export no function for, is restated here, each line with a
// source canary (test/integration/lv/canaries.test.ts): which fields, rings and fan the tabs draw
// (`buildComaTraceContext` in coma.ts, `buildBokehTraceContext` in bokeh.ts), the detail field of the coma fans
// (`comaDetailFieldFraction`), and which of the launch's rays `traceOffAxisBundleFromSamples` in offAxis.ts traces (its
// chief ray, the aimed and the blocked samples; never an unaimed one). An integration test holds the rays to
// LensVisualizer's own: traced as the tabs trace them, they give its coma point cloud, its coma fans and its bokeh
// tiles to the bit (test/integration/lv/spotRays.test.ts).
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import type { SpotNativeSpec, SpotPupil } from "../../contract/quantities/spotNative.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { launchBehindProblem, startsInFront } from "../../rays/probe.ts";
import { rayProblem, raySetSpec } from "../../rays/raySets.ts";
import type { SpotNativeAsk, SpotSetResolution } from "../../rays/spotSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import type { LvRaysApi } from "./rays.ts";
import { lvRayWeights } from "./raySets.ts";
import type { LvHookApi } from "./tabRequest.ts";
import type { LvSpotSetup } from "./spotSetup.ts";
export { lvSpotRequest, lvSpotSetup } from "./spotSetup.ts";
export type { LvSpotSetup } from "./spotSetup.ts";
import type {
  LvAimedObjectPlaneField,
  LvAnalysisRequest,
  LvApi,
  LvCircularPupilSample,
  LvFieldGeometry,
  LvOffAxisFieldGeometry,
  LvOrthogonalPupilSample,
  LvVec3,
} from "./types.ts";
import { lvSpotRequest, lvSpotSetup } from "./spotSetup.ts";

/** The LensVisualizer exports the spot sets are made with. */
export type LvSpotApi = LvRaysApi &
  LvHookApi &
  Pick<
    LvApi,
    | "mtfImagePoint"
    | "computeOffAxisFieldGeometry"
    | "sampleCircularPupil"
    | "sampleOrthogonalPupilFan"
    | "directionFromSkewSlope"
    | "comaRingSamples"
    | "comaFieldFractions"
    | "comaFanSampleCount"
    | "bokehRingSamples"
    | "bokehFieldFractions"
    | "createAnalysisRequest"
    | "prepareAimedPupilLaunch"
  >;

/** The two tabs whose rays are the spot sets. */
export type LvSpotTab = "coma" | "bokeh";

/**
 * One pattern a tab draws: its pupil, as a `spot.native` spec states it, and the fractions of the half field of the
 * state it is drawn at. The coma tab draws a point cloud of rings at its preview fields, area-weighted, and a
 * tangential and a sagittal fan at its detail field; the bokeh tab draws tiles of rings at its preview fields,
 * each ray weighted by its area and the bulk transmission of its path.
 */
export interface LvSpotPattern {
  readonly tab: LvSpotTab;
  readonly pupil: SpotPupil;
  readonly fractions: readonly number[];
}

/**
 * The patterns of the two tabs as they open (`analysisQuality` "settled", which leaves every sampling at its
 * family default), restated from `buildComaTraceContext` in coma.ts:
 *
 * ```
 * const meridionalSampleCount = Math.max(3, Math.round(sampling.comaFanSampleCount ?? MERIDIONAL_COMA_SAMPLE_COUNT));
 * const circularPupilSamples = sampleCircularPupil(
 *   sampling.comaRingSamples ?? COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES,
 * );
 * fieldFractions: sampling.comaFieldFractions ?? COMA_PREVIEW_FIELD_FRACTIONS,
 * ```
 *
 * and from bokeh.ts, `buildBokehTraceContext` and `computeBokehPreviewFromContext`:
 *
 * ```
 * circularPupilSamples: sampleCircularPupil(sampling.bokehRingSamples ?? BOKEH_CIRCULAR_PUPIL_RING_SAMPLES),
 * const fieldFractions = sampling.bokehFieldFractions ?? BOKEH_PREVIEW_FIELD_FRACTIONS;
 * ```
 *
 * The fans' count is the one the tab hands `sampleOrthogonalPupilFan`, which makes it odd; a pattern states the
 * count of the fan it made, which `sampleOrthogonalPupilFan` keeps as it is. The bokeh tab weights a
 * ray by its area and its transmission (`weight: (sample.weight ?? 1) * (sample.trace.transmission ?? 1)`), the
 * coma point cloud by its area alone (`weight: sample.weight ?? 0`).
 */
export function lvSpotPatterns(api: LvSpotApi, setup: LvSpotSetup): LvSpotPattern[] {
  const meridionalSampleCount = Math.max(3, Math.round(api.comaFanSampleCount));
  // The pattern states the fan as LensVisualizer makes it, odd: asked again with that count, it makes the same fan.
  const fanSamples = api.sampleOrthogonalPupilFan(meridionalSampleCount, "tangential").length;
  const detail = [setup.detailFieldFraction];
  return [
    {
      tab: "coma",
      pupil: { kind: "rings", rings: [...api.comaRingSamples], weighting: "area" },
      fractions: [...api.comaFieldFractions],
    },
    { tab: "coma", pupil: { kind: "fan", axis: "tangential", samples: fanSamples }, fractions: detail },
    { tab: "coma", pupil: { kind: "fan", axis: "sagittal", samples: fanSamples }, fractions: detail },
    {
      tab: "bokeh",
      pupil: { kind: "rings", rings: [...api.bokehRingSamples], weighting: "area-transmission" },
      fractions: [...api.bokehFieldFractions],
    },
  ];
}

/** The pupil samples of a pattern, as LensVisualizer makes them. */
function samplesOf(api: LvSpotApi, pupil: SpotPupil): readonly (LvCircularPupilSample | LvOrthogonalPupilSample)[] {
  return pupil.kind === "rings"
    ? api.sampleCircularPupil(pupil.rings)
    : api.sampleOrthogonalPupilFan(pupil.samples, pupil.axis);
}

/** The launch rays of one field of a pattern: every pupil sample, and the chief ray after them. */
export interface LvSpotFieldRays {
  /** x, y, z of each ray's origin: the samples in LensVisualizer's order, then the chief ray. */
  readonly origins: Float64Array;
  /** x, y, z of each ray's direction, in the same order. */
  readonly directions: Float64Array;
  /**
   * The area weight of each sample as LensVisualizer states it, 1 for a fan's sample; 0 for an unaimed sample, which
   * holds the chief ray, and for the chief ray.
   */
  readonly launchWeights: Float64Array;
  /** The index of the chief ray: the last ray. */
  readonly chiefIndex: number;
  /** How many samples LensVisualizer could not aim: each holds the chief ray at weight 0. */
  readonly unaimed: number;
  /** How many samples a clear aperture or a total reflection ahead of the stop blocks: each is LV's blocking ray. */
  readonly blocked: number;
}

/**
 * Where LensVisualizer's skew launch starts a ray that crosses the first vertex plane at (`x0`, `y0`) with slopes
 * `ux0` and `uy0`, and its direction: restated from `bindRayTrace` in rayAdapters.ts, with `scalarSkewState` the
 * state of the case,
 *
 * ```
 * const lead = state.lens.constants.rayLead ?? 0;
 * const skewFirstZ = scalarSkewState.z[0] ?? 0;
 * const direction = skewDirectionForSlopes(ux0, uy0);
 * const origin: Vec3 = [x0 - ux0 * lead, y0 - uy0 * lead, skewFirstZ - lead];
 * ```
 *
 * and from `skewDirectionForSlopes`, whose cache keeps the first direction made of two slopes:
 *
 * ```
 * const direction = directionFromSkewSlope(ux, uy) ?? ([0, 0, 1] as Vec3);
 * ```
 *
 * The chief and the parabasal rays of the curvature sets and the chief rays of the chief sets are launched so.
 */
export function lvSkewLaunch(
  api: Pick<LvApi, "directionFromSkewSlope">,
  model: LvCaseModel,
  x0: number,
  y0: number,
  ux0: number,
  uy0: number,
): { readonly origin: LvVec3; readonly direction: LvVec3 } {
  const { state } = model;
  const lead = state.lens.constants?.rayLead ?? 0;
  const skewFirstZ = state.z[0] ?? 0;
  const direction = api.directionFromSkewSlope(ux0, uy0) ?? ([0, 0, 1] as LvVec3);
  const origin: LvVec3 = [x0 - ux0 * lead, y0 - uy0 * lead, skewFirstZ - lead];
  return { origin, direction };
}

/**
 * The launch rays of one field of a pattern, at a scalar field geometry: LensVisualizer's shared aimed launch of the
 * pattern's samples (`prepareAimedPupilLaunch`, LV #927) with the request the drawer hands the tabs, as
 * `traceOffAxisBundleFromSamples` in offAxis.ts asks it and traces it:
 *
 * ```
 * const launch = prepareAimedPupilLaunch(request, samples, geometry, channel);
 * if (launch === null || launch.chief.status !== "aimed") return null;
 * const chiefTrace = tracer.skew(launch.chief);
 * if (ray.status === "unaimed") { unaimedSamples.push(...); return []; }
 * if (ray.status === "blocked") { blockedSampleCount++; return []; }
 * const trace = tracer.skew(ray);
 * ```
 *
 * Every ray is LensVisualizer's as it returns it: the aimed ray of each sample, the blocking ray of a blocked sample,
 * which every engine stops ahead of the stop (LensVisualizer counts it vignetted without tracing it), and the
 * launch's stop-centre ray as the chief ray. A sample LensVisualizer could not aim has no ray, and is never traced:
 * it holds the chief ray at weight 0, so the set keeps a ray a sample and nothing is fabricated. A field whose launch
 * LensVisualizer has none of (no stop), or whose stop-centre ray it could not aim (the tab then draws nothing of the
 * field), is a coded problem.
 */
export function lvSpotFieldRays(
  api: Pick<LvApi, "prepareAimedPupilLaunch">,
  request: LvAnalysisRequest,
  geometry: LvAimedObjectPlaneField,
  samples: readonly (LvCircularPupilSample | LvOrthogonalPupilSample)[],
): LvSpotFieldRays | { readonly problem: string } {
  const launch = api.prepareAimedPupilLaunch(request, samples, geometry);
  if (launch === null) {
    return { problem: rayProblem("lv-no-launch", "LensVisualizer's aimed launch has no stop to aim at") };
  }
  const chief = launch.chief;
  if (chief.status !== "aimed") {
    const why = chief.status === "unaimed" ? chief.reason : `blocked at surface ${chief.blockedAtSurfaceIndex}`;
    const message = `LensVisualizer aims no ray through the stop's centre (${why}): the tabs draw nothing of the field`;
    return { problem: rayProblem("lv-chief-unaimed", message) };
  }
  const count = samples.length + 1;
  const origins = new Float64Array(count * 3);
  const directions = new Float64Array(count * 3);
  const launchWeights = new Float64Array(count);
  let [unaimed, blocked] = [0, 0];
  for (const [index, sample] of samples.entries()) {
    const ray = launch.rays[index];
    if (ray.status === "unaimed") {
      unaimed++;
      origins.set(chief.origin, 3 * index);
      directions.set(chief.direction, 3 * index);
      continue;
    }
    if (ray.status === "blocked") blocked++;
    origins.set(ray.origin, 3 * index);
    directions.set(ray.direction, 3 * index);
    launchWeights[index] = "weight" in sample ? sample.weight : 1;
  }
  const chiefIndex = count - 1;
  origins.set(chief.origin, 3 * chiefIndex);
  directions.set(chief.direction, 3 * chiefIndex);
  return { origins, directions, launchWeights, chiefIndex, unaimed, blocked };
}

/** The field angle a tab draws a fraction of the half field at, restated from `computeOffAxisFieldGeometry`. */
export function lvSpotFieldAngle(fieldGeometry: LvFieldGeometry, fieldFraction: number): number {
  const geometry = fieldGeometry as { readonly halfFieldDeg: number };
  const fieldAngleDeg = geometry.halfFieldDeg * fieldFraction;
  return fieldAngleDeg;
}

/** What a case keeps every tab of LensVisualizer's from launching spot sets for, or null. */
function caseProblem(model: LvCaseModel): string | null {
  const { exported } = model;
  if (exported.system.opticalPath !== undefined) {
    return rayProblem(
      "folded-path",
      "LensVisualizer hides its coma tab for a folded system, and the bokeh tab's rays of a folded path are not translated",
    );
  }
  if (exported.conditions.object.kind !== "infinity") {
    return rayProblem(
      "object-not-at-infinity",
      "LensVisualizer's coma and bokeh tabs launch collimated rays at every focus; their rays are compared at infinity focus",
    );
  }
  return null;
}

/** The set of one field of a pattern at each line of the case, or the coded problem of a field without one. */
function fieldSets(
  api: LvSpotApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  pattern: LvSpotPattern,
  fraction: number,
): { readonly sets: RaysTraceSpec[] } | { readonly problem: string } {
  const named = `the ${pattern.tab} tab's ${pattern.pupil.kind === "fan" ? `${pattern.pupil.axis} fan` : "rings"}`;
  const geometry: LvOffAxisFieldGeometry | null = api.computeOffAxisFieldGeometry(
    model.state,
    fraction,
    setup.fieldGeometry,
  );
  if (geometry === null) {
    const message = `LensVisualizer has no launch for ${named} at the fraction ${fraction} of the half field`;
    return { problem: rayProblem("lv-no-launch", message) };
  }
  if (geometry.kind === "vector") {
    const message =
      `LensVisualizer launches ${named} at the fraction ${fraction} from a bounding sphere with a launch bound, ` +
      "which a rays.trace request does not state";
    return { problem: rayProblem("lv-vector-launch", message) };
  }
  if (pattern.pupil.kind === "fan" && !(geometry.fieldAngleDeg > 0)) {
    // computeComaAnalysis and computeSagittalComaResultAtField: a fan whose `fieldAngleDeg <= 0` is null.
    const message = `LensVisualizer draws no coma fan on the axis (the fraction ${fraction} of the half field)`;
    return { problem: rayProblem("lv-no-fan-on-axis", message) };
  }
  const rays = lvSpotFieldRays(api, lvSpotRequest(api, model, setup), geometry, samplesOf(api, pattern.pupil));
  if ("problem" in rays) return { problem: rays.problem };
  if (!startsInFront(model.exported.system.surfaces[0], rays.origins)) {
    return { problem: launchBehindProblem(geometry.fieldAngleDeg) };
  }
  const groups = { field: { angleDeg: geometry.fieldAngleDeg }, chiefIndex: rays.chiefIndex };
  const { origins, directions } = raySetSpec(0, { ...rays, weights: rays.launchWeights });
  const transmitted = pattern.pupil.kind === "rings" && pattern.pupil.weighting === "area-transmission";
  const launch = encodeNdArray(rays.launchWeights);
  return {
    sets: model.exported.conditions.lines.map((_line, line) => {
      const weights = transmitted ? encodeNdArray(lvRayWeights(api, model, rays, line)) : launch;
      return { line, origins, directions, weights, groups };
    }),
  };
}

/** The `spot.native` request of a pattern at the case's reference line, with the angle of each of its fields. */
function askOf(setup: LvSpotSetup, pattern: LvSpotPattern): SpotNativeAsk {
  const spec: SpotNativeSpec = {
    line: 0,
    fields: { kind: "half-field-fractions", values: [...pattern.fractions] },
    pupil: pattern.pupil,
  };
  return { spec, fieldAnglesDeg: pattern.fractions.map((fraction) => lvSpotFieldAngle(setup.fieldGeometry, fraction)) };
}

/**
 * The spot sets of a case that came from a LensVisualizer lens: for every pattern of the coma and the bokeh tab
 * (`lvSpotPatterns`), in that order, and every field of it, the field's launch rays (`lvSpotFieldRays`: since
 * LensVisualizer #927 each sample aimed at its point of the real stop) as one set for each line of the case, in the
 * order of the lines. The rays are the same at every line, as in LensVisualizer, which aims and traces its tabs at the
 * authored indices; the weights are the pattern's: the area weight of a sample of the point cloud, 1 for a fan's, and
 * for a bokeh tile the area weight times LensVisualizer's bulk transmission of the ray at the line (`lvRayWeights`);
 * 0 for a sample LensVisualizer could not aim, which holds the chief ray. Each set states its field angle and its
 * chief ray under `groups`.
 *
 * Beside the sets: the `spot.native` request of every pattern at the case's reference line, with the angles of its
 * fields (`SpotNativeAsk`).
 *
 * A field without rays is a coded problem and the others are not affected: no launch of LensVisualizer's
 * (`lv-no-launch`), a stop-centre ray it could not aim (`lv-chief-unaimed`), a fisheye field launched from a bounding
 * sphere (`lv-vector-launch`), a coma fan on the axis (`lv-no-fan-on-axis`), rays that would not start in front of the
 * first surface (`launch-behind-first-surface`).
 * A folded case (`folded-path`) and a case whose object is not at infinity (`object-not-at-infinity`) have no sets
 * and no requests at all, one problem each.
 */
export function lvSpotRaySets(api: LvSpotApi, model: LvCaseModel): SpotSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const setup = lvSpotSetup(api, model);
  if (!(setup.pupilSemiDiameterMm > 0)) {
    const problem = rayProblem("no-pupil", `the tabs' pupil radius is ${setup.pupilSemiDiameterMm} mm`);
    return { sets: [], problems: [problem], asks: [] };
  }
  const halfField = (setup.fieldGeometry as { readonly halfFieldDeg?: number }).halfFieldDeg;
  if (halfField === undefined || !(isFinite(halfField) && halfField >= 0)) {
    const problem = rayProblem("no-half-field", `LensVisualizer's half field of the state is ${String(halfField)}`);
    return { sets: [], problems: [problem], asks: [] };
  }
  const sets: RaysTraceSpec[] = [];
  const problems: string[] = [];
  const patterns = lvSpotPatterns(api, setup);
  for (const pattern of patterns) {
    for (const fraction of pattern.fractions) {
      const made = fieldSets(api, model, setup, pattern, fraction);
      if ("problem" in made) problems.push(made.problem);
      else sets.push(...made.sets);
    }
  }
  return { sets, problems, asks: patterns.map((pattern) => askOf(setup, pattern)) };
}
