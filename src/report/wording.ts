// The words of a report about a comparison of two methods. A recorded rung sets estimates side by side, and what
// may be said of it is narrow: every sentence a report writes about one is a template of this file, and a lint
// (`wordingProblems`) rejects the claims no recorded row supports, whoever writes them.
import type { NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";
import type { GroupConsensus, NoConsensusReason } from "./consensus.ts";
import { formatFixed, formatSci, formatSignificant } from "../core/numeric/format.ts";
import { MATRIX_CHECKS, STATEMENT_CHECKS } from "../vocabulary/checks.ts";

/** What a row of an MTF comparison came to. */
export const MTF_ROW_STATUSES = ["RECORDED", "ATTENTION", "SET ASIDE", "UNSUPPORTED", "ERROR"] as const;
/** One of them. */
export type MtfRowStatus = (typeof MTF_ROW_STATUSES)[number];

/** What each status of a row says, for the legend under a table. */
export const MTF_ROW_STATUS_TEXT: { readonly [status in MtfRowStatus]: string } = {
  RECORDED: "the difference is inside the review band and was written down",
  ATTENTION: "the difference is outside the review band: worth a look, and not a failure",
  "SET ASIDE": "the row is in no review band, and its class and reason say why",
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
  "lines-differ": "the two answers are of different wavelengths; no difference is shown",
  "chief-landing-unknown": "an engine does not say where its chief ray lands; no difference is shown",
  "chief-landing-apart": "the chief rays land further apart than the limit: two image points; no difference is shown",
  unconverged: "a sampling did not settle; the difference is shown apart, in no review band",
  "rim-rays-lost":
    "an engine calibrated a frequency axis with a rim ray that was lost; the difference is shown apart, in no review band",
  "two-methods": "both engines stand by their curves; the difference is set beside the review band",
};

/** A field's reason in words (`FIELD_REASON_TEXT`); a reason with no sentence is given as it is. */
export function fieldReasonText(reason: string): string {
  return Object.hasOwn(FIELD_REASON_TEXT, reason) ? FIELD_REASON_TEXT[reason as NativeFieldReason] : reason;
}

/** Which MTF a comparison of the engines' own is of: the diffraction MTF of check r5, the geometric MTF of r5g. */
export type MtfComparisonKind = "diffraction" | "geometric" | "wavefront";
export const WAVEFRONT_HEADING = "The three-way diffraction comparison, with FFT and raw wavefront columns.";

/** The sentences above the tables of an MTF comparison, by the MTF it is of. */
export const MTF_COMPARISON_INTROS: { readonly [kind in MtfComparisonKind]: readonly string[] } = {
  wavefront: [
    "The three-way comparison shows LensVisualizer's sheared estimate (lv), this tool's wave OTF of",
    "LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and this tool's OTF of optiland's raw",
    "Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.",
    "The last column uses the radial optical cosines of optiland's chief-ray reference",
    "sphere and intensity as cell flux. A quarter-wave step, or a move on doubling the grid beyond the field's",
    "convergence band, sets its differences aside as not converged. The reference-sphere model and the FFT axes remain",
    "choices of each method.",
  ],
  diffraction: [
    "Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No",
    "column is a reference for another, and no difference in this table is held to a limit.",
  ],
  geometric: [
    "Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the",
    "pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a",
    "limit.",
  ],
};

/** The sentences above the tables of a comparison of the diffraction MTF. */
export const MTF_COMPARISON_INTRO: readonly string[] = MTF_COMPARISON_INTROS.diffraction;

/**
 * What is said of a geometric comparison whose judged column of optiland is of several lines: the rays are
 * optiland's and the sum over them is the worker's.
 */
export const GEOMETRIC_SEVERAL_LINES: readonly string[] = [
  "On several wavelengths the column of optiland is not a curve of optiland's own class, which is of one wavelength:",
  "the rays and their landings are optiland's, one wavelength a call, and the sum over them, the wavelengths added",
  "as complex numbers with their weights before the modulus is taken, is this tool's.",
];

/** How the several-wavelength column of check r6c is formed; optiland's FFT remains of one wavelength only. */
export const WAVEFRONT_SEVERAL_LINES: readonly string[] = [
  "On several wavelengths optiland-wave is this tool's sum of complex OTFs of optiland's raw wavefronts,",
  "one wavefront.native call per wavelength, evaluated at the requested frequencies. Each wavelength is",
  "phase-shifted by -2 pi nu times its chief landing's offset from the chief landing of wavelength 0, weighted by",
  "its weight in the lens state times the transmitted flux, and added before the modulus. The optiland FFT column",
  "is not computed on several wavelengths.",
];

/** Says which sorting limit of the limits file sorted a several-wavelength table of check r6c. */
export function severalLinesChiefLanding(limitMm: string): string[] {
  return [
    `Fields of several wavelengths use the chief-landing sorting limit ${limitMm} mm of the limits file.`,
    "The landings identify the field: LensVisualizer's shared chief launch and optiland's chief ray of wavelength 0",
    "are different rays; a common reference point does not change the modulus.",
  ];
}

/** The sentences under the fields of a geometric comparison: what the two samplings are. */
export const GEOMETRIC_SAMPLING: readonly string[] = [
  "optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice",
  "across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. At one wavelength",
  "optiland counts its landings into bins, and gives a curve only where the bins move it by less than its convergence",
  "band (0.005 on the axis, 0.01 off it).",
  "Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its",
  "curves moved between its last two samplings, which is that engine's own measure and judges no other.",
];

/** The sentence under the table of rows. */
export const MTF_COMPARISON_OUTRO: readonly string[] = [
  "A review band is a width for attention, not a limit. A difference inside it was written down and says nothing",
  "more; a difference outside it is worth a look and fails nothing.",
];

/**
 * What a comparison of this tool does not show, whatever its verdicts: the block every report ends its results
 * with. The sentences are fixed; a report adds none and leaves none out.
 */
export const NOT_COVERED: readonly string[] = [
  "optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, " +
    "reference sphere and frequency axes, so check r5 sets two methods side by side and holds them to no limit.",
  "A polychromatic curve of optiland's FFT class. It gives the modulus at one wavelength, so a run of several " +
    "wavelengths has no FFT row in checks r5 or r6c. The external counterpart in check r6c is this tool's complex " +
    "sum of optiland's raw wavefronts; its proof on synthetic sums checks the declared weighting and phase " +
    "convention, not physical spectral fidelity.",
  "optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to " +
    "the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction " +
    "cosine. Check r5g sets the two side by side and holds them to no limit: a difference of the two pupil " +
    "samplings is written down, not explained.",
  "The bins of optiland's geometric MTF. At one wavelength optiland's curve is of landings counted into bins, and " +
    "a field whose bins move a value by more than its convergence band (0.005 on the axis, 0.01 off it) has no " +
    "optiland curve. At several wavelengths the " +
    "sum over optiland's landings is this tool's, without bins, about the axis point of the image plane; " +
    "LensVisualizer's is about a chief ray's landing.",
  "Dispersion and white-light weighting. Every engine is handed the refractive indices and the wavelength weights " +
    "LensVisualizer states; no glass catalog and no spectrum is checked against another.",
  "The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine " +
    "searches for one of its own.",
  "The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.",
  "Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, " +
    "samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not " +
    "explained.",
  "Zoom and focus positions other than the lens states a run names, and the catalog beyond these suites.",
  "Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no review " +
    "band.",
];

/** Engines as a report names them in a sentence: each in backticks, by commas. */
function engineList(engines: readonly string[]): string {
  return engines.map((engine) => `\`${engine}\``).join(", ");
}

/** Why a group has no consensus (`src/report/consensus.ts`), as the first clause of the sentence under its matrix. */
export const NO_CONSENSUS_TEXT: { readonly [reason in NoConsensusReason]: string } = {
  split: "No consensus: the engines within the limits of each other split into two or more largest sets",
  "no-pair-within": "No consensus: no two engines are within the limits of each other",
  minority:
    "No consensus: the largest set of engines within the limits of each other holds no more than half of the engines placed",
};

/**
 * The sentence under the pairwise matrix of a group with a consensus to look for: the consensus or why there is
 * none, then its outliers, the engines apart and those not placed, each clause only where it names an engine. It
 * says which answers are within the gates of each other, never which is right.
 */
export function consensusSentence(group: GroupConsensus): string {
  const clauses =
    group.consensus === null
      ? [NO_CONSENSUS_TEXT[group.reason ?? "no-pair-within"]]
      : [`Consensus: ${engineList(group.consensus)}, every two of them within the limits of each other`];
  if (group.outliers.length > 0) {
    const noun = group.outliers.length === 1 ? "outlier" : "outliers";
    clauses.push(`${noun}: ${engineList(group.outliers)}, beyond the limits of every engine of the consensus`);
  }
  if (group.apart.length > 0) {
    clauses.push(`apart: ${engineList(group.apart)}, outside the consensus and not beyond the limits of all of it`);
  }
  if (group.notPlaced.length > 0) {
    clauses.push(`not placed: ${engineList(group.notPlaced)}, with no pair within or beyond the limits`);
  }
  return `${clauses.join("; ")}.`;
}

/** The prose of a report's "Consensus" section, above its tables. */
export const CONSENSUS_SECTION: readonly string[] = [
  "A consensus is looked for on each request of a check held to a limit that three or more engines were compared",
  "on, pair by pair. An engine is placed where a pair of it is within or beyond the limits; a pair whose verdict is",
  "Not computed, Not judged or Error places no engine. The consensus is the largest set of placed engines every two",
  "of which are within the limits of each other, where it is the only largest such set and holds more than half of",
  "the engines placed. An outlier is beyond the limits of every engine of the consensus; an engine apart is outside",
  "the consensus and not beyond the limits of all of it. A consensus says which answers are within the limits of",
  "each other, and no more.",
];

/** How many requests had a consensus to look for, and how many had one. */
export function consensusCounts(requests: number, withConsensus: number): string {
  const noun = requests === 1 ? "request" : "requests";
  const verb = withConsensus === 1 ? "has" : "have";
  return `Of ${formatFixed(requests, 0)} ${noun} with a consensus to look for, ${formatFixed(withConsensus, 0)} ${verb} one.`;
}

/** The headings of the tables of a report's "Consensus" section, and the label of each row of requests. */
export const CONSENSUS_TABLES = {
  requests: ["Requests", "Count"],
  withConsensus: "with a consensus",
  withoutConsensus: (reason: NoConsensusReason): string => NO_CONSENSUS_TEXT[reason],
  engines: ["Engine", "In the consensus", "Outlier", "Apart", "Placed, no consensus", "Not placed"],
} as const;

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
  {
    name: "difference-agreement",
    why: "a difference of curves of two conditions or two requests is a subtraction that no comparison judges: it shows neither agreement nor its absence",
    matches: mentions(
      /\b(across|other|another|different|two|several) (conditions?|requests?|runs?|run directories|fields?|cuts?)\b|\boverla(y|ys|id)\b/i,
      /\b(agree\w*|disagree\w*|consistent|inconsistent|consistency|discrepan\w*|concord\w*|conflict\w*)\b/i,
    ),
  },
  {
    name: "consensus-correct",
    why: "a consensus says which answers are within the limits of each other, not which is right or in error",
    // "an error" is read in lower case only: a pair that is ERROR is a verdict, which a sentence may name.
    matches: (sentence) =>
      mentions(
        /\b(consensus|outliers?|majority)\b/i,
        /\b(correct(ly|ness)?|incorrect|right|wrong(ly)?|true values?|truth|errs?|erroneous|in error|mistaken|faulty|at fault|accurate|accuracy|valid|verified|trustworthy|reliable)\b/i,
      )(sentence) || mentions(/\b(consensus|outliers?|majority)\b/i, /\ban error\b/)(sentence),
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

/**
 * Stage 4.5's labels and prose; numeric and named-state data are supplied by the reducer. The words are the checks'
 * (`src/vocabulary/checks.ts`).
 */
export const STATEMENT_RUNGS: Readonly<Record<string, { mode: "gated" | "recorded"; compares: string }>> =
  STATEMENT_CHECKS;

/** Included only when the baselines contain the named settled comparison. */
export const STATEMENT_Z50_ATTRIBUTION =
  "For the Nikkor Z 50 mm f/1.2 wide open at best focus, the tangential difference between optiland's FFT MTF and the other diffraction estimates at the half field, where every sampling settled, is classed as one of method. The outcomes of the other conditions remain as they were classed: wide open at the full field the FFT computes nothing (not computed), and on the design plane its sampling does not settle (not converged); docs/z50f12-investigation.md describes them.";

export const STATEMENT_TEXT = {
  intro:
    "This statement is rendered from the eight baselines of the benchmark, features, states and focus-stations suites alone, with no engine, clock or machine input. It says what those baselines support, check by check, and what they do not cover.",
  counts:
    "A configuration is one named run of one suite, with its lens state; the same lens state in two suites counts twice, and check r4, which is in both the ray and the MTF baselines, counts once. A configuration pair is two engines on one configuration and one check; a request pair is two engines on one request. The verdict counts count request pairs, answers that were not computed included; a refused lens state has no pairs.",
  worst:
    "The worst residual of a check held to a limit is the figure largest as a fraction of its own limit; a limit of zero ranks a value of zero at zero and any value above it above every finite ratio. The largest value of each figure is also listed in its own units. The worst of a side-by-side check is the largest MTF difference among the rows that have a review band, over every pair of that check; the differences set aside are listed apart for each external diffraction counterpart. The measured request counts of check r6a leave out fields set aside for their phase step or convergence, even where the verdict of the request is Pass.",
  population:
    "The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each check.",
  counterparts:
    "Both external diffraction counterparts are set side by side with LensVisualizer, with no preference claimed. Row counts include every requested field, cut and frequency at the last sampling written down, rows not computed and rows set aside included; their classes and statuses are counted apart. The coverage lists the wavelengths requested of LensVisualizer and the wavelengths each counterpart answered, by named state and request.",
  states:
    "These are the lens states as the baselines name them, each with the code of its refusal where it was refused; the hash of each lens state that was run is under Identifiers. The baselines do not keep slider positions, stop radii or image-plane shifts as numbers, so those cannot be given here. The wavelengths listed are those the benchmark's diffraction answers keep; the other suites' baselines keep no wavelength.",
} as const;

/** The headings, labels and count sentences of the statement; its prose is `STATEMENT_TEXT`. */
export const STATEMENT_LABELS = {
  supportable: "Supportable sentence",
  checks: "Checks",
  checkColumns: [
    "Check",
    "Id",
    "Compares",
    "Kind",
    "Configurations",
    "Configuration pairs",
    "Request pairs",
    "Verdicts",
    "Worst residual",
  ],
  limits: "Limits and largest values",
  counterparts: "External diffraction counterparts",
  counterpartColumns: [
    "Check",
    "Counterpart",
    "Configurations",
    "Rows",
    "Rows by class",
    "Worst of the rows with a review band",
    "Worst set aside",
  ],
  requestedLines: "Wavelengths asked of LensVisualizer (nm)",
  answeredLines: "Wavelengths the counterpart answered (nm)",
  fields: "Fields requested",
  bandedConfigurations: "Configurations with rows that have a review band",
  sortingLimits: "Chief-landing sorting limits (mm)",
  frequencies: "Frequencies (cycles/mm)",
  rowStatuses: "Rows by status",
  coverageColumns: [
    "Suite",
    "Named state / request",
    "LensVisualizer wavelengths (nm)",
    "Counterpart wavelengths (nm)",
    "Fields / classes / reasons",
    "Landing sorting limit (mm)",
    "Verdict",
  ],
  states: "Lens states by suite",
  declared: (declared: number, configurations: number, refused: number): string =>
    `${declared} named states are declared, ${configurations} are run with a lens state, and ${refused} are refused.`,
  stateColumns: [
    "Named state",
    "Refusal",
    "Measured on r2, r3, r4 and r6a for both pairs of LensVisualizer and an external engine",
  ],
  notCovered: "Not covered",
  identifiers: "Identifiers",
  identifiersIntro:
    "The SHA-256 hashes of the eight baseline files this statement is rendered from, and of each named lens state that was run.",
  sourceColumns: ["Baseline file", "SHA-256"],
  stateIdentifierColumns: ["Suite", "Named state", "Lens state (SHA-256)"],
  kind: { gated: "held to a limit", recorded: "side by side, no limit" } as Readonly<Record<string, string>>,
  limitKind: { tolerance: "limit", attention: "review band", sorting: "sorting limit" } as Readonly<
    Record<string, string>
  >,
  notMeasured: "not measured",
  notFinite: "not finite",
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

/** Catalog statistics describe recorded pair aggregates, never a production-lens validation claim. */
export const CATALOG_TEXT = {
  intro:
    "These are the statistics of the catalog sweep: every lens of LensVisualizer's catalog at the snapshot's commit, at each end of a zoom, wide open, at the reference wavelength and on the design image plane, rendered from the catalog's two baselines alone. The catalog's baselines are a dated snapshot, not refreshed with the others.",
  complete: "Both catalog baselines are present; the pairs of check r4, which is in both, are counted once.",
  pending: "The catalog statistics are incomplete until both catalog baselines are written.",
  units:
    "A lens state's status is the worst verdict of its pairs; a pair count counts one record a run, check and pair of engines, and the groups of lens features overlap.",
  census:
    "A census code counts the distinct lens states that carry it (such a state may still be compared: see the status counts); an engine code counts the distinct runs, checks and engines that refused with it.",
  quantiles:
    "Quantiles interpolate linearly at (n - 1)p over the finite figures of the pairs of the checks held to a limit; figures that are not finite are counted apart and ranked first in each list of the worst ten.",
  failures:
    "A listed failure keeps its verdict, Fail; each failing figure keeps its class, the hash of its evidence, the entry of docs/gotchas.md that explains it and a command that reproduces it in one run.",
} as const;

/** The headings and column labels of the catalog statistics; its prose is `CATALOG_TEXT`. */
export const CATALOG_LABELS = {
  title: "Catalog statistics",
  statusCounts: "Status counts",
  statusColumns: ["Scope", "Lens states", "Lens states by status", "Pairs by status"],
  feature: (name: string): string => `Lens feature: ${name}`,
  censusReason: (name: string): string => `Reason of the census: ${name}`,
  census: "Codes, by lens state and by engine",
  censusColumns: ["Code", "Lens states with the code", "Checks an engine refused"],
  figures: "Figures of the checks held to a limit",
  figure: (check: string, name: string, unit: string): string =>
    unit === "1" ? `${check}: ${name}, with no unit` : `${check}: ${name} (${unit})`,
  quantileColumns: ["Pairs", "Not finite", "Min", "Median", "p90", "p99", "Max"],
  worstColumns: ["Run", "Engines", "Value"],
  failures: "Failures, classified",
  failureColumns: ["Run", "Check", "Engines", "Figure", "Class", "Gotcha", "Reproducer"],
  howToRead: "How to read this",
  howToReadIntro: [
    "A lens state is one run of the sweep; a pair is two engines on one check of one run. A status or a verdict is",
    "shown by its label; the stored value is what the catalog's baselines hold:",
  ],
  verdictColumns: ["Label", "Stored value", "Meaning"],
  checksIntro: "The checks of the sweep, by the id a heading names:",
  checkColumns: ["Check", "Id", "Compares"],
  failuresIntro:
    "In the table of failures, Class says where a difference comes from, decided in the order unsupported, data, convention, numerical, method (method: the two engines' methods differ), and not that an engine is right; Gotcha is the entry of docs/gotchas.md that explains the difference, and Reproducer the command that reproduces it in one run:",
  classColumns: ["Class", "Stored value"],
  sources: "Sources",
  notCovered: "Not covered",
} as const;

/**
 * The rungs the validation matrix names: the statement's, and those of Phase 6, each with what it compares. The words
 * are the checks' (`src/vocabulary/checks.ts`).
 */
export const MATRIX_RUNGS: Readonly<Record<string, { mode: "gated" | "recorded"; compares: string }>> = MATRIX_CHECKS;

/** The rows of the validation matrix, each a LensVisualizer tab or the analyses it has no tab of: the vocabulary's. */
export { MATRIX_ROWS } from "../vocabulary/matrix.ts";
export type { MatrixRowText } from "../vocabulary/matrix.ts";

/** The headings and column labels of the validation matrix; its prose is `MATRIX_TEXT`. */
export const MATRIX_LABELS = {
  inputs: "Inputs",
  inputColumns: ["Input", "Value"],
  suite: "Suite",
  suiteHash: "Suite hash",
  limitsFile: "Limits file",
  limitsFileHash: "Limits file hash",
  lvCommit: "LensVisualizer commit",
  lvDirty: "LensVisualizer checkout",
  lvCode: "LensVisualizer engine code",
  lvFiles: "LensVisualizer engine files",
  declared: "Declared runs",
  configurations: "Configurations",
  engineColumns: ["Engine", "Name", "Version"],
  identifiers: "Identifiers",
  identifiersIntro:
    "The hashes that tell one version from another: of the suite file, of the limits file, of LensVisualizer's commit and engine code, of the two baseline files this matrix is rendered from, and of each engine's code and of this tool's code behind it.",
  identifierColumns: ["Identifier", "Hash"],
  engineIdentifierColumns: ["Engine", "Engine code", "This tool's code behind it"],
  rows: "Rows",
  rowColumns: ["Row", "Checks held to a limit", "Side-by-side checks"],
  gated: "Held to a limit",
  recorded: "Side by side",
  countedColumns: [
    "Check",
    "Compares",
    "Quantity",
    "Engines",
    "Configurations",
    "Configuration pairs",
    "Request pairs",
    "Request-pair counts",
    "Configuration-pair counts",
    "Engines not answering",
    "Baselines",
  ],
  namedColumns: ["Check", "Compares", "Quantity", "Engines", "Baselines"],
  everyEngine: "every engine answered",
  notCovered: "Not covered",
} as const;

/** The validation matrix's prose; its counts and names are supplied by the reducer. */
export const MATRIX_TEXT = {
  intro:
    "This matrix is rendered from the benchmark's two baselines alone, with no engine, clock or machine input. It has a row for each LensVisualizer analysis tab, a row of the foundation they stand on, and a row of the analyses LensVisualizer has no tab of.",
  counts:
    "A configuration is one named run of the benchmark, with its lens state. A configuration pair is two engines on one configuration and one check; a request pair is two engines on one request. Request-pair counts count every request pair, answers that were not computed included; configuration-pair counts count the worst verdict of each configuration pair. Check r4 is in both baselines and counts once.",
  gated:
    "A check held to a limit holds two engines to the limits of the limits file on the same input, and its verdicts are the ones the baseline holds.",
  recorded:
    "A side-by-side check sets two methods beside each other with no limit and fails nothing: its counts say how many pairs were written down inside a review band, outside one, or without an answer to set beside the other.",
  unbaselined:
    "A check marked as in no baseline is run only where a run names it and is kept out of every baseline, so this matrix names its quantity and engines and gives no figure of it.",
  absent: "not in the benchmark's baselines",
  inNoBaseline: "in no baseline; run only where named",
  notCovered:
    "Beyond each row's own items, the fixed list that every MTF report ends with says what no comparison of this tool shows:",
} as const;

/**
 * The words of the committed reports of a baseline (`reports/<suite>/rays.md` and `mtf.md`) and of a run's report
 * (`lvrtc report`): titles, introductions, column labels and the "How to read this" section. A report shows a check
 * by its title with its id, an engine pair by the engines' ids, a verdict by its label; the legend gives the stored
 * value beside each label.
 */
export const REPORT_TEXT = {
  raysTitle: (suite: string): string => `Baseline of ${suite}: the ray checks`,
  raysIntro: (suite: string): string[] => [
    `This file is the committed record of the ray checks of the suite ${suite}, as its baseline holds them: for every`,
    "run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every",
    "pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and",
    "wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so",
    "`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no",
    "ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the",
    "engines are still those of the baseline. How to read this, near the end, says what each label and column means.",
  ],
  mtfTitle: (suite: string): string => `Baseline of ${suite}: the MTF checks`,
  mtfIntro: (suite: string): string[] => [
    `This file is the committed record of the MTF checks of the suite ${suite}, as its MTF baseline holds them, for`,
    "every run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named). A",
    "check held to a limit gives, for every pair of engines, the verdict and the largest value of each figure over",
    "the requests of the run, with the number of requests the figure was measured in, since some checks measure a",
    "figure only where their sampling settled. A side-by-side check has no limit: its figures are written down beside",
    "a review band, and its tables set the engines' own estimates side by side.",
    "",
    "The file is rendered from the baseline alone, so `lvrtc verify` can render it anew and compare it byte for byte:",
    "it holds results, counts, names and hashes, and no ray an engine traced. `lvrtc baseline check --mtf` runs the",
    "engines again and says whether the lens states and the engines are still those of the baseline, and what moved.",
    "How to read this, near the end, says what each label and column means.",
  ],
  /** Shown only where a pair of the report is FLOOR: what the limits file then granted. */
  floor: [
    "A pair here is Within a known numerical floor (stored as FLOOR): a figure is above its limit by the known",
    "numerical floor of one engine, which the limits file granted. That engine is within the floor limit of the",
    "check's arbiter while no other engine sides with it against the arbiter. It counts as a pass and is counted apart.",
  ],
  inputs: "Inputs",
  inputColumns: ["Input", "Value"],
  suite: "Suite",
  contract: "Contract version",
  limitsFile: "Limits file",
  limitsFileVersion: (version: string): string => `v${version}`,
  engineColumns: ["Engine", "Name", "Version", "What the engine states of itself"],
  runProblems: "Runs with a problem",
  runProblemColumns: ["Run", "Problem"],
  summary: "Summary",
  summaryColumns: ["Check", "Quantity", "Runs", "Requests", "Pair", "Runs by verdict", "Requests by verdict"],
  support: "Support",
  supportIntro: [
    "In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so",
    "(not computed), with the code and the item it names; that is an answer and not a failure.",
  ],
  supportColumns: ["Check", "Engine", "Runs by status"],
  checkLine: (compares: string, kind: string, quantity: string): string =>
    `Compares: ${compares}. Kind: ${kind}. Quantity asked of the engines: ${quantity}.`,
  worstIntro: "The worst of every figure over the suite:",
  worstColumns: (measured: boolean): string[] => [
    "Pair",
    "Figure",
    "Unit",
    "Limit",
    "Worst, or total",
    ...(measured ? ["Requests measured"] : []),
    "Run",
    "Where",
  ],
  byRunIntro: (measured: boolean): string =>
    `By run, each pair with its verdict and the judged figure that is largest against its limit${measured ? ", with the number of the run's requests it was measured in" : ""}:`,
  byRunRun: "Run",
  byRunRequests: "Requests",
  rays: (engine: string): string => `Rays of ${engine}: ok / blocked / failed`,
  noJudgedFigure: "no judged figure",
  notFinite: "not finite",
  noUnit: "none",
  laterSteps: "Later steps",
  laterStepsIntro: [
    "An engine that was asked a request once more, with a finer sampling, because of what its first answer came to.",
    "Its first answer is what the support counts; the step is what its row of a table is of.",
  ],
  laterStepColumns: ["Check", "Engine", "Step", "Runs", "Requests asked again", "Not ok"],
  marked: "Worth a look",
  markedIntro: [
    "Every request of a side-by-side check whose two engines differ by more than a review band, or whose chief rays",
    "land further apart than a sorting limit, with each such figure. A review band is a width for attention, and a",
    "sorting limit tells two image points apart; nothing here is a failure.",
  ],
  markedColumns: ["Check", "Run", "Field", "Pair", "Figures above their review band or sorting limit"],
  noneMarked: "No request is worth a look by its review bands.",
  reviewBand: (band: string): string => `review band ${band}`,
  sortingLimit: (limit: string): string => `sorting limit ${limit}`,
  limitAtMost: (limit: string): string => `≤ ${limit}`,
  notCovered: "Not covered",
  notCoveredIntro: "What this comparison does not show, whatever its verdicts:",
} as const;

/** The review bands of an MTF table, and the chief-landing limit that sorts its fields. */
function reviewBandLines(onAxis: string, offAxis: string, chiefMm: string): string[] {
  return [
    `Review bands: ${onAxis} on the axis, ${offAxis} off it. Two chief rays that land more than ${chiefMm} mm apart`,
    "are of two fields.",
  ];
}

/** The sentences around a table of an MTF comparison (`mtfComparisonLines`), beside `MTF_COMPARISON_INTROS`. */
export const MTF_COMPARISON_TEXT = {
  difference: (heading: string, difference: string): string => `${heading} The difference of a row is ${difference}.`,
  bands: reviewBandLines,
  notBothAsked: (a: string, b: string): string => `\`${a}\` and \`${b}\` were not both asked.`,
  noResult: (a: string, b: string, verdict: string, reason: string): string =>
    `\`${a}\` against \`${b}\` is ${verdict}: ${reason}.`,
  noReason: "no reason was given",
  overall: (a: string, b: string, verdict: string): string[] => [
    `Over every frequency of the request \`${a}\` against \`${b}\` comes to ${verdict}; a row below has the`,
    "status of its own frequency.",
  ],
  noFrequency: "No shown frequency is one of the request.",
} as const;

/** The words of a run's report (`lvrtc report`, `src/report/markdown.ts`) that are its own. */
export const RUN_REPORT_TEXT = {
  title: (suite: string): string => `Comparison report: ${suite}`,
  limitsFileHash: "Limits file hash",
  suiteHash: "Suite hash",
  engineColumns: (identifiers: boolean): string[] => [
    "Engine",
    "Status",
    "Version",
    "Engine code",
    ...(identifiers ? ["This tool's code behind it"] : []),
  ],
  runColumns: ["Run", "Lens state", "Status"],
  verdictSummary: "Verdict summary",
  noFailure: (pairs: string): string => `No pair is Fail or Error, of ${pairs} compared.`,
  failures: (failing: string, pairs: string): string => `${failing} of ${pairs} pairs are Fail or Error.`,
  supportMatrix: "Support matrix",
  supportColumns: ["Run", "Check"],
  sectionLine: (quantity: string, judged: string, request: string): string =>
    `Quantity ${quantity}: ${judged}. Request \`${request}\`.`,
  judged: (method: string, kind: string): string => `${method}; ${kind}`,
  noPolicyEntry: "the limits file has no entry for this check",
  howToRead: "How to read this",
  howToReadIntro: [
    "Each pair of engines that answered one request gets one verdict. A table of this report shows its stored value;",
    "this is its label and what it means:",
  ],
  verdictColumns: ["Label", "Stored value", "Meaning"],
  failing: (floor: boolean): string[] => [
    "Only Fail (`FAIL`) and Error (`ERROR`) fail a comparison.",
    ...(floor ? ["Within a known numerical floor (`FLOOR`) is a pass that is counted apart from Pass (`PASS`)."] : []),
    "Side by side (`RECORDED`) and Side by side, worth a look (`ATTENTION`) are not failures: a side-by-side check",
    "compares methods that are expected to differ, and its numbers are kept to be read, not held to a limit. Not",
    "judged (`BLOCKED`) is not a second failure: two engines that built different systems would differ in every check",
    "after that one.",
  ],
  limits: (floor: boolean): string[] => [
    "A limit is shown in the heading of its figure: `≤` is the limit of a check held to a limit, `band` the review",
    `band of a side-by-side check${floor ? ", and `floor ≤` how far the engine with a floor may be from the arbiter for a FLOOR" : ""}. A figure`,
    "without a limit is shown and not judged. Where its name begins as a judged one's does, it stands beside that",
    "one: `pupilZ.maxAbs`, the plain difference, beside `pupilZ.maxScaled`, the one on the scale that is judged.",
  ],
  digits: (metricDigits: number, recordedDigits: number, nothing: string): string[] => [
    `Numbers have ${metricDigits} significant digits, and a whole number, such as a count, is written in full.`,
    `A value written down has ${recordedDigits} significant digits, or is a whole number in full, and is named with the index of its`,
    `element. \`${nothing}\` marks a place with nothing to compare, and \`not finite\` a number that is a NaN or an infinity.`,
    "The reference-vs-each table and the pairwise matrix judge a pair alike, so a pair that is in both has the same",
    "verdict in both.",
  ],
} as const;

/** The words of a baseline's table of the engines' own MTF (`src/baseline/mtfReport.ts`). */
export const MTF_TABLE_TEXT = {
  bands: reviewBandLines,
  without: "Requests without a table, by what the two engines came to:",
  withoutColumns: ["Verdict", "Requests", "Runs", "Reason"],
  rows: (frequencies: string, second: string, estimator: string): string[] => [
    `A row is one field and cut of one run, at ${frequencies} cycles/mm. Under each engine is what it says of the`,
    `field (\`${second}\` with the step its row is of, where it was asked again); the third estimate is this tool's`,
    `(\`${estimator}\`). The status is the worst of the row's frequencies; "All" is what the two engines came to over`,
    "every frequency of the request.",
  ],
  rowsByStatus: (statuses: string): string => `Rows by status: ${statuses}.`,
  reasonColumns: ["Reason", "Meaning"],
} as const;

/** The "How to read this" section of a baseline's report: every sentence of it. */
export const HOW_TO_READ_TEXT = {
  heading: "How to read this",
  verdicts: "Verdicts",
  verdictsIntro: [
    "A verdict is of one pair of engines: of one request, or, in a table by run, the worst over the requests of the",
    "run. A table shows the label; the stored value is what the baseline file holds.",
  ],
  verdictColumns: ["Label", "Stored value", "Meaning"],
  checks: "Checks",
  checksIntro: [
    "A check held to a limit judges two engines' answers to the same input against the limits of the limits file. A",
    "side-by-side check sets two methods beside each other with no limit, and fails nothing. A section of this file",
    "is headed by a check's title, with the id the baseline file stores it under.",
  ],
  checkColumns: ["Check", "Id", "Kind", "Compares"],
  kind: { limit: "held to a limit", "side-by-side": "side by side, no limit" } as Readonly<Record<string, string>>,
  engines: "Engines",
  enginesIntro: "A pair is named by the ids of its two engines:",
  engineColumns: ["Id", "Engine"],
  figures: "Figures",
  figuresIntro: [
    "A figure is named by its label, then the key the baseline file stores it under. The Limit column gives, for a",
    "check held to a limit, the largest value a pair may have (`≤`); for a side-by-side check, the review band a",
    "difference is set beside. A figure without either is shown and not judged; a chief-ray landing of a side-by-side",
    "check is held to the sorting limit its tables state. Numbers have three significant digits, and a whole number,",
    "such as a count, is written in full. `not finite` marks a number that is NaN or infinite, and `—` a place with",
    "nothing to show.",
  ],
  measured:
    "Requests measured: in how many requests a pair has a value of the figure; a check measures some figures only where its sampling settled.",
  places: "Where",
  placesIntro: "The place of a figure's largest value, as the requests name it:",
  placeColumns: ["Place", "Meaning"],
  runNames: "Run names",
  runNamesIntro:
    "A run's name is the name the suite gives it, usually a lens key (in the features suite, the feature it exercises; in the catalog, `catalog-` then the lens key), then the parts below that apply. They are the naming of the committed suites; a lens key may hold the same letters as a part of its own.",
  runNameColumns: ["Part", "Meaning"],
  wavelengths: "Wavelengths",
  wavelengthsIntro: "Each wavelength by its index, as LensVisualizer's answers in this baseline record them:",
  wavelengthColumns: ["Wavelengths (nm), by index", "Runs", "For example"],
  noWavelengths:
    "This baseline does not keep the wavelengths themselves: a place names a wavelength by its index in the lens state alone.",
  ownMtf: "The engines' own MTF",
  ownMtfRows:
    "Each frequency of a field and cut has a status of its own. A table with a row for each frequency shows that status; a table with a row for each field and cut shows the worst of its frequencies, and under All what the two engines came to over the whole request:",
  ownMtfStatusColumns: ["Label", "Stored value", "Meaning"],
  ownMtfClasses: "A field has the class of its difference, decided in this order, and the reason beside it:",
  ownMtfClassColumns: ["Label", "Stored value", "Meaning"],
  identifiers: "Identifiers",
  identifiersIntro: [
    "The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;",
    "of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each",
    "run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The",
    "contract version is that of the file format the baseline is written in.",
  ],
  identifierColumns: ["Identifier", "Value"],
  contract: "Contract version of the baseline file",
  suiteFile: "Suite file",
  baselineFile: "Baseline file",
  limitsFile: "Limits file",
  engineIdentifierColumns: ["Engine", "Engine code", "This tool's code behind it", "Commit and sources"],
  runIdentifierColumns: ["Run", "Lens state"],
} as const;

/**
 * The sentences of the dashboard (`lvrtc serve`, `src/dashboard/html.ts`): what its pages say of runs, comparisons,
 * verdicts, consensus, staleness and the bases staleness is judged against. Headings stay short labels; every
 * sentence is here, and a test lints the visible text of every page rendered from the fixtures. A template that
 * takes HTML is filled with placeholders, escaped, and only then given the HTML (`html.ts`, `fill`).
 */
export const DASHBOARD_TEXT = {
  readOnly:
    "The pages read the run directories, the baselines and the limits file at hand, and write nothing; only the actions of the control page write, each by starting an lvrtc command.",
  sources: "Hover over a number to see the file it was read from and its JSON pointer there.",
  derived: "A number marked as derived is computed by the dashboard from the figures it names, never read from a file.",
  policyAtHand: (version: string): string => `The limits file at hand is version ${version}.`,
  noRuns: "No run directory with a run record is in the runs directory.",
  noBaselines: "No baseline file is in the baselines directory.",
  documentProblem: (document: string, problem: string): string => `${document} cannot be shown: ${problem}`,
  notReadable: "The run record of this run cannot be read, so nothing of the run is shown.",
  notCompared: "This run has not been compared: lvrtc compare writes the comparisons that judge it.",
  comparisonsUnreadable: "The comparisons of this run cannot be read, so no verdict of it is shown.",
  inputProblems:
    "The comparisons do not belong with this run record or with the limits file at hand, so their verdicts may be of other inputs:",
  /** Why a run's comparisons do not belong with its run record or the limits file at hand, in the dashboard's words. */
  inputProblem: (problem: string): string =>
    problem === "the comparisons were made from another manifest"
      ? "the comparisons were made from another run record"
      : problem === "the comparisons were judged by another policy"
        ? "the comparisons were judged by another limits file"
        : problem,
  failing: (count: number): string => `Pairs that fail or end in an error: ${formatFixed(count, 0)}.`,
  verdictsIntro: "What each verdict means; the value stored in the files is shown on hover:",
  supportByRung:
    "Each cell counts the requests of the check by how the engine's job ended; not asked is a request the engine was not asked.",
  supportByRun: "The same, request by request, for each run.",
  split:
    "This suite has too many requests for one page: each run of it has a page of its own, with its requests and its sections.",
  sections: "One section for each compared request, with the worst verdict of its pairs.",
  noSections: "No request of this run was compared.",
  pending:
    "These jobs wait for an answer: lvrtc collect admits what the operators of file-exchange engines left. Their requests are under Identifiers.",
  noPending: "No job waits for an answer.",
  columns:
    "A limit is the limits file's limit for a check held to a limit, and its review band for a side-by-side check. Hover over a figure's name to see the key the files store it under.",
  referenceVsEach: (reference: string): string => `Every engine against the reference ${reference}.`,
  pairwise:
    "Every engine against every other: each cell has the verdict of the pair and the figure closest to its limit, or furthest past it.",
  recorded: "Values the answers record beside what is compared: listed side by side and never judged.",
  mtf: "The engines' own MTF, field by field, cut by cut and frequency by frequency, as the report lays it out.",
  mtfPair: (a: string, b: string, verdict: string): string =>
    `The differences are of ${a} minus ${b}, a pair whose verdict is ${verdict}.`,
  mtfBands: (onAxis: string, offAxis: string, chiefLanding: string): string =>
    `The review bands are ${onAxis} on the axis and ${offAxis} off it; chief rays that land further apart than ${chiefLanding} mm are of two image points.`,
  baselineHead: (kind: string, suite: string, version: string): string =>
    `A baseline of the ${kind} checks of the suite ${suite}, judged by the limits file, version ${version}.`,
  baselineRuns: "One row for each run of the baseline: the worst verdict of each check and its records by badge.",
  staleness: {
    intro:
      "A badge says whether a record is out of date: whether the lens data, the engine code or the limits it was written with have changed since. A baseline's own page says what each of those is judged against.",
    check:
      "Whether the suite run again would still come to its baseline is for lvrtc baseline check to say, so no record here is labelled 'Out of date, still within limits', 'Changed beyond limits' or 'Side-by-side figure moved'.",
    badges:
      "Out of date names the reasons that hold; up to date says that every reason is known and none holds; unknown names the reasons that could not be judged.",
    policy: "The limits reason is judged against the limits file at hand.",
    policyNone: "The limits reason is not known: the limits file at hand cannot be read.",
    engineAsked: "The engine reason is judged against the engines as they answered when asked.",
    engineAskingLastRun:
      "The engines are being asked; until they answer, the engine reason is judged against the engines as the last run of the suite recorded them.",
    engineAskingNone:
      "The engines are being asked; until they answer, the engine reason is not known, since the suite has no last run to read.",
    engineLastRun: "The engine reason is judged against the engines as the last run of the suite recorded them.",
    engineNone: "The engine reason is not known: the engines were not asked, and the suite has no last run to read.",
    engineFailedLastRun:
      "The engines could not be asked, so the engine reason is judged against the engines as the last run of the suite recorded them.",
    engineFailedNone:
      "The engines could not be asked and the suite has no last run to read, so the engine reason is not known.",
    caseLastRun: "The lens-data reason is judged against the lens states of the last run of the suite.",
    caseNone: "The lens-data reason is not known: the suite has no last run whose lens states can be read.",
    caseSame: "the same lens state in the last run",
    caseMoved: "another lens state in the last run",
    caseRefused: "a run without a lens state in the last run",
    caseUnknown: "no run of this name in the last run",
    snapshot: (version: string): string =>
      `This baseline is a dated snapshot of the limits file, version ${version}: it shows as out of date by its limits against the limits file at hand like any other, and lvrtc verify holds it to the limits file it records.`,
    notAsked:
      "The engines were not asked (lvrtc serve --no-ask): each baseline is judged against the last run of its suite where it has one.",
    asking:
      "The engines are being asked who they are; until they answer, each baseline is judged against the last run of its suite where it has one.",
    asked: "The engines were asked who they are when the dashboard started, or since then from the control page.",
    askFailed: (problem: string): string => `The engines could not be asked (${problem}).`,
  },
  /**
   * What the control page and the job pages say: of starting a suite, collecting, asking the engines again,
   * the jobs, their steps and output, the pending jobs and the exchange directories, and why an action is refused.
   */
  control: {
    intro:
      "The actions of this page start lvrtc commands as children of the dashboard, one job at a time; what they write is what those commands write, and nothing else of the dashboard writes.",
    heavy:
      "A run of real engines (LensVisualizer, the reference tracer, optiland and the others built in) is a heavy command: start one only when no other session runs one.",
    noMaintenance:
      "Baselines and anything that writes the repository have no action here: they are run by hand. Result cache maintenance is planned and confirmed below.",
    busyJob: (job: string): string =>
      `Job ${job} is running: a start, a collect, a run of a lens or store maintenance is refused until it ends.`,
    busyAsking:
      "The engines are being asked who they are: a start, a collect, a run of a lens or store maintenance is refused until they answer, since asking them is a heavy command too.",
    idle: "No job is running.",
    closing: "The dashboard is closing, so it starts nothing.",
    startHow:
      "A job runs lvrtc run of the suite, then lvrtc compare, then lvrtc report, each when the one before it has ended. A run that exits with code 2 started nothing and ends the job, and so does a compare that exits with code 2; a compare that finds a pair that fails or ends in an error (code 1) still goes on to the report. Jobs left pending for a file-exchange engine are no failure.",
    startFields: (most: string): string =>
      `Engines and checks are optional, each a list of ids separated by commas (the suite's own when left empty); jobs is 1 to ${most}, the number of concurrent jobs of lvrtc run.`,
    noSuites: "No suite file is listed: the dashboard lists the files suites/*.json of its root.",
    notConfigured:
      "This dashboard was started without the lists a start and a collect are held to, so it starts and collects nothing.",
    suitePlaceholder: (name: string): string => `<suite:${name}>`,
    ownerOnlySuite: (name: string): string =>
      `The suite ${name} is a full catalog sweep: running it is for the maintainer alone.`,
    ownerOnlyOption: (name: string): string => `${name} (maintainer only)`,
    enginesKnown: (ids: string): string => `Engines that can be named: ${ids}.`,
    rungsKnown: (ids: string): string => `Checks that can be named: ${ids}.`,
    collectHow:
      "Collect runs lvrtc collect for every file-exchange engine of the configuration: each answer an operator left in an inbox is admitted into the result cache, or refused with its reason, and the next run of the suite finds the admitted answers there.",
    askHow:
      "Asking the engines again runs lvrtc engine describe as when the dashboard started, so that the out-of-date badges follow an engine that changed since then.",
    cannotAsk:
      "This dashboard was started without asking the engines (lvrtc serve --no-ask), so it has no way to ask them.",
    noJobs: "No job has been started since the dashboard started.",
    jobsKept: "Jobs are kept in memory while the dashboard runs, and nothing about them is written.",
    pending:
      "Every job of every run directory that waits for an answer from a file-exchange engine, as the run records list it; their requests are under Identifiers.",
    noPending: "No job of any run directory waits for an answer.",
    exchange:
      "Each file-exchange engine's jobs by folder of its exchange directory: handed over (outbox), taken by its operator (pending), answered and not yet collected (inbox), collected, and refused.",
    noExchange: "The configuration defines no file-exchange engine.",
    operator: (engine: string): string =>
      `The operator of ${engine} takes each job of its outbox, answers the job's message.json and leaves the answer in its inbox as a file named after the job; Collect then admits the answers.`,
    jobRunning: "This job is running: the page reloads every two seconds.",
    jobEnded: "This job has ended.",
    output:
      "Each step's standard output and error as they were received, the last 256 KB of them, with the root, the runs directory and the home directory written as <root>, <runsDir> and ~.",
    truncated: "Earlier output of this step was left out.",
    noOutput: "This step printed nothing.",
    stateQueued: "queued",
    stateRunning: "running",
    stateExited: (code: string): string => `exited with code ${code}`,
    stateKilled: (signal: string): string => `killed by ${signal}`,
    stateNotStarted: "could not be started",
    stateNotRun: "not run: an earlier step ended the job",
    stateClosed: "not run: the dashboard closed before it was started",
    collected: "What the collect admitted, refused and left pending, per file-exchange engine.",
    collectUnavailable: (engine: string, reason: string): string => `${engine} could not be collected for: ${reason}`,
    collectNotJson: "The output of lvrtc collect is not JSON.",
    collectNoEngines: "The output of lvrtc collect does not list the engines it collected for.",
    collectTooLong: "The output of lvrtc collect is too long to read.",
    collectNothing: "The configuration defines no file-exchange engine, so nothing was collected.",
    refusedTitle: "Refused",
    refusedToken: "The form does not carry this dashboard's token: reload the control page and try again.",
    refusedOrigin: "The request comes from a page of another origin than this dashboard.",
    refusedSite: "The request comes from another site than this dashboard.",
    refusedType: "An action takes a form, sent as application/x-www-form-urlencoded.",
    refusedSize: (most: string): string => `An action takes a form of at most ${most} KB.`,
    refusedMethod: "An action is taken by the form of the control page, sent by POST.",
    unknownField: (name: string): string => `The form has a field that it does not take: ${name}.`,
    repeatedField: (name: string): string => `The form has the field ${name} more than once.`,
    noSuite: "The form names no suite.",
    unknownSuite: (name: string): string => `The suite ${name} is not one of the suites the dashboard lists.`,
    unknownEngine: (id: string): string => `The engine ${id} is neither defined by the configuration nor built in.`,
    unknownRung: (id: string): string => `The check ${id} is not one of this tool's checks.`,
    emptyId: "A list of ids has an empty entry: name the ids separated by single commas.",
    repeatedId: "A list of ids names an id more than once.",
    badJobs: (given: string, most: string): string =>
      `Jobs must be a whole number from 1 to ${most}, and the form gives "${given}".`,
    lensHow:
      "Run one lens first reads LensVisualizer's catalog (lvrtc lenses list) and, when the key is one of its keys, runs lvrtc mtf on the lens with the profile benchmark (the MTF tab, the run directory mtf-<lensKey>), the profile tabs (the other tabs, tabs-<lensKey>) or both, one after the other; the lens pages then gather the run directories it writes.",
    lensFields: (engines: string, apertures: string, runs: string, most: string): string =>
      `Engines are optional, ids of ${engines} separated by commas (lv alone when left empty); the aperture is one of ${apertures}, or both when left empty; the profile is one of ${runs}, or benchmark when left empty; jobs is 1 to ${most}, and no more than the memory budget of this machine allows.`,
    noLens: "The form names no lens.",
    badLensKey: (key: string): string =>
      `The lens key "${key}" is not of the form of a key of LensVisualizer's catalog.`,
    unknownLensEngine: (id: string, known: string): string =>
      `The engine ${id} is not one that Run this lens names: ${known}.`,
    badAperture: (given: string, known: string): string =>
      `The aperture "${given}" is none of ${known}; leave it empty for both.`,
    badLensRun: (given: string, known: string): string =>
      `The profile "${given}" is none of ${known}; leave it empty for benchmark.`,
    tooManyJobs: (given: string, most: string, budget: string, estimate: string): string =>
      `Jobs ${given} is more than this machine allows: at most ${most}, the memory budget of ${budget} GiB divided by ${estimate} GiB a job and held to the processors available.`,
    lensInCatalog: (key: string): string => `${key} is a key of LensVisualizer's catalog, so lvrtc mtf is run on it.`,
    lensNotInCatalog: (key: string): string =>
      `${key} is not a key of LensVisualizer's catalog, so lvrtc mtf is not run.`,
    catalogUnreadable: "The output of lvrtc lenses list cannot be read, so lvrtc mtf is not run.",
    catalogFailed: (code: string): string =>
      `lvrtc lenses list ended with exit code ${code}, so the catalog was not read and lvrtc mtf is not run.`,
    catalogQuiet: "The list lvrtc lenses list printed is read for the lens key and not shown.",
    lensRunsAt: (suite: string): string => `The run directory of this lens's runs is ${suite}.`,
    storeFailed: (code: string): string =>
      `lvrtc store ended with exit code ${code}: its output above says why as the command states it (an abort of prune where the committed baselines are missing or invalid, a conflict of compress, a store that changed since the plan), and nothing of the dashboard resolves it.`,
  },
  /**
   * What the result cache maintenance of run control says (the maintainer's): planning a prune or a compress as a dry
   * run, confirming it only from its plan's page, held to the store's state the plan was made of, and why a
   * confirmation is refused.
   */
  store: {
    intro:
      "Plan prune and Plan compress run lvrtc store prune or lvrtc store compress as a dry run, which changes nothing, and show its report and the digest of the store's state it is of. The change itself is the confirmation on that plan's page alone, and both the dashboard and the command hold it to that state: where the store or the protected engines changed since, it is refused and nothing is changed.",
    writers:
      "The dashboard sees only its own jobs: an lvrtc command in a terminal or another session that writes the same store is invisible to it. Run maintenance without concurrent suite or store writers; checking that is the maintainer's.",
    pruneRule:
      "Prune after the refreshed baselines are committed, never before a refresh that would need them: an engine version is protected only by a baseline committed to HEAD that names it.",
    compressRule:
      "Compress keeps every key and rewrites each plain entry as its gzip atomically, so it is safe at any time; even so, run it only when no writer is active.",
    temporary:
      "A file of the store whose name ends in .tmp is left by a writer at work or by one that was killed: a confirmation is refused while there is one, and what wrote it is the maintainer's to check.",
    pruneReport:
      "The report as the command printed it, read: the files and bytes kept and removable of each engine, and each removable engine version with its newest entry.",
    compressReport:
      "The report as the command printed it, read: the plain and gzip entries, and the bytes before and after.",
    state: "This report is of the store's state that Identifiers names.",
    dryRun: "This was a dry run: nothing was changed.",
    protectedCount: (count: string): string =>
      `Engine versions that the baselines committed to HEAD protect: ${count}.`,
    problemsCount: (count: string): string => `Entries that cannot be read, and are kept: ${count}.`,
    confirmPrune:
      "Prune runs lvrtc store prune --yes --expect with this state: it deletes the removable entries of this report, and only if the store and the protected engines are still in that state.",
    confirmCompress:
      "Compress runs lvrtc store compress --yes --expect with this state: it compresses the plain entries of this report, and only if the store is still in that state.",
    notConfirmable:
      "No confirmation of this plan is taken: it is not the last store job of the dashboard, or its report was not read whole. Plan again.",
    deleted: (count: string): string => `The prune deleted ${count} entries.`,
    compressed: (count: string): string => `The compress wrote ${count} gzip entries and removed their plain sources.`,
    notJson: "The output of lvrtc store is not JSON.",
    notReport: "The output of lvrtc store is not the report of the action asked.",
    badConfirmation: "A confirmation carries the number of its plan's job and the 64 hex digits of its state.",
    notShown: (action: string): string =>
      `This confirmation is of no plan of ${action} that the dashboard showed with that state: plan again.`,
    superseded: (plan: string): string =>
      `Plan ${plan} is not the last store job of the dashboard any more: plan again.`,
    writerFiles: (count: string): string =>
      `The store holds ${count} temporary files of a writer at work or of one that was killed, so nothing is changed: check what wrote them, and plan again once they are gone.`,
    cannotHold: (problem: string): string =>
      `The store's state cannot be computed again, so nothing is changed: ${problem}`,
    changed: (plan: string): string =>
      `The store or the protected engines changed since plan ${plan} was made, so nothing is changed: plan again.`,
  },
  /** What the charts of the dashboard say: their titles, axes, legends and captions. */
  charts: {
    intro:
      "Each chart is drawn from the numbers of this page's files: hover over a mark to see its value and where it was read from, or how it was derived.",
    storeIntro:
      "The curves and the rays are read from the result cache entries the run record names for this request's jobs, and from no other entry.",
    overlayTitle: (subject: string, field: string, cut: string): string => `${subject}: MTF at field ${field}, ${cut}`,
    overlayIntro:
      "One chart for each field and cut: each engine's own curve as its result cache entry holds it, its first answer and each later step a series of its own. A dashed line is a field its engine calls unconverged, a value that is not a finite number is a gap, and a field without curves is named in the legend with its status.",
    differenceTitle: (subject: string, field: string, cut: string): string =>
      `${subject}: differences at field ${field}, ${cut}`,
    differenceIntro:
      "For each pair of the request, the first engine's curve minus the second's at each frequency where both are finite numbers, each engine by the answer the comparison judges (its last step where that step has data, else its first answer); the shaded band is the review band or the limit the limits file gives the check at that field.",
    heatMapTitle: (subject: string): string => `${subject}: verdicts by run and check`,
    heatMapRun:
      "One row for each run and one column for each check: a cell holds the worst verdict of the pairs of its comparisons, as the files store it, and its pairs by verdict on hover.",
    heatMapBaseline:
      "One row for each run of the baseline and one column for each check: a cell holds the worst verdict of its records, as the files store it, and its records by verdict on hover.",
    heatMapOmitted: (rows: string, most: string): string =>
      `The heat map is left out: it would have ${rows} rows, and a page draws one of at most ${most}.`,
    deviationTitle: (subject: string, place: string, a: string, b: string): string =>
      `${subject}: hit distance by ${place}, ${a} and ${b}`,
    deviationIntro:
      "For each pair of the request, the largest distance between the two engines' hits on each surface (on each visit, for a trace of a folded path) over the rays ok in both answers, leaving out a visit either answer records no point for, as the ray-trace check measures its largest hit distance. A distance of 0 is a ring on the axis, a surface where no ray is ok in both is a dash, and the line is the limit of the limits file.",
    deviationLargest: (largest: string, recorded: string): string =>
      `The largest bar is ${largest} mm, and the comparison records a largest hit distance of ${recorded} mm.`,
    deviationDiffers: (largest: string, recorded: string): string =>
      `The largest bar, ${largest} mm, is not the largest hit distance the comparison records, ${recorded} mm.`,
    deviationUnmeasured: "The comparison records no largest hit distance for this pair.",
    deviationNoBars: (recorded: string): string =>
      `No surface has a ray ok in both answers whose visit both record, and the comparison records a largest hit distance of ${recorded} mm.`,
    deviationNotFinite: (largest: string): string =>
      `The comparison records a largest hit distance that is not a finite number, and the largest bar is ${largest} mm.`,
    deviationNoBarsDiffers: (recorded: string): string =>
      `No surface has a bar, yet the comparison records a largest hit distance of ${recorded} mm.`,
    setAside: (a: string, b: string, kind: string, reason: string): string =>
      `The comparison sets this field aside for ${a} and ${b} (${kind}: ${reason}), so their differences enter no band.`,
    differenceLeftOut: (a: string, b: string, verdict: string): string =>
      `The comparison's verdict on ${a} and ${b} is "${verdict}", so no difference of the pair is drawn.`,
    storeMissing: (engine: string, key: string): string =>
      `The result cache has no entry ${key} for ${engine}, so that answer is not drawn.`,
    storeInvalid: (engine: string, problem: string): string =>
      `The result cache entry for ${engine} cannot be read, so that answer is not drawn: ${problem}`,
    noAnswer: (engine: string, status: string): string => `${engine} has no answer to draw: its job is ${status}.`,
    notInRunRecord: "not in the run record",
    noReasonStated: "no reason stated",
    notTraces: (problem: string): string => `The two answers cannot be set side by side: ${problem}.`,
    noCharts: "No chart applies to this request.",
    axisFrequency: "Frequency (cycles/mm)",
    axisMtf: "MTF",
    axisDifference: "Difference of MTF",
    axisSurface: "Surface",
    axisVisit: "Visit",
    axisDistance: "Largest hit distance (mm, log scale)",
    legendStep: (engine: string, step: string): string => `${engine} #${step}`,
    legendState: (series: string, state: string, reason: string): string => `${series} (${state}: ${reason})`,
    legendNoCurves: (series: string, status: string): string => `${series} (no curves: ${status})`,
    legendPair: (a: string, b: string): string => `${a} minus ${b}`,
    legendBand: (kind: string, value: string): string => `${kind} ±${value}`,
    legendBar: "largest hit distance",
    legendZero: "0 mm",
    legendNone: "no ray ok in both",
    legendGate: (value: string): string => `limit ${value} mm`,
    legendNoPair: "no cell of this run and check",
    derivedDifference: (a: string, b: string, element: string): string =>
      `${a} minus ${b} at element ${element} of both curves`,
    derivedDeviation: (a: string, b: string, place: string, index: string): string =>
      `the largest distance between the hits of ${a} and ${b} on ${place} ${index}, over the rays ok in both answers whose visit both record`,
    tipField: (field: string, source: string): string => `field ${field}: ${source}`,
    tipPoint: (series: string, cut: string, frequency: string, value: string, source: string): string =>
      `${series}, ${cut} at ${frequency} cycles/mm: ${value} (${source})`,
    tipDifference: (
      pair: string,
      frequency: string,
      frequencySource: string,
      value: string,
      derivation: string,
      of: string,
    ): string => `${pair} at ${frequency} cycles/mm (${frequencySource}): ${value}, derived: ${derivation} of ${of}`,
    tipLimit: (kind: string, value: string, where: string, source: string): string =>
      `${kind} ±${value} ${where}: ${source}`,
    onAxis: "on the axis",
    offAxis: "off the axis",
    anyField: "at every field",
    tipBar: (place: string, index: string, value: string, derivation: string, of: string): string =>
      `${place} ${index}: ${value}, derived: ${derivation} of ${of}`,
    tipGate: (value: string, source: string): string => `limit ${value} mm: ${source}`,
    tipRecorded: (source: string): string => `largest hit distance recorded: ${source}`,
    recordedLabel: (value: string): string => `largest hit distance recorded ${value} mm`,
    millimetres: (value: string): string => `${value} mm`,
    tipCell: (run: string, rung: string, verdict: string, counts: string): string =>
      `${run}, ${rung}: ${verdict}. By verdict: ${counts}`,
    countOf: (label: string, count: string): string => `${label}: ${count}`,
    legendVerdict: (label: string, stored: string): string => `${label} (${stored})`,
    tipEmptyCell: (run: string, rung: string): string => `${run}, ${rung}: no cell of this run and check`,
    tipSeries: (series: string, reason: string): string => `${series}: ${reason}`,
  },
  /**
   * What a lens page says: of the runs of a lens and their conditions, the picker, the curves chosen, the
   * reference, the differences within the reference's request (as a section page draws them) and the others, which
   * no comparison judges, and running the lens from run control.
   */
  lens: {
    intro:
      "This page gathers every run of the run directories whose lens state names this lens, with the condition of each: its zoom and focus positions, its stop, its object, its image plane and its wavelengths.",
    lensOfRun:
      "A run is of the lens its lens state file names; two lenses whose lens states are the same share one file, and its runs are listed under the lens that file names.",
    noRuns: "No run of the run directories has a lens state that names this lens.",
    noMtf: "no mtf.native answer",
    planeNotRecorded: "not recorded",
    objectInfinity: "at infinity",
    indexIntro: "Every lens that a lens state of a run directory names, with how many runs of it there are and where.",
    noLenses: "No lens state of a run directory names a lens.",
    pickerIntro:
      "Choose runs, checks, engines and their steps, fields and cuts: each curve of those choices is read from the result cache entry the run record names for its job, and from no other entry.",
    pickerHow:
      "The form sends the choice in the address of this page, so that a choice can be kept as a link; a reference is one of the curves the choice draws.",
    quickIntro:
      "Each link beside a run draws one request of it at its first field, tangential, of every engine, against the first curve.",
    nothingChosen: "No curve is chosen: choose at least one run, check, engine, field and cut.",
    noCurvesOfChoice: "The choice has no curve: no answer of those runs, checks and engines states a field chosen.",
    tooMany: (count: string, most: string): string =>
      `The choice has ${count} curves, and a page draws at most ${most}: choose fewer.`,
    unknownValues: (values: string): string => `Some of the choice is not of this lens and is left out: ${values}.`,
    unknownParameters: (names: string): string =>
      `The address has parameters that a lens page does not take, and they are left out: ${names}.`,
    curves: "The curves chosen, in the order they are drawn, with the condition of each run as the table above has it.",
    noAnswers: "Jobs of the choice that have no curves to draw:",
    overlayTitle: (key: string, count: string): string => `${key}: MTF of ${count} curves`,
    overlayIntro:
      "Each curve as its result cache entry holds it, numbered as in the list of curves: a dashed line is a field its engine calls unconverged, a value that is not a finite number is a gap, and a curve without values is named in the legend with why.",
    referenceNone:
      "No reference is chosen: choose one of the curves in the form, or with the link beside it, to see the differences against it.",
    referenceNotChosen: "The reference is not among the curves of this choice, so no difference is drawn.",
    referenceNoValues: (why: string): string =>
      `The reference has no values to subtract, so no difference is drawn: ${why}`,
    reference: (curve: string): string => `The reference is curve ${curve}.`,
    useAsReference: "use as reference",
    isReference: "the reference",
    withinSubject: (key: string, suite: string, run: string, rung: string): string =>
      `${key}, ${suite}, ${run}, ${rung}`,
    withinIntro:
      "Curves that answer the reference's own request at its field and cut, of a pair its comparison judges: each curve minus the reference at each frequency where both are finite numbers, with the verdict the comparison gives the pair and the review band or the limit the limits file gives its check at that field, as the section page of that request draws them.",
    withinSection: "The section page of the reference's request:",
    notJudged: (curve: string, judged: string): string =>
      `Curve ${curve} is not the answer the comparison judges for its engine, which is ${judged}; the band is the comparison's all the same.`,
    otherTitle: (key: string): string => `${key}: differences that no comparison judges`,
    otherIntro:
      "Each other curve minus the reference at each frequency where both are finite numbers. A curve of another run, another request, another field or the other cut is of another condition or another question, and a pair of one request that no comparison judges has no verdict either: each line here is a subtraction of two curves and no verdict of any engine, and no band applies to it.",
    otherWhy: (curve: string, reason: string): string => `Curve ${curve} is ${reason}.`,
    whyOtherDirectory: "of another run directory",
    whyOtherRun: "of another run",
    whyOtherRequest: "of another check or request of the same run",
    whyOtherField: "at another field of the same request",
    whyOtherCut: "of the other cut",
    whySameEngine: "of the reference's own engine",
    whyNotCompared: "of a request whose run directory was not compared",
    whyNoPair: "of a pair that the comparison of the request does not judge",
    frequenciesDiffer: (curve: string): string =>
      `Curve ${curve} is not taken at the reference's frequencies, so no difference of it is drawn: no curve is interpolated.`,
    noValues: (curve: string, why: string): string => `Curve ${curve} has no values to subtract: ${why}`,
    unavailable: (reason: string): string => `its engine calls the field unavailable (${reason}).`,
    legendCurve: (curve: string, name: string): string => `${curve}: ${name}`,
    legendMinus: (curve: string, reference: string): string => `${curve} minus ${reference}`,
    curveName: (engine: string, run: string, rung: string, field: string, cut: string): string =>
      `${engine}, ${run}, ${rung}, field ${field}, ${cut}`,
    tipCurve: (curve: string, run: string): string => `curve ${curve}: ${run}`,
    runIntro:
      "Run this lens starts lvrtc mtf as a job of run control, with the profile benchmark (the MTF tab), the profile tabs (LensVisualizer's other tabs) or both: the lens wide open and at the MTF tab's f/8 comparison, at the design plane and at LensVisualizer's best axial focus, at the reference wavelength and at the photopic spectrum's wavelengths, a zoom at both ends. It writes the run directories of the lens, mtf-<lensKey> and tabs-<lensKey>, which this page then gathers.",
    runHeavy: "With real engines it is a heavy command: start it only when no other session runs one.",
    runNotConfigured: "This dashboard was started without run control's lists, so it cannot run a lens.",
    compareLink: "LensVisualizer beside optiland, a tab at a time:",
  },
  /**
   * What the "LV vs optiland" pages say: a lens at a time, in one condition chosen by chips, a card for
   * each of LensVisualizer's tabs with its identical rays and its own analysis beside its counterpart's, and a page of
   * each card's charts.
   */
  compare: {
    title: (key: string): string => `LV vs optiland: ${key}`,
    tabTitle: (key: string, tab: string): string => `LV vs optiland: ${key}, ${tab}`,
    lead: "Each card is a tab of LensVisualizer, its heading the verdict of its identical rays (held to a limit) and of its own analysis beside its counterpart's (side by side). Choose the condition with the chips, and open a card's charts for the curves.",
    cardVerdicts: (gated: string, counterparts: string, recorded: string): string =>
      `identical rays ${gated}, beside ${counterparts} ${recorded}`,
    cardVerdictsGated: (gated: string): string => `identical rays ${gated}`,
    counterpartsJoin: " and ",
    columnRung: "Check",
    columnPairs: "Pairs",
    columnLargest: "Largest",
    columnGate: "Limit",
    columnRequest: "Request",
    columnPair: "Pair",
    columnVerdict: "Verdict",
    columnFigures: "Figures",
    columnFields: "Fields",
    columnRead: "Read from",
    pairText: (a: string, b: string): string => `${a} beside ${b}`,
    gatedLargest: (metric: string, value: string, a: string, b: string): string => `${metric} ${value} (${a} and ${b})`,
    fromBaselineShort: (stem: string): string => `baseline ${stem}`,
    lineNote: (rung: string, label: string, reason: string): string =>
      `${rung}${label === "" ? "" : ` (${label})`}: ${reason}`,
    notesSummary: "What the comparisons say of the fields they set aside",
    detailHeading: (rung: string, label: string, a: string, b: string): string =>
      `${rung}${label === "" ? "" : ` (${label})`}: ${a} beside ${b}`,
    intro:
      "This page sets LensVisualizer's own analyses of this lens beside optiland's, a tab at a time, in one condition: a lens state of the lens, as the chips below choose it. Each card has two kinds of line. The identical rays: each engine traces the rays the tab launches, and the limits file holds every pair of engines to a limit. The tab's own analysis beside its counterpart's (optiland's, or for vignetting this tool's flux of LensVisualizer's rays): two methods set side by side with no limit, whose figures stand beside the review bands of the limits file at hand.",
    recordedMeaning:
      "A side-by-side pair fails nothing: it is side by side where each figure with a review band is inside it, and worth a look where one is beyond it or the comparison set a field aside because the inputs differ. The comparison sorts every field or wavelength before any difference is taken: only one of two methods enters a figure, and the counts say how many it placed in each class (fields compared, of two methods; fields whose inputs differ, fields not converged, and fields an engine has no answer for, each set aside).",
    chipsIntro:
      "A condition is a lens state of the lens: its zoom and focus positions, its stop semi-diameter, its image plane (the MTF setup's kind of plane where a run has one, else the plane's position) and its wavelengths, as the lens state files state them. A chip keeps the facets before it, and a facet after it gives way to its first value where the lens state chosen so far has another.",
    chipsMuted:
      "A chip in grey is of lens states with no comparison of LensVisualizer beside a counterpart (a run directory of an older run, say): it is listed, and chosen only where it is asked.",
    facetPosition: "Position",
    facetStop: "Stop",
    facetPlane: "Image plane",
    facetLines: "Wavelengths",
    chipPosition: (zoom: string, focus: string): string => `zoom ${zoom}, focus ${focus}`,
    chipNoPosition: "no zoom or focus position",
    chipStop: (value: string): string => `stop semi-diameter ${value} mm`,
    chipDesign: "design plane",
    chipBestAxial: "LensVisualizer's best axial focus",
    chipPlaneKind: (kind: string): string => `plane ${kind}`,
    chipPlaneAt: (z: string): string => `image plane at z ${z} mm`,
    chipOneLine: (wavelength: string): string => `${wavelength} nm`,
    chipLines: (count: string, first: string, last: string): string => `${count} wavelengths, ${first} to ${last} nm`,
    runsIntro: "The runs of this condition, each of the lens state shown:",
    severalCases: (count: string): string =>
      `The chips leave ${count} lens states of the lens: every card gathers the comparisons of all of them.`,
    noCases: "No run of the run directories has a lens state of this lens that can be read.",
    unknownParameters: (names: string): string =>
      `The address has parameters that a compare page does not take, and they are left out: ${names}.`,
    conditionGaveWay: (facet: string, asked: string): string =>
      `The ${facet} asked, ${asked}, is of no lens state in the condition chosen so far, so the first one is shown.`,
    gatedHeading: "Identical rays",
    recordedHeading: "Beside its counterpart",
    gatedLine: (rung: string, pairs: string): string => `${rung}: ${pairs}.`,
    gatedHeadline: (metric: string, value: string, a: string, b: string, gate: string): string =>
      `The largest ${metric} is ${value} (${a} and ${b}), against a limit of ${gate}.`,
    gatedHeadlineNoGate: (metric: string, value: string, a: string, b: string): string =>
      `The largest ${metric} is ${value} (${a} and ${b}); the limits file at hand gives it no limit.`,
    gatedPair: (a: string, b: string, verdict: string): string => `${a} and ${b} ${verdict}`,
    gatedFromRuns: (suites: string): string => `Read from the comparisons of the run directories ${suites}.`,
    gatedFromBaselines: (stems: string): string =>
      `Read from the committed records of this lens state in the baselines ${stems}: their engines may have moved since, as the badges of the baseline pages say.`,
    gatedNone: (rung: string): string =>
      `${rung}: no comparison of this lens state in the run directories or the baselines.`,
    recordedHead: (rung: string, label: string, a: string, b: string, verdict: string): string =>
      `${rung}${label === "" ? "" : ` (${label})`}: ${a} beside ${b}, ${verdict}.`,
    metricBand: (name: string, value: string, band: string): string => `${name} ${value}, review band ±${band}`,
    metricNoBand: (name: string, value: string): string => `${name} ${value}, no review band`,
    metricLimit: (name: string, value: string, limit: string): string =>
      `${name} ${value}, the sorting's limit ${limit}`,
    countText: (name: string, value: string): string => `${name} ${value}`,
    recordedReason: (reason: string): string => `The comparison says: ${reason}`,
    fromBaseline: (stem: string, run: string): string =>
      `Read from the committed record of the run ${run} in the baseline ${stem}: a record keeps no values to draw, so run the lens to see its charts.`,
    alsoIn: (suites: string): string =>
      `The same request of this lens state is compared in ${suites} too; the lens's own run directory, else the first by name, is shown.`,
    notCompared: (rung: string): string =>
      `${rung}: no comparison of LensVisualizer beside its counterpart in this condition, in the run directories or the baselines.`,
    runTabsHint:
      "The tabs answer at the reference wavelength and the design plane; Run this lens with the profile tabs, or both, writes their comparisons.",
    flux: (name: string): string =>
      `The counterpart of the vignetting tab is ${name}, this tool's estimate from the ray lattices LensVisualizer launches and traces: optiland has no vignetting analysis.`,
    detailsLink: "Charts of this card",
    cardsLink: "Every card of this condition",
    sectionLink: "The section page of this request:",
    detailsIntro:
      "Each side-by-side comparison of this card in this condition: each value both answers recorded, set on shared axes, and below it the first engine's value minus the second's. A difference is drawn only for a field or wavelength the comparison sorts as of two methods (repeated by this tool's own functions from the values it recorded); one it sets aside is named with its class and reason. The shaded band is the review band the limits file at hand gives the value's figure, and a chart says where it gives none.",
    mtfIntro:
      "An MTF comparison is drawn as its section page draws it, with the series and the pair of LensVisualizer and its counterpart only.",
    noDetails: "This comparison has no values to draw.",
    noSectionCharts:
      "The charts of this request cannot be drawn: its run directory has no section of it that can be read.",
    pairTitle: (subject: string, values: string, axis: string): string => `${subject}: ${values} against ${axis}`,
    fanTitle: (subject: string, axis: string, field: string): string => `${subject}: ${axis} fan at field ${field}`,
    fanIntro:
      "One chart for each field: each engine's transverse error at each sample of its fan, as its result cache entry holds it, and below it the first engine's error minus the second's at each sample both landed.",
    valuesIntro:
      "One row for each wavelength and value: each engine's value as the comparison recorded it, and the first minus the second for a wavelength of two methods.",
    strip: "Difference",
    legendMinus: (a: string, b: string): string => `${a} minus ${b}`,
    legendGroup: (engine: string, group: string): string => `${engine}, ${group}`,
    legendNoBand: "no review band",
    noBandSaid: (metric: string): string => `The limits file at hand gives ${metric} no review band.`,
    noMetricSaid: "No figure of the limits file is of these values: no review band applies.",
    setAside: (at: string, kind: string, reason: string): string =>
      `${at}: set aside (${kind}: ${reason}), so no difference is drawn.`,
    setAsideAt: (element: string): string => `element ${element}`,
    fanSorting: (kind: string, reason: string): string =>
      `The comparison sets this field aside (${kind}: ${reason}), so no difference is drawn.`,
    fanMissing: (said: string): string => `${said}`,
    tipValue: (series: string, x: string, xSource: string, y: string, source: string): string =>
      `${series} at ${x} (${xSource}): ${y} (${source})`,
    tipDifference: (x: string, xSource: string, value: string, derivation: string, of: string): string =>
      `at ${x} (${xSource}): ${value}, derived: ${derivation} of ${of}`,
    tipBand: (value: string, source: string): string => `review band ±${value}: ${source}`,
    derivedPair: (a: string, b: string, key: string): string => `${a}'s ${key} minus ${b}'s`,
    groupLine: (wavelength: string): string => `${wavelength} nm`,
    groupNoLine: "no wavelength",
    labelFan: (axis: string): string => `fan ${axis}`,
    labelRings: "rings",
    labelMtf: (method: string, fields: string): string => `${method}, fields ${fields}`,
    gatedUnmeasured: (metric: string): string => `No pair of these requests measured ${metric}.`,
    noJob: (engine: string): string => `${engine} has no job of this request in the run record.`,
    noFan: (engine: string): string => `The answer of ${engine} has no fan at this field.`,
    columnLine: "Wavelength",
    columnValue: "Value",
    columnDifference: "Difference",
    columnBand: "Review band",
    indexHeading: "LV vs optiland",
    indexIntro:
      "Each lens with a side-by-side comparison of LensVisualizer beside optiland (or this tool's flux of LensVisualizer's rays) in a run directory of its runs: for each tab, the worst verdict of its identical rays and of its comparisons beside the counterpart, in the lens's first condition (the first position, the largest stop, the design plane, the fewest wavelengths). Open a lens to choose another condition and see the charts.",
    indexNone:
      "No run directory compares LensVisualizer beside optiland for a lens: Run this lens on the control page writes such comparisons.",
    indexCell: (gated: string, recorded: string): string => `${gated} / ${recorded}`,
    noGated: "no identical-ray comparison",
    noneCompared: "not compared",
    noRecorded: "no side-by-side comparison",
    none: "none",
  },
  /**
   * The short labels of the pages: the bar of links, headings, column headers, form labels and buttons, and the
   * phrases a cell or a link is made of. Headings stay short labels.
   */
  labels: {
    home: "lvrtc dashboard",
    runControl: "Run control",
    help: "Help",
    checks: "Checks",
    json: "JSON",
    howToRead: "How to read this page",
    identifiers: "Identifiers",
    none: "none",
    yes: "yes",
    no: "no",
    notKnown: "not known",
    notFinite: "not finite",
    labelStored: (label: string, stored: string): string => `${label} (${stored})`,
    at: (where: string): string => `at ${where}`,
    measured: (count: string): string => `[${count} measured]`,
    derivedTitle: (derivation: string, of: string): string => `derived: ${derivation}${of === "" ? "" : ` of ${of}`}`,
    available: "available",
    unavailable: "unavailable",
    unavailableCode: "unavailable:",
    notFound: "Not found",
    index: "Index",
    indexHeading: "Runs and baselines",
    runs: "Runs",
    baselines: "Baselines",
    lenses: "Lenses",
    engines: "Engines",
    verdicts: "Verdicts",
    support: "What each engine answered",
    sections: "Sections",
    pendingJobs: "Pending jobs",
    notCovered: "Not covered",
    figures: "Figures and their limits",
    referenceVsEach: "Each engine against the reference",
    pairwise: "Every pair",
    consensus: "Consensus",
    recorded: "Values each engine recorded",
    mtf: "MTF",
    charts: "Charts",
    heatMap: "Verdicts by run and check",
    overlays: "MTF of each answer",
    differences: "Differences of each pair",
    deviations: "Hit distance by surface or visit",
    upToDate: "Up to date?",
    mtfTable: "Table",
    peer: (name: string, place: string): string => `${name}: peer ${place}`,
    runOf: (name: string): string => `Run of ${name}`,
    runPart: (run: string, name: string): string => `${run}, a run of ${name}`,
    lensOf: (key: string): string => `Lens ${key}`,
    lensNamed: (key: string, name: string): string => `Lens ${key}: ${name}`,
    baselineOf: (stem: string): string => `Baseline ${stem}`,
    baselineRun: (run: string, stem: string): string => `${run}, a run of the baseline ${stem}`,
    sectionOf: (name: string, section: string): string => `${name}: section ${section}`,
    sectionLink: (suite: string, section: string): string => `${suite}, section ${section}`,
    quantity: "quantity",
    noPolicyEntry: "no entry in the limits file",
    columns: {
      suite: "Suite",
      jobs: "Jobs",
      compared: "Compared",
      pairsByVerdict: "Pairs by verdict",
      failing: "Fail or error",
      problems: "Problems",
      baseline: "Baseline",
      kind: "Kind",
      limitsFile: "Limits file",
      records: "Records",
      recordsByVerdict: "Records by verdict",
      recordsByBadge: "Records by whether up to date",
      lens: "Lens",
      name: "Name",
      runCount: "Runs",
      runDirectories: "Run directories",
      runDirectory: "Run directory",
      engine: "Engine",
      engines: "Engines",
      status: "Status",
      version: "Version",
      run: "Run",
      lensState: "Lens state",
      requests: "Requests",
      sections: "Sections",
      worstVerdict: "Worst verdict",
      pairing: "How the engines are paired",
      check: "Check",
      request: "Request",
      section: "Section",
      quantity: "Quantity",
      verdict: "Verdict",
      step: "Step",
      figure: "Figure",
      unit: "Unit",
      limit: "Limit",
      floorLimit: "Floor limit",
      reason: "Reason",
      value: "Value",
      element: "Element",
      field: "Field",
      angle: "Angle (deg)",
      sampling: (column: string): string => `${column}: sampling note, samples across, last change on refining`,
      chiefLanding: "Chief landing (mm)",
      rimRaysLost: "Rim rays lost",
      rimSpread: "Rim spread (mm)",
      class: "Class",
      cut: "Cut",
      frequency: "Frequency (cycles/mm)",
      difference: "Difference",
      band: "Review band",
      meaning: "Meaning",
      badge: "Badge",
      staleBy: "Records out of date by it",
      notKnownBy: "Records where it is not known",
      inBaseline: "In the baseline",
      now: "Now",
      pair: "Pair",
      requestsByVerdict: "Requests by verdict",
      figures: "Figures",
      classified: "Classified",
      job: "Job",
      steps: "Steps",
      keptFiles: "Kept files",
      keptBytes: "Kept bytes",
      removableFiles: "Removable files",
      removableBytes: "Removable bytes",
      removableEngine: "Removable engine",
      engineVersion: "Engine version",
      files: "Files",
      bytes: "Bytes",
      newestEntry: "Newest entry",
      plainEntries: "Plain entries",
      gzipEntries: "Gzip entries",
      bytesBefore: "Bytes before",
      bytesAfter: "Bytes after",
      collected: "Collected",
      rejected: "Rejected",
      stillPending: "Still pending",
      rejectedJob: "Rejected job",
      zoom: "Zoom",
      focus: "Focus",
      stop: "Stop semi-diameter (mm)",
      object: "Object",
      imagePlane: "Image plane",
      wavelengths: "Wavelengths",
      mtfRequests: "MTF requests",
      curve: "Curve",
      state: "State",
      reference: "Reference",
      label: "Label",
      stored: "Stored as",
      term: "Term",
      id: "Id",
      newId: "Future id",
      whatItIs: "What it is",
      compares: "Compares",
      shows: "Shows",
      doesNotShow: "Does not show",
      runsWhen: "Runs",
      engineCode: "Engine code",
      toolCode: "This tool's code behind it",
      engineCodeNow: "Engine code now",
      toolCodeNow: "This tool's code now",
    },
    identifierRows: {
      suiteFile: "suite file",
      limitsFile: "limits file",
      limitsFileName: "limits file's name",
      lensState: "lens state",
      request: "request",
      storeState: "result cache state",
    },
    control: {
      startSuite: "Start a suite",
      runOneLens: "Run one lens",
      collect: "Collect",
      maintenance: "Result cache maintenance",
      engines: "Engines",
      jobs: "Jobs",
      pendingJobs: "Pending jobs",
      exchange: "Exchange directories",
      suite: "Suite",
      enginesField: "Engines",
      checksField: "Checks",
      jobsField: "Jobs",
      lensKey: "Lens key",
      profile: "Profile",
      aperture: "Aperture",
      both: "both",
      start: "Start",
      collectButton: "Collect",
      planPrune: "Plan prune",
      planCompress: "Plan compress",
      ask: "Ask the engines again",
      runLens: "Run this lens",
      prune: "Prune",
      compress: "Compress",
      planOf: (action: string): string => `Plan of result-cache ${action}`,
      storeAction: (action: string): string => `Result-cache ${action}`,
      kindPlan: (action: string): string => `plan of result-cache ${action}`,
      kindConfirmed: (action: string): string => `confirmed result-cache ${action}`,
      kindStart: "start",
      kindLens: "run of a lens",
      kindCollect: "collect",
      job: (job: string, what: string): string => `Job ${job}: ${what}`,
      jobTitle: (job: string): string => `Job ${job}`,
      startOf: (suite: string): string => `start of ${suite}`,
      aSuite: "a suite",
      runOfLens: (key: string): string => `run of the lens ${key}`,
      collected: "Collected",
      bytes: (bytes: string, gib: string): string => `${bytes} B (${gib} GiB)`,
      steps: {
        run: "Run the suite",
        compare: "Compare",
        report: "Report",
        collect: "Collect",
        catalog: "Read LensVisualizer's catalog",
        mtf: "Run the MTF profile",
        tabs: "Run the tabs profile",
        store: "Result cache maintenance",
      },
    },
    lens: {
      choose: "Choose curves",
      curves: "Curves",
      differences: "Differences",
      within: "Within the reference's request",
      other: "Differences that no comparison judges",
      runLens: "Run this lens",
      runs: "Runs",
      checks: "Checks",
      engines: "Engines",
      fields: "Fields",
      cuts: "Cuts",
      reference: "Reference",
      draw: "Draw",
      noReference: "none",
      objectAt: (z: string): string => `z ${z}`,
      shifted: (shift: string): string => `, shifted ${shift} mm`,
    },
  },
  /** What "How to read this page" says on each page: a few sentences, a page's own first. */
  howTo: {
    index:
      "Each run directory is the last run of a suite: its jobs, and its pairs of engines by verdict once it is compared. Each baseline is a committed record of a suite, with its records by verdict and whether each is up to date. Each lens has a page of its own. Open a run, a baseline or a lens for more.",
    run: "A run asks each engine one request at a time; a check compares the answers of two engines to the same request. Each request that was compared is a section: open it for its figures, verdicts and charts.",
    runPart:
      "One run of a suite whose run page is split: what each engine answered for its requests, and its sections.",
    section:
      "One compared request: each figure of the check with its limit or review band, the verdict of each pair of engines, and the charts of their answers.",
    baseline:
      "A baseline is the committed record of a suite: for each run, check and pair of engines, the verdict and its figures. A record is out of date when the lens data, the engine code or the limits file it was written with have changed since.",
    baselineRun:
      "The records of one run of the baseline: each check's pairs, verdicts and figures, and whether each is up to date.",
    control:
      "Run control starts lvrtc commands as children of the dashboard, one job at a time, and shows what they print. A run of real engines is heavy.",
    job: "One job of run control: each step's command line, what became of it and what it printed.",
    lens: "Every run of this lens in the run directories, and the MTF curves of the runs, checks, engines, fields and cuts you choose, against a reference curve.",
    help: "The words of the dashboard: what each term, verdict, outcome and badge means, and the engines.",
    checks:
      "Every check this tool makes of LensVisualizer: what it compares, what it shows and does not show, which engines it is asked of, and its limits from the limits file at hand.",
    identifiers:
      "Identifiers tell one version of a file, an engine, a lens state or a request from another; they are hashes, and they are kept under Identifiers.",
  },
  /** What the help page says beyond the glossary's own words (`GLOSSARY_TEXT`). */
  help: {
    intro:
      "This dashboard shows how LensVisualizer's optics compares with independent engines. The same words are in docs/GLOSSARY.md and lvrtc glossary, which also list the older words of this tool that each term replaces.",
    outcomes: "Baseline outcomes",
    outcomesIntro:
      "What lvrtc baseline check says of each record of a baseline when the suite is run again. The dashboard runs nothing again, so it never says these.",
    reasons: "Why a record is out of date",
    badges: "Badges",
    badgesIntro: "What the dashboard says of each record of a baseline, from the files alone.",
    statuses: "Rows of an MTF comparison",
    checksLink: "Every check, with what it compares and its limits:",
  },
  /** What the checks page says beyond the words of lvrtc checks (`CHECKS_COMMAND_TEXT`). */
  checksPage: {
    limitsFile: (version: string): string => `The limits are those of the limits file at hand, version ${version}.`,
    noLimitsFile: "The limits file at hand cannot be read, so no limit is shown.",
    noLimits: "No figure of this check has a limit or a review band in the limits file.",
  },
  /** How a number the dashboard computes was derived: each a `Derived`'s derivation, read back by the tests. */
  derivations: {
    largestChiefLandingLimit: "the largest chief-landing limit the two judged columns record at the first field",
    larger: (name: string): string => `the larger ${name} of the two judged columns`,
    chiefLandingDistance: "the distance between the chief-ray landings of the two judged columns",
    judgedDifference: "the first judged column minus the second",
    curve: (curve: string): string => `curve ${curve}`,
  },
} as const;

/** What the charts of a compare page call a recorded value or an axis, with its unit; the name itself otherwise. */
export const COMPARE_AXES: Readonly<Record<string, string>> = Object.freeze({
  field: "Field (fraction of the half field)",
  fieldAngleDeg: "Field angle (degrees)",
  wavelengthNm: "Wavelength (nm)",
  profile: "Zone (fraction of the pupil)",
  rmsRadiusMm: "RMS radius (mm)",
  centroidXMm: "Centroid x (mm)",
  centroidYMm: "Centroid y (mm)",
  profileMm: "Longitudinal aberration (mm)",
  marginalInterceptZ: "Marginal intercept z (mm)",
  percent: "Distortion (percent)",
  realHeightMm: "Real height (mm)",
  entrancePupilZ: "Entrance pupil z (mm)",
  exitPupilZ: "Exit pupil z (mm)",
  chiefLandingMm: "Chief-ray landing (mm)",
  tangentialShiftMm: "Tangential focus shift (mm)",
  sagittalShiftMm: "Sagittal focus shift (mm)",
  geometricTransmission: "Geometric transmission",
  relativeIllumination: "Relative illumination",
  pupil: "Pupil coordinate",
  errorMm: "Transverse error (mm)",
});
