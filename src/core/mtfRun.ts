// The output of one `lvrtc mtf`: `<runsDir>/mtf/<profile>/<name>/mtf.json` and the case beside it.
//
// Like a run's manifest it is a record of what was asked and answered, not of an execution: it says nothing about
// when, how long or whether an answer was computed or found in the store, so asking again writes the same bytes. Of
// an engine that failed it keeps the code and never the engine's own words, which may name files of this machine.
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import type { OpticalCase } from "../contract/case.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { ResultEnvelope, ResultStatus } from "../contract/result.ts";
import { writeFileAtomic } from "./atomicFile.ts";
import { CASES_DIRECTORY } from "./manifest.ts";
import type { ManifestEngine } from "./manifest.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";

/** The directory below the runs directory that holds the output of `lvrtc mtf`, by profile and run name. */
export const MTF_RUNS_DIRECTORY = "mtf";
/** The record's file name, inside the directory of one MTF run. */
export const MTF_RUN_FILE = "mtf.json";

/** What one engine made of the request. */
export interface MtfRunAnswer {
  readonly engine: string;
  readonly status: ResultStatus;
  /** The key the result is kept under in the result store; null for one that is not kept. */
  readonly storeKey: string | null;
  /** The code of an "error": all of it that is recorded. */
  readonly error?: { readonly code: string };
  /** The engine's result, for a result that is an answer: status "ok" or "unsupported". */
  readonly result?: ResultEnvelope;
}

/** The record of one MTF run: one `mtf.native` request about one case, and what each engine answered. */
export interface MtfRun {
  readonly contract: string;
  readonly kind: "mtf-run";
  /** The name of the run: the lens key, with the zoom position and the view where they are not the default. */
  readonly name: string;
  readonly lensKey: string;
  /** The profile the request was made by. */
  readonly profile: string;
  /** The `id` of the case, which is kept as `cases/<id>.json` beside the record. */
  readonly caseId: string;
  /** The request every engine was asked; its spec states the frequencies and the fields. */
  readonly request: QuantityRequest;
  /** The frequencies of the request that the profile shows, cycles/mm. */
  readonly displayedFrequenciesPerMm: readonly number[];
  /** The engines that were turned to, sorted by id. */
  readonly engines: readonly ManifestEngine[];
  /** One answer per engine, in the order of `engines`. */
  readonly answers: readonly MtfRunAnswer[];
}

/** The directory of the MTF run `name` of a profile, below a runs directory. */
export function mtfRunDirectory(runsDir: string, profile: string, name: string): string {
  return join(runsDir, MTF_RUNS_DIRECTORY, profile, name);
}

/** A record as its file holds it: canonical JSON and a newline. Equal records give equal text. */
export function mtfRunText(run: MtfRun): string {
  return `${canonicalJson(run)}\n`;
}

/**
 * Writes the output of an MTF run into `directory`, replacing that of the run before, and returns the record's
 * path: the case as `cases/<id>.json`, then the record, then any other case that was there is removed. Every file
 * appears whole or not at all, and the record last, so the record that is there never names a case that is not.
 */
export function writeMtfRun(directory: string, run: MtfRun, opticalCase: OpticalCase): string {
  const casesDirectory = join(directory, CASES_DIRECTORY);
  const name = `${opticalCase.id}.json`;
  writeFileAtomic(join(casesDirectory, name), `${canonicalJson(opticalCase)}\n`);
  const path = join(directory, MTF_RUN_FILE);
  writeFileAtomic(path, mtfRunText(run));
  for (const other of existsSync(casesDirectory) ? readdirSync(casesDirectory) : []) {
    if (other !== name) rmSync(join(casesDirectory, other), { recursive: true, force: true });
  }
  return path;
}
