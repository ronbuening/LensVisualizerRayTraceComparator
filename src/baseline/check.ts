// What `lvrtc baseline check` decides: a committed baseline set against the baseline of the same suite as it runs
// today. Both are baselines, so this reads no engine and no file, and is a pure function.
import { FAILING_VERDICTS } from "../contract/comparison.ts";
import type { Verdict } from "../contract/comparison.ts";
import type { Baseline, BaselineEngine, BaselinePair } from "../contract/baseline.ts";
import type { Policy } from "../contract/policy.ts";
import { numberText } from "../compare/metricText.ts";

/** Why a record is no longer of what is at hand. */
export const STALE_REASONS = ["case", "engine", "policy"] as const;
/** One reason a record is stale. */
export type StaleReason = (typeof STALE_REASONS)[number];

/**
 * What a record came to:
 *
 * - `OK`: its case, its two engines and the policy are those of the baseline, and it is what it was;
 * - `REFRESHABLE`: it is stale, and run again its verdicts are the same and no judged metric moved by more than
 *   its tolerance: the baseline can be written anew;
 * - `DRIFT`: of a gated rung, a verdict changed or a judged metric moved by more than its tolerance, whether or
 *   not it is stale;
 * - `MOVED`: of a recorded rung, a verdict changed (`RECORDED` to `ATTENTION`, a field that lost its curve) or a
 *   metric with an attention band moved by more than the band, whether or not it is stale. A recorded rung has no
 *   gate, so this is written down and fails nothing;
 * - `NEW`, `GONE`: the suite as it runs today has a record the baseline lacks, or lacks one the baseline has.
 */
export const CHECK_OUTCOMES = ["OK", "REFRESHABLE", "MOVED", "DRIFT", "NEW", "GONE"] as const;
/** What one record came to. */
export type CheckOutcome = (typeof CHECK_OUTCOMES)[number];

/** One record of a baseline, a pair of engines in one rung of one run, as the check found it. */
export interface CheckRecord {
  readonly run: string;
  readonly rung: string;
  readonly a: string;
  readonly b: string;
  /** Why the record is stale, in the order of `STALE_REASONS`; empty when it is not. */
  readonly stale: readonly StaleReason[];
  readonly outcome: CheckOutcome;
  /** The verdict of the pair as it runs today; undefined for a record that is `GONE`. */
  readonly verdict?: Verdict;
  /**
   * What moved, for a `DRIFT` or a `MOVED`: each change of a verdict and each metric that moved past its tolerance
   * or its band.
   */
  readonly moved: readonly string[];
  /**
   * Every figure of the pair that is not what it was, judged or not, however little it moved: a metric's value
   * and, where both baselines state it, the number of requests it was measured in. Left out when there is none.
   */
  readonly changes?: readonly CheckChange[];
}

/** One figure of a record that is not what the baseline has: null for a value that is not finite or not there. */
export interface CheckChange {
  readonly name: string;
  readonly was: number | null;
  readonly now: number | null;
}

function sameEngine(a: BaselineEngine | undefined, b: BaselineEngine | undefined): boolean {
  return (
    a !== undefined && b !== undefined && a.fingerprint === b.fingerprint && a.adapterRevision === b.adapterRevision
  );
}

function verdictsText(pair: BaselinePair): string {
  return pair.verdicts.map(({ verdict, count }) => `${count} ${verdict}`).join(", ");
}

/** What moved between a pair as the baseline has it and as it runs today; empty when nothing did. */
function movedBetween(
  was: BaselinePair,
  now: BaselinePair,
  sameRequests: boolean,
  policy: Policy,
  rung: string,
): string[] {
  const moved: string[] = [];
  const kinds = (pair: BaselinePair): string => pair.verdicts.map(({ verdict }) => verdict).join(",");
  // With the same requests every one of them is held to its verdict; with other requests, the kinds of verdict.
  if (sameRequests ? verdictsText(was) !== verdictsText(now) : kinds(was) !== kinds(now)) {
    moved.push(`verdicts were ${verdictsText(was)}, are ${verdictsText(now)}`);
  }
  const judged = Object.hasOwn(policy.rungs, rung) ? policy.rungs[rung].metrics : {};
  const names = [...new Set([...was.metrics, ...now.metrics].map((metric) => metric.name))];
  for (const name of names) {
    // A gated metric is held to its tolerance, a recorded one to its attention band.
    const limits = Object.hasOwn(judged, name) ? judged[name] : undefined;
    const [limit, called] =
      limits?.tolerance !== undefined
        ? [limits.tolerance, "tolerance"]
        : limits?.attention !== undefined
          ? [limits.attention, "band"]
          : [undefined, ""];
    if (limit === undefined) continue;
    const before = was.metrics.find((metric) => metric.name === name)?.value;
    const after = now.metrics.find((metric) => metric.name === name)?.value;
    if (before === after) continue;
    const said = (value: number | null | undefined): string =>
      value === undefined ? "not measured" : value === null ? "not finite" : numberText(value);
    if (typeof before !== "number" || typeof after !== "number" || Math.abs(after - before) > limit) {
      moved.push(`${name} was ${said(before)}, is ${said(after)} (${called} ${numberText(limit)})`);
    }
  }
  return moved;
}

/** Every figure of a pair that is not what it was: values, and the counts of requests where both state them. */
function changesBetween(was: BaselinePair, now: BaselinePair): CheckChange[] {
  const changes: CheckChange[] = [];
  const names = [...new Set([...was.metrics, ...now.metrics].map((metric) => metric.name))];
  for (const name of names) {
    const [before, after] = [was, now].map((pair) => pair.metrics.find((metric) => metric.name === name));
    const [a, b] = [before?.value ?? null, after?.value ?? null];
    if (a !== b || (before === undefined) !== (after === undefined)) changes.push({ name, was: a, now: b });
    if (before?.measured !== undefined && after?.measured !== undefined && before.measured !== after.measured) {
      changes.push({ name: `${name} (requests measured)`, was: before.measured, now: after.measured });
    }
  }
  return changes;
}

/**
 * Sets a committed baseline against the baseline of the suite as it runs today (`buildBaseline` of a fresh run),
 * record by record: every pair of engines of every rung of every run, in the order of the committed baseline, then
 * the records only today's has.
 *
 * A record is stale by its case when the run's case hash is another, by an engine when the fingerprint or the
 * adapter revision of either of its engines is another (or the engine is not there today), and by the policy when
 * the policy's hash is another. Stale or not, it is `DRIFT` when a verdict changed or a metric the policy judges
 * moved by more than its tolerance in `policy`, the policy of today; else it is `REFRESHABLE` when stale and `OK`
 * when not. A record of a rung the policy only records is `MOVED` in place of `DRIFT`, a metric of it being held
 * to its attention band. Every record also lists each figure that is not what it was (`changes`). A pure function.
 */
export function checkBaseline(committed: Baseline, fresh: Baseline, policy: Policy): CheckRecord[] {
  const records: CheckRecord[] = [];
  const engineOf = (baseline: Baseline, id: string): BaselineEngine | undefined =>
    baseline.engines.find((engine) => engine.id === id);
  const policyStale = committed.policy.hash !== fresh.policy.hash;
  for (const run of committed.runs) {
    const today = fresh.runs.find((each) => each.name === run.name);
    for (const rung of run.rungs) {
      const rungToday = today?.rungs.find((each) => each.rung === rung.rung);
      for (const pair of rung.pairs) {
        const { a, b } = pair;
        const now = rungToday?.pairs.find((each) => each.a === a && each.b === b);
        const key = { run: run.name, rung: rung.rung, a, b };
        if (today === undefined || rungToday === undefined || now === undefined) {
          records.push({ ...key, stale: [], outcome: "GONE", moved: [] });
          continue;
        }
        const stale: StaleReason[] = [];
        if (today.caseId !== run.caseId) stale.push("case");
        if ([a, b].some((id) => !sameEngine(engineOf(committed, id), engineOf(fresh, id)))) stale.push("engine");
        if (policyStale) stale.push("policy");
        const moved = movedBetween(pair, now, rung.requests === rungToday.requests, policy, rung.rung);
        const recorded = Object.hasOwn(policy.rungs, rung.rung) && policy.rungs[rung.rung].class === "recorded";
        const outcome = moved.length > 0 ? (recorded ? "MOVED" : "DRIFT") : stale.length > 0 ? "REFRESHABLE" : "OK";
        const changes = changesBetween(pair, now);
        records.push({
          ...key,
          stale,
          outcome,
          verdict: now.verdict,
          moved,
          ...(changes.length === 0 ? {} : { changes }),
        });
      }
    }
  }
  for (const run of fresh.runs) {
    const before = committed.runs.find((each) => each.name === run.name);
    for (const rung of run.rungs) {
      const rungBefore = before?.rungs.find((each) => each.rung === rung.rung);
      for (const pair of rung.pairs) {
        if (rungBefore?.pairs.some((each) => each.a === pair.a && each.b === pair.b)) continue;
        records.push({
          run: run.name,
          rung: rung.rung,
          a: pair.a,
          b: pair.b,
          stale: [],
          outcome: "NEW",
          verdict: pair.verdict,
          moved: [],
        });
      }
    }
  }
  return records;
}

/** Whether a check fails: a record that drifted, or one whose verdict today is `FAIL` or `ERROR`. */
export function checkFails(records: readonly CheckRecord[]): boolean {
  return records.some(
    (record) =>
      record.outcome === "DRIFT" || (record.verdict !== undefined && FAILING_VERDICTS.includes(record.verdict)),
  );
}

/** What a record is called in a line: `OK`, `STALE(case) REFRESHABLE`, `STALE(case,engine) DRIFT`, `DRIFT`, `NEW`. */
export function stateText(record: CheckRecord): string {
  const stale = record.stale.length === 0 ? "" : `STALE(${record.stale.join(",")}) `;
  return `${stale}${record.outcome}`;
}

/** One metric of one pair of one rung, over the records of a check in which it is not what it was. */
export interface ChangeSummary {
  readonly rung: string;
  readonly a: string;
  readonly b: string;
  readonly name: string;
  /** In how many records the figure changed, and how many records the pair has in the rung. */
  readonly records: number;
  readonly of: number;
  /** The largest change of the figure, as a magnitude, and the run it is in; null where a value was no number. */
  readonly largest: number | null;
  readonly run: string;
}

/**
 * What moved over a whole check, however little: for each rung, pair and figure that is not what it was in some
 * record, in how many records, the largest change and the run it is in, in the order the records first have them.
 * It is the before and after of an engine that changed: a gate says whether a change matters, this says what
 * changed.
 */
export function summarizeChanges(records: readonly CheckRecord[]): ChangeSummary[] {
  const summaries = new Map<string, ChangeSummary>();
  const sizes = new Map<string, number>();
  for (const record of records) {
    const pairKey = `${record.rung}\0${record.a}\0${record.b}`;
    sizes.set(pairKey, (sizes.get(pairKey) ?? 0) + 1);
    for (const change of record.changes ?? []) {
      const key = `${pairKey}\0${change.name}`;
      const size = change.was === null || change.now === null ? null : Math.abs(change.now - change.was);
      const known = summaries.get(key);
      const { rung, a, b, run } = record;
      if (known === undefined) {
        summaries.set(key, { rung, a, b, name: change.name, records: 1, of: 0, largest: size, run });
      } else {
        const larger = known.largest !== null && (size === null || size > known.largest);
        summaries.set(key, { ...known, records: known.records + 1, ...(larger ? { largest: size, run } : {}) });
      }
    }
  }
  return [...summaries.values()].map((summary) => ({
    ...summary,
    of: sizes.get(`${summary.rung}\0${summary.a}\0${summary.b}`) ?? 0,
  }));
}
