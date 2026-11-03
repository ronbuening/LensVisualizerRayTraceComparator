// The file-exchange transport: an engine that is a person, or a program a person runs, and that answers whenever
// they do. It cannot answer `hello` live, so its configured descriptor is the answer; a `run` hands the job over as
// files in an exchange directory and is answered `pending` until the operator's answer is there, which is then the
// reply, judged by the adapter as any engine's.
//
// The exchange directory of an engine is `<runsDir>/exchange/<engine id>/`:
//
// - `outbox/<job>/`: a job handed over: `message.json` (the `run` message, request and case), `job.json` (the
//   engine, the job, where to answer, the definition's options, the files), one file per prescription writer the
//   definition names, and `answer-template.json`;
// - `pending/<job>/`: where the operator moves a job they have taken; outbox and pending are alike to the comparator;
// - `inbox/<job>.json`: the operator's answer, one `result` envelope;
// - `collected/<job>/` and `rejected/<job>/`: where `lvrtc collect`, the one command that moves anything, puts a job
//   and its answer once the answer was stored, or refused.
//
// A job is named by its store key (`jobName`), so a job is the one answer the store will keep. Nothing under the
// exchange directory is committed: a case can carry a LensVisualizer prescription.
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, openSync, closeSync, fstatSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

import { engineStamp } from "../contract/engine.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import type { JsonObject } from "../contract/json.ts";
import type { ProtocolRequest, ProtocolResponse, RunParams } from "../contract/protocol.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { makeResult } from "../contract/result.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { writeFileAtomic } from "../core/atomicFile.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { storeKey } from "../core/resultStore.ts";
import type { PrescriptionWriterName } from "../exchange/names.ts";
import { PRESCRIPTION_WRITERS } from "../exchange/prescription.ts";
import { DEFAULT_MAX_LINE_BYTES } from "./stdio.ts";
import type { Transport } from "./transport.ts";

/** The directory below the runs directory that holds every file-exchange engine's directory. No suite is named so. */
export const EXCHANGE_DIRECTORY = "exchange";

/** The subdirectories of an engine's exchange directory. */
export const EXCHANGE_FOLDERS = {
  outbox: "outbox",
  pending: "pending",
  inbox: "inbox",
  collected: "collected",
  rejected: "rejected",
} as const;

/** The files of a job directory the comparator writes, beside one per prescription writer. */
export const JOB_FILES = {
  message: "message.json",
  job: "job.json",
  template: "answer-template.json",
  /** Written by `lvrtc collect`: the answer, moved into the job. */
  answer: "answer.json",
  /** Written by `lvrtc collect` into a job it refuses: why. */
  reason: "reason.txt",
} as const;

/** The exchange directory of the engine `engineId` under the runs directory `runsDir`. */
export function exchangeDirectory(runsDir: string, engineId: string): string {
  return join(runsDir, EXCHANGE_DIRECTORY, engineId);
}

/**
 * The name of the job that asks `request` of the engine `descriptor` describes: its store key (`storeKey`), the key
 * the store keeps the answer under. It is the request id with the engine's id, fingerprint, adapter revision and
 * the request's engine options: two jobs of one engine directory have one name only when they are one job.
 */
export function jobName(request: Pick<QuantityRequest, "id" | "engineOptions">, descriptor: EngineDescriptor): string {
  const { id, fingerprint, adapterRevision } = descriptor.identity;
  return storeKey({
    requestId: request.id,
    engineId: id,
    engineFingerprint: fingerprint,
    adapterRevision,
    engineOptions: request.engineOptions,
  });
}

/**
 * Why a run got no reply from the exchange directory:
 *
 * - `unreadable`: the answer file is there and cannot be read;
 * - `oversized-answer`: it is larger than the transport reads;
 * - `not-json`: it is not JSON.
 *
 * None ends the transport, and none moves the file: `lvrtc collect` refuses such an answer.
 */
export const FILE_EXCHANGE_ERROR_CODES = ["unreadable", "oversized-answer", "not-json"] as const;
/** One reason a run got no reply from the exchange directory. */
export type FileExchangeErrorCode = (typeof FILE_EXCHANGE_ERROR_CODES)[number];

/** An answer file that is no reply. */
export class FileExchangeError extends Error {
  readonly code: FileExchangeErrorCode;

  constructor(code: FileExchangeErrorCode, detail: string) {
    super(`file exchange: ${detail}`);
    this.name = "FileExchangeError";
    this.code = code;
  }
}

/** A file-exchange transport. */
export interface FileExchangeTransport extends Transport {
  readonly kind: "file-exchange";
}

/** What a file-exchange transport is made from. */
export interface FileExchangeTransportOptions {
  /** The engine's exchange directory (`exchangeDirectory`); made when the first job is handed over. */
  readonly directory: string;
  /** The descriptor the definition states: the answer to `hello`, which the adapter judges as any. */
  readonly descriptor: JsonObject;
  /** The prescription writers whose files each job carries, in this order. */
  readonly prescriptions: readonly PrescriptionWriterName[];
  /** The definition's options, handed to the operator in each job's `job.json`. */
  readonly options: JsonObject;
  /** The largest answer file read, in bytes; a larger one is `oversized-answer`. Default `DEFAULT_MAX_LINE_BYTES`. */
  readonly maxAnswerBytes?: number;
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** JSON text with two spaces of indentation and a newline, for the files a person reads. */
function readable(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/**
 * A transport to an engine that answers by files, when its operator does.
 *
 * - `open()` and `close()` start and end nothing: there is no process. `call` rejects before `open` and after
 *   `close`.
 * - `hello` is answered with the configured descriptor, `shutdown` with an empty object.
 * - `run`: when `inbox/<job>.json` is there, the reply is what it holds, parsed, whatever it is: the adapter judges
 *   it. A file that is unreadable, too large or not JSON rejects the call with a `FileExchangeError`. Otherwise the
 *   job is handed over, unless it is already in `outbox` or `pending`: its directory is written beside `outbox` and
 *   renamed into it whole, so an operator never sees half a job, and a second writer of the same job leaves the
 *   first's. The reply is then a result of status `pending`, stamped with the descriptor's engine, whose warning
 *   names the job. A prescription writer that cannot write the case rejects the call, and nothing is handed over.
 * - Nothing is ever moved or removed from the exchange directory: that is `lvrtc collect`'s alone.
 */
export function createFileExchangeTransport(options: FileExchangeTransportOptions): FileExchangeTransport {
  const { directory, descriptor, prescriptions } = options;
  const maxAnswerBytes = options.maxAnswerBytes ?? DEFAULT_MAX_LINE_BYTES;
  let state: "new" | "open" | "closed" = "new";

  const folder = (name: keyof typeof EXCHANGE_FOLDERS): string => join(directory, EXCHANGE_FOLDERS[name]);

  /** The parsed answer of `job`, or undefined when there is none. */
  const readAnswer = (job: string): unknown => {
    const file = join(folder("inbox"), `${job}.json`);
    let descriptorNumber: number;
    try {
      descriptorNumber = openSync(file, "r");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw new FileExchangeError("unreadable", `the answer inbox/${job}.json cannot be read: ${reasonOf(error)}`);
    }
    let bytes: Buffer;
    try {
      const { size } = fstatSync(descriptorNumber);
      if (size > maxAnswerBytes) {
        const detail = `the answer inbox/${job}.json has ${size} bytes, more than ${maxAnswerBytes}`;
        throw new FileExchangeError("oversized-answer", detail);
      }
      bytes = readFileSync(descriptorNumber);
    } catch (error) {
      if (error instanceof FileExchangeError) throw error;
      throw new FileExchangeError("unreadable", `the answer inbox/${job}.json cannot be read: ${reasonOf(error)}`);
    } finally {
      closeSync(descriptorNumber);
    }
    if (bytes.length > maxAnswerBytes) {
      const detail = `the answer inbox/${job}.json is longer than ${maxAnswerBytes} bytes`;
      throw new FileExchangeError("oversized-answer", detail);
    }
    try {
      return JSON.parse(bytes.toString("utf8"));
    } catch {
      const start = JSON.stringify(bytes.subarray(0, 80).toString("utf8"));
      throw new FileExchangeError("not-json", `the answer inbox/${job}.json is not JSON: ${start}`);
    }
  };

  /** Writes the job into `outbox` whole, unless it is there or in `pending`; says where it is. */
  const handOver = (
    job: string,
    params: RunParams,
    message: ProtocolRequest,
    identity: EngineDescriptor,
  ): "outbox" | "pending" => {
    for (const where of ["outbox", "pending"] as const) {
      if (existsSync(join(folder(where), job))) return where;
    }
    const { request, case: opticalCase } = params;
    // Every file is made before anything is written: a writer that cannot write the case hands nothing over.
    const files: [string, string][] = [
      // The message under the job's name, so that the file is the same whoever wrote it and whenever.
      [JOB_FILES.message, `${canonicalJson({ ...message, id: job })}\n`],
      ...prescriptions.map((name): [string, string] => {
        const writer = PRESCRIPTION_WRITERS[name];
        return [writer.file, writer.write(opticalCase, request)];
      }),
      [
        JOB_FILES.job,
        readable({
          engine: identity.identity.id,
          job,
          answer: `${EXCHANGE_FOLDERS.inbox}/${job}.json`,
          options: options.options,
          files: [
            JOB_FILES.message,
            ...prescriptions.map((name) => PRESCRIPTION_WRITERS[name].file),
            JOB_FILES.template,
          ],
        }),
      ],
      [JOB_FILES.template, readable(makeResult(request, engineStamp(identity.identity), { status: "ok", data: {} }))],
    ];
    const outbox = folder("outbox");
    mkdirSync(outbox, { recursive: true });
    const temporary = join(outbox, `.${job}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`);
    try {
      for (const [name, text] of files) writeFileAtomic(join(temporary, name), text);
      try {
        renameSync(temporary, join(outbox, job));
      } catch (error) {
        // Another writer handed the same job over first: its directory stands.
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== "EEXIST" && code !== "ENOTEMPTY") throw error;
      }
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
    return "outbox";
  };

  const run = (message: ProtocolRequest & { method: "run" }): ProtocolResponse => {
    // The adapter sends run only after hello was answered with a valid descriptor: this is that descriptor.
    const identity = descriptor as unknown as EngineDescriptor;
    const job = jobName(message.params.request, identity);
    const answer = readAnswer(job);
    if (answer !== undefined) return { contract: CONTRACT_VERSION, id: message.id, ok: true, result: answer as never };
    const where = handOver(job, message.params, message, identity);
    const warning =
      `job ${job} is in ${EXCHANGE_DIRECTORY}/${identity.identity.id}/${EXCHANGE_FOLDERS[where]}: ` +
      `answer it as ${EXCHANGE_FOLDERS.inbox}/${job}.json and run lvrtc collect`;
    const pending = makeResult(message.params.request, engineStamp(identity.identity), {
      status: "pending",
      diagnostics: { warnings: [warning], counts: {} },
    });
    return { contract: CONTRACT_VERSION, id: message.id, ok: true, result: pending };
  };

  return {
    kind: "file-exchange",
    open: async () => {
      if (state === "closed") throw new Error("file-exchange transport: open() after close()");
      state = "open";
    },
    call: async (request) => {
      if (state !== "open") {
        throw new Error(`file-exchange transport: call() ${state === "closed" ? "after close()" : "before open()"}`);
      }
      const answered = (result: unknown): ProtocolResponse =>
        ({ contract: CONTRACT_VERSION, id: request.id, ok: true, result }) as ProtocolResponse;
      if (request.method !== "run") return answered(request.method === "hello" ? descriptor : {});
      return run(request);
    },
    close: async () => {
      state = "closed";
    },
  };
}
