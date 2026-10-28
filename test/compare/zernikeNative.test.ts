// The comparator of `zernike.native` for rung R14b: each field is sorted before a difference is taken, by R5's sorting;
// only a field of two methods is in a figure: the largest coefficient difference with its field and term, and the
// differences of the RMS, the peak to valley and the fit's residual. Every number is synthetic and dyadic.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import {
  CHIEF_LANDING_METRIC,
  COEFFICIENTS_METRIC,
  CONDITION_METRIC,
  zernikeFactsOf,
  zernikeFactsOfRecorded,
  zernikeNativeComparator,
} from "../../src/compare/zernikeNative.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { ZernikeNativeData } from "../../src/contract/quantities/zernikeNative.ts";
import { ZERNIKE_DATA_FRINGE, ZERNIKE_DATA_STANDARD } from "../contract/corpus.ts";

const POLICY: RungPolicy = loadPolicy().rungs.r14b;

function compared(
  a: ZernikeNativeData,
  b: ZernikeNativeData,
  policy: RungPolicy | undefined = POLICY,
): ComparatorOutcome {
  return zernikeNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, { policy });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  return outcome.comparable ? outcome.metrics.find((entry) => entry.name === name) : undefined;
}

/** The corpus's Fringe answer with field 1's third coefficient and its RMS moved. */
function moved(delta: number, base: ZernikeNativeData = ZERNIKE_DATA_FRINGE): ZernikeNativeData {
  const copy = structuredClone(base);
  const field = copy.fields[1];
  const changed = {
    ...field,
    coefficients: field.coefficients.map((value, term) => (term === 2 ? value + delta : value)),
    rmsToChiefWaves: (field.rmsToChiefWaves as number) + delta / 2,
  };
  return {
    ...copy,
    fields: [copy.fields[0], changed],
    method: { name: "comparator-zernike-optiland-wavefront", params: {} },
  };
}

test("fields of two methods: the largest coefficient difference with field and term, and each figure's", () => {
  const delta = 2 ** -30;
  const outcome = compared(ZERNIKE_DATA_FRINGE, moved(delta));
  assert.ok(outcome.comparable);
  assert.deepEqual(metric(outcome, COEFFICIENTS_METRIC), {
    name: COEFFICIENTS_METRIC,
    value: delta,
    where: { field: 10, term: 3 },
  });
  assert.deepEqual(metric(outcome, "rmsToChief.maxAbs"), {
    name: "rmsToChief.maxAbs",
    value: delta / 2,
    where: { field: 10 },
  });
  assert.equal(metric(outcome, "pvToChief.maxAbs")?.value, 0);
  assert.equal(metric(outcome, "fitResidualRms.maxAbs")?.value, 0);
  assert.equal(metric(outcome, CHIEF_LANDING_METRIC)?.value, 0);
  assert.deepEqual(
    ["compared", "data", "numerical", "unavailable"].map((kind) => metric(outcome, `fields.${kind}`)?.value),
    [2, 0, 0, 0],
  );
  assert.deepEqual(compared(moved(delta), ZERNIKE_DATA_FRINGE), outcome);
});

test("an unavailable field is unsupported and a landing apart is data, each in no figure; other asks no comparison", () => {
  const standard = structuredClone(ZERNIKE_DATA_STANDARD);
  const copy = structuredClone(ZERNIKE_DATA_STANDARD);
  const other: ZernikeNativeData = {
    ...copy,
    fields: [{ ...copy.fields[0], imageHeightMm: 2 ** -8 }, copy.fields[1]],
    method: { name: "other", params: {} },
  };
  const limited: RungPolicy = {
    ...POLICY,
    metrics: { ...POLICY.metrics, [CHIEF_LANDING_METRIC]: { unit: "mm", attention: 1e-5 } },
  };
  const outcome = compared(standard, other, limited);
  assert.ok(outcome.comparable);
  assert.deepEqual(
    ["compared", "data", "unavailable"].map((kind) => metric(outcome, `fields.${kind}`)?.value),
    [0, 1, 1],
  );
  assert.equal(metric(outcome, COEFFICIENTS_METRIC), undefined);
  const notes = outcome.notes?.join("; ") ?? "";
  assert.match(notes, /field 0: data, chief-landing-apart \(the chief rays land 3\.91e-3 mm apart\)/);
  assert.match(notes, /field 10: unsupported, no-curve/);
  // Without a limit the same landings are of two methods, and the pair says it set none aside.
  const unlimited = compared(standard, other, undefined);
  assert.equal(metric(unlimited, "fields.compared")?.value, 1);
  assert.match(
    unlimited.comparable ? (unlimited.notes?.join("; ") ?? "") : "",
    /sets no limit on chiefLanding\.maxAbs/,
  );
  for (const changed of [
    { ...ZERNIKE_DATA_FRINGE, ordering: "standard" as const },
    { ...ZERNIKE_DATA_FRINGE, grid: 16 },
    { ...ZERNIKE_DATA_FRINGE, fields: ZERNIKE_DATA_FRINGE.fields.slice(0, 1) },
  ]) {
    assert.equal(compared(ZERNIKE_DATA_FRINGE, changed).comparable, false);
  }
});

test("the recorded values hold every coefficient by its index and repeat the sorting", () => {
  const recorded = zernikeNativeComparator.recorded?.(ZERNIKE_DATA_STANDARD as unknown as JsonObject) ?? {};
  assert.deepEqual(recorded.Z1, [0.125, Number.NaN]);
  assert.deepEqual(recorded.Z4, [0.0625, Number.NaN]);
  assert.deepEqual(recorded.validSamples, [32, 0]);
  ZERNIKE_DATA_STANDARD.fields.forEach((field, index) =>
    assert.deepEqual(zernikeFactsOfRecorded(recorded, index), zernikeFactsOf(field)),
  );
  // Under a limit on the condition, a field above it and one within it: the recorded values sort them as the answer.
  const limit = 2 ** 10;
  const conditioned: ZernikeNativeData = {
    ...ZERNIKE_DATA_FRINGE,
    fields: [
      { ...ZERNIKE_DATA_FRINGE.fields[0], fitCondition: 2 ** 5 },
      { ...ZERNIKE_DATA_FRINGE.fields[1], fitCondition: 2 ** 20 },
    ],
  };
  const values = zernikeNativeComparator.recorded?.(conditioned as unknown as JsonObject) ?? {};
  const facts = conditioned.fields.map((field) => zernikeFactsOf(field, limit));
  assert.deepEqual(
    facts.map(({ settled }) => settled),
    [1, 0],
  );
  conditioned.fields.forEach((_, index) =>
    assert.deepEqual(zernikeFactsOfRecorded(values, index, limit), facts[index]),
  );
});

test("a field whose fit an answer states ill-conditioned beyond the limit is numerical, in no figure", () => {
  const conditioned = (condition: number): ZernikeNativeData => ({
    ...ZERNIKE_DATA_FRINGE,
    fields: [ZERNIKE_DATA_FRINGE.fields[0], { ...ZERNIKE_DATA_FRINGE.fields[1], fitCondition: condition }],
  });
  const limited: RungPolicy = {
    ...POLICY,
    metrics: { ...POLICY.metrics, [CONDITION_METRIC]: { unit: "1", attention: 2 ** 10 } },
  };
  const outcome = compared(ZERNIKE_DATA_FRINGE, moved(2 ** -30, conditioned(2 ** 20)), limited);
  assert.ok(outcome.comparable);
  assert.deepEqual(
    ["compared", "data", "numerical", "unavailable"].map((kind) => metric(outcome, `fields.${kind}`)?.value),
    [1, 0, 1, 0],
  );
  assert.deepEqual(metric(outcome, CONDITION_METRIC), { name: CONDITION_METRIC, value: 2 ** 20, where: { field: 10 } });
  // The moved coefficient is of the field set aside: what is left differs in nothing.
  assert.equal(metric(outcome, COEFFICIENTS_METRIC)?.value, 0);
  assert.match(
    outcome.notes?.join("; ") ?? "",
    /field 10: numerical, unconverged \(comparator-zernike-optiland-wavefront: normal equations of condition 1048576, above 1024\)/,
  );
  // Without a limit the field is of two methods, and the pair says so.
  const unlimited = compared(ZERNIKE_DATA_FRINGE, moved(2 ** -30, conditioned(2 ** 20)), undefined);
  assert.equal(metric(unlimited, "fields.compared")?.value, 2);
  assert.match(unlimited.comparable ? (unlimited.notes?.join("; ") ?? "") : "", /sets no limit on fitCondition\.max/);
});
