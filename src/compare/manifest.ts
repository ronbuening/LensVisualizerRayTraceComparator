// The comparison of one run of a suite: every request of the manifest that engines were asked, grouped, with each
// engine's answer fetched from the store, and compared against a reference and pairwise.
import type { OpticalCase } from "../contract/case.ts";
import type { ComparisonMode, ComparisonSet } from "../contract/comparison.ts";
import { COMPARISON_MODES } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import type { Policy } from "../contract/policy.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { jobDetail } from "../core/manifest.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { resultDataProblems } from "../core/resultData.ts";
import { RUNGS } from "../core/rungs.ts";
import type { RungDefinition } from "../core/rungs.ts";
import type { ResultStore } from "../core/resultStore.ts";
import { UsageError } from "../core/usageError.ts";
import { QUANTITIES } from "../quantities/index.ts";
import { createBlockingLedger } from "./blocking.ts";
import type { ComparatorLookup } from "./comparator.ts";
import type { ComparisonFile } from "./comparisonFile.ts";
import { compareGroup, defaultReference } from "./group.ts";
import { COMPARATORS } from "./index.ts";
import type { ParticipantResult } from "./pair.ts";
import type { SpanMember } from "./span.ts";

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
  /**
   * The case of a run, by its id, for the comparators that read it (the clip radii of a rim band, the wavelength of
   * a line, an image plane): `readRunCase` on the run directory. Without it, or where it gives none, the pairs of
   * such a comparator are `ERROR`, with the comparator's reason.
   */
  readonly cases?: (caseId: string) => OpticalCase | undefined;
  /** The rungs there are; `RUNGS` unless given. Read for which rungs are about engines of their own. */
  readonly rungDefinitions?: readonly RungDefinition[];
}

/** One job as a participant, and the spec of the request it answered, where the store holds its answer. */
interface Answered {
  readonly participant: ParticipantResult;
  readonly spec?: JsonObject;
}

/** One job as a participant: an "ok" job with the data the store holds for it, or "missing" when it holds none. */
function participantOf(job: ManifestJob, fingerprint: string | null, store: ResultStore): Answered {
  const { engine, status } = job;
  if (status !== "ok") {
    const detail = jobDetail(job);
    return { participant: { engine, fingerprint, status, ...(detail === undefined ? {} : { detail }) } };
  }
  const missing = (detail: string): Answered => ({ participant: { engine, fingerprint, status: "missing", detail } });
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
  return { participant: { engine, fingerprint, status: "ok", data: result.data }, spec: request.spec };
}

/**
 * The participants of a span: every engine with a job in one of its groups, in the order they first appear. An
 * engine with an "ok" answer to every request of the span is "ok", and its data is the `SpanAnswer` of those
 * answers in the order of the requests. Any other enters as the first request it has no such answer to left it; one
 * without a job for a request of the span is "missing".
 */
function spanParticipants(
  unit: readonly (readonly ManifestJob[])[],
  answeredBy: (job: ManifestJob) => Answered,
  fingerprints: ReadonlyMap<string, string | null>,
): ParticipantResult[] {
  const engines = [...new Set(unit.flatMap((jobs) => jobs.map((job) => job.engine)))];
  return engines.map((engine): ParticipantResult => {
    const fingerprint = fingerprints.get(engine) ?? null;
    const members: SpanMember[] = [];
    for (const jobs of unit) {
      const job = jobs.find((candidate) => candidate.engine === engine);
      if (job === undefined) {
        return { engine, fingerprint, status: "missing", detail: "it has no job for a request of the span" };
      }
      const { participant, spec } = answeredBy(job);
      if (participant.status !== "ok" || participant.data === undefined || spec === undefined) return participant;
      members.push({ requestId: job.requestId, spec, data: participant.data });
    }
    return { engine, fingerprint, status: "ok", data: { members } };
  });
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
 * is added to it as a "missing" participant, so that what was asked for is shown as not there. A rung that is about
 * named engines (`RungDefinition.engines`) is no comparison against the reference of a run: where the reference is
 * none of its participants, its groups are compared against their own default and nothing is added to them.
 *
 * Each group gives one set per mode (`compareGroup`). The sets are ordered by run as the suite orders them, then
 * by rung and request as the manifest's jobs do, then by mode. A run without a case has no jobs and no sets. Equal
 * manifests, store entries, cases and policies give an equal file, in any directory and on any machine.
 *
 * A comparator is the one of the quantity for the rung (`ComparatorLookup.get`), and is handed what the answers
 * are answers to: the spec of the request, from the store entry of an engine that answered it, the case of the
 * run, from `cases`, and the MTF recipe of the run, where the manifest records one. An answer the store holds is
 * read once for a run, however many rungs and modes compare it.
 *
 * A comparator of spans (`QuantityComparator.spanOf`) judges a figure that is of several requests of a run at once.
 * The groups of its rung in a run are then put together by the span each request's spec belongs to, and each span
 * gives one set per mode, in the place and under the `requestId` of the first of its requests. A participant of a
 * span that has an "ok" answer to every request of it is handed over as a `SpanAnswer` of those answers, in the
 * order of the requests; one that has not enters as the first of them left it (unsupported, in error, missing), so
 * its pairs say why nothing of the span was measured. A request whose spec is not at hand, because no engine
 * answered it, and one the comparator names no span for, is a span of its own.
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
  const { manifest, store, policy, reference, modes = COMPARISON_MODES, comparators = COMPARATORS, cases } = input;
  const ownEngines = new Set(
    (input.rungDefinitions ?? RUNGS).filter((rung) => rung.engines !== undefined).map((rung) => rung.id),
  );
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
    // Rungs that ask one request share one answer: it is read from the store once, and dropped with the run.
    const read = new Map<string, Answered>();
    const answeredBy = (job: ManifestJob): Answered => {
      const fingerprint = fingerprints.get(job.engine) ?? null;
      if (job.status !== "ok" || job.storeKey === null) return participantOf(job, fingerprint, store);
      const key = JSON.stringify([job.engine, job.storeKey, job.requestId, job.quantity]);
      const known = read.get(key) ?? participantOf(job, fingerprint, store);
      read.set(key, known);
      return known;
    };
    const opticalCase = run.caseId === null ? undefined : cases?.(run.caseId);
    const recipe = run.recipe?.recipe ?? undefined;
    const specOf = (jobs: readonly ManifestJob[]): JsonObject | undefined =>
      jobs.map(answeredBy).find((answer) => answer.spec !== undefined)?.spec;

    // What is compared as one set: a request, or for a comparator of spans the requests of one span. A Map keeps
    // its keys in the order they were first set, so a span stands where its first request does.
    const units = new Map<string, ManifestJob[][]>();
    for (const jobs of groups.values()) {
      const [{ run: runName, rung, quantity, requestId }] = jobs;
      if (runName !== run.name) continue;
      const comparator = comparators.get(quantity, rung);
      const spec = comparator?.spanOf === undefined ? undefined : specOf(jobs);
      const span = spec === undefined ? undefined : comparator?.spanOf?.(spec);
      const key = JSON.stringify(span === undefined ? [rung, "request", requestId] : [rung, "span", span]);
      units.set(key, [...(units.get(key) ?? []), jobs]);
    }

    for (const unit of units.values()) {
      const [jobs] = unit;
      const [{ run: runName, caseId, rung, quantity, requestId }] = jobs;
      if (!Object.hasOwn(policy.rungs, rung)) throw new UsageError(`the policy has no entry for the rung ${rung}`);
      const rungPolicy = policy.rungs[rung];
      if (rungPolicy.quantity !== quantity) {
        throw new UsageError(`rung ${rung}: the run asked for ${quantity}; the policy judges ${rungPolicy.quantity}`);
      }

      const comparator = comparators.get(quantity, rung);
      const spec = specOf(jobs);
      const participants =
        comparator?.spanOf === undefined
          ? jobs.map((job) => answeredBy(job).participant)
          : spanParticipants(unit, answeredBy, fingerprints);
      const named = reference ?? run.referenceEngine;
      const taking = (engine: string): boolean => participants.some((participant) => participant.engine === engine);
      const against =
        named !== undefined && (!ownEngines.has(rung) || taking(named)) ? named : defaultReference(participants);
      if (against !== undefined && !taking(against)) {
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
        comparator,
        blocked: ledger.blockedIn(rung),
        context: {
          ...(spec === undefined ? {} : { spec }),
          ...(opticalCase === undefined ? {} : { opticalCase }),
          ...(recipe === undefined ? {} : { recipe }),
        },
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
