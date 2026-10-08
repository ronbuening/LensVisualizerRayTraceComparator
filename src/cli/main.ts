import packageJson from "../../package.json" with { type: "json" };
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "./command.ts";
import type { CliCommand, CliIo } from "./command.ts";
import { doctorCommand } from "./commands/doctor.ts";
import { engineCommand } from "./commands/engine.ts";
import { runCommand } from "./commands/run.ts";

export { EXIT_FAILURE, EXIT_OK, EXIT_USAGE };
export type { CliCommand, CliIo };

/** Commands register here as their stages land. */
export const COMMANDS: readonly CliCommand[] = [doctorCommand, runCommand, engineCommand];

function helpText(commands: readonly CliCommand[]): string {
  const width = Math.max(0, ...commands.map((command) => command.name.length));
  const rows = commands.map((command) => `  ${command.name.padEnd(width)}  ${command.summary}`);
  return [
    "Usage: lvrtc <command> [options]",
    "",
    "Commands:",
    ...(rows.length > 0 ? rows : ["  (none yet)"]),
    "",
    "Options:",
    "  -h, --help     Show this help",
    "  -v, --version  Show the version",
    "",
  ].join("\n");
}

export async function runCli(
  argv: readonly string[],
  io: CliIo,
  commands: readonly CliCommand[] = COMMANDS,
): Promise<number> {
  const [first, ...rest] = argv;
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
    return EXIT_FAILURE;
  }
}
