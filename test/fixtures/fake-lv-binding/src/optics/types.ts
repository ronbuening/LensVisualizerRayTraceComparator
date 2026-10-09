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
  /** The largest f-number the fake's aperture slider reaches; 16 without it. */
  maxFstop?: number;
  /** The height of a ray at the stop per unit of height at the entrance pupil; 1 without it. */
  pupilRatio?: number;
  finiteConjugates?: FakeFiniteConjugate[];
  noDispersionData?: boolean;
  /** The fake's gate refuses the lens every MTF: its scale is "unverified". */
  unverifiedScale?: boolean;
  /** What the fake's product MTF says of the lens beside its curves. */
  mtf?: {
    unconvergedFraction?: number;
    clippedChiefFraction?: number;
    limitingSurfaceLabel?: string;
    /** True: the geometric MTF is sampled, grid by grid, from the fake's own bundles, and is no closed form. */
    sampled?: boolean;
    /** The share of the beam the fake's footprint scan finds; 1 without it. */
    footprintScale?: number;
  };
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
  maxFstop: number;
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
  method: "geometric" | "diffraction";
  spectrum: "reference" | "cdf" | "photopic";
  pupilSemiDiameterMm: number;
  stopSemiDiameterMm: number;
  focus: "auto" | "design" | "best-axial";
  movementActive?: boolean;
  fieldFractions?: readonly number[];
  frequenciesPerMm?: readonly number[];
  maxGridSize?: number;
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

export interface FakeMtfFieldResult {
  fieldFraction: number;
  targetImageHeightMm: number | null;
  fieldAngleDeg: number | null;
  imageHeightMm: number | null;
  sagittal: number[];
  tangential: number[];
  status: "converged" | "unconverged" | "unavailable" | "pending";
  reason: string | null;
  message: string;
  notes: string[];
  gridSize: number;
  validRays: number;
  blockedRays: number;
  failedRays: number;
  unknownFluxFraction: number;
  maxDelta: number | null;
  convergedThroughLpMm: number | null;
}

export interface FakeMtfResult {
  method: string;
  spectrum: string;
  support: FakeMtfSupport;
  frequenciesPerMm: number[];
  fields: FakeMtfFieldResult[];
  geometry: unknown;
  focus: { requestedMode: string; mode: string; appliedShiftMm: number; bestAxialShiftMm: number | null } | null;
  aperture: { tracedFNumber: number; limitingSurfaceLabel: string | null } | null;
}
