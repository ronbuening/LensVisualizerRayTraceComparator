// The consensus of a group: which engines compared pairwise on a gated rung are within the gates of each other, which
// are beyond the gates of all of them, and what a report of a run says of it. Every set here is written by hand.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import type { ComparisonSet, Verdict } from "../../src/contract/comparison.ts";
import type { Policy, RungPolicy } from "../../src/contract/policy.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { MAX_GROUP_ENGINES, consensusOf, standingOf } from "../../src/report/consensus.ts";
import type { GroupPairs } from "../../src/report/consensus.ts";
import { renderMarkdown } from "../../src/report/markdown.ts";
import { buildReport } from "../../src/report/model.ts";
import { consensusSentence, wordingProblems } from "../../src/report/wording.ts";

const GATED: RungPolicy = {
  quantity: "selftest.echo",
  mode: "direct",
  class: "gated",
  metrics: { "sum.abs": { tolerance: 1e-12, unit: "1" } },
};
const RECORDED: RungPolicy = { ...GATED, mode: "independent-method", class: "recorded", metrics: {} };

/** A group of the engines named, with the pairs given as `"a b VERDICT"`. */
function group(engines: string, pairs: readonly string[]): GroupPairs {
  return {
    participants: engines.split(" ").map((engine) => ({ engine })),
    pairs: pairs.map((text) => {
      const [a, b, verdict] = text.split(" ");
      return { a, b, verdict: verdict as Verdict };
    }),
  };
}

test("a verdict places a pair within, beyond or unjudged", () => {
  assert.deepEqual(
    (["PASS", "FLOOR", "FAIL", "RECORDED", "ATTENTION", "UNSUPPORTED", "BLOCKED", "ERROR"] as const).map(standingOf),
    ["within", "within", "beyond", "unjudged", "unjudged", "unjudged", "unjudged", "unjudged"],
  );
});

test("every engine within the gates of every other is the consensus", () => {
  assert.deepEqual(consensusOf(group("a b c", ["a b PASS", "a c PASS", "b c PASS"]), GATED), {
    consensus: ["a", "b", "c"],
    outliers: [],
    apart: [],
    notPlaced: [],
  });
});

test("an engine beyond the gates of every engine of the consensus is an outlier", () => {
  assert.deepEqual(consensusOf(group("a b c", ["a b PASS", "a c FAIL", "b c FAIL"]), GATED), {
    consensus: ["a", "b"],
    outliers: ["c"],
    apart: [],
    notPlaced: [],
  });
});

test("an engine with a pair the consensus has not judged is apart, and so is one within some of it", () => {
  // d is beyond a and b, but its pair with c is not judged: it is not beyond every engine of the consensus.
  const unjudged = ["a b PASS", "a c PASS", "b c PASS", "a d FAIL", "b d FAIL", "c d ERROR"];
  assert.deepEqual(consensusOf(group("a b c d", unjudged), GATED), {
    consensus: ["a", "b", "c"],
    outliers: [],
    apart: ["d"],
    notPlaced: [],
  });
  // d is within a and beyond b and c: with a it is a set of two, smaller than the consensus.
  const mixed = ["a b PASS", "a c PASS", "b c PASS", "a d PASS", "b d FAIL", "c d FAIL"];
  assert.deepEqual(consensusOf(group("a b c d", mixed), GATED)?.apart, ["d"]);
});

test("two largest sets are a split, and no consensus", () => {
  assert.deepEqual(consensusOf(group("a b c", ["a b PASS", "b c PASS", "a c FAIL"]), GATED), {
    consensus: null,
    reason: "split",
    outliers: [],
    apart: [],
    notPlaced: [],
  });
});

test("two largest sets that are each no more than half of the engines placed are a split, not a minority", () => {
  const pairs = ["a b PASS", "c d PASS", "a c FAIL", "a d FAIL", "b c FAIL", "b d FAIL"];
  assert.deepEqual(consensusOf(group("a b c d", pairs), GATED)?.reason, "split");
});

test("a pair the group does not state is not judged: an engine without it is apart, never an outlier", () => {
  // The pair of c and d is missing: d is beyond a and b, and of c nothing is known.
  const pairs = ["a b PASS", "a c PASS", "b c PASS", "a d FAIL", "b d FAIL"];
  assert.deepEqual(consensusOf(group("a b c d", pairs), GATED), {
    consensus: ["a", "b", "c"],
    outliers: [],
    apart: ["d"],
    notPlaced: [],
  });
  // An engine of no pair at all is not placed.
  assert.deepEqual(consensusOf(group("a b c d", ["a b PASS", "a c PASS", "b c PASS"]), GATED)?.notPlaced, ["d"]);
});

test("a largest set of no more than half of the engines placed is a minority", () => {
  // Four engines placed, the only largest set of two of them: not more than half.
  const pairs = ["a b PASS", "a c FAIL", "a d FAIL", "b c FAIL", "b d FAIL", "c d FAIL"];
  assert.deepEqual(consensusOf(group("a b c d", pairs), GATED), {
    consensus: null,
    reason: "minority",
    outliers: [],
    apart: [],
    notPlaced: [],
  });
  // The same with c not placed: three engines placed, and the set of two is more than half of them.
  const unplaced = ["a b PASS", "a c ERROR", "a d FAIL", "b c UNSUPPORTED", "b d FAIL", "c d BLOCKED"];
  assert.deepEqual(consensusOf(group("a b c d", unplaced), GATED), {
    consensus: ["a", "b"],
    outliers: ["d"],
    apart: [],
    notPlaced: ["c"],
  });
});

test("no two engines within the gates of each other is no consensus", () => {
  assert.deepEqual(consensusOf(group("a b c", ["a b FAIL", "a c FAIL", "b c FAIL"]), GATED), {
    consensus: null,
    reason: "no-pair-within",
    outliers: [],
    apart: [],
    notPlaced: [],
  });
  // Nothing judged at all: no engine is placed.
  assert.deepEqual(consensusOf(group("a b c", ["a b ERROR", "a c UNSUPPORTED", "b c BLOCKED"]), GATED), {
    consensus: null,
    reason: "no-pair-within",
    outliers: [],
    apart: [],
    notPlaced: ["a", "b", "c"],
  });
});

test("an engine without a pair judged is not placed, and the consensus is of the engines placed", () => {
  const pairs = ["a b PASS", "a c UNSUPPORTED", "b c UNSUPPORTED", "a d FAIL", "b d FAIL", "c d UNSUPPORTED"];
  assert.deepEqual(consensusOf(group("a b c d", pairs), GATED), {
    consensus: ["a", "b"],
    outliers: ["d"],
    apart: [],
    notPlaced: ["c"],
  });
});

test("FLOOR is within; BLOCKED, ERROR and UNSUPPORTED are not judged", () => {
  assert.deepEqual(consensusOf(group("a b c", ["a b FLOOR", "a c FAIL", "b c FAIL"]), GATED)?.consensus, ["a", "b"]);
  for (const verdict of ["BLOCKED", "ERROR", "UNSUPPORTED"]) {
    // Without the pair of a and c judged, c is apart: not beyond every engine of the consensus.
    const result = consensusOf(group("a b c", ["a b PASS", `a c ${verdict}`, "b c FAIL"]), GATED);
    assert.deepEqual(result, { consensus: ["a", "b"], outliers: [], apart: ["c"], notPlaced: [] }, verdict);
  }
});

test("a recorded rung, a rung without a policy and a group of two have no consensus to look for", () => {
  const three = group("a b c", ["a b PASS", "a c PASS", "b c PASS"]);
  assert.equal(consensusOf(three, RECORDED), null);
  assert.equal(consensusOf(three, null), null);
  assert.equal(consensusOf(group("a b", ["a b PASS"]), GATED), null);
});

test("the result does not depend on the order of the participants or of the pairs", () => {
  const engines = "a b c d e";
  const pairs = [
    "a b PASS",
    "a c PASS",
    "b c FLOOR",
    "a d FAIL",
    "b d FAIL",
    "c d FAIL",
    "a e ERROR",
    "b e FAIL",
    "c e FAIL",
    "d e PASS",
  ];
  const expected = { consensus: ["a", "b", "c"], outliers: ["d"], apart: ["e"], notPlaced: [] };
  assert.deepEqual(consensusOf(group(engines, pairs), GATED), expected);
  // A fixed pseudo-random shuffle of both lists, many times, and every pair with its engines swapped.
  let seed = 12345;
  const next = (): number => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  const shuffled = <T>(items: readonly T[]): T[] =>
    items
      .map((item) => ({ item, key: next() }))
      .sort((x, y) => x.key - y.key)
      .map(({ item }) => item);
  for (let round = 0; round < 50; round++) {
    const swapped = pairs.map((text) => (round % 2 === 0 ? text : text.replace(/^(\S+) (\S+)/, "$2 $1")));
    const result = consensusOf(group(shuffled(engines.split(" ")).join(" "), shuffled(swapped)), GATED);
    assert.deepEqual(result, expected, `round ${round}`);
  }
});

test("a group that cannot be read throws", () => {
  assert.throws(() => consensusOf(group("a a b", []), GATED), /a participant twice/);
  assert.throws(() => consensusOf(group("a b c", ["a x PASS"]), GATED), /not of two participants/);
  assert.throws(() => consensusOf(group("a b c", ["a a PASS"]), GATED), /not of two participants/);
  assert.throws(() => consensusOf(group("a b c", ["a b PASS", "b a FAIL"]), GATED), /there twice/);
  const many = Array.from({ length: MAX_GROUP_ENGINES + 1 }, (_unused, index) => `e${index}`).join(" ");
  assert.throws(() => consensusOf(group(many, []), GATED), /at most 16/);
  // Sixteen are looked at.
  const sixteen = Array.from({ length: MAX_GROUP_ENGINES }, (_unused, index) => `e${String(index).padStart(2, "0")}`);
  const allWithin = sixteen.flatMap((a, index) => sixteen.slice(index + 1).map((b) => `${a} ${b} PASS`));
  assert.deepEqual(consensusOf(group(sixteen.join(" "), allWithin), GATED)?.consensus, sixteen);
});

test("the sentence under a matrix names the consensus and its outliers, or why there is none, and no more", () => {
  const sentences = [
    consensusSentence({ consensus: ["a", "b"], outliers: ["c"], apart: ["d"], notPlaced: ["e"] }),
    consensusSentence({ consensus: null, reason: "split", outliers: [], apart: [], notPlaced: [] }),
    consensusSentence({ consensus: null, reason: "minority", outliers: [], apart: [], notPlaced: ["x", "y"] }),
    consensusSentence({ consensus: null, reason: "no-pair-within", outliers: [], apart: [], notPlaced: [] }),
  ];
  assert.equal(
    sentences[0],
    "Consensus: `a`, `b`, every two of them within the gates of each other; outlier: `c`, beyond the gates of every " +
      "engine of the consensus; apart: `d`, outside the consensus and not beyond the gates of all of it; not placed: " +
      "`e`, with no pair within or beyond the gates.",
  );
  assert.match(sentences[2], /^No consensus: the largest set .*; not placed: `x`, `y`, with no pair /);
  for (const sentence of sentences) assert.deepEqual(wordingProblems(sentence), [], sentence);
});

// ── In a report ──────────────────────────────────────────────────────────────────────────────────────────────────

const CASE = "c".repeat(64);
const POLICY: Policy = { contract: "1.0", kind: "policy", version: 1, rungs: { selftest: GATED } };

/** A manifest of the engines, available, each asked every request of the rung `selftest` of one run. */
function manifestOf(engines: readonly string[], requests: readonly string[]): RunManifest {
  return {
    contract: "1.0",
    kind: "run-manifest",
    suite: { name: "groups", hash: "5".repeat(64) },
    engines: engines.map((id) => ({ id, status: "available", version: "1", fingerprint: id, details: {} })),
    runs: [{ name: "only", caseId: CASE, problems: [] }],
    jobs: requests.flatMap((requestId) =>
      engines.map((engine) => ({
        run: "only",
        caseId: CASE,
        rung: "selftest",
        quantity: "selftest.echo",
        requestId,
        engine,
        status: "ok" as const,
        storeKey: "k".repeat(64),
      })),
    ),
  };
}

/** A pairwise set of one request, the pairs given as in `group`. */
function pairwiseSet(requestId: string, engines: string, pairs: readonly string[]): ComparisonSet {
  const { participants, pairs: stated } = group(engines, pairs);
  return {
    contract: "1.0",
    kind: "comparison",
    suite: "groups",
    run: "only",
    caseId: CASE,
    rung: "selftest",
    quantity: "selftest.echo",
    requestId,
    participants: participants.map(({ engine }) => ({ engine, fingerprint: engine, status: "ok" })),
    mode: "pairwise",
    pairs: stated.map(({ a, b, verdict }) => ({ a, b, metrics: [], class: "gated", verdict })),
  };
}

function fileOf(manifest: RunManifest, sets: readonly ComparisonSet[]): ComparisonFile {
  return {
    contract: "1.0",
    kind: "comparison-file",
    suite: "groups",
    manifest: hashCanonical(manifest),
    policy: hashCanonical(POLICY),
    comparisons: [...sets],
  };
}

test("a report counts, over its sections, where each engine of the run stands", () => {
  const [first, second, third] = ["1", "2", "3"].map((digit) => digit.repeat(64));
  const manifest = manifestOf(["a", "b", "c", "d"], [first, second, third]);
  const sets = [
    // a, b and c within each other, d beyond every one of them.
    pairwiseSet(first, "a b c d", ["a b PASS", "a c PASS", "b c PASS", "a d FAIL", "b d FAIL", "c d FAIL"]),
    // A split: a with b, b with c; d not placed.
    pairwiseSet(second, "a b c d", ["a b PASS", "a c FAIL", "b c PASS", "a d ERROR", "b d ERROR", "c d ERROR"]),
    // a, b and d within each other; c beyond a and d and not judged with b: apart.
    pairwiseSet(third, "a b c d", ["a b PASS", "a c FAIL", "b c BLOCKED", "a d PASS", "b d PASS", "c d FAIL"]),
  ];
  const model = buildReport(manifest, fileOf(manifest, sets), POLICY);
  assert.deepEqual(model.sections[1].consensus, {
    consensus: null,
    reason: "split",
    outliers: [],
    apart: [],
    notPlaced: ["d"],
  });
  assert.deepEqual(model.groups, {
    requests: 3,
    withConsensus: 2,
    withoutConsensus: { split: 1, "no-pair-within": 0, minority: 0 },
    engines: [
      { engine: "a", consensus: 2, outlier: 0, apart: 0, noConsensus: 1, notPlaced: 0 },
      { engine: "b", consensus: 2, outlier: 0, apart: 0, noConsensus: 1, notPlaced: 0 },
      { engine: "c", consensus: 1, outlier: 0, apart: 1, noConsensus: 1, notPlaced: 0 },
      { engine: "d", consensus: 1, outlier: 1, apart: 0, noConsensus: 0, notPlaced: 1 },
    ],
  });
  const markdown = renderMarkdown(model);
  assert.match(markdown, /\n## Verdict summary\n[^#]*\n## Consensus\n[^#]*\n## Support matrix\n/);
  assert.match(markdown, /^Of 3 requests with a consensus to look for, 2 have one\.$/m);
  assert.match(markdown, /^\| no consensus: split \| 1 \|$/m);
  assert.match(markdown, /^\| c \| 1 \| 0 \| 1 \| 1 \| 0 \|$/m);
  assert.match(
    markdown,
    /^Consensus: `a`, `b`, `c`, every two of them within the gates of each other; outlier: `d`, /m,
  );
  assert.match(markdown, /^No consensus: the engines within the gates of each other split into two or more /m);
  assert.deepEqual(wordingProblems(markdown), []);
});

test("a report of two engines, or of a recorded rung, has no consensus and its Markdown says nothing of one", () => {
  const request = "1".repeat(64);
  const pair = buildReport(
    manifestOf(["a", "b"], [request]),
    fileOf(manifestOf(["a", "b"], [request]), [pairwiseSet(request, "a b", ["a b PASS"])]),
    POLICY,
  );
  assert.equal(pair.sections[0].consensus, null);
  assert.equal(pair.groups, null);
  assert.doesNotMatch(renderMarkdown(pair), /onsensus/);

  const three = manifestOf(["a", "b", "c"], [request]);
  const recorded = { ...POLICY, rungs: { selftest: RECORDED } };
  const set = pairwiseSet(request, "a b c", ["a b RECORDED", "a c ATTENTION", "b c RECORDED"]);
  const model = buildReport(three, fileOf(three, [set]), recorded);
  assert.equal(model.sections[0].consensus, null);
  assert.equal(model.groups, null);
  assert.doesNotMatch(renderMarkdown(model), /onsensus/);
});

test("a report of a group larger than consensusOf looks at is still written, without a consensus", () => {
  const request = "1".repeat(64);
  const engines = Array.from(
    { length: MAX_GROUP_ENGINES + 1 },
    (_unused, index) => `e${String(index).padStart(2, "0")}`,
  );
  const pairs = engines.flatMap((a, index) => engines.slice(index + 1).map((b) => `${a} ${b} PASS`));
  const manifest = manifestOf(engines, [request]);
  const model = buildReport(manifest, fileOf(manifest, [pairwiseSet(request, engines.join(" "), pairs)]), POLICY);
  assert.equal(model.sections[0].pairwise?.engines.length, MAX_GROUP_ENGINES + 1);
  assert.equal(model.sections[0].consensus, null);
  assert.equal(model.groups, null);
  assert.doesNotMatch(renderMarkdown(model), /onsensus/);
});
