// The comparison of one run of a suite: every request of the manifest that engines were asked, grouped, with each
// engine's answer fetched from the store, and compared against a reference and pairwise.
import type { ComparisonMode, ComparisonSet } from "../contract/comparison.ts";
import { COMPARISON_MODES } from "../contract/comparison.ts";
import type { Policy } from "../contract/policy.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { jobDetail } from "../core/manifest.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { resultDataProblems } from "../core/resultData.ts";
import type { ResultStore } from "../core/resultStore.ts";
import { UsageError } from "../core/usageError.ts";
import { QUANTITIES } from "../quantities/index.ts";
import { createBlockingLedger } from "./blocking.ts";
import type { ComparatorLookup } from "./comparator.ts";
import type { ComparisonFile } from "./comparisonFile.ts";
import { compareGroup, defaultReference } from "./group.ts";
import { COMPARATORS } from "./index.ts";
import type { ParticipantResult } from "./pair.ts";

/** What `compareManifest` is given. */
export interface CompareManifestInput {
  readonly manifest: RunManifest;
  /** The store the manifest's `storeKey`s are keys of. It is only read. */
  readonly store: ResultStore;
  readonly policy: Policy;
  /** The engine every other is compared against, for every run; without it each run's own, else the default. */
  readonly reference?: string;
  /** The modes to compare in; both unless given. The sets of a request follow the order of `COMPARISON_MODES`. */
  readonly modes?: readonly ComparisonMode[];
  /** The comparators there are; `COMPARATORS` unless given. */
  readonly comparators?: ComparatorLookup;
}

/** One job as a participant: an "ok" job with the data the store holds for it, or "missing" when it holds none. */
function participantOf(job: ManifestJob, fingerprint: string | null, store: ResultStore): ParticipantResult {
  const { engine, status } = job;
  if (status !== "ok") {
    const detail = jobDetail(job);
    return { engine, fingerprint, status, ...(detail === undefined ? {} : { detail }) };
  }
  const missing = (detail: string): ParticipantResult => ({ engine, fingerprint, status: "missing", detail });
  if (job.storeKey === null) return missing("its result was not stored");
  const found = store.get(job.storeKey);
  if (found.kind !== "hit") return missing("its result is not in the store");
  const { request, result } = found.entry;
  if (request.id !== job.requestId || result.status !== "ok" || result.data === undefined) {
    return missing("the store holds another result under its key");
  }
  const quantity = QUANTITIES.get(job.quantity);
  if (quantity === undefined || resultDataProblems(quantity, result.data).length > 0) {
    return missing("its stored data cannot be used");
  }
  return { engine, fingerprint, status: "ok", data: result.data };
}

/**
 * Compares everything one run of a suite asked of more than nobody, and returns the comparison file.
 *
 * The jobs of the manifest are grouped by run, rung and request: a group is what several engines were asked alike.
 * Each engine with a job in the group is a participant. One whose job ended "ok" takes its data from the store; if
 * the store no longer holds it, or holds something that is not valid data of the quantity, the participant is
 * "missing", which makes its pairs `ERROR`. The store is never written.
 *
 * The reference of a group is `reference` when given, else the run's own `referenceEngine`, else
 * `defaultReference`: the first engine in id order that has an "ok" result. A reference that has no job in a group
 * is added to it as a "missing" participant, so that what was asked for is shown as not there.
 *
 * Each group gives one set per mode (`compareGroup`). The sets are ordered by run as the suite orders them, then
 * by rung and request as the manifest's jobs do, then by mode. A run without a case has no jobs and no sets. Equal
 * manifests, store entries and policies give an equal file, in any directory and on any machine.
 *
 * The groups of a run are compared in the order of the manifest's jobs, which is the order of the ladder. Where
 * the policy of a rung says `blocksLaterRungs`, two engines whose pair in that rung is `FAIL` or `ERROR` are not
 * judged against each other in the rungs after it, in that run: their pairs there are `BLOCKED`, in every mode,
 * and say which rung blocked them (`createBlockingLedger`).
 *
 * Throws a `UsageError` when `reference` is not an engine of the manifest, and when the manifest names a rung the
 * policy has no entry for, or one whose entry is for another quantity: such a run cannot be judged.
 */
export function compareManifest(input: CompareManifestInput): ComparisonFile {
  const { manifest, store, policy, reference, modes = COMPARISON_MODES, comparators = COMPARATORS } = input;
  const engineIds = manifest.engines.map((engine) => engine.id);
  if (reference !== undefined && !engineIds.includes(reference)) {
    const ran = engineIds.length === 0 ? "no engine" : engineIds.join(", ");
    throw new UsageError(`unknown engine "${reference}": the run has ${ran}`);
  }
  const fingerprints = new Map(
    manifest.engines.map((engine) => [engine.id, engine.status === "available" ? engine.fingerprint : null]),
  );

  // A Map keeps its keys in the order they were first set: the order of the manifest's jobs.
  const groups = new Map<string, ManifestJob[]>();
  for (const job of manifest.jobs) {
    const key = JSON.stringify([job.run, job.rung, job.requestId]);
    groups.set(key, [...(groups.get(key) ?? []), job]);
  }

  const comparisons: ComparisonSet[] = [];
  for (const run of manifest.runs) {
    const ledger = createBlockingLedger();
    for (const jobs of groups.values()) {
      const [{ run: runName, caseId, rung, quantity, requestId }] = jobs;
      if (runName !== run.name) continue;
      if (!Object.hasOwn(policy.rungs, rung)) throw new UsageError(`the policy has no entry for the rung ${rung}`);
      const rungPolicy = policy.rungs[rung];
      if (rungPolicy.quantity !== quantity) {
        throw new UsageError(`rung ${rung}: the run asked for ${quantity}; the policy judges ${rungPolicy.quantity}`);
      }

      const participants = jobs.map((job) => participantOf(job, fingerprints.get(job.engine) ?? null, store));
      const against = reference ?? run.referenceEngine ?? defaultReference(participants);
      if (against !== undefined && !participants.some((participant) => participant.engine === against)) {
        const fingerprint = fingerprints.get(against) ?? null;
        participants.push({ engine: against, fingerprint, status: "missing", detail: "it has no job in this run" });
      }
      const group = {
        suite: manifest.suite.name,
        run: runName,
        caseId,
        rung,
        quantity,
        requestId,
        participants,
        policy: rungPolicy,
        comparator: comparators.get(quantity),
        blocked: ledger.blockedIn(rung),
      };
      const sets = COMPARISON_MODES.filter((mode) => modes.includes(mode)).map((mode) =>
        compareGroup(group, mode, against),
      );
      // Only now: the modes of one group judge a pair alike, so neither may see what the other found.
      for (const set of sets) ledger.note(set, rungPolicy);
      comparisons.push(...sets);
    }
  }
  return {
    contract: CONTRACT_VERSION,
    kind: "comparison-file",
    suite: manifest.suite.name,
    manifest: hashCanonical(manifest),
    policy: hashCanonical(policy),
    comparisons,
  };
}
