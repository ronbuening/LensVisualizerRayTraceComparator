// Engine adapters: `engines.<id>` of the configuration says how an engine is reached, the built-in engines are
// part of the comparator, and this builds the adapter of either.
import { existsSync } from "node:fs";
import { relative } from "node:path";
import { pathToFileURL } from "node:url";

import type { ProtocolHandler } from "../contract/protocol.ts";
import type { EngineDefinition, LoadedConfig } from "../core/config.ts";
import { createInProcessTransport } from "../transports/inProcess.ts";
import { createStdioTransport, workerEnvironment } from "../transports/stdio.ts";
import type { Transport } from "../transports/transport.ts";
import { EngineUnavailableError, enginesText } from "./adapter.ts";
import type { EngineAdapter } from "./adapter.ts";
import { BUILTIN_ENGINES } from "./builtin.ts";
import type { BuiltinEngines } from "./builtin.ts";
import { RemoteEngineAdapter } from "./remote.ts";

/** What a transport factory is told beside the definition. */
export interface TransportContext {
  /** The id the engine is configured under. */
  readonly engineId: string;
  /** The directory the configuration was read from. Messages name files relative to it. */
  readonly rootDir: string;
}

/**
 * Builds the transport of one engine from its definition, unopened. Rejects with an `EngineUnavailableError` when
 * the definition cannot be turned into a transport.
 */
export type TransportFactory<K extends EngineDefinition["transport"]> = (
  definition: Extract<EngineDefinition, { transport: K }>,
  context: TransportContext,
) => Promise<Transport>;

/** A factory for each transport a definition can name. A transport without one is not implemented. */
export type TransportFactories = { readonly [K in EngineDefinition["transport"]]?: TransportFactory<K> };

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * The factory of in-process engines. It imports the definition's module, which must export
 * `createEngine(options): ProtocolHandler`, calls it with a copy of the definition's options and wraps the handler
 * in an in-process transport. One module serves any number of engines: each gets a handler of its own. Rejects with
 * `load-failed` when the module is missing or its import fails, `bad-module` when it exports no `createEngine`
 * function, and `create-failed` when `createEngine` throws or returns something that is not a function.
 */
export const inProcessTransportFactory: TransportFactory<"in-process"> = async (definition, { engineId, rootDir }) => {
  const module = relative(rootDir, definition.module);
  const unavailable = (code: "load-failed" | "bad-module" | "create-failed", detail: string, cause?: unknown) =>
    new EngineUnavailableError(engineId, code, detail, cause === undefined ? undefined : { cause });

  if (!existsSync(definition.module)) throw unavailable("load-failed", `its module ${module} does not exist`);
  let exported: Record<string, unknown>;
  try {
    exported = await import(pathToFileURL(definition.module).href);
  } catch (error) {
    throw unavailable("load-failed", `its module ${module} could not be imported: ${reasonOf(error)}`, error);
  }
  const { createEngine } = exported;
  if (typeof createEngine !== "function") {
    throw unavailable("bad-module", `its module ${module} does not export a createEngine function`);
  }
  let handler: unknown;
  try {
    handler = createEngine(structuredClone(definition.options));
  } catch (error) {
    throw unavailable("create-failed", `createEngine of ${module} threw: ${reasonOf(error)}`, error);
  }
  if (typeof handler !== "function") {
    throw unavailable("create-failed", `createEngine of ${module} returned ${typeof handler}, not a protocol handler`);
  }
  return createInProcessTransport(handler as ProtocolHandler);
};

/**
 * The factory of stdio engines: a worker process started from the definition's `command`, in the configuration root
 * as its working directory, with the environment `workerEnvironment` builds from this process's environment, the
 * definition's `options` and its `env`. Nothing is started here: the transport's `open()` does that, and a command
 * that does not start is found then.
 */
export const stdioTransportFactory: TransportFactory<"stdio"> = async (definition, { rootDir }) =>
  createStdioTransport({
    command: definition.command,
    env: workerEnvironment(process.env, definition.options, definition.env),
    cwd: rootDir,
  });

/**
 * The transports implemented so far. A stage that implements another adds its factory here, and nothing that uses
 * the registry changes.
 */
export const TRANSPORT_FACTORIES: TransportFactories = {
  "in-process": inProcessTransportFactory,
  stdio: stdioTransportFactory,
};

/**
 * Builds the transport of an engine, unopened: the engine is not contacted. An id the configuration defines is
 * built from its definition, by the factory of its transport. Any other id that is a built-in engine's is that
 * engine, in this process: so a definition replaces a built-in engine of the same id, and every built-in engine
 * can be named under any configuration root.
 *
 * Rejects with an `EngineUnavailableError`: `not-configured` for an id that is neither defined nor built in,
 * `unsupported-transport` for a transport without a factory in `factories`, what a built-in engine that could not
 * be made says of itself, or `create-failed` when it says nothing, and whatever the factory rejects with.
 */
export async function createEngineTransport(
  loaded: Pick<LoadedConfig, "rootDir" | "config">,
  id: string,
  factories: TransportFactories = TRANSPORT_FACTORIES,
  builtins: BuiltinEngines = BUILTIN_ENGINES,
): Promise<Transport> {
  const definitions = loaded.config.engineDefinitions;
  // An own key: "constructor" is an engine id like any other, and no object defines it by inheritance.
  if (!Object.hasOwn(definitions, id)) {
    if (Object.hasOwn(builtins, id)) {
      try {
        return createInProcessTransport(await builtins[id](loaded));
      } catch (error) {
        // A built-in engine that says why it cannot be used is believed.
        if (error instanceof EngineUnavailableError) throw error;
        const detail = `the built-in engine could not be made: ${reasonOf(error)}`;
        throw new EngineUnavailableError(id, "create-failed", detail, { cause: error });
      }
    }
    const said = enginesText(Object.keys(definitions).sort(), Object.keys(builtins).sort());
    throw new EngineUnavailableError(id, "not-configured", said);
  }
  const definition = definitions[id];
  // Looked up by the definition's own transport, so the factory found is the one for this kind of definition.
  const factory = factories[definition.transport] as TransportFactory<EngineDefinition["transport"]> | undefined;
  if (factory === undefined) {
    const detail = `no transport "${definition.transport}" is implemented`;
    throw new EngineUnavailableError(id, "unsupported-transport", detail);
  }
  return factory(definition, { engineId: id, rootDir: loaded.rootDir });
}

/** The engines of one configuration, and the built-in ones beside them. */
export interface EngineRegistry {
  /** The ids of the engines the configuration defines, sorted: the engines of a run that names none. */
  ids(): string[];
  /**
   * The ids of the built-in engines, sorted. Each can be named like a configured engine; none is run unless it is
   * named. An id may be in both lists: the configuration's definition is then the engine.
   */
  builtinIds(): string[];
  /**
   * Builds a new adapter for an engine, configured or built in. The engine is not contacted: `describe()` does
   * that. The caller owns the adapter and closes it. Rejects with an `EngineUnavailableError`: `not-configured`
   * for an id that is neither, `unsupported-transport` for a transport without a factory, and whatever making the
   * engine rejects with.
   */
  create(id: string): Promise<EngineAdapter>;
}

/**
 * The registry of the engines that `loaded` defines under `engines.<id>`, with the built-in engines beside them.
 * `factories` maps each transport to what builds it, and defaults to every transport implemented; `builtins`
 * defaults to the comparator's own (`BUILTIN_ENGINES`).
 */
export function createEngineRegistry(
  loaded: Pick<LoadedConfig, "rootDir" | "config">,
  factories: TransportFactories = TRANSPORT_FACTORIES,
  builtins: BuiltinEngines = BUILTIN_ENGINES,
): EngineRegistry {
  return {
    ids: () => Object.keys(loaded.config.engineDefinitions).sort(),
    builtinIds: () => Object.keys(builtins).sort(),
    create: async (id) =>
      new RemoteEngineAdapter({ id, transport: await createEngineTransport(loaded, id, factories, builtins) }),
  };
}
