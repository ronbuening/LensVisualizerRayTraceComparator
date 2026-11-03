// Phase 6's validation matrix: a pure reduction of the benchmark's two baselines, never a request to an engine.
// A row per LensVisualizer analysis tab names the rungs that cover it, with the counts the baselines hold of each
// baselined rung, and the quantity and engines alone of a rung that is in no baseline.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { baselineText, parseBaseline } from "../baseline/build.ts";
import type { Baseline, BaselineRun, BaselineRung, BaselineVerdictCount } from "../contract/baseline.ts";
import { VERDICTS } from "../contract/comparison.ts";
import type { Verdict } from "../contract/comparison.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { sha256Hex } from "../core/numeric/hash.ts";
import { escapeCell } from "./markdown.ts";
import type { StatementInput } from "./statement.ts";
import { MATRIX_ROWS, MATRIX_RUNGS, MATRIX_TEXT, NOT_COVERED, wordingProblems } from "./wording.ts";

/** The matrix reads the benchmark's rays and MTF baselines, and nothing else. */
export const MATRIX_SUITE = "benchmark";
export const MATRIX_FILES = [`${MATRIX_SUITE}.json`, `${MATRIX_SUITE}.mtf.json`] as const;
export const MATRIX_JSON = `reports/${MATRIX_SUITE}/validation-matrix.json`;
export const MATRIX_MARKDOWN = `reports/${MATRIX_SUITE}/validation-matrix.md`;

/**
 * The recorded rungs that are in no baseline (owner decisions, Phase 6): their quantity and the engines they are
 * asked of, as `RungDefinition` states them (a test holds the two together). The matrix gives no figure of them.
 */
export const UNBASELINED_RUNGS: Readonly<Record<string, { quantity: string; engines: readonly string[] }>> = {
  r7b: { quantity: "spot.native", engines: ["lv", "optiland"] },
  r8b: { quantity: "axial.native", engines: ["lv", "optiland"] },
  r9b: { quantity: "chief.native", engines: ["lv", "optiland"] },
  r10b: { quantity: "curvature.native", engines: ["lv", "optiland"] },
  r11b: { quantity: "vignetting.native", engines: ["flux", "lv"] },
  r12b: { quantity: "summary.native", engines: ["lv", "optiland"] },
  r13b: { quantity: "seidel.native", engines: ["optiland", "ref-seidel"] },
  r14b: { quantity: "zernike.native", engines: ["optiland", "optiland-wave"] },
};

/** Reads only the benchmark's two baselines, refusing a missing or invalid one before anything is written. */
export function readMatrixInputs(root: string): StatementInput[] {
  return MATRIX_FILES.map((file) => {
    const read = parseBaseline(readFileSync(join(root, "baselines", file), "utf8"));
    if ("problems" in read) throw new Error(`baselines/${file}: ${read.problems.join("; ")}`);
    return { file, baseline: read.baseline };
  });
}

interface RungRecord {
  readonly run: BaselineRun;
  readonly rung: BaselineRung;
  readonly files: readonly string[];
}

const verdictCounts = (values: readonly BaselineVerdictCount[]) =>
  VERDICTS.map((verdict) => ({
    verdict,
    count: values.filter((v) => v.verdict === verdict).reduce((sum, v) => sum + v.count, 0),
  })).filter((v) => v.count > 0);

/** A rung's counts over the benchmark, in the statement's units: configurations, configuration and request pairs. */
function rungCounts(records: readonly RungRecord[]) {
  const pairs = records.flatMap(({ rung }) => rung.pairs);
  const quantities = [...new Set(records.map(({ rung }) => rung.quantity))];
  if (quantities.length !== 1) throw new Error(`${records[0].rung.rung}: of several quantities`);
  const engines = [...new Set(records.flatMap(({ rung }) => rung.support.map((s) => s.engine)))].sort();
  return {
    quantity: quantities[0],
    baselines: [...new Set(records.flatMap(({ files }) => files))].sort().map((file) => `baselines/${file}`),
    engines,
    pairs: [...new Set(pairs.map((p) => `${p.a}/${p.b}`))].sort(),
    configurations: records.length,
    requests: records.reduce((sum, { rung }) => sum + rung.requests, 0),
    configurationPairs: pairs.length,
    requestPairs: pairs.reduce((sum, p) => sum + p.verdicts.reduce((n, v) => n + v.count, 0), 0),
    requestPairVerdicts: verdictCounts(pairs.flatMap((p) => p.verdicts)),
    configurationPairVerdicts: verdictCounts(pairs.map((p) => ({ verdict: p.verdict, count: 1 }))),
    support: engines.map((engine) => {
      const statuses = records.flatMap(({ rung }) => rung.support.filter((s) => s.engine === engine));
      return {
        engine,
        statuses: [...new Set(statuses.map((s) => s.status))]
          .sort()
          .map((status) => ({ status, configurations: statuses.filter((s) => s.status === status).length })),
      };
    }),
  };
}

/** Reduces the two baselines in a fixed order, R4 (in both) once, with MTF's measured counts set aside. */
export function buildMatrix(inputs: readonly StatementInput[]) {
  if (
    inputs.length !== MATRIX_FILES.length ||
    MATRIX_FILES.some((file) => inputs.filter((i) => i.file === file).length !== 1)
  )
    throw new Error("the validation matrix needs exactly the benchmark's rays and MTF baselines");
  const [rays, mtf] = MATRIX_FILES.map((file) => inputs.find((input) => input.file === file)!.baseline);
  for (const baseline of [rays, mtf])
    if (baseline.suite.name !== MATRIX_SUITE) throw new Error(`a baseline of ${baseline.suite.name}, not of benchmark`);
  if (
    canonicalJson(rays.suite) !== canonicalJson(mtf.suite) ||
    canonicalJson(rays.policy) !== canonicalJson(mtf.policy)
  )
    throw new Error("benchmark: the rays and MTF baselines differ in suite or policy");
  const inventory = (b: Baseline) => canonicalJson(b.runs.map(({ rungs: _rungs, ...run }) => run));
  if (inventory(rays) !== inventory(mtf)) throw new Error("benchmark: rays and MTF state inventories differ");
  const engines = new Map<string, Baseline["engines"][number]>();
  for (const engine of [...rays.engines, ...mtf.engines]) {
    const known = engines.get(engine.id);
    if (known !== undefined && canonicalJson(known) !== canonicalJson(engine))
      throw new Error(`benchmark: the engine ${engine.id} differs between the rays and MTF baselines`);
    engines.set(engine.id, engine);
  }
  const plain = (r: BaselineRung) => ({
    ...r,
    pairs: r.pairs.map((p) => ({ ...p, metrics: p.metrics.map(({ measured: _measured, ...metric }) => metric) })),
  });
  const records = new Map<string, RungRecord[]>();
  for (const run of rays.runs) {
    const other = mtf.runs.find((r) => r.name === run.name)!;
    const rungs = new Map<string, RungRecord>();
    for (const [file, list] of [
      [MATRIX_FILES[0], run.rungs],
      [MATRIX_FILES[1], other.rungs],
    ] as const) {
      for (const rung of list) {
        const previous = rungs.get(rung.rung);
        if (previous && canonicalJson(plain(previous.rung)) !== canonicalJson(plain(rung)))
          throw new Error(`benchmark/${run.name}/${rung.rung}: duplicate measurements differ`);
        rungs.set(rung.rung, { run, rung: previous?.rung ?? rung, files: [...(previous?.files ?? []), file] });
      }
    }
    for (const [id, record] of rungs) records.set(id, [...(records.get(id) ?? []), record]);
  }
  for (const id of records.keys())
    if (Object.hasOwn(UNBASELINED_RUNGS, id))
      throw new Error(`${id}: a rung kept out of every baseline is in the benchmark's baselines`);
  const rungOf = (id: string) => {
    const { mode, compares } = MATRIX_RUNGS[id];
    if (Object.hasOwn(UNBASELINED_RUNGS, id))
      return { rung: id, mode, compares, inBaseline: false as const, ...UNBASELINED_RUNGS[id] };
    const found = records.get(id);
    return found === undefined
      ? { rung: id, mode, compares, inBaseline: false as const }
      : { rung: id, mode, compares, inBaseline: true as const, ...rungCounts(found) };
  };
  const lv = engines.get("lv");
  return {
    kind: "validation-matrix",
    sources: MATRIX_FILES.map((file, index) => ({
      file: `baselines/${file}`,
      sha256: sha256Hex(baselineText([rays, mtf][index])),
    })),
    suite: rays.suite,
    policy: rays.policy,
    lensVisualizer:
      lv === undefined
        ? null
        : {
            fingerprint: lv.fingerprint,
            ...(lv.adapterRevision === undefined ? {} : { adapterRevision: lv.adapterRevision }),
            details: lv.details,
          },
    engines: [...engines.values()]
      .sort((a, b) => (a.id < b.id ? -1 : 1))
      .map(({ id, version, fingerprint, adapterRevision }) => ({
        id,
        version,
        fingerprint,
        ...(adapterRevision === undefined ? {} : { adapterRevision }),
      })),
    declared: rays.runs.length,
    configurations: rays.runs.filter((run) => run.caseId !== null).length,
    rows: MATRIX_ROWS.map((row) => ({
      tab: row.tab,
      title: row.title,
      about: row.about,
      gated: row.gated.map(rungOf),
      recorded: row.recorded.map(rungOf),
      notCovered: row.notCovered,
    })),
    notCovered: NOT_COVERED,
  };
}

export type ValidationMatrix = ReturnType<typeof buildMatrix>;
type MatrixRung = ValidationMatrix["rows"][number]["gated"][number];

const verdictText = (verdicts: readonly { verdict: Verdict; count: number }[]) =>
  verdicts.length === 0 ? "none" : verdicts.map((v) => `${v.count} ${v.verdict}`).join(", ");

/** Both deterministic texts; every prose sentence lives in wording.ts. */
export function renderMatrix(inputs: readonly StatementInput[]) {
  const matrix = buildMatrix(inputs);
  const row = (cells: readonly unknown[]) => `| ${cells.map((cell) => escapeCell(String(cell))).join(" | ")} |`;
  const lv = matrix.lensVisualizer;
  const detail = (name: string) => (lv === null || lv.details[name] === undefined ? "none" : String(lv.details[name]));
  const lines: string[] = [
    "# Validation matrix of benchmark",
    "",
    MATRIX_TEXT.intro,
    "",
    "## Inputs",
    "",
    "| Input | Value |",
    "|---|---|",
    row(["Suite", matrix.suite.name]),
    row(["Suite hash", matrix.suite.hash]),
    row(["Policy", `rungs v${matrix.policy.version}`]),
    row(["Policy hash", matrix.policy.hash]),
    row(["LensVisualizer commit", detail("commit")]),
    row(["LensVisualizer dirty", detail("dirty")]),
    row(["LensVisualizer engine closure", lv === null ? "none" : lv.fingerprint]),
    row(["LensVisualizer engine files", detail("engineFileCount")]),
    row(["Declared runs", matrix.declared]),
    row(["Configurations", matrix.configurations]),
    "",
    "| Engine | Version | Fingerprint | Adapter revision |",
    "|---|---|---|---|",
    ...matrix.engines.map((e) => row([e.id, e.version, e.fingerprint, e.adapterRevision ?? "none"])),
    "",
    "## Rows",
    "",
    "| Row | Gated rungs | Recorded rungs |",
    "|---|---|---|",
    ...matrix.rows.map((r) =>
      row([
        r.title,
        r.gated.map((g) => g.rung).join(", ") || "none",
        r.recorded.map((g) => g.rung).join(", ") || "none",
      ]),
    ),
    "",
    MATRIX_TEXT.counts,
    "",
    MATRIX_TEXT.gated,
    "",
    MATRIX_TEXT.recorded,
    "",
    MATRIX_TEXT.unbaselined,
    "",
  ];
  const countedRow = (r: Extract<MatrixRung, { inBaseline: true }>) =>
    row([
      r.rung,
      r.compares,
      r.quantity,
      r.engines.join(", "),
      r.configurations,
      r.configurationPairs,
      r.requestPairs,
      verdictText(r.requestPairVerdicts),
      verdictText(r.configurationPairVerdicts),
      r.support
        .filter((s) => s.statuses.some((status) => status.status !== "ok"))
        .map(
          (s) => `${s.engine}: ${s.statuses.map((status) => `${status.configurations} ${status.status}`).join(", ")}`,
        )
        .join("; ") || "every engine ok",
      r.baselines.join(", "),
    ]);
  const header =
    "| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |";
  const rule = "|---|---|---|---|---:|---:|---:|---|---|---|---|";
  for (const r of matrix.rows) {
    lines.push(`## ${r.title}`, "", r.about, "");
    for (const [heading, rungs] of [
      ["Gated", r.gated],
      ["Recorded", r.recorded],
    ] as const) {
      if (rungs.length === 0) continue;
      lines.push(`### ${heading}`, "");
      const counted = rungs.filter((g): g is Extract<MatrixRung, { inBaseline: true }> => g.inBaseline);
      if (counted.length > 0) lines.push(header, rule, ...counted.map(countedRow), "");
      const named = rungs.filter((g) => !g.inBaseline);
      if (named.length > 0)
        lines.push(
          "| Rung | Compares | Quantity | Engines | Baselines |",
          "|---|---|---|---|---|",
          ...named.map((g) =>
            "quantity" in g
              ? row([g.rung, g.compares, g.quantity, g.engines.join(", "), MATRIX_TEXT.inNoBaseline])
              : row([g.rung, g.compares, "none", "none", MATRIX_TEXT.absent]),
          ),
          "",
        );
    }
    lines.push("### Not covered", "", ...r.notCovered.flatMap((sentence) => [`- ${sentence}`, ""]));
  }
  lines.push(
    "## Not covered",
    "",
    MATRIX_TEXT.notCovered,
    "",
    ...matrix.notCovered.flatMap((sentence) => [`- ${sentence}`, ""]),
    "## Sources",
    "",
    ...matrix.sources.map((source) => `- ${source.file}: ${source.sha256}`),
    "",
  );
  const markdown = lines.join("\n");
  const problems = wordingProblems(markdown);
  if (problems.length) throw new Error(`validation matrix wording: ${problems.join("; ")}`);
  return { matrix, json: `${canonicalJson(matrix)}\n`, markdown };
}
