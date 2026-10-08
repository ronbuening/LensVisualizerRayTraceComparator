// The quantity `paraxial.first-order`: mirrors contract/schema/v1/quantities/paraxial.first-order.spec.schema.json
// and paraxial.first-order.data.schema.json. What an engine must compute is fixed in contract/CONTRACT.md.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";

/** The id of the quantity that holds a system's first-order data: what rung R1 compares. */
export const PARAXIAL_FIRST_ORDER = "paraxial.first-order";

/** The version of `paraxial.first-order`'s definition, which an engine that answers it states in its descriptor. */
export const PARAXIAL_FIRST_ORDER_VERSION = 1;

/**
 * The values of `paraxial.first-order` that are compared, in the order a comparison reads them. Each is one number
 * per line of the case, in mm; the positions are z in the contract frame.
 *
 * - `efl`: the effective focal length, the rear focal point minus the rear principal point;
 * - `frontFocalZ`, `rearFocalZ`, `frontPrincipalZ`, `rearPrincipalZ`: the cardinal points;
 * - `backFocus`: the rear focal point minus the vertex of the last lens surface;
 * - `entrancePupilZ`, `exitPupilZ`: the paraxial images of the stop in object space and in image space;
 * - `entrancePupilSemiDiameter`, `exitPupilSemiDiameter`: the radii of those images, from the stop's radius.
 */
export const FIRST_ORDER_VALUES = [
  "efl",
  "frontFocalZ",
  "rearFocalZ",
  "frontPrincipalZ",
  "rearPrincipalZ",
  "backFocus",
  "entrancePupilZ",
  "exitPupilZ",
  "entrancePupilSemiDiameter",
  "exitPupilSemiDiameter",
] as const;
/** The name of one compared value of `paraxial.first-order`. */
export type FirstOrderValue = (typeof FIRST_ORDER_VALUES)[number];

/**
 * The compared values that are the position of a pupil. A pupil can lie metres from the lens, where no arithmetic
 * places it to a fixed fraction of a millimetre, so a comparison measures these two against their distance from
 * the image plane as well as in plain millimetres.
 */
export const PUPIL_POSITIONS: readonly FirstOrderValue[] = Object.freeze(["entrancePupilZ", "exitPupilZ"] as const);

/** The distance of a pupil from the image plane, mm, up to which its position is compared in plain millimetres. */
export const PUPIL_DISTANCE_SCALE_MM = 1000;

/**
 * The `item` of the "unsupported" answer to a case whose system has no finite focal length at one of its lines.
 * Its `code` is `feature`.
 */
export const AFOCAL_SYSTEM = "system.afocal";

/**
 * The `item` of the "unsupported" answer to a case with a polynomial term of power 1: a cone has no curvature at
 * its vertex, so the surface has no paraxial power. Its `code` is `feature`.
 */
export const LINEAR_SAG_TERM = "surface.asphere.linear-term";

/** What a `paraxial.first-order` request asks for: nothing is left to choose. */
export type ParaxialFirstOrderSpec = Readonly<Record<string, never>>;

/** The first-order data of a system: every array is float64 of shape `[L]`, one value per line of the case. */
export type ParaxialFirstOrderData = { readonly [V in FirstOrderValue]: NdArrayWire } & {
  /**
   * Values of the engine's own, by name, each of shape `[L]`: they are reported beside the comparison and never
   * judged. An engine gives the paraxial magnification of a finite object here, as `magnification`.
   */
  readonly recorded: { readonly [name: string]: NdArrayWire };
};
