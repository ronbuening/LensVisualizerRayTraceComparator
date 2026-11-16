// The report of a baseline: what is committed beside it under `reports/<suite>/`. It is rendered from the baseline
// alone, never from a live run, so that it can be made anew, byte for byte, with no engine at hand.
import { numberText } from "../compare/metricText.ts";
import { VERDICTS } from "../contract/comparison.ts";
import type { ParticipantStatus, Verdict } from "../contract/comparison.ts";
import type {
  Baseline,
  BaselineEngine,
  BaselineMetric,
  BaselinePair,
  BaselineVerdictCount,
} from "../contract/baseline.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { formatFixed } from "../core/numeric/format.ts";
import { sha256Hex } from "../core/numeric/hash.ts";
import { COUNT_UNITS } from "../report/floor.ts";
import { escapeCell } from "../report/markdown.ts";
import { checkName, figureName, placeText, quantityName, unitName } from "../report/names.ts";
import { CATALOG_LABELS, CATALOG_TEXT, HOW_TO_READ_TEXT, REPORT_TEXT } from "../report/wording.ts";
import {
  ENGINE_DETAIL_TEXT,
  FIELD_ANGLE_QUANTITIES,
  FIELD_FRACTION_QUANTITIES,
  FIELD_TEXT,
  IDENTIFYING_DETAILS,
  SORTING_LIMITS,
  PLACE_MEANING,
  RAY_OUTCOME_TEXT,
  SUPPORT_STATUS_TEXT,
  VERDICT_TEXT,
  checkOf,
  classLabel,
  engineName,
  engineOf,
  runNameParts,
  valueLabel,
  verdictShort,
} from "../vocabulary/index.ts";
import { baselineText } from "./build.ts";
import { SNAPSHOT_BASELINE_SUITES } from "../compare/policyFile.ts";
import { LEGACY_IDS, currentIds } from "../core/legacyIds.ts";
import type { LegacyMaps } from "../core/legacyIds.ts";

/** The names of a baseline's two report files, inside `reports/<suite>/`. */
export const BASELINE_REPORT_JSON = "rays.json";
export const BASELINE_REPORT_MARKDOWN = "rays.md";

/** The statuses of a support cell, in the order they are counted. */
const STATUSES: readonly ParticipantStatus[] = ["ok", "unsupported", "error", "pending", "missing"];

/**
 * A metric of a pair over every run of a rung: the baseline's metric and the run its worst value occurs in. Its
 * `measured`, where the baseline states one, is added up over the runs.
 */
export type WorstMetric = BaselineMetric & { readonly run?: string };

/**
 * The worst figure of a pair in one run: the judged metric that is largest against its tolerance. `ratio` is the
 * value over the tolerance; null for a metric judged at 0, which is at its tolerance or beyond it.
 */
export interface WorstFigure {
  readonly name: string;
  readonly unit: string;
  readonly value: number | null;
  readonly tolerance: number;
  readonly ratio: number | null;
  /** In how many requests of the run the metric was measured, where the baseline says. */
  readonly measured?: number;
}

/** One pair of engines in one rung, over every run. */
export interface ReportPair {
  readonly a: string;
  readonly b: string;
  /** How many requests came to each verdict, over every run. */
  readonly verdicts: readonly BaselineVerdictCount[];
  /** How many runs came to each verdict, a run's verdict being the gravest of its requests. */
  readonly runs: readonly BaselineVerdictCount[];
  readonly metrics: readonly WorstMetric[];
}

/** One run of one rung: what each pair came to, and how the rays of each engine ended. */
export interface ReportRow {
  readonly run: string;
  readonly requests: number;
  readonly pairs: readonly {
    readonly a: string;
    readonly b: string;
    readonly verdict: Verdict;
    readonly worst?: WorstFigure;
  }[];
  readonly rays?: readonly {
    readonly engine: string;
    readonly ok: number;
    readonly blocked: number;
    readonly failed: number;
  }[];
}

/** One rung over every run. */
export interface ReportRung {
  readonly rung: string;
  readonly quantity: string;
  /** How many runs have the rung, and how many requests those have together. */
  readonly runs: number;
  readonly requests: number;
  /** For each engine, in how many runs its jobs ended in each way; the detail of each way that is not "ok". */
  readonly support: readonly {
    readonly engine: string;
    readonly statuses: readonly {
      readonly status: ParticipantStatus;
      readonly runs: number;
      readonly details?: readonly string[];
    }[];
  }[];
  readonly pairs: readonly ReportPair[];
  readonly rows: readonly ReportRow[];
}

/**
 * One classified failing figure of a pair that fails as a list of known failures lists it, in a baseline other than
 * the catalog's (whose failures the catalog statistics list): where it is, its class, the entry of docs/gotchas.md
 * that explains it and the command that reproduces it in one run.
 */
export interface ReportFailure {
  readonly run: string;
  readonly rung: string;
  readonly a: string;
  readonly b: string;
  readonly metric: string;
  readonly class: string;
  readonly gotcha: string;
  readonly reproducer: string;
}

/** The report of one baseline. */
export interface BaselineReport {
  readonly contract: string;
  readonly kind: "baseline-report";
  /** The SHA-256 of the baseline file the report was rendered from. */
  readonly baseline: string;
  readonly suite: Baseline["suite"];
  readonly policy: Baseline["policy"];
  readonly engines: readonly BaselineEngine[];
  readonly runs: readonly Pick<Baseline["runs"][number], "name" | "caseId" | "problems">[];
  readonly rungs: readonly ReportRung[];
  /** The listed failures of a suite other than the catalog, where it has any (`ReportFailure`). */
  readonly failures?: readonly ReportFailure[];
}

function counted(verdicts: readonly Verdict[]): BaselineVerdictCount[] {
  return VERDICTS.map((verdict) => ({ verdict, count: verdicts.filter((each) => each === verdict).length })).filter(
    ({ count }) => count > 0,
  );
}

/** The judged metric of a pair that is largest against its tolerance; undefined for a pair without one. */
function worstFigure(pair: BaselinePair): WorstFigure | undefined {
  let worst: WorstFigure | undefined;
  // A value that is no number is beyond every tolerance; a metric judged at 0 is at it, or beyond it.
  const rank = (figure: WorstFigure): number =>
    figure.value === null
      ? Infinity
      : figure.tolerance === 0
        ? figure.value > 0
          ? Infinity
          : 0
        : figure.value / figure.tolerance;
  for (const { name, unit, value, tolerance, measured } of pair.metrics) {
    if (tolerance === undefined) continue;
    const ratio = value === null || tolerance === 0 ? null : value / tolerance;
    const figure: WorstFigure = {
      name,
      unit,
      value,
      tolerance,
      ratio,
      ...(measured === undefined ? {} : { measured }),
    };
    if (worst === undefined || rank(figure) > rank(worst)) worst = figure;
  }
  return worst;
}

/** Takes the metric of one run into the worst over the runs: a count is added, any other kept when it is larger. */
function takeWorst(into: Map<string, WorstMetric>, metric: BaselineMetric, run: string): void {
  const before = into.get(metric.name);
  takeWorstValue(into, metric, run);
  const after = into.get(metric.name);
  // In how many requests a metric was measured is a count whatever its unit is.
  if (after !== undefined && (before?.measured !== undefined || metric.measured !== undefined)) {
    into.set(metric.name, { ...after, measured: (before?.measured ?? 0) + (metric.measured ?? 0) });
  }
}

function takeWorstValue(into: Map<string, WorstMetric>, metric: BaselineMetric, run: string): void {
  const known = into.get(metric.name);
  if (known === undefined) {
    const { where, ...plain } = metric;
    const counts = COUNT_UNITS.includes(metric.unit);
    return void into.set(metric.name, counts ? plain : { ...plain, ...(where === undefined ? {} : { where }), run });
  }
  if (known.value === null) return;
  if (COUNT_UNITS.includes(metric.unit)) {
    into.set(metric.name, { ...known, value: metric.value === null ? null : known.value + metric.value });
  } else if (metric.value === null || metric.value > known.value) {
    const { where: _where, run: _run, ...plain } = known;
    into.set(metric.name, {
      ...plain,
      value: metric.value,
      ...(metric.where === undefined ? {} : { where: metric.where }),
      run,
    });
  }
}

/**
 * Builds the report of a baseline: its inputs, and for each rung, in the order the baseline first has it, the
 * support of each engine over the runs, every pair of engines over the runs (verdicts by request and by run, and
 * the worst of each metric with the run it occurs in), and a row per run with each pair's verdict and worst
 * figure. `source` is the baseline as its file holds it, whose hash the report names, where `baseline` is that with
 * its ids of today (`baselineAtCurrentIds`). A pure function of the baseline.
 */
export function buildBaselineReport(baseline: Baseline, source: Baseline = baseline): BaselineReport {
  const order: string[] = [];
  for (const run of baseline.runs) for (const { rung } of run.rungs) if (!order.includes(rung)) order.push(rung);

  const rungs = order.map((id): ReportRung => {
    const entries = baseline.runs.flatMap((run) =>
      run.rungs.filter((rung) => rung.rung === id).map((rung) => ({ run, rung })),
    );
    const engines = [...new Set(entries.flatMap(({ rung }) => rung.support.map((support) => support.engine)))].sort();
    const support = engines.map((engine) => {
      const cells = entries.flatMap(({ rung }) => rung.support.filter((each) => each.engine === engine));
      const statuses = STATUSES.flatMap((status) => {
        const of = cells.filter((cell) => cell.status === status);
        if (of.length === 0) return [];
        const details = [...new Set(of.flatMap((cell) => (cell.detail === undefined ? [] : [cell.detail])))].sort();
        return [{ status, runs: of.length, ...(details.length === 0 ? {} : { details }) }];
      });
      return { engine, statuses };
    });

    const pairKeys = [
      ...new Set(entries.flatMap(({ rung }) => rung.pairs.map((pair) => `${pair.a}\0${pair.b}`))),
    ].sort();
    const pairs = pairKeys.map((key): ReportPair => {
      const [a, b] = key.split("\0");
      const metrics = new Map<string, WorstMetric>();
      const byRequest = new Map<Verdict, number>();
      const byRun: Verdict[] = [];
      for (const { run, rung } of entries) {
        const pair = rung.pairs.find((each) => each.a === a && each.b === b);
        if (pair === undefined) continue;
        byRun.push(pair.verdict);
        for (const { verdict, count } of pair.verdicts) byRequest.set(verdict, (byRequest.get(verdict) ?? 0) + count);
        for (const metric of pair.metrics) takeWorst(metrics, metric, run.name);
      }
      return {
        a,
        b,
        verdicts: VERDICTS.flatMap((verdict) => {
          const count = byRequest.get(verdict);
          return count === undefined ? [] : [{ verdict, count }];
        }),
        runs: counted(byRun),
        metrics: [...metrics.values()],
      };
    });

    const rows = entries.map(({ run, rung }): ReportRow => ({
      run: run.name,
      requests: rung.requests,
      pairs: rung.pairs.map((pair) => {
        const worst = worstFigure(pair);
        return { a: pair.a, b: pair.b, verdict: pair.verdict, ...(worst === undefined ? {} : { worst }) };
      }),
      ...(rung.rays === undefined ? {} : { rays: rung.rays }),
    }));
    return {
      rung: id,
      quantity: entries[0].rung.quantity,
      runs: entries.length,
      requests: entries.reduce((sum, { rung }) => sum + rung.requests, 0),
      support,
      pairs,
      rows,
    };
  });

  // The catalog's failures are listed by the catalog statistics (reports/catalog.md), whose snapshot's reports keep
  // their bytes; another suite's are listed here.
  const failures: ReportFailure[] =
    baseline.suite.name === "catalog"
      ? []
      : baseline.runs.flatMap((run) =>
          run.rungs.flatMap((rung) =>
            rung.pairs.flatMap((pair) =>
              (pair.failures ?? []).map((failure) => ({
                run: run.name,
                rung: rung.rung,
                a: pair.a,
                b: pair.b,
                metric: failure.metric,
                class: failure.class,
                gotcha: failure.gotcha,
                reproducer: failure.reproducer,
              })),
            ),
          ),
        );
  return {
    contract: CONTRACT_VERSION,
    kind: "baseline-report",
    baseline: sha256Hex(baselineText(source)),
    suite: baseline.suite,
    policy: baseline.policy,
    engines: baseline.engines,
    runs: baseline.runs.map(({ name, caseId, problems }) => ({ name, caseId, ...(problems ? { problems } : {}) })),
    rungs,
    ...(failures.length === 0 ? {} : { failures }),
  };
}

/** A Markdown table: a header, the rule under it and a line per row, every cell escaped. */
export function table(header: readonly string[], rows: readonly (readonly string[])[]): string[] {
  const line = (cells: readonly string[]): string => `| ${cells.map(escapeCell).join(" | ")} |`;
  return [line(header), `|${header.map(() => "---").join("|")}|`, ...rows.map(line)];
}

/** A count as text. */
export function count(value: number): string {
  return formatFixed(value, 0);
}

function verdictText(verdicts: readonly BaselineVerdictCount[]): string {
  return verdicts.map(({ verdict, count: pairs }) => `${count(pairs)} ${verdictShort(verdict)}`).join("; ") || "—";
}

/** How another report of a baseline lays out what `renderBaselineMarkdown` writes; the rays report gives none. */
export interface BaselineReportLayout {
  /** The lines above "Inputs", in place of the title and the introduction of the rays report. */
  readonly head?: readonly string[];
  /** True to say, beside every metric, in how many requests it was measured (`WorstMetric.measured`). */
  readonly measured?: boolean;
  /** False for a rung whose runs are not listed one by one. */
  readonly byRun?: (rung: ReportRung) => boolean;
  /** The lines that end the section of a rung. */
  readonly afterRung?: (rung: ReportRung) => readonly string[];
  /** The lines that end the results, before "How to read this". */
  readonly tail?: readonly string[];
  /** The lines that end "How to read this", before "Identifiers". */
  readonly howToRead?: readonly string[];
  /**
   * The legend of the wavelengths by index, where the baseline keeps them (in place of the sentence that it does
   * not), placed after the legend of places.
   */
  readonly wavelengths?: readonly string[];
  /** The review bands and sorting limits of a side-by-side check, by metric, where the baseline keeps them. */
  readonly bands?: (rung: ReportRung) => Readonly<Record<string, number>>;
  /** The places of `where` the layout's own lines name, beside the report's metrics, for the legend of places. */
  readonly places?: readonly { readonly key: string; readonly quantity: string }[];
}

function valueText(value: number | null): string {
  return value === null ? REPORT_TEXT.notFinite : numberText(value);
}

/** A figure's limit as its column shows it: `≤` a limit, a review band, or `—` for none. */
function limitText(metric: BaselineMetric, bands: Readonly<Record<string, number>>): string {
  if (metric.tolerance !== undefined) return REPORT_TEXT.limitAtMost(numberText(metric.tolerance));
  // A sorting limit is the table's to state, which may take another for several wavelengths: none is shown here.
  if (!Object.hasOwn(bands, metric.name) || SORTING_LIMITS.includes(metric.name)) return "—";
  return REPORT_TEXT.reviewBand(numberText(bands[metric.name]));
}

/** What an engine states of itself, in words (`ENGINE_DETAIL_TEXT`), without what identifies its code. */
function detailText(details: BaselineEngine["details"]): string {
  const said = Object.keys(details)
    .sort()
    .filter((key) => !Object.hasOwn(IDENTIFYING_DETAILS, key))
    .map((key) =>
      Object.hasOwn(ENGINE_DETAIL_TEXT, key)
        ? ENGINE_DETAIL_TEXT[key](String(details[key]))
        : `${key} ${String(details[key])}`,
    );
  return said.join(", ") || "—";
}

/** What identifies an engine's code beside its hashes: its commit, the hash of its sources, its distribution. */
function identifyingText(details: BaselineEngine["details"]): string {
  const said = Object.keys(details)
    .sort()
    .filter((key) => Object.hasOwn(IDENTIFYING_DETAILS, key))
    .map((key) => `${IDENTIFYING_DETAILS[key]} ${String(details[key])}`);
  return said.join(", ") || "—";
}

function worstText(verdict: Verdict, worst: WorstFigure | undefined, requests?: number): string {
  // With the requests of the run: in how many of them the figure was measured, and that a pair has none.
  const label = verdictShort(verdict);
  if (worst === undefined) return requests === undefined ? label : `${label}: ${REPORT_TEXT.noJudgedFigure}`;
  const unit = worst.unit === "1" ? "" : ` ${unitName(worst.unit)}`;
  const of =
    requests === undefined || worst.measured === undefined ? "" : ` (${count(worst.measured)} of ${count(requests)})`;
  return `${label}: ${worst.name} ${valueText(worst.value)}${worst.value === null ? "" : unit}${of}`;
}

/** The verdicts a report names, in the order of `VERDICTS`. */
function verdictsOf(report: BaselineReport): Verdict[] {
  const named = new Set(
    report.rungs.flatMap((rung) => [
      ...rung.pairs.flatMap((pair) => [...pair.verdicts, ...pair.runs].map(({ verdict }) => verdict)),
      ...rung.rows.flatMap((row) => row.pairs.map((pair) => pair.verdict)),
    ]),
  );
  return VERDICTS.filter((verdict) => named.has(verdict));
}

/**
 * The "How to read this" section of a report of a baseline: the legend of the verdicts, checks, engines and places
 * the report names and of the forms of its run names, each chosen from the report, so from the baseline alone.
 */
function howToReadLines(report: BaselineReport, layout: BaselineReportLayout): string[] {
  const t = HOW_TO_READ_TEXT;
  const lines = [`## ${t.heading}`, "", `### ${t.verdicts}`, "", ...t.verdictsIntro, ""];
  lines.push(
    ...table(
      t.verdictColumns,
      verdictsOf(report).map((verdict) => [
        VERDICT_TEXT[verdict].label,
        `\`${verdict}\``,
        VERDICT_TEXT[verdict].meaning,
      ]),
    ),
    "",
    `### ${t.checks}`,
    "",
    ...t.checksIntro,
    "",
    ...table(
      t.checkColumns,
      report.rungs.map((rung) => {
        const check = checkOf(rung.rung);
        return [
          check?.title ?? rung.rung,
          `\`${rung.rung}\``,
          check === undefined ? "—" : t.kind[check.kind],
          check === undefined ? "—" : `${check.compares}.`,
        ];
      }),
    ),
    "",
    `### ${t.engines}`,
    "",
    t.enginesIntro,
    "",
    ...table(
      t.engineColumns,
      report.engines.map(({ id }) => [`\`${id}\``, engineOf(id)?.description ?? id]),
    ),
    "",
    `### ${t.figures}`,
    "",
    ...t.figuresIntro,
  );
  if (layout.measured === true) lines.push("", t.measured);
  const rays = report.rungs.some((rung) => rung.rows.some((row) => row.rays !== undefined));
  if (rays) lines.push("", RAY_OUTCOME_TEXT);
  // The classes of the listed failures, as the catalog statistics give them.
  if (report.failures !== undefined) {
    lines.push(
      "",
      CATALOG_LABELS.failuresIntro,
      "",
      ...table(
        CATALOG_LABELS.classColumns,
        [...new Set(report.failures.map((f) => f.class))].sort().map((kind) => [classLabel(kind), `\`${kind}\``]),
      ),
    );
  }
  // The places the report names, each once, with the quantity whose field it is.
  const places = [
    ...report.rungs.flatMap((rung) =>
      rung.pairs.flatMap((pair) =>
        pair.metrics.flatMap((metric) =>
          Object.keys(metric.where ?? {}).map((key) => ({ key, quantity: rung.quantity })),
        ),
      ),
    ),
    ...(layout.places ?? []),
  ];
  const keys = [...new Set(places.map((place) => place.key))].sort();
  if (keys.length > 0) {
    const fieldKinds = new Set(
      places
        .filter((place) => place.key === "field")
        .map((place) =>
          FIELD_ANGLE_QUANTITIES.includes(place.quantity)
            ? "angle"
            : FIELD_FRACTION_QUANTITIES.includes(place.quantity)
              ? "requested"
              : "other",
        ),
    );
    lines.push(
      "",
      `### ${t.places}`,
      "",
      t.placesIntro,
      "",
      ...table(
        t.placeColumns,
        keys.flatMap((key) =>
          key === "field"
            ? (["angle", "requested", "other"] as const)
                .filter((kind) => fieldKinds.has(kind))
                .map((kind) => [`\`field\``, FIELD_TEXT[kind]])
            : [[`\`${key}\``, PLACE_MEANING[key] ?? key]],
        ),
      ),
    );
  }
  if (layout.wavelengths !== undefined && layout.wavelengths.length > 0) lines.push("", ...layout.wavelengths);
  else if (keys.includes("line")) lines.push("", t.noWavelengths);
  const parts = runNameParts(report.runs.map((run) => run.name));
  if (parts.length > 0) {
    lines.push(
      "",
      `### ${t.runNames}`,
      "",
      t.runNamesIntro,
      "",
      ...table(
        t.runNameColumns,
        parts.map((part) => [`\`${part.part}\``, part.meaning]),
      ),
    );
  }
  lines.push(...(layout.howToRead ?? []));
  return lines;
}

/** The "Identifiers" section: the hashes of the suite, the baseline, the limits file, the engines and the runs. */
function identifierLines(report: BaselineReport): string[] {
  const t = HOW_TO_READ_TEXT;
  return [
    `## ${t.identifiers}`,
    "",
    ...t.identifiersIntro,
    "",
    ...table(t.identifierColumns, [
      [t.suiteFile, report.suite.hash],
      [t.baselineFile, report.baseline],
      [t.limitsFile, report.policy.hash],
      [t.contract, report.contract],
    ]),
    "",
    ...table(
      t.engineIdentifierColumns,
      report.engines.map(({ id, fingerprint, adapterRevision, details }) => [
        id,
        fingerprint,
        adapterRevision ?? "—",
        identifyingText(details),
      ]),
    ),
    "",
    ...table(
      t.runIdentifierColumns,
      report.runs.map((run) => [run.name, run.caseId ?? "—"]),
    ),
  ];
}

/**
 * The report as Markdown. A pure function of the report: equal reports give equal text, with LF line endings and
 * one newline at the end. Every sentence is a template of `src/report/wording.ts`.
 *
 * The sections, in order: the inputs (suite, contract, limits file, each engine with what it says of itself); the
 * runs with a problem, if any; the summary, with for each check the pairs of engines by verdict; the support matrix;
 * for each check the worst of every figure of every pair over the suite, then a row per run with each pair's verdict
 * and worst figure and how the rays of each engine ended; the layout's tail; how to read the report; and the
 * identifiers: every hash, of the suite, the baseline, the limits file, the engines and the runs' lens states.
 */
export function renderBaselineMarkdown(report: BaselineReport, layout: BaselineReportLayout = {}): string {
  const r = REPORT_TEXT;
  const floor = verdictsOf(report).includes("FLOOR");
  const lines: string[] = [
    ...(layout.head ?? [`# ${r.raysTitle(report.suite.name)}`, "", ...r.raysIntro(report.suite.name)]),
    ...(floor ? ["", ...r.floor] : []),
    "",
    `## ${r.inputs}`,
    "",
    ...table(r.inputColumns, [
      [r.suite, report.suite.name],
      [r.limitsFile, r.limitsFileVersion(count(report.policy.version))],
    ]),
    "",
    ...table(
      r.engineColumns,
      report.engines.map(({ id, version, details }) => [id, engineName(id), version, detailText(details)]),
    ),
    "",
    ...(report.runs.some((run) => run.problems?.length)
      ? [
          `## ${r.runProblems}`,
          "",
          ...table(
            r.runProblemColumns,
            report.runs.flatMap((run) => (run.problems ?? []).map((problem) => [run.name, problem])),
          ),
          "",
        ]
      : []),
    `## ${r.summary}`,
    "",
    ...table(
      r.summaryColumns,
      report.rungs.flatMap((rung) =>
        rung.pairs.map((pair) => [
          checkName(rung.rung),
          `\`${rung.quantity}\``,
          count(rung.runs),
          count(rung.requests),
          `${pair.a} – ${pair.b}`,
          verdictText(pair.runs),
          verdictText(pair.verdicts),
        ]),
      ),
    ),
    "",
    ...(report.failures === undefined
      ? []
      : [
          `## ${CATALOG_LABELS.failures}`,
          "",
          CATALOG_TEXT.failures,
          "",
          ...table(
            CATALOG_LABELS.failureColumns,
            report.failures.map((f) => [
              f.run,
              checkName(f.rung),
              `${f.a} / ${f.b}`,
              f.metric,
              `${classLabel(f.class)} (\`${f.class}\`)`,
              f.gotcha,
              f.reproducer,
            ]),
          ),
          "",
        ]),
    `## ${r.support}`,
    "",
    ...r.supportIntro,
    "",
    ...table(
      r.supportColumns,
      report.rungs.flatMap((rung) =>
        rung.support.map(({ engine, statuses }) => [
          checkName(rung.rung),
          engine,
          statuses
            .map(
              ({ status, runs, details }) =>
                `${count(runs)} ${valueLabel(SUPPORT_STATUS_TEXT, status)}${details === undefined ? "" : ` (${details.join("; ")})`}`,
            )
            .join(", "),
        ]),
      ),
    ),
  ];
  for (const rung of report.rungs) {
    const check = checkOf(rung.rung);
    lines.push(
      "",
      `## ${checkName(rung.rung)}`,
      "",
      ...(check === undefined
        ? []
        : [r.checkLine(check.compares, HOW_TO_READ_TEXT.kind[check.kind], quantityName(rung.quantity)), ""]),
      r.worstIntro,
      "",
    );
    const measured = layout.measured === true;
    lines.push(
      ...table(
        r.worstColumns(measured),
        rung.pairs.flatMap((pair) =>
          pair.metrics.map((metric) => [
            `${pair.a} – ${pair.b}`,
            figureName(metric.name),
            unitName(metric.unit),
            limitText(metric, layout.bands?.(rung) ?? {}),
            valueText(metric.value),
            ...(measured
              ? [metric.measured === undefined ? "—" : `${count(metric.measured)} of ${count(rung.requests)}`]
              : []),
            metric.run ?? "—",
            placeText(metric.where, rung.quantity) || "—",
          ]),
        ),
      ),
    );
    if (layout.byRun?.(rung) === false) {
      lines.push(...(layout.afterRung?.(rung) ?? []));
      continue;
    }
    const pairNames = rung.pairs.map((pair) => [pair.a, pair.b] as const);
    const rayEngines = [...new Set(rung.rows.flatMap((row) => (row.rays ?? []).map((rays) => rays.engine)))].sort();
    lines.push(
      "",
      r.byRunIntro(measured),
      "",
      ...table(
        [
          r.byRunRun,
          r.byRunRequests,
          ...pairNames.map(([a, b]) => `${a} – ${b}`),
          ...rayEngines.map((engine) => r.rays(engine)),
        ],
        rung.rows.map((row) => [
          row.run,
          count(row.requests),
          ...pairNames.map(([a, b]) => {
            const pair = row.pairs.find((each) => each.a === a && each.b === b);
            return pair === undefined ? "—" : worstText(pair.verdict, pair.worst, measured ? row.requests : undefined);
          }),
          ...rayEngines.map((engine) => {
            const rays = row.rays?.find((each) => each.engine === engine);
            return rays === undefined ? "—" : [rays.ok, rays.blocked, rays.failed].map(count).join(" / ");
          }),
        ]),
      ),
    );
    lines.push(...(layout.afterRung?.(rung) ?? []));
  }
  lines.push(...(layout.tail ?? []));
  lines.push("", ...howToReadLines(report, layout), "", ...identifierLines(report));
  return `${lines.join("\n")}\n`;
}

/**
 * A baseline as a report shows it: with every check and engine under its id of today (`currentIds`), but for a dated
 * snapshot (`SNAPSHOT_BASELINE_SUITES`, the catalog), whose reports keep the ids it was written with until it is
 * refreshed.
 */
export function baselineAtCurrentIds(baseline: Baseline, maps: LegacyMaps = LEGACY_IDS): Baseline {
  return SNAPSHOT_BASELINE_SUITES.includes(baseline.suite.name) ? baseline : currentIds(baseline, maps);
}

/**
 * The report of a baseline as the texts of its two files: the report (`buildBaselineReport`) of it under its ids of
 * today (`baselineAtCurrentIds`) as canonical JSON and a newline, and `renderBaselineMarkdown` of it. A pure function:
 * equal baselines give equal texts, byte for byte.
 */
export function renderBaselineReport(
  baseline: Baseline,
  maps: LegacyMaps = LEGACY_IDS,
): { json: string; markdown: string } {
  const report = buildBaselineReport(baselineAtCurrentIds(baseline, maps), baseline);
  return { json: `${canonicalJson(report)}\n`, markdown: renderBaselineMarkdown(report) };
}
