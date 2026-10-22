// The follow-ups of a run: a second question to one engine of a rung, asked only where the first answers call for
// it. On fake engines that know no optics; the one follow-up of the ladder is tested with rung R5
// (test/report/r5.test.ts).
import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";

import { createComparatorLookup } from "../../src/compare/comparator.ts";
import type { ComparisonContext, QuantityComparator } from "../../src/compare/comparator.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { comparePair, stepAnswers } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { selftestEchoComparator } from "../../src/compare/selftestEcho.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import { manifestProblems } from "../../src/core/manifest.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import type { FollowUp } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import { selftestRung } from "../../src/core/rungs.ts";
import { echoData } from "../compare/support.ts";
import { POLICY_SELFTEST } from "../contract/corpus.ts";
import { SINGLET, fakeEngine, suiteOf, tempDir, watchedRegistry } from "./support.ts";
import type { RunOf } from "./support.ts";

const rungDefinitions = [selftestRung];

/** A follow-up of `selftest` that asks `fake-b` again with `{ finer: true }`, and what it was asked to decide. */
function watchedFollowUp(needed: boolean, more: Partial<FollowUp> = {}) {
  const decided: { engines: string[]; spec: JsonObject; caseId: string; recipe: unknown }[] = [];
  const followUp: FollowUp = {
    rung: "selftest",
    engine: "fake-b",
    step: "finer",
    options: { finer: true },
    needed: (answers, context) => {
      decided.push({
        engines: [...answers.keys()],
        spec: context.spec,
        caseId: context.opticalCase.id,
        recipe: context.recipe,
      });
      return needed;
    },
    ...more,
  };
  return { followUp, decided };
}

async function ran(t: Parameters<typeof tempDir>[0], followUps: readonly FollowUp[], run: Partial<RunOf> = {}) {
  const runsDir = tempDir(t);
  const watched = watchedRegistry({
    "fake-a": fakeEngine(),
    "fake-b": fakeEngine({ bias: 0.5 }),
    "fake-none": fakeEngine({ offersQuantities: false }),
  });
  const suite = suiteOf("follow", [{ name: "singlet", opticalCase: SINGLET, ...run }]);
  const result = await runSuite({ suite, registry: watched.registry, runsDir, rungDefinitions, followUps });
  const rows = result.manifest.jobs.map(
    (job) => `${job.engine}${job.step === undefined ? "" : ` +${job.step}`} ${job.status}`,
  );
  return { ...result, watched, rows, runsDir };
}

test("a follow-up that is needed is one more job of its engine, after the rung's others, with its options laid over", async (t) => {
  const { followUp, decided } = watchedFollowUp(true);
  const sampling = { engines: { "fake-b": { rays: 64, finer: false } } };
  const { rows, manifest, watched } = await ran(t, [followUp], { sampling });
  assert.deepEqual(rows, ["fake-a ok", "fake-b ok", "fake-none unsupported", "fake-b +finer ok"]);
  // It was decided once, from the answers of the engines that answered, with what they are answers to.
  assert.equal(decided.length, 1);
  assert.deepEqual(decided[0].engines, ["fake-a", "fake-b"]);
  assert.deepEqual([decided[0].caseId, decided[0].recipe], [SINGLET.id, null]);
  assert.deepEqual(decided[0].spec, watched.requests[0].spec);
  // The same request, with the follow-up's options over the run's own for the engine; another store entry.
  assert.deepEqual(watched.ran, ["fake-a", "fake-b", "fake-b"]);
  assert.deepEqual(watched.requests[2].engineOptions, { rays: 64, finer: true });
  const [, first, , again] = manifest.jobs;
  assert.equal(again.requestId, first.requestId);
  assert.notEqual(again.storeKey, first.storeKey);
  assert.deepEqual(manifestProblems(manifest), []);
  assert.deepEqual(manifestProblems({ ...manifest, jobs: [{ ...again, step: 2 }] }), [
    "/jobs/0/step: expected a string",
  ]);
});

test("nothing is asked again where it is not needed, changes nothing, or has no first answer to follow", async (t) => {
  const notNeeded = watchedFollowUp(false);
  assert.equal((await ran(t, [notNeeded.followUp])).rows.length, 3);
  assert.equal(notNeeded.decided.length, 1);

  // The run already asks with the follow-up's options: there is no second question, and nothing is decided.
  const same = watchedFollowUp(true);
  const sampling = { engines: { "fake-b": { finer: true } } };
  assert.equal((await ran(t, [same.followUp], { sampling })).rows.length, 3);
  assert.equal(same.decided.length, 0);

  // An engine that did not answer is not asked again; a follow-up of another rung, or engine, follows nothing.
  const unanswered = watchedFollowUp(true, { engine: "fake-none" });
  assert.equal((await ran(t, [unanswered.followUp])).rows.length, 3);
  assert.equal(unanswered.decided.length, 0);
  const elsewhere = watchedFollowUp(true, { rung: "r5" });
  assert.equal((await ran(t, [elsewhere.followUp])).rows.length, 3);
  const nobody = watchedFollowUp(true, { engine: "fake-z" });
  assert.equal((await ran(t, [nobody.followUp])).rows.length, 3);
  assert.equal((await ran(t, [])).rows.length, 3);
});

test("a step is its engine's later answer in a comparison: no participant of its own, handed over with the policy", async (t) => {
  const { manifest, runsDir } = await ran(t, [watchedFollowUp(true).followUp]);
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const seen: ComparisonContext[] = [];
  const watching: QuantityComparator = {
    ...selftestEchoComparator,
    compare: (a, b, context) => {
      if (context !== undefined) seen.push(context);
      return selftestEchoComparator.compare(a, b, context);
    },
    recorded: () => ({ one: [1] }),
  };
  const file = compareManifest({
    manifest,
    store,
    policy: POLICY_SELFTEST,
    comparators: createComparatorLookup([watching]),
    rungDefinitions,
    modes: ["pairwise"],
  });
  const [set] = file.comparisons;
  assert.deepEqual(
    set.participants.map((participant) => participant.engine),
    ["fake-a", "fake-b", "fake-none"],
  );
  assert.deepEqual(
    set.pairs.map((pair) => `${pair.a} ${pair.b}`),
    ["fake-a fake-b", "fake-a fake-none", "fake-b fake-none"],
  );
  // The one pair that is compared is handed the step of its second engine, and the policy of the rung.
  assert.equal(seen.length, 1);
  assert.equal(seen[0].policy, POLICY_SELFTEST.rungs.selftest);
  assert.deepEqual(
    seen[0].steps?.map((steps) => steps.map((answer) => answer.step)),
    [[], ["finer"]],
  );
  // What the step records stands beside what the first answer records, under the step's name.
  assert.deepEqual(set.participants[1].recorded, { one: [1], "one#finer": [1] });
  assert.deepEqual(set.participants[0].recorded, { one: [1] });
});

test("a step that is no answer is handed to no comparator and is named in the pair's reason", () => {
  const data = echoData(Float64Array.of(1));
  const a: ParticipantResult = { engine: "fake-a", fingerprint: "a", status: "ok", data };
  const b: ParticipantResult = {
    engine: "fake-b",
    fingerprint: "b",
    status: "ok",
    data,
    steps: [
      { step: "finer", status: "error", detail: "time-budget" },
      { step: "finest", status: "unsupported", detail: "option fftRays" },
      { step: "last", status: "ok", data },
    ],
  };
  assert.deepEqual(stepAnswers(b), [{ step: "last", data }]);
  assert.deepEqual(stepAnswers(a), []);
  const pair = comparePair(a, b, POLICY_SELFTEST.rungs.selftest, selftestEchoComparator);
  assert.equal(pair.verdict, "PASS");
  assert.equal(
    pair.reason,
    "the step finer of fake-b ended as error (time-budget); the step finest of fake-b is unsupported (option fftRays)",
  );
});
