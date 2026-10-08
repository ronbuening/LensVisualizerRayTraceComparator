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

/** The limits of one metric and the unit its values and limits are in. */
export interface MetricPolicy {
  /** The largest value the metric may have and pass, when the rung is gated. */
  readonly tolerance?: number;
  /** The largest value the metric may have without being marked for attention, when the rung is recorded. */
  readonly attention?: number;
  /** The unit, such as `mm` or `waves`; `1` for a number without one. */
  readonly unit: string;
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
 * - a rung that blocks later rungs is gated: a recorded rung never fails, so it has nothing to block with.
 *
 * The policy is expected to be schema-valid.
 */
export function policyProblems(policy: Policy): string[] {
  const problems: string[] = [];
  for (const rung of Object.keys(policy.rungs).sort()) {
    const { mode, class: rungClass, metrics, blocksLaterRungs } = policy.rungs[rung];
    if (rungClass !== "gated") {
      if (blocksLaterRungs === true) problems.push(`rung ${rung}: a recorded rung cannot block later rungs`);
      continue;
    }
    if (mode === "independent-method") problems.push(`rung ${rung}: an independent-method rung cannot be gated`);
    const names = Object.keys(metrics).sort();
    if (names.length === 0) problems.push(`rung ${rung}: a gated rung needs at least one metric`);
    for (const name of names) {
      if (metrics[name].tolerance === undefined) {
        problems.push(`rung ${rung}: metric ${name} is gated and has no tolerance`);
      }
    }
  }
  return problems;
}
