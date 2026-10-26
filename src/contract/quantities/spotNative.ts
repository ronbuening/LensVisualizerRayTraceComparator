// The quantity `spot.native`: mirrors contract/schema/v1/quantities/spot.native.spec.schema.json and
// spot.native.data.schema.json. An engine's own spot of a bundle, or its own ray fan, by its own sampling of the
// pupil: what LensVisualizer's coma and bokeh tabs present, and what optiland's SpotDiagram and RayFan give.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const SPOT_NATIVE = "spot.native";

/** The version of `spot.native`'s definition. */
export const SPOT_NATIVE_VERSION = 1;

/**
 * The fields of a request: fractions of the half-field angle of the state, as the engine that models the lens
 * defines it (LensVisualizer's coma and bokeh tabs; another engine is handed the angles with its option
 * `fieldAnglesDeg`), or angles in degrees.
 */
export type SpotFields =
  | { readonly kind: "half-field-fractions"; readonly values: readonly number[] }
  | { readonly kind: "angles-deg"; readonly values: readonly number[] };

/** How a ray of a spot counts: for its area of the pupil alone, or times the bulk transmission of its path. */
export type SpotWeighting = "area" | "area-transmission";

/** One axis of a ray fan: tangential (pupil y, in the plane of the field) or sagittal (pupil x). */
export type FanAxis = "tangential" | "sagittal";

/** What the pupil of a request is: a spot filled by rings, or a fan along one axis. */
export type SpotPupil =
  | { readonly kind: "rings"; readonly rings: readonly number[]; readonly weighting: SpotWeighting }
  | { readonly kind: "fan"; readonly axis: FanAxis; readonly samples: number };

/** What a `spot.native` request asks for. */
export type SpotNativeSpec = {
  /** The index of the line of the case the rays are traced at. */
  readonly line: number;
  readonly fields: SpotFields;
  readonly pupil: SpotPupil;
};

/** The spot of a field: its centroid relative to the chief ray's landing, [x, y] mm, and its RMS radius about it. */
export type SpotFigures = {
  readonly centroidMm: readonly [number, number];
  readonly rmsRadiusMm: number;
};

/**
 * The fan of a field: the pupil coordinate of each sample, -1 to 1, and its transverse error along the fan's axis
 * relative to the chief ray's landing, mm, NaN where the sample did not land. Both float64 `[m]`.
 */
export type FanFigures = {
  readonly pupil: NdArrayWire;
  readonly errorMm: NdArrayWire;
};

/** One field of an answer. */
export type SpotNativeField = {
  /** The field as it was requested. */
  readonly field: number;
  readonly fieldAngleDeg: number | null;
  /** How far from the axis the engine's chief ray of the field lands on the image plane of the case, mm. */
  readonly imageHeightMm: number | null;
  readonly status: "ok" | "unavailable";
  /** The engine's own code for an unavailable field. */
  readonly reason?: string;
  /** Of a rings pattern that is ok; null otherwise. */
  readonly spot: SpotFigures | null;
  /** Of a fan that is ok; null otherwise. */
  readonly fan: FanFigures | null;
  /** How the engine sampled the field, by names of its own. */
  readonly sampling: { readonly [name: string]: number };
};

/** An engine's own spot, or ray fan, of a case. */
export type SpotNativeData = {
  readonly pattern: SpotPupil["kind"];
  readonly fields: readonly SpotNativeField[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  /** The one line the engine traced at. */
  readonly lines: readonly { readonly wavelengthNm: number; readonly weight: number }[];
  readonly notes: readonly string[];
};
