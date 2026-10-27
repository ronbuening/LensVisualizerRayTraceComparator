// Curvature sets from LensVisualizer: the rays its field-curve and astigmatism sections (aberrations tab) launch, every
// field of them, as `rays.trace` specs. "Identical rays" for the rung R10a are these: the sections' own launches,
// traced as given by every engine.
//
// Which fields the sections trace, and the launch of each field's chief ray, are LensVisualizer's own exports
// (`FIELD_CURVATURE_FIELD_FRACTIONS`, `FIELD_CURVATURE_CURVE_FIELD_FRACTIONS`, `computeOffAxisFieldGeometryScalar`,
// `sampleOrthogonalPupilFan`, `directionFromSkewSlope`, `MERIDIONAL_COMA_SAMPLE_COUNT`). What the sections do inline is
// restated, each line with a source canary (test/integration/lv/canaries.test.ts): the fields (curvatureFields.ts),
// the parabasal pupil fraction and the four parabasal rays beside the chief ray (`computeStandardizedFieldFocus`,
// `traceChiefRelativeSkewRay`), the real-ray fans (`computeDiagnosticFieldFocus`, `traceOffAxisBundleFromSamples`), and
// where LensVisualizer's skew launch starts a ray (`traceSkewRayExactCore` and `bindRayTrace` in rayAdapters.ts, the
// one launch: `lvSkewLaunch`). An integration test holds the rays to LensVisualizer's own: traced by LensVisualizer they
// give the sections' foci to the bit, at the authored indices and at every chromatic channel
// (test/integration/lv/curvatureRays.test.ts).
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
import type { LvApi, LvScalarFieldGeometry, LvVec3 } from "./types.ts";

/** The LensVisualizer exports the curvature sets are made with. */
export type LvCurvatureApi = LvChiefSetupApi &
  LvCurvatureFieldsApi &
  Pick<LvApi, "sampleOrthogonalPupilFan" | "directionFromSkewSlope" | "comaFanSampleCount">;

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
 * const diagnosticFieldFocus = computeDiagnosticFieldFocus(request, geometry, sampling.fieldCurvatureDiagnosticSampleCount);
 * function computeDiagnosticFieldFocus(request, geometry, sampleCount = MERIDIONAL_COMA_SAMPLE_COUNT) {
 *   const tangentialBundle = traceOffAxisBundleFromSamples(request, sampleOrthogonalPupilFan(sampleCount, "tangential"), geometry, undefined);
 *   const sagittalBundle = traceOffAxisBundleFromSamples(request, sampleOrthogonalPupilFan(sampleCount, "sagittal"), geometry, undefined);
 * ```
 */
export function lvRealRayOffsets(api: Pick<LvApi, "sampleOrthogonalPupilFan" | "comaFanSampleCount">): PupilOffset[] {
  return [
    ...api.sampleOrthogonalPupilFan(api.comaFanSampleCount, "tangential"),
    ...api.sampleOrthogonalPupilFan(api.comaFanSampleCount, "sagittal"),
  ].map(({ xFraction, yFraction }) => ({ xFraction, yFraction }));
}

/**
 * The launches of one field: each pupil offset as LensVisualizer launches a ray beside the chief ray, and the chief
 * ray last. Restated from `traceChiefRelativeSkewRay` in chiefRelative.ts (the parabasal rays) and from
 * `traceOffAxisBundleFromSamples` in offAxis.ts (the fans), which both cross the first vertex plane at
 *
 * ```
 * xFraction * entrancePupilSemiDiameter,
 * chiefLaunchHeight + yFraction * entrancePupilSemiDiameter,   // geometry.yChief + sample.yFraction * EPSD
 * ```
 *
 * at the slopes `(0, geometry.uField)`, and from `traceOffAxisChiefRay`, the chief ray:
 *
 * ```
 * const trace = adapter.skew(0 * entrancePupilSemiDiameter, geometry.yChief + 0 * entrancePupilSemiDiameter, 0, geometry.uField);
 * ```
 *
 * each started as LensVisualizer's skew launch starts it (`lvSkewLaunch`).
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

/** The sets of one pattern at every line of the case: the fields' blocks in order, each its chief ray last. */
function setsOf(model: LvCaseModel, blocks: readonly (readonly Launch[])[]): RaysTraceSpec[] {
  const launches = blocks.flat();
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
    weights: encodeNdArray(new Float64Array(rays).fill(1), [rays]),
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
 * 2. `real-ray`: of each field, its tangential and its sagittal real-ray fan (`lvRealRayOffsets`) and its chief ray,
 *    which give the sections' real-ray curves.
 *
 * A field is a block of rays launched along one direction, its chief ray last (`src/rays/curvatureSets.ts`). Every ray
 * has the weight 1. The sections trace a field's rays only once its chief ray passes, and its fans only once its
 * parabasal foci are found; a set states them for every field with a launch, and every engine traces them alike.
 *
 * Beside the sets, the `curvature.native` request of the sections: at every line of the case the sections present
 * curves at (`lvCurvatureLines`: the authored reference line and the lines of the chromatic channels), at the angles of
 * the fields with a launch; none for a run of no such line (every photopic run).
 *
 * A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`), a state without a
 * half field (`no-half-field`) and one without a pupil (`no-pupil`) have no sets and no request, one problem each. A
 * field without a launch (`lv-no-launch`) or whose rays would not start in front of the first surface
 * (`launch-behind-first-surface`) is a coded problem, and the others are not affected.
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
  const realRay = lvRealRayOffsets(api);
  const problems: string[] = [];
  const blocks: { parabasal: Launch[][]; realRay: Launch[][] } = { parabasal: [], realRay: [] };
  const anglesDeg: number[] = [];
  for (const { made } of lvCurvatureFields(api, request, geometry)) {
    if (isCurvatureFieldRefusal(made)) {
      problems.push(rayProblem(made.code, made.message));
      continue;
    }
    const field = {
      parabasal: fieldLaunches(api, model, entrancePupilSemiDiameter, made, parabasal),
      realRay: fieldLaunches(api, model, entrancePupilSemiDiameter, made, realRay),
    };
    const origins = Float64Array.from([...field.parabasal, ...field.realRay].flatMap(({ origin }) => origin));
    if (!startsInFront(model.exported.system.surfaces[0], origins)) {
      problems.push(launchBehindProblem(made.fieldAngleDeg));
      continue;
    }
    blocks.parabasal.push(field.parabasal);
    blocks.realRay.push(field.realRay);
    anglesDeg.push(made.fieldAngleDeg);
  }
  if (anglesDeg.length === 0) return { sets: [], problems, asks: [] };
  const sets = [...setsOf(model, blocks.parabasal), ...setsOf(model, blocks.realRay)];
  // The ask is of the lines the sections present curves at: none of a run whose lines are no line of theirs.
  const lines = lvCurvatureLines(api, model);
  const asks: CurvatureNativeSpec[] =
    lines.length === 0 ? [] : [{ lines, maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: anglesDeg }];
  return { sets, problems, asks };
}
