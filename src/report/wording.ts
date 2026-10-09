// The words of a report about a comparison of two methods. A recorded rung sets estimates side by side, and what
// may be said of it is narrow: every sentence a report writes about one is a template of this file, and a lint
// (`wordingProblems`) rejects the claims no recorded row supports, whoever writes them.
import type { NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";

/** What a row of an MTF comparison came to. */
export const MTF_ROW_STATUSES = ["RECORDED", "ATTENTION", "SET ASIDE", "UNSUPPORTED", "ERROR"] as const;
/** One of them. */
export type MtfRowStatus = (typeof MTF_ROW_STATUSES)[number];

/** What each status of a row says, for the legend under a table. */
export const MTF_ROW_STATUS_TEXT: { readonly [status in MtfRowStatus]: string } = {
  RECORDED: "the difference is inside the attention band and was written down",
  ATTENTION: "the difference is outside the attention band: worth a look, and not a failure",
  "SET ASIDE": "the row is in no band, and its class and reason say why",
  UNSUPPORTED: "an engine has no curve of the field, so there is no difference",
  ERROR: "an engine gave no result, or the two results cannot be set against each other",
};

/** What each class of a difference says. `convention` is a class of the ladder that this comparison never gives. */
export const DIFFERENCE_CLASS_TEXT: { readonly [kind in NativeDifferenceClass | "convention"]: string } = {
  unsupported: "an engine has no answer",
  data: "the two answers are not of the same input",
  convention: "a declared transform is missing; this comparison has none to miss and never gives the class",
  numerical: "an engine says that its own sampling did not settle",
  method: "two methods, each standing by its own curves",
};

/** What each reason of a field says. */
export const FIELD_REASON_TEXT: { readonly [reason in NativeFieldReason]: string } = {
  "no-curve": "an engine has no curve of the field",
  "lines-differ": "the two answers are of different lines; no difference is shown",
  "chief-landing-unknown": "an engine does not say where its chief ray lands; no difference is shown",
  "chief-landing-apart": "the chief rays land further apart than the limit: two image points; no difference is shown",
  unconverged: "a sampling did not settle; the difference is shown apart, in no band",
  "rim-rays-lost":
    "an engine calibrated a frequency axis with a rim ray that was lost; the difference is shown apart, in no band",
  "two-methods": "both engines stand by their curves; the difference is held to the attention band",
};

/** The sentences above the tables of an MTF comparison. */
export const MTF_COMPARISON_INTRO: readonly string[] = [
  "Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No",
  "column is a reference for another, and no difference in this table is held to a tolerance.",
];

/** The sentence under the table of rows. */
export const MTF_COMPARISON_OUTRO: readonly string[] = [
  "A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written",
  "down and says nothing more; a difference outside it is worth a look and fails nothing.",
];

/**
 * What a comparison of this tool does not show, whatever its verdicts: the block every report ends its results
 * with. The sentences are fixed; a report adds none and leaves none out.
 */
export const NOT_COVERED: readonly string[] = [
  "optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, " +
    "reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.",
  "The formation of a polychromatic MTF. optiland's FFT MTF is of one line and gives a modulus, so a run on " +
    "several lines has no optiland row; its external counterpart is the comparator's estimator on optiland's " +
    "wavefront, which is a later stage.",
  "Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer " +
    "states; no glass catalog and no spectrum is checked against another.",
  "The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine " +
    "searches for one of its own.",
  "The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.",
  "Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, " +
    "samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not " +
    "explained.",
  "Zoom positions between the two ends, and finite conjugates other than the states a run names.",
  "Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.",
];

/** One claim a report must not make, and how to tell it. */
export interface BannedClaim {
  /** A short name for the claim. */
  readonly name: string;
  /** Why no recorded row supports it. */
  readonly why: string;
  /** Whether one sentence, or one row of a table, makes the claim. */
  readonly matches: (sentence: string) => boolean;
}

const mentions =
  (...patterns: readonly RegExp[]) =>
  (sentence: string): boolean =>
    patterns.every((pattern) => pattern.test(sentence));

const AN_MTF = /\b(MTF|OTF|transfer function)s?\b/i;
// The rung of the engines' own MTF is recorded whatever it is called: a sentence that names it is one of a recorded row.
const RECORDED_ROW = /\b(RECORDED|ATTENTION|recorded (row|rung|pair|difference)s?|[Rr]5)\b/;

/** The claims that are rejected. */
export const BANNED_CLAIMS: readonly BannedClaim[] = [
  {
    name: "validated",
    why: "two estimates side by side validate neither",
    matches: mentions(/\b(validat|certif)\w*/i),
  },
  {
    name: "mtf-agrees",
    why: "an MTF of another method is recorded beside LensVisualizer's, not found to agree with it",
    matches: mentions(/\b(agree(s|d|ing)?|agreement|match(es|ed|ing)?|consistent|coincide(s|d)?)\b/i, AN_MTF),
  },
  {
    name: "mtf-confirmed",
    why: "no engine's MTF is an arbiter of another's",
    matches: mentions(/\b(confirm(s|ed|ing)?|verif(y|ies|ied)|prove[sn]?|proved|corroborat\w*|reproduc\w*)\b/i, AN_MTF),
  },
  {
    name: "mtf-correct",
    why: "a recorded difference says of neither side that it is right",
    matches: mentions(/\b(correct|accurate|accuracy|exact|right|trustworthy|reliable)\b/i, AN_MTF),
  },
  {
    name: "recorded-as-pass",
    why: "a recorded row passes nothing: it has no tolerance",
    matches: mentions(RECORDED_ROW, /\b(pass(es|ed|ing)?|PASS|succe\w+|met|meets?|satisf\w+)\b/),
  },
  {
    name: "band-as-tolerance",
    why: "an attention band is a width for attention and not a tolerance that can be met",
    matches: mentions(
      /\bwithin (its |the |a )?(tolerance|spec|specification|limit)s?\b/i,
      /\b(band|RECORDED|recorded)\b/,
    ),
  },
];

/**
 * The sentences of a Markdown text: a row of a table is one, a heading is one, and a paragraph is split at the
 * end of each sentence, its lines joined.
 */
export function sentencesOf(markdown: string): string[] {
  const sentences: string[] = [];
  for (const block of markdown.split(/\n\s*\n/)) {
    const lines = block.split("\n").filter((line) => line.trim() !== "");
    const prose: string[] = [];
    const flush = (): void => {
      if (prose.length > 0) sentences.push(...prose.join(" ").split(/(?<=[.!?])\s+/));
      prose.length = 0;
    };
    for (const line of lines) {
      if (/^\s*(\||#)/.test(line)) {
        flush();
        sentences.push(line.trim());
      } else prose.push(line.trim());
    }
    flush();
  }
  return sentences.filter((sentence) => sentence !== "");
}

/**
 * What a text claims that no recorded comparison supports, as a list of `<claim>: <sentence>` (empty when it
 * claims nothing of the kind). Every sentence is held to every banned claim. A pure function.
 */
export function wordingProblems(markdown: string): string[] {
  return sentencesOf(markdown).flatMap((sentence) =>
    BANNED_CLAIMS.filter((claim) => claim.matches(sentence)).map((claim) => `${claim.name}: ${sentence}`),
  );
}
