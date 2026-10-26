import type { FakeState } from "../types.ts";
export interface FakeAnalysisRequest {
  readonly preparedGeometry: FakeState;
  readonly dynamicEFL: number;
  readonly aperture: { readonly entrancePupilSemiDiameterMm: number; readonly stopSemiDiameterMm: number };
  readonly pose: null;
  readonly fieldGeometry: unknown;
  readonly sampling: Readonly<Record<string, unknown>>;
}
export function createAnalysisRequest(params: {
  preparedState: FakeState;
  dynamicEFL: number;
  currentEPSD: number;
  currentPhysStopSD: number;
  fieldGeometry?: unknown;
  sampling?: Record<string, unknown>;
}): FakeAnalysisRequest {
  return {
    preparedGeometry: params.preparedState,
    dynamicEFL: params.dynamicEFL,
    aperture: { entrancePupilSemiDiameterMm: params.currentEPSD, stopSemiDiameterMm: params.currentPhysStopSD },
    pose: null,
    fieldGeometry: params.fieldGeometry ?? null,
    sampling: { ...(params.sampling ?? {}) },
  };
}
