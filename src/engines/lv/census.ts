// The export census: what became of every lens of the LensVisualizer catalog when it was exported, a zoom at both
// ends. A census is a snapshot for people: counts, hashes and lens keys, never a surface, and nothing asserts it.
import type { EngineDetails } from "../../contract/result.ts";
import { FEATURE_FLAGS, FEATURE_LIMITS, deriveFeatures } from "../../contract/features.ts";
import type { FeatureFlag, FeatureLimit } from "../../contract/features.ts";
import { CONTRACT_VERSION } from "../../contract/version.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import type { ExportCaseResult } from "./exportCase.ts";
import { ZOOM_ENDS } from "./zoomEnds.ts";
import type { ZoomEnd } from "./zoomEnds.ts";

/** The file names of a census, inside the directory it is written to. */
export const CENSUS_FILES = { json: "lv-export.json", markdown: "lv-export.md" } as const;

/** What became of one lens in one state: the result of exporting it, or the message of what the exporter threw. */
export interface CensusLens {
  readonly key: string;
  /** The end of the zoom the lens was exported at; absent for a prime, which has one state. */
  readonly end?: ZoomEnd["end"];
  readonly outcome: ExportCaseResult | { readonly threw: string };
}

/** How many states there are of one kind, and what became of them. */
export interface CensusCounts {
  /** `exported + notExportable + threw`. */
  readonly states: number;
  readonly exported: number;
  readonly notExportable: number;
  readonly threw: number;
}

/** The lenses that have one problem code in at least one of their states. */
export interface CensusReason {
  /** The states that have the code. */
  readonly states: number;
  /** The lenses that have it in any state: keys, sorted. */
  readonly lenses: readonly string[];
  /** Of those, the zooms that have it at the wide end only. */
  readonly wideOnly: readonly string[];
  /** Of those, the zooms that have it at the tele end only. */
  readonly teleOnly: readonly string[];
}

/** The census of one export of the whole catalog. Every list of lens keys is sorted. */
export interface ExportCensus {
  readonly kind: "lv-export-census";
  /** The contract version the cases were written to. */
  readonly contract: string;
  /** The LensVisualizer checkout: `commit`, `dirty`, `engineClosureHash` and `engineFileCount`. */
  readonly lensVisualizer: EngineDetails;
  /** What every lens was exported as. */
  readonly request: {
    /** A prime in its one state; a zoom at both ends, zoom 0 and zoom 1. */
    readonly zoom: "both-ends";
    readonly focus: "infinity";
    readonly aperture: "wide-open";
    readonly lines: "reference";
    readonly imagePlane: "design";
  };
  /** The lenses of the catalog. */
  readonly lenses: number;
  /** Of those, the zooms: each has two states, a prime one. */
  readonly zooms: number;
  /** Lens files the catalog could not index; they are no lens of the census. */
  readonly unindexedFiles: number;
  /** The states that were exported, `lenses + zooms` of them: `exported + notExportable + threw.length`. */
  readonly states: number;
  /** The states that have a case. */
  readonly exported: number;
  /** The states that have a coded problem in place of a case. */
  readonly notExportable: number;
  /** The same counts for the primes, and for each end of the zooms. */
  readonly byState: Readonly<Record<"prime" | ZoomEnd["end"], CensusCounts>>;
  /**
   * The states whose export threw, which is a defect of the exporter: none, in a healthy census. A lens key, with
   * the end in brackets for a zoom.
   */
  readonly threw: readonly string[];
  /** Per problem code, the lenses that have it. A state with several problems is under each of its codes. */
  readonly reasons: { readonly [code: string]: CensusReason };
  /** Per feature flag, the number of exported cases that carry it. */
  readonly features: Readonly<Record<FeatureFlag, number>>;
  /** Per provenance note, the number of exported cases that carry it. */
  readonly notes: { readonly [note: string]: number };
  /**
   * Per numeric limit, the largest value an exported case needs, and the first lens, by key and then wide before
   * tele, that needs it, with the end of the zoom when it is one.
   */
  readonly limits: Readonly<
    Record<FeatureLimit, { readonly max: number; readonly lens: string | null; readonly end?: ZoomEnd["end"] }>
  >;
}

function byCodeUnit(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** An object with its keys sorted, so that equal censuses are written alike. */
function sortedRecord<T>(entries: Iterable<readonly [string, T]>): Record<string, T> {
  return Object.fromEntries([...entries].sort(([a], [b]) => byCodeUnit(a, b)));
}

/** The place of a state among those of its lens: a prime's one state, then wide, then tele. */
function endOrder(end: CensusLens["end"]): number {
  return end === undefined ? 0 : 1 + ZOOM_ENDS.findIndex((candidate) => candidate.end === end);
}

/**
 * The census of an export of the catalog, every prime in its one state and every zoom at both ends: `lenses` holds
 * what became of each state, `fingerprint` identifies the checkout and `unindexedFiles` counts the lens files the
 * catalog could not index. Pure: equal arguments give an equal census, whatever order the states are given in.
 */
export function buildCensus(input: {
  readonly fingerprint: EngineDetails;
  readonly unindexedFiles: number;
  readonly lenses: readonly CensusLens[];
}): ExportCensus {
  const states = [...input.lenses].sort((a, b) => byCodeUnit(a.key, b.key) || endOrder(a.end) - endOrder(b.end));
  const threw: string[] = [];
  const reasons = new Map<string, { key: string; end: CensusLens["end"] }[]>();
  const notes = new Map<string, number>();
  const features = Object.fromEntries(FEATURE_FLAGS.map((flag) => [flag, 0])) as Record<FeatureFlag, number>;
  const limits = Object.fromEntries(FEATURE_LIMITS.map((limit) => [limit, { max: 0, lens: null }])) as Record<
    FeatureLimit,
    { max: number; lens: string | null; end?: ZoomEnd["end"] }
  >;
  const counts = (): { states: number; exported: number; notExportable: number; threw: number } => ({
    states: 0,
    exported: 0,
    notExportable: 0,
    threw: 0,
  });
  const byState = { prime: counts(), wide: counts(), tele: counts() };

  for (const { key, end, outcome } of states) {
    const tally = byState[end ?? "prime"];
    tally.states++;
    if ("threw" in outcome) {
      tally.threw++;
      threw.push(end === undefined ? key : `${key} (${end})`);
    } else if (outcome.ok) {
      tally.exported++;
      const { system, conditions, provenance } = outcome.opticalCase;
      for (const flag of outcome.opticalCase.features) features[flag]++;
      for (const note of provenance.notes ?? []) notes.set(note, (notes.get(note) ?? 0) + 1);
      const needed = deriveFeatures(system, conditions).limits;
      for (const limit of FEATURE_LIMITS) {
        if (needed[limit] > limits[limit].max) {
          limits[limit] = { max: needed[limit], lens: key, ...(end === undefined ? {} : { end }) };
        }
      }
    } else {
      tally.notExportable++;
      for (const code of new Set(outcome.problems.map((problem) => problem.code))) {
        reasons.set(code, [...(reasons.get(code) ?? []), { key, end }]);
      }
    }
  }

  const reasonOf = (found: readonly { key: string; end: CensusLens["end"] }[]): CensusReason => {
    const ends = new Map<string, CensusLens["end"][]>();
    for (const { key, end } of found) ends.set(key, [...(ends.get(key) ?? []), end]);
    const only = (end: ZoomEnd["end"]): string[] =>
      [...ends].filter(([, of]) => of.length === 1 && of[0] === end).map(([key]) => key);
    return { states: found.length, lenses: [...ends.keys()], wideOnly: only("wide"), teleOnly: only("tele") };
  };
  const total = (member: keyof CensusCounts): number =>
    byState.prime[member] + byState.wide[member] + byState.tele[member];
  return {
    kind: "lv-export-census",
    contract: CONTRACT_VERSION,
    lensVisualizer: input.fingerprint,
    request: { zoom: "both-ends", focus: "infinity", aperture: "wide-open", lines: "reference", imagePlane: "design" },
    lenses: new Set(states.map((state) => state.key)).size,
    zooms: new Set(states.filter((state) => state.end !== undefined).map((state) => state.key)).size,
    unindexedFiles: input.unindexedFiles,
    states: states.length,
    exported: total("exported"),
    notExportable: total("notExportable"),
    byState,
    threw,
    reasons: sortedRecord([...reasons].map(([code, found]) => [code, reasonOf(found)])),
    features,
    notes: sortedRecord(notes),
    limits,
  };
}

/** A census as its JSON file holds it: keys sorted at every depth, indented, with a final newline. */
export function censusJsonText(census: ExportCensus): string {
  return `${JSON.stringify(JSON.parse(canonicalJson(census)), null, 2)}\n`;
}

function table(header: readonly string[], rows: readonly (readonly string[])[]): string[] {
  const line = (cells: readonly string[]): string => `| ${cells.join(" | ")} |`;
  return [line(header), line(header.map(() => "---")), ...rows.map(line)];
}

/** A census as Markdown: a pure function of the census, with no time and no path in it. */
export function renderCensusMarkdown(census: ExportCensus): string {
  const lv = census.lensVisualizer;
  const dirty = lv.dirty === null ? "git state unknown" : lv.dirty ? "dirty" : "clean";
  const code = (text: string): string => `\`${text}\``;
  const reasons = Object.entries(census.reasons);
  const notes = Object.entries(census.notes);

  const lines = [
    "# LensVisualizer export census",
    "",
    "Every lens of the LensVisualizer catalog, exported as an optical case at infinity focus, wide open, at the",
    "design image plane, on its reference line: a prime in its one state, a zoom at both ends, wide (zoom 0) and",
    "tele (zoom 1). A census is a snapshot of one LensVisualizer checkout. It is informational: nothing asserts it,",
    "and it holds counts, hashes and lens keys only.",
    "",
    "Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.",
    "",
    ...table(
      ["Input", "Value"],
      [
        ["LensVisualizer commit", `${lv.commit === null ? "not a git checkout" : code(String(lv.commit))} (${dirty})`],
        ["Engine closure", `${code(String(lv.engineClosureHash))} (${lv.engineFileCount} files)`],
        ["Contract", census.contract],
      ],
    ),
    "",
    "## Outcome",
    "",
    `${census.lenses} lenses, ${census.zooms} of them zooms, in ${census.states} states; ` +
      `${census.unindexedFiles} lens files not indexed.`,
    "",
    ...table(
      ["States", "Count", "Exported", "Not exportable", "Threw"],
      [
        ...(["prime", "wide", "tele"] as const).map((kind) => {
          const { states, exported, notExportable, threw } = census.byState[kind];
          const name = kind === "prime" ? "Primes" : `Zooms, ${kind} end`;
          return [name, ...[states, exported, notExportable, threw].map(String)];
        }),
        ["All", ...[census.states, census.exported, census.notExportable, census.threw.length].map(String)],
      ],
    ),
    "",
    "A state that is not exportable has a reason with a code, below. A state whose export threw is a defect of the",
    "exporter; a healthy census has none.",
    "",
    "## Not exportable, by reason",
    "",
    ...(reasons.length === 0
      ? ["Every state was exported."]
      : [
          "A state with several reasons is counted under each. A zoom is named once, with the end where a reason",
          "applies to one end only.",
          "",
          ...table(
            ["Reason", "States", "Lenses"],
            reasons.map(([reason, { states, lenses }]) => [code(reason), String(states), String(lenses.length)]),
          ),
        ]),
    "",
    ...reasons.flatMap(([reason, { states, lenses, wideOnly, teleOnly }]) => [
      `### ${code(reason)} (${states} ${states === 1 ? "state" : "states"}, ${lenses.length} ` +
        `${lenses.length === 1 ? "lens" : "lenses"})`,
      "",
      ...lenses.map((key) => {
        const only = wideOnly.includes(key) ? " (wide end only)" : teleOnly.includes(key) ? " (tele end only)" : "";
        return `- ${code(key)}${only}`;
      }),
      "",
    ]),
    ...(census.threw.length === 0 ? [] : ["## Threw", "", ...census.threw.map((key) => `- ${code(key)}`), ""]),
    "## Feature flags of the exported cases",
    "",
    ...table(
      ["Flag", "Cases"],
      FEATURE_FLAGS.map((flag) => [code(flag), String(census.features[flag])]),
    ),
    "",
    "## Provenance notes of the exported cases",
    "",
    ...(notes.length === 0
      ? ["No case carries a note."]
      : table(
          ["Note", "Cases"],
          notes.map(([note, count]) => [code(note), String(count)]),
        )),
    "",
    "## Limits: the largest value an exported case needs",
    "",
    ...table(
      ["Limit", "Largest", "Lens"],
      FEATURE_LIMITS.map((limit) => {
        const { max, lens, end } = census.limits[limit];
        return [code(limit), String(max), lens === null ? "" : `${code(lens)}${end === undefined ? "" : ` (${end})`}`];
      }),
    ),
    "",
  ];
  return lines.join("\n");
}
