// The comparison policy: mirrors contract/schema/v1/policy.schema.json, plus the rules a schema cannot state.

/**
 * How the engines of a rung are compared: `direct`, closed-form numbers set against each other; `identical-rays`,
 * one estimator applied to every engine's trace of the same rays; `independent-method`, each engine's own sampling
 * and algorithm.
 */
export const RUNG_MODES = ["direct", "identical-rays", "independent-method"] as const;
/** One way the engines of a rung are compared. */
export type RungMode = (typeof RUNG_MODES)[number];

/** What a difference means: `gated` passes or fails against a tolerance; `recorded` is written down and never fails. */
export const RUNG_CLASSES = ["gated", "recorded"] as const;
/** Whether a rung is gated or recorded. */
export type RungClass = (typeof RUNG_CLASSES)[number];

/**
 * The limits by which a metric above its tolerance is still the numerical floor of the rung's floored engine. Both
 * are in the metric's unit.
 */
export interface MetricFloor {
  /** The largest value the metric may have between the floored engine and the arbiter. */
  readonly limit: number;
  /** The largest value it may have between any other engine of the comparison and the arbiter. */
  readonly agreement: number;
}

/** The limits of one metric and the unit its values and limits are in. */
export interface MetricPolicy {
  /** The largest value the metric may have and pass, when the rung is gated. */
  readonly tolerance?: number;
  /** The largest value the metric may have without being marked for attention, when the rung is recorded. */
  readonly attention?: number;
  /** The unit, such as `mm` or `waves`; `1` for a number without one. */
  readonly unit: string;
  /** The floor limits of the metric, in a rung that has a floor. A metric without them is never a floor. */
  readonly floor?: MetricFloor;
}

/**
 * The floor of a rung: the engine whose known numerical floor may exceed a tolerance without failing, and the
 * engine whose answer decides whether an excess is that floor.
 */
export interface RungFloor {
  /** The engine with the floor: only a pair it is in can come to `FLOOR`. */
  readonly engine: string;
  /** The engine the others are held to. */
  readonly arbiter: string;
}

/** How one rung is judged. */
export interface RungPolicy {
  /** The quantity whose results the rung compares. */
  readonly quantity: string;
  readonly mode: RungMode;
  readonly class: RungClass;
  /** The metrics that are judged, by name. A metric the comparison reports and the policy does not name is not. */
  readonly metrics: { readonly [name: string]: MetricPolicy };
  /**
   * True: two engines whose pair in this rung is `FAIL` or `ERROR` are not judged against each other in any later
   * rung of the ladder for the same case; their pairs there are `BLOCKED`. For a rung that establishes what the
   * later ones take for granted, as the built system is for every ray traced through it.
   */
  readonly blocksLaterRungs?: boolean;
  /**
   * The floor of the rung, for one whose metrics have floor limits: a pair of `floor.engine` that is above a
   * tolerance is `FLOOR`, not `FAIL`, when every metric above its tolerance has floor limits, every other engine
   * of the comparison is within `agreement` of `floor.arbiter` in each metric that has them, and `floor.engine` is
   * within `limit` of it.
   */
  readonly floor?: RungFloor;
}

/** The policy: how every rung is judged. */
export interface Policy {
  readonly contract: string;
  readonly kind: "policy";
  /** An integer from 1 that rises whenever a rung, a class or a limit changes. */
  readonly version: number;
  readonly rungs: { readonly [rung: string]: RungPolicy };
}

/**
 * The rules of a policy that its schema cannot state, as a list of what is broken (empty when nothing is), in the
 * order of the rung ids and then of the metric names:
 *
 * - a rung of mode `independent-method` is never gated: two methods that differ are not one of them failing;
 * - a gated rung judges at least one metric, or it would pass whatever the engines answered;
 * - every metric of a gated rung has a tolerance;
 * - a rung that blocks later rungs is gated: a recorded rung never fails, so it has nothing to block with;
 * - a floor belongs to a gated rung, names two different engines and has a metric with floor limits to apply to;
 * - floor limits belong to a metric of a rung with a floor, and enclose its tolerance: `agreement` is at most the
 *   tolerance and `limit` at least, or the floor would be a second, looser or tighter, gate.
 *
 * The policy is expected to be schema-valid.
 */
export function policyProblems(policy: Policy): string[] {
  const problems: string[] = [];
  for (const rung of Object.keys(policy.rungs).sort()) {
    const { mode, class: rungClass, metrics, blocksLaterRungs, floor } = policy.rungs[rung];
    const names = Object.keys(metrics).sort();
    const floored = names.filter((name) => metrics[name].floor !== undefined);
    if (rungClass !== "gated") {
      if (blocksLaterRungs === true) problems.push(`rung ${rung}: a recorded rung cannot block later rungs`);
      if (floor !== undefined || floored.length > 0) problems.push(`rung ${rung}: a recorded rung has no floor`);
      continue;
    }
    if (mode === "independent-method") problems.push(`rung ${rung}: an independent-method rung cannot be gated`);
    if (names.length === 0) problems.push(`rung ${rung}: a gated rung needs at least one metric`);
    if (floor !== undefined && floor.engine === floor.arbiter) {
      problems.push(`rung ${rung}: the floor's engine ${floor.engine} is its own arbiter`);
    }
    if (floor !== undefined && floored.length === 0) {
      problems.push(`rung ${rung}: it has a floor and no metric with floor limits`);
    }
    for (const name of names) {
      const { tolerance, floor: limits } = metrics[name];
      if (tolerance === undefined) problems.push(`rung ${rung}: metric ${name} is gated and has no tolerance`);
      if (limits === undefined) continue;
      if (floor === undefined) problems.push(`rung ${rung}: metric ${name} has floor limits and the rung no floor`);
      if (tolerance !== undefined && !(limits.agreement <= tolerance && tolerance <= limits.limit)) {
        problems.push(`rung ${rung}: the floor limits of metric ${name} do not enclose its tolerance`);
      }
    }
  }
  return problems;
}
