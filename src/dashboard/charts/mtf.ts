// The MTF charts of a section: the curves of every answer at one field and cut (an overlay), and each pair's
// differences at that field and cut with the band of the policy. Pure: a view and a subject give the same bytes.
import { numberText } from "../../compare/metricText.ts";
import { DASHBOARD_TEXT } from "../../report/wording.ts";
import type { MtfDifferenceView, MtfOverlayView, MtfSeriesView, SetAside } from "../chartViews.ts";
import type { Curve } from "../figure.ts";
import {
  legend,
  legendRows,
  linearScale,
  marker,
  markerShape,
  px,
  seriesClass,
  sourceText,
  svgChart,
  text,
  tickText,
  tip,
} from "./svg.ts";
import type { ChartOptions, LegendEntry, MarkerShape, Scale } from "./svg.ts";

const TEXT = DASHBOARD_TEXT.charts;

/** The fixed geometry of a line chart: its width, the plot's margins and height. */
export const WIDTH = 640;
export const LEFT = 68;
export const RIGHT = 16;
export const TOP = 36;
export const PLOT = 220;
export const BELOW = 46;

/** A field as text: the number as the file holds it, shortest form. */
export function fieldText(value: number | null | undefined): string {
  return value === null || value === undefined ? "?" : String(value);
}

function setAsideText(aside: SetAside): string {
  return TEXT.setAside(aside.a, aside.b, aside.class, aside.reason);
}

/** What an overlay's caption says beyond its intro: each pair whose sorting sets the field aside. */
export function overlayCaption(view: MtfOverlayView): string {
  return view.setAside.map(setAsideText).join(" ");
}

/** What a difference chart's caption says beyond its intro: pairs left out, and pairs whose field is set aside. */
export function differenceCaption(view: MtfDifferenceView): string {
  return view.pairs
    .flatMap((pair) => [
      ...(pair.drawn ? [] : [TEXT.differenceLeftOut(pair.a, pair.b, pair.verdict)]),
      ...(pair.setAside === null ? [] : [setAsideText(pair.setAside)]),
    ])
    .join(" ");
}

export function joined(intro: string, more: string): string {
  return more === "" ? intro : `${intro} ${more}`;
}

/** Axes and grid of a plot: ticks of both scales, their labels and the two axis titles. */
export function axes(x: Scale, y: Scale, xLabel: string, yLabel: string): string[] {
  const [left, right, top, bottom] = [LEFT, WIDTH - RIGHT, TOP, TOP + PLOT];
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
    text((left + right) / 2, bottom + 34, xLabel, { anchor: "middle" }),
    text(16, (top + bottom) / 2, yLabel, { anchor: "middle", rotate: true }),
  );
  return out;
}

/** The points of a series where x and y are both numbers, split into runs at each gap. */
function segments(xs: readonly (number | null)[], ys: readonly (number | null)[]): [number, number, number][][] {
  const out: [number, number, number][][] = [[]];
  ys.forEach((y, index) => {
    const x = xs[index];
    if (x === null || x === undefined || y === null) {
      if ((out.at(-1) ?? []).length > 0) out.push([]);
      return;
    }
    out.at(-1)?.push([x, y, index]);
  });
  return out.filter((run) => run.length > 0);
}

/** A polyline per run of points, and a marker with its tooltip at each point. */
export function line(
  xs: readonly (number | null)[],
  ys: readonly (number | null)[],
  x: Scale,
  y: Scale,
  className: string,
  options: {
    readonly dashed: boolean;
    readonly shape: MarkerShape;
    readonly label: (index: number, value: number) => string;
  },
): string[] {
  const out: string[] = [];
  for (const run of segments(xs, ys)) {
    const points = run.map(([fx, fy]) => `${px(x.at(fx))},${px(y.at(fy))}`).join(" ");
    if (run.length > 1) {
      out.push(`<polyline class="line ${className}${options.dashed ? " dash" : ""}" points="${points}"/>`);
    }
    for (const [fx, fy, index] of run) {
      out.push(marker(options.shape, className, x.at(fx), y.at(fy), tip(options.label(index, fy))));
    }
  }
  return out;
}

function seriesName(series: MtfSeriesView): string {
  return series.step === null ? series.engine : TEXT.legendStep(series.engine, series.step);
}

/** A series's legend label: its name, and its field's status (or why it has no curves) where that is not ok. */
function seriesLabel(series: MtfSeriesView): string {
  const name = seriesName(series);
  if (series.state === "ok") return name;
  if (series.state === "no-answer") return TEXT.legendNoCurves(name, series.noCurves ?? "missing");
  return TEXT.legendState(name, series.state, series.reason ?? "no reason stated");
}

/** The title's text, with the field's source on hover. */
export function heading(title: string, field: MtfOverlayView["field"]): string {
  const hover = field === null ? "" : tip(TEXT.tipField(fieldText(field.value), sourceText(field.source)));
  return `<g>${hover}${text(12, 20, title, { className: "head" })}</g>`;
}

/** The MTF of every answer of a request at one field and cut, against frequency. */
export function renderMtfOverlay(view: MtfOverlayView, subject: string, options: ChartOptions = {}): string {
  const drawn = view.series.filter(
    (series) => series.state !== "unavailable" && series.state !== "no-answer" && series.values && series.frequencies,
  );
  const numbers = (curve: Curve | null): number[] => (curve?.values ?? []).filter((v): v is number => v !== null);
  const frequencies = view.series.flatMap((series) => numbers(series.frequencies));
  const values = drawn.flatMap((series) => numbers(series.values));
  const x = linearScale(0, Math.max(1, ...frequencies), LEFT, WIDTH - RIGHT);
  const y = linearScale(0, Math.max(1, ...values), TOP + PLOT, TOP, 5);
  const entries: LegendEntry[] = view.series.map((series, index) => ({
    swatch:
      series.state === "unavailable" || series.state === "no-answer"
        ? "none"
        : series.state === "unconverged"
          ? "dash"
          : "line",
    className: seriesClass(index),
    marker: markerShape(index),
    label: seriesLabel(series),
    ...(series.state === "no-answer" && series.reason !== null
      ? { hover: TEXT.tipSeries(seriesName(series), series.reason) }
      : {}),
  }));
  const rows = legendRows(entries, LEFT, WIDTH - RIGHT);
  const title = TEXT.overlayTitle(subject, fieldText(view.field?.value), view.cut);
  const body = [heading(title, view.field), ...axes(x, y, TEXT.axisFrequency, TEXT.axisMtf)];
  view.series.forEach((series, index) => {
    if (!drawn.includes(series) || series.values === null || series.frequencies === null) return;
    const frequenciesOf = series.frequencies;
    const valuesOf = series.values;
    body.push(
      ...line(frequenciesOf.values, valuesOf.values, x, y, seriesClass(index), {
        dashed: series.state === "unconverged",
        shape: markerShape(index),
        label: (at, value) =>
          TEXT.tipPoint(
            seriesName(series),
            view.cut,
            fieldText(frequenciesOf.values[at]),
            numberText(value),
            `${sourceText(valuesOf.source)} [${at}]`,
          ),
      }),
    );
  });
  body.push(...legend(entries, LEFT, TOP + PLOT + BELOW, WIDTH - RIGHT));
  const frame = {
    width: WIDTH,
    height: TOP + PLOT + BELOW + rows * 18 + 8,
    title,
    desc: joined(TEXT.overlayIntro, overlayCaption(view)),
  };
  return svgChart(frame, body, options);
}

/**
 * Each pair's differences at one field and cut, with the band of the policy drawn about zero. `intro` is what the
 * chart's description says first: the section page's own unless a lens page (Stage 8.4) says what its pairs are.
 */
export function renderMtfDifference(
  view: MtfDifferenceView,
  subject: string,
  options: ChartOptions = {},
  intro: string = TEXT.differenceIntro,
): string {
  const shown = view.pairs.filter((pair) => pair.drawn);
  const differences = shown.flatMap((pair) =>
    pair.points.flatMap(({ difference }) => (difference.value === null ? [] : [Math.abs(difference.value)])),
  );
  const frequencies = shown.flatMap((pair) =>
    pair.points.flatMap(({ frequency }) => (frequency.value === null ? [] : [frequency.value])),
  );
  const band = view.limit?.value ?? null;
  const reach = Math.max(band ?? 0, ...differences) * 1.15;
  const extent = reach > 0 ? reach : 1e-3;
  const x = linearScale(0, Math.max(1, ...frequencies), LEFT, WIDTH - RIGHT);
  const y = linearScale(-extent, extent, TOP + PLOT, TOP, 6);
  const pairName = (pair: MtfDifferenceView["pairs"][number]): string =>
    TEXT.legendPair(
      pair.aStep === null ? pair.a : TEXT.legendStep(pair.a, pair.aStep),
      pair.bStep === null ? pair.b : TEXT.legendStep(pair.b, pair.bStep),
    );
  const entries: LegendEntry[] = shown.map((pair, index) => ({
    swatch: "line",
    className: seriesClass(index),
    marker: markerShape(index),
    label: pairName(pair),
  }));
  if (view.limit !== null && band !== null && view.limitKind !== null) {
    entries.push({ swatch: "band", className: "band", label: TEXT.legendBand(view.limitKind, numberText(band)) });
  }
  const rows = legendRows(entries, LEFT, WIDTH - RIGHT);
  const title = TEXT.differenceTitle(subject, fieldText(view.field?.value), view.cut);
  const body = [heading(title, view.field), ...axes(x, y, TEXT.axisFrequency, TEXT.axisDifference)];
  if (view.limit !== null && band !== null) {
    const [upper, lower] = [y.at(band), y.at(-band)];
    const where = view.onAxis === null ? TEXT.anyField : view.onAxis ? TEXT.onAxis : TEXT.offAxis;
    const hover = TEXT.tipLimit(view.limitKind ?? "band", numberText(band), where, sourceText(view.limit.source));
    body.push(
      `<rect class="band" x="${px(LEFT)}" y="${px(upper)}" width="${px(WIDTH - RIGHT - LEFT)}" height="${px(lower - upper)}">${tip(hover)}</rect>`,
    );
  }
  body.push(
    `<line class="zeroline" x1="${px(LEFT)}" y1="${px(y.at(0))}" x2="${px(WIDTH - RIGHT)}" y2="${px(y.at(0))}"/>`,
  );
  shown.forEach((pair, index) => {
    const xs = pair.points.map((point) => point.frequency.value);
    const ys = pair.points.map((point) => point.difference.value);
    body.push(
      ...line(xs, ys, x, y, seriesClass(index), {
        dashed: false,
        shape: markerShape(index),
        label: (at, value) => {
          const point = pair.points[at];
          return TEXT.tipDifference(
            pairName(pair),
            fieldText(point.frequency.value),
            sourceText(point.frequency.source),
            numberText(value),
            point.difference.derivation,
            point.difference.of.map(sourceText).join("; "),
          );
        },
      }),
    );
  });
  body.push(...legend(entries, LEFT, TOP + PLOT + BELOW, WIDTH - RIGHT));
  const frame = {
    width: WIDTH,
    height: TOP + PLOT + BELOW + rows * 18 + 8,
    title,
    desc: joined(intro, differenceCaption(view)),
  };
  return svgChart(frame, body, options);
}
