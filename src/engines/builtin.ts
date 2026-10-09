// The built-in engines: the ones that are part of the comparator and need no entry under `engines` in a
// configuration file. One runs in this process, or in a worker of the comparator whose definition is built from the
// configuration. A stage that adds one adds it to the list below.
import type { ProtocolHandler } from "../contract/protocol.ts";
import type { EngineDefinition, LoadedConfig } from "../core/config.ts";
import { LV_ENGINE_ID, createLvEngine } from "./lv/engine.ts";
import { LV_REPLAY_ENGINE_ID, createLvReplayEngine } from "./lv/replayEngine.ts";
import { LV_WAVE_ENGINE_ID, createLvWaveEngine } from "./lv/waveEngine.ts";
import { OPTILAND_ENGINE_ID, OPTILAND_TIMEOUTS, optilandDefinition } from "./optiland/definition.ts";
import { REF_ENGINE_ID, createRefEngine } from "./ref/engine.ts";
import type { EngineTimeouts } from "./remote.ts";

/**
 * What makes a built-in engine: the protocol handler of an engine whose descriptor names the id it is listed
 * under. It is given the loaded configuration, for an engine that needs a value of it. It may throw, or reject,
 * when the engine cannot be made: with an `EngineUnavailableError` that says why, which is passed on as it is, or
 * with anything else, for which the engine is unavailable with the code `create-failed`.
 */
export type BuiltinEngineFactory = (
  loaded: Pick<LoadedConfig, "rootDir" | "config">,
) => ProtocolHandler | Promise<ProtocolHandler>;

/**
 * A built-in engine that runs in a worker of the comparator's own: `worker` builds the definition a configuration
 * file would otherwise have to state, from the loaded configuration, and the engine is reached through the
 * transport of that definition like a configured one. It may throw an `EngineUnavailableError` that says why the
 * engine cannot be used. `timeouts` are the waits that differ from the adapter's defaults.
 */
export interface BuiltinWorkerEngine {
  readonly worker: (loaded: Pick<LoadedConfig, "rootDir" | "config">) => EngineDefinition;
  readonly timeouts?: Partial<EngineTimeouts>;
}

/** Built-in engines by engine id: each a factory of a handler in this process, or a worker. */
export type BuiltinEngines = { readonly [id: string]: BuiltinEngineFactory | BuiltinWorkerEngine };

/**
 * The built-in engines. `ref` is the comparator's own reference engine (`src/engines/ref`). `lv` is LensVisualizer
 * itself (`src/engines/lv/engine.ts`), loaded from the configuration's `lvPath` when the engine is made: without a
 * LensVisualizer to load it is unavailable, and nothing else is affected. `replay` is the comparator's own
 * estimators on a replay of LensVisualizer's sampling (`src/engines/lv/replayEngine.ts`), on the same checkout and
 * unavailable without it; it is what rung R4f holds `lv` to. `wave` is the comparator's wave estimator on the rays
 * LensVisualizer launches and traces (`src/engines/lv/waveEngine.ts`), on the same checkout; it is what rung R6b
 * sets beside LensVisualizer's own diffraction MTF. `optiland` is optiland behind the
 * comparator's Python worker (`src/engines/optiland/definition.ts`), run by the interpreter the configuration names
 * as `engines.optiland.python`: without one it is unavailable, and nothing else is affected.
 *
 * A built-in engine can be named with any configuration root (`--engines lv,ref`, a run's `engines`). It is not
 * one of the engines a run that names none is run on: those are the engines the configuration defines. `replay`
 * and `wave` are run where the rung that is about each is run (`RungDefinition.engines`), and can be named like
 * any other.
 */
export const BUILTIN_ENGINES: BuiltinEngines = Object.freeze({
  [LV_ENGINE_ID]: ({ config }) => createLvEngine(config.lvPath),
  [OPTILAND_ENGINE_ID]: { worker: (loaded) => optilandDefinition(loaded), timeouts: OPTILAND_TIMEOUTS },
  [REF_ENGINE_ID]: () => createRefEngine(),
  [LV_REPLAY_ENGINE_ID]: ({ config }) => createLvReplayEngine(config.lvPath),
  [LV_WAVE_ENGINE_ID]: ({ config }) => createLvWaveEngine(config.lvPath),
});
