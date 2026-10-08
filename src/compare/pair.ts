// One pair: two participants of a comparison, the metrics between their answers and the verdict the policy gives.
import type { ComparisonMetric, PairComparison, ParticipantStatus } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import type { RungPolicy } from "../contract/policy.ts";
import { formatSci } from "../core/numeric/format.ts";
import type { ComputedMetric, QuantityComparator } from "./comparator.ts";
import { METRIC_DIGITS, whereText } from "./metricText.ts";

/** One engine as it enters a comparison: how its job ended and, when it answered, what it answered. */
export interface ParticipantResult {
  readonly engine: string;
  /** The fingerprint of the engine that answered; null for an engine that could not be described. */
  readonly fingerprint: string | null;
  readonly status: ParticipantStatus;
  /**
   * What is known beyond the status, for the reason of a verdict: the items of an "unsupported", the code of an
   * "error", why a result is "missing". It is stored, so it holds codes and never an engine's own words.
   */
  readonly detail?: string;
  /** The data of an "ok" result: valid by the quantity's schema, with arrays that decode. */
  readonly data?: JsonObject;
}

/** What a participant that did not answer is called in a reason. */
function describe(participant: ParticipantResult): string {
  const { engine, status, detail } = participant;
  const said = detail === undefined ? "" : ` (${detail})`;
  if (status === "unsupported") return `${engine} is unsupported${said}`;
  if (status === "error") return `${engine} ended as error${said}`;
  if (status === "pending") return `${engine} is pending${said}`;
  return `${engine} has no result${said}`;
}

/** A metric as it is stored: a value that is not finite becomes null. */
function stored(metric: ComputedMetric, unit: string): ComparisonMetric {
  const { name, value, where } = metric;
  return { name, value: Number.isFinite(value) ? value : null, unit, ...(where === undefined ? {} : { where }) };
}

/**
 * Compares two participants of one request and judges the outcome by the policy of the rung. The rules, in order:
 *
 * 1. either side "unsupported": `UNSUPPORTED`, and the reason names each such side with its items;
 * 2. either side "error", "pending" or "missing": `ERROR`, and the reason names each such side with its code;
 * 3. no comparator for the quantity, or the comparator finds the two answers not comparable: `ERROR`, with why;
 * 4. a metric the policy names that the comparator did not report: `ERROR`. That is a defect of one of the two;
 * 5. a gated rung: `PASS` when every metric the policy names is at or below its tolerance, else `FAIL` with a
 *    reason that names each metric above it, its value and where it occurs. A metric that is not a number is not
 *    at or below anything, so a NaN fails, and so does an infinity;
 * 6. a recorded rung: `RECORDED`, or `ATTENTION` when a metric is above the attention band the policy gives it,
 *    or has a band and is not a number. A metric without a band is only written down.
 *
 * The pair's metrics are the comparator's, in its order and its units, with null for a value that is not finite;
 * they are empty wherever nothing was measured. A pure function: equal arguments give an equal pair. Throws for a
 * gated metric without a tolerance, which `policyProblems` reports, and whatever the comparator throws.
 */
export function comparePair(
  a: ParticipantResult,
  b: ParticipantResult,
  policy: RungPolicy,
  comparator: QuantityComparator | undefined,
): PairComparison {
  const ended = (verdict: PairComparison["verdict"], reason: string): PairComparison => {
    return { a: a.engine, b: b.engine, metrics: [], class: policy.class, verdict, reason };
  };
  const sides = [a, b];
  const unsupported = sides.filter((side) => side.status === "unsupported");
  if (unsupported.length > 0) return ended("UNSUPPORTED", unsupported.map(describe).join("; "));
  const absent = sides.filter((side) => side.status !== "ok" || side.data === undefined);
  if (absent.length > 0) return ended("ERROR", absent.map(describe).join("; "));
  if (comparator === undefined) return ended("ERROR", `quantity ${policy.quantity} has no comparator`);

  const outcome = comparator.compare(a.data as JsonObject, b.data as JsonObject);
  if (!outcome.comparable) return ended("ERROR", outcome.reason);
  const names = Object.keys(policy.metrics).sort();
  const unreported = names.filter((name) => !outcome.metrics.some((metric) => metric.name === name));
  if (unreported.length > 0) {
    return ended("ERROR", `the comparator of ${comparator.quantity} reported no ${unreported.join(", ")}`);
  }

  const gated = policy.class === "gated";
  const beyond: string[] = [];
  for (const name of names) {
    const limit = gated ? policy.metrics[name].tolerance : policy.metrics[name].attention;
    if (limit === undefined) {
      if (gated) throw new Error(`policy: metric ${name} is gated and has no tolerance`);
      continue;
    }
    // Every metric of that name is judged, should a comparator report one more than once.
    for (const metric of outcome.metrics.filter((candidate) => candidate.name === name)) {
      if (metric.value <= limit) continue;
      const what = gated ? "exceeds its tolerance" : "is outside its attention band";
      const said = Number.isNaN(metric.value)
        ? `${name} is NaN`
        : `${name} ${formatSci(metric.value, METRIC_DIGITS)} ${what} ${formatSci(limit, METRIC_DIGITS)}`;
      beyond.push(`${said}${whereText(metric.where)}`);
    }
  }
  const units = new Map(comparator.metrics.map((declared) => [declared.name, declared.unit]));
  const metrics = outcome.metrics.map((metric) => stored(metric, units.get(metric.name) ?? "1"));
  const verdict = gated ? (beyond.length > 0 ? "FAIL" : "PASS") : beyond.length > 0 ? "ATTENTION" : "RECORDED";
  return {
    a: a.engine,
    b: b.engine,
    metrics,
    class: policy.class,
    verdict,
    ...(beyond.length > 0 ? { reason: beyond.join("; ") } : {}),
  };
}
