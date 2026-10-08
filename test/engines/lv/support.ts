// What the hermetic tests of the LensVisualizer binding share: a fake LV tree, copied afresh for every test.
import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";

/** The fake LV tree: every module and export of the import manifest, trivially implemented, and three lenses. */
export const FAKE_LV: string = fileURLToPath(new URL("../../fixtures/fake-lv-binding", import.meta.url));

/** The engine files the fake tree loads for the manifest, sorted: everything but its lens and type files. */
export const FAKE_ENGINE_FILES: readonly string[] = [
  "src/lens-data/defaults.ts",
  "src/optics/analysis/mtfSupport.ts",
  "src/optics/analysis/mtfTracing.ts",
  "src/optics/apertureStop.ts",
  "src/optics/buildLens.ts",
  "src/optics/compat.ts",
  "src/optics/first-order/cardinals.ts",
  "src/optics/first-order/systemMatrix.ts",
  "src/optics/math/paraxial.ts",
  "src/optics/trace/aperture.ts",
];

/** The lens files of the fake tree, sorted, with the key of each. */
export const FAKE_LENS_FILES: readonly (readonly [file: string, key: string])[] = [
  ["src/lens-data/acme/AcmeSinglet50.data.ts", "acme-singlet-50"],
  ["src/lens-data/acme/AcmeZoom2448.data.ts", "acme-zoom-24-48"],
  ["src/lens-data/zenith/ZenithDoublet100.data.ts", "zenith-doublet-100"],
];

/**
 * A fresh copy of the fake tree in a temporary directory, removed after the test. Node caches modules by URL and
 * the loader serves one tree at a time, so every test binds its own copy and closes the binding when it ends.
 */
export function freshLv(t: TestContext): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-binding-")));
  const lv = join(dir, "lv");
  cpSync(FAKE_LV, lv, { recursive: true });
  t.after(async () => {
    await closeBinding(lv);
    rmSync(dir, { recursive: true, force: true });
  });
  return lv;
}

/** Closes the binding of a tree if there is one, so that the next test can bind another tree. */
export async function closeBinding(lv: string): Promise<void> {
  const binding = await loadLvBinding(lv).catch(() => null);
  binding?.close();
}

/** Binds a tree; the binding is closed when the test ends. */
export async function bind(t: TestContext, lv: string): Promise<LvBinding> {
  const binding = await loadLvBinding(lv);
  t.after(() => binding.close());
  return binding;
}

/** sha256 hex of a string or of bytes. */
export function sha256(data: string | Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

/** sha256 hex of a file of a tree, named by its POSIX path relative to the tree. */
export function fileHash(lv: string, file: string): string {
  return sha256(readFileSync(join(lv, ...file.split("/"))));
}

/** The closure hash of the given files of a tree, as the binding defines it. */
export function closureOf(lv: string, files: readonly string[]): string {
  return sha256(files.map((file) => `${file}\0${fileHash(lv, file)}\n`).join(""));
}
