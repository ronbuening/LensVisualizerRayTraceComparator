// The quantity `chief.native`: mirrors contract/schema/v1/quantities/chief.native.spec.schema.json and
// chief.native.data.schema.json. An engine's own figures of the chief rays of a system at infinity across its field:
// what LensVisualizer's distortion tab, its pupils tab and the lateral-colour section of its chromatic tab present,
// and the chief rays and reference an engine traces and states for the same figures.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const CHIEF_NATIVE = "chief.native";

/** The version of `chief.native`'s definition. */
export const CHIEF_NATIVE_VERSION = 1;

/** The three kinds of figures a request asks for. */
export const CHIEF_KINDS = ["distortion", "lateral-colour", "pupils"] as const;
/** One kind of `chief.native` figure. */
export type ChiefKind = (typeof CHIEF_KINDS)[number];

/**
 * What a `chief.native` request asks for: the chief ray of each field, given by its angle in object space, degrees,
 * in the meridional plane, an object toward +y.
 *
 * - `distortion`: at one line, each field's real and ideal image heights and its percent distortion, against the
 *   engine's own rectilinear reference (`ChiefReference.focalScaleMm`);
 * - `pupils`: at one line, where each field's chief ray crosses the axis in object space (the real entrance pupil)
 *   and in image space (the real exit pupil), beside the paraxial pupils;
 * - `lateral-colour`: at each line, where each field's chief ray lands; the first line is the reference the others'
 *   landings are taken relative to.
 *
 * `maxFieldDeg` is the half field the angles are of, which an engine that states its fields as fractions of a half
 * field takes for it. Every angle is at least 0 and at most `maxFieldDeg`, and above 0 for distortion and pupils.
 */
export type ChiefNativeSpec = {
  readonly kind: ChiefKind;
  /** Indices of lines of the case, each once: one for distortion and pupils, the first the reference for colour. */
  readonly lines: readonly number[];
  readonly maxFieldDeg: number;
  readonly fieldAnglesDeg: readonly number[];
};

/**
 * What an engine presents of one field, heights in mm and z in the contract frame, mm. Distortion: the real image
 * height of the field as the engine's curve plots it, the ideal height of its reference, and the percent distortion
 * between them; pupils: the z at which the field's real chief ray crosses the axis ahead of the system and behind it.
 * A member a kind does not have is null.
 */
export type ChiefFigures = {
  readonly realHeightMm: number | null;
  readonly idealHeightMm: number | null;
  readonly percent: number | null;
  readonly entrancePupilZ: number | null;
  readonly exitPupilZ: number | null;
};

/**
 * The real chief ray an engine traced for a field of pupils, for figures the comparator forms
 * (`axialIntercept` of src/estimators/axialIntercept.ts): where it meets the first surface and its unit direction in
 * front of it, and where it leaves the last surface and its unit direction behind it; x, y, z each.
 */
export type ChiefRayLines = {
  readonly entryPoint: readonly number[];
  readonly entryDirection: readonly number[];
  readonly exitPoint: readonly number[];
  readonly exitDirection: readonly number[];
};

/** One field at one line of an answer, in the order of the spec's lines and, within a line, its angles. */
export type ChiefNativeField = {
  readonly line: number;
  /** The wavelength the engine traced the line at, nm. */
  readonly wavelengthNm: number;
  /** The field angle the engine traced, degrees. */
  readonly fieldAngleDeg: number;
  readonly status: "ok" | "unavailable";
  /** The engine's own code for an unavailable field. */
  readonly reason?: string;
  /** The y at which the field's chief ray lands on the image plane of the case, mm: what identifies the field. */
  readonly chiefLandingMm: number | null;
  /** The engine's own figures, or null for an engine that states its chief ray instead, and for lateral colour. */
  readonly figures: ChiefFigures | null;
  /** The chief ray the engine traced, or null for an engine that states its figures. */
  readonly chiefRay: ChiefRayLines | null;
  /** How the engine sampled the field, by names of its own. */
  readonly sampling: { readonly [name: string]: number };
};

/**
 * What an engine's figures are relative to, null where it states none: the scale of its rectilinear distortion
 * reference, mm (an ideal image height is the scale times the tangent of the field angle, negated in the contract
 * frame), the field angle of the chief ray that scale was measured with, degrees, and its paraxial entrance and exit
 * pupils, z in the contract frame.
 */
export type ChiefReference = {
  readonly focalScaleMm: number | null;
  readonly probeAngleDeg: number | null;
  readonly paraxialEntrancePupilZ: number | null;
  readonly paraxialExitPupilZ: number | null;
};

/** An engine's own chief-ray figures, or chief rays, of a case. */
export type ChiefNativeData = {
  readonly kind: ChiefKind;
  readonly fields: readonly ChiefNativeField[];
  readonly reference: ChiefReference;
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
