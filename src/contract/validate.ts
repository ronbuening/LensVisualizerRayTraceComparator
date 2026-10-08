// A validator for the subset of JSON Schema draft 2020-12 that the contract's schemas are written in.
//
// This file is ported to Python (stdlib only) for the worker kit, so it is small and does nothing clever. A schema
// that uses anything outside the subset is refused when it is loaded, never half-understood, and the two
// implementations are held together by the fixture corpus in contract/fixtures.
//
// The subset:
//   assertions   type, enum, const, minimum, maximum, exclusiveMinimum, exclusiveMaximum, minLength, pattern,
//                minItems, maxItems, uniqueItems, items, required, properties, additionalProperties, oneOf, anyOf
//   structure    $ref, $defs, $id, $schema
//   annotations  title, description
//
// It is narrower than the draft in six ways, each checked at load time:
//   - $id, $schema and $defs appear only at the root of a file;
//   - a $ref is "#/$defs/<name>", "<$id>" or "<$id>#/$defs/<name>" and must name a loaded schema;
//   - a $ref stands alone: no assertion sits beside it, so readers that ignore whatever is beside a $ref, as
//     drafts before 2019-09 did, read the same schema;
//   - enum and const hold primitives only;
//   - uniqueItems needs a sibling `items` whose `type` names only primitive types;
//   - a pattern is anchored with ^ and $ and uses neither \d, \w, \s, \b nor a dot outside a character class, which
//     match different characters in ECMAScript and in Python's `re`, nor a character class that starts with its
//     closing bracket: [] and [^] are whole classes in ECMAScript, and in Python the start of a class that holds ].
// The port has one more thing to mind in a pattern: the closing $ is the very end of the string, as in ECMAScript.
// Python's $ also matches before a trailing newline, so the port writes it \Z.
// Whatever is accepted means what the draft says it means, so a full validator agrees with this one on these
// schemas. One thing is not checked: references that lead back to themselves without descending into the instance
// never finish, here as in any validator. The contract's schemas do not recurse.
//
// Two rules are this validator's own. An instance that is not JSON data (a non-finite number, undefined, a class
// instance, a value that contains itself) is rejected before any schema is consulted, with the keyword "finite"
// for a number and "json" for anything else. And a value of the wrong `type` gets that one issue: the other
// keywords of the same schema node are not evaluated for it.

/** One reason an instance was rejected. An instance is valid exactly when there are none. */
export interface ValidationIssue {
  /** JSON Pointer (RFC 6901) to the offending value; "" is the instance itself. */
  readonly path: string;
  /** The schema keyword that failed; "finite" or "json" for a value that is not JSON data. */
  readonly keyword: string;
  /** For people; only `path` and `keyword` are the same in every implementation. */
  readonly message: string;
}

/** A schema file as read: its parsed JSON, and a name for it that load errors quote. */
export interface SchemaDocument {
  readonly source: string;
  readonly schema: unknown;
}

const TYPE_NAMES = ["null", "boolean", "integer", "number", "string", "array", "object"] as const;
type TypeName = (typeof TYPE_NAMES)[number];
type JsonType = Exclude<TypeName, "integer">;
type Primitive = null | boolean | number | string;

/** A schema node that `compileSchemas` has checked: it holds keywords of the subset, well-formed, and no others. */
export interface Schema {
  readonly $ref?: string;
  readonly $defs?: Readonly<Record<string, Schema>>;
  readonly type?: TypeName | readonly TypeName[];
  readonly enum?: readonly Primitive[];
  readonly const?: Primitive;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly exclusiveMinimum?: number;
  readonly exclusiveMaximum?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly minItems?: number;
  readonly maxItems?: number;
  readonly uniqueItems?: boolean;
  readonly items?: Schema;
  readonly required?: readonly string[];
  readonly properties?: Readonly<Record<string, Schema>>;
  readonly additionalProperties?: boolean | Schema;
  readonly oneOf?: readonly Schema[];
  readonly anyOf?: readonly Schema[];
}

/** Checked schemas, ready to validate against. Built only by `compileSchemas`. */
export interface SchemaSet {
  /** The `$id` of every file, in the order the files were given. */
  readonly ids: readonly string[];
  /** Everything a `$ref` can name: `<$id>` for a file and `<$id>#/$defs/<name>` for each definition in it. */
  readonly targets: ReadonlyMap<string, Schema>;
}

const DRAFT = "https://json-schema.org/draft/2020-12/schema";
const DEFINITION_NAME = /^[A-Za-z][A-Za-z0-9]*$/;
/** The keywords that assert nothing, and so may share a schema node with a $ref. */
const BESIDE_REF: readonly string[] = ["$ref", "$id", "$schema", "$defs", "title", "description"];
const PRIMITIVE_TYPE_NAMES: readonly unknown[] = ["null", "boolean", "integer", "number", "string"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPrimitive(value: unknown): value is Primitive {
  if (typeof value === "number") return Number.isFinite(value);
  return value === null || typeof value === "boolean" || typeof value === "string";
}

function isTypeName(value: unknown): value is TypeName {
  return (TYPE_NAMES as readonly unknown[]).includes(value);
}

/** A list whose members all pass `isMember` and are pairwise different. Meant for primitives. */
function isDistinctList(value: unknown, isMember: (member: unknown) => boolean): value is unknown[] {
  return Array.isArray(value) && value.every(isMember) && new Set(value).size === value.length;
}

// ── Loading ──────────────────────────────────────────────────────────────────────────────────────────────────────

interface PendingRef {
  readonly ref: string;
  /** The `$id` of the file the reference is written in. */
  readonly base: string;
  readonly where: string;
}

function fail(where: string, message: string): never {
  throw new Error(`schema ${where}: ${message}`);
}

function checkPattern(value: unknown, at: string): void {
  if (typeof value !== "string" || !value.startsWith("^") || !value.endsWith("$") || value.endsWith("\\$")) {
    fail(at, "must be a string anchored with ^ and $");
  }
  // Every escape and every character class, as ECMAScript reads them.
  const tokens = /\\.|\[(?:\\.|[^\]\\])*\]/g;
  if (value.match(tokens)?.some((token) => token === "[]" || token === "[^]")) {
    fail(at, "[] and [^] are whole classes in ECMAScript and the start of a class in Python");
  }
  // What is left once they are taken out: a dot in it is the wildcard.
  const outsideClasses = value.replace(tokens, "");
  if (/\\[dDwWsSbB]/.test(value) || outsideClasses.includes(".")) {
    fail(at, "\\d, \\w, \\s, \\b and a dot outside a character class match differently in ECMAScript and Python");
  }
  try {
    new RegExp(value, "u");
  } catch {
    fail(at, "is not a regular expression");
  }
}

/** Checks one schema node and everything below it against the subset, and notes each $ref for resolution. */
function checkNode(node: unknown, where: string, base: string, isRoot: boolean, refs: PendingRef[]): Schema {
  if (!isRecord(node)) fail(where, "a schema must be an object");
  const below = (value: unknown, at: string): void => {
    checkNode(value, at, base, false, refs);
  };
  for (const [keyword, value] of Object.entries(node)) {
    const at = `${where}/${keyword}`;
    switch (keyword) {
      case "$schema":
        if (!isRoot || value !== DRAFT) fail(at, `must be "${DRAFT}", at the root of a file`);
        break;
      case "$id":
        if (!isRoot) fail(at, "only the root of a file has an $id");
        break;
      case "$defs":
        if (!isRoot || !isRecord(value)) fail(at, "must be an object, at the root of a file");
        for (const [name, definition] of Object.entries(value)) {
          if (!DEFINITION_NAME.test(name)) fail(`${at}/${name}`, "a definition name is letters and digits");
          below(definition, `${at}/${name}`);
        }
        break;
      case "title":
      case "description":
        if (typeof value !== "string") fail(at, "must be a string");
        break;
      case "$ref":
        if (typeof value !== "string") fail(at, "must be a string");
        refs.push({ ref: value, base, where: at });
        break;
      case "type":
        if (!isTypeName(value) && !(isDistinctList(value, isTypeName) && value.length > 0)) {
          fail(at, `must be one of ${TYPE_NAMES.join(", ")}, or a non-empty list of distinct ones`);
        }
        break;
      case "enum":
        if (!isDistinctList(value, isPrimitive) || value.length === 0) {
          fail(at, "must be a non-empty list of distinct primitives");
        }
        break;
      case "const":
        if (!isPrimitive(value)) fail(at, "must be a primitive");
        break;
      case "minimum":
      case "maximum":
      case "exclusiveMinimum":
      case "exclusiveMaximum":
        if (typeof value !== "number" || !Number.isFinite(value)) fail(at, "must be a finite number");
        break;
      case "minLength":
      case "minItems":
      case "maxItems":
        if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
          fail(at, "must be a non-negative integer");
        }
        break;
      case "pattern":
        checkPattern(value, at);
        break;
      case "uniqueItems":
        if (typeof value !== "boolean") fail(at, "must be a boolean");
        break;
      case "required":
        if (!isDistinctList(value, (name) => typeof name === "string")) {
          fail(at, "must be a list of distinct property names");
        }
        break;
      case "properties":
        if (!isRecord(value)) fail(at, "must be an object of schemas");
        for (const [name, property] of Object.entries(value)) below(property, `${at}/${name}`);
        break;
      case "additionalProperties":
        if (typeof value !== "boolean") below(value, at);
        break;
      case "items":
        below(value, at);
        break;
      case "oneOf":
      case "anyOf":
        if (!Array.isArray(value) || value.length === 0) fail(at, "must be a non-empty list of schemas");
        value.forEach((option, index) => below(option, `${at}/${index}`));
        break;
      default:
        fail(at, "unknown keyword");
    }
  }
  if (Object.hasOwn(node, "$ref")) {
    const beside = Object.keys(node).find((keyword) => !BESIDE_REF.includes(keyword));
    if (beside !== undefined) fail(`${where}/${beside}`, "a $ref stands alone: no assertion may sit beside it");
  }
  if (node.uniqueItems === true) {
    // Only primitives are compared, so the schema itself must rule everything else out.
    const itemType: unknown = isRecord(node.items) ? node.items.type : undefined;
    const names: unknown = typeof itemType === "string" ? [itemType] : itemType;
    if (!Array.isArray(names) || !names.every((name) => PRIMITIVE_TYPE_NAMES.includes(name))) {
      fail(`${where}/uniqueItems`, "needs a sibling items schema whose type names only primitive types");
    }
  }
  // Every keyword present was checked above, and nothing else is present.
  return node as Schema;
}

/**
 * Checks schema files against the subset and links them. Throws an error naming the file and the JSON Pointer of
 * the first fault: an unknown keyword, a malformed keyword value, a file without an `$id`, two files with the same
 * `$id`, or a `$ref` that names no loaded schema. Nothing is fetched: a `$ref` resolves only among `documents`.
 */
export function compileSchemas(documents: readonly SchemaDocument[]): SchemaSet {
  const ids: string[] = [];
  const targets = new Map<string, Schema>();
  const refs: PendingRef[] = [];
  for (const { source, schema } of documents) {
    const id: unknown = isRecord(schema) ? schema.$id : undefined;
    if (typeof id !== "string" || id === "" || id.includes("#")) {
      fail(source, "a schema file is an object with a non-empty $id that has no fragment");
    }
    if (targets.has(id)) fail(source, `the $id "${id}" is already taken by another file`);
    const root = checkNode(schema, `${source}#`, id, true, refs);
    ids.push(id);
    targets.set(id, root);
    for (const [name, definition] of Object.entries(root.$defs ?? {})) targets.set(`${id}#/$defs/${name}`, definition);
  }
  for (const { ref, base, where } of refs) {
    if (!targets.has(ref.startsWith("#") ? base + ref : ref)) fail(where, `"${ref}" names no loaded schema`);
  }
  return { ids, targets };
}

// ── Validating ───────────────────────────────────────────────────────────────────────────────────────────────────

/** The JSON type of a value, or null when it is not JSON data: undefined, a function, a Map, a class instance. */
function jsonTypeOf(value: unknown): JsonType | null {
  switch (typeof value) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object":
      break;
    default:
      return null;
  }
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null ? "object" : null;
}

/** One step deeper in a JSON Pointer. */
function childPath(path: string, key: string | number): string {
  return `${path}/${String(key).replaceAll("~", "~0").replaceAll("/", "~1")}`;
}

/**
 * Reports every value in the instance that JSON cannot carry. No schema can accept one. `ancestors` holds the
 * arrays and objects on the way down to `value`, so that a value which contains itself is reported, not followed.
 */
function checkJson(value: unknown, path: string, issues: ValidationIssue[], ancestors: Set<unknown>): void {
  const type = jsonTypeOf(value);
  if (type === null) {
    const what = typeof value === "object" ? "an object that is not a plain object" : typeof value;
    issues.push({ path, keyword: "json", message: `${what} is not JSON data` });
  } else if (typeof value === "number" && !Number.isFinite(value)) {
    issues.push({ path, keyword: "finite", message: `${value} is not a finite number` });
  } else if (ancestors.has(value)) {
    issues.push({ path, keyword: "json", message: "a circular reference is not JSON data" });
  } else if (Array.isArray(value)) {
    ancestors.add(value);
    // Indexed, so a hole in a sparse array is seen as the undefined it reads as.
    for (let index = 0; index < value.length; index++) {
      checkJson(value[index], childPath(path, index), issues, ancestors);
    }
    ancestors.delete(value);
  } else if (type === "object") {
    const object = value as Readonly<Record<string, unknown>>;
    ancestors.add(value);
    for (const name of Object.keys(object).sort()) checkJson(object[name], childPath(path, name), issues, ancestors);
    ancestors.delete(value);
  }
}

type Targets = ReadonlyMap<string, Schema>;

/** How many alternatives accept the value, and the first issue of each one that does not. */
function tryAlternatives(
  targets: Targets,
  alternatives: readonly Schema[],
  base: string,
  value: unknown,
  path: string,
): { matched: number; failures: string[] } {
  let matched = 0;
  const failures: string[] = [];
  alternatives.forEach((alternative, index) => {
    const issues: ValidationIssue[] = [];
    check(targets, alternative, base, value, path, issues);
    if (issues.length === 0) matched++;
    else failures.push(`[${index}] ${issues[0].path || "(root)"} ${issues[0].keyword}: ${issues[0].message}`);
  });
  return { matched, failures };
}

/** Appends to `issues` every way `value` breaks `schema`. `base` is the `$id` of the file `schema` is written in. */
function check(
  targets: Targets,
  schema: Schema,
  base: string,
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  const report = (keyword: string, message: string): void => {
    issues.push({ path, keyword, message });
  };

  if (schema.$ref !== undefined) {
    const key = schema.$ref.startsWith("#") ? base + schema.$ref : schema.$ref;
    const target = targets.get(key);
    if (target === undefined) throw new Error(`validate: "${key}" names no loaded schema`);
    check(targets, target, key.split("#")[0], value, path, issues);
    return; // a $ref stands alone
  }

  const type = jsonTypeOf(value);
  if (schema.type !== undefined) {
    const allowed = typeof schema.type === "string" ? [schema.type] : schema.type;
    const isInteger = typeof value === "number" && Number.isInteger(value);
    if (!allowed.some((name) => name === type || (name === "integer" && isInteger))) {
      report("type", `expected ${allowed.join(" or ")}, got ${type}`);
      return;
    }
  }
  // Primitives compare by JSON type and value: 1 equals 1.0, and neither equals true or "1".
  if (schema.enum !== undefined && !schema.enum.some((option) => option === value)) {
    report("enum", `must be one of ${JSON.stringify(schema.enum)}`);
  }
  if (Object.hasOwn(schema, "const") && schema.const !== value) {
    report("const", `must be ${JSON.stringify(schema.const)}`);
  }

  if (typeof value === "number") {
    const { minimum, maximum, exclusiveMinimum, exclusiveMaximum } = schema;
    if (minimum !== undefined && value < minimum) report("minimum", `must be at least ${minimum}`);
    if (maximum !== undefined && value > maximum) report("maximum", `must be at most ${maximum}`);
    if (exclusiveMinimum !== undefined && value <= exclusiveMinimum) {
      report("exclusiveMinimum", `must be greater than ${exclusiveMinimum}`);
    }
    if (exclusiveMaximum !== undefined && value >= exclusiveMaximum) {
      report("exclusiveMaximum", `must be less than ${exclusiveMaximum}`);
    }
  }

  if (typeof value === "string") {
    // Length is counted in Unicode code points, as the draft and Python count it.
    if (schema.minLength !== undefined && [...value].length < schema.minLength) {
      report("minLength", `must be at least ${schema.minLength} character(s) long`);
    }
    // Without the `m` flag, $ is the very end of the string: "abc\n" does not match ^abc$.
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, "u").test(value)) {
      report("pattern", `must match ${schema.pattern}`);
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      report("minItems", `must have at least ${schema.minItems} item(s), has ${value.length}`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      report("maxItems", `must have at most ${schema.maxItems} item(s), has ${value.length}`);
    }
    if (schema.uniqueItems === true) {
      const firstIndex = new Map<string, number>();
      value.forEach((item, index) => {
        if (!isPrimitive(item)) return;
        const key = `${jsonTypeOf(item)}:${String(item)}`;
        const first = firstIndex.get(key);
        if (first === undefined) firstIndex.set(key, index);
        else report("uniqueItems", `items ${first} and ${index} are equal`);
      });
    }
    if (schema.items !== undefined) {
      for (let index = 0; index < value.length; index++) {
        check(targets, schema.items, base, value[index], childPath(path, index), issues);
      }
    }
  }

  if (type === "object") {
    const object = value as Readonly<Record<string, unknown>>;
    for (const name of schema.required ?? []) {
      if (!Object.hasOwn(object, name)) report("required", `missing property "${name}"`);
    }
    const properties = schema.properties ?? {};
    const additional = schema.additionalProperties;
    // Sorted, so the issues come in the same order in every implementation.
    for (const name of Object.keys(object).sort()) {
      const child = childPath(path, name);
      if (Object.hasOwn(properties, name)) check(targets, properties[name], base, object[name], child, issues);
      else if (additional === false) {
        issues.push({ path: child, keyword: "additionalProperties", message: "unexpected property" });
      } else if (typeof additional === "object") check(targets, additional, base, object[name], child, issues);
    }
  }

  if (schema.oneOf !== undefined) {
    const { matched, failures } = tryAlternatives(targets, schema.oneOf, base, value, path);
    if (matched === 0) report("oneOf", `matches none of the alternatives: ${failures.join("; ")}`);
    else if (matched > 1) report("oneOf", `matches ${matched} alternatives, must match exactly one`);
  }
  if (schema.anyOf !== undefined) {
    const { matched, failures } = tryAlternatives(targets, schema.anyOf, base, value, path);
    if (matched === 0) report("anyOf", `matches none of the alternatives: ${failures.join("; ")}`);
  }
}

/**
 * Validates `value` against the schema that `id` names in `set`: a file's `$id`, or `<$id>#/$defs/<name>`.
 * Returns every issue found, in a fixed order, and an empty list exactly when the value is valid. A value that is
 * not JSON data (a non-finite number anywhere in it, undefined, a non-plain object) is never valid, whatever the
 * schema says. Throws when `id` names no schema in the set.
 */
export function validate(set: SchemaSet, id: string, value: unknown): ValidationIssue[] {
  const schema = set.targets.get(id);
  if (schema === undefined) throw new Error(`validate: "${id}" names no loaded schema`);
  const issues: ValidationIssue[] = [];
  checkJson(value, "", issues, new Set());
  if (issues.length === 0) check(set.targets, schema, id.split("#")[0], value, "", issues);
  return issues;
}
