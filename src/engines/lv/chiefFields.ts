// Which fields of LensVisualizer's distortion curve, pupils tab and lateral-colour section have a chief ray that a
// `rays.trace` request can state, decided once for both sides of rungs R9a and R9b: the case source makes its chief
// sets and its `chief.native` asks of the fields this module admits (chiefRaySets.ts), and `lv` answers an ask with the
// tabs' samples of the same fields (chief.ts). A field LensVisualizer launches from a bounding sphere, or has no slope
// for, is no ray of a set: it is left out of the asks and out of `lv`'s answer alike, so that no engine is asked a field
// `lv` cannot launch and `lv` never refuses its own case source's ask. Every restated line has a source canary
// (test/integration/lv/canaries.test.ts). This module reads LensVisualizer only through the exports it names, and
// imports nothing of the rays generators, so that it adds nothing but itself to `lv`'s closure.
import type { LvCaseModel } from "./caseModel.ts";
import type { LvChiefGeometry } from "./chiefSetup.ts";
import type { LvAnalysisRequest, LvApi, LvOffAxisFieldGeometry } from "./types.ts";

/** The LensVisualizer exports the fields are decided with. */
export type LvChiefFieldsApi = Pick<
  LvApi,
  | "projectionLaunchSlopeForField"
  | "solveChiefRayForRuntimeLens"
  | "computeOffAxisFieldGeometry"
  | "uniformFieldFraction"
  | "pupilAberrationSampleCount"
  | "lateralColorFieldFractions"
>;

/** Why a field's chief ray is no ray of a chief set: the problem code of the set, and what it says. */
export interface LvChiefFieldRefusal {
  readonly code: "lv-vector-launch" | "lv-no-launch";
  readonly message: string;
}

/** A solved chief ray's meridional launch: where it crosses the first vertex plane, and its slope. */
export interface LvSolvedChiefLaunch {
  readonly yLaunch: number;
  readonly uField: number;
}

/** Whether a field's decision is a refusal. */
export function isChiefFieldRefusal(made: object): made is LvChiefFieldRefusal {
  return "code" in made;
}

/**
 * The launch of a field's solved chief ray, or why a chief set has none: restated from
 * `chiefRayImageHeightAccurateWithTransfer` in imageHeight.ts (the distortion curve's edge and samples) and from
 * `computeBothPupilAberrationProfiles` (the pupils tab), which both launch
 *
 * ```
 * const launch = projectionLaunchSlopeForField({ projection: state.lens.projection.config }, fieldAngleDeg);
 * const solve = solveChiefRay(state, { fieldAngleDeg, geometry });
 * prepared.ray(solve.yLaunch, launch.uField)
 * ```
 *
 * where `solve.vectorLaunch` is not set. A field LensVisualizer launches from a bounding sphere with a launch bound is
 * `lv-vector-launch`; one without a slope `lv-no-launch`.
 */
export function lvSolvedChief(
  api: Pick<LvChiefFieldsApi, "projectionLaunchSlopeForField" | "solveChiefRayForRuntimeLens">,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
  fieldAngleDeg: number,
  named: string,
): LvSolvedChiefLaunch | LvChiefFieldRefusal {
  const { state, runtime } = model;
  const launch = api.projectionLaunchSlopeForField(runtime, fieldAngleDeg);
  const solve = api.solveChiefRayForRuntimeLens(fieldAngleDeg, state.focusT, state.zoomT, runtime, geometry, 0);
  if (solve.vectorLaunch !== undefined) {
    const message = `LensVisualizer launches ${named} at ${fieldAngleDeg} degrees from a bounding sphere with a launch bound, which a rays.trace request does not state`;
    return { code: "lv-vector-launch", message };
  }
  if (launch.status === "out-of-domain") {
    return { code: "lv-no-launch", message: `LensVisualizer has no slope for ${named} at ${fieldAngleDeg} degrees` };
  }
  return { yLaunch: solve.yLaunch, uField: launch.uField };
}

/** One field of a tab, its angle and its chief ray's launch, or why a chief set has none. */
export interface LvChiefField<Launch> {
  readonly fieldAngleDeg: number;
  readonly made: Launch | LvChiefFieldRefusal;
}

/**
 * The fields the pupils tab traces off the axis, in its order, each with its solved chief ray's launch or why a chief
 * set has none; restated from `computeBothPupilAberrationProfiles` in pupilAberration.ts, with no count of the
 * drawer's:
 *
 * ```
 * const sampleCount = request.sampling.pupilAberrationSampleCount ?? PUPIL_ABERRATION_SAMPLE_COUNT;
 * const n = Math.max(sampleCount, 2);
 * const fieldFrac = uniformFieldFraction(i, n);
 * const fieldDeg = fieldFrac * halfFieldDeg;
 * if (launch.status === "out-of-domain" && !solve.vectorLaunch) {
 * if (Math.abs(fieldDeg) > 1e-9) {
 * ```
 *
 * A field without a slope and without a vector launch is no field of the tab, and the axis is none either (its exit
 * pupil there is the paraxial one).
 */
export function lvPupilFields(
  api: LvChiefFieldsApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
): LvChiefField<LvSolvedChiefLaunch>[] {
  const { state, runtime } = model;
  const n = Math.max(api.pupilAberrationSampleCount, 2);
  const fields: LvChiefField<LvSolvedChiefLaunch>[] = [];
  for (let i = 0; i < n; i++) {
    const fieldDeg = api.uniformFieldFraction(i, n) * geometry.halfFieldDeg;
    const launch = api.projectionLaunchSlopeForField(runtime, fieldDeg);
    const solve = api.solveChiefRayForRuntimeLens(fieldDeg, state.focusT, state.zoomT, runtime, geometry, 0);
    if (launch.status === "out-of-domain" && solve.vectorLaunch === undefined) continue;
    if (!(Math.abs(fieldDeg) > 1e-9)) continue;
    fields.push({
      fieldAngleDeg: fieldDeg,
      made: lvSolvedChief(api, model, geometry, fieldDeg, "a chief ray of the pupils tab"),
    });
  }
  return fields;
}

/** `normalizeFractions` of chromatic/analysis.ts with `allowZero: true`, restated. */
export function lvLateralFractions(api: Pick<LvChiefFieldsApi, "lateralColorFieldFractions">): number[] {
  const values = api.lateralColorFieldFractions
    .filter((value) => isFinite(value) && value >= 0)
    .map((value) => Math.max(0, Math.min(1, value)));
  return Array.from(new Set(values));
}

/** The coma tab's scalar geometry of a field: a collimated launch of a slope, crossing the first vertex at a height. */
export type LvScalarOffAxisField = Exclude<LvOffAxisFieldGeometry, { readonly kind: "vector" }>;

/**
 * The lateral-colour section's chief ray at a fraction of the half field, the coma tab's chief ray
 * (`computeOffAxisFieldGeometry`, which `computeLateralColorField` asks for its fraction), or why a chief set has
 * none: no geometry (`lv-no-launch`), or a launch from a bounding sphere (`lv-vector-launch`).
 */
export function lvLateralChief(
  api: Pick<LvChiefFieldsApi, "computeOffAxisFieldGeometry">,
  request: LvAnalysisRequest,
  geometry: LvChiefGeometry,
  fraction: number,
): LvScalarOffAxisField | LvChiefFieldRefusal {
  const field = api.computeOffAxisFieldGeometry(request.preparedGeometry, fraction, geometry);
  if (field === null) {
    const message = `LensVisualizer has no launch for the lateral-colour chief ray at the fraction ${fraction} of the half field`;
    return { code: "lv-no-launch", message };
  }
  if (field.kind === "vector") {
    const message = `LensVisualizer launches the lateral-colour chief ray at the fraction ${fraction} from a bounding sphere with a launch bound, which a rays.trace request does not state`;
    return { code: "lv-vector-launch", message };
  }
  return field;
}
