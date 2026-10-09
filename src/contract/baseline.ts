// The baseline: mirrors contract/schema/v1/baseline.schema.json, plus the rules a schema cannot state.
import { VERDICTS } from "./comparison.ts";
import type { ComparisonMetric, ParticipantStatus, Verdict } from "./comparison.ts";
import type { EngineDetails } from "./result.ts";

/** An engine of a baseline: who answered, by the hashes results are keyed by. */
export interface BaselineEngine {
  readonly id: string;
  /** The version the engine states, for people. */
  readonly version: string;
  /** The content hash of the engine's own code. */
  readonly fingerprint: string;
  /** The hash of the comparator's code behind the engine, for an engine that states one. */
  readonly adapterRevision?: string;
  /** What the engine says of itself beside its hashes: a commit, a dirty flag, a file count. */
  readonly details: EngineDetails;
}

/** One metric of a pair over the requests of one rung of one run. */
export interface BaselineMetric {
  readonly name: string;
  readonly unit: string;
  /**
   * The largest value over the requests, or their sum for a metric counted in rays or elements; null when a value
   * is not a finite number.
   */
  readonly value: number | null;
  /** Where the largest value occurs, for a metric that is a maximum. */
  readonly where?: ComparisonMetric["where"];
  /** The tolerance the policy judges the metric by, when it judges it. */
  readonly tolerance?: number;
}

/** How many requests came to one verdict. */
export interface BaselineVerdictCount {
  readonly verdict: Verdict;
  readonly count: number;
}

/** Two engines over the requests of one rung of one run. */
export interface BaselinePair {
  /** The first engine: the one whose id sorts first. */
  readonly a: string;
  readonly b: string;
  /** The gravest verdict over the requests (`gravestVerdict`). */
  readonly verdict: Verdict;
  /** How many requests came to each verdict, in the order of `VERDICTS`, without the verdicts none came to. */
  readonly verdicts: readonly BaselineVerdictCount[];
  /** The metrics, in the order the comparator reports them. */
  readonly metrics: readonly BaselineMetric[];
}

/** How the jobs of one engine ended in one rung of one run. */
export interface BaselineSupport {
  readonly engine: string;
  /** "ok" when every job did; else the status of the first that did not. */
  readonly status: ParticipantStatus;
  /** The codes of that first job: the items of an "unsupported", the code of an "error". */
  readonly detail?: string;
}

/** How the rays of one engine ended, added up over the requests of a rung. */
export interface BaselineRays {
  readonly engine: string;
  readonly ok: number;
  readonly blocked: number;
  readonly failed: number;
}

/** One rung of one run. */
export interface BaselineRung {
  readonly rung: string;
  readonly quantity: string;
  /** How many requests of the rung the engines were compared on. */
  readonly requests: number;
  /** Every engine that had a job in the rung, sorted by id. */
  readonly support: readonly BaselineSupport[];
  /** Sorted by engine; left out by a rung without rays. */
  readonly rays?: readonly BaselineRays[];
  /** Every pair of two engines of `support`, sorted by `a` and then `b`. */
  readonly pairs: readonly BaselinePair[];
}

/** One run as it was run: with its case hash, what the records below it are keyed on. */
export interface BaselineRun {
  readonly name: string;
  /** The content hash of the run's case. */
  readonly caseId: string;
  /** The rungs in ladder order. */
  readonly rungs: readonly BaselineRung[];
}

/** The committed record of one compared run of a suite. */
export interface Baseline {
  readonly contract: string;
  readonly kind: "baseline";
  /** The suite's name and the hash of the suite file as written. */
  readonly suite: { readonly name: string; readonly hash: string };
  /** The policy the pairs were judged by. */
  readonly policy: { readonly version: number; readonly hash: string };
  /** Every engine, sorted by id. */
  readonly engines: readonly BaselineEngine[];
  /** Every run, in suite order. */
  readonly runs: readonly BaselineRun[];
}

/** The verdicts from the least grave to the gravest: what a pair came to over several requests is the last one met. */
export const VERDICT_GRAVITY: readonly Verdict[] = [
  "PASS",
  "RECORDED",
  "FLOOR",
  "UNSUPPORTED",
  "ATTENTION",
  "BLOCKED",
  "FAIL",
  "ERROR",
];

/** The gravest of several verdicts by `VERDICT_GRAVITY`; undefined for none. */
export function gravestVerdict(verdicts: readonly Verdict[]): Verdict | undefined {
  let found: Verdict | undefined;
  for (const verdict of verdicts) {
    if (found === undefined || VERDICT_GRAVITY.indexOf(verdict) > VERDICT_GRAVITY.indexOf(found)) found = verdict;
  }
  return found;
}

function unsorted(values: readonly string[]): string | undefined {
  return values.find((value, index) => index > 0 && !(values[index - 1] < value));
}

/**
 * The rules of a baseline that its schema cannot state, as a list of what is broken (empty when nothing is):
 *
 * - the engines are sorted by id, each once; no run is named twice, and no rung twice in a run;
 * - the engines of a rung's `support` and `rays` are engines of the baseline, sorted, each once;
 * - a pair names two engines of its rung's `support`, the first before the second, and the pairs are sorted;
 * - a pair's verdicts are in the order of `VERDICTS`, each once, add up to the requests of its rung, and its
 *   verdict is the gravest of them.
 *
 * The baseline is expected to be schema-valid.
 */
export function baselineProblems(baseline: Baseline): string[] {
  const problems: string[] = [];
  const ids = baseline.engines.map((engine) => engine.id);
  const misplaced = unsorted(ids);
  if (misplaced !== undefined) problems.push(`engine ${misplaced} is listed out of order or twice`);
  const runNames = new Set<string>();
  for (const run of baseline.runs) {
    if (runNames.has(run.name)) problems.push(`run ${run.name} is listed twice`);
    runNames.add(run.name);
    const rungIds = new Set<string>();
    for (const rung of run.rungs) {
      const at = `run ${run.name}, rung ${rung.rung}`;
      if (rungIds.has(rung.rung)) problems.push(`${at}: the rung is listed twice`);
      rungIds.add(rung.rung);
      for (const [member, list] of [
        ["support", rung.support],
        ["rays", rung.rays ?? []],
      ] as const) {
        const engines = list.map((entry) => entry.engine);
        const stray = unsorted(engines);
        if (stray !== undefined) problems.push(`${at}: ${member} lists ${stray} out of order or twice`);
        for (const engine of engines) {
          if (!ids.includes(engine))
            problems.push(`${at}: ${member} names ${engine}, which is no engine of the baseline`);
        }
      }
      const supported = rung.support.map((entry) => entry.engine);
      const keys = rung.pairs.map((pair) => `${pair.a}\0${pair.b}`);
      if (unsorted(keys) !== undefined) problems.push(`${at}: its pairs are out of order or listed twice`);
      for (const pair of rung.pairs) {
        const of = `${at}, ${pair.a} and ${pair.b}`;
        if (!(pair.a < pair.b)) problems.push(`${of}: the first engine does not sort before the second`);
        for (const engine of [pair.a, pair.b]) {
          if (!supported.includes(engine)) problems.push(`${of}: ${engine} is no engine of the rung`);
        }
        const order = pair.verdicts.map(({ verdict }) => VERDICTS.indexOf(verdict));
        if (order.some((place, index) => index > 0 && !(order[index - 1] < place))) {
          problems.push(`${of}: its verdicts are out of order or listed twice`);
        }
        const total = pair.verdicts.reduce((sum, { count }) => sum + count, 0);
        if (total !== rung.requests) {
          problems.push(`${of}: its verdicts count ${total} requests; the rung has ${rung.requests}`);
        }
        const gravest = gravestVerdict(pair.verdicts.map(({ verdict }) => verdict));
        if (gravest !== undefined && gravest !== pair.verdict) {
          problems.push(`${of}: its verdict is ${pair.verdict}; the gravest of its requests is ${gravest}`);
        }
      }
    }
  }
  return problems;
}
