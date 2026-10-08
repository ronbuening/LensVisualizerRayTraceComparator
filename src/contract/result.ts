// The result envelope: mirrors contract/schema/v1/result.schema.json, plus the status rules a schema cannot state.
import { deepFreeze } from "./json.ts";
import type { JsonObject } from "./json.ts";
import type { QuantityRequest } from "./request.ts";
import { assertKind } from "./schemas.ts";
import { CONTRACT_VERSION } from "./version.ts";

/** A machine-readable code with a message for people. */
export interface ErrorInfo {
  readonly code: string;
  readonly message: string;
}

/**
 * One thing an engine cannot do for a request: a case feature, the quantity, an option, the contract version, or
 * the kind of source the case came from, for an engine that answers only about cases of its own source.
 */
export interface UnsupportedItem {
  readonly code: "feature" | "quantity" | "option" | "contract" | "case-source";
  /**
   * What exactly: the feature flag, the quantity id, the option name, the contract version, or the kind of the
   * case's source (`provenance.source.kind`).
   */
  readonly item: string;
  readonly message: string;
}

/** Scalars an engine reports about itself, for people: version strings, build dates, switches. */
export interface EngineDetails {
  readonly [key: string]: string | number | boolean | null;
}

/**
 * How a request ended: `ok` with data; `unsupported`, a first-class answer and not a failure; `error`; or
 * `pending`, a job handed to an engine that answers later.
 */
export type ResultStatus = "ok" | "unsupported" | "error" | "pending";

/** An engine's answer to one request. */
export interface ResultEnvelope {
  readonly contract: string;
  readonly kind: "result";
  readonly requestId: string;
  readonly caseId: string;
  readonly engine: { readonly id: string; readonly fingerprint: string; readonly details: EngineDetails };
  readonly status: ResultStatus;
  readonly unsupported?: readonly UnsupportedItem[];
  readonly error?: ErrorInfo;
  /** How the engine computed the data: the algorithm's name and its parameters. */
  readonly method?: { readonly name: string; readonly params: JsonObject };
  /** The quantity's data. Its shape belongs to the quantity. */
  readonly data?: JsonObject;
  readonly diagnostics: { readonly warnings: readonly string[]; readonly counts: { readonly [key: string]: number } };
}

/**
 * The status rules of a result that its schema cannot state, as a list of what is broken (empty when nothing is):
 * `unsupported` needs a non-empty `unsupported` list, `error` needs `error`, and `ok` needs `data`. The result is
 * expected to be schema-valid.
 */
export function resultInvariantProblems(result: ResultEnvelope): string[] {
  const problems: string[] = [];
  if (result.status === "unsupported" && (result.unsupported === undefined || result.unsupported.length === 0)) {
    problems.push('status "unsupported" needs a non-empty unsupported list');
  }
  if (result.status === "error" && result.error === undefined) problems.push('status "error" needs error');
  if (result.status === "ok" && result.data === undefined) problems.push('status "ok" needs data');
  return problems;
}

/** What a result says beyond whose it is and what it answers. Without `diagnostics`: no warnings, no counts. */
export type ResultBody = Pick<ResultEnvelope, "status" | "unsupported" | "error" | "method" | "data"> &
  Partial<Pick<ResultEnvelope, "diagnostics">>;

/**
 * Builds the result of `request` as `engine` gives it, frozen at every depth; the parts are copied. Both ids are
 * echoed from the request, never computed, so the result answers exactly that request. Throws when a part is not
 * JSON data, when the result is not schema-valid and when it breaks a status rule.
 */
export function makeResult(
  request: Pick<QuantityRequest, "id" | "caseId">,
  engine: ResultEnvelope["engine"],
  body: ResultBody,
): ResultEnvelope {
  const { status, unsupported, error, method, data, diagnostics } = structuredClone(body);
  const result: ResultEnvelope = {
    contract: CONTRACT_VERSION,
    kind: "result",
    requestId: request.id,
    caseId: request.caseId,
    engine: structuredClone(engine),
    status,
    ...(unsupported === undefined ? {} : { unsupported }),
    ...(error === undefined ? {} : { error }),
    ...(method === undefined ? {} : { method }),
    ...(data === undefined ? {} : { data }),
    diagnostics: diagnostics ?? { warnings: [], counts: {} },
  };
  assertKind("result", result);
  const problems = resultInvariantProblems(result);
  if (problems.length > 0) throw new Error(`contract: not a valid result: ${problems.join("; ")}`);
  return deepFreeze(result);
}
