// What the committed reports explain to a reader who knows optics and not this tool: the legends of their "How to
// read this" sections. A legend entry is shown only where the report has what it explains (a run name of that form,
// a place of that kind), so every legend is chosen from the baseline alone; the words themselves are fixed.

/** One form of a run's name: shown in a report where a run's name has that form. */
export interface RunNameText {
  /** The part of the name, as a reader finds it. */
  readonly part: string;
  /** Whether a run's name has the part. */
  readonly pattern: RegExp;
  readonly meaning: string;
}

/**
 * The parts a run's name is made of, in the committed suites: a lens key, then each part below that applies. A lens
 * key may itself hold such letters (a lens's own f-number, a prime called "wide"): a pattern reads a part only where
 * the suites put it.
 */
export const RUN_NAME_TEXT: readonly RunNameText[] = [
  {
    part: "-ref",
    pattern: /-ref(?:-wide|-tele|-zoom[0-9.]+)?$/,
    meaning: "the lens state at the lens's reference wavelength alone",
  },
  {
    part: "-photopic",
    pattern: /-photopic(?:-wide|-tele|-zoom[0-9.]+)?$/,
    meaning: "the lens state on several wavelengths, weighted by the eye's daylight (photopic) response",
  },
  {
    part: "-best",
    pattern: /-best-(?:ref|photopic)(?:-|$)/,
    meaning:
      "focused on LensVisualizer's best axial focus for that stop and those wavelengths, in place of the lens's design image plane",
  },
  {
    part: "-f<N>",
    pattern: /-f[0-9.]+-(?:best-)?(?:ref|photopic)(?:-|$)/,
    meaning: "at f/N, the stop LensVisualizer's own rule gives that f-number",
  },
  {
    part: "-wide, -tele",
    pattern: /-(?:wide|tele)(?:-f[0-9.]+)?(?:-best)?(?:-ref|-photopic)?$/,
    meaning: "a zoom lens at the short or the long end of its zoom range",
  },
  {
    part: "-zoom<T>",
    pattern: /-zoom[0-9.]+$/,
    meaning:
      "a zoom lens at a zoom position LensVisualizer publishes: T runs from 0 at the short end of the range to 1 at the long end",
  },
  {
    part: "certified-<lens>-zoom<s>-focus<k>",
    pattern: /^certified-.+-zoom[0-9]+-focus[0-9]+$/,
    meaning:
      "a focus station LensVisualizer declares for the lens, at a finite object distance: s is its zoom station and k its focus keyframe, as LensVisualizer numbers them",
  },
  {
    part: "reference-<design>",
    pattern: /^reference-/,
    meaning:
      "one of LensVisualizer's reference designs, by its key (in the folded and diffractive suites a run's name is the lens key alone)",
  },
];

/** The run-name parts some run of a report has, in the order of `RUN_NAME_TEXT`. */
export function runNameParts(runs: readonly string[]): RunNameText[] {
  return RUN_NAME_TEXT.filter((text) => runs.some((run) => text.pattern.test(run)));
}

/**
 * Where a figure's largest value is (the places of a comparison's `where`), by the key a report writes. `field` has
 * two meanings, by the quantity the engines were asked for: `FIELD_TEXT`.
 */
export const PLACE_MEANING: Readonly<Record<string, string>> = {
  line: "the index of a wavelength in the lens state's list of wavelengths, 0 being the first",
  ray: "the index of a ray in its set",
  surface: "the index of a surface of the lens state",
  visit: "the index of a visit of a ray to a surface, on a folded path that meets a surface more than once",
  sample: "the index of a sampled height on a surface",
  quantity: "the first-order quantity, by its name",
  index: "the index of an element of an answer",
  cut: "the sagittal or the tangential cut of an MTF",
  frequencyPerMm: "the spatial frequency, in cycles per millimetre",
  frequencyIndex: "the index of a frequency of the request",
};

/** What `field` means in a report, by the quantity: an angle traced by rays, or the field a request names. */
export const FIELD_TEXT = {
  /** Any other quantity: the field as its answer names it. */
  other: "in any other check: the field as the engines' answers name it",
  /** A check of the ray-trace quantity: the field angle of the set of rays. */
  angle: "in a check of the ray-trace quantity: the field angle of the set of rays, in degrees (shown with deg)",
  /** A check of an engine's own MTF: the field as the request states it, a fraction of the image height. */
  requested:
    'in a check of an engine\'s own MTF: the field as the request states it, a fraction of the image height, 0 on the axis and 1 at the edge of the image (shown with "of the image height"); an MTF table gives the angle beside it where the answers record one',
} as const;

/** How a field of each kind is written after its number. */
export const FIELD_UNIT = { angle: "deg", requested: "of the image height" } as const;

/** The quantities whose `field` is the field angle in degrees. */
export const FIELD_ANGLE_QUANTITIES: readonly string[] = ["rays.trace"];

/** The quantities whose `field` is the request's fraction of the image height. */
export const FIELD_FRACTION_QUANTITIES: readonly string[] = ["mtf.native"];

/** What the ray counts of a check say: how the rays an engine was handed ended. */
export const RAY_OUTCOME_TEXT =
  "Rays ok / blocked / failed: of the rays an engine was handed, added up over the requests of the run, how many reached the image plane, how many an aperture stopped, and how many the engine could not trace to an end.";

/**
 * What an engine states of itself beside its hashes (`BaselineEngine.details`), in words, by key. The keys of
 * `IDENTIFYING_DETAILS` (a commit, a hash of sources, a distribution version) are identifiers and are shown with the
 * hashes; a key not here is shown as it is stored.
 */
export const ENGINE_DETAIL_TEXT: Readonly<Record<string, (value: string) => string>> = {
  dirty: (value) =>
    value === "true" ? "checkout with uncommitted changes" : value === "false" ? "clean checkout" : `dirty ${value}`,
  engineFileCount: (value) => `${value} engine files`,
  sourceFiles: (value) => `${value} source files`,
  backend: (value) => `backend ${value}`,
  precision: (value) => `precision ${value}`,
  jit: (value) =>
    value === "true" ? "JIT compilation on" : value === "false" ? "JIT compilation off" : `jit ${value}`,
  python: (value) => `Python ${value}`,
  numpy: (value) => `NumPy ${value}`,
  scipy: (value) => `SciPy ${value}`,
  numba: (value) => `Numba ${value}`,
};

/** The details that identify an engine's code, shown with the hashes, each with its words. */
export const IDENTIFYING_DETAILS: Readonly<Record<string, string>> = {
  commit: "commit",
  sourceHash: "source hash",
  distVersion: "distribution version",
};
