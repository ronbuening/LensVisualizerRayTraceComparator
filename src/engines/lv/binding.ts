// The only door to LensVisualizer. Every LV module is imported here, dynamically and through the loader of
// src/loader/lvHooks.ts, and handed out behind the local structural types of ./types.ts. Nothing else in the
// comparator imports from the LV checkout, and nothing here writes to it.
import { readFileSync, realpathSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { sha256Hex } from "../../core/numeric/hash.ts";
import { runSystemCommand } from "../../core/systemCommand.ts";
import { installLvLoader } from "../../loader/lvHooks.ts";
import type { LvLoader } from "../../loader/lvHooks.ts";
import { buildCatalog, listLensFiles, nearestKeys } from "./catalog.ts";
import type { LoadedLensFile, LvCatalog, LvCatalogEntry } from "./catalog.ts";
import { LvBindingError } from "./errors.ts";
import { changedEngineFiles, changedFiles, engineClosure } from "./fingerprint.ts";
import type { LvEngineClosure, LvFingerprint } from "./fingerprint.ts";
import { lvGitState } from "./gitState.ts";
import type { LvGitState } from "./gitState.ts";
import { LV_IMPORT_MANIFEST } from "./manifest.ts";
import type { LvManifestModule } from "./manifest.ts";
import type { LvApi, LvLensData, LvSurface } from "./types.ts";

/** The file whose presence makes a directory a LensVisualizer checkout, relative to its root. */
export const LV_MARKER = "src/optics/buildLens.ts";

/** A lens taken from the catalog: its index entry and the prescription `buildLens` takes. */
export interface LvLoadedLens {
  readonly entry: LvCatalogEntry;
  readonly data: LvLensData;
}

/** LensVisualizer, loaded: its functions, what identifies the code that was loaded, and its lens catalog. */
export interface LvBinding {
  /** The absolute, symlink-free LV root. */
  readonly root: string;
  /** The exports of the import manifest, each checked to exist and be of its kind when the binding was loaded. */
  readonly api: LvApi;
  /** The closure of the engine files loaded so far; lens prescription files are not part of it. */
  engineClosure(): LvEngineClosure;
  /** The engine closure with the checkout's commit and dirty flag, which are read from git once. */
  fingerprint(): LvFingerprint;
  /**
   * Reads every loaded engine file again and returns those whose bytes are no longer the ones loaded, sorted;
   * empty when the checkout still holds the code that is running.
   */
  rehash(): string[];
  /**
   * The lens files, of those given as the catalog lists them, whose bytes on disk are no longer the ones that were
   * loaded, sorted; empty when the checkout still holds the prescriptions the lenses were built from.
   */
  changedLensFiles(lenses: readonly Pick<LvCatalogEntry, "file" | "fileSha256">[]): string[];
  /** The index of every lens file. The files are imported once; every later call answers from that scan. */
  catalog(): Promise<LvCatalog>;
  /** The lens of a key. Throws an `LvBindingError` of code `unknown-lens`, whose details are the nearest keys. */
  lens(key: string): Promise<LvLoadedLens>;
  /**
   * Removes the loader hooks and forgets the binding, so that another LV tree can be bound in this process. Node
   * keeps the modules it has loaded: the functions of `api` go on working, and a binding made later for the same
   * root still counts their files in its closure. Closing again does nothing.
   */
  close(): void;
}

const bindings = new Map<string, Promise<LvBinding>>();

/**
 * Every file Node has loaded from an LV root in this process: POSIX path relative to the root → sha256 hex of the
 * bytes it was given. A loader records only what is loaded while it is installed, and Node never loads a module
 * twice: the modules of a load that failed, or of a binding that was closed, are still the code that runs. So the
 * record is kept here, by root, and outlives the loader that made it.
 */
const loadedByRoot = new Map<string, Map<string, string>>();

/** The record of a root, brought up to date with what its loader has seen. */
function loadedFiles(root: string, loader: LvLoader): ReadonlyMap<string, string> {
  let record = loadedByRoot.get(root);
  if (record === undefined) loadedByRoot.set(root, (record = new Map()));
  for (const [file, hash] of loader.loadedFiles()) record.set(file, hash);
  return record;
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The LV root in its real form, after checking that it is a LensVisualizer checkout. */
function checkedRoot(lvPath: string | null): string {
  if (lvPath === null) {
    throw new LvBindingError(
      "not-configured",
      "LensVisualizer is not configured: set lvPath in lvrtc.local.json or LVRTC_LV_PATH",
    );
  }
  if (!statSync(lvPath, { throwIfNoEntry: false })?.isDirectory()) {
    throw new LvBindingError("path-missing", `LensVisualizer path is not a directory: ${lvPath}`);
  }
  if (!statSync(join(lvPath, LV_MARKER), { throwIfNoEntry: false })?.isFile()) {
    throw new LvBindingError("not-lv-checkout", `not a LensVisualizer checkout (no ${LV_MARKER}): ${lvPath}`);
  }
  return realpathSync(lvPath);
}

function installLoader(root: string): LvLoader {
  try {
    return installLvLoader(root);
  } catch (error) {
    throw new LvBindingError("loader-conflict", reasonOf(error), [], { cause: error });
  }
}

function importFromRoot(root: string, file: string): Promise<Record<string, unknown>> {
  return import(pathToFileURL(join(root, ...file.split("/"))).href);
}

/**
 * Imports every module of the manifest and checks every export. Everything at fault is listed in one error: the
 * modules that cannot be imported (`import-failed`, which also lists what the other modules lack), or else every
 * export that is missing or of another kind (`exports-missing`).
 */
async function importApi(root: string, manifest: readonly LvManifestModule[]): Promise<LvApi> {
  const failed: string[] = [];
  const missing: string[] = [];
  const api: Record<string, unknown> = {};
  for (const { module, exports } of manifest) {
    let namespace: Record<string, unknown>;
    try {
      namespace = await importFromRoot(root, module);
    } catch (error) {
      failed.push(`${module}: ${reasonOf(error)}`);
      continue;
    }
    for (const { name, as, kind } of exports) {
      const found = typeof namespace[name];
      if (found === kind) api[as] = namespace[name];
      else missing.push(`${module}: ${name} (expected ${kind}, found ${found})`);
    }
  }
  if (failed.length > 0) {
    const also =
      missing.length === 0
        ? ""
        : `; ${missing.length} ${missing.length === 1 ? "export is" : "exports are"} missing: ${missing.join("; ")}`;
    throw new LvBindingError(
      "import-failed",
      `LensVisualizer at ${root}: ${failed.length} of ${manifest.length} modules cannot be imported: ${failed.join("; ")}${also}`,
      [...failed, ...missing],
    );
  }
  if (missing.length > 0) {
    throw new LvBindingError(
      "exports-missing",
      `LensVisualizer at ${root} lacks ${missing.length} of the exports the comparator uses: ${missing.join("; ")}`,
      missing,
    );
  }
  return Object.freeze(api) as unknown as LvApi;
}

async function createBinding(root: string): Promise<LvBinding> {
  const loader = installLoader(root);
  let api: LvApi;
  try {
    api = await importApi(root, LV_IMPORT_MANIFEST);
  } catch (error) {
    // What this attempt loaded stays loaded: the next attempt must still count it.
    loadedFiles(root, loader);
    loader.uninstall();
    throw error;
  }
  const loaded = (): ReadonlyMap<string, string> => loadedFiles(root, loader);

  const loadLensFile = async (file: string): Promise<LoadedLensFile> => {
    const module = await importFromRoot(root, file);
    // The loader hashed the bytes Node was given; the file is read only if something else loaded it unseen.
    const sha256 = loaded().get(file) ?? sha256Hex(readFileSync(join(root, ...file.split("/"))));
    return { module, sha256 };
  };
  let scan: ReturnType<typeof buildCatalog> | undefined;
  const scanned = (): ReturnType<typeof buildCatalog> => (scan ??= buildCatalog(listLensFiles(root), loadLensFile));
  let git: { state: LvGitState | null } | undefined;
  let closed = false;

  return {
    root,
    api,
    engineClosure: () => engineClosure(loaded()),
    fingerprint: () => {
      git ??= { state: lvGitState(root, runSystemCommand) };
      return { ...engineClosure(loaded()), commit: git.state?.commit ?? null, dirty: git.state?.dirty ?? null };
    },
    rehash: () => changedEngineFiles(root, loaded()),
    changedLensFiles: (lenses) => {
      const files = new Map(lenses.map(({ file, fileSha256 }) => [file, fileSha256]));
      return changedFiles(
        root,
        [...files].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
      );
    },
    catalog: async () => (await scanned()).catalog,
    lens: async (key) => {
      const { catalog, data } = await scanned();
      const entry = catalog.entries.find((candidate) => candidate.key === key);
      const lensData = data.get(key);
      if (entry === undefined || lensData === undefined) {
        const near = nearestKeys(
          catalog.entries.map((candidate) => candidate.key),
          key,
        );
        const hint = near.length === 0 ? "" : `; did you mean ${near.join(", ")}?`;
        throw new LvBindingError("unknown-lens", `unknown lens "${key}"${hint}`, near);
      }
      return { entry, data: lensData };
    },
    close: () => {
      // Closing twice must not forget a binding made for the same root in between.
      if (closed) return;
      closed = true;
      loaded();
      loader.uninstall();
      bindings.delete(root);
    },
  };
}

/**
 * Loads LensVisualizer from `lvPath` and returns its binding: installs the loader, imports every module of
 * `LV_IMPORT_MANIFEST` and checks every export, so a function LV has renamed or dropped is found here and not in
 * the middle of a run. There is one binding per process and LV root: a second call for the same checkout, however
 * its path is written, gets the same one.
 *
 * Rejects with an `LvBindingError` whose code says why: `not-configured` (`lvPath` is null), `path-missing`,
 * `not-lv-checkout`, `loader-conflict` (another LV tree is bound in this process), `import-failed` and
 * `exports-missing`, the last two with every module or export at fault in `details`. A load that failed leaves
 * no loader installed and is tried afresh by the next call; the files it did load stay part of the closure.
 */
export function loadLvBinding(lvPath: string | null): Promise<LvBinding> {
  let root: string;
  try {
    root = checkedRoot(lvPath);
  } catch (error) {
    return Promise.reject(error);
  }
  const existing = bindings.get(root);
  if (existing !== undefined) return existing;
  const created = createBinding(root);
  bindings.set(root, created);
  created.catch(() => {
    if (bindings.get(root) === created) bindings.delete(root);
  });
  return created;
}

/**
 * The kind of a surface that LV added to the prescription ("rearPlate" for a filter or cover glass), or null for
 * an authored one. LV keeps the flag on the surface's authored record only, `source.synthetic`; this is the one
 * member the comparator reads from `source`, whose semi-diameter is not the runtime one.
 */
export function syntheticKind(surface: LvSurface): string | null {
  const source = (surface as { readonly source?: { readonly synthetic?: unknown } }).source;
  return typeof source?.synthetic === "string" ? source.synthetic : null;
}
