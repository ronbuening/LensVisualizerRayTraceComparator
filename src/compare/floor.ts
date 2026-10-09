// The floor rule: a pair of the engine with a known numerical floor that is above a tolerance is not a failure when
// the rung's arbiter shows the excess to be that floor: the engine is within the limit the policy allows a floor of
// the arbiter. Every other engine of the comparison is a witness. One that agrees with the arbiter corroborates
// it; one that does not is named, and withholds nothing: its own distance from the arbiter is its own. Only a
// witness that is nearer to the floored engine than to the arbiter makes the arbiter suspect, and the pair fails.
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
 * With `floor.engine` the engine that has the floor and `floor.arbiter` the engine it is held to, a pair is
 * `FLOOR` when all of these hold:
 *
 * 1. the pair is of `floor.engine`, and every metric of it that is above its tolerance is a number and has floor
 *    limits in the policy: a count of mask mismatches has none, so it always fails;
 * 2. the arbiter answered, and `floor.engine` is within `limit` of it in each metric that has floor limits;
 * 3. no witness sides with `floor.engine` against the arbiter. A witness is every other engine of the comparison
 *    that answered; the pair's other engine is one, unless it is the arbiter itself. In each metric that has floor
 *    limits a witness within `agreement` of the arbiter corroborates it. One that is not within `agreement`, or
 *    cannot be measured against the arbiter, does not corroborate: the pair is still `FLOOR`, and its reason says
 *    so with the witness's own distance from the arbiter. One that is not within `agreement` and is nearer to
 *    `floor.engine` than to the arbiter in that metric sides with `floor.engine`: the arbiter is suspect, and the
 *    pair stays `FAIL` with a reason that says "arbiter-suspect";
 * 4. in the pair of `floor.engine` with a witness, no metric above its tolerance has the witness as far from the
 *    arbiter as `floor.engine` is, or farther: there the excess is the witness's own, and no floor of anybody.
 *
 * A metric that two answers have nothing to measure on is no part of 2, 3 or 4. The reason of a `FLOOR` keeps what
 * exceeded which tolerance and adds the figures against the arbiter, then each witness that did not corroborate;
 * the reason of a pair that stays `FAIL` adds which of the conditions did not hold. A pure function: equal
 * arguments give an equal pair.
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
  const exceeded: string[] = [];
  for (const name of Object.keys(policy.metrics).sort()) {
    const { tolerance } = policy.metrics[name];
    const value = own.get(name);
    if (value === undefined || tolerance === undefined || (value !== null && value <= tolerance)) continue;
    if (value === null) return stays(`${name} is not a number`);
    if (!floored.includes(name)) return stays(`${name} has no floor`);
    exceeded.push(name);
  }

  const answered = (engine: string): ParticipantResult | undefined =>
    participants.find(
      (participant) => participant.engine === engine && participant.status === "ok" && participant.data,
    );
  const arbiter = answered(floor.arbiter);
  const engine = answered(floor.engine);
  if (arbiter === undefined || engine === undefined) return stays(`the arbiter ${floor.arbiter} has no answer`);

  // The floored engine against the arbiter: the pair itself when the arbiter is its other engine.
  const direct = pair.a === floor.arbiter || pair.b === floor.arbiter;
  const against = direct ? own : measure(engine, arbiter, inputs);
  if (against === null) return stays(`${floor.engine} cannot be compared with ${floor.arbiter}`);
  const ownFigures: string[] = [];
  for (const name of floored) {
    const value = against.get(name);
    const { limit } = policy.metrics[name].floor as { limit: number };
    if (value === undefined) continue;
    if (value === null || !(value <= limit)) {
      const said = value === null ? "not a number" : numberText(value);
      return stays(`${name} against ${floor.arbiter} ${said} exceeds the floor limit ${numberText(limit)}`);
    }
    ownFigures.push(
      `${floor.engine} against ${floor.arbiter} ${name} ${numberText(value)} within ${numberText(limit)}`,
    );
  }

  const figures: string[] = [];
  const uncorroborated: string[] = [];
  const witnesses = participants
    .filter(({ engine: id, status, data }) => id !== floor.engine && id !== floor.arbiter && status === "ok" && data)
    .sort((a, b) => (a.engine < b.engine ? -1 : a.engine > b.engine ? 1 : 0));
  for (const witness of witnesses) {
    const toArbiter = measure(witness, arbiter, inputs);
    if (toArbiter === null) {
      uncorroborated.push(`${witness.engine} cannot be compared with ${floor.arbiter}`);
      continue;
    }
    // Measured only for a witness that is off the arbiter: which of the two it is nearer to.
    let toEngine: Measured | null | undefined;
    for (const name of floored) {
      const value = toArbiter.get(name);
      const { agreement } = policy.metrics[name].floor as { agreement: number };
      if (value === undefined) continue;
      if (value !== null && value <= agreement) {
        figures.push(
          `${witness.engine} against ${floor.arbiter} ${name} ${numberText(value)} within ${numberText(agreement)}`,
        );
        continue;
      }
      if (value === null) {
        uncorroborated.push(`${witness.engine} against ${floor.arbiter} ${name} is not a number`);
        continue;
      }
      toEngine ??= measure(witness, engine, inputs);
      const near = toEngine?.get(name);
      if (typeof near === "number" && near < value) {
        return stays(
          `arbiter-suspect: the witness ${witness.engine} sides with ${floor.engine} against ${floor.arbiter}: ` +
            `${name} ${numberText(near)} against ${floor.engine}, ${numberText(value)} against ${floor.arbiter}`,
        );
      }
      // The pair of the floored engine with this witness: what is above the gate there is the floor of the one
      // only where the other is the nearer to the arbiter.
      const ownValue = against.get(name);
      if ((witness.engine === pair.a || witness.engine === pair.b) && exceeded.includes(name)) {
        if (typeof ownValue !== "number" || value >= ownValue) {
          return stays(
            `the excess is of ${witness.engine}: ${name} ${numberText(value)} against ${floor.arbiter}, ` +
              `${floor.engine} ${typeof ownValue === "number" ? numberText(ownValue) : "not measured"}`,
          );
        }
      }
      uncorroborated.push(
        `${witness.engine} against ${floor.arbiter} ${name} ${numberText(value)} exceeds ${numberText(agreement)}`,
      );
    }
  }
  const witnessed =
    uncorroborated.length === 0 ? "" : `; the witness did not corroborate: ${uncorroborated.join(", ")}`;
  return {
    ...pair,
    verdict: "FLOOR",
    reason: `${pair.reason ?? ""}; floor of ${floor.engine}: ${[...figures, ...ownFigures].join(", ")}${witnessed}`,
  };
}
