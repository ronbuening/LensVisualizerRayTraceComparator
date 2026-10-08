// The result store: answers engines have given, each kept under a key made of everything the answer depends on. A
// run that finds an answer there does not ask the engine again, which is all that resuming a run is.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { deepFreeze } from "../contract/json.ts";
import type { JsonObject } from "../contract/json.ts";
import { requestIdentity } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { resultInvariantProblems } from "../contract/result.ts";
import type { ResultEnvelope, ResultStatus } from "../contract/result.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { writeFileAtomic } from "./atomicFile.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";
import { hashCanonical } from "./numeric/hash.ts";

/** The directory below the runs directory that holds the store. No suite can be named after it. */
export const STORE_DIRECTORY = "store";

/** What an answer depends on, and so what its key is made of. */
export interface StoreKeyParts {
  /** The request's `id`: the case, the quantity and the spec. */
  readonly requestId: string;
  readonly engineId: string;
  /** The content hash of the engine's sources: a changed engine never finds the answers of the one it replaced. */
  readonly engineFingerprint: string;
  /** The options the request carries for this engine. Left out, they are no options: the same as `{}`. */
  readonly engineOptions?: JsonObject;
}

/**
 * The key of an answer: the SHA-256 of the canonical JSON of `{ requestId, engineId, engineFingerprint,
 * engineOptions }`. Equal parts give an equal key in any process and on any machine, and a change to any part,
 * the value of one engine option included, gives another.
 */
export function storeKey(parts: StoreKeyParts): string {
  const { requestId, engineId, engineFingerprint, engineOptions = {} } = parts;
  return hashCanonical({ requestId, engineId, engineFingerprint, engineOptions });
}

/** One answer as it is kept: the request, with the options the engine was given, and the engine's result. */
export interface StoreEntry {
  readonly request: QuantityRequest;
  readonly result: ResultEnvelope;
}

/** The statuses of the results that are kept. An "error" may not happen again, and a "pending" job has no answer. */
export const STORED_STATUSES: readonly ResultStatus[] = ["ok", "unsupported"];

/** Whether the store keeps a result: only an answer, which a result of status "ok" or "unsupported" is. */
export function isStorable(result: Pick<ResultEnvelope, "status">): boolean {
  return STORED_STATUSES.includes(result.status);
}

/** The key an entry belongs under, from its own request and the engine its result names. */
function keyOf(entry: StoreEntry): string {
  const { request, result } = entry;
  return storeKey({
    requestId: request.id,
    engineId: result.engine.id,
    engineFingerprint: result.engine.fingerprint,
    engineOptions: request.engineOptions,
  });
}

/** What became of looking a key up. A "corrupt" entry is there and is not an answer; `problem` says why. */
export type StoreLookup =
  | { readonly kind: "hit"; readonly entry: StoreEntry }
  | { readonly kind: "miss" }
  | { readonly kind: "corrupt"; readonly problem: string };

/** A content-keyed store of results in one directory. */
export interface ResultStore {
  /** The directory the entries are in, one file `<key>.json` each. */
  readonly directory: string;
  /**
   * The entry under `key`, frozen. A file that is there and cannot be trusted is "corrupt", with the reason, and
   * is to be treated as a miss: one that cannot be read or parsed, that is not a valid request with a valid
   * storable result answering it, whose request does not hash to its own id, or that belongs under another key.
   * Never throws for what is in the store; throws for a `key` that is not a store key.
   */
  get(key: string): StoreLookup;
  /** Whether `get(key)` is a hit. A corrupt entry is not had. */
  has(key: string): boolean;
  /**
   * Keeps `result` as the answer to `request` and returns its key, or keeps nothing and returns null when the
   * result is not storable (`isStorable`). The entry is canonical JSON and a newline, written so that the file is
   * whole or absent; one already under the key is replaced. Throws when the two are not a valid request and a
   * valid result that answers it, so that nothing is written that `get` would refuse.
   */
  put(request: QuantityRequest, result: ResultEnvelope): string | null;
}

const STORE_KEY = /^[0-9a-f]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Why a value is not an entry, or null when it is one. */
function entryProblem(value: unknown): string | null {
  if (!isRecord(value) || Object.keys(value).sort().join() !== "request,result") {
    return "it is not an object with a request and a result and nothing else";
  }
  const requestIssues = validateKind("request", value.request);
  if (requestIssues.length > 0) return `its request is not a valid request: ${formatIssues(requestIssues)}`;
  const request = value.request as QuantityRequest;
  const identity = requestIdentity(request);
  if (identity !== request.id) return `its request states the id ${request.id}, but its content hashes to ${identity}`;

  const resultIssues = validateKind("result", value.result);
  if (resultIssues.length > 0) return `its result is not a valid result: ${formatIssues(resultIssues)}`;
  const result = value.result as ResultEnvelope;
  const broken = resultInvariantProblems(result);
  if (broken.length > 0) return `its result breaks a status rule: ${broken.join("; ")}`;
  if (result.requestId !== request.id) return `its result answers request ${result.requestId}, not ${request.id}`;
  if (result.caseId !== request.caseId) return `its result is about case ${result.caseId}, not ${request.caseId}`;
  if (!isStorable(result)) return `its result has status "${result.status}", which is never stored`;
  return null;
}

/**
 * The store in `directory`, which is created when the first entry is written. It holds no state of its own: every
 * call reads or writes the directory, so two stores on one directory see each other's entries.
 */
export function createResultStore(directory: string): ResultStore {
  const fileOf = (key: string): string => {
    // A key becomes a file name, so anything else is refused before it reaches the file system.
    if (!STORE_KEY.test(key)) throw new Error(`result store: ${JSON.stringify(key)} is not a store key`);
    return join(directory, `${key}.json`);
  };
  const get = (key: string): StoreLookup => {
    const file = fileOf(key);
    const corrupt = (problem: string): StoreLookup => ({ kind: "corrupt", problem: `store entry ${key}: ${problem}` });
    let text: string;
    try {
      text = readFileSync(file, "utf8");
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code ?? "unknown error";
      return code === "ENOENT" ? { kind: "miss" } : corrupt(`it cannot be read (${code})`);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return corrupt(`it is malformed JSON (${error instanceof Error ? error.message : String(error)})`);
    }
    const problem = entryProblem(parsed);
    if (problem !== null) return corrupt(problem);
    const entry = parsed as StoreEntry;
    const belongs = keyOf(entry);
    if (belongs !== key) return corrupt(`it is the entry of key ${belongs}`);
    return { kind: "hit", entry: deepFreeze(entry) };
  };
  return {
    directory,
    get,
    has: (key) => get(key).kind === "hit",
    put: (request, result) => {
      if (!isStorable(result)) return null;
      const entry: StoreEntry = { request, result };
      const problem = entryProblem(entry);
      if (problem !== null) throw new Error(`result store: not an entry: ${problem}`);
      const key = keyOf(entry);
      writeFileAtomic(fileOf(key), `${canonicalJson(entry)}\n`);
      return key;
    },
  };
}
