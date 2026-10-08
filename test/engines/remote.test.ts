import assert from "node:assert/strict";
import { test } from "node:test";

import { engineStamp } from "../../src/contract/engine.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import type { ProtocolHandler, ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { resultInvariantProblems } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { ENGINE_UNAVAILABLE_CODES, EngineUnavailableError } from "../../src/engines/adapter.ts";
import type { EngineAdapter, EngineUnavailableCode } from "../../src/engines/adapter.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { FAIL_MODES, parseFakeOptions } from "../../src/engines/fake/options.ts";
import type { FailMode } from "../../src/engines/fake/options.ts";
import { DEFAULT_ENGINE_TIMEOUTS, RUN_ERROR_CODES, RemoteEngineAdapter } from "../../src/engines/remote.ts";
import type { EngineTimeouts, RunErrorCode } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { TransportTimeoutError } from "../../src/transports/transport.ts";
import type { Transport } from "../../src/transports/transport.ts";
import {
  ALL_FEATURES_CASE,
  REQUEST_MINIMAL,
  SELFTEST_ECHO_EXAMPLES,
  edited,
  f8FromBits,
  REMOVE,
} from "../contract/corpus.ts";
import { CASE, bending, bitsOf, echoRequest, echoRequestFor, echoedValues, recording } from "./support.ts";

const REQUEST = echoRequest(Float64Array.of(1, 2, 3), 2);

/** An adapter configured as `id` over an in-process transport around a handler. */
function adapterOver(
  handler: ProtocolHandler,
  id: string = "fake",
  timeouts?: Partial<EngineTimeouts>,
): RemoteEngineAdapter {
  return new RemoteEngineAdapter({ id, transport: createInProcessTransport(handler), timeouts });
}

/** An adapter over a fake engine with these options, and every message the fake was sent. */
function overFake(options: Record<string, unknown> = {}): {
  adapter: RemoteEngineAdapter;
  messages: ProtocolRequest[];
} {
  const { handler, messages } = recording(createEngine({ id: "fake", ...options }));
  return { adapter: adapterOver(handler), messages };
}

/** The error a promise rejects with, which must be an `EngineUnavailableError` with this code. */
async function unavailable(promise: Promise<unknown>, code: EngineUnavailableCode): Promise<EngineUnavailableError> {
  const error = await promise.then(
    () => assert.fail(`resolved; expected the engine to be unavailable (${code})`),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof EngineUnavailableError, String(error));
  assert.equal(error.code, code, error.message);
  return error;
}

/**
 * A result the adapter wrote in the engine's place: a valid result of status "error" with this code, which echoes
 * the request and carries the descriptor's engine stamp. Returns its message.
 */
function assertFailure(
  result: ResultEnvelope,
  code: RunErrorCode,
  descriptor: EngineDescriptor,
  request: QuantityRequest = REQUEST,
): string {
  assert.deepEqual(validateKind("result", result), []);
  assert.deepEqual(resultInvariantProblems(result), []);
  assert.ok(result.error !== undefined, `status ${result.status}`);
  assert.deepEqual(result, {
    contract: CONTRACT_VERSION,
    kind: "result",
    requestId: request.id,
    caseId: CASE.id,
    engine: engineStamp(descriptor.identity),
    status: "error",
    error: { code, message: result.error.message },
    diagnostics: { warnings: [], counts: {} },
  });
  assert.ok(Object.isFrozen(result) && Object.isFrozen(result.error));
  return result.error.message;
}

/** A transport that is not an engine at all: every call is whatever `call` does. */
function transportThat(call: Transport["call"], overrides: Partial<Transport> = {}): Transport {
  return { kind: "stdio", open: async () => {}, call, close: async () => {}, ...overrides };
}

// ── describe ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("describe sends hello and returns the engine's descriptor, frozen", async () => {
  const { adapter, messages } = overFake({ bias: 0.5 });
  assert.equal(adapter.id, "fake");
  assert.deepEqual(messages, []);

  const descriptor = await adapter.describe();
  assert.deepEqual(messages, [{ contract: CONTRACT_VERSION, id: "1", method: "hello", params: {} }]);
  assert.deepEqual(validateKind("protocol-request", messages[0]), []);
  assert.deepEqual(validateKind("engine-descriptor", descriptor), []);
  assert.equal(descriptor.identity.id, "fake");
  assert.equal(descriptor.identity.fingerprint, parseFakeOptions({ id: "fake", bias: 0.5 }).fingerprint);
  assert.ok(Object.isFrozen(descriptor) && Object.isFrozen(descriptor.identity));
  assert.ok(Object.isFrozen(descriptor.capabilities.features.supported));
});

test("the engine is asked who it is once: later calls, also at the same time, get the same descriptor", async () => {
  const { adapter, messages } = overFake();
  const [first, second] = await Promise.all([adapter.describe(), adapter.describe()]);
  assert.equal(second, first);
  assert.equal(await adapter.describe(), first);
  await adapter.run(REQUEST, CASE);
  assert.equal(await adapter.describe(), first);
  assert.deepEqual(
    messages.map(({ method }) => method),
    ["hello", "run"],
  );
});

test("the adapter is an EngineAdapter, and its waits default to generous ones", () => {
  const adapter: EngineAdapter = overFake().adapter;
  assert.equal(typeof adapter.describe, "function");
  assert.deepEqual(DEFAULT_ENGINE_TIMEOUTS, { helloMs: 30_000, runMs: 600_000, shutdownMs: 5_000 });
});

// ── run: the engine behaves ──────────────────────────────────────────────────────────────────────────────────────

test("run sends the request with its whole case and returns the engine's result, frozen", async () => {
  const { adapter, messages } = overFake();
  const result = await adapter.run(REQUEST, CASE);

  assert.deepEqual(
    messages.map(({ id, method }) => [id, method]),
    [
      ["1", "hello"],
      ["2", "run"],
    ],
  );
  assert.deepEqual(messages[1], {
    contract: CONTRACT_VERSION,
    id: "2",
    method: "run",
    params: { request: REQUEST, case: CASE },
  });
  assert.deepEqual(validateKind("protocol-request", messages[1]), []);

  const descriptor = await adapter.describe();
  assert.deepEqual(validateKind("result", result), []);
  assert.equal(result.status, "ok");
  assert.equal(result.requestId, REQUEST.id);
  assert.equal(result.caseId, CASE.id);
  assert.deepEqual(result.engine, engineStamp(descriptor.identity));
  assert.deepEqual([...echoedValues(result)], [2, 4, 6]);
  assert.equal(result.data?.sum, 12);
  assert.ok(Object.isFrozen(result) && Object.isFrozen(result.data) && Object.isFrozen(result.diagnostics.counts));
});

test("an array crosses the adapter and the transport bit for bit: NaN payloads, -0, a subnormal", async () => {
  const values = f8FromBits(
    0x7ff8_0000_dead_beefn, // a NaN with a payload
    0x7ff0_0000_0000_0001n, // a signalling NaN
    0xfff8_0000_0000_0000n, // a NaN with its sign set
    0x8000_0000_0000_0000n, // -0
    0x0000_0000_0000_0001n, // the smallest subnormal
    0x000f_ffff_ffff_ffffn, // the largest subnormal
    0x7ff0_0000_0000_0000n, // +infinity
    0xfff0_0000_0000_0000n, // -infinity
    0x3ff0_0000_0000_0001n, // the number after 1
  );
  const { adapter } = overFake();
  const result = await adapter.run(echoRequest(values, 1), CASE);
  assert.equal(result.status, "ok");
  assert.deepEqual(bitsOf(echoedValues(result)), bitsOf(values));
  assert.equal(result.data?.sum, null);
});

test("every conformance example comes back through the adapter as the contract states it", async () => {
  const { adapter } = overFake();
  for (const [name, { spec, data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    const result = await adapter.run(echoRequestFor(spec), CASE);
    assert.equal(result.status, "ok", name);
    assert.deepEqual(result.data, data, name);
  }
});

test("unsupported is an answer, not a failure: it comes back as the engine gave it", async () => {
  const { adapter } = overFake({ offersQuantities: false });
  const result = await adapter.run(REQUEST, CASE);
  assert.equal(result.status, "unsupported");
  assert.equal(Object.hasOwn(result, "error"), false);
  assert.deepEqual(result.unsupported, [
    { code: "quantity", item: "selftest.echo", message: "the fake engine does not offer selftest.echo" },
  ]);

  const other = await overFake().adapter.run(REQUEST_MINIMAL, CASE);
  assert.deepEqual(
    other.unsupported?.map(({ code, item }) => [code, item]),
    [["quantity", "system.describe"]],
  );
});

test("an engine's own failure keeps the code the engine chose", async () => {
  const { adapter } = overFake();
  const request = makeRequest({ caseId: CASE.id, quantity: "selftest.echo", spec: { values: [1, 2] } });
  const result = await adapter.run(request, CASE);
  assert.equal(result.status, "error");
  assert.equal(result.error?.code, "bad-spec");
  assert.ok(!(RUN_ERROR_CODES as readonly string[]).includes("bad-spec"));
});

test("messages are numbered in the order they are sent, and runs may overlap", async () => {
  const { adapter, messages } = overFake();
  const requests = [1, 2, 3].map((scale) => echoRequest(Float64Array.of(1, 1), scale));
  const results = await Promise.all(requests.map((request) => adapter.run(request, CASE)));
  assert.deepEqual(
    results.map((result) => result.data?.sum),
    [2, 4, 6],
  );
  assert.deepEqual(
    results.map((result) => result.requestId),
    requests.map((request) => request.id),
  );
  assert.deepEqual(
    messages.map(({ id }) => id),
    ["1", "2", "3", "4"],
  );
});

test("a request about another case than the one given is the caller's mistake, and nothing is sent", async () => {
  const { adapter, messages } = overFake();
  await assert.rejects(adapter.run(REQUEST, ALL_FEATURES_CASE), {
    message: `engine fake: request ${REQUEST.id} is about case ${CASE.id}, not ${ALL_FEATURES_CASE.id}`,
  });
  assert.deepEqual(messages, []);
});

// ── run: the engine misbehaves ───────────────────────────────────────────────────────────────────────────────────

test("every failMode of the fake engine becomes a result with its own code, and none makes run reject", async () => {
  const expected: Record<FailMode, [RunErrorCode | null, RegExp]> = {
    none: [null, /^$/],
    "protocol-error": [
      "protocol-error",
      /^the engine refused the message \(fake-failure\): the fake engine is set to fail \(failMode protocol-error\)$/,
    ],
    "invalid-result": [
      "invalid-result",
      /^the reply is not a result: \(root\) \[required\] missing property "diagnostics"$/,
    ],
    "wrong-request-id": ["request-id-mismatch", /^the result answers request [0-9a-f]{64}, not [0-9a-f]{64}$/],
    throw: ["transport-error", /^the transport failed: the fake engine is set to fail \(failMode throw\)$/],
  };
  assert.deepEqual(Object.keys(expected).sort(), [...FAIL_MODES].sort());

  for (const failMode of FAIL_MODES) {
    const [code, message] = expected[failMode];
    const { adapter, messages } = overFake({ failMode });
    const descriptor = await adapter.describe();
    const result = await adapter.run(REQUEST, CASE);
    if (code === null) {
      assert.equal(result.status, "ok", failMode);
    } else {
      assert.match(assertFailure(result, code, descriptor), message, failMode);
    }
    // The adapter is not spoiled by it: the engine can still be described and asked again.
    assert.equal(await adapter.describe(), descriptor, failMode);
    assert.equal((await adapter.run(REQUEST, CASE)).status, code === null ? "ok" : "error", failMode);
    await adapter.close();
    assert.deepEqual(
      messages.map(({ method }) => method),
      ["hello", "run", "run", "shutdown"],
      failMode,
    );
  }
});

test("the request-id mismatch names both ids", async () => {
  const { adapter } = overFake({ failMode: "wrong-request-id" });
  const result = await adapter.run(REQUEST, CASE);
  assert.equal(result.error?.message, `the result answers request ${sha256Hex(REQUEST.id)}, not ${REQUEST.id}`);
  assert.equal(result.requestId, REQUEST.id);
});

test("a result that does not belong to the request, the case or the engine becomes an error that says so", async () => {
  const fake = createEngine({ id: "fake" });
  const fingerprint = parseFakeOptions({ id: "fake" }).fingerprint;
  const otherCase = ALL_FEATURES_CASE.id;
  const cases: [string, unknown, RunErrorCode, string][] = [
    ["/caseId", otherCase, "case-id-mismatch", `the result is about case ${otherCase}, not ${CASE.id}`],
    ["/engine/id", "other", "engine-id-mismatch", "the result is from engine other, not fake"],
    [
      "/engine/fingerprint",
      "rebuilt",
      "fingerprint-mismatch",
      `the result carries fingerprint rebuilt, the descriptor ${fingerprint}`,
    ],
    // Schema-valid, and still not a result: an ok without data, an error without an error.
    ["/data", REMOVE, "invalid-result", 'the result breaks a status rule: status "ok" needs data'],
    ["/status", "error", "invalid-result", 'the result breaks a status rule: status "error" needs error'],
    [
      "/status",
      "unsupported",
      "invalid-result",
      'the result breaks a status rule: status "unsupported" needs a non-empty unsupported list',
    ],
    [
      "/status",
      "done",
      "invalid-result",
      'the reply is not a result: /status [enum] must be one of ["ok","unsupported","error","pending"]',
    ],
    [
      "/elapsedMs",
      12,
      "invalid-result",
      "the reply is not a result: /elapsedMs [additionalProperties] unexpected property",
    ],
    [
      "/contract",
      "2.0",
      "invalid-result",
      "the reply is not a result: /contract [pattern] must match ^1\\.(0|[1-9][0-9]*)$",
    ],
  ];
  for (const [pointer, replacement, code, message] of cases) {
    const adapter = adapterOver(
      bending(fake, "run", (reply) => void (reply.result = edited(reply.result, pointer, replacement))),
    );
    const result = await adapter.run(REQUEST, CASE);
    assert.equal(assertFailure(result, code, await adapter.describe()), message, pointer);
  }
});

test("a pending result is passed on: a job to collect later is a valid answer", async () => {
  const handler = bending(createEngine({ id: "fake" }), "run", (reply) => {
    const result = reply.result as Record<string, unknown>;
    result.status = "pending";
    delete result.data;
    delete result.method;
  });
  const result = await adapterOver(handler).run(REQUEST, CASE);
  assert.equal(result.status, "pending");
  assert.deepEqual(validateKind("result", result), []);
});

test("a reply that is not a protocol response, or answers another message, is an invalid-response", async () => {
  const fake = createEngine({ id: "fake" });
  const cases: [(reply: Record<string, unknown>) => unknown, RegExp][] = [
    [(reply) => void (reply.id = "17"), /^the reply answers message "17", not message "2"$/],
    [(reply) => void delete reply.contract, /^the reply is not a protocol response: \(root\) \[oneOf\] /],
    [(reply) => void (reply.ok = "true"), /^the reply is not a protocol response: \(root\) \[oneOf\] /],
    [(reply) => void delete reply.result, /^the reply is not a protocol response: \(root\) \[oneOf\] /],
    [(reply) => void (reply.error = { code: "x", message: "" }), /^the reply is not a protocol response: /],
    [(reply) => void (reply.contract = "2.0"), /^the reply is not a protocol response: /],
    [() => [], /^the reply is not a protocol response: /],
    [() => "ok", /^the reply is not a protocol response: /],
    [() => null, /^the reply is not a protocol response: /],
    [(reply) => ({ ...reply, ok: false }), /^the reply is not a protocol response: /],
  ];
  for (const [change, message] of cases) {
    const adapter = adapterOver(bending(fake, "run", change));
    const result = await adapter.run(REQUEST, CASE);
    assert.match(assertFailure(result, "invalid-response", await adapter.describe()), message);
  }
});

test("a result that is not an object at all is an invalid-result, not an invalid-response", async () => {
  for (const [replacement, got] of [
    [null, "null"],
    ["ok", "string"],
    [[], "array"],
    [42, "number"],
  ] as const) {
    const adapter = adapterOver(
      bending(createEngine({ id: "fake" }), "run", (reply) => void (reply.result = replacement)),
    );
    const result = await adapter.run(REQUEST, CASE);
    const message = assertFailure(result, "invalid-result", await adapter.describe());
    assert.equal(message, `the reply is not a result: (root) [type] expected object, got ${got}`);
  }
  // The engine's descriptor is not a result either, though it is something a response may carry.
  const fake = createEngine({ id: "fake" });
  const hello = await fake({ contract: CONTRACT_VERSION, id: "0", method: "hello", params: {} });
  const adapter = adapterOver(
    bending(fake, "run", (reply) => void (reply.result = (hello as { result: unknown }).result)),
  );
  assert.match(
    assertFailure(await adapter.run(REQUEST, CASE), "invalid-result", await adapter.describe()),
    /^the reply is not a result: /,
  );
});

// ── run: the transport fails ─────────────────────────────────────────────────────────────────────────────────────

test("an engine that does not answer a run in time is a transport-timeout; later runs are still tried", async () => {
  const fake = createEngine({ id: "fake" });
  let stall = true;
  const handler: ProtocolHandler = (message) =>
    message.method === "run" && stall ? new Promise<ProtocolResponse>(() => {}) : fake(message);
  const adapter = adapterOver(handler, "fake", { runMs: 15 });
  const descriptor = await adapter.describe();

  const result = await adapter.run(REQUEST, CASE);
  assert.equal(assertFailure(result, "transport-timeout", descriptor), "no reply to run within 15 ms");

  stall = false;
  assert.equal((await adapter.run(REQUEST, CASE)).status, "ok");
});

test("a transport that throws on a run, or times out its own way, is converted too", async () => {
  const fake = createEngine({ id: "fake" });
  const hello = async (message: ProtocolRequest): Promise<ProtocolResponse | undefined> =>
    message.method === "run" ? undefined : fake(message);

  const broken = transportThat(async (message) => {
    const reply = await hello(message);
    if (reply === undefined) throw new Error("write EPIPE");
    return reply;
  });
  const overBroken = new RemoteEngineAdapter({ id: "fake", transport: broken });
  assert.equal(
    assertFailure(await overBroken.run(REQUEST, CASE), "transport-error", await overBroken.describe()),
    "the transport failed: write EPIPE",
  );

  const waits: number[] = [];
  const slow = transportThat(async (message, { timeoutMs }) => {
    const reply = await hello(message);
    waits.push(timeoutMs);
    if (reply === undefined) throw new TransportTimeoutError(message.method, timeoutMs);
    return reply;
  });
  const overSlow = new RemoteEngineAdapter({ id: "fake", transport: slow, timeouts: { helloMs: 11, runMs: 22 } });
  assert.equal(
    assertFailure(await overSlow.run(REQUEST, CASE), "transport-timeout", await overSlow.describe()),
    "no reply to run within 22 ms",
  );
  // Each message is given the wait of its own kind.
  await overSlow.close();
  assert.deepEqual(waits, [11, 22, DEFAULT_ENGINE_TIMEOUTS.shutdownMs]);

  const odd = transportThat(async (message) => {
    const reply = await hello(message);
    // Not an Error at all.
    if (reply === undefined) throw "the pipe closed";
    return reply;
  });
  const overOdd = new RemoteEngineAdapter({ id: "fake", transport: odd });
  assert.equal(
    assertFailure(await overOdd.run(REQUEST, CASE), "transport-error", await overOdd.describe()),
    "the transport failed: the pipe closed",
  );
});

test("a wait left undefined keeps its default: it is not a wait of no time", async () => {
  const fake = createEngine({ id: "fake" });
  const waits: number[] = [];
  const timed = transportThat(async (message, { timeoutMs }) => {
    waits.push(timeoutMs);
    return fake(message);
  });
  // An options object built from settings that may be absent states its members as undefined.
  const timeouts = { helloMs: undefined, runMs: 22, shutdownMs: undefined };
  const adapter = new RemoteEngineAdapter({ id: "fake", transport: timed, timeouts });
  assert.equal((await adapter.run(REQUEST, CASE)).status, "ok");
  await adapter.close();
  assert.deepEqual(waits, [DEFAULT_ENGINE_TIMEOUTS.helloMs, 22, DEFAULT_ENGINE_TIMEOUTS.shutdownMs]);

  // Over a real timer: an engine that takes a while to say hello is waited for, not timed out at once.
  const unhurried: ProtocolHandler = async (message) => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return fake(message);
  };
  const waiting = adapterOver(unhurried, "fake", { helloMs: undefined, runMs: undefined });
  assert.equal((await waiting.run(REQUEST, CASE)).status, "ok");
  await waiting.close();
});

test("a wait that is not a time above 0 is refused when the adapter is made, naming the wait", () => {
  const fake = createEngine({ id: "fake" });
  for (const name of ["helloMs", "runMs", "shutdownMs"] as const) {
    for (const wait of [0, -1, NaN, -Infinity, "30" as unknown as number, null as unknown as number]) {
      assert.throws(
        () => adapterOver(fake, "fake", { [name]: wait }),
        { message: `engine fake: timeouts.${name} must be a number of milliseconds above 0, got ${String(wait)}` },
        `${name} ${String(wait)}`,
      );
    }
  }
  // Any time above 0 is a wait, however short or long.
  adapterOver(fake, "fake", { helloMs: 0.5, runMs: Infinity, shutdownMs: 1 });
});

// ── describe: the engine is not usable ───────────────────────────────────────────────────────────────────────────

test("an EngineUnavailableError names the engine and carries a code, a message and its cause", () => {
  const cause = new Error("ENOENT");
  const error = new EngineUnavailableError("optiland", "spawn-failed", "python3 did not start", { cause });
  assert.ok(error instanceof Error);
  assert.equal(error.name, "EngineUnavailableError");
  assert.equal(error.engineId, "optiland");
  assert.equal(error.code, "spawn-failed");
  assert.equal(error.message, "engine optiland is unavailable (spawn-failed): python3 did not start");
  assert.equal(error.cause, cause);
  assert.equal(new EngineUnavailableError("a", "not-configured", "x").cause, undefined);
  assert.equal(new Set(ENGINE_UNAVAILABLE_CODES).size, ENGINE_UNAVAILABLE_CODES.length);
  for (const code of ["not-configured", "spawn-failed", "contract-mismatch", "bad-descriptor"] as const) {
    assert.ok(ENGINE_UNAVAILABLE_CODES.includes(code), code);
  }
});

test("an engine that does not speak this contract version is unavailable: contract-mismatch", async () => {
  const ranges: [string, string][] = [
    ["2.0", "2.1"],
    ["1.1", "1.3"],
    ["0.1", "0.9"],
    // A range that holds nothing.
    ["1.2", "1.0"],
  ];
  for (const [min, max] of ranges) {
    const handler = bending(createEngine({ id: "fake" }), "hello", (reply) => {
      (reply.result as { contract: unknown }).contract = { min, max };
    });
    const error = await unavailable(adapterOver(handler).describe(), "contract-mismatch");
    const detail = `it speaks contract ${min} to ${max}, the comparator ${CONTRACT_VERSION}`;
    assert.equal(error.message, `engine fake is unavailable (contract-mismatch): ${detail}`);
  }
  // A range that holds this version, however wide, is fine.
  for (const [min, max] of [
    ["1.0", "1.9"],
    ["0.5", "1.0"],
    ["0.1", "3.0"],
  ]) {
    const handler = bending(createEngine({ id: "fake" }), "hello", (reply) => {
      (reply.result as { contract: unknown }).contract = { min, max };
    });
    assert.deepEqual((await adapterOver(handler).describe()).contract, { min, max });
  }
});

test("an engine that says it is another engine than the one configured is unavailable: id-mismatch", async () => {
  const error = await unavailable(adapterOver(createEngine({ id: "fake-b" }), "fake-a").describe(), "id-mismatch");
  assert.equal(error.engineId, "fake-a");
  assert.equal(error.message, "engine fake-a is unavailable (id-mismatch): its descriptor says it is engine fake-b");
});

test("a reply to hello that is not an engine descriptor is unavailable: bad-descriptor", async () => {
  const cases: [(descriptor: Record<string, Record<string, unknown>>) => unknown, string][] = [
    [(descriptor) => void delete descriptor.capabilities, '(root) [required] missing property "capabilities"'],
    [(descriptor) => void (descriptor.identity.id = "Fake"), "/identity/id [pattern] must match ^[a-z][a-z0-9-]*$"],
    [
      (descriptor) => void (descriptor.identity.fingerprint = ""),
      "/identity/fingerprint [minLength] must be at least 1 character(s) long",
    ],
    [
      (descriptor) => void (descriptor.contract.max = "1.x"),
      "/contract/max [pattern] must match ^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)$",
    ],
    [
      (descriptor) => void (descriptor.capabilities.maxConcurrency = 0),
      "/capabilities/maxConcurrency [minimum] must be at least 1",
    ],
    [
      (descriptor) => void (descriptor.capabilities.threads = 4),
      "/capabilities/threads [additionalProperties] unexpected property",
    ],
    [
      () => ({}),
      ["contract", "identity", "capabilities"].map((name) => `(root) [required] missing property "${name}"`).join("; "),
    ],
    [() => "fake", "(root) [type] expected object, got string"],
  ];
  for (const [change, issue] of cases) {
    const handler = bending(createEngine({ id: "fake" }), "hello", (reply) => {
      const replaced = change(reply.result as Record<string, Record<string, unknown>>);
      if (replaced !== undefined) reply.result = replaced;
    });
    const error = await unavailable(adapterOver(handler).describe(), "bad-descriptor");
    assert.equal(
      error.message,
      `engine fake is unavailable (bad-descriptor): the reply to hello is not an engine descriptor: ${issue}`,
    );
  }
  // A result is not a descriptor, though both are things a response may carry.
  const fake = createEngine({ id: "fake" });
  const run = await fake({
    contract: CONTRACT_VERSION,
    id: "0",
    method: "run",
    params: { request: REQUEST, case: CASE },
  });
  const swapped = bending(fake, "hello", (reply) => void (reply.result = (run as { result: unknown }).result));
  await unavailable(adapterOver(swapped).describe(), "bad-descriptor");
});

test("hello that gets no usable reply is unavailable: hello-failed", async () => {
  const fake = createEngine({ id: "fake" });
  const never: ProtocolHandler = () => new Promise<ProtocolResponse>(() => {});
  const cases: [ProtocolHandler, string][] = [
    [never, "no reply to hello within 15 ms"],
    [
      () => {
        throw new Error("the worker died");
      },
      "the transport failed: the worker died",
    ],
    [
      (message) => ({
        contract: CONTRACT_VERSION,
        id: message.id,
        ok: false,
        error: { code: "not-ready", message: "warming up" },
      }),
      "the engine refused hello (not-ready): warming up",
    ],
    [bending(fake, "hello", (reply) => void (reply.id = "99")), 'the reply answers message "99", not message "1"'],
  ];
  for (const [handler, detail] of cases) {
    const error = await unavailable(adapterOver(handler, "fake", { helloMs: 15 }).describe(), "hello-failed");
    assert.equal(error.message, `engine fake is unavailable (hello-failed): ${detail}`);
  }
  const malformed = bending(fake, "hello", (reply) => void delete reply.ok);
  const error = await unavailable(adapterOver(malformed).describe(), "hello-failed");
  assert.match(error.message, /^engine fake is unavailable \(hello-failed\): the reply is not a protocol response: /);
});

test("a transport that does not open is unavailable: spawn-failed, with the transport's error as cause", async () => {
  const cause = new Error("spawn python3.99 ENOENT");
  let calls = 0;
  const transport = transportThat(
    async () => {
      calls++;
      throw new Error("never reached");
    },
    {
      open: async () => {
        throw cause;
      },
    },
  );
  const error = await unavailable(new RemoteEngineAdapter({ id: "worker", transport }).describe(), "spawn-failed");
  assert.equal(
    error.message,
    "engine worker is unavailable (spawn-failed): its stdio transport did not open: spawn python3.99 ENOENT",
  );
  assert.equal(error.cause, cause);
  assert.equal(calls, 0);
});

test("an engine found unavailable stays so: it is asked once, and run rejects with the same finding", async () => {
  const { handler, messages } = recording(createEngine({ id: "fake-b" }));
  const adapter = adapterOver(handler, "fake-a");
  const first = await unavailable(adapter.describe(), "id-mismatch");
  assert.equal(await unavailable(adapter.describe(), "id-mismatch"), first);
  assert.equal(await unavailable(adapter.run(REQUEST, CASE), "id-mismatch"), first);
  assert.deepEqual(
    messages.map(({ method }) => method),
    ["hello"],
  );
  // It can still be closed, and the engine that did answer hello is told to go.
  await adapter.close();
  assert.deepEqual(
    messages.map(({ method }) => method),
    ["hello", "shutdown"],
  );
});

test("run describes the engine first when nobody has", async () => {
  const { adapter, messages } = overFake();
  assert.equal((await adapter.run(REQUEST, CASE)).status, "ok");
  assert.deepEqual(
    messages.map(({ method }) => method),
    ["hello", "run"],
  );
});

// ── close ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A transport around a fake engine that notes when it is opened and closed, in `events`. */
function watchedTransport(handler: ProtocolHandler, events: string[]): Transport {
  const inner = createInProcessTransport(handler);
  return {
    kind: inner.kind,
    open: async () => {
      events.push("open");
      await inner.open();
    },
    call: async (message, options) => {
      events.push(message.method);
      return inner.call(message, options);
    },
    close: async () => {
      events.push("close");
      await inner.close();
    },
  };
}

test("close sends shutdown and then closes the transport", async () => {
  const events: string[] = [];
  const { handler, messages } = recording(createEngine({ id: "fake" }));
  const adapter = new RemoteEngineAdapter({ id: "fake", transport: watchedTransport(handler, events) });
  await adapter.run(REQUEST, CASE);
  await adapter.close();
  assert.deepEqual(events, ["open", "hello", "run", "shutdown", "close"]);
  assert.deepEqual(messages[2], { contract: CONTRACT_VERSION, id: "3", method: "shutdown", params: {} });
});

test("closing twice is safe: one shutdown, one close, the same promise", async () => {
  const events: string[] = [];
  const adapter = new RemoteEngineAdapter({
    id: "fake",
    transport: watchedTransport(createEngine({ id: "fake" }), events),
  });
  await adapter.describe();
  const first = adapter.close();
  const second = adapter.close();
  assert.equal(second, first);
  await Promise.all([first, second]);
  await adapter.close();
  assert.deepEqual(events, ["open", "hello", "shutdown", "close"]);
});

test("an adapter that never reached its engine closes without opening it or sending anything", async () => {
  const events: string[] = [];
  const adapter = new RemoteEngineAdapter({
    id: "fake",
    transport: watchedTransport(createEngine({ id: "fake" }), events),
  });
  await adapter.close();
  await adapter.close();
  assert.deepEqual(events, ["close"]);
});

test("whatever the engine does with shutdown, the transport is closed and close resolves", async () => {
  const fake = createEngine({ id: "fake" });
  const refusing: ProtocolHandler = (message) =>
    message.method === "shutdown"
      ? { contract: CONTRACT_VERSION, id: message.id, ok: false, error: { code: "busy", message: "not now" } }
      : fake(message);
  const throwing: ProtocolHandler = (message) => {
    if (message.method === "shutdown") throw new Error("already gone");
    return fake(message);
  };
  const silent: ProtocolHandler = (message) =>
    message.method === "shutdown" ? new Promise<ProtocolResponse>(() => {}) : fake(message);
  const garbled = bending(fake, "shutdown", () => "bye");

  for (const handler of [refusing, throwing, silent, garbled]) {
    const events: string[] = [];
    const transport = watchedTransport(handler, events);
    const adapter = new RemoteEngineAdapter({ id: "fake", transport, timeouts: { shutdownMs: 10 } });
    await adapter.describe();
    await adapter.close();
    assert.deepEqual(events, ["open", "hello", "shutdown", "close"]);
  }
});

test("an engine whose transport did not open is not sent shutdown, and its transport is still closed", async () => {
  const events: string[] = [];
  const transport = transportThat(
    async () => {
      events.push("call");
      throw new Error("never reached");
    },
    {
      open: async () => {
        events.push("open");
        throw new Error("no such program");
      },
      close: async () => void events.push("close"),
    },
  );
  const adapter = new RemoteEngineAdapter({ id: "fake", transport });
  await unavailable(adapter.describe(), "spawn-failed");
  await adapter.close();
  assert.deepEqual(events, ["open", "close"]);
});

test("close waits for a hello that is under way, so shutdown follows it", async () => {
  const events: string[] = [];
  const fake = createEngine({ id: "fake" });
  const slowHello: ProtocolHandler = async (message) => {
    if (message.method === "hello") await new Promise((resolve) => setTimeout(resolve, 10));
    return fake(message);
  };
  const adapter = new RemoteEngineAdapter({ id: "fake", transport: watchedTransport(slowHello, events) });
  const describing = adapter.describe();
  await adapter.close();
  assert.equal((await describing).identity.id, "fake");
  assert.deepEqual(events, ["open", "hello", "shutdown", "close"]);
});

test("after close the descriptor is still known, and a run or a first describe is the caller's mistake", async () => {
  const { adapter, messages } = overFake();
  const descriptor = await adapter.describe();
  await adapter.close();
  assert.equal(await adapter.describe(), descriptor);
  await assert.rejects(adapter.run(REQUEST, CASE), { message: "engine fake: run() after close()" });
  assert.deepEqual(
    messages.map(({ method }) => method),
    ["hello", "shutdown"],
  );

  const unopened = overFake();
  await unopened.adapter.close();
  await assert.rejects(unopened.adapter.describe(), { message: "engine fake: describe() after close()" });
  await assert.rejects(unopened.adapter.run(REQUEST, CASE), { message: "engine fake: describe() after close()" });
  assert.deepEqual(unopened.messages, []);
});
