// The "LV vs optiland" pages (Stage 8.5) on the stand-ins of R7a to R12b (`compareFixture.ts`): the conditions and
// their chips, the cards' two kinds of line and where each is read, and the details of a tab. The figures of every
// page are held to the files by `figures.test.ts`; the pages are linted and served by `server.test.ts`.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { COMPARE_TABS, GATED_HEADLINES } from "../../src/dashboard/compare.ts";
import { createViews } from "../../src/dashboard/server.ts";
import type { DashboardViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import { MATRIX_ROWS } from "../../src/report/wording.ts";
import { BASELINE_ONLY, COMPARE_KEY, compareGoldenQueries } from "./compareFixture.ts";
import { buildFixture } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

let fixture: DashboardFixture;
let views: DashboardViews;
before(async () => {
  fixture = await buildFixture();
  views = createViews(
    createSources({
      rootDir: fixture.compareRootDir,
      runsDir: fixture.compareRunsDir,
      policyFile: fixture.comparePolicyFile,
    }),
    () => ({ state: "not-asked" }),
  );
});
after(() => fixture.remove());

test("the cards are the validation matrix's tab rows; a recorded rung is a card's only where LensVisualizer has a counterpart", () => {
  assert.deepEqual(
    COMPARE_TABS.map((tab) => tab.tab),
    MATRIX_ROWS.filter((row) => row.tab !== "no-tab").map((row) => row.tab),
  );
  const mtf = COMPARE_TABS.find((tab) => tab.tab === "mtf");
  // R6b is lv beside wave, the comparator's estimator on LensVisualizer's rays: no counterpart of LensVisualizer's.
  assert.deepEqual(mtf?.recorded, ["r5", "r5g", "r6c"]);
  assert.deepEqual(COMPARE_TABS.find((tab) => tab.tab === "vignetting")?.recorded, ["r11b"]);
  for (const tab of COMPARE_TABS) for (const rung of tab.gated) assert.ok(rung in GATED_HEADLINES, rung);
});

test("the index leads with the lenses compared, each card's verdicts in its first condition", () => {
  const index = views.index();
  assert.deepEqual(
    index.compared.map((lens) => lens.key),
    [COMPARE_KEY],
  );
  assert.deepEqual(
    index.compared[0].cards.map((card) => card.tab),
    COMPARE_TABS.map((tab) => tab.tab),
  );
});

test("a condition is a case: chips of each facet, the first value of a compared case chosen, a value asked kept", () => {
  const view = views.compare(COMPARE_KEY, "", null);
  assert.ok(view !== null);
  assert.deepEqual(
    view.facets.map((facet) => facet.facet),
    ["position", "stop", "plane", "lines"],
  );
  for (const facet of view.facets) {
    assert.equal(facet.options.filter((option) => option.chosen).length, 1, facet.facet);
    assert.ok(facet.options.find((option) => option.chosen)?.compared, `${facet.facet}: a compared case is chosen`);
  }
  // Each chip's query chooses it, and the page it opens says that it is chosen.
  for (const option of view.facets[1].options) {
    const chosen = views.compare(COMPARE_KEY, option.query, null);
    assert.equal(chosen?.facets[1].options.find((each) => each.chosen)?.id, option.id);
  }
  // A value of no case gives way to the first, and a parameter the page does not take is named.
  const odd = views.compare(COMPARE_KEY, "stop=99&colour=red", null);
  assert.deepEqual(odd?.notes, [
    "The address has parameters that a compare page does not take, and they are left out: colour.",
    "The stop asked, 99, is of no case in the condition chosen so far, so the first one is shown.",
  ]);
});

test("a gated line is read from the run directories, else from a baseline's records of the case", () => {
  const { shared } = compareGoldenQueries(views);
  const view = views.compare(COMPARE_KEY, shared, null);
  assert.ok(view !== null);
  // Two cases share every facet here (R8's and R9's lenses, say): the cards gather both.
  assert.ok(view.count >= 2, `${view.count} cases`);
  const line = (tab: string, rung: string) =>
    view.cards.find((card) => card.tab === tab)?.gated.find((each) => each.rung === rung);
  assert.equal(line("axial", "r8a")?.source.kind, "runs");
  // R7a's run directory has no comparisons: its case's records are the baseline's.
  const r7a = line("coma-bokeh", "r7a");
  assert.deepEqual(r7a?.source, { kind: "baselines", stems: [BASELINE_ONLY] });
  assert.equal(r7a?.headline?.value.source.document, `baseline:${BASELINE_ONLY}`);
  // R1 was run in no directory and is in no baseline here.
  assert.deepEqual(line("summary", "r1")?.source, { kind: "none" });
  assert.deepEqual(line("summary", "r1")?.pairs, []);
});

test("a recorded line is LensVisualizer beside its counterpart, with the policy's bands and the sorting's limits", () => {
  const { shared } = compareGoldenQueries(views);
  const view = views.compare(COMPARE_KEY, shared, null);
  assert.ok(view !== null);
  const lines = view.cards.flatMap((card) => card.recorded);
  assert.ok(lines.length >= 7, `${lines.length} lines`);
  for (const line of lines) {
    assert.equal(line.a, "lv");
    assert.ok(["optiland", "flux"].includes(line.b), line.b);
    assert.equal(line.detail, null, "no details on the cards' page");
    for (const metric of line.metrics) {
      assert.ok(metric.band === null || metric.limit === null, `${metric.name}: a band or a limit, never both`);
      if (["chiefLanding.maxAbs", "landing.maxAbs", "pupilRadius.relative", "rearFocus.maxAbs"].includes(metric.name)) {
        assert.equal(metric.band, null, `${metric.name} is a limit of the sorting`);
      }
    }
  }
  const vignetting = view.cards.find((card) => card.tab === "vignetting")?.recorded[0];
  assert.equal(vignetting?.b, "flux");
  assert.deepEqual(
    lines.filter((line) => line.rung === "r9b").map((line) => line.label),
    ["distortion", "lateral-colour", "pupils"].filter((label) => lines.some((line) => line.label === label)),
  );
});

test("a tab's page has its card alone, with the details of each recorded line; an unknown tab has none", () => {
  const { shared, fan } = compareGoldenQueries(views);
  const chief = views.compare(COMPARE_KEY, shared, "chief");
  assert.equal(chief?.cards.length, 1);
  for (const line of chief?.cards[0].recorded ?? []) {
    assert.ok(line.detail !== null && line.detail.charts.length > 0, `${line.label}: charts`);
    for (const chart of line.detail.charts) {
      if (chart.kind !== "points") continue;
      // A difference is drawn only at an element the sorting does not set aside.
      for (const group of chart.differences) {
        for (const point of group.points) {
          assert.ok(!chart.setAside.some((aside) => aside.element === point.element), `${point.element}`);
        }
      }
    }
  }
  const summary = views.compare(COMPARE_KEY, shared, "summary")?.cards[0].recorded[0];
  assert.equal(summary?.detail?.charts[0]?.kind, "values");
  const coma = views.compare(COMPARE_KEY, fan, "coma-bokeh")?.cards[0].recorded;
  assert.ok(coma?.some((line) => line.detail?.charts.some((chart) => chart.kind === "fan")));
  assert.equal(views.compare(COMPARE_KEY, shared, "no-such-tab"), null);
});
