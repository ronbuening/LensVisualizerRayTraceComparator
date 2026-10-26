// The chief sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose distortion tab, pupils
// tab and lateral-colour section have LensVisualizer's names, its launches and samples of their own. What is held here
// is which rays the case source makes for the three tabs and that, traced, they are the tabs' own: the fake's
// distortion curve, its grid, its exit pupils and its channel landings come back from them to the bit. That the
// restatement is LensVisualizer's own is test/integration/lv/chiefRays.test.ts, against the real one.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { CHIEF_PATTERNS, lvChiefRaySets, lvMeridionalLaunch } from "../../../src/engines/lv/chiefRaySets.ts";
import { lvChiefGeometry, lvChiefRequest, lvDistortionReference } from "../../../src/engines/lv/chiefSetup.ts";
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
 * A ray of a set as the fake's tabs read it: traced with their options (clear apertures, a stop radius, stop on a
 * clip, a unit direction; the authored indices, or a channel's), its height carried to the vertex plane of the
 * surface it ended on and its slopes taken as the fake takes them. Null for a ray that did not arrive.
 */
function tabRay(api: LvApi, model: LvCaseModel, set: RaysTraceSpec, ray: number, stopSD?: number, channel?: string) {
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
    meridional: toward[1] * (1 / toward[2]),
    uy: toward[1] / toward[2],
  };
}

test("the chief sets are the four patterns of the three tabs, the same rays at every line, and their requests", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, SINGLET, { lines: { kind: "photopic" } });
  const lines = opticalCase.conditions.lines.length;
  assert.ok(lines > 1);
  const made = lvChiefRaySets(api, model);
  assert.deepEqual(made.problems, []);
  assert.deepEqual(CHIEF_PATTERNS, ["distortion-curve", "distortion-grid", "pupils", "lateral-colour"]);
  assert.equal(made.sets.length, 4 * lines);
  made.sets.forEach((set, at) => {
    assert.equal(set.line, at % lines);
    const pattern = Math.floor(at / lines);
    // Every ray has the weight 1; a distortion set names its probe, the first ray.
    assert.deepEqual(
      [...f8(set, "weights")],
      Array.from({ length: f8(set, "weights").length }, () => 1),
    );
    assert.deepEqual(set.groups, pattern < 2 ? { chiefIndex: 0 } : undefined);
    assert.deepEqual(set.origins, made.sets[pattern * lines].origins, "the same rays at every line");
  });
  // The fake's half field is 20 degrees; its curve plots 4 samples after the axis, at even angles; its pupils tab 4
  // fields after the axis; its lateral-colour section the axis, half the field and the edge.
  assert.deepEqual(made.asks, [
    { kind: "distortion", lines: [0], maxFieldDeg: 20, fieldAnglesDeg: [5, 10, 15, 20] },
    { kind: "pupils", lines: [0], maxFieldDeg: 20, fieldAnglesDeg: [5, 10, 15, 20] },
    {
      kind: "lateral-colour",
      lines: Array.from({ length: lines }, (_unused, line) => line),
      maxFieldDeg: 20,
      fieldAnglesDeg: [0, 10, 20],
    },
  ]);
  // The curve: the probe, the edge, and the four samples.
  assert.equal(f8(made.sets[0], "origins").length / 3, 6);
  // A meridional launch: `rayLead` (10 mm) ahead of the first vertex, along (0, u, 1) made a unit vector, and the
  // direction of the slope 0 along the axis.
  const firstZ = model.state.z[0];
  const length = Math.sqrt(0.25 * 0.25 + 1);
  assert.deepEqual(lvMeridionalLaunch(api, model, 1.5, -0.25), {
    origin: [0, 1.5 + 0.25 * 10, firstZ - 10],
    direction: [0, -0.25 / length, 1 / length],
  });
  assert.deepEqual(lvMeridionalLaunch(api, model, 0, -0), { origin: [0, 0, firstZ - 10], direction: [0, 0, 1] });
});

test("traced as the tabs trace them, the sets give the fake's curve, grid, exit pupils and channels to the bit", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { model } = await modelOf(binding, SINGLET);
  const [curveSet, gridSet, pupilSet, lateralSet] = lvChiefRaySets(api, model).sets;
  const request = lvChiefRequest(api, model);
  const geometry = lvChiefGeometry(api, model)!;
  const reference = lvDistortionReference(api, model, geometry)!;
  const last = model.state.surfaces.length - 1;
  const transfer = model.state.surfaces[last].d;
  const landing = (set: RaysTraceSpec, ray: number) => {
    const traced = tabRay(api, model, set, ray)!;
    return traced.y + traced.meridional * transfer;
  };
  // The probe scales the reference; each sample of the fake's curve is its chief ray's landing, its ideal height the
  // scale times the tangent, negated.
  assert.equal(landing(curveSet, 0), reference.probeImageHeight);
  const curve = api.computeDistortionCurve(request);
  curve.samples.slice(1).forEach((sample, at) => {
    assert.equal(landing(curveSet, 2 + at), sample.realHeight, `sample ${at + 1}`);
    const ideal = -(reference.projectionReference.focalScaleMm * Math.tan((sample.fieldAngleDeg * Math.PI) / 180));
    assert.equal(sample.idealHeight, ideal);
  });
  // The grid: every point inside the image circle, in the fake's order, after the probe.
  const grid = api.computeDistortionFieldGrid(request);
  let ray = 1;
  for (const line of grid.lines) {
    for (const point of line.points) {
      if (!point.insideImageCircle) continue;
      const traced = tabRay(api, model, gridSet, ray++, model.exported.conditions.stopSemiDiameter)!;
      const image = api.skewImagePlaneIntercept(
        traced.x,
        traced.y,
        traced.ux,
        traced.uy,
        model.state.z[last],
        model.state.z[last] + transfer,
      )!;
      assert.deepEqual([point.tracedX, point.tracedY], [image.x, -image.y], `grid ray ${ray - 1}`);
    }
  }
  assert.equal(ray, f8(gridSet, "origins").length / 3);
  // The pupils tab: each field's exit pupil, the crossing of its chief ray's exit.
  const pupils = api.computeBothPupilAberrationProfiles(request);
  pupils.xp.samples.slice(1).forEach((sample, at) => {
    const traced = tabRay(api, model, pupilSet, at)!;
    assert.equal(sample.xpZRelLastSurf, -traced.y / traced.meridional, `exit pupil ${at + 1}`);
  });
  // The lateral-colour section: each field's chief ray at every channel.
  const lateral = api.computeLateralColorCurve(request)!;
  lateral.fields.forEach((field, at) => {
    for (const sample of field.samples) {
      const traced = tabRay(api, model, lateralSet, at, model.exported.conditions.stopSemiDiameter, sample.channel)!;
      const image = api.skewImagePlaneIntercept(
        traced.x,
        traced.y,
        traced.ux,
        traced.uy,
        model.state.z[last],
        model.state.imgZ,
      )!;
      assert.equal(sample.imageHeightMm, image.y, `field ${at} ${sample.channel}`);
    }
  });
});

test("a folded lens and a finite object have no chief sets", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const finite = await modelOf(binding, SINGLET, { state: { focus: { kind: "focusT", value: 1 } } });
  const refused = lvChiefRaySets(binding.api, finite.model);
  assert.deepEqual(
    [refused.sets, refused.asks, refused.problems.map((problem) => problem.split(":")[0])],
    [[], [], ["object-not-at-infinity"]],
  );
  const folded = await modelOf(binding, "zz-folded-mirror");
  assert.deepEqual(
    lvChiefRaySets(binding.api, folded.model).problems.map((problem) => problem.split(":")[0]),
    ["folded-path"],
  );
});

test("a fisheye lens has no distortion sets, and a field launched from a bounding sphere is a problem of its own", async (t) => {
  const lv = freshLv(t);
  const fisheye = variantOf(lv, "fisheye", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", 'focusTravel: 5,\n  projection: { kind: "fisheye-equisolid" },'),
  });
  const binding = await bind(t, fisheye);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvChiefRaySets(binding.api, model);
  assert.deepEqual(
    made.problems.map((problem) => problem.split(":")[0]),
    ["lv-fisheye-projection"],
  );
  assert.deepEqual(
    made.asks.map((ask) => ask.kind),
    ["pupils", "lateral-colour"],
  );
  binding.close();
  const vector = variantOf(lv, "vector", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: 12 },"),
  });
  const bound = await bind(t, vector);
  const far = lvChiefRaySets(bound.api, (await modelOf(bound, SINGLET)).model);
  // Beyond 12 degrees the fake launches from a bounding sphere: the curve's edge (and the fake's curve plots no sample
  // beyond it, its own chief ray having no landing there), two fields of the pupils tab and the lateral colour's edge
  // are each a problem, the other rays kept; the grid, which needs its edge to land, has none at all.
  assert.deepEqual(
    far.problems.map((problem) => problem.split(":")[0]),
    ["lv-vector-launch", "lv-no-distortion-grid", "lv-vector-launch", "lv-vector-launch", "lv-vector-launch"],
  );
  assert.deepEqual(
    far.sets.map((set) => f8(set, "origins").length / 3),
    [3, 2, 2],
  );
});

test("a lens whose first surface bulges past the launch plane has no chief set of any pattern, nor requests", async (t) => {
  const lv = freshLv(t);
  // A first surface of radius -9 mm curves toward the object, nearly 5 mm ahead of its vertex at its rim of 8 mm,
  // and a lead of 0.5 mm starts every ray behind it.
  const steep = variantOf(lv, "steep", {
    "src/optics/state/runtime.ts": (text) => text.replace("constants: { rayLead: 10 }", "constants: { rayLead: 0.5 }"),
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace('{ label: "1", R: 50, d: 4, nd: 1.5, sd: 8 }', '{ label: "1", R: -9, d: 4, nd: 1.5, sd: 8 }'),
  });
  const binding = await bind(t, steep);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvChiefRaySets(binding.api, model);
  assert.deepEqual(made.sets, []);
  assert.deepEqual(made.asks, []);
  assert.ok(made.problems.length > 0);
  assert.ok(
    made.problems.every((problem) => problem.startsWith("launch-behind-first-surface")),
    made.problems.join(),
  );
});

test("a grid whose lines have no point it traces is no set: the probe alone has no distortion", async (t) => {
  const lv = freshLv(t);
  const empty = variantOf(lv, "empty-grid", {
    "src/optics/analysis/chief.ts": (text) =>
      text.replace("const insideImageCircle = radiusNormalized <= 1 + 1e-9;", "const insideImageCircle = false;"),
  });
  const binding = await bind(t, empty);
  const { model } = await modelOf(binding, SINGLET);
  const grid = binding.api.computeDistortionFieldGrid(lvChiefRequest(binding.api, model));
  assert.ok(grid.lines.length > 0, "the grid has lines");
  const made = lvChiefRaySets(binding.api, model);
  assert.deepEqual(
    made.problems.map((problem) => problem.split(":")[0]),
    ["lv-no-distortion-grid"],
  );
  // The curve, the pupils and the lateral colour keep their sets; no set is of the probe alone.
  assert.equal(made.sets.length, 3);
  assert.ok(made.sets.every((set) => f8(set, "origins").length / 3 > 1));
});
