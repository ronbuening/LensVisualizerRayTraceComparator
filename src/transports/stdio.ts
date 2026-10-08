// The stdio transport: an engine that is a worker process, spoken to in NDJSON. Each message is one line of JSON on
// the worker's standard input, and each reply one line of JSON on its standard output; its standard error is its
// log. The worker is started without a shell, in the environment it is given and nothing else.
//
// A worker that stops keeping its side (it exits, writes something that is no reply, or does not answer in time) is
// killed and stays gone: this transport starts its command once. Every call after that fails with the reason.
import { spawn } from "node:child_process";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { StringDecoder } from "node:string_decoder";

import type { JsonObject } from "../contract/json.ts";
import type { ProtocolRequest, ProtocolResponse } from "../contract/protocol.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { MAX_TIMER_MS, TransportTimeoutError } from "./transport.ts";
import type { Transport } from "./transport.ts";

/**
 * Why a stdio worker could not be used, or stopped being usable:
 *
 * - `spawn-failed`: its command did not start;
 * - `exited`: its process ended, by itself or by a signal, before it replied; also every call to a worker that is
 *   already gone, whatever made it go;
 * - `not-json`: it wrote a line that is not JSON;
 * - `oversized-line`: it wrote a line longer than the transport reads;
 * - `unexpected-reply`: it wrote JSON that is not an object carrying the id of the message waiting for a reply, or
 *   wrote a line when no message was waiting.
 *
 * After any of the last three the worker is killed: what it writes next could not be told from a reply.
 */
export const STDIO_ERROR_CODES = ["spawn-failed", "exited", "not-json", "oversized-line", "unexpected-reply"] as const;
/** One reason a stdio worker cannot be used. */
export type StdioErrorCode = (typeof STDIO_ERROR_CODES)[number];

/** How many lines of the worker's log an error message quotes. The whole tail is in `stderrTail`. */
const QUOTED_LOG_LINES = 3;

/** A stdio worker that could not be started, or that is no longer there to answer. */
export class StdioTransportError extends Error {
  /** Machine-readable; `message` says the same for people. */
  readonly code: StdioErrorCode;
  /** The last of what the worker wrote to its standard error before this, up to the transport's limit. */
  readonly stderrTail: string;

  constructor(code: StdioErrorCode, detail: string, stderrTail: string) {
    const lines = stderrTail.split(/\r?\n/).filter((line) => line.trim() !== "");
    const quoted = lines.slice(-QUOTED_LOG_LINES).join(" | ");
    super(`stdio worker: ${detail}${quoted === "" ? "" : `; its log ends: ${quoted}`}`);
    this.name = "StdioTransportError";
    this.code = code;
    this.stderrTail = stderrTail;
  }
}

/** How a worker process ended. */
export interface StdioExit {
  /** Its exit code, or null when a signal ended it. */
  readonly code: number | null;
  /** The signal that ended it, or null when it exited by itself. */
  readonly signal: NodeJS.Signals | null;
  /** Whether the transport killed it: after a timeout, a line that is no reply, or a `close()` it did not heed. */
  readonly forced: boolean;
}

/** A stdio transport: a `Transport`, and how its worker process ended. */
export interface StdioTransport extends Transport {
  readonly kind: "stdio";
  /** How the worker ended; null while it runs and when it was never started. */
  exitStatus(): StdioExit | null;
}

/** What a stdio transport is made from. */
export interface StdioTransportOptions {
  /** The worker's command line: the program, then its arguments. It is run as it is, without a shell. */
  readonly command: readonly string[];
  /** The worker's whole environment: nothing is inherited beside it. `workerEnvironment` builds the usual one. */
  readonly env: Readonly<Record<string, string>>;
  /** The worker's working directory. */
  readonly cwd: string;
  /** The longest reply line read, in bytes; a longer one is `oversized-line`. Default `DEFAULT_MAX_LINE_BYTES`. */
  readonly maxLineBytes?: number;
  /** How many characters of the worker's standard error are kept, the last ones. Default 8000. */
  readonly stderrTailChars?: number;
  /** How long `close()` waits for the worker to exit by itself before killing it, in milliseconds. Default 2000. */
  readonly closeGraceMs?: number;
  /**
   * How long the worker's standard output and error are still read once its process has ended, in milliseconds,
   * when something else holds them open: a process the worker started. Default 1000.
   */
  readonly drainMs?: number;
}

/** The longest reply line a stdio transport reads unless told otherwise: 256 MiB. */
export const DEFAULT_MAX_LINE_BYTES = 256 * 1024 * 1024;

/**
 * The variables a worker inherits from the comparator's own environment: what a program needs to be found and to
 * start, and no more. Everything else a worker needs is configured for it.
 */
export const INHERITED_VARIABLES = [
  "PATH",
  "Path",
  "PATHEXT",
  "SystemRoot",
  "HOME",
  "USERPROFILE",
  "TMPDIR",
  "TMP",
  "TEMP",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
] as const;

/** The environment variable in which a worker finds its engine's configured `options`, as JSON text. */
export const ENGINE_OPTIONS_VARIABLE = "LVRTC_ENGINE_OPTIONS";

/**
 * The environment of a worker, lowest precedence first:
 *
 * 1. the `INHERITED_VARIABLES` that `inherited` (the comparator's own environment) sets;
 * 2. `PYTHONDONTWRITEBYTECODE=1` and `PYTHONUNBUFFERED=1`, so that a Python worker writes no bytecode beside its
 *    sources and its replies are not held back in a buffer; they mean nothing to any other program;
 * 3. `LVRTC_ENGINE_OPTIONS`: the engine's configured `options` as canonical JSON, `{}` when it has none;
 * 4. `configured`: the definition's own `env`, which may replace any of the above.
 *
 * Nothing else is passed on, and nothing is guessed: a worker that needs `PYTHONPATH` gets it from `configured`.
 */
export function workerEnvironment(
  inherited: Readonly<Record<string, string | undefined>>,
  options: JsonObject,
  configured: Readonly<Record<string, string>>,
): Record<string, string> {
  const environment: Record<string, string> = {};
  for (const name of INHERITED_VARIABLES) {
    const value = inherited[name];
    if (value !== undefined) environment[name] = value;
  }
  environment.PYTHONDONTWRITEBYTECODE = "1";
  environment.PYTHONUNBUFFERED = "1";
  environment[ENGINE_OPTIONS_VARIABLE] = canonicalJson(options);
  return { ...environment, ...configured };
}

/** The message that is waiting for its reply. */
interface Pending {
  readonly id: string;
  readonly method: string;
  readonly resolve: (reply: ProtocolResponse) => void;
  readonly reject: (error: Error) => void;
  readonly timer: NodeJS.Timeout;
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function describeExit(exit: StdioExit): string {
  return exit.signal === null ? `exited with code ${exit.code}` : `was ended by ${exit.signal}`;
}

/**
 * A transport to a worker process that speaks the protocol as NDJSON on its standard streams.
 *
 * - `open()` starts the command, once however often it is called, without a shell, in `cwd` and with exactly `env`.
 *   It rejects with a `StdioTransportError` of code `spawn-failed` when the command does not start. A command that
 *   starts and exits at once is found by the first call.
 * - `call()` writes the message as one line and resolves to the line that answers it, parsed: a JSON object with
 *   the message's `id`. One message is under way at a time; calls made meanwhile wait their turn, in order. The
 *   time allowed starts when the message is written.
 * - A reply that does not come in time makes the call reject with a `TransportTimeoutError`, and the worker is
 *   killed. A worker that exits before replying, or writes a line that is not JSON, is too long, or is not the
 *   reply awaited, makes the call reject with a `StdioTransportError` whose code says which (`STDIO_ERROR_CODES`)
 *   and which carries the tail of the worker's standard error; the worker is killed if it still runs. Every later
 *   call rejects with code `exited` and the first reason.
 * - The worker's standard error is read all the time, so a worker that logs a great deal is never held up, and
 *   only its last `stderrTailChars` characters are kept.
 * - A worker is gone when its process has ended and its streams have been read to their end. A process the worker
 *   started may hold those streams open after it: they are then read for `drainMs` more and closed from this side,
 *   so neither a call nor `close()` waits for a process that is not the worker.
 * - `close()` asks a worker that still runs to end (a `shutdown` message, unless one was already answered, and the
 *   end of its input), waits `closeGraceMs` for it and then kills it. It resolves when the process has ended and
 *   its streams are closed, so no process outlives it. A call that was waiting rejects. Safe to call twice, and
 *   on a transport that was never opened.
 * - `call` rejects before `open` and after `close`. No call, and neither `open` nor `close`, leaves a rejection
 *   unhandled or throws outside its promise.
 */
export function createStdioTransport(options: StdioTransportOptions): StdioTransport {
  const { command, env, cwd } = options;
  const maxLineBytes = options.maxLineBytes ?? DEFAULT_MAX_LINE_BYTES;
  const stderrTailChars = options.stderrTailChars ?? 8000;
  const closeGraceMs = options.closeGraceMs ?? 2000;
  const drainMs = options.drainMs ?? 1000;

  let state: "new" | "open" | "closed" = "new";
  let child: ChildProcessWithoutNullStreams | undefined;
  let exit: StdioExit | null = null;
  let forced = false;
  /** Why the worker can answer nothing more; set once. */
  let gone: StdioTransportError | undefined;
  let pending: Pending | undefined;
  let shutdownAnswered = false;
  let queue: Promise<void> = Promise.resolve();
  let opening: Promise<void> | undefined;
  let closing: Promise<void> | undefined;
  let ended: Promise<void> = Promise.resolve();
  let stderrTail = "";
  /** The bytes of a line whose end has not been read yet. */
  let partial: Buffer[] = [];
  let partialBytes = 0;

  const kill = (): void => {
    if (child === undefined || exit !== null) return;
    // False when the process has already ended by itself and only its streams are still being read.
    if (child.kill("SIGKILL")) forced = true;
  };

  /** The worker broke the protocol: the waiting call fails with `error`, later ones with it too, and it is killed. */
  const broken = (code: StdioErrorCode, detail: string): void => {
    const error = new StdioTransportError(code, detail, stderrTail);
    gone ??= new StdioTransportError("exited", `the worker is gone: ${detail}`, stderrTail);
    const waiting = pending;
    pending = undefined;
    kill();
    if (waiting !== undefined) {
      clearTimeout(waiting.timer);
      waiting.reject(error);
    }
  };

  const onLine = (line: Buffer): void => {
    const waiting = pending;
    if (waiting === undefined) {
      broken("unexpected-reply", "the worker wrote a line when no message was waiting for a reply");
      return;
    }
    let reply: unknown;
    try {
      reply = JSON.parse(line.toString("utf8"));
    } catch {
      const start = JSON.stringify(line.subarray(0, 80).toString("utf8"));
      broken("not-json", `the worker wrote a line that is not JSON in reply to ${waiting.method}: ${start}`);
      return;
    }
    const id: unknown = typeof reply === "object" && reply !== null ? (reply as { id?: unknown }).id : undefined;
    if (id !== waiting.id) {
      const answered =
        typeof reply !== "object" || reply === null || Array.isArray(reply)
          ? "no message"
          : `message ${JSON.stringify(id)}`;
      broken("unexpected-reply", `the worker's line answers ${answered}, not message ${JSON.stringify(waiting.id)}`);
      return;
    }
    pending = undefined;
    clearTimeout(waiting.timer);
    if (waiting.method === "shutdown") shutdownAnswered = true;
    waiting.resolve(reply as ProtocolResponse);
  };

  const onStdout = (chunk: Buffer): void => {
    // What a worker writes after it broke the protocol, or after the transport was closed, answers nothing.
    if (gone !== undefined || state === "closed") return;
    let start = 0;
    for (;;) {
      const end = chunk.indexOf(0x0a, start);
      const piece = chunk.subarray(start, end === -1 ? chunk.length : end);
      if (partialBytes + piece.length > maxLineBytes) {
        partial = [];
        partialBytes = 0;
        broken("oversized-line", `the worker wrote a line longer than ${maxLineBytes} bytes`);
        return;
      }
      if (end === -1) {
        if (piece.length > 0) {
          partial.push(piece);
          partialBytes += piece.length;
        }
        return;
      }
      const line = partial.length === 0 ? piece : Buffer.concat([...partial, piece]);
      partial = [];
      partialBytes = 0;
      onLine(line);
      if (gone !== undefined) return;
      start = end + 1;
    }
  };

  const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
    exit = { code, signal, forced };
    const waiting = pending;
    pending = undefined;
    const detail = `the worker ${describeExit(exit)}`;
    gone ??= new StdioTransportError("exited", `${detail} and answers nothing more`, stderrTail);
    if (waiting !== undefined) {
      clearTimeout(waiting.timer);
      waiting.reject(new StdioTransportError("exited", `${detail} before replying to ${waiting.method}`, stderrTail));
    }
  };

  const start = async (): Promise<void> => {
    const failed = (error: unknown): StdioTransportError =>
      new StdioTransportError("spawn-failed", `the command ${command[0]} did not start: ${reasonOf(error)}`, "");
    let started: ChildProcessWithoutNullStreams;
    try {
      started = spawn(command[0], command.slice(1), {
        cwd,
        env: { ...env },
        stdio: ["pipe", "pipe", "pipe"],
        shell: false,
        windowsHide: true,
      });
    } catch (error) {
      throw failed(error);
    }
    await new Promise<void>((resolve, reject) => {
      started.once("spawn", resolve);
      started.once("error", (error) => reject(failed(error)));
    });
    // Only now is there a process to wait for: a command that did not start has no end to come.
    child = started;
    // A close() that came while the command was starting has closed the transport; it ends the process below.
    if (state === "new") state = "open";
    let draining: NodeJS.Timeout | undefined;
    ended = new Promise<void>((resolve) => {
      // "close" comes after the process has ended and its streams are read to the end, so the log is whole.
      started.once("close", (code, signal) => {
        clearTimeout(draining);
        onExit(code, signal);
        resolve();
      });
    });
    // The streams end with the process unless a process the worker started inherited them: "close" would then wait
    // for that one, however long it lives. What the worker wrote is in the pipes already, so they are closed here.
    started.once("exit", () => {
      draining = setTimeout(
        () => {
          started.stdout.destroy();
          started.stderr.destroy();
        },
        Math.min(drainMs, MAX_TIMER_MS),
      );
    });
    const decoder = new StringDecoder("utf8");
    started.stderr.on("data", (chunk: Buffer) => {
      stderrTail = (stderrTail + decoder.write(chunk)).slice(-stderrTailChars);
    });
    started.stdout.on("data", onStdout);
    // A worker that is gone closes its pipes, and writing to one fails; its end is reported by "close" above.
    for (const stream of [started.stdin, started.stdout, started.stderr]) stream.on("error", () => undefined);
    started.on("error", (error) => broken("exited", `the worker's process failed: ${reasonOf(error)}`));
  };

  const exchange = (request: ProtocolRequest, timeoutMs: number): Promise<ProtocolResponse> => {
    if (state === "closed") return Promise.reject(new Error("stdio transport: call() after close()"));
    if (gone !== undefined) return Promise.reject(gone);
    const worker = child;
    if (worker === undefined) return Promise.reject(new Error("stdio transport: call() before open()"));
    let text: string | undefined;
    try {
      text = JSON.stringify(request);
    } catch (error) {
      const problem = `stdio transport: the message cannot be written as JSON: ${reasonOf(error)}`;
      return Promise.reject(new Error(problem, { cause: error }));
    }
    if (text === undefined) {
      return Promise.reject(new Error(`stdio transport: the message is ${typeof request}, which is not JSON`));
    }
    const line = `${text}\n`;
    return new Promise<ProtocolResponse>((resolve, reject) => {
      const { id, method } = request;
      const timer = setTimeout(
        () => {
          pending = undefined;
          gone ??= new StdioTransportError(
            "exited",
            `the worker is gone: it was killed after no reply to ${method} within ${timeoutMs} ms`,
            stderrTail,
          );
          kill();
          reject(new TransportTimeoutError(method, timeoutMs));
        },
        Math.min(timeoutMs, MAX_TIMER_MS),
      );
      pending = { id, method, resolve, reject, timer };
      worker.stdin.write(line);
    });
  };

  const shutDown = async (): Promise<void> => {
    state = "closed";
    // A command that is still starting is let start, so that there is a process to end and none is left behind.
    await opening?.catch(() => undefined);
    const waiting = pending;
    pending = undefined;
    if (waiting !== undefined) {
      clearTimeout(waiting.timer);
      waiting.reject(new Error(`stdio transport: closed before the reply to ${waiting.method}`));
    }
    const worker = child;
    if (worker !== undefined && exit === null) {
      if (gone === undefined && !shutdownAnswered) {
        const message: ProtocolRequest = { contract: CONTRACT_VERSION, id: "close", method: "shutdown", params: {} };
        worker.stdin.write(`${JSON.stringify(message)}\n`);
      }
      // The end of its input ends a worker too, should it not have understood the message.
      worker.stdin.end();
      const timer = setTimeout(kill, Math.min(closeGraceMs, MAX_TIMER_MS));
      await ended;
      clearTimeout(timer);
    }
    await ended;
  };

  return {
    kind: "stdio",
    open: () => {
      if (state === "closed") return Promise.reject(new Error("stdio transport: open() after close()"));
      opening ??= start();
      return opening;
    },
    call: (request, { timeoutMs }) => {
      if (state !== "open") {
        const when = state === "new" ? "before open()" : "after close()";
        return Promise.reject(new Error(`stdio transport: call() ${when}`));
      }
      const turn = queue.then(() => exchange(request, timeoutMs));
      queue = turn.then(
        () => undefined,
        () => undefined,
      );
      return turn;
    },
    close: () => {
      closing ??= shutDown();
      return closing;
    },
    exitStatus: () => exit,
  };
}
