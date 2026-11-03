import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import type { LoadedConfig } from "../../core/config.ts";
import { UsageError } from "../../core/usageError.ts";
import { BUILTIN_ENGINES } from "../../engines/builtin.ts";
import type { ControlOptions } from "../../dashboard/control.ts";
import { childDescribeRunner } from "../../dashboard/identity.ts";
import type { EngineDescribeRunner } from "../../dashboard/identity.ts";
import { DEFAULT_PORT, startDashboard } from "../../dashboard/server.ts";
import type { Dashboard } from "../../dashboard/server.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import type { RunTargetInputs } from "../runTarget.ts";

const SYNOPSIS = "Usage: lvrtc serve [--root <dir>] [--port <n>] [--no-ask]\n";
const HELP = [
  SYNOPSIS,
  "Serves a dashboard of the runs and baselines on 127.0.0.1 only: an index of the run directories of the runs",
  "directory and the baselines of the root, a page per run (engines, support matrix, verdicts, sections, pending",
  "jobs), a page per compared request, and a page per baseline and per run of it with the STALE badge of each record.",
  "Every page has a JSON twin under /api/, and no page writes anything. It runs until it is interrupted (SIGINT or",
  "SIGTERM): it then ends a running job's process group (SIGTERM, then SIGKILL after 5 s) and waits for it, ignoring",
  "a second SIGINT or SIGTERM until it has ended. Once listening it asks the engines of the baselines who they are, in",
  "a child `lvrtc engine describe`; until they answer, and with --no-ask, a record's engines are held to the suite's",
  "last run.",
  "",
  "/control starts a suite listed in <root>/suites/*.json (lvrtc run, compare and report in turn, at most 4 jobs),",
  "collects the answers of file-exchange engines (lvrtc collect) and asks the engines again: each a child lvrtc",
  "command, one job at a time, its output kept in memory and shown on /control/job/<n>. Runs of real engines are",
  "heavy commands and must not overlap another session's.",
  "",
  "  --root <dir>     the directory that holds lvrtc.config.json and baselines/ (default: this repository)",
  `  --port <n>       the port, 0 for a free one (default: ${DEFAULT_PORT})`,
  "  --no-ask         do not ask the engines: a record's engines are held to the suite's last run",
  "",
  "Exit code: 0 once stopped; 1 when it cannot listen; 2 when the command line or the root cannot be used as given.",
  "",
].join("\n");

/** What `lvrtc serve` is wired to, injected so that tests choose it. */
export interface ServeCommandInputs extends RunTargetInputs {
  /** How the engines are asked for a root; a child `lvrtc engine describe` unless a test scripts it. */
  readonly runnerFor?: (rootDir: string) => EngineDescribeRunner;
  /** Resolves when the server is to stop; SIGINT or SIGTERM unless a test stops it. */
  readonly untilStopped?: (dashboard: Dashboard) => Promise<void>;
  /** The policy at hand; the repository's unless a test names another. */
  readonly policyFile?: string;
}

/**
 * The suite files of a root: `<root>/suites/*.json`, by name (the file's stem), sorted. A link is followed, and only
 * what is a regular file once followed is listed. None when there is none.
 */
export function rootSuites(rootDir: string): ControlOptions["suites"] {
  const directory = join(rootDir, "suites");
  let names: string[];
  try {
    names = readdirSync(directory);
  } catch {
    return [];
  }
  return names
    .filter((name) => name.endsWith(".json") && name.length > ".json".length)
    .filter((name) => statSync(join(directory, name), { throwIfNoEntry: false })?.isFile() ?? false)
    .sort()
    .map((name) => ({ name: name.slice(0, -".json".length), file: join(directory, name) }));
}

/**
 * What run control may start under a loaded configuration: the suites given, every engine the configuration defines
 * and every built-in engine (sorted, each once), and the file-exchange engines it defines, with the environment of
 * the children.
 */
export function controlChoices(
  loaded: Pick<LoadedConfig, "config">,
  suites: ControlOptions["suites"],
  env: Readonly<Record<string, string | undefined>>,
): ControlOptions {
  const definitions = loaded.config.engineDefinitions;
  return {
    suites,
    engines: [...new Set([...Object.keys(definitions), ...Object.keys(BUILTIN_ENGINES)])].sort(),
    exchangeEngines: Object.keys(definitions)
      .filter((id) => definitions[id].transport === "file-exchange")
      .sort(),
    env,
  };
}

/** Stands in for SIGINT and SIGTERM while the dashboard closes: a second one does not cut its cleanup short. */
function ignoreSignal(): void {
  // Ignored until the running job's process group has ended.
}

/**
 * Resolves on the first SIGINT or SIGTERM, and from then on ignores both (`ignoreSignal`) until `releaseSignals`, so
 * that the dashboard's close, which ends a running job's process group, is not cut short, as the pool controller
 * ignores a second signal while it cleans up.
 */
function untilSignal(): Promise<void> {
  return new Promise((done) => {
    const stop = (): void => {
      process.off("SIGINT", stop);
      process.off("SIGTERM", stop);
      process.on("SIGINT", ignoreSignal);
      process.on("SIGTERM", ignoreSignal);
      done();
    };
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
  });
}

/** Leaves no listener of `untilSignal` behind. */
function releaseSignals(): void {
  process.off("SIGINT", ignoreSignal);
  process.off("SIGTERM", ignoreSignal);
}

/**
 * Builds `lvrtc serve [--root <dir>] [--port <n>] [--no-ask]`: starts the dashboard (`startDashboard`) on the runs
 * directory of the root's configuration (so `LVRTC_RUNS_DIR` applies) and its `baselines/`, prints its URL, asks the
 * engines in the background unless `--no-ask`, and closes it on SIGINT or SIGTERM.
 */
export function createServeCommand(inputs: ServeCommandInputs): CliCommand {
  return {
    name: "serve",
    summary: "Serve a dashboard of the runs and baselines on 127.0.0.1, with run control",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let rootDir: string;
      let runsDir: string;
      let port: number;
      let noAsk: boolean;
      let control: ControlOptions;
      try {
        const { positionals, values, flags } = parseArguments(args, ["--root", "--port"], ["--no-ask"]);
        if (positionals.length > 0) throw new UsageError(`unexpected argument "${positionals[0]}"`);
        const root = values.get("--root");
        rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
        if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${root}: not a directory`);
        }
        const portText = values.get("--port");
        port = portText === undefined ? DEFAULT_PORT : Number(portText);
        if (portText !== undefined && (!/^[0-9]{1,5}$/.test(portText) || port > 65535)) {
          throw new UsageError(`--port ${portText}: not a port (0 to 65535)`);
        }
        noAsk = flags.has("--no-ask");
        const loaded = loadConfig({ rootDir, env: inputs.env });
        runsDir = loaded.config.runsDir;
        control = controlChoices(loaded, rootSuites(rootDir), inputs.env);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc serve: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      let dashboard: Dashboard;
      try {
        dashboard = await startDashboard({
          rootDir,
          runsDir,
          port,
          policyFile: inputs.policyFile,
          control,
          ...(noAsk
            ? {}
            : { runner: (inputs.runnerFor ?? ((root) => childDescribeRunner(root, inputs.env)))(rootDir) }),
        });
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        io.stderr(`lvrtc serve: cannot listen on 127.0.0.1:${port}${code === undefined ? "" : ` (${code})`}\n`);
        return EXIT_FAILURE;
      }
      io.stdout(`${dashboard.url}\n`);
      if (!noAsk) {
        io.stderr("lvrtc serve: asking the engines of the baselines who they are\n");
        void dashboard.answered.then((asked) => {
          if (asked.state === "failed") io.stderr(`lvrtc serve: the engines could not be asked: ${asked.problem}\n`);
          else io.stderr("lvrtc serve: the engines answered\n");
        });
      }
      await (inputs.untilStopped ?? untilSignal)(dashboard);
      try {
        await dashboard.close();
      } finally {
        if (inputs.untilStopped === undefined) releaseSignals();
      }
      return EXIT_OK;
    },
  };
}

/** `lvrtc serve` wired to this repository, the process environment and the directory the process was started in. */
export const serveCommand: CliCommand = createServeCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
