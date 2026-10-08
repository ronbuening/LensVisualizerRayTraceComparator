// The floor rule: a pair of the engine with a known numerical floor that is above a tolerance is not a failure when
// the rung's arbiter shows the excess to be that floor. An arbiter that agrees with every other engine to rounding
// is right about the rays; the engine it then finds a little way off is off by its own arithmetic, and by no more
// than the limit the policy allows a floor.
import type { ComparisonMetric, PairComparison } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import type { RungPolicy } from "../contract/policy.ts";
import type { ComparisonContext, QuantityComparator } from "./comparator.ts";
import { numberText } from "./metricText.ts";
import type { ParticipantResult } from "./pair.ts";

/** What `attributeFloor` reads beside the pair. */
export interface FloorInputs {
  /** Every engine of the comparison, in any order: the pair's two among them. */
  readonly participants: readonly ParticipantResult[];
  /** The policy of the rung. */
  readonly policy: RungPolicy;
  /** The comparator the pair was measured by. */
  readonly comparator: QuantityComparator | undefined;
  readonly context?: ComparisonContext;
}

/** A metric's value between two answers by name; null for a value that is not finite or was not measured. */
type Measured = ReadonlyMap<string, number | null>;

function measuredOf(metrics: readonly Pick<ComparisonMetric, "name" | "value">[]): Measured {
  // The largest of a metric that is reported more than once; one that is not a number stays not a number.
  const byName = new Map<string, number | null>();
  for (const { name, value } of metrics) {
    const known = byName.get(name);
    if (!byName.has(name)) byName.set(name, value);
    else if (known !== null && known !== undefined) byName.set(name, value === null ? null : Math.max(known, value));
  }
  return byName;
}

/** The metrics between two participants that answered, or null when the two cannot be measured. */
function measure(a: ParticipantResult, b: ParticipantResult, inputs: FloorInputs): Measured | null {
  const outcome = inputs.comparator?.compare(a.data as JsonObject, b.data as JsonObject, inputs.context);
  if (outcome === undefined || !outcome.comparable) return null;
  return measuredOf(outcome.metrics.map(({ name, value }) => ({ name, value: Number.isFinite(value) ? value : null })));
}

/**
 * Decides whether a pair that came to `FAIL` is the numerical floor of the rung's floored engine, and returns it
 * as `FLOOR` when it is. Any other pair, and a pair of a rung without a floor, comes back as it is.
 *
 * With `floor.engine` the engine that has the floor and `floor.arbiter` the engine the others are held to, a pair
 * is `FLOOR` when all of these hold:
 *
 * 1. the pair is of `floor.engine`, and every metric of it that is above its tolerance is a number and has floor
 *    limits in the policy: a count of mask mismatches has none, so it always fails;
 * 2. the arbiter answered, and every other engine of the comparison that answered is within `agreement` of it in
 *    each metric that has floor limits. The pair's other engine is one of them, unless it is the arbiter itself;
 * 3. `floor.engine` is within `limit` of the arbiter in each metric that has floor limits.
 *
 * A metric that two answers have nothing to measure on is no part of 2 or 3. The reason of a `FLOOR` keeps what
 * exceeded which tolerance and adds the figures against the arbiter; the reason of a pair that stays `FAIL` adds
 * which of the conditions did not hold. A pure function: equal arguments give an equal pair.
 */
export function attributeFloor(pair: PairComparison, inputs: FloorInputs): PairComparison {
  const { policy, participants } = inputs;
  const { floor } = policy;
  if (floor === undefined || pair.verdict !== "FAIL" || policy.class !== "gated") return pair;
  if (pair.a !== floor.engine && pair.b !== floor.engine) return pair;
  const stays = (why: string): PairComparison => ({
    ...pair,
    reason: `${pair.reason ?? ""}; not a floor of ${floor.engine}: ${why}`,
  });

  const floored = Object.keys(policy.metrics)
    .sort()
    .filter((name) => policy.metrics[name].floor !== undefined);
  const own = measuredOf(pair.metrics);
  for (const name of Object.keys(policy.metrics).sort()) {
    const { tolerance } = policy.metrics[name];
    const value = own.get(name);
    if (value === undefined || tolerance === undefined || (value !== null && value <= tolerance)) continue;
    if (value === null) return stays(`${name} is not a number`);
    if (!floored.includes(name)) return stays(`${name} has no floor`);
  }

  const answered = (engine: string): ParticipantResult | undefined =>
    participants.find(
      (participant) => participant.engine === engine && participant.status === "ok" && participant.data,
    );
  const arbiter = answered(floor.arbiter);
  const engine = answered(floor.engine);
  if (arbiter === undefined || engine === undefined) return stays(`the arbiter ${floor.arbiter} has no answer`);

  const figures: string[] = [];
  const others = participants
    .filter(({ engine: id, status, data }) => id !== floor.engine && id !== floor.arbiter && status === "ok" && data)
    .sort((a, b) => (a.engine < b.engine ? -1 : a.engine > b.engine ? 1 : 0));
  for (const other of others) {
    const against = measure(other, arbiter, inputs);
    if (against === null) return stays(`${other.engine} cannot be compared with ${floor.arbiter}`);
    for (const name of floored) {
      const value = against.get(name);
      const { agreement } = policy.metrics[name].floor as { agreement: number };
      if (value === undefined) continue;
      if (value === null || !(value <= agreement)) {
        const said = value === null ? "not a number" : numberText(value);
        return stays(
          `${other.engine} does not agree with ${floor.arbiter}: ${name} ${said} exceeds ${numberText(agreement)}`,
        );
      }
      figures.push(
        `${other.engine} against ${floor.arbiter} ${name} ${numberText(value)} within ${numberText(agreement)}`,
      );
    }
  }

  // The pair itself is the floored engine against the arbiter when the arbiter is its other engine.
  const direct = pair.a === floor.arbiter || pair.b === floor.arbiter;
  const against = direct ? own : measure(engine, arbiter, inputs);
  if (against === null) return stays(`${floor.engine} cannot be compared with ${floor.arbiter}`);
  for (const name of floored) {
    const value = against.get(name);
    const { limit } = policy.metrics[name].floor as { limit: number };
    if (value === undefined) continue;
    if (value === null || !(value <= limit)) {
      const said = value === null ? "not a number" : numberText(value);
      return stays(`${name} against ${floor.arbiter} ${said} exceeds the floor limit ${numberText(limit)}`);
    }
    figures.push(`${floor.engine} against ${floor.arbiter} ${name} ${numberText(value)} within ${numberText(limit)}`);
  }
  return { ...pair, verdict: "FLOOR", reason: `${pair.reason ?? ""}; floor of ${floor.engine}: ${figures.join(", ")}` };
}
