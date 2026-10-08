// The orchestrator: runs a loaded suite. For every run, every selected rung and every selected engine it asks the
// rung's requests of the engine, unless the store already holds the answer, and writes down how each job ended.
// Jobs run one after another, in an order fixed by the suite, the rungs and the engine ids.
import { join } from "node:path";

import type { OpticalCase } from "../contract/case.ts";
import { engineStamp } from "../contract/engine.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import { makeRequest } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { makeResult } from "../contract/result.ts";
import type { ResultEnvelope } from "../contract/result.ts";
import type { RunSpec } from "../contract/runSpec.ts";
import { formatIssues } from "../contract/schemas.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import { EngineUnavailableError, enginesText } from "../engines/adapter.ts";
import type { EngineAdapter, EngineUnavailableCode } from "../engines/adapter.ts";
import type { EngineRegistry } from "../engines/registry.ts";
import { QUANTITIES } from "../quantities/index.ts";
import type { QuantityModule } from "../quantities/module.ts";
import { SOURCE_CHANGED, writeRunOutput } from "./manifest.ts";
import type { ManifestEngine, ManifestJob, ManifestRaySets, ManifestSource, RunManifest } from "./manifest.ts";
import { negotiate } from "./negotiate.ts";
import { resultDataProblems } from "./resultData.ts";
import { STORE_DIRECTORY, createResultStore, storeKey } from "./resultStore.ts";
import type { ResultStore } from "./resultStore.ts";
import { raySetId } from "../rays/raySets.ts";
import type { RaySetResolution } from "../rays/raySets.ts";
import { NO_RUNG_INPUTS, RUNGS, selectRungs } from "./rungs.ts";
import type { RungDefinition, RungInputs } from "./rungs.ts";
import type { CaseSources, LoadedSuite } from "./suite.ts";
import { UsageError } from "./usageError.ts";

/** The `error.code` of an "ok" result whose data is not the quantity's data, or holds an array that does not decode. */
export const INVALID_DATA = "invalid-data";

/**
 * How a job came by its status, which the manifest does not say:
 *
 * - `computed`: the engine was asked;
 * - `cached`: the store held the answer;
 * - `negotiated`: the engine's descriptor says it cannot answer, so it was not asked;
 * - `unavailable`: the engine could not be used at all.
 */
export type JobSource = "computed" | "cached" | "negotiated" | "unavailable";

/** One finished job: what the manifest records, and what only the console is told. */
export interface JobOutcome {
  readonly job: ManifestJob;
  readonly source: JobSource;
  /**
   * For people, and never stored: the message of an "error", the messages of an "unsupported"; null otherwise.
   * It may hold whatever an engine or the system wrote, absolute paths included.
   */
  readonly detail: string | null;
}

/** What `runSuite` is given. */
export interface RunSuiteInput {
  readonly suite: LoadedSuite;
  /** The engines that can be run. Each one used is created once, for the whole suite, and closed at the end. */
  readonly registry: EngineRegistry;
  /** The directory that holds the store and, under the suite's name, the output of the run. */
  readonly runsDir: string;
  /**
   * The case sources the suite was loaded with. Each one that serves a run of the suite and can audit itself is
   * recorded in the manifest and asked, when the last job has ended, whether its inputs are still the same. The
   * source of a run's lens is also what generates the run's ray sets, for a rung that needs them.
   */
  readonly sources?: CaseSources;
  /**
   * Engine ids for every run, in place of each run's own `engines` and of the default, every configured engine.
   * A built-in engine is run only where it is named, here or by a run.
   */
  readonly engines?: readonly string[];
  /** Rung ids for every run, in place of each run's own `rungs` and of the default, every rung that is judged. */
  readonly rungs?: readonly string[];
  /** The rungs there are; `RUNGS` unless given. */
  readonly rungDefinitions?: readonly RungDefinition[];
  /** Called with each job as it finishes, in manifest order. */
  readonly onJob?: (outcome: JobOutcome) => void;
}

/** What `runSuite` did. */
export interface SuiteRunResult {
  /** The manifest as written. */
  readonly manifest: RunManifest;
  /** Where it was written: `<runsDir>/<suite name>/manifest.json`. */
  readonly manifestPath: string;
  /** Every job with how it came by its status, in the order of `manifest.jobs`. */
  readonly outcomes: readonly JobOutcome[];
  /**
   * What went wrong without failing a job: a store entry that could not be trusted, an engine that did not close,
   * a case source that changed during the run.
   */
  readonly warnings: readonly string[];
}

/** One job before it is run. */
interface PlannedJob {
  readonly run: string;
  readonly opticalCase: OpticalCase;
  readonly rung: RungDefinition;
  readonly quantity: QuantityModule;
  readonly engineId: string;
  /** The rung's request, with the options the run states for this engine. */
  readonly request: QuantityRequest;
}

/** An engine for the length of a suite: reached and described, or found unusable. */
type EngineSession =
  | { readonly kind: "ready"; readonly adapter: EngineAdapter; readonly descriptor: EngineDescriptor }
  | { readonly kind: "unavailable"; readonly code: EngineUnavailableCode; readonly message: string };

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Runs `select`, and says which run asked when what it selected does not exist. */
function forRun<T>(run: string, select: () => T): T {
  try {
    return select();
  } catch (error) {
    if (error instanceof UsageError) throw new UsageError(`run ${run}: ${error.message}`, { cause: error });
    throw error;
  }
}

/** The engines a registry has: the ones its configuration defines, and the built-in ones. */
interface KnownEngines {
  readonly configured: readonly string[];
  readonly builtin: readonly string[];
}

/**
 * The engine ids that `ids` name, sorted and each once. Throws a `UsageError` naming every id that is neither a
 * configured nor a built-in engine, and for an empty list, which asks for nothing.
 */
function selectEngines(ids: readonly string[], known: KnownEngines): string[] {
  const { configured, builtin } = known;
  const unknown = [...new Set(ids)].filter((id) => !configured.includes(id) && !builtin.includes(id));
  if (unknown.length > 0) {
    const named = unknown.map((id) => JSON.stringify(id)).join(", ");
    const engines = unknown.length > 1 ? "engines" : "engine";
    throw new UsageError(`unknown ${engines} ${named}: ${enginesText(configured, builtin)}`);
  }
  if (ids.length === 0) throw new UsageError(`no engine was named: ${enginesText(configured, builtin)}`);
  return [...new Set(ids)].sort();
}

/**
 * The engines of a run that names none: every configured engine. Throws a `UsageError` when the configuration
 * defines none: a built-in engine is run only where it is named.
 */
function defaultEngines(known: KnownEngines): string[] {
  if (known.configured.length > 0) return [...known.configured];
  const hint = `name the engines to run with --engines (built in: ${known.builtin.join(", ")})`;
  throw new UsageError(`it names no engine and the configuration defines none: ${hint}`);
}

/** The requests a rung builds for a case, checked: a rung that builds anything else is a defect of the rung. */
function requestsOf(
  rung: RungDefinition,
  quantity: QuantityModule,
  opticalCase: OpticalCase,
  spec: RunSpec,
  inputs: RungInputs,
) {
  const requests = rung.buildRequests(opticalCase, spec, inputs);
  const seen = new Set<string>();
  for (const request of requests) {
    const defect = (text: string): Error => new Error(`rung ${rung.id}: it built a request ${text}`);
    if (request.quantity !== rung.quantity) throw defect(`for ${request.quantity}, not for its ${rung.quantity}`);
    if (request.caseId !== opticalCase.id) throw defect(`about case ${request.caseId}, not ${opticalCase.id}`);
    const issues = quantity.validateSpec(request.spec);
    if (issues.length > 0) throw defect(`whose spec is not a ${rung.quantity} spec: ${formatIssues(issues)}`);
    if (seen.has(request.id)) throw defect(`twice (${request.id})`);
    seen.add(request.id);
  }
  return requests;
}

/** Why a run has no ray sets when the source of its case has no generator, or no source was given. */
const NO_RAY_SOURCE = "ray-sets-unavailable: no case source generates rays for this lens";

/**
 * The ray sets of one run, from the source of its lens (`CaseSource.raySets`); none, and the problem that says so,
 * when no source was given for the lens or the source has no rays to give.
 */
async function raySetsOf(input: RunSuiteInput, spec: RunSpec, opticalCase: OpticalCase): Promise<RaySetResolution> {
  const source = input.sources?.[spec.lens.kind];
  if (source?.raySets === undefined) return { sets: [], problems: [NO_RAY_SOURCE] };
  return source.raySets(spec, opticalCase);
}

/** Every job of a suite before it is run, and the ray sets that were generated for its runs. */
interface Plan {
  readonly jobs: readonly PlannedJob[];
  /** The ray sets of each run that a rung needed them for, by run name. */
  readonly raySets: ReadonlyMap<string, ManifestRaySets>;
}

/**
 * Every job of the suite, in manifest order, with nothing run and no engine contacted. What was asked for is
 * checked for every run, also one that cannot be run, so that a rung or an engine that does not exist is reported
 * whatever else is wrong. The ray sets of a run are generated here, once, and only when a rung that needs them is
 * one of the run's.
 */
async function planJobs(input: RunSuiteInput): Promise<Plan> {
  const { suite, registry, rungDefinitions = RUNGS } = input;
  if (suite.name.toLowerCase() === STORE_DIRECTORY) {
    throw new UsageError(`a suite cannot be named "${suite.name}": the runs directory keeps the result store there`);
  }
  const known: KnownEngines = { configured: registry.ids(), builtin: registry.builtinIds() };
  if (known.configured.length + known.builtin.length === 0) {
    throw new UsageError("no engine to run: the configuration defines no engine");
  }
  const rungsAsked = input.rungs === undefined ? undefined : selectRungs(input.rungs, rungDefinitions);
  const enginesAsked = input.engines === undefined ? undefined : selectEngines(input.engines, known);

  // What was asked for is checked for every run before anything is generated for one.
  const selected = suite.runs.map(({ spec }) => ({
    rungs: rungsAsked ?? forRun(spec.name, () => selectRungs(spec.rungs, rungDefinitions)),
    engineIds:
      enginesAsked ??
      forRun(spec.name, () =>
        spec.engines === undefined ? defaultEngines(known) : selectEngines(spec.engines, known),
      ),
  }));

  const jobs: PlannedJob[] = [];
  const raySets = new Map<string, ManifestRaySets>();
  for (const [index, { spec, opticalCase }] of suite.runs.entries()) {
    const { rungs, engineIds } = selected[index];
    if (opticalCase === null) continue;
    let inputs = NO_RUNG_INPUTS;
    if (rungs.some((rung) => rung.needsRaySets === true)) {
      const { sets, problems } = await raySetsOf(input, spec, opticalCase);
      inputs = { raySets: sets };
      raySets.set(spec.name, { sets: sets.map(raySetId), problems: [...problems] });
    }
    for (const rung of rungs) {
      const quantity = QUANTITIES.get(rung.quantity);
      if (quantity === undefined) throw new Error(`rung ${rung.id}: ${rung.quantity} is not a quantity`);
      const requests = requestsOf(
        rung,
        quantity,
        opticalCase,
        spec,
        rung.needsRaySets === true ? inputs : NO_RUNG_INPUTS,
      );
      for (const engineId of engineIds) {
        // An own key: an engine id such as "constructor" must not find what every object inherits.
        const options = spec.sampling?.engines;
        const engineOptions = options !== undefined && Object.hasOwn(options, engineId) ? options[engineId] : undefined;
        for (const built of requests) {
          const { caseId, spec: requestSpec } = built;
          const request =
            engineOptions === undefined
              ? built
              : makeRequest({ caseId, quantity: built.quantity, spec: requestSpec, engineOptions });
          jobs.push({ run: spec.name, opticalCase, rung, quantity, engineId, request });
        }
      }
    }
  }
  return { jobs, raySets };
}

/** A planned job as the manifest records it, with how it ended. */
function jobOf(
  planned: PlannedJob,
  ending: Pick<ManifestJob, "status" | "storeKey" | "unsupported" | "error">,
): ManifestJob {
  return {
    run: planned.run,
    caseId: planned.opticalCase.id,
    rung: planned.rung.id,
    quantity: planned.rung.quantity,
    requestId: planned.request.id,
    engine: planned.engineId,
    ...ending,
  };
}

/** A job's outcome from the result that ended it; `key` is the store key the result is kept under, if it is kept. */
function outcomeOf(planned: PlannedJob, result: ResultEnvelope, key: string | null, source: JobSource): JobOutcome {
  const { status, unsupported = [], error } = result;
  if (status === "unsupported") {
    const items = unsupported.map(({ code, item }) => ({ code, item }));
    const detail = unsupported.map((item) => item.message).join("; ");
    return { job: jobOf(planned, { status, storeKey: key, unsupported: items }), source, detail };
  }
  if (status === "error") {
    const job = jobOf(planned, { status, storeKey: key, error: { code: error?.code ?? "unknown" } });
    return { job, source, detail: error?.message ?? null };
  }
  return { job: jobOf(planned, { status, storeKey: key }), source, detail: null };
}

/** What is wrong with the data of a result; nothing, for a result that is not "ok" and so carries none to check. */
function dataProblems(quantity: QuantityModule, result: ResultEnvelope): string[] {
  return result.status === "ok" ? resultDataProblems(quantity, result.data) : [];
}

/** One request to ask of an engine that has been reached and described. */
export interface EngineQuestion {
  readonly adapter: EngineAdapter;
  /** What the adapter's `describe()` gave. */
  readonly descriptor: EngineDescriptor;
  /** The module of the request's quantity, which the answer's data is held to. */
  readonly quantity: QuantityModule;
  /** The request, with the options it carries for this engine. */
  readonly request: QuantityRequest;
  readonly opticalCase: OpticalCase;
  readonly store: ResultStore;
  /** A store entry that cannot be trusted is said here. */
  readonly warnings: string[];
}

/** An engine's answer to one request, and how it was come by. */
export interface EngineAnswer {
  readonly result: ResultEnvelope;
  /** The key the result is kept under in the store; null for a result that is not kept. */
  readonly storeKey: string | null;
  readonly source: Exclude<JobSource, "unavailable">;
}

/**
 * Asks one engine one request, as every job of a suite is asked: the request is negotiated against the engine's
 * descriptor, and an engine that cannot answer is not asked ("negotiated"); the store is looked up under the key of
 * the request, the engine's id, fingerprint and adapter revision and the engine options, and a hit whose data is
 * still valid is the answer ("cached"); else the engine is asked ("computed"), an "ok" result whose data is not the
 * quantity's becomes an "error" with the code `INVALID_DATA`, and a result of status "ok" or "unsupported" is
 * stored at once.
 */
export async function askEngine(question: EngineQuestion): Promise<EngineAnswer> {
  const { adapter, descriptor, quantity, request, opticalCase, store, warnings } = question;
  const stamp = engineStamp(descriptor.identity);

  const items = negotiate(opticalCase, request, descriptor);
  if (items.length > 0) {
    const refusal = makeResult(request, stamp, { status: "unsupported", unsupported: items });
    return { result: refusal, storeKey: null, source: "negotiated" };
  }

  const key = storeKey({
    requestId: request.id,
    engineId: adapter.id,
    engineFingerprint: descriptor.identity.fingerprint,
    adapterRevision: descriptor.identity.adapterRevision,
    engineOptions: request.engineOptions,
  });
  const found = store.get(key);
  if (found.kind === "corrupt") warnings.push(`${found.problem}; the job is computed again`);
  if (found.kind === "hit") {
    const problems = dataProblems(quantity, found.entry.result);
    if (problems.length === 0) return { result: found.entry.result, storeKey: key, source: "cached" };
    warnings.push(`store entry ${key}: its data cannot be used: ${problems.join("; ")}; the job is computed again`);
  }

  let result = await adapter.run(request, opticalCase);
  const problems = dataProblems(quantity, result);
  if (problems.length > 0) {
    const message = `the engine's data cannot be used: ${problems.join("; ")}`;
    result = makeResult(request, stamp, { status: "error", error: { code: INVALID_DATA, message } });
  }
  return { result, storeKey: store.put(request, result), source: "computed" };
}

/** Runs one job on an engine that is ready or not. A store entry that cannot be trusted is added to `warnings`. */
async function runJob(
  planned: PlannedJob,
  session: EngineSession,
  store: ResultStore,
  warnings: string[],
): Promise<JobOutcome> {
  const { opticalCase, quantity, request } = planned;
  if (session.kind === "unavailable") {
    const job = jobOf(planned, { status: "error", storeKey: null, error: { code: session.code } });
    return { job, source: "unavailable", detail: session.message };
  }
  const { adapter, descriptor } = session;
  const answer = await askEngine({ adapter, descriptor, quantity, request, opticalCase, store, warnings });
  return outcomeOf(planned, answer.result, answer.storeKey, answer.source);
}

/**
 * The audit of every case source that serves a run of the suite, by lens kind in sorted order, as the manifest
 * records it; undefined when no source has one. A source that changed is added to `warnings` with what changed.
 */
function auditSources(
  input: RunSuiteInput,
  warnings: string[],
): { readonly [lensKind: string]: ManifestSource } | undefined {
  const kinds = [...new Set(input.suite.runs.map((run) => run.spec.lens.kind))].sort();
  const audited: [string, ManifestSource][] = [];
  for (const kind of kinds) {
    const audit = input.sources?.[kind]?.audit?.();
    if (audit === undefined || audit === null) continue;
    const changed = audit.changed.length > 0;
    if (changed) warnings.push(`case source ${kind} changed during the run: ${audit.changed.join(", ")}`);
    audited.push([kind, { fingerprint: audit.fingerprint, status: changed ? SOURCE_CHANGED : "unchanged" }]);
  }
  return audited.length === 0 ? undefined : Object.fromEntries(audited);
}

/**
 * Runs a suite and writes its output.
 *
 * Before anything runs, what was asked for is checked, and a `UsageError` thrown for a rung that does not exist, an
 * engine that is neither configured nor built in, no engine at all, and a suite named after the store's directory.
 * A run that names no engine is run on every configured one; a built-in engine is run only where it is named, so
 * a run that names none under a configuration that defines none is a `UsageError` too. A run of the suite that has
 * no case (`LoadedRun.problems`) is recorded in the manifest and has no jobs.
 *
 * A run with a rung that traces rays has its ray sets generated first, by the source of its case
 * (`CaseSource.raySets`), once for all such rungs: the manifest records the identity of each set and, as coded
 * problems, each field that has none. A field without rays fails nothing; the rung asks for the sets there are.
 *
 * Then, for each run in suite order, each selected rung in ladder order, each selected engine in id order and each
 * request of the rung, one job:
 *
 * 1. the engine is created and described, once per suite. One that cannot be used ends each of its jobs as "error"
 *    with the code of why (`ENGINE_UNAVAILABLE_CODES`), and the other engines carry on;
 * 2. the request is negotiated against the descriptor. An engine that cannot answer is not asked: the job is
 *    "unsupported" with the items negotiation gives, and nothing is stored;
 * 3. the store is looked up under the key of the request, the engine's id, fingerprint and adapter revision and the
 *    engine options.
 *    A hit is the job's result. An entry that is corrupt, or whose data is no longer valid, is a miss and a warning;
 * 4. on a miss the engine is asked. An "ok" result whose data is not the quantity's, or holds an array that does
 *    not decode, becomes "error" with the code `INVALID_DATA`;
 * 5. a result of status "ok" or "unsupported" is stored at once; an "error" or a "pending" job never is. So a run
 *    that is killed has lost nothing it finished, and the next run asks only for what is missing.
 *
 * When the last job has ended, each case source that built a case of the suite is audited (`CaseSource.audit`):
 * the manifest records what it says identifies its inputs, and "source-changed-during-run" when they are no longer
 * what the cases were built from, which is also a warning.
 *
 * The output is written last and whole (`writeRunOutput`): the cases under `<runsDir>/<suite name>/cases/`, then
 * the manifest. The manifest is the same, byte for byte, whether results were computed or found in the store, in
 * whatever directory and on whatever machine. A run that does not finish writes none and leaves the old one be.
 *
 * Every engine created is closed before this returns or rejects. It rejects, beside the `UsageError`s above, only
 * for what should not happen: an adapter that rejects where it must answer, a rung that builds a request that is
 * not its own, a file system that refuses.
 */
export async function runSuite(input: RunSuiteInput): Promise<SuiteRunResult> {
  const { suite, registry, runsDir } = input;
  const { jobs: planned, raySets } = await planJobs(input);
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const warnings: string[] = [];
  const sessions = new Map<string, EngineSession>();
  const adapters: EngineAdapter[] = [];

  const sessionOf = async (engineId: string): Promise<EngineSession> => {
    const known = sessions.get(engineId);
    if (known !== undefined) return known;
    let session: EngineSession;
    try {
      const adapter = await registry.create(engineId);
      adapters.push(adapter);
      session = { kind: "ready", adapter, descriptor: await adapter.describe() };
    } catch (error) {
      if (!(error instanceof EngineUnavailableError)) throw error;
      session = { kind: "unavailable", code: error.code, message: error.message };
    }
    sessions.set(engineId, session);
    return session;
  };

  const outcomes: JobOutcome[] = [];
  try {
    for (const job of planned) {
      const outcome = await runJob(job, await sessionOf(job.engineId), store, warnings);
      outcomes.push(outcome);
      input.onJob?.(outcome);
    }
  } finally {
    for (const adapter of adapters) {
      await adapter.close().catch((error: unknown) => {
        warnings.push(`engine ${adapter.id}: it did not close: ${reasonOf(error)}`);
      });
    }
  }

  const engines = [...sessions]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([id, session]): ManifestEngine => {
      if (session.kind === "unavailable") return { id, status: "unavailable", code: session.code };
      const { version, fingerprint, adapterRevision, details } = session.descriptor.identity;
      const adapter = adapterRevision === undefined ? {} : { adapterRevision };
      return { id, status: "available", version, fingerprint, ...adapter, details };
    });
  const sources = auditSources(input, warnings);
  const manifest: RunManifest = {
    contract: CONTRACT_VERSION,
    kind: "run-manifest",
    suite: { name: suite.name, hash: suite.hash },
    ...(sources === undefined ? {} : { sources }),
    engines,
    runs: suite.runs.map(({ spec, opticalCase, problems }) => {
      const rays = raySets.get(spec.name);
      return {
        name: spec.name,
        caseId: opticalCase?.id ?? null,
        problems,
        ...(spec.referenceEngine === undefined ? {} : { referenceEngine: spec.referenceEngine }),
        ...(rays === undefined ? {} : { raySets: rays }),
      };
    }),
    jobs: outcomes.map((outcome) => outcome.job),
  };
  const cases = suite.runs.flatMap(({ opticalCase }) => (opticalCase === null ? [] : [opticalCase]));
  const manifestPath = writeRunOutput(join(runsDir, suite.name), manifest, cases);
  return { manifest, manifestPath, outcomes, warnings };
}
