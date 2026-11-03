import { statSync } from "node:fs";
import { resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { UsageError } from "../../core/usageError.ts";
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
  "Serves a read-only dashboard of the runs and baselines on 127.0.0.1 only: an index of the run directories of the",
  "runs directory and the baselines of the root, a page per run (engines, support matrix, verdicts, sections, pending",
  "jobs), a page per compared request, and a page per baseline and per run of it with the STALE badge of each record.",
  "Every page has a JSON twin under /api/. Nothing is written. It runs until it is interrupted (SIGINT or SIGTERM).",
  "Once listening it asks the engines of the baselines who they are, once, in a child `lvrtc engine describe`;",
  "until they answer, and with --no-ask, a record's engines are held to the suite's last run.",
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

/** Resolves on the first SIGINT or SIGTERM, and leaves no listener behind. */
function untilSignal(): Promise<void> {
  return new Promise((done) => {
    const stop = (): void => {
      process.off("SIGINT", stop);
      process.off("SIGTERM", stop);
      done();
    };
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
  });
}

/**
 * Builds `lvrtc serve [--root <dir>] [--port <n>] [--no-ask]`: starts the dashboard (`startDashboard`) on the runs
 * directory of the root's configuration (so `LVRTC_RUNS_DIR` applies) and its `baselines/`, prints its URL, asks the
 * engines in the background unless `--no-ask`, and closes it on SIGINT or SIGTERM.
 */
export function createServeCommand(inputs: ServeCommandInputs): CliCommand {
  return {
    name: "serve",
    summary: "Serve a read-only dashboard of the runs and baselines on 127.0.0.1",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let rootDir: string;
      let runsDir: string;
      let port: number;
      let noAsk: boolean;
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
        runsDir = loadConfig({ rootDir, env: inputs.env }).config.runsDir;
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
      await dashboard.close();
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
