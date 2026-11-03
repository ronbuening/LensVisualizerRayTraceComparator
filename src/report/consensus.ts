// The consensus of a group: of the engines compared pairwise on one request of a gated rung, the set whose answers
// are within the gates of each other, and the engines beyond the gates of all of it. It says which answers are
// within the gates of each other and nothing more: a consensus is no arbiter, and an outlier is no engine in error.
// Pure: a function of the pairs' verdicts and the rung's class, and of nothing else.
import type { Verdict } from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";

/** Why a group has no consensus, in the order they are decided. */
export const NO_CONSENSUS_REASONS = ["split", "no-pair-within", "minority"] as const;
/** One of them. */
export type NoConsensusReason = (typeof NO_CONSENSUS_REASONS)[number];

/** How few engines a group has a consensus of: two are a pair, whose verdict says it all. */
export const MIN_GROUP_ENGINES = 3;
/** How many engines a group may have: every subset of them is looked at. */
export const MAX_GROUP_ENGINES = 16;

/**
 * What the pairs of a group come to. Every engine is named in at most one of the lists, each sorted by id.
 *
 * - `consensus`: the engines every two of which are within the gates of each other, as `consensusOf` decides it;
 *   null when there is none, and `reason` says why (it is left out when there is one).
 * - `outliers`: the engines outside the consensus that are beyond the gates of every engine of it.
 * - `apart`: the other engines outside the consensus that have a pair judged, within or beyond: one with a pair
 *   with an engine of the consensus that is not judged, or within the gates of some of it and beyond others.
 * - `notPlaced`: the engines without a pair judged.
 *
 * Without a consensus `outliers` and `apart` are empty: there is nothing to be outside of.
 */
export interface GroupConsensus {
  readonly consensus: readonly string[] | null;
  readonly reason?: NoConsensusReason;
  readonly outliers: readonly string[];
  readonly apart: readonly string[];
  readonly notPlaced: readonly string[];
}

/** What a group is read from: its participants and its pairs, as a pairwise comparison set states them. */
export interface GroupPairs {
  readonly participants: readonly { readonly engine: string }[];
  readonly pairs: readonly { readonly a: string; readonly b: string; readonly verdict: Verdict }[];
}

/** What one pair says of its two engines. */
export type PairStanding = "within" | "beyond" | "unjudged";

/**
 * What a verdict says of the two engines of a gated rung: `within` the gates of each other (PASS, and FLOOR, which
 * counts as a pass), `beyond` them (FAIL), or `unjudged` (UNSUPPORTED, BLOCKED, ERROR: no measurement holds them to a
 * gate). RECORDED and ATTENTION are not verdicts of a gated rung; were they given, no gate would have been applied,
 * and they are unjudged too.
 */
export function standingOf(verdict: Verdict): PairStanding {
  if (verdict === "PASS" || verdict === "FLOOR") return "within";
  return verdict === "FAIL" ? "beyond" : "unjudged";
}

function byId(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The consensus of a group compared pairwise (`GroupConsensus`), or null where there is none to compute: a rung that
 * is not gated (a recorded rung's RECORDED or ATTENTION is no agreement), a rung the policy has no entry for, or fewer
 * than `MIN_GROUP_ENGINES` participants.
 *
 * Each pair is within, beyond or unjudged (`standingOf`). The engines placed are those with a pair within or beyond.
 * The consensus is the largest set of at least two placed engines every two of which are within, where it is the only
 * largest such set and holds more than half of the engines placed. Otherwise there is none, and the reason is the
 * first that holds of `split` (two or more largest sets), `no-pair-within` (no two engines within) and `minority`
 * (the largest set holds no more than half of the engines placed).
 *
 * Pure: equal arguments give an equal result, whatever the order of the participants and of the pairs. Throws for a
 * group of more than `MAX_GROUP_ENGINES` engines, an engine that is a participant twice, a pair of an engine that is
 * no participant or of one engine with itself, and two pairs of the same two engines.
 */
export function consensusOf(group: GroupPairs, rungPolicy: RungPolicy | null): GroupConsensus | null {
  if (rungPolicy === null || rungPolicy.class !== "gated") return null;
  const engines = group.participants.map((participant) => participant.engine).sort(byId);
  if (engines.some((engine, index) => engines[index + 1] === engine)) {
    throw new Error("consensusOf: an engine is a participant twice");
  }
  if (engines.length < MIN_GROUP_ENGINES) return null;
  if (engines.length > MAX_GROUP_ENGINES) {
    throw new Error(`consensusOf: a group of ${engines.length} engines; at most ${MAX_GROUP_ENGINES} are looked at`);
  }

  const standings = new Map<string, PairStanding>();
  const keyOf = (a: string, b: string): string => JSON.stringify(a < b ? [a, b] : [b, a]);
  for (const { a, b, verdict } of group.pairs) {
    if (!engines.includes(a) || !engines.includes(b) || a === b) {
      throw new Error(`consensusOf: the pair ${a} and ${b} is not of two participants`);
    }
    if (standings.has(keyOf(a, b))) throw new Error(`consensusOf: the pair ${a} and ${b} is there twice`);
    standings.set(keyOf(a, b), standingOf(verdict));
  }
  // A pair the group does not state is not judged.
  const standing = (a: string, b: string): PairStanding => standings.get(keyOf(a, b)) ?? "unjudged";

  const placed = engines.filter((engine) =>
    engines.some((other) => other !== engine && standing(engine, other) !== "unjudged"),
  );
  const notPlaced = engines.filter((engine) => !placed.includes(engine));

  // Every subset of the placed engines, as a mask over `placed`: the largest of those every two of which are within.
  let largest = 0;
  let found: number[] = [];
  for (let mask = 1; mask < 1 << placed.length; mask++) {
    const members = placed.flatMap((_engine, index) => ((mask >> index) & 1 ? [index] : []));
    if (members.length < 2 || members.length < largest) continue;
    const within = members.every((i, at) =>
      members.slice(at + 1).every((j) => standing(placed[i], placed[j]) === "within"),
    );
    if (!within) continue;
    if (members.length > largest) {
      largest = members.length;
      found = [mask];
    } else found.push(mask);
  }

  const none = (reason: NoConsensusReason): GroupConsensus => ({
    consensus: null,
    reason,
    outliers: [],
    apart: [],
    notPlaced,
  });
  if (found.length > 1) return none("split");
  if (found.length === 0) return none("no-pair-within");
  if (2 * largest <= placed.length) return none("minority");

  const consensus = placed.filter((_engine, index) => (found[0] >> index) & 1);
  const outside = placed.filter((engine) => !consensus.includes(engine));
  const outliers = outside.filter((engine) => consensus.every((member) => standing(engine, member) === "beyond"));
  const apart = outside.filter((engine) => !outliers.includes(engine));
  return { consensus, outliers, apart, notPlaced };
}
