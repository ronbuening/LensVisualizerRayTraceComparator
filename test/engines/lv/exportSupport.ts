// What the hermetic tests of the case exporter share: prepared states built by hand, and stand-ins for the
// LensVisualizer functions the exporter calls. Nothing here loads LensVisualizer, and no number describes a real lens.
import type { ExportCaseInput, LvExportApi } from "../../../src/engines/lv/exportCase.ts";
import type {
  LvApertureEvaluation,
  LvAsphere,
  LvFiniteConjugate,
  LvMtfOptions,
  LvMtfSupport,
  LvPreparedState,
  LvRuntimeLens,
  LvSpectralLine,
  LvSurface,
  LvVec3,
} from "../../../src/engines/lv/types.ts";

/** LensVisualizer's spelling of a flat surface. */
export const FLAT = 1e15;

/** A surface of a hand-built state: only what differs from an ordinary refracting sphere in air needs stating. */
export interface SurfaceSpec {
  readonly label: string;
  readonly R: number;
  readonly d: number;
  readonly nd?: number;
  readonly sd?: number;
  readonly innerSd?: number | null;
  readonly elemId?: number;
  readonly asphere?: LvAsphere | null;
  /** The profile kind LensVisualizer would report; derived from `R` and `asphere` unless given. */
  readonly kind?: string;
  readonly interaction?: string;
  readonly diffractive?: object | null;
  /** The value of LV's `source.synthetic`. */
  readonly synthetic?: string;
}

/** What a hand-built state is, beside its surfaces. */
export interface StateSpec {
  readonly stopIndex: number;
  readonly focusT?: number;
  readonly zoomT?: number;
  /** The image plane's z; one last gap behind the last vertex unless given. */
  readonly imgZ?: number;
  readonly normal?: LvVec3;
  readonly imagePoint?: readonly [number, number];
  readonly folded?: boolean;
  readonly projection?: string;
  readonly runtime?: Partial<LvRuntimeLens>;
}

/** A prepared state as LensVisualizer would hand it out: vertices at the running sum of the gaps. */
export function stateOf(surfaces: readonly SurfaceSpec[], spec: StateSpec): LvPreparedState {
  const z: number[] = [];
  let position = 0;
  const compiled = surfaces.map((surface, physicalIndex): LvSurface => {
    const flat = Math.abs(surface.R) > 1e10;
    const asphere = surface.asphere ?? null;
    const built = {
      physicalIndex,
      label: surface.label,
      R: surface.R,
      d: surface.d,
      nd: surface.nd ?? 1,
      sd: surface.sd ?? 10,
      innerSd: surface.innerSd ?? null,
      elemId: surface.elemId ?? ((surface.nd ?? 1) === 1 ? 0 : physicalIndex + 1),
      asphere,
      diffractive: surface.diffractive ?? null,
      interaction: { type: surface.interaction ?? "refract" },
      profile: {
        kind: surface.kind ?? (asphere ? "aspheric" : flat ? "flat" : "spherical"),
        sag: () => 0,
        slope: () => 0,
      },
      z: position,
      // LV keeps the rear-plate flag on the authored record only; `syntheticKind` reads it from there.
      source: surface.synthetic === undefined ? {} : { synthetic: surface.synthetic },
    };
    z.push(position);
    position += surface.d;
    return built;
  });
  const imgZ = spec.imgZ ?? position;
  const runtime: LvRuntimeLens = {
    lastLensSurfaceIdx: surfaces.findLastIndex((surface) => surface.synthetic === undefined),
    isZoom: false,
    elements: [],
    ...spec.runtime,
  };
  return {
    lens: {
      key: "hand-built",
      runtime,
      stop: { surfaceIndex: spec.stopIndex },
      flags: { isFoldedOptics: spec.folded ?? false },
      projection: { kind: spec.projection ?? "rectilinear" },
    },
    focusT: spec.focusT ?? 0,
    zoomT: spec.zoomT ?? 0,
    surfaces: compiled,
    z,
    imagePlane: {
      point: [spec.imagePoint?.[0] ?? 0, spec.imagePoint?.[1] ?? 0, imgZ],
      normal: spec.normal ?? [0, 0, 1],
    },
    imgZ,
    // A trap, not a source: the exporter takes the image plane from `imgZ`. A case built from this is not valid.
    totalTrack: Number.NaN,
  };
}

/** LensVisualizer's clip rule (src/optics/trace/aperture.ts), with the stop override its tracers use. */
export function lvEvaluateAperture(
  state: LvPreparedState,
  surface: LvSurface,
  radius: number,
  stopSemiDiameter?: number,
): LvApertureEvaluation {
  const isStop = surface.physicalIndex === state.lens.stop.surfaceIndex;
  const semiDiameter = isStop && stopSemiDiameter !== undefined ? stopSemiDiameter : surface.sd;
  const innerSemiDiameter = surface.innerSd ?? 0;
  let apertureState: LvApertureEvaluation["state"] = "inside";
  if (radius > semiDiameter + Math.max(1e-9, Math.abs(semiDiameter) * 1e-12)) apertureState = "outside";
  else if (innerSemiDiameter > 0) {
    const tolerance = Math.max(1e-9, Math.abs(innerSemiDiameter) * 1e-12);
    apertureState = radius >= innerSemiDiameter - tolerance ? "inside" : "inside-hole";
  }
  return { state: apertureState, radius, semiDiameter, innerSemiDiameter };
}

/** LensVisualizer's lines, as its `LINE_NM` names them. */
export const LINES_NM = { C: 656.2725, d: 587.5618, e: 546.074, F: 486.1327, g: 435.8343 } as const;

/** LensVisualizer's photopic lines and weights, the 555 nm reference first. */
export const PHOTOPIC: readonly LvSpectralLine[] = [
  { wavelengthNm: 555, weight: 1 },
  { wavelengthNm: 470, weight: 0.091 },
  { wavelengthNm: 510, weight: 0.503 },
  { wavelengthNm: 610, weight: 0.503 },
  { wavelengthNm: 650, weight: 0.107 },
];

/** LensVisualizer's C/d/F lines, the d reference first. */
export const CDF: readonly LvSpectralLine[] = [LINES_NM.d, LINES_NM.C, LINES_NM.F].map((wavelengthNm) => ({
  wavelengthNm,
  weight: 1 / 3,
}));

/** What the stand-in support gate is told to say, beside what LV's gate says of every state. */
export interface GateSpec {
  /** The gate refuses with this reason, after it has looked at the conjugate as LV's does. */
  readonly reason?: string;
  /** The lens mixes d- and e-referenced glasses, so even its reference line is traced with resolved indices. */
  readonly mixed?: boolean;
  /** The reference wavelength of the lens: the d line unless given. */
  readonly referenceNm?: number;
  /** The conjugate LV certifies for a refocused state; without one a refocused state is refused. */
  readonly conjugate?: LvFiniteConjugate;
}

/**
 * A support gate that answers as LensVisualizer's `assessMtfSupport` does for a lens it supports: the lines of the
 * spectrum, the reference line first; resolved indices for a spectral run and for mixed references; and, away from
 * infinity focus, the conjugate, or the refusal "finite-conjugate-unavailable".
 */
export function gate(spec: GateSpec = {}): (state: LvPreparedState, options: LvMtfOptions) => LvMtfSupport {
  return (state, options) => {
    const referenceNm = spec.referenceNm ?? LINES_NM.d;
    const reference = [{ wavelengthNm: referenceNm, weight: 1 }];
    const lines = options.spectrum === "cdf" ? CDF : options.spectrum === "photopic" ? PHOTOPIC : reference;
    const support: LvMtfSupport = {
      available: true,
      reason: null,
      message: "Simulation of the authored prescription.",
      referenceWavelengthNm: referenceNm,
      useResolvedReference: spec.mixed ?? false,
      spectralLines: lines.map((line) => ({ ...line })),
      limitations: [],
    };
    const reject = (reason: string): LvMtfSupport => ({
      ...support,
      available: false,
      reason,
      message: `LV says ${reason}.`,
    });
    // LV's gate rejects an unsupported path before it looks at the focus position, and a scale after.
    if (spec.reason === "unsupported-path") return reject(spec.reason);
    let certified = support;
    if (state.focusT !== 0) {
      if (spec.conjugate === undefined) return reject("finite-conjugate-unavailable");
      certified = { ...support, conjugate: spec.conjugate };
    }
    if (spec.reason !== undefined) return { ...reject(spec.reason), conjugate: certified.conjugate };
    if (options.spectrum === "reference") return certified;
    return { ...certified, referenceWavelengthNm: lines[0].wavelengthNm, useResolvedReference: true };
  };
}

/** The dispersion of the stand-in resolver: an index per nm from the d line, the same for every glass. */
export const DISPERSION_PER_NM = 1e-5;

/** The index the stand-in resolver gives a glass of index `nd` at a wavelength; air stays 1. */
export function resolvedIndex(nd: number, wavelengthNm: number): number {
  return nd === 1 ? 1 : nd + (LINES_NM.d - wavelengthNm) * DISPERSION_PER_NM;
}

/**
 * Stand-ins for the LensVisualizer functions the exporter calls, behaving as LV's do: `prepareRuntimeState` hands
 * out `state` whatever is asked, the wide-open stop radius is the prepared stop surface's `sd`, the widest f-number
 * is 2, and the gate is `gate()`. `overrides` replaces any of them.
 */
export function apiFor(state: LvPreparedState, overrides: Partial<LvExportApi> = {}): LvExportApi {
  return {
    prepareRuntimeState: () => state,
    wideOpenStopAtZoom: () => state.surfaces[state.lens.stop.surfaceIndex].sd,
    fopenAtZoom2: () => 2,
    evaluateAperture: lvEvaluateAperture,
    assessMtfSupport: gate(),
    mtfIndexResolver: (_state, support, wavelengthNm) =>
      support.useResolvedReference ? (_surfaceIndex, nd) => resolvedIndex(nd, wavelengthNm) : undefined,
    mtfFiniteObjectPoint: (prepared, conjugate) => [0, 0, prepared.surfaces[0].z - conjugate.objectDistanceMm],
    spectralLinesNm: LINES_NM,
    ...overrides,
  };
}

/** The lens file every hand-built case says it came from. */
export const LENS: ExportCaseInput["lens"] = {
  key: "hand-built",
  name: "Hand-built lens",
  file: "src/lens-data/acme/HandBuilt.data.ts",
  fileSha256: "ab".repeat(32),
};

/** The LensVisualizer checkout every hand-built case says it came from. */
export const LV_PROVENANCE: ExportCaseInput["lv"] = {
  commit: "c".repeat(40),
  dirty: false,
  closureHash: "cd".repeat(32),
};

/** The input of `exportCase` for a hand-built state, with any option of the run and any stand-in replaced. */
export function inputFor(
  state: LvPreparedState,
  options: ExportCaseInput["options"] = {},
  overrides: Partial<LvExportApi> = {},
): ExportCaseInput {
  return { api: apiFor(state, overrides), lens: LENS, runtime: state.lens.runtime, options, lv: LV_PROVENANCE };
}

/**
 * A small lens with one surface of each translation: a sphere, an even asphere, the stop, an odd asphere on a flat
 * base, a sphere, and a rear plate. Index 2 is the stop.
 */
export const TRIPLET: readonly SurfaceSpec[] = [
  { label: "1", R: 40, d: 3, nd: 1.6, sd: 9 },
  { label: "2A", R: -80, d: 2, sd: 9, asphere: { K: -1, A4: 1e-6, A6: 0, A8: -2e-10, A10: 0, A12: 0, A14: 0 } },
  { label: "STO", R: FLAT, d: 2, sd: 3 },
  {
    label: "4A",
    R: FLAT,
    d: 3,
    nd: 1.7,
    sd: 7,
    asphere: { K: 0, A4: 3e-6, A6: 0, A8: 0, A10: 0, A12: 0, A14: 0, A3: 2e-5 },
  },
  { label: "5", R: -60, d: 30, sd: 7 },
  { label: "RP1a", R: FLAT, d: 1.5, nd: 1.5, sd: 12, elemId: 9, synthetic: "rearPlate" },
  { label: "RP1b", R: FLAT, d: 0.5, sd: 12, synthetic: "rearPlate" },
];
