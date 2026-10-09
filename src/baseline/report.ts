// The report of a baseline: what is committed beside it under `reports/<suite>/`. It is rendered from the baseline
// alone, never from a live run, so that it can be made anew, byte for byte, with no engine at hand.
import { numberText, whereText } from "../compare/metricText.ts";
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
import { baselineText } from "./build.ts";

/** The names of a baseline's two report files, inside `reports/<suite>/`. */
export const BASELINE_REPORT_JSON = "rays.json";
export const BASELINE_REPORT_MARKDOWN = "rays.md";

/** The statuses of a support cell, in the order they are counted. */
const STATUSES: readonly ParticipantStatus[] = ["ok", "unsupported", "error", "pending", "missing"];

/** A metric of a pair over every run of a rung: the baseline's metric and the run its worst value occurs in. */
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

/** The report of one baseline. */
export interface BaselineReport {
  readonly contract: string;
  readonly kind: "baseline-report";
  /** The SHA-256 of the baseline file the report was rendered from. */
  readonly baseline: string;
  readonly suite: Baseline["suite"];
  readonly policy: Baseline["policy"];
  readonly engines: readonly BaselineEngine[];
  readonly runs: readonly { readonly name: string; readonly caseId: string }[];
  readonly rungs: readonly ReportRung[];
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
  for (const { name, unit, value, tolerance } of pair.metrics) {
    if (tolerance === undefined) continue;
    const ratio = value === null || tolerance === 0 ? null : value / tolerance;
    const figure: WorstFigure = { name, unit, value, tolerance, ratio };
    if (worst === undefined || rank(figure) > rank(worst)) worst = figure;
  }
  return worst;
}

/** Takes the metric of one run into the worst over the runs: a count is added, any other kept when it is larger. */
function takeWorst(into: Map<string, WorstMetric>, metric: BaselineMetric, run: string): void {
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
 * figure. A pure function of the baseline.
 */
export function buildBaselineReport(baseline: Baseline): BaselineReport {
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

  return {
    contract: CONTRACT_VERSION,
    kind: "baseline-report",
    baseline: sha256Hex(baselineText(baseline)),
    suite: baseline.suite,
    policy: baseline.policy,
    engines: baseline.engines,
    runs: baseline.runs.map(({ name, caseId }) => ({ name, caseId })),
    rungs,
  };
}

function table(header: readonly string[], rows: readonly (readonly string[])[]): string[] {
  const line = (cells: readonly string[]): string => `| ${cells.map(escapeCell).join(" | ")} |`;
  return [line(header), `|${header.map(() => "---").join("|")}|`, ...rows.map(line)];
}

function count(value: number): string {
  return formatFixed(value, 0);
}

function verdictText(verdicts: readonly BaselineVerdictCount[]): string {
  return verdicts.map(({ verdict, count: pairs }) => `${count(pairs)} ${verdict}`).join(", ") || "—";
}

function metricHeading(metric: BaselineMetric): string {
  const unit = metric.unit === "1" ? "" : ` ${metric.unit}`;
  if (metric.tolerance === undefined) return unit === "" ? metric.name : `${metric.name} [${unit.trim()}]`;
  return `${metric.name} (≤ ${numberText(metric.tolerance)}${unit})`;
}

function valueText(value: number | null): string {
  return value === null ? "not finite" : numberText(value);
}

function detailText(details: BaselineEngine["details"]): string {
  const said = Object.keys(details)
    .sort()
    .map((key) => `${key} ${String(details[key])}`);
  return said.join(", ") || "—";
}

function worstText(verdict: Verdict, worst: WorstFigure | undefined): string {
  if (worst === undefined) return verdict;
  const unit = worst.unit === "1" ? "" : ` ${worst.unit}`;
  return `${verdict}: ${worst.name} ${valueText(worst.value)}${worst.value === null ? "" : unit}`;
}

/**
 * The report as Markdown. A pure function of the report: equal reports give equal text, with LF line endings and
 * one newline at the end.
 *
 * The sections, in order: the inputs (suite, policy, each engine with its hashes and what it says of itself, each
 * run with the hash of its case); the summary, with for each rung the pairs of engines by verdict; the support
 * matrix; and for each rung the worst of every metric of every pair over the suite, then a row per run with each
 * pair's verdict and worst figure and how the rays of each engine ended.
 */
export function renderBaselineMarkdown(report: BaselineReport): string {
  const lines: string[] = [
    `# Baseline of ${report.suite.name}`,
    "",
    "What the engines below agreed on, rung by rung, as the committed baseline of the suite records it: for every",
    "run as it was run (a zoom at each end) and every pair of engines the verdict and the largest value of each",
    "metric over the requests of the run (its fields and lines). A metric counted in rays or elements is added up.",
    "This file is rendered from the baseline alone (`lvrtc verify` makes it anew and fails on a byte of difference):",
    "it holds results, counts, names and hashes, and nothing an engine traced. The hash of a run's case says what",
    "its figures are of; `lvrtc baseline check` says whether the case and the engines are still those.",
    "",
    "FLOOR is a pass that is counted apart: a metric above its tolerance by the known numerical floor of one engine,",
    "which is within the policy's floor limit of the arbiter while no other engine sides with it against the arbiter.",
    "",
    "## Inputs",
    "",
    ...table(
      ["Input", "Value"],
      [
        ["Suite", report.suite.name],
        ["Suite hash", report.suite.hash],
        ["Baseline hash", report.baseline],
        ["Contract version", report.contract],
        ["Policy", `rungs v${count(report.policy.version)}`],
        ["Policy hash", report.policy.hash],
      ],
    ),
    "",
    ...table(
      ["Engine", "Version", "Fingerprint", "Adapter revision", "Taken at"],
      report.engines.map(({ id, version, fingerprint, adapterRevision, details }) => [
        id,
        version,
        fingerprint,
        adapterRevision ?? "—",
        detailText(details),
      ]),
    ),
    "",
    ...table(
      ["Run", "Case"],
      report.runs.map((run) => [run.name, run.caseId]),
    ),
    "",
    "## Summary",
    "",
    ...table(
      ["Rung", "Quantity", "Runs", "Requests", "Pair", "Runs by verdict", "Requests by verdict"],
      report.rungs.flatMap((rung) =>
        rung.pairs.map((pair) => [
          rung.rung,
          rung.quantity,
          count(rung.runs),
          count(rung.requests),
          `${pair.a} – ${pair.b}`,
          verdictText(pair.runs),
          verdictText(pair.verdicts),
        ]),
      ),
    ),
    "",
    "## Support",
    "",
    "In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),",
    "with the code and the item it names; that is an answer and not a failure.",
    "",
    ...table(
      ["Rung", "Engine", "Runs by status"],
      report.rungs.flatMap((rung) =>
        rung.support.map(({ engine, statuses }) => [
          rung.rung,
          engine,
          statuses
            .map(
              ({ status, runs, details }) =>
                `${count(runs)} ${status}${details === undefined ? "" : ` (${details.join("; ")})`}`,
            )
            .join(", "),
        ]),
      ),
    ),
  ];
  for (const rung of report.rungs) {
    lines.push(
      "",
      `## ${rung.rung}`,
      "",
      `Quantity \`${rung.quantity}\`. The worst of every metric over the suite:`,
      "",
    );
    lines.push(
      ...table(
        ["Pair", "Metric", "Worst, or total", "Run", "Where"],
        rung.pairs.flatMap((pair) =>
          pair.metrics.map((metric) => [
            `${pair.a} – ${pair.b}`,
            metricHeading(metric),
            valueText(metric.value),
            metric.run ?? "—",
            whereText(metric.where).replace(/^ at /, "") || "—",
          ]),
        ),
      ),
    );
    const pairNames = rung.pairs.map((pair) => [pair.a, pair.b] as const);
    const rayEngines = [...new Set(rung.rows.flatMap((row) => (row.rays ?? []).map((rays) => rays.engine)))].sort();
    lines.push(
      "",
      "By run, each pair with its verdict and the judged metric that is largest against its tolerance:",
      "",
      ...table(
        [
          "Run",
          "Requests",
          ...pairNames.map(([a, b]) => `${a} – ${b}`),
          ...rayEngines.map((engine) => `${engine} rays ok / blocked / failed`),
        ],
        rung.rows.map((row) => [
          row.run,
          count(row.requests),
          ...pairNames.map(([a, b]) => {
            const pair = row.pairs.find((each) => each.a === a && each.b === b);
            return pair === undefined ? "—" : worstText(pair.verdict, pair.worst);
          }),
          ...rayEngines.map((engine) => {
            const rays = row.rays?.find((each) => each.engine === engine);
            return rays === undefined ? "—" : [rays.ok, rays.blocked, rays.failed].map(count).join(" / ");
          }),
        ]),
      ),
    );
  }
  return `${lines.join("\n")}\n`;
}

/**
 * The report of a baseline as the texts of its two files: the report (`buildBaselineReport`) as canonical JSON and
 * a newline, and `renderBaselineMarkdown` of it. A pure function: equal baselines give equal texts, byte for byte.
 */
export function renderBaselineReport(baseline: Baseline): { json: string; markdown: string } {
  const report = buildBaselineReport(baseline);
  return { json: `${canonicalJson(report)}\n`, markdown: renderBaselineMarkdown(report) };
}
