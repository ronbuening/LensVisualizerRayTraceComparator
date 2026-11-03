// The one-shot transport: an engine that is a program started once per message. The message is written as a request
// file, the program is started with the paths of that file and of the result file it is to write, and the reply is
// the result file it leaves when it exits with code 0. Its standard output and error are both its log: nothing it
// writes there is ever taken for a reply.
//
// Every call is a process of its own, so a call that fails ends nothing: the next call starts the program again. The
// files are made in a private directory under the system's temporary directory and removed when the call settles,
// whatever became of it, and the directory when the transport is closed: a case can carry a prescription, and none
// is left behind.
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { constants } from "node:fs";
import { access, mkdtemp, open as openFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { StringDecoder } from "node:string_decoder";

import type { ProtocolRequest, ProtocolResponse } from "../contract/protocol.ts";
import { writeFileAtomic } from "../core/atomicFile.ts";
import { DEFAULT_MAX_LINE_BYTES } from "./stdio.ts";
import { MAX_TIMER_MS, TransportTimeoutError } from "./transport.ts";
import type { Transport } from "./transport.ts";

/** The environment variable that names the request file a one-shot worker reads: an absolute path. */
export const REQUEST_FILE_VARIABLE = "LVRTC_REQUEST_FILE";
/** The environment variable that names the result file a one-shot worker writes: an absolute path. */
export const RESULT_FILE_VARIABLE = "LVRTC_RESULT_FILE";

/**
 * Why a call to a one-shot worker got no reply:
 *
 * - `spawn-failed`: the command did not start;
 * - `exited`: the process ended with a code other than 0, or by a signal; what it may have written as its result
 *   file is not read;
 * - `no-result`: the process exited with code 0 and left no result file;
 * - `not-json`: the result file is not JSON;
 * - `oversized-result`: the result file is larger than the transport reads.
 *
 * None of them ends the transport: the next call starts the command again.
 */
export const ONESHOT_ERROR_CODES = ["spawn-failed", "exited", "no-result", "not-json", "oversized-result"] as const;
/** One reason a call to a one-shot worker got no reply. */
export type OneshotErrorCode = (typeof ONESHOT_ERROR_CODES)[number];

/** How many lines of the worker's log an error message quotes. The whole tail is in `logTail`. */
const QUOTED_LOG_LINES = 3;

/** A call to a one-shot worker that got no reply. */
export class OneshotTransportError extends Error {
  /** Machine-readable; `message` says the same for people. */
  readonly code: OneshotErrorCode;
  /** The last of what the worker wrote to its standard output and error, up to the transport's limit. */
  readonly logTail: string;

  constructor(code: OneshotErrorCode, detail: string, logTail: string) {
    const lines = logTail.split(/\r?\n/).filter((line) => line.trim() !== "");
    const quoted = lines.slice(-QUOTED_LOG_LINES).join(" | ");
    super(`one-shot worker: ${detail}${quoted === "" ? "" : `; its log ends: ${quoted}`}`);
    this.name = "OneshotTransportError";
    this.code = code;
    this.logTail = logTail;
  }
}

/** A one-shot transport: a `Transport` whose every call is a process of its own. */
export interface OneshotTransport extends Transport {
  readonly kind: "oneshot";
}

/** What a one-shot transport is made from. */
export interface OneshotTransportOptions {
  /** The worker's command line: the program, then its arguments. It is run as it is, without a shell. */
  readonly command: readonly string[];
  /**
   * The worker's environment, but for `REQUEST_FILE_VARIABLE` and `RESULT_FILE_VARIABLE`, which each call adds:
   * nothing is inherited beside it. `workerEnvironment` (`stdio.ts`) builds the usual one.
   */
  readonly env: Readonly<Record<string, string>>;
  /** The worker's working directory. */
  readonly cwd: string;
  /** The largest result file read, in bytes; a larger one is `oversized-result`. Default `DEFAULT_MAX_LINE_BYTES`. */
  readonly maxResultBytes?: number;
  /** How many characters of the worker's log (standard output and error) are kept, the last ones. Default 8000. */
  readonly logTailChars?: number;
  /**
   * How long the worker's standard output and error are still read once its process has ended, in milliseconds,
   * when something else holds them open: a process the worker started. Default 1000.
   */
  readonly drainMs?: number;
  /** The directory in which `open()` makes the transport's private directory. Default the system's, `os.tmpdir()`. */
  readonly temporaryRoot?: string;
}

/** One call whose process may still run. */
interface Running {
  /** Kills the call's process, now or as soon as it has started. */
  readonly kill: () => void;
  /** Settles when the call has, its files removed. Never rejects. */
  readonly settled: Promise<void>;
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Why `name` cannot be started from `cwd` in the environment `env`, or undefined when it may be: the search a POSIX
 * spawn makes, done ahead of it. A name with a slash is a path from `cwd`; a bare name is looked for in the
 * directories of `env.PATH` (`/usr/bin:/bin` when it has none, as a spawn without one searches), an empty entry being
 * `cwd`. It may be started when one of them is a file that this process may execute. Only a refusal is certain: a
 * file found may still fail to start, and the call then says so. Nothing is decided on Windows, whose search adds
 * the extensions of `PATHEXT`.
 */
async function unstartable(
  name: string,
  env: Readonly<Record<string, string>>,
  cwd: string,
): Promise<string | undefined> {
  if (process.platform === "win32") return undefined;
  const candidates = name.includes("/")
    ? [resolve(cwd, name)]
    : (Object.hasOwn(env, "PATH") ? env.PATH : "/usr/bin:/bin")
        .split(":")
        .map((entry) => resolve(cwd, entry === "" ? "." : entry, name));
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) {
        await access(candidate, constants.X_OK);
        return undefined;
      }
    } catch {
      // Not there, or not executable: the next candidate.
    }
  }
  return name.includes("/")
    ? `the command ${name} cannot be started: ${candidates[0]} is not an executable file`
    : `the command ${name} cannot be started: no executable file of that name is on its PATH`;
}

/** How a process ended, as an error message says it. */
function describeExit(code: number | null, signal: NodeJS.Signals | null): string {
  return signal === null ? `exited with code ${code}` : `was ended by ${signal}`;
}

/**
 * A transport to a program that answers one protocol message per process.
 *
 * - `open()` makes the transport's private directory (`mkdtemp`, readable by its owner only) under `temporaryRoot`.
 *   It starts nothing, but rejects with `spawn-failed` when no executable file answers to the command's first word
 *   (`unstartable`); a command that is found and still does not start is found by a call.
 * - `call()` writes the message as one JSON document to a request file of its own in that directory, atomically,
 *   and starts the command, without a shell, in `cwd`, with exactly `env` and the absolute paths of the request
 *   file and of the result file to write (`REQUEST_FILE_VARIABLE`, `RESULT_FILE_VARIABLE`). Its standard input is
 *   not used. When the process exits with code 0 the call resolves to the result file, parsed: whatever JSON it
 *   holds, which the caller judges. Otherwise it rejects with a `OneshotTransportError` whose code says why
 *   (`ONESHOT_ERROR_CODES`) and which carries the tail of the worker's log. The time allowed starts when the call
 *   does; a process not ended by then is killed, and the call rejects with a `TransportTimeoutError` once it has
 *   ended. Calls may be made at once: each has its own process and files.
 * - Every file of a call, the worker's own temporary files beside its result included, is removed when the call
 *   settles. A call that failed ends nothing: the next starts a new process.
 * - The worker's standard output and error are read all the time and only the last `logTailChars` characters are
 *   kept. A process the worker started may hold them open after it: they are then read for `drainMs` more and
 *   closed from this side, so no call waits for a process that is not the worker.
 * - `close()` kills every process still running, waits for each to end, rejects the calls that were waiting and
 *   removes the directory. Safe to call twice, and on a transport that was never opened.
 * - `call` rejects before `open` and after `close`. No call, and neither `open` nor `close`, leaves a rejection
 *   unhandled or throws outside its promise.
 */
export function createOneshotTransport(options: OneshotTransportOptions): OneshotTransport {
  const { command, env, cwd } = options;
  const maxResultBytes = options.maxResultBytes ?? DEFAULT_MAX_LINE_BYTES;
  const logTailChars = options.logTailChars ?? 8000;
  const drainMs = options.drainMs ?? 1000;
  const temporaryRoot = options.temporaryRoot ?? tmpdir();

  let state: "new" | "open" | "closed" = "new";
  let directory: string | undefined;
  let opening: Promise<void> | undefined;
  let closing: Promise<void> | undefined;
  let calls = 0;
  const running = new Set<Running>();

  /** Removes every file of the call whose names start with `prefix`: its two files and any the worker left. */
  const removeFiles = async (where: string, prefix: string): Promise<void> => {
    const names = await readdir(where).catch(() => [] as string[]);
    await Promise.all(
      names.filter((name) => name.startsWith(prefix)).map((name) => rm(join(where, name), { force: true })),
    );
  };

  /** The reply the result file holds, or the error that says why there is none. */
  const readResult = async (path: string, method: string, logTail: string): Promise<ProtocolResponse> => {
    let handle;
    try {
      handle = await openFile(path, "r");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const detail = `the worker exited with code 0 and wrote no result file in reply to ${method}`;
        throw new OneshotTransportError("no-result", detail, logTail);
      }
      throw new OneshotTransportError("no-result", `its result file cannot be read: ${reasonOf(error)}`, logTail);
    }
    let bytes: Buffer;
    try {
      const { size } = await handle.stat();
      if (size > maxResultBytes) {
        const detail = `the worker wrote a result file of ${size} bytes in reply to ${method}, more than ${maxResultBytes}`;
        throw new OneshotTransportError("oversized-result", detail, logTail);
      }
      bytes = await handle.readFile();
    } finally {
      await handle.close();
    }
    // A file that grew after it was measured is still held to the bound.
    if (bytes.length > maxResultBytes) {
      const detail = `the worker wrote a result file longer than ${maxResultBytes} bytes in reply to ${method}`;
      throw new OneshotTransportError("oversized-result", detail, logTail);
    }
    try {
      return JSON.parse(bytes.toString("utf8")) as ProtocolResponse;
    } catch {
      const start = JSON.stringify(bytes.subarray(0, 80).toString("utf8"));
      const detail = `the worker wrote a result file that is not JSON in reply to ${method}: ${start}`;
      throw new OneshotTransportError("not-json", detail, logTail);
    }
  };

  const exchange = (request: ProtocolRequest, timeoutMs: number, where: string): Promise<ProtocolResponse> => {
    let text: string | undefined;
    try {
      text = JSON.stringify(request);
    } catch (error) {
      const problem = `oneshot transport: the message cannot be written as JSON: ${reasonOf(error)}`;
      return Promise.reject(new Error(problem, { cause: error }));
    }
    if (text === undefined) {
      return Promise.reject(new Error(`oneshot transport: the message is ${typeof request}, which is not JSON`));
    }
    const { method } = request;
    // The random part keeps two transports apart that were given one directory; the number keeps calls apart.
    const prefix = `call-${++calls}-${randomBytes(6).toString("hex")}`;
    const requestFile = join(where, `${prefix}.request.json`);
    const resultFile = join(where, `${prefix}.result.json`);

    let child: ChildProcess | undefined;
    let killed = false;
    const kill = (): void => {
      killed = true;
      if (child !== undefined && child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    };

    const reply = (async (): Promise<ProtocolResponse> => {
      try {
        writeFileAtomic(requestFile, `${text}\n`);
        let logTail = "";
        let timedOut = false;
        const ended = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
          const failed = (error: unknown): OneshotTransportError =>
            new OneshotTransportError(
              "spawn-failed",
              `the command ${command[0]} did not start: ${reasonOf(error)}`,
              "",
            );
          let started: ChildProcess;
          try {
            started = spawn(command[0], command.slice(1), {
              cwd,
              env: { ...env, [REQUEST_FILE_VARIABLE]: requestFile, [RESULT_FILE_VARIABLE]: resultFile },
              stdio: ["ignore", "pipe", "pipe"],
              shell: false,
              windowsHide: true,
            });
          } catch (error) {
            reject(failed(error));
            return;
          }
          child = started;
          let spawned = false;
          let draining: NodeJS.Timeout | undefined;
          const timer = setTimeout(
            () => {
              timedOut = true;
              kill();
            },
            Math.min(timeoutMs, MAX_TIMER_MS),
          );
          started.once("spawn", () => {
            spawned = true;
            // A close() that came while the command was starting kills it now that there is a process to kill.
            if (killed) started.kill("SIGKILL");
          });
          // Not "once": a process that started may still report a failure (of a signal), which must not go unheard.
          started.on("error", (error) => {
            if (spawned) return;
            clearTimeout(timer);
            reject(failed(error));
          });
          // Both streams are the log, kept as one tail in the order they were read.
          for (const stream of [started.stdout, started.stderr]) {
            if (stream === null) continue;
            const decoder = new StringDecoder("utf8");
            stream.on("data", (chunk: Buffer) => {
              logTail = (logTail + decoder.write(chunk)).slice(-logTailChars);
            });
            stream.on("error", () => undefined);
          }
          // The streams end with the process unless a process the worker started inherited them: "close" would then
          // wait for that one. What the worker wrote is in the pipes already, so they are closed here.
          started.once("exit", () => {
            draining = setTimeout(
              () => {
                started.stdout?.destroy();
                started.stderr?.destroy();
              },
              Math.min(drainMs, MAX_TIMER_MS),
            );
          });
          // "close" comes after the process has ended and its streams are read to the end, so the log is whole.
          started.once("close", (code, signal) => {
            clearTimeout(timer);
            clearTimeout(draining);
            if (spawned) resolve({ code, signal });
          });
        });
        if (timedOut) throw new TransportTimeoutError(method, timeoutMs);
        if (state === "closed") throw new Error(`oneshot transport: closed before the reply to ${method}`);
        if (ended.code !== 0 || ended.signal !== null) {
          const how = describeExit(ended.code, ended.signal);
          const detail = `the worker ${how} in reply to ${method}; its result file is not read`;
          throw new OneshotTransportError("exited", detail, logTail);
        }
        return await readResult(resultFile, method, logTail);
      } finally {
        await removeFiles(where, prefix);
      }
    })();
    // Everything up to the start of the process ran before this line, so a close() finds the call here. The entry is
    // let go when the call has settled, whichever way; the call's own promise is the caller's.
    const entry: Running = {
      kill,
      settled: reply.then(
        () => undefined,
        () => undefined,
      ),
    };
    running.add(entry);
    void entry.settled.then(() => running.delete(entry));
    return reply;
  };

  const shutDown = async (): Promise<void> => {
    state = "closed";
    await opening?.catch(() => undefined);
    for (const entry of running) entry.kill();
    await Promise.all([...running].map((entry) => entry.settled));
    if (directory !== undefined) await rm(directory, { recursive: true, force: true });
  };

  return {
    kind: "oneshot",
    open: () => {
      if (state === "closed") return Promise.reject(new Error("oneshot transport: open() after close()"));
      opening ??= (async () => {
        // A command that cannot be started is found here, as a stdio transport finds it by starting it: the engine
        // is then unavailable as spawn-failed, not as an engine that did not answer hello.
        const problem = await unstartable(command[0], env, cwd);
        if (problem !== undefined) throw new OneshotTransportError("spawn-failed", problem, "");
        // mkdtemp makes the directory readable, writable and searchable by its owner only.
        const made = await mkdtemp(join(temporaryRoot, "lvrtc-oneshot-"));
        directory = made;
        // A close() that came while the directory was being made has closed the transport; it removes it.
        if (state === "new") state = "open";
      })();
      return opening;
    },
    call: (request, { timeoutMs }) => {
      if (state !== "open" || directory === undefined) {
        const when = state === "closed" ? "after close()" : "before open()";
        return Promise.reject(new Error(`oneshot transport: call() ${when}`));
      }
      return exchange(request, timeoutMs, directory);
    },
    close: () => {
      closing ??= shutDown();
      return closing;
    },
  };
}
