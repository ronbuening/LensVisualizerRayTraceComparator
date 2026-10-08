// What `lvrtc compare` and `lvrtc report` share: a command line that names one run of a suite, by the suite's name
// or by its run directory, and the way from that name to the directory.
import { existsSync, statSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

import { loadConfig } from "../core/config.ts";
import { MANIFEST_FILE } from "../core/manifest.ts";
import { UsageError } from "../core/usageError.ts";

/** What a command that reads a run directory is wired to, injected so that tests choose all three. */
export interface RunTargetInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that a run directory and `--root` are relative to. */
  readonly cwd: string;
}

/** A command line read: the one target it names, the value of each option that takes one, and the flags set. */
export interface TargetArguments {
  readonly target: string;
  readonly values: ReadonlyMap<string, string>;
  readonly flags: ReadonlySet<string>;
}

/**
 * Reads a command line of one target, options that take a value (`valueOptions`) and flags. Throws a `UsageError`
 * for an option that is neither, one given twice or without its value, no target and more than one.
 */
export function parseTargetArguments(
  args: readonly string[],
  valueOptions: readonly string[],
  flagOptions: readonly string[],
): TargetArguments {
  const targets: string[] = [];
  const values = new Map<string, string>();
  const flags = new Set<string>();
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (flagOptions.includes(arg)) flags.add(arg);
    else if (valueOptions.includes(arg)) {
      const value = args[++index];
      if (value === undefined || value.startsWith("--")) throw new UsageError(`${arg} needs a value`);
      if (values.has(arg)) throw new UsageError(`${arg} is given more than once`);
      values.set(arg, value);
    } else if (arg.startsWith("-")) throw new UsageError(`unknown option "${arg}"`);
    else targets.push(arg);
  }
  if (targets.length === 0) throw new UsageError("no suite name or run directory was given");
  if (targets.length > 1) throw new UsageError(`more than one suite or run directory was given: ${targets.join(", ")}`);
  return { target: targets[0], values, flags };
}

/**
 * The run directory that `target` names: the directory that holds a run's `manifest.json`.
 *
 * A target without a path separator is taken first as a suite name, `<runsDir>/<target>`, where `runsDir` is that
 * of the configuration root (`root` when given, relative to `inputs.cwd`, else `inputs.rootDir`) under
 * `inputs.env`. Any target is then taken as a directory, relative to `inputs.cwd`. The first of the two that holds
 * a manifest is the answer. The store of a run directory is the `store` directory beside it, whichever way it was
 * named.
 *
 * Throws a `UsageError` when `root` is not a directory and when neither place holds a manifest. A configuration
 * file that cannot be used throws as `loadConfig` does.
 */
export function resolveRunDirectory(target: string, root: string | undefined, inputs: RunTargetInputs): string {
  const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd, root);
  if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
    throw new UsageError(`--root ${root}: not a directory`);
  }
  const candidates: string[] = [];
  if (!isAbsolute(target) && !/[\\/]/.test(target) && target !== "." && target !== "..") {
    candidates.push(join(loadConfig({ rootDir, env: inputs.env }).config.runsDir, target));
  }
  candidates.push(resolve(inputs.cwd, target));
  const found = candidates.find((directory) => existsSync(join(directory, MANIFEST_FILE)));
  if (found === undefined) {
    throw new UsageError(
      `no run of "${target}" was found: there is no ${MANIFEST_FILE} in ${candidates.join(" or in ")}; run lvrtc run first`,
    );
  }
  return found;
}
