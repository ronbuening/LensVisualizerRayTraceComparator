// The comparator of `seidel.native` for rung R13b: the two answers are sorted before a difference is taken, by R5's
// sorting with the Lagrange invariant as the landing; only answers of two methods are in a figure, each the difference
// of a sum both state; a sum one answer never states is unmeasured with the engine named; OpticStudio's wave
// coefficients are recorded of each answer. Every number is synthetic and dyadic, so every expected difference is exact.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { classifyNativeField } from "../../src/compare/mtfNative.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import {
  INVARIANT_METRIC,
  SUM_METRICS,
  SURFACES_METRIC,
  TOTAL_SCALED_METRIC,
  seidelFactsOf,
  seidelFactsOfRecorded,
  seidelNativeComparator,
} from "../../src/compare/seidelNative.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { SeidelNativeData } from "../../src/contract/quantities/seidelNative.ts";
import { seidelNativeQuantity } from "../../src/quantities/seidelNative.ts";
import { SEIDEL_DATA_TWO_SURFACES, SEIDEL_DATA_UNAVAILABLE } from "../contract/corpus.ts";

const POLICY: RungPolicy = loadPolicy().rungs.r13b;

/** The corpus's answer as another engine states it: no chromatic sum, and other sums by `delta`. */
function other(delta: number, more: Partial<SeidelNativeData> = {}): SeidelNativeData {
  const base = structuredClone(SEIDEL_DATA_TWO_SURFACES);
  return {
    ...base,
    surfaces: base.surfaces.map((surface) => ({
      ...surface,
      SPHA: (surface.SPHA as number) + delta,
      CLA: null,
      CTR: null,
    })),
    total: { ...base.total, SPHA: (base.total.SPHA as number) + 2 * delta, CLA: null, CTR: null },
    method: { name: "optiland-seidels", params: {} },
    ...more,
  };
}

function compared(
  a: SeidelNativeData,
  b: SeidelNativeData,
  policy: RungPolicy | undefined = POLICY,
): ComparatorOutcome {
  return seidelNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, { policy });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  return outcome.comparable ? outcome.metrics.find((entry) => entry.name === name) : undefined;
}

test("two methods: each total's difference, the scaled total, the largest surface's, and the colour unmeasured", () => {
  const delta = 2 ** -20;
  const b = other(delta);
  assert.deepEqual(seidelNativeQuantity.validateData(b), []);
  const outcome = compared(SEIDEL_DATA_TWO_SURFACES, b);
  assert.ok(outcome.comparable);
  assert.equal(metric(outcome, INVARIANT_METRIC)?.value, 0);
  assert.equal(metric(outcome, "SPHA.maxAbs")?.value, 2 * delta);
  for (const name of ["COMA", "ASTI", "FCUR", "DIST"]) assert.equal(metric(outcome, `${name}.maxAbs`)?.value, 0);
  // The SPHA terms are 0.5 and -0.25 in one answer, 0.5 + delta and -0.25 + delta in the other: what cancels is 0.75
  // and 0.75 + 0 (the larger of the two sums of magnitudes).
  assert.deepEqual(metric(outcome, TOTAL_SCALED_METRIC), {
    name: TOTAL_SCALED_METRIC,
    value: (2 * delta) / 0.75,
    where: { sum: "SPHA" },
  });
  assert.deepEqual(metric(outcome, SURFACES_METRIC), {
    name: SURFACES_METRIC,
    value: delta,
    where: { surface: 0, sum: "SPHA" },
  });
  assert.ok(outcome.comparable && outcome.unmeasured !== undefined);
  assert.deepEqual(
    outcome.unmeasured.map(({ name, reason }) => [name, reason]),
    [
      ["CLA.maxAbs", "optiland-seidels states none"],
      ["CTR.maxAbs", "optiland-seidels states none"],
    ],
  );
  // Swapping the answers changes no value.
  const swapped = compared(b, SEIDEL_DATA_TWO_SURFACES);
  assert.deepEqual(swapped, outcome);
});

test("an answer without sums is unsupported, and invariants apart beyond the limit are data, both in no figure", () => {
  const unavailable = { ...SEIDEL_DATA_UNAVAILABLE, dispersionLines: [1, 2] as [number, number] };
  const none = compared(SEIDEL_DATA_TWO_SURFACES, unavailable);
  assert.ok(none.comparable);
  assert.ok(none.metrics.every((entry) => entry.name !== "SPHA.maxAbs"));
  assert.match(
    none.notes?.join("; ") ?? "",
    /unsupported, no-curve \(synthetic-sums: unavailable \(system\.afocal\)\)/,
  );
  // Invariants 2^-10 apart, beyond a limit of 2^-12 in a policy that sets one.
  const limited: RungPolicy = {
    ...POLICY,
    metrics: { ...POLICY.metrics, [INVARIANT_METRIC]: { unit: "mm", attention: 2 ** -12 } },
  };
  const apart = compared(SEIDEL_DATA_TWO_SURFACES, other(0, { invariant: 1.25 + 2 ** -10 }), limited);
  assert.ok(apart.comparable);
  assert.equal(metric(apart, INVARIANT_METRIC)?.value, 2 ** -10);
  assert.equal(metric(apart, "SPHA.maxAbs"), undefined);
  assert.match(
    apart.notes?.join("; ") ?? "",
    /data, chief-landing-apart \(the Lagrange invariants lie 9\.77e-4 mm apart\)/,
  );
  // Without a limit nothing is set aside, and the pair says so.
  const free: RungPolicy = { ...POLICY, metrics: { ...POLICY.metrics, [INVARIANT_METRIC]: { unit: "mm" } } };
  const unlimited = compared(SEIDEL_DATA_TWO_SURFACES, other(0, { invariant: 1.25 + 2 ** -10 }), free);
  assert.ok(unlimited.comparable);
  assert.equal(metric(unlimited, "SPHA.maxAbs")?.value, 0);
  assert.match(unlimited.notes?.join("; ") ?? "", /sets no limit on invariant\.maxAbs/);
  // Other lines, fields or dispersion lines are no comparison.
  for (const [more, said] of [
    [{ line: { index: 1, wavelengthNm: 587.5 } }, /lines 0 and 1/],
    [{ maxFieldDeg: 10 }, /fields of 10 and 20 degrees/],
    [{ dispersionLines: null }, /dispersion lines/],
  ] as const) {
    const outcome = compared(SEIDEL_DATA_TWO_SURFACES, other(0, more as Partial<SeidelNativeData>));
    assert.ok(!outcome.comparable);
    assert.match(outcome.reason, said);
  }
});

test("the recorded values are the sums and OpticStudio's wave coefficients, and repeat the sorting", () => {
  const recorded = seidelNativeComparator.recorded?.(SEIDEL_DATA_TWO_SURFACES as unknown as JsonObject) ?? {};
  const lambda = 587.5e-6;
  assert.deepEqual(recorded.SPHA, [0.25]);
  assert.deepEqual(recorded.W040, [0.25 / (8 * lambda)]);
  assert.deepEqual(recorded.W131, [0.125 / (2 * lambda)]);
  assert.deepEqual(recorded.W222, [0.0625 / (2 * lambda)]);
  assert.deepEqual(recorded.W220P, [0.125 / (4 * lambda)]);
  assert.deepEqual(recorded.W311, [0.015625 / (2 * lambda)]);
  assert.deepEqual(recorded.W020, [0.25 / (2 * lambda)]);
  assert.deepEqual(recorded.W111, [0.0625 / lambda]);
  assert.deepEqual(recorded.imageSpaceMarginalSlope, [-0.125]);
  const none = seidelNativeComparator.recorded?.(SEIDEL_DATA_UNAVAILABLE as unknown as JsonObject) ?? {};
  assert.ok(Number.isNaN(none.W040[0]) && Number.isNaN(none.settled[0]) && Number.isNaN(none.invariant[0]));
  for (const answer of [SEIDEL_DATA_TWO_SURFACES, SEIDEL_DATA_UNAVAILABLE]) {
    const values = seidelNativeComparator.recorded?.(answer as unknown as JsonObject) ?? {};
    assert.deepEqual(seidelFactsOfRecorded(values), seidelFactsOf(answer));
  }
  const sorting = classifyNativeField(seidelFactsOf(SEIDEL_DATA_TWO_SURFACES), seidelFactsOf(other(0)), true, 1e-9);
  assert.deepEqual([sorting.class, sorting.reason], ["method", "two-methods"]);
});

test("policy 24: the invariant's limit of 3e-14 mm and a band of 8e-15 on the scaled total, which the owner accepted", () => {
  // The owner's decision of 2026-10-28, of the Stage 6.8 measurement: ten times the measured maxima, rounded up.
  assert.deepEqual(POLICY.metrics[INVARIANT_METRIC], { attention: 3e-14, unit: "mm" });
  assert.deepEqual(POLICY.metrics[TOTAL_SCALED_METRIC], { attention: 8e-15, unit: "1" });
  for (const { name } of SUM_METRICS) assert.deepEqual(POLICY.metrics[name], { unit: "mm" }, name);
  assert.deepEqual(POLICY.metrics[SURFACES_METRIC], { unit: "mm" });
  assert.equal(POLICY.class, "recorded");
  const pairOf = (b: SeidelNativeData) =>
    comparePair(
      { engine: "ref-seidel", fingerprint: "a", status: "ok", data: SEIDEL_DATA_TWO_SURFACES as unknown as JsonObject },
      { engine: "optiland", fingerprint: "b", status: "ok", data: b as unknown as JsonObject },
      POLICY,
      seidelNativeComparator,
    );
  // Within: SPHA 2^-52 apart on each surface, 2^-51 in the total, over the 0.75 that cancels: 5.9e-16, inside the band.
  const within = pairOf(other(2 ** -52));
  assert.equal(within.verdict, "RECORDED", within.reason);
  // Above: 2^-45 on each surface, 2^-44 / 0.75 = 7.6e-14 scaled: above the band, ATTENTION.
  const above = pairOf(other(2 ** -45));
  assert.equal(above.verdict, "ATTENTION");
  assert.match(above.reason ?? "", /^total\.maxScaled \S+ is outside its attention band/);
  // An invariant 2^-40 mm off (9.1e-13 mm), beyond the limit: data, in no figure, its pair ATTENTION by the invariant;
  // 2^-52 mm off (2.2e-16 mm), within it: two methods, RECORDED.
  const apart = compared(SEIDEL_DATA_TWO_SURFACES, other(0, { invariant: 1.25 + 2 ** -40 }));
  assert.ok(apart.comparable);
  assert.equal(metric(apart, "SPHA.maxAbs"), undefined);
  assert.match(
    apart.notes?.join("; ") ?? "",
    /data, chief-landing-apart \(the Lagrange invariants lie 9\.09e-13 mm apart\)/,
  );
  const apartPair = pairOf(other(0, { invariant: 1.25 + 2 ** -40 }));
  assert.equal(apartPair.verdict, "ATTENTION");
  assert.match(apartPair.reason ?? "", /^invariant\.maxAbs \S+ is outside its attention band/);
  const close = pairOf(other(0, { invariant: 1.25 + 2 ** -52 }));
  assert.equal(close.verdict, "RECORDED", close.reason);
  assert.equal(
    metric(compared(SEIDEL_DATA_TWO_SURFACES, other(0, { invariant: 1.25 + 2 ** -52 })), "SPHA.maxAbs")?.value,
    0,
  );
});
