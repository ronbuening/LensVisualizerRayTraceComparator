// The fixture corpus: the files are what corpus.ts says, the validator accepts and rejects them as stated, and the
// valid ones also keep the rules that only code checks. The Python port runs the middle part against the same files.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { decodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { caseInvariantProblems, finalizeCase, verifyCaseIdentity } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { resultInvariantProblems } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { expandSuite } from "../../src/contract/runSpec.ts";
import type { Suite } from "../../src/contract/runSpec.ts";
import { CONTRACT_KINDS, contractSchemas, quantitySchemaId, validateKind } from "../../src/contract/schemas.ts";
import type { ContractKind } from "../../src/contract/schemas.ts";
import { validate } from "../../src/contract/validate.ts";
import type { ValidationIssue } from "../../src/contract/validate.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import {
  DESCRIPTOR_INTEGERS_AS_FLOATS,
  EXTERNAL_VALID,
  FIXTURE_DIR,
  INVALID,
  QUANTITY_FIXTURES,
  SELFTEST_ECHO_EXAMPLES,
  VALID,
  fixtureText,
} from "./corpus.ts";

const CONTRACT_MD = join(FIXTURE_DIR, "..", "..", "CONTRACT.md");

/** The file names in one directory of the corpus, sorted; none when the directory is missing. */
function filesIn(...parts: string[]): string[] {
  const dir = join(FIXTURE_DIR, ...parts);
  return existsSync(dir) ? readdirSync(dir).sort() : [];
}

function readText(...parts: string[]): string {
  return readFileSync(join(FIXTURE_DIR, ...parts), "utf8");
}

function readJson(...parts: string[]): unknown {
  return JSON.parse(readText(...parts));
}

/** Every valid fixture of a kind as it is on disk: `[file name, parsed value]`. */
function validOnDisk(kind: ContractKind): [string, unknown][] {
  return filesIn("valid", kind).map((file) => [file, readJson("valid", kind, file)]);
}

// ── The files are the corpus ─────────────────────────────────────────────────────────────────────────────────────

test("the corpus has one directory per kind and one for the quantities, valid and invalid, and no other", () => {
  const directories = [...CONTRACT_KINDS, "quantities"].sort();
  assert.deepEqual(filesIn(), ["invalid", "valid"]);
  assert.deepEqual(filesIn("valid"), directories);
  assert.deepEqual(filesIn("invalid"), directories);
});

test("the valid files are the values of corpus.ts, written as fixtureText writes them", () => {
  for (const kind of CONTRACT_KINDS) {
    const names = [...Object.keys(VALID[kind]), ...(EXTERNAL_VALID[kind] ?? [])];
    assert.deepEqual(filesIn("valid", kind), names.map((name) => `${name}.json`).sort(), kind);
    for (const [name, value] of Object.entries(VALID[kind])) {
      assert.equal(readText("valid", kind, `${name}.json`), fixtureText(value), `valid/${kind}/${name}.json`);
    }
  }
});

test("the invalid files are the values of corpus.ts, each beside its expectation", () => {
  for (const kind of CONTRACT_KINDS) {
    const names = Object.keys(INVALID[kind]);
    const files = names.flatMap((name) => [`${name}.json`, `${name}.expect.json`]);
    assert.deepEqual(filesIn("invalid", kind), files.sort(), kind);
    for (const [name, { value, expect }] of Object.entries(INVALID[kind])) {
      assert.equal(readText("invalid", kind, `${name}.json`), fixtureText(value), `invalid/${kind}/${name}.json`);
      assert.equal(readText("invalid", kind, `${name}.expect.json`), fixtureText(expect), `${kind}/${name}`);
    }
  }
});

test("every kind has at least two valid and several invalid fixtures", () => {
  for (const kind of CONTRACT_KINDS) {
    assert.ok(filesIn("valid", kind).length >= 2, `valid/${kind}`);
    assert.ok(Object.keys(INVALID[kind]).length >= 5, `invalid/${kind}`);
  }
});

// ── The validator against the files ──────────────────────────────────────────────────────────────────────────────

test("every valid fixture passes the schema of its kind", () => {
  for (const kind of CONTRACT_KINDS) {
    for (const [file, value] of validOnDisk(kind)) assert.deepEqual(validateKind(kind, value), [], `${kind}/${file}`);
  }
});

test("every invalid fixture fails with the one issue its expectation names: instance path and keyword", () => {
  for (const kind of CONTRACT_KINDS) {
    for (const file of filesIn("invalid", kind).filter((name) => name.endsWith(".expect.json"))) {
      const name = file.slice(0, -".expect.json".length);
      const expectation = readJson("invalid", kind, file) as Record<string, unknown>;
      assert.deepEqual(Object.keys(expectation), ["path", "keyword"], `${kind}/${file}`);
      const issues = validateKind(kind, readJson("invalid", kind, `${name}.json`));
      assert.deepEqual(
        issues.map(({ path, keyword }) => ({ path, keyword })),
        [expectation],
        `invalid/${kind}/${name}.json`,
      );
    }
  }
});

test("the invalid fixtures make every one of these keywords the reported one", () => {
  const reported = new Set<string>();
  for (const kind of CONTRACT_KINDS)
    for (const { expect } of Object.values(INVALID[kind])) reported.add(expect.keyword);
  // anyOf and exclusiveMaximum occur in the schemas only inside a oneOf, which is then the keyword reported; the
  // validator's own tests cover them. "finite" is the validator's own rule, not a schema keyword.
  assert.deepEqual([...reported].sort(), [
    "additionalProperties",
    "const",
    "enum",
    "exclusiveMinimum",
    "finite",
    "maxItems",
    "maximum",
    "minItems",
    "minLength",
    "minimum",
    "oneOf",
    "pattern",
    "required",
    "type",
    "uniqueItems",
  ]);
});

// ── Quantities ───────────────────────────────────────────────────────────────────────────────────────────────────

const QUANTITY_SCHEMAS = Object.keys(QUANTITY_FIXTURES).sort();

/** Validates a value against the quantity schema that a fixture directory `<quantity>.<part>` is named after. */
function validateQuantityPart(schema: string, value: unknown): ValidationIssue[] {
  const part = schema.endsWith(".spec") ? "spec" : "data";
  return validate(contractSchemas(), quantitySchemaId(schema.slice(0, -(part.length + 1)), part), value);
}

test("the quantities directory has the spec and the data of every registered quantity, and no other", () => {
  const expected = QUANTITIES.list().flatMap(({ id }) => [`${id}.data`, `${id}.spec`]);
  assert.deepEqual(QUANTITY_SCHEMAS, expected);
  assert.deepEqual(filesIn("valid", "quantities"), expected);
  assert.deepEqual(filesIn("invalid", "quantities"), expected);
});

test("the quantity files are the values of corpus.ts, and every schema has two valid and several invalid ones", () => {
  for (const schema of QUANTITY_SCHEMAS) {
    const { valid, invalid } = QUANTITY_FIXTURES[schema];
    // A spec with nothing to choose has one valid value, the empty object, and so one valid fixture.
    const onlyEmpty = Object.values(valid).every((value) => JSON.stringify(value) === "{}");
    assert.ok(Object.keys(valid).length >= (onlyEmpty ? 1 : 2), `valid/quantities/${schema}`);
    if (onlyEmpty) assert.deepEqual(validateQuantityPart(schema, { anything: 1 }).length, 1, schema);
    assert.ok(Object.keys(invalid).length >= 5, `invalid/quantities/${schema}`);
    const validFiles = Object.keys(valid).map((name) => `${name}.json`);
    assert.deepEqual(filesIn("valid", "quantities", schema), validFiles.sort(), schema);
    for (const [name, value] of Object.entries(valid)) {
      assert.equal(readText("valid", "quantities", schema, `${name}.json`), fixtureText(value), `${schema}/${name}`);
    }
    const invalidFiles = Object.keys(invalid).flatMap((name) => [`${name}.json`, `${name}.expect.json`]);
    assert.deepEqual(filesIn("invalid", "quantities", schema), invalidFiles.sort(), schema);
    for (const [name, { value, expect }] of Object.entries(invalid)) {
      const at = ["invalid", "quantities", schema] as const;
      assert.equal(readText(...at, `${name}.json`), fixtureText(value), `${schema}/${name}`);
      assert.equal(readText(...at, `${name}.expect.json`), fixtureText(expect), `${schema}/${name}`);
    }
  }
});

test("every valid quantity fixture passes its schema, and every invalid one fails with the one issue it names", () => {
  for (const schema of QUANTITY_SCHEMAS) {
    for (const file of filesIn("valid", "quantities", schema)) {
      const value = readJson("valid", "quantities", schema, file);
      assert.deepEqual(validateQuantityPart(schema, value), [], `valid/quantities/${schema}/${file}`);
    }
    for (const file of filesIn("invalid", "quantities", schema).filter((name) => name.endsWith(".expect.json"))) {
      const name = file.slice(0, -".expect.json".length);
      const expectation = readJson("invalid", "quantities", schema, file) as Record<string, unknown>;
      assert.deepEqual(Object.keys(expectation), ["path", "keyword"], `${schema}/${file}`);
      const issues = validateQuantityPart(schema, readJson("invalid", "quantities", schema, `${name}.json`));
      assert.deepEqual(
        issues.map(({ path, keyword }) => ({ path, keyword })),
        [expectation],
        `invalid/quantities/${schema}/${name}.json`,
      );
    }
  }
});

test("a quantity module validates as the schema files do", () => {
  for (const schema of QUANTITY_SCHEMAS) {
    const part = schema.endsWith(".spec") ? "spec" : "data";
    const module = QUANTITIES.get(schema.slice(0, -(part.length + 1)));
    assert.ok(module !== undefined, schema);
    const check = part === "spec" ? module.validateSpec : module.validateData;
    for (const value of Object.values(QUANTITY_FIXTURES[schema].valid)) assert.deepEqual(check(value), []);
    for (const [name, { value, expect }] of Object.entries(QUANTITY_FIXTURES[schema].invalid)) {
      assert.deepEqual(
        check(value).map(({ path, keyword }) => ({ path, keyword })),
        [expect],
        `${schema}/${name}`,
      );
    }
  }
});

test("each selftest.echo data fixture answers the spec fixture of the same name: same shape, its own sum", () => {
  assert.deepEqual(
    filesIn("valid", "quantities", "selftest.echo.spec"),
    filesIn("valid", "quantities", "selftest.echo.data"),
  );
  for (const [name, { spec, data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    const asked = decodeNdArray(spec.values);
    const answered = decodeNdArray(data.values);
    assert.deepEqual(answered.shape, asked.shape, name);
    assert.equal(answered.dtype, "f8", name);
    // The sum of the answer, as the contract defines it: a plain running sum from 0, null when not finite.
    let sum = 0;
    for (const value of answered.values) sum += value;
    assert.equal(data.sum, Number.isFinite(sum) ? sum : null, name);
  }
  // With scale 1 the answer is the question, bit for bit.
  for (const name of ["special-values", "sum-is-not-compensated"]) {
    const { spec, data } = SELFTEST_ECHO_EXAMPLES[name];
    assert.equal(spec.scale, 1, name);
    assert.deepEqual(data.values, spec.values, name);
  }
});

// ── Fixtures whose point is how a number is spelled ──────────────────────────────────────────────────────────────

test("a number too large for a float64 is in its file as the literal 1e400, and reads as an infinity", () => {
  const overflowing = CONTRACT_KINDS.flatMap((kind) =>
    Object.entries(INVALID[kind])
      .filter(([, { expect }]) => expect.keyword === "finite")
      .map(([name, { expect }]) => ({ kind, name, expect })),
  );
  assert.deepEqual(
    overflowing.map(({ kind, name }) => `${kind}/${name}`),
    ["optical-case/number-overflow", "request/spec-number-overflow"],
  );
  for (const { kind, name, expect } of overflowing) {
    const text = readText("invalid", kind, `${name}.json`);
    assert.equal(text.match(/1e400/g)?.length, 1, `${kind}/${name}`);
    assert.ok(!text.includes("null") && !text.includes("@"), `${kind}/${name}`);
    let member = JSON.parse(text) as unknown;
    for (const token of expect.path.slice(1).split("/")) member = (member as Record<string, unknown>)[token];
    assert.equal(member, Infinity, `${kind}/${name}`);
  }
  assert.equal(fixtureText({ a: [Infinity, 1] }), '{\n  "a": [\n    1e400,\n    1\n  ]\n}\n');
});

test("the descriptor that writes its integers as floats holds the value corpus.ts states, in those spellings", () => {
  const text = readText("valid", "engine-descriptor", "integers-as-floats.json");
  for (const spelling of ['"version": 1.0', '"version": 2e0', '"maxConcurrency": 4.0']) {
    assert.ok(text.includes(spelling), spelling);
  }
  assert.deepEqual(JSON.parse(text), DESCRIPTOR_INTEGERS_AS_FLOATS);
});

// ── The valid fixtures keep the rules that only code checks ──────────────────────────────────────────────────────

test("every valid optical case keeps its invariants and its identity, and finalising it again changes nothing", () => {
  for (const [file, value] of validOnDisk("optical-case")) {
    const opticalCase = value as OpticalCase;
    assert.deepEqual(caseInvariantProblems(opticalCase.system, opticalCase.conditions), [], file);
    assert.deepEqual(verifyCaseIdentity(opticalCase), [], file);
    assert.equal(fixtureText(finalizeCase(opticalCase)), readText("valid", "optical-case", file), file);
  }
});

test("every valid request has the id its content gives", () => {
  for (const [file, value] of validOnDisk("request")) {
    const { id, caseId, quantity, spec } = value as QuantityRequest;
    assert.equal(id, hashCanonical({ caseId, quantity, spec }), file);
  }
});

test("every valid result keeps the status rules, and the fixtures show all four statuses", () => {
  const statuses = validOnDisk("result").map(([file, value]) => {
    const result = value as ResultEnvelope;
    assert.deepEqual(resultInvariantProblems(result), [], file);
    return result.status;
  });
  assert.deepEqual(statuses.sort(), ["error", "ok", "pending", "unsupported"]);
});

test("every valid suite expands to valid RunSpecs", () => {
  for (const [file, value] of validOnDisk("suite")) {
    const runs = expandSuite(value as Suite);
    assert.ok(runs.length > 0, file);
    for (const run of runs) assert.deepEqual(validateKind("run-spec", run), [], `${file}: ${run.name}`);
  }
});

test("every fixture path a valid RunSpec or suite names is a valid optical case of the corpus", () => {
  const specs = [
    ...validOnDisk("run-spec").map(([, value]) => value),
    ...validOnDisk("suite").flatMap(([, value]) => expandSuite(value as Suite)),
  ] as { lens: { kind: string; path?: string } }[];
  const paths = specs.flatMap(({ lens }) => (lens.kind === "fixture" ? [lens.path as string] : []));
  assert.ok(paths.length >= 3);
  for (const path of paths) {
    const prefix = "contract/fixtures/v1/valid/optical-case/";
    assert.ok(path.startsWith(prefix), path);
    assert.ok(filesIn("valid", "optical-case").includes(path.slice(prefix.length)), path);
  }
});

// ── CONTRACT.md ──────────────────────────────────────────────────────────────────────────────────────────────────

test("the worked examples of CONTRACT.md are the fixtures they name", () => {
  const text = readFileSync(CONTRACT_MD, "utf8");
  const examples = [...text.matchAll(/<!-- fixture: (\S+) -->\n+```json\n([\s\S]*?)\n```/g)];
  assert.deepEqual(
    examples.map(([, file]) => file),
    ["valid/run-spec/worked-example.json", "valid/suite/worked-example.json"],
  );
  for (const [, file, json] of examples) assert.deepEqual(JSON.parse(json), readJson(file), file);
});

test("CONTRACT.md names every kind and every quantity", () => {
  const text = readFileSync(CONTRACT_MD, "utf8");
  for (const kind of CONTRACT_KINDS) assert.ok(text.includes(`\`${kind}\``), kind);
  for (const { id, version } of QUANTITIES.list()) {
    assert.ok(text.includes(`### \`${id}\``), id);
    assert.ok(text.includes(`| \`${id}\` | ${version} |`), `${id} at version ${version}`);
  }
});
