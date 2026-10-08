// What the tests against the real optiland share. They run with `npm run test:optiland`, never with
// `npm run check`, and each skips with a stated reason when optiland is not configured or cannot be imported.
// Nothing here writes into this repository's tracked files, into LensVisualizer or into optiland: the worker's
// caches go under the repository's gitignored cache directory, or under a temporary one.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative } from "node:path";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { COMPARISONS_FILE } from "../../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import { CONFIG_FILE, REPO_ROOT, loadConfig } from "../../../src/core/config.ts";
import type { LoadedConfig } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { optilandWorkerEnvironment } from "../../../src/engines/optiland/definition.ts";
import { workerEnvironment } from "../../../src/transports/stdio.ts";
import { LV_PATH } from "../lv/support.ts";

const REPO_CONFIG = loadConfig({ rootDir: REPO_ROOT, env: process.env }).config;

/** The interpreter of this repository's configuration and the environment, or null. */
export const OPTILAND_PYTHON: string | null = REPO_CONFIG.engines.optiland.python;

/** The comparator's own cache directory (gitignored): where the worker's caches are warm. */
export const REPO_CACHE_DIR: string = REPO_CONFIG.cacheDir;

/**
 * The environment the comparator gives the worker, with its caches under `cacheDir`: what any Python started here
 * with the optiland interpreter runs in, so that it writes nothing into the optiland checkout.
 */
export function optilandEnvironment(cacheDir: string = REPO_CACHE_DIR): Record<string, string> {
  return workerEnvironment(process.env, {}, optilandWorkerEnvironment(cacheDir));
}

/** Runs the optiland interpreter to completion in the worker's environment; the output is text. */
export function optilandPython(
  args: readonly string[],
  options: { cacheDir?: string; cwd?: string; timeoutMs?: number } = {},
): { status: number | null; stdout: string; stderr: string } {
  const ended = spawnSync(OPTILAND_PYTHON ?? "", [...args], {
    encoding: "utf8",
    env: optilandEnvironment(options.cacheDir),
    cwd: options.cwd ?? tmpdir(),
    timeout: options.timeoutMs ?? 600_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: ended.error === undefined ? ended.status : null, stdout: ended.stdout, stderr: ended.stderr };
}

/** Where the optiland of the interpreter is: its package directory and the interpreter's own prefix. */
interface OptilandPlace {
  readonly packageDir: string;
  readonly prefix: string;
}

/** Asked without importing optiland: `find_spec` of a top-level package runs none of its code. */
const PLACE_SCRIPT = [
  "import importlib.util, json, os, sys",
  "spec = importlib.util.find_spec('optiland')",
  "origin = None if spec is None or spec.origin is None else os.path.dirname(os.path.realpath(spec.origin))",
  "print(json.dumps({'packageDir': origin, 'prefix': os.path.realpath(sys.prefix)}))",
].join("\n");

const PLACE: OptilandPlace | string = (() => {
  if (OPTILAND_PYTHON === null) return "optiland is not configured (engines.optiland.python, or LVRTC_OPTILAND_PYTHON)";
  if (isAbsolute(OPTILAND_PYTHON) && !existsSync(OPTILAND_PYTHON)) return `no interpreter at ${OPTILAND_PYTHON}`;
  const asked = optilandPython(["-c", PLACE_SCRIPT], { timeoutMs: 60_000 });
  if (asked.status !== 0) return `${OPTILAND_PYTHON} cannot be run`;
  const place = JSON.parse(asked.stdout) as { packageDir: string | null; prefix: string };
  if (place.packageDir === null) return `${OPTILAND_PYTHON} has no optiland to import`;
  return { packageDir: place.packageDir, prefix: place.prefix };
})();

/** False when the real optiland can be used; else the reason a test is skipped. */
export const OPTILAND_UNAVAILABLE: string | false = typeof PLACE === "string" ? PLACE : false;

/** A git command on a directory that only reads: its trimmed output, or null when it failed. */
function git(directory: string, ...args: string[]): string | null {
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")));
  const ended = spawnSync("git", ["--no-optional-locks", "-C", directory, ...args], { encoding: "utf8", env });
  return ended.status === 0 ? ended.stdout.trim() : null;
}

/** The optiland checkout: the work tree that holds the package, or the directory above it outside git. */
export function optilandCheckout(): string {
  if (typeof PLACE === "string") throw new Error(PLACE);
  return git(PLACE.packageDir, "rev-parse", "--show-toplevel") ?? dirname(PLACE.packageDir);
}

/** The package directory of the optiland the interpreter imports. */
export function optilandPackageDir(): string {
  if (typeof PLACE === "string") throw new Error(PLACE);
  return PLACE.packageDir;
}

/** The commit of the optiland checkout, or null outside git. */
export function optilandCommit(): string | null {
  return git(optilandCheckout(), "rev-parse", "--verify", "HEAD");
}

/**
 * Everything the worker must not write to: the optiland checkout and, where it is not inside it, the environment
 * of the interpreter (its prefix: site-packages and all).
 */
export function protectedDirectories(): string[] {
  if (typeof PLACE === "string") throw new Error(PLACE);
  const checkout = realpathSync(optilandCheckout());
  const inside = !relative(checkout, PLACE.prefix).startsWith("..");
  return inside ? [checkout] : [checkout, PLACE.prefix];
}

/** Every entry under some directories: its size (-1 for a directory, -2 for a link) and when it was last written. */
export type Snapshot = ReadonlyMap<string, string>;

/**
 * A recursive snapshot of `directories`: path, size and modification time in nanoseconds of every file, directory
 * and link, the directories themselves included. A file that is created, removed, rewritten or touched shows, and
 * so does a directory an entry was added to: git sees none of that for an ignored `__pycache__` or a numba cache.
 */
export function snapshot(directories: readonly string[]): Snapshot {
  const entries = new Map<string, string>();
  const visit = (path: string): void => {
    const stat = lstatSync(path, { bigint: true });
    const size = stat.isDirectory() ? -1n : stat.isSymbolicLink() ? -2n : stat.size;
    entries.set(path, `${size} ${stat.mtimeNs}`);
    if (!stat.isDirectory()) return;
    for (const name of readdirSync(path)) visit(join(path, name));
  };
  for (const directory of directories) visit(directory);
  return entries;
}

/** The paths that differ between two snapshots, each with what it was and what it is, sorted. */
export function snapshotChanges(before: Snapshot, after: Snapshot): string[] {
  const paths = [...new Set([...before.keys(), ...after.keys()])].sort();
  return paths
    .filter((path) => before.get(path) !== after.get(path))
    .map((path) => `${path}: ${before.get(path) ?? "absent"} -> ${after.get(path) ?? "absent"}`);
}

/** A temporary directory, removed after the test. */
export function tempDir(t: TestContext): string {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-optiland-")));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/**
 * A temporary configuration root that names the real interpreter and nothing else of this machine: its runs go
 * under it, and the worker's caches under `cacheDir`, which defaults to the repository's own, where they are warm.
 */
export function optilandRoot(t: TestContext, cacheDir: string = REPO_CACHE_DIR): LoadedConfig {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(rootDir);
  const config = { cacheDir, engines: { optiland: { python: OPTILAND_PYTHON } } };
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config));
  return loadConfig({ rootDir, env: {} });
}

// ── Through the commands ─────────────────────────────────────────────────────────────────────────────────────────

const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));

/**
 * Runs one `lvrtc` command as a child process, in `cwd`, on the optiland and the LensVisualizer of this
 * repository's configuration, writing runs into `runsDir`.
 */
export function lvrtc(
  runsDir: string,
  cwd: string,
  ...args: string[]
): { code: number | null; out: string; err: string } {
  const env = {
    ...process.env,
    LVRTC_RUNS_DIR: runsDir,
    LVRTC_LV_PATH: LV_PATH ?? "",
    LVRTC_OPTILAND_PYTHON: OPTILAND_PYTHON ?? "",
  };
  const child = spawnSync(process.execPath, [BIN, ...args], {
    encoding: "utf8",
    cwd,
    env,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

/** What `lvrtc run` and `lvrtc compare` gave for a suite. */
export interface RunCycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  /** The summary line of `lvrtc compare`. */
  readonly verdicts: string;
}

/**
 * `lvrtc run <suite> --engines <engines> --rungs <rungs>` and `lvrtc compare <name>`, both of which must end with
 * exit code 0, into a temporary runs directory. `root` is a configuration root to run under, with the suite's path
 * relative to it; without one the command runs at the root of this repository, as a user runs it.
 */
export function runAndCompare(
  t: TestContext,
  run: { suite: string; name: string; engines: string; rungs: string; root?: string },
): RunCycle {
  const runsDir = tempDir(t);
  const cwd = run.root ?? REPO_ROOT;
  const rooted = run.root === undefined ? [] : ["--root", run.root];
  const ran = lvrtc(runsDir, cwd, "run", run.suite, ...rooted, "--engines", run.engines, "--rungs", run.rungs);
  assert.equal(ran.code, 0, ran.out + ran.err);
  const compared = lvrtc(runsDir, cwd, "compare", run.name, ...rooted);
  assert.equal(compared.code, 0, compared.out + compared.err);
  const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, run.name, MANIFEST_FILE), "utf8"));
  const comparisons: ComparisonFile = JSON.parse(readFileSync(join(runsDir, run.name, COMPARISONS_FILE), "utf8"));
  const verdicts = compared.out.split("\n").find((line) => line.startsWith(`${run.name}: `)) ?? "";
  return { manifest, comparisons, verdicts };
}

/** One pair of two engines on one request of a rung, with the run it is of. */
export interface RungPair {
  readonly run: string;
  /** The two engines, as `a / b`, in the order of their ids. */
  readonly engines: string;
  readonly verdict: string;
  readonly reason?: string;
  /** Each metric by name: its value, null for one that is no finite number, and where it occurs, as JSON. */
  readonly metrics: Readonly<Record<string, { value: number | null; where: string }>>;
}

/** Every pair of two engines of a rung, each once: the pairs of the comparisons made pair by pair. */
export function pairsOf(comparisons: ComparisonFile, rung: string, quantity: string): RungPair[] {
  return comparisons.comparisons
    .filter((set) => set.mode === "pairwise" && set.rung === rung)
    .flatMap((set) => {
      assert.equal(set.quantity, quantity, `${set.run} ${rung}`);
      return set.pairs.map((pair): RungPair => {
        const metrics = Object.fromEntries(
          pair.metrics.map((metric) => [
            metric.name,
            { value: metric.value, where: JSON.stringify(metric.where ?? {}) },
          ]),
        );
        const reason = pair.reason === undefined ? {} : { reason: pair.reason };
        return { run: set.run, engines: `${pair.a} / ${pair.b}`, verdict: pair.verdict, ...reason, metrics };
      });
    });
}

/** The largest value of a metric over some pairs, with the run, the two engines and the place it occurs at. */
export function worstOf(pairs: readonly RungPair[], metric: string): { value: number; at: string } {
  let found = { value: -1, at: "nowhere" };
  for (const pair of pairs) {
    const { value, where } = pair.metrics[metric];
    assert.ok(value !== null, `${pair.run} ${pair.engines}: ${metric} is not finite`);
    if (value > found.value) found = { value, at: `${pair.run}, ${pair.engines}, ${where}` };
  }
  return found;
}
