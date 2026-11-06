// The pages of the dashboard, from their view models alone: pure functions, equal views giving equal bytes. Every
// interpolated string is escaped; a page has one inline <style> (light and dark by prefers-color-scheme) and no
// script. A number read from a file shows its source on hover; every sentence is a template of `DASHBOARD_TEXT`.
import { numberText } from "../compare/metricText.ts";
import type { Verdict } from "../contract/comparison.ts";
import { formatFixed } from "../core/numeric/format.ts";
import {
  CONSENSUS_SECTION,
  DASHBOARD_TEXT,
  GEOMETRIC_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  MTF_COMPARISON_OUTRO,
  MTF_ROW_STATUS_TEXT,
  NOT_COVERED,
  WAVEFRONT_SEVERAL_LINES,
  consensusSentence,
} from "../report/wording.ts";
import type { MtfRowStatus } from "../report/wording.ts";
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

/** A whole page: the head with its one stylesheet, the bar of links, and the body; `refresh` reloads it every 2 s. */
function page(title: string, json: string, body: readonly string[], refresh = false): string {
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
    `<header><a href="/">lvrtc dashboard</a><a href="/control">Control</a><span class="muted">${escapeHtml(title)}</span><a href="${escapeHtml(json)}">JSON</a></header>`,
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

/** A table, its cells HTML already. */
function table(header: readonly string[], rows: readonly (readonly string[])[]): string {
  const head = `<tr>${header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr>`;
  const body = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("\n");
  return `<div class="scroll"><table>\n${head}\n${body}\n</table></div>`;
}

/** A figure: its value, with its file and pointer on hover. */
function figure(value: Figure | null): string {
  if (value === null) return '<span class="muted">—</span>';
  const said = value.value === null ? "not finite" : numberText(value.value);
  const where = `${documentLabel(value.source.document)} ${value.source.pointer}`;
  return `<span class="fig" title="${escapeHtml(where)}">${escapeHtml(said)}</span>`;
}

/** A figure written as the file holds it, shortest form (a position, a stop, a wavelength), with its source on hover. */
function plainFigure(value: Figure | null): string {
  if (value === null) return '<span class="muted">—</span>';
  const said = value.value === null ? "not finite" : String(value.value);
  const where = `${documentLabel(value.source.document)} ${value.source.pointer}`;
  return `<span class="fig" title="${escapeHtml(where)}">${escapeHtml(said)}</span>`;
}

/** A derived number: its value, with how it was computed on hover. */
function derivedValue(value: Derived): string {
  const said = value.value === null ? "not finite" : numberText(value.value);
  const of = value.of.map((source) => `${documentLabel(source.document)} ${source.pointer}`).join("; ");
  return `<span class="derived" title="${escapeHtml(`derived: ${value.derivation}${of === "" ? "" : ` of ${of}`}`)}">${escapeHtml(said)}</span>`;
}

function figureOrDerived(value: Figure | Derived | null): string {
  if (value === null) return '<span class="muted">—</span>';
  return "derivation" in value ? derivedValue(value) : figure(value);
}

function verdict(value: Verdict | null): string {
  return value === null ? '<span class="muted">—</span>' : `<span class="v-${value}">${escapeHtml(value)}</span>`;
}

function badge(value: string): string {
  const kind = value.startsWith("STALE") ? "STALE" : value.startsWith("NOT KNOWN") ? "NOTKNOWN" : "CURRENT";
  return `<span class="b-${kind}">${escapeHtml(value)}</span>`;
}

function verdictCounts(counts: readonly VerdictCount[]): string {
  const said = counts.filter(({ count: n }) => n > 0).map(({ verdict: v, count: n }) => `${count(n)} ${verdict(v)}`);
  return said.length === 0 ? '<span class="muted">—</span>' : said.join(", ");
}

function statusCounts(counts: readonly StatusCount[]): string {
  const said = counts
    .filter(({ count: n }) => n > 0)
    .map(({ status, count: n }) => `${count(n)} ${escapeHtml(status)}`);
  return said.length === 0 ? '<span class="muted">—</span>' : said.join(", ");
}

function problems(list: readonly DocumentProblem[]): string[] {
  return list.map(({ document, problem }) => p(DASHBOARD_TEXT.documentProblem(document, problem), "problem"));
}

function engineText(engine: ViewEngine | null): string {
  if (engine === null) return '<span class="muted">not known</span>';
  if (engine.status === "unavailable") return `unavailable: ${code(engine.code)}`;
  const adapter = engine.adapterRevision === null ? "" : ` / ${code(engine.adapterRevision)}`;
  return `${escapeHtml(engine.version)}, ${code(engine.fingerprint)}${adapter}`;
}

function enginesTable(engines: readonly ViewEngine[]): string {
  return table(
    ["Engine", "Status", "Version", "Fingerprint", "Adapter revision"],
    engines.map((engine) =>
      engine.status === "unavailable"
        ? [escapeHtml(engine.id), "unavailable", code(engine.code), "—", "—"]
        : [
            escapeHtml(engine.id),
            "available",
            escapeHtml(engine.version),
            code(engine.fingerprint),
            engine.adapterRevision === null ? "—" : code(engine.adapterRevision),
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
    return [h(2, "Ladder heat map"), p(text.heatMapOmitted(count(view.omitted.count), count(HEAT_MAP_ROWS)))];
  }
  return [
    h(2, "Ladder heat map"),
    chartFigure(renderHeatMap(view, subject, kind), kind === "run" ? text.heatMapRun : text.heatMapBaseline),
  ];
}

/** The charts of a section: its store problems, its MTF overlays and differences, its per-surface deviations. */
function chartsBlock(charts: SectionCharts, subject: string): string[] {
  const text = DASHBOARD_TEXT.charts;
  const any = charts.overlays.length + charts.differences.length + charts.deviations.length > 0;
  if (!any && charts.problems.length === 0) return [];
  const out = [
    h(2, "Charts"),
    p(text.intro),
    p(text.storeIntro),
    ...charts.problems.map((problem) => p(problem, "problem")),
  ];
  if (charts.overlays.length > 0) {
    out.push(h(3, "MTF of each answer"), p(text.overlayIntro));
    for (const view of charts.overlays) out.push(chartFigure(renderMtfOverlay(view, subject), overlayCaption(view)));
  }
  if (charts.differences.length > 0) {
    out.push(h(3, "Differences of each pair"), p(text.differenceIntro));
    for (const view of charts.differences) {
      out.push(chartFigure(renderMtfDifference(view, subject), differenceCaption(view)));
    }
  }
  if (charts.deviations.length > 0) {
    out.push(h(3, "Hit distance by surface or visit"), p(text.deviationIntro));
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

// ── The index ────────────────────────────────────────────────────────────────────────────────────────────────────

/** The index page. */
export function renderIndex(view: IndexView): string {
  const text = DASHBOARD_TEXT.staleness;
  const body = [
    h(1, "Runs and baselines"),
    p(DASHBOARD_TEXT.readOnly),
    p(DASHBOARD_TEXT.sources),
    ...problems(view.problems),
    view.policy === null
      ? ""
      : `<p>${fill(DASHBOARD_TEXT.policyAtHand, [escapeHtml(view.policy.name), figure(view.policy.version), code(view.policy.hash)])}</p>`,
    p(askedText(view.engines)),
    ...comparedBlock(view),
    h(2, "Runs"),
    view.runs.length === 0
      ? p(DASHBOARD_TEXT.noRuns)
      : table(
          ["Suite", "Jobs", "Compared", "Pairs by verdict", "FAIL or ERROR", "Problems"],
          view.runs.map((run) => [
            link(runHref(run.name), run.name),
            statusCounts(run.jobs),
            run.comparisons === "ok" ? "yes" : run.comparisons === "none" ? "no" : '<span class="muted">—</span>',
            verdictCounts(run.verdicts),
            count(run.failing),
            problemsCell([
              ...run.problems.map(({ document, problem }) => DASHBOARD_TEXT.documentProblem(document, problem)),
              ...run.inputProblems,
            ]),
          ]),
        ),
    h(2, "Baselines"),
    view.baselines.length === 0
      ? p(DASHBOARD_TEXT.noBaselines)
      : table(
          ["Baseline", "Kind", "Suite", "Policy", "Records", "Records by verdict", "Records by badge", "Problems"],
          view.baselines.map((baseline) => [
            link(baselineHref(baseline.stem), baseline.stem),
            escapeHtml(baseline.kind),
            baseline.suite === null ? "—" : escapeHtml(baseline.suite),
            baseline.policyVersion === null ? "—" : `v${figure(baseline.policyVersion)}`,
            count(baseline.records),
            verdictCounts(baseline.verdicts),
            badgeCounts(baseline.badges),
            problemsCell(
              baseline.problems.map(({ document, problem }) => DASHBOARD_TEXT.documentProblem(document, problem)),
            ),
          ]),
        ),
    h(2, "Lenses"),
    p(DASHBOARD_TEXT.lens.indexIntro),
    ...problems(view.lensProblems),
    view.lenses.length === 0
      ? p(DASHBOARD_TEXT.lens.noLenses)
      : table(
          ["Lens", "Name", "Runs", "Run directories"],
          view.lenses.map((lens) => [
            link(lensHref(lens.key), lens.key),
            lens.name === null ? "—" : escapeHtml(lens.name),
            count(lens.runCount),
            lens.suites.map((suite) => link(runHref(suite), suite)).join(", "),
          ]),
        ),
    p(text.intro),
    p(text.badges),
    p(text.check),
  ];
  return page("Index", "/api/index", body);
}

function badgeCounts(counts: readonly { readonly badge: string; readonly count: number }[]): string {
  return (
    counts.map(({ badge: b, count: n }) => `${count(n)} ${badge(b)}`).join("<br>") || '<span class="muted">—</span>'
  );
}

// ── The run pages ────────────────────────────────────────────────────────────────────────────────────────────────

function supportTable(engines: readonly string[], rows: RunPartView["rows"]): string {
  return table(
    ["Rung", "Request", ...engines],
    rows.map((row) => [
      escapeHtml(row.rung),
      row.request === null ? "—" : escapeHtml(row.request),
      ...row.cells.map(
        (cell) =>
          `${escapeHtml(cell.status)}${cell.detail === undefined ? "" : ` <span class="muted">${escapeHtml(cell.detail)}</span>`}`,
      ),
    ]),
  );
}

function sectionsTable(name: string, sections: readonly SectionEntry[]): string {
  return table(
    ["Section", "Run", "Rung", "Quantity", "Request", "Verdict"],
    sections.map((section) => [
      link(sectionHref(name, section.section), count(section.section)),
      escapeHtml(section.run),
      escapeHtml(section.rung),
      code(section.quantity),
      section.request === null ? "—" : escapeHtml(section.request),
      verdict(section.verdict),
    ]),
  );
}

/** A run page. */
export function renderRun(view: RunView): string {
  const body: string[] = [h(1, `Run of ${view.name}`), ...problems(view.problems)];
  if (view.suite === null) {
    body.push(p(DASHBOARD_TEXT.notReadable));
    return page(view.name, `/api${runHref(view.name)}`, body);
  }
  const compared = view.comparisons === "ok";
  body.push(
    `<p>Suite hash ${code(view.suite.hash)}</p>`,
    p(DASHBOARD_TEXT.sources),
    ...(view.comparisons === "none" ? [p(DASHBOARD_TEXT.notCompared)] : []),
    ...(view.comparisons === "invalid" ? [p(DASHBOARD_TEXT.comparisonsUnreadable)] : []),
    ...(view.inputProblems.length === 0
      ? []
      : [
          p(DASHBOARD_TEXT.inputProblems, "problem"),
          `<ul>${view.inputProblems.map((problem) => `<li>${escapeHtml(problem)}</li>`).join("")}</ul>`,
        ]),
    h(2, "Engines"),
    enginesTable(view.engines),
    h(2, "Runs"),
    ...(view.split ? [p(DASHBOARD_TEXT.split)] : []),
    table(
      ["Run", "Lens", "Case", "Requests", "Sections", "Gravest verdict", "Problems"],
      view.runs.map((run) => [
        view.split ? link(runPartHref(view.name, run.place), run.name) : escapeHtml(run.name),
        run.lens === null ? "—" : link(lensHref(run.lens), run.lens),
        run.caseId === null ? "—" : code(run.caseId),
        count(run.requests),
        count(run.sectionCount),
        verdict(run.verdict),
        problemsCell(run.problems),
      ]),
    ),
  );
  if (compared) {
    body.push(
      h(2, "Verdicts"),
      table(
        ["Mode", "Pairs by verdict"],
        view.summary.map(({ mode, counts }) => [escapeHtml(mode), verdictCounts(counts)]),
      ),
      p(DASHBOARD_TEXT.failing(view.failing)),
      ...DASHBOARD_TEXT.verdicts.map((sentence) => p(sentence)),
      ...heatMapBlock(view.heatMap, view.name, "run"),
    );
  }
  const engineIds = view.supportByRung[0]?.engines.map(({ engine }) => engine) ?? [];
  body.push(
    h(2, "Support"),
    p(DASHBOARD_TEXT.supportByRung),
    table(
      ["Rung", ...engineIds],
      view.supportByRung.map((row) => [escapeHtml(row.rung), ...row.engines.map(({ counts }) => statusCounts(counts))]),
    ),
  );
  if (!view.split) {
    body.push(
      p(DASHBOARD_TEXT.supportByRun),
      ...view.supportByRun.map(
        ({ run, rows }) => `<details><summary>${escapeHtml(run)}</summary>${supportTable(engineIds, rows)}</details>`,
      ),
      h(2, "Sections"),
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
    h(2, "Pending jobs"),
    view.pending.length === 0
      ? p(DASHBOARD_TEXT.noPending)
      : [
          p(DASHBOARD_TEXT.pending),
          table(
            ["Run", "Rung", "Engine", "Step", "Request"],
            view.pending.map((job) => [
              escapeHtml(job.run),
              escapeHtml(job.rung),
              escapeHtml(job.engine),
              job.step === null ? "—" : escapeHtml(job.step),
              code(job.requestId),
            ]),
          ),
        ].join("\n"),
    h(2, "Not covered"),
    `<ul>${NOT_COVERED.map((sentence) => `<li>${escapeHtml(sentence)}</li>`).join("")}</ul>`,
  );
  return page(view.name, `/api${runHref(view.name)}`, body);
}

/** The page of one run of a suite whose run page is split. */
export function renderRunPart(view: RunPartView): string {
  const body = [
    h(1, `${view.run}, a run of ${view.name}`),
    `<p>${link(runHref(view.name), `Run of ${view.name}`)} · case ${view.caseId === null ? "—" : code(view.caseId)}${view.lens === null ? "" : ` · ${link(lensHref(view.lens), `Lens ${view.lens}`)}`}</p>`,
    ...view.problems.map((problem) => p(problem, "problem")),
    h(2, "Support"),
    p(DASHBOARD_TEXT.supportByRun),
    supportTable(view.engines, view.rows),
    h(2, "Sections"),
    view.sections.length === 0
      ? p(DASHBOARD_TEXT.noSections)
      : [p(DASHBOARD_TEXT.sections), sectionsTable(view.name, view.sections)].join("\n"),
  ];
  return page(`${view.name}: ${view.run}`, `/api${runPartHref(view.name, view.place)}`, body);
}

// ── The section page ─────────────────────────────────────────────────────────────────────────────────────────────

function whereText(where: readonly WhereEntry[]): string {
  if (where.length === 0) return "";
  const said = where.map(
    ({ key, value }) => `${escapeHtml(key)} ${typeof value === "string" ? escapeHtml(value) : figure(value)}`,
  );
  return ` <span class="muted">at ${said.join(", ")}</span>`;
}

function metric(value: MetricView | null, withName = false): string {
  if (value === null) return '<span class="muted">—</span>';
  const name = withName ? `${escapeHtml(value.name)} ` : "";
  return `${name}${figure(value.value)}${whereText(value.where)}`;
}

function mtfTable(view: MtfView, name: string): string[] {
  const head = view.columns.map(
    (column) => `${column.engine}${column.step === null ? "" : ` #${column.step}`}${column.judged ? " *" : ""}`,
  );
  const reason = view.pair.reason === null ? "" : ` <span class="muted">${escapeHtml(view.pair.reason)}</span>`;
  const out = [
    h(3, name),
    p(MTF_COMPARISON_INTROS[view.kind].join(" ")),
    ...(view.severalLines && view.kind !== "diffraction"
      ? [p((view.kind === "geometric" ? GEOMETRIC_SEVERAL_LINES : WAVEFRONT_SEVERAL_LINES).join(" "))]
      : []),
    `<p>${fill(DASHBOARD_TEXT.mtfPair, [escapeHtml(view.pair.a), escapeHtml(view.pair.b), verdict(view.pair.verdict)])}${reason}</p>`,
    `<p>${fill(DASHBOARD_TEXT.mtfBands, [figureOrDerived(view.bands.onAxis), figureOrDerived(view.bands.offAxis), figureOrDerived(view.bands.chiefLandingMm)])}</p>`,
    table(
      [
        "Field",
        "Angle (deg)",
        ...head.map((column) => `${column}: flag, across, last change`),
        "Chief landing (mm)",
        "Rim rays lost",
        "Rim spread (mm)",
        "Class",
        "Reason",
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
        field.class === null ? "—" : escapeHtml(field.class),
        field.reason === null ? "—" : escapeHtml(field.reason),
      ]),
    ),
    table(
      ["Field", "Cut", "Frequency (cycles/mm)", ...head, "Difference", "Band", "Status", "Class"],
      view.rows.map((row) => [
        figure(row.field),
        escapeHtml(row.cut),
        escapeHtml(row.frequency),
        ...row.values.map((value) => figure(value)),
        figureOrDerived(row.difference),
        figureOrDerived(row.band),
        escapeHtml(row.status),
        row.class === null ? "—" : escapeHtml(row.class),
      ]),
    ),
    table(
      ["Status", "Meaning"],
      (Object.keys(MTF_ROW_STATUS_TEXT) as MtfRowStatus[]).map((status) => [
        escapeHtml(status),
        escapeHtml(MTF_ROW_STATUS_TEXT[status]),
      ]),
    ),
    p(MTF_COMPARISON_OUTRO.join(" ")),
  ];
  view.peers.forEach((peer, index) => out.push(...mtfTable(peer, `${name}: peer ${index + 1}`)));
  return out;
}

/** A section page. */
export function renderSection(view: SectionView): string {
  const title = `${view.name}: section ${view.section}`;
  const body: string[] = [
    h(1, `${view.run}, ${view.rung}${view.request === null ? "" : `, ${view.request}`}`),
    `<p>${link(runHref(view.name), `Run of ${view.name}`)} · quantity ${code(view.quantity)} · request ${code(view.requestId)} · ${escapeHtml(view.mode ?? "no policy entry")}, ${escapeHtml(view.class ?? "no class")} · ${verdict(view.verdict)}</p>`,
    p(DASHBOARD_TEXT.sources),
    p(DASHBOARD_TEXT.derived),
    ...(view.inputProblems.length === 0
      ? []
      : [
          p(DASHBOARD_TEXT.inputProblems, "problem"),
          `<ul>${view.inputProblems.map((problem) => `<li>${escapeHtml(problem)}</li>`).join("")}</ul>`,
        ]),
    h(2, "Columns"),
    p(DASHBOARD_TEXT.columns),
    table(
      ["Metric", "Unit", "Limit", "Kind", "Floor limit"],
      view.columns.map((column) => [
        escapeHtml(column.name),
        column.unit === null ? "—" : escapeHtml(column.unit),
        figureOrDerived(column.limit),
        column.limitKind === null ? "—" : escapeHtml(column.limitKind),
        figure(column.floorLimit),
      ]),
    ),
  ];
  if (view.referenceVsEach !== null) {
    body.push(
      h(2, "Reference against each"),
      p(DASHBOARD_TEXT.referenceVsEach(view.referenceVsEach.reference)),
      table(
        ["Engine", ...view.columns.map((column) => column.name), "Verdict", "Reason"],
        view.referenceVsEach.rows.map((row) => [
          escapeHtml(row.engine),
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
      h(2, "Pairwise"),
      p(DASHBOARD_TEXT.pairwise),
      table(
        ["", ...engines],
        cells.map((row, index) => [
          escapeHtml(engines[index]),
          ...row.map((cell) => (cell === null ? "—" : `${verdict(cell.verdict)}<br>${metric(cell.worst, true)}`)),
        ]),
      ),
    );
  }
  if (view.consensus !== null) {
    body.push(h(2, "Consensus"), p(CONSENSUS_SECTION.join(" ")), p(consensusSentence(view.consensus)));
  }
  if (view.recorded !== null) {
    body.push(
      h(2, "Recorded"),
      p(DASHBOARD_TEXT.recorded),
      table(
        ["Value", "Element", ...view.recorded.engines],
        view.recorded.rows.map((row) => [
          escapeHtml(row.name),
          count(row.element),
          ...row.cells.map((cell) => figure(cell)),
        ]),
      ),
    );
  }
  if (view.mtf !== null) body.push(h(2, "MTF"), p(DASHBOARD_TEXT.mtf), ...mtfTable(view.mtf, "Table"));
  body.push(...chartsBlock(view.charts, `${view.run}, ${view.rung}`));
  return page(title, `/api${sectionHref(view.name, view.section)}`, body);
}

// ── The baseline pages ───────────────────────────────────────────────────────────────────────────────────────────

/** The head both baseline pages share: which baseline, its inputs, the snapshot note and the bases. */
function baselineHead(view: BaselineView | BaselineRunView): string[] {
  if (view.suite === null || view.policy === null || view.bases === null) return [];
  const text = DASHBOARD_TEXT.staleness;
  const version = view.policy.version.value === null ? "?" : numberText(view.policy.version.value);
  return [
    `<p>${fill(DASHBOARD_TEXT.baselineHead, [
      escapeHtml(view.baselineKind),
      escapeHtml(view.suite.name),
      code(view.suite.hash),
      figure(view.policy.version),
      code(view.policy.hash),
    ])}</p>`,
    ...(view.snapshot ? [p(text.snapshot(version))] : []),
    p(DASHBOARD_TEXT.sources),
    ...basesText(view.bases).map((sentence) => p(sentence)),
  ];
}

/** A baseline page: inputs, engines, staleness summary and a row per run. */
export function renderBaseline(view: BaselineView): string {
  const text = DASHBOARD_TEXT.staleness;
  const body: string[] = [h(1, `Baseline ${view.stem}`), ...problems(view.problems), ...baselineHead(view)];
  if (view.suite === null) return page(view.stem, `/api${baselineHref(view.stem)}`, body);
  body.push(
    h(2, "Staleness"),
    p(text.intro),
    p(text.badges),
    p(text.check),
    table(
      ["Badge", "Records"],
      view.summary.badges.map(({ badge: b, count: n }) => [badge(b), count(n)]),
    ),
    table(
      ["Reason", "Records stale by it", "Records where it is not known"],
      view.summary.stale.map(({ reason, count: n }, index) => [
        escapeHtml(reason),
        count(n),
        count(view.summary.notKnown[index]?.count ?? 0),
      ]),
    ),
    h(2, "Engines"),
    table(
      ["Engine", "In the baseline", "Now, by the basis"],
      view.engines.map((engine) => [
        escapeHtml(engine.id),
        `${escapeHtml(engine.version)}, ${code(engine.fingerprint)}${engine.adapterRevision === null ? "" : ` / ${code(engine.adapterRevision)}`}`,
        engineText(engine.now),
      ]),
    ),
    ...heatMapBlock(view.heatMap, view.stem, "baseline"),
    h(2, "Runs"),
    p(DASHBOARD_TEXT.baselineRuns),
    table(
      ["Run", "Records", ...view.rungs, "Records by badge"],
      view.runs.map((run) => [
        link(baselineRunHref(view.stem, run.place), run.name),
        count(run.records),
        ...run.verdicts.map((each) => verdict(each)),
        badgeCounts(run.badges),
      ]),
    ),
  );
  return page(view.stem, `/api${baselineHref(view.stem)}`, body);
}

function pairRow(rung: BaselineRunView["rungs"][number], pair: BaselinePairView): string[] {
  return [
    escapeHtml(rung.rung),
    figure(rung.requests),
    `${escapeHtml(pair.a)} – ${escapeHtml(pair.b)}`,
    verdict(pair.verdict),
    pair.verdicts.map(({ verdict: v, requests }) => `${figure(requests)} ${verdict(v)}`).join(", "),
    pair.metrics
      .map(
        (each) =>
          `${escapeHtml(each.name)} ${figure(each.value)}${each.unit === "1" ? "" : ` ${escapeHtml(each.unit)}`}${each.tolerance === null ? "" : ` (≤ ${figure(each.tolerance)})`}${each.measured === null ? "" : ` [${figure(each.measured)} measured]`}${whereText(each.where)}`,
      )
      .join("<br>") || "—",
    pair.failures.map((failure) => `${escapeHtml(failure.metric)}: ${escapeHtml(failure.class)}`).join("<br>") || "—",
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
            : text.caseMoved(view.caseNow.caseId);
  const body = [
    h(1, `${view.name}, a run of the baseline ${view.stem}`),
    `<p>${link(baselineHref(view.stem), `Baseline ${view.stem}`)} · case ${view.caseId === null ? "—" : code(view.caseId)}${caseNow === "" ? "" : `; ${escapeHtml(caseNow)}`}</p>`,
    ...problems(view.problems),
    ...view.runProblems.map((problem) => p(problem, "problem")),
    ...baselineHead(view),
    p(text.badges),
    table(
      ["Rung", "Requests", "Pair", "Verdict", "Requests by verdict", "Metrics", "Classified", "Badge"],
      view.rungs.flatMap((rung) => rung.pairs.map((pair) => pairRow(rung, pair))),
    ),
  ];
  return page(`${view.stem}: ${view.name}`, `/api${baselineRunHref(view.stem, view.place)}`, body);
}

/** The page of a path the dashboard has nothing at, or of a request it refuses. */
export function renderRefusal(status: number, what: string): string {
  return page(`${status}`, "/api/index", [h(1, `${status} ${what}`), `<p>${link("/", "Index")}</p>`]);
}

// ── Run control (Stage 8.3) ──────────────────────────────────────────────────────────────────────────────────────

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
  const body: string[] = [h(1, "Run control"), p(text.intro), p(text.heavy, "problem"), p(text.noMaintenance), busy];

  body.push(h(2, "Start a suite"), p(text.startHow), p(text.startFields(String(CONTROL_MAX_JOBS))));
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
          `<label>Suite <select name="suite">${options.join("")}</select></label>`,
          '<label>Engines <input type="text" name="engines" size="40"></label>',
          '<label>Rungs <input type="text" name="rungs" size="40"></label>',
          `<label>Jobs <input type="number" name="jobs" min="1" max="${CONTROL_MAX_JOBS}" value="1"></label>`,
        ],
        "Start",
      ),
    );
  }
  body.push(
    ...view.ownerOnly.map((name) => p(text.ownerOnlySuite(name), "problem")),
    p(text.enginesKnown(view.engines.join(", ") || "none")),
    p(text.rungsKnown(view.rungs.join(", "))),
  );

  body.push(h(2, "Run one lens"), p(text.lensHow), p(DASHBOARD_TEXT.lens.runHeavy, "problem"));
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
    h(2, "Collect"),
    p(text.collectHow),
    view.configured ? form("collect", token, [], "Collect") : p(text.notConfigured),
  );

  const store = DASHBOARD_TEXT.store;
  body.push(
    h(2, "Store maintenance"),
    p(store.intro),
    p(store.writers, "problem"),
    p(store.pruneRule, "problem"),
    p(store.compressRule),
    p(store.temporary),
    view.configured
      ? [form("plan-prune", token, [], "Plan prune"), form("plan-compress", token, [], "Plan compress")].join("\n")
      : p(text.notConfigured),
  );

  body.push(
    h(2, "Engines"),
    p(askedText({ state: view.asked.state as IndexView["engines"]["state"], problem: view.asked.problem })),
  );
  body.push(
    view.canAsk ? [p(text.askHow), form("ask", token, [], "Ask the engines again")].join("\n") : p(text.cannotAsk),
  );

  body.push(h(2, "Jobs"), p(text.jobsKept));
  body.push(
    view.jobs.length === 0
      ? p(text.noJobs)
      : table(
          ["Job", "Kind", "Suite", "Steps"],
          [...view.jobs]
            .reverse()
            .map((job) => [
              link(jobHref(job.job), count(job.job)),
              escapeHtml(jobKindText(job)),
              `${job.suite === null ? "—" : escapeHtml(job.suite)}${job.lens === null ? "" : ` (${link(lensHref(job.lens), job.lens)})`}`,
              job.steps.map((step) => `${escapeHtml(step.name)}: ${escapeHtml(stepState(step))}`).join("<br>"),
            ]),
        ),
  );

  body.push(h(2, "Pending jobs"));
  body.push(
    view.pending.length === 0
      ? p(text.noPending)
      : [
          p(text.pending),
          table(
            ["Suite", "Run", "Rung", "Engine", "Step", "Request"],
            view.pending.map((job) => [
              link(runHref(job.suite), job.suite),
              escapeHtml(job.run),
              escapeHtml(job.rung),
              escapeHtml(job.engine),
              job.step === null ? "—" : escapeHtml(job.step),
              code(job.requestId),
            ]),
          ),
        ].join("\n"),
  );

  body.push(h(2, "Exchange directories"));
  if (!view.configured) body.push(p(text.notConfigured));
  else if (view.exchange.length === 0) body.push(p(text.noExchange));
  else {
    const folders = view.exchange[0].folders.map(({ folder }) => folder);
    body.push(
      p(text.exchange),
      table(
        ["Engine", ...folders],
        view.exchange.map((engine) => [escapeHtml(engine.engine), ...engine.folders.map((each) => count(each.count))]),
      ),
      ...view.exchange.map((engine) => p(text.operator(engine.engine))),
    );
  }
  return page("Run control", "/api/control", body);
}

/** A job's kind, as the jobs table names it. */
function jobKindText(job: Pick<JobEntry, "jobKind" | "store">): string {
  if (job.store !== null) return `${job.store.mode === "plan" ? "plan of" : "confirmed"} store ${job.store.action}`;
  return job.jobKind === "suite" ? "start" : job.jobKind === "lens" ? "run of a lens" : "collect";
}

/** Bytes as a whole number of them and in GiB. */
function bytesText(bytes: number): string {
  return `${count(bytes)} B (${formatFixed(bytes / 2 ** 30, 3)} GiB)`;
}

/** A store job's report: the prune's notice, its tables, its state, and from a plan the form that confirms it. */
function storeBlock(view: StoreJobView, job: number, token: string | null): string[] {
  const store = DASHBOARD_TEXT.store;
  const out: string[] = [h(2, view.mode === "plan" ? `Plan of store ${view.action}` : `Store ${view.action}`)];
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
        ["Engine", "Kept files", "Kept bytes", "Removable files", "Removable bytes"],
        report.engines.map((each) => [
          escapeHtml(each.engine),
          count(each.kept.files),
          bytesText(each.kept.bytes),
          count(each.removable.files),
          bytesText(each.removable.bytes),
        ]),
      ),
      table(
        ["Removable engine", "Fingerprint", "Adapter revision", "Files", "Bytes", "Newest entry"],
        report.removable.map((each) => [
          escapeHtml(each.engine),
          code(each.fingerprint),
          each.adapterRevision === null ? "—" : code(each.adapterRevision),
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
        ["Plain entries", "Gzip entries", "Bytes before", "Bytes after"],
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
  out.push(p(store.state(view.state)));
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
          view.action === "prune" ? "Prune" : "Compress",
        ),
      );
    } else out.push(p(store.notConfirmable));
  }
  return out;
}

/**
 * The page of one job: each step's command line, state and output, a collect's outcome, a lens's catalog and a store
 * job's report. A plan of store maintenance carries the form that confirms it, with `token`.
 */
export function renderJob(view: JobView, token: string | null = null): string {
  const text = DASHBOARD_TEXT.control;
  const what =
    view.jobKind === "suite"
      ? `start of ${view.suite ?? "a suite"}`
      : view.jobKind === "lens"
        ? `run of the lens ${view.lens ?? ""}`
        : view.jobKind === "store"
          ? jobKindText(view)
          : "collect";
  const body: string[] = [
    h(1, `Job ${count(view.job)}: ${what}`),
    `<p>${link("/control", "Run control")}${view.suite === null ? "" : ` · ${link(runHref(view.suite), `Run of ${view.suite}`)}`}${view.lens === null ? "" : ` · ${link(lensHref(view.lens), `Lens ${view.lens}`)}`}</p>`,
    p(view.running ? text.jobRunning : text.jobEnded),
    // A store job's report first: the prune's notice, and from a plan the form that confirms it.
    ...(view.store === null ? [] : storeBlock(view.store, view.job, token)),
    p(text.output),
  ];
  for (const step of view.steps) {
    body.push(
      h(2, step.name),
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
    body.push(h(2, "Collected"), p(text.collected));
    if (view.collect.problem !== null) body.push(p(view.collect.problem, "problem"));
    else if (view.collect.engines.length === 0) body.push(p(text.collectNothing));
    else {
      body.push(
        table(
          ["Engine", "Collected", "Rejected", "Still pending"],
          view.collect.engines.map((engine) => [
            escapeHtml(engine.engine),
            count(engine.collected.count),
            count(engine.rejected.count),
            count(engine.pending.count),
          ]),
        ),
      );
      for (const engine of view.collect.engines) {
        if (engine.unavailable !== null)
          body.push(
            `<p class="problem">${fill(text.collectUnavailable, [escapeHtml(engine.engine), code(engine.unavailable)])}</p>`,
          );
        if (engine.rejected.jobs.length > 0) {
          body.push(
            table(
              ["Engine", "Rejected job", "Reason"],
              // The reason is lvrtc collect's own words, shown as it said them: none of the dashboard's sentences.
              engine.rejected.jobs.map(({ job, reason }) => [escapeHtml(engine.engine), code(job), code(reason)]),
            ),
          );
        }
      }
    }
  }
  return page(`Job ${count(view.job)}`, `/api${jobHref(view.job)}`, body, view.running);
}

/** The page of an action that was refused: its status and the sentence that says why. */
export function renderActionRefusal(status: number, reason: string): string {
  return page(`${status}`, "/api/control", [
    h(1, `${status} ${DASHBOARD_TEXT.control.refusedTitle}`),
    p(reason),
    `<p>${link("/control", "Run control")}</p>`,
  ]);
}

// ── The lens page (Stage 8.4) ────────────────────────────────────────────────────────────────────────────────────

/** The form that runs one lens: POST to run control with the server's token; the key fixed where a lens page has it. */
function lensForm(
  token: string,
  lens: string | null,
  engines: readonly string[],
  apertures: readonly string[],
  runs: readonly string[],
  chosenRun: string | null = null,
): string {
  const options = [
    '<option value="">both</option>',
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
        ? '<label>Lens key <input type="text" name="lens" size="40"></label>'
        : `<input type="hidden" name="lens" value="${escapeHtml(lens)}">`,
      `<label>Engines <input type="text" name="engines" size="24" placeholder="${escapeHtml(engines.join(","))}"></label>`,
      `<label>Profile <select name="profile">${runOptions.join("")}</select></label>`,
      `<label>Aperture <select name="aperture">${options.join("")}</select></label>`,
      `<label>Jobs <input type="number" name="jobs" min="1" max="${CONTROL_MAX_JOBS}" value="1"></label>`,
    ],
    "Run this lens",
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

/** The condition of a run as table cells: zoom, focus, stop, object, image plane, lines. */
function conditionCells(condition: LensCondition | null): string[] {
  if (condition === null) return ["—", "—", "—", "—", "—", "—"];
  const plane =
    condition.plane === null
      ? `${plainFigure(condition.imageZ)} <span class="muted">(${escapeHtml(DASHBOARD_TEXT.lens.planeNotRecorded)})</span>`
      : `${plainFigure(condition.imageZ)} ${escapeHtml(condition.plane.kind)}${condition.plane.shiftMm === null ? "" : ` ${plainFigure(condition.plane.shiftMm)} mm`}`;
  return [
    plainFigure(condition.zoomT),
    plainFigure(condition.focusT),
    plainFigure(condition.stopSemiDiameterMm),
    condition.object.kind === "infinity"
      ? escapeHtml(DASHBOARD_TEXT.lens.objectInfinity)
      : `z ${plainFigure(condition.object.z)}`,
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
    escapeHtml(curve.rung),
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
  const query = lensQuery(view, view.curves.find((curve) => curve.reference)?.id ?? null);
  const body: string[] = [
    h(1, view.name === null ? `Lens ${view.key}` : `Lens ${view.key}: ${view.name}`),
    `<p>${escapeHtml(text.compareLink)} ${link(compareHref(view.key, null, ""), DASHBOARD_TEXT.compare.title(view.key))}</p>`,
    p(text.intro),
    p(text.lensOfRun),
    p(DASHBOARD_TEXT.sources),
    p(DASHBOARD_TEXT.derived),
    ...view.problems.map((problem) => p(problem, "problem")),
    h(2, "Runs"),
  ];
  if (view.runs.length === 0) body.push(p(text.noRuns));
  else {
    body.push(
      p(text.quickIntro),
      table(
        [
          "Run directory",
          "Run",
          "Case",
          "Zoom",
          "Focus",
          "Stop semi-diameter (mm)",
          "Object",
          "Image plane",
          "Lines",
          "Compared",
          "MTF requests",
        ],
        view.runs.map((each) => [
          link(runHref(each.suite), each.suite),
          escapeHtml(each.run),
          `${shortId(each.caseId)}${each.problems.length === 0 ? "" : `<br>${problemsCell(each.problems)}`}`,
          ...conditionCells(each.condition),
          each.comparisons === "ok" ? "yes" : each.comparisons === "none" ? "no" : '<span class="muted">—</span>',
          each.requests.length === 0
            ? `<span class="muted">${escapeHtml(text.noMtf)}</span>`
            : each.requests
                .map((request) =>
                  request.quick === null
                    ? escapeHtml(request.rung)
                    : link(`${lensHref(view.key)}?${request.quick}`, request.rung),
                )
                .join(", "),
        ]),
      ),
    );
  }

  body.push(h(2, "Choose curves"), p(text.pickerIntro), p(text.pickerHow));
  const { picker } = view;
  const group = (legend: string, boxes: readonly string[]): string =>
    `<fieldset><legend>${escapeHtml(legend)}</legend>${boxes.join(" ") || '<span class="muted">—</span>'}</fieldset>`;
  const references = [
    '<option value="">none</option>',
    ...view.curves.map(
      (curve) =>
        `<option value="${escapeHtml(curve.id)}"${curve.reference ? " selected" : ""}>${escapeHtml(DASHBOARD_TEXT.lens.legendCurve(count(curve.curve), curveName(curve)))}</option>`,
    ),
  ];
  body.push(
    [
      `<form method="get" action="${escapeHtml(lensHref(view.key))}">`,
      group(
        "Runs",
        picker.runs.map((option) => checkbox("run", option.id, escapeHtml(option.label), option.chosen)),
      ),
      group(
        "Rungs",
        picker.rungs.map((option) => checkbox("rung", option.id, escapeHtml(option.label), option.chosen)),
      ),
      group(
        "Engines",
        picker.engines.map((option) => checkbox("engine", option.id, escapeHtml(option.label), option.chosen)),
      ),
      group(
        "Fields",
        picker.fields.map((option) =>
          checkbox("field", option.id, `${escapeHtml(option.kind)} ${plainFigure(option.field)}`, option.chosen),
        ),
      ),
      group(
        "Cuts",
        picker.cuts.map((option) => checkbox("cut", option.id, escapeHtml(option.label), option.chosen)),
      ),
      `<label>Reference <select name="ref">${references.join("")}</select></label>`,
      '<button type="submit">Draw</button>',
      "</form>",
    ].join("\n"),
    ...view.notes.map((note) => p(note, "problem")),
  );

  if (view.curves.length > 0) {
    body.push(
      h(2, "Curves"),
      p(text.overlayIntro),
      chartFigure(renderLensOverlay(view.key, view.curves), ""),
      p(text.curves),
      table(
        ["Curve", "Run directory", "Run", "Rung", "Engine", "Field", "Cut", "State", "Reference"],
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
    body.push(h(2, "Differences"));
    if (view.reference !== null) body.push(p(text.reference(count(view.reference.curve))));
    if (view.referenceNote !== null) body.push(p(view.referenceNote));
    if (view.within !== null) {
      const { within } = view;
      body.push(
        h(3, "Within the reference's request"),
        p(text.withinIntro),
        ...(within.section === null
          ? []
          : [
              `<p>${escapeHtml(text.withinSection)} ${link(sectionHref(within.section.suite, within.section.section), `${within.section.suite}, section ${count(within.section.section)}`)}</p>`,
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
        h(3, "Differences that no comparison judges"),
        p(text.otherIntro),
        chartFigure(renderLensOther(view.key, view.other, view.reference.curve), otherCaption(view.other)),
      );
    }
    body.push(...view.unresolved.map((sentence) => p(sentence, "muted")));
  }

  body.push(h(2, "Run this lens"), p(text.runIntro), p(text.runHeavy, "problem"));
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
  return page(`Lens ${view.key}`, `/api${lensHref(view.key)}${query === "" ? "" : `?${query}`}`, body);
}

// ── The "LV vs optiland" pages (Stage 8.5) ───────────────────────────────────────────────────────────────────────

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
            .map((pair) => fill(text.gatedPair, [escapeHtml(pair.a), escapeHtml(pair.b), verdict(pair.verdict)]))
            .join("<br>");
    const largest =
      line.headline !== null
        ? fill(text.gatedLargest, [
            code(line.headline.metric),
            figure(line.headline.value),
            escapeHtml(line.headline.a),
            escapeHtml(line.headline.b),
          ])
        : line.unmeasured !== null
          ? fill(text.gatedUnmeasured, [code(line.unmeasured)])
          : '<span class="muted">—</span>';
    const gate = line.headline?.gate ?? null;
    return [escapeHtml(line.rung), pairs, largest, gate === null ? '<span class="muted">—</span>' : figure(gate)];
  });
  const out = [table([text.columnRung, text.columnPairs, text.columnLargest, text.columnGate], rows)];
  const runs = [...new Set(lines.flatMap((line) => (line.source.kind === "runs" ? line.source.suites : [])))];
  const stems = [...new Set(lines.flatMap((line) => (line.source.kind === "baselines" ? line.source.stems : [])))];
  if (runs.length > 0) out.push(p(text.gatedFromRuns(runs.join(", ")), "muted"));
  if (stems.length > 0) out.push(p(text.gatedFromBaselines(stems.join(", ")), "muted"));
  for (const line of lines) if (line.pairs.length === 0) out.push(p(text.gatedNone(line.rung), "muted"));
  return out;
}

/** A figure of a recorded line, against its band, its limit of the sorting, or no band. */
function recordedMetric(metric: RecordedLine["metrics"][number]): string {
  const text = DASHBOARD_TEXT.compare;
  const value = withUnit(metric.value, metric.unit);
  if (metric.limit !== null) return fill(text.metricLimit, [code(metric.name), value, figure(metric.limit)]);
  if (metric.band !== null) return fill(text.metricBand, [code(metric.name), value, figure(metric.band)]);
  return fill(text.metricNoBand, [code(metric.name), value]);
}

/** The recorded lines of a card as a table, and below it each line's notes, sources and (on a tab's page) details. */
function recordedTable(view: CompareView, lines: readonly RecordedLine[]): string[] {
  const text = DASHBOARD_TEXT.compare;
  if (lines.length === 0) return [];
  const none = '<span class="muted">—</span>';
  const rows = lines.map((line) => [
    escapeHtml(line.rung),
    escapeHtml(line.label ?? "—"),
    fill(text.pairText, [escapeHtml(line.a), escapeHtml(line.b)]),
    verdict(line.verdict),
    line.metrics.map(recordedMetric).join("<br>") || none,
    line.counts.map((each) => fill(text.countText, [code(each.name), figure(each.value)])).join("<br>") || none,
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
      : [`<li>${escapeHtml(text.lineNote(line.rung, line.label ?? "", line.reason))}</li>`]),
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
      out.push(h(3, text.detailHeading(line.rung, line.label ?? "", line.a, line.b)), ...detailBlock(view, line));
    }
  }
  return out;
}

/** The elements a comparison sets aside, each where its chart's axis has it, with the figure's source on hover. */
function setAsideBlock(asides: readonly SetAsideElement[]): string[] {
  const text = DASHBOARD_TEXT.compare;
  return asides.map((aside) => {
    const at = aside.at === null ? escapeHtml(text.setAsideAt(String(aside.element))) : plainFigure(aside.at.value);
    return `<p class="muted">${fill(text.setAside, [at, escapeHtml(aside.class), escapeHtml(aside.reason)])}</p>`;
  });
}

/** A table of recorded values of both answers, with their differences and bands. */
function valuesTableBlock(view: ValuesTableView): string {
  const text = DASHBOARD_TEXT.compare;
  return table(
    [text.columnLine, text.columnValue, view.a, view.b, text.columnDifference, text.columnBand],
    view.rows.map((row) => [
      escapeHtml(row.group ?? ""),
      code(row.name),
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
  const subject = `${view.key}, ${line.source.kind === "run" ? line.source.run : line.source.stem}, ${line.rung}`;
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
    value === null ? `<span class="muted">${escapeHtml(text.none)}</span>` : verdict(value);
  const verdicts = fill(text.cardVerdicts, [verdictText(card.gatedVerdict), verdictText(card.recordedVerdict)]);
  const out = [
    '<section class="card">',
    `<h2>${escapeHtml(card.title)} <span class="badges">${verdicts}</span></h2>`,
    h(3, text.gatedHeading),
    ...gatedTable(card.gated),
  ];
  if (card.recorded.length + card.notCompared.length > 0) {
    out.push(h(3, text.recordedHeading));
    if (card.tab === "vignetting") out.push(p(text.flux, "muted"));
    out.push(...recordedTable(view, card.recorded));
    out.push(...card.notCompared.map((rung) => p(text.notCompared(rung), "muted")));
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
    `<details><summary>${escapeHtml(text.howToRead)}</summary>`,
    p(text.intro),
    p(text.recordedMeaning),
    p(text.chipsIntro),
    p(text.chipsMuted),
    p(DASHBOARD_TEXT.sources),
    p(DASHBOARD_TEXT.derived),
    "</details>",
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
  body.push(p(text.runTabsHint, "muted"), `<p>${link(lensHref(view.key), `Lens ${view.key}`)}</p>`);
  body.push(h(2, "Run this lens"), p(DASHBOARD_TEXT.lens.runIntro), p(DASHBOARD_TEXT.lens.runHeavy, "problem"));
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
  const cell = (verdictOf: Verdict | null): string =>
    verdictOf === null ? `<span class="muted">${escapeHtml(text.none)}</span>` : verdict(verdictOf);
  out.push(
    table(
      ["Lens", "Name", ...tabs],
      view.compared.map((lens) => [
        link(compareHref(lens.key, null, ""), lens.key),
        lens.name === null ? "—" : escapeHtml(lens.name),
        ...lens.cards.map((card) => fill(text.indexCell, [cell(card.gated), cell(card.recorded)])),
      ]),
    ),
  );
  return out;
}
