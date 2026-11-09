// What every command's printed lines share: the legend of the check and engine ids the lines keep, a code's sentence
// and remedy after the code, counts in words, and columns. The words are the vocabulary's (`src/vocabulary`); the
// ids stay in the lines, because they are what a user types.
import {
  CHECKS,
  ERROR_OUTPUT_TEXT,
  IDENTIFIERS_TEXT,
  LEGEND_TEXT,
  MODE_TEXT,
  OLD_ID_TEXT,
  checkTitle,
  engineCodeTextOf,
  engineOf,
} from "../vocabulary/index.ts";
import { wrap } from "./help.ts";
import type { AliasRead } from "../core/legacyIds.ts";

/** Ids in the order of first appearance, each once. */
export function distinct(ids: Iterable<string>): string[] {
  return [...new Set(ids)];
}

/** "selftest Pipeline echo (a test of this tool); r0 Built system": the checks of `ids`, in the order of `CHECKS`. */
function checksLegend(ids: readonly string[]): string {
  const known = CHECKS.map((check) => check.id).filter((id) => ids.includes(id));
  const others = ids.filter((id) => !known.includes(id));
  return [...known.map((id) => `${id} ${checkTitle(id)}`), ...others].join("; ");
}

/**
 * "lv LensVisualizer; ref Reference tracer; optiland; fake-a, fake-b (defined in this configuration)": a built-in
 * engine by its id and name (its id alone where they are the same word), every other as one group.
 */
function enginesLegend(ids: readonly string[]): string {
  const builtin = ids.filter((id) => engineOf(id) !== undefined);
  const configured = ids.filter((id) => engineOf(id) === undefined);
  const named = builtin.map((id) => {
    const name = engineOf(id)!.name;
    return name.toLowerCase() === id.toLowerCase() ? id : `${id} ${name}`;
  });
  const group = configured.length === 0 ? [] : [`${configured.join(", ")} (${LEGEND_TEXT.configured})`];
  return [...named, ...group].join("; ");
}

/**
 * The legend of the ids a command's lines keep, one line a kind, wrapped: the checks, the engines, and the ways pairs
 * are formed. A kind with no id is left out.
 */
export function legendLines(
  ids: {
    readonly checks?: readonly string[];
    readonly engines?: readonly string[];
    readonly modes?: readonly string[];
    /** The reference engines of the pairs formed against a reference. */
    readonly references?: readonly string[];
  },
  indent = 0,
): string[] {
  const lines: string[] = [];
  const line = (title: string, text: string): void => {
    const first = `${" ".repeat(indent)}${title}: `;
    lines.push(...wrap(text, first.length, first));
  };
  const checks = distinct(ids.checks ?? []);
  const engines = distinct(ids.engines ?? []);
  const modes = distinct(ids.modes ?? []);
  if (checks.length > 0) line(LEGEND_TEXT.checks, checksLegend(checks));
  if (engines.length > 0) line(LEGEND_TEXT.engines, enginesLegend(engines));
  if (modes.length > 0) {
    const said = modes.map((mode) => {
      const text = MODE_TEXT[mode];
      if (text === undefined) return mode;
      const references = distinct(ids.references ?? []);
      const which = mode === "reference-vs-each" && references.length > 0 ? ` (${references.join(", ")})` : "";
      return `"${text.label}" sets ${text.meaning}${which}`;
    });
    line(LEGEND_TEXT.pairs, said.join("; "));
  }
  return lines;
}

/** The code a problem or an error starts with (`code: detail`), or null when it starts with none. */
export function codeOf(text: string): string | null {
  const match = /^([a-z][a-z0-9]*(?:[.-][a-z0-9]+)*):\s/.exec(text);
  return match === null ? null : match[1];
}

/**
 * What a code means and what to do about it, wrapped after `indent` spaces: the vocabulary's sentence and remedy, or
 * nothing when the vocabulary has no words for the code. `shown` is the message printed above, if any: a sentence of
 * the remedy it already says is left out (the optiland engine's message names the setting to make, in the remedy's
 * words), so that a fix is printed once.
 */
export function codeLines(code: string | null, indent = 2, engine?: string, shown = ""): string[] {
  if (code === null) return [];
  const text = engineCodeTextOf(engine, code);
  if (text === undefined) return [];
  const remedy = text.remedy
    .split(/(?<=\.) (?=[A-Z])/)
    .filter((sentence) => sentence !== "" && !shown.includes(sentence))
    .join(" ");
  const said = remedy === "" ? text.sentence : `${text.sentence} ${remedy}`;
  return wrap(said, indent);
}

/**
 * A problem as `code: detail` after `prefix`, and under it what the code means and what to do, where the vocabulary
 * says.
 */
export function explainedProblem(prefix: string, problem: string): string {
  return [`${prefix}${problem}`, ...codeLines(codeOf(problem), 4, undefined, problem), ""].join("\n");
}

/** "14 answered, 2 not computed": the counts above zero, by label; the first count when every one is zero. */
export function countsText(counts: readonly (readonly [label: string, count: number])[]): string {
  const shown = counts.filter(([, count]) => count > 0);
  return (shown.length > 0 ? shown : counts.slice(0, 1)).map(([label, count]) => `${count} ${label}`).join(", ");
}

/** Rows of cells as lines of columns two spaces apart, each line without trailing spaces. */
export function columns(rows: readonly (readonly string[])[]): string[] {
  const widths = rows.reduce<number[]>(
    (most, row) => row.map((cell, column) => Math.max(most[column] ?? 0, cell.length)),
    [],
  );
  return rows.map((row) =>
    row
      .map((cell, column) => cell.padEnd(widths[column]))
      .join("  ")
      .trimEnd(),
  );
}

/** One engine as a run record or a baseline names it: its id, and its hashes where it states them. */
export interface IdentifiedEngine {
  readonly id: string;
  readonly status?: string;
  readonly version?: string;
  readonly fingerprint?: string;
  readonly adapterRevision?: string;
  readonly code?: string;
}

/** "fake-a  version 1  engine code ab12...  this tool's code behind it cd34...", a line an engine, indented. */
export function engineIdentifierLines(engines: readonly IdentifiedEngine[], indent = 2, withVersion = true): string[] {
  return columns(
    engines.map((engine) =>
      engine.fingerprint === undefined
        ? [engine.id, engine.code ?? engine.status ?? ""]
        : [
            engine.id,
            ...(withVersion ? [`${IDENTIFIERS_TEXT.version} ${engine.version ?? ""}`] : []),
            `${IDENTIFIERS_TEXT.engineCode} ${engine.fingerprint}`,
            ...(engine.adapterRevision === undefined ? [] : [`${IDENTIFIERS_TEXT.toolCode} ${engine.adapterRevision}`]),
          ],
    ),
  ).map((line) => `${" ".repeat(indent)}${line}`);
}

/**
 * The one note of a command that read checks or engines under the ids they had before they were renamed: each old id
 * with its new one, and what to write instead. Empty when it read none.
 */
export function aliasNoteLines(read: readonly AliasRead[]): string[] {
  if (read.length === 0) return [];
  const t = OLD_ID_TEXT;
  const said = read.map((each) => `${t[each.kind]} ${each.old} ${t.isNow} ${each.now}`).join("; ");
  return [`${t.note}: ${said}; ${t.advice}`];
}

/**
 * What a usage error's code means and what to do, as lines to print under its message: empty for an error without a
 * code the vocabulary knows (every usage error but a few).
 */
export function usageErrorMeans(error: unknown): string {
  const code = (error as { readonly code?: unknown } | null)?.code;
  const means = codeLines(typeof code === "string" ? code : null);
  return means.length === 0 ? "" : `${ERROR_OUTPUT_TEXT.fix}:\n${means.join("\n")}\n`;
}
