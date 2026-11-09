import { statSync } from "node:fs";
import { resolve } from "node:path";

import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import type { ManifestEngine } from "../../core/manifest.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { describeEngineForManifest } from "../../core/orchestrator.ts";
import { UsageError } from "../../core/usageError.ts";
import { runConformance } from "../../engines/conformance.ts";
import type { ConformanceReport, ConformanceStatus } from "../../engines/conformance.ts";
import { enginesText } from "../../engines/adapter.ts";
import type { BuiltinEngines } from "../../engines/builtin.ts";
import { createEngineRegistry, createEngineTransport, engineTimeouts } from "../../engines/registry.ts";
import type { EngineTimeouts } from "../../engines/remote.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { ROOT_OPTION, helpText, options, paragraph } from "../help.ts";
import { codeLines, engineIdentifierLines } from "../output.ts";
import { ENGINE_OUTPUT_TEXT, IDENTIFIERS_TEXT, engineName } from "../../vocabulary/index.ts";

/** What `lvrtc engine` is wired to, injected so that tests choose it. */
export interface EngineCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that `--root` is relative to. */
  readonly cwd: string;
  /** Waits that differ from the engine's own, which are the adapter's defaults unless a built-in engine states others. */
  readonly timeouts?: Partial<EngineTimeouts>;
  /** The built-in engines; the comparator's own (`BUILTIN_ENGINES`) unless a test names others. */
  readonly builtins?: BuiltinEngines;
}

const SYNOPSIS =
  "Usage: lvrtc engine conformance <id> [--root <dir>] [--json]\n" +
  "       lvrtc engine describe <id>... [--root <dir>] [--details] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...options([
    [
      "conformance",
      `For maintainers and engine authors. Runs the conformance kit on one engine, configured or built in: it must answer hello with a description of itself in this message format and with its own id, answer "unsupported" to a quantity it does not know, refuse a malformed request, echo ids, answer the format's selftest.echo examples byte for byte if it offers that quantity, give the same answer twice if it says it is deterministic, and answer shutdown, then end cleanly. Every check is reported ${ENGINE_OUTPUT_TEXT.conformance.pass}, ${ENGINE_OUTPUT_TEXT.conformance.fail} or ${ENGINE_OUTPUT_TEXT.conformance.skipped} with a reason.`,
    ],
    [
      "describe",
      "Starts each engine named, asks it who it is and lets it go, and prints what a run would record of it: its version (with --details, the hashes that identify its code and this tool's code behind it); or that it cannot be used, with the code of why and what to do. With --json, one object { engines: [...] } in the order the ids were given, with every hash and detail.",
    ],
  ]),
  ...options([
    ROOT_OPTION,
    ["--details", `describe: ${IDENTIFIERS_TEXT.option}`],
    ["--json", "print one JSON object in place of the lines"],
  ]),
  ...paragraph(
    "Exit code of conformance: 0 when no check failed; 1 when one did; 2 when nothing was checked because the command line or the engine id cannot be used as given. Of describe: 0 when it printed, engines that cannot be used included; 2 for a command line that cannot be used as given.",
  ),
]);

const LABELS: Readonly<Record<string, string>> = ENGINE_OUTPUT_TEXT.conformance;

/** The command line of `lvrtc engine conformance` or `lvrtc engine describe`, read. */
interface EngineArguments {
  readonly action: "conformance" | "describe";
  readonly ids: readonly string[];
  readonly root: string | undefined;
  readonly details: boolean;
  readonly json: boolean;
}

/** Reads the arguments. Throws a `UsageError` for anything that is not the command line the synopsis shows. */
function readArguments(args: readonly string[]): EngineArguments {
  const [action, ...rest] = args;
  if (action === undefined) throw new UsageError("no action was named: there are conformance and describe");
  if (action !== "conformance" && action !== "describe") {
    throw new UsageError(`unknown action "${action}": there are conformance and describe`);
  }
  const { positionals: ids, values, flags } = parseArguments(rest, ["--root"], ["--json", "--details"]);
  if (ids.length === 0) throw new UsageError("no engine was named");
  if (action === "conformance" && ids.length > 1) {
    throw new UsageError(`more than one engine was named: ${ids.join(", ")}`);
  }
  return { action, ids, root: values.get("--root"), details: flags.has("--details"), json: flags.has("--json") };
}

/**
 * The lines of `lvrtc engine describe` for one engine: its id and name, whether it can be used, its version, and with
 * `details` the hashes of its code and of this tool's code behind it; for one that cannot be used, the code, what it
 * means and what to do.
 */
function describedText(engine: ManifestEngine, details: boolean): string {
  const t = ENGINE_OUTPUT_TEXT;
  const name = engineName(engine.id);
  const id = name === engine.id || name.toLowerCase() === engine.id ? engine.id : `${engine.id} (${name})`;
  if (engine.status === "unavailable") {
    return [`${id}: ${t.unavailable} (${engine.code})`, ...codeLines(engine.code, 2, engine.id)].join("\n");
  }
  const said = `${id}: ${t.available}, ${t.version} ${engine.version}`;
  return details ? `${said}\n${engineIdentifierLines([engine], 2, false).join("\n")}` : said;
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
    summary: "Check that an engine speaks the message format, or say which version of each engine would run",
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
      const { builtins } = inputs;
      const registry = createEngineRegistry(loaded, undefined, builtins);
      if (asked.action === "describe") {
        // An engine that cannot be used, an id that names none included, is said to be unavailable with its code.
        const engines: ManifestEngine[] = [];
        for (const id of asked.ids) engines.push(await describeEngineForManifest(registry, id));
        io.stdout(
          asked.json
            ? `${canonicalJson({ engines })}\n`
            : `${engines.map((engine) => describedText(engine, asked.details)).join("\n")}\n`,
        );
        return EXIT_OK;
      }
      const [id] = asked.ids;
      const [configured, builtin] = [registry.ids(), registry.builtinIds()];
      if (!configured.includes(id) && !builtin.includes(id)) {
        io.stderr(`lvrtc engine: unknown engine "${id}": ${enginesText(configured, builtin)}\n`);
        return EXIT_USAGE;
      }

      const report = await runConformance({
        id,
        createTransport: () => createEngineTransport(loaded, id, undefined, builtins),
        // The engine's own waits, as a run would use them, unless this command was given others.
        timeouts: { ...engineTimeouts(loaded, id, builtins), ...inputs.timeouts },
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
