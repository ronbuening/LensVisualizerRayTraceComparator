// The output of one run of a suite: `<runsDir>/<suite name>/manifest.json` and the cases beside it.
//
// The manifest is an index, not a record of an execution. It says what was asked of which engine, how each job
// ended and where the answer is kept, and nothing about when, how long or whether the answer was computed or found
// in the store, so that two runs of one suite against the same engines write the same bytes. It holds codes and
// never an engine's or the system's own words, which may name files or times; those are for the console.
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import type { OpticalCase } from "../contract/case.ts";
import type { EngineDetails, ResultStatus, UnsupportedItem } from "../contract/result.ts";
import type { EngineUnavailableCode } from "../engines/adapter.ts";
import { writeFileAtomic } from "./atomicFile.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";

/** The manifest's file name, inside the run directory. */
export const MANIFEST_FILE = "manifest.json";
/** The directory, inside the run directory, that holds each case of the run as `<case id>.json`. */
export const CASES_DIRECTORY = "cases";

/**
 * An engine the run turned to: who it said it was, or the code of why it could not be used
 * (`ENGINE_UNAVAILABLE_CODES`). `version` and `details` are the engine's own, for people; results are keyed by
 * `fingerprint`.
 */
export type ManifestEngine =
  | {
      readonly id: string;
      readonly status: "available";
      readonly version: string;
      readonly fingerprint: string;
      readonly details: EngineDetails;
    }
  | { readonly id: string; readonly status: "unavailable"; readonly code: EngineUnavailableCode };

/** One run of the suite: the case it was run on, or why it was not run. */
export interface ManifestRun {
  readonly name: string;
  /** The `id` of the run's case, which `cases/<id>.json` holds; null for a run that could not be started. */
  readonly caseId: string | null;
  /** What kept the run from starting; empty for a run that has a case. */
  readonly problems: readonly string[];
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
  /** The suite's name and the hash of its expanded runs (`LoadedSuite.hash`). */
  readonly suite: { readonly name: string; readonly hash: string };
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
