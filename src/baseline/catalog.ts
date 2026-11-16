import { CONTRACT_VERSION_1_6, contractMinor } from "../contract/version.ts";
// Failure admission of the suites that list known failures (`KNOWN_FAILURE_SUITES`): the catalog, and since the owner's
// decision of 2026-11-16 focus-stations. Comparison verdicts and policy limits are never changed here.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { FAILURE_LIST_SUITES } from "../contract/baseline.ts";
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

/**
 * The suites whose baselines admit a FAIL listed exactly in their file of known failures (`knownFailuresFile`): the
 * catalog, a dated snapshot whose list keeps the ids it was written with, and focus-stations, whose list is at today's
 * ids (the owner's decision of 2026-11-16). A FAIL or ERROR of any other suite is never committed.
 */
export const KNOWN_FAILURE_SUITES: readonly string[] = FAILURE_LIST_SUITES;

/** Whether a suite's baselines admit listed failures. */
export function listsKnownFailures(suite: string): boolean {
  return KNOWN_FAILURE_SUITES.includes(suite);
}

/**
 * The file of known failures of a suite, relative to the repository root: the catalog's `docs/known-failures.json`,
 * kept byte for byte with its snapshot, and `docs/known-failures.<suite>.json` for another suite.
 */
export function knownFailuresFile(suite: string): string {
  return suite === "catalog" ? KNOWN_FAILURES : `docs/known-failures.${suite}.json`;
}

/** The name of a one-run reproducer suite of a suite's state (`bin/catalog-case.mjs`): never the suite's own name. */
export function reproducerSuiteName(suite: string): string {
  return `${suite}-repro`;
}

/**
 * The known failures of a suite (the catalog's when no suite is named); none for a suite that lists none, or for a
 * suite other than the catalog whose file is not there (the catalog's list is required, as its snapshot names it).
 */
export function readKnownFailures(root: string, suite = "catalog"): KnownFailure[] {
  if (!listsKnownFailures(suite)) return [];
  const file = join(root, knownFailuresFile(suite));
  if (suite !== "catalog" && !existsSync(file)) return [];
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
      // A reproducer of the snapshot names its checks by --rungs; one written since the rename by --checks.
      !/^node bin\/lvrtc\.mjs run \S+\.json --(?:rungs|checks) \S+ --jobs [1-4]$/.test(entry.reproducer) ||
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

/**
 * Admit only exact, individually classified failing metrics; ERROR can never be admitted. Of a suite that lists known
 * failures (`KNOWN_FAILURE_SUITES`); any other baseline is returned as it is. A baseline other than the catalog's
 * (which states contract 1.6 for its feature inventory already) states 1.6 exactly where it carries a classification,
 * the annotation that minor added.
 */
export function classifyCatalog(baseline: Baseline, known: readonly KnownFailure[]): Baseline {
  if (!listsKnownFailures(baseline.suite.name)) return baseline;
  const classified: Baseline = {
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
  if (baseline.suite.name === "catalog") return classified;
  const annotated = classified.runs.some((run) =>
    run.rungs.some((rung) => rung.pairs.some((pair) => pair.failures !== undefined)),
  );
  const minor = contractMinor(baseline.contract) ?? 0;
  return annotated && minor < 6 ? { ...classified, contract: CONTRACT_VERSION_1_6 } : classified;
}

/**
 * The listed failures that no classification of the baselines at hand uses: a stale entry would otherwise stay in the
 * list, and out of the report, after its FAIL changed or went away. Of the catalog's baselines every entry must be
 * used; for another suite see `pendingKnownFailures`.
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

/**
 * The listed failures of a suite other than the catalog whose run no committed baseline of the suite holds: pending,
 * listed ahead of the refresh that writes the run, and neither used nor unused until then. An entry whose run a
 * baseline holds is held as the catalog's are: it must classify a FAIL exactly, or `unusedKnownFailures` names it.
 */
export function pendingKnownFailures(
  baselines: readonly Baseline[],
  known: readonly KnownFailure[],
): { readonly pending: KnownFailure[]; readonly held: KnownFailure[] } {
  const runs = new Set(baselines.flatMap((baseline) => baseline.runs.map((run) => run.name)));
  return { pending: known.filter((k) => !runs.has(k.run)), held: known.filter((k) => runs.has(k.run)) };
}

/**
 * The entries of a list of known failures whose run is none of `runs`: an entry that can never be met (a run name
 * mistyped, or a station LensVisualizer renumbered), which would otherwise stay pending for ever. `baseline write`
 * refuses a rays baseline that holds no run of an entry; `baseline check` names an entry whose run is in neither the
 * committed baseline nor today's run (code `known-failure-of-no-run`).
 */
export function knownFailuresOfNoRun(known: readonly KnownFailure[], runs: Iterable<string>): KnownFailure[] {
  const names = new Set(runs);
  return known.filter((k) => !names.has(k.run));
}

/** An entry as a line names it: run, check, the two engines and the figure. */
export function knownFailureText(k: KnownFailure): string {
  return `${k.run} ${k.rung} ${k.engines.join(" ")} ${k.metric}`;
}
