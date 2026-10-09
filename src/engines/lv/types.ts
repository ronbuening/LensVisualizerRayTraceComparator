// Local structural types for what the comparator reads from LensVisualizer. Nothing here is imported from the LV
// checkout, so the type check passes with no LV on disk. Each type lists only the members the comparator uses, as
// read from LV's sources (src/optics/types.ts, src/types/optics.ts, src/optics/trace/types.ts); the load-time
// probe of the binding checks that the functions exist, and the integration tests that the shapes still hold.

/** A point or direction: x sagittal, y meridional, z along the axis, in mm. */
export type LvVec3 = readonly [number, number, number];

/** A lens prescription file's default export. Only its identity is read here; the rest goes to `buildLens`. */
export interface LvLensData {
  readonly key: string;
  readonly name: string;
  /** Present with two or more entries on a zoom lens. */
  readonly zoomPositions?: readonly number[];
  readonly [member: string]: unknown;
}

/** One glass element of a lens, the members the comparator reads. */
export interface LvElement {
  readonly id: number;
  /** Beer-Lambert absorption of the glass per mm; above 0 it weights rays and bends none. */
  readonly absorptionCoefficientPerMm?: number;
}

/**
 * LV's frozen RuntimeLens. Never read `stopPhysSD` (zoom station 0 only) or `totalTrack` from it: the prepared
 * state holds the values of the current zoom and focus.
 */
export interface LvRuntimeLens {
  /** Index of the last authored surface; synthetic rear plates come after it. */
  readonly lastLensSurfaceIdx: number;
  readonly isZoom: boolean;
  /** The lens's elements, without those of synthetic rear plates. */
  readonly elements: readonly LvElement[];
  /** The largest f-number the lens stops down to: where its aperture slider ends. */
  readonly maxFstop: number;
  readonly [member: string]: unknown;
}

/** Aspheric terms: `K` and even `A4`..`A20`, optionally odd `A3`..`A19`; there is no `A2`. */
export type LvAsphere = Readonly<Record<string, number | undefined>>;

/** The geometry of one surface as functions of the radial height in mm. */
export interface LvSurfaceProfile {
  readonly kind: string;
  /** The sag at a height. Beyond `finiteRadiusLimit` it is a finite continuation that no glass occupies. */
  sag(radius: number): number;
  slope(radius: number): number;
  /**
   * The height at which the surface ends, where its conic stops being real, or null for a surface without such a
   * height. LV's intersection evaluates a point beyond it as no surface at all.
   */
  finiteRadiusLimit(): number | null;
}

/** One polynomial coefficient of LV's aspheric schema: its field name on an asphere and the power of the height. */
export interface LvAsphericTerm {
  readonly key: string;
  readonly power: number;
}

/**
 * One surface of a prepared state. `d` is the resolved gap after the surface, `nd` the index after it (air is
 * exactly 1), `sd` the hard clear semi-diameter and, on the stop surface, the runtime stop radius. LV's surface also
 * carries `source` and `base`, the authored records: they are deliberately absent here, because their `sd` is not
 * the runtime one. `syntheticKind` of the binding reads the one member of `source` that exists nowhere else.
 */
export interface LvSurface {
  /** The surface's index in the lens, which `evaluateAperture` compares with the stop index. */
  readonly physicalIndex: number;
  readonly label: string;
  /** Radius of curvature in mm; a plane is 1e15 (|R| > 1e10). */
  readonly R: number;
  readonly d: number;
  readonly nd: number;
  readonly sd: number;
  readonly innerSd: number | null;
  readonly elemId: number;
  readonly asphere: LvAsphere | null;
  /** A diffractive phase on the surface, or null: LV's sequential MTF path has none. */
  readonly diffractive: object | null;
  /** What the surface does to a ray: "refract" on an ordinary surface, "reflect" or "block" in a folded system. */
  readonly interaction: { readonly type: string };
  readonly profile: LvSurfaceProfile;
  /** Vertex position in mm; the first surface is at 0. */
  readonly z: number;
}

/** A plane: a point on it and its unit normal. */
export interface LvPlane {
  readonly point: LvVec3;
  readonly normal: LvVec3;
}

/** LV's PreparedOpticalState: a lens at one focus, zoom and aberration-control position. */
export interface LvPreparedState {
  readonly lens: {
    readonly key: string;
    readonly runtime: LvRuntimeLens;
    readonly stop: { readonly surfaceIndex: number };
    /** `isFoldedOptics` is true for a system whose path turns at a mirror. */
    readonly flags: Readonly<Record<string, boolean>>;
    /** How field angles map to image heights: "rectilinear", or a "fisheye-..." kind. */
    readonly projection: { readonly kind: string };
  };
  readonly focusT: number;
  readonly zoomT: number;
  readonly surfaces: readonly LvSurface[];
  readonly z: readonly number[];
  /** The image plane; its normal is +z in every system that is not folded. */
  readonly imagePlane: LvPlane;
  /** Image plane position: `z[last] + d[last]`, except in a folded system that authors its image plane. */
  readonly imgZ: number;
  readonly totalTrack: number;
}

/** A ray for `traceEngineRay2`. */
export interface LvRay {
  readonly origin: LvVec3;
  readonly direction: LvVec3;
}

/** LV's TraceOptions, the members the comparator sets. */
export interface LvTraceOptions {
  readonly recordOpticalPath?: boolean;
  readonly stopAt?: number;
  readonly checkSemiDiameter?: boolean;
  readonly stopSemiDiameter?: number;
  readonly stopOnClip?: boolean;
  readonly indexAtSurface?: LvIndexResolver;
  readonly wavelengthNm?: number;
  readonly directionNormalized?: boolean;
}

/** The index after a surface at one wavelength, given the surface's index and its authored `nd`. */
export type LvIndexResolver = (surfaceIndex: number, nd: number) => number;

/**
 * One surface a traced ray met, the members the comparator reads. A hit is `clipped` when the ray ends on it: beyond
 * the clear aperture, inside an annular hole, or totally reflected. A surface the ray could not be intersected with
 * has no hit at all.
 */
export interface LvTraceHit {
  readonly surfaceIndex: number;
  readonly point: LvVec3;
  readonly clipped: boolean;
}

/**
 * LV's EngineTraceResult, the members the comparator reads. A sequential trace ends on the last surface it met:
 * `terminalPoint` is that hit and `terminalDirection` the unit direction after it, never a point of the image
 * plane. `opticalPathLengthMm`, when it was asked for, is the sum of index times length from the ray's origin to
 * that hit. `status` is "clipped" for a ray an aperture stopped and "failed" whenever `failureReason` is set, which
 * a total internal reflection sets as well as an intersection that was not found.
 */
export interface LvTraceResult {
  readonly opticalPathLengthMm?: number;
  /** The ray as it was traced: its origin, and its direction after any normalisation. */
  readonly input: LvRay;
  readonly hits: readonly LvTraceHit[];
  readonly terminalPoint: LvVec3;
  readonly terminalDirection: LvVec3;
  readonly terminalSurfaceIndex: number;
  /** The index of the medium the ray is in where the trace ends. */
  readonly finalMedium: number;
  readonly status: "ok" | "clipped" | "failed";
  readonly failureReason: string | null;
  readonly reachedImagePlane: boolean;
}

/** The result of LV's meridional `traceRay2`. */
export interface LvMeridionalTraceResult {
  readonly pts: readonly (readonly number[])[];
  readonly y: number;
  readonly u: number;
  readonly clipped: boolean;
  readonly reachedImagePlane?: boolean;
}

/** A row of the paraxial kernel: any object with a radius, the index after the surface and the gap after it. */
export interface LvParaxialSurface {
  readonly R: number;
  readonly nd: number;
  readonly d: number;
}

/** Options of `traceParaxialSurfaces2`. */
export interface LvParaxialOptions {
  readonly stopAt?: number;
  readonly skipLastTransfer?: boolean;
  readonly recordHeights?: boolean;
}

/** A paraxial ray after the kernel: height in mm, slope, the index of the medium it is in. */
export interface LvParaxialResult {
  readonly y: number;
  readonly u: number;
  readonly n: number;
  readonly heights: readonly number[] | null;
}

/** The ABCD matrix of a system from first to last surface, with the index before and after it. */
export interface LvSystemMatrix {
  readonly A: number;
  readonly B: number;
  readonly C: number;
  readonly D: number;
  readonly objectIndex: number;
  readonly imageIndex: number;
}

/** What `buildCardinalElementsFromMatrix2` takes: a matrix and the positions it refers to. */
export interface LvCardinalInput extends LvSystemMatrix {
  readonly frontVertexZ: number;
  readonly rearVertexZ: number;
  /** The last lens vertex, from which back focus is measured; defaults to `rearVertexZ`. */
  readonly rearLensVertexZ?: number;
  readonly imagePlaneZ: number;
}

/**
 * LV's CardinalElements2, the members the comparator reads: positions and signed distances in mm. `bfd` is the rear
 * focal point's distance from `rearLensVertexZ`.
 */
export interface LvCardinalElements {
  readonly points: Readonly<
    Record<"frontFocal" | "rearFocal" | "frontPrincipal" | "rearPrincipal", { readonly z: number }>
  >;
  readonly distances: Readonly<Record<"efl" | "bfd", { readonly valueMm: number }>>;
  readonly frontVertexZ: number;
  readonly rearVertexZ: number;
  readonly rearLensVertexZ: number;
  readonly imagePlaneZ: number;
}

/** The result of `evaluateAperture`: where a hit lies against the surface's clear aperture. */
export interface LvApertureEvaluation {
  readonly state: "inside" | "inside-hole" | "outside";
  readonly radius: number;
  readonly semiDiameter: number | null;
  readonly innerSemiDiameter: number;
}

/**
 * LV's FieldGeometryState, which the comparator hands back to LV unread. `yRatio` is the height of a paraxial ray at
 * the stop per unit of height at the entrance pupil.
 */
export interface LvFieldGeometry {
  readonly yRatio: number;
  readonly [member: string]: unknown;
}

/** The result of `entrancePupilAtState2`. */
export interface LvEntrancePupil {
  readonly epSD: number;
  readonly yRatio: number;
  readonly b: number;
  readonly epRatio: number;
}

/** LV's MtfOptions; `method`, `spectrum` and `focus` take LV's own values, which the stage that uses them pins. */
export interface LvMtfOptions {
  readonly method: string;
  readonly spectrum: string;
  readonly pupilSemiDiameterMm: number;
  readonly stopSemiDiameterMm: number;
  readonly focus: unknown;
  readonly [member: string]: unknown;
}

/** One field of LV's MtfResult, the members the comparator reads. */
export interface LvMtfFieldResult {
  readonly fieldFraction: number;
  readonly targetImageHeightMm: number | null;
  /** The chief-ray field angle that reaches the target height, degrees; null where LV found none. */
  readonly fieldAngleDeg: number | null;
  /** The radial height at which the reference chief ray lands on the analysed plane; null without one. */
  readonly imageHeightMm: number | null;
  /** One value per frequency for frequency along image x; empty for a field without curves. */
  readonly sagittal: readonly number[];
  /** One value per frequency for frequency along image y; empty for a field without curves. */
  readonly tangential: readonly number[];
  /** "pending" only while a request is still being computed. */
  readonly status: "converged" | "unconverged" | "unavailable" | "pending";
  /** LV's MtfUnavailableReason for an unavailable field. */
  readonly reason: string | null;
  readonly message: string;
  readonly notes: readonly string[];
  /** Launch cells across the beam's larger side at the last grid LV refined the field to. */
  readonly gridSize: number;
  /** Summed over the lines of the spectrum. */
  readonly validRays: number;
  readonly blockedRays: number;
  readonly failedRays: number;
  readonly unknownFluxFraction: number;
  readonly maxDelta: number | null;
  readonly convergedThroughLpMm: number | null;
}

/** LV's MtfFocus: the plane a result is of, with its axial best-focus diagnostic. */
export interface LvMtfFocus {
  readonly requestedMode: string;
  /** The plane LV applied to every field: "design" or "best-axial". */
  readonly mode: string;
  /** The shift of that plane from the authored image plane, mm, positive away from the lens. */
  readonly appliedShiftMm: number;
  readonly bestAxialShiftMm: number | null;
}

/** LV's MtfAperture: the f-number the axial beam traces at, and the surface that bounds it when it is not the iris. */
export interface LvMtfAperture {
  readonly tracedFNumber: number;
  readonly limitingSurfaceLabel: string | null;
}

/**
 * LV's MtfResult, the members the comparator reads. `fields` is in the order of the request's fractions; it is
 * empty, and `focus` and `aperture` null, when `support` is not available.
 */
export interface LvMtfResult {
  readonly method: string;
  readonly spectrum: string;
  readonly support: LvMtfSupport;
  readonly frequenciesPerMm: readonly number[];
  readonly fields: readonly LvMtfFieldResult[];
  /** The field axis; null when no chief ray reaches the image. */
  readonly geometry: LvMtfFieldGeometry | null;
  readonly focus: LvMtfFocus | null;
  readonly aperture: LvMtfAperture | null;
}

/** What `resolveMtfSpectrum` gives: the spectrum the MTF tab requests, and its note when that is not the preferred. */
export interface LvMtfSpectrumChoice {
  readonly spectrum: string;
  readonly note: string | null;
}

/** LV's MtfPreferences: the options of its MTF tab, of which `DEFAULT_MTF_PREFERENCES` are the ones it opens with. */
export interface LvMtfPreferences {
  readonly method: string;
  /** The preferred spectrum: a lens without the glass data for it falls back to the reference line. */
  readonly spectrum: string;
  readonly focus: string;
  /** The spacing of the fields, in percent of the reference image height. */
  readonly fieldStepPercent: number;
  /** The frequencies the tab draws, cycles/mm: a selection of those it computes. */
  readonly frequencies: readonly number[];
  readonly maxGridSize: number;
  readonly compareF8: boolean;
}

/** One wavelength LV traces, with its incident intensity weight. */
export interface LvSpectralLine {
  readonly wavelengthNm: number;
  readonly weight: number;
}

/** One field's launch in LV's MTF sampling: its chief ray on the launch plane, shared by every line and grid. */
export interface LvMtfFieldLaunch {
  readonly fieldAngleDeg: number;
  /** The one direction of a collimated bundle; a finite source launches each ray from `objectPoint` instead. */
  readonly direction: LvVec3;
  readonly objectPoint?: LvVec3;
  /** The z of the launch plane, ahead of the first surface. */
  readonly leadZ: number;
  /** The chief ray's height on the launch plane. */
  readonly centerY: number;
}

/** The box of the launch plane, relative to the chief ray, that holds every transmitted ray of one field. */
export interface LvMtfFootprint {
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
  readonly beamWidthMm: number;
  readonly beamHeightMm: number;
  readonly guardMm: number;
}

/** LV's launch lattice over a footprint: square cells of side `step` from the corner (`x0`, `y0`). */
export interface LvMtfLaunchGrid {
  /** Always even, so that no sample lies on the meridional plane. */
  readonly columns: number;
  readonly rows: number;
  readonly step: number;
  readonly x0: number;
  readonly y0: number;
}

/** Where a ray lands on the image plane, with its transmitted weight. */
export interface LvMtfSpot {
  readonly x: number;
  readonly y: number;
  readonly weight: number;
}

/** LV's verdict on one traced pupil sample: it lands, an aperture stops it, or the tracer could not resolve it. */
export type LvMtfRayClass = "valid" | "blocked" | "failed";

/** One valid sample of an LV bundle: its landing, its lattice cell and the trace it came from. */
export interface LvMtfPupilRay extends LvMtfSpot {
  readonly column: number;
  readonly row: number;
  readonly trace: Pick<LvTraceResult, "input" | "terminalPoint" | "terminalDirection" | "finalMedium"> & {
    readonly opticalPathLengthMm?: number;
  };
}

/**
 * What LV's `traceMtfBundle` returns. When `mirrored` is true only the columns from `columns / 2` on were traced:
 * every other ray of `rays` is the mirror image in x of one that was, and `blocked` and `failed` count both.
 */
export interface LvMtfBundle {
  readonly rays: readonly LvMtfPupilRay[];
  readonly blocked: number;
  readonly failed: number;
  /** The launch flux of the rays LV could not resolve, in the units of the rays' weights. */
  readonly failedWeight: number;
  /** The reference point: where this line's chief ray lands with no aperture checked, or the reference handed in. */
  readonly chief: LvMtfSpot;
  readonly chiefClipped: boolean;
  readonly columns: number;
  readonly rows: number;
  readonly mirrored: boolean;
  readonly launchStepMm: number;
  /** The sides of the footprint in whose guard band a ray landed: flux may lie outside the box that was sampled. */
  readonly openBorders: LvMtfOpenBorders;
}

/** The sides of a footprint: both sides in x, which a footprint has alike, and the lower and the upper side in y. */
export interface LvMtfOpenBorders {
  readonly x: boolean;
  readonly y0: boolean;
  readonly y1: boolean;
}

/**
 * What LV's refinement makes of one field at one grid size: curves, with the sides of the footprint that were left
 * open, or no curves, and whether a finer grid may still have some.
 */
export type LvMtfGridOutcome =
  | { readonly kind: "curves"; readonly field: LvMtfFieldDraft; readonly openBorders?: LvMtfOpenBorders }
  | { readonly kind: "unavailable"; readonly field: LvMtfFieldDraft; readonly refine: boolean };

/** One field of an LV result while LV still writes it: `LvMtfFieldResult` with every member open to change. */
export type LvMtfFieldDraft = { -readonly [Member in keyof LvMtfFieldResult]: LvMtfFieldResult[Member] } & {
  sagittal: number[];
  tangential: number[];
  notes: string[];
};

/** LV's image-height axis for one state: the height of the 100 % field and how far the model reaches. */
export interface LvMtfFieldGeometry {
  readonly referenceHeightMm: number;
  readonly modeledEdgeHeightMm: number;
  readonly modeledEdgeAngleDeg: number;
  readonly chiefEdgeHeightMm: number;
  readonly chiefEdgeAngleDeg: number;
  readonly basis: string;
}

/** One requested image height as LV resolves it: a chief-ray angle, or why it has none. */
export interface LvMtfFieldTarget {
  readonly fraction: number;
  readonly targetImageHeightMm: number;
  /** Null when the height is outside the modeled field or the angle could not be solved. */
  readonly fieldAngleDeg: number | null;
  readonly outsideModel: boolean;
}

/** The radial image height of the chief ray at a field angle in degrees, or NaN where it has none. */
export type LvMtfChiefHeight = (fieldAngleDeg: number) => number;

/** A focus and zoom station whose object distance the lens's source documents: LV's FiniteConjugate. */
export interface LvFiniteConjugate {
  readonly focusT: number;
  readonly zoomT: number;
  readonly objectDistanceMm: number;
  readonly distanceReference: string;
}

/** LV's MtfSupport: whether its MTF path covers a state, and with which indices and lines. */
export interface LvMtfSupport {
  readonly available: boolean;
  /** LV's MtfUnavailableReason when `available` is false. */
  readonly reason: string | null;
  readonly message: string;
  readonly referenceWavelengthNm: number;
  /** True when the trace uses anchored per-wavelength indices instead of the authored `nd`. */
  readonly useResolvedReference: boolean;
  /** The lines of the spectrum that was asked for, the reference line first. */
  readonly spectralLines: readonly LvSpectralLine[];
  /** Set at a focus position other than infinity that LV certifies; never at infinity focus. */
  readonly conjugate?: LvFiniteConjugate;
  readonly limitations: readonly string[];
}

/** LV's standard spectral lines in nm, the ones the comparator reads. */
export interface LvLineNm {
  readonly C: number;
  readonly d: number;
  readonly e: number;
  readonly F: number;
  readonly g: number;
}

/**
 * What the comparator takes from LensVisualizer, by the name the import manifest gives each: the functions it calls
 * and one table of constants. The signatures are LV's, with the local types above; `LV_IMPORT_MANIFEST` says which
 * module exports each.
 */
export interface LvApi {
  buildLens(data: LvLensData): LvRuntimeLens;
  prepareRuntimeState(L: LvRuntimeLens, focusT: number, zoomT: number, aberrationT?: number): LvPreparedState;
  traceEngineRay2(state: LvPreparedState, ray: LvRay, options?: LvTraceOptions): LvTraceResult;
  traceRay2(
    y0: number,
    u0: number,
    zPos: number[],
    focusT: number,
    zoomT: number,
    stopSD: number | undefined,
    ghost: boolean,
    L: LvRuntimeLens,
    aberrationT?: number,
  ): LvMeridionalTraceResult;
  computeCardinalElements2(state: LvPreparedState): LvCardinalElements | null;
  /**
   * The entrance pupil of a stop radius at a state. `geometry` is a field geometry already computed for the state;
   * without it LV computes its own.
   */
  entrancePupilAtState2(
    stopSD: number,
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    geometry?: LvFieldGeometry,
    aberrationT?: number,
  ): LvEntrancePupil;
  /** The field geometry LV's analysis tabs share for a state, which its hook hands to `entrancePupilAtState2`. */
  computeAnalysisFieldGeometryAtState2(
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    aberrationT?: number,
  ): LvFieldGeometry;
  /** The marked f-number of an aperture-slider position, 0 for wide open, never below the widest of the zoom state. */
  fNumberAtStopdown(stopdownT: number, zoomT: number, L: LvRuntimeLens): number;
  fopenAtZoom2(zoomT: number, L: LvRuntimeLens): number;
  /**
   * LV's stored pupil constants at a zoom position, which it draws its pupil markers from. They are properties of
   * the lens at infinity focus and at its authored indices, and none of them is a paraxial image of the stop: the
   * entrance pupil's semi-diameter is nominal, focal length over twice the f-number, and the others come from real
   * rays near the axis. The two positions are relative to the stop vertex and to the last vertex.
   */
  epAtZoom2(zoomT: number, L: LvRuntimeLens): number;
  epZRelStopAtZoom(zoomT: number, L: LvRuntimeLens): number;
  xpZRelLastSurfAtZoom(zoomT: number, L: LvRuntimeLens): number;
  xpAtZoom(zoomT: number, L: LvRuntimeLens): number;
  wideOpenStopAtZoom(zoomT: number, L: LvRuntimeLens): number;
  evaluateAperture(
    state: LvPreparedState,
    surface: LvSurface,
    radius: number,
    stopSemiDiameter?: number,
  ): LvApertureEvaluation;
  traceParaxialSurfaces2(
    surfaces: readonly LvParaxialSurface[],
    y0: number,
    u0: number,
    options?: LvParaxialOptions,
  ): LvParaxialResult;
  computeSystemMatrix2(state: LvPreparedState): LvSystemMatrix;
  buildCardinalElementsFromMatrix2(input: LvCardinalInput): LvCardinalElements | null;
  assessMtfSupport(state: LvPreparedState, options: LvMtfOptions): LvMtfSupport;
  mtfIndexResolver(state: LvPreparedState, support: LvMtfSupport, wavelengthNm: number): LvIndexResolver | undefined;
  /** The object point of a certified conjugate at a field angle in degrees, or null when LV cannot place it. */
  mtfFiniteObjectPoint(state: LvPreparedState, conjugate: LvFiniteConjugate, fieldAngle: number): LvVec3 | null;
  /**
   * LV's MTF launch: the chief ray of a field, the footprint of its beam on the launch plane, the lattice over the
   * footprint and the ray of a lattice point. The footprint is found at the first line of `support`, from the seed
   * `options.pupilSemiDiameterMm`. A field without a chief ray has no launch, and one without a beam no footprint.
   */
  prepareMtfFieldLaunch(
    state: LvPreparedState,
    options: LvMtfOptions,
    support: LvMtfSupport,
    fieldAngleDeg: number,
  ): LvMtfFieldLaunch | null;
  findMtfFieldFootprint(
    state: LvPreparedState,
    options: LvMtfOptions,
    support: LvMtfSupport,
    launch: LvMtfFieldLaunch,
    growths?: number,
  ): LvMtfFootprint | null;
  mtfLaunchGrid(footprint: LvMtfFootprint, gridSize: number): LvMtfLaunchGrid;
  mtfLaunchRay(launch: LvMtfFieldLaunch, x: number, y: number): LvRay;
  /** LV's own bundle over the lattice of one grid size, at one line: what its MTF sums. */
  traceMtfBundle(
    state: LvPreparedState,
    options: LvMtfOptions,
    support: LvMtfSupport,
    launch: LvMtfFieldLaunch,
    footprint: LvMtfFootprint,
    gridSize: number,
    line: LvSpectralLine,
    imagePlaneZ?: number,
    extras?: { readonly reference?: LvMtfSpot; readonly opticalPath?: boolean },
  ): LvMtfBundle | null;
  /** Where a trace that ended "ok" lands on the image plane, with its bulk transmission; null when it does not. */
  mtfImagePoint(state: LvPreparedState, trace: LvTraceResult, imagePlaneZ?: number): LvMtfSpot | null;
  /** Whether a trace is a sample, was stopped by an aperture (a proven miss included) or could not be resolved. */
  mtfTraceClassification(trace: LvTraceResult, state?: LvPreparedState, stopRadius?: number): LvMtfRayClass;
  /**
   * LV's field axis: its first estimate of the half field, the chief ray's image height at an angle (NaN where the
   * chief is stopped, unless apertures are not checked), the same while any of the beam still lands, the axis they
   * give, and the chief-ray angle of each fraction of the reference height.
   */
  mtfModeledHalfField(state: LvPreparedState): number;
  mtfChiefHeight(
    state: LvPreparedState,
    options: LvMtfOptions,
    support: LvMtfSupport,
    checkApertures?: boolean,
  ): LvMtfChiefHeight;
  mtfBeamHeight(state: LvPreparedState, options: LvMtfOptions, support: LvMtfSupport): LvMtfChiefHeight;
  resolveMtfFieldGeometry(
    state: LvPreparedState,
    startDeg: number,
    chiefHeight: LvMtfChiefHeight,
    beyond?: { readonly reference: LvMtfChiefHeight; readonly beam: LvMtfChiefHeight },
  ): LvMtfFieldGeometry | null;
  resolveMtfFieldTargets(
    state: LvPreparedState,
    geometry: LvMtfFieldGeometry,
    fractions: readonly number[],
    chiefHeight: LvMtfChiefHeight,
    infinity: boolean,
  ): LvMtfFieldTarget[];
  /** LV's product MTF: what its MTF tab draws, for a request that names method, spectrum, focus and both radii. */
  computeMtf(state: LvPreparedState, options: LvMtfOptions): LvMtfResult;
  /**
   * `computeMtf` step by step. The first result it yields is the request before any field is traced: the field
   * axis, the focus it applies to every field and each field's target, pending or outside the model. A request its
   * gate refuses, and one without a field axis, is returned at once and nothing is yielded.
   */
  computeMtfSteps(state: LvPreparedState, options: LvMtfOptions): Generator<LvMtfResult, LvMtfResult>;
  /**
   * LV's refinement of one field through a ladder of grid sizes: `evaluate` is asked for the field at a size, each
   * result is held to the one before it, and the best field so far is yielded after every size. A converged size
   * ends it; so does a size without curves that a finer grid cannot help.
   */
  refineMtfField(
    ladder: readonly number[],
    evaluate: (size: number) => LvMtfGridOutcome,
    frequencies: readonly number[],
  ): Generator<LvMtfFieldDraft, void>;
  /** A field of a result before it is traced: "pending", with the target's height and angle when it has one. */
  emptyMtfField(
    fraction: number,
    target?: { readonly targetImageHeightMm: number | null; readonly fieldAngleDeg: number | null },
  ): LvMtfFieldDraft;
  /** Whether a field with this many unresolved rays, of this share of its flux, may still be reported. */
  assessUnresolvedFlux(
    failedRays: number,
    unknownFluxFraction: number,
  ): { readonly acceptable: boolean; readonly note: string | null };
  /** A footprint widened on the sides whose guard band carried flux. */
  expandMtfFootprint(footprint: LvMtfFootprint, sides: LvMtfOpenBorders, fraction?: number): LvMtfFootprint;
  /** LV's `MTF_GRID_LADDER`: the grid sizes a field is refined through, coarse to fine. */
  readonly mtfGridLadder: readonly number[];
  /** LV's `MTF_DEFAULT_GRID_CAP`: the largest grid of a request that names none. */
  readonly mtfDefaultGridCap: number;
  /** LV's `MTF_MAX_FOOTPRINT_EXPANSIONS`: how often one field's footprint is widened. */
  readonly mtfMaxFootprintExpansions: number;
  /** LV's `MTF_MIN_RAYS`: fewer rays than this at a line are no pupil. */
  readonly mtfMinRays: number;
  /** LV's `MTF_FIELDS`: the fractions of the reference image height of a request that names none. */
  readonly mtfDefaultFields: readonly number[];
  /** The spectrum the MTF tab requests for a preferred one: itself, or the reference line where glass data lacks. */
  resolveMtfSpectrum(state: LvPreparedState, preferred: string): LvMtfSpectrumChoice;
  /** LV's `MTF_FREQUENCIES`: the frequencies `computeMtf` reports for a request that names none, as the tab's does. */
  readonly mtfDefaultFrequencies: readonly number[];
  /** LV's `DEFAULT_MTF_PREFERENCES`: the options its MTF tab opens with. */
  readonly mtfDefaultPreferences: LvMtfPreferences;
  /** LV's `LINE_NM`. Anchored indices are fitted between its g and C lines. */
  readonly spectralLinesNm: LvLineNm;
  /** LV's `FLAT_R_THRESHOLD`: a surface whose radius is larger in magnitude has no curvature. */
  readonly flatRadiusThreshold: number;
  /** LV's `ASPHERIC_POLYNOMIAL_TERMS`: every polynomial coefficient its sag evaluates, and no other. */
  readonly asphericPolynomialTerms: readonly LvAsphericTerm[];
}
