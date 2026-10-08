// The transport: how protocol messages reach an engine and how its replies come back. Every transport carries the
// same messages (contract/CONTRACT.md, "protocol-request and protocol-response"), so an engine adapter is written
// once and works over all of them.
import type { ProtocolRequest, ProtocolResponse } from "../contract/protocol.ts";

/** Every way a message can travel. A kind is listed here before a stage implements it. */
export const TRANSPORT_KINDS = ["in-process", "stdio", "oneshot", "file-exchange", "http"] as const;
/** One way a message can travel. */
export type TransportKind = (typeof TRANSPORT_KINDS)[number];

/** What a caller decides about one `call`. */
export interface TransportCallOptions {
  /** How long to wait for the reply, in milliseconds, before the call fails with a `TransportTimeoutError`. */
  readonly timeoutMs: number;
}

/**
 * A channel to one engine. It delivers messages and returns replies and judges neither: a reply is whatever the
 * engine sent, parsed from JSON, and it is the caller that validates it.
 */
export interface Transport {
  readonly kind: TransportKind;
  /** Makes the engine reachable: starts its process, opens its connection. Rejects when it cannot. */
  open(): Promise<void>;
  /**
   * Sends one message and resolves to the reply that answers it. Rejects with a `TransportTimeoutError` when no
   * reply came in time, and with any other error when the message could not be delivered or the engine is gone.
   */
  call(request: ProtocolRequest, options: TransportCallOptions): Promise<ProtocolResponse>;
  /** Releases the engine. Safe to call more than once, and on a transport that was never opened. */
  close(): Promise<void>;
}

/** The longest delay a timer takes; a longer one would fire at once. */
export const MAX_TIMER_MS = 2 ** 31 - 1;

/** No reply came within the time the caller allowed. The engine may still be working on the message. */
export class TransportTimeoutError extends Error {
  /** The time that was allowed, in milliseconds. */
  readonly timeoutMs: number;

  constructor(method: string, timeoutMs: number) {
    super(`no reply to ${method} within ${timeoutMs} ms`);
    this.name = "TransportTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}
