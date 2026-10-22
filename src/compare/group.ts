// A group: the participants of one request, paired against a reference or against each other. A comparison of two
// engines is a group of two.
import type {
  ComparisonMode,
  ComparisonParticipant,
  ComparisonSet,
  PairComparison,
  RecordedValues,
} from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { pairKey } from "./blocking.ts";
import type { BlockedPairs } from "./blocking.ts";
import type { ComparisonContext, QuantityComparator } from "./comparator.ts";
import { attributeFloor } from "./floor.ts";
import { comparePair, stepAnswers } from "./pair.ts";
import type { ParticipantResult } from "./pair.ts";

/** The answers of several engines to one request, and what they are judged by. */
export interface ComparisonGroup {
  readonly suite: string;
  readonly run: string;
  readonly caseId: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  /** The engines to compare, each once, in any order. */
  readonly participants: readonly ParticipantResult[];
  /** The policy of the rung. */
  readonly policy: RungPolicy;
  /** The comparator of the quantity; without one every pair of two answers is an `ERROR`. */
  readonly comparator: QuantityComparator | undefined;
  /** The pairs of engines that an earlier rung blocks (`createBlockingLedger`); none unless given. */
  readonly blocked?: BlockedPairs;
  /** What the answers are answers to, for a comparator that needs it: the request's spec and its case. */
  readonly context?: ComparisonContext;
}

function byEngine(a: ParticipantResult, b: ParticipantResult): number {
  return a.engine < b.engine ? -1 : a.engine > b.engine ? 1 : 0;
}

/** The name a recorded value of a later step of an engine has beside those of its first answer: `<name>#<step>`. */
export function stepValueName(name: string, step: string): string {
  return `${name}#${step}`;
}

/**
 * A participant as a set states it: who it is, how its job ended and, for an answer, the values the quantity's
 * comparator says it reports beside what is compared, by name in sorted order, with null for a value that is not
 * finite. The values of a later step that is an answer are beside them, each under `stepValueName`. `recorded` is
 * left out when there is no answer, no such comparator or no such value.
 */
function statedParticipant(
  participant: ParticipantResult,
  comparator: QuantityComparator | undefined,
  context: ComparisonContext | undefined,
): ComparisonParticipant {
  const { engine, fingerprint, status, data } = participant;
  const reported: { [name: string]: readonly number[] } = {
    ...(status === "ok" && data !== undefined ? comparator?.recorded?.(data, context) : {}),
  };
  for (const { step, data: later } of stepAnswers(participant)) {
    const values = comparator?.recorded?.(later, context) ?? {};
    for (const name of Object.keys(values)) reported[stepValueName(name, step)] = values[name];
  }
  const names = Object.keys(reported).sort();
  if (names.length === 0) return { engine, fingerprint, status };
  const recorded: RecordedValues = Object.fromEntries(
    names.map((name) => [name, reported[name].map((value) => (Number.isFinite(value) ? value : null))]),
  );
  return { engine, fingerprint, status, recorded };
}

/**
 * The engine a group is compared against when nobody names one: the first, in the order of the engine ids, whose
 * status is "ok", so that the reference is an answer wherever there is one; else the first of all. Undefined for a
 * group without participants.
 */
export function defaultReference(participants: readonly ParticipantResult[]): string | undefined {
  const sorted = [...participants].sort(byEngine);
  return (sorted.find((participant) => participant.status === "ok") ?? sorted[0])?.engine;
}

/**
 * Compares the participants of a group as one `ComparisonSet`, with its participants sorted by engine id.
 *
 * - `reference-vs-each`: the N − 1 pairs of `reference` with every other participant, the reference first in
 *   each, in the order of the other engines' ids.
 * - `pairwise`: the N(N − 1)/2 pairs of every two participants, each pair and the list in the order of the
 *   engine ids. `reference` is not used.
 *
 * Both modes pair the same participants and judge a pair alike (`comparePair`), so a pair that is in both has the
 * same metrics and the same verdict in both, up to which engine is named first. A pair the group lists as blocked
 * is `BLOCKED` in place of being judged, whichever of its engines is named first. A pair that came to `FAIL` in a
 * rung with a floor is held to the rung's arbiter, with every participant of the group as a witness, in either
 * mode alike, and is `FLOOR` where the excess is the floored engine's own (`attributeFloor`).
 *
 * Each participant that answered carries the values its answer only records. A group of one has no pairs. Pure:
 * equal arguments give an equal set. Throws when an engine is a participant twice, and in the mode
 * reference-vs-each when `reference` is not given or is not a participant.
 */
export function compareGroup(group: ComparisonGroup, mode: ComparisonMode, reference?: string): ComparisonSet {
  const { suite, run, caseId, rung, quantity, requestId, policy, comparator, context } = group;
  const participants = [...group.participants].sort(byEngine);
  const repeated = participants.find((participant, index) => participants[index + 1]?.engine === participant.engine);
  if (repeated !== undefined) throw new Error(`compareGroup: engine ${repeated.engine} is a participant twice`);

  const pair = (a: ParticipantResult, b: ParticipantResult): PairComparison =>
    attributeFloor(comparePair(a, b, policy, comparator, group.blocked?.get(pairKey(a.engine, b.engine)), context), {
      participants,
      policy,
      comparator,
      context,
    });
  let pairs: PairComparison[];
  if (mode === "reference-vs-each") {
    const first = participants.find((participant) => participant.engine === reference);
    if (first === undefined) {
      throw new Error(`compareGroup: the reference ${reference ?? "(none given)"} is not a participant`);
    }
    pairs = participants.filter((participant) => participant !== first).map((other) => pair(first, other));
  } else {
    pairs = participants.flatMap((a, index) => participants.slice(index + 1).map((b) => pair(a, b)));
  }
  return {
    contract: CONTRACT_VERSION,
    kind: "comparison",
    suite,
    run,
    caseId,
    rung,
    quantity,
    requestId,
    participants: participants.map((participant) => statedParticipant(participant, comparator, context)),
    mode,
    ...(mode === "reference-vs-each" ? { reference } : {}),
    pairs,
  };
}
