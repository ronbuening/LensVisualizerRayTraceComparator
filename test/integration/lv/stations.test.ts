// Tier 2: the committed suite selections agree with LV's public station seam and its finite-conjugate gate.
import assert from "node:assert/strict";
import { test } from "node:test";

import { REPO_ROOT } from "../../../src/core/config.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { problemText } from "../../../src/engines/lv/exportProblems.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE, focusStations } from "./support.ts";

test(
  "focus-stations is exactly the finite stations LV certifies, with the same exported cases",
  { skip: LV_UNAVAILABLE },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const expected = await focusStations(binding, createLvExporter(binding));
    const suite = await loadSuite(suitePath("focus-stations"), {
      rootDir: REPO_ROOT,
      sources: { lv: createLvCaseSource(LV_PATH) },
    });
    assert.ok(expected.length > 0);
    assert.deepEqual(
      suite.runs.map((run) => [
        run.spec.lens.kind === "lv" ? run.spec.lens.key : null,
        run.spec.state?.focus?.kind === "focusT" ? run.spec.state.focus.value : null,
        run.spec.state?.zoomT,
        run.opticalCase?.id,
      ]),
      expected.map((s) => {
        return [s.key, s.focusT, s.zoomT, s.exported.ok ? s.exported.opticalCase.id : undefined];
      }),
    );
    for (const [index, run] of suite.runs.entries()) {
      const station = expected[index];
      if (station.refused !== null) {
        assert.ok(!station.exported.ok, station.at);
        assert.equal(station.refused, "unsupported-path", station.at);
        assert.deepEqual(run.problems, station.exported.problems.map(problemText), station.at);
        assert.match(run.problems[0], /^finite-conjugate-unavailable:/, station.at);
        assert.equal(run.opticalCase, null);
      } else {
        assert.deepEqual(run.problems, [], run.spec.name);
        assert.equal(run.opticalCase?.conditions.object.kind, "finite");
      }
    }
    t.diagnostic(
      `${binding.fingerprint().commit}: ${suite.runs.length} declared certified stations, ${expected.filter((s) => s.refused !== null).length} refused`,
    );
  },
);

test(
  "states expands the benchmark zoom to its ends and precisely its LV-published middle stations",
  { skip: LV_UNAVAILABLE, timeout: 600_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const key = "nikon-z-24-70f4s";
    const runtime = binding.api.buildLens((await binding.lens(key)).data);
    const expected = [...new Set([0, ...binding.api.publishedZoomStations(runtime).map((s) => s.zoomT), 1])].sort(
      (a, b) => a - b,
    );
    const suite = await loadSuite(suitePath("states"), {
      rootDir: REPO_ROOT,
      sources: { lv: createLvCaseSource(LV_PATH) },
    });
    for (const run of suite.runs) assert.deepEqual(run.problems, [], run.spec.name);
    const zoom = suite.runs.filter((run) => run.spec.lens.kind === "lv" && run.spec.lens.key === key);
    assert.equal(zoom.length, 16 * expected.length);
    for (let start = 0; start < zoom.length; start += expected.length) {
      assert.deepEqual(
        zoom.slice(start, start + expected.length).map((run) => run.opticalCase?.label.zoomT),
        expected,
      );
    }
    t.diagnostic(`${binding.fingerprint().commit}: ${suite.runs.length} states, zoom coordinates ${expected}`);
  },
);
