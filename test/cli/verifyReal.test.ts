// `npm run verify:real` without LensVisualizer or optiland: its command line, its plan and order, the refusals of the
// doctor's report, the rule of a clean check, and the whole of it on fake engines under a temporary root.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import packageJson from "../../package.json" with { type: "json" };
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../../src/cli/command.ts";
import type { DoctorReport } from "../../src/cli/commands/doctor.ts";
import {
  CLEAN_OUTCOMES,
  DEFAULT_VERIFY_JOBS,
  SNAPSHOT_SUITES,
  VERIFY_REAL_SUITES,
  checkArgs,
  doctorRefusals,
  forwardStopSignals,
  judgeCheck,
  mainVerifyReal,
  parseVerifyRealArgs,
  planChecks,
  spawnLvrtcRunner,
  verifyReal,
} from "../../src/cli/verifyReal.ts";
import type { CheckStep, LvrtcEnded, VerifyRealRunner } from "../../src/cli/verifyReal.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { caseFixture, tempDir } from "../core/support.ts";

const VERIFY_BIN = fileURLToPath(new URL("../../bin/verify-real.mjs", import.meta.url));
const LVRTC_BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));
/** This machine as the owner's: a 48 GB budget of 10 GiB and 14 cores. */
const OWNER_MACHINE = { budgetGiB: 10, cpus: 14 };

// ── Fixtures ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** The doctor's report of a machine on which the baselines can be checked; `change` edits a copy of it. */
function healthy(change: (report: Mutable) => void = () => {}): DoctorReport {
  const report: Mutable = {
    node: { version: "24.15.0", required: packageJson.engines.node, ok: true },
    config: {},
    lensVisualizer: {
      status: "present",
      path: "/checkouts/lv",
      git: { commit: "c".repeat(40), dirty: false },
      binding: { status: "loaded", engineFileCount: 175, engineClosureHash: "a".repeat(64) },
    },
    python: { command: "python3", version: "Python 3.13.1" },
    optiland: {
      python: "/checkouts/optiland/.venv/bin/python",
      interpreter: "present",
      interpreterVersion: "Python 3.12.7",
      version: "0.6.2",
      engine: {
        status: "available",
        fingerprint: "f".repeat(64),
        adapterRevision: "b".repeat(64),
        details: { commit: "e".repeat(40), dirty: false },
      },
    },
  };
  change(report);
  return report as unknown as DoctorReport;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Mutable = Record<string, any>;

/** The JSON `baseline check --json` prints, of records with these outcomes and verdicts. */
function checkSaid(
  records: { outcome: string; verdict?: string; knownFailure?: boolean }[],
  more: { errors?: string[]; failed?: boolean; suiteChanged?: boolean } = {},
): string {
  const counts = Object.fromEntries(
    ["OK", "REFRESHABLE", "MOVED", "DRIFT", "NEW", "GONE"].map((outcome) => [
      outcome,
      records.filter((record) => record.outcome === outcome).length,
    ]),
  );
  const failing = records.some(
    (record) => record.outcome === "DRIFT" || (record.verdict === "FAIL" && record.knownFailure !== true),
  );
  return JSON.stringify({
    records: records.map((record, index) => ({
      run: `run-${index}`,
      rung: "r2",
      a: "lv",
      b: "ref",
      stale: [],
      moved: [],
      ...record,
    })),
    counts,
    stale: { case: 0, engine: 0, policy: 0 },
    changes: [],
    errors: more.errors ?? [],
    failed: more.failed ?? (failing || (more.errors ?? []).length > 0),
    suiteChanged: more.suiteChanged ?? false,
    suite: "s",
  });
}

const STEP: CheckStep = {
  suite: "benchmark",
  kind: "rays",
  baseline: "b.json",
  rungs: ["r0"],
  jobs: 4,
  perJobGiB: 2.5,
};

function ended(stdout: string, code: number | null = 0, signal: string | null = null): LvrtcEnded {
  return { code, signal, stdout };
}

/** A root with suite files and baselines of the rungs given, per suite and kind; nothing else. */
function plannedRoot(t: TestContext, baselines: Record<string, string[]>): string {
  const rootDir = tempDir(t);
  mkdirSync(join(rootDir, "suites"));
  mkdirSync(join(rootDir, "baselines"));
  for (const [file, rungs] of Object.entries(baselines)) {
    const suite = file.replace(/\.mtf$/, "");
    writeFileSync(join(rootDir, "suites", `${suite}.json`), "{}");
    const runs = [{ name: "a", rungs: rungs.map((rung) => ({ rung })) }];
    writeFileSync(join(rootDir, "baselines", `${file}.json`), JSON.stringify({ runs }));
  }
  return rootDir;
}

interface Scripted {
  readonly runner: VerifyRealRunner;
  /** Every command line asked, in order. */
  readonly asked: string[][];
  /** The most children that were running at once. */
  readonly most: () => number;
}

/** A runner that answers the doctor with `report` and each check from `answer`, one tick later. */
function scripted(report: DoctorReport | string, answer: (args: readonly string[]) => LvrtcEnded): Scripted {
  const asked: string[][] = [];
  let running = 0;
  let most = 0;
  return {
    asked,
    most: () => most,
    runner: {
      lvrtc: async (args) => {
        asked.push([...args]);
        running += 1;
        most = Math.max(most, running);
        await new Promise((resolveTick) => setImmediate(resolveTick));
        running -= 1;
        if (args[0] === "doctor") return ended(typeof report === "string" ? report : JSON.stringify(report));
        return answer(args);
      },
    },
  };
}

interface Said {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

async function verified(
  args: readonly string[],
  runner: VerifyRealRunner,
  more: { rootDir?: string; stopped?: () => string | null } = {},
): Promise<Said> {
  const out: string[] = [];
  const err: string[] = [];
  let clock = 0;
  const code = await verifyReal(args, {
    rootDir: more.rootDir ?? REPO_ROOT,
    cwd: REPO_ROOT,
    io: { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    runner,
    machine: OWNER_MACHINE,
    now: () => (clock += 60),
    ...(more.stopped === undefined ? {} : { stopped: more.stopped }),
  });
  return { code, out: out.join(""), err: err.join("") };
}

// ── The command line ─────────────────────────────────────────────────────────────────────────────────────────────

test("the command line: defaults, --all, --suites, --jobs, --root, and what is no synopsis", () => {
  assert.deepEqual(parseVerifyRealArgs([]), {
    help: false,
    suites: null,
    all: false,
    jobs: DEFAULT_VERIFY_JOBS,
    root: undefined,
  });
  assert.equal(DEFAULT_VERIFY_JOBS, 4);
  assert.equal(parseVerifyRealArgs(["--all"]).all, true);
  assert.deepEqual(parseVerifyRealArgs(["--suites", "folded,benchmark"]).suites, ["folded", "benchmark"]);
  assert.deepEqual(parseVerifyRealArgs(["--suite", "features"]).suites, ["features"]);
  assert.equal(parseVerifyRealArgs(["--jobs", "2"]).jobs, 2);
  assert.equal(parseVerifyRealArgs(["--root", "x"]).root, "x");
  assert.equal(parseVerifyRealArgs(["--all", "--help"]).help, true);
  for (const [args, message] of [
    [["--jobs", "0"], /--jobs must be a positive integer/],
    [["--jobs", "2.5"], /--jobs must be a positive integer/],
    [["--jobs"], /--jobs needs a value/],
    [["--jobs", "--all"], /--jobs needs a value/],
    [["--all", "--all"], /--all is given twice/],
    [["--all", "--suites", "benchmark"], /--all cannot be given with --suite or --suites/],
    [["--suite", "features", "--all"], /--all cannot be given with --suite or --suites/],
    [["--suite", "features", "--suites", "states"], /--suite and --suites cannot be given together/],
    [["--suite", "a,b"], /--suite: "a,b" is not a suite name/],
    [["--suite"], /--suite needs a value/],
    [["--suites", "a,,b"], /is not a suite name/],
    [["--suites", "../x"], /is not a suite name/],
    [["--suites", "a,a"], /names a suite twice/],
    [["--mtf"], /unknown argument "--mtf"/],
    [["benchmark"], /unknown argument "benchmark"/],
  ] as const) {
    assert.throws(
      () => parseVerifyRealArgs(args),
      (error: Error) => error instanceof UsageError && message.test(error.message),
    );
  }
});

test("package.json runs the script as npm run verify:real, outside npm run check", () => {
  assert.equal(packageJson.scripts["verify:real"], "node bin/verify-real.mjs");
  assert.doesNotMatch(packageJson.scripts.check, /verify:real/);
});

// ── The plan ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("the plan of this repository: the benchmark, rays then MTF, MTF at two jobs because of R6c", () => {
  const steps = planChecks(parseVerifyRealArgs([]), REPO_ROOT, OWNER_MACHINE);
  assert.deepEqual(
    steps.map((step) => [step.suite, step.kind, step.jobs]),
    [
      ["benchmark", "rays", 4],
      ["benchmark", "mtf", 2],
    ],
  );
  assert.ok(steps[1].rungs.includes("r6c"));
  assert.equal(steps[1].perJobGiB, 4);
  assert.deepEqual(checkArgs(steps[0], "/root"), [
    "baseline",
    "check",
    "benchmark",
    "--root",
    "/root",
    "--jobs",
    "4",
    "--json",
  ]);
  assert.deepEqual(checkArgs(steps[1], "/root"), [
    "baseline",
    "check",
    "benchmark",
    "--root",
    "/root",
    "--mtf",
    "--jobs",
    "2",
    "--json",
  ]);
});

test("--all plans every routine committed baseline of this repository, in the fixed order, one kind after the other", () => {
  const steps = planChecks(parseVerifyRealArgs(["--all", "--jobs", "3"]), REPO_ROOT, OWNER_MACHINE);
  assert.deepEqual(
    steps.map((step) => `${step.suite}:${step.kind}`),
    VERIFY_REAL_SUITES.flatMap(({ suite, kinds }) => kinds.map((kind) => `${suite}:${kind}`)),
  );
  assert.deepEqual(
    steps.map((step) => `${step.suite}:${step.kind}`),
    [
      "benchmark:rays",
      "benchmark:mtf",
      "features:rays",
      "features:mtf",
      "states:rays",
      "states:mtf",
      "focus-stations:rays",
      "focus-stations:mtf",
      "folded:rays",
      "diffractive:rays",
    ],
  );
  // The catalog's baselines are a dated snapshot: --all leaves them out.
  assert.ok(steps.every((step) => step.snapshot === undefined));
  // --jobs is the most a check is given; only the benchmark's MTF, which has R6c, is held to fewer.
  assert.deepEqual(
    steps.filter((step) => step.jobs !== 3).map((step) => [step.suite, step.kind, step.jobs]),
    [["benchmark", "mtf", 2]],
  );
});

test("the plan follows the memory budget and the cores, never more than --jobs", (t) => {
  const rootDir = plannedRoot(t, { a: ["r0", "r2"], "a.mtf": ["r4", "r6c"] });
  const plan = (jobs: string, machine: { budgetGiB: number; cpus: number }): number[] =>
    planChecks(parseVerifyRealArgs(["--suites", "a", "--jobs", jobs]), rootDir, machine).map((step) => step.jobs);
  assert.deepEqual(plan("4", OWNER_MACHINE), [4, 2]);
  assert.deepEqual(plan("1", OWNER_MACHINE), [1, 1]);
  assert.deepEqual(plan("8", { budgetGiB: 40, cpus: 14 }), [8, 8]);
  assert.deepEqual(plan("8", { budgetGiB: 40, cpus: 6 }), [6, 6]);
  assert.deepEqual(plan("4", { budgetGiB: 1, cpus: 14 }), [1, 1]);
});

test("another suite is checked for the kinds of baseline it has; one with none, or no suite file, is refused", (t) => {
  const rootDir = plannedRoot(t, { rays: ["r0"], both: ["r0"], "both.mtf": ["r4"], "solo.mtf": ["r4f"] });
  const kinds = (names: string): string[] =>
    planChecks(parseVerifyRealArgs(["--suites", names]), rootDir, OWNER_MACHINE).map((s) => `${s.suite}:${s.kind}`);
  assert.deepEqual(kinds("solo,both,rays"), ["solo:mtf", "both:rays", "both:mtf", "rays:rays"]);
  assert.throws(() => kinds("none"), /the suite none has no baseline: lvrtc baseline write none writes one/);
  // A committed suite's kinds are fixed: a root without its MTF baseline is refused before anything runs.
  assert.throws(
    () => planChecks(parseVerifyRealArgs([]), rootDir, OWNER_MACHINE),
    /suites\/benchmark\.json: no suite file is there/,
  );
  const partial = plannedRoot(t, { benchmark: ["r0"] });
  assert.throws(
    () => planChecks(parseVerifyRealArgs([]), partial, OWNER_MACHINE),
    /benchmark\.mtf\.json: the suite benchmark has no MTF baseline to check; lvrtc baseline write benchmark --mtf writes one/,
  );
  writeFileSync(join(partial, "baselines", "benchmark.json"), "{ not json");
  assert.throws(
    () => planChecks(parseVerifyRealArgs(["--suites", "benchmark"]), partial, OWNER_MACHINE),
    /benchmark\.json: not readable as a baseline/,
  );
});

test("the catalog, a dated snapshot, is checked only when named, and the plan says it is a snapshot", async () => {
  assert.deepEqual(SNAPSHOT_SUITES, [{ suite: "catalog", kinds: ["rays", "mtf"] }]);
  assert.ok(!VERIFY_REAL_SUITES.some(({ suite }) => suite === "catalog"));
  const steps = planChecks(parseVerifyRealArgs(["--suites", "folded,catalog"]), REPO_ROOT, OWNER_MACHINE);
  assert.deepEqual(
    steps.map((step) => [step.suite, step.kind, step.snapshot ?? false]),
    [
      ["folded", "rays", false],
      ["catalog", "rays", true],
      ["catalog", "mtf", true],
    ],
  );
  const allOk = (): LvrtcEnded => ended(checkSaid([{ outcome: "OK", verdict: "PASS" }]));
  const said = await verified(["--suite", "catalog"], scripted(healthy(), allOk).runner);
  assert.equal(said.code, EXIT_OK, said.err);
  assert.equal(
    said.out.match(
      /^ {4}catalog: a dated snapshot, not refreshed until the project's end: checked only when named, never by --all$/gm,
    )?.length,
    2,
  );
  const all = await verified(["--all"], scripted(healthy(), allOk).runner);
  assert.doesNotMatch(all.out, /catalog/);
});

// ── The doctor's report ──────────────────────────────────────────────────────────────────────────────────────────

test("a machine with a clean, loadable LensVisualizer and a usable optiland is not refused", () => {
  assert.deepEqual(doctorRefusals(healthy()), []);
  // optiland's own checkout being dirty moves its fingerprint, which the check reports as STALE(engine).
  assert.deepEqual(doctorRefusals(healthy((r) => (r.optiland.engine.details.dirty = true))), []);
});

test("the doctor's refusals: LensVisualizer dirty, outside git, missing, unconfigured or unloadable; optiland unusable", () => {
  const refused = (change: (report: Mutable) => void): string[] => doctorRefusals(healthy(change));
  assert.deepEqual(
    refused((r) => (r.lensVisualizer.git.dirty = true)),
    [
      `LensVisualizer at /checkouts/lv has uncommitted changes (at ${"c".repeat(40)}): a real-engine check is of a committed LensVisualizer; commit or set aside the changes in LensVisualizer first`,
    ],
  );
  assert.match(refused((r) => (r.lensVisualizer.git = null)).join(), /is not a git checkout: no commit can be named/);
  assert.deepEqual(
    refused((r) => (r.lensVisualizer = { status: "missing", path: "/nowhere", git: null, binding: null })),
    ["LensVisualizer is not at /nowhere: no LensVisualizer checkout is there"],
  );
  assert.match(
    refused((r) => (r.lensVisualizer = { status: "not configured", path: null, git: null, binding: null })).join(),
    /LensVisualizer is not configured: set LVRTC_LV_PATH/,
  );
  assert.match(
    refused(
      (r) => (r.lensVisualizer.binding = { status: "failed", code: "import-failed", message: "no buildLens" }),
    ).join(),
    /cannot be loaded through the binding \(import-failed: no buildLens\)/,
  );
  assert.match(
    refused(
      (r) =>
        (r.optiland = {
          python: null,
          interpreter: "not configured",
          interpreterVersion: null,
          version: null,
          engine: null,
        }),
    ).join(),
    /optiland is not configured: set LVRTC_OPTILAND_PYTHON/,
  );
  assert.deepEqual(
    refused(
      (r) =>
        (r.optiland = { python: "/py", interpreter: "missing", interpreterVersion: null, version: null, engine: null }),
    ),
    ["optiland's interpreter /py does not run"],
  );
  assert.deepEqual(
    refused((r) => (r.optiland.engine = { status: "unavailable", code: "hello-failed", message: "no numba" })),
    ["the engine optiland cannot be used (hello-failed: no numba)"],
  );
  assert.match(refused((r) => (r.node.ok = false)).join(), /^Node 24\.15\.0 is outside the supported range/);
  // Every refusal is said, not only the first.
  assert.equal(
    refused((r) => {
      r.lensVisualizer.git.dirty = true;
      r.optiland.engine = { status: "unavailable", code: "spawn-failed", message: "x" };
    }).length,
    2,
  );
});

// ── The rule of a clean check ────────────────────────────────────────────────────────────────────────────────────

test("a check is clean when every record is OK, REFRESHABLE or MOVED, and a listed FAIL is admitted", () => {
  assert.deepEqual(CLEAN_OUTCOMES, ["OK", "REFRESHABLE", "MOVED"]);
  const clean = judgeCheck(
    STEP,
    ended(
      checkSaid([
        { outcome: "OK", verdict: "PASS" },
        { outcome: "REFRESHABLE", verdict: "PASS" },
      ]),
    ),
  );
  assert.equal(clean.status, "clean");
  assert.deepEqual(clean.problems, []);
  assert.equal(clean.records, 2);

  const moved = judgeCheck(STEP, ended(checkSaid([{ outcome: "MOVED", verdict: "ATTENTION" }])));
  assert.equal(moved.status, "clean");
  assert.deepEqual(moved.notes, ["1 MOVED, of a recorded rung: fails nothing"]);

  const listed = judgeCheck(STEP, ended(checkSaid([{ outcome: "OK", verdict: "FAIL", knownFailure: true }])));
  assert.equal(listed.status, "clean");
  assert.equal(listed.listedFails, 1);
});

test("DRIFT, an unlisted FAIL or ERROR, NEW, GONE, an engine error and an empty check are not clean", () => {
  const problems = (stdout: string, code = 1): readonly string[] => {
    const outcome = judgeCheck(STEP, ended(stdout, code));
    assert.equal(outcome.status, "not clean");
    return outcome.problems;
  };
  assert.deepEqual(
    problems(
      checkSaid([
        { outcome: "DRIFT", verdict: "FAIL" },
        { outcome: "OK", verdict: "PASS" },
      ]),
    ),
    ["1 DRIFT", "1 pair FAIL or ERROR today and not listed"],
  );
  assert.deepEqual(problems(checkSaid([{ outcome: "OK", verdict: "ERROR" }])), [
    "1 pair FAIL or ERROR today and not listed",
  ]);
  // `baseline check` exits 0 on NEW and GONE; a real-engine check of another suite than the baseline's is not clean.
  assert.deepEqual(problems(checkSaid([{ outcome: "NEW", verdict: "PASS" }, { outcome: "GONE" }]), 0), [
    "1 NEW: the suite is not the baseline's",
    "1 GONE: the suite is not the baseline's",
  ]);
  assert.deepEqual(
    problems(
      checkSaid([{ outcome: "OK", verdict: "PASS" }], { errors: ["engine optiland could not be used (spawn-failed)"] }),
    ),
    ["engine optiland could not be used (spawn-failed)"],
  );
  assert.deepEqual(problems(checkSaid([]), 0), ["no record was checked"]);
  assert.deepEqual(problems(checkSaid([{ outcome: "STALE", verdict: "PASS" }]), 0), [
    "1 records neither OK, REFRESHABLE nor MOVED",
  ]);
  assert.deepEqual(problems(checkSaid([{ outcome: "OK", verdict: "PASS" }], { failed: true })), [
    "baseline check exited 1",
  ]);
  assert.match(problems("", 2).join(), /baseline check exited 2 without a report: nothing was checked/);
  assert.match(problems("not json", 1).join(), /exited 1 without a report/);
  const unstarted = judgeCheck(STEP, { code: null, signal: null, stdout: "", error: "spawn ENOENT" });
  assert.deepEqual(unstarted.problems, ["baseline check could not be started: spawn ENOENT"]);
});

test("a check ended by a signal is interrupted", () => {
  const outcome = judgeCheck(STEP, ended(checkSaid([{ outcome: "OK", verdict: "PASS" }]), null, "SIGTERM"));
  assert.equal(outcome.status, "interrupted");
  assert.deepEqual(outcome.problems, ["baseline check was ended by SIGTERM"]);
});

// ── The whole, on a scripted runner ──────────────────────────────────────────────────────────────────────────────

const ALL_OK = (): LvrtcEnded => ended(checkSaid([{ outcome: "OK", verdict: "PASS" }]));

test("verify:real asks the doctor first, then each check alone and in order, and exits 0 when all are clean", async () => {
  const run = scripted(healthy(), ALL_OK);
  const said = await verified([], run.runner);
  assert.equal(said.code, EXIT_OK, said.err + said.out);
  assert.deepEqual(run.asked, [
    ["doctor", "--root", REPO_ROOT, "--json"],
    ["baseline", "check", "benchmark", "--root", REPO_ROOT, "--jobs", "4", "--json"],
    ["baseline", "check", "benchmark", "--root", REPO_ROOT, "--mtf", "--jobs", "2", "--json"],
  ]);
  assert.equal(run.most(), 1);
  assert.match(
    said.out,
    /^verify:real: LensVisualizer c{40} \(clean\) at \/checkouts\/lv, engine closure a{64} \(175 files\)$/m,
  );
  assert.match(said.out, /^verify:real: optiland 0\.6\.2, fingerprint f{64}, checkout e{40} \(clean\)$/m);
  assert.match(
    said.out,
    /^benchmark rays {2}CLEAN {2}1 records: 1 OK, 0 REFRESHABLE, 0 MOVED, 0 DRIFT, 0 NEW, 0 GONE; stale by case 0, engine 0, policy 0; --jobs 4; 60 s$/m,
  );
  assert.match(said.out, /^benchmark mtf {3}CLEAN {2}.*; --jobs 2; 60 s$/m);
  assert.match(said.out, /^verify:real: clean: every record of 2 checks is OK, REFRESHABLE or MOVED$/m);
  assert.equal(said.err, "");
});

test("--suite runs one named suite alone, rays then MTF", async () => {
  const run = scripted(healthy(), ALL_OK);
  const said = await verified(["--suite", "features"], run.runner);
  assert.equal(said.code, EXIT_OK, said.err);
  assert.deepEqual(run.asked.slice(1), [
    ["baseline", "check", "features", "--root", REPO_ROOT, "--jobs", "4", "--json"],
    ["baseline", "check", "features", "--root", REPO_ROOT, "--mtf", "--jobs", "4", "--json"],
  ]);
  assert.match(said.out, /^verify:real: clean: every record of 2 checks is OK, REFRESHABLE or MOVED$/m);
});

test("--all runs the ten routine checks one at a time, in the plan's order", async () => {
  const run = scripted(healthy(), ALL_OK);
  const said = await verified(["--all"], run.runner);
  assert.equal(said.code, EXIT_OK, said.err);
  assert.equal(run.most(), 1);
  assert.equal(run.asked.length, 11);
  assert.deepEqual(
    run.asked.slice(1).map((args) => `${args[2]}:${args.includes("--mtf") ? "mtf" : "rays"}`),
    VERIFY_REAL_SUITES.flatMap(({ suite, kinds }) => kinds.map((kind) => `${suite}:${kind}`)),
  );
});

test("a refusal of the doctor's report runs no check and exits 2", async () => {
  for (const report of [
    healthy((r) => (r.lensVisualizer.git.dirty = true)),
    healthy((r) => (r.optiland.engine = null)),
    "not json",
  ]) {
    const run = scripted(report, ALL_OK);
    const said = await verified([], run.runner);
    assert.equal(said.code, EXIT_USAGE);
    assert.deepEqual(
      run.asked.map((args) => args[0]),
      ["doctor"],
    );
    assert.match(said.err, /^verify:real: refused: /m);
    assert.match(said.err, /^verify:real: nothing was checked; lvrtc doctor shows the machine as it is$/m);
  }
});

test("a usage error, a missing suite or baseline, runs nothing, the doctor included, and exits 2", async (t) => {
  const run = scripted(healthy(), ALL_OK);
  assert.equal((await verified(["--jobs", "x"], run.runner)).code, EXIT_USAGE);
  assert.equal((await verified(["--suites", "absent"], run.runner)).code, EXIT_USAGE);
  const said = await verified(["--root", join(tempDir(t), "nowhere")], run.runner);
  assert.equal(said.code, EXIT_USAGE);
  assert.match(said.err, /^verify:real: --root .*nowhere: not a directory$/m);
  assert.deepEqual(run.asked, []);
  const help = await verified(["--help"], run.runner);
  assert.equal(help.code, EXIT_OK);
  assert.match(help.out, /^Usage: npm run verify:real -- /);
});

test("a check that is not clean fails the whole, and the checks after it still run", async () => {
  const run = scripted(healthy(), (args) =>
    args.includes("--mtf") ? ALL_OK() : ended(checkSaid([{ outcome: "DRIFT", verdict: "FAIL" }]), 1),
  );
  const said = await verified([], run.runner);
  assert.equal(said.code, EXIT_FAILURE);
  assert.equal(run.asked.length, 3);
  assert.match(
    said.out,
    /^benchmark rays {2}NOT CLEAN {2}.*\n {4}1 DRIFT; 1 pair FAIL or ERROR today and not listed$/m,
  );
  assert.match(said.out, /^verify:real: not clean: benchmark rays$/m);
});

test("an interrupted check stops the sequence; the rest are NOT RUN", async () => {
  const run = scripted(healthy(), () => ended("", null, "SIGTERM"));
  const said = await verified(["--suites", "features,states"], run.runner);
  assert.equal(said.code, EXIT_FAILURE);
  assert.equal(run.asked.length, 2);
  assert.match(said.out, /^features rays {2}INTERRUPTED {2}--jobs 4; 60 s\n {4}baseline check was ended by SIGTERM$/m);
  assert.match(said.out, /^features mtf {3}NOT RUN$/m);
  assert.match(said.out, /^states mtf {3}NOT RUN$/m);
  assert.match(
    said.out,
    /if the memory watchdog ended it, run again with fewer --jobs; the remaining checks were not run$/m,
  );
});

test("a stop asked of verify:real starts no further check", async () => {
  let signal: string | null = null;
  const run = scripted(healthy(), () => {
    signal = "SIGINT";
    return ALL_OK();
  });
  const said = await verified([], run.runner, { stopped: () => signal });
  assert.equal(said.code, EXIT_FAILURE);
  assert.equal(run.asked.length, 2);
  assert.match(said.out, /^verify:real: stopped by SIGINT; the remaining checks were not run$/m);
  assert.match(said.out, /^benchmark mtf {3}NOT RUN$/m);
});

test("SIGINT, like SIGTERM, is handed on at once to the check that is running, which ends it; nothing runs after", async () => {
  for (const name of ["SIGINT", "SIGTERM"] as const) {
    const source = new EventEmitter();
    let pending: ((ended: LvrtcEnded) => void) | null = null;
    const handed: string[] = [];
    const signals = forwardStopSignals((signal) => {
      handed.push(signal);
      pending?.(ended("", null, signal));
    }, source);
    assert.equal(source.listenerCount("SIGINT"), 1);
    assert.equal(source.listenerCount("SIGTERM"), 1);
    const asked: string[][] = [];
    const runner: VerifyRealRunner = {
      lvrtc: (args) => {
        asked.push([...args]);
        if (args[0] === "doctor") return Promise.resolve(ended(JSON.stringify(healthy())));
        // The check runs until a signal ends it; the signal arrives once it has started.
        return new Promise((resolveEnded) => {
          pending = resolveEnded;
          setImmediate(() => source.emit(name, name));
        });
      },
    };
    const said = await verified([], runner, { stopped: signals.stopped });
    signals.dispose();
    assert.deepEqual(handed, [name]);
    assert.equal(asked.length, 2, "the doctor and the first check; nothing after the signal");
    assert.equal(said.code, EXIT_FAILURE);
    assert.match(
      said.out,
      new RegExp(`^benchmark rays {2}INTERRUPTED .*\\n {4}baseline check was ended by ${name}$`, "m"),
    );
    assert.match(said.out, /^benchmark mtf {3}NOT RUN$/m);
    assert.equal(signals.stopped(), name);
    assert.equal(source.listenerCount("SIGINT") + source.listenerCount("SIGTERM"), 0);
  }
});

test("mainVerifyReal listens on the signal source it is given and stops listening when it ends", async () => {
  const source = new EventEmitter();
  const write = process.stdout.write;
  process.stdout.write = (() => true) as typeof process.stdout.write;
  try {
    assert.equal(await mainVerifyReal(["--help"], source), EXIT_OK);
  } finally {
    process.stdout.write = write;
  }
  assert.equal(source.listenerCount("SIGINT") + source.listenerCount("SIGTERM"), 0);
});

// ── The whole, on fake engines under a temporary root ────────────────────────────────────────────────────────────

type EngineOptions = Readonly<Record<string, unknown>>;
const PAIR: Readonly<Record<string, EngineOptions>> = { "fake-a": {}, "fake-near": { bias: 2e-14 } };

function writeConfig(rootDir: string, options: Readonly<Record<string, EngineOptions>>): void {
  const engines = Object.fromEntries(
    Object.entries(options).map(([id, more]) => [
      id,
      { transport: "in-process", module: FAKE_ENGINE, options: { id, ...more } },
    ]),
  );
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ engines }));
}

/** Every file under a directory and its bytes, by relative path. */
function snapshot(directory: string, prefix = ""): Record<string, string> {
  const files: Record<string, string> = {};
  for (const name of readdirSync(directory).sort()) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) Object.assign(files, snapshot(path, `${prefix}${name}/`));
    else files[`${prefix}${name}`] = readFileSync(path, "utf8");
  }
  return files;
}

test("on fake engines: a clean check exits 0, a drifted engine exits 1, and baselines/ and reports/ stay as they were", async (t) => {
  const rootDir = tempDir(t);
  mkdirSync(join(rootDir, "cases"));
  mkdirSync(join(rootDir, "suites"));
  for (const name of ["singlet", "double-gauss"]) cpSync(caseFixture(name), join(rootDir, "cases", `${name}.json`));
  writeConfig(rootDir, PAIR);
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "pair",
    defaults: { rungs: ["selftest"] },
    runs: ["singlet", "double-gauss"].map((name) => ({ name, lens: { kind: "fixture", path: `cases/${name}.json` } })),
  };
  writeFileSync(join(rootDir, "suites", "pair.json"), JSON.stringify(suite));
  const env = { ...process.env, LVRTC_RUNS_DIR: join(rootDir, "runs") };
  for (const args of [
    ["run", join(rootDir, "suites", "pair.json"), "--root", rootDir],
    ["compare", "pair", "--root", rootDir],
    ["baseline", "write", "pair", "--root", rootDir],
  ]) {
    const child = spawnSync(process.execPath, [LVRTC_BIN, ...args], { cwd: rootDir, env, encoding: "utf8" });
    assert.equal(child.status, EXIT_OK, `${args.join(" ")}: ${child.stderr}${child.stdout}`);
  }
  const before = { baselines: snapshot(join(rootDir, "baselines")), reports: snapshot(join(rootDir, "reports")) };

  const stderr: string[] = [];
  const children = spawnLvrtcRunner({ cwd: rootDir, env, stderr: (text) => void stderr.push(text) });
  // The doctor of this root would look for LensVisualizer and optiland: it is answered as a machine that has both.
  const runner: VerifyRealRunner = {
    lvrtc: async (args) => (args[0] === "doctor" ? ended(JSON.stringify(healthy())) : children.lvrtc(args)),
  };

  const clean = await verified(["--suites", "pair", "--root", rootDir], runner);
  assert.equal(clean.code, EXIT_OK, clean.out + clean.err + stderr.join(""));
  assert.match(clean.out, /^pair rays {2}CLEAN {2}2 records: 2 OK, 0 REFRESHABLE, 0 MOVED, 0 DRIFT, 0 NEW, 0 GONE; /m);

  // Another build of an engine, 5e-12 off: the pair fails where it passed, and the baseline says DRIFT.
  writeConfig(rootDir, { ...PAIR, "fake-near": { bias: 5e-12 } });
  const drifted = await verified(["--suites", "pair", "--root", rootDir], runner);
  assert.equal(drifted.code, EXIT_FAILURE);
  assert.match(
    drifted.out,
    /^pair rays {2}NOT CLEAN {2}2 records: 0 OK, 0 REFRESHABLE, 0 MOVED, 2 DRIFT, .*stale by case 0, engine 2, policy 0; /m,
  );
  assert.match(drifted.out, /^ {4}2 DRIFT; 2 pairs FAIL or ERROR today and not listed$/m);

  assert.deepEqual(
    { baselines: snapshot(join(rootDir, "baselines")), reports: snapshot(join(rootDir, "reports")) },
    before,
  );
});

test("bin/verify-real.mjs refuses, before any check, a machine where LensVisualizer and optiland point nowhere", () => {
  const env = {
    ...process.env,
    LVRTC_LV_PATH: "/nonexistent/lv",
    LVRTC_OPTILAND_PYTHON: "/nonexistent/python",
  };
  const child = spawnSync(process.execPath, [VERIFY_BIN], { cwd: REPO_ROOT, env, encoding: "utf8" });
  assert.equal(child.status, EXIT_USAGE, child.stderr + child.stdout);
  assert.match(child.stdout, /^ {2}benchmark rays {2}rungs r0,r1,r2,r3,r4 {2}--jobs \d+ \(2\.5 GiB a job\)$/m);
  assert.match(child.stderr, /^verify:real: refused: LensVisualizer is not at \/nonexistent\/lv: /m);
  assert.match(child.stderr, /^verify:real: refused: optiland's interpreter \/nonexistent\/python does not run$/m);
  assert.doesNotMatch(child.stdout, /checking/);
});
