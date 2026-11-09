// The request-id snapshot: for every check, the requests each engine is asked and the options it is handed, planned
// on hermetic input (the fake LensVisualizer tree through the LensVisualizer case source; no engine is contacted). A
// rename of a check or an engine id must move none of them: a request id is the case, the quantity and the spec
// (`requestIdentity`), and neither id is in a spec or an option. The store key is another matter: it names the
// engine id and its adapter revision, so a renamed engine's answers are computed again under its new id.
//
// The snapshot is written by `node test/core/writeRequestSnapshot.ts` and held by `requestSnapshot.test.ts` with
// every check and engine it names read under its id of today (`heldPart`): the committed file stays as it is through
// the renames of check and engine ids, and only request ids and options are held. Rewrite it only at the end-of-project
// refresh, or for a change meant to move a request id or an option, and read the diff.
import { cpSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { followUpsOf } from "../../src/compare/followUp.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import { LEGACY_IDS, currentCheckId, currentEngineId } from "../../src/core/legacyIds.ts";
import type { LegacyMaps } from "../../src/core/legacyIds.ts";
import { planJobs } from "../../src/core/orchestrator.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { loadSuiteValue } from "../../src/core/suite.ts";
import { loadLvBinding } from "../../src/engines/lv/binding.ts";
import { createLvCaseSource } from "../../src/engines/lv/caseSource.ts";
import type { EngineRegistry } from "../../src/engines/registry.ts";
import { FAKE_LV } from "../engines/lv/support.ts";

/** Where the snapshot is kept: data, not source. */
export const SNAPSHOT_FILE: string = fileURLToPath(new URL("../fixtures/request-snapshot.json", import.meta.url));

/** Every engine a check of today is asked of, by the id it has today. */
export const SNAPSHOT_ENGINES: readonly string[] = Object.freeze([
  "flux-of-lv-rays",
  "lv",
  "optiland",
  "otf-of-optiland-wavefront",
  "reference-seidel",
  "reference-tracer",
  "replay-of-lv-mtf",
  "wave-mtf-of-lv-rays",
]);

/**
 * The checks no hermetic input can plan, each with the reason. Empty: every check of `RUNGS` is planned on the fake
 * tree below. A check added to `RUNGS` that the fake cannot plan goes here, with why.
 */
export const UNCOVERED: Readonly<Record<string, string>> = Object.freeze({});

/**
 * The suite that is planned: two lenses of the fake tree with the run's defaults, and the first again with options a
 * run states for engines by their ids (`sampling.engines`) and LensVisualizer's grid cap, so that the options every
 * check hands each engine are in the snapshot.
 */
export const SNAPSHOT_SUITE = Object.freeze({
  contract: "1.0",
  kind: "suite",
  name: "request-snapshot",
  defaults: {
    engines: ["lv", "optiland", "reference-tracer"],
    fields: { kind: "image-height-fractions", values: [0, 0.7] },
    sampling: { bundleGrid: 4 },
  },
  runs: [
    { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } },
    { name: "doublet", lens: { kind: "lv", key: "zenith-doublet-100" } },
    {
      name: "singlet-options",
      lens: { kind: "lv", key: "acme-singlet-50" },
      sampling: { bundleGrid: 6, lvGridCap: 64, engines: { optiland: { fftRays: 256 } } },
    },
  ],
});

/** One job as the snapshot keeps it: never its store key, which names the engine's adapter revision. */
export interface SnapshotJob {
  readonly run: string;
  readonly engine: string;
  readonly requestId: string;
  readonly options: JsonObject | null;
}

/** The snapshot. */
export interface RequestSnapshot {
  readonly suite: typeof SNAPSHOT_SUITE;
  /** Each run's case id: what its request ids are made from beside the quantity and the spec. */
  readonly cases: Readonly<Record<string, string | null>>;
  /** Every check of `RUNGS`, in their order, with its quantity and every job planned for it, in manifest order. */
  readonly checks: readonly { readonly check: string; readonly quantity: string; readonly jobs: SnapshotJob[] }[];
  /** The follow-ups of the limits file at hand: the second questions a check asks an engine, with their options. */
  readonly followUps: readonly { check: string; engine: string; step: string; options: JsonObject }[];
  readonly uncovered: Readonly<Record<string, string>>;
}

/** A registry that knows the engines by id and makes none: planning contacts no engine. */
function idsOnly(): EngineRegistry {
  return {
    ids: () => [],
    builtinIds: () => [...SNAPSHOT_ENGINES],
    create: async (id) => {
      throw new Error(`the snapshot plans jobs and makes no engine (${id})`);
    },
  };
}

/** Plans the suite on a tree of the fake LensVisualizer, which this process must not have bound to another tree. */
export async function snapshotOf(
  lv: string,
): Promise<{ snapshot: RequestSnapshot; plan: Awaited<ReturnType<typeof planJobs>> }> {
  const source = createLvCaseSource(lv);
  const suite = await loadSuiteValue(structuredClone(SNAPSHOT_SUITE), "request-snapshot", {
    rootDir: lv,
    sources: { lv: source },
  });
  const plan = await planJobs({
    suite,
    registry: idsOnly(),
    runsDir: join(tmpdir(), "request-snapshot-plans-nothing"),
    sources: { lv: source },
    rungs: RUNGS.map((rung) => rung.id),
  });
  const snapshot: RequestSnapshot = {
    suite: SNAPSHOT_SUITE,
    cases: Object.fromEntries(plan.runs.map((run) => [run.spec.name, run.opticalCase?.id ?? null])),
    checks: RUNGS.map((rung) => ({
      check: rung.id,
      quantity: rung.quantity,
      jobs: plan.jobs
        .filter((job) => job.rung.id === rung.id)
        .map((job) => ({
          run: job.run,
          engine: job.engineId,
          requestId: job.request.id,
          options: (job.request.engineOptions as JsonObject | undefined) ?? null,
        })),
    })),
    followUps: followUpsOf(loadPolicy()).map(({ rung, engine, step, options }) => ({
      check: rung,
      engine,
      step,
      options,
    })),
    uncovered: UNCOVERED,
  };
  return { snapshot, plan };
}

/** Indented JSON, but a job, an array of numbers or strings and a small object of options each on one line. */
function pretty(value: unknown, indent: string): string {
  const inline =
    value === null ||
    typeof value !== "object" ||
    (Array.isArray(value) && value.every((each) => typeof each !== "object" || each === null)) ||
    (!Array.isArray(value) && ("requestId" in value || JSON.stringify(value).length <= 60));
  if (inline) return JSON.stringify(value);
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    return value.length === 0
      ? "[]"
      : `[\n${value.map((each) => `${inner}${pretty(each, inner)}`).join(",\n")}\n${indent}]`;
  }
  const entries = Object.entries(value);
  return `{\n${entries.map(([key, each]) => `${inner}${JSON.stringify(key)}: ${pretty(each, inner)}`).join(",\n")}\n${indent}}`;
}

/** The snapshot as its file holds it: JSON, a job a line. */
export function snapshotText(snapshot: RequestSnapshot): string {
  return `${pretty(snapshot, "")}\n`;
}

/** Plans the suite on a fresh copy of the fake tree, removed after; the binding is closed. */
export async function freshSnapshot(): Promise<Awaited<ReturnType<typeof snapshotOf>>> {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-request-snapshot-")));
  const lv = join(dir, "lv");
  cpSync(FAKE_LV, lv, { recursive: true });
  const binding = await loadLvBinding(lv);
  try {
    return await snapshotOf(lv);
  } finally {
    binding.close();
    rmSync(dir, { recursive: true, force: true });
  }
}

/** The ids of a suite's run options named under their ids of today: its engines, reference engine and options' keys. */
function suiteAt(suite: unknown, engine: (id: string) => string): unknown {
  const options = (value: Record<string, unknown>): Record<string, unknown> => {
    const sampling = value.sampling as { engines?: Record<string, unknown> } | undefined;
    return {
      ...value,
      ...(Array.isArray(value.engines) ? { engines: (value.engines as string[]).map(engine) } : {}),
      ...(typeof value.referenceEngine === "string" ? { referenceEngine: engine(value.referenceEngine) } : {}),
      ...(sampling?.engines === undefined
        ? {}
        : {
            sampling: {
              ...sampling,
              engines: Object.fromEntries(Object.entries(sampling.engines).map(([id, each]) => [engine(id), each])),
            },
          }),
    };
  };
  const { defaults, runs, ...rest } = suite as { defaults?: Record<string, unknown>; runs: Record<string, unknown>[] };
  return { ...rest, ...(defaults === undefined ? {} : { defaults: options(defaults) }), runs: runs.map(options) };
}

/**
 * What the snapshot holds, whatever ids it was written with: every check and engine it names read under its id of
 * today (`currentCheckId`, `currentEngineId` of `maps`), and each check's jobs in an order of their own (run, engine,
 * request id, options), since a renamed engine may sort elsewhere among a run's engines. The request ids, the options,
 * the case ids and the quantities are held as they are.
 */
export function heldPart(snapshot: RequestSnapshot, maps: LegacyMaps = LEGACY_IDS): unknown {
  const check = (id: string): string => currentCheckId(id, maps.checks);
  const engine = (id: string): string => currentEngineId(id, maps.engines);
  const key = (job: SnapshotJob): string => JSON.stringify([job.run, job.engine, job.requestId, job.options]);
  return {
    suite: suiteAt(snapshot.suite, engine),
    cases: snapshot.cases,
    checks: snapshot.checks.map(({ check: id, quantity, jobs }) => ({
      check: check(id),
      quantity,
      jobs: jobs
        .map((job) => ({ ...job, engine: engine(job.engine) }))
        .sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0)),
    })),
    followUps: snapshot.followUps.map((each) => ({ ...each, check: check(each.check), engine: engine(each.engine) })),
    uncovered: Object.fromEntries(Object.entries(snapshot.uncovered).map(([id, why]) => [check(id), why])),
  };
}
