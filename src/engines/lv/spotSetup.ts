// What LensVisualizer's coma and bokeh tabs are asked with for a case: the pupil radius they sample, the field
// geometry of the state and the detail field of the coma fans. Shared by the spot sets (spotRaySets.ts) and the
// engine's answer of the tabs (spot.ts), which keeps the engine's closure to what it answers with.
import type { LvCaseModel } from "./caseModel.ts";
import { lvDrawerPupil } from "./tabRequest.ts";
import type { LvHookApi } from "./tabRequest.ts";
import type { LvAnalysisRequest, LvApi, LvFieldGeometry } from "./types.ts";

/** What the tabs are asked with for a case. */
export interface LvSpotSetup {
  /** The radius of the pupil the tabs sample, mm: the hook's entrance pupil for the case's stop radius. */
  readonly pupilSemiDiameterMm: number;
  /** The field geometry of the state, as the analysis drawer hands it to the tabs. */
  readonly fieldGeometry: LvFieldGeometry;
  /** The field of the coma tab's two fans, a fraction of the half field: the lens's authored off-axis field. */
  readonly detailFieldFraction: number;
}

/**
 * The pupil radius the analysis drawer hands every tab for a case, mm: the hook's paraxial entrance pupil for the
 * case's stop radius (`lvDrawerPupil`, LV #933). For a case that is the drawer's, it is the tabs' own `currentEPSD`.
 */
export function lvTabPupilSemiDiameter(api: LvHookApi, model: LvCaseModel): number {
  const { state, runtime, exported } = model;
  return lvDrawerPupil(api, runtime, state, exported.conditions.stopSemiDiameter);
}

/**
 * What the tabs are asked with for a case.
 *
 * - The pupil radius is the one the hook hands the analysis drawer for the case's stop radius (`lvDrawerPupil`): for a
 *   case that is the drawer's, the tabs' own.
 * - The field geometry is the hook's (`computeAnalysisFieldGeometryAtState` of the state, the aberration control
 *   neutral), which the drawer hands every tab; the coma tab reads it, and computes the same itself without it.
 * - The detail field of the coma fans is the tab's default, `comaDetailFieldFraction` with no sampling of its own,
 *   restated from coma.ts:
 *
 * ```
 * const candidate = sampling.comaDetailFieldFraction ?? L.offAxisFieldFrac;
 * return isFinite(candidate) && candidate >= 0 && candidate <= 1 ? candidate : L.offAxisFieldFrac;
 * ```
 */
export function lvSpotSetup(api: LvHookApi, model: LvCaseModel): LvSpotSetup {
  const { state, runtime } = model;
  const pupilSemiDiameterMm = lvTabPupilSemiDiameter(api, model);
  const fieldGeometry = api.computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, runtime, 0);
  const authored = runtime.offAxisFieldFrac as number;
  const candidate = authored;
  const detailFieldFraction = isFinite(candidate) && candidate >= 0 && candidate <= 1 ? candidate : authored;
  return { pupilSemiDiameterMm, fieldGeometry, detailFieldFraction };
}

/**
 * The analysis request the drawer hands the tabs for the case, restated from AnalysisDrawerContent.tsx: the prepared
 * state, the two radii (the case's stop radius, and the pupil radius of `lvSpotSetup`, which LensVisualizer's aimed
 * launch takes for the scale of its probes), the hook's field geometry, the quality "settled", whose sampling is every
 * family default. `dynamicEFL` is 0, as in `lvMtfInputs`: no tab of rays reads it. LensVisualizer's aimed launch reads
 * only the prepared state and the two radii of it.
 */
export function lvSpotRequest(
  api: Pick<LvApi, "createAnalysisRequest">,
  model: LvCaseModel,
  setup: LvSpotSetup,
): LvAnalysisRequest {
  return api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: setup.pupilSemiDiameterMm,
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: setup.fieldGeometry,
    sampling: {},
  });
}
