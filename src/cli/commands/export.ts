import { statSync } from "node:fs";
import { join, resolve } from "node:path";

import type { RunOptions } from "../../contract/runSpec.ts";
import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { UsageError } from "../../core/usageError.ts";
import { loadLvBinding } from "../../engines/lv/binding.ts";
import type { LvBinding } from "../../engines/lv/binding.ts";
import { createLvExporter } from "../../engines/lv/caseSource.ts";
import { CENSUS_FILES, buildCensus, censusJsonText, renderCensusMarkdown } from "../../engines/lv/census.ts";
import type { CensusLens, ExportCensus } from "../../engines/lv/census.ts";
import { LvBindingError } from "../../engines/lv/errors.ts";
import { problemText } from "../../engines/lv/exportProblems.ts";
import { ZOOM_ENDS, primeZoomNote, teleHint } from "../../engines/lv/zoomEnds.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand, CliIo } from "../command.ts";
import { apertureOption, sliderPosition } from "../lensOptions.ts";

/** What `lvrtc export` is wired to, injected so that tests choose all three. */
export interface ExportCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that `--root`, `--out` and `--census` are relative to. */
  readonly cwd: string;
}

const SYNOPSIS = [
  "Usage: lvrtc export <lensKey> [--zoom <t>] [--focus <t>] [--aperture wide-open|f/<N>|r=<mm>]",
  "                    [--lines reference|cdf|photopic] [--out <file>] [--root <dir>]",
  "       lvrtc export --all [--census <dir>] [--json] [--root <dir>]",
  "",
].join("\n");
const HELP = [
  SYNOPSIS,
  "Writes a LensVisualizer lens as an optical case: the document every engine is asked about. The case is built",
  "from the state LensVisualizer prepares for tracing, at the design image plane.",
  "",
  "  --zoom <t>      zoom position from 0 (wide) to 1 (tele); default 0, the wide end: one lens is exported in one",
  "                  state, and --zoom 1 gives the tele end of a zoom. A prime has no zoom position",
  "  --focus <t>     focus position from 0 (infinity) to 1 (closest); default infinity. A position other than 0",
  "                  is exported only where LensVisualizer certifies the object distance of that station",
  "  --aperture <a>  wide-open (default), f/<N> by LensVisualizer's stop-down rule, or r=<mm>, a stop radius",
  "  --lines <set>   reference (default), cdf or photopic: LensVisualizer's lines, weights and indices",
  "  --out <file>    write the case to the file; without it the case is printed",
  "  --all           export every lens on its reference line, a zoom at both ends (zoom 0 and zoom 1), and print",
  "                  the census: how many states were exported, how many were not and why, by lens key",
  "  --census <dir>  with --all: write the census to <dir>/lv-export.json and <dir>/lv-export.md",
  "  --json          with --all: print the census as JSON in place of the summary",
  "  --root <dir>    the directory that holds lvrtc.config.json (default: this repository)",
  "",
  "Exit code: 0 when the case, or the census, was written; 1 when the lens cannot be exported as asked (each",
  "reason is printed with its code), when LensVisualizer cannot be loaded, and, for --all, when exporting a lens",
  "threw or a lens file could not be indexed; 2 when the command line cannot be used as given, which includes a",
  "key that is not in the catalog.",
  "",
].join("\n");

const VALUE_OPTIONS = ["--zoom", "--focus", "--aperture", "--lines", "--out", "--root", "--census"];
/** The options of the first form of the synopsis, which --all does not take, and those only --all takes. */
const ONE_LENS_OPTIONS: readonly string[] = ["--zoom", "--focus", "--aperture", "--lines", "--out"];
const EVERY_LENS_OPTIONS: readonly string[] = ["--census", "--json"];
const LINE_SETS = ["reference", "cdf", "photopic"] as const;
type ExportOptions = Pick<RunOptions, "state" | "aperture" | "lines" | "imagePlane">;

/** The options of a single export, read from the command line. */
function exportOptions(values: ReadonlyMap<string, string>): ExportOptions {
  const zoom = values.get("--zoom");
  const focus = values.get("--focus");
  const aperture = values.get("--aperture");
  const lines = values.get("--lines");
  const lineSet = LINE_SETS.find((set) => set === lines);
  if (lines !== undefined && lineSet === undefined) {
    throw new UsageError(`--lines needs one of ${LINE_SETS.join(", ")}, got "${lines}"`);
  }
  return {
    state: {
      zoomT: zoom === undefined ? 0 : sliderPosition("--zoom", zoom),
      focus: focus === undefined ? { kind: "infinity" } : { kind: "focusT", value: sliderPosition("--focus", focus) },
    },
    aperture: aperture === undefined ? { kind: "wide-open" } : apertureOption(aperture),
    lines: { kind: lineSet ?? "reference" },
    imagePlane: { kind: "design" },
  };
}

/**
 * Exports one lens and writes its case to `out`, or prints it. `zoomGiven` says whether the command line named a
 * zoom position: a zoom without one is told of its tele end, and a prime with one that it has none.
 */
async function exportOne(
  binding: LvBinding,
  key: string,
  options: ExportOptions,
  zoomGiven: boolean,
  out: string | undefined,
  io: CliIo,
): Promise<number> {
  let zoom: boolean;
  try {
    zoom = (await binding.lens(key)).entry.zoom === true;
  } catch (error) {
    if (error instanceof LvBindingError && error.code === "unknown-lens") throw new UsageError(error.message);
    throw error;
  }
  if (zoom && !zoomGiven) io.stderr(`lvrtc export: ${teleHint(key)}\n`);
  if (!zoom && zoomGiven && options.state?.zoomT !== 0) io.stderr(`lvrtc export: ${primeZoomNote(key)}\n`);
  const result = await createLvExporter(binding).exportLens(key, options);
  if (!result.ok) {
    for (const problem of result.problems) io.stderr(`lvrtc export: ${key}: ${problemText(problem)}\n`);
    return EXIT_FAILURE;
  }
  const text = `${canonicalJson(result.opticalCase)}\n`;
  if (out === undefined) io.stdout(text);
  else writeFileAtomic(out, text);
  return EXIT_OK;
}

/** The lines that say what a census holds. */
function summaryText(census: ExportCensus): string {
  const reasons = Object.entries(census.reasons);
  const width = Math.max(0, ...reasons.map(([code]) => code.length));
  const counted = Math.max(0, ...reasons.map(([, { states }]) => String(states).length));
  return [
    `${census.lenses} lenses (${census.zooms} of them zooms, each at both ends), ${census.states} states: ` +
      `${census.exported} exported, ${census.notExportable} not exportable, ${census.threw.length} threw`,
    ...(["prime", "wide", "tele"] as const).map((kind) => {
      const { states, exported, notExportable, threw } = census.byState[kind];
      const name = (kind === "prime" ? "primes" : `zooms, ${kind}`).padEnd(11);
      return `  ${name}  ${states}: ${exported} exported, ${notExportable} not exportable, ${threw} threw`;
    }),
    ...(reasons.length === 0 ? [] : ["not exportable, by reason (states, lenses):"]),
    ...reasons.map(
      ([code, { states, lenses }]) => `  ${code.padEnd(width)}  ${String(states).padStart(counted)}  ${lenses.length}`,
    ),
    "",
  ].join("\n");
}

/** Exports every lens of the catalog, a zoom at both ends, and reports the census. */
async function exportAll(binding: LvBinding, censusDir: string | undefined, json: boolean, io: CliIo): Promise<number> {
  const catalog = await binding.catalog();
  const exporter = createLvExporter(binding);
  const lenses: CensusLens[] = [];
  for (const { key, zoom } of catalog.entries) {
    const states = zoom === true ? ZOOM_ENDS : [{ end: undefined, zoomT: 0 }];
    for (const { end, zoomT } of states) {
      const state = end === undefined ? { key } : { key, end };
      try {
        lenses.push({ ...state, outcome: await exporter.exportLens(key, { state: { zoomT } }) });
      } catch (error) {
        const threw = error instanceof Error ? error.message : String(error);
        io.stderr(`lvrtc export: threw: ${threw}${end === undefined ? "" : ` (${end} end)`}\n`);
        lenses.push({ ...state, outcome: { threw } });
      }
    }
  }
  for (const { file, problem } of catalog.problems) io.stderr(`lvrtc export: ${file}: ${problem}\n`);

  const { commit, dirty, engineClosureHash, engineFileCount } = binding.fingerprint();
  const census = buildCensus({
    fingerprint: { commit, dirty, engineClosureHash, engineFileCount },
    unindexedFiles: catalog.problems.length,
    lenses,
  });
  if (censusDir !== undefined) {
    writeFileAtomic(join(censusDir, CENSUS_FILES.json), censusJsonText(census));
    writeFileAtomic(join(censusDir, CENSUS_FILES.markdown), renderCensusMarkdown(census));
  }
  io.stdout(json ? censusJsonText(census) : summaryText(census));
  if (censusDir !== undefined && !json) {
    io.stdout(`census: ${join(censusDir, CENSUS_FILES.json)}, ${join(censusDir, CENSUS_FILES.markdown)}\n`);
  }
  return census.threw.length === 0 && census.unindexedFiles === 0 ? EXIT_OK : EXIT_FAILURE;
}

/**
 * Builds `lvrtc export <lensKey>` and `lvrtc export --all`, which read the LensVisualizer checkout of the
 * configuration (`lvPath`) through the binding.
 *
 * `export <lensKey>` exports the lens in the one state the options name (`exportCase`) and writes the case as
 * canonical JSON with a final newline: to `--out`, which is relative to the working directory, or else to the
 * output. A lens that cannot be exported as asked has every reason printed to the error stream, as
 * `<key>: <code>: <message>`. Without `--zoom` a zoom is exported at its wide end, and the error stream says that
 * `--zoom 1` gives the tele end; a prime has no zoom position, and one given for it is ignored, which is said too.
 *
 * `export --all` exports every lens of the catalog (infinity focus, wide open, the design image plane) on its
 * reference line, a prime in its one state and a zoom at both ends, zoom 0 and zoom 1, and never stops at a state:
 * one whose export throws is named and counted. It prints a summary, or with `--json` the census, and with
 * `--census <dir>` writes the census to `lv-export.json` and `lv-export.md` in that directory. The census holds
 * counts, hashes and lens keys only.
 *
 * Exit codes: 0 when the case or the census was written; 1 when the lens cannot be exported as asked, when
 * LensVisualizer is not configured or cannot be loaded, and, for `--all`, when exporting a lens threw or a lens
 * file could not be indexed; 2 for a command line that is not the synopsis, a `--root` that is not a directory, an
 * option of the other form, a value an option cannot take and a key that is not in the catalog, with the nearest
 * keys suggested.
 */
export function createExportCommand(inputs: ExportCommandInputs): CliCommand {
  return {
    name: "export",
    summary: "Write a LensVisualizer lens as an optical case, or the census of every lens",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      try {
        const asked = parseArguments(args, VALUE_OPTIONS, ["--all", "--json"]);
        const all = asked.flags.has("--all");
        const given = (option: string): boolean => asked.values.has(option) || asked.flags.has(option);
        const misplaced = (all ? ONE_LENS_OPTIONS : EVERY_LENS_OPTIONS).find(given);
        if (misplaced !== undefined) {
          throw new UsageError(`${misplaced} ${all ? "cannot be used with --all" : "needs --all"}`);
        }
        const expected = all ? 0 : 1;
        if (asked.positionals.length < expected) throw new UsageError("no lens key was given, and no --all");
        if (asked.positionals.length > expected) {
          throw new UsageError(`unexpected argument "${asked.positionals[expected]}"`);
        }
        const options = all ? undefined : exportOptions(asked.values);
        const root = asked.values.get("--root");
        const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
        if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${root}: not a directory`);
        }
        const path = (option: string): string | undefined => {
          const value = asked.values.get(option);
          return value === undefined ? undefined : resolve(inputs.cwd, value);
        };

        const binding = await loadLvBinding(loadConfig({ rootDir, env: inputs.env }).config.lvPath);
        if (options === undefined) return await exportAll(binding, path("--census"), asked.flags.has("--json"), io);
        return await exportOne(binding, asked.positionals[0], options, asked.values.has("--zoom"), path("--out"), io);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc export: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
    },
  };
}

/** `lvrtc export` wired to this repository, the process environment and the directory the process was started in. */
export const exportCommand: CliCommand = createExportCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
