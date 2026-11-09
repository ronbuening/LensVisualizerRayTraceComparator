// What every command's help is made of: paragraphs wrapped to the width of a terminal, aligned option lists, and the
// lists of checks and engines, generated from the checks themselves (`RUNGS`) and the vocabulary, never written out
// by hand.
import { RUNGS } from "../core/rungs.ts";
import { CHECKS, ENGINES, checkTitle } from "../vocabulary/index.ts";

/** The widest line a help text prints. */
export const HELP_WIDTH = 118;

/** Words wrapped to `HELP_WIDTH`: the first line after `first`, every other after `indent` spaces. */
export function wrap(text: string, indent = 0, first = " ".repeat(indent)): string[] {
  const lines: string[] = [];
  let line = first;
  let empty = true;
  for (const word of text.split(/\s+/).filter((each) => each !== "")) {
    if (!empty && line.length + 1 + word.length > HELP_WIDTH) {
      lines.push(line);
      line = " ".repeat(indent);
      empty = true;
    }
    line += empty ? word : ` ${word}`;
    empty = false;
  }
  lines.push(line);
  return lines;
}

/** A paragraph: its words wrapped, then a blank line. */
export function paragraph(text: string): string[] {
  return [...wrap(text), ""];
}

/**
 * One option and what it does; `more` makes lines printed under the description, given the column the description
 * starts at.
 */
export type OptionRow = readonly [name: string, description: string, more?: (column: number) => string[]];

/** An aligned list of options, each description wrapped under itself; then a blank line. */
export function options(rows: readonly OptionRow[], indent = 2): string[] {
  const width = Math.max(...rows.map(([name]) => name.length));
  const lines: string[] = [];
  for (const [name, description, more] of rows) {
    const first = `${" ".repeat(indent)}${name.padEnd(width)}  `;
    lines.push(...wrap(description, first.length, first), ...(more?.(first.length) ?? []));
  }
  return [...lines, ""];
}

/** A help text: its lines joined, ending with one newline. */
export function helpText(lines: readonly string[]): string {
  const text = lines.join("\n").replace(/\n+$/, "");
  return `${text}\n`;
}

function listOf(ids: readonly string[]): string {
  if (ids.length <= 1) return ids.join("");
  return `${ids.slice(0, -1).join(", ")} and ${ids[ids.length - 1]}`;
}

/**
 * Every check, a line each, as `--checks` takes them: its id and title, and where it differs from the rest, that it
 * is run only where named or asked of engines of its own. Indented by `indent` spaces.
 */
export function checkListLines(indent: number): string[] {
  const width = Math.max(...RUNGS.map((rung) => rung.id.length));
  return RUNGS.flatMap((rung) => {
    const notes = [
      ...(rung.onlyWhereNamed === true ? ["only where named"] : []),
      ...(rung.engines === undefined ? [] : [`asked of ${listOf(rung.engines)}`]),
    ];
    const text = `${checkTitle(rung.id)}${notes.length > 0 ? ` (${notes.join("; ")})` : ""}`;
    const first = `${" ".repeat(indent)}${rung.id.padEnd(width)}  `;
    return wrap(text, first.length + 2, first);
  });
}

/** Every built-in engine, a line each: its id and its name. Indented by `indent` spaces. */
export function engineListLines(indent: number): string[] {
  const width = Math.max(...ENGINES.map((engine) => engine.id.length));
  return ENGINES.map((engine) => `${" ".repeat(indent)}${engine.id.padEnd(width)}  ${engine.name}`);
}

/** The ids of the checks, for a sentence. */
export function checkIds(): string {
  return listOf(CHECKS.map((check) => check.id));
}

/** The options every suite command shares for concurrency, with the memory estimate of a job. */
export const JOBS_OPTIONS: readonly OptionRow[] = [
  [
    "--jobs <n>",
    "how many jobs run at once, each in a process of its own (default 1: one after another); at most what the memory budget allows",
  ],
  [
    "--memory-budget <GiB>",
    "the memory the jobs may use together (default: a quarter of the installed memory, less 2 GiB); a job is counted as 2.5 GiB, or 4 GiB when the check r6c (two optiland workers) is selected",
  ],
];

/** The option that names the configuration root. */
export const ROOT_OPTION: OptionRow = [
  "--root <dir>",
  "the directory that holds lvrtc.config.json (default: this repository)",
];

/** Checks by id, each with its title: `r4 (Geometric MTF of the same rays), r4f (...)`. */
export function checkNames(ids: readonly string[]): string {
  return listOf(ids.map((id) => `${id} (${checkTitle(id)})`));
}

/** Of these checks, those held to a limit and those side by side, in their order. */
export function checksByKind(ids: readonly string[]): { readonly limit: string[]; readonly sideBySide: string[] } {
  const kindOf = (id: string): string | undefined => CHECKS.find((check) => check.id === id)?.kind;
  return {
    limit: ids.filter((id) => kindOf(id) === "limit"),
    sideBySide: ids.filter((id) => kindOf(id) === "side-by-side"),
  };
}
