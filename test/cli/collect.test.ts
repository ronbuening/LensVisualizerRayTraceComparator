// Stage 7.2's verification: a pending job survives a restart and is collected, with a fake human-operated engine.
// Every step is a process of its own, as a person would run them hours apart: lvrtc run hands fake-human's jobs over
// and they are pending; the fake operator answers them; lvrtc collect admits the answers into the store; lvrtc run
// again finds every one there, and its manifest is the bytes of a run whose fake-human answered at once.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { STORE_DIRECTORY } from "../../src/core/resultStore.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "../core/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const OPERATOR = fileURLToPath(new URL("../fixtures/fake-operator/operator.mjs", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));

/** Runs a Node script as a child process over the runs directory `runsDir`; stderr is only ever searched. */
function node(runsDir: string, args: readonly string[]): { code: number | null; out: string; err: string } {
  const child = spawnSync(process.execPath, args, {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env: { ...process.env, LVRTC_RUNS_DIR: runsDir },
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

test("a pending job survives a restart and is collected, using a fake human-operated engine", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const exchange = join(runsDir, "exchange", "fake-human");
  const run = () => node(runsDir, [BIN, "run", FAKE_PAIR_SUITE, "--root", FAKE_ROOT, "--engines", "fake-a,fake-human"]);

  // 1. The run hands fake-human's jobs over: pending, which fails nothing, and the outbox holds them.
  const first = run();
  assert.equal(first.code, 0, first.err);
  assert.match(first.out, /^singlet {7}selftest {2}fake-human {7}pending {6}computed$/m);
  assert.match(first.out, /^fake-pair: 4 jobs: 2 ok, 0 unsupported, 0 error, 2 pending \(4 computed, 0 cached\)$/m);
  const jobs = readdirSync(join(exchange, "outbox")).sort();
  assert.equal(jobs.length, 2);
  const pendingManifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "fake-pair", MANIFEST_FILE), "utf8"));
  assert.deepEqual(
    pendingManifest.jobs.filter((job) => job.engine === "fake-human").map((job) => [job.status, job.storeKey]),
    [
      ["pending", null],
      ["pending", null],
    ],
  );

  // 2. The operator, later and elsewhere, takes the jobs and answers them.
  const operator = node(runsDir, [OPERATOR, exchange]);
  assert.equal(operator.code, 0, operator.err);
  assert.equal(operator.out, jobs.map((job) => `answered ${job}\n`).join(""));

  // 3. Collected: each answer stored under its job's name, its job moved out of pending.
  const collected = node(runsDir, [BIN, "collect", "--root", FAKE_ROOT, "--json"]);
  assert.equal(collected.code, 0, collected.err);
  const [report] = JSON.parse(collected.out).engines;
  assert.deepEqual(report.counts, { collected: 2, rejected: 0, pending: 0 });
  assert.deepEqual(report.collected, jobs);
  const stored = readdirSync(join(runsDir, STORE_DIRECTORY));
  for (const job of jobs) assert.ok(stored.includes(`${job}.json.gz`), job);
  assert.deepEqual(readdirSync(join(exchange, "collected")).sort(), jobs);
  assert.deepEqual(readdirSync(join(exchange, "pending")), []);

  // 4. The next run finds every answer in the store, and the pair compares.
  const second = run();
  assert.equal(second.code, 0, second.err);
  assert.match(second.out, /^singlet {7}selftest {2}fake-human {7}ok {11}cached$/m);
  assert.match(second.out, /^fake-pair: 4 jobs: 4 ok, 0 unsupported, 0 error, 0 pending \(0 computed, 4 cached\)$/m);
  const compared = node(runsDir, [BIN, "compare", "fake-pair", "--root", FAKE_ROOT]);
  assert.equal(compared.code, 0, compared.out + compared.err);
  assert.match(compared.out, /^fake-pair: 4 pairs: 4 PASS, /m);
  const manifest = readFileSync(join(runsDir, "fake-pair", MANIFEST_FILE), "utf8");

  // 5. The same suite where fake-human is the fake engine in this process, answering at once: the same manifest.
  // The suite's lenses are fixtures named from the root, three levels below the repository: the same is made here.
  const base = tempDir(t);
  const rootDir = join(base, "test", "fixtures", "root");
  const cases = join("contract", "fixtures", "v1", "valid", "optical-case");
  mkdirSync(join(base, cases), { recursive: true });
  mkdirSync(rootDir, { recursive: true });
  for (const name of ["singlet.json", "double-gauss.json"])
    copyFileSync(join(REPO_ROOT, cases, name), join(base, cases, name));
  const inProcess = (id: string) => ({ transport: "in-process", module: FAKE_ENGINE, options: { id } });
  writeFileSync(
    join(rootDir, CONFIG_FILE),
    JSON.stringify({ engines: { "fake-a": inProcess("fake-a"), "fake-human": inProcess("fake-human") } }),
  );
  const elsewhere = join(tempDir(t), "runs");
  const atOnce = node(elsewhere, [BIN, "run", FAKE_PAIR_SUITE, "--root", rootDir, "--engines", "fake-a,fake-human"]);
  assert.equal(atOnce.code, 0, atOnce.err);
  assert.match(atOnce.out, /\(4 computed, 0 cached\)$/m);
  assert.equal(readFileSync(join(elsewhere, "fake-pair", MANIFEST_FILE), "utf8"), manifest);
});
