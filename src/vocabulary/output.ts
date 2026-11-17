// The words of what the commands print: the labels of their lines, the legend of the ids those lines keep, their
// summaries and what they advise. The stored values (job statuses, verdicts, outcomes, comparison modes) do not
// change; a line shows the label, and `--json` keeps every key and value as it is.
import type { Verdict } from "../contract/comparison.ts";

/** How a job of `lvrtc run` ended, by its stored status (`ResultStatus`). */
export const JOB_STATUS_TEXT: Readonly<Record<string, string>> = {
  ok: "answered",
  unsupported: "not computed",
  error: "error",
  pending: "waiting for an operator",
};

/** How a job of `lvrtc run` came by its answer, by its stored source (`JobSource`), in a job's line. */
export const JOB_SOURCE_TEXT: Readonly<Record<string, string>> = {
  computed: "asked now",
  cached: "from the cache",
  negotiated: "not offered",
  unavailable: "engine unusable",
};

/** The same, in the counts of a summary, where the cache is named in full. */
export const JOB_SOURCE_SUMMARY_TEXT: Readonly<Record<string, string>> = {
  ...JOB_SOURCE_TEXT,
  cached: "from the result cache",
};

/** A verdict in a line of its own: as short as the label allows, each still the verdict's own words. */
export const VERDICT_SHORT: { readonly [verdict in Verdict]: string } = {
  PASS: "Pass",
  FLOOR: "Within a numerical floor",
  FAIL: "Fail",
  RECORDED: "Side by side",
  ATTENTION: "Side by side, worth a look",
  UNSUPPORTED: "Not computed",
  BLOCKED: "Not judged",
  ERROR: "Error",
};

/** The short label of a verdict; anything else is returned unchanged. */
export function verdictShort(verdict: string): string {
  return Object.hasOwn(VERDICT_SHORT, verdict) ? VERDICT_SHORT[verdict as Verdict] : verdict;
}

/** How the engines of a check are set beside each other (`ComparisonMode`): the label in a line, and its meaning. */
export const MODE_TEXT: Readonly<Record<string, { readonly label: string; readonly meaning: string }>> = {
  "reference-vs-each": {
    label: "against the reference",
    meaning: "each engine beside the reference engine",
  },
  pairwise: {
    label: "every pair",
    meaning: "every two engines beside each other",
  },
};

/** The label of a comparison mode; anything else is returned unchanged. */
export function modeLabel(mode: string): string {
  return MODE_TEXT[mode]?.label ?? mode;
}

/** The legend a command prints once, of the ids its lines keep. */
export const LEGEND_TEXT = {
  checks: "Checks",
  engines: "Engines",
  pairs: "Pairs",
  /** After the engines a configuration defines, which have no name but their id. */
  configured: "defined in this configuration",
  /** Of the ids `lvrtc run` printed as its jobs ended. */
  above: "The ids in the lines above:",
} as const;

/** What `lvrtc run` prints around its jobs. */
export const RUN_OUTPUT_TEXT = {
  jobs: "jobs",
  job: "job",
  runRecord: "run record",
  notStarted: "was not started",
  noRays: "a field has no rays",
  noFineRays: "a field has no rays on the finer lattice",
  noSpotRays: "a spot or fan has no rays",
  noAxialRays: "the axial tabs have no rays",
  noChiefRays: "a chief-ray tab has no rays",
  noCurvatureRays: "the field curves have no rays",
  noVignettingRays: "the vignetting sets",
  warning: "warning",
} as const;

/** What `lvrtc compare` prints around its pairs. */
export const COMPARE_OUTPUT_TEXT = {
  pairs: "pairs",
  pair: "pair",
  comparisons: "comparisons",
  reference: "the reference engine",
} as const;

/** What `lvrtc baseline check` and `baseline write` print. */
export const BASELINE_OUTPUT_TEXT = {
  records: "records",
  record: "record",
  outOfDate: "out of date",
  changedIn: "changed in",
  suiteChanged: "the suite file is not the one the committed results name: its contents changed",
  changes:
    "Figures that are not what the committed results have, by check, pair and figure (in how many records, the largest change, and its run):",
  notANumber: "a value that is no number",
  atMost: "at most",
  of: "of",
  meansTitle: "What this means:",
  maintainersTitle: "Maintainers:",
  error: "Error",
  runRecord: "run record",
  means: {
    DRIFT:
      "Changed beyond limits: in a check held to a limit a verdict changed, or a judged figure moved by more than its limit.",
    MOVED:
      "Side-by-side figure moved: a side-by-side check has another verdict, or a figure of it moved by more than its review band. It fails nothing.",
    failing: "A pair fails, or ends in an error, today.",
    REFRESHABLE:
      "Out of date, still within limits: the committed results are of another lens state, engine version or limits file, and what they hold is still so today.",
    newOrGone: "New or no longer run: the suite, its engines or its checks are not those of the committed results.",
    OK: "Unchanged: the committed results are of the lens states, engines and limits file at hand. Nothing to do.",
  },
  maintainers: {
    DRIFT:
      "Do not write the baseline anew before the cause is known: lvrtc report <suite> shows the run as it is now, and docs/gotchas.md classifies the causes that are known.",
    MOVED: "Read what moved, then lvrtc baseline write <name> writes it as it is now.",
    failing: "lvrtc compare <suite> names each pair and its reason.",
    REFRESHABLE: "To write it as it is now: lvrtc baseline write <name>, then commit baselines/ and reports/.",
    newOrGone: "lvrtc baseline write <name> writes the suite as it is.",
  },
  wrote: "wrote",
  runs: "runs",
  run: "run",
  engines: "engines",
  limitsFile: "limits file",
  snapshot: "is a dated snapshot of the limits file",
  heldTo: "lvrtc verify holds it to",
  notFrozen: "which is not yet frozen",
} as const;

/** What `lvrtc verify` prints. */
export const VERIFY_OUTPUT_TEXT = {
  baseline: "committed results of",
  limitsFile: "limits file",
  rendered: "are what it renders",
  written: "are written from it",
  snapshot: "a dated snapshot of the limits file",
  heldTo: "held to",
  closing:
    "No engine was run: whether a lens state or an engine has changed since the results were written (out of date) is what lvrtc baseline check finds, not this command.",
  snapshotHeld: "it is held to the limits file it was written with, not to the one at hand",
  snapshotNotRewritten: "and is not written anew with it",
  /** Listed failures of a suite whose runs no committed baseline holds yet: neither used nor unused until it does. */
  pending: (count: number, suite: string): string =>
    `${count} listed ${count === 1 ? "failure is" : "failures are"} pending, ${count === 1 ? "its run" : "their runs"} ` +
    `in no committed ${suite} baseline yet:`,
} as const;

/** What `lvrtc check-lv` (and `npm run verify:real`) prints. */
export const CHECK_LV_OUTPUT_TEXT = {
  /** "2 sets of committed results to check, one at a time, of <root>:" */
  set: "set of committed results",
  sets: "sets of committed results",
  plan: "to check, one at a time, of",
  checks: "checks",
  atMost: "at most",
  jobsAtOnce: "jobs at once",
  jobAtOnce: "job at once",
  perJob: "GiB a job",
  checking: "checking",
  with: "with",
  summary: "summary",
  /** What a set of committed results came to. */
  status: {
    clean: "clean",
    "not clean": "not clean",
    interrupted: "interrupted",
  } as Readonly<Record<string, string>>,
  notRun: "not run",
  records: "records",
  record: "record",
  outOfDate: "out of date",
  changedIn: "changed in",
  /** Failures of a suite whose list of known failures (`file`) lists them as they are. */
  listedFails: (file: string): string =>
    file === "docs/known-failures.json"
      ? "pairs fail as docs/known-failures.json lists them (failures of the dated catalog snapshot, each explained there)"
      : `pairs fail as ${file} lists them (each explained there)`,
  cleanAll: "every result of",
  cleanMeans: "is unchanged, out of date but still within its limits, or a side-by-side figure that moved",
  notClean: "not clean",
  remaining: "the remaining sets were not checked",
  drift: "changed beyond limits",
  /** Failures and errors that the suite's list of known failures (`file`) does not list. */
  failing: (file: string): string => `pairs fail or end in an error today and are not listed in ${file}`,
  failingOne: (file: string): string => `pair fails or ends in an error today and is not listed in ${file}`,
  newProblem: "new: the suite is not the one the committed results are of",
  goneProblem: "no longer run: the suite is not the one the committed results are of",
  otherProblem: "neither unchanged, out of date but within limits, nor a side-by-side figure that moved",
  noRecords: "no result was checked",
  exited: "the check exited",
  moved: "with a side-by-side figure that moved: this fails nothing",
  suiteNote: "the suite file is not the one the committed results name",
  stoppedBy: "stopped by",
  interruptedHint: "was interrupted; if the memory watchdog ended it, run again with fewer --jobs",
  clean: "clean",
  files: "engine files",
  checkout: "checkout",
  notGit: "not a git checkout",
  dirty: "dirty",
  noVersion: "(no version)",
} as const;

/** What `lvrtc mtf` prints of its progress and of a single request. */
export const MTF_OUTPUT_TEXT = {
  runsOn: "runs on",
  withChecks: "with the checks",
  cacheNote: "what the result cache holds is not computed again",
  reused: "reused from the result cache",
  notStarted: "was not started",
  engineUnusable: "could not be used",
  runDirectory: "run directory",
  profile: "profile",
  state: "lens state",
  result: "result",
} as const;

/** What `lvrtc engine describe` prints of an engine. */
export const ENGINE_OUTPUT_TEXT = {
  available: "available",
  unavailable: "cannot be used",
  version: "version",
  /** How a check of the conformance kit ended. */
  conformance: { pass: "passed", fail: "failed", skipped: "skipped" } as Readonly<Record<string, string>>,
} as const;

/** What `lvrtc collect` prints of each engine. */
export const COLLECT_OUTPUT_TEXT = {
  notCollected: "nothing collected",
  collected: "answers taken into the result cache",
  rejected: "refused",
  pending: "still waiting for the operator",
  rejectedJob: "refused",
  none: "no file-exchange engine is configured: nothing to collect",
} as const;

/** The legend of the columns of `lvrtc lenses show`. */
export const LENSES_SHOW_LEGEND =
  "Columns: label LensVisualizer's name of the surface; R radius of curvature (mm, flat for a plane); d gap to the next surface at this focus and zoom (mm); nd refractive index after the surface at the lens's reference wavelength; sd clear semi-diameter (mm; on the stop, the stop radius); clips whether that rim stops rays (no for a rim LensVisualizer drew for a rear plate); z vertex position (mm); asphere whether the surface has aspheric terms; synthetic a surface LensVisualizer adds itself (rearPlate: a rear plate).";

/** What the commands print about an error of LensVisualizer or of an engine, under the message. */
export const ERROR_OUTPUT_TEXT = {
  fix: "What this means and what to do",
} as const;

/** The note a command prints once when it read a check or an engine under the id it had before it was renamed. */
export const OLD_ID_TEXT = {
  note: "note: some ids were read under their new names",
  check: "check",
  engine: "engine",
  isNow: "is now",
  advice: "write the new ids; the old ones will stop being read when the catalog is next refreshed",
  /** What `lvrtc run` says when the checks were named by `--rungs`, the older spelling of `--checks`. */
  olderOption:
    "note: --rungs is the older spelling of --checks and was read as --checks; write --checks, since --rungs will stop being read when the catalog is next refreshed",
} as const;

/** The identifiers `--details` shows: hashes that tell one engine version, lens state or request from another. */
export const IDENTIFIERS_TEXT = {
  title: "Identifiers",
  option:
    "also show the identifiers: the hashes of the engines' code, of the lens states and of the requests, which tell one version from another",
  engineCode: "engine code",
  toolCode: "this tool's code behind it",
  suite: "suite file",
  lensState: "lens state",
  request: "request",
  version: "version",
  committed: "committed",
  today: "today",
  lvFiles: "LensVisualizer's engine files",
  optilandSources: "optiland's source files",
} as const;

/** What `lvrtc doctor` prints of the engines' identity: plain rows, and the hashes under `--details`. */
export const DOCTOR_OUTPUT_TEXT = {
  loads: "loads",
  files: "files",
  answers: "answers",
  filesHash: "files hash",
  codeHash: "code hash",
  sources: "sources",
  hash: "hash",
  toolCode: "tool code",
  noneStated: "none stated",
} as const;

/** How a cell of the support matrix ended: a job's status, or not asked for an engine a request was not put to. */
export const SUPPORT_STATUS_TEXT: Readonly<Record<string, string>> = {
  ...JOB_STATUS_TEXT,
  "not-run": "not asked",
};

/** How the engines of a check are compared, by the limits file's `mode` of the check (`RungMode`). */
export const METHOD_TEXT: Readonly<Record<string, string>> = {
  direct: "numbers of each engine set against each other",
  "identical-rays": "one estimator on each engine's trace of the same rays",
  "independent-method": "each engine's own method",
};

/** What a figure's limit in the limits file is: a limit a pair must be within, or a review band. */
export const LIMIT_KIND_TEXT: Readonly<Record<string, string>> = {
  tolerance: "limit",
  attention: "review band",
};

/** A side-by-side check's limit of a metric of `SORTING_LIMITS`: it sorts a field before any difference is taken. */
export const SORTING_LIMIT_LABEL = "sorting limit";

/** Which checks a baseline file records, by its kind: the rays checks or the MTF checks. */
export const BASELINE_KIND_TEXT: Readonly<Record<string, string>> = {
  rays: "ray",
  mtf: "MTF",
};

/** The kind of check (`CheckKind`) of a class of the limits file: `gated` is held to a limit, `recorded` side by side. */
export const CLASS_KIND: Readonly<Record<string, "limit" | "side-by-side">> = {
  gated: "limit",
  recorded: "side-by-side",
};

/** The label of a value of one of the sets above; a value with no label is returned unchanged. */
export function valueLabel(labels: Readonly<Record<string, string>>, value: string): string {
  return Object.hasOwn(labels, value) ? labels[value] : value;
}

/** Where a comparison found a figure (its `where`), by the key it states: what a place is called on a screen. */
export const PLACE_TEXT: Readonly<Record<string, string>> = {
  line: "wavelength",
  field: "field",
  ray: "ray",
  surface: "surface",
  visit: "visit",
  index: "element",
  cut: "cut",
  frequencyPerMm: "frequency (cycles/mm)",
};

/**
 * What `lvrtc baseline check` prints of what moved in a record (`CheckRecord.moved`, whose words `--json` keeps): a
 * verdict list by labels, "— now" between what was and what is, and a limit by what it is.
 */
export const MOVED_TEXT = {
  verdicts: (was: string, now: string): string => `verdicts were ${was} — now ${now}`,
  figure: (name: string, was: string, now: string, limit: string): string =>
    `${name} was ${was} — now ${now} (${limit})`,
  /** A Fail of a suite that lists known failures, which its list (`file`) does not list as it is. */
  listedFailure: (suite: string, file: string): string =>
    `a ${suite} Fail that ${file} does not list as it is (new, changed or unclassified)`,
  /** Between two things that moved in one record. */
  separator: " | ",
} as const;
