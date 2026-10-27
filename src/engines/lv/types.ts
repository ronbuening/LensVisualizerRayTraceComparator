// Local structural types for what the comparator reads from LensVisualizer. Nothing here is imported from the LV
// checkout, so the type check passes with no LV on disk. Each type lists only the members the comparator uses, as
// read from LV's sources (src/optics/types.ts, src/types/optics.ts, src/types/lensDataV2.ts, src/types/mtf.ts,
// src/optics/trace/types.ts, src/optics/analysis/request.ts); the load-time
// probe of the binding checks that the functions exist, and the integration tests that the shapes still hold.

/** A point or direction: x sagittal, y meridional, z along the axis, in mm. */
export type LvVec3 = readonly [number, number, number];

/**
 * A lens prescription file's default export, a `schema: 2` lens (LensVisualizer's LensDataV2Input). Only its
 * identity and whether it is a zoom are read here; the rest goes to `buildLens`, which refuses any other schema.
 */
export interface LvLensData {
  readonly schema: 2;
  readonly key: string;
  readonly name: string;
  /** Present on a zoom alone: one station per authored zoom position, wide to tele. */
  readonly zoom?: { readonly stations?: readonly unknown[] };
  readonly focus?: {
    readonly keyframes?: readonly number[];
    readonly conjugates?: readonly { readonly zoomStation: number; readonly keyframe: number }[];
  };
  readonly [member: string]: unknown;
}

/** One glass element of a lens, the members the comparator reads. */
export interface LvElement {
  readonly id: number;
  /** Beer-Lambert absorption of the glass per mm; above 0 it weights rays and bends none. */
  readonly absorptionCoefficientPerMm?: number;
  /**
   * The line the element's authored indices are of, `"e"`, or `"d"` where it states none. The comparator reads it
   * only through LV's own `lensChromaticReference`, as LV's chromatic tab does.
   */
  readonly indexReference?: string;
}

/**
 * LV's frozen RuntimeLens. Never read `stopPhysSD` (zoom station 0 only) or `totalTrack` from it: the prepared
 * state holds the values of the current zoom and focus. It holds no authored data: `source` is LensVisualizer's
 * canonical lens, which the comparator reads only in its integration tests.
 */
export interface LvRuntimeLens {
  readonly zoomStopSDs: readonly number[] | null;
  readonly stopPhysSD: number;
  readonly source: { readonly key: string; readonly [member: string]: unknown };
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
 * exactly 1), `sd` the hard clear semi-diameter (an envelope and no limit where `clips` is false) and, on the stop
 * surface, the runtime stop radius. LV's surface also
 * carries `source`, the canonical record: it is deliberately absent here, because its `sd` is not
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
  /**
   * False where `sd` is the rim LensVisualizer generated for a rear plate whose prescription publishes none: such a
   * surface never clips a ray or limits the field, and its `sd` is only an envelope. True on every other surface;
   * absent in a LensVisualizer from before it told the two apart, where every surface clips.
   */
  readonly clips?: boolean;
  readonly elemId: number;
  readonly asphere: LvAsphere | null;
  /** A diffractive phase on the surface, or null: LV's sequential MTF path has none. */
  readonly diffractive: object | null;
  /** What the surface does to a ray: "refract" on an ordinary surface, "reflect" or "block" in a folded system. */
  readonly interaction: {
    readonly type: string;
    readonly incidentSide?: "front" | "rear" | "both";
    readonly inactiveSide?: "ignore" | "block";
    readonly normal?: LvVec3 | null;
  };
  readonly profile: LvSurfaceProfile;
  /** Vertex position in mm; the first surface is at 0. */
  readonly z: number;
}

/** A plane: a point on it and its unit normal. */
export interface LvPlane {
  readonly point: LvVec3;
  readonly normal: LvVec3;
}

/** The member of LV's TraceGeometry that `evaluateAperture` reads. */
export interface LvTraceGeometry {
  readonly stopSurfaceIndex: number;
}

/** LV's PreparedOpticalState: a lens at one focus, zoom and aberration-control position. */
export interface LvPreparedState {
  /** Always present in a LensVisualizer after its engine rewrite; `evaluateAperture` takes it. */
  readonly traceGeometry?: LvTraceGeometry;
  readonly lens: {
    readonly key: string;
    readonly opticalPath?: {
      readonly mode: "sequential" | "auto";
      readonly surfaceOrder: readonly number[] | null;
      readonly maxInteractions: number;
    };
    readonly stop: { readonly surfaceIndex: number };
    /** `isFoldedOptics` is true for a system whose path turns at a mirror. */
    readonly flags: Readonly<Record<string, boolean>>;
    /** How field angles map to image heights: "rectilinear", or a "fisheye-..." kind. */
    readonly projection: { readonly kind: string };
    /** The lens's constants; `rayLead` is how far ahead of the first vertex its skew rays are launched, mm. */
    readonly constants?: { readonly rayLead?: number };
    /**
     * Each surface's medium as LV's chromatic tab traces it: the index at one of its channels ("R", "G", "B", "V";
     * `indexAtPreparedSurface`), and how LV resolved the glass (`quality`: "air", "sellmeier", "abbe", ...).
     */
    readonly dispersion?: readonly (LvSurfaceDispersion | undefined)[];
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

/** LV's compiled dispersion of one surface's medium: its index at a channel of the chromatic tab. */
export interface LvSurfaceDispersion {
  readonly quality: string;
  indexAt(channel: string): number;
}

/** A ray for `traceEngineRay`. */
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
  /** Trace on past a surface that clips, keeping the ray's status clipped, as LV's analysis adapters do. */
  readonly ghost?: boolean;
  readonly indexAtSurface?: LvIndexResolver;
  readonly wavelengthNm?: number;
  readonly directionNormalized?: boolean;
  /** One height per visit LV found an intersection for, recorded or passed without a record. */
  readonly recordHeights?: boolean;
}

/** The index after a surface at one wavelength, given the surface's index and its authored `nd`. */
export type LvIndexResolver = (surfaceIndex: number, nd: number) => number;

/**
 * One surface a traced ray met, the members the comparator reads. A hit is `clipped` when the ray ends on it: beyond
 * the clear aperture, inside an annular hole, or totally reflected. A surface the ray could not be intersected with
 * has no hit at all. LV's hit also states the residual of its intersection and the bound it met, which nothing here
 * reads.
 */
export interface LvTraceHit {
  readonly residual?: number;
  readonly effectiveTolerance?: number;
  readonly surfaceIndex: number;
  readonly point: LvVec3;
  readonly clipped: boolean;
  /** The direction the ray met the surface along, and the one it left along when it was not stopped there. */
  readonly incidentDirection?: LvVec3;
  readonly outgoingDirection?: LvVec3;
  /** Set on the hit a failure ended the ray on (a total internal reflection, a reflection without a direction). */
  readonly failureReason?: string | null;
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
  /** Absent only under LV's `capture: "terminal"`, which the comparator never asks for. */
  readonly hits: readonly LvTraceHit[];
  readonly terminalPoint: LvVec3;
  readonly terminalDirection: LvVec3;
  readonly terminalSurfaceIndex: number;
  /** The index of the medium the ray is in where the trace ends. */
  readonly finalMedium: number;
  readonly status: "ok" | "clipped" | "failed";
  readonly failureReason: string | null;
  readonly reachedImagePlane: boolean;
  readonly diagnostics?: { readonly clipEvents: readonly { readonly surfaceIdx: number | null }[] };
  /** Under `recordHeights`: one entry per visit with a found intersection, passive visits included. */
  readonly heights?: readonly number[] | null;
}

/** The result of LV's meridional `traceRay`. */
export interface LvMeridionalTraceResult {
  readonly pts: readonly (readonly number[])[];
  readonly y: number;
  readonly u: number;
  readonly clipped: boolean;
  readonly reachedImagePlane?: boolean;
}

/** A row of the paraxial kernel: any object with a radius, the index after the surface and the gap after it. */
export interface LvParaxialSurface {
  readonly diffractive?: object | null;
  readonly interaction?: { readonly type: string };
  readonly R: number;
  readonly nd: number;
  readonly d: number;
}

/** Options of `paraxialTrace`. */
export interface LvParaxialOptions {
  readonly allowReflect?: boolean;
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

/** What `buildCardinalElementsFromMatrix` takes: a matrix and the positions it refers to. */
export interface LvCardinalInput extends LvSystemMatrix {
  readonly frontVertexZ: number;
  readonly rearVertexZ: number;
  /** The last lens vertex, from which back focus is measured; defaults to `rearVertexZ`. */
  readonly rearLensVertexZ?: number;
  readonly imagePlaneZ: number;
}

/**
 * LV's CardinalElements, the members the comparator reads: positions and signed distances in mm. `bfd` is the rear
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
  /** The half-field angle of the state, degrees: what the coma and bokeh tabs take their field fractions of. */
  readonly halfFieldDeg?: number;
  readonly [member: string]: unknown;
}

/** The result of `entrancePupilAtState`. */
export interface LvEntrancePupil {
  readonly epSD: number;
  readonly yRatio: number;
  readonly b: number;
  readonly epRatio: number;
}

/**
 * LV's MtfRequestOptions: the settings of an MTF request beside its analysis request, which holds the two radii.
 * `method`, `spectrum` and `focus` take LV's own values, which the stage that uses them pins.
 */
export interface LvMtfRequestOptions {
  readonly method: string;
  readonly spectrum: string;
  readonly focus: unknown;
  readonly [member: string]: unknown;
}

/**
 * LV's MtfOptions: the settings with the two radii, as LV resolves them from a request (`resolveMtfOptions`) and as
 * its MTF worker is handed them. Every MTF function below the three entry points takes this form.
 */
export interface LvMtfOptions extends LvMtfRequestOptions {
  readonly pupilSemiDiameterMm: number;
  readonly stopSemiDiameterMm: number;
}

/** What LV's `createAnalysisRequest` takes, the members the comparator sets. */
export interface LvAnalysisRequestParams {
  readonly preparedState: LvPreparedState;
  readonly dynamicEFL: number;
  readonly currentEPSD: number;
  readonly currentPhysStopSD: number;
  /** The field geometry of the state, as LV's analysis drawer hands it on; LV computes its own without it. */
  readonly fieldGeometry?: LvFieldGeometry | null;
  /** Overrides of the sampling of LV's analyses, by LV's own names; the family defaults without them. */
  readonly sampling?: LvAnalysisSampling;
}

/** LV's AnalysisSamplingOptions, the members the comparator sets: those of its coma and bokeh tabs. */
export interface LvAnalysisSampling {
  readonly comaDetailFieldFraction?: number;
  readonly comaFieldFractions?: readonly number[];
  readonly comaRingSamples?: readonly number[];
  readonly comaFanSampleCount?: number;
  readonly bokehFieldFractions?: readonly number[];
  readonly bokehRingSamples?: readonly number[];
}

/**
 * LV's off-axis field geometry of one field of its coma and bokeh tabs (`computeOffAxisFieldGeometry`): scalar, a
 * collimated launch of slope `uField` whose chief ray crosses the first vertex plane at height `yChief`; or, for a
 * fisheye field beyond its trace-safe cone, a vector launch from a bounding sphere.
 */
export type LvOffAxisFieldGeometry =
  | {
      readonly kind?: undefined;
      readonly fieldFraction: number;
      readonly fieldAngleDeg: number;
      readonly uField: number;
      readonly yChief: number;
      readonly lastSurfZ: number;
      readonly imagePlaneZ: number;
    }
  | {
      readonly kind: "vector";
      readonly fieldFraction: number;
      readonly fieldAngleDeg: number;
      readonly lastSurfZ: number;
      readonly imagePlaneZ: number;
    };

/** One sample of LV's circular pupil pattern: a fraction of the pupil radius in x and y, and its area weight. */
export interface LvCircularPupilSample {
  readonly index: number;
  readonly xFraction: number;
  readonly yFraction: number;
  readonly radiusFraction: number;
  readonly azimuthRad: number;
  readonly weight: number;
}

/** One sample of LV's orthogonal pupil fan. */
export interface LvOrthogonalPupilSample {
  readonly index: number;
  readonly pupilFraction: number;
  readonly xFraction: number;
  readonly yFraction: number;
}

/** One sample of LV's meridional or sagittal coma fan, the members the comparator reads. */
export interface LvComaFanSample {
  readonly index: number;
  readonly pupilFraction: number;
  /** The image height (meridional) or x (sagittal) less the chief ray's; null for a sample that did not land. */
  readonly relativeImageHeight?: number | null;
  readonly relativeImageX?: number | null;
  readonly clipped: boolean;
}

/** LV's MeridionalComaResult or SagittalComaResult, the members the comparator reads. */
export interface LvComaFanResult {
  readonly fieldFraction: number;
  readonly fieldAngleDeg: number;
  readonly sampleCount: number;
  readonly validSampleCount: number;
  readonly clippedSampleCount: number;
  /** Where the chief ray lands: its y for the meridional fan, its x for the sagittal one. */
  readonly centerIntercept: number;
  readonly samples: readonly LvComaFanSample[];
}

/** One field of LV's coma point-cloud preview, the members the comparator reads. */
export interface LvComaPointCloudField {
  readonly fieldFraction: number;
  readonly fieldAngleDeg: number;
  readonly sampleCount: number;
  readonly validSampleCount: number;
  readonly clippedSampleCount: number;
  /** Where the chief ray lands along y. */
  readonly chiefIntercept: number;
  readonly centroidTangentialImageHeight: number;
  readonly centroidSagittalImageHeight: number;
  readonly rmsRadiusMm: number;
  readonly usable: boolean;
}

/** LV's ComaAnalysisResult: its two fans at the detail field and its point-cloud preview, each null when unusable. */
export interface LvComaAnalysis {
  readonly meridionalComa: LvComaFanResult | null;
  readonly sagittalComa: LvComaFanResult | null;
  readonly pointCloudPreview: {
    readonly fieldFractions: readonly number[];
    readonly fields: readonly LvComaPointCloudField[];
  } | null;
}

/** LV's BokehFieldResult, the members the comparator reads: offsets relative to the chief ray's landing. */
export interface LvBokehField {
  readonly fieldFraction: number;
  readonly fieldAngleDeg: number;
  readonly totalRays: number;
  readonly passedRays: number;
  readonly centroidSagittal: number;
  readonly centroidTangential: number;
  readonly rmsRadiusMm: number;
  readonly maxRadiusMm: number;
  readonly transmission: number;
  readonly usable: boolean;
}

/**
 * LV's SphericalAberrationResult (`computeSphericalAberration`), the members the comparator reads: intercepts are z
 * of the contract frame, mm, each the mean of a symmetric pair of real rays launched parallel to the axis.
 */
export interface LvSphericalAberration {
  readonly nearAxisFraction: number;
  readonly marginalFraction: number;
  readonly longitudinalSaMm: number;
  readonly nearAxisRealIntercept: number;
  readonly marginalRealIntercept: number;
  /** The mean height of the near-axis pair on the design image plane. */
  readonly nearAxisImageHeight: number;
  readonly imagePlaneZ: number;
  readonly bestFocusZ: number;
  readonly bestFocusShiftMm: number;
  readonly bestFocusRmsMm: number;
  readonly bestFocusPeakMm: number;
  readonly currentPlaneRmsMm: number;
  readonly currentPlanePeakMm: number;
  /** How many profile rays the figures at a plane are of: both rays of every pair that arrived. */
  readonly validSampleCount: number;
}

/** One point of LV's spherical-aberration profile (`computeSAProfile`): transverse SA at best focus, mm. */
export interface LvSaProfilePoint {
  readonly fraction: number;
  readonly transverseSaMm: number;
}

/** One channel of LV's axial-colour section (`LongitudinalChromaticFocusSample`). */
export interface LvLongitudinalChromaticSample {
  /** "R", "G", "B" or "V". */
  readonly channel: string;
  readonly focusZ: number | null;
  readonly focusShiftMm: number | null;
  readonly relativeFocusShiftMm: number | null;
  readonly imageHeightMm: number | null;
  readonly relativeImageHeightMm: number | null;
  readonly usable: boolean;
  readonly clipped: boolean;
}

/** LV's LongitudinalChromaticFocusResult (`computeLongitudinalChromaticFocus`), the members the comparator reads. */
export interface LvLongitudinalChromaticFocus {
  readonly channels: readonly string[];
  readonly referenceChannel: string;
  readonly marginalFraction: number;
  readonly imagePlaneZ: number;
  readonly lastSurfaceZ: number;
  readonly longitudinalSpreadMm: number;
  readonly transverseSpreadMm: number;
  readonly samples: readonly LvLongitudinalChromaticSample[];
  readonly validChannelCount: number;
}

/** LV's skew trace result: where the ray crosses the last vertex plane and its slopes there. */
export interface LvSkewTrace {
  readonly x: number;
  readonly y: number;
  readonly ux: number;
  readonly uy: number;
  readonly clipped: boolean;
  readonly transmission: number;
}

/**
 * LV's ChiefRaySolveResult: the launch height on the first vertex plane of the chief ray of a field, of slope
 * `uField`, that crosses the stop's centre (below 1 degree LV's paraxial estimate, `status` "converged" all the
 * same); a field LV launches from a bounding sphere also has `vectorLaunch`.
 */
export interface LvChiefRaySolve {
  readonly yLaunch: number;
  readonly uField: number;
  readonly status: string;
  readonly iterations: number;
  readonly launchSurface: string;
  readonly vectorLaunch?: unknown;
}

/** LV's ProjectionLaunchSlope: the object-plane slope of a field angle, `-tan` of it, or that it has none. */
export interface LvProjectionLaunchSlope {
  readonly uField: number;
  readonly status: "ok" | "out-of-domain";
}

/** LV's ProjectionReference: the ideal mapping a distortion is the residual of; `focalScaleMm` its scale. */
export interface LvProjectionReference {
  readonly kind: string;
  readonly label: string;
  readonly shortLabel?: string;
  readonly focalScaleMm: number;
}

/** LV's ProjectionFieldSlopes: the launch slopes that LV's ideal mapping takes to an ideal image point. */
export interface LvProjectionFieldSlopes {
  readonly fieldSlopeX: number;
  readonly fieldSlopeY: number;
  readonly equivalentAngleDeg: number;
}

/** One sample of LV's distortion curve (`DistortionSample`): heights in mm, signed as the contract frame signs them. */
export interface LvDistortionSample {
  readonly fieldAngleDeg: number;
  readonly normalizedImageHeight: number;
  readonly imageHeight: number;
  readonly distortionPercent: number;
  /** The target image height the chief ray was solved for, which the curve plots as the real height. */
  readonly realHeight: number;
  readonly idealHeight: number;
  readonly idealFieldAngleDeg: number;
  readonly referenceKind?: string;
  readonly referenceLabel?: string;
}

/** What LV's distortion tab presents as its curve (`DistortionCurveResult`). */
export interface LvDistortionCurve {
  readonly samples: readonly LvDistortionSample[];
  readonly corner: { readonly status: string; readonly reason?: string; readonly fieldAngleDeg?: number };
  readonly cornerImageHeight: number;
}

/** One point of LV's traced distortion grid; `tracedY` is the landing's y negated, as the tab draws it. */
export interface LvDistortionGridPoint {
  readonly idealX: number;
  readonly idealY: number;
  readonly tracedX: number | null;
  readonly tracedY: number | null;
  readonly radiusNormalized: number;
  readonly insideImageCircle: boolean;
  readonly usable: boolean;
}

/** One line of LV's traced distortion grid. */
export interface LvDistortionGridLine {
  readonly orientation: "vertical" | "horizontal";
  readonly idealCoordinate: number;
  readonly points: readonly LvDistortionGridPoint[];
}

/** What LV's distortion tab presents as its traced field grid (`DistortionFieldGridResult`). */
export interface LvDistortionFieldGrid {
  readonly lines: readonly LvDistortionGridLine[];
  readonly idealFieldRadius: number;
  readonly referenceKind: string;
  readonly referenceLabel: string;
}

/** One field of LV's entrance-pupil profile (`PupilAberrationSample`). */
export interface LvEntrancePupilSample {
  readonly fieldFrac: number;
  readonly fieldDeg: number;
  readonly chiefRayCorrection: number;
  readonly epShiftMm: number;
}

/** One field of LV's exit-pupil profile (`ExitPupilAberrationSample`). */
export interface LvExitPupilSample {
  readonly fieldFrac: number;
  readonly fieldDeg: number;
  readonly xpZRelLastSurf: number;
  readonly xpShiftMm: number;
}

/** What LV's pupils tab presents (`BothPupilAberrationProfiles`). */
export interface LvPupilProfiles {
  readonly ep: {
    readonly samples: readonly LvEntrancePupilSample[];
    readonly paraxialEpZRelStop: number;
    readonly maxAbsShiftMm: number;
    readonly halfFieldDeg: number;
  };
  readonly xp: {
    readonly samples: readonly LvExitPupilSample[];
    readonly paraxialXpZRelLastSurf: number;
    readonly maxAbsShiftMm: number;
    readonly halfFieldDeg: number;
  };
  readonly halfFieldDeg: number;
  readonly maxAbsEpShiftMm: number;
  readonly maxAbsXpShiftMm: number;
}

/** One channel of one field of LV's lateral-colour section (`LateralColorChannelSample`). */
export interface LvLateralColorChannel {
  readonly channel: string;
  readonly imageHeightMm: number | null;
  readonly relativeHeightMm: number | null;
  readonly usable: boolean;
  readonly clipped: boolean;
}

/** One field of LV's lateral-colour section (`LateralColorFieldSample`). */
export interface LvLateralColorField {
  readonly fieldFraction: number;
  readonly label: string;
  readonly fieldAngleDeg: number;
  readonly referenceChannel: string;
  readonly referenceImageHeightMm: number | null;
  readonly lateralSpreadMm: number | null;
  readonly samples: readonly LvLateralColorChannel[];
  readonly validChannelCount: number;
  readonly usable: boolean;
}

/** What the lateral-colour section of LV's chromatic tab presents (`LateralColorCurveResult`). */
export interface LvLateralColorCurve {
  readonly channels: readonly string[];
  readonly referenceChannel: string;
  readonly fieldFractions: readonly number[];
  readonly fields: readonly LvLateralColorField[];
  readonly usableFieldCount: number;
  readonly maxLateralSpreadMm: number;
  readonly imagePlaneZ: number;
  readonly halfFieldDeg: number;
}

/**
 * LV's scalar off-axis field geometry of one field of its field-curvature analysis
 * (`computeOffAxisFieldGeometryScalar`): a collimated launch of slope `uField` whose solved chief ray crosses the first
 * vertex plane at height `yChief`, whatever LV's projection would launch the field with elsewhere.
 */
export interface LvScalarFieldGeometry {
  readonly fieldFraction: number;
  readonly fieldAngleDeg: number;
  readonly uField: number;
  readonly yChief: number;
  readonly lastSurfZ: number;
  readonly imagePlaneZ: number;
}

/** One channel's focus of one field of LV's chromatic field curves (`ChromaticFieldShift`). */
export interface LvChromaticFieldShift {
  readonly channel: string;
  readonly tangentialShiftMm: number;
  readonly sagittalShiftMm: number;
}

/** One field of LV's field curves and astigmatism (`FieldCurvatureFieldResult`), the members the comparator reads. */
export interface LvFieldCurvatureField {
  readonly fieldFraction: number;
  readonly fieldAngleDeg: number;
  readonly sampleCount: number;
  readonly validSampleCount: number;
  readonly clippedSampleCount: number;
  /** Where the field's chief ray lands on the design image plane, y, mm. */
  readonly chiefImageHeight: number;
  readonly tangentialBestFocusZ: number;
  readonly sagittalBestFocusZ: number;
  readonly petzvalBestFocusZ: number;
  readonly tangentialShiftMm: number;
  readonly sagittalShiftMm: number;
  readonly petzvalShiftMm: number;
  readonly astigmaticDifferenceMm: number;
  readonly diagnosticTangentialBestFocusZ?: number;
  readonly diagnosticSagittalBestFocusZ?: number;
  readonly diagnosticTangentialShiftMm?: number;
  readonly diagnosticSagittalShiftMm?: number;
  readonly diagnosticAstigmaticDifferenceMm?: number;
  readonly chromaticFieldShifts: readonly LvChromaticFieldShift[] | null;
  readonly usable: boolean;
}

/** What LV's field curves present for one of its two variants (`FieldCurvatureResult`). */
export interface LvFieldCurvatureResult {
  readonly fieldFractions: readonly number[];
  readonly curveFieldFractions: readonly number[];
  readonly fields: readonly LvFieldCurvatureField[];
  readonly curveFields: readonly LvFieldCurvatureField[];
  readonly usableFieldCount: number;
  readonly imagePlaneZ: number;
  readonly maxAstigmaticDifferenceMm: number;
  readonly edgeTangentialShiftMm: number;
  readonly edgeSagittalShiftMm: number;
  readonly chromaticFocusSpreadMm: number | null;
}

/** LV's field curves of a request at the authored indices and at its chromatic channels (`FieldCurvatureBundleResult`). */
export interface LvFieldCurvatureBundle {
  readonly fieldCurvature: LvFieldCurvatureResult | null;
  readonly chromaticFieldCurvature: LvFieldCurvatureResult | null;
}

/** One sample of LV's focus-breathing chart (`BreathingSample`). */
export interface LvBreathingSample {
  readonly focusT: number;
  readonly efl: number;
  readonly breathingPercent: number;
  readonly distanceLabel: string;
}

/** One sample of LV's vignetting / relative-illumination curve (`VignettingSample`), each normalised to the axis. */
export interface LvVignettingSample {
  /** The field angle, degrees: 0 on the axis. */
  readonly fieldAngleDeg: number;
  /** The fraction of the meridional pupil sweep that LV traces through every aperture, over the axis's. */
  readonly geometricTransmission: number;
  /** The transmitted bulk intensity of the sweep times cos^4 of the field angle, over the axis's. */
  readonly relativeIllumination: number;
}

/** LV's AnalysisRequest, the members the comparator reads: the state, and the two radii under `aperture`. */
export interface LvAnalysisRequest {
  readonly preparedGeometry: LvPreparedState;
  readonly dynamicEFL: number;
  readonly aperture: { readonly entrancePupilSemiDiameterMm: number; readonly stopSemiDiameterMm: number };
  /** A tilt or shift pose; null for a request made without a perspective context, as every request here is. */
  readonly pose: { readonly active?: boolean } | null;
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
  readonly defaultPhaseWavelengthNm: number;
  rearMediumSurfaceIndex(surfaceIndex: number, surfaces: readonly Pick<LvSurface, "sd" | "innerSd">[]): number | null;
  /** The height LV's `recordHeights` keeps for a visit: a coordinate of a point carried along a direction to z. */
  projectCoordinateToZ(
    coordinate: number,
    pointZ: number,
    directionCoordinate: number,
    directionZ: number,
    z: number,
  ): number;
  /** Source-published zoom coordinates, through LV's public station seam. */
  publishedZoomStations(L: LvRuntimeLens): readonly { readonly index: number; readonly zoomT: number }[];
  buildLens(
    data:
      | LvLensData
      | { readonly kind: "lens"; readonly key: string; readonly name: string; readonly [member: string]: unknown },
  ): LvRuntimeLens;
  prepareRuntimeState(L: LvRuntimeLens, focusT: number, zoomT: number, aberrationT?: number): LvPreparedState;
  traceEngineRay(state: LvPreparedState, ray: LvRay, options?: LvTraceOptions): LvTraceResult;
  traceRay(
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
  computeCardinalElementsFromState(state: LvPreparedState): LvCardinalElements | null;
  /**
   * The entrance pupil of a stop radius at a state. `geometry` is a field geometry already computed for the state;
   * without it LV computes its own.
   */
  entrancePupilAtState(
    stopSD: number,
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    geometry?: LvFieldGeometry,
    aberrationT?: number,
  ): LvEntrancePupil;
  /** The field geometry LV's analysis tabs share for a state, which its hook hands to `entrancePupilAtState`. */
  computeAnalysisFieldGeometryAtState(
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    aberrationT?: number,
  ): LvFieldGeometry;
  /** The marked f-number of an aperture-slider position, 0 for wide open, never below the widest of the zoom state. */
  fNumberAtStopdown(stopdownT: number, zoomT: number, L: LvRuntimeLens): number;
  /** The widest f-number at a zoom position, the position clamped to the zoom's range: what LV's hook calls. */
  fopenAtZoomClamped(zoomT: number, L: LvRuntimeLens): number;
  /**
   * LV's stored pupil constants at a zoom position, which it draws its pupil markers from. They are properties of
   * the lens at infinity focus and at its authored indices, and none of them is a paraxial image of the stop: the
   * entrance pupil's semi-diameter is nominal, focal length over twice the f-number, and the others come from real
   * rays near the axis. The two positions are relative to the stop vertex and to the last vertex.
   */
  epAtZoomClamped(zoomT: number, L: LvRuntimeLens): number;
  epZRelStopAtZoom(zoomT: number, L: LvRuntimeLens): number;
  xpZRelLastSurfAtZoom(zoomT: number, L: LvRuntimeLens): number;
  xpAtZoom(zoomT: number, L: LvRuntimeLens): number;
  wideOpenStopAtZoom(zoomT: number, L: Pick<LvRuntimeLens, "zoomStopSDs" | "isZoom" | "stopPhysSD">): number;
  /** Where a hit of a radius lies against a surface's clear aperture; the geometry is the state's `traceGeometry`. */
  evaluateAperture(
    geometry: LvTraceGeometry,
    surface: LvSurface,
    radius: number,
    stopSemiDiameter?: number,
  ): LvApertureEvaluation;
  /** LV's paraxial kernel, under the name its optics barrel gives it: a call-through to `traceSurfacesParaxial`. */
  paraxialTrace(
    surfaces: readonly LvParaxialSurface[],
    y0: number,
    u0: number,
    options?: LvParaxialOptions,
  ): LvParaxialResult;
  buildCardinalElementsFromMatrix(input: LvCardinalInput): LvCardinalElements | null;
  /** An analysis request of a state and the two radii: what LV's MTF entry points take beside their settings. */
  createAnalysisRequest(params: LvAnalysisRequestParams): LvAnalysisRequest;
  assessMtfSupport(request: LvAnalysisRequest, settings: LvMtfRequestOptions): LvMtfSupport;
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
  /** LV's own diffraction estimate, for fixed-grid diagnostics without changing its adaptive product path. */
  shearedOtf(
    bundle: LvMtfBundle,
    reference: LvMtfSpot,
    wavelengthMm: number,
    frequencies: readonly number[],
  ): {
    sagittal: { real: number[]; imaginary: number[] };
    tangential: { real: number[]; imaginary: number[] };
    limit: { sagittal: number[]; tangential: number[] };
    straddling: number[];
  };
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
  /** LV's product MTF: what its MTF tab draws, for a request with both radii and settings of method, spectrum, focus. */
  computeMtf(request: LvAnalysisRequest, settings: LvMtfRequestOptions): LvMtfResult;
  /**
   * `computeMtf` step by step. The first result it yields is the request before any field is traced: the field
   * axis, the focus it applies to every field and each field's target, pending or outside the model. A request its
   * gate refuses, and one without a field axis, is returned at once and nothing is yielded.
   */
  computeMtfSteps(request: LvAnalysisRequest, settings: LvMtfRequestOptions): Generator<LvMtfResult, LvMtfResult>;
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
  /**
   * The off-axis field geometry of LV's coma and bokeh tabs at a fraction of the state's half field, with the field
   * geometry of the state; null where LV has no launch for it.
   */
  computeOffAxisFieldGeometry(
    state: LvPreparedState,
    fieldFraction: number,
    stateGeometry?: LvFieldGeometry,
  ): LvOffAxisFieldGeometry | null;
  /** LV's area-weighted circular pupil pattern: a centre and rings of the given numbers of samples. */
  sampleCircularPupil(ringSamples: readonly number[]): LvCircularPupilSample[];
  /** LV's odd tangential or sagittal pupil fan. */
  sampleOrthogonalPupilFan(sampleCount: number, orientation: "tangential" | "sagittal"): LvOrthogonalPupilSample[];
  /** The unit direction of slopes dx/dz and dy/dz, normalised as LV's skew launch normalises it; null if invalid. */
  directionFromSkewSlope(ux: number, uy: number): LvVec3 | null;
  /** Everything LV's coma tab presents for a request: its two fans at the detail field and its point cloud. */
  computeComaAnalysis(request: LvAnalysisRequest): LvComaAnalysis;
  /** One tile of LV's bokeh tab: the field traced at the request's focus and intercepted at `sensorZ`. */
  computeBokehFieldFootprint(request: LvAnalysisRequest, fieldFraction: number, sensorZ: number): LvBokehField | null;
  /** LV's skew trace of a ray given by its crossing of the first vertex plane and its slopes. */
  traceSkewRay(
    x0: number,
    y0: number,
    ux0: number,
    uy0: number,
    focusT: number,
    zoomT: number,
    stopSD: number | undefined,
    ghost: boolean,
    L: LvRuntimeLens,
    aberrationT?: number,
  ): LvSkewTrace;
  /** LV's projection of a skew trace from the last vertex plane to an image plane. */
  skewImagePlaneIntercept(
    x: number,
    y: number,
    ux: number,
    uy: number,
    lastSurfZ: number,
    imagePlaneZ: number,
  ): { readonly x: number; readonly y: number } | null;
  /** LV's `COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES`: the rings of its coma point cloud. */
  readonly comaRingSamples: readonly number[];
  /** LV's `COMA_PREVIEW_FIELD_FRACTIONS`: the fractions of the half field its coma point cloud is drawn at. */
  readonly comaFieldFractions: readonly number[];
  /** LV's `MERIDIONAL_COMA_SAMPLE_COUNT`: the samples of its coma fans. */
  readonly comaFanSampleCount: number;
  /** LV's `BOKEH_CIRCULAR_PUPIL_RING_SAMPLES`: the rings of a bokeh tile. */
  readonly bokehRingSamples: readonly number[];
  /** LV's `BOKEH_PREVIEW_FIELD_FRACTIONS`: the fractions of the half field its bokeh tiles are drawn at. */
  readonly bokehFieldFractions: readonly number[];
  /** LV's `NEAR_AXIS_REAL_FRAC`: the pupil fraction of the ray pair its spherical aberration is relative to. */
  readonly saNearAxisFraction: number;
  /** LV's `MARGINAL_PUPIL_FRACTIONS`: the candidates of its spherical aberration's marginal pair, outermost first. */
  readonly marginalPupilFractions: readonly number[];
  /** LV's `PROFILE_FRACS`: the zones of its spherical-aberration profile and best focus. */
  readonly saProfileFractions: readonly number[];
  /** LV's `DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS`: the candidates of its axial-colour marginal ray. */
  readonly locaMarginalFractions: readonly number[];
  /** LV's `CHROMATIC_CHANNEL_WAVELENGTH_NM`: the line of each chromatic channel of a lens of d-line indices, nm. */
  readonly chromaticChannelWavelengthsNm: Readonly<Record<string, number>>;
  /** LV's `E_LINE_CHANNEL_WAVELENGTH_NM`: the line of each channel of a lens of native e-line indices, nm. */
  readonly eLineChannelWavelengthsNm: Readonly<Record<string, number>>;
  /** What the spherical-aberration section of LV's aberrations tab presents for a request; null when its rays fail. */
  computeSphericalAberration(request: LvAnalysisRequest): LvSphericalAberration | null;
  /** The transverse profile that section plots, at its best focus; empty when its rays fail. */
  computeSAProfile(request: LvAnalysisRequest): readonly LvSaProfilePoint[];
  /** What the axial-colour section of LV's chromatic tab presents for a request; null when no fraction is usable. */
  computeLongitudinalChromaticFocus(request: LvAnalysisRequest): LvLongitudinalChromaticFocus | null;
  /**
   * The line LV's chromatic channels of a lens are labelled at: `"e"` only when every element is e-referenced, `"d"`
   * otherwise. The chromatic tab asks it of the runtime lens's elements (`L.elements`, synthetic rear plates left out).
   */
  lensChromaticReference(elements: readonly LvElement[]): string;
  /** What LV's distortion tab plots as its curve for a request: chief rays solved at even target image heights. */
  computeDistortionCurve(request: LvAnalysisRequest): LvDistortionCurve;
  /** What LV's distortion tab draws as its traced field grid for a request. */
  computeDistortionFieldGrid(request: LvAnalysisRequest): LvDistortionFieldGrid;
  /** What LV's pupils tab presents for a request: the entrance- and exit-pupil profiles across the field. */
  computeBothPupilAberrationProfiles(request: LvAnalysisRequest): LvPupilProfiles;
  /** What the lateral-colour section of LV's chromatic tab presents for a request; null when no field is usable. */
  computeLateralColorCurve(request: LvAnalysisRequest): LvLateralColorCurve | null;
  /** The focal length LV's focus-breathing chart and readouts present for a request's state. */
  computeFocusEFL(request: LvAnalysisRequest): number;
  /** LV's focus-breathing chart: the focal length at even focus positions of the request's zoom position. */
  computeFocusBreathingSeries(request: LvAnalysisRequest): readonly LvBreathingSample[];
  /** LV's `PUPIL_ABERRATION_SAMPLE_COUNT`: the fields of its pupils tab, the axis and the half field included. */
  readonly pupilAberrationSampleCount: number;
  /** LV's `DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS`: the fractions of the half field of its lateral-colour section. */
  readonly lateralColorFieldFractions: readonly number[];
  /**
   * The scalar off-axis field geometry of LV's field curves at a fraction of the state's half field, with the field
   * geometry of the state: the solved chief ray's launch, never a bounding sphere's; null where LV has no slope for it.
   */
  computeOffAxisFieldGeometryScalar(
    state: LvPreparedState,
    fieldFraction: number,
    stateGeometry?: LvFieldGeometry,
  ): LvScalarFieldGeometry | null;
  /** What the field-curves and astigmatism sections of LV's aberrations tab present for a request. */
  computeFieldCurvatureBundle(request: LvAnalysisRequest): LvFieldCurvatureBundle;
  /** LV's `FIELD_CURVATURE_FIELD_FRACTIONS`: the fractions of the half field its field curves mark. */
  readonly fieldCurvatureFieldFractions: readonly number[];
  /** LV's `FIELD_CURVATURE_CURVE_FIELD_FRACTIONS`: the fractions of the half field its field curves are drawn through. */
  readonly fieldCurvatureCurveFieldFractions: readonly number[];
  /** LV's chief-ray solve for a field angle in degrees at a state given by its controls (`solveChiefRay`). */
  solveChiefRayForRuntimeLens(
    fieldAngleDeg: number,
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    geometry?: LvFieldGeometry,
    aberrationT?: number,
  ): LvChiefRaySolve;
  /** The image height of LV's paraxially launched chief ray of a field angle, mm; NaN where it fails. */
  chiefRayImageHeightForRuntimeLens(
    fieldAngleDeg: number,
    zPos: number[],
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    geometry?: LvFieldGeometry,
    aberrationT?: number,
  ): number;
  /** The image height of LV's solved chief ray of a field angle, mm: what its distortion inversion traces. */
  chiefRayImageHeightAccurateForRuntimeLens(
    fieldAngleDeg: number,
    zPos: number[],
    focusT: number,
    zoomT: number,
    L: LvRuntimeLens,
    geometry?: LvFieldGeometry,
    aberrationT?: number,
  ): number;
  /** LV's object-plane slope of a field angle in degrees: `-tan` of it below its launch limit. */
  projectionLaunchSlopeForField(L: LvRuntimeLens, fieldAngleDeg: number): LvProjectionLaunchSlope;
  /** The launch slopes LV's ideal mapping takes to an ideal image point; null where the mapping has none. */
  projectionFieldSlopesForImagePoint(
    reference: LvProjectionReference,
    imageX: number,
    imageY: number,
  ): LvProjectionFieldSlopes | null;
  /** LV's ideal mapping of a lens for its distortion: rectilinear of a scale, or the lens's declared fisheye law. */
  distortionProjectionReferenceForLens(
    L: LvRuntimeLens,
    rectilinearScale: number,
    zoomT?: number,
  ): LvProjectionReference;
  /** Whether a lens's projection is one of LV's fisheye laws. */
  isFisheyeProjection(projection: unknown): boolean;
  /** Whether LV samples a lens's ray work more coarsely, as it does for a heavy lens. */
  isHeavyLensForRayWork(L: LvRuntimeLens): boolean;
  /** LV's `uniformFieldFraction`: index over count less one. */
  uniformFieldFraction(index: number, sampleCount: number): number;
  /** LV's `evenlySpacedSigned`: `count` fractions from -1 to +1, both ends included, `-1 + (2 * index) / (count - 1)`. */
  evenlySpacedSigned(count: number): number[];
  /** What LV's vignetting tab presents for a request: its curve, a sample a field from the axis to the half field. */
  computeVignettingCurve(request: LvAnalysisRequest): readonly LvVignettingSample[];
  /** The unit direction of a meridional slope dy/dz, normalised as LV's meridional launch normalises it. */
  directionFromMeridionalSlope(u: number): LvVec3 | null;
}
