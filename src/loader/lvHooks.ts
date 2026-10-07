// Synchronous re-implementation of LensVisualizer's resolve rule (LV: scripts/ts-js-specifier-hook.mjs), plus a load
// hook that hashes every LV source Node actually executes.
//
// LV's own hook is asynchronous and registered with `module.register`, so it runs on a separate thread and cannot
// report what it loaded. `module.registerHooks` runs in this thread. Verified on Node 24.15.0:
// - `resolve` and `load` are called synchronously, for `import` and for `require()` alike.
// - `nextLoad` returns the file's bytes before type stripping: a Buffer for `import`, a string for `require()`.
//   A `.ts` module reports format "module-typescript".
// - `import type` is erased before linking, so a type-only module is never resolved or loaded and is not part of
//   the closure.
// - The default resolver returns symlink-free URLs, so the root is compared in its real form.
// - The CommonJS resolver rejects a `file:` URL handed to `nextResolve`, so the rewrite delegates the specifier as
//   written with its extension swapped, not a URL.
// - `deregister()` restores normal resolution; modules already evaluated stay cached under their `.ts` URL.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { registerHooks } from "node:module";
import type { LoadHookSync, ModuleSource, ResolveHookSync } from "node:module";
import { relative, resolve as resolvePath, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** Handle on the installed LV hooks and on the record of what they loaded. */
export interface LvLoader {
  /** Absolute, symlink-free LV root the hooks apply to. */
  readonly root: string;
  /**
   * Every module under the root loaded since installation: POSIX path relative to the root → sha256 hex of the
   * source Node was given. A fresh map sorted by path, so iteration order never depends on load order.
   */
  loadedFiles(): ReadonlyMap<string, string>;
  /** sha256 hex over the sorted `relativePath\0sha256\n` lines; independent of load order. */
  closureHash(): string;
  /**
   * Deregisters the hooks. The record stays readable; calling it again does nothing. Node keeps the modules it
   * has loaded, so a loader installed afterwards starts with an empty record and never sees them again.
   */
  uninstall(): void;
}

let installed: LvLoader | null = null;

function sha256Hex(data: string | NodeJS.ArrayBufferView): string {
  return createHash("sha256").update(data).digest("hex");
}

function byCodeUnit(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The file path of a `file:` URL, or null for anything else. */
function filePathOf(url: string | undefined): string | null {
  if (url === undefined || !url.startsWith("file:")) return null;
  try {
    return fileURLToPath(url);
  } catch {
    return null;
  }
}

function isUnder(root: string, path: string | null): path is string {
  return path !== null && path.startsWith(root + sep);
}

/**
 * LV's rule: a relative, absolute or `file:` specifier ending in ".js" whose target is missing while the sibling
 * ".ts" exists means the ".ts" file. Returns the rewritten specifier, or null when the rule does not apply.
 */
function typescriptSpecifier(root: string, specifier: string, parentURL: string | undefined): string | null {
  if (!specifier.endsWith(".js")) return null;
  const located = ["./", "../", "/", "file:"].some((prefix) => specifier.startsWith(prefix));
  if (!located || !isUnder(root, filePathOf(parentURL))) return null;
  let javascriptPath: string | null;
  try {
    javascriptPath = filePathOf(new URL(specifier, parentURL).href);
  } catch {
    return null;
  }
  if (javascriptPath === null || existsSync(javascriptPath)) return null;
  if (!existsSync(`${javascriptPath.slice(0, -3)}.ts`)) return null;
  return `${specifier.slice(0, -3)}.ts`;
}

/** The bytes to hash for a loaded module; Node returns none for some formats, and then the file itself is read. */
function sourceBytes(source: ModuleSource | null | undefined, path: string): string | NodeJS.ArrayBufferView {
  if (source === undefined || source === null) return readFileSync(path);
  return source instanceof ArrayBuffer ? new Uint8Array(source) : source;
}

function realRoot(lvRoot: string): string {
  const absolute = resolvePath(lvRoot);
  try {
    return realpathSync(absolute);
  } catch (cause) {
    throw new Error(`LensVisualizer root not found: ${absolute}`, { cause });
  }
}

/**
 * Registers the LV resolve and load hooks for one LV root and returns their handle.
 *
 * Only modules whose importer lies under the root get the ".js" → ".ts" rule, so the comparator's own modules
 * resolve exactly as before. Installing again for the same root returns the existing loader; a different root
 * while one is installed throws, because one record cannot describe two trees.
 */
export function installLvLoader(lvRoot: string): LvLoader {
  const root = realRoot(lvRoot);
  if (installed !== null) {
    if (installed.root === root) return installed;
    throw new Error(`The LV loader is already installed for ${installed.root}; it cannot also serve ${root}`);
  }

  const files = new Map<string, string>();

  const resolve: ResolveHookSync = (specifier, context, nextResolve) => {
    const typescript = typescriptSpecifier(root, specifier, context.parentURL);
    if (typescript === null) return nextResolve(specifier, context);
    // LV's hook pins the format as well, so a rewritten module is an ES module whatever its package scope says.
    return { ...nextResolve(typescript, context), format: "module-typescript" };
  };

  const load: LoadHookSync = (url, context, nextLoad) => {
    const result = nextLoad(url, context);
    const path = filePathOf(url);
    if (isUnder(root, path)) {
      // A module loaded again (a query string gives it a new URL) overwrites its earlier entry.
      files.set(relative(root, path).split(sep).join("/"), sha256Hex(sourceBytes(result.source, path)));
    }
    return result;
  };

  const hooks = registerHooks({ resolve, load });
  const sortedFiles = (): [string, string][] => [...files].sort(([a], [b]) => byCodeUnit(a, b));

  const loader: LvLoader = {
    root,
    loadedFiles: () => new Map(sortedFiles()),
    closureHash: () =>
      sha256Hex(
        sortedFiles()
          .map(([path, hash]) => `${path}\0${hash}\n`)
          .join(""),
      ),
    uninstall: () => {
      if (installed !== loader) return;
      hooks.deregister();
      installed = null;
    },
  };
  installed = loader;
  return loader;
}
