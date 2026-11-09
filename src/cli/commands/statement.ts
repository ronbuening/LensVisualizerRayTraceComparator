import { statSync } from "node:fs";
import { resolve } from "node:path";

import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { UsageError } from "../../core/usageError.ts";
import { readStatementInputs, renderStatement, STATEMENT_JSON, STATEMENT_MARKDOWN } from "../../report/statement.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { helpText, options, paragraph } from "../help.ts";

const SYNOPSIS = "Usage: lvrtc statement [--root <dir>]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "For maintainers. Writes reports/validation-statement.json and .md, the summary statement of what the checks found, from the eight baselines of the benchmark, features, states and focus-stations suites alone. No engine is read. Missing or inconsistent inputs write nothing.",
  ),
  ...options([["--root <dir>", "the directory that holds baselines/ and reports/ (default: this repository)"]]),
  ...paragraph(
    "Exit code: 0 when it was written; 1 when the baselines are missing or do not hold together; 2 when the command line cannot be used as given.",
  ),
]);

/** The statement command reads baselines only, without resolving any engine or configuration. */
export function createStatementCommand(inputs: { rootDir: string; cwd: string }): CliCommand {
  return {
    name: "statement",
    summary: "Write the summary statement from the committed results of four suites",
    run: async (args, io) => {
      if (args.includes("--help") || args.includes("-h")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let root: string;
      try {
        const { positionals, values } = parseArguments(args, ["--root"], []);
        if (positionals.length) throw new UsageError(`unexpected argument "${positionals[0]}"`);
        root = values.has("--root") ? resolve(inputs.cwd, values.get("--root")!) : inputs.rootDir;
        if (!statSync(root, { throwIfNoEntry: false })?.isDirectory())
          throw new UsageError(`--root ${root}: not a directory`);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc statement: ${error.message}\n${HELP}`);
        return EXIT_USAGE;
      }
      const rendered = renderStatement(readStatementInputs(root));
      writeFileAtomic(resolve(root, STATEMENT_JSON), rendered.json);
      writeFileAtomic(resolve(root, STATEMENT_MARKDOWN), rendered.markdown);
      io.stdout(`${STATEMENT_JSON} and ${STATEMENT_MARKDOWN}: written from the eight baselines; no engine was run.\n`);
      return EXIT_OK;
    },
  };
}

export const statementCommand = createStatementCommand({ rootDir: REPO_ROOT, cwd: process.cwd() });
