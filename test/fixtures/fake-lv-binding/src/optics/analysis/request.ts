import type { FakeState } from "../types.ts";
export interface FakeAnalysisRequest {
  readonly preparedGeometry: FakeState;
  readonly dynamicEFL: number;
  readonly aperture: { readonly entrancePupilSemiDiameterMm: number; readonly stopSemiDiameterMm: number };
  readonly pose: null;
}
export function createAnalysisRequest(params: { preparedState: FakeState; dynamicEFL: number; currentEPSD: number; currentPhysStopSD: number }): FakeAnalysisRequest {
  return { preparedGeometry: params.preparedState, dynamicEFL: params.dynamicEFL,
    aperture: { entrancePupilSemiDiameterMm: params.currentEPSD, stopSemiDiameterMm: params.currentPhysStopSD }, pose: null };
}
