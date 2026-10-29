// Chief sets from LensVisualizer: the chief rays its distortion tab (the curve and the traced field grid), its pupils
// tab and the lateral-colour section of its chromatic tab launch, as `rays.trace` specs. "Identical rays" for the
// rung R9a are these: each tab's own launch, traced as given by every engine.
//
// Which fields a tab traces, and the launch of each chief ray, are LensVisualizer's own functions where it exports
// them (`computeDistortionCurve` and `computeDistortionFieldGrid` for the fields their sweeps found,
// `solveChiefRayForRuntimeLens`, `projectionLaunchSlopeForField`, `projectionFieldSlopesForImagePoint`,
// `computeOffAxisChannelFieldGeometry`, `uniformFieldFraction`, `directionFromMeridionalSlope`,
// `directionFromSkewSlope`).
// What the tabs do inline is restated here, each line with a source canary (test/integration/lv/canaries.test.ts):
// the distortion tab's near-axis probe (chiefSetup.ts), its edge chief ray and the chief ray of each sample
// (`chiefRayImageHeightAccurateWithTransfer` in imageHeight.ts), its grid's pupil-correction table and the corrected
// launch of a grid point (`buildPupilCorrectionTable`, `interpolatePupilCorrection`, `traceDistortionGridPointSlope`
// in distortion.ts), the pupils tab's fields and launches (`computeBothPupilAberrationProfiles` in
// pupilAberration.ts), the lateral-colour section's fields (`computeLateralColorCurve` in chromatic/analysis.ts), and
// where LensVisualizer's meridional and skew launches start a ray (`bindRayTrace` in rayAdapters.ts). An integration
// test holds the rays to LensVisualizer's own: traced by LensVisualizer they give the three tabs' figures to the bit
// (test/integration/lv/chiefRays.test.ts).
import type { ChiefNativeSpec } from "../../contract/quantities/chiefNative.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { startsInFront } from "../../rays/probe.ts";
import { rayProblem } from "../../rays/raySets.ts";
import type { ChiefSetResolution } from "../../rays/chiefSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import {
  isChiefFieldRefusal,
  lvLateralChief,
  lvLateralFractions,
  lvPupilFields,
  lvSolvedChief,
} from "./chiefFields.ts";
import type { LvChiefFieldRefusal } from "./chiefFields.ts";
import { lvChiefGeometry, lvChiefRequest, lvDistortionReference } from "./chiefSetup.ts";
import type { LvChiefGeometry, LvChiefSetupApi, LvDistortionReference } from "./chiefSetup.ts";
import { lvSkewLaunch } from "./spotRaySets.ts";
import { lvTabPupilSemiDiameter } from "./spotSetup.ts";
import type { LvAnalysisRequest, LvApi, LvVec3 } from "./types.ts";

/** The LensVisualizer exports the chief sets are made with. */
export type LvChiefApi = LvChiefSetupApi &
  Pick<
    LvApi,
    | "computeDistortionCurve"
    | "computeDistortionFieldGrid"
    | "computeOffAxisChannelFieldGeometry"
    | "solveChiefRayForRuntimeLens"
    | "projectionFieldSlopesForImagePoint"
    | "isFisheyeProjection"
    | "isHeavyLensForRayWork"
    | "uniformFieldFraction"
    | "directionFromMeridionalSlope"
    | "directionFromSkewSlope"
    | "pupilAberrationSampleCount"
    | "lateralColorFieldFractions"
    | "xpZRelLastSurfAtZoom"
  >;

/** The four patterns of chief rays, in the order a run's sets are made. */
export const CHIEF_PATTERNS = ["distortion-curve", "distortion-grid", "pupils", "lateral-colour"] as const;
/** One pattern of chief rays. */
export type ChiefPattern = (typeof CHIEF_PATTERNS)[number];

/** A ray's start and unit direction. */
interface Launch {
  readonly origin: LvVec3;
  readonly direction: LvVec3;
}

/**
 * Where LensVisualizer's meridional launch starts a ray that crosses the first vertex plane at the height `y0` with
 * the slope `u0`, and its direction: restated from `bindRayTrace` in rayAdapters.ts, whose first vertex is the
 * state's own in every tab here (the distortion tab's `stateWithZ(state, zPos)` of the state's `z`, the pupils tab's
 * layout of the prepared state),
 *
 * ```
 * const lead = state.lens.constants.rayLead ?? 0;
 * const firstZ = request.zPos?.[0] ?? state.z[0] ?? 0;
 * ray(y0, u0) {
 *   const direction = meridionalDirectionForSlope(u0);
 *   const origin: Vec3 = [0, y0 - u0 * lead, firstZ - lead];
 * ```
 *
 * and from `meridionalDirectionForSlope`, whose cache holds the direction of the slope 0 (a `Map`, so -0 too) and
 * otherwise the direction LensVisualizer makes of the slope:
 *
 * ```
 * const MERIDIONAL_DIRECTION_BY_SLOPE = new Map<number, Vec3>([[0, [0, 0, 1]]]);
 * const direction = directionFromMeridionalSlope(u) ?? ([0, 0, 1] as Vec3);
 * ```
 */
export function lvMeridionalLaunch(
  api: Pick<LvApi, "directionFromMeridionalSlope">,
  model: LvCaseModel,
  y0: number,
  u0: number,
): Launch {
  const { state } = model;
  const lead = state.lens.constants?.rayLead ?? 0;
  const firstZ = state.z[0] ?? 0;
  const direction: LvVec3 = u0 === 0 ? [0, 0, 1] : (api.directionFromMeridionalSlope(u0) ?? [0, 0, 1]);
  const origin: LvVec3 = [0, y0 - u0 * lead, firstZ - lead];
  return { origin, direction };
}

/** The coded problem of a field a chief set has no ray of (`chiefFields.ts`). */
function refusalProblem(refusal: LvChiefFieldRefusal): string {
  return rayProblem(refusal.code, refusal.message);
}

/**
 * The launch of a solved chief ray of a field angle (`lvSolvedChief`, chiefFields.ts, which `lv`'s answer decides its
 * fields with too), or the coded problem of one a chief set has no ray of.
 */
function solvedChief(
  api: LvChiefApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
  fieldAngleDeg: number,
  named: string,
): Launch | string {
  const made = lvSolvedChief(api, model, geometry, fieldAngleDeg, named);
  if (isChiefFieldRefusal(made)) return refusalProblem(made);
  return lvMeridionalLaunch(api, model, made.yLaunch, made.uField);
}

/**
 * The near-axis probe of the distortion tab's reference, restated from `traceChiefRayAtAngle` in imageHeight.ts,
 * which `chiefRayImageHeight` traces with the drawer's geometry: the chief ray of the paraxial entrance pupil,
 *
 * ```
 * const launch = projectionLaunchSlopeForField({ projection: state.lens.projection.config }, fieldAngleDeg);
 * const uField = launch.uField;
 * const yChief = -geom.epRatio * uField;
 * ... .ray(yChief, uField);
 * ```
 */
function probeLaunch(
  api: LvChiefApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
  reference: LvDistortionReference,
): Launch {
  const uField = reference.probeSlope;
  const yChief = -geometry.epRatio * uField;
  return lvMeridionalLaunch(api, model, yChief, uField);
}

/** One pattern's rays and what was found missing of them. */
interface PatternRays {
  readonly launches: readonly Launch[];
  /** The index of the reference ray, for a distortion pattern: its scale probe. */
  readonly chiefIndex?: number;
  readonly problems: readonly string[];
}

/**
 * The distortion curve's chief rays: the probe of its reference, the chief ray of its edge (the half field, whose
 * landing sets the curve's target heights), and the chief ray of every sample the curve plots after the axis, at the
 * angle LensVisualizer's inversion solved for its target height, in the curve's order. Restated from
 * `computeDistortionReference` (the edge, `chiefRayImageHeightAccurate(geometry.halfFieldDeg, ...)`) and
 * `computeDistortionCurve` (each sample's `inversion.fieldAngleDeg`), whose samples are LensVisualizer's own.
 */
function curveRays(
  api: LvChiefApi,
  model: LvCaseModel,
  request: LvAnalysisRequest,
  geometry: LvChiefGeometry,
  reference: LvDistortionReference,
): PatternRays & { readonly anglesDeg: readonly number[] } {
  const curve = api.computeDistortionCurve(request);
  // The first sample is the axis, which the curve states and does not trace.
  const anglesDeg = curve.samples.slice(1).map((sample) => sample.fieldAngleDeg);
  if (anglesDeg.length === 0) {
    const message = "LensVisualizer's distortion curve has no traced sample for the state";
    return { launches: [], problems: [rayProblem("lv-no-distortion-curve", message)], anglesDeg };
  }
  const problems: string[] = [];
  const launches: Launch[] = [probeLaunch(api, model, geometry, reference)];
  const edge = solvedChief(api, model, geometry, geometry.halfFieldDeg, "the distortion curve's edge");
  if (typeof edge === "string") problems.push(edge);
  else launches.push(edge);
  // A sample whose chief ray no set states is no field of the ask either: `lv` leaves it out of its answer alike.
  const launched: number[] = [];
  for (const angle of anglesDeg) {
    const made = solvedChief(api, model, geometry, angle, "a distortion sample");
    if (typeof made === "string") {
      problems.push(made);
      continue;
    }
    launches.push(made);
    launched.push(angle);
  }
  return { launches, chiefIndex: 0, problems, anglesDeg: launched };
}

/** The pupil-correction table of the distortion grid: a field angle and the solved launch over the paraxial one. */
interface PupilCorrectionEntry {
  readonly angleDeg: number;
  readonly ratio: number;
}

/**
 * The distortion grid's pupil-correction table, restated from `buildPupilCorrectionTable` in distortion.ts, with no
 * count of the drawer's (`sampling: {}`), its constants `PUPIL_CORRECTION_SAMPLE_COUNT_FULL = 17` and
 * `PUPIL_CORRECTION_SAMPLE_COUNT_HEAVY = 9`:
 *
 * ```
 * isHeavyLensForRayWork(L) ? PUPIL_CORRECTION_SAMPLE_COUNT_HEAVY : PUPIL_CORRECTION_SAMPLE_COUNT_FULL,
 * for (let i = 0; i < sampleCount; i++) {
 *   const angleDeg = uniformFieldFraction(i, sampleCount) * reference.geometry.halfFieldDeg;
 *   const launch = projectionLaunchSlopeForField(L, angleDeg);
 *   if (launch.status === "out-of-domain") {
 *     table.push({ angleDeg, ratio: 1 });
 *     continue;
 *   }
 *   const paraxialYChief = -reference.geometry.epRatio * launch.uField;
 *   const solvedYChief = solveChiefRay(angleDeg, focusT, zoomT, L, reference.geometry, aberrationT).yLaunch;
 *   const ratio = Math.abs(paraxialYChief) > 1e-12 ? solvedYChief / paraxialYChief : 1;
 *   table.push({ angleDeg, ratio: isFinite(ratio) ? ratio : 1 });
 * }
 * ```
 */
function pupilCorrectionTable(api: LvChiefApi, model: LvCaseModel, geometry: LvChiefGeometry): PupilCorrectionEntry[] {
  const { state, runtime: L } = model;
  const sampleCount = api.isHeavyLensForRayWork(L) ? 9 : 17;
  const table: PupilCorrectionEntry[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const angleDeg = api.uniformFieldFraction(i, sampleCount) * geometry.halfFieldDeg;
    const launch = api.projectionLaunchSlopeForField(L, angleDeg);
    if (launch.status === "out-of-domain") {
      table.push({ angleDeg, ratio: 1 });
      continue;
    }
    const paraxialYChief = -geometry.epRatio * launch.uField;
    const solvedYChief = api.solveChiefRayForRuntimeLens(angleDeg, state.focusT, state.zoomT, L, geometry, 0).yLaunch;
    const ratio = Math.abs(paraxialYChief) > 1e-12 ? solvedYChief / paraxialYChief : 1;
    table.push({ angleDeg, ratio: isFinite(ratio) ? ratio : 1 });
  }
  return table;
}

/** `interpolatePupilCorrection` in distortion.ts, restated line by line. */
function interpolatePupilCorrection(table: readonly PupilCorrectionEntry[], angleDeg: number): number {
  if (table.length === 0) return 1;
  if (angleDeg <= table[0].angleDeg) return table[0].ratio;
  if (angleDeg >= table[table.length - 1].angleDeg) return table[table.length - 1].ratio;
  for (let i = 0; i < table.length - 1; i++) {
    if (angleDeg <= table[i + 1].angleDeg) {
      const t = (angleDeg - table[i].angleDeg) / (table[i + 1].angleDeg - table[i].angleDeg);
      return table[i].ratio + t * (table[i + 1].ratio - table[i].ratio);
    }
  }
  return 1;
}

/**
 * The distortion grid's chief rays: the probe of its reference, then the launch of every grid point
 * LensVisualizer's grid traces, in the order of its lines and their points (`computeDistortionFieldGrid`, whose
 * points are LensVisualizer's own). A point outside the image circle, and one the ideal mapping has no slopes for,
 * is not traced. The launch of a point is restated from `resolveDistortionGridLaunch` (rectilinear: the slopes of
 * its ideal point) and `traceDistortionGridPointSlope` in distortion.ts, at infinity focus (`objectVergence` 0, so
 * `slopeScale` stays 1):
 *
 * ```
 * const fieldSlopes = projectionFieldSlopesForImagePoint(reference.projectionReference, idealX, idealY);
 * if (fieldSlopes === null) return null;
 * let correction = interpolatePupilCorrection(pupilCorrection, launch.equivalentAngleDeg);
 * const fieldSlopeX = launch.fieldSlopeX * slopeScale;
 * const fieldSlopeY = launch.fieldSlopeY * slopeScale;
 * const correctedEpRatio = reference.geometry.epRatio * correction;
 * return adapter.skew(-correctedEpRatio * fieldSlopeX, -correctedEpRatio * fieldSlopeY, fieldSlopeX, fieldSlopeY);
 * ```
 *
 * with the grid's adapter `prepareRayTrace(L, { focusT, zoomT, stopSD: currentPhysStopSD, ghost: true, aberrationT })`,
 * whose skew launch starts at the state's own first vertex. A grid of no line (no reference: LensVisualizer's grid
 * also needs the edge chief ray to land), and one whose lines have no point it traces, is `lv-no-distortion-grid`:
 * a set of the probe alone has no distortion.
 */
function gridRays(
  api: LvChiefApi,
  model: LvCaseModel,
  request: LvAnalysisRequest,
  geometry: LvChiefGeometry,
  reference: LvDistortionReference,
): PatternRays {
  const grid = api.computeDistortionFieldGrid(request);
  if (grid.lines.length === 0) {
    const message = "LensVisualizer's distortion grid has no line for the state";
    return { launches: [], problems: [rayProblem("lv-no-distortion-grid", message)] };
  }
  const table = pupilCorrectionTable(api, model, geometry);
  const slopeScale = 1;
  const launches: Launch[] = [probeLaunch(api, model, geometry, reference)];
  for (const line of grid.lines) {
    for (const point of line.points) {
      if (!point.insideImageCircle) continue;
      const fieldSlopes = api.projectionFieldSlopesForImagePoint(
        reference.projectionReference,
        point.idealX,
        point.idealY,
      );
      if (fieldSlopes === null) continue;
      const correction = interpolatePupilCorrection(table, fieldSlopes.equivalentAngleDeg);
      const fieldSlopeX = fieldSlopes.fieldSlopeX * slopeScale;
      const fieldSlopeY = fieldSlopes.fieldSlopeY * slopeScale;
      const correctedEpRatio = geometry.epRatio * correction;
      launches.push(
        lvSkewLaunch(
          api,
          model,
          -correctedEpRatio * fieldSlopeX,
          -correctedEpRatio * fieldSlopeY,
          fieldSlopeX,
          fieldSlopeY,
        ),
      );
    }
  }
  if (launches.length === 1) {
    const message = "LensVisualizer's distortion grid traces no point of its lines for the state";
    return { launches: [], problems: [rayProblem("lv-no-distortion-grid", message)] };
  }
  return { launches, chiefIndex: 0, problems: [] };
}

/**
 * The pupils tab's chief rays: the solved chief ray of every field it traces off the axis (`lvPupilFields`,
 * chiefFields.ts, the enumeration `lv`'s answer decides its fields with). A field without a ray a set can state is a
 * coded problem, and no field of the ask. A lens whose paraxial exit pupil is at infinity has none at all
 * (`if (!isFinite(paraxialXpZRelLastSurf))`, the stored value at infinity focus, `xpZRelLastSurfAtZoom`),
 * `lv-exit-pupil-at-infinity`.
 */
function pupilRays(
  api: LvChiefApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
): PatternRays & { readonly anglesDeg: readonly number[] } {
  const { state, runtime } = model;
  if (!isFinite(api.xpZRelLastSurfAtZoom(state.zoomT, runtime))) {
    const message = "LensVisualizer's pupils tab traces no chief ray where its paraxial exit pupil is at infinity";
    return { launches: [], problems: [rayProblem("lv-exit-pupil-at-infinity", message)], anglesDeg: [] };
  }
  const launches: Launch[] = [];
  const anglesDeg: number[] = [];
  const problems: string[] = [];
  for (const { fieldAngleDeg, made } of lvPupilFields(api, model, geometry)) {
    if (isChiefFieldRefusal(made)) {
      problems.push(refusalProblem(made));
      continue;
    }
    launches.push(lvMeridionalLaunch(api, model, made.yLaunch, made.uField));
    anglesDeg.push(fieldAngleDeg);
  }
  return { launches, problems, anglesDeg };
}

/**
 * The lateral-colour section's chief rays: of every field it traces, each channel's own chief ray, in the order of its
 * channels (`lvLateralChief`, chiefFields.ts, which `lv`'s answer decides its fields with), a block of four rays a
 * field. Restated from `computeLateralColorCurve` (its fields, with no fractions of the drawer's:
 * `normalizeFractions(options.fieldFractions, DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS, { allowZero: true })`) and from
 * `traceOffAxisChiefRay` in offAxis.ts, whose launch of a channel's geometry is the coma tab's skew launch
 * (`lvSkewLaunch`):
 *
 * ```
 * const trace = adapter.skew(0 * entrancePupilSemiDiameter, geometry.yChief + 0 * entrancePupilSemiDiameter, 0, geometry.uField);
 * ```
 *
 * The section traces each channel's chief ray at that channel's indices; the set holds all four at every line of the
 * case, so that an engine traces each of them at every line and a line's own channel's ray is among them. The section
 * traces nothing without a pupil (`currentEPSD <= 0`), `no-pupil`; a field without a launch at a channel is
 * `lv-no-launch`, and one launched from a bounding sphere `lv-vector-launch`: neither is a field of the ask.
 */
function lateralRays(
  api: LvChiefApi,
  model: LvCaseModel,
  request: LvAnalysisRequest,
  geometry: LvChiefGeometry,
): PatternRays & { readonly anglesDeg: readonly number[] } {
  const entrancePupilSemiDiameter = lvTabPupilSemiDiameter(api, model);
  if (!(entrancePupilSemiDiameter > 0)) {
    const message = `the tabs' pupil radius is ${entrancePupilSemiDiameter} mm`;
    return { launches: [], problems: [rayProblem("no-pupil", message)], anglesDeg: [] };
  }
  const launches: Launch[] = [];
  const anglesDeg: number[] = [];
  const problems: string[] = [];
  for (const fraction of lvLateralFractions(api)) {
    const field = lvLateralChief(api, request, geometry, fraction);
    if (isChiefFieldRefusal(field)) {
      problems.push(refusalProblem(field));
      continue;
    }
    for (const chief of field.chiefs) {
      launches.push(
        lvSkewLaunch(
          api,
          model,
          0 * entrancePupilSemiDiameter,
          chief.yChief + 0 * entrancePupilSemiDiameter,
          0,
          chief.uField,
        ),
      );
    }
    anglesDeg.push(field.fieldAngleDeg);
  }
  return { launches, problems, anglesDeg };
}

/** What a case keeps every tab here from launching chief sets for, or null. */
function caseProblem(model: LvCaseModel): string | null {
  const { exported } = model;
  if (exported.system.opticalPath !== undefined) {
    return rayProblem(
      "folded-path",
      "the chief rays of a folded path are LensVisualizer's generalized trace, which a rays.trace v1 request does not state",
    );
  }
  if (exported.conditions.object.kind !== "infinity") {
    return rayProblem(
      "object-not-at-infinity",
      "LensVisualizer's distortion, pupils and lateral-colour tabs launch collimated chief rays; they are compared at infinity focus",
    );
  }
  return null;
}

/** The sets of one pattern at every line of the case, or the problem that keeps it from having any. */
function setsOf(model: LvCaseModel, made: PatternRays, pattern: ChiefPattern): RaysTraceSpec[] | string | null {
  const { launches, chiefIndex } = made;
  if (launches.length === 0) return null;
  const rays = launches.length;
  const origins = new Float64Array(3 * rays);
  const directions = new Float64Array(3 * rays);
  launches.forEach(({ origin, direction }, ray) => {
    origins.set(origin, 3 * ray);
    directions.set(direction, 3 * ray);
  });
  if (!startsInFront(model.exported.system.surfaces[0], origins)) {
    const message = `the chief rays of the ${pattern} pattern would not start in front of the first surface`;
    return rayProblem("launch-behind-first-surface", message);
  }
  const spec = {
    origins: encodeNdArray(origins, [rays, 3]),
    directions: encodeNdArray(directions, [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1), [rays]),
    ...(chiefIndex === undefined ? {} : { groups: { chiefIndex } }),
  };
  return model.exported.conditions.lines.map((_line, line) => ({ line, ...spec }));
}

/**
 * The chief sets of a case that came from a LensVisualizer lens: for every pattern (`CHIEF_PATTERNS`), in that order,
 * its chief rays as one set at each line of the case, in the order of the lines; the rays are the same at every line,
 * every engine tracing each of them at each line.
 *
 * 1. `distortion-curve` (`curveRays`): the probe of the reference, the edge, the curve's samples; `groups.chiefIndex`
 *    names the probe, the ray whose landing scales the others' ideal heights;
 * 2. `distortion-grid` (`gridRays`): the probe, then the grid's points; `groups.chiefIndex` names the probe;
 * 3. `pupils` (`pupilRays`): the pupils tab's chief rays off the axis;
 * 4. `lateral-colour` (`lateralRays`): the lateral-colour section's chief rays, each channel's own, four a field.
 *
 * Every ray has the weight 1: no tab here weights a chief ray. Beside the sets, the `chief.native` requests of the
 * three tabs: the distortion curve at the case's reference line, at the angles LensVisualizer solved for its samples;
 * the pupils at the reference line, at its fields off the axis; the lateral colour at every line, at its fields. A
 * field of a request is one whose chief ray a set states (`chiefFields.ts`, which `lv`'s answer decides its own fields
 * with): no engine is asked a field `lv` cannot launch, and `lv` answers every request of its own case source.
 *
 * A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`) and a state
 * without a half field (`no-half-field`) have no sets and no requests, one problem each. A fisheye lens has no
 * distortion sets (`lv-fisheye-projection`: its reference is its declared law, which no probe scales) and no
 * distortion request; a distortion curve or grid without a reference (`lv-no-distortion-reference`) neither. A field
 * or a pattern without rays is a coded problem and the others are not affected.
 */
export function lvChiefRaySets(api: LvChiefApi, model: LvCaseModel): ChiefSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const problem = rayProblem("no-half-field", "LensVisualizer's field geometry of the state has no half field");
    return { sets: [], problems: [problem], asks: [] };
  }
  const request = lvChiefRequest(api, model);
  const lines = model.exported.conditions.lines.map((_line, line) => line);
  const maxFieldDeg = geometry.halfFieldDeg;
  const sets: RaysTraceSpec[] = [];
  const problems: string[] = [];
  const asks: ChiefNativeSpec[] = [];
  const add = (made: PatternRays, pattern: ChiefPattern): boolean => {
    problems.push(...made.problems);
    const result = setsOf(model, made, pattern);
    if (typeof result === "string") problems.push(result);
    else if (result !== null) sets.push(...result);
    return Array.isArray(result);
  };

  if (api.isFisheyeProjection(model.runtime.projection)) {
    const message = "LensVisualizer's distortion of a fisheye lens is the residual of its declared projection law";
    problems.push(rayProblem("lv-fisheye-projection", message));
  } else {
    const reference = lvDistortionReference(api, model, geometry);
    if (reference === null) {
      const message = "LensVisualizer's distortion tab has no rectilinear reference for the state";
      problems.push(rayProblem("lv-no-distortion-reference", message));
    } else {
      const curve = curveRays(api, model, request, geometry, reference);
      if (add(curve, "distortion-curve")) {
        asks.push({ kind: "distortion", lines: [0], maxFieldDeg, fieldAnglesDeg: [...curve.anglesDeg] });
      }
      add(gridRays(api, model, request, geometry, reference), "distortion-grid");
    }
  }
  const pupils = pupilRays(api, model, geometry);
  if (add(pupils, "pupils"))
    asks.push({ kind: "pupils", lines: [0], maxFieldDeg, fieldAnglesDeg: [...pupils.anglesDeg] });
  const lateral = lateralRays(api, model, request, geometry);
  if (add(lateral, "lateral-colour")) {
    asks.push({ kind: "lateral-colour", lines, maxFieldDeg, fieldAnglesDeg: [...lateral.anglesDeg] });
  }
  return { sets, problems, asks };
}
