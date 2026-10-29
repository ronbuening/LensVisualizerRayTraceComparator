// Imported with `import type` only, so this file is never loaded and is not part of the engine closure.
export interface FakeSurfaceData {
  diffractive?: { kind: "radial-polynomial"; referenceWavelengthNm: number; diffractionOrder: number; quadraticCoefficient: number; terms: { radialPower: number; coefficient: number; derivativeCoefficient: number }[] };
  label: string;
  R: number;
  d: number;
  nd: number;
  sd: number;
  /** A folded visit's transparent hole, as LV's `innerSd`. */
  innerSd?: number;
  interaction?: { type: "reflect" | "refract"; incidentSide?: string; inactiveSide?: string };
  asphere?: Record<string, number>;
  synthetic?: "rearPlate";
  /** False only on a rear plate whose rim the fake generated: it clips no ray, and its `sd` is an envelope. */
  clips?: false;
  /** A flat rim cut, as LV #928: the land's depth from the vertex and the radius where the cap meets it. */
  rimCut?: { depthMm: number; radius: number };
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
  // The line every element's authored indices are of, where the lens states one: LV states it per element.
  indexReference?: string;
  surfaces: FakeSurfaceData[];
  /** A plate behind the lens. Without a published `sd` the fake generates a rim, which does not clip. */
  rearPlate?: { d: number; nd: number; gap: number; sd?: number };
  focusTravel?: number;
  schema: 2;
  opticalPath?: { mode: "sequential" | "auto"; surfaceOrder: number[]; maxInteractions: number; after?: number[] };
  imageZ?: number;
  zoom?: { stations: unknown[] };
  zoomStopSDs?: number[];
  zoomGaps?: number[];
  fopen?: number;
  /** The largest f-number the fake's aperture slider reaches; 16 without it. */
  maxFstop?: number;
  /** The height of a ray at the stop per unit of height at the entrance pupil; 1 without it. */
  pupilRatio?: number;
  conjugates?: FakeFiniteConjugate[];
  noDispersionData?: boolean;
  /** The fake's gate refuses the lens every MTF: its scale is "unverified". */
  unverifiedScale?: boolean;
  /** What the fake's product MTF says of the lens beside its curves. */
  mtf?: {
    unconvergedFraction?: number;
    clippedChiefFraction?: number;
    /** The surface the fake says vignettes the axial marginal ray, after the stop; none without it. */
    axialVignettingLabel?: string;
    /** True: the geometric MTF is sampled, grid by grid, from the fake's own bundles, and is no closed form. */
    sampled?: boolean;
    /** The share of the beam the fake's footprint scan finds; 1 without it. */
    footprintScale?: number;
    /** Beyond this fraction of the stop radius the fake's aim finds no ray: the cells are "unaimed". */
    unaimedBeyond?: number;
    /** Beyond this fraction of the stop radius the fake's aim is "blocked" ahead of the stop, at surface 0. */
    blockedBeyond?: number;
    /** Beyond this field angle, degrees, the fake's aim finds no ray at all: every cell and the chief "unaimed". */
    unaimedBeyondDeg?: number;
  };
  /** The fake's field axis: image height per degree, the angle its model reaches, a format corner, and its limits. */
  field?: {
    mmPerDeg?: number;
    edgeDeg?: number;
    referenceHeightMm?: number;
    chiefLimitDeg?: number;
    /** Beyond this field angle the fake "launches from a bounding sphere". */
    vectorBeyondDeg?: number;
    unsolvedFraction?: number;
  };
  /** Absorption of every glass of the lens, per mm. */
  absorptionPerMm?: number;
  /** The fraction of the half field the coma fans are drawn at; 0.7 without it. */
  offAxisFieldFrac?: number;
  /** The fake's projection law; rectilinear without it. */
  projection?: { kind: string };
  /** True: the fake samples the lens's ray work coarsely, as LV does a heavy lens. */
  heavy?: boolean;
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
  recordHeights?: boolean;
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
  /** One height per visit with a found intersection, recorded or passive: LV's recordHeights. */
  heights?: number[] | null;
  /** The surface of each clip or failure, as LV's diagnostics list them. */
  diagnostics?: { clipEvents: { surfaceIdx: number | null }[] };
}

export interface FakeFieldLaunch {
  fieldAngleDeg: number;
  direction: Vec3;
  objectPoint?: Vec3;
  leadZ: number;
  centerY: number;
  /** The field as the fake's aimed launch takes it; null beyond `field.vectorBeyondDeg`, a "bounding sphere". */
  aim:
    | { uField: number; yChief: number }
    | { kind: "finite-object"; objectPoint: Vec3; leadZ: number; chiefLaunch?: readonly [number, number] }
    | null;
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
  source: FakeLensData;
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
  elements: readonly { id: number; absorptionCoefficientPerMm?: number; indexReference?: string }[];
  offAxisFieldFrac?: number;
  projection: { kind: string };
}

export interface FakeStateSurface {
  physicalIndex: number;
  label: string;
  R: number;
  d: number;
  nd: number;
  sd: number;
  innerSd: number | null;
  clips: boolean;
  rimCut: { depthMm: number; sag: number; radius: number } | null;
  elemId: number;
  asphere: Record<string, number> | null;
  diffractive: FakeSurfaceData["diffractive"] | null;
  interaction: { type: "refract" | "reflect"; incidentSide?: string; inactiveSide?: string };
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
  readonly traceGeometry: { readonly stopSurfaceIndex: number };
  lens: {
    key: string;
    runtime: FakeRuntimeLens;
    stop: { surfaceIndex: number };
    flags: { isZoom: boolean; isFoldedOptics: boolean };
    projection: { kind: "rectilinear"; config: { kind: string; vectorBeyondDeg?: number } };
    constants: { rayLead?: number };
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
  pupilSampling: "stop" | "launch-plane";
  gridSize: number;
  validRays: number;
  blockedRays: number;
  failedRays: number;
  unaimedRays: number;
  unresolvedInBeamRays: number;
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
  axialVignetting: { surfaceLabel: string; beforeStop: boolean } | null;
}
