// The comparator of `selftest.echo`, and the comparator lookup.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createComparatorLookup } from "../../src/compare/comparator.ts";
import type { ComputedMetric } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { mtfNativeComparator } from "../../src/compare/mtfNative.ts";
import { selftestEchoComparator } from "../../src/compare/selftestEcho.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { SELFTEST_ECHO_EXAMPLES } from "../contract/corpus.ts";
import { BITS, echoData, fromBits } from "./support.ts";

function metricsOf(a: JsonObject, b: JsonObject): readonly ComputedMetric[] {
  const outcome = selftestEchoComparator.compare(a, b);
  assert.equal(outcome.comparable, true);
  return outcome.comparable ? outcome.metrics : [];
}

function compare(a: Float64Array, b: Float64Array): readonly ComputedMetric[] {
  return metricsOf(echoData(a), echoData(b));
}

test("the comparator reports the largest element difference with its index, and the difference of the sums", () => {
  const metrics = compare(Float64Array.of(1, 2, 3, 4), Float64Array.of(1, 2.5, 2, 4));
  assert.deepEqual(metrics, [
    { name: "values.maxAbs", value: 1, where: { index: 2 } },
    { name: "sum.abs", value: 0.5 },
  ]);
  assert.deepEqual(
    selftestEchoComparator.metrics.map((metric) => metric.name),
    metrics.map((metric) => metric.name),
  );
});

test("equal answers differ by 0 at the first index; a tie keeps the first index; swapping changes nothing", () => {
  assert.deepEqual(compare(Float64Array.of(5, 6), Float64Array.of(5, 6)), [
    { name: "values.maxAbs", value: 0, where: { index: 0 } },
    { name: "sum.abs", value: 0 },
  ]);
  const a = Float64Array.of(0, 1, 2);
  const b = Float64Array.of(0, 2, 3);
  assert.deepEqual(compare(a, b)[0], { name: "values.maxAbs", value: 1, where: { index: 1 } });
  assert.deepEqual(compare(b, a), compare(a, b));
});

test("two empty arrays differ by 0 and name no index", () => {
  assert.deepEqual(compare(new Float64Array(0), new Float64Array(0)), [
    { name: "values.maxAbs", value: 0 },
    { name: "sum.abs", value: 0 },
  ]);
});

test("the same NaN or infinity in both answers counts as equal, and -0 equals 0", () => {
  const special = fromBits(BITS.nanPayload, BITS.inf, BITS.negInf, BITS.nan, BITS.one);
  const metrics = compare(special, special.slice());
  assert.deepEqual(metrics[0], { name: "values.maxAbs", value: 0, where: { index: 0 } });
  // Neither answer has a finite sum, so the sums do not differ.
  assert.deepEqual(metrics[1], { name: "sum.abs", value: 0 });
  assert.deepEqual(compare(Float64Array.of(-0, 1), Float64Array.of(0, 1))[0].value, 0);
});

test("a value that is not finite in only one answer is a NaN or an infinity at its index", () => {
  const nan = compare(Float64Array.of(1, 2, 3), fromBits(BITS.one, BITS.nan, BITS.inf));
  assert.ok(Number.isNaN(nan[0].value));
  assert.deepEqual(nan[0].where, { index: 1 });
  assert.ok(Number.isNaN(nan[1].value), "one sum is finite and the other is not");

  const inf = compare(Float64Array.of(1, 2, 3), Float64Array.of(1, 2, -Infinity));
  assert.deepEqual(inf[0], { name: "values.maxAbs", value: Infinity, where: { index: 2 } });
});

test("two values that are not finite and differ in their bits are not equal", () => {
  const payloads = compare(fromBits(BITS.one, BITS.nan), fromBits(BITS.one, BITS.nanPayload));
  assert.ok(Number.isNaN(payloads[0].value));
  assert.deepEqual(payloads[0].where, { index: 1 });
  const infinities = compare(fromBits(BITS.inf), fromBits(BITS.negInf));
  assert.deepEqual(infinities[0], { name: "values.maxAbs", value: Infinity, where: { index: 0 } });
  const mixed = compare(fromBits(BITS.inf), fromBits(BITS.nan));
  assert.ok(Number.isNaN(mixed[0].value));
});

test("arrays of different shapes are not comparable, even with the same elements", () => {
  const values = Float64Array.of(1, 2, 3, 4, 5, 6);
  assert.deepEqual(selftestEchoComparator.compare(echoData(values, [2, 3]), echoData(values)), {
    comparable: false,
    reason: "the values have different shapes: [2, 3] and [6]",
  });
  assert.deepEqual(selftestEchoComparator.compare(echoData(values, [2, 3]), echoData(values, [3, 2])), {
    comparable: false,
    reason: "the values have different shapes: [2, 3] and [3, 2]",
  });
  assert.deepEqual(selftestEchoComparator.compare(echoData(values), echoData(values.slice(0, 5))), {
    comparable: false,
    reason: "the values have different shapes: [6] and [5]",
  });
  assert.equal(selftestEchoComparator.compare(echoData(values, [2, 3]), echoData(values, [2, 3])).comparable, true);
});

test("the comparator does not change the data it is given, and every example of the contract equals itself", () => {
  for (const [name, { data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    const before = JSON.stringify(data);
    for (const metric of metricsOf(data, structuredClone(data)))
      assert.equal(metric.value, 0, `${name}: ${metric.name}`);
    assert.equal(JSON.stringify(data), before, name);
  }
});

test("every comparator is of a quantity, and every quantity a rung asks for has one; a lookup is by id, and by rung", () => {
  const compared = COMPARATORS.list().map((comparator) => comparator.quantity);
  const registered = QUANTITIES.list().map((quantity) => quantity.id);
  for (const quantity of compared) assert.ok(registered.includes(quantity), quantity);
  // A quantity without a comparator is one that no rung asks for: it is presented, and not compared. Today there
  // is none. An engine's own MTF has a comparator for each of the four rungs that ask for it, r4f, r5, r5g and r6b,
  // and for no other.
  const presented = registered.filter((quantity) => !compared.includes(quantity));
  assert.deepEqual(presented, []);
  assert.equal(COMPARATORS.get("mtf.native"), undefined);
  assert.equal(COMPARATORS.get("mtf.native", "r5"), mtfNativeComparator);
  assert.equal(COMPARATORS.get("mtf.native", "r6c"), undefined);
  for (const rung of RUNGS) assert.ok(COMPARATORS.get(rung.quantity, rung.id) !== undefined, rung.id);
  assert.equal(COMPARATORS.get("selftest.echo"), selftestEchoComparator);
  assert.equal(COMPARATORS.get("constructor"), undefined);
  assert.throws(() => createComparatorLookup([selftestEchoComparator, selftestEchoComparator]), {
    message: "quantity selftest.echo has two comparators",
  });

  // A comparator that names no rung serves every rung of its quantity; one that names a rung serves that rung,
  // and comes before the general one for it. The list is by quantity and then by rung.
  assert.equal(COMPARATORS.get("selftest.echo", "selftest"), selftestEchoComparator);
  assert.equal(COMPARATORS.get("selftest.echo", "any-rung"), selftestEchoComparator);
  const forOne = { ...selftestEchoComparator, rung: "one" };
  const forTwo = { ...selftestEchoComparator, rung: "two" };
  const lookup = createComparatorLookup([forTwo, selftestEchoComparator, forOne]);
  assert.equal(lookup.get("selftest.echo", "one"), forOne);
  assert.equal(lookup.get("selftest.echo", "two"), forTwo);
  assert.equal(lookup.get("selftest.echo", "three"), selftestEchoComparator);
  assert.equal(lookup.get("selftest.echo"), selftestEchoComparator);
  assert.deepEqual(lookup.list(), [selftestEchoComparator, forOne, forTwo]);
  assert.equal(createComparatorLookup([forOne]).get("selftest.echo", "two"), undefined);
  assert.equal(createComparatorLookup([forOne]).get("selftest.echo"), undefined);
  assert.throws(() => createComparatorLookup([forOne, selftestEchoComparator, { ...forOne }]), {
    message: "quantity selftest.echo has two comparators for the rung one",
  });
  assert.deepEqual(
    COMPARATORS.list().map((comparator) => [comparator.quantity, comparator.rung]),
    [
      ["mtf.native", "r4f"],
      ["mtf.native", "r5"],
      ["mtf.native", "r5g"],
      ["mtf.native", "r6b"],
      ["paraxial.first-order", undefined],
      ["rays.trace", "r2"],
      ["rays.trace", "r3"],
      ["rays.trace", "r4"],
      ["rays.trace", "r6a"],
      ["selftest.echo", undefined],
      ["system.describe", undefined],
    ],
  );
});
