import assert from "node:assert/strict";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { prepareSuiteRun } from "../../src/cli/commands/run.ts";
import { compareRunDirectory } from "../../src/cli/commands/compare.ts";
import { compareDirectoryParallel } from "../../src/compare/parallel.ts";
import { comparisonFileText } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { baselineText, buildBaseline, MTF_BASELINE } from "../../src/baseline/build.ts";
import { renderMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { renderReport } from "../../src/report/index.ts";
import { renderBaselineReport } from "../../src/baseline/report.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { tempDir } from "./support.ts";
import { freshLv } from "../engines/lv/support.ts";

test("child case export, zoom expansion, coarse/fine rays, recipes, store and comparisons retain exact serial artifacts", async (t) => {
  const root = tempDir(t);
  const lv = freshLv(t);
  writeFileSync(join(root, "lvrtc.config.json"), JSON.stringify({ lvPath: lv }));
  writeFileSync(
    join(root, "suite.json"),
    JSON.stringify({
      contract: "1.3",
      kind: "suite",
      name: "preparation",
      defaults: {
        engines: ["lv", "ref"],
        fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
        sampling: { bundleGrid: 4 },
      },
      runs: [
        { name: "zoom", lens: { kind: "lv", key: "acme-zoom-24-48", stations: "published-zoom" } },
        {
          name: "prime",
          lens: { kind: "lv", key: "acme-singlet-50" },
          lines: { kind: "photopic" },
          imagePlane: { kind: "lv-best-axial" },
        },
        { name: "missing", lens: { kind: "lv", key: "absent" } },
      ],
    }),
  );
  const policy = loadPolicy();
  const snapshots = [];
  for (const jobs of [1, 2, 4]) {
    const runsDir = join(root, `runs-${jobs}`);
    const prepared = await prepareSuiteRun(
      { rootDir: root, cwd: root, env: { LVRTC_RUNS_DIR: runsDir } },
      "suite.json",
      undefined,
      jobs,
    );
    const result = await runSuite({
      ...prepared,
      runsDir,
      jobs,
      rungs: ["r0", "r1", "r2", "r3", "r4", "r4f", "r6a"],
      followUps: [
        {
          rung: "r4",
          engine: "ref",
          step: "again",
          options: { poolRetrace: true },
          needed: (_answers, { spec }) => {
            assert.ok(spec.origins, "follow-ups receive the complete ray spec");
            return true;
          },
        },
      ],
    });
    assert.deepEqual(readdirSync(runsDir).sort(), ["preparation", "store"]);
    assert.ok(result.manifest.jobs.some((job) => job.step === "again"));
    assert.ok(result.manifest.runs.some((run) => run.recipe && run.fineRaySets));
    const directory = dirname(result.manifestPath);
    const comparisons = compareRunDirectory(directory, policy);
    assert.equal(
      comparisonFileText(await compareDirectoryParallel(directory, policy, jobs, {})),
      comparisonFileText(comparisons),
    );
    const baseline = buildBaseline(result.manifest, comparisons, policy);
    snapshots.push({
      suite: prepared.suite,
      manifest: readFileSync(result.manifestPath),
      cases: readdirSync(join(directory, "cases"))
        .sort()
        .map((file) => [file, readFileSync(join(directory, "cases", file))]),
      comparisons: comparisonFileText(comparisons),
      baseline: baselineText(baseline),
      report: renderBaselineReport(baseline),
      mtfBaseline: baselineText(buildBaseline(result.manifest, comparisons, policy, MTF_BASELINE)),
      mtfReport: renderMtfBaselineReport(buildBaseline(result.manifest, comparisons, policy, MTF_BASELINE)),
      fullReport: renderReport(result.manifest, comparisons, policy),
      entries: readdirSync(join(runsDir, "store"))
        .sort()
        .map((file) => [file, readFileSync(join(runsDir, "store", file))]),
    });
  }
  assert.deepEqual(snapshots[1], snapshots[0]);
  assert.deepEqual(snapshots[2], snapshots[0]);
});
