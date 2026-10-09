// The comparator of `mtf.native` for rung R6b: two answers to one request for a diffraction MTF, set beside each
// other. Every answer here is synthetic: curves written out in the test, so that each figure is a subtraction.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric, UnmeasuredMetric } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { WAVE_SAMPLING, mtfWaveComparator, waveDifferenceClass } from "../../src/compare/mtfWave.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type {
  MtfFieldStatus,
  MtfNativeData,
  MtfNativeField,
  MtfNativeSpec,
} from "../../src/contract/quantities/mtfNative.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { mtfNativeQuantity } from "../../src/quantities/mtfNative.ts";

const R6B = loadPolicy().rungs.r6b;
const SPEC: MtfNativeSpec = {
  frequenciesPerMm: [10, 30, 50],
  fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
  method: "diffraction",
  focus: "design",
};
const CONTEXT: ComparisonContext = { spec: SPEC };

/** What a field of an answer is made of here; whatever is left out is a field the engine stands by. */
interface FieldOf {
  readonly sagittal?: readonly number[];
  readonly tangential?: readonly number[];
  readonly status?: MtfFieldStatus;
  readonly reason?: string;
  readonly sampling?: { readonly [name: string]: number };
}

const FLAT = [0.9, 0.7, 0.5];

function field(requested: number, of: FieldOf = {}): MtfNativeField {
  const unavailable = of.status === "unavailable";
  const curve = (values: readonly number[] = FLAT) =>
    encodeNdArray(Float64Array.from(unavailable ? values.map(() => Number.NaN) : values));
  return {
    field: requested,
    fieldAngleDeg: 10 * requested,
    imageHeightMm: 20 * requested,
    sagittal: curve(of.sagittal),
    tangential: curve(of.tangential),
    status: of.status ?? "ok",
    ...(of.reason === undefined ? {} : { reason: of.reason }),
    sampling: of.sampling ?? {},
  };
}

/** An answer of the engine whose method is `name`, with the three fields of `SPEC`. */
function answer(name: string, fields: readonly [FieldOf, FieldOf, FieldOf] = [{}, {}, {}], shiftMm = 0): MtfNativeData {
  const data: MtfNativeData = {
    fields: SPEC.fields.values.map((requested, index) => field(requested, fields[index])),
    method: { name, params: {} },
    focus: { mode: shiftMm === 0 ? "design" : "best-axial", appliedShiftMm: shiftMm },
    aperture: {},
    lines: [{ wavelengthNm: 587.5618, weight: 1 }],
    notes: [],
  };
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  return data;
}

function compared(a: MtfNativeData, b: MtfNativeData, context: ComparisonContext = CONTEXT) {
  const outcome = mtfWaveComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(mtfWaveComparator.compare(b, a, context), outcome, "swapping the two changes nothing");
  const metrics: Record<string, ComputedMetric> = Object.fromEntries(
    outcome.metrics.map((metric) => [metric.name, metric]),
  );
  const unmeasured: readonly UnmeasuredMetric[] = outcome.unmeasured ?? [];
  return { metrics, unmeasured };
}

function reasonOf(a: MtfNativeData, b: MtfNativeData): string {
  const outcome = mtfWaveComparator.compare(a, b, CONTEXT);
  assert.ok(!outcome.comparable);
  assert.deepEqual(mtfWaveComparator.compare(b, a, CONTEXT), outcome, "swapping the two changes nothing");
  return outcome.reason;
}

function engine(id: string, data: MtfNativeData): ParticipantResult {
  return { engine: id, fingerprint: `${id} sources`, status: "ok", data };
}

function judged(a: MtfNativeData, b: MtfNativeData) {
  return comparePair(engine("lv", a), engine("wave", b), R6B, mtfWaveComparator, undefined, CONTEXT);
}

/** Holds a figure to a difference of two decimals, each a double to half a unit in its last place. */
function close(metric: ComputedMetric, expected: number): void {
  assert.ok(Math.abs(metric.value - expected) <= 2 ** -52, `${metric.name}: ${metric.value} against ${expected}`);
}

test("the comparator is of mtf.native for rung r6b, and the policy records its two bands", () => {
  assert.equal(mtfWaveComparator.quantity, "mtf.native");
  assert.equal(mtfWaveComparator.rung, "r6b");
  assert.equal(COMPARATORS.get("mtf.native", "r6b"), mtfWaveComparator);
  assert.deepEqual(
    mtfWaveComparator.metrics.map((metric) => `${metric.name} ${metric.unit}`),
    [
      "mtfOnAxis.maxAbs 1",
      "mtfOffAxis.maxAbs 1",
      "mtfFlagged.maxAbs 1",
      "fields.compared elements",
      "fields.flagged elements",
      "fields.unavailable elements",
    ],
  );
  assert.deepEqual([R6B.quantity, R6B.mode, R6B.class], ["mtf.native", "independent-method", "recorded"]);
  // The plan's attention band: 0.005 on the axis and 0.01 off it. A recorded rung has no tolerance and no floor.
  assert.deepEqual(R6B.metrics, {
    "mtfOffAxis.maxAbs": { attention: 0.01, unit: "1" },
    "mtfOnAxis.maxAbs": { attention: 0.005, unit: "1" },
  });
  assert.equal(R6B.floor, undefined);
  assert.equal(R6B.blocksLaterRungs, undefined);
});

test("two answers that stand by every field: a figure on the axis and one off it, each with its place", () => {
  const lv = answer("sheared");
  const wave = answer("hopkins", [
    { sagittal: [0.9, 0.704, 0.5] },
    { tangential: [0.9, 0.7, 0.492] },
    { sagittal: [0.903, 0.7, 0.5], tangential: [0.9, 0.706, 0.5] },
  ]);
  const { metrics, unmeasured } = compared(lv, wave);
  assert.deepEqual(unmeasured, []);
  close(metrics["mtfOnAxis.maxAbs"], 0.004);
  assert.deepEqual(metrics["mtfOnAxis.maxAbs"].where, { field: 0, cut: "sagittal", frequencyPerMm: 30 });
  // Off the axis the larger of the two fields: half field, tangential, 50 cycles a millimetre.
  close(metrics["mtfOffAxis.maxAbs"], 0.008);
  assert.deepEqual(metrics["mtfOffAxis.maxAbs"].where, { field: 0.5, cut: "tangential", frequencyPerMm: 50 });
  assert.equal(metrics["mtfFlagged.maxAbs"], undefined);
  assert.deepEqual(
    ["fields.compared", "fields.flagged", "fields.unavailable"].map((name) => metrics[name].value),
    [3, 0, 0],
  );
  // Both figures are inside their bands: recorded, and nothing to say.
  const pair = judged(lv, wave);
  assert.equal(pair.verdict, "RECORDED");
  assert.equal(pair.class, "recorded");
  assert.equal(pair.reason, undefined);
  // Without the request the place is an index.
  assert.deepEqual(compared(lv, wave, {}).metrics["mtfOnAxis.maxAbs"].where, {
    field: 0,
    cut: "sagittal",
    frequencyIndex: 1,
  });
});

test("a figure outside its band is marked for attention and fails nothing; the bands are 0.005 and 0.01", () => {
  const lv = answer("sheared");
  // 0.006 on the axis is outside 0.005; 0.006 off the axis is inside 0.01.
  const onAxis = answer("hopkins", [{ sagittal: [0.9, 0.706, 0.5] }, { sagittal: [0.9, 0.706, 0.5] }, {}]);
  const marked = judged(lv, onAxis);
  assert.equal(marked.verdict, "ATTENTION");
  assert.match(
    marked.reason ?? "",
    /^mtfOnAxis\.maxAbs 6\.00e-3 is outside its attention band 5\.00e-3 at cut sagittal, field 0, frequencyPerMm 30$/,
  );
  const offAxis = answer("hopkins", [{}, {}, { tangential: [0.9, 0.7, 0.512] }]);
  const far = judged(lv, offAxis);
  assert.equal(far.verdict, "ATTENTION");
  assert.match(
    far.reason ?? "",
    /^mtfOffAxis\.maxAbs 1\.20e-2 is outside its attention band 1\.00e-2 at cut tangential, field 1, /,
  );
});

test("a field an answer does not stand by is in no band: its figure is written down as flagged, with why", () => {
  const lv = answer("sheared");
  const wave = answer("hopkins", [
    { sagittal: [0.9, 0.75, 0.5], status: "unconverged", reason: "undersampled" },
    { tangential: [0.9, 0.7, 0.497] },
    { tangential: [0.8, 0.7, 0.5], status: "unconverged", reason: "not-converged" },
  ]);
  assert.equal(waveDifferenceClass(lv.fields[0], wave.fields[0]), "numerical");
  assert.equal(waveDifferenceClass(lv.fields[1], wave.fields[1]), "method");
  const { metrics, unmeasured } = compared(lv, wave);
  // The largest of the two flagged fields: 0.1 at full field, where the axis has 0.05.
  close(metrics["mtfFlagged.maxAbs"], 0.1);
  assert.deepEqual(metrics["mtfFlagged.maxAbs"].where, { field: 1, cut: "tangential", frequencyPerMm: 10 });
  close(metrics["mtfOffAxis.maxAbs"], 0.003);
  assert.equal(metrics["mtfOnAxis.maxAbs"], undefined);
  assert.deepEqual(
    ["fields.compared", "fields.flagged", "fields.unavailable"].map((name) => metrics[name].value),
    [1, 2, 0],
  );
  assert.deepEqual(unmeasured, [
    {
      name: "mtfOnAxis.maxAbs",
      reason: "no field on the axis has curves both answers stand by: field 0: hopkins: unconverged (undersampled)",
    },
  ]);
  // A flagged figure of 0.1 is in no band: the pair is recorded, and says what was not measured.
  const pair = judged(lv, wave);
  assert.equal(pair.verdict, "RECORDED");
  assert.match(
    pair.reason ?? "",
    /^mtfOnAxis\.maxAbs was not measured: no field on the axis has curves both answers stand by/,
  );

  // Either answer may be the one that does not stand by a field, and both are named, in the order of their methods.
  const unsettled = answer("sheared", [{ status: "unconverged" }, {}, {}]);
  assert.match(
    compared(unsettled, wave).unmeasured[0].reason,
    /field 0: hopkins: unconverged \(undersampled\); sheared: unconverged$/,
  );
});

test("a field an answer has no curve of is counted and compared with nothing", () => {
  const lv = answer("sheared", [{}, { status: "unavailable", reason: "vignetted" }, {}]);
  const wave = answer("hopkins", [{}, {}, { status: "unavailable", reason: "no-flux" }]);
  assert.equal(waveDifferenceClass(lv.fields[1], wave.fields[1]), "unsupported");
  const { metrics, unmeasured } = compared(lv, wave);
  assert.equal(metrics["mtfOnAxis.maxAbs"].value, 0);
  assert.equal(metrics["mtfOffAxis.maxAbs"], undefined);
  assert.equal(metrics["mtfFlagged.maxAbs"], undefined);
  assert.deepEqual(
    ["fields.compared", "fields.flagged", "fields.unavailable"].map((name) => metrics[name].value),
    [1, 0, 2],
  );
  assert.deepEqual(unmeasured, [
    {
      name: "mtfOffAxis.maxAbs",
      reason:
        "no field off the axis has curves both answers stand by: field 0.5: sheared: unavailable (vignetted), " +
        "field 1: hopkins: unavailable (no-flux)",
    },
  ]);
  assert.equal(judged(lv, wave).verdict, "RECORDED");
});

test("what each answer states of its sampling is recorded, a value a field, with whether it stands by the field", () => {
  const data = answer("hopkins", [
    { sampling: { gridSize: 64, validRays: 3000, maxDelta: 0.002, phaseStepWaves: 0.01 } },
    { status: "unconverged", reason: "undersampled", sampling: { gridSize: 64, phaseStepWaves: 0.4 } },
    { status: "unavailable", reason: "vignetted" },
  ]);
  assert.deepEqual(WAVE_SAMPLING, ["gridSize", "validRays", "maxDelta", "phaseStepWaves", "convergedThroughLpMm"]);
  assert.deepEqual(mtfWaveComparator.recorded?.(data), {
    gridSize: [64, 64, Number.NaN],
    validRays: [3000, Number.NaN, Number.NaN],
    maxDelta: [0.002, Number.NaN, Number.NaN],
    phaseStepWaves: [0.01, 0.4, Number.NaN],
    convergedThroughLpMm: [Number.NaN, Number.NaN, Number.NaN],
    settled: [1, 0, Number.NaN],
  });
});

test("not comparable: other fields, other planes, curves of other lengths", () => {
  const lv = answer("sheared");
  const fewer = { ...lv, fields: lv.fields.slice(0, 2) };
  assert.match(reasonOf(lv, fewer), /^the answers are for 2 and 3 fields: they answer different requests$/);
  const other = { ...lv, fields: [lv.fields[0], { ...lv.fields[1], field: 0.75 }, lv.fields[2]] };
  assert.equal(reasonOf(lv, other), "field 1 is 0.5 in one answer and 0.75 in the other");
  assert.equal(
    reasonOf(lv, answer("hopkins", [{}, {}, {}], 0.02)),
    "the answers are of different planes: best-axial at 0.02 mm and design at 0 mm",
  );
  const short = answer("hopkins");
  const [first] = short.fields;
  const cut = {
    ...short,
    fields: [{ ...first, sagittal: encodeNdArray(Float64Array.of(0.9, 0.7)) }, ...short.fields.slice(1)],
  };
  assert.equal(reasonOf(lv, cut), "the sagittal curves of field 0 hold 2 and 3 values");
});
