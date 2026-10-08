// The adapter revision of a built-in engine: a content hash of the comparator's own code that an answer of the
// engine passes through. An engine's fingerprint says which engine answered: LensVisualizer's own files for `lv`.
// It does not say which comparator asked it, read its trace and wrote the answer down. The adapter revision does,
// so that a fix to the adapter retires what the result store holds, and the engine's fingerprint stays the
// engine's.
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { sha256Hex } from "../core/numeric/hash.ts";

/** The directory of the comparator's sources: the one that holds `engines/`. */
export const SOURCE_DIRECTORY: string = fileURLToPath(new URL("..", import.meta.url));

/**
 * The relative specifier of each import or re-export of a source text that brings in a value. A statement that is
 * `import type` or `export type` brings in none, and is left out: a type has no part in what the code computes.
 */
const VALUE_IMPORT = /^[ \t]*(?:import|export)\b(?![ \t]+type\b)(?:[^"';]*?\bfrom)?[ \t\n]*"(\.{1,2}\/[^"]+)"/gm;

/** What identifies the comparator's code behind one engine. */
export interface AdapterRevision {
  /** sha256 hex over the sorted `relativePath\0sha256\n` lines of the files of the closure. */
  readonly revision: string;
  readonly fileCount: number;
}

/**
 * The TypeScript files of the comparator that `entry` imports a value from, directly or through any chain of such
 * imports, `entry` itself included: POSIX paths relative to `root`, sorted. That is the adapter of an engine and
 * every shared kernel it calls: the array codec, the validator, an estimator. An import that is not relative, that
 * leaves `root` or that is not a `.ts` file (the package's JSON) is no part of it. `entry` is absolute, or relative
 * to `root`.
 */
export function importClosure(entry: string, root: string = SOURCE_DIRECTORY): string[] {
  const base = resolve(root);
  const seen = new Set<string>();
  const pending = [resolve(base, entry)];
  while (pending.length > 0) {
    const file = pending.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const [, specifier] of readFileSync(file, "utf8").matchAll(VALUE_IMPORT)) {
      const imported = resolve(dirname(file), specifier);
      const inside = !relative(base, imported).startsWith("..");
      if (inside && imported.endsWith(".ts") && !seen.has(imported)) pending.push(imported);
    }
  }
  return [...seen].map((file) => relative(base, file).split(sep).join("/")).sort();
}

const revisions = new Map<string, AdapterRevision>();

/**
 * The adapter revision of the engine whose module is `entry`: each file of its import closure is hashed, and the
 * hashes are hashed with the files' paths, in sorted order. It is the same in any checkout of the same sources and
 * another for any edit to a file of the closure, and for a file that joins or leaves it. The files are read once
 * per process and root.
 */
export function adapterRevision(entry: string, root: string = SOURCE_DIRECTORY): AdapterRevision {
  const key = `${resolve(root)}\0${entry}`;
  let known = revisions.get(key);
  if (known === undefined) {
    const files = importClosure(entry, root);
    const lines = files.map((file) => `${file}\0${sha256Hex(readFileSync(join(root, ...file.split("/"))))}\n`);
    known = { revision: sha256Hex(lines.join("")), fileCount: files.length };
    revisions.set(key, known);
  }
  return known;
}
