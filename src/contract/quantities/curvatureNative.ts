// The quantity `curvature.native`: mirrors contract/schema/v1/quantities/curvature.native.spec.schema.json and
// curvature.native.data.schema.json. An engine's own field curves of a system at infinity: where the tangential and
// the sagittal focus of each field lie, along the axis, relative to the image plane of the case. What
// LensVisualizer's field-curve and astigmatism sections of its aberrations tab present, and what optiland's own
// `FieldCurvature` computes.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const CURVATURE_NATIVE = "curvature.native";

/** The version of `curvature.native`'s definition. */
export const CURVATURE_NATIVE_VERSION = 1;

/**
 * What a `curvature.native` request asks for: at each line, the tangential and the sagittal focus of the field of
 * each angle in object space, degrees, in the meridional plane, an object toward +y. `maxFieldDeg` is the half field
 * the angles are of, which an engine that states its fields as fractions of a half field takes for it. Every angle is
 * at least 0 and at most `maxFieldDeg`.
 */
export type CurvatureNativeSpec = {
  /** Indices of lines of the case, each once. */
  readonly lines: readonly number[];
  readonly maxFieldDeg: number;
  readonly fieldAnglesDeg: readonly number[];
};

/** One field at one line of an answer, in the order of the spec's lines and, within a line, its angles. */
export type CurvatureNativeField = {
  readonly line: number;
  /** The wavelength the engine traced the line at, nm. */
  readonly wavelengthNm: number;
  /** The field angle the engine traced, degrees. */
  readonly fieldAngleDeg: number;
  readonly status: "ok" | "unavailable";
  /** The engine's own code for an unavailable field. */
  readonly reason?: string;
  /**
   * The y at which the field's chief ray lands on the image plane of the case, mm: what identifies the field; null
   * where the engine states no landing of the chief ray its foci are relative to.
   */
  readonly chiefLandingMm: number | null;
  /**
   * The z of the field's tangential focus less the z of the image plane of the case, mm: + toward the image. Null for
   * an unavailable field.
   */
  readonly tangentialShiftMm: number | null;
  /** The same of the sagittal focus. */
  readonly sagittalShiftMm: number | null;
  /** How the engine sampled the field, and what else it states of it, by names of its own. */
  readonly sampling: { readonly [name: string]: number };
};

/** An engine's own field curves of a case. */
export type CurvatureNativeData = {
  readonly fields: readonly CurvatureNativeField[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
