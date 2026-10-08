// The report model: everything a report of one run of a suite says, as data. It is what `report.json` holds and
// what the Markdown renderer lays out; a later dashboard reads the same.
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { COMPARISON_MODES, FAILING_VERDICTS, VERDICTS } from "../contract/comparison.ts";
import type {
  ComparisonMetric,
  ComparisonMode,
  ComparisonSet,
  PairComparison,
  Verdict,
} from "../contract/comparison.ts";
import type { Policy, RungClass, RungMode, RungPolicy } from "../contract/policy.ts";
import type { ResultStatus } from "../contract/result.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { jobDetail } from "../core/manifest.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { hashCanonical } from "../core/numeric/hash.ts";

/** An engine of the run, as the report names it. */
export type ReportEngine =
  | { readonly id: string; readonly status: "available"; readonly version: string; readonly fingerprint: string }
  | { readonly id: string; readonly status: "unavailable"; readonly code: string };

/** A run of the suite: its case, or why it was not started. */
export interface ReportRun {
  readonly name: string;
  readonly caseId: string | null;
  readonly problems: readonly string[];
}

/** How many pairs of one mode came to each verdict. */
export interface VerdictCounts {
  readonly mode: ComparisonMode;
  readonly counts: Readonly<Record<Verdict, number>>;
}

/** What one engine did with one request; "not-run" when it was not asked. */
export interface SupportCell {
  readonly engine: string;
  readonly status: ResultStatus | "not-run";
  /** The items of an "unsupported" and the code of an "error", in the manifest's codes. */
  readonly detail?: string;
}

/** One row of the support matrix: one request of one rung of one run, and every engine of the run. */
export interface SupportRow {
  readonly run: string;
  readonly rung: string;
  /** Which of the rung's requests this is, as "request 2 of 3"; null when the rung has one. */
  readonly request: string | null;
  /** One cell per engine of the report, in the order of `ReportModel.engines`. */
  readonly cells: readonly SupportCell[];
}

/** A metric as a column of a table: its name, its unit and the limit the policy judges it by, if it has one. */
export interface MetricColumn {
  readonly name: string;
  /** The unit; null when neither the policy nor any pair states one. */
  readonly unit: string | null;
  /** The tolerance of a gated rung or the attention band of a recorded one. */
  readonly limit?: number;
  readonly limitKind?: "tolerance" | "attention";
}

/** One row of a reference-vs-each table: one engine against the reference. */
export interface ReferenceRow {
  readonly engine: string;
  /** The pair's metric for each column of the section, or null where it has none. */
  readonly metrics: readonly (ComparisonMetric | null)[];
  readonly verdict: Verdict;
  readonly reason?: string;
}

/** One cell of a pairwise matrix: the verdict of two engines and the metric closest to, or furthest past, its limit. */
export interface PairwiseCell {
  readonly verdict: Verdict;
  readonly worst: ComparisonMetric | null;
}

/** The comparisons of one request of one rung of one run. */
export interface ReportSection {
  readonly run: string;
  readonly rung: string;
  readonly quantity: string;
  readonly requestId: string;
  /** Which of the rung's requests this is, as "request 2 of 3"; null when the rung has one. */
  readonly request: string | null;
  /** How the rung is compared and judged; null when the policy has no entry for it. */
  readonly mode: RungMode | null;
  readonly class: RungClass | null;
  readonly columns: readonly MetricColumn[];
  /** Every engine against the reference; null when the comparison was not made in that mode. */
  readonly referenceVsEach: { readonly reference: string; readonly rows: readonly ReferenceRow[] } | null;
  /**
   * Every engine against every other, as a square matrix over `engines`: `cells[i][j]` is the pair of
   * `engines[i]` and `engines[j]`, the same for `[j][i]`, and null on the diagonal. Null when the comparison was
   * not made in that mode.
   */
  readonly pairwise: {
    readonly engines: readonly string[];
    readonly cells: readonly (readonly (PairwiseCell | null)[])[];
  } | null;
}

/** A report of one run of a suite. */
export interface ReportModel {
  readonly contract: string;
  readonly kind: "report";
  readonly suite: { readonly name: string; readonly hash: string };
  readonly policy: { readonly version: number; readonly hash: string };
  /** Every engine of the run, sorted by id. */
  readonly engines: readonly ReportEngine[];
  /** Every run of the suite, in suite order. */
  readonly runs: readonly ReportRun[];
  /** The verdict counts of each mode, in the order of `COMPARISON_MODES`; all zero for a mode that was not compared. */
  readonly summary: readonly VerdictCounts[];
  /** How many pairs, over both modes, are `FAIL` or `ERROR`. */
  readonly failing: number;
  readonly support: readonly SupportRow[];
  /** One section per request, in the order of the comparisons. */
  readonly sections: readonly ReportSection[];
}

/**
 * Why a manifest, a comparison file and a policy do not belong together, as a list (empty when they do): the file
 * was made from another manifest, or judged by another policy. A report of such a three would show verdicts beside
 * limits and engines they were not reached with.
 */
export function reportInputProblems(manifest: RunManifest, comparisons: ComparisonFile, policy: Policy): string[] {
  const problems: string[] = [];
  if (comparisons.manifest !== hashCanonical(manifest))
    problems.push("the comparisons were made from another manifest");
  if (comparisons.policy !== hashCanonical(policy)) problems.push("the comparisons were judged by another policy");
  return problems;
}

/** How to tell the requests of each rung of each run apart: a label per request id, null where a rung has one. */
function requestLabels(manifest: RunManifest): (run: string, rung: string, requestId: string) => string | null {
  const requests = new Map<string, string[]>();
  for (const { run, rung, requestId } of manifest.jobs) {
    const key = JSON.stringify([run, rung]);
    const ids = requests.get(key) ?? [];
    if (!ids.includes(requestId)) requests.set(key, [...ids, requestId]);
  }
  return (run, rung, requestId) => {
    const ids = requests.get(JSON.stringify([run, rung])) ?? [];
    const position = ids.indexOf(requestId);
    return ids.length < 2 || position < 0 ? null : `request ${position + 1} of ${ids.length}`;
  };
}

/** The support matrix: one row per request in the order of the manifest's jobs, one cell per engine. */
function supportOf(manifest: RunManifest, labelOf: ReturnType<typeof requestLabels>): SupportRow[] {
  const rows = new Map<string, ManifestJob[]>();
  for (const job of manifest.jobs) {
    const key = JSON.stringify([job.run, job.rung, job.requestId]);
    rows.set(key, [...(rows.get(key) ?? []), job]);
  }
  return [...rows.values()].map((jobs): SupportRow => {
    const [{ run, rung, requestId }] = jobs;
    const cells = manifest.engines.map(({ id }): SupportCell => {
      const job = jobs.find((candidate) => candidate.engine === id);
      if (job === undefined) return { engine: id, status: "not-run" };
      const detail = jobDetail(job);
      return { engine: id, status: job.status, ...(detail === undefined ? {} : { detail }) };
    });
    return { run, rung, request: labelOf(run, rung, requestId), cells };
  });
}

/** The metric columns of a section: the metrics the policy names, by name, then any other a pair reports. */
function columnsOf(policy: RungPolicy | null, pairs: readonly PairComparison[]): MetricColumn[] {
  const reported = pairs.flatMap((pair) => pair.metrics);
  const gated = policy?.class === "gated";
  const columns = Object.entries(policy?.metrics ?? {})
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([name, { tolerance, attention, unit }]): MetricColumn => {
      const limit = gated ? tolerance : attention;
      if (limit === undefined) return { name, unit };
      return { name, unit, limit, limitKind: gated ? "tolerance" : "attention" };
    });
  for (const { name, unit } of reported) {
    if (!columns.some((column) => column.name === name)) columns.push({ name, unit });
  }
  return columns;
}

/**
 * The metric of a pair that is closest to its limit, or furthest past it: the one with the largest value in units
 * of its limit, where a value that is not finite counts as the largest of all. A metric without a limit is not
 * judged and comes after every metric with one, whatever its value. On a tie the earlier column wins. Null for a
 * pair without metrics.
 */
function worstOf(pair: PairComparison, columns: readonly MetricColumn[]): ComparisonMetric | null {
  let worst: ComparisonMetric | null = null;
  let worstScore = -Infinity;
  for (const { name, limit } of columns) {
    for (const metric of pair.metrics.filter((candidate) => candidate.name === name)) {
      let score = -1;
      if (limit !== undefined) {
        if (metric.value === null) score = Infinity;
        else score = limit > 0 ? metric.value / limit : metric.value > 0 ? Infinity : 0;
      }
      if (worst === null || score > worstScore) {
        worst = metric;
        worstScore = score;
      }
    }
  }
  return worst;
}

/** The section of one request from its sets: at most one of each mode. */
function sectionOf(
  sets: readonly ComparisonSet[],
  policy: Policy,
  labelOf: ReturnType<typeof requestLabels>,
): ReportSection {
  const [{ run, rung, quantity, requestId }] = sets;
  const rungPolicy = Object.hasOwn(policy.rungs, rung) ? policy.rungs[rung] : null;
  const columns = columnsOf(
    rungPolicy,
    sets.flatMap((set) => set.pairs),
  );
  const against = sets.find((set) => set.mode === "reference-vs-each");
  const each = sets.find((set) => set.mode === "pairwise");

  const referenceVsEach =
    against === undefined
      ? null
      : {
          reference: against.reference ?? "",
          rows: against.pairs.map((pair): ReferenceRow => {
            const metrics = columns.map(({ name }) => pair.metrics.find((metric) => metric.name === name) ?? null);
            const { b: engine, verdict, reason } = pair;
            return { engine, metrics, verdict, ...(reason === undefined ? {} : { reason }) };
          }),
        };
  const engines = each?.participants.map((participant) => participant.engine) ?? [];
  const pairwise =
    each === undefined
      ? null
      : {
          engines,
          cells: engines.map((row) =>
            engines.map((column): PairwiseCell | null => {
              const pair = each.pairs.find(({ a, b }) => (a === row && b === column) || (a === column && b === row));
              return pair === undefined ? null : { verdict: pair.verdict, worst: worstOf(pair, columns) };
            }),
          ),
        };
  return {
    run,
    rung,
    quantity,
    requestId,
    request: labelOf(run, rung, requestId),
    mode: rungPolicy?.mode ?? null,
    class: rungPolicy?.class ?? null,
    columns,
    referenceVsEach,
    pairwise,
  };
}

/**
 * Builds the report of one run of a suite from its manifest, its comparisons and the policy they were judged by.
 * A pure function: equal arguments give an equal model, and nothing in it depends on when or where it is built.
 *
 * - `engines` and `runs` are the manifest's, without what only an engine's maker reads (`details`).
 * - `summary` counts the pairs of each mode by verdict; `failing` is how many are `FAIL` or `ERROR`.
 * - `support` has a row for every request of the manifest, in the order of its jobs, and says for every engine how
 *   its job ended. It comes from the manifest alone, so it is the same whatever was compared.
 * - `sections` has one entry per request that was compared, in the order of the comparisons: the sets of one run,
 *   rung and request that follow each other are one section.
 *
 * It does not check that the three belong together; `reportInputProblems` does.
 */
export function buildReport(manifest: RunManifest, comparisons: ComparisonFile, policy: Policy): ReportModel {
  const labelOf = requestLabels(manifest);
  const summary = COMPARISON_MODES.map((mode): VerdictCounts => {
    const counts = Object.fromEntries(VERDICTS.map((verdict) => [verdict, 0])) as Record<Verdict, number>;
    for (const set of comparisons.comparisons) {
      if (set.mode === mode) for (const pair of set.pairs) counts[pair.verdict]++;
    }
    return { mode, counts };
  });
  const failing = summary.reduce(
    (total, { counts }) => total + FAILING_VERDICTS.reduce((sum, verdict) => sum + counts[verdict], 0),
    0,
  );

  const grouped: ComparisonSet[][] = [];
  for (const set of comparisons.comparisons) {
    const last = grouped.at(-1);
    const same =
      last !== undefined &&
      last[0].run === set.run &&
      last[0].rung === set.rung &&
      last[0].requestId === set.requestId &&
      !last.some((other) => other.mode === set.mode);
    if (same) last.push(set);
    else grouped.push([set]);
  }

  return {
    contract: CONTRACT_VERSION,
    kind: "report",
    suite: { name: manifest.suite.name, hash: manifest.suite.hash },
    policy: { version: policy.version, hash: hashCanonical(policy) },
    engines: manifest.engines.map((engine): ReportEngine => {
      if (engine.status === "unavailable") return { id: engine.id, status: "unavailable", code: engine.code };
      return { id: engine.id, status: "available", version: engine.version, fingerprint: engine.fingerprint };
    }),
    runs: manifest.runs.map(({ name, caseId, problems }) => ({ name, caseId, problems: [...problems] })),
    summary,
    failing,
    support: supportOf(manifest, labelOf),
    sections: grouped.map((sets) => sectionOf(sets, policy, labelOf)),
  };
}
