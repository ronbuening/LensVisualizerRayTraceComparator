// The golden SVGs of the dashboard's charts (Stage 8.2): each chart drawn standalone from the views of the fixture
// (`buildFixture`), by name. `node test/report/writeGolden.ts` writes them under test/fixtures/golden/dashboard, and
// `charts.test.ts` holds every chart to its file byte for byte. Nothing here writes a file.
import { join } from "node:path";

import type { MtfCut } from "../../src/compare/mtfNative.ts";
import { renderDeviation } from "../../src/dashboard/charts/deviation.ts";
import { renderHeatMap } from "../../src/dashboard/charts/heatMap.ts";
import { renderLensOther, renderLensOverlay } from "../../src/dashboard/charts/lens.ts";
import { renderMtfDifference, renderMtfOverlay } from "../../src/dashboard/charts/mtf.ts";
import { renderFanChart, renderPairChart } from "../../src/dashboard/charts/compare.ts";
import { renderCompare, renderLens } from "../../src/dashboard/html.ts";
import { DASHBOARD_TEXT } from "../../src/report/wording.ts";
import { createViews } from "../../src/dashboard/server.ts";
import type { DashboardViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import type { SectionView } from "../../src/dashboard/views.ts";
import { GOLDEN_DIR } from "../report/support.ts";
import { LENS_KEY, lensGoldenQuery } from "./lensFixture.ts";
import { COMPARE_KEY, compareGoldenQueries } from "./compareFixture.ts";
import { RAYS_SUITE } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

/** Where the golden SVGs are. */
export const CHART_GOLDEN_DIR: string = join(GOLDEN_DIR, "dashboard");
/** Where the golden pages are (Stage 8.4): whole HTML pages, a form's token fixed. */
export const PAGE_GOLDEN_DIR: string = join(GOLDEN_DIR, "dashboard-pages");
/** The token the golden pages' forms carry: no server's. */
export const GOLDEN_TOKEN = "0".repeat(64);

function viewsOf(rootDir: string, runsDir: string, policyFile?: string): DashboardViews {
  return createViews(createSources({ rootDir, runsDir, policyFile }), () => ({ state: "not-asked" }));
}

/** The section of a run directory whose run and rung are these, the `nth` such (from 0). */
function sectionOf(views: DashboardViews, name: string, run: string, rung: string, nth = 0): SectionView {
  const entry = views
    .run(name)
    .sections.filter((section) => section.run === run && section.rung === rung)
    .at(nth);
  const view = entry === undefined ? null : views.section(name, entry.section);
  if (view === null) throw new Error(`the fixture has no section ${nth} of ${run}, ${rung} in ${name}`);
  return view;
}

function chartAt<T extends { readonly element: number; readonly cut: MtfCut }>(
  charts: readonly T[],
  element: number,
  cut: MtfCut,
): T {
  const chart = charts.find((each) => each.element === element && each.cut === cut);
  if (chart === undefined) throw new Error(`no chart of field ${element}, ${cut}`);
  return chart;
}

/** Every golden chart of the fixture, by file name, drawn standalone. */
export function chartGoldens(fixture: DashboardFixture): Map<string, string> {
  const standalone = { standalone: true };
  const goldens = new Map<string, string>();
  const mtf = viewsOf(fixture.mtfRootDir, fixture.mtfRunsDir, fixture.mtfPolicyFile);
  const beyond = sectionOf(mtf, "r5-stand-ins", "beyond", "r5");
  const subject = (section: SectionView): string => `${section.run}, ${section.rung}`;
  // The stand-in for optiland asked again at 512 rays (a step of its own), and wave unconverged at field 1.
  goldens.set(
    "r5-beyond.overlay-element2-tangential.svg",
    renderMtfOverlay(chartAt(beyond.charts.overlays, 2, "tangential"), subject(beyond), standalone),
  );
  // On the axis, one unit in the last place past the band at 50 cycles/mm.
  goldens.set(
    "r5-beyond.difference-element0-sagittal.svg",
    renderMtfDifference(chartAt(beyond.charts.differences, 0, "sagittal"), subject(beyond), standalone),
  );
  // A field the comparison sets aside: the chief rays land twice the limit apart.
  goldens.set(
    "r5-beyond.difference-element1-tangential.svg",
    renderMtfDifference(chartAt(beyond.charts.differences, 1, "tangential"), subject(beyond), standalone),
  );
  // A field the stand-in for optiland has no curves of: NaN at every frequency, named in the legend, never drawn.
  const edge = sectionOf(mtf, "r5g-stand-ins", "edge", "r5g");
  goldens.set(
    "r5g-edge.overlay-element2-sagittal.svg",
    renderMtfOverlay(chartAt(edge.charts.overlays, 2, "sagittal"), subject(edge), standalone),
  );

  // The stand-in zoom's lens page (Stage 8.4): its curves overlaid, the differences within the reference's request as
  // its section page draws them, and those that no comparison judges.
  const lens = mtf.lens(LENS_KEY, lensGoldenQuery(mtf));
  const reference = lens.reference;
  if (lens.within === null || lens.other === null || reference === null) {
    throw new Error("the golden lens page draws no difference");
  }
  goldens.set(`lens-${LENS_KEY}.overlay.svg`, renderLensOverlay(LENS_KEY, lens.curves, standalone));
  goldens.set(
    `lens-${LENS_KEY}.within.svg`,
    renderMtfDifference(lens.within.view, lens.within.subject, standalone, DASHBOARD_TEXT.lens.withinIntro),
  );
  goldens.set(`lens-${LENS_KEY}.other.svg`, renderLensOther(LENS_KEY, lens.other, reference.curve, standalone));

  const fake = viewsOf(fixture.rootDir, fixture.runsDir);
  const pairRun = fake.run("fake-pair").heatMap;
  const pairBaseline = fake.baseline("fake-pair").heatMap;
  if (pairRun === null || pairBaseline === null) throw new Error("the fake pair has no heat map");
  goldens.set("fake-pair.run-heat-map.svg", renderHeatMap(pairRun, "fake-pair", "run", standalone));
  goldens.set("fake-pair.baseline-heat-map.svg", renderHeatMap(pairBaseline, "fake-pair", "baseline", standalone));

  const rays = viewsOf(fixture.raysRootDir, fixture.raysRunsDir, fixture.raysPolicyFile);
  const raysMap = rays.run(RAYS_SUITE).heatMap;
  if (raysMap === null) throw new Error("the rays run has no heat map");
  goldens.set("rays.run-heat-map.svg", renderHeatMap(raysMap, RAYS_SUITE, "run", standalone));
  const onAxis = sectionOf(rays, RAYS_SUITE, "double-gauss", "r2", 0);
  for (const deviation of onAxis.charts.deviations) {
    goldens.set(
      `rays-r2-axis.deviation-${deviation.a}-${deviation.b}.svg`,
      renderDeviation(deviation, subject(onAxis), standalone),
    );
  }

  // The compare pages of R7a to R12b's stand-ins (Stage 8.5): a chart of each kind of value against a field angle, one
  // grouped by line with an element set aside, and a ray fan of two methods, each with its strip of differences.
  const compare = viewsOf(fixture.compareRootDir, fixture.compareRunsDir, fixture.comparePolicyFile);
  const queries = compareGoldenQueries(compare);
  const detail = (query: string, tab: string, rung: string, label: string | null, kind: string, nth = 0) => {
    const line = compare
      .compare(COMPARE_KEY, query, tab)
      ?.cards[0]?.recorded.find((each) => each.rung === rung && each.label === label);
    const chart = line?.detail?.charts.filter((each) => each.kind === kind)[nth];
    if (line === undefined || chart === undefined) throw new Error(`the compare fixture has no ${rung} ${kind} chart`);
    return { chart, subject: `${COMPARE_KEY}, ${line.source.kind === "run" ? line.source.run : ""}, ${rung}` };
  };
  const distortion = detail(queries.shared, "chief", "r9b", "distortion", "points");
  if (distortion.chart.kind === "points") {
    goldens.set("compare-r9b.distortion.svg", renderPairChart(distortion.chart, distortion.subject, standalone));
  }
  const tangential = detail(queries.shared, "curvature", "r10b", null, "points");
  if (tangential.chart.kind === "points") {
    goldens.set("compare-r10b.tangential.svg", renderPairChart(tangential.chart, tangential.subject, standalone));
  }
  const fan = detail(queries.fan, "coma-bokeh", "r7b", "fan tangential", "fan");
  if (fan.chart.kind === "fan") goldens.set("compare-r7b.fan.svg", renderFanChart(fan.chart, fan.subject, standalone));
  return goldens;
}

/**
 * Every golden page of the fixture, by file name: the stand-in zoom's lens page with the golden choice (Stage 8.4), and
 * the compare page of R7a to R12b's stand-ins in their shared condition, with the chief-ray tab's details (Stage 8.5).
 */
export function pageGoldens(fixture: DashboardFixture): Map<string, string> {
  const mtf = viewsOf(fixture.mtfRootDir, fixture.mtfRunsDir, fixture.mtfPolicyFile);
  const view = mtf.lens(LENS_KEY, lensGoldenQuery(mtf));
  const compare = viewsOf(fixture.compareRootDir, fixture.compareRunsDir, fixture.comparePolicyFile);
  const { shared } = compareGoldenQueries(compare);
  const form = { token: GOLDEN_TOKEN, configured: true };
  const page = (tab: string | null): string => {
    const built = compare.compare(COMPARE_KEY, shared, tab);
    if (built === null) throw new Error(`the compare fixture has no page of ${tab ?? "its cards"}`);
    return renderCompare(built, form);
  };
  return new Map([
    [`lens-${LENS_KEY}.html`, renderLens(view, form)],
    [`compare-${COMPARE_KEY}.html`, page(null)],
    [`compare-${COMPARE_KEY}.chief.html`, page("chief")],
  ]);
}
