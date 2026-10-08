import { spawnSync } from "node:child_process";

/** Outcome of a command that ran to completion. */
export interface CommandResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

/** Runs a command to completion without a shell; null when it could not be started or did not finish. */
export type CommandRunner = (command: string, args: readonly string[]) => CommandResult | null;

const COMMAND_TIMEOUT_MS = 20_000;

/**
 * The variables with which git points its hooks and `rebase --exec` commands at its own repository
 * (`git rev-parse --local-env-vars`). They outrank `-C`, so a probe that inherited them would read LensVisualizer's
 * commit and dirty flag from whichever repository the parent git was working in.
 */
const GIT_REPOSITORY_VARIABLES: readonly string[] = [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_CONFIG",
  "GIT_CONFIG_COUNT",
  "GIT_CONFIG_PARAMETERS",
  "GIT_DIR",
  "GIT_GRAFT_FILE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_REPLACE_REF_BASE",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
];

function commandEnvironment(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, PYTHONDONTWRITEBYTECODE: "1" };
  for (const name of GIT_REPOSITORY_VARIABLES) delete env[name];
  return env;
}

/** True for a command that ran and exited with status 0. */
export function commandSucceeded(result: CommandResult | null): result is CommandResult {
  return result !== null && result.status === 0;
}

/**
 * Runs a command on this machine, without a shell and under a time limit. Python is told not to write bytecode, and
 * git is not handed a repository inherited from a parent git.
 */
export const runSystemCommand: CommandRunner = (command, args) => {
  try {
    const result = spawnSync(command, [...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: COMMAND_TIMEOUT_MS,
      env: commandEnvironment(),
    });
    return result.error ? null : { status: result.status, stdout: result.stdout, stderr: result.stderr };
  } catch {
    // spawnSync throws, instead of reporting, on a command line it refuses outright (a NUL byte in a path).
    return null;
  }
};
