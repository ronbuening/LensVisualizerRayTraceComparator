// The baseline: mirrors contract/schema/v1/baseline.schema.json, plus the rules a schema cannot state.
import { VERDICTS } from "./comparison.ts";
import type { ComparisonMetric, ParticipantStatus, RecordedValues, Verdict } from "./comparison.ts";
import type { EngineDetails } from "./result.ts";
import { contractMinor } from "./version.ts";

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
  /** Since 1.1: in how many requests of the rung the pair has a value of the metric. */
  readonly measured?: number;
}

/** Since 1.1: the jobs of one engine that were a later step of it (`ManifestJob.step`) in one rung of one run. */
export interface BaselineStep {
  readonly engine: string;
  /** The name of the step, such as `fft512`. */
  readonly step: string;
  /** How many jobs of the step there were: one for each request that was asked again. */
  readonly jobs: number;
  /** "ok" when every job did; else the status of the first that did not. */
  readonly status: ParticipantStatus;
  readonly detail?: string;
}

/** Since 1.1: one request of a rung as it was compared, as far as a table of it is made from. */
export interface BaselineSet {
  /** Every engine compared, sorted by id, with what its answer records. */
  readonly participants: readonly {
    readonly engine: string;
    readonly status: ParticipantStatus;
    readonly recorded?: RecordedValues;
  }[];
  /** Every two engines, the first before the second by id, sorted. */
  readonly pairs: readonly {
    readonly a: string;
    readonly b: string;
    readonly verdict: Verdict;
    readonly reason?: string;
    readonly metrics: readonly ComparisonMetric[];
  }[];
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
  /** Since 1.1: the later steps of the engines, sorted by engine and step; left out by a rung without one. */
  readonly steps?: readonly BaselineStep[];
  /** Since 1.1: the attention bands of the policy for the rung, by metric; left out by a rung without one. */
  readonly bands?: { readonly [metric: string]: number };
  /**
   * Since 1.1: for a rung of the engines' own MTF, each request as it was compared, in the order of the requests:
   * what the tables of the MTF report are made from. Left out by every other rung.
   */
  readonly sets?: readonly BaselineSet[];
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
 *   verdict is the gravest of them;
 * - a baseline that has a member minor 1 added (`steps`, `bands`, `sets`, a metric's `measured`) states a contract
 *   of minor 1 or later; a rung's `sets` are one for each of its requests, each with its engines sorted and once
 *   and its pairs of two of them, sorted; a rung's `steps` are of engines of its `support`, sorted by engine and
 *   step; and no metric is `measured` in more requests than its rung has.
 *
 * The baseline is expected to be schema-valid.
 */
export function baselineProblems(baseline: Baseline): string[] {
  const problems: string[] = [];
  const ids = baseline.engines.map((engine) => engine.id);
  const misplaced = unsorted(ids);
  if (misplaced !== undefined) problems.push(`engine ${misplaced} is listed out of order or twice`);
  const runNames = new Set<string>();
  const usesMinor1 = baseline.runs.some((run) =>
    run.rungs.some(
      (rung) =>
        rung.steps !== undefined ||
        rung.bands !== undefined ||
        rung.sets !== undefined ||
        rung.pairs.some((pair) => pair.metrics.some((metric) => metric.measured !== undefined)),
    ),
  );
  if (usesMinor1 && !((contractMinor(baseline.contract) ?? 0) >= 1)) {
    problems.push(`it states the contract ${baseline.contract} and has a member that minor 1 added`);
  }
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
      const stepKeys = (rung.steps ?? []).map((step) => `${step.engine}\0${step.step}`);
      if (unsorted(stepKeys) !== undefined) problems.push(`${at}: its steps are out of order or listed twice`);
      for (const step of rung.steps ?? []) {
        if (!supported.includes(step.engine))
          problems.push(`${at}: step ${step.step} is of ${step.engine}, which is no engine of the rung`);
      }
      if (rung.sets !== undefined && rung.sets.length !== rung.requests) {
        problems.push(`${at}: it keeps ${rung.sets.length} sets; the rung has ${rung.requests} requests`);
      }
      (rung.sets ?? []).forEach((set, index) => {
        const engines = set.participants.map((participant) => participant.engine);
        if (unsorted(engines) !== undefined)
          problems.push(`${at}, set ${index}: its engines are out of order or listed twice`);
        const pairKeys = set.pairs.map((pair) => `${pair.a}\0${pair.b}`);
        if (unsorted(pairKeys) !== undefined)
          problems.push(`${at}, set ${index}: its pairs are out of order or listed twice`);
        for (const pair of set.pairs) {
          if (!(pair.a < pair.b) || !engines.includes(pair.a) || !engines.includes(pair.b)) {
            problems.push(`${at}, set ${index}: ${pair.a} and ${pair.b} are not two of its engines in order`);
          }
        }
      });
      for (const pair of rung.pairs) {
        const of = `${at}, ${pair.a} and ${pair.b}`;
        for (const metric of pair.metrics) {
          if (metric.measured !== undefined && metric.measured > rung.requests) {
            problems.push(
              `${of}: ${metric.name} is measured in ${metric.measured} requests; the rung has ${rung.requests}`,
            );
          }
        }
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
