// The quantity `system.describe`: mirrors contract/schema/v1/quantities/system.describe.spec.schema.json and
// system.describe.data.schema.json. What an engine must report is fixed in contract/CONTRACT.md.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { AsphereTerm } from "../case.ts";

/** The id of the quantity that echoes the system an engine built: what rung R0 compares. */
export const SYSTEM_DESCRIBE = "system.describe";

/** The version of `system.describe`'s definition, which an engine that answers it states in its descriptor. */
export const SYSTEM_DESCRIBE_VERSION = 1;

/**
 * The fractions of a surface's nominal semi-diameter at which its sag is reported when a spec names none: nine,
 * from the vertex to the rim in steps of an eighth. Every one is a dyadic number, so a fraction times a
 * semi-diameter is one correctly rounded multiplication in any language.
 */
export const DEFAULT_SAG_FRACTIONS: readonly number[] = Object.freeze([
  0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1,
]);

/** What a `system.describe` request asks for. */
export type SystemDescribeSpec = {
  /** Fractions of each surface's nominal semi-diameter, in [0, 1] and ascending; `DEFAULT_SAG_FRACTIONS` without it. */
  readonly sagFractions?: readonly number[];
};

/**
 * The system an engine built for a case, re-read from the engine's own model and not from the case: S surfaces,
 * L lines and K sag radii per surface.
 */
export type SystemDescribeData = {
  /** S. */
  readonly surfaceCount: number;
  readonly stopIndex: number;
  /** The image plane, mm. */
  readonly imageZ: number;
  /** The stop's radius, mm: what the engine derives the pupils from. */
  readonly stopSemiDiameter: number;
  /** The vertex position of each surface, mm: float64, shape `[S]`. */
  readonly vertexZ: NdArrayWire;
  /** The base curvature of each surface, 1/mm: 1/radius, and 0 for a plane and for a flat base. Shape `[S]`. */
  readonly curvature: NdArrayWire;
  /** The conic constant of each surface; 0 for a plane. Shape `[S]`. */
  readonly conic: NdArrayWire;
  /**
   * The largest radial height at which the engine lets a ray pass each surface, mm; on the stop surface, the one of
   * the case's stop setting. Shape `[S]`.
   */
  readonly clipRadius: NdArrayWire;
  /** The index of the medium that follows each surface, per line: shape `[L, S]`. */
  readonly indexAfterSurface: NdArrayWire;
  /** The radial heights the sag is given at, mm: each fraction times the surface's nominal semi-diameter. `[S, K]`. */
  readonly sagRadii: NdArrayWire;
  /** The sag at each of those heights as the engine evaluates it, mm; NaN where the surface has none. `[S, K]`. */
  readonly sag: NdArrayWire;
  /** Per surface, the polynomial terms the engine holds whose coefficient is not zero, by ascending power. */
  readonly terms: readonly (readonly AsphereTerm[])[];
};
