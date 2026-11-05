// The charts of a lens page (Stage 8.4): the curves the owner chose, overlaid, and the differences against the
// reference that no comparison judges, drawn apart and without a band. The differences within the reference's own
// request are the section page's chart (`renderMtfDifference`). Pure: a view gives the same bytes. A curve keeps
// its series slot and marker by its number in both charts, so that a line of one is found in the other.
import { numberText } from "../../compare/metricText.ts";
import { DASHBOARD_TEXT } from "../../report/wording.ts";
import { curveEngine } from "../lens.ts";
import type { LensCurveView, LensOtherView } from "../lens.ts";
import type { Curve } from "../figure.ts";
import { BELOW, LEFT, PLOT, RIGHT, TOP, WIDTH, axes, fieldText, joined, line } from "./mtf.ts";
import { legend, legendRows, linearScale, markerShape, px, seriesClass, sourceText, svgChart, text } from "./svg.ts";
import type { ChartOptions, LegendEntry } from "./svg.ts";

const TEXT = DASHBOARD_TEXT.lens;
const CHARTS = DASHBOARD_TEXT.charts;

/** A curve's name: its engine and step, rung, field and cut. */
export function curveName(curve: LensCurveView): string {
  const run = `${curve.suite}/${curve.runName}`;
  return TEXT.curveName(curveEngine(curve), run, curve.rung, fieldText(curve.field?.value), curve.cut);
}

/** A curve's label in a legend: its number and name, and that it is the reference where it is. */
function curveLabel(curve: LensCurveView): string {
  return TEXT.legendCurve(
    String(curve.curve),
    curve.reference ? `${curveName(curve)}, ${TEXT.isReference}` : curveName(curve),
  );
}

/** Whether a curve has a line to draw: values and frequencies, and a field its engine does not call unavailable. */
function drawable(curve: LensCurveView): curve is LensCurveView & { values: Curve; frequencies: Curve } {
  return curve.state !== "unavailable" && curve.values !== null && curve.frequencies !== null;
}

function heading(title: string): string {
  return text(12, 20, title, { className: "head" });
}

/** The curves chosen on a lens page, against frequency, each numbered as in the page's list of curves. */
export function renderLensOverlay(key: string, curves: readonly LensCurveView[], options: ChartOptions = {}): string {
  const numbers = (curve: Curve | null): number[] => (curve?.values ?? []).filter((v): v is number => v !== null);
  const drawn = curves.filter(drawable);
  const x = linearScale(0, Math.max(1, ...curves.flatMap((curve) => numbers(curve.frequencies))), LEFT, WIDTH - RIGHT);
  const y = linearScale(0, Math.max(1, ...drawn.flatMap((curve) => numbers(curve.values))), TOP + PLOT, TOP, 5);
  const entries: LegendEntry[] = curves.map((curve) => {
    const series = curveEngine(curve);
    const label =
      curve.state === "unavailable"
        ? CHARTS.legendState(curveLabel(curve), curve.state, curve.reason ?? "no reason stated")
        : drawable(curve)
          ? curveLabel(curve)
          : CHARTS.legendNoCurves(curveLabel(curve), "missing");
    return {
      swatch: !drawable(curve) ? "none" : curve.state === "unconverged" ? "dash" : "line",
      className: seriesClass(curve.curve - 1),
      marker: markerShape(curve.curve - 1),
      label,
      hover: CHARTS.tipSeries(series, TEXT.tipCurve(String(curve.curve), `${curve.suite}: ${curve.runName}`)),
    };
  });
  const rows = legendRows(entries, LEFT, WIDTH - RIGHT);
  const title = TEXT.overlayTitle(key, String(curves.length));
  const body = [heading(title), ...axes(x, y, CHARTS.axisFrequency, CHARTS.axisMtf)];
  for (const curve of drawn) {
    const { frequencies, values } = curve;
    body.push(
      ...line(frequencies.values, values.values, x, y, seriesClass(curve.curve - 1), {
        dashed: curve.state === "unconverged",
        shape: markerShape(curve.curve - 1),
        label: (at, value) =>
          CHARTS.tipPoint(
            TEXT.legendCurve(String(curve.curve), curveName(curve)),
            curve.cut,
            fieldText(frequencies.values[at]),
            numberText(value),
            `${sourceText(values.source)} [${at}]`,
          ),
      }),
    );
  }
  body.push(...legend(entries, LEFT, TOP + PLOT + BELOW, WIDTH - RIGHT));
  const frame = { width: WIDTH, height: TOP + PLOT + BELOW + rows * 18 + 8, title, desc: TEXT.overlayIntro };
  return svgChart(frame, body, options);
}

/** What the chart of the other differences says beyond its intro: why each curve is one of them. */
export function otherCaption(view: LensOtherView): string {
  return view.lines.map((each) => TEXT.otherWhy(String(each.curve), each.why)).join(" ");
}

/** Each other curve minus the reference: subtractions that no comparison judges, about zero and without a band. */
export function renderLensOther(
  key: string,
  view: LensOtherView,
  reference: number,
  options: ChartOptions = {},
): string {
  const differences = view.lines.flatMap((each) =>
    each.points.flatMap(({ difference }) => (difference.value === null ? [] : [Math.abs(difference.value)])),
  );
  const frequencies = view.lines.flatMap((each) =>
    each.points.flatMap(({ frequency }) => (frequency.value === null ? [] : [frequency.value])),
  );
  const reach = Math.max(0, ...differences) * 1.15;
  const extent = reach > 0 ? reach : 1e-3;
  const x = linearScale(0, Math.max(1, ...frequencies), LEFT, WIDTH - RIGHT);
  const y = linearScale(-extent, extent, TOP + PLOT, TOP, 6);
  const nameOf = (curve: number): string => TEXT.legendMinus(String(curve), String(reference));
  const entries: LegendEntry[] = view.lines.map((each) => ({
    swatch: "line",
    className: seriesClass(each.curve - 1),
    marker: markerShape(each.curve - 1),
    label: nameOf(each.curve),
    hover: TEXT.otherWhy(String(each.curve), each.why),
  }));
  const rows = legendRows(entries, LEFT, WIDTH - RIGHT);
  const title = TEXT.otherTitle(key);
  const body = [heading(title), ...axes(x, y, CHARTS.axisFrequency, CHARTS.axisDifference)];
  body.push(
    `<line class="zeroline" x1="${px(LEFT)}" y1="${px(y.at(0))}" x2="${px(WIDTH - RIGHT)}" y2="${px(y.at(0))}"/>`,
  );
  for (const each of view.lines) {
    const xs = each.points.map((point) => point.frequency.value);
    const ys = each.points.map((point) => point.difference.value);
    body.push(
      ...line(xs, ys, x, y, seriesClass(each.curve - 1), {
        dashed: false,
        shape: markerShape(each.curve - 1),
        label: (at, value) => {
          const point = each.points[at];
          return CHARTS.tipDifference(
            nameOf(each.curve),
            fieldText(point.frequency.value),
            sourceText(point.frequency.source),
            numberText(value),
            point.difference.derivation,
            point.difference.of.map(sourceText).join("; "),
          );
        },
      }),
    );
  }
  body.push(...legend(entries, LEFT, TOP + PLOT + BELOW, WIDTH - RIGHT));
  const frame = {
    width: WIDTH,
    height: TOP + PLOT + BELOW + rows * 18 + 8,
    title,
    desc: joined(TEXT.otherIntro, otherCaption(view)),
  };
  return svgChart(frame, body, options);
}
