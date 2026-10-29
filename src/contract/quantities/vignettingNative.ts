// The quantity `vignetting.native`: mirrors contract/schema/v1/quantities/vignetting.native.spec.schema.json and
// vignetting.native.data.schema.json. An engine's own vignetting and relative illumination of a system at infinity:
// how much of the beam of each field gets through every aperture, and how bright its image is, each relative to the
// axis. What LensVisualizer's vignetting tab presents, and what the comparator's flux estimator on a traced lattice
// gives.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const VIGNETTING_NATIVE = "vignetting.native";

/** The version of `vignetting.native`'s definition. */
export const VIGNETTING_NATIVE_VERSION = 1;

/**
 * What a `vignetting.native` request asks for: at each line, the geometric transmission and the relative illumination
 * of the field of each angle in object space, degrees, in the meridional plane, an object toward +y, each relative to
 * the axis. The first angle is 0, the axis: what every figure of the line is relative to. `maxFieldDeg` is the half
 * field the angles are of. Every angle is at least 0 and at most `maxFieldDeg`.
 */
export type VignettingNativeSpec = {
  /** Indices of lines of the case, each once. */
  readonly lines: readonly number[];
  readonly maxFieldDeg: number;
  readonly fieldAnglesDeg: readonly number[];
};

/** One field at one line of an answer, in the order of the spec's lines and, within a line, its angles. */
export type VignettingNativeField = {
  readonly line: number;
  /** The wavelength the engine traced the line at, nm. */
  readonly wavelengthNm: number;
  /** The field angle the engine traced, degrees. */
  readonly fieldAngleDeg: number;
  /**
   * `ok`: the engine stands by its figures. `unconverged`: it has figures and does not stand by them, and says why.
   * `unavailable`: it has none, and says why.
   */
  readonly status: "ok" | "unconverged" | "unavailable";
  /** The engine's own code for a field that is not ok. */
  readonly reason?: string;
  /**
   * The y at which the field's chief ray lands on the image plane of the case, mm: what identifies the field; null
   * where the engine states no landing.
   */
  readonly chiefLandingMm: number | null;
  /**
   * The share of the field's beam that gets through every aperture: the engine's own measure of it, at least 0, and
   * not over the axis's (an axis an aperture clips is below 1). Null for an unavailable field.
   */
  readonly geometricTransmission: number | null;
  /** How bright the field's image is, over the axis's: the engine's own measure of it, at least 0. Null likewise. */
  readonly relativeIllumination: number | null;
  /** How the engine sampled the field, and what else it states of it, by names of its own. */
  readonly sampling: { readonly [name: string]: number };
};

/** An engine's own vignetting and relative illumination of a case. */
export type VignettingNativeData = {
  readonly fields: readonly VignettingNativeField[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
