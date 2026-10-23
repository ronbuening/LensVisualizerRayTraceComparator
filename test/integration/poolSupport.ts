// Shared Tier 2/3 measurement. Every run gets a cold temporary store; LV and optiland remain read-only.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import type { TestContext } from "node:test";

import { comparisonFileText } from "../../src/compare/comparisonFile.ts";
import { compareRunDirectory } from "../../src/cli/commands/compare.ts";
import { compareDirectoryParallel } from "../../src/compare/parallel.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { createProcessRegistry } from "../../src/core/processRegistry.ts";
import { loadSuiteValue } from "../../src/core/suite.ts";
import { createLvCaseSource } from "../../src/engines/lv/caseSource.ts";
import { createEngineRegistry } from "../../src/engines/registry.ts";
import { tempDir } from "../core/support.ts";

export async function benchmarkPool(
  t: TestContext,
  engines: readonly string[],
  rungs = ["r0", "r1", "r2", "r3", "r4"],
): Promise<void> {
  const root = tempDir(t);
  const written = JSON.parse(readFileSync(join(REPO_ROOT, "suites/benchmark.json"), "utf8"));
  written.runs = written.runs.slice(0, 2); // One configuration on reference and photopic lines, all rays rungs.
  const snapshots = [];
  for (const jobs of [1, 4]) {
    const runsDir = join(root, `jobs-${jobs}`);
    const loaded = loadConfig({ rootDir: REPO_ROOT, env: { ...process.env, LVRTC_RUNS_DIR: runsDir } });
    const pool = jobs > 1 ? createProcessRegistry(loaded, jobs) : undefined;
    const sources = pool?.sources ?? { lv: createLvCaseSource(loaded.config.lvPath) };
    const start = performance.now();
    const suite = await loadSuiteValue(written, "benchmark pool subset", { rootDir: REPO_ROOT, sources, jobs });
    const result = await runSuite({
      suite,
      sources,
      runsDir,
      engines,
      rungs,
      jobs,
      registry: pool ?? createEngineRegistry(loaded),
    });
    t.diagnostic(
      `${engines.join(",")} benchmark ${rungs.join(",")} subset jobs=${jobs}: ${((performance.now() - start) / 1000).toFixed(3)} s`,
    );
    assert.ok(result.manifest.jobs.every((job) => job.status !== "error"));
    const directory = dirname(result.manifestPath);
    const comparisons =
      jobs === 1
        ? compareRunDirectory(directory, loadPolicy())
        : await compareDirectoryParallel(directory, loadPolicy(), jobs, {});
    const failures = comparisons.comparisons.flatMap((set) =>
      set.pairs
        .filter((pair) => ["FAIL", "ERROR"].includes(pair.verdict))
        .map((pair) => `${set.run} ${set.rung} ${pair.a}/${pair.b}: ${pair.verdict}: ${pair.reason ?? ""}`),
    );
    assert.deepEqual(failures, []);
    snapshots.push({
      manifest: readFileSync(result.manifestPath, "utf8"),
      comparisons: comparisonFileText(comparisons),
      entries: readdirSync(join(runsDir, "store"))
        .sort()
        .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
    });
  }
  assert.deepEqual(snapshots[1], snapshots[0]);
}
