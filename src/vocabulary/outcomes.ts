// What a baseline check found of a record, why a record is out of date, and the dashboard's badges, in plain words.
// The stored values (`CHECK_OUTCOMES`, `STALE_REASONS` in `src/baseline/check.ts`; the badges of
// `src/dashboard/staleness.ts`) do not change.

/** The label and the meaning of one outcome, reason or badge. */
export interface OutcomeText {
  readonly label: string;
  readonly meaning: string;
}

/** What `lvrtc baseline check` found of each record, in the order of `CHECK_OUTCOMES`. */
export const OUTCOME_TEXT: Readonly<Record<string, OutcomeText>> = {
  OK: {
    label: "Unchanged",
    meaning:
      "The record's lens state, engines and limits are the baseline's; no verdict changed and no judged figure moved by more than its limit.",
  },
  REFRESHABLE: {
    label: "Out of date, still within limits",
    meaning:
      "Something the record depends on has changed; when run again, its verdicts are the same and no judged figure moved by more than its limit, so the baseline can be written anew.",
  },
  MOVED: {
    label: "Side-by-side figure moved",
    meaning:
      "In a side-by-side comparison a verdict changed, or a figure moved by more than its review band. It fails nothing.",
  },
  DRIFT: {
    label: "Changed beyond limits",
    meaning: "In a check held to a limit a verdict changed, or a judged figure moved by more than its limit.",
  },
  NEW: {
    label: "New",
    meaning: "The suite as it runs today has a record that the baseline lacks.",
  },
  GONE: {
    label: "No longer run",
    meaning: "The baseline has a record that the suite as it runs today lacks.",
  },
};

/** Why a record is out of date, in the order of `STALE_REASONS`: the words after "Out of date:". */
export const STALE_REASON_TEXT: Readonly<Record<string, OutcomeText>> = {
  case: {
    label: "lens data",
    meaning: "The lens state the record was made from is not the one LensVisualizer exports today.",
  },
  engine: {
    label: "engine code",
    meaning: "The code of an engine, or this tool's code behind it, is not what it was when the record was written.",
  },
  policy: {
    label: "limits",
    meaning: "The limits file is not the one the record was judged by.",
  },
};

/** The dashboard's badges of a baseline record. */
export const BADGE_TEXT: Readonly<Record<string, OutcomeText>> = {
  STALE: {
    label: "Out of date",
    meaning: "Something the record depends on has changed since it was written; the badge names what.",
  },
  CURRENT: {
    label: "Up to date",
    meaning: "Every reason a record could be out of date is known, and none holds.",
  },
  "NOT KNOWN": {
    label: "Unknown",
    meaning: "Whether the record is out of date could not be judged; the badge names what is not known.",
  },
};

/** The label of an outcome; anything else is returned unchanged. */
export function outcomeLabel(outcome: string): string {
  return OUTCOME_TEXT[outcome]?.label ?? outcome;
}

/** The words of a list of reasons, as `lens data, engine code`; a reason with no words is given as it is. */
function reasonsText(reasons: readonly string[]): string {
  return reasons.map((reason) => STALE_REASON_TEXT[reason]?.label ?? reason).join(", ");
}

/** "Out of date: lens data, engine code changed", for the reasons that hold of a record. */
export function staleText(reasons: readonly string[]): string {
  return `${BADGE_TEXT.STALE.label}: ${reasonsText(reasons)} changed`;
}

/**
 * The label of a dashboard badge from the reasons that hold and those not known: out of date where any holds, else
 * unknown where any is not known (naming them), else up to date.
 */
export function badgeLabel(stale: readonly string[], notKnown: readonly string[]): string {
  if (stale.length > 0) return staleText(stale);
  if (notKnown.length > 0) return `${BADGE_TEXT["NOT KNOWN"].label}: ${reasonsText(notKnown)}`;
  return BADGE_TEXT.CURRENT.label;
}
