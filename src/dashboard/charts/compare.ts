// The charts of an "LV vs optiland" tab (Stage 8.5): both answers' recorded values on shared axes, and below them a
// strip of the first engine's value minus the second's with the attention band of the policy shaded about zero ("no
// attention band" said where it gives none). Pure: a view and a subject give the same bytes.
import { numberText } from "../../compare/metricText.ts";
import { COMPARE_AXES, DASHBOARD_TEXT } from "../../report/wording.ts";
import type { FanChartView, PairChartView, SetAsideElement } from "../compareCharts.ts";
import { fieldText, heading, line } from "./mtf.ts";
import {
  legend,
  legendRows,
  linearScale,
  markerShape,
  px,
  seriesClass,
  sourceText,
  svgChart,
  text,
  tickText,
  tip,
} from "./svg.ts";
import type { ChartOptions, LegendEntry, Scale } from "./svg.ts";

const TEXT = DASHBOARD_TEXT.compare;
const CHARTS = DASHBOARD_TEXT.charts;

/** The geometry of a chart with a strip: its width, margins, the plot's and the strip's heights. */
const WIDTH = 640;
const LEFT = 76;
const RIGHT = 16;
const TOP = 36;
const PLOT = 200;
const GAP = 44;
const STRIP = 110;
const BELOW = 46;

/** What a recorded value or an axis is called on a chart, with its unit. */
export function axisName(name: string): string {
  return COMPARE_AXES[name] ?? name;
}

/** Axes and grid of one plot, between `top` and `bottom`. */
function plotAxes(x: Scale, y: Scale, top: number, bottom: number, xLabel: string | null, yLabel: string): string[] {
  const [left, right] = [LEFT, WIDTH - RIGHT];
  const out: string[] = [];
  for (const tick of y.ticks) {
    const at = y.at(tick);
    out.push(
      `<line class="grid" x1="${px(left)}" y1="${px(at)}" x2="${px(right)}" y2="${px(at)}"/>`,
      text(left - 6, at + 4, tickText(tick, y.step), { className: "muted", anchor: "end" }),
    );
  }
  for (const tick of x.ticks) {
    const at = x.at(tick);
    out.push(
      `<line class="axis" x1="${px(at)}" y1="${px(bottom)}" x2="${px(at)}" y2="${px(bottom + 4)}"/>`,
      text(at, bottom + 16, tickText(tick, x.step), { className: "muted", anchor: "middle" }),
    );
  }
  out.push(
    `<line class="axis" x1="${px(left)}" y1="${px(bottom)}" x2="${px(right)}" y2="${px(bottom)}"/>`,
    `<line class="axis" x1="${px(left)}" y1="${px(top)}" x2="${px(left)}" y2="${px(bottom)}"/>`,
    text(14, (top + bottom) / 2, yLabel, { anchor: "middle", rotate: true }),
  );
  if (xLabel !== null) out.push(text((left + right) / 2, bottom + 34, xLabel, { anchor: "middle" }));
  return out;
}

/** The finite numbers of a list. */
function finite(values: readonly (number | null | undefined)[]): number[] {
  return values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

/** The band about zero of a strip, with its tooltip; nothing where there is no band. */
function bandRect(y: Scale, band: number | null, source: string | null): string[] {
  if (band === null || source === null) return [];
  const [upper, lower] = [y.at(band), y.at(-band)];
  return [
    `<rect class="band" x="${px(LEFT)}" y="${px(upper)}" width="${px(WIDTH - RIGHT - LEFT)}" height="${px(lower - upper)}">${tip(TEXT.tipBand(numberText(band), source))}</rect>`,
  ];
}

/** The strip's scale: symmetric about zero, wide enough for every difference and the band. */
function stripScale(differences: readonly number[], band: number | null): Scale {
  const reach = Math.max(band ?? 0, ...differences.map(Math.abs)) * 1.15;
  const extent = reach > 0 ? reach : 1e-12;
  return linearScale(-extent, extent, TOP + PLOT + GAP + STRIP, TOP + PLOT + GAP, 4);
}

/** The sentence of an element set aside, where it is on the axis. */
export function setAsideSentence(aside: SetAsideElement): string {
  const at = aside.at === null ? TEXT.setAsideAt(String(aside.element)) : fieldText(aside.at.value.value);
  return TEXT.setAside(at, aside.class, aside.reason);
}

/** What a pair chart's caption says of its band: where the policy gives none, or no metric is of its values. */
export function pairBandCaption(view: PairChartView): string {
  return view.metric === null ? TEXT.noMetricSaid : view.band === null ? TEXT.noBandSaid(view.metric) : "";
}

/** What a pair chart's description says beyond the page's intro: its band, and the elements set aside. */
export function pairChartCaption(view: PairChartView): string {
  return [pairBandCaption(view), ...view.setAside.map(setAsideSentence)].filter((each) => each !== "").join(" ");
}

/** A chart of recorded values of both answers against a recorded axis, with the strip of their differences. */
export function renderPairChart(view: PairChartView, subject: string, options: ChartOptions = {}): string {
  const xs = [
    ...view.series.flatMap((series) => series.points.map((point) => point.x.value.value)),
    ...view.differences.flatMap((group) => group.points.map((point) => point.x.value.value)),
  ];
  const ys = view.series.flatMap((series) => series.points.map((point) => point.y.value.value));
  const differences = finite(view.differences.flatMap((group) => group.points.map((point) => point.difference.value)));
  const xFinite = finite(xs);
  const yFinite = finite(ys);
  const x = linearScale(Math.min(...xFinite, 0), Math.max(...xFinite, 0), LEFT, WIDTH - RIGHT);
  const y = linearScale(Math.min(...yFinite), Math.max(...yFinite), TOP + PLOT, TOP, 5);
  const band = view.band?.value ?? null;
  const strip = stripScale(differences, band);
  const xLabel = axisName(view.axis);
  const valuesLabel = view.values.map(axisName).join(", ");
  const title = TEXT.pairTitle(subject, valuesLabel, xLabel);
  const seriesName = (series: PairChartView["series"][number]): string =>
    series.group === null ? series.engine : TEXT.legendGroup(series.engine, series.group);
  const entries: LegendEntry[] = view.series.map((series, index) => ({
    swatch: series.engine === view.a ? "line" : "dash",
    className: seriesClass(index),
    marker: markerShape(index),
    label: seriesName(series),
  }));
  const groupName = (group: string | null): string =>
    group === null ? TEXT.legendMinus(view.a, view.b) : `${TEXT.legendMinus(view.a, view.b)}, ${group}`;
  view.differences.forEach((group, index) =>
    entries.push({
      swatch: "line",
      className: seriesClass(view.series.length + index),
      marker: markerShape(view.series.length + index),
      label: groupName(group.group),
    }),
  );
  entries.push(
    band === null
      ? { swatch: "none", className: "none", label: TEXT.legendNoBand }
      : { swatch: "band", className: "band", label: CHARTS.legendBand("attention", numberText(band)) },
  );
  const stripBottom = TOP + PLOT + GAP + STRIP;
  const body = [
    text(12, 20, title, { className: "head" }),
    ...plotAxes(x, y, TOP, TOP + PLOT, null, valuesLabel),
    ...plotAxes(x, strip, TOP + PLOT + GAP, stripBottom, xLabel, TEXT.strip),
    ...bandRect(strip, band, view.band === null ? null : sourceText(view.band.source)),
    `<line class="zeroline" x1="${px(LEFT)}" y1="${px(strip.at(0))}" x2="${px(WIDTH - RIGHT)}" y2="${px(strip.at(0))}"/>`,
  ];
  view.series.forEach((series, index) => {
    const name = seriesName(series);
    body.push(
      ...line(
        series.points.map((point) => point.x.value.value),
        series.points.map((point) => point.y.value.value),
        x,
        y,
        seriesClass(index),
        {
          dashed: series.engine !== view.a,
          shape: markerShape(index),
          label: (at, value) => {
            const point = series.points[at];
            return TEXT.tipValue(
              name,
              fieldText(point.x.value.value),
              sourceText(point.x.value.source),
              numberText(value),
              sourceText(point.y.value.source),
            );
          },
        },
      ),
    );
  });
  view.differences.forEach((group, index) => {
    body.push(
      ...line(
        group.points.map((point) => point.x.value.value),
        group.points.map((point) => point.difference.value),
        x,
        strip,
        seriesClass(view.series.length + index),
        {
          dashed: false,
          shape: markerShape(view.series.length + index),
          label: (at, value) => {
            const point = group.points[at];
            return TEXT.tipDifference(
              fieldText(point.x.value.value),
              sourceText(point.x.value.source),
              numberText(value),
              point.difference.derivation,
              point.difference.of.map(sourceText).join("; "),
            );
          },
        },
      ),
    );
  });
  const rows = legendRows(entries, LEFT, WIDTH - RIGHT);
  body.push(...legend(entries, LEFT, stripBottom + BELOW, WIDTH - RIGHT));
  const caption = pairChartCaption(view);
  const frame = {
    width: WIDTH,
    height: stripBottom + BELOW + rows * 18 + 8,
    title,
    desc: caption === "" ? TEXT.detailsIntro : `${TEXT.detailsIntro} ${caption}`,
  };
  return svgChart(frame, body, options);
}

/** What a fan chart's description says beyond its intro: the field's sorting, the band, answers without a fan. */
export function fanChartCaption(view: FanChartView): string {
  return [
    view.sorting.banded ? "" : TEXT.fanSorting(view.sorting.class, view.sorting.reason),
    view.band === null ? TEXT.noBandSaid(view.metric) : "",
    ...view.series.flatMap((series) => (series.missing === null ? [] : [series.missing])),
  ]
    .filter((each) => each !== "")
    .join(" ");
}

/** The ray fan of one field of both answers, against the pupil coordinate, with the strip of their differences. */
export function renderFanChart(view: FanChartView, subject: string, options: ChartOptions = {}): string {
  const pupils = view.series.flatMap((series) => finite(series.pupil?.values ?? []));
  const errors = view.series.flatMap((series) => finite(series.error?.values ?? []));
  const differences = finite(view.differences.map((point) => point.difference.value));
  const x = linearScale(Math.min(-1, ...pupils), Math.max(1, ...pupils), LEFT, WIDTH - RIGHT);
  const y = linearScale(Math.min(...errors, 0), Math.max(...errors, 0), TOP + PLOT, TOP, 5);
  const band = view.band?.value ?? null;
  const strip = stripScale(differences, band);
  const title = TEXT.fanTitle(subject, view.axis ?? "", fieldText(view.field?.value));
  const entries: LegendEntry[] = view.series.map((series, index) => ({
    swatch: series.missing !== null ? "none" : series.engine === view.a ? "line" : "dash",
    className: seriesClass(index),
    marker: markerShape(index),
    label: series.engine,
    ...(series.missing === null ? {} : { hover: series.missing }),
  }));
  entries.push({
    swatch: "line",
    className: seriesClass(view.series.length),
    marker: markerShape(view.series.length),
    label: TEXT.legendMinus(view.a, view.b),
  });
  entries.push(
    band === null
      ? { swatch: "none", className: "none", label: TEXT.legendNoBand }
      : { swatch: "band", className: "band", label: CHARTS.legendBand("attention", numberText(band)) },
  );
  const stripBottom = TOP + PLOT + GAP + STRIP;
  const body = [
    heading(title, view.field),
    ...plotAxes(x, y, TOP, TOP + PLOT, null, axisName("errorMm")),
    ...plotAxes(x, strip, TOP + PLOT + GAP, stripBottom, axisName("pupil"), TEXT.strip),
    ...bandRect(strip, band, view.band === null ? null : sourceText(view.band.source)),
    `<line class="zeroline" x1="${px(LEFT)}" y1="${px(strip.at(0))}" x2="${px(WIDTH - RIGHT)}" y2="${px(strip.at(0))}"/>`,
  ];
  view.series.forEach((series, index) => {
    if (series.pupil === null || series.error === null) return;
    const { pupil, error } = series;
    body.push(
      ...line(pupil.values, error.values, x, y, seriesClass(index), {
        dashed: series.engine !== view.a,
        shape: markerShape(index),
        label: (at, value) =>
          TEXT.tipValue(
            series.engine,
            fieldText(pupil.values[at]),
            `${sourceText(pupil.source)} [${at}]`,
            numberText(value),
            `${sourceText(error.source)} [${at}]`,
          ),
      }),
    );
  });
  const reference = view.series[0]?.pupil;
  if (reference !== null && reference !== undefined) {
    const xs = view.differences.map((point) => reference.values[point.element] ?? null);
    body.push(
      ...line(
        xs,
        view.differences.map((point) => point.difference.value),
        x,
        strip,
        seriesClass(view.series.length),
        {
          dashed: false,
          shape: markerShape(view.series.length),
          label: (at, value) => {
            const point = view.differences[at];
            return TEXT.tipDifference(
              fieldText(xs[at]),
              `${sourceText(reference.source)} [${point.element}]`,
              numberText(value),
              point.difference.derivation,
              point.difference.of.map(sourceText).join("; "),
            );
          },
        },
      ),
    );
  }
  const rows = legendRows(entries, LEFT, WIDTH - RIGHT);
  body.push(...legend(entries, LEFT, stripBottom + BELOW, WIDTH - RIGHT));
  const caption = fanChartCaption(view);
  const frame = {
    width: WIDTH,
    height: stripBottom + BELOW + rows * 18 + 8,
    title,
    desc: caption === "" ? TEXT.fanIntro : `${TEXT.fanIntro} ${caption}`,
  };
  return svgChart(frame, body, options);
}
