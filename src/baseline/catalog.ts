import { CONTRACT_VERSION_1_6 } from "../contract/version.ts";
// Catalog-only failure admission. Comparison verdicts and policy limits are never changed here.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Baseline, BaselinePair } from "../contract/baseline.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { readRunCase, readRunManifest } from "../core/manifest.ts";
import { UsageError } from "../core/usageError.ts";

export const FAILURE_CLASSES = ["unsupported", "data", "convention", "numerical", "method"] as const;
export interface KnownFailure {
  readonly run: string;
  readonly rung: string;
  readonly engines: readonly [string, string];
  readonly metric: string;
  readonly class: (typeof FAILURE_CLASSES)[number];
  readonly gotcha: string;
  readonly reproducer: string;
  /** Exact requests and complete pair figures, including verdict counts and locations. */
  readonly evidenceHash: string;
}
export type FailureClass = Pick<KnownFailure, "metric" | "class" | "gotcha" | "reproducer" | "evidenceHash">;

export function failureEvidence(requests: number, pair: BaselinePair): string {
  const { failures: _ignored, ...figures } = pair;
  return hashCanonical({
    requests,
    pair: { ...figures, metrics: figures.metrics.map(({ measured: _ignored, ...metric }) => metric) },
  });
}

/** The list of classified catalog failures, relative to the repository root. */
export const KNOWN_FAILURES = "docs/known-failures.json";

export function readKnownFailures(root: string): KnownFailure[] {
  const file = join(root, KNOWN_FAILURES);
  let entries: unknown;
  try {
    entries = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new UsageError(`${file}: cannot read known failures: ${String(error)}`);
  }
  if (!Array.isArray(entries)) throw new UsageError(`${file}: expected a list`);
  const seen = new Set<string>();
  for (const entry of entries) {
    if (
      !entry ||
      typeof entry !== "object" ||
      !["run", "rung", "metric", "gotcha", "reproducer", "evidenceHash"].every(
        (k) => typeof entry[k] === "string" && entry[k].length > 0,
      ) ||
      !FAILURE_CLASSES.includes(entry.class) ||
      !Array.isArray(entry.engines) ||
      entry.engines.length !== 2 ||
      !entry.engines.every((e: unknown) => typeof e === "string") ||
      !(entry.engines[0] < entry.engines[1]) ||
      !/^docs\/gotchas\.md#[a-z0-9-]+$/.test(entry.gotcha) ||
      !/^node bin\/lvrtc\.mjs run \S+\.json --rungs \S+ --jobs [1-4]$/.test(entry.reproducer) ||
      !/^[0-9a-f]{64}$/.test(entry.evidenceHash)
    )
      throw new UsageError(`${file}: malformed known failure`);
    const key = JSON.stringify([entry.run, entry.rung, entry.engines, entry.metric]);
    if (seen.has(key)) throw new UsageError(`${file}: duplicate known failure ${key}`);
    seen.add(key);
  }
  return entries as KnownFailure[];
}

/** Attach flags from validated run cases; refuse missing cases rather than inventing feature counts. */
export function catalogFeatures(baseline: Baseline, directory: string): Baseline {
  if (baseline.suite.name !== "catalog") return baseline;
  const manifest = readRunManifest(directory);
  return {
    ...baseline,
    contract: CONTRACT_VERSION_1_6,
    runs: baseline.runs.map((run) => {
      const source = manifest.runs.find((r) => r.name === run.name);
      const codes = [
        ...new Set(
          [
            ...(run.problems ?? []),
            ...(source?.raySets?.problems ?? []),
            ...(source?.fineRaySets?.problems ?? []),
            ...(source?.recipe?.problems ?? []),
            ...(source?.recipe?.recipe?.fields.flatMap((f) => (f.problem ? [f.problem] : [])) ?? []),
          ].map((p) => p.split(":", 1)[0]),
        ),
      ].sort();
      const opticalCase = run.caseId === null ? undefined : readRunCase(directory, run.caseId);
      if (run.caseId !== null && !opticalCase) throw new UsageError(`${run.name}: catalog case missing or invalid`);
      return { ...run, features: opticalCase?.features ?? [], censusReasons: codes };
    }),
  };
}

/** Admit only exact, individually classified failing metrics; ERROR can never be admitted. */
export function classifyCatalog(baseline: Baseline, known: readonly KnownFailure[]): Baseline {
  if (baseline.suite.name !== "catalog") return baseline;
  return {
    ...baseline,
    runs: baseline.runs.map((run) => ({
      ...run,
      rungs: run.rungs.map((rung) => ({
        ...rung,
        pairs: rung.pairs.map((pair) => {
          const { failures: _ignored, ...plain } = pair;
          if (pair.verdict !== "FAIL") return plain;
          const failed = pair.metrics.filter(
            (m) => m.tolerance !== undefined && (m.value === null || m.value > m.tolerance),
          );
          const evidenceHash = failureEvidence(rung.requests, pair);
          const failures = failed.flatMap((metric) => {
            const entry = known.find(
              (k) =>
                k.run === run.name &&
                k.rung === rung.rung &&
                k.engines[0] === pair.a &&
                k.engines[1] === pair.b &&
                k.metric === metric.name &&
                k.evidenceHash === evidenceHash,
            );
            return entry
              ? [
                  {
                    metric: entry.metric,
                    class: entry.class,
                    gotcha: entry.gotcha,
                    reproducer: entry.reproducer,
                    evidenceHash,
                  },
                ]
              : [];
          });
          return failed.length > 0 && failures.length === failed.length ? { ...plain, failures } : plain;
        }),
      })),
    })),
  };
}

/**
 * The listed failures that no classification of the catalog baselines at hand uses: a stale entry would otherwise
 * stay in the list, and out of the report, after its FAIL changed or went away.
 */
export function unusedKnownFailures(baselines: readonly Baseline[], known: readonly KnownFailure[]): string[] {
  const used = new Set(
    baselines.flatMap((baseline) =>
      baseline.runs.flatMap((run) =>
        run.rungs.flatMap((rung) =>
          rung.pairs.flatMap((pair) =>
            (pair.failures ?? []).map((f) =>
              JSON.stringify([run.name, rung.rung, pair.a, pair.b, f.metric, f.evidenceHash]),
            ),
          ),
        ),
      ),
    ),
  );
  return known
    .filter((k) => !used.has(JSON.stringify([k.run, k.rung, k.engines[0], k.engines[1], k.metric, k.evidenceHash])))
    .map((k) => `${k.run} ${k.rung} ${k.engines.join(" ")} ${k.metric}`);
}

export function unclassifiedFailures(baseline: Baseline): string[] {
  return baseline.runs.flatMap((run) =>
    run.rungs.flatMap((rung) =>
      rung.pairs.flatMap((pair) =>
        pair.verdict === "ERROR" || (pair.verdict === "FAIL" && !pair.failures?.length)
          ? [`${run.name} ${rung.rung} ${pair.a} ${pair.b} ${pair.verdict}`]
          : [],
      ),
    ),
  );
}
