// The fake's summary tab, under LV's name: its readouts of a request, in LV's shape. Its focus distance and its
// telephoto ratio are the fake's own rules, deliberately not LV's; every other readout is the request's or the state's,
// as LV's tab reads them.
import { computeCardinalElementsFromState } from "../first-order/cardinals.js";
import { paraxialTrace } from "../first-order/lensConstants.js";
import { prepareRuntimeState } from "../state/runtime.js";
import type { FakeAnalysisRequest } from "./request.js";

function finiteOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function computeOpticalSummary(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const L = state.lens.runtime;
  const currentEFLMm = finiteOrNull(request.dynamicEFL);
  const infinity = prepareRuntimeState(L, 0, state.zoomT);
  const infinityEFLMm = finiteOrNull(-1 / paraxialTrace(infinity.surfaces, 1, 0, { skipLastTransfer: true }).u);
  const { entrancePupilSemiDiameterMm: pupil, stopSemiDiameterMm: stop } = request.aperture;
  const entrancePupilDiameterMm = pupil > 0 ? 2 * pupil : null;
  const geometry = request.fieldGeometry as { halfFieldDeg?: number } | null;
  const halfFieldDeg = finiteOrNull(geometry?.halfFieldDeg);
  const cardinals = computeCardinalElementsFromState(state) as {
    points: Record<string, { z: number }>;
    distances: Record<string, { valueMm: number }>;
  } | null;
  const totalTrackMm = state.imgZ - state.z[0];
  return {
    currentEFLMm,
    infinityEFLMm,
    breathingPercent:
      currentEFLMm !== null && infinityEFLMm !== null ? (100 * (currentEFLMm - infinityEFLMm)) / infinityEFLMm : null,
    effectiveFNumber:
      currentEFLMm !== null && entrancePupilDiameterMm !== null ? Math.abs(currentEFLMm) / entrancePupilDiameterMm : null,
    entrancePupilDiameterMm,
    physicalStopDiameterMm: stop > 0 ? 2 * stop : null,
    halfFieldDeg,
    fullFieldDeg: halfFieldDeg === null ? null : 2 * halfFieldDeg,
    focusDistanceM: state.focusT > 0 ? 0.5 / state.focusT : null,
    zoomT: state.zoomT,
    focusT: state.focusT,
    aberrationT: 0,
    imagePlaneZMm: state.imgZ,
    totalTrackMm,
    telephotoRatio: currentEFLMm === null ? null : totalTrackMm / (2 * Math.abs(currentEFLMm)),
    surfaceCount: state.surfaces.length,
    rearPlateCount: 0,
    rearPlateThicknessMm: 0,
    opticalPath: state.lens.flags.isFoldedOptics ? "folded" : "sequential",
    cardinalEFLMm: finiteOrNull(cardinals?.distances.efl.valueMm),
    bfdMm: finiteOrNull(cardinals?.distances.bfd.valueMm),
    ffdMm: cardinals === null ? null : state.z[0] - cardinals.points.frontFocal.z,
    principalHiatusMm:
      cardinals === null ? null : cardinals.points.frontPrincipal.z - cardinals.points.rearPrincipal.z,
  };
}
