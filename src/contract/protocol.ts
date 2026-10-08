// The protocol envelopes: mirror contract/schema/v1/protocol-request.schema.json and protocol-response.schema.json.
//
// The protocol is stateless. `hello` returns the engine's descriptor, `run` carries the request together with its
// optical case and returns a result envelope, and `shutdown` returns an empty object. The same messages travel
// over every transport.
import type { OpticalCase } from "./case.ts";
import type { EngineDescriptor } from "./engine.ts";
import type { QuantityRequest } from "./request.ts";
import type { ErrorInfo, ResultEnvelope } from "./result.ts";

/** An object with no members: the `params` of `hello` and `shutdown`, and the `result` of `shutdown`. */
export type Empty = Readonly<Record<string, never>>;

/** What `run` carries: the request and the whole case it is about. */
export interface RunParams {
  readonly request: QuantityRequest;
  readonly case: OpticalCase;
}

/** A message to an engine. `id` ties the response to it. */
export type ProtocolRequest =
  | { readonly contract: string; readonly id: string; readonly method: "hello" | "shutdown"; readonly params: Empty }
  | { readonly contract: string; readonly id: string; readonly method: "run"; readonly params: RunParams };

/**
 * An engine's reply to the request with the same `id`. `ok: false` means the message could not be handled at all;
 * an engine that handled a `run` and failed answers `ok: true` with a result of status `error`.
 */
export type ProtocolResponse =
  | {
      readonly contract: string;
      readonly id: string;
      readonly ok: true;
      readonly result: EngineDescriptor | ResultEnvelope | Empty;
    }
  | { readonly contract: string; readonly id: string; readonly ok: false; readonly error: ErrorInfo };

/**
 * Whatever answers protocol messages: an engine as a transport sees it. A handler that cannot handle a message
 * answers `ok: false`; one that throws or rejects has crashed, as a worker process that died has.
 */
export type ProtocolHandler = (request: ProtocolRequest) => ProtocolResponse | Promise<ProtocolResponse>;
