// The comparator of `paraxial.first-order`: the largest difference over the compared values and the lines, where
// it is, a pupil's position and its radius on the scale of its distance from the image plane, and the values that
// are only recorded.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric } from "../../src/compare/comparator.ts";
import { compareGroup } from "../../src/compare/group.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { PUPIL_RADII, paraxialFirstOrderComparator } from "../../src/compare/paraxialFirstOrder.ts";
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
    ["firstOrder.maxAbs", "pupilZ.maxScaled", "pupilZ.maxAbs", "pupilRadius.maxScaled", "pupilRadius.maxAbs"],
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

test("the comparator reports five metrics, in mm: the plain values, and a pupil's position and radius plain and scaled", () => {
  assert.equal(paraxialFirstOrderComparator.quantity, "paraxial.first-order");
  assert.equal(paraxialFirstOrderComparator.rung, undefined);
  assert.deepEqual(paraxialFirstOrderComparator.metrics, [
    { name: "firstOrder.maxAbs", unit: "mm" },
    { name: "pupilZ.maxScaled", unit: "mm" },
    { name: "pupilZ.maxAbs", unit: "mm" },
    { name: "pupilRadius.maxScaled", unit: "mm" },
    { name: "pupilRadius.maxAbs", unit: "mm" },
  ]);
  assert.deepEqual([...PUPIL_POSITIONS], ["entrancePupilZ", "exitPupilZ"]);
  // Each radius with the position of its own pupil: the entrance pupil's radius is never scaled by the exit pupil.
  assert.deepEqual(
    PUPIL_RADII.map((pair) => [...pair]),
    [
      ["entrancePupilSemiDiameter", "entrancePupilZ"],
      ["exitPupilSemiDiameter", "exitPupilZ"],
    ],
  );
  // Every compared value is measured exactly one way: plainly, as a pupil's position or as a pupil's radius.
  const pupils = [...PUPIL_POSITIONS, ...PUPIL_RADII.map(([radius]) => radius)];
  assert.equal(new Set(pupils).size, 4);
  assert.deepEqual(
    FIRST_ORDER_VALUES.filter((value) => !pupils.includes(value)),
    ["efl", "frontFocalZ", "rearFocalZ", "frontPrincipalZ", "rearPrincipalZ", "backFocus"],
  );
  assert.equal(PUPIL_DISTANCE_SCALE_MM, 1000);
  assert.equal(IMAGE_Z, 100);
  // An answer equals itself, at the first value and the first line; the same infinity in both is no difference.
  assert.equal(decodeNdArray(BASE.exitPupilZ).values[1], Infinity);
  assert.equal(decodeNdArray(BASE.exitPupilSemiDiameter).values[1], Infinity);
  const radius = { value: 0, where: { quantity: "entrancePupilSemiDiameter", line: 0 } };
  assert.deepEqual(metricsOf(BASE, structuredClone(BASE)), {
    "firstOrder.maxAbs": { name: "firstOrder.maxAbs", value: 0, where: { quantity: "efl", line: 0 } },
    "pupilZ.maxScaled": { name: "pupilZ.maxScaled", value: 0, where: { quantity: "entrancePupilZ", line: 0 } },
    "pupilZ.maxAbs": { name: "pupilZ.maxAbs", value: 0, where: { quantity: "entrancePupilZ", line: 0 } },
    "pupilRadius.maxScaled": { name: "pupilRadius.maxScaled", ...radius },
    "pupilRadius.maxAbs": { name: "pupilRadius.maxAbs", ...radius },
  });
});

test("each metric names the quantity and the line of its largest difference; a pupil's position and radius are not in the plain one", () => {
  for (const quantity of FIRST_ORDER_VALUES) {
    for (const line of [0, 1]) {
      // The exit pupil of the second line is at infinity in the base, in position and in radius.
      if (!Number.isFinite(decodeNdArray(BASE[quantity]).values[line])) continue;
      const metrics = metricsOf(
        BASE,
        withValue(BASE, quantity, line, (value) => value + 2 ** -20),
      );
      const moved = { value: 2 ** -20, where: { quantity, line } };
      const still = (first: FirstOrderValue) => ({ value: 0, where: { quantity: first, line: 0 } });
      const pupil = PUPIL_POSITIONS.includes(quantity);
      const radius = PUPIL_RADII.some(([name]) => name === quantity);
      // A pupil within a metre of the image plane: the scaled difference is the plain one.
      assert.deepEqual(metrics, {
        "firstOrder.maxAbs": { name: "firstOrder.maxAbs", ...(pupil || radius ? still("efl") : moved) },
        "pupilZ.maxScaled": { name: "pupilZ.maxScaled", ...(pupil ? moved : still("entrancePupilZ")) },
        "pupilZ.maxAbs": { name: "pupilZ.maxAbs", ...(pupil ? moved : still("entrancePupilZ")) },
        "pupilRadius.maxScaled": {
          name: "pupilRadius.maxScaled",
          ...(radius ? moved : still("entrancePupilSemiDiameter")),
        },
        "pupilRadius.maxAbs": { name: "pupilRadius.maxAbs", ...(radius ? moved : still("entrancePupilSemiDiameter")) },
      });
    }
  }
  // Several differences: the largest wins, and the first of two that are equal.
  let several = withValue(BASE, "efl", 1, (value) => value + 2 ** -30);
  several = withValue(several, "backFocus", 0, (value) => value - 2 ** -21);
  several = withValue(several, "rearPrincipalZ", 1, (value) => value + 2 ** -21);
  several = withValue(several, "exitPupilSemiDiameter", 0, (value) => value + 2 ** -19);
  several = withValue(several, "entrancePupilSemiDiameter", 1, (value) => value - 2 ** -19);
  several = withValue(several, "entrancePupilZ", 1, (value) => value + 2 ** -22);
  several = withValue(several, "exitPupilZ", 0, (value) => value + 2 ** -22);
  const metrics = metricsOf(BASE, several);
  // The radius of a pupil, however far off, is no part of the plain metric.
  assert.deepEqual(metrics["firstOrder.maxAbs"].where, { quantity: "rearPrincipalZ", line: 1 });
  assert.equal(metrics["firstOrder.maxAbs"].value, 2 ** -21);
  assert.deepEqual(metrics["pupilZ.maxAbs"].where, { quantity: "entrancePupilZ", line: 1 });
  assert.equal(metrics["pupilZ.maxAbs"].value, 2 ** -22);
  assert.deepEqual(metrics["pupilRadius.maxAbs"].where, { quantity: "entrancePupilSemiDiameter", line: 1 });
  assert.equal(metrics["pupilRadius.maxAbs"].value, 2 ** -19);
  assert.deepEqual(metrics["pupilRadius.maxScaled"], {
    ...metrics["pupilRadius.maxAbs"],
    name: "pupilRadius.maxScaled",
  });
});

test("a gate of 1e-9 mm: 2^-30 mm, just below it, passes, and 2^-29 mm, just above it, fails with its place", () => {
  const judgedBy = {
    rearFocalZ: "firstOrder.maxAbs",
    exitPupilZ: "pupilZ.maxScaled",
    exitPupilSemiDiameter: "pupilRadius.maxScaled",
    entrancePupilSemiDiameter: "pupilRadius.maxScaled",
  } as const;
  for (const quantity of ["rearFocalZ", "exitPupilZ", "exitPupilSemiDiameter", "entrancePupilSemiDiameter"] as const) {
    const name = judgedBy[quantity];
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

  // Only a pupil is scaled. A focal point as far away, and every other value that is no pupil's, keep 1e-9 mm.
  for (const quantity of FIRST_ORDER_VALUES) {
    if (PUPIL_POSITIONS.includes(quantity) || PUPIL_RADII.some(([radius]) => radius === quantity)) continue;
    const moved = judged(withValue(far, quantity, 0, 20000), withValue(far, quantity, 0, 20000 + 2 ** -27));
    assert.equal(moved.verdict, "FAIL", quantity);
    assert.equal(
      moved.reason,
      `firstOrder.maxAbs 7.45e-9 exceeds its tolerance 1.00e-9 at line 0, quantity ${quantity}`,
    );
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

test("the radius of a pupil metres from the image plane is judged on the scale of that distance, as its position is", () => {
  // An exit pupil 20 m behind the image plane and 9 m in radius, and an entrance pupil 5 m in front of it and 2 m
  // in radius: a pupil that far away is as large as it is far.
  let far = withValue(withValue(BASE, "exitPupilZ", 0, IMAGE_Z + 20000), "entrancePupilZ", 0, IMAGE_Z - 5000);
  far = withValue(withValue(far, "exitPupilSemiDiameter", 0, 9000), "entrancePupilSemiDiameter", 0, 2000);
  const off = (quantity: FirstOrderValue, mm: number, from: ParaxialFirstOrderData = far) =>
    withValue(from, quantity, 0, (value) => value + mm);

  // 2^-27 mm, 7.5e-9 mm, on the radius of the far exit pupil: the scale is the pupil's distance, 20 000 mm over
  // 1000 mm, whatever the radius itself is. The plain figure is reported beside the scaled one, and not judged.
  const near = metricsOf(far, off("exitPupilSemiDiameter", 2 ** -27));
  assert.equal(near["pupilRadius.maxAbs"].value, 2 ** -27);
  assert.ok(near["pupilRadius.maxAbs"].value > 1e-9);
  assert.equal(near["pupilRadius.maxScaled"].value, 2 ** -27 / (20000 / PUPIL_DISTANCE_SCALE_MM));
  assert.deepEqual(near["pupilRadius.maxScaled"].where, { quantity: "exitPupilSemiDiameter", line: 0 });
  assert.deepEqual(near["pupilRadius.maxAbs"].where, { quantity: "exitPupilSemiDiameter", line: 0 });
  // Nothing else moved: the position of that pupil and the plain values are where they were.
  for (const name of ["firstOrder.maxAbs", "pupilZ.maxScaled", "pupilZ.maxAbs"])
    assert.equal(near[name].value, 0, name);
  const passed = judged(far, off("exitPupilSemiDiameter", 2 ** -27));
  assert.deepEqual([passed.verdict, passed.reason], ["PASS", undefined]);
  assert.deepEqual(
    passed.metrics.filter((metric) => metric.name.startsWith("pupilRadius.")),
    [
      {
        name: "pupilRadius.maxScaled",
        value: 2 ** -27 / 20,
        unit: "mm",
        where: { quantity: "exitPupilSemiDiameter", line: 0 },
      },
      {
        name: "pupilRadius.maxAbs",
        value: 2 ** -27,
        unit: "mm",
        where: { quantity: "exitPupilSemiDiameter", line: 0 },
      },
    ],
  );

  // The gate on that scale is 1e-12 of the distance: 2e-8 mm at 20 m. Just below it passes, just above it fails.
  assert.equal(judged(far, off("exitPupilSemiDiameter", 1.9e-8)).verdict, "PASS");
  const above = judged(far, off("exitPupilSemiDiameter", 2.1e-8));
  assert.equal(above.verdict, "FAIL");
  assert.equal(
    above.reason,
    "pupilRadius.maxScaled 1.05e-9 exceeds its tolerance 1.00e-9 at line 0, quantity exitPupilSemiDiameter",
  );
  const plain = above.metrics.find((metric) => metric.name === "pupilRadius.maxAbs")?.value ?? 0;
  assert.ok(Math.abs(plain - 2.1e-8) < 1e-11, String(plain));

  // Each radius by the distance of its own pupil. The entrance pupil is 5 m away: 5e-9 mm is the gate of its
  // radius, and the 20 m of the other pupil excuse nothing of it.
  assert.equal(judged(far, off("entrancePupilSemiDiameter", -4.5e-9)).verdict, "PASS");
  const entrance = judged(far, off("entrancePupilSemiDiameter", -5.5e-9));
  assert.equal(entrance.verdict, "FAIL");
  assert.equal(
    entrance.reason,
    "pupilRadius.maxScaled 1.10e-9 exceeds its tolerance 1.00e-9 at line 0, quantity entrancePupilSemiDiameter",
  );
  assert.equal(judged(far, off("entrancePupilSemiDiameter", 1.9e-8)).verdict, "FAIL");
  // The scale is the pupil's distance and not its size: a radius of 9 m at a pupil 300 mm from the image plane, as
  // no lens has it, is held to the plain 1e-9 mm.
  const wide = withValue(BASE, "exitPupilSemiDiameter", 0, 9000);
  const unscaled = metricsOf(wide, off("exitPupilSemiDiameter", 2 ** -27, wide));
  assert.equal(unscaled["pupilRadius.maxScaled"].value, 2 ** -27);
  assert.equal(judged(wide, off("exitPupilSemiDiameter", 2 ** -27, wide)).verdict, "FAIL");

  // A near pupil: within a metre of the image plane the plain gate still bites, and 1e-8 mm on an ordinary pupil
  // radius fails, on either pupil.
  for (const quantity of ["exitPupilSemiDiameter", "entrancePupilSemiDiameter"] as const) {
    const ordinary = judged(BASE, off(quantity, 1e-8, BASE));
    assert.equal(ordinary.verdict, "FAIL", quantity);
    assert.equal(
      ordinary.reason,
      `pupilRadius.maxScaled 1.00e-8 exceeds its tolerance 1.00e-9 at line 0, quantity ${quantity}`,
    );
  }
  // And the pupil of the singlet, at its one line: 2^-29 mm, just above the gate, fails; so does a radius exactly
  // a metre away, where the scale is still 1.
  const atAMetre = withValue(FIRST_ORDER_DATA_SINGLET, "exitPupilZ", 0, IMAGE_Z - PUPIL_DISTANCE_SCALE_MM);
  const metre = metricsOf(atAMetre, off("exitPupilSemiDiameter", 2 ** -29, atAMetre));
  assert.equal(metre["pupilRadius.maxScaled"].value, metre["pupilRadius.maxAbs"].value);
  assert.equal(judged(atAMetre, off("exitPupilSemiDiameter", 2 ** -29, atAMetre)).verdict, "FAIL");

  // The farther of the two answers' positions sets the scale, so that swapping the answers changes nothing: one
  // answer has the pupil at 20 m and the other at 40 m. Its position fails; its radius is scaled by 40.
  const elsewhere = withValue(off("exitPupilSemiDiameter", 2 ** -27), "exitPupilZ", 0, IMAGE_Z + 40000);
  const apart = metricsOf(far, elsewhere);
  assert.equal(apart["pupilRadius.maxScaled"].value, 2 ** -27 / 40);
  assert.equal(apart["pupilZ.maxScaled"].value, 20000 / 40);
  assert.equal(judged(far, elsewhere).verdict, "FAIL");
  // A wrong radius is never excused by being far: 9 m in one answer and 12 m in the other, at 20 m.
  const wrong = metricsOf(far, withValue(far, "exitPupilSemiDiameter", 0, 12000));
  assert.equal(wrong["pupilRadius.maxScaled"].value, 3000 / 20);
  assert.equal(wrong["pupilRadius.maxAbs"].value, 3000);
});

test("a pupil at infinity: the same infinity in both answers is equal, in position and in radius, and nothing else is", () => {
  // The base has its exit pupil at +infinity at the second line, with a radius that is infinite too.
  const [line, at] = [1, { quantity: "exitPupilSemiDiameter", line: 1 }];
  const same = metricsOf(BASE, structuredClone(BASE));
  for (const name of ["pupilZ.maxScaled", "pupilZ.maxAbs", "pupilRadius.maxScaled", "pupilRadius.maxAbs"]) {
    assert.equal(same[name].value, 0, name);
  }
  assert.equal(judged(BASE, structuredClone(BASE)).verdict, "PASS");
  // At the other infinity in both, with every other value as it was: equal again.
  const behind = withValue(BASE, "exitPupilZ", line, -Infinity);
  assert.equal(judged(behind, structuredClone(behind)).verdict, "PASS");
  // At opposite infinities the position differs by an infinity. The radius, which is the same infinity, does not.
  const opposite = metricsOf(BASE, behind);
  assert.equal(opposite["pupilZ.maxScaled"].value, Infinity);
  assert.equal(opposite["pupilRadius.maxScaled"].value, 0);
  assert.equal(judged(BASE, behind).verdict, "FAIL");

  // A radius that is infinite in one answer only is an infinity apart, plain and scaled: no distance excuses it.
  const finite = metricsOf(BASE, withValue(BASE, "exitPupilSemiDiameter", line, 1e9));
  for (const name of ["pupilRadius.maxAbs", "pupilRadius.maxScaled"]) {
    assert.deepEqual(finite[name], { name, value: Infinity, where: at });
  }
  assert.equal(finite["firstOrder.maxAbs"].value, 0);
  const pair = judged(BASE, withValue(BASE, "exitPupilSemiDiameter", line, 1e9));
  assert.equal(
    pair.reason,
    "pupilRadius.maxScaled inf exceeds its tolerance 1.00e-9 at line 1, quantity exitPupilSemiDiameter",
  );

  // Two radii that are numbers, of a pupil that both answers put at infinity: there is no distance to scale by,
  // so the difference is judged as it is. An infinite scale would have passed any two radii.
  const numbered = withValue(BASE, "exitPupilSemiDiameter", line, 5000);
  const other = withValue(numbered, "exitPupilSemiDiameter", line, 5000 + 2 ** -26);
  const unscaled = metricsOf(numbered, other);
  assert.deepEqual(unscaled["pupilRadius.maxScaled"], { name: "pupilRadius.maxScaled", value: 2 ** -26, where: at });
  assert.equal(judged(numbered, other).verdict, "FAIL");
  assert.equal(judged(numbered, withValue(numbered, "exitPupilSemiDiameter", line, 5000 + 2 ** -31)).verdict, "PASS");
  // Nor where only one answer has the pupil at infinity, or where one has no position for it at all.
  for (const position of [IMAGE_Z + 20000, NaN]) {
    const placed = withValue(other, "exitPupilZ", line, position);
    assert.equal(metricsOf(numbered, placed)["pupilRadius.maxScaled"].value, 2 ** -26, String(position));
  }

  // A NaN is never a value: in a radius it makes both metrics of the radius a NaN, and the pair fails.
  const broken = metricsOf(BASE, withValue(BASE, "entrancePupilSemiDiameter", 0, NaN));
  assert.ok(Number.isNaN(broken["pupilRadius.maxScaled"].value) && Number.isNaN(broken["pupilRadius.maxAbs"].value));
  assert.deepEqual(broken["pupilRadius.maxScaled"].where, { quantity: "entrancePupilSemiDiameter", line: 0 });
  assert.equal(
    judged(BASE, withValue(BASE, "entrancePupilSemiDiameter", 0, NaN)).reason,
    "pupilRadius.maxScaled is NaN at line 0, quantity entrancePupilSemiDiameter",
  );
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
  // The radius of a pupil at infinity is no position, and no plain value either: it has metrics of its own.
  const radius = metricsOf(BASE, withValue(BASE, "exitPupilSemiDiameter", 1, 1e9));
  assert.deepEqual([radius["pupilZ.maxScaled"].value, radius["firstOrder.maxAbs"].value], [0, 0]);
  assert.equal(radius["pupilRadius.maxScaled"].value, Infinity);
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
