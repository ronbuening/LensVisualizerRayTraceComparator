// The pages of the dashboard, from their view models alone: pure functions, equal views giving equal bytes. Every
// interpolated string is escaped; a page has one inline <style> (light and dark by prefers-color-scheme) and no
// script. A number read from a file shows its source on hover; every sentence is a template of `DASHBOARD_TEXT`.
// Every label is the vocabulary's (`src/vocabulary`): a check by its title with its id beside it, an engine by its
// name with its id on hover, a verdict, badge, class or figure by its label with the stored value on hover. Hashes
// (suite file, lens states, requests, engine code, store keys) are under a <details> whose summary is "Identifiers".
import { numberText } from "../compare/metricText.ts";
import type { Verdict } from "../contract/comparison.ts";
import { LEGACY_RUN_CODE } from "../core/legacyIds.ts";
import { formatFixed } from "../core/numeric/format.ts";
import {
  COMPARE_AXES,
  CONSENSUS_SECTION,
  DASHBOARD_TEXT,
  fieldReasonText,
  GEOMETRIC_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  MTF_COMPARISON_OUTRO,
  NOT_COVERED,
  WAVEFRONT_SEVERAL_LINES,
  consensusSentence,
} from "../report/wording.ts";
import {
  CHECKS_COMMAND_TEXT,
  BASELINE_KIND_TEXT,
  CLASS_KIND,
  GLOSSARY_TEXT,
  LIMIT_KIND_TEXT,
  METHOD_TEXT,
  PLACE_TEXT,
  ROW_STATUS_TEXT,
  SORTING_LIMITS,
  SORTING_LIMIT_LABEL,
  SUPPORT_STATUS_TEXT,
  VERDICT_TEXT,
  badgeLabel,
  checkTitle,
  classLabel,
  codeTextOf,
  engineName,
  metricLabel,
  modeLabel,
  reasonsText,
  quantityLabel,
  rowStatusLabel,
  valueLabel,
  verdictLabel,
  verdictShort,
} from "../vocabulary/index.ts";
import { HEAT_MAP_ROWS } from "./chartViews.ts";
import type { HeatMapView, SectionCharts } from "./chartViews.ts";
import { renderDeviation } from "./charts/deviation.ts";
import { renderHeatMap } from "./charts/heatMap.ts";
import { curveName, otherCaption, renderLensOther, renderLensOverlay } from "./charts/lens.ts";
import { differenceCaption, overlayCaption, renderMtfDifference, renderMtfOverlay } from "./charts/mtf.ts";
import { CHART_STYLE } from "./charts/svg.ts";
import { documentLabel } from "./figure.ts";
import type { Derived, Figure } from "./figure.ts";
import { BENCHMARK_APERTURES } from "../cli/benchmarkProfile.ts";
import { CONTROL_MAX_JOBS, LENS_ENGINES, LENS_RUNS } from "./control.ts";
import type { ControlView, JobEntry, JobView, StepView, StoreJobView } from "./control.ts";
import { curveEngine } from "./lens.ts";
import { COMPARE_TABS } from "./compare.ts";
import type { CompareCard, CompareView, ConditionLabel, GatedLine, RecordedLine } from "./compare.ts";
import type { SetAsideElement, ValuesTableView } from "./compareCharts.ts";
import { fanChartCaption, pairBandCaption, renderFanChart, renderPairChart } from "./charts/compare.ts";
import type { LensCondition, LensCurveView, LensView } from "./lens.ts";
import type { ChecksView, HelpView } from "./helpViews.ts";
import type {
  BaselinePairView,
  BaselineRunView,
  BaselineView,
  DocumentProblem,
  IndexView,
  MetricView,
  MtfView,
  RunPartView,
  RunView,
  SectionEntry,
  SectionView,
  StalenessBases,
  StatusCount,
  VerdictCount,
  ViewEngine,
  WhereEntry,
} from "./views.ts";

/** Text as HTML: `&`, `<`, `>`, `"` and `'` escaped, so that it is safe in an element and in a quoted attribute. */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const STYLE = `
:root{color-scheme:light dark;--bg:#ffffff;--fg:#1c1c21;--muted:#5c5c66;--line:#d8d8de;--head:#f2f2f5;
--pass:#1d7034;--fail:#b3261e;--warn:#865500;--info:#2c56a0;--quiet:#6b6b75}
@media (prefers-color-scheme:dark){:root{--bg:#141418;--fg:#e7e7ec;--muted:#a3a3ad;--line:#36363e;--head:#1f1f25;
--pass:#6fcf87;--fail:#ff8a80;--warn:#f0c060;--info:#8fb4ff;--quiet:#9a9aa5}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
header{border-bottom:1px solid var(--line);padding:8px 16px;display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}
header a{color:var(--info);text-decoration:none}
main{padding:8px 16px 32px;max-width:1600px}
h1{font-size:20px;margin:12px 0}h2{font-size:16px;margin:20px 0 8px}h3{font-size:14px;margin:14px 0 6px}
p{margin:6px 0;max-width:110ch}a{color:var(--info)}
.scroll{overflow-x:auto}
table{border-collapse:collapse;margin:6px 0 12px;font-variant-numeric:tabular-nums}
th,td{border:1px solid var(--line);padding:3px 6px;text-align:left;vertical-align:top}
th{background:var(--head);font-weight:600}
code,.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
.muted{color:var(--muted)}.problem{color:var(--fail)}
.fig{border-bottom:1px dotted var(--muted);cursor:help}.derived{border-bottom:1px dashed var(--warn);cursor:help}
.v-PASS,.v-FLOOR,.b-CURRENT{color:var(--pass);font-weight:600}
.v-FAIL,.v-ERROR,.b-STALE{color:var(--fail);font-weight:600}
.v-ATTENTION,.b-NOTKNOWN{color:var(--warn);font-weight:600}
.v-RECORDED,.v-UNSUPPORTED,.v-BLOCKED{color:var(--quiet);font-weight:600}
details{margin:4px 0}summary{cursor:pointer}
.card{border:1px solid var(--line);border-radius:8px;padding:2px 14px 8px;margin:14px 0;max-width:1200px}
.card h2{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.badges{font-size:14px}
.chip{display:inline-block;margin:0 6px 4px 0;padding:1px 8px;border:1px solid var(--line);border-radius:10px;text-decoration:none}
strong.chip{background:var(--head)}
form{margin:6px 0 12px}label{display:inline-block;margin:0 12px 6px 0}input,select,button{font:inherit}
pre{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--head);border:1px solid var(--line);padding:6px;max-height:480px;overflow-y:auto}
ul{margin:4px 0;padding-left:20px}
figure{margin:8px 0 16px}figcaption{color:var(--muted);max-width:110ch;margin-top:4px}
${CHART_STYLE}
`;

const L = DASHBOARD_TEXT.labels;
const C = L.columns;

/** A whole page: the head with its one stylesheet, the bar of links, and the body; `refresh` reloads it every 2 s. */
function page(title: string, json: string, body: readonly string[], refresh = false): string {
  const links = [link("/", L.home), link("/control", L.runControl), link("/checks", L.checks), link("/help", L.help)];
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    ...(refresh ? ['<meta http-equiv="refresh" content="2">'] : []),
    `<title>${escapeHtml(title)}</title>`,
    `<style>${STYLE}</style>`,
    "</head>",
    "<body>",
    `<header>${links.join("")}<span class="muted">${escapeHtml(title)}</span>${link(json, L.json)}</header>`,
    "<main>",
    ...body,
    "</main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

const p = (text: string, className?: string): string =>
  `<p${className === undefined ? "" : ` class="${className}"`}>${escapeHtml(text)}</p>`;
const h = (level: 1 | 2 | 3, text: string): string => `<h${level}>${escapeHtml(text)}</h${level}>`;
const code = (text: string): string => `<code>${escapeHtml(text)}</code>`;
const link = (href: string, text: string): string => `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
const count = (value: number): string => formatFixed(value, 0);
const MUTED_DASH = '<span class="muted">—</span>';

/** A table, its header cells HTML already as well as its cells. */
function htmlTable(header: readonly string[], rows: readonly (readonly string[])[]): string {
  const head = `<tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr>`;
  const body = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("\n");
  return `<div class="scroll"><table>\n${head}\n${body}\n</table></div>`;
}

/** A table, its header plain text and its cells HTML already. */
function table(header: readonly string[], rows: readonly (readonly string[])[]): string {
  return htmlTable(header.map(escapeHtml), rows);
}

/** "How to read this page": a short <details> of the sentences that say how, closed until it is opened. */
function howToRead(sentences: readonly string[], more: readonly string[] = []): string {
  return [
    `<details><summary>${escapeHtml(L.howToRead)}</summary>`,
    ...sentences.map((sentence) => p(sentence)),
    ...more,
    "</details>",
  ].join("\n");
}

/**
 * The identifiers of a page (hashes of files, engines, lens states and requests) under a <details> whose summary is
 * exactly "Identifiers"; nothing where there are none. Its parts are HTML, and none is a <details>.
 */
function identifiers(parts: readonly string[]): string {
  if (parts.length === 0) return "";
  return [
    `<details><summary>${escapeHtml(L.identifiers)}</summary>`,
    p(DASHBOARD_TEXT.howTo.identifiers, "muted"),
    ...parts,
    "</details>",
  ].join("\n");
}

/** Rows of identifiers as a table of two columns: what each is of, and the identifier. */
function identifierTable(rows: readonly (readonly [string, string])[]): string {
  return table(
    [C.name, L.identifiers],
    rows.map(([what, id]) => [escapeHtml(what), code(id)]),
  );
}

/** A check: its title, with its id beside it in small code. */
function check(id: string): string {
  const title = checkTitle(id);
  return title === id ? code(id) : `${escapeHtml(title)} ${code(id)}`;
}

/** A check in plain text, for a sentence: its title with its id in parentheses. */
function checkName(id: string): string {
  const title = checkTitle(id);
  return title === id ? id : `${title} (${id})`;
}

/** An engine: its name, with its id on hover; an engine of a configuration, which has no name, by its id. */
function engine(id: string): string {
  const name = engineName(id);
  return name === id ? code(id) : `<span title="${escapeHtml(id)}">${escapeHtml(name)}</span>`;
}

/** A figure's name: its label, with the key the files store it under on hover; a key with no label as it is. */
function metricName(key: string): string {
  const label = metricLabel(key);
  return label === key ? code(key) : `<span title="${escapeHtml(key)}">${escapeHtml(label)}</span>`;
}

/** A quantity: its label, with its stored name beside it in small code. */
function quantity(name: string): string {
  const label = quantityLabel(name);
  return label === name ? code(name) : `${escapeHtml(label)} ${code(name)}`;
}

/** A class of a difference: its label, with the stored value on hover. */
function differenceClass(kind: string | null): string {
  if (kind === null) return MUTED_DASH;
  return `<span title="${escapeHtml(kind)}">${escapeHtml(classLabel(kind))}</span>`;
}

/** A reason of a field: its sentence, with the stored value on hover; a reason with no sentence as it is. */
function fieldReason(reason: string | null): string {
  if (reason === null) return MUTED_DASH;
  return `<span title="${escapeHtml(reason)}">${escapeHtml(fieldReasonText(reason))}</span>`;
}

/** A figure: its value, with its file and pointer on hover. */
function figure(value: Figure | null): string {
  if (value === null) return MUTED_DASH;
  const said = value.value === null ? L.notFinite : numberText(value.value);
  const where = `${documentLabel(value.source.document)} ${value.source.pointer}`;
  return `<span class="fig" title="${escapeHtml(where)}">${escapeHtml(said)}</span>`;
}

/** A figure written as the file holds it, shortest form (a position, a stop, a wavelength), with its source on hover. */
function plainFigure(value: Figure | null): string {
  if (value === null) return MUTED_DASH;
  const said = value.value === null ? L.notFinite : String(value.value);
  const where = `${documentLabel(value.source.document)} ${value.source.pointer}`;
  return `<span class="fig" title="${escapeHtml(where)}">${escapeHtml(said)}</span>`;
}

/** A derived number: its value, with how it was computed on hover. */
function derivedValue(value: Derived): string {
  const said = value.value === null ? L.notFinite : numberText(value.value);
  const of = value.of.map((source) => `${documentLabel(source.document)} ${source.pointer}`).join("; ");
  return `<span class="derived" title="${escapeHtml(L.derivedTitle(value.derivation, of))}">${escapeHtml(said)}</span>`;
}

function figureOrDerived(value: Figure | Derived | null): string {
  if (value === null) return MUTED_DASH;
  return "derivation" in value ? derivedValue(value) : figure(value);
}

/** A verdict: its label, with the stored value on hover; the class of the stored value colours it. */
function verdict(value: Verdict | null): string {
  if (value === null) return MUTED_DASH;
  return `<span class="v-${value}" title="${escapeHtml(value)}">${escapeHtml(verdictLabel(value))}</span>`;
}

/**
 * A verdict in a list of counts or a cell of a large table: its short label, with the stored value on hover unless
 * `bare` (a baseline's table of runs, where every cell has one: the legend says what each label stores).
 */
function shortVerdict(value: Verdict, bare = false): string {
  const title = bare ? "" : ` title="${escapeHtml(value)}"`;
  return `<span class="v-${value}"${title}>${escapeHtml(verdictShort(value))}</span>`;
}

/** A badge of a record (`STALE(<reasons>)`, `CURRENT`, `NOT KNOWN(<reasons>)`): its label, the stored badge on hover. */
function badge(value: string): string {
  const reasons = /^(STALE|NOT KNOWN)\((.*)\)$/.exec(value);
  const kind = value.startsWith("STALE") ? "STALE" : value.startsWith("NOT KNOWN") ? "NOTKNOWN" : "CURRENT";
  const label =
    reasons === null
      ? value === "CURRENT"
        ? badgeLabel([], [])
        : value
      : reasons[1] === "STALE"
        ? badgeLabel(reasons[2].split(","), [])
        : badgeLabel([], reasons[2].split(","));
  return `<span class="b-${kind}" title="${escapeHtml(value)}">${escapeHtml(label)}</span>`;
}

function verdictCounts(counts: readonly VerdictCount[]): string {
  const said = counts
    .filter(({ count: n }) => n > 0)
    .map(({ verdict: v, count: n }) => `${count(n)} ${shortVerdict(v)}`);
  return said.length === 0 ? MUTED_DASH : said.join(", ");
}

/** How a job or a cell of the support matrix ended, in words. */
function statusText(status: string): string {
  return valueLabel(SUPPORT_STATUS_TEXT, status);
}

function statusCounts(counts: readonly StatusCount[]): string {
  const said = counts
    .filter(({ count: n }) => n > 0)
    .map(
      ({ status, count: n }) =>
        `${count(n)} <span title="${escapeHtml(status)}">${escapeHtml(statusText(status))}</span>`,
    );
  return said.length === 0 ? MUTED_DASH : said.join(", ");
}

function problems(list: readonly DocumentProblem[]): string[] {
  return list.map(({ document, problem }) => p(DASHBOARD_TEXT.documentProblem(document, problem), "problem"));
}

/** An engine's state and version; its code and this tool's code behind it are identifiers (`engineIdentifiers`). */
function engineText(value: ViewEngine | null): string {
  if (value === null) return `<span class="muted">${escapeHtml(L.notKnown)}</span>`;
  if (value.status === "unavailable") return `${escapeHtml(L.unavailableCode)} ${code(value.code)}`;
  return escapeHtml(value.version);
}

function enginesTable(engines: readonly ViewEngine[]): string {
  return table(
    [C.engine, C.status, C.version],
    engines.map((each) =>
      each.status === "unavailable"
        ? [engine(each.id), escapeHtml(L.unavailable), code(each.code)]
        : [engine(each.id), escapeHtml(L.available), escapeHtml(each.version)],
    ),
  );
}

/** The engines' code and this tool's code behind each, for a page's identifiers. */
function engineIdentifiers(engines: readonly ViewEngine[]): string {
  return table(
    [C.engine, C.engineCode, C.toolCode],
    engines.map((each) =>
      each.status === "unavailable"
        ? [engine(each.id), MUTED_DASH, MUTED_DASH]
        : [
            engine(each.id),
            code(each.fingerprint),
            each.adapterRevision === null ? MUTED_DASH : code(each.adapterRevision),
          ],
    ),
  );
}

const runHref = (name: string): string => `/run/${encodeURIComponent(name)}`;
const sectionHref = (name: string, section: number): string => `${runHref(name)}/section/${section}`;
const baselineHref = (stem: string): string => `/baseline/${encodeURIComponent(stem)}`;

const baselineRunHref = (stem: string, place: number): string => `${baselineHref(stem)}/run/${place}`;
const runPartHref = (name: string, place: number): string => `${runHref(name)}/run/${place}`;
const lensHref = (key: string): string => `/lens/${encodeURIComponent(key)}`;

/**
 * A template filled with HTML: the template is given placeholders, its text is escaped, and only then is each
 * placeholder replaced by its fragment, so that a template's own words are escaped and the fragments are not.
 */
function fill(template: (...holes: string[]) => string, fragments: readonly string[]): string {
  const holes = fragments.map((_fragment, index) => `\u0000${index}\u0000`);
  let text = escapeHtml(template(...holes));
  fragments.forEach((fragment, index) => {
    text = text.replace(holes[index], fragment);
  });
  return text;
}

/** The sentences that say what each reason of a baseline's records is judged against. */
function basesText(bases: StalenessBases): string[] {
  const text = DASHBOARD_TEXT.staleness;
  const engine =
    bases.engine === "asked"
      ? text.engineAsked
      : bases.asked === "asking"
        ? bases.engine === "last-run"
          ? text.engineAskingLastRun
          : text.engineAskingNone
        : bases.asked === "failed"
          ? bases.engine === "last-run"
            ? text.engineFailedLastRun
            : text.engineFailedNone
          : bases.engine === "last-run"
            ? text.engineLastRun
            : text.engineNone;
  return [
    bases.policy === "none" ? text.policyNone : text.policy,
    engine,
    bases.case === "last-run" ? text.caseLastRun : text.caseNone,
  ];
}

function askedText(state: IndexView["engines"]): string {
  const text = DASHBOARD_TEXT.staleness;
  if (state.state === "asked") return text.asked;
  if (state.state === "asking") return text.asking;
  if (state.state === "failed") return text.askFailed(state.problem ?? "");
  return text.notAsked;
}

function problemsCell(lines: readonly string[]): string {
  return (
    lines.map((line) => `<span class="problem">${escapeHtml(line)}</span>`).join("<br>") ||
    '<span class="muted">—</span>'
  );
}

// ── Charts ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** A chart in a figure, with a caption where it has more to say than the intro above it (never an empty one). */
function chartFigure(svg: string, caption: string): string {
  const said = caption === "" ? "" : `<figcaption>${escapeHtml(caption)}</figcaption>`;
  return `<figure><div class="scroll">${svg}</div>${said}</figure>`;
}

/** The heat map of a run directory or a baseline, or the sentence that says why it is left out. */
function heatMapBlock(view: HeatMapView | null, subject: string, kind: "run" | "baseline"): string[] {
  if (view === null) return [];
  const text = DASHBOARD_TEXT.charts;
  if (view.omitted !== null) {
    return [h(2, L.heatMap), p(text.heatMapOmitted(count(view.omitted.count), count(HEAT_MAP_ROWS)))];
  }
  return [
    h(2, L.heatMap),
    chartFigure(renderHeatMap(view, subject, kind), kind === "run" ? text.heatMapRun : text.heatMapBaseline),
  ];
}

/** The charts of a section: its store problems, its MTF overlays and differences, its per-surface deviations. */
function chartsBlock(charts: SectionCharts, subject: string): string[] {
  const text = DASHBOARD_TEXT.charts;
  const any = charts.overlays.length + charts.differences.length + charts.deviations.length > 0;
  if (!any && charts.problems.length === 0) return [];
  const out = [
    h(2, L.charts),
    p(text.intro),
    p(text.storeIntro),
    ...charts.problems.map((problem) => p(problem, "problem")),
  ];
  if (charts.overlays.length > 0) {
    out.push(h(3, L.overlays), p(text.overlayIntro));
    for (const view of charts.overlays) out.push(chartFigure(renderMtfOverlay(view, subject), overlayCaption(view)));
  }
  if (charts.differences.length > 0) {
    out.push(h(3, L.differences), p(text.differenceIntro));
    for (const view of charts.differences) {
      out.push(chartFigure(renderMtfDifference(view, subject), differenceCaption(view)));
    }
  }
  if (charts.deviations.length > 0) {
    out.push(h(3, L.deviations), p(text.deviationIntro));
    for (const view of charts.deviations) {
      out.push(
        ...view.problems.map((problem) => p(problem, "problem")),
        chartFigure(renderDeviation(view, subject), view.caption),
      );
    }
  }
  if (!any) out.push(p(text.noCharts));
  return out;
}

/** The legend of the verdicts: each label with its meaning, the stored value on hover. */
function verdictLegend(): string {
  const items = Object.entries(VERDICT_TEXT).map(
    ([stored, text]) =>
      `<li>${shortVerdictLabel(stored as Verdict, L.labelStored(text.label, stored))}: ${escapeHtml(text.meaning)}</li>`,
  );
  return `${p(DASHBOARD_TEXT.verdictsIntro)}<ul>${items.join("")}</ul>`;
}

function shortVerdictLabel(value: Verdict, label: string): string {
  return `<span class="v-${value}" title="${escapeHtml(value)}">${escapeHtml(label)}</span>`;
}

// ── The index ────────────────────────────────────────────────────────────────────────────────────────────────────

/** The index page. */
export function renderIndex(view: IndexView): string {
  const text = DASHBOARD_TEXT.staleness;
  const body = [
    h(1, L.indexHeading),
    p(DASHBOARD_TEXT.readOnly),
    howToRead(
      [DASHBOARD_TEXT.howTo.index, DASHBOARD_TEXT.sources, text.intro, text.badges, text.check],
      [verdictLegend()],
    ),
    ...problems(view.problems),
    view.policy === null ? "" : `<p>${fill(DASHBOARD_TEXT.policyAtHand, [figure(view.policy.version)])}</p>`,
    p(askedText(view.engines)),
    ...comparedBlock(view),
    h(2, L.runs),
    view.runs.length === 0
      ? p(DASHBOARD_TEXT.noRuns)
      : table(
          [C.suite, C.jobs, C.compared, C.pairsByVerdict, C.failing, C.problems],
          view.runs.map((run) => [
            link(runHref(run.name), run.name),
            statusCounts(run.jobs),
            run.comparisons === "ok" ? escapeHtml(L.yes) : run.comparisons === "none" ? escapeHtml(L.no) : MUTED_DASH,
            verdictCounts(run.verdicts),
            count(run.failing),
            problemsCell([
              ...run.problems.map(({ document, problem }) => DASHBOARD_TEXT.documentProblem(document, problem)),
              ...run.inputProblems,
            ]),
          ]),
        ),
    h(2, L.baselines),
    view.baselines.length === 0
      ? p(DASHBOARD_TEXT.noBaselines)
      : table(
          [C.baseline, C.kind, C.suite, C.limitsFile, C.records, C.recordsByVerdict, C.recordsByBadge, C.problems],
          view.baselines.map((baseline) => [
            link(baselineHref(baseline.stem), baseline.stem),
            escapeHtml(valueLabel(BASELINE_KIND_TEXT, baseline.kind)),
            baseline.suite === null ? "—" : escapeHtml(baseline.suite),
            baseline.policyVersion === null ? "—" : figure(baseline.policyVersion),
            count(baseline.records),
            verdictCounts(baseline.verdicts),
            badgeCounts(baseline.badges),
            problemsCell(
              baseline.problems.map(({ document, problem }) => DASHBOARD_TEXT.documentProblem(document, problem)),
            ),
          ]),
        ),
    h(2, L.lenses),
    p(DASHBOARD_TEXT.lens.indexIntro),
    ...problems(view.lensProblems),
    view.lenses.length === 0
      ? p(DASHBOARD_TEXT.lens.noLenses)
      : table(
          [C.lens, C.name, C.runCount, C.runDirectories],
          view.lenses.map((lens) => [
            link(lensHref(lens.key), lens.key),
            lens.name === null ? "—" : escapeHtml(lens.name),
            count(lens.runCount),
            lens.suites.map((suite) => link(runHref(suite), suite)).join(", "),
          ]),
        ),
    identifiers(
      view.policy === null
        ? []
        : [
            identifierTable([
              [L.identifierRows.limitsFileName, view.policy.name],
              [L.identifierRows.limitsFile, view.policy.hash],
            ]),
          ],
    ),
  ];
  return page(L.index, "/api/index", body);
}

function badgeCounts(counts: readonly { readonly badge: string; readonly count: number }[]): string {
  return counts.map(({ badge: b, count: n }) => `${count(n)} ${badge(b)}`).join("<br>") || MUTED_DASH;
}

// ── The run pages ────────────────────────────────────────────────────────────────────────────────────────────────

function supportTable(engines: readonly string[], rows: RunPartView["rows"]): string {
  return htmlTable(
    [escapeHtml(C.check), escapeHtml(C.request), ...engines.map(engine)],
    rows.map((row) => [
      check(row.rung),
      row.request === null ? "—" : escapeHtml(row.request),
      ...row.cells.map(
        (cell) =>
          `<span title="${escapeHtml(cell.status)}">${escapeHtml(statusText(cell.status))}</span>${cell.detail === undefined ? "" : ` <span class="muted">${escapeHtml(cell.detail)}</span>`}`,
      ),
    ]),
  );
}

function sectionsTable(name: string, sections: readonly SectionEntry[]): string {
  return table(
    [C.section, C.run, C.check, C.quantity, C.request, C.verdict],
    sections.map((section) => [
      link(sectionHref(name, section.section), count(section.section)),
      escapeHtml(section.run),
      check(section.rung),
      quantity(section.quantity),
      section.request === null ? "—" : escapeHtml(section.request),
      verdict(section.verdict),
    ]),
  );
}

/**
 * The pending jobs of a page, one row for the jobs that differ only in their request (which only Identifiers tell
 * apart), with how many requests the row is of; in the order of their first job.
 */
function pendingRows<J extends { readonly run: string; readonly rung: string; readonly engine: string }>(
  jobs: readonly (J & { readonly step: string | null; readonly suite?: string })[],
): { readonly job: J & { readonly step: string | null }; readonly requests: number }[] {
  const rows = new Map<string, { job: J & { readonly step: string | null }; requests: number }>();
  for (const job of jobs) {
    const key = JSON.stringify([job.suite ?? null, job.run, job.rung, job.engine, job.step]);
    const row = rows.get(key);
    if (row === undefined) rows.set(key, { job, requests: 1 });
    else row.requests++;
  }
  return [...rows.values()];
}

/** The pending jobs of a page: what is waiting, and under Identifiers the request each is of. */
function pendingIdentifiers(
  jobs: readonly { readonly run: string; readonly rung: string; readonly engine: string; readonly requestId: string }[],
): string {
  return table(
    [C.run, C.check, C.engine, C.request],
    jobs.map((job) => [escapeHtml(job.run), check(job.rung), engine(job.engine), code(job.requestId)]),
  );
}

/** The notice of a run directory written before a rename of ids: what its code says, and the old ids it names. */
function oldIdsNotice(oldIds: readonly string[]): string[] {
  const said = codeTextOf(LEGACY_RUN_CODE);
  if (oldIds.length === 0 || said === undefined) return [];
  return [
    p(DASHBOARD_TEXT.writtenBeforeRename(said.sentence, said.remedy), "problem"),
    `<ul>${oldIds.map((id) => `<li>${code(id)}</li>`).join("")}</ul>`,
  ];
}

/** A run page. */
export function renderRun(view: RunView): string {
  const body: string[] = [h(1, L.runOf(view.name)), ...problems(view.problems)];
  if (view.suite === null) {
    body.push(howToRead([DASHBOARD_TEXT.howTo.run]), p(DASHBOARD_TEXT.notReadable));
    return page(view.name, `/api${runHref(view.name)}`, body);
  }
  const compared = view.comparisons === "ok";
  body.push(
    howToRead([DASHBOARD_TEXT.howTo.run, DASHBOARD_TEXT.sources], [verdictLegend()]),
    ...(view.comparisons === "none" ? [p(DASHBOARD_TEXT.notCompared)] : []),
    ...(view.comparisons === "invalid" ? [p(DASHBOARD_TEXT.comparisonsUnreadable)] : []),
    ...oldIdsNotice(view.oldIds),
    ...(view.inputProblems.length === 0
      ? []
      : [
          p(DASHBOARD_TEXT.inputProblems, "problem"),
          `<ul>${view.inputProblems.map((problem) => `<li>${escapeHtml(problem)}</li>`).join("")}</ul>`,
        ]),
    h(2, L.engines),
    enginesTable(view.engines),
    h(2, L.runs),
    ...(view.split ? [p(DASHBOARD_TEXT.split)] : []),
    table(
      [C.run, C.lens, C.requests, C.sections, C.worstVerdict, C.problems],
      view.runs.map((run) => [
        view.split ? link(runPartHref(view.name, run.place), run.name) : escapeHtml(run.name),
        run.lens === null ? "—" : link(lensHref(run.lens), run.lens),
        count(run.requests),
        count(run.sectionCount),
        verdict(run.verdict),
        problemsCell(run.problems),
      ]),
    ),
  );
  if (compared) {
    body.push(
      h(2, L.verdicts),
      table(
        [C.pairing, C.pairsByVerdict],
        view.summary.map(({ mode, counts }) => [
          `<span title="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</span>`,
          verdictCounts(counts),
        ]),
      ),
      p(DASHBOARD_TEXT.failing(view.failing)),
      ...heatMapBlock(view.heatMap, view.name, "run"),
    );
  }
  const engineIds = view.supportByRung[0]?.engines.map(({ engine: id }) => id) ?? [];
  body.push(
    h(2, L.support),
    p(DASHBOARD_TEXT.supportByRung),
    htmlTable(
      [escapeHtml(C.check), ...engineIds.map(engine)],
      view.supportByRung.map((row) => [check(row.rung), ...row.engines.map(({ counts }) => statusCounts(counts))]),
    ),
  );
  if (!view.split) {
    body.push(
      p(DASHBOARD_TEXT.supportByRun),
      ...view.supportByRun.map(
        ({ run, rows }) => `<details><summary>${escapeHtml(run)}</summary>${supportTable(engineIds, rows)}</details>`,
      ),
      h(2, L.sections),
      view.sections.length === 0
        ? p(
            compared
              ? DASHBOARD_TEXT.noSections
              : view.comparisons === "none"
                ? DASHBOARD_TEXT.notCompared
                : DASHBOARD_TEXT.comparisonsUnreadable,
          )
        : [p(DASHBOARD_TEXT.sections), sectionsTable(view.name, view.sections)].join("\n"),
    );
  }
  body.push(
    h(2, L.pendingJobs),
    view.pending.length === 0
      ? p(DASHBOARD_TEXT.noPending)
      : [
          p(DASHBOARD_TEXT.pending),
          table(
            [C.run, C.check, C.engine, C.step, C.requests],
            pendingRows(view.pending).map(({ job, requests }) => [
              escapeHtml(job.run),
              check(job.rung),
              engine(job.engine),
              job.step === null ? "—" : escapeHtml(job.step),
              count(requests),
            ]),
          ),
        ].join("\n"),
    h(2, L.notCovered),
    `<ul>${NOT_COVERED.map((sentence) => `<li>${escapeHtml(sentence)}</li>`).join("")}</ul>`,
    identifiers([
      identifierTable([[L.identifierRows.suiteFile, view.suite.hash]]),
      engineIdentifiers(view.engines),
      table(
        [C.run, C.lensState],
        view.runs.map((run) => [escapeHtml(run.name), run.caseId === null ? "—" : code(run.caseId)]),
      ),
      ...(view.pending.length === 0 ? [] : [pendingIdentifiers(view.pending)]),
    ]),
  );
  return page(view.name, `/api${runHref(view.name)}`, body);
}

/** The page of one run of a suite whose run page is split. */
export function renderRunPart(view: RunPartView): string {
  const body = [
    h(1, L.runPart(view.run, view.name)),
    `<p>${link(runHref(view.name), L.runOf(view.name))}${view.lens === null ? "" : ` · ${link(lensHref(view.lens), L.lensOf(view.lens))}`}</p>`,
    howToRead([DASHBOARD_TEXT.howTo.runPart, DASHBOARD_TEXT.sources]),
    ...view.problems.map((problem) => p(problem, "problem")),
    h(2, L.support),
    p(DASHBOARD_TEXT.supportByRun),
    supportTable(view.engines, view.rows),
    h(2, L.sections),
    view.sections.length === 0
      ? p(DASHBOARD_TEXT.noSections)
      : [p(DASHBOARD_TEXT.sections), sectionsTable(view.name, view.sections)].join("\n"),
    identifiers(view.caseId === null ? [] : [identifierTable([[L.identifierRows.lensState, view.caseId]])]),
  ];
  return page(`${view.name}: ${view.run}`, `/api${runPartHref(view.name, view.place)}`, body);
}

// ── The section page ─────────────────────────────────────────────────────────────────────────────────────────────

function whereText(where: readonly WhereEntry[]): string {
  if (where.length === 0) return "";
  const said = where.map(
    ({ key, value }) =>
      `<span title="${escapeHtml(key)}">${escapeHtml(valueLabel(PLACE_TEXT, key))}</span> ${typeof value === "string" ? escapeHtml(value) : figure(value)}`,
  );
  return ` <span class="muted">${fill(L.at, [said.join(", ")])}</span>`;
}

function metric(value: MetricView | null, withName = false): string {
  if (value === null) return MUTED_DASH;
  const name = withName ? `${metricName(value.name)} ` : "";
  return `${name}${figure(value.value)}${whereText(value.where)}`;
}

/** A row's status in an MTF table: its label, with the stored value on hover. */
function rowStatus(status: string): string {
  return `<span title="${escapeHtml(status)}">${escapeHtml(rowStatusLabel(status))}</span>`;
}

function mtfTable(view: MtfView, name: string): string[] {
  const head = view.columns.map(
    (column) =>
      `${engine(column.engine)}${column.step === null ? "" : ` #${escapeHtml(column.step)}`}${column.judged ? " *" : ""}`,
  );
  const reason = view.pair.reason === null ? "" : ` <span class="muted">${escapeHtml(view.pair.reason)}</span>`;
  const out = [
    h(3, name),
    p(MTF_COMPARISON_INTROS[view.kind].join(" ")),
    ...(view.severalLines && view.kind !== "diffraction"
      ? [p((view.kind === "geometric" ? GEOMETRIC_SEVERAL_LINES : WAVEFRONT_SEVERAL_LINES).join(" "))]
      : []),
    `<p>${fill(DASHBOARD_TEXT.mtfPair, [engine(view.pair.a), engine(view.pair.b), verdict(view.pair.verdict)])}${reason}</p>`,
    `<p>${fill(DASHBOARD_TEXT.mtfBands, [figureOrDerived(view.bands.onAxis), figureOrDerived(view.bands.offAxis), figureOrDerived(view.bands.chiefLandingMm)])}</p>`,
    htmlTable(
      [
        escapeHtml(C.field),
        escapeHtml(C.angle),
        ...head.map((column) => fill(C.sampling, [column])),
        escapeHtml(C.chiefLanding),
        escapeHtml(C.rimRaysLost),
        escapeHtml(C.rimSpread),
        escapeHtml(C.class),
        escapeHtml(C.reason),
      ],
      view.fields.map((field) => [
        figure(field.field),
        figure(field.fieldAngleDeg),
        ...field.flags.map(
          (flag, column) =>
            `${flag === null ? "—" : escapeHtml(flag)}, ${figure(field.samplings[column]?.across ?? null)}, ${figure(field.samplings[column]?.lastChange ?? null)}`,
        ),
        figureOrDerived(field.chiefLandingMm),
        figureOrDerived(field.rimRaysLost),
        figureOrDerived(field.rimLandingSpreadMm),
        differenceClass(field.class),
        fieldReason(field.reason),
      ]),
    ),
    htmlTable(
      [
        escapeHtml(C.field),
        escapeHtml(C.cut),
        escapeHtml(C.frequency),
        ...head,
        escapeHtml(C.difference),
        escapeHtml(C.band),
        escapeHtml(C.status),
        escapeHtml(C.class),
      ],
      view.rows.map((row) => [
        figure(row.field),
        escapeHtml(row.cut),
        escapeHtml(row.frequency),
        ...row.values.map((value) => figure(value)),
        figureOrDerived(row.difference),
        figureOrDerived(row.band),
        rowStatus(row.status),
        differenceClass(row.class),
      ]),
    ),
    table(
      [C.status, C.meaning],
      Object.entries(ROW_STATUS_TEXT).map(([status, text]) => [rowStatus(status), escapeHtml(text.meaning)]),
    ),
    p(MTF_COMPARISON_OUTRO.join(" ")),
  ];
  view.peers.forEach((peer, index) => out.push(...mtfTable(peer, L.peer(name, String(index + 1)))));
  return out;
}

/** A section page. */
export function renderSection(view: SectionView): string {
  const title = L.sectionOf(view.name, String(view.section));
  const mode = view.mode === null ? L.noPolicyEntry : valueLabel(METHOD_TEXT, view.mode);
  const kind = view.class === null ? "—" : GLOSSARY_TEXT.kinds[CLASS_KIND[view.class]];
  const body: string[] = [
    `<h1>${escapeHtml(view.run)}, ${check(view.rung)}${view.request === null ? "" : `, ${escapeHtml(view.request)}`}</h1>`,
    `<p>${link(runHref(view.name), L.runOf(view.name))} · ${escapeHtml(L.quantity)} ${quantity(view.quantity)} · ${escapeHtml(mode)}, ${escapeHtml(kind)} · ${verdict(view.verdict)}</p>`,
    howToRead([DASHBOARD_TEXT.howTo.section, DASHBOARD_TEXT.sources, DASHBOARD_TEXT.derived], [verdictLegend()]),
    ...(view.inputProblems.length === 0
      ? []
      : [
          p(DASHBOARD_TEXT.inputProblems, "problem"),
          `<ul>${view.inputProblems.map((problem) => `<li>${escapeHtml(problem)}</li>`).join("")}</ul>`,
        ]),
    h(2, L.figures),
    p(DASHBOARD_TEXT.columns),
    table(
      [C.figure, C.unit, C.limit, C.kind, C.floorLimit],
      view.columns.map((column) => [
        metricName(column.name),
        column.unit === null ? "—" : escapeHtml(column.unit),
        figureOrDerived(column.limit),
        column.limitKind === null
          ? "—"
          : escapeHtml(
              column.limitKind === "attention" && SORTING_LIMITS.includes(column.name)
                ? SORTING_LIMIT_LABEL
                : valueLabel(LIMIT_KIND_TEXT, column.limitKind),
            ),
        figure(column.floorLimit),
      ]),
    ),
  ];
  if (view.referenceVsEach !== null) {
    body.push(
      h(2, L.referenceVsEach),
      `<p>${fill(DASHBOARD_TEXT.referenceVsEach, [engine(view.referenceVsEach.reference)])}</p>`,
      htmlTable(
        [
          escapeHtml(C.engine),
          ...view.columns.map((column) => metricName(column.name)),
          escapeHtml(C.verdict),
          escapeHtml(C.reason),
        ],
        view.referenceVsEach.rows.map((row) => [
          engine(row.engine),
          ...row.metrics.map((value) => metric(value)),
          verdict(row.verdict),
          row.reason === null ? "—" : escapeHtml(row.reason),
        ]),
      ),
    );
  }
  if (view.pairwise !== null) {
    const { engines, cells } = view.pairwise;
    body.push(
      h(2, L.pairwise),
      p(DASHBOARD_TEXT.pairwise),
      htmlTable(
        ["", ...engines.map(engine)],
        cells.map((row, index) => [
          engine(engines[index]),
          ...row.map((cell) => (cell === null ? "—" : `${verdict(cell.verdict)}<br>${metric(cell.worst, true)}`)),
        ]),
      ),
    );
  }
  if (view.consensus !== null) {
    body.push(h(2, L.consensus), p(CONSENSUS_SECTION.join(" ")), p(consensusSentence(view.consensus)));
  }
  if (view.recorded !== null) {
    body.push(
      h(2, L.recorded),
      p(DASHBOARD_TEXT.recorded),
      htmlTable(
        [escapeHtml(C.value), escapeHtml(C.element), ...view.recorded.engines.map(engine)],
        view.recorded.rows.map((row) => [code(row.name), count(row.element), ...row.cells.map((cell) => figure(cell))]),
      ),
    );
  }
  if (view.mtf !== null) body.push(h(2, L.mtf), p(DASHBOARD_TEXT.mtf), ...mtfTable(view.mtf, L.mtfTable));
  body.push(
    ...chartsBlock(view.charts, `${view.run}, ${checkName(view.rung)}`),
    identifiers([identifierTable([[L.identifierRows.request, view.requestId]])]),
  );
  return page(title, `/api${sectionHref(view.name, view.section)}`, body);
}

// ── The baseline pages ───────────────────────────────────────────────────────────────────────────────────────────

/** The head both baseline pages share: which baseline, the snapshot note and the bases. */
function baselineHead(view: BaselineView | BaselineRunView): string[] {
  if (view.suite === null || view.policy === null || view.bases === null) return [];
  const text = DASHBOARD_TEXT.staleness;
  const version = view.policy.version.value === null ? "?" : numberText(view.policy.version.value);
  return [
    `<p>${fill(DASHBOARD_TEXT.baselineHead, [
      escapeHtml(valueLabel(BASELINE_KIND_TEXT, view.baselineKind)),
      escapeHtml(view.suite.name),
      figure(view.policy.version),
    ])}</p>`,
    ...(view.snapshot ? [p(text.snapshot(version))] : []),
    ...basesText(view.bases).map((sentence) => p(sentence)),
  ];
}

/** The identifiers both baseline pages share: the suite file and the limits file the baseline records. */
function baselineIdentifiers(view: BaselineView | BaselineRunView): [string, string][] {
  if (view.suite === null || view.policy === null) return [];
  return [
    [L.identifierRows.suiteFile, view.suite.hash],
    [L.identifierRows.limitsFile, view.policy.hash],
  ];
}

/** A baseline page: inputs, engines, staleness summary and a row per run. */
export function renderBaseline(view: BaselineView): string {
  const text = DASHBOARD_TEXT.staleness;
  const body: string[] = [h(1, L.baselineOf(view.stem)), ...problems(view.problems), ...baselineHead(view)];
  if (view.suite === null) {
    body.push(howToRead([DASHBOARD_TEXT.howTo.baseline]));
    return page(view.stem, `/api${baselineHref(view.stem)}`, body);
  }
  body.push(
    howToRead(
      [DASHBOARD_TEXT.howTo.baseline, DASHBOARD_TEXT.sources, text.intro, text.badges, text.check],
      [verdictLegend()],
    ),
    h(2, L.upToDate),
    table(
      [C.badge, C.records],
      view.summary.badges.map(({ badge: b, count: n }) => [badge(b), count(n)]),
    ),
    table(
      [C.reason, C.staleBy, C.notKnownBy],
      view.summary.stale.map(({ reason, count: n }, index) => [
        `<span title="${escapeHtml(reason)}">${escapeHtml(reasonsText([reason]))}</span>`,
        count(n),
        count(view.summary.notKnown[index]?.count ?? 0),
      ]),
    ),
    h(2, L.engines),
    table(
      [C.engine, C.inBaseline, C.now],
      view.engines.map((each) => [engine(each.id), escapeHtml(each.version), engineText(each.now)]),
    ),
    ...heatMapBlock(view.heatMap, view.stem, "baseline"),
    h(2, L.runs),
    p(DASHBOARD_TEXT.baselineRuns),
    htmlTable(
      [escapeHtml(C.run), escapeHtml(C.records), ...view.rungs.map(check), escapeHtml(C.recordsByBadge)],
      view.runs.map((run) => [
        link(baselineRunHref(view.stem, run.place), run.name),
        count(run.records),
        ...run.verdicts.map((each) => (each === null ? MUTED_DASH : shortVerdict(each, true))),
        badgeCounts(run.badges),
      ]),
    ),
    identifiers([
      identifierTable(baselineIdentifiers(view)),
      table(
        [C.engine, C.engineCode, C.toolCode, C.engineCodeNow, C.toolCodeNow],
        view.engines.map((each) => {
          const now = each.now;
          return [
            engine(each.id),
            code(each.fingerprint),
            each.adapterRevision === null ? MUTED_DASH : code(each.adapterRevision),
            now === null || now.status === "unavailable" ? MUTED_DASH : code(now.fingerprint),
            now === null || now.status === "unavailable" || now.adapterRevision === null
              ? MUTED_DASH
              : code(now.adapterRevision),
          ];
        }),
      ),
    ]),
  );
  return page(view.stem, `/api${baselineHref(view.stem)}`, body);
}

function pairRow(rung: BaselineRunView["rungs"][number], pair: BaselinePairView): string[] {
  return [
    check(rung.rung),
    figure(rung.requests),
    `${engine(pair.a)} – ${engine(pair.b)}`,
    verdict(pair.verdict),
    pair.verdicts.map(({ verdict: v, requests }) => `${figure(requests)} ${shortVerdict(v)}`).join(", "),
    pair.metrics
      .map(
        (each) =>
          `${metricName(each.name)} ${figure(each.value)}${each.unit === "1" ? "" : ` ${escapeHtml(each.unit)}`}${each.tolerance === null ? "" : ` (≤ ${figure(each.tolerance)})`}${each.measured === null ? "" : ` ${fill(L.measured, [figure(each.measured)])}`}${whereText(each.where)}`,
      )
      .join("<br>") || "—",
    pair.failures
      .map((failure) => `${metricName(failure.metric)}: ${differenceClass(failure.class)} ${code(failure.gotcha)}`)
      .join("<br>") || "—",
    badge(pair.badge),
  ];
}

/** The page of one run of a baseline: its records with their figures and badges. */
export function renderBaselineRun(view: BaselineRunView): string {
  const text = DASHBOARD_TEXT.staleness;
  const caseNow =
    view.caseNow === null
      ? ""
      : !view.caseNow.found
        ? text.caseUnknown
        : view.caseNow.caseId === null
          ? text.caseRefused
          : view.caseNow.caseId === view.caseId
            ? text.caseSame
            : text.caseMoved;
  const moved =
    view.caseNow !== null && view.caseNow.found && view.caseNow.caseId !== null && view.caseNow.caseId !== view.caseId
      ? view.caseNow.caseId
      : null;
  const body = [
    h(1, L.baselineRun(view.name, view.stem)),
    `<p>${link(baselineHref(view.stem), L.baselineOf(view.stem))}${caseNow === "" ? "" : ` · ${escapeHtml(caseNow)}`}</p>`,
    ...problems(view.problems),
    ...view.runProblems.map((problem) => p(problem, "problem")),
    ...baselineHead(view),
    howToRead([DASHBOARD_TEXT.howTo.baselineRun, DASHBOARD_TEXT.sources, text.badges], [verdictLegend()]),
    htmlTable(
      [C.check, C.requests, C.pair, C.verdict, C.requestsByVerdict, C.figures, C.classified, C.badge].map(escapeHtml),
      view.rungs.flatMap((rung) => rung.pairs.map((pair) => pairRow(rung, pair))),
    ),
    identifiers([
      identifierTable([
        ...baselineIdentifiers(view),
        ...(view.caseId === null ? [] : [[L.identifierRows.lensState, view.caseId] as [string, string]]),
        ...(moved === null ? [] : [[text.caseMoved, moved] as [string, string]]),
      ]),
    ]),
  ];
  return page(`${view.stem}: ${view.name}`, `/api${baselineRunHref(view.stem, view.place)}`, body);
}

/** The page of a path the dashboard has nothing at, or of a request it refuses. */
export function renderRefusal(status: number, what: string): string {
  return page(`${status}`, "/api/index", [h(1, `${status} ${what}`), `<p>${link("/", L.index)}</p>`]);
}

// ── The help and checks pages ────────────────────────────────────────────────────────────────────────────────────

/** A table of labels, each with the value the files store and its meaning. */
function labelTable(entries: readonly { readonly stored: string; readonly label: string; readonly meaning: string }[]) {
  return table(
    [C.label, C.stored, C.meaning],
    entries.map((each) => [escapeHtml(each.label), code(each.stored), escapeHtml(each.meaning)]),
  );
}

/** The help page: the glossary's terms, the verdicts, outcomes, badges and classes, and the engines. */
export function renderHelp(view: HelpView): string {
  const text = DASHBOARD_TEXT.help;
  const body = [
    h(1, L.help),
    p(text.intro),
    howToRead([DASHBOARD_TEXT.howTo.help]),
    `<p>${escapeHtml(text.checksLink)} ${link("/checks", L.checks)}</p>`,
    h(2, GLOSSARY_TEXT.terms),
    table(
      [C.term, C.meaning],
      view.terms.map((term) => [escapeHtml(term.term), escapeHtml(term.definition)]),
    ),
    h(2, GLOSSARY_TEXT.verdicts),
    p(GLOSSARY_TEXT.verdictsIntro),
    table(
      [C.label, C.stored, C.meaning],
      view.verdicts.map((each) => [
        shortVerdictLabel(each.stored as Verdict, each.label),
        code(each.stored),
        escapeHtml(each.meaning),
      ]),
    ),
    h(2, text.badges),
    p(text.badgesIntro),
    labelTable(view.badges),
    h(3, text.reasons),
    labelTable(view.reasons),
    h(2, text.outcomes),
    p(text.outcomesIntro),
    labelTable(view.outcomes),
    h(2, GLOSSARY_TEXT.classes),
    p(GLOSSARY_TEXT.classesIntro),
    labelTable(view.classes),
    h(3, text.statuses),
    labelTable(view.statuses),
    h(2, GLOSSARY_TEXT.engines),
    p(GLOSSARY_TEXT.enginesIntro),
    table(
      [C.engine, C.id, C.oldId, C.whatItIs],
      view.engines.map((each) => [
        escapeHtml(each.name),
        code(each.id),
        code(each.oldId),
        escapeHtml(each.description),
      ]),
    ),
  ];
  return page(L.help, "/api/help", body);
}

/** What one figure of a check is held to, in words: its limit, its review band, its sorting limit or no band. */
function limitText(limit: ChecksView["checks"][number]["limits"][number]): string {
  const t = CHECKS_COMMAND_TEXT;
  const unit = limit.unit === "1" ? "" : limit.unit === "percent" ? " %" : ` ${escapeHtml(limit.unit)}`;
  if (limit.tolerance !== null) return `${escapeHtml(t.limit)} ${figure(limit.tolerance)}${unit}`;
  if (limit.band === null) return escapeHtml(t.noBand);
  const several =
    limit.bandSeveralLines === null ? "" : `, ${figure(limit.bandSeveralLines)}${unit} ${escapeHtml(t.bandSeveral)}`;
  return `${escapeHtml(limit.sorting ? t.sorting : t.band)} ${figure(limit.band)}${unit}${several}`;
}

/** The checks page: every check, what it compares, shows and does not show, its engines and its limits. */
export function renderChecks(view: ChecksView): string {
  const text = DASHBOARD_TEXT.checksPage;
  const body = [
    h(1, L.checks),
    p(CHECKS_COMMAND_TEXT.intro),
    howToRead([DASHBOARD_TEXT.howTo.checks]),
    view.limitsFile === null
      ? p(text.noLimitsFile, "problem")
      : `<p>${fill(text.limitsFile, [figure(view.limitsFile)])}</p>`,
  ];
  for (const each of view.checks) {
    body.push(
      `<h2>${escapeHtml(each.title)} ${code(each.id)}</h2>`,
      table(
        [C.name, C.value],
        [
          [escapeHtml(C.kind), escapeHtml(GLOSSARY_TEXT.kinds[each.kind])],
          [escapeHtml(C.compares), escapeHtml(`${each.compares}.`)],
          [escapeHtml(C.shows), escapeHtml(each.shows)],
          [escapeHtml(C.doesNotShow), escapeHtml(each.doesNotShow)],
          [
            escapeHtml(C.engines),
            each.engines === null
              ? escapeHtml(CHECKS_COMMAND_TEXT.enginesOfSuite)
              : `${each.engines.map(engine).join(", ")}; ${escapeHtml(CHECKS_COMMAND_TEXT.enginesOwn)}`,
          ],
          [
            escapeHtml(C.runsWhen),
            escapeHtml(each.onlyWhereNamed ? CHECKS_COMMAND_TEXT.runsNamed : CHECKS_COMMAND_TEXT.runsAlways),
          ],
          [escapeHtml(C.oldId), code(each.oldId)],
        ],
      ),
      each.limits.length === 0
        ? p(text.noLimits, "muted")
        : table(
            [C.figure, C.limit],
            each.limits.map((limit) => [metricName(limit.metric), limitText(limit)]),
          ),
    );
  }
  return page(L.checks, "/api/checks", body);
}

// ── Run control ──────────────────────────────────────────────────────────────────────────────────────────────────

const jobHref = (job: number): string => `/control/job/${job}`;

/** A form of an action: POST to its route, with the server's token, its fields and a button. */
function form(action: string, token: string, fields: readonly string[], button: string): string {
  return [
    `<form method="post" action="/control/${escapeHtml(action)}">`,
    `<input type="hidden" name="token" value="${escapeHtml(token)}">`,
    ...fields,
    `<button type="submit">${escapeHtml(button)}</button>`,
    "</form>",
  ].join("\n");
}

/** What became of a step, in words. */
function stepState(step: {
  readonly state: StepView["state"];
  readonly exitCode: number | null;
  readonly signal?: string | null;
}): string {
  const text = DASHBOARD_TEXT.control;
  switch (step.state) {
    case "queued":
      return text.stateQueued;
    case "running":
      return text.stateRunning;
    case "exited":
      return text.stateExited(step.exitCode === null ? "none" : count(step.exitCode));
    case "killed":
      return text.stateKilled(step.signal ?? "a signal");
    case "not-started":
      return text.stateNotStarted;
    case "not-run":
      return text.stateNotRun;
    case "closed":
      return text.stateClosed;
  }
}

/** The control page: start a suite, collect, ask the engines again, the jobs, the pending jobs, the exchange. */
export function renderControl(view: ControlView, token: string): string {
  const text = DASHBOARD_TEXT.control;
  const busy =
    view.busy === null
      ? p(text.idle)
      : view.busy.reason === "job"
        ? `<p>${fill(text.busyJob, [link(jobHref(view.busy.job), count(view.busy.job))])}</p>`
        : p(text.busyAsking);
  const labels = L.control;
  const body: string[] = [
    h(1, L.runControl),
    p(text.intro),
    howToRead([DASHBOARD_TEXT.howTo.control]),
    p(text.heavy, "problem"),
    p(text.noMaintenance),
    busy,
  ];

  body.push(h(2, labels.startSuite), p(text.startHow), p(text.startFields(String(CONTROL_MAX_JOBS))));
  if (!view.configured) body.push(p(text.notConfigured));
  else if (view.suites.length === 0) body.push(p(text.noSuites));
  else {
    const options = view.suites.map((name) => {
      const label = view.ownerOnly.includes(name) ? text.ownerOnlyOption(name) : name;
      return `<option value="${escapeHtml(name)}">${escapeHtml(label)}</option>`;
    });
    body.push(
      form(
        "start",
        token,
        [
          `<label>${escapeHtml(labels.suite)} <select name="suite">${options.join("")}</select></label>`,
          `<label>${escapeHtml(labels.enginesField)} <input type="text" name="engines" size="40"></label>`,
          `<label>${escapeHtml(labels.checksField)} <input type="text" name="rungs" size="40"></label>`,
          `<label>${escapeHtml(labels.jobsField)} <input type="number" name="jobs" min="1" max="${CONTROL_MAX_JOBS}" value="1"></label>`,
        ],
        labels.start,
      ),
    );
  }
  body.push(
    ...view.ownerOnly.map((name) => p(text.ownerOnlySuite(name), "problem")),
    p(text.enginesKnown(view.engines.join(", ") || "none")),
    p(text.rungsKnown(view.rungs.join(", "))),
  );

  body.push(h(2, labels.runOneLens), p(text.lensHow), p(DASHBOARD_TEXT.lens.runHeavy, "problem"));
  body.push(
    view.configured
      ? [
          lensForm(token, null, view.lensEngines, view.apertures, view.lensRuns),
          p(
            text.lensFields(
              view.lensEngines.join(", "),
              view.apertures.join(", "),
              view.lensRuns.join(", "),
              String(CONTROL_MAX_JOBS),
            ),
          ),
        ].join("\n")
      : p(text.notConfigured),
  );

  body.push(
    h(2, labels.collect),
    p(text.collectHow),
    view.configured ? form("collect", token, [], labels.collectButton) : p(text.notConfigured),
  );

  const store = DASHBOARD_TEXT.store;
  body.push(
    h(2, labels.maintenance),
    p(store.intro),
    p(store.writers, "problem"),
    p(store.pruneRule, "problem"),
    p(store.compressRule),
    p(store.temporary),
    view.configured
      ? [form("plan-prune", token, [], labels.planPrune), form("plan-compress", token, [], labels.planCompress)].join(
          "\n",
        )
      : p(text.notConfigured),
  );

  body.push(
    h(2, labels.engines),
    p(askedText({ state: view.asked.state as IndexView["engines"]["state"], problem: view.asked.problem })),
  );
  body.push(view.canAsk ? [p(text.askHow), form("ask", token, [], labels.ask)].join("\n") : p(text.cannotAsk));

  body.push(h(2, labels.jobs), p(text.jobsKept));
  body.push(
    view.jobs.length === 0
      ? p(text.noJobs)
      : table(
          [C.job, C.kind, C.suite, C.steps],
          [...view.jobs]
            .reverse()
            .map((job) => [
              link(jobHref(job.job), count(job.job)),
              escapeHtml(jobKindText(job)),
              `${job.suite === null ? "—" : escapeHtml(job.suite)}${job.lens === null ? "" : ` (${link(lensHref(job.lens), job.lens)})`}`,
              job.steps.map((step) => `${stepName(step.name)}: ${escapeHtml(stepState(step))}`).join("<br>"),
            ]),
        ),
  );

  body.push(h(2, labels.pendingJobs));
  body.push(
    view.pending.length === 0
      ? p(text.noPending)
      : [
          p(text.pending),
          table(
            [C.suite, C.run, C.check, C.engine, C.step, C.requests],
            pendingRows(view.pending).map(({ job, requests }) => [
              link(runHref(job.suite), job.suite),
              escapeHtml(job.run),
              check(job.rung),
              engine(job.engine),
              job.step === null ? "—" : escapeHtml(job.step),
              count(requests),
            ]),
          ),
        ].join("\n"),
  );

  body.push(h(2, labels.exchange));
  if (!view.configured) body.push(p(text.notConfigured));
  else if (view.exchange.length === 0) body.push(p(text.noExchange));
  else {
    const folders = view.exchange[0].folders.map(({ folder }) => folder);
    body.push(
      p(text.exchange),
      htmlTable(
        [escapeHtml(C.engine), ...folders.map(escapeHtml)],
        view.exchange.map((each) => [engine(each.engine), ...each.folders.map((folder) => count(folder.count))]),
      ),
      ...view.exchange.map((each) => p(text.operator(each.engine))),
    );
  }
  body.push(
    identifiers(
      view.pending.length === 0
        ? []
        : [
            table(
              [C.suite, C.run, C.check, C.engine, C.request],
              view.pending.map((job) => [
                escapeHtml(job.suite),
                escapeHtml(job.run),
                check(job.rung),
                engine(job.engine),
                code(job.requestId),
              ]),
            ),
          ],
    ),
  );
  return page(L.runControl, "/api/control", body);
}

/** A step's name in words, with its name as run control keeps it on hover. */
function stepName(name: string): string {
  const steps = L.control.steps;
  const said = Object.hasOwn(steps, name) ? steps[name as keyof typeof steps] : name;
  return `<span title="${escapeHtml(name)}">${escapeHtml(said)}</span>`;
}

/** A job's kind, as the jobs table names it. */
function jobKindText(job: Pick<JobEntry, "jobKind" | "store">): string {
  const labels = L.control;
  if (job.store !== null) {
    return job.store.mode === "plan" ? labels.kindPlan(job.store.action) : labels.kindConfirmed(job.store.action);
  }
  return job.jobKind === "suite" ? labels.kindStart : job.jobKind === "lens" ? labels.kindLens : labels.kindCollect;
}

/** Bytes as a whole number of them and in GiB. */
function bytesText(bytes: number): string {
  return L.control.bytes(count(bytes), formatFixed(bytes / 2 ** 30, 3));
}

/** A store job's report: the prune's notice, its tables, its state, and from a plan the form that confirms it. */
function storeBlock(view: StoreJobView, job: number, token: string | null): string[] {
  const store = DASHBOARD_TEXT.store;
  const labels = L.control;
  const out: string[] = [h(2, view.mode === "plan" ? labels.planOf(view.action) : labels.storeAction(view.action))];
  if (view.action === "prune") out.push(p(store.pruneRule, "problem"));
  else out.push(p(store.compressRule));
  out.push(p(store.writers, "problem"), p(store.temporary));
  if (view.problem !== null) {
    out.push(p(view.problem, "problem"));
    return out;
  }
  if (view.state === null) return out;
  if (view.prune !== null) {
    const report = view.prune;
    // The notice as the command states it, with every prune: shown first and plainly.
    out.push(`<p class="problem"><strong>${escapeHtml(report.notice)}</strong></p>`, p(store.pruneReport));
    out.push(
      table(
        [C.engine, C.keptFiles, C.keptBytes, C.removableFiles, C.removableBytes],
        report.engines.map((each) => [
          engine(each.engine),
          count(each.kept.files),
          bytesText(each.kept.bytes),
          count(each.removable.files),
          bytesText(each.removable.bytes),
        ]),
      ),
      table(
        [C.removableEngine, C.engineVersion, C.files, C.bytes, C.newestEntry],
        report.removable.map((each) => [
          engine(each.engine),
          `<code title="${escapeHtml(`${each.fingerprint} / ${each.adapterRevision ?? "—"}`)}">${escapeHtml(`${each.fingerprint.slice(0, 8)}/${(each.adapterRevision ?? "—").slice(0, 8)}`)}</code>`,
          count(each.files),
          bytesText(each.bytes),
          escapeHtml(each.newestEntry),
        ]),
      ),
      p(store.protectedCount(count(report.protectedEngines.count))),
    );
    if (report.problems.length > 0) {
      out.push(
        `<details><summary>${escapeHtml(store.problemsCount(count(report.problems.length)))}</summary><pre>${escapeHtml(report.problems.join("\n"))}</pre></details>`,
      );
    }
    if (view.dryRun === false) out.push(p(store.deleted(count(report.deleted.count))));
  }
  if (view.compress !== null) {
    const report = view.compress;
    out.push(
      p(store.compressReport),
      table(
        [C.plainEntries, C.gzipEntries, C.bytesBefore, C.bytesAfter],
        [
          [
            count(report.plain.files),
            count(report.compressed.files),
            bytesText(report.before.bytes),
            bytesText(report.after.bytes),
          ],
        ],
      ),
    );
    if (view.dryRun === false) out.push(p(store.compressed(count(report.changed.count))));
  }
  out.push(p(store.state));
  if (view.dryRun === true) out.push(p(store.dryRun));
  if (view.mode === "plan") {
    if (view.confirmable && token !== null) {
      out.push(
        p(view.action === "prune" ? store.confirmPrune : store.confirmCompress),
        form(
          view.action,
          token,
          [
            `<input type="hidden" name="plan" value="${escapeHtml(String(job))}">`,
            `<input type="hidden" name="state" value="${escapeHtml(view.state)}">`,
          ],
          view.action === "prune" ? labels.prune : labels.compress,
        ),
      );
    } else out.push(p(store.notConfirmable));
  }
  out.push(
    identifiers([
      identifierTable([[L.identifierRows.storeState, view.state]]),
      ...(view.prune === null || view.prune.removable.length === 0
        ? []
        : [
            table(
              [C.removableEngine, C.engineCode, C.toolCode],
              view.prune.removable.map((each) => [
                engine(each.engine),
                code(each.fingerprint),
                each.adapterRevision === null ? MUTED_DASH : code(each.adapterRevision),
              ]),
            ),
          ]),
    ]),
  );
  return out;
}

/**
 * The page of one job: each step's command line, state and output, a collect's outcome, a lens's catalog and a store
 * job's report. A plan of store maintenance carries the form that confirms it, with `token`.
 */
export function renderJob(view: JobView, token: string | null = null): string {
  const text = DASHBOARD_TEXT.control;
  const labels = L.control;
  const what =
    view.jobKind === "suite"
      ? labels.startOf(view.suite ?? labels.aSuite)
      : view.jobKind === "lens"
        ? labels.runOfLens(view.lens ?? "")
        : view.jobKind === "store"
          ? jobKindText(view)
          : labels.kindCollect;
  const body: string[] = [
    h(1, labels.job(count(view.job), what)),
    `<p>${link("/control", L.runControl)}${view.suite === null ? "" : ` · ${link(runHref(view.suite), L.runOf(view.suite))}`}${view.lens === null ? "" : ` · ${link(lensHref(view.lens), L.lensOf(view.lens))}`}</p>`,
    howToRead([DASHBOARD_TEXT.howTo.job]),
    p(view.running ? text.jobRunning : text.jobEnded),
    // A store job's report first: the prune's notice, and from a plan the form that confirms it.
    ...(view.store === null ? [] : storeBlock(view.store, view.job, token)),
    p(text.output),
  ];
  for (const step of view.steps) {
    const steps = labels.steps;
    body.push(
      h(2, Object.hasOwn(steps, step.name) ? steps[step.name as keyof typeof steps] : step.name),
      `<p>${code(step.command)}</p>`,
      p(stepState(step)),
      ...(step.name === "catalog" ? [p(text.catalogQuiet)] : []),
      ...(step.name === "catalog" && view.catalog !== null
        ? [p(view.catalog.said, view.catalog.found === true ? undefined : "problem")]
        : []),
      ...(step.truncated ? [p(text.truncated)] : []),
      step.output === "" ? p(text.noOutput, "muted") : `<pre>${escapeHtml(step.output)}</pre>`,
    );
  }
  if (view.collect !== null) {
    body.push(h(2, labels.collected), p(text.collected));
    if (view.collect.problem !== null) body.push(p(view.collect.problem, "problem"));
    else if (view.collect.engines.length === 0) body.push(p(text.collectNothing));
    else {
      body.push(
        table(
          [C.engine, C.collected, C.rejected, C.stillPending],
          view.collect.engines.map((each) => [
            engine(each.engine),
            count(each.collected.count),
            count(each.rejected.count),
            count(each.pending.count),
          ]),
        ),
      );
      for (const each of view.collect.engines) {
        if (each.unavailable !== null)
          body.push(
            `<p class="problem">${fill(text.collectUnavailable, [engine(each.engine), code(each.unavailable)])}</p>`,
          );
        if (each.rejected.jobs.length > 0) {
          body.push(
            table(
              [C.engine, C.rejectedJob, C.reason],
              // The reason is lvrtc collect's own words, shown as it said them: none of the dashboard's sentences.
              each.rejected.jobs.map(({ job, reason }) => [engine(each.engine), code(job), code(reason)]),
            ),
          );
        }
      }
    }
  }
  return page(labels.jobTitle(count(view.job)), `/api${jobHref(view.job)}`, body, view.running);
}

/** The page of an action that was refused: its status and the sentence that says why. */
export function renderActionRefusal(status: number, reason: string): string {
  return page(`${status}`, "/api/control", [
    h(1, `${status} ${DASHBOARD_TEXT.control.refusedTitle}`),
    p(reason),
    `<p>${link("/control", L.runControl)}</p>`,
  ]);
}

// ── The lens page ────────────────────────────────────────────────────────────────────────────────────────────────

/** The form that runs one lens: POST to run control with the server's token; the key fixed where a lens page has it. */
function lensForm(
  token: string,
  lens: string | null,
  engines: readonly string[],
  apertures: readonly string[],
  runs: readonly string[],
  chosenRun: string | null = null,
): string {
  const labels = L.control;
  const options = [
    `<option value="">${escapeHtml(labels.both)}</option>`,
    ...apertures.map((each) => `<option value="${escapeHtml(each)}">${escapeHtml(each)}</option>`),
  ];
  // The first profile is what an empty field runs (benchmark); the others are named.
  const runOptions = runs.map((each, index) => {
    const selected = each === chosenRun ? " selected" : "";
    return `<option value="${index === 0 ? "" : escapeHtml(each)}"${selected}>${escapeHtml(each)}</option>`;
  });
  return form(
    "lens",
    token,
    [
      lens === null
        ? `<label>${escapeHtml(labels.lensKey)} <input type="text" name="lens" size="40"></label>`
        : `<input type="hidden" name="lens" value="${escapeHtml(lens)}">`,
      `<label>${escapeHtml(labels.enginesField)} <input type="text" name="engines" size="24" placeholder="${escapeHtml(engines.join(","))}"></label>`,
      `<label>${escapeHtml(labels.profile)} <select name="profile">${runOptions.join("")}</select></label>`,
      `<label>${escapeHtml(labels.aperture)} <select name="aperture">${options.join("")}</select></label>`,
      `<label>${escapeHtml(labels.jobsField)} <input type="number" name="jobs" min="1" max="${CONTROL_MAX_JOBS}" value="1"></label>`,
    ],
    labels.runLens,
  );
}

/** A lens page's address with a choice: the options it has chosen, and a reference. */
function lensQuery(view: LensView, reference: string | null): string {
  const params = new URLSearchParams();
  for (const [name, options] of [
    ["run", view.picker.runs],
    ["rung", view.picker.rungs],
    ["engine", view.picker.engines],
    ["field", view.picker.fields],
    ["cut", view.picker.cuts],
  ] as const) {
    for (const option of options) if (option.chosen) params.append(name, option.id);
  }
  if (reference !== null) params.append("ref", reference);
  return params.toString();
}

/** A kind of image plane in words: the design plane, LensVisualizer's best axial focus, or another kind by its name. */
function planeKind(kind: string): string {
  const text = DASHBOARD_TEXT.compare;
  const said =
    kind === "design" ? text.chipDesign : kind === "lv-best-axial" ? text.chipBestAxial : text.chipPlaneKind(kind);
  return `<span title="${escapeHtml(kind)}">${escapeHtml(said)}</span>`;
}

/** The condition of a run as table cells: zoom, focus, stop, object, image plane, lines. */
function conditionCells(condition: LensCondition | null): string[] {
  if (condition === null) return ["—", "—", "—", "—", "—", "—"];
  const plane =
    condition.plane === null
      ? `${plainFigure(condition.imageZ)} <span class="muted">(${escapeHtml(DASHBOARD_TEXT.lens.planeNotRecorded)})</span>`
      : `${plainFigure(condition.imageZ)} <span class="muted">(${planeKind(condition.plane.kind)}${condition.plane.shiftMm === null ? "" : fill(L.lens.shifted, [plainFigure(condition.plane.shiftMm)])})</span>`;
  return [
    plainFigure(condition.zoomT),
    plainFigure(condition.focusT),
    plainFigure(condition.stopSemiDiameterMm),
    condition.object.kind === "infinity"
      ? escapeHtml(DASHBOARD_TEXT.lens.objectInfinity)
      : fill(L.lens.objectAt, [plainFigure(condition.object.z)]),
    plane,
    condition.lines.map((line) => `${plainFigure(line.wavelengthNm)} nm × ${plainFigure(line.weight)}`).join("<br>"),
  ];
}

/** A content hash shortened to its first 12 digits, the whole of it on hover. */
function shortId(id: string): string {
  return `<code title="${escapeHtml(id)}">${escapeHtml(id.slice(0, 12))}</code>`;
}

function checkbox(name: string, value: string, label: string, chosen: boolean): string {
  return `<label><input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}"${chosen ? " checked" : ""}> ${label}</label>`;
}

/** A curve's row in the list of curves, with a link that makes it the reference. */
function curveRow(view: LensView, curve: LensCurveView): string[] {
  const text = DASHBOARD_TEXT.lens;
  return [
    count(curve.curve),
    link(runHref(curve.suite), curve.suite),
    escapeHtml(curve.runName),
    check(curve.rung),
    escapeHtml(curveEngine(curve)),
    plainFigure(curve.field),
    escapeHtml(curve.cut),
    escapeHtml(curve.state === "ok" ? "ok" : `${curve.state}${curve.reason === null ? "" : `: ${curve.reason}`}`),
    curve.reference
      ? escapeHtml(text.isReference)
      : link(`${lensHref(view.key)}?${lensQuery(view, curve.id)}`, text.useAsReference),
  ];
}

/** A lens page: its runs and their conditions, the picker, the curves chosen, the differences, and running the lens. */
export function renderLens(
  view: LensView,
  run: { readonly token: string; readonly configured: boolean } | null,
): string {
  const text = DASHBOARD_TEXT.lens;
  const labels = L.lens;
  const query = lensQuery(view, view.curves.find((curve) => curve.reference)?.id ?? null);
  const body: string[] = [
    h(1, view.name === null ? L.lensOf(view.key) : L.lensNamed(view.key, view.name)),
    `<p>${escapeHtml(text.compareLink)} ${link(compareHref(view.key, null, ""), DASHBOARD_TEXT.compare.title(view.key))}</p>`,
    p(text.intro),
    howToRead([DASHBOARD_TEXT.howTo.lens, text.lensOfRun, DASHBOARD_TEXT.sources, DASHBOARD_TEXT.derived]),
    ...view.problems.map((problem) => p(problem, "problem")),
    h(2, labels.runs),
  ];
  if (view.runs.length === 0) body.push(p(text.noRuns));
  else {
    body.push(
      p(text.quickIntro),
      table(
        [
          C.runDirectory,
          C.run,
          C.zoom,
          C.focus,
          C.stop,
          C.object,
          C.imagePlane,
          C.wavelengths,
          C.compared,
          C.mtfRequests,
        ],
        view.runs.map((each) => [
          `${link(runHref(each.suite), each.suite)}${each.problems.length === 0 ? "" : `<br>${problemsCell(each.problems)}`}`,
          escapeHtml(each.run),
          ...conditionCells(each.condition),
          each.comparisons === "ok" ? escapeHtml(L.yes) : each.comparisons === "none" ? escapeHtml(L.no) : MUTED_DASH,
          each.requests.length === 0
            ? `<span class="muted">${escapeHtml(text.noMtf)}</span>`
            : each.requests
                .map((request) =>
                  request.quick === null
                    ? escapeHtml(checkName(request.rung))
                    : link(`${lensHref(view.key)}?${request.quick}`, checkName(request.rung)),
                )
                .join(", "),
        ]),
      ),
      identifiers([
        table(
          [C.runDirectory, C.run, C.lensState],
          view.runs.map((each) => [escapeHtml(each.suite), escapeHtml(each.run), shortId(each.caseId)]),
        ),
      ]),
    );
  }

  body.push(h(2, labels.choose), p(text.pickerIntro), p(text.pickerHow));
  const { picker } = view;
  const group = (legend: string, boxes: readonly string[]): string =>
    `<fieldset><legend>${escapeHtml(legend)}</legend>${boxes.join(" ") || '<span class="muted">—</span>'}</fieldset>`;
  const references = [
    `<option value="">${escapeHtml(labels.noReference)}</option>`,
    ...view.curves.map(
      (curve) =>
        `<option value="${escapeHtml(curve.id)}"${curve.reference ? " selected" : ""}>${escapeHtml(DASHBOARD_TEXT.lens.legendCurve(count(curve.curve), curveName(curve)))}</option>`,
    ),
  ];
  body.push(
    [
      `<form method="get" action="${escapeHtml(lensHref(view.key))}">`,
      group(
        labels.runs,
        picker.runs.map((option) => checkbox("run", option.id, escapeHtml(option.label), option.chosen)),
      ),
      group(
        labels.checks,
        picker.rungs.map((option) => checkbox("rung", option.id, check(option.label), option.chosen)),
      ),
      group(
        labels.engines,
        picker.engines.map((option) => checkbox("engine", option.id, escapeHtml(option.label), option.chosen)),
      ),
      group(
        labels.fields,
        picker.fields.map((option) =>
          checkbox("field", option.id, `${escapeHtml(option.kind)} ${plainFigure(option.field)}`, option.chosen),
        ),
      ),
      group(
        labels.cuts,
        picker.cuts.map((option) => checkbox("cut", option.id, escapeHtml(option.label), option.chosen)),
      ),
      `<label>${escapeHtml(labels.reference)} <select name="ref">${references.join("")}</select></label>`,
      `<button type="submit">${escapeHtml(labels.draw)}</button>`,
      "</form>",
    ].join("\n"),
    ...view.notes.map((note) => p(note, "problem")),
  );

  if (view.curves.length > 0) {
    body.push(
      h(2, labels.curves),
      p(text.overlayIntro),
      chartFigure(renderLensOverlay(view.key, view.curves), ""),
      p(text.curves),
      table(
        [C.curve, C.runDirectory, C.run, C.check, C.engine, C.field, C.cut, C.state, C.reference],
        view.curves.map((curve) => curveRow(view, curve)),
      ),
    );
  }
  if (view.noAnswers.length > 0) {
    body.push(
      p(text.noAnswers),
      `<ul>${view.noAnswers.map((each) => `<li>${escapeHtml(`${each.suite}: ${each.runName}, ${each.rung}: `)}${escapeHtml(each.reason)}</li>`).join("")}</ul>`,
    );
  }
  if (view.curves.length > 0) {
    body.push(h(2, labels.differences));
    if (view.reference !== null) body.push(p(text.reference(count(view.reference.curve))));
    if (view.referenceNote !== null) body.push(p(view.referenceNote));
    if (view.within !== null) {
      const { within } = view;
      body.push(
        h(3, labels.within),
        p(text.withinIntro),
        ...(within.section === null
          ? []
          : [
              `<p>${escapeHtml(text.withinSection)} ${link(sectionHref(within.section.suite, within.section.section), L.sectionLink(within.section.suite, count(within.section.section)))}</p>`,
            ]),
        ...within.notes.map((note) => p(note)),
        chartFigure(
          renderMtfDifference(within.view, within.subject, {}, text.withinIntro),
          differenceCaption(within.view),
        ),
      );
    }
    if (view.other !== null && view.reference !== null) {
      body.push(
        h(3, labels.other),
        p(text.otherIntro),
        chartFigure(renderLensOther(view.key, view.other, view.reference.curve), otherCaption(view.other)),
      );
    }
    body.push(...view.unresolved.map((sentence) => p(sentence, "muted")));
  }

  body.push(h(2, labels.runLens), p(text.runIntro), p(text.runHeavy, "problem"));
  if (run === null || !run.configured) body.push(p(text.runNotConfigured));
  else {
    body.push(
      lensForm(run.token, view.key, LENS_ENGINES, BENCHMARK_APERTURES, LENS_RUNS),
      p(
        DASHBOARD_TEXT.control.lensFields(
          LENS_ENGINES.join(", "),
          BENCHMARK_APERTURES.join(", "),
          LENS_RUNS.join(", "),
          String(CONTROL_MAX_JOBS),
        ),
      ),
    );
  }
  return page(L.lensOf(view.key), `/api${lensHref(view.key)}${query === "" ? "" : `?${query}`}`, body);
}

// ── The "LV vs optiland" pages ───────────────────────────────────────────────────────────────────────────────────

const compareHref = (key: string, tab: string | null, query: string): string =>
  `/compare/${encodeURIComponent(key)}${tab === null ? "" : `/${encodeURIComponent(tab)}`}${query === "" ? "" : `?${query}`}`;

/** A chip's text: the figures of the case it is the value of, in the template of its facet. */
function chipText(label: ConditionLabel): string {
  const text = DASHBOARD_TEXT.compare;
  switch (label.facet) {
    case "position":
      return label.zoomT === null && label.focusT === null
        ? escapeHtml(text.chipNoPosition)
        : fill(text.chipPosition, [plainFigure(label.zoomT), plainFigure(label.focusT)]);
    case "stop":
      return fill(text.chipStop, [plainFigure(label.stopSemiDiameterMm)]);
    case "plane":
      if (label.plane === "design") return escapeHtml(text.chipDesign);
      if (label.plane === "lv-best-axial") return escapeHtml(text.chipBestAxial);
      if (label.plane !== null) return escapeHtml(text.chipPlaneKind(label.plane));
      return fill(text.chipPlaneAt, [plainFigure(label.imageZ)]);
    case "lines": {
      const lines = label.lines.map((line) => line.wavelengthNm);
      if (lines.length === 1) return fill(text.chipOneLine, [plainFigure(lines[0])]);
      return fill(text.chipLines, [
        count(lines.length),
        plainFigure(lines[0] ?? null),
        plainFigure(lines.at(-1) ?? null),
      ]);
    }
  }
}

const FACET_NAMES: Readonly<Record<string, string>> = {
  position: DASHBOARD_TEXT.compare.facetPosition,
  stop: DASHBOARD_TEXT.compare.facetStop,
  plane: DASHBOARD_TEXT.compare.facetPlane,
  lines: DASHBOARD_TEXT.compare.facetLines,
};

/** The chips of a compare page: each facet's values, the chosen one in bold, the others links that choose them. */
function chipsBlock(view: CompareView): string[] {
  return view.facets.map((facet) => {
    const options = facet.options.map((option) =>
      option.chosen
        ? `<strong class="chip">${chipText(option.label)}</strong>`
        : `<a class="chip${option.compared ? "" : " muted"}" href="${escapeHtml(compareHref(view.key, view.tab, option.query))}">${chipText(option.label)}</a>`,
    );
    return `<p><span class="muted">${escapeHtml(FACET_NAMES[facet.facet] ?? facet.facet)}:</span> ${options.join(" ")}</p>`;
  });
}

/** A value with its unit, where it has one (a unit of "1" is a number without one). */
function withUnit(value: Figure, unit: string): string {
  return unit === "1" || unit === "" ? figure(value) : `${figure(value)} ${escapeHtml(unit)}`;
}

/** The gated lines of a card as a table: a row per rung, its pairs' verdicts, its largest headline figure and gate. */
function gatedTable(lines: readonly GatedLine[]): string[] {
  const text = DASHBOARD_TEXT.compare;
  const rows = lines.map((line) => {
    const pairs =
      line.pairs.length === 0
        ? `<span class="muted">${escapeHtml(text.none)}</span>`
        : line.pairs
            .map((pair) => fill(text.gatedPair, [engine(pair.a), engine(pair.b), verdict(pair.verdict)]))
            .join("<br>");
    const largest =
      line.headline !== null
        ? fill(text.gatedLargest, [
            metricName(line.headline.metric),
            figure(line.headline.value),
            engine(line.headline.a),
            engine(line.headline.b),
          ])
        : line.unmeasured !== null
          ? fill(text.gatedUnmeasured, [metricName(line.unmeasured)])
          : MUTED_DASH;
    const gate = line.headline?.gate ?? null;
    return [check(line.rung), pairs, largest, gate === null ? MUTED_DASH : figure(gate)];
  });
  const out = [table([text.columnRung, text.columnPairs, text.columnLargest, text.columnGate], rows)];
  const runs = [...new Set(lines.flatMap((line) => (line.source.kind === "runs" ? line.source.suites : [])))];
  const stems = [...new Set(lines.flatMap((line) => (line.source.kind === "baselines" ? line.source.stems : [])))];
  if (runs.length > 0) out.push(p(text.gatedFromRuns(runs.join(", ")), "muted"));
  if (stems.length > 0) out.push(p(text.gatedFromBaselines(stems.join(", ")), "muted"));
  for (const line of lines) if (line.pairs.length === 0) out.push(p(text.gatedNone(checkName(line.rung)), "muted"));
  return out;
}

/** A figure of a recorded line, against its band, its limit of the sorting, or no band. */
function recordedMetric(metric: RecordedLine["metrics"][number]): string {
  const text = DASHBOARD_TEXT.compare;
  const value = withUnit(metric.value, metric.unit);
  if (metric.limit !== null) return fill(text.metricLimit, [metricName(metric.name), value, figure(metric.limit)]);
  if (metric.band !== null) return fill(text.metricBand, [metricName(metric.name), value, figure(metric.band)]);
  return fill(text.metricNoBand, [metricName(metric.name), value]);
}

/** The recorded lines of a card as a table, and below it each line's notes, sources and (on a tab's page) details. */
function recordedTable(view: CompareView, lines: readonly RecordedLine[]): string[] {
  const text = DASHBOARD_TEXT.compare;
  if (lines.length === 0) return [];
  const none = '<span class="muted">—</span>';
  const rows = lines.map((line) => [
    check(line.rung),
    escapeHtml(line.label ?? "—"),
    fill(text.pairText, [engine(line.a), engine(line.b)]),
    verdict(line.verdict),
    line.metrics.map(recordedMetric).join("<br>") || none,
    line.counts.map((each) => fill(text.countText, [metricName(each.name), figure(each.value)])).join("<br>") || none,
    line.source.kind === "baseline"
      ? escapeHtml(text.fromBaselineShort(line.source.stem))
      : line.source.section === null
        ? escapeHtml(line.source.suite)
        : link(sectionHref(line.source.suite, line.source.section), line.source.suite),
  ]);
  const header = [
    text.columnRung,
    text.columnRequest,
    text.columnPair,
    text.columnVerdict,
    text.columnFigures,
    text.columnFields,
    text.columnRead,
  ];
  const out = [table(header, rows)];
  const notes = lines.flatMap((line) => [
    ...(line.reason === null
      ? []
      : [`<li>${escapeHtml(text.lineNote(checkName(line.rung), line.label ?? "", line.reason))}</li>`]),
    ...(line.source.kind === "baseline"
      ? [`<li>${escapeHtml(text.fromBaseline(line.source.stem, line.source.run))}</li>`]
      : []),
    ...(line.alsoIn.length > 0 ? [`<li>${escapeHtml(text.alsoIn(line.alsoIn.join(", ")))}</li>`] : []),
  ]);
  if (notes.length > 0) {
    out.push(`<details><summary>${escapeHtml(text.notesSummary)}</summary><ul>${notes.join("")}</ul></details>`);
  }
  if (view.tab !== null) {
    for (const line of lines) {
      if (line.detail === null) continue;
      out.push(
        h(3, text.detailHeading(checkName(line.rung), line.label ?? "", engineName(line.a), engineName(line.b))),
        ...detailBlock(view, line),
      );
    }
  }
  return out;
}

/** The elements a comparison sets aside, each where its chart's axis has it, with the figure's source on hover. */
function setAsideBlock(asides: readonly SetAsideElement[]): string[] {
  const text = DASHBOARD_TEXT.compare;
  return asides.map((aside) => {
    const at = aside.at === null ? escapeHtml(text.setAsideAt(String(aside.element))) : plainFigure(aside.at.value);
    return `<p class="muted">${fill(text.setAside, [at, differenceClass(aside.class), fieldReason(aside.reason)])}</p>`;
  });
}

/** A table of recorded values of both answers, with their differences and bands. */
function valuesTableBlock(view: ValuesTableView): string {
  const text = DASHBOARD_TEXT.compare;
  return table(
    [text.columnLine, text.columnValue, engineName(view.a), engineName(view.b), text.columnDifference, text.columnBand],
    view.rows.map((row) => [
      escapeHtml(row.group ?? ""),
      `<span title="${escapeHtml(row.name)}">${escapeHtml(COMPARE_AXES[row.name] ?? row.name)}</span>`,
      row.a === null ? '<span class="muted">—</span>' : figure(row.a.value),
      row.b === null ? '<span class="muted">—</span>' : figure(row.b.value),
      row.difference === null ? '<span class="muted">—</span>' : derivedValue(row.difference),
      row.metric === null || row.band === null ? escapeHtml(text.legendNoBand) : figure(row.band),
    ]),
  );
}

/** The details of a recorded line: the MTF section's charts of the pair, or the charts and tables of its values. */
function detailBlock(view: CompareView, line: RecordedLine): string[] {
  const text = DASHBOARD_TEXT.compare;
  const detail = line.detail;
  if (detail === null) return [];
  const subject = `${view.key}, ${line.source.kind === "run" ? line.source.run : line.source.stem}, ${checkName(line.rung)}`;
  const out: string[] = [...detail.problems.map((problem) => p(problem, "problem"))];
  if (detail.overlays.length + detail.differences.length > 0) {
    out.push(p(text.mtfIntro));
    detail.overlays.forEach((overlay, index) => {
      out.push(chartFigure(renderMtfOverlay(overlay, subject), overlayCaption(overlay)));
      const difference = detail.differences[index];
      if (difference !== undefined) {
        out.push(chartFigure(renderMtfDifference(difference, subject), differenceCaption(difference)));
      }
    });
  }
  for (const chart of detail.charts) {
    if (chart.kind === "points") {
      out.push(chartFigure(renderPairChart(chart, subject), pairBandCaption(chart)), ...setAsideBlock(chart.setAside));
    } else if (chart.kind === "fan") out.push(chartFigure(renderFanChart(chart, subject), fanChartCaption(chart)));
    else {
      out.push(p(text.valuesIntro), valuesTableBlock(chart), ...setAsideBlock(chart.setAside));
    }
  }
  if (detail.overlays.length + detail.differences.length + detail.charts.length === 0 && detail.problems.length === 0) {
    out.push(p(text.noDetails, "muted"));
  }
  return out;
}

/** A card: its tab's identical rays and its comparisons beside the counterpart, under its verdicts. */
function cardBlock(view: CompareView, card: CompareCard): string[] {
  const text = DASHBOARD_TEXT.compare;
  const verdictText = (value: Verdict | null): string =>
    value === null ? `<span class="muted">${escapeHtml(text.noneCompared)}</span>` : verdict(value);
  // The badge names the counterparts of the card's own checks: optiland's, or flux's for vignetting.
  const counterparts = COMPARE_TABS.find((tab) => tab.tab === card.tab)?.counterparts ?? [];
  const verdicts =
    counterparts.length === 0
      ? fill(text.cardVerdictsGated, [verdictText(card.gatedVerdict)])
      : fill(text.cardVerdicts, [
          verdictText(card.gatedVerdict),
          counterparts.map(engine).join(escapeHtml(text.counterpartsJoin)),
          verdictText(card.recordedVerdict),
        ]);
  const out = [
    '<section class="card">',
    `<h2>${escapeHtml(card.title)} <span class="badges">${verdicts}</span></h2>`,
    h(3, text.gatedHeading),
    ...gatedTable(card.gated),
  ];
  if (card.recorded.length + card.notCompared.length > 0) {
    out.push(h(3, text.recordedHeading));
    if (card.tab === "vignetting") out.push(p(text.flux(engineName("flux-of-lv-rays")), "muted"));
    out.push(...recordedTable(view, card.recorded));
    out.push(...card.notCompared.map((rung) => p(text.notCompared(checkName(rung)), "muted")));
  }
  if (view.tab === null && card.recorded.some((line) => line.source.kind === "run")) {
    out.push(`<p>${link(compareHref(view.key, card.tab, view.query), text.detailsLink)}</p>`);
  }
  out.push("</section>");
  return out;
}

/** A compare page: the chips, the runs of the condition, and a card for each tab (or one tab's card and details). */
export function renderCompare(
  view: CompareView,
  run: { readonly token: string; readonly configured: boolean } | null,
): string {
  const text = DASHBOARD_TEXT.compare;
  const title = view.tab === null ? text.title(view.key) : text.tabTitle(view.key, view.cards[0]?.title ?? view.tab);
  const body: string[] = [
    h(1, view.name === null ? title : `${title} (${view.name})`),
    p(text.lead),
    howToRead(
      [
        text.intro,
        text.recordedMeaning,
        text.chipsIntro,
        text.chipsMuted,
        DASHBOARD_TEXT.sources,
        DASHBOARD_TEXT.derived,
      ],
      [verdictLegend()],
    ),
    ...chipsBlock(view),
    ...view.notes.map((note) => p(note, "problem")),
  ];
  if (view.runs.length > 0) {
    body.push(
      `<p>${escapeHtml(text.runsIntro)} ${view.runs.map((each) => link(runPartHref(each.suite, each.place), `${each.suite}: ${each.run}`)).join(", ")}</p>`,
    );
  }
  if (view.count > 1) body.push(p(text.severalCases(count(view.count)), "muted"));
  if (view.tab !== null) {
    body.push(p(text.detailsIntro), `<p>${link(compareHref(view.key, null, view.query), text.cardsLink)}</p>`);
  }
  for (const card of view.cards) body.push(...cardBlock(view, card));
  body.push(p(text.runTabsHint, "muted"), `<p>${link(lensHref(view.key), L.lensOf(view.key))}</p>`);
  body.push(h(2, L.lens.runLens), p(DASHBOARD_TEXT.lens.runIntro), p(DASHBOARD_TEXT.lens.runHeavy, "problem"));
  if (run === null || !run.configured) body.push(p(DASHBOARD_TEXT.lens.runNotConfigured));
  else {
    body.push(
      lensForm(run.token, view.key, LENS_ENGINES, BENCHMARK_APERTURES, LENS_RUNS, "both"),
      p(
        DASHBOARD_TEXT.control.lensFields(
          LENS_ENGINES.join(", "),
          BENCHMARK_APERTURES.join(", "),
          LENS_RUNS.join(", "),
          String(CONTROL_MAX_JOBS),
        ),
      ),
    );
  }
  return page(title, `/api${compareHref(view.key, view.tab, view.query)}`, body);
}

/** The index's table of lenses compared beside optiland: a row per lens, a cell per tab of its verdicts. */
function comparedBlock(view: IndexView): string[] {
  const text = DASHBOARD_TEXT.compare;
  const out = [h(2, text.indexHeading), p(text.indexIntro)];
  if (view.compared.length === 0) return [...out, p(text.indexNone)];
  const tabs = COMPARE_TABS.map((tab) => tab.title);
  const cell = (verdictOf: Verdict | null, none: string): string =>
    verdictOf === null ? `<span class="muted">${escapeHtml(none)}</span>` : verdict(verdictOf);
  out.push(
    table(
      [C.lens, C.name, ...tabs],
      view.compared.map((lens) => [
        link(compareHref(lens.key, null, ""), lens.key),
        lens.name === null ? "—" : escapeHtml(lens.name),
        ...lens.cards.map((card) =>
          fill(text.indexCell, [cell(card.gated, text.noGated), cell(card.recorded, text.noRecorded)]),
        ),
      ]),
    ),
  );
  return out;
}
