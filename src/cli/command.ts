// The command contract lives apart from main.ts so command modules and the registry do not import each other.

/** Output sinks, injected so commands can be tested without touching the process streams. */
export interface CliIo {
  stdout(text: string): void;
  stderr(text: string): void;
}

/** One `lvrtc <name>` subcommand. */
export interface CliCommand {
  readonly name: string;
  readonly summary: string;
  /** Resolves to the process exit code. */
  run(args: readonly string[], io: CliIo): Promise<number>;
}

/** Exit code of a command that did what was asked. */
export const EXIT_OK = 0;
/** Exit code of a command that ran and failed. */
export const EXIT_FAILURE = 1;
/** Exit code of a command line that could not be understood. */
export const EXIT_USAGE = 2;
