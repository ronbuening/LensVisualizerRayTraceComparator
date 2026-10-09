// The engine adapter: the one interface the comparator talks to an engine through, wherever the engine runs.
import type { OpticalCase } from "../contract/case.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { ResultEnvelope } from "../contract/result.ts";

/** One engine, as the comparator uses it. */
export interface EngineAdapter {
  /** The engine id this adapter was configured under. The engine's descriptor and every result carry the same id. */
  readonly id: string;
  /**
   * Who the engine is and what it can do. The engine is asked once; later calls give the same answer. Rejects with
   * an `EngineUnavailableError` when the engine cannot be reached or is not the engine it was configured as.
   */
  describe(): Promise<EngineDescriptor>;
  /**
   * The engine's answer to one request about one case: always a valid result that echoes the request's ids and
   * carries the descriptor's engine id and fingerprint. Whatever the engine does wrong (no reply, a refusal, a
   * malformed reply, a reply to something else) is a result of status "error" with a code that says which;
   * "unsupported" is an answer like any other. Rejects with an `EngineUnavailableError` only when `describe()`
   * does.
   */
  run(request: QuantityRequest, opticalCase: OpticalCase): Promise<ResultEnvelope>;
  /** Releases the engine. Safe to call more than once. */
  close(): Promise<void>;
}

/**
 * Why an engine cannot be used at all:
 *
 * - `not-configured`: the configuration defines no engine with this id, or does not say where what a built-in
 *   engine runs is: the engine `lv` without an `lvPath`, the engine `optiland` without `engines.optiland.python`;
 * - `unsupported-transport`: its definition names a transport that has no implementation here;
 * - `load-failed`: an in-process engine's module is missing or could not be imported, or what a built-in engine
 *   runs cannot be loaded: the engine `lv` with an `lvPath` that holds no LensVisualizer it can load;
 * - `bad-module`: the module does not export a `createEngine` function;
 * - `create-failed`: `createEngine` threw, as it does for options it does not know, or did not return a handler;
 *   or a built-in engine could not be made;
 * - `spawn-failed`: the transport did not open, as when a worker's process does not start, or the interpreter a
 *   built-in engine's worker is run by is not on this machine;
 * - `hello-failed`: `hello` got no usable reply: none in time, a refusal (as from the worker of `optiland` when its
 *   interpreter cannot import optiland), or something that is not a reply to it;
 * - `bad-descriptor`: the reply to `hello` is not a valid engine descriptor;
 * - `contract-mismatch`: the engine does not speak this contract version;
 * - `id-mismatch`: the descriptor names another engine than the one configured.
 */
export const ENGINE_UNAVAILABLE_CODES = [
  "not-configured",
  "unsupported-transport",
  "load-failed",
  "bad-module",
  "create-failed",
  "spawn-failed",
  "hello-failed",
  "bad-descriptor",
  "contract-mismatch",
  "id-mismatch",
] as const;
/** One reason an engine cannot be used at all. */
export type EngineUnavailableCode = (typeof ENGINE_UNAVAILABLE_CODES)[number];

/**
 * An engine that cannot be used: it is not configured, cannot be started or reached, or is not what the
 * configuration says it is. It is a finding to report beside the engines that did run, not a crash: whoever drives
 * several engines catches it per engine and carries on with the others.
 */
export class EngineUnavailableError extends Error {
  /** The id the engine was asked for by. */
  readonly engineId: string;
  /** Machine-readable; `message` says the same for people and starts with the engine id and the code. */
  readonly code: EngineUnavailableCode;

  constructor(engineId: string, code: EngineUnavailableCode, detail: string, options?: ErrorOptions) {
    super(`engine ${engineId} is unavailable (${code}): ${detail}`, options);
    this.name = "EngineUnavailableError";
    this.engineId = engineId;
    this.code = code;
  }
}

/**
 * The engines there are to name, as a message says them: `the configuration defines fake-a, fake-b; built in: ref`.
 * Both lists are given sorted. Without a built-in engine nothing is said of them.
 */
export function enginesText(configured: readonly string[], builtin: readonly string[]): string {
  const defined = `the configuration defines ${configured.length === 0 ? "no engine" : configured.join(", ")}`;
  return builtin.length === 0 ? defined : `${defined}; built in: ${builtin.join(", ")}`;
}
