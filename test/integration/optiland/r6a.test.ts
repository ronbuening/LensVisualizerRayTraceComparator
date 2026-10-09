// Rung R6a on three engines: the comparator's wave estimator on LensVisualizer's, the reference engine's and
// optiland's traces of the same rays, on LensVisualizer's launch lattice at 64 cells across the beam, with the run's
// own lattice at 32 beside it. Each test skips
// with the reason when LensVisualizer or optiland is missing. Run output goes to a temporary directory.
//
// The rung on all 96 runs of the benchmark is a measurement of its own, made once for the pin of the gate
// (docs/IMPLEMENTATION_PLAN.md, "Amendments since approval"): 15 GB of traces and a quarter of an hour. What runs
// here is 17 of those runs, chosen for what they hold: the run with the largest figure of LensVisualizer
// (`sony-fe-20mm-f18-g` at f/8), the one with the largest figure of the two exact tracers (`nikon-z-24-70f4s` at
// its wide end and best focus), a lens whose every field is undersampled wide open (`nikkor-z50f12`), each in its
// four conditions on the reference line, and one run on the five photopic lines.
//
// Nothing is pinned to a figure of LensVisualizer: every pair is held to the gate of the policy, and a pair of
// LensVisualizer needs no margin beyond it. What is asked of optiland against the reference engine is a thousandth
// of the gate: the two exact tracers agree far inside it, and the gate is of LensVisualizer's rounding.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import { QUARTER_WAVE } from "../../../src/estimators/waveOtf.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, pairsOf, runAndCompare, tempDir } from "./support.ts";
import type { RungPair } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const GATE = loadPolicy().rungs.r6a.metrics["waveMtf.maxAbs"].tolerance as number;

/** The lenses whose four conditions on the reference line are run, and the one run on the photopic lines. */
const LENSES = ["sony-fe-20mm-f18-g", "nikon-z-24-70f4s", "nikkor-z50f12"];
const PHOTOPIC = "sony-fe-20mm-f18-g-f8-photopic";

/** The benchmark suite cut down to the runs of this test, under the suite's own name. */
function waveSuite(t: TestContext): string {
  const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
  const runs = committed.runs.filter(
    (run) =>
      run.name === PHOTOPIC || (run.name.endsWith("-ref") && run.lens.kind === "lv" && LENSES.includes(run.lens.key)),
  );
  const file = join(tempDir(t), "benchmark.json");
  writeFileSync(file, JSON.stringify({ ...committed, runs }));
  return file;
}

/** The figure of a pair, judged or flagged, and whether it was judged. */
function figureOf(pair: RungPair): { value: number; judged: boolean } {
  const judged = pair.metrics["waveMtf.maxAbs"];
  const value = (judged ?? pair.metrics["waveMtf.flagged"])?.value;
  assert.ok(typeof value === "number", `${pair.run} ${pair.engines}: no figure (${pair.reason ?? ""})`);
  return { value, judged: judged !== undefined };
}

test(
  "R6a, three ways: the wave MTF of the same rays is within the gate wherever the lattice is an arbiter",
  { skip, timeout: 1_800_000 },
  (t) => {
    const cycle = runAndCompare(t, {
      suite: waveSuite(t),
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r6a",
    });
    const { manifest } = cycle;
    assert.deepEqual(
      manifest.jobs.filter((job) => job.status !== "ok").map((job) => [job.run, job.rung, job.engine, job.status]),
      [],
    );
    // Three lenses, one of them a zoom at both ends, in four conditions, and one run on the photopic lines.
    assert.equal(manifest.runs.length, 17);
    for (const run of manifest.runs) {
      // Three fields at every line, on the run's own lattice and on the finer one: other sets, and as many.
      const lines = run.name === PHOTOPIC ? 5 : 1;
      assert.equal(run.raySets?.sets.length, 3 * lines, run.name);
      assert.equal(run.fineRaySets?.sets.length, 3 * lines, run.name);
      assert.deepEqual([run.raySets?.problems, run.fineRaySets?.problems], [[], []], run.name);
    }

    const pairs = pairsOf(cycle.comparisons, "r6a", RAYS_TRACE);
    // A field of a run is one comparison, whatever its lines: 51 fields, three pairs of engines.
    assert.equal(pairs.length, 3 * 3 * manifest.runs.length);
    const worst = new Map<string, { value: number; at: string; judged: number; flagged: number }>();
    for (const pair of pairs) {
      // A gated pair passes, or is not judged: no FAIL, no ERROR, and no floor, which the rung does not have.
      assert.equal(pair.verdict, "PASS", `${pair.run} ${pair.engines}: ${pair.reason ?? ""}`);
      const { value, judged } = figureOf(pair);
      // LensVisualizer's lattice has 64 cells across the beam and covers the footprint it scanned: 54 to 80 columns.
      const columns = pair.metrics["lattice.columns"].value as number;
      assert.ok(columns >= 48 && columns <= 96, `${pair.run}: ${columns} columns`);
      assert.equal(pair.metrics["rays.dropped"].value, 0, `${pair.run} ${pair.engines}`);
      assert.equal(pair.metrics["lines.compared"].value, pair.run === PHOTOPIC ? 5 : 1, pair.run);
      const step = pair.metrics["phaseStep.waves"].value as number;
      const moved = pair.metrics["convergence.maxAbs"].value as number;
      if (judged) {
        assert.ok(value <= GATE, `${pair.run} ${pair.engines}: ${value}`);
        assert.ok(step <= QUARTER_WAVE && moved <= 0.01, `${pair.run} ${pair.engines}: judged at ${step}, ${moved}`);
        assert.equal(pair.reason, undefined);
      } else {
        // A flagged field says which fact flagged it, and is held to nothing.
        assert.match(
          pair.reason ?? "",
          /^waveMtf\.maxAbs was not measured: the lattice is no arbiter \((undersampled|not converged): /,
        );
        assert.ok(step > QUARTER_WAVE || moved > 0.005, `${pair.run} ${pair.engines}: flagged at ${step}, ${moved}`);
      }
      // The two exact tracers agree far inside the gate, on a lattice that is an arbiter and on one that is not.
      if (pair.engines === "optiland / ref") assert.ok(value <= GATE / 1000, `${pair.run}: ${value}`);
      const held = worst.get(pair.engines) ?? { value: -1, at: "", judged: 0, flagged: 0 };
      if (judged) held.judged++;
      else held.flagged++;
      if (judged && value > held.value) {
        held.value = value;
        held.at = `${pair.run} ${pair.metrics["waveMtf.maxAbs"].where}`;
      }
      worst.set(pair.engines, held);
    }
    assert.deepEqual([...worst.keys()].sort(), ["lv / optiland", "lv / ref", "optiland / ref"]);
    for (const [engines, held] of [...worst].sort(([a], [b]) => (a < b ? -1 : 1))) {
      // Every pair of engines has fields that are judged: the gate is held, and not only passed by.
      assert.ok(held.judged > 0, engines);
      t.diagnostic(
        `R6a, ${engines}: ${held.judged} fields judged, ${held.flagged} flagged; ` +
          `waveMtf.maxAbs ${held.value.toExponential(2)} at ${held.at}`,
      );
    }

    // Stopped down, every lattice of 64 cells samples its wavefront; wide open the fast lens is undersampled in
    // every field, and none of its fields is judged, by any pair.
    for (const pair of pairs) {
      const step = pair.metrics["phaseStep.waves"].value as number;
      if (pair.run.includes("-f8-")) assert.ok(step <= QUARTER_WAVE, `${pair.run}: ${step} waves a cell`);
      if (pair.run === "nikkor-z50f12-ref") {
        assert.ok(step > QUARTER_WAVE, `${pair.run}: ${step} waves a cell`);
        assert.equal(figureOf(pair).judged, false, pair.run);
        assert.match(pair.reason ?? "", /undersampled: neighbouring cells of the lattice of \d+ columns are /);
      }
    }
    t.diagnostic(
      `R6a on ${manifest.runs.length} runs, three engines, in ${cycle.runSeconds.toFixed(1)} s: ${cycle.verdicts}`,
    );
  },
);
