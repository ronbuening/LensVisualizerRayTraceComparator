// The built-in engines: the ones that are part of the comparator and need no entry under `engines` in a
// configuration file. Each runs in this process. A stage that adds one adds it to the list below.
import type { ProtocolHandler } from "../contract/protocol.ts";
import type { LoadedConfig } from "../core/config.ts";
import { LV_ENGINE_ID, createLvEngine } from "./lv/engine.ts";
import { REF_ENGINE_ID, createRefEngine } from "./ref/engine.ts";

/**
 * What makes a built-in engine: the protocol handler of an engine whose descriptor names the id it is listed
 * under. It is given the loaded configuration, for an engine that needs a value of it. It may throw, or reject,
 * when the engine cannot be made: with an `EngineUnavailableError` that says why, which is passed on as it is, or
 * with anything else, for which the engine is unavailable with the code `create-failed`.
 */
export type BuiltinEngineFactory = (
  loaded: Pick<LoadedConfig, "rootDir" | "config">,
) => ProtocolHandler | Promise<ProtocolHandler>;

/** Built-in engines by engine id. */
export type BuiltinEngines = { readonly [id: string]: BuiltinEngineFactory };

/**
 * The built-in engines. `ref` is the comparator's own reference engine (`src/engines/ref`). `lv` is LensVisualizer
 * itself (`src/engines/lv/engine.ts`), loaded from the configuration's `lvPath` when the engine is made: without a
 * LensVisualizer to load it is unavailable, and nothing else is affected.
 *
 * A built-in engine can be named with any configuration root (`--engines lv,ref`, a run's `engines`). It is not
 * one of the engines a run that names none is run on: those are the engines the configuration defines.
 */
export const BUILTIN_ENGINES: BuiltinEngines = Object.freeze({
  [LV_ENGINE_ID]: ({ config }) => createLvEngine(config.lvPath),
  [REF_ENGINE_ID]: () => createRefEngine(),
});
