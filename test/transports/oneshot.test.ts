// The one-shot transport against a small Node worker (test/fixtures/oneshot-worker/worker.mjs) that answers one
// message per process, well or, by its mode, badly in one particular way. Nothing here needs Python or an engine.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import type { ProtocolRequest } from "../../src/contract/protocol.ts";
import {
  ONESHOT_ERROR_CODES,
  OneshotTransportError,
  REQUEST_FILE_VARIABLE,
  RESULT_FILE_VARIABLE,
  createOneshotTransport,
} from "../../src/transports/oneshot.ts";
import type { OneshotErrorCode, OneshotTransport, OneshotTransportOptions } from "../../src/transports/oneshot.ts";
import { ENGINE_OPTIONS_VARIABLE, workerEnvironment } from "../../src/transports/stdio.ts";
import { TransportTimeoutError } from "../../src/transports/transport.ts";
import { tempDir } from "../core/support.ts";

const WORKER = fileURLToPath(new URL("../fixtures/oneshot-worker/worker.mjs", import.meta.url));
const WORKER_DIR = fileURLToPath(new URL("../fixtures/oneshot-worker", import.meta.url));
/** Long enough for a child process to start on a loaded machine; a test that passes never waits for it. */
const PATIENT = { timeoutMs: 30_000 };

/** A transport to the fixture worker in one mode, its directory made under a temporary directory of the test. */
function workerIn(
  t: TestContext,
  mode: string,
  options: Partial<OneshotTransportOptions> = {},
): { transport: OneshotTransport; root: string } {
  const root = tempDir(t);
  const transport = createOneshotTransport({
    command: [process.execPath, WORKER, mode],
    env: workerEnvironment(process.env, {}, {}),
    cwd: WORKER_DIR,
    temporaryRoot: root,
    ...options,
  });
  t.after(() => transport.close());
  return { transport, root };
}

/** A message with this id; the worker does not care what else it holds. */
function message(id: string, method: string = "hello", params: unknown = {}): ProtocolRequest {
  return { contract: "1.0", id, method, params } as ProtocolRequest;
}

/** The `result` of a reply, as the fixture worker wrote it. */
function resultOf(reply: unknown): Record<string, unknown> {
  return (reply as { result: Record<string, unknown> }).result;
}

/** The files and directories directly in `directory`. */
function entries(directory: string): string[] {
  return readdirSync(directory).sort();
}

/** The one directory the transport made under `root`, or undefined before `open()` and after `close()`. */
function exchangeDirectory(root: string): string | undefined {
  const made = entries(root);
  assert.ok(made.length <= 1, made.join(", "));
  return made.length === 0 ? undefined : join(root, made[0]);
}

/** The `OneshotTransportError` that `work` rejects with, checked for its code. */
async function oneshotError(work: Promise<unknown>, code: OneshotErrorCode): Promise<OneshotTransportError> {
  const error: unknown = await work.then(
    () => assert.fail(`expected a ${code} error`),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof OneshotTransportError, String(error));
  assert.equal(error.code, code, error.message);
  assert.equal(error.name, "OneshotTransportError");
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

/** The process id a worker wrote to `file`, once it has. */
async function pidIn(file: string): Promise<number> {
  for (let tries = 0; tries < 3000 && !existsSync(file); tries++) await delay(10);
  return Number(readFileSync(file, "utf8"));
}

// ── A worker that behaves ────────────────────────────────────────────────────────────────────────────────────────

test("a message goes out as a request file and the reply comes back from the result file, parsed", async (t) => {
  const { transport } = workerIn(t, "well");
  assert.equal(transport.kind, "oneshot");
  await transport.open();
  const params = { text: 'é ☃ 😀 "quoted" \\ line\nbreak', numbers: [1, -0.5, 1e-300], nested: { a: null } };
  const sent = message("m-1", "run", params);
  const reply = await transport.call(sent, PATIENT);
  assert.deepEqual({ ...reply, result: undefined }, { contract: "1.0", id: "m-1", ok: true, result: undefined });
  const result = resultOf(reply);
  assert.deepEqual(result.params, params);
  assert.equal(result.method, "run");
  // The request file holds the text a stdio worker would get as its line: one JSON document and a newline.
  assert.equal(result.requestText, `${JSON.stringify(sent)}\n`);
  // Standard input is not used: the worker reads nothing there.
  assert.equal(result.stdin, "");
  // Every call is a process of its own.
  assert.equal(resultOf(await transport.call(message("m-2"), PATIENT)).method, "hello");
});

test("the worker runs without a shell, in its directory, with its environment and the two file paths", async (t) => {
  const cwd = tempDir(t);
  const root = tempDir(t);
  const env = {
    ...workerEnvironment({ PATH: process.env.PATH }, { id: "w", bias: 0.5 }, { MODE: "test" }),
    ONLY_THIS: "$HOME `id` ; echo",
  };
  const transport = createOneshotTransport({
    command: [process.execPath, WORKER, "well", "a b", "$HOME", "*"],
    env,
    cwd,
    temporaryRoot: root,
  });
  t.after(() => transport.close());
  await transport.open();
  const directory = exchangeDirectory(root);
  assert.ok(directory !== undefined);
  // Readable, writable and searchable by its owner only: a case can carry a prescription.
  assert.equal(statSync(directory).mode & 0o777, 0o700);

  const result = resultOf(await transport.call(message("1"), PATIENT));
  // Arguments arrive as they were written: nothing splits, expands or globs them.
  assert.deepEqual(result.argv, ["well", "a b", "$HOME", "*"]);
  assert.equal(result.cwd, cwd);
  const seen = result.env as Record<string, string>;
  for (const [name, value] of Object.entries(env)) assert.equal(seen[name], value, name);
  assert.equal(seen[ENGINE_OPTIONS_VARIABLE], '{"bias":0.5,"id":"w"}');
  assert.equal(seen.MODE, "test");
  // The two files are absolute paths in the transport's own directory, a pair of the call's own.
  const [requestFile, resultFile] = [seen[REQUEST_FILE_VARIABLE], seen[RESULT_FILE_VARIABLE]];
  assert.equal(REQUEST_FILE_VARIABLE, "LVRTC_REQUEST_FILE");
  assert.equal(RESULT_FILE_VARIABLE, "LVRTC_RESULT_FILE");
  assert.ok(isAbsolute(requestFile) && isAbsolute(resultFile));
  assert.equal(dirname(requestFile), directory);
  assert.equal(dirname(resultFile), directory);
  assert.notEqual(requestFile, resultFile);
  // What this process has and the worker was not given, the worker does not have.
  for (const name of ["HOME", "USER", "NODE_OPTIONS", "LVRTC_RUNS_DIR"]) assert.equal(seen[name], undefined, name);
  // But for what the system itself sets in every process (macOS: `__CF_USER_TEXT_ENCODING`).
  const names = Object.keys(seen)
    .filter((name) => !name.startsWith("__CF_"))
    .sort();
  assert.deepEqual(names, [...Object.keys(env), REQUEST_FILE_VARIABLE, RESULT_FILE_VARIABLE].sort());

  const again = resultOf(await transport.call(message("2"), PATIENT)).env as Record<string, string>;
  assert.notEqual(again[REQUEST_FILE_VARIABLE], requestFile);
  assert.notEqual(again[RESULT_FILE_VARIABLE], resultFile);
});

test("the transport's directory is under the system's temporary directory unless it is told another", async (t) => {
  const transport = createOneshotTransport({
    command: [process.execPath, WORKER, "well"],
    env: workerEnvironment(process.env, {}, {}),
    cwd: WORKER_DIR,
  });
  t.after(() => transport.close());
  await transport.open();
  const seen = resultOf(await transport.call(message("1"), PATIENT)).env as Record<string, string>;
  const directory = dirname(seen[REQUEST_FILE_VARIABLE]);
  assert.equal(dirname(directory), tmpdir());
  assert.match(directory, /lvrtc-oneshot-/);
  assert.deepEqual(entries(directory), []);
  await transport.close();
  assert.equal(existsSync(directory), false);
});

test("what the worker writes on its standard output is its log and never the reply", async (t) => {
  const { transport } = workerIn(t, "noisy");
  await transport.open();
  const reply = await transport.call(message("n-1"), PATIENT);
  assert.deepEqual(reply, { contract: "1.0", id: "n-1", ok: true, result: { from: "file" } });
});

test("a call's files are removed when it settles, whatever became of it, and the directory on close", async (t) => {
  const { transport, root } = workerIn(t, "per-message");
  assert.deepEqual(entries(root), []);
  await transport.open();
  const directory = exchangeDirectory(root);
  assert.ok(directory !== undefined);
  assert.deepEqual(entries(directory), []);

  await transport.call(message("1", "hello", { mode: "well" }), PATIENT);
  assert.deepEqual(entries(directory), []);
  // A worker that fails after leaving temporary files beside its result: they go with the call's own two.
  await oneshotError(transport.call(message("2", "hello", { mode: "litter" }), PATIENT), "exited");
  assert.deepEqual(entries(directory), []);
  await oneshotError(transport.call(message("3", "hello", { mode: "answer-then-crash" }), PATIENT), "exited");
  assert.deepEqual(entries(directory), []);
  await assert.rejects(
    transport.call(message("4", "hello", { mode: "hang" }), { timeoutMs: 200 }),
    TransportTimeoutError,
  );
  assert.deepEqual(entries(directory), []);

  await transport.close();
  assert.deepEqual(entries(root), []);
  await transport.close();
});

// ── Calls that get no reply ──────────────────────────────────────────────────────────────────────────────────────

test("every way a call can get no reply has a code, and none of them ends the transport", async (t) => {
  const { transport } = workerIn(t, "per-message", { maxResultBytes: 100_000 });
  await transport.open();
  const ask = (mode: string, more: Record<string, unknown> = {}): Promise<unknown> =>
    transport.call(message(`ask-${mode}`, "run", { mode, ...more }), PATIENT);
  const seen = new Set<OneshotErrorCode>();
  const failing = async (mode: string, code: OneshotErrorCode, more?: Record<string, unknown>) => {
    const error = await oneshotError(ask(mode, more), code);
    seen.add(code);
    // A failed call does not stop the next: a new process answers it.
    assert.equal(resultOf(await ask("well")).method, "run");
    return error;
  };

  const crashed = await failing("crash", "exited");
  assert.match(crashed.message, /the worker exited with code 3 in reply to run; its result file is not read/);
  // The log is quoted: its last lines, and the whole tail beside.
  assert.match(crashed.message, /its log ends: .*RuntimeError: boom$/);
  assert.match(crashed.logTail, /^pid \d+\nTraceback/);

  // A whole result file is not read when the worker said it failed.
  const regretted = await failing("answer-then-crash", "exited");
  assert.match(regretted.message, /exited with code 4/);
  const signalled = await failing("signal", "exited");
  assert.match(signalled.message, /the worker was ended by SIGTERM in reply to run/);

  const silent = await failing("no-result", "no-result");
  assert.match(silent.message, /exited with code 0 and wrote no result file in reply to run/);
  // Standard output is log as much as standard error.
  assert.match(silent.logTail, /nothing to say/);

  const garbage = await failing("garbage", "not-json");
  assert.match(garbage.message, /a result file that is not JSON in reply to run: "this is not json"/);
  assert.match(garbage.message, /its log ends: .*about to write nonsense$/);
  await failing("partial", "not-json");

  const large = await failing("oversized", "oversized-result", { bytes: 200_000 });
  assert.match(large.message, /a result file of \d+ bytes in reply to run, more than 100000/);
  // Just under the bound is read.
  assert.equal(((await ask("oversized", { bytes: 90_000 })) as { ok: boolean }).ok, true);

  // A command that was there when the transport opened and is gone when a call starts it.
  const vanishing = join(tempDir(t), "vanishing-worker");
  writeFileSync(vanishing, "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  const missing = createOneshotTransport({
    command: [vanishing],
    env: workerEnvironment(process.env, {}, {}),
    cwd: WORKER_DIR,
    temporaryRoot: tempDir(t),
  });
  t.after(() => missing.close());
  await missing.open();
  rmSync(vanishing);
  const unstarted = await oneshotError(missing.call(message("1"), PATIENT), "spawn-failed");
  assert.match(unstarted.message, /the command .*vanishing-worker did not start/);
  seen.add("spawn-failed");
  // And again by the next.
  await oneshotError(missing.call(message("2"), PATIENT), "spawn-failed");

  assert.deepEqual([...seen].sort(), [...ONESHOT_ERROR_CODES].sort());
});

test("open() refuses a command that no executable file answers to, as spawn-failed, and makes no directory", async (t) => {
  const opened = async (command: string, env: Record<string, string>): Promise<OneshotTransportError> => {
    const root = tempDir(t);
    const transport = createOneshotTransport({ command: [command], env, cwd: WORKER_DIR, temporaryRoot: root });
    t.after(() => transport.close());
    const error = await oneshotError(transport.open(), "spawn-failed");
    assert.deepEqual(entries(root), []);
    await assert.rejects(transport.call(message("1"), PATIENT), /oneshot transport: call\(\) before open\(\)/);
    return error;
  };
  const absent = join(tempDir(t), "no-such-worker");
  const byPath = await opened(absent, workerEnvironment(process.env, {}, {}));
  assert.match(byPath.message, /the command .*no-such-worker cannot be started: .* is not an executable file$/);
  // A file that is there but may not be executed is no command either.
  const plain = join(tempDir(t), "plain-file");
  writeFileSync(plain, "#!/bin/sh\nexit 0\n", { mode: 0o644 });
  await opened(plain, workerEnvironment(process.env, {}, {}));
  // A bare name is looked for on the worker's PATH, not the comparator's.
  const bin = tempDir(t);
  writeFileSync(join(bin, "only-here"), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  const byName = await opened("only-here", { PATH: tempDir(t) });
  assert.match(
    byName.message,
    /the command only-here cannot be started: no executable file of that name is on its PATH/,
  );
  const found = createOneshotTransport({
    command: ["only-here"],
    env: { PATH: bin },
    cwd: WORKER_DIR,
    temporaryRoot: tempDir(t),
  });
  t.after(() => found.close());
  await found.open();
});

test("a call not answered in time kills its process and rejects with a TransportTimeoutError", async (t) => {
  const { transport } = workerIn(t, "per-message");
  await transport.open();
  const pidFile = join(tempDir(t), "pid");
  const started = Date.now();
  const error: unknown = await transport
    .call(message("slow", "run", { mode: "hang", pidFile }), { timeoutMs: 300 })
    .then(
      () => assert.fail("expected a timeout"),
      (reason: unknown) => reason,
    );
  assert.ok(error instanceof TransportTimeoutError, String(error));
  assert.equal(error.timeoutMs, 300);
  assert.equal(error.message, "no reply to run within 300 ms");
  assert.ok(Date.now() - started >= 300);
  // The call rejects once its process has ended.
  assert.equal(isRunning(await pidIn(pidFile)), false);
  // The next call is a new process.
  assert.equal(resultOf(await transport.call(message("next", "hello", { mode: "well" }), PATIENT)).method, "hello");
});

test("calls may be under way at once, each with its own process and files", async (t) => {
  const { transport } = workerIn(t, "per-message");
  await transport.open();
  const directory = tempDir(t);
  // Each worker answers only once the other has started: were the calls one after the other, neither would answer.
  const ask = (me: string, other: string) =>
    transport.call(message(me, "run", { mode: "rendezvous", directory, me, other }), PATIENT);
  const [first, second] = await Promise.all([ask("a", "b"), ask("b", "a")]);
  assert.equal(resultOf(first).me, "a");
  assert.equal(resultOf(second).me, "b");
  assert.notEqual(resultOf(first).pid, resultOf(second).pid);
});

// ── Opening and closing ──────────────────────────────────────────────────────────────────────────────────────────

test("close() kills a process still running, rejects its call and removes the directory", async (t) => {
  const { transport, root } = workerIn(t, "per-message");
  await transport.open();
  const pidFile = join(tempDir(t), "pid");
  const waiting = transport.call(message("long", "run", { mode: "hang", pidFile }), PATIENT);
  const pid = await pidIn(pidFile);
  assert.equal(isRunning(pid), true);
  await transport.close();
  await assert.rejects(waiting, /oneshot transport: closed before the reply to run/);
  assert.equal(isRunning(pid), false);
  assert.deepEqual(entries(root), []);
});

test("call() before open() and after close() rejects; close() is safe twice and on a transport never opened", async (t) => {
  const { transport, root } = workerIn(t, "well");
  await assert.rejects(transport.call(message("1"), PATIENT), /oneshot transport: call\(\) before open\(\)/);
  // open() makes only the directory: nothing is started, and opening twice makes one.
  await Promise.all([transport.open(), transport.open()]);
  assert.equal(entries(root).length, 1);
  await transport.close();
  await transport.close();
  assert.deepEqual(entries(root), []);
  await assert.rejects(transport.call(message("2"), PATIENT), /oneshot transport: call\(\) after close\(\)/);
  await assert.rejects(transport.open(), /oneshot transport: open\(\) after close\(\)/);

  const unopened = workerIn(t, "well");
  await unopened.transport.close();
  await unopened.transport.close();
  assert.deepEqual(entries(unopened.root), []);
});

test("a message that cannot be written as JSON is refused before anything is started", async (t) => {
  const { transport, root } = workerIn(t, "well");
  await transport.open();
  const directory = exchangeDirectory(root);
  assert.ok(directory !== undefined);
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  await assert.rejects(transport.call(message("1", "run", cyclic), PATIENT), /cannot be written as JSON/);
  assert.deepEqual(entries(directory), []);
});
