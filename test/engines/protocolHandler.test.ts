import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../src/contract/case.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult, resultInvariantProblems } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { createProtocolHandler } from "../../src/engines/protocolHandler.ts";
import type { EngineImplementation } from "../../src/engines/protocolHandler.ts";
import { ALL_FEATURES_CASE, DESCRIPTOR_FULL, REQUEST_WITH_OPTIONS, edited } from "../contract/corpus.ts";
import { CASE, HELLO, runMessage } from "./support.ts";

const STAMP = engineStamp(DESCRIPTOR_FULL.identity);

/** An engine that answers every request with `data`, and notes what it was asked. */
function engineWith(run: EngineImplementation["run"]): EngineImplementation {
  return { descriptor: DESCRIPTOR_FULL, run };
}

function okEngine(seen: [QuantityRequest, OpticalCase][] = []): EngineImplementation {
  return engineWith((request, opticalCase) => {
    seen.push([request, opticalCase]);
    return makeResult(request, STAMP, { status: "ok", data: { answer: 42 } });
  });
}

/** The reply to a message, checked to be a valid protocol response that answers it. */
async function ask(engine: EngineImplementation, message: unknown): Promise<ProtocolResponse> {
  const reply = await createProtocolHandler(engine)(message as ProtocolRequest);
  assert.deepEqual(validateKind("protocol-response", reply), []);
  assert.equal(reply.contract, CONTRACT_VERSION);
  assert.equal(reply.id, (message as { id: string }).id);
  return reply;
}

/** The error of a reply that refused its message. */
async function refusal(engine: EngineImplementation, message: unknown): Promise<{ code: string; message: string }> {
  const reply = await ask(engine, message);
  assert.equal(reply.ok, false);
  return (reply as Extract<ProtocolResponse, { ok: false }>).error;
}

test("hello is answered with the descriptor and shutdown with an empty object; the engine is not run", async () => {
  const seen: [QuantityRequest, OpticalCase][] = [];
  const engine = okEngine(seen);
  assert.deepEqual(await ask(engine, HELLO), {
    contract: CONTRACT_VERSION,
    id: "1",
    ok: true,
    result: DESCRIPTOR_FULL,
  });
  assert.deepEqual(await ask(engine, { ...HELLO, id: "bye", method: "shutdown" }), {
    contract: CONTRACT_VERSION,
    id: "bye",
    ok: true,
    result: {},
  });
  assert.deepEqual(seen, []);
});

test("run hands the request and the case to the engine and answers with its result", async () => {
  const seen: [QuantityRequest, OpticalCase][] = [];
  const reply = await ask(okEngine(seen), runMessage(REQUEST_WITH_OPTIONS, "42"));
  assert.deepEqual(seen, [[REQUEST_WITH_OPTIONS, CASE]]);
  assert.deepEqual(reply, {
    contract: CONTRACT_VERSION,
    id: "42",
    ok: true,
    result: makeResult(REQUEST_WITH_OPTIONS, STAMP, { status: "ok", data: { answer: 42 } }),
  });
});

test("an engine may answer later, and may answer unsupported: both are results like any other", async () => {
  const unsupported = [{ code: "quantity", item: "rays.trace", message: "not here" }] as const;
  const engine = engineWith(async (request) => {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return makeResult(request, STAMP, { status: "unsupported", unsupported });
  });
  const reply = await ask(engine, runMessage(REQUEST_WITH_OPTIONS));
  assert.ok(reply.ok);
  assert.equal((reply.result as ResultEnvelope).status, "unsupported");
  assert.deepEqual((reply.result as ResultEnvelope).unsupported, unsupported);
});

test("an engine that throws is answered as a result of status error, not as a refusal", async () => {
  for (const [thrown, text] of [
    [new Error("division by zero"), "division by zero"],
    [new RangeError("out of range"), "out of range"],
    ["a bare string", "a bare string"],
  ] as const) {
    const engine = engineWith(() => {
      throw thrown;
    });
    const reply = await ask(engine, runMessage(REQUEST_WITH_OPTIONS));
    assert.ok(reply.ok);
    const result = reply.result as ResultEnvelope;
    assert.deepEqual(validateKind("result", result), []);
    assert.deepEqual(resultInvariantProblems(result), []);
    assert.deepEqual(result, {
      contract: CONTRACT_VERSION,
      kind: "result",
      requestId: REQUEST_WITH_OPTIONS.id,
      caseId: CASE.id,
      engine: STAMP,
      status: "error",
      error: { code: "engine-failure", message: text },
      diagnostics: { warnings: [], counts: {} },
    });
  }
  const rejecting = engineWith(() => Promise.reject(new Error("later")));
  const reply = await ask(rejecting, runMessage(REQUEST_WITH_OPTIONS));
  assert.ok(reply.ok);
  assert.deepEqual((reply.result as ResultEnvelope).error, { code: "engine-failure", message: "later" });
});

test("a run whose request or case is not valid is refused, naming which of the two and where", async () => {
  const seen: [QuantityRequest, OpticalCase][] = [];
  const engine = okEngine(seen);
  const message = runMessage(REQUEST_WITH_OPTIONS);
  const cases: [string, unknown, string][] = [
    ["/params/request/quantity", "rays", "params.request is not a valid request: /quantity [pattern] "],
    ["/params/request", null, "params.request is not a valid request: (root) [type] expected object, got null"],
    ["/params/case/system/stopIndex", "0", "params.case is not a valid optical-case: /system/stopIndex [type] "],
    ["/params/case", [], "params.case is not a valid optical-case: (root) [type] expected object, got array"],
    // Valid by the schema, and still not a case: the stop is not one of the surfaces.
    ["/params/case/system/stopIndex", 7, "params.case is not a valid optical-case: system.stopIndex is 7, "],
  ];
  for (const [pointer, replacement, start] of cases) {
    const error = await refusal(engine, edited(message, pointer, replacement));
    assert.equal(error.code, "bad-request", pointer);
    assert.ok(error.message.startsWith(start), `${pointer}: ${error.message}`);
  }
  assert.deepEqual(seen, []);
});

test("a case whose index table does not hash to its digest is refused: arrays are verified", async () => {
  const tampered = edited(
    runMessage(REQUEST_WITH_OPTIONS),
    "/params/case/conditions/indexAfterSurface/$nd/sha256",
    "0".repeat(64),
  );
  const error = await refusal(okEngine(), tampered);
  assert.equal(error.code, "bad-request");
  assert.match(
    error.message,
    /^params\.case is not a valid optical-case: conditions\.indexAfterSurface: .*sha256 mismatch/,
  );
});

test("a request about another case than the one sent with it is refused", async () => {
  const seen: [QuantityRequest, OpticalCase][] = [];
  const message = edited(runMessage(REQUEST_WITH_OPTIONS), "/params/case", ALL_FEATURES_CASE);
  assert.deepEqual(await refusal(okEngine(seen), message), {
    code: "bad-request",
    message: `params.request is about case ${CASE.id}, params.case is ${ALL_FEATURES_CASE.id}`,
  });
  assert.deepEqual(seen, []);
});

test("a run without params, and a method that does not exist, are refused", async () => {
  const engine = okEngine();
  assert.deepEqual(await refusal(engine, { contract: CONTRACT_VERSION, id: "5", method: "run" }), {
    code: "bad-request",
    message: "params is not an object",
  });
  assert.deepEqual(await refusal(engine, { contract: CONTRACT_VERSION, id: "5", method: "run", params: {} }), {
    code: "bad-request",
    message: "params.request is not a valid request: (root) [json] undefined is not JSON data",
  });
  assert.deepEqual(await refusal(engine, { ...HELLO, method: "ping" }), {
    code: "unknown-method",
    message: 'unknown method "ping"',
  });
  assert.deepEqual(await refusal(engine, { contract: CONTRACT_VERSION, id: "6", params: {} }), {
    code: "unknown-method",
    message: "unknown method undefined",
  });
});

test("the engine is asked once per run and keeps nothing the handler could confuse between runs", async () => {
  let runs = 0;
  const engine = engineWith((request) => {
    runs++;
    return makeResult(request, STAMP, { status: "ok", data: { run: runs } });
  });
  const handler = createProtocolHandler(engine);
  const replies = await Promise.all(["a", "b", "c"].map((id) => handler(runMessage(REQUEST_WITH_OPTIONS, id))));
  assert.deepEqual(
    replies.map((reply) => reply.id),
    ["a", "b", "c"],
  );
  assert.equal(runs, 3);
});
