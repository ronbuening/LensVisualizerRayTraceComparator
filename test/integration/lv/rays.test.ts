// Rays against the real LensVisualizer: its own pinned rays reproduced through the binding, the comparator's own
// canaries on its tracer, and the ray sets of the benchmark lenses traced through `lvrtc run` and held, ray by ray,
// to LensVisualizer's own MTF bundle. Run output goes to a temporary directory.
//
// The numbers quoted in comments, and the pinned ones, were measured at LV commit d36f44b3 with the catalog of that
// commit.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import type { OpticalCase } from "../../../src/contract/case.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions, Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { decodeNdArray, encodeNdArray, ndRow } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { STORE_DIRECTORY, createResultStore } from "../../../src/core/resultStore.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvFieldAngles, lvFieldRays, lvLaunchSetup, lvRaySets } from "../../../src/engines/lv/raySets.ts";
import type { LvFieldRays, LvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { lvTraceOptions } from "../../../src/engines/lv/rays.ts";
import type { LvMtfBundle, LvTraceResult, LvVec3 } from "../../../src/engines/lv/types.ts";
import { profileOf, sag, unitNormal } from "../../../src/engines/ref/surface.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { startsInFront } from "../../../src/rays/probe.ts";
import { DEFAULT_BUNDLE_GRID, DEFAULT_RAY_FIELDS, raySetId } from "../../../src/rays/raySets.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { exactLength } from "../../estimators/support.ts";
import { suitePath } from "../../suites/support.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE, asItOpens } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));

function tempDir(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-lv-rays-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** Runs one `lvrtc` command as a child process, on the real LensVisualizer, writing runs into `runsDir`. */
function lvrtc(runsDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
  const child = spawnSync(process.execPath, [BIN, ...args], { encoding: "utf8", cwd: REPO_ROOT, env });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

function encode(values: readonly number[], shape: readonly number[]): NdArrayWire {
  return encodeNdArray(Float64Array.from(values), shape);
}

function f8(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return decoded.values as Float64Array;
}

/** Whether two numbers are the same double: the same bits, so that -0 is not 0. */
function sameBits(a: number, b: number): boolean {
  return Object.is(a, b);
}

/** The model of a lens of the catalog under a run's options, as the engine and the ray generator hold it. */
async function modelOf(
  binding: LvBinding,
  key: string,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, `${key}: ${JSON.stringify(exported)}`);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, key);
  return { opticalCase: exported.opticalCase, model: rebuilt.model };
}

/** One ray of a set, traced by LensVisualizer with the options the engine traces it with. */
function traced(binding: LvBinding, model: LvCaseModel, spec: RaysTraceSpec, ray: number): LvTraceResult {
  const [origins, directions] = [f8(spec.origins), f8(spec.directions)];
  const origin: LvVec3 = [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]];
  const direction: LvVec3 = [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]];
  return binding.api.traceEngineRay2(model.state, { origin, direction }, lvTraceOptions(model, spec.line));
}

// ── LensVisualizer's own pinned rays ─────────────────────────────────────────────────────────────────────────────

/**
 * Copied from LensVisualizer's `__tests__/src/optics/exactTraceGoldenValues.test.ts` (`GOLDEN_LENSES`) at commit
 * d36f44b3: its three plain refractive lenses. A ray parallel to the axis is launched at the height `h`, or at
 * (`x0`, `y0`); the height and the slope of the ray are those on the vertex plane of the last surface, behind it.
 * LensVisualizer holds them to 6 and 8 decimals (`toBeCloseTo`), which is 5e-7 mm and 5e-9.
 */
const GOLDEN = [
  {
    key: "olympus-zuiko-auto-s-50f14",
    marginal: { h: 12.5, y: 9.58533019704501, u: -0.25841395919948856 },
    skew: {
      x0: 6,
      y0: 5,
      x: 4.512643107705916,
      y: 3.760535923088265,
      ux: -0.12164965741409134,
      uy: -0.10137471451174285,
    },
  },
  {
    key: "canon-fd-300mm-f4-ssc",
    marginal: { h: 26, y: 10.134889384645048, u: -0.08720040235172787 },
    skew: {
      x0: 12.48,
      y0: 10.4,
      x: 4.852659673068311,
      y: 4.043883060890261,
      ux: -0.041741593291062314,
      uy: -0.034784661075885154,
    },
  },
  {
    key: "zeiss-touit-50mm-f28-macro",
    marginal: { h: 6.4382, y: 2.8753046706583976, u: -0.12605083196312913 },
    skew: {
      x0: 3.0903,
      y0: 2.5753,
      x: 1.3726550434168818,
      y: 1.1439014119378372,
      ux: -0.06021965588711908,
      uy: -0.05018402090609257,
    },
  },
] as const;

const HEIGHT_TOLERANCE_MM = 5e-7;
const SLOPE_TOLERANCE = 5e-9;

test(
  "LensVisualizer's own golden rays are reproduced through the binding: traceRay2, and the tracer lv answers with",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const { api } = binding;
    const worst = { height: 0, slope: 0 };
    const near = (actual: number, expected: number, tolerance: number, what: string): void => {
      const difference = Math.abs(actual - expected);
      assert.ok(difference <= tolerance, `${what}: ${actual} against ${expected}`);
      if (tolerance === HEIGHT_TOLERANCE_MM) worst.height = Math.max(worst.height, difference);
      else worst.slope = Math.max(worst.slope, difference);
    };
    for (const { key, marginal, skew } of GOLDEN) {
      const runtime = api.buildLens((await binding.lens(key)).data);
      const state = api.prepareRuntimeState(runtime, 0, 0);
      const stop = api.wideOpenStopAtZoom(0, runtime);

      // As LensVisualizer's test traces it: the meridional adapter, with the wide-open stop.
      const meridional = api.traceRay2(marginal.h, 0, [...state.z], 0, 0, stop, true, runtime);
      assert.equal(meridional.clipped, false, key);
      near(meridional.y, marginal.y, HEIGHT_TOLERANCE_MM, `${key} traceRay2 y`);
      near(meridional.u, marginal.u, SLOPE_TOLERANCE, `${key} traceRay2 u`);

      // And through the tracer the engine uses, with the engine's options: the end of the trace, carried back to
      // the last vertex plane, is the same ray.
      const [first] = state.surfaces;
      const launchZ = Math.min(0, first.profile.sag(first.sd)) - 10;
      const lastZ = state.z[state.z.length - 1];
      const options = { checkSemiDiameter: true, stopSemiDiameter: stop, stopOnClip: true, directionNormalized: true };
      const onLastVertexPlane = (origin: LvVec3) => {
        const trace = api.traceEngineRay2(state, { origin, direction: [0, 0, 1] }, options);
        assert.equal(trace.status, "ok", key);
        assert.equal(trace.hits.length, state.surfaces.length, key);
        const [point, direction] = [trace.terminalPoint, trace.terminalDirection];
        const back = (lastZ - point[2]) / direction[2];
        return {
          x: point[0] + back * direction[0],
          y: point[1] + back * direction[1],
          ux: direction[0] / direction[2],
          uy: direction[1] / direction[2],
        };
      };
      const meridionalRay = onLastVertexPlane([0, marginal.h, launchZ]);
      near(meridionalRay.y, marginal.y, HEIGHT_TOLERANCE_MM, `${key} traceEngineRay2 y`);
      near(meridionalRay.uy, marginal.u, SLOPE_TOLERANCE, `${key} traceEngineRay2 u`);
      assert.deepEqual([meridionalRay.x, meridionalRay.ux], [0, 0], `${key}: a meridional ray stays meridional`);
      const skewRay = onLastVertexPlane([skew.x0, skew.y0, launchZ]);
      near(skewRay.x, skew.x, HEIGHT_TOLERANCE_MM, `${key} skew x`);
      near(skewRay.y, skew.y, HEIGHT_TOLERANCE_MM, `${key} skew y`);
      near(skewRay.ux, skew.ux, SLOPE_TOLERANCE, `${key} skew ux`);
      near(skewRay.uy, skew.uy, SLOPE_TOLERANCE, `${key} skew uy`);
    }
    // At d36f44b3 every one of the 18 numbers is reproduced to 2.1e-17 or better.
    t.diagnostic(`golden rays: worst height difference ${worst.height} mm, worst slope difference ${worst.slope}`);
  },
);

// ── The comparator's own canaries ────────────────────────────────────────────────────────────────────────────────

/**
 * One skew ray through each of two benchmark lenses at infinity focus, wide open, on the reference line, traced by
 * `traceEngineRay2` with the engine's options: where it leaves the last surface, in which direction, its optical
 * path, and where the comparator's projection lands it. Measured at d36f44b3. A change beyond LensVisualizer's own
 * intersection tolerance of 1e-9 mm means its tracer, or the lens, is no longer the one the numbers were taken of.
 */
const CANARIES = [
  {
    key: "canon-ef-135-f2l-usm",
    origin: [3, 4, -60],
    aim: [0.01, -0.02, 1],
    exitPoint: [2.603252579414953, -1.1501505338878442, 100.97924866476883],
    exitDirection: [-0.023413174888864054, -0.028059641369519016, 0.9993320167831298],
    opticalPath: 197.96151409289845,
    image: [1.3347983936812464, -2.67033605824754],
    opticalPathToImage: 252.1384547152067,
  },
  {
    key: "nikkor-z50f12",
    origin: [-2.5, 6, -60],
    aim: [0.03, -0.11, 1],
    exitPoint: [1.5332100319987925, -5.664473566426916, 162.604],
    exitDirection: [0.00853117124411296, 0.03004406517736516, 0.9995121676422063],
    opticalPath: 277.62219886480307,
    image: [1.5392018372086227, -5.643372338810786],
    opticalPathToImage: 278.32454149026205,
  },
] as const;

test(
  "two pinned rays through two benchmark lenses: what lv answers is what LensVisualizer's tracer gave at d36f44b3",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    for (const canary of CANARIES) {
      const { opticalCase, model } = await modelOf(binding, canary.key);
      const norm = Math.hypot(...canary.aim);
      const direction = canary.aim.map((component) => component / norm);
      const surfaces = model.state.surfaces.length;
      // The pinned ray, a ray that misses the first surface altogether, and one launched well outside the entrance
      // pupil, which an aperture stops at or before the stop surface.
      const stop = opticalCase.conditions.stopSemiDiameter;
      const pupil = binding.api.entrancePupilAtState2(stop, 0, 0, model.runtime).epSD;
      const spec: RaysTraceSpec = {
        line: 0,
        origins: encode([...canary.origin, 0, 60, -60, 0, 1.3 * pupil, -60], [3, 3]),
        directions: encode([...direction, 0, 0, 1, 0, 0, 1], [3, 3]),
        weights: encode([1, 1, 1], [3]),
      };
      assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
      const result = await lv.run(makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }), opticalCase);
      assert.equal(result.status, "ok", JSON.stringify(result.error));
      assert.deepEqual(resultDataProblems(raysTraceQuantity, result.data), []);
      assert.deepEqual(result.method, { name: "sequential-trace", params: {} });
      const data = result.data as RaysTraceData;
      const [status, endSurface] = [decodeNdArray(data.status).values, decodeNdArray(data.endSurface).values];
      assert.equal(status[0], 0, canary.key);
      assert.equal(endSurface[0], -1, canary.key);

      const near = (actual: ArrayLike<number>, expected: readonly number[], tolerance: number, what: string) => {
        expected.forEach((value, index) => {
          assert.ok(Math.abs(actual[index] - value) <= tolerance, `${canary.key} ${what}[${index}]: ${actual[index]}`);
        });
      };
      near(f8(data.exitPoint), canary.exitPoint, 1e-8, "exitPoint");
      near(f8(data.exitDirection), canary.exitDirection, 1e-10, "exitDirection");
      near(f8(data.opticalPath), [canary.opticalPath], 1e-8, "opticalPath");
      near(f8(data.imagePoint), canary.image, 1e-8, "imagePoint");
      near(f8(data.opticalPathToImage), [canary.opticalPathToImage], 1e-8, "opticalPathToImage");
      assert.equal(f8(data.imagePoint)[2], opticalCase.conditions.imageZ);
      // The exit point is the hit on the last surface, and the image space is air.
      const hits = f8(data.hits);
      assert.deepEqual(
        [...hits.subarray((surfaces - 1) * 9, (surfaces - 1) * 9 + 3)],
        [...f8(data.exitPoint)].slice(0, 3),
      );
      const [exit, image] = [f8(data.exitPoint), f8(data.imagePoint)];
      const toImage = Math.hypot(image[0] - exit[0], image[1] - exit[1], image[2] - exit[2]);
      assert.ok(Math.abs(f8(data.opticalPathToImage)[0] - f8(data.opticalPath)[0] - toImage) < 1e-12, canary.key);

      // 60 mm off the axis a ray meets no surface at all: LensVisualizer proves the miss, so it is blocked at
      // surface 0 and nothing of it is a number. The ray past the stop's radius is stopped at a surface it reached.
      assert.deepEqual([status[1], endSurface[1]], [1, 0], `${canary.key}: the ray that misses`);
      assert.equal(status[2], 1, `${canary.key}: the ray outside the entrance pupil`);
      assert.ok(endSurface[2] >= 0 && endSurface[2] <= model.state.lens.stop.surfaceIndex, String(endSurface[2]));
      for (let surface = 0; surface < surfaces; surface++) {
        assert.ok(Number.isNaN(hits[(surface * 3 + 1) * 3]), `the missing ray has no hit on surface ${surface}`);
        const reached = surface < endSurface[2];
        assert.equal(Number.isFinite(hits[(surface * 3 + 2) * 3]), reached, `the stopped ray on surface ${surface}`);
      }
      assert.deepEqual(result.diagnostics.counts, { surfaces, lines: 1, rays: 3, ok: 1, blocked: 2, failed: 0 });
    }
  },
);

// ── The ray sets of the benchmark, through the commands ──────────────────────────────────────────────────────────

/** A field of a run as the generator resolved it, with LensVisualizer's own bundle over the same lattice. */
interface FieldCheck {
  readonly setup: LvLaunchSetup;
  readonly rays: LvFieldRays;
  readonly bundle: LvMtfBundle;
}

/** The launch of one field of a model, and LensVisualizer's own bundle of it at one line, with optical paths. */
function fieldCheck(binding: LvBinding, model: LvCaseModel, angleDeg: number, line: number): FieldCheck {
  const { api } = binding;
  const setup = lvLaunchSetup(api, model);
  assert.ok(!("problem" in setup), JSON.stringify(setup));
  const rays = lvFieldRays(api, model, setup, angleDeg, DEFAULT_BUNDLE_GRID);
  assert.ok(!("problem" in rays), JSON.stringify(rays));
  const { imageZ } = model.exported.conditions;
  const bundle = api.traceMtfBundle(
    model.state,
    setup.options,
    setup.support,
    rays.launch,
    rays.footprint,
    DEFAULT_BUNDLE_GRID,
    setup.support.spectralLines[line],
    imageZ,
    { opticalPath: true },
  );
  assert.ok(bundle !== null);
  return { setup, rays, bundle };
}

/**
 * Holds the answer to one ray set to LensVisualizer itself and returns how many rays were held to it bit for bit.
 *
 * - Every ray that is ok lands where LensVisualizer's `mtfImagePoint` lands its trace, and has its optical path,
 *   bit for bit; every other ray has no image point there either. Its path to the image is that path and the index
 *   LensVisualizer ends in times the length of the stretch to the plane (`distanceToPlane`), bit for bit.
 * - The rays of the lattice that are ok are as many as LensVisualizer's own bundle counts as valid, the blocked
 *   and the failed ones as many as it counts as blocked and as failed.
 * - Each ray of the bundle that LensVisualizer traced (it traces half the columns) starts where the set starts the
 *   cell, weighs what the set weighs it, lands where the answer lands it and has the answer's optical path, bit for
 *   bit. Each ray it mirrored instead agrees with the real trace of its cell to 1e-11 mm.
 */
function heldToLensVisualizer(
  binding: LvBinding,
  model: LvCaseModel,
  spec: RaysTraceSpec,
  data: RaysTraceData,
  check: FieldCheck,
  at: string,
): { exact: number; mirrored: number; worstMirrored: number; landed: number; notTheParameter: number } {
  const { api } = binding;
  const { columns, rows } = check.rays.grid;
  const cells = columns * rows;
  const status = decodeNdArray(data.status).values;
  const [image, path, toImage] = [f8(data.imagePoint), f8(data.opticalPath), f8(data.opticalPathToImage)];
  const [origins, weights] = [f8(spec.origins), f8(spec.weights)];
  const rays = status.length;
  assert.equal(rays, cells + 1, at);
  assert.deepEqual(spec.groups?.lattice, { columns, rows, step: check.rays.grid.step }, at);
  assert.equal(spec.groups?.chiefIndex, cells, at);
  assert.equal(columns % 2, 0, `${at}: LensVisualizer's lattice has an even number of columns`);

  const { imageZ } = model.exported.conditions;
  const counts = [0, 0, 0];
  let [landed, notTheParameter] = [0, 0];
  for (let ray = 0; ray < rays; ray++) {
    const trace = traced(binding, model, spec, ray);
    const spot = api.mtfImagePoint(model.state, trace, imageZ);
    assert.equal(status[ray] === 0, spot !== null, `${at} ray ${ray}`);
    if (ray < cells) counts[status[ray]]++;
    if (spot === null) continue;
    assert.ok(sameBits(image[3 * ray], spot.x) && sameBits(image[3 * ray + 1], spot.y), `${at} ray ${ray} lands`);
    assert.equal(image[3 * ray + 2], imageZ, at);
    assert.ok(sameBits(path[ray], trace.opticalPathLengthMm as number), `${at} ray ${ray} optical path`);
    const { parameter, length } = distanceToPlane(trace, imageZ);
    const expected = (trace.opticalPathLengthMm as number) + trace.finalMedium * length;
    assert.ok(sameBits(toImage[ray], expected), `${at} ray ${ray} optical path to the image`);
    // LensVisualizer's directions are unit vectors to a rounding: the length is the parameter or a neighbour of it.
    assert.ok(Math.abs(length - parameter) <= 4 * Number.EPSILON * parameter, `${at} ray ${ray}: ${length}`);
    landed++;
    if (!sameBits(expected, (trace.opticalPathLengthMm as number) + trace.finalMedium * parameter)) notTheParameter++;
  }
  assert.deepEqual(counts, [check.bundle.rays.length, check.bundle.blocked, check.bundle.failed], at);

  let [exact, mirrored, worstMirrored] = [0, 0, 0];
  for (const own of check.bundle.rays) {
    const ray = own.row * columns + own.column;
    assert.equal(status[ray], 0, `${at} cell ${ray}`);
    const differences = [
      image[3 * ray] - own.x,
      image[3 * ray + 1] - own.y,
      path[ray] - (own.trace.opticalPathLengthMm as number),
      weights[ray] - own.weight,
      ...[0, 1, 2].map((axis) => origins[3 * ray + axis] - own.trace.input.origin[axis]),
    ];
    if (own.column >= columns / 2) {
      assert.deepEqual(differences, [0, 0, 0, 0, 0, 0, 0], `${at} cell ${ray}, which LensVisualizer traced`);
      exact++;
    } else {
      const worst = Math.max(...differences.map(Math.abs));
      assert.ok(worst <= 1e-11, `${at} cell ${ray}, which LensVisualizer mirrored: ${worst}`);
      worstMirrored = Math.max(worstMirrored, worst);
      mirrored++;
    }
  }
  return { exact, mirrored, worstMirrored, landed, notTheParameter };
}

/**
 * A trace's last stretch to the image plane: the parameter of its line there, as LensVisualizer's `mtfImagePoint`
 * takes it, and the length of the stretch, which is that parameter times the length of the direction LensVisualizer
 * ends with, rounded once. The length is worked out in whole numbers (`exactLength`), by nothing of the comparator.
 */
function distanceToPlane(trace: LvTraceResult, imageZ: number): { parameter: number; length: number } {
  const parameter = Math.max(0, (imageZ - trace.terminalPoint[2]) / trace.terminalDirection[2]);
  return { parameter, length: exactLength(parameter, trace.terminalDirection) };
}

/**
 * Holds the answer to one ray set to the case alone, by the reference engine's sag and normal and by nothing of
 * LensVisualizer, and returns how far the worst hit lies from its surface along z, mm.
 *
 * - Every hit of a ray lies on the surface it is the hit of, to twice LensVisualizer's intersection tolerance of
 *   1e-9 mm, and within the surface's clip radius.
 * - Every surface bends the ray by Snell's law with the indices the case states for the spec's line: the index
 *   times the part of the direction that lies along the surface is the same on both sides of it. The directions are
 *   those from hit to hit, and behind the last surface the exit direction.
 * - The optical path is the sum of index times length over the stretches from the origin to the last hit.
 */
function heldToTheCase(opticalCase: OpticalCase, spec: RaysTraceSpec, data: RaysTraceData, at: string): number {
  const { surfaces } = opticalCase.system;
  const profiles = surfaces.map((surface) => profileOf(surface.shape));
  const indices = ndRow(decodeNdArray(opticalCase.conditions.indexAfterSurface), spec.line);
  const [origins, hits, exits, paths] = [f8(spec.origins), f8(data.hits), f8(data.exitDirection), f8(data.opticalPath)];
  const [status, endSurface] = [decodeNdArray(data.status).values, decodeNdArray(data.endSurface).values];
  const rays = status.length;
  const row = (values: Float64Array, index: number): number[] => [...values.subarray(3 * index, 3 * index + 3)];
  const along = (from: number[], to: number[]): { length: number; unit: number[] } => {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    return { length, unit: to.map((value, axis) => (value - from[axis]) / length) };
  };
  const cross = (a: readonly number[], b: readonly number[]): number[] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  let worst = 0;
  for (let ray = 0; ray < rays; ray++) {
    const reached = status[ray] === 0 ? surfaces.length : endSurface[ray];
    const points = [row(origins, ray)];
    for (let surface = 0; surface < reached; surface++) points.push(row(hits, surface * rays + ray));
    let summed = 0;
    for (let surface = 0; surface < reached; surface++) {
      const where = `${at} ray ${ray} surface ${surface}`;
      const hit = points[surface + 1];
      const radius = Math.hypot(hit[0], hit[1]);
      const offSurface = Math.abs(hit[2] - (surfaces[surface].z + sag(profiles[surface], radius)));
      assert.ok(offSurface <= 2e-9, `${where}: the hit is ${offSurface} mm off the surface`);
      assert.ok(radius <= surfaces[surface].aperture.semiDiameter, `${where}: the hit is outside the clip radius`);
      worst = Math.max(worst, offSurface);
      const before = surface === 0 ? 1 : indices[surface - 1];
      const into = along(points[surface], hit);
      summed += before * into.length;
      const last = surface === surfaces.length - 1;
      const out = last
        ? { length: Infinity, unit: row(exits, ray) }
        : surface + 1 < reached
          ? along(hit, points[surface + 2])
          : null;
      // A direction taken from two hits a hair apart is no direction to hold anything to.
      if (out === null || into.length < 1e-3 || out.length < 1e-3) continue;
      const normal = unitNormal(profiles[surface], hit[0], hit[1]);
      const [ahead, behind] = [cross(into.unit, normal), cross(out.unit, normal)];
      const bent = Math.hypot(...ahead.map((value, axis) => before * value - indices[surface] * behind[axis]));
      assert.ok(bent <= 1e-10, `${where}: Snell's law is off by ${bent} with the indices of line ${spec.line}`);
    }
    if (reached === surfaces.length) {
      assert.ok(
        Math.abs(summed - paths[ray]) <= 1e-9,
        `${at} ray ${ray}: optical path ${paths[ray]}, summed ${summed}`,
      );
    }
  }
  return worst;
}

/**
 * Holds the field angle of each set to what its fraction means: the chief ray of the angle, as LensVisualizer aims
 * it for the conjugate of the case and traces it through every surface, lands at that fraction of LensVisualizer's
 * reference image height, to twice the 1e-4 mm it solves an angle to.
 */
function fieldsAtTheirHeights(
  binding: LvBinding,
  model: LvCaseModel,
  setup: LvLaunchSetup,
  sets: readonly RaysTraceSpec[],
  at: string,
): void {
  const { api } = binding;
  const { options, support } = setup;
  const chiefHeight = api.mtfChiefHeight(model.state, options, support, false);
  const geometry = api.resolveMtfFieldGeometry(
    model.state,
    api.mtfModeledHalfField(model.state),
    api.mtfChiefHeight(model.state, options, support),
    { reference: chiefHeight, beam: api.mtfBeamHeight(model.state, options, support) },
  );
  assert.ok(geometry !== null, at);
  for (const spec of sets) {
    const field = spec.groups?.field;
    assert.ok(field?.heightFraction !== undefined, at);
    const height = field.angleDeg === 0 ? 0 : chiefHeight(field.angleDeg);
    const expected = field.heightFraction * geometry.referenceHeightMm;
    assert.ok(Math.abs(height - expected) <= 2e-4, `${at} fraction ${field.heightFraction}: ${height} mm, ${expected}`);
  }
}

test(
  "lvrtc run --rungs r2: on the 12 benchmark configurations, every ray lv traces is LensVisualizer's own",
  { skip, timeout: 600_000 },
  async (t) => {
    const directory = tempDir(t);
    // The benchmark as the lenses open, at the reference line: its 12 runs of that, written beside the run output.
    const benchmark: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const runs = benchmark.runs.filter((run) => run.lines?.kind === "reference" && asItOpens(run));
    assert.equal(runs.length, 12);
    const suiteFile = join(directory, "benchmark-reference.json");
    writeFileSync(suiteFile, JSON.stringify({ ...benchmark, name: "benchmark-reference", runs }));

    const runsDir = join(directory, "runs");
    const ran = lvrtc(runsDir, "run", suiteFile, "--engines", "lv", "--rungs", "r2");
    assert.equal(ran.code, 0, ran.err);
    assert.equal(ran.err, "", "every field has rays");
    assert.match(
      ran.out,
      /^benchmark-reference: 36 jobs: 36 ok, 0 unsupported, 0 error, 0 pending \(36 computed, 0 cached\)$/m,
    );
    // The same command again asks nothing: the rays are the same rays, so the requests have the same ids.
    const again = lvrtc(runsDir, "run", suiteFile, "--engines", "lv", "--rungs", "r2");
    assert.match(again.out, /36 ok, 0 unsupported, 0 error, 0 pending \(0 computed, 36 cached\)$/m);

    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "benchmark-reference", MANIFEST_FILE), "utf8"));
    const store = createResultStore(join(runsDir, STORE_DIRECTORY));
    const binding = await loadLvBinding(LV_PATH);
    const totals = { rays: 0, ok: 0, exact: 0, mirrored: 0, worstMirrored: 0, worstOffSurface: 0 };
    const stretch = { landed: 0, notTheParameter: 0 };
    const configurations = new Set<string>();
    for (const run of runs) {
      const key = run.lens.kind === "lv" ? run.lens.key : "";
      configurations.add(`${key}@${run.state?.zoomT ?? 0}`);
      const { opticalCase, model } = await modelOf(binding, key, { ...benchmark.defaults, ...run });
      const stated = manifest.runs.find((candidate) => candidate.name === run.name);
      assert.equal(stated?.caseId, opticalCase.id, run.name);

      // This process generates the sets the child process generated: the same rays, the same ids.
      const { sets, problems } = lvRaySets(binding.api, model, {});
      assert.deepEqual(problems, [], run.name);
      assert.equal(sets.length, 3, run.name);
      assert.deepEqual(stated?.raySets, { sets: sets.map(raySetId), problems: [] }, run.name);
      const setup = lvLaunchSetup(binding.api, model);
      assert.ok(!("problem" in setup));
      const fields = lvFieldAngles(binding.api, model, setup, DEFAULT_RAY_FIELDS);
      fieldsAtTheirHeights(binding, model, setup, sets, run.name);
      const jobs = manifest.jobs.filter((job) => job.run === run.name);
      assert.deepEqual(
        jobs.map((job) => [job.rung, job.quantity, job.engine, job.status, job.requestId]),
        sets.map((spec) => [
          "r2",
          RAYS_TRACE,
          "lv",
          "ok",
          makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }).id,
        ]),
        run.name,
      );

      for (const [index, spec] of sets.entries()) {
        const field = fields[index];
        assert.ok(!("problem" in field), run.name);
        assert.deepEqual(spec.groups?.field, { angleDeg: field.angleDeg, heightFraction: [0, 0.5, 1][index] });
        const at = `${run.name} field ${[0, 0.5, 1][index]}`;
        const found = store.get(jobs[index].storeKey ?? "");
        assert.equal(found.kind, "hit", at);
        if (found.kind !== "hit") continue;
        // The set is a spec by the contract's rules, and its rays start in front of the first surface.
        assert.deepEqual(raysTraceQuantity.validateSpec(spec), [], at);
        assert.ok(startsInFront(opticalCase.system.surfaces[0], f8(spec.origins)), at);
        // A valid payload: the quantity's schema, its invariants, and arrays that decode.
        assert.deepEqual(found.entry.request.spec, spec, at);
        assert.deepEqual(resultDataProblems(raysTraceQuantity, found.entry.result.data), [], at);
        const data = found.entry.result.data as RaysTraceData;
        const check = fieldCheck(binding, model, field.angleDeg, 0);
        const held = heldToLensVisualizer(binding, model, spec, data, check, at);
        totals.worstOffSurface = Math.max(totals.worstOffSurface, heldToTheCase(opticalCase, spec, data, at));
        const counts = found.entry.result.diagnostics.counts;
        assert.equal(counts.ok + counts.blocked + counts.failed, counts.rays, at);
        totals.rays += counts.rays;
        totals.ok += counts.ok;
        totals.exact += held.exact;
        totals.mirrored += held.mirrored;
        totals.worstMirrored = Math.max(totals.worstMirrored, held.worstMirrored);
        stretch.landed += held.landed;
        stretch.notTheParameter += held.notTheParameter;
      }
    }
    assert.equal(configurations.size, 12);
    for (const key of BENCHMARK_KEYS)
      assert.ok(
        [...configurations].some((each) => each.startsWith(`${key}@`)),
        key,
      );

    t.diagnostic(
      `benchmark at the reference line: ${totals.rays} rays in 36 sets, ${totals.ok} ok; ${totals.exact} held to ` +
        `LensVisualizer's own traced rays bit for bit, ${totals.mirrored} to its mirrored ones within ` +
        `${totals.worstMirrored} mm; the worst hit lies ${totals.worstOffSurface} mm off its surface`,
    );
    // The path to the image is charged by the length of the last stretch, which is the line's parameter only where
    // LensVisualizer's direction is a unit vector to the bit: for the others the path is its neighbour.
    t.diagnostic(
      `of ${stretch.landed} rays that land, ${stretch.notTheParameter} have a path to the image that is not the ` +
        "index times the parameter of the line, by the length of LensVisualizer's direction",
    );
    // At d36f44b3: 39 302 rays, of which 22 918 are ok (36 of them chief rays); 11 441 are held to the rays
    // LensVisualizer traced, bit for bit, and 11 441 to the ones it mirrored, within 3.5e-13 mm. No ray failed. By
    // the reference engine's sag the worst hit is 1.0e-9 mm off its surface: LensVisualizer's own tolerance.
    assert.ok(totals.rays > 30_000, String(totals.rays));
    assert.ok(totals.exact > 10_000 && totals.mirrored > 10_000, JSON.stringify(totals));
    assert.ok(totals.worstMirrored < 1e-11, String(totals.worstMirrored));
  },
);

test(
  "the photopic lines of a benchmark lens trace the rays of its reference line, with each line's own indices",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    const { opticalCase, model } = await modelOf(binding, "nikkor-z50f12", { lines: { kind: "photopic" } });
    const { sets, problems } = lvRaySets(binding.api, model, {
      fields: { kind: "image-height-fractions", values: [0.5] },
    });
    assert.deepEqual(problems, []);
    assert.deepEqual(
      sets.map((spec) => spec.line),
      [0, 1, 2, 3, 4],
    );
    // One field, one footprint, found at 555 nm: the five sets differ in nothing but the line.
    for (const spec of sets) assert.deepEqual({ ...spec, line: 0 }, sets[0]);
    const setup = lvLaunchSetup(binding.api, model);
    assert.ok(!("problem" in setup));
    assert.equal(setup.support.spectralLines[0].wavelengthNm, 555);
    const landings: number[] = [];
    for (const spec of sets) {
      const result = await lv.run(makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }), opticalCase);
      assert.equal(result.status, "ok", JSON.stringify(result.error));
      const data = result.data as RaysTraceData;
      const angleDeg = spec.groups?.field?.angleDeg as number;
      const at = `nikkor-z50f12 photopic line ${spec.line}`;
      heldToLensVisualizer(binding, model, spec, data, fieldCheck(binding, model, angleDeg, spec.line), at);
      heldToTheCase(opticalCase, spec, data, at);
      landings.push(f8(data.imagePoint)[3 * (spec.groups?.chiefIndex as number) + 1]);
    }
    // Lateral colour: the chief ray lands at another height at every line.
    assert.equal(new Set(landings).size, 5, JSON.stringify(landings));
  },
);

test(
  "stopped down, the iris stops the rays at the stop radius of the case, as in LensVisualizer's own bundle",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const { api } = binding;
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    const key = "nikkor-z50f12";
    const fNumber = 8;
    const { opticalCase, model } = await modelOf(binding, key, { aperture: { kind: "f-number", value: fNumber } });
    // The state keeps the wide-open radius on its stop surface; only the case says how far the iris is closed.
    const stopIndex = opticalCase.system.stopIndex;
    const wideOpen = api.wideOpenStopAtZoom(0, model.runtime);
    const stop = opticalCase.conditions.stopSemiDiameter;
    assert.equal(model.state.surfaces[stopIndex].sd, wideOpen);
    assert.ok(stop < 0.2 * wideOpen, `${stop} of ${wideOpen}`);
    const setup = lvLaunchSetup(api, model);
    assert.ok(!("problem" in setup));
    assert.equal(setup.options.stopSemiDiameterMm, stop);
    // The seed of the footprint is the number the hook of LensVisualizer's MTF tab hands over at this f-number, to
    // the bit: the entrance pupil of the wide-open stop, times the wide-open f-number, over this one.
    const tabSeed =
      (api.entrancePupilAtState2(wideOpen, 0, 0, model.runtime).epSD * api.fopenAtZoom2(0, model.runtime)) / fNumber;
    assert.equal(setup.options.pupilSemiDiameterMm, tabSeed);

    const { sets, problems } = lvRaySets(api, model, {});
    assert.deepEqual(problems, []);
    assert.equal(sets.length, 3);
    fieldsAtTheirHeights(binding, model, setup, sets, key);
    let [stoppedByIris, ok] = [0, 0];
    for (const spec of sets) {
      const angleDeg = spec.groups?.field?.angleDeg as number;
      const at = `${key} at f/${fNumber}, field at ${angleDeg} degrees`;
      const result = await lv.run(makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }), opticalCase);
      assert.equal(result.status, "ok", JSON.stringify(result.error));
      assert.deepEqual(resultDataProblems(raysTraceQuantity, result.data), [], at);
      const data = result.data as RaysTraceData;
      heldToLensVisualizer(binding, model, spec, data, fieldCheck(binding, model, angleDeg, 0), at);
      heldToTheCase(opticalCase, spec, data, at);
      // A ray the iris stops had passed the same surface of the open lens: LensVisualizer's hit on the stop
      // surface lies within the radius the state keeps for it, and outside the stop radius of the case.
      const endSurface = decodeNdArray(data.endSurface).values;
      for (let ray = 0; ray < endSurface.length; ray++) {
        if (endSurface[ray] === -1) ok++;
        if (endSurface[ray] !== stopIndex) continue;
        const [x, y] = traced(binding, model, spec, ray).hits[stopIndex].point;
        const radius = Math.hypot(x, y);
        assert.ok(radius > stop && radius < wideOpen, `${at} ray ${ray}: ${radius}`);
        stoppedByIris++;
      }
    }
    // At d36f44b3, in the three sets: 2455 rays ok and 1436 stopped by the iris.
    t.diagnostic(`${key} at f/${fNumber}: ${ok} rays ok, ${stoppedByIris} stopped by the iris`);
    assert.ok(ok > 500 && stoppedByIris > 500, `${ok} ok, ${stoppedByIris} stopped by the iris`);
  },
);

// ── A finite conjugate, and a glass that absorbs ─────────────────────────────────────────────────────────────────

test(
  "at a certified focus station the rays come from LensVisualizer's object point, with its weights",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    // The closest station of a benchmark lens: 1:1, the object 150 mm in front of the image plane.
    const key = "sigma-105mm-f28-dg-dn-macro-art";
    const stations = (await binding.lens(key)).data.finiteConjugates as { focusT: number; zoomT: number }[];
    const station = stations.find((candidate) => candidate.focusT === 1);
    assert.ok(station !== undefined, JSON.stringify(stations));
    const state = { zoomT: station.zoomT, focus: { kind: "focusT", value: station.focusT } } as const;
    const { opticalCase, model } = await modelOf(binding, key, { state });
    assert.equal(opticalCase.conditions.object.kind, "finite");
    const { sets, problems } = lvRaySets(binding.api, model, {});
    assert.deepEqual(problems, []);
    assert.equal(sets.length, 3);

    const setup = lvLaunchSetup(binding.api, model);
    assert.ok(!("problem" in setup));
    assert.ok(setup.support.conjugate !== undefined);
    // The fractions are resolved on the chief ray aimed from the object point, not by the inversion for infinity,
    // which at this station would give angles half as large.
    fieldsAtTheirHeights(binding, model, setup, sets, key);
    const summary: string[] = [];
    for (const spec of sets) {
      assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
      const angleDeg = spec.groups?.field?.angleDeg as number;
      const check = fieldCheck(binding, model, angleDeg, 0);
      const source = check.rays.launch.objectPoint;
      assert.ok(source !== undefined);
      assert.equal(source[2], opticalCase.conditions.object.kind === "finite" ? opticalCase.conditions.object.z : NaN);
      // Every ray is aimed from the one object point of the field, and starts between it and the lens.
      const [origins, directions, weights] = [f8(spec.origins), f8(spec.directions), f8(spec.weights)];
      const chief = spec.groups?.chiefIndex as number;
      for (let ray = 0; ray < weights.length; ray++) {
        const offset = [0, 1, 2].map((axis) => origins[3 * ray + axis] - source[axis]);
        const length = Math.hypot(...offset);
        offset.forEach((component, axis) => {
          assert.ok(Math.abs(component / length - directions[3 * ray + axis]) < 1e-15, `ray ${ray}`);
        });
        assert.ok(origins[3 * ray + 2] > source[2] && origins[3 * ray + 2] < 0, `ray ${ray}`);
      }
      // The weights are solid angles relative to the chief ray's: about 1, on both sides of it, and the chief's 0.
      assert.equal(weights[chief], 0);
      const cells = [...weights.subarray(0, chief)];
      assert.ok(Math.min(...cells) > 0.9 && Math.min(...cells) < 1 && Math.max(...cells) <= 1.2, angleDeg.toString());
      assert.ok(new Set(cells).size > 100, "the weights differ from cell to cell");

      const result = await lv.run(makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }), opticalCase);
      assert.equal(result.status, "ok", JSON.stringify(result.error));
      assert.deepEqual(resultDataProblems(raysTraceQuantity, result.data), []);
      const at = `${key} at focus ${station.focusT}, field at ${angleDeg} degrees`;
      const held = heldToLensVisualizer(binding, model, spec, result.data as RaysTraceData, check, at);
      heldToTheCase(opticalCase, spec, result.data as RaysTraceData, at);
      summary.push(`${weights.length} rays (${held.exact} + ${held.mirrored} ok, weights from ${Math.min(...cells)})`);
    }
    // At d36f44b3: 2305, 1801 and 1921 rays; the weights go down to 0.958, 0.925 and 0.935.
    t.diagnostic(`${key} at focus ${station.focusT}: ${summary.join("; ")}`);
  },
);

test(
  "the one lens whose glass absorbs: a ray's weight carries LensVisualizer's bulk transmission at that line",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const absorbing: string[] = [];
    for (const { key } of (await binding.catalog()).entries) {
      const runtime = binding.api.buildLens((await binding.lens(key)).data);
      if (runtime.elements.some((element) => (element.absorptionCoefficientPerMm ?? 0) > 0)) absorbing.push(key);
    }
    // At d36f44b3 the catalog has one such lens, an apodisation element.
    assert.deepEqual(absorbing, ["minolta-stf-135f28-t45"]);
    const { opticalCase, model } = await modelOf(binding, absorbing[0]);
    assert.deepEqual(opticalCase.provenance.notes, ["bulk-absorption"]);
    const { sets, problems } = lvRaySets(binding.api, model, {
      fields: { kind: "image-height-fractions", values: [0] },
    });
    assert.deepEqual(problems, []);
    const [spec] = sets;
    const check = fieldCheck(binding, model, 0, 0);
    const weights = f8(spec.weights);
    const { columns } = check.rays.grid;
    let [least, most] = [1, 0];
    for (const own of check.bundle.rays) {
      const weight = weights[own.row * columns + own.column];
      if (own.column >= columns / 2) assert.ok(sameBits(weight, own.weight), `cell ${own.row}, ${own.column}`);
      else assert.ok(Math.abs(weight - own.weight) < 1e-12, `cell ${own.row}, ${own.column}`);
      [least, most] = [Math.min(least, weight), Math.max(most, weight)];
    }
    // The element is clear at its centre and dark toward its rim: at d36f44b3 the transmitted rays weigh from 0.84
    // down to 0.044.
    t.diagnostic(`${absorbing[0]}: weights of the transmitted rays from ${least} to ${most}`);
    assert.ok(most < 1 && most > 0.5 && least > 0 && least < 0.5 * most, `${least} to ${most}`);
    // A ray that is stopped keeps its launch weight, which nothing reads: the first cell is a corner of the lattice.
    const corner = traced(binding, model, spec, 0);
    const stop = opticalCase.conditions.stopSemiDiameter;
    assert.equal(binding.api.mtfTraceClassification(corner, model.state, stop), "blocked");
    assert.equal(weights[0], 1);
  },
);

// ── Fields that have no rays ─────────────────────────────────────────────────────────────────────────────────────

test(
  "a field LensVisualizer cannot place is a coded problem of that field, and the other fields are traced",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const { model } = await modelOf(binding, "nikkor-z50f12");
    // 80 degrees is far beyond the lens's field: LensVisualizer finds no chief ray, or no ray that gets through.
    const beyond = lvRaySets(binding.api, model, { fields: { kind: "angles-deg", values: [0, 80, 5] } });
    assert.equal(beyond.sets.length, 2);
    assert.deepEqual(
      beyond.sets.map((spec) => spec.groups?.field),
      [{ angleDeg: 0 }, { angleDeg: 5 }],
    );
    assert.equal(beyond.problems.length, 1);
    assert.match(beyond.problems[0], /^(chief-ray-failed|vignetted): .* 80 degrees/);

    // A lens whose modeled field ends short of its format corner: the full image height is outside the model.
    const short: string[] = [];
    const outside = /^outside-modeled-field: the image height [0-9.]+ mm \(fraction 1\) lies beyond the modeled edge/;
    for (const { key } of (await binding.catalog()).entries.slice(0, 120)) {
      const exported = await createLvExporter(binding).exportLens(key, {});
      if (!exported.ok) continue;
      const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
      assert.ok(rebuilt.ok);
      const setup = lvLaunchSetup(binding.api, rebuilt.model);
      if ("problem" in setup) continue;
      const fields = lvFieldAngles(binding.api, rebuilt.model, setup, DEFAULT_RAY_FIELDS);
      if (!("problem" in fields[2])) continue;
      if (outside.test(fields[2].problem)) short.push(key);
      if (short.length === 1) {
        const { sets, problems } = lvRaySets(binding.api, rebuilt.model, {});
        assert.deepEqual(problems, [fields[2].problem]);
        assert.equal(sets.length, 2, key);
      }
    }
    t.diagnostic(`of the first 120 lenses, ${short.length} end short of their format corner (first: ${short[0]})`);
    assert.ok(short.length > 0, "no lens with a field outside the model was found");
  },
);

// ── Two processes ────────────────────────────────────────────────────────────────────────────────────────────────

test(
  "two processes generate the same rays and trace them to the same bytes: request ids, store keys and results",
  { skip },
  (t) => {
    const directory = tempDir(t);
    const outputs = ["first", "second"].map((name) => {
      const runsDir = join(directory, name);
      const ran = lvrtc(runsDir, "run", suitePath("smoke"), "--engines", "lv", "--rungs", "r2");
      assert.equal(ran.code, 0, ran.err);
      assert.match(ran.out, /^smoke: 27 jobs: 27 ok, 0 unsupported, 0 error, 0 pending \(27 computed, 0 cached\)$/m);
      const manifestText = readFileSync(join(runsDir, "smoke", MANIFEST_FILE), "utf8");
      const manifest: RunManifest = JSON.parse(manifestText);
      const entries = manifest.jobs.map((job) => readFileSync(join(runsDir, STORE_DIRECTORY, `${job.storeKey}.json`)));
      return { manifestText, manifest, entries };
    });
    const [first, second] = outputs;
    // 3 fields of a lens on its reference line, 3 fields at each of 5 photopic lines, 3 fields of another lens,
    // and 3 fields at each end of a zoom.
    assert.equal(first.manifest.jobs.length, 27);
    assert.equal(new Set(first.manifest.jobs.map((job) => job.requestId)).size, 27);
    assert.equal(first.manifestText, second.manifestText);
    first.entries.forEach((entry, index) => assert.ok(entry.equals(second.entries[index]), `store entry ${index}`));
    // Nothing of this machine is in the manifest, and the rays are in the store, not in the manifest.
    for (const absent of [directory, REPO_ROOT, LV_PATH ?? "?"]) assert.ok(!first.manifestText.includes(absent));
    assert.ok(first.manifestText.length < 40_000, String(first.manifestText.length));
    for (const run of first.manifest.runs) {
      assert.equal(run.raySets?.problems.length, 0, run.name);
      assert.ok(
        run.raySets?.sets.every((id) => /^[0-9a-f]{64}$/.test(id)),
        run.name,
      );
    }
  },
);
