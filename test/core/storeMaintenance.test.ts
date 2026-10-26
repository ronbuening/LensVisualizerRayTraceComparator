import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";

import { createStoreCommand } from "../../src/cli/commands/store.ts";
import { makeResult } from "../../src/contract/result.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { createResultStore } from "../../src/core/resultStore.ts";
import { PRUNE_NOTICE, committedBaselineEngines, compressStore, pruneStore } from "../../src/core/storeMaintenance.ts";
import { echoRequest } from "../engines/support.ts";
import { tempDir } from "./support.ts";

const request = echoRequest(Float64Array.of(-0, 1, 2), 2);
const stamp = { id: "fake-a", fingerprint: "old", adapterRevision: "1".repeat(64), details: {} };
const result = makeResult(request, stamp, {
  status: "unsupported",
  unsupported: [{ code: "quantity", item: request.quantity, message: "fixture" }],
});
const bytes = `${canonicalJson({ request, result })}\n`;

function files(directory: string): [string, Buffer][] {
  return readdirSync(directory)
    .sort()
    .map((file) => [file, readFileSync(join(directory, file))]);
}

test("gzip round trip and mixed store reads preserve exact plain bytes and key; corrupt gzip is not hidden", (t) => {
  const directory = tempDir(t);
  const store = createResultStore(directory);
  const key = store.put(request, result)!;
  assert.equal(gunzipSync(readFileSync(join(directory, `${key}.json.gz`))).toString("utf8"), bytes);
  const legacy = makeResult(
    request,
    { ...stamp, fingerprint: "legacy" },
    { status: "unsupported", unsupported: result.unsupported! },
  );
  const legacyKey = store.put(request, legacy)!;
  const legacyFile = join(directory, `${legacyKey}.json.gz`);
  writeFileSync(join(directory, `${legacyKey}.json`), gunzipSync(readFileSync(legacyFile)));
  // Remove only the temporary fixture's compressed copy, leaving a genuine legacy entry.
  unlinkSync(legacyFile);
  assert.equal(store.get(legacyKey).kind, "hit");
  assert.equal(store.get(key).kind, "hit");
  writeFileSync(join(directory, `${key}.json`), bytes);
  writeFileSync(join(directory, `${key}.json.gz`), "broken gzip");
  assert.equal(store.get(key).kind, "corrupt", "a corrupt preferred gzip never silently uses a stale plain copy");
});

test("store compress dry run, atomic publication, matching duplicates, idempotence and conflicting files", (t) => {
  const directory = tempDir(t);
  const store = createResultStore(directory);
  const key = store.put(request, result)!;
  const compressed = readFileSync(join(directory, `${key}.json.gz`));
  writeFileSync(join(directory, `${key}.json`), bytes);
  writeFileSync(join(directory, "interrupted.tmp"), "partial");
  const before = files(directory);
  const dry = compressStore(directory);
  assert.deepEqual(files(directory), before);
  assert.equal(dry.plainEntries, 1);
  assert.equal(dry.compressedEntries, 1);
  assert.equal(dry.bytesBefore, Buffer.byteLength(bytes) + compressed.length);
  assert.equal(dry.bytesAfter, compressed.length);
  assert.equal(dry.changed, 0);
  assert.equal(compressStore(directory, true).changed, 1);
  assert.equal(existsSync(join(directory, `${key}.json`)), false);
  assert.deepEqual(readFileSync(join(directory, `${key}.json.gz`)), compressed);
  assert.equal(store.get(key).kind, "hit");
  assert.equal(compressStore(directory, true).changed, 0);
  assert.equal(existsSync(join(directory, "interrupted.tmp")), true);
  writeFileSync(join(directory, `${key}.json`), "different");
  const conflicting = files(directory);
  assert.throws(() => compressStore(directory, true), /conflicting plain and gzip/);
  assert.deepEqual(files(directory), conflicting, "a conflict leaves both original files whole");
});

test("compress publishes a new gzip and retains the plain entry when publication fails", (t) => {
  const directory = tempDir(t);
  const store = createResultStore(directory);
  const key = store.put(request, result)!;
  const compressed = readFileSync(join(directory, `${key}.json.gz`));
  const plainDirectory = join(directory, "legacy");
  mkdirSync(plainDirectory);
  writeFileSync(join(plainDirectory, `${key}.json`), bytes);
  const dry = compressStore(plainDirectory);
  assert.equal(dry.bytesBefore, Buffer.byteLength(bytes));
  assert.equal(dry.bytesAfter, compressed.length);
  compressStore(plainDirectory, true);
  assert.deepEqual(readFileSync(join(plainDirectory, `${key}.json.gz`)), compressed);
  const blocked = join(directory, "blocked");
  mkdirSync(blocked);
  writeFileSync(join(blocked, `${key}.json`), bytes);
  mkdirSync(join(blocked, `${key}.json.gz`));
  assert.throws(() => compressStore(blocked, true));
  assert.equal(readFileSync(join(blocked, `${key}.json`), "utf8"), bytes);
  assert.deepEqual(readdirSync(blocked).sort(), [`${key}.json`, `${key}.json.gz`]);
});

test("prune uses exact committed engine/fingerprint/revision tuples, keeps unknown entries, and defaults to dry run", async (t) => {
  const root = tempDir(t);
  // A temporary work tree reads this repository's immutable HEAD, with no Git write operation.
  const gitDir = execFileSync("git", ["-C", REPO_ROOT, "rev-parse", "--absolute-git-dir"], { encoding: "utf8" }).trim();
  writeFileSync(join(root, ".git"), `gitdir: ${gitDir}\n`);
  mkdirSync(join(root, "baselines"));
  writeFileSync(join(root, "baselines", "uncommitted.json"), "not a baseline");
  const engines = committedBaselineEngines(root);
  assert.ok(engines.length > 0);
  assert.deepEqual(engines, committedBaselineEngines(REPO_ROOT), "working-tree baselines do not enter protection");
  const runsDir = join(root, "runs");
  const directory = join(runsDir, "store");
  const store = createResultStore(directory);
  const engine = engines[0];
  const write = (stamp: typeof engine): string =>
    store.put(
      request,
      makeResult(
        request,
        { ...stamp, details: {} },
        {
          status: "unsupported",
          unsupported: result.unsupported!,
        },
      ),
    )!;
  const kept = write(engine);
  const oldFingerprint = write({ ...engine, fingerprint: "unreferenced fingerprint" });
  const oldAdapter = write({ ...engine, adapterRevision: "2".repeat(64) });
  const otherEngine = write({ ...engine, id: "uncommitted-engine" });
  const { adapterRevision: _adapterRevision, ...withoutAdapter } = engine;
  const noAdapter = write(withoutAdapter);
  assert.ok(engine.adapterRevision !== undefined);
  const plain = gunzipSync(readFileSync(join(directory, `${kept}.json.gz`)));
  writeFileSync(join(directory, `${kept}.json`), plain);
  const unknown = `${"f".repeat(64)}.json.gz`;
  writeFileSync(join(directory, unknown), "corrupt");
  const before = files(directory);
  const dry = pruneStore(directory, engines);
  assert.deepEqual(files(directory), before);
  assert.equal(dry.deleted, 0);
  assert.equal(dry.problems.length, 1);
  assert.equal(
    dry.engines.reduce((sum, count) => sum + count.prune, 0),
    4,
  );
  assert.equal(dry.notice, PRUNE_NOTICE, "every prune says that unbaselined current engines are removable");
  assert.deepEqual(
    dry.removableIdentities.map(({ engine: id, fingerprint, adapterRevision, files: count }) => [
      id,
      fingerprint,
      adapterRevision,
      count,
    ]),
    [
      [engine.id, engine.fingerprint, null, 1],
      [engine.id, engine.fingerprint, "2".repeat(64), 1],
      [engine.id, "unreferenced fingerprint", engine.adapterRevision, 1],
      ["uncommitted-engine", engine.fingerprint, engine.adapterRevision, 1],
    ].sort((a, b) => canonicalJson(a.slice(0, 3)).localeCompare(canonicalJson(b.slice(0, 3)))),
  );
  for (const version of dry.removableIdentities)
    assert.ok(version.bytes > 0 && !Number.isNaN(Date.parse(version.newestEntry)));
  const command = createStoreCommand({ rootDir: root, cwd: root, env: { LVRTC_RUNS_DIR: runsDir } });
  let text = "";
  const io = {
    stdout: (value: string) => {
      text += value;
    },
    stderr: (value: string) => assert.fail(value),
  };
  assert.equal(await command.run(["prune", "--json"], io), 0);
  assert.equal(JSON.parse(text).dryRun, true);
  assert.deepEqual(files(directory), before);
  text = "";
  assert.equal(await command.run(["prune", "--yes", "--json"], io), 0);
  assert.equal(JSON.parse(text).deleted, 4);
  assert.deepEqual(readdirSync(directory).sort(), [`${kept}.json`, `${kept}.json.gz`, unknown].sort());
  for (const key of [oldFingerprint, oldAdapter, otherEngine, noAdapter]) assert.equal(store.get(key).kind, "miss");
  assert.equal(store.get(kept).kind, "hit");
  assert.equal(pruneStore(directory, engines, true).deleted, 0);
  assert.throws(() => committedBaselineEngines(tempDir(t)), /git/);
});

test("store compress CLI dry run and --yes use only the temporary LVRTC_RUNS_DIR", async (t) => {
  const runsDir = tempDir(t);
  const directory = join(runsDir, "store");
  mkdirSync(directory);
  const store = createResultStore(directory);
  const key = store.put(request, result)!;
  const compressed = readFileSync(join(directory, `${key}.json.gz`));
  writeFileSync(join(directory, `${key}.json`), bytes);
  const command = createStoreCommand({ rootDir: REPO_ROOT, cwd: REPO_ROOT, env: { LVRTC_RUNS_DIR: runsDir } });
  let text = "";
  const io = {
    stdout: (value: string) => {
      text += value;
    },
    stderr: (value: string) => assert.fail(value),
  };
  assert.equal(await command.run(["compress"], io), 0);
  assert.equal(JSON.parse(text).dryRun, true);
  assert.equal(existsSync(join(directory, `${key}.json`)), true);
  text = "";
  assert.equal(await command.run(["compress", "--yes"], io), 0);
  assert.equal(JSON.parse(text).changed, 1);
  assert.equal(existsSync(join(directory, `${key}.json`)), false);
  assert.deepEqual(readFileSync(join(directory, `${key}.json.gz`)), compressed);
});
