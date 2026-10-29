// The quantity `zernike.native`: mirrors contract/schema/v1/quantities/zernike.native.spec.schema.json and
// zernike.native.data.schema.json. Of each field, an engine's wavefront at one line referred to the sphere about the
// chief ray's landing, sampled at the midpoints of a square grid inside the unit circle of normalised pupil
// coordinates: its RMS and peak to valley, and its least-squares Zernike coefficients by OpticStudio's Standard or
// Fringe ordering, all in vacuum waves (CONTRACT.md, `zernike.native`).
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const ZERNIKE_NATIVE = "zernike.native";

/** The version of `zernike.native`'s definition. */
export const ZERNIKE_NATIVE_VERSION = 1;

/**
 * The orderings of the polynomials: `standard`, OpticStudio's Zernike Standard (Noll's sequential index from 1, each
 * of unit RMS over the unit disc), and `fringe`, OpticStudio's Zernike Fringe (the University of Arizona index from 1,
 * unnormalised).
 */
export const ZERNIKE_ORDERINGS = ["standard", "fringe"] as const;
/** One ordering of the polynomials. */
export type ZernikeOrdering = (typeof ZERNIKE_ORDERINGS)[number];

/** The most terms a Fringe fit takes: OpticStudio's 37. */
export const FRINGE_MAX_TERMS = 37;

/** What a `zernike.native` request asks for. */
export type ZernikeNativeSpec = {
  readonly line: number;
  /** Field angles in object space, degrees, an object toward +y positive. */
  readonly fieldAnglesDeg: readonly number[];
  /** The cells across the square of normalised pupil coordinates; even, at least 4. */
  readonly grid: number;
  readonly ordering: ZernikeOrdering;
  /** How many polynomials, from the first of the ordering. */
  readonly terms: number;
};

/** The figures of one field, in vacuum waves. */
export type ZernikeNativeField = {
  readonly fieldAngleDeg: number;
  /** How far from the axis the field's chief ray lands on the image plane of the case, mm; null for none. */
  readonly imageHeightMm: number | null;
  readonly status: "ok" | "unavailable";
  readonly reason?: string;
  /** As many as the spec's terms for an ok field; none for an unavailable one. */
  readonly coefficients: readonly number[];
  /** The RMS of the wavefront about its mean (piston removed). */
  readonly rmsToChiefWaves: number | null;
  /** The largest less the smallest wavefront. */
  readonly pvToChiefWaves: number | null;
  /** The RMS of the wavefront less the fitted polynomials. */
  readonly fitResidualRmsWaves: number | null;
  /**
   * The condition of the fit's normal equations, ||G||_1 ||G^-1||_1, G the Gram matrix of the polynomials at the valid
   * samples, as the engine computes it; null where it states none.
   */
  readonly fitCondition: number | null;
  readonly validSamples: number;
  readonly sampling: { readonly [name: string]: number };
};

/** The figures that are numbers or null, in the order a comparison reads them. */
export const ZERNIKE_FIGURES = ["rmsToChiefWaves", "pvToChiefWaves", "fitResidualRmsWaves"] as const;

/** An engine's own wavefront figures of a case at one line. */
export type ZernikeNativeData = {
  readonly line: { readonly index: number; readonly wavelengthNm: number };
  readonly grid: number;
  readonly ordering: ZernikeOrdering;
  readonly terms: number;
  readonly fields: readonly ZernikeNativeField[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
