// The replay of LensVisualizer's MTF sampling and the engine `replay`, with no LensVisualizer.
//
// Two kinds of test. Against stand-ins written here, the replay's curves are held to closed forms derived in the
// test: a spot of two points has the MTF |cos(2 pi nu a)|. Against the fake LV tree, whose geometric MTF is sampled
// when a lens says so (a ladder, a test of convergence, a footprint that is widened, plain sums of its own), the
// replay is held to the fake's own result: the same grids, the same counts, the same status, and the fake's curves
// to its rounding. The fake's numbers describe no real lens, and none of its constants is LensVisualizer's.
import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvMtfRequest } from "../../../src/engines/lv/mtf.ts";
import { REPLAY_ESTIMATOR_REASON, replayLvMtf } from "../../../src/engines/lv/replay.ts";
import type { LvReplay, LvReplayApi } from "../../../src/engines/lv/replay.ts";
import {
  LV_REPLAY_ENGINE_ID,
  LV_REPLAY_ENGINE_MODULE,
  createLvReplayEngineOn,
} from "../../../src/engines/lv/replayEngine.ts";
import type {
  LvMtfBundle,
  LvMtfFieldDraft,
  LvMtfFieldResult,
  LvMtfFootprint,
  LvMtfGridOutcome,
  LvMtfOptions,
  LvMtfPupilRay,
  LvMtfResult,
  LvMtfSupport,
  LvPreparedState,
} from "../../../src/engines/lv/types.ts";
import { adapterRevision, importClosure } from "../../../src/engines/adapterRevision.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { SINGLET as FIXTURE_CASE } from "../../core/support.ts";
import { FAKE_LENS_FILES, bind, freshLv, variantOf } from "./support.ts";

const [SINGLET_FILE] = FAKE_LENS_FILES.map(([file]) => file);
const SINGLET = "acme-singlet-50";

// ── Against stand-ins: closed forms ──────────────────────────────────────────────────────────────────────────────

/** What a stand-in LensVisualizer is told to be. */
interface StandIn {
  /** The lines of the request, the reference line first. */
  readonly lines: readonly { wavelengthNm: number; weight: number }[];
  /**
   * The half width of the spot of a line at a grid size, mm: the rays of a bundle land in two points, at
   * (reference.x - a, reference.y) and (reference.x + a, reference.y), half of them in each.
   */
  readonly halfWidth: (line: number, size: number) => number;
  /** How many rays a bundle has at a grid size; `size * size` unless given. */
  readonly rays?: (size: number) => number;
  /** The weight of every ray of a line; 1 unless given. */
  readonly rayWeight?: (line: number) => number;
  /** The sides a bundle reports as open, for a footprint of a given half width. */
  readonly open?: (footprint: LvMtfFootprint, size: number) => { x: boolean; y0: boolean; y1: boolean };
  /** The landing of the first ray of a bundle is not a number. */
  readonly brokenLanding?: boolean;
  /** The rays of a line's bundle the tracer could not resolve, and the launch weight they stand for; none unless given. */
  readonly unresolved?: (line: number) => { rays: number; weight: number };
  /** The largest share of unresolved flux a field may have; any unless given. */
  readonly maxUnknownFlux?: number;
  readonly ladder?: readonly number[];
  readonly tolerance?: number;
}

const REFERENCE = { x: 0.25, y: 7.5, weight: 1 };

const SUPPORT: LvMtfSupport = {
  available: true,
  reason: null,
  message: "",
  referenceWavelengthNm: 550,
  useResolvedReference: false,
  spectralLines: [],
  limitations: [],
};

function pending(
  fraction: number,
  target?: { targetImageHeightMm: number | null; fieldAngleDeg: number | null },
): LvMtfFieldDraft {
  return {
    fieldFraction: fraction,
    targetImageHeightMm: target?.targetImageHeightMm ?? null,
    fieldAngleDeg: target?.fieldAngleDeg ?? null,
    imageHeightMm: null,
    sagittal: [],
    tangential: [],
    status: "pending",
    reason: null,
    message: "pending",
    notes: [],
    gridSize: 0,
    validRays: 0,
    blockedRays: 0,
    failedRays: 0,
    unknownFluxFraction: 0,
    maxDelta: null,
    convergedThroughLpMm: null,
  };
}

/**
 * A stand-in for the LensVisualizer exports the replay calls. Its refinement is the simplest that has the shape of
 * LensVisualizer's: a grid is converged when no value moved by more than `tolerance` from the grid before it.
 * `traced` takes every bundle that was asked for, as `[size, line, footprint half width, reference handed in]`.
 */
function standIn(spec: StandIn, traced: unknown[][] = []): LvReplayApi {
  const tolerance = spec.tolerance ?? 0.01;
  const footprint: LvMtfFootprint = { x0: -1, x1: 1, y0: -1, y1: 1, beamWidthMm: 2, beamHeightMm: 2, guardMm: 0.1 };
  return {
    computeMtfSteps: function* (_state, options) {
      const fractions = (options.fieldFractions as number[] | undefined) ?? [0];
      const result: LvMtfResult = {
        method: options.method,
        spectrum: options.spectrum,
        support: { ...SUPPORT, spectralLines: spec.lines.map((line) => ({ ...line })) },
        frequenciesPerMm: [...((options.frequenciesPerMm as number[] | undefined) ?? [0, 10])],
        fields: fractions.map((fraction) =>
          pending(fraction, { targetImageHeightMm: 10 * fraction, fieldAngleDeg: 20 * fraction }),
        ),
        geometry: {
          referenceHeightMm: 10,
          modeledEdgeHeightMm: 10,
          modeledEdgeAngleDeg: 20,
          chiefEdgeHeightMm: 10,
          chiefEdgeAngleDeg: 20,
          basis: "modeled-edge",
        },
        focus: { requestedMode: String(options.focus), mode: "design", appliedShiftMm: 0, bestAxialShiftMm: -0.5 },
        aperture: null,
      };
      yield result;
      return result;
    },
    prepareMtfFieldLaunch: (_state, _options, _support, fieldAngleDeg) => ({
      fieldAngleDeg,
      direction: [0, 0, 1],
      leadZ: -10,
      centerY: 0,
    }),
    findMtfFieldFootprint: () => footprint,
    traceMtfBundle: (_state, _options, support, _launch, box, size, line, _imagePlaneZ, extras) => {
      const index = support.spectralLines.findIndex((each) => each.wavelengthNm === line.wavelengthNm);
      traced.push([size, index, box.x1, extras?.reference ?? null]);
      const count = spec.rays?.(size) ?? size * size;
      const a = spec.halfWidth(index, size);
      const weight = spec.rayWeight?.(index) ?? 1;
      const rays = Array.from({ length: count }, (_, ray): LvMtfPupilRay => ({
        x: spec.brokenLanding === true && ray === 0 ? Number.NaN : REFERENCE.x + (ray % 2 === 0 ? -a : a),
        y: REFERENCE.y,
        weight,
        column: ray,
        row: 0,
        trace: {
          input: { origin: [0, 0, -10], direction: [0, 0, 1] },
          terminalPoint: [0, 0, 0],
          terminalDirection: [0, 0, 1],
          finalMedium: 1,
        },
      }));
      const bundle: LvMtfBundle = {
        rays,
        blocked: 3,
        failed: spec.unresolved?.(index).rays ?? 0,
        failedWeight: spec.unresolved?.(index).weight ?? 0,
        // Only the first line's chief ray is the reference: every later line states another point.
        chief: index === 0 ? REFERENCE : { x: 99, y: 99, weight: 1 },
        chiefClipped: false,
        columns: size,
        rows: size,
        mirrored: false,
        launchStepMm: 2 / size,
        openBorders: spec.open?.(box, size) ?? { x: false, y0: false, y1: false },
      };
      return bundle;
    },
    expandMtfFootprint: (box, sides) => ({ ...box, x0: box.x0 - (sides.x ? 1 : 0), x1: box.x1 + (sides.x ? 1 : 0) }),
    refineMtfField: function* (ladder, evaluate) {
      let previous: LvMtfFieldDraft | null = null;
      for (const size of ladder) {
        const outcome: LvMtfGridOutcome = evaluate(size);
        if (outcome.kind === "unavailable") {
          yield previous ?? outcome.field;
          if (outcome.refine) continue;
          return;
        }
        const { field } = outcome;
        const before = previous;
        const moved =
          before === null
            ? Infinity
            : Math.max(...field.sagittal.map((value, index) => Math.abs(value - before.sagittal[index])));
        field.status = moved <= tolerance ? "converged" : "unconverged";
        field.maxDelta = before === null ? null : moved;
        yield field;
        if (field.status === "converged") return;
        previous = field;
      }
    },
    emptyMtfField: pending,
    assessUnresolvedFlux: (failedRays, unknownFluxFraction) =>
      unknownFluxFraction > (spec.maxUnknownFlux ?? Infinity)
        ? { acceptable: false, note: null }
        : { acceptable: true, note: failedRays === 0 ? null : `${failedRays} unresolved` },
    mtfGridLadder: spec.ladder ?? [8, 16, 32, 64],
    mtfDefaultGridCap: 32,
    mtfMaxFootprintExpansions: 2,
    mtfMinRays: 16,
  };
}

const STATE = { imgZ: 100 } as LvPreparedState;

/** Steps that return `result` at once and yield nothing, as LensVisualizer's do for a request it does not trace. */
function atOnce(result: LvMtfResult): Generator<LvMtfResult, LvMtfResult> {
  const none: LvMtfResult[] = [];
  return (function* () {
    yield* none;
    return result;
  })();
}

function optionsOf(more: Partial<LvMtfOptions> = {}): LvMtfOptions {
  return {
    method: "geometric",
    spectrum: "reference",
    focus: "design",
    pupilSemiDiameterMm: 5,
    stopSemiDiameterMm: 5,
    fieldFractions: [0, 1],
    frequenciesPerMm: [0, 10, 25, 40],
    ...more,
  };
}

function close(actual: readonly number[], expected: readonly number[], tolerance: number, what: string): void {
  assert.equal(actual.length, expected.length, what);
  actual.forEach((value, index) => {
    assert.ok(Math.abs(value - expected[index]) <= tolerance, `${what}[${index}]: ${value} is not ${expected[index]}`);
  });
}

test("a spot of two points has the MTF |cos(2 pi nu a)| across them and 1 along them, on the grid the ladder ends at", () => {
  // The spot shrinks toward 0.004 mm as the grid grows: a = 0.004 (1 + 2 / size^2).
  const halfWidth = (_line: number, size: number): number => 0.004 * (1 + 2 / (size * size));
  const traced: unknown[][] = [];
  const replay = replayLvMtf(
    standIn({ lines: [{ wavelengthNm: 550, weight: 1 }], halfWidth }, traced),
    STATE,
    optionsOf(),
  );
  assert.deepEqual(replay.ladder, [8, 16, 32], "the ladder ends at the default cap");
  assert.equal(replay.imagePlaneZ, 100);
  assert.equal(replay.fields.length, 2);
  for (const { field, gridSizes, expansions, bundles, reference, footprint } of replay.fields) {
    // |cos| at 8 and at 16 differ by more than 0.01 at 40 cycles/mm, and at 16 and 32 by less: three grids.
    const at = (size: number): number[] =>
      [0, 10, 25, 40].map((nu) => Math.abs(Math.cos(2 * Math.PI * nu * halfWidth(0, size))));
    assert.ok(Math.abs(at(16)[3] - at(8)[3]) > 0.01 && Math.abs(at(32)[3] - at(16)[3]) <= 0.01);
    assert.deepEqual(gridSizes, [8, 16, 32]);
    assert.equal(field.status, "converged");
    assert.equal(field.gridSize, 32);
    close(field.sagittal, at(32), 2e-15, "sagittal");
    assert.deepEqual(field.tangential, [1, 1, 1, 1]);
    // The counts are those of the last grid's bundle, the reference its chief ray, the height the reference's.
    assert.deepEqual([field.validRays, field.blockedRays, field.failedRays], [32 * 32, 3, 0]);
    assert.equal(field.imageHeightMm, Math.hypot(REFERENCE.x, REFERENCE.y));
    assert.equal(expansions, 0);
    assert.equal(bundles.length, 1);
    assert.equal(bundles[0].rays.length, 32 * 32);
    assert.deepEqual(reference, REFERENCE);
    assert.equal(footprint?.x1, 1);
  }
  // Every grid of every field was traced once, at the one line, and no reference was handed to a first line.
  assert.deepEqual(
    traced,
    [0, 1].flatMap(() => [8, 16, 32].map((size) => [size, 0, 1, null])),
  );
});

test("the lines of a spectrum add up about the first line's reference, each by its weight times its flux", () => {
  // Line 0: weight 1, rays of weight 1, half width 0.004. Line 1: weight 0.5, rays of weight 0.25, half width 0.012.
  const lines = [
    { wavelengthNm: 550, weight: 1 },
    { wavelengthNm: 480, weight: 0.5 },
  ];
  const widths = [0.004, 0.012];
  const traced: unknown[][] = [];
  const api = standIn(
    { lines, halfWidth: (line) => widths[line], rayWeight: (line) => [1, 0.25][line], ladder: [8] },
    traced,
  );
  const [{ field, bundles, reference }] = replayLvMtf(api, STATE, optionsOf({ fieldFractions: [0.5] })).fields;
  // 64 rays a line: fluxes 64 and 16, so the lines count 1 x 64 and 0.5 x 16.
  const expected = [0, 10, 25, 40].map(
    (nu) => Math.abs(64 * Math.cos(2 * Math.PI * nu * widths[0]) + 8 * Math.cos(2 * Math.PI * nu * widths[1])) / 72,
  );
  close(field.sagittal, expected, 2e-15, "sagittal");
  assert.deepEqual(field.tangential, [1, 1, 1, 1]);
  assert.deepEqual([field.validRays, field.blockedRays], [128, 6], "the counts add up over the lines");
  assert.equal(field.status, "unconverged", "one grid has nothing to be held to");
  assert.equal(bundles.length, 2);
  // The second line is handed the first line's chief ray, and its own, which lies elsewhere, is not the reference.
  assert.deepEqual(traced, [
    [8, 0, 1, null],
    [8, 1, 1, REFERENCE],
  ]);
  assert.deepEqual(reference, REFERENCE);
  assert.notDeepEqual(bundles[1].chief, REFERENCE);
});

test("a footprint whose border carries flux is widened and the grid traced again, twice for a field and no more", () => {
  const traced: unknown[][] = [];
  const api = standIn(
    {
      lines: [{ wavelengthNm: 550, weight: 1 }],
      halfWidth: () => 0.01,
      // Rays reach the border in x until the box is 4 wide: wider than two widenings make it.
      open: (box) => ({ x: box.x1 < 4, y0: false, y1: false }),
    },
    traced,
  );
  const [{ field, gridSizes, expansions, footprint }] = replayLvMtf(
    api,
    STATE,
    optionsOf({ fieldFractions: [0] }),
  ).fields;
  assert.equal(expansions, 2);
  assert.deepEqual(gridSizes, [8, 16]);
  // The first grid is traced over 1, 2 and 3; the widened footprint is the one the next grid is laid over.
  assert.deepEqual(
    traced.map(([size, , half]) => [size, half]),
    [
      [8, 1],
      [8, 2],
      [8, 3],
      [16, 3],
    ],
  );
  assert.equal(footprint?.x1, 3);
  assert.equal(field.status, "converged");
  assert.deepEqual(field.notes, [
    "Transmitted rays reach the edge of the sampled pupil region; some flux may be missing.",
  ]);
});

test("too few rays at a grid is no pupil, which a finer grid mends; with none left the field is unavailable, coded", () => {
  const lines = [{ wavelengthNm: 550, weight: 1 }];
  // 15 rays at 8 cells, one below the stand-in's minimum; enough from 16 on.
  const few = standIn({ lines, halfWidth: () => 0.01, rays: (size) => (size === 8 ? 15 : size * size) });
  const [mended] = replayLvMtf(few, STATE, optionsOf({ fieldFractions: [0] })).fields;
  assert.deepEqual(mended.gridSizes, [8, 16, 32]);
  assert.equal(mended.field.status, "converged");
  assert.equal(mended.field.gridSize, 32);

  const never = standIn({ lines, halfWidth: () => 0.01, rays: () => 15 });
  const [empty] = replayLvMtf(never, STATE, optionsOf({ fieldFractions: [0] })).fields;
  assert.deepEqual(empty.gridSizes, [8, 16, 32]);
  assert.deepEqual([empty.field.status, empty.field.reason], ["unavailable", "empty-pupil"]);
  assert.deepEqual(empty.bundles, []);
  assert.equal(empty.reference, null);
});

test("unresolved rays add up over the lines, and their share of the launched flux is held to LensVisualizer's rule", () => {
  // Line 0: 64 rays of weight 1 land, 2 are unresolved and stand for a weight of 4. Line 1: 64 rays of weight 0.25
  // land, 3 are unresolved and stand for 1. Launched: (64 + 4) + (16 + 1) = 85, of which 5 unresolved: 1/17.
  const spec: StandIn = {
    lines: [
      { wavelengthNm: 550, weight: 1 },
      { wavelengthNm: 480, weight: 0.5 },
    ],
    halfWidth: () => 0.01,
    rayWeight: (line) => [1, 0.25][line],
    unresolved: (line) =>
      [
        { rays: 2, weight: 4 },
        { rays: 3, weight: 1 },
      ][line],
    ladder: [8, 16],
  };
  const options = optionsOf({ fieldFractions: [0] });
  const [kept] = replayLvMtf(standIn({ ...spec, maxUnknownFlux: 0.06 }), STATE, options).fields;
  assert.deepEqual(kept.gridSizes, [8, 16]);
  assert.equal(kept.field.status, "converged");
  assert.deepEqual([kept.field.validRays, kept.field.failedRays], [2 * 16 * 16, 5]);
  // At 16 cells: (256 + 4) + (64 + 1) = 325 launched, 5 unresolved.
  assert.equal(kept.field.unknownFluxFraction, 5 / 325);
  assert.deepEqual(kept.field.notes, ["5 unresolved"]);

  // 5 / 85 at 8 cells is above a rule of 0.05: the field ends there, coded, and no finer grid is asked for.
  const [refused] = replayLvMtf(standIn({ ...spec, maxUnknownFlux: 0.05 }), STATE, options).fields;
  assert.deepEqual(refused.gridSizes, [8]);
  assert.deepEqual([refused.field.status, refused.field.reason], ["unavailable", "trace-failed"]);
  assert.deepEqual([refused.field.failedRays, refused.field.unknownFluxFraction], [5, 5 / 85]);
  assert.deepEqual(refused.bundles, []);
});

test("a field the estimator has no value for is unavailable with the estimator's reason, never left out", () => {
  const api = standIn({ lines: [{ wavelengthNm: 550, weight: 1 }], halfWidth: () => 0.01, brokenLanding: true });
  const replay = replayLvMtf(api, STATE, optionsOf());
  assert.equal(replay.fields.length, 2);
  for (const { field, gridSizes } of replay.fields) {
    assert.equal(field.status, "unavailable");
    assert.equal(field.reason, `${REPLAY_ESTIMATOR_REASON}bad-landing`);
    assert.match(field.message, /^line 0: ray 0 lands at /);
    // It is no failure a finer grid could mend: the refinement ends at the first grid.
    assert.deepEqual(gridSizes, [8]);
  }
});

test("a request the gate refuses, and one without a field axis, are replayed as LensVisualizer states them", () => {
  const api = standIn({ lines: [{ wavelengthNm: 550, weight: 1 }], halfWidth: () => 0.01 });
  const refused: LvReplayApi = {
    ...api,
    computeMtfSteps: (state, options) => {
      const first = api.computeMtfSteps(state, options).next().value;
      const support = { ...first.support, available: false, reason: "unsupported-path", message: "No." };
      return atOnce({ ...first, support, fields: [], geometry: null, focus: null });
    },
  };
  const none = replayLvMtf(refused, STATE, optionsOf());
  assert.equal(none.support.available, false);
  assert.deepEqual(none.fields, []);

  const axisless: LvReplayApi = {
    ...api,
    computeMtfSteps: (state, options) => {
      const first = api.computeMtfSteps(state, options).next().value;
      const fields = first.fields.map((field): LvMtfFieldResult => ({
        ...field,
        status: "unavailable",
        reason: "chief-ray-failed",
      }));
      return atOnce({ ...first, fields, geometry: null, focus: null });
    },
  };
  const replay = replayLvMtf(axisless, STATE, optionsOf());
  assert.deepEqual(
    replay.fields.map(({ field, gridSizes }) => [field.status, field.reason, gridSizes.length]),
    [
      ["unavailable", "chief-ray-failed", 0],
      ["unavailable", "chief-ray-failed", 0],
    ],
  );
  assert.equal(replay.imagePlaneZ, 100);
});

test("the grid cap of the request ends the ladder, and the applied focus shift moves the plane every bundle is traced on", () => {
  const lines = [{ wavelengthNm: 550, weight: 1 }];
  const planes: number[] = [];
  const api = standIn({ lines, halfWidth: (_line, size) => 0.02 * (1 + 8 / size) });
  const shifted: LvReplayApi = {
    ...api,
    computeMtfSteps: function* (state, options) {
      const first = api.computeMtfSteps(state, options).next().value;
      const result = {
        ...first,
        focus: { requestedMode: "best-axial", mode: "best-axial", appliedShiftMm: -0.125, bestAxialShiftMm: -0.125 },
      };
      yield result;
      return result;
    },
    traceMtfBundle: (...args) => {
      planes.push(args[7] as number);
      return api.traceMtfBundle(...args);
    },
  };
  const replay = replayLvMtf(shifted, STATE, optionsOf({ fieldFractions: [0], maxGridSize: 16, focus: "best-axial" }));
  assert.deepEqual(replay.ladder, [8, 16]);
  assert.equal(replay.imagePlaneZ, 100 + -0.125);
  assert.deepEqual(planes, [99.875, 99.875]);
  assert.deepEqual(replay.fields[0].gridSizes, [8, 16]);
  assert.equal(replay.fields[0].field.status, "unconverged", "the ladder ended before the curves settled");
  assert.equal(replay.fields[0].field.gridSize, 16);
});

// ── Against the fake tree: the fake's own sampled MTF ────────────────────────────────────────────────────────────

/** The fake tree with the singlet's geometric MTF sampled, and whatever else its file is to state. */
function sampledTree(t: TestContext, more = "", name = "sampled"): string {
  return variantOf(freshLv(t), name, {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", `focusTravel: 5,\n  mtf: { sampled: true },\n  ${more}`),
  });
}

async function modelOf(
  binding: LvBinding,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(SINGLET, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return { opticalCase: exported.opticalCase, model: rebuilt.model };
}

const SPEC: MtfNativeSpec = {
  frequenciesPerMm: [0, 5, 10, 20, 40],
  fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
  method: "geometric",
  focus: "design",
};

/** The request the engines make for a case and a spec, the fake's own answer to it, and the replay of it. */
function both(binding: LvBinding, model: LvCaseModel, spec: MtfNativeSpec = SPEC, engineOptions: JsonObject = {}) {
  const request = lvMtfRequest(binding.api, model, spec, engineOptions);
  assert.ok(!("refused" in request), JSON.stringify(request));
  const own = binding.api.computeMtf(model.state, request.options);
  const replay = replayLvMtf(binding.api, model.state, request.options);
  return { request, own, replay };
}

/** Holds a replay to the fake's own result, field by field: what was sampled exactly, the curves to a rounding. */
function assertSameSampling(own: LvMtfResult, replay: LvReplay): void {
  assert.equal(replay.fields.length, own.fields.length);
  assert.deepEqual(replay.frequenciesPerMm, own.frequenciesPerMm);
  own.fields.forEach((field, index) => {
    const replayed = replay.fields[index].field;
    const what = `field ${field.fieldFraction}`;
    for (const member of [
      "fieldFraction",
      "targetImageHeightMm",
      "fieldAngleDeg",
      "imageHeightMm",
      "status",
      "reason",
      "gridSize",
      "validRays",
      "blockedRays",
      "failedRays",
      "unknownFluxFraction",
    ] as const) {
      assert.equal(replayed[member], field[member], `${what}: ${member}`);
    }
    // The fake sums plainly and the estimator compensates: the two are a few roundings apart, and no more.
    close(replayed.sagittal, field.sagittal, 1e-13, `${what} sagittal`);
    close(replayed.tangential, field.tangential, 1e-13, `${what} tangential`);
  });
}

test("the replay of the fake's sampled MTF is the fake's own result: grids, counts, status, and curves to a rounding", async (t) => {
  const binding = await bind(t, sampledTree(t));
  for (const options of [
    {},
    { lines: { kind: "photopic" } },
    { lines: { kind: "photopic" }, imagePlane: { kind: "lv-best-axial" } },
    { aperture: { kind: "lv-f8-comparison" }, imagePlane: { kind: "lv-best-axial" } },
  ] as RunOptions[]) {
    const { model } = await modelOf(binding, options);
    const { own, replay } = both(binding, model);
    assertSameSampling(own, replay);
    // The test is of something: every field has curves that are not flat, on a grid the ladder was walked to.
    for (const { field, gridSizes, bundles, reference } of replay.fields) {
      assert.notEqual(field.status, "unavailable", JSON.stringify(options));
      assert.ok(gridSizes.length >= 2 && gridSizes.at(-1) === field.gridSize, `grids ${gridSizes.join(", ")}`);
      assert.ok(field.sagittal[4] < 0.999 && field.sagittal[0] === 1);
      assert.equal(bundles.length, model.exported.conditions.lines.length);
      assert.equal(
        bundles.reduce((rays, bundle) => rays + bundle.rays.length, 0),
        field.validRays,
        "the rays of the final grid are the ones the field counts",
      );
      assert.deepEqual(reference, bundles[0].chief);
    }
    assert.equal(replay.imagePlaneZ, model.exported.conditions.imageZ, "the plane of the replay is the case's");
  }
});

test("a footprint the fake's scan found too small is widened in the replay as in the fake, to the same counts", async (t) => {
  // The fake's scan finds 0.7 of the beam: rays reach the border of the box, which is widened once, the fake's limit.
  const lv = variantOf(freshLv(t), "narrow", {
    [SINGLET_FILE]: (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  mtf: { sampled: true, footprintScale: 0.7 },"),
  });
  const binding = await bind(t, lv);
  const { model } = await modelOf(binding);
  const { own, replay } = both(binding, model);
  assertSameSampling(own, replay);
  assert.ok(replay.fields.every((field) => field.expansions === 1));
  // The scan's box is 1.25 x 0.7 of the seed, the singlet's pupil of 6.25 mm; widened in x by half its side, it is
  // twice as wide, and that is the footprint the field is left with.
  const scanned = 1.25 * (6.25 * 0.7);
  for (const field of replay.fields) assert.equal(field.footprint?.x1, scanned + (2 * scanned) / 2);
});

test("a field the fake cannot sample is unavailable in the replay with the fake's own reason, each field on its own", async (t) => {
  // The format corner lies beyond the modeled edge, one fraction has no angle, and beyond 15 degrees no chief ray.
  const more = "field: { referenceHeightMm: 12, unsolvedFraction: 0.25, chiefLimitDeg: 15 },";
  const binding = await bind(t, sampledTree(t, more));
  const { model } = await modelOf(binding);
  const spec: MtfNativeSpec = { ...SPEC, fields: { kind: "image-height-fractions", values: [0, 0.25, 0.5, 0.75, 1] } };
  const { own, replay } = both(binding, model, spec);
  assertSameSampling(own, replay);
  assert.deepEqual(
    replay.fields.map(({ field }) => [field.fieldFraction, field.status === "unavailable" ? field.reason : "curves"]),
    [
      [0, "curves"],
      [0.25, "chief-ray-failed"],
      [0.5, "curves"],
      // 9 mm is 18 degrees in the fake: within its model, and beyond the angle it finds a chief ray for.
      [0.75, "chief-ray-failed"],
      [1, "outside-modeled-field"],
    ],
  );

  // A stop so small that the chief ray of the edge is stopped: the fake has no beam there, and says "vignetted".
  const stopped = await modelOf(binding, { aperture: { kind: "stop-radius", mm: 0.5 } });
  const edge = both(binding, stopped.model);
  assertSameSampling(edge.own, edge.replay);
  assert.deepEqual(
    edge.replay.fields.map(({ field }) => field.reason),
    [null, "vignetted", "outside-modeled-field"],
  );
});

// ── The engine ───────────────────────────────────────────────────────────────────────────────────────────────────

function engineOn(t: TestContext, binding: LvBinding, id: "lv" | "replay"): RemoteEngineAdapter {
  const handler = id === "lv" ? createLvEngineOn(binding) : createLvReplayEngineOn(binding);
  const adapter = new RemoteEngineAdapter({ id, transport: createInProcessTransport(handler) });
  t.after(() => adapter.close());
  return adapter;
}

function ask(
  engine: RemoteEngineAdapter,
  opticalCase: OpticalCase,
  spec: MtfNativeSpec,
  engineOptions?: JsonObject,
): Promise<ResultEnvelope> {
  return engine.run(makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec, engineOptions }), opticalCase);
}

function dataOf(result: ResultEnvelope): MtfNativeData {
  assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, result.data), []);
  return result.data as MtfNativeData;
}

function curve(wire: NdArrayWire): number[] {
  return [...decodeNdArray(wire).values] as number[];
}

test("the engine replay describes itself: LensVisualizer's fingerprint, an adapter revision of its own, mtf.native", async (t) => {
  const binding = await bind(t, sampledTree(t));
  const { identity, capabilities } = await engineOn(t, binding, "replay").describe();
  const lv = (await engineOn(t, binding, "lv").describe()).identity;
  assert.equal(LV_REPLAY_ENGINE_ID, "replay");
  assert.equal(identity.id, "replay");
  assert.equal(identity.fingerprint, binding.fingerprint().engineClosureHash);
  assert.equal(identity.fingerprint, lv.fingerprint, "its rays are LensVisualizer's");
  assert.equal(identity.adapterRevision, adapterRevision(LV_REPLAY_ENGINE_MODULE).revision);
  assert.notEqual(identity.adapterRevision, lv.adapterRevision);
  assert.deepEqual(capabilities.quantities, { [MTF_NATIVE]: { version: mtfNativeQuantity.version } });
  // What it sums with is in its revision: the replay and the estimator. Neither is behind the engine lv.
  const closure = importClosure(LV_REPLAY_ENGINE_MODULE);
  for (const file of ["engines/lv/replay.ts", "estimators/geometricOtf.ts", "engines/lv/mtf.ts"])
    assert.ok(closure.includes(file), file);
  const ofLv = importClosure("engines/lv/engine.ts");
  assert.ok(!ofLv.includes("engines/lv/replay.ts") && !ofLv.includes("estimators/geometricOtf.ts"));
});

test("replay answers the request lv answers, in lv's form: the two answers differ by a rounding and in no count", async (t) => {
  const binding = await bind(t, sampledTree(t));
  const [lv, replay] = [engineOn(t, binding, "lv"), engineOn(t, binding, "replay")];
  for (const options of [{}, { lines: { kind: "photopic" }, imagePlane: { kind: "lv-best-axial" } }] as RunOptions[]) {
    const { opticalCase } = await modelOf(binding, options);
    const [product, replayed] = [
      dataOf(await ask(lv, opticalCase, SPEC)),
      dataOf(await ask(replay, opticalCase, SPEC)),
    ];
    assert.deepEqual(replayed.focus, product.focus);
    assert.deepEqual(replayed.focus, { mode: "design", appliedShiftMm: 0 }, "both are of the plane of the case");
    assert.deepEqual(replayed.lines, product.lines);
    assert.equal(replayed.method.name, "replay-geometric");
    assert.deepEqual(replayed.method.params.ladder, [4, 8, 16, 32, 64, 128], "the fake's ladder, to the cap of 128");
    assert.deepEqual(replayed.aperture, {});
    product.fields.forEach((field, index) => {
      const other = replayed.fields[index];
      assert.deepEqual([other.field, other.status, other.reason], [field.field, field.status, field.reason]);
      assert.deepEqual([other.fieldAngleDeg, other.imageHeightMm], [field.fieldAngleDeg, field.imageHeightMm]);
      for (const name of ["gridSize", "validRays", "blockedRays", "failedRays", "unknownFluxFraction"]) {
        assert.equal(other.sampling[name], field.sampling[name], name);
      }
      // What only the replay knows of a field: how many grids it traced, and how often it widened the footprint.
      assert.ok(other.sampling.gridSizesTraced >= 2);
      assert.ok([0, 1].includes(other.sampling.footprintExpansions));
      assert.equal(Object.hasOwn(field.sampling, "gridSizesTraced"), false);
      close(curve(other.sagittal), curve(field.sagittal), 1e-13, "sagittal");
      close(curve(other.tangential), curve(field.tangential), 1e-13, "tangential");
    });
  }
  // The grid cap is an option of both: capped at 32, both end their ladders there.
  const { opticalCase } = await modelOf(binding);
  const capped = dataOf(await ask(replay, opticalCase, SPEC, { lvGridCap: 32 }));
  assert.deepEqual(capped.method.params.ladder, [4, 8, 16, 32]);
  assert.equal(capped.method.params.maxGridSize, 32);
});

test("replay has the geometric estimator and no profile; whatever lv refuses, it refuses with the same item", async (t) => {
  const binding = await bind(t, sampledTree(t));
  const [lv, replay] = [engineOn(t, binding, "lv"), engineOn(t, binding, "replay")];
  const { opticalCase } = await modelOf(binding);
  assert.deepEqual((await ask(replay, opticalCase, { ...SPEC, method: "diffraction" })).unsupported, [
    {
      code: "option",
      item: "method.diffraction",
      message: "the engine replay has the comparator's geometric estimator and no other",
    },
  ]);
  assert.deepEqual((await ask(replay, opticalCase, { ...SPEC, profile: "lv-tab-default" })).unsupported, [
    { code: "option", item: "profile", message: "the engine replay has no profile: it is asked by a spec" },
  ]);
  const shifted = (await modelOf(binding, { imagePlane: { kind: "shift", mm: 0.25 } })).opticalCase;
  const angles: MtfNativeSpec = { ...SPEC, fields: { kind: "angles-deg", values: [0, 5] } };
  for (const [about, spec, options] of [
    [shifted, SPEC, undefined],
    [opticalCase, angles, undefined],
    [opticalCase, SPEC, { lvGridCap: 48 }],
    [opticalCase, { ...SPEC, frequenciesPerMm: [0, 500] }, undefined],
  ] as const) {
    const [ofLv, ofReplay] = [await ask(lv, about, spec, options), await ask(replay, about, spec, options)];
    assert.equal(ofLv.status, "unsupported");
    assert.deepEqual(ofReplay.unsupported, ofLv.unsupported);
  }
  // A case that no LensVisualizer lens stands behind has no sampling to replay.
  const fixture = await ask(replay, FIXTURE_CASE, SPEC);
  assert.deepEqual(
    fixture.unsupported?.map(({ code, item }) => [code, item]),
    [["case-source", "fixture"]],
  );
  assert.match(fixture.unsupported?.[0].message ?? "", /^the engine replay answers from LensVisualizer's own state/);
});
