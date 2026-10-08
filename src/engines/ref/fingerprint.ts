// The reference engine's fingerprint: a content hash of its own source files, so that a result is keyed by the
// code that computed it and an edit to the engine retires what the store holds of it.
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { sha256Hex } from "../../core/numeric/hash.ts";

/** The directory of the reference engine's sources: the one this file is in. */
export const REF_SOURCE_DIRECTORY: string = fileURLToPath(new URL(".", import.meta.url));

/** What identifies the reference engine's code. */
export interface RefFingerprint {
  /** sha256 hex over the sorted `relativePath\0sha256\n` lines of the engine's source files. */
  readonly fingerprint: string;
  readonly fileCount: number;
}

/**
 * The fingerprint of the TypeScript files under `directory`, at any depth: each file's bytes are hashed, and the
 * hashes are hashed with the files' paths, relative to the directory and with `/`, in sorted order. So it is the
 * same in any checkout of the same sources, and another for any edit, added file or renamed file.
 */
export function refFingerprint(directory: string = REF_SOURCE_DIRECTORY): RefFingerprint {
  const files = readdirSync(directory, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.split(sep).join("/"))
    .sort();
  const lines = files.map((file) => `${file}\0${sha256Hex(readFileSync(join(directory, ...file.split("/"))))}\n`);
  return { fingerprint: sha256Hex(lines.join("")), fileCount: files.length };
}
