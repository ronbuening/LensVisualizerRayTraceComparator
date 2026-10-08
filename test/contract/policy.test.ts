// The rules of a policy and of a comparison set that their schemas cannot state.
import assert from "node:assert/strict";
import { test } from "node:test";

import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import type { ComparisonSet } from "../../src/contract/comparison.ts";
import { policyProblems } from "../../src/contract/policy.ts";
import type { Policy, RungPolicy } from "../../src/contract/policy.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { FAILING_VERDICTS, VERDICTS } from "../../src/contract/comparison.ts";
import {
  COMPARISON_FLOOR,
  COMPARISON_PAIRWISE,
  COMPARISON_REFERENCE,
  POLICY_EVERY_MODE,
  POLICY_LADDER,
  POLICY_SELFTEST,
} from "./corpus.ts";

function policyOf(rungs: Record<string, RungPolicy>): Policy {
  const policy: Policy = { contract: "1.0", kind: "policy", version: 1, rungs };
  assert.deepEqual(validateKind("policy", policy), []);
  return policy;
}

test("the valid policy fixtures keep the rules of a policy", () => {
  assert.deepEqual(policyProblems(POLICY_SELFTEST), []);
  assert.deepEqual(policyProblems(POLICY_EVERY_MODE), []);
  assert.deepEqual(policyProblems(POLICY_LADDER), []);
});

test("a floor belongs to a gated rung, names two engines, and has a metric whose limits enclose its tolerance", () => {
  const whole: RungPolicy = {
    quantity: "rays.trace",
    mode: "identical-rays",
    class: "gated",
    metrics: {
      "hits.maxDistance": { tolerance: 1e-8, unit: "mm", floor: { limit: 1e-7, agreement: 1e-10 } },
      "mask.mismatches": { tolerance: 0, unit: "rays" },
    },
    floor: { engine: "lv", arbiter: "ref" },
  };
  const { floor: _floor, ...unfloored } = whole;
  const rung = (change: Partial<RungPolicy>, base: RungPolicy = whole): Policy =>
    policyOf({ r2: { ...base, ...change } });
  assert.deepEqual(policyProblems(rung({})), []);
  // The limits may sit on the tolerance itself: a floor that admits nothing more than the gate, and a witness
  // that need be no nearer than the gate.
  const onGate = { m: { tolerance: 1e-8, unit: "mm", floor: { limit: 1e-8, agreement: 1e-8 } } };
  assert.deepEqual(policyProblems(rung({ metrics: onGate })), []);

  assert.deepEqual(policyProblems(rung({ floor: { engine: "lv", arbiter: "lv" } })), [
    "rung r2: the floor's engine lv is its own arbiter",
  ]);
  assert.deepEqual(policyProblems(rung({}, unfloored)), [
    "rung r2: metric hits.maxDistance has floor limits and the rung no floor",
  ]);
  assert.deepEqual(policyProblems(rung({ metrics: { "mask.mismatches": { tolerance: 0, unit: "rays" } } })), [
    "rung r2: it has a floor and no metric with floor limits",
  ]);
  // A limit below the tolerance would fail what the gate passes; an agreement above it would call a failing
  // engine a witness.
  for (const floor of [
    { limit: 1e-9, agreement: 1e-10 },
    { limit: 1e-7, agreement: 1e-7 },
  ]) {
    assert.deepEqual(policyProblems(rung({ metrics: { m: { tolerance: 1e-8, unit: "mm", floor } } })), [
      "rung r2: the floor limits of metric m do not enclose its tolerance",
    ]);
  }
  // A recorded rung never fails, so it has nothing a floor could excuse.
  const recorded = rung({ class: "recorded" });
  assert.deepEqual(policyProblems(recorded), ["rung r2: a recorded rung has no floor"]);
  const limitsOnly = rung({ class: "recorded" }, unfloored);
  assert.deepEqual(policyProblems(limitsOnly), ["rung r2: a recorded rung has no floor"]);
});

test("FLOOR is a verdict between PASS and FAIL, and fails nothing", () => {
  assert.deepEqual(
    [...VERDICTS],
    ["PASS", "FLOOR", "FAIL", "RECORDED", "ATTENTION", "UNSUPPORTED", "BLOCKED", "ERROR"],
  );
  assert.deepEqual([...FAILING_VERDICTS], ["FAIL", "ERROR"]);
  assert.deepEqual(validateKind("comparison", COMPARISON_FLOOR), []);
  assert.deepEqual(comparisonInvariantProblems(COMPARISON_FLOOR), []);
  assert.equal(COMPARISON_FLOOR.pairs[0].verdict, "FLOOR");
});

test("a gated metric needs a tolerance, and an attention band is not one", () => {
  const policy = policyOf({
    r1: {
      quantity: "paraxial.first-order",
      mode: "direct",
      class: "gated",
      metrics: {
        "efl.abs": { unit: "mm" },
        "bfl.abs": { attention: 1e-9, unit: "mm" },
        "z.abs": { tolerance: 0, unit: "mm" },
      },
    },
  });
  assert.deepEqual(policyProblems(policy), [
    "rung r1: metric bfl.abs is gated and has no tolerance",
    "rung r1: metric efl.abs is gated and has no tolerance",
  ]);
});

test("an independent-method rung cannot be gated, and can be recorded", () => {
  const metrics = { "mtf.maxAbs": { tolerance: 0.01, attention: 0.005, unit: "1" } };
  const gated = policyOf({ r5: { quantity: "mtf.native", mode: "independent-method", class: "gated", metrics } });
  assert.deepEqual(policyProblems(gated), ["rung r5: an independent-method rung cannot be gated"]);
  const recorded = policyOf({ r5: { quantity: "mtf.native", mode: "independent-method", class: "recorded", metrics } });
  assert.deepEqual(policyProblems(recorded), []);
});

test("a gated rung judges at least one metric; a recorded rung needs none, nor any limit", () => {
  const gated = policyOf({ r0: { quantity: "system.describe", mode: "direct", class: "gated", metrics: {} } });
  assert.deepEqual(policyProblems(gated), ["rung r0: a gated rung needs at least one metric"]);
  const recorded = policyOf({
    r0: { quantity: "system.describe", mode: "identical-rays", class: "recorded", metrics: { a: { unit: "mm" } } },
    r9: { quantity: "system.describe", mode: "direct", class: "recorded", metrics: {} },
  });
  assert.deepEqual(policyProblems(recorded), []);
});

test("every broken rule of every rung is reported, in the order of the rung ids", () => {
  const policy = policyOf({
    b: { quantity: "mtf.native", mode: "independent-method", class: "gated", metrics: { m: { unit: "1" } } },
    a: { quantity: "rays.trace", mode: "identical-rays", class: "gated", metrics: {} },
  });
  assert.deepEqual(policyProblems(policy), [
    "rung a: a gated rung needs at least one metric",
    "rung b: an independent-method rung cannot be gated",
    "rung b: metric m is gated and has no tolerance",
  ]);
});

test("the valid comparison fixtures keep the rules of a comparison set", () => {
  assert.deepEqual(comparisonInvariantProblems(COMPARISON_REFERENCE), []);
  assert.deepEqual(comparisonInvariantProblems(COMPARISON_PAIRWISE), []);
});

test("a comparison set states its reference exactly in the mode reference-vs-each, and it is a participant", () => {
  const { reference: _reference, ...unnamed } = COMPARISON_REFERENCE;
  assert.deepEqual(comparisonInvariantProblems(unnamed as ComparisonSet), ['mode "reference-vs-each" needs reference']);
  assert.deepEqual(comparisonInvariantProblems({ ...COMPARISON_PAIRWISE, reference: "lv" }), [
    'mode "pairwise" has no reference',
  ]);
  assert.deepEqual(comparisonInvariantProblems({ ...COMPARISON_REFERENCE, reference: "lv", pairs: [] }), [
    "reference lv is not a participant",
  ]);
});

test("a pair names two different participants, the reference first", () => {
  const [first, second] = COMPARISON_REFERENCE.pairs;
  const set = (pairs: ComparisonSet["pairs"]): ComparisonSet => ({ ...COMPARISON_REFERENCE, pairs });
  assert.deepEqual(comparisonInvariantProblems(set([{ ...first, b: "lv" }])), ["pair 0: lv is not a participant"]);
  assert.deepEqual(comparisonInvariantProblems(set([first, { ...second, b: "fake-a" }])), [
    "pair 1: fake-a is compared with itself",
  ]);
  assert.deepEqual(comparisonInvariantProblems(set([{ ...first, a: "fake-b", b: "fake-a" }])), [
    "pair 0: its first engine is fake-b, not the reference fake-a",
  ]);
  const twice = {
    ...COMPARISON_PAIRWISE,
    participants: [...COMPARISON_PAIRWISE.participants, { engine: "lv", fingerprint: null, status: "ok" as const }],
  };
  assert.deepEqual(comparisonInvariantProblems(twice), ["engine lv is a participant more than once"]);
});
