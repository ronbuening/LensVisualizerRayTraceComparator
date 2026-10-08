// The comparator of `paraxial.first-order`: the largest difference over the compared values and the lines, where
// it is, a pupil's position on the scale of its distance from the image plane, and the values that are only
// recorded.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric } from "../../src/compare/comparator.ts";
import { compareGroup } from "../../src/compare/group.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { paraxialFirstOrderComparator } from "../../src/compare/paraxialFirstOrder.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import {
  FIRST_ORDER_VALUES,
  PUPIL_DISTANCE_SCALE_MM,
  PUPIL_POSITIONS,
} from "../../src/contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../../src/contract/quantities/paraxialFirstOrder.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { FIRST_ORDER_DATA_SINGLET, FIRST_ORDER_DATA_TWO_LINES, SINGLET_CASE } from "../contract/corpus.ts";

const R1 = loadPolicy().rungs.r1;
/** Two lines, with an exit pupil at infinity at the second, and two recorded values. */
const BASE: ParaxialFirstOrderData = FIRST_ORDER_DATA_TWO_LINES;
/** The case the answers are about, as far as the comparator reads it: its image plane, at z = 100 mm. */
const CONTEXT: ComparisonContext = { opticalCase: SINGLET_CASE };
const IMAGE_Z = SINGLET_CASE.conditions.imageZ;

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

/** The metrics of two answers, by name; fails the test when they are not comparable. */
function metricsOf(a: ParaxialFirstOrderData, b: ParaxialFirstOrderData): Record<string, ComputedMetric> {
  const outcome = paraxialFirstOrderComparator.compare(a, b, CONTEXT);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(paraxialFirstOrderComparator.compare(b, a, CONTEXT), outcome, "swapping the two changes nothing");
  assert.deepEqual(
    outcome.metrics.map((metric) => metric.name),
    ["firstOrder.maxAbs", "pupilZ.maxScaled", "pupilZ.maxAbs"],
  );
  return Object.fromEntries(outcome.metrics.map((metric) => [metric.name, metric]));
}

function participant(engine: string, data: ParaxialFirstOrderData): ParticipantResult {
  return { engine, fingerprint: `${engine} sources`, status: "ok", data };
}

/** Two answers judged by the policy of R1, with the case at hand. */
function judged(a: ParaxialFirstOrderData, b: ParaxialFirstOrderData) {
  return comparePair(participant("ref", a), participant("lv", b), R1, paraxialFirstOrderComparator, undefined, CONTEXT);
}

test("the comparator reports three metrics, in mm: the plain values, and a pupil's position plain and scaled", () => {
  assert.equal(paraxialFirstOrderComparator.quantity, "paraxial.first-order");
  assert.equal(paraxialFirstOrderComparator.rung, undefined);
  assert.deepEqual(paraxialFirstOrderComparator.metrics, [
    { name: "firstOrder.maxAbs", unit: "mm" },
    { name: "pupilZ.maxScaled", unit: "mm" },
    { name: "pupilZ.maxAbs", unit: "mm" },
  ]);
  assert.deepEqual([...PUPIL_POSITIONS], ["entrancePupilZ", "exitPupilZ"]);
  assert.equal(PUPIL_DISTANCE_SCALE_MM, 1000);
  assert.equal(IMAGE_Z, 100);
  // An answer equals itself, at the first value and the first line; the same infinity in both is no difference.
  assert.equal(decodeNdArray(BASE.exitPupilZ).values[1], Infinity);
  assert.deepEqual(metricsOf(BASE, structuredClone(BASE)), {
    "firstOrder.maxAbs": { name: "firstOrder.maxAbs", value: 0, where: { quantity: "efl", line: 0 } },
    "pupilZ.maxScaled": { name: "pupilZ.maxScaled", value: 0, where: { quantity: "entrancePupilZ", line: 0 } },
    "pupilZ.maxAbs": { name: "pupilZ.maxAbs", value: 0, where: { quantity: "entrancePupilZ", line: 0 } },
  });
});

test("each metric names the quantity and the line of its largest difference; a pupil's position is not in the plain one", () => {
  for (const quantity of FIRST_ORDER_VALUES) {
    for (const line of [0, 1]) {
      // The exit pupil of the second line is at infinity in the base.
      if (!Number.isFinite(decodeNdArray(BASE[quantity]).values[line])) continue;
      const metrics = metricsOf(
        BASE,
        withValue(BASE, quantity, line, (value) => value + 2 ** -20),
      );
      const moved = { value: 2 ** -20, where: { quantity, line } };
      const still = (first: FirstOrderValue) => ({ value: 0, where: { quantity: first, line: 0 } });
      const pupil = PUPIL_POSITIONS.includes(quantity);
      // A pupil within a metre of the image plane: the scaled difference is the plain one.
      assert.deepEqual(metrics, {
        "firstOrder.maxAbs": { name: "firstOrder.maxAbs", ...(pupil ? still("efl") : moved) },
        "pupilZ.maxScaled": { name: "pupilZ.maxScaled", ...(pupil ? moved : still("entrancePupilZ")) },
        "pupilZ.maxAbs": { name: "pupilZ.maxAbs", ...(pupil ? moved : still("entrancePupilZ")) },
      });
    }
  }
  // Several differences: the largest wins, and the first of two that are equal.
  let several = withValue(BASE, "efl", 1, (value) => value + 2 ** -30);
  several = withValue(several, "backFocus", 0, (value) => value - 2 ** -21);
  several = withValue(several, "exitPupilSemiDiameter", 0, (value) => value + 2 ** -21);
  several = withValue(several, "entrancePupilZ", 1, (value) => value + 2 ** -22);
  several = withValue(several, "exitPupilZ", 0, (value) => value + 2 ** -22);
  const metrics = metricsOf(BASE, several);
  assert.deepEqual(metrics["firstOrder.maxAbs"].where, { quantity: "backFocus", line: 0 });
  assert.equal(metrics["firstOrder.maxAbs"].value, 2 ** -21);
  assert.deepEqual(metrics["pupilZ.maxAbs"].where, { quantity: "entrancePupilZ", line: 1 });
  assert.equal(metrics["pupilZ.maxAbs"].value, 2 ** -22);
});

test("a gate of 1e-9 mm: 2^-30 mm, just below it, passes, and 2^-29 mm, just above it, fails with its place", () => {
  for (const quantity of ["rearFocalZ", "exitPupilZ"] as const) {
    const name = quantity === "exitPupilZ" ? "pupilZ.maxScaled" : "firstOrder.maxAbs";
    const passed = judged(
      FIRST_ORDER_DATA_SINGLET,
      withValue(FIRST_ORDER_DATA_SINGLET, quantity, 0, (value) => value + 2 ** -30),
    );
    assert.equal(passed.verdict, "PASS", quantity);
    assert.equal(passed.reason, undefined);
    assert.deepEqual(
      passed.metrics.find((metric) => metric.name === name),
      { name, value: 2 ** -30, unit: "mm", where: { quantity, line: 0 } },
    );
    const failed = judged(
      BASE,
      withValue(BASE, quantity, 0, (value) => value + 2 ** -29),
    );
    assert.equal(failed.verdict, "FAIL", quantity);
    assert.equal(failed.reason, `${name} 1.86e-9 exceeds its tolerance 1.00e-9 at line 0, quantity ${quantity}`);
  }
});

test("a pupil metres from the image plane is judged as a fraction of its distance: 1e-12 of it passes", () => {
  // An exit pupil 20 m behind the image plane, and an entrance pupil 5 m in front of it.
  const far = withValue(withValue(BASE, "exitPupilZ", 0, IMAGE_Z + 20000), "entrancePupilZ", 0, IMAGE_Z - 5000);
  // 8e-9 mm on 20 m is 4e-13 of the distance: on the scale of the distance, 4e-10 mm.
  const near = metricsOf(
    far,
    withValue(far, "exitPupilZ", 0, (value) => value + 2 ** -27),
  );
  assert.equal(near["pupilZ.maxAbs"].value, 2 ** -27);
  assert.ok(near["pupilZ.maxAbs"].value > 1e-9);
  // The farther of the two answers sets the scale: 20 000 mm and 2^-27 mm more, over 1000 mm.
  assert.equal(near["pupilZ.maxScaled"].value, 2 ** -27 / ((20000 + 2 ** -27) / 1000));
  assert.ok(near["pupilZ.maxScaled"].value < 4e-10);
  assert.deepEqual(near["pupilZ.maxScaled"].where, { quantity: "exitPupilZ", line: 0 });
  assert.equal(
    judged(
      far,
      withValue(far, "exitPupilZ", 0, (value) => value + 2 ** -27),
    ).verdict,
    "PASS",
  );

  // The gate on that scale is 1e-12 of the distance: 2e-8 mm at 20 m. Just below it passes, just above it fails.
  const below = judged(
    far,
    withValue(far, "exitPupilZ", 0, (value) => value + 1.9e-8),
  );
  assert.equal(below.verdict, "PASS");
  const above = judged(
    far,
    withValue(far, "exitPupilZ", 0, (value) => value + 2.1e-8),
  );
  assert.equal(above.verdict, "FAIL");
  assert.match(
    above.reason ?? "",
    /^pupilZ\.maxScaled 1\.05e-9 exceeds its tolerance 1\.00e-9 at line 0, quantity exitPupilZ$/,
  );
  // The plain figure is reported beside the scaled one, and not judged.
  assert.ok(Math.abs((above.metrics.find((metric) => metric.name === "pupilZ.maxAbs")?.value ?? 0) - 2.1e-8) < 1e-11);

  // The entrance pupil, 5 m in front of the image plane: 5e-9 mm is its gate.
  assert.equal(
    judged(
      far,
      withValue(far, "entrancePupilZ", 0, (value) => value - 4.5e-9),
    ).verdict,
    "PASS",
  );
  assert.equal(
    judged(
      far,
      withValue(far, "entrancePupilZ", 0, (value) => value - 5.5e-9),
    ).verdict,
    "FAIL",
  );

  // Only a pupil's position is scaled. The radius of a far pupil, and a focal point as far away, keep 1e-9 mm.
  for (const quantity of ["exitPupilSemiDiameter", "rearFocalZ"] as const) {
    const moved = judged(withValue(far, quantity, 0, 20000), withValue(far, quantity, 0, 20000 + 2 ** -27));
    assert.equal(moved.verdict, "FAIL", quantity);
    assert.match(moved.reason ?? "", /^firstOrder\.maxAbs 7\.45e-9 exceeds its tolerance 1\.00e-9/);
  }
  // Within a metre of the image plane nothing is scaled: 1e-8 mm on an ordinary pupil fails as it always did.
  const ordinary = judged(
    BASE,
    withValue(BASE, "exitPupilZ", 0, (value) => value + 1e-8),
  );
  assert.equal(ordinary.verdict, "FAIL");
  assert.match(ordinary.reason ?? "", /^pupilZ\.maxScaled 1\.00e-8 exceeds its tolerance 1\.00e-9/);
  // A wrong pupil is never excused by being far: one answer at 20 m and the other at 30 m differ by a third.
  const wrong = metricsOf(far, withValue(far, "exitPupilZ", 0, IMAGE_Z + 30000));
  assert.equal(wrong["pupilZ.maxScaled"].value, 10000 / 30);
});

test("the same infinity is no difference; an infinity against a number is one, and a NaN is never a value", () => {
  // A pupil at infinity in one answer and far away in the other: infinite, plain and scaled.
  const finite = metricsOf(BASE, withValue(BASE, "exitPupilZ", 1, 1e9));
  for (const name of ["pupilZ.maxAbs", "pupilZ.maxScaled"]) {
    assert.deepEqual(finite[name], { name, value: Infinity, where: { quantity: "exitPupilZ", line: 1 } });
  }
  assert.equal(finite["firstOrder.maxAbs"].value, 0);
  // At the other infinity.
  const opposite = metricsOf(BASE, withValue(BASE, "exitPupilZ", 1, -Infinity));
  assert.equal(opposite["pupilZ.maxScaled"].value, Infinity);
  // The radius of a pupil at infinity is no position: it is in the plain metric.
  assert.equal(metricsOf(BASE, withValue(BASE, "exitPupilSemiDiameter", 1, 1e9))["firstOrder.maxAbs"].value, Infinity);
  // A NaN in one answer, or in both, at the first place it occurs; a larger difference after it does not hide it.
  let broken = withValue(BASE, "rearFocalZ", 1, NaN);
  broken = withValue(broken, "backFocus", 0, 5000);
  const one = metricsOf(BASE, broken)["firstOrder.maxAbs"];
  assert.ok(Number.isNaN(one.value));
  assert.deepEqual(one.where, { quantity: "rearFocalZ", line: 1 });
  assert.ok(Number.isNaN(metricsOf(broken, broken)["firstOrder.maxAbs"].value));
  const pupil = metricsOf(BASE, withValue(BASE, "entrancePupilZ", 1, NaN));
  assert.ok(Number.isNaN(pupil["pupilZ.maxScaled"].value) && Number.isNaN(pupil["pupilZ.maxAbs"].value));

  const pair = judged(BASE, broken);
  assert.equal(pair.verdict, "FAIL");
  assert.equal(pair.reason, "firstOrder.maxAbs is NaN at line 1, quantity rearFocalZ");
  const infinite = judged(BASE, withValue(BASE, "exitPupilZ", 1, 1e9));
  assert.equal(infinite.reason, "pupilZ.maxScaled inf exceeds its tolerance 1.00e-9 at line 1, quantity exitPupilZ");
});

test("answers for another number of lines are not comparable, and no two answers are without their case", () => {
  assert.deepEqual(paraxialFirstOrderComparator.compare(BASE, FIRST_ORDER_DATA_SINGLET, CONTEXT), {
    comparable: false,
    reason: "the answers are for different numbers of lines: 2 and 1",
  });
  const withoutCase = {
    comparable: false,
    reason: "the case is not at hand: a pupil is measured from its image plane",
  };
  assert.deepEqual(paraxialFirstOrderComparator.compare(BASE, BASE), withoutCase);
  assert.deepEqual(paraxialFirstOrderComparator.compare(BASE, BASE, { spec: {} }), withoutCase);
  // Judged without the case, the pair is an error that says why: nothing is passed for want of a scale.
  const pair = comparePair(participant("a", BASE), participant("b", BASE), R1, paraxialFirstOrderComparator);
  assert.deepEqual([pair.verdict, pair.reason], ["ERROR", withoutCase.reason]);
});

test("recorded values are never compared: two answers that differ only there differ by 0", () => {
  const other: ParaxialFirstOrderData = {
    ...BASE,
    recorded: { magnification: encodeNdArray(Float64Array.of(7, 8)), xpSD: encodeNdArray(Float64Array.of(1, 2)) },
  };
  for (const metric of Object.values(metricsOf(BASE, other))) assert.equal(metric.value, 0, metric.name);
  for (const metric of Object.values(metricsOf(BASE, { ...BASE, recorded: {} }))) assert.equal(metric.value, 0);
  assert.equal(judged(BASE, other).verdict, "PASS");
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
    context: CONTEXT,
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
