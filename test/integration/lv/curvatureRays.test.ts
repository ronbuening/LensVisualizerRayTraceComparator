// The curvature sets against the real LensVisualizer: the rays its field-curve and astigmatism sections (aberrations
// tab) launch, as the case source restates them (src/engines/lv/curvatureRaySets.ts). Each ray of a set is traced by
// LensVisualizer's exact tracer (`traceEngineRay`, with the sections' trace options: clear apertures and the stop
// radius checked, ghost hits, a channel's indices for the chromatic curves), read as its runtime result reads it (the
// point carried to the vertex plane of the surface it ended on, the slopes), and its foci formed as the sections form
// them (`focusPlaneFromRelativeHits` and `bestRelativeFocusPlane`, restated here in their own arithmetic). On every
// benchmark configuration and the zoom's far end that gives, to the bit, of every field:
//
// - the chief ray's landing on the design plane (`chiefImageHeight`), and the tangential and sagittal foci of its four
//   parabasal rays, as z and as shifts from the plane;
// - the tangential and sagittal foci of its real-ray fans (the sections' real-ray curves);
// - at each of LensVisualizer's four chromatic channels, the parabasal shifts of the chromatic field curves.
//
// It also holds that the fields the sections mark are the fields of their curves at the same fractions, bit for bit,
// so that a set traces each once, that the ask is of the fields of the sets, and that `lv`'s `rays.trace` answer of a
// set brings the same rays to the image as the sections' traces do. What is not tested is that the sections' React
// code hands these functions exactly this request: that rests on the canaries of the drawer's lines. Nothing is
// written.
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
import { lvChiefGeometry, lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { lvCurvaturePlaneZ } from "../../../src/engines/lv/curvatureFields.ts";
import { lvCurvatureRaySets } from "../../../src/engines/lv/curvatureRaySets.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import type { LvFieldCurvatureField } from "../../../src/engines/lv/types.ts";
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

/** What LensVisualizer's runtime result of a skew trace holds: where it crosses the last vertex plane, its slopes. */
interface TabRay {
  readonly x: number;
  readonly y: number;
  readonly ux: number;
  readonly uy: number;
  readonly clipped: boolean;
}

/**
 * A ray of a set as the sections trace and read it. The options are the skew adapters' (`traceOptions` in
 * rayAdapters.ts): clear apertures checked, the stop radius the drawer hands, ghost hits, stop on a clip, a unit
 * direction, and for a channel its index and its wavelength. The point is carried to the vertex plane of the surface
 * it ended on and the slopes taken as `finalizeTraceResult` takes them.
 */
function tabRay(
  binding: LvBinding,
  model: LvCaseModel,
  set: RaysTraceSpec,
  ray: number,
  stopSD: number,
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

/** A hit as the sections' focus solvers read it: a coordinate on the last vertex plane and its slope. */
interface Hit {
  readonly coordinate: number;
  readonly slope: number;
}

/** `bestRelativeFocusPlane` of shared.ts, in its own arithmetic: no hit states a `referenceZ` here. */
function bestRelativeFocusPlane(hits: readonly Hit[], reference: Hit, lastSurfZ: number): number {
  const denom = hits.reduce((sum, hit) => {
    const du = hit.slope - reference.slope;
    return sum + du * du;
  }, 0);
  if (denom <= 1e-12) return lastSurfZ;
  const numer = hits.reduce((sum, hit) => {
    const du = hit.slope - reference.slope;
    const offset = hit.coordinate - hit.slope * lastSurfZ - reference.coordinate + reference.slope * lastSurfZ;
    return sum + offset * du;
  }, 0);
  return -numer / denom;
}

/** `focusPlaneFromRelativeHits` of fieldCurvature.ts, in its own arithmetic. */
function focusPlaneFromRelativeHits(hits: readonly Hit[], reference: Hit, lastSurfZ: number): number | null {
  if (hits.length === 0) return null;
  if (hits.length === 1) {
    const dy = hits[0].coordinate - reference.coordinate;
    const du = hits[0].slope - reference.slope;
    if (Math.abs(du) <= 1e-12) return lastSurfZ;
    return lastSurfZ - dy / du;
  }
  return bestRelativeFocusPlane(hits, reference, lastSurfZ);
}

/** The tangential (y) or sagittal (x) hit of a traced ray. */
function hitOf(ray: TabRay, axis: "tangential" | "sagittal"): Hit {
  return axis === "tangential" ? { coordinate: ray.y, slope: ray.uy } : { coordinate: ray.x, slope: ray.ux };
}

test(
  "the curvature sets of the benchmark lenses, traced as the field-curve sections trace them, are their foci to the bit",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let rays = 0;
    let fields = 0;
    let worstPlainSplit = 0;
    for (const { key, options } of CONFIGURATIONS) {
      const model = await modelOf(binding, key, options);
      const where = `${key} ${JSON.stringify(options)}`;
      const { state, exported } = model;
      assert.equal(exported.conditions.lines.length, 1);
      const made = lvCurvatureRaySets(api, model);
      assert.deepEqual(made.problems, [], where);
      assert.equal(made.sets.length, 2, where);
      const [parabasalSet, realRaySet] = made.sets;
      const request = lvChiefRequest(api, model);
      const bundle = api.computeFieldCurvatureBundle(request);
      const base = bundle.fieldCurvature;
      const chromatic = bundle.chromaticFieldCurvature;
      assert.ok(base !== null && chromatic !== null, where);
      // The sections place their foci on the design plane, which is the case's.
      assert.ok(Object.is(base.imagePlaneZ, lvCurvaturePlaneZ(model)), where);
      assert.ok(Object.is(base.imagePlaneZ, exported.conditions.imageZ), where);
      // A marked field is its curve's field of the same fraction, to the bit: the sets trace each fraction once.
      for (const marked of base.fields) {
        const curve: LvFieldCurvatureField | undefined = base.curveFields.find(
          (field) => field.fieldFraction === marked.fieldFraction,
        );
        assert.ok(curve !== undefined, `${where}: ${marked.fieldFraction}`);
        assert.deepEqual(curve, marked, where);
      }
      const traced = base.curveFields;
      const tracedChromatic = chromatic.curveFields;
      assert.deepEqual(
        made.asks,
        [
          {
            lines: [0],
            maxFieldDeg: lvChiefGeometry(api, model)?.halfFieldDeg,
            fieldAnglesDeg: traced.map((field) => field.fieldAngleDeg),
          },
        ],
        where,
      );
      const stopSD = exported.conditions.stopSemiDiameter;
      const last = state.surfaces.length - 1;
      const lastSurfZ = state.z[last];
      const parabasalRays = f8(parabasalSet, "origins").length / 3;
      const realRays = f8(realRaySet, "origins").length / 3;
      assert.equal(parabasalRays, 5 * traced.length, where);
      assert.equal(realRays % traced.length, 0, where);
      const perFan = (realRays / traced.length - 1) / 2;

      traced.forEach((field: LvFieldCurvatureField, at) => {
        const named = `${where}: field ${field.fieldFraction}`;
        assert.ok(field.usable, named);
        // The parabasal block: t-, t+, s-, s+, then the chief ray.
        const block = (channel?: string) =>
          Array.from({ length: 5 }, (_, ray) => tabRay(binding, model, parabasalSet, 5 * at + ray, stopSD, channel));
        const foci = (traces: readonly TabRay[]) => {
          const chief = traces[4];
          const hits = (axis: "tangential" | "sagittal", rays: readonly TabRay[]) =>
            rays.filter((ray) => !ray.clipped).map((ray) => hitOf(ray, axis));
          return {
            chief,
            tangential: focusPlaneFromRelativeHits(
              hits("tangential", traces.slice(0, 2)),
              hitOf(chief, "tangential"),
              lastSurfZ,
            ),
            sagittal: focusPlaneFromRelativeHits(
              hits("sagittal", traces.slice(2, 4)),
              hitOf(chief, "sagittal"),
              lastSurfZ,
            ),
          };
        };
        const own = foci(block());
        assert.ok(!own.chief.clipped && own.tangential !== null && own.sagittal !== null, named);
        const landing = api.skewImagePlaneIntercept(
          own.chief.x,
          own.chief.y,
          own.chief.ux,
          own.chief.uy,
          lastSurfZ,
          base.imagePlaneZ,
        );
        assert.ok(landing !== null && Object.is(field.chiefImageHeight, landing.y), `${named}: chief landing`);
        assert.ok(Object.is(field.tangentialBestFocusZ, own.tangential), `${named}: tangential focus`);
        assert.ok(Object.is(field.sagittalBestFocusZ, own.sagittal), `${named}: sagittal focus`);
        assert.ok(Object.is(field.tangentialShiftMm, own.tangential - base.imagePlaneZ), `${named}: tangential shift`);
        assert.ok(Object.is(field.sagittalShiftMm, own.sagittal - base.imagePlaneZ), `${named}: sagittal shift`);

        // The real-ray fans: the tangential fan, the sagittal fan, then the chief ray; the samples that land.
        const width = 2 * perFan + 1;
        const fan = (from: number) =>
          Array.from({ length: perFan }, (_, ray) =>
            tabRay(binding, model, realRaySet, width * at + from + ray, stopSD),
          );
        const [tangentialFan, sagittalFan] = [fan(0), fan(perFan)];
        const chief = tabRay(binding, model, realRaySet, width * at + 2 * perFan, stopSD);
        const valid = (rays: readonly TabRay[]) => rays.filter((ray) => !ray.clipped);
        if (valid(tangentialFan).length >= 3 && valid(sagittalFan).length >= 3) {
          const tangential = bestRelativeFocusPlane(
            valid(tangentialFan).map((ray) => hitOf(ray, "tangential")),
            hitOf(chief, "tangential"),
            lastSurfZ,
          );
          const sagittal = bestRelativeFocusPlane(
            valid(sagittalFan).map((ray) => hitOf(ray, "sagittal")),
            hitOf(chief, "sagittal"),
            lastSurfZ,
          );
          assert.ok(Object.is(field.diagnosticTangentialBestFocusZ, tangential), `${named}: real-ray tangential`);
          assert.ok(Object.is(field.diagnosticSagittalBestFocusZ, sagittal), `${named}: real-ray sagittal`);
          worstPlainSplit = Math.max(worstPlainSplit, Math.abs(tangential - own.tangential));
        } else {
          assert.equal(field.diagnosticTangentialBestFocusZ, undefined, `${named}: no real-ray curve`);
        }

        // The chromatic field curves: the same rays at each channel's indices.
        const shifts = tracedChromatic[at].chromaticFieldShifts;
        assert.ok(shifts !== null, named);
        for (const shift of shifts) {
          const atChannel = foci(block(shift.channel));
          assert.ok(atChannel.tangential !== null && atChannel.sagittal !== null, `${named} ${shift.channel}`);
          assert.ok(
            Object.is(shift.tangentialShiftMm, atChannel.tangential - base.imagePlaneZ),
            `${named}: ${shift.channel} tangential`,
          );
          assert.ok(
            Object.is(shift.sagittalShiftMm, atChannel.sagittal - base.imagePlaneZ),
            `${named}: ${shift.channel} sagittal`,
          );
        }
        fields++;
      });
      rays += parabasalRays + realRays;

      // The engine's own trace of a set, at the case's stop radius, is LensVisualizer's: the same rays arrive.
      for (const set of made.sets) {
        const answer = answerLvRays(api, model, set);
        assert.ok("data" in answer, where);
        const status = decodeNdArray(answer.data.status).values;
        for (let ray = 0; ray < f8(set, "origins").length / 3; ray++) {
          assert.equal(status[ray] === 0, !tabRay(binding, model, set, ray, stopSD).clipped, `${where} ${ray}`);
        }
      }
    }
    t.diagnostic(
      `${rays} rays, ${fields} fields; the real-ray tangential focus is up to ${worstPlainSplit} mm from the parabasal one`,
    );
  },
);
