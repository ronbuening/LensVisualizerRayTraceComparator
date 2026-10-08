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
import { RUNGS, judgedRungs, raysRung, selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { POLICY_EVERY_MODE, POLICY_LADDER, POLICY_SELFTEST } from "../contract/corpus.ts";
import { tempDir } from "../core/support.ts";

test("the policy file is policy/rungs.v1.json, and holds the comparator's own policy", () => {
  assert.equal(POLICY_FILE, join(REPO_ROOT, "policy", "rungs.v1.json"));
  const policy = loadPolicy();
  assert.deepEqual(policy, POLICY_LADDER);
  assert.equal(policy.version, 2);
  assert.deepEqual(policy.rungs.selftest, {
    quantity: "selftest.echo",
    mode: "direct",
    class: "gated",
    metrics: { "sum.abs": { tolerance: 1e-12, unit: "1" }, "values.maxAbs": { tolerance: 1e-12, unit: "1" } },
  });
});

test("r0 is gated on every mismatch at 0 and on the scaled sag at 1e-12, and blocks the rungs after it", () => {
  const { r0, r1, selftest } = loadPolicy().rungs;
  assert.deepEqual([r0.quantity, r0.mode, r0.class], ["system.describe", "direct", "gated"]);
  assert.deepEqual(r0.metrics, {
    "aperture.mismatches": { tolerance: 0, unit: "elements" },
    "index.mismatches": { tolerance: 0, unit: "elements" },
    "layout.mismatches": { tolerance: 0, unit: "elements" },
    "sag.maxScaled": { tolerance: 1e-12, unit: "1" },
    "shape.mismatches": { tolerance: 0, unit: "elements" },
  });
  assert.equal(r0.blocksLaterRungs, true);
  // Every count the comparator reports is judged; the plain sag difference is shown beside the scaled one.
  const reported = COMPARATORS.get("system.describe")?.metrics.map((metric) => metric.name) ?? [];
  assert.deepEqual(
    reported.filter((name) => !Object.hasOwn(r0.metrics, name)),
    ["sag.maxAbs"],
  );

  assert.deepEqual([r1.quantity, r1.mode, r1.class], ["paraxial.first-order", "direct", "gated"]);
  assert.deepEqual(r1.metrics, { "firstOrder.maxAbs": { tolerance: 1e-9, unit: "mm" } });
  assert.equal(r1.blocksLaterRungs, undefined);
  assert.equal(selftest.blocksLaterRungs, undefined);
});

test("every judged rung has a policy entry and every entry a judged rung, with its quantity and metrics", () => {
  assert.deepEqual(policyRegistryProblems(loadPolicy(), judgedRungs(), COMPARATORS), []);
  assert.deepEqual(
    Object.keys(loadPolicy().rungs).sort(),
    judgedRungs()
      .map((rung) => rung.id)
      .sort(),
  );
  // The one rung that is run only where it is named is the one nothing judges: it has no entry, and cannot have
  // one before its quantity has a comparator.
  assert.deepEqual(
    RUNGS.filter((rung) => !judgedRungs().includes(rung)),
    [raysRung],
  );
  assert.deepEqual(policyRegistryProblems(loadPolicy(), RUNGS, COMPARATORS), ["rung rays has no policy entry"]);
  assert.equal(COMPARATORS.get(raysRung.quantity), undefined);
});

test("each way a policy and the code can disagree is reported", () => {
  const other: RungDefinition = { id: "other", quantity: "selftest.echo", buildRequests: () => [] };
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [selftestRung], COMPARATORS), []);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [selftestRung, other], COMPARATORS), [
    "rung other has no policy entry",
  ]);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, judgedRungs(), COMPARATORS), [
    "rung r0 has no policy entry",
    "rung r1 has no policy entry",
  ]);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [], COMPARATORS), [
    "policy entry selftest is of no registered rung",
  ]);

  const entry = POLICY_SELFTEST.rungs.selftest;
  const policyOf = (change: Partial<Policy["rungs"][string]>): Policy => ({
    ...POLICY_SELFTEST,
    rungs: { selftest: { ...entry, ...change } },
  });
  const registered = [selftestRung];
  assert.deepEqual(policyRegistryProblems(policyOf({ quantity: "rays.trace" }), registered, COMPARATORS), [
    "policy entry selftest names the quantity rays.trace; the rung's is selftest.echo",
  ]);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, registered, createComparatorLookup([])), [
    "policy entry selftest: the quantity selftest.echo has no comparator",
  ]);
  const metrics = { "sum.abs": { tolerance: 1e-12, unit: "mm" }, "values.rms": { tolerance: 1e-12, unit: "1" } };
  assert.deepEqual(policyRegistryProblems(policyOf({ metrics }), registered, COMPARATORS), [
    "policy entry selftest: metric sum.abs is in mm; the comparator reports 1",
    "policy entry selftest: the comparator reports no metric values.rms",
  ]);
  // A format example is not the comparator's policy: its r1 judges metrics the comparator does not report, and
  // its other rungs are of later phases or of none.
  assert.deepEqual(policyRegistryProblems(POLICY_EVERY_MODE, judgedRungs(), COMPARATORS), [
    "rung selftest has no policy entry",
    "rung r0 has no policy entry",
    "policy entry notes is of no registered rung",
    "policy entry r1: the comparator reports no metric efl.abs",
    "policy entry r1: the comparator reports no metric pupil.z.abs",
    "policy entry r2 is of no registered rung",
    "policy entry r5 is of no registered rung",
  ]);
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
