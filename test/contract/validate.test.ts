import assert from "node:assert/strict";
import { test } from "node:test";

import { compileSchemas, validate } from "../../src/contract/validate.ts";
import type { SchemaSet } from "../../src/contract/validate.ts";

const DRAFT = "https://json-schema.org/draft/2020-12/schema";
const ID = "urn:test:schema";

/** A set holding one schema file with the given keywords. */
function setOf(keywords: Record<string, unknown>): SchemaSet {
  return compileSchemas([{ source: "test.schema.json", schema: { $id: ID, ...keywords } }]);
}

/** Every issue the schema raises for the value, as `path keyword`; a root issue has no path before the keyword. */
function issuesOf(keywords: Record<string, unknown>, value: unknown): string[] {
  return validate(setOf(keywords), ID, value).map((issue) => `${issue.path} ${issue.keyword}`.trim());
}

function accepts(keywords: Record<string, unknown>, ...values: unknown[]): void {
  for (const value of values) assert.deepEqual(issuesOf(keywords, value), [], `accepts ${JSON.stringify(value)}`);
}

function rejects(keywords: Record<string, unknown>, keyword: string, ...values: unknown[]): void {
  for (const value of values) {
    assert.deepEqual(issuesOf(keywords, value), [keyword], `rejects ${JSON.stringify(value)}`);
  }
}

/** The message of the error that loading the given schema files throws. */
function loadError(...schemas: unknown[]): string {
  const documents = schemas.map((schema, index) => ({ source: `file${index}.schema.json`, schema }));
  try {
    compileSchemas(documents);
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  return assert.fail("the schemas loaded");
}

// ── Assertion keywords ───────────────────────────────────────────────────────────────────────────────────────────

test("type: each name accepts its own JSON type and no other", () => {
  const samples: Record<string, unknown> = {
    null: null,
    boolean: false,
    number: 1.5,
    string: "",
    array: [],
    object: {},
  };
  for (const [name, sample] of Object.entries(samples)) {
    accepts({ type: name }, sample);
    const others = Object.entries(samples).filter(([other]) => other !== name);
    rejects({ type: name }, "type", ...others.map(([, other]) => other));
  }
});

test("type: integer is a number without a fraction, however it was written", () => {
  accepts({ type: "integer" }, 0, -3, 1.0, 1e3, 2 ** 53);
  rejects({ type: "integer" }, "type", 0.5, -1e-9, "1", true, null);
  accepts({ type: "number" }, 0, 7, 0.5);
});

test("type: a list accepts any of its names", () => {
  accepts({ type: ["string", "null"] }, "a", null);
  rejects({ type: ["string", "null"] }, "type", 0, false, [], {});
  accepts({ type: ["integer", "boolean"] }, 4, true);
  rejects({ type: ["integer", "boolean"] }, "type", 4.5);
});

test("type: a value of the wrong type gets that issue and no other from the same schema", () => {
  const schema = { type: "string", enum: ["a"], const: "a", minLength: 1, pattern: "^a$", oneOf: [{ const: "a" }] };
  assert.deepEqual(issuesOf(schema, 5), ["type"]);
  assert.deepEqual(issuesOf(schema, "b"), ["enum", "const", "pattern", "oneOf"]);
});

test("enum and const compare primitives by JSON type and value", () => {
  const options = { enum: ["a", 1, true, null] };
  accepts(options, "a", 1, 1.0, true, null);
  rejects(options, "enum", "A", "1", 2, false, 0, "", [], {}, ["a"]);

  accepts({ const: 0 }, 0, -0, 0.0);
  rejects({ const: 0 }, "const", false, null, "0", "");
  accepts({ const: null }, null);
  rejects({ const: null }, "const", 0, false, "");
  accepts({ const: true }, true);
  rejects({ const: true }, "const", 1, "true");
  accepts({ const: "run" }, "run");
  rejects({ const: "run" }, "const", "Run", ["run"]);
});

test("minimum and maximum include their bound; the exclusive forms do not", () => {
  accepts({ minimum: 2 }, 2, 2.5, 1e300);
  rejects({ minimum: 2 }, "minimum", 1.999, -5);
  accepts({ maximum: 2 }, 2, -1e300);
  rejects({ maximum: 2 }, "maximum", 2.0000001);
  accepts({ exclusiveMinimum: 0 }, 5e-324, 1);
  rejects({ exclusiveMinimum: 0 }, "exclusiveMinimum", 0, -0, -1);
  accepts({ exclusiveMaximum: 90 }, 89.999, -90);
  rejects({ exclusiveMaximum: 90 }, "exclusiveMaximum", 90, 91);
  assert.deepEqual(issuesOf({ minimum: 0, maximum: 1, exclusiveMinimum: 0, exclusiveMaximum: 1 }, 1), [
    "exclusiveMaximum",
  ]);
});

test("numeric keywords say nothing about values that are not numbers", () => {
  accepts({ minimum: 2, maximum: 3, exclusiveMinimum: 2, exclusiveMaximum: 3 }, "1", null, [1], { n: 1 }, true);
});

test("minLength counts Unicode code points", () => {
  accepts({ minLength: 1 }, "a", "😀");
  rejects({ minLength: 1 }, "minLength", "");
  accepts({ minLength: 2 }, "😀😀", "ab");
  rejects({ minLength: 2 }, "minLength", "😀", "a");
  accepts({ minLength: 5 }, 1, null, []);
});

test("pattern must match the whole string", () => {
  const hex = { pattern: "^[0-9a-f]{4}$" };
  accepts(hex, "09af", 7, null);
  rejects(hex, "pattern", "09AF", "09af0", "9af", "09af\n", "");
  accepts({ pattern: "^1\\.(0|[1-9][0-9]*)$" }, "1.0", "1.12");
  rejects({ pattern: "^1\\.(0|[1-9][0-9]*)$" }, "pattern", "1.01", "2.0", "1", "1.");
});

test("items validates every element and reports each failure at its index", () => {
  const schema = { items: { type: "integer", minimum: 0 } };
  accepts(schema, [], [0, 1, 2], "not an array", { 0: "x" });
  assert.deepEqual(issuesOf(schema, [0, "a", -1, 1.5]), ["/1 type", "/2 minimum", "/3 type"]);
});

test("minItems and maxItems bound the length", () => {
  accepts({ minItems: 2, maxItems: 3 }, [1, 2], [1, 2, 3], "ab", {});
  rejects({ minItems: 2, maxItems: 3 }, "minItems", [], [1]);
  rejects({ minItems: 2, maxItems: 3 }, "maxItems", [1, 2, 3, 4]);
  accepts({ maxItems: 0 }, []);
});

test("uniqueItems compares primitives by JSON type and value and reports every repeat", () => {
  const schema = { items: { type: ["string", "number", "boolean", "null"] }, uniqueItems: true };
  accepts(schema, [], [1, "1", true, null, "true", "null", 0, false, ""]);
  rejects(schema, "uniqueItems", [1, 2, 1], [1, 1.0], [0, -0], ["a", "b", "a"], [null, null], [true, true]);
  assert.deepEqual(issuesOf(schema, ["a", "a", "b", "b", "a"]), ["uniqueItems", "uniqueItems", "uniqueItems"]);
  assert.match(validate(setOf(schema), ID, ["x", "y", "x"])[0].message, /items 0 and 2 are equal/);
  accepts({ items: { type: "string" }, uniqueItems: false }, ["a", "a"]);
});

test("uniqueItems leaves an item of the wrong type to the items schema", () => {
  const schema = { items: { type: "string" }, uniqueItems: true };
  assert.deepEqual(issuesOf(schema, [{}, {}, [], []]), ["/0 type", "/1 type", "/2 type", "/3 type"]);
});

test("required names each missing property at the object", () => {
  const schema = { required: ["a", "b"] };
  accepts(schema, { a: 1, b: null, c: 0 }, "a string", [], null);
  assert.deepEqual(issuesOf(schema, {}), ["required", "required"]);
  assert.deepEqual(issuesOf(schema, { b: null }), ["required"]);
  assert.match(validate(setOf(schema), ID, { b: null })[0].message, /"a"/);
  // A property is present when the object has it itself, not when a prototype does.
  assert.deepEqual(issuesOf({ required: ["toString"] }, {}), ["required"]);
});

test("properties validates the members it names and ignores the rest", () => {
  const schema = { properties: { n: { type: "number" }, s: { type: "string" } } };
  accepts(schema, {}, { n: 1 }, { n: 1, s: "", other: [] }, [1], "n");
  assert.deepEqual(issuesOf(schema, { n: "1", s: 2 }), ["/n type", "/s type"]);
});

test("additionalProperties false rejects each member that properties does not name, at the member", () => {
  const schema = { properties: { a: {} }, additionalProperties: false };
  accepts(schema, {}, { a: [] }, "text", []);
  assert.deepEqual(issuesOf(schema, { a: 1, b: 2, c: 3 }), ["/b additionalProperties", "/c additionalProperties"]);
  assert.deepEqual(issuesOf({ additionalProperties: false }, { x: 1 }), ["/x additionalProperties"]);
  accepts({ properties: { a: {} }, additionalProperties: true }, { a: 1, b: 2 });
});

test("additionalProperties as a schema validates each member that properties does not name", () => {
  const schema = { properties: { name: { type: "string" } }, additionalProperties: { type: "number" } };
  accepts(schema, { name: "x", a: 1, b: 2.5 });
  assert.deepEqual(issuesOf(schema, { name: "x", a: "1", b: null }), ["/a type", "/b type"]);
  assert.deepEqual(issuesOf(schema, { name: 5 }), ["/name type"]);
});

test("object keywords say nothing about arrays, and array keywords nothing about objects", () => {
  accepts({ required: ["length"], properties: { 0: { type: "string" } }, additionalProperties: false }, [1, 2]);
  accepts({ items: { type: "string" }, minItems: 3, uniqueItems: false }, { 0: 1, length: 1 });
});

test("oneOf needs exactly one alternative to accept the value", () => {
  const schema = { oneOf: [{ type: "number", minimum: 0 }, { type: "number", maximum: 10 }, { type: "string" }] };
  accepts(schema, -1, 11, "x");
  rejects(schema, "oneOf", 5, null, []);
  const [none] = validate(setOf(schema), ID, null);
  assert.match(none.message, /matches none of the alternatives/);
  const [several] = validate(setOf(schema), ID, 5);
  assert.match(several.message, /matches 2 alternatives/);
});

test("oneOf reports at the value itself and quotes the first issue of every alternative", () => {
  const shape = {
    oneOf: [
      { properties: { kind: { const: "plane" } }, required: ["kind"], additionalProperties: false },
      {
        properties: { kind: { const: "conic" }, radius: { type: "number" } },
        required: ["kind", "radius"],
        additionalProperties: false,
      },
    ],
  };
  const schema = { properties: { shape } };
  accepts(schema, { shape: { kind: "plane" } }, { shape: { kind: "conic", radius: 5 } });
  const issues = validate(setOf(schema), ID, { shape: { kind: "conic", radius: "5" } });
  assert.equal(issues.length, 1);
  assert.deepEqual([issues[0].path, issues[0].keyword], ["/shape", "oneOf"]);
  assert.match(issues[0].message, /\[0\] \/shape\/kind const: must be "plane"/);
  assert.match(issues[0].message, /\[1\] \/shape\/radius type: expected number, got string/);
});

test("anyOf needs at least one alternative to accept the value", () => {
  const nonZero = { type: "number", anyOf: [{ exclusiveMinimum: 0 }, { exclusiveMaximum: 0 }] };
  accepts(nonZero, 1, -1, 1e-300);
  rejects(nonZero, "anyOf", 0, -0);
  accepts({ anyOf: [{ type: "number" }, { minimum: 0 }] }, 5, -5, "both alternatives ignore strings");
  rejects({ anyOf: [{ type: "null" }, { type: "string" }] }, "anyOf", 1);
});

test("keywords combine: every one that fails is reported, in a fixed order", () => {
  const schema = {
    type: "object",
    properties: { b: { type: "string", minLength: 2, pattern: "^x+$" }, a: { type: "array", minItems: 1 } },
    required: ["z", "a"],
    additionalProperties: false,
  };
  // required first, then the members in sorted order, whatever order the object was written in.
  assert.deepEqual(issuesOf(schema, { m: 1, b: "y", a: [] }), [
    "required",
    "/a minItems",
    "/b minLength",
    "/b pattern",
    "/m additionalProperties",
  ]);
});

test("an empty schema accepts every JSON value", () => {
  accepts({}, null, true, 0, "", [], {}, [[{ a: [null] }]]);
});

// ── Paths ────────────────────────────────────────────────────────────────────────────────────────────────────────

test("an issue's path is a JSON Pointer: nested, with ~ and / escaped", () => {
  const text = { type: "string" };
  const schema = {
    properties: { list: { items: { properties: { "a/b": text, "m~n": text, "": text, $nd: text } } } },
  };
  assert.deepEqual(issuesOf(schema, { list: [{}, { "a/b": 1, "m~n": 2, "": 3, $nd: 4 }] }), [
    "/list/1/ type",
    "/list/1/$nd type",
    "/list/1/a~1b type",
    "/list/1/m~0n type",
  ]);
  assert.equal(validate(setOf({ type: "string" }), ID, 1)[0].path, "");
});

// ── Values that are not JSON data ────────────────────────────────────────────────────────────────────────────────

test("a non-finite number is never valid, whatever the schema says", () => {
  for (const bad of [NaN, Infinity, -Infinity]) {
    for (const schema of [{}, { type: "number" }, { type: ["number", "null"] }, { anyOf: [{}, {}] }, { minimum: 0 }]) {
      assert.deepEqual(issuesOf(schema, bad), ["finite"], `${bad} against ${JSON.stringify(schema)}`);
    }
  }
});

test("a non-finite number is found at any depth, where no schema looks, and is the only thing reported", () => {
  const schema = { type: "object", properties: { spec: { type: "object" } }, required: ["missing"] };
  const value = { spec: { rays: [0, [1, NaN]], scale: Infinity }, extra: -Infinity };
  assert.deepEqual(issuesOf(schema, value), ["/extra finite", "/spec/rays/1/1 finite", "/spec/scale finite"]);
  assert.match(validate(setOf(schema), ID, value)[0].message, /-Infinity is not a finite number/);
});

test("a value JSON cannot carry is never valid", () => {
  class Lens {
    radius = 1;
  }
  const notJson: unknown[] = [
    undefined,
    () => 1,
    Symbol("s"),
    10n,
    new Map(),
    new Date(0),
    new Lens(),
    new Float64Array(1),
  ];
  for (const bad of notJson) {
    assert.deepEqual(issuesOf({}, bad), ["json"]);
    assert.deepEqual(issuesOf({}, { a: [bad] }), ["/a/0 json"]);
  }
  assert.deepEqual(issuesOf({ properties: { a: { type: "string" } } }, { a: undefined }), ["/a json"]);
  // A hole in a sparse array reads as undefined.
  assert.deepEqual(issuesOf({}, [1, , 3]), ["/1 json"]); // eslint-disable-line no-sparse-arrays
});

test("a value that contains itself is not JSON data, and one that is merely repeated is", () => {
  const ring: Record<string, unknown> = { name: "ring" };
  ring.self = ring;
  assert.deepEqual(issuesOf({}, ring), ["/self json"]);
  const loop: unknown[] = [1];
  loop.push({ back: loop });
  assert.deepEqual(issuesOf({}, { loop }), ["/loop/1/back json"]);
  assert.match(validate(setOf({}), ID, ring)[0].message, /circular reference/);

  const shared = { n: 1 };
  accepts({}, { a: shared, b: shared, c: [shared, shared] });
});

test("an object without a prototype is a plain object", () => {
  const bare: Record<string, unknown> = Object.create(null);
  bare.a = 1;
  accepts({ type: "object", required: ["a"], properties: { a: { type: "integer" } } }, bare);
});

// ── $ref and $defs ───────────────────────────────────────────────────────────────────────────────────────────────

test("$ref resolves a definition in the same file", () => {
  const schema = {
    properties: { a: { $ref: "#/$defs/positive" }, b: { $ref: "#/$defs/positive" } },
    $defs: { positive: { type: "number", exclusiveMinimum: 0 } },
  };
  accepts(schema, { a: 1, b: 2 });
  assert.deepEqual(issuesOf(schema, { a: 0, b: "x" }), ["/a exclusiveMinimum", "/b type"]);
});

test("$ref resolves another file by its $id, whole or by definition, and local references follow the file", () => {
  const set = compileSchemas([
    {
      source: "main.schema.json",
      schema: {
        $id: "urn:test:main",
        properties: {
          whole: { $ref: "urn:test:other" },
          part: { $ref: "urn:test:other#/$defs/code" },
          own: { $ref: "#/$defs/code" },
        },
        $defs: { code: { type: "integer" } },
      },
    },
    {
      source: "other.schema.json",
      schema: {
        $id: "urn:test:other",
        type: "object",
        properties: { code: { $ref: "#/$defs/code" } },
        $defs: { code: { type: "string", minLength: 2 } },
      },
    },
  ]);
  assert.deepEqual(set.ids, ["urn:test:main", "urn:test:other"]);
  const pairs = (value: unknown): string[] =>
    validate(set, "urn:test:main", value).map((issue) => `${issue.path} ${issue.keyword}`);

  assert.deepEqual(pairs({ whole: { code: "ab" }, part: "cd", own: 3 }), []);
  // "#/$defs/code" means the string in other.schema.json and the integer in main.schema.json.
  assert.deepEqual(pairs({ whole: { code: 3 }, part: 3, own: "ab" }), ["/own type", "/part type", "/whole/code type"]);
  assert.deepEqual(pairs({ whole: [], part: "c" }), ["/part minLength", "/whole type"]);
});

test("a definition can be validated against directly", () => {
  const set = setOf({ $defs: { sha: { type: "string", pattern: "^[0-9a-f]{2}$" } } });
  assert.deepEqual(validate(set, `${ID}#/$defs/sha`, "0f"), []);
  assert.equal(validate(set, `${ID}#/$defs/sha`, "0F")[0].keyword, "pattern");
});

test("a $ref stands alone: an assertion beside it is an error at load time", () => {
  const assertions: Record<string, unknown> = {
    type: "string",
    minLength: 1,
    properties: {},
    enum: ["a"],
    oneOf: [{}],
    required: [],
    items: {},
  };
  for (const [keyword, value] of Object.entries(assertions)) {
    const schema = { $id: ID, properties: { a: { $ref: "#/$defs/text", [keyword]: value } }, $defs: { text: {} } };
    assert.equal(
      loadError(schema),
      `schema file0.schema.json#/properties/a/${keyword}: a $ref stands alone: no assertion may sit beside it`,
    );
  }
});

test("annotations may sit beside a $ref, and a file may itself be a $ref", () => {
  const set = compileSchemas([
    { source: "a", schema: { $id: "urn:test:alias", $schema: DRAFT, title: "Alias", $ref: "urn:test:real" } },
    {
      source: "b",
      schema: {
        $id: "urn:test:real",
        type: "object",
        properties: { n: { title: "N", description: "a count", $ref: "#/$defs/count" } },
        $defs: { count: { type: "integer", minimum: 0 } },
      },
    },
  ]);
  assert.deepEqual(validate(set, "urn:test:alias", { n: 3 }), []);
  assert.deepEqual(
    validate(set, "urn:test:alias", { n: -1 }).map(({ path, keyword }) => [path, keyword]),
    [["/n", "minimum"]],
  );
});

test("validate throws for an id the set does not hold", () => {
  assert.throws(() => validate(setOf({}), "urn:test:absent", 1), /"urn:test:absent" names no loaded schema/);
  assert.throws(() => validate(setOf({}), `${ID}#/$defs/absent`, 1), /names no loaded schema/);
});

// ── Loading: the subset is enforced before anything is validated ─────────────────────────────────────────────────

test("an unknown keyword is an error at load time, naming the file and the place", () => {
  const outside = [
    "allOf",
    "not",
    "if",
    "then",
    "else",
    "format",
    "maxLength",
    "multipleOf",
    "patternProperties",
    "propertyNames",
    "minProperties",
    "prefixItems",
    "contains",
    "dependentRequired",
    "unevaluatedProperties",
    "default",
    "examples",
    "$comment",
    "$anchor",
    "definitions",
    "nullable",
    "typo",
  ];
  for (const keyword of outside) {
    assert.equal(
      loadError({ $id: ID, [keyword]: {} }),
      `schema file0.schema.json#/${keyword}: unknown keyword`,
      keyword,
    );
  }
});

test("an unknown keyword is found wherever a schema can be", () => {
  const unknown = { format: "date-time" };
  const places: Record<string, Record<string, unknown>> = {
    "#/properties/when/format": { properties: { when: unknown } },
    "#/additionalProperties/format": { additionalProperties: unknown },
    "#/items/format": { items: unknown },
    "#/oneOf/1/format": { oneOf: [{}, unknown] },
    "#/anyOf/0/format": { anyOf: [unknown] },
    "#/$defs/when/format": { $defs: { when: unknown } },
    "#/properties/a/items/properties/b/format": { properties: { a: { items: { properties: { b: unknown } } } } },
  };
  for (const [place, keywords] of Object.entries(places)) {
    assert.equal(loadError({ $id: ID, ...keywords }), `schema file0.schema.json${place}: unknown keyword`);
  }
});

test("a property may have the name of a keyword, known or not", () => {
  const schema = { properties: { format: { type: "string" }, type: { const: "x" }, $ref: {}, allOf: {} } };
  accepts(schema, { format: "a", type: "x", $ref: 1, allOf: 2 });
  assert.deepEqual(issuesOf(schema, { format: 1, type: "y" }), ["/format type", "/type const"]);
});

test("the annotations title and description are accepted anywhere and must be strings", () => {
  accepts({ title: "T", description: "D", properties: { a: { title: "A", description: "about a" } } }, { a: 1 });
  assert.match(loadError({ $id: ID, title: 1 }), /#\/title: must be a string/);
  assert.match(loadError({ $id: ID, items: { description: [] } }), /#\/items\/description: must be a string/);
});

test("a malformed keyword value is an error at load time", () => {
  const malformed: [Record<string, unknown>, RegExp][] = [
    [{ type: "float" }, /#\/type: must be one of null, boolean, integer, number, string, array, object/],
    [{ type: [] }, /#\/type/],
    [{ type: ["string", "string"] }, /#\/type/],
    [{ type: ["string", "text"] }, /#\/type/],
    [{ enum: [] }, /#\/enum: must be a non-empty list of distinct primitives/],
    [{ enum: "a" }, /#\/enum/],
    [{ enum: ["a", "a"] }, /#\/enum/],
    [{ enum: [{}] }, /#\/enum/],
    [{ enum: [[1]] }, /#\/enum/],
    [{ const: {} }, /#\/const: must be a primitive/],
    [{ const: [1] }, /#\/const/],
    [{ minimum: "0" }, /#\/minimum: must be a finite number/],
    [{ maximum: null }, /#\/maximum/],
    [{ exclusiveMinimum: true }, /#\/exclusiveMinimum/],
    [{ exclusiveMaximum: [] }, /#\/exclusiveMaximum/],
    [{ minLength: -1 }, /#\/minLength: must be a non-negative integer/],
    [{ minItems: 1.5 }, /#\/minItems/],
    [{ maxItems: "2" }, /#\/maxItems/],
    [{ uniqueItems: "yes" }, /#\/uniqueItems: must be a boolean/],
    [{ required: "a" }, /#\/required: must be a list of distinct property names/],
    [{ required: ["a", "a"] }, /#\/required/],
    [{ required: [1] }, /#\/required/],
    [{ properties: [] }, /#\/properties: must be an object of schemas/],
    [{ properties: { a: true } }, /#\/properties\/a: a schema must be an object/],
    [{ additionalProperties: "no" }, /#\/additionalProperties: a schema must be an object/],
    [{ items: [{}] }, /#\/items: a schema must be an object/],
    [{ items: false }, /#\/items: a schema must be an object/],
    [{ oneOf: [] }, /#\/oneOf: must be a non-empty list of schemas/],
    [{ oneOf: {} }, /#\/oneOf/],
    [{ anyOf: [1] }, /#\/anyOf\/0: a schema must be an object/],
    [{ $ref: 5 }, /#\/\$ref: must be a string/],
    [{ $defs: [] }, /#\/\$defs: must be an object, at the root of a file/],
    [{ $defs: { "a/b": {} } }, /#\/\$defs\/a\/b: a definition name is letters and digits/],
    [{ $defs: { "1st": {} } }, /#\/\$defs\/1st/],
  ];
  for (const [keywords, message] of malformed) assert.match(loadError({ $id: ID, ...keywords }), message);
});

test("a pattern must be anchored at both ends and compile", () => {
  for (const pattern of ["abc", "^abc", "abc$", "^abc\\$", "", 5]) {
    assert.match(loadError({ $id: ID, pattern }), /#\/pattern: must be a string anchored with \^ and \$/);
  }
  assert.match(loadError({ $id: ID, pattern: "^(abc$" }), /#\/pattern: is not a regular expression/);
  accepts({ pattern: "^$" }, "");
});

test("a pattern uses nothing that ECMAScript and Python match differently", () => {
  const differs = /#\/pattern: \\d, \\w, \\s, \\b and a dot outside a character class match differently/;
  const unportable = ["^\\d+$", "^\\D$", "^\\w*$", "^a\\Wb$", "^a\\sb$", "^\\S+$", "^\\bword$", "^a\\Bb$"];
  for (const pattern of [...unportable, "^.+$", "^a.b$", "^[a-z].$", "^[\\]].$", "^(a|.)$"]) {
    assert.match(loadError({ $id: ID, pattern }), differs, pattern);
  }
  // An escaped dot is a literal, and so is a dot inside a character class, also one that holds an escaped bracket.
  accepts({ pattern: "^[0-9]+\\.[a-z._-]*$" }, "12.a.b-c");
  rejects({ pattern: "^[0-9]+\\.[a-z._-]*$" }, "pattern", "12xa");
  accepts({ pattern: "^[\\].]+$" }, ".]");
  rejects({ pattern: "^[\\].]+$" }, "pattern", "a");
});

test("uniqueItems needs an items schema that admits only primitives", () => {
  const needs = /#\/uniqueItems: needs a sibling items schema whose type names only primitive types/;
  assert.match(loadError({ $id: ID, uniqueItems: true }), needs);
  assert.match(loadError({ $id: ID, uniqueItems: true, items: {} }), needs);
  assert.match(loadError({ $id: ID, uniqueItems: true, items: { type: "object" } }), needs);
  assert.match(loadError({ $id: ID, uniqueItems: true, items: { type: ["string", "array"] } }), needs);
  assert.match(loadError({ $id: ID, properties: { a: { uniqueItems: true } } }), /#\/properties\/a\/uniqueItems/);
  accepts({ uniqueItems: true, items: { type: ["string", "integer", "null"] } }, ["a", 1, null]);
  accepts({ uniqueItems: false }, [{}, {}]);
});

test("$id, $schema and $defs belong to the root of a file", () => {
  accepts({ $schema: DRAFT }, 1);
  assert.match(loadError({ $id: ID, $schema: "http://json-schema.org/draft-07/schema#" }), /#\/\$schema: must be/);
  assert.match(loadError({ $id: ID, items: { $schema: DRAFT } }), /#\/items\/\$schema/);
  assert.match(loadError({ $id: ID, items: { $id: "urn:test:inner" } }), /#\/items\/\$id: only the root of a file/);
  assert.match(loadError({ $id: ID, properties: { a: { $defs: {} } } }), /#\/properties\/a\/\$defs/);
});

test("a schema file needs an $id of its own", () => {
  const needs = /^schema file0\.schema\.json: a schema file is an object with a non-empty \$id that has no fragment$/;
  for (const schema of [{}, { $id: "" }, { $id: 5 }, { $id: "urn:test:a#frag" }, [], "schema", null, true]) {
    assert.match(loadError(schema), needs);
  }
  assert.equal(
    loadError({ $id: ID }, { $id: ID }),
    `schema file1.schema.json: the $id "${ID}" is already taken by another file`,
  );
});

test("a $ref that names no loaded schema is an error at load time", () => {
  const dangling = [
    "#/$defs/absent",
    "urn:test:absent",
    "urn:test:absent#/$defs/a",
    `${ID}#/$defs/absent`,
    "#/properties/a",
    "#",
    "other.schema.json",
    "",
  ];
  for (const ref of dangling) {
    assert.equal(
      loadError({ $id: ID, properties: { a: { $ref: ref } }, $defs: { present: {} } }),
      `schema file0.schema.json#/properties/a/$ref: "${ref}" names no loaded schema`,
    );
  }
});

test("files may reference each other in any order", () => {
  const first = { $id: "urn:test:first", properties: { next: { $ref: "urn:test:second#/$defs/leaf" } } };
  const second = { $id: "urn:test:second", $defs: { leaf: { type: "null" } }, items: { $ref: "urn:test:first" } };
  for (const order of [
    [first, second],
    [second, first],
  ]) {
    const set = compileSchemas(order.map((schema, index) => ({ source: `f${index}`, schema })));
    assert.deepEqual(validate(set, "urn:test:first", { next: null }), []);
    assert.equal(validate(set, "urn:test:second", [{ next: 1 }])[0].path, "/0/next");
  }
});

test("an empty set of schemas loads", () => {
  assert.deepEqual(compileSchemas([]).ids, []);
});
