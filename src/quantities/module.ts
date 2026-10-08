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
 * The rules of a quantity that its schema files cannot state: what is wrong with a spec, and with data, that the
 * schema accepts. Each returns one issue per broken rule, with the keyword `invariant`, and is only ever given a
 * value that has passed the schema.
 */
export interface QuantityInvariants {
  readonly spec?: (spec: unknown) => ValidationIssue[];
  readonly data?: (data: unknown) => ValidationIssue[];
}

/** The keyword of an issue that a quantity's own rule reports, where no schema keyword failed. */
export const INVARIANT_KEYWORD = "invariant";

/** One issue of a quantity's own rule: the member at fault, as a JSON Pointer, and what is wrong with it. */
export function invariantIssue(path: string, message: string): ValidationIssue {
  return { path, keyword: INVARIANT_KEYWORD, message };
}

/**
 * The module of a quantity that the contract's schema files define: `validateSpec` and `validateData` validate
 * against `quantities/<id>.spec.schema.json` and `quantities/<id>.data.schema.json`, so the module and the files
 * cannot disagree. A value the schema accepts is then held to the quantity's `invariants`, if it has any: the
 * rules its schema cannot state, such as two arrays having one length. Throws when `id` is not a quantity id, when
 * `version` is not an integer of at least 1 and when either schema file is missing.
 */
export function schemaQuantity(id: string, version: number, invariants: QuantityInvariants = {}): QuantityModule {
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
  const checked = (part: "spec" | "data", value: unknown): ValidationIssue[] => {
    const issues = validate(schemas, quantitySchemaId(id, part), value);
    return issues.length > 0 ? issues : (invariants[part]?.(value) ?? []);
  };
  return Object.freeze({
    id,
    version,
    validateSpec: (spec: unknown) => checked("spec", spec),
    validateData: (data: unknown) => checked("data", data),
  });
}
