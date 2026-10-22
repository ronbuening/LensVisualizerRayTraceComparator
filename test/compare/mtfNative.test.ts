// The comparator of `mtf.native` for rung R5: two engines' own MTF of one case, sorted field by field before any
// difference is taken. Every answer here is synthetic (`mtfNativeSupport.ts`): curves, landings and sampling
// written out, so that each figure a test expects is a subtraction of two numbers it wrote.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric } from "../../src/compare/comparator.ts";
import { followUpsOf } from "../../src/compare/followUp.ts";
import { compareGroup, stepValueName } from "../../src/compare/group.ts";
import {
  classifyNativeField,
  curveValueName,
  factsOfField,
  factsOfRecorded,
  mtfNativeComparator,
} from "../../src/compare/mtfNative.ts";
import type { NativeFieldFacts } from "../../src/compare/mtfNative.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { MtfNativeData } from "../../src/contract/quantities/mtfNative.ts";
import { SINGLET } from "../core/support.ts";
import { FLAT, SPEC, answer, raised } from "./mtfNativeSupport.ts";

const POLICY = loadPolicy();
const R5 = POLICY.rungs.r5;
const ON_AXIS = R5.metrics["mtfOnAxis.maxAbs"].attention as number;
const OFF_AXIS = R5.metrics["mtfOffAxis.maxAbs"].attention as number;
const LANDING = R5.metrics["chiefLanding.maxAbs"].attention as number;
const CONTEXT: ComparisonContext = { spec: SPEC, policy: R5 };

/** A curve that is `delta` at the first frequency and 0 at the others: against `ZERO` its difference is `delta`. */
const ZERO = FLAT.map(() => 0);
const only = (delta: number): number[] => ZERO.map((value, index) => (index === 0 ? delta : value));
/** The next double above a positive one. */
const above = (value: number): number => value * (1 + 2 ** -52);

function compared(a: MtfNativeData, b: MtfNativeData, context: ComparisonContext = CONTEXT) {
  const outcome = mtfNativeComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  const swapped =
    context.steps === undefined ? context : { ...context, steps: [context.steps[1], context.steps[0]] as const };
  assert.deepEqual(mtfNativeComparator.compare(b, a, swapped), outcome, "swapping the two changes nothing");
  const metric = (name: string): ComputedMetric | undefined => outcome.metrics.find((found) => found.name === name);
  return { ...outcome, metric, value: (name: string): number | undefined => metric(name)?.value };
}

function participant(engine: string, data: MtfNativeData): ParticipantResult {
  return { engine, fingerprint: engine, status: "ok", data };
}

function verdictOf(a: MtfNativeData, b: MtfNativeData) {
  return comparePair(participant("lv", a), participant("optiland", b), R5, mtfNativeComparator, undefined, {
    spec: SPEC,
  });
}

test("the comparator is the one of mtf.native for r5, and its bands are the plan's", () => {
  assert.deepEqual([mtfNativeComparator.quantity, mtfNativeComparator.rung], ["mtf.native", "r5"]);
  assert.deepEqual([ON_AXIS, OFF_AXIS], [0.005, 0.01]);
});

test("on the axis a difference of exactly the band is RECORDED, and the next double above it is ATTENTION", () => {
  // The other answer is 0 there, so the difference is the number written, with no rounding of a subtraction.
  const lv = (delta: number) => answer("lv-product", [{ sagittal: only(delta), tangential: ZERO }, {}, {}]);
  const other = answer("scalar-fft-mtf", [{ sagittal: ZERO, tangential: ZERO }, {}, {}]);
  const at = compared(lv(ON_AXIS), other);
  assert.deepEqual(at.metric("mtfOnAxis.maxAbs"), {
    name: "mtfOnAxis.maxAbs",
    value: ON_AXIS,
    where: { field: 0, cut: "sagittal", frequencyPerMm: 10 },
  });
  assert.equal(at.value("mtfOffAxis.maxAbs"), 0);
  assert.equal(verdictOf(lv(ON_AXIS), other).verdict, "RECORDED");
  assert.equal(verdictOf(lv(ON_AXIS), other).reason, undefined);

  const beyond = verdictOf(lv(above(ON_AXIS)), other);
  assert.equal(beyond.verdict, "ATTENTION");
  assert.match(
    beyond.reason ?? "",
    /^mtfOnAxis\.maxAbs 5\.00e-3 is outside its attention band 5\.00e-3 at cut sagittal/,
  );
  // The band off the axis is not the one on it: twice as wide.
  assert.equal(verdictOf(lv(OFF_AXIS), other).verdict, "ATTENTION");
});

test("off the axis the band is 0.01: exactly that is RECORDED, the next double ATTENTION, on either field and cut", () => {
  const other = answer("scalar-fft-mtf", [{}, { tangential: ZERO }, { sagittal: ZERO }]);
  const lv = (middle: number, edge: number) =>
    answer("lv-product", [{}, { tangential: only(middle) }, { sagittal: only(edge) }]);
  assert.equal(verdictOf(lv(OFF_AXIS, OFF_AXIS), other).verdict, "RECORDED");
  assert.equal(compared(lv(OFF_AXIS, ON_AXIS), other).value("mtfOffAxis.maxAbs"), OFF_AXIS);
  assert.equal(compared(lv(OFF_AXIS, ON_AXIS), other).value("mtfOnAxis.maxAbs"), 0);
  for (const [middle, edge] of [
    [above(OFF_AXIS), 0],
    [0, above(OFF_AXIS)],
  ]) {
    const pair = verdictOf(lv(middle, edge), other);
    assert.equal(pair.verdict, "ATTENTION");
    assert.match(pair.reason ?? "", /^mtfOffAxis\.maxAbs 1\.00e-2 is outside its attention band 1\.00e-2/);
  }
  // A value above the band on the axis is inside the band off it.
  assert.equal(verdictOf(lv(above(ON_AXIS), above(ON_AXIS)), other).verdict, "RECORDED");
});

test("a field whose chief rays land further apart than the limit is of class data and shows no difference", () => {
  // The other chief ray lands on the axis side at 0 mm, so the distance is the number written.
  const lv = (heightMm: number) => answer("lv-product", [{}, { imageHeightMm: heightMm, sagittal: raised(-0.25) }, {}]);
  const other = answer("scalar-fft-mtf", [{}, { imageHeightMm: 0 }, {}]);

  // At the limit the field is one field: its difference, far outside the band, is judged.
  const at = compared(lv(LANDING), other);
  assert.deepEqual(at.metric("chiefLanding.maxAbs"), {
    name: "chiefLanding.maxAbs",
    value: LANDING,
    where: { field: 0.5 },
  });
  assert.equal(at.value("mtfOffAxis.maxAbs"), 0.25);
  assert.equal(at.value("fields.data"), 0);

  // Beyond it there are two image points: the difference of 0.25 is in no figure, and the pair is marked for the
  // landing alone.
  const beyond = compared(lv(above(LANDING)), other);
  assert.equal(beyond.value("chiefLanding.maxAbs"), above(LANDING));
  assert.equal(beyond.value("mtfOffAxis.maxAbs"), 0);
  assert.deepEqual(
    ["fields.compared", "fields.data", "fields.flagged", "fields.rimLost", "fields.unavailable"].map(beyond.value),
    [2, 1, 0, 0, 0],
  );
  assert.deepEqual(beyond.notes, ["field 0.5: data, chief-landing-apart (the chief rays land 1.00e-7 mm apart)"]);
  const pair = verdictOf(lv(above(LANDING)), other);
  assert.equal(pair.verdict, "ATTENTION");
  assert.match(
    pair.reason ?? "",
    /^chiefLanding\.maxAbs 1\.00e-7 is outside its attention band 1\.00e-7 at field 5\.00e-1; field 0\.5: data/,
  );
  assert.doesNotMatch(pair.reason ?? "", /mtfOffAxis/);

  // An answer that does not say where its chief ray lands cannot be held to the other: data, and no landing figure.
  const unknown = compared(answer("lv-product", [{}, { imageHeightMm: null, sagittal: raised(-0.25) }, {}]), other);
  assert.equal(unknown.value("fields.data"), 1);
  assert.equal(unknown.value("mtfOffAxis.maxAbs"), 0);
  assert.deepEqual(unknown.notes, ["field 0.5: data, chief-landing-unknown (no chief-ray landing from lv-product)"]);
});

test("answers of different lines are of class data in every field, and nothing is measured", () => {
  const out = compared(
    answer("lv-product", [{ sagittal: raised(-0.25) }, {}, {}]),
    answer("scalar-fft-mtf", [{}, {}, {}], [486.1327]),
  );
  assert.deepEqual(["fields.compared", "fields.data"].map(out.value), [0, 3]);
  assert.equal(out.metric("mtfOnAxis.maxAbs"), undefined);
  assert.deepEqual(
    out.unmeasured?.map((metric) => metric.name),
    ["mtfOnAxis.maxAbs", "mtfOffAxis.maxAbs"],
  );
  assert.match(
    out.notes?.[0] ?? "",
    /^field 0: data, lines-differ \(the answers are of the lines 486\.1327 and 587\.5618 nm\)$/,
  );
});

test("a field with a lost rim ray, an unconverged one and one without curves are each in a figure of their own, or in none", () => {
  const lv = answer("lv-product", [
    { sagittal: raised(-0.125) },
    { sagittal: raised(-0.25) },
    { sagittal: raised(-0.5) },
  ]);
  const other = answer("scalar-fft-mtf", [
    { sampling: { rimRaysLost: 2 } },
    { status: "unconverged", reason: "not-converged" },
    { status: "unavailable", reason: "optiland-raised-ValueError" },
  ]);
  const out = compared(lv, other);
  assert.equal(out.value("mtfRimLost.maxAbs"), 0.125);
  assert.equal(out.value("mtfFlagged.maxAbs"), 0.25);
  assert.equal(out.metric("mtfOnAxis.maxAbs"), undefined);
  assert.equal(out.metric("mtfOffAxis.maxAbs"), undefined);
  assert.deepEqual(
    ["fields.compared", "fields.flagged", "fields.rimLost", "fields.data", "fields.unavailable"].map(out.value),
    [0, 1, 1, 0, 1],
  );
  assert.deepEqual(out.notes, [
    "field 0: method, rim-rays-lost (scalar-fft-mtf lost 2 rim rays)",
    "field 0.5: numerical, unconverged (scalar-fft-mtf: unconverged (not-converged))",
    "field 1: unsupported, no-curve (scalar-fft-mtf: unavailable (optiland-raised-ValueError))",
  ]);
  // None of the three differences, each far outside a band, marks the pair: nothing of them is in a band.
  const pair = verdictOf(lv, other);
  assert.equal(pair.verdict, "RECORDED");
  assert.match(pair.reason ?? "", /mtfOffAxis\.maxAbs was not measured: no field off the axis is in a band/);
});

test("the classes are decided in the ladder's order, whichever answer is named first", () => {
  const fine: NativeFieldFacts = { settled: 1, imageHeightMm: 4, rimRaysLost: 0 };
  const sort = (a: Partial<NativeFieldFacts>, b: Partial<NativeFieldFacts> = {}, sameLines = true) => {
    const [first, second] = [
      { ...fine, ...a },
      { ...fine, ...b },
    ];
    const sorting = classifyNativeField(first, second, sameLines, 0.5);
    assert.deepEqual(classifyNativeField(second, first, sameLines, 0.5), sorting);
    return `${sorting.class} ${sorting.reason} ${sorting.banded ? "banded" : sorting.shown ? "shown" : "hidden"}`;
  };
  assert.equal(sort({}), "method two-methods banded");
  assert.equal(sort({ rimRaysLost: null }, { rimRaysLost: null }), "method two-methods banded");
  // Each earlier class wins over every later one.
  const everything = { settled: null, imageHeightMm: 9, rimRaysLost: 3 };
  assert.equal(sort(everything, {}, false), "unsupported no-curve hidden");
  assert.equal(sort({ ...everything, settled: 0 }, {}, false), "data lines-differ hidden");
  assert.equal(sort({ ...everything, settled: 0, imageHeightMm: null }), "data chief-landing-unknown hidden");
  assert.equal(sort({ ...everything, settled: 0 }), "data chief-landing-apart hidden");
  assert.equal(sort({ settled: 0, rimRaysLost: 3 }), "numerical unconverged shown");
  assert.equal(sort({ rimRaysLost: 3 }), "method rim-rays-lost shown");
  // The limit is included; a landing that is no number is within none.
  assert.equal(sort({ imageHeightMm: 4.5 }), "method two-methods banded");
  assert.equal(sort({ imageHeightMm: Number.NaN }), "data chief-landing-apart hidden");
  assert.equal(classifyNativeField(fine, { ...fine, imageHeightMm: 5 }, true, 0.5).landingMm, 1);
});

test("an engine that was asked again is judged by its last answer, and the first is written down beside it", () => {
  const lv = answer("lv-product", [{ sagittal: only(0.25), tangential: ZERO }, {}, {}]);
  const first = answer("scalar-fft-mtf", [{ sagittal: ZERO, tangential: ZERO }, {}, {}]);
  const last = answer("scalar-fft-mtf", [
    { sagittal: only(0.125), tangential: ZERO },
    { sagittal: raised(-0.5, 1) },
    {},
  ]);
  const steps = [[], [{ step: "fft512", data: last }]] as const;
  const out = compared(lv, first, { ...CONTEXT, steps });
  assert.equal(out.value("mtfOnAxis.maxAbs"), 0.125);
  assert.equal(out.value("mtfOnAxis.firstStepMaxAbs"), 0.25);
  assert.equal(out.value("mtfOffAxis.maxAbs"), 0.5);
  assert.equal(out.value("mtfOffAxis.firstStepMaxAbs"), 0);
  assert.deepEqual(out.metric("mtfOffAxis.maxAbs")?.where, { field: 0.5, cut: "sagittal", frequencyPerMm: 30 });
  assert.deepEqual(out.notes, [
    "judged with scalar-fft-mtf at its step fft512; the figures of the first answers are beside them",
  ]);
  // Without a step there is no figure of a first answer.
  assert.equal(compared(lv, first).metric("mtfOnAxis.firstStepMaxAbs"), undefined);
});

test("answers that are no answers to one request, and a comparison without its spec or its band, are not comparable", () => {
  const lv = answer("lv-product");
  const reasonOf = (a: MtfNativeData, b: MtfNativeData, context: ComparisonContext = CONTEXT): string => {
    const outcome = mtfNativeComparator.compare(a, b, context);
    assert.equal(outcome.comparable, false);
    return outcome.comparable ? "" : outcome.reason;
  };
  assert.match(reasonOf(lv, lv, { policy: R5 }), /^the spec of the request is not at hand/);
  assert.match(reasonOf(lv, lv, { spec: SPEC }), /^the policy of the rung gives chiefLanding\.maxAbs no band/);
  const fewer = { ...lv, fields: lv.fields.slice(0, 2) };
  assert.equal(reasonOf(lv, fewer), "the answers are for 2 and 3 fields: they answer different requests");
  const other = { ...lv, fields: [lv.fields[0], { ...lv.fields[1], field: 0.75 }, lv.fields[2]] };
  assert.equal(reasonOf(lv, other), "field 1 is 0.5 in one answer and 0.75 in the other");
  const moved = { ...lv, focus: { mode: "best-axial", appliedShiftMm: 0.0625 } };
  assert.equal(reasonOf(lv, moved), "the answers are of different planes: best-axial at 0.0625 mm and design at 0 mm");
  const context = { ...CONTEXT, spec: { ...SPEC, frequenciesPerMm: [10, 30] } };
  assert.equal(reasonOf(lv, lv, context), "the sagittal curves of field 0 hold 4 and 4 values for 2 frequencies");
  // comparePair hands the policy over itself: a caller gives the spec alone.
  assert.equal(verdictOf(lv, lv).verdict, "RECORDED");
  assert.equal(
    comparePair(participant("lv", lv), participant("optiland", lv), R5, mtfNativeComparator).verdict,
    "ERROR",
  );
});

test("what an answer records is every value a table of the comparison needs, and the sorting reads it back", () => {
  const data = answer("scalar-fft-mtf", [
    { sampling: { numRays: 256, rimRaysLost: 0 } },
    { status: "unconverged", sampling: { numRays: 256, rimRaysLost: 1, maxDelta: 0.5 }, imageHeightMm: null },
    { status: "unavailable", reason: "no-frequency-axis" },
  ]);
  const recorded = mtfNativeComparator.recorded?.(data, CONTEXT) ?? {};
  assert.deepEqual(recorded.field, [0, 0.5, 1]);
  assert.deepEqual(recorded.fieldAngleDeg, [0, 4, 8]);
  assert.deepEqual(recorded.imageHeightMm, [0, Number.NaN, 16]);
  assert.deepEqual(recorded.settled, [1, 0, Number.NaN]);
  assert.deepEqual(recorded.numRays, [256, 256, Number.NaN]);
  assert.deepEqual(recorded.maxDelta, [Number.NaN, 0.5, Number.NaN]);
  assert.deepEqual(recorded.lineWavelengthNm, [587.5618]);
  // A sampling name the answer states for no field is another engine's, and is left out.
  assert.ok(!Object.hasOwn(recorded, "phaseStepWaves"));
  for (const cut of ["sagittal", "tangential"] as const) {
    for (const [at, frequency] of SPEC.frequenciesPerMm.entries()) {
      assert.deepEqual(recorded[curveValueName(cut, frequency)], [FLAT[at], FLAT[at], Number.NaN]);
    }
  }
  assert.equal(curveValueName("tangential", 12.5), "tangential@12.5");
  // Without the request no curve is named.
  assert.ok(!Object.keys(mtfNativeComparator.recorded?.(data) ?? {}).some((name) => name.includes("@")));

  // As a set states them, a value that is no number is null, and the sorting reads the same facts from either.
  const set = compareGroup(
    {
      suite: "s",
      run: "r",
      caseId: SINGLET.id,
      rung: "r5",
      quantity: "mtf.native",
      requestId: "1".repeat(64),
      participants: [
        participant("lv", answer("lv-product")),
        { ...participant("optiland", data), steps: [{ step: "fft512", status: "ok", data }] },
      ],
      policy: R5,
      comparator: mtfNativeComparator,
      context: { spec: SPEC },
    },
    "pairwise",
  );
  const stated = set.participants.find(({ engine }) => engine === "optiland")?.recorded ?? {};
  for (const [index, field] of data.fields.entries()) {
    assert.deepEqual(factsOfRecorded(stated, index), factsOfField(field), `field ${index}`);
  }
  // The values of a later step stand beside those of the first answer, under the step's name.
  assert.deepEqual(stated[stepValueName("settled", "fft512")], stated.settled);
  assert.equal(stepValueName("sagittal@10", "fft512"), "sagittal@10#fft512");
});

test("optiland is asked again exactly where its pair with lv has a figure outside a band", () => {
  const [followUp] = followUpsOf(POLICY);
  assert.deepEqual(
    [followUp.rung, followUp.engine, followUp.step, followUp.options],
    ["r5", "optiland", "fft512", { fftRays: 512 }],
  );
  assert.deepEqual(followUpsOf({ ...POLICY, rungs: { r0: POLICY.rungs.r0 } }), []);
  const context = { spec: SPEC, opticalCase: SINGLET, recipe: null };
  const asked = (lv: MtfNativeData | null, optiland: MtfNativeData | null, wave?: MtfNativeData): boolean => {
    const answers = new Map<string, MtfNativeData>();
    if (lv !== null) answers.set("lv", lv);
    if (optiland !== null) answers.set("optiland", optiland);
    if (wave !== undefined) answers.set("wave", wave);
    return followUp.needed(answers, context);
  };
  const flat = answer("scalar-fft-mtf", [{ sagittal: ZERO, tangential: ZERO }, {}, {}]);
  const lv = (delta: number) => answer("lv-product", [{ sagittal: only(delta), tangential: ZERO }, {}, {}]);
  assert.equal(asked(lv(ON_AXIS), flat), false);
  assert.equal(asked(lv(above(ON_AXIS)), flat), true);
  // What the wave estimator says asks optiland for nothing, and neither does a pair without one of its two.
  assert.equal(asked(lv(ON_AXIS), flat, lv(0.25)), false);
  assert.equal(asked(null, flat, lv(0.25)), false);
  assert.equal(asked(lv(0.25), null), false);
  // A chief ray that lands elsewhere is no matter of sampling; nor is a field that is in no band.
  const elsewhere = answer("scalar-fft-mtf", [{}, { imageHeightMm: 9, sagittal: raised(-0.25) }, {}]);
  assert.equal(asked(answer("lv-product"), elsewhere), false);
  const lost = answer("scalar-fft-mtf", [{}, { sagittal: raised(-0.25), sampling: { rimRaysLost: 1 } }, {}]);
  assert.equal(asked(answer("lv-product"), lost), false);
  // Answers that cannot be compared ask for nothing.
  assert.equal(asked(lv(0.25), { ...flat, fields: flat.fields.slice(0, 1) }), false);
});
