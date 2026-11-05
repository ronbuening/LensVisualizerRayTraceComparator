// The ladder heat map: a row per run, a column per rung, each cell coloured by the gravest verdict of its pairs and
// labelled with it, so that colour is never the only channel; its pairs by verdict on hover. Pure.
import { VERDICTS } from "../../contract/comparison.ts";
import type { Verdict } from "../../contract/comparison.ts";
import { formatFixed } from "../../core/numeric/format.ts";
import { DASHBOARD_TEXT } from "../../report/wording.ts";
import type { HeatMapView } from "../chartViews.ts";
import { legend, legendRows, px, svgChart, text, tip } from "./svg.ts";
import type { ChartOptions, LegendEntry } from "./svg.ts";

const TEXT = DASHBOARD_TEXT.charts;

const CELL_WIDTH = 96;
const CELL_HEIGHT = 24;
const TOP = 52;
/** The longest run name a row label shows; a longer one is cut, its whole name on hover. */
const LABEL_CHARACTERS = 40;

function label(run: string): string {
  return run.length <= LABEL_CHARACTERS ? run : `${run.slice(0, LABEL_CHARACTERS - 1)}…`;
}

/** A heat map of a run directory's comparisons (`kind` "run") or of a baseline's records ("baseline"). */
export function renderHeatMap(
  view: HeatMapView,
  subject: string,
  kind: "run" | "baseline",
  options: ChartOptions = {},
): string {
  const longest = Math.max(4, ...view.rows.map((row) => label(row.run).length));
  const left = Math.max(80, Math.min(16 + LABEL_CHARACTERS * 6.6, 16 + longest * 6.6));
  const width = Math.max(360, left + view.rungs.length * CELL_WIDTH + 16);
  const shown = new Set<Verdict>();
  const body: string[] = [text(12, 20, TEXT.heatMapTitle(subject), { className: "head" })];
  view.rungs.forEach((rung, column) => {
    body.push(
      text(left + column * CELL_WIDTH + CELL_WIDTH / 2, TOP - 8, rung, { className: "muted", anchor: "middle" }),
    );
  });
  view.rows.forEach((row, place) => {
    const y = TOP + place * CELL_HEIGHT;
    body.push(`<g>${tip(row.run)}${text(left - 8, y + 16, label(row.run), { anchor: "end" })}</g>`);
    row.cells.forEach((cell, column) => {
      const x = left + column * CELL_WIDTH;
      const rect = (className: string): string =>
        `<rect class="cell ${className}" x="${px(x)}" y="${px(y)}" width="${CELL_WIDTH}" height="${CELL_HEIGHT}"/>`;
      if (cell === null) {
        body.push(
          `<g>${tip(TEXT.tipEmptyCell(row.run, view.rungs[column]))}${rect("empty")}${text(x + CELL_WIDTH / 2, y + 16, "—", { className: "muted", anchor: "middle" })}</g>`,
        );
        return;
      }
      shown.add(cell.verdict);
      const counts = cell.counts.map(({ verdict, count }) => `${formatFixed(count, 0)} ${verdict}`).join(", ");
      body.push(
        `<g>${tip(TEXT.tipCell(row.run, view.rungs[column], cell.verdict, counts))}${rect(`v-${cell.verdict}`)}${text(x + CELL_WIDTH / 2, y + 16, cell.verdict, { className: `vt t-${cell.verdict}` })}</g>`,
      );
    });
  });
  const entries: LegendEntry[] = VERDICTS.filter((verdict) => shown.has(verdict)).map((verdict) => ({
    swatch: "cell",
    className: `v-${verdict}`,
    label: verdict,
  }));
  if (view.rows.some((row) => row.cells.includes(null))) {
    entries.push({ swatch: "cell", className: "empty", label: TEXT.legendNoPair });
  }
  const below = TOP + view.rows.length * CELL_HEIGHT + 14;
  const rows = legendRows(entries, 12, width - 12);
  body.push(...legend(entries, 12, below, width - 12));
  const frame = {
    width,
    height: below + rows * 18 + 8,
    title: TEXT.heatMapTitle(subject),
    desc: kind === "run" ? TEXT.heatMapRun : TEXT.heatMapBaseline,
  };
  return svgChart(frame, body, options);
}
