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
// 78215d72, 151 files). These are historical measurements, not current baseline provenance. Every gate is
// the policy's; policy version 11 has no floors and every compared pair must PASS, but for the failures
// docs/known-failures.focus-stations.json lists (the owner's decision of 2026-11-16), which must be met exactly as
// listed, as `lvrtc baseline write focus-stations` admits them: each failing figure of the pair, with its evidence.
import assert from "node:assert/strict";
import { test } from "node:test";

import { buildBaseline } from "../../../src/baseline/build.ts";
import {
  classifyCatalog,
  readKnownFailures,
  unclassifiedFailures,
  unusedKnownFailures,
} from "../../../src/baseline/catalog.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { suitePath } from "../../suites/support.ts";
import { createLvCaseSource } from "../../../src/engines/lv/caseSource.ts";
import { LV_PATH, LV_UNAVAILABLE } from "../lv/support.ts";
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
    const suite = await loadSuite(suitePath("focus-stations"), {
      rootDir: REPO_ROOT,
      sources: { lv: createLvCaseSource(LV_PATH) },
    });
    const stations = suite.runs.flatMap(({ spec, opticalCase, problems }) => {
      if (!opticalCase) {
        assert.match(problems[0], /^finite-conjugate-unavailable:/, spec.name);
        return [];
      }
      assert.ok(opticalCase, `${spec.name}: ${problems.join("; ")}`);
      return [{ at: spec.name, key: opticalCase.label.lensKey, opticalCase }];
    });
    assert.ok(stations.length >= 10, String(stations.length));
    const distances = stations.map(({ opticalCase, at }) => {
      const placed = opticalCase.conditions.object;
      assert.ok(placed.kind === "finite", at);
      return -placed.z;
    });

    const { rootDir } = optilandRoot(t);
    // Both rungs ask the same requests: each engine traces a set once, and its answer is judged twice.
    const cycle = runAndCompare(t, {
      suite: suitePath("focus-stations"),
      name: "focus-stations",
      engines: "lv,reference-tracer,optiland",
      rungs: "ray-trace,optical-path",
      root: rootDir,
      compareMayFail: true,
    });
    const { manifest } = cycle;
    assert.deepEqual(
      manifest.runs.map((run) => [run.name, run.caseId]),
      suite.runs.map((run) => [run.spec.name, run.opticalCase?.id ?? null]),
    );
    assert.deepEqual(
      manifest.jobs.filter((job) => job.status !== "ok").map((job) => [job.run, job.engine, job.status, job.error]),
      [],
    );
    // Every station has rays, of the three fields of a run, but one whose every field is a coded problem of that
    // field (docs/gotchas.md, "A field can lie outside the model"; a field without rays fails nothing): at
    // LensVisualizer f5b456fec the Pentax A 200 mm macro's second station, `chief-ray-failed` at every field. Every
    // set was asked of all three engines on both rungs.
    const withoutRays: string[] = [];
    for (const run of manifest.runs) {
      if (run.caseId === null) assert.match(run.problems[0], /^finite-conjugate-unavailable:/, run.name);
      else if ((run.raySets?.sets.length ?? 0) === 0) {
        const problems = run.raySets?.problems ?? [];
        assert.ok(
          problems.length > 0 &&
            problems.every((p) => /^(?:chief-ray-failed|vignetted|outside-modeled-field):/.test(p)),
          `${run.name}: ${JSON.stringify(problems)}`,
        );
        withoutRays.push(run.name);
      }
    }
    // Pinned at f5b456fec: another station without rays is a change to read, not a coded problem to accept.
    assert.deepEqual(withoutRays, ["certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2"]);
    const sets = manifest.runs.reduce((total, run) => total + (run.raySets?.sets.length ?? 0), 0);
    assert.equal(manifest.jobs.length, 2 * 3 * sets);
    const computed = manifest.jobs.filter((job) => job.rung === "ray-trace").map((job) => job.storeKey);
    const again = manifest.jobs.filter((job) => job.rung === "optical-path").map((job) => job.storeKey);
    assert.deepEqual(again, computed, "the answer of a set to R3 is its answer to R2");

    // The failures of focus-stations are those its list names, each exactly: every failing figure of a pair is an
    // entry with that pair's evidence, and every entry is met. Nothing else fails or ends in an error.
    const known = readKnownFailures(REPO_ROOT, "focus-stations");
    const classified = classifyCatalog(buildBaseline(manifest, cycle.comparisons, loadPolicy()), known);
    assert.deepEqual(unclassifiedFailures(classified), []);
    assert.deepEqual(unusedKnownFailures([classified], known), []);
    const listed = new Set(known.map((entry) => `${entry.run} ${entry.engines.join(" / ")}`));
    t.diagnostic(`focus stations: ${known.length} listed failures met exactly (${[...listed].join("; ")})`);

    // Only the requests the listed FAILs are of are held to the gates rather than the exact tracers' bounds.
    const { pairs, listedRequests } = assertR2(t, "focus stations", cycle, listed);
    assert.equal(listedRequests.size, 2, JSON.stringify([...listedRequests]));
    assert.equal(pairs.length, 3 * sets);
    // Measured: optiland within 3.9e-9 waves of ref in every path, to the last surface, to the image and relative to
    // the chief ray, where its hits are within 4.5e-12 mm: a twenty-fifth of what the floor rule asks of a witness.
    // LensVisualizer is within 8.3e-6 waves of both, and no pair of R3 is a floor.
    const paths = assertR3(t, "focus stations", cycle.comparisons, listedRequests);
    assert.equal(paths.pairs.length, 3 * sets);
    assert.deepEqual([...new Set(paths.pairs.map((pair) => pair.engines))].sort(), [
      "lv / optiland",
      "lv / reference-tracer",
      "optiland / reference-tracer",
    ]);
    // The rays of a station are LensVisualizer's own, with its chief ray, and the path relative to it is measured
    // wherever every engine lands that ray: in all but one set at c05a2ab7, where an aperture stops it for all three.
    assert.ok(paths.withoutChief.length < sets / 4, JSON.stringify(paths.withoutChief));
    t.diagnostic(`focus stations: no chief ray landed in ${JSON.stringify(paths.withoutChief)}`);
    // Every pair the comparison made (pairwise and against the reference engine) passes but those the list names,
    // which fail by their request pairs alone.
    const compared = cycle.comparisons.comparisons.flatMap((set) => set.pairs.map((pair) => ({ run: set.run, pair })));
    const failing = compared.filter(({ pair }) => pair.verdict !== "PASS");
    for (const { run, pair } of failing)
      assert.ok(
        pair.verdict === "FAIL" && listed.has(`${run} ${[pair.a, pair.b].sort().join(" / ")}`),
        JSON.stringify({ run, pair }),
      );
    assert.equal(
      cycle.verdicts,
      failing.length === 0
        ? `focus-stations: ${compared.length} pairs: ${compared.length} Pass`
        : `focus-stations: ${compared.length} pairs: ${compared.length - failing.length} Pass, ${failing.length} Fail`,
    );
    t.diagnostic(
      `focus stations: ${stations.length} stations of ${new Set(stations.map(({ key }) => key)).size} lenses, ` +
        `${sets} ray sets, the object ${Math.min(...distances).toFixed(0)} mm to ` +
        `${Math.max(...distances).toFixed(0)} mm in front of the first vertex; ${cycle.verdicts}`,
    );
  },
);
