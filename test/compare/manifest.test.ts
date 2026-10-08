// The comparison of a whole run: groups from the manifest, answers from the store, references and ordering.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { COMPARISONS_FILE, comparisonFileText, readComparisonFile } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { RunOptions } from "../../src/contract/runSpec.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { ResultStore } from "../../src/core/resultStore.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { selftestRung } from "../../src/core/rungs.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { COMPARISON_PAIRWISE, COMPARISON_REFERENCE } from "../contract/corpus.ts";
import {
  DOUBLE_GAUSS,
  SINGLET,
  answeringEngine,
  fakeEngine,
  pairSuite,
  suiteOf,
  tempDir,
  watchedRegistry,
} from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";

const POLICY = loadPolicy();

const ENGINES: Readonly<Record<string, EngineMaker>> = {
  "fake-a": fakeEngine(),
  "fake-b": fakeEngine({ bias: 0.001 }),
  "fake-near": fakeEngine({ bias: 2e-14 }),
  "fake-none": fakeEngine({ offersQuantities: false }),
};

/** Runs the pair suite on the given engines and returns what a comparison reads. */
async function ran(
  t: TestContext,
  engines: Readonly<Record<string, EngineMaker>> = ENGINES,
  options: RunOptions = {},
  more: { rungDefinitions?: readonly RungDefinition[] } = {},
): Promise<{ manifest: RunManifest; store: ResultStore; runsDir: string }> {
  const runsDir = tempDir(t);
  const { registry } = watchedRegistry(engines);
  const { manifest } = await runSuite({ suite: pairSuite(options), registry, runsDir, ...more });
  return { manifest, store: createResultStore(join(runsDir, STORE_DIRECTORY)), runsDir };
}

function rows(file: ComparisonFile): string[] {
  return file.comparisons.flatMap((set) =>
    set.pairs.map((pair) => `${set.run} ${set.mode} ${pair.a} ${pair.b} ${pair.verdict}`),
  );
}

test("a run is compared against its reference and pairwise, ordered by run, rung, mode and pair", async (t) => {
  const { manifest, store } = await ran(t);
  const file = compareManifest({ manifest, store, policy: POLICY });
  const singlet = [
    "singlet reference-vs-each fake-a fake-b FAIL",
    "singlet reference-vs-each fake-a fake-near PASS",
    "singlet reference-vs-each fake-a fake-none UNSUPPORTED",
    "singlet pairwise fake-a fake-b FAIL",
    "singlet pairwise fake-a fake-near PASS",
    "singlet pairwise fake-a fake-none UNSUPPORTED",
    "singlet pairwise fake-b fake-near FAIL",
    "singlet pairwise fake-b fake-none UNSUPPORTED",
    "singlet pairwise fake-near fake-none UNSUPPORTED",
  ];
  assert.deepEqual(rows(file), [...singlet, ...singlet.map((row) => row.replace("singlet", "double-gauss"))]);
  assert.deepEqual(
    { contract: file.contract, kind: file.kind, suite: file.suite, manifest: file.manifest, policy: file.policy },
    {
      contract: "1.0",
      kind: "comparison-file",
      suite: "pair",
      manifest: hashCanonical(manifest),
      policy: hashCanonical(POLICY),
    },
  );
  for (const set of file.comparisons) {
    assert.deepEqual(validateKind("comparison", set), []);
    assert.deepEqual(comparisonInvariantProblems(set), []);
    assert.equal(set.suite, "pair");
    assert.equal(set.rung, "selftest");
    assert.equal(set.quantity, SELFTEST_ECHO);
    assert.equal(set.caseId, set.run === "singlet" ? SINGLET.id : DOUBLE_GAUSS.id);
    assert.equal(set.participants.length, 4);
  }
  const [against] = file.comparisons;
  assert.equal(against.requestId, selftestRung.buildRequests(SINGLET, pairSuite().runs[0].spec)[0].id);
  assert.deepEqual(against.participants[3], {
    engine: "fake-none",
    fingerprint: manifest.engines.flatMap((engine) =>
      engine.id === "fake-none" && engine.status === "available" ? [engine.fingerprint] : [],
    )[0],
    status: "unsupported",
  });
  assert.equal(against.pairs[2].reason, "fake-none is unsupported (quantity selftest.echo)");
  // The small bias is a difference, and inside the tolerance.
  const [, near] = against.pairs;
  assert.ok((near.metrics[0].value as number) > 0 && (near.metrics[0].value as number) < 1e-12);
});

test("the reference is --reference, else the run's own, else the first engine with an ok result", async (t) => {
  const referenceOf = (file: ComparisonFile): (string | undefined)[] =>
    file.comparisons.filter((set) => set.mode === "reference-vs-each").map((set) => set.reference);

  const plain = await ran(t, { "fake-0": fakeEngine({ offersQuantities: false }), ...ENGINES });
  assert.deepEqual(referenceOf(compareManifest({ ...plain, policy: POLICY })), ["fake-a", "fake-a"]);
  assert.deepEqual(referenceOf(compareManifest({ ...plain, policy: POLICY, reference: "fake-none" })), [
    "fake-none",
    "fake-none",
  ]);

  const stated = await ran(t, ENGINES, { referenceEngine: "fake-b" });
  assert.deepEqual(
    stated.manifest.runs.map((run) => run.referenceEngine),
    ["fake-b", "fake-b"],
  );
  const file = compareManifest({ ...stated, policy: POLICY });
  assert.deepEqual(referenceOf(file), ["fake-b", "fake-b"]);
  assert.deepEqual(rows(file).slice(0, 3), [
    "singlet reference-vs-each fake-b fake-a FAIL",
    "singlet reference-vs-each fake-b fake-near FAIL",
    "singlet reference-vs-each fake-b fake-none UNSUPPORTED",
  ]);
  assert.deepEqual(referenceOf(compareManifest({ ...stated, policy: POLICY, reference: "fake-a" })), [
    "fake-a",
    "fake-a",
  ]);

  // Nobody has an ok result: the first engine of all.
  const none = await ran(t, { x: fakeEngine({ offersQuantities: false }), y: fakeEngine({ offersQuantities: false }) });
  assert.deepEqual(referenceOf(compareManifest({ ...none, policy: POLICY })), ["x", "x"]);
});

test("a reference that is not an engine of the run is a usage error", async (t) => {
  const { manifest, store } = await ran(t);
  assert.throws(
    () => compareManifest({ manifest, store, policy: POLICY, reference: "optiland" }),
    (error: unknown) => {
      assert.ok(error instanceof UsageError);
      assert.equal(error.message, 'unknown engine "optiland": the run has fake-a, fake-b, fake-near, fake-none');
      return true;
    },
  );
});

test("a reference that has no job in a run is a missing participant, and its pairs are ERROR", async (t) => {
  const runsDir = tempDir(t);
  const { registry } = watchedRegistry(ENGINES);
  const suite = suiteOf("pair", [
    { name: "one", opticalCase: SINGLET, engines: ["fake-b", "fake-near"], referenceEngine: "fake-a" },
    { name: "two", opticalCase: DOUBLE_GAUSS, engines: ["fake-a", "fake-b"], referenceEngine: "fake-a" },
  ]);
  const { manifest } = await runSuite({ suite, registry, runsDir });
  const file = compareManifest({ manifest, store: createResultStore(join(runsDir, STORE_DIRECTORY)), policy: POLICY });
  assert.deepEqual(rows(file), [
    "one reference-vs-each fake-a fake-b ERROR",
    "one reference-vs-each fake-a fake-near ERROR",
    "one pairwise fake-a fake-b ERROR",
    "one pairwise fake-a fake-near ERROR",
    "one pairwise fake-b fake-near FAIL",
    "two reference-vs-each fake-a fake-b FAIL",
    "two pairwise fake-a fake-b FAIL",
  ]);
  const [first] = file.comparisons;
  // The engine ran in the suite, so its fingerprint is known; it has no result in this run.
  assert.equal(first.participants[0].engine, "fake-a");
  assert.equal(first.participants[0].status, "missing");
  assert.equal(typeof first.participants[0].fingerprint, "string");
  assert.equal(first.pairs[0].reason, "fake-a has no result (it has no job in this run)");
  for (const set of file.comparisons) assert.deepEqual(comparisonInvariantProblems(set), []);
});

test("an answer the store no longer holds, or holds spoiled, is a missing participant", async (t) => {
  const { manifest, store, runsDir } = await ran(t, { "fake-a": ENGINES["fake-a"], "fake-near": ENGINES["fake-near"] });
  const [first, second] = manifest.jobs.filter((job) => job.engine === "fake-near");
  rmSync(join(runsDir, STORE_DIRECTORY, `${first.storeKey}.json`));
  writeFileSync(join(runsDir, STORE_DIRECTORY, `${second.storeKey}.json`), "{ cut short");
  const before = readdirSync(join(runsDir, STORE_DIRECTORY)).sort();

  const file = compareManifest({ manifest, store, policy: POLICY });
  assert.deepEqual(rows(file), [
    "singlet reference-vs-each fake-a fake-near ERROR",
    "singlet pairwise fake-a fake-near ERROR",
    "double-gauss reference-vs-each fake-a fake-near ERROR",
    "double-gauss pairwise fake-a fake-near ERROR",
  ]);
  for (const set of file.comparisons) {
    assert.deepEqual(set.participants[1], {
      engine: "fake-near",
      fingerprint: set.participants[1].fingerprint,
      status: "missing",
    });
    assert.equal(set.pairs[0].reason, "fake-near has no result (its result is not in the store)");
  }
  // Comparing reads the store and writes nothing to it.
  assert.deepEqual(readdirSync(join(runsDir, STORE_DIRECTORY)).sort(), before);
});

test("an answer whose stored data is not the quantity's, or that the store holds as another result, is missing", async (t) => {
  const { manifest, store, runsDir } = await ran(t, { "fake-a": ENGINES["fake-a"], "fake-near": ENGINES["fake-near"] });
  const [first, second] = manifest.jobs.filter((job) => job.engine === "fake-near");
  assert.ok(first.storeKey !== null && second.storeKey !== null);

  // Still a valid result under its own key, so the store has it; its data is no longer `selftest.echo` data.
  const file = join(runsDir, STORE_DIRECTORY, `${first.storeKey}.json`);
  const entry = JSON.parse(readFileSync(file, "utf8"));
  entry.result.data.sum = "about seven";
  writeFileSync(file, JSON.stringify(entry));
  assert.equal(store.get(first.storeKey).kind, "hit");

  // The same request to the same engine, answered "unsupported" since: the key of the manifest's "ok" job.
  const found = store.get(second.storeKey);
  assert.ok(found.kind === "hit");
  const { request, result } = found.entry;
  const refusal = makeResult(request, result.engine, {
    status: "unsupported",
    unsupported: [{ code: "quantity", item: SELFTEST_ECHO, message: "no longer offered" }],
  });
  assert.equal(store.put(request, refusal), second.storeKey);

  const compared = compareManifest({ manifest, store, policy: POLICY, modes: ["reference-vs-each"] });
  assert.deepEqual(
    compared.comparisons.map((set) => [set.participants[1].status, set.pairs[0].verdict, set.pairs[0].reason]),
    [
      ["missing", "ERROR", "fake-near has no result (its stored data cannot be used)"],
      ["missing", "ERROR", "fake-near has no result (the store holds another result under its key)"],
    ],
  );
});

test("engines that failed or could not be used are participants whose pairs are ERROR, with the code", async (t) => {
  const failing = answeringEngine(() => ({
    status: "error",
    error: { code: "engine-failure", message: "/abs/path: boom" },
  }));
  const waiting = answeringEngine(() => ({ status: "pending" }));
  const { manifest, store } = await ran(t, { "fake-a": ENGINES["fake-a"], broken: failing, bench: waiting });
  const file = compareManifest({ manifest, store, policy: POLICY, modes: ["reference-vs-each"] });
  const [singlet] = file.comparisons;
  assert.equal(singlet.reference, "fake-a");
  assert.deepEqual(
    singlet.pairs.map((pair) => [pair.b, pair.verdict, pair.reason]),
    [
      ["bench", "ERROR", "bench is pending"],
      ["broken", "ERROR", "broken ended as error (engine-failure)"],
    ],
  );
  // Only codes are stored: what the engine said, which may name a file, is not.
  assert.ok(!comparisonFileText(file).includes("boom"));
});

test("--mode chooses the sets; the sets of a mode are the same whichever modes are asked for", async (t) => {
  const { manifest, store } = await ran(t);
  const both = compareManifest({ manifest, store, policy: POLICY });
  for (const mode of ["reference-vs-each", "pairwise"] as const) {
    const one = compareManifest({ manifest, store, policy: POLICY, modes: [mode] });
    assert.deepEqual(
      one.comparisons,
      both.comparisons.filter((set) => set.mode === mode),
    );
    assert.equal(one.comparisons.length, 2);
  }
  // The order of the modes asked for does not change the order of the sets.
  const reversed = compareManifest({ manifest, store, policy: POLICY, modes: ["pairwise", "reference-vs-each"] });
  assert.equal(canonicalJson(reversed), canonicalJson(both));
});

test("every request of a rung is a group of its own, in the order the rung builds them", async (t) => {
  const twice: RungDefinition = {
    id: "selftest",
    quantity: SELFTEST_ECHO,
    buildRequests: (opticalCase) =>
      [2, 3].map((scale) =>
        makeRequest({
          caseId: opticalCase.id,
          quantity: SELFTEST_ECHO,
          spec: { values: encodeNdArray(Float64Array.of(1, 2)), scale },
        }),
      ),
  };
  const two = { "fake-a": ENGINES["fake-a"], "fake-b": ENGINES["fake-b"] };
  const { manifest, store } = await ran(t, two, {}, { rungDefinitions: [twice] });
  const file = compareManifest({ manifest, store, policy: POLICY, modes: ["pairwise"] });
  const expected = [SINGLET, DOUBLE_GAUSS].flatMap((opticalCase) =>
    twice.buildRequests(opticalCase, pairSuite().runs[0].spec).map((request) => request.id),
  );
  assert.deepEqual(
    file.comparisons.map((set) => set.requestId),
    expected,
  );
  assert.equal(new Set(expected).size, 4);
});

test("a run that was not started has no comparisons, and a manifest without jobs gives an empty file", async (t) => {
  const runsDir = tempDir(t);
  const { registry } = watchedRegistry(ENGINES);
  const suite = suiteOf("pair", [{ name: "missing", opticalCase: null, problems: ["no case"] }]);
  const { manifest } = await runSuite({ suite, registry, runsDir });
  const file = compareManifest({ manifest, store: createResultStore(join(runsDir, STORE_DIRECTORY)), policy: POLICY });
  assert.deepEqual(file.comparisons, []);
});

test("a rung the policy does not judge, or judges as another quantity, is a usage error", async (t) => {
  const { manifest, store } = await ran(t);
  const empty: Policy = { ...POLICY, rungs: {} };
  assert.throws(() => compareManifest({ manifest, store, policy: empty }), {
    name: "UsageError",
    message: "the policy has no entry for the rung selftest",
  });
  const other: Policy = { ...POLICY, rungs: { selftest: { ...POLICY.rungs.selftest, quantity: "rays.trace" } } };
  assert.throws(() => compareManifest({ manifest, store, policy: other }), {
    name: "UsageError",
    message: "rung selftest: the run asked for selftest.echo; the policy judges rays.trace",
  });
});

test("equal runs in different directories give byte-equal comparison files, which read back as written", async (t) => {
  const one = await ran(t);
  const two = await ran(t);
  const text = comparisonFileText(compareManifest({ ...one, policy: POLICY }));
  assert.equal(comparisonFileText(compareManifest({ ...two, policy: POLICY })), text);
  assert.ok(text.endsWith("}\n") && !text.includes(one.runsDir) && !text.includes(two.runsDir));

  const directory = tempDir(t);
  writeFileSync(join(directory, COMPARISONS_FILE), text);
  assert.equal(comparisonFileText(readComparisonFile(directory)), text);
  assert.equal(readFileSync(join(directory, COMPARISONS_FILE), "utf8"), text);
});

test("a comparison file that is absent, malformed or not one is a usage error", (t) => {
  const directory = tempDir(t);
  const refused = (text: string | null, message: RegExp): void => {
    if (text !== null) writeFileSync(join(directory, COMPARISONS_FILE), text);
    assert.throws(
      () => readComparisonFile(directory),
      (error: unknown) => {
        assert.ok(error instanceof UsageError);
        assert.match(error.message, message);
        return true;
      },
    );
  };
  const good: ComparisonFile = {
    contract: "1.0",
    kind: "comparison-file",
    suite: "s",
    manifest: "m",
    policy: "p",
    comparisons: [],
  };
  refused(null, /no comparisons\.json is there; run lvrtc compare first$/);
  refused("{ cut", /malformed JSON$/);
  refused("[]", /not a comparison file: its kind is not "comparison-file"$/);
  refused(JSON.stringify({ ...good, contract: "2.0" }), /its contract version cannot be read by this code$/);
  refused(JSON.stringify({ ...good, manifest: 1 }), /its manifest is not a string$/);
  refused(JSON.stringify({ ...good, comparisons: {} }), /its comparisons are not a list$/);
  refused(JSON.stringify({ ...good, comparisons: [{ kind: "comparison" }] }), /comparison 0 is not valid: /);
  // Valid by its schema, and against a rule of a set: its reference is not one of its participants.
  const unreferenced = { ...COMPARISON_REFERENCE, reference: "lv", pairs: [] };
  assert.deepEqual(validateKind("comparison", unreferenced), []);
  refused(
    JSON.stringify({ ...good, comparisons: [COMPARISON_PAIRWISE, unreferenced] }),
    /not a comparison file: comparison 1: reference lv is not a participant$/,
  );
  writeFileSync(join(directory, COMPARISONS_FILE), JSON.stringify({ ...good, comparisons: [COMPARISON_PAIRWISE] }));
  assert.deepEqual(readComparisonFile(directory).comparisons, [COMPARISON_PAIRWISE]);
  writeFileSync(join(directory, COMPARISONS_FILE), JSON.stringify(good));
  assert.deepEqual(readComparisonFile(directory), good);
});
