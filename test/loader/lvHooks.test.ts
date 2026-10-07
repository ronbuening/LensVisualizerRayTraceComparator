import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  cpSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { installLvLoader, type LvLoader } from "../../src/loader/lvHooks.ts";

const FIXTURES = fileURLToPath(new URL("../fixtures/", import.meta.url));

const BUILD_LENS = "src/optics/buildLens.ts";
const CONSTANTS = "src/optics/constants.ts";
const SAG = "src/optics/math/sag.ts";
const FORMAT = "src/utils/format.ts";
const LABEL = "src/utils/label.js";
const LEGACY = "src/utils/legacy.cjs";

interface Tree {
  /** Fresh copy of test/fixtures/fake-lv. */
  readonly lv: string;
  /** Fresh copy of test/fixtures/outside-lv, a sibling of `lv`. */
  readonly outside: string;
}

/**
 * Copies the fixtures to a new temporary directory. Node caches modules by URL for the life of the process, so
 * every test needs its own copy to see its modules resolved and loaded afresh.
 */
function freshTree(t: TestContext): Tree {
  const dir = mkdtempSync(join(tmpdir(), "lvrtc-loader-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(join(FIXTURES, "fake-lv"), join(dir, "fake-lv"), { recursive: true });
  cpSync(join(FIXTURES, "outside-lv"), join(dir, "outside-lv"), { recursive: true });
  return { lv: join(dir, "fake-lv"), outside: join(dir, "outside-lv") };
}

function install(t: TestContext, root: string): LvLoader {
  const loader = installLvLoader(root);
  t.after(() => loader.uninstall());
  return loader;
}

function load(base: string, relativePath: string): Promise<Record<string, unknown>> {
  return import(pathToFileURL(join(base, relativePath)).href);
}

function sha256(data: string | Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

function fileHash(base: string, relativePath: string): string {
  return sha256(readFileSync(join(base, relativePath)));
}

test("a .js specifier under the root resolves to its .ts sibling", async (t) => {
  const tree = freshTree(t);
  install(t, tree.lv);
  const module = await load(tree.lv, BUILD_LENS);
  const buildLens = module.default as (surfaces: { radius: number }[]) => { sagAtUnitHeight: number[] };
  assert.deepEqual(buildLens([{ radius: 0 }, { radius: 2 }]).sagAtUnitHeight, [0, 2 - Math.sqrt(3)]);
});

test("loaded files are recorded by relative path with the sha256 of their bytes", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);
  assert.equal(loader.root, realpathSync(tree.lv));
  assert.equal(loader.loadedFiles().size, 0);

  await load(tree.lv, BUILD_LENS);
  // types.ts is imported with `import type` only: the import is erased, so the file is never loaded.
  assert.deepEqual([...loader.loadedFiles().keys()], [BUILD_LENS, CONSTANTS, SAG]);
  for (const [path, hash] of loader.loadedFiles()) assert.equal(hash, fileHash(tree.lv, path), path);
});

test("a .js specifier whose target exists is left alone", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);
  const module = await load(tree.lv, FORMAT);
  assert.equal((module.describe as (value: number) => string)(1.5), "fake-lv:1.500");
  assert.deepEqual([...loader.loadedFiles().keys()], [CONSTANTS, FORMAT, LABEL]);
  assert.equal(loader.loadedFiles().get(LABEL), fileHash(tree.lv, LABEL));
});

test("absolute-path and file: URL specifiers under the root follow the same rule", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);
  // The fixture's location is known only now, so the importing module is written into the copy.
  writeFileSync(
    join(tree.lv, "src/located.ts"),
    [
      `export { SCALE } from ${JSON.stringify(join(tree.lv, "src/optics/constants.js"))};`,
      `export { sag } from ${JSON.stringify(pathToFileURL(join(tree.lv, "src/optics/math/sag.js")).href)};`,
      "",
    ].join("\n"),
  );
  const module = await load(tree.lv, "src/located.ts");
  assert.equal(module.SCALE, 1);
  assert.equal((module.sag as (radius: number, height: number) => number)(2, 1), 2 - Math.sqrt(3));
  assert.deepEqual([...loader.loadedFiles().keys()], ["src/located.ts", CONSTANTS, SAG]);
});

test("a .js specifier with no .ts sibling, and a bare one, fail as they would without the hooks", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);
  writeFileSync(join(tree.lv, "src/optics/missing.ts"), 'import "./nowhere.js";\n');
  // Bare: a package name, although src/optics/constants.ts sits next to the importing module.
  writeFileSync(join(tree.lv, "src/optics/bare.ts"), 'import "constants.js";\n');
  await assert.rejects(load(tree.lv, "src/optics/missing.ts"), {
    code: "ERR_MODULE_NOT_FOUND",
    message: /nowhere\.js/,
  });
  await assert.rejects(load(tree.lv, "src/optics/bare.ts"), { code: "ERR_MODULE_NOT_FOUND", message: /constants\.js/ });
  assert.ok(!loader.loadedFiles().has(CONSTANTS));
});

test("require() from a CommonJS module under the root follows the same rule", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);
  const module = await load(tree.lv, LEGACY);
  assert.deepEqual(module.default, { scale: 1 });
  assert.deepEqual([...loader.loadedFiles().keys()], [CONSTANTS, LEGACY]);
  for (const [path, hash] of loader.loadedFiles()) assert.equal(hash, fileHash(tree.lv, path), path);
});

test("closureHash does not depend on load order", async (t) => {
  const order = [CONSTANTS, SAG, BUILD_LENS, FORMAT];

  const first = freshTree(t);
  const firstLoader = install(t, first.lv);
  for (const path of order) await load(first.lv, path);
  firstLoader.uninstall();

  const second = freshTree(t);
  const secondLoader = install(t, second.lv);
  for (const path of order.toReversed()) await load(second.lv, path);

  assert.deepEqual([...secondLoader.loadedFiles()], [...firstLoader.loadedFiles()]);
  assert.equal(secondLoader.closureHash(), firstLoader.closureHash());

  const lines = [BUILD_LENS, CONSTANTS, SAG, FORMAT, LABEL].map((path) => `${path}\0${fileHash(first.lv, path)}\n`);
  assert.equal(firstLoader.closureHash(), sha256(lines.join("")));
});

test("closureHash changes when a loaded file's bytes change", async (t) => {
  const pristine = freshTree(t);
  const pristineLoader = install(t, pristine.lv);
  await load(pristine.lv, BUILD_LENS);
  pristineLoader.uninstall();

  const edited = freshTree(t);
  appendFileSync(join(edited.lv, CONSTANTS), "// edited\n");
  const editedLoader = install(t, edited.lv);
  await load(edited.lv, BUILD_LENS);

  assert.notEqual(editedLoader.closureHash(), pristineLoader.closureHash());
  assert.notEqual(editedLoader.loadedFiles().get(CONSTANTS), pristineLoader.loadedFiles().get(CONSTANTS));
  assert.equal(editedLoader.loadedFiles().get(SAG), pristineLoader.loadedFiles().get(SAG));
  assert.equal(editedLoader.loadedFiles().get(BUILD_LENS), pristineLoader.loadedFiles().get(BUILD_LENS));
});

test("a loader that has loaded nothing hashes the empty list", (t) => {
  const tree = freshTree(t);
  assert.equal(install(t, tree.lv).closureHash(), sha256(""));
});

test("a module outside the root is neither rewritten nor recorded", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);

  await assert.rejects(load(tree.outside, "usesJsSpecifier.ts"), { code: "ERR_MODULE_NOT_FOUND" });
  await assert.rejects(load(tree.outside, "reachesIntoLv.ts"), { code: "ERR_MODULE_NOT_FOUND" });
  assert.equal((await load(tree.outside, "usesTsSpecifier.ts")).value, "outside");
  assert.equal(loader.loadedFiles().size, 0);

  // A directory whose name merely starts with the root's name is outside the root too.
  const lookalike = `${tree.lv}-2`;
  cpSync(tree.outside, lookalike, { recursive: true });
  await assert.rejects(load(lookalike, "usesJsSpecifier.ts"), { code: "ERR_MODULE_NOT_FOUND" });
  assert.equal((await load(lookalike, "usesTsSpecifier.ts")).value, "outside");
  assert.equal(loader.loadedFiles().size, 0);

  // An explicit .ts specifier from outside reaches LV, whose own .js imports are then rewritten.
  const bridge = await load(tree.outside, "bridge.ts");
  assert.deepEqual((bridge.lens as { sagAtUnitHeight: number[] }).sagAtUnitHeight, [2 - Math.sqrt(3)]);
  assert.deepEqual([...loader.loadedFiles().keys()], [BUILD_LENS, CONSTANTS, SAG]);
});

test("a root given through a symlink is matched by its real path", async (t) => {
  const tree = freshTree(t);
  const link = join(tree.lv, "..", "linked-lv");
  symlinkSync(tree.lv, link, "dir");
  const loader = install(t, link);
  assert.equal(loader.root, realpathSync(tree.lv));
  await load(link, BUILD_LENS);
  assert.deepEqual([...loader.loadedFiles().keys()], [BUILD_LENS, CONSTANTS, SAG]);
});

test("uninstall restores normal resolution and freezes the record", async (t) => {
  const tree = freshTree(t);
  const loader = install(t, tree.lv);
  await load(tree.lv, BUILD_LENS);
  const before = [...loader.loadedFiles()];
  const hashBefore = loader.closureHash();

  loader.uninstall();
  loader.uninstall();
  await assert.rejects(load(tree.lv, FORMAT), { code: "ERR_MODULE_NOT_FOUND" });
  assert.deepEqual([...loader.loadedFiles()], before);
  assert.equal(loader.closureHash(), hashBefore);
});

test("one loader at a time: the same root is shared, another root is refused", (t) => {
  const first = freshTree(t);
  const second = freshTree(t);
  const loader = install(t, first.lv);

  assert.equal(installLvLoader(first.lv), loader);
  assert.equal(installLvLoader(join(first.lv, "src", "..")), loader);
  assert.throws(() => installLvLoader(second.lv), /already installed for /);

  loader.uninstall();
  const replacement = install(t, second.lv);
  assert.notEqual(replacement, loader);
  assert.equal(replacement.root, realpathSync(second.lv));
});

test("a root that does not exist is refused", (t) => {
  const tree = freshTree(t);
  assert.throws(() => installLvLoader(join(tree.lv, "nope")), /LensVisualizer root not found: .*nope/);
  // Nothing was installed, so a real root is still accepted.
  install(t, tree.lv);
});
