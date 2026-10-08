import { readdirSync } from "node:fs";
import { join, sep } from "node:path";

import { LENS_DATA_DIRECTORY, LENS_FILE_SUFFIX } from "./fingerprint.ts";
import type { LvLensData } from "./types.ts";

/** One lens of the catalog. */
export interface LvCatalogEntry {
  /** The lens key: a slug unique in the catalog. */
  readonly key: string;
  /** The lens file, POSIX and relative to the LV root. */
  readonly file: string;
  /** sha256 hex of the file's bytes as they were loaded. */
  readonly fileSha256: string;
  readonly name: string;
  /** Present, and true, on a zoom lens. */
  readonly zoom?: true;
}

/** A lens file that is not in the catalog, and why. */
export interface LvCatalogProblem {
  readonly file: string;
  readonly problem: string;
}

/** The index of every lens file under `src/lens-data`. */
export interface LvCatalog {
  /** The number of `*.data.ts` files found. */
  readonly fileCount: number;
  /** The lenses, sorted by key. */
  readonly entries: readonly LvCatalogEntry[];
  /** Every file that could not be indexed, sorted by file; a file listed here has no entry. */
  readonly problems: readonly LvCatalogProblem[];
}

/** A lens file as it was imported: its module namespace and the hash of the bytes loaded. */
export interface LoadedLensFile {
  readonly module: Readonly<Record<string, unknown>>;
  readonly sha256: string;
}

function byCodeUnit(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Every `*.data.ts` under the root's `src/lens-data`, at any depth, POSIX and relative to the root, sorted. An
 * LV tree without the directory has no lens files. Nothing but directory entries is read.
 */
export function listLensFiles(root: string): string[] {
  let names: string[];
  try {
    names = readdirSync(join(root, ...LENS_DATA_DIRECTORY.split("/")), { recursive: true, encoding: "utf8" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return names
    .filter((name) => name.endsWith(LENS_FILE_SUFFIX))
    .map((name) => `${LENS_DATA_DIRECTORY}/${name.split(sep).join("/")}`)
    .sort(byCodeUnit);
}

function isLensData(value: unknown): value is LvLensData {
  return typeof value === "object" && value !== null;
}

/**
 * Builds the catalog from the lens files, importing each one through `load`. Nothing is thrown for a file that
 * cannot be indexed: one that fails to import, has no default export that is an object, no non-empty string `key`
 * or no string `name`, and every file of a key that more than one file claims, is listed in `problems`, all of them
 * together, and left out of the entries. Returns the catalog and the lens data of each entry, by key.
 */
export async function buildCatalog(
  files: readonly string[],
  load: (file: string) => Promise<LoadedLensFile>,
): Promise<{ catalog: LvCatalog; data: ReadonlyMap<string, LvLensData> }> {
  const problems: LvCatalogProblem[] = [];
  const found = new Map<string, { entry: LvCatalogEntry; data: LvLensData }[]>();
  for (const file of files) {
    let loaded: LoadedLensFile;
    try {
      loaded = await load(file);
    } catch (error) {
      problems.push({ file, problem: `cannot be imported: ${error instanceof Error ? error.message : String(error)}` });
      continue;
    }
    const data = loaded.module.default;
    if (!isLensData(data)) problems.push({ file, problem: "no default export that is an object" });
    else if (typeof data.key !== "string" || data.key === "") problems.push({ file, problem: "no string key" });
    else if (typeof data.name !== "string") problems.push({ file, problem: `no string name (key "${data.key}")` });
    else {
      const zoom = Array.isArray(data.zoomPositions) && data.zoomPositions.length >= 2;
      const entry: LvCatalogEntry = {
        key: data.key,
        file,
        fileSha256: loaded.sha256,
        name: data.name,
        ...(zoom ? { zoom: true as const } : {}),
      };
      found.set(data.key, [...(found.get(data.key) ?? []), { entry, data }]);
    }
  }

  const entries: LvCatalogEntry[] = [];
  const data = new Map<string, LvLensData>();
  for (const [key, claims] of found) {
    if (claims.length === 1) {
      entries.push(claims[0].entry);
      data.set(key, claims[0].data);
      continue;
    }
    for (const { entry } of claims) {
      const others = claims.filter((claim) => claim.entry !== entry).map((claim) => claim.entry.file);
      problems.push({ file: entry.file, problem: `duplicate key "${key}" (also in ${others.join(", ")})` });
    }
  }
  entries.sort((a, b) => byCodeUnit(a.key, b.key));
  problems.sort((a, b) => byCodeUnit(a.file, b.file));
  return { catalog: { fileCount: files.length, entries, problems }, data };
}

/** The number of single-character edits between two strings. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_unused, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      current.push(Math.min(previous[j] + 1, current[j - 1] + 1, substitution));
    }
    previous = current;
  }
  return previous[b.length];
}

/**
 * The keys nearest to one that is not in the catalog, best first, at most `limit`: keys that contain what was
 * asked for or are contained in it, then keys within a third of its length in single-character edits. Case is
 * ignored; ties go by key.
 */
export function nearestKeys(keys: readonly string[], wanted: string, limit: number = 5): string[] {
  const asked = wanted.toLowerCase();
  if (asked === "") return [];
  const allowed = Math.max(2, Math.floor(asked.length / 3));
  const scored: { key: string; score: number }[] = [];
  for (const key of keys) {
    const candidate = key.toLowerCase();
    const distance = editDistance(asked, candidate);
    if (candidate.includes(asked) || asked.includes(candidate))
      scored.push({ key, score: Math.min(distance, allowed) });
    else if (distance <= allowed) scored.push({ key, score: allowed + distance });
  }
  return scored
    .sort((a, b) => a.score - b.score || byCodeUnit(a.key, b.key))
    .slice(0, limit)
    .map(({ key }) => key);
}
