// docs/GLOSSARY.md, rendered from the vocabulary alone: deterministic, with no clock or machine input. `lvrtc verify`
// holds the committed file to it byte for byte, and `lvrtc verify --write` writes it.
import { CHECKS } from "./checks.ts";
import { CLASS_TEXT, ROW_STATUS_TEXT } from "./classes.ts";
import { ENGINES } from "./engines.ts";
import { BADGE_TEXT, OUTCOME_TEXT, STALE_REASON_TEXT } from "./outcomes.ts";
import { SUITES } from "./suites.ts";
import { TERMS } from "./terms.ts";
import { VERDICT_TEXT } from "./verdicts.ts";

/** Where the glossary is, relative to the root of the repository. */
export const GLOSSARY_FILE = "docs/GLOSSARY.md";

/** The glossary's own words. */
export const GLOSSARY_TEXT = {
  title: "Glossary",
  intro: [
    "This glossary is generated from src/vocabulary by lvrtc verify --write: edit the vocabulary, not this file.",
    "It is for reviewers who know optics and not this tool. LensVisualizer is under review; optiland is an independent external engine; the other engines are this tool's own. It says what each check compares, what it shows and what it does not show, and what the words on the screens and in the reports mean.",
  ],
  terms: "Terms",
  termsIntro: "The words used on screens and in reports, and the older words of this tool that each replaces.",
  checks: "Checks",
  checksIntro:
    "A check held to a limit hands two engines the same input and passes or fails. A side-by-side check sets two methods beside each other with no limit and fails nothing. The id is the one stored today; the second id is the one it had before the ids were renamed, which the catalog snapshot and files written before the rename still name and which is still read.",
  kinds: { limit: "held to a limit", "side-by-side": "side by side, no limit" },
  engines: "Engines",
  enginesIntro:
    "The engines built into this tool. LensVisualizer is under review, optiland is an independent external engine, and the others are this tool's own. The id is the one stored today; the old id is the one it had before the ids were renamed, which the catalog snapshot and files written before the rename still name and which is still read.",
  suites: "Suites",
  suitesIntro: "The suites committed under suites/.",
  verdicts: "Verdicts",
  verdictsIntro:
    "Each pair of engines that answered one request gets one verdict. The stored value is shown beside its label.",
  outcomes: "Baseline outcomes",
  outcomesIntro:
    "What lvrtc baseline check says of each record of a baseline when the suite is run again, why a record is out of date, and the dashboard's badges.",
  classes: "Difference classes",
  classesIntro:
    "A side-by-side comparison sorts each difference by its cause before it shows it, in the order below; a row of an MTF comparison then has one of the statuses that follow.",
} as const;

/** One row of a Markdown table. Cells hold no `|`. */
function row(cells: readonly string[]): string {
  return `| ${cells.join(" | ")} |`;
}

function table(head: readonly string[], rows: readonly (readonly string[])[]): string[] {
  return [row(head), row(head.map(() => "---")), ...rows.map(row)];
}

/** The glossary as Markdown, ending with a newline. A pure function of the vocabulary. */
export function renderGlossary(): string {
  const t = GLOSSARY_TEXT;
  const lines: string[] = [`# ${t.title}`, "", ...t.intro.flatMap((paragraph) => [paragraph, ""])];

  lines.push(`## ${t.terms}`, "", t.termsIntro, "");
  lines.push(
    ...table(
      ["Term", "Meaning", "Replaces"],
      TERMS.map((term) => [
        term.term,
        term.definition,
        term.replaces.length === 0 ? "" : term.replaces.map((word) => `\`${word}\``).join(", "),
      ]),
    ),
    "",
  );

  lines.push(`## ${t.checks}`, "", t.checksIntro, "");
  for (const check of CHECKS) {
    lines.push(
      `### ${check.title}`,
      "",
      `- Id: \`${check.id}\`, formerly \`${check.oldId}\`.`,
      `- Kind: ${t.kinds[check.kind]}.`,
      `- Compares: ${check.compares}.`,
      `- Shows: ${check.shows}`,
      `- Does not show: ${check.doesNotShow}`,
      "",
    );
  }

  lines.push(`## ${t.engines}`, "", t.enginesIntro, "");
  lines.push(
    ...table(
      ["Engine", "Id", "Old id", "What it is"],
      ENGINES.map((engine) => [engine.name, `\`${engine.id}\``, `\`${engine.oldId}\``, engine.description]),
    ),
    "",
  );

  lines.push(`## ${t.suites}`, "", t.suitesIntro, "");
  lines.push(
    ...table(
      ["Suite", "What it runs"],
      SUITES.map((suite) => [`\`${suite.name}\``, suite.description]),
    ),
    "",
  );

  lines.push(`## ${t.verdicts}`, "", t.verdictsIntro, "");
  lines.push(
    ...table(
      ["Label", "Stored", "Meaning"],
      Object.entries(VERDICT_TEXT).map(([verdict, text]) => [text.label, `\`${verdict}\``, text.meaning]),
    ),
    "",
  );

  lines.push(`## ${t.outcomes}`, "", t.outcomesIntro, "");
  for (const entries of [OUTCOME_TEXT, STALE_REASON_TEXT, BADGE_TEXT]) {
    lines.push(
      ...table(
        ["Label", "Stored", "Meaning"],
        Object.entries(entries).map(([value, text]) => [text.label, `\`${value}\``, text.meaning]),
      ),
      "",
    );
  }

  lines.push(`## ${t.classes}`, "", t.classesIntro, "");
  for (const entries of [CLASS_TEXT, ROW_STATUS_TEXT]) {
    lines.push(
      ...table(
        ["Label", "Stored", "Meaning"],
        Object.entries(entries).map(([value, text]) => [text.label, `\`${value}\``, text.meaning]),
      ),
      "",
    );
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
