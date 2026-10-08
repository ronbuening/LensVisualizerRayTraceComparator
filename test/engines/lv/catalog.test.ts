import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCatalog, listLensFiles, nearestKeys } from "../../../src/engines/lv/catalog.ts";
import { engineClosure, engineFiles, isLensPrescriptionFile } from "../../../src/engines/lv/fingerprint.ts";
import { FAKE_LENS_FILES, FAKE_LV, sha256 } from "./support.ts";

test("lens files are found at any depth, sorted, and nothing else is", () => {
  assert.deepEqual(
    listLensFiles(FAKE_LV),
    FAKE_LENS_FILES.map(([file]) => file),
  );
  assert.deepEqual(listLensFiles("/no/such/lensvisualizer"), []);
});

test("a prescription file is a .data.ts or .teleconverter.ts under src/lens-data, and nothing else", () => {
  for (const file of [
    "src/lens-data/acme/AcmeSinglet50.data.ts",
    "src/lens-data/acme/AcmeTc14.teleconverter.ts",
    "src/lens-data/a/b/c/Deep.data.ts",
    "src/lens-data/Top.data.ts",
  ]) {
    assert.equal(isLensPrescriptionFile(file), true, file);
  }
  for (const file of [
    "src/lens-data/defaults.ts",
    "src/optics/buildLens.ts",
    "src/optics/fixtures/Sample.data.ts",
    "src/lens-data-extra/X.data.ts",
    "src/lens-data/acme/AcmeSinglet50.data.js",
  ]) {
    assert.equal(isLensPrescriptionFile(file), false, file);
  }
});

test("the engine closure hashes the sorted path and hash lines of the engine files only", () => {
  const loaded = new Map([
    ["src/lens-data/acme/A.data.ts", "11"],
    ["src/lens-data/defaults.ts", "22"],
    ["src/lens-data/x/T.teleconverter.ts", "33"],
    ["src/optics/buildLens.ts", "44"],
  ]);
  assert.deepEqual(engineFiles(loaded), [
    ["src/lens-data/defaults.ts", "22"],
    ["src/optics/buildLens.ts", "44"],
  ]);
  assert.deepEqual(engineClosure(loaded), {
    engineClosureHash: sha256("src/lens-data/defaults.ts\x0022\nsrc/optics/buildLens.ts\x0044\n"),
    engineFileCount: 2,
  });
  assert.deepEqual(engineClosure(new Map()), { engineClosureHash: sha256(""), engineFileCount: 0 });
  // The order in which the files were loaded, or are listed, is not part of the closure.
  assert.deepEqual(engineClosure(new Map([...loaded].reverse())), engineClosure(loaded));
  assert.deepEqual(engineFiles(new Map([...loaded].reverse())), engineFiles(loaded));
});

test("the catalog is sorted by key whatever the order of the files", async () => {
  const modules: Record<string, unknown> = {
    "b.data.ts": { key: "zeta", name: "Zeta", zoomPositions: [1, 2] },
    "a.data.ts": { key: "alpha", name: "Alpha", zoomPositions: [1] },
  };
  const { catalog, data } = await buildCatalog(["b.data.ts", "a.data.ts"], async (file) => ({
    module: { default: modules[file] },
    sha256: `hash of ${file}`,
  }));
  assert.deepEqual(catalog, {
    fileCount: 2,
    entries: [
      // One zoom position is not a zoom, as LensVisualizer decides it.
      { key: "alpha", file: "a.data.ts", fileSha256: "hash of a.data.ts", name: "Alpha" },
      { key: "zeta", file: "b.data.ts", fileSha256: "hash of b.data.ts", name: "Zeta", zoom: true },
    ],
    problems: [],
  });
  assert.equal(data.get("zeta"), modules["b.data.ts"]);
});

test("three files of one key are all reported, each naming the other two", async () => {
  const { catalog, data } = await buildCatalog(["a", "b", "c"], async () => ({
    module: { default: { key: "same", name: "Same" } },
    sha256: "",
  }));
  assert.deepEqual(catalog.entries, []);
  assert.deepEqual(catalog.problems, [
    { file: "a", problem: 'duplicate key "same" (also in b, c)' },
    { file: "b", problem: 'duplicate key "same" (also in a, c)' },
    { file: "c", problem: 'duplicate key "same" (also in a, b)' },
  ]);
  assert.equal(data.size, 0);
});

test("near keys: containment first, then a few edits, best first", () => {
  const keys = [
    "nikkor-z50f12",
    "nikkor-z50f18",
    "nikon-z-24-70f4s",
    "canon-ef-135-f2l-usm",
    "sigma-35mm-f14-dg-hsm-a",
  ];
  assert.deepEqual(nearestKeys(keys, "nikkor-z50f1.2"), ["nikkor-z50f12", "nikkor-z50f18"]);
  assert.deepEqual(nearestKeys(keys, "nikkor-z50"), ["nikkor-z50f12", "nikkor-z50f18"]);
  assert.deepEqual(nearestKeys(keys, "NIKKOR-Z50F12"), ["nikkor-z50f12", "nikkor-z50f18"]);
  assert.deepEqual(nearestKeys(keys, "canon-ef-135-f2l-usm-ii"), ["canon-ef-135-f2l-usm"]);
  assert.deepEqual(nearestKeys(keys, "nikkor", 1), ["nikkor-z50f12"]);
  assert.deepEqual(nearestKeys(keys, "leica-summilux"), []);
  assert.deepEqual(nearestKeys(keys, ""), []);
});
