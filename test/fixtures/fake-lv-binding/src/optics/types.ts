// Imported with `import type` only, so this file is never loaded and is not part of the engine closure.
export interface FakeSurfaceData {
  label: string;
  R: number;
  d: number;
  nd: number;
  sd: number;
  asphere?: Record<string, number>;
  synthetic?: "rearPlate";
}

export interface FakeLensData {
  key: string;
  name: string;
  surfaces: FakeSurfaceData[];
  rearPlate?: { d: number; nd: number; gap: number; sd: number };
  focusTravel?: number;
  zoomPositions?: number[];
  zoomStopSDs?: number[];
  zoomGaps?: number[];
  fopen?: number;
}

export interface FakeRuntimeLens {
  data: FakeLensData;
  surfaces: readonly FakeSurfaceData[];
  lastLensSurfaceIdx: number;
  isZoom: boolean;
  stopIndex: number;
  stopPhysSD: number;
  zoomStopSDs: readonly number[] | null;
  FOPEN: number;
}

export interface FakeStateSurface {
  label: string;
  R: number;
  d: number;
  nd: number;
  sd: number;
  innerSd: number | null;
  elemId: number;
  asphere: Record<string, number> | null;
  profile: { kind: string; sag(radius: number): number; slope(radius: number): number };
  source: FakeSurfaceData;
  z: number;
}

export interface FakeState {
  lens: { key: string; runtime: FakeRuntimeLens; stop: { surfaceIndex: number }; flags: { isZoom: boolean } };
  focusT: number;
  zoomT: number;
  surfaces: readonly FakeStateSurface[];
  z: readonly number[];
  imgZ: number;
  totalTrack: number;
}
