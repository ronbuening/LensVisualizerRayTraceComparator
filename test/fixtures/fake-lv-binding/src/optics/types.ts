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

export interface FakeFiniteConjugate {
  focusT: number;
  zoomT: number;
  objectDistanceMm: number;
  distanceReference: "first-surface" | "image-plane";
  source: string;
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
  finiteConjugates?: FakeFiniteConjugate[];
  noDispersionData?: boolean;
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
  EP: { epSD: number };
  epZRelStop: number;
  xpZRelLastSurf: number;
  xpSD: number;
  elements: readonly { id: number; absorptionCoefficientPerMm?: number }[];
}

export interface FakeStateSurface {
  physicalIndex: number;
  label: string;
  R: number;
  d: number;
  nd: number;
  sd: number;
  innerSd: number | null;
  elemId: number;
  asphere: Record<string, number> | null;
  diffractive: null;
  interaction: { type: "refract" };
  profile: {
    kind: string;
    sag(radius: number): number;
    slope(radius: number): number;
    finiteRadiusLimit(): number | null;
  };
  source: FakeSurfaceData;
  z: number;
}

export interface FakeState {
  lens: {
    key: string;
    runtime: FakeRuntimeLens;
    stop: { surfaceIndex: number };
    flags: { isZoom: boolean; isFoldedOptics: boolean };
    projection: { kind: "rectilinear" };
  };
  focusT: number;
  zoomT: number;
  surfaces: readonly FakeStateSurface[];
  z: readonly number[];
  imagePlane: { point: [number, number, number]; normal: [number, number, number] };
  imgZ: number;
  totalTrack: number;
}

export interface FakeMtfOptions {
  spectrum: "reference" | "cdf" | "photopic";
  pupilSemiDiameterMm: number;
  stopSemiDiameterMm: number;
}

export interface FakeMtfSupport {
  available: boolean;
  reason: string | null;
  message: string;
  referenceWavelengthNm: number;
  useResolvedReference: boolean;
  spectralLines: { wavelengthNm: number; weight: number }[];
  conjugate?: FakeFiniteConjugate;
  limitations: string[];
}
