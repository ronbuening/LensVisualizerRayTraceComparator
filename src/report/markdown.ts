// The Markdown of a report: a pure layout of the report model, so the same model always gives the same bytes.
import { METRIC_DIGITS, numberText, whereText } from "../compare/metricText.ts";
import { COMPARISON_MODES, VERDICTS } from "../contract/comparison.ts";
import type { ComparisonMetric } from "../contract/comparison.ts";
import { formatFixed, formatSci } from "../core/numeric/format.ts";
import { NO_CONSENSUS_REASONS } from "./consensus.ts";
import type { MtfComparison } from "./mtfComparison.ts";
import { checkName, unitName } from "./names.ts";
import type { GroupSummary, MetricColumn, ReportModel, ReportSection, SupportCell } from "./model.ts";
import {
  CLASS_KIND,
  CLASS_TEXT,
  DIFFERENCE_CLASSES,
  ROW_STATUS_TEXT,
  classLabel,
  rowStatusLabel,
  VERDICT_TEXT,
  METHOD_TEXT,
  modeLabel,
  valueLabel,
  verdictShort,
} from "../vocabulary/index.ts";
import {
  CONSENSUS_SECTION,
  CONSENSUS_TABLES,
  HOW_TO_READ_TEXT,
  MTF_COMPARISON_TEXT,
  REPORT_TEXT,
  RUN_REPORT_TEXT,
  consensusCounts,
  consensusSentence,
  FIELD_REASON_TEXT,
  GEOMETRIC_SAMPLING,
  GEOMETRIC_SEVERAL_LINES,
  severalLinesChiefLanding,
  WAVEFRONT_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  MTF_COMPARISON_OUTRO,
  MTF_ROW_STATUSES,
  WAVEFRONT_HEADING,
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
  const unit = column.unit === null || column.unit === "1" ? "" : ` ${unitName(column.unit)}`;
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

/** The first sentence above a table of the engines' own MTF, by the MTF it is of. */
export const OWN_MTF_HEADING = {
  diffraction: "The engines' own MTF, side by side.",
  geometric: "The engines' own geometric MTF, side by side.",
  wavefront: WAVEFRONT_HEADING,
} as const;

/**
 * The table of an MTF comparison: the fields with what each engine says of them and the class of their
 * difference, then a row for every field, cut and shown frequency. Every sentence is a template of
 * `src/report/wording.ts`.
 */
export function mtfComparisonLines(mtf: MtfComparison, intro = MTF_COMPARISON_INTROS[mtf.kind]): string[] {
  const { pair, columns, bands } = mtf;
  const names = columns.map((column) => (column.step === null ? column.engine : `${column.engine} ${column.step}`));
  const judged = columns.flatMap((column, index) => (column.judged ? [names[index]] : []));
  const difference =
    mtf.kind === "wavefront" || judged.length !== 2 ? `${pair.a} − ${pair.b}` : `${judged[0]} − ${judged[1]}`;
  const peers = mtf.peers ?? [];
  const bandText = (value: number | null): string => (value === null ? "none" : numberText(value));
  const m = MTF_COMPARISON_TEXT;
  const lines = [
    "",
    m.difference(OWN_MTF_HEADING[mtf.kind], difference),
    ...intro,
    "",
    ...m.bands(bandText(bands.onAxis), bandText(bands.offAxis), bandText(bands.chiefLandingMm)),
    "",
  ];
  if (pair.verdict === null) lines.push(m.notBothAsked(pair.a, pair.b), "");
  else if (pair.verdict === "UNSUPPORTED" || pair.verdict === "ERROR") {
    lines.push(m.noResult(pair.a, pair.b, verdictShort(pair.verdict), pair.reason ?? m.noReason), "");
  } else {
    lines.push(...m.overall(pair.a, pair.b, verdictShort(pair.verdict)), "");
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
    field.class === null ? NOTHING : classLabel(field.class),
    field.reason === null ? NOTHING : `${field.reason}: ${FIELD_REASON_TEXT[field.reason]}`,
    ...peers.flatMap((peer) => {
      const other = peer.fields.find((f) => f.field === field.field);
      return [classLabel(other?.class ?? "unsupported"), other?.reason ?? peer.pair.reason ?? "no-curve"];
    }),
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
        ...peers.flatMap((peer) => [`${peer.pair.a} − ${peer.pair.b}: class`, "Reason"]),
      ],
      fieldRows,
    ),
    "",
  );
  if (mtf.kind === "wavefront" && mtf.lineCounts.some((count) => (count ?? 0) > 1)) {
    lines.push(...WAVEFRONT_SEVERAL_LINES, "", ...severalLinesChiefLanding(bandText(bands.chiefLandingMm)), "");
  }
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
      rowStatusLabel(row.status),
      row.class === null ? NOTHING : classLabel(row.class),
      ...peers.flatMap((peer) => {
        const other = peer.rows.find(
          (r) => r.field === row.field && r.cut === row.cut && r.frequencyPerMm === row.frequencyPerMm,
        );
        return [
          other?.difference == null ? NOTHING : numberText(other.difference),
          rowStatusLabel(other?.status ?? "UNSUPPORTED"),
          classLabel(other?.class ?? "unsupported"),
        ];
      }),
    ]);
  lines.push(
    ...(rows.length === 0
      ? [MTF_COMPARISON_TEXT.noFrequency]
      : table(
          [
            "Field",
            "Cut",
            "Cycles/mm",
            ...names,
            difference,
            "Status",
            "Class",
            ...peers.flatMap((peer) => [`${peer.pair.a} − ${peer.pair.b}`, "Status", "Class"]),
          ],
          rows,
        )),
    "",
    ...MTF_COMPARISON_OUTRO,
  );
  return lines;
}

function sectionLines(section: ReportSection): string[] {
  const check = checkName(section.rung);
  const heading = section.request === null ? check : `${check}, ${section.request}`;
  const judged =
    section.mode === null || section.class === null
      ? RUN_REPORT_TEXT.noPolicyEntry
      : RUN_REPORT_TEXT.judged(
          valueLabel(METHOD_TEXT, section.mode),
          HOW_TO_READ_TEXT.kind[CLASS_KIND[section.class] ?? ""] ?? section.class,
        );
  const lines = [`#### ${heading}`, "", RUN_REPORT_TEXT.sectionLine(`\`${section.quantity}\``, judged)];

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
    if (section.consensus !== null) lines.push("", consensusSentence(section.consensus));
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

/**
 * The "Consensus" section of a run whose sections have a consensus to look for: what one is, how many requests have
 * one or none by the reason, and where each engine of the run stands. Every sentence is a template of
 * `src/report/wording.ts`.
 */
function consensusLines(groups: GroupSummary): string[] {
  return [
    "## Consensus",
    "",
    ...CONSENSUS_SECTION,
    "",
    consensusCounts(groups.requests, groups.withConsensus),
    "",
    ...table(CONSENSUS_TABLES.requests, [
      [CONSENSUS_TABLES.withConsensus, count(groups.withConsensus)],
      ...NO_CONSENSUS_REASONS.map((reason) => [
        CONSENSUS_TABLES.withoutConsensus(reason),
        count(groups.withoutConsensus[reason]),
      ]),
    ]),
    "",
    ...table(
      CONSENSUS_TABLES.engines,
      groups.engines.map((engine) => [
        engine.engine,
        ...[engine.consensus, engine.outlier, engine.apart, engine.noConsensus, engine.notPlaced].map(count),
      ]),
    ),
  ];
}

/**
 * How to read a run's report: the verdicts with their labels and meanings, and how a limit and a number are shown. A
 * floor is named only where the limits file grants one (`floor`): a metric with a floor limit, or a pair that is
 * FLOOR.
 */
function howToRead(floor: boolean): string[] {
  const t = RUN_REPORT_TEXT;
  return [
    `## ${t.howToRead}`,
    "",
    ...t.howToReadIntro,
    "",
    ...table(
      t.verdictColumns,
      VERDICTS.filter((verdict) => floor || verdict !== "FLOOR").map((verdict) => [
        VERDICT_TEXT[verdict].label,
        `\`${verdict}\``,
        VERDICT_TEXT[verdict].meaning,
      ]),
    ),
    "",
    ...t.failing(floor),
    "",
    ...t.limits(floor),
    ...t.digits(METRIC_DIGITS, RECORDED_DIGITS, NOTHING),
  ];
}

/**
 * The "Identifiers" section of a run's report: the hashes of the suite file, the limits file, each engine's code (and
 * this tool's code behind an engine of its own), each run's lens state and each request a section is of.
 */
function identifierLines(model: ReportModel): string[] {
  const t = RUN_REPORT_TEXT;
  const adapters = model.engines.some(
    (engine) => engine.status === "available" && engine.adapterRevision !== undefined,
  );
  const engineRows = model.engines.map((engine) =>
    engine.status === "available"
      ? [engine.id, engine.fingerprint, ...(adapters ? [engine.adapterRevision ?? NOTHING] : [])]
      : [engine.id, NOTHING, ...(adapters ? [NOTHING] : [])],
  );
  const lines = [
    `## ${t.identifiers}`,
    "",
    ...t.identifiersIntro,
    "",
    ...table(t.identifierColumns, [
      [t.suiteFile, model.suite.hash],
      [t.limitsFile, model.policy.hash],
    ]),
  ];
  if (engineRows.length > 0) lines.push("", ...table(t.engineIdentifierColumns(adapters), engineRows));
  if (model.runs.length > 0) {
    lines.push(
      "",
      ...table(
        t.runIdentifierColumns,
        model.runs.map((run) => [run.name, run.caseId ?? NOTHING]),
      ),
    );
  }
  if (model.sections.length > 0) {
    lines.push(
      "",
      ...table(
        t.requestIdentifierColumns,
        model.sections.map((section) => [
          section.run,
          section.request === null ? section.rung : `${section.rung}, ${section.request}`,
          section.requestId,
        ]),
      ),
    );
  }
  return lines;
}

/** How to read a table of the engines' own MTF: what a row's status and a field's class say. Templates only. */
export const HOW_TO_READ_MTF: readonly string[] = [
  `### ${HOW_TO_READ_TEXT.ownMtf}`,
  "",
  HOW_TO_READ_TEXT.ownMtfRows,
  "",
  ...table(
    HOW_TO_READ_TEXT.ownMtfStatusColumns,
    MTF_ROW_STATUSES.map((status) => [ROW_STATUS_TEXT[status].label, `\`${status}\``, ROW_STATUS_TEXT[status].meaning]),
  ),
  "",
  HOW_TO_READ_TEXT.ownMtfClasses,
  "",
  ...table(
    HOW_TO_READ_TEXT.ownMtfClassColumns,
    DIFFERENCE_CLASSES.map((kind) => [CLASS_TEXT[kind].label, `\`${kind}\``, CLASS_TEXT[kind].meaning]),
  ),
];

/**
 * The report as Markdown. A pure function of the model: equal models give equal text, with LF line endings and
 * one newline at the end. Every number goes through `src/core/numeric/format.ts`, and every text placed in a table
 * goes through `escapeCell`.
 *
 * The sections, in order: the title and the inputs (suite, contract version, limits-file version, engines with their
 * status and version, runs with theirs); the verdict summary, by verdict label and mode label; the
 * consensus over the run, where a section has one to look for; the support matrix; for each run and rung the
 * reference-vs-each table, the pairwise matrix with the group's consensus under it where it has one to look for, for
 * the rung of the engines' own MTF the table of it at the shown frequencies, and the values the answers only record;
 * what the comparison does not cover, always; how to read the verdicts; and the identifiers: the hashes of the suite
 * file, the limits file, the engines' code, the runs' lens states and the sections' requests.
 */
export function renderMarkdown(model: ReportModel): string {
  const t = RUN_REPORT_TEXT;
  // A floor is named where the limits file grants one to a figure shown, or a pair came to it.
  const floor =
    model.summary.some(({ counts }) => counts.FLOOR > 0) ||
    model.sections.some((section) => section.columns.some((column) => column.floorLimit !== undefined));
  const lines: string[] = [`# ${t.title(model.suite.name)}`, "", `## ${REPORT_TEXT.inputs}`, ""];
  lines.push(
    ...table(REPORT_TEXT.inputColumns, [
      [REPORT_TEXT.suite, model.suite.name],
      [REPORT_TEXT.contract, model.contract],
      [REPORT_TEXT.limitsFile, REPORT_TEXT.limitsFileVersion(count(model.policy.version))],
    ]),
    "",
    "### Engines",
    "",
  );
  // The hashes of the engines' code and of the runs' lens states are under Identifiers, at the end.
  const engineRows = model.engines.map((engine) =>
    engine.status === "available"
      ? [engine.id, "available", engine.version]
      : [engine.id, `unavailable: ${engine.code}`, NOTHING],
  );
  lines.push(...(engineRows.length === 0 ? ["No engine was run."] : table(t.engineColumns, engineRows)));
  lines.push("", "### Runs", "");
  const runRows = model.runs.map((run) => [
    run.name,
    run.problems.length === 0 ? "run" : `not started: ${run.problems.join("; ")}`,
  ]);
  lines.push(...table(t.runColumns, runRows));

  lines.push("", `## ${t.verdictSummary}`, "");
  const pairs = model.summary.reduce(
    (total, { counts }) => total + VERDICTS.reduce((sum, verdict) => sum + counts[verdict], 0),
    0,
  );
  lines.push(model.failing === 0 ? t.noFailure(count(pairs)) : t.failures(count(model.failing), count(pairs)), "");
  const countsOf = (mode: string, verdict: (typeof VERDICTS)[number]): string =>
    count(model.summary.find((entry) => entry.mode === mode)?.counts[verdict] ?? 0);
  lines.push(
    ...table(
      [t.verdictSummaryColumn, ...COMPARISON_MODES.map(modeLabel)],
      VERDICTS.filter((verdict) => floor || verdict !== "FLOOR").map((verdict) => [
        VERDICT_TEXT[verdict].label,
        ...COMPARISON_MODES.map((mode) => countsOf(mode, verdict)),
      ]),
    ),
  );

  if (model.groups !== null) lines.push("", ...consensusLines(model.groups));

  lines.push("", `## ${t.supportMatrix}`, "");
  const engineIds = model.engines.map((engine) => engine.id);
  const supportRows = model.support.map((row) => [
    row.run,
    row.request === null ? row.rung : `${row.rung}, ${row.request}`,
    ...row.cells.map(supportText),
  ]);
  lines.push(
    ...(supportRows.length === 0
      ? ["No engine was asked anything."]
      : table([...t.supportColumns, ...engineIds], supportRows)),
  );

  lines.push("", "## Results");
  if (model.sections.length === 0) lines.push("", "Nothing was compared.");
  let run: string | undefined;
  for (const section of model.sections) {
    if (section.run !== run) lines.push("", `### ${section.run}`);
    run = section.run;
    lines.push("", ...sectionLines(section));
  }
  lines.push("", `## ${REPORT_TEXT.notCovered}`, "", REPORT_TEXT.notCoveredIntro, "");
  lines.push(...model.notCovered.map((sentence) => `- ${sentence}`));
  lines.push("", ...howToRead(floor));
  if (model.sections.some((section) => section.mtf !== undefined)) lines.push("", ...HOW_TO_READ_MTF);
  lines.push("", ...identifierLines(model));
  return `${lines.join("\n")}\n`;
}
