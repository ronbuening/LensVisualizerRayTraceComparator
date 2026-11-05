// The per-surface ray deviation of an R2 pair: a bar per surface (or visit) on a log axis (the largest hit distance there over
// the rays ok in both answers), a ring on the axis for a distance of 0, a dash for a surface where no ray is ok in
// both, and the tolerance of the policy as a line. Pure.
import { numberText } from "../../compare/metricText.ts";
import { formatFixed, formatSci } from "../../core/numeric/format.ts";
import { DASHBOARD_TEXT } from "../../report/wording.ts";
import type { DeviationView } from "../chartViews.ts";
import { legend, legendRows, logScale, px, sourceText, svgChart, text, tip } from "./svg.ts";
import type { ChartOptions, LegendEntry } from "./svg.ts";

const TEXT = DASHBOARD_TEXT.charts;

const WIDTH = 640;
const LEFT = 68;
const RIGHT = 16;
const TOP = 48;
const PLOT = 220;
const BELOW = 46;

/** A pair's largest hit distance on each surface, beside its tolerance. */
export function renderDeviation(view: DeviationView, subject: string, options: ChartOptions = {}): string {
  const [left, right, top, bottom] = [LEFT, WIDTH - RIGHT, TOP, TOP + PLOT];
  const values = view.bars.flatMap((bar) => (bar.distance.value === null ? [] : [bar.distance.value]));
  const gate = view.gate?.value ?? null;
  const y = logScale([...values, ...(gate === null ? [] : [gate])], bottom, top);
  const title = TEXT.deviationTitle(subject, view.place, view.a, view.b);
  const body: string[] = [text(12, 20, title, { className: "head" })];
  for (const decade of y.decades) {
    const at = y.at(10 ** decade);
    body.push(
      `<line class="grid" x1="${px(left)}" y1="${px(at)}" x2="${px(right)}" y2="${px(at)}"/>`,
      text(left - 6, at + 4, formatSci(10 ** decade, 1), { className: "muted", anchor: "end" }),
    );
  }
  const count = Math.max(1, view.bars.length);
  const slot = (right - left) / count;
  const barWidth = Math.min(28, slot * 0.7);
  const every = Math.max(1, Math.ceil(count / 32));
  for (const bar of view.bars) {
    const middle = left + slot * (bar.surface + 0.5);
    const value = bar.distance.value;
    const of = bar.distance.of.map(sourceText).join("; ");
    const hover = (said: string): string =>
      tip(TEXT.tipBar(view.place, formatFixed(bar.surface, 0), said, bar.distance.derivation, of));
    if (value === null) {
      body.push(
        `<line class="none" x1="${px(middle - 6)}" y1="${px(bottom)}" x2="${px(middle + 6)}" y2="${px(bottom)}">${hover(TEXT.legendNone)}</line>`,
      );
    } else if (value === 0) {
      body.push(`<circle class="ring" cx="${px(middle)}" cy="${px(bottom)}" r="4">${hover(TEXT.legendZero)}</circle>`);
    } else {
      const at = y.at(value);
      body.push(
        `<rect class="bar" x="${px(middle - barWidth / 2)}" y="${px(at)}" width="${px(barWidth)}" height="${px(bottom - at)}" rx="2">${hover(TEXT.millimetres(numberText(value)))}</rect>`,
      );
    }
    if (bar.surface % every === 0) {
      body.push(text(middle, bottom + 16, formatFixed(bar.surface, 0), { className: "muted", anchor: "middle" }));
    }
  }
  if (view.gate !== null && gate !== null && gate > 0) {
    const at = y.at(gate);
    body.push(
      `<line class="gate" x1="${px(left)}" y1="${px(at)}" x2="${px(right)}" y2="${px(at)}">${tip(TEXT.tipGate(numberText(gate), sourceText(view.gate.source)))}</line>`,
    );
  }
  body.push(
    `<line class="axis" x1="${px(left)}" y1="${px(bottom)}" x2="${px(right)}" y2="${px(bottom)}"/>`,
    `<line class="axis" x1="${px(left)}" y1="${px(top)}" x2="${px(left)}" y2="${px(bottom)}"/>`,
    text((left + right) / 2, bottom + 34, view.place === "visit" ? TEXT.axisVisit : TEXT.axisSurface, {
      anchor: "middle",
    }),
    text(16, (top + bottom) / 2, TEXT.axisDistance, { anchor: "middle", rotate: true }),
  );
  const entries: LegendEntry[] = [
    ...(values.some((value) => value > 0) ? [{ swatch: "bar" as const, className: "bar", label: TEXT.legendBar }] : []),
    ...(view.bars.some((bar) => bar.distance.value === 0)
      ? [{ swatch: "ring" as const, className: "ring", label: TEXT.legendZero }]
      : []),
    ...(view.bars.some((bar) => bar.distance.value === null)
      ? [{ swatch: "none" as const, className: "none", label: TEXT.legendNone }]
      : []),
    ...(gate === null
      ? []
      : [{ swatch: "gate" as const, className: "gate", label: TEXT.legendGate(numberText(gate)) }]),
  ];
  const rows = legendRows(entries, LEFT, right);
  body.push(...legend(entries, LEFT, bottom + BELOW, right));
  const recorded = view.maxDistance;
  if (recorded !== null && recorded.value !== null) {
    const label = TEXT.recordedLabel(numberText(recorded.value));
    body.push(
      `<g>${tip(TEXT.tipRecorded(sourceText(recorded.source)))}${text(12, 36, label, { className: "muted" })}</g>`,
    );
  }
  const desc = view.caption === "" ? TEXT.deviationIntro : `${TEXT.deviationIntro} ${view.caption}`;
  const frame = { width: WIDTH, height: bottom + BELOW + rows * 18 + 8, title, desc };
  return svgChart(frame, body, options);
}
