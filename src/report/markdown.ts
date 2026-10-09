// The Markdown of a report: a pure layout of the report model, so the same model always gives the same bytes.
import { METRIC_DIGITS, numberText, whereText } from "../compare/metricText.ts";
import { COMPARISON_MODES, VERDICTS } from "../contract/comparison.ts";
import type { ComparisonMetric } from "../contract/comparison.ts";
import { formatFixed, formatSci } from "../core/numeric/format.ts";
import type { MtfComparison } from "./mtfComparison.ts";
import type { MetricColumn, ReportModel, ReportSection, SupportCell } from "./model.ts";
import {
  DIFFERENCE_CLASS_TEXT,
  FIELD_REASON_TEXT,
  GEOMETRIC_SAMPLING,
  GEOMETRIC_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  MTF_COMPARISON_OUTRO,
  MTF_ROW_STATUSES,
  MTF_ROW_STATUS_TEXT,
} from "./wording.ts";

/** What an empty cell holds: a place where there is nothing to say, as opposed to a value that is missing. */
const NOTHING = "—";

/** How many significant digits a recorded value has: enough to set two engines' values side by side by eye. */
export const RECORDED_DIGITS = 9;

/** A recorded value as text: a whole number in full, so that a count reads as a count, any other in nine digits. */
function recordedText(value: number): string {
  return Number.isSafeInteger(value) ? formatFixed(value, 0) : formatSci(value, RECORDED_DIGITS);
}

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

/** The heading of a metric column: the name, with its limit, a unit other than 1 and its floor limit, if any. */
function columnText(column: MetricColumn): string {
  const unit = column.unit === null || column.unit === "1" ? "" : ` ${column.unit}`;
  if (column.limit === undefined) return unit === "" ? column.name : `${column.name} [${unit.trim()}]`;
  const sign = column.limitKind === "attention" ? "band" : "≤";
  const floor = column.floorLimit === undefined ? "" : `; floor ≤ ${numberText(column.floorLimit)}`;
  return `${column.name} (${sign} ${numberText(column.limit)}${unit}${floor})`;
}

function supportText(cell: SupportCell): string {
  if (cell.status === "not-run") return NOTHING;
  return cell.detail === undefined ? cell.status : `${cell.status}: ${cell.detail}`;
}

/** How many decimals an MTF value has in a table of them, and a field angle. */
const MTF_DECIMALS = 4;
const ANGLE_DECIMALS = 3;

/** The first words of an MTF comparison, by the MTF it is of. */
const OWN_MTF_HEADING = {
  diffraction: "The engines' own MTF, side by side.",
  geometric: "The engines' own geometric MTF, side by side.",
} as const;

/**
 * The table of an MTF comparison: the fields with what each engine says of them and the class of their
 * difference, then a row for every field, cut and shown frequency. Every sentence is a template of
 * `src/report/wording.ts`.
 */
function mtfComparisonLines(mtf: MtfComparison): string[] {
  const { pair, columns, bands } = mtf;
  const names = columns.map((column) => (column.step === null ? column.engine : `${column.engine} ${column.step}`));
  const judged = columns.flatMap((column, index) => (column.judged ? [names[index]] : []));
  const difference = judged.length === 2 ? `${judged[0]} − ${judged[1]}` : `${pair.a} − ${pair.b}`;
  const bandText = (value: number | null): string => (value === null ? "none" : numberText(value));
  const lines = [
    "",
    `${OWN_MTF_HEADING[mtf.kind]} The difference of a row is ${difference}.`,
    ...MTF_COMPARISON_INTROS[mtf.kind],
    "",
    `Attention bands: ${bandText(bands.onAxis)} on the axis, ${bandText(bands.offAxis)} off it. Two chief rays that land`,
    `more than ${bandText(bands.chiefLandingMm)} mm apart are of two fields.`,
    "",
  ];
  if (pair.verdict === null) lines.push(`\`${pair.a}\` and \`${pair.b}\` were not both asked.`, "");
  else if (pair.verdict === "UNSUPPORTED" || pair.verdict === "ERROR") {
    lines.push(`\`${pair.a}\` against \`${pair.b}\` is ${pair.verdict}: ${pair.reason ?? "no reason was given"}.`, "");
  } else {
    lines.push(
      `Over every frequency of the request \`${pair.a}\` against \`${pair.b}\` is ${pair.verdict}; a row below has the`,
      "status of its own frequency.",
      "",
    );
  }
  // The rim rays are of a method that calibrates its frequency axes with them; a geometric MTF has none.
  const rim = mtf.kind === "diffraction";
  // Of a geometric MTF the two judged columns' own sampling is beside their flags: cells or rays across the pupil,
  // and how far the curves moved between the last two samplings.
  const sampled = mtf.kind === "geometric" ? columns.flatMap((column, index) => (column.judged ? [index] : [])) : [];
  const fieldRows = mtf.fields.map((field) => [
    String(field.field),
    field.fieldAngleDeg === null ? NOTHING : formatFixed(field.fieldAngleDeg, ANGLE_DECIMALS),
    ...field.flags.map((flag) => flag ?? NOTHING),
    ...sampled.flatMap((column) => {
      const { across, lastChange } = field.samplings[column];
      return [across === null ? NOTHING : numberText(across), lastChange === null ? NOTHING : numberText(lastChange)];
    }),
    field.chiefLandingMm === null ? NOTHING : numberText(field.chiefLandingMm),
    ...(rim
      ? [
          field.rimRaysLost === null ? NOTHING : numberText(field.rimRaysLost),
          field.rimLandingSpreadMm === null ? NOTHING : numberText(field.rimLandingSpreadMm),
        ]
      : []),
    field.class ?? NOTHING,
    field.reason === null ? NOTHING : `${field.reason}: ${FIELD_REASON_TEXT[field.reason]}`,
  ]);
  lines.push(
    ...table(
      [
        "Field",
        "Angle [deg]",
        ...names,
        ...sampled.flatMap((column) => [`${names[column]}: across`, `${names[column]}: last change`]),
        "Chief rays apart [mm]",
        ...(rim ? ["Rim rays lost", "Rim rays from chief ray [mm]"] : []),
        "Class",
        "Reason",
      ],
      fieldRows,
    ),
    "",
  );
  if (mtf.kind === "geometric") {
    lines.push(...GEOMETRIC_SAMPLING, "");
    // The second engine of the pair is the one whose curve of several lines is a sum of the worker's.
    if ((mtf.lineCounts[1] ?? 0) > 1) lines.push(...GEOMETRIC_SEVERAL_LINES, "");
  }
  const rows = mtf.rows
    .filter((row) => row.shown)
    .map((row) => [
      String(row.field),
      row.cut,
      String(row.frequencyPerMm),
      ...row.values.map((value) => (value === null ? NOTHING : formatFixed(value, MTF_DECIMALS))),
      row.difference === null ? NOTHING : numberText(row.difference),
      row.status,
      row.class ?? NOTHING,
    ]);
  lines.push(
    ...(rows.length === 0
      ? ["No shown frequency is one of the request."]
      : table(["Field", "Cut", "Cycles/mm", ...names, difference, "Status", "Class"], rows)),
    "",
    ...MTF_COMPARISON_OUTRO,
  );
  return lines;
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
  if (section.mtf !== undefined) lines.push(...mtfComparisonLines(section.mtf));
  if (section.recorded !== null) {
    const { engines } = section.recorded;
    // The MTF values of a section that has a table of them are in that table, and in full in the model.
    const rows = section.recorded.rows.filter((row) => section.mtf === undefined || !row.name.includes("@"));
    lines.push("", "Recorded values, as each engine reports them. They are listed and never judged:", "");
    if (section.mtf !== undefined) {
      lines.push("The MTF values at every frequency of the request are in `report.json`.", "");
    }
    const body = rows.map((row) => [
      `${row.name}[${count(row.index)}]`,
      ...row.cells.map((cell) => {
        if (cell === null) return NOTHING;
        return cell.value === null ? "not finite" : recordedText(cell.value);
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
      [
        "FLOOR",
        "A gated rung: a judged metric is above its tolerance by the known numerical floor of one of the two " +
          "engines. That engine is within the floor limit of the rung's arbiter, and no other engine sides with " +
          "it against the arbiter; the note gives the figures, and names a witness that did not corroborate the " +
          "arbiter. It counts as a pass.",
      ],
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
  "Only FAIL and ERROR fail a comparison. FLOOR is a pass that is counted apart from PASS. RECORDED and ATTENTION",
  "are not failures: a recorded rung compares methods that are expected to differ, and its numbers are kept to be",
  "read, not to be gated. BLOCKED is not a second failure: two engines that built different systems would differ",
  "in every rung after that one.",
  "",
  "A limit is shown in the heading of its metric: `≤` is the tolerance of a gated rung, `band` the attention band",
  "of a recorded one, and `floor ≤` how far the engine with a floor may be from the arbiter for a FLOOR. A metric",
  "without a limit is shown and not judged. Where its name begins as a judged one's does, it stands beside that",
  "one: `pupilZ.maxAbs`, the plain difference, beside `pupilZ.maxScaled`, the one on the scale that is judged.",
  `Numbers have ${METRIC_DIGITS} significant digits, and a whole number, such as a count, is written in full.`,
  `A recorded value has ${RECORDED_DIGITS} significant digits, or is a whole number in full, and is named with the index of its`,
  `element. \`${NOTHING}\` marks a place with nothing to compare, and \`not finite\` a number that is a NaN or an infinity.`,
  "The reference-vs-each table and the pairwise matrix judge a pair alike, so a pair that is in both has the same",
  "verdict in both.",
];

/** How to read a table of the engines' own MTF: what a row's status and a field's class say. Templates only. */
const HOW_TO_READ_MTF: readonly string[] = [
  "### The engines' own MTF",
  "",
  "A row of such a table is one field, cut and frequency, and has a status of its own:",
  "",
  ...table(
    ["Status", "Meaning"],
    MTF_ROW_STATUSES.map((status) => [status, MTF_ROW_STATUS_TEXT[status]]),
  ),
  "",
  "A field has the class of its difference, decided in this order, and the reason beside it:",
  "",
  ...table(
    ["Class", "Meaning"],
    Object.entries(DIFFERENCE_CLASS_TEXT).map(([kind, text]) => [kind, text]),
  ),
];

/**
 * The report as Markdown. A pure function of the model: equal models give equal text, with LF line endings and
 * one newline at the end. Every number goes through `src/core/numeric/format.ts`, and every text placed in a table
 * goes through `escapeCell`.
 *
 * The sections, in order: the title and the inputs (suite, contract version, policy version, engines with their
 * fingerprints and, for the comparator's own engines, their adapter revisions, runs); the verdict summary; the
 * support matrix; for each run and rung the reference-vs-each table, the pairwise matrix, for the rung of the
 * engines' own MTF the table of it at the shown frequencies, and the values the answers only record; what the
 * comparison does not cover, always; and how to read the verdicts.
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
  // The column of adapter revisions is there only where an engine has one: an engine of the comparator's own.
  const adapters = model.engines.some(
    (engine) => engine.status === "available" && engine.adapterRevision !== undefined,
  );
  const engineRows = model.engines.map((engine) =>
    engine.status === "available"
      ? [
          engine.id,
          "available",
          engine.version,
          engine.fingerprint,
          ...(adapters ? [engine.adapterRevision ?? NOTHING] : []),
        ]
      : [engine.id, `unavailable: ${engine.code}`, NOTHING, NOTHING, ...(adapters ? [NOTHING] : [])],
  );
  lines.push(
    ...(engineRows.length === 0
      ? ["No engine was run."]
      : table(["Engine", "Status", "Version", "Fingerprint", ...(adapters ? ["Adapter revision"] : [])], engineRows)),
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
  lines.push("", "## Not covered", "", "What this comparison does not show, whatever its verdicts:", "");
  lines.push(...model.notCovered.map((sentence) => `- ${sentence}`));
  lines.push("", ...HOW_TO_READ);
  if (model.sections.some((section) => section.mtf !== undefined)) lines.push("", ...HOW_TO_READ_MTF);
  return `${lines.join("\n")}\n`;
}
