// The focus stations LensVisualizer certifies, on rungs R2 and R3, three ways: rays that diverge from an object
// point, where every other ray set of LensVisualizer's is a collimated bundle. They do not start at that point:
// LensVisualizer launches the rays of a station from a plane in front of the lens, each along the line from the
// field's object point, so a ray's path, which is counted from its own origin, is no longer than a collimated
// one's, and no engine meets the first surface from far away.
//
// Needs optiland and LensVisualizer, and skips with the reason when either is missing. Run output goes to a
// temporary directory, and the worker's caches under this repository's gitignored cache directory.
//
// The figures quoted in comments were measured at optiland 4e893f53 and LensVisualizer c05a2ab7 (engine closure
// 78215d72, 151 files). Nothing is pinned to them: every gate is the policy's, a pair of LensVisualizer may be PASS
// or FLOOR, and none is asked to be a floor.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { LV_PATH, LV_UNAVAILABLE, focusStations } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, optilandRoot, runAndCompare } from "./support.ts";
import { assertR2, assertR3 } from "./traced.ts";

test(
  "at every focus station LensVisualizer certifies, R2 and R3 pass three ways and optiland is ref's witness in both",
  { skip: OPTILAND_UNAVAILABLE || LV_UNAVAILABLE, timeout: 1_800_000 },
  async (t) => {
    // Which stations there are is asked of LensVisualizer in this process; the rays go through the commands. The
    // object of a station lies 40 mm to 2.3 m in front of the first vertex at c05a2ab7, and its rays start on a
    // plane 18 mm to 75 mm in front of it. So what a far object would cost optiland, which solves a conic from
    // where the ray is and adds a path up plainly (docs/gotchas.md), does not arise at a station: that is measured
    // on rays that do start at an object point, in workers/python/tests/optiland/test_path.py.
    const binding = await loadLvBinding(LV_PATH);
    const stations = (await focusStations(binding, createLvExporter(binding))).flatMap((station) =>
      station.refused === null && station.exported.ok
        ? [{ ...station, opticalCase: station.exported.opticalCase }]
        : [],
    );
    assert.ok(stations.length >= 10, String(stations.length));
    const distances = stations.map(({ opticalCase, at }) => {
      const placed = opticalCase.conditions.object;
      assert.ok(placed.kind === "finite", at);
      return -placed.z;
    });

    const { rootDir } = optilandRoot(t);
    const suite = {
      contract: CONTRACT_VERSION,
      kind: "suite",
      name: "focus-stations",
      defaults: { aperture: { kind: "wide-open" }, lines: { kind: "reference" }, imagePlane: { kind: "design" } },
      runs: stations.map(({ key, focusT, zoomT }, at) => ({
        name: `${key}-station-${at}`,
        lens: { kind: "lv", key },
        state: { zoomT, focus: { kind: "focusT", value: focusT } },
      })),
    };
    writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
    // Both rungs ask the same requests: each engine traces a set once, and its answer is judged twice.
    const cycle = runAndCompare(t, {
      suite: "suite.json",
      name: "focus-stations",
      engines: "lv,ref,optiland",
      rungs: "r2,r3",
      root: rootDir,
    });
    const { manifest } = cycle;
    assert.equal(manifest.runs.length, stations.length);
    assert.deepEqual(
      manifest.jobs.filter((job) => job.status !== "ok").map((job) => [job.run, job.engine, job.status, job.error]),
      [],
    );
    // Every station has rays, of the three fields of a run, and every set was asked of all three on both rungs.
    for (const run of manifest.runs) assert.ok((run.raySets?.sets.length ?? 0) > 0, run.name);
    const sets = manifest.runs.reduce((total, run) => total + (run.raySets?.sets.length ?? 0), 0);
    assert.equal(manifest.jobs.length, 2 * 3 * sets);
    const computed = manifest.jobs.filter((job) => job.rung === "r2").map((job) => job.storeKey);
    const again = manifest.jobs.filter((job) => job.rung === "r3").map((job) => job.storeKey);
    assert.deepEqual(again, computed, "the answer of a set to R3 is its answer to R2");

    const { pairs } = assertR2(t, "focus stations", cycle.comparisons);
    assert.equal(pairs.length, 3 * sets);
    // Measured: optiland within 3.9e-9 waves of ref in every path, to the last surface, to the image and relative to
    // the chief ray, where its hits are within 4.5e-12 mm: a twenty-fifth of what the floor rule asks of a witness.
    // LensVisualizer is within 8.3e-6 waves of both, and no pair of R3 is a floor.
    const paths = assertR3(t, "focus stations", cycle.comparisons);
    assert.equal(paths.pairs.length, 3 * sets);
    assert.deepEqual([...new Set(paths.pairs.map((pair) => pair.engines))].sort(), [
      "lv / optiland",
      "lv / ref",
      "optiland / ref",
    ]);
    // The rays of a station are LensVisualizer's own, with its chief ray, and the path relative to it is measured
    // wherever every engine lands that ray: in all but one set at c05a2ab7, where an aperture stops it for all three.
    assert.ok(paths.withoutChief.length < sets / 4, JSON.stringify(paths.withoutChief));
    t.diagnostic(`focus stations: no chief ray landed in ${JSON.stringify(paths.withoutChief)}`);
    assert.match(
      cycle.verdicts,
      /^focus-stations: \d+ pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
    t.diagnostic(
      `focus stations: ${stations.length} stations of ${new Set(stations.map(({ key }) => key)).size} lenses, ` +
        `${sets} ray sets, the object ${Math.min(...distances).toFixed(0)} mm to ` +
        `${Math.max(...distances).toFixed(0)} mm in front of the first vertex; ${cycle.verdicts}`,
    );
    for (const pair of paths.pairs.filter((pair) => pair.verdict === "FLOOR")) {
      t.diagnostic(`focus stations: ${pair.run}, ${pair.engines}: ${pair.reason ?? ""}`);
    }
  },
);
