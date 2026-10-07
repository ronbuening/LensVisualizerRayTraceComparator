import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { ND_DTYPES } from "../../src/core/numeric/ndarray.ts";
import { FEATURE_FLAGS } from "../../src/contract/features.ts";
import { RUN_OPTION_KEYS } from "../../src/contract/runSpec.ts";
import {
  CONTRACT_KINDS,
  SCHEMA_DIR,
  SCHEMA_ID_PREFIX,
  assertKind,
  contractSchemas,
  formatIssues,
  kindSchemaId,
  loadSchemaDirectory,
  quantitySchemaId,
  validateKind,
} from "../../src/contract/schemas.ts";
import { validate } from "../../src/contract/validate.ts";
import { CONTRACT_MAJOR, CONTRACT_VERSION, isCompatibleContract } from "../../src/contract/version.ts";

type Json = Record<string, unknown>;

/** Every schema file below the schema directory, as a path with forward slashes. */
const SCHEMA_FILES: readonly string[] = readdirSync(SCHEMA_DIR, { recursive: true, encoding: "utf8" })
  .map((file) => file.replaceAll("\\", "/"))
  .filter((file) => file.endsWith(".schema.json"))
  .sort();

function readSchema(file: string): Json {
  return JSON.parse(readFileSync(join(SCHEMA_DIR, file), "utf8")) as Json;
}

/** The `$id` a schema file must have, from its path. */
function idOfFile(file: string): string {
  return SCHEMA_ID_PREFIX + file.slice(0, -".schema.json".length).replaceAll("/", ":");
}

/** The object at a path of keys inside a schema. */
function at(schema: Json, ...keys: string[]): Json {
  let node = schema;
  for (const key of keys) node = node[key] as Json;
  assert.equal(typeof node, "object", keys.join("/"));
  return node;
}

/** The `$id` of every file that a schema's `$ref`s reach into. */
function referencedIds(node: unknown, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(node)) for (const item of node) referencedIds(item, found);
  else if (typeof node === "object" && node !== null) {
    for (const [key, value] of Object.entries(node)) {
      if (key === "$ref" && typeof value === "string" && !value.startsWith("#")) found.add(value.split("#")[0]);
      else referencedIds(value, found);
    }
  }
  return found;
}

function tempDir(t: TestContext): string {
  const dir = mkdtempSync(join(tmpdir(), "lvrtc-schemas-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function writeJson(dir: string, file: string, value: unknown): void {
  mkdirSync(join(dir, file, ".."), { recursive: true });
  writeFileSync(join(dir, file), typeof value === "string" ? value : JSON.stringify(value));
}

// ── The version rule ─────────────────────────────────────────────────────────────────────────────────────────────

test("the contract version is the major this code is built for, and a document at it is compatible", () => {
  assert.equal(CONTRACT_VERSION, "1.0");
  assert.equal(CONTRACT_VERSION.split(".")[0], String(CONTRACT_MAJOR));
  assert.equal(isCompatibleContract(CONTRACT_VERSION), true);
});

test("a contract version is compatible exactly when its major matches", () => {
  for (const version of ["1.0", "1.1", "1.27"]) assert.equal(isCompatibleContract(version), true, version);
  for (const version of ["0.9", "2.0", "10.0", "11.0"]) assert.equal(isCompatibleContract(version), false, version);
  for (const version of ["1", "1.", "1.x", "1.0.0", "v1.0", "01.0", "1.00", " 1.0", "", "1.0\n"]) {
    assert.equal(isCompatibleContract(version), false, JSON.stringify(version));
  }
});

// ── The loader ───────────────────────────────────────────────────────────────────────────────────────────────────

test("the loader reads every *.schema.json at any depth, in sorted order, and nothing else", (t) => {
  const dir = tempDir(t);
  writeJson(dir, "b.schema.json", { $id: "urn:test:b", type: "string" });
  writeJson(dir, "a.schema.json", { $id: "urn:test:a", properties: { b: { $ref: "urn:test:b" } } });
  writeJson(dir, "deep/er/c.schema.json", { $id: "urn:test:c", items: { $ref: "urn:test:a" } });
  writeJson(dir, "notes.json", { unknownKeyword: true });
  writeJson(dir, "deep/README.md", "not JSON at all");

  const set = loadSchemaDirectory(dir);
  assert.deepEqual(set.ids, ["urn:test:a", "urn:test:b", "urn:test:c"]);
  assert.deepEqual(validate(set, "urn:test:c", [{ b: "x" }]), []);
  assert.equal(validate(set, "urn:test:c", [{ b: 1 }])[0].path, "/0/b");
});

test("the loader names the file of JSON that does not parse and of a schema outside the subset", (t) => {
  const broken = tempDir(t);
  writeJson(broken, "sub/bad.schema.json", "{ not json");
  assert.throws(() => loadSchemaDirectory(broken), /^Error: schema sub\/bad\.schema\.json: /);

  const outside = tempDir(t);
  writeJson(outside, "sub/odd.schema.json", { $id: "urn:test:odd", properties: { a: { format: "uri" } } });
  assert.throws(() => loadSchemaDirectory(outside), {
    message: "schema sub/odd.schema.json#/properties/a/format: unknown keyword",
  });
});

test("the contract's schemas are loaded once", () => {
  assert.equal(contractSchemas(), contractSchemas());
  assert.deepEqual(contractSchemas().ids, SCHEMA_FILES.map(idOfFile));
});

// ── Drift: files, ids, kinds ─────────────────────────────────────────────────────────────────────────────────────

test("the schema directory is the one for this major version", () => {
  assert.match(SCHEMA_DIR, new RegExp(`contract[\\\\/]schema[\\\\/]v${CONTRACT_MAJOR}$`));
  assert.equal(SCHEMA_ID_PREFIX, `urn:lvrtc:contract:v${CONTRACT_MAJOR}:`);
});

test("every schema file states the draft, and an $id that carries the major version and follows from its path", () => {
  assert.ok(SCHEMA_FILES.length > 0);
  for (const file of SCHEMA_FILES) {
    const schema = readSchema(file);
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema", file);
    assert.equal(schema.$id, idOfFile(file), file);
    assert.ok(String(schema.$id).split(":").includes(`v${CONTRACT_MAJOR}`), file);
    assert.equal(typeof schema.title, "string", file);
  }
});

test("every kind has a schema file named after it", () => {
  for (const kind of CONTRACT_KINDS) {
    assert.ok(SCHEMA_FILES.includes(`${kind}.schema.json`), kind);
    assert.equal(kindSchemaId(kind), idOfFile(`${kind}.schema.json`));
    assert.ok(contractSchemas().targets.has(kindSchemaId(kind)), kind);
  }
});

test("a document that names its kind names the kind its schema is filed under", () => {
  const named = CONTRACT_KINDS.filter((kind) => {
    const properties = readSchema(`${kind}.schema.json`).properties as Json | undefined;
    if (properties?.kind === undefined) return false;
    assert.deepEqual(properties.kind, { const: kind });
    return true;
  });
  assert.deepEqual(named, ["optical-case", "run-spec", "suite", "request", "result"]);
});

test("every schema file is a kind's own or is referenced from one", () => {
  const reached = new Set<string>();
  const queue = CONTRACT_KINDS.map(kindSchemaId);
  for (let id = queue.pop(); id !== undefined; id = queue.pop()) {
    if (reached.has(id)) continue;
    reached.add(id);
    const file = SCHEMA_FILES.find((candidate) => idOfFile(candidate) === id);
    assert.ok(file !== undefined, `${id} is referenced and has no file`);
    queue.push(...referencedIds(readSchema(file)));
  }
  // Quantity schemas are reached through a request's quantity id, not through a $ref.
  const expected = SCHEMA_FILES.filter((file) => !file.startsWith("quantities/")).map(idOfFile);
  assert.deepEqual([...reached].sort(), expected.sort());
});

// ── Drift: constants written both in a schema and in TypeScript ──────────────────────────────────────────────────

test("the feature flags of the schema are the feature flags of the code", () => {
  const items = at(readSchema("optical-case.schema.json"), "properties", "features", "items");
  assert.deepEqual(items.enum, [...FEATURE_FLAGS]);
});

test("the array element types of the schema are the ones the codec has", () => {
  const nd = at(readSchema("common.schema.json"), "$defs", "ndarray", "properties", "$nd", "properties");
  assert.deepEqual(at(nd, "dtype").enum, [...ND_DTYPES]);
  assert.deepEqual(Object.keys(nd).sort(), ["data", "dtype", "sha256", "shape"]);
});

test("the float64 matrix is the array wire form with only its element type and its number of axes narrowed", () => {
  const definitions = at(readSchema("common.schema.json"), "$defs");
  const narrowed = structuredClone(at(definitions, "ndarray"));
  const members = at(narrowed, "properties", "$nd", "properties");
  members.dtype = { const: "f8" };
  members.shape = { ...at(members, "shape"), minItems: 2, maxItems: 2 };
  narrowed.description = at(definitions, "f8Matrix").description;
  assert.deepEqual(at(definitions, "f8Matrix"), narrowed);
});

test("a RunSpec, a suite's defaults and a suite's runs offer the same options", () => {
  const runSpec = at(readSchema("run-spec.schema.json"), "properties");
  const suite = at(readSchema("suite.schema.json"), "properties");
  const defaults = at(suite, "defaults", "properties");
  const run = at(suite, "runs", "items", "properties");
  const identity = ["contract", "kind", "name", "lens"];

  assert.deepEqual(Object.keys(runSpec), [...identity, ...RUN_OPTION_KEYS]);
  assert.deepEqual(Object.keys(defaults), [...RUN_OPTION_KEYS]);
  assert.deepEqual(Object.keys(run), Object.keys(runSpec));
  for (const key of RUN_OPTION_KEYS) {
    // The same option is the same schema wherever it appears; only its address differs between the files.
    const local = at(runSpec, key).$ref as string;
    const shared = local.startsWith("#") ? kindSchemaId("run-spec") + local : local;
    assert.deepEqual(defaults[key], { $ref: shared }, key);
    assert.deepEqual(run[key], { $ref: shared }, key);
  }
  assert.deepEqual(at(suite, "runs", "items").required, ["name", "lens"]);
});

test("the schemas accept the contract version the code writes, and any minor of its major", () => {
  const id = `${SCHEMA_ID_PREFIX}common#/$defs/contractVersion`;
  for (const version of [CONTRACT_VERSION, `${CONTRACT_MAJOR}.1`, `${CONTRACT_MAJOR}.12`]) {
    assert.deepEqual(validate(contractSchemas(), id, version), [], version);
  }
  for (const version of [`${CONTRACT_MAJOR + 1}.0`, "0.1", `${CONTRACT_MAJOR}`, `${CONTRACT_MAJOR}.01`, 1]) {
    assert.equal(validate(contractSchemas(), id, version).length, 1, String(version));
  }
});

// ── Quantity schemas: the place a later stage puts them ──────────────────────────────────────────────────────────

test("no quantity schema is defined yet, and the place for them is documented", () => {
  assert.deepEqual(
    SCHEMA_FILES.filter((file) => file.startsWith("quantities/")),
    [],
  );
  assert.ok(existsSync(join(SCHEMA_DIR, "quantities", "README.md")));
  assert.equal(contractSchemas().targets.has(quantitySchemaId("rays.trace", "spec")), false);
});

test("a quantity schema placed under quantities/ is loaded and addressed by quantitySchemaId", (t) => {
  const dir = tempDir(t);
  cpSync(SCHEMA_DIR, dir, { recursive: true });
  const file = "quantities/rays.trace.spec.schema.json";
  writeJson(dir, file, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: idOfFile(file),
    type: "object",
    properties: { line: { type: "integer", minimum: 0 }, rays: { $ref: `${SCHEMA_ID_PREFIX}common#/$defs/f8Matrix` } },
    required: ["line", "rays"],
    additionalProperties: false,
  });

  const set = loadSchemaDirectory(dir);
  const id = quantitySchemaId("rays.trace", "spec");
  assert.equal(id, idOfFile(file));
  assert.equal(quantitySchemaId("rays.trace", "data"), idOfFile("quantities/rays.trace.data.schema.json"));
  const rays = { $nd: { dtype: "f8", shape: [0, 6], data: "", sha256: "0".repeat(64) } };
  assert.deepEqual(validate(set, id, { line: 0, rays }), []);
  const issues = validate(set, id, { line: 0, rays: { $nd: { ...rays.$nd, shape: [6] } } });
  assert.deepEqual(
    issues.map(({ path, keyword }) => [path, keyword]),
    [["/rays/$nd/shape", "minItems"]],
  );
});

// ── Validating by kind ───────────────────────────────────────────────────────────────────────────────────────────

test("validateKind validates against the schema of the kind", () => {
  const spec = { contract: CONTRACT_VERSION, kind: "run-spec", name: "a", lens: { kind: "lv", key: "some-lens" } };
  assert.deepEqual(validateKind("run-spec", spec), []);
  assert.deepEqual(
    validateKind("suite", spec).map(({ path, keyword }) => `${path} ${keyword}`),
    [" required", "/kind const", "/lens additionalProperties"],
  );
});

test("formatIssues writes one line, and assertKind throws it", () => {
  const spec = { contract: CONTRACT_VERSION, kind: "run-spec", name: 7, lens: { kind: "lv", key: "some-lens" }, x: 1 };
  assert.equal(formatIssues([]), "");
  assert.equal(
    formatIssues(validateKind("run-spec", spec)),
    "/name [type] expected string, got number; /x [additionalProperties] unexpected property",
  );
  assert.equal(
    formatIssues([{ path: "", keyword: "required", message: 'missing property "a"' }]),
    '(root) [required] missing property "a"',
  );
  assert.throws(() => assertKind("run-spec", spec), {
    message:
      "contract: not a valid run-spec: /name [type] expected string, got number; " +
      "/x [additionalProperties] unexpected property",
  });
  assert.doesNotThrow(() =>
    assertKind("run-spec", { contract: spec.contract, kind: spec.kind, name: "a", lens: spec.lens }),
  );
});
