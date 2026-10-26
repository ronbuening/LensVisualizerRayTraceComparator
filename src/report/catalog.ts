// Statistics use only the two catalog baselines. No engine, prescription, census file or clock is read.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { baselineText, parseBaseline } from "../baseline/build.ts";
import type { Baseline, BaselinePair, BaselineRun, BaselineRung } from "../contract/baseline.ts";
import { gravestVerdict } from "../contract/baseline.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { sha256Hex } from "../core/numeric/hash.ts";
import { escapeCell } from "./markdown.ts";
import { CATALOG_TEXT, NOT_COVERED, wordingProblems } from "./wording.ts";

export const CATALOG_FILES = ["catalog.json", "catalog.mtf.json"] as const;
export const CATALOG_JSON = "reports/catalog.json";
export const CATALOG_MARKDOWN = "reports/catalog.md";
export interface CatalogInput {
  readonly file: string;
  readonly baseline: Baseline;
}
export function readCatalogInputs(root: string): CatalogInput[] {
  return CATALOG_FILES.flatMap((file) => {
    const path = join(root, "baselines", file);
    if (!existsSync(path)) return [];
    const read = parseBaseline(readFileSync(path, "utf8"));
    if ("problems" in read) throw new Error(`${file}: ${read.problems.join("; ")}`);
    return [{ file, baseline: read.baseline }];
  });
}
const counts = (values: readonly string[]) =>
  Object.fromEntries([...new Set(values)].sort().map((key) => [key, values.filter((v) => v === key).length]));
const codeOf = (problem: string) => problem.split(":", 1)[0];
const row = (cells: readonly unknown[]) => `| ${cells.map((c) => escapeCell(String(c))).join(" | ")} |`;

/** Linear interpolation at (n-1)p; pair figures are rung aggregates, never raw request samples. */
export function quantiles(values: readonly number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p: number) => {
    if (!sorted.length) return null;
    const i = (sorted.length - 1) * p,
      lo = Math.floor(i),
      fraction = i - lo;
    return sorted[lo] + fraction * (sorted[Math.ceil(i)] - sorted[lo]);
  };
  return { min: at(0), median: at(0.5), p90: at(0.9), p99: at(0.99), max: at(1) };
}

export function renderCatalog(inputs: readonly CatalogInput[]) {
  if (
    inputs.some(
      (i) => !CATALOG_FILES.includes(i.file as (typeof CATALOG_FILES)[number]) || i.baseline.suite.name !== "catalog",
    ) ||
    new Set(inputs.map((i) => i.file)).size !== inputs.length
  )
    throw new Error("catalog needs only its two named baselines, each once");
  const ordered = CATALOG_FILES.flatMap((file) => inputs.filter((i) => i.file === file));
  if (
    ordered.length === 2 &&
    (ordered[0].baseline.suite.hash !== ordered[1].baseline.suite.hash ||
      canonicalJson(ordered[0].baseline.runs.map((r) => r.name)) !==
        canonicalJson(ordered[1].baseline.runs.map((r) => r.name)))
  )
    throw new Error("catalog baselines describe different suite inventories");
  const runs = new Map<string, BaselineRun>();
  const records = new Map<string, { run: string; rung: BaselineRung; pair: BaselinePair }>();
  for (const { baseline } of ordered)
    for (const run of baseline.runs) {
      const before = runs.get(run.name);
      if (before && before.caseId !== null && run.caseId !== null && before.caseId !== run.caseId)
        throw new Error(`${run.name}: catalog state or source problems differ between baselines`);
      if (
        before &&
        before.caseId !== null &&
        run.caseId !== null &&
        canonicalJson(before.features) !== canonicalJson(run.features)
      )
        throw new Error(`${run.name}: catalog feature inventories differ`);
      if (run.features === undefined) throw new Error(`${run.name}: catalog feature inventory is missing`);
      runs.set(run.name, {
        ...run,
        // A run refused by either pass (e.g. folded confirmation of the MTF pass's fine sets) counts as refused.
        caseId: before?.caseId === null ? null : run.caseId,
        features: [...new Set([...(before?.features ?? []), ...(run.features ?? [])])].sort(),
        problems: [...new Set([...(before?.problems ?? []), ...(run.problems ?? [])])].sort(),
        censusReasons: [
          ...new Set([
            ...(before?.censusReasons ?? []),
            ...(run.censusReasons ?? []),
            ...(run.censusReasons ?? (run.problems ?? []).map(codeOf)),
          ]),
        ].sort(),
      });
      for (const rung of run.rungs)
        for (const pair of rung.pairs) {
          const key = `${run.name}\0${rung.rung}\0${pair.a}\0${pair.b}`;
          const prior = records.get(key);
          // Rays lack measured counts; compare every common figure and retain MTF's detailed pair.
          if (prior) {
            const simple = (p: BaselinePair) => ({ ...p, metrics: p.metrics.map(({ measured: _ignored, ...m }) => m) });
            if (
              rung.requests !== prior.rung.requests ||
              canonicalJson(simple(pair)) !== canonicalJson(simple(prior.pair))
            )
              throw new Error(`${run.name} ${rung.rung}: duplicate catalog figures differ`);
          }
          records.set(key, { run: run.name, rung, pair });
        }
    }
  const rows = [...records.values()];
  const runStatus = (name: string) =>
    gravestVerdict([
      ...rows.filter((r) => r.run === name).map((r) => r.pair.verdict),
      ...(runs.get(name)?.caseId === null ? ["UNSUPPORTED" as const] : []),
    ]) ?? "UNSUPPORTED";
  const reasons = [
    ...new Set([...runs.values()].flatMap((run) => run.censusReasons ?? (run.problems ?? []).map(codeOf))),
  ].sort();
  const flags = [...new Set([...runs.values()].flatMap((run) => run.features ?? []))].sort();
  const group = (selected: BaselineRun[]) => ({
    states: selected.length,
    statuses: counts(selected.map((r) => runStatus(r.name))),
    pairs: counts(rows.filter((r) => selected.some((s) => s.name === r.run)).map((r) => r.pair.verdict)),
  });
  const metricNames = [
    ...new Set(
      rows.flatMap((r) =>
        r.pair.metrics.filter((m) => m.tolerance !== undefined).map((m) => `${r.rung.rung}\0${m.name}\0${m.unit}`),
      ),
    ),
  ].sort();
  const metrics = metricNames.map((key) => {
    const [rung, name, unit] = key.split("\0");
    const figures = rows
      .filter((r) => r.rung.rung === rung)
      .flatMap((r) =>
        r.pair.metrics
          .filter((m) => m.name === name && m.tolerance !== undefined)
          .map((m) => ({
            run: r.run,
            engines: [r.pair.a, r.pair.b],
            value: m.value,
            measured: m.measured ?? null,
            where: m.where ?? null,
          })),
      );
    const finite = figures.flatMap((f) => (f.value === null ? [] : [f.value]));
    const worst = [...figures]
      .sort(
        (a, b) =>
          (b.value ?? Infinity) - (a.value ?? Infinity) ||
          (a.run < b.run
            ? -1
            : a.run > b.run
              ? 1
              : a.engines.join() < b.engines.join()
                ? -1
                : a.engines.join() > b.engines.join()
                  ? 1
                  : 0),
      )
      .slice(0, 10);
    return {
      rung,
      name,
      unit,
      pairs: figures.length,
      nonfinite: figures.length - finite.length,
      quantiles: quantiles(finite),
      worst,
    };
  });
  const unsupported = rows.flatMap(({ run, rung }) =>
    rung.support
      .filter((s) => s.status === "unsupported")
      .flatMap((s) =>
        (s.detail ?? "unspecified")
          .split(", ")
          // An item is "<code> <item>" (jobDetail); the item says what was refused, so it is kept.
          .map((item) => `${run}\0${rung.rung}\0${s.engine}\0${item}`),
      ),
  );
  const failures = rows
    .filter((r) => r.pair.verdict === "FAIL")
    .map(({ run, rung, pair }) => ({
      run,
      rung: rung.rung,
      engines: [pair.a, pair.b],
      classifications: pair.failures ?? [],
    }));
  if (failures.some((f) => !f.classifications.length)) throw new Error("catalog contains an unclassified FAIL");
  const report = {
    complete: CATALOG_FILES.every((file) => inputs.some((i) => i.file === file)),
    sources: ordered.map((i) => ({
      file: `baselines/${i.file}`,
      sha256: sha256Hex(baselineText(i.baseline)),
      policy: i.baseline.policy,
    })),
    states: runs.size,
    statuses: counts([...runs.keys()].map(runStatus)),
    pairs: counts(rows.map((r) => r.pair.verdict)),
    byFeature: Object.fromEntries(
      flags.map((flag) => [flag, group([...runs.values()].filter((r) => r.features?.includes(flag)))]),
    ),
    byCensusReason: Object.fromEntries(
      reasons.map((code) => [
        code,
        group([...runs.values()].filter((r) => (r.censusReasons ?? (r.problems ?? []).map(codeOf)).includes(code))),
      ]),
    ),
    unsupported: {
      source: counts(
        [...runs.values()].flatMap((r) => [...new Set(r.censusReasons ?? (r.problems ?? []).map(codeOf))]),
      ),
      engineRungs: counts([...new Set(unsupported)].map((key) => key.split("\0")[3])),
    },
    metrics,
    failures,
  };
  const lines = [
    "# Catalog statistics",
    "",
    report.complete ? CATALOG_TEXT.complete : CATALOG_TEXT.pending,
    "",
    CATALOG_TEXT.units,
    "",
    "## Status counts",
    "",
    row(["Scope", "States", "State statuses", "Pair statuses"]),
    "|---|---|---|---|",
    row(["catalog", report.states, JSON.stringify(report.statuses), JSON.stringify(report.pairs)]),
  ];
  for (const [kind, groups] of [
    ["Feature", report.byFeature],
    ["Census reason", report.byCensusReason],
  ] as const)
    for (const [name, g] of Object.entries(groups))
      lines.push(row([`${kind}: ${name}`, g.states, JSON.stringify(g.statuses), JSON.stringify(g.pairs)]));
  lines.push(
    "",
    "## Unsupported census",
    "",
    CATALOG_TEXT.census,
    "",
    row(["Code", "Source states", "Engine rungs"]),
    "|---|---|---|",
  );
  for (const code of [
    ...new Set([...Object.keys(report.unsupported.source), ...Object.keys(report.unsupported.engineRungs)]),
  ].sort())
    lines.push(row([code, report.unsupported.source[code] ?? 0, report.unsupported.engineRungs[code] ?? 0]));
  lines.push("", "## Gated pair figures", "", CATALOG_TEXT.quantiles, "");
  for (const metric of metrics) {
    lines.push(
      `### ${metric.rung} / ${metric.name} (${metric.unit})`,
      "",
      row(["Pairs", "Nonfinite", "Min", "Median", "p90", "p99", "Max"]),
      "|---|---|---|---|---|---|---|",
      row([metric.pairs, metric.nonfinite, ...Object.values(metric.quantiles)]),
      "",
      row(["Run", "Engines", "Value"]),
      "|---|---|---|",
    );
    for (const f of metric.worst) lines.push(row([f.run, f.engines.join(" / "), f.value]));
    lines.push("");
  }
  lines.push(
    "## Classified FAILs",
    "",
    CATALOG_TEXT.failures,
    "",
    row(["Run", "Rung", "Engines", "Metric", "Class", "Gotcha", "Reproducer"]),
    "|---|---|---|---|---|---|---|",
  );
  for (const f of failures)
    for (const c of f.classifications)
      lines.push(row([f.run, f.rung, f.engines.join(" / "), c.metric, c.class, c.gotcha, c.reproducer]));
  lines.push(
    "",
    "## Sources",
    "",
    ...report.sources.map((s) => `- ${s.file}: ${s.sha256}`),
    "",
    "## Not covered",
    "",
    ...NOT_COVERED.flatMap((t) => [`- ${t}`, ""]),
  );
  const markdown = lines.join("\n");
  const problems = wordingProblems(markdown);
  if (problems.length) throw new Error(`catalog wording: ${problems.join("; ")}`);
  return { report, json: `${canonicalJson(report)}\n`, markdown };
}
