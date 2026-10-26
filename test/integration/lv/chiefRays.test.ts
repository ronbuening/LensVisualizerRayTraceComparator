// The chief sets against the real LensVisualizer: the chief rays its distortion tab (the curve and the traced field
// grid), its pupils tab and the lateral-colour section of its chromatic tab launch, as the case source restates them
// (src/engines/lv/chiefRaySets.ts). Each ray of a set is traced by LensVisualizer's exact tracer (`traceEngineRay`,
// with each tab's trace options: ghost hits, the stop radius where the tab hands one, a channel's indices for the
// lateral colour), read as its runtime result reads it (the height carried to the vertex plane of the surface it ended
// on, the slopes), and carried to the image plane as each tab carries it. On every benchmark configuration and the
// zoom's far end that gives, to the bit:
//
// - the distortion curve: the probe's height, which scales the reference; the edge chief ray's height, whose
//   magnitude scales the target heights; every sample's ideal height and percent distortion, from its target height
//   and its angle; and every sample's chief ray lands within LensVisualizer's own 1e-4 mm of its target;
// - the distortion grid: every traced point, both coordinates;
// - the pupils tab: every field's real exit pupil, and its entrance-pupil correction from the solved launch;
// - the lateral-colour section: every field's chief-ray landing at every channel, and the spread.
//
// It also holds that the curve plots its target heights, not its chief rays' landings (the LensVisualizer
// assumption docs/gotchas.md names), and that `lv`'s `rays.trace` answer of a set brings the same rays to the image as
// the tabs' traces do. What is not tested is that the tabs' React code hands these functions exactly this request:
// that rests on the canaries of the drawer's lines. Nothing is written. Measured at LV d6df08c7f and cfa91d0a5 (engine
// closure c866fbff with the stage's names).
import assert from "node:assert/strict";
import { test } from "node:test";

import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefRaySets } from "../../../src/engines/lv/chiefRaySets.ts";
import { lvChiefGeometry, lvChiefRequest, lvDistortionReference } from "../../../src/engines/lv/chiefSetup.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

/** The benchmark's lenses as they open, and the far end of its zoom. */
const CONFIGURATIONS: readonly { readonly key: string; readonly options: RunOptions }[] = [
  ...BENCHMARK_KEYS.map((key) => ({ key, options: {} })),
  { key: "nikon-z-24-70f4s", options: { state: { zoomT: 1 } } },
];

async function modelOf(binding: LvBinding, key: string, options: RunOptions): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, `${key}: ${JSON.stringify(exported)}`);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, key);
  return rebuilt.model;
}

function f8(set: RaysTraceSpec, name: "origins" | "directions"): Float64Array {
  return decodeNdArray(set[name]).values as Float64Array;
}

/** What LensVisualizer's runtime result of a trace holds: where it crosses the last vertex plane, its slopes. */
interface TabRay {
  readonly x: number;
  readonly y: number;
  readonly ux: number;
  readonly uy: number;
  readonly clipped: boolean;
}

/**
 * A ray of a set as a tab traces and reads it. The options are the adapters' (`traceOptions` in rayAdapters.ts):
 * clear apertures checked, the stop radius the tab hands (none for the distortion curve and the pupils tab), ghost
 * hits, stop on a clip, a unit direction, and for a channel its index and its wavelength. The heights are carried to
 * the vertex plane of the surface it ended on and the slopes taken as `finalizeTraceResult` takes them.
 */
function tabRay(
  binding: LvBinding,
  model: LvCaseModel,
  set: RaysTraceSpec,
  ray: number,
  stopSD: number | undefined,
  channel?: string,
): TabRay {
  const { api } = binding;
  const { state } = model;
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const dispersion = state.lens.dispersion ?? [];
  const trace = api.traceEngineRay(
    state,
    {
      origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
      direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
    },
    {
      checkSemiDiameter: true,
      stopSemiDiameter: stopSD,
      ghost: true,
      stopOnClip: true,
      directionNormalized: true,
      ...(channel === undefined
        ? {}
        : {
            indexAtSurface: (at: number, nd: number) => dispersion[at]?.indexAt(channel) ?? nd,
            wavelengthNm: api.chromaticChannelWavelengthsNm[channel],
          }),
    },
  );
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const returnZ = trace.reachedImagePlane ? point[2] : state.z[Math.max(0, trace.terminalSurfaceIndex)];
  const carried = (at: 0 | 1) =>
    trace.reachedImagePlane ? point[at] : api.projectCoordinateToZ(point[at], point[2], toward[at], toward[2], returnZ);
  // directionSlopes: `const invDz = Math.abs(direction[2]) > 1e-12 ? 1 / direction[2] : Infinity;`
  const invDz = Math.abs(toward[2]) > 1e-12 ? 1 / toward[2] : Infinity;
  return { x: carried(0), y: carried(1), ux: toward[0] * invDz, uy: toward[1] * invDz, clipped: trace.status !== "ok" };
}

test(
  "the chief sets of the benchmark lenses, traced as the three tabs trace them, are their figures to the bit",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let rays = 0;
    let worstResidual = 0;
    let residualsAboveZero = 0;
    for (const { key, options } of CONFIGURATIONS) {
      const model = await modelOf(binding, key, options);
      const where = `${key} ${JSON.stringify(options)}`;
      const { state, runtime, exported } = model;
      assert.equal(exported.conditions.lines.length, 1);
      const made = lvChiefRaySets(api, model);
      assert.deepEqual(made.problems, [], where);
      assert.equal(made.sets.length, 4, where);
      const [curveSet, gridSet, pupilSet, lateralSet] = made.sets;
      const request = lvChiefRequest(api, model);
      const geometry = lvChiefGeometry(api, model);
      assert.ok(geometry !== null, where);
      const reference = lvDistortionReference(api, model, geometry);
      assert.ok(reference !== null, where);
      const last = state.surfaces.length - 1;
      const lastSurfZ = state.z[last];
      const transfer = state.surfaces[last].d;
      const zPos = [...state.z];

      // The distortion curve. The probe, traced, is the height that scales the reference; the edge's magnitude scales
      // the targets; each sample's chief ray lands near its target, and the curve plots the target.
      const curve = api.computeDistortionCurve(request);
      const landing = (set: RaysTraceSpec, ray: number) => {
        const traced = tabRay(binding, model, set, ray, undefined);
        return traced.y + traced.uy * transfer;
      };
      assert.ok(Object.is(landing(curveSet, 0), reference.probeImageHeight), `${where}: probe`);
      const edge = landing(curveSet, 1);
      const accurate = (angle: number) =>
        api.chiefRayImageHeightAccurateForRuntimeLens(angle, zPos, state.focusT, state.zoomT, runtime, geometry, 0);
      assert.ok(Object.is(edge, accurate(geometry.halfFieldDeg)), `${where}: edge`);
      assert.equal(made.asks[0].kind, "distortion");
      assert.deepEqual(
        made.asks[0].fieldAnglesDeg,
        curve.samples.slice(1).map((sample) => sample.fieldAngleDeg),
      );
      curve.samples.slice(1).forEach((sample, at) => {
        const traced = landing(curveSet, 2 + at);
        assert.ok(Object.is(traced, accurate(sample.fieldAngleDeg)), `${where}: sample ${at + 1}`);
        // computeDistortionCurve: `-edgeAbsHeight * uniformFieldFraction(index + 1, sampleCount)` is plotted.
        const target = -Math.abs(edge) * sample.normalizedImageHeight;
        assert.ok(Object.is(sample.realHeight, target), `${where}: sample ${at + 1} plots its target`);
        const residual = Math.abs(traced - target);
        assert.ok(residual < 1e-4, `${where}: sample ${at + 1} lands ${residual} mm from its target`);
        worstResidual = Math.max(worstResidual, residual);
        if (residual > 0) residualsAboveZero++;
        // projectionImageHeightForAngle, rectilinear: `reference.focalScaleMm * Math.tan(fieldAngleRad)`.
        const thetaRad = (sample.fieldAngleDeg * Math.PI) / 180;
        const idealHeight = -(reference.projectionReference.focalScaleMm * Math.tan(thetaRad));
        assert.ok(Object.is(sample.idealHeight, idealHeight), `${where}: sample ${at + 1} ideal`);
        const percent = (100 * (target - idealHeight)) / idealHeight;
        assert.ok(Object.is(sample.distortionPercent, percent), `${where}: sample ${at + 1} percent`);
      });
      rays += 2 + curve.samples.length - 1;

      // The distortion grid: every point it traces, in its order, after the probe.
      const grid = api.computeDistortionFieldGrid(request);
      const stopSD = exported.conditions.stopSemiDiameter;
      let gridRay = 1;
      for (const line of grid.lines) {
        for (const point of line.points) {
          if (!point.insideImageCircle) continue;
          const traced = tabRay(binding, model, gridSet, gridRay, stopSD);
          const imagePoint = api.skewImagePlaneIntercept(
            traced.x,
            traced.y,
            traced.ux,
            traced.uy,
            lastSurfZ,
            lastSurfZ + transfer,
          );
          const tracedX = traced.clipped ? null : (imagePoint?.x ?? null);
          const tracedY = traced.clipped ? null : imagePoint ? -imagePoint.y : null;
          assert.ok(
            Object.is(point.tracedX, tracedX) && Object.is(point.tracedY, tracedY),
            `${where}: grid ${gridRay}`,
          );
          gridRay++;
        }
      }
      assert.equal(gridRay, f8(gridSet, "origins").length / 3, `${where}: every grid ray is a traced point`);
      rays += gridRay;

      // The pupils tab: the real exit pupil of every field off the axis, and the entrance pupil's correction.
      const pupils = api.computeBothPupilAberrationProfiles(request);
      const fields = pupils.xp.samples.filter((sample) => Math.abs(sample.fieldDeg) > 1e-9);
      assert.equal(f8(pupilSet, "origins").length / 3, fields.length, where);
      fields.forEach((sample, ray) => {
        const traced = tabRay(binding, model, pupilSet, ray, undefined);
        // `xpZRelLastSurf = -result.y / result.u`, where the slope is above 1e-9.
        const xp = Math.abs(traced.uy) > 1e-9 ? -traced.y / traced.uy : pupils.xp.paraxialXpZRelLastSurf;
        assert.ok(Object.is(sample.xpZRelLastSurf, xp), `${where}: exit pupil of field ${ray + 1}`);
        const solve = api.solveChiefRayForRuntimeLens(sample.fieldDeg, state.focusT, state.zoomT, runtime, geometry, 0);
        const paraxial = -geometry.epRatio * api.projectionLaunchSlopeForField(runtime, sample.fieldDeg).uField;
        const ep = pupils.ep.samples.find((each) => each.fieldDeg === sample.fieldDeg);
        assert.ok(ep !== undefined && Object.is(ep.chiefRayCorrection, solve.yLaunch / paraxial), `${where}: EP`);
      });
      rays += fields.length;

      // The lateral-colour section: every field's chief ray at every channel.
      const lateral = api.computeLateralColorCurve(request);
      assert.ok(lateral !== null, where);
      lateral.fields.forEach((field, ray) => {
        const heights: number[] = [];
        for (const sample of field.samples) {
          const traced = tabRay(binding, model, lateralSet, ray, stopSD, sample.channel);
          const off = api.computeOffAxisFieldGeometry(state, field.fieldFraction, geometry);
          assert.ok(off !== null && off.kind !== "vector", where);
          const image = traced.clipped
            ? null
            : api.skewImagePlaneIntercept(traced.x, traced.y, traced.ux, traced.uy, off.lastSurfZ, off.imagePlaneZ);
          assert.ok(Object.is(sample.imageHeightMm, image?.y ?? null), `${where}: field ${ray} ${sample.channel}`);
          if (image !== null) heights.push(image.y);
        }
        const spread = heights.length < 2 ? null : Math.max(...heights) - Math.min(...heights);
        assert.ok(Object.is(field.lateralSpreadMm, spread), `${where}: field ${ray} spread`);
      });
      rays += lateral.fields.length;

      // The engine's own trace of a set, at the case's stop radius, is LensVisualizer's: the same chief rays arrive.
      for (const set of [curveSet, gridSet, pupilSet, lateralSet]) {
        const answer = answerLvRays(api, model, set);
        assert.ok("data" in answer, where);
        const status = decodeNdArray(answer.data.status).values;
        for (let ray = 0; ray < f8(set, "origins").length / 3; ray++) {
          assert.equal(status[ray] === 0, !tabRay(binding, model, set, ray, stopSD).clipped, `${where} ${ray}`);
        }
      }
    }
    // The curve plots its targets: its chief rays land on them only to LensVisualizer's 1e-4 mm.
    assert.ok(residualsAboveZero > 0 && worstResidual < 1e-4);
    t.diagnostic(`${rays} rays; the curve's samples land up to ${worstResidual} mm from the targets it plots`);
  },
);
