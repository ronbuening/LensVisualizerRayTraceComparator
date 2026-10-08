import { UsageError } from "../core/usageError.ts";

/** A command line read: what is not an option, the value of each option that takes one, and the flags set. */
export interface ParsedArguments {
  readonly positionals: readonly string[];
  readonly values: ReadonlyMap<string, string>;
  readonly flags: ReadonlySet<string>;
}

/**
 * Reads a command line of positional words, options that take a value (`valueOptions`) and flags (`flagOptions`).
 * A value follows its option as the next word or after "=": `--root dir` and `--root=dir` are the same. Throws a
 * `UsageError` for an option that is neither kind, one given twice and one without its value.
 */
export function parseArguments(
  args: readonly string[],
  valueOptions: readonly string[],
  flagOptions: readonly string[],
): ParsedArguments {
  const positionals: string[] = [];
  const values = new Map<string, string>();
  const flags = new Set<string>();
  const setValue = (option: string, value: string | undefined): void => {
    if (value === undefined) throw new UsageError(`${option} needs a value`);
    if (values.has(option)) throw new UsageError(`${option} is given more than once`);
    values.set(option, value);
  };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const equals = arg.startsWith("--") ? arg.indexOf("=") : -1;
    if (flagOptions.includes(arg)) flags.add(arg);
    else if (valueOptions.includes(arg)) {
      // The next word is the value unless it is itself an option: `--root --json` gives --root none.
      const next = args[++index];
      setValue(arg, next?.startsWith("--") ? undefined : next);
    } else if (equals > 0 && valueOptions.includes(arg.slice(0, equals))) {
      // After "=" the value is whatever was written, except nothing at all.
      setValue(arg.slice(0, equals), arg.slice(equals + 1) || undefined);
    } else if (arg.startsWith("-")) throw new UsageError(`unknown option "${arg}"`);
    else positionals.push(arg);
  }
  return { positionals, values, flags };
}
