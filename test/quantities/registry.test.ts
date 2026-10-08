import assert from "node:assert/strict";
import { test } from "node:test";

import { SELFTEST_ECHO, SELFTEST_ECHO_VERSION } from "../../src/contract/quantities/selftestEcho.ts";
import { contractSchemas, quantitySchemaId } from "../../src/contract/schemas.ts";
import { validate } from "../../src/contract/validate.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { schemaQuantity } from "../../src/quantities/module.ts";
import type { QuantityModule } from "../../src/quantities/module.ts";
import { createQuantityRegistry } from "../../src/quantities/registry.ts";
import { selftestEchoQuantity } from "../../src/quantities/selftestEcho.ts";
import { SELFTEST_ECHO_EXAMPLES, edited, REMOVE } from "../contract/corpus.ts";

/** A module that accepts everything, for tests of the registry alone. */
function moduleOf(id: string, version = 1): QuantityModule {
  return { id, version, validateSpec: () => [], validateData: () => [] };
}

// ── The registry ─────────────────────────────────────────────────────────────────────────────────────────────────

test("a new registry is empty, and holds what is registered", () => {
  const registry = createQuantityRegistry();
  assert.deepEqual(registry.list(), []);
  assert.equal(registry.has("rays.trace"), false);
  assert.equal(registry.get("rays.trace"), undefined);

  const rays = moduleOf("rays.trace", 2);
  registry.register(rays);
  assert.equal(registry.has("rays.trace"), true);
  assert.equal(registry.get("rays.trace"), rays);
  assert.deepEqual(registry.list(), [rays]);
});

test("a registry lists its modules sorted by id, whatever order they were registered in", () => {
  const ids = ["rays.trace", "mtf.native", "system.describe", "paraxial.first-order", "mtf.geometric"];
  const registry = createQuantityRegistry(ids.map((id) => moduleOf(id)));
  const sorted = ["mtf.geometric", "mtf.native", "paraxial.first-order", "rays.trace", "system.describe"];
  assert.deepEqual(
    registry.list().map(({ id }) => id),
    sorted,
  );
  registry.register(moduleOf("aberrations.seidel"));
  assert.deepEqual(
    registry.list().map(({ id }) => id),
    ["aberrations.seidel", ...sorted],
  );
});

test("the list is a fresh one each time: changing it does not change the registry", () => {
  const registry = createQuantityRegistry([moduleOf("rays.trace")]);
  registry.list().pop();
  assert.equal(registry.list().length, 1);
  assert.notEqual(registry.list(), registry.list());
});

test("a second module with an id already registered is refused, and the first one stays", () => {
  const first = moduleOf("rays.trace", 1);
  const registry = createQuantityRegistry([first, moduleOf("mtf.native")]);
  assert.throws(() => registry.register(moduleOf("rays.trace", 2)), {
    message: "quantity rays.trace is already registered",
  });
  // The very same module again is a duplicate too.
  assert.throws(() => registry.register(first), { message: "quantity rays.trace is already registered" });
  assert.equal(registry.get("rays.trace"), first);
  assert.equal(registry.list().length, 2);
});

test("a registry cannot be created from modules that share an id", () => {
  assert.throws(
    () => createQuantityRegistry([moduleOf("rays.trace"), moduleOf("mtf.native"), moduleOf("rays.trace")]),
    {
      message: "quantity rays.trace is already registered",
    },
  );
});

test("a lookup is by exact id: nothing an object inherits is a quantity", () => {
  const registry = createQuantityRegistry([moduleOf("rays.trace")]);
  for (const id of [
    "constructor",
    "toString",
    "__proto__",
    "hasOwnProperty",
    "rays",
    "rays.trace ",
    "Rays.Trace",
    "",
  ]) {
    assert.equal(registry.has(id), false, id);
    assert.equal(registry.get(id), undefined, id);
  }
});

// ── A module from the contract's schema files ────────────────────────────────────────────────────────────────────

test("schemaQuantity refuses an id that is no quantity id, a bad version and a quantity without schemas", () => {
  for (const id of ["selftest", "Selftest.Echo", "selftest.", ".echo", "selftest echo", ""]) {
    assert.throws(
      () => schemaQuantity(id, 1),
      { message: `quantity ${JSON.stringify(id)}: not a dotted quantity id such as rays.trace` },
      id,
    );
  }
  for (const version of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(
      () => schemaQuantity(SELFTEST_ECHO, version),
      { message: `quantity selftest.echo: version must be an integer of at least 1, got ${version}` },
      String(version),
    );
  }
  assert.throws(() => schemaQuantity("rays.trace", 1), {
    message: "quantity rays.trace: the contract has no schema quantities/rays.trace.spec.schema.json",
  });
});

test("a module made from the schema files is frozen and validates against exactly those files", () => {
  const module = schemaQuantity(SELFTEST_ECHO, 3);
  assert.equal(module.id, "selftest.echo");
  assert.equal(module.version, 3);
  assert.ok(Object.isFrozen(module));

  const { spec, data } = SELFTEST_ECHO_EXAMPLES.matrix;
  const schemas = contractSchemas();
  for (const value of [spec, data, {}, null, [spec], edited(spec, "/scale", "2"), edited(data, "/sum", REMOVE)]) {
    assert.deepEqual(module.validateSpec(value), validate(schemas, quantitySchemaId(SELFTEST_ECHO, "spec"), value));
    assert.deepEqual(module.validateData(value), validate(schemas, quantitySchemaId(SELFTEST_ECHO, "data"), value));
  }
});

// ── selftest.echo ────────────────────────────────────────────────────────────────────────────────────────────────

test("selftest.echo is registered, at the version the contract states", () => {
  assert.equal(SELFTEST_ECHO, "selftest.echo");
  assert.equal(SELFTEST_ECHO_VERSION, 1);
  assert.equal(QUANTITIES.has("selftest.echo"), true);
  assert.equal(QUANTITIES.get("selftest.echo"), selftestEchoQuantity);
  assert.equal(selftestEchoQuantity.id, "selftest.echo");
  assert.equal(selftestEchoQuantity.version, 1);
  assert.ok(QUANTITIES.list().includes(selftestEchoQuantity));
});

test("the comparator's own quantities can be looked up and listed, and not added to", () => {
  assert.deepEqual(Object.keys(QUANTITIES).sort(), ["get", "has", "list"]);
  assert.ok(Object.isFrozen(QUANTITIES));
});

test("selftest.echo accepts its examples and names what is wrong with anything else", () => {
  const { validateSpec, validateData } = selftestEchoQuantity;
  for (const [name, { spec, data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    assert.deepEqual(validateSpec(spec), [], name);
    assert.deepEqual(validateData(data), [], name);
  }
  const { spec, data } = SELFTEST_ECHO_EXAMPLES.matrix;
  const found = (issues: { path: string; keyword: string }[]): string[] =>
    issues.map(({ path, keyword }) => `${path} ${keyword}`.trim());

  // A spec is not data, and data is not a spec.
  assert.deepEqual(found(validateSpec(data)), ["required", "/sum additionalProperties"]);
  assert.deepEqual(found(validateData(spec)), ["required", "/scale additionalProperties"]);
  assert.deepEqual(found(validateSpec({})), ["required", "required"]);
  assert.deepEqual(found(validateSpec(edited(spec, "/scale", null))), ["/scale type"]);
  assert.deepEqual(found(validateSpec(edited(spec, "/values/$nd/dtype", "u1"))), ["/values/$nd/dtype const"]);
  assert.deepEqual(found(validateData(edited(data, "/sum", null))), []);
  assert.deepEqual(found(validateData(edited(data, "/sum", "0"))), ["/sum type"]);
  // A number that JSON cannot carry is refused before the schema is consulted.
  assert.deepEqual(found(validateSpec(edited(spec, "/scale", Infinity))), ["/scale finite"]);
  assert.deepEqual(found(validateData(edited(data, "/sum", NaN))), ["/sum finite"]);
  assert.deepEqual(found(validateSpec(undefined)), ["json"]);
});
