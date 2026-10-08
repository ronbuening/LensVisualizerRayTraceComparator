// The blocking rule: a rung whose policy blocks later rungs keeps two engines that failed it from being judged
// against each other afterwards. Here on fake engines and made-up rungs, so that every case of the rule is one
// that can be arranged; test/cli/ladder.test.ts shows it on R0 and R1.
import assert from "node:assert/strict";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { createBlockingLedger, pairKey } from "../../src/compare/blocking.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { compareGroup } from "../../src/compare/group.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { blockedReason, comparePair } from "../../src/compare/pair.ts";
import { selftestEchoComparator } from "../../src/compare/selftestEcho.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import type { ComparisonSet, PairComparison, Verdict } from "../../src/contract/comparison.ts";
import { policyProblems } from "../../src/contract/policy.ts";
import type { Policy, RungPolicy } from "../../src/contract/policy.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import type { SelftestEchoData } from "../../src/contract/quantities/selftestEcho.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import { selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { DOUBLE_GAUSS, SINGLET, fakeEngine, pairSuite, tempDir, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import { GATED, RECORDED, answered, ended } from "./support.ts";

const BLOCKING: RungPolicy = { ...GATED, blocksLaterRungs: true };

function setOf(rung: string, pairs: readonly [a: string, b: string, verdict: Verdict][]): ComparisonSet {
  const engines = [...new Set(pairs.flatMap(([a, b]) => [a, b]))].sort();
  return {
    contract: "1.0",
    kind: "comparison",
    suite: "ladder",
    run: "one",
    caseId: "c".repeat(64),
    rung,
    quantity: SELFTEST_ECHO,
    requestId: "1".repeat(64),
    participants: engines.map((engine) => ({ engine, fingerprint: null, status: "ok" })),
    mode: "pairwise",
    pairs: pairs.map(([a, b, verdict]): PairComparison => ({ a, b, metrics: [], class: "gated", verdict })),
  };
}

// ── The ledger ───────────────────────────────────────────────────────────────────────────────────────────────────

test("a pair is two engines, whichever is named first", () => {
  assert.equal(pairKey("lv", "ref"), pairKey("ref", "lv"));
  assert.notEqual(pairKey("lv", "ref"), pairKey("lv", "optiland"));
  // Engine ids hold no character that could make two pairs one key.
  assert.notEqual(pairKey("a", "b-c"), pairKey("a-b", "c"));
  assert.equal(blockedReason("ref", "lv", "r0"), "not judged: rung r0 failed for lv and ref on this case");
  assert.equal(blockedReason("lv", "ref", "r0"), blockedReason("ref", "lv", "r0"));
});

test("a rung that blocks later rungs blocks the pairs that failed it: FAIL and ERROR, and no other verdict", () => {
  const ledger = createBlockingLedger();
  assert.equal(ledger.blockedIn("r0").size, 0);
  ledger.note(
    setOf("r0", [
      ["a", "b", "FAIL"],
      ["a", "c", "PASS"],
      ["a", "d", "ERROR"],
      ["a", "e", "UNSUPPORTED"],
      ["b", "c", "RECORDED"],
      ["b", "d", "ATTENTION"],
      ["b", "e", "BLOCKED"],
    ]),
    BLOCKING,
  );
  const blocked = ledger.blockedIn("r1");
  assert.deepEqual(
    [...blocked],
    [
      [pairKey("a", "b"), "r0"],
      [pairKey("a", "d"), "r0"],
    ],
  );
  // The key is the pair's, whichever engine a set names first.
  assert.equal(blocked.get(pairKey("b", "a")), "r0");
});

test("a rung does not block itself, an earlier blocker stays the blocker, and a rung without the flag blocks nothing", () => {
  const ledger = createBlockingLedger();
  ledger.note(setOf("r0", [["a", "b", "FAIL"]]), BLOCKING);
  // Another request of the same rung is judged: it is not a later rung.
  assert.equal(ledger.blockedIn("r0").size, 0);
  assert.equal(ledger.blockedIn("r1").get(pairKey("a", "b")), "r0");

  // A later rung that blocks too adds its own failures, and does not take over a pair already blocked.
  ledger.note(
    setOf("r1", [
      ["a", "b", "FAIL"],
      ["a", "c", "FAIL"],
    ]),
    BLOCKING,
  );
  const later = ledger.blockedIn("r2");
  assert.equal(later.get(pairKey("a", "b")), "r0");
  assert.equal(later.get(pairKey("a", "c")), "r1");
  // In r1 itself only the earlier rung's block holds.
  assert.deepEqual([...ledger.blockedIn("r1").values()], ["r0"]);

  const plain = createBlockingLedger();
  plain.note(setOf("r0", [["a", "b", "FAIL"]]), GATED);
  plain.note(setOf("r0", [["a", "b", "ERROR"]]), { ...GATED, blocksLaterRungs: false });
  assert.equal(plain.blockedIn("r1").size, 0);
  // What blockedIn returns is the caller's: changing it does not unblock anything.
  (ledger.blockedIn("r2") as Map<string, string>).clear();
  assert.equal(ledger.blockedIn("r2").size, 2);
});

test("only a gated rung can block: a recorded rung never fails", () => {
  const policy = (rung: RungPolicy): Policy => ({ contract: "1.0", kind: "policy", version: 1, rungs: { r0: rung } });
  assert.deepEqual(policyProblems(policy(BLOCKING)), []);
  assert.deepEqual(policyProblems(policy({ ...RECORDED, blocksLaterRungs: true })), [
    "rung r0: a recorded rung cannot block later rungs",
  ]);
  assert.deepEqual(policyProblems(policy({ ...RECORDED, blocksLaterRungs: false })), []);
  assert.deepEqual(validateKind("policy", policy(BLOCKING)), []);
});

// ── One pair and one group ───────────────────────────────────────────────────────────────────────────────────────

test("a blocked pair of two answers is BLOCKED: no metric, the rung's class, and the rung that blocks it", () => {
  const [a, b] = [answered("ref", [1, 2, 3]), answered("lv", [1, 2, 3])];
  const pair = comparePair(a, b, GATED, selftestEchoComparator, "r0");
  assert.deepEqual(pair, {
    a: "ref",
    b: "lv",
    metrics: [],
    class: "gated",
    verdict: "BLOCKED",
    reason: "not judged: rung r0 failed for lv and ref on this case",
  });
  // The answers are not looked at: two that would fail, and two that cannot be compared, are blocked alike.
  assert.equal(comparePair(a, answered("lv", [9, 9, 9]), GATED, selftestEchoComparator, "r0").verdict, "BLOCKED");
  assert.equal(comparePair(a, answered("lv", [1]), GATED, selftestEchoComparator, "r0").verdict, "BLOCKED");
  assert.equal(comparePair(a, b, GATED, undefined, "r0").verdict, "BLOCKED");
  assert.equal(comparePair(a, b, RECORDED, selftestEchoComparator, "r0").class, "recorded");
  // Without a blocker the pair is judged as ever.
  assert.equal(comparePair(a, b, GATED, selftestEchoComparator, undefined).verdict, "PASS");
});

test("an engine that did not answer says so, blocked or not: BLOCKED is of two answers", () => {
  const a = answered("ref", [1, 2, 3]);
  const unsupported = comparePair(
    a,
    ended("lv", "unsupported", "feature system.afocal"),
    GATED,
    selftestEchoComparator,
    "r0",
  );
  assert.equal(unsupported.verdict, "UNSUPPORTED");
  assert.equal(unsupported.reason, "lv is unsupported (feature system.afocal)");
  for (const status of ["error", "pending", "missing"] as const) {
    const pair = comparePair(a, ended("lv", status, "engine-failure"), GATED, selftestEchoComparator, "r0");
    assert.equal(pair.verdict, "ERROR", status);
    assert.match(pair.reason ?? "", /^lv /);
  }
});

test("a group blocks the pairs it is told are blocked, in both modes and whichever engine comes first", () => {
  const group = {
    suite: "ladder",
    run: "one",
    caseId: "c".repeat(64),
    rung: "r1",
    quantity: SELFTEST_ECHO,
    requestId: "1".repeat(64),
    participants: [answered("ref", [1, 2]), answered("lv", [1, 2]), answered("optiland", [1, 2])],
    policy: GATED,
    comparator: selftestEchoComparator,
    blocked: new Map([[pairKey("ref", "lv"), "r0"]]),
  };
  const against = compareGroup(group, "reference-vs-each", "ref");
  assert.deepEqual(
    against.pairs.map((pair) => [pair.a, pair.b, pair.verdict]),
    [
      ["ref", "lv", "BLOCKED"],
      ["ref", "optiland", "PASS"],
    ],
  );
  const each = compareGroup(group, "pairwise");
  assert.deepEqual(
    each.pairs.map((pair) => [pair.a, pair.b, pair.verdict]),
    [
      ["lv", "optiland", "PASS"],
      ["lv", "ref", "BLOCKED"],
      ["optiland", "ref", "PASS"],
    ],
  );
  assert.equal(each.pairs[1].reason, against.pairs[0].reason);
  for (const set of [against, each]) {
    assert.deepEqual(validateKind("comparison", set), []);
    assert.deepEqual(comparisonInvariantProblems(set), []);
  }
  // Without the list nothing is blocked.
  const free = compareGroup({ ...group, blocked: undefined }, "pairwise");
  assert.ok(free.pairs.every((pair) => pair.verdict === "PASS"));
});

// ── A whole run ──────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Three rungs of `selftest.echo`, in ladder order: enough of a ladder to have a first, a later and a last rung.
 * They ask the same request, so an engine's answer to one is its answer to all three.
 */
const LADDER: readonly RungDefinition[] = ["first", "second", "third"].map((id) => ({ ...selftestRung, id }));

function ladderPolicy(blocking: readonly string[]): Policy {
  const rungs = Object.fromEntries(LADDER.map(({ id }) => [id, blocking.includes(id) ? BLOCKING : GATED]));
  return { contract: "1.0", kind: "policy", version: 1, rungs };
}

/** An engine that is the fake with a bias on the singlet and without one on every other case. */
const wrongOnSinglet: EngineMaker = async (id) => {
  const [right, wrong] = [await fakeEngine()(id), await fakeEngine({ bias: 0.001 })(id)];
  return {
    id,
    describe: () => right.describe(),
    run: (request, opticalCase) => (opticalCase.id === SINGLET.id ? wrong : right).run(request, opticalCase),
    close: async () => void (await Promise.all([right.close(), wrong.close()])),
  };
};

const ENGINES: Readonly<Record<string, EngineMaker>> = {
  "fake-a": fakeEngine(),
  "fake-near": fakeEngine({ bias: 2e-14 }),
  "fake-none": fakeEngine({ offersQuantities: false }),
  "fake-odd": wrongOnSinglet,
};

async function compared(
  t: TestContext,
  policy: Policy,
  more: Partial<Parameters<typeof compareManifest>[0]> = {},
  engines: Readonly<Record<string, EngineMaker>> = ENGINES,
): Promise<ComparisonFile> {
  const runsDir = tempDir(t);
  const { registry } = watchedRegistry(engines);
  const { manifest } = await runSuite({ suite: pairSuite(), registry, runsDir, rungDefinitions: LADDER });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  return compareManifest({ manifest, store, policy, reference: "fake-a", ...more });
}

/** Every pair of a file as `run rung mode a b VERDICT`. */
function rows(file: ComparisonFile): string[] {
  return file.comparisons.flatMap((set) =>
    set.pairs.map((pair) => `${set.run} ${set.rung} ${set.mode} ${pair.a} ${pair.b} ${pair.verdict}`),
  );
}

test("a failed first rung blocks the later rungs for that pair of engines on that case, and for no other", async (t) => {
  const file = await compared(t, ladderPolicy(["first"]), { modes: ["reference-vs-each"] });
  assert.deepEqual(rows(file), [
    // The singlet: fake-odd built it wrong. Its later rungs are not judged; the other engines' are.
    "singlet first reference-vs-each fake-a fake-near PASS",
    "singlet first reference-vs-each fake-a fake-none UNSUPPORTED",
    "singlet first reference-vs-each fake-a fake-odd FAIL",
    "singlet second reference-vs-each fake-a fake-near PASS",
    "singlet second reference-vs-each fake-a fake-none UNSUPPORTED",
    "singlet second reference-vs-each fake-a fake-odd BLOCKED",
    "singlet third reference-vs-each fake-a fake-near PASS",
    "singlet third reference-vs-each fake-a fake-none UNSUPPORTED",
    "singlet third reference-vs-each fake-a fake-odd BLOCKED",
    // The Double-Gauss: the same engine agrees there, and nothing is blocked.
    "double-gauss first reference-vs-each fake-a fake-near PASS",
    "double-gauss first reference-vs-each fake-a fake-none UNSUPPORTED",
    "double-gauss first reference-vs-each fake-a fake-odd PASS",
    "double-gauss second reference-vs-each fake-a fake-near PASS",
    "double-gauss second reference-vs-each fake-a fake-none UNSUPPORTED",
    "double-gauss second reference-vs-each fake-a fake-odd PASS",
    "double-gauss third reference-vs-each fake-a fake-near PASS",
    "double-gauss third reference-vs-each fake-a fake-none UNSUPPORTED",
    "double-gauss third reference-vs-each fake-a fake-odd PASS",
  ]);
  const blocked = file.comparisons.flatMap((set) => set.pairs).filter((pair) => pair.verdict === "BLOCKED");
  assert.deepEqual(
    blocked.map((pair) => [pair.metrics.length, pair.reason]),
    Array(2).fill([0, "not judged: rung first failed for fake-a and fake-odd on this case"]),
  );
  for (const set of file.comparisons) {
    assert.deepEqual(validateKind("comparison", set), []);
    assert.deepEqual(comparisonInvariantProblems(set), []);
  }
  assert.equal(SINGLET.id !== DOUBLE_GAUSS.id, true);
});

test("blocking is per pair: two engines that agree with each other are judged, whatever a third one built", async (t) => {
  const file = await compared(t, ladderPolicy(["first"]), { modes: ["pairwise"] });
  const second = rows(file).filter((row) => row.startsWith("singlet second "));
  assert.deepEqual(second, [
    "singlet second pairwise fake-a fake-near PASS",
    "singlet second pairwise fake-a fake-none UNSUPPORTED",
    "singlet second pairwise fake-a fake-odd BLOCKED",
    "singlet second pairwise fake-near fake-none UNSUPPORTED",
    "singlet second pairwise fake-near fake-odd BLOCKED",
    "singlet second pairwise fake-none fake-odd UNSUPPORTED",
  ]);
});

test("a pair is blocked alike in both modes, and the sets of a mode do not depend on the modes asked for", async (t) => {
  const policy = ladderPolicy(["first"]);
  const both = await compared(t, policy);
  const verdictOf = (set: ComparisonSet, a: string, b: string): Verdict | undefined =>
    set.pairs.find((pair) => (pair.a === a && pair.b === b) || (pair.a === b && pair.b === a))?.verdict;
  for (const set of both.comparisons.filter((each) => each.mode === "reference-vs-each")) {
    const twin = both.comparisons.find(
      (each) => each.mode === "pairwise" && each.run === set.run && each.rung === set.rung,
    );
    assert.ok(twin !== undefined);
    for (const { a, b, verdict } of set.pairs) assert.equal(verdictOf(twin, a, b), verdict, `${set.run} ${set.rung}`);
  }
  for (const mode of ["reference-vs-each", "pairwise"] as const) {
    const alone = await compared(t, policy, { modes: [mode] });
    assert.deepEqual(
      alone.comparisons,
      both.comparisons.filter((set) => set.mode === mode),
      mode,
    );
  }
});

test("without the flag nothing is blocked, and a later rung that carries it blocks only what comes after it", async (t) => {
  const free = await compared(t, ladderPolicy([]), { modes: ["reference-vs-each"] });
  assert.ok(!rows(free).some((row) => row.endsWith("BLOCKED")));
  assert.equal(rows(free).filter((row) => row.endsWith("fake-odd FAIL")).length, 3);

  const later = await compared(t, ladderPolicy(["second"]), { modes: ["reference-vs-each"] });
  assert.deepEqual(
    rows(later).filter((row) => row.startsWith("singlet ") && row.includes("fake-odd")),
    [
      "singlet first reference-vs-each fake-a fake-odd FAIL",
      "singlet second reference-vs-each fake-a fake-odd FAIL",
      "singlet third reference-vs-each fake-a fake-odd BLOCKED",
    ],
  );
  const reason = later.comparisons.flatMap((set) => set.pairs).find((pair) => pair.verdict === "BLOCKED")?.reason;
  assert.equal(reason, "not judged: rung second failed for fake-a and fake-odd on this case");

  // Both carry it: the first rung is the one that blocks, also behind the second.
  const twice = await compared(t, ladderPolicy(["first", "second"]), { modes: ["reference-vs-each"] });
  const reasons = twice.comparisons.flatMap((set) => set.pairs).filter((pair) => pair.verdict === "BLOCKED");
  assert.deepEqual(
    reasons.map((pair) => pair.reason),
    Array(2).fill("not judged: rung first failed for fake-a and fake-odd on this case"),
  );
});

test("an ERROR in the blocking rung blocks too; an engine that gave no answer there is not blocked by that", async (t) => {
  // fake-flaky answers the singlet with its three elements as a [1, 3] array, which cannot be set against [3].
  const flaky: EngineMaker = async (id) => {
    const adapter = await fakeEngine()(id);
    return {
      id,
      describe: () => adapter.describe(),
      run: async (request, opticalCase) => {
        const result = await adapter.run(request, opticalCase);
        if (opticalCase.id !== SINGLET.id) return result;
        const { values, sum } = result.data as SelftestEchoData;
        return { ...result, data: { values: { $nd: { ...values.$nd, shape: [1, 3] } }, sum } };
      },
      close: () => adapter.close(),
    };
  };
  const engines = { "fake-a": fakeEngine(), "fake-flaky": flaky, "fake-none": ENGINES["fake-none"] };
  const file = await compared(t, ladderPolicy(["first"]), { modes: ["reference-vs-each"] }, engines);
  assert.deepEqual(
    rows(file).filter((row) => row.startsWith("singlet ")),
    [
      "singlet first reference-vs-each fake-a fake-flaky ERROR",
      "singlet first reference-vs-each fake-a fake-none UNSUPPORTED",
      "singlet second reference-vs-each fake-a fake-flaky BLOCKED",
      // UNSUPPORTED in the blocking rung blocks nothing, and is still what the engine says in the next.
      "singlet second reference-vs-each fake-a fake-none UNSUPPORTED",
      "singlet third reference-vs-each fake-a fake-flaky BLOCKED",
      "singlet third reference-vs-each fake-a fake-none UNSUPPORTED",
    ],
  );
});
