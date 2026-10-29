// The axial sets against the real LensVisualizer: the rays its spherical-aberration section (the aberrations tab) and
// its axial-colour section (the chromatic tab) launch, as the case source restates them (src/engines/lv/
// axialRaySets.ts): since LV #927 the shared aimed launch's rays of the axial object, each zone through its fraction of
// the real stop, at the authored indices for spherical aberration and at each chromatic channel's own for axial colour.
// Each ray of a set is traced as the sections trace it (`prepareAimedPupilTrace(...).meridional`: the stop at the
// launch's clip radius, the authored indices or the channel's), read as its runtime result reads it, and the figures,
// summed in LensVisualizer's order, are then the sections' own to the bit: the near-axis and marginal intercepts, the
// longitudinal spherical aberration, the best focus and the RMS and peak there and on the image plane, every point of
// the profile, and, of a run whose lines are the four channels (LV #930: the zone is chosen from all four), the zone
// and every channel's focus, shift, relative shift, image height and the two spreads. `lv`'s `rays.trace` answer of a
// set brings the same rays to the image as the sections' traces do. What is not tested is that the sections' React code
// hands these functions exactly this request: that rests on the canaries of the drawer's lines. Nothing is written.
// Measured at LV e3b1f0f81 and 45e6f852d (engine closure afef1f81 at both), again at 098c91ef6 (closure fef2e248),
// whose channels of a glass matched to a catalog are anchored to the authored index, and at 607ff23ae (closure
// f016b35b), whose zones are aimed at the real stop.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { lvAxialRaySets, lvAxialZones } from "../../../src/engines/lv/axialRaySets.ts";
import { lvChannelLines } from "../../../src/engines/lv/axialZones.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
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

/** What LensVisualizer's runtime result of a meridional trace holds: the height, the slope, whether it clipped. */
interface SectionRay {
  readonly y: number;
  readonly u: number;
  readonly clipped: boolean;
}

/**
 * A ray of a set as the sections trace and read it: the launch's own trace (`prepareAimedPupilTrace`, the stop at the
 * zone launch's clip radius, a channel's indices and wavelength for colour), its height and slope on the last vertex
 * plane, where the sequential trace ends (`computeRealRayHit` reads them so when the ray has not reached the plane).
 */
function sectionRay(
  binding: LvBinding,
  model: LvCaseModel,
  set: RaysTraceSpec,
  ray: number,
  channel?: string,
): SectionRay {
  const { api } = binding;
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const launch = api.prepareAimedPupilLaunch(lvChiefRequest(api, model), [], { uField: 0, yChief: 0 }, channel);
  assert.ok(launch !== null);
  const traced = api.prepareAimedPupilTrace(model.state, launch, channel).meridional({
    origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
    direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
  });
  assert.ok(!traced.reachedImagePlane, "the sections' trace ends on the last surface");
  return { y: traced.y, u: traced.u, clipped: traced.clipped };
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
      // The four channels of the lens as the lines of the case, its reference line (the G channel's) first.
      const channelLines = lvChannelLines(api, await modelOf(binding, key, options));
      assert.ok(channelLines !== null, key);
      const order = ["G", "R", "B", "V"];
      const wavelengthsNm = order.map((channel) => channelLines[channel]);
      const model = await modelOf(binding, key, { ...options, lines: { kind: "explicit", wavelengthsNm } });
      const where = `${key} ${JSON.stringify(options)}`;
      const made = lvAxialRaySets(api, model);
      assert.deepEqual(made.problems, [], where);
      assert.deepEqual(
        made.sets.map((set) => set.line),
        [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
        where,
      );
      const [profile, , , , marginal] = made.sets;
      const colourSets = made.sets.slice(8);
      const request = lvChiefRequest(api, model);
      const result = api.computeSphericalAberration(request);
      assert.ok(result !== null, where);
      const lastSurfZ = model.state.z[model.state.surfaces.length - 1];
      const plane = result.imagePlaneZ;
      assert.equal(plane, model.exported.conditions.imageZ, `${where}: the section's plane is the case's`);

      // The near-axis pair and the marginal candidates: the marginal set's pairs, in the order the section tries
      // them, each the mean of a symmetric pair (`computeSymmetricRealSample`).
      const marginalZones = Array.from(new Set([zones.nearAxis, ...zones.marginal]));
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
      rays += f8(profile, "origins").length / 3 + f8(marginal, "origins").length / 3;

      // The axial colour: the plus ray of each candidate at every channel, each channel's own set traced at its own
      // indices; the zone the first every channel brings across the axis, else the first two do (LV #930,
      // `selectChromaticZone`), read as `computeLongitudinalChromaticFocus` and `computeChromaticRayFanSpread` read it.
      const colour = api.computeLongitudinalChromaticFocus(request);
      assert.ok(colour !== null, where);
      const passes = (ray: SectionRay) => !ray.clipped && Math.abs(ray.u) > 1e-15;
      const candidates = zones.colour.map((fraction, zone) => ({
        fraction,
        traced: new Map(
          order.map((channel, line) => [channel, sectionRay(binding, model, colourSets[line], 2 * zone, channel)]),
        ),
      }));
      const chosen =
        candidates.find(({ traced }) => order.every((channel) => passes(traced.get(channel)!))) ??
        candidates.find(({ traced }) => order.filter((channel) => passes(traced.get(channel)!)).length >= 2);
      assert.ok(chosen !== undefined, where);
      assert.equal(colour.marginalFraction, chosen.fraction, where);
      const intercepts = new Map<string, number>();
      const heights = new Map<string, number>();
      for (const channel of colour.channels) {
        const ray = chosen.traced.get(channel)!;
        if (!passes(ray)) continue;
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
      // A channel's zones are aimed at its own indices: they start elsewhere than the reference channel's.
      assert.ok(
        colourSets.slice(1).some((set) => set.origins.$nd.sha256 !== colourSets[0].origins.$nd.sha256),
        `${where}: each channel's zones are its own`,
      );

      // The engine's own trace of a set is LensVisualizer's: the same rays arrive.
      const traced: [RaysTraceSpec, string | undefined][] = [
        [profile, undefined],
        [marginal, undefined],
        ...colourSets.map((set, line): [RaysTraceSpec, string] => [set, order[line]]),
      ];
      for (const [set, channel] of traced) {
        const answer = answerLvRays(api, model, set);
        assert.ok("data" in answer, where);
        const status = decodeNdArray(answer.data.status).values;
        const origins = f8(set, "origins");
        for (let ray = 0; ray < origins.length / 3; ray++) {
          const ours = sectionRay(binding, model, set, ray, channel);
          assert.equal(status[ray] === 0, !ours.clipped, `${where} line ${set.line} ray ${ray}`);
        }
      }
    }
    // Twelve configurations; four channels each.
    assert.equal(
      rays,
      CONFIGURATIONS.length * 2 * (zones.profile.length + new Set([zones.nearAxis, ...zones.marginal]).size),
    );
    assert.equal(channels, CONFIGURATIONS.length * 4);
  },
);
