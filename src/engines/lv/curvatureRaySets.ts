// Curvature sets from LensVisualizer: the rays its field-curve and astigmatism sections (aberrations tab) launch, every
// field of them, as `rays.trace` specs. "Identical rays" for the rung R10a are these: the sections' own launches,
// traced as given by every engine.
//
// Which fields the sections trace, the launch of each field's chief ray and, since LensVisualizer #927, every ray of
// its real-ray fans are LensVisualizer's own exports (`FIELD_CURVATURE_FIELD_FRACTIONS`,
// `FIELD_CURVATURE_CURVE_FIELD_FRACTIONS`, `computeOffAxisFieldGeometryScalar`, `sampleOrthogonalPupilFan`,
// `directionFromSkewSlope`, `MERIDIONAL_COMA_SAMPLE_COUNT`, and the shared aimed launch `prepareAimedPupilLaunch`,
// which aims a fan's sample at its point of the real stop). What the sections do inline is restated, each line with a
// source canary (test/integration/lv/canaries.test.ts): the fields (curvatureFields.ts), the parabasal pupil fraction
// and the four parabasal rays beside the chief ray (`computeStandardizedFieldFocus`, `traceChiefRelativeSkewRay`: LV
// keeps them about the chief ray's launch, 0.01 mm across, its one documented exception to aiming), the real-ray fans
// (`computeDiagnosticFieldFocus`, `traceOffAxisBundleFromSamples`), and where LensVisualizer's skew launch starts a
// ray (`traceSkewRayExactCore` and `bindRayTrace` in rayAdapters.ts, the one launch: `lvSkewLaunch`). An integration
// test holds the rays to LensVisualizer's own: traced as the sections trace them they give the sections' foci to the
// bit, at the authored indices and at every chromatic channel (test/integration/lv/curvatureRays.test.ts).
import type { CurvatureNativeSpec } from "../../contract/quantities/curvatureNative.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { launchBehindProblem, startsInFront } from "../../rays/probe.ts";
import { rayProblem } from "../../rays/raySets.ts";
import type { CurvatureSetResolution } from "../../rays/curvatureSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefGeometry, lvChiefRequest } from "./chiefSetup.ts";
import type { LvChiefSetupApi } from "./chiefSetup.ts";
import {
  isCurvatureFieldRefusal,
  lvCurvatureFields,
  lvCurvatureLines,
  lvParabasalFraction,
} from "./curvatureFields.ts";
import type { LvCurvatureFieldsApi } from "./curvatureFields.ts";
import { lvSkewLaunch } from "./spotRaySets.ts";
import { lvTabPupilSemiDiameter } from "./spotSetup.ts";
import type { LvAnalysisRequest, LvApi, LvScalarFieldGeometry, LvVec3 } from "./types.ts";

/** The LensVisualizer exports the curvature sets are made with. */
export type LvCurvatureApi = LvChiefSetupApi &
  LvCurvatureFieldsApi &
  Pick<LvApi, "sampleOrthogonalPupilFan" | "directionFromSkewSlope" | "comaFanSampleCount" | "prepareAimedPupilLaunch">;

/** The two patterns of rays, in the order a run's sets are made. */
export const CURVATURE_PATTERNS = ["parabasal", "real-ray"] as const;
/** One pattern of the field curves' rays. */
export type CurvaturePattern = (typeof CURVATURE_PATTERNS)[number];

/** A ray's start and unit direction. */
interface Launch {
  readonly origin: LvVec3;
  readonly direction: LvVec3;
}

/** A pupil sample relative to a field's chief ray: fractions of the pupil radius across (x) and in the meridian (y). */
interface PupilOffset {
  readonly xFraction: number;
  readonly yFraction: number;
}

/**
 * The four parabasal rays of a field, in the sections' order, restated from `computeStandardizedFieldFocus` in
 * fieldCurvature.ts:
 *
 * ```
 * const xFraction = direction === "sagittal" ? sign * parabasalFraction : 0;
 * const yFraction = direction === "tangential" ? sign * parabasalFraction : 0;
 * const tangentialHits = ([-1, 1] as const).map((sign) => traceRelativeRay("tangential", sign))
 * const sagittalHits = ([-1, 1] as const).map((sign) => traceRelativeRay("sagittal", sign))
 * ```
 */
export function lvParabasalOffsets(parabasalFraction: number): PupilOffset[] {
  const offsets: PupilOffset[] = [];
  for (const direction of ["tangential", "sagittal"] as const) {
    for (const sign of [-1, 1] as const) {
      const xFraction = direction === "sagittal" ? sign * parabasalFraction : 0;
      const yFraction = direction === "tangential" ? sign * parabasalFraction : 0;
      offsets.push({ xFraction, yFraction });
    }
  }
  return offsets;
}

/**
 * The real-ray fans of a field, the tangential fan then the sagittal one, each LensVisualizer's own
 * (`sampleOrthogonalPupilFan`), restated from `computeDiagnosticFieldFocus` in fieldCurvature.ts, whose sample count,
 * with no count of the drawer's, is its default:
 *
 * ```
 * const diagnostic = computeDiagnosticFieldFocus(request, geometry, sampling.fieldCurvatureDiagnosticSampleCount);
 * function computeDiagnosticFieldFocus(request, geometry, sampleCount = MERIDIONAL_COMA_SAMPLE_COUNT) {
 *   const tangentialBundle = traceOffAxisBundleFromSamples(request, sampleOrthogonalPupilFan(sampleCount, "tangential"), geometry, undefined);
 *   const sagittalBundle = traceOffAxisBundleFromSamples(request, sampleOrthogonalPupilFan(sampleCount, "sagittal"), geometry, undefined);
 * ```
 */
export function lvRealRayFans(api: Pick<LvApi, "sampleOrthogonalPupilFan" | "comaFanSampleCount">): {
  readonly tangential: PupilOffset[];
  readonly sagittal: PupilOffset[];
} {
  const fan = (axis: "tangential" | "sagittal") =>
    api.sampleOrthogonalPupilFan(api.comaFanSampleCount, axis).map(({ xFraction, yFraction }) => ({
      xFraction,
      yFraction,
    }));
  return { tangential: fan("tangential"), sagittal: fan("sagittal") };
}

/** The real-ray fans of a field as one list, the tangential fan then the sagittal one (`lvRealRayFans`). */
export function lvRealRayOffsets(api: Pick<LvApi, "sampleOrthogonalPupilFan" | "comaFanSampleCount">): PupilOffset[] {
  const { tangential, sagittal } = lvRealRayFans(api);
  return [...tangential, ...sagittal];
}

/**
 * The parabasal launches of one field: each pupil offset as LensVisualizer launches a ray beside the chief ray, and the
 * chief ray last. Restated from `traceChiefRelativeSkewRay` in chiefRelative.ts, which crosses the first vertex plane
 * at
 *
 * ```
 * xFraction * entrancePupilSemiDiameter,
 * chiefLaunchHeight + yFraction * entrancePupilSemiDiameter,
 * ```
 *
 * at the slopes `(0, geometry.uField)`, the chief ray at `(0, geometry.yChief)`, each started as LensVisualizer's skew
 * launch starts it (`lvSkewLaunch`).
 */
function fieldLaunches(
  api: LvCurvatureApi,
  model: LvCaseModel,
  entrancePupilSemiDiameter: number,
  geometry: LvScalarFieldGeometry,
  offsets: readonly PupilOffset[],
): Launch[] {
  const launches = offsets.map(({ xFraction, yFraction }) =>
    lvSkewLaunch(
      api,
      model,
      xFraction * entrancePupilSemiDiameter,
      geometry.yChief + yFraction * entrancePupilSemiDiameter,
      0,
      geometry.uField,
    ),
  );
  launches.push(
    lvSkewLaunch(
      api,
      model,
      0 * entrancePupilSemiDiameter,
      geometry.yChief + 0 * entrancePupilSemiDiameter,
      0,
      geometry.uField,
    ),
  );
  return launches;
}

/**
 * The real-ray launches of one field, the tangential fan, the sagittal fan, then the chief ray, as LensVisualizer's
 * shared aimed launch returns them for each fan (`traceOffAxisBundleFromSamples`, LV #927):
 *
 * ```
 * const launch = prepareAimedPupilLaunch(request, samples, geometry, channel);
 * if (launch === null || launch.chief.status !== "aimed") return null;
 * const chiefTrace = tracer.skew(launch.chief);
 * ```
 *
 * every aimed ray and every blocking ray verbatim, a sample LensVisualizer could not aim the chief ray at weight 0
 * (it is never traced), the chief ray the launch's stop-centre ray. Both fans' launches have the same stop-centre ray,
 * a solve being the field's alone; a field where they differ, or whose stop-centre ray LensVisualizer could not aim,
 * has no real-ray block and a coded problem. A set's fans are read from the launches by place (`curvatureFieldsOf`):
 * the tangential fan's samples, then the sagittal fan's, as many of each (one sample count), a held sample in its own
 * place; a tangential ray starts where the chief ray does along x, a sagittal one does not, which LensVisualizer's aim
 * keeps to the bit on a system symmetric about the meridian (it pins the sagittal coordinate of a sample on the
 * meridian at 0); a field where that does not hold is a coded problem (`lv-fan-off-meridian`), never a block read
 * wrong.
 */
function realRayLaunches(
  api: LvCurvatureApi,
  request: LvAnalysisRequest,
  geometry: LvScalarFieldGeometry,
): { readonly launches: Launch[]; readonly weights: number[] } | { readonly problem: string } {
  const fans = lvRealRayFans(api);
  const made = (["tangential", "sagittal"] as const).map((axis) => ({
    axis,
    launch: api.prepareAimedPupilLaunch(request, fans[axis], geometry),
  }));
  const at = `the real-ray fans of the field at ${geometry.fieldAngleDeg} degrees`;
  if (made.some(({ launch }) => launch === null || launch.chief.status !== "aimed")) {
    return { problem: rayProblem("lv-chief-unaimed", `LensVisualizer aims no stop-centre ray of ${at}`) };
  }
  const [tangential, sagittal] = made.map(({ launch }) => launch!);
  const chief = tangential.chief as Launch;
  const other = sagittal.chief as Launch;
  const same = (a: LvVec3, b: LvVec3) => a.every((value, axis) => Object.is(value, b[axis]));
  if (!same(chief.origin, other.origin) || !same(chief.direction, other.direction)) {
    const message = `LensVisualizer's two fans of ${at} have different stop-centre rays`;
    return { problem: rayProblem("lv-chief-differs", message) };
  }
  const launches: Launch[] = [];
  const weights: number[] = [];
  for (const { axis, launch } of made) {
    for (const ray of launch!.rays) {
      if (ray.status === "unaimed") {
        launches.push(chief);
        weights.push(0);
        continue;
      }
      // A sample of the meridian (the whole tangential fan, the sagittal fan's centre) starts where the chief ray does
      // along x; every other sample does not.
      const onMeridian = Object.is(ray.origin[0], chief.origin[0]);
      if ((ray.xFraction === 0) !== onMeridian || !same(ray.direction, chief.direction)) {
        const where = ray.xFraction === 0 ? "on" : "off";
        const message = `a ${axis} ray of ${at} does not start ${where} the chief ray's meridian along its direction`;
        return { problem: rayProblem("lv-fan-off-meridian", message) };
      }
      launches.push({ origin: ray.origin, direction: ray.direction });
      weights.push(1);
    }
  }
  launches.push(chief);
  weights.push(1);
  return { launches, weights };
}

/** What a case keeps the sections from launching curvature sets for, or null. */
function caseProblem(model: LvCaseModel): string | null {
  const { exported } = model;
  if (exported.system.opticalPath !== undefined) {
    return rayProblem(
      "folded-path",
      "LensVisualizer's field curves of a folded path are its generalized trace, which a rays.trace v1 request does not state",
    );
  }
  if (exported.conditions.object.kind !== "infinity") {
    return rayProblem(
      "object-not-at-infinity",
      "LensVisualizer's field curves launch collimated rays at every focus; they are compared at infinity focus",
    );
  }
  return null;
}

/** One field's block of a pattern: its rays, its chief ray last, and the weight of each. */
interface Block {
  readonly launches: readonly Launch[];
  readonly weights: readonly number[];
}

/** The sets of one pattern at every line of the case: the fields' blocks in order, each its chief ray last. */
function setsOf(model: LvCaseModel, blocks: readonly Block[]): RaysTraceSpec[] {
  const launches = blocks.flatMap((block) => block.launches);
  const rays = launches.length;
  const origins = new Float64Array(3 * rays);
  const directions = new Float64Array(3 * rays);
  launches.forEach(({ origin, direction }, ray) => {
    origins.set(origin, 3 * ray);
    directions.set(direction, 3 * ray);
  });
  const spec = {
    origins: encodeNdArray(origins, [rays, 3]),
    directions: encodeNdArray(directions, [rays, 3]),
    weights: encodeNdArray(Float64Array.from(blocks.flatMap((block) => block.weights)), [rays]),
  };
  return model.exported.conditions.lines.map((_line, line) => ({ line, ...spec }));
}

/**
 * The curvature sets of a case that came from a LensVisualizer lens: for each pattern (`CURVATURE_PATTERNS`), in that
 * order, the rays of every field the sections trace (`lvCurvatureFields`, the fields `lv`'s answer is of too) as one
 * set at each line of the case, in the order of the lines; the rays are the same at every line, as LensVisualizer
 * traces the same rays at each of its chromatic channels.
 *
 * 1. `parabasal`: of each field, its four parabasal rays (`lvParabasalOffsets` of `lvParabasalFraction`) and its chief
 *    ray, which give the sections' field curves and astigmatism;
 * 2. `real-ray`: of each field, its tangential and its sagittal real-ray fan, each sample aimed at its point of the
 *    real stop (`realRayLaunches`, LV #927), and the launch's stop-centre ray, which give the sections' real-ray
 *    curves.
 *
 * A field is a block of rays launched along one direction, its chief ray last (`src/rays/curvatureSets.ts`). Every ray
 * has the weight 1 but a fan's sample LensVisualizer could not aim, which holds the chief ray at weight 0. The sections
 * trace a field's rays only once its chief ray passes, and its fans only once its parabasal foci are found; a set
 * states them for every field with a launch, and every engine traces them alike.
 *
 * Beside the sets, the `curvature.native` request of the sections: at every line of the case the sections present
 * curves at (`lvCurvatureLines`: the authored reference line and the lines of the chromatic channels), at the angles of
 * the fields with a launch; none for a run of no such line (every photopic run).
 *
 * A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`), a state without a
 * half field (`no-half-field`) and one without a pupil (`no-pupil`) have no sets and no request, one problem each. A
 * field without a launch (`lv-no-launch`), whose real-ray fans LensVisualizer aims no stop-centre ray of
 * (`lv-chief-unaimed`, `lv-chief-differs`) or not on and off the meridian (`lv-fan-off-meridian`), or whose rays would
 * not start in front of the first surface (`launch-behind-first-surface`) is a coded problem, and the others are not
 * affected.
 */
export function lvCurvatureRaySets(api: LvCurvatureApi, model: LvCaseModel): CurvatureSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const problem = rayProblem("no-half-field", "LensVisualizer's field geometry of the state has no half field");
    return { sets: [], problems: [problem], asks: [] };
  }
  const entrancePupilSemiDiameter = lvTabPupilSemiDiameter(api, model);
  if (!(entrancePupilSemiDiameter > 0)) {
    const problem = rayProblem("no-pupil", `the tabs' pupil radius is ${entrancePupilSemiDiameter} mm`);
    return { sets: [], problems: [problem], asks: [] };
  }
  const request = lvChiefRequest(api, model);
  const parabasal = lvParabasalOffsets(lvParabasalFraction(entrancePupilSemiDiameter));
  const problems: string[] = [];
  const blocks: { parabasal: Block[]; realRay: Block[] } = { parabasal: [], realRay: [] };
  const anglesDeg: number[] = [];
  for (const { made } of lvCurvatureFields(api, request, geometry)) {
    if (isCurvatureFieldRefusal(made)) {
      problems.push(rayProblem(made.code, made.message));
      continue;
    }
    const launches = fieldLaunches(api, model, entrancePupilSemiDiameter, made, parabasal);
    // A field whose fans have no aimed launch keeps its parabasal block: the sections' curves are of it.
    const aimed = realRayLaunches(api, request, made);
    const realRay = "problem" in aimed ? null : aimed;
    const origins = Float64Array.from([...launches, ...(realRay?.launches ?? [])].flatMap(({ origin }) => origin));
    if (!startsInFront(model.exported.system.surfaces[0], origins)) {
      problems.push(launchBehindProblem(made.fieldAngleDeg));
      continue;
    }
    if ("problem" in aimed) problems.push(aimed.problem);
    blocks.parabasal.push({ launches, weights: launches.map(() => 1) });
    if (realRay !== null) blocks.realRay.push(realRay);
    anglesDeg.push(made.fieldAngleDeg);
  }
  if (anglesDeg.length === 0) return { sets: [], problems, asks: [] };
  const sets = [
    ...setsOf(model, blocks.parabasal),
    ...(blocks.realRay.length === 0 ? [] : setsOf(model, blocks.realRay)),
  ];
  // The ask is of the lines the sections present curves at: none of a run whose lines are no line of theirs.
  const lines = lvCurvatureLines(api, model);
  const asks: CurvatureNativeSpec[] =
    lines.length === 0 ? [] : [{ lines, maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: anglesDeg }];
  return { sets, problems, asks };
}
