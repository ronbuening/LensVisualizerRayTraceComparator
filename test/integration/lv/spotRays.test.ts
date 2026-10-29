// The spot sets against the real LensVisualizer: the rays its coma and bokeh tabs launch, as the case source
// restates them (src/engines/lv/spotRaySets.ts): since LV #927 the shared aimed launch's rays, each through its point of
// the real stop. Each ray of a set is traced as the tabs trace it (`prepareAimedPupilTrace`: every aperture checked, the
// stop at the launch's clip radius) and carried to the plane as its tabs carry a skew ray; the figures, summed in
// LensVisualizer's order over the samples it aimed, are then the tabs' own to the bit: the point cloud's centroid and RMS
// radius, every sample of the two fans, and every bokeh tile's centroid and RMS radius. A bokeh tile is also held ray by
// ray to LensVisualizer's own launch of its samples (`prepareAimedPupilLaunch`): each set ray is the launch's, and the
// tile's offsets from the comparator's chief ray (`lvBokehChiefLanding`) and weights are of it, the latter on a lens
// whose glass absorbs, where the weight is not the area alone. `lv`'s answers of all four asks are the tabs' output.
// Nothing is written. Measured at LV 879c06102 (engine code unchanged to db72a7761), and at 607ff23ae (closure
// f016b35b), whose tabs aim their samples at the real stop.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvSpot, lvBokehChiefLanding } from "../../../src/engines/lv/spot.ts";
import { lvSpotRaySets, lvSpotSetup } from "../../../src/engines/lv/spotRaySets.ts";
import type { LvAnalysisRequest, LvBokehField, LvVec3 } from "../../../src/engines/lv/types.ts";
import { spotNativeQuantity } from "../../../src/quantities/spotNative.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

async function modelOf(binding: LvBinding, key: string, options: RunOptions = {}) {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, `${key}: ${JSON.stringify(exported)}`);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, key);
  return { opticalCase: exported.opticalCase as OpticalCase, model: rebuilt.model };
}

function f8(set: RaysTraceSpec, name: "origins" | "directions" | "weights"): Float64Array {
  return decodeNdArray(set[name]).values as Float64Array;
}

function vec(values: Float64Array, ray: number): LvVec3 {
  return [values[3 * ray], values[3 * ray + 1], values[3 * ray + 2]];
}

/**
 * Where LensVisualizer's tabs land a ray of a set: traced as the tabs trace an aimed launch's rays
 * (`prepareAimedPupilTrace(...).skew`: clear apertures, the stop at the launch's clip radius, stop on a clip, the
 * authored indices, a unit direction; its end on the last vertex plane and its slopes), then on to the plane by
 * `skewImagePlaneIntercept`. Null for a ray that clipped.
 */
function landing(
  binding: LvBinding,
  model: LvCaseModel,
  set: RaysTraceSpec,
  ray: number,
  lastSurfZ: number,
  planeZ: number,
): { x: number; y: number } | null {
  const { api } = binding;
  const tracer = api.prepareAimedPupilTrace(model.state, clipOf(binding, model));
  const trace = tracer.skew({ origin: vec(f8(set, "origins"), ray), direction: vec(f8(set, "directions"), ray) });
  if (trace.clipped) return null;
  return api.skewImagePlaneIntercept(trace.x, trace.y, trace.ux, trace.uy, lastSurfZ, planeZ);
}

/** The clip radius of the tabs' launch of the case: its stop radius and the aim's tolerance, as LV states it. */
function clipOf(binding: LvBinding, model: LvCaseModel): { readonly clipSemiDiameterMm: number } {
  const launch = binding.api.prepareAimedPupilLaunch(tabRequest(binding, model), [], { uField: 0, yChief: 0 });
  assert.ok(launch !== null);
  return { clipSemiDiameterMm: launch.clipSemiDiameterMm };
}

/** The analysis request of the drawer for a case, as the engine makes it. */
function tabRequest(binding: LvBinding, model: LvCaseModel, sampling: object = {}): LvAnalysisRequest {
  const setup = lvSpotSetup(binding.api, model);
  return binding.api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: setup.pupilSemiDiameterMm,
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: setup.fieldGeometry,
    sampling,
  });
}

test(
  "the spot sets of the benchmark lenses, traced as the tabs trace them, are the tabs' numbers to the bit",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let points = 0;
    let tiles = 0;
    for (const key of BENCHMARK_KEYS) {
      const { model } = await modelOf(binding, key);
      const made = lvSpotRaySets(api, model);
      assert.deepEqual(made.problems, [], key);
      assert.equal(model.exported.conditions.lines.length, 1);
      for (const { spec } of made.asks) assert.deepEqual(spotNativeQuantity.validateSpec(spec), [], key);
      const coma = api.computeComaAnalysis(tabRequest(binding, model));
      const preview = coma.pointCloudPreview;
      assert.ok(preview !== null, key);
      const fields = preview.fields.length;
      const geometry = api.computeOffAxisFieldGeometry(model.state, 0, lvSpotSetup(api, model).fieldGeometry);
      assert.ok(geometry !== null && geometry.kind !== "vector");
      const [last, plane] = [geometry.lastSurfZ, geometry.imagePlaneZ];
      assert.equal(plane, model.exported.conditions.imageZ, `${key}: the coma tab lands on the case's plane`);

      // The point cloud: LensVisualizer's sums, in its order, over the samples that landed (coma.ts).
      preview.fields.forEach((field, index) => {
        const set = made.sets[index];
        const weights = f8(set, "weights");
        const chief = landing(binding, model, set, weights.length - 1, last, plane);
        assert.ok(chief !== null, `${key} ${field.fieldFraction}`);
        const cloud: { t: number; s: number; w: number }[] = [];
        for (let ray = 0; ray < weights.length - 1; ray++) {
          // A sample of weight 0 is one LensVisualizer could not aim: it holds the chief ray, and is never traced.
          if (!(weights[ray] > 0)) continue;
          const point = landing(binding, model, set, ray, last, plane);
          if (point !== null) cloud.push({ t: point.y - chief.y, s: point.x - chief.x, w: weights[ray] });
        }
        const total = cloud.reduce((sum, point) => sum + point.w, 0);
        const ct = cloud.reduce((sum, point) => sum + point.t * point.w, 0) / total;
        const cs = cloud.reduce((sum, point) => sum + point.s * point.w, 0) / total;
        const rms = Math.sqrt(
          cloud.reduce((sum, point) => {
            const dx = point.t - ct;
            const dy = point.s - cs;
            return sum + point.w * (dx * dx + dy * dy);
          }, 0) / total,
        );
        const where = `${key} cloud ${field.fieldFraction}`;
        assert.equal(field.validSampleCount, cloud.length, where);
        assert.ok(Object.is(field.chiefIntercept, chief.y), where);
        assert.ok(Object.is(field.centroidTangentialImageHeight, ct), where);
        assert.ok(Object.is(field.centroidSagittalImageHeight, cs), where);
        assert.ok(Object.is(field.rmsRadiusMm, rms), where);
        points += cloud.length;
      });

      // The two fans at the detail field: every sample's error relative to the chief ray, NaN where none landed.
      for (const [offset, fan, axis] of [
        [fields, coma.meridionalComa, "y"],
        [fields + 1, coma.sagittalComa, "x"],
      ] as const) {
        assert.ok(fan !== null, key);
        const set = made.sets[offset];
        const weights = f8(set, "weights");
        const chief = landing(binding, model, set, weights.length - 1, last, plane);
        assert.ok(chief !== null);
        assert.equal(fan.samples.length, weights.length - 1);
        fan.samples.forEach((sample, ray) => {
          const point = weights[ray] > 0 ? landing(binding, model, set, ray, last, plane) : null;
          const relative = axis === "y" ? sample.relativeImageHeight : sample.relativeImageX;
          const expected = point === null ? null : point[axis] - chief[axis];
          assert.ok(Object.is(relative, expected), `${key} ${axis} fan sample ${ray}: ${relative} ${expected}`);
        });
      }

      // Every bokeh tile on the plane of the case, which is the design plane here: LensVisualizer's sums over the
      // rays that landed, with the set's weights.
      const request = tabRequest(binding, model);
      api.bokehFieldFractions.forEach((fraction, index) => {
        const tile = api.computeBokehFieldFootprint(request, fraction, plane);
        assert.ok(tile !== null && tile.usable, `${key} tile ${fraction}`);
        const set = made.sets[fields + 2 + index];
        const weights = f8(set, "weights");
        const chief = landing(binding, model, set, weights.length - 1, last, plane);
        assert.ok(chief !== null);
        const passed: { s: number; t: number; w: number }[] = [];
        for (let ray = 0; ray < weights.length - 1; ray++) {
          if (!(weights[ray] > 0)) continue;
          const point = landing(binding, model, set, ray, last, plane);
          if (point !== null) passed.push({ s: point.x - chief.x, t: point.y - chief.y, w: weights[ray] });
        }
        const total = passed.reduce((sum, point) => sum + point.w, 0);
        const cs = passed.reduce((sum, point) => sum + point.s * point.w, 0) / total;
        const ct = passed.reduce((sum, point) => sum + point.t * point.w, 0) / total;
        const rms = Math.sqrt(
          passed.reduce((sum, point) => {
            const dx = point.s - cs;
            const dy = point.t - ct;
            return sum + point.w * (dx * dx + dy * dy);
          }, 0) / total,
        );
        const where = `${key} tile ${fraction}`;
        assert.equal(tile.passedRays, passed.length, where);
        assert.ok(Object.is(tile.centroidSagittal, cs), `${where}: sagittal ${tile.centroidSagittal} ${cs}`);
        assert.ok(Object.is(tile.centroidTangential, ct), `${where}: tangential ${tile.centroidTangential} ${ct}`);
        assert.ok(Object.is(tile.rmsRadiusMm, rms), `${where}: radius ${tile.rmsRadiusMm} ${rms}`);
        tiles++;
      });

      // And the engine's answers of the four asks are the tabs' output, as the tabs present it.
      const [rings, tangential, sagittal, bokeh] = made.asks;
      const answerOf = (spec: (typeof made.asks)[number]["spec"]) => {
        const answer = answerLvSpot(api, model, spec);
        assert.ok("data" in answer, `${key}: ${JSON.stringify(answer)}`);
        return answer.data;
      };
      assert.deepEqual(
        answerOf(rings.spec).fields.map((field) => field.spot?.rmsRadiusMm),
        preview.fields.map((field) => (field.usable ? field.rmsRadiusMm : undefined)),
      );
      for (const [ask, fan, axis] of [
        [tangential, coma.meridionalComa, "y"],
        [sagittal, coma.sagittalComa, "x"],
      ] as const) {
        assert.ok(fan !== null);
        const [field] = answerOf(ask.spec).fields;
        assert.ok(field.fan !== null, key);
        const errors = Array.from(decodeNdArray(field.fan.errorMm).values as Float64Array);
        const expected = fan.samples.map((sample) => {
          const relative = axis === "y" ? sample.relativeImageHeight : sample.relativeImageX;
          return sample.clipped || relative === null || relative === undefined ? Number.NaN : relative;
        });
        assert.deepEqual(errors, expected, `${key} ${axis} fan`);
        assert.deepEqual(
          Array.from(decodeNdArray(field.fan.pupil).values as Float64Array),
          fan.samples.map((sample) => sample.pupilFraction),
        );
        assert.equal(field.imageHeightMm, Math.abs(coma.meridionalComa?.centerIntercept ?? Number.NaN));
      }
      const tilesAnswered = answerOf(bokeh.spec).fields;
      api.bokehFieldFractions.forEach((fraction, index) => {
        const tile = api.computeBokehFieldFootprint(request, fraction, plane);
        assert.ok(tile !== null);
        const field = tilesAnswered[index];
        assert.deepEqual(field.spot, {
          centroidMm: [tile.centroidSagittal, tile.centroidTangential],
          rmsRadiusMm: tile.rmsRadiusMm,
        });
        const chief = lvBokehChiefLanding(api, model, lvSpotSetup(api, model), fraction, plane);
        assert.ok(chief !== null);
        assert.equal(field.imageHeightMm, Math.hypot(chief.x, chief.y));
      });
    }
    assert.ok(points > 1000, `points of the clouds: ${points}`);
    assert.equal(tiles, BENCHMARK_KEYS.length * api.bokehFieldFractions.length);
  },
);

/** The members of a tile's points the comparator reads: LensVisualizer's BokehPoint, in the bundle's order. */
interface LvBokehPoint {
  readonly sagittalOffset: number;
  readonly tangentialOffset: number;
  readonly weight: number;
}

/** A lens whose glass absorbs (its apodization element): there a bokeh ray's weight is not its area alone. */
const ABSORBING = "laowa-105mm-f2-stf";

test(
  "a bokeh tile, ray by ray, is LensVisualizer's aimed launch of its samples, about the comparator's chief ray",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let absorbed = 0;
    let unaimed = 0;
    // The benchmark lenses on their design plane, the absorbing lens, and one lens on a plane 0.05 mm behind its
    // design plane, where the tile and its chief ray are intercepted off the plane the tab's bundle is traced to.
    const shifted: RunOptions = { imagePlane: { kind: "shift", mm: 0.05 } };
    const cases: [string, RunOptions][] = [
      ...BENCHMARK_KEYS.map((key): [string, RunOptions] => [key, {}]),
      [ABSORBING, {}],
      ["nikkor-z50f12", shifted],
    ];
    for (const [key, options] of cases) {
      const { model } = await modelOf(binding, key, options);
      const made = lvSpotRaySets(api, model);
      assert.deepEqual(made.problems, [], key);
      const setup = lvSpotSetup(api, model);
      const request = tabRequest(binding, model);
      const plane = model.exported.conditions.imageZ;
      const samples = api.sampleCircularPupil(api.bokehRingSamples);
      const first = made.sets.length - api.bokehFieldFractions.length;
      api.bokehFieldFractions.forEach((fraction, index) => {
        const where = `${key} tile ${fraction}`;
        const tile = api.computeBokehFieldFootprint(request, fraction, plane) as
          (LvBokehField & { readonly points: readonly LvBokehPoint[] }) | null;
        assert.ok(tile !== null && tile.usable, where);
        const geometry = api.computeOffAxisFieldGeometry(model.state, fraction, setup.fieldGeometry);
        assert.ok(geometry !== null && geometry.kind !== "vector", where);
        const chief = lvBokehChiefLanding(api, model, setup, fraction, plane);
        assert.ok(chief !== null, where);
        // Each sample as the tab's aimed launch returns it (offAxis.ts), traced as the tab traces it, kept where it is
        // aimed, not clipped, and lands on the design plane and on the tile's plane (bokeh.ts), with its offsets from
        // the chief ray and its weight.
        const set = made.sets[first + index];
        const [origins, directions, weights] = [f8(set, "origins"), f8(set, "directions"), f8(set, "weights")];
        const launch = api.prepareAimedPupilLaunch(request, samples, geometry);
        assert.ok(launch !== null, where);
        const tracer = api.prepareAimedPupilTrace(model.state, launch);
        const expected: (LvBokehPoint & { readonly ray: number })[] = [];
        samples.forEach((sample, ray) => {
          const aimed = launch.rays[ray];
          if (aimed.status === "unaimed") {
            unaimed++;
            assert.equal(weights[ray], 0, `${where} ray ${ray}: an unaimed sample weighs nothing`);
            return;
          }
          assert.deepEqual([...vec(origins, ray), ...vec(directions, ray)], [...aimed.origin, ...aimed.direction]);
          if (aimed.status === "blocked") return;
          const trace = tracer.skew(aimed);
          if (trace.clipped) return;
          const onDesign = api.skewImagePlaneIntercept(
            trace.x,
            trace.y,
            trace.ux,
            trace.uy,
            geometry.lastSurfZ,
            geometry.imagePlaneZ,
          );
          if (onDesign === null) return;
          const point = api.skewImagePlaneIntercept(trace.x, trace.y, trace.ux, trace.uy, geometry.lastSurfZ, plane);
          if (point === null) return;
          expected.push({
            ray,
            sagittalOffset: point.x - chief.x,
            tangentialOffset: point.y - chief.y,
            weight: (sample.weight ?? 1) * (trace.transmission ?? 1),
          });
        });
        assert.equal(tile.points.length, expected.length, where);
        tile.points.forEach((point, at) => {
          const { ray, ...lv } = expected[at];
          assert.deepEqual(
            { sagittalOffset: point.sagittalOffset, tangentialOffset: point.tangentialOffset, weight: point.weight },
            lv,
            `${where} point ${at}`,
          );
          // The set's weight of the ray is the tab's, transmission and all (lvRayWeights).
          assert.ok(Object.is(weights[ray], point.weight), `${where} ray ${ray}: ${weights[ray]} ${point.weight}`);
          if (point.weight !== samples[ray].weight) absorbed++;
        });
      });
    }
    // The absorbing lens is the one whose weights are more than the area: without it this test says nothing of
    // the transmission.
    assert.ok(absorbed > 100, `rays whose weight is not their area: ${absorbed}`);
    assert.equal(unaimed, 0, "no benchmark tile has an unaimed sample");
  },
);
