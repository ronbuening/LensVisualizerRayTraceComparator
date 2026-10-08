import { readFileSync } from "node:fs";
import { join } from "node:path";

import { sha256Hex } from "../../core/numeric/hash.ts";

/** The directory of LensVisualizer's lens files, POSIX and relative to the LV root. */
export const LENS_DATA_DIRECTORY = "src/lens-data";
/** The suffix of a lens prescription file. */
export const LENS_FILE_SUFFIX = ".data.ts";
/** The suffix of a teleconverter prescription file. */
export const TELECONVERTER_FILE_SUFFIX = ".teleconverter.ts";

/** What identifies LensVisualizer's engine code: the files loaded, and one hash over all of them. */
export interface LvEngineClosure {
  /** sha256 hex over the sorted `relativePath\0sha256\n` lines of the loaded engine files. */
  readonly engineClosureHash: string;
  readonly engineFileCount: number;
}

/** The engine closure with the git state of the checkout; both git members are null when it has none. */
export interface LvFingerprint extends LvEngineClosure {
  readonly commit: string | null;
  readonly dirty: boolean | null;
}

/**
 * True for a prescription file: a `*.data.ts` or `*.teleconverter.ts` under `src/lens-data`. Such a file is data
 * of one case, hashed into that case's provenance, and never part of the engine. Everything else LV loads is engine
 * code, `src/lens-data/defaults.ts` included.
 */
export function isLensPrescriptionFile(file: string): boolean {
  if (!file.startsWith(`${LENS_DATA_DIRECTORY}/`)) return false;
  return file.endsWith(LENS_FILE_SUFFIX) || file.endsWith(TELECONVERTER_FILE_SUFFIX);
}

/** The engine files among the loaded ones, sorted by path: every file that is not a prescription. */
export function engineFiles(loaded: ReadonlyMap<string, string>): [file: string, sha256: string][] {
  return [...loaded].filter(([file]) => !isLensPrescriptionFile(file)).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * The closure of the loaded engine files, hashed in path order, so it does not depend on the order in which they
 * were loaded or are listed; loading or editing a lens file never changes it.
 */
export function engineClosure(loaded: ReadonlyMap<string, string>): LvEngineClosure {
  const files = engineFiles(loaded);
  const lines = files.map(([file, hash]) => `${file}\0${hash}\n`);
  return { engineClosureHash: sha256Hex(lines.join("")), engineFileCount: files.length };
}

/**
 * The files, of those given with the hash each had when it was loaded, whose bytes on disk are no longer those: a
 * file that has gone included. In the order given.
 */
export function changedFiles(root: string, files: Iterable<readonly [file: string, sha256: string]>): string[] {
  return [...files]
    .filter(([file, hash]) => {
      try {
        return sha256Hex(readFileSync(join(root, ...file.split("/")))) !== hash;
      } catch {
        return true;
      }
    })
    .map(([file]) => file);
}

/**
 * The loaded engine files whose bytes on disk are no longer the ones that were loaded, a file that has gone
 * included, sorted by path. Node keeps running the code it loaded, so a non-empty answer means the fingerprint
 * describes what ran but no longer what is in the checkout.
 */
export function changedEngineFiles(root: string, loaded: ReadonlyMap<string, string>): string[] {
  return changedFiles(root, engineFiles(loaded));
}
