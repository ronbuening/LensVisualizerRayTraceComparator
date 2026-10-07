import { readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

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

function collect(node: unknown, prefix: string, file: string, into: Partial<Values>): void {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    throw new Error(`${file}: ${prefix === "" ? "the top level" : `"${prefix}"`} must be an object`);
  }
  for (const [name, value] of Object.entries(node)) {
    const key = prefix === "" ? name : `${prefix}.${name}`;
    // A name containing a dot is never valid: "engines.optiland.python" is reached only by nesting.
    const plain = !name.includes(".");
    if (plain && isConfigKey(key)) into[key] = checkedValue(key, value, file);
    else if (plain && CONFIG_KEYS.some((known) => known.startsWith(`${key}.`))) collect(value, key, file, into);
    else throw new Error(`${file}: unknown key "${key}"${plain ? "" : " (nest objects instead of writing dots)"}`);
  }
}

/** The values one file sets; a file that does not exist sets none. */
function readFileLayer(file: string): Partial<Values> {
  const reason = (error: unknown): string => (error instanceof Error ? error.message : String(error));
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    // Node's own message does not always carry the path (EISDIR), so it is put in front.
    throw new Error(`${file}: cannot be read (${reason(error)})`, { cause: error });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`${file}: malformed JSON (${reason(error)})`, { cause: error });
  }
  const values: Partial<Values> = {};
  collect(parsed, "", file, values);
  return values;
}

function readEnvLayer(env: LoadConfigInput["env"]): Partial<Values> {
  const values: Partial<Values> = {};
  for (const key of CONFIG_KEYS) {
    const name = ENV_VARIABLES[key];
    const value = name === undefined ? undefined : env[name];
    if (value !== undefined && value !== "") values[key] = value;
  }
  return values;
}

function resolved(key: ConfigKey, value: string | null, rootDir: string): string | null {
  if (value === null) return null;
  const isBareCommand = INTERPRETERS.has(key) && !value.includes("/") && !value.includes(sep);
  return isBareCommand ? value : resolve(rootDir, value);
}

/**
 * Loads the layered configuration: built-in defaults < `lvrtc.config.json` < `lvrtc.local.json` < environment.
 *
 * Both files are optional and are read from `rootDir`. Relative paths from every layer, the environment included,
 * resolve against `rootDir`; an interpreter given as a bare command name is kept as it is. Throws an error naming
 * the file when it exists but cannot be read, on malformed JSON, on an unknown key and on a value of the wrong
 * type. Reads nothing but the two files and the `env` it is given.
 */
export function loadConfig(input: LoadConfigInput): LoadedConfig {
  const rootDir = resolve(input.rootDir);
  const layers: readonly [ConfigLayer, Partial<Values>][] = [
    [CONFIG_FILE, readFileLayer(join(rootDir, CONFIG_FILE))],
    [LOCAL_CONFIG_FILE, readFileLayer(join(rootDir, LOCAL_CONFIG_FILE))],
    ["env", readEnvLayer(input.env)],
  ];

  const values: Values = { ...DEFAULTS };
  const sources = Object.fromEntries(CONFIG_KEYS.map((key) => [key, "default"])) as Record<ConfigKey, ConfigLayer>;
  for (const [layer, layerValues] of layers) {
    for (const key of CONFIG_KEYS) {
      const value = layerValues[key];
      if (value === undefined) continue;
      values[key] = value;
      sources[key] = layer;
    }
  }

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
      cacheDir: required("cacheDir"),
      runsDir: required("runsDir"),
    },
    sources,
  };
}
