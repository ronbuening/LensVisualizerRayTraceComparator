// The stdio transport against a small Node worker (test/fixtures/stdio-worker/worker.mjs) that behaves well or, by
// its mode, badly in one particular way. Nothing here needs Python or an engine.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import type { ProtocolRequest } from "../../src/contract/protocol.ts";
import {
  ENGINE_OPTIONS_VARIABLE,
  INHERITED_VARIABLES,
  STDIO_ERROR_CODES,
  StdioTransportError,
  createStdioTransport,
  workerEnvironment,
} from "../../src/transports/stdio.ts";
import type { StdioErrorCode, StdioTransport, StdioTransportOptions } from "../../src/transports/stdio.ts";
import { TransportTimeoutError } from "../../src/transports/transport.ts";
import { tempDir } from "../core/support.ts";

const WORKER = fileURLToPath(new URL("../fixtures/stdio-worker/worker.mjs", import.meta.url));
const WORKER_DIR = fileURLToPath(new URL("../fixtures/stdio-worker", import.meta.url));
/** Long enough for a child process to start on a loaded machine; a test that passes never waits for it. */
const PATIENT = { timeoutMs: 30_000 };

/** A transport to the fixture worker in one mode, closed when the test ends. */
function workerIn(t: TestContext, mode: string, options: Partial<StdioTransportOptions> = {}): StdioTransport {
  const transport = createStdioTransport({
    command: [process.execPath, WORKER, mode],
    env: workerEnvironment(process.env, {}, {}),
    cwd: WORKER_DIR,
    ...options,
  });
  t.after(() => transport.close());
  return transport;
}

/** A message with this id; the worker does not care what else it holds. */
function message(id: string, method: string = "hello", params: unknown = {}): ProtocolRequest {
  return { contract: "1.0", id, method, params } as ProtocolRequest;
}

/** The `result` of a reply, as the fixture worker wrote it. */
function resultOf(reply: unknown): Record<string, unknown> {
  return (reply as { result: Record<string, unknown> }).result;
}

/** The `StdioTransportError` that `work` rejects with, checked for its code. */
async function stdioError(work: Promise<unknown>, code: StdioErrorCode): Promise<StdioTransportError> {
  const error: unknown = await work.then(
    () => assert.fail(`expected a ${code} error`),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof StdioTransportError, String(error));
  assert.equal(error.code, code, error.message);
  assert.equal(error.name, "StdioTransportError");
  return error;
}

/** Whether a process with this id still exists. */
function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// ── A worker that behaves ────────────────────────────────────────────────────────────────────────────────────────

test("a message reaches the worker as one line and its reply comes back parsed", async (t) => {
  const transport = workerIn(t, "well");
  assert.equal(transport.kind, "stdio");
  assert.equal(transport.exitStatus(), null);
  await transport.open();
  const params = { text: 'é ☃ 😀 "quoted" \\ line\nbreak', numbers: [1, -0.5, 1e-300], nested: { a: null } };
  const reply = await transport.call(message("m-1", "run", params), PATIENT);
  assert.deepEqual({ ...reply, result: undefined }, { contract: "1.0", id: "m-1", ok: true, result: undefined });
  assert.deepEqual(resultOf(reply).params, params);
  assert.equal(resultOf(reply).method, "run");
  assert.equal(resultOf(await transport.call(message("m-2"), PATIENT)).received, 2);
  assert.equal(transport.exitStatus(), null);
});

test("the worker runs without a shell, in the directory and with exactly the environment it is given", async (t) => {
  const cwd = tempDir(t);
  const env = { ...workerEnvironment({ PATH: process.env.PATH }, {}, {}), ONLY_THIS: "$HOME `id` ; echo" };
  const transport = createStdioTransport({
    command: [process.execPath, WORKER, "well", "a b", "$HOME", "*"],
    env,
    cwd,
  });
  t.after(() => transport.close());
  await transport.open();
  const result = resultOf(await transport.call(message("1"), PATIENT));
  // Arguments arrive as they were written: nothing splits, expands or globs them.
  assert.deepEqual(result.argv, ["well", "a b", "$HOME", "*"]);
  assert.equal(result.cwd, cwd);
  const seen = result.env as Record<string, string>;
  for (const [name, value] of Object.entries(env)) assert.equal(seen[name], value, name);
  // What this process has and the worker was not given, the worker does not have.
  for (const name of ["HOME", "USER", "NODE_OPTIONS", "LVRTC_RUNS_DIR"]) assert.equal(seen[name], undefined, name);
});

test("workerEnvironment: a few inherited variables, the Python switches, the options, then the configured ones", () => {
  const inherited = { PATH: "/bin", HOME: "/home/me", TMPDIR: "/tmp/x", SECRET_TOKEN: "s3cret", PYTHONPATH: "/mine" };
  assert.deepEqual(workerEnvironment(inherited, {}, {}), {
    PATH: "/bin",
    HOME: "/home/me",
    TMPDIR: "/tmp/x",
    PYTHONDONTWRITEBYTECODE: "1",
    PYTHONUNBUFFERED: "1",
    LVRTC_ENGINE_OPTIONS: "{}",
  });
  assert.ok(INHERITED_VARIABLES.includes("PATH") && !(INHERITED_VARIABLES as readonly string[]).includes("PYTHONPATH"));
  assert.equal(ENGINE_OPTIONS_VARIABLE, "LVRTC_ENGINE_OPTIONS");

  const configured = { PYTHONPATH: "/kit", PATH: "/venv/bin", PYTHONUNBUFFERED: "0", MODE: "test" };
  assert.deepEqual(workerEnvironment({ PATH: "/bin", LANG: undefined }, { id: "w", bias: 0.5, b: [1] }, configured), {
    PATH: "/venv/bin",
    PYTHONDONTWRITEBYTECODE: "1",
    PYTHONUNBUFFERED: "0",
    // Canonical JSON: the same text whatever order the options were written in.
    LVRTC_ENGINE_OPTIONS: '{"b":[1],"bias":0.5,"id":"w"}',
    PYTHONPATH: "/kit",
    MODE: "test",
  });
});

test("one message is under way at a time: calls made together are answered in order", async (t) => {
  const transport = workerIn(t, "slow");
  await transport.open();
  const delays = [80, 0, 40, 0, 0];
  const replies = await Promise.all(
    delays.map((delayMs, index) => transport.call(message(`q-${index}`, "run", { delayMs }), PATIENT)),
  );
  assert.deepEqual(
    replies.map((reply) => reply.id),
    delays.map((_, index) => `q-${index}`),
  );
  replies.forEach((reply, index) => {
    assert.equal(resultOf(reply).received, index + 1);
    // The worker never held two messages: the second was written only after the first was answered.
    assert.equal(resultOf(reply).mostWaiting, 1);
  });
});

test("a reply that arrives in pieces, cut inside a character, is put together", async (t) => {
  const transport = workerIn(t, "split");
  await transport.open();
  assert.deepEqual(resultOf(await transport.call(message("1"), PATIENT)), { text: "é☃" });
  assert.deepEqual(resultOf(await transport.call(message("2"), PATIENT)), { text: "é☃" });
});

test("a worker that floods its standard error is not held up, and only the tail of its log is kept", async (t) => {
  const transport = workerIn(t, "flood", { stderrTailChars: 200 });
  await transport.open();
  // Each reply comes after 4 MB of log, far more than a pipe holds: it arrives only if the log is being read.
  for (const id of ["1", "2", "3"]) assert.equal((await transport.call(message(id), PATIENT)).id, id);

  // The tail is what a later failure quotes: here the worker is asked for something it cannot parse as a reply.
  const quiet = workerIn(t, "garbage", { stderrTailChars: 12 });
  await quiet.open();
  const error = await stdioError(quiet.call(message("1"), PATIENT), "not-json");
  assert.equal(error.stderrTail, "e nonsense\n".padStart(12, "t"));
});

// ── A worker that does not ───────────────────────────────────────────────────────────────────────────────────────

test("the error codes of the stdio transport are these", () => {
  assert.deepEqual(
    [...STDIO_ERROR_CODES],
    ["spawn-failed", "exited", "not-json", "oversized-line", "unexpected-reply"],
  );
});

test("a command that does not start is spawn-failed, from open", async (t) => {
  const transport = createStdioTransport({ command: ["lvrtc-no-such-command", "--stdio"], env: {}, cwd: tempDir(t) });
  const error = await stdioError(transport.open(), "spawn-failed");
  assert.equal(
    error.message,
    "stdio worker: the command lvrtc-no-such-command did not start: spawn lvrtc-no-such-command ENOENT",
  );
  assert.equal(error.stderrTail, "");
  assert.equal(transport.exitStatus(), null);
  // Nothing was started, so there is nothing to call and nothing to end.
  await assert.rejects(transport.call(message("1"), PATIENT), /^Error: stdio transport: call\(\) before open\(\)$/);
  await transport.close();
  await assert.rejects(transport.open(), /^Error: stdio transport: open\(\) after close\(\)$/);
});

test("a worker that exits non-zero on start is found by the first call, with its exit code and its log", async (t) => {
  const transport = workerIn(t, "exit-on-start");
  await transport.open();
  const error = await stdioError(transport.call(message("1"), PATIENT), "exited");
  assert.match(error.message, /^stdio worker: the worker exited with code 2/);
  assert.match(error.message, /; its log ends: cannot start: the licence file is missing$/);
  assert.equal(error.stderrTail, "cannot start: the licence file is missing\n");
  assert.deepEqual(transport.exitStatus(), { code: 2, signal: null, forced: false });
});

test("a worker that crashes before replying is exited, with the tail of its standard error", async (t) => {
  const transport = workerIn(t, "crash");
  await transport.open();
  const error = await stdioError(transport.call(message("1", "run"), PATIENT), "exited");
  assert.equal(
    error.message,
    "stdio worker: the worker exited with code 3 before replying to run; its log ends: " +
      "Traceback (most recent call last): |   File worker.py, line 1 | RuntimeError: boom",
  );
  assert.equal(error.stderrTail, "Traceback (most recent call last):\n  File worker.py, line 1\nRuntimeError: boom\n");
  assert.deepEqual(transport.exitStatus(), { code: 3, signal: null, forced: false });

  // It stays gone: every later call fails at once, with the same code, and none is sent anywhere.
  const later = await stdioError(transport.call(message("2"), PATIENT), "exited");
  assert.match(later.message, /^stdio worker: the worker exited with code 3 and answers nothing more/);
});

test("a worker ended by a signal, and one that stops in the middle of a line, are exited too", async (t) => {
  const signalled = workerIn(t, "signal");
  await signalled.open();
  const error = await stdioError(signalled.call(message("1"), PATIENT), "exited");
  assert.equal(error.message, "stdio worker: the worker was ended by SIGTERM before replying to hello");
  assert.deepEqual(signalled.exitStatus(), { code: null, signal: "SIGTERM", forced: false });

  const partial = workerIn(t, "partial");
  await partial.open();
  // Half a line is no reply, however much of one it looks like.
  const cut = await stdioError(partial.call(message("1"), PATIENT), "exited");
  assert.equal(cut.message, "stdio worker: the worker exited with code 0 before replying to hello");
});

test("a line that is not JSON is not-json, and the worker is killed", async (t) => {
  const transport = workerIn(t, "garbage");
  await transport.open();
  const error = await stdioError(transport.call(message("1", "run"), PATIENT), "not-json");
  assert.equal(
    error.message,
    'stdio worker: the worker wrote a line that is not JSON in reply to run: "this is not json"; ' +
      "its log ends: about to write nonsense",
  );
  const later = await stdioError(transport.call(message("2"), PATIENT), "exited");
  assert.match(later.message, /^stdio worker: the worker is gone: the worker wrote a line that is not JSON/);
  await transport.close();
  assert.deepEqual(transport.exitStatus(), { code: null, signal: "SIGKILL", forced: true });
});

test("a reply with the wrong id, or that is no object, is unexpected-reply", async (t) => {
  const wrong = workerIn(t, "wrong-id");
  await wrong.open();
  const error = await stdioError(wrong.call(message("7"), PATIENT), "unexpected-reply");
  assert.equal(error.message, 'stdio worker: the worker\'s line answers message "not-7", not message "7"');
  await stdioError(wrong.call(message("8"), PATIENT), "exited");

  const number = workerIn(t, "non-object");
  await number.open();
  const other = await stdioError(number.call(message("7"), PATIENT), "unexpected-reply");
  assert.equal(other.message, 'stdio worker: the worker\'s line answers no message, not message "7"');
});

test("a worker that writes when nothing was asked is unexpected-reply for the next call", async (t) => {
  const transport = workerIn(t, "unsolicited");
  await transport.open();
  // The line may come before or after the call is made: either way it is not the reply to this message.
  const error: unknown = await transport.call(message("1"), PATIENT).catch((reason: unknown) => reason);
  assert.ok(error instanceof StdioTransportError, String(error));
  assert.ok(error.code === "unexpected-reply" || error.code === "exited", error.code);
  assert.match(error.message, /answers message "0"|wrote a line when no message was waiting/);
});

test("a line longer than the transport reads is oversized-line, whether or not its end ever comes", async (t) => {
  const transport = workerIn(t, "oversized", { maxLineBytes: 4096 });
  await transport.open();
  assert.equal((await transport.call(message("1", "run", { bytes: 100 }), PATIENT)).id, "1");
  const error = await stdioError(transport.call(message("2", "run", { bytes: 1_000_000 }), PATIENT), "oversized-line");
  assert.equal(error.message, "stdio worker: the worker wrote a line longer than 4096 bytes");
  await transport.close();
  assert.equal(transport.exitStatus()?.forced, true);

  // A line of exactly the limit is read; the newline is not counted.
  const exact = workerIn(t, "oversized", { maxLineBytes: 1000 });
  await exact.open();
  const envelope = JSON.stringify({ contract: "1.0", id: "1", ok: true, result: { filler: "" } }).length;
  assert.equal((await exact.call(message("1", "run", { bytes: 1000 - envelope }), PATIENT)).id, "1");
  await stdioError(exact.call(message("2", "run", { bytes: 1001 - envelope }), PATIENT), "oversized-line");
});

test("a reply that does not come in time is a TransportTimeoutError, and the worker is killed", async (t) => {
  const transport = workerIn(t, "hang");
  await transport.open();
  const error: unknown = await transport
    .call(message("1", "run"), { timeoutMs: 300 })
    .catch((reason: unknown) => reason);
  assert.ok(error instanceof TransportTimeoutError, String(error));
  assert.equal(error.message, "no reply to run within 300 ms");
  assert.equal(error.timeoutMs, 300);

  const later = await stdioError(transport.call(message("2"), PATIENT), "exited");
  // The log is quoted when the worker had come as far as writing it; on a slow machine it may not have.
  assert.match(
    later.message,
    /^stdio worker: the worker is gone: it was killed after no reply to run within 300 ms(; its log ends: thinking about run)?$/,
  );
  await transport.close();
  assert.deepEqual(transport.exitStatus(), { code: null, signal: "SIGKILL", forced: true });
});

test("a message with no JSON text is an error of that call alone", async (t) => {
  const transport = workerIn(t, "well");
  await transport.open();
  const circular: Record<string, unknown> = { contract: "1.0", id: "1", method: "hello" };
  circular.params = circular;
  await assert.rejects(
    transport.call(circular as unknown as ProtocolRequest, PATIENT),
    /^Error: stdio transport: the message cannot be written as JSON: /,
  );
  await assert.rejects(
    transport.call(undefined as unknown as ProtocolRequest, PATIENT),
    /^Error: stdio transport: the message is undefined, which is not JSON$/,
  );
  assert.equal((await transport.call(message("2"), PATIENT)).id, "2");
});

// ── Opening and closing ──────────────────────────────────────────────────────────────────────────────────────────

test("a call is refused before open and after close", async (t) => {
  const transport = workerIn(t, "well");
  await assert.rejects(transport.call(message("1"), PATIENT), /^Error: stdio transport: call\(\) before open\(\)$/);
  await transport.open();
  await transport.close();
  await assert.rejects(transport.call(message("2"), PATIENT), /^Error: stdio transport: call\(\) after close\(\)$/);
  await assert.rejects(transport.open(), /^Error: stdio transport: open\(\) after close\(\)$/);
});

test("open starts one process however often it is called, and close ends it", async (t) => {
  const transport = workerIn(t, "well");
  await Promise.all([transport.open(), transport.open(), transport.open()]);
  assert.equal(resultOf(await transport.call(message("1"), PATIENT)).received, 1);
  await transport.open();
  assert.equal(resultOf(await transport.call(message("2"), PATIENT)).received, 2);
});

test("close sends shutdown, and a worker that heeds it ends by itself with code 0", async (t) => {
  const transport = workerIn(t, "well");
  await transport.open();
  await transport.call(message("1"), PATIENT);
  await transport.close();
  assert.deepEqual(transport.exitStatus(), { code: 0, signal: null, forced: false });

  // The same when the caller has already had shutdown answered: it is not sent twice, the worker is just let go.
  const asked = workerIn(t, "well");
  await asked.open();
  assert.deepEqual(resultOf(await asked.call(message("9", "shutdown"), PATIENT)), {});
  await asked.close();
  assert.deepEqual(asked.exitStatus(), { code: 0, signal: null, forced: false });
});

test("close is safe twice, on a transport never opened, and while the command is still starting", async (t) => {
  const never = workerIn(t, "well");
  await Promise.all([never.close(), never.close()]);
  assert.equal(never.exitStatus(), null);

  const twice = workerIn(t, "well");
  await twice.open();
  assert.equal(twice.close(), twice.close());
  await twice.close();
  assert.equal(twice.exitStatus()?.code, 0);

  // Closed before open has finished: the process that was starting is ended, not left behind.
  const racing = workerIn(t, "well");
  const opening = racing.open();
  await racing.close();
  await opening;
  assert.notEqual(racing.exitStatus(), null);
  await assert.rejects(racing.call(message("1"), PATIENT), /call\(\) after close\(\)/);
});

test("a worker that heeds neither shutdown nor the end of its input is killed after the grace period", async (t) => {
  const transport = workerIn(t, "stubborn", { closeGraceMs: 150 });
  await transport.open();
  const pid = resultOf(await transport.call(message("1"), PATIENT)).pid as number;
  assert.equal(isRunning(pid), true);
  const started = performance.now();
  await transport.close();
  assert.ok(performance.now() - started >= 100, "the worker was given its grace period");
  assert.deepEqual(transport.exitStatus(), { code: null, signal: "SIGKILL", forced: true });
  assert.equal(isRunning(pid), false);
});

test("a worker's own child that keeps its pipes open does not keep the transport waiting", async (t) => {
  // The heir inherits the worker's standard output and error and lives for a minute after it.
  const endHeir = (pid: number): void => {
    if (isRunning(pid)) process.kill(pid, "SIGKILL");
  };
  const transport = workerIn(t, "heir", { drainMs: 100 });
  await transport.open();
  const heir = resultOf(await transport.call(message("1"), PATIENT)).heir as number;
  t.after(() => endHeir(heir));
  assert.equal(isRunning(heir), true);
  const started = performance.now();
  await transport.close();
  assert.ok(performance.now() - started < 10_000, "close waited for the worker, not for the worker's child");
  // The worker itself heeded shutdown: it was not killed, and its streams were let go once it had ended.
  assert.deepEqual(transport.exitStatus(), { code: 0, signal: null, forced: false });

  // A worker that dies before replying is found dead when it dies, not when its child lets go of the pipes.
  const crashing = workerIn(t, "heir-crash", { drainMs: 100 });
  await crashing.open();
  const error = await stdioError(crashing.call(message("1"), PATIENT), "exited");
  t.after(() => endHeir(Number(/^heir (\d+)$/m.exec(error.stderrTail)?.[1])));
  assert.match(
    error.message,
    /^stdio worker: the worker exited with code 3 before replying to hello; its log ends: heir /,
  );
  assert.deepEqual(crashing.exitStatus(), { code: 3, signal: null, forced: false });
});

test("close rejects the call that was waiting, and the calls queued behind it", async (t) => {
  const transport = workerIn(t, "hang", { closeGraceMs: 50 });
  await transport.open();
  const waiting = transport.call(message("1", "run"), PATIENT);
  const queued = transport.call(message("2"), PATIENT);
  const outcomes = Promise.allSettled([waiting, queued]);
  // Let the first message be written before the transport is closed under it.
  await new Promise((resolve) => setTimeout(resolve, 50));
  await transport.close();
  const [first, second] = await outcomes;
  assert.equal(first.status, "rejected");
  assert.equal(second.status, "rejected");
  assert.match(String((first as PromiseRejectedResult).reason), /stdio transport: closed before the reply to run/);
  assert.match(String((second as PromiseRejectedResult).reason), /stdio transport: call\(\) after close\(\)/);
  assert.equal(transport.exitStatus()?.forced, true);
});

test("no process outlives its transport, however it went, and no rejection is left unhandled", async (t) => {
  const unhandled: unknown[] = [];
  const note = (reason: unknown): void => void unhandled.push(reason);
  process.on("unhandledRejection", note);
  t.after(() => process.off("unhandledRejection", note));

  const pids: number[] = [];
  for (const mode of ["well", "hang", "stubborn", "garbage", "crash", "wrong-id", "flood"]) {
    const transport = createStdioTransport({
      command: [process.execPath, WORKER, mode],
      env: workerEnvironment(process.env, {}, { WORKER_ANNOUNCES_PID: "1" }),
      cwd: WORKER_DIR,
      closeGraceMs: 100,
    });
    await transport.open();
    // The reply, or the failure, of one call; then two more that nobody waits for before the transport is closed.
    // Only the worker that never answers is given little time: the others answer, or fail, as soon as they are up.
    const patience = mode === "hang" ? { timeoutMs: 300 } : PATIENT;
    const outcome: unknown = await transport.call(message("1"), patience).catch((reason: unknown) => reason);
    void transport.call(message("2"), patience).catch(() => undefined);
    void transport.call(message("3"), patience).catch(() => undefined);
    await transport.close();
    assert.notEqual(transport.exitStatus(), null, mode);
    // The worker's process id: in its reply when it gave one, else at the start of the log a failure carries.
    const announced = outcome instanceof StdioTransportError ? /^pid (\d+)/.exec(outcome.stderrTail)?.[1] : undefined;
    const pid = outcome instanceof Error ? Number(announced) : resultOf(outcome).pid;
    if (typeof pid === "number" && Number.isInteger(pid)) pids.push(pid);
  }
  assert.ok(pids.length >= 5, `process ids seen: ${pids.join(", ")}`);
  for (const pid of pids) assert.equal(isRunning(pid), false, `process ${pid}`);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(unhandled, []);
});
