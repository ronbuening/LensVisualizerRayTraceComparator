// Every verdict rule of one pair.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { QuantityComparator } from "../../src/compare/comparator.ts";
import { numberText, whereText } from "../../src/compare/metricText.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { selftestEchoComparator } from "../../src/compare/selftestEcho.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import { BITS, GATED, RECORDED, answered, echoData, ended, fromBits } from "./support.ts";

const ECHO = selftestEchoComparator;
const A = answered("a", [1, 2, 3]);

/** A comparator that reports exactly these metrics, in a made-up unit. */
function reporting(...metrics: { name: string; value: number; where?: Record<string, number | string> }[]) {
  const comparator: QuantityComparator = {
    quantity: "selftest.echo",
    metrics: metrics.map(({ name }) => ({ name, unit: "mm" })),
    compare: () => ({ comparable: true, metrics }),
  };
  return comparator;
}

test("gated: every metric at or below its tolerance is PASS, without a reason", () => {
  const pair = comparePair(A, answered("b", [1, 2, 3 + 4e-13]), GATED, ECHO);
  assert.equal(pair.verdict, "PASS");
  assert.equal(pair.class, "gated");
  assert.equal(pair.reason, undefined);
  assert.deepEqual([pair.a, pair.b], ["a", "b"]);
  assert.deepEqual(
    pair.metrics.map(({ name, unit, where }) => ({ name, unit, where })),
    [
      { name: "values.maxAbs", unit: "1", where: { index: 2 } },
      { name: "sum.abs", unit: "1", where: undefined },
    ],
  );
  assert.ok((pair.metrics[0].value as number) > 0 && (pair.metrics[0].value as number) <= 1e-12);
});

test("gated: a metric exactly at its tolerance passes, and one above it fails with the value and the index", () => {
  const at = comparePair(
    A,
    A,
    GATED,
    reporting({ name: "values.maxAbs", value: 1e-12 }, { name: "sum.abs", value: 0 }),
  );
  assert.equal(at.verdict, "PASS");
  const above = comparePair(A, answered("b", [1, 2.5, 3]), GATED, ECHO);
  assert.equal(above.verdict, "FAIL");
  assert.equal(
    above.reason,
    "sum.abs 5.00e-1 exceeds its tolerance 1.00e-12; values.maxAbs 5.00e-1 exceeds its tolerance 1.00e-12 at index 1",
  );
  assert.deepEqual(above.metrics, [
    { name: "values.maxAbs", value: 0.5, unit: "1", where: { index: 1 } },
    { name: "sum.abs", value: 0.5, unit: "1" },
  ]);
});

test("gated: a NaN metric is FAIL with a reason, and is stored as null", () => {
  const pair = comparePair(
    A,
    { ...A, engine: "b", data: echoData(fromBits(BITS.one, BITS.nan, BITS.one)) },
    GATED,
    ECHO,
  );
  assert.equal(pair.verdict, "FAIL");
  assert.equal(pair.reason, "sum.abs is NaN; values.maxAbs is NaN at index 1");
  assert.deepEqual(pair.metrics, [
    { name: "values.maxAbs", value: null, unit: "1", where: { index: 1 } },
    { name: "sum.abs", value: null, unit: "1" },
  ]);
});

test("gated: an infinite metric is FAIL, named as inf", () => {
  const pair = comparePair(A, answered("b", [1, 2, Infinity]), GATED, ECHO);
  assert.equal(pair.verdict, "FAIL");
  assert.match(pair.reason ?? "", /values\.maxAbs inf exceeds its tolerance 1\.00e-12 at index 2$/);
  assert.equal(pair.metrics[0].value, null);
});

test("gated: the same NaN in both answers is not a difference", () => {
  const special = fromBits(BITS.nanPayload, BITS.inf, BITS.one);
  const pair = comparePair(
    { ...A, data: echoData(special) },
    { ...A, engine: "b", data: echoData(special) },
    GATED,
    ECHO,
  );
  assert.equal(pair.verdict, "PASS");
  assert.deepEqual(
    pair.metrics.map((metric) => metric.value),
    [0, 0],
  );
});

test("recorded: RECORDED within the attention band, ATTENTION outside it; a metric without a band is only kept", () => {
  const near = comparePair(A, answered("b", [1, 2, 3.25]), RECORDED, ECHO);
  assert.equal(near.verdict, "RECORDED");
  assert.equal(near.class, "recorded");
  assert.equal(near.reason, undefined);
  assert.deepEqual(
    near.metrics.map((metric) => metric.value),
    [0.25, 0.25],
  );

  const far = comparePair(A, answered("b", [1, 2, 300]), RECORDED, ECHO);
  assert.equal(far.verdict, "ATTENTION");
  assert.equal(far.reason, "values.maxAbs 297 is outside its attention band 5.00e-1 at index 2");

  const nan = comparePair(A, answered("b", [1, NaN, 3]), RECORDED, ECHO);
  assert.equal(nan.verdict, "ATTENTION");
  assert.equal(nan.reason, "values.maxAbs is NaN at index 1");
});

test("either side unsupported is UNSUPPORTED, whatever the other is, and the reason names the side and the items", () => {
  const none = ended("none", "unsupported", "quantity selftest.echo, feature surface.conic");
  const one = comparePair(A, none, GATED, ECHO);
  assert.deepEqual(one, {
    a: "a",
    b: "none",
    metrics: [],
    class: "gated",
    verdict: "UNSUPPORTED",
    reason: "none is unsupported (quantity selftest.echo, feature surface.conic)",
  });
  assert.equal(comparePair(none, A, RECORDED, ECHO).verdict, "UNSUPPORTED");
  const both = comparePair(none, ended("other", "unsupported"), GATED, ECHO);
  assert.equal(
    both.reason,
    "none is unsupported (quantity selftest.echo, feature surface.conic); other is unsupported",
  );
  // Unsupported is decided before error.
  assert.equal(comparePair(none, ended("broken", "error", "engine-failure"), GATED, ECHO).verdict, "UNSUPPORTED");
});

test("either side error, pending or missing is ERROR, and the reason names the side and the code", () => {
  const cases: [Parameters<typeof ended>, string][] = [
    [["b", "error", "engine-failure"], "b ended as error (engine-failure)"],
    [["b", "error"], "b ended as error"],
    [["b", "pending"], "b is pending"],
    [["b", "missing", "its result is not in the store"], "b has no result (its result is not in the store)"],
  ];
  for (const [side, reason] of cases) {
    const pair = comparePair(A, ended(...side), GATED, ECHO);
    assert.deepEqual(pair, { a: "a", b: "b", metrics: [], class: "gated", verdict: "ERROR", reason });
    assert.equal(comparePair(ended(...side), { ...A, engine: "c" }, RECORDED, ECHO).verdict, "ERROR");
  }
  const both = comparePair(ended("x", "pending"), ended("y", "error", "timeout"), GATED, ECHO);
  assert.equal(both.reason, "x is pending; y ended as error (timeout)");
  // An "ok" participant that carries no data has nothing to compare either.
  const { data: _data, ...empty } = A;
  assert.equal(comparePair(empty, A, GATED, ECHO).reason, "a has no result");
});

test("answers that cannot be compared are ERROR with the comparator's reason", () => {
  const matrix = { ...A, engine: "b", data: echoData(Float64Array.of(1, 2, 3), [1, 3]) };
  assert.deepEqual(comparePair(A, matrix, GATED, ECHO), {
    a: "a",
    b: "b",
    metrics: [],
    class: "gated",
    verdict: "ERROR",
    reason: "the values have different shapes: [3] and [1, 3]",
  });
});

test("a quantity without a comparator, and a judged metric the comparator does not report, are ERROR", () => {
  assert.equal(comparePair(A, A, GATED, undefined).reason, "quantity selftest.echo has no comparator");
  const partial = comparePair(A, A, GATED, reporting({ name: "values.maxAbs", value: 0 }));
  assert.equal(partial.verdict, "ERROR");
  assert.equal(partial.reason, "the comparator of selftest.echo reported no sum.abs");
});

test("a metric the policy does not name is kept, in the comparator's unit, and not judged", () => {
  const comparator = reporting(
    { name: "extra.rms", value: 1e6, where: { field: "14 deg", frequencyPerMm: 40 } },
    { name: "values.maxAbs", value: 0 },
    { name: "sum.abs", value: 0 },
  );
  const pair = comparePair(A, A, GATED, comparator);
  assert.equal(pair.verdict, "PASS");
  assert.deepEqual(pair.metrics[0], {
    name: "extra.rms",
    value: 1e6,
    unit: "mm",
    where: { field: "14 deg", frequencyPerMm: 40 },
  });
});

test("where a failing metric occurs is said with its keys in order", () => {
  const comparator = reporting(
    { name: "values.maxAbs", value: 2, where: { line: 0, field: "14 deg" } },
    { name: "sum.abs", value: 0 },
  );
  assert.equal(
    comparePair(A, A, GATED, comparator).reason,
    "values.maxAbs 2 exceeds its tolerance 1.00e-12 at field 14 deg, line 0",
  );
});

test("a place is worded by the number formatter, in a reason as in a report", () => {
  assert.equal(whereText(undefined), "");
  assert.equal(whereText({}), "");
  assert.equal(whereText({ index: 12 }), " at index 12");
  assert.equal(whereText({ index: 123456789 }), " at index 123456789", "a whole number has no exponent");
  assert.equal(whereText({ y: 0.5, x: -0.25, field: "14 deg" }), " at field 14 deg, x -2.50e-1, y 5.00e-1");
  assert.equal(whereText({ frequencyPerMm: 1e21 }), " at frequencyPerMm 1.00e21");
  const comparator = reporting(
    { name: "values.maxAbs", value: 2, where: { frequencyPerMm: 12.5 } },
    { name: "sum.abs", value: 0 },
  );
  assert.equal(
    comparePair(A, A, GATED, comparator).reason,
    "values.maxAbs 2 exceeds its tolerance 1.00e-12 at frequencyPerMm 1.25e1",
  );
});

test("a metric and a limit are worded as a place is: a whole number in full, so that a count reads as a count", () => {
  assert.deepEqual([0, 3, 123456789, -2].map(numberText), ["0", "3", "123456789", "-2"]);
  assert.deepEqual([2.5, 1e-12, 1e21, NaN, Infinity].map(numberText), ["2.50e0", "1.00e-12", "1.00e21", "NaN", "inf"]);
  const counting: RungPolicy = { ...GATED, metrics: { "values.maxAbs": { tolerance: 0, unit: "elements" } } };
  const comparator = reporting({ name: "values.maxAbs", value: 3, where: { field: "curvature", surface: 4 } });
  assert.equal(
    comparePair(A, A, counting, comparator).reason,
    "values.maxAbs 3 exceeds its tolerance 0 at field curvature, surface 4",
  );
});

test("a rung is judged by the limit of its class alone: a recorded rung by its bands, never by a tolerance", () => {
  const both: RungPolicy = {
    ...RECORDED,
    metrics: {
      "sum.abs": { tolerance: 1e-12, unit: "1" },
      "values.maxAbs": { tolerance: 1e-12, attention: 0.5, unit: "1" },
    },
  };
  // Far above the tolerances, inside the one band there is: written down, with nothing to say.
  const near = comparePair(A, answered("b", [1, 2, 3.25]), both, ECHO);
  assert.equal(near.verdict, "RECORDED");
  assert.equal(near.reason, undefined);
  const far = comparePair(A, answered("b", [1, 2, 300]), both, ECHO);
  assert.equal(far.verdict, "ATTENTION");
  assert.equal(far.reason, "values.maxAbs 297 is outside its attention band 5.00e-1 at index 2");
  // And a gated rung is judged by its tolerance, whatever band stands beside it.
  const gated: RungPolicy = {
    ...GATED,
    metrics: { "sum.abs": { tolerance: 1, attention: 1e-12, unit: "1" }, "values.maxAbs": { tolerance: 1, unit: "1" } },
  };
  assert.equal(comparePair(A, answered("b", [1, 2, 3.25]), gated, ECHO).verdict, "PASS");
});

test("a gated metric without a tolerance is a defect of the policy, not a verdict", () => {
  const broken: RungPolicy = { ...GATED, metrics: { "sum.abs": { unit: "1" } } };
  assert.throws(() => comparePair(A, A, broken, ECHO), {
    message: "policy: metric sum.abs is gated and has no tolerance",
  });
});
