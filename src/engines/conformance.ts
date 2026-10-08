// The conformance kit: what any engine must do to be driven by the comparator, checked against the engine itself.
// It needs no optics: it asks for the conformance quantity `selftest.echo` and for a quantity that does not exist.
//
// The engine is reached as a run reaches it, through a `RemoteEngineAdapter` over its own transport, so what passes
// here is what a run relies on. Where the adapter sums a reply up, the kit reads the reply itself: a refusal and an
// engine's own failure are both results of status "error" to a run, and only one of them is `ok: false`. The
// examples of `selftest.echo` are the contract's own fixture files, whose answers are written out there: an engine
// is tested against the contract, never against another engine.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { OpticalCase } from "../contract/case.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import type { ProtocolResponse } from "../contract/protocol.ts";
import { SELFTEST_ECHO } from "../contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../contract/quantities/selftestEcho.ts";
import { makeRequest } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { ResultEnvelope } from "../contract/result.ts";
import { assertKind, formatIssues, validateKind } from "../contract/schemas.ts";
import { CONTRACT_MAJOR, CONTRACT_VERSION } from "../contract/version.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { selftestEchoQuantity } from "../quantities/selftestEcho.ts";
import type { StdioTransport } from "../transports/stdio.ts";
import type { Transport } from "../transports/transport.ts";
import { EngineUnavailableError } from "./adapter.ts";
import type { EngineUnavailableCode } from "./adapter.ts";
import { RUN_ERROR_CODES, RemoteEngineAdapter } from "./remote.ts";
import type { EngineTimeouts } from "./remote.ts";

/** How one check ended: `skipped` is a check that could not be made, or does not apply to this engine. */
export type ConformanceStatus = "pass" | "fail" | "skipped";

/** One check and how it ended. */
export interface ConformanceCheck {
  /** The check's name: one of `CONFORMANCE_CHECKS`, or `echo.<example>` for an example of `selftest.echo`. */
  readonly id: string;
  readonly status: ConformanceStatus;
  /** What was found, for people: why it failed, why it was skipped, or what passed. */
  readonly detail: string;
}

/** What the conformance kit found about one engine. */
export interface ConformanceReport {
  /** The id the engine is configured under. */
  readonly engine: string;
  /** Every check, in the order it was made. */
  readonly checks: readonly ConformanceCheck[];
  /** True exactly when no check failed. A skipped check does not fail an engine. */
  readonly passed: boolean;
}

/**
 * The checks, in order. Between `malformed-run` and `ids-echoed` come the examples of `selftest.echo`, one check
 * `echo.<name>` for each fixture `valid/quantities/selftest.echo.spec/<name>.json` of the contract.
 *
 * - `hello`: the engine can be reached and answers `hello` with a valid engine descriptor;
 * - `contract-range`: the range of contract versions in the descriptor holds this comparator's version;
 * - `engine-id`: the descriptor names the id the engine is configured under;
 * - `unknown-quantity`: a request for a quantity that does not exist is answered with status "unsupported", which
 *   is an answer and not an error;
 * - `malformed-run`: a `run` whose request is not a request is refused with `ok: false`, and not answered with a
 *   result, whatever the result says;
 * - `echo.<name>`: the example's answer, byte for byte in the array and equal in the sum. Together they cover a
 *   NaN with a payload, a signalling NaN, -0, both infinities, the smallest and largest subnormal, the largest
 *   double, an empty array, a 2-D array, and scaling and summing of finite numbers. Skipped when the engine does
 *   not offer `selftest.echo`;
 * - `ids-echoed`: every reply carried the id of its message, and every result the ids of its request and case;
 *   skipped when the engine gave no result at all;
 * - `deterministic`: one request sent twice gets equal results; skipped when the descriptor does not claim it;
 * - `shutdown`: `shutdown` is answered with an empty object, the engine is released without trouble, and a worker
 *   process ends by itself with exit code 0.
 */
export const CONFORMANCE_CHECKS = [
  "hello",
  "contract-range",
  "engine-id",
  "unknown-quantity",
  "malformed-run",
  "ids-echoed",
  "deterministic",
  "shutdown",
] as const;

/** A quantity id that is well formed and that no engine offers. */
export const UNKNOWN_QUANTITY = "conformance.no-such-quantity";

/** What the conformance kit is given. */
export interface ConformanceInput {
  /** The id the engine is configured under. */
  readonly id: string;
  /**
   * Builds the engine's transport, unopened. The kit opens it, uses it and closes it. A rejection is the finding
   * that the engine cannot be reached: `hello` fails with its message.
   */
  readonly createTransport: () => Transport | Promise<Transport>;
  /** Waits that differ from the adapter's defaults. */
  readonly timeouts?: Partial<EngineTimeouts>;
}

const FIXTURE_DIR = fileURLToPath(new URL(`../../contract/fixtures/v${CONTRACT_MAJOR}`, import.meta.url));

/** One example of `selftest.echo`: a spec and the data the contract says answers it. */
interface EchoExample {
  readonly name: string;
  readonly spec: SelftestEchoSpec;
  readonly data: SelftestEchoData;
}

/** The contract's examples of `selftest.echo`, sorted by name. Throws when a spec has no answer beside it. */
function echoExamples(): EchoExample[] {
  const directory = (part: "spec" | "data"): string =>
    join(FIXTURE_DIR, "valid", "quantities", `${SELFTEST_ECHO}.${part}`);
  const read = (part: "spec" | "data", file: string): unknown =>
    JSON.parse(readFileSync(join(directory(part), file), "utf8"));
  return readdirSync(directory("spec"))
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({
      name: file.slice(0, -".json".length),
      spec: read("spec", file) as SelftestEchoSpec,
      data: read("data", file) as SelftestEchoData,
    }));
}

/** The case every request of the kit is about: the contract's singlet fixture. No check depends on what it holds. */
function conformanceCase(): OpticalCase {
  const file = join(FIXTURE_DIR, "valid", "optical-case", "singlet.json");
  const opticalCase: unknown = JSON.parse(readFileSync(file, "utf8"));
  assertKind("optical-case", opticalCase);
  return opticalCase as OpticalCase;
}

/** One message the adapter sent, and the reply as the transport delivered it: undefined when none came. */
interface Exchange {
  readonly method: string;
  readonly reply: unknown;
}

/** `transport`, with every call and what came of it added to `exchanges`, in the order the calls ended. */
function watched(transport: Transport, exchanges: Exchange[]): Transport {
  return {
    kind: transport.kind,
    open: () => transport.open(),
    call: (request, options) => {
      const outcome = transport.call(request, options);
      outcome.then(
        (reply) => exchanges.push({ method: request.method, reply }),
        () => exchanges.push({ method: request.method, reply: undefined }),
      );
      return outcome;
    },
    close: () => transport.close(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** What is wrong with the reply `shutdown` got, or null when it is the empty object the protocol asks for. */
function shutdownFault(exchanges: readonly Exchange[]): string | null {
  const farewell = exchanges.findLast((exchange) => exchange.method === "shutdown");
  if (farewell?.reply === undefined) return "shutdown got no reply";
  const { reply } = farewell;
  const issues = validateKind("protocol-response", reply);
  if (issues.length > 0) return `the reply to shutdown is not a protocol response: ${formatIssues(issues)}`;
  const response = reply as ProtocolResponse;
  if (!response.ok) return `shutdown was refused (${response.error.code}): ${response.error.message}`;
  if (Object.keys(response.result).length > 0) return "shutdown was answered with something other than an empty object";
  return null;
}

/** The codes with which the adapter says that a reply did not carry the ids it had to. */
const ID_FAULTS: readonly string[] = ["invalid-response", "request-id-mismatch", "case-id-mismatch"];
const ADAPTER_CODES: readonly string[] = RUN_ERROR_CODES;

/** What a result that is not what a check wanted says, in a few words. */
function said(result: ResultEnvelope): string {
  if (result.error !== undefined) return `status ${result.status} (${result.error.code}): ${result.error.message}`;
  return `status ${result.status}`;
}

/** The outcome of comparing one answer with its example: null when they agree. */
function echoFault(result: ResultEnvelope, expected: SelftestEchoData): string | null {
  if (result.status !== "ok") return said(result);
  const issues = selftestEchoQuantity.validateData(result.data);
  if (issues.length > 0) return `the data is not ${SELFTEST_ECHO} data: ${formatIssues(issues)}`;
  const data = result.data as SelftestEchoData;
  const [got, want] = [data.values.$nd, expected.values.$nd];
  if (canonicalJson(got.shape) !== canonicalJson(want.shape)) {
    return `the values have shape [${got.shape.join(", ")}], expected [${want.shape.join(", ")}]`;
  }
  if (got.data !== want.data) return `the values are not the expected bytes: got ${got.data}, expected ${want.data}`;
  if (got.sha256 !== want.sha256) return `the digest of the values is ${got.sha256}, expected ${want.sha256}`;
  if (data.sum !== expected.sum) return `the sum is ${String(data.sum)}, expected ${String(expected.sum)}`;
  return null;
}

/**
 * Runs the conformance kit on one engine and reports every check as passed, failed or skipped, each with a reason.
 * It never rejects for anything the engine does: an engine that cannot be reached fails `hello` and has the other
 * checks skipped. The transport is closed before the report is returned, whatever happened.
 */
export async function runConformance(input: ConformanceInput): Promise<ConformanceReport> {
  const checks: ConformanceCheck[] = [];
  const record = (id: string, status: ConformanceStatus, detail: string): void => {
    checks.push({ id, status, detail });
  };
  const reasonOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));
  const finished = (): ConformanceReport => ({
    engine: input.id,
    checks,
    passed: checks.every((check) => check.status !== "fail"),
  });

  // ── hello ────────────────────────────────────────────────────────────────────────────────────────────────────
  let transport: Transport | undefined;
  let adapter: RemoteEngineAdapter | undefined;
  let descriptor: EngineDescriptor | undefined;
  let unavailable: { code: EngineUnavailableCode | null; message: string } | undefined;
  const exchanges: Exchange[] = [];
  try {
    transport = await input.createTransport();
    adapter = new RemoteEngineAdapter({
      id: input.id,
      transport: watched(transport, exchanges),
      timeouts: input.timeouts,
    });
    descriptor = await adapter.describe();
  } catch (error) {
    unavailable = { code: error instanceof EngineUnavailableError ? error.code : null, message: reasonOf(error) };
  }

  // The adapter checks the descriptor, then the contract range, then the id; its code says how far it came.
  const reached = unavailable === undefined ? "all" : unavailable.code;
  const message = unavailable?.message ?? "";
  if (reached !== "all" && reached !== "contract-mismatch" && reached !== "id-mismatch") {
    record("hello", "fail", message);
    record("contract-range", "skipped", "the engine gave no descriptor");
    record("engine-id", "skipped", "the engine gave no descriptor");
  } else {
    record("hello", "pass", "the engine answered hello with a valid engine descriptor");
    if (reached === "contract-mismatch") {
      record("contract-range", "fail", message);
      record("engine-id", "skipped", "the descriptor was not read further");
    } else {
      record("contract-range", "pass", `the engine speaks contract ${CONTRACT_VERSION}`);
      if (reached === "id-mismatch") record("engine-id", "fail", message);
      else record("engine-id", "pass", `the descriptor names ${input.id}`);
    }
  }

  if (adapter === undefined || descriptor === undefined) {
    const why = "the engine could not be used";
    for (const id of ["unknown-quantity", "malformed-run", "ids-echoed", "deterministic"]) record(id, "skipped", why);
    try {
      await (adapter ?? transport)?.close();
      record("shutdown", "skipped", why);
    } catch (error) {
      record("shutdown", "fail", `closing the engine failed: ${reasonOf(error)}`);
    }
    return finished();
  }

  // ── run ──────────────────────────────────────────────────────────────────────────────────────────────────────
  const opticalCase = conformanceCase();
  const engine = adapter;
  /** Every result the engine itself gave; the kit's own verdicts on a reply are not among them. */
  const results: ResultEnvelope[] = [];
  const ask = async (request: QuantityRequest): Promise<ResultEnvelope> => {
    const result = await engine.run(request, opticalCase);
    results.push(result);
    return result;
  };

  const unknown = makeRequest({ caseId: opticalCase.id, quantity: UNKNOWN_QUANTITY, spec: {} });
  const refused = await ask(unknown);
  if (refused.status === "unsupported") {
    record("unknown-quantity", "pass", `${UNKNOWN_QUANTITY} is answered "unsupported"`);
  } else {
    record("unknown-quantity", "fail", `${UNKNOWN_QUANTITY} is answered with ${said(refused)}`);
  }

  // A request without its spec is no request. The adapter reports an `ok: false` reply as "protocol-error", which
  // says that the refusal is a protocol response under the right id; an engine may give a result of its own that
  // code too, so the reply itself must say `ok: false`.
  const { spec: _spec, ...withoutSpec } = unknown;
  const malformed = await engine.run(withoutSpec as QuantityRequest, opticalCase);
  const answer = exchanges.at(-1)?.reply;
  if (malformed.error?.code === "protocol-error" && isRecord(answer) && answer.ok === false) {
    record("malformed-run", "pass", "a run whose request has no spec is refused with ok: false");
  } else {
    record("malformed-run", "fail", `a run whose request has no spec is answered with ${said(malformed)}`);
  }

  const offersEcho = Object.hasOwn(descriptor.capabilities.quantities, SELFTEST_ECHO);
  let repeatable = unknown;
  for (const example of echoExamples()) {
    const id = `echo.${example.name}`;
    if (!offersEcho) {
      record(id, "skipped", `the engine does not offer ${SELFTEST_ECHO}`);
      continue;
    }
    const request = makeRequest({ caseId: opticalCase.id, quantity: SELFTEST_ECHO, spec: example.spec });
    repeatable = request;
    const fault = echoFault(await ask(request), example.data);
    if (fault === null) record(id, "pass", "the answer is the contract's, byte for byte");
    else record(id, "fail", fault);
  }

  const idFaults = results.filter((result) => result.error !== undefined && ID_FAULTS.includes(result.error.code));
  // A result the adapter wrote in the engine's place says nothing about the ids the engine would have sent.
  const own = results.filter((result) => result.error === undefined || !ADAPTER_CODES.includes(result.error.code));
  if (idFaults.length > 0) record("ids-echoed", "fail", said(idFaults[0]));
  else if (own.length === 0) record("ids-echoed", "skipped", "the engine gave no result of its own to judge");
  else record("ids-echoed", "pass", `${own.length} results carried the ids of what they answer`);

  if (!descriptor.capabilities.deterministic) {
    record("deterministic", "skipped", "the descriptor does not say the engine is deterministic");
  } else {
    const [first, second] = [await ask(repeatable), await ask(repeatable)];
    if (first.status === "error" || second.status === "error") {
      record("deterministic", "fail", `a repeated request is answered with ${said(first.error ? first : second)}`);
    } else if (canonicalJson(first) !== canonicalJson(second)) {
      record("deterministic", "fail", `two answers to one ${repeatable.quantity} request differ`);
    } else {
      record("deterministic", "pass", `two answers to one ${repeatable.quantity} request are equal`);
    }
  }

  // ── shutdown ─────────────────────────────────────────────────────────────────────────────────────────────────
  try {
    await engine.close();
    const fault = shutdownFault(exchanges);
    const worker = transport as Partial<StdioTransport> | undefined;
    if (fault !== null) record("shutdown", "fail", fault);
    else if (typeof worker?.exitStatus !== "function") {
      record("shutdown", "pass", "the engine was released; its transport has no process to end");
    } else {
      const exit = worker.exitStatus();
      if (exit === null) record("shutdown", "fail", "the worker process is still running");
      else if (exit.forced) record("shutdown", "fail", "the worker did not end after shutdown and was killed");
      else if (exit.code !== 0) {
        const how = exit.signal === null ? `exit code ${exit.code}` : `signal ${exit.signal}`;
        record("shutdown", "fail", `the worker ended with ${how} after shutdown`);
      } else record("shutdown", "pass", "the worker ended by itself with exit code 0");
    }
  } catch (error) {
    record("shutdown", "fail", `closing the engine failed: ${reasonOf(error)}`);
  }
  return finished();
}
