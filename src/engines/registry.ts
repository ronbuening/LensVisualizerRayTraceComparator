// Engine adapters from configuration: `engines.<id>` says how an engine is reached, and this builds the adapter.
import { existsSync } from "node:fs";
import { relative } from "node:path";
import { pathToFileURL } from "node:url";

import type { ProtocolHandler } from "../contract/protocol.ts";
import type { EngineDefinition, LoadedConfig } from "../core/config.ts";
import { createInProcessTransport } from "../transports/inProcess.ts";
import type { Transport } from "../transports/transport.ts";
import { EngineUnavailableError } from "./adapter.ts";
import type { EngineAdapter } from "./adapter.ts";
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
 * The transports implemented so far. A stage that implements another adds its factory here, and nothing that uses
 * the registry changes.
 */
export const TRANSPORT_FACTORIES: TransportFactories = { "in-process": inProcessTransportFactory };

/** The engines of one configuration. */
export interface EngineRegistry {
  /** The ids of the engines the configuration defines, sorted. */
  ids(): string[];
  /**
   * Builds a new adapter for a configured engine. The engine is not contacted: `describe()` does that. The caller
   * owns the adapter and closes it. Rejects with an `EngineUnavailableError`: `not-configured` for an id the
   * configuration does not define, `unsupported-transport` for a transport without a factory, and whatever the
   * factory rejects with.
   */
  create(id: string): Promise<EngineAdapter>;
}

/**
 * The registry of the engines that `loaded` defines under `engines.<id>`. `factories` maps each transport to what
 * builds it, and defaults to every transport implemented.
 */
export function createEngineRegistry(
  loaded: Pick<LoadedConfig, "rootDir" | "config">,
  factories: TransportFactories = TRANSPORT_FACTORIES,
): EngineRegistry {
  const definitions = loaded.config.engineDefinitions;
  const ids = (): string[] => Object.keys(definitions).sort();
  return {
    ids,
    create: async (id) => {
      // An own key: "constructor" is an engine id like any other, and no object defines it by inheritance.
      if (!Object.hasOwn(definitions, id)) {
        const defined = ids().length === 0 ? "no engine" : ids().join(", ");
        throw new EngineUnavailableError(id, "not-configured", `the configuration defines ${defined}`);
      }
      const definition = definitions[id];
      // Looked up by the definition's own transport, so the factory found is the one for this kind of definition.
      const factory = factories[definition.transport] as TransportFactory<EngineDefinition["transport"]> | undefined;
      if (factory === undefined) {
        const detail = `no transport "${definition.transport}" is implemented`;
        throw new EngineUnavailableError(id, "unsupported-transport", detail);
      }
      const transport = await factory(definition, { engineId: id, rootDir: loaded.rootDir });
      return new RemoteEngineAdapter({ id, transport });
    },
  };
}
