import { statSync } from "node:fs";
import { resolve } from "node:path";

import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { UsageError } from "../../core/usageError.ts";
import { readStatementInputs, renderStatement, STATEMENT_JSON, STATEMENT_MARKDOWN } from "../../report/statement.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

const HELP =
  "Usage: lvrtc statement [--root <dir>]\n\nWrites reports/validation-statement.{json,md} from the eight benchmark, features, states and focus-stations baselines alone. No engine is read. Missing or inconsistent inputs write nothing.\n";

/** The statement command reads baselines only, without resolving any engine or configuration. */
export function createStatementCommand(inputs: { rootDir: string; cwd: string }): CliCommand {
  return {
    name: "statement",
    summary: "Write the four-suite statement from the eight baselines alone",
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
      io.stdout(`${STATEMENT_JSON} and ${STATEMENT_MARKDOWN}: written from eight baselines; no engine was read.\n`);
      return EXIT_OK;
    },
  };
}

export const statementCommand = createStatementCommand({ rootDir: REPO_ROOT, cwd: process.cwd() });
