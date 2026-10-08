// What the engine, transport and adapter tests share: requests to send, and ways to watch and bend an engine.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import type { OpticalCase } from "../../src/contract/case.ts";
import type { ProtocolHandler, ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../../src/contract/quantities/selftestEcho.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { SINGLET_CASE } from "../contract/corpus.ts";

/** The case every request of these tests is about. */
export const CASE: OpticalCase = SINGLET_CASE;

/** A `selftest.echo` request about `CASE` for a spec. */
export function echoRequestFor(spec: SelftestEchoSpec): QuantityRequest {
  return makeRequest({ caseId: CASE.id, quantity: SELFTEST_ECHO, spec });
}

/** A `selftest.echo` request about `CASE` for the given elements, as one axis unless `shape` says otherwise. */
export function echoRequest(values: Float64Array, scale: number = 1, shape?: readonly number[]): QuantityRequest {
  return echoRequestFor({ values: encodeNdArray(values, shape), scale });
}

/** The elements a result of `selftest.echo` carries, decoded. Fails unless the result is "ok" and holds float64. */
export function echoedValues(result: ResultEnvelope): Float64Array {
  if (result.status !== "ok" || result.data === undefined) throw new Error(`the result is ${result.status}, not ok`);
  const decoded = decodeNdArray((result.data as SelftestEchoData).values);
  if (decoded.dtype !== "f8") throw new Error(`the result holds ${decoded.dtype}, not f8`);
  return decoded.values;
}

/** The IEEE 754 bit pattern of every element, read without going through a number. */
export function bitsOf(values: Float64Array): bigint[] {
  return [...new BigUint64Array(values.buffer, values.byteOffset, values.length)];
}

/** A `hello` message, as an adapter's first one. */
export const HELLO: ProtocolRequest = { contract: CONTRACT_VERSION, id: "1", method: "hello", params: {} };

/** A `shutdown` message. */
export function shutdownMessage(id: string = "1"): ProtocolRequest {
  return { contract: CONTRACT_VERSION, id, method: "shutdown", params: {} };
}

/** A `run` message that carries `request` and `CASE`. */
export function runMessage(request: QuantityRequest, id: string = "2"): ProtocolRequest {
  return { contract: CONTRACT_VERSION, id, method: "run", params: { request, case: CASE } };
}

/** A handler that answers as `handler` does and keeps every message it was given, in order. */
export function recording(handler: ProtocolHandler): { handler: ProtocolHandler; messages: ProtocolRequest[] } {
  const messages: ProtocolRequest[] = [];
  return {
    messages,
    handler: (message) => {
      messages.push(message);
      return handler(message);
    },
  };
}

/**
 * A handler that answers as `handler` does, except that the reply to each message of `method` is what `change`
 * makes of it. `change` gets a copy it may edit in place, or returns something else to send in its stead.
 */
export function bending(
  handler: ProtocolHandler,
  method: ProtocolRequest["method"],
  change: (reply: Record<string, unknown>, message: ProtocolRequest) => unknown,
): ProtocolHandler {
  return async (message) => {
    const reply = await handler(message);
    if (message.method !== method) return reply;
    const copy = structuredClone(reply) as unknown as Record<string, unknown>;
    const replaced = change(copy, message);
    // Only undefined means "the copy, as edited": null is a reply an engine can send.
    return (replaced === undefined ? copy : replaced) as ProtocolResponse;
  };
}

/** The TypeScript fake engine as a stdio worker: `node fakeEngine.mjs`, with its options in LVRTC_ENGINE_OPTIONS. */
export const STDIO_FAKE_ENGINE: string = fileURLToPath(
  new URL("../fixtures/stdio-worker/fakeEngine.mjs", import.meta.url),
);

/** The Python worker kit: the directory a worker's PYTHONPATH names. */
export const WORKER_KIT_PATH: string = fileURLToPath(new URL("../../workers/python", import.meta.url));

/** The interpreter the tests that need Python use: `LVRTC_PYTHON`, as the configuration reads it, else `python3`. */
export const PYTHON: string = process.env.LVRTC_PYTHON || "python3";

/**
 * Why the tests that need Python are skipped on this machine, or false when they can run: the worker kit needs an
 * interpreter of version 3.10 or later. Asked once, when the module is loaded.
 */
export const PYTHON_MISSING: string | false = (() => {
  const probe = spawnSync(PYTHON, ["-c", "import sys; print(sys.version_info >= (3, 10))"], {
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    timeout: 30_000,
  });
  if (probe.error !== undefined || probe.status !== 0) return `${PYTHON} is not available on this machine`;
  return probe.stdout.trim() === "True" ? false : `${PYTHON} is older than Python 3.10, which the worker kit needs`;
})();
