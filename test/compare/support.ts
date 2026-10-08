// What the comparison tests share: participants with `selftest.echo` data, and the policy of the one rung.
import type { SelftestEchoData } from "../../src/contract/quantities/selftestEcho.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { ParticipantStatus } from "../../src/contract/comparison.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { echoValues } from "../../src/engines/fake/echo.ts";

/** `selftest.echo` data that holds exactly these elements, with their running sum. */
export function echoData(values: Float64Array, shape?: readonly number[]): SelftestEchoData {
  return { values: encodeNdArray(values, shape), sum: echoValues(values, 1).sum };
}

/** A participant that answered with these elements. */
export function answered(engine: string, values: Float64Array | readonly number[]): ParticipantResult {
  const elements = values instanceof Float64Array ? values : Float64Array.from(values);
  return { engine, fingerprint: `${engine} sources`, status: "ok", data: echoData(elements) };
}

/** A participant that did not answer, with what is known of why. */
export function ended(engine: string, status: Exclude<ParticipantStatus, "ok">, detail?: string): ParticipantResult {
  return { engine, fingerprint: `${engine} sources`, status, ...(detail === undefined ? {} : { detail }) };
}

/** The policy of the rung `selftest`, as `policy/rungs.v1.json` has it. */
export const GATED: RungPolicy = {
  quantity: "selftest.echo",
  mode: "direct",
  class: "gated",
  metrics: { "sum.abs": { tolerance: 1e-12, unit: "1" }, "values.maxAbs": { tolerance: 1e-12, unit: "1" } },
};

/** The same quantity as a recorded rung: one metric with an attention band, one that is only written down. */
export const RECORDED: RungPolicy = {
  quantity: "selftest.echo",
  mode: "independent-method",
  class: "recorded",
  metrics: { "sum.abs": { unit: "1" }, "values.maxAbs": { attention: 0.5, unit: "1" } },
};

/** A float64 array given by the bits of each element. */
export function fromBits(...bits: bigint[]): Float64Array {
  return new Float64Array(new BigUint64Array(bits).buffer);
}

/** The quiet NaN, a NaN with a payload, and the two infinities, as bits. */
export const BITS = {
  nan: 0x7ff8_0000_0000_0000n,
  nanPayload: 0x7ff8_0000_dead_beefn,
  inf: 0x7ff0_0000_0000_0000n,
  negInf: 0xfff0_0000_0000_0000n,
  one: 0x3ff0_0000_0000_0000n,
} as const;
