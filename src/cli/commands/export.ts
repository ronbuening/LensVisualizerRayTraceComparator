import { statSync } from "node:fs";
import { join, resolve } from "node:path";

import type { RunAperture, RunOptions } from "../../contract/runSpec.ts";
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
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand, CliIo } from "../command.ts";

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
  "  --zoom <t>      zoom position from 0 (wide) to 1 (tele); default 0",
  "  --focus <t>     focus position from 0 (infinity) to 1 (closest); default infinity. A position other than 0",
  "                  is exported only where LensVisualizer certifies the object distance of that station",
  "  --aperture <a>  wide-open (default), f/<N> by LensVisualizer's stop-down rule, or r=<mm>, a stop radius",
  "  --lines <set>   reference (default), cdf or photopic: LensVisualizer's lines, weights and indices",
  "  --out <file>    write the case to the file; without it the case is printed",
  "  --all           export every lens at its default state on its reference line, and print the census:",
  "                  how many were exported, how many were not and why, by lens key",
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

/** A slider position from the command line: a number from 0 to 1. */
function position(option: string, text: string): number {
  const value = text.trim() === "" ? Number.NaN : Number(text);
  if (!(value >= 0 && value <= 1)) throw new UsageError(`${option} needs a number from 0 to 1, got "${text}"`);
  return value;
}

/** `--aperture`: "wide-open", "f/<N>" or "r=<mm>", with a positive number. */
function apertureOf(text: string): RunAperture {
  if (text === "wide-open") return { kind: "wide-open" };
  const [, form, digits] = /^(f\/|r=)(.+)$/.exec(text) ?? [];
  const value = digits === undefined || digits.trim() === "" ? Number.NaN : Number(digits);
  if (!(Number.isFinite(value) && value > 0)) {
    throw new UsageError(`--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "${text}"`);
  }
  return form === "f/" ? { kind: "f-number", value } : { kind: "stop-radius", mm: value };
}

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
      zoomT: zoom === undefined ? 0 : position("--zoom", zoom),
      focus: focus === undefined ? { kind: "infinity" } : { kind: "focusT", value: position("--focus", focus) },
    },
    aperture: aperture === undefined ? { kind: "wide-open" } : apertureOf(aperture),
    lines: { kind: lineSet ?? "reference" },
    imagePlane: { kind: "design" },
  };
}

/** Exports one lens and writes its case to `out`, or prints it. */
async function exportOne(
  binding: LvBinding,
  key: string,
  options: ExportOptions,
  out: string | undefined,
  io: CliIo,
): Promise<number> {
  try {
    await binding.lens(key);
  } catch (error) {
    if (error instanceof LvBindingError && error.code === "unknown-lens") throw new UsageError(error.message);
    throw error;
  }
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
  return [
    `${census.lenses} lenses: ${census.exported} exported, ${census.notExportable} not exportable, ` +
      `${census.threw.length} threw`,
    ...reasons.map(([code, { count }]) => `  ${code.padEnd(width)}  ${count}`),
    "",
  ].join("\n");
}

/** Exports every lens of the catalog at its default state and reports the census. */
async function exportAll(binding: LvBinding, censusDir: string | undefined, json: boolean, io: CliIo): Promise<number> {
  const catalog = await binding.catalog();
  const exporter = createLvExporter(binding);
  const lenses: CensusLens[] = [];
  for (const { key } of catalog.entries) {
    try {
      lenses.push({ key, outcome: await exporter.exportLens(key, {}) });
    } catch (error) {
      const threw = error instanceof Error ? error.message : String(error);
      io.stderr(`lvrtc export: threw: ${threw}\n`);
      lenses.push({ key, outcome: { threw } });
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
 * `export <lensKey>` exports the lens in the state the options name (`exportCase`) and writes the case as canonical
 * JSON with a final newline: to `--out`, which is relative to the working directory, or else to the output. A lens
 * that cannot be exported as asked has every reason printed to the error stream, as `<key>: <code>: <message>`.
 *
 * `export --all` exports every lens of the catalog at its default state (zoom 0, infinity focus, wide open, the
 * design image plane) on its reference line, and never stops at a lens: one whose export throws is named and
 * counted. It prints a summary, or with `--json` the census, and with `--census <dir>` writes the census to
 * `lv-export.json` and `lv-export.md` in that directory. The census holds counts, hashes and lens keys only.
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
        return await exportOne(binding, asked.positionals[0], options, path("--out"), io);
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
