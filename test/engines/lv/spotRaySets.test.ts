// The spot sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose coma and bokeh tabs have
// LensVisualizer's names, its skew launch and patterns of their own. What is held here is which rays the case
// source makes for the tabs and that, traced, they are the tabs' own: the fake's coma point cloud, fans and bokeh
// tiles come back from them to the bit. That the restatement is LensVisualizer's own is
// test/integration/lv/spotRays.test.ts, against the real one.
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
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvSkewLaunch, lvSpotPatterns, lvSpotRaySets, lvSpotSetup } from "../../../src/engines/lv/spotRaySets.ts";
import type { LvApi, LvVec3 } from "../../../src/engines/lv/types.ts";
import { spotNativeQuantity } from "../../../src/quantities/spotNative.ts";
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

/** The rays of a set, decoded: origins, directions and weights. */
function raysOf(set: RaysTraceSpec): { origins: Float64Array; directions: Float64Array; weights: Float64Array } {
  return {
    origins: decodeNdArray(set.origins).values as Float64Array,
    directions: decodeNdArray(set.directions).values as Float64Array,
    weights: decodeNdArray(set.weights).values as Float64Array,
  };
}

/**
 * Where a ray of a set lands on a plane as the fake's tabs land it: traced with the options of a skew trace, carried
 * to the last vertex plane, and on by its slopes (the fake's `skewOn` and `skewImagePlaneIntercept`). Null for a ray
 * an aperture stopped.
 */
function landing(
  api: LvApi,
  model: LvCaseModel,
  origin: LvVec3,
  direction: LvVec3,
  planeZ: number,
): { x: number; y: number } | null {
  const { state, exported } = model;
  const options = {
    checkSemiDiameter: true,
    stopSemiDiameter: exported.conditions.stopSemiDiameter,
    stopOnClip: true,
    directionNormalized: true,
  };
  const trace = api.traceEngineRay(state, { origin, direction }, options);
  if (trace.status !== "ok") return null;
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const z = state.z[trace.terminalSurfaceIndex];
  const x = api.projectCoordinateToZ(point[0], point[2], toward[0], toward[2], z);
  const y = api.projectCoordinateToZ(point[1], point[2], toward[1], toward[2], z);
  const last = state.z[state.z.length - 1];
  return api.skewImagePlaneIntercept(x, y, toward[0] / toward[2], toward[1] / toward[2], last, planeZ);
}

function vec(values: Float64Array, ray: number): LvVec3 {
  return [values[3 * ray], values[3 * ray + 1], values[3 * ray + 2]];
}

test("the spot sets are the tabs' patterns, field by field and line by line, each with its chief ray last", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { opticalCase, model } = await modelOf(binding, SINGLET, { lines: { kind: "photopic" } });
  const { api } = binding;
  const lines = opticalCase.conditions.lines.length;
  assert.ok(lines > 1);
  const made = lvSpotRaySets(api, model);
  assert.deepEqual(made.problems, []);
  // The fake's coma point cloud at 0, 0.5 and 0.9 of its half field of 20 degrees, rings 1, 4, 8; its two fans of
  // seven samples at its authored 0.7; its bokeh tiles at 0 and 0.3, rings 1, 6, 10: seven sets at every line.
  const fields = [0, 10, 18, 14, 14, 0, 6];
  const counts = [14, 14, 14, 8, 8, 18, 18];
  assert.equal(made.sets.length, fields.length * lines);
  for (const [pattern, angleDeg] of fields.entries()) {
    for (let line = 0; line < lines; line++) {
      const set = made.sets[pattern * lines + line];
      assert.equal(set.line, line);
      assert.deepEqual(set.groups, { field: { angleDeg }, chiefIndex: counts[pattern] - 1 });
      const { origins, directions, weights } = raysOf(set);
      assert.equal(weights.length, counts[pattern]);
      // The rays are the same at every line; the chief ray is a reference and weighs nothing.
      assert.equal(set.origins.$nd.sha256, made.sets[pattern * lines].origins.$nd.sha256);
      assert.equal(set.directions.$nd.sha256, made.sets[pattern * lines].directions.$nd.sha256);
      assert.equal(weights[counts[pattern] - 1], 0);
      for (let ray = 0; ray < weights.length; ray++) {
        assert.ok(origins[3 * ray + 2] < 0, "every ray starts in front of the first surface");
        assert.equal(Math.hypot(...vec(directions, ray)), 1);
      }
      // A point of the cloud weighs its area, a sample of a fan 1, a ray of a tile its area and its transmission.
      const expected = pattern < 3 ? 1 / 13 : pattern < 5 ? 1 : 1 / 17;
      assert.ok(
        [...weights.subarray(0, -1)].every((weight) => weight === expected),
        `pattern ${pattern}`,
      );
    }
  }
  // The engines' own spot requests of the same patterns, at the reference line, with each field's angle.
  assert.deepEqual(
    made.asks.map(({ spec, fieldAnglesDeg }) => [spec.pupil.kind, spec.fields.values, fieldAnglesDeg]),
    [
      ["rings", [0, 0.5, 0.9], [0, 10, 18]],
      ["fan", [0.7], [14]],
      ["fan", [0.7], [14]],
      ["rings", [0, 0.3], [0, 6]],
    ],
  );
  for (const { spec } of made.asks) {
    assert.equal(spec.line, 0);
    assert.deepEqual(spotNativeQuantity.validateSpec(spec), []);
  }
  // The fake's fan count of 6 is made odd, as LensVisualizer makes it, and the request states the fan made.
  assert.deepEqual(
    lvSpotPatterns(api, lvSpotSetup(api, model)).map(({ pupil }) => (pupil.kind === "fan" ? pupil.samples : null)),
    [null, 7, 7, null],
  );
});

test("traced as the tabs trace them, the sets give the fake's coma cloud, its fans and its bokeh tiles to the bit", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { model } = await modelOf(binding, SINGLET);
  const { api } = binding;
  const setup = lvSpotSetup(api, model);
  const request = api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: setup.pupilSemiDiameterMm,
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: setup.fieldGeometry,
  });
  const coma = api.computeComaAnalysis(request);
  const made = lvSpotRaySets(api, model);
  const plane = model.state.imgZ;
  // The point cloud: chief-relative points, their weighted centroid and RMS radius by the fake's own sums.
  for (const [index, field] of (coma.pointCloudPreview?.fields ?? []).entries()) {
    const { origins, directions, weights } = raysOf(made.sets[index]);
    const chief = landing(api, model, vec(origins, weights.length - 1), vec(directions, weights.length - 1), plane);
    assert.ok(chief !== null);
    const points: { t: number; s: number; w: number }[] = [];
    for (let ray = 0; ray < weights.length - 1; ray++) {
      const point = landing(api, model, vec(origins, ray), vec(directions, ray), plane);
      if (point !== null) points.push({ t: point.y - chief.y, s: point.x - chief.x, w: weights[ray] });
    }
    const total = points.reduce((sum, point) => sum + point.w, 0);
    const ct = points.reduce((sum, point) => sum + point.t * point.w, 0) / total;
    const cs = points.reduce((sum, point) => sum + point.s * point.w, 0) / total;
    const rms = Math.sqrt(points.reduce((sum, p) => sum + p.w * ((p.t - ct) ** 2 + (p.s - cs) ** 2), 0) / total);
    assert.equal(field.chiefIntercept, chief.y);
    assert.equal(field.validSampleCount, points.length);
    assert.deepEqual(
      [field.centroidTangentialImageHeight, field.centroidSagittalImageHeight, field.rmsRadiusMm],
      [ct, cs, rms],
    );
  }
  // The two fans: each sample's error relative to the chief ray, along its axis.
  for (const [set, fan, axis] of [
    [made.sets[3], coma.meridionalComa, "y"],
    [made.sets[4], coma.sagittalComa, "x"],
  ] as const) {
    assert.ok(fan !== null);
    const { origins, directions, weights } = raysOf(set);
    const chief = landing(api, model, vec(origins, weights.length - 1), vec(directions, weights.length - 1), plane);
    assert.ok(chief !== null);
    fan.samples.forEach((sample, ray) => {
      const point = landing(api, model, vec(origins, ray), vec(directions, ray), plane);
      const relative = axis === "y" ? sample.relativeImageHeight : sample.relativeImageX;
      assert.equal(relative, point === null ? null : point[axis] - chief[axis]);
    });
  }
  // A bokeh tile on the plane of the case.
  const tile = api.computeBokehFieldFootprint(request, 0.3, plane);
  const { origins, directions, weights } = raysOf(made.sets[6]);
  const chief = landing(api, model, vec(origins, weights.length - 1), vec(directions, weights.length - 1), plane);
  assert.ok(chief !== null && tile !== null);
  const passed = Array.from({ length: weights.length - 1 }, (_unused, ray) => ({
    point: landing(api, model, vec(origins, ray), vec(directions, ray), plane),
    w: weights[ray],
  })).filter(({ point }) => point !== null);
  assert.equal(tile.passedRays, passed.length);
  // The tile's weights are the set's: its area times its transmission, which the fake's glass leaves at 1.
  const total = passed.reduce((sum, { w }) => sum + w, 0);
  const ct = passed.reduce((sum, { point, w }) => sum + (point!.y - chief.y) * w, 0) / total;
  assert.equal(tile.centroidTangential, ct);
});

test("a field the tabs have no launch for is a coded problem, and the other fields keep theirs", async (t) => {
  const lv = freshLv(t);
  // A chief-ray limit of 15 degrees takes away the coma cloud's 18 degrees, and a vector launch beyond 12 degrees
  // the fans' 14; an authored off-axis field of 0 puts the fans on the axis, where LensVisualizer draws none.
  const narrow = variantOf(lv, "narrow", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { chiefLimitDeg: 15, vectorBeyondDeg: 12 },"),
  });
  const binding = await bind(t, narrow);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvSpotRaySets(binding.api, model);
  assert.deepEqual(
    made.problems.map((problem) => problem.split(":")[0]),
    ["lv-no-launch", "lv-vector-launch", "lv-vector-launch"],
  );
  assert.deepEqual(
    made.sets.map((set) => set.groups?.field?.angleDeg),
    [0, 10, 0, 6],
  );
  // The requests of the engines' own spots are made all the same: what a tab has no launch for, it says itself.
  assert.equal(made.asks.length, 4);
});

test("an on-axis detail field, a folded lens and a finite object: no fans, and no sets at all", async (t) => {
  const lv = freshLv(t);
  const axial = variantOf(lv, "axial", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  offAxisFieldFrac: 0,"),
  });
  const binding = await bind(t, axial);
  const { model } = await modelOf(binding, SINGLET);
  assert.deepEqual(
    lvSpotRaySets(binding.api, model).problems.map((problem) => problem.split(":")[0]),
    ["lv-no-fan-on-axis", "lv-no-fan-on-axis"],
  );
  const finite = await modelOf(binding, SINGLET, { state: { focus: { kind: "focusT", value: 1 } } });
  const refused = lvSpotRaySets(binding.api, finite.model);
  assert.deepEqual(
    [refused.sets, refused.asks, refused.problems.map((p) => p.split(":")[0])],
    [[], [], ["object-not-at-infinity"]],
  );
  const folded = await modelOf(binding, "zz-folded-mirror");
  assert.deepEqual(
    lvSpotRaySets(binding.api, folded.model).problems.map((problem) => problem.split(":")[0]),
    ["folded-path"],
  );
});

test("a ray of a set starts where LensVisualizer's skew launch starts it: rayLead ahead of the first vertex plane", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { model } = await modelOf(binding, SINGLET);
  // The fake's lead is 10 mm. A ray crossing the first vertex plane at (1, 2) with slopes (0, -0.25).
  const { origin, direction } = lvSkewLaunch(binding.api, model, 1, 2, 0, -0.25);
  assert.deepEqual(origin, [1, 2 + 0.25 * 10, -10]);
  const length = Math.sqrt(1 + 0.25 ** 2);
  assert.deepEqual(direction, [0 / length, -0.25 / length, 1 / length]);
});

test("a sample the tabs could not aim holds the chief ray at weight 0; a blocked one keeps LensVisualizer's ray", async (t) => {
  const lv = freshLv(t);
  // The fake aims nothing beyond 0.95 of the stop (the rings' outer ring, the fans' ends) and blocks what is beyond 0.5
  // (the fans' samples at 2/3) at the first surface.
  const aimed = variantOf(lv, "aimed", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  aim: { unaimedBeyond: 0.95, blockedBeyond: 0.5 },"),
  });
  const binding = await bind(t, aimed);
  const { model } = await modelOf(binding, SINGLET);
  const { api } = binding;
  const made = lvSpotRaySets(api, model);
  assert.deepEqual(made.problems, []);
  const setup = lvSpotSetup(api, model);
  const request = api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: setup.pupilSemiDiameterMm,
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: setup.fieldGeometry,
  });
  const coma = api.computeComaAnalysis(request);
  for (const [set, fan] of [
    [made.sets[3], coma.meridionalComa],
    [made.sets[4], coma.sagittalComa],
  ] as const) {
    const { origins, directions, weights } = raysOf(set);
    const chief = weights.length - 1;
    const fractions = [-1, -2 / 3, -1 / 3, 0, 1 / 3, 2 / 3, 1];
    const landed = fractions.map((fraction, ray) => {
      if (Math.abs(fraction) > 0.95) {
        // Unaimed: the chief ray, at weight 0, never traced by the tab.
        assert.deepEqual(vec(origins, ray), vec(origins, chief));
        assert.deepEqual(vec(directions, ray), vec(directions, chief));
        assert.equal(weights[ray], 0);
        return false;
      }
      assert.equal(weights[ray], 1);
      // A blocked sample is LensVisualizer's blocking ray, which the trace stops.
      const point = landing(api, model, vec(origins, ray), vec(directions, ray), model.state.imgZ);
      assert.equal(point === null, Math.abs(fraction) > 0.5, `sample ${ray}`);
      return point !== null;
    });
    assert.ok(fan !== null);
    assert.equal(fan.validSampleCount, landed.filter(Boolean).length);
  }
});
