import { statSync } from "node:fs";
import { join, resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { STORE_DIRECTORY } from "../../core/resultStore.ts";
import { committedBaselineEngines, compressStore, pruneStore } from "../../core/storeMaintenance.ts";
import { UsageError } from "../../core/usageError.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { ROOT_OPTION, helpText, options, paragraph } from "../help.ts";
import type { RunTargetInputs } from "../runTarget.ts";

const SYNOPSIS = "Usage: lvrtc store compress|prune [--root <dir>] [--yes [--expect <state>]] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "For maintainers only: upkeep of the result cache, <runsDir>/store, where every engine's answers are kept so that a run asks an engine only once. Each action is a dry run that changes nothing unless --yes is given. Every run prints a digest of the state of the cache it is of; with --expect <state>, --yes first holds the cache to that state and changes nothing (exit 1) where it is another. Run either with no suite or other writer of the cache running.",
  ),
  ...options([
    [
      "compress",
      "count the plain and compressed entries and their bytes before and after; with --yes, gzip each plain entry's exact bytes, atomically",
    ],
    [
      "prune",
      "list the entries kept and removable, per engine, and the engine versions the committed baselines (baselines/*.json of the git HEAD) protect, with each removable engine version and its newest entry; with --yes, delete only entries that no engine version of a committed baseline can use. Entries that cannot be read are kept. The engine versions this checkout runs are protected only once baselines written with them are committed: prune after such baselines are committed, never before",
    ],
    ROOT_OPTION,
    ["--yes", "make the changes the dry run lists"],
    [
      "--expect <state>",
      "with --yes: the state digest a dry run printed; nothing changes unless the cache is still in it",
    ],
    ["--json", "accepted; the report is always JSON"],
  ]),
  ...paragraph(
    "Exit code: 0 when done; 1 when the cache is not in the expected state or cannot be changed as asked; 2 when the command line cannot be used as given.",
  ),
]);

export function createStoreCommand(inputs: RunTargetInputs): CliCommand {
  return {
    name: "store",
    summary: "Compress the result cache, or remove answers no committed result needs (maintainers only)",
    run: async (args, io) => {
      if (args.includes("--help") || args.includes("-h")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      try {
        const { positionals, values, flags } = parseArguments(args, ["--root", "--expect"], ["--yes", "--json"]);
        const [action] = positionals;
        if (positionals.length !== 1 || !["compress", "prune"].includes(action))
          throw new UsageError("name compress or prune");
        const rootDir = values.has("--root") ? resolve(inputs.cwd, values.get("--root")!) : inputs.rootDir;
        if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory())
          throw new UsageError("--root is not a directory");
        const directory = join(loadConfig({ rootDir, env: inputs.env }).config.runsDir, STORE_DIRECTORY);
        const yes = flags.has("--yes");
        const expected = values.get("--expect");
        if (expected !== undefined && (!yes || !/^[0-9a-f]{64}$/.test(expected))) {
          throw new UsageError("--expect takes the 64 hex digits of a plan's state, with --yes");
        }
        const summary =
          action === "compress"
            ? compressStore(directory, yes, expected)
            : pruneStore(directory, committedBaselineEngines(rootDir), yes, expected);
        io.stdout(`${JSON.stringify({ action, dryRun: !yes, ...summary }, null, 2)}\n`);
        return EXIT_OK;
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc store: ${error.message}\n${HELP}`);
        return EXIT_USAGE;
      }
    },
  };
}
export const storeCommand = createStoreCommand({ rootDir: REPO_ROOT, cwd: process.cwd(), env: process.env });
