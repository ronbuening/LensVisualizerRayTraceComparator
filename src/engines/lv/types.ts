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

/**
 * LV's frozen RuntimeLens. Never read `stopPhysSD` (zoom station 0 only) or `totalTrack` from it: the prepared
 * state holds the values of the current zoom and focus.
 */
export interface LvRuntimeLens {
  /** Index of the last authored surface; synthetic rear plates come after it. */
  readonly lastLensSurfaceIdx: number;
  readonly isZoom: boolean;
  readonly [member: string]: unknown;
}

/** Aspheric terms: `K` and even `A4`..`A20`, optionally odd `A3`..`A19`; there is no `A2`. */
export type LvAsphere = Readonly<Record<string, number | undefined>>;

/** The geometry of one surface as functions of the radial height in mm. */
export interface LvSurfaceProfile {
  readonly kind: string;
  sag(radius: number): number;
  slope(radius: number): number;
}

/**
 * One surface of a prepared state. `d` is the resolved gap after the surface, `nd` the index after it (air is
 * exactly 1), `sd` the hard clear semi-diameter and, on the stop surface, the runtime stop radius. LV's surface also
 * carries `source` and `base`, the authored records: they are deliberately absent here, because their `sd` is not
 * the runtime one. `syntheticKind` of the binding reads the one member of `source` that exists nowhere else.
 */
export interface LvSurface {
  readonly label: string;
  /** Radius of curvature in mm; a plane is 1e15 (|R| > 1e10). */
  readonly R: number;
  readonly d: number;
  readonly nd: number;
  readonly sd: number;
  readonly innerSd: number | null;
  readonly elemId: number;
  readonly asphere: LvAsphere | null;
  readonly profile: LvSurfaceProfile;
  /** Vertex position in mm; the first surface is at 0. */
  readonly z: number;
}

/** LV's PreparedOpticalState: a lens at one focus, zoom and aberration-control position. */
export interface LvPreparedState {
  readonly lens: {
    readonly key: string;
    readonly runtime: LvRuntimeLens;
    readonly stop: { readonly surfaceIndex: number };
    readonly flags: Readonly<Record<string, boolean>>;
  };
  readonly focusT: number;
  readonly zoomT: number;
  readonly surfaces: readonly LvSurface[];
  readonly z: readonly number[];
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

/** LV's EngineTraceResult, the members the comparator reads. */
export interface LvTraceResult {
  readonly opticalPathLengthMm?: number;
  readonly hits: readonly unknown[];
  readonly terminalPoint: LvVec3;
  readonly terminalDirection: LvVec3;
  readonly terminalSurfaceIndex: number;
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

/** LV's CardinalElements2: positions and signed distances in mm. */
export interface LvCardinalElements {
  readonly points: Readonly<Record<string, { readonly z: number }>>;
  readonly distances: Readonly<Record<string, { readonly valueMm: number }>>;
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

/** LV's MtfSupport: whether its MTF path covers a state, and with which indices and lines. */
export interface LvMtfSupport {
  readonly available: boolean;
  readonly reason: string | null;
  readonly message: string;
  readonly referenceWavelengthNm: number;
  /** True when the trace uses anchored per-wavelength indices instead of the authored `nd`. */
  readonly useResolvedReference: boolean;
  readonly spectralLines: readonly unknown[];
  readonly conjugate?: unknown;
  readonly limitations: readonly string[];
}

/**
 * The LensVisualizer functions the comparator calls, by the name the import manifest gives each. The signatures are
 * LV's, with the local types above; `LV_IMPORT_MANIFEST` says which module exports each.
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
  entrancePupilAtState2(stopSD: number, focusT: number, zoomT: number, L: LvRuntimeLens): LvEntrancePupil;
  fopenAtZoom2(zoomT: number, L: LvRuntimeLens): number;
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
}
