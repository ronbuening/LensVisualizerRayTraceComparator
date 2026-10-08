// Every quantity the comparator knows. A stage that adds a quantity adds its module to the list below.
import { createQuantityRegistry } from "./registry.ts";
import type { QuantityLookup } from "./registry.ts";
import { selftestEchoQuantity } from "./selftestEcho.ts";

const { has, get, list } = createQuantityRegistry([selftestEchoQuantity]);

/**
 * The comparator's quantities, to look up and to list; nothing can be added to them while the program runs. Each
 * one is a quantity of the contract: it has both schema files, and no schema file under `quantities/` is without a
 * module here.
 */
export const QUANTITIES: QuantityLookup = Object.freeze({ has, get, list });
