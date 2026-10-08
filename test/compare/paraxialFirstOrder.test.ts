// The comparator of `paraxial.first-order`: the largest difference over the compared values and the lines, where
// it is, and the values that are only recorded.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComputedMetric } from "../../src/compare/comparator.ts";
import { compareGroup } from "../../src/compare/group.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { paraxialFirstOrderComparator } from "../../src/compare/paraxialFirstOrder.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import { FIRST_ORDER_VALUES } from "../../src/contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../../src/contract/quantities/paraxialFirstOrder.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { FIRST_ORDER_DATA_SINGLET, FIRST_ORDER_DATA_TWO_LINES } from "../contract/corpus.ts";

const R1 = loadPolicy().rungs.r1;
/** Two lines, with an exit pupil at infinity at the second, and two recorded values. */
const BASE: ParaxialFirstOrderData = FIRST_ORDER_DATA_TWO_LINES;

/** `data` with the value of one compared quantity at one line replaced, or moved by `change`. */
function withValue(
  data: ParaxialFirstOrderData,
  quantity: FirstOrderValue,
  line: number,
  change: number | ((value: number) => number),
): ParaxialFirstOrderData {
  const decoded = decodeNdArray(data[quantity]);
  decoded.values[line] = typeof change === "number" ? change : change(decoded.values[line] as number);
  return { ...data, [quantity]: encodeNdArray(decoded.values, decoded.shape) };
}

/** The one metric of two answers; fails the test when they are not comparable. */
function metricOf(a: ParaxialFirstOrderData, b: ParaxialFirstOrderData): ComputedMetric {
  const outcome = paraxialFirstOrderComparator.compare(a, b);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(paraxialFirstOrderComparator.compare(b, a), outcome, "swapping the two changes nothing");
  assert.equal(outcome.metrics.length, 1);
  return outcome.metrics[0];
}

function participant(engine: string, data: ParaxialFirstOrderData): ParticipantResult {
  return { engine, fingerprint: `${engine} sources`, status: "ok", data };
}

test("the comparator reports one metric, in mm: the largest difference of any compared value at any line", () => {
  assert.equal(paraxialFirstOrderComparator.quantity, "paraxial.first-order");
  assert.deepEqual(paraxialFirstOrderComparator.metrics, [{ name: "firstOrder.maxAbs", unit: "mm" }]);
  // An answer equals itself, at the first value and the first line; the same infinity in both is no difference.
  assert.equal(decodeNdArray(BASE.exitPupilZ).values[1], Infinity);
  assert.deepEqual(metricOf(BASE, structuredClone(BASE)), {
    name: "firstOrder.maxAbs",
    value: 0,
    where: { quantity: "efl", line: 0 },
  });
});

test("the metric names the quantity and the line of the largest difference, whichever they are", () => {
  for (const quantity of FIRST_ORDER_VALUES) {
    for (const line of [0, 1]) {
      // The exit pupil of the second line is at infinity in the base.
      if (!Number.isFinite(decodeNdArray(BASE[quantity]).values[line])) continue;
      const moved = withValue(BASE, quantity, line, (value) => value + 2 ** -20);
      assert.deepEqual(metricOf(BASE, moved), {
        name: "firstOrder.maxAbs",
        value: 2 ** -20,
        where: { quantity, line },
      });
    }
  }
  // Several differences: the largest wins, and the first of two that are equal.
  let several = withValue(BASE, "efl", 1, (value) => value + 2 ** -30);
  several = withValue(several, "backFocus", 0, (value) => value - 2 ** -21);
  several = withValue(several, "entrancePupilZ", 1, (value) => value + 2 ** -21);
  assert.deepEqual(metricOf(BASE, several).where, { quantity: "backFocus", line: 0 });
  assert.equal(metricOf(BASE, several).value, 2 ** -21);
});

test("a gate of 1e-9 mm: 2^-30 mm, just below it, passes, and 2^-29 mm, just above it, fails with its place", () => {
  const pass = withValue(FIRST_ORDER_DATA_SINGLET, "exitPupilZ", 0, (value) => value + 2 ** -30);
  const passed = comparePair(
    participant("ref", FIRST_ORDER_DATA_SINGLET),
    participant("lv", pass),
    R1,
    paraxialFirstOrderComparator,
  );
  assert.equal(passed.verdict, "PASS");
  assert.deepEqual(passed.metrics, [
    { name: "firstOrder.maxAbs", value: 2 ** -30, unit: "mm", where: { quantity: "exitPupilZ", line: 0 } },
  ]);

  const fail = withValue(BASE, "exitPupilZ", 0, (value) => value + 2 ** -29);
  const failed = comparePair(participant("ref", BASE), participant("lv", fail), R1, paraxialFirstOrderComparator);
  assert.equal(failed.verdict, "FAIL");
  assert.equal(failed.reason, "firstOrder.maxAbs 1.86e-9 exceeds its tolerance 1.00e-9 at line 0, quantity exitPupilZ");
});

test("the same infinity is no difference; an infinity against a number is one, and a NaN is never a value", () => {
  // A pupil at infinity in one answer and far away in the other.
  const finite = metricOf(BASE, withValue(BASE, "exitPupilZ", 1, 1e9));
  assert.deepEqual(finite, { name: "firstOrder.maxAbs", value: Infinity, where: { quantity: "exitPupilZ", line: 1 } });
  // At the other infinity.
  assert.equal(metricOf(BASE, withValue(BASE, "exitPupilZ", 1, -Infinity)).value, Infinity);
  // A NaN in one answer, or in both, at the first place it occurs; a larger difference after it does not hide it.
  let broken = withValue(BASE, "rearFocalZ", 1, NaN);
  broken = withValue(broken, "exitPupilZ", 0, 5000);
  const one = metricOf(BASE, broken);
  assert.ok(Number.isNaN(one.value));
  assert.deepEqual(one.where, { quantity: "rearFocalZ", line: 1 });
  const both = metricOf(broken, broken);
  assert.ok(Number.isNaN(both.value));

  const pair = comparePair(participant("a", BASE), participant("b", broken), R1, paraxialFirstOrderComparator);
  assert.equal(pair.verdict, "FAIL");
  assert.equal(pair.reason, "firstOrder.maxAbs is NaN at line 1, quantity rearFocalZ");
  const infinite = comparePair(
    participant("a", BASE),
    participant("b", withValue(BASE, "exitPupilZ", 1, 1e9)),
    R1,
    paraxialFirstOrderComparator,
  );
  assert.equal(infinite.reason, "firstOrder.maxAbs inf exceeds its tolerance 1.00e-9 at line 1, quantity exitPupilZ");
});

test("answers for another number of lines are not comparable", () => {
  assert.deepEqual(paraxialFirstOrderComparator.compare(BASE, FIRST_ORDER_DATA_SINGLET), {
    comparable: false,
    reason: "the answers are for different numbers of lines: 2 and 1",
  });
});

test("recorded values are never compared: two answers that differ only there differ by 0", () => {
  const other: ParaxialFirstOrderData = {
    ...BASE,
    recorded: { magnification: encodeNdArray(Float64Array.of(7, 8)), xpSD: encodeNdArray(Float64Array.of(1, 2)) },
  };
  assert.equal(metricOf(BASE, other).value, 0);
  assert.equal(metricOf(BASE, { ...BASE, recorded: {} }).value, 0);
  assert.equal(
    comparePair(participant("a", BASE), participant("b", other), R1, paraxialFirstOrderComparator).verdict,
    "PASS",
  );
});

test("the comparator gives an answer's recorded values by name, as the answer has them", () => {
  const recorded = paraxialFirstOrderComparator.recorded?.(BASE);
  assert.deepEqual(recorded, { epZRelStop: [-4.5, -4.5], magnification: [-0.25, -0.2515] });
  assert.deepEqual(paraxialFirstOrderComparator.recorded?.(FIRST_ORDER_DATA_SINGLET), {});
  const odd = { ...BASE, recorded: { xpZ: encodeNdArray(Float64Array.of(NaN, -Infinity)) } };
  const values = paraxialFirstOrderComparator.recorded?.(odd).xpZ ?? [];
  assert.ok(Number.isNaN(values[0]));
  assert.equal(values[1], -Infinity);
});

test("a set states what each answer records, sorted by name, with null for what is not finite", () => {
  const lv: ParaxialFirstOrderData = {
    ...BASE,
    recorded: {
      xpZRelLastSurf: encodeNdArray(Float64Array.of(NaN, -Infinity)),
      epZRelStop: encodeNdArray(Float64Array.of(-4.5, -4.25)),
    },
  };
  const participants: ParticipantResult[] = [
    participant("ref", { ...BASE, recorded: {} }),
    participant("lv", lv),
    { engine: "optiland", fingerprint: null, status: "unsupported", detail: "feature system.afocal" },
  ];
  const group = {
    suite: "ladder",
    run: "one",
    caseId: "c".repeat(64),
    rung: "r1",
    quantity: "paraxial.first-order",
    requestId: "1".repeat(64),
    participants,
    policy: R1,
    comparator: paraxialFirstOrderComparator,
  };
  const set = compareGroup(group, "reference-vs-each", "ref");
  assert.deepEqual(validateKind("comparison", set), []);
  assert.deepEqual(comparisonInvariantProblems(set), []);
  assert.deepEqual(set.participants, [
    {
      engine: "lv",
      fingerprint: "lv sources",
      status: "ok",
      recorded: { epZRelStop: [-4.5, -4.25], xpZRelLastSurf: [null, null] },
    },
    // An engine that did not answer has nothing recorded, and one whose answer records nothing has no member.
    { engine: "optiland", fingerprint: null, status: "unsupported" },
    { engine: "ref", fingerprint: "ref sources", status: "ok" },
  ]);
  assert.deepEqual(Object.keys(set.participants[0].recorded ?? {}), ["epZRelStop", "xpZRelLastSurf"]);
  assert.deepEqual(
    set.pairs.map((pair) => pair.verdict),
    ["PASS", "UNSUPPORTED"],
  );
  // Both modes state the same participants.
  assert.deepEqual(compareGroup(group, "pairwise").participants, set.participants);
  // A quantity whose comparator records nothing never has the member.
  const plain = compareGroup(
    { ...group, comparator: { ...paraxialFirstOrderComparator, recorded: undefined } },
    "pairwise",
  );
  assert.ok(plain.participants.every((each) => each.recorded === undefined));
});
