import assert from "node:assert/strict";
import { test } from "node:test";

import type { ProtocolHandler, ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { TRANSPORT_KINDS, TransportTimeoutError } from "../../src/transports/transport.ts";
import type { Transport } from "../../src/transports/transport.ts";
import { PROTOCOL_RUN, RESPONSE_RUN } from "../contract/corpus.ts";
import { HELLO } from "../engines/support.ts";

const WAIT = { timeoutMs: 5_000 };

/** A reply to `message` whose result is `result`, typed as the protocol's whatever `result` holds. */
function replyTo(message: ProtocolRequest, result: unknown): ProtocolResponse {
  return { contract: CONTRACT_VERSION, id: message.id, ok: true, result } as ProtocolResponse;
}

async function opened(handler: ProtocolHandler): Promise<Transport> {
  const transport = createInProcessTransport(handler);
  await transport.open();
  return transport;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("the in-process transport is one of the transport kinds", () => {
  assert.equal(createInProcessTransport(() => RESPONSE_RUN).kind, "in-process");
  assert.deepEqual([...TRANSPORT_KINDS], ["in-process", "stdio", "oneshot", "file-exchange", "http"]);
});

test("a message reaches the handler and its reply comes back, whether the handler returns or resolves", async () => {
  const seen: ProtocolRequest[] = [];
  const plain = await opened((message) => {
    seen.push(message);
    return RESPONSE_RUN;
  });
  assert.deepEqual(await plain.call(PROTOCOL_RUN, WAIT), RESPONSE_RUN);
  assert.deepEqual(seen, [PROTOCOL_RUN]);

  const later = await opened(async (message) => {
    await sleep(2);
    return replyTo(message, {});
  });
  assert.deepEqual(await later.call(HELLO, WAIT), { contract: CONTRACT_VERSION, id: "1", ok: true, result: {} });
});

// ── JSON isolation ───────────────────────────────────────────────────────────────────────────────────────────────

test("the handler gets a copy of the message: no object of the caller's, at any depth", async () => {
  let received: ProtocolRequest | undefined;
  const transport = await opened((message) => {
    received = message;
    return replyTo(message, {});
  });
  await transport.call(PROTOCOL_RUN, WAIT);
  assert.ok(received !== undefined && received.method === "run");
  assert.deepEqual(received, PROTOCOL_RUN);
  assert.notEqual(received, PROTOCOL_RUN);
  assert.notEqual(received.params, PROTOCOL_RUN.params);
  assert.notEqual(received.params.case, PROTOCOL_RUN.params.case);
  assert.notEqual(received.params.case.system.surfaces, PROTOCOL_RUN.params.case.system.surfaces);
  assert.notEqual(received.params.request.spec, PROTOCOL_RUN.params.request.spec);
  // The case and the request are frozen where they were made; what crosses the transport is plain data.
  assert.ok(Object.isFrozen(PROTOCOL_RUN.params.case.system));
  assert.ok(!Object.isFrozen(received.params.case) && !Object.isFrozen(received.params.case.system));
});

test("changing the message after the call does not change what the handler was given", async () => {
  let received: ProtocolRequest | undefined;
  const transport = await opened((message) => {
    received = message;
    return replyTo(message, {});
  });
  const message = structuredClone(PROTOCOL_RUN) as {
    id: string;
    params: { request: { quantity: string; spec: object } };
  };
  await transport.call(message as unknown as ProtocolRequest, WAIT);

  message.id = "changed";
  message.params.request.quantity = "changed.quantity";
  (message.params.request.spec as Record<string, unknown>).line = 99;
  assert.deepEqual(received, PROTOCOL_RUN);
});

test("a handler that changes its message changes only its own copy", async () => {
  const transport = await opened((message) => {
    const mine = message as unknown as { id: string; params: Record<string, unknown> };
    const reply = replyTo(message, {});
    mine.id = "overwritten";
    mine.params.case = null;
    delete mine.params.request;
    return reply;
  });
  const message = structuredClone(PROTOCOL_RUN);
  await transport.call(message, WAIT);
  assert.deepEqual(message, PROTOCOL_RUN);
});

test("the caller gets a copy of the reply: the handler keeps no hold on it", async () => {
  const kept = structuredClone(RESPONSE_RUN) as unknown as { id: string; result: { status: string; data: object } };
  const transport = await opened(() => kept as unknown as ProtocolResponse);
  const first = await transport.call(PROTOCOL_RUN, WAIT);
  assert.deepEqual(first, RESPONSE_RUN);
  assert.notEqual(first, kept);
  assert.notEqual((first as unknown as typeof kept).result, kept.result);
  assert.notEqual((first as unknown as typeof kept).result.data, kept.result.data);

  // The handler changes what it returned; the caller's reply does not move. Nor does the handler's when the caller
  // changes its own.
  kept.result.status = "error";
  assert.deepEqual(first, RESPONSE_RUN);
  (first as unknown as typeof kept).id = "mine";
  assert.equal(kept.id, RESPONSE_RUN.id);
  const second = await transport.call(PROTOCOL_RUN, WAIT);
  assert.equal((second as unknown as typeof kept).result.status, "error");
});

test("a reply holding what JSON cannot carry arrives as JSON delivers it, never as the handler's values", async () => {
  class Report {
    readonly rays = 2;
    describe(): string {
      return "two rays";
    }
  }
  const data = {
    nan: NaN,
    infinity: Infinity,
    negativeZero: -0,
    missing: undefined,
    when: new Date(0),
    map: new Map([["a", 1]]),
    set: new Set([1]),
    typed: Float64Array.of(1.5, 2.5),
    method: () => 1,
    instance: new Report(),
    list: [undefined, () => 1, NaN, 1],
    [Symbol("hidden")]: 1,
    nested: { kept: "yes", dropped: undefined },
  };
  const transport = await opened((message) => replyTo(message, { data }));
  const reply = (await transport.call(HELLO, WAIT)) as unknown as { result: { data: Record<string, unknown> } };
  assert.deepEqual(reply.result.data, {
    nan: null,
    infinity: null,
    negativeZero: 0,
    when: "1970-01-01T00:00:00.000Z",
    map: {},
    set: {},
    typed: { "0": 1.5, "1": 2.5 },
    instance: { rays: 2 },
    list: [null, null, null, 1],
    nested: { kept: "yes" },
  });
  // Plain data all the way down: the class and its method stayed with the handler.
  assert.equal(Object.getPrototypeOf(reply.result.data.instance), Object.prototype);
  assert.equal(Object.is(reply.result.data.negativeZero, 0), true);
});

test("a message holding what JSON cannot carry reaches the handler as JSON delivers it", async () => {
  let received: unknown;
  const transport = await opened((message) => {
    received = message;
    return replyTo(message, {});
  });
  const spec = { tolerance: NaN, rays: Float64Array.of(1, 2), skip: undefined, when: new Date(0) };
  const message = { contract: CONTRACT_VERSION, id: "7", method: "run", params: { spec } };
  await transport.call(message as unknown as ProtocolRequest, WAIT);
  assert.deepEqual(received, {
    contract: CONTRACT_VERSION,
    id: "7",
    method: "run",
    params: { spec: { tolerance: null, rays: { "0": 1, "1": 2 }, when: "1970-01-01T00:00:00.000Z" } },
  });
});

test("a reply or a message with no JSON text at all is an error of the call", async () => {
  const noReply = await opened(() => undefined as unknown as ProtocolResponse);
  await assert.rejects(noReply.call(HELLO, WAIT), {
    message: "in-process transport: the reply is undefined, which is not JSON",
  });
  const aFunction = await opened(() => (() => 1) as unknown as ProtocolResponse);
  await assert.rejects(aFunction.call(HELLO, WAIT), {
    message: "in-process transport: the reply is function, which is not JSON",
  });
  const bigint = await opened((message) => replyTo(message, { count: 1n }));
  await assert.rejects(bigint.call(HELLO, WAIT), /^Error: in-process transport: the reply cannot be written as JSON: /);
  const circular: Record<string, unknown> = {};
  circular.self = circular;
  const cyclic = await opened((message) => replyTo(message, circular));
  await assert.rejects(cyclic.call(HELLO, WAIT), /^Error: in-process transport: the reply cannot be written as JSON: /);

  let called = false;
  const transport = await opened((message) => {
    called = true;
    return replyTo(message, {});
  });
  const message = { ...HELLO, params: { count: 1n } } as unknown as ProtocolRequest;
  await assert.rejects(
    transport.call(message, WAIT),
    /^Error: in-process transport: the message cannot be written as JSON: /,
  );
  assert.equal(called, false);
});

// ── Failure and time ─────────────────────────────────────────────────────────────────────────────────────────────

test("a handler that throws, at once or later, makes the call reject with what it threw", async () => {
  const crash = new Error("the engine crashed");
  const atOnce = await opened(() => {
    throw crash;
  });
  await assert.rejects(atOnce.call(HELLO, WAIT), (error) => error === crash);

  const later = await opened(async () => {
    await sleep(1);
    throw crash;
  });
  await assert.rejects(later.call(HELLO, WAIT), (error) => error === crash);
  // The transport is not spoiled by it.
  const recovering = await opened((message) => {
    if (message.id === "1") throw crash;
    return replyTo(message, {});
  });
  await assert.rejects(recovering.call(HELLO, WAIT));
  assert.equal((await recovering.call({ ...HELLO, id: "2" }, WAIT)).id, "2");
});

test("a reply that does not come in time is a TransportTimeoutError, and a late reply is dropped", async () => {
  let release: () => void = () => {};
  const transport = await opened((message) => {
    if (message.method !== "run") return replyTo(message, {});
    return new Promise<ProtocolResponse>((resolve) => {
      release = () => resolve(RESPONSE_RUN);
    });
  });
  const error = await transport.call(PROTOCOL_RUN, { timeoutMs: 10 }).then(
    () => assert.fail("the call resolved"),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof TransportTimeoutError);
  assert.ok(error instanceof Error);
  assert.equal(error.name, "TransportTimeoutError");
  assert.equal(error.timeoutMs, 10);
  assert.equal(error.message, "no reply to run within 10 ms");

  // The handler answers after all. Nobody is waiting for that reply, and the next call gets its own.
  release();
  await sleep(1);
  assert.deepEqual(await transport.call({ ...HELLO, id: "9" }, WAIT), {
    contract: CONTRACT_VERSION,
    id: "9",
    ok: true,
    result: {},
  });
});

test("a handler that fails after its call timed out fails nothing else", async () => {
  const transport = await opened(async () => {
    await sleep(15);
    throw new Error("too late to matter");
  });
  await assert.rejects(transport.call(HELLO, { timeoutMs: 2 }), TransportTimeoutError);
  // An unhandled rejection would fail the test run; waiting past the handler's own failure shows there is none.
  await sleep(30);
});

test("a wait longer than a timer can hold is still a wait, not a timeout at once", async () => {
  const transport = await opened(async (message) => {
    await sleep(5);
    return replyTo(message, {});
  });
  // Had the timer been set to more than 2^31 - 1 ms it would have fired after 1 ms. It is also cleared when the
  // reply comes: a timer left running would keep this test process alive for weeks.
  assert.equal((await transport.call(HELLO, { timeoutMs: 2 ** 40 })).ok, true);
  assert.equal((await transport.call(HELLO, { timeoutMs: Infinity })).ok, true);
});

// ── Open and close ───────────────────────────────────────────────────────────────────────────────────────────────

test("a call is refused before open and after close, and the handler is not reached", async () => {
  let calls = 0;
  const transport = createInProcessTransport((message) => {
    calls++;
    return replyTo(message, {});
  });
  await assert.rejects(transport.call(HELLO, WAIT), { message: "in-process transport: call() before open()" });
  await transport.open();
  await transport.open();
  assert.equal((await transport.call(HELLO, WAIT)).ok, true);
  await transport.close();
  await assert.rejects(transport.call(HELLO, WAIT), { message: "in-process transport: call() after close()" });
  assert.equal(calls, 1);
});

test("close is safe twice and on a transport that was never opened, and a closed transport stays closed", async () => {
  const transport = createInProcessTransport((message) => replyTo(message, {}));
  await transport.close();
  await transport.close();
  await assert.rejects(transport.open(), { message: "in-process transport: open() after close()" });
  await assert.rejects(transport.call(HELLO, WAIT), { message: "in-process transport: call() after close()" });
});
