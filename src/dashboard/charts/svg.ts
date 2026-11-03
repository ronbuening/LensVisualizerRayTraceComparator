// What every chart of the dashboard is made of: one coordinate formatter, one stylesheet of fixed classes (light and
// dark by prefers-color-scheme), the frame of an SVG with its <title> and <desc>, axes and a legend. Pure functions:
// equal arguments give equal bytes. Nothing here has an id, so nothing depends on the order charts are drawn in.
import { formatFixed, formatSci } from "../../core/numeric/format.ts";
import { documentLabel } from "../figure.ts";
import type { Source } from "../figure.ts";

/** Text as XML: `&`, `<`, `>`, `"` and `'` escaped, safe in an element and in a quoted attribute. */
export function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** The one coordinate formatter: two decimals, trailing zeros left out, never `-0`. */
export function px(value: number): string {
  const text = formatFixed(value, 2).replace(/\.?0+$/, "");
  return text === "-0" || text === "" ? "0" : text;
}

/**
 * The categorical slots of the series, in a fixed order (blue, orange, aqua, yellow, magenta, green, violet, red), and
 * a ninth neutral one for any series past the eighth: a hue is never generated or reused for another series.
 */
export const SERIES_SLOTS = 8;
export function seriesClass(index: number): string {
  return index < SERIES_SLOTS ? `s${index}` : "sx";
}

const LIGHT_SERIES = ["#2a78d6", "#e2622d", "#16996a", "#b47b00", "#cf5f8e", "#008300", "#6250d6", "#e34948"];
const DARK_SERIES = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];

function seriesRules(colours: readonly string[], other: string): string {
  return [
    ...colours.map((colour, index) => `.lvc .s${index}{stroke:${colour}}\n.lvc .dot.s${index}{fill:${colour}}`),
    `.lvc .sx{stroke:${other}}\n.lvc .dot.sx{fill:${other}}`,
  ].join("\n");
}

/** The heat map's verdict cells: a fill and the ink of its label, light then dark. */
const VERDICT_CELLS: readonly (readonly [string, string, string, string, string])[] = [
  ["PASS", "#cdebcd", "#0b3d0b", "#1d4a22", "#d9f2d9"],
  ["FLOOR", "#e3f2dc", "#24451a", "#2b4223", "#e1efdb"],
  ["FAIL", "#f6cfcc", "#5c0f0b", "#5a1d1a", "#ffdcd8"],
  ["ERROR", "#e9b7b3", "#4a0906", "#6b2420", "#ffe3e0"],
  ["ATTENTION", "#fbe5ad", "#4a3600", "#56420a", "#fbeac0"],
  ["RECORDED", "#e3e3ea", "#2c2c33", "#34343c", "#e4e4ea"],
  ["UNSUPPORTED", "#ededf1", "#45454e", "#2a2a31", "#c8c8d0"],
  ["BLOCKED", "#d9d9e1", "#2c2c33", "#3d3d46", "#e4e4ea"],
];

/**
 * The stylesheet of the charts: a page puts it in its one <style>, and a standalone SVG carries it itself, so that a
 * golden file renders alone. Colours are fixed classes; the text wears ink, never a series colour.
 */
export const CHART_STYLE = [
  ".lvc{font:11px system-ui,-apple-system,'Segoe UI',sans-serif}",
  ".lvc .bg{fill:#fcfcfb}",
  ".lvc text{fill:#1c1c21}",
  ".lvc text.muted{fill:#5c5c66}",
  ".lvc text.head{font-weight:600;font-size:12px}",
  ".lvc .grid{stroke:#e6e6ea;stroke-width:1}",
  ".lvc .axis{stroke:#8a8a94;stroke-width:1}",
  ".lvc .line{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}",
  ".lvc .dash{stroke-dasharray:6 4}",
  ".lvc .dot{stroke:#fcfcfb;stroke-width:1.5}",
  ".lvc .band{fill:#eda100;fill-opacity:.16;stroke:#c98500;stroke-width:1;stroke-dasharray:2 3}",
  ".lvc .zeroline{stroke:#5c5c66;stroke-width:1}",
  ".lvc .gate{stroke:#d03b3b;stroke-width:1.5;stroke-dasharray:5 3;fill:none}",
  ".lvc .bar{fill:#2a78d6}",
  ".lvc .ring{fill:#fcfcfb;stroke:#2a78d6;stroke-width:2}",
  ".lvc .none{stroke:#8a8a94;stroke-width:2}",
  ".lvc .cell{stroke:#fcfcfb;stroke-width:2}",
  ".lvc .cell.empty{fill:#f4f4f6}",
  ".lvc text.vt{font-weight:600;text-anchor:middle}",
  seriesRules(LIGHT_SERIES, "#8a8a94"),
  ...VERDICT_CELLS.map(
    ([verdict, fill, ink]) => `.lvc .v-${verdict}{fill:${fill}}\n.lvc text.t-${verdict}{fill:${ink}}`,
  ),
  "@media (prefers-color-scheme:dark){",
  ".lvc .bg{fill:#1a1a19}",
  ".lvc text{fill:#e7e7ec}",
  ".lvc text.muted{fill:#a3a3ad}",
  ".lvc .grid{stroke:#2e2e34}",
  ".lvc .axis{stroke:#6b6b75}",
  ".lvc .dot{stroke:#1a1a19}",
  ".lvc .band{fill:#c98500;fill-opacity:.22;stroke:#eda100}",
  ".lvc .zeroline{stroke:#a3a3ad}",
  ".lvc .gate{stroke:#e66767}",
  ".lvc .bar{fill:#3987e5}",
  ".lvc .ring{fill:#1a1a19;stroke:#3987e5}",
  ".lvc .none{stroke:#6b6b75}",
  ".lvc .cell{stroke:#1a1a19}",
  ".lvc .cell.empty{fill:#222226}",
  seriesRules(DARK_SERIES, "#6b6b75"),
  ...VERDICT_CELLS.map(
    ([verdict, , , fill, ink]) => `.lvc .v-${verdict}{fill:${fill}}\n.lvc text.t-${verdict}{fill:${ink}}`,
  ),
  "}",
].join("\n");

/** Where a number was read from, as a person finds it: the file under the root or the runs directory and the pointer. */
export function sourceText(source: Source): string {
  return `${documentLabel(source.document)} ${source.pointer}`;
}

/** A mark's tooltip. */
export function tip(text: string): string {
  return `<title>${escapeXml(text)}</title>`;
}

/** A text element; `className` adds classes, `anchor` its text-anchor. */
export function text(
  x: number,
  y: number,
  content: string,
  options: {
    readonly className?: string;
    readonly anchor?: "start" | "middle" | "end";
    readonly rotate?: boolean;
  } = {},
): string {
  const classes = options.className === undefined ? "" : ` class="${options.className}"`;
  const anchor = options.anchor === undefined || options.anchor === "start" ? "" : ` text-anchor="${options.anchor}"`;
  const rotate = options.rotate === true ? ` transform="rotate(-90 ${px(x)} ${px(y)})"` : "";
  return `<text x="${px(x)}" y="${px(y)}"${classes}${anchor}${rotate}>${escapeXml(content)}</text>`;
}

/** What a chart is, for its frame. */
export interface ChartFrame {
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly desc: string;
}

/** How a chart is drawn: inside a page (its classes styled by the page) or standalone (with its own <style>). */
export interface ChartOptions {
  readonly standalone?: boolean;
}

/** An SVG: its frame, its <title> and <desc> first, then its body. */
export function svgChart(frame: ChartFrame, body: readonly string[], options: ChartOptions = {}): string {
  const { width, height } = frame;
  const head =
    options.standalone === true
      ? `<svg xmlns="http://www.w3.org/2000/svg" class="lvc" width="${px(width)}" height="${px(height)}" viewBox="0 0 ${px(width)} ${px(height)}" role="img">`
      : `<svg class="lvc" width="${px(width)}" height="${px(height)}" viewBox="0 0 ${px(width)} ${px(height)}" role="img">`;
  return [
    head,
    `<title>${escapeXml(frame.title)}</title>`,
    `<desc>${escapeXml(frame.desc)}</desc>`,
    ...(options.standalone === true ? [`<style>${CHART_STYLE}</style>`] : []),
    `<rect class="bg" x="0" y="0" width="${px(width)}" height="${px(height)}"/>`,
    ...body,
    "</svg>",
    ...(options.standalone === true ? [""] : []),
  ].join("\n");
}

/** A linear scale: from a domain to a range of pixels. */
export interface Scale {
  readonly lo: number;
  readonly hi: number;
  readonly ticks: readonly number[];
  readonly step: number;
  at(value: number): number;
}

/** The narrowest domain a linear axis is drawn over: a narrower one (down to a subnormal) is widened to it. */
const NARROWEST = 1e-290;
/** The most ticks a linear axis draws; past it (never for a domain widened to whole steps) only its two ends. */
const MOST_TICKS = 1000;

/**
 * The ticks of a linear axis over [lo, hi]: steps of 1, 2 or 5 times a power of ten, about `count` of them, the domain
 * widened to whole steps. A domain of no width is widened by one on each side, one narrower than `NARROWEST` to that
 * width about its middle, and one that is not finite is [0, 1]: no input gives a step of 0, an infinity or a NaN.
 */
export function linearScale(lo: number, hi: number, from: number, to: number, count = 5): Scale {
  let [low, high] = Number.isFinite(lo) && Number.isFinite(hi) ? [Math.min(lo, hi), Math.max(lo, hi)] : [0, 1];
  if (low === high) [low, high] = [low - 1, high + 1];
  if (!(high - low >= NARROWEST)) {
    const middle = low / 2 + high / 2;
    [low, high] = [middle - NARROWEST / 2, middle + NARROWEST / 2];
  }
  const raw = (high - low) / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / magnitude;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magnitude;
  if (!(step > 0) || !Number.isFinite(step)) throw new Error(`linearScale: no step for [${lo}, ${hi}]`);
  const first = Math.floor(low / step);
  const last = Math.ceil(high / step);
  const ticks: number[] = [];
  if (last - first <= MOST_TICKS) for (let k = first; k <= last; k++) ticks.push(k * step);
  else ticks.push(first * step, last * step);
  const [domainLo, domainHi] = [first * step, last * step];
  return {
    lo: domainLo,
    hi: domainHi,
    ticks,
    step,
    at: (value) => from + ((value - domainLo) / (domainHi - domainLo)) * (to - from),
  };
}

/** A tick's label on a linear axis of `step`: as many decimals as the step needs, in scientific notation when tiny. */
export function tickText(value: number, step: number): string {
  if (Math.abs(value) < step / 2) return "0";
  if (step >= 1) return formatFixed(value, 0);
  if (step >= 1e-3) return formatFixed(value, Math.ceil(-Math.log10(step) - 1e-9));
  return formatSci(value, 2);
}

/** A logarithmic scale of whole decades over the positive values given. */
export interface LogScale {
  readonly decades: readonly number[];
  at(value: number): number;
}

/** The decades a log axis is held within: a value beyond them (a subnormal, say) is drawn at the axis's end. */
const LEAST_DECADE = -300;
const GREATEST_DECADE = 300;

export function logScale(values: readonly number[], from: number, to: number): LogScale {
  const positive = values.filter((value) => value > 0 && Number.isFinite(value));
  const [min, max] = positive.length === 0 ? [1e-9, 1e-6] : [Math.min(...positive), Math.max(...positive)];
  const clamp = (decade: number): number => Math.min(GREATEST_DECADE, Math.max(LEAST_DECADE, decade));
  // A decade below the least value, so that a bar or a line at the least value stands clear of the axis.
  const lo = clamp(Math.floor(Math.log10(min)) - 1);
  const hi = Math.max(clamp(Math.ceil(Math.log10(max))), lo + 2);
  const decades: number[] = [];
  for (let k = lo; k <= hi; k++) decades.push(k);
  return {
    decades,
    at: (value) => {
      const decade = Math.min(hi, Math.max(lo, Math.log10(value)));
      return from + ((decade - lo) / (hi - lo)) * (to - from);
    },
  };
}

/** The marker shapes of the series, by place: a shape each, so that coinciding curves stay told apart. */
export const MARKER_SHAPES = ["circle", "square", "triangle", "diamond", "down", "cross"] as const;
export type MarkerShape = (typeof MARKER_SHAPES)[number];

export function markerShape(index: number): MarkerShape {
  return MARKER_SHAPES[index % MARKER_SHAPES.length];
}

/** A series's marker at (cx, cy), about 8 px across, with what is inside it (a tooltip). */
export function marker(shape: MarkerShape, className: string, cx: number, cy: number, inside = ""): string {
  const at = (dx: number, dy: number): string => `${px(cx + dx)},${px(cy + dy)}`;
  const cls = `dot ${className}`;
  if (shape === "circle") return `<circle class="${cls}" cx="${px(cx)}" cy="${px(cy)}" r="4">${inside}</circle>`;
  if (shape === "square") {
    return `<rect class="${cls}" x="${px(cx - 4)}" y="${px(cy - 4)}" width="8" height="8">${inside}</rect>`;
  }
  const points =
    shape === "triangle"
      ? [at(0, -5), at(5, 4), at(-5, 4)]
      : shape === "down"
        ? [at(0, 5), at(5, -4), at(-5, -4)]
        : shape === "diamond"
          ? [at(0, -5), at(5, 0), at(0, 5), at(-5, 0)]
          : [
              at(-2, -5),
              at(2, -5),
              at(2, -2),
              at(5, -2),
              at(5, 2),
              at(2, 2),
              at(2, 5),
              at(-2, 5),
              at(-2, 2),
              at(-5, 2),
              at(-5, -2),
              at(-2, -2),
            ];
  return `<polygon class="${cls}" points="${points.join(" ")}">${inside}</polygon>`;
}

/** One entry of a legend: a swatch, its label and, where there is more to say, a tooltip. */
export interface LegendEntry {
  readonly swatch: "line" | "dash" | "band" | "bar" | "ring" | "none" | "gate" | "cell";
  /** The classes of the swatch: a series slot, or a verdict's cell. */
  readonly className: string;
  readonly label: string;
  /** The marker of a line's series. */
  readonly marker?: MarkerShape;
  /** What the entry's tooltip says beyond its label. */
  readonly hover?: string;
}

/** How tall a legend of these entries is when laid out from `x` to `right`, rows of 18 px. */
export function legendRows(entries: readonly LegendEntry[], x: number, right: number): number {
  return layoutLegend(entries, x, right).rows;
}

/** Each entry's place: a width estimated from its label, wrapped at `right`. */
function layoutLegend(
  entries: readonly LegendEntry[],
  x: number,
  right: number,
): { readonly rows: number; readonly places: readonly { readonly x: number; readonly row: number }[] } {
  const places: { x: number; row: number }[] = [];
  let [at, row] = [x, 0];
  for (const entry of entries) {
    const width = 30 + 6.2 * entry.label.length + 14;
    if (at > x && at + width > right) [at, row] = [x, row + 1];
    places.push({ x: at, row });
    at += width;
  }
  return { rows: entries.length === 0 ? 0 : row + 1, places };
}

/** A legend: each entry's swatch and its label, in rows of 18 px from `y`. */
export function legend(entries: readonly LegendEntry[], x: number, y: number, right: number): string[] {
  const { places } = layoutLegend(entries, x, right);
  return entries.map((entry, index) => {
    const place = places[index];
    const [sx, sy] = [place.x, y + place.row * 18];
    const mid = sy + 9;
    const swatch =
      entry.swatch === "line" || entry.swatch === "dash"
        ? `<line class="line ${entry.className}${entry.swatch === "dash" ? " dash" : ""}" x1="${px(sx)}" y1="${px(mid)}" x2="${px(sx + 24)}" y2="${px(mid)}"/>${marker(entry.marker ?? "circle", entry.className, sx + 12, mid)}`
        : entry.swatch === "band"
          ? `<rect class="band" x="${px(sx)}" y="${px(mid - 5)}" width="24" height="10"/>`
          : entry.swatch === "bar"
            ? `<rect class="bar" x="${px(sx + 6)}" y="${px(mid - 6)}" width="12" height="12" rx="2"/>`
            : entry.swatch === "ring"
              ? `<circle class="ring" cx="${px(sx + 12)}" cy="${px(mid)}" r="4"/>`
              : entry.swatch === "none"
                ? `<line class="none" x1="${px(sx + 6)}" y1="${px(mid)}" x2="${px(sx + 18)}" y2="${px(mid)}"/>`
                : entry.swatch === "gate"
                  ? `<line class="gate" x1="${px(sx)}" y1="${px(mid)}" x2="${px(sx + 24)}" y2="${px(mid)}"/>`
                  : `<rect class="cell ${entry.className}" x="${px(sx)}" y="${px(mid - 7)}" width="24" height="14"/>`;
    const hover = entry.hover === undefined ? "" : tip(entry.hover);
    return `<g>${hover}${swatch}${text(sx + 30, mid + 4, entry.label)}</g>`;
  });
}
