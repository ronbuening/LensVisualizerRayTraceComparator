// The vignetting sets against the real LensVisualizer: the rays its vignetting tab launches, as the case source
// restates them (src/engines/lv/vignettingRaySets.ts), and its launch lattices of the same fields. Each ray of a sweep is
// traced by LensVisualizer's exact tracer (`traceEngineRay`, with the tab's trace options: clear apertures and the stop
// radius checked, ghost hits, stop on a clip, a unit direction, the authored indices) and counted as the tab counts it
// (`!trace.clipped`, and its bulk transmission, which the set states as the ray's weight), in the tab's own arithmetic.
// On every benchmark configuration, the zoom's far end and an absorbing lens (the Laowa 105 mm STF) that gives, to the
// bit, every field's geometric transmission and relative illumination of `computeVignettingCurve`.
//
// It also holds that the fields of the sets and the ask are the tab's own, that each lattice is LensVisualizer's launch
// lattice of its field (`lvFieldRaySets`), and that `lv`'s `rays.trace` answer of a sweep brings to the image exactly the
// rays the tab counts. And it holds every ray of a sweep, bit for bit, to the ray LensVisualizer's own meridional adapter
// launches for the tab from LensVisualizer's own field solve (`traceRay`, `traceRayExactCore`: the lines of
// `bindRayTrace`'s `ray`, which the tab calls through `prepareRayTrace`, but for reading `rayLead` of the runtime view
// rather than of the lens's constants, which the launch point compared here would show): its launch, every hit, its
// exit, its bulk transmission. What is not tested is that the tab's React code hands `computeVignettingCurve` exactly
// this request: that rests on the canaries of the tab's lines. Nothing is written.
import assert from "node:assert/strict";
import { test } from "node:test";

import { sweepBlocks } from "../../../src/compare/raysVignetting.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefGeometry, lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvFieldRaySets, lvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import { DEFAULT_BUNDLE_GRID } from "../../../src/rays/raySets.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

/** The benchmark's lenses as they open, the far end of its zoom, and a lens whose glass absorbs. */
const CONFIGURATIONS: readonly { readonly key: string; readonly options: RunOptions }[] = [
  ...BENCHMARK_KEYS.map((key) => ({ key, options: {} })),
  { key: "nikon-z-24-70f4s", options: { state: { zoomT: 1 } } },
  { key: "laowa-105mm-f2-stf", options: {} },
];

async function modelOf(binding: LvBinding, key: string, options: RunOptions): Promise<LvCaseModel> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, `${key}: ${JSON.stringify(exported)}`);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, key);
  return rebuilt.model;
}

function f8(set: RaysTraceSpec, name: "origins" | "directions" | "weights"): Float64Array {
  return decodeNdArray(set[name]).values as Float64Array;
}

/** Whether a ray of a set passes, traced with the tab's options (`traceOptions` of the meridional adapter). */
function passes(binding: LvBinding, model: LvCaseModel, set: RaysTraceSpec, ray: number): boolean {
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const trace = binding.api.traceEngineRay(
    model.state,
    {
      origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
      direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
    },
    {
      checkSemiDiameter: true,
      stopSemiDiameter: model.exported.conditions.stopSemiDiameter,
      ghost: true,
      stopOnClip: true,
      directionNormalized: true,
    },
  );
  return trace.status === "ok";
}

test(
  "the sweeps, traced as the tab traces them, give its geometric transmission and relative illumination to the bit",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let [fields, rays, absorbed] = [0, 0, 0];
    for (const { key, options } of CONFIGURATIONS) {
      const at = `${key} ${JSON.stringify(options)}`;
      const model = await modelOf(binding, key, options);
      const made = lvVignettingRaySets(api, model);
      assert.deepEqual(made.problems, [], at);
      const curve = api.computeVignettingCurve(lvChiefRequest(api, model));
      const [sweep] = made.sets;
      const blocks = sweepBlocks(sweep);
      assert.equal(blocks.length, curve.length, at);
      // The tab's own arithmetic: counts and a plain running sum of the transmissions, over the rays of the field.
      const weights = f8(sweep, "weights");
      const raw = blocks.map(({ first, end }) => {
        let [surviving, transmitted] = [0, 0];
        for (let ray = first; ray < end; ray++) {
          if (!passes(binding, model, sweep, ray)) continue;
          surviving++;
          transmitted += weights[ray];
        }
        return { gt: surviving / (end - first), intensity: transmitted / (end - first) };
      });
      curve.forEach((sample, i) => {
        const thetaRad = (sample.fieldAngleDeg * Math.PI) / 180;
        const cos4 = Math.pow(Math.cos(thetaRad), 4);
        assert.equal(raw[i].gt / raw[0].gt, sample.geometricTransmission, `${at} field ${i}`);
        assert.equal((raw[i].intensity * cos4) / raw[0].intensity, sample.relativeIllumination, `${at} field ${i}`);
      });
      // The ask: the tab's line and fields, the axis first, at the angles of its curve to the bit.
      assert.deepEqual(made.asks, [
        {
          lines: [0],
          maxFieldDeg: lvChiefGeometry(api, model)!.halfFieldDeg,
          fieldAnglesDeg: curve.map((sample) => sample.fieldAngleDeg),
        },
      ]);
      // The lattices: LensVisualizer's launch lattice of each of the tab's fields.
      const setup = lvLaunchSetup(api, model);
      assert.ok(!("problem" in setup), at);
      const lattices = made.sets.slice(1);
      assert.equal(lattices.length, curve.length, at);
      curve.forEach((sample, i) => {
        const own = lvFieldRaySets(api, model, setup, { angleDeg: sample.fieldAngleDeg }, DEFAULT_BUNDLE_GRID);
        assert.ok("sets" in own, at);
        assert.deepEqual(lattices[i], own.sets[0], `${at} field ${i}`);
      });
      // lv's own trace of the sweep brings to the image exactly the rays the tab counts.
      const answer = answerLvRays(api, model, sweep);
      assert.ok("data" in answer, at);
      const status = decodeNdArray(answer.data.status).values as Uint8Array;
      status.forEach((each, ray) => {
        if ((each === 0) !== passes(binding, model, sweep, ray)) assert.fail(`${at}: ray ${ray}`);
      });
      fields += curve.length;
      rays += weights.length;
      if (weights.some((weight) => weight < 1)) absorbed++;
    }
    assert.equal(absorbed, 1, "the Laowa's absorbing glass weighs its sweeps' rays, and no other lens's does");
    // Measured at LV be077cbcd: 13 configurations, 123 fields, 19,776 rays a line.
    assert.deepEqual([fields, rays], [123, 19776]);
  },
);

test(
  "every ray of a sweep is the ray LensVisualizer's meridional adapter launches for the tab: launch, hits and exit to the bit",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let [rays, through] = [0, 0];
    for (const { key, options } of CONFIGURATIONS) {
      const at = `${key} ${JSON.stringify(options)}`;
      const model = await modelOf(binding, key, options);
      const [sweep] = lvVignettingRaySets(api, model).sets;
      // The tab's arguments, as `computeVignettingCurve` reads them of its request.
      const request = lvChiefRequest(api, model);
      const state = request.preparedGeometry;
      const { focusT, zoomT } = state;
      const aberrationT = (state as { readonly aberrationT?: number }).aberrationT ?? 0;
      const zPos = [...state.z];
      const { entrancePupilSemiDiameterMm: epsd, stopSemiDiameterMm: stopSD } = request.aperture;
      const geometry = lvChiefGeometry(api, model)!;
      const curve = api.computeVignettingCurve(request);
      const answer = answerLvRays(api, model, sweep);
      assert.ok("data" in answer, at);
      const data: RaysTraceData = answer.data;
      const f8Of = (name: "hits" | "exitPoint" | "exitDirection") => decodeNdArray(data[name]).values as Float64Array;
      const [hits, exitPoint, exitDirection] = [f8Of("hits"), f8Of("exitPoint"), f8Of("exitDirection")];
      const status = decodeNdArray(data.status).values as Uint8Array;
      const endSurface = decodeNdArray(data.endSurface).values as Int32Array;
      const [origins, weights] = [f8(sweep, "origins"), f8(sweep, "weights")];
      const surfaces = state.surfaces.length;
      const count = weights.length;
      const blocks = sweepBlocks(sweep);
      assert.equal(blocks.length, curve.length, at);
      blocks.forEach(({ first, end }, field) => {
        // LensVisualizer's own launch of the field (its chief-ray solve and slope) and its own pupil fractions.
        const angle = curve[field].fieldAngleDeg;
        const solve = api.solveChiefRayForRuntimeLens(angle, focusT, zoomT, model.runtime, geometry, aberrationT);
        const { uField } = api.projectionLaunchSlopeForField(model.runtime, angle);
        const fractions = api.evenlySpacedSigned(end - first);
        for (let ray = first; ray < end; ray++) {
          const here = `${at} field ${field} ray ${ray}`;
          const y0 = solve.yLaunch + fractions[ray - first] * epsd;
          const own = api.traceRay(y0, uField, zPos, focusT, zoomT, stopSD, true, model.runtime, aberrationT);
          // The launch: the adapter's lead point is the set's origin, on the meridian.
          assert.equal(origins[3 * ray], 0, here);
          assert.deepEqual(own.pts[0], [origins[3 * ray + 2], origins[3 * ray + 1]], here);
          assert.equal(own.clipped, status[ray] !== 0, here);
          // Every hit of a surface the ray passed; the adapter's points are its unclipped hits, (z, y).
          const passed = status[ray] === 0 ? surfaces : endSurface[ray];
          assert.equal(own.pts.length, 1 + passed, here);
          for (let surface = 0; surface < passed; surface++) {
            const h = (surface * count + ray) * 3;
            const [z, y] = own.pts[1 + surface];
            if (hits[h] !== 0 || hits[h + 1] !== y || hits[h + 2] !== z) assert.fail(`${here} surface ${surface}`);
          }
          if (status[ray] !== 0) continue;
          // The exit, as the adapter states it: the slope of the exit direction (`directionSlopes`) and the height at the
          // last vertex (`projectCoordinateToZ`), each of the answer's exit point and direction by LensVisualizer's own
          // formula. The landing on the image plane is the comparator's projection of this exit, as for every engine.
          const [py, pz, dy, dz] = [
            exitPoint[3 * ray + 1],
            exitPoint[3 * ray + 2],
            exitDirection[3 * ray + 1],
            exitDirection[3 * ray + 2],
          ];
          const invDz = Math.abs(dz) > 1e-12 ? 1 / dz : Infinity;
          assert.equal(own.u, dy * invDz, here);
          const zLast = state.z[surfaces - 1];
          assert.equal(own.y, Math.abs(dz) <= 1e-12 ? py : py + ((zLast - pz) * dy) / dz, here);
          // The bulk transmission the tab sums for a ray that gets through is the set's weight of the ray.
          assert.equal((own as { readonly transmission?: number }).transmission ?? 1, weights[ray], here);
          through++;
        }
      });
      rays += count;
    }
    // Measured at LV be077cbcd: 13 configurations, 19,776 rays a line.
    assert.equal(rays, 19776);
    t.diagnostic(`${rays} sweep rays held to LensVisualizer's meridional adapter, ${through} of them through the lens`);
  },
);
