// The engine `optiland`: optiland behind a Python worker of the comparator (`workers/python/lvrtc_optiland`). Nothing
// of it is configured but the interpreter: `engines.optiland.python`. The worker's command, its `PYTHONPATH` and
// where its caches go are the comparator's to say, and are said here.
import { existsSync } from "node:fs";
import { delimiter, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

import { LOCAL_CONFIG_FILE } from "../../core/config.ts";
import type { EngineDefinition, LoadedConfig } from "../../core/config.ts";
import { EngineUnavailableError } from "../adapter.ts";
import type { EngineTimeouts } from "../remote.ts";

/** The id of the engine. */
export const OPTILAND_ENGINE_ID = "optiland";

/** The worker's Python module, run as `python -m`. */
export const OPTILAND_WORKER_MODULE = "lvrtc_optiland";

/** The directory that holds the comparator's Python workers: what the worker's `PYTHONPATH` names. */
export const PYTHON_WORKERS_DIRECTORY: string = fileURLToPath(new URL("../../../workers/python", import.meta.url));

/** The directory under the configuration's `cacheDir` that the worker's caches go into. */
export const OPTILAND_CACHE_NAME = "optiland";

/**
 * The waits of the engine that differ from the defaults. `hello` is answered once optiland is imported: measured at
 * about 3 s with warm caches and about 18 s on a first start, when matplotlib builds its font cache and every
 * module is compiled under an empty cache directory. Three minutes leave room for a slower machine and a cold
 * disk, where the default of 30 s would not. A run keeps the default: `system.describe`, the one quantity so far,
 * is answered in milliseconds.
 */
export const OPTILAND_TIMEOUTS: Partial<EngineTimeouts> = Object.freeze({ helloMs: 180_000 });

/** What to do about an interpreter that is not there, said the same way wherever it is said. */
export const OPTILAND_SETTING_HINT =
  `set engines.optiland.python in ${LOCAL_CONFIG_FILE} (or LVRTC_OPTILAND_PYTHON) to an interpreter that can ` +
  "import optiland, as lvrtc.local.example.json shows";

/**
 * The variables of the worker that keep it from writing into the optiland checkout or its environment, with the
 * caches under `cacheDir` (the configuration's, gitignored):
 *
 * - `NUMBA_CACHE_DIR`: numba would write the machine code of optiland's cached functions next to their sources;
 * - `MPLCONFIGDIR`, `MPLBACKEND=Agg`: matplotlib's font cache, and no display;
 * - `PYTHONPYCACHEPREFIX`: where bytecode is cached, so that none is read from or written to a `__pycache__` beside
 *   a source;
 * - `PYTHONDONTWRITEBYTECODE=1`: the interpreter writes no bytecode while it starts. The worker turns writing on
 *   itself once it has checked that the prefix lies outside optiland (`hygiene.prepare`): what it imports from
 *   then on, which is optiland and everything optiland loads, is compiled once and read from the cache on every
 *   later start, which halves it. A definition can replace a variable of the transport and cannot remove one, so
 *   the switch is the worker's;
 * - `LVRTC_CACHE_DIR`: where the worker puts any cache it is not told the place of.
 *
 * The worker sets the same from inside before it imports optiland (`lvrtc_optiland/hygiene.py`), so one that is
 * started by hand is as careful. The JIT is left on.
 */
export function optilandWorkerEnvironment(cacheDir: string): Record<string, string> {
  const directory = join(cacheDir, OPTILAND_CACHE_NAME);
  return {
    PYTHONPATH: PYTHON_WORKERS_DIRECTORY,
    PYTHONDONTWRITEBYTECODE: "1",
    PYTHONPYCACHEPREFIX: join(directory, "pycache"),
    NUMBA_CACHE_DIR: join(directory, "numba"),
    MPLCONFIGDIR: join(directory, "matplotlib"),
    MPLBACKEND: "Agg",
    LVRTC_CACHE_DIR: directory,
  };
}

/** What `optilandDefinition` reads from the machine, so that a test can say what is there. */
export interface InterpreterProbe {
  exists(path: string): boolean;
  /** The directories a bare command name is looked up in: the `PATH` of this process, split. */
  readonly searchPath: readonly string[];
}

/** The probe of this machine and this process. */
export function systemInterpreterProbe(
  env: Readonly<Record<string, string | undefined>> = process.env,
): InterpreterProbe {
  const path = env.PATH ?? env.Path ?? "";
  return { exists: existsSync, searchPath: path.split(delimiter).filter((directory) => directory !== "") };
}

/** Whether an interpreter, as the configuration resolved it, is a file that is there: a path, or a name on the path. */
function interpreterFound(python: string, probe: InterpreterProbe): boolean {
  if (isAbsolute(python)) return probe.exists(python);
  return probe.searchPath.some((directory) => probe.exists(join(directory, python)));
}

/**
 * The stdio definition of the engine `optiland` under a configuration: `<python> -m lvrtc_optiland` with the
 * environment of `optilandWorkerEnvironment`, and no options. It starts nothing and imports nothing.
 *
 * Throws an `EngineUnavailableError` that says what to set: `not-configured` when `engines.optiland.python` is
 * null, and `spawn-failed` when the interpreter it names is not on this machine. An interpreter that is there and
 * cannot import optiland is found by `hello`, which the worker refuses with the reason (`hello-failed`).
 */
export function optilandDefinition(
  loaded: Pick<LoadedConfig, "config">,
  probe: InterpreterProbe = systemInterpreterProbe(),
): Extract<EngineDefinition, { transport: "stdio" }> {
  const { cacheDir, engines } = loaded.config;
  const python = engines.optiland.python;
  if (python === null) {
    const detail = `no interpreter is configured for it: ${OPTILAND_SETTING_HINT}`;
    throw new EngineUnavailableError(OPTILAND_ENGINE_ID, "not-configured", detail);
  }
  if (!interpreterFound(python, probe)) {
    const detail = `its interpreter ${python} does not exist: ${OPTILAND_SETTING_HINT}`;
    throw new EngineUnavailableError(OPTILAND_ENGINE_ID, "spawn-failed", detail);
  }
  return {
    transport: "stdio",
    command: [python, "-m", OPTILAND_WORKER_MODULE],
    options: {},
    env: optilandWorkerEnvironment(cacheDir),
  };
}
