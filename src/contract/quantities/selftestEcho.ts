// The conformance quantity `selftest.echo`: mirrors contract/schema/v1/quantities/selftest.echo.spec.schema.json and
// selftest.echo.data.schema.json. What an engine must compute is fixed in contract/CONTRACT.md.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";

/** The id of the conformance quantity: one that needs no optics, so any engine or test double can answer it. */
export const SELFTEST_ECHO = "selftest.echo";

/** The version of `selftest.echo`'s definition, which an engine that answers it states in its descriptor. */
export const SELFTEST_ECHO_VERSION = 1;

/** What a `selftest.echo` request asks for. */
export type SelftestEchoSpec = {
  /** The elements to scale: float64, any shape. */
  readonly values: NdArrayWire;
  /** The factor every element that is not a NaN is multiplied by. */
  readonly scale: number;
};

/** The answer to a `selftest.echo` request. */
export type SelftestEchoData = {
  /** The scaled elements: float64, in the shape of the spec's `values`. */
  readonly values: NdArrayWire;
  /** The running sum of the scaled elements in index order, starting from 0; null when it is not finite. */
  readonly sum: number | null;
};
