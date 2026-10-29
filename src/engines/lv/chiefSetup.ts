// What LensVisualizer's distortion tab, its pupils tab and the lateral-colour section of its chromatic tab are asked
// with for a case: the request the analysis drawer hands them and the rectilinear reference of the distortion tab.
// Shared by the chief sets (chiefRaySets.ts) and the engine's answer of the tabs (chief.ts), which keeps the engine's
// closure to what it answers with. Every restated line has a source canary (test/integration/lv/canaries.test.ts).
import type { LvCaseModel } from "./caseModel.ts";
import { lvSpotSetup, lvTabPupilSemiDiameter } from "./spotSetup.ts";
import type { LvHookApi } from "./tabRequest.ts";
import type { LvAnalysisRequest, LvApi, LvFieldGeometry, LvProjectionReference } from "./types.ts";

/** The LensVisualizer exports the request and the reference are made with. */
export type LvChiefSetupApi = LvHookApi &
  Pick<
    LvApi,
    | "createAnalysisRequest"
    | "chiefRayImageHeightForRuntimeLens"
    | "projectionLaunchSlopeForField"
    | "distortionProjectionReferenceForLens"
  >;

/** The field geometry of a state as the tabs read it: the half field, degrees, and the paraxial pupil's ratio. */
export interface LvChiefGeometry extends LvFieldGeometry {
  readonly halfFieldDeg: number;
  readonly epRatio: number;
}

/**
 * The request the drawer hands the three tabs for a case, restated from AnalysisDrawerContent.tsx as for the coma
 * tab (`tabRequest` in spot.ts) and the axial sections (`sectionRequest` in axial.ts): the prepared state, the two
 * radii, the hook's field geometry, the quality "settled", whose sampling is every family default. `dynamicEFL` is
 * 0: no tab of the three reads it for what is compared (the distortion tab's breathing readout reads it, and is not
 * compared here). The distortion tab's own request, made where the drawer hands it no context, is the same but for
 * its pupil radius (`currentEPSD: L.EP.epSD`), which neither its curve nor its grid reads.
 */
export function lvChiefRequest(api: LvChiefSetupApi, model: LvCaseModel): LvAnalysisRequest {
  return api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: lvTabPupilSemiDiameter(api, model),
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: lvSpotSetup(api, model).fieldGeometry,
    sampling: {},
  });
}

/** The field geometry the drawer hands the tabs, with the two members they read; null without a half field. */
export function lvChiefGeometry(api: LvChiefSetupApi, model: LvCaseModel): LvChiefGeometry | null {
  const geometry = lvSpotSetup(api, model).fieldGeometry as Partial<LvChiefGeometry> & LvFieldGeometry;
  const { halfFieldDeg, epRatio } = geometry;
  if (halfFieldDeg === undefined || epRatio === undefined) return null;
  if (!(halfFieldDeg > 0 && isFinite(halfFieldDeg)) || !isFinite(epRatio)) return null;
  return geometry as LvChiefGeometry;
}

/** The rectilinear reference of the distortion tab: its near-axis probe, the scale it gives, the ideal mapping. */
export interface LvDistortionReference {
  /** The field angle of the probe, degrees. */
  readonly probeAngleDeg: number;
  /** The probe's object-plane slope: `-tan` of its angle. */
  readonly probeSlope: number;
  /** Where LensVisualizer's paraxially launched chief ray of the probe lands, mm. */
  readonly probeImageHeight: number;
  /** The scale of the rectilinear reference, mm: the probe's height over the tangent of its angle, negated. */
  readonly rectilinearScale: number;
  readonly projectionReference: LvProjectionReference;
}

/**
 * The rectilinear reference of the distortion tab for a case, restated from `computeDistortionReference` in
 * distortion.ts, whose geometry is the drawer's and whose `zPos` the state's own vertices:
 *
 * ```
 * const scaleProbeAngleDeg = Math.min(Math.max(geometry.halfFieldDeg * 0.01, 0.02), 0.5);
 * const probeImageHeight = chiefRayImageHeight(scaleProbeAngleDeg, zPos, focusT, zoomT, L, geometry, aberrationT);
 * const probeLaunch = projectionLaunchSlopeForField(L, scaleProbeAngleDeg);
 * if (probeLaunch.status === "out-of-domain") return null;
 * const probeTan = -probeLaunch.uField;
 * if (!isFinite(probeImageHeight) || Math.abs(probeTan) < 1e-12) return null;
 *
 * const rectilinearScale = -probeImageHeight / probeTan;
 * if (!isFinite(rectilinearScale) || Math.abs(rectilinearScale) < 1e-9) return null;
 *
 * const projectionReference = distortionProjectionReferenceForLens(L, rectilinearScale, zoomT);
 * ```
 *
 * with `chiefRayImageHeight` the barrel's `chiefRayImageHeightForRuntimeLens`. Null where the tab has no reference:
 * no probe, or a scale that is no number or too small. A fisheye lens has no probe (its declared law is its
 * reference) and is not asked here.
 */
export function lvDistortionReference(
  api: LvChiefSetupApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
): LvDistortionReference | null {
  const { state, runtime: L } = model;
  const { focusT, zoomT } = state;
  const aberrationT = 0;
  const zPos = [...state.z];
  const scaleProbeAngleDeg = Math.min(Math.max(geometry.halfFieldDeg * 0.01, 0.02), 0.5);
  const probeImageHeight = api.chiefRayImageHeightForRuntimeLens(
    scaleProbeAngleDeg,
    zPos,
    focusT,
    zoomT,
    L,
    geometry,
    aberrationT,
  );
  const probeLaunch = api.projectionLaunchSlopeForField(L, scaleProbeAngleDeg);
  if (probeLaunch.status === "out-of-domain") return null;
  const probeTan = -probeLaunch.uField;
  if (!isFinite(probeImageHeight) || Math.abs(probeTan) < 1e-12) return null;
  const rectilinearScale = -probeImageHeight / probeTan;
  if (!isFinite(rectilinearScale) || Math.abs(rectilinearScale) < 1e-9) return null;
  const projectionReference = api.distortionProjectionReferenceForLens(L, rectilinearScale, zoomT);
  return {
    probeAngleDeg: scaleProbeAngleDeg,
    probeSlope: probeLaunch.uField,
    probeImageHeight,
    rectilinearScale,
    projectionReference,
  };
}
