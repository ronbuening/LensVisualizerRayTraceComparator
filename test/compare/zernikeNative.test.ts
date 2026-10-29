// The comparator of `zernike.native` for rung R14b: each field is sorted before a difference is taken, by R5's sorting;
// only a field of two methods is in a figure: the largest coefficient difference with its field and term, and the
// differences of the RMS, the peak to valley and the fit's residual. Every number is synthetic and dyadic.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import {
  CHIEF_LANDING_METRIC,
  COEFFICIENTS_METRIC,
  CONDITION_METRIC,
  SET_ASIDE_CONDITION_METRIC,
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
  const free: RungPolicy = { ...POLICY, metrics: { ...POLICY.metrics, [CHIEF_LANDING_METRIC]: { unit: "mm" } } };
  const unlimited = compared(standard, other, free);
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
  // The judged condition is of the field of two methods alone; the field set aside shows its own apart.
  assert.deepEqual(metric(outcome, CONDITION_METRIC), { name: CONDITION_METRIC, value: 2.5, where: { field: 0 } });
  assert.deepEqual(metric(outcome, SET_ASIDE_CONDITION_METRIC), {
    name: SET_ASIDE_CONDITION_METRIC,
    value: 2 ** 20,
    where: { field: 10 },
  });
  // The moved coefficient is of the field set aside: what is left differs in nothing.
  assert.equal(metric(outcome, COEFFICIENTS_METRIC)?.value, 0);
  assert.match(
    outcome.notes?.join("; ") ?? "",
    /field 10: numerical, unconverged \(comparator-zernike-optiland-wavefront: normal equations of condition 1048576, above 1024\)/,
  );
  // Without a limit the field is of two methods, and the pair says so.
  const free: RungPolicy = { ...POLICY, metrics: { ...POLICY.metrics, [CONDITION_METRIC]: { unit: "1" } } };
  const unlimited = compared(ZERNIKE_DATA_FRINGE, moved(2 ** -30, conditioned(2 ** 20)), free);
  assert.equal(metric(unlimited, "fields.compared")?.value, 2);
  assert.equal(metric(unlimited, CONDITION_METRIC)?.value, 2 ** 20);
  assert.equal(metric(unlimited, SET_ASIDE_CONDITION_METRIC), undefined);
  assert.match(unlimited.comparable ? (unlimited.notes?.join("; ") ?? "") : "", /sets no limit on fitCondition\.max/);
});

test("policy 24: the limits of the landing and the fit's condition, and the bands the owner accepted", () => {
  // The owner's decision of 2026-10-28, of the Stage 6.8 measurement.
  assert.deepEqual(POLICY.metrics[CHIEF_LANDING_METRIC], { attention: 1e-9, unit: "mm" });
  assert.deepEqual(POLICY.metrics[CONDITION_METRIC], { attention: 1e6, unit: "1" });
  assert.deepEqual(POLICY.metrics[COEFFICIENTS_METRIC], { attention: 4e-11, unit: "waves" });
  assert.deepEqual(POLICY.metrics["rmsToChief.maxAbs"], { attention: 2e-16, unit: "waves" });
  assert.deepEqual(POLICY.metrics["fitResidualRms.maxAbs"], { attention: 7e-16, unit: "waves" });
  assert.deepEqual(POLICY.metrics["pvToChief.maxAbs"], { unit: "waves" });
  // The condition of a field set aside is shown and never judged: the policy names no band of it (2026-10-29).
  assert.equal(POLICY.metrics[SET_ASIDE_CONDITION_METRIC], undefined);
  const pairOf = (b: ZernikeNativeData) =>
    comparePair(
      { engine: "optiland", fingerprint: "a", status: "ok", data: ZERNIKE_DATA_FRINGE as unknown as JsonObject },
      { engine: "optiland-wave", fingerprint: "b", status: "ok", data: b as unknown as JsonObject },
      POLICY,
      zernikeNativeComparator,
    );
  // Within every band: a coefficient 2^-40 waves (9.1e-13) apart, the RMS 2^-55 (2.8e-17), the residual 2^-52
  // (2.2e-16).
  /** The Fringe answer with field 1 changed. */
  const withField = (change: Partial<ZernikeNativeData["fields"][number]>): ZernikeNativeData => {
    const copy = structuredClone(ZERNIKE_DATA_FRINGE);
    return { ...copy, fields: [copy.fields[0], { ...copy.fields[1], ...change }] };
  };
  const field1 = ZERNIKE_DATA_FRINGE.fields[1];
  const within = withField({
    coefficients: field1.coefficients.map((value, term) => (term === 2 ? value + 2 ** -40 : value)),
    rmsToChiefWaves: (field1.rmsToChiefWaves as number) + 2 ** -55,
    fitResidualRmsWaves: (field1.fitResidualRmsWaves as number) + 2 ** -52,
  });
  const recorded = pairOf(within);
  assert.equal(recorded.verdict, "RECORDED", recorded.reason);
  // Above each band in turn, the others within.
  for (const [figure, change] of [
    [COEFFICIENTS_METRIC, { coefficients: [0.5, 0, -0.25 + 2 ** -30, 0.125] }],
    ["rmsToChief.maxAbs", { rmsToChiefWaves: (ZERNIKE_DATA_FRINGE.fields[1].rmsToChiefWaves as number) + 2 ** -50 }],
    [
      "fitResidualRms.maxAbs",
      { fitResidualRmsWaves: (ZERNIKE_DATA_FRINGE.fields[1].fitResidualRmsWaves as number) + 2 ** -48 },
    ],
  ] as const) {
    const pair = pairOf(withField(change));
    assert.equal(pair.verdict, "ATTENTION", figure);
    assert.match(pair.reason ?? "", new RegExp(`^${figure.replace(".", "\\.")} \\S+ is outside its attention band`));
  }
  // A landing 2^-28 mm (3.7e-9 mm) off, beyond the limit: data, in no figure; 2^-32 mm (2.3e-10 mm), within: compared.
  const landed = (offset: number): ZernikeNativeData => withField({ imageHeightMm: 8.5 + offset });
  const apart = compared(ZERNIKE_DATA_FRINGE, landed(2 ** -28));
  assert.deepEqual(
    ["compared", "data", "numerical"].map((kind) => metric(apart, `fields.${kind}`)?.value),
    [1, 1, 0],
  );
  assert.equal(pairOf(landed(2 ** -28)).verdict, "ATTENTION");
  assert.equal(metric(compared(ZERNIKE_DATA_FRINGE, landed(2 ** -32)), "fields.compared")?.value, 2);
  // A fit of condition 2^21 (2.1e6), beyond the limit: numerical, in no figure; 2^19 (5.2e5), within: compared.
  const conditioned = (condition: number): ZernikeNativeData => withField({ fitCondition: condition });
  const illConditioned = compared(ZERNIKE_DATA_FRINGE, conditioned(2 ** 21));
  assert.deepEqual(
    ["compared", "data", "numerical"].map((kind) => metric(illConditioned, `fields.${kind}`)?.value),
    [1, 0, 1],
  );
  // The owner's decision of 2026-10-29: a field set aside by its condition is R5's unconverged field, counted and
  // named, never a reason for ATTENTION, though its coefficients be far apart; a landing beyond the limit still is.
  const setAside = pairOf(
    withField({ fitCondition: 2 ** 21, coefficients: [0.5, 0, -0.25 + 2 ** -10, 0.125], imageHeightMm: 8.5 }),
  );
  assert.equal(setAside.verdict, "RECORDED", setAside.reason);
  assert.match(setAside.reason ?? "", /field 10: numerical, unconverged/);
  assert.equal(setAside.metrics.find(({ name }) => name === SET_ASIDE_CONDITION_METRIC)?.value, 2 ** 21);
  const setAsideAndApart = pairOf(withField({ fitCondition: 2 ** 21, imageHeightMm: 8.5 + 2 ** -28 }));
  assert.equal(setAsideAndApart.verdict, "ATTENTION");
  assert.match(setAsideAndApart.reason ?? "", /^chiefLanding\.maxAbs \S+ is outside its attention band/);
  assert.equal(metric(compared(ZERNIKE_DATA_FRINGE, conditioned(2 ** 19)), "fields.compared")?.value, 2);
});
