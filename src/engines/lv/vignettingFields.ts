// Which fields and lines of LensVisualizer's vignetting tab have rays that a `rays.trace` request can state, decided
// once for both sides of rungs R11a and R11b: the case source makes its vignetting sets and its `vignetting.native`
// ask of the fields this module admits (vignettingRaySets.ts), and `lv` answers the ask with the tab's samples of the
// same fields (vignetting.ts). A field LensVisualizer launches from a bounding sphere, or has no slope for, is no field
// of a set, of the ask or of `lv`'s answer, so that no engine is asked a field `lv` cannot answer and `lv` never
// refuses its own case source's ask. Every restated line has a source canary (test/integration/lv/canaries.test.ts).
// This module reads LensVisualizer only through the exports it names, and imports nothing of the rays generators.
import type { LvCaseModel } from "./caseModel.ts";
import type { LvChiefGeometry } from "./chiefSetup.ts";
import { tracesAuthored } from "./spot.ts";
import type { LvApi, LvRuntimeLens, LvVec3 } from "./types.ts";

/** The LensVisualizer exports the fields are decided with. */
export type LvVignettingFieldsApi = Pick<
  LvApi,
  | "isHeavyLensForRayWork"
  | "uniformFieldFraction"
  | "evenlySpacedSigned"
  | "projectionLaunchSlopeForField"
  | "solveChiefRayForRuntimeLens"
>;

/** Why a field has no rays a set can state: the problem code of the set, and what it says. */
export interface LvVignettingFieldRefusal {
  readonly code: "lv-vector-launch" | "lv-no-launch";
  readonly message: string;
}

/** A field's meridional launch: where its solved chief ray crosses the first vertex plane, and its slope. */
export interface LvVignettingLaunch {
  readonly yChief: number;
  readonly uField: number;
}

/** One field of the tab: its place in the tab's curve, its angle, and its launch or why a set has none. */
export interface LvVignettingField {
  readonly index: number;
  readonly fieldAngleDeg: number;
  readonly made: LvVignettingLaunch | LvVignettingFieldRefusal;
}

/** Whether a field's decision is a refusal. */
export function isVignettingFieldRefusal(
  made: LvVignettingLaunch | LvVignettingFieldRefusal,
): made is LvVignettingFieldRefusal {
  return "code" in made;
}

/**
 * How many fields the tab samples from the axis to the half field, restated from `computeVignettingCurve` in
 * vignetting.ts with no count of the drawer's (`sampling: {}`):
 *
 * ```
 * const fieldSamples =
 *   sampling.vignettingFieldSampleCount !== undefined
 *     ? Math.max(Math.round(sampling.vignettingFieldSampleCount), 3)
 *     : Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
 * ```
 */
export function lvVignettingFieldCount(halfFieldDeg: number): number {
  return Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
}

/**
 * How many rays the tab sweeps across the pupil of each field, restated from `computeVignettingCurve` with no count of
 * the drawer's and its constants `N_PUPIL_FULL = 192` and `N_PUPIL_HEAVY = 96`:
 *
 * ```
 * const nPupil = Math.max(
 *   sampling.vignettingPupilSampleCount !== undefined
 *     ? Math.round(sampling.vignettingPupilSampleCount)
 *     : isHeavyLensForRayWork(L)
 *       ? N_PUPIL_HEAVY
 *       : N_PUPIL_FULL,
 *   3,
 * );
 * ```
 */
export function lvVignettingPupilCount(api: Pick<LvApi, "isHeavyLensForRayWork">, L: LvRuntimeLens): number {
  return Math.max(api.isHeavyLensForRayWork(L) ? 96 : 192, 3);
}

/**
 * The fractions of the pupil diameter the tab sweeps, LensVisualizer's own (`evenlySpacedSigned`), restated from
 * `computeVignettingCurve`:
 *
 * ```
 * const pupilFractions = evenlySpacedSigned(nPupil);
 * ```
 */
export function lvVignettingPupilFractions(
  api: Pick<LvApi, "isHeavyLensForRayWork" | "evenlySpacedSigned">,
  L: LvRuntimeLens,
): number[] {
  return api.evenlySpacedSigned(lvVignettingPupilCount(api, L));
}

/**
 * Every field of the tab with its launch, LensVisualizer's own, restated from `computeVignettingCurve`, whose geometry
 * is the drawer's (`fieldGeometry ?? computeAnalysisFieldGeometryAtState(...)`) and whose state is the case's:
 *
 * ```
 * const fieldAngleDeg = uniformFieldFraction(i, fieldSamples) * halfFieldDeg;
 * const solve = solveChiefRay(fieldAngleDeg, focusT, zoomT, L, geom, aberrationT);
 * const launch = projectionLaunchSlopeForField(L, fieldAngleDeg);
 * if (launch.status === "out-of-domain" && !solve.vectorLaunch) {
 *   rawGT.push(0);
 *   rawIntensity.push(0);
 *   continue;
 * }
 * const uField = launch.uField;
 * const yChief = solve.vectorLaunch ? NaN : solve.yLaunch;
 * ```
 *
 * A field LensVisualizer launches from a bounding sphere with a launch bound (`solve.vectorLaunch`) is
 * `lv-vector-launch`, since a `rays.trace` request states no launch bound; a field without a slope, which the tab
 * plots at 0, is `lv-no-launch`.
 */
export function lvVignettingFields(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
): LvVignettingField[] {
  const { state, runtime: L } = model;
  const fieldSamples = lvVignettingFieldCount(geometry.halfFieldDeg);
  const fields: LvVignettingField[] = [];
  for (let index = 0; index < fieldSamples; index++) {
    const fieldAngleDeg = api.uniformFieldFraction(index, fieldSamples) * geometry.halfFieldDeg;
    const solve = api.solveChiefRayForRuntimeLens(fieldAngleDeg, state.focusT, state.zoomT, L, geometry, 0);
    const launch = api.projectionLaunchSlopeForField(L, fieldAngleDeg);
    if (solve.vectorLaunch !== undefined) {
      const message = `LensVisualizer's vignetting tab launches the field at ${fieldAngleDeg} degrees from a bounding sphere with a launch bound, which a rays.trace request does not state`;
      fields.push({ index, fieldAngleDeg, made: { code: "lv-vector-launch", message } });
      continue;
    }
    if (launch.status === "out-of-domain") {
      const message = `LensVisualizer has no slope for the vignetting tab's field at ${fieldAngleDeg} degrees`;
      fields.push({ index, fieldAngleDeg, made: { code: "lv-no-launch", message } });
      continue;
    }
    fields.push({ index, fieldAngleDeg, made: { yChief: solve.yLaunch, uField: launch.uField } });
  }
  return fields;
}

/**
 * Where the tab's ray of a pupil fraction starts and which way it goes: restated from `computeVignettingCurve`,
 *
 * ```
 * const pupilOffset = pupilFrac * currentEPSD;
 * prepared.ray(yChief + pupilOffset, uField)
 * ```
 *
 * and from `bindRayTrace` in rayAdapters.ts, whose `zPos` is the state's own vertices:
 *
 * ```
 * const lead = state.lens.constants.rayLead ?? 0;
 * const firstZ = request.zPos?.[0] ?? state.z[0] ?? 0;
 * const direction = meridionalDirectionForSlope(u0);
 * const origin: Vec3 = [0, y0 - u0 * lead, firstZ - lead];
 * ```
 *
 * with `meridionalDirectionForSlope`, whose cache holds `[0, 0, 1]` for the slope 0 from the start (a slope of -0 is
 * that key too) and keeps the first direction made of any other:
 *
 * ```
 * const MERIDIONAL_DIRECTION_BY_SLOPE = new Map<number, Vec3>([[0, [0, 0, 1]]]);
 * const direction = directionFromMeridionalSlope(u) ?? ([0, 0, 1] as Vec3);
 * ```
 */
export function lvSweepLaunch(
  api: Pick<LvApi, "directionFromMeridionalSlope">,
  model: LvCaseModel,
  launch: LvVignettingLaunch,
  pupilFraction: number,
  entrancePupilSemiDiameter: number,
): { readonly origin: LvVec3; readonly direction: LvVec3 } {
  const { state } = model;
  const pupilOffset = pupilFraction * entrancePupilSemiDiameter;
  const y0 = launch.yChief + pupilOffset;
  const u0 = launch.uField;
  const lead = state.lens.constants?.rayLead ?? 0;
  const firstZ = state.z[0] ?? 0;
  const direction: LvVec3 = u0 === 0 ? [0, 0, 1] : (api.directionFromMeridionalSlope(u0) ?? [0, 0, 1]);
  const origin: LvVec3 = [0, y0 - u0 * lead, firstZ - lead];
  return { origin, direction };
}

/**
 * The lines of a case the tab traces, in order: the tab traces every surface at its authored index
 * (`prepareRayTrace` without a channel), so it is of a line whose indices are those (`tracesAuthored`) and of no
 * other. The lines of the case source's ask; none for a run of no such line (every photopic and spectral run).
 */
export function lvVignettingLines(model: LvCaseModel): number[] {
  return model.exported.conditions.lines.map((_line, line) => line).filter((line) => tracesAuthored(model, line));
}
