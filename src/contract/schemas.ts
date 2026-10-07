// The contract's schema files, loaded once, and validation of a document by its kind.
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { compileSchemas, validate } from "./validate.ts";
import type { SchemaDocument, SchemaSet, ValidationIssue } from "./validate.ts";
import { CONTRACT_MAJOR } from "./version.ts";

/** The directory of schema files that are the contract's source of truth. */
export const SCHEMA_DIR: string = fileURLToPath(new URL(`../../contract/schema/v${CONTRACT_MAJOR}`, import.meta.url));

/**
 * What every schema `$id` starts with. The rest is the file's path below `SCHEMA_DIR` without `.schema.json`,
 * with `:` for `/`: `quantities/rays.trace.spec.schema.json` is `urn:lvrtc:contract:v1:quantities:rays.trace.spec`.
 */
export const SCHEMA_ID_PREFIX = `urn:lvrtc:contract:v${CONTRACT_MAJOR}:`;

/** Every kind of document the contract defines. Each has a schema file named after it. */
export const CONTRACT_KINDS = [
  "optical-case",
  "run-spec",
  "suite",
  "request",
  "result",
  "engine-descriptor",
  "protocol-request",
  "protocol-response",
] as const;
/** One kind of contract document. */
export type ContractKind = (typeof CONTRACT_KINDS)[number];

/** The `$id` of the schema for a kind of document. */
export function kindSchemaId(kind: ContractKind): string {
  return `${SCHEMA_ID_PREFIX}${kind}`;
}

/**
 * The `$id` a quantity's schema has once a later stage adds it under `quantities/`: `spec` is what a request asks
 * for, `data` what an "ok" result carries. None is defined yet, so `contractSchemas().targets` has none of these.
 */
export function quantitySchemaId(quantity: string, part: "spec" | "data"): string {
  return `${SCHEMA_ID_PREFIX}quantities:${quantity}.${part}`;
}

/**
 * Reads every `*.schema.json` below `directory`, at any depth, in sorted path order, and compiles them as one set.
 * Other files are ignored. Throws an error naming the file for JSON that does not parse, and as `compileSchemas`
 * does for a schema outside the subset.
 */
export function loadSchemaDirectory(directory: string): SchemaSet {
  const files = readdirSync(directory, { recursive: true, encoding: "utf8" })
    .map((file) => file.split(sep).join("/"))
    .filter((file) => file.endsWith(".schema.json"))
    .sort();
  const documents = files.map((file): SchemaDocument => {
    try {
      return { source: file, schema: JSON.parse(readFileSync(join(directory, file), "utf8")) };
    } catch (error) {
      throw new Error(`schema ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  return compileSchemas(documents);
}

let loaded: SchemaSet | undefined;

/** The schemas of `SCHEMA_DIR`. They are read and compiled on the first call and kept for the life of the process. */
export function contractSchemas(): SchemaSet {
  loaded ??= loadSchemaDirectory(SCHEMA_DIR);
  return loaded;
}

/**
 * Validates a document against the schema of its kind. Returns an empty list exactly when the document is valid.
 * This is the schema only: the invariants a schema cannot state (a case's index ranges and identity, a result's
 * status rules) are checked by the module that owns the kind.
 */
export function validateKind(kind: ContractKind, value: unknown): ValidationIssue[] {
  return validate(contractSchemas(), kindSchemaId(kind), value);
}

/** Issues as one line of text: `/system/stopIndex [type] expected integer, got string; ...`. */
export function formatIssues(issues: readonly ValidationIssue[]): string {
  return issues.map((issue) => `${issue.path || "(root)"} [${issue.keyword}] ${issue.message}`).join("; ");
}

/** Throws an error listing every issue unless `value` is a schema-valid document of `kind`. */
export function assertKind(kind: ContractKind, value: unknown): void {
  const issues = validateKind(kind, value);
  if (issues.length > 0) throw new Error(`contract: not a valid ${kind}: ${formatIssues(issues)}`);
}
