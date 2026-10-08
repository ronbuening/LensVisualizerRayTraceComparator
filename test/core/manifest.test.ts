// Reading a run manifest back: what is checked before a comparison or a report trusts it.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { MANIFEST_FILE, manifestProblems, manifestText, readRunManifest } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { answeringEngine, fakeEngine, pairSuite, tempDir, watchedRegistry } from "./support.ts";

/** A manifest of every kind of engine and job, as the orchestrator writes it. */
async function writtenManifest(runsDir: string): Promise<RunManifest> {
  const { registry } = watchedRegistry({
    "fake-a": fakeEngine(),
    "fake-none": fakeEngine({ offersQuantities: false }),
    broken: answeringEngine(() => ({ status: "error", error: { code: "engine-failure", message: "boom" } })),
  });
  const engines = ["fake-a", "fake-none", "broken"];
  const { manifest } = await runSuite({ suite: pairSuite({ referenceEngine: "fake-a" }), registry, runsDir, engines });
  return manifest;
}

test("a manifest the orchestrator wrote is read back as it was written, with each run's reference engine", async (t) => {
  const runsDir = tempDir(t);
  const manifest = await writtenManifest(runsDir);
  assert.deepEqual(manifestProblems(manifest), []);
  assert.deepEqual(
    manifest.runs.map((run) => run.referenceEngine),
    ["fake-a", "fake-a"],
  );
  const read = readRunManifest(join(runsDir, "pair"));
  assert.equal(manifestText(read), manifestText(manifest));
});

test("a run that names no reference engine has none in the manifest", async (t) => {
  const { registry } = watchedRegistry({ "fake-a": fakeEngine() });
  const { manifest } = await runSuite({ suite: pairSuite(), registry, runsDir: tempDir(t) });
  for (const run of manifest.runs) assert.equal(Object.hasOwn(run, "referenceEngine"), false);
});

test("what is not a manifest is said with where it is not", async (t) => {
  const manifest = await writtenManifest(tempDir(t));
  const changed = (change: (copy: Record<string, never>) => void): string[] => {
    const copy = structuredClone(manifest) as unknown as Record<string, never>;
    change(copy);
    return manifestProblems(copy);
  };
  assert.deepEqual(manifestProblems(null), ["(root): expected an object"]);
  assert.deepEqual(manifestProblems([]), ["(root): expected an object"]);
  assert.deepEqual(manifestProblems({ kind: "suite" }), ['/kind: expected "run-manifest"']);
  assert.deepEqual(
    changed((copy) => Object.assign(copy, { contract: "2.0" })),
    ["/contract: version 2.0 cannot be read by this code"],
  );
  assert.deepEqual(
    changed((copy) => Object.assign(copy, { suite: { name: 1 }, engines: {}, runs: [null], jobs: undefined })),
    [
      "/suite/name: expected a string",
      "/suite/hash: expected a string",
      "/engines: expected a list",
      "/runs/0: expected an object",
      "/jobs: expected a list",
    ],
  );
  assert.deepEqual(
    changed((copy) => {
      const [engine] = copy.engines as Record<string, unknown>[];
      const [run] = copy.runs as Record<string, unknown>[];
      const [job, second] = copy.jobs as Record<string, unknown>[];
      Object.assign(engine, { status: "ready" });
      Object.assign(run, { caseId: 7, problems: "none", referenceEngine: null });
      Object.assign(job, {
        engine: 1,
        status: "done",
        storeKey: undefined,
        unsupported: [{ code: "feature" }],
        error: "x",
      });
      Object.assign(second, { error: { code: 5 } });
    }),
    [
      '/engines/0/status: expected "available" or "unavailable"',
      "/runs/0/caseId: expected a string",
      "/runs/0/problems: expected a list of strings",
      "/runs/0/referenceEngine: expected a string",
      "/jobs/0/engine: expected a string",
      "/jobs/0/status: expected a result status",
      "/jobs/0/storeKey: expected a string",
      "/jobs/0/unsupported/0/item: expected a string",
      "/jobs/0/error: expected an object",
      "/jobs/1/error/code: expected a string",
    ],
  );
});

test("a directory without a manifest, and a manifest that cannot be used, are usage errors", (t) => {
  const directory = join(tempDir(t), "suite");
  const refused = (message: RegExp): void => {
    assert.throws(
      () => readRunManifest(directory),
      (error: unknown) => {
        assert.ok(error instanceof UsageError);
        assert.match(error.message, message);
        return true;
      },
    );
  };
  refused(/suite: no manifest\.json is there$/);
  mkdirSync(directory);
  refused(/suite: no manifest\.json is there$/);
  writeFileSync(join(directory, MANIFEST_FILE), "{ cut short");
  refused(/manifest\.json: malformed JSON$/);
  writeFileSync(join(directory, MANIFEST_FILE), JSON.stringify({ kind: "run-manifest", contract: "1.0" }));
  refused(/manifest\.json: not a run manifest: \/suite: expected an object; \/engines: expected a list; /);
});
