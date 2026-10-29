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
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
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

test("a fan sample LensVisualizer could not aim holds the chief ray at weight 0; a blocked one keeps its ray", async (t) => {
  const lv = freshLv(t);
  // The fake aims nothing beyond 0.95 of the stop (each fan's ends) and blocks what is beyond 0.5 (its samples at 2/3)
  // at the first surface.
  const aimed = variantOf(lv, "aimed", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  aim: { unaimedBeyond: 0.95, blockedBeyond: 0.5 },"),
  });
  const binding = await bind(t, aimed);
  const { opticalCase, model } = await modelOf(binding, SINGLET);
  const made = lvCurvatureRaySets(binding.api, model);
  assert.deepEqual(made.problems, []);
  const set = made.sets[opticalCase.conditions.lines.length];
  const [origins, directions, weights] = [f8(set, "origins"), f8(set, "directions"), f8(set, "weights")];
  const ray = (values: Float64Array, at: number) => [...values.slice(3 * at, 3 * at + 3)];
  const far = 4 * model.state.surfaces[0].sd;
  const fractions = [-1, -2 / 3, -1 / 3, 0, 1 / 3, 2 / 3, 1];
  for (let field = 0; field < weights.length / 15; field++) {
    const chief = 15 * field + 14;
    assert.equal(weights[chief], 1);
    for (const [half, axis] of [
      [0, "tangential"],
      [1, "sagittal"],
    ] as const) {
      fractions.forEach((fraction, sample) => {
        const at = 15 * field + 7 * half + sample;
        if (Math.abs(fraction) > 0.95) {
          // Unaimed: the chief ray, at weight 0, never traced by the sections.
          assert.deepEqual(
            [ray(origins, at), ray(directions, at), weights[at]],
            [ray(origins, chief), ray(directions, chief), 0],
          );
          return;
        }
        assert.equal(weights[at], 1, `${axis} sample ${sample}`);
        assert.deepEqual(ray(directions, at), ray(directions, chief));
        if (Math.abs(fraction) > 0.5) {
          // Blocked: LensVisualizer's blocking ray, far out along its fan (the fake's, 4 clear radii from the chief
          // ray's start, in the fan's own coordinate alone).
          const [x, y] = ray(origins, at);
          const [x0, y0] = ray(origins, chief);
          const [along, across] = axis === "tangential" ? [y - y0, x - x0] : [x - x0, y - y0];
          assert.equal(across, 0, `${axis} sample ${sample}`);
          assert.ok(Math.abs(along - Math.sign(fraction) * far) <= 1e-12 * far, `${axis} sample ${sample}: ${along}`);
        }
      });
    }
  }
  // The comparator reads the held samples as in neither fan, and the fans' centres too.
  const fields = curvatureFieldsOf(set, weights.length);
  assert.ok(Array.isArray(fields));
  assert.deepEqual(fields[1], { chief: 29, tangential: [16, 17, 19, 20], sagittal: [23, 24, 26, 27] });
});

test("a field whose fans LensVisualizer aims no common stop-centre ray of, or not on its meridian, has no real-ray block", async (t) => {
  const lv = freshLv(t);
  const launch = "src/optics/analysis/pupils/aimedPupil.ts";
  const aimedLine =
    'return { ...base, status: "aimed", reason: null, ...ray(xFraction * pupil, yChief + yFraction * pupil + lift) };';
  const aimedAs = (x: string, more = "") =>
    `return { ...base, status: "aimed", reason: null, ...ray(${x}, yChief + yFraction * pupil + lift)${more} };`;
  for (const [name, edits, code] of [
    // No stop-centre ray: the fake aims nothing, not even the stop's centre.
    [
      "unaimed",
      {
        "src/lens-data/acme/AcmeSinglet50.data.ts": (text: string) =>
          text.replace("focusTravel: 5,", "focusTravel: 5,\n  aim: { unaimedBeyond: -1 },"),
      },
      "lv-chief-unaimed",
    ],
    // The sagittal fan's launch solves its stop-centre ray elsewhere than the tangential fan's.
    [
      "differs",
      {
        [launch]: (text: string) =>
          text.replace(
            "chief: toRay(-1, 0, 0, 0),",
            "chief: toRay(-1, samples.some((sample) => sample.xFraction !== 0) ? 2 ** -20 : 0, 0, 0),",
          ),
      },
      "lv-chief-differs",
    ],
    // The sagittal fan's launch turns its stop-centre ray.
    [
      "differs-turned",
      {
        [launch]: (text: string) =>
          text.replace(
            "chief: toRay(-1, 0, 0, 0),",
            "chief: { ...toRay(-1, 0, 0, 0), ...(samples.some((sample) => sample.xFraction !== 0) ? { direction: [direction[0], direction[1] + 2 ** -40, direction[2]] as Vec3 } : {}) },",
          ),
      },
      "lv-chief-differs",
    ],
    // A tangential sample starts off the chief ray along x.
    [
      "tangential-off",
      {
        [launch]: (text: string) =>
          text.replace(aimedLine, aimedAs("xFraction * pupil + (xFraction === 0 && yFraction !== 0 ? 2 ** -20 : 0)")),
      },
      "lv-fan-off-meridian",
    ],
    // A sagittal sample starts on the chief ray's meridian.
    [
      "sagittal-on",
      { [launch]: (text: string) => text.replace(aimedLine, aimedAs("yFraction === 0 ? 0 : xFraction * pupil")) },
      "lv-fan-off-meridian",
    ],
    // A sample is launched along another direction than the chief ray.
    [
      "turned",
      {
        [launch]: (text: string) =>
          text.replace(
            aimedLine,
            aimedAs(
              "xFraction * pupil",
              ", ...(index < 0 ? {} : { direction: [direction[0], direction[1] + 2 ** -40, direction[2]] as Vec3 })",
            ),
          ),
      },
      "lv-fan-off-meridian",
    ],
  ] as const) {
    const variant = variantOf(lv, name, edits);
    const binding = await loadLvBinding(variant);
    try {
      const { opticalCase, model } = await modelOf(binding, SINGLET);
      const made = lvCurvatureRaySets(binding.api, model);
      // Every field keeps its parabasal block and the ask; none has a real-ray block, each a coded problem.
      assert.deepEqual(
        made.problems.map((problem) => problem.split(":")[0]),
        Array(5).fill(code),
        name,
      );
      assert.equal(made.sets.length, opticalCase.conditions.lines.length, name);
      assert.equal(made.asks[0].fieldAnglesDeg.length, 5, name);
    } finally {
      binding.close();
    }
  }
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
