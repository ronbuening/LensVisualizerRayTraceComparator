import assert from "node:assert/strict";
import { test } from "node:test";

import {
  inclusiveClipLimit,
  lvClearRadius,
  stopRadius,
  surfaceAperture,
  wideOpenStopRadius,
} from "../../../src/engines/lv/exportAperture.ts";
import type { LvStopApi } from "../../../src/engines/lv/exportAperture.ts";
import type { LvRuntimeLens } from "../../../src/engines/lv/types.ts";
import { FLAT, lvEvaluateAperture, stateOf } from "./exportSupport.ts";

const RUNTIME: LvRuntimeLens = {
  source: { key: "synthetic" },
  zoomStopSDs: null,
  stopPhysSD: 4,
  lastLensSurfaceIdx: 0,
  isZoom: true,
  elements: [],
  maxFstop: 22,
};

/**
 * A synthetic stop rule (LV #933 in shape, not in number): the stop at N is the rule's `k / N` above the widest
 * f-number, never wider than wide open, with k a binary fraction so every radius is exact.
 */
function ruled(wideOpen: (zoomT: number) => number, fopen: (zoomT: number) => number, k = 24): LvStopApi {
  return {
    wideOpenStopAtZoom: wideOpen,
    stopSemiDiameterForFNumber: (fNumber, zoomT) =>
      fNumber > fopen(zoomT) ? Math.min(wideOpen(zoomT), k / fNumber) : wideOpen(zoomT),
    fopenAtZoomClamped: (zoomT) => fopen(zoomT),
    fNumberAtStopdown: (_stopdownT, zoomT) => fopen(zoomT),
  };
}

/** A zoom whose iris opens from 3 mm at the wide end to 6 mm at the tele end, f/4 at both. */
const ZOOM: LvStopApi = ruled(
  (zoomT) => 3 + 3 * zoomT,
  () => 4,
);

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

test("an f-number is the stop LensVisualizer's stop rule gives at that N and zoom position, asked of LensVisualizer", () => {
  // 24 / 8 = 3 is the rule's radius; at the wide end it is the wide-open 3 mm (never wider), at the tele end 3 of 6.
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 1, { kind: "f-number", value: 8 }), { ok: true, radius: 3 });
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 0, { kind: "f-number", value: 16 }), { ok: true, radius: 1.5 });
  // The rule is LensVisualizer's own function, called with the f-number, the zoom position and the lens as given.
  const asked: unknown[][] = [];
  const recording: LvStopApi = {
    ...ZOOM,
    stopSemiDiameterForFNumber: (...args) => {
      asked.push(args);
      return 2.25;
    },
  };
  assert.deepEqual(stopRadius(recording, RUNTIME, 0.5, { kind: "f-number", value: 11 }), { ok: true, radius: 2.25 });
  assert.deepEqual(asked, [[11, 0.5, RUNTIME]]);
});

test("the widest f-number asked for by number is the rule's stop at it, which is the wide-open stop", () => {
  const api = ruled(
    () => 7.3,
    () => 1.85,
  );
  assert.deepEqual(stopRadius(api, RUNTIME, 0, { kind: "f-number", value: 1.85 }), { ok: true, radius: 7.3 });
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
  const variable = ruled(
    () => 5,
    (zoomT) => 3.5 + 2.1 * zoomT,
  );
  assert.equal(stopRadius(variable, RUNTIME, 0, { kind: "f-number", value: 4 }).ok, true);
  assert.equal(stopRadius(variable, RUNTIME, 1, { kind: "f-number", value: 4 }).ok, false);
});

test("the tab's f/8 comparison is the stop rule's f/8 stop, the slider's f/8 to the bit", () => {
  const api = ruled(
    () => 12.7,
    () => 1.9,
    25.5,
  );
  assert.deepEqual(stopRadius(api, RUNTIME, 0, { kind: "lv-f8-comparison" }), { ok: true, radius: 25.5 / 8 });
  assert.deepEqual(
    stopRadius(api, RUNTIME, 0, { kind: "lv-f8-comparison" }),
    stopRadius(api, RUNTIME, 0, { kind: "f-number", value: 8 }),
  );
  assert.deepEqual(stopRadius(ZOOM, RUNTIME, 1, { kind: "lv-f8-comparison" }), { ok: true, radius: 3 });
});

test("a lens the tab offers no f/8 comparison for has no such stop, and the problem is the tab's reason", () => {
  // Not faster than f/7.95 wide open.
  const slow = ruled(
    () => 3,
    () => 8,
  );
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
    const api = ruled(
      () => radius,
      () => 2,
    );
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

test("the trace geometry aperture argument preserves the run's stop override", () => {
  const geometry = { stopSurfaceIndex: 1 };
  const state = { ...STATE, traceGeometry: geometry };
  let calls = 0;
  const api = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) => {
      assert.equal(args[0], geometry);
      assert.equal(args[1], state.surfaces[1]);
      assert.equal(args[3], 1.25);
      calls++;
      return lvEvaluateAperture(...args);
    },
  };
  assert.deepEqual(surfaceAperture(api, state, state.surfaces[1], 1.25), {
    semiDiameter: 1.250000001,
    nominalSemiDiameter: 1.25,
    innerSemiDiameter: 0,
  });
  assert.ok(calls > 1);
  assert.throws(
    () => surfaceAperture(api, { ...state, traceGeometry: undefined }, state.surfaces[1], 1.25),
    /lacks traceGeometry/,
  );
});

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

// ── A flat rim cut ───────────────────────────────────────────────────────────────────────────────────────────────

test("a surface with a flat rim cut is its cap clipped at the cut radius, which LensVisualizer traces it with", () => {
  // The cap's sag reaches the land at 6.5 mm, inside the surface's sd of 9 mm: LV clips there.
  const cut = { ...STATE.surfaces[0], rimCut: { depthMm: 0.5, sag: -0.5, radius: 6.5 } };
  assert.equal(lvClearRadius(cut), 6.5);
  assert.deepEqual(surfaceAperture(API, STATE, cut, undefined), {
    semiDiameter: 6.500000001,
    nominalSemiDiameter: 6.5,
    innerSemiDiameter: 0,
  });
  // A cut whose radius lies beyond sd ends nothing: the surface is clipped at its sd.
  const wide = { ...STATE.surfaces[0], rimCut: { depthMm: 0.5, sag: -0.5, radius: 12 } };
  assert.equal(lvClearRadius(wide), 9);
  assert.equal(surfaceAperture(API, STATE, wide, undefined).nominalSemiDiameter, 9);
  // A LensVisualizer that clipped such a surface at its sd would not be doing what its state says: refused, naming it.
  const uncut = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) =>
      lvEvaluateAperture(args[0], { ...args[1], rimCut: null }, args[2], args[3]),
  };
  assert.throws(
    () => surfaceAperture(uncut, STATE, cut, undefined),
    /traces surface 1 with the semi-diameter 9, expected 6\.5/,
  );
});

// ── A surface that does not clip ─────────────────────────────────────────────────────────────────────────────────

/** A lens with two rear plates: the first with a rim LensVisualizer generated, the second with a published one. */
const PLATED = stateOf(
  [
    { label: "1", R: 40, d: 3, nd: 1.6, sd: 9 },
    { label: "STO", R: FLAT, d: 20, sd: 3 },
    { label: "RP1a", R: FLAT, d: 2, nd: 1.5, sd: 13.5, synthetic: "rearPlate", clips: false },
    { label: "RP1b", R: FLAT, d: 1, sd: 13.5, synthetic: "rearPlate", clips: false },
    { label: "RP2a", R: FLAT, d: 2, nd: 1.5, sd: 11, synthetic: "rearPlate", clips: true },
    { label: "RP2b", R: FLAT, d: 1, sd: 11, synthetic: "rearPlate", clips: true },
  ],
  { stopIndex: 1 },
);

test("a rim LensVisualizer generated is exported as no clip radius, its sd as the extent, after LensVisualizer was asked", () => {
  const asked: number[] = [];
  const recording = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) => {
      if (args[1].label === "RP1a") asked.push(args[2]);
      return lvEvaluateAperture(...args);
    },
  };
  for (const index of [2, 3]) {
    assert.deepEqual(surfaceAperture(recording, PLATED, PLATED.surfaces[index], undefined), {
      semiDiameter: null,
      nominalSemiDiameter: 13.5,
      innerSemiDiameter: 0,
    });
  }
  // On the axis, at the envelope, just past where a rim of 13.5 mm would clip, far outside, and at the largest double.
  assert.deepEqual(asked.slice(0, 3), [0, 0, 13.5]);
  assert.equal(asked[3], neighbours(13.500000001).above);
  assert.deepEqual(asked.slice(4), [28, 13.5e6, Number.MAX_VALUE]);
  // A published rim is an aperture like any other, whatever the surface is.
  assert.deepEqual(surfaceAperture(API, PLATED, PLATED.surfaces[4], undefined), {
    semiDiameter: 11.000000001,
    nominalSemiDiameter: 11,
    innerSemiDiameter: 0,
  });
  // And a surface of a LensVisualizer that has no such mark clips, as every surface did.
  assert.equal(STATE.surfaces[0].clips, undefined);
  assert.equal(surfaceAperture(API, STATE, STATE.surfaces[0], undefined).semiDiameter, 9.000000001);
});

test("what LensVisualizer's state says of a rim and what its tracer does with it must agree, or nothing is exported", () => {
  const plate = PLATED.surfaces[2];
  // The state marks the rim as generated, and the tracer clips by it all the same.
  const clipping = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) =>
      lvEvaluateAperture(args[0], { ...args[1], clips: true }, args[2], args[3]),
  };
  assert.throws(
    () => surfaceAperture(clipping, PLATED, plate, undefined),
    /surface RP1a is marked as one that does not clip, and it is traced with the semi-diameter 13\.5/,
  );
  // The tracer reports no semi-diameter for a surface the state does not mark: the guard of every other surface.
  const unmarked = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) =>
      lvEvaluateAperture(args[0], { ...args[1], clips: false }, args[2], args[3]),
  };
  assert.throws(
    () => surfaceAperture(unmarked, PLATED, PLATED.surfaces[4], undefined),
    /traces surface RP2a with the semi-diameter null, expected 11/,
  );
  // No semi-diameter on the axis, and a ray stopped far outside: an envelope that clips after all.
  const farRim = {
    evaluateAperture: (...args: Parameters<typeof lvEvaluateAperture>) => {
      const evaluated = lvEvaluateAperture(...args);
      return args[2] > 1e6 ? { ...evaluated, state: "outside" as const } : evaluated;
    },
  };
  assert.throws(
    () => surfaceAperture(farRim, PLATED, plate, undefined),
    /surface RP1a is marked as one that does not clip, and a ray at the height 13500000 is outside/,
  );
  // A hole in a surface that does not clip is nothing the contract states.
  assert.throws(
    () => surfaceAperture(API, PLATED, { ...plate, innerSd: 2 }, undefined),
    /surface RP1a does not clip and has the inner semi-diameter 2/,
  );
  assert.throws(
    () => surfaceAperture(API, PLATED, { ...plate, sd: Number.NaN }, undefined),
    /surface RP1a does not clip and has the envelope NaN/,
  );
});
