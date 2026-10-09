// The follow-ups of the comparison ladder: where a run asks an engine a request a second time because of what the
// first answers came to. There is one: a row of rung R5 that is outside its band asks optiland for its finer step.
import type { Policy } from "../contract/policy.ts";
import type { FollowUp } from "../core/orchestrator.ts";
import { NATIVE_MTF_RUNG, OFF_AXIS_METRIC, ON_AXIS_METRIC, mtfNativeComparator } from "./mtfNative.ts";

/** The two engines whose pair decides the follow-up of R5: LensVisualizer, and the engine that is asked again. */
export const R5_FOLLOW_UP_PAIR = ["lv", "optiland"] as const;
/** The name of the second job, and the option it is asked with: optiland's ladder of 256 and 512 rays. */
export const R5_FOLLOW_UP_STEP = "fft512";
export const R5_FOLLOW_UP_OPTIONS = Object.freeze({ fftRays: 512 });

/**
 * The follow-ups a run is given, for the policy its comparison will be judged by.
 *
 * Rung R5: optiland's FFT MTF at 512 rays across the pupil costs several times its ladder of 128 and 256, so it is
 * asked only where it can say something: where LensVisualizer's MTF and optiland's, compared as the rung compares
 * them, have a figure outside its band in the policy (`mtfOnAxis.maxAbs`, `mtfOffAxis.maxAbs`). The request is then
 * asked of optiland once more, for all its fields, with `fftRays: 512`, and the comparison judges the pair by that
 * answer and states both. A chief ray that lands elsewhere asks for nothing: no sampling brings two fields together.
 * A policy without the rung gives no follow-up.
 */
export function followUpsOf(policy: Policy): FollowUp[] {
  if (!Object.hasOwn(policy.rungs, NATIVE_MTF_RUNG)) return [];
  const rungPolicy = policy.rungs[NATIVE_MTF_RUNG];
  const [first, asked] = R5_FOLLOW_UP_PAIR;
  return [
    {
      rung: NATIVE_MTF_RUNG,
      engine: asked,
      step: R5_FOLLOW_UP_STEP,
      options: R5_FOLLOW_UP_OPTIONS,
      needed: (answers, { spec, opticalCase, recipe }) => {
        const [a, b] = [answers.get(first), answers.get(asked)];
        if (a === undefined || b === undefined) return false;
        const context = { spec, opticalCase, policy: rungPolicy, ...(recipe === null ? {} : { recipe }) };
        const outcome = mtfNativeComparator.compare(a, b, context);
        if (!outcome.comparable) return false;
        return [ON_AXIS_METRIC, OFF_AXIS_METRIC].some((name) => {
          const band = rungPolicy.metrics[name]?.attention;
          return (
            band !== undefined && outcome.metrics.some((metric) => metric.name === name && !(metric.value <= band))
          );
        });
      },
    },
  ];
}
