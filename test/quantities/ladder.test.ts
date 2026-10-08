// The quantities of rungs R0 and R1: registered, validated by their schema files, and held to the rules those
// files cannot state.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  AFOCAL_SYSTEM,
  FIRST_ORDER_VALUES,
  LINEAR_SAG_TERM,
  PARAXIAL_FIRST_ORDER,
  PARAXIAL_FIRST_ORDER_VERSION,
} from "../../src/contract/quantities/paraxialFirstOrder.ts";
import {
  DEFAULT_SAG_FRACTIONS,
  SYSTEM_DESCRIBE,
  SYSTEM_DESCRIBE_VERSION,
} from "../../src/contract/quantities/systemDescribe.ts";
import { contractSchemas, quantitySchemaId } from "../../src/contract/schemas.ts";
import { validate } from "../../src/contract/validate.ts";
import type { ValidationIssue } from "../../src/contract/validate.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { INVARIANT_KEYWORD, invariantIssue, schemaQuantity } from "../../src/quantities/module.ts";
import { paraxialFirstOrderQuantity } from "../../src/quantities/paraxialFirstOrder.ts";
import { systemDescribeQuantity } from "../../src/quantities/systemDescribe.ts";
import {
  DESCRIBE_DATA_ASPHERE,
  DESCRIBE_DATA_SINGLET,
  FIRST_ORDER_DATA_SINGLET,
  FIRST_ORDER_DATA_TWO_LINES,
  edited,
} from "../contract/corpus.ts";

/** Issues as `<path> <keyword>`, which is all of an issue that every implementation agrees on. */
function found(issues: readonly ValidationIssue[]): string[] {
  return issues.map(({ path, keyword }) => `${path} ${keyword}`.trim());
}

function vector(...values: number[]) {
  return encodeNdArray(Float64Array.from(values));
}

function matrix(rows: number, columns: number) {
  return encodeNdArray(new Float64Array(rows * columns), [rows, columns]);
}

// ── Registration ─────────────────────────────────────────────────────────────────────────────────────────────────

test("system.describe and paraxial.first-order are registered, at the versions the contract states", () => {
  assert.equal(SYSTEM_DESCRIBE, "system.describe");
  assert.equal(PARAXIAL_FIRST_ORDER, "paraxial.first-order");
  assert.equal(QUANTITIES.get("system.describe"), systemDescribeQuantity);
  assert.equal(QUANTITIES.get("paraxial.first-order"), paraxialFirstOrderQuantity);
  assert.deepEqual([systemDescribeQuantity.id, systemDescribeQuantity.version], [SYSTEM_DESCRIBE, 2]);
  assert.deepEqual([paraxialFirstOrderQuantity.id, paraxialFirstOrderQuantity.version], [PARAXIAL_FIRST_ORDER, 1]);
  // Version 2 echoes the inner clip radius of every surface.
  assert.equal(SYSTEM_DESCRIBE_VERSION, 2);
  assert.equal(PARAXIAL_FIRST_ORDER_VERSION, 1);
  assert.deepEqual(
    QUANTITIES.list().map(({ id }) => id),
    ["mtf.native", "paraxial.first-order", "rays.trace", "selftest.echo", "system.describe"],
  );
});

test("the default sag fractions are nine eighths from 0 to 1, and the compared first-order values are ten", () => {
  assert.deepEqual(
    DEFAULT_SAG_FRACTIONS,
    Array.from({ length: 9 }, (_unused, step) => step / 8),
  );
  assert.ok(Object.isFrozen(DEFAULT_SAG_FRACTIONS));
  assert.deepEqual(systemDescribeQuantity.validateSpec({ sagFractions: DEFAULT_SAG_FRACTIONS }), []);
  assert.deepEqual(FIRST_ORDER_VALUES, [
    "efl",
    "frontFocalZ",
    "rearFocalZ",
    "frontPrincipalZ",
    "rearPrincipalZ",
    "backFocus",
    "entrancePupilZ",
    "exitPupilZ",
    "entrancePupilSemiDiameter",
    "exitPupilSemiDiameter",
  ]);
  // Every compared value is a required member of the data, and the only other one is `recorded`.
  const schema = contractSchemas().targets.get(quantitySchemaId(PARAXIAL_FIRST_ORDER, "data"));
  assert.deepEqual([...(schema?.required ?? [])].sort(), [...FIRST_ORDER_VALUES, "recorded"].sort());
  assert.deepEqual([AFOCAL_SYSTEM, LINEAR_SAG_TERM], ["system.afocal", "surface.asphere.linear-term"]);
});

// ── Invariants ───────────────────────────────────────────────────────────────────────────────────────────────────

test("a quantity's invariants are checked only on what its schema accepts, and reported as issues", () => {
  const seen: unknown[] = [];
  const module = schemaQuantity("selftest.echo", 1, {
    spec: (spec) => {
      seen.push(spec);
      return [invariantIssue("/scale", "the scale of this test must be 1")];
    },
  });
  const spec = { values: vector(1, 2), scale: 2 };
  assert.deepEqual(module.validateSpec(spec), [
    { path: "/scale", keyword: "invariant", message: "the scale of this test must be 1" },
  ]);
  assert.deepEqual(seen, [spec]);
  // A schema issue is the answer by itself: the rule is not asked about a value of another shape.
  assert.deepEqual(found(module.validateSpec({ values: vector(1), scale: "2" })), ["/scale type"]);
  assert.equal(seen.length, 1);
  // The part without a rule is the schema alone.
  assert.deepEqual(module.validateData({ values: vector(1), sum: 1 }), []);
  assert.equal(INVARIANT_KEYWORD, "invariant");
});

test("a system.describe spec's fractions ascend", () => {
  const { validateSpec } = systemDescribeQuantity;
  for (const sagFractions of [[0], [1], [0, 1], [0.25, 0.5, 0.75], [...DEFAULT_SAG_FRACTIONS]]) {
    assert.deepEqual(validateSpec({ sagFractions }), [], String(sagFractions));
  }
  assert.deepEqual(validateSpec({}), []);
  assert.deepEqual(validateSpec({ sagFractions: [0, 1, 0.5] }), [
    { path: "/sagFractions/2", keyword: "invariant", message: "the fractions must ascend: 0.5 follows 1" },
  ]);
  assert.deepEqual(found(validateSpec({ sagFractions: [1, 0.75, 0.5] })), ["/sagFractions/1 invariant"]);
  // What the schema can say, it says: a repeat is uniqueItems, a value beyond 1 maximum.
  assert.deepEqual(found(validateSpec({ sagFractions: [0.5, 0.5] })), ["/sagFractions uniqueItems"]);
  assert.deepEqual(found(validateSpec({ sagFractions: [0, 1.5] })), ["/sagFractions/1 maximum"]);
  // Only the schema file is consulted for that: the same answer as the validator's.
  const spec = { sagFractions: [0, 2] };
  assert.deepEqual(validateSpec(spec), validate(contractSchemas(), quantitySchemaId(SYSTEM_DESCRIBE, "spec"), spec));
});

test("the parts of system.describe data describe one system: one S, one L, one K", () => {
  const { validateData } = systemDescribeQuantity;
  assert.deepEqual(validateData(DESCRIBE_DATA_SINGLET), []);
  assert.deepEqual(validateData(DESCRIBE_DATA_ASPHERE), []);
  const broken = (pointer: string, value: unknown, base: unknown = DESCRIBE_DATA_SINGLET): string[] =>
    found(validateData(edited(base, pointer, value)));

  assert.deepEqual(broken("/stopIndex", 2), ["/stopIndex invariant"]);
  assert.deepEqual(broken("/surfaceCount", 3), [
    "/vertexZ invariant",
    "/curvature invariant",
    "/conic invariant",
    "/clipRadius invariant",
    "/innerClipRadius invariant",
    "/indexAfterSurface invariant",
    "/sagRadii invariant",
    "/terms invariant",
  ]);
  assert.deepEqual(broken("/vertexZ", vector(0, 4, 9)), ["/vertexZ invariant"]);
  assert.deepEqual(broken("/clipRadius", vector(10)), ["/clipRadius invariant"]);
  assert.deepEqual(broken("/innerClipRadius", vector(0, 0, 0)), ["/innerClipRadius invariant"]);
  // The index table has a row per line, of which there is at least one, and a column per surface.
  assert.deepEqual(broken("/indexAfterSurface", matrix(1, 3)), ["/indexAfterSurface invariant"]);
  assert.deepEqual(broken("/indexAfterSurface", matrix(0, 2)), ["/indexAfterSurface invariant"]);
  assert.deepEqual(broken("/indexAfterSurface", matrix(6, 2)), []);
  // The sag has the shape of its radii: a row per surface and at least one radius.
  assert.deepEqual(broken("/sag", matrix(2, 2)), ["/sag invariant"]);
  assert.deepEqual(broken("/sagRadii", matrix(3, 3)), ["/sagRadii invariant", "/sag invariant"]);
  assert.deepEqual(broken("/sagRadii", matrix(2, 0)), ["/sagRadii invariant", "/sag invariant"]);
  assert.deepEqual(broken("/terms", [[]]), ["/terms invariant"]);
  // A surface's terms ascend in power, each power once.
  const descending = [
    { power: 6, coeff: -2e-9 },
    { power: 4, coeff: 1e-6 },
  ];
  assert.deepEqual(broken("/terms/0", descending, DESCRIBE_DATA_ASPHERE), ["/terms/0/1/power invariant"]);
  const twice = [
    { power: 4, coeff: 1e-6 },
    { power: 4, coeff: 2e-6 },
  ];
  assert.deepEqual(broken("/terms/0", twice, DESCRIBE_DATA_ASPHERE), ["/terms/0/1/power invariant"]);
  assert.match(
    validateData(edited(DESCRIBE_DATA_SINGLET, "/vertexZ", vector(0, 4, 9)))[0].message,
    /^its shape is \[3\], expected \[2\] \(surfaces\)$/,
  );
});

test("every array of paraxial.first-order data has one value per line, the recorded ones included", () => {
  const { validateData } = paraxialFirstOrderQuantity;
  assert.deepEqual(validateData(FIRST_ORDER_DATA_SINGLET), []);
  assert.deepEqual(validateData(FIRST_ORDER_DATA_TWO_LINES), []);
  const broken = (pointer: string, value: unknown, base: unknown = FIRST_ORDER_DATA_TWO_LINES): string[] =>
    found(validateData(edited(base, pointer, value)));
  assert.deepEqual(broken("/backFocus", vector(47.25)), ["/backFocus invariant"]);
  assert.deepEqual(broken("/recorded/magnification", vector(-0.25, -0.25, -0.25)), [
    "/recorded/magnification invariant",
  ]);
  // A name with a character a JSON Pointer escapes is escaped in the path of its issue.
  assert.deepEqual(broken("/recorded", { "a/b~c": vector(1) }), ["/recorded/a~1b~0c invariant"]);
  // The length of efl is the number of lines the others are held to; an answer for no line is none.
  assert.deepEqual(broken("/efl", vector(50.25)).length, 11);
  assert.deepEqual(broken("/efl", vector(), FIRST_ORDER_DATA_SINGLET), ["/efl invariant"]);
  // Infinities are values a pupil can have, and are carried bit for bit.
  assert.deepEqual(resultDataProblems(paraxialFirstOrderQuantity, FIRST_ORDER_DATA_TWO_LINES), []);
});

test("data that keeps its schema and breaks an invariant is not stored: resultDataProblems names the issue", () => {
  const data = edited(DESCRIBE_DATA_SINGLET, "/stopIndex", 5);
  assert.deepEqual(resultDataProblems(systemDescribeQuantity, data), [
    "it is not system.describe data: /stopIndex [invariant] 5 is not the index of one of the 2 surfaces",
  ]);
  assert.deepEqual(resultDataProblems(systemDescribeQuantity, DESCRIBE_DATA_ASPHERE), []);
});
