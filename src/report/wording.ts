// The words of a report about a comparison of two methods. A recorded rung sets estimates side by side, and what
// may be said of it is narrow: every sentence a report writes about one is a template of this file, and a lint
// (`wordingProblems`) rejects the claims no recorded row supports, whoever writes them.
import type { NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";
import { formatSci, formatSignificant } from "../core/numeric/format.ts";

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

/** Which MTF a comparison of the engines' own is of: the diffraction MTF of rung R5, the geometric MTF of R5g. */
export type MtfComparisonKind = "diffraction" | "geometric" | "wavefront";
export const WAVEFRONT_HEADING = "The three-way diffraction comparison, with FFT and raw wavefront columns.";

/** The sentences above the tables of an MTF comparison, by the MTF it is of. */
export const MTF_COMPARISON_INTROS: { readonly [kind in MtfComparisonKind]: readonly string[] } = {
  wavefront: [
    "The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on",
    "LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw",
    "Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.",
    "The last column uses the radial optical cosines of optiland's chief-ray reference",
    "sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band",
    "sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.",
  ],
  diffraction: [
    "Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No",
    "column is a reference for another, and no difference in this table is held to a tolerance.",
  ],
  geometric: [
    "Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the",
    "pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a",
    "tolerance.",
  ],
};

/** The sentences above the tables of a comparison of the diffraction MTF. */
export const MTF_COMPARISON_INTRO: readonly string[] = MTF_COMPARISON_INTROS.diffraction;

/**
 * What is said of a geometric comparison whose judged column of optiland is of several lines: the rays are
 * optiland's and the sum over them is the worker's.
 */
export const GEOMETRIC_SEVERAL_LINES: readonly string[] = [
  "On several lines the column of optiland is not a curve of optiland's own class, which is of one line: the rays",
  "and their landings are optiland's, a line a call, and the sum over them, the lines added as complex numbers with",
  "their weights before the modulus is taken, is the worker's.",
];

/** How the several-line R6c column is formed; optiland's FFT remains one-line only. */
export const WAVEFRONT_SEVERAL_LINES: readonly string[] = [
  "On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,",
  "one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by",
  "-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times",
  "transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.",
];

/** Say which policy limit sorted a several-line R6c table, including fields later set aside as numerical. */
export function severalLinesChiefLanding(limitMm: string): string[] {
  return [
    `Several-line fields use the chief-landing sorting limit ${limitMm} mm from the policy.`,
    "The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;",
    "a common reference point does not change the modulus.",
  ];
}

/** The sentences under the fields of a geometric comparison: what the two samplings are. */
export const GEOMETRIC_SAMPLING: readonly string[] = [
  "optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice",
  "across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. On one line",
  "optiland counts its landings into bins, and gives a curve only where the bins move it by less than a band.",
  "Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its",
  "curves moved between its last two samplings, which is that engine's own measure and judges no other.",
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
  "A polychromatic curve of optiland's FFT class. It gives a one-line modulus, so several lines have no FFT " +
    "row in R5 or R6c. R6c's external counterpart is the comparator's complex sum of optiland's raw wavefronts; " +
    "its synthetic sum proof checks the declared weighting and phase convention, not physical spectral fidelity.",
  "optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to " +
    "the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction " +
    "cosine. Rung R5g is recorded and never gated: a difference of the two pupil samplings is written down, not " +
    "explained.",
  "The bins of optiland's geometric MTF. On one line optiland's curve is of landings counted into bins, and a " +
    "field whose bins move a value by more than a band has no optiland curve. On several lines the sum over " +
    "optiland's landings is the worker's, without bins, about the axis point of the image plane; LensVisualizer's " +
    "is about a chief ray's landing.",
  "Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer " +
    "states; no glass catalog and no spectrum is checked against another.",
  "The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine " +
    "searches for one of its own.",
  "The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.",
  "Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, " +
    "samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not " +
    "explained.",
  "Zoom and focus positions other than the states a run names, and the catalog beyond these suites.",
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
// The rungs of the engines' own MTF are recorded whatever they are called: a sentence that names it is one of a recorded row.
const GATED_IDENTICAL = /\b(gated|R4f?|R6a)\b/i;
const IDENTICAL_RAYS = /\bidentical[- ]rays?\b/i;
const GATED_SAME_RAYS =
  /\btrace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs\b/i;
const recordedContext = (sentence: string): boolean =>
  !(GATED_SAME_RAYS.test(sentence) || (GATED_IDENTICAL.test(sentence) && IDENTICAL_RAYS.test(sentence))) ||
  /\b(R5g?|R6[bc]|recorded|FFT|optiland-wave)\b/i.test(sentence);
const RECORDED_ROW = /\b(RECORDED|ATTENTION|recorded (row|rung|pair|difference)s?|r5g?|r6[bc])\b/i;

/** The claims that are rejected. */
export const BANNED_CLAIMS: readonly BannedClaim[] = [
  {
    name: "validated",
    why: "two estimates side by side validate neither",
    // A focus station's refusal says which object distances LensVisualizer certifies: that is of a conjugate, not a
    // comparison, and only that exact phrase is set aside.
    matches: (sentence) =>
      /\b(validat(?:e[sd]?|ing)|certif(?:y|ies|ied|ying))\b(?!-)/i.test(
        sentence.replace(/\bwhose object distance LensVisualizer certifies\b/g, ""),
      ) ||
      mentions(/\b(validation|certification)\b/i, AN_MTF)(sentence) ||
      mentions(/\b(validation|certification)\b/i, RECORDED_ROW)(sentence),
  },
  {
    name: "mtf-agrees",
    why: "an MTF of another method is recorded beside LensVisualizer's, not found to agree with it",
    matches: (sentence) =>
      recordedContext(sentence) &&
      mentions(/\b(agree(s|d|ing)?|agreement|match(es|ed|ing)?|consistent|coincide(s|d)?)\b/i, AN_MTF)(sentence),
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
    name: "recorded-authority",
    why: "a recorded rung establishes no accuracy or proof",
    matches: mentions(RECORDED_ROW, /\b(accurat\w*|prove[sn]?|proved|proven|correct|reliable|trustworthy)\b/i),
  },
  {
    name: "counterpart-preference",
    why: "neither external diffraction counterpart is given preference",
    matches: (sentence) => {
      const affirmative = sentence
        .replace(/\bno preference (?:is )?claimed\b/gi, "")
        .replace(/\bwith no preference between them\b/gi, "")
        .replace(/\bno column is an? arbiter\b/gi, "")
        .replace(/\bneither (?:column|counterpart) is (?:preferred|an? arbiter)\b/gi, "");
      return mentions(
        /\b(FFT|wavefront|optiland-wave|counterpart)s?\b/i,
        /\b(prefer\w*|better|best (?:counterpart|method|reference)|superior|inferior|arbiter|more accurate|reference standard)\b/i,
      )(affirmative);
    },
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

/** Stage 4.5's labels and prose; numeric and named-state data are supplied by the reducer. */
export const STATEMENT_RUNGS: Readonly<Record<string, { mode: "gated" | "recorded"; compares: string }>> = {
  r0: { mode: "gated", compares: "Built layout, shape, aperture, index and sampled sag" },
  r1: { mode: "gated", compares: "First-order quantities and pupils" },
  r2: { mode: "gated", compares: "Hits, directions, image landings and masks of identical rays" },
  r3: { mode: "gated", compares: "Optical path, path to image and chief-relative OPD of identical rays" },
  r4: { mode: "gated", compares: "Comparator geometric MTF on identical rays" },
  r4f: { mode: "gated", compares: "LV geometric MTF beside replay with LV's own sampling" },
  r5: { mode: "recorded", compares: "LV diffraction MTF beside optiland FFT and the LV-ray wave estimate" },
  r5g: { mode: "recorded", compares: "Geometric MTF on each method's own pupil sampling" },
  r6a: { mode: "gated", compares: "Comparator wave MTF on identical rays, in fields whose sampling settled" },
  r6b: { mode: "recorded", compares: "LV sheared diffraction MTF beside comparator wave OTF on LV rays" },
  r6c: { mode: "recorded", compares: "LV, LV-ray wave OTF and FFT beside comparator OTF of optiland raw wavefronts" },
};

/** Included only when the baselines contain the named settled comparison. */
export const STATEMENT_Z50_ATTRIBUTION =
  "The Z 50/1.2 FFT attribution is class method on the settled best-focus half field; earlier numerical and unsupported outcomes remain, as described in docs/z50f12-investigation.md.";

export const STATEMENT_TEXT = {
  intro: "This statement is rendered from the eight baselines alone, with no engine, clock or machine input.",
  counts:
    "A configuration is one suite and named run with a case; the same state in two suites counts twice, and R4 in rays and MTF counts once. A configuration pair is two engines on one configuration and rung; a request pair is two engines on one request. Verdict counts count request pairs, including unsupported answers; refused states have no pairs.",
  worst:
    "The worst gated residual is the metric largest as a fraction of its own tolerance; zero tolerances rank zero at zero and a nonzero excess above every finite ratio. Each metric maximum is also listed in its own units. A recorded worst is the largest banded MTF difference across all pairs of that rung; set-aside differences of each external diffraction counterpart are listed separately. R6a measured request counts exclude fields set aside for phase step or convergence, even when the request verdict is PASS.",
  population:
    "The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each rung.",
  counterparts:
    "Both external diffraction counterparts are recorded side by side, with no preference claimed. Row counts include every requested field, cut and frequency at the last recorded sampling, including unavailable and set-aside rows; their classes and statuses are counted separately. Coverage lists the requested LV lines and the lines each counterpart answered, by named state and request.",
  states:
    "These are the states as the baselines name them, with their case hashes or coded source refusals. The baselines do not retain numeric slider positions, stop radii or image-plane shifts; those cannot be reconstructed here. The wavelength inventory is the union explicitly retained in the benchmark's recorded diffraction answers; other suites' per-line wavelengths are not retained in these baselines.",
} as const;

interface SupportFigure {
  readonly value: number | null;
  readonly tolerance?: number;
}

/** The statement's own reduced data, including the class of each counterpart's worst banded row. */
interface StatementSupportData {
  readonly agreementConfigurations: number;
  readonly suites: readonly unknown[];
  readonly wavelengthsNm: readonly number[];
  readonly agreementFigures: {
    readonly landing: SupportFigure | null;
    readonly opticalPath: SupportFigure | null;
    readonly geometricMtf: SupportFigure | null;
    readonly waveMtf: SupportFigure | null;
  };
  readonly counterparts: readonly {
    readonly rung: string;
    readonly counterpartLinesNm: readonly number[];
    readonly worstBanded: (SupportFigure & { readonly class: string | null }) | null;
  }[];
}

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const countWord = (count: number): string => COUNT_WORDS[count] ?? String(count);

/** Residuals use two significant figures; gates retain the policy's full value, without padded zeros. */
function supportNumber(value: number, gate = false): string {
  if (value === 0) return "0";
  if (Math.abs(value) < 1e-3) return gate ? value.toExponential().replace("e+", "e") : formatSci(value, 2);
  return gate ? String(value) : formatSignificant(value, 2);
}

/** Owner-signed wording (2026-10-23); every figure and the recorded row's class come from the statement. */
export function statementSupport(statement: StatementSupportData, holds: boolean): string {
  if (!holds || statement.agreementConfigurations === 0)
    return "The gated records do not support an identical-ray agreement sentence across the requested configurations.";
  const gated = (figure: SupportFigure | null) =>
    figure?.value == null || figure.tolerance === undefined
      ? null
      : { value: supportNumber(figure.value), gate: supportNumber(figure.tolerance, true) };
  const landing = gated(statement.agreementFigures.landing);
  const path = gated(statement.agreementFigures.opticalPath);
  const geometric = gated(statement.agreementFigures.geometricMtf);
  const wave = gated(statement.agreementFigures.waveMtf);
  const fft = statement.counterparts.find((c) => c.rung === "r5");
  const wavefront = statement.counterparts.find((c) => c.rung === "r6c");
  if (
    !landing ||
    !path ||
    !geometric ||
    !wave ||
    fft?.worstBanded?.value == null ||
    wavefront?.worstBanded?.value == null
  )
    return "The baseline records do not support the complete comparison sentence.";
  return (
    `On ${statement.agreementConfigurations} configurations across ${countWord(statement.suites.length)} suites, ` +
    "LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays " +
    "within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: " +
    `worst landing ${landing.value} mm (gate ${landing.gate} mm), optical path ${path.value} waves (${path.gate}), ` +
    `geometric MTF ${geometric.value} (${geometric.gate}), wave MTF ${wave.value} (${wave.gate}); ` +
    `the benchmark covers ${countWord(statement.wavelengthsNm.length)} wavelengths. ` +
    `LensVisualizer's diffraction MTF is recorded beside ${countWord(statement.counterparts.length)} external counterparts, ` +
    "with no preference between them: optiland's FFT MTF, " +
    `of ${countWord(fft.counterpartLinesNm.length)} wavelength${fft.counterpartLinesNm.length === 1 ? "" : "s"}, ` +
    `differs by up to ${supportNumber(fft.worstBanded.value)}, a difference classed as one of ${fft.worstBanded.class}; ` +
    "the comparator's OTF of optiland's own wavefront, per wavelength and photopic, " +
    `differs by up to ${supportNumber(wavefront.worstBanded.value)}. ` +
    "Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and " +
    "the catalog beyond these suites are not covered."
  );
}
