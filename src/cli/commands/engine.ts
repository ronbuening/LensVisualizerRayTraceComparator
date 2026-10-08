import { statSync } from "node:fs";
import { resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { UsageError } from "../../core/usageError.ts";
import { runConformance } from "../../engines/conformance.ts";
import type { ConformanceReport, ConformanceStatus } from "../../engines/conformance.ts";
import { enginesText } from "../../engines/adapter.ts";
import { createEngineRegistry, createEngineTransport } from "../../engines/registry.ts";
import type { EngineTimeouts } from "../../engines/remote.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

/** What `lvrtc engine` is wired to, injected so that tests choose it. */
export interface EngineCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that `--root` is relative to. */
  readonly cwd: string;
  /** Waits that differ from the adapter's defaults. */
  readonly timeouts?: Partial<EngineTimeouts>;
}

const SYNOPSIS = "Usage: lvrtc engine conformance <id> [--root <dir>] [--json]\n";
const HELP = [
  SYNOPSIS,
  "Runs the conformance kit on one engine, configured or built in: it must answer hello with a descriptor of this",
  'contract and its own id, answer an unknown quantity "unsupported", refuse a malformed run, echo ids, answer the',
  "contract's selftest.echo examples byte for byte if it offers the quantity, repeat itself if it says it is",
  "deterministic, and answer shutdown, then end cleanly. Every check is reported",
  "PASS, FAIL or SKIPPED with a reason.",
  "",
  "  --root <dir>  the directory that holds lvrtc.config.json (default: this repository)",
  "  --json        print one JSON object in place of the lines",
  "",
  "Exit code: 0 when no check failed; 1 when one did; 2 when nothing was checked because the command line or the",
  "engine id cannot be used as given.",
  "",
].join("\n");

const LABELS: Readonly<Record<ConformanceStatus, string>> = { pass: "PASS", fail: "FAIL", skipped: "SKIPPED" };

/** The command line of `lvrtc engine conformance`, read. */
interface EngineArguments {
  readonly id: string;
  readonly root: string | undefined;
  readonly json: boolean;
}

/** Reads the arguments. Throws a `UsageError` for anything that is not the command line the synopsis shows. */
function readArguments(args: readonly string[]): EngineArguments {
  const [action, ...rest] = args;
  if (action === undefined) throw new UsageError("no action was named: there is conformance");
  if (action !== "conformance") throw new UsageError(`unknown action "${action}": there is conformance`);
  const { positionals: ids, values, flags } = parseArguments(rest, ["--root"], ["--json"]);
  if (ids.length === 0) throw new UsageError("no engine was named");
  if (ids.length > 1) throw new UsageError(`more than one engine was named: ${ids.join(", ")}`);
  return { id: ids[0], root: values.get("--root"), json: flags.has("--json") };
}

/** One line per check, in columns, and a closing line that counts them. */
function reportText(report: ConformanceReport): string {
  const width = Math.max(...report.checks.map((check) => check.id.length));
  const lines = report.checks.map(
    (check) => `${LABELS[check.status].padEnd(7)}  ${check.id.padEnd(width)}  ${check.detail}`,
  );
  const count = (status: ConformanceStatus): number => report.checks.filter((check) => check.status === status).length;
  const verdict = report.passed ? "conforms" : "does not conform";
  const counts = `${count("pass")} passed, ${count("fail")} failed, ${count("skipped")} skipped`;
  return [...lines, `${report.engine}: ${verdict}: ${counts}`, ""].join("\n");
}

/**
 * Builds `lvrtc engine conformance <id> [--root <dir>] [--json]`.
 *
 * It loads the configuration of the root, builds the transport of the engine `<id>`, which the configuration
 * defines or which is built in, and runs the conformance kit on it (`runConformance`). Each check is printed as a
 * line of PASS, FAIL or SKIPPED, the check's name and the reason, and a count follows; with `--json` the report is
 * printed as one object with sorted keys. It is console output: a reason may quote what the engine or the system
 * said.
 *
 * Exit codes: 0 when no check failed; 1 when one did, which includes an engine that is configured and cannot be
 * built or reached; 2, with nothing checked, for a command line that is not the synopsis, a `--root` that is not a
 * directory and an id that is neither a configured nor a built-in engine. A configuration file that cannot be used
 * is an error like any other, as for `lvrtc doctor`.
 */
export function createEngineCommand(inputs: EngineCommandInputs): CliCommand {
  return {
    name: "engine",
    summary: "Check that an engine conforms to the contract",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let asked: EngineArguments;
      try {
        asked = readArguments(args);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc engine: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      const rootDir = asked.root === undefined ? inputs.rootDir : resolve(inputs.cwd, asked.root);
      if (asked.root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
        io.stderr(`lvrtc engine: --root ${asked.root}: not a directory\n`);
        return EXIT_USAGE;
      }
      const loaded = loadConfig({ rootDir, env: inputs.env });
      const registry = createEngineRegistry(loaded);
      const [configured, builtin] = [registry.ids(), registry.builtinIds()];
      if (!configured.includes(asked.id) && !builtin.includes(asked.id)) {
        io.stderr(`lvrtc engine: unknown engine "${asked.id}": ${enginesText(configured, builtin)}\n`);
        return EXIT_USAGE;
      }

      const report = await runConformance({
        id: asked.id,
        createTransport: () => createEngineTransport(loaded, asked.id),
        timeouts: inputs.timeouts,
      });
      // Canonical JSON sorts the keys at every depth; parsing it keeps that order for the indented text.
      io.stdout(asked.json ? `${JSON.stringify(JSON.parse(canonicalJson(report)), null, 2)}\n` : reportText(report));
      return report.passed ? EXIT_OK : EXIT_FAILURE;
    },
  };
}

/** `lvrtc engine` wired to this repository, the process environment and the directory the process was started in. */
export const engineCommand: CliCommand = createEngineCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
