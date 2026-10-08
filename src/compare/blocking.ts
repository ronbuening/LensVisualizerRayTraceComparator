// The blocking rule: a rung whose policy says `blocksLaterRungs` keeps two engines that failed it from being judged
// against each other in the rungs after it. A system that two engines built differently is traced differently, and
// every later difference between them would be that one again.
import { FAILING_VERDICTS } from "../contract/comparison.ts";
import type { ComparisonSet } from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";

/** The pairs of engines that are blocked, each with the rung that blocks it: from `pairKey` to a rung id. */
export type BlockedPairs = ReadonlyMap<string, string>;

/** Two engines as a pair, whichever of them is named first. */
export function pairKey(a: string, b: string): string {
  return JSON.stringify([a, b].sort());
}

/** Which pairs of engines are blocked on one case, as the rungs of one run are compared in ladder order. */
export interface BlockingLedger {
  /**
   * The pairs that are blocked in a set of `rung`: every pair that failed a rung compared before it. A rung does
   * not block itself, so the requests of one rung are all judged.
   */
  blockedIn(rung: string): BlockedPairs;
  /**
   * Notes a compared set of a rung with this policy: when the policy blocks later rungs, every pair of the set
   * that is `FAIL` or `ERROR` is blocked from now on, by this rung unless an earlier one blocks it already.
   */
  note(set: ComparisonSet, policy: RungPolicy): void;
}

/**
 * A ledger with no pair blocked. One ledger serves the sets of one run of a suite, which are of one case; the sets
 * are noted in the order of the ladder, so that "later" is what the ladder says it is.
 */
export function createBlockingLedger(): BlockingLedger {
  const blockers = new Map<string, string>();
  return {
    blockedIn: (rung) => new Map([...blockers].filter(([, blocker]) => blocker !== rung)),
    note: (set, policy) => {
      if (policy.blocksLaterRungs !== true) return;
      for (const pair of set.pairs) {
        const key = pairKey(pair.a, pair.b);
        if (FAILING_VERDICTS.includes(pair.verdict) && !blockers.has(key)) blockers.set(key, set.rung);
      }
    },
  };
}
