// LensVisualizer's focus-breathing chart against rung R1: the chart plots, at each focus position of the current zoom
// position, the focal length of the prepared state (`computeFocusBreathingSeries`, `computeFocusEFL`); `lv` answers
// `paraxial.first-order` with LensVisualizer's paraxial kernel on the same prepared state (`answerLvFirstOrder`), which
// R1 judges against `ref` and optiland. Held here, on every benchmark lens at infinity focus, both ends of its zoom,
// and every focus station of those lenses that the exporter exports (LensVisualizer certifies its object distance):
//
// - the chart's focal length of the state is `lv`'s R1 focal length to within four units in the last place (two
//   arithmetics of one kernel: -1/u of one ray, against the cardinal construction of the system matrix);
// - the chart's own sample at the state's focus position is that focal length, and its reference, the sample at
//   infinity, is the focal length LensVisualizer stores for the zoom position, which R1's infinity case is.
//
// So R1 judges the chart's focal length wherever a state is a case. The chart's other positions (21, evenly spaced) are
// no case: the exporter refuses a focus position whose object distance LensVisualizer does not certify, which is what
// a finite case needs. Nothing is written. Measured at LV d6df08c7f and cfa91d0a5 (engine closure c866fbff with the
// stage's names), and again at 098c91ef6 (closure fef2e248).
import assert from "node:assert/strict";
import { test } from "node:test";

import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { answerLvFirstOrder } from "../../../src/engines/lv/firstOrder.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { ulp } from "../../engines/ref/support.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE, documentedConjugates } from "./support.ts";

const skip = LV_UNAVAILABLE;

test(
  "the breathing chart's focal length of every exported state is lv's R1 focal length, to four units",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const exporter = createLvExporter(binding);
    const build = createLensBuilder(binding);
    let states = 0;
    let stations = 0;
    let worst = 0;
    for (const key of BENCHMARK_KEYS) {
      const { data } = await binding.lens(key);
      const zooms = data.zoom?.stations !== undefined && data.zoom.stations.length >= 2 ? [0, 1] : [0];
      const conjugates = documentedConjugates(data);
      const wanted = [
        ...zooms.map((zoomT) => ({ focusT: 0, zoomT })),
        ...conjugates.map(({ focusT, zoomT }) => ({ focusT, zoomT })),
      ];
      for (const { focusT, zoomT } of wanted) {
        const options =
          focusT === 0 ? { state: { zoomT } } : { state: { zoomT, focus: { kind: "focusT" as const, value: focusT } } };
        const exported = await exporter.exportLens(key, options);
        if (!exported.ok) continue;
        const rebuilt = await rebuildCase(binding, build, exported.opticalCase);
        assert.ok(rebuilt.ok, key);
        const model = rebuilt.model;
        const answer = answerLvFirstOrder(api, model);
        assert.ok(answer.supported, key);
        const efl = decodeNdArray(answer.data.efl).values[0];
        const request = api.createAnalysisRequest({
          preparedState: model.state,
          dynamicEFL: 0,
          currentEPSD: 1,
          currentPhysStopSD: 1,
        });
        const chart = api.computeFocusEFL(request);
        const units = Math.abs(chart - efl) / ulp(Math.max(Math.abs(chart), Math.abs(efl)));
        assert.ok(units <= 4, `${key} at focus ${focusT}, zoom ${zoomT}: ${chart} against ${efl}`);
        worst = Math.max(worst, units);
        const series = api.computeFocusBreathingSeries(request);
        const here = series.find((sample) => sample.focusT === model.state.focusT);
        assert.ok(here !== undefined && Object.is(here.efl, chart), `${key}: the chart's own sample`);
        // The chart's reference is its sample at infinity focus: the focal length of the zoom position's infinity case.
        const infinity = api.computeFocusEFL(
          api.createAnalysisRequest({
            preparedState: api.prepareRuntimeState(model.runtime, 0, model.state.zoomT),
            dynamicEFL: 0,
            currentEPSD: 1,
            currentPhysStopSD: 1,
          }),
        );
        assert.ok(Object.is(series[0].efl, infinity) && series[0].focusT === 0, `${key}: the chart's reference`);
        states++;
        if (focusT !== 0) stations++;
      }
    }
    assert.ok(stations > 0, "a focus station of the benchmark lenses is a case");
    t.diagnostic(`${states} states (${stations} focus stations); the largest difference is ${worst} units`);

    // A position of the chart between the stations is no case: its object distance is not one LensVisualizer certifies.
    const refused = await exporter.exportLens(BENCHMARK_KEYS[0], { state: { focus: { kind: "focusT", value: 0.5 } } });
    assert.equal(refused.ok, false);
  },
);
