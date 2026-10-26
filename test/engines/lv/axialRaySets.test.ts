// The axial sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose spherical-aberration and
// axial-colour sections have LensVisualizer's names, its meridional launch and zones of their own. What is held here
// is which rays the case source makes for the two sections and that, traced, they are the sections' own: the fake's
// intercepts, best focus, profile and per-channel focus come back from them to the bit. That the restatement is
// LensVisualizer's own is test/integration/lv/axialRays.test.ts, against the real one.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { lvAxialLaunch, lvAxialRaySets, lvAxialZones } from "../../../src/engines/lv/axialRaySets.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvTabPupilSemiDiameter } from "../../../src/engines/lv/spotSetup.ts";
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
 * A ray of a set as the sections read it: traced with their options (clear apertures, the stop radius, stop on a
 * clip, a unit direction; the authored indices, or a channel's), its height carried to the last vertex plane and its
 * slope taken as LensVisualizer takes it (`finalizeTraceResult`). Null for a ray that did not arrive.
 */
function sectionRay(api: LvApi, model: LvCaseModel, set: RaysTraceSpec, ray: number, channel?: string) {
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
      stopOnClip: true,
      directionNormalized: true,
      ...(channel === undefined ? {} : { indexAtSurface: (at: number) => dispersion[at]!.indexAt(channel) }),
    },
  );
  if (trace.status !== "ok") return null;
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const last = state.z[state.z.length - 1];
  const y = api.projectCoordinateToZ(point[1], point[2], toward[1], toward[2], last);
  const u = toward[1] * (1 / toward[2]);
  return { y, u, intercept: last - y / u };
}

test("the axial sets are the two sections' zones in mirror pairs, the same rays at every line", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, SINGLET, { lines: { kind: "photopic" } });
  const lines = opticalCase.conditions.lines.length;
  assert.ok(lines > 1);
  const made = lvAxialRaySets(api, model);
  assert.deepEqual(made.problems, []);
  // The fake's zones: a profile of 0.1, 0.25, 0.5, 0.75 and 0.9; the near-axis zone 0.25; marginal candidates and
  // axial-colour candidates 0.9, 0.75, 0.5.
  assert.deepEqual(lvAxialZones(api), {
    nearAxis: 0.25,
    marginal: [0.9, 0.75, 0.5],
    profile: [0.1, 0.25, 0.5, 0.75, 0.9],
    colour: [0.9, 0.75, 0.5],
  });
  const patterns = [
    [0.1, 0.25, 0.5, 0.75, 0.9],
    [0.25, 0.9, 0.75, 0.5],
  ];
  assert.equal(made.sets.length, 2 * lines);
  const pupil = lvTabPupilSemiDiameter(api, model);
  const firstZ = model.state.z[0];
  made.sets.forEach((set, at) => {
    const pattern = patterns[Math.floor(at / lines)];
    assert.equal(set.line, at % lines);
    assert.deepEqual(set.groups, { field: { angleDeg: 0 } });
    const heights = pattern.flatMap((fraction) => [fraction * pupil, -fraction * pupil]);
    // Each ray starts the fake's lead of 10 mm ahead of the first vertex plane, at its height, along the axis.
    assert.deepEqual(
      [...f8(set, "origins")],
      heights.flatMap((y) => [0, y, firstZ - 10]),
    );
    assert.deepEqual(
      [...f8(set, "directions")],
      heights.flatMap(() => [0, 0, 1]),
    );
    assert.deepEqual(
      [...f8(set, "weights")],
      heights.map(() => 1),
    );
  });
  assert.deepEqual(made.asks, [
    { kind: "spherical", lines: [0], nearAxis: 0.25, marginal: [0.9, 0.75, 0.5], profile: [0.1, 0.25, 0.5, 0.75, 0.9] },
    { kind: "colour", lines: Array.from({ length: lines }, (_unused, line) => line), marginal: [0.9, 0.75, 0.5] },
  ]);
  // The launch of a height: LensVisualizer's meridional launch with the slope 0.
  assert.deepEqual(lvAxialLaunch(model, -2.5), { origin: [0, -2.5, firstZ - 10], direction: [0, 0, 1] });
});

test("traced as the sections trace them, the sets give the fake's intercepts, focus and channels to the bit", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { model } = await modelOf(binding, SINGLET);
  const [profile, marginal] = lvAxialRaySets(api, model).sets;
  const request = api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: lvTabPupilSemiDiameter(api, model),
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
  });
  const result = api.computeSphericalAberration(request);
  assert.ok(result !== null);
  const last = model.state.z[model.state.z.length - 1];
  // The near-axis pair is the marginal set's first pair; the marginal candidates follow in the order tried.
  const pair = (ray: number) => {
    const [plus, minus] = [sectionRay(api, model, marginal, ray), sectionRay(api, model, marginal, ray + 1)];
    return plus === null || minus === null ? null : (plus.intercept + minus.intercept) / 2;
  };
  assert.equal(pair(0), result.nearAxisRealIntercept);
  const candidates = [2, 4, 6].map(pair);
  const first = candidates.findIndex((intercept) => intercept !== null);
  assert.equal(result.marginalFraction, [0.9, 0.75, 0.5][first]);
  assert.equal(candidates[first], result.marginalRealIntercept);
  // The best focus and the profile, of the profile's pairs, in the fake's sums and order.
  const hits = Array.from({ length: 10 }, (_unused, ray) => sectionRay(api, model, profile, ray));
  const taken = hits.flatMap((hit, ray) => (hit !== null && hits[ray ^ 1] !== null ? [hit] : []));
  const denom = taken.reduce((sum, hit) => sum + hit.u * hit.u, 0);
  const numer = taken.reduce((sum, hit) => sum + hit.u * hit.u * last - hit.y * hit.u, 0);
  const focus = numer / denom;
  assert.equal(focus, result.bestFocusZ);
  const at = (hit: { y: number; u: number }) => hit.y + hit.u * (focus - last);
  assert.equal(Math.sqrt(taken.reduce((sum, hit) => sum + at(hit) ** 2, 0) / taken.length), result.bestFocusRmsMm);
  const reference = at(hits[2]!);
  assert.deepEqual(
    api.computeSAProfile(request).map((point) => point.transverseSaMm),
    [0, 2, 4, 6, 8].flatMap((ray) => (hits[ray] === null ? [] : [at(hits[ray]!) - reference])),
  );
  // The axial colour: the marginal candidates' plus rays at each channel, the first that arrives at two.
  const colour = api.computeLongitudinalChromaticFocus(request);
  assert.ok(colour !== null);
  const channels = ["R", "G", "B", "V"];
  const chosen = [2, 4, 6].find(
    (ray) => channels.filter((channel) => sectionRay(api, model, marginal, ray, channel) !== null).length >= 2,
  )!;
  assert.equal(colour.marginalFraction, [0.9, 0.75, 0.5][(chosen - 2) / 2]);
  colour.samples.forEach((sample) => {
    const traced = sectionRay(api, model, marginal, chosen, sample.channel);
    assert.equal(sample.focusZ, traced?.intercept ?? null, sample.channel);
  });
});

test("a folded lens, a finite object and a launch behind the first surface have no axial sets", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const finite = await modelOf(binding, SINGLET, { state: { focus: { kind: "focusT", value: 1 } } });
  const refused = lvAxialRaySets(binding.api, finite.model);
  assert.deepEqual(
    [refused.sets, refused.asks, refused.problems.map((problem) => problem.split(":")[0])],
    [[], [], ["object-not-at-infinity"]],
  );
  const folded = await modelOf(binding, "zz-folded-mirror");
  assert.deepEqual(
    lvAxialRaySets(binding.api, folded.model).problems.map((problem) => problem.split(":")[0]),
    ["folded-path"],
  );
});

test("a lens whose first surface bulges past the launch plane has no axial sets", async (t) => {
  const lv = freshLv(t);
  // A first surface of radius -9 mm curves toward the object, nearly 5 mm ahead of its vertex at its rim of 8 mm,
  // and a lead of 0.5 mm starts the outer rays behind it.
  const steep = variantOf(lv, "steep", {
    "src/optics/state/runtime.ts": (text) => text.replace("constants: { rayLead: 10 }", "constants: { rayLead: 0.5 }"),
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace('{ label: "1", R: 50, d: 4, nd: 1.5, sd: 8 }', '{ label: "1", R: -9, d: 4, nd: 1.5, sd: 8 }'),
  });
  const binding = await bind(t, steep);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvAxialRaySets(binding.api, model);
  assert.deepEqual(
    [made.sets, made.asks, made.problems.map((problem) => problem.split(":")[0])],
    [[], [], ["launch-behind-first-surface"]],
  );
});
