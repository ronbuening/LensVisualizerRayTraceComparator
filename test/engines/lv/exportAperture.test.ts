import assert from "node:assert/strict";
import { test } from "node:test";

import {
  inclusiveClipLimit,
  stopRadius,
  surfaceAperture,
  wideOpenStopRadius,
} from "../../../src/engines/lv/exportAperture.ts";
import type { LvStopApi } from "../../../src/engines/lv/exportAperture.ts";
import type { LvRuntimeLens } from "../../../src/engines/lv/types.ts";
import { FLAT, lvEvaluateAperture, stateOf } from "./exportSupport.ts";

const RUNTIME: LvRuntimeLens = { lastLensSurfaceIdx: 0, isZoom: true, elements: [], maxFstop: 22 };

/** A zoom whose iris opens from 3 mm at the wide end to 6 mm at the tele end, f/4 at both. */
const ZOOM: LvStopApi = {
  wideOpenStopAtZoom: (zoomT) => 3 + 3 * zoomT,
  fopenAtZoom2: () => 4,
  fNumberAtStopdown: () => 4,
};

/** The next double above and below a positive one. */
function neighbours(value: number): { below: number; above: number } {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  view.setBigUint64(0, bits - 1n);
  const below = view.getFloat64(0);
  view.setBigUint64(0, bits + 1n);
  return { below, above: view.getFloat64(0) };
}

// ── The stop radius ──────────────────────────────────────────────────────────────────────────────────────────────

test("wide open, and no aperture at all, is LensVisualizer's wide-open stop radius at that zoom position", () => {
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, undefined), { ok: true, radius: 3 });
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, { kind: "wide-open" }), { ok: true, radius: 3 });
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 1, { kind: "wide-open" }), { ok: true, radius: 6 });
  assert.equal(wideOpenStopRadius(ZOOM, RUNTIME, 0.5), 4.5);
});

test("an f-number is the hook's rule: wide-open radius times the widest f-number, divided by N", () => {
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, { kind: "f-number", value: 8 }), { ok: true, radius: 1.5 });
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 1, { kind: "f-number", value: 8 }), { ok: true, radius: 3 });
  // The order of operations is the hook's, (w * fopen) / N, which is not w * (fopen / N) in the last bit.
  const api: LvStopApi = { wideOpenStopAtZoom: () => 12.7, fopenAtZoom2: () => 1.9, fNumberAtStopdown: () => 1.9 };
  const stopped = stopRadius(api, RUNTIME, 0, { kind: "f-number", value: 2.8 });
  assert.deepEqual(stopped, { ok: true, radius: (12.7 * 1.9) / 2.8 });
  assert.notEqual((12.7 * 1.9) / 2.8, 12.7 * (1.9 / 2.8), "the example tells the two orders apart");
});

test("the widest f-number asked for by number is the hook's (w * fopen) / fopen, not a shortcut to wide open", () => {
  const api: LvStopApi = { wideOpenStopAtZoom: () => 7.3, fopenAtZoom2: () => 1.85, fNumberAtStopdown: () => 1.85 };
  assert.deepEqual(stopRadius(api, RUNTIME, 0, { kind: "f-number", value: 1.85 }), {
    ok: true,
    radius: (7.3 * 1.85) / 1.85,
  });
});

test("an f-number faster than wide open is a problem, not a clamp", () => {
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, { kind: "f-number", value: 2.8 }), {
    ok: false,
    problem: {
      code: "aperture-faster-than-wide-open",
      message: "f/2.8 is faster than the lens's widest aperture at zoom 0, f/4",
    },
  });
  // The widest aperture is the one of the zoom position asked for.
  const variable: LvStopApi = {
    wideOpenStopAtZoom: () => 5,
    fopenAtZoom2: (zoomT) => 3.5 + 2.1 * zoomT,
    fNumberAtStopdown: (_stopdownT, zoomT) => 3.5 + 2.1 * zoomT,
  };
  assert.equal(stopRadius(variable, RUNTIME, 0, { kind: "f-number", value: 4 }).ok, true);
  assert.equal(stopRadius(variable, RUNTIME, 1, { kind: "f-number", value: 4 }).ok, false);
});

test("the tab's f/8 comparison is the hook's wide-open radius times its f-number over 8, in the tab's order", () => {
  // The slider's f-number at wide open need not be the widest f-number: the tab scales by the slider's.
  const api: LvStopApi = { wideOpenStopAtZoom: () => 12.7, fopenAtZoom2: () => 1.9, fNumberAtStopdown: () => 2.87 };
  const hookRadius = (12.7 * 1.9) / 2.87;
  assert.deepEqual(stopRadius(api, RUNTIME, 0, { kind: "lv-f8-comparison" }), {
    ok: true,
    radius: hookRadius * (2.87 / 8),
  });
  // It is not the hook's own f/8, which divides once: here the two differ in the last bit.
  assert.notEqual(hookRadius * (2.87 / 8), (12.7 * 1.9) / 8);
  assert.deepEqual(stopRadius(api, RUNTIME, 0, { kind: "f-number", value: 8 }), { ok: true, radius: (12.7 * 1.9) / 8 });
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 1, { kind: "lv-f8-comparison" }), {
    ok: true,
    radius: ((6 * 4) / 4) * (4 / 8),
  });
});

test("a lens the tab offers no f/8 comparison for has no such stop, and the problem is the tab's reason", () => {
  // Not faster than f/7.95 wide open.
  const slow: LvStopApi = { wideOpenStopAtZoom: () => 3, fopenAtZoom2: () => 8, fNumberAtStopdown: () => 8 };
  assert.deepEqual(stopRadius(slow, RUNTIME, 0, { kind: "lv-f8-comparison" }), {
    ok: false,
    problem: {
      code: "f8-comparison-unavailable",
      message:
        "the lens is at f/8 wide open, and LensVisualizer's MTF tab compares with f/8 only a lens that is faster " +
        "than f/7.95",
    },
  });
  const nearly: LvStopApi = { ...slow, fNumberAtStopdown: () => 7.96 };
  assert.equal(stopRadius(nearly, RUNTIME, 0, { kind: "lv-f8-comparison" }).ok, false);
  assert.equal(
    stopRadius({ ...slow, fNumberAtStopdown: () => 7.94 }, RUNTIME, 0, { kind: "lv-f8-comparison" }).ok,
    true,
  );
  // It does not stop down to f/8.
  const shallow = { ...RUNTIME, maxFstop: 5.6 };
  assert.deepEqual(stopRadius(ZOOM, shallow, 0, { kind: "lv-f8-comparison" }), {
    ok: false,
    problem: {
      code: "f8-comparison-unavailable",
      message: "the lens stops down to f/5.6 at most, so LensVisualizer's MTF tab has no f/8 to compare it with",
    },
  });
});

test("a stop radius is taken as given, also beyond wide open", () => {
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, { kind: "stop-radius", mm: 1.25 }), { ok: true, radius: 1.25 });
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, { kind: "stop-radius", mm: 9 }), { ok: true, radius: 9 });
});

test("a wide-open radius that is not a positive number is refused", () => {
  for (const radius of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    const api: LvStopApi = { wideOpenStopAtZoom: () => radius, fopenAtZoom2: () => 2, fNumberAtStopdown: () => 2 };
    assert.throws(() => wideOpenStopRadius(api, RUNTIME, 0), /wide-open stop radius at zoom 0 is /);
    assert.throws(() => stopRadius(api, RUNTIME, 0, { kind: "f-number", value: 8 }), /wide-open stop radius/);
  }
});

// ── The inclusive clip limit ─────────────────────────────────────────────────────────────────────────────────────

test("LensVisualizer's own rule gives sd + max(1e-9, sd * 1e-12), bit for bit, after two questions", () => {
  for (const sd of [0.9375, 5, 17.1234567890125, 46.5, 999.5, 5000, 123456.789]) {
    const limit = sd + Math.max(1e-9, sd * 1e-12);
    const asked: number[] = [];
    const found = inclusiveClipLimit((radius) => {
      asked.push(radius);
      return radius > limit;
    }, sd);
    assert.equal(found, limit, String(sd));
    assert.deepEqual(asked, [limit, neighbours(limit).above], String(sd));
  }
  // Below 1000 mm the absolute term rules; above it, the relative one.
  assert.equal(
    inclusiveClipLimit((radius) => radius > 5 + 1e-9, 5),
    5.000000001,
  );
  assert.equal(
    inclusiveClipLimit((radius) => radius > 5000 + 5e-9, 5000),
    5000 + 5e-9,
  );
});

test("a rule that is not the mirrored one is followed by bisection to the last double that passes", () => {
  for (const limit of [5 + 1e-6, 5 + 3e-10, 5, 7.25, 10.999]) {
    const found = inclusiveClipLimit((radius) => radius > limit, 5);
    assert.equal(found, limit, String(limit));
  }
  // A strict rule, radius >= limit clips, passes up to the double below the limit.
  assert.equal(
    inclusiveClipLimit((radius) => radius >= 5.5, 5),
    neighbours(5.5).below,
  );
});

test("a rule without a limit of this kind is refused", () => {
  assert.throws(() => inclusiveClipLimit((radius) => radius >= 5, 5), /clips a ray at the semi-diameter 5 itself/);
  assert.throws(() => inclusiveClipLimit(() => false, 5), /passes a ray at 11, beyond the semi-diameter 5/);
});

// ── A surface's aperture ─────────────────────────────────────────────────────────────────────────────────────────

const STATE = stateOf(
  [
    { label: "1", R: 40, d: 3, nd: 1.6, sd: 9 },
    { label: "STO", R: FLAT, d: 2, sd: 3 },
    { label: "3", R: -60, d: 30, sd: 7, innerSd: 1.5 },
  ],
  { stopIndex: 1 },
);
const API = { evaluateAperture: lvEvaluateAperture };

test("a surface's aperture is the semi-diameter LensVisualizer traces it with, and its inclusive limit", () => {
  assert.deepEqual(surfaceAperture(API, STATE, STATE.surfaces[0], undefined), {
    semiDiameter: 9.000000001,
    nominalSemiDiameter: 9,
    innerSemiDiameter: 0,
  });
});

test("the stop surface carries the run's stop radius: LensVisualizer's override of its semi-diameter", () => {
  assert.deepEqual(surfaceAperture(API, STATE, STATE.surfaces[1], 1.25), {
    semiDiameter: 1.250000001,
    nominalSemiDiameter: 1.25,
    innerSemiDiameter: 0,
  });
  // Wide open, the run's radius is the prepared one.
  assert.deepEqual(surfaceAperture(API, STATE, STATE.surfaces[1], 3), {
    semiDiameter: 3.000000001,
    nominalSemiDiameter: 3,
    innerSemiDiameter: 0,
  });
});

test("an annular aperture keeps its inner semi-diameter, and the outer limit is found past the hole", () => {
  assert.deepEqual(surfaceAperture(API, STATE, STATE.surfaces[2], undefined), {
    semiDiameter: 7.000000001,
    nominalSemiDiameter: 7,
    innerSemiDiameter: 1.5,
  });
});

test("the limit is LensVisualizer's, not the exporter's guess: another tolerance is exported as it is", () => {
  const loose = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) => {
      const [state, surface, radius, stopSemiDiameter] = args;
      const evaluated = lvEvaluateAperture(state, surface, radius, stopSemiDiameter);
      const limit = (evaluated.semiDiameter ?? 0) + 1e-6;
      return { ...evaluated, state: radius > limit ? ("outside" as const) : ("inside" as const) };
    },
  };
  assert.equal(surfaceAperture(loose, STATE, STATE.surfaces[0], undefined).semiDiameter, 9 + 1e-6);
});

test("an answer that is not what the state implies is refused, naming the surface", () => {
  // The stop radius handed to a surface LensVisualizer does not take for the stop.
  assert.throws(
    () => surfaceAperture(API, STATE, STATE.surfaces[0], 1.25),
    /traces surface 1 with the semi-diameter 9, expected 1\.25/,
  );
  const noLimit = {
    evaluateAperture: () => ({ state: "inside" as const, radius: 0, semiDiameter: null, innerSemiDiameter: 0 }),
  };
  assert.throws(() => surfaceAperture(noLimit, STATE, STATE.surfaces[0], undefined), /semi-diameter null, expected 9/);
});
