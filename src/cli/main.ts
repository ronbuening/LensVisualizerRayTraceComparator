import packageJson from "../../package.json" with { type: "json" };
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "./command.ts";
import type { CliCommand, CliIo } from "./command.ts";
import { baselineCommand } from "./commands/baseline.ts";
import { checkLvCommand } from "./commands/checkLv.ts";
import { checksCommand } from "./commands/checks.ts";
import { collectCommand } from "./commands/collect.ts";
import { compareCommand } from "./commands/compare.ts";
import { doctorCommand } from "./commands/doctor.ts";
import { engineCommand } from "./commands/engine.ts";
import { exportCommand } from "./commands/export.ts";
import { glossaryCommand } from "./commands/glossary.ts";
import { lensesCommand } from "./commands/lenses.ts";
import { matrixCommand } from "./commands/matrix.ts";
import { mtfCommand } from "./commands/mtf.ts";
import { reportCommand } from "./commands/report.ts";
import { runCommand } from "./commands/run.ts";
import { serveCommand } from "./commands/serve.ts";
import { storeCommand } from "./commands/store.ts";
import { statementCommand } from "./commands/statement.ts";
import { verifyCommand } from "./commands/verify.ts";
import { CLI_TEXT } from "../vocabulary/cli.ts";
import type { CliGroupEntry } from "../vocabulary/cli.ts";
import { ERROR_OUTPUT_TEXT } from "../vocabulary/output.ts";
import { codeLines } from "./output.ts";
import { LvBindingError } from "../engines/lv/errors.ts";

export { EXIT_FAILURE, EXIT_OK, EXIT_USAGE };
export type { CliCommand, CliIo };

/** Every command; the top-level help lists them in the groups of `CLI_TEXT`. */
export const COMMANDS: readonly CliCommand[] = [
  doctorCommand,
  checksCommand,
  glossaryCommand,
  checkLvCommand,
  runCommand,
  collectCommand,
  compareCommand,
  reportCommand,
  baselineCommand,
  verifyCommand,
  statementCommand,
  matrixCommand,
  engineCommand,
  lensesCommand,
  exportCommand,
  mtfCommand,
  storeCommand,
  serveCommand,
];

/** One line of the top-level help: what to type, and what it does. */
type HelpRow = readonly [name: string, summary: string];

/**
 * The top-level help: what lvrtc is, then the registered commands in the groups of `CLI_TEXT`, a command with
 * subcommands as one line each where the groups name them; a registered command that no group names is listed last.
 */
function helpText(commands: readonly CliCommand[]): string {
  const named = new Set<string>();
  const groups: { title: string; rows: HelpRow[] }[] = [];
  for (const group of CLI_TEXT.groups) {
    const rows: HelpRow[] = [];
    const entries: readonly CliGroupEntry[] = group.entries;
    for (const entry of entries) {
      const command = commands.find((candidate) => candidate.name === entry.command);
      if (command === undefined) continue;
      named.add(command.name);
      const sub = entry.sub === undefined ? "" : ` ${entry.sub}`;
      rows.push([`${command.name}${sub}`, entry.summary ?? command.summary]);
    }
    if (rows.length > 0) groups.push({ title: group.title, rows });
  }
  const others = commands.filter((command) => !named.has(command.name));
  if (others.length > 0) {
    groups.push({ title: CLI_TEXT.other, rows: others.map((command) => [command.name, command.summary]) });
  }
  const width = Math.max(0, ...groups.flatMap((group) => group.rows.map(([name]) => name.length)));
  const optionWidth = Math.max(...CLI_TEXT.optionRows.map(([name]) => name.length));
  return [
    CLI_TEXT.usage,
    "",
    ...CLI_TEXT.intro,
    "",
    ...(groups.length > 0
      ? groups.flatMap((group) => [
          `${group.title}:`,
          ...group.rows.map(([name, summary]) => `  ${name.padEnd(width)}  ${summary}`),
          "",
        ])
      : ["Commands:", `  ${CLI_TEXT.none}`, ""]),
    CLI_TEXT.options,
    ...CLI_TEXT.optionRows.map(([name, summary]) => `  ${name.padEnd(optionWidth)}  ${summary}`),
    "",
    ...CLI_TEXT.footer,
    "",
  ].join("\n");
}

/** `lvrtc help <command> [<subcommand>]`: the command's own help, as `lvrtc <command> --help` prints it. */
async function commandHelp(name: string, commands: readonly CliCommand[], io: CliIo): Promise<number> {
  const command = commands.find((candidate) => candidate.name === name);
  if (command === undefined) {
    io.stderr(`lvrtc help: there is no command "${name}"\n\n${helpText(commands)}`);
    return EXIT_USAGE;
  }
  return command.run(["--help"], io);
}

export async function runCli(
  argv: readonly string[],
  io: CliIo,
  commands: readonly CliCommand[] = COMMANDS,
): Promise<number> {
  const [first, ...rest] = argv;
  if (first === "help" && rest.length > 0) return commandHelp(rest[0], commands, io);
  if (first === undefined || first === "-h" || first === "--help" || first === "help") {
    io.stdout(helpText(commands));
    return EXIT_OK;
  }
  if (first === "-v" || first === "--version") {
    io.stdout(`${packageJson.version}\n`);
    return EXIT_OK;
  }
  const command = commands.find((candidate) => candidate.name === first);
  if (!command) {
    io.stderr(`lvrtc: unknown command "${first}"\n\n${helpText(commands)}`);
    return EXIT_USAGE;
  }
  try {
    return await command.run(rest, io);
  } catch (error) {
    io.stderr(`lvrtc ${command.name}: ${error instanceof Error ? error.message : String(error)}\n`);
    // An error that carries a code the vocabulary knows (LensVisualizer's binding, an engine) says how to fix it: the
    // error classes keep their words, and the remedy is added where the error is shown.
    const code = (error as { readonly code?: unknown } | null)?.code;
    const means = codeLines(
      typeof code === "string" ? code : null,
      2,
      error instanceof LvBindingError ? "lv" : undefined,
    );
    if (means.length > 0) io.stderr(`${ERROR_OUTPUT_TEXT.fix}:\n${means.join("\n")}\n`);
    return EXIT_FAILURE;
  }
}
