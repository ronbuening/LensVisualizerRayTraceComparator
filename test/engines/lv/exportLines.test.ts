import assert from "node:assert/strict";
import { test } from "node:test";

import type { RunLines } from "../../../src/contract/runSpec.ts";
import { exportLight } from "../../../src/engines/lv/exportLines.ts";
import type { CaseLight, LightResult } from "../../../src/engines/lv/exportLines.ts";
import type { LvExportApi } from "../../../src/engines/lv/exportCase.ts";
import type { LvMtfOptions, LvPreparedState } from "../../../src/engines/lv/types.ts";
import { CDF, FLAT, LINES_NM, PHOTOPIC, apiFor, gate, resolvedIndex, stateOf } from "./exportSupport.ts";
import type { GateSpec, StateSpec } from "./exportSupport.ts";

/** Two glasses and the air around them; the indices are exact in binary, so sums of them are too. */
const GLASSES = [1.5, 1, 1.75, 1];

function lensState(spec: Partial<StateSpec> = {}): LvPreparedState {
  return stateOf(
    [
      { label: "1", R: 40, d: 3, nd: GLASSES[0] },
      { label: "STO", R: FLAT, d: 2, sd: 4 },
      { label: "3", R: -50, d: 2, nd: GLASSES[2] },
      { label: "4", R: 90, d: 40 },
    ],
    { stopIndex: 1, ...spec },
  );
}

/** `exportLight` for the test lens under a gate. */
function light(
  lines: RunLines | undefined,
  gateSpec: GateSpec = {},
  stateSpec: Partial<StateSpec> = {},
  overrides: Partial<LvExportApi> = {},
): LightResult {
  const state = lensState(stateSpec);
  return exportLight(apiFor(state, { assessMtfSupport: gate(gateSpec), ...overrides }), state, lines, 4);
}

function exported(result: LightResult): CaseLight {
  assert.ok(result.ok, JSON.stringify(result));
  return result.light;
}

function problemsOf(result: LightResult): { code: string; message: string }[] {
  assert.ok(!result.ok, "expected problems");
  return result.problems;
}

/** The rows of an index table. */
function rows(table: Float64Array, lines: number): number[][] {
  const columns = table.length / lines;
  return Array.from({ length: lines }, (_unused, row) => [...table.subarray(row * columns, (row + 1) * columns)]);
}

// ── Lines and indices ────────────────────────────────────────────────────────────────────────────────────────────

test("the reference line, and no lines at all, is LensVisualizer's one line with the authored indices", () => {
  for (const lines of [undefined, { kind: "reference" }] as const) {
    const { object, lines: exportedLines, indexAfterSurface } = exported(light(lines));
    assert.deepEqual(object, { kind: "infinity" });
    assert.deepEqual(exportedLines, [{ wavelengthNm: LINES_NM.d, weight: 1, indexSource: "authored" }]);
    assert.deepEqual([...indexAfterSurface], GLASSES);
  }
});

test("an all-e lens has the e line as its reference line, with the authored indices", () => {
  const { lines } = exported(light({ kind: "reference" }, { referenceNm: LINES_NM.e }));
  assert.deepEqual(lines, [{ wavelengthNm: 546.074, weight: 1, indexSource: "authored" }]);
});

test("mixed references are traced with resolved indices even on the reference line: the source is anchored", () => {
  const { lines, indexAfterSurface } = exported(light({ kind: "reference" }, { mixed: true }));
  assert.deepEqual(lines, [{ wavelengthNm: LINES_NM.d, weight: 1, indexSource: "anchored" }]);
  assert.deepEqual(
    [...indexAfterSurface],
    GLASSES.map((nd) => resolvedIndex(nd, LINES_NM.d)),
  );
});

test("the photopic lines are LensVisualizer's five, with its weights, each with the resolver's indices", () => {
  const { lines, indexAfterSurface } = exported(light({ kind: "photopic" }));
  assert.deepEqual(
    lines,
    PHOTOPIC.map((line) => ({ ...line, indexSource: "anchored" })),
  );
  assert.deepEqual(
    lines.map((line) => [line.wavelengthNm, line.weight]),
    [
      [555, 1],
      [470, 0.091],
      [510, 0.503],
      [610, 0.503],
      [650, 0.107],
    ],
  );
  assert.equal(indexAfterSurface.length, 5 * 4);
  assert.deepEqual(
    rows(indexAfterSurface, 5),
    PHOTOPIC.map((line) => GLASSES.map((nd) => resolvedIndex(nd, line.wavelengthNm))),
  );
  // Air is exactly 1 at every line.
  for (const row of rows(indexAfterSurface, 5)) assert.deepEqual([row[1], row[3]], [1, 1]);
});

test("the C/d/F lines are LensVisualizer's three at a third each, d first", () => {
  const { lines } = exported(light({ kind: "cdf" }));
  assert.deepEqual(
    lines,
    CDF.map((line) => ({ ...line, indexSource: "anchored" })),
  );
  assert.equal(lines[0].wavelengthNm, LINES_NM.d);
});

test("the gate is asked for the spectrum of the run, with the seed radius and nothing that needs a trace", () => {
  const asked: LvMtfOptions[] = [];
  const state = lensState();
  const recording: Partial<LvExportApi> = {
    assessMtfSupport: (prepared, options) => {
      asked.push(options);
      return gate()(prepared, options);
    },
  };
  for (const lines of [undefined, { kind: "cdf" }, { kind: "photopic" }, { kind: "explicit", wavelengthsNm: [500] }]) {
    exportLight(apiFor(state, recording), state, lines as RunLines | undefined, 4.25);
  }
  assert.deepEqual(
    asked.map((options) => options.spectrum),
    ["reference", "cdf", "photopic", "cdf"],
  );
  for (const options of asked) {
    assert.deepEqual(
      { ...options, spectrum: "" },
      { method: "geometric", spectrum: "", pupilSemiDiameterMm: 4.25, stopSemiDiameterMm: 4.25, focus: "design" },
    );
  }
});

// ── Explicit wavelengths ─────────────────────────────────────────────────────────────────────────────────────────

test("explicit wavelengths take the spectral path: the first is the reference line, each index is the resolver's", () => {
  const { lines, indexAfterSurface } = exported(
    light({ kind: "explicit", wavelengthsNm: [LINES_NM.C, LINES_NM.d, LINES_NM.F], weights: [1, 2, 1] }),
  );
  assert.deepEqual(lines, [
    { wavelengthNm: LINES_NM.C, weight: 1, indexSource: "anchored" },
    { wavelengthNm: LINES_NM.d, weight: 2, indexSource: "anchored" },
    { wavelengthNm: LINES_NM.F, weight: 1, indexSource: "anchored" },
  ]);
  assert.deepEqual(
    rows(indexAfterSurface, 3),
    [LINES_NM.C, LINES_NM.d, LINES_NM.F].map((nm) => GLASSES.map((nd) => resolvedIndex(nd, nm))),
  );
});

test("explicit wavelengths without weights weigh the same", () => {
  const { lines } = exported(light({ kind: "explicit", wavelengthsNm: [500, 600] }));
  assert.deepEqual(
    lines.map((line) => line.weight),
    [1, 1],
  );
});

test("an explicit wavelength outside LensVisualizer's g to C lines is a problem; the two lines themselves are in", () => {
  exported(light({ kind: "explicit", wavelengthsNm: [LINES_NM.g, LINES_NM.C] }));
  assert.deepEqual(problemsOf(light({ kind: "explicit", wavelengthsNm: [550, 400, 700.5] })), [
    {
      code: "wavelength-outside-fitted-range",
      message:
        "400, 700.5 nm is outside 435.8343 to 656.2725 nm, the lines LensVisualizer's indices are fitted between",
    },
  ]);
});

test("explicit wavelengths are a problem where LensVisualizer has no spectral data for the lens", () => {
  assert.deepEqual(
    problemsOf(light({ kind: "explicit", wavelengthsNm: [550] }, { reason: "spectral-data-unavailable" })),
    [{ code: "spectral-data-unavailable", message: "LV says spectral-data-unavailable." }],
  );
});

test("an explicit wavelength that LensVisualizer gives no resolver is refused, not exported with authored indices", () => {
  assert.throws(
    () => light({ kind: "explicit", wavelengthsNm: [550] }, {}, {}, { mtfIndexResolver: () => undefined }),
    /gives no index resolver for the explicit wavelength 550 nm/,
  );
});

// ── What LensVisualizer's gate refuses ───────────────────────────────────────────────────────────────────────────

test("a reason of LensVisualizer's gate is the problem's code, with LensVisualizer's own message", () => {
  for (const reason of ["mixed-reference", "spectral-data-unavailable", "a-reason-added-later"]) {
    assert.deepEqual(problemsOf(light({ kind: "photopic" }, { reason })), [
      { code: reason, message: `LV says ${reason}.` },
    ]);
  }
});

test("a path LensVisualizer's MTF does not cover is exported on the reference line when the contract expresses it", () => {
  for (const stateSpec of [{ projection: "fisheye-equisolid" }, { projection: "fisheye-equidistant" }]) {
    const { lines, indexAfterSurface } = exported(
      light({ kind: "reference" }, { reason: "unsupported-path" }, stateSpec),
    );
    assert.deepEqual(lines, [{ wavelengthNm: LINES_NM.d, weight: 1, indexSource: "authored" }]);
    assert.deepEqual([...indexAfterSurface], GLASSES);
  }
  // An annular aperture is the other cause the contract can express.
  const annular = stateOf(
    [
      { label: "1", R: 40, d: 3, nd: 1.5, innerSd: 2 },
      { label: "STO", R: FLAT, d: 40 },
    ],
    { stopIndex: 1 },
  );
  const api = apiFor(annular, { assessMtfSupport: gate({ reason: "unsupported-path" }) });
  assert.equal(exportLight(api, annular, undefined, 4).ok, true);
});

test("such a path has no per-wavelength indices: several lines, and mixed references, are LensVisualizer's refusal", () => {
  const fisheye = { projection: "fisheye-equisolid" };
  for (const lines of [{ kind: "photopic" }, { kind: "cdf" }, { kind: "explicit", wavelengthsNm: [550] }] as const) {
    const [problem, ...more] = problemsOf(light(lines, { reason: "unsupported-path" }, fisheye));
    assert.deepEqual(more, []);
    assert.equal(problem.code, "unsupported-path");
    assert.match(problem.message, /does not cover this lens \(LV says unsupported-path\.\); only the reference line/);
  }
  const [mixed] = problemsOf(light({ kind: "reference" }, { reason: "unsupported-path", mixed: true }, fisheye));
  assert.equal(mixed.code, "unsupported-path");
});

test("an unsupported path that the contract's own cases do not explain is never exported", () => {
  const [problem, ...more] = problemsOf(light({ kind: "reference" }, { reason: "unsupported-path" }));
  assert.deepEqual(more, []);
  assert.equal(problem.code, "unsupported-path");
  assert.match(problem.message, /for a reason the exporter does not know: LV says unsupported-path\./);
});

test("a prescription whose scale LensVisualizer does not trust is exported on the reference line only", () => {
  const { lines } = exported(light({ kind: "reference" }, { reason: "unverified-scale" }));
  assert.deepEqual(lines, [{ wavelengthNm: LINES_NM.d, weight: 1, indexSource: "authored" }]);
  const [problem] = problemsOf(light({ kind: "photopic" }, { reason: "unverified-scale" }));
  assert.equal(problem.code, "unverified-scale");
});

test("a request LensVisualizer calls invalid is the exporter's defect, and is thrown", () => {
  for (const reason of ["invalid-input", "active-movement"]) {
    assert.throws(() => light(undefined, { reason }), new RegExp(`refuses the exporter's own request \\(${reason}\\)`));
  }
});

test("a first line that is not LensVisualizer's reference line is refused", () => {
  const skewed: Partial<LvExportApi> = {
    assessMtfSupport: (state, options) => ({ ...gate()(state, options), referenceWavelengthNm: 500 }),
  };
  assert.throws(
    () => light({ kind: "cdf" }, {}, {}, skewed),
    /first line \(587\.5618 nm\) is not its reference line \(500 nm\)/,
  );
});

// ── The object ───────────────────────────────────────────────────────────────────────────────────────────────────

const CONJUGATE = { focusT: 0.5, zoomT: 0, objectDistanceMm: 480, distanceReference: "first-surface" };

test("a refocused state that LensVisualizer certifies has its object at the certified point", () => {
  const { object, lines } = exported(light(undefined, { conjugate: CONJUGATE }, { focusT: 0.5 }));
  assert.deepEqual(object, { kind: "finite", z: -480 });
  assert.equal(lines.length, 1);
  // The point is LensVisualizer's, whatever convention it applies to the distance.
  const fromImage: Partial<LvExportApi> = { mtfFiniteObjectPoint: (state) => [0, -0, state.imgZ - 480] };
  const moved = exported(light(undefined, { conjugate: CONJUGATE }, { focusT: 0.5 }, fromImage));
  assert.deepEqual(moved.object, { kind: "finite", z: 47 - 480 });
});

test("a refocused state without a certified conjugate is never exported with its object at infinity", () => {
  const [problem, ...more] = problemsOf(light(undefined, {}, { focusT: 0.5, zoomT: 1 }));
  assert.deepEqual(more, []);
  assert.equal(problem.code, "finite-conjugate-unavailable");
  assert.equal(
    problem.message,
    "focus position 0.5 at zoom 1 is not a station whose object distance LensVisualizer certifies; " +
      "only infinity focus and its documented stations can be exported",
  );
});

test("a conjugate whose object point LensVisualizer cannot place is the same problem", () => {
  const unplaced: Partial<LvExportApi> = { mtfFiniteObjectPoint: () => null };
  const [problem] = problemsOf(light(undefined, { conjugate: CONJUGATE }, { focusT: 0.5 }, unplaced));
  assert.equal(problem.code, "finite-conjugate-unavailable");
});

test("a refocused lens outside LensVisualizer's MTF path has no certified conjugate, and is not exported", () => {
  const problems = problemsOf(
    light(
      undefined,
      { reason: "unsupported-path", conjugate: CONJUGATE },
      { focusT: 0.5, projection: "fisheye-equisolid" },
    ),
  );
  assert.deepEqual(
    problems.map((problem) => problem.code),
    ["finite-conjugate-unavailable"],
  );
});

test("a problem of the object and a problem of the lines are both reported", () => {
  const problems = problemsOf(
    light(
      { kind: "photopic" },
      { reason: "spectral-data-unavailable", conjugate: CONJUGATE },
      { focusT: 0.5 },
      {
        mtfFiniteObjectPoint: () => null,
      },
    ),
  );
  assert.deepEqual(
    problems.map((problem) => problem.code),
    ["finite-conjugate-unavailable", "spectral-data-unavailable"],
  );
});

test("infinity focus needs no conjugate, and LensVisualizer's object function is not asked", () => {
  const never: Partial<LvExportApi> = {
    mtfFiniteObjectPoint: () => assert.fail("the object point was asked for at infinity focus"),
  };
  assert.deepEqual(exported(light(undefined, {}, {}, never)).object, { kind: "infinity" });
});
