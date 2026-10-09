// The numerical-floor digest of a compared run: for the engine the policy gives a floor, against the policy's
// arbiter, the worst figure of every metric per run and rung, the verdicts, and how the rays ended. It is what is
// committed of a benchmark: numbers, lens keys and hashes, and nothing an engine traced.
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { numberText, whereText } from "../compare/metricText.ts";
import { VERDICTS } from "../contract/comparison.ts";
import type { ComparisonMetric, ComparisonSet, PairComparison, Verdict } from "../contract/comparison.ts";
import type { Policy, RungFloor } from "../contract/policy.ts";
import type { EngineDetails } from "../contract/result.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import type { RunManifest } from "../core/manifest.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { formatFixed } from "../core/numeric/format.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { escapeCell } from "./markdown.ts";

/** The units a metric is counted in: such a metric is added up over the requests of a rung, any other is a maximum. */
export const COUNT_UNITS: readonly string[] = ["rays", "elements"];

/** The recorded values of a `rays.trace` answer that say how its rays ended, in the order they are listed. */
export const RAY_ENDINGS = ["rays.ok", "rays.blocked", "rays.failed"] as const;

/** An engine of the digest: who answered. */
export interface FloorEngine {
  readonly id: string;
  /** The content hash of the engine's own code; null for an engine that could not be described. */
  readonly fingerprint: string | null;
  /** The hash of the comparator's code behind the engine, for an engine that states one. */
  readonly adapterRevision?: string;
  /** What the engine says of itself beside its hashes: a commit, a dirty flag, a file count. */
  readonly details: EngineDetails;
}

/** One metric over the requests of one rung of one run. */
export interface FloorMetric {
  readonly name: string;
  readonly unit: string;
  /**
   * The largest value over the requests, or their sum for a metric counted in rays or elements; null when a value
   * is not a finite number, and when no request measured the metric.
   */
  readonly value: number | null;
  /** Where the largest value occurs, for a metric that is a maximum. */
  readonly where?: ComparisonMetric["where"];
  /** The tolerance the policy judges the metric by, when it judges it. */
  readonly tolerance?: number;
}

/** One run and rung: the pairs of the two engines over the rung's requests. */
export interface FloorRow {
  readonly run: string;
  readonly rung: string;
  /** How many requests of the rung the two engines were compared on. */
  readonly requests: number;
  /** How many of those pairs came to each verdict, in the order of `VERDICTS`, without the verdicts none came to. */
  readonly verdicts: readonly { readonly verdict: Verdict; readonly count: number }[];
  readonly metrics: readonly FloorMetric[];
  /** How the rays of each of the two engines ended, added up over the requests; left out by a rung without rays. */
  readonly rays?: {
    readonly [engine: string]: { readonly ok: number; readonly blocked: number; readonly failed: number };
  };
}

/**
 * A run of the digest and the content hash of its case: what its figures are of, whatever the checkout the case was
 * made from has become since.
 */
export interface FloorRun {
  readonly name: string;
  readonly caseId: string | null;
}

/** One rung over every run: the verdicts, and the worst of every metric with the run it occurs in. */
export interface FloorRung {
  readonly rung: string;
  readonly quantity: string;
  readonly requests: number;
  readonly verdicts: FloorRow["verdicts"];
  readonly metrics: readonly (FloorMetric & { readonly run?: string })[];
}

/** The digest of one compared run of a suite. */
export interface FloorReport {
  readonly contract: string;
  readonly kind: "floor-report";
  readonly suite: { readonly name: string; readonly hash: string };
  readonly policy: { readonly version: number; readonly hash: string };
  /** The engine with the floor, and the engine it is held to. */
  readonly engine: FloorEngine;
  readonly arbiter: FloorEngine;
  /** Every run that has a row, in suite order, with its case. */
  readonly runs: readonly FloorRun[];
  /** Every rung that was compared, in ladder order. */
  readonly rungs: readonly FloorRung[];
  /** Every run and rung that was compared: runs in suite order, and for each its rungs in ladder order. */
  readonly rows: readonly FloorRow[];
}

/**
 * The engine with a floor and its arbiter, as the policy names them; undefined for a policy without a floor. Throws
 * when two rungs name different ones: a digest is of one engine against one arbiter.
 */
export function floorOf(policy: Policy): RungFloor | undefined {
  let found: RungFloor | undefined;
  for (const rung of Object.keys(policy.rungs).sort()) {
    const { floor } = policy.rungs[rung];
    if (floor === undefined) continue;
    if (found !== undefined && (found.engine !== floor.engine || found.arbiter !== floor.arbiter)) {
      throw new Error("the policy names more than one floor: a digest is of one engine against one arbiter");
    }
    found = floor;
  }
  return found;
}

function engineOf(manifest: RunManifest, id: string): FloorEngine {
  const engine = manifest.engines.find((candidate) => candidate.id === id);
  if (engine === undefined || engine.status !== "available") return { id, fingerprint: null, details: {} };
  const { fingerprint, adapterRevision, details } = engine;
  return { id, fingerprint, ...(adapterRevision === undefined ? {} : { adapterRevision }), details };
}

/** A metric being gathered over requests. */
export interface Gathered {
  name: string;
  unit: string;
  value: number | null;
  where?: ComparisonMetric["where"];
  seen: boolean;
  run?: string;
}

/** Takes one more value of a metric: a count is added, any other value kept when it is the largest so far. */
export function gather(into: Map<string, Gathered>, metric: ComparisonMetric, run: string): void {
  const known = into.get(metric.name) ?? { name: metric.name, unit: metric.unit, value: 0, seen: false };
  into.set(metric.name, known);
  const first = !known.seen;
  known.seen = true;
  // A value that is not a number makes the whole not a number, and stays.
  if (known.value === null && !first) return;
  if (metric.value === null) return void Object.assign(known, { value: null, where: metric.where, run });
  if (COUNT_UNITS.includes(metric.unit)) known.value = (known.value ?? 0) + metric.value;
  else if (first || metric.value > (known.value ?? 0)) {
    Object.assign(known, { value: metric.value, where: metric.where, run });
  }
}

export function finished(
  gathered: Gathered,
  policy: Policy,
  rung: string,
  withRun: boolean,
): FloorMetric & { run?: string } {
  const { name, unit, value, where, run } = gathered;
  const judged = Object.hasOwn(policy.rungs, rung) ? policy.rungs[rung].metrics[name] : undefined;
  const counted = COUNT_UNITS.includes(unit);
  return {
    name,
    unit,
    value,
    ...(where === undefined || counted ? {} : { where }),
    ...(judged?.tolerance === undefined ? {} : { tolerance: judged.tolerance }),
    ...(withRun && run !== undefined && !counted ? { run } : {}),
  };
}

export function verdictCounts(pairs: readonly PairComparison[]): FloorRow["verdicts"] {
  return VERDICTS.map((verdict) => ({
    verdict,
    count: pairs.filter((pair) => pair.verdict === verdict).length,
  })).filter(({ count }) => count > 0);
}

/**
 * Builds the digest of a compared run for the engine `floor.engine` against `floor.arbiter`.
 *
 * It reads the pairs of those two engines, from the pairwise sets of the comparisons and, for a run that was not
 * compared pairwise, from its reference-vs-each sets. For each run and rung: how many requests the pair was
 * compared on, the verdicts they came to, and each metric over those requests: the sum of a metric counted in rays
 * or elements (`COUNT_UNITS`), and the largest value of any other, with where it occurs. A rung of traced rays
 * also states how the rays of each engine ended, added up over the requests. For each rung, the same over every
 * run, each maximum with the run it occurs in. Each run that has a row is listed with the content hash of its
 * case, which says what was traced where an engine's commit and its dirty flag cannot: a checkout whose lens files
 * are being edited.
 *
 * A pure function: equal arguments give an equal digest. It holds nothing but names, counts, hashes and the
 * metrics of the comparisons.
 */
export function buildFloorReport(
  manifest: RunManifest,
  comparisons: ComparisonFile,
  policy: Policy,
  floor: RungFloor,
): FloorReport {
  const isPair = (pair: PairComparison): boolean =>
    (pair.a === floor.engine && pair.b === floor.arbiter) || (pair.a === floor.arbiter && pair.b === floor.engine);
  // One set per request: the pairwise one where there is one.
  const chosen = new Map<string, ComparisonSet>();
  for (const set of comparisons.comparisons) {
    if (!set.pairs.some(isPair)) continue;
    const key = JSON.stringify([set.run, set.rung, set.requestId]);
    if (!chosen.has(key) || set.mode === "pairwise") chosen.set(key, set);
  }

  const rows: FloorRow[] = [];
  const rungOrder: string[] = [];
  const byRung = new Map<string, { quantity: string; pairs: PairComparison[]; metrics: Map<string, Gathered> }>();
  const rowKeys: string[] = [];
  const byRow = new Map<string, ComparisonSet[]>();
  for (const set of chosen.values()) {
    const key = JSON.stringify([set.run, set.rung]);
    if (!byRow.has(key)) rowKeys.push(key);
    byRow.set(key, [...(byRow.get(key) ?? []), set]);
    if (!rungOrder.includes(set.rung)) rungOrder.push(set.rung);
  }
  for (const key of rowKeys) {
    const sets = byRow.get(key) as ComparisonSet[];
    const [{ run, rung, quantity }] = sets;
    const pairs = sets.map((set) => set.pairs.find(isPair) as PairComparison);
    const metrics = new Map<string, Gathered>();
    const overall = byRung.get(rung) ?? { quantity, pairs: [], metrics: new Map<string, Gathered>() };
    byRung.set(rung, overall);
    overall.pairs.push(...pairs);
    for (const pair of pairs) {
      for (const metric of pair.metrics) {
        gather(metrics, metric, run);
        gather(overall.metrics, metric, run);
      }
    }

    const endings = [floor.engine, floor.arbiter].map((engine): [string, number[]] | null => {
      const totals = RAY_ENDINGS.map(() => 0);
      let stated = false;
      for (const set of sets) {
        const recorded = set.participants.find((participant) => participant.engine === engine)?.recorded;
        RAY_ENDINGS.forEach((name, index) => {
          const [count] = recorded !== undefined && Object.hasOwn(recorded, name) ? recorded[name] : [];
          if (typeof count !== "number") return;
          stated = true;
          totals[index] += count;
        });
      }
      return stated ? [engine, totals] : null;
    });
    const rays = Object.fromEntries(
      endings.flatMap((ending) => {
        if (ending === null) return [];
        const [engine, [ok, blocked, failed]] = ending;
        return [[engine, { ok, blocked, failed }]];
      }),
    );
    rows.push({
      run,
      rung,
      requests: sets.length,
      verdicts: verdictCounts(pairs),
      metrics: [...metrics.values()].map((gathered) => finished(gathered, policy, rung, false)),
      ...(Object.keys(rays).length === 0 ? {} : { rays }),
    });
  }

  return {
    contract: CONTRACT_VERSION,
    kind: "floor-report",
    suite: { name: manifest.suite.name, hash: manifest.suite.hash },
    policy: { version: policy.version, hash: hashCanonical(policy) },
    engine: engineOf(manifest, floor.engine),
    arbiter: engineOf(manifest, floor.arbiter),
    runs: manifest.runs
      .filter((run) => rows.some((row) => row.run === run.name))
      .map(({ name, caseId }) => ({ name, caseId })),
    rungs: rungOrder.map((rung): FloorRung => {
      const { quantity, pairs, metrics } = byRung.get(rung) as NonNullable<ReturnType<typeof byRung.get>>;
      return {
        rung,
        quantity,
        requests: pairs.length,
        verdicts: verdictCounts(pairs),
        metrics: [...metrics.values()].map((gathered) => finished(gathered, policy, rung, true)),
      };
    }),
    rows,
  };
}

function table(header: readonly string[], rows: readonly (readonly string[])[]): string[] {
  const line = (cells: readonly string[]): string => `| ${cells.map(escapeCell).join(" | ")} |`;
  return [line(header), `|${header.map(() => "---").join("|")}|`, ...rows.map(line)];
}

function count(value: number): string {
  return formatFixed(value, 0);
}

function verdictText(verdicts: FloorRow["verdicts"]): string {
  return verdicts.map(({ verdict, count: pairs }) => `${count(pairs)} ${verdict}`).join(", ") || "—";
}

function valueText(metric: FloorMetric | undefined, withWhere: boolean): string {
  if (metric === undefined) return "—";
  if (metric.value === null) return "not finite";
  return `${numberText(metric.value)}${withWhere ? whereText(metric.where) : ""}`;
}

function headingOf(metric: FloorMetric): string {
  const unit = metric.unit === "1" ? "" : ` ${metric.unit}`;
  if (metric.tolerance === undefined) return unit === "" ? metric.name : `${metric.name} [${unit.trim()}]`;
  return `${metric.name} (≤ ${numberText(metric.tolerance)}${unit})`;
}

function detailText(details: EngineDetails): string {
  const said = Object.keys(details)
    .sort()
    .map((key) => `${key} ${String(details[key])}`);
  return said.join(", ") || "—";
}

/**
 * The digest as Markdown. A pure function of the digest: equal digests give equal text, with LF line endings and
 * one newline at the end.
 *
 * The sections, in order: what was compared with what (suite, policy, the two engines with their hashes and what
 * they say of themselves, which for LensVisualizer is its commit, and each run with the hash of its case); for
 * each rung the verdicts and the worst of every metric over the whole suite, with the run and the place; and for
 * each rung a table with a row per run.
 */
export function renderFloorMarkdown(report: FloorReport): string {
  const { engine, arbiter } = report;
  const lines: string[] = [
    `# Numerical floor of ${engine.id} against ${arbiter.id}: ${report.suite.name}`,
    "",
    `Every pair of \`${engine.id}\` and \`${arbiter.id}\` of the suite, rung by rung: the largest value of each metric`,
    "over the requests of a run (its fields and lines), the verdicts those pairs came to, and how the rays of each",
    "engine ended. A metric counted in rays or elements is added up over the requests. Nothing here is traced or",
    "authored data: only results, counts, run names and hashes. The hash of a run's case is that of the system and",
    "the conditions that were traced: it says what the figures are of, whatever the lens files have become since.",
    "",
    "## Inputs",
    "",
  ];
  const engineRows = [engine, arbiter].map(({ id, fingerprint, adapterRevision, details }) => [
    id,
    fingerprint ?? "—",
    adapterRevision ?? "—",
    detailText(details),
  ]);
  lines.push(
    ...table(
      ["Input", "Value"],
      [
        ["Suite", report.suite.name],
        ["Suite hash", report.suite.hash],
        ["Contract version", report.contract],
        ["Policy", `rungs v${count(report.policy.version)}`],
        ["Policy hash", report.policy.hash],
      ],
    ),
    "",
    ...table(["Engine", "Fingerprint", "Adapter revision", "Details"], engineRows),
    "",
    ...(report.runs.length === 0
      ? []
      : [
          ...table(
            ["Run", "Case"],
            report.runs.map((run) => [run.name, run.caseId ?? "—"]),
          ),
          "",
        ]),
    "## Worst figures",
  );
  for (const rung of report.rungs) {
    lines.push(
      "",
      `### ${rung.rung}`,
      "",
      `Quantity \`${rung.quantity}\`: ${count(rung.requests)} pairs, ${verdictText(rung.verdicts)}.`,
      "",
    );
    const rows = rung.metrics.map((metric) => [
      headingOf(metric),
      valueText(metric, false),
      metric.run ?? "—",
      whereText(metric.where).replace(/^ at /, "") || "—",
    ]);
    lines.push(...table(["Metric", "Worst, or total", "Run", "Where"], rows));
  }
  lines.push("", "## By run");
  for (const rung of report.rungs) {
    const rows = report.rows.filter((row) => row.rung === rung.rung);
    const withRays = rows.some((row) => row.rays !== undefined);
    const header = [
      "Run",
      "Requests",
      "Verdicts",
      ...rung.metrics.map(headingOf),
      ...(withRays ? [engine, arbiter].map(({ id }) => `${id} rays ok / blocked / failed`) : []),
    ];
    const body = rows.map((row) => [
      row.run,
      count(row.requests),
      verdictText(row.verdicts),
      ...rung.metrics.map(({ name }) =>
        valueText(
          row.metrics.find((metric) => metric.name === name),
          false,
        ),
      ),
      ...(withRays
        ? [engine, arbiter].map(({ id }) => {
            const rays = row.rays !== undefined && Object.hasOwn(row.rays, id) ? row.rays[id] : undefined;
            return rays === undefined ? "—" : [rays.ok, rays.blocked, rays.failed].map(count).join(" / ");
          })
        : []),
    ]);
    lines.push("", `### ${rung.rung}`, "", ...table(header, body));
  }
  return `${lines.join("\n")}\n`;
}

/** The names of the digest's two files for an engine: `<engine>-floor.json` and `<engine>-floor.md`. */
export function floorFileNames(engine: string): { readonly json: string; readonly markdown: string } {
  return { json: `${engine}-floor.json`, markdown: `${engine}-floor.md` };
}

/**
 * The digest of a manifest, its comparisons and the policy they were judged by, as the texts of its two files: the
 * digest (`buildFloorReport`) as canonical JSON and a newline, and `renderFloorMarkdown` of it. A pure function:
 * equal arguments give equal texts, byte for byte.
 */
export function renderFloorReport(
  manifest: RunManifest,
  comparisons: ComparisonFile,
  policy: Policy,
  floor: RungFloor,
): { json: string; markdown: string } {
  const report = buildFloorReport(manifest, comparisons, policy, floor);
  return { json: `${canonicalJson(report)}\n`, markdown: renderFloorMarkdown(report) };
}
