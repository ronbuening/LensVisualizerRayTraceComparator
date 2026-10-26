// The axial sets against the real LensVisualizer: the rays its spherical-aberration section (the aberrations tab) and
// its axial-colour section (the chromatic tab) launch, as the case source restates them (src/engines/lv/
// axialRaySets.ts). Each ray of a set is traced by LensVisualizer's exact tracer (`traceEngineRay`, with the
// sections' trace options: the authored indices for spherical aberration, each chromatic channel's for axial colour),
// read as its runtime result reads it (the height carried to the last vertex plane, the slope), and the figures,
// summed in LensVisualizer's order, are then the sections' own to the bit: the near-axis and marginal intercepts, the
// longitudinal spherical aberration, the best focus and the RMS and peak there and on the image plane, every point
// of the profile, and every channel's focus, shift, relative shift, image height and the two spreads. Each ray at
// the authored indices is also held to LensVisualizer's own meridional trace of its height (`traceRay`, the
// sections' launch through the public adapter), and `lv`'s `rays.trace` answer of a set brings the same rays to the
// image as the sections' traces do. What is not tested is that the sections' React code hands these functions
// exactly this request: that rests on the canaries of the drawer's lines. Nothing is written. Measured at LV
// e3b1f0f81 and 45e6f852d (engine closure afef1f81 at both).
import assert from "node:assert/strict";
import { test } from "node:test";

import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { lvAxialRaySets, lvAxialZones } from "../../../src/engines/lv/axialRaySets.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { lvSpotSetup, lvTabPupilSemiDiameter } from "../../../src/engines/lv/spotSetup.ts";
import type { LvAnalysisRequest } from "../../../src/engines/lv/types.ts";
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

/** What LensVisualizer's runtime result of a meridional trace holds: the height, the slope, whether it clipped. */
interface SectionRay {
  readonly y: number;
  readonly u: number;
  readonly clipped: boolean;
}

/**
 * A ray of a set as the sections trace and read it. The options are the adapters' (`traceOptions` in
 * rayAdapters.ts): clear apertures checked, the stop radius, ghost hits, stop on a clip, a unit direction, and for a
 * channel its index (`state.lens.dispersion[i]?.indexAt(channel) ?? nd`) and its wavelength. The height is carried to
 * the vertex plane of the last surface it met and the slope taken as `finalizeTraceResult` takes them.
 */
function sectionRay(
  binding: LvBinding,
  model: LvCaseModel,
  set: RaysTraceSpec,
  ray: number,
  channel?: string,
): SectionRay {
  const { api } = binding;
  const { state, exported } = model;
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
      stopSemiDiameter: exported.conditions.stopSemiDiameter,
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
  const returnZ = state.z[Math.max(0, trace.terminalSurfaceIndex)];
  // directionSlopes: `const invDz = Math.abs(direction[2]) > 1e-12 ? 1 / direction[2] : Infinity;`
  const invDz = Math.abs(toward[2]) > 1e-12 ? 1 / toward[2] : Infinity;
  return {
    y: api.projectCoordinateToZ(point[1], point[2], toward[1], toward[2], returnZ),
    u: toward[1] * invDz,
    clipped: trace.status !== "ok",
  };
}

/** The request the drawer hands the sections, as the engine makes it for the coma tab: the two radii of the case. */
function tabRequest(binding: LvBinding, model: LvCaseModel): LvAnalysisRequest {
  return binding.api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: lvTabPupilSemiDiameter(binding.api, model),
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: lvSpotSetup(binding.api, model).fieldGeometry,
  });
}

/** A ray of the spherical-aberration section as `computeRealRayHit` reads it, or null where it is dropped. */
function realHit(ray: SectionRay, signedFraction: number, lastSurfZ: number, imagePlaneZ: number) {
  if (ray.clipped) return null;
  // axialIntercept: `if (Math.abs(u) < MIN_SLOPE) return null; return lastSurfZ - y / u;`
  if (Math.abs(ray.u) < 1e-12) return null;
  const intercept = lastSurfZ - ray.y / ray.u;
  // imagePlaneCoordinate on a plane normal to the axis: `dz = -numer / denom`, `yHit = y + u * dz`.
  const dz = -(lastSurfZ - imagePlaneZ) / 1;
  const imageHeight = ray.y + ray.u * dz;
  if (!isFinite(imageHeight)) return null;
  return { signedFraction, coordinate: ray.y, slope: ray.u, intercept, imageHeight };
}

test(
  "the axial sets of the benchmark lenses, traced as the two sections trace them, are their figures to the bit",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const zones = lvAxialZones(api);
    let rays = 0;
    let channels = 0;
    for (const { key, options } of CONFIGURATIONS) {
      const model = await modelOf(binding, key, options);
      const where = `${key} ${JSON.stringify(options)}`;
      assert.equal(model.exported.conditions.lines.length, 1);
      const made = lvAxialRaySets(api, model);
      assert.deepEqual(made.problems, [], where);
      const [profile, marginal] = made.sets;
      const request = tabRequest(binding, model);
      const result = api.computeSphericalAberration(request);
      assert.ok(result !== null, where);
      const lastSurfZ = model.state.z[model.state.surfaces.length - 1];
      const plane = result.imagePlaneZ;
      assert.equal(plane, model.exported.conditions.imageZ, `${where}: the section's plane is the case's`);

      // The near-axis pair and the marginal candidates: the marginal set's pairs, in the order the section tries
      // them, each the mean of a symmetric pair (`computeSymmetricRealSample`).
      const marginalZones = Array.from(new Set([zones.nearAxis, ...zones.marginal, ...zones.colour]));
      const pairAt = (zone: number) => {
        const fraction = marginalZones[zone];
        const plus = realHit(sectionRay(binding, model, marginal, 2 * zone), fraction, lastSurfZ, plane);
        const minus = realHit(sectionRay(binding, model, marginal, 2 * zone + 1), -fraction, lastSurfZ, plane);
        if (plus === null || minus === null) return null;
        return {
          fraction,
          intercept: (plus.intercept + minus.intercept) / 2,
          imageHeight: (plus.imageHeight + minus.imageHeight) / 2,
        };
      };
      const near = pairAt(0);
      assert.ok(near !== null, where);
      const marginalPair = zones.marginal.map((_fraction, at) => pairAt(1 + at)).find((pair) => pair !== null);
      assert.ok(marginalPair !== undefined && marginalPair !== null, where);
      assert.ok(Object.is(result.nearAxisRealIntercept, near.intercept), `${where}: near-axis intercept`);
      assert.ok(Object.is(result.nearAxisImageHeight, near.imageHeight), `${where}: near-axis height`);
      assert.equal(result.marginalFraction, marginalPair.fraction, where);
      assert.ok(Object.is(result.marginalRealIntercept, marginalPair.intercept), `${where}: marginal intercept`);
      assert.ok(Object.is(result.longitudinalSaMm, marginalPair.intercept - near.intercept), `${where}: LSA`);

      // The profile's pairs: the best focus, the RMS and the peak there and on the image plane, in the section's
      // sums and order (`bestFocusPlane`, `rmsAtPlane`, `peakAtPlane`), and every point of the profile.
      const hits = zones.profile.flatMap((fraction, zone) => {
        const plus = realHit(sectionRay(binding, model, profile, 2 * zone), fraction, lastSurfZ, plane);
        const minus = realHit(sectionRay(binding, model, profile, 2 * zone + 1), -fraction, lastSurfZ, plane);
        return plus === null || minus === null ? [] : [plus, minus];
      });
      const denom = hits.reduce((sum, hit) => sum + hit.slope * hit.slope, 0);
      const numer = hits.reduce((sum, hit) => sum + hit.slope * hit.slope * lastSurfZ - hit.coordinate * hit.slope, 0);
      const bestFocusZ = numer / denom;
      const at = (hit: (typeof hits)[number], planeZ: number) => hit.coordinate + hit.slope * (planeZ - lastSurfZ);
      const rms = (planeZ: number) =>
        Math.sqrt(
          hits.reduce((sum, hit) => {
            const imageHeight = at(hit, planeZ);
            return sum + imageHeight * imageHeight;
          }, 0) / hits.length,
        );
      const peak = (planeZ: number) => Math.max(...hits.map((hit) => Math.abs(at(hit, planeZ))));
      assert.equal(result.validSampleCount, hits.length, where);
      assert.ok(Object.is(result.bestFocusZ, bestFocusZ), `${where}: best focus`);
      assert.ok(Object.is(result.bestFocusRmsMm, rms(bestFocusZ)), `${where}: RMS at best focus`);
      assert.ok(Object.is(result.bestFocusPeakMm, peak(bestFocusZ)), `${where}: peak at best focus`);
      assert.ok(Object.is(result.currentPlaneRmsMm, rms(plane)), `${where}: RMS on the image plane`);
      assert.ok(Object.is(result.currentPlanePeakMm, peak(plane)), `${where}: peak on the image plane`);
      const reference = hits.find((hit) => hit.signedFraction === zones.nearAxis);
      assert.ok(reference !== undefined, where);
      const points = zones.profile.flatMap((fraction) => {
        const hit = hits.find((each) => each.signedFraction === fraction);
        return hit === undefined ? [] : [{ fraction, transverseSaMm: at(hit, bestFocusZ) - at(reference, bestFocusZ) }];
      });
      assert.deepEqual(api.computeSAProfile(request), points, where);

      // Each ray at the authored indices is LensVisualizer's own meridional trace of its height.
      const runtime = model.runtime;
      for (const set of [profile, marginal]) {
        const origins = f8(set, "origins");
        for (let ray = 0; ray < origins.length / 3; ray++) {
          const ours = sectionRay(binding, model, set, ray);
          const theirs = api.traceRay(
            origins[3 * ray + 1],
            0,
            [...model.state.z],
            model.state.focusT,
            model.state.zoomT,
            model.exported.conditions.stopSemiDiameter,
            true,
            runtime,
            0,
          );
          assert.equal(theirs.clipped, ours.clipped, `${where} ray ${ray}`);
          assert.ok(Object.is(theirs.y, ours.y) && Object.is(theirs.u, ours.u), `${where} ray ${ray}`);
          rays++;
        }
      }

      // The axial colour: the plus ray of each candidate at every channel, the first that arrives at two channels,
      // read as `computeLongitudinalChromaticFocus` and `computeChromaticRayFanSpread` read it.
      const colour = api.computeLongitudinalChromaticFocus(request);
      assert.ok(colour !== null, where);
      const order = colour.channels;
      let chosen: { fraction: number; traced: Map<string, SectionRay> } | null = null;
      for (const fraction of zones.colour) {
        const zone = marginalZones.indexOf(fraction);
        const traced = new Map(
          order.map((channel) => [channel, sectionRay(binding, model, marginal, 2 * zone, channel)]),
        );
        const valid = order.filter((channel) => {
          const ray = traced.get(channel)!;
          return !ray.clipped && Math.abs(ray.u) > 1e-15;
        });
        if (valid.length >= 2) {
          chosen = { fraction, traced };
          break;
        }
      }
      assert.ok(chosen !== null, where);
      assert.equal(colour.marginalFraction, chosen.fraction, where);
      const intercepts = new Map<string, number>();
      const heights = new Map<string, number>();
      for (const channel of order) {
        const ray = chosen.traced.get(channel)!;
        if (ray.clipped || !(Math.abs(ray.u) > 1e-15)) continue;
        intercepts.set(channel, lastSurfZ - ray.y / ray.u);
        heights.set(channel, ray.y + (colour.imagePlaneZ - lastSurfZ) * ray.u);
      }
      const referenceZ = intercepts.get(colour.referenceChannel) ?? null;
      for (const sample of colour.samples) {
        const focusZ = intercepts.get(sample.channel) ?? null;
        assert.ok(Object.is(sample.focusZ, focusZ), `${where} ${sample.channel}: focus`);
        assert.ok(Object.is(sample.focusShiftMm, focusZ === null ? null : focusZ - colour.imagePlaneZ));
        assert.ok(
          Object.is(sample.relativeFocusShiftMm, focusZ === null || referenceZ === null ? null : focusZ - referenceZ),
        );
        assert.ok(Object.is(sample.imageHeightMm, heights.get(sample.channel) ?? null), `${where} ${sample.channel}`);
        channels++;
      }
      const span = (values: number[]) => (values.length < 2 ? 0 : Math.max(...values) - Math.min(...values));
      assert.ok(Object.is(colour.longitudinalSpreadMm, span([...intercepts.values()])), `${where}: LoCA`);
      assert.ok(Object.is(colour.transverseSpreadMm, span([...heights.values()])), `${where}: fan span`);

      // The engine's own trace of a set is LensVisualizer's: the same rays arrive, and leave the last surface alike.
      for (const set of [profile, marginal]) {
        const answer = answerLvRays(api, model, set);
        assert.ok("data" in answer, where);
        const status = decodeNdArray(answer.data.status).values;
        const origins = f8(set, "origins");
        for (let ray = 0; ray < origins.length / 3; ray++) {
          assert.equal(status[ray] === 0, !sectionRay(binding, model, set, ray).clipped, `${where} ray ${ray}`);
        }
      }
    }
    // Twelve configurations, 56 rays a configuration; four channels each.
    assert.equal(
      rays,
      CONFIGURATIONS.length *
        2 *
        (zones.profile.length + new Set([zones.nearAxis, ...zones.marginal, ...zones.colour]).size),
    );
    assert.equal(channels, CONFIGURATIONS.length * 4);
  },
);
