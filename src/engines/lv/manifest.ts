import type { LvApi } from "./types.ts";

/** What `typeof` must say of an export for the binding to accept it. */
export type LvExportKind = "function" | "object" | "number" | "string" | "boolean";

/** One export the binding takes from a module: its name there, its name on the facade, and its expected kind. */
export interface LvManifestExport {
  readonly name: string;
  readonly as: string;
  readonly kind: LvExportKind;
}

/** One LensVisualizer module, or paths tried in order, by POSIX path relative to the LV root. */
export interface LvManifestModule {
  readonly module: string | readonly [string, ...string[]];
  readonly exports: readonly LvManifestExport[];
}

/** Named function exports that keep their name on the facade. */
function functions<const Name extends string>(
  ...names: Name[]
): { readonly name: Name; readonly as: Name; readonly kind: "function" }[] {
  return names.map((name) => ({ name, as: name, kind: "function" }));
}

/**
 * Everything the comparator imports from LensVisualizer. The binding takes the first module of an entry that
 * imports and provides every export of its expected kind, and fails with all the missing names at once, so a
 * rename in LV is found before any lens is traced.
 *
 * An export is taken from LensVisualizer's public barrel (`src/optics/{buildLens,optics,fieldGeometry,analysis,mtf,
 * geometry,chromatic}.ts`) wherever the barrel has it, and from the module that defines it otherwise. Every name is
 * that of LensVisualizer after its engine rewrite (460f841f): a checkout from before it is refused (`binding.ts`).
 *
 * To use one more LV export: add its name to the module's line here (or a line for a new module) and its
 * signature to `LvApi`; the type check fails until the two agree.
 */
export const LV_IMPORT_MANIFEST = [
  {
    module: "src/optics/math/diffractivePhase.ts",
    exports: [{ name: "DEFAULT_PHASE_WAVELENGTH_NM", as: "defaultPhaseWavelengthNm", kind: "number" }],
  },
  { module: "src/optics/publishedStations.ts", exports: functions("publishedZoomStations") },
  {
    module: "src/optics/buildLens.ts",
    exports: [{ name: "default", as: "buildLens", kind: "function" }, ...functions("prepareRuntimeState")],
  },
  {
    module: "src/optics/optics.ts",
    exports: functions(
      "traceEngineRay",
      "traceRay",
      "fopenAtZoomClamped",
      "epAtZoomClamped",
      "fNumberAtStopdown",
      "epZRelStopAtZoom",
      "xpZRelLastSurfAtZoom",
      "xpAtZoom",
      "wideOpenStopAtZoom",
      "paraxialTrace",
      "traceSkewRay",
      "skewImagePlaneIntercept",
      "isHeavyLensForRayWork",
    ),
  },
  {
    module: "src/optics/fieldGeometry.ts",
    exports: functions(
      "entrancePupilAtState",
      "computeAnalysisFieldGeometryAtState",
      "solveChiefRayForRuntimeLens",
      "chiefRayImageHeightForRuntimeLens",
      "chiefRayImageHeightAccurateForRuntimeLens",
    ),
  },
  {
    module: "src/optics/projection.ts",
    exports: functions(
      "projectionLaunchSlopeForField",
      "projectionFieldSlopesForImagePoint",
      "distortionProjectionReferenceForLens",
      "isFisheyeProjection",
    ),
  },
  {
    module: "src/optics/analysis.ts",
    exports: [
      ...functions(
        "computeCardinalElementsFromState",
        "createAnalysisRequest",
        "computeOffAxisFieldGeometry",
        "sampleCircularPupil",
        "sampleOrthogonalPupilFan",
        "computeComaAnalysis",
        "computeBokehFieldFootprint",
        "computeSphericalAberration",
        "computeSAProfile",
        "computeLongitudinalChromaticFocus",
        "computeDistortionCurve",
        "computeDistortionFieldGrid",
        "computeBothPupilAberrationProfiles",
        "computeLateralColorCurve",
        "computeFocusEFL",
        "computeFocusBreathingSeries",
        "computeOffAxisFieldGeometryScalar",
        "computeFieldCurvatureBundle",
      ),
      { name: "COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES", as: "comaRingSamples", kind: "object" },
      { name: "COMA_PREVIEW_FIELD_FRACTIONS", as: "comaFieldFractions", kind: "object" },
      { name: "MERIDIONAL_COMA_SAMPLE_COUNT", as: "comaFanSampleCount", kind: "number" },
      { name: "BOKEH_CIRCULAR_PUPIL_RING_SAMPLES", as: "bokehRingSamples", kind: "object" },
      { name: "BOKEH_PREVIEW_FIELD_FRACTIONS", as: "bokehFieldFractions", kind: "object" },
      { name: "NEAR_AXIS_REAL_FRAC", as: "saNearAxisFraction", kind: "number" },
      { name: "MARGINAL_PUPIL_FRACTIONS", as: "marginalPupilFractions", kind: "object" },
      { name: "DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS", as: "locaMarginalFractions", kind: "object" },
      { name: "PUPIL_ABERRATION_SAMPLE_COUNT", as: "pupilAberrationSampleCount", kind: "number" },
      { name: "DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS", as: "lateralColorFieldFractions", kind: "object" },
      { name: "FIELD_CURVATURE_FIELD_FRACTIONS", as: "fieldCurvatureFieldFractions", kind: "object" },
      { name: "FIELD_CURVATURE_CURVE_FIELD_FRACTIONS", as: "fieldCurvatureCurveFieldFractions", kind: "object" },
    ],
  },
  { module: "src/optics/analysis/sampling.ts", exports: functions("uniformFieldFraction") },
  {
    module: "src/optics/analysis/aberration/shared.ts",
    exports: [{ name: "PROFILE_FRACS", as: "saProfileFractions", kind: "object" }],
  },
  {
    module: "src/optics/mtf.ts",
    exports: [
      ...functions(
        "assessMtfSupport",
        "computeMtf",
        "computeMtfSteps",
        "resolveMtfSpectrum",
        "prepareMtfFieldLaunch",
        "findMtfFieldFootprint",
        "traceMtfBundle",
        "shearedOtf",
      ),
      { name: "MTF_FREQUENCIES", as: "mtfDefaultFrequencies", kind: "object" },
      { name: "MTF_FIELDS", as: "mtfDefaultFields", kind: "object" },
    ],
  },
  {
    module: "src/optics/geometry.ts",
    exports: [{ name: "FLAT_R_THRESHOLD", as: "flatRadiusThreshold", kind: "number" }],
  },
  {
    module: "src/optics/chromatic.ts",
    exports: [
      { name: "LINE_NM", as: "spectralLinesNm", kind: "object" },
      { name: "CHROMATIC_CHANNEL_WAVELENGTH_NM", as: "chromaticChannelWavelengthsNm", kind: "object" },
      ...functions("lensChromaticReference"),
    ],
  },
  {
    module: "src/optics/chromatic/channels.ts",
    exports: [{ name: "E_LINE_CHANNEL_WAVELENGTH_NM", as: "eLineChannelWavelengthsNm", kind: "object" }],
  },
  { module: "src/optics/trace/interactions.ts", exports: functions("rearMediumSurfaceIndex") },
  { module: "src/optics/trace/utils.ts", exports: functions("projectCoordinateToZ") },
  { module: "src/optics/math/vector.ts", exports: functions("directionFromSkewSlope", "directionFromMeridionalSlope") },
  { module: "src/optics/trace/aperture.ts", exports: functions("evaluateAperture") },
  { module: "src/optics/first-order/cardinals.ts", exports: functions("buildCardinalElementsFromMatrix") },
  {
    module: "src/optics/analysis/mtf/mtfTracing.ts",
    exports: functions("mtfIndexResolver", "mtfLaunchGrid", "mtfLaunchRay", "mtfImagePoint", "mtfTraceClassification"),
  },
  {
    module: "src/optics/analysis/mtf/mtfFields.ts",
    exports: functions(
      "mtfModeledHalfField",
      "mtfChiefHeight",
      "mtfBeamHeight",
      "resolveMtfFieldGeometry",
      "resolveMtfFieldTargets",
    ),
  },
  { module: "src/optics/analysis/mtf/mtfConjugates.ts", exports: functions("mtfFiniteObjectPoint") },
  { module: "src/optics/analysis/mtf/mtfFootprint.ts", exports: functions("expandMtfFootprint") },
  {
    module: "src/optics/analysis/mtf/mtfConstants.ts",
    exports: [
      { name: "MTF_GRID_LADDER", as: "mtfGridLadder", kind: "object" },
      { name: "MTF_DEFAULT_GRID_CAP", as: "mtfDefaultGridCap", kind: "number" },
      { name: "MTF_MAX_FOOTPRINT_EXPANSIONS", as: "mtfMaxFootprintExpansions", kind: "number" },
      { name: "MTF_MIN_RAYS", as: "mtfMinRays", kind: "number" },
    ],
  },
  {
    module: "src/optics/analysis/mtf/mtf.ts",
    exports: functions("refineMtfField", "emptyMtfField", "assessUnresolvedFlux"),
  },
  {
    module: "src/types/asphericSchema.ts",
    exports: [{ name: "ASPHERIC_POLYNOMIAL_TERMS", as: "asphericPolynomialTerms", kind: "object" }],
  },
  {
    module: "src/utils/state/mtfPreferences.ts",
    exports: [{ name: "DEFAULT_MTF_PREFERENCES", as: "mtfDefaultPreferences", kind: "object" }],
  },
] as const satisfies readonly LvManifestModule[];

type ManifestName = (typeof LV_IMPORT_MANIFEST)[number]["exports"][number]["as"];
type Agree = [ManifestName] extends [keyof LvApi] ? ([keyof LvApi] extends [ManifestName] ? true : never) : never;

/** Fails the type check when the manifest and `LvApi` do not name exactly the same exports. */
export const MANIFEST_MATCHES_API: Agree = true;
