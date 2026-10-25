import assert from "node:assert/strict";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { assertJobs, jobsOption, maxJobs, memoryBudgetOption, suiteJobEstimate } from "../../src/cli/jobs.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { createMtfCommand } from "../../src/cli/commands/mtf.ts";
import { defaultMemoryBudgetGiB, GIB, jobEstimateGiB } from "../../src/core/memoryBudget.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "../core/support.ts";

test("job ceilings respect memory, R6c replicas and CPUs, and never refuse a serial run", () => {
  assert.equal(defaultMemoryBudgetGiB(48 * GIB), 10);
  assert.equal(defaultMemoryBudgetGiB(4 * GIB), 0);
  assert.equal(maxJobs(10, 2.5, 14), 4);
  assert.equal(maxJobs(10, 4, 14), 2);
  assert.equal(maxJobs(100, 2.5, 2), 2);
  // A serial run starts no pool: it is allowed whatever the budget, so a 16 GB machine (budget 2 GiB) still runs.
  assert.equal(maxJobs(2, 2.5, 14), 1);
  assert.equal(maxJobs(0, 2.5, 14), 1);
  assert.equal(jobEstimateGiB(["r4", "r6c"]), 4);
  assert.equal(jobsOption(undefined, 10), 1);
  assert.equal(jobsOption(undefined, 2), 1);
  assert.equal(jobsOption("1", 0), 1);
  assert.throws(() => jobsOption("2", 2), /--jobs 2: at most 1.*memory budget 2 GiB \/ estimate 2.5 GiB per job/);
  assert.throws(() => jobsOption("3", 10, 4), /--jobs 3: at most 2.*memory budget 10 GiB \/ estimate 4 GiB per job/);
  assert.throws(() => assertJobs(100000, 10), /available parallelism.*memory budget 10 GiB.*--memory-budget/);
  for (const value of ["", "0", "-1", "NaN", "Infinity", "1e99", " 10 "])
    assert.throws(() => memoryBudgetOption(value), UsageError);
  assert.equal(memoryBudgetOption("7.5"), 7.5);
});

test("written and overridden suite rungs select the estimate before exporting any case", async (t) => {
  const root = tempDir(t);
  const file = join(root, "suite.json");
  writeFileSync(
    file,
    JSON.stringify({
      name: "memory",
      defaults: { rungs: ["r6c"] },
      runs: [{ name: "one", lens: { kind: "fixture", path: "unused.json" } }],
    }),
  );
  assert.equal(suiteJobEstimate(file), 4);
  assert.equal(suiteJobEstimate(file, ["r0"]), 2.5);
  const runsDir = join(root, "runs");
  const command = createRunCommand({ rootDir: FAKE_ROOT, cwd: root, env: { LVRTC_RUNS_DIR: runsDir } });
  let error = "";
  const code = await command.run([file, "--jobs", "2", "--memory-budget", "5"], {
    stdout: () => assert.fail("no job should start"),
    stderr: (text) => {
      error += text;
    },
  });
  assert.equal(code, 2);
  assert.match(error, /memory budget 5 GiB \/ estimate 4 GiB per job/);
  assert.equal(existsSync(runsDir), false);
});

test("CLI budget errors name the budget and ordinary or benchmark R6c estimate", async (t) => {
  const root = tempDir(t);
  const inputs = { rootDir: FAKE_ROOT, cwd: root, env: { LVRTC_RUNS_DIR: join(root, "runs") } };
  for (const [command, args, estimate] of [
    [createRunCommand(inputs), [FAKE_PAIR_SUITE, "--jobs", "2", "--memory-budget", "4"], 2.5],
    [
      createMtfCommand(inputs),
      ["unused", "--profile", "benchmark", "--engines", "optiland", "--jobs", "2", "--memory-budget", "5"],
      4,
    ],
  ] as const) {
    let error = "";
    assert.equal(
      await command.run(args, {
        stdout: () => assert.fail(),
        stderr: (text) => {
          error += text;
        },
      }),
      2,
    );
    assert.ok(error.includes(`estimate ${estimate} GiB per job`), error);
  }
});
