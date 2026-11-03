// Collecting the answers of a file-exchange engine: each answer an operator left in the inbox is admitted exactly as
// a run admits an engine's answer (`askEngine`: negotiation, the store, the adapter's validation, the data check,
// the store write), and its job is then moved out of the way: to `collected/` once the answer is stored, to
// `rejected/` with the reason when it is not. This is the one place that moves anything in an exchange directory.
//
// Every move is a rename, in an order that a crash cannot spoil: the answer goes into its job directory first, and
// the job directory then goes whole to where it belongs. A job directory that holds an answer is therefore half
// moved, and the next collection finishes it before it reads the inbox.
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { join } from "node:path";

import { verifyCaseIdentity } from "../contract/case.ts";
import type { OpticalCase } from "../contract/case.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import { requestIdentity } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import type { EngineAdapter } from "../engines/adapter.ts";
import { writeFileAtomic } from "../core/atomicFile.ts";
import { askEngine } from "../core/orchestrator.ts";
import type { ResultStore } from "../core/resultStore.ts";
import { QUANTITIES } from "../quantities/index.ts";
import { EXCHANGE_FOLDERS, JOB_FILES, jobName } from "../transports/fileExchange.ts";

/** One answer refused, and why. */
export interface RejectedJob {
  readonly job: string;
  readonly reason: string;
}

/** What one collection of one engine did. Jobs are named in sorted order. */
export interface Collection {
  readonly engine: string;
  /** The jobs whose answers are in the store, moved to `collected/`. */
  readonly collected: readonly string[];
  /** The answers refused, moved to `rejected/` with their reasons. */
  readonly rejected: readonly RejectedJob[];
  /** The jobs still in `outbox` or `pending`, with no answer. */
  readonly pending: readonly string[];
}

/** What a collection of one engine is given. */
export interface CollectInput {
  /** The engine's exchange directory (`exchangeDirectory`). */
  readonly directory: string;
  /** The engine, which the caller made and closes. */
  readonly adapter: EngineAdapter;
  /** What its `describe()` gave. */
  readonly descriptor: EngineDescriptor;
  /** The result store of the configuration: where an admitted answer is kept. */
  readonly store: ResultStore;
  /** A store entry that cannot be trusted is said here, as in a run. */
  readonly warnings: string[];
}

/** What a job's name is, being a store key (`jobName`). */
const STORE_KEY = /^[0-9a-f]{64}$/;

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The entries of a directory that are neither hidden nor temporary, sorted; none for a directory not there. */
function entries(directory: string): string[] {
  let names: string[];
  try {
    names = readdirSync(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return names.filter((name) => !name.startsWith(".") && !name.endsWith(".tmp")).sort();
}

function isDirectory(path: string): boolean {
  return statSync(path, { throwIfNoEntry: false })?.isDirectory() ?? false;
}

/**
 * The first of `<name>`, `<name>.2`, `<name>.3` ... that is not in `parent`, or one that `reusable` accepts: a job
 * collected or refused before keeps its directory when the same job is handed over again.
 */
function slot(parent: string, name: string, reusable: (path: string) => boolean = () => false): string {
  for (let count = 1; ; count++) {
    const path = join(parent, count === 1 ? name : `${name}.${count}`);
    if (!existsSync(path) || reusable(path)) return path;
  }
}

/** The request and case of a job directory's message, or why there are none to admit an answer with. */
function readMessage(jobDirectory: string): { request: QuantityRequest; opticalCase: OpticalCase } | string {
  let message: unknown;
  try {
    message = JSON.parse(readFileSync(join(jobDirectory, JOB_FILES.message), "utf8"));
  } catch (error) {
    return `its job's ${JOB_FILES.message} cannot be read as JSON: ${reasonOf(error)}`;
  }
  const params = (message as { params?: { request?: unknown; case?: unknown } } | null)?.params;
  const requestIssues = validateKind("request", params?.request);
  if (requestIssues.length > 0) return `its job's message holds no valid request: ${formatIssues(requestIssues)}`;
  const caseIssues = validateKind("optical-case", params?.case);
  if (caseIssues.length > 0) return `its job's message holds no valid case: ${formatIssues(caseIssues)}`;
  const request = params!.request as QuantityRequest;
  const opticalCase = params!.case as OpticalCase;
  // The message is a file the operator can edit: a request whose content is not its id would be stored under the id
  // of another (the store refuses it, and would end the collection), a case whose content is not its id negotiated.
  const identity = requestIdentity(request);
  if (identity !== request.id) {
    return `its job's request states the id ${request.id}, but its content hashes to ${identity}`;
  }
  const mismatches = verifyCaseIdentity(opticalCase);
  if (mismatches.length > 0) {
    const [{ field, stated, derived }] = mismatches;
    const what = field === "features" ? "features" : field === "id" ? "the id" : "the system id";
    return `its job's case states ${what} ${stated}, but its content hashes to ${derived}`;
  }
  if (request.caseId !== opticalCase.id) {
    return `its job's request is about case ${request.caseId}, its case is ${opticalCase.id}`;
  }
  return { request, opticalCase };
}

/**
 * Collects the answers in one engine's exchange directory.
 *
 * 1. A job directory in `outbox` or `pending` that holds an answer was left half moved: with a reason it goes to
 *    `rejected/`; without one its answer was stored, and it goes to `collected/` when the store has it, or else its
 *    answer goes back to the inbox to be judged again.
 * 2. Each answer `inbox/<job>.json` is admitted with its job's request and case through `askEngine`, as a run
 *    admits an answer. One that is stored, or whose job the store answers already (`cached`), is collected: the
 *    answer moves into its job directory, which moves to `collected/<job>/`. Any other outcome is refused, and so is
 *    an answer without a job in `outbox` or `pending`, a job whose message is not a request and a case whose contents
 *    hash to their ids, and a job
 *    written for another version of the engine: `reason.txt` is written into the job directory (one made for an
 *    answer without a job), the answer moves in, and the directory moves to `rejected/<job>/`.
 * 3. A job left in `outbox` or `pending` whose answer the store holds already (one a run handed over again while a
 *    collection was moving it away) is collected without an answer of its own; the others are still pending.
 *
 * Collections of one exchange directory must not run at once: a second one's rename of a file the first has moved
 * fails, as store maintenance runs without concurrent writers.
 *
 * Throws only for what should not happen: a file system that refuses, an adapter that rejects where it must answer.
 */
export async function collectAnswers(input: CollectInput): Promise<Collection> {
  const { directory, adapter, descriptor, store, warnings } = input;
  const folder = (name: keyof typeof EXCHANGE_FOLDERS): string => join(directory, EXCHANGE_FOLDERS[name]);
  const inbox = folder("inbox");
  const collected: string[] = [];
  const rejected: RejectedJob[] = [];

  /** Moves a job directory, its answer in it, whole to `collected/` or `rejected/`. */
  const settle = (jobDirectory: string, job: string, into: "collected" | "rejected"): void => {
    mkdirSync(folder(into), { recursive: true });
    renameSync(jobDirectory, slot(folder(into), job));
  };
  const accept = (jobDirectory: string, job: string, answer: string): void => {
    // A reason left by a refusal that was cut short before its answer moved in is no longer true, and a job with a
    // reason and an answer is one being refused: it goes before the answer comes.
    rmSync(join(jobDirectory, JOB_FILES.reason), { force: true });
    renameSync(answer, join(jobDirectory, JOB_FILES.answer));
    settle(jobDirectory, job, "collected");
    collected.push(job);
  };
  const refuse = (jobDirectory: string, job: string, answer: string, reason: string): void => {
    writeFileAtomic(join(jobDirectory, JOB_FILES.reason), `${reason}\n`);
    renameSync(answer, join(jobDirectory, JOB_FILES.answer));
    settle(jobDirectory, job, "rejected");
    rejected.push({ job, reason });
  };
  /** An answer with no job: a directory of its own is made in `rejected/` for its reason, and it moves in. */
  const refuseAlone = (job: string, answer: string, reason: string): void => {
    const parent = folder("rejected");
    mkdirSync(parent, { recursive: true });
    // A directory a crash left with its reason and no answer is that answer's.
    const target = slot(
      parent,
      job,
      (path) => !existsSync(join(path, JOB_FILES.answer)) && !existsSync(join(path, JOB_FILES.message)),
    );
    if (!existsSync(target)) {
      const temporary = join(parent, `.${job}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`);
      try {
        writeFileAtomic(join(temporary, JOB_FILES.reason), `${reason}\n`);
        renameSync(temporary, target);
      } finally {
        rmSync(temporary, { recursive: true, force: true });
      }
    } else writeFileAtomic(join(target, JOB_FILES.reason), `${reason}\n`);
    renameSync(answer, join(target, JOB_FILES.answer));
    rejected.push({ job, reason });
  };

  // 1. What a collection that was ended left half moved.
  for (const where of ["outbox", "pending"] as const) {
    for (const job of entries(folder(where))) {
      const jobDirectory = join(folder(where), job);
      if (!isDirectory(jobDirectory) || !existsSync(join(jobDirectory, JOB_FILES.answer))) continue;
      if (existsSync(join(jobDirectory, JOB_FILES.reason))) {
        const reason = readFileSync(join(jobDirectory, JOB_FILES.reason), "utf8").trimEnd();
        settle(jobDirectory, job, "rejected");
        rejected.push({ job, reason });
      } else if (STORE_KEY.test(job) && store.has(job)) {
        settle(jobDirectory, job, "collected");
        collected.push(job);
      } else if (!existsSync(join(inbox, `${job}.json`))) {
        mkdirSync(inbox, { recursive: true });
        renameSync(join(jobDirectory, JOB_FILES.answer), join(inbox, `${job}.json`));
      }
    }
  }

  // 2. The answers.
  for (const name of entries(inbox).filter((entry) => entry.endsWith(".json"))) {
    const job = name.slice(0, -".json".length);
    const answer = join(inbox, name);
    const jobDirectory = [folder("outbox"), folder("pending")]
      .map((parent) => join(parent, job))
      .find((path) => isDirectory(path));
    if (jobDirectory === undefined) {
      const before = existsSync(join(folder("collected"), job)) ? "; a job of that name was collected before" : "";
      refuseAlone(
        job,
        answer,
        `no job ${job} is in ${EXCHANGE_FOLDERS.outbox} or ${EXCHANGE_FOLDERS.pending}${before}`,
      );
      continue;
    }
    const message = readMessage(jobDirectory);
    if (typeof message === "string") {
      refuse(jobDirectory, job, answer, message);
      continue;
    }
    const { request, opticalCase } = message;
    const expected = jobName(request, descriptor);
    if (expected !== job) {
      const reason =
        `the job was handed over to another version of engine ${descriptor.identity.id} than the one ` +
        `configured now (fingerprint ${descriptor.identity.fingerprint}), whose job of this request is ${expected}`;
      refuse(jobDirectory, job, answer, reason);
      continue;
    }
    const quantity = QUANTITIES.get(request.quantity);
    if (quantity === undefined) {
      refuse(jobDirectory, job, answer, `the comparator knows no quantity ${request.quantity}`);
      continue;
    }
    const admitted = await askEngine({ adapter, descriptor, quantity, request, opticalCase, store, warnings });
    const { result, storeKey, source } = admitted;
    if (storeKey !== null) {
      accept(jobDirectory, job, answer);
      continue;
    }
    const reason =
      source === "negotiated"
        ? `the engine as configured now does not answer the request: ${(result.unsupported ?? []).map((item) => item.message).join("; ")}`
        : result.status === "error"
          ? `${result.error?.code ?? "error"}: ${result.error?.message ?? ""}`
          : `the answer has status "${result.status}", which answers nothing`;
    refuse(jobDirectory, job, answer, reason);
  }

  // 3. What is still to be answered. A job the store answers already was handed over again by a run that missed the
  // store while a collection moved the job away: its work is done, and it is collected as it is.
  const pending: string[] = [];
  for (const parent of [folder("outbox"), folder("pending")]) {
    for (const job of entries(parent).filter((name) => isDirectory(join(parent, name)))) {
      if (STORE_KEY.test(job) && store.has(job)) {
        settle(join(parent, job), job, "collected");
        collected.push(job);
      } else pending.push(job);
    }
  }
  pending.sort();
  const byJob = (a: RejectedJob, b: RejectedJob): number => (a.job < b.job ? -1 : a.job > b.job ? 1 : 0);
  return { engine: descriptor.identity.id, collected: collected.sort(), rejected: rejected.sort(byJob), pending };
}
