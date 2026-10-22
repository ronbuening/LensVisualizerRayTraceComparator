// The follow-ups of the comparison ladder: where a run asks an engine a request a second time because of what the
// first answers came to. There are two, of one kind: a row of rung R5 or of rung R5g that is outside its band asks
// optiland for its finer step.
import type { Policy } from "../contract/policy.ts";
import type { JsonObject } from "../contract/json.ts";
import type { FollowUp } from "../core/orchestrator.ts";
import {
  GEOMETRIC_MTF_RUNG,
  NATIVE_MTF_RUNG,
  OFF_AXIS_METRIC,
  ON_AXIS_METRIC,
  nativeMtfComparator,
} from "./mtfNative.ts";
import type { NativeMtfRung } from "./mtfNative.ts";
import type { MtfNativeData } from "../contract/quantities/mtfNative.ts";

/** The two engines whose pair decides the follow-up of R5 and of R5g: LensVisualizer, and the engine asked again. */
export const R5_FOLLOW_UP_PAIR = ["lv", "optiland"] as const;
/** The name of the second job of R5, and the option it is asked with: optiland's ladder of 256 and 512 rays. */
export const R5_FOLLOW_UP_STEP = "fft512";
export const R5_FOLLOW_UP_OPTIONS = Object.freeze({ fftRays: 512 });
/** The same of R5g: optiland's geometric MTF on its ladder of 256 and 512 rays. */
export const R5G_FOLLOW_UP_STEP = "geo512";
export const R5G_FOLLOW_UP_OPTIONS = Object.freeze({ geometricRays: 512 });

/** The second job of each rung of the engines' own MTF, in ladder order. */
const FINER_STEPS: readonly {
  readonly rung: NativeMtfRung;
  readonly step: string;
  readonly options: JsonObject;
  /** True for a step that is asked only of an answer of one line. */
  readonly oneLineOnly: boolean;
}[] = [
  { rung: NATIVE_MTF_RUNG, step: R5_FOLLOW_UP_STEP, options: R5_FOLLOW_UP_OPTIONS, oneLineOnly: false },
  { rung: GEOMETRIC_MTF_RUNG, step: R5G_FOLLOW_UP_STEP, options: R5G_FOLLOW_UP_OPTIONS, oneLineOnly: true },
];

/**
 * The follow-ups a run is given, for the policy its comparison will be judged by.
 *
 * Rung R5: optiland's FFT MTF at 512 rays across the pupil costs several times its ladder of 128 and 256, so it is
 * asked only where it can say something: where LensVisualizer's MTF and optiland's, compared as the rung compares
 * them, have a figure outside its band in the policy (`mtfOnAxis.maxAbs`, `mtfOffAxis.maxAbs`). The request is then
 * asked of optiland once more, for all its fields, with `fftRays: 512`, and the comparison judges the pair by that
 * answer and states both. A chief ray that lands elsewhere asks for nothing: no sampling brings two fields together.
 *
 * Rung R5g: the same of optiland's geometric MTF, asked once more with `geometricRays: 512`, request by request,
 * which in that rung is field by field, and only where optiland's answer is of one line: a line of a field of a
 * fast lens has been measured at 135 s on the finer ladder, an answer of several lines costs that for each, and a
 * worker that has not answered in ten minutes is ended (docs/gotchas.md). A field on several lines that is outside
 * its band is judged by its first answer.
 *
 * A policy without a rung gives no follow-up of it.
 */
export function followUpsOf(policy: Policy): FollowUp[] {
  const [first, asked] = R5_FOLLOW_UP_PAIR;
  return FINER_STEPS.filter(({ rung }) => Object.hasOwn(policy.rungs, rung)).map((finer) => {
    const { rung, step, options, oneLineOnly } = finer;
    const rungPolicy = policy.rungs[rung];
    const comparator = nativeMtfComparator(rung);
    return {
      rung,
      engine: asked,
      step,
      options,
      needed: (answers, { spec, opticalCase, recipe }) => {
        const [a, b] = [answers.get(first), answers.get(asked)];
        if (a === undefined || b === undefined) return false;
        if (oneLineOnly && (b as MtfNativeData).lines.length !== 1) return false;
        const context = { spec, opticalCase, policy: rungPolicy, ...(recipe === null ? {} : { recipe }) };
        const outcome = comparator.compare(a, b, context);
        if (!outcome.comparable) return false;
        return [ON_AXIS_METRIC, OFF_AXIS_METRIC].some((name) => {
          const band = rungPolicy.metrics[name]?.attention;
          return (
            band !== undefined && outcome.metrics.some((metric) => metric.name === name && !(metric.value <= band))
          );
        });
      },
    };
  });
}
