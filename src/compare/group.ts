// A group: the participants of one request, paired against a reference or against each other. A comparison of two
// engines is a group of two.
import type { ComparisonMode, ComparisonSet, PairComparison } from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import type { QuantityComparator } from "./comparator.ts";
import { comparePair } from "./pair.ts";
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
}

function byEngine(a: ParticipantResult, b: ParticipantResult): number {
  return a.engine < b.engine ? -1 : a.engine > b.engine ? 1 : 0;
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
 * same metrics and the same verdict in both, up to which engine is named first. A group of one has no pairs. Pure:
 * equal arguments give an equal set. Throws when an engine is a participant twice, and in the mode
 * reference-vs-each when `reference` is not given or is not a participant.
 */
export function compareGroup(group: ComparisonGroup, mode: ComparisonMode, reference?: string): ComparisonSet {
  const { suite, run, caseId, rung, quantity, requestId, policy, comparator } = group;
  const participants = [...group.participants].sort(byEngine);
  const repeated = participants.find((participant, index) => participants[index + 1]?.engine === participant.engine);
  if (repeated !== undefined) throw new Error(`compareGroup: engine ${repeated.engine} is a participant twice`);

  const pair = (a: ParticipantResult, b: ParticipantResult): PairComparison => comparePair(a, b, policy, comparator);
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
    participants: participants.map(({ engine, fingerprint, status }) => ({ engine, fingerprint, status })),
    mode,
    ...(mode === "reference-vs-each" ? { reference } : {}),
    pairs,
  };
}
