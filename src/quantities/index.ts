// Every quantity the comparator knows. A stage that adds a quantity adds its module to the list below.
import { paraxialFirstOrderQuantity } from "./paraxialFirstOrder.ts";
import { raysTraceQuantity } from "./raysTrace.ts";
import { createQuantityRegistry } from "./registry.ts";
import type { QuantityLookup } from "./registry.ts";
import { selftestEchoQuantity } from "./selftestEcho.ts";
import { systemDescribeQuantity } from "./systemDescribe.ts";

const { has, get, list } = createQuantityRegistry([
  selftestEchoQuantity,
  systemDescribeQuantity,
  paraxialFirstOrderQuantity,
  raysTraceQuantity,
]);

/**
 * The comparator's quantities, to look up and to list; nothing can be added to them while the program runs. Each
 * one is a quantity of the contract: it has both schema files, and no schema file under `quantities/` is without a
 * module here.
 */
export const QUANTITIES: QuantityLookup = Object.freeze({ has, get, list });
