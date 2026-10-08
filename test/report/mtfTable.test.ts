// The table `lvrtc mtf` prints for one engine's answer, from answers built by hand: the contract's own examples.
// Every number is synthetic.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { MtfNativeData } from "../../src/contract/quantities/mtfNative.ts";
import { mtfTableRows, mtfTableText } from "../../src/report/mtfTable.ts";
import {
  ALL_FEATURES_CASE,
  MTF_DATA_BEST_FOCUS,
  MTF_DATA_FRACTIONS,
  MTF_SPEC_FRACTIONS,
  MTF_SPEC_PROFILE,
  edited,
} from "../contract/corpus.ts";

test("a row per field with its height, angle, status and curves at the shown frequencies; then what the engine says", () => {
  const text = mtfTableText({
    spec: MTF_SPEC_FRACTIONS,
    data: MTF_DATA_FRACTIONS,
    displayedFrequenciesPerMm: [10, 30],
  });
  assert.equal(
    text,
    [
      "field  height mm  angle deg  status         S 10    T 10    S 30    T 30  reason",
      "0          0.000      0.000  ok           0.8750  0.8750  0.5000  0.5000",
      "0.5       10.750     12.500  unconverged  0.7500  0.6875  0.3750  0.2500",
      "1              -          -  unavailable       -       -       -       -  outside-modeled-field",
      "",
      "method    ray-sum",
      "          gridCap 128",
      "focus     design, shift 0.0000 mm",
      "aperture  -",
      "lines     587.5618 nm (1)",
      "",
    ].join("\n"),
  );
});

test("the shown frequencies are picked from the request's, a limiting surface is named by its label, notes follow", () => {
  const input = { spec: MTF_SPEC_PROFILE, data: MTF_DATA_BEST_FOCUS, displayedFrequenciesPerMm: [10, 40] };
  const text = mtfTableText({ ...input, opticalCase: ALL_FEATURES_CASE });
  assert.equal(
    text,
    [
      "field  height mm  angle deg  status    S 10    T 10    S 40    T 40",
      "0          0.000      0.000  ok      0.8750  0.8750  0.5000  0.5000",
      "10        17.500     10.000  ok      0.8125  0.7500  0.4375  0.3750",
      "14        24.500     14.000  ok      0.7500  0.6250  0.3750  0.2500",
      "",
      "method    pupil-autocorrelation",
      "          displayedFrequenciesPerMm 10 40",
      "          profile some-engine-default",
      "          spectrum three-line",
      "focus     best-axial, shift -0.0313 mm",
      "aperture  traced f/2.0625, limited by surface 4",
      "lines     550 nm (1), 480 nm (0.25), 620 nm (0.5)",
      "note      The dispersion of one glass is estimated.",
      "",
    ].join("\n"),
  );
  // Without the case a surface has no label to be named by; with it, the stop is called the stop.
  assert.match(mtfTableText(input), /^aperture {2}traced f\/2\.0625, limited by surface index 3$/m);
  const atStop = edited(MTF_DATA_BEST_FOCUS, "/aperture/limitingSurfaceIndex", ALL_FEATURES_CASE.system.stopIndex);
  assert.match(
    mtfTableText({ ...input, data: atStop as MtfNativeData, opticalCase: ALL_FEATURES_CASE }),
    /^aperture {2}traced f\/2\.0625, limited by surface STO, the stop$/m,
  );
  // Whatever else an engine records of its aperture is listed by name, and a shift away from the lens has its sign.
  const more = edited(
    edited(MTF_DATA_BEST_FOCUS, "/aperture", { workingFNumber: 2.125 }),
    "/focus/appliedShiftMm",
    0.125,
  ) as MtfNativeData;
  const said = mtfTableText({ ...input, data: more });
  assert.match(said, /^aperture {2}workingFNumber 2\.125$/m);
  assert.match(said, /^focus {5}best-axial, shift \+0\.1250 mm$/m);
});

test("one frequency, every frequency, and no reason column where no field states one", () => {
  const one = mtfTableText({ spec: MTF_SPEC_PROFILE, data: MTF_DATA_BEST_FOCUS, displayedFrequenciesPerMm: [0] });
  assert.equal(one.split("\n")[0], "field  height mm  angle deg  status     S 0     T 0");
  assert.equal(one.split("\n")[1], "0          0.000      0.000  ok      1.0000  1.0000");
  const every = mtfTableText({
    spec: MTF_SPEC_PROFILE,
    data: MTF_DATA_BEST_FOCUS,
    displayedFrequenciesPerMm: MTF_SPEC_PROFILE.frequenciesPerMm,
  });
  assert.equal(
    every.split("\n")[0],
    "field  height mm  angle deg  status     S 0     T 0    S 10    T 10    S 20    T 20    S 40    T 40",
  );
});

test("the rows are the answer's numbers, with null where it holds a NaN", () => {
  const rows = mtfTableRows({ spec: MTF_SPEC_FRACTIONS, data: MTF_DATA_FRACTIONS, displayedFrequenciesPerMm: [30] });
  assert.deepEqual(rows, [
    { field: 0, imageHeightMm: 0, fieldAngleDeg: 0, status: "ok", sagittal: [0.5], tangential: [0.5] },
    {
      field: 0.5,
      imageHeightMm: 10.75,
      fieldAngleDeg: 12.5,
      status: "unconverged",
      sagittal: [0.375],
      tangential: [0.25],
    },
    {
      field: 1,
      imageHeightMm: null,
      fieldAngleDeg: null,
      status: "unavailable",
      reason: "outside-modeled-field",
      sagittal: [null],
      tangential: [null],
    },
  ]);
});

test("a frequency that was not asked for cannot be shown, nor an answer to another request", () => {
  const input = { spec: MTF_SPEC_FRACTIONS, data: MTF_DATA_FRACTIONS };
  assert.throws(() => mtfTableText({ ...input, displayedFrequenciesPerMm: [10, 20] }), {
    message: "20 cycles/mm is to be shown and is not a frequency of the request",
  });
  assert.throws(
    () => mtfTableRows({ spec: MTF_SPEC_PROFILE, data: MTF_DATA_FRACTIONS, displayedFrequenciesPerMm: [10] }),
    { message: "a curve of the field 0 has 2 values for 4 frequencies" },
  );
});
