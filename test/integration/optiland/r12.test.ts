// Rung R12b on the real engines, through `lvrtc run`, `compare` and `report`, on four runs of the benchmark and the two
// focus stations of a macro lens: a lens wide open on its reference line at its design plane, the same on the photopic
// lines, the same at the best axial focus, the same at the MTF tab's f/8 comparison, and the Sigma 105 mm macro at 1:2
// and 1:1. The rung on the benchmark, states and focus-stations suites is a measurement of its own (docs/REFERENCE.md,
// "Stage 6.7"), seconds. Each test skips with the reason when LensVisualizer or optiland is missing. Run output goes to
// a temporary directory.
//
// R12b is recorded. What is held is that LensVisualizer answers the ask at the authored line on the design plane and
// says why not of the other, that optiland answers every ask, that every line is of two methods within the limit of the
// sorting, so the pair is RECORDED; that the values both engines state under one definition agree within the bands of
// policy 24 (the owner, 2026-10-29): the tab's "Image-space f/#", optiland's FNO(), within 2e-13 and the pupil within
// 2e-12 mm everywhere, the focal length to 1e-9 mm, the stop within a unit in the last place; that since
// LensVisualizer #933 the tab states both working f-numbers at infinity focus (the paraxial one within 2e-13, the real
// marginal ray's within 7e-8 of optiland's), and at the macro's finite stations neither under the case's conjugate, its
// values at its own paraxial object recorded under its sampling; and that the report claims nothing it may not. What
// the rung records beside them (docs/gotchas.md, "Summary") is written as diagnostics.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { SUMMARY_NATIVE } from "../../../src/contract/quantities/summaryNative.ts";
import type { Suite } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../../src/report/index.ts";
import { NOT_COVERED, wordingProblems } from "../../../src/report/wording.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_PYTHON, OPTILAND_UNAVAILABLE, lvrtc, pairsOf, runAndCompare, tempDir } from "./support.ts";
import type { RungPair } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R12B = loadPolicy().rungs.r12b;

const DESIGN = "nikkor-z50f12-ref";
const PHOTOPIC = "nikkor-z50f12-photopic";
const BEST = "nikkor-z50f12-best-ref";
const F8 = "nikkor-z50f12-f8-ref";
const MACRO = "macro";
const MACRO_KEY = "sigma-105mm-f28-dg-dn-macro-art";

/** The rung's limit of the sorting: two rear focal points lie within it, or the line is data. */
const SAME_SYSTEM_MM = R12B.metrics["rearFocus.maxAbs"].attention as number;
/** A figure's attention band in the policy at hand. */
const band = (name: string): number => R12B.metrics[name].attention as number;

test(
  "R12b: LensVisualizer's summary tab and aperture control beside optiland's accessors and working f-number",
  { skip, timeout: 900_000 },
  (t) => {
    const committed: Suite = JSON.parse(readFileSync(suitePath("benchmark"), "utf8"));
    const suite = join(tempDir(t), "benchmark.json");
    const runs = [
      ...committed.runs.filter((run) => [DESIGN, PHOTOPIC, BEST, F8].includes(run.name)),
      { name: MACRO, lens: { kind: "lv", key: MACRO_KEY, stations: "certified-focus" }, lines: { kind: "reference" } },
    ];
    writeFileSync(suite, JSON.stringify({ ...committed, contract: "1.3", runs }));
    // R12b is asked of its own two engines whatever is named.
    const { manifest, comparisons, runsDir } = runAndCompare(t, {
      suite,
      name: "benchmark",
      engines: "lv,optiland",
      rungs: "r12b",
    });

    const native = manifest.jobs.filter((job) => job.rung === "r12b");
    assert.deepEqual([...new Set(native.map((job) => job.engine))].sort(), ["lv", "optiland"]);
    // A photopic run has no line of the prescription's own indices and no ask; the macro lens has two stations.
    assert.ok(!native.some((job) => job.run === PHOTOPIC));
    const stations = manifest.runs.filter((run) => run.name.startsWith(`${MACRO}-`)).map((run) => run.name);
    assert.equal(stations.length, 2, stations.join(", "));
    assert.equal(native.length, 2 * (3 + stations.length));
    const statuses = (run: string, engine: string): string[] =>
      native
        .filter((job) => job.run === run && job.engine === engine)
        .map((job) =>
          job.status === "unsupported" ? (job.unsupported ?? []).map((u) => u.item).join("+") : job.status,
        );
    for (const run of [DESIGN, F8, ...stations]) assert.deepEqual(statuses(run, "lv"), ["ok"], run);
    assert.deepEqual(statuses(BEST, "lv"), ["focus.off-design"]);
    for (const run of [DESIGN, BEST, F8, ...stations]) assert.deepEqual(statuses(run, "optiland"), ["ok"], run);

    const recorded = pairsOf(comparisons, "r12b", SUMMARY_NATIVE);
    const of = (run: string): RungPair => recorded.find((pair) => pair.run === run)!;
    assert.equal(of(BEST).verdict, "UNSUPPORTED");
    const value = (pair: RungPair, name: string): number | null | undefined => pair.metrics[name]?.value;
    for (const run of [DESIGN, F8, ...stations]) {
      const pair = of(run);
      assert.equal(pair.verdict, "RECORDED", `${run}: ${pair.reason ?? ""}`);
      assert.deepEqual(
        [value(pair, "lines.compared"), value(pair, "lines.data"), value(pair, "lines.unavailable")],
        [1, 0, 0],
        run,
      );
      const rear = value(pair, "rearFocus.maxAbs");
      assert.ok(typeof rear === "number" && rear <= SAME_SYSTEM_MM, `${run} ${rear}`);
      // One definition, one number: the image-space f-number and the pupil within their bands, the focal length, the
      // stop and the track.
      const close: [string, number][] = [
        ["imageSpaceFNumber.maxAbs", band("imageSpaceFNumber.maxAbs")],
        ["entrancePupilDiameter.maxAbs", band("entrancePupilDiameter.maxAbs")],
        ["focalLength.maxAbs", 1e-9],
        ["stopDiameter.maxAbs", 1e-12],
        ["totalTrack.maxAbs", 0],
      ];
      for (const [figure, within] of close) {
        const difference = value(pair, figure);
        assert.ok(typeof difference === "number" && difference <= within, `${run} ${figure} ${difference}`);
      }
      // Since LensVisualizer #933 the tab states both working f-numbers at infinity focus, of the case's own object:
      // measured, within their bands. At a finite station its object is the paraxial conjugate of its image plane, not
      // the case's certified one: both null, the figures unmeasured with the reason saying whose.
      for (const figure of ["paraxialWorkingFNumber.maxAbs", "workingFNumber.maxAbs"]) {
        const difference = value(pair, figure);
        if (stations.includes(run)) {
          assert.equal(difference, undefined, `${run} ${figure}`);
          assert.ok((pair.reason ?? "").includes(`${figure} was not measured: lv-summary-tab states none`), figure);
        } else {
          assert.ok(typeof difference === "number" && difference <= band(figure), `${run} ${figure} ${difference}`);
        }
      }
    }

    // What the rung records of the definitions: the tab's "Image-space f/#", its marked f-number and its two working
    // f-numbers (at a finite station those of its own paraxial object) beside optiland's.
    for (const run of [DESIGN, F8, ...stations]) {
      const set = comparisons.comparisons.find(
        (candidate) => candidate.requestId === of(run).requestId && candidate.mode === "pairwise",
      );
      const side = (engine: string) => set?.participants.find((participant) => participant.engine === engine)?.recorded;
      const [lv, optiland] = [side("lv"), side("optiland")];
      assert.ok(lv !== undefined && optiland !== undefined, run);
      const at = (values: readonly (number | null)[]): number => values[0] ?? Number.NaN;
      const working = at(optiland.workingFNumber);
      assert.ok(Number.isFinite(working), run);
      const finite = stations.includes(run);
      if (finite) {
        // The tab's values at its own paraxial object are recorded: its paraxial working f-number, and its real
        // marginal ray's, or the surface that vignettes that ray.
        assert.ok(Number.isFinite(at(lv.lvParaxialWorkingFNumberAtParaxialObject ?? [])), run);
        const vignettedAt = at(lv.lvMarginalRayVignettedSurfaceIndex ?? []);
        assert.ok(
          Number.isFinite(at(lv.lvWorkingFNumberAtParaxialObject ?? [])) !== Number.isFinite(vignettedAt),
          `${run}: ${Object.keys(lv).join(", ")}`,
        );
      }
      const lvParaxial = at((finite ? lv.lvParaxialWorkingFNumberAtParaxialObject : lv.paraxialWorkingFNumber) ?? []);
      const lvWorking = at((finite ? lv.lvWorkingFNumberAtParaxialObject : lv.workingFNumber) ?? []);
      t.diagnostic(
        `${run}: tab image-space f/# ${at(lv.imageSpaceFNumber).toFixed(4)}, marked f/${at(lv.nominalFNumber).toFixed(3)}, ` +
          `paraxial working ${lvParaxial.toFixed(4)}, working ${lvWorking.toFixed(4)}${finite ? " (at its paraxial object)" : ""}` +
          ` (marginal ray vignetted at ${at(lv.lvMarginalRayVignettedSurfaceIndex ?? [])}); ` +
          `optiland working ${working.toFixed(4)}, paraxial working ${at(optiland.paraxialWorkingFNumber).toFixed(4)}, ` +
          `unaimed ${at(optiland.workingFNumberUnaimed).toFixed(4)}`,
      );
    }
    // At 1:1 the tab's image-space f-number, the quotient of the focused focal length and a pupil of rays parallel to
    // the axis, is far below the working f-number of the real rim rays (at LV 607ff23ae, 1.056 against optiland's
    // 4.874; 1.028 against 4.747 at 098c91ef6): it is no working f-number there. Since #933 the tab states its working
    // f-numbers beside it, at its own paraxial object (paraxial 4.847; its real marginal ray vignetted at surface 13).
    const closest = stations[stations.length - 1];
    const set = comparisons.comparisons.find(
      (candidate) => candidate.requestId === of(closest).requestId && candidate.mode === "pairwise",
    );
    const recordedOf = (engine: string) =>
      set?.participants.find((participant) => participant.engine === engine)?.recorded;
    const tabWorking = recordedOf("lv")?.imageSpaceFNumber[0] ?? Number.NaN;
    const realWorking = recordedOf("optiland")?.workingFNumber[0] ?? Number.NaN;
    assert.ok(tabWorking < realWorking / 2, `${closest}: ${tabWorking} against ${realWorking}`);

    const reported = lvrtc(runsDir, REPO_ROOT, ["report", "benchmark"], OPTILAND_PYTHON);
    assert.equal(reported.code, 0, reported.out + reported.err);
    const markdown = readFileSync(join(runsDir, "benchmark", REPORT_MARKDOWN_FILE), "utf8");
    assert.deepEqual(wordingProblems(markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(markdown.includes(`- ${sentence}\n`), sentence);
  },
);
