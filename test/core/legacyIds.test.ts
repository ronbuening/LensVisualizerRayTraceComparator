// The legacy-id plumbing (`src/core/legacyIds.ts`) with synthetic maps: the real maps are empty, so every test here
// hands the functions a rename of its own. An old id on input is read as its new one with one note per command; a
// baseline committed before a rename is read under the new ids, its pairs in the writer's order; a run directory
// written before one is refused; a configuration that defines an engine under an old id is refused; and the catalog
// snapshot keeps the ids it was written with.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { MTF_BASELINE, buildBaseline, parseBaseline } from "../../src/baseline/build.ts";
import { renderMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { baselineAtCurrentIds, renderBaselineReport } from "../../src/baseline/report.ts";
import { checkInIdSpace, createBaselineCommand } from "../../src/cli/commands/baseline.ts";
import { classifyCatalog, failureEvidence } from "../../src/baseline/catalog.ts";
import type { KnownFailure } from "../../src/baseline/catalog.ts";
import { checkBaseline } from "../../src/baseline/check.ts";
import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import type { CliCommand } from "../../src/cli/main.ts";
import { readComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import {
  LEGACY_CHECK_IDS,
  LEGACY_ENGINE_IDS,
  LEGACY_IDS,
  LEGACY_RUN_CODE,
  aliasCheckId,
  currentCheckId,
  currentEngineId,
  currentIds,
  inverseMaps,
  legacyCheckId,
  legacyEngineId,
  legacyIdsOfRun,
  snapshotIds,
  takeAliases,
} from "../../src/core/legacyIds.ts";
import type { LegacyMaps } from "../../src/core/legacyIds.ts";
import { readRunManifest } from "../../src/core/manifest.ts";
import { jobEstimateGiB, JOB_GIB, R6C_JOB_GIB } from "../../src/core/memoryBudget.ts";
import { planJobs, selectEngines } from "../../src/core/orchestrator.ts";
import { RUNGS, selectRungs } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { loadSuiteValue, specAtCurrentIds } from "../../src/core/suite.ts";
import { OLD_ENGINE_ID_CODE, OldEngineIdError, createEngineRegistry } from "../../src/engines/registry.ts";
import { codeTextOf } from "../../src/vocabulary/index.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "./support.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const NONE: LegacyMaps = { checks: {}, engines: {} };

test("the maps are empty and frozen until the renames, and each id is its own", () => {
  assert.deepEqual(LEGACY_CHECK_IDS, {});
  assert.deepEqual(LEGACY_ENGINE_IDS, {});
  assert.ok(Object.isFrozen(LEGACY_CHECK_IDS) && Object.isFrozen(LEGACY_ENGINE_IDS) && Object.isFrozen(LEGACY_IDS));
  for (const rung of RUNGS) assert.equal(currentCheckId(rung.id), rung.id);
  for (const id of ["lv", "ref", "ref-seidel", "replay", "wave", "flux", "optiland", "optiland-wave"])
    assert.equal(currentEngineId(id), id);
  assert.equal(currentCheckId("r2", { r2: "ray-trace" }), "ray-trace");
  assert.equal(currentEngineId("ref", { ref: "reference-tracer" }), "reference-tracer");
  // A member of Object.prototype is no old id.
  assert.equal(currentCheckId("constructor", { r2: "ray-trace" }), "constructor");
});

// ── Input ────────────────────────────────────────────────────────────────────────────────────────────────────────

const RENAMED: readonly RungDefinition[] = RUNGS.map((rung) =>
  rung.id === "r2" ? { ...rung, id: "ray-trace" } : rung,
);

test("an old check or engine id on input is read as its new id, and noted once", () => {
  takeAliases();
  const rungs = selectRungs(["r1", "r2", "r2"], RENAMED, { r2: "ray-trace" });
  assert.deepEqual(
    rungs.map((rung) => rung.id),
    ["r1", "ray-trace"],
  );
  const known = { configured: [], builtin: ["lv", "reference-tracer"] };
  assert.deepEqual(selectEngines(["ref", "lv"], known, { ref: "reference-tracer" }), ["lv", "reference-tracer"]);
  assert.deepEqual(takeAliases(), [
    { kind: "check", old: "r2", now: "ray-trace" },
    { kind: "engine", old: "ref", now: "reference-tracer" },
  ]);
  assert.deepEqual(takeAliases(), [], "taking the aliases forgets them");
  // An id that is neither old nor known is still unknown, by the name it was given.
  assert.throws(() => selectRungs(["r99"], RENAMED, { r2: "ray-trace" }), /unknown rung "r99"/);
  // With the real, empty maps nothing is read otherwise.
  assert.deepEqual(
    selectRungs(["r2"]).map((rung) => rung.id),
    ["r2"],
  );
  assert.deepEqual(takeAliases(), []);
});

test("an id the handed ladder or registry knows is never read as an old one (a test's stand-ins)", () => {
  takeAliases();
  // A ladder that still has a rung "r2" keeps it, though the map renames r2.
  assert.deepEqual(
    selectRungs(["r2"], RUNGS, { r2: "ray-trace" }).map((rung) => rung.id),
    ["r2"],
  );
  // A registry that names an engine "ref" keeps it, though the map renames ref.
  const known = { configured: ["ref"], builtin: ["reference-tracer"] };
  assert.deepEqual(selectEngines(["ref"], known, { ref: "reference-tracer" }), ["ref"]);
  assert.deepEqual(takeAliases(), [], "nothing was read as an old id");
});

/** A registry of ids alone: planning contacts no engine. */
function idsOnly(ids: readonly string[]) {
  return {
    ids: () => [...ids].sort(),
    builtinIds: () => [],
    create: async (): Promise<never> => {
      throw new Error("planning makes no engine");
    },
  };
}

/** What a plan asks: each run's spec, and each job's run, check, engine, request id and options. */
function planned(plan: Awaited<ReturnType<typeof planJobs>>) {
  return {
    specs: plan.runs.map((run) => run.spec),
    jobs: plan.jobs.map((job) => [job.run, job.rung.id, job.engineId, job.request.id, job.request.engineOptions]),
  };
}

test("a suite's checks, engines, reference engine and engine options are read under the new ids", async (t) => {
  takeAliases();
  t.after(() => takeAliases());
  const maps: LegacyMaps = { checks: { selftest: "pipeline-echo" }, engines: { "fake-a": "fake-alpha" } };
  const ladder = RUNGS.map((rung) => (rung.id === "selftest" ? { ...rung, id: "pipeline-echo" } : rung));
  const written = JSON.parse(readFileSync(FAKE_PAIR_SUITE, "utf8"));
  const suiteOf = (rung: string, engine: string) => ({
    ...written,
    defaults: {
      rungs: [rung],
      engines: [engine, "fake-b"],
      referenceEngine: engine,
      sampling: { engines: { [engine]: { bias: 1 } } },
    },
  });
  const options = { rootDir: FAKE_ROOT };
  const old = await loadSuiteValue(suiteOf("selftest", "fake-a"), "old", options);
  const now = await loadSuiteValue(suiteOf("pipeline-echo", "fake-alpha"), "now", options);
  assert.notEqual(old.hash, now.hash, "a suite's hash is that of the file as written");
  const plan = async (suite: typeof old) =>
    planJobs({
      suite,
      registry: idsOnly(["fake-alpha", "fake-b"]),
      runsDir: tempDir(t),
      rungDefinitions: ladder,
      legacy: maps,
    });
  const fromOld = planned(await plan(old));
  assert.deepEqual(takeAliases(), [
    { kind: "engine", old: "fake-a", now: "fake-alpha" },
    { kind: "check", old: "selftest", now: "pipeline-echo" },
  ]);
  assert.deepEqual(fromOld, planned(await plan(now)), "the same runs and jobs, under the new ids");
  assert.equal(fromOld.specs[0].referenceEngine, "fake-alpha");
  assert.deepEqual(fromOld.jobs[0][4], { bias: 1 }, "the options stated under the old id are the engine's");
  assert.deepEqual(takeAliases(), []);

  // Against a ladder and a registry that know the old ids themselves, nothing is read otherwise.
  const spec = old.runs[0].spec;
  assert.equal(specAtCurrentIds(spec, { checks: ["selftest"], engines: ["fake-a", "fake-b"] }, maps), spec);
  assert.deepEqual(takeAliases(), []);
  // Options under both ids of one engine are refused.
  const both = { ...spec, sampling: { engines: { "fake-a": {}, "fake-alpha": {} } } };
  assert.throws(
    () => specAtCurrentIds(both, { checks: [], engines: [] }, maps),
    /sampling\.engines states options for fake-alpha under two ids/,
  );
});

test("a command says the old ids it read once, after it ends, however often it read them", async () => {
  takeAliases();
  const maps = { r2: "ray-trace", r3: "optical-path" };
  const reading: CliCommand = {
    name: "reading",
    summary: "reads ids",
    run: async (args) => {
      for (const id of args) aliasCheckId(id, maps);
      return EXIT_OK;
    },
  };
  const err: string[] = [];
  const io = { stdout: () => undefined, stderr: (text: string) => void err.push(text) };
  assert.equal(await runCli(["reading", "r2", "r2", "r3", "r9"], io, [reading]), EXIT_OK);
  const lines = err.join("").split("\n").filter(Boolean);
  assert.equal(lines.length, 1, err.join(""));
  assert.match(lines[0], /^note: .*check r2 is now ray-trace; check r3 is now optical-path; write the new ids/);
  err.length = 0;
  assert.equal(await runCli(["reading", "r9"], io, [reading]), EXIT_OK);
  assert.deepEqual(err, [], "no note where no old id was read");
});

test("the memory estimate knows an old check id", () => {
  assert.equal(jobEstimateGiB(["r6c"]), R6C_JOB_GIB);
  assert.equal(jobEstimateGiB(["wave-four"], { "wave-four": "r6c" }), R6C_JOB_GIB);
  assert.equal(jobEstimateGiB(["wave-four"]), JOB_GIB);
});

// ── Baselines ────────────────────────────────────────────────────────────────────────────────────────────────────

/** A baseline by hand: two runs' worth of every member that names a check or an engine, in the writer's order. */
function handBaseline(suite = "hand"): Baseline {
  const pair = (a: string, b: string) => ({ a, b, verdict: "PASS" as const, verdicts: [], metrics: [] });
  return {
    contract: "1.1",
    kind: "baseline",
    suite: { name: suite, hash: "0".repeat(64) },
    policy: { version: 1, hash: "1".repeat(64) },
    engines: ["lv", "optiland", "ref"].map((id) => ({ id, version: "1", fingerprint: "2".repeat(64), details: {} })),
    runs: [
      {
        name: "run",
        caseId: "3".repeat(64),
        rungs: [
          {
            rung: "r2",
            quantity: "rays.trace",
            requests: 1,
            support: [
              { engine: "lv", status: "ok" },
              { engine: "optiland", status: "ok" },
              { engine: "ref", status: "ok" },
            ],
            rays: [
              { engine: "lv", ok: 1, blocked: 0, failed: 0 },
              { engine: "ref", ok: 1, blocked: 0, failed: 0 },
            ],
            pairs: [pair("lv", "optiland"), pair("lv", "ref"), pair("optiland", "ref")],
            steps: [
              { engine: "lv", step: "s", jobs: 1, status: "ok" },
              { engine: "ref", step: "s", jobs: 1, status: "ok" },
            ],
            sets: [
              {
                participants: [
                  { engine: "lv", status: "ok" },
                  { engine: "ref", status: "ok" },
                ],
                pairs: [{ a: "lv", b: "ref", verdict: "PASS", metrics: [] }],
              },
            ],
          },
        ],
      },
    ],
  } as unknown as Baseline;
}

test("a baseline committed before a rename is read under the new ids, every list in the writer's order", () => {
  const before = handBaseline();
  assert.equal(currentIds(before), before, "with the real maps a baseline is the same object");
  assert.equal(currentIds(before, NONE), before);
  // "ref" renamed "aaa" sorts before "lv": every list the writer sorts by engine is sorted again.
  const after = currentIds(before, { checks: { r2: "ray-trace" }, engines: { ref: "aaa" } });
  assert.deepEqual(
    after.engines.map((engine) => engine.id),
    ["aaa", "lv", "optiland"],
  );
  const [rung] = after.runs[0].rungs;
  assert.equal(rung.rung, "ray-trace");
  assert.deepEqual(
    rung.support.map((each) => each.engine),
    ["aaa", "lv", "optiland"],
  );
  assert.deepEqual(
    rung.rays?.map((each) => each.engine),
    ["aaa", "lv"],
  );
  assert.deepEqual(
    rung.pairs.map(({ a, b }) => [a, b]),
    [
      ["aaa", "lv"],
      ["aaa", "optiland"],
      ["lv", "optiland"],
    ],
  );
  assert.deepEqual(
    rung.steps?.map((each) => each.engine),
    ["aaa", "lv"],
  );
  assert.deepEqual(
    rung.sets?.[0].participants.map((each) => each.engine),
    ["aaa", "lv"],
  );
  assert.deepEqual(
    rung.sets?.[0].pairs.map(({ a, b }) => [a, b]),
    [["aaa", "lv"]],
  );
  // The committed object is not touched.
  assert.equal(before.runs[0].rungs[0].rung, "r2");
  assert.equal(before.runs[0].rungs[0].pairs[1].b, "ref");
});

test("every committed baseline is read unchanged with the real maps", () => {
  for (const file of ["benchmark.json", "benchmark.mtf.json", "catalog.json"]) {
    const read = parseBaseline(readFileSync(join(ROOT, "baselines", file), "utf8"));
    assert.ok("baseline" in read, file);
    assert.equal(currentIds(read.baseline), read.baseline, file);
  }
});

test("reports are rendered under the new ids, but the catalog snapshot's keep the ids it was written with", () => {
  const maps: LegacyMaps = { checks: { r2: "ray-trace" }, engines: { ref: "aaa" } };
  const hand = handBaseline();
  assert.notEqual(baselineAtCurrentIds(hand, maps), hand);
  assert.equal(baselineAtCurrentIds(hand, maps).runs[0].rungs[0].rung, "ray-trace");
  const catalog = handBaseline("catalog");
  assert.equal(baselineAtCurrentIds(catalog, maps), catalog, "the catalog keeps its raw ids");

  // A real committed catalog baseline renders the same bytes whatever the maps say.
  const committed = parseBaseline(readFileSync(join(ROOT, "baselines", "catalog.json"), "utf8"));
  assert.ok("baseline" in committed);
  const renamed: LegacyMaps = { checks: { r2: "ray-trace", r0: "built-system" }, engines: { ref: "aaa" } };
  assert.deepEqual(renderBaselineReport(committed.baseline, renamed), renderBaselineReport(committed.baseline));
  assert.equal(
    renderBaselineReport(committed.baseline).json,
    readFileSync(join(ROOT, "reports", "catalog", "rays.json"), "utf8"),
  );
});

// ── Run directories and configurations ──────────────────────────────────────────────────────────────────────────

interface Ended {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

/** The fixture pair suite run on two in-process engines, compared, into a temporary runs directory. */
async function pairRun(t: TestContext): Promise<string> {
  const runsDir = join(tempDir(t), "runs");
  const ended = await cli(runsDir, NONE, ["run", FAKE_PAIR_SUITE, "--engines", "fake-a,fake-near"]);
  assert.equal(ended.code, EXIT_OK, ended.err);
  const compared = await cli(runsDir, NONE, ["compare", "fake-pair"]);
  assert.equal(compared.code, EXIT_OK, compared.err);
  return runsDir;
}

async function cli(runsDir: string, legacy: LegacyMaps, args: readonly string[]): Promise<Ended> {
  const inputs = { rootDir: FAKE_ROOT, cwd: ROOT, env: { LVRTC_RUNS_DIR: runsDir }, legacy };
  const commands = [
    createRunCommand(inputs),
    createCompareCommand(inputs),
    createReportCommand(inputs),
    createBaselineCommand(inputs),
  ];
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(args, io, commands);
  return { code, out: out.join(""), err: err.join("") };
}

test("compare, report and baseline write refuse a run directory written before a rename", async (t) => {
  const runsDir = await pairRun(t);
  const directory = join(runsDir, "fake-pair");
  const manifest = readRunManifest(directory);
  const comparisons = readComparisonFile(directory);
  assert.deepEqual(legacyIdsOfRun(manifest, comparisons), [], "written with today's ids");
  const words = codeTextOf(LEGACY_RUN_CODE);
  assert.ok(words !== undefined && words.remedy !== "");
  const renames: readonly (readonly [LegacyMaps, string])[] = [
    [{ checks: { selftest: "pipeline-echo" }, engines: {} }, "check selftest"],
    [{ checks: {}, engines: { "fake-near": "fake-close" } }, "engine fake-near"],
  ];
  for (const [maps, old] of renames) {
    assert.deepEqual(legacyIdsOfRun(manifest, comparisons, maps), [old]);
    for (const args of [
      ["compare", "fake-pair"],
      ["report", "fake-pair"],
      ["baseline", "write", "fake-pair", "--root", tempDir(t)],
    ]) {
      const ended = await cli(runsDir, maps, args);
      assert.equal(ended.code, EXIT_USAGE, `${args.join(" ")}: ${ended.err}`);
      assert.ok(ended.err.includes(`${LEGACY_RUN_CODE}: ${directory}: it names ${old}`), ended.err);
      assert.ok(ended.err.includes(words.sentence.slice(0, 40)), ended.err);
    }
  }
  // Read with the real maps, the same directory is reported as before.
  assert.equal((await cli(runsDir, NONE, ["report", "fake-pair"])).code, EXIT_OK);
});

test("a configuration that defines an engine under an old id is refused, with the code's words", () => {
  const loaded = {
    rootDir: FAKE_ROOT,
    config: {
      engineDefinitions: { "fake-a": { transport: "in-process", module: "x.ts", options: {} } },
    },
  } as unknown as Parameters<typeof createEngineRegistry>[0];
  assert.doesNotThrow(() => createEngineRegistry(loaded));
  assert.throws(
    () => createEngineRegistry(loaded, undefined, undefined, { "fake-a": "fake-alpha" }),
    (error: unknown) =>
      error instanceof OldEngineIdError &&
      error.code === OLD_ENGINE_ID_CODE &&
      /engines\.fake-a \(now fake-alpha\)/.test(error.message),
  );
  assert.ok(codeTextOf(OLD_ENGINE_ID_CODE) !== undefined);
});

test("the catalog's readers and gates never read ids through the maps", () => {
  // parseBaseline, readCatalogInputs, readKnownFailures, classifyCatalog, unusedKnownFailures, baselineGateProblems:
  // none of their files reaches legacyIds.ts, so none can map an id of the catalog snapshot.
  for (const file of [
    "src/baseline/build.ts",
    "src/baseline/catalog.ts",
    "src/report/catalog.ts",
    "src/compare/policyFile.ts",
  ]) {
    assert.doesNotMatch(readFileSync(join(ROOT, file), "utf8"), /legacyIds/, file);
  }
  // An MTF report of the catalog keeps its raw ids too.
  const catalog = parseBaseline(readFileSync(join(ROOT, "baselines", "catalog.mtf.json"), "utf8"));
  assert.ok("baseline" in catalog);
  const renamed: LegacyMaps = { checks: { r4: "geometric-mtf" }, engines: { ref: "aaa" } };
  assert.deepEqual(
    renderMtfBaselineReport(catalog.baseline, undefined, renamed),
    renderMtfBaselineReport(catalog.baseline),
  );
});

test("an MTF baseline of today's run is rendered under the new ids", async (t) => {
  const runsDir = await pairRun(t);
  const directory = join(runsDir, "fake-pair");
  const baseline = buildBaseline(readRunManifest(directory), readComparisonFile(directory), loadPolicy(), {
    ...MTF_BASELINE,
    rungs: ["selftest"],
  });
  const maps: LegacyMaps = { checks: {}, engines: { "fake-near": "aaa" } };
  const rendered = renderMtfBaselineReport(baseline, undefined, maps);
  assert.notDeepEqual(rendered, renderMtfBaselineReport(baseline));
  assert.match(rendered.markdown, /\baaa\b/);
  assert.doesNotMatch(rendered.json, /fake-near/);
  // The report names the hash of the baseline as its file holds it, not of the renamed copy.
  assert.equal(JSON.parse(rendered.json).baseline, JSON.parse(renderMtfBaselineReport(baseline).json).baseline);
});

// ── The catalog snapshot's id space ──────────────────────────────────────────────────────────────────────────────

test("the maps turn round only as bijections whose new ids are no old ids", () => {
  const maps: LegacyMaps = { checks: { r2: "ray-trace" }, engines: { ref: "aaa", flux: "zz-flux" } };
  assert.deepEqual(inverseMaps(maps), { checks: { "ray-trace": "r2" }, engines: { aaa: "ref", "zz-flux": "flux" } });
  assert.equal(legacyCheckId("ray-trace", maps), "r2");
  assert.equal(legacyEngineId("aaa", maps), "ref");
  assert.equal(legacyEngineId("lv", maps), "lv");
  assert.deepEqual(inverseMaps(), { checks: {}, engines: {} });
  assert.throws(() => inverseMaps({ checks: {}, engines: { ref: "x", flux: "x" } }), /both renamed x/);
  assert.throws(() => inverseMaps({ checks: { r2: "r3", r3: "r4" }, engines: {} }), /itself an old id/);
  // There and back is the same baseline.
  const hand = handBaseline();
  assert.deepEqual(snapshotIds(currentIds(hand, maps), maps), hand);
});

/** A catalog baseline by hand at the snapshot's ids: two failing pairs of r2, one listed in the known failures. */
function catalogBaseline(): { baseline: Baseline; known: KnownFailure[] } {
  const metric = { name: "mask.mismatches", unit: "rays", value: 1, tolerance: 0 };
  const failing = (a: string, b: string) => ({
    a,
    b,
    verdict: "FAIL" as const,
    verdicts: [{ verdict: "FAIL" as const, count: 1 }],
    metrics: [metric],
  });
  const plain = {
    ...handBaseline("catalog"),
    runs: [
      {
        name: "run",
        caseId: "3".repeat(64),
        rungs: [
          {
            rung: "r2",
            quantity: "rays.trace",
            requests: 1,
            support: [
              { engine: "lv", status: "ok" },
              { engine: "optiland", status: "ok" },
              { engine: "ref", status: "ok" },
            ],
            pairs: [
              { a: "lv", b: "optiland", verdict: "PASS", verdicts: [{ verdict: "PASS", count: 1 }], metrics: [] },
              failing("lv", "ref"),
              failing("optiland", "ref"),
            ],
          },
        ],
      },
    ],
  } as unknown as Baseline;
  const listed = plain.runs[0].rungs[0].pairs[1];
  const known: KnownFailure[] = [
    {
      run: "run",
      rung: "r2",
      engines: ["lv", "ref"],
      metric: "mask.mismatches",
      class: "method",
      gotcha: "docs/gotchas.md#hand",
      reproducer: "node bin/lvrtc.mjs run suites/catalog-repro/run.json --rungs r2 --jobs 4",
      evidenceHash: failureEvidence(1, listed),
    },
  ];
  return { baseline: classifyCatalog(plain, known), known };
}

test("a catalog check holds today's run to the snapshot under the snapshot's ids: a listed FAIL stays OK", () => {
  const policy = loadPolicy();
  const { baseline: committed, known } = catalogBaseline();
  assert.equal(committed.runs[0].rungs[0].pairs[1].failures?.length, 1, "the listed FAIL is classified");
  assert.equal(committed.runs[0].rungs[0].pairs[2].failures, undefined, "the other is not");
  const maps: LegacyMaps = { checks: { r2: "ray-trace" }, engines: { ref: "aaa" } };
  // Today's run, as the renamed ids write it: unclassified, every list in the order of the new ids.
  const { failures: _listed, ...listedToday } = committed.runs[0].rungs[0].pairs[1];
  const today = currentIds(
    {
      ...committed,
      runs: [
        {
          ...committed.runs[0],
          rungs: [{ ...committed.runs[0].rungs[0], pairs: committed.runs[0].rungs[0].pairs.with(1, listedToday) }],
        },
      ],
    },
    maps,
  );
  assert.equal(today.runs[0].rungs[0].rung, "ray-trace");

  const { committed: held, fresh, records } = checkInIdSpace(committed, today, known, policy, maps);
  assert.equal(held, committed, "the snapshot is held as written");
  assert.equal(fresh.runs[0].rungs[0].rung, "r2", "today's run is read back under the snapshot's ids");
  const outcome = (a: string, b: string) => records.find((record) => record.a === a && record.b === b);
  assert.equal(outcome("lv", "ref")?.outcome, "OK");
  assert.equal(outcome("lv", "ref")?.knownFailure, true);
  assert.equal(outcome("lv", "optiland")?.outcome, "OK");
  assert.equal(outcome("optiland", "ref")?.outcome, "DRIFT", "an unlisted FAIL is still DRIFT");
  assert.equal(records.length, 3);

  // Under the new ids the snapshot's known failures would match nothing, and the listed FAIL would drift.
  const naive = checkBaseline(currentIds(committed, maps), classifyCatalog(today, known), policy);
  assert.equal(naive.find((record) => record.b === "lv" && record.a === "aaa")?.outcome, "DRIFT");

  // Any other suite is held under the ids of today.
  const other = { ...committed, suite: { ...committed.suite, name: "hand" } };
  const otherToday = { ...today, suite: { ...today.suite, name: "hand" } };
  const checked = checkInIdSpace(other, otherToday, [], policy, maps);
  assert.equal(checked.committed.runs[0].rungs[0].rung, "ray-trace");
  assert.equal(checked.fresh, otherToday);
});
