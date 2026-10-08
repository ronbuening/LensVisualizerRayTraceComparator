// The in-process transport: an engine that is a function in this process, reached as if it were not.
//
// Every message and every reply is written as JSON text and parsed again. So the handler never holds an object the
// caller holds, cannot be handed or hand back anything JSON cannot carry, and sees exactly what a worker in another
// process would see: an engine that works here works over any other transport.
import type { ProtocolHandler, ProtocolRequest, ProtocolResponse } from "../contract/protocol.ts";
import { TransportTimeoutError } from "./transport.ts";
import type { Transport } from "./transport.ts";

/** The longest delay a timer takes; a longer one would fire at once. */
const MAX_TIMER_MS = 2 ** 31 - 1;

/** `value` as it is after travelling as JSON text. Throws when it has no JSON text at all. */
function throughJson(value: unknown, what: string): unknown {
  let text: string | undefined;
  try {
    text = JSON.stringify(value);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`in-process transport: the ${what} cannot be written as JSON: ${reason}`, { cause: error });
  }
  // undefined, a function and a symbol have no JSON text; JSON.stringify returns undefined for them.
  if (text === undefined) throw new Error(`in-process transport: the ${what} is ${typeof value}, which is not JSON`);
  return JSON.parse(text);
}

/** Settles as `work` does, or rejects with a `TransportTimeoutError` when `work` is still pending after `timeoutMs`. */
function withTimeout<T>(work: Promise<T>, method: string, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new TransportTimeoutError(method, timeoutMs)),
      Math.min(timeoutMs, MAX_TIMER_MS),
    );
    work.then(resolve, reject).finally(() => clearTimeout(timer));
  });
}

/**
 * A transport around a protocol handler in this process.
 *
 * - The handler is given a copy of the message made by `JSON.stringify` and `JSON.parse`, and the caller a copy of
 *   the reply made the same way: no object is shared in either direction, and a value JSON cannot carry arrives as
 *   JSON would deliver it (NaN as null, an undefined member not at all, a Date as text) or not at all.
 * - A handler that throws or rejects makes `call` reject with what it threw, as a worker that died would.
 * - A reply that is not ready after `timeoutMs` makes `call` reject with a `TransportTimeoutError`; what the handler
 *   returns later is dropped. A handler that blocks the thread cannot be timed out.
 * - `call` rejects before `open` and after `close`. Nothing is started or stopped: the handler's life is its
 *   creator's concern.
 */
export function createInProcessTransport(handler: ProtocolHandler): Transport {
  let state: "new" | "open" | "closed" = "new";
  return {
    kind: "in-process",
    open: async () => {
      if (state === "closed") throw new Error("in-process transport: open() after close()");
      state = "open";
    },
    call: async (request, { timeoutMs }) => {
      if (state !== "open") {
        throw new Error(`in-process transport: call() ${state === "new" ? "before open()" : "after close()"}`);
      }
      const delivered = throughJson(request, "message") as ProtocolRequest;
      // Called inside an async function, so that a handler which throws at once rejects like one that throws later.
      const reply = await withTimeout((async () => handler(delivered))(), request.method, timeoutMs);
      return throughJson(reply, "reply") as ProtocolResponse;
    },
    close: async () => {
      state = "closed";
    },
  };
}
