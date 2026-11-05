// Owner-invoked maintenance. No command invokes this implicitly, and dry runs never write a file. Every run states the
// store's state it is of (`storeState`): with that digest expected, a run that changes the store (`yes`) first checks
// that the store and the protected engines are still those of the plan the owner was shown, and changes nothing when
// they are not (the dashboard's maintenance page, Stage 8.4).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, lstatSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";

import { parseBaseline } from "../baseline/build.ts";
import type { BaselineEngine } from "../contract/baseline.ts";
import { writeFileAtomic } from "./atomicFile.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";
import { parseStoreEntry } from "./resultStore.ts";

const ENTRY = /^([0-9a-f]{64})\.json(\.gz)?$/;
type EngineKey = Pick<BaselineEngine, "id" | "fingerprint" | "adapterRevision">;
const identity = (engine: EngineKey): string =>
  canonicalJson([engine.id, engine.fingerprint, engine.adapterRevision ?? null]);

/** HEAD's committed baseline blobs, never working-tree edits or untracked baselines. Fail closed on any problem. */
export function committedBaselineEngines(rootDir: string): EngineKey[] {
  const git = (...args: string[]): Buffer =>
    execFileSync("git", ["--no-optional-locks", "-C", rootDir, ...args], {
      maxBuffer: 128 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
      env: Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_"))),
    });
  const files = git("ls-tree", "-rz", "--name-only", "HEAD", "--", "baselines/")
    .toString("utf8")
    .split("\0")
    .filter((file) => /^baselines\/[^/]+\.json$/.test(file));
  if (files.length === 0) throw new Error("store prune: no committed baselines in HEAD; refusing to prune");
  const engines: EngineKey[] = [];
  for (const file of files) {
    // `./`: the path ls-tree printed is relative to the root, which may lie below the top of the work tree.
    const parsed = parseBaseline(git("show", `HEAD:./${file}`).toString("utf8"));
    if ("problems" in parsed)
      throw new Error(`store prune: committed ${file} is invalid: ${parsed.problems.join("; ")}`);
    engines.push(
      ...parsed.baseline.engines.map(({ id, fingerprint, adapterRevision }) => ({
        id,
        fingerprint,
        ...(adapterRevision === undefined ? {} : { adapterRevision }),
      })),
    );
  }
  return engines;
}

export interface CompressSummary {
  /** The digest of the store's state this summary is of, before any change (`storeState`). */
  readonly state: string;
  readonly plainEntries: number;
  readonly compressedEntries: number;
  readonly bytesBefore: number;
  readonly bytesAfter: number;
  readonly changed: number;
}

function filesOf(directory: string): string[] {
  try {
    return readdirSync(directory)
      .filter((file) => ENTRY.test(file))
      .sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/**
 * The state of a store a plan is of: every entry file with its size, modification time (ns) and inode, and for a
 * prune the engine versions the committed baselines protect, as a SHA-256 digest. Two runs of the same state plan the
 * same changes, since an entry's bytes are its key's; any file written, replaced or removed is another state.
 */
export function storeState(directory: string, engines: readonly EngineKey[] | null = null): string {
  return stateOf(directory, filesOf(directory), engines);
}

/** The state of the entry files listed, which a run then works through: none it did not hold to the plan. */
function stateOf(directory: string, files: readonly string[], engines: readonly EngineKey[] | null): string {
  const listing = files.map((file) => {
    const stat = lstatSync(join(directory, file), { bigint: true });
    return [file, String(stat.size), String(stat.mtimeNs), String(stat.ino), stat.isFile() ? "f" : "o"];
  });
  const protectedIds = engines === null ? null : [...new Set(engines.map(identity))].sort();
  return createHash("sha256")
    .update(canonicalJson({ listing, protected: protectedIds }))
    .digest("hex");
}

/** A run that would change the store, refused before it changes anything: the store is not the plan's any more. */
export class StoreChangedError extends Error {
  constructor(action: string, expected: string, state: string) {
    super(
      `store ${action}: the store or the protected engines changed since the plan ${expected} (now ${state}); ` +
        "nothing was changed: plan again",
    );
  }
}

/** Throws `StoreChangedError` where a digest is expected and the state is another. */
function holdToPlan(action: string, expected: string | undefined, state: string): void {
  if (expected !== undefined && expected !== state) throw new StoreChangedError(action, expected, state);
}

/**
 * Compress each plain file's exact bytes, publishing the gzip before unlinking the plain entry. With `expected`, a run
 * that compresses (`yes`) first holds the store to that state and changes nothing where it is another.
 */
export function compressStore(directory: string, yes = false, expected?: string): CompressSummary {
  const files = filesOf(directory);
  const state = stateOf(directory, files, null);
  if (yes) holdToPlan("compress", expected, state);
  let plainEntries = 0,
    compressedEntries = 0,
    bytesBefore = 0,
    bytesAfter = 0,
    changed = 0;
  const names = new Set(files);
  for (const file of files) {
    const path = join(directory, file);
    const stat = lstatSync(path);
    if (!stat.isFile()) throw new Error(`store compress: not a regular entry: ${file}`);
    bytesBefore += stat.size;
    if (file.endsWith(".gz")) {
      compressedEntries++;
      // A matching plain entry below accounts for the one surviving gzip.
      if (!names.has(file.slice(0, -3))) bytesAfter += stat.size;
      continue;
    }
    plainEntries++;
    const plain = readFileSync(path);
    const target = `${path}.gz`;
    const compressed = existsSync(target) ? readFileSync(target) : gzipSync(plain);
    if (!gunzipSync(compressed).equals(plain)) {
      throw new Error(`store compress: conflicting plain and gzip entries: ${file}`);
    }
    bytesAfter += compressed.length;
    if (yes) {
      writeFileAtomic(target, compressed);
      unlinkSync(path);
      changed++;
    }
  }
  return { state, plainEntries, compressedEntries, bytesBefore, bytesAfter, changed };
}

export interface PruneCount {
  readonly engine: string;
  readonly keep: number;
  readonly keepBytes: number;
  readonly prune: number;
  readonly pruneBytes: number;
}
/** One engine version that no committed baseline names: what pruning it removes, and how recent its entries are. */
export interface RemovableIdentity {
  readonly engine: string;
  readonly fingerprint: string;
  readonly adapterRevision: string | null;
  readonly files: number;
  readonly bytes: number;
  /** The modification time of its newest entry file: the newest are most likely the engines as they are now. */
  readonly newestEntry: string;
}

/** Said with every prune, dry run or not. */
export const PRUNE_NOTICE =
  "An engine version is protected only by a baseline committed to HEAD that names it. The answers of the engines " +
  "as this checkout runs them are removable until baselines written with them are committed: wherever baseline " +
  "check says STALE(engine), those answers are among the removable identities. Prune after the refreshed " +
  "baselines are committed, never before a refresh that would need them.";

export interface PruneSummary {
  /** The digest of the store's state and protected engines this summary is of, before any change (`storeState`). */
  readonly state: string;
  readonly notice: string;
  readonly engines: readonly PruneCount[];
  /** Every engine version an entry would be removed for, by engine, fingerprint and adapter revision. */
  readonly removableIdentities: readonly RemovableIdentity[];
  readonly protectedEngines: readonly EngineKey[];
  readonly problems: readonly string[];
  readonly deleted: number;
}

/**
 * Keep every request matching any committed engine tuple; unreadable or untrusted entries are kept too. With
 * `expected`, a run that deletes (`yes`) first holds the store and the protected engines to that state and deletes
 * nothing where it is another.
 */
export function pruneStore(
  directory: string,
  engines: readonly EngineKey[],
  yes = false,
  expected?: string,
): PruneSummary {
  const files = filesOf(directory);
  const state = stateOf(directory, files, engines);
  if (yes) holdToPlan("prune", expected, state);
  const protectedEngines = [...new Map(engines.map((engine) => [identity(engine), engine])).values()].sort((a, b) =>
    identity(a).localeCompare(identity(b)),
  );
  const protectedIds = new Set(protectedEngines.map(identity));
  const counts = new Map<
    string,
    { engine: string; keep: number; keepBytes: number; prune: number; pruneBytes: number }
  >();
  const problems: string[] = [];
  const removable = new Map<string, { identity: EngineKey; files: number; bytes: number; newest: number }>();
  let deleted = 0;
  for (const file of files) {
    const path = join(directory, file);
    const stat = lstatSync(path);
    let engine = "unknown",
      keep = true,
      tuple: EngineKey | undefined;
    try {
      if (!stat.isFile()) throw new Error("not a regular file");
      const bytes = readFileSync(path);
      const text = (file.endsWith(".gz") ? gunzipSync(bytes) : bytes).toString("utf8");
      const found = parseStoreEntry(file.slice(0, 64), text);
      if (found.kind !== "hit") throw new Error(found.kind === "corrupt" ? found.problem : "missing entry");
      const stamp = found.entry.result.engine;
      engine = stamp.id;
      tuple = stamp;
      keep = protectedIds.has(identity(stamp));
    } catch (error) {
      problems.push(`${file}: kept: ${error instanceof Error ? error.message : String(error)}`);
    }
    let count = counts.get(engine);
    if (count === undefined) {
      count = { engine, keep: 0, keepBytes: 0, prune: 0, pruneBytes: 0 };
      counts.set(engine, count);
    }
    if (keep) {
      count.keep++;
      count.keepBytes += stat.size;
    } else {
      count.prune++;
      count.pruneBytes += stat.size;
      const named = identity(tuple!);
      const version = removable.get(named) ?? { identity: tuple!, files: 0, bytes: 0, newest: 0 };
      version.files++;
      version.bytes += stat.size;
      version.newest = Math.max(version.newest, stat.mtimeMs);
      removable.set(named, version);
      if (yes) {
        unlinkSync(path);
        deleted++;
      }
    }
  }
  return {
    state,
    notice: PRUNE_NOTICE,
    engines: [...counts.values()].sort((a, b) => a.engine.localeCompare(b.engine)),
    removableIdentities: [...removable.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([
          ,
          {
            identity: { id, fingerprint, adapterRevision },
            files,
            bytes,
            newest,
          },
        ]) => ({
          engine: id,
          fingerprint,
          adapterRevision: adapterRevision ?? null,
          files,
          bytes,
          newestEntry: new Date(newest).toISOString(),
        }),
      ),
    protectedEngines,
    problems,
    deleted,
  };
}
