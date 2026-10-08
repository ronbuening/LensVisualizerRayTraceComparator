import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../../src/contract/quantities/selftestEcho.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import { CASES_DIRECTORY, MANIFEST_FILE, SOURCE_CHANGED, manifestText } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { INVALID_DATA, runSuite as runSuiteOnEveryRung } from "../../src/core/orchestrator.ts";
import type { JobOutcome, RunSuiteInput, SuiteRunResult } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore, storeKey } from "../../src/core/resultStore.ts";
import { selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { loadSuite } from "../../src/core/suite.ts";
import type { CaseSource, LoadedSuite, SourceAudit } from "../../src/core/suite.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { EngineUnavailableError } from "../../src/engines/adapter.ts";
import type { EngineAdapter } from "../../src/engines/adapter.ts";
import { parseFakeOptions } from "../../src/engines/fake/options.ts";
import { createEngineRegistry } from "../../src/engines/registry.ts";
import { ALL_FEATURES_CASE } from "../contract/corpus.ts";
import {
  DOUBLE_GAUSS,
  FAKE_PAIR_SUITE,
  FAKE_ROOT,
  SINGLET,
  answeringEngine,
  fakeEngine,
  pairSuite,
  suiteOf,
  tempDir,
  watchedRegistry,
} from "./support.ts";
import type { EngineMaker, WatchedRegistry } from "./support.ts";

/**
 * `runSuite` with the rung `selftest` as the only rung there is, unless a test gives its own: these tests are of
 * the orchestrator, on engines that know no optics, and hold whatever rungs the ladder has grown since.
 */
function runSuite(input: RunSuiteInput): Promise<SuiteRunResult> {
  return runSuiteOnEveryRung({ rungDefinitions: [selftestRung], ...input });
}

/** The three fake engines of the fixture root: one plain, one with a bias, one that offers no quantity. */
function threeFakes(): WatchedRegistry {
  return watchedRegistry({
    "fake-a": fakeEngine(),
    "fake-b": fakeEngine({ bias: 0.001 }),
    "fake-none": fakeEngine({ offersQuantities: false }),
  });
}

/** A rung of `selftest.echo` that asks two things of each case: its elements doubled, and tripled. */
const twiceRung: RungDefinition = {
  id: "twice",
  quantity: SELFTEST_ECHO,
  buildRequests: (opticalCase) =>
    [2, 3].map((scale) => {
      const spec: SelftestEchoSpec = {
        values: encodeNdArray(Float64Array.of(opticalCase.system.surfaces.length)),
        scale,
      };
      return makeRequest({ caseId: opticalCase.id, quantity: SELFTEST_ECHO, spec });
    }),
};

/** The run, rung, engine and status of every job, as short rows that read like the console's. */
function rows(result: SuiteRunResult): string[] {
  return result.outcomes.map(({ job, source }) => `${job.run} ${job.rung} ${job.engine} ${job.status} ${source}`);
}

function manifestBytes(runsDir: string, suite: string): string {
  return readFileSync(join(runsDir, suite, MANIFEST_FILE), "utf8");
}

function storeFiles(runsDir: string): string[] {
  const directory = join(runsDir, STORE_DIRECTORY);
  return existsSync(directory) ? readdirSync(directory).sort() : [];
}

/** The `UsageError` a run must reject with. */
async function refused(running: Promise<unknown>): Promise<string> {
  const error = await running.then(
    () => assert.fail("the suite ran; expected a UsageError"),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof UsageError, String(error));
  return error.message;
}

/** An engine whose every adapter rejects `run` once `budget.left` runs were answered: a process that is killed. */
function dyingAfter(maker: EngineMaker, budget: { left: number }): EngineMaker {
  return async (id) => {
    const adapter = await maker(id);
    const dying: EngineAdapter = {
      id,
      describe: () => adapter.describe(),
      run: (request, opticalCase) => {
        if (budget.left === 0) return Promise.reject(new Error("killed"));
        budget.left--;
        return adapter.run(request, opticalCase);
      },
      close: () => adapter.close(),
    };
    return dying;
  };
}

// ── The job matrix ───────────────────────────────────────────────────────────────────────────────────────────────

test("every run meets every engine: one job per request, in suite order and then by engine id", async (t) => {
  const runsDir = tempDir(t);
  const engines = threeFakes();
  const seen: JobOutcome[] = [];
  const result = await runSuite({
    suite: pairSuite(),
    registry: engines.registry,
    runsDir,
    onJob: (job) => seen.push(job),
  });

  assert.deepEqual(rows(result), [
    "singlet selftest fake-a ok computed",
    "singlet selftest fake-b ok computed",
    "singlet selftest fake-none unsupported negotiated",
    "double-gauss selftest fake-a ok computed",
    "double-gauss selftest fake-b ok computed",
    "double-gauss selftest fake-none unsupported negotiated",
  ]);
  assert.deepEqual(seen, result.outcomes, "onJob is told of each job, in order");
  assert.deepEqual(result.warnings, []);

  const [singletRequest] = selftestRung.buildRequests(SINGLET, pairSuite().runs[0].spec);
  const [gaussRequest] = selftestRung.buildRequests(DOUBLE_GAUSS, pairSuite().runs[1].spec);
  const fingerprint = parseFakeOptions({ id: "fake-a" }).fingerprint;
  const expectedKey = storeKey({ requestId: singletRequest.id, engineId: "fake-a", engineFingerprint: fingerprint });
  assert.deepEqual(result.manifest.jobs[0], {
    run: "singlet",
    caseId: SINGLET.id,
    rung: "selftest",
    quantity: SELFTEST_ECHO,
    requestId: singletRequest.id,
    engine: "fake-a",
    status: "ok",
    storeKey: expectedKey,
  });
  assert.deepEqual(result.manifest.jobs[5], {
    run: "double-gauss",
    caseId: DOUBLE_GAUSS.id,
    rung: "selftest",
    quantity: SELFTEST_ECHO,
    requestId: gaussRequest.id,
    engine: "fake-none",
    status: "unsupported",
    storeKey: null,
    unsupported: [{ code: "quantity", item: SELFTEST_ECHO }],
  });
  assert.deepEqual(
    result.outcomes.map((outcome) => outcome.detail),
    [null, null, "the engine does not offer selftest.echo", null, null, "the engine does not offer selftest.echo"],
  );
});

test("the manifest names the suite, the engines with their fingerprints, the runs and the jobs", async (t) => {
  const runsDir = tempDir(t);
  const suite = pairSuite();
  const { manifest, manifestPath } = await runSuite({ suite, registry: threeFakes().registry, runsDir });

  assert.equal(manifestPath, join(runsDir, "pair", MANIFEST_FILE));
  assert.equal(manifestBytes(runsDir, "pair"), manifestText(manifest));
  assert.equal(manifestText(manifest), `${canonicalJson(manifest)}\n`);
  assert.deepEqual(JSON.parse(manifestBytes(runsDir, "pair")), manifest);

  assert.deepEqual(Object.keys(manifest).sort(), ["contract", "engines", "jobs", "kind", "runs", "suite"]);
  assert.equal(manifest.contract, CONTRACT_VERSION);
  assert.equal(manifest.kind, "run-manifest");
  assert.deepEqual(manifest.suite, { name: "pair", hash: suite.hash });
  assert.deepEqual(manifest.engines, [
    {
      id: "fake-a",
      status: "available",
      version: "1",
      fingerprint: parseFakeOptions({ id: "fake-a" }).fingerprint,
      details: { bias: 0, offersQuantities: true, failMode: "none" },
    },
    {
      id: "fake-b",
      status: "available",
      version: "1",
      fingerprint: parseFakeOptions({ id: "fake-b", bias: 0.001 }).fingerprint,
      details: { bias: 0.001, offersQuantities: true, failMode: "none" },
    },
    {
      id: "fake-none",
      status: "available",
      version: "1",
      fingerprint: parseFakeOptions({ id: "fake-none", offersQuantities: false }).fingerprint,
      details: { bias: 0, offersQuantities: false, failMode: "none" },
    },
  ]);
  assert.deepEqual(manifest.runs, [
    { name: "singlet", caseId: SINGLET.id, problems: [] },
    { name: "double-gauss", caseId: DOUBLE_GAUSS.id, problems: [] },
  ]);
  assert.equal(manifest.jobs.length, 6);
});

test("every stored job is in the store, as the request that was sent and a valid result with valid data", async (t) => {
  const runsDir = tempDir(t);
  const { manifest } = await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));

  const stored = manifest.jobs.filter((job) => job.storeKey !== null);
  assert.equal(stored.length, 4);
  assert.deepEqual(storeFiles(runsDir), stored.map((job) => `${job.storeKey}.json`).sort());
  for (const job of stored) {
    const found = store.get(job.storeKey ?? "");
    assert.equal(found.kind, "hit");
    if (found.kind !== "hit") continue;
    const { request, result } = found.entry;
    assert.equal(request.id, job.requestId);
    assert.equal(request.caseId, job.caseId);
    assert.equal(result.engine.id, job.engine);
    assert.equal(result.status, "ok");
    // Scale 1: the fake without a bias sends the elements back as they came, and the one with a bias does not.
    const same = canonicalJson((result.data as SelftestEchoData).values) === canonicalJson(request.spec.values);
    assert.equal(same, job.engine === "fake-a");
  }
});

test("the cases of the run are written beside the manifest, as canonical JSON, and are the cases", async (t) => {
  const runsDir = tempDir(t);
  await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir });
  const directory = join(runsDir, "pair", CASES_DIRECTORY);
  assert.deepEqual(readdirSync(directory).sort(), [`${SINGLET.id}.json`, `${DOUBLE_GAUSS.id}.json`].sort());
  for (const opticalCase of [SINGLET, DOUBLE_GAUSS]) {
    const text = readFileSync(join(directory, `${opticalCase.id}.json`), "utf8");
    assert.equal(text, `${canonicalJson(opticalCase)}\n`);
    assert.deepEqual(validateKind("optical-case", JSON.parse(text)), []);
  }
  assert.deepEqual(readdirSync(join(runsDir, "pair")).sort(), [CASES_DIRECTORY, MANIFEST_FILE].sort());
  assert.deepEqual(readdirSync(runsDir).sort(), ["pair", STORE_DIRECTORY]);
});

test("engines are asked in id order, each once, however they were named", async (t) => {
  const order = ["fake-none", "fake-b", "fake-a", "fake-b"];
  const flagged = await runSuite({
    suite: pairSuite(),
    registry: threeFakes().registry,
    runsDir: tempDir(t),
    engines: order,
  });
  const listed = await runSuite({
    suite: pairSuite({ engines: order.slice(0, 3) }),
    registry: threeFakes().registry,
    runsDir: tempDir(t),
  });
  const plain = await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir: tempDir(t) });
  assert.deepEqual(rows(flagged), rows(plain));
  assert.deepEqual(rows(listed), rows(plain));
  assert.deepEqual(flagged.manifest, plain.manifest);
});

test("a run's own engines are used, the engines asked for replace them, and the default is every engine", async (t) => {
  const suite = suiteOf("mixed", [
    { name: "one", opticalCase: SINGLET, engines: ["fake-b"] },
    { name: "all", opticalCase: SINGLET },
    { name: "two", opticalCase: DOUBLE_GAUSS, engines: ["fake-none", "fake-a"] },
  ]);
  const engines = threeFakes();
  const own = await runSuite({ suite, registry: engines.registry, runsDir: tempDir(t) });
  assert.deepEqual(
    own.manifest.jobs.map((job) => `${job.run} ${job.engine}`),
    ["one fake-b", "all fake-a", "all fake-b", "all fake-none", "two fake-a", "two fake-none"],
  );
  assert.deepEqual(
    engines.created,
    ["fake-b", "fake-a", "fake-none"],
    "each engine is created once, when first needed",
  );
  assert.deepEqual(
    own.manifest.engines.map((engine) => engine.id),
    ["fake-a", "fake-b", "fake-none"],
    "the manifest lists them by id, not in the order they were first needed",
  );

  const asked = await runSuite({ suite, registry: threeFakes().registry, runsDir: tempDir(t), engines: ["fake-a"] });
  assert.deepEqual(
    asked.manifest.jobs.map((job) => `${job.run} ${job.engine}`),
    ["one fake-a", "all fake-a", "two fake-a"],
  );
  assert.deepEqual(
    asked.manifest.engines.map((engine) => engine.id),
    ["fake-a"],
    "an engine no job was planned for is neither created nor listed",
  );
});

test("rungs run in ladder order, then engines, then the rung's requests in the order it builds them", async (t) => {
  const registry = (): WatchedRegistry =>
    watchedRegistry({ "fake-a": fakeEngine(), "fake-b": fakeEngine({ bias: 1 }) });
  const rungDefinitions = [selftestRung, twiceRung];
  const both = await runSuite({
    suite: pairSuite(),
    registry: registry().registry,
    runsDir: tempDir(t),
    rungDefinitions,
  });
  assert.deepEqual(
    both.manifest.jobs.map((job) => `${job.run} ${job.rung} ${job.engine}`),
    [
      "singlet selftest fake-a",
      "singlet selftest fake-b",
      "singlet twice fake-a",
      "singlet twice fake-a",
      "singlet twice fake-b",
      "singlet twice fake-b",
      "double-gauss selftest fake-a",
      "double-gauss selftest fake-b",
      "double-gauss twice fake-a",
      "double-gauss twice fake-a",
      "double-gauss twice fake-b",
      "double-gauss twice fake-b",
    ],
  );
  const [doubled, tripled] = twiceRung.buildRequests(SINGLET, pairSuite().runs[0].spec);
  assert.deepEqual(
    both.manifest.jobs.slice(2, 6).map((job) => job.requestId),
    [doubled.id, tripled.id, doubled.id, tripled.id],
  );
  assert.equal(new Set(both.manifest.jobs.map((job) => job.storeKey)).size, 12);

  // The rungs asked for replace each run's own, and the order they are named in changes nothing.
  const suite = pairSuite({ rungs: ["selftest"] });
  const own = await runSuite({ suite, registry: registry().registry, runsDir: tempDir(t), rungDefinitions });
  assert.deepEqual([...new Set(own.manifest.jobs.map((job) => job.rung))], ["selftest"]);
  const asked = await runSuite({
    suite,
    registry: registry().registry,
    runsDir: tempDir(t),
    rungDefinitions,
    rungs: ["twice"],
  });
  assert.deepEqual([...new Set(asked.manifest.jobs.map((job) => job.rung))], ["twice"]);
  const reversed = await runSuite({
    suite,
    registry: registry().registry,
    runsDir: tempDir(t),
    rungDefinitions,
    rungs: ["twice", "selftest"],
  });
  assert.deepEqual(reversed.manifest.jobs, both.manifest.jobs);
});

test("two runs of one case share their answers: the second finds what the first computed", async (t) => {
  const suite = suiteOf("twins", [
    { name: "first", opticalCase: SINGLET },
    { name: "second", opticalCase: SINGLET },
  ]);
  const engines = watchedRegistry({ "fake-a": fakeEngine() });
  const result = await runSuite({ suite, registry: engines.registry, runsDir: tempDir(t) });
  assert.deepEqual(rows(result), ["first selftest fake-a ok computed", "second selftest fake-a ok cached"]);
  assert.equal(result.manifest.jobs[0].storeKey, result.manifest.jobs[1].storeKey);
  assert.deepEqual(engines.ran, ["fake-a"]);
});

// ── What was asked for that does not exist ───────────────────────────────────────────────────────────────────────

test("an unknown rung or engine is a usage error, and nothing is created, run or written", async (t) => {
  const refusals: [input: Partial<RunSuiteInput>, message: string][] = [
    [{ rungs: ["R0"] }, 'unknown rung "R0": the rungs are selftest'],
    [{ rungs: [] }, "no rung was named: the rungs are selftest"],
    [{ suite: pairSuite({ rungs: ["selftest", "R1"] }) }, 'run singlet: unknown rung "R1": the rungs are selftest'],
    [
      { engines: ["fake-a", "optiland"] },
      'unknown engine "optiland": the configuration defines fake-a, fake-b, fake-none',
    ],
    [{ engines: ["ref", "lv"] }, 'unknown engines "ref", "lv": the configuration defines fake-a, fake-b, fake-none'],
    [{ engines: [] }, "no engine was named: the configuration defines fake-a, fake-b, fake-none"],
    [
      { suite: pairSuite({ engines: ["fake-b", "constructor"] }) },
      'run singlet: unknown engine "constructor": the configuration defines fake-a, fake-b, fake-none',
    ],
    [{ suite: suiteOf("store", [{ name: "one", opticalCase: SINGLET }]) }, 'a suite cannot be named "store"'],
    [{ suite: suiteOf("Store", [{ name: "one", opticalCase: SINGLET }]) }, 'a suite cannot be named "Store"'],
  ];
  for (const [input, message] of refusals) {
    const runsDir = join(tempDir(t), "runs");
    const engines = threeFakes();
    const said = await refused(runSuite({ suite: pairSuite(), registry: engines.registry, runsDir, ...input }));
    assert.ok(said.startsWith(message), said);
    assert.deepEqual(engines.created, []);
    assert.equal(existsSync(runsDir), false, said);
  }
});

test("what a run asks for is checked even when the run cannot start", async (t) => {
  const suite = suiteOf("partly", [
    { name: "good", opticalCase: SINGLET },
    { name: "bad", opticalCase: null, problems: ["no case"], rungs: ["R9"] },
  ]);
  const said = await refused(runSuite({ suite, registry: threeFakes().registry, runsDir: tempDir(t) }));
  assert.equal(said, 'run bad: unknown rung "R9": the rungs are selftest');
});

test("without any engine there is nothing to run: a usage error", async (t) => {
  const registry = watchedRegistry({}).registry;
  const said = await refused(runSuite({ suite: pairSuite(), registry, runsDir: tempDir(t) }));
  assert.equal(said, "no engine to run: the configuration defines no engine");
  const named = runSuite({ suite: pairSuite(), registry, runsDir: tempDir(t), engines: ["fake-a"] });
  assert.equal(await refused(named), "no engine to run: the configuration defines no engine");
});

// ── Negotiation ──────────────────────────────────────────────────────────────────────────────────────────────────

test("an engine whose descriptor says it cannot answer is not asked, and nothing is stored for it", async (t) => {
  const runsDir = tempDir(t);
  const engines = watchedRegistry({ "fake-none": fakeEngine({ offersQuantities: false }) });
  const result = await runSuite({ suite: pairSuite(), registry: engines.registry, runsDir });
  assert.deepEqual(rows(result), [
    "singlet selftest fake-none unsupported negotiated",
    "double-gauss selftest fake-none unsupported negotiated",
  ]);
  assert.deepEqual(engines.ran, [], "the engine was described, and never run");
  assert.deepEqual(engines.created, ["fake-none"]);
  assert.deepEqual(storeFiles(runsDir), []);
  for (const job of result.manifest.jobs) {
    assert.equal(job.storeKey, null);
    assert.deepEqual(job.unsupported, [{ code: "quantity", item: SELFTEST_ECHO }]);
    assert.equal(job.error, undefined);
  }
});

test("negotiation is per case: an engine is asked about the cases it can take, and only those", async (t) => {
  const runsDir = tempDir(t);
  // A fake described as one that handles two surfaces at most and no aspheres, which the fake engine itself is not.
  const limited: EngineMaker = async (id) => {
    const adapter = await fakeEngine()(id);
    return {
      id,
      describe: async () => {
        const descriptor = await adapter.describe();
        const features = { supported: [], limits: { "surfaces.count": 2 } };
        return { ...descriptor, capabilities: { ...descriptor.capabilities, features } };
      },
      run: (request, opticalCase) => adapter.run(request, opticalCase),
      close: () => adapter.close(),
    };
  };
  const suite = suiteOf("limits", [
    { name: "singlet", opticalCase: SINGLET },
    { name: "double-gauss", opticalCase: DOUBLE_GAUSS },
    { name: "all-features", opticalCase: ALL_FEATURES_CASE },
  ]);
  const engines = watchedRegistry({ small: limited });
  const result = await runSuite({ suite, registry: engines.registry, runsDir });

  assert.deepEqual(rows(result), [
    "singlet selftest small ok computed",
    "double-gauss selftest small unsupported negotiated",
    "all-features selftest small unsupported negotiated",
  ]);
  assert.deepEqual(engines.ran, ["small"]);
  assert.deepEqual(result.manifest.jobs[1].unsupported, [{ code: "feature", item: "surfaces.count" }]);
  assert.equal(result.outcomes[1].detail, "the case needs surfaces.count 11; the engine handles at most 2");
  const flags = result.manifest.jobs[2].unsupported ?? [];
  assert.deepEqual(
    flags.map((item) => item.item),
    [...ALL_FEATURES_CASE.features, "surfaces.count"],
  );
  assert.equal(storeFiles(runsDir).length, 1);
});

test("an engine that answers unsupported when asked is an answer, and is stored", async (t) => {
  const runsDir = tempDir(t);
  const unsupported = [{ code: "option", item: "rays", message: "the ray count is fixed" }] as const;
  const engines = (): WatchedRegistry =>
    watchedRegistry({ picky: answeringEngine(() => ({ status: "unsupported", unsupported })) });
  const first = engines();
  const result = await runSuite({ suite: pairSuite(), registry: first.registry, runsDir });
  assert.deepEqual(rows(result), [
    "singlet selftest picky unsupported computed",
    "double-gauss selftest picky unsupported computed",
  ]);
  assert.deepEqual(result.manifest.jobs[0].unsupported, [{ code: "option", item: "rays" }]);
  assert.equal(result.outcomes[0].detail, "the ray count is fixed");
  assert.deepEqual(storeFiles(runsDir), result.manifest.jobs.map((job) => `${job.storeKey}.json`).sort());

  const second = engines();
  const again = await runSuite({ suite: pairSuite(), registry: second.registry, runsDir });
  assert.deepEqual(rows(again), [
    "singlet selftest picky unsupported cached",
    "double-gauss selftest picky unsupported cached",
  ]);
  assert.deepEqual(second.ran, []);
  assert.deepEqual(again.manifest, result.manifest);
});

// ── Engines that cannot be used, and engines that fail ───────────────────────────────────────────────────────────

test("an engine that cannot be built ends its jobs as errors with the code, and the others carry on", async (t) => {
  const runsDir = tempDir(t);
  const module = join(REPO_ROOT, "no", "such", "engine.ts");
  const engines = watchedRegistry({
    "fake-a": fakeEngine(),
    broken: (id) =>
      Promise.reject(new EngineUnavailableError(id, "load-failed", `its module ${module} does not exist`)),
    "fake-z": fakeEngine(),
  });
  const result = await runSuite({ suite: pairSuite(), registry: engines.registry, runsDir });

  assert.deepEqual(rows(result), [
    "singlet selftest broken error unavailable",
    "singlet selftest fake-a ok computed",
    "singlet selftest fake-z ok computed",
    "double-gauss selftest broken error unavailable",
    "double-gauss selftest fake-a ok computed",
    "double-gauss selftest fake-z ok computed",
  ]);
  const [job] = result.manifest.jobs;
  assert.deepEqual(job.error, { code: "load-failed" });
  assert.equal(job.storeKey, null);
  assert.equal(job.requestId, result.manifest.jobs[1].requestId, "the job is the request the others answered");
  assert.equal(
    result.outcomes[0].detail,
    `engine broken is unavailable (load-failed): its module ${module} does not exist`,
  );
  assert.deepEqual(result.manifest.engines[0], { id: "broken", status: "unavailable", code: "load-failed" });
  assert.deepEqual(engines.created, ["fake-a", "fake-z"], "the broken engine was tried once, not once per job");
  assert.deepEqual(engines.closed.sort(), ["fake-a", "fake-z"]);
  assert.equal(storeFiles(runsDir).length, 4);
});

test("an engine that is not the one configured is unavailable too, and is still closed", async (t) => {
  // Its descriptor says it is "someone-else": the adapter refuses it at hello, with the code id-mismatch.
  const watched = watchedRegistry({ imposter: fakeEngine({ id: "someone-else" }), "fake-a": fakeEngine() });
  const result = await runSuite({ suite: pairSuite(), registry: watched.registry, runsDir: tempDir(t) });
  assert.deepEqual(rows(result), [
    "singlet selftest fake-a ok computed",
    "singlet selftest imposter error unavailable",
    "double-gauss selftest fake-a ok computed",
    "double-gauss selftest imposter error unavailable",
  ]);
  assert.deepEqual(result.manifest.jobs[1].error, { code: "id-mismatch" });
  assert.deepEqual(result.manifest.engines[1], { id: "imposter", status: "unavailable", code: "id-mismatch" });
  assert.deepEqual(watched.ran, ["fake-a", "fake-a"]);
  assert.deepEqual(watched.closed.sort(), ["fake-a", "imposter"], "what was created is closed, usable or not");
});

test("an engine that fails a request is an error job with its code, never stored, and asked again", async (t) => {
  const runsDir = tempDir(t);
  const engines = (): WatchedRegistry =>
    watchedRegistry({
      "fake-a": fakeEngine(),
      refuses: fakeEngine({ failMode: "protocol-error" }),
      throws: fakeEngine({ failMode: "throw" }),
    });
  const first = engines();
  const result = await runSuite({ suite: pairSuite(), registry: first.registry, runsDir });
  assert.deepEqual(rows(result).slice(0, 3), [
    "singlet selftest fake-a ok computed",
    "singlet selftest refuses error computed",
    "singlet selftest throws error computed",
  ]);
  assert.deepEqual(result.manifest.jobs[1].error, { code: "protocol-error" });
  assert.deepEqual(result.manifest.jobs[2].error, { code: "transport-error" });
  assert.deepEqual(
    result.manifest.jobs.map((job) => job.storeKey === null),
    [false, true, true, false, true, true],
  );
  assert.match(result.outcomes[1].detail ?? "", /the engine refused the message \(fake-failure\)/);
  assert.equal(storeFiles(runsDir).length, 2);

  const second = engines();
  const again = await runSuite({ suite: pairSuite(), registry: second.registry, runsDir });
  assert.deepEqual(second.ran, ["refuses", "throws", "refuses", "throws"], "only the failures are asked again");
  assert.deepEqual(again.manifest, result.manifest);
});

test("an ok result whose data is not the quantity's becomes an error, invalid-data, and is not stored", async (t) => {
  const runsDir = tempDir(t);
  const [request] = selftestRung.buildRequests(SINGLET, pairSuite().runs[0].spec);
  const values = (request.spec as SelftestEchoSpec).values;
  const forged = { $nd: { ...values.$nd, sha256: "0".repeat(64) } };
  const engines = watchedRegistry({
    "bad-shape": answeringEngine(() => ({ status: "ok", data: { values: [0, 4, 5], sum: 9 } })),
    "bad-bytes": answeringEngine(() => ({ status: "ok", data: { values: forged, sum: 9 } })),
    "fake-a": fakeEngine(),
  });
  const suite = suiteOf("payloads", [{ name: "singlet", opticalCase: SINGLET }]);
  const result = await runSuite({ suite, registry: engines.registry, runsDir });

  assert.equal(INVALID_DATA, "invalid-data");
  assert.deepEqual(rows(result), [
    "singlet selftest bad-bytes error computed",
    "singlet selftest bad-shape error computed",
    "singlet selftest fake-a ok computed",
  ]);
  for (const job of result.manifest.jobs.slice(0, 2)) {
    assert.deepEqual(job.error, { code: "invalid-data" });
    assert.equal(job.storeKey, null);
  }
  assert.match(
    result.outcomes[0].detail ?? "",
    /^the engine's data cannot be used: \/values: ndarray: sha256 mismatch/,
  );
  assert.match(
    result.outcomes[1].detail ?? "",
    /^the engine's data cannot be used: it is not selftest\.echo data: \/values \[type\]/,
  );
  assert.deepEqual(storeFiles(runsDir), [`${result.manifest.jobs[2].storeKey}.json`]);
});

test("a pending job is recorded as pending and is not stored", async (t) => {
  const runsDir = tempDir(t);
  const engines = watchedRegistry({ bench: answeringEngine(() => ({ status: "pending" })) });
  const result = await runSuite({ suite: pairSuite(), registry: engines.registry, runsDir });
  assert.deepEqual(rows(result), [
    "singlet selftest bench pending computed",
    "double-gauss selftest bench pending computed",
  ]);
  assert.deepEqual(result.manifest.jobs[0].storeKey, null);
  assert.deepEqual(storeFiles(runsDir), []);
});

// ── Engines are closed ───────────────────────────────────────────────────────────────────────────────────────────

test("every engine that was created is closed once the suite has run", async (t) => {
  const engines = threeFakes();
  await runSuite({ suite: pairSuite(), registry: engines.registry, runsDir: tempDir(t) });
  assert.deepEqual(engines.created, ["fake-a", "fake-b", "fake-none"]);
  assert.deepEqual(engines.closed, ["fake-a", "fake-b", "fake-none"]);
});

test("engines are closed when the run crashes, and no manifest is written", async (t) => {
  const runsDir = tempDir(t);
  const engines = watchedRegistry({
    "fake-a": fakeEngine(),
    "fake-b": dyingAfter(fakeEngine({ bias: 1 }), { left: 1 }),
    "fake-c": fakeEngine(),
  });
  await assert.rejects(runSuite({ suite: pairSuite(), registry: engines.registry, runsDir }), /^Error: killed$/);
  assert.deepEqual(engines.created, ["fake-a", "fake-b", "fake-c"]);
  assert.deepEqual(engines.closed, ["fake-a", "fake-b", "fake-c"]);
  assert.equal(existsSync(join(runsDir, "pair")), false);
  assert.equal(storeFiles(runsDir).length, 4, "what was finished before the crash is in the store");
});

test("an engine that fails in any way but being unavailable stops the run, and the engines are closed", async (t) => {
  // Only an EngineUnavailableError is a finding about an engine. Anything else is a defect, and is not turned into
  // error jobs that a manifest would then record as if the engine had been asked.
  const defect = new TypeError("a defect in the adapter");
  const undescribed: EngineMaker = async (id) => {
    const adapter = await fakeEngine()(id);
    return {
      id,
      describe: () => Promise.reject(defect),
      run: (request, opticalCase) => adapter.run(request, opticalCase),
      close: () => adapter.close(),
    };
  };
  const makers: [name: string, maker: EngineMaker][] = [
    ["describe rejects", undescribed],
    ["create rejects", () => Promise.reject(defect)],
  ];
  for (const [name, maker] of makers) {
    const runsDir = tempDir(t);
    const engines = watchedRegistry({ "fake-a": fakeEngine(), "fake-b": maker, "fake-c": fakeEngine() });
    await assert.rejects(runSuite({ suite: pairSuite(), registry: engines.registry, runsDir }), defect, name);
    assert.deepEqual(engines.ran, ["fake-a"], name);
    assert.deepEqual(engines.closed, engines.created, name);
    assert.ok(engines.closed.includes("fake-a"), name);
    assert.equal(existsSync(join(runsDir, "pair")), false, name);
    assert.equal(storeFiles(runsDir).length, 1, name);
  }
});

test("an engine that does not close is a warning, and the run still ends well", async (t) => {
  const runsDir = tempDir(t);
  const stuck: EngineMaker = async (id) => {
    const adapter = await fakeEngine()(id);
    return {
      id,
      describe: () => adapter.describe(),
      run: (r, c) => adapter.run(r, c),
      close: () => Promise.reject(new Error("stuck")),
    };
  };
  const result = await runSuite({
    suite: pairSuite(),
    registry: watchedRegistry({ "fake-a": stuck }).registry,
    runsDir,
  });
  assert.deepEqual(result.warnings, ["engine fake-a: it did not close: stuck"]);
  assert.equal(result.manifest.jobs.length, 2);
  assert.ok(existsSync(result.manifestPath));
});

test("an onJob that throws stops the run, and the engines are still closed", async (t) => {
  const engines = threeFakes();
  const onJob = (): void => {
    throw new Error("the console went away");
  };
  await assert.rejects(
    runSuite({ suite: pairSuite(), registry: engines.registry, runsDir: tempDir(t), onJob }),
    /console went away/,
  );
  assert.deepEqual(engines.closed, ["fake-a"]);
});

// ── Resume ───────────────────────────────────────────────────────────────────────────────────────────────────────

test("a second run computes nothing: every answer is in the store, and the manifest is the same bytes", async (t) => {
  const runsDir = tempDir(t);
  const first = threeFakes();
  const computed = await runSuite({ suite: pairSuite(), registry: first.registry, runsDir });
  assert.deepEqual(first.ran, ["fake-a", "fake-b", "fake-a", "fake-b"]);
  const before = manifestBytes(runsDir, "pair");
  const stored = storeFiles(runsDir);

  const second = threeFakes();
  const cached = await runSuite({ suite: pairSuite(), registry: second.registry, runsDir });
  assert.deepEqual(second.ran, [], "no engine was asked anything");
  assert.deepEqual(rows(cached), [
    "singlet selftest fake-a ok cached",
    "singlet selftest fake-b ok cached",
    "singlet selftest fake-none unsupported negotiated",
    "double-gauss selftest fake-a ok cached",
    "double-gauss selftest fake-b ok cached",
    "double-gauss selftest fake-none unsupported negotiated",
  ]);
  assert.equal(manifestBytes(runsDir, "pair"), before);
  assert.deepEqual(cached.manifest, computed.manifest);
  assert.deepEqual(storeFiles(runsDir), stored);
  assert.deepEqual(
    second.closed,
    ["fake-a", "fake-b", "fake-none"],
    "engines are described, to key the store, and closed",
  );
});

test("a run killed part-way resumes: only what is missing is computed, into a whole run's manifest", async (t) => {
  const suite = pairSuite();
  const engines = (budget?: { left: number }): WatchedRegistry => {
    const made = (maker: EngineMaker): EngineMaker => (budget === undefined ? maker : dyingAfter(maker, budget));
    return watchedRegistry({
      "fake-a": made(fakeEngine()),
      "fake-b": made(fakeEngine({ bias: 0.001 })),
      "fake-none": fakeEngine({ offersQuantities: false }),
    });
  };
  const uninterrupted = tempDir(t);
  await runSuite({ suite, registry: engines().registry, runsDir: uninterrupted });

  for (const finished of [0, 1, 2, 3]) {
    const runsDir = tempDir(t);
    const killed = engines({ left: finished });
    await assert.rejects(runSuite({ suite, registry: killed.registry, runsDir }), /^Error: killed$/);
    assert.equal(killed.ran.length, finished + 1, "the run stopped at the job that was killed");
    assert.equal(storeFiles(runsDir).length, finished, "each finished job was stored at once");
    assert.equal(existsSync(join(runsDir, "pair", MANIFEST_FILE)), false, "a killed run writes no manifest");

    const resumed = engines();
    const result = await runSuite({ suite, registry: resumed.registry, runsDir });
    assert.equal(
      resumed.ran.length,
      4 - finished,
      `after ${finished} finished jobs, ${4 - finished} are left to compute`,
    );
    assert.deepEqual(result.outcomes.filter((outcome) => outcome.source === "cached").length, finished);
    assert.equal(manifestBytes(runsDir, "pair"), manifestBytes(uninterrupted, "pair"));
    assert.deepEqual(storeFiles(runsDir), storeFiles(uninterrupted));
  }
});

test("a killed run leaves the manifest of the run before it, which names nothing that is not there", async (t) => {
  const runsDir = tempDir(t);
  const one = suiteOf("pair", [{ name: "singlet", opticalCase: SINGLET }]);
  await runSuite({ suite: one, registry: threeFakes().registry, runsDir, engines: ["fake-a"] });
  const before = manifestBytes(runsDir, "pair");

  const dying = watchedRegistry({
    "fake-a": dyingAfter(fakeEngine(), { left: 0 }),
    "fake-b": dyingAfter(fakeEngine(), { left: 0 }),
  });
  await assert.rejects(runSuite({ suite: pairSuite(), registry: dying.registry, runsDir }), /killed/);
  assert.equal(manifestBytes(runsDir, "pair"), before);
  const manifest: RunManifest = JSON.parse(before);
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  for (const job of manifest.jobs) assert.ok(store.has(job.storeKey ?? ""));
  for (const run of manifest.runs) assert.ok(existsSync(join(runsDir, "pair", CASES_DIRECTORY, `${run.caseId}.json`)));
});

test("a store entry that cannot be trusted is a miss: a warning, and the job is computed again", async (t) => {
  const runsDir = tempDir(t);
  const { manifest } = await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir });
  const before = manifestBytes(runsDir, "pair");
  const [cutShort, forged] = [manifest.jobs[0].storeKey ?? "", manifest.jobs[4].storeKey ?? ""];
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));

  // One entry cut short, as by a full disk; one valid in every way a schema sees, with an array that was altered.
  writeFileSync(join(store.directory, `${cutShort}.json`), '{"request":{"caseId"');
  const found = store.get(forged);
  assert.ok(found.kind === "hit");
  const data = found.entry.result.data as SelftestEchoData;
  const altered = {
    ...found.entry.result,
    data: { ...data, values: { $nd: { ...data.values.$nd, sha256: "0".repeat(64) } } },
  };
  writeFileSync(
    join(store.directory, `${forged}.json`),
    `${canonicalJson({ request: found.entry.request, result: altered })}\n`,
  );
  assert.equal(store.get(forged).kind, "hit", "the envelope is valid; only the data is not");

  const engines = threeFakes();
  const result = await runSuite({ suite: pairSuite(), registry: engines.registry, runsDir });
  assert.deepEqual(engines.ran, ["fake-a", "fake-b"]);
  assert.deepEqual(
    result.outcomes.map((outcome) => outcome.source),
    ["computed", "cached", "negotiated", "cached", "computed", "negotiated"],
  );
  assert.equal(result.warnings.length, 2);
  assert.match(
    result.warnings[0],
    new RegExp(`^store entry ${cutShort}: it is malformed JSON .*; the job is computed again$`),
  );
  assert.match(
    result.warnings[1],
    new RegExp(`^store entry ${forged}: its data cannot be used: /values: ndarray: sha256 mismatch`),
  );
  assert.equal(manifestBytes(runsDir, "pair"), before);

  const repaired = threeFakes();
  const again = await runSuite({ suite: pairSuite(), registry: repaired.registry, runsDir });
  assert.deepEqual(repaired.ran, []);
  assert.deepEqual(again.warnings, []);
});

test("another fingerprint finds none of the old answers: a changed engine is asked again", async (t) => {
  const runsDir = tempDir(t);
  const suite = pairSuite();
  await runSuite({ suite, registry: watchedRegistry({ "fake-a": fakeEngine() }).registry, runsDir });
  const changed = watchedRegistry({ "fake-a": fakeEngine({ fingerprint: "sources-after-an-edit" }) });
  const result = await runSuite({ suite, registry: changed.registry, runsDir });
  assert.deepEqual(changed.ran, ["fake-a", "fake-a"]);
  assert.equal(storeFiles(runsDir).length, 4, "the old answers stay, under the old fingerprint");
  assert.deepEqual(result.manifest.engines[0], {
    id: "fake-a",
    status: "available",
    version: "1",
    fingerprint: "sources-after-an-edit",
    details: { bias: 0, offersQuantities: true, failMode: "none" },
  });
});

// ── Engine options ───────────────────────────────────────────────────────────────────────────────────────────────

test("a run's options for an engine travel with its requests, key its answers, and change no request id", async (t) => {
  const runsDir = tempDir(t);
  const sampled = (rays: number): LoadedSuite =>
    suiteOf("options", [
      { name: "singlet", opticalCase: SINGLET, sampling: { bundleGrid: 9, engines: { "fake-b": { rays } } } },
    ]);
  const engines = (): WatchedRegistry => watchedRegistry({ "fake-a": fakeEngine(), "fake-b": fakeEngine({ bias: 1 }) });

  const first = engines();
  const result = await runSuite({ suite: sampled(64), registry: first.registry, runsDir });
  const sent = (watched: WatchedRegistry): (QuantityRequest["engineOptions"] | undefined)[] =>
    watched.requests.map((request) => request.engineOptions);
  assert.deepEqual(sent(first), [undefined, { rays: 64 }]);
  assert.equal(first.requests[0].id, first.requests[1].id);
  assert.equal(result.manifest.jobs[0].requestId, result.manifest.jobs[1].requestId);

  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const kept = store.get(result.manifest.jobs[1].storeKey ?? "");
  assert.deepEqual(kept.kind === "hit" && kept.entry.request.engineOptions, { rays: 64 });
  const fingerprint = parseFakeOptions({ id: "fake-b", bias: 1 }).fingerprint;
  const parts = { requestId: first.requests[1].id, engineId: "fake-b", engineFingerprint: fingerprint };
  assert.equal(result.manifest.jobs[1].storeKey, storeKey({ ...parts, engineOptions: { rays: 64 } }));
  assert.notEqual(result.manifest.jobs[1].storeKey, storeKey(parts));

  // The same options are a hit; another value of one option is another answer.
  const same = engines();
  await runSuite({ suite: sampled(64), registry: same.registry, runsDir });
  assert.deepEqual(same.ran, []);
  const other = engines();
  const changed = await runSuite({ suite: sampled(128), registry: other.registry, runsDir });
  assert.deepEqual(other.ran, ["fake-b"]);
  assert.notEqual(changed.manifest.jobs[1].storeKey, result.manifest.jobs[1].storeKey);
  assert.equal(changed.manifest.jobs[0].storeKey, result.manifest.jobs[0].storeKey);
});

test("options named for an engine id that every object inherits a member for are not found by accident", async (t) => {
  const suite = suiteOf("inherited", [{ name: "singlet", opticalCase: SINGLET, sampling: { engines: {} } }]);
  const engines = watchedRegistry({ constructor: fakeEngine() });
  const result = await runSuite({ suite, registry: engines.registry, runsDir: tempDir(t) });
  assert.deepEqual(rows(result), ["singlet selftest constructor ok computed"]);
  assert.equal(engines.requests[0].engineOptions, undefined);
});

// ── Runs that could not be started ───────────────────────────────────────────────────────────────────────────────

test("a run without a case is recorded with its problems and has no jobs; the others run", async (t) => {
  const runsDir = tempDir(t);
  const problem = "no case source builds cases from LensVisualizer lenses";
  const suite = suiteOf("partly", [
    { name: "lv", opticalCase: null, problems: [problem] },
    { name: "singlet", opticalCase: SINGLET },
  ]);
  const result = await runSuite({ suite, registry: threeFakes().registry, runsDir, engines: ["fake-a"] });
  assert.deepEqual(rows(result), ["singlet selftest fake-a ok computed"]);
  assert.deepEqual(result.manifest.runs, [
    { name: "lv", caseId: null, problems: [problem] },
    { name: "singlet", caseId: SINGLET.id, problems: [] },
  ]);
  assert.deepEqual(readdirSync(join(runsDir, "partly", CASES_DIRECTORY)), [`${SINGLET.id}.json`]);
});

test("a suite none of whose runs can start still writes its manifest, with no jobs and no engine", async (t) => {
  const runsDir = tempDir(t);
  const suite = suiteOf("nothing", [{ name: "lv", opticalCase: null, problems: ["no case"] }]);
  const engines = threeFakes();
  const result = await runSuite({ suite, registry: engines.registry, runsDir });
  assert.deepEqual(result.manifest.jobs, []);
  assert.deepEqual(result.manifest.engines, []);
  assert.deepEqual(engines.created, []);
  assert.deepEqual(readdirSync(join(runsDir, "nothing")), [MANIFEST_FILE]);
});

// ── The output directory ─────────────────────────────────────────────────────────────────────────────────────────

test("the next run of a suite replaces its output: cases no run uses any more are removed", async (t) => {
  const runsDir = tempDir(t);
  await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir });
  const directory = join(runsDir, "pair", CASES_DIRECTORY);
  assert.equal(readdirSync(directory).length, 2);
  // What a killed writer leaves behind is cleared with the rest.
  writeFileSync(join(directory, `${SINGLET.id}.json.123.abcdef.tmp`), "{");
  mkdirSync(join(directory, "stray"));

  const smaller = suiteOf("pair", [{ name: "double-gauss", opticalCase: DOUBLE_GAUSS }]);
  const result = await runSuite({ suite: smaller, registry: threeFakes().registry, runsDir });
  assert.deepEqual(readdirSync(directory), [`${DOUBLE_GAUSS.id}.json`]);
  assert.deepEqual(JSON.parse(manifestBytes(runsDir, "pair")), result.manifest);
  assert.equal(result.manifest.jobs.length, 3);
  assert.equal(storeFiles(runsDir).length, 4, "the store keeps every answer; only the run's own directory is replaced");

  const none = suiteOf("pair", [{ name: "lv", opticalCase: null, problems: ["no case"] }]);
  await runSuite({ suite: none, registry: threeFakes().registry, runsDir });
  assert.deepEqual(readdirSync(directory), []);
});

test("suites share the store and keep their own directories", async (t) => {
  const runsDir = tempDir(t);
  const first = watchedRegistry({ "fake-a": fakeEngine() });
  await runSuite({
    suite: suiteOf("one", [{ name: "singlet", opticalCase: SINGLET }]),
    registry: first.registry,
    runsDir,
  });
  const second = watchedRegistry({ "fake-a": fakeEngine() });
  const other = suiteOf("another", [
    { name: "the-same-lens", opticalCase: SINGLET },
    { name: "gauss", opticalCase: DOUBLE_GAUSS },
  ]);
  const result = await runSuite({ suite: other, registry: second.registry, runsDir });
  assert.deepEqual(rows(result), ["the-same-lens selftest fake-a ok cached", "gauss selftest fake-a ok computed"]);
  assert.deepEqual(readdirSync(runsDir).sort(), ["another", "one", STORE_DIRECTORY]);
});

// ── Determinism ──────────────────────────────────────────────────────────────────────────────────────────────────

test("two runs into different directories write the same bytes, and none of them says where or when", async (t) => {
  const [here, there] = [tempDir(t), tempDir(t)];
  const module = join(REPO_ROOT, "no", "such", "engine.ts");
  const engines = (): WatchedRegistry =>
    watchedRegistry({
      "fake-a": fakeEngine(),
      "fake-b": fakeEngine({ bias: 0.001 }),
      "fake-none": fakeEngine({ offersQuantities: false }),
      refuses: fakeEngine({ failMode: "protocol-error" }),
      broken: (id) =>
        Promise.reject(new EngineUnavailableError(id, "load-failed", `its module ${module} does not exist`)),
    });
  const suite = suiteOf("pair", [
    { name: "singlet", opticalCase: SINGLET },
    { name: "lv", opticalCase: null, problems: ["no case source builds cases from LensVisualizer lenses"] },
    { name: "double-gauss", opticalCase: DOUBLE_GAUSS },
  ]);
  await runSuite({ suite, registry: engines().registry, runsDir: here });
  await runSuite({ suite, registry: engines().registry, runsDir: there });

  const text = manifestBytes(here, "pair");
  assert.equal(text, manifestBytes(there, "pair"));
  assert.deepEqual(storeFiles(here), storeFiles(there));
  for (const file of storeFiles(here)) {
    const path = join(STORE_DIRECTORY, file);
    assert.equal(readFileSync(join(here, path), "utf8"), readFileSync(join(there, path), "utf8"), file);
  }
  for (const opticalCase of [SINGLET, DOUBLE_GAUSS]) {
    const path = join("pair", CASES_DIRECTORY, `${opticalCase.id}.json`);
    assert.equal(readFileSync(join(here, path), "utf8"), readFileSync(join(there, path), "utf8"));
  }

  // No path of this machine, no word an engine or the system chose, no clock.
  for (const absent of [here, there, REPO_ROOT, "/", "\\\\", "does not exist", "refused", "cached", "computed"]) {
    assert.ok(!text.includes(absent), `the manifest holds ${JSON.stringify(absent)}`);
  }
  const manifest: RunManifest = JSON.parse(text);
  const members = new Set(manifest.jobs.flatMap((job) => Object.keys(job)));
  assert.deepEqual([...members].sort(), [
    "caseId",
    "engine",
    "error",
    "quantity",
    "requestId",
    "run",
    "rung",
    "status",
    "storeKey",
    "unsupported",
  ]);
  for (const job of manifest.jobs) {
    if (job.error !== undefined) assert.deepEqual(Object.keys(job.error), ["code"]);
    for (const item of job.unsupported ?? []) assert.deepEqual(Object.keys(item).sort(), ["code", "item"]);
  }
});

// ── The fixture root ─────────────────────────────────────────────────────────────────────────────────────────────

test("the fixture suite runs on the fixture root's engines, built by the real registry", async (t) => {
  const runsDir = tempDir(t);
  const loaded = loadConfig({ rootDir: FAKE_ROOT, env: {} });
  const registry = createEngineRegistry(loaded);
  assert.deepEqual(registry.ids(), ["fake-a", "fake-b", "fake-near", "fake-none", "fake-py", "fake-pyn"]);
  const suite = await loadSuite(FAKE_PAIR_SUITE, { rootDir: loaded.rootDir });
  // Three of the in-process engines: fake-py and fake-pyn are Python workers, which test/engines/pythonFake.test.ts
  // and test/report/golden.test.ts run, and fake-near is in the reports of the latter.
  const result = await runSuite({ suite, registry, runsDir, engines: ["fake-a", "fake-b", "fake-none"] });
  assert.deepEqual(rows(result), [
    "singlet selftest fake-a ok computed",
    "singlet selftest fake-b ok computed",
    "singlet selftest fake-none unsupported negotiated",
    "double-gauss selftest fake-a ok computed",
    "double-gauss selftest fake-b ok computed",
    "double-gauss selftest fake-none unsupported negotiated",
  ]);
  // The in-memory suite of these tests differs from the file only in its name and lens paths: the jobs are equal.
  const inMemory = await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir: tempDir(t) });
  assert.deepEqual(result.manifest.jobs, inMemory.manifest.jobs);
  assert.deepEqual(result.manifest.engines, inMemory.manifest.engines);
});

// ── Case sources ─────────────────────────────────────────────────────────────────────────────────────────────────

/** The pair suite with its first run named as a LensVisualizer lens, as a source of that kind would have built it. */
function lvFirstSuite(): LoadedSuite {
  const suite = pairSuite();
  const [first, ...rest] = suite.runs;
  const spec = { ...first.spec, lens: { kind: "lv", key: "some-lens" } as const };
  return { ...suite, runs: [{ ...first, spec }, ...rest] };
}

/** A case source that resolves nothing and audits itself as told, counting how often it is asked. */
function auditedSource(audit: () => SourceAudit | null): CaseSource & { asked: string[] } {
  const asked: string[] = [];
  return {
    asked,
    resolve: () => assert.fail("a loaded suite is not resolved again"),
    audit: () => {
      asked.push("audit");
      return audit();
    },
  };
}

const LV_FINGERPRINT = {
  commit: "c".repeat(40),
  dirty: false,
  engineClosureHash: "ab".repeat(32),
  engineFileCount: 141,
};

test("a case source that identifies its inputs is recorded in the manifest, audited once the last job has ended", async (t) => {
  const runsDir = tempDir(t);
  const lv = auditedSource(() => ({ fingerprint: LV_FINGERPRINT, changed: [] }));
  const result = await runSuite({
    suite: lvFirstSuite(),
    registry: threeFakes().registry,
    runsDir,
    sources: { lv },
    onJob: () => void lv.asked.push("job"),
  });
  assert.deepEqual(lv.asked, [...Array.from({ length: 6 }, () => "job"), "audit"]);
  assert.deepEqual(result.manifest.sources, { lv: { fingerprint: LV_FINGERPRINT, status: "unchanged" } });
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(JSON.parse(manifestBytes(runsDir, "pair")).sources, result.manifest.sources);
});

test("a source that changed during the run marks the manifest, and the warning says what changed", async (t) => {
  const changed = ["src/optics/trace/aperture.ts", "src/lens-data/acme/Some.data.ts"];
  const lv = auditedSource(() => ({ fingerprint: LV_FINGERPRINT, changed }));
  const result = await runSuite({
    suite: lvFirstSuite(),
    registry: threeFakes().registry,
    runsDir: tempDir(t),
    sources: { lv },
  });
  assert.equal(SOURCE_CHANGED, "source-changed-during-run");
  assert.deepEqual(result.manifest.sources, { lv: { fingerprint: LV_FINGERPRINT, status: SOURCE_CHANGED } });
  assert.deepEqual(result.warnings, [
    "case source lv changed during the run: src/optics/trace/aperture.ts, src/lens-data/acme/Some.data.ts",
  ]);
  // The jobs are what they were: the mark says the run cannot be trusted, it does not rewrite it.
  assert.deepEqual(
    result.manifest.jobs.map((job) => job.status),
    ["ok", "ok", "unsupported", "ok", "ok", "unsupported"],
  );
});

test("only a source that serves a run of the suite and has something to say is in the manifest", async (t) => {
  const run = (suite: LoadedSuite, sources: RunSuiteInput["sources"]): Promise<SuiteRunResult> =>
    runSuite({ suite, registry: threeFakes().registry, runsDir: tempDir(t), sources });

  // No run of the suite names a LensVisualizer lens: its source is not asked.
  const unused = auditedSource(() => assert.fail("a source no run uses was audited"));
  assert.equal((await run(pairSuite(), { lv: unused })).manifest.sources, undefined);
  // A source that built nothing has nothing to say, and one without an audit is never asked.
  const idle = auditedSource(() => null);
  const plain: CaseSource = { resolve: () => assert.fail("a loaded suite is not resolved again") };
  assert.equal((await run(lvFirstSuite(), { lv: idle, fixture: plain })).manifest.sources, undefined);
  assert.deepEqual(idle.asked, ["audit"]);
  assert.equal((await run(lvFirstSuite(), undefined)).manifest.sources, undefined);
  // A manifest without the member is the manifest of before: its text does not name it.
  const runsDir = tempDir(t);
  await runSuite({ suite: pairSuite(), registry: threeFakes().registry, runsDir });
  assert.ok(!manifestBytes(runsDir, "pair").includes("sources"));
});

test("a rung that builds a request that is not its own is a defect, reported before anything runs", async (t) => {
  const stray: RungDefinition = {
    id: "stray",
    quantity: SELFTEST_ECHO,
    buildRequests: () => selftestRung.buildRequests(DOUBLE_GAUSS, pairSuite().runs[1].spec),
  };
  const badSpec: RungDefinition = {
    id: "bad-spec",
    quantity: SELFTEST_ECHO,
    buildRequests: (opticalCase) => [
      makeRequest({ caseId: opticalCase.id, quantity: SELFTEST_ECHO, spec: { scale: 1 } }),
    ],
  };
  const repeats: RungDefinition = {
    id: "repeats",
    quantity: SELFTEST_ECHO,
    buildRequests: (opticalCase, runSpec) => [
      ...selftestRung.buildRequests(opticalCase, runSpec),
      ...selftestRung.buildRequests(opticalCase, runSpec),
    ],
  };
  const unknown: RungDefinition = { id: "unknown", quantity: "rays.trace", buildRequests: () => [] };
  const foreign: RungDefinition = {
    id: "foreign",
    quantity: SELFTEST_ECHO,
    buildRequests: (opticalCase, runSpec) => {
      const { caseId, spec } = selftestRung.buildRequests(opticalCase, runSpec)[0];
      return [makeRequest({ caseId, quantity: "rays.trace", spec })];
    },
  };
  const defects: [RungDefinition, RegExp][] = [
    [stray, /^Error: rung stray: it built a request about case/],
    [foreign, /^Error: rung foreign: it built a request for rays\.trace, not for its selftest\.echo$/],
    [badSpec, /^Error: rung bad-spec: it built a request whose spec is not a selftest\.echo spec/],
    [repeats, /^Error: rung repeats: it built a request twice/],
    [unknown, /^Error: rung unknown: rays\.trace is not a quantity$/],
  ];
  for (const [definition, message] of defects) {
    const engines = threeFakes();
    const runsDir = join(tempDir(t), "runs");
    const suite = suiteOf("defect", [{ name: "singlet", opticalCase: SINGLET }]);
    await assert.rejects(
      runSuite({ suite, registry: engines.registry, runsDir, rungDefinitions: [definition] }),
      message,
    );
    assert.deepEqual(engines.created, []);
    assert.equal(existsSync(runsDir), false);
  }
});
