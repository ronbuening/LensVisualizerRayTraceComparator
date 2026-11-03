// The words of a report about a comparison of two methods. A recorded rung sets estimates side by side, and what
// may be said of it is narrow: every sentence a report writes about one is a template of this file, and a lint
// (`wordingProblems`) rejects the claims no recorded row supports, whoever writes them.
import type { NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";
import type { GroupConsensus, NoConsensusReason } from "./consensus.ts";
import { formatFixed, formatSci, formatSignificant } from "../core/numeric/format.ts";

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

/** Engines as a report names them in a sentence: each in backticks, by commas. */
function engineList(engines: readonly string[]): string {
  return engines.map((engine) => `\`${engine}\``).join(", ");
}

/** Why a group has no consensus (`src/report/consensus.ts`), as the first clause of the sentence under its matrix. */
export const NO_CONSENSUS_TEXT: { readonly [reason in NoConsensusReason]: string } = {
  split: "No consensus: the engines within the gates of each other split into two or more largest sets",
  "no-pair-within": "No consensus: no two engines are within the gates of each other",
  minority:
    "No consensus: the largest set of engines within the gates of each other holds no more than half of the engines placed",
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
      : [`Consensus: ${engineList(group.consensus)}, every two of them within the gates of each other`];
  if (group.outliers.length > 0) {
    const noun = group.outliers.length === 1 ? "outlier" : "outliers";
    clauses.push(`${noun}: ${engineList(group.outliers)}, beyond the gates of every engine of the consensus`);
  }
  if (group.apart.length > 0) {
    clauses.push(`apart: ${engineList(group.apart)}, outside the consensus and not beyond the gates of all of it`);
  }
  if (group.notPlaced.length > 0) {
    clauses.push(`not placed: ${engineList(group.notPlaced)}, with no pair within or beyond the gates`);
  }
  return `${clauses.join("; ")}.`;
}

/** The prose of a report's "Consensus" section, above its tables. */
export const CONSENSUS_SECTION: readonly string[] = [
  "A consensus is looked for on each request of a gated rung that three or more engines were compared on pairwise.",
  "An engine is placed where a pair of it is within or beyond the gates; a pair that is UNSUPPORTED, BLOCKED or ERROR",
  "is not judged and places no engine. The consensus is the largest set of placed engines every two of which are",
  "within the gates of each other, where it is the only largest such set and holds more than half of the engines",
  "placed. An outlier is beyond the gates of every engine of the consensus; an engine apart is outside the",
  "consensus and not beyond the gates of all of it. A consensus says which answers are within the gates of each",
  "other, and no more.",
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
  withoutConsensus: (reason: NoConsensusReason): string => `no consensus: ${reason}`,
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
    name: "consensus-correct",
    why: "a consensus says which answers are within the gates of each other, not which is right or in error",
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

/** Catalog statistics describe recorded pair aggregates, never a production-lens validation claim. */
export const CATALOG_TEXT = {
  complete: "Both catalog baselines are present; duplicate R4 pairs are counted once.",
  pending: "The catalog statistics are incomplete until both catalog baselines are written.",
  units:
    "State statuses use the gravest pair verdict; pair counts use one aggregate per run, rung and engine pair, with feature groups overlapping.",
  census: "Source codes count distinct states; engine codes count distinct run, rung and engine refusals.",
  quantiles:
    "Quantiles interpolate linearly at (n - 1)p over finite gated pair figures; nonfinite figures are counted separately and ranked first in each worst-ten list.",
  failures:
    "Listed failures remain FAIL; each failing metric retains its class, evidence hash, gotcha and one-run reproducer.",
} as const;

/** The rungs the validation matrix names: the statement's, and those of Phase 6, each with what it compares. */
export const MATRIX_RUNGS: Readonly<Record<string, { mode: "gated" | "recorded"; compares: string }>> = {
  ...STATEMENT_RUNGS,
  r7a: { mode: "gated", compares: "Spot and fan figures of the coma and bokeh tabs' rays, on identical rays" },
  r7b: { mode: "recorded", compares: "LV's coma and bokeh tabs beside optiland's SpotDiagram and RayFan" },
  r8a: {
    mode: "gated",
    compares: "Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays",
  },
  r8b: {
    mode: "recorded",
    compares: "LV's spherical-aberration and axial-colour sections beside optiland's own rays and focus",
  },
  r9a: { mode: "gated", compares: "Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays" },
  r9b: {
    mode: "recorded",
    compares: "LV's distortion, pupils and lateral-colour tabs beside optiland's distortion, chief rays and pupils",
  },
  r10a: {
    mode: "gated",
    compares: "Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays",
  },
  r10b: { mode: "recorded", compares: "LV's field-curve sections beside optiland's FieldCurvature" },
  r11a: {
    mode: "gated",
    compares:
      "Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays",
  },
  r11b: { mode: "recorded", compares: "LV's vignetting tab beside flux, the comparator's estimate on LV's lattices" },
  r12b: {
    mode: "recorded",
    compares: "LV's summary tab and aperture control beside optiland's paraxial accessors and working f-number",
  },
  r13b: { mode: "recorded", compares: "The comparator's Seidel sums (ref-seidel) beside optiland's" },
  r14b: {
    mode: "recorded",
    compares: "optiland's Zernike fit beside the comparator's fit of the same raw wavefront samples (optiland-wave)",
  },
};

/** One row of the validation matrix: a LensVisualizer tab, or the analyses it has no tab of. */
export interface MatrixRowText {
  readonly tab: string;
  readonly title: string;
  /** What the row's rungs are of. */
  readonly about: string;
  readonly gated: readonly string[];
  readonly recorded: readonly string[];
  /** What the row does not cover, whatever its counts: fixed sentences, each ending its sentence. */
  readonly notCovered: readonly string[];
}

/** The rows of the validation matrix, in their order. */
export const MATRIX_ROWS: readonly MatrixRowText[] = [
  {
    tab: "foundation",
    title: "Built system, first-order data, rays and optical path",
    about:
      "The foundation of every tab: the system each engine builds from the case, its first-order data, and the hits, landings and optical paths of LensVisualizer's own MTF launch rays.",
    gated: ["r0", "r1", "r2", "r3"],
    recorded: [],
    notCovered: [
      "Folded paths and diffractive surfaces: the suites folded and diffractive have rays baselines of their own, outside the benchmark.",
      "The catalog beyond the benchmark: its baselines are a dated snapshot with a report of their own.",
    ],
  },
  {
    tab: "mtf",
    title: "MTF",
    about:
      "LensVisualizer's MTF tab: the comparator's geometric and wave MTF of LensVisualizer's launch rays traced by each engine, LensVisualizer's own geometric MTF beside the replay of its sampling, and the engines' own MTF side by side.",
    gated: ["r4", "r4f", "r6a"],
    recorded: ["r5", "r5g", "r6b", "r6c"],
    notCovered: ["Each item of the fixed block at the end of this matrix, which every MTF report ends with."],
  },
  {
    tab: "coma-bokeh",
    title: "Coma and bokeh",
    about:
      "LensVisualizer's coma and bokeh tabs: the rings and fans of the coma cloud and the bokeh tile's rings, each sample LensVisualizer's aimed launch ray.",
    gated: ["r7a"],
    recorded: ["r7b"],
    notCovered: [
      "The bokeh tile at the tab's own plane (infSensorZ): deferred.",
      "A finite object and a folded path: coded problems of the run, never approximated; a coma fan on the axis is one of its field.",
      "The spot figures of R7b have no attention band, since the two engines sample the pupil on different rings; only its fan figure has one.",
    ],
  },
  {
    tab: "axial",
    title: "Spherical aberration and axial colour",
    about:
      "LensVisualizer's spherical-aberration section (aberrations tab) and axial-colour section (chromatic tab): the zones of the axial object, at the authored indices and at each colour channel's own.",
    gated: ["r8a"],
    recorded: ["r8b"],
    notCovered: [
      "The colour figures of R8b have no attention band.",
      "Bit identity of LensVisualizer's channel indices at the C, F and g lines: no committed suite asks those lines, and it is not pursued.",
      "A finite object and a folded path: coded problems of the run.",
    ],
  },
  {
    tab: "chief",
    title: "Distortion, lateral colour, pupils and breathing",
    about:
      "LensVisualizer's distortion and pupils tabs and its lateral-colour section: their chief rays, each colour channel's own; breathing is the focal length of each prepared state, which R1 compares; the LensVisualizer-only test breathing.test.ts holds the chart to R1's focal length.",
    gated: ["r9a", "r1"],
    recorded: ["r9b"],
    notCovered: [
      "Breathing between the focus stations LensVisualizer declares: chart positions between stations are no case.",
      "A fisheye's distortion (lv-fisheye-projection): a coded problem of the set.",
      "optiland's pupil aberration: another quantity, never asked.",
      "The figures of R9b have no attention band.",
    ],
  },
  {
    tab: "curvature",
    title: "Field curves and astigmatism",
    about:
      "LensVisualizer's field-curve and astigmatism sections (aberrations tab): the parabasal pencil and the real-ray fans of each field.",
    gated: ["r10a"],
    recorded: ["r10b"],
    notCovered: [
      "LensVisualizer's parabasal pencil is 0.01 mm wide, a convention of its own: its foci are of a finite pencil, beside optiland's infinitesimal pair.",
      "Fields other than the sections' own field fractions.",
    ],
  },
  {
    tab: "vignetting",
    title: "Vignetting and relative illumination",
    about:
      "LensVisualizer's vignetting tab: an aimed lattice on the real stop at each of its fields, the share of it that reaches the image and its flux there.",
    gated: ["r11a"],
    recorded: ["r11b"],
    notCovered: [
      "optiland has no vignetting analysis: the counterpart in R11b is flux, the comparator's estimate on LensVisualizer's lattices, not an external engine.",
      "The relative illumination and the falloff of R11b have no attention band.",
      "States outside the tab's beam model, and fields launched from a bounding sphere: coded problems, with no vignetting set.",
    ],
  },
  {
    tab: "summary",
    title: "Summary and cardinal elements",
    about:
      "LensVisualizer's summary tab and aperture control: its readouts are of the prepared state and LensVisualizer's paraxial kernel, which R1 compares; the LensVisualizer-only test summary.test.ts holds its readouts to R1's values; the tab traces no ray of its own.",
    gated: ["r1"],
    recorded: ["r12b"],
    notCovered: [
      "The half field, the focus distance, the controls and the Current Perspective Pose section of the tab.",
      "The aperture control's paraxial working f-number beside the mark, shown only above a difference of 0.05.",
      "The stop and the track of R12b are read back from the case: they hold the tab to the case, not two engines to each other.",
    ],
  },
  {
    tab: "no-tab",
    title: "Seidel sums, wavefront and Zernike fits (no LensVisualizer tab)",
    about:
      "LensVisualizer presents no Seidel sums, wavefront or Zernike coefficients: these rungs set optiland beside the comparator's own estimates, by OpticStudio's conventions, and no LensVisualizer answer is asked.",
    gated: [],
    recorded: ["r13b", "r14b"],
    notCovered: [
      "optiland's chromatic Seidel sums: optiland states none of an optic of one line.",
      "ref as a third Zernike answer: wavefront.native version 1 carries no launch rays.",
      "OpticStudio's figures to the centroid.",
      "LensVisualizer, which has no tab of these analyses.",
    ],
  },
];

/** The validation matrix's prose; its counts and names are supplied by the reducer. */
export const MATRIX_TEXT = {
  intro:
    "This matrix is rendered from the benchmark's two baselines alone, with no engine, clock or machine input. It has a row for each LensVisualizer analysis tab, a row of the foundation they stand on, and a row of the analyses LensVisualizer has no tab of.",
  counts:
    "A configuration is one named run of the benchmark with a case. A configuration pair is two engines on one configuration and rung; a request pair is two engines on one request. Request-pair counts count every request pair, including unsupported answers; configuration-pair counts count the gravest verdict of each configuration pair. R4 is in both baselines and counts once.",
  gated:
    "A gated rung holds two engines to the tolerances of the policy on the same input, and its verdicts are the ones the baseline holds.",
  recorded:
    "A recorded rung sets two methods side by side with no tolerance and fails nothing: its counts say how many pairs were written down inside an attention band, outside one, or without an answer to set beside the other.",
  unbaselined:
    "A rung marked in no baseline is run only where a run names it and is kept out of every baseline, so this matrix names its quantity and engines and gives no figure of it.",
  absent: "not in the benchmark's baselines",
  inNoBaseline: "in no baseline; run only where named",
  notCovered:
    "Beyond each row's own items, the fixed block that every MTF report ends with says what no comparison of this tool shows:",
} as const;

/**
 * The sentences of the dashboard (`lvrtc serve`, `src/dashboard/html.ts`): what its pages say of runs, comparisons,
 * verdicts, consensus, staleness and the bases staleness is judged against. Headings stay short labels; every
 * sentence is here, and a test lints the visible text of every page rendered from the fixtures. A template that
 * takes HTML is filled with placeholders, escaped, and only then given the HTML (`html.ts`, `fill`).
 */
export const DASHBOARD_TEXT = {
  readOnly: "The dashboard reads the run directories, the baselines and the policy at hand, and writes nothing.",
  sources: "Hover over a number to see the file it was read from and its JSON pointer there.",
  derived: "A number marked as derived is computed by the dashboard from the figures it names, never read from a file.",
  policyAtHand: (name: string, version: string, hash: string): string =>
    `The policy at hand is ${name}, version ${version} (${hash}).`,
  noRuns: "No run directory with a manifest is in the runs directory.",
  noBaselines: "No baseline file is in the baselines directory.",
  documentProblem: (document: string, problem: string): string => `${document} cannot be shown: ${problem}`,
  notReadable: "The manifest of this run cannot be read, so nothing of the run is shown.",
  notCompared: "This run has not been compared: lvrtc compare writes the comparisons that judge it.",
  comparisonsUnreadable: "The comparisons of this run cannot be read, so no verdict of it is shown.",
  inputProblems:
    "The comparisons do not belong with this manifest or with the policy at hand, so their verdicts may be of other inputs:",
  failing: (count: number): string => `Pairs that are FAIL or ERROR: ${formatFixed(count, 0)}.`,
  verdicts: [
    "PASS and FAIL are the verdicts of a gated rung, whose metrics are held to the tolerances of the policy.",
    "FLOOR is a pass that is counted apart.",
    "RECORDED and ATTENTION are the verdicts of a recorded rung, which has no tolerance and fails nothing.",
    "UNSUPPORTED is an answer and not a failure; BLOCKED is a pair that an earlier rung kept from being judged; ERROR is a pair that could not be compared.",
  ],
  supportByRung:
    "Each cell counts the requests of the rung by how the engine's job ended; not-run is a request the engine was not asked.",
  supportByRun: "The same, request by request, for each run.",
  split:
    "This suite has too many requests for one page: each run of it has a page of its own, with its requests and its sections.",
  sections: "One section for each compared request, with the gravest verdict of its pairs.",
  noSections: "No request of this run was compared.",
  pending: "These jobs wait for an answer: lvrtc collect admits what the operators of file-exchange engines left.",
  noPending: "No job waits for an answer.",
  columns: "A limit is the tolerance of the policy for a gated rung and its attention band for a recorded one.",
  referenceVsEach: (reference: string): string => `Every engine against the reference ${reference}.`,
  pairwise:
    "Every engine against every other: each cell has the verdict of the pair and the metric closest to its limit, or furthest past it.",
  recorded: "Values the answers record beside what is compared: listed side by side and never judged.",
  mtf: "The engines' own MTF, field by field, cut by cut and frequency by frequency, as the report lays it out.",
  mtfPair: (a: string, b: string, verdict: string): string =>
    `The differences are of ${a} minus ${b}, a pair whose verdict is ${verdict}.`,
  mtfBands: (onAxis: string, offAxis: string, chiefLanding: string): string =>
    `The attention bands are ${onAxis} on the axis and ${offAxis} off it; chief rays that land further apart than ${chiefLanding} mm are of two image points.`,
  baselineHead: (kind: string, suite: string, hash: string, version: string, policyHash: string): string =>
    `A ${kind} baseline of the suite ${suite} (${hash}), judged by policy v${version} (${policyHash}).`,
  baselineRuns: "One row for each run of the baseline: the gravest verdict of each rung and its records by badge.",
  staleness: {
    intro: "A badge says which reasons of staleness hold for a record against the bases below.",
    check:
      "Whether the suite run again would still come to its baseline is for lvrtc baseline check to say, so no record here is called REFRESHABLE, DRIFT or MOVED.",
    badges:
      "STALE names the reasons that hold; CURRENT says that every reason is known and none holds; NOT KNOWN names the reasons that could not be judged.",
    policy: "The policy reason is judged against the policy at hand.",
    policyNone: "The policy reason is not known: the policy at hand cannot be read.",
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
    caseLastRun: "The case reason is judged against the cases of the last run of the suite.",
    caseNone: "The case reason is not known: the suite has no last run whose cases can be read.",
    caseSame: "the same case in the last run",
    caseMoved: (caseId: string): string => `another case in the last run: ${caseId}`,
    caseRefused: "a run without a case in the last run",
    caseUnknown: "no run of this name in the last run",
    snapshot: (version: string): string =>
      `This baseline is a dated snapshot of policy v${version}: it shows STALE(policy) against the policy at hand like any other, and lvrtc verify holds it to the policy it records.`,
    notAsked:
      "The engines were not asked (lvrtc serve --no-ask): each baseline is judged against the last run of its suite where it has one.",
    asking:
      "The engines are being asked who they are; until they answer, each baseline is judged against the last run of its suite where it has one.",
    asked: "The engines were asked once, when the dashboard started.",
    askFailed: (problem: string): string => `The engines could not be asked (${problem}).`,
  },
} as const;
