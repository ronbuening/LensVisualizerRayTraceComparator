import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createRunCommand } from "../../src/cli/commands/run.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { CASES_DIRECTORY, MANIFEST_FILE, SOURCE_CHANGED } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { STORE_DIRECTORY } from "../../src/core/resultStore.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { DOUBLE_GAUSS, FAKE_PAIR_SUITE, FAKE_ROOT, SINGLET, caseFixture, tempDir } from "../core/support.ts";
import { FAKE_ENGINE_FILES, FAKE_LENS_FILES, FAKE_LV, closureOf } from "../engines/lv/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const FAKE_MIXED_SUITE = fileURLToPath(new URL("../fixtures/suites/fake-mixed.json", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));
const SYNOPSIS = "Usage: lvrtc run <suite.json> [--root <dir>] [--engines <id,...>] [--rungs <id,...>] [--json]\n";
/** The environment variable that tells the engine of the SIGKILL test after how many runs to kill its process. */
const KILL_AFTER_RUNS = "LVRTC_TEST_KILL_AFTER_RUNS";

/** How a child `lvrtc` ended. */
interface Ended {
  readonly code: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly out: string;
  readonly err: string;
}

/**
 * Runs `bin/lvrtc.mjs run` as a child process, with the runs directory set to `runsDir` through the environment so
 * that nothing is written into the repository. stderr is only ever searched, never compared: a debugger or
 * NODE_OPTIONS in the developer's environment may write to it.
 */
function lvrtcRun(
  runsDir: string,
  args: readonly string[],
  more: { cwd?: string; env?: Record<string, string> } = {},
): Ended {
  // The switch of the SIGKILL test below is set by that test alone, never by whoever runs the tests.
  const { [KILL_AFTER_RUNS]: _inherited, ...inherited } = process.env;
  const child = spawnSync(process.execPath, [BIN, "run", ...args], {
    encoding: "utf8",
    cwd: more.cwd ?? REPO_ROOT,
    env: { ...inherited, LVRTC_RUNS_DIR: runsDir, ...more.env },
  });
  return { code: child.status, signal: child.signal, out: child.stdout, err: child.stderr };
}

/** Three engines of the fixture root that run in this process. `fake-py` and `fake-pyn` are Python workers. */
const IN_PROCESS_ENGINES = "fake-a,fake-b,fake-none";

/** The fixture suite on the fixture root, on its in-process engines unless `args` name engines: no Python is needed. */
function fakePair(runsDir: string, ...args: string[]): Ended {
  const engines = args.includes("--engines") ? [] : ["--engines", IN_PROCESS_ENGINES];
  return lvrtcRun(runsDir, [FAKE_PAIR_SUITE, "--root", FAKE_ROOT, ...args, ...engines]);
}

function manifestOf(runsDir: string, suite: string): RunManifest {
  return JSON.parse(readFileSync(join(runsDir, suite, MANIFEST_FILE), "utf8"));
}

/**
 * A configuration root with its own engines, the two fixture cases under `cases/` and a suite of both on the rung
 * `selftest`, which is the one the fake engines answer.
 */
function rootWith(t: TestContext, engines: unknown, files: Readonly<Record<string, string>> = {}): string {
  const rootDir = join(tempDir(t), "root");
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "pair",
    defaults: { rungs: ["selftest"] },
    runs: [
      { name: "singlet", lens: { kind: "fixture", path: "cases/singlet.json" } },
      { name: "double-gauss", lens: { kind: "fixture", path: "cases/double-gauss.json" } },
    ],
  };
  const texts = { [CONFIG_FILE]: JSON.stringify({ engines }), "suite.json": JSON.stringify(suite), ...files };
  for (const [name, text] of Object.entries(texts)) {
    mkdirSync(dirname(join(rootDir, name)), { recursive: true });
    writeFileSync(join(rootDir, name), text);
  }
  mkdirSync(join(rootDir, "cases"));
  for (const name of ["singlet", "double-gauss"])
    copyFileSync(caseFixture(name), join(rootDir, "cases", `${name}.json`));
  return rootDir;
}

function fake(options: Record<string, unknown>, module: string = FAKE_ENGINE): Record<string, unknown> {
  return { transport: "in-process", module, options };
}

/** Runs the command in this process, wired to the given root, environment and working directory. */
async function inProcess(
  args: readonly string[],
  inputs: { rootDir: string; cwd?: string; env?: Record<string, string> },
): Promise<{ code: number; out: string; err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createRunCommand({
    rootDir: inputs.rootDir,
    env: inputs.env ?? {},
    cwd: inputs.cwd ?? inputs.rootDir,
  });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(["run", ...args], io, [command]);
  return { code, out: out.join(""), err: err.join("") };
}

// ── Through bin/lvrtc.mjs ────────────────────────────────────────────────────────────────────────────────────────

test("run is a registered command", async () => {
  assert.ok(COMMANDS.some((command) => command.name === "run"));
  const out: string[] = [];
  assert.equal(await runCli(["--help"], { stdout: (text) => void out.push(text), stderr: () => {} }), EXIT_OK);
  assert.match(out.join(""), /^ {2}run {7}Run a suite on the configured engines, reusing stored results$/m);
});

test("lvrtc run: a line per job and a summary, exit 0; the second run finds every answer in the store", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const manifestPath = join(runsDir, "fake-pair", MANIFEST_FILE);
  const first = fakePair(runsDir);
  assert.equal(first.code, EXIT_OK, first.err);
  assert.equal(
    first.out,
    [
      "singlet       selftest  fake-a     ok           computed",
      "singlet       selftest  fake-b     ok           computed",
      "singlet       selftest  fake-none  unsupported  negotiated   the engine does not offer selftest.echo",
      "double-gauss  selftest  fake-a     ok           computed",
      "double-gauss  selftest  fake-b     ok           computed",
      "double-gauss  selftest  fake-none  unsupported  negotiated   the engine does not offer selftest.echo",
      "fake-pair: 6 jobs: 4 ok, 2 unsupported, 0 error, 0 pending (4 computed, 0 cached)",
      `manifest: ${manifestPath}`,
      "",
    ].join("\n"),
  );
  const manifest = readFileSync(manifestPath, "utf8");
  assert.deepEqual(readdirSync(runsDir).sort(), ["fake-pair", STORE_DIRECTORY]);
  assert.deepEqual(
    readdirSync(join(runsDir, "fake-pair", CASES_DIRECTORY)).sort(),
    [`${SINGLET.id}.json`, `${DOUBLE_GAUSS.id}.json`].sort(),
  );
  assert.equal(readdirSync(join(runsDir, STORE_DIRECTORY)).length, 4);

  const second = fakePair(runsDir);
  assert.equal(second.code, EXIT_OK, second.err);
  assert.equal(
    second.out,
    first.out.replaceAll("computed\n", "cached\n").replace("(4 computed, 0 cached)", "(0 computed, 4 cached)"),
  );
  assert.equal(readFileSync(manifestPath, "utf8"), manifest, "computed or cached, the manifest is the same bytes");
  assert.equal(readdirSync(join(runsDir, STORE_DIRECTORY)).length, 4);
});

test("lvrtc run in another runs directory writes the same manifest, which names no directory", (t) => {
  const [here, there] = [join(tempDir(t), "runs"), join(tempDir(t), "elsewhere")];
  assert.equal(fakePair(here).code, EXIT_OK);
  assert.equal(fakePair(there).code, EXIT_OK);
  const text = readFileSync(join(here, "fake-pair", MANIFEST_FILE), "utf8");
  assert.equal(text, readFileSync(join(there, "fake-pair", MANIFEST_FILE), "utf8"));
  for (const absent of [here, there, REPO_ROOT, FAKE_ROOT, "fixtures"]) assert.ok(!text.includes(absent), absent);
});

test("--engines runs only the engines named, in id order", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const one = fakePair(runsDir, "--engines", "fake-b");
  assert.equal(one.code, EXIT_OK, one.err);
  assert.deepEqual(one.out.split("\n").slice(0, 3), [
    "singlet       selftest  fake-b     ok           computed",
    "double-gauss  selftest  fake-b     ok           computed",
    "fake-pair: 2 jobs: 2 ok, 0 unsupported, 0 error, 0 pending (2 computed, 0 cached)",
  ]);
  assert.deepEqual(
    manifestOf(runsDir, "fake-pair").engines.map((engine) => engine.id),
    ["fake-b"],
  );

  const two = fakePair(runsDir, "--engines", "fake-none,fake-b");
  assert.equal(two.code, EXIT_OK, two.err);
  assert.deepEqual(
    manifestOf(runsDir, "fake-pair").jobs.map((job) => `${job.run} ${job.engine} ${job.status}`),
    [
      "singlet fake-b ok",
      "singlet fake-none unsupported",
      "double-gauss fake-b ok",
      "double-gauss fake-none unsupported",
    ],
  );
  assert.match(two.out, /\(0 computed, 2 cached\)/);
});

test("unsupported is an answer, not a failure: a run of nothing else exits 0", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const ended = fakePair(runsDir, "--engines", "fake-none");
  assert.equal(ended.code, EXIT_OK, ended.err);
  assert.match(ended.out, /^fake-pair: 2 jobs: 0 ok, 2 unsupported, 0 error, 0 pending \(0 computed, 0 cached\)$/m);
  assert.equal(existsSync(join(runsDir, STORE_DIRECTORY)), false);
});

test("--rungs runs only the rungs named; an unknown rung is a usage error and nothing is written", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const unknown = fakePair(runsDir, "--rungs", "selftest,R0");
  assert.equal(unknown.code, EXIT_USAGE);
  assert.equal(unknown.out, "");
  assert.match(
    unknown.err,
    /^lvrtc run: unknown rung "R0": the rungs are selftest, r0, r1, r2, r3, r4, r4f, r5, r6a, r6b$/m,
  );
  assert.equal(existsSync(runsDir), false);

  const named = fakePair(runsDir, "--rungs", "selftest", "--engines", "fake-a");
  assert.equal(named.code, EXIT_OK, named.err);
  assert.deepEqual(
    manifestOf(runsDir, "fake-pair").jobs.map((job) => `${job.run} ${job.rung}`),
    ["singlet selftest", "double-gauss selftest"],
  );
});

test("an unknown engine is a usage error that lists the engines there are, and nothing is written", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const ended = fakePair(runsDir, "--engines", "fake-a,zemax");
  assert.equal(ended.code, EXIT_USAGE);
  assert.equal(ended.out, "");
  assert.match(
    ended.err,
    /^lvrtc run: unknown engine "zemax": the configuration defines fake-a, fake-b, fake-near, fake-none, fake-py, fake-pyn; built in: lv, optiland, ref, replay, wave$/m,
  );
  assert.equal(existsSync(runsDir), false);
});

test("a suite that is missing, or is not a suite, is a usage error naming the file", (t) => {
  const directory = tempDir(t);
  const runsDir = join(directory, "runs");
  const none = lvrtcRun(runsDir, ["--root", FAKE_ROOT]);
  assert.equal(none.code, EXIT_USAGE);
  assert.ok(none.err.includes(`lvrtc run: no suite file was named\n${SYNOPSIS}`), none.err);

  const missing = join(directory, "no-such-suite.json");
  const absent = lvrtcRun(runsDir, [missing, "--root", FAKE_ROOT]);
  assert.equal(absent.code, EXIT_USAGE);
  assert.ok(absent.err.includes(`lvrtc run: ${missing}: cannot be read (ENOENT)\n`), absent.err);

  const notASuite = lvrtcRun(runsDir, [caseFixture("singlet"), "--root", FAKE_ROOT]);
  assert.equal(notASuite.code, EXIT_USAGE);
  assert.ok(notASuite.err.includes(`lvrtc run: ${caseFixture("singlet")}: not a valid suite: `), notASuite.err);
  for (const ended of [none, absent, notASuite]) assert.equal(ended.out, "");
  assert.equal(existsSync(runsDir), false);
});

test("a run that cannot be started exits 1, is reported and recorded, and the other runs are run", (t) => {
  const runsDir = join(tempDir(t), "runs");
  // An empty variable sets nothing, so the fixture root has no LensVisualizer whatever this machine is set to.
  const args = [FAKE_MIXED_SUITE, "--root", FAKE_ROOT, "--engines", "fake-a"];
  const ended = lvrtcRun(runsDir, args, { env: { LVRTC_LV_PATH: "" } });
  assert.equal(ended.code, EXIT_FAILURE);
  assert.match(ended.out, /^singlet {2}selftest {2}fake-a {5}ok {11}computed$/m);
  assert.match(ended.out, /^fake-mixed: 1 job: 1 ok, 0 unsupported, 0 error, 0 pending \(1 computed, 0 cached\)$/m);
  const lv = "lv-not-configured: LensVisualizer is not configured: set lvPath in lvrtc.local.json or LVRTC_LV_PATH";
  const missing = "lens fixture cases/missing.json: it cannot be read (ENOENT)";
  assert.ok(ended.err.includes(`lvrtc run: run lv-lens was not started: ${lv}\n`), ended.err);
  assert.ok(ended.err.includes(`lvrtc run: run missing was not started: ${missing}\n`), ended.err);
  assert.deepEqual(manifestOf(runsDir, "fake-mixed").runs, [
    { name: "lv-lens", caseId: null, problems: [lv] },
    { name: "singlet", caseId: SINGLET.id, problems: [] },
    { name: "missing", caseId: null, problems: [missing] },
  ]);
});

test("a job that ends as an error exits 1, and the console says why where the manifest holds only the code", (t) => {
  const rootDir = rootWith(t, {
    "fake-a": fake({ id: "fake-a" }),
    refuses: fake({ id: "refuses", failMode: "protocol-error" }),
    absent: fake({ id: "absent" }, "engines/none.ts"),
  });
  const runsDir = join(tempDir(t), "runs");
  const ended = lvrtcRun(runsDir, [join(rootDir, "suite.json"), "--root", rootDir]);
  assert.equal(ended.code, EXIT_FAILURE, ended.err);
  const lines = ended.out.split("\n");
  assert.deepEqual(lines.slice(0, 3), [
    "singlet       selftest  absent    error        unavailable  load-failed: engine absent is unavailable " +
      "(load-failed): its module engines/none.ts does not exist",
    "singlet       selftest  fake-a    ok           computed",
    "singlet       selftest  refuses   error        computed     protocol-error: the engine refused the message " +
      "(fake-failure): the fake engine is set to fail (failMode protocol-error)",
  ]);
  assert.equal(lines[6], "pair: 6 jobs: 2 ok, 0 unsupported, 4 error, 0 pending (4 computed, 0 cached)");

  const manifest = manifestOf(runsDir, "pair");
  assert.deepEqual(
    manifest.jobs.map((job) => job.error?.code ?? null),
    ["load-failed", null, "protocol-error", "load-failed", null, "protocol-error"],
  );
  assert.deepEqual(manifest.engines[0], { id: "absent", status: "unavailable", code: "load-failed" });
  const text = readFileSync(join(runsDir, "pair", MANIFEST_FILE), "utf8");
  for (const absent of ["does not exist", "refused", rootDir]) assert.ok(!text.includes(absent), absent);
  assert.equal(readdirSync(join(runsDir, STORE_DIRECTORY)).length, 2, "the errors are not stored");
});

test("--json prints one object with sorted keys in place of the lines, and says which jobs were cached", (t) => {
  const runsDir = join(tempDir(t), "runs");
  assert.equal(fakePair(runsDir, "--engines", "fake-a").code, EXIT_OK);
  const ended = fakePair(runsDir, "--json");
  assert.equal(ended.code, EXIT_OK, ended.err);
  const report = JSON.parse(ended.out);
  assert.equal(ended.out, `${JSON.stringify(report, null, 2)}\n`);
  assert.deepEqual(Object.keys(report), [
    "counts",
    "engines",
    "jobs",
    "manifest",
    "runs",
    "sources",
    "suite",
    "warnings",
  ]);
  assert.deepEqual(report.counts, {
    jobs: 6,
    source: { cached: 2, computed: 2, negotiated: 2, unavailable: 0 },
    status: { error: 0, ok: 4, pending: 0, unsupported: 2 },
  });
  assert.equal(report.manifest, join(runsDir, "fake-pair", MANIFEST_FILE));
  const manifest = manifestOf(runsDir, "fake-pair");
  assert.deepEqual(report.suite, manifest.suite);
  // A suite of case files has no source to identify, and its manifest no member for one.
  assert.deepEqual(report.sources, {});
  assert.equal(manifest.sources, undefined);
  assert.deepEqual(report.engines, manifest.engines);
  assert.deepEqual(report.runs, manifest.runs);
  assert.deepEqual(report.warnings, []);
  assert.deepEqual(
    report.jobs.map((job: { source: string }) => job.source),
    ["cached", "computed", "negotiated", "cached", "computed", "negotiated"],
  );
  // A job of the report is the manifest's job and the two things only the console is told.
  report.jobs.forEach((job: Record<string, unknown>, index: number) => {
    const { source: _source, detail, ...recorded } = job;
    assert.deepEqual(recorded, manifest.jobs[index]);
    assert.equal(detail, index % 3 === 2 ? "the engine does not offer selftest.echo" : null);
  });
});

test("the suite file and --root are relative to the directory the command is run in", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const cwd = dirname(FAKE_ROOT);
  const args = [relative(cwd, FAKE_PAIR_SUITE), "--root", relative(cwd, FAKE_ROOT), "--engines", "fake-a"];
  const ended = lvrtcRun(runsDir, args, { cwd });
  assert.equal(ended.code, EXIT_OK, ended.err);
  assert.match(ended.out, /^fake-pair: 2 jobs: 2 ok/m);

  // A value may follow its option after an equals sign, as for every command.
  const joined = [relative(cwd, FAKE_PAIR_SUITE), `--root=${relative(cwd, FAKE_ROOT)}`, "--engines=fake-a"];
  const again = lvrtcRun(join(tempDir(t), "runs"), joined, { cwd });
  assert.equal(again.code, EXIT_OK, again.err);
  assert.match(again.out, /^fake-pair: 2 jobs: 2 ok/m);
});

test("a run killed with SIGKILL resumes: only the missing jobs are computed, into a whole run's manifest", (t) => {
  if (process.platform === "win32") return t.skip("Windows has no SIGKILL to end a process part-way with");
  // The fake engine, in a module that kills its own process once it has answered as many runs as the environment
  // says. Nothing catches SIGKILL: the run ends between two jobs, as it would for `kill -9` or a power cut.
  const killable = [
    `import { createEngine as createFake } from ${JSON.stringify(pathToFileURL(FAKE_ENGINE).href)};`,
    `const limit = Number(process.env.${KILL_AFTER_RUNS} ?? "Infinity");`,
    "let answered = 0;",
    "export function createEngine(options) {",
    "  const fake = createFake(options);",
    "  return (message) => {",
    '    if (message.method !== "run" || answered++ < limit) return fake(message);',
    '    process.kill(process.pid, "SIGKILL");',
    "    return new Promise(() => {});",
    "  };",
    "}",
    "",
  ].join("\n");
  const engines = {
    "fake-a": fake({ id: "fake-a" }, "engines/killable.ts"),
    "fake-b": fake({ id: "fake-b", bias: 0.001 }, "engines/killable.ts"),
  };
  const computedLines = (ended: Ended): number =>
    ended.out.split("\n").filter((line) => line.endsWith("  computed")).length;

  // An uninterrupted run, from a root of its own into a runs directory of its own.
  const wholeRoot = rootWith(t, engines, { "engines/killable.ts": killable });
  const wholeRuns = join(tempDir(t), "runs");
  const whole = lvrtcRun(wholeRuns, [join(wholeRoot, "suite.json"), "--root", wholeRoot]);
  assert.equal(whole.code, EXIT_OK, whole.err);
  assert.equal(computedLines(whole), 4);

  const rootDir = rootWith(t, engines, { "engines/killable.ts": killable });
  const runsDir = join(tempDir(t), "runs");
  const args = [join(rootDir, "suite.json"), "--root", rootDir];
  const killed = lvrtcRun(runsDir, args, { env: { [KILL_AFTER_RUNS]: "3" } });
  assert.equal(killed.signal, "SIGKILL");
  assert.equal(killed.code, null);
  assert.equal(existsSync(join(runsDir, "pair")), false, "a killed run leaves no manifest");
  const stored = readdirSync(join(runsDir, STORE_DIRECTORY));
  assert.equal(stored.length, 3, "the three jobs that finished are in the store");
  assert.ok(
    stored.every((name) => /^[0-9a-f]{64}\.json$/.test(name)),
    stored.join(),
  );

  const resumed = lvrtcRun(runsDir, args);
  assert.equal(resumed.code, EXIT_OK, resumed.err);
  assert.equal(computedLines(resumed), 1, resumed.out);
  assert.match(resumed.out, /^pair: 4 jobs: 4 ok, 0 unsupported, 0 error, 0 pending \(1 computed, 3 cached\)$/m);
  assert.equal(
    readFileSync(join(runsDir, "pair", MANIFEST_FILE), "utf8"),
    readFileSync(join(wholeRuns, "pair", MANIFEST_FILE), "utf8"),
  );
  assert.deepEqual(
    readdirSync(join(runsDir, STORE_DIRECTORY)).sort(),
    readdirSync(join(wholeRuns, STORE_DIRECTORY)).sort(),
  );
});

// ── In this process ──────────────────────────────────────────────────────────────────────────────────────────────

test("--help prints the usage and runs nothing", async (t) => {
  const ended = await inProcess(["--help", "no-such-suite.json"], { rootDir: tempDir(t) });
  assert.equal(ended.code, EXIT_OK);
  assert.ok(ended.out.startsWith(SYNOPSIS), ended.out);
  assert.match(ended.out, /^ {2}--root <dir> /m);
  assert.match(ended.out, /^Exit code: 0 when no job ended as an error/m);
  assert.equal(ended.err, "");
});

test("a command line that is not the synopsis is a usage error that shows it", async (t) => {
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }) });
  const lines: [args: string[], said: string][] = [
    [[], "no suite file was named"],
    [["--json"], "no suite file was named"],
    [["suite.json", "other.json"], "more than one suite file was named: suite.json, other.json"],
    [["suite.json", "--verbose"], 'unknown option "--verbose"'],
    [["suite.json", "-j"], 'unknown option "-j"'],
    [["suite.json", "--engines"], "--engines needs a value"],
    [["suite.json", "--rungs", "--json"], "--rungs needs a value"],
    [["suite.json", "--root"], "--root needs a value"],
    [["suite.json", "--engines", "fake-a", "--engines", "fake-a"], "--engines is given more than once"],
    [["suite.json", "--engines", "fake-a,,fake-b"], '--engines needs ids separated by commas, got "fake-a,,fake-b"'],
    [["suite.json", "--rungs", ""], '--rungs needs ids separated by commas, got ""'],
  ];
  for (const [args, said] of lines) {
    const ended = await inProcess(args, { rootDir, env: { LVRTC_RUNS_DIR: join(rootDir, "runs") } });
    assert.equal(ended.code, EXIT_USAGE, args.join(" "));
    assert.equal(ended.err, `lvrtc run: ${said}\n${SYNOPSIS}`);
    assert.equal(ended.out, "");
  }
  assert.equal(existsSync(join(rootDir, "runs")), false);
});

test("a --root that is not a directory is a usage error", async (t) => {
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }) });
  for (const root of ["no-such-directory", "suite.json"]) {
    const ended = await inProcess(["suite.json", "--root", root], { rootDir });
    assert.equal(ended.code, EXIT_USAGE);
    assert.equal(ended.err, `lvrtc run: --root ${root}: not a directory\n`);
  }
});

test("without --root the command's own root is the configuration root, and its runsDir takes the output", async (t) => {
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }) });
  const ended = await inProcess(["suite.json"], { rootDir });
  assert.equal(ended.code, EXIT_OK, ended.err);
  const manifestPath = join(rootDir, "runs", "pair", MANIFEST_FILE);
  assert.equal(
    ended.out,
    [
      "singlet       selftest  fake-a    ok           computed",
      "double-gauss  selftest  fake-a    ok           computed",
      "pair: 2 jobs: 2 ok, 0 unsupported, 0 error, 0 pending (2 computed, 0 cached)",
      `manifest: ${manifestPath}`,
      "",
    ].join("\n"),
  );
  assert.equal(ended.err, "");
  assert.ok(existsSync(manifestPath));

  // --root names another root, with engines and a runs directory of its own; the suite stays where it was named.
  const other = rootWith(t, { "fake-z": fake({ id: "fake-z" }) });
  const elsewhere = await inProcess(["suite.json", "--root", other], { rootDir });
  assert.equal(elsewhere.code, EXIT_OK, elsewhere.err);
  assert.match(elsewhere.out, /^singlet {7}selftest {2}fake-z {4}ok {11}computed$/m);
  assert.ok(existsSync(join(other, "runs", "pair", MANIFEST_FILE)));
});

test("LVRTC_RUNS_DIR moves the output, relative to the root as every configured path is", async (t) => {
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }) });
  const ended = await inProcess(["suite.json"], { rootDir, env: { LVRTC_RUNS_DIR: "out/here" } });
  assert.equal(ended.code, EXIT_OK, ended.err);
  assert.ok(existsSync(join(rootDir, "out", "here", "pair", MANIFEST_FILE)));
  assert.equal(existsSync(join(rootDir, "runs")), false);
});

test("a configuration without engines runs nothing unless an engine is named: a usage error", async (t) => {
  const rootDir = rootWith(t, {});
  const ended = await inProcess(["suite.json"], { rootDir });
  assert.equal(ended.code, EXIT_USAGE);
  assert.equal(
    ended.err,
    "lvrtc run: run singlet: it names no engine and the configuration defines none: " +
      "name the engines to run with --engines (built in: lv, optiland, ref, replay, wave)\n",
  );
  assert.equal(existsSync(join(rootDir, "runs")), false);
});

test("the built-in engine ref runs under any root when it is named, and only then", async (t) => {
  // A root without a single engine of its own.
  const bare = rootWith(t, {});
  const named = await inProcess(["suite.json", "--engines", "ref", "--rungs", "r0,r1"], { rootDir: bare });
  assert.equal(named.code, EXIT_OK, named.err);
  assert.equal(
    named.out,
    [
      "singlet       r0        ref       ok           computed",
      "singlet       r1        ref       ok           computed",
      "double-gauss  r0        ref       ok           computed",
      "double-gauss  r1        ref       ok           computed",
      "pair: 4 jobs: 4 ok, 0 unsupported, 0 error, 0 pending (4 computed, 0 cached)",
      `manifest: ${join(bare, "runs", "pair", MANIFEST_FILE)}`,
      "",
    ].join("\n"),
  );
  const [engine] = manifestOf(join(bare, "runs"), "pair").engines;
  assert.ok(engine.status === "available");
  assert.equal(engine.id, "ref");
  assert.match(engine.fingerprint, /^[0-9a-f]{64}$/);

  // A root with an engine of its own: that one is the default, and ref joins it when it is named.
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }) });
  const plain = await inProcess(["suite.json"], { rootDir });
  assert.deepEqual(
    manifestOf(join(rootDir, "runs"), "pair").engines.map((each) => each.id),
    ["fake-a"],
    plain.err,
  );
  const both = await inProcess(["suite.json", "--engines", "ref,fake-a"], { rootDir });
  assert.equal(both.code, EXIT_OK, both.err);
  // ref does not answer the conformance quantity, and says so before it is asked.
  assert.match(
    both.out,
    /^singlet {7}selftest {2}ref {7}unsupported {2}negotiated {3}the engine does not offer selftest\.echo$/m,
  );
  assert.match(both.out, /^singlet {7}selftest {2}fake-a {4}ok {11}cached$/m);
});

test("--rungs r2 traces the probe rays of a fixture: one job for each set, and a field without rays fails nothing", async (t) => {
  const suite = (fields: unknown): string =>
    JSON.stringify({
      contract: CONTRACT_VERSION,
      kind: "suite",
      name: "probe",
      defaults: { sampling: { bundleGrid: 4 }, ...(fields === undefined ? {} : { fields }) },
      runs: [{ name: "singlet", lens: { kind: "fixture", path: "cases/singlet.json" } }],
    });
  const rootDir = rootWith(
    t,
    {},
    {
      "angles.json": suite({ kind: "angles-deg", values: [0, 5, 10] }),
      "fractions.json": suite(undefined),
    },
  );
  // The reference engine traces the rays of every set; the conformance engine says, before it is asked, that it
  // does not trace rays, which is an answer.
  const angles = await inProcess(["angles.json", "--engines", "ref", "--rungs", "r2"], { rootDir });
  assert.equal(angles.code, EXIT_OK, angles.err);
  assert.equal(angles.err, "");
  assert.equal(
    angles.out,
    [
      ...new Array(3).fill("singlet  r2        ref       ok           computed"),
      "probe: 3 jobs: 3 ok, 0 unsupported, 0 error, 0 pending (3 computed, 0 cached)",
      `manifest: ${join(rootDir, "runs", "probe", MANIFEST_FILE)}`,
      "",
    ].join("\n"),
  );
  const manifest = manifestOf(join(rootDir, "runs"), "probe");
  assert.equal(new Set(manifest.jobs.map((job) => job.requestId)).size, 3);
  assert.equal(manifest.runs[0].raySets?.sets.length, 3);
  assert.deepEqual(manifest.runs[0].raySets?.problems, []);
  // The same suite again has the same rays, and so the same manifest, byte for byte: every answer is in the store.
  const bytes = readFileSync(join(rootDir, "runs", "probe", MANIFEST_FILE), "utf8");
  const again = await inProcess(["angles.json", "--engines", "ref", "--rungs", "r2"], { rootDir });
  assert.match(again.out, /\(0 computed, 3 cached\)$/m);
  assert.equal(readFileSync(join(rootDir, "runs", "probe", MANIFEST_FILE), "utf8"), bytes);

  // r3 asks the very requests of r2: an engine is asked once for both, and the second rung finds the answers.
  const both = await inProcess(["angles.json", "--engines", "ref", "--rungs", "r3,r2"], { rootDir });
  assert.equal(both.code, EXIT_OK, both.err);
  assert.match(both.out, /^probe: 6 jobs: 6 ok, 0 unsupported, 0 error, 0 pending \(0 computed, 6 cached\)$/m);
  const jobs = manifestOf(join(rootDir, "runs"), "probe").jobs;
  assert.deepEqual(
    jobs.map((job) => job.rung),
    ["r2", "r2", "r2", "r3", "r3", "r3"],
  );
  assert.deepEqual(
    jobs.slice(3).map((job) => [job.requestId, job.storeKey]),
    jobs.slice(0, 3).map((job) => [job.requestId, job.storeKey]),
  );

  // Without fields a run takes the fractions 0, 0.5 and 1, of which a case alone can place the axis only: the
  // others are reported, recorded, and no failure.
  const fractions = await inProcess(["fractions.json", "--engines", "ref", "--rungs", "r2"], { rootDir });
  assert.equal(fractions.code, EXIT_OK, fractions.err);
  assert.match(fractions.out, /^probe: 1 job: 1 ok, 0 unsupported, 0 error, 0 pending/m);
  assert.deepEqual(fractions.err.split("\n"), [
    "lvrtc run: run singlet: a field has no rays: field-fraction-unresolved: a case read from a file states no " +
      "image height to take the fraction 0.5 of; state the field as an angle (fields of kind angles-deg)",
    "lvrtc run: run singlet: a field has no rays: field-fraction-unresolved: a case read from a file states no " +
      "image height to take the fraction 1 of; state the field as an angle (fields of kind angles-deg)",
    "",
  ]);
  assert.equal(manifestOf(join(rootDir, "runs"), "probe").runs[0].raySets?.problems.length, 2);

  // A run that names no rung is run on every rung, the four of traced rays among them: with its fields stated as
  // angles the run has an MTF recipe, so the rung that takes an MTF of the traced rays, r4, asks for them too, and
  // finds every answer in the store; the rung that takes a wave MTF of them, r6a, asks for them and for the same
  // field on the finer lattice. One that names rungs without rays has no ray sets generated for it.
  const plain = await inProcess(["angles.json", "--engines", "ref"], { rootDir });
  const everyRung = manifestOf(join(rootDir, "runs"), "probe");
  assert.deepEqual(
    [...new Set(everyRung.jobs.map((job) => job.rung))],
    ["selftest", "r0", "r1", "r2", "r3", "r4", "r6a"],
    plain.err,
  );
  const ofRung = (rung: string) =>
    everyRung.jobs.filter((job) => job.rung === rung).map((job) => [job.requestId, job.storeKey]);
  assert.deepEqual(ofRung("r4"), ofRung("r2"));
  assert.deepEqual(ofRung("r6a").slice(0, ofRung("r2").length), ofRung("r2"));
  assert.equal(ofRung("r6a").length, 2 * ofRung("r2").length);
  assert.equal(everyRung.runs[0].fineRaySets?.sets.length, everyRung.runs[0].raySets?.sets.length);
  assert.deepEqual(everyRung.runs[0].recipe?.recipe?.frequenciesPerMm, [10, 30, 50]);
  await inProcess(["angles.json", "--engines", "ref", "--rungs", "r0,r1"], { rootDir });
  assert.equal(Object.hasOwn(manifestOf(join(rootDir, "runs"), "probe").runs[0], "raySets"), false);
});

test("a run's own engines and rungs are used, and one that does not exist is a usage error", async (t) => {
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }), "fake-b": fake({ id: "fake-b" }) });
  const suite = (more: Record<string, unknown>): string => {
    const lens = { kind: "fixture", path: "cases/singlet.json" };
    const runs = [
      { name: "plain", lens },
      { name: "choosy", lens, ...more },
    ];
    return JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name: "own", runs });
  };
  writeFileSync(join(rootDir, "own.json"), suite({ engines: ["fake-b"], rungs: ["selftest"] }));
  const own = await inProcess(["own.json"], { rootDir });
  assert.equal(own.code, EXIT_OK, own.err);
  // The run that names neither gets every configured engine on every rung that compares the engines of a run. A
  // case read from a file has rays on the axis only, so each rung of traced rays asks one request. The rungs that
  // are about engines of their own, r4f, r5 and r6b, ask nothing about a case that no LensVisualizer sampled, and the
  // rungs that take an MTF of the traced rays, r4 and r6a, nothing of a run without a recipe to take its
  // frequencies from.
  const shared = RUNGS.filter((rung) => rung.engines === undefined && rung.needsRecipe !== true);
  assert.deepEqual(
    RUNGS.filter((rung) => rung.needsRecipe === true).map((rung) => rung.id),
    ["r4", "r4f", "r5", "r6a", "r6b"],
  );
  assert.deepEqual(
    RUNGS.filter((rung) => rung.engines !== undefined).map((rung) => rung.id),
    ["r4f", "r5", "r6b"],
  );
  assert.deepEqual(
    manifestOf(join(rootDir, "runs"), "own").jobs.map((job) => `${job.run} ${job.rung} ${job.engine}`),
    [...shared.flatMap((rung) => [`plain ${rung.id} fake-a`, `plain ${rung.id} fake-b`]), "choosy selftest fake-b"],
  );
  // It has no recipe for a rung to be made from, and the manifest says why.
  const [plain] = manifestOf(join(rootDir, "runs"), "own").runs;
  assert.equal(plain.recipe?.recipe, null);
  assert.match(plain.recipe?.problems[0] ?? "", /^recipe-needs-field-angles: /);

  writeFileSync(join(rootDir, "worked.json"), suite({ engines: ["ref"], rungs: ["R0"] }));
  const worked = await inProcess(["worked.json"], { rootDir });
  assert.equal(worked.code, EXIT_USAGE);
  assert.equal(
    worked.err,
    'lvrtc run: run choosy: unknown rung "R0": the rungs are selftest, r0, r1, r2, r3, r4, r4f, r5, r6a, r6b\n',
  );
  // The flags replace what the run asks for, so with both given the same suite runs.
  const replaced = await inProcess(["worked.json", "--rungs", "selftest", "--engines", "fake-a"], { rootDir });
  assert.equal(replaced.code, EXIT_OK, replaced.err);
});

test("a configuration file that cannot be used is an error, exit 1, as for doctor", async (t) => {
  const rootDir = rootWith(t, {});
  writeFileSync(join(rootDir, CONFIG_FILE), "{ not json");
  const ended = await inProcess(["suite.json"], { rootDir });
  assert.equal(ended.code, EXIT_FAILURE);
  assert.ok(ended.err.startsWith(`lvrtc run: ${join(rootDir, CONFIG_FILE)}: malformed JSON (`), ended.err);
});

test("a store entry that cannot be trusted is a warning on the error stream, and the run succeeds", async (t) => {
  const rootDir = rootWith(t, { "fake-a": fake({ id: "fake-a" }) });
  assert.equal((await inProcess(["suite.json"], { rootDir })).code, EXIT_OK);
  const store = join(rootDir, "runs", STORE_DIRECTORY);
  const [entry] = readdirSync(store).sort();
  writeFileSync(join(store, entry), "");
  const ended = await inProcess(["suite.json"], { rootDir });
  assert.equal(ended.code, EXIT_OK);
  const key = entry.replace(".json", "");
  assert.match(
    ended.err,
    new RegExp(`^lvrtc run: warning: store entry ${key}: it is malformed JSON .*; the job is computed again\n$`),
  );
  assert.match(ended.out, /\(1 computed, 1 cached\)/);
});

// ── LensVisualizer lenses ────────────────────────────────────────────────────────────────────────────────────────
//
// Against a copy of the fake LV tree, in a child process: the parent binds no LensVisualizer for these.

/** A root whose `lvPath` is a copy of the fake LV tree beside it, with the given engines and a suite of two lenses. */
function lvRoot(t: TestContext, engines: unknown, files: Readonly<Record<string, string>> = {}): string {
  const rootDir = join(tempDir(t), "root");
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "lv-pair",
    defaults: { rungs: ["selftest"] },
    runs: [
      { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } },
      {
        name: "zoom-tele-f8",
        lens: { kind: "lv", key: "acme-zoom-24-48" },
        state: { zoomT: 1 },
        aperture: { kind: "f-number", value: 8 },
      },
      {
        name: "refocused",
        lens: { kind: "lv", key: "acme-zoom-24-48" },
        state: { focus: { kind: "focusT", value: 0.5 } },
      },
    ],
  };
  const config = { lvPath: "lv", engines };
  const texts = { [CONFIG_FILE]: JSON.stringify(config), "suite.json": JSON.stringify(suite), ...files };
  for (const [name, text] of Object.entries(texts)) {
    mkdirSync(dirname(join(rootDir, name)), { recursive: true });
    writeFileSync(join(rootDir, name), text);
  }
  cpSync(FAKE_LV, join(rootDir, "lv"), { recursive: true });
  return rootDir;
}

test("a suite of LensVisualizer lenses has its cases built from the configured checkout, which the manifest records", (t) => {
  const rootDir = lvRoot(t, { "fake-a": fake({ id: "fake-a" }) });
  const runsDir = join(tempDir(t), "runs");
  const args = [join(rootDir, "suite.json"), "--root", rootDir];
  // The root's own lvPath is used: nothing of this machine's configuration reaches the child.
  const ended = lvrtcRun(runsDir, args, { env: { LVRTC_LV_PATH: "" } });
  assert.equal(ended.code, EXIT_FAILURE, "the refocused runs cannot be started");
  assert.match(ended.out, /^singlet {9}selftest {2}fake-a {4}ok {11}computed$/m);
  assert.match(ended.out, /^zoom-tele-f8 {4}selftest {2}fake-a {4}ok {11}computed$/m);
  // The refocused run states no zoom position of a zoom: it is two runs, one for each end, and neither starts.
  for (const [end, zoom] of [
    ["wide", 0],
    ["tele", 1],
  ]) {
    assert.match(
      ended.err,
      new RegExp(
        `^lvrtc run: run refocused-${end} was not started: finite-conjugate-unavailable: focus position 0\\.5 at zoom ${zoom} `,
        "m",
      ),
    );
  }

  const manifest = manifestOf(runsDir, "lv-pair");
  const lv = join(rootDir, "lv");
  assert.deepEqual(manifest.sources, {
    lv: {
      fingerprint: {
        commit: null,
        dirty: null,
        engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES),
        engineFileCount: FAKE_ENGINE_FILES.length,
      },
      status: "unchanged",
    },
  });
  assert.deepEqual(
    manifest.runs.map((run) => [run.name, run.caseId !== null, run.problems.length]),
    [
      ["singlet", true, 0],
      ["zoom-tele-f8", true, 0],
      ["refocused-wide", false, 1],
      ["refocused-tele", false, 1],
    ],
  );
  const cases = readdirSync(join(runsDir, "lv-pair", CASES_DIRECTORY)).sort();
  assert.deepEqual(cases, manifest.runs.flatMap((run) => (run.caseId === null ? [] : [`${run.caseId}.json`])).sort());
  const stored = JSON.parse(
    readFileSync(join(runsDir, "lv-pair", CASES_DIRECTORY, `${manifest.runs[0].caseId}.json`), "utf8"),
  );
  assert.equal(stored.provenance.source.lensKey, "acme-singlet-50");
  assert.equal(stored.provenance.lv.closureHash, closureOf(lv, FAKE_ENGINE_FILES));

  // Another process, another runs directory: the same manifest, byte for byte, and no path in it.
  const elsewhere = join(tempDir(t), "runs");
  lvrtcRun(elsewhere, [...args, "--json"], { env: { LVRTC_LV_PATH: "" } });
  const text = readFileSync(join(runsDir, "lv-pair", MANIFEST_FILE), "utf8");
  assert.equal(readFileSync(join(elsewhere, "lv-pair", MANIFEST_FILE), "utf8"), text);
  assert.ok(!text.includes(rootDir) && !text.includes(runsDir));
});

test("a LensVisualizer file edited while the suite runs marks the manifest, warns and exits 1", (t) => {
  // An engine that edits the lens file the first case was built from, whenever it is asked to run.
  const editing = [
    'import { appendFileSync } from "node:fs";',
    `import { createEngine as createFake } from ${JSON.stringify(pathToFileURL(FAKE_ENGINE).href)};`,
    "export function createEngine({ edits, ...options }) {",
    "  const fake = createFake(options);",
    "  return (message) => {",
    '    if (message.method === "run") appendFileSync(edits, "// edited during the run\\n");',
    "    return fake(message);",
    "  };",
    "}",
    "",
  ].join("\n");
  const lensFile = FAKE_LENS_FILES[0][0];
  // Every run of this suite starts, so nothing but the edit can make the command fail.
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "lv-pair",
    defaults: { rungs: ["selftest"] },
    runs: [
      { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } },
      { name: "zoom", lens: { kind: "lv", key: "acme-zoom-24-48" } },
    ],
  };
  const rootDir = lvRoot(t, {}, { "engines/editing.ts": editing, "suite.json": JSON.stringify(suite) });
  const engines = { "fake-a": fake({ id: "fake-a", edits: join(rootDir, "lv", lensFile) }, "engines/editing.ts") };
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv", engines }));
  const runsDir = join(tempDir(t), "runs");
  const ended = lvrtcRun(runsDir, [join(rootDir, "suite.json"), "--root", rootDir], { env: { LVRTC_LV_PATH: "" } });
  assert.equal(ended.code, EXIT_FAILURE);
  assert.ok(!ended.err.includes("was not started"), ended.err);
  assert.ok(ended.err.includes(`lvrtc run: warning: case source lv changed during the run: ${lensFile}\n`), ended.err);
  const manifest = manifestOf(runsDir, "lv-pair");
  assert.equal(manifest.sources?.lv.status, SOURCE_CHANGED);
  // The zoom states no position: it was run at both ends.
  assert.deepEqual(
    manifest.jobs.map((job) => [job.run, job.status]),
    [
      ["singlet", "ok"],
      ["zoom-wide", "ok"],
      ["zoom-tele", "ok"],
    ],
  );
});
