// The comparator of `mtf.native` for rung R4f: the largest difference of two MTF values, where it is, and the
// counts that say whether the two answers are of the same sampling. Every number is synthetic, and exact in binary.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric } from "../../src/compare/comparator.ts";
import { compareGroup } from "../../src/compare/group.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { FIDELITY_SAMPLING, mtfFidelityComparator } from "../../src/compare/mtfFidelity.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import type { MtfNativeData, MtfNativeField } from "../../src/contract/quantities/mtfNative.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { mtfNativeQuantity } from "../../src/quantities/mtfNative.ts";
import { MTF_DATA_FRACTIONS, MTF_SPEC_FRACTIONS } from "../contract/corpus.ts";

const R4F = loadPolicy().rungs.r4f;
/** Three fields at 10 and 30 cycles/mm: one ok, one unconverged, one unavailable. */
const BASE: MtfNativeData = MTF_DATA_FRACTIONS;
const CONTEXT: ComparisonContext = { spec: MTF_SPEC_FRACTIONS };

/** `data` with one field changed. */
function withField(
  data: MtfNativeData,
  index: number,
  change: (field: MtfNativeField) => MtfNativeField,
): MtfNativeData {
  return { ...data, fields: data.fields.map((field, at) => (at === index ? change(field) : field)) };
}

/** `data` with one value of one curve moved by `delta`. */
function moved(
  data: MtfNativeData,
  index: number,
  cut: "sagittal" | "tangential",
  frequency: number,
  delta: number,
): MtfNativeData {
  return withField(data, index, (field) => {
    const { values } = decodeNdArray(field[cut]);
    (values as Float64Array)[frequency] += delta;
    return { ...field, [cut]: encodeNdArray(values) };
  });
}

/** The metrics of two answers, by name; fails the test when they are not comparable. */
function metricsOf(a: MtfNativeData, b: MtfNativeData, context = CONTEXT): Record<string, ComputedMetric> {
  const outcome = mtfFidelityComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(mtfFidelityComparator.compare(b, a, context), outcome, "swapping the two changes nothing");
  return Object.fromEntries(outcome.metrics.map((metric) => [metric.name, metric]));
}

function participant(engine: string, data: MtfNativeData): ParticipantResult {
  return { engine, fingerprint: `${engine} sources`, status: "ok", data };
}

test("the comparator is mtf.native's for r4f, and reports the three metrics the policy judges", () => {
  assert.equal(COMPARATORS.get("mtf.native", "r4f"), mtfFidelityComparator);
  assert.deepEqual([mtfFidelityComparator.quantity, mtfFidelityComparator.rung], ["mtf.native", "r4f"]);
  assert.deepEqual(mtfFidelityComparator.metrics, [
    { name: "mtf.maxAbs", unit: "1" },
    { name: "sampling.mismatches", unit: "elements" },
    { name: "fields.mismatches", unit: "elements" },
  ]);
  assert.deepEqual(FIDELITY_SAMPLING, ["gridSize", "validRays", "blockedRays", "failedRays"]);
  assert.deepEqual(mtfNativeQuantity.validateData(BASE), []);
});

test("an answer against itself is 0 in every metric, and the unavailable field is not a difference", () => {
  const metrics = metricsOf(BASE, BASE);
  assert.deepEqual(metrics["mtf.maxAbs"], {
    name: "mtf.maxAbs",
    value: 0,
    where: { field: 0, cut: "sagittal", frequencyPerMm: 10 },
  });
  assert.deepEqual(metrics["sampling.mismatches"], { name: "sampling.mismatches", value: 0 });
  assert.deepEqual(metrics["fields.mismatches"], { name: "fields.mismatches", value: 0 });
});

test("mtf.maxAbs is the largest difference over fields, cuts and frequencies, with where it is", () => {
  // Three differences, each exact: 1/1024 on axis, 1/256 in the half field's tangential cut at 30, 1/512 beside it.
  let other = moved(BASE, 0, "sagittal", 0, 1 / 1024);
  other = moved(other, 1, "tangential", 1, -1 / 256);
  other = moved(other, 1, "sagittal", 1, 1 / 512);
  const metrics = metricsOf(BASE, other);
  assert.deepEqual(metrics["mtf.maxAbs"], {
    name: "mtf.maxAbs",
    value: 1 / 256,
    where: { field: 0.5, cut: "tangential", frequencyPerMm: 30 },
  });
  assert.equal(metrics["sampling.mismatches"].value, 0);
  assert.equal(metrics["fields.mismatches"].value, 0);
  // Without the request the frequency is named by its index.
  assert.deepEqual(metricsOf(BASE, other, {})["mtf.maxAbs"].where, {
    field: 0.5,
    cut: "tangential",
    frequencyIndex: 1,
  });
  // Of equal differences the first is named: the sagittal cut before the tangential one, the lower frequency first.
  const tie = moved(moved(BASE, 0, "tangential", 0, 1 / 64), 0, "sagittal", 1, 1 / 64);
  assert.deepEqual(metricsOf(BASE, tie)["mtf.maxAbs"].where, { field: 0, cut: "sagittal", frequencyPerMm: 30 });
});

test("sampling.mismatches counts every grid size and ray count that is another number, or stated by one answer only", () => {
  const sampled = (index: number, sampling: Record<string, number>): MtfNativeData =>
    withField(BASE, index, (field) => ({ ...field, sampling }));
  const axis = BASE.fields[0].sampling;
  assert.equal(metricsOf(BASE, sampled(0, { ...axis, gridSize: 64 }))["sampling.mismatches"].value, 1);
  assert.equal(
    metricsOf(BASE, sampled(0, { ...axis, validRays: 813, blockedRays: 211 }))["sampling.mismatches"].value,
    2,
  );
  // A count one answer does not state is a difference; what is no count of the four is not looked at.
  const { failedRays: _failedRays, ...without } = axis;
  assert.equal(metricsOf(BASE, sampled(0, without))["sampling.mismatches"].value, 1);
  assert.equal(
    metricsOf(BASE, sampled(0, { ...axis, gridSizesTraced: 3, maxDelta: 0.5 }))["sampling.mismatches"].value,
    0,
  );
  // Over the fields the differences add up; a field neither answer sampled, the unavailable one, adds none.
  const two = withField(sampled(0, { ...axis, gridSize: 16 }), 1, (field) => ({
    ...field,
    sampling: { ...field.sampling, gridSize: 64, failedRays: 2 },
  }));
  assert.equal(metricsOf(BASE, two)["sampling.mismatches"].value, 3);
  assert.equal(metricsOf(BASE, two)["mtf.maxAbs"].value, 0, "the curves are not what differs");
});

test("fields.mismatches counts the fields of another status or another reason, and such a field has no curve to compare", () => {
  const nan = encodeNdArray(Float64Array.of(NaN, NaN));
  const lost = withField(BASE, 0, (field) => ({
    ...field,
    sagittal: nan,
    tangential: nan,
    status: "unavailable",
    reason: "vignetted",
  }));
  const metrics = metricsOf(BASE, lost);
  assert.equal(metrics["fields.mismatches"].value, 1);
  // The half field still has curves in both answers, and they are the same.
  assert.deepEqual(metrics["mtf.maxAbs"].where, { field: 0.5, cut: "sagittal", frequencyPerMm: 10 });
  assert.equal(metrics["mtf.maxAbs"].value, 0);
  // Unconverged where the other says ok, and another reason for having no curve: one each.
  assert.equal(
    metricsOf(
      BASE,
      withField(BASE, 1, (field) => ({ ...field, status: "ok" })),
    )["fields.mismatches"].value,
    1,
  );
  const other = withField(BASE, 2, (field) => ({ ...field, reason: "estimator-bad-landing" }));
  assert.equal(metricsOf(BASE, other)["fields.mismatches"].value, 1);
});

test("where no field has curves in both answers, the MTF is not measured, and the counts still are", () => {
  const nan = encodeNdArray(Float64Array.of(NaN, NaN));
  const none: MtfNativeData = {
    ...BASE,
    fields: BASE.fields.map((field) => ({
      ...field,
      sagittal: nan,
      tangential: nan,
      status: "unavailable",
      reason: "vignetted",
      sampling: {},
    })),
  };
  const outcome = mtfFidelityComparator.compare(BASE, none, CONTEXT);
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.unmeasured, [{ name: "mtf.maxAbs", reason: "no field has curves in both answers" }]);
  assert.deepEqual(
    outcome.metrics.map((metric) => [metric.name, metric.value]),
    [
      // Two fields had four counts each in the first answer; the third had none in either.
      ["sampling.mismatches", 8],
      // Two fields lost their curves, and the third has another reason.
      ["fields.mismatches", 3],
    ],
  );
});

test("answers to different requests are not comparable, and the reason quotes only the data", () => {
  const reasonOf = (a: MtfNativeData, b: MtfNativeData): string => {
    const outcome = mtfFidelityComparator.compare(a, b, CONTEXT);
    assert.ok(!outcome.comparable);
    return outcome.reason;
  };
  assert.equal(
    reasonOf(BASE, { ...BASE, fields: BASE.fields.slice(0, 2) }),
    "the answers are for 3 and 2 fields: they answer different requests",
  );
  assert.equal(
    reasonOf(
      BASE,
      withField(BASE, 1, (field) => ({ ...field, field: 0.7 })),
    ),
    "field 1 is 0.5 in one answer and 0.7 in the other",
  );
  assert.equal(
    reasonOf(BASE, { ...BASE, focus: { mode: "best-axial", appliedShiftMm: -0.03125 } }),
    "the answers are of different planes: design at 0 mm and best-axial at -0.03125 mm",
  );
  const longer = withField(BASE, 0, (field) => ({
    ...field,
    sagittal: encodeNdArray(Float64Array.of(0.875, 0.5, 0.25)),
  }));
  assert.equal(reasonOf(BASE, longer), "the sagittal curves of field 0 hold 2 and 3 values");
});

test("each answer's grid sizes and ray counts are recorded beside the comparison, a value a field", () => {
  assert.deepEqual(mtfFidelityComparator.recorded?.(BASE), {
    gridSize: [32, 128, NaN],
    validRays: [812, 11584, NaN],
    blockedRays: [212, 4800, NaN],
    failedRays: [0, 0, NaN],
  });
});

test("the policy judges it: a rounding passes, a difference above 1e-9 fails, and so does any count", () => {
  const pair = (other: MtfNativeData) =>
    comparePair(participant("lv", BASE), participant("replay", other), R4F, mtfFidelityComparator, undefined, CONTEXT);
  const rounding = pair(moved(BASE, 0, "sagittal", 1, 2 ** -40));
  assert.equal(rounding.verdict, "PASS");
  assert.deepEqual(
    rounding.metrics.map((metric) => [metric.name, metric.value, metric.unit]),
    [
      ["mtf.maxAbs", 2 ** -40, "1"],
      ["sampling.mismatches", 0, "elements"],
      ["fields.mismatches", 0, "elements"],
    ],
  );
  const apart = pair(moved(BASE, 1, "tangential", 0, 2 ** -29));
  assert.equal(apart.verdict, "FAIL");
  assert.equal(
    apart.reason,
    "mtf.maxAbs 1.86e-9 exceeds its tolerance 1.00e-9 at cut tangential, field 5.00e-1, frequencyPerMm 10",
  );
  const coarser = pair(withField(BASE, 0, (field) => ({ ...field, sampling: { ...field.sampling, gridSize: 16 } })));
  assert.equal(coarser.verdict, "FAIL");
  assert.equal(coarser.reason, "sampling.mismatches 1 exceeds its tolerance 0");
  const status = pair(withField(BASE, 1, (field) => ({ ...field, status: "ok" })));
  assert.equal(status.reason, "fields.mismatches 1 exceeds its tolerance 0");

  // As a set of the contract: the two engines, their recorded samplings, and the one pair.
  const set = compareGroup(
    {
      suite: "fidelity",
      run: "a-run",
      caseId: "c".repeat(64),
      rung: "r4f",
      quantity: "mtf.native",
      requestId: "d".repeat(64),
      participants: [participant("replay", BASE), participant("lv", BASE)],
      policy: R4F,
      comparator: mtfFidelityComparator,
      context: CONTEXT,
    },
    "pairwise",
  );
  assert.deepEqual(validateKind("comparison", set), []);
  assert.deepEqual(comparisonInvariantProblems(set), []);
  assert.deepEqual(
    set.pairs.map((each) => [each.a, each.b, each.verdict]),
    [["lv", "replay", "PASS"]],
  );
  // A value that is no number is recorded as null.
  assert.deepEqual(set.participants[0].recorded?.gridSize, [32, 128, null]);
});
