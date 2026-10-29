// The quantity `axial.native`: mirrors contract/schema/v1/quantities/axial.native.spec.schema.json and
// axial.native.data.schema.json. An engine's own figures of the beam along the axis of a system at infinity: what
// LensVisualizer's spherical-aberration section (its aberrations tab) and its axial-colour section (its chromatic
// tab) present, and the real rays and the paraxial focus an engine traces for the same figures at each line.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const AXIAL_NATIVE = "axial.native";

/** The version of `axial.native`'s definition. */
export const AXIAL_NATIVE_VERSION = 1;

/**
 * Spherical aberration at one line: rays parallel to the axis at the given fractions of the pupil, each traced with
 * its mirror image, the near-axis pair the reference, the first marginal candidate whose pair arrives the marginal
 * pair, and the profile's pairs the bundle whose least-squares focus is the best focus.
 */
export type AxialSphericalSpec = {
  readonly kind: "spherical";
  /** One index of a line of the case. */
  readonly lines: readonly [number];
  readonly nearAxis: number;
  /** The candidates of the marginal pair, in the order they are tried: the first whose pair arrives is taken. */
  readonly marginal: readonly number[];
  readonly profile: readonly number[];
};

/**
 * Axial colour: one ray parallel to the axis at each line, the first of the candidate fractions at which the ray
 * arrives at two lines or more (one line where the request has one), at the same height at every line.
 */
export type AxialColourSpec = {
  readonly kind: "colour";
  /** Indices of lines of the case, each once; the first is the reference the relative focus is taken from. */
  readonly lines: readonly number[];
  readonly marginal: readonly number[];
};

/**
 * What an `axial.native` request asks for. A fraction is of the radius the engine states its zones of
 * (`AxialNativeData.pupilRadiusMm`), by its own construction: the real stop's, each ray aimed at its point of the stop
 * at the line it is traced at (LensVisualizer since #927), or the engine's own pupil of the axial beam at the first
 * line of the request, a ray then at the same height at every line (optiland). Which one is the engine's to say.
 */
export type AxialNativeSpec = AxialSphericalSpec | AxialColourSpec;

/**
 * What an engine presents of one line, every z in the contract frame, mm: where the marginal ray crosses the axis,
 * and for spherical aberration where the near-axis pair crosses it, the best focus of the profile's pairs, the RMS of
 * their heights there, and the profile itself: each zone's height at the best focus relative to the near-axis ray's,
 * mm, NaN for a zone whose pair did not arrive. `landingMm` is the height on the image plane of the case of the ray
 * the field is identified by: the mean of the near-axis pair for spherical aberration, the marginal ray for colour.
 */
export type AxialFigures = {
  readonly landingMm: number;
  readonly marginalFraction: number;
  readonly marginalInterceptZ: number;
  readonly nearAxisInterceptZ: number | null;
  readonly bestFocusZ: number | null;
  readonly bestFocusRmsMm: number | null;
  readonly profileMm: NdArrayWire | null;
};

/**
 * The real rays an engine traced for a line, for figures the comparator forms (`src/estimators/axialIntercept.ts`):
 * the signed fraction of each ray (float64 `[m]`), whether it arrived (uint8 `[m]`, 1 where it passed every surface)
 * and where it leaves the last surface, its point and its unit direction (float64 `[m, 3]`, NaN where it did not
 * arrive).
 */
export type AxialRays = {
  readonly fractions: NdArrayWire;
  readonly arrived: NdArrayWire;
  readonly exitPoint: NdArrayWire;
  readonly exitDirection: NdArrayWire;
};

/** One line of an answer, in the order of the spec's lines. */
export type AxialNativeField = {
  readonly line: number;
  /** The wavelength the engine traced the line at, nm. */
  readonly wavelengthNm: number;
  readonly status: "ok" | "unavailable";
  /** The engine's own code for an unavailable line. */
  readonly reason?: string;
  /** The paraxial rear focal point at the line, where the engine presents one. */
  readonly paraxialFocusZ: number | null;
  /** The engine's own figures, or null for an engine that states its rays instead. */
  readonly figures: AxialFigures | null;
  /** The rays the engine traced, or null for an engine that states its figures. */
  readonly rays: AxialRays | null;
  /** How the engine sampled the line, by names of its own. */
  readonly sampling: { readonly [name: string]: number };
};

/** An engine's own axial figures, or rays, of a case. */
export type AxialNativeData = {
  readonly kind: AxialNativeSpec["kind"];
  /** The radius the spec's fractions are of, mm. */
  readonly pupilRadiusMm: number;
  readonly fields: readonly AxialNativeField[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
