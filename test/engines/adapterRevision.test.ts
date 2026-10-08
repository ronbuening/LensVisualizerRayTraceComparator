// The adapter revision: a content hash of the comparator's own code behind a built-in engine, beside the engine's
// fingerprint and apart from it.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { engineStamp } from "../../src/contract/engine.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { SOURCE_DIRECTORY, adapterRevision, importClosure } from "../../src/engines/adapterRevision.ts";
import { LV_ENGINE_MODULE } from "../../src/engines/lv/engine.ts";
import { REF_ENGINE_MODULE, createRefEngine, refDescriptor } from "../../src/engines/ref/engine.ts";
import { refFingerprint } from "../../src/engines/ref/fingerprint.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { SINGLET_CASE, REQUEST_MINIMAL } from "../contract/corpus.ts";
import { tempDir } from "../core/support.ts";

/** A source tree in a temporary directory, from POSIX path to text. */
function tree(t: TestContext, files: Readonly<Record<string, string>>): string {
  const root = tempDir(t);
  for (const [file, text] of Object.entries(files)) {
    const path = join(root, ...file.split("/"));
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  return root;
}

const TREE = {
  "engines/a/engine.ts": [
    'import { helper } from "./helper.ts";',
    'import type { OnlyAType } from "./types.ts";',
    'import { codec } from "../../core/codec.ts";',
    'import packageJson from "../../../package.json" with { type: "json" };',
    'import { readFileSync } from "node:fs";',
    "export const engine = [helper, codec, packageJson, readFileSync] as OnlyAType[];",
    "",
  ].join("\n"),
  "engines/a/helper.ts": 'export { deep as helper } from "./deep/deep.ts";\n',
  "engines/a/deep/deep.ts": [
    "import {",
    "  kernel,",
    "  other,",
    '} from "../../../core/kernel.ts";',
    "export const deep = [kernel, other];",
    "",
  ].join("\n"),
  "engines/a/types.ts": 'import { unused } from "./unused.ts";\nexport type OnlyAType = typeof unused;\n',
  "engines/a/unused.ts": "export const unused = 1;\n",
  "engines/b/engine.ts": 'import { codec } from "../../core/codec.ts";\nexport const engine = codec;\n',
  "core/codec.ts": "export const codec = 1;\n",
  "core/kernel.ts": 'import "./sideEffect.ts";\nexport const kernel = 1;\nexport const other = 2;\n',
  "core/sideEffect.ts": '// import { never } from "./never.ts";\nexport {};\n',
  "core/never.ts": "export const never = 1;\n",
};

test("the closure of an engine is every file of the comparator it imports a value from, however far down", (t) => {
  const root = tree(t, TREE);
  assert.deepEqual(importClosure("engines/a/engine.ts", root), [
    "core/codec.ts",
    "core/kernel.ts",
    "core/sideEffect.ts",
    "engines/a/deep/deep.ts",
    "engines/a/engine.ts",
    "engines/a/helper.ts",
  ]);
  // A type takes no part in what the code computes; neither does a file only a type-only import leads to, an
  // import in a comment, a package, or a file that is not TypeScript.
  assert.deepEqual(importClosure("engines/b/engine.ts", root), ["core/codec.ts", "engines/b/engine.ts"]);
  // The entry may be given absolutely.
  assert.deepEqual(
    importClosure(join(root, "engines", "b", "engine.ts"), root),
    importClosure("engines/b/engine.ts", root),
  );
});

test("the revision is the hash of the closure's paths and contents: any edit, and any file that joins, changes it", (t) => {
  const root = tree(t, TREE);
  const { revision, fileCount } = adapterRevision("engines/a/engine.ts", root);
  assert.equal(fileCount, 6);
  const files = importClosure("engines/a/engine.ts", root);
  const lines = files.map((file) => `${file}\0${sha256Hex((TREE as Record<string, string>)[file])}\n`);
  assert.equal(revision, sha256Hex(lines.join("")));
  // Another engine over the same kernel has another revision.
  assert.notEqual(adapterRevision("engines/b/engine.ts", root).revision, revision);
  // It is read once per process: the same answer again, whatever happens to the files meanwhile.
  writeFileSync(join(root, "core", "codec.ts"), "export const codec = 2;\n");
  assert.deepEqual(adapterRevision("engines/a/engine.ts", root), { revision, fileCount });

  // The same sources elsewhere have the same revision; an edit to a shared kernel changes it for every engine on
  // it, and an edit to a file outside the closure changes nothing.
  const same = tree(t, TREE);
  assert.equal(adapterRevision("engines/a/engine.ts", same).revision, revision);
  const kernelEdited = tree(t, { ...TREE, "core/codec.ts": "export const codec = 2;\n" });
  assert.notEqual(adapterRevision("engines/a/engine.ts", kernelEdited).revision, revision);
  assert.notEqual(
    adapterRevision("engines/b/engine.ts", kernelEdited).revision,
    adapterRevision("engines/b/engine.ts", same).revision,
  );
  const outside = tree(t, { ...TREE, "engines/a/unused.ts": "export const unused = 2;\n", "core/never.ts": "" });
  assert.equal(adapterRevision("engines/a/engine.ts", outside).revision, revision);
  const typesEdited = tree(t, { ...TREE, "engines/a/types.ts": "export type OnlyAType = string;\n" });
  assert.equal(adapterRevision("engines/a/engine.ts", typesEdited).revision, revision);
  const joined = tree(t, { ...TREE, "core/sideEffect.ts": 'import { never } from "./never.ts";\nexport { never };\n' });
  assert.deepEqual(adapterRevision("engines/a/engine.ts", joined).fileCount, 7);
  assert.notEqual(adapterRevision("engines/a/engine.ts", joined).revision, revision);
});

test("the closures of ref and lv are their own files and the kernels they share, and no file of the other", () => {
  const ref = importClosure(REF_ENGINE_MODULE);
  const lv = importClosure(LV_ENGINE_MODULE);
  for (const file of [...ref, ...lv]) assert.ok(existsSync(join(SOURCE_DIRECTORY, ...file.split("/"))), file);
  // Each holds its own engine, and the shared kernels an answer passes through.
  for (const shared of ["core/numeric/ndarray.ts", "contract/validate.ts", "engines/protocolHandler.ts"]) {
    assert.ok(ref.includes(shared) && lv.includes(shared), shared);
  }
  assert.ok(ref.includes("engines/ref/surface.ts") && ref.includes("engines/ref/paraxial.ts"));
  for (const own of ["binding.ts", "caseModel.ts", "exportCase.ts", "describe.ts", "firstOrder.ts", "rays.ts"]) {
    assert.ok(lv.includes(`engines/lv/${own}`), own);
  }
  // The image projection lv lands its rays with is part of what it answers with.
  assert.ok(lv.includes("estimators/imageProjection.ts"));
  assert.ok(!ref.some((file) => file.startsWith("engines/lv/")));
  assert.ok(!lv.some((file) => file.startsWith("engines/ref/")));
  // Nothing of the command line, the orchestrator or the reports is behind an answer.
  for (const file of [...ref, ...lv]) assert.ok(!/^(cli|report|compare)\//.test(file), file);
  // The local types of LensVisualizer's values are types only.
  assert.ok(!lv.includes("engines/lv/types.ts"));
  assert.deepEqual([...ref].sort(), ref);
});

test("ref states its adapter revision beside its fingerprint, and stamps it on every result", async (t) => {
  const descriptor = refDescriptor();
  assert.deepEqual(validateKind("engine-descriptor", descriptor), []);
  const { revision, fileCount } = adapterRevision(REF_ENGINE_MODULE);
  assert.equal(descriptor.identity.adapterRevision, revision);
  assert.match(revision, /^[0-9a-f]{64}$/);
  // The fingerprint is the engine's own files; the revision covers the kernels under them as well.
  assert.equal(descriptor.identity.fingerprint, refFingerprint().fingerprint);
  assert.notEqual(revision, descriptor.identity.fingerprint);
  assert.ok(fileCount > refFingerprint().fileCount);
  assert.deepEqual(engineStamp(descriptor.identity), {
    id: "ref",
    fingerprint: descriptor.identity.fingerprint,
    adapterRevision: revision,
    details: descriptor.identity.details,
  });

  const adapter = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => adapter.close());
  const result = await adapter.run(REQUEST_MINIMAL, SINGLET_CASE);
  assert.equal(result.status, "ok");
  assert.equal(result.engine.adapterRevision, revision);
  assert.deepEqual(validateKind("result", result), []);
});
