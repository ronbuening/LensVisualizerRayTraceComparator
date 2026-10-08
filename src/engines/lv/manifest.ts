import type { LvApi } from "./types.ts";

/** What `typeof` must say of an export for the binding to accept it. */
export type LvExportKind = "function" | "object" | "number" | "string" | "boolean";

/** One export the binding takes from a module: its name there, its name on the facade, and its expected kind. */
export interface LvManifestExport {
  readonly name: string;
  readonly as: string;
  readonly kind: LvExportKind;
}

/** One LensVisualizer module the binding imports, by its POSIX path relative to the LV root. */
export interface LvManifestModule {
  readonly module: string;
  readonly exports: readonly LvManifestExport[];
}

/** Named function exports that keep their name on the facade. */
function functions<const Name extends string>(
  ...names: Name[]
): { readonly name: Name; readonly as: Name; readonly kind: "function" }[] {
  return names.map((name) => ({ name, as: name, kind: "function" }));
}

/**
 * Everything the comparator imports from LensVisualizer. The binding imports each module, checks every export at
 * load time and fails with all the missing names at once, so a rename in LV is found before any lens is traced.
 *
 * To use one more LV export: add its name to the module's line here (or a line for a new module) and its
 * signature to `LvApi`; the type check fails until the two agree.
 */
export const LV_IMPORT_MANIFEST = [
  { module: "src/optics/buildLens.ts", exports: [{ name: "default", as: "buildLens", kind: "function" }] },
  {
    module: "src/optics/compat.ts",
    exports: functions(
      "prepareRuntimeState",
      "traceEngineRay2",
      "traceRay2",
      "computeCardinalElements2",
      "entrancePupilAtState2",
      "fopenAtZoom2",
      "epAtZoom2",
    ),
  },
  {
    module: "src/optics/layout.ts",
    exports: functions("epZRelStopAtZoom", "xpZRelLastSurfAtZoom", "xpAtZoom"),
  },
  {
    module: "src/optics/constants.ts",
    exports: [{ name: "FLAT_R_THRESHOLD", as: "flatRadiusThreshold", kind: "number" }],
  },
  {
    module: "src/types/asphericSchema.ts",
    exports: [{ name: "ASPHERIC_POLYNOMIAL_TERMS", as: "asphericPolynomialTerms", kind: "object" }],
  },
  { module: "src/optics/apertureStop.ts", exports: functions("wideOpenStopAtZoom") },
  { module: "src/optics/trace/aperture.ts", exports: functions("evaluateAperture") },
  { module: "src/optics/math/paraxial.ts", exports: functions("traceParaxialSurfaces2") },
  { module: "src/optics/first-order/systemMatrix.ts", exports: functions("computeSystemMatrix2") },
  { module: "src/optics/first-order/cardinals.ts", exports: functions("buildCardinalElementsFromMatrix2") },
  { module: "src/optics/analysis/mtfSupport.ts", exports: functions("assessMtfSupport") },
  { module: "src/optics/analysis/mtfTracing.ts", exports: functions("mtfIndexResolver") },
  { module: "src/optics/analysis/mtfConjugates.ts", exports: functions("mtfFiniteObjectPoint") },
  { module: "src/optics/spectralLines.ts", exports: [{ name: "LINE_NM", as: "spectralLinesNm", kind: "object" }] },
] as const satisfies readonly LvManifestModule[];

type ManifestName = (typeof LV_IMPORT_MANIFEST)[number]["exports"][number]["as"];
type Agree = [ManifestName] extends [keyof LvApi] ? ([keyof LvApi] extends [ManifestName] ? true : never) : never;

/** Fails the type check when the manifest and `LvApi` do not name exactly the same exports. */
export const MANIFEST_MATCHES_API: Agree = true;
