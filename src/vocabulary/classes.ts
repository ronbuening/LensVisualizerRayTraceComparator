// How a side-by-side comparison sorts a difference before it shows it, and what became of one row of an MTF
// comparison, in plain words. The stored values do not change: `NativeDifferenceClass` of `src/compare/mtfNative.ts`
// and the row statuses of `src/report/wording.ts`.

/** The label and the meaning of one class or status. */
export interface ClassText {
  readonly label: string;
  readonly meaning: string;
}

/** The classes of a difference, in the order they are decided. */
export const DIFFERENCE_CLASSES = ["unsupported", "data", "convention", "numerical", "method"] as const;

/** Every class of a difference. */
export const CLASS_TEXT: { readonly [kind in (typeof DIFFERENCE_CLASSES)[number]]: ClassText } = {
  unsupported: {
    label: "not computed by one engine",
    meaning: "One engine has no answer, so there is no difference to show.",
  },
  data: {
    label: "the inputs differ",
    meaning:
      "The two answers are not of the same input (another field point or other wavelengths), so no difference is shown.",
  },
  convention: {
    label: "a convention differs",
    meaning: "A declared transform between the two engines' conventions is missing.",
  },
  numerical: {
    label: "not converged",
    meaning:
      "An engine says that its own sampling did not settle (in the Zernike comparison: the fit is ill-conditioned); the difference is shown apart, in no review band.",
  },
  method: {
    label: "the methods differ",
    meaning:
      "Two methods, each standing by its own answer; the difference is held to the review band, if there is one.",
  },
};

/** What became of one row of an MTF comparison (`MTF_ROW_STATUSES`). */
export const ROW_STATUSES = ["RECORDED", "ATTENTION", "SET ASIDE", "UNSUPPORTED", "ERROR"] as const;

/** Every row status. */
export const ROW_STATUS_TEXT: { readonly [status in (typeof ROW_STATUSES)[number]]: ClassText } = {
  RECORDED: {
    label: "Side by side",
    meaning: "The difference is inside the review band and was written down.",
  },
  ATTENTION: {
    label: "Side by side, worth a look",
    meaning: "The difference is outside the review band: worth a look, and not a failure.",
  },
  "SET ASIDE": {
    label: "Set aside",
    meaning: "The row is in no review band, and its class and reason say why.",
  },
  UNSUPPORTED: {
    label: "Not computed",
    meaning: "An engine has no curve of the field, so there is no difference.",
  },
  ERROR: {
    label: "Error",
    meaning: "An engine gave no result, or the two results cannot be set against each other.",
  },
};

/** The label of a class of a difference; anything else is returned unchanged. */
export function classLabel(kind: string): string {
  return Object.hasOwn(CLASS_TEXT, kind) ? CLASS_TEXT[kind as keyof typeof CLASS_TEXT].label : kind;
}

/** The label of a row status; anything else is returned unchanged. */
export function rowStatusLabel(status: string): string {
  return Object.hasOwn(ROW_STATUS_TEXT, status)
    ? ROW_STATUS_TEXT[status as keyof typeof ROW_STATUS_TEXT].label
    : status;
}
