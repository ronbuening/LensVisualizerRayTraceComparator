// The vignetting sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose vignetting tab has
// LensVisualizer's name and rules (LV #931: a lattice on the real stop a field, aimed through the shared launch), and a
// tracer, an aim and lenses of its own. What is held here is which rays the case source makes for the tab and that,
// traced as the tab traces them, they are the tab's own: each cell's ray, whether it reaches the image, and the fake's
// unvignetted fraction come back from them to the bit, an absorbing glass included. That the restatement is
// LensVisualizer's own is test/integration/lv/vignettingRays.test.ts, against the real one.
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
  isVignettingRefusal,
  lvBeamLattice,
  lvVignettingDecision,
  lvVignettingFieldCount,
} from "../../../src/engines/lv/vignettingFields.ts";
import type { LvVignettingBeam, LvVignettingSetup } from "../../../src/engines/lv/vignettingFields.ts";
import { VIGNETTING_PATTERNS, lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";
const SINGLET_FILE = "src/lens-data/acme/AcmeSinglet50.data.ts";

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

/** A ray of a set traced as the tab traces it: the launch's own trace, the stop at the lattice's clip radius. */
function tabTrace(api: LvApi, model: LvCaseModel, beam: LvVignettingBeam, set: RaysTraceSpec, ray: number) {
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const at = (array: Float64Array): LvVec3 => [array[3 * ray], array[3 * ray + 1], array[3 * ray + 2]];
  return api
    .prepareAimedPupilTrace(model.state, beam.lattice)
    .engine({ origin: at(origins), direction: at(directions) });
}

/** The fields of a model with a lattice, in the tab's order. */
function beamsOf(api: LvApi, model: LvCaseModel): { setup: LvVignettingSetup; beams: LvVignettingBeam[] } {
  const decision = lvVignettingDecision(api, model, lvChiefGeometry(api, model)!);
  assert.ok("setup" in decision);
  const beams = decision.fields.flatMap(({ made }) => (isVignettingRefusal(made) ? [] : [made]));
  return { setup: decision.setup, beams };
}

test("the vignetting sets are the tab's stop lattices, a set a field and line, the stop-centre ray after the cells", async (t) => {
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
  assert.deepEqual([fields, api.vignettingBeamCells], [8, 64], "the fake's counts: a half field of 20 degrees");
  const lines = opticalCase.conditions.lines.length;
  assert.equal(made.sets.length, fields * lines);
  const { setup, beams } = beamsOf(api, model);
  assert.equal(setup.mirror, true, "the fake's surfaces are of revolution: the tab traces one half of each lattice");
  const angles = made.asks[0].fieldAnglesDeg;
  beams.forEach((beam, field) => {
    const [first, second] = made.sets.slice(field * lines, (field + 1) * lines);
    assert.deepEqual([first.line, second.line], [0, 1]);
    assert.deepEqual(second.origins, first.origins, "the same rays at every line");
    assert.deepEqual(first.groups?.field, { angleDeg: angles[field] });
    // The +x half of the stop's square, row by row, from the middle column on; then the stop-centre ray.
    const { columns, rows, step } = first.groups!.lattice!;
    const n = beam.lattice.cellsAcross;
    assert.deepEqual([columns, rows, step], [n / 2, n, (2 * beam.lattice.stopSemiDiameterMm) / n]);
    assert.deepEqual(lvBeamLattice(beam, true).firstColumn, n / 2);
    assert.equal(first.groups!.chiefIndex, columns * rows);
    const [origins, directions, weights] = [f8(first, "origins"), f8(first, "directions"), f8(first, "weights")];
    assert.equal(origins.length / 3, columns * rows + 1);
    const chief = beam.lattice.chief as { origin: LvVec3; direction: LvVec3 };
    const chiefAt = columns * rows;
    assert.deepEqual([...origins.subarray(3 * chiefAt)], chief.origin);
    assert.equal(weights[chiefAt], 0);
    // The tab's own field: every cell of the half is its ray to the bit; a square's cell outside the disc holds the
    // stop-centre ray at weight 0.
    const tab = api.computeVignettingField(lvChiefRequest(api, model), beam.fieldFraction);
    let cells = 0;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const ray = row * columns + column;
        const cell = tab.cells.find((each) => each.cell.row === row && each.cell.column === column + n / 2);
        const [origin, direction] = [origins.subarray(3 * ray, 3 * ray + 3), directions.subarray(3 * ray, 3 * ray + 3)];
        if (cell === undefined) {
          assert.deepEqual([...origin, ...direction, weights[ray]], [...chief.origin, ...chief.direction, 0]);
          continue;
        }
        cells++;
        assert.deepEqual([...origin, ...direction], [...cell.ray.origin!, ...cell.ray.direction!]);
        assert.equal(weights[ray], 1, "a cell weighs its bulk transmission, 1 through the fake's clear glass");
      }
    }
    assert.equal(2 * cells, tab.sampleCount, "the half holds half the disc's cells");
  });
  // The ask: the tab's line, the authored reference line, at its fields, the axis first.
  assert.deepEqual(made.asks, [{ lines: [0], maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: angles }]);
  assert.equal(angles[0], 0);
});

test("traced as the tab traces them, the sets give the fake's unvignetted fractions back to the bit, an absorbing glass included", async (t) => {
  const lv = freshLv(t);
  const absorbing = variantOf(lv, "absorbing", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  absorptionPerMm: 0.125,"),
  });
  for (const tree of [lv, absorbing]) {
    const binding = await bind(t, tree);
    const { api } = binding;
    const { model } = await modelOf(binding, SINGLET);
    const made = lvVignettingRaySets(api, model);
    const request = lvChiefRequest(api, model);
    const curve = api.computeVignettingCurve(request);
    assert.ok(curve.available);
    const { beams } = beamsOf(api, model);
    beams.forEach((beam, field) => {
      const set = made.sets[field];
      const { columns, rows } = set.groups!.lattice!;
      const weights = f8(set, "weights");
      const tab = api.computeVignettingField(request, beam.fieldFraction);
      // Each cell of the half, traced as the tab traces it, reaches the image where the tab's does; mirrored, twice.
      let transmitted = 0;
      for (let ray = 0; ray < columns * rows; ray++) {
        if (!(weights[ray] > 0)) continue;
        const trace = tabTrace(api, model, beam, set, ray);
        const valid = api.traceRayClassification(trace, model.state, beam.lattice.clipSemiDiameterMm) === "valid";
        const [row, column] = [Math.floor(ray / columns), (ray % columns) + columns];
        const cell = tab.cells.find((each) => each.cell.row === row && each.cell.column === column)!;
        assert.equal(valid, cell.transmitted, `field ${field} cell ${row} ${column}`);
        if (valid) {
          transmitted += 2;
          assert.equal(weights[ray], api.bulkTransmissionForTrace(model.state.lens, trace.hits));
          assert.deepEqual(cell.exitDirectionCosines, [trace.terminalDirection[0], trace.terminalDirection[1]]);
        }
      }
      const sample = curve.samples[field];
      assert.equal(sample.transmittedCount, transmitted);
      assert.equal(
        sample.unvignettedFraction,
        transmitted / (sample.sampleCount - sample.unaimedCount - sample.failedCount),
      );
    });
    assert.ok(
      curve.samples.some((sample) => sample.unvignettedFraction !== 1) &&
        curve.samples.at(-1)!.relativeIllumination! < 1,
      "the fake singlet's beam is vignetted across the field, and its edge is dimmer",
    );
    if (tree === absorbing) {
      assert.ok(
        made.sets.some((set) => f8(set, "weights").some((weight) => weight > 0 && weight < 1)),
        "an absorbing glass weighs the cells",
      );
    }
    // lv's own trace of a set brings to the image exactly the rays the tab traced through, at the case's stop.
    for (const [field, set] of made.sets.entries()) {
      const answer = answerLvRays(api, model, set);
      assert.ok("data" in answer);
      const status = decodeNdArray(answer.data.status).values as Uint8Array;
      status.forEach((each, ray) =>
        assert.equal(each === 0, tabTrace(api, model, beams[field], set, ray).status === "ok", `ray ${ray}`),
      );
    }
    binding.close();
  }
});

test("a cell the tab could not aim holds the stop-centre ray at weight 0, and is left out of the fake's fraction", async (t) => {
  // The fake aims nothing beyond 0.995 of the stop: a ring of the lattice's outermost cells.
  const lv = variantOf(freshLv(t), "unaimed", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  aim: { unaimedBeyond: 0.995 },"),
  });
  const binding = await bind(t, lv);
  const { api } = binding;
  const { model } = await modelOf(binding, SINGLET);
  const made = lvVignettingRaySets(api, model);
  const { beams } = beamsOf(api, model);
  const [beam, set] = [beams[0], made.sets[0]];
  const unaimed = beam.lattice.rays.filter(
    (ray, at) => ray.status === "unaimed" && beam.lattice.cells[at].xFraction > 0,
  );
  assert.ok(unaimed.length > 0);
  const weights = f8(set, "weights");
  const { columns, rows } = set.groups!.lattice!;
  const n = beam.lattice.cellsAcross;
  const vacant = weights.subarray(0, columns * rows).filter((weight) => weight === 0).length;
  const outside = columns * rows - beam.lattice.cells.filter((cell) => cell.xFraction > 0).length;
  assert.equal(vacant, outside + unaimed.length);
  const sample = api.computeVignettingCurve(lvChiefRequest(api, model)).samples[0];
  assert.equal(sample.unaimedCount, 2 * unaimed.length);
  assert.equal(n, 64);
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
  for (const [tree, code, reason] of [
    [vector, "lv-bounding-sphere-field", "bounding-sphere-field"],
    [outside, "lv-outside-beam-model", "tilted-image-plane"],
  ] as const) {
    const binding = await bind(t, tree);
    const { model } = await modelOf(binding, SINGLET);
    const made = lvVignettingRaySets(binding.api, model);
    assert.deepEqual([made.sets, made.asks], [[], []]);
    assert.equal(made.problems.length, 1);
    assert.match(made.problems[0], new RegExp(`^${code}: `));
    const curve = binding.api.computeVignettingCurve(lvChiefRequest(binding.api, model));
    assert.deepEqual([curve.available, curve.reason], [false, reason]);
    binding.close();
  }
});

test("a field without a launch has no set; the axis must have a lattice", async (t) => {
  const lv = freshLv(t);
  // The fake has no launch beyond 15 degrees: those fields have no figures in the tab and are coded problems.
  const limited = variantOf(lv, "limited", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { chiefLimitDeg: 15 },"),
  });
  const binding = await bind(t, limited);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvVignettingRaySets(binding.api, model);
  const failed = made.problems.filter((problem) => problem.startsWith("no-field-launch: "));
  assert.ok(failed.length > 0);
  assert.ok(made.asks[0].fieldAnglesDeg.every((angle) => angle <= 15));
  assert.equal(made.sets.length, made.asks[0].fieldAnglesDeg.length);
  const curve = binding.api.computeVignettingCurve(lvChiefRequest(binding.api, model));
  assert.ok(
    curve.samples
      .filter((sample) => sample.fieldAngleDeg > 15)
      .every((sample) => sample.unvignettedFraction === null && sample.unavailableReason === "no-field-launch"),
  );
  binding.close();
  // No launch even on the axis: no sets at all.
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

test("the tab's lattice is BEAM_GRID_CELLS across, never fewer than LensVisualizer's MIN_BEAM_GRID_CELLS, both bound", async (t) => {
  // A tree whose tab asks for 2 cells across and whose floor is 6: the sets are of the floor's 6, read from the binding
  // as the tab reads it (`Math.max(Math.round(cellsAcross), MIN_BEAM_GRID_CELLS)`), never of a number of the comparator's.
  const lv = freshLv(t);
  const coarse = variantOf(lv, "coarse", {
    "src/optics/analysis/vignetting.ts": (text) =>
      text
        .replace("export const BEAM_GRID_CELLS = 64;", "export const BEAM_GRID_CELLS = 2;")
        .replace("export const MIN_BEAM_GRID_CELLS = 4;", "export const MIN_BEAM_GRID_CELLS = 6;"),
  });
  const binding = await bind(t, coarse);
  const { api } = binding;
  assert.deepEqual([api.vignettingBeamCells, api.vignettingMinBeamCells], [2, 6]);
  const { setup } = beamsOf(api, (await modelOf(binding, SINGLET)).model);
  assert.equal(setup.cells, 6);
});
