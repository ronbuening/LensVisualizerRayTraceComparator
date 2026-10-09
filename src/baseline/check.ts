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
 * - `DRIFT`: a verdict changed or a judged metric moved by more than its tolerance, whether or not it is stale;
 * - `NEW`, `GONE`: the suite as it runs today has a record the baseline lacks, or lacks one the baseline has.
 */
export const CHECK_OUTCOMES = ["OK", "REFRESHABLE", "DRIFT", "NEW", "GONE"] as const;
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
  /** What moved, for a `DRIFT`: each change of a verdict and each metric that moved past its tolerance. */
  readonly moved: readonly string[];
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
    const tolerance = Object.hasOwn(judged, name) ? judged[name].tolerance : undefined;
    if (tolerance === undefined) continue;
    const before = was.metrics.find((metric) => metric.name === name)?.value;
    const after = now.metrics.find((metric) => metric.name === name)?.value;
    if (before === after) continue;
    const said = (value: number | null | undefined): string =>
      value === undefined ? "not measured" : value === null ? "not finite" : numberText(value);
    if (typeof before !== "number" || typeof after !== "number" || Math.abs(after - before) > tolerance) {
      moved.push(`${name} was ${said(before)}, is ${said(after)} (tolerance ${numberText(tolerance)})`);
    }
  }
  return moved;
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
 * when not. A pure function.
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
        const outcome = moved.length > 0 ? "DRIFT" : stale.length > 0 ? "REFRESHABLE" : "OK";
        records.push({ ...key, stale, outcome, verdict: now.verdict, moved });
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
