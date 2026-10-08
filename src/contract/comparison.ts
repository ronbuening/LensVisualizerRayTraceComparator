// The comparison set: mirrors contract/schema/v1/comparison.schema.json, plus the rules a schema cannot state.
import type { RungClass } from "./policy.ts";
import type { ResultStatus } from "./result.ts";

/**
 * What a pair of answers came to, in the order reports list them:
 *
 * - `PASS`, `FAIL`: a gated pair, with every judged metric within its tolerance, or not;
 * - `RECORDED`, `ATTENTION`: a recorded pair, with every judged metric within its attention band, or not. Neither
 *   is a failure;
 * - `UNSUPPORTED`: one of the two engines cannot answer, which is an answer and not a failure;
 * - `ERROR`: there is nothing to compare, or what there is cannot be compared.
 */
export const VERDICTS = ["PASS", "FAIL", "RECORDED", "ATTENTION", "UNSUPPORTED", "ERROR"] as const;
/** What one pair came to. */
export type Verdict = (typeof VERDICTS)[number];

/** The verdicts that fail a comparison. Every other verdict leaves it standing. */
export const FAILING_VERDICTS: readonly Verdict[] = ["FAIL", "ERROR"];

/** Every engine against one reference, or every engine against every other. */
export const COMPARISON_MODES = ["reference-vs-each", "pairwise"] as const;
/** One way the participants of a set are paired. */
export type ComparisonMode = (typeof COMPARISON_MODES)[number];

/** How a participant's job ended; `missing` when there is no result of it to compare. */
export type ParticipantStatus = ResultStatus | "missing";

/** One engine whose answer is compared. */
export interface ComparisonParticipant {
  readonly engine: string;
  /** The fingerprint of the engine that answered; null for an engine that could not be described. */
  readonly fingerprint: string | null;
  readonly status: ParticipantStatus;
}

/** One number that says how far two answers are apart. */
export interface ComparisonMetric {
  readonly name: string;
  /** The value; null when it is not a finite number, in which case the pair's `reason` says what it is. */
  readonly value: number | null;
  readonly unit: string;
  /** Where the value occurs, when it occurs somewhere: an index, a field, a frequency. */
  readonly where?: { readonly [key: string]: number | string };
}

/** Two participants compared. */
export interface PairComparison {
  /** The first engine: the reference, in the mode reference-vs-each. */
  readonly a: string;
  readonly b: string;
  /** What was measured, in the order the quantity's comparator reports it; empty when nothing could be. */
  readonly metrics: readonly ComparisonMetric[];
  readonly class: RungClass;
  readonly verdict: Verdict;
  /** Why the verdict is what it is, wherever that is not plain from the metrics. */
  readonly reason?: string;
}

/** The answers of several engines to one request, compared pair by pair. */
export interface ComparisonSet {
  readonly contract: string;
  readonly kind: "comparison";
  /** The name of the suite. */
  readonly suite: string;
  /** The name of the run of the suite. */
  readonly run: string;
  readonly caseId: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  /** Every engine compared, sorted by id. */
  readonly participants: readonly ComparisonParticipant[];
  readonly mode: ComparisonMode;
  /** The engine every other is compared against; stated exactly when `mode` is reference-vs-each. */
  readonly reference?: string;
  readonly pairs: readonly PairComparison[];
}

/**
 * The rules of a comparison set that its schema cannot state, as a list of what is broken (empty when nothing is):
 * no engine is a participant twice; `reference` is stated exactly in the mode reference-vs-each, and names a
 * participant; every pair names two different participants, the first of them the reference when there is one.
 * The set is expected to be schema-valid.
 */
export function comparisonInvariantProblems(set: ComparisonSet): string[] {
  const problems: string[] = [];
  const engines = set.participants.map((participant) => participant.engine);
  const repeated = engines.find((engine, index) => engines.indexOf(engine) !== index);
  if (repeated !== undefined) problems.push(`engine ${repeated} is a participant more than once`);
  if (set.mode === "reference-vs-each" && set.reference === undefined) {
    problems.push('mode "reference-vs-each" needs reference');
  }
  if (set.mode === "pairwise" && set.reference !== undefined) problems.push('mode "pairwise" has no reference');
  if (set.reference !== undefined && !engines.includes(set.reference)) {
    problems.push(`reference ${set.reference} is not a participant`);
  }
  set.pairs.forEach(({ a, b }, index) => {
    for (const engine of [a, b]) {
      if (!engines.includes(engine)) problems.push(`pair ${index}: ${engine} is not a participant`);
    }
    if (a === b) problems.push(`pair ${index}: ${a} is compared with itself`);
    if (set.mode === "reference-vs-each" && set.reference !== undefined && a !== set.reference) {
      problems.push(`pair ${index}: its first engine is ${a}, not the reference ${set.reference}`);
    }
  });
  return problems;
}
