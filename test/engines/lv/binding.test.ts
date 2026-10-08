import assert from "node:assert/strict";
import {
  appendFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { loadLvBinding, syntheticKind } from "../../../src/engines/lv/binding.ts";
import { LvBindingError } from "../../../src/engines/lv/errors.ts";
import { LV_IMPORT_MANIFEST } from "../../../src/engines/lv/manifest.ts";
import { summarizeState } from "../../../src/engines/lv/stateSummary.ts";
import { FAKE_ENGINE_FILES, FAKE_LENS_FILES, bind, closureOf, fileHash, freshLv } from "./support.ts";

/** Asserts that a load is refused with the given code and returns the error. */
async function refused(load: Promise<unknown>, code: string): Promise<LvBindingError> {
  const error = await load.then(
    () => null,
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof LvBindingError, `expected an LvBindingError, got ${String(error)}`);
  assert.equal(error.code, code, error.message);
  return error;
}

test("the manifest names each module once and each facade name once", () => {
  const modules = LV_IMPORT_MANIFEST.map((entry) => entry.module);
  assert.equal(new Set(modules).size, modules.length);
  const names = LV_IMPORT_MANIFEST.flatMap((entry) => entry.exports.map((item) => item.as));
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.includes("buildLens"), "the default export of buildLens.ts is on the facade as buildLens");
});

test("a tree with every module and export loads, and the facade holds every manifest name", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  assert.equal(binding.root, lv);
  const names = LV_IMPORT_MANIFEST.flatMap((entry) => entry.exports.map((item) => item.as)).sort();
  assert.deepEqual(Object.keys(binding.api).sort(), names);
  for (const { as, kind } of LV_IMPORT_MANIFEST.flatMap((entry) => [...entry.exports])) {
    assert.equal(typeof (binding.api as unknown as Record<string, unknown>)[as], kind, as);
  }
  assert.ok(Object.isFrozen(binding.api));
});

test("there is one binding per process and LV root, however the path is written", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  assert.equal(await loadLvBinding(lv), binding);
  assert.equal(await loadLvBinding(join(lv, "src", "..")), binding);
  const link = join(lv, "..", "linked");
  symlinkSync(lv, link, "dir");
  assert.equal(await loadLvBinding(link), binding);
});

test("another tree cannot be bound while one is, and can once it is closed", async (t) => {
  const first = freshLv(t);
  const second = freshLv(t);
  const binding = await loadLvBinding(first);
  const error = await refused(loadLvBinding(second), "loader-conflict");
  assert.match(error.message, /already installed for /);
  binding.close();
  assert.equal((await bind(t, second)).root, second);
});

test("no path, a missing path and a directory that is not an LV checkout are told apart", async (t) => {
  assert.match((await refused(loadLvBinding(null), "not-configured")).message, /lvPath/);

  const lv = freshLv(t);
  assert.match((await refused(loadLvBinding(join(lv, "nowhere")), "path-missing")).message, /nowhere/);
  assert.match((await refused(loadLvBinding(join(lv, "package.json")), "path-missing")).message, /not a directory/);

  const empty = mkdtempSync(join(tmpdir(), "lvrtc-not-lv-"));
  t.after(() => rmSync(empty, { recursive: true, force: true }));
  mkdirSync(join(empty, "src", "optics"), { recursive: true });
  assert.match((await refused(loadLvBinding(empty), "not-lv-checkout")).message, /no src\/optics\/buildLens\.ts/);
});

test("a tree missing one module fails with that module named, and leaves no loader behind", async (t) => {
  const lv = freshLv(t);
  rmSync(join(lv, "src/optics/analysis/mtfTracing.ts"));
  const error = await refused(loadLvBinding(lv), "import-failed");
  assert.equal(error.details.length, 1);
  assert.match(error.details[0], /^src\/optics\/analysis\/mtfTracing\.ts: /);
  assert.match(error.message, /1 of 18 modules cannot be imported/);

  // The failed load uninstalled the loader, so a good tree binds in the same process.
  await bind(t, freshLv(t));
});

test("every module that cannot be imported is listed in one error", async (t) => {
  const lv = freshLv(t);
  rmSync(join(lv, "src/optics/analysis/mtfTracing.ts"));
  writeFileSync(join(lv, "src/optics/analysis/mtfSupport.ts"), 'throw new Error("mtfSupport is broken");\n');
  const error = await refused(loadLvBinding(lv), "import-failed");
  // The MTF barrel takes its gate from the broken module, so it cannot be imported either.
  assert.deepEqual(
    error.details.map((detail) => detail.split(": ")[0]),
    ["src/optics/analysis/mtfSupport.ts", "src/optics/analysis/mtfTracing.ts", "src/optics/mtf.ts"],
  );
  assert.match(error.details[0], /mtfSupport is broken/);
});

test("a module that cannot be imported and an export missing elsewhere are named in the same error", async (t) => {
  const lv = freshLv(t);
  rmSync(join(lv, "src/optics/analysis/mtfTracing.ts"));
  writeFileSync(join(lv, "src/optics/trace/aperture.ts"), "export const renamedAperture = 1;\n");
  const error = await refused(loadLvBinding(lv), "import-failed");
  assert.equal(error.details.length, 2);
  assert.match(error.details[0], /^src\/optics\/analysis\/mtfTracing\.ts: /);
  assert.equal(error.details[1], "src/optics/trace/aperture.ts: evaluateAperture (expected function, found undefined)");
  assert.match(
    error.message,
    /1 of 18 modules cannot be imported: .*; 1 export is missing: src\/optics\/trace\/aperture/,
  );
});

test("a tree missing two exports fails with both named", async (t) => {
  const lv = freshLv(t);
  // One export renamed away, one that is no longer a function.
  writeFileSync(join(lv, "src/optics/aperture.ts"), "export const renamedSlider = (): undefined => undefined;\n");
  writeFileSync(join(lv, "src/optics/trace/aperture.ts"), "export const evaluateAperture = 3;\n");
  const error = await refused(loadLvBinding(lv), "exports-missing");
  assert.deepEqual(error.details, [
    "src/optics/aperture.ts: fNumberAtStopdown (expected function, found undefined)",
    "src/optics/trace/aperture.ts: evaluateAperture (expected function, found number)",
  ]);
  for (const detail of error.details) assert.ok(error.message.includes(detail), detail);
  assert.match(error.message, /lacks 2 of the exports/);

  await bind(t, freshLv(t));
});

test("a default export that is missing is named as default", async (t) => {
  const lv = freshLv(t);
  writeFileSync(join(lv, "src/optics/buildLens.ts"), "export const notTheDefault = 1;\n");
  const error = await refused(loadLvBinding(lv), "exports-missing");
  assert.deepEqual(error.details, ["src/optics/buildLens.ts: default (expected function, found undefined)"]);
});

test("the fingerprint covers the loaded engine files and no lens file", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const expected = { engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES), engineFileCount: FAKE_ENGINE_FILES.length };
  assert.deepEqual(binding.engineClosure(), expected);
  // A temporary directory is under no git repository.
  assert.deepEqual(binding.fingerprint(), { ...expected, commit: null, dirty: null });

  const catalog = await binding.catalog();
  assert.equal(catalog.entries.length, FAKE_LENS_FILES.length);
  assert.deepEqual(binding.engineClosure(), expected, "scanning the catalog loads lens files only");
  assert.deepEqual(binding.fingerprint(), { ...expected, commit: null, dirty: null });
});

test("a changed lens file leaves the engine fingerprint alone; a changed engine file changes it", async (t) => {
  const pristine = freshLv(t);
  const pristineBinding = await loadLvBinding(pristine);
  await pristineBinding.catalog();
  const reference = pristineBinding.engineClosure();
  pristineBinding.close();

  const lensEdited = freshLv(t);
  appendFileSync(join(lensEdited, FAKE_LENS_FILES[0][0]), "// edited\n");
  appendFileSync(join(lensEdited, "src/lens-data/acme/AcmeTc14.teleconverter.ts"), "// edited\n");
  const lensBinding = await loadLvBinding(lensEdited);
  const catalog = await lensBinding.catalog();
  assert.deepEqual(lensBinding.engineClosure(), reference);
  assert.equal(catalog.entries[0].fileSha256, fileHash(lensEdited, FAKE_LENS_FILES[0][0]));
  assert.notEqual(catalog.entries[0].fileSha256, fileHash(pristine, FAKE_LENS_FILES[0][0]));
  lensBinding.close();

  const engineEdited = freshLv(t);
  appendFileSync(join(engineEdited, "src/lens-data/defaults.ts"), "// edited\n");
  const engineBinding = await bind(t, engineEdited);
  assert.notEqual(engineBinding.engineClosure().engineClosureHash, reference.engineClosureHash);
  assert.equal(engineBinding.engineClosure().engineFileCount, reference.engineFileCount);
});

test("rehash names the engine files edited or removed after load, and no lens file", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  await binding.catalog();
  const before = binding.engineClosure();
  assert.deepEqual(binding.rehash(), []);

  appendFileSync(join(lv, FAKE_LENS_FILES[1][0]), "// edited after load\n");
  assert.deepEqual(binding.rehash(), [], "a lens file is not engine code");

  appendFileSync(join(lv, "src/optics/math/paraxial.ts"), "// edited after load\n");
  assert.deepEqual(binding.rehash(), ["src/optics/math/paraxial.ts"]);
  rmSync(join(lv, "src/optics/apertureStop.ts"));
  assert.deepEqual(binding.rehash(), ["src/optics/apertureStop.ts", "src/optics/math/paraxial.ts"]);
  // The fingerprint goes on describing the code that was loaded and is running.
  assert.deepEqual(binding.engineClosure(), before);
});

test("a tree bound again after close still reports everything Node loaded from it", async (t) => {
  const lv = freshLv(t);
  const first = await loadLvBinding(lv);
  const closure = first.engineClosure();
  const hashes = (await first.catalog()).entries.map((entry) => entry.fileSha256);
  assert.equal(closure.engineFileCount, FAKE_ENGINE_FILES.length);
  first.close();

  // Node keeps the modules it loaded, so the second loader sees none of them load: the record must outlive it.
  appendFileSync(join(lv, FAKE_LENS_FILES[0][0]), "// edited after it was loaded\n");
  appendFileSync(join(lv, "src/optics/math/paraxial.ts"), "// edited after it was loaded\n");
  const second = await bind(t, lv);
  assert.notEqual(second, first);
  assert.deepEqual(second.engineClosure(), closure);
  assert.deepEqual(
    (await second.catalog()).entries.map((entry) => entry.fileSha256),
    hashes,
    "a lens file's hash is that of the bytes that were loaded, not of the file as it is now",
  );
  assert.deepEqual(second.rehash(), ["src/optics/math/paraxial.ts"]);
});

test("a load tried again after it failed reports the engine files the failed attempt loaded too", async (t) => {
  const lv = freshLv(t);
  const module = join(lv, "src/optics/analysis/mtfTracing.ts");
  renameSync(module, `${module}.away`);
  await refused(loadLvBinding(lv), "import-failed");

  renameSync(`${module}.away`, module);
  const binding = await bind(t, lv);
  assert.deepEqual(binding.engineClosure(), {
    engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES),
    engineFileCount: FAKE_ENGINE_FILES.length,
  });
  assert.deepEqual(binding.rehash(), []);
});

test("the catalog indexes every lens file by key, with the hash of the file", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const catalog = await binding.catalog();
  assert.deepEqual(catalog, {
    fileCount: 3,
    entries: [
      {
        key: "acme-singlet-50",
        file: FAKE_LENS_FILES[0][0],
        fileSha256: fileHash(lv, FAKE_LENS_FILES[0][0]),
        name: "ACME Singlet 50mm f/4",
      },
      {
        key: "acme-zoom-24-48",
        file: FAKE_LENS_FILES[1][0],
        fileSha256: fileHash(lv, FAKE_LENS_FILES[1][0]),
        name: "ACME Zoom 24-48mm f/4",
        zoom: true,
      },
      {
        key: "zenith-doublet-100",
        file: FAKE_LENS_FILES[2][0],
        fileSha256: fileHash(lv, FAKE_LENS_FILES[2][0]),
        name: "ZENITH Doublet 100mm f/8",
      },
    ],
    problems: [],
  });
  assert.equal(await binding.catalog(), catalog, "the scan is done once");
});

test("a lens is loaded by key from the one scan, and an unknown key suggests near ones", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const lens = await binding.lens("acme-zoom-24-48");
  assert.equal(lens.entry.file, FAKE_LENS_FILES[1][0]);
  assert.equal(lens.data.key, "acme-zoom-24-48");
  assert.deepEqual(lens.data.zoomPositions, [24, 48]);
  // A lens file written after the scan is not seen: the index is cached for the life of the binding.
  writeFileSync(join(lv, "src/lens-data/acme/Late.data.ts"), 'export default { key: "late", name: "Late" };\n');
  assert.equal((await binding.lens("acme-zoom-24-48")).data, lens.data);

  const error = await refused(binding.lens("acme-zoom-2448"), "unknown-lens");
  assert.equal(error.message, 'unknown lens "acme-zoom-2448"; did you mean acme-zoom-24-48?');
  assert.deepEqual(error.details, ["acme-zoom-24-48"]);
  assert.equal((await refused(binding.lens("late"), "unknown-lens")).message, 'unknown lens "late"');
});

test("duplicate keys and bad lens files are reported together and left out of the index", async (t) => {
  const lv = freshLv(t);
  const data = join(lv, "src/lens-data");
  mkdirSync(join(data, "zenith/deep/er"), { recursive: true });
  writeFileSync(join(data, "zenith/deep/er/Deep.data.ts"), 'export default { key: "deep", name: "Deep" };\n');
  writeFileSync(join(data, "zenith/Copy.data.ts"), 'export default { key: "acme-singlet-50", name: "Copy" };\n');
  writeFileSync(join(data, "zenith/NoDefault.data.ts"), "export const LENS = { key: 'x', name: 'x' };\n");
  writeFileSync(join(data, "zenith/NoKey.data.ts"), 'export default { name: "No key" };\n');
  writeFileSync(join(data, "zenith/NumberKey.data.ts"), 'export default { key: 7, name: "Number key" };\n');
  writeFileSync(join(data, "zenith/NoName.data.ts"), 'export default { key: "no-name" };\n');
  writeFileSync(join(data, "zenith/Throws.data.ts"), 'throw new Error("bad lens file");\n');

  const binding = await bind(t, lv);
  const catalog = await binding.catalog();
  assert.equal(catalog.fileCount, 10);
  assert.deepEqual(
    catalog.entries.map((entry) => entry.key),
    ["acme-zoom-24-48", "deep", "zenith-doublet-100"],
  );
  assert.equal(catalog.entries[1].file, "src/lens-data/zenith/deep/er/Deep.data.ts");
  assert.deepEqual(catalog.problems, [
    {
      file: "src/lens-data/acme/AcmeSinglet50.data.ts",
      problem: 'duplicate key "acme-singlet-50" (also in src/lens-data/zenith/Copy.data.ts)',
    },
    {
      file: "src/lens-data/zenith/Copy.data.ts",
      problem: 'duplicate key "acme-singlet-50" (also in src/lens-data/acme/AcmeSinglet50.data.ts)',
    },
    { file: "src/lens-data/zenith/NoDefault.data.ts", problem: "no default export that is an object" },
    { file: "src/lens-data/zenith/NoKey.data.ts", problem: "no string key" },
    { file: "src/lens-data/zenith/NoName.data.ts", problem: 'no string name (key "no-name")' },
    { file: "src/lens-data/zenith/NumberKey.data.ts", problem: "no string key" },
    { file: "src/lens-data/zenith/Throws.data.ts", problem: "cannot be imported: bad lens file" },
  ]);
  await refused(binding.lens("acme-singlet-50"), "unknown-lens");
});

test("a tree without src/lens-data has an empty catalog", async (t) => {
  const lv = freshLv(t);
  // compat.ts imports defaults.ts from the directory, so the fake engine is given one that does not.
  rmSync(join(lv, "src/lens-data"), { recursive: true });
  const compat = join(lv, "src/optics/compat.ts");
  writeFileSync(
    join(lv, "src/optics/defaults.ts"),
    "export const DEFAULT_FOPEN = 2;\nexport const FLAT_RADIUS = 1e15;\n",
  );
  writeFileSync(compat, readFileSync(compat, "utf8").replace("../lens-data/defaults.js", "./defaults.js"));
  const binding = await bind(t, lv);
  assert.deepEqual(await binding.catalog(), { fileCount: 0, entries: [], problems: [] });
});

test("a prepared state is summarized from the state itself", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { data } = await binding.lens("acme-zoom-24-48");
  const runtime = binding.api.buildLens(data);
  const state = binding.api.prepareRuntimeState(runtime, 0, 1);
  const summary = summarizeState(state);
  assert.deepEqual(
    { ...summary, surfaces: summary.surfaces.length },
    {
      focusT: 0,
      zoomT: 1,
      surfaceCount: 7,
      stopIndex: 2,
      stopRadius: 6,
      lastLensSurfaceIndex: 4,
      imgZ: 52,
      surfaces: 7,
    },
  );
  // The runtime stop radius follows the zoom; the authored one (3) is that of the wide end only.
  assert.equal(summary.stopRadius, binding.api.wideOpenStopAtZoom(1, runtime));
  assert.equal(summarizeState(binding.api.prepareRuntimeState(runtime, 0, 0)).stopRadius, 3);
  assert.deepEqual(summary.surfaces[1], {
    index: 1,
    label: "2A",
    R: -80,
    d: 2,
    nd: 1,
    sd: 9,
    z: 13,
    asphere: true,
    synthetic: null,
  });
  assert.deepEqual(summary.surfaces[2], {
    index: 2,
    label: "STO",
    R: null,
    d: 2,
    nd: 1,
    sd: 6,
    z: 15,
    asphere: false,
    synthetic: null,
  });
  assert.deepEqual(
    summary.surfaces.map((surface) => surface.synthetic),
    [null, null, null, null, null, "rearPlate", "rearPlate"],
  );
  assert.equal(syntheticKind(state.surfaces[6]), "rearPlate");
  assert.equal(syntheticKind(state.surfaces[0]), null);
});
