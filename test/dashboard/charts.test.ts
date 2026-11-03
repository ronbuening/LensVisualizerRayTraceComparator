// The verification of Stage 8.2: snapshot tests on fixture runs. Every golden chart (`chartGoldens.ts`) is drawn
// from the fixture and held byte for byte to its file under test/fixtures/golden/dashboard, which only
// `node test/report/writeGolden.ts` writes. Beside them: the largest bar of each R2 pair is the pair's
// hits.maxDistance, a value that is not a finite number is a gap and never 0, a store entry that is not there or
// cannot be read is a problem on the page and never a failure, a heat map of too many runs is left out, and the
// same files draw the same bytes with no absolute path and no sentence the wording lint rejects.
import assert from "node:assert/strict";
import { cpSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { gzipSync } from "node:zlib";

import type { RunManifest } from "../../src/core/manifest.ts";
import { HEAT_MAP_ROWS, baselineHeatMap } from "../../src/dashboard/chartViews.ts";
import type { MtfOverlayView } from "../../src/dashboard/chartViews.ts";
import { renderHeatMap } from "../../src/dashboard/charts/heatMap.ts";
import { differenceCaption, renderMtfDifference, renderMtfOverlay } from "../../src/dashboard/charts/mtf.ts";
import { renderDeviation } from "../../src/dashboard/charts/deviation.ts";
import { linearScale, px } from "../../src/dashboard/charts/svg.ts";
import { buildSectionCharts } from "../../src/dashboard/chartViews.ts";
import type { ComparisonContext } from "../../src/compare/comparator.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { raysGeometryComparator } from "../../src/compare/raysGeometry.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import { encodeF8, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { StoreEntry } from "../../src/core/resultStore.ts";
import { renderSection } from "../../src/dashboard/html.ts";
import { createViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import { tempDir } from "../core/support.ts";
import { CHART_GOLDEN_DIR, chartGoldens } from "./chartGoldens.ts";
import { RAYS_SUITE, REORDERED_SUITE, WARPED, buildFixture, readManifest, titleTexts, visibleText } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

let fixture: DashboardFixture;
before(async () => {
  fixture = await buildFixture();
});
after(() => fixture.remove());

const notAsked = () => ({ state: "not-asked" }) as const;

test("snapshot: every golden chart of the fixture runs is drawn to its file byte for byte, and no golden is stale", () => {
  const goldens = chartGoldens(fixture);
  assert.ok(goldens.size >= 9, `${goldens.size} golden charts`);
  for (const [file, svg] of goldens) {
    const expected = readFileSync(join(CHART_GOLDEN_DIR, file), "utf8");
    assert.equal(svg, expected, `${file}: run node test/report/writeGolden.ts after a change meant to change a chart`);
  }
  assert.deepEqual(
    readdirSync(CHART_GOLDEN_DIR).sort(),
    [...goldens.keys()].sort(),
    "a golden for each chart, and no other",
  );
});

test("a golden chart stands alone: its own <style>, a <title> and <desc>, axis labels, and no absolute path or banned claim", () => {
  for (const [file, svg] of chartGoldens(fixture)) {
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" class="lvc" /, file);
    assert.match(svg, /\n<title>[^<]+<\/title>\n<desc>[^<]+<\/desc>\n<style>/, file);
    assert.ok(svg.endsWith("</svg>\n"), file);
    assert.doesNotMatch(svg, /\bid="/, `${file}: no ids`);
    for (const absolute of [fixture.directory, REPO_ROOT, tmpdir(), "/Users/", "/private/", "/home/"]) {
      assert.ok(!svg.includes(absolute), `${file} names ${absolute}`);
    }
    if (!file.includes("heat-map")) {
      assert.match(svg, /Frequency \(cycles\/mm\)|Surface/, `${file}: an x axis with its unit`);
    }
    assert.deepEqual(wordingProblems(visibleText(svg)), [], file);
    assert.deepEqual(wordingProblems(titleTexts(svg).join("\n\n")), [], `${file}: its tooltips`);
  }
  // Drawn twice, the same bytes (and the snapshot above holds them to a fixture writeGolden made apart).
  assert.deepEqual([...chartGoldens(fixture)], [...chartGoldens(fixture)]);
});

test("the largest bar of every R2 pair is the pair's hits.maxDistance in comparisons.json, on a bent copy and a faithful one", () => {
  const views = createViews(
    createSources({ rootDir: fixture.raysRootDir, runsDir: fixture.raysRunsDir, policyFile: fixture.raysPolicyFile }),
    notAsked,
  );
  const comparisons = JSON.parse(readFileSync(join(fixture.raysRunsDir, RAYS_SUITE, "comparisons.json"), "utf8"));
  let charts = 0;
  let bent = 0;
  for (const entry of views.run(RAYS_SUITE).sections.filter((section) => section.rung === "r2")) {
    const view = views.section(RAYS_SUITE, entry.section);
    assert.ok(view !== null);
    assert.equal(view.charts.deviations.length, 3, "three pairs of three engines");
    for (const deviation of view.charts.deviations) {
      charts++;
      assert.deepEqual(deviation.problems, []);
      const set = comparisons.comparisons.find(
        (each: { rung: string; requestId: string; pairs: { a: string; b: string }[] }) =>
          each.rung === "r2" &&
          each.requestId === view.requestId &&
          each.pairs.some((pair) => pair.a === deviation.a && pair.b === deviation.b),
      );
      const pair = set.pairs.find((each: { a: string; b: string }) => each.a === deviation.a && each.b === deviation.b);
      const recorded = pair.metrics.find((metric: { name: string }) => metric.name === "hits.maxDistance").value;
      const values = deviation.bars.map((bar) => bar.distance.value).filter((value): value is number => value !== null);
      assert.ok(Object.is(Math.max(...values), recorded), `${deviation.a} ${deviation.b}: ${Math.max(...values)}`);
      assert.ok(Object.is(deviation.maxDistance?.value, recorded));
      if (deviation.b === WARPED || deviation.a === WARPED) {
        bent++;
        assert.ok(recorded > 1e-8, "the bent copy's hits part behind its radius");
        // The surfaces before the bent one are the same surfaces.
        for (const bar of deviation.bars.slice(0, 8)) assert.equal(bar.distance.value, 0, `surface ${bar.surface}`);
      } else
        assert.ok(
          values.every((value) => value === 0),
          "a faithful copy: every bar 0",
        );
    }
  }
  assert.equal(charts, 6);
  assert.equal(bent, 4);
  // A bar of 0 is a ring on the axis, never a bar of no height, and the tolerance is drawn as a line.
  const twin = chartGoldens(fixture).get("rays-r2-axis.deviation-ref-ref-twin.svg") ?? "";
  assert.equal((twin.match(/<circle class="ring"/g) ?? []).length, 11 + 1, "a ring per surface and one in the legend");
  assert.doesNotMatch(twin, /<rect class="bar"/);
  assert.match(
    twin,
    /<line class="gate" [^>]*><title>tolerance 1\.00e-8 mm: policy\/rays-policy\.json \/rungs\/r2\/metrics\/hits\.maxDistance\/tolerance<\/title>/,
  );
});

test("a view says when the largest bar is not the recorded hits.maxDistance", (t) => {
  const runsDir = join(tempDir(t), "runs");
  cpSync(fixture.raysRunsDir, runsDir, { recursive: true });
  const file = join(runsDir, RAYS_SUITE, "comparisons.json");
  const comparisons = JSON.parse(readFileSync(file, "utf8"));
  for (const set of comparisons.comparisons) {
    for (const pair of set.pairs) {
      for (const metric of pair.metrics) if (metric.name === "hits.maxDistance") metric.value = 0.5;
    }
  }
  writeFileSync(file, `${JSON.stringify(comparisons)}\n`);
  const views = createViews(
    createSources({ rootDir: fixture.raysRootDir, runsDir, policyFile: fixture.raysPolicyFile }),
    notAsked,
  );
  const section = views.run(RAYS_SUITE).sections.find((each) => each.rung === "r2");
  const view = views.section(RAYS_SUITE, section?.section ?? -1);
  const problems = view?.charts.deviations.flatMap((deviation) => deviation.problems) ?? [];
  assert.equal(problems.length, 3);
  assert.ok(
    problems.every((problem) => problem.endsWith("is not the hits.maxDistance the comparison records, 5.00e-1 mm.")),
  );
  assert.ok(visibleText(renderSection(view!)).includes(problems[0]));
});

test("a value that is not a finite number is a gap: never drawn, never 0", () => {
  // The stand-in for optiland has no curves of field 1 of `edge` in R5g: NaN at every frequency, null in the view.
  const views = createViews(
    createSources({ rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile }),
    notAsked,
  );
  const entry = views.run("r5g-stand-ins").sections.find((section) => section.run === "edge");
  const view = views.section("r5g-stand-ins", entry?.section ?? -1);
  const overlay = view?.charts.overlays.find((chart) => chart.element === 2 && chart.cut === "sagittal");
  const optiland = overlay?.series.find((series) => series.engine === "optiland");
  assert.equal(optiland?.state, "unavailable");
  assert.deepEqual(optiland?.values?.values, [null, null, null, null]);
  const svg = renderMtfOverlay(overlay!, "edge, r5g");
  assert.doesNotMatch(svg, /<title>optiland, sagittal at/, "no point of optiland's");
  assert.match(svg, /optiland \(unavailable: frequency-beyond-bins\)/, "named in the legend with its status");
  const pairs = view?.charts.differences.filter((chart) => chart.element === 2).flatMap((chart) => chart.pairs) ?? [];
  for (const pair of pairs.filter((each) => each.a === "optiland" || each.b === "optiland")) {
    assert.deepEqual(pair.points, [], "no difference of a value that is not a finite number");
  }

  // A gap inside a curve: two lines, no point at the gap, and nothing at 0.
  const curve = (values: (number | null)[]) => ({ values, source: { document: "store:x" as const, pointer: "/v" } });
  const gapped: MtfOverlayView = {
    element: 0,
    field: null,
    cut: "sagittal",
    setAside: [],
    series: [
      {
        engine: "lv",
        step: null,
        state: "ok",
        reason: null,
        noCurves: null,
        frequencies: curve([10, 20, 30, 40, 50]),
        values: curve([0.75, 0.5, null, 0.25, 0.125]),
      },
    ],
  };
  const drawn = renderMtfOverlay(gapped, "a gap");
  assert.equal((drawn.match(/<polyline /g) ?? []).length, 2, "the line stops at the gap and starts again after it");
  assert.equal(
    (drawn.match(/<circle class="dot s0" cx/g) ?? []).length,
    4 + 1,
    "a point for each value and the legend's",
  );
  assert.doesNotMatch(drawn, / at 30 cycles\/mm/);
  // No point sits on the axis: a gap is never drawn as 0.
  assert.doesNotMatch(drawn, new RegExp(`<circle class="dot s0" cx="[^"]+" cy="${px(256)}"`));
});

test("a store entry that is not there, or cannot be read, is a problem on the page and never a failure", (t) => {
  const runsDir = join(tempDir(t), "runs");
  cpSync(fixture.mtfRunsDir, runsDir, { recursive: true });
  const manifest: RunManifest = readManifest(runsDir, "r5-stand-ins");
  const jobs = manifest.jobs.filter((job) => job.run === "edge" && job.storeKey !== null);
  const [missing, corrupt] = [jobs.find((job) => job.engine === "wave"), jobs.find((job) => job.engine === "lv")];
  assert.ok(missing?.storeKey && corrupt?.storeKey);
  rmSync(join(runsDir, "store", `${missing.storeKey}.json.gz`));
  writeFileSync(join(runsDir, "store", `${corrupt.storeKey}.json.gz`), gzipSync("{ not json"));
  const views = createViews(
    createSources({ rootDir: fixture.mtfRootDir, runsDir, policyFile: fixture.mtfPolicyFile }),
    notAsked,
  );
  const entry = views.run("r5-stand-ins").sections.find((section) => section.run === "edge");
  const view = views.section("r5-stand-ins", entry?.section ?? -1);
  assert.ok(view !== null);
  const text = DASHBOARD_TEXT.charts;
  // In the order of the jobs: by engine.
  assert.equal(view.charts.problems.length, 2);
  assert.match(
    view.charts.problems[0],
    /^The store entry for lv cannot be read, so that answer is not drawn: store entry [0-9a-f]{64}: it is malformed JSON/,
  );
  assert.equal(view.charts.problems[1], text.storeMissing("wave", missing.storeKey));
  const page = visibleText(renderSection(view));
  for (const problem of view.charts.problems) assert.ok(page.includes(problem), problem);
  assert.deepEqual(wordingProblems(page), []);
  for (const overlay of view.charts.overlays) {
    const wave = overlay.series.find((series) => series.engine === "wave");
    const lv = overlay.series.find((series) => series.engine === "lv");
    assert.deepEqual([wave?.state, wave?.values, wave?.noCurves], ["no-answer", null, "missing"]);
    assert.deepEqual([lv?.state, lv?.noCurves], ["no-answer", "unreadable"]);
    // The legend says a word; the sentence (with the key and the store's words) is the entry's tooltip.
    const svg = renderMtfOverlay(overlay, "edge, r5");
    assert.match(svg, />wave \(no curves: missing\)<\/text>/);
    assert.match(svg, />lv \(no curves: unreadable\)<\/text>/);
    assert.ok(svg.includes(`<title>wave: ${text.storeMissing("wave", missing.storeKey)}</title>`));
    assert.doesNotMatch(svg, /<text[^>]*>[^<]*store entry/, "no store words in a legend label");
  }
  // The store directory is never listed: a stray entry there is never read.
  writeFileSync(join(runsDir, "store", `${"0".repeat(64)}.json`), "not an entry");
  assert.deepEqual(views.section("r5-stand-ins", entry?.section ?? -1)?.charts.problems, view.charts.problems);
});

test("a heat map of more runs than a page draws is left out, and says how many it would have had", () => {
  const pair = JSON.parse(readFileSync(join(fixture.rootDir, "baselines", "fake-pair.json"), "utf8")) as Baseline;
  const [template] = pair.runs;
  const runs = Array.from({ length: HEAT_MAP_ROWS + 1 }, (_unused, index) => ({ ...template, name: `lens-${index}` }));
  const large = baselineHeatMap({ ...pair, runs }, ["selftest"]);
  assert.deepEqual(large, { rungs: ["selftest"], rows: [], omitted: { count: HEAT_MAP_ROWS + 1 } });
  const fits = baselineHeatMap({ ...pair, runs: runs.slice(0, HEAT_MAP_ROWS) }, ["selftest", "r9"]);
  assert.equal(fits.rows.length, HEAT_MAP_ROWS);
  assert.equal(fits.rows[0].cells[1], null, "a rung the run does not have is an empty cell");
  const svg = renderHeatMap(fits, "large", "baseline");
  // Colour is never the only channel: every cell is labelled with its verdict.
  const cells = (svg.match(/<rect class="cell v-/g) ?? []).length;
  const labels = (svg.match(/<text [^>]*class="vt t-/g) ?? []).length;
  assert.equal(cells, labels + 1, "a label in each verdict cell; the legend's swatch has none");
});

test("a section page reads only the store entries the manifest names for its request's jobs, and no other", () => {
  let read = 0;
  for (const [rootDir, runsDir, policyFile] of [
    [fixture.rootDir, fixture.runsDir, undefined],
    [fixture.mtfRootDir, fixture.mtfRunsDir, fixture.mtfPolicyFile],
    [fixture.raysRootDir, fixture.raysRunsDir, fixture.raysPolicyFile],
  ] as const) {
    const sources = createSources({ rootDir, runsDir, policyFile });
    const asked: string[] = [];
    const spy = { ...sources, storeEntry: (key: string) => (asked.push(key), sources.storeEntry(key)) };
    const views = createViews(spy, notAsked);
    for (const name of sources.runNames()) {
      if (sources.comparisons(name).state !== "ok") continue;
      const manifest = readManifest(runsDir, name);
      for (const section of views.run(name).sections) {
        asked.length = 0;
        const view = views.section(name, section.section);
        assert.ok(view !== null);
        const keys = manifest.jobs
          .filter((job) => job.run === view.run && job.rung === view.rung && job.requestId === view.requestId)
          .flatMap((job) => (job.storeKey === null ? [] : [job.storeKey]));
        const charted = view.quantity === "mtf.native" || (view.quantity === "rays.trace" && view.rung === "r2");
        assert.deepEqual(
          [...new Set(asked)].sort(),
          charted ? [...new Set(keys)].sort() : [],
          `${name} ${section.section}`,
        );
        assert.deepEqual(
          views.sectionStoreKeys(name, section.section).sort(),
          charted ? [...new Set(keys)].sort() : [],
        );
        read += asked.length;
      }
    }
  }
  assert.ok(read > 0, "the store was read at all");
});

test("a difference is of the answer the comparison judges: a later step that is an error leaves the first answer", () => {
  const views = createViews(
    createSources({ rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile }),
    notAsked,
  );
  const manifest = readManifest(fixture.mtfRunsDir, REORDERED_SUITE);
  const step = manifest.jobs.find((job) => job.engine === "optiland" && job.step !== undefined);
  assert.deepEqual(
    [step?.step, step?.status, step?.storeKey],
    ["fft512", "error", null],
    "the step was asked, and failed",
  );
  const view = views.section(REORDERED_SUITE, 0);
  assert.ok(view !== null);
  // The second field is the one on the axis: by its value 0, never by its place.
  const [off, on] = [0, 1].map((element) =>
    view.charts.differences.find((chart) => chart.element === element && chart.cut === "sagittal"),
  );
  assert.deepEqual([off?.onAxis, on?.onAxis], [false, true]);
  assert.equal(on?.limit?.source.pointer, "/rungs/r5/metrics/mtfOnAxis.maxAbs/attention");
  assert.equal(off?.limit?.source.pointer, "/rungs/r5/metrics/mtfOffAxis.maxAbs/attention");
  const pair = on?.pairs.find((each) => each.a === "lv" && each.b === "optiland");
  assert.deepEqual([pair?.aStep, pair?.bStep], [null, null], "optiland by its first answer");
  assert.equal(pair?.points[0]?.difference.value, -2 / 256);
  // The step is drawn as a series of its own, with no curves, its status in the legend.
  const overlay = view.charts.overlays.find((chart) => chart.element === 1 && chart.cut === "sagittal");
  const failed = overlay?.series.find((series) => series.step === "fft512");
  assert.deepEqual([failed?.state, failed?.noCurves], ["no-answer", "error"]);
  assert.match(renderMtfOverlay(overlay!, "singlet, r5"), />optiland #fft512 \(no curves: error\)<\/text>/);
});

test("a set-aside caption names the pair whose sorting it is, and an UNSUPPORTED pair has no difference drawn", () => {
  const views = createViews(
    createSources({ rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile }),
    notAsked,
  );
  const sections = views.run("r5-stand-ins").sections;
  const beyond = views.section("r5-stand-ins", sections.find((each) => each.run === "beyond")?.section ?? -1);
  const chart = beyond?.charts.differences.find((each) => each.element === 1 && each.cut === "tangential");
  assert.ok(chart !== undefined);
  for (const pair of chart.pairs) {
    const judged = [pair.a, pair.b].sort().join() === "lv,optiland";
    assert.equal(pair.setAside === null, !judged, `${pair.a} ${pair.b}: only the pair the table sorts`);
  }
  const caption = differenceCaption(chart);
  assert.match(caption, /sets this field aside for lv and optiland as data \(chief-landing-apart\)/);
  assert.doesNotMatch(caption, /wave/);
  const polychromatic = views.section(
    "r5-stand-ins",
    sections.find((each) => each.run === "polychromatic")?.section ?? -1,
  );
  const left = polychromatic?.charts.differences[0].pairs.filter((pair) => pair.verdict === "UNSUPPORTED") ?? [];
  assert.ok(left.length > 0);
  for (const pair of left) assert.deepEqual([pair.drawn, pair.points], [false, []]);
  const said = differenceCaption(polychromatic!.charts.differences[0]);
  assert.match(said, /The pair of lv and optiland is UNSUPPORTED in the comparison, so no difference of it is drawn\./);
  assert.doesNotMatch(renderMtfDifference(polychromatic!.charts.differences[0], "p"), />lv minus optiland<\/text>/);
});

/** Synthetic `rays.trace` data of two rays through two surfaces, every ray ok. */
function traceData(hits: readonly number[], unrecorded?: readonly number[]) {
  const rays = 2;
  return {
    status: encodeNdArray(Uint8Array.from([0, 0]), [rays]),
    endSurface: encodeNdArray(Int32Array.from([2, 2]), [rays]),
    hits: encodeF8([...hits], [2, rays, 3]),
    exitDirection: encodeF8([0, 0, 1, 0, 0, 1], [rays, 3]),
    imagePoint: encodeF8([0, 0, 10, 1, 0, 10], [rays, 3]),
    opticalPath: encodeF8([0, 0, 5, 5], [2, rays]),
    opticalPathToImage: encodeF8([10, 10], [rays]),
    ...(unrecorded === undefined ? {} : { unrecordedHits: encodeNdArray(Uint8Array.from(unrecorded), [2, rays]) }),
  };
}

/** The charts of one R2 section of two synthetic answers, with R2's hits.maxDistance from the real comparator. */
function syntheticDeviation(dataA: Record<string, unknown>, dataB: Record<string, unknown>) {
  const surface = { aperture: { semiDiameter: 10, innerSemiDiameter: 0 } };
  const context = { opticalCase: { system: { surfaces: [surface, surface] } } } as unknown as ComparisonContext;
  const outcome = raysGeometryComparator.compare(dataA as JsonObject, dataB as JsonObject, context);
  assert.ok(outcome.comparable);
  const recorded = outcome.metrics.find((metric) => metric.name === "hits.maxDistance");
  assert.ok(recorded !== undefined);
  const [keyA, keyB] = ["a".repeat(64), "b".repeat(64)];
  const job = (engine: string, storeKey: string) => ({
    run: "one",
    caseId: "c",
    rung: "r2",
    quantity: "rays.trace",
    requestId: "q",
    engine,
    status: "ok",
    storeKey,
  });
  const manifest = { jobs: [job("a", keyA), job("b", keyB)] } as unknown as RunManifest;
  const comparisons = {
    comparisons: [
      {
        run: "one",
        rung: "r2",
        quantity: "rays.trace",
        requestId: "q",
        mode: "pairwise",
        participants: [],
        pairs: [
          {
            a: "a",
            b: "b",
            class: "gated",
            verdict: "PASS",
            metrics: [{ name: "hits.maxDistance", unit: "mm", value: recorded.value }],
          },
        ],
      },
    ],
  } as unknown as ComparisonFile;
  const entries = new Map([
    [keyA, dataA],
    [keyB, dataB],
  ]);
  const charts = buildSectionCharts({
    name: "synthetic",
    run: "one",
    rung: "r2",
    quantity: "rays.trace",
    requestId: "q",
    manifest,
    comparisons,
    sets: [0],
    policyDocument: null,
    policy: { contract: "1.0", kind: "policy", version: 0, rungs: {} },
    sorting: [],
    stored: (key) => ({
      state: "ok",
      value: { request: {}, result: { status: "ok", data: entries.get(key) } } as unknown as StoreEntry,
    }),
  });
  return { deviation: charts.deviations[0], recorded: recorded.value };
}

test("a visit an answer records no point for is left out of its bar, as R2 leaves it out of hits.maxDistance", () => {
  // Surface 1, ray 0 is unrecorded in the first answer, and the second answer's hit there is 100 mm off.
  const hitsA = [0, 0, 0, 1, 0, 0, 0, 0, 5, 1, 0, 5];
  const hitsB = [0, 0, 0, 1 + 2 ** -30, 0, 0, 100, 0, 5, 1 + 2 ** -29, 0, 5];
  const { deviation, recorded } = syntheticDeviation(traceData(hitsA, [0, 0, 1, 0]), traceData(hitsB));
  assert.equal(recorded, 2 ** -29, "R2 leaves the unrecorded visit out");
  assert.deepEqual(
    deviation.bars.map((bar) => bar.distance.value),
    [2 ** -30, 2 ** -29],
  );
  assert.deepEqual(deviation.problems, []);
  assert.equal(deviation.place, "surface");
  // Every visit unrecorded: no bar, R2 records 0, and nothing is said to differ (nor written as "none mm").
  const none = syntheticDeviation(traceData(hitsA, [1, 1, 1, 1]), traceData(hitsB));
  assert.equal(none.recorded, 0);
  assert.deepEqual(none.deviation.problems, []);
  assert.deepEqual(
    none.deviation.bars.map((bar) => bar.distance.value),
    [null, null],
  );
  assert.equal(none.deviation.caption, DASHBOARD_TEXT.charts.deviationNoBars("0"));
  assert.doesNotMatch(renderDeviation(none.deviation, "one, r2"), /none mm/);
});

test("every text of a chart is escaped: titles, legends, labels and the tooltips of marks", () => {
  const odd = `a<b&"c'`;
  const escaped = "a&lt;b&amp;&quot;c&#39;";
  const heat = renderHeatMap(
    {
      rungs: ["r2"],
      rows: [{ run: odd, cells: [{ verdict: "PASS", counts: [{ verdict: "PASS", count: 1 }] }] }],
      omitted: null,
    },
    odd,
    "run",
  );
  assert.ok(heat.includes(`<title>${escaped}: ladder heat map</title>`), "the chart's title");
  assert.ok(heat.includes(`<g><title>${escaped}</title><text`), "the row's tooltip");
  assert.ok(heat.includes(`>${escaped}</text>`), "the row's label");
  assert.ok(heat.includes(`<title>${escaped}, r2: PASS; 1 PASS</title>`), "the cell's tooltip");
  const curve = (values: number[]) => ({ values, source: { document: "store:x" as const, pointer: "/v" } });
  const overlay = renderMtfOverlay(
    {
      element: 0,
      field: null,
      cut: "sagittal",
      setAside: [],
      series: [
        {
          engine: odd,
          step: null,
          state: "ok",
          reason: null,
          noCurves: null,
          frequencies: curve([10]),
          values: curve([0.5]),
        },
        {
          engine: odd,
          step: "s",
          state: "no-answer",
          reason: `${odd} failed`,
          noCurves: "error",
          frequencies: null,
          values: null,
        },
      ],
    },
    odd,
  );
  assert.ok(overlay.includes(`<title>${escaped}: MTF at field ?, sagittal</title>`));
  assert.ok(overlay.includes(`>${escaped}</text>`), "the legend's label");
  assert.ok(
    overlay.includes(`<title>${escaped}, sagittal at 10 cycles/mm: 5.00e-1 (store/x /v [0])</title>`),
    "a mark's tooltip",
  );
  assert.ok(overlay.includes(`<title>${escaped} #s: ${escaped} failed</title>`), "a legend entry's tooltip");
  const deviation = renderDeviation(
    {
      a: odd,
      b: "b",
      place: "surface",
      bars: [{ surface: 0, distance: { value: 1e-9, derivation: `of ${odd}`, of: [] } }],
      maxDistance: null,
      gate: null,
      caption: odd,
      problems: [],
    },
    odd,
  );
  assert.ok(deviation.includes(`>${escaped}: hit distance by surface, ${escaped} and b</text>`), "the heading");
  assert.ok(deviation.includes(`<title>surface 0: 1.00e-9 mm, derived: of ${escaped} of </title>`), "a bar's tooltip");
  assert.ok(
    deviation.includes(`<desc>${DASHBOARD_TEXT.charts.deviationIntro.replaceAll("'", "&#39;")} ${escaped}</desc>`),
  );
  for (const svg of [heat, overlay, deviation]) assert.ok(!svg.includes(odd) && !svg.includes("a<b"), "nothing raw");
});

test("a subnormal extent draws a chart: no loop, no infinity, no NaN", () => {
  const scale = linearScale(-5e-324, 5e-324, 256, 36, 6);
  assert.ok(scale.step > 0 && Number.isFinite(scale.step) && scale.ticks.length <= 20, String(scale.ticks.length));
  assert.ok(Number.isFinite(scale.at(5e-324)));
  const tiny = { value: 5e-324, source: { document: "store:x" as const, pointer: "/f/0" } };
  const difference = renderMtfDifference(
    {
      element: 0,
      field: null,
      cut: "sagittal",
      limit: null,
      limitKind: null,
      onAxis: null,
      pairs: [
        {
          a: "a",
          b: "b",
          verdict: "RECORDED",
          drawn: true,
          aStep: null,
          bStep: null,
          setAside: null,
          points: [
            { frequency: { value: 10, source: tiny.source }, difference: { value: 5e-324, derivation: "d", of: [] } },
          ],
        },
      ],
    },
    "tiny",
  );
  const deviation = renderDeviation(
    {
      a: "a",
      b: "b",
      place: "visit",
      bars: [{ surface: 0, distance: { value: 5e-324, derivation: "d", of: [] } }],
      maxDistance: null,
      gate: null,
      caption: "",
      problems: [],
    },
    "tiny",
  );
  for (const svg of [difference, deviation]) assert.doesNotMatch(svg, /NaN|Infinity/);
  assert.match(deviation, />Visit<\/text>/, "a trace of visits says so on its axis");
});
