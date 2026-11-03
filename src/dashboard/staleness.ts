// Which reasons of staleness hold for each record of a baseline, against a basis of what is at hand. A record is
// stale by its case, an engine or the policy exactly as `checkBaseline` decides it (`STALE_REASONS`), but the
// dashboard runs nothing again, so it never says REFRESHABLE, DRIFT or MOVED: that is `lvrtc baseline check`'s.
// Pure: no file, no engine, no clock.
import { STALE_REASONS } from "../baseline/check.ts";
import type { StaleReason } from "../baseline/check.ts";
import type { Baseline, BaselineEngine } from "../contract/baseline.ts";
import type { ManifestEngine, RunManifest } from "../core/manifest.ts";
import type { AskedEngines } from "./identity.ts";
import type { Loaded } from "./sources.ts";

/**
 * Whom the engines of a baseline are held to: the engines as asked, as the suite's last run recorded them, or nothing
 * known. The engines are by id.
 */
export type EngineBasis =
  | { readonly kind: "asked" | "last-run"; readonly engines: ReadonlyMap<string, ManifestEngine> }
  | { readonly kind: "none" };

/** A run of the suite's last run, by its name: whether it is there, and its case (null for a run with none). */
export type CaseBasis =
  { readonly kind: "last-run"; readonly runs: ReadonlyMap<string, string | null> } | { readonly kind: "none" };

/** Everything a record's staleness is judged against. */
export interface StalenessBasis {
  /** The content hash of the policy at hand; null when it could not be read, and the policy reason is not known. */
  readonly policyHash: string | null;
  readonly engines: EngineBasis;
  readonly cases: CaseBasis;
}

/** What holds of one record. */
export interface RecordStaleness {
  /** The reasons that hold, in the order of `STALE_REASONS`. */
  readonly stale: readonly StaleReason[];
  /** The reasons that could not be judged, in the same order. */
  readonly notKnown: readonly StaleReason[];
  /** `STALE(<reasons>)`, `CURRENT` or `NOT KNOWN(<reasons>)`. */
  readonly badge: string;
}

/** An engine basis of a list of engines. */
export function engineBasisOf(kind: "asked" | "last-run", engines: readonly ManifestEngine[]): EngineBasis {
  return { kind, engines: new Map(engines.map((engine) => [engine.id, engine])) };
}

/** A case basis of the runs of a manifest. */
export function caseBasisOf(runs: readonly { readonly name: string; readonly caseId: string | null }[]): CaseBasis {
  return { kind: "last-run", runs: new Map(runs.map((run) => [run.name, run.caseId])) };
}

/**
 * The basis of a baseline: the engines as asked once they answered, else as the suite's last run recorded them (while
 * they are being asked, when they were not, or when asking failed), else none; the cases of the suite's last run,
 * else none; and the policy at hand.
 */
export function stalenessBasis(
  policyHash: string | null,
  asked: AskedEngines,
  lastRun: Loaded<RunManifest>,
): StalenessBasis {
  const engines: EngineBasis =
    asked.state === "asked"
      ? engineBasisOf("asked", asked.engines)
      : lastRun.state === "ok"
        ? engineBasisOf("last-run", lastRun.value.engines)
        : { kind: "none" };
  const cases: CaseBasis = lastRun.state === "ok" ? caseBasisOf(lastRun.value.runs) : { kind: "none" };
  return { policyHash, engines, cases };
}

/**
 * Whether one engine of a record is another today by the basis: true when the basis has it with another fingerprint
 * or adapter revision, or has it unavailable; false when it has it the same; null when the basis does not say (no
 * basis, or one that does not name the engine). An engine the baseline does not list is stale, as `checkBaseline`
 * judges it; `parseBaseline` refuses such a baseline (`baselineProblems`), so no page meets one.
 */
export function engineStale(engine: BaselineEngine | undefined, basis: EngineBasis): boolean | null {
  if (engine === undefined) return true;
  if (basis.kind === "none") return null;
  const now = basis.engines.get(engine.id);
  if (now === undefined) return null;
  if (now.status !== "available") return true;
  return now.fingerprint !== engine.fingerprint || now.adapterRevision !== engine.adapterRevision;
}

/** A run of the suite's last run, by the basis: not known, not there, or there with its case. */
export function caseNowOf(
  run: { readonly name: string },
  basis: CaseBasis,
): null | { readonly found: false } | { readonly found: true; readonly caseId: string | null } {
  if (basis.kind === "none") return null;
  return basis.runs.has(run.name) ? { found: true, caseId: basis.runs.get(run.name) ?? null } : { found: false };
}

/**
 * Whether a run's case is another today by the basis: true when the suite's last run has the run with another case
 * (or with none), false when with the same one, null when there is no last run or it has no run of that name.
 */
export function caseStale(
  run: { readonly name: string; readonly caseId: string | null },
  basis: CaseBasis,
): boolean | null {
  const now = caseNowOf(run, basis);
  return now === null || !now.found ? null : now.caseId !== run.caseId;
}

/** The badge of a record from what holds and what is not known. */
export function badgeOf(stale: readonly StaleReason[], notKnown: readonly StaleReason[]): string {
  if (stale.length > 0) return `STALE(${stale.join(",")})`;
  return notKnown.length === 0 ? "CURRENT" : `NOT KNOWN(${notKnown.join(",")})`;
}

/**
 * The staleness of the record of the engines `a` and `b` in the run `run` of `baseline`, by `basis`: stale by its
 * case when the run's case is another, by an engine when either of its two is another, and by the policy when the
 * baseline's policy hash is not that of the policy at hand.
 */
export function recordStaleness(
  baseline: Baseline,
  run: { readonly name: string; readonly caseId: string | null },
  a: string,
  b: string,
  basis: StalenessBasis,
): RecordStaleness {
  const engineOf = (id: string): BaselineEngine | undefined => baseline.engines.find((engine) => engine.id === id);
  const engines = [a, b].map((id) => engineStale(engineOf(id), basis.engines));
  const held: Record<StaleReason, boolean | null> = {
    case: caseStale(run, basis.cases),
    engine: engines.includes(true) ? true : engines.includes(null) ? null : false,
    policy: basis.policyHash === null ? null : baseline.policy.hash !== basis.policyHash,
  };
  const stale = STALE_REASONS.filter((reason) => held[reason] === true);
  const notKnown = STALE_REASONS.filter((reason) => held[reason] === null);
  return { stale, notKnown, badge: badgeOf(stale, notKnown) };
}
