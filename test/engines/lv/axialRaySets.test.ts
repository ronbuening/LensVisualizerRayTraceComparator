// The axial sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose spherical-aberration and
// axial-colour sections have LensVisualizer's names, its aimed launch (each zone at its fraction of the stop, a
// channel's at a factor of its own) and zones of their own. What is held here
// is which rays the case source makes for the two sections and that, traced, they are the sections' own: the fake's
// intercepts, best focus, profile and per-channel focus come back from them to the bit. That the restatement is
// LensVisualizer's own is test/integration/lv/axialRays.test.ts, against the real one.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { lvAxialRaySets, lvAxialZones } from "../../../src/engines/lv/axialRaySets.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
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

test("the axial sets are the sections' zones in mirror pairs: two at every line, the colour at each channel's", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  // The reference line, the fake's R channel (656.2725 nm, C), and 600 nm, no channel's.
  const { opticalCase, model } = await modelOf(binding, SINGLET, {
    lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725, 600] },
  });
  const lines = opticalCase.conditions.lines.length;
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
  // The profile and the marginal rays at every line, aimed at the authored indices; the colour at line 0 (G) and line
  // 1 (R), each aimed at its channel's indices; none at 600 nm.
  const pupil = lvTabPupilSemiDiameter(api, model);
  const expected = [
    ...[0, 1, 2].map((line) => ({ line, zones: [0.1, 0.25, 0.5, 0.75, 0.9], scale: 1 })),
    ...[0, 1, 2].map((line) => ({ line, zones: [0.25, 0.9, 0.75, 0.5], scale: 1 })),
    { line: 0, zones: [0.9, 0.75, 0.5], scale: 1 },
    { line: 1, zones: [0.9, 0.75, 0.5], scale: 1 + 1 / 1024 },
  ];
  assert.equal(lines, 3);
  assert.deepEqual(
    made.sets.map((set) => set.line),
    expected.map(({ line }) => line),
  );
  const firstZ = model.state.z[0];
  made.sets.forEach((set, at) => {
    const { zones, scale } = expected[at];
    assert.deepEqual(set.groups, { field: { angleDeg: 0 } });
    // The fake aims a zone at its fraction of the stop by its fraction of the pupil, times its channel's factor; each
    // ray starts the fake's lead of 10 mm ahead of the first vertex plane, along the axis, beside its mirror image.
    const heights = zones.flatMap((fraction) => [fraction * pupil * scale, -fraction * pupil * scale]);
    assert.deepEqual(
      [...f8(set, "origins")],
      heights.flatMap((y) => [0, y, firstZ - 10]),
      `set ${at}`,
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
    { kind: "colour", lines: [0, 1, 2], marginal: [0.9, 0.75, 0.5] },
  ]);
});

test("a zone LensVisualizer aims no ray at is left out of its set and named; a blocked zone keeps its rays", async (t) => {
  const lv = freshLv(t);
  // The fake aims nothing beyond 0.8 of the stop, and blocks what is beyond 0.6 at the first surface.
  const aimed = variantOf(lv, "aimed", {
    "src/lens-data/acme/AcmeSinglet50.data.ts": (text) =>
      text.replace("focusTravel: 5,", "focusTravel: 5,\n  aim: { unaimedBeyond: 0.8, blockedBeyond: 0.6 },"),
  });
  const binding = await bind(t, aimed);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvAxialRaySets(binding.api, model);
  assert.deepEqual(
    made.problems.map((problem) => problem.split(":")[0]),
    ["lv-zone-unaimed", "lv-zone-unaimed", "lv-zone-unaimed"],
  );
  // The profile without 0.9, the marginal set without 0.9, the colour set without 0.9: 0.75 stays, and is blocked.
  assert.deepEqual(
    made.sets.map((set) => f8(set, "origins").length / 3),
    [8, 6, 4],
  );
  const traced = made.sets.map((set) => {
    const answer = answerLvRays(binding.api, model, set);
    assert.ok("data" in answer);
    return decodeNdArray(answer.data.status).values;
  });
  // The blocked pair of 0.75 is stopped by every engine; LensVisualizer counts it vignetted.
  assert.deepEqual([...traced[2]], [1, 1, 0, 0]);
});

test("traced as the sections trace them, the sets give the fake's intercepts, focus and channels to the bit", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  // Every channel of the fake is a line: d (G) first, then C (R), F (B) and g (V).
  const { model } = await modelOf(binding, SINGLET, {
    lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725, 486.1327, 435.8343] },
  });
  const made = lvAxialRaySets(api, model);
  const [profile, , , , marginal] = made.sets;
  const colourSets = made.sets.slice(8);
  assert.deepEqual(
    colourSets.map((set) => set.line),
    [0, 1, 2, 3],
  );
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
  // The axial colour: each channel's own set, its candidates' plus rays traced at its indices, the first zone that
  // every channel brings to the image.
  const colour = api.computeLongitudinalChromaticFocus(request);
  assert.ok(colour !== null);
  const channels = ["G", "R", "B", "V"];
  const chosen = [0, 2, 4].find((ray) =>
    channels.every((channel, line) => sectionRay(api, model, colourSets[line], ray, channel) !== null),
  )!;
  assert.equal(colour.marginalFraction, [0.9, 0.75, 0.5][chosen / 2]);
  colour.samples.forEach((sample) => {
    const traced = sectionRay(api, model, colourSets[channels.indexOf(sample.channel)], chosen, sample.channel);
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
