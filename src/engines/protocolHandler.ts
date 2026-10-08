// The protocol around an engine written in TypeScript: what a worker's message loop is for an engine in another
// language. An engine supplies its descriptor and a function that answers a request; this supplies the rest.
import { caseInvariantProblems } from "../contract/case.ts";
import type { OpticalCase } from "../contract/case.ts";
import { engineStamp } from "../contract/engine.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import type { ProtocolHandler, ProtocolResponse } from "../contract/protocol.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { makeResult } from "../contract/result.ts";
import type { ResultEnvelope } from "../contract/result.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";

/** An engine, without the protocol. */
export interface EngineImplementation {
  /** What the engine answers to `hello`, every time. */
  readonly descriptor: EngineDescriptor;
  /**
   * Answers one request about one case; both have been validated. "unsupported" is returned, not thrown. Throwing
   * means the engine failed on this request, and is answered as a result of status "error".
   */
  run(request: QuantityRequest, opticalCase: OpticalCase): ResultEnvelope | Promise<ResultEnvelope>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * A protocol handler for `engine`. Every message that is an object gets a reply, and none makes it reject:
 *
 * - `hello` is answered with the descriptor and `shutdown` with an empty object;
 * - `run` is answered with the engine's result, or, when the engine throws, with a result of status "error" and
 *   the code `engine-failure`;
 * - a `run` whose request or case is not valid by its own kind (the schema, and for the case its invariants, so the
 *   digest of its index table too), or whose request is about another case, is refused with `ok: false` and the
 *   code `bad-request`, saying which of the two and where;
 * - any other method is refused with the code `unknown-method`.
 *
 * Replies carry the message's `id` and this code's contract version. Identity hashes are not recomputed: an engine
 * echoes the ids it is given.
 */
export function createProtocolHandler(engine: EngineImplementation): ProtocolHandler {
  return async (message) => {
    const answered = (result: EngineDescriptor | ResultEnvelope | Record<string, never>): ProtocolResponse => ({
      contract: CONTRACT_VERSION,
      id: message.id,
      ok: true,
      result,
    });
    const refused = (code: string, text: string): ProtocolResponse => ({
      contract: CONTRACT_VERSION,
      id: message.id,
      ok: false,
      error: { code, message: text },
    });

    if (message.method === "hello") return answered(engine.descriptor);
    if (message.method === "shutdown") return answered({});
    if (message.method !== "run") {
      return refused("unknown-method", `unknown method ${JSON.stringify((message as { method: unknown }).method)}`);
    }

    const params: unknown = message.params;
    if (!isRecord(params)) return refused("bad-request", "params is not an object");
    for (const [member, kind] of [
      ["request", "request"],
      ["case", "optical-case"],
    ] as const) {
      const issues = validateKind(kind, params[member]);
      if (issues.length > 0) {
        return refused("bad-request", `params.${member} is not a valid ${kind}: ${formatIssues(issues)}`);
      }
    }
    const { request, case: opticalCase } = message.params;
    const problems = caseInvariantProblems(opticalCase.system, opticalCase.conditions);
    if (problems.length > 0) {
      return refused("bad-request", `params.case is not a valid optical-case: ${problems.join("; ")}`);
    }
    if (request.caseId !== opticalCase.id) {
      return refused("bad-request", `params.request is about case ${request.caseId}, params.case is ${opticalCase.id}`);
    }

    try {
      return answered(await engine.run(request, opticalCase));
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error);
      const stamp = engineStamp(engine.descriptor.identity);
      return answered(
        makeResult(request, stamp, { status: "error", error: { code: "engine-failure", message: text } }),
      );
    }
  };
}
