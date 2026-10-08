// The quantity plug-in: what the comparator knows about one quantity that an engine can be asked for.
import { SCHEMA_ID_PREFIX, contractSchemas, quantitySchemaId } from "../contract/schemas.ts";
import { validate } from "../contract/validate.ts";
import type { ValidationIssue } from "../contract/validate.ts";

/** One quantity: its identity, and the shape of what is asked and of what is answered. */
export interface QuantityModule {
  /** The dotted quantity id a request names, such as `selftest.echo`. */
  readonly id: string;
  /**
   * The version of the quantity's definition: its schemas and what they mean. An integer from 1, raised when
   * either changes incompatibly. An engine states the version it implements in its descriptor.
   */
  readonly version: number;
  /** Every way `spec` is not a spec of this quantity; empty exactly when a request may carry it. */
  validateSpec(spec: unknown): ValidationIssue[];
  /** Every way `data` is not data of this quantity; empty exactly when an `ok` result may carry it. */
  validateData(data: unknown): ValidationIssue[];
}

/**
 * The module of a quantity that the contract's schema files define: `validateSpec` and `validateData` validate
 * against `quantities/<id>.spec.schema.json` and `quantities/<id>.data.schema.json`, and nothing else is checked,
 * so the module and the files cannot disagree. Throws when `id` is not a quantity id, when `version` is not an
 * integer of at least 1 and when either schema file is missing.
 */
export function schemaQuantity(id: string, version: number): QuantityModule {
  const schemas = contractSchemas();
  if (validate(schemas, `${SCHEMA_ID_PREFIX}common#/$defs/quantityId`, id).length > 0) {
    throw new Error(`quantity ${JSON.stringify(id)}: not a dotted quantity id such as rays.trace`);
  }
  if (!Number.isInteger(version) || version < 1) {
    throw new Error(`quantity ${id}: version must be an integer of at least 1, got ${String(version)}`);
  }
  for (const part of ["spec", "data"] as const) {
    if (!schemas.targets.has(quantitySchemaId(id, part))) {
      throw new Error(`quantity ${id}: the contract has no schema quantities/${id}.${part}.schema.json`);
    }
  }
  return Object.freeze({
    id,
    version,
    validateSpec: (spec: unknown) => validate(schemas, quantitySchemaId(id, "spec"), spec),
    validateData: (data: unknown) => validate(schemas, quantitySchemaId(id, "data"), data),
  });
}
