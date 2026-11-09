// `lvrtc glossary [term]`: the words a reviewer meets, from the vocabulary. A term is found by its own word, by an
// older word of this tool that it replaces, or, for a verdict, an outcome, an engine or a check, by the value stored for
// it. A check is also found by the id it had before the rename.
import { aliasCheckId } from "../../core/legacyIds.ts";
import { UsageError } from "../../core/usageError.ts";
import {
  BADGE_TEXT,
  CHECKS,
  CLASS_TEXT,
  ENGINES,
  GLOSSARY_COMMAND_TEXT,
  GLOSSARY_TEXT,
  OUTCOME_TEXT,
  ROW_STATUS_TEXT,
  STALE_REASON_TEXT,
  TERMS,
  VERDICT_TEXT,
} from "../../vocabulary/index.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { helpText, options, paragraph, wrap } from "../help.ts";

const SYNOPSIS = "Usage: lvrtc glossary [<term>] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "Prints the glossary: each word used on the screens and in the reports, what it means, and the older words of this tool that it replaces. With a term, prints that entry alone; a term is found by its word or by an older word it replaces (lvrtc glossary tolerance shows limit), and a verdict, an outcome, an engine or a check also by the value stored for it (lvrtc glossary ATTENTION, lvrtc glossary ray-trace); a check is found by the id it had before the ids were renamed too. docs/GLOSSARY.md holds the same words with the checks, engines and suites.",
  ),
  ...options([
    ["<term>", "the word to look up, in any case"],
    ["--json", "print one JSON object in place of the lines"],
  ]),
  ...paragraph(
    "Exit code: 0 when it printed; 2 when no entry has that word or the command line cannot be used as given.",
  ),
]);

/** One entry of the glossary as this command prints it. */
interface Entry {
  readonly term: string;
  readonly meaning: string;
  /** The older words it replaces, or the value stored for it. */
  readonly replaces: readonly string[];
  readonly stored: string | null;
}

/** Every entry: the terms, then the labels of verdicts, outcomes, classes, engines and checks with their stored values. */
function entries(): Entry[] {
  const labelled = (table: Readonly<Record<string, { label: string; meaning: string }>>): Entry[] =>
    Object.entries(table).map(([stored, text]) => ({ term: text.label, meaning: text.meaning, replaces: [], stored }));
  return [
    ...TERMS.map((term) => ({ term: term.term, meaning: term.definition, replaces: term.replaces, stored: null })),
    ...labelled(VERDICT_TEXT),
    ...labelled(OUTCOME_TEXT),
    ...labelled(STALE_REASON_TEXT),
    ...labelled(BADGE_TEXT),
    ...labelled(CLASS_TEXT),
    ...labelled(ROW_STATUS_TEXT),
    ...ENGINES.map((engine) => ({ term: engine.name, meaning: engine.description, replaces: [], stored: engine.id })),
    // A check by its title, the id it had before the rename and its id of today.
    ...CHECKS.map((check) => ({
      term: check.title,
      meaning: `${check.compares}. ${check.shows}`,
      replaces: [check.oldId],
      stored: check.id,
    })),
  ];
}

function entryText(entry: Entry): string[] {
  const t = GLOSSARY_COMMAND_TEXT;
  const notes = [
    ...(entry.replaces.length > 0 ? [`${t.replaces} ${entry.replaces.join(", ")}`] : []),
    ...(entry.stored === null ? [] : [`${t.stored} ${entry.stored}`]),
  ];
  return [`${entry.term}${notes.length > 0 ? ` (${notes.join("; ")})` : ""}`, ...wrap(entry.meaning, 4)];
}

/** Builds `lvrtc glossary [<term>] [--json]`. */
export function createGlossaryCommand(): CliCommand {
  return {
    name: "glossary",
    summary: "Explain the words on the screens and in the reports, or one of them",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let words: readonly string[];
      let json: boolean;
      try {
        const parsed = parseArguments(args, [], ["--json"]);
        words = parsed.positionals;
        json = parsed.flags.has("--json");
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc glossary: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      if (words.length === 0) {
        const terms = entries().slice(0, TERMS.length);
        if (json) {
          io.stdout(`${JSON.stringify({ terms }, null, 2)}\n`);
          return EXIT_OK;
        }
        const lines = [
          `${GLOSSARY_TEXT.terms}: ${GLOSSARY_TEXT.termsIntro}`,
          "",
          ...terms.flatMap((entry) => [...entryText(entry), ""]),
          ...wrap(GLOSSARY_COMMAND_TEXT.more),
        ];
        io.stdout(`${lines.join("\n")}\n`);
        return EXIT_OK;
      }
      const word = words.join(" ").toLowerCase();
      const found = entries().filter(
        (entry) =>
          entry.term.toLowerCase() === word ||
          entry.replaces.some((each) => each.toLowerCase() === word) ||
          entry.stored?.toLowerCase() === word,
      );
      if (found.length === 0) {
        io.stderr(`lvrtc glossary: "${words.join(" ")}": ${GLOSSARY_COMMAND_TEXT.unknown}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      // A check found by the id it had before the rename: the command says once which id it is now.
      const old = CHECKS.find((check) => check.oldId.toLowerCase() === word);
      if (old !== undefined) aliasCheckId(old.oldId);
      io.stdout(
        json
          ? `${JSON.stringify({ terms: found }, null, 2)}\n`
          : `${found.map((entry) => entryText(entry).join("\n")).join("\n\n")}\n`,
      );
      return EXIT_OK;
    },
  };
}

/** `lvrtc glossary`. */
export const glossaryCommand: CliCommand = createGlossaryCommand();
