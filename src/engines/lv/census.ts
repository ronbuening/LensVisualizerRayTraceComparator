// The export census: what became of every lens of the LensVisualizer catalog when it was exported. A census is a
// snapshot for people: counts, hashes and lens keys, never a surface, and nothing asserts it.
import type { EngineDetails } from "../../contract/result.ts";
import { FEATURE_FLAGS, FEATURE_LIMITS, deriveFeatures } from "../../contract/features.ts";
import type { FeatureFlag, FeatureLimit } from "../../contract/features.ts";
import { CONTRACT_VERSION } from "../../contract/version.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import type { ExportCaseResult } from "./exportCase.ts";

/** The file names of a census, inside the directory it is written to. */
export const CENSUS_FILES = { json: "lv-export.json", markdown: "lv-export.md" } as const;

/** What became of one lens: the result of exporting it, or the message of what the exporter threw. */
export interface CensusLens {
  readonly key: string;
  readonly outcome: ExportCaseResult | { readonly threw: string };
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
    readonly zoomT: 0;
    readonly focus: "infinity";
    readonly aperture: "wide-open";
    readonly lines: "reference";
    readonly imagePlane: "design";
  };
  /** The lenses of the catalog: `exported + notExportable + threw.length`. */
  readonly lenses: number;
  /** Lens files the catalog could not index; they are no lens of the census. */
  readonly unindexedFiles: number;
  readonly exported: number;
  readonly notExportable: number;
  /** The lenses whose export threw, which is a defect of the exporter: none, in a healthy census. */
  readonly threw: readonly string[];
  /** Per problem code, the lenses that have it. A lens with several problems is under each of its codes. */
  readonly reasons: { readonly [code: string]: { readonly count: number; readonly lenses: readonly string[] } };
  /** Per feature flag, the number of exported cases that carry it. */
  readonly features: Readonly<Record<FeatureFlag, number>>;
  /** Per provenance note, the number of exported cases that carry it. */
  readonly notes: { readonly [note: string]: number };
  /** Per numeric limit, the largest value an exported case needs, and the first lens, by key, that needs it. */
  readonly limits: Readonly<Record<FeatureLimit, { readonly max: number; readonly lens: string | null }>>;
}

function byCodeUnit(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** An object with its keys sorted, so that equal censuses are written alike. */
function sortedRecord<T>(entries: Iterable<readonly [string, T]>): Record<string, T> {
  return Object.fromEntries([...entries].sort(([a], [b]) => byCodeUnit(a, b)));
}

/**
 * The census of an export of the catalog at the default state: `lenses` holds what became of each lens,
 * `fingerprint` identifies the checkout and `unindexedFiles` counts the lens files the catalog could not index.
 * Pure: equal arguments give an equal census, whatever order the lenses are given in.
 */
export function buildCensus(input: {
  readonly fingerprint: EngineDetails;
  readonly unindexedFiles: number;
  readonly lenses: readonly CensusLens[];
}): ExportCensus {
  const lenses = [...input.lenses].sort((a, b) => byCodeUnit(a.key, b.key));
  const threw: string[] = [];
  const reasons = new Map<string, string[]>();
  const notes = new Map<string, number>();
  const features = Object.fromEntries(FEATURE_FLAGS.map((flag) => [flag, 0])) as Record<FeatureFlag, number>;
  const limits = Object.fromEntries(
    FEATURE_LIMITS.map((limit) => [limit, { max: 0, lens: null as string | null }]),
  ) as Record<FeatureLimit, { max: number; lens: string | null }>;
  let exported = 0;

  for (const { key, outcome } of lenses) {
    if ("threw" in outcome) {
      threw.push(key);
    } else if (outcome.ok) {
      exported++;
      const { system, conditions, provenance } = outcome.opticalCase;
      for (const flag of outcome.opticalCase.features) features[flag]++;
      for (const note of provenance.notes ?? []) notes.set(note, (notes.get(note) ?? 0) + 1);
      const needed = deriveFeatures(system, conditions).limits;
      for (const limit of FEATURE_LIMITS) {
        if (needed[limit] > limits[limit].max) limits[limit] = { max: needed[limit], lens: key };
      }
    } else {
      for (const code of new Set(outcome.problems.map((problem) => problem.code))) {
        reasons.set(code, [...(reasons.get(code) ?? []), key]);
      }
    }
  }
  return {
    kind: "lv-export-census",
    contract: CONTRACT_VERSION,
    lensVisualizer: input.fingerprint,
    request: { zoomT: 0, focus: "infinity", aperture: "wide-open", lines: "reference", imagePlane: "design" },
    lenses: lenses.length,
    unindexedFiles: input.unindexedFiles,
    exported,
    notExportable: lenses.length - exported - threw.length,
    threw,
    reasons: sortedRecord([...reasons].map(([code, keys]) => [code, { count: keys.length, lenses: keys }])),
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
    "Every lens of the LensVisualizer catalog, exported as an optical case at its default state: zoom 0, infinity",
    "focus, wide open, the design image plane, on its reference line. A census is a snapshot of one LensVisualizer",
    "checkout. It is informational: nothing asserts it, and it holds counts, hashes and lens keys only.",
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
    ...table(
      ["Lenses", "Exported", "Not exportable", "Threw", "Lens files not indexed"],
      [[census.lenses, census.exported, census.notExportable, census.threw.length, census.unindexedFiles].map(String)],
    ),
    "",
    "A lens that is not exportable has a reason with a code, below. A lens whose export threw is a defect of the",
    "exporter; a healthy census has none.",
    "",
    "## Not exportable, by reason",
    "",
    ...(reasons.length === 0
      ? ["Every lens was exported."]
      : [
          "A lens with several reasons is counted under each.",
          "",
          ...table(
            ["Reason", "Lenses"],
            reasons.map(([reason, { count }]) => [code(reason), String(count)]),
          ),
        ]),
    "",
    ...reasons.flatMap(([reason, { count, lenses }]) => [
      `### ${code(reason)} (${count})`,
      "",
      ...lenses.map((key) => `- ${code(key)}`),
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
        const { max, lens } = census.limits[limit];
        return [code(limit), String(max), lens === null ? "" : code(lens)];
      }),
    ),
    "",
  ];
  return lines.join("\n");
}
