// The verdicts of a pair, in plain words. The stored values (`src/contract/comparison.ts`) do not change; screens and
// reports show the label, with the meaning in a legend.
import type { Verdict } from "../contract/comparison.ts";

/** The label and the meaning of one verdict. */
export interface VerdictText {
  readonly label: string;
  readonly meaning: string;
}

/** Every verdict, in the order of `VERDICTS`. */
export const VERDICT_TEXT: { readonly [verdict in Verdict]: VerdictText } = {
  PASS: {
    label: "Pass: within limit",
    meaning: "A check held to a limit: every judged figure is at or below its limit.",
  },
  FLOOR: {
    label: "Within a known numerical floor",
    meaning:
      "A check held to a limit: a judged figure is above its limit by a known numerical floor of one of the two engines, which a limits file may grant. It counts as a pass and is counted apart.",
  },
  FAIL: {
    label: "Fail: beyond limit",
    meaning: "A check held to a limit: a judged figure is above its limit, or is not a number.",
  },
  RECORDED: {
    label: "Side by side",
    meaning:
      "A side-by-side comparison with no limit: the difference is written down, inside its review band or with none. It is not a failure.",
  },
  ATTENTION: {
    label: "Side by side, worth a look",
    meaning: "A side-by-side comparison with no limit: a figure is outside its review band. It is not a failure.",
  },
  UNSUPPORTED: {
    label: "Not computed",
    meaning: "One of the two engines cannot compute what was asked. That is an answer, not a failure.",
  },
  BLOCKED: {
    label: "Not judged (an earlier check failed)",
    meaning:
      "The pair is not judged, whether or not both engines answered: an earlier check that this one rests on failed or ended in an error for the same two engines and the same lens state.",
  },
  ERROR: {
    label: "Error",
    meaning: "One of the two engines gave no result, or the two results cannot be compared.",
  },
};

/** The label of a verdict; anything else is returned unchanged. */
export function verdictLabel(verdict: string): string {
  return Object.hasOwn(VERDICT_TEXT, verdict) ? VERDICT_TEXT[verdict as Verdict].label : verdict;
}
