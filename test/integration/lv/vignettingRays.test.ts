// The vignetting sets against the real LensVisualizer: the rays its vignetting tab launches, as the case source restates
// them (src/engines/lv/vignettingRaySets.ts, the fields and the tab's setup in vignettingFields.ts). Since LensVisualizer
// #931 (`4092f6a25`) the tab traces each field's lattice on the real stop, aimed through the shared launch (the MTF's
// `prepareAimedStopLattice`), one half of it mirrored, and takes the share of its samples that reach the image and
// Rimmer's relative illumination of them. Each cell of a beam set is held to the tab's own cell of the field
// (`computeVignettingField`): its ray, to the bit; traced as the tab traces it (`prepareAimedPupilTrace(...).engine`,
// the stop at the lattice's clip radius) and classified as the tab classifies it (`traceRayClassification`), whether it
// reaches the image, its exit cosines and its bulk transmission, which the set states as the cell's weight. The counts of
// the half, each cell twice where the tab mirrors, are then the tab's, and the unvignetted fraction its curve's to the
// bit; the relative illumination is the ratio of the fields' Rimmer sums, which LensVisualizer forms of those cells. On
// every benchmark configuration, the zoom's far end, an absorbing lens (the Laowa 105 mm STF) and a wide angle (the
// Viltrox AF 14 mm f/4 Air). `lv`'s `rays.trace` answer of a set, at the case's stop radius, brings to the image the rays
// the tab counts but for cells LensVisualizer's lattice aims within its tolerance beyond the stop's rim, which the tab
// admits at its clip radius (counted, never more than a rim's few). What is not tested is that the tab's React code
// hands `computeVignettingCurve` exactly this request: that rests on the canaries of the tab's lines. Nothing is written.
// Measured at LV 607ff23ae (engine closure f016b35b, 184 files).
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
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import type { LvApi, LvVec3 } from "../../../src/engines/lv/types.ts";
import { isVignettingRefusal, lvBeamLattice, lvVignettingDecision } from "../../../src/engines/lv/vignettingFields.ts";
import type { LvVignettingBeam, LvVignettingSetup } from "../../../src/engines/lv/vignettingFields.ts";
import { lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

/** The benchmark's lenses as they open, the far end of its zoom, a lens whose glass absorbs, and a wide angle. */
const CONFIGURATIONS: readonly { readonly key: string; readonly options: RunOptions }[] = [
  ...BENCHMARK_KEYS.map((key) => ({ key, options: {} })),
  { key: "nikon-z-24-70f4s", options: { state: { zoomT: 1 } } },
  { key: "laowa-105mm-f2-stf", options: {} },
  { key: "viltrox-af-14mm-f4-air", options: {} },
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

function vec(values: Float64Array, ray: number): LvVec3 {
  return [values[3 * ray], values[3 * ray + 1], values[3 * ray + 2]];
}

/** The fields of a model with a lattice, in the tab's order, and the setup. */
function beamsOf(api: LvApi, model: LvCaseModel): { setup: LvVignettingSetup; beams: LvVignettingBeam[] } {
  const decision = lvVignettingDecision(api, model, lvChiefGeometry(api, model)!);
  assert.ok("setup" in decision);
  const beams = decision.fields.flatMap(({ made }) => (isVignettingRefusal(made) ? [] : [made]));
  return { setup: decision.setup, beams };
}

test(
  "the vignetting sets, traced as the tab traces them, are its cells and its unvignetted fractions to the bit",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let [fields, cells, absorbed, rimOnly, vacant] = [0, 0, 0, 0, 0];
    for (const { key, options } of CONFIGURATIONS) {
      const at = `${key} ${JSON.stringify(options)}`;
      const model = await modelOf(binding, key, options);
      const { state } = model;
      const made = lvVignettingRaySets(api, model);
      assert.deepEqual(made.problems, [], at);
      const request = lvChiefRequest(api, model);
      const curve = api.computeVignettingCurve(request);
      assert.ok(curve.available, at);
      const { setup, beams } = beamsOf(api, model);
      assert.equal(
        setup.mirror,
        true,
        `${at}: every surface is of revolution, and the tab traces half of each lattice`,
      );
      assert.equal(setup.cells, curve.cellsAcross, at);
      assert.equal(beams.length, curve.samples.length, at);
      assert.equal(made.sets.length, beams.length, at);
      assert.deepEqual(
        made.asks[0].fieldAnglesDeg,
        curve.samples.map((sample) => sample.fieldAngleDeg),
        at,
      );
      const rimmer: (number | null)[] = [];
      made.sets.forEach((set, field) => {
        const beam = beams[field];
        const sample = curve.samples[field];
        const where = `${at} field ${sample.fieldAngleDeg}`;
        assert.equal(set.groups?.field?.angleDeg, sample.fieldAngleDeg, where);
        const tab = api.computeVignettingField(request, beam.fieldFraction);
        rimmer.push(tab.relativeIlluminationReason === null ? tab.rimmerSum : null);
        assert.equal(tab.mirrored, true, where);
        const { columns, rows } = set.groups!.lattice!;
        const { firstColumn } = lvBeamLattice(beam, setup.mirror);
        const [origins, directions, weights] = [f8(set, "origins"), f8(set, "directions"), f8(set, "weights")];
        const chief = beam.lattice.chief as { origin: LvVec3; direction: LvVec3 };
        assert.deepEqual(
          [...vec(origins, columns * rows), ...vec(directions, columns * rows)],
          [...chief.origin, ...chief.direction],
        );
        const tracer = api.prepareAimedPupilTrace(state, beam.lattice);
        const byCell = new Map(tab.cells.map((cell) => [`${cell.cell.row} ${cell.cell.column}`, cell]));
        let [transmitted, failed] = [0, 0];
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const ray = row * columns + column;
            const own = byCell.get(`${row} ${column + firstColumn}`);
            if (own === undefined || own.ray.status === "unaimed") {
              // No ray of LensVisualizer's: the stop-centre ray at weight 0.
              assert.deepEqual([...vec(origins, ray), weights[ray]], [...chief.origin, 0], `${where} cell ${ray}`);
              vacant++;
              continue;
            }
            assert.deepEqual(
              [...vec(origins, ray), ...vec(directions, ray)],
              [...own.ray.origin!, ...own.ray.direction!],
            );
            cells++;
            const trace = tracer.engine({ origin: vec(origins, ray), direction: vec(directions, ray) });
            const outcome = api.traceRayClassification(trace, state, beam.lattice.clipSemiDiameterMm);
            const lit = own.ray.status === "aimed" && outcome === "valid" && trace.terminalDirection[2] > 0;
            assert.equal(lit, own.transmitted, `${where} cell ${row} ${column}`);
            if (own.failed) failed += 2;
            if (!lit) continue;
            transmitted += 2;
            assert.deepEqual(own.exitDirectionCosines, [trace.terminalDirection[0], trace.terminalDirection[1]]);
            const transmission = api.bulkTransmissionForTrace(state.lens, trace.hits);
            assert.ok(Object.is(own.bulkTransmission, transmission), `${where} cell ${ray}`);
            assert.ok(Object.is(weights[ray], transmission), `${where} cell ${ray}: the set's weight`);
            if (transmission !== 1) absorbed++;
          }
        }
        assert.equal(sample.transmittedCount, transmitted, where);
        assert.equal(sample.failedCount, failed, where);
        if (sample.unvignettedFraction !== null) {
          const expected = transmitted / (sample.sampleCount - sample.unaimedCount - sample.failedCount);
          assert.ok(
            Object.is(sample.unvignettedFraction, expected),
            `${where}: ${sample.unvignettedFraction} ${expected}`,
          );
        }
        // lv's own trace at the case's stop radius: the rays the tab counts, but cells LensVisualizer aims within its
        // tolerance beyond the stop's rim, which the tab's clip radius admits.
        const answer = answerLvRays(api, model, set);
        assert.ok("data" in answer, where);
        const status = decodeNdArray(answer.data.status).values;
        for (let ray = 0; ray < columns * rows; ray++) {
          if (!(weights[ray] > 0)) continue;
          const own = byCell.get(`${Math.floor(ray / columns)} ${(ray % columns) + firstColumn}`)!;
          if ((status[ray] === 0) !== own.transmitted) {
            assert.ok(own.transmitted, `${where} cell ${ray}: the case's stop admits what the tab's does not`);
            rimOnly++;
          }
        }
        fields++;
      });
      // The relative illumination: the fields' Rimmer sums over the axis's, LensVisualizer's own of those cells.
      curve.samples.forEach((sample, field) => {
        if (sample.relativeIllumination === null) return;
        assert.ok(Object.is(sample.relativeIllumination, rimmer[field]! / rimmer[0]!), `${at} field ${field}`);
      });
    }
    t.diagnostic(
      `${fields} fields, ${cells} cells of LensVisualizer's (${vacant} vacant), ${absorbed} lit cells weighed below 1; ` +
        `${rimOnly} cells the tab admits at its clip radius and the case's stop does not`,
    );
    assert.ok(absorbed > 1000, `lit cells whose weight is not 1: ${absorbed}`);
  },
);
