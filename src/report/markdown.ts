// The Markdown of a report: a pure layout of the report model, so the same model always gives the same bytes.
import { METRIC_DIGITS, numberText, whereText } from "../compare/metricText.ts";
import { COMPARISON_MODES, VERDICTS } from "../contract/comparison.ts";
import type { ComparisonMetric } from "../contract/comparison.ts";
import { formatFixed, formatSci } from "../core/numeric/format.ts";
import type { MetricColumn, ReportModel, ReportSection, SupportCell } from "./model.ts";

/** What an empty cell holds: a place where there is nothing to say, as opposed to a value that is missing. */
const NOTHING = "—";

/** How many significant digits a recorded value has: enough to set two engines' values side by side by eye. */
export const RECORDED_DIGITS = 9;

/**
 * A text as the content of one table cell: a backslash and a `|` are escaped with a backslash, and every line
 * break (CR LF, LF or CR) becomes `<br>`, so the text can neither end its cell nor its row. Nothing else is
 * changed.
 */
export function escapeCell(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replace(/\r\n|\n|\r/g, "<br>");
}

/** One table: a header row, the separator and the rows, with every cell escaped. */
function table(header: readonly string[], rows: readonly (readonly string[])[]): string[] {
  const line = (cells: readonly string[]): string => `| ${cells.map(escapeCell).join(" | ")} |`;
  return [line(header), `|${header.map(() => "---").join("|")}|`, ...rows.map(line)];
}

function count(value: number): string {
  return formatFixed(value, 0);
}

/** A metric's value and where it occurs; "not finite" for a value that is null. */
function metricText(metric: ComparisonMetric): string {
  const value = metric.value === null ? "not finite" : numberText(metric.value);
  return `${value}${whereText(metric.where)}`;
}

/** The heading of a metric column: the name, with its limit and a unit other than 1. */
function columnText(column: MetricColumn): string {
  const unit = column.unit === null || column.unit === "1" ? "" : ` ${column.unit}`;
  if (column.limit === undefined) return unit === "" ? column.name : `${column.name} [${unit.trim()}]`;
  const sign = column.limitKind === "attention" ? "band" : "≤";
  return `${column.name} (${sign} ${numberText(column.limit)}${unit})`;
}

function supportText(cell: SupportCell): string {
  if (cell.status === "not-run") return NOTHING;
  return cell.detail === undefined ? cell.status : `${cell.status}: ${cell.detail}`;
}

function sectionLines(section: ReportSection): string[] {
  const heading = section.request === null ? section.rung : `${section.rung}, ${section.request}`;
  const judged =
    section.mode === null || section.class === null
      ? "the policy has no entry for this rung"
      : `compared ${section.mode}, ${section.class}`;
  const lines = [
    `#### ${heading}`,
    "",
    `Quantity \`${section.quantity}\`, ${judged}. Request \`${section.requestId}\`.`,
  ];

  if (section.referenceVsEach !== null) {
    const { reference, rows } = section.referenceVsEach;
    lines.push("", `Reference vs each, against \`${reference}\`:`, "");
    const header = ["Engine", ...section.columns.map(columnText), "Verdict", "Note"];
    const body = rows.map((row) => [
      row.engine,
      ...row.metrics.map((metric) => (metric === null ? NOTHING : metricText(metric))),
      row.verdict,
      row.reason ?? "",
    ]);
    lines.push(...(rows.length === 0 ? ["No other engine was compared."] : table(header, body)));
  }
  if (section.pairwise !== null) {
    const { engines, cells } = section.pairwise;
    lines.push(
      "",
      "Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:",
      "",
    );
    const body = engines.map((engine, row) => [
      engine,
      ...cells[row].map((cell) => {
        if (cell === null) return NOTHING;
        return cell.worst === null ? cell.verdict : `${cell.verdict} (${cell.worst.name} ${metricText(cell.worst)})`;
      }),
    ]);
    lines.push(...table(["Engine", ...engines], body));
  }
  if (section.recorded !== null) {
    const { engines, rows } = section.recorded;
    lines.push("", "Recorded values, as each engine reports them. They are listed and never judged:", "");
    const body = rows.map((row) => [
      `${row.name}[${count(row.index)}]`,
      ...row.cells.map((cell) => {
        if (cell === null) return NOTHING;
        return cell.value === null ? "not finite" : formatSci(cell.value, RECORDED_DIGITS);
      }),
    ]);
    lines.push(...table(["Value", ...engines], body));
  }
  return lines;
}

const HOW_TO_READ: readonly string[] = [
  "## How to read this",
  "",
  "Each pair of engines that answered one request gets one verdict.",
  "",
  ...table(
    ["Verdict", "Meaning"],
    [
      ["PASS", "A gated rung: every judged metric is at or below its tolerance."],
      ["FAIL", "A gated rung: a judged metric is above its tolerance, or is not a number."],
      ["RECORDED", "A recorded rung: the difference is written down. It is not a failure."],
      [
        "ATTENTION",
        "A recorded rung: a metric is outside its attention band. It is worth a look and is not a failure.",
      ],
      ["UNSUPPORTED", "One of the two engines cannot answer the request. That is an answer, not a failure."],
      [
        "BLOCKED",
        "Both engines answered and the pair is not judged: an earlier rung, on which this one rests, failed for the " +
          "same two engines on the same case. The failure is that rung's, and the note names it.",
      ],
      ["ERROR", "One of the two engines gave no result, or the two results cannot be compared."],
    ],
  ),
  "",
  "Only FAIL and ERROR fail a comparison. RECORDED and ATTENTION are not failures: a recorded rung compares",
  "methods that are expected to differ, and its numbers are kept to be read, not to be gated. BLOCKED is not a",
  "second failure: two engines that built different systems would differ in every rung after that one.",
  "",
  "A limit is shown in the heading of its metric: `≤` is the tolerance of a gated rung and `band` the attention",
  `band of a recorded one. Numbers have ${METRIC_DIGITS} significant digits, and a whole number, such as a count, is written in full.`,
  `A recorded value has ${RECORDED_DIGITS} significant digits and is named with the index of its element. \`${NOTHING}\` marks a place with`,
  "nothing to compare, and `not finite` a number that is a NaN or an infinity. The reference-vs-each table and the",
  "pairwise matrix judge a pair alike, so a pair that is in both has the same verdict in both.",
];

/**
 * The report as Markdown. A pure function of the model: equal models give equal text, with LF line endings and
 * one newline at the end. Every number goes through `src/core/numeric/format.ts`, and every text placed in a table
 * goes through `escapeCell`.
 *
 * The sections, in order: the title and the inputs (suite, contract version, policy version, engines with their
 * fingerprints, runs); the verdict summary; the support matrix; for each run and rung the reference-vs-each table,
 * the pairwise matrix and the values the answers only record; and how to read the verdicts.
 */
export function renderMarkdown(model: ReportModel): string {
  const lines: string[] = [`# Comparison report: ${model.suite.name}`, "", "## Inputs", ""];
  lines.push(
    ...table(
      ["Input", "Value"],
      [
        ["Suite", model.suite.name],
        ["Suite hash", model.suite.hash],
        ["Contract version", model.contract],
        ["Policy", `rungs v${count(model.policy.version)}`],
        ["Policy hash", model.policy.hash],
      ],
    ),
    "",
    "### Engines",
    "",
  );
  const engineRows = model.engines.map((engine) =>
    engine.status === "available"
      ? [engine.id, "available", engine.version, engine.fingerprint]
      : [engine.id, `unavailable: ${engine.code}`, NOTHING, NOTHING],
  );
  lines.push(
    ...(engineRows.length === 0
      ? ["No engine was run."]
      : table(["Engine", "Status", "Version", "Fingerprint"], engineRows)),
  );
  lines.push("", "### Runs", "");
  const runRows = model.runs.map((run) => [
    run.name,
    run.caseId ?? NOTHING,
    run.problems.length === 0 ? "run" : `not started: ${run.problems.join("; ")}`,
  ]);
  lines.push(...table(["Run", "Case", "Status"], runRows));

  lines.push("", "## Verdict summary", "");
  const pairs = model.summary.reduce(
    (total, { counts }) => total + VERDICTS.reduce((sum, verdict) => sum + counts[verdict], 0),
    0,
  );
  lines.push(
    model.failing === 0
      ? `No pair is FAIL or ERROR, of ${count(pairs)} compared.`
      : `${count(model.failing)} of ${count(pairs)} pairs are FAIL or ERROR.`,
    "",
  );
  const countsOf = (mode: string, verdict: (typeof VERDICTS)[number]): string =>
    count(model.summary.find((entry) => entry.mode === mode)?.counts[verdict] ?? 0);
  lines.push(
    ...table(
      ["Verdict", ...COMPARISON_MODES],
      VERDICTS.map((verdict) => [verdict, ...COMPARISON_MODES.map((mode) => countsOf(mode, verdict))]),
    ),
  );

  lines.push("", "## Support matrix", "");
  const engineIds = model.engines.map((engine) => engine.id);
  const supportRows = model.support.map((row) => [
    row.run,
    row.request === null ? row.rung : `${row.rung}, ${row.request}`,
    ...row.cells.map(supportText),
  ]);
  lines.push(
    ...(supportRows.length === 0
      ? ["No engine was asked anything."]
      : table(["Run", "Rung", ...engineIds], supportRows)),
  );

  lines.push("", "## Results");
  if (model.sections.length === 0) lines.push("", "Nothing was compared.");
  let run: string | undefined;
  for (const section of model.sections) {
    if (section.run !== run) lines.push("", `### ${section.run}`);
    run = section.run;
    lines.push("", ...sectionLines(section));
  }
  lines.push("", ...HOW_TO_READ);
  return `${lines.join("\n")}\n`;
}
