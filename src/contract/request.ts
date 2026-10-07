// The quantity request: mirrors contract/schema/v1/request.schema.json.
import { hashCanonical } from "../core/numeric/hash.ts";
import { deepFreeze } from "./json.ts";
import type { JsonObject } from "./json.ts";
import { assertKind } from "./schemas.ts";
import { CONTRACT_VERSION } from "./version.ts";

/** One quantity asked of an engine for one optical case. */
export interface QuantityRequest {
  readonly contract: string;
  readonly kind: "request";
  /** SHA-256 of the canonical JSON of `{ caseId, quantity, spec }`. */
  readonly id: string;
  readonly caseId: string;
  /** A dotted quantity id, such as `rays.trace`. */
  readonly quantity: string;
  /** What to compute. Its shape belongs to the quantity. */
  readonly spec: JsonObject;
  /** Options for the engine the request is sent to. Not part of `id`. */
  readonly engineOptions?: JsonObject;
}

/** What a request is made from. */
export type QuantityRequestParts = Pick<QuantityRequest, "caseId" | "quantity" | "spec" | "engineOptions">;

/**
 * Builds a request with its `id`, frozen at every depth; the parts are copied. Equal `caseId`, `quantity` and
 * `spec` give an equal `id` whatever the key order of `spec`, and `engineOptions` never changes it, so one request
 * sent to several engines keeps one id. Throws when a part is not JSON data or the request is not schema-valid.
 */
export function makeRequest(parts: QuantityRequestParts): QuantityRequest {
  const { caseId, quantity, spec, engineOptions } = structuredClone(parts);
  const request: QuantityRequest = {
    contract: CONTRACT_VERSION,
    kind: "request",
    id: hashCanonical({ caseId, quantity, spec }),
    caseId,
    quantity,
    spec,
    ...(engineOptions === undefined ? {} : { engineOptions }),
  };
  assertKind("request", request);
  return deepFreeze(request);
}
