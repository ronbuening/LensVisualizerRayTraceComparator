// The result envelope: mirrors contract/schema/v1/result.schema.json, plus the status rules a schema cannot state.
import type { JsonObject } from "./json.ts";

/** A machine-readable code with a message for people. */
export interface ErrorInfo {
  readonly code: string;
  readonly message: string;
}

/** One thing an engine cannot do for a request: a case feature, the quantity, an option, or the contract version. */
export interface UnsupportedItem {
  readonly code: "feature" | "quantity" | "option" | "contract";
  /** What exactly: the feature flag, the quantity id, the option name or the contract version. */
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
