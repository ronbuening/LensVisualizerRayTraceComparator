// The vignetting sets against the real LensVisualizer: the rays its vignetting tab launches, as the case source restates
// them (src/engines/lv/vignettingRaySets.ts, the fields and the tab's setup in vignettingFields.ts). Since LensVisualizer
// 5ba17c20c the tab traces each field's beam on its MTF's launch lattice and maps it onto the image with chief rays. Each
// ray of a beam set is traced by LensVisualizer's exact tracer (`traceEngineRay`, with the tab's own trace options,
// `mtfTraceOptions` of the d line at the authored indices), classified as the tab classifies it
// (`mtfTraceClassification`), weighed by its bulk transmission (which the set states as the cell's weight) and counted
// in the tab's own arithmetic: a mirrored cell twice, a running sum, the area and the flux of the cells, the image area
// `(dh/dθ)(h / sin θ)` of the landings of the lit chief rays 0.01 degrees apart. On every benchmark configuration, the
// zoom's far end, an absorbing lens (the Laowa 105 mm STF) and a wide angle two of whose fields the tab maps with ray
// tubes (the Viltrox AF 14 mm f/4 Air) that gives, to the bit, every field's geometric transmission and relative
// illumination of `computeVignettingCurve`. The ray tubes are copies of the beam's rays tilted and traced without aperture
// checks, which no set states: they are restated here, from `traceBeam` in vignetting.ts, and traced by LensVisualizer.
//
// It also holds that the fields of the sets and the ask are the tab's own, that a beam's cells are the right half of
// LensVisualizer's own MTF lattice of the field at the tab's 64 cells (the launch lattice of a run's ray sets), and that
// `lv`'s `rays.trace` answer of a set brings to the image exactly the rays the tab counts. And it measures why a set
// holds the half the tab traces and not the whole lattice: the lattice's columns are not mirror images of each other to
// the bit, so the cells of the other half are not where the tab's mirrored rays start. What is not tested is that the
// tab's React code hands `computeVignettingCurve` exactly this request: that rests on the canaries of the tab's lines.
// Nothing is written. Measured at LV 098c91ef6 (engine closure fef2e248, 178 files).
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
import { lvFieldRays, lvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import type { LvApi, LvVec3 } from "../../../src/engines/lv/types.ts";
import {
  LV_VIGNETTING_BEAM_CELLS,
  isVignettingRefusal,
  lvVignettingDecision,
  lvVignettingMapping,
} from "../../../src/engines/lv/vignettingFields.ts";
import type { LvVignettingBeam, LvVignettingSetup } from "../../../src/engines/lv/vignettingFields.ts";
import { lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

/** The benchmark's lenses as they open, the far end of its zoom, a lens whose glass absorbs, and one of ray tubes. */
const CONFIGURATIONS: readonly { readonly key: string; readonly options: RunOptions }[] = [
  ...BENCHMARK_KEYS.map((key) => ({ key, options: {} })),
  { key: "nikon-z-24-70f4s", options: { state: { zoomT: 1 } } },
  { key: "laowa-105mm-f2-stf", options: {} },
  { key: "viltrox-af-14mm-f4-air", options: {} },
];

/**
 * The lens whose fields the tab maps with ray tubes, how many of them, and how many it plots dark for want of a beam
 * (measured at LV 098c91ef6: its edge field, at 53.8 degrees).
 */
const TUBES = { key: "viltrox-af-14mm-f4-air", fields: 2, dark: 1 };

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

/** A ray of a set as the tab traces it: `traceRay = prepareEngineTrace(state, traceOptions)`. */
function tabTrace(api: LvApi, model: LvCaseModel, setup: LvVignettingSetup, set: RaysTraceSpec, ray: number) {
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const at = (array: Float64Array): LvVec3 => [array[3 * ray], array[3 * ray + 1], array[3 * ray + 2]];
  return api.traceEngineRay(model.state, { origin: at(origins), direction: at(directions) }, setup.traceOptions);
}

/** `median` of vignetting.ts: of a non-empty list. */
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * The tab's image area of a beam from its ray tubes, restated from `traceBeam` in vignetting.ts (`tubeMapping` and
 * `tubeMappingArea`): of each lit cell of the traced half, its landing and its stop crossing, and its mirror image's;
 * of a sub-lattice of every fourth cell, the derivatives of those of copies tilted by 1e-4 rad across and along the
 * meridian, traced without aperture checks, held to a fixed stop crossing by the lattice's own derivatives; the
 * median of each component over the tubes, and the determinant.
 */
function tubeImageArea(api: LvApi, model: LvCaseModel, setup: LvVignettingSetup, set: RaysTraceSpec): number | null {
  const { state } = model;
  const half = set.groups!.lattice!;
  const [columns, rows, step] = [2 * half.columns, half.rows, half.step];
  const stopIndex = state.lens.stop.surfaceIndex;
  const tilt = 1e-4;
  const crossings = (trace: ReturnType<LvApi["traceEngineRay"]>): number[] | null => {
    const landing = api.mtfImagePoint(state, trace);
    const stop = trace.hits.find((hit) => hit.surfaceIndex === stopIndex)?.point;
    return landing && stop ? [landing.x, landing.y, stop[0], stop[1]] : null;
  };
  const lit = new Uint8Array(columns * rows);
  const at = new Float64Array(4 * columns * rows);
  const traces: (ReturnType<LvApi["traceEngineRay"]> | undefined)[] = new Array(columns * rows);
  for (let row = 0; row < rows; row++) {
    for (let column = columns / 2; column < columns; column++) {
      const trace = tabTrace(api, model, setup, set, row * half.columns + column - columns / 2);
      if (api.mtfTraceClassification(trace, state, setup.options.stopSemiDiameterMm) !== "valid") continue;
      const values = crossings(trace);
      if (!values) continue;
      const cell = row * columns + column;
      lit[cell] = 1;
      at.set(values, 4 * cell);
      traces[cell] = trace;
      const image = row * columns + columns - 1 - column;
      lit[image] = 1;
      at.set([-values[0], values[1], -values[2], values[3]], 4 * image);
    }
  }
  const along = (cell: number, offset: number, hasBefore: boolean, hasAfter: boolean): number[] | null => {
    const before = hasBefore && lit[cell - offset] === 1;
    const after = hasAfter && lit[cell + offset] === 1;
    if (!before && !after) return null;
    const [from, to] = [before ? cell - offset : cell, after ? cell + offset : cell];
    const span = ((to - from) / offset) * step;
    return [0, 1, 2, 3].map((k) => (at[4 * to + k] - at[4 * from + k]) / span);
  };
  const directions = f8(set, "directions");
  const [dy, dz] = [directions[1], directions[2]];
  const tilts: LvVec3[] = [
    [0, dy + tilt * dz, dz - tilt * dy],
    [tilt, dy, dz],
  ];
  const unchecked = { ...setup.traceOptions, checkSemiDiameter: false, stopOnClip: false };
  const tube = (cell: number): number[] | null => {
    const trace = traces[cell]!;
    const base = at.subarray(4 * cell, 4 * cell + 4);
    const tilted = tilts.map((direction) => {
      const length = Math.hypot(...direction);
      const ray = {
        origin: trace.input.origin,
        direction: [direction[0] / length, direction[1] / length, direction[2] / length] as LvVec3,
      };
      const values = crossings(api.traceEngineRay(state, ray, unchecked));
      return values && [0, 1, 2, 3].map((k) => (values[k] - base[k]) / tilt);
    });
    if (!tilted[0] || !tilted[1]) return null;
    const [row, column] = [Math.floor(cell / columns), cell % columns];
    const dx = along(cell, 1, column > 0, column < columns - 1);
    const dyLaunch = along(cell, columns, row > 0, row < rows - 1);
    let [pa, pb, pc, pd] = [tilted[0][0], tilted[1][0], tilted[0][1], tilted[1][1]];
    if (dx && dyLaunch) {
      const [sa, sb, sc, sd] = [dx[2], dyLaunch[2], dx[3], dyLaunch[3]];
      const determinant = sa * sd - sb * sc;
      if (Math.abs(determinant) > 1e-12) {
        const shift = [tilted[0], tilted[1]].map(([, , su, sv]) => [
          -(sd * su - sb * sv) / determinant,
          -(-sc * su + sa * sv) / determinant,
        ]);
        pa += dx[0] * shift[0][0] + dyLaunch[0] * shift[0][1];
        pb += dx[0] * shift[1][0] + dyLaunch[0] * shift[1][1];
        pc += dx[1] * shift[0][0] + dyLaunch[1] * shift[0][1];
        pd += dx[1] * shift[1][0] + dyLaunch[1] * shift[1][1];
      }
    }
    return [pa, pb, pc, pd];
  };
  const stride = Math.max(1, Math.floor(LV_VIGNETTING_BEAM_CELLS / 16));
  const tubes: number[][] = [];
  const sample = (cell: number) => {
    const made = traces[cell] && tube(cell);
    if (made) tubes.push(made);
  };
  for (let row = 0; row < rows; row += stride) {
    for (let column = columns / 2; column < columns; column += stride) sample(row * columns + column);
  }
  if (tubes.length === 0) for (let cell = 0; cell < columns * rows; cell++) sample(cell);
  if (tubes.length === 0) return null;
  const [pa, pb, pc, pd] = [0, 1, 2, 3].map((k) => median(tubes.map((each) => each[k])));
  return Math.abs(pa * pd - pb * pc);
}

/** The setup and the fields of a model, in the tab's order: each field's beam, or null for one the tab plots dark. */
function beamsOf(api: LvApi, model: LvCaseModel): { setup: LvVignettingSetup; beams: (LvVignettingBeam | null)[] } {
  const decision = lvVignettingDecision(api, model, lvChiefGeometry(api, model)!);
  assert.ok("setup" in decision, JSON.stringify(decision).slice(0, 300));
  return {
    setup: decision.setup,
    beams: decision.fields.map(({ made }) => (isVignettingRefusal(made) ? null : made)),
  };
}

test(
  "the beams and the mapping chief rays, traced as the tab traces them, give its geometric transmission and relative illumination to the bit",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let [fields, rays, cellsLit, absorbed, tubeFields] = [0, 0, 0, 0, 0];
    for (const { key, options } of CONFIGURATIONS) {
      const at = `${key} ${JSON.stringify(options)}`;
      const model = await modelOf(binding, key, options);
      const { state } = model;
      const made = lvVignettingRaySets(api, model);
      const [tubes, dark] = key === TUBES.key ? [TUBES.fields, TUBES.dark] : [0, 0];
      assert.deepEqual(
        made.problems.map((problem) => problem.split(":")[0]).sort(),
        [...new Array(tubes).fill("lv-tube-mapping"), ...new Array(dark).fill("vignetted")].sort(),
        at,
      );
      tubeFields += tubes;
      const curve = api.computeVignettingCurve(lvChiefRequest(api, model));
      const { setup, beams } = beamsOf(api, model);
      assert.equal(setup.mirror, true, `${at}: every surface is of revolution, and the tab traces half of each beam`);
      assert.equal(beams.length, curve.length, at);
      const lit = beams.flatMap((beam, field) => (beam === null ? [] : [{ beam, field }]));
      assert.equal(made.sets.length, lit.length, at);
      const stopRadius = setup.options.stopSemiDiameterMm;
      const valid = (set: RaysTraceSpec, ray: number) => {
        const trace = tabTrace(api, model, setup, set, ray);
        return { trace, valid: api.mtfTraceClassification(trace, state, stopRadius) === "valid" };
      };
      // traceBeam's arithmetic, and computeVignettingCurve's.
      // A field the tab plots dark has no beam: `samples.push({ fieldAngleDeg, area: beam?.area ?? 0, illumination: 0 })`.
      const samples = beams.map(() => ({ area: 0, illumination: 0 }));
      made.sets.forEach((set, index) => {
        const { beam, field } = lit[index];
        samples[field] = sampleOf(set, beam, field);
      });
      function sampleOf(set: RaysTraceSpec, beam: LvVignettingBeam, field: number) {
        assert.equal(set.groups?.field?.angleDeg, curve[field].fieldAngleDeg, `${at} field ${field}`);
        const { columns, rows, step } = set.groups!.lattice!;
        const weights = f8(set, "weights");
        let [cells, transmitted] = [0, 0];
        for (let ray = 0; ray < columns * rows; ray++) {
          const traced = valid(set, ray);
          if (!traced.valid) continue;
          const w = api.bulkTransmissionForTrace(state.lens, traced.trace.hits);
          assert.ok(Object.is(w, weights[ray]), `${at} field ${field} cell ${ray}: the weight is the tab's`);
          cells += 2;
          transmitted += 2 * w;
          cellsLit++;
        }
        const cellArea = step * step;
        const [area, flux] = [cells * cellArea, transmitted * cellArea];
        // The chief rays of the mapping: the field's, then below and above it where the tab launches them.
        const chief = columns * rows;
        const height = (ray: number | null): number | null => {
          if (ray === null) return null;
          const traced = valid(set, ray);
          return traced.valid ? (api.mtfImagePoint(state, traced.trace)?.y ?? null) : null;
        };
        const below = beam.below === null ? null : chief + 1;
        const above = beam.above === null ? null : chief + (beam.below === null ? 1 : 2);
        assert.equal(f8(set, "origins").length / 3, chief + 1 + (below === null ? 0 : 1) + (above === null ? 0 : 1));
        rays += f8(set, "origins").length / 3;
        if (!(flux > 0)) return { area, illumination: 0 };
        // A lit chief ray and a lit neighbour give the mapping; where they are vignetted, the beam's ray tubes do.
        const angle = curve[field].fieldAngleDeg;
        const own = height(chief);
        const [low, high] = [height(below), height(above)];
        const rise =
          own === null
            ? null
            : low !== null && high !== null
              ? (high - low) / 2
              : high !== null
                ? high - own
                : low !== null
                  ? own - low
                  : null;
        const mapping = lvVignettingMapping(api, model, setup, beam);
        assert.equal(mapping, rise === null ? "tube" : "chief", `${at} field ${field}`);
        let imageArea: number;
        if (rise === null) {
          const area = tubeImageArea(api, model, setup, set);
          assert.ok(area !== null, `${at} field ${field}`);
          imageArea = area;
        } else {
          const slope = Math.abs(rise / ((0.01 * Math.PI) / 180));
          imageArea = slope * (angle === 0 ? slope : Math.abs(own!) / Math.sin((angle * Math.PI) / 180));
        }
        // `beam.flux * launch.direction[2]`: the launch's direction is every cell's.
        return { area, illumination: (flux * f8(set, "directions")[2]) / imageArea };
      }
      const axis = samples[0];
      curve.forEach((sample, field) => {
        assert.ok(Object.is(samples[field].area / axis.area, sample.geometricTransmission), `${at} GT ${field}`);
        assert.ok(
          Object.is(samples[field].illumination / axis.illumination, sample.relativeIllumination),
          `${at} RI ${field}`,
        );
      });
      // The ask: the tab's line and its fields with a beam, the axis first, at the angles of its curve to the bit.
      assert.deepEqual(made.asks, [
        {
          lines: [0],
          maxFieldDeg: lvChiefGeometry(api, model)!.halfFieldDeg,
          fieldAnglesDeg: lit.map(({ field }) => curve[field].fieldAngleDeg),
        },
      ]);
      // lv's own trace of a beam brings to the image exactly the rays the tab counts as valid.
      for (const set of made.sets) {
        const answer = answerLvRays(api, model, set);
        assert.ok("data" in answer, at);
        const status = decodeNdArray(answer.data.status).values as Uint8Array;
        status.forEach((each, ray) => {
          if ((each === 0) !== valid(set, ray).valid) assert.fail(`${at}: ray ${ray}`);
        });
      }
      fields += curve.length;
      if (made.sets.some((set) => f8(set, "weights").some((weight) => weight > 0 && weight < 1))) absorbed++;
    }
    assert.equal(absorbed, 1, "the Laowa's absorbing glass weighs its cells, and no other lens's does");
    t.diagnostic(
      `${fields} fields, ${tubeFields} of ray tubes, ${rays} rays a line, ${cellsLit} lit cells traced (each standing for two)`,
    );
    // Measured at LV 098c91ef6: 14 configurations, 142 fields.
    assert.deepEqual([fields, tubeFields], [142, 2]);
  },
);

test(
  "a beam's cells are the right half of LensVisualizer's MTF lattice of the field, whose halves are not each other's mirror to the bit",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    let [columnPairs, notMirrored, cellPairs, classifiedApart] = [0, 0, 0, 0];
    for (const { key, options } of CONFIGURATIONS) {
      const at = `${key} ${JSON.stringify(options)}`;
      const model = await modelOf(binding, key, options);
      const { setup, beams } = beamsOf(api, model);
      const made = lvVignettingRaySets(api, model);
      // The MTF's own launch of a reference run, the run's ray sets' setup: the tab's launch and footprint are its own.
      const mtf = lvLaunchSetup(api, model);
      assert.ok(!("problem" in mtf), at);
      const lit = beams.filter((beam) => beam !== null);
      made.sets.forEach((set, field) => {
        const beam = lit[field];
        const own = lvFieldRays(api, model, mtf, beam.launch.fieldAngleDeg, LV_VIGNETTING_BEAM_CELLS);
        assert.ok(!("problem" in own), `${at} field ${field}`);
        assert.deepEqual(own.grid, beam.grid, `${at} field ${field}: the MTF's lattice at the tab's cells`);
        const { columns, rows } = set.groups!.lattice!;
        const origins = f8(set, "origins");
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const ray = row * columns + column;
            const cell = row * own.grid.columns + own.grid.columns / 2 + column;
            for (let k = 0; k < 3; k++) {
              if (!Object.is(origins[3 * ray + k], own.origins[3 * cell + k])) assert.fail(`${at} ${field} ${ray}`);
            }
          }
        }
        // The halves: a column's x against its mirror column's, and how the tab's tracer classifies the two cells.
        const { x0, step } = own.grid;
        for (let column = 0; column < own.grid.columns / 2; column++) {
          columnPairs++;
          const mirror = own.grid.columns - 1 - column;
          if (!Object.is(x0 + (column + 0.5) * step, -(x0 + (mirror + 0.5) * step))) notMirrored++;
        }
        if (field !== lit.length - 1) return;
        // At the edge of the field, where the beam is cut: every cell of the left half against its mirror on the right.
        for (let row = 0; row < own.grid.rows; row++) {
          for (let column = 0; column < own.grid.columns / 2; column++) {
            const classify = (index: number) => {
              const ray = {
                origin: [own.origins[3 * index], own.origins[3 * index + 1], own.origins[3 * index + 2]] as LvVec3,
                direction: [
                  own.directions[3 * index],
                  own.directions[3 * index + 1],
                  own.directions[3 * index + 2],
                ] as LvVec3,
              };
              const trace = api.traceEngineRay(model.state, ray, setup.traceOptions);
              return api.mtfTraceClassification(trace, model.state, setup.options.stopSemiDiameterMm);
            };
            const left = row * own.grid.columns + column;
            const right = row * own.grid.columns + own.grid.columns - 1 - column;
            cellPairs++;
            if (classify(left) !== classify(right)) classifiedApart++;
          }
        }
      });
    }
    t.diagnostic(
      `${notMirrored} of ${columnPairs} column pairs are not mirror images to the bit; at the edge fields ` +
        `${classifiedApart} of ${cellPairs} cell pairs are classified apart`,
    );
    assert.ok(notMirrored > 0, "the lattice's halves are not each other's mirror to the bit");
  },
);
