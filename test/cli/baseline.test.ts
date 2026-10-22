// `lvrtc baseline write`, `lvrtc baseline check` and `lvrtc verify` on fake engines: the round trip, every state a
// record can come to, the exit codes, and what `verify` refuses. Everything is written under a temporary root.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import { createBaselineCommand } from "../../src/cli/commands/baseline.ts";
import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { caseFixture, tempDir } from "../core/support.ts";
import { FAKE_LV } from "../engines/lv/support.ts";
import { FAKE_OPTILAND_MISSING, fakeOptilandRoot } from "../engines/optiland/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));

interface Ended {
  readonly code: number | null;
  readonly out: string;
  readonly err: string;
}

type EngineOptions = Readonly<Record<string, unknown>>;

/** The engines of a root as its configuration defines them: the fake engine, in process, once per id. */
function enginesOf(options: Readonly<Record<string, EngineOptions>>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(options).map(([id, more]) => [
      id,
      { transport: "in-process", module: FAKE_ENGINE, options: { id, ...more } },
    ]),
  );
}

const PAIR: Readonly<Record<string, EngineOptions>> = { "fake-a": {}, "fake-near": { bias: 2e-14 } };

function writeConfig(rootDir: string, options: Readonly<Record<string, EngineOptions>>): void {
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ engines: enginesOf(options) }));
}

function writeSuite(rootDir: string, runs: readonly string[] = ["singlet", "double-gauss"]): void {
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "pair",
    defaults: { rungs: ["selftest"] },
    runs: runs.map((name) => ({ name, lens: { kind: "fixture", path: `cases/${name}.json` } })),
  };
  mkdirSync(join(rootDir, "suites"), { recursive: true });
  writeFileSync(join(rootDir, "suites", "pair.json"), JSON.stringify(suite));
}

/** A root with two fake engines that agree, the suite `pair` of two case files, and nothing run. */
function pairRoot(t: TestContext, name: string = "root"): string {
  const rootDir = join(tempDir(t), name);
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  for (const each of ["singlet", "double-gauss"]) cpSync(caseFixture(each), join(rootDir, "cases", `${each}.json`));
  writeConfig(rootDir, PAIR);
  writeSuite(rootDir);
  return rootDir;
}

/** Runs a command in this process on a root, with the runs directory inside the root unless another is named. */
async function lvrtc(
  rootDir: string,
  args: readonly string[],
  more: { runs?: string; policy?: Policy } = {},
): Promise<Ended> {
  const inputs = {
    rootDir,
    cwd: rootDir,
    env: { LVRTC_RUNS_DIR: join(rootDir, more.runs ?? "runs") },
    policy: more.policy,
  };
  const commands = [
    createRunCommand(inputs),
    createCompareCommand(inputs),
    createBaselineCommand(inputs),
    createVerifyCommand(inputs),
  ];
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(args, io, commands);
  return { code, out: out.join(""), err: err.join("") };
}

/** Runs, compares and writes the baseline of the suite `pair` of a root. */
async function written(rootDir: string): Promise<void> {
  for (const args of [
    ["run", "suites/pair.json"],
    ["compare", "pair"],
    ["baseline", "write", "pair"],
  ]) {
    const ended = await lvrtc(rootDir, args);
    assert.equal(ended.code, EXIT_OK, `${args.join(" ")}: ${ended.err}${ended.out}`);
  }
}

function filesOf(rootDir: string): { baseline: string; markdown: string; json: string } {
  return {
    baseline: readFileSync(join(rootDir, "baselines", "pair.json"), "utf8"),
    markdown: readFileSync(join(rootDir, "reports", "pair", "rays.md"), "utf8"),
    json: readFileSync(join(rootDir, "reports", "pair", "rays.json"), "utf8"),
  };
}

interface CheckJson {
  readonly records: readonly {
    run: string;
    rung: string;
    a: string;
    b: string;
    stale: string[];
    outcome: string;
    moved: string[];
  }[];
  readonly counts: Record<string, number>;
  readonly stale: Record<string, number>;
  readonly failed: boolean;
}

async function checked(rootDir: string, more: { runs?: string } = {}): Promise<{ ended: Ended; said: CheckJson }> {
  const ended = await lvrtc(rootDir, ["baseline", "check", "pair", "--json"], more);
  assert.notEqual(ended.code, EXIT_USAGE, ended.err);
  return { ended, said: JSON.parse(ended.out) };
}

// ── The round trip ───────────────────────────────────────────────────────────────────────────────────────────────

test("baseline and verify are registered commands, with help", async () => {
  for (const name of ["baseline", "verify"]) assert.ok(COMMANDS.some((command) => command.name === name));
  const help = await lvrtc(REPO_ROOT, ["baseline", "--help"]);
  assert.equal(help.code, EXIT_OK);
  assert.match(
    help.out,
    /^Usage: lvrtc baseline write <suite name \| run directory> \[--root <dir>\] \[--mtf\] \[--replace\]$/m,
  );
  assert.match(help.out, /^Exit code: write: 0 when /m);
  const verify = await lvrtc(REPO_ROOT, ["verify", "--help"]);
  assert.match(verify.out, /^Usage: lvrtc verify \[--root <dir>\] \[--write\]$/m);
  assert.match(verify.out, /It cannot see a case or an engine that has changed/);
});

test("write, then verify: the baseline is valid, canonical and keyed on run name and case hash; verify exits 0", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  const { baseline: text, markdown, json } = filesOf(rootDir);
  const read = parseBaseline(text);
  assert.ok("baseline" in read, JSON.stringify(read));
  const { baseline } = read;
  assert.equal(baselineText(baseline), text);
  assert.deepEqual([baseline.kind, baseline.suite.name], ["baseline", "pair"]);
  assert.deepEqual(
    baseline.engines.map((engine) => engine.id),
    ["fake-a", "fake-near"],
  );
  const cases = ["singlet", "double-gauss"].map((name) => JSON.parse(readFileSync(caseFixture(name), "utf8")).id);
  assert.deepEqual(
    baseline.runs.map((run) => [run.name, run.caseId]),
    [
      ["singlet", cases[0]],
      ["double-gauss", cases[1]],
    ],
  );
  const policy = loadPolicy();
  assert.equal(baseline.policy.version, policy.version);
  const [rung] = baseline.runs[0].rungs;
  assert.deepEqual([rung.rung, rung.quantity, rung.requests], ["selftest", "selftest.echo", 1]);
  assert.deepEqual(rung.support, [
    { engine: "fake-a", status: "ok" },
    { engine: "fake-near", status: "ok" },
  ]);
  const [pair] = rung.pairs;
  assert.deepEqual(
    [pair.a, pair.b, pair.verdict, pair.verdicts],
    ["fake-a", "fake-near", "PASS", [{ verdict: "PASS", count: 1 }]],
  );
  const worst = pair.metrics.find((metric) => metric.name === "values.maxAbs");
  assert.ok(worst !== undefined && worst.value !== null && worst.value > 0 && worst.value < 1e-12);
  assert.equal(worst.tolerance, 1e-12);

  // Numbers, hashes, counts and names: no array, no path of this machine, no time.
  for (const file of [text, markdown, json]) {
    for (const absent of ["$nd", rootDir, REPO_ROOT, "/Users/", "/home/", "\r", "T00:"])
      assert.ok(!file.includes(absent), absent);
  }
  assert.match(markdown, /^# Baseline of pair$/m);
  assert.match(markdown, /^\| selftest \| selftest\.echo \| 2 \| 2 \| fake-a – fake-near \| 2 PASS \| 2 PASS \|$/m);
  assert.match(markdown, /^\| singlet \| 1 \| PASS: (sum\.abs|values\.maxAbs) \d\.\d\de-1\d \|$/m);
  assert.equal(JSON.parse(json).kind, "baseline-report");

  const verified = await lvrtc(rootDir, ["verify"]);
  assert.equal(verified.code, EXIT_OK, verified.err);
  assert.match(
    verified.out,
    /^baselines\/pair\.json: a baseline of 2 runs and 2 records, policy v\d+; reports\/pair\/rays\.md and rays\.json are what it renders$/m,
  );
  assert.match(verified.out, /^verify: 1 baseline, 0 problems\. No engine was read: .*STALE.*lvrtc baseline check/m);
});

test("the same suite gives the same three files in another directory and in another process", async (t) => {
  const first = pairRoot(t, "first");
  await written(first);
  const second = pairRoot(t, "elsewhere");
  for (const args of [
    ["run", "suites/pair.json"],
    ["compare", "pair"],
    ["baseline", "write", "pair"],
  ]) {
    const child = spawnSync(process.execPath, [BIN, ...args, "--root", second], {
      encoding: "utf8",
      cwd: second,
      env: { ...process.env, LVRTC_RUNS_DIR: join(second, "runs") },
    });
    assert.equal(child.status, EXIT_OK, child.stderr);
  }
  assert.deepEqual(filesOf(second), filesOf(first));
  // And the committed reports can be made anew from the baseline alone.
  rmSync(join(second, "reports"), { recursive: true });
  rmSync(join(second, "runs"), { recursive: true });
  assert.equal((await lvrtc(second, ["verify"])).code, EXIT_FAILURE);
  assert.equal((await lvrtc(second, ["verify", "--write"])).code, EXIT_OK);
  assert.deepEqual(filesOf(second), filesOf(first));
});

// ── The states of a check ────────────────────────────────────────────────────────────────────────────────────────

test("check: nothing changed is OK for every record, and exits 0", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  const lines = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.equal(lines.code, EXIT_OK, lines.err);
  assert.match(
    lines.out,
    /^pair: 2 records: 2 OK, 0 REFRESHABLE, 0 MOVED, 0 DRIFT, 0 NEW, 0 GONE; stale by case 0, by engine 0, by policy 0$/m,
  );
  assert.match(lines.out, /^OK: the baseline is of the cases, engines and policy at hand\. Nothing to do\.$/m);
  // The same with an empty store: every answer is computed again, and is what it was.
  const { ended, said } = await checked(rootDir, { runs: "other-runs" });
  assert.equal(ended.code, EXIT_OK);
  assert.deepEqual(said.counts, { OK: 2, REFRESHABLE: 0, MOVED: 0, DRIFT: 0, NEW: 0, GONE: 0 });
  // By the suite file too.
  assert.equal((await lvrtc(rootDir, ["baseline", "check", "suites/pair.json"])).code, EXIT_OK);
});

test("check: an engine with another fingerprint is STALE(engine); what still holds is REFRESHABLE and exits 0", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  writeConfig(rootDir, { ...PAIR, "fake-near": { bias: 2e-14, fingerprint: "another build of fake-near" } });
  const { ended, said } = await checked(rootDir);
  assert.equal(ended.code, EXIT_OK);
  assert.deepEqual(said.counts, { OK: 0, REFRESHABLE: 2, MOVED: 0, DRIFT: 0, NEW: 0, GONE: 0 });
  assert.deepEqual(said.stale, { case: 0, engine: 2, policy: 0 });
  assert.ok(said.records.every((record) => record.stale.join() === "engine"));
  const lines = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.match(lines.out, /^singlet +selftest +fake-a +fake-near +STALE\(engine\) REFRESHABLE +PASS$/m);
  assert.match(lines.out, /^REFRESHABLE: .* lvrtc baseline write pair, then commit baselines\/ and reports\/\.$/m);
  // Writing it anew records the engine as it is: the next check is OK.
  assert.equal((await lvrtc(rootDir, ["baseline", "write", "pair"])).code, EXIT_OK);
  assert.deepEqual((await checked(rootDir)).said.counts, {
    OK: 2,
    REFRESHABLE: 0,
    MOVED: 0,
    DRIFT: 0,
    NEW: 0,
    GONE: 0,
  });
  assert.equal((await lvrtc(rootDir, ["verify"])).code, EXIT_OK);
});

test("check: a run whose case is another is STALE(case), the others stay OK", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  // The run "singlet" is now of another system: a valid case with another content hash.
  cpSync(caseFixture("double-gauss"), join(rootDir, "cases", "singlet.json"));
  const { ended, said } = await checked(rootDir);
  assert.equal(ended.code, EXIT_OK);
  assert.deepEqual(
    said.records.map((record) => [record.run, record.stale.join(), record.outcome]),
    [
      ["singlet", "case", "REFRESHABLE"],
      ["double-gauss", "", "OK"],
    ],
  );
  const lines = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.match(lines.out, /^singlet +selftest +fake-a +fake-near +STALE\(case\) REFRESHABLE +PASS$/m);
  assert.doesNotMatch(lines.out, /^double-gauss /m);
});

test("check: an engine whose answers moved past the tolerance is DRIFT, stale or not, and exits 1", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  // Another build of the engine, 5e-12 off: the pair fails where it passed.
  writeConfig(rootDir, { ...PAIR, "fake-near": { bias: 5e-12 } });
  const stale = await checked(rootDir);
  assert.equal(stale.ended.code, EXIT_FAILURE);
  assert.deepEqual(stale.said.counts, { OK: 0, REFRESHABLE: 0, MOVED: 0, DRIFT: 2, NEW: 0, GONE: 0 });
  assert.ok(stale.said.records.every((record) => record.stale.join() === "engine"));
  assert.match(
    stale.said.records[0].moved.join("; "),
    /^verdicts were 1 PASS, are 1 FAIL; .*values\.maxAbs was 2\.\d\de-14, is 5\.00e-12 \(tolerance 1\.00e-12\)/,
  );
  const lines = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.equal(lines.code, EXIT_FAILURE);
  assert.match(
    lines.out,
    /^singlet +selftest +fake-a +fake-near +STALE\(engine\) DRIFT +FAIL +verdicts were 1 PASS, are 1 FAIL; /m,
  );
  assert.match(lines.out, /^DRIFT: .*Do not write the baseline anew before the cause is known/m);
  assert.match(lines.out, /^FAIL or ERROR today: lvrtc compare pair names each pair and its reason\.$/m);
  // Such a run is no baseline: write refuses it, and the committed one stays.
  const before = filesOf(rootDir);
  const refused = await lvrtc(rootDir, ["baseline", "write", "pair"]);
  assert.equal(refused.code, EXIT_FAILURE);
  assert.match(refused.err, /^lvrtc baseline: singlet selftest fake-a fake-near FAIL$/m);
  assert.deepEqual(filesOf(rootDir), before);

  // An engine that states the fingerprint it had and answers otherwise: nothing is stale, and it drifted. The
  // store would answer for it, so the check is of an empty one.
  const same = pairRoot(t, "same-fingerprint");
  writeConfig(same, { ...PAIR, "fake-near": { bias: 2e-14, fingerprint: "stated" } });
  await written(same);
  writeConfig(same, { ...PAIR, "fake-near": { bias: 5e-12, fingerprint: "stated" } });
  const drifted = await checked(same, { runs: "fresh-runs" });
  assert.equal(drifted.ended.code, EXIT_FAILURE);
  assert.deepEqual(
    drifted.said.records.map((record) => [record.stale.join(), record.outcome]),
    [
      ["", "DRIFT"],
      ["", "DRIFT"],
    ],
  );
});

test("check: a run the baseline lacks is NEW, one the suite lacks is GONE; neither fails", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  cpSync(caseFixture("singlet"), join(rootDir, "cases", "third.json"));
  writeSuite(rootDir, ["singlet", "third"]);
  const lines = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.equal(lines.code, EXIT_OK, lines.err);
  assert.match(lines.out, /^double-gauss +selftest +fake-a +fake-near +GONE$/m);
  assert.match(lines.out, /^third +selftest +fake-a +fake-near +NEW +PASS$/m);
  assert.match(lines.out, /^pair: the suite file is not the one the baseline names/m);
  assert.match(lines.out, /^pair: 3 records: 1 OK, 0 REFRESHABLE, 0 MOVED, 0 DRIFT, 1 NEW, 1 GONE; /m);
});

test("exit code 2: no baseline, no comparisons, an unknown action, a root that is not there", async (t) => {
  const rootDir = pairRoot(t);
  const none = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.equal(none.code, EXIT_USAGE);
  assert.match(none.err, /the suite pair has no baseline; lvrtc baseline write pair writes one/);
  assert.equal((await lvrtc(rootDir, ["run", "suites/pair.json"])).code, EXIT_OK);
  const uncompared = await lvrtc(rootDir, ["baseline", "write", "pair"]);
  assert.equal(uncompared.code, EXIT_USAGE);
  assert.match(uncompared.err, /run lvrtc compare first/);
  assert.ok(!existsSync(join(rootDir, "baselines")));
  assert.equal((await lvrtc(rootDir, ["baseline", "refresh", "pair"])).code, EXIT_USAGE);
  assert.equal((await lvrtc(rootDir, ["baseline", "check", "absent"])).code, EXIT_USAGE);
  assert.equal((await lvrtc(rootDir, ["verify", "--root", "nowhere"])).code, EXIT_USAGE);
  // A run with an engine that could not answer is no baseline.
  writeConfig(rootDir, { ...PAIR, "fake-near": { bias: 2e-14, failMode: "throw" } });
  await lvrtc(rootDir, ["run", "suites/pair.json"]);
  await lvrtc(rootDir, ["compare", "pair"]);
  const failed = await lvrtc(rootDir, ["baseline", "write", "pair"]);
  assert.equal(failed.code, EXIT_FAILURE);
  assert.match(failed.err, /fake-a fake-near ERROR$/m);
  assert.ok(!existsSync(join(rootDir, "baselines")));
});

test("an engine that cannot be used: write refuses the run (exit 2), and check fails (exit 1) and names it", async (t) => {
  const rootDir = pairRoot(t);
  await written(rootDir);
  const before = filesOf(rootDir);
  // The module of one engine of the baseline is gone: the suite cannot run as the baseline's did.
  const engines = enginesOf(PAIR) as Record<string, { module: string }>;
  engines["fake-near"].module = join(rootDir, "no-such-engine.ts");
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ engines }));
  const { ended, said } = await checked(rootDir);
  assert.equal(ended.code, EXIT_FAILURE);
  assert.equal(said.failed, true);
  const lines = await lvrtc(rootDir, ["baseline", "check", "pair"]);
  assert.equal(lines.code, EXIT_FAILURE);
  assert.match(lines.err, /^lvrtc baseline: ERROR: engine fake-near could not be used \(/m);
  // The run the check left behind, compared, is no baseline, and the committed one is as it was.
  const refused = await lvrtc(rootDir, ["baseline", "write", "pair"]);
  assert.equal(refused.code, EXIT_USAGE);
  assert.match(refused.err, /no baseline is written of this run: engine fake-near could not be used \(/);
  assert.deepEqual(filesOf(rootDir), before);
});

// ── verify ───────────────────────────────────────────────────────────────────────────────────────────────────────

test("verify fails on a report edited by hand, a baseline that is no baseline, another policy and a stray report", async (t) => {
  const rootDir = pairRoot(t);
  // Nothing committed yet is nothing wrong.
  const empty = await lvrtc(rootDir, ["verify"]);
  assert.equal(empty.code, EXIT_OK);
  assert.match(empty.out, /^verify: 0 baselines, 0 problems\./);
  await written(rootDir);
  const good = filesOf(rootDir);
  const paths = {
    baseline: join(rootDir, "baselines", "pair.json"),
    markdown: join(rootDir, "reports", "pair", "rays.md"),
    json: join(rootDir, "reports", "pair", "rays.json"),
  };
  const restore = (): void => {
    for (const key of ["baseline", "markdown", "json"] as const) writeFileSync(paths[key], good[key]);
  };
  const failing = async (pattern: RegExp, policy?: Policy): Promise<void> => {
    const ended = await lvrtc(rootDir, ["verify"], { policy });
    assert.equal(ended.code, EXIT_FAILURE, ended.out);
    assert.match(ended.err, pattern);
    restore();
    assert.equal((await lvrtc(rootDir, ["verify"])).code, EXIT_OK);
  };

  writeFileSync(paths.markdown, good.markdown.replace("2 PASS", "3 PASS"));
  await failing(
    /^lvrtc verify: reports\/pair\/rays\.md: it is not what baselines\/pair\.json renders: it was edited by hand/m,
  );
  writeFileSync(paths.json, good.json.replace('"kind":"baseline-report"', '"kind":"report"'));
  await failing(/^lvrtc verify: reports\/pair\/rays\.json: it is not what baselines\/pair\.json renders/m);
  rmSync(paths.markdown);
  await failing(/^lvrtc verify: reports\/pair\/rays\.md: it is missing/m);

  const baseline: Baseline = JSON.parse(good.baseline);
  // A member the schema does not have.
  writeFileSync(paths.baseline, baselineText({ ...baseline, writtenAt: "today" } as Baseline));
  await failing(/^lvrtc verify: baselines\/pair\.json: not a baseline: not a valid baseline: /m);
  // A rule the schema cannot state: a verdict that is not the gravest of its requests.
  const pair = { ...baseline.runs[0].rungs[0].pairs[0], verdict: "FLOOR" as const };
  const broken = {
    ...baseline,
    runs: [{ ...baseline.runs[0], rungs: [{ ...baseline.runs[0].rungs[0], pairs: [pair] }] }, baseline.runs[1]],
  };
  writeFileSync(paths.baseline, baselineText(broken));
  await failing(/its verdict is FLOOR; the gravest of its requests is PASS/);
  // The same content, indented by hand.
  writeFileSync(paths.baseline, `${JSON.stringify(baseline, null, 2)}\n`);
  await failing(/not a baseline: the file is not the canonical text of its content/);
  // A figure changed in the baseline alone: the reports are no longer its rendering.
  const edited: Baseline = JSON.parse(good.baseline);
  const moved = { ...edited, suite: { ...edited.suite, hash: "0".repeat(64) } };
  writeFileSync(paths.baseline, baselineText(moved));
  await failing(/reports\/pair\/rays\.md: it is not what baselines\/pair\.json renders/);
  // A baseline of another suite under this name.
  mkdirSync(join(rootDir, "reports", "other"), { recursive: true });
  writeFileSync(join(rootDir, "baselines", "other.json"), good.baseline);
  const misnamed = await lvrtc(rootDir, ["verify"]);
  assert.equal(misnamed.code, EXIT_FAILURE);
  assert.match(misnamed.err, /^lvrtc verify: baselines\/other\.json: it is the baseline of the suite pair$/m);
  rmSync(join(rootDir, "baselines", "other.json"));
  // A report whose baseline is not there.
  writeFileSync(join(rootDir, "reports", "other", "rays.md"), good.markdown);
  const stray = await lvrtc(rootDir, ["verify"]);
  assert.equal(stray.code, EXIT_FAILURE);
  assert.match(
    stray.err,
    /^lvrtc verify: reports\/other\/rays\.md: there is no baselines\/other\.json it is rendered from$/m,
  );
  rmSync(join(rootDir, "reports", "other"), { recursive: true });

  // Judged by another policy than the one at hand: no record of these limits.
  const policy = loadPolicy();
  await failing(
    /it was judged by policy v\d+ \([0-9a-f]{64}\), not by the policy at hand, v\d+: lvrtc baseline check pair/,
    {
      ...policy,
      version: policy.version + 1,
    },
  );
});

test("the committed baselines and reports of this repository hold together", async () => {
  // What `npm run check` runs as `lvrtc verify`: hermetic, with LensVisualizer and optiland pointing nowhere.
  const child = spawnSync(process.execPath, [BIN, "verify"], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env: { ...process.env, LVRTC_LV_PATH: "/nowhere/lv", LVRTC_OPTILAND_PYTHON: "/nowhere/python" },
  });
  assert.equal(child.status, EXIT_OK, child.stderr);
  assert.match(child.stdout, /^verify: \d+ baselines?, 0 problems\./m);
});

// ── A case from LensVisualizer, an engine in a worker ────────────────────────────────────────────────────────────

/** Runs one command as a child process on a root: the loader serves one LensVisualizer tree to a process. */
function child(rootDir: string, ...args: string[]): Ended {
  const env = { ...process.env, LVRTC_RUNS_DIR: join(rootDir, "runs"), LVRTC_LV_PATH: "" };
  const ended = spawnSync(process.execPath, [BIN, ...args, "--root", rootDir], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env,
  });
  return { code: ended.status, out: ended.stdout, err: ended.stderr };
}

test("a LensVisualizer lens: a zoom is two records, an edited lens file is STALE(case), an edited engine file STALE(engine)", (t) => {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(join(rootDir, "suites"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv" }));
  cpSync(FAKE_LV, join(rootDir, "lv"), { recursive: true });
  const runs = [
    { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } },
    { name: "zoom", lens: { kind: "lv", key: "acme-zoom-24-48" } },
  ];
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "lenses",
    defaults: { engines: ["lv", "ref"] },
    runs,
  };
  writeFileSync(join(rootDir, "suites", "lenses.json"), JSON.stringify(suite));
  const ran = child(rootDir, "run", join(rootDir, "suites", "lenses.json"), "--rungs", "r0,r1");
  assert.equal(ran.code, EXIT_OK, ran.err);
  assert.equal(child(rootDir, "compare", "lenses").code, EXIT_OK);
  const wrote = child(rootDir, "baseline", "write", "lenses");
  assert.equal(wrote.code, EXIT_OK, wrote.err);
  const baseline: Baseline = JSON.parse(readFileSync(join(rootDir, "baselines", "lenses.json"), "utf8"));
  // The runs as run: the zoom at each end, each with its own case.
  assert.deepEqual(
    baseline.runs.map((run) => run.name),
    ["singlet", "zoom-wide", "zoom-tele"],
  );
  assert.equal(new Set(baseline.runs.map((run) => run.caseId)).size, 3);
  assert.deepEqual(
    baseline.engines.map((engine) => [engine.id, typeof engine.adapterRevision]),
    [
      ["lv", "string"],
      ["ref", "string"],
    ],
  );
  assert.equal(child(rootDir, "verify").code, EXIT_OK);
  const ok = child(rootDir, "baseline", "check", "lenses");
  assert.equal(ok.code, EXIT_OK, ok.err + ok.out);
  assert.match(ok.out, /^lenses: 6 records: 6 OK, /m);

  // A lens file is edited: the case LensVisualizer exports for its run is another, and the engines are the same.
  const lens = join(rootDir, "lv", "src", "lens-data", "acme", "AcmeSinglet50.data.ts");
  const lensText = readFileSync(lens, "utf8");
  writeFileSync(lens, lensText.replace("R: 50, d: 4", "R: 51, d: 4"));
  const staleCase = child(rootDir, "baseline", "check", "lenses");
  assert.equal(staleCase.code, EXIT_OK, staleCase.err + staleCase.out);
  assert.match(staleCase.out, /^singlet +r0 +lv +ref +STALE\(case\) REFRESHABLE +PASS$/m);
  assert.match(staleCase.out, /^singlet +r1 +lv +ref +STALE\(case\) REFRESHABLE +PASS$/m);
  assert.match(
    staleCase.out,
    /^lenses: 6 records: 4 OK, 2 REFRESHABLE, 0 MOVED, 0 DRIFT, 0 NEW, 0 GONE; stale by case 2, by engine 0, by policy 0$/m,
  );
  // verify reads no engine and cannot see it.
  assert.equal(child(rootDir, "verify").code, EXIT_OK);
  writeFileSync(lens, lensText);

  // An engine file is edited, by a comment: LensVisualizer's fingerprint is another, for every record of lv.
  const tracer = join(rootDir, "lv", "src", "optics", "trace", "sequentialTrace.ts");
  writeFileSync(tracer, `${readFileSync(tracer, "utf8")}\n// edited\n`);
  const staleEngine = child(rootDir, "baseline", "check", "lenses");
  assert.equal(staleEngine.code, EXIT_OK, staleEngine.err + staleEngine.out);
  assert.match(
    staleEngine.out,
    /^lenses: 6 records: 0 OK, 6 REFRESHABLE, 0 MOVED, 0 DRIFT, 0 NEW, 0 GONE; stale by case 0, by engine 6, by policy 0$/m,
  );
});

test(
  "optiland with another source hash is STALE(engine) for its records only",
  { skip: FAKE_OPTILAND_MISSING },
  async (t) => {
    const fake = fakeOptilandRoot(t, { engines: enginesOf(PAIR) });
    const { rootDir } = fake;
    mkdirSync(join(rootDir, "cases"));
    cpSync(caseFixture("singlet"), join(rootDir, "cases", "singlet.json"));
    writeSuite(rootDir, ["singlet"]);
    const run = ["run", "suites/pair.json", "--engines", "fake-a,fake-near,optiland"];
    for (const args of [run, ["compare", "pair"], ["baseline", "write", "pair"]]) {
      const ended = await lvrtc(rootDir, args);
      assert.equal(ended.code, EXIT_OK, `${args.join(" ")}: ${ended.err}${ended.out}`);
    }
    const baseline: Baseline = JSON.parse(filesOf(rootDir).baseline);
    assert.deepEqual(
      baseline.engines.map((engine) => engine.id),
      ["fake-a", "fake-near", "optiland"],
    );
    // optiland does not offer the echo: an answer, and a record like any other.
    assert.deepEqual(
      baseline.runs[0].rungs[0].pairs.map((pair) => [pair.a, pair.b, pair.verdict]),
      [
        ["fake-a", "fake-near", "PASS"],
        ["fake-a", "optiland", "UNSUPPORTED"],
        ["fake-near", "optiland", "UNSUPPORTED"],
      ],
    );
    assert.deepEqual((await checked(rootDir)).said.counts, {
      OK: 3,
      REFRESHABLE: 0,
      MOVED: 0,
      DRIFT: 0,
      NEW: 0,
      GONE: 0,
    });

    // Another optiland: one source file of the package differs.
    const source = join(fake.site, "optiland", "__init__.py");
    writeFileSync(source, `${readFileSync(source, "utf8")}\n# another build\n`);
    const { ended, said } = await checked(rootDir);
    assert.equal(ended.code, EXIT_OK);
    assert.deepEqual(
      said.records.map((record) => [record.a, record.b, record.stale.join(), record.outcome]),
      [
        ["fake-a", "fake-near", "", "OK"],
        ["fake-a", "optiland", "engine", "REFRESHABLE"],
        ["fake-near", "optiland", "engine", "REFRESHABLE"],
      ],
    );
  },
);
