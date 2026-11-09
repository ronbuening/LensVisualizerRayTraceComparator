// The words of the command line's front door: the top-level help, its groups of commands, and what `lvrtc doctor`
// says to do about what it finds. Each command's own help is in its file; the lists of checks and engines in it are
// generated from this vocabulary.
import { REMEDIES } from "./codes.ts";

/** One line of the top-level help: a command, or one subcommand of it with a summary of its own. */
export interface CliGroupEntry {
  readonly command: string;
  readonly sub?: string;
  /** The summary of a subcommand; a whole command is summarised by its own `summary`. */
  readonly summary?: string;
}

/** One group of the top-level help. */
export interface CliGroup {
  readonly title: string;
  readonly entries: readonly CliGroupEntry[];
}

/** The top-level help, from the first line to the last. */
export const CLI_TEXT = {
  usage: "Usage: lvrtc <command> [options]",
  intro: [
    "lvrtc checks the optics of LensVisualizer: it hands LensVisualizer, an independent reference tracer and optiland",
    "the same lens state and compares their answers, check by check. A check held to a limit passes or fails; a",
    "side-by-side check sets two methods beside each other and fails nothing.",
  ],
  groups: [
    {
      title: "Getting started",
      entries: [{ command: "doctor" }, { command: "checks" }, { command: "glossary" }],
    },
    {
      title: "Check LensVisualizer",
      entries: [
        { command: "check-lv" },
        {
          command: "baseline",
          sub: "check",
          summary: "Run a suite again and say whether its committed results still hold",
        },
        { command: "mtf" },
        { command: "serve" },
      ],
    },
    {
      title: "Look closer",
      entries: [
        { command: "lenses" },
        { command: "export" },
        { command: "run" },
        { command: "compare" },
        { command: "report" },
      ],
    },
    {
      title: "For maintainers",
      entries: [
        { command: "baseline", sub: "write", summary: "Write a suite's committed results from a compared run" },
        { command: "verify" },
        { command: "statement" },
        { command: "matrix" },
        { command: "store" },
        { command: "collect" },
        { command: "engine" },
      ],
    },
  ] satisfies readonly CliGroup[],
  /** The group of any command that no other group names. */
  other: "Other commands",
  none: "(none yet)",
  options: "Options:",
  optionRows: [
    ["-h, --help", "Show this help"],
    ["-v, --version", "Show the version"],
  ],
  footer: [
    "lvrtc help <command> shows what a command does, its options and its exit codes.",
    "lvrtc glossary explains the words on the screens and in the reports; docs/GLOSSARY.md is the same, in full.",
  ],
} as const;

/** What `lvrtc doctor` says under a row that is not as it should be, and in its closing "Ready" section. */
export const DOCTOR_TEXT = {
  fix: "fix",
  node: "Use Node 24.15 or a later 24 release, the version .nvmrc names (nvm use picks it).",
  lvPath: REMEDIES.lvPath,
  lvNotGit:
    "lvrtc check-lv needs LensVisualizer as a git checkout, so that what it checks is a commit: clone it, then set lvPath in lvrtc.local.json (or LVRTC_LV_PATH) to the clone.",
  lvDirty:
    "lvrtc check-lv needs LensVisualizer's checkout clean: commit or set aside its changes, or set lvPath in lvrtc.local.json (or LVRTC_LV_PATH) to a clean checkout.",
  pythonRole:
    "runs the Python engines a configuration defines, such as the demonstration engines under test/fixtures/fake-root; checking LensVisualizer does not need it (optiland has an interpreter of its own)",
  python: REMEDIES.python,
  optilandPython: REMEDIES.optilandPython,
  optilandNotImportable:
    "The interpreter runs but cannot import optiland: install optiland into it, as the README says, or set engines.optiland.python in lvrtc.local.json (or LVRTC_OPTILAND_PYTHON) to an interpreter that can import it.",
  ready: {
    title: "Ready",
    lensVisualizer: "LensVisualizer",
    optiland: "optiland",
    checkLv: "lvrtc check-lv",
    yes: "ready",
    lvCaveat: "ready to load, but lvrtc check-lv refuses a checkout outside git or with uncommitted changes",
    no: "not ready",
    optilandNeeded:
      "lvrtc check-lv and lvrtc baseline check need it; lvrtc lenses, export, mtf (LensVisualizer's own MTF) and run --engines lv,ref work without it",
    checkLvYes: "ready: it runs every check",
    checkLvNo: "not ready: it refuses, running nothing, until each of these is fixed:",
    why: {
      notConfigured: "not configured",
      noCheckout: "no LensVisualizer checkout at the path set",
      notLoadable: "it cannot be loaded",
      noInterpreter: "its interpreter does not run",
      notImportable: "its interpreter cannot import optiland",
      engine: "the engine cannot be used",
    },
    all: "Ready to check LensVisualizer: lvrtc check-lv can run.",
    lvOnly:
      "LensVisualizer can be looked at now: lvrtc lenses, export, mtf (LensVisualizer's own MTF) and run --engines lv,ref work. lvrtc check-lv waits until the fix lines above are done.",
    none: "Not ready to check LensVisualizer: do what the fix lines above say. The demonstration under test/fixtures/fake-root runs without LensVisualizer or optiland (see the README).",
  },
} as const;

/** What `lvrtc checks` says of the checks. */
export const CHECKS_COMMAND_TEXT = {
  intro:
    "A check held to a limit hands two engines the same input and passes or fails. A side-by-side check sets two methods beside each other with no limit and fails nothing.",
  more: "lvrtc checks <id> shows one check in full: what it compares, what it shows and does not show, its engines and its limits. Each check is listed by the id to type today, then the id it had before the rename, which is still read.",
  labels: {
    id: "id",
    oldId: "old id",
    kind: "kind",
    compares: "compares",
    shows: "shows",
    doesNotShow: "does not show",
    engines: "engines",
    runs: "runs",
    limits: "limits",
  },
  enginesOfSuite: "the suite's engines, or those --engines names",
  enginesOwn: "asked of these whatever --engines names",
  runsAlways: "in every run, unless --checks names other checks",
  runsNamed: "only where a suite or --checks names it",
  limitsFile: "from the limits file, version",
  limit: "limit",
  band: "review band",
  bandSeveral: "when either answer has several wavelengths",
  noBand: "no review band",
  sorting: "sorting limit (beyond it a field is set aside before any difference is taken)",
  noLimits: "none",
  unknown: "no check has that id; lvrtc checks lists them",
} as const;

/** What `lvrtc glossary` says around the terms. */
export const GLOSSARY_COMMAND_TEXT = {
  replaces: "replaces",
  stored: "stored as",
  more: "lvrtc glossary <term> shows one term; lvrtc checks lists the checks; docs/GLOSSARY.md has every table in full.",
  unknown: "no entry of the glossary is that word; lvrtc glossary lists the terms",
} as const;
