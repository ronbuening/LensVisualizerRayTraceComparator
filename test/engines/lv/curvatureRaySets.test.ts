// The curvature sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose field-curve sections
// have LensVisualizer's names, its launches and fields of their own. What is held here is which rays the case source
// makes for the sections and that, traced, they are the sections' own: the fake's chief landings, parabasal and
// real-ray foci and chromatic shifts come back from them to the bit. That the restatement is LensVisualizer's own is
// test/integration/lv/curvatureRays.test.ts, against the real one.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { curvatureFieldsOf } from "../../../src/compare/raysCurvature.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefGeometry, lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { lvCurvatureFractions, lvParabasalFraction } from "../../../src/engines/lv/curvatureFields.ts";
import {
  CURVATURE_PATTERNS,
  lvCurvatureRaySets,
  lvParabasalOffsets,
} from "../../../src/engines/lv/curvatureRaySets.ts";
import { lvTabPupilSemiDiameter } from "../../../src/engines/lv/spotSetup.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import type { LvApi } from "../../../src/engines/lv/types.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";

async function modelOf(
  binding: LvBinding,
  key: string,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return { opticalCase: exported.opticalCase, model: rebuilt.model };
}

function f8(set: RaysTraceSpec, name: "origins" | "directions" | "weights"): Float64Array {
  return decodeNdArray(set[name]).values as Float64Array;
}

/**
 * A ray of a set as the fake's sections read it: traced with their options (clear apertures, the stop radius, stop on a
 * clip, a unit direction; the authored indices, or a channel's), its point carried to the vertex plane of the surface
 * it ended on and its slopes taken as the fake takes them. Null for a ray that did not arrive.
 */
function tabRay(api: LvApi, model: LvCaseModel, set: RaysTraceSpec, ray: number, channel?: string) {
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
      stopSemiDiameter: model.exported.conditions.stopSemiDiameter,
      stopOnClip: true,
      directionNormalized: true,
      ...(channel === undefined ? {} : { indexAtSurface: (at: number) => dispersion[at]!.indexAt(channel) }),
    },
  );
  if (trace.status !== "ok") return null;
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const z = state.z[Math.max(0, trace.terminalSurfaceIndex)];
  return {
    x: api.projectCoordinateToZ(point[0], point[2], toward[0], toward[2], z),
    y: api.projectCoordinateToZ(point[1], point[2], toward[1], toward[2], z),
    ux: toward[0] / toward[2],
    uy: toward[1] / toward[2],
  };
}

/** LensVisualizer's least squares of hits relative to a reference hit, from the last vertex plane, as the fake's. */
function focus(hits: readonly { c: number; u: number }[], reference: { c: number; u: number }, lastZ: number): number {
  const denom = hits.reduce((sum, hit) => sum + (hit.u - reference.u) * (hit.u - reference.u), 0);
  if (hits.length === 1) return lastZ - (hits[0].c - reference.c) / (hits[0].u - reference.u);
  const numer = hits.reduce(
    (sum, hit) => sum + (hit.c - hit.u * lastZ - reference.c + reference.u * lastZ) * (hit.u - reference.u),
    0,
  );
  return -numer / denom;
}

test("the curvature sets are the two patterns of the sections, field by field, the same rays at every line", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, SINGLET, {
    lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725, 600] },
  });
  const made = lvCurvatureRaySets(api, model);
  assert.deepEqual(made.problems, []);
  assert.equal(CURVATURE_PATTERNS.length, 2);
  const lines = opticalCase.conditions.lines.length;
  assert.equal(made.sets.length, 2 * lines);
  // Pattern by pattern, a set at each line, of the same rays.
  const fractions = lvCurvatureFractions(api);
  assert.deepEqual(fractions, [0, 0.25, 0.5, 0.75, 1]);
  const halfField = lvChiefGeometry(api, model)!.halfFieldDeg;
  for (const [pattern, perField] of [
    [0, 5],
    [1, 2 * 7 + 1],
  ] as const) {
    const sets = made.sets.slice(pattern * lines, (pattern + 1) * lines);
    assert.deepEqual(
      sets.map((set) => set.line),
      [0, 1, 2],
    );
    for (const set of sets) {
      assert.deepEqual(set.origins, sets[0].origins);
      assert.equal(set.groups, undefined, "a curvature set states no groups: its fields are read from its launches");
      assert.ok(f8(set, "weights").every((weight) => weight === 1));
    }
    const fields = curvatureFieldsOf(sets[0], f8(sets[0], "origins").length / 3);
    assert.ok(Array.isArray(fields));
    assert.equal(fields.length, fractions.length);
    fields.forEach((field, at) => {
      assert.equal(field.chief, (at + 1) * perField - 1, `the chief ray is the last of field ${at}`);
      // A parabasal block: two rays of each fan; a real-ray block: the fans less each fan's centre, the chief ray's own.
      assert.equal(field.tangential.length, pattern === 0 ? 2 : 6);
      assert.equal(field.sagittal.length, pattern === 0 ? 2 : 6);
    });
  }
  // The ask: the lines the sections trace (the authored line, and 656.2725 nm, the fake's R channel; not 600 nm), at
  // every field with a launch.
  assert.deepEqual(made.asks, [
    { lines: [0, 1], maxFieldDeg: halfField, fieldAnglesDeg: fractions.map((fraction) => halfField * fraction) },
  ]);
  // A photopic run has lines the sections trace at none: its sets, and no ask.
  const photopic = lvCurvatureRaySets(api, (await modelOf(binding, SINGLET, { lines: { kind: "photopic" } })).model);
  assert.equal(photopic.sets.length, 2 * 5);
  assert.deepEqual(photopic.asks, []);
});

test("traced as the sections trace them, the sets give the fake's foci, real-ray foci and channels to the bit", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { model } = await modelOf(binding, SINGLET);
  const [parabasal, realRay] = lvCurvatureRaySets(api, model).sets;
  const bundle = api.computeFieldCurvatureBundle(lvChiefRequest(api, model));
  const base = bundle.fieldCurvature!;
  const chromatic = bundle.chromaticFieldCurvature!;
  const last = model.state.surfaces.length - 1;
  const lastZ = model.state.z[last];
  const planeZ = lastZ + model.state.surfaces[last].d;
  assert.equal(base.imagePlaneZ, planeZ);
  // The parabasal fraction is LensVisualizer's rule: 0.01 mm over the tabs' pupil radius.
  const p = lvParabasalFraction(lvTabPupilSemiDiameter(api, model));
  assert.equal(p, 0.01 / lvTabPupilSemiDiameter(api, model));
  assert.deepEqual(lvParabasalOffsets(p), [
    { xFraction: 0, yFraction: -p },
    { xFraction: 0, yFraction: p },
    { xFraction: -p, yFraction: 0 },
    { xFraction: p, yFraction: 0 },
  ]);
  let realRayFields = 0;
  base.curveFields.forEach((field, at) => {
    const foci = (channel?: string) => {
      const rays = Array.from({ length: 5 }, (_, ray) => tabRay(api, model, parabasal, 5 * at + ray, channel)!);
      const chief = rays[4];
      const t = focus(
        rays.slice(0, 2).map((ray) => ({ c: ray.y, u: ray.uy })),
        { c: chief.y, u: chief.uy },
        lastZ,
      );
      const s = focus(
        rays.slice(2, 4).map((ray) => ({ c: ray.x, u: ray.ux })),
        { c: chief.x, u: chief.ux },
        lastZ,
      );
      return { chief, t, s };
    };
    const own = foci();
    assert.equal(field.chiefImageHeight, own.chief.y + own.chief.uy * (planeZ - lastZ), `field ${at} landing`);
    assert.equal(field.tangentialShiftMm, own.t - planeZ, `field ${at} tangential`);
    assert.equal(field.sagittalShiftMm, own.s - planeZ, `field ${at} sagittal`);
    // The real-ray fans: seven rays each (the fake's count, odd), then the chief ray; the rays that land.
    const fan = (from: number) =>
      Array.from({ length: 7 }, (_, ray) => tabRay(api, model, realRay, 15 * at + from + ray)).flatMap((ray) =>
        ray === null ? [] : [ray],
      );
    const chief = tabRay(api, model, realRay, 15 * at + 14)!;
    const [tangentialFan, sagittalFan] = [fan(0), fan(7)];
    if (tangentialFan.length < 3 || sagittalFan.length < 3) {
      assert.equal(field.diagnosticTangentialShiftMm, undefined, `field ${at} has no real-ray curve`);
    } else {
      const t = focus(
        tangentialFan.map((ray) => ({ c: ray.y, u: ray.uy })),
        { c: chief.y, u: chief.uy },
        lastZ,
      );
      const s = focus(
        sagittalFan.map((ray) => ({ c: ray.x, u: ray.ux })),
        { c: chief.x, u: chief.ux },
        lastZ,
      );
      assert.equal(field.diagnosticTangentialShiftMm, t - planeZ, `field ${at} real-ray tangential`);
      assert.equal(field.diagnosticSagittalShiftMm, s - planeZ, `field ${at} real-ray sagittal`);
      realRayFields++;
    }
    for (const shift of chromatic.curveFields[at].chromaticFieldShifts!) {
      const atChannel = foci(shift.channel);
      assert.equal(shift.tangentialShiftMm, atChannel.t - planeZ, `field ${at} ${shift.channel}`);
      assert.equal(shift.sagittalShiftMm, atChannel.s - planeZ, `field ${at} ${shift.channel}`);
    }
  });
  assert.ok(realRayFields > 0, "the fake's sections have real-ray curves");
});

test("a folded lens, a finite object and a field without a launch have no curvature sets", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const finite = await modelOf(binding, SINGLET, { state: { focus: { kind: "focusT", value: 1 } } });
  const refused = lvCurvatureRaySets(binding.api, finite.model);
  assert.deepEqual(
    [refused.sets, refused.asks, refused.problems.map((problem) => problem.split(":")[0])],
    [[], [], ["object-not-at-infinity"]],
  );
  const folded = await modelOf(binding, "zz-folded-mirror");
  assert.deepEqual(
    lvCurvatureRaySets(binding.api, folded.model).problems.map((problem) => problem.split(":")[0]),
    ["folded-path"],
  );
  binding.close();
  // Beyond 12 degrees the fake has no chief ray: the fields at 15 and 20 degrees are problems, the others kept, and
  // the ask is of the three.
  const limited = variantOf(lv, "limited", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { chiefLimitDeg: 12 },"),
  });
  const bound = await bind(t, limited);
  const made = lvCurvatureRaySets(bound.api, (await modelOf(bound, SINGLET)).model);
  assert.deepEqual(
    made.problems.map((problem) => problem.split(":")[0]),
    ["lv-no-launch", "lv-no-launch"],
  );
  assert.deepEqual(
    made.sets.map((set) => f8(set, "origins").length / 3),
    [15, 45],
  );
  assert.deepEqual(made.asks[0].fieldAnglesDeg, [0, 5, 10]);
});

test("a lens whose first surface bulges past the launch plane has no curvature set, nor an ask", async (t) => {
  const lv = freshLv(t);
  const steep = variantOf(lv, "steep", {
    "src/optics/state/runtime.ts": (text) => text.replace("constants: { rayLead: 10 }", "constants: { rayLead: 0.5 }"),
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace('{ label: "1", R: 50, d: 4, nd: 1.5, sd: 8 }', '{ label: "1", R: -9, d: 4, nd: 1.5, sd: 8 }'),
  });
  const binding = await bind(t, steep);
  const made = lvCurvatureRaySets(binding.api, (await modelOf(binding, SINGLET)).model);
  assert.deepEqual([made.sets, made.asks], [[], []]);
  assert.ok(made.problems.length > 0);
  assert.ok(
    made.problems.every((problem) => problem.startsWith("launch-behind-first-surface")),
    made.problems.join(),
  );
});
