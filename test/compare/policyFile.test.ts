// The comparator's own policy file, and what holds it to the rungs and the comparators.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { createComparatorLookup } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { POLICY_FILE, loadPolicy, policyRegistryProblems } from "../../src/compare/policyFile.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { RUNGS, selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { POLICY_EVERY_MODE, POLICY_SELFTEST } from "../contract/corpus.ts";
import { tempDir } from "../core/support.ts";

test("the policy file is policy/rungs.v1.json, and holds the policy of Phase 0", () => {
  assert.equal(POLICY_FILE, join(REPO_ROOT, "policy", "rungs.v1.json"));
  const policy = loadPolicy();
  assert.deepEqual(policy, POLICY_SELFTEST);
  assert.deepEqual(policy.rungs.selftest, {
    quantity: "selftest.echo",
    mode: "direct",
    class: "gated",
    metrics: { "sum.abs": { tolerance: 1e-12, unit: "1" }, "values.maxAbs": { tolerance: 1e-12, unit: "1" } },
  });
});

test("every registered rung has a policy entry and every entry a registered rung, with its quantity and metrics", () => {
  assert.deepEqual(policyRegistryProblems(loadPolicy(), RUNGS, COMPARATORS), []);
  assert.deepEqual(Object.keys(loadPolicy().rungs).sort(), RUNGS.map((rung) => rung.id).sort());
});

test("each way a policy and the code can disagree is reported", () => {
  const other: RungDefinition = { id: "other", quantity: "selftest.echo", buildRequests: () => [] };
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [selftestRung, other], COMPARATORS), [
    "rung other has no policy entry",
  ]);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [], COMPARATORS), [
    "policy entry selftest is of no registered rung",
  ]);

  const entry = POLICY_SELFTEST.rungs.selftest;
  const policyOf = (change: Partial<Policy["rungs"][string]>): Policy => ({
    ...POLICY_SELFTEST,
    rungs: { selftest: { ...entry, ...change } },
  });
  assert.deepEqual(policyRegistryProblems(policyOf({ quantity: "rays.trace" }), RUNGS, COMPARATORS), [
    "policy entry selftest names the quantity rays.trace; the rung's is selftest.echo",
  ]);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, RUNGS, createComparatorLookup([])), [
    "policy entry selftest: the quantity selftest.echo has no comparator",
  ]);
  const metrics = { "sum.abs": { tolerance: 1e-12, unit: "mm" }, "values.rms": { tolerance: 1e-12, unit: "1" } };
  assert.deepEqual(policyRegistryProblems(policyOf({ metrics }), RUNGS, COMPARATORS), [
    "policy entry selftest: metric sum.abs is in mm; the comparator reports 1",
    "policy entry selftest: the comparator reports no metric values.rms",
  ]);
  // Rungs of later phases: none of them is registered yet.
  assert.equal(policyRegistryProblems(POLICY_EVERY_MODE, RUNGS, COMPARATORS).length, 5);
});

test("a policy file that cannot be used is refused with what is wrong, and never with its path", (t) => {
  const directory = tempDir(t);
  const write = (name: string, text: string): string => {
    const file = join(directory, name);
    writeFileSync(file, text);
    return file;
  };
  const gatedWithoutTolerance = {
    ...POLICY_SELFTEST,
    rungs: { selftest: { ...POLICY_SELFTEST.rungs.selftest, metrics: { "sum.abs": { unit: "1" } } } },
  };
  const cases: [string, string][] = [
    [join(directory, "absent.json"), "policy: the file cannot be read (ENOENT)"],
    [write("broken.json", "{ not json"), "policy: the file is malformed JSON"],
    [
      write("invalid.json", JSON.stringify({ ...POLICY_SELFTEST, version: 0 })),
      "policy: not a valid policy: /version [minimum] ",
    ],
    [
      write("rule.json", JSON.stringify(gatedWithoutTolerance)),
      "policy: rung selftest: metric sum.abs is gated and has no tolerance",
    ],
  ];
  for (const [file, message] of cases) {
    assert.throws(
      () => loadPolicy(file),
      (error: Error) => {
        assert.ok(error.message.startsWith(message), error.message);
        assert.ok(!error.message.includes(directory), error.message);
        return true;
      },
    );
  }
  assert.deepEqual(loadPolicy(write("good.json", JSON.stringify(POLICY_EVERY_MODE))), POLICY_EVERY_MODE);
});
