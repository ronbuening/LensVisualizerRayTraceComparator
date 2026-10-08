// What the suite, store, orchestrator and `lvrtc run` tests share: the fixture root and suite, temporary
// directories, and engine registries that can be watched and bent.
import { mkdtempSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import type { OpticalCase } from "../../src/contract/case.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultBody } from "../../src/contract/result.ts";
import type { RunOptions, RunSpec } from "../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import type { LoadedSuite } from "../../src/core/suite.ts";
import type { EngineAdapter } from "../../src/engines/adapter.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import type { EngineRegistry } from "../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { FIXTURE_DIR, SINGLET_CASE } from "../contract/corpus.ts";

/**
 * The fixture configuration root. Four fake engines run in this process: `fake-a`, `fake-b` (a bias of 0.001, far
 * beyond any tolerance), `fake-near` (a bias of 2e-14, within the tolerance of the `selftest` rung) and `fake-none`
 * (no quantity). Two are the Python fake engine as a stdio worker: `fake-py`, and `fake-pyn` with the bias of
 * `fake-near` and a fingerprint stated in the configuration, so that a report that names it does not change with
 * every edit of the worker kit. A test that runs the root without naming engines needs Python.
 */
export const FAKE_ROOT: string = fileURLToPath(new URL("../fixtures/fake-root", import.meta.url));
/** The fixture suite: the singlet and the Double-Gauss case on `selftest`, by paths relative to `FAKE_ROOT`. */
export const FAKE_PAIR_SUITE: string = fileURLToPath(new URL("../fixtures/suites/fake-pair.json", import.meta.url));

/** The path of one of the contract's valid optical-case fixtures. */
export function caseFixture(name: string): string {
  return join(FIXTURE_DIR, "valid", "optical-case", `${name}.json`);
}

/** The contract's singlet case. */
export const SINGLET: OpticalCase = SINGLET_CASE;
/** The contract's Double-Gauss case, as its fixture file holds it. */
export const DOUBLE_GAUSS: OpticalCase = JSON.parse(readFileSync(caseFixture("double-gauss"), "utf8"));

/** A fresh directory that is removed when the test ends. Nothing a test writes goes anywhere else. */
export function tempDir(t: TestContext): string {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-run-")));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** A run of a suite built in memory: its name, its case (null with `problems`) and any options. */
export interface RunOf extends RunOptions {
  readonly name: string;
  readonly opticalCase: OpticalCase | null;
  readonly problems?: readonly string[];
}

/** A loaded suite without a file: what `loadSuite` would give for these runs. */
export function suiteOf(name: string, runs: readonly RunOf[]): LoadedSuite {
  const loaded = runs.map(({ name: runName, opticalCase, problems = [], ...options }) => {
    const lens = { kind: "fixture", path: `cases/${runName}.json` } as const;
    const spec: RunSpec = { contract: CONTRACT_VERSION, kind: "run-spec", name: runName, lens, ...options };
    return { spec, opticalCase, problems };
  });
  const hash = hashCanonical({ name, runs: loaded.map((run) => run.spec) });
  return { name, hash, runs: loaded };
}

/** The fixture suite in memory: the singlet, then the Double-Gauss case. */
export function pairSuite(options: RunOptions = {}): LoadedSuite {
  return suiteOf("pair", [
    { name: "singlet", opticalCase: SINGLET, ...options },
    { name: "double-gauss", opticalCase: DOUBLE_GAUSS, ...options },
  ]);
}

/** What makes the adapter of one engine; it may reject, as a registry does for an engine it cannot build. */
export type EngineMaker = (id: string) => EngineAdapter | Promise<EngineAdapter>;

/** The comparator's fake engine, in process, with the given options beside its id. */
export function fakeEngine(options: Record<string, unknown> = {}): EngineMaker {
  return (id) => new RemoteEngineAdapter({ id, transport: createInProcessTransport(createEngine({ id, ...options })) });
}

/**
 * An engine that describes itself as the fake engine `described` makes, and answers every run with the result
 * body that `answer` gives for the request, in place of asking the fake.
 */
export function answeringEngine(
  answer: (request: QuantityRequest) => ResultBody,
  described = fakeEngine(),
): EngineMaker {
  return async (id) => {
    const adapter = await described(id);
    return {
      id,
      describe: () => adapter.describe(),
      run: async (request) => makeResult(request, engineStamp((await adapter.describe()).identity), answer(request)),
      close: () => adapter.close(),
    };
  };
}

/** A registry of the given engines, and everything that was done to them. */
export interface WatchedRegistry {
  readonly registry: EngineRegistry;
  /** The engine id of every adapter that was created, in order. */
  readonly created: string[];
  /** The engine id of every `run` an adapter was asked for, in order. */
  readonly ran: string[];
  /** The requests those runs carried, in the same order. */
  readonly requests: QuantityRequest[];
  /** The engine id of every adapter that was closed, in order. */
  readonly closed: string[];
}

/** A registry that makes each engine with its maker and records what the orchestrator does with it. */
export function watchedRegistry(engines: Readonly<Record<string, EngineMaker>>): WatchedRegistry {
  const watched: WatchedRegistry = {
    created: [],
    ran: [],
    requests: [],
    closed: [],
    registry: {
      ids: () => Object.keys(engines).sort(),
      create: async (id) => {
        const adapter = await engines[id](id);
        watched.created.push(id);
        return {
          id,
          describe: () => adapter.describe(),
          run: (request, opticalCase) => {
            watched.ran.push(id);
            watched.requests.push(request);
            return adapter.run(request, opticalCase);
          },
          close: () => {
            watched.closed.push(id);
            return adapter.close();
          },
        };
      },
    },
  };
  return watched;
}
