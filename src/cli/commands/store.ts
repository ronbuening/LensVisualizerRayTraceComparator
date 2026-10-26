import { statSync } from "node:fs";
import { join, resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { STORE_DIRECTORY } from "../../core/resultStore.ts";
import { committedBaselineEngines, compressStore, pruneStore } from "../../core/storeMaintenance.ts";
import { UsageError } from "../../core/usageError.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import type { RunTargetInputs } from "../runTarget.ts";

const HELP = `Usage: lvrtc store compress|prune [--root <dir>] [--yes] [--json]

Owner-only maintenance of <runsDir>/store. Dry run by default; --yes performs the changes.
compress  Count plain/gzip files and bytes before/after; atomically gzip each plain entry's exact bytes.
prune     List counts/bytes kept and removable per engine, and protected engine identities from HEAD's
          committed baselines/*.json, and each removable engine version with its newest entry. --yes deletes
          only entries no committed baseline engine can hit. The engines as this checkout runs them are
          protected only once baselines written with them are committed: prune after a refresh, not before.
Untrusted entries are kept by prune. Run maintenance with no suite or other store writer running.
`;

export function createStoreCommand(inputs: RunTargetInputs): CliCommand {
  return {
    name: "store",
    summary: "Inspect or maintain store compression and unused engine versions (owner only)",
    run: async (args, io) => {
      if (args.includes("--help") || args.includes("-h")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      try {
        const { positionals, values, flags } = parseArguments(args, ["--root"], ["--yes", "--json"]);
        const [action] = positionals;
        if (positionals.length !== 1 || !["compress", "prune"].includes(action))
          throw new UsageError("name compress or prune");
        const rootDir = values.has("--root") ? resolve(inputs.cwd, values.get("--root")!) : inputs.rootDir;
        if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory())
          throw new UsageError("--root is not a directory");
        const directory = join(loadConfig({ rootDir, env: inputs.env }).config.runsDir, STORE_DIRECTORY);
        const yes = flags.has("--yes");
        const summary =
          action === "compress"
            ? compressStore(directory, yes)
            : pruneStore(directory, committedBaselineEngines(rootDir), yes);
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
