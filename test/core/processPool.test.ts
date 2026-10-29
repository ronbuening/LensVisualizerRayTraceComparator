import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

import { baselineText, buildBaseline } from "../../src/baseline/build.ts";
import { renderBaselineReport } from "../../src/baseline/report.ts";
import { comparisonFileText } from "../../src/compare/comparisonFile.ts";
import { compareDirectoryParallel } from "../../src/compare/parallel.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import { makeResult } from "../../src/contract/result.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { loadConfig, REPO_ROOT } from "../../src/core/config.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import type { FollowUp } from "../../src/core/orchestrator.ts";
import { createProcessRegistry } from "../../src/core/processRegistry.ts";
import type { PoolJobTicket, StoredAdapter } from "../../src/core/processRegistry.ts";
import { createResultStore } from "../../src/core/resultStore.ts";
import { selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { createEngineRegistry } from "../../src/engines/registry.ts";
import { buildReport } from "../../src/report/model.ts";
import { renderMarkdown } from "../../src/report/markdown.ts";
import { pairSuite, SINGLET, tempDir } from "./support.ts";

const rung: RungDefinition = {
  ...selftestRung,
  buildRequests: (opticalCase, spec) => {
    const [base] = selftestRung.buildRequests(opticalCase, spec);
    return Array.from({ length: 8 }, (_, index) =>
      makeRequest({
        caseId: opticalCase.id,
        quantity: base.quantity,
        spec: { ...base.spec, scale: index + 1 },
      }),
    );
  },
};
const followUp: FollowUp = {
  rung: "selftest",
  engine: "fake-stdio",
  step: "fine",
  options: { fine: true },
  needed: (answers) => answers.size === 3,
};

for (const dies of [false, true]) {
  test(`serial and jobs 2/4 have identical entries and artifacts${dies ? ", including worker death" : " and follow-ups"}`, async (t) => {
    const root = tempDir(t);
    const log = join(root, "workers.log");
    const module = join(REPO_ROOT, "test/fixtures/pool-engine/engine.mjs");
    writeFileSync(
      join(root, "lvrtc.config.json"),
      JSON.stringify({
        engines: {
          "fake-a": { transport: "in-process", module, options: { id: "fake-a", delay: 4, log } },
          "fake-b": { transport: "in-process", module, options: { id: "fake-b", delay: 4, log } },
          "fake-stdio": {
            transport: "stdio",
            command: [process.execPath, join(REPO_ROOT, "test/fixtures/pool-engine/worker.mjs")],
            options: { id: "fake-stdio", delay: 4, log, ...(dies ? { crashScale: 5 } : {}) },
          },
        },
      }),
    );
    const policy = loadPolicy();
    const snapshots = [];
    let memoryReads = 0;
    for (const jobs of [1, 2, 4]) {
      const runsDir = join(root, `runs-${jobs}`);
      const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: runsDir } });
      const seen: unknown[] = [];
      const result = await runSuite({
        suite: pairSuite({ engines: ["fake-a", "fake-b", "fake-stdio"], rungs: ["selftest"] }),
        registry:
          jobs === 1
            ? createEngineRegistry(loaded)
            : createProcessRegistry(loaded, jobs, {
                memoryBudgetGiB: 10,
                memorySampleMs: 1,
                // Periodic synthetic pressure must change scheduling only, including all persisted bytes below.
                memoryReader: async (children) =>
                  children.map((child, index) => ({
                    pid: child.pid,
                    nodeRssBytes: ++memoryReads % 7 === 0 && index === 0 ? 11 * 2 ** 30 : 1,
                    workers: [],
                  })),
              }),
        jobs,
        runsDir,
        rungDefinitions: [rung],
        followUps: dies ? [] : [followUp],
        onJob: ({ job }) => seen.push(job),
      });
      assert.deepEqual(seen, result.manifest.jobs);
      const { manifest } = result;
      if (dies) {
        const dead = manifest.jobs.filter((job) => job.engine === "fake-stdio");
        assert.equal(dead.filter((job) => job.status === "error").length, 12);
        assert.ok(dead.slice(4).every((job) => job.error?.code === "transport-error"));
        assert.ok(manifest.jobs.filter((job) => job.engine !== "fake-stdio").every((job) => job.status === "ok"));
      } else {
        assert.equal(manifest.jobs.filter((job) => job.step === "fine").length, 16);
        for (const run of manifest.runs) {
          const jobs = manifest.jobs.filter((job) => job.run === run.name);
          assert.ok(jobs.slice(0, 24).every((job) => job.step === undefined));
          assert.ok(jobs.slice(24).every((job) => job.step === "fine"));
        }
      }
      const comparisons = compareManifest({ manifest, store: createResultStore(join(runsDir, "store")), policy });
      assert.equal(
        comparisonFileText(await compareDirectoryParallel(join(runsDir, manifest.suite.name), policy, jobs, {})),
        comparisonFileText(comparisons),
      );
      const baseline = buildBaseline(manifest, comparisons, policy);
      snapshots.push({
        manifest: readFileSync(result.manifestPath, "utf8"),
        comparisons: comparisonFileText(comparisons),
        baseline: baselineText(baseline),
        baselineReport: renderBaselineReport(baseline),
        report: renderMarkdown(buildReport(manifest, comparisons, policy)),
        entries: readdirSync(join(runsDir, "store"))
          .sort()
          .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
      });
    }
    assert.deepEqual(snapshots[1], snapshots[0]);
    assert.deepEqual(snapshots[2], snapshots[0]);
    assert.ok(memoryReads > 7, "determinism exercised repeated admission pressure");
    const events = readFileSync(log, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    if (!dies) {
      const active = new Set<number>();
      let peak = 0;
      for (const event of events.filter((event) => event.method === "run")) {
        if (event.event === "start") {
          assert.ok(!active.has(event.pid), "each process executes only one job at a time");
          active.add(event.pid);
          peak = Math.max(peak, active.size);
        } else active.delete(event.pid);
      }
      assert.ok(peak >= 2 && peak <= 4, `bounded concurrent CPU jobs: ${peak}`);
      assert.equal(active.size, 0);
    }
    const hellos = events.filter((event) => event.method === "hello" && event.event === "start");
    assert.ok(new Set(hellos.map((event) => event.pid)).size > 4, "multiple independently handshaken processes");
    for (const pid of new Set<number>(hellos.map((event) => event.pid))) {
      if (pid !== process.pid) assert.throws(() => process.kill(pid, 0), { code: "ESRCH" }, `worker ${pid} was closed`);
    }

    assert.equal(
      new Set(hellos.map((event) => `${event.pid}:${event.engine}`)).size,
      hellos.length,
      "no worker restarted",
    );
  });
}

test("a job paused for memory keeps its turn: a later job cannot end a stdio replica before it is sent there", async (t) => {
  const root = tempDir(t);
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        "fake-stdio": {
          transport: "stdio",
          command: [process.execPath, join(REPO_ROOT, "test/fixtures/pool-engine/worker.mjs")],
          options: { id: "fake-stdio", crashScale: 5 },
        },
      },
    }),
  );
  const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: join(root, "runs") } });
  let pressure = false;
  // One slot: the job that takes it first is the first its replica answers.
  const registry = createProcessRegistry(loaded, 1, {
    memoryBudgetGiB: 10,
    memorySampleMs: 200,
    memoryReader: async (children) =>
      children.map((child) => ({ pid: child.pid, nodeRssBytes: pressure ? 11 * 2 ** 30 : 1, workers: [] })),
  });
  const adapter = (await registry.create("fake-stdio")) as StoredAdapter;
  try {
    await adapter.describe();
    const [base] = selftestRung.buildRequests(SINGLET, pairSuite().runs[0].spec);
    // As the orchestrator asks: a ticket per job, in order, released when the job has ended.
    const ask = async (scale: number) => {
      const ticket = registry.enqueue("fake-stdio");
      try {
        return await adapter.askStored!(
          makeRequest({ caseId: SINGLET.id, quantity: base.quantity, spec: { ...base.spec, scale } }),
          SINGLET,
          [],
          ticket,
        );
      } finally {
        ticket.release();
      }
    };
    pressure = true;
    const earlier = ask(4);
    // The earlier job reads the pressure and waits a sampling period; the later one arrives after it has gone.
    await delay(20);
    pressure = false;
    const later = ask(5);
    const [first, second] = await Promise.all([earlier, later]);
    assert.equal(first.result.status, "ok", first.result.error?.message);
    assert.equal(second.result.error?.code, "transport-error");
  } finally {
    await adapter.close();
  }
});

test("an earlier job asked late is sent to a live stdio replica, not to a slot whose replica a later job ended", async (t) => {
  const root = tempDir(t);
  const module = join(REPO_ROOT, "test/fixtures/pool-engine/engine.mjs");
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        // Holds the first slot while the stdio replica of the second one is ended.
        "fake-a": { transport: "in-process", module, options: { id: "fake-a", delay: 3_000 } },
        "fake-stdio": {
          transport: "stdio",
          command: [process.execPath, join(REPO_ROOT, "test/fixtures/pool-engine/worker.mjs")],
          options: { id: "fake-stdio", crashScale: 5 },
        },
      },
    }),
  );
  const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: join(root, "runs") } });
  const registry = createProcessRegistry(loaded, 2, { memoryBudgetGiB: 10 });
  const stdio = (await registry.create("fake-stdio")) as StoredAdapter;
  const holder = (await registry.create("fake-a")) as StoredAdapter;
  try {
    // Both replicas are on the first slot, the only one so far.
    await stdio.describe();
    await holder.describe();
    const [base] = selftestRung.buildRequests(SINGLET, pairSuite().runs[0].spec);
    const ask = async (adapter: StoredAdapter, ticket: PoolJobTicket, scale: number) => {
      try {
        return await adapter.askStored!(
          makeRequest({ caseId: SINGLET.id, quantity: base.quantity, spec: { ...base.spec, scale } }),
          SINGLET,
          [],
          ticket,
        );
      } finally {
        ticket.release();
      }
    };
    // The earlier stdio job is asked last, as a duplicate is after the answer it waited for.
    const earlier = registry.enqueue("fake-stdio");
    const later = registry.enqueue("fake-stdio");
    const held = ask(holder, registry.enqueue("fake-a"), 1);
    const ended = ask(stdio, later, 5);
    const [answer, crash] = await Promise.all([ask(stdio, earlier, 4), ended, held]);
    assert.equal(answer.result.status, "ok", answer.result.error?.message);
    assert.equal(crash.result.error?.code, "transport-error");
  } finally {
    await stdio.close();
    await holder.close();
  }
});

test("a Node pool slot dying retires its engine without replacing the slot; other engines finish", async (t) => {
  const root = tempDir(t);
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        "fake-a": {
          transport: "in-process",
          module: join(REPO_ROOT, "test/fixtures/pool-engine/engine.mjs"),
          options: { id: "fake-a", crashScale: 5 },
        },
        "fake-b": {
          transport: "in-process",
          module: join(REPO_ROOT, "src/engines/fake/engine.ts"),
          options: { id: "fake-b" },
        },
      },
    }),
  );
  const snapshots = [];
  for (const jobs of [1, 4]) {
    const runsDir = join(root, `runs-${jobs}`);
    const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: runsDir } });
    const base = createEngineRegistry(loaded);
    let gone = false;
    const serial = {
      ...base,
      create: async (id: string) => {
        const adapter = await base.create(id);
        return {
          ...adapter,
          id,
          describe: () => adapter.describe(),
          close: () => adapter.close(),
          run: async (request: Parameters<typeof adapter.run>[0], opticalCase: Parameters<typeof adapter.run>[1]) => {
            if (id === "fake-a" && (gone || request.spec.scale === 5)) {
              gone = true;
              return makeResult(request, engineStamp((await adapter.describe()).identity), {
                status: "error",
                error: { code: "transport-error", message: "serial stand-in for a dead process" },
              });
            }
            return adapter.run(request, opticalCase);
          },
        };
      },
    };
    const result = await runSuite({
      suite: pairSuite({ engines: ["fake-a", "fake-b"], rungs: ["selftest"] }),
      registry: jobs === 1 ? serial : createProcessRegistry(loaded, jobs),
      jobs,
      runsDir,
      rungDefinitions: [rung],
    });
    assert.ok(result.manifest.jobs.filter((job) => job.engine === "fake-b").every((job) => job.status === "ok"));
    snapshots.push({
      manifest: readFileSync(result.manifestPath),
      entries: readdirSync(join(runsDir, "store"))
        .sort()
        .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
    });
  }
  assert.deepEqual(snapshots[1], snapshots[0]);
});

test("a store publication failure rejects serial and pooled suites rather than becoming an engine result", async (t) => {
  const root = tempDir(t);
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        "fake-a": {
          transport: "in-process",
          module: join(REPO_ROOT, "src/engines/fake/engine.ts"),
          options: { id: "fake-a" },
        },
      },
    }),
  );
  for (const jobs of [1, 2]) {
    const runsDir = join(root, `failure-${jobs}`);
    mkdirSync(runsDir);
    writeFileSync(join(runsDir, "store"), "a file cannot be a store directory");
    const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: runsDir } });
    const suite = pairSuite({ engines: ["fake-a"], rungs: ["selftest"] });
    await assert.rejects(
      runSuite({
        suite,
        runsDir,
        jobs,
        registry: jobs === 1 ? createEngineRegistry(loaded) : createProcessRegistry(loaded, jobs),
      }),
    );
    assert.equal(existsSync(join(runsDir, suite.name, "manifest.json")), false);
  }
});

test("cached duplicates remain answers after the last Node slot dies", async (t) => {
  const root = tempDir(t);
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        "fake-a": {
          transport: "in-process",
          module: join(REPO_ROOT, "test/fixtures/pool-engine/engine.mjs"),
          options: { id: "fake-a", crashScale: 5 },
        },
      },
    }),
  );
  const snapshots = [];
  for (const pool of [false, true]) {
    const runsDir = join(root, pool ? "pooled" : "serial");
    const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: runsDir } });
    const base = createEngineRegistry(loaded);
    const suite = pairSuite({ engines: ["fake-a"], rungs: ["selftest", "repeat"] });
    await runSuite({
      suite: { ...suite, runs: [suite.runs[1]] },
      registry: base,
      runsDir,
      rungs: ["selftest"],
      rungDefinitions: [{ ...rung, buildRequests: (...args) => rung.buildRequests(...args).slice(0, 4) }],
    });
    let gone = false;
    const serial = {
      ...base,
      create: async (id: string) => {
        const adapter = await base.create(id);
        return {
          id,
          describe: () => adapter.describe(),
          close: () => adapter.close(),
          run: async (request: Parameters<typeof adapter.run>[0], opticalCase: Parameters<typeof adapter.run>[1]) => {
            if (gone || request.spec.scale === 5) {
              gone = true;
              return makeResult(request, engineStamp((await adapter.describe()).identity), {
                status: "error",
                error: { code: "transport-error", message: "the worker is gone" },
              });
            }
            return adapter.run(request, opticalCase);
          },
        };
      },
    };
    const result = await runSuite({
      suite,
      runsDir,
      jobs: 1,
      registry: pool ? createProcessRegistry(loaded, 1) : serial,
      rungDefinitions: [rung, { ...rung, id: "repeat" }],
    });
    assert.equal(result.manifest.jobs.filter((job) => job.rung === "repeat" && job.status === "ok").length, 8);
    snapshots.push({
      manifest: readFileSync(result.manifestPath),
      entries: readdirSync(join(runsDir, "store"))
        .sort()
        .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
    });
  }
  assert.deepEqual(snapshots[1], snapshots[0]);
});

test("duplicate outcome reuse invalidates a store file corrupted between rungs", async (t) => {
  const root = tempDir(t);
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        "fake-a": {
          transport: "in-process",
          module: join(REPO_ROOT, "src/engines/fake/engine.ts"),
          options: { id: "fake-a" },
        },
      },
    }),
  );
  const snapshots = [];
  for (const jobs of [1, 2]) {
    const runsDir = join(root, `corrupt-${jobs}`);
    const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: runsDir } });
    let damaged = false;
    const result = await runSuite({
      suite: pairSuite({ engines: ["fake-a"], rungs: ["selftest", "repeat"] }),
      runsDir,
      jobs,
      registry: jobs === 1 ? createEngineRegistry(loaded) : createProcessRegistry(loaded, jobs),
      rungDefinitions: [selftestRung, { ...selftestRung, id: "repeat" }],
      followUps: [{ rung: "selftest", engine: "fake-a", step: "unused", options: { fine: true }, needed: () => false }],
      onJob: ({ job }) => {
        if (!damaged && job.rung === "selftest") {
          damaged = true;
          writeFileSync(join(runsDir, "store", `${job.storeKey}.json.gz`), "broken gzip");
        }
      },
    });
    assert.ok(result.warnings.some((warning) => warning.includes("computed again")));
    snapshots.push({
      manifest: readFileSync(result.manifestPath),
      sources: result.outcomes.map((outcome) => outcome.source),
      entries: readdirSync(join(runsDir, "store"))
        .sort()
        .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
    });
  }
  assert.deepEqual(snapshots[1], snapshots[0]);
});

test("a deferred invalid-data retry is admitted before a later terminal failure", async (t) => {
  const root = tempDir(t);
  writeFileSync(
    join(root, "lvrtc.config.json"),
    JSON.stringify({
      engines: {
        "fake-a": {
          transport: "in-process",
          module: join(REPO_ROOT, "test/fixtures/pool-engine/engine.mjs"),
          options: { id: "fake-a", crashScale: 5, invalidScale: 3, delay: 4 },
        },
      },
    }),
  );
  const snapshots = [];
  for (const jobs of [1, 2]) {
    const runsDir = join(root, `admission-${jobs}`);
    const loaded = loadConfig({ rootDir: root, env: { LVRTC_RUNS_DIR: runsDir } });
    const base = createEngineRegistry(loaded);
    const serial = {
      ...base,
      create: async (id: string) => {
        const adapter = await base.create(id);
        return {
          id,
          describe: () => adapter.describe(),
          close: () => adapter.close(),
          run: async (request: Parameters<typeof adapter.run>[0], opticalCase: Parameters<typeof adapter.run>[1]) =>
            request.spec.scale === 5
              ? makeResult(request, engineStamp((await adapter.describe()).identity), {
                  status: "error",
                  error: { code: "transport-error", message: "serial stand-in for a dead process" },
                })
              : adapter.run(request, opticalCase),
        };
      },
    };
    const suite = pairSuite({ engines: ["fake-a"], rungs: ["selftest", "repeat", "death"] });
    const first = {
      ...rung,
      buildRequests: (...args: Parameters<typeof rung.buildRequests>) => rung.buildRequests(...args).slice(0, 3),
    };
    const result = await runSuite({
      suite: { ...suite, runs: suite.runs.slice(0, 1) },
      runsDir,
      jobs,
      registry: jobs === 1 ? serial : createProcessRegistry(loaded, jobs),
      rungDefinitions: [
        first,
        { ...first, id: "repeat" },
        { ...rung, id: "death", buildRequests: (...args) => rung.buildRequests(...args).slice(4, 5) },
      ],
    });
    assert.deepEqual(
      result.manifest.jobs.filter((job) => job.status === "error").map((job) => [job.rung, job.error?.code]),
      [
        ["selftest", "invalid-data"],
        ["repeat", "invalid-data"],
        ["death", "transport-error"],
      ],
    );
    snapshots.push({
      manifest: readFileSync(result.manifestPath),
      entries: readdirSync(join(runsDir, "store"))
        .sort()
        .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
    });
  }
  assert.deepEqual(snapshots[1], snapshots[0]);
});
