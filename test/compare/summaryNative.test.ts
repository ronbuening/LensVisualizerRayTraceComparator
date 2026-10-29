// The comparator of `summary.native` for rung R12b: every line is sorted before a difference is taken, by R5's sorting
// with the rear focal point as the landing; only a line of two methods is in a figure, each the difference of a value
// both answers state under one definition, and a value one answer never states is unmeasured with the engine named.
// Every number is synthetic and dyadic, so that every expected difference is exact.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { classifyNativeField } from "../../src/compare/mtfNative.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import {
  REAR_FOCUS_METRIC,
  SUMMARY_FIGURES,
  summaryFactsOf,
  summaryFactsOfRecorded,
  summaryNativeComparator,
} from "../../src/compare/summaryNative.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { SummaryNativeData, SummaryNativeLine } from "../../src/contract/quantities/summaryNative.ts";

const POLICY: RungPolicy = loadPolicy().rungs.r12b;

/**
 * A line as LensVisualizer's tab states one at a finite focus: a marked f-number and a half field, no working f-number of
 * a paraxial or a real ray at the case's conjugate (its values at its own paraxial object under `sampling`).
 */
function tab(line: number, more: Partial<SummaryNativeLine> = {}): SummaryNativeLine {
  return {
    line,
    wavelengthNm: 587.5,
    status: "ok",
    rearFocalZ: 96.25,
    focalLengthMm: 50.5,
    entrancePupilDiameterMm: 25.25,
    stopDiameterMm: 20.5,
    imageSpaceFNumber: 2,
    paraxialWorkingFNumber: null,
    workingFNumber: null,
    nominalFNumber: 2.125,
    totalTrackMm: 90.75,
    halfFieldDeg: 23.5,
    sampling: { focusDistanceM: 0.5, lvParaxialWorkingFNumberAtParaxialObject: 2.125 },
    ...more,
  };
}

/**
 * Within and above each band of R12b (policy 24): the pupil's 2e-12 mm (2^-40, 9.1e-13; 2^-38, 3.6e-12), the image-space
 * and paraxial working f-numbers' 2e-13 (2^-43, 1.1e-13; 2^-42, 2.3e-13) and the working f-number's 7e-8 (2^-24, 6.0e-8;
 * 2^-23, 1.2e-7). Each is exact beside the value it moves.
 */
const WITHIN = { pupil: 2 ** -40, fNumber: 2 ** -43, working: 2 ** -24 };
const ABOVE = { pupil: 2 ** -38, fNumber: 2 ** -42, working: 2 ** -23 };

/**
 * A line as optiland states one: no marked f-number or half field, a working f-number of the rim rays, and a pupil and
 * an image-space f-number within R12b's bands of the tab's.
 */
function accessors(line: number, more: Partial<SummaryNativeLine> = {}): SummaryNativeLine {
  return {
    ...tab(line),
    entrancePupilDiameterMm: 25.25 + WITHIN.pupil,
    imageSpaceFNumber: 2 - WITHIN.fNumber,
    paraxialWorkingFNumber: 2,
    workingFNumber: 2.0625,
    nominalFNumber: null,
    halfFieldDeg: null,
    sampling: { exitPupilDiameterMm: 30.5 },
    ...more,
  };
}

function answer(lines: SummaryNativeLine[], name: string): SummaryNativeData {
  return { lines, method: { name, params: {} }, notes: [] };
}

function compared(
  a: SummaryNativeData,
  b: SummaryNativeData,
  policy: RungPolicy | undefined = POLICY,
): ComparatorOutcome {
  return summaryNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, { policy });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

/**
 * The bands the owner set (2026-10-29, policy 24), ten times the figures measured at LensVisualizer 607ff23ae rounded up:
 * the two of one definition that one answer's pupil makes, and since #933 the two working f-numbers.
 */
const BANDS: Readonly<Record<string, number>> = {
  "imageSpaceFNumber.maxAbs": 2e-13,
  "entrancePupilDiameter.maxAbs": 2e-12,
  "paraxialWorkingFNumber.maxAbs": 2e-13,
  "workingFNumber.maxAbs": 7e-8,
};

test("the policy gives the rear focus its limit of 1e-5 mm, four figures a band, and the others none", () => {
  // Every figure is named with its unit, so that one an engine never states is said to be unmeasured in the reason.
  assert.deepEqual(POLICY.metrics[REAR_FOCUS_METRIC], { attention: 1e-5, unit: "mm" });
  for (const { name, unit } of SUMMARY_FIGURES) {
    const band = BANDS[name];
    assert.deepEqual(POLICY.metrics[name], band === undefined ? { unit } : { attention: band, unit }, name);
  }
  assert.equal(Object.keys(POLICY.metrics).length, 1 + SUMMARY_FIGURES.length);
  assert.equal(POLICY.class, "recorded");
  const pair = comparePair(
    { engine: "lv", fingerprint: "a", status: "ok", data: answer([tab(0)], "tab") as unknown as JsonObject },
    {
      engine: "optiland",
      fingerprint: "b",
      status: "ok",
      data: answer([accessors(0)], "acc") as unknown as JsonObject,
    },
    POLICY,
    summaryNativeComparator,
  );
  assert.equal(pair.verdict, "RECORDED");
});

test("each figure is the difference of a value both answers state, and one an answer never states is unmeasured", () => {
  const outcome = compared(answer([tab(0)], "lv-summary-tab"), answer([accessors(0)], "optiland-summary"));
  assert.deepEqual(metric(outcome, "entrancePupilDiameter.maxAbs"), {
    name: "entrancePupilDiameter.maxAbs",
    value: WITHIN.pupil,
    where: { line: 0 },
  });
  assert.equal(metric(outcome, "imageSpaceFNumber.maxAbs")!.value, WITHIN.fNumber);
  for (const name of ["focalLength.maxAbs", "stopDiameter.maxAbs", "totalTrack.maxAbs", REAR_FOCUS_METRIC]) {
    assert.equal(metric(outcome, name)!.value, 0, name);
  }
  assert.ok(outcome.comparable);
  // The tab states no working f-number of a paraxial or a real ray: those figures are unmeasured, the method named.
  assert.deepEqual(outcome.unmeasured, [
    { name: "paraxialWorkingFNumber.maxAbs", reason: "lv-summary-tab states none" },
    { name: "workingFNumber.maxAbs", reason: "lv-summary-tab states none" },
  ]);
  assert.deepEqual(
    ["compared", "data", "unavailable"].map((kind) => metric(outcome, `lines.${kind}`)!.value),
    [1, 0, 0],
  );
  // The marked f-number and the half field are never figures; every value is recorded.
  assert.deepEqual(
    SUMMARY_FIGURES.map(({ value }) => value),
    [
      "focalLengthMm",
      "entrancePupilDiameterMm",
      "stopDiameterMm",
      "imageSpaceFNumber",
      "paraxialWorkingFNumber",
      "workingFNumber",
      "totalTrackMm",
    ],
  );
  const recorded = summaryNativeComparator.recorded!(answer([tab(0)], "tab") as unknown as JsonObject);
  assert.deepEqual(recorded.nominalFNumber, [2.125]);
  assert.deepEqual(recorded.halfFieldDeg, [23.5]);
  assert.ok(Number.isNaN(recorded.workingFNumber[0]));
  assert.deepEqual(recorded.focusDistanceM, [0.5]);
});

test("a line is sorted first: no values is unsupported, other wavelengths and rear foci apart are data", () => {
  const a = answer([tab(0), tab(1), tab(2), tab(3), tab(4)], "lv-summary-tab");
  const none = { rearFocalZ: null, focalLengthMm: null, entrancePupilDiameterMm: null, stopDiameterMm: null };
  const b = answer(
    [
      accessors(0),
      accessors(1, {
        status: "unavailable",
        reason: "system.afocal",
        ...none,
        imageSpaceFNumber: null,
        paraxialWorkingFNumber: null,
        workingFNumber: null,
        totalTrackMm: null,
      }),
      accessors(2, { wavelengthNm: 486.25 }),
      accessors(3, { rearFocalZ: 96.25 + 2 ** -16 }),
      accessors(4, { rearFocalZ: null }),
    ],
    "optiland-summary",
  );
  const outcome = compared(a, b);
  assert.deepEqual(
    ["compared", "data", "unavailable"].map((kind) => metric(outcome, `lines.${kind}`)!.value),
    [1, 3, 1],
  );
  assert.ok(outcome.comparable);
  assert.deepEqual(outcome.notes, [
    "line 1: unsupported, no-curve (optiland-summary: unavailable (system.afocal))",
    "line 2: data, lines-differ (the answers are of 486.25 and 587.5 nm)",
    "line 3: data, chief-landing-apart (the rear focal points lie 1.53e-5 mm apart)",
    "line 4: data, chief-landing-unknown (optiland-summary states no rear focal point)",
  ]);
  // Only line 0 is of two methods; the largest rear-focus distance is line 3's, which set it aside.
  assert.deepEqual(metric(outcome, REAR_FOCUS_METRIC), {
    name: REAR_FOCUS_METRIC,
    value: 2 ** -16,
    where: { line: 3 },
  });
  // The sorting is R5's, read of each answer's facts and of the facts it records alike.
  const recordedA = summaryNativeComparator.recorded!(a as unknown as JsonObject);
  const recordedB = summaryNativeComparator.recorded!(b as unknown as JsonObject);
  a.lines.forEach((lineA, index) => {
    const lineB = b.lines[index];
    const same = lineA.wavelengthNm === lineB.wavelengthNm;
    const live = classifyNativeField(summaryFactsOf(lineA), summaryFactsOf(lineB), same, 1e-5);
    const again = classifyNativeField(
      summaryFactsOfRecorded(recordedA, index),
      summaryFactsOfRecorded(recordedB, index),
      recordedA.wavelengthNm[index] === recordedB.wavelengthNm[index],
      1e-5,
    );
    assert.deepEqual(again, live, `line ${index}`);
  });
});

test("without a limit of the rear focus no line is set aside by it, and the pair's notes say so", () => {
  const unlimited: RungPolicy = { ...POLICY, metrics: {} };
  const outcome = compared(answer([tab(0)], "tab"), answer([accessors(0, { rearFocalZ: 100 })], "acc"), unlimited);
  assert.equal(metric(outcome, "lines.compared")!.value, 1);
  assert.ok(outcome.comparable && outcome.notes?.[0]?.includes("sets no limit on rearFocus.maxAbs"));
});

test("answers of other lines are not comparable", () => {
  const a = answer([tab(0), tab(1)], "tab");
  for (const [b, reason] of [
    [answer([accessors(0)], "acc"), /for 1 and 2 lines/],
    [answer([accessors(0), accessors(2)], "acc"), /entry 1 is of line 1 in one answer and 2/],
  ] as const) {
    const outcome = compared(a, b);
    assert.equal(outcome.comparable, false);
    assert.match(outcome.comparable ? "" : outcome.reason, reason);
  }
});

test("a pair is RECORDED with every banded figure within its band, and ATTENTION with one above its band", () => {
  // At infinity focus the tab states both working f-numbers, so all four banded figures are measured.
  const infinity = tab(0, { paraxialWorkingFNumber: 2, workingFNumber: 2.0625, sampling: {} });
  const pairOf = (b: SummaryNativeLine) =>
    comparePair(
      { engine: "lv", fingerprint: "a", status: "ok", data: answer([infinity], "tab") as unknown as JsonObject },
      { engine: "optiland", fingerprint: "b", status: "ok", data: answer([b], "acc") as unknown as JsonObject },
      POLICY,
      summaryNativeComparator,
    );
  // Within: each figure below its band, the working f-numbers too.
  const within = { paraxialWorkingFNumber: 2 + WITHIN.fNumber, workingFNumber: 2.0625 - WITHIN.working };
  const recorded = pairOf(accessors(0, within));
  assert.equal(recorded.verdict, "RECORDED");
  assert.deepEqual(
    Object.keys(BANDS).map((name) => recorded.metrics.find((each) => each.name === name)?.value),
    [WITHIN.fNumber, WITHIN.pupil, WITHIN.fNumber, WITHIN.working],
  );
  // Above: each figure in turn above its band, the others within.
  for (const [figure, change] of [
    ["entrancePupilDiameter.maxAbs", { entrancePupilDiameterMm: 25.25 + ABOVE.pupil }],
    ["imageSpaceFNumber.maxAbs", { imageSpaceFNumber: 2 - ABOVE.fNumber }],
    ["paraxialWorkingFNumber.maxAbs", { paraxialWorkingFNumber: 2 + ABOVE.fNumber }],
    ["workingFNumber.maxAbs", { workingFNumber: 2.0625 - ABOVE.working }],
  ] as const) {
    const pair = pairOf(accessors(0, { ...within, ...change }));
    assert.equal(pair.verdict, "ATTENTION", figure);
    assert.match(pair.reason ?? "", new RegExp(`^${figure.replace(".", "\\.")} \\S+ is outside its attention band`));
  }
});
