// The quantity `mtf.native`: mirrors contract/schema/v1/quantities/mtf.native.spec.schema.json and
// mtf.native.data.schema.json. What an engine must report is fixed in contract/CONTRACT.md.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { JsonObject } from "../json.ts";
import type { RunFields } from "../runSpec.ts";

/** The id of the quantity that is an engine's own MTF, by its own method and sampling. */
export const MTF_NATIVE = "mtf.native";

/** The version of `mtf.native`'s definition, which an engine that answers it states in its descriptor. */
export const MTF_NATIVE_VERSION = 1;

/**
 * The kind of MTF that is asked for: `geometric` from where rays land, without diffraction; `diffraction` with the
 * diffraction of the aperture. How an engine computes either is its own, and its answer names it.
 */
export type MtfMethod = "geometric" | "diffraction";

/**
 * The plane the MTF is of: `design`, the image plane of the case as it is; or `engine-best`, the plane the engine's
 * own focus criterion moves it to, which the answer states as a shift.
 */
export type MtfFocus = "design" | "engine-best";

/**
 * What became of one field: `ok`, the engine stands by its curves; `unconverged`, it has curves and says that its
 * sampling did not settle; `unavailable`, it has none.
 */
export type MtfFieldStatus = "ok" | "unconverged" | "unavailable";

/** The `mode` of an answer's focus when the curves are of the image plane of the case, unmoved. */
export const MTF_DESIGN_PLANE = "design";

/** What an `mtf.native` request asks for. */
export type MtfNativeSpec = {
  /** Spatial frequencies in image space, cycles/mm, ascending. */
  readonly frequenciesPerMm: readonly number[];
  /** The fields: fractions of the full image height as the engine resolves them, or angles in degrees. */
  readonly fields: RunFields;
  readonly method: MtfMethod;
  readonly focus: MtfFocus;
  /** A named, documented bundle of settings of one engine, for what the spec does not state. */
  readonly profile?: string;
};

/** The MTF of one requested field. */
export type MtfNativeField = {
  /** The field as it was requested: a fraction of the image height, or an angle in degrees. */
  readonly field: number;
  /** The chief-ray field angle the engine used, degrees; null where it found none. */
  readonly fieldAngleDeg: number | null;
  /** How far from the axis the field's reference chief ray lands on the plane the MTF is of, mm; null without one. */
  readonly imageHeightMm: number | null;
  /** MTF for frequency along image x: float64 `[F]`, each from 0 to 1; NaN in an unavailable field. */
  readonly sagittal: NdArrayWire;
  /** MTF for frequency along image y: float64 `[F]`, each from 0 to 1; NaN in an unavailable field. */
  readonly tangential: NdArrayWire;
  readonly status: MtfFieldStatus;
  /** The engine's own code for why the field is as its status says; always there for an unavailable field. */
  readonly reason?: string;
  /** How the engine sampled the field, by names of its own: a grid size, counts of rays. */
  readonly sampling: { readonly [name: string]: number };
};

/** An engine's own MTF of a case: one entry per requested field, and how the engine came by them. */
export type MtfNativeData = {
  readonly fields: readonly MtfNativeField[];
  /** The engine's own name for its method, and the settings it computed with. */
  readonly method: { readonly name: string; readonly params: JsonObject };
  /**
   * The plane the curves are of: `mode` is `MTF_DESIGN_PLANE` for the image plane of the case as it is, else the
   * engine's own name for the criterion that moved it; `appliedShiftMm` is how far along +z it lies from the image
   * plane of the case.
   */
  readonly focus: { readonly mode: string; readonly appliedShiftMm: number };
  /** What the engine measured of the aperture it computed with, by names of its own: recorded, never judged. */
  readonly aperture: { readonly [name: string]: number };
  /** The lines the engine actually computed with, the reference line first. */
  readonly lines: readonly { readonly wavelengthNm: number; readonly weight: number }[];
  /** What the engine says about the answer, for people. */
  readonly notes: readonly string[];
};
