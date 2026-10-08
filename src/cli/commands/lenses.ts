import { statSync } from "node:fs";
import { resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { UsageError } from "../../core/usageError.ts";
import { loadLvBinding } from "../../engines/lv/binding.ts";
import type { LvBinding } from "../../engines/lv/binding.ts";
import type { LvCatalog } from "../../engines/lv/catalog.ts";
import { LvBindingError } from "../../engines/lv/errors.ts";
import { summarizeState } from "../../engines/lv/stateSummary.ts";
import type { StateSummary } from "../../engines/lv/stateSummary.ts";
import { primeZoomNote, teleHint } from "../../engines/lv/zoomEnds.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand, CliIo } from "../command.ts";

/** What `lvrtc lenses` is wired to, injected so that tests choose all three. */
export interface LensesCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that `--root` is relative to. */
  readonly cwd: string;
}

const SYNOPSIS = [
  "Usage: lvrtc lenses list [--root <dir>] [--json]",
  "       lvrtc lenses show <key> [--zoom <t>] [--focus <t>] [--root <dir>] [--json]",
  "",
].join("\n");
const HELP = [
  SYNOPSIS,
  "Reads the configured LensVisualizer checkout; nothing is written anywhere.",
  "",
  "  list  the number of lenses, then the key, name and file of each, sorted by key",
  "  show  the lens as LensVisualizer prepares it for tracing at one zoom and focus position: one row per",
  "        surface (radius or flat, gap after it, index after it, clear semi-diameter, vertex z), then the stop",
  "        surface and its radius, the last lens surface and the image plane; lengths are in mm",
  "",
  "  --zoom <t>    zoom position from 0 (wide) to 1 (tele); default 0, the wide end: --zoom 1 gives the tele end",
  "                of a zoom. A prime has no zoom position",
  "  --focus <t>   focus position from 0 (infinity) to 1 (closest); default 0",
  "  --root <dir>  the directory that holds lvrtc.config.json (default: this repository)",
  "  --json        print one JSON object in place of the lines",
  "",
  "Exit code: 0 when done; 1 when LensVisualizer cannot be loaded or, for list, a lens file cannot be indexed;",
  "2 when the command line cannot be used as given, which includes a key that is not in the catalog.",
  "",
].join("\n");

/** Canonical JSON sorts the keys at every depth; parsing it keeps that order for the indented text. */
function jsonText(value: unknown): string {
  return `${JSON.stringify(JSON.parse(canonicalJson(value)), null, 2)}\n`;
}

/** Rows of cells as lines of columns two spaces apart; a column of `rightAligned` is padded on the left. */
function table(rows: readonly (readonly string[])[], rightAligned: ReadonlySet<number> = new Set()): string[] {
  const widths = rows[0].map((_cell, column) => Math.max(...rows.map((row) => row[column].length)));
  return rows.map((row) =>
    row
      .map((cell, column) => (rightAligned.has(column) ? cell.padStart(widths[column]) : cell.padEnd(widths[column])))
      .join("  ")
      .trimEnd(),
  );
}

/** The shortest text that reads back as the same double; zero of either sign is "0". */
function numberText(value: number): string {
  return value === 0 ? "0" : String(value);
}

/** A slider position from the command line: a number from 0 to 1, or `fallback` when the option is absent. */
function position(option: string, text: string | undefined, fallback: number): number {
  if (text === undefined) return fallback;
  const value = text.trim() === "" ? Number.NaN : Number(text);
  if (!(value >= 0 && value <= 1)) throw new UsageError(`${option} needs a number from 0 to 1, got "${text}"`);
  return value;
}

function listText(catalog: LvCatalog): string {
  const count = catalog.entries.length;
  const rows = catalog.entries.map((entry) => [entry.key, entry.name, entry.file]);
  return [`${count} ${count === 1 ? "lens" : "lenses"}`, ...(rows.length > 0 ? table(rows) : []), ""].join("\n");
}

async function list(binding: LvBinding, json: boolean, io: CliIo): Promise<number> {
  const catalog = await binding.catalog();
  io.stdout(
    json
      ? jsonText({
          count: catalog.entries.length,
          fileCount: catalog.fileCount,
          lenses: catalog.entries,
          problems: catalog.problems,
        })
      : listText(catalog),
  );
  for (const { file, problem } of catalog.problems) io.stderr(`lvrtc lenses: ${file}: ${problem}\n`);
  return catalog.problems.length === 0 ? EXIT_OK : EXIT_FAILURE;
}

function showText(lens: { key: string; name: string; file: string }, summary: StateSummary): string {
  const header = ["#", "label", "R", "d", "nd", "sd", "z", "asphere", "synthetic"];
  const rows = summary.surfaces.map((surface) => [
    String(surface.index),
    surface.label,
    surface.R === null ? "flat" : numberText(surface.R),
    numberText(surface.d),
    numberText(surface.nd),
    numberText(surface.sd),
    numberText(surface.z),
    surface.asphere ? "yes" : "no",
    surface.synthetic ?? "",
  ]);
  const totals = table([
    ["surfaces", String(summary.surfaceCount)],
    ["stop index", String(summary.stopIndex)],
    ["stop radius", numberText(summary.stopRadius)],
    ["last lens surface", String(summary.lastLensSurfaceIndex)],
    ["imgZ", numberText(summary.imgZ)],
  ]);
  return [
    `${lens.key}  ${lens.name}`,
    `file   ${lens.file}`,
    `focus  ${numberText(summary.focusT)}`,
    `zoom   ${numberText(summary.zoomT)}`,
    "",
    ...table([header, ...rows], new Set([0, 2, 3, 4, 5, 6])),
    "",
    ...totals,
    "",
  ].join("\n");
}

async function show(
  binding: LvBinding,
  key: string,
  focusT: number,
  zoom: number | undefined,
  json: boolean,
  io: CliIo,
): Promise<number> {
  let lens: Awaited<ReturnType<LvBinding["lens"]>>;
  try {
    lens = await binding.lens(key);
  } catch (error) {
    if (error instanceof LvBindingError && error.code === "unknown-lens") throw new UsageError(error.message);
    throw error;
  }
  const isZoom = lens.entry.zoom === true;
  if (isZoom && zoom === undefined) io.stderr(`lvrtc lenses: ${teleHint(key)}\n`);
  if (!isZoom && zoom !== undefined && zoom !== 0) io.stderr(`lvrtc lenses: ${primeZoomNote(key)}\n`);
  const zoomT = isZoom ? (zoom ?? 0) : 0;
  const runtime = binding.api.buildLens(lens.data);
  const summary = summarizeState(binding.api.prepareRuntimeState(runtime, focusT, zoomT));
  const { key: lensKey, name, file } = lens.entry;
  io.stdout(json ? jsonText({ key: lensKey, name, file, ...summary }) : showText(lens.entry, summary));
  return EXIT_OK;
}

/**
 * Builds `lvrtc lenses list` and `lvrtc lenses show <key>`, which read the LensVisualizer checkout of the
 * configuration (`lvPath`) through the binding.
 *
 * `list` prints the number of lenses and the key, name and file of each, sorted by key; a lens file that cannot be
 * indexed is named on the error stream. `show` builds the lens and prepares it at `--zoom` and `--focus` (0 when
 * absent; a zoom shown without `--zoom` is at its wide end, and the error stream says that `--zoom 1` gives the
 * tele end; a zoom position given for a prime is ignored, which is said too), then prints the prepared state, the
 * one that is traced: every surface, the stop surface and its runtime radius, the last lens surface, the image
 * plane and the surface count. Both are console output, never stored, and `--json` prints one object with sorted
 * keys in place of the lines.
 *
 * Exit codes: 0 when done; 1 when LensVisualizer is not configured or cannot be loaded, when a lens cannot be
 * built, and, for `list`, when a lens file cannot be indexed; 2 for a command line that is not the synopsis, a
 * `--root` that is not a directory, a position outside 0 to 1 and a key that is not in the catalog, with the
 * nearest keys suggested.
 */
export function createLensesCommand(inputs: LensesCommandInputs): CliCommand {
  return {
    name: "lenses",
    summary: "List LensVisualizer's lenses, or show one as it is prepared for tracing",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      try {
        const [action, ...rest] = args;
        if (action === undefined) throw new UsageError("no action was named: there are list and show");
        if (action !== "list" && action !== "show") {
          throw new UsageError(`unknown action "${action}": there are list and show`);
        }
        const valueOptions = action === "show" ? ["--root", "--zoom", "--focus"] : ["--root"];
        const asked = parseArguments(rest, valueOptions, ["--json"]);
        const expected = action === "show" ? 1 : 0;
        if (asked.positionals.length < expected) throw new UsageError("no lens key was given");
        if (asked.positionals.length > expected) {
          throw new UsageError(`unexpected argument "${asked.positionals[expected]}"`);
        }
        const zoomText = asked.values.get("--zoom");
        const zoom = zoomText === undefined ? undefined : position("--zoom", zoomText, 0);
        const focusT = position("--focus", asked.values.get("--focus"), 0);
        const root = asked.values.get("--root");
        const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
        if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${root}: not a directory`);
        }

        const binding = await loadLvBinding(loadConfig({ rootDir, env: inputs.env }).config.lvPath);
        const json = asked.flags.has("--json");
        if (action === "list") return await list(binding, json, io);
        return await show(binding, asked.positionals[0], focusT, zoom, json, io);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc lenses: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
    },
  };
}

/** `lvrtc lenses` wired to this repository, the process environment and the directory the process was started in. */
export const lensesCommand: CliCommand = createLensesCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
