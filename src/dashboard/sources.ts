// What the dashboard reads, and nothing else: the run directories of the runs directory (their manifests and
// comparison files), the baselines of the root, the policy at hand and, by key, an entry of the store. Read-only: no
// file is written and no directory is made. A file is parsed and checked once for each (size, mtime, inode) it has,
// and kept while those stay; a value computed from files is kept the same way (`derived`).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

import { parseBaseline } from "../baseline/build.ts";
import { BASELINES_DIRECTORY } from "../baseline/files.ts";
import { COMPARISONS_FILE, comparisonFileProblem } from "../compare/comparisonFile.ts";
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { POLICY_FILE, loadPolicy } from "../compare/policyFile.ts";
import type { Baseline } from "../contract/baseline.ts";
import type { Policy } from "../contract/policy.ts";
import { MANIFEST_FILE, manifestProblems } from "../core/manifest.ts";
import type { RunManifest } from "../core/manifest.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { STORE_DIRECTORY, createResultStore } from "../core/resultStore.ts";
import type { StoreEntry } from "../core/resultStore.ts";
import { EXCHANGE_DIRECTORY } from "../transports/fileExchange.ts";
import type { DocumentName } from "./figure.ts";

/** A document as the dashboard found it: read and checked, not there, or there and not usable (and why). */
export type Loaded<T> =
  | { readonly state: "ok"; readonly value: T }
  | { readonly state: "missing" }
  | { readonly state: "invalid"; readonly problem: string };

/** The policy at hand: its file's stem (its document name), the policy and its content hash. */
export interface PolicyAtHand {
  readonly name: string;
  readonly policy: Policy;
  readonly hash: string;
}

/** The directories of a runs directory that are not run directories of a suite. */
export const NOT_RUN_DIRECTORIES: readonly string[] = Object.freeze([STORE_DIRECTORY, EXCHANGE_DIRECTORY, "mtf"]);

/** A store key, as the store names its entries. */
export const STORE_KEY_PATTERN = /^[0-9a-f]{64}$/;

/** What the dashboard reads. */
export interface DashboardSources {
  /** The run directories that hold a manifest, sorted by code unit. */
  runNames(): string[];
  /** The stems of the baseline files (`baselines/<stem>.json`), sorted by code unit. */
  baselineStems(): string[];
  manifest(name: string): Loaded<RunManifest>;
  comparisons(name: string): Loaded<ComparisonFile>;
  baseline(stem: string): Loaded<Baseline>;
  policy(): Loaded<PolicyAtHand>;
  /**
   * The store entry of `key`; missing for a key that is no store key. A section page asks only for the keys the
   * manifest names for its request's jobs; the store directory is never listed.
   */
  storeEntry(key: string): Loaded<StoreEntry>;
  /**
   * A value computed from the documents named, computed again only when one of their files changed. `label` tells
   * two values of the same documents apart.
   */
  derived<T>(label: string, documents: readonly DocumentName[], compute: () => T): T;
}

/** Where the dashboard reads from. */
export interface DashboardSourcesOptions {
  readonly rootDir: string;
  readonly runsDir: string;
  /** The policy file; `POLICY_FILE` unless a test names another. */
  readonly policyFile?: string;
}

/** How many computed values are kept; the oldest goes first. */
const DERIVED_LIMIT = 256;

/** A file's identity for the cache: its size, modification time and inode, or that it is not there. */
function statKey(path: string): string {
  try {
    const stats = statSync(path, { throwIfNoEntry: false });
    if (stats === undefined) return "missing";
    return `${stats.size}:${stats.mtimeMs}:${stats.ino}:${stats.isFile() ? "f" : "o"}`;
  } catch (error) {
    return `unreadable:${(error as NodeJS.ErrnoException).code ?? "unknown"}`;
  }
}

/** The names of the entries of a directory of one kind; none for a directory that is not there or cannot be read. */
function entriesOf(directory: string, kind: "directory" | "file"): string[] {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .filter((entry) => (kind === "directory" ? entry.isDirectory() : entry.isFile()))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

/** Reads a JSON file as a document: parsed, or why not, in words that name no path. */
function readJson(
  path: string,
): { readonly parsed: unknown } | { readonly missing: true } | { readonly problem: string } {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code ?? "unknown error";
    if (code === "ENOENT" || code === "ENOTDIR") return { missing: true };
    return { problem: `the file cannot be read (${code})` };
  }
  try {
    return { parsed: JSON.parse(text) };
  } catch {
    return { problem: "the file is not JSON" };
  }
}

/** The sources of a root and a runs directory. */
export function createSources(options: DashboardSourcesOptions): DashboardSources {
  const { rootDir, runsDir } = options;
  const policyFile = options.policyFile ?? POLICY_FILE;
  const baselinesDir = join(rootDir, BASELINES_DIRECTORY);
  const cache = new Map<string, { readonly key: string; readonly loaded: Loaded<unknown> }>();
  const derivedValues = new Map<string, unknown>();

  const cached = <T>(path: string, load: () => Loaded<T>): Loaded<T> => {
    const key = statKey(path);
    const known = cache.get(path);
    if (known !== undefined && known.key === key) return known.loaded as Loaded<T>;
    const loaded: Loaded<T> = key === "missing" ? { state: "missing" } : load();
    cache.set(path, { key, loaded });
    return loaded;
  };
  const jsonDocument = <T>(path: string, check: (parsed: unknown) => string | null): Loaded<T> =>
    cached<T>(path, () => {
      const read = readJson(path);
      if ("missing" in read) return { state: "missing" };
      if ("problem" in read) return { state: "invalid", problem: read.problem };
      const problem = check(read.parsed);
      return problem === null ? { state: "ok", value: read.parsed as T } : { state: "invalid", problem };
    });

  const runNames = (): string[] =>
    entriesOf(runsDir, "directory").filter(
      (name) => !NOT_RUN_DIRECTORIES.includes(name) && statKey(join(runsDir, name, MANIFEST_FILE)).endsWith(":f"),
    );
  const baselineStems = (): string[] =>
    entriesOf(baselinesDir, "file")
      .filter((name) => name.endsWith(".json") && name.length > ".json".length)
      .map((name) => name.slice(0, -".json".length));
  const runPath = (name: string, file: string): string => join(runsDir, name, file);

  const pathOf = (document: DocumentName): string => {
    const colon = document.indexOf(":");
    const [kind, name] = [document.slice(0, colon), document.slice(colon + 1)];
    if (kind === "manifest") return runPath(name, MANIFEST_FILE);
    if (kind === "comparisons") return runPath(name, COMPARISONS_FILE);
    if (kind === "baseline") return join(baselinesDir, `${name}.json`);
    if (kind === "policy") return policyFile;
    // As the store reads an entry: the gzip one where there is one, else a legacy plain one.
    const gzip = join(runsDir, STORE_DIRECTORY, `${name}.json.gz`);
    return statKey(gzip) === "missing" ? join(runsDir, STORE_DIRECTORY, `${name}.json`) : gzip;
  };

  return {
    runNames,
    baselineStems,
    manifest: (name) =>
      jsonDocument<RunManifest>(runPath(name, MANIFEST_FILE), (parsed) => {
        const problems = manifestProblems(parsed);
        return problems.length === 0 ? null : `not a run manifest: ${problems.join("; ")}`;
      }),
    comparisons: (name) =>
      jsonDocument<ComparisonFile>(runPath(name, COMPARISONS_FILE), (parsed) => {
        const problem = comparisonFileProblem(parsed);
        return problem === null ? null : `not a comparison file: ${problem}`;
      }),
    baseline: (stem) =>
      cached<Baseline>(join(baselinesDir, `${stem}.json`), () => {
        let text: string;
        try {
          text = readFileSync(join(baselinesDir, `${stem}.json`), "utf8");
        } catch (error) {
          const code = (error as NodeJS.ErrnoException).code ?? "unknown error";
          return code === "ENOENT" ? { state: "missing" } : { state: "invalid", problem: `cannot be read (${code})` };
        }
        const parsed = parseBaseline(text);
        return "baseline" in parsed
          ? { state: "ok", value: parsed.baseline }
          : { state: "invalid", problem: parsed.problems.join("; ") };
      }),
    policy: () =>
      cached<PolicyAtHand>(policyFile, () => {
        try {
          const policy = loadPolicy(policyFile);
          const name = basename(policyFile).replace(/\.json$/, "");
          return { state: "ok", value: { name, policy, hash: hashCanonical(policy) } };
        } catch (error) {
          return { state: "invalid", problem: error instanceof Error ? error.message : String(error) };
        }
      }),
    storeEntry: (key) => {
      if (!STORE_KEY_PATTERN.test(key)) return { state: "missing" };
      // Kept as the other files are, by the (size, mtime, inode) of the file the store reads it from.
      return cached<StoreEntry>(pathOf(`store:${key}`), () => {
        const lookup = createResultStore(join(runsDir, STORE_DIRECTORY)).get(key);
        if (lookup.kind === "hit") return { state: "ok", value: lookup.entry };
        if (lookup.kind === "miss") return { state: "missing" };
        return { state: "invalid", problem: lookup.problem };
      });
    },
    derived: <T>(label: string, documents: readonly DocumentName[], compute: () => T): T => {
      const key = JSON.stringify([label, ...documents.map((document) => [document, statKey(pathOf(document))])]);
      if (derivedValues.has(key)) {
        const value = derivedValues.get(key) as T;
        // Kept as the most recent: a Map iterates in insertion order, and the first key is the one to drop.
        derivedValues.delete(key);
        derivedValues.set(key, value);
        return value;
      }
      const value = compute();
      derivedValues.set(key, value);
      if (derivedValues.size > DERIVED_LIMIT) derivedValues.delete(derivedValues.keys().next().value as string);
      return value;
    },
  };
}
