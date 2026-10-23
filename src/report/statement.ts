// Stage 4.5: the statement is a pure reduction of the eight baselines, never a request to an engine.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { baselineText, parseBaseline } from "../baseline/build.ts";
import { numberText, whereText } from "../compare/metricText.ts";
import type { Baseline, BaselineMetric, BaselineRun, BaselineRung } from "../contract/baseline.ts";
import { VERDICTS } from "../contract/comparison.ts";
import type { Verdict } from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { sha256Hex } from "../core/numeric/hash.ts";
import { escapeCell } from "./markdown.ts";
import { buildMtfComparison } from "./mtfComparison.ts";
import type { MtfComparisonRow } from "./mtfComparison.ts";
import {
  NOT_COVERED,
  STATEMENT_TEXT,
  STATEMENT_RUNGS,
  STATEMENT_Z50_ATTRIBUTION,
  statementSupport,
  wordingProblems,
} from "./wording.ts";

/** The complete input inventory; each suite has rays and MTF records. */
export const STATEMENT_SUITES = ["benchmark", "features", "states", "focus-stations"] as const;
export const STATEMENT_FILES = STATEMENT_SUITES.flatMap((suite) => [`${suite}.json`, `${suite}.mtf.json`]);
export const STATEMENT_JSON = "reports/validation-statement.json";
export const STATEMENT_MARKDOWN = "reports/validation-statement.md";

/** A parsed input, named so that the statement identifies every source. */
export interface StatementInput {
  readonly file: string;
  readonly baseline: Baseline;
}

/** Reads only baselines, refusing incomplete inventories before anything is written. */
export function readStatementInputs(root: string): StatementInput[] {
  return STATEMENT_FILES.map((file) => {
    const read = parseBaseline(readFileSync(join(root, "baselines", file), "utf8"));
    if ("problems" in read) throw new Error(`baselines/${file}: ${read.problems.join("; ")}`);
    return { file, baseline: read.baseline };
  });
}

interface RecordRung {
  suite: string;
  run: BaselineRun;
  rung: BaselineRung;
}
interface Figure extends BaselineMetric {
  suite: string;
  run: string;
  a: string;
  b: string;
}

function figuresOf(records: readonly RecordRung[]): Figure[] {
  return records.flatMap(({ suite, run, rung }) =>
    rung.pairs.flatMap(({ a, b, metrics }) => metrics.map((metric) => ({ ...metric, suite, run: run.name, a, b }))),
  );
}

const sortedNumbers = (numbers: readonly number[]) => [...new Set(numbers)].sort((a, b) => a - b);
const counts = (values: readonly string[]) =>
  Object.fromEntries([...new Set(values)].sort().map((key) => [key, values.filter((v) => v === key).length]));
const verdictCounts = (values: readonly { verdict: Verdict; count: number }[]) =>
  VERDICTS.map((verdict) => ({
    verdict,
    count: values.filter((v) => v.verdict === verdict).reduce((sum, v) => sum + v.count, 0),
  })).filter((v) => v.count > 0);
const rank = (figure: Figure): number =>
  figure.value === null
    ? Infinity
    : figure.tolerance === undefined
      ? figure.value
      : figure.tolerance === 0
        ? figure.value === 0
          ? 0
          : Infinity
        : figure.value / figure.tolerance;
function largest<T extends Figure>(figures: readonly T[], scaled = false): T | null {
  return figures.reduce<T | null>(
    (worst, figure) =>
      worst === null || (scaled ? rank(figure) > rank(worst) : (figure.value ?? Infinity) > (worst.value ?? Infinity))
        ? figure
        : worst,
    null,
  );
}
function figureText(figure: Figure | null): string {
  return figure === null
    ? "not measured"
    : `${figure.name} ${figure.value === null ? "nonfinite" : numberText(figure.value)} ${figure.unit}; ${figure.suite} / ${figure.run}; ${figure.a} / ${figure.b}${whereText(figure.where)}`;
}

function nativePolicy(rung: BaselineRung): RungPolicy {
  return {
    quantity: rung.quantity,
    mode: "independent-method",
    class: "recorded",
    metrics: Object.fromEntries(
      Object.entries(rung.bands ?? {}).map(([name, attention]) => [name, { attention, unit: "1" }]),
    ),
  };
}

function counterpart(records: readonly RecordRung[], id: "r5" | "r6c", engine: string) {
  const allRows: (MtfComparisonRow & { suite: string; run: string })[] = [];
  const coverage = records
    .filter(({ rung }) => rung.rung === id)
    .flatMap(({ suite, run, rung }) =>
      (rung.sets ?? []).flatMap((set, request) => {
        const table = buildMtfComparison({ ...set, policy: nativePolicy(rung), comparisonPair: ["lv", engine] });
        if (table === null) return [];
        allRows.push(...table.rows.map((row) => ({ ...row, suite, run: run.name })));
        return [
          {
            suite,
            run: run.name,
            request,
            linesNm: set.participants.find((p) => p.engine === "lv")?.recorded?.lineWavelengthNm ?? [],
            counterpartLinesNm: set.participants.find((p) => p.engine === engine)?.recorded?.lineWavelengthNm ?? [],
            fields: table.fields.map(({ field, class: kind, reason }) => ({
              field,
              class: table.pair.verdict === "UNSUPPORTED" ? "unsupported" : kind,
              reason: table.pair.verdict === "UNSUPPORTED" ? "no-curve" : reason,
            })),
            bands: table.bands,
            verdict: table.pair.verdict,
          },
        ];
      }),
    );
  const toFigure = (row: (typeof allRows)[number]): Figure & { class: MtfComparisonRow["class"] } => ({
    name: "mtf.maxAbs",
    value: Math.abs(row.difference!),
    unit: "1",
    suite: row.suite,
    run: row.run,
    a: "lv",
    b: engine,
    class: row.class,
    where: { field: row.field, cut: row.cut, frequencyPerMm: row.frequencyPerMm },
  });
  const shown = allRows.filter((row) => row.difference !== null);
  const banded = shown.filter((row) => row.band !== null);
  const aside = shown.filter((row) => row.band === null);
  return {
    rung: id,
    engine,
    configurations: new Set(coverage.map((row) => `${row.suite}/${row.run}`)).size,
    rows: allRows.length,
    bandedConfigurations: new Set(banded.map((row) => `${row.suite}/${row.run}`)).size,
    sortingLimitsMm: sortedNumbers(
      coverage.flatMap((row) => (row.bands.chiefLandingMm === null ? [] : [row.bands.chiefLandingMm])),
    ),
    classes: counts(allRows.map((row) => row.class ?? "unclassified")),
    statuses: counts(allRows.map((row) => row.status)),
    linesNm: sortedNumbers(coverage.flatMap((row) => row.linesNm.filter((n): n is number => n !== null))),
    counterpartLinesNm: sortedNumbers(
      coverage.flatMap((row) => row.counterpartLinesNm.filter((n): n is number => n !== null)),
    ),
    fields: sortedNumbers(allRows.map((row) => row.field)),
    frequenciesPerMm: sortedNumbers(allRows.map((row) => row.frequencyPerMm)),
    worstBanded: largest(banded.map(toFigure)),
    worstSetAside: largest(aside.map(toFigure)),
    coverage,
  };
}

/** Reduces sources in fixed order, deduplicating R4 in rays/MTF by suite and run, with MTF's measured counts. */
export function buildStatement(inputs: readonly StatementInput[]) {
  if (
    inputs.length !== STATEMENT_FILES.length ||
    STATEMENT_FILES.some((file) => inputs.filter((i) => i.file === file).length !== 1)
  )
    throw new Error("statement needs exactly the eight suite baselines");
  const sources = STATEMENT_FILES.map((file) => inputs.find((input) => input.file === file)!);
  const policy = sources[0].baseline.policy;
  const records: RecordRung[] = [];
  const suites = STATEMENT_SUITES.map((suite) => {
    const rays = sources.find((i) => i.file === `${suite}.json`)!.baseline;
    const mtf = sources.find((i) => i.file === `${suite}.mtf.json`)!.baseline;
    for (const baseline of [rays, mtf]) {
      if (baseline.suite.name !== suite || canonicalJson(baseline.policy) !== canonicalJson(policy))
        throw new Error(`${suite}: suite or policy differs`);
    }
    if (
      canonicalJson(rays.suite) !== canonicalJson(mtf.suite) ||
      canonicalJson(rays.runs.map(({ rungs: _rungs, ...run }) => run)) !==
        canonicalJson(mtf.runs.map(({ rungs: _rungs, ...run }) => run))
    )
      throw new Error(`${suite}: rays and MTF state inventories differ`);
    for (const run of rays.runs) {
      const other = mtf.runs.find((r) => r.name === run.name)!;
      const rungs = new Map(run.rungs.map((rung) => [rung.rung, rung]));
      for (const rung of other.rungs) {
        const previous = rungs.get(rung.rung);
        const plain = (r: BaselineRung) => ({
          ...r,
          pairs: r.pairs.map((p) => ({ ...p, metrics: p.metrics.map(({ measured: _measured, ...metric }) => metric) })),
        });
        if (previous && canonicalJson(plain(previous)) !== canonicalJson(plain(rung)))
          throw new Error(`${suite}/${run.name}/${rung.rung}: duplicate measurements differ`);
        rungs.set(rung.rung, rung);
      }
      for (const rung of rungs.values())
        if (STATEMENT_RUNGS[rung.rung] && (STATEMENT_RUNGS[rung.rung].mode === "gated" || suite === "benchmark"))
          records.push({ suite, run, rung });
    }
    return {
      suite,
      declared: rays.runs.length,
      configurations: rays.runs.filter((r) => r.caseId !== null).length,
      states: rays.runs.map(({ name, caseId, problems }) => ({
        run: name,
        caseId,
        problems: (problems ?? []).map((problem) => problem.split(":")[0]),
      })),
    };
  });
  const rungs = Object.entries(STATEMENT_RUNGS).flatMap(([id, description]) => {
    const rows = records.filter(({ rung }) => rung.rung === id);
    if (rows.length === 0) return [];
    const figures = figuresOf(rows);
    const candidates = figures.filter((metric) =>
      description.mode === "gated" ? metric.tolerance !== undefined : /^mtf(OnAxis|OffAxis)\.maxAbs$/.test(metric.name),
    );
    const reported =
      id === "r6a"
        ? figures.filter(
            (m) =>
              m.tolerance !== undefined ||
              ["waveMtf.flagged", "phaseStep.waves", "convergence.maxAbs"].includes(m.name),
          )
        : candidates;
    const names = [...new Set(reported.map((m) => m.name))].sort();
    return [
      {
        rung: id,
        ...description,
        configurations: rows.length,
        configurationPairs: rows.reduce((sum, { rung }) => sum + rung.pairs.length, 0),
        requestPairs: rows.reduce(
          (sum, { rung }) =>
            sum + rung.pairs.reduce((n, pair) => n + pair.verdicts.reduce((v, c) => v + c.count, 0), 0),
          0,
        ),
        verdicts: verdictCounts(rows.flatMap(({ rung }) => rung.pairs.flatMap((p) => p.verdicts))),
        limits: [
          ...new Set(
            rows.flatMap(({ rung }) => [
              ...Object.entries(rung.bands ?? {}).map(([metric, value]) =>
                canonicalJson({
                  metric,
                  kind: "attention",
                  value,
                  unit: metric === "chiefLanding.maxAbs" ? "mm" : "1",
                }),
              ),
              ...rung.pairs.flatMap((pair) =>
                pair.metrics
                  .filter((m) => m.tolerance !== undefined)
                  .map((m) => canonicalJson({ metric: m.name, kind: "tolerance", value: m.tolerance, unit: m.unit })),
              ),
            ]),
          ),
        ]
          .sort()
          .map((v) => JSON.parse(v) as { metric: string; kind: string; value: number; unit?: string }),
        worst: largest(candidates, description.mode === "gated"),
        metrics: names.map((name) => ({
          name,
          worst: largest(reported.filter((m) => m.name === name)),
          measuredRequests: reported
            .filter((m) => m.name === name)
            .reduce(
              (sum, m) =>
                sum + (m.measured ?? rows.find((r) => r.suite === m.suite && r.run.name === m.run)!.rung.requests),
              0,
            ),
        })),
        diagnostics: Object.fromEntries(
          [
            ...new Set(
              figures
                .filter((m) => ["rays", "elements"].includes(m.unit) && m.tolerance === undefined)
                .map((m) => m.name),
            ),
          ]
            .sort()
            .map((name) => [name, figures.filter((m) => m.name === name).reduce((sum, m) => sum + (m.value ?? 0), 0)]),
        ),
      },
    ];
  });
  const counterparts = [counterpart(records, "r5", "optiland"), counterpart(records, "r6c", "optiland-wave")];
  const wavelengthsNm = sortedNumbers(counterparts.flatMap((c) => c.linesNm));
  const required = ["r2", "r3", "r4", "r6a"];
  const eligible = suites.flatMap((suite) =>
    suite.states
      .filter(
        (state) =>
          state.caseId !== null &&
          required.every((id) =>
            records.some(
              (r) =>
                r.suite === suite.suite &&
                r.run.name === state.run &&
                r.rung.rung === id &&
                ["optiland", "ref"].every((engine) =>
                  r.rung.pairs.some(
                    (p) =>
                      p.a === "lv" &&
                      p.b === engine &&
                      p.verdict === "PASS" &&
                      p.metrics.some(
                        (m) =>
                          m.tolerance !== undefined &&
                          m.value !== null &&
                          (id !== "r6a" || m.name === "waveMtf.maxAbs") &&
                          (m.measured ?? r.rung.requests) > 0,
                      ),
                  ),
                ),
            ),
          ),
      )
      .map((state) => ({ suite: suite.suite, run: state.run })),
  );
  const agreementRecords = records.filter(({ suite, run }) =>
    eligible.some((state) => state.suite === suite && state.run === run.name),
  );
  const agreementFigure = (id: string, metric?: string) =>
    largest(
      figuresOf(agreementRecords.filter(({ rung }) => rung.rung === id)).filter(
        (m) => m.tolerance !== undefined && (metric === undefined || m.name === metric),
      ),
      metric === undefined,
    );
  const agreementFigures = {
    population: "agreementStates",
    landing: agreementFigure("r2", "landing.maxDistance"),
    opticalPath: agreementFigure("r3"),
    geometricMtf: agreementFigure("r4"),
    waveMtf: agreementFigure("r6a"),
  };
  const gateHolds = rungs
    .filter((r) => r.mode === "gated")
    .every((r) => r.verdicts.every((v) => v.verdict === "PASS" || v.verdict === "UNSUPPORTED"));
  const statement = {
    kind: "validation-statement",
    sources: sources.map(({ file, baseline }) => ({
      file: `baselines/${file}`,
      sha256: sha256Hex(baselineText(baseline)),
    })),
    policy,
    configurations: suites.reduce((sum, s) => sum + s.configurations, 0),
    agreementConfigurations: eligible.length,
    agreementStates: eligible,
    agreementFigures,
    wavelengthsNm,
    suites,
    rungs,
    counterparts,
    z50Attribution: counterparts[0].coverage.some(
      (entry) =>
        entry.run === "nikkor-z50f12-best-ref" &&
        entry.fields.some((field) => field.field === 0.5 && field.class === "method"),
    )
      ? STATEMENT_Z50_ATTRIBUTION
      : null,
    notCovered: NOT_COVERED,
  };
  return { ...statement, supportable: statementSupport(statement, gateHolds) };
}

export type ValidationStatement = ReturnType<typeof buildStatement>;

/** Both deterministic texts; every prose sentence lives in wording.ts. */
export function renderStatement(inputs: readonly StatementInput[]) {
  const statement = buildStatement(inputs);
  const lines: string[] = [
    "# Validation statement",
    "",
    STATEMENT_TEXT.intro,
    "",
    "## Supportable sentence",
    "",
    statement.supportable,
    "",
    "## Rungs",
    "",
    STATEMENT_TEXT.counts,
    "",
    STATEMENT_TEXT.worst,
    "",
    STATEMENT_TEXT.population,
    "",
    "| Rung | Compares | Mode | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |",
    "|---|---|---|---:|---:|---:|---|---|",
  ];
  const row = (cells: readonly unknown[]) => `| ${cells.map((cell) => escapeCell(String(cell))).join(" | ")} |`;
  for (const rung of statement.rungs)
    lines.push(
      row([
        rung.rung,
        rung.compares,
        rung.mode,
        rung.configurations,
        rung.configurationPairs,
        rung.requestPairs,
        rung.verdicts.map((v) => `${v.count} ${v.verdict}`).join(", "),
        figureText(rung.worst),
      ]),
    );
  lines.push("", "### Limits and metric maxima", "");
  for (const rung of statement.rungs) {
    lines.push(
      `#### ${rung.rung}`,
      "",
      ...rung.limits.map(
        (limit) => `- ${limit.kind}: ${limit.metric} ${numberText(limit.value)}${limit.unit ? ` ${limit.unit}` : ""}`,
      ),
      ...rung.metrics.map((m) => `- ${figureText(m.worst)}; measured request pairs ${m.measuredRequests}`),
      ...Object.entries(rung.diagnostics).map(([name, count]) => `- ${name}: ${count}`),
      "",
    );
  }
  lines.push(
    "## External diffraction counterparts",
    "",
    STATEMENT_TEXT.counterparts,
    ...(statement.z50Attribution === null ? [] : ["", statement.z50Attribution]),
    "",
    "| Rung | Counterpart | Configurations | Rows | Classes | Worst in band | Worst set aside |",
    "|---|---|---:|---:|---|---|---|",
  );
  for (const c of statement.counterparts)
    lines.push(
      row([
        c.rung,
        c.engine,
        c.configurations,
        c.rows,
        canonicalJson(c.classes),
        figureText(c.worstBanded),
        figureText(c.worstSetAside),
      ]),
    );
  for (const c of statement.counterparts) {
    lines.push(
      "",
      `### ${c.rung}: ${c.engine}`,
      "",
      `- LV requested lines (nm): ${c.linesNm.join(", ")}`,
      `- Counterpart answered lines (nm): ${c.counterpartLinesNm.join(", ")}`,
      `- Requested fields: ${c.fields.join(", ")}`,
      `- Configurations with banded rows: ${c.bandedConfigurations}`,
      `- Selected chief-landing sorting limits (mm): ${c.sortingLimitsMm.map(numberText).join(", ")}`,
      `- Frequencies (cycles/mm): ${c.frequenciesPerMm.join(", ")}`,
      `- Row statuses: ${canonicalJson(c.statuses)}`,
      "",
      "| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |",
      "|---|---|---|---|---|---|---|",
    );
    for (const entry of c.coverage)
      lines.push(
        row([
          entry.suite,
          `${entry.run} / ${entry.request}`,
          entry.linesNm.join(", "),
          entry.counterpartLinesNm.join(", "),
          entry.fields.map((f) => `${f.field}: ${f.class ?? "unclassified"} / ${f.reason ?? "none"}`).join("; "),
          entry.bands.chiefLandingMm === null ? "none" : numberText(entry.bands.chiefLandingMm),
          entry.verdict,
        ]),
      );
  }
  lines.push("", "## States by suite", "", STATEMENT_TEXT.states, "");
  for (const suite of statement.suites) {
    lines.push(
      `### ${suite.suite}`,
      "",
      `- Declared: ${suite.declared}; configurations: ${suite.configurations}; refused: ${suite.declared - suite.configurations}`,
      "",
      "| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |",
      "|---|---|---|",
    );
    for (const state of suite.states)
      lines.push(
        row([
          state.run,
          state.caseId ?? state.problems.join("; "),
          statement.agreementStates.some((eligible) => eligible.suite === suite.suite && eligible.run === state.run)
            ? "yes"
            : "no",
        ]),
      );
    lines.push("");
  }
  lines.push(
    "## Not covered",
    "",
    ...statement.notCovered.flatMap((sentence) => [`- ${sentence}`, ""]),
    "## Sources",
    "",
    ...statement.sources.map((source) => `- ${source.file}: ${source.sha256}`),
    "",
  );
  const markdown = lines.join("\n");
  const problems = wordingProblems(markdown);
  if (problems.length) throw new Error(`statement wording: ${problems.join("; ")}`);
  return { statement, json: `${canonicalJson(statement)}\n`, markdown };
}
