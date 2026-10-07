import packageJson from "../../package.json" with { type: "json" };

/** Output sinks, injected so commands can be tested without touching the process streams. */
export interface CliIo {
  stdout(text: string): void;
  stderr(text: string): void;
}

export interface CliCommand {
  readonly name: string;
  readonly summary: string;
  /** Resolves to the process exit code. */
  run(args: readonly string[], io: CliIo): Promise<number>;
}

export const EXIT_OK = 0;
export const EXIT_FAILURE = 1;
export const EXIT_USAGE = 2;

/** Commands register here as their stages land. */
export const COMMANDS: readonly CliCommand[] = [];

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
