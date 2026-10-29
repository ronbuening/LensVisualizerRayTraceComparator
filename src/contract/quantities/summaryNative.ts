// The quantity `summary.native`: mirrors contract/schema/v1/quantities/summary.native.spec.schema.json and
// summary.native.data.schema.json. An engine's own first-order summary of a system as it presents it: the f-numbers it
// states and the pupil, stop, focal length and track they are of, each under the definition the contract names
// (CONTRACT.md). What LensVisualizer's summary tab and aperture control present, and what optiland's accessors state.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const SUMMARY_NATIVE = "summary.native";

/** The version of `summary.native`'s definition. */
export const SUMMARY_NATIVE_VERSION = 1;

/** What a `summary.native` request asks for: the engine's summary of the system at each of these lines of the case. */
export type SummaryNativeSpec = {
  /** Indices of lines of the case, each once. */
  readonly lines: readonly number[];
};

/**
 * The values of a summary, in the order a comparison reads them. Each is a number or null where the engine states
 * none under that definition (CONTRACT.md, `summary.native`):
 *
 * - `rearFocalZ`: z of the paraxial rear focal point in the contract frame, mm: what identifies the system;
 * - `focalLengthMm`: the effective focal length the f-numbers are formed with, mm;
 * - `entrancePupilDiameterMm`, `stopDiameterMm`: the entrance pupil's diameter and the stop's clear diameter, mm;
 * - `imageSpaceFNumber`: the focal length's magnitude over the entrance pupil's diameter, whatever the conjugate;
 * - `paraxialWorkingFNumber`: 1 / (2 n' |u'|) of the paraxial marginal ray of the case's axial object point (an
 *   estimate of another construction is none of these: it is null, and may be stated under `sampling`);
 * - `workingFNumber`: 1 / (2 n' sin θ') of the real marginal ray of that point, θ' its angle to the chief ray;
 * - `nominalFNumber`: the f-number the engine marks the aperture with, which is not computed from the system;
 * - `totalTrackMm`: the image plane's z less the first vertex's, mm;
 * - `halfFieldDeg`: the half field the engine assigns the system, degrees.
 */
export const SUMMARY_VALUES = [
  "rearFocalZ",
  "focalLengthMm",
  "entrancePupilDiameterMm",
  "stopDiameterMm",
  "imageSpaceFNumber",
  "paraxialWorkingFNumber",
  "workingFNumber",
  "nominalFNumber",
  "totalTrackMm",
  "halfFieldDeg",
] as const;
/** The name of one value of a summary. */
export type SummaryValue = (typeof SUMMARY_VALUES)[number];

/** One line of an answer, in the order of the spec's lines. */
export type SummaryNativeLine = {
  readonly line: number;
  /** The wavelength the engine's summary is of, nm. */
  readonly wavelengthNm: number;
  /** `ok`: the engine stands by the values it states. `unavailable`: it states none, and says why. */
  readonly status: "ok" | "unavailable";
  /** The engine's own code for a line that is not ok. */
  readonly reason?: string;
  /** What else the engine states of the line, by names of its own. */
  readonly sampling: { readonly [name: string]: number };
} & { readonly [V in SummaryValue]: number | null };

/** An engine's own first-order summary of a case. */
export type SummaryNativeData = {
  readonly lines: readonly SummaryNativeLine[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
