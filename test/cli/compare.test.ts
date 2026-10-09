// `lvrtc compare` and `lvrtc report`: the command lines, what they print and write, and how they exit.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import { STORE_DIRECTORY } from "../../src/core/resultStore.ts";
import { REPORT_JSON_FILE, REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "../core/support.ts";
import { FAULT_ROOT, goldenFile, suiteFile } from "../report/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const COMPARE_SYNOPSIS =
  "Usage: lvrtc compare <suite name | run directory> [--root <dir>] [--reference <engine>]\n" +
  "                     [--mode reference-vs-each|pairwise|both] [--json]\n";
const REPORT_SYNOPSIS = "Usage: lvrtc report <suite name | run directory> [--root <dir>] [--floor <dir>]\n";

interface Ended {
  readonly code: number | null;
  readonly out: string;
  readonly err: string;
}

/** Runs `bin/lvrtc.mjs` as a child process with `runsDir` as the runs directory. */
function lvrtc(runsDir: string, args: readonly string[], cwd: string = REPO_ROOT): Ended {
  const child = spawnSync(process.execPath, [BIN, ...args], {
    encoding: "utf8",
    cwd,
    env: { ...process.env, LVRTC_RUNS_DIR: runsDir },
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

/** Runs a command in this process, on the fixture root, with `runsDir` as the runs directory. */
async function inProcess(runsDir: string, args: readonly string[], cwd: string = REPO_ROOT): Promise<Ended> {
  const inputs = { rootDir: FAKE_ROOT, cwd, env: { LVRTC_RUNS_DIR: runsDir } };
  const commands = [createRunCommand(inputs), createCompareCommand(inputs), createReportCommand(inputs)];
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(args, io, commands);
  return { code, out: out.join(""), err: err.join("") };
}

/** A runs directory in which the fixture pair suite has been run on three in-process engines. */
async function pairRun(t: TestContext, engines: string = "fake-a,fake-near,fake-none"): Promise<string> {
  const runsDir = join(tempDir(t), "runs");
  const ended = await inProcess(runsDir, ["run", FAKE_PAIR_SUITE, "--engines", engines]);
  assert.equal(ended.code, EXIT_OK, ended.err);
  return runsDir;
}

function comparisonsOf(runsDir: string, suite: string = "fake-pair"): ComparisonFile {
  return JSON.parse(readFileSync(join(runsDir, suite, COMPARISONS_FILE), "utf8"));
}

// ── Through bin/lvrtc.mjs ────────────────────────────────────────────────────────────────────────────────────────

test("compare and report are registered commands, with help", async () => {
  assert.ok(COMMANDS.some((command) => command.name === "compare"));
  assert.ok(COMMANDS.some((command) => command.name === "report"));
  const list = lvrtc("unused", ["--help"]);
  assert.match(list.out, /^ {2}compare {3}Compare the engines of a run, against a reference and pairwise$/m);
  assert.match(list.out, /^ {2}report {4}Write the report of a compared run as JSON and Markdown$/m);
  for (const [command, synopsis] of [
    ["compare", COMPARE_SYNOPSIS],
    ["report", REPORT_SYNOPSIS],
  ]) {
    const help = await inProcess("unused", [command, "--help"]);
    assert.equal(help.code, EXIT_OK);
    assert.ok(help.out.startsWith(synopsis), help.out);
    assert.match(help.out, /^Exit code: 0 when /m);
  }
});

test("run, compare, report through the binary: the all-TypeScript trio exits 0 three times and is the golden report", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const root = ["--root", "test/fixtures/fake-root"];
  const ran = lvrtc(runsDir, ["run", "test/fixtures/suites/fake-3-engines-ts.json", ...root]);
  assert.equal(ran.code, EXIT_OK, ran.err);

  const compared = lvrtc(runsDir, ["compare", "fake-3-engines-ts", ...root]);
  assert.equal(compared.code, EXIT_OK, compared.err);
  const directory = join(runsDir, "fake-3-engines-ts");
  assert.equal(
    compared.out,
    [
      "singlet       selftest  reference-vs-each  fake-a     fake-near  PASS",
      "singlet       selftest  reference-vs-each  fake-a     fake-none  UNSUPPORTED  fake-none is unsupported (quantity selftest.echo)",
      "singlet       selftest  pairwise           fake-a     fake-near  PASS",
      "singlet       selftest  pairwise           fake-a     fake-none  UNSUPPORTED  fake-none is unsupported (quantity selftest.echo)",
      "singlet       selftest  pairwise           fake-near  fake-none  UNSUPPORTED  fake-none is unsupported (quantity selftest.echo)",
      "double-gauss  selftest  reference-vs-each  fake-a     fake-near  PASS",
      "double-gauss  selftest  reference-vs-each  fake-a     fake-none  UNSUPPORTED  fake-none is unsupported (quantity selftest.echo)",
      "double-gauss  selftest  pairwise           fake-a     fake-near  PASS",
      "double-gauss  selftest  pairwise           fake-a     fake-none  UNSUPPORTED  fake-none is unsupported (quantity selftest.echo)",
      "double-gauss  selftest  pairwise           fake-near  fake-none  UNSUPPORTED  fake-none is unsupported (quantity selftest.echo)",
      "fake-3-engines-ts: 10 pairs: 4 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 6 UNSUPPORTED, 0 BLOCKED, 0 ERROR",
      `comparisons: ${join(directory, COMPARISONS_FILE)}`,
      "",
    ].join("\n"),
  );

  const reported = lvrtc(runsDir, ["report", "fake-3-engines-ts", ...root]);
  assert.equal(reported.code, EXIT_OK, reported.err);
  assert.equal(
    reported.out,
    `report: ${join(directory, REPORT_MARKDOWN_FILE)}\nreport: ${join(directory, REPORT_JSON_FILE)}\n`,
  );
  assert.equal(
    readFileSync(join(directory, REPORT_MARKDOWN_FILE), "utf8"),
    readFileSync(goldenFile("fake-3-engines-ts"), "utf8"),
  );
  assert.equal(JSON.parse(readFileSync(join(directory, REPORT_JSON_FILE), "utf8")).kind, "report");
});

test("compare exits 1 when a pair is FAIL or ERROR, and report still writes the report and exits 0", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const ran = lvrtc(runsDir, ["run", suiteFile("fake-faults"), "--root", FAULT_ROOT]);
  assert.equal(ran.code, EXIT_FAILURE);
  const compared = lvrtc(runsDir, ["compare", "fake-faults", "--root", FAULT_ROOT]);
  assert.equal(compared.code, EXIT_FAILURE, compared.err);
  assert.match(
    compared.out,
    /^fake-faults: 18 pairs: 0 PASS, 0 FLOOR, 4 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 14 ERROR$/m,
  );
  assert.ok(existsSync(join(runsDir, "fake-faults", COMPARISONS_FILE)));
  const reported = lvrtc(runsDir, ["report", "fake-faults", "--root", FAULT_ROOT]);
  assert.equal(reported.code, EXIT_OK, reported.err);
  assert.equal(
    readFileSync(join(runsDir, "fake-faults", REPORT_MARKDOWN_FILE), "utf8"),
    readFileSync(goldenFile("fake-faults"), "utf8"),
  );
});

// ── Exit codes ───────────────────────────────────────────────────────────────────────────────────────────────────

test("FAIL alone exits 1, ERROR alone exits 1, and UNSUPPORTED alone exits 0", async (t) => {
  const fail = await pairRun(t, "fake-a,fake-b");
  assert.equal((await inProcess(fail, ["compare", "fake-pair"])).code, EXIT_FAILURE);

  const unsupported = await pairRun(t, "fake-a,fake-none");
  const ended = await inProcess(unsupported, ["compare", "fake-pair"]);
  assert.equal(ended.code, EXIT_OK);
  assert.match(
    ended.out,
    /: 4 pairs: 0 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 4 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
  );

  // An answer that has gone from the store is an ERROR.
  const missing = await pairRun(t, "fake-a,fake-near");
  assert.equal((await inProcess(missing, ["compare", "fake-pair"])).code, EXIT_OK);
  rmSync(join(missing, STORE_DIRECTORY), { recursive: true });
  const gone = await inProcess(missing, ["compare", "fake-pair"]);
  assert.equal(gone.code, EXIT_FAILURE);
  assert.match(gone.out, / ERROR {2}fake-a has no result \(its result is not in the store\); fake-near has no result /);
});

test("a run that was never made, and a suite that was never run, are usage errors and nothing is written", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  for (const command of ["compare", "report"]) {
    const ended = await inProcess(runsDir, [command, "fake-pair"]);
    assert.equal(ended.code, EXIT_USAGE);
    assert.equal(ended.out, "");
    assert.match(
      ended.err,
      new RegExp(`^lvrtc ${command}: no run of "fake-pair" was found: there is no manifest\\.json in `),
    );
    assert.match(ended.err, /; run lvrtc run first\nUsage: lvrtc /);
  }
  assert.equal(existsSync(runsDir), false);
});

test("the command lines that are not the synopsis are usage errors", async (t) => {
  const runsDir = await pairRun(t);
  const cases: [string[], string][] = [
    [["compare"], "lvrtc compare: no suite name or run directory was given\n"],
    [["compare", "a", "b"], "lvrtc compare: more than one suite or run directory was given: a, b\n"],
    [["compare", "fake-pair", "--frob"], 'lvrtc compare: unknown option "--frob"\n'],
    [["compare", "fake-pair", "--mode"], "lvrtc compare: --mode needs a value\n"],
    [
      ["compare", "fake-pair", "--mode", "all"],
      "lvrtc compare: --mode all: the modes are reference-vs-each, pairwise, both\n",
    ],
    [
      ["compare", "fake-pair", "--reference", "a", "--reference", "b"],
      "lvrtc compare: --reference is given more than once\n",
    ],
    [["compare", "fake-pair", "--root", "no-such-dir"], "lvrtc compare: --root no-such-dir: not a directory\n"],
    [
      ["compare", "fake-pair", "--reference", "optiland"],
      'lvrtc compare: unknown engine "optiland": the run has fake-a, fake-near, fake-none\n',
    ],
    [["report"], "lvrtc report: no suite name or run directory was given\n"],
    [["report", "fake-pair", "--json"], 'lvrtc report: unknown option "--json"\n'],
    [["report", "fake-pair", "--root"], "lvrtc report: --root needs a value\n"],
  ];
  for (const [args, message] of cases) {
    const ended = await inProcess(runsDir, args);
    assert.equal(ended.code, EXIT_USAGE, args.join(" "));
    assert.equal(ended.out, "");
    assert.equal(ended.err, message + (args[0] === "compare" ? COMPARE_SYNOPSIS : REPORT_SYNOPSIS));
  }
  assert.equal(existsSync(join(runsDir, "fake-pair", COMPARISONS_FILE)), false);
});

// ── Options ──────────────────────────────────────────────────────────────────────────────────────────────────────

test("--reference and --mode choose what is compared, and --json prints the file that is written", async (t) => {
  const runsDir = await pairRun(t);
  const ended = await inProcess(runsDir, [
    "compare",
    "fake-pair",
    "--reference",
    "fake-near",
    "--mode",
    "reference-vs-each",
    "--json",
  ]);
  assert.equal(ended.code, EXIT_OK, ended.err);
  const printed: ComparisonFile = JSON.parse(ended.out);
  assert.deepEqual(printed, comparisonsOf(runsDir));
  assert.deepEqual(
    printed.comparisons.map((set) => [set.run, set.mode, set.reference, set.pairs.map((pair) => pair.b)]),
    [
      ["singlet", "reference-vs-each", "fake-near", ["fake-a", "fake-none"]],
      ["double-gauss", "reference-vs-each", "fake-near", ["fake-a", "fake-none"]],
    ],
  );
  // Sorted keys at every depth, indented, and one newline at the end.
  assert.ok(ended.out.startsWith('{\n  "comparisons": [\n    {\n      "caseId": '));
  assert.ok(ended.out.endsWith("\n}\n"));

  const pairwise = await inProcess(runsDir, ["compare", "fake-pair", "--mode", "pairwise"]);
  assert.deepEqual(
    comparisonsOf(runsDir).comparisons.map((set) => set.mode),
    ["pairwise", "pairwise"],
  );
  assert.match(pairwise.out, /^fake-pair: 6 pairs: /m);
  const both = await inProcess(runsDir, ["compare", "fake-pair", "--mode", "both"]);
  assert.match(both.out, /^fake-pair: 10 pairs: /m);
});

test("the comparisons file is canonical JSON and the same bytes each time it is written", async (t) => {
  const runsDir = await pairRun(t);
  const file = join(runsDir, "fake-pair", COMPARISONS_FILE);
  await inProcess(runsDir, ["compare", "fake-pair"]);
  const text = readFileSync(file, "utf8");
  await inProcess(runsDir, ["compare", "fake-pair"]);
  assert.equal(readFileSync(file, "utf8"), text);
  assert.ok(text.startsWith('{"comparisons":[{"caseId":"') && text.endsWith("}\n") && !text.includes(runsDir));
  assert.equal(JSON.parse(text).kind, "comparison-file");
});

test("a run is named by its suite or by its directory, absolute or relative to the working directory", async (t) => {
  const runsDir = await pairRun(t);
  const directory = join(runsDir, "fake-pair");
  const written = (): string => {
    const text = readFileSync(join(directory, COMPARISONS_FILE), "utf8");
    rmSync(join(directory, COMPARISONS_FILE));
    return text;
  };
  assert.equal((await inProcess(runsDir, ["compare", "fake-pair"])).code, EXIT_OK);
  const byName = written();
  // By directory the runs directory of the configuration is not needed: the store is the one beside the run.
  assert.equal((await inProcess(join(runsDir, "unused"), ["compare", directory])).code, EXIT_OK);
  assert.equal(written(), byName);
  const cwd = dirname(runsDir);
  assert.equal((await inProcess("unused", ["compare", relative(cwd, directory)], cwd)).code, EXIT_OK);
  assert.equal(written(), byName);
  // A bare name that is no suite of the runs directory is a directory of the working directory.
  assert.equal((await inProcess(join(runsDir, "unused"), ["compare", "fake-pair"], runsDir)).code, EXIT_OK);
  assert.equal(written(), byName);

  assert.equal((await inProcess(runsDir, ["compare", "fake-pair"])).code, EXIT_OK);
  assert.equal((await inProcess("unused", ["report", directory])).code, EXIT_OK);
  assert.ok(existsSync(join(directory, REPORT_MARKDOWN_FILE)));
});

// ── report ───────────────────────────────────────────────────────────────────────────────────────────────────────

test("report needs comparisons that were made from the manifest and the policy at hand", async (t) => {
  const runsDir = await pairRun(t);
  const directory = join(runsDir, "fake-pair");
  const refused = async (message: RegExp): Promise<void> => {
    const ended = await inProcess(runsDir, ["report", "fake-pair"]);
    assert.equal(ended.code, EXIT_USAGE);
    assert.equal(ended.out, "");
    assert.match(ended.err, message);
    assert.equal(existsSync(join(directory, REPORT_MARKDOWN_FILE)), false);
    assert.equal(existsSync(join(directory, REPORT_JSON_FILE)), false);
  };
  await refused(/^lvrtc report: .*fake-pair: no comparisons\.json is there; run lvrtc compare first\n/);

  assert.equal((await inProcess(runsDir, ["compare", "fake-pair"])).code, EXIT_OK);
  // The suite is run again on other engines: the comparisons are of the run before.
  assert.equal((await inProcess(runsDir, ["run", FAKE_PAIR_SUITE, "--engines", "fake-a,fake-none"])).code, EXIT_OK);
  await refused(/fake-pair: the comparisons were made from another manifest; run lvrtc compare again\n/);

  writeFileSync(join(directory, COMPARISONS_FILE), "{ cut short");
  await refused(/comparisons\.json: malformed JSON\n/);
  writeFileSync(join(directory, MANIFEST_FILE), "{}");
  await refused(/manifest\.json: not a run manifest: \/kind: expected "run-manifest"\n/);
});

test("report refuses comparisons judged by another policy than the one it is given", async (t) => {
  const runsDir = await pairRun(t);
  assert.equal((await inProcess(runsDir, ["compare", "fake-pair"])).code, EXIT_OK);
  const policy = { ...loadPolicy(), version: loadPolicy().version + 1 };
  const command = createReportCommand({ rootDir: FAKE_ROOT, cwd: REPO_ROOT, env: { LVRTC_RUNS_DIR: runsDir }, policy });
  const err: string[] = [];
  const io = { stdout: () => {}, stderr: (text: string) => void err.push(text) };
  assert.equal(await runCli(["report", "fake-pair"], io, [command]), EXIT_USAGE);
  assert.match(err.join(""), /the comparisons were judged by another policy; run lvrtc compare again\n/);

  // With that policy on both sides the report is written, and names its version.
  const compare = createCompareCommand({
    rootDir: FAKE_ROOT,
    cwd: REPO_ROOT,
    env: { LVRTC_RUNS_DIR: runsDir },
    policy,
  });
  assert.equal(await runCli(["compare", "fake-pair"], { ...io, stderr: () => {} }, [compare]), EXIT_OK);
  assert.equal(await runCli(["report", "fake-pair"], io, [command]), EXIT_OK);
  const written = readFileSync(join(runsDir, "fake-pair", REPORT_MARKDOWN_FILE), "utf8");
  assert.ok(written.includes(`\n| Policy | rungs v${policy.version} |\n`), written);
});

test("the report is the same bytes each time it is written, and report.json is canonical", async (t) => {
  const runsDir = await pairRun(t);
  const directory = join(runsDir, "fake-pair");
  await inProcess(runsDir, ["compare", "fake-pair"]);
  await inProcess(runsDir, ["report", "fake-pair"]);
  const first = [REPORT_JSON_FILE, REPORT_MARKDOWN_FILE].map((file) => readFileSync(join(directory, file), "utf8"));
  await inProcess(runsDir, ["report", "fake-pair"]);
  assert.deepEqual(
    [REPORT_JSON_FILE, REPORT_MARKDOWN_FILE].map((file) => readFileSync(join(directory, file), "utf8")),
    first,
  );
  assert.ok(first[0].startsWith('{"contract":"1.0","engines":[') && first[0].endsWith("}\n"));
  assert.ok(first[1].startsWith("# Comparison report: fake-pair\n"));
});
