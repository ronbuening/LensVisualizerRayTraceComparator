// Groups: which pairs a reference-vs-each and a pairwise comparison hold, and in what order.
import assert from "node:assert/strict";
import { test } from "node:test";

import { compareGroup, defaultReference } from "../../src/compare/group.ts";
import type { ComparisonGroup } from "../../src/compare/group.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { selftestEchoComparator } from "../../src/compare/selftestEcho.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import type { ComparisonSet } from "../../src/contract/comparison.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { GATED, answered, ended } from "./support.ts";

const ID = "ab".repeat(32);

function groupOf(participants: readonly ParticipantResult[]): ComparisonGroup {
  return {
    suite: "pair",
    run: "singlet",
    caseId: ID,
    rung: "selftest",
    quantity: "selftest.echo",
    requestId: ID,
    participants,
    policy: GATED,
    comparator: selftestEchoComparator,
  };
}

/** Engines `e1` to `eN` in an order that is not that of their ids; each answers with its own number. */
function engines(count: number): ParticipantResult[] {
  const sorted = Array.from({ length: count }, (_unused, index) => answered(`e${index + 1}`, [index]));
  return [...sorted.slice(1).reverse(), sorted[0]];
}

function pairsOf(set: ComparisonSet): string[] {
  return set.pairs.map((pair) => `${pair.a}-${pair.b}`);
}

test("a set is a valid comparison that names its group and its participants sorted by id", () => {
  const participants = [answered("b", [1]), ended("c", "unsupported", "quantity selftest.echo"), answered("a", [1])];
  for (const set of [
    compareGroup(groupOf(participants), "reference-vs-each", "b"),
    compareGroup(groupOf(participants), "pairwise"),
  ]) {
    assert.deepEqual(validateKind("comparison", set), []);
    assert.deepEqual(comparisonInvariantProblems(set), []);
    assert.deepEqual(set.participants, [
      { engine: "a", fingerprint: "a sources", status: "ok" },
      { engine: "b", fingerprint: "b sources", status: "ok" },
      { engine: "c", fingerprint: "c sources", status: "unsupported" },
    ]);
    const { contract, kind, suite, run, caseId, rung, quantity, requestId } = set;
    assert.deepEqual(
      { contract, kind, suite, run, caseId, rung, quantity, requestId },
      {
        contract: CONTRACT_VERSION,
        kind: "comparison",
        suite: "pair",
        run: "singlet",
        caseId: ID,
        rung: "selftest",
        quantity: "selftest.echo",
        requestId: ID,
      },
    );
  }
});

test("reference-vs-each has N - 1 pairs, the reference first, the others in id order", () => {
  const expected: Record<number, Record<string, string[]>> = {
    2: { e1: ["e1-e2"], e2: ["e2-e1"] },
    3: { e1: ["e1-e2", "e1-e3"], e2: ["e2-e1", "e2-e3"], e3: ["e3-e1", "e3-e2"] },
    4: { e1: ["e1-e2", "e1-e3", "e1-e4"], e3: ["e3-e1", "e3-e2", "e3-e4"], e4: ["e4-e1", "e4-e2", "e4-e3"] },
  };
  for (const [count, byReference] of Object.entries(expected)) {
    for (const [reference, pairs] of Object.entries(byReference)) {
      const set = compareGroup(groupOf(engines(Number(count))), "reference-vs-each", reference);
      assert.equal(set.mode, "reference-vs-each");
      assert.equal(set.reference, reference);
      assert.deepEqual(pairsOf(set), pairs, `N = ${count}, reference ${reference}`);
      assert.equal(set.pairs.length, Number(count) - 1);
    }
  }
});

test("pairwise has N(N - 1)/2 pairs, every two engines once, in id order, and no reference", () => {
  const expected: Record<number, string[]> = {
    2: ["e1-e2"],
    3: ["e1-e2", "e1-e3", "e2-e3"],
    4: ["e1-e2", "e1-e3", "e1-e4", "e2-e3", "e2-e4", "e3-e4"],
  };
  for (const [count, pairs] of Object.entries(expected)) {
    const set = compareGroup(groupOf(engines(Number(count))), "pairwise", "e2");
    assert.equal(set.mode, "pairwise");
    assert.equal(Object.hasOwn(set, "reference"), false);
    assert.deepEqual(pairsOf(set), pairs, `N = ${count}`);
    assert.equal(set.pairs.length, (Number(count) * (Number(count) - 1)) / 2);
  }
});

test("engine ids are ordered by code unit, as everywhere else", () => {
  const set = compareGroup(
    groupOf([answered("b", [0]), answered("a-b", [0]), answered("a1", [0]), answered("a", [0])]),
    "pairwise",
  );
  assert.deepEqual(
    set.participants.map((participant) => participant.engine),
    ["a", "a-b", "a1", "b"],
  );
});

test("a pair is judged alike in both modes, and the order of the participants given changes nothing", () => {
  const participants = [
    answered("a", [1, 2]),
    answered("b", [1, 2.5]),
    ended("c", "error", "timeout"),
    answered("d", [1, 2]),
  ];
  const against = compareGroup(groupOf(participants), "reference-vs-each", "a");
  const each = compareGroup(groupOf(participants), "pairwise");
  assert.deepEqual(against.pairs, each.pairs.slice(0, 3));
  assert.deepEqual(
    each.pairs.map((pair) => pair.verdict),
    ["FAIL", "ERROR", "PASS", "ERROR", "FAIL", "ERROR"],
  );
  const shuffled = [participants[2], participants[0], participants[3], participants[1]];
  assert.equal(canonicalJson(compareGroup(groupOf(shuffled), "pairwise")), canonicalJson(each));
  assert.equal(canonicalJson(compareGroup(groupOf(shuffled), "reference-vs-each", "a")), canonicalJson(against));
});

test("a group of one, and of none, has no pairs", () => {
  const one = [answered("only", [1])];
  assert.deepEqual(compareGroup(groupOf(one), "reference-vs-each", "only").pairs, []);
  assert.deepEqual(compareGroup(groupOf(one), "pairwise").pairs, []);
  assert.deepEqual(compareGroup(groupOf([]), "pairwise").participants, []);
});

test("a reference that is not a participant, and an engine that is one twice, are refused", () => {
  const two = [answered("a", [1]), answered("b", [1])];
  assert.throws(() => compareGroup(groupOf(two), "reference-vs-each", "c"), {
    message: "compareGroup: the reference c is not a participant",
  });
  assert.throws(() => compareGroup(groupOf(two), "reference-vs-each"), {
    message: "compareGroup: the reference (none given) is not a participant",
  });
  assert.throws(() => compareGroup(groupOf([...two, answered("a", [2])]), "pairwise"), {
    message: "compareGroup: engine a is a participant twice",
  });
});

test("the default reference is the first engine in id order with an ok result, else the first of all", () => {
  const none = ended("a", "unsupported");
  assert.equal(defaultReference([answered("c", [1]), none, answered("b", [1])]), "b");
  assert.equal(defaultReference([ended("z", "error"), none]), "a");
  assert.equal(defaultReference([]), undefined);
});
