// An engine adapter over any transport: it speaks the protocol, and trusts nothing that comes back.
import type { OpticalCase } from "../contract/case.ts";
import { engineStamp } from "../contract/engine.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import { deepFreeze } from "../contract/json.ts";
import type { Empty, ProtocolResponse, RunParams } from "../contract/protocol.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { makeResult, resultInvariantProblems } from "../contract/result.ts";
import type { ErrorInfo, ResultEnvelope } from "../contract/result.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { CONTRACT_VERSION, isContractInRange } from "../contract/version.ts";
import { TransportTimeoutError } from "../transports/transport.ts";
import type { Transport } from "../transports/transport.ts";
import { EngineUnavailableError } from "./adapter.ts";
import type { EngineAdapter, EngineUnavailableCode } from "./adapter.ts";

/**
 * The `error.code` of a result that `RemoteEngineAdapter.run` wrote in the engine's place:
 *
 * - `transport-timeout`: no reply came in time;
 * - `transport-error`: the message could not be delivered, or the engine went away;
 * - `invalid-response`: the reply is not a protocol response, or answers another message;
 * - `protocol-error`: the engine answered `ok: false`: it could not handle the message at all;
 * - `invalid-result`: the reply's result is not a valid result, or breaks a status rule;
 * - `request-id-mismatch`, `case-id-mismatch`: the result does not echo the id of the request, of the case;
 * - `engine-id-mismatch`, `fingerprint-mismatch`: the result carries another engine id, another fingerprint, than
 *   the descriptor the engine gave.
 *
 * An engine's own failure keeps the code the engine chose.
 */
export const RUN_ERROR_CODES = [
  "transport-timeout",
  "transport-error",
  "invalid-response",
  "protocol-error",
  "invalid-result",
  "request-id-mismatch",
  "case-id-mismatch",
  "engine-id-mismatch",
  "fingerprint-mismatch",
] as const;
/** One `error.code` the adapter writes. */
export type RunErrorCode = (typeof RUN_ERROR_CODES)[number];

/** How long the adapter waits for the reply to each kind of message, in milliseconds. */
export interface EngineTimeouts {
  readonly helloMs: number;
  readonly runMs: number;
  readonly shutdownMs: number;
}

/** The waits used when none are given: hello covers an engine's start-up, run a slow computation. */
export const DEFAULT_ENGINE_TIMEOUTS: EngineTimeouts = { helloMs: 30_000, runMs: 600_000, shutdownMs: 5_000 };

/** What a `RemoteEngineAdapter` is made from. */
export interface RemoteEngineOptions {
  /** The id the engine is configured under; its descriptor must state the same. */
  readonly id: string;
  /** The channel to the engine. The adapter opens it on the first `describe()` and closes it in `close()`. */
  readonly transport: Transport;
  /**
   * Waits that differ from `DEFAULT_ENGINE_TIMEOUTS`. A wait left out, or stated as undefined, keeps its default;
   * any other must be a number above 0, and the adapter cannot be made with one that is not.
   */
  readonly timeouts?: Partial<EngineTimeouts>;
}

/** The waits of an adapter: each default, unless `given` states a wait in its place. Throws for one that is no time. */
function resolvedTimeouts(engineId: string, given: Partial<EngineTimeouts> = {}): EngineTimeouts {
  const wait = (name: keyof EngineTimeouts): number => {
    const stated: unknown = given[name];
    // Not a spread over the defaults: a member that is present and undefined would replace its default.
    if (stated === undefined) return DEFAULT_ENGINE_TIMEOUTS[name];
    if (typeof stated !== "number" || !(stated > 0)) {
      const got = String(stated);
      throw new Error(`engine ${engineId}: timeouts.${name} must be a number of milliseconds above 0, got ${got}`);
    }
    return stated;
  };
  return { helloMs: wait("helloMs"), runMs: wait("runMs"), shutdownMs: wait("shutdownMs") };
}

type Message =
  | { readonly method: "hello" | "shutdown"; readonly params: Empty }
  | { readonly method: "run"; readonly params: RunParams };

/** What became of one message. */
type Reply =
  | { readonly kind: "result"; readonly result: unknown }
  | { readonly kind: "refused"; readonly error: ErrorInfo }
  | { readonly kind: "malformed" | "timeout" | "undelivered"; readonly problem: string };

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Reads a reply as the protocol envelope it must be. Its `result` is left for the caller, who knows which kind it
 * should be: validated inside the envelope, any fault in it would be reported at the root of the message and say
 * little. So the envelope is checked with an empty object where the result is.
 */
function readReply(reply: unknown, messageId: string): Reply {
  const hasResult =
    typeof reply === "object" && reply !== null && !Array.isArray(reply) && Object.hasOwn(reply, "result");
  const issues = validateKind("protocol-response", hasResult ? { ...reply, result: {} } : reply);
  if (issues.length > 0) {
    return { kind: "malformed", problem: `the reply is not a protocol response: ${formatIssues(issues)}` };
  }
  const response = reply as ProtocolResponse;
  if (response.id !== messageId) {
    const [answered, sent] = [JSON.stringify(response.id), JSON.stringify(messageId)];
    return { kind: "malformed", problem: `the reply answers message ${answered}, not message ${sent}` };
  }
  return response.ok ? { kind: "result", result: response.result } : { kind: "refused", error: response.error };
}

/**
 * An `EngineAdapter` for an engine behind a transport: a worker process, a function in this process, anything that
 * answers `hello`, `run` and `shutdown`.
 *
 * - `describe()` opens the transport, sends `hello` and accepts the answer only when it is a valid descriptor, the
 *   engine speaks this contract version and it names the configured id. The outcome is kept: the engine is asked
 *   once, and an engine found unavailable stays unavailable for this adapter.
 * - `run()` sends `run` and returns the engine's result only when it is a valid result that keeps the status rules,
 *   echoes the ids of the request and the case, and carries the descriptor's engine id and fingerprint. Anything
 *   else, and any failure to get a reply, becomes a result of status "error" with one of `RUN_ERROR_CODES`. It
 *   rejects only as `describe()` does, and for a misuse by its caller: a request about another case, or a call
 *   after `close()`.
 * - `close()` sends `shutdown` when the transport was opened, whatever the engine answers, and closes the
 *   transport. Every call returns the same promise.
 *
 * Results and the descriptor are returned frozen.
 */
export class RemoteEngineAdapter implements EngineAdapter {
  readonly id: string;
  readonly #transport: Transport;
  readonly #timeouts: EngineTimeouts;
  #handshake: Promise<EngineDescriptor> | undefined;
  #closing: Promise<void> | undefined;
  #opened = false;
  #messages = 0;

  constructor(options: RemoteEngineOptions) {
    this.id = options.id;
    this.#transport = options.transport;
    this.#timeouts = resolvedTimeouts(options.id, options.timeouts);
  }

  describe(): Promise<EngineDescriptor> {
    if (this.#handshake === undefined) {
      if (this.#closing !== undefined) return Promise.reject(new Error(`engine ${this.id}: describe() after close()`));
      this.#handshake = this.#hello();
    }
    return this.#handshake;
  }

  async run(request: QuantityRequest, opticalCase: OpticalCase): Promise<ResultEnvelope> {
    if (request.caseId !== opticalCase.id) {
      throw new Error(
        `engine ${this.id}: request ${request.id} is about case ${request.caseId}, not ${opticalCase.id}`,
      );
    }
    const { identity } = await this.describe();
    if (this.#closing !== undefined) throw new Error(`engine ${this.id}: run() after close()`);
    const failed = (code: RunErrorCode, message: string): ResultEnvelope =>
      makeResult(request, engineStamp(identity), { status: "error", error: { code, message } });

    const reply = await this.#exchange({ method: "run", params: { request, case: opticalCase } }, this.#timeouts.runMs);
    switch (reply.kind) {
      case "timeout":
        return failed("transport-timeout", reply.problem);
      case "undelivered":
        return failed("transport-error", reply.problem);
      case "malformed":
        return failed("invalid-response", reply.problem);
      case "refused":
        return failed("protocol-error", `the engine refused the message (${reply.error.code}): ${reply.error.message}`);
      case "result":
        break;
    }
    const issues = validateKind("result", reply.result);
    if (issues.length > 0) return failed("invalid-result", `the reply is not a result: ${formatIssues(issues)}`);
    const result = reply.result as ResultEnvelope;
    const problems = resultInvariantProblems(result);
    if (problems.length > 0) return failed("invalid-result", `the result breaks a status rule: ${problems.join("; ")}`);
    if (result.requestId !== request.id) {
      return failed("request-id-mismatch", `the result answers request ${result.requestId}, not ${request.id}`);
    }
    if (result.caseId !== opticalCase.id) {
      return failed("case-id-mismatch", `the result is about case ${result.caseId}, not ${opticalCase.id}`);
    }
    if (result.engine.id !== identity.id) {
      return failed("engine-id-mismatch", `the result is from engine ${result.engine.id}, not ${identity.id}`);
    }
    if (result.engine.fingerprint !== identity.fingerprint) {
      const carried = result.engine.fingerprint;
      return failed(
        "fingerprint-mismatch",
        `the result carries fingerprint ${carried}, the descriptor ${identity.fingerprint}`,
      );
    }
    return deepFreeze(result);
  }

  close(): Promise<void> {
    this.#closing ??= this.#shutdown();
    return this.#closing;
  }

  async #hello(): Promise<EngineDescriptor> {
    const unavailable = (code: EngineUnavailableCode, detail: string, cause?: unknown): EngineUnavailableError =>
      new EngineUnavailableError(this.id, code, detail, cause === undefined ? undefined : { cause });

    try {
      await this.#transport.open();
    } catch (error) {
      throw unavailable(
        "spawn-failed",
        `its ${this.#transport.kind} transport did not open: ${reasonOf(error)}`,
        error,
      );
    }
    this.#opened = true;

    const reply = await this.#exchange({ method: "hello", params: {} }, this.#timeouts.helloMs);
    if (reply.kind === "refused") {
      throw unavailable("hello-failed", `the engine refused hello (${reply.error.code}): ${reply.error.message}`);
    }
    if (reply.kind !== "result") throw unavailable("hello-failed", reply.problem);

    const issues = validateKind("engine-descriptor", reply.result);
    if (issues.length > 0) {
      throw unavailable("bad-descriptor", `the reply to hello is not an engine descriptor: ${formatIssues(issues)}`);
    }
    const descriptor = reply.result as EngineDescriptor;
    if (!isContractInRange(CONTRACT_VERSION, descriptor.contract)) {
      const { min, max } = descriptor.contract;
      throw unavailable("contract-mismatch", `it speaks contract ${min} to ${max}, the comparator ${CONTRACT_VERSION}`);
    }
    if (descriptor.identity.id !== this.id) {
      throw unavailable("id-mismatch", `its descriptor says it is engine ${descriptor.identity.id}`);
    }
    return deepFreeze(descriptor);
  }

  async #shutdown(): Promise<void> {
    if (this.#handshake !== undefined) {
      // A hello still under way is let finish, so that shutdown is not sent to a transport that is half open.
      await this.#handshake.catch(() => undefined);
      // Whatever became of shutdown, the transport is closed next: an engine that does not answer is still let go.
      if (this.#opened) await this.#exchange({ method: "shutdown", params: {} }, this.#timeouts.shutdownMs);
    }
    await this.#transport.close();
  }

  /** Sends one message under a fresh id and says what came back. Never rejects. */
  async #exchange(message: Message, timeoutMs: number): Promise<Reply> {
    const id = String(++this.#messages);
    let reply: unknown;
    try {
      reply = await this.#transport.call({ contract: CONTRACT_VERSION, id, ...message }, { timeoutMs });
    } catch (error) {
      if (error instanceof TransportTimeoutError) return { kind: "timeout", problem: error.message };
      return { kind: "undelivered", problem: `the transport failed: ${reasonOf(error)}` };
    }
    return readReply(reply, id);
  }
}
