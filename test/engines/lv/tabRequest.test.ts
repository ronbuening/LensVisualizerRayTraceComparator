// The request of LensVisualizer's MTF tab as the comparator restates it, against stand-ins for the functions and the
// defaults the tab reads: the arithmetic of the hook in its order of operations, the fields, the f/8 comparison and
// the spec the request is. Every number is synthetic; the canaries of test/integration/lv hold the restated lines to
// LensVisualizer's own.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  LV_TAB_COMPARISON_F_NUMBER,
  LV_TAB_PROFILE,
  lvHookAperture,
  lvHookStop,
  lvPupilSeed,
  lvTabComparison,
  lvTabFieldFractions,
  lvTabRequest,
  lvTabSpec,
} from "../../../src/engines/lv/tabRequest.ts";
import type { LvTabApi } from "../../../src/engines/lv/tabRequest.ts";
import type { LvMtfPreferences, LvPreparedState, LvRuntimeLens } from "../../../src/engines/lv/types.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import { stateOf } from "./exportSupport.ts";

const PREFERENCES: LvMtfPreferences = {
  method: "diffraction",
  spectrum: "photopic",
  focus: "best-axial",
  fieldStepPercent: 25,
  frequencies: [20, 40],
  maxGridSize: 64,
  compareF8: false,
};

/** What a stand-in lens is: its iris wide open, its widest f-number, its slowest, and its pupil ratio. */
interface Lens {
  readonly wideOpen: number;
  readonly fopen: number;
  readonly maxFstop?: number;
  readonly yRatio?: number;
  readonly preferences?: Partial<LvMtfPreferences>;
  /** The spectrum the lens has the glass data for, when it is not the preferred one. */
  readonly fallback?: string;
}

/** The calls a stand-in was made with, in order. */
type Calls = unknown[][];

function standIn(lens: Lens): { api: LvTabApi; runtime: LvRuntimeLens; state: LvPreparedState; calls: Calls } {
  const calls: Calls = [];
  const geometry = { yRatio: lens.yRatio ?? 1, analysis: true };
  const state = stateOf([{ label: "STO", R: 1e15, d: 50 }], { stopIndex: 0, zoomT: 0.5 });
  const runtime: LvRuntimeLens = { ...state.lens.runtime, maxFstop: lens.maxFstop ?? 16 };
  const api: LvTabApi = {
    wideOpenStopAtZoom: (zoomT, L) => (calls.push(["wideOpenStopAtZoom", zoomT, L]), lens.wideOpen),
    fopenAtZoom2: (zoomT, L) => (calls.push(["fopenAtZoom2", zoomT, L]), lens.fopen),
    // As LensVisualizer's: the slider's f-number, never below the widest of the zoom state.
    fNumberAtStopdown: (stopdownT, zoomT, L) => {
      calls.push(["fNumberAtStopdown", stopdownT, zoomT, L]);
      return Math.max(lens.fopen * Math.pow(L.maxFstop / lens.fopen, stopdownT), lens.fopen);
    },
    computeAnalysisFieldGeometryAtState2: (focusT, zoomT, L, aberrationT) => {
      calls.push(["computeAnalysisFieldGeometryAtState2", focusT, zoomT, L, aberrationT]);
      return geometry;
    },
    entrancePupilAtState2: (stopSD, focusT, zoomT, L, given, aberrationT) => {
      calls.push(["entrancePupilAtState2", stopSD, focusT, zoomT, L, given, aberrationT]);
      const yRatio = given?.yRatio ?? Number.NaN;
      return { epSD: Math.abs(stopSD / yRatio), yRatio, b: 0, epRatio: 1 };
    },
    resolveMtfSpectrum: (asked, preferred) => {
      calls.push(["resolveMtfSpectrum", asked, preferred]);
      return lens.fallback === undefined
        ? { spectrum: preferred, note: null }
        : { spectrum: lens.fallback, note: `no glass data for ${preferred}` };
    },
    mtfDefaultPreferences: { ...PREFERENCES, ...lens.preferences },
    mtfDefaultFrequencies: [0, 10, 20, 30, 40, 50],
  };
  return { api, runtime, state, calls };
}

// ── The hook ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("the hook's numbers are its own expressions, on its own functions, with the slider at wide open", () => {
  const { api, runtime, state, calls } = standIn({ wideOpen: 6.25, fopen: 2.8, yRatio: 0.8 });
  const hook = lvHookAperture(api, runtime, state);
  assert.deepEqual(hook, {
    currentFOPEN: 2.8,
    fNumber: 2.8,
    wideOpenStopSD: 6.25,
    currentPhysStopSD: (6.25 * 2.8) / 2.8,
    baseEPSD: 6.25 / 0.8,
    currentEPSD: ((6.25 / 0.8) * 2.8) / 2.8,
  });
  // Every function is asked at the state's zoom and focus position; the slider is at 0 and the aberration control
  // neutral; and the entrance pupil is that of the wide-open iris, found with the analysis field geometry.
  const geometry = { yRatio: 0.8, analysis: true };
  assert.deepEqual(
    calls.toSorted(([a], [b]) => (String(a) < String(b) ? -1 : 1)),
    [
      ["computeAnalysisFieldGeometryAtState2", 0, 0.5, runtime, 0],
      ["entrancePupilAtState2", 6.25, 0, 0.5, runtime, geometry, 0],
      ["fNumberAtStopdown", 0, 0.5, runtime],
      ["fopenAtZoom2", 0.5, runtime],
      ["wideOpenStopAtZoom", 0.5, runtime],
    ],
  );
});

test("the stop radius the tab traces is the hook's product and quotient, not always the iris to the last bit", () => {
  // 6 x 1.4 / 1.4 is one unit in the last place short of 6 in double arithmetic.
  const { api, runtime, state } = standIn({ wideOpen: 6, fopen: 1.4, yRatio: 0.625 });
  const hook = lvHookAperture(api, runtime, state);
  assert.equal(hook.wideOpenStopSD, 6);
  assert.equal(hook.currentPhysStopSD, 5.999999999999999);
  assert.notEqual(hook.currentPhysStopSD, hook.wideOpenStopSD);
  assert.equal(hook.baseEPSD, 9.6);
  assert.equal(hook.currentEPSD, (9.6 * 1.4) / 1.4);

  // The seed of a wide-open stop is the hook's, whether the stop radius is the hook's or the prepared state's.
  assert.equal(lvPupilSeed(hook, hook.currentPhysStopSD), hook.currentEPSD);
  assert.equal(lvPupilSeed(hook, hook.wideOpenStopSD), hook.currentEPSD);
  // Of any other stop radius it is the hook's rule at the f-number that radius is the stop of.
  const fNumber = (6 * 1.4) / 2.5;
  assert.equal(lvPupilSeed(hook, 2.5), (9.6 * 1.4) / fNumber);
  assert.ok(Math.abs(lvPupilSeed(hook, 2.5) - (9.6 * 2.5) / 6) < 1e-14);
});

test("a zoom that is slower than its widest at this zoom state is traced at this state's f-number", () => {
  // The slider's wide-open f-number is the widest of the zoom state, which the stand-in gives as 4.
  const { api, runtime, state } = standIn({ wideOpen: 5, fopen: 4 });
  assert.equal(lvHookAperture(api, runtime, state).fNumber, 4);
});

// ── The fields ───────────────────────────────────────────────────────────────────────────────────────────────────

test("the fields are the tab's evenly spaced fractions, each one division", () => {
  assert.deepEqual(lvTabFieldFractions(25), [0, 0.25, 0.5, 0.75, 1]);
  assert.deepEqual(lvTabFieldFractions(10), [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  assert.deepEqual(
    lvTabFieldFractions(5),
    Array.from({ length: 21 }, (_unused, step) => step / 20),
  );
  assert.equal(lvTabFieldFractions(1).length, 101);
  assert.deepEqual(lvTabFieldFractions(100), [0, 1]);
});

// ── The request ──────────────────────────────────────────────────────────────────────────────────────────────────

test("the wide-open request is the tab's options, member for member, and names no frequencies", () => {
  const { api, runtime, state } = standIn({ wideOpen: 6, fopen: 1.4, yRatio: 0.625 });
  const request = lvTabRequest(api, runtime, state, "wide-open");
  assert.deepEqual(request, {
    view: "wide-open",
    fNumber: 1.4,
    options: {
      method: "diffraction",
      spectrum: "photopic",
      focus: "best-axial",
      maxGridSize: 64,
      fieldFractions: [0, 0.25, 0.5, 0.75, 1],
      pupilSemiDiameterMm: (9.6 * 1.4) / 1.4,
      stopSemiDiameterMm: 5.999999999999999,
      movementActive: false,
    },
    frequenciesPerMm: [0, 10, 20, 30, 40, 50],
    displayedFrequenciesPerMm: [20, 40],
    spectrumNote: null,
    unavailable: null,
  });
  assert.equal(Object.hasOwn(request.options, "frequenciesPerMm"), false);
  assert.equal(LV_TAB_PROFILE, "lv-tab-default");
});

test("the request follows LensVisualizer's defaults as they are, and its spectrum is the one the lens has data for", () => {
  const preferences = {
    method: "geometric",
    focus: "design",
    fieldStepPercent: 50,
    maxGridSize: 256,
    frequencies: [30],
  };
  const { api, runtime, state } = standIn({ wideOpen: 5, fopen: 2, preferences, fallback: "reference" });
  const request = lvTabRequest(api, runtime, state, "wide-open");
  assert.deepEqual(request.options, {
    method: "geometric",
    spectrum: "reference",
    focus: "design",
    maxGridSize: 256,
    fieldFractions: [0, 0.5, 1],
    pupilSemiDiameterMm: 5,
    stopSemiDiameterMm: 5,
    movementActive: false,
  });
  assert.deepEqual(request.displayedFrequenciesPerMm, [30]);
  assert.equal(request.spectrumNote, "no glass data for photopic");

  // The spectrum that is resolved is the preferred one of the defaults, whatever it is, for the state of the request.
  const other = standIn({ wideOpen: 5, fopen: 2, preferences: { spectrum: "cdf" } });
  assert.equal(lvTabRequest(other.api, other.runtime, other.state, "wide-open").options.spectrum, "cdf");
  assert.deepEqual(
    other.calls.filter(([name]) => name === "resolveMtfSpectrum"),
    [["resolveMtfSpectrum", other.state, "cdf"]],
  );
});

test("the f/8 comparison scales both radii of the wide-open request by N over 8, as the tab does", () => {
  const { api, runtime, state } = standIn({ wideOpen: 6, fopen: 1.4, yRatio: 0.625 });
  const wideOpen = lvTabRequest(api, runtime, state, "wide-open");
  const comparison = lvTabRequest(api, runtime, state, "f8-comparison");
  const scale = 1.4 / 8;
  assert.equal(LV_TAB_COMPARISON_F_NUMBER, 8);
  assert.deepEqual(comparison.options, {
    ...wideOpen.options,
    pupilSemiDiameterMm: wideOpen.options.pupilSemiDiameterMm * scale,
    stopSemiDiameterMm: wideOpen.options.stopSemiDiameterMm * scale,
  });
  assert.deepEqual([comparison.view, comparison.fNumber, comparison.unavailable], ["f8-comparison", 8, null]);
  // It is the tab's own scaling of the radius it traces wide open, which is not the iris to the last bit here.
  assert.equal(comparison.options.stopSemiDiameterMm, 5.999999999999999 * (1.4 / 8));
});

test("the stop of the f/8 comparison has the comparison's seed, to the bit: the hook's two radii scaled alike", () => {
  // A zoom state that is f/2.9 on a slider whose widest is f/1.4: the hook's f-number is the slider's.
  const lens = standIn({ wideOpen: 6, fopen: 1.4, yRatio: 0.625 });
  const { runtime, state } = lens;
  const api: LvTabApi = { ...lens.api, fNumberAtStopdown: () => 2.9 };
  const hook = lvHookAperture(api, runtime, state);
  assert.equal(hook.fNumber, 2.9);
  const comparison = lvTabRequest(api, runtime, state, "f8-comparison").options;
  assert.equal(comparison.stopSemiDiameterMm, hook.currentPhysStopSD * (2.9 / 8));
  assert.equal(lvPupilSeed(hook, comparison.stopSemiDiameterMm), comparison.pupilSemiDiameterMm);
  assert.equal(comparison.pupilSemiDiameterMm, hook.currentEPSD * (2.9 / 8));
  // The general rule, at the f-number that radius is the stop of, gives another number in the last bit here: the
  // comparison's seed is the tab's own, which is why the rule is not asked for it.
  const fNumber = (6 * 1.4) / comparison.stopSemiDiameterMm;
  assert.notEqual((9.6 * 1.4) / fNumber, comparison.pupilSemiDiameterMm);
  assert.ok(Math.abs((9.6 * 1.4) / fNumber - comparison.pupilSemiDiameterMm) < 1e-14);

  // The scale and the tab's rule on their own, and the part of the hook that needs no pupil.
  assert.deepEqual(lvTabComparison(hook), { scale: 2.9 / 8, unavailable: null });
  assert.deepEqual(lvTabComparison(hook, runtime), { scale: 2.9 / 8, unavailable: null });
  assert.match(lvTabComparison(hook, { maxFstop: 4 }).unavailable ?? "", /^the lens stops down to f\/4 at most/);
  const { currentFOPEN, fNumber: slider, wideOpenStopSD, currentPhysStopSD } = hook;
  assert.deepEqual(lvHookStop(api, runtime, state.zoomT), {
    currentFOPEN,
    fNumber: slider,
    wideOpenStopSD,
    currentPhysStopSD,
  });
});

test("the tab offers no f/8 comparison for a lens that is not faster than f/7.95, or that does not reach f/8", () => {
  const view = (lens: Lens) => {
    const { api, runtime, state } = standIn(lens);
    return lvTabRequest(api, runtime, state, "f8-comparison");
  };
  assert.equal(view({ wideOpen: 5, fopen: 7.9 }).unavailable, null);
  assert.equal(view({ wideOpen: 5, fopen: 5.6, maxFstop: 8 }).unavailable, null);
  assert.equal(
    view({ wideOpen: 5, fopen: 7.95 }).unavailable,
    "the lens is at f/7.95 wide open, and LensVisualizer's MTF tab compares with f/8 only a lens that is faster than f/7.95",
  );
  assert.match(view({ wideOpen: 5, fopen: 11, maxFstop: 32 }).unavailable ?? "", /^the lens is at f\/11 wide open/);
  assert.equal(
    view({ wideOpen: 5, fopen: 2, maxFstop: 5.6 }).unavailable,
    "the lens stops down to f/5.6 at most, so LensVisualizer's MTF tab has no f/8 to compare it with",
  );
  // The radii are the scaled ones all the same: a case can be made of them, and the engine says why it has no MTF.
  const slow = view({ wideOpen: 5, fopen: 11, maxFstop: 32 });
  assert.equal(slow.options.stopSemiDiameterMm, ((5 * 11) / 11) * (11 / 8));
});

// ── The spec ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("the spec of a request states its frequencies, fields, method and focus, and names the profile", () => {
  const { api, runtime, state } = standIn({ wideOpen: 6, fopen: 1.4 });
  const spec = lvTabSpec(lvTabRequest(api, runtime, state, "wide-open"));
  assert.deepEqual(spec, {
    frequenciesPerMm: [0, 10, 20, 30, 40, 50],
    fields: { kind: "image-height-fractions", values: [0, 0.25, 0.5, 0.75, 1] },
    method: "diffraction",
    focus: "engine-best",
    profile: "lv-tab-default",
  });
  assert.deepEqual(mtfNativeQuantity.validateSpec(spec), []);
  // The two views are one spec: the case says which, by its stop radius.
  assert.deepEqual(lvTabSpec(lvTabRequest(api, runtime, state, "f8-comparison")), spec);
});

test("LensVisualizer's design plane is the contract's; its best axial focus and its auto mode are the engine's own", () => {
  const focusOf = (focus: string) => {
    const { api, runtime, state } = standIn({ wideOpen: 5, fopen: 2, preferences: { focus } });
    return lvTabSpec(lvTabRequest(api, runtime, state, "wide-open")).focus;
  };
  assert.deepEqual(["design", "best-axial", "auto"].map(focusOf), ["design", "engine-best", "engine-best"]);

  const { api, runtime, state } = standIn({ wideOpen: 5, fopen: 2, preferences: { method: "geometric-dl" } });
  assert.throws(() => lvTabSpec(lvTabRequest(api, runtime, state, "wide-open")), {
    message: 'LensVisualizer\'s MTF tab opens with the method "geometric-dl", which the contract does not know',
  });
});
