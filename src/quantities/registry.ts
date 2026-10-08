// The quantity registry: the quantities one comparator knows, by id.
import type { QuantityModule } from "./module.ts";

/** A set of quantity modules that can be read but not added to. */
export interface QuantityLookup {
  /** Whether a quantity with this id is registered. */
  has(id: string): boolean;
  /** The module registered under this id, or undefined when there is none. */
  get(id: string): QuantityModule | undefined;
  /** Every registered module, sorted by id, in a fresh list. */
  list(): QuantityModule[];
}

/** A set of quantity modules, at most one per id. */
export interface QuantityRegistry extends QuantityLookup {
  /** Adds a module. Throws, and changes nothing, when one with the same id is already registered. */
  register(module: QuantityModule): void;
}

/**
 * A registry holding the given modules. Throws when two of them share an id. A lookup is by exact id, so a name
 * every object inherits a member for, such as `constructor`, is not a quantity.
 */
export function createQuantityRegistry(modules: readonly QuantityModule[] = []): QuantityRegistry {
  const byId = new Map<string, QuantityModule>();
  const registry: QuantityRegistry = {
    register: (module) => {
      if (byId.has(module.id)) throw new Error(`quantity ${module.id} is already registered`);
      byId.set(module.id, module);
    },
    has: (id) => byId.has(id),
    get: (id) => byId.get(id),
    list: () => [...byId.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
  };
  for (const module of modules) registry.register(module);
  return registry;
}
