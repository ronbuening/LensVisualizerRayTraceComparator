// The comparator's own policy file, and what holds it to the rungs and the comparators.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { createComparatorLookup } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { POLICY_FILE, loadPolicy, policyRegistryProblems } from "../../src/compare/policyFile.ts";
import type { Policy, RungPolicy } from "../../src/contract/policy.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { RUNGS, r0Rung, r1Rung, r4Rung, r5Rung, selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { POLICY_EVERY_MODE, POLICY_LADDER, POLICY_SELFTEST, POLICY_SEVERAL_LINES } from "../contract/corpus.ts";
import { tempDir } from "../core/support.ts";

test("the policy file is policy/rungs.v1.json, and holds the comparator's own policy", () => {
  assert.equal(POLICY_FILE, join(REPO_ROOT, "policy", "rungs.v1.json"));
  const policy = loadPolicy();
  assert.equal(policy.version, 23);
  assert.equal(policy.contract, "1.3");
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

test("r2 and r3 are gated on identical rays, at the gates of the ladder, without floors", () => {
  const { r2, r3 } = loadPolicy().rungs;
  for (const rung of [r2, r3]) {
    assert.deepEqual([rung.quantity, rung.mode, rung.class], ["rays.trace", "identical-rays", "gated"]);
    assert.equal(rung.floor, undefined);
    assert.equal(rung.blocksLaterRungs, undefined);
  }
  // Lengths keep their 1e-8 mm gates; direction keeps 1e-9. Every excess fails.
  const mm = { tolerance: 1e-8, unit: "mm" };
  assert.deepEqual(r2.metrics, {
    "direction.maxAbs": { tolerance: 1e-9, unit: "1" },
    "hits.maxDistance": mm,
    "landing.maxDistance": mm,
    "mask.mismatches": { tolerance: 0, unit: "rays" },
  });
  const waves = { tolerance: 2e-5, unit: "waves" };
  assert.deepEqual(r3.metrics, {
    "opd.maxAbs": waves,
    "opticalPath.maxAbs": waves,
    "opticalPathToImage.maxAbs": waves,
    "phasePath.maxAbs": waves,
  });
  // What R2 reports and does not judge: the rays in the rim band, and how many rays were compared.
  const reported = COMPARATORS.get("rays.trace", "r2")?.metrics.map((metric) => metric.name) ?? [];
  assert.deepEqual(
    reported.filter((name) => !Object.hasOwn(r2.metrics, name)),
    ["mask.rimBand", "rays.compared"],
  );
  // Policy version 11 grants no floor on any rung or metric.
  for (const rung of Object.values(loadPolicy().rungs)) {
    assert.equal(rung.floor, undefined);
    for (const metric of Object.values(rung.metrics)) assert.equal(metric.floor, undefined);
  }
});

test("r4 is gated on identical rays: the MTF at 1e-7, nothing else judged, no floor, and it blocks nothing", () => {
  const { r4 } = loadPolicy().rungs;
  assert.deepEqual([r4.quantity, r4.mode, r4.class], ["rays.trace", "identical-rays", "gated"]);
  assert.deepEqual(r4.metrics, { "mtf.maxAbs": { tolerance: 1e-7, unit: "1" } });
  assert.equal(r4.floor, undefined);
  assert.equal(r4.blocksLaterRungs, undefined);
  // Its comparator is its own, a comparator of spans, and what it reports beside the MTF is counted and shown:
  // the rays one engine lost are R2's to judge.
  const comparator = COMPARATORS.get("rays.trace", "r4");
  assert.equal(comparator?.rung, "r4");
  assert.equal(typeof comparator?.spanOf, "function");
  assert.deepEqual(
    comparator?.metrics.map((metric) => `${metric.name} ${metric.unit}`),
    ["mtf.maxAbs 1", "rays.compared rays", "rays.dropped rays", "lines.compared lines"],
  );
  // The rung asks the requests of R2 and R3, of a run that has a recipe.
  assert.deepEqual(
    [r4Rung.quantity, r4Rung.needsRaySets, r4Rung.needsRecipe, r4Rung.engines],
    ["rays.trace", true, true, undefined],
  );
});

test("r6a is gated on the wave MTF of the traced rays, at the pin of Stage 3.12, with no floor", () => {
  const { r6a } = loadPolicy().rungs;
  assert.deepEqual([r6a.quantity, r6a.mode, r6a.class], ["rays.trace", "identical-rays", "gated"]);
  // Ten times the largest figure of a judged field of the benchmark, 1.18e-9, rounded up to one digit.
  assert.deepEqual(r6a.metrics, { "waveMtf.maxAbs": { tolerance: 2e-8, unit: "1" } });
  assert.equal(r6a.floor, undefined);
  assert.equal(r6a.blocksLaterRungs, undefined);
  // The figure of a lattice that is no arbiter is a metric of the comparator and none of the policy.
  const reported = COMPARATORS.get("rays.trace", "r6a")?.metrics.map((metric) => metric.name) ?? [];
  assert.ok(reported.includes("waveMtf.maxAbs") && reported.includes("waveMtf.flagged"));
  assert.notEqual(COMPARATORS.get("rays.trace", "r6a"), COMPARATORS.get("rays.trace", "r4"));
});

test("r4f is gated, direct: the MTF at 1e-9, every count at 0, no floor, and it blocks nothing", () => {
  const { r4f } = loadPolicy().rungs;
  assert.deepEqual([r4f.quantity, r4f.mode, r4f.class], ["mtf.native", "direct", "gated"]);
  assert.deepEqual(r4f.metrics, {
    "fields.mismatches": { tolerance: 0, unit: "elements" },
    "mtf.maxAbs": { tolerance: 1e-9, unit: "1" },
    "sampling.mismatches": { tolerance: 0, unit: "elements" },
  });
  assert.equal(r4f.floor, undefined);
  assert.equal(r4f.blocksLaterRungs, undefined);
  // Every figure its comparator reports is judged.
  const reported = COMPARATORS.get("mtf.native", "r4f")?.metrics.map((metric) => metric.name) ?? [];
  assert.deepEqual(reported.sort(), Object.keys(r4f.metrics).sort());
});

test("r5 is recorded, of two methods: the plan's bands on and off the axis, and the limit of the chief rays' landing", () => {
  const { r6b } = loadPolicy().rungs;
  const r5: RungPolicy = loadPolicy().rungs.r5;
  assert.deepEqual([r5.quantity, r5.mode, r5.class], ["mtf.native", "independent-method", "recorded"]);
  assert.deepEqual(
    { ...r5.metrics },
    {
      "chiefLanding.maxAbs": { attention: 1e-7, unit: "mm" },
      "mtfOffAxis.maxAbs": { attention: 0.01, unit: "1" },
      "mtfOnAxis.maxAbs": { attention: 0.005, unit: "1" },
    },
  );
  // The bands are those of R6b. The chief-landing sorting limit retains its Stage 3.7 pin,
  // independently of R2's gates and the removal of its floors.
  for (const name of ["mtfOffAxis.maxAbs", "mtfOnAxis.maxAbs"]) assert.deepEqual(r5.metrics[name], r6b.metrics[name]);
  assert.equal(r5.metrics["chiefLanding.maxAbs"].attention, 1e-7);
  // Nothing of it is gated, floored or blocking, and no metric has a tolerance.
  assert.equal(r5.floor, undefined);
  assert.equal(r5.blocksLaterRungs, undefined);
  assert.ok(Object.values(r5.metrics).every((metric) => metric.tolerance === undefined && metric.floor === undefined));
  const comparator = COMPARATORS.get("mtf.native", "r5");
  assert.equal(comparator?.rung, "r5");
  const reported = comparator?.metrics.map((metric) => metric.name) ?? [];
  for (const name of Object.keys(r5.metrics)) assert.ok(reported.includes(name), name);
  // The rung is of three engines, asks the one request of R6b, and is run only where it is named.
  assert.deepEqual([r5Rung.quantity, r5Rung.needsRecipe, r5Rung.onlyWhereNamed], ["mtf.native", true, true]);
  assert.deepEqual(r5Rung.engines, ["lv", "optiland", "wave"]);
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
    "rung r4 has no policy entry",
    "rung r4f has no policy entry",
    "rung r5g has no policy entry",
    "rung r6a has no policy entry",
    "rung r6b has no policy entry",
    "rung r6c has no policy entry",
    "rung r7a has no policy entry",
    "rung r7b has no policy entry",
    "rung r8a has no policy entry",
    "rung r8b has no policy entry",
    "rung r9a has no policy entry",
    "rung r9b has no policy entry",
    "rung r10a has no policy entry",
    "rung r10b has no policy entry",
    "rung r11a has no policy entry",
    "rung r11b has no policy entry",
    "rung r12b has no policy entry",
    "rung r13b has no policy entry",
    "rung r14b has no policy entry",
    "policy entry notes is of no registered rung",
    "policy entry r1: the comparator reports no metric efl.abs",
    "policy entry r1: the comparator reports no metric pupil.z.abs",
    "policy entry r2: the comparator reports no metric clip.mismatches",
    "policy entry r5: the comparator reports no metric mtf.maxAbs",
    "policy entry r5: the comparator reports no metric mtf.rms",
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

test("a policy using attentionSeveralLines refuses earlier contract minors", (t) => {
  const directory = tempDir(t);
  for (const contract of ["1.0", "1.1", "1.2", "1.3", "1.10"]) {
    const policy = { ...POLICY_SEVERAL_LINES, contract };
    const file = join(directory, `policy-${contract}.json`);
    writeFileSync(file, JSON.stringify(policy));
    if (["1.0", "1.1", "1.2"].includes(contract)) assert.throws(() => loadPolicy(file), /not a valid policy/);
    else assert.deepEqual(loadPolicy(file), policy);
  }
});

test("baseline verification requires the exact policy version and hash", async () => {
  const { baselinePolicyMatches } = await import("../../src/compare/policyFile.ts");
  const { hashCanonical } = await import("../../src/core/numeric/hash.ts");
  const policy = loadPolicy();
  const stated = { version: policy.version, hash: hashCanonical(policy) };
  assert.ok(baselinePolicyMatches(stated, policy));
  assert.ok(!baselinePolicyMatches({ ...stated, version: 14 }, policy));
  assert.ok(!baselinePolicyMatches({ ...stated, hash: "0".repeat(64) }, policy));
});

test("a snapshot baseline's gates are held to the policy it records", async () => {
  const { baselineGateProblems } = await import("../../src/compare/policyFile.ts");
  const policy: Policy = {
    contract: "1.3",
    kind: "policy",
    version: 2,
    rungs: {
      r4: {
        quantity: "rays.trace",
        mode: "identical-rays",
        class: "gated",
        metrics: { "mtf.maxAbs": { tolerance: 1 / 8, unit: "1" } },
      },
    },
  } as unknown as Policy;
  const baseline = (verdict: string, value: number, tolerance = 1 / 8, rung = "r4", bands?: object) =>
    ({
      runs: [
        {
          name: "run",
          rungs: [
            {
              rung,
              quantity: "rays.trace",
              ...(bands === undefined ? {} : { bands }),
              pairs: [{ a: "a", b: "b", verdict, metrics: [{ name: "mtf.maxAbs", unit: "1", value, tolerance }] }],
            },
          ],
        },
      ],
    }) as never;
  assert.deepEqual(baselineGateProblems(baseline("PASS", 1 / 16), policy), []);
  assert.deepEqual(baselineGateProblems(baseline("FAIL", 1 / 4), policy), []);
  assert.deepEqual(baselineGateProblems(baseline("PASS", 1 / 4), policy), [
    "run r4 a b mtf.maxAbs: PASS with 0.25 above the recorded policy's 0.125",
  ]);
  assert.deepEqual(baselineGateProblems(baseline("PASS", 1 / 16, 1 / 4), policy), [
    "run r4 a b mtf.maxAbs: the gate is not the recorded policy's",
  ]);
  assert.deepEqual(baselineGateProblems(baseline("PASS", 1 / 16, 1 / 8, "r9"), policy), [
    "run r9: the recorded policy has no rung r9",
  ]);
  assert.deepEqual(baselineGateProblems(baseline("PASS", 1 / 16, 1 / 8, "r4", { "mtf.maxAbs": 1 / 2 }), policy), [
    "run r4: the band of mtf.maxAbs is not the recorded policy's",
  ]);
});
