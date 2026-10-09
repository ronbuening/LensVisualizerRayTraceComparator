// The baseline of a compared run: what `lvrtc baseline write` commits. Built from the run's manifest, its
// comparisons and the policy, and from nothing else: equal inputs give an equal baseline, byte for byte.
import type { ComparisonFile } from "../compare/comparisonFile.ts";
import { baselineProblems } from "../contract/baseline.ts";
import type {
  Baseline,
  BaselineEngine,
  BaselinePair,
  BaselineRays,
  BaselineRun,
  BaselineRung,
  BaselineSupport,
} from "../contract/baseline.ts";
import type { ComparisonSet, PairComparison } from "../contract/comparison.ts";
import { gravestVerdict } from "../contract/baseline.ts";
import type { Policy } from "../contract/policy.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { CONTRACT_VERSION, isCompatibleContract } from "../contract/version.ts";
import { SOURCE_CHANGED, jobDetail } from "../core/manifest.ts";
import type { ManifestJob, RunManifest } from "../core/manifest.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { RAY_ENDINGS, finished, gather, verdictCounts } from "../report/floor.ts";
import type { Gathered } from "../report/floor.ts";

/**
 * What keeps the run of a manifest from being a baseline, as a list (empty when nothing does): an engine that
 * could not be used, a run that was not started, and a case source that changed while the suite ran. A baseline is
 * a record of what every engine it names answered about every run; verdicts are not looked at here.
 */
export function baselineWriteProblems(manifest: RunManifest): string[] {
  const problems: string[] = [];
  for (const engine of manifest.engines) {
    if (engine.status !== "available") problems.push(`engine ${engine.id} could not be used (${engine.code})`);
  }
  for (const run of manifest.runs) {
    if (run.caseId === null) problems.push(`run ${run.name} was not started`);
  }
  for (const kind of Object.keys(manifest.sources ?? {}).sort()) {
    if (manifest.sources?.[kind].status === SOURCE_CHANGED)
      problems.push(`the case source ${kind} changed during the run`);
  }
  return problems;
}

function byId<T>(key: (value: T) => string): (a: T, b: T) => number {
  return (a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
}

/** How the jobs of each engine ended in one rung of one run. */
function supportOf(jobs: readonly ManifestJob[]): BaselineSupport[] {
  const engines = [...new Set(jobs.map((job) => job.engine))].sort();
  return engines.map((engine): BaselineSupport => {
    const failed = jobs.find((job) => job.engine === engine && job.status !== "ok");
    if (failed === undefined) return { engine, status: "ok" };
    const detail = jobDetail(failed);
    return { engine, status: failed.status, ...(detail === undefined || detail === "" ? {} : { detail }) };
  });
}

/** How the rays of each engine ended, added up over the sets; empty for a rung whose answers record none. */
function raysOf(sets: readonly ComparisonSet[]): BaselineRays[] {
  const totals = new Map<string, number[]>();
  for (const set of sets) {
    for (const { engine, recorded } of set.participants) {
      RAY_ENDINGS.forEach((name, index) => {
        const [count] = recorded !== undefined && Object.hasOwn(recorded, name) ? recorded[name] : [];
        if (typeof count !== "number") return;
        const known = totals.get(engine) ?? RAY_ENDINGS.map(() => 0);
        totals.set(engine, known);
        known[index] += count;
      });
    }
  }
  return [...totals]
    .map(([engine, [ok, blocked, failed]]): BaselineRays => ({ engine, ok, blocked, failed }))
    .sort(byId((rays) => rays.engine));
}

/**
 * Builds the baseline of a compared run.
 *
 * For each run of the manifest that has a case, in suite order, and each rung that was compared, in the order of
 * the comparisons: how many requests there were, how each engine's jobs ended, how the rays of each engine ended,
 * and every pair of two engines over the requests. A pair is read from the pairwise set of a request, or, for a
 * request that was not compared pairwise, from its reference-vs-each set. Its verdicts are counted, its verdict is
 * the gravest of them, and each of its metrics is the sum of a metric counted in rays or elements and the largest
 * value of any other, with where that occurs and the tolerance the policy judges it by.
 *
 * The engines are those of the manifest that could be used, each with its fingerprint and adapter revision. A pure
 * function that reads no file and no clock.
 */
export function buildBaseline(manifest: RunManifest, comparisons: ComparisonFile, policy: Policy): Baseline {
  const engines = manifest.engines
    .flatMap((engine): BaselineEngine[] => {
      if (engine.status !== "available") return [];
      const { id, version, fingerprint, adapterRevision, details } = engine;
      return [{ id, version, fingerprint, ...(adapterRevision === undefined ? {} : { adapterRevision }), details }];
    })
    .sort(byId((engine) => engine.id));

  const runs = manifest.runs.flatMap((run): BaselineRun[] => {
    const { caseId } = run;
    if (caseId === null) return [];
    // One set per request: the pairwise one where there is one. A Map keeps the order of first appearance.
    const byRung = new Map<string, Map<string, ComparisonSet>>();
    for (const set of comparisons.comparisons) {
      if (set.run !== run.name) continue;
      const chosen = byRung.get(set.rung) ?? new Map<string, ComparisonSet>();
      byRung.set(set.rung, chosen);
      if (!chosen.has(set.requestId) || set.mode === "pairwise") chosen.set(set.requestId, set);
    }
    const rungs = [...byRung].map(([rung, chosen]): BaselineRung => {
      const sets = [...chosen.values()];
      const gathered = new Map<
        string,
        { a: string; b: string; pairs: PairComparison[]; metrics: Map<string, Gathered> }
      >();
      for (const set of sets) {
        for (const pair of set.pairs) {
          const [a, b] = [pair.a, pair.b].sort();
          const key = `${a}\0${b}`;
          const known = gathered.get(key) ?? { a, b, pairs: [], metrics: new Map<string, Gathered>() };
          gathered.set(key, known);
          known.pairs.push(pair);
          for (const metric of pair.metrics) gather(known.metrics, metric, run.name);
        }
      }
      const pairs = [...gathered.values()]
        .map(({ a, b, pairs: judged, metrics }): BaselinePair => {
          const verdicts = verdictCounts(judged);
          return {
            a,
            b,
            verdict: gravestVerdict(judged.map((pair) => pair.verdict)) ?? "ERROR",
            verdicts,
            metrics: [...metrics.values()].map((metric) => finished(metric, policy, rung, false)),
          };
        })
        .sort(byId((pair) => `${pair.a}\0${pair.b}`));
      const rays = raysOf(sets);
      return {
        rung,
        quantity: sets[0].quantity,
        requests: sets.length,
        support: supportOf(manifest.jobs.filter((job) => job.run === run.name && job.rung === rung)),
        ...(rays.length === 0 ? {} : { rays }),
        pairs,
      };
    });
    return [{ name: run.name, caseId, rungs }];
  });

  return {
    contract: CONTRACT_VERSION,
    kind: "baseline",
    suite: { name: manifest.suite.name, hash: manifest.suite.hash },
    policy: { version: policy.version, hash: hashCanonical(policy) },
    engines,
    runs,
  };
}

/** A baseline as its file holds it: canonical JSON and a newline. Equal baselines give equal text. */
export function baselineText(baseline: Baseline): string {
  return `${canonicalJson(baseline)}\n`;
}

/**
 * Reads the text of a baseline file. Returns the baseline, or the list of what keeps the text from being one: it
 * is not JSON, not a `baseline` by its schema, written to a contract this code cannot read, breaks a rule of a
 * baseline (`baselineProblems`), or is not the canonical text of what it holds, which is what a file edited by
 * hand looks like.
 */
export function parseBaseline(text: string): { baseline: Baseline } | { problems: string[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { problems: ["malformed JSON"] };
  }
  const issues = validateKind("baseline", parsed);
  if (issues.length > 0) return { problems: [`not a valid baseline: ${formatIssues(issues)}`] };
  const baseline = parsed as Baseline;
  if (!isCompatibleContract(baseline.contract)) return { problems: [`contract ${baseline.contract} cannot be read`] };
  const problems = baselineProblems(baseline);
  if (problems.length > 0) return { problems };
  if (baselineText(baseline) !== text) return { problems: ["the file is not the canonical text of its content"] };
  return { baseline };
}
