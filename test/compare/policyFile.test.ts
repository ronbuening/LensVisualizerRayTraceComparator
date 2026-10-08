// The comparator's own policy file, and what holds it to the rungs and the comparators.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { createComparatorLookup } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { POLICY_FILE, loadPolicy, policyRegistryProblems } from "../../src/compare/policyFile.ts";
import type { MetricPolicy, Policy } from "../../src/contract/policy.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { RUNGS, r0Rung, r1Rung, selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { POLICY_EVERY_MODE, POLICY_LADDER, POLICY_SELFTEST } from "../contract/corpus.ts";
import { tempDir } from "../core/support.ts";

test("the policy file is policy/rungs.v1.json, and holds the comparator's own policy", () => {
  assert.equal(POLICY_FILE, join(REPO_ROOT, "policy", "rungs.v1.json"));
  const policy = loadPolicy();
  assert.deepEqual(policy, POLICY_LADDER);
  assert.equal(policy.version, 4);
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
  // A pupil's position and its radius are judged on the scale of the pupil's distance from the image plane; every
  // other value plainly. All three gates are 1e-9 mm, and nothing of R1 has a floor.
  assert.deepEqual(r1.metrics, {
    "firstOrder.maxAbs": { tolerance: 1e-9, unit: "mm" },
    "pupilRadius.maxScaled": { tolerance: 1e-9, unit: "mm" },
    "pupilZ.maxScaled": { tolerance: 1e-9, unit: "mm" },
  });
  // The plain figure of each is shown beside the scaled one, and not judged.
  const firstOrder = COMPARATORS.get("paraxial.first-order")?.metrics.map((metric) => metric.name) ?? [];
  assert.deepEqual(
    firstOrder.filter((name) => !Object.hasOwn(r1.metrics, name)),
    ["pupilZ.maxAbs", "pupilRadius.maxAbs"],
  );
  assert.equal(r1.blocksLaterRungs, undefined);
  assert.equal(selftest.blocksLaterRungs, undefined);
});

test("r2 and r3 are gated on identical rays, at the gates of the ladder, with the floor of lv against ref", () => {
  const { r2, r3 } = loadPolicy().rungs;
  for (const rung of [r2, r3]) {
    assert.deepEqual([rung.quantity, rung.mode, rung.class], ["rays.trace", "identical-rays", "gated"]);
    assert.deepEqual(rung.floor, { engine: "lv", arbiter: "ref" });
    assert.equal(rung.blocksLaterRungs, undefined);
  }
  // Lengths: 1e-8 mm, a floor of lv up to 1e-7 mm where every other engine is within 1e-10 mm of ref. The exit
  // direction: 1e-9, a floor of lv up to 1e-8 where every other engine is within 1e-12 of ref. The mask has no
  // floor: a ray that one engine stopped and the other passed is always a failure.
  const mm = { tolerance: 1e-8, unit: "mm", floor: { limit: 1e-7, agreement: 1e-10 } };
  assert.deepEqual(r2.metrics, {
    "direction.maxAbs": { tolerance: 1e-9, unit: "1", floor: { limit: 1e-8, agreement: 1e-12 } },
    "hits.maxDistance": mm,
    "landing.maxDistance": mm,
    "mask.mismatches": { tolerance: 0, unit: "rays" },
  });
  // Paths: 2e-5 waves, a floor of lv up to 2e-4 waves where every other engine is within 1e-7 waves of ref.
  const waves = { tolerance: 2e-5, unit: "waves", floor: { limit: 2e-4, agreement: 1e-7 } };
  assert.deepEqual(r3.metrics, {
    "opd.maxAbs": waves,
    "opticalPath.maxAbs": waves,
    "opticalPathToImage.maxAbs": waves,
  });
  // What R2 reports and does not judge: the rays in the rim band, and how many rays were compared.
  const reported = COMPARATORS.get("rays.trace", "r2")?.metrics.map((metric) => metric.name) ?? [];
  assert.deepEqual(
    reported.filter((name) => !Object.hasOwn(r2.metrics, name)),
    ["mask.rimBand", "rays.compared"],
  );
  // Every floor limit is ten times its gate, and every agreement at most a hundredth of it.
  const judged: [string, MetricPolicy][] = [...Object.entries(r2.metrics), ...Object.entries(r3.metrics)];
  for (const [name, metric] of judged) {
    if (metric.floor === undefined) continue;
    const gate = metric.tolerance as number;
    assert.ok(Math.abs(metric.floor.limit / gate - 10) < 1e-9, name);
    assert.ok(metric.floor.agreement <= gate / 100, name);
  }
  // No other rung has a floor.
  const floored = Object.entries(loadPolicy().rungs).filter(([, rung]) => rung.floor !== undefined);
  assert.deepEqual(
    floored.map(([id]) => id),
    ["r2", "r3"],
  );
});

test("every rung has a policy entry and every entry a rung, with its quantity, a comparator and its metrics", () => {
  assert.deepEqual(policyRegistryProblems(loadPolicy(), RUNGS, COMPARATORS), []);
  assert.deepEqual(Object.keys(loadPolicy().rungs).sort(), RUNGS.map((rung) => rung.id).sort());
  // Two rungs compare one quantity, each by a comparator of its own.
  for (const rung of RUNGS) assert.ok(COMPARATORS.get(rung.quantity, rung.id) !== undefined, rung.id);
  assert.notEqual(COMPARATORS.get("rays.trace", "r2"), COMPARATORS.get("rays.trace", "r3"));
  assert.equal(COMPARATORS.get("rays.trace"), undefined);
});

test("each way a policy and the code can disagree is reported", () => {
  const other: RungDefinition = { id: "other", quantity: "selftest.echo", buildRequests: () => [] };
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [selftestRung], COMPARATORS), []);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [selftestRung, other], COMPARATORS), [
    "rung other has no policy entry",
  ]);
  assert.deepEqual(policyRegistryProblems(POLICY_SELFTEST, [selftestRung, r0Rung, r1Rung], COMPARATORS), [
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
  assert.deepEqual(policyRegistryProblems(POLICY_EVERY_MODE, RUNGS, COMPARATORS), [
    "rung selftest has no policy entry",
    "rung r0 has no policy entry",
    "rung r3 has no policy entry",
    "policy entry notes is of no registered rung",
    "policy entry r1: the comparator reports no metric efl.abs",
    "policy entry r1: the comparator reports no metric pupil.z.abs",
    "policy entry r2: the comparator reports no metric clip.mismatches",
    "policy entry r5 is of no registered rung",
  ]);
  // A quantity that is compared for other rungs only has no comparator for this one.
  const stray: RungDefinition = { id: "r9", quantity: "rays.trace", buildRequests: () => [] };
  const strayPolicy: Policy = { ...POLICY_SELFTEST, rungs: { r9: POLICY_LADDER.rungs.r2 } };
  assert.deepEqual(policyRegistryProblems(strayPolicy, [stray], COMPARATORS), [
    "policy entry r9: the quantity rays.trace has no comparator",
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
