// Stage 8.4's lens pages on the fixture's stand-in zoom (`lensFixture.ts`): every run of a lens gathered across run
// directories with its condition; a choice of curves in the page's address; the differences against a reference,
// within its request exactly as its section page draws them (the pair's verdict, R5's sorting and the band) and every
// other one apart, as no verdict; a curve at other frequencies never interpolated; and the route, its headers, its
// twin and its golden page. The figures of these views are held to the files by `figures.test.ts`.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { REPO_ROOT } from "../../src/core/config.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { renderIndex, renderLens, renderRun } from "../../src/dashboard/html.ts";
import { MAX_LENS_CURVES, lensSelection } from "../../src/dashboard/lens.ts";
import type { LensCurveView, LensView } from "../../src/dashboard/lens.ts";
import { createViews, startDashboard } from "../../src/dashboard/server.ts";
import type { DashboardViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import type { DashboardSources } from "../../src/dashboard/sources.ts";
import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";
import { ON_AXIS_BAND } from "../report/r5Fixture.ts";
import { PAGE_GOLDEN_DIR, pageGoldens } from "./chartGoldens.ts";
import { LENS_A, LENS_B, LENS_KEY, lensGoldenQuery } from "./lensFixture.ts";
import { buildFixture, fetchFrom, titleTexts, visibleText } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

const TEXT = DASHBOARD_TEXT.lens;

let fixture: DashboardFixture;
before(async () => {
  fixture = await buildFixture();
});
after(() => fixture.remove());

const notAsked = () => ({ state: "not-asked" }) as const;

function sourcesOf(): DashboardSources {
  return createSources({ rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile });
}

function viewsOf(sources: DashboardSources = sourcesOf()): DashboardViews {
  return createViews(sources, notAsked);
}

/** The query of a choice: each parameter's values, and the reference. */
function query(choice: Readonly<Record<string, readonly string[]>>): string {
  const params = new URLSearchParams();
  for (const [name, values] of Object.entries(choice)) for (const value of values) params.append(name, value);
  return params.toString();
}

/** The curve of a view by its run directory, run, rung, engine, step, field and cut. */
function curveOf(
  view: LensView,
  where: { suite: string; run: string; rung: string; engine: string; step?: string; field: number; cut: string },
): LensCurveView {
  const found = view.curves.find(
    (curve) =>
      curve.suite === where.suite &&
      curve.runName === where.run &&
      curve.rung === where.rung &&
      curve.engine === where.engine &&
      curve.step === (where.step ?? null) &&
      curve.field?.value === where.field &&
      curve.cut === where.cut,
  );
  assert.ok(found !== undefined, `no curve ${JSON.stringify(where)}`);
  return found;
}

/** The view of a choice, and the same choice with a reference picked from its curves. */
function withReference(
  views: DashboardViews,
  choice: Readonly<Record<string, readonly string[]>>,
  pick: (view: LensView) => LensCurveView,
): LensView {
  const first = views.lens(LENS_KEY, query(choice));
  return views.lens(LENS_KEY, query({ ...choice, ref: [pick(first).id] }));
}

test("the index lists every lens a case names with its runs, and a run page names the lens of each run", () => {
  const views = viewsOf();
  const index = views.index();
  assert.deepEqual(
    index.lenses.map(({ key, runCount, suites }) => [key, runCount, suites]),
    [
      // The case of every feature names a lens of its own: the polychromatic run of both stand-in suites.
      ["example-zoom", 2, ["r5-stand-ins", "r5g-stand-ins"]],
      [LENS_KEY, 3, [LENS_A, LENS_B]],
    ],
  );
  assert.deepEqual(index.lensProblems, []);
  assert.ok(renderIndex(index).includes(`<a href="/lens/${LENS_KEY}">${LENS_KEY}</a>`));
  assert.deepEqual(
    views.run(LENS_A).runs.map((run) => run.lens),
    [LENS_KEY, LENS_KEY],
  );
  assert.deepEqual(
    views.run("r5-stand-ins").runs.map((run) => run.lens),
    [null, null, "example-zoom"],
  );
  assert.ok(renderRun(views.run(LENS_B)).includes(`<a href="/lens/${LENS_KEY}">${LENS_KEY}</a>`));
});

test("a lens page lists each run with its condition, read from its case file and its manifest", () => {
  const view = viewsOf().lens(LENS_KEY, "");
  assert.deepEqual(
    view.runs.map((run) => [run.id, run.run, run.condition?.zoomT?.value, run.condition?.focusT?.value]),
    [
      [`${LENS_A}/0`, "zoom-wide", 0, 0],
      [`${LENS_A}/1`, "zoom-tele", 1, 0],
      [`${LENS_B}/0`, "zoom-wide", 0, 0],
    ],
  );
  for (const run of view.runs) {
    const file = JSON.parse(readFileSync(join(fixture.mtfRunsDir, run.suite, "cases", `${run.caseId}.json`), "utf8"));
    assert.equal(run.condition?.stopSemiDiameterMm.value, file.conditions.stopSemiDiameter);
    assert.equal(run.condition?.imageZ.value, file.conditions.imageZ);
    assert.deepEqual(
      run.condition?.lines.map((line) => [line.wavelengthNm.value, line.weight.value]),
      file.conditions.lines.map((line: { wavelengthNm: number; weight: number }) => [line.wavelengthNm, line.weight]),
    );
    // The stand-in runs have no MTF recipe, so their manifests record no image plane of one.
    assert.equal(run.condition?.plane, null);
  }
  assert.deepEqual(
    view.runs.map((run) => run.requests.map((request) => [request.rung, request.engines])),
    [
      [["r5", ["lv", "optiland", "wave"]]],
      [["r5", ["lv", "optiland", "optiland#fft512", "wave"]]],
      [
        ["r5", ["lv", "optiland"]],
        ["r5g", ["lv", "optiland", "replay"]],
      ],
    ],
  );
  assert.deepEqual(view.notes, [TEXT.nothingChosen]);
  assert.deepEqual(
    view.picker.cuts.map((cut) => [cut.id, cut.chosen]),
    [
      ["sagittal", false],
      ["tangential", true],
    ],
  );
});

test("within the reference's request a difference is drawn as its section page draws it; every other is apart", () => {
  const views = viewsOf();
  const view = views.lens(LENS_KEY, lensGoldenQuery(views));
  assert.equal(view.curves.length, 12);
  assert.deepEqual(view.reference, { curve: 1 });
  const reference = view.curves[0];
  assert.deepEqual(
    [reference.suite, reference.runName, reference.engine, reference.cut],
    [LENS_A, "zoom-wide", "lv", "sagittal"],
  );
  assert.ok(view.within !== null && view.other !== null);

  // The section page of the request: its difference chart at the reference's field and cut, pair by pair.
  const entry = views.run(LENS_A).sections.find((section) => section.run === "zoom-wide" && section.rung === "r5");
  assert.ok(entry !== undefined);
  assert.deepEqual(view.within.section, { suite: LENS_A, section: entry.section });
  const section = views.section(LENS_A, entry.section);
  const chart = section?.charts.differences.find((each) => each.element === 0 && each.cut === "sagittal");
  assert.ok(chart !== undefined);
  assert.deepEqual(view.within.view.limit, chart.limit, "the band of the section's chart");
  assert.deepEqual([view.within.view.limitKind, view.within.view.onAxis], [chart.limitKind, chart.onAxis]);
  assert.deepEqual(
    view.within.view.pairs.map((pair) => [pair.a, pair.b]),
    [
      ["optiland", "lv"],
      ["wave", "lv"],
    ],
  );
  const pairs = chart.pairs;
  for (const pair of view.within.view.pairs) {
    const own = pairs.find((each) => [each.a, each.b].sort().join() === [pair.a, pair.b].sort().join());
    assert.ok(own !== undefined);
    assert.deepEqual([pair.verdict, pair.drawn, pair.setAside], [own.verdict, own.drawn, own.setAside], pair.a);
    // The section's pair is lv minus the other; the lens page's is each curve minus the reference (0 - x keeps +0).
    assert.deepEqual(
      pair.points.map((point) => [point.frequency.value, point.difference.value]),
      own.points.map((point) => [point.frequency.value, 0 - (point.difference.value ?? Number.NaN)]),
    );
  }
  // The stand-in for optiland is exactly the band below lv on the axis at 10 cycles/mm.
  assert.equal(view.within.view.pairs[0].points[0].difference.value, -ON_AXIS_BAND);

  // Another run and another run directory are no comparison, each line with its reason; another set of frequencies is
  // left out of both, and never interpolated.
  assert.deepEqual(
    view.other.lines.map((line) => [line.curve, line.why]),
    [
      [4, TEXT.whyOtherRun],
      [5, TEXT.whyOtherRun],
      [6, TEXT.whyOtherRun],
      [7, TEXT.whyOtherRun],
      [10, TEXT.whyOtherDirectory],
      [11, TEXT.whyOtherDirectory],
      [12, TEXT.whyOtherDirectory],
    ],
  );
  assert.deepEqual(view.unresolved, [TEXT.frequenciesDiffer("8"), TEXT.frequenciesDiffer("9")]);
  assert.deepEqual(
    [view.curves[7], view.curves[8]].map((curve) => [curve.suite, curve.rung, curve.frequencies?.values]),
    [
      [LENS_B, "r5", [10, 30, 50, 90]],
      [LENS_B, "r5", [10, 30, 50, 90]],
    ],
  );
  assert.deepEqual(reference.frequencies?.values, [10, 30, 50, 70]);

  // What the page says of them passes the lint, and calls no such difference agreement.
  const page = renderLens(view, null);
  assert.deepEqual(wordingProblems(visibleText(page)), []);
  assert.deepEqual(wordingProblems(titleTexts(page).join("\n\n")), []);
  assert.ok(visibleText(page).includes(TEXT.otherIntro));
  assert.ok(visibleText(page).includes(TEXT.frequenciesDiffer("8")));
  assert.doesNotMatch(visibleText(page), /\b(agree|disagree|agreement|disagreement)\b/i);
});

test("a curve that is not the answer the comparison judges is still within, with a note; the set-aside names its pair", () => {
  const views = viewsOf();
  const choice = {
    run: [`${LENS_A}/1`],
    rung: ["r5"],
    engine: ["lv", "optiland", "optiland#fft512", "wave"],
    field: ["fraction:0.5"],
    cut: ["tangential"],
  };
  const view = withReference(views, choice, (first) =>
    curveOf(first, { suite: LENS_A, run: "zoom-tele", rung: "r5", engine: "lv", field: 0.5, cut: "tangential" }),
  );
  assert.ok(view.within !== null);
  assert.deepEqual(
    view.within.view.pairs.map((pair) => [pair.a, pair.aStep, pair.b, pair.bStep]),
    [
      ["optiland", null, "lv", null],
      ["optiland", "fft512", "lv", null],
      ["wave", null, "lv", null],
    ],
  );
  // At field 0.5 the stand-in's chief ray lands twice the limit away: the comparison sets the field aside as data.
  const entry = views.run(LENS_A).sections.find((section) => section.run === "zoom-tele" && section.rung === "r5");
  const own = views.section(LENS_A, entry!.section)?.charts.differences.find((each) => each.element === 1);
  const sorted = own?.pairs.find((pair) => pair.b === "optiland" || pair.a === "optiland")?.setAside;
  assert.ok(sorted !== null && sorted !== undefined && sorted.class === "data");
  assert.deepEqual(view.within.view.pairs[0].setAside, sorted);
  assert.deepEqual(view.within.view.pairs[1].setAside, sorted);
  assert.deepEqual(view.within.notes, [TEXT.notJudged("2", DASHBOARD_TEXT.charts.legendStep("optiland", "fft512"))]);
  assert.equal(view.other, null);
});

test("another field, the other cut and the reference's own engine are drawn apart, each with its reason", () => {
  const views = viewsOf();
  const choice = {
    run: [`${LENS_A}/1`],
    rung: ["r5"],
    engine: ["lv", "optiland", "optiland#fft512"],
    field: ["fraction:0", "fraction:0.5"],
    cut: ["sagittal", "tangential"],
  };
  const view = withReference(views, choice, (first) =>
    curveOf(first, { suite: LENS_A, run: "zoom-tele", rung: "r5", engine: "optiland", field: 0, cut: "tangential" }),
  );
  assert.equal(view.curves.length, 12);
  const why = (where: Parameters<typeof curveOf>[1]): string | undefined => {
    const curve = curveOf(view, where).curve;
    return view.other?.lines.find((line) => line.curve === curve)?.why;
  };
  const at = { suite: LENS_A, run: "zoom-tele", rung: "r5" };
  assert.equal(why({ ...at, engine: "optiland", step: "fft512", field: 0, cut: "tangential" }), TEXT.whySameEngine);
  assert.equal(why({ ...at, engine: "lv", field: 0.5, cut: "tangential" }), TEXT.whyOtherField);
  assert.equal(why({ ...at, engine: "lv", field: 0, cut: "sagittal" }), TEXT.whyOtherCut);
  assert.equal(why({ ...at, engine: "lv", field: 0, cut: "tangential" }), undefined, "lv's curve is within");
  assert.deepEqual(
    view.within?.view.pairs.map((pair) => [pair.a, pair.b]),
    [["lv", "optiland"]],
  );
});

test("nothing chosen, more curves than a page draws, a reference not among them and values not of the lens", () => {
  const views = viewsOf();
  const { picker } = views.lens(LENS_KEY, "");
  const everything = {
    run: picker.runs.map((option) => option.id),
    rung: picker.rungs.map((option) => option.id),
    engine: picker.engines.map((option) => option.id),
    field: picker.fields.map((option) => option.id),
    cut: picker.cuts.map((option) => option.id),
  };
  assert.deepEqual(
    picker.fields.map((option) => option.id),
    ["fraction:0", "fraction:0.5", "fraction:1"],
  );
  const many = views.lens(LENS_KEY, query(everything));
  assert.deepEqual(many.curves, []);
  // Twelve jobs with answers (3 + 4 + 2 + 3), each at three fields and two cuts.
  assert.deepEqual(many.notes, [TEXT.tooMany("72", String(MAX_LENS_CURVES))]);

  const one = { run: [`${LENS_A}/0`], rung: ["r5"], engine: ["lv"], field: ["fraction:0"], cut: ["tangential"] };
  const unreferenced = views.lens(LENS_KEY, query({ ...one, ref: ["no curve"] }));
  assert.equal(unreferenced.curves.length, 1);
  assert.equal(unreferenced.referenceNote, TEXT.referenceNotChosen);
  assert.equal(views.lens(LENS_KEY, query(one)).referenceNote, TEXT.referenceNone);

  const odd = views.lens(
    LENS_KEY,
    query({ ...one, run: [...one.run, "nope/0"], rung: ["r5", "r9"], cut: ["tangential", "diagonal"], foo: ["1"] }),
  );
  assert.deepEqual(odd.notes, [TEXT.unknownParameters("foo"), TEXT.unknownValues("nope/0, r9, diagonal")]);
  assert.equal(odd.curves.length, 1, "what is of the lens is still drawn");
  assert.deepEqual(lensSelection("run=a&run=a&ref=x").runs, ["a"]);
});

test("a reference without values draws no difference, and a curve without values is left out with why", () => {
  const views = viewsOf();
  const choice = {
    run: [`${LENS_B}/0`],
    rung: ["r5g"],
    engine: ["lv", "optiland"],
    field: ["fraction:1"],
    cut: ["tangential"],
  };
  const at = { suite: LENS_B, run: "zoom-wide", rung: "r5g", field: 1, cut: "tangential" };
  // Of field 1 the geometric stand-in for optiland has no curve: unavailable, NaN at every frequency.
  const none = withReference(views, choice, (first) => curveOf(first, { ...at, engine: "optiland" }));
  assert.equal(none.referenceNote, TEXT.referenceNoValues(TEXT.unavailable("frequency-beyond-bins")));
  assert.equal(none.within, null);
  const left = withReference(views, choice, (first) => curveOf(first, { ...at, engine: "lv" }));
  assert.deepEqual(left.unresolved, [TEXT.noValues("2", TEXT.unavailable("frequency-beyond-bins"))]);
  assert.equal(left.within, null);
  assert.equal(left.other, null);
});

test("a request whose run directory was not compared has no difference within it: each is apart, and says why", () => {
  const sources = sourcesOf();
  const hidden: DashboardSources = {
    ...sources,
    comparisons: (name) => (name === LENS_A ? { state: "missing" } : sources.comparisons(name)),
  };
  const views = viewsOf(hidden);
  const quick = views.lens(LENS_KEY, "").runs[0].requests[0].quick;
  assert.ok(quick !== null);
  const view = views.lens(LENS_KEY, quick);
  assert.equal(view.runs[0].comparisons, "none");
  assert.equal(view.within, null);
  assert.deepEqual(
    view.other?.lines.map((line) => line.why),
    [TEXT.whyNotCompared, TEXT.whyNotCompared],
  );
});

test("a job without an answer is named, never drawn", () => {
  const views = viewsOf();
  const { picker } = views.lens("example-zoom", "");
  const view = views.lens(
    "example-zoom",
    query({
      run: picker.runs.map((option) => option.id),
      rung: ["r5"],
      engine: ["optiland"],
      field: ["fraction:0"],
      cut: ["tangential"],
    }),
  );
  assert.deepEqual(view.curves, []);
  assert.deepEqual(
    view.noAnswers.map((each) => [each.suite, each.engine, each.reason]),
    [["r5-stand-ins", "optiland", DASHBOARD_TEXT.charts.noAnswer("optiland", "unsupported")]],
  );
  assert.deepEqual(view.notes, [TEXT.noCurvesOfChoice]);
});

test("the lens route: its page with its forms' headers and its twin, 404 for a key no run or job has", async (t) => {
  const dashboard = await startDashboard({
    rootDir: fixture.mtfRootDir,
    runsDir: fixture.mtfRunsDir,
    policyFile: fixture.mtfPolicyFile,
    port: 0,
  });
  t.after(() => dashboard.close());
  const views = viewsOf();
  const golden = lensGoldenQuery(views);
  const page = await fetchFrom(dashboard.port, `/lens/${LENS_KEY}?${golden}`);
  assert.equal(page.status, 200);
  assert.match(String(page.headers["content-security-policy"]), /form-action 'self'/);
  assert.equal(page.headers["referrer-policy"], "same-origin");
  assert.deepEqual(wordingProblems(visibleText(page.body)), []);
  assert.deepEqual(wordingProblems(titleTexts(page.body).join("\n\n")), []);
  for (const absolute of [fixture.directory, REPO_ROOT, "/Users/", "/private/", "/home/"]) {
    assert.ok(!page.body.includes(absolute), absolute);
  }
  // Started without run control's lists, it cannot run the lens, and says so.
  assert.ok(visibleText(page.body).includes(TEXT.runNotConfigured));
  assert.doesNotMatch(page.body, /action="\/control\/lens"/);
  const twin = await fetchFrom(dashboard.port, `/api/lens/${LENS_KEY}?${golden}`);
  assert.equal(twin.status, 200);
  assert.equal(twin.body, `${canonicalJson(views.lens(LENS_KEY, golden))}\n`);
  // A choice that is no option of the lens is named, escaped.
  const odd = await fetchFrom(dashboard.port, `/lens/${LENS_KEY}?run=${encodeURIComponent("<b>x</b>")}`);
  assert.equal(odd.status, 200);
  assert.ok(odd.body.includes("&lt;b&gt;x&lt;/b&gt;") && !odd.body.includes("<b>x</b>"));
  for (const path of [
    "/lens/no-such-lens",
    "/lens/%2e%2e",
    `/lens/${LENS_KEY}/more`,
    "/api/lens/no-such-lens",
    `/lens/${encodeURIComponent("../etc")}`,
  ]) {
    assert.equal((await fetchFrom(dashboard.port, path)).status, 404, path);
  }
});

test("snapshot: the golden lens page is rendered to its file byte for byte, and no golden page is stale", () => {
  const goldens = pageGoldens(fixture);
  for (const [file, html] of goldens) {
    const expected = readFileSync(join(PAGE_GOLDEN_DIR, file), "utf8");
    assert.equal(html, expected, `${file}: run node test/report/writeGolden.ts after a change meant to change a page`);
    assert.deepEqual(wordingProblems(visibleText(html)), [], file);
  }
  assert.deepEqual(readdirSync(PAGE_GOLDEN_DIR).sort(), [...goldens.keys()].sort());
  assert.deepEqual([...pageGoldens(fixture)], [...goldens], "drawn twice, the same bytes");
});
