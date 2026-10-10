// The MTF report of a baseline: what is committed beside an MTF baseline as `reports/<suite>/mtf.md` and
// `mtf.json`. Like the rays report it is rendered from the baseline alone, so that it can be made anew, byte for
// byte, with no engine at hand: the gated rungs as the rays report shows them, with the number of requests each
// figure was measured in; the recorded rungs with every marked request and, for a rung of the engines' own MTF,
// the table of it at the shown frequencies, made from the requests the baseline keeps (`BaselineRung.sets`).
import { numberText, whereText } from "../compare/metricText.ts";
import { GEOMETRIC_MTF_RUNG, OFF_AXIS_METRIC, ON_AXIS_METRIC } from "../compare/mtfNative.ts";
import type { NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";
import type { Baseline, BaselineStep } from "../contract/baseline.ts";
import type { ComparisonMetric, Verdict } from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { formatFixed } from "../core/numeric/format.ts";
import { HOW_TO_READ_MTF, OWN_MTF_HEADING } from "../report/markdown.ts";
import { MTF_COMPARISON_PAIR, buildMtfComparison } from "../report/mtfComparison.ts";
import type { MtfFieldFlag } from "../report/mtfComparison.ts";
import {
  FIELD_REASON_TEXT,
  GEOMETRIC_SAMPLING,
  GEOMETRIC_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  MTF_COMPARISON_OUTRO,
  MTF_ROW_STATUSES,
  NOT_COVERED,
} from "../report/wording.ts";
import type { MtfComparisonKind, MtfRowStatus } from "../report/wording.ts";
import { buildBaselineReport, count, renderBaselineMarkdown, table } from "./report.ts";
import type { BaselineReport, ReportRung } from "./report.ts";

/** The names of an MTF baseline's two report files, inside `reports/<suite>/`. */
export const MTF_REPORT_JSON = "mtf.json";
export const MTF_REPORT_MARKDOWN = "mtf.md";

/** One request of a recorded rung whose pair is outside an attention band. */
export interface MtfAttentionRow {
  readonly rung: string;
  readonly run: string;
  /** The place of the request among the requests of its run and rung; null for a rung whose requests are not kept. */
  readonly request: number | null;
  /** The field of the request, for a request of one field; null for any other. */
  readonly field: number | null;
  readonly a: string;
  readonly b: string;
  /** Each figure that is above its band, with the band and where the figure occurs. */
  readonly figures: readonly {
    readonly name: string;
    readonly value: number | null;
    readonly band: number;
    readonly where?: ComparisonMetric["where"];
  }[];
}

/** One field and cut of one request: the three estimates at each shown frequency. */
export interface MtfReportRow {
  readonly run: string;
  readonly field: number;
  readonly cut: string;
  /** What each of LensVisualizer, optiland and the estimator says of the field; null where it did not answer. */
  readonly flags: readonly (MtfFieldFlag | null)[];
  /** The step of optiland the row is of, such as `fft512`; null for its first answer. */
  readonly step: string | null;
  readonly class: NativeDifferenceClass | null;
  readonly reason: NativeFieldReason | null;
  /** The gravest status of the row's shown frequencies. */
  readonly status: MtfRowStatus;
  /** What the pair of the request came to over every frequency of the request. */
  readonly overall: Verdict | null;
  /** One per shown frequency: the three values and the difference of the first two; null where there is none. */
  readonly values: readonly {
    readonly frequencyPerMm: number;
    readonly lv: number | null;
    readonly optiland: number | null;
    readonly estimator: number | null;
    readonly difference: number | null;
    readonly status: MtfRowStatus;
  }[];
}

/** The table of one rung of the engines' own MTF over every run. */
export interface MtfReportTable {
  readonly rung: string;
  readonly kind: MtfComparisonKind;
  /** The third column: the comparator's estimator the rung asks; null where no request has one. */
  readonly estimator: string | null;
  readonly bands: {
    readonly onAxis: number | null;
    readonly offAxis: number | null;
    readonly chiefLandingMm: number | null;
  };
  /** True where a request's judged answer of optiland is of several lines. */
  readonly severalLines: boolean;
  /** The requests that have no table, by what their pair came to and why, with the runs they are of. */
  readonly without: readonly {
    readonly verdict: Verdict | null;
    readonly reason: string;
    readonly requests: number;
    readonly runs: readonly string[];
  }[];
  /** How many rows came to each status, in the order of the statuses. */
  readonly statuses: readonly { readonly status: MtfRowStatus; readonly rows: number }[];
  readonly rows: readonly MtfReportRow[];
}

/** The MTF report of one baseline. */
export interface MtfBaselineReport extends Omit<BaselineReport, "kind"> {
  readonly kind: "baseline-mtf-report";
  /** The later steps of the engines, rung by rung and run by run. */
  readonly steps: readonly (BaselineStep & { readonly rung: string; readonly run: string })[];
  /** Every request of a recorded rung whose pair is `ATTENTION`. */
  readonly attention: readonly MtfAttentionRow[];
  /** One per rung of the engines' own MTF. */
  readonly tables: readonly MtfReportTable[];
  /** What the comparison does not show, whatever its verdicts: the fixed sentences of `NOT_COVERED`. */
  readonly notCovered: readonly string[];
}

/** The statuses of a row from the least grave: the status of a field and cut is the last one met. */
const STATUS_GRAVITY: readonly MtfRowStatus[] = ["RECORDED", "SET ASIDE", "UNSUPPORTED", "ATTENTION", "ERROR"];

function gravest(statuses: readonly MtfRowStatus[]): MtfRowStatus {
  return statuses.reduce<MtfRowStatus>(
    (found, status) => (STATUS_GRAVITY.indexOf(status) > STATUS_GRAVITY.indexOf(found) ? status : found),
    "RECORDED",
  );
}

/** The figures of a pair that are above their bands. */
function aboveBand(
  metrics: readonly ComparisonMetric[],
  bands: { readonly [metric: string]: number },
): MtfAttentionRow["figures"] {
  return metrics.flatMap((metric) => {
    const band = Object.hasOwn(bands, metric.name) ? bands[metric.name] : undefined;
    if (band === undefined || (metric.value !== null && metric.value <= band)) return [];
    const { name, value, where } = metric;
    return [{ name, value, band, ...(where === undefined ? {} : { where }) }];
  });
}

/**
 * Builds the MTF report of a baseline: the report of the rays baseline (`buildBaselineReport`: inputs, and for each
 * rung the support, the pairs and a row per run), and beside it the later steps of the engines, every request of a
 * recorded rung that is `ATTENTION` with the figures above their bands, and for each rung that keeps its requests
 * the table of the engines' own MTF (`buildMtfComparison`, from the kept values and the kept bands) at the shown
 * frequencies, a row per run, field and cut. A pure function of the baseline.
 */
export function buildMtfBaselineReport(baseline: Baseline): MtfBaselineReport {
  const steps: (BaselineStep & { rung: string; run: string })[] = [];
  const attention: MtfAttentionRow[] = [];
  type Growing = Omit<MtfReportTable, "estimator" | "severalLines" | "rows" | "without"> & {
    estimator: string | null;
    severalLines: boolean;
    rows: MtfReportRow[];
    without: MtfReportTable["without"][number][];
  };
  const tables = new Map<string, Growing>();
  for (const run of baseline.runs) {
    for (const rung of run.rungs) {
      for (const step of rung.steps ?? []) steps.push({ rung: rung.rung, run: run.name, ...step });
      const bands = rung.bands ?? {};
      if (rung.sets === undefined) {
        for (const pair of rung.pairs) {
          if (pair.verdict !== "ATTENTION") continue;
          const { a, b } = pair;
          attention.push({
            rung: rung.rung,
            run: run.name,
            request: null,
            field: null,
            a,
            b,
            figures: aboveBand(pair.metrics, bands),
          });
        }
        continue;
      }
      const kind: MtfComparisonKind = rung.rung === GEOMETRIC_MTF_RUNG ? "geometric" : "diffraction";
      const policy: RungPolicy = {
        quantity: rung.quantity,
        mode: "independent-method",
        class: "recorded",
        metrics: Object.fromEntries(Object.keys(bands).map((name) => [name, { attention: bands[name], unit: "1" }])),
      };
      const band = (name: string): number | null => (Object.hasOwn(bands, name) ? bands[name] : null);
      const known: Growing = tables.get(rung.rung) ?? {
        rung: rung.rung,
        kind,
        estimator: null,
        bands: {
          onAxis: band(ON_AXIS_METRIC),
          offAxis: band(OFF_AXIS_METRIC),
          chiefLandingMm: band("chiefLanding.maxAbs"),
        },
        severalLines: false,
        without: [],
        statuses: [],
        rows: [],
      };
      tables.set(rung.rung, known);
      rung.sets.forEach((set, request) => {
        const fields = set.participants.map((participant) => participant.recorded?.field).find((field) => field);
        const only = fields?.length === 1 ? (fields[0] ?? null) : null;
        for (const pair of set.pairs) {
          if (pair.verdict !== "ATTENTION") continue;
          const { a, b } = pair;
          attention.push({
            rung: rung.rung,
            run: run.name,
            request,
            field: only,
            a,
            b,
            figures: aboveBand(pair.metrics, bands),
          });
        }
        const mtf = buildMtfComparison({ participants: set.participants, pairs: set.pairs, policy, kind });
        const verdict = mtf?.pair.verdict ?? null;
        if (mtf === null || verdict === null || verdict === "UNSUPPORTED" || verdict === "ERROR") {
          const reason =
            mtf?.pair.reason ??
            (mtf === null ? "no engine records the fields of an answer" : "the two engines were not both asked");
          const same = known.without.find((each) => each.verdict === verdict && each.reason === reason);
          if (same === undefined) known.without.push({ verdict, reason, requests: 1, runs: [run.name] });
          else {
            known.without[known.without.indexOf(same)] = {
              ...same,
              requests: same.requests + 1,
              runs: same.runs.includes(run.name) ? same.runs : [...same.runs, run.name],
            };
          }
          return;
        }
        const [first, second] = MTF_COMPARISON_PAIR;
        const at = (engine: string): number =>
          mtf.columns.findIndex((column) => column.engine === engine && column.judged);
        const [lv, optiland] = [at(first), at(second)];
        const other = mtf.columns.findIndex((column) => column.engine !== first && column.engine !== second);
        if (other >= 0 && known.estimator === null) known.estimator = mtf.columns[other].engine;
        if ((mtf.lineCounts[1] ?? 0) > 1) known.severalLines = true;
        const pick = <T>(values: readonly T[], index: number): T | null => (index < 0 ? null : values[index]);
        for (const field of mtf.fields) {
          const cuts = [...new Set(mtf.rows.map((row) => row.cut))];
          for (const cut of cuts) {
            const shown = mtf.rows.filter((row) => row.field === field.field && row.cut === cut && row.shown);
            known.rows.push({
              run: run.name,
              field: field.field,
              cut,
              flags: [lv, optiland, other].map((index) => pick(field.flags, index)),
              step: pick(mtf.columns, optiland)?.step ?? null,
              class: field.class,
              reason: field.reason,
              status: gravest(shown.map((row) => row.status)),
              overall: verdict,
              values: shown.map((row) => ({
                frequencyPerMm: row.frequencyPerMm,
                lv: pick(row.values, lv),
                optiland: pick(row.values, optiland),
                estimator: pick(row.values, other),
                difference: row.difference,
                status: row.status,
              })),
            });
          }
        }
      });
    }
  }
  const { kind: _kind, ...report } = buildBaselineReport(baseline);
  return {
    ...report,
    // The version the baseline states: that of the members this report is made from.
    contract: baseline.contract,
    kind: "baseline-mtf-report",
    steps,
    attention,
    tables: [...tables.values()].map((each) => ({
      ...each,
      statuses: MTF_ROW_STATUSES.flatMap((status) => {
        const rows = each.rows.filter((row) => row.status === status).length;
        return rows === 0 ? [] : [{ status, rows }];
      }),
    })),
    notCovered: [...NOT_COVERED],
  };
}

const NOTHING = "—";
const MTF_DECIMALS = 4;

function mtfText(value: number | null): string {
  return value === null ? NOTHING : formatFixed(value, MTF_DECIMALS);
}

function bandText(value: number | null): string {
  return value === null ? "none" : numberText(value);
}

/** The lines of one rung's table of the engines' own MTF. */
function tableLines(each: MtfReportTable): string[] {
  const [first, second] = MTF_COMPARISON_PAIR;
  const estimator = each.estimator ?? "estimator";
  const frequencies = [...new Set(each.rows.flatMap((row) => row.values.map((value) => value.frequencyPerMm)))].sort(
    (a, b) => a - b,
  );
  const lines = [
    "",
    `${OWN_MTF_HEADING[each.kind]} The difference of a row is ${first} − ${second}.`,
    ...MTF_COMPARISON_INTROS[each.kind],
    "",
    `Attention bands: ${bandText(each.bands.onAxis)} on the axis, ${bandText(each.bands.offAxis)} off it. Two chief rays that land`,
    `more than ${bandText(each.bands.chiefLandingMm)} mm apart are of two fields.`,
  ];
  if (each.kind === "geometric") {
    lines.push("", ...GEOMETRIC_SAMPLING);
    if (each.severalLines) lines.push("", ...GEOMETRIC_SEVERAL_LINES);
  }
  if (each.without.length > 0) {
    lines.push(
      "",
      "Requests without a table, by what the two engines came to:",
      "",
      ...table(
        ["Verdict", "Requests", "Runs", "Reason"],
        each.without.map((group) => [
          group.verdict ?? NOTHING,
          count(group.requests),
          count(group.runs.length),
          group.reason,
        ]),
      ),
    );
  }
  lines.push(
    "",
    `A row is one field and cut of one run, at ${frequencies.map((frequency) => String(frequency)).join(", ")} cycles/mm. Under each engine is what it says of the field`,
    `(\`${second}\` with the step its row is of, where it was asked again); the third estimate is the comparator's`,
    `(\`${estimator}\`). The status is the gravest of the row's frequencies; "all" is what the two engines came to over`,
    "every frequency of the request.",
    "",
    `Rows by status: ${each.statuses.map(({ status, rows }) => `${count(rows)} ${status}`).join(", ") || "none"}.`,
    "",
    ...table(
      [
        "Run",
        "Field",
        "Cut",
        first,
        second,
        estimator,
        "Class",
        "Status",
        "All",
        ...frequencies.flatMap((frequency) => [
          `${first} ${frequency}`,
          `${second} ${frequency}`,
          `${estimator} ${frequency}`,
          `Δ ${frequency}`,
        ]),
      ],
      each.rows.map((row) => [
        row.run,
        String(row.field),
        row.cut,
        row.flags[0] ?? NOTHING,
        `${row.flags[1] ?? NOTHING}${row.step === null ? "" : ` (${row.step})`}`,
        row.flags[2] ?? NOTHING,
        row.class === null ? NOTHING : row.reason === null ? row.class : `${row.class}: ${row.reason}`,
        row.status,
        row.overall ?? NOTHING,
        ...frequencies.flatMap((frequency) => {
          const value = row.values.find((each) => each.frequencyPerMm === frequency);
          if (value === undefined) return [NOTHING, NOTHING, NOTHING, NOTHING];
          return [
            mtfText(value.lv),
            mtfText(value.optiland),
            mtfText(value.estimator),
            value.difference === null ? NOTHING : numberText(value.difference),
          ];
        }),
      ]),
    ),
    "",
    ...MTF_COMPARISON_OUTRO,
  );
  const reasons = [...new Set(each.rows.flatMap((row) => (row.reason === null ? [] : [row.reason])))].sort();
  if (reasons.length > 0) {
    lines.push(
      "",
      ...table(
        ["Reason", "Meaning"],
        reasons.map((reason) => [reason, FIELD_REASON_TEXT[reason]]),
      ),
    );
  }
  return lines;
}

/**
 * The MTF report as Markdown. A pure function of the report: equal reports give equal text, with LF line endings
 * and one newline at the end.
 *
 * The sections are those of the rays report (`renderBaselineMarkdown`), each metric with the number of requests it
 * was measured in, since a rung may measure a figure only where its sampling can arbitrate; a rung of the engines'
 * own MTF has its table in place of the rows by run; then the later steps, every marked request, the fixed block
 * of what is not covered, and how the tables are read. `head` replaces the title and the introduction, for a
 * report of a run that is no committed baseline.
 */
export function renderMtfBaselineMarkdown(report: MtfBaselineReport, head?: readonly string[]): string {
  const tabled = (rung: ReportRung): MtfReportTable | undefined =>
    report.tables.find((each) => each.rung === rung.rung);
  const tail: string[] = [];
  if (report.steps.length > 0) {
    const kinds = [...new Set(report.steps.map((step) => `${step.rung}\0${step.engine}\0${step.step}`))];
    tail.push(
      "",
      "## Later steps",
      "",
      "An engine that was asked a request once more, with a finer sampling, because of what its first answer came to.",
      "Its first answer is what the support counts; the step is what its row of a table is of.",
      "",
      ...table(
        ["Rung", "Engine", "Step", "Runs", "Requests asked again", "Not ok"],
        kinds.map((key) => {
          const [rung, engine, step] = key.split("\0");
          const of = report.steps.filter((each) => each.rung === rung && each.engine === engine && each.step === step);
          const failed = of.filter((each) => each.status !== "ok");
          return [
            rung,
            engine,
            step,
            count(of.length),
            count(of.reduce((sum, each) => sum + each.jobs, 0)),
            failed.length === 0
              ? NOTHING
              : failed
                  .map((each) => `${each.run}: ${each.status}${each.detail === undefined ? "" : ` (${each.detail})`}`)
                  .join("; "),
          ];
        }),
      ),
    );
  }
  tail.push(
    "",
    "## Marked",
    "",
    "Every request of a rung that is only written down whose two engines differ by more than an attention band,",
    "with each figure above its band. A band is a width for attention; nothing here is a failure.",
    "",
    ...(report.attention.length === 0
      ? ["No request is marked."]
      : table(
          ["Rung", "Run", "Field", "Pair", "Figures above their bands"],
          report.attention.map((row) => [
            row.rung,
            row.run,
            row.field === null ? NOTHING : String(row.field),
            `${row.a} – ${row.b}`,
            row.figures
              .map(
                (figure) =>
                  `${figure.name} ${figure.value === null ? "not finite" : numberText(figure.value)} (band ${numberText(figure.band)})${whereText(figure.where)}`,
              )
              .join("; ") || NOTHING,
          ]),
        )),
    "",
    "## Not covered",
    "",
    "What this comparison does not show, whatever its verdicts:",
    "",
    ...report.notCovered.map((sentence) => `- ${sentence}`),
  );
  if (report.tables.length > 0) tail.push("", ...HOW_TO_READ_MTF);
  return renderBaselineMarkdown(
    { ...report, kind: "baseline-report" },
    {
      head: head ?? [
        `# MTF baseline of ${report.suite.name}`,
        "",
        "What the committed MTF baseline of the suite holds, rung by rung, for every run as it was run (a zoom at",
        "each end). A gated rung has a tolerance: for every pair of engines the verdict and the largest value of each",
        "metric over the requests of the run, with the number of requests the metric was measured in, since a rung",
        "measures a figure only where its sampling can arbitrate. A rung of two methods has no tolerance: its figures",
        "are written down beside an attention band, and its tables set the estimates side by side.",
        "",
        "This file is rendered from the baseline alone (`lvrtc verify` makes it anew and fails on a byte of",
        "difference): it holds results, counts, names and hashes, and nothing an engine traced. The hash of a run's",
        "case says what its figures are of; `lvrtc baseline check --mtf` says whether the case and the engines are",
        "still those, and what moved.",
      ],
      measured: true,
      byRun: (rung) => tabled(rung) === undefined,
      afterRung: (rung) => {
        const each = tabled(rung);
        return each === undefined ? [] : tableLines(each);
      },
      tail,
    },
  );
}

/**
 * The MTF report of a baseline as the texts of its two files: the report (`buildMtfBaselineReport`) as canonical
 * JSON and a newline, and `renderMtfBaselineMarkdown` of it. A pure function: equal baselines give equal texts.
 */
export function renderMtfBaselineReport(
  baseline: Baseline,
  head?: readonly string[],
): { json: string; markdown: string } {
  const report = buildMtfBaselineReport(baseline);
  return { json: `${canonicalJson(report)}\n`, markdown: renderMtfBaselineMarkdown(report, head) };
}
