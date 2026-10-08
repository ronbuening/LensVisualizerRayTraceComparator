import { readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { isEngineId } from "../contract/engine.ts";
import type { JsonObject } from "../contract/json.ts";

/** The repository root: the directory that holds `lvrtc.config.json`. */
export const REPO_ROOT: string = resolve(fileURLToPath(new URL("../..", import.meta.url)));

/** The committed configuration file, read from the root directory. */
export const CONFIG_FILE = "lvrtc.config.json";
/** The gitignored per-machine configuration file, read from the root directory. */
export const LOCAL_CONFIG_FILE = "lvrtc.local.json";

/** The layer that set a value, lowest precedence first: built-in default, the two files, the environment. */
export type ConfigLayer = "default" | typeof CONFIG_FILE | typeof LOCAL_CONFIG_FILE | "env";

/** Every configuration value, addressed by its dotted path in the JSON files. */
export const CONFIG_KEYS = ["lvPath", "python", "engines.optiland.python", "cacheDir", "runsDir"] as const;
/** The dotted path of one configuration value. */
export type ConfigKey = (typeof CONFIG_KEYS)[number];

/** Environment variables forming the highest layer; an unset or empty variable sets nothing. */
const ENV_VARIABLES: Readonly<Partial<Record<ConfigKey, string>>> = {
  lvPath: "LVRTC_LV_PATH",
  python: "LVRTC_PYTHON",
  "engines.optiland.python": "LVRTC_OPTILAND_PYTHON",
  runsDir: "LVRTC_RUNS_DIR",
};

/**
 * How one engine is reached, as `engines.<id>` defines it; the member `transport` says which of the two it is.
 *
 * - `in-process`: `module` is the absolute path of a module that exports `createEngine(options)`.
 * - `stdio`: `command` is the worker's command line, whose first word is an absolute path or a bare command name
 *   and whose other words are as written, and `env` the variables set for it on top of the environment.
 *
 * `options` is the engine's own business; it is `{}` when the definition gives none.
 */
export type EngineDefinition =
  | { readonly transport: "in-process"; readonly module: string; readonly options: JsonObject }
  | {
      readonly transport: "stdio";
      readonly command: readonly string[];
      readonly options: JsonObject;
      readonly env: Readonly<Record<string, string>>;
    };

/** Resolved configuration. Directories are absolute; an interpreter is an absolute path or a bare command name. */
export interface Config {
  /** LensVisualizer checkout, or null when not configured. */
  readonly lvPath: string | null;
  /** Interpreter for the stdlib-only Python worker kit. */
  readonly python: string;
  readonly engines: {
    readonly optiland: {
      /** Interpreter that can import optiland, or null when not configured. */
      readonly python: string | null;
    };
  };
  /** The engines that `engines.<id>` defines with a `transport`, by engine id, in sorted order. */
  readonly engineDefinitions: Readonly<Record<string, EngineDefinition>>;
  readonly cacheDir: string;
  readonly runsDir: string;
}

/** A resolved configuration together with the layer that set each value. */
export interface LoadedConfig {
  /** Absolute directory the files were read from and relative paths were resolved against. */
  readonly rootDir: string;
  readonly config: Config;
  readonly sources: Readonly<Record<ConfigKey, ConfigLayer>>;
}

/** The resolved value at a dotted key. */
export function configValue(config: Config, key: ConfigKey): string | null {
  switch (key) {
    case "lvPath":
      return config.lvPath;
    case "python":
      return config.python;
    case "engines.optiland.python":
      return config.engines.optiland.python;
    case "cacheDir":
      return config.cacheDir;
    case "runsDir":
      return config.runsDir;
  }
}

/** Explicit inputs of `loadConfig`, so callers decide which directory and environment are read. */
export interface LoadConfigInput {
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
}

type Values = Record<ConfigKey, string | null>;

const DEFAULTS: Values = {
  lvPath: null,
  python: "python3",
  "engines.optiland.python": null,
  cacheDir: ".cache",
  runsDir: "runs",
};

const NULLABLE: ReadonlySet<ConfigKey> = new Set<ConfigKey>(["lvPath", "engines.optiland.python"]);
/** Interpreters may be bare command names, which are looked up on PATH and so are not resolved as paths. */
const INTERPRETERS: ReadonlySet<ConfigKey> = new Set<ConfigKey>(["python", "engines.optiland.python"]);

function isConfigKey(key: string): key is ConfigKey {
  return (CONFIG_KEYS as readonly string[]).includes(key);
}

function checkedValue(key: ConfigKey, value: unknown, file: string): string | null {
  if (value === null && NULLABLE.has(key)) return null;
  if (typeof value === "string" && value !== "") return value;
  throw new Error(`${file}: "${key}" must be a non-empty string${NULLABLE.has(key) ? " or null" : ""}`);
}

/** What one layer sets: values by key, and engine definitions by engine id, with paths as they were written. */
interface Layer {
  readonly values: Partial<Values>;
  readonly engines: Record<string, EngineDefinition>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unknownKey(key: string, file: string, hint: string = ""): Error {
  return new Error(`${file}: unknown key "${key}"${hint === "" ? "" : ` (${hint})`}`);
}

const NEST_HINT = "nest objects instead of writing dots";

/** The members of an engine definition, by transport. A definition has those of its transport and no other. */
const DEFINITION_MEMBERS = {
  "in-process": ["transport", "module", "options"],
  stdio: ["transport", "command", "options", "env"],
} as const;
const TRANSPORTS = Object.keys(DEFINITION_MEMBERS).map((name) => `"${name}"`);

/**
 * The engine definition that the members of `engines.<id>` state, unresolved. `key` is `engines.<id>`; every error
 * names the member at fault by its dotted key.
 */
function checkedDefinition(key: string, members: Readonly<Record<string, unknown>>, file: string): EngineDefinition {
  const wrong = (member: string, must: string): Error => new Error(`${file}: "${key}.${member}" must be ${must}`);
  const { transport, module, command, options = {}, env = {} } = members;
  if (transport !== "in-process" && transport !== "stdio") throw wrong("transport", TRANSPORTS.join(" or "));
  const allowed: readonly string[] = DEFINITION_MEMBERS[transport];
  const misplaced = Object.keys(members).find((name) => !allowed.includes(name));
  if (misplaced !== undefined) {
    throw unknownKey(
      `${key}.${misplaced}`,
      file,
      `a definition with transport "${transport}" has ${allowed.join(", ")}`,
    );
  }
  if (!isPlainObject(options)) throw wrong("options", "an object");

  if (transport === "in-process") {
    if (typeof module !== "string" || module === "") throw wrong("module", "a non-empty string");
    return { transport, module, options };
  }
  const isWord = (word: unknown): word is string => typeof word === "string" && word !== "";
  if (!Array.isArray(command) || command.length === 0 || !command.every(isWord)) {
    throw wrong("command", "a non-empty list of non-empty strings");
  }
  if (!isPlainObject(env)) throw wrong("env", "an object");
  const variables = Object.entries(env).map(([name, value]): [string, string] => {
    if (typeof value !== "string") throw wrong(`env.${name}`, "a string");
    return [name, value];
  });
  return { transport, command: [...command], options, env: Object.fromEntries(variables) };
}

/**
 * Reads the `engines` object: under each engine id, the plain values that are configuration keys of their own
 * (`engines.optiland.python`) and, when anything else is there, an engine definition. An entry with neither is an
 * error, except where the id has keys of its own, so that `"optiland": {}` still sets nothing.
 */
function collectEngines(node: unknown, file: string, into: Layer): void {
  if (!isPlainObject(node)) throw new Error(`${file}: "engines" must be an object`);
  const definitionMembers: readonly string[] = Object.values(DEFINITION_MEMBERS).flat();
  for (const [id, entry] of Object.entries(node)) {
    const key = `engines.${id}`;
    if (id.includes(".")) throw unknownKey(key, file, NEST_HINT);
    if (!isEngineId(id)) {
      throw new Error(
        `${file}: "${key}" is not an engine id: a lowercase letter, then lowercase letters, digits or "-"`,
      );
    }
    if (!isPlainObject(entry)) throw new Error(`${file}: "${key}" must be an object`);

    const definition: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(entry)) {
      const memberKey = `${key}.${name}`;
      if (name.includes(".")) throw unknownKey(memberKey, file, NEST_HINT);
      if (isConfigKey(memberKey)) into.values[memberKey] = checkedValue(memberKey, value, file);
      else if (definitionMembers.includes(name)) definition[name] = value;
      else throw unknownKey(memberKey, file);
    }
    const hasOwnKeys = CONFIG_KEYS.some((known) => known.startsWith(`${key}.`));
    if (Object.keys(definition).length > 0 || !hasOwnKeys) into.engines[id] = checkedDefinition(key, definition, file);
  }
}

function collect(node: unknown, prefix: string, file: string, into: Layer): void {
  if (!isPlainObject(node)) {
    throw new Error(`${file}: ${prefix === "" ? "the top level" : `"${prefix}"`} must be an object`);
  }
  for (const [name, value] of Object.entries(node)) {
    const key = prefix === "" ? name : `${prefix}.${name}`;
    // A name containing a dot is never valid: "engines.optiland.python" is reached only by nesting.
    const plain = !name.includes(".");
    if (key === "engines") collectEngines(value, file, into);
    else if (plain && isConfigKey(key)) into.values[key] = checkedValue(key, value, file);
    else if (plain && CONFIG_KEYS.some((known) => known.startsWith(`${key}.`))) collect(value, key, file, into);
    else throw unknownKey(key, file, plain ? "" : NEST_HINT);
  }
}

/** What one file sets; a file that does not exist sets nothing. */
function readFileLayer(file: string): Layer {
  const reason = (error: unknown): string => (error instanceof Error ? error.message : String(error));
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { values: {}, engines: {} };
    // Node's own message does not always carry the path (EISDIR), so it is put in front.
    throw new Error(`${file}: cannot be read (${reason(error)})`, { cause: error });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`${file}: malformed JSON (${reason(error)})`, { cause: error });
  }
  const layer: Layer = { values: {}, engines: {} };
  collect(parsed, "", file, layer);
  return layer;
}

/** The environment sets values only: an engine is defined in a file. */
function readEnvLayer(env: LoadConfigInput["env"]): Layer {
  const values: Partial<Values> = {};
  for (const key of CONFIG_KEYS) {
    const name = ENV_VARIABLES[key];
    const value = name === undefined ? undefined : env[name];
    if (value !== undefined && value !== "") values[key] = value;
  }
  return { values, engines: {} };
}

/** A command as it is run: a bare name is left for PATH to find, anything else is a path resolved against the root. */
function resolvedCommand(command: string, rootDir: string): string {
  return !command.includes("/") && !command.includes(sep) ? command : resolve(rootDir, command);
}

function resolved(key: ConfigKey, value: string | null, rootDir: string): string | null {
  if (value === null) return null;
  return INTERPRETERS.has(key) ? resolvedCommand(value, rootDir) : resolve(rootDir, value);
}

function resolvedDefinition(definition: EngineDefinition, rootDir: string): EngineDefinition {
  if (definition.transport === "in-process") return { ...definition, module: resolve(rootDir, definition.module) };
  const [program, ...args] = definition.command;
  return { ...definition, command: [resolvedCommand(program, rootDir), ...args] };
}

/**
 * Loads the layered configuration: built-in defaults < `lvrtc.config.json` < `lvrtc.local.json` < environment.
 *
 * Both files are optional and are read from `rootDir`. Relative paths from every layer, the environment included,
 * resolve against `rootDir`; an interpreter given as a bare command name is kept as it is. Throws an error naming
 * the file when it exists but cannot be read, on malformed JSON, on an unknown key and on a value of the wrong
 * type. Reads nothing but the two files and the `env` it is given.
 *
 * `engines.<id>` with a `transport` defines an engine. A definition is taken whole from the highest layer that
 * states one for that id, never merged across layers; its `module`, and a `command` whose first word is a path,
 * resolve against `rootDir` like every other path. `engines.optiland.python` is a value of its own and may stand
 * with or without a definition beside it.
 */
export function loadConfig(input: LoadConfigInput): LoadedConfig {
  const rootDir = resolve(input.rootDir);
  const layers: readonly [ConfigLayer, Layer][] = [
    [CONFIG_FILE, readFileLayer(join(rootDir, CONFIG_FILE))],
    [LOCAL_CONFIG_FILE, readFileLayer(join(rootDir, LOCAL_CONFIG_FILE))],
    ["env", readEnvLayer(input.env)],
  ];

  const values: Values = { ...DEFAULTS };
  const sources = Object.fromEntries(CONFIG_KEYS.map((key) => [key, "default"])) as Record<ConfigKey, ConfigLayer>;
  const definitions = new Map<string, EngineDefinition>();
  for (const [layer, { values: layerValues, engines }] of layers) {
    for (const key of CONFIG_KEYS) {
      const value = layerValues[key];
      if (value === undefined) continue;
      values[key] = value;
      sources[key] = layer;
    }
    // A definition replaces the one a lower layer gave the same id, whole.
    for (const [id, definition] of Object.entries(engines)) {
      definitions.set(id, resolvedDefinition(definition, rootDir));
    }
  }
  const sortedDefinitions = [...definitions].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  const optional = (key: ConfigKey): string | null => resolved(key, values[key], rootDir);
  const required = (key: ConfigKey): string => {
    const value = optional(key);
    // Unreachable: only the nullable keys accept null from a file, and no default of the others is null.
    if (value === null) throw new Error(`"${key}" has no value`);
    return value;
  };
  return {
    rootDir,
    config: {
      lvPath: optional("lvPath"),
      python: required("python"),
      engines: { optiland: { python: optional("engines.optiland.python") } },
      engineDefinitions: Object.fromEntries(sortedDefinitions),
      cacheDir: required("cacheDir"),
      runsDir: required("runsDir"),
    },
    sources,
  };
}
