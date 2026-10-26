import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";

import { createMemoryGuard, heartbeatMemoryReader, processTreeMemory } from "../../src/core/poolMemory.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { loadConfig } from "../../src/core/config.ts";
import { createProcessRegistry } from "../../src/core/processRegistry.ts";
import { tempDir } from "./support.ts";
import { FAKE_ROOT } from "./support.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

test("RSS accounting includes every descendant once, both R6c workers, and the child's own RSS", () => {
  assert.deepEqual(processTreeMemory([{ pid: 10, rssBytes: 4096 }], "13 12 3\n11 10 1\n12 10 2\n10 1 2\n99 1 9999\n"), [
    {
      pid: 10,
      nodeRssBytes: 4096,
      workers: [
        { pid: 13, rssBytes: 3072 },
        { pid: 11, rssBytes: 1024 },
        { pid: 12, rssBytes: 2048 },
      ],
    },
  ]);
});

test("admission waits above budget, existing work finishes, and new work resumes when RSS falls", async () => {
  let rss = 101;
  let read = () => {};
  const sampled = new Promise<void>((resolve) => {
    read = resolve;
  });
  const guard = createMemoryGuard({
    budgetBytes: 100,
    sampleMs: 2,
    children: () => [],
    reader: async () => {
      read();
      return [{ pid: 1, nodeRssBytes: rss, workers: [] }];
    },
  });
  try {
    let admitted = false;
    const waiting = guard.wait().then(() => {
      admitted = true;
    });
    await sampled;
    await delay(10);
    assert.equal(admitted, false);
    // Finishing work can release memory independently of admission; nothing is killed or rewritten.
    rss = 100;
    await waiting;
    assert.equal(admitted, true);
    rss = 1;
    await guard.wait();
  } finally {
    await guard.close();
  }
});

test("a failed RSS read pauses admission until the reader recovers", async () => {
  let reads = 0;
  const guard = createMemoryGuard({
    budgetBytes: 100,
    sampleMs: 1,
    children: () => [],
    reader: async () => {
      if (++reads === 1) throw new Error("temporarily unavailable");
      return [];
    },
  });
  try {
    await guard.wait();
    assert.ok(reads >= 2);
  } finally {
    await guard.close();
  }
});

test(
  "the pool Python launcher reports current and peak own RSS without adding protocol output",
  { skip: PYTHON_MISSING },
  (t) => {
    const directory = tempDir(t);
    const script = join(directory, "standin.py");
    writeFileSync(script, 'print("stand-in reply")\n');
    const result = spawnSync("python3", ["-B", join(REPO_ROOT, "src/core/workerMemory.py"), script], {
      encoding: "utf8",
      env: { ...process.env, LVRTC_POOL_MEMORY_DIR: directory },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "stand-in reply\n");
    assert.equal(result.stderr, "");
    const sample = JSON.parse(
      readFileSync(
        join(
          directory,
          readdirSync(directory).find((name) => name.endsWith(".json"))!,
        ),
        "utf8",
      ),
    );
    assert.ok(sample.rssBytes > 0);
    assert.ok(sample.peakRssBytes >= sample.rssBytes);
    assert.equal(sample.exited, true);
  },
);

test("heartbeats sum both Python workers and preserve their measured peaks after exit", async (t) => {
  const directory = tempDir(t);
  for (const pid of [11, 12])
    writeFileSync(
      join(directory, `${pid}.json`),
      JSON.stringify({
        pid,
        parent: 1,
        rssBytes: 40,
        peakRssBytes: 50,
        exited: pid === 12,
      }),
    );
  assert.deepEqual(await heartbeatMemoryReader(directory)([{ pid: 1, rssBytes: 10 }]), [
    {
      pid: 1,
      nodeRssBytes: 10,
      workers: [
        { pid: 11, rssBytes: 40, peakRssBytes: 50 },
        { pid: 12, rssBytes: 0, peakRssBytes: 50 },
      ],
    },
  ]);
});

test("the registry gates dispatch with the injected reader and resumes without retiring its adapter", async (t) => {
  const directory = tempDir(t);
  const loaded = loadConfig({ rootDir: FAKE_ROOT, env: { LVRTC_RUNS_DIR: directory } });
  let pressure = true;
  let signal = () => {};
  const sampled = new Promise<void>((resolve) => {
    signal = resolve;
  });
  const registry = createProcessRegistry(loaded, 2, {
    memoryBudgetGiB: 1,
    memorySampleMs: 2,
    memoryReader: async () => {
      signal();
      return [{ pid: 1, nodeRssBytes: pressure ? 2 ** 31 : 1, workers: [] }];
    },
  });
  const adapter = await registry.create("fake-a");
  try {
    let admitted = false;
    const answer = adapter.describe().then((descriptor) => {
      admitted = true;
      return descriptor;
    });
    await sampled;
    await delay(10);
    assert.equal(admitted, false);
    pressure = false;
    assert.equal((await answer).identity.id, "fake-a");
    assert.equal(admitted, true);
  } finally {
    await adapter.close();
  }
});

test("opt-in profiling records peak sums and per-worker peaks outside result artifacts", async (t) => {
  const directory = tempDir(t);
  const previous = process.env.LVRTC_PROFILE_DIR;
  process.env.LVRTC_PROFILE_DIR = directory;
  let reads = 0;
  const guard = createMemoryGuard({
    budgetBytes: 50,
    sampleMs: 1,
    children: () => [],
    reader: async () => {
      return [{ pid: 1, nodeRssBytes: ++reads === 1 ? 30 : 0, workers: [{ pid: 2, rssBytes: reads === 1 ? 30 : 0 }] }];
    },
  });
  try {
    await guard.wait();
    await guard.close();
    const files = readdirSync(directory);
    assert.equal(files.length, 1);
    assert.match(files[0], /^pool-memory-/);
    const profile = JSON.parse(readFileSync(join(directory, files[0]), "utf8"));
    assert.equal(profile.peakSumBytes, 60);
    assert.equal(profile.slots[0].peakSumBytes, 60);
    assert.equal(profile.slots[0].workers[0].peakRssBytes, 30);
    assert.equal(profile.pauses, 1);
    assert.equal(profile.readFailures, 0);
  } finally {
    if (previous === undefined) delete process.env.LVRTC_PROFILE_DIR;
    else process.env.LVRTC_PROFILE_DIR = previous;
  }
});
