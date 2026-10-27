// The vignetting sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose vignetting tab has
// LensVisualizer's name and rules, and a tracer, an MTF launch and lenses of its own. What is held here is which rays
// the case source makes for the tab and that, traced, they are the tab's own: the fake's geometric transmission and
// relative illumination come back from them to the bit, in the tab's own arithmetic, an absorbing glass included.
// That the restatement is LensVisualizer's own is test/integration/lv/vignettingRays.test.ts, against the real one.
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
import { lvChiefGeometry, lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import type { LvApi, LvVec3 } from "../../../src/engines/lv/types.ts";
import {
  LV_VIGNETTING_BEAM_CELLS,
  isVignettingRefusal,
  lvVignettingDecision,
  lvVignettingFieldCount,
} from "../../../src/engines/lv/vignettingFields.ts";
import type { LvVignettingBeam, LvVignettingSetup } from "../../../src/engines/lv/vignettingFields.ts";
import { VIGNETTING_PATTERNS, lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";
const SINGLET_FILE = "src/lens-data/acme/AcmeSinglet50.data.ts";
const TRACING = "src/optics/analysis/mtf/mtfTracing.ts";

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

/** A ray of a set traced as the tab traces it: with its own trace options, the d line at the authored indices. */
function tabTrace(api: LvApi, model: LvCaseModel, setup: LvVignettingSetup, set: RaysTraceSpec, ray: number) {
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const at = (array: Float64Array): LvVec3 => [array[3 * ray], array[3 * ray + 1], array[3 * ray + 2]];
  return api.traceEngineRay(model.state, { origin: at(origins), direction: at(directions) }, setup.traceOptions);
}

/**
 * The fake tab's curve of the beam sets of one line, counted as the tab counts its beams (a mirrored cell twice, a
 * running sum of the weights) and mapped as it maps them (the landings of lit chief rays 0.01 degrees apart), in its
 * own arithmetic; null where its arithmetic gives no curve.
 */
function tabCurve(
  api: LvApi,
  model: LvCaseModel,
  setup: LvVignettingSetup,
  beams: readonly LvVignettingBeam[],
  sets: readonly RaysTraceSpec[],
) {
  const stopRadius = setup.options.stopSemiDiameterMm;
  const raw = sets.map((set, at) => {
    const { columns, rows, step } = set.groups!.lattice!;
    const weights = f8(set, "weights");
    let [cells, transmitted] = [0, 0];
    for (let ray = 0; ray < columns * rows; ray++) {
      if (api.mtfTraceClassification(tabTrace(api, model, setup, set, ray), model.state, stopRadius) !== "valid") {
        continue;
      }
      cells += setup.mirror ? 2 : 1;
      transmitted += setup.mirror ? 2 * weights[ray] : weights[ray];
    }
    const cellArea = step * step;
    const [area, flux] = [cells * cellArea, transmitted * cellArea];
    // The chief rays after the cells: the field's, then those below and above it where the tab launches them.
    const beam = beams[at];
    const height = (ray: number | null): number | null => {
      if (ray === null) return null;
      const trace = tabTrace(api, model, setup, set, ray);
      if (api.mtfTraceClassification(trace, model.state, stopRadius) !== "valid") return null;
      return api.mtfImagePoint(model.state, trace)?.y ?? null;
    };
    const chief = columns * rows;
    const below = beam.below === null ? null : chief + 1;
    const above = beam.above === null ? null : chief + (beam.below === null ? 1 : 2);
    return {
      angle: set.groups!.field!.angleDeg!,
      area,
      flux,
      own: height(chief),
      low: height(below),
      high: height(above),
    };
  });
  const samples = raw.map(({ angle, area, flux, own, low, high }, at) => {
    if (!(flux > 0)) return { angle, area, illumination: 0 };
    if (own === null) return null;
    const rise =
      low !== null && high !== null ? (high - low) / 2 : high !== null ? high - own : low !== null ? own - low : null;
    if (rise === null) return null;
    const slope = Math.abs(rise / ((0.01 * Math.PI) / 180));
    const imageArea = slope * (angle === 0 ? slope : Math.abs(own) / Math.sin((angle * Math.PI) / 180));
    if (!(imageArea > 0)) return null;
    // The launch's direction, every cell's: `beam.flux * launch.direction[2]`.
    return { angle, area, illumination: (flux * f8(sets[at], "directions")[2]) / imageArea };
  });
  if (samples.some((sample) => sample === null)) return null;
  const axis = samples[0]!;
  return samples.map((sample) => ({
    fieldAngleDeg: sample!.angle,
    geometricTransmission: sample!.area / axis.area,
    relativeIllumination: sample!.illumination / axis.illumination,
  }));
}

/** The beams of the fields of a model, in the tab's order. */
function beamsOf(api: LvApi, model: LvCaseModel): { setup: LvVignettingSetup; beams: LvVignettingBeam[] } {
  const decision = lvVignettingDecision(api, model, lvChiefGeometry(api, model)!);
  assert.ok("setup" in decision);
  const beams = decision.fields.flatMap(({ made }) => (isVignettingRefusal(made) ? [] : [made]));
  return { setup: decision.setup, beams };
}

test("the vignetting sets are the tab's beams, a set a field and line, the chief rays of its mapping after the cells", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, SINGLET, {
    lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725] },
  });
  const made = lvVignettingRaySets(api, model);
  assert.deepEqual(made.problems, []);
  assert.deepEqual(VIGNETTING_PATTERNS, ["beam"]);
  const geometry = lvChiefGeometry(api, model)!;
  const fields = lvVignettingFieldCount(geometry.halfFieldDeg);
  assert.deepEqual([fields, LV_VIGNETTING_BEAM_CELLS], [8, 64], "LensVisualizer's counts: a half field of 20 degrees");
  const lines = opticalCase.conditions.lines.length;
  assert.equal(made.sets.length, fields * lines);
  const { setup, beams } = beamsOf(api, model);
  assert.equal(setup.mirror, true, "the fake's surfaces are of revolution: the tab traces one half of each beam");
  const angles = made.asks[0].fieldAnglesDeg;
  beams.forEach((beam, field) => {
    const [first, second] = made.sets.slice(field * lines, (field + 1) * lines);
    assert.deepEqual([first.line, second.line], [0, 1]);
    assert.deepEqual(second.origins, first.origins, "the same rays at every line");
    assert.deepEqual(first.groups?.field, { angleDeg: angles[field] });
    // The half lattice the tab traces, row by row, from the middle column on; then the chief rays of its mapping.
    const { columns, rows, step } = first.groups!.lattice!;
    assert.deepEqual([columns, rows, step], [beam.grid.columns / 2, beam.grid.rows, beam.grid.step]);
    assert.equal(first.groups!.chiefIndex, columns * rows);
    const origins = f8(first, "origins");
    const own = api.mtfLaunchRay(
      beam.launch,
      beam.grid.x0 + (beam.grid.columns / 2 + 0.5) * step,
      beam.grid.y0 + 0.5 * step,
    );
    assert.deepEqual([...origins.subarray(0, 3)], own.origin);
    assert.ok(origins.subarray(0, 3 * columns * rows).every((value, at) => at % 3 !== 0 || value > 0));
    const chiefs = [beam.launch, beam.below, beam.above].filter((launch) => launch !== null);
    assert.equal(origins.length / 3, columns * rows + chiefs.length);
    chiefs.forEach((launch, at) => {
      const ray = api.mtfLaunchRay(launch, 0, 0);
      assert.deepEqual([...origins.subarray(3 * (columns * rows + at), 3 * (columns * rows + at + 1))], ray.origin);
    });
    // A chief ray weighs nothing; a cell its bulk transmission, 1 through the fake's clear glass.
    const weights = f8(first, "weights");
    assert.ok(weights.subarray(0, columns * rows).every((weight) => weight === 1));
    assert.ok(weights.subarray(columns * rows).every((weight) => weight === 0));
  });
  // The ask: the tab's line, the authored reference line, at its fields, the axis first.
  assert.deepEqual(made.asks, [{ lines: [0], maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: angles }]);
  assert.equal(angles[0], 0);
});

test("traced as the tab traces them, the beams give the fake's tab curve back to the bit, an absorbing glass included", async (t) => {
  const lv = freshLv(t);
  const absorbing = variantOf(lv, "absorbing", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  absorptionPerMm: 0.125,"),
  });
  for (const tree of [lv, absorbing]) {
    const binding = await bind(t, tree);
    const { api } = binding;
    const { model } = await modelOf(binding, SINGLET);
    const made = lvVignettingRaySets(api, model);
    const curve = api.computeVignettingCurve(lvChiefRequest(api, model));
    const { setup, beams } = beamsOf(api, model);
    assert.deepEqual(tabCurve(api, model, setup, beams, made.sets), curve);
    assert.ok(
      curve.some((sample) => sample.geometricTransmission !== 1) && curve.at(-1)!.relativeIllumination < 0.9,
      "the fake singlet's beam grows across the field, and its edge is dimmer",
    );
    if (tree === absorbing) {
      assert.ok(
        made.sets.some((set) => f8(set, "weights").some((weight) => weight > 0 && weight < 1)),
        "an absorbing glass weighs the cells",
      );
    }
    // lv's own trace of a beam brings to the image exactly the rays the tab counts.
    for (const set of made.sets) {
      const answer = answerLvRays(api, model, set);
      assert.ok("data" in answer);
      const status = decodeNdArray(answer.data.status).values as Uint8Array;
      status.forEach((each, ray) =>
        assert.equal(each === 0, tabTrace(api, model, setup, set, ray).status === "ok", `ray ${ray}`),
      );
    }
    binding.close();
  }
});

test("a field whose chief rays the tab finds vignetted keeps its beam, and is named: its mapping is of ray tubes", async (t) => {
  // The fake made to stop every chief ray steeper than about 11.5 degrees, and no ray of a lattice: those fields' image
  // mapping is the tab's ray tubes, which are the fake's own.
  const lv = variantOf(freshLv(t), "chief-vignetted", {
    [TRACING]: (text) =>
      text.replace(
        '  if (trace.status === "ok") return "valid";',
        '  if (trace.input.origin[0] === 0 && trace.input.direction[1] < -0.2) return "blocked";\n  if (trace.status === "ok") return "valid";',
      ),
  });
  const binding = await bind(t, lv);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvVignettingRaySets(binding.api, model);
  const tubes = made.problems.filter((problem) => problem.startsWith("lv-tube-mapping: "));
  const angles = made.asks[0].fieldAnglesDeg;
  assert.equal(tubes.length, angles.filter((angle) => Math.sin((angle * Math.PI) / 180) > 0.2).length);
  assert.ok(tubes.length > 0);
  assert.equal(made.sets.length, angles.length, "a field of ray tubes keeps its beam set");
});

test("a state the tab draws no curve of has no sets: a bounding-sphere field, a path outside the beam model", async (t) => {
  const lv = freshLv(t);
  const vector = variantOf(lv, "vector", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: 12 },"),
  });
  const outside = variantOf(lv, "outside", {
    "src/optics/analysis/mtf/mtfSupport.ts": (text) =>
      text.replace(
        "export function mtfAxialImagePlane(state: FakeState): boolean {",
        "export function mtfAxialImagePlane(state: FakeState): boolean {\n  return false;",
      ),
  });
  for (const [tree, code] of [
    [vector, "lv-bounding-sphere-field"],
    [outside, "lv-outside-beam-model"],
  ] as const) {
    const binding = await bind(t, tree);
    const { model } = await modelOf(binding, SINGLET);
    const made = lvVignettingRaySets(binding.api, model);
    assert.deepEqual([made.sets, made.asks], [[], []]);
    assert.equal(made.problems.length, 1);
    assert.match(made.problems[0], new RegExp(`^${code}: `));
    assert.deepEqual(binding.api.computeVignettingCurve(lvChiefRequest(binding.api, model)), []);
    binding.close();
  }
});

test("a field without a chief ray is plotted dark and has no set; the axis must have a beam", async (t) => {
  const lv = freshLv(t);
  // The fake finds no chief ray beyond 15 degrees: those fields are dark in the tab and coded problems of the sets.
  const limited = variantOf(lv, "limited", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { chiefLimitDeg: 15 },"),
  });
  const binding = await bind(t, limited);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvVignettingRaySets(binding.api, model);
  const failed = made.problems.filter((problem) => problem.startsWith("chief-ray-failed: "));
  assert.ok(failed.length > 0);
  assert.ok(made.asks[0].fieldAnglesDeg.every((angle) => angle <= 15));
  assert.equal(made.sets.length, made.asks[0].fieldAnglesDeg.length);
  const curve = binding.api.computeVignettingCurve(lvChiefRequest(binding.api, model));
  assert.ok(curve.filter((sample) => sample.fieldAngleDeg > 15).every((sample) => sample.relativeIllumination === 0));
  binding.close();
  // No chief ray even on the axis: no sets at all.
  const none = variantOf(lv, "none", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { chiefLimitDeg: -1 },"),
  });
  const bound = await bind(t, none);
  const dark = lvVignettingRaySets(bound.api, (await modelOf(bound, SINGLET)).model);
  assert.deepEqual([dark.sets, dark.asks], [[], []]);
  assert.match(dark.problems.at(-1) ?? "", /^no-axis-beam: /);
});

test("a folded path, a finite object and a run of no authored line are coded problems or no ask, never approximated", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const folded = await modelOf(binding, "zz-folded-mirror");
  assert.match(lvVignettingRaySets(api, folded.model).problems[0], /^folded-path: /);
  const close = await modelOf(binding, SINGLET, { state: { focus: { kind: "focusT", value: 1 } } });
  assert.match(lvVignettingRaySets(api, close.model).problems[0], /^object-not-at-infinity: /);
  // A photopic run's lines are none of them the authored indices: its sets are made, and nothing is asked.
  const photopic = await modelOf(binding, SINGLET, { lines: { kind: "photopic" } });
  const made = lvVignettingRaySets(api, photopic.model);
  assert.ok(made.sets.length > 0);
  assert.deepEqual(made.asks, []);
});
