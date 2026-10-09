// The output of one run of a suite: `<runsDir>/<suite name>/manifest.json` and the cases beside it.
//
// The manifest is an index, not a record of an execution. It says what was asked of which engine, how each job
// ended and where the answer is kept, and nothing about when, how long or whether the answer was computed or found
// in the store, so that two runs of one suite against the same engines write the same bytes. It holds codes and
// never an engine's or the system's own words, which may name files or times; those are for the console.
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { caseInvariantProblems, verifyCaseIdentity } from "../contract/case.ts";
import type { OpticalCase } from "../contract/case.ts";
import type { EngineDetails, ResultStatus, UnsupportedItem } from "../contract/result.ts";
import { validateKind } from "../contract/schemas.ts";
import { isCompatibleContract } from "../contract/version.ts";
import type { EngineUnavailableCode } from "../engines/adapter.ts";
import { writeFileAtomic } from "./atomicFile.ts";
import type { MtfRecipeResolution } from "./mtfRecipe.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";
import { UsageError } from "./usageError.ts";

/** The manifest's file name, inside the run directory. */
export const MANIFEST_FILE = "manifest.json";
/** The directory, inside the run directory, that holds each case of the run as `<case id>.json`. */
export const CASES_DIRECTORY = "cases";

/**
 * An engine the run turned to: who it said it was, or the code of why it could not be used
 * (`ENGINE_UNAVAILABLE_CODES`). `version` and `details` are the engine's own, for people; results are keyed by
 * `fingerprint` and, for an engine that states one, by `adapterRevision`: the hash of the comparator's own code
 * behind the engine.
 */
export type ManifestEngine =
  | {
      readonly id: string;
      readonly status: "available";
      readonly version: string;
      readonly fingerprint: string;
      readonly adapterRevision?: string;
      readonly details: EngineDetails;
    }
  | { readonly id: string; readonly status: "unavailable"; readonly code: EngineUnavailableCode };

/** What `ManifestSource.status` says when a case source's inputs changed between its first case and the end. */
export const SOURCE_CHANGED = "source-changed-during-run";

/**
 * A case source the run's cases were built from, when the source has something to identify (`CaseSource.audit`):
 * what its inputs were, and whether they were still that when the run ended. A changed source means the cases, and
 * whatever an engine in this process computed from the same files, may not be those of one state of the source.
 */
export interface ManifestSource {
  /** The source's own identification of its inputs: content hashes and the like, never a path or a time. */
  readonly fingerprint: EngineDetails;
  readonly status: "unchanged" | typeof SOURCE_CHANGED;
}

/** The ray sets that were generated for one run. */
export interface ManifestRaySets {
  /**
   * The identity of each set, in the order the source gave them: the SHA-256 of the canonical JSON of its
   * `rays.trace` spec (`raySetId`). The rays themselves are in the requests of the store, never here.
   */
  readonly sets: readonly string[];
  /** What kept a field of the run from having rays, each as `<code>: <message>`; it fails nothing. */
  readonly problems: readonly string[];
}

/** One run of the suite: the case it was run on, or why it was not run. */
export interface ManifestRun {
  readonly name: string;
  /** The `id` of the run's case, which `cases/<id>.json` holds; null for a run that could not be started. */
  readonly caseId: string | null;
  /** What kept the run from starting; empty for a run that has a case. */
  readonly problems: readonly string[];
  /** The engine the run asks the others to be compared against (its `referenceEngine`), when it names one. */
  readonly referenceEngine?: string;
  /** The ray sets of the run; stated exactly when a rung that traces rays was run on it. */
  readonly raySets?: ManifestRaySets;
  /**
   * The MTF recipe of the run (`src/core/mtfRecipe.ts`), or why it has none; stated exactly when a rung that needs
   * a recipe was run on it.
   */
  readonly recipe?: MtfRecipeResolution;
}

/** One request asked of one engine for one run, and how that ended. */
export interface ManifestJob {
  readonly run: string;
  readonly caseId: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  readonly engine: string;
  readonly status: ResultStatus;
  /**
   * The key of the store entry that holds the request and the engine's result; null when nothing was stored: an
   * "error", a "pending" job, and an "unsupported" that was decided from the engine's descriptor without asking it.
   */
  readonly storeKey: string | null;
  /** With status "unsupported": what the engine cannot do, without the message. */
  readonly unsupported?: readonly Pick<UnsupportedItem, "code" | "item">[];
  /** With status "error": the code of the failure, without the message. */
  readonly error?: { readonly code: string };
}

/** What one run of a suite did. */
export interface RunManifest {
  /** The contract version the cases, requests and results of the run are written to. */
  readonly contract: string;
  readonly kind: "run-manifest";
  /** The suite's name and the hash of the suite as it is written (`LoadedSuite.hash`). */
  readonly suite: { readonly name: string; readonly hash: string };
  /**
   * The case sources that identified their inputs, by the kind of lens they serve ("lv"); left out when none did,
   * as for a suite of case files only.
   */
  readonly sources?: { readonly [lensKind: string]: ManifestSource };
  /** Every engine a job was planned for, sorted by id. */
  readonly engines: readonly ManifestEngine[];
  /** Every run of the suite, in suite order. */
  readonly runs: readonly ManifestRun[];
  /**
   * Every job: runs in suite order, then rungs in ladder order, then engines sorted by id, then the rung's requests
   * in the order the rung builds them.
   */
  readonly jobs: readonly ManifestJob[];
}

/**
 * What a job's entry says beyond its status, as one text in the manifest's own codes: the items of an "unsupported"
 * as `<code> <item>, ...`, and the code of an "error". Undefined for a job of any other status, and for one whose
 * entry states neither. It is what a comparison and a report quote, so it never holds an engine's own words.
 */
export function jobDetail(job: ManifestJob): string | undefined {
  if (job.status === "unsupported") return job.unsupported?.map(({ code, item }) => `${code} ${item}`).join(", ");
  if (job.status === "error") return job.error?.code;
  return undefined;
}

/** A manifest as its file holds it: canonical JSON and a newline. Equal manifests give equal text. */
export function manifestText(manifest: RunManifest): string {
  return `${canonicalJson(manifest)}\n`;
}

/**
 * Writes the output of a run into `directory`, replacing that of the run before, and returns the manifest's path.
 * Each case is written to `cases/<id>.json` as canonical JSON and a newline, then the manifest, then every other
 * entry of `cases/` is removed. Every file appears whole or not at all, and the manifest last: so the manifest that
 * is there, the old one or the new one, never names a case that is not, however the process ends. The caller sees
 * to the same for the store, by storing each result before the manifest is written.
 */
export function writeRunOutput(directory: string, manifest: RunManifest, cases: readonly OpticalCase[]): string {
  const casesDirectory = join(directory, CASES_DIRECTORY);
  const wanted = new Set<string>();
  for (const opticalCase of cases) {
    const name = `${opticalCase.id}.json`;
    if (wanted.has(name)) continue;
    wanted.add(name);
    writeFileAtomic(join(casesDirectory, name), `${canonicalJson(opticalCase)}\n`);
  }
  const manifestPath = join(directory, MANIFEST_FILE);
  writeFileAtomic(manifestPath, manifestText(manifest));
  // Only now: until the new manifest is in place, the old one may still name these.
  for (const name of existsSync(casesDirectory) ? readdirSync(casesDirectory) : []) {
    if (!wanted.has(name)) rmSync(join(casesDirectory, name), { recursive: true, force: true });
  }
  return manifestPath;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const JOB_STATUSES: readonly unknown[] = ["ok", "unsupported", "error", "pending"] satisfies ResultStatus[];

/**
 * What keeps a parsed value from being a run manifest that the comparison and the report can read, as a list of
 * `<JSON Pointer>: <what is wrong>` (empty when nothing is). It checks the kind, that the contract version is one
 * this code can exchange, and the type of every member that is read afterwards; a member that is not read, such as
 * an engine's `details`, is not looked at. The texts quote nothing but the manifest's own values.
 */
export function manifestProblems(value: unknown): string[] {
  const problems: string[] = [];
  const text = (at: string, member: unknown): boolean => {
    if (typeof member !== "string") problems.push(`${at}: expected a string`);
    return typeof member === "string";
  };
  const list = (at: string, member: unknown, each: (at: string, element: Record<string, unknown>) => void): void => {
    if (!Array.isArray(member)) return void problems.push(`${at}: expected a list`);
    member.forEach((element: unknown, index) => {
      if (isRecord(element)) each(`${at}/${index}`, element);
      else problems.push(`${at}/${index}: expected an object`);
    });
  };

  if (!isRecord(value)) return ["(root): expected an object"];
  if (value.kind !== "run-manifest") return ['/kind: expected "run-manifest"'];
  if (text("/contract", value.contract) && !isCompatibleContract(value.contract as string)) {
    problems.push(`/contract: version ${value.contract as string} cannot be read by this code`);
  }
  if (!isRecord(value.suite)) problems.push("/suite: expected an object");
  else for (const member of ["name", "hash"]) text(`/suite/${member}`, value.suite[member]);

  list("/engines", value.engines, (at, engine) => {
    text(`${at}/id`, engine.id);
    if (engine.status === "available")
      for (const member of ["version", "fingerprint"]) text(`${at}/${member}`, engine[member]);
    else if (engine.status === "unavailable") text(`${at}/code`, engine.code);
    else problems.push(`${at}/status: expected "available" or "unavailable"`);
  });
  list("/runs", value.runs, (at, run) => {
    text(`${at}/name`, run.name);
    if (run.caseId !== null) text(`${at}/caseId`, run.caseId);
    if (!Array.isArray(run.problems) || run.problems.some((problem) => typeof problem !== "string")) {
      problems.push(`${at}/problems: expected a list of strings`);
    }
    if (run.referenceEngine !== undefined) text(`${at}/referenceEngine`, run.referenceEngine);
  });
  list("/jobs", value.jobs, (at, job) => {
    for (const member of ["run", "caseId", "rung", "quantity", "requestId", "engine"])
      text(`${at}/${member}`, job[member]);
    if (!JOB_STATUSES.includes(job.status)) problems.push(`${at}/status: expected a result status`);
    if (job.storeKey !== null) text(`${at}/storeKey`, job.storeKey);
    if (job.unsupported !== undefined) {
      list(`${at}/unsupported`, job.unsupported, (itemAt, item) => {
        for (const member of ["code", "item"]) text(`${itemAt}/${member}`, item[member]);
      });
    }
    if (job.error !== undefined) {
      if (isRecord(job.error)) text(`${at}/error/code`, job.error.code);
      else problems.push(`${at}/error: expected an object`);
    }
  });
  return problems;
}

/**
 * The manifest of the run directory `directory`, checked (`manifestProblems`). Throws a `UsageError` when the
 * directory has no manifest, which is what a suite that was never run looks like, and when the file cannot be read,
 * is not JSON or is not a manifest this code can read. The message names the directory as it was given.
 */
export function readRunManifest(directory: string): RunManifest {
  const file = join(directory, MANIFEST_FILE);
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code ?? "unknown error";
    if (code === "ENOENT" || code === "ENOTDIR") throw new UsageError(`${directory}: no ${MANIFEST_FILE} is there`);
    throw new UsageError(`${file}: cannot be read (${code})`, { cause: error });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new UsageError(`${file}: malformed JSON`, { cause: error });
  }
  const problems = manifestProblems(parsed);
  if (problems.length > 0) throw new UsageError(`${file}: not a run manifest: ${problems.join("; ")}`);
  return parsed as RunManifest;
}

/**
 * The case `caseId` of the run directory `directory`, as `writeRunOutput` wrote it to `cases/<caseId>.json`; or
 * undefined when the file is not there or is not that case: not JSON, not a valid optical-case, or one whose own
 * system and conditions give another id than the one it is filed under. An id that is no content hash names no
 * file and is undefined too. Never throws for what is in the directory.
 */
export function readRunCase(directory: string, caseId: string): OpticalCase | undefined {
  if (!/^[0-9a-f]{64}$/.test(caseId)) return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(join(directory, CASES_DIRECTORY, `${caseId}.json`), "utf8"));
  } catch {
    return undefined;
  }
  if (validateKind("optical-case", parsed).length > 0) return undefined;
  const opticalCase = parsed as OpticalCase;
  if (caseInvariantProblems(opticalCase.system, opticalCase.conditions).length > 0) return undefined;
  if (opticalCase.id !== caseId || verifyCaseIdentity(opticalCase).length > 0) return undefined;
  return opticalCase;
}
