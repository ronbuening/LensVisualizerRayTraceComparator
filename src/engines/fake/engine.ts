// The fake engine: a whole engine that knows no optics. It answers `selftest.echo` and nothing else, so the
// comparator's plumbing (configuration, transports, adapters, the store, comparison, reports) can be exercised and
// tested with neither LensVisualizer nor optiland. Its options make it differ from another fake, refuse, or
// misbehave in each way an adapter must survive.
//
// Configured as an in-process engine:
//
//   "engines": { "fake-a": { "transport": "in-process", "module": "src/engines/fake/engine.ts",
//                            "options": { "id": "fake-a" } } }
import { engineStamp } from "../../contract/engine.ts";
import type { EngineDescriptor } from "../../contract/engine.ts";
import { FEATURE_FLAGS } from "../../contract/features.ts";
import type { ProtocolHandler, ProtocolResponse } from "../../contract/protocol.ts";
import { SELFTEST_ECHO, SELFTEST_ECHO_VERSION } from "../../contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../../contract/quantities/selftestEcho.ts";
import type { QuantityRequest } from "../../contract/request.ts";
import { makeResult } from "../../contract/result.ts";
import type { ResultEnvelope } from "../../contract/result.ts";
import { formatIssues } from "../../contract/schemas.ts";
import { CONTRACT_VERSION } from "../../contract/version.ts";
import { sha256Hex } from "../../core/numeric/hash.ts";
import { decodeNdArray, encodeNdArray } from "../../core/numeric/ndarray.ts";
import type { NdArray } from "../../core/numeric/ndarray.ts";
import { selftestEchoQuantity } from "../../quantities/selftestEcho.ts";
import { createProtocolHandler } from "../protocolHandler.ts";
import { echoValues } from "./echo.ts";
import { FAKE_ENGINE_VERSION, parseFakeOptions } from "./options.ts";
import type { FailMode } from "./options.ts";

/** The reply a misbehaving fake gives in place of `proper`, the reply it would have given to the same `run`. */
function spoiled(proper: ProtocolResponse, failMode: Exclude<FailMode, "none" | "throw">): ProtocolResponse {
  if (failMode === "protocol-error") {
    const error = { code: "fake-failure", message: "the fake engine is set to fail (failMode protocol-error)" };
    return { contract: proper.contract, id: proper.id, ok: false, error };
  }
  // A message the fake refuses for its own reasons stays refused.
  if (!proper.ok) return proper;
  const result = proper.result as ResultEnvelope;
  if (failMode === "wrong-request-id") {
    return { ...proper, result: { ...result, requestId: sha256Hex(result.requestId) } };
  }
  const { diagnostics: _diagnostics, ...withoutDiagnostics } = result;
  return { ...proper, result: withoutDiagnostics as unknown as ResultEnvelope };
}

/**
 * Creates a fake engine from its options (`parseFakeOptions`: `id`, and optionally `bias`, `offersQuantities`,
 * `fingerprint` and `failMode`). Throws when they are not the fake engine's options.
 *
 * - `hello`: a descriptor with that id and fingerprint, which supports every feature flag without limits and
 *   offers `selftest.echo`, or no quantity at all when `offersQuantities` is false.
 * - `run` of `selftest.echo`: the quantity as the contract defines it, with `bias` added to every value that is
 *   not a NaN. With a bias of 0 the answer is bit for bit what any conforming engine gives. A spec that is not
 *   valid, or whose array does not decode, is a result of status "error" with the code `bad-spec`.
 * - `run` of anything else, or of anything when it offers no quantity: a result of status "unsupported" that names
 *   the quantity.
 * - A `failMode` other than "none" replaces the answer to every `run` as `FAIL_MODES` says.
 *
 * It keeps no state between messages and ignores the case beyond checking that it is one.
 */
export function createEngine(options: unknown): ProtocolHandler {
  const { id, bias, offersQuantities, failMode, fingerprint } = parseFakeOptions(options);
  const descriptor: EngineDescriptor = {
    contract: { min: CONTRACT_VERSION, max: CONTRACT_VERSION },
    identity: { id, version: FAKE_ENGINE_VERSION, fingerprint, details: { bias, offersQuantities, failMode } },
    capabilities: {
      features: { supported: [...FEATURE_FLAGS], limits: {} },
      quantities: offersQuantities ? { [SELFTEST_ECHO]: { version: SELFTEST_ECHO_VERSION } } : {},
      deterministic: true,
      maxConcurrency: 1,
    },
  };
  const engine = engineStamp(descriptor.identity);

  const run = (request: QuantityRequest): ResultEnvelope => {
    const failed = (message: string): ResultEnvelope =>
      makeResult(request, engine, { status: "error", error: { code: "bad-spec", message } });

    if (!offersQuantities || request.quantity !== SELFTEST_ECHO) {
      const message = `the fake engine does not offer ${request.quantity}`;
      return makeResult(request, engine, {
        status: "unsupported",
        unsupported: [{ code: "quantity", item: request.quantity, message }],
      });
    }
    const issues = selftestEchoQuantity.validateSpec(request.spec);
    if (issues.length > 0) return failed(`spec is not a ${SELFTEST_ECHO} spec: ${formatIssues(issues)}`);
    const spec = request.spec as SelftestEchoSpec;
    let input: NdArray;
    try {
      input = decodeNdArray(spec.values);
    } catch (error) {
      return failed(`spec.values does not decode: ${error instanceof Error ? error.message : String(error)}`);
    }
    // The schema has already said so; the test is what tells the compiler.
    if (input.dtype !== "f8") return failed(`spec.values is ${input.dtype}, not f8`);

    const echoed = echoValues(input.values, spec.scale, bias);
    const data: SelftestEchoData = { values: encodeNdArray(echoed.values, input.shape), sum: echoed.sum };
    return makeResult(request, engine, {
      status: "ok",
      method: { name: "fake-echo", params: { bias } },
      data,
      diagnostics: { warnings: [], counts: { values: input.values.length } },
    });
  };

  const answer = createProtocolHandler({ descriptor, run });
  if (failMode === "none") return answer;
  return (message) => {
    if (message.method !== "run") return answer(message);
    if (failMode === "throw") throw new Error("the fake engine is set to fail (failMode throw)");
    return Promise.resolve(answer(message)).then((proper) => spoiled(proper, failMode));
  };
}
