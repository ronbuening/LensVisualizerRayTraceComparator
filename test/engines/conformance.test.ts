// The conformance kit: what it reports for an engine that conforms, and for each way an engine can fail to.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import { engineStamp } from "../../src/contract/engine.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import type { ProtocolHandler, ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { EngineUnavailableError } from "../../src/engines/adapter.ts";
import { CONFORMANCE_CHECKS, UNKNOWN_QUANTITY, runConformance } from "../../src/engines/conformance.ts";
import type { ConformanceReport, ConformanceStatus } from "../../src/engines/conformance.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { createStdioTransport, workerEnvironment } from "../../src/transports/stdio.ts";
import type { Transport } from "../../src/transports/transport.ts";
import { SELFTEST_ECHO_EXAMPLES } from "../contract/corpus.ts";
import { HELLO, STDIO_FAKE_ENGINE, bending, recording } from "./support.ts";

const ECHO_CHECKS = Object.keys(SELFTEST_ECHO_EXAMPLES)
  .sort()
  .map((name) => `echo.${name}`);
/** Every check of a report, in order. */
const ALL_CHECKS = [
  "hello",
  "contract-range",
  "engine-id",
  "unknown-quantity",
  "malformed-run",
  ...ECHO_CHECKS,
  "ids-echoed",
  "deterministic",
  "shutdown",
];

/** The report on an engine in this process that answers as `handler` does. */
function conformanceOf(handler: ProtocolHandler, id: string = "fake"): Promise<ConformanceReport> {
  return runConformance({ id, createTransport: () => createInProcessTransport(handler) });
}

/** How each check of a report ended, by its id. */
function statuses(report: ConformanceReport): Record<string, ConformanceStatus> {
  return Object.fromEntries(report.checks.map((check) => [check.id, check.status]));
}

/** The ids of the checks that ended as `status`, in order. */
function checksThat(report: ConformanceReport, status: ConformanceStatus): string[] {
  return report.checks.filter((check) => check.status === status).map((check) => check.id);
}

function detailOf(report: ConformanceReport, id: string): string {
  const check = report.checks.find((candidate) => candidate.id === id);
  assert.ok(check, `the report has no check ${id}`);
  return check.detail;
}

/** The TypeScript fake engine as a worker process, with these options and this way of ending. */
function fakeWorker(t: TestContext, options: Record<string, unknown>, ends?: string): () => Transport {
  return () => {
    const transport = createStdioTransport({
      command: [process.execPath, STDIO_FAKE_ENGINE],
      env: workerEnvironment(process.env, options, ends === undefined ? {} : { FAKE_WORKER_ENDS: ends }),
      cwd: process.cwd(),
      closeGraceMs: 200,
    });
    t.after(() => transport.close());
    return transport;
  };
}

// ── An engine that conforms ──────────────────────────────────────────────────────────────────────────────────────

test("the fake engine conforms: every check passes, in a fixed order, each with a reason", async () => {
  const report = await conformanceOf(createEngine({ id: "fake" }));
  assert.equal(report.engine, "fake");
  assert.equal(report.passed, true);
  assert.deepEqual(
    report.checks.map((check) => check.id),
    ALL_CHECKS,
  );
  assert.deepEqual(checksThat(report, "pass"), ALL_CHECKS);
  for (const check of report.checks) assert.ok(check.detail.length > 0, check.id);
  assert.equal(detailOf(report, "shutdown"), "the engine was released; its transport has no process to end");
  assert.equal(detailOf(report, "unknown-quantity"), 'conformance.no-such-quantity is answered "unsupported"');
  // The named checks are the report's, with the examples of the contract between them.
  assert.deepEqual(
    ALL_CHECKS.filter((id) => !id.startsWith("echo.")),
    [...CONFORMANCE_CHECKS],
  );
  assert.ok(ECHO_CHECKS.length >= 7);
  for (const name of ["special-values", "empty", "matrix", "sum-is-not-compensated"]) {
    assert.ok(ECHO_CHECKS.includes(`echo.${name}`), name);
  }
  assert.deepEqual(validateKind("request", { ...requestOf(UNKNOWN_QUANTITY) }), []);
});

/** A request-shaped object for a quantity, enough to ask the schema whether the quantity id is well formed. */
function requestOf(quantity: string): Record<string, unknown> {
  const hash = "0".repeat(64);
  return { contract: "1.0", kind: "request", id: hash, caseId: hash, quantity, spec: {} };
}

test("the kit asks what it says: hello, an unknown quantity, a run without a spec, the examples, a repeat", async () => {
  const { handler, messages } = recording(createEngine({ id: "fake" }));
  await conformanceOf(handler);
  const asked = messages.map((message) =>
    message.method === "run" ? (message.params.request.quantity ?? "run") : message.method,
  );
  const examples = ECHO_CHECKS.map(() => "selftest.echo");
  assert.deepEqual(asked, [
    "hello",
    UNKNOWN_QUANTITY,
    UNKNOWN_QUANTITY,
    ...examples,
    "selftest.echo",
    "selftest.echo",
    "shutdown",
  ]);
  const malformed = messages[2] as Extract<ProtocolRequest, { method: "run" }>;
  assert.equal(Object.hasOwn(malformed.params.request, "spec"), false);
  // The repeat is one request, sent twice.
  assert.deepEqual(messages.at(-2), { ...messages.at(-3), id: messages.at(-2)?.id });
});

test("an engine that offers no selftest.echo has its examples skipped, and still conforms", async () => {
  const report = await conformanceOf(createEngine({ id: "fake", offersQuantities: false }));
  assert.equal(report.passed, true);
  assert.deepEqual(checksThat(report, "skipped"), ECHO_CHECKS);
  assert.deepEqual(checksThat(report, "fail"), []);
  for (const id of ECHO_CHECKS) assert.equal(detailOf(report, id), "the engine does not offer selftest.echo");
  assert.equal(detailOf(report, "deterministic"), `two answers to one ${UNKNOWN_QUANTITY} request are equal`);
});

test("the same engine conforms as a worker process, and ends by itself with exit code 0", async (t) => {
  const report = await runConformance({ id: "fake", createTransport: fakeWorker(t, { id: "fake" }) });
  assert.deepEqual(checksThat(report, "pass"), ALL_CHECKS);
  assert.equal(report.passed, true);
  assert.equal(detailOf(report, "shutdown"), "the worker ended by itself with exit code 0");
});

// ── Engines that do not ──────────────────────────────────────────────────────────────────────────────────────────

test("an engine whose numbers are off fails the examples it changes, and nothing else", async () => {
  const report = await conformanceOf(createEngine({ id: "fake", bias: 0.001 }));
  assert.equal(report.passed, false);
  // The empty array has no element to be off.
  assert.deepEqual(
    checksThat(report, "fail"),
    ECHO_CHECKS.filter((id) => id !== "echo.empty"),
  );
  assert.match(detailOf(report, "echo.scalar"), /^the values are not the expected bytes: got \S+, expected \S+$/);
});

test("answers of the wrong shape, sum or status fail the example and say which", async () => {
  const withData = (change: (data: Record<string, unknown>) => void): ProtocolHandler =>
    bending(createEngine({ id: "fake" }), "run", (reply) => {
      const result = reply.result as { data?: Record<string, unknown> } | undefined;
      if (result?.data !== undefined) change(result.data);
    });

  const flat = await conformanceOf(
    withData((data) => {
      const nd = (data.values as { $nd: { shape: number[] } }).$nd;
      nd.shape = [nd.shape.reduce((count, size) => count * size, 1)];
    }),
  );
  // Every example whose values are not one axis already: the matrix, the scalar and the empty array of two axes.
  const notFlat = Object.entries(SELFTEST_ECHO_EXAMPLES).filter(
    ([, example]) => example.spec.values.$nd.shape.length !== 1,
  );
  assert.deepEqual(checksThat(flat, "fail"), notFlat.map(([name]) => `echo.${name}`).sort());
  assert.ok(notFlat.length >= 2);
  assert.equal(detailOf(flat, "echo.matrix"), "the values have shape [6], expected [2, 3]");

  const summed = await conformanceOf(withData((data) => void (data.sum = data.sum === null ? 0 : null)));
  assert.deepEqual(checksThat(summed, "fail"), ECHO_CHECKS);
  assert.match(detailOf(summed, "echo.special-values"), /^the sum is 0, expected null$/);

  const noSum = await conformanceOf(withData((data) => void delete data.sum));
  assert.match(
    detailOf(noSum, "echo.empty"),
    /^the data is not selftest\.echo data: \(root\) \[required\] missing property "sum"$/,
  );
});

test("an engine that answers an unknown quantity with an error, or accepts a run that is no request, fails", async () => {
  const proper = createEngine({ id: "fake" });
  const erring = bending(proper, "run", (reply, message) => {
    const result = reply.result as Record<string, unknown> | undefined;
    if (message.method !== "run" || result === undefined || result.status !== "unsupported") return undefined;
    delete result.unsupported;
    result.status = "error";
    result.error = { code: "no-such-quantity", message: "what is that?" };
    return undefined;
  });
  const erred = await conformanceOf(erring);
  assert.deepEqual(checksThat(erred, "fail"), ["unknown-quantity"]);
  assert.equal(
    detailOf(erred, "unknown-quantity"),
    `${UNKNOWN_QUANTITY} is answered with status error (no-such-quantity): what is that?`,
  );

  // An engine that does not validate what it is sent: it answers a request without a spec like any other.
  const lenient: ProtocolHandler = async (message) => {
    if (message.method !== "run" || Object.hasOwn(message.params.request, "spec")) return proper(message);
    const whole = { ...message, params: { ...message.params, request: { ...message.params.request, spec: {} } } };
    return proper(whole);
  };
  const accepted = await conformanceOf(lenient);
  assert.deepEqual(checksThat(accepted, "fail"), ["malformed-run"]);
  assert.equal(
    detailOf(accepted, "malformed-run"),
    "a run whose request has no spec is answered with status unsupported",
  );
});

test("a run that is no request must be refused: an answer that only looks like a refusal fails", async () => {
  const proper = createEngine({ id: "fake" });
  const { identity } = ((await proper(HELLO)) as { result: EngineDescriptor }).result;
  // The engine handles the message and reports a failure of its own, under the code the adapter gives a refusal.
  const answering: ProtocolHandler = async (message) => {
    if (message.method !== "run" || Object.hasOwn(message.params.request, "spec")) return proper(message);
    const error = { code: "protocol-error", message: "the request has no spec" };
    const result = makeResult(message.params.request, engineStamp(identity), { status: "error", error });
    return { contract: "1.0", id: message.id, ok: true, result };
  };
  const report = await conformanceOf(answering);
  assert.deepEqual(checksThat(report, "fail"), ["malformed-run"]);
  assert.equal(
    detailOf(report, "malformed-run"),
    "a run whose request has no spec is answered with status error (protocol-error): the request has no spec",
  );
});

test("an engine that does not answer shutdown with an empty object fails shutdown", async (t) => {
  const refusal = { code: "unknown-method", message: 'unknown method "shutdown"' };
  const refusing = bending(createEngine({ id: "fake" }), "shutdown", (reply) => {
    return { contract: reply.contract, id: reply.id, ok: false, error: refusal };
  });
  const refused = await conformanceOf(refusing);
  assert.deepEqual(checksThat(refused, "fail"), ["shutdown"]);
  assert.equal(detailOf(refused, "shutdown"), 'shutdown was refused (unknown-method): unknown method "shutdown"');

  const chatty = bending(createEngine({ id: "fake" }), "shutdown", (reply) => void (reply.result = { bye: true }));
  const answered = await conformanceOf(chatty);
  assert.deepEqual(checksThat(answered, "fail"), ["shutdown"]);
  assert.match(detailOf(answered, "shutdown"), /^the reply to shutdown is not a protocol response: /);
  // A descriptor is a result a reply may carry, and still not the answer to shutdown.
  const proper = createEngine({ id: "fake" });
  const { result: descriptor } = (await proper(HELLO)) as { result: EngineDescriptor };
  const confused = await conformanceOf(bending(proper, "shutdown", (reply) => void (reply.result = descriptor)));
  assert.deepEqual(checksThat(confused, "fail"), ["shutdown"]);
  assert.equal(detailOf(confused, "shutdown"), "shutdown was answered with something other than an empty object");

  const silent: ProtocolHandler = async (message) => {
    if (message.method === "shutdown") throw new Error("the engine has left already");
    return createEngine({ id: "fake" })(message);
  };
  const dropped = await conformanceOf(silent);
  assert.deepEqual(checksThat(dropped, "fail"), ["shutdown"]);
  assert.equal(detailOf(dropped, "shutdown"), "shutdown got no reply");

  // A worker that refuses shutdown and ends when its input does has ended cleanly, and has still not conformed.
  const worker = await runConformance({ id: "fake", createTransport: fakeWorker(t, { id: "fake" }, "refuses") });
  assert.deepEqual(checksThat(worker, "fail"), ["shutdown"]);
  assert.match(detailOf(worker, "shutdown"), /^shutdown was refused \(unknown-method\): /);
});

test("an engine that does not echo ids fails ids-echoed, and every check its replies were for", async () => {
  const report = await conformanceOf(createEngine({ id: "fake", failMode: "wrong-request-id" }));
  assert.equal(statuses(report)["ids-echoed"], "fail");
  assert.match(detailOf(report, "ids-echoed"), /^status error \(request-id-mismatch\): the result answers request /);
  // The run that is no request is still refused, which is what that check wants.
  assert.deepEqual(checksThat(report, "fail"), ["unknown-quantity", ...ECHO_CHECKS, "ids-echoed", "deterministic"]);

  // A reply under another message id is no reply to the message.
  const misnumbered = bending(createEngine({ id: "fake" }), "run", (reply) => void (reply.id = `${String(reply.id)}0`));
  const other = await conformanceOf(misnumbered);
  assert.match(detailOf(other, "ids-echoed"), /^status error \(invalid-response\): the reply answers message /);
});

test("an engine that refuses, breaks or drops every run fails what needed an answer", async () => {
  const refusing = await conformanceOf(createEngine({ id: "fake", failMode: "protocol-error" }));
  // It refuses the malformed run too, which is the one refusal that is wanted.
  assert.equal(statuses(refusing)["malformed-run"], "pass");
  assert.deepEqual(checksThat(refusing, "fail"), ["unknown-quantity", ...ECHO_CHECKS, "deterministic"]);

  const invalid = await conformanceOf(createEngine({ id: "fake", failMode: "invalid-result" }));
  assert.match(detailOf(invalid, "unknown-quantity"), /status error \(invalid-result\): the reply is not a result/);
  const throwing = await conformanceOf(createEngine({ id: "fake", failMode: "throw" }));
  assert.match(detailOf(throwing, "echo.empty"), /^status error \(transport-error\): the transport failed: /);
  // The run that is no request is refused by the first before it can break its answer; the second drops it too.
  assert.deepEqual(checksThat(invalid, "pass"), ["hello", "contract-range", "engine-id", "malformed-run", "shutdown"]);
  assert.deepEqual(checksThat(throwing, "pass"), ["hello", "contract-range", "engine-id", "shutdown"]);
  for (const report of [refusing, invalid, throwing]) {
    assert.equal(report.passed, false);
    // No result was the engine's own, so there is nothing to say about the ids it echoes.
    assert.deepEqual(checksThat(report, "skipped"), ["ids-echoed"]);
    assert.equal(detailOf(report, "ids-echoed"), "the engine gave no result of its own to judge");
  }
});

test("determinism is checked only when the descriptor claims it, and then it must hold", async () => {
  const modest = bending(createEngine({ id: "fake" }), "hello", (reply) => {
    (reply.result as { capabilities: { deterministic: boolean } }).capabilities.deterministic = false;
  });
  const skipped = await conformanceOf(modest);
  assert.equal(skipped.passed, true);
  assert.deepEqual(checksThat(skipped, "skipped"), ["deterministic"]);
  assert.equal(detailOf(skipped, "deterministic"), "the descriptor does not say the engine is deterministic");

  let runs = 0;
  const drifting = bending(createEngine({ id: "fake" }), "run", (reply) => {
    const result = reply.result as ResultEnvelope | undefined;
    if (result?.diagnostics !== undefined) (result.diagnostics.counts as Record<string, number>).run = ++runs;
  });
  const failed = await conformanceOf(drifting);
  assert.deepEqual(checksThat(failed, "fail"), ["deterministic"]);
  assert.equal(detailOf(failed, "deterministic"), "two answers to one selftest.echo request differ");
});

// ── Engines that cannot be used at all ───────────────────────────────────────────────────────────────────────────

test("a descriptor of another engine, of another contract, or that is none, fails the check it breaks", async () => {
  const remaining = ["unknown-quantity", "malformed-run", "ids-echoed", "deterministic", "shutdown"];

  const renamed = await conformanceOf(createEngine({ id: "someone-else" }), "fake");
  assert.equal(renamed.passed, false);
  assert.deepEqual(statuses(renamed), {
    hello: "pass",
    "contract-range": "pass",
    "engine-id": "fail",
    ...Object.fromEntries(remaining.map((id) => [id, "skipped"])),
  });
  assert.equal(
    detailOf(renamed, "engine-id"),
    "engine fake is unavailable (id-mismatch): its descriptor says it is engine someone-else",
  );
  // No example is listed for an engine whose descriptor could not be read: what it offers is not known.
  assert.deepEqual(
    renamed.checks.map((check) => check.id),
    ALL_CHECKS.filter((id) => !id.startsWith("echo.")),
  );

  const future = bending(createEngine({ id: "fake" }), "hello", (reply) => {
    (reply.result as { contract: unknown }).contract = { min: "2.0", max: "2.3" };
  });
  const mismatched = await conformanceOf(future);
  assert.deepEqual(checksThat(mismatched, "pass"), ["hello"]);
  assert.deepEqual(checksThat(mismatched, "fail"), ["contract-range"]);
  assert.match(detailOf(mismatched, "contract-range"), /\(contract-mismatch\): it speaks contract 2\.0 to 2\.3/);
  assert.equal(statuses(mismatched)["engine-id"], "skipped");

  const shapeless = bending(createEngine({ id: "fake" }), "hello", (reply) => void (reply.result = { id: "fake" }));
  const broken = await conformanceOf(shapeless);
  assert.deepEqual(checksThat(broken, "fail"), ["hello"]);
  assert.match(detailOf(broken, "hello"), /\(bad-descriptor\): the reply to hello is not an engine descriptor/);
  assert.deepEqual(checksThat(broken, "skipped"), ["contract-range", "engine-id", ...remaining]);

  const silent: ProtocolHandler = () => ({ contract: "1.0", id: "?", ok: false, error: { code: "no", message: "" } });
  assert.match(detailOf(await conformanceOf(silent), "hello"), /\(hello-failed\)/);
});

test("an engine that cannot be built or started fails hello with the reason, and nothing is left running", async (t) => {
  const unbuilt = await runConformance({
    id: "ghost",
    createTransport: async () => {
      throw new EngineUnavailableError("ghost", "load-failed", "its module ghost.ts does not exist");
    },
  });
  assert.equal(unbuilt.passed, false);
  assert.deepEqual(checksThat(unbuilt, "fail"), ["hello"]);
  assert.equal(
    detailOf(unbuilt, "hello"),
    "engine ghost is unavailable (load-failed): its module ghost.ts does not exist",
  );
  assert.equal(statuses(unbuilt).shutdown, "skipped");

  const transport = createStdioTransport({ command: ["lvrtc-no-such-command"], env: {}, cwd: process.cwd() });
  t.after(() => transport.close());
  const unstarted = await runConformance({ id: "ghost", createTransport: () => transport });
  assert.match(detailOf(unstarted, "hello"), /\(spawn-failed\): its stdio transport did not open: /);
  assert.deepEqual(checksThat(unstarted, "fail"), ["hello"]);
});

test("a transport is closed whatever was found, and one that fails to close fails shutdown", async () => {
  const closed: string[] = [];
  const watched = (handler: ProtocolHandler, name: string, fail = false): (() => Transport) => {
    return () => {
      const transport = createInProcessTransport(handler);
      return {
        ...transport,
        close: async () => {
          closed.push(name);
          if (fail) throw new Error("the pipe is stuck");
          await transport.close();
        },
      };
    };
  };
  const good = createEngine({ id: "fake" });
  await runConformance({ id: "fake", createTransport: watched(good, "conforming") });
  await runConformance({ id: "other", createTransport: watched(good, "renamed") });
  const stuck = await runConformance({ id: "fake", createTransport: watched(good, "stuck", true) });
  assert.deepEqual(closed, ["conforming", "renamed", "stuck"]);
  assert.deepEqual(checksThat(stuck, "fail"), ["shutdown"]);
  assert.equal(detailOf(stuck, "shutdown"), "closing the engine failed: the pipe is stuck");
});

test("a worker that does not end on shutdown, or ends with a failure, fails shutdown", async (t) => {
  const lingering = await runConformance({
    id: "fake",
    createTransport: fakeWorker(t, { id: "fake" }, "lingers"),
    timeouts: { shutdownMs: 2000 },
  });
  assert.deepEqual(checksThat(lingering, "fail"), ["shutdown"]);
  assert.equal(detailOf(lingering, "shutdown"), "the worker did not end after shutdown and was killed");

  const failing = await runConformance({ id: "fake", createTransport: fakeWorker(t, { id: "fake" }, "3") });
  assert.deepEqual(checksThat(failing, "fail"), ["shutdown"]);
  assert.equal(detailOf(failing, "shutdown"), "the worker ended with exit code 3 after shutdown");
});

test("a reply to hello under another id is a hello that failed", async () => {
  const handler: ProtocolHandler = async (message) => {
    const reply = (await createEngine({ id: "fake" })(message)) as ProtocolResponse;
    return message.method === "hello" ? { ...reply, id: "elsewhere" } : reply;
  };
  const report = await conformanceOf(handler);
  assert.deepEqual(checksThat(report, "fail"), ["hello"]);
  assert.match(detailOf(report, "hello"), /\(hello-failed\): the reply answers message "elsewhere"/);
});
