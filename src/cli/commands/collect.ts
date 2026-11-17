import { statSync } from "node:fs";
import { join, resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { STORE_DIRECTORY, createResultStore } from "../../core/resultStore.ts";
import { UsageError } from "../../core/usageError.ts";
import { EngineUnavailableError } from "../../engines/adapter.ts";
import { createEngineRegistry } from "../../engines/registry.ts";
import type { EngineRegistry } from "../../engines/registry.ts";
import { collectAnswers } from "../../exchange/collect.ts";
import type { Collection } from "../../exchange/collect.ts";
import { exchangeDirectory } from "../../transports/fileExchange.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import type { RunTargetInputs } from "../runTarget.ts";
import { ROOT_OPTION, helpText, options, paragraph } from "../help.ts";
import { COLLECT_OUTPUT_TEXT } from "../../vocabulary/index.ts";

const SYNOPSIS = "Usage: lvrtc collect [<engine>...] [--root <dir>] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "Collects the answers that operators left for file-exchange engines: engines a person operates, who reads each job from <runsDir>/exchange/<engine>/outbox/ and leaves the answer in inbox/<job>.json. Each answer is admitted as a run admits an engine's answer, through the same checks of its format and content, and once it is in the result cache its job moves to collected/. An answer that is refused moves with its job to rejected/<job>/, with reason.txt. A job with no answer stays where it is. The next lvrtc run finds the collected answers in the result cache.",
  ),
  ...options([
    ["<engine>", "the file-exchange engines to collect for (default: every one the configuration defines)"],
    ROOT_OPTION,
    ["--json", "print one JSON object in place of the lines"],
  ]),
  ...paragraph(
    "Exit code: 0 when nothing was refused; 1 when an answer was refused or an engine could not be used; 2 when the command line, the root or an engine named cannot be used as asked.",
  ),
]);

/** What one engine's collection came to: its collection, or why the engine could not be used. */
type Outcome = { readonly engine: string } & ({ readonly collection: Collection } | { readonly unavailable: string });

/** Collects for one engine, closing it whatever happens. */
async function collectFor(
  registry: EngineRegistry,
  runsDir: string,
  engine: string,
  warnings: string[],
): Promise<Outcome> {
  let adapter;
  try {
    adapter = await registry.create(engine);
  } catch (error) {
    if (error instanceof EngineUnavailableError) return { engine, unavailable: error.message };
    throw error;
  }
  try {
    let descriptor;
    try {
      descriptor = await adapter.describe();
    } catch (error) {
      if (error instanceof EngineUnavailableError) return { engine, unavailable: error.message };
      throw error;
    }
    const collection = await collectAnswers({
      directory: exchangeDirectory(runsDir, engine),
      adapter,
      descriptor,
      store: createResultStore(join(runsDir, STORE_DIRECTORY)),
      warnings,
    });
    return { engine, collection };
  } finally {
    await adapter.close();
  }
}

/** The lines of one engine's outcome. */
function outcomeText(outcome: Outcome): string {
  const t = COLLECT_OUTPUT_TEXT;
  if ("unavailable" in outcome) return `${outcome.engine}: ${t.notCollected}: ${outcome.unavailable}\n`;
  const { collected, rejected, pending } = outcome.collection;
  const lines = [
    `${outcome.engine}: ${collected.length} ${t.collected}, ${rejected.length} ${t.rejected}, ${pending.length} ${t.pending}`,
    ...rejected.map(({ job, reason }) => `  ${t.rejectedJob} ${job}: ${reason}`),
  ];
  return `${lines.join("\n")}\n`;
}

/**
 * Builds `lvrtc collect [<engine>...] [--root <dir>] [--json]`: for each file-exchange engine named, or every one the
 * configuration of the root defines when none is, it describes the engine and collects its answers
 * (`collectAnswers`), and prints per engine how many jobs were collected, how many refused (each with its reason)
 * and how many are still pending; with `--json`, one object in their place. A warning of the store goes to the error
 * stream.
 *
 * Exit codes: 0 when nothing was refused; 1 when an answer was refused or an engine could not be described; 2 for a
 * command line that is not the synopsis, a `--root` that is not a directory, and an engine named that is not a
 * file-exchange engine of the configuration.
 */
export function createCollectCommand(inputs: RunTargetInputs): CliCommand {
  return {
    name: "collect",
    summary: "Collect the answers operators left for file-exchange engines into the result cache",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let engines: string[];
      let runsDir: string;
      let registry: EngineRegistry;
      let json: boolean;
      try {
        const { positionals, values, flags } = parseArguments(args, ["--root"], ["--json"]);
        json = flags.has("--json");
        const root = values.get("--root");
        const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
        if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${root}: not a directory`);
        }
        const loaded = loadConfig({ rootDir, env: inputs.env });
        const definitions = loaded.config.engineDefinitions;
        const exchanged = Object.keys(definitions)
          .filter((id) => definitions[id].transport === "file-exchange")
          .sort();
        for (const engine of positionals) {
          if (!exchanged.includes(engine)) {
            const there = exchanged.length === 0 ? "none is configured" : `there are ${exchanged.join(", ")}`;
            throw new UsageError(`${engine} is not a file-exchange engine of the configuration: ${there}`);
          }
        }
        engines = positionals.length === 0 ? exchanged : [...new Set(positionals)];
        runsDir = loaded.config.runsDir;
        registry = createEngineRegistry(loaded);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc collect: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }

      const warnings: string[] = [];
      const outcomes: Outcome[] = [];
      for (const engine of engines) outcomes.push(await collectFor(registry, runsDir, engine, warnings));
      for (const warning of warnings) io.stderr(`lvrtc collect: warning: ${warning}\n`);
      if (json) {
        const report = outcomes.map((outcome) =>
          "unavailable" in outcome
            ? outcome
            : {
                ...outcome.collection,
                engine: outcome.engine,
                counts: {
                  collected: outcome.collection.collected.length,
                  rejected: outcome.collection.rejected.length,
                  pending: outcome.collection.pending.length,
                },
              },
        );
        io.stdout(`${JSON.stringify({ engines: report }, null, 2)}\n`);
      } else if (outcomes.length === 0) io.stdout(`${COLLECT_OUTPUT_TEXT.none}\n`);
      else for (const outcome of outcomes) io.stdout(outcomeText(outcome));

      const failed = outcomes.some((outcome) => "unavailable" in outcome || outcome.collection.rejected.length > 0);
      return failed ? EXIT_FAILURE : EXIT_OK;
    },
  };
}

/** `lvrtc collect` wired to this repository, the process environment and the directory the process was started in. */
export const collectCommand: CliCommand = createCollectCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
