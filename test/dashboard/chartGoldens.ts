// The golden SVGs of the dashboard's charts (Stage 8.2): each chart drawn standalone from the views of the fixture
// (`buildFixture`), by name. `node test/report/writeGolden.ts` writes them under test/fixtures/golden/dashboard, and
// `charts.test.ts` holds every chart to its file byte for byte. Nothing here writes a file.
import { join } from "node:path";

import type { MtfCut } from "../../src/compare/mtfNative.ts";
import { renderDeviation } from "../../src/dashboard/charts/deviation.ts";
import { renderHeatMap } from "../../src/dashboard/charts/heatMap.ts";
import { renderMtfDifference, renderMtfOverlay } from "../../src/dashboard/charts/mtf.ts";
import { createViews } from "../../src/dashboard/server.ts";
import type { DashboardViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import type { SectionView } from "../../src/dashboard/views.ts";
import { GOLDEN_DIR } from "../report/support.ts";
import { RAYS_SUITE } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

/** Where the golden SVGs are. */
export const CHART_GOLDEN_DIR: string = join(GOLDEN_DIR, "dashboard");

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
  return goldens;
}
