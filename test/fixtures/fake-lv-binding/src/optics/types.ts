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
  /** The fake's field axis: image height per degree, the angle its model reaches, a format corner, and its limits. */
  field?: {
    mmPerDeg?: number;
    edgeDeg?: number;
    referenceHeightMm?: number;
    chiefLimitDeg?: number;
    unsolvedFraction?: number;
  };
  /** Absorption of every glass of the lens, per mm. */
  absorptionPerMm?: number;
  /** An annulus of one surface in which the fake's tracer "does not converge". */
  unresolvedZone?: { surface: number; inner: number; outer: number };
}

export type Vec3 = [number, number, number];

export interface FakeTraceOptions {
  recordOpticalPath?: boolean;
  stopAt?: number;
  checkSemiDiameter?: boolean;
  stopSemiDiameter?: number;
  stopOnClip?: boolean;
  indexAtSurface?: (surfaceIndex: number, nd: number) => number;
  wavelengthNm?: number;
  directionNormalized?: boolean;
}

export interface FakeTraceHit {
  surfaceIndex: number;
  surfaceLabel: string;
  point: Vec3;
  normal: Vec3;
  incidentDirection: Vec3;
  outgoingDirection?: Vec3;
  radius: number;
  clipped: boolean;
  failureReason: string | null;
}

export interface FakeTraceResult {
  opticalPathLengthMm?: number;
  input: { origin: Vec3; direction: Vec3 };
  hits: FakeTraceHit[];
  terminalPoint: Vec3;
  terminalDirection: Vec3;
  terminalSurfaceIndex: number;
  finalMedium: number;
  status: "ok" | "clipped" | "failed";
  failureReason: string | null;
  reachedImagePlane: boolean;
}

export interface FakeFieldLaunch {
  fieldAngleDeg: number;
  direction: Vec3;
  objectPoint?: Vec3;
  leadZ: number;
  centerY: number;
}

export interface FakeFootprint {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  beamWidthMm: number;
  beamHeightMm: number;
  guardMm: number;
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
