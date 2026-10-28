// The quantity `seidel.native`: mirrors contract/schema/v1/quantities/seidel.native.spec.schema.json and
// seidel.native.data.schema.json. An engine's own third-order sums of a system at one line, surface by surface and in
// total, in OpticStudio's names and signs (CONTRACT.md, `seidel.native`): what optiland's `aberrations` states and what
// the engine `ref-seidel` computes from the paraxial marginal and chief rays of the case.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { JsonObject } from "../json.ts";

/** The id of the quantity. */
export const SEIDEL_NATIVE = "seidel.native";

/** The version of `seidel.native`'s definition. */
export const SEIDEL_NATIVE_VERSION = 1;

/** What a `seidel.native` request asks for. */
export type SeidelNativeSpec = {
  /** The line whose indices the paraxial rays are traced with: OpticStudio's primary wavelength. */
  readonly line: number;
  /** The field angle of the chief ray, degrees: its paraxial slope in object space is tan(maxFieldDeg). */
  readonly maxFieldDeg: number;
  /** The two lines of the chromatic sums, the shorter wavelength first; left out for none. */
  readonly dispersionLines?: readonly [number, number];
};

/**
 * The sums of a surface or of the system, in OpticStudio's order and names, lens units (mm): spherical aberration
 * (`SPHA`, S1), coma (`COMA`, S2), astigmatism (`ASTI`, S3), Petzval field curvature (`FCUR`, S4), distortion
 * (`DIST`, S5), longitudinal colour (`CLA`, CL) and transverse colour (`CTR`, CT).
 */
export const SEIDEL_SUMS = ["SPHA", "COMA", "ASTI", "FCUR", "DIST", "CLA", "CTR"] as const;
/** The name of one sum. */
export type SeidelSum = (typeof SEIDEL_SUMS)[number];

/** The five sums of third order, which an ok answer states in total. */
export const THIRD_ORDER_SUMS: readonly SeidelSum[] = Object.freeze(["SPHA", "COMA", "ASTI", "FCUR", "DIST"]);

/** The two first-order chromatic sums, stated only of dispersion lines. */
export const CHROMATIC_SUMS: readonly SeidelSum[] = Object.freeze(["CLA", "CTR"]);

/** The sums of one thing, each a number or null where the engine states none. */
export type SeidelSums = { readonly [S in SeidelSum]: number | null };

/** The sums of one surface of the case. */
export type SeidelSurface = { readonly surface: number } & SeidelSums;

/**
 * OpticStudio's wave coefficients of the sums, in waves of the line's vacuum wavelength: each a sum over a factor and
 * the wavelength (CONTRACT.md). The comparator forms them; no engine states them.
 */
export const WAVE_COEFFICIENTS: readonly { readonly name: string; readonly sum: SeidelSum; readonly factor: number }[] =
  Object.freeze([
    { name: "W040", sum: "SPHA", factor: 8 },
    { name: "W131", sum: "COMA", factor: 2 },
    { name: "W222", sum: "ASTI", factor: 2 },
    { name: "W220P", sum: "FCUR", factor: 4 },
    { name: "W311", sum: "DIST", factor: 2 },
    { name: "W020", sum: "CLA", factor: 2 },
    { name: "W111", sum: "CTR", factor: 1 },
  ]);

/** An engine's own third-order sums of a case at one line. */
export type SeidelNativeData = {
  readonly line: { readonly index: number; readonly wavelengthNm: number };
  readonly maxFieldDeg: number;
  readonly dispersionLines: readonly [number, number] | null;
  /** `ok`: the engine stands by the values it states. `unavailable`: it states none, and says why. */
  readonly status: "ok" | "unavailable";
  readonly reason?: string;
  /** The Lagrange invariant n (u_chief y_marginal - u_marginal y_chief) of the two rays, mm. */
  readonly invariant: number | null;
  readonly surfaces: readonly SeidelSurface[];
  readonly total: SeidelSums;
  readonly sampling: { readonly [name: string]: number };
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
