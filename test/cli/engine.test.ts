// `lvrtc engine conformance`: the command line, what it prints and how it exits. What the kit checks is tested in
// test/engines/conformance.test.ts.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createEngineCommand } from "../../src/cli/commands/engine.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { BUILTIN_ENGINES } from "../../src/engines/builtin.ts";
import { tempDir } from "../core/support.ts";
import { STDIO_FAKE_ENGINE } from "../engines/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));
const SYNOPSIS = "Usage: lvrtc engine conformance <id> [--root <dir>] [--json]\n";

function inProcess(options: Record<string, unknown>): Record<string, unknown> {
  return { transport: "in-process", module: FAKE_ENGINE, options };
}

/** A configuration root that defines these engines, with the fake engine as a stdio worker beside it. */
function rootWith(t: TestContext, engines: unknown): string {
  const rootDir = join(tempDir(t), "root");
  const files = {
    [CONFIG_FILE]: JSON.stringify({ engines }),
    "bin/worker.mjs": `import ${JSON.stringify(pathToFileURL(STDIO_FAKE_ENGINE).href)};\n`,
  };
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(dirname(join(rootDir, name)), { recursive: true });
    writeFileSync(join(rootDir, name), text);
  }
  return rootDir;
}

const ENGINES = {
  good: inProcess({ id: "good" }),
  biased: inProcess({ id: "biased", bias: 0.001 }),
  none: inProcess({ id: "none", offersQuantities: false }),
  renamed: inProcess({ id: "someone-else" }),
  absent: { transport: "in-process", module: "nowhere.ts" },
  worker: { transport: "stdio", command: [process.execPath, "${root}/bin/worker.mjs"], options: { id: "worker" } },
  unstarted: { transport: "stdio", command: ["lvrtc-no-such-command"] },
};

/** Runs the command in this process, wired to the given root and working directory. */
async function engine(
  args: readonly string[],
  inputs: { rootDir: string; cwd?: string },
): Promise<{ code: number; out: string; err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createEngineCommand({ rootDir: inputs.rootDir, env: {}, cwd: inputs.cwd ?? inputs.rootDir });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(["engine", ...args], io, [command]);
  return { code, out: out.join(""), err: err.join("") };
}

test("engine is a registered command, and --help says what conformance checks", async () => {
  assert.ok(COMMANDS.some((command) => command.name === "engine"));
  const help = spawnSync(process.execPath, [BIN, "engine", "--help"], { encoding: "utf8", cwd: REPO_ROOT });
  assert.equal(help.status, EXIT_OK);
  assert.ok(help.stdout.startsWith(SYNOPSIS));
  assert.match(help.stdout, /PASS, FAIL or SKIPPED with a reason/);
  const list = spawnSync(process.execPath, [BIN, "--help"], { encoding: "utf8", cwd: REPO_ROOT });
  assert.match(list.stdout, /^ {2}engine {3}Check that an engine conforms to the contract$/m);
});

test("an engine that conforms: a line per check, a count, exit 0", async (t) => {
  const rootDir = rootWith(t, ENGINES);
  const ended = await engine(["conformance", "good"], { rootDir });
  assert.equal(ended.code, EXIT_OK, ended.err);
  assert.equal(ended.err, "");
  const lines = ended.out.split("\n");
  assert.equal(lines.at(-1), "");
  assert.equal(lines.at(-2), "good: conforms: 15 passed, 0 failed, 0 skipped");
  assert.equal(lines.length, 17);
  assert.equal(
    lines[0],
    "PASS     hello                        the engine answered hello with a valid engine descriptor",
  );
  assert.equal(
    lines[3],
    'PASS     unknown-quantity             conformance.no-such-quantity is answered "unsupported"',
  );
  for (const line of lines.slice(0, 15)) assert.match(line, /^PASS {5}[a-z.-]+ +\S/);
});

test("the same over stdio: the worker is started from the configuration and ends cleanly", async (t) => {
  const rootDir = rootWith(t, ENGINES);
  const ended = await engine(["conformance", "worker"], { rootDir });
  assert.equal(ended.code, EXIT_OK, ended.out + ended.err);
  assert.match(ended.out, /^PASS {5}shutdown +the worker ended by itself with exit code 0$/m);
  assert.match(ended.out, /^worker: conforms: 15 passed, 0 failed, 0 skipped$/m);
});

test("the built-in engine ref conforms under a root that defines no engine; it offers no selftest.echo", async (t) => {
  const ended = await engine(["conformance", "ref"], { rootDir: rootWith(t, {}) });
  assert.equal(ended.code, EXIT_OK, ended.out + ended.err);
  assert.equal(ended.err, "");
  assert.match(ended.out, /^PASS {5}engine-id +the descriptor names ref$/m);
  assert.match(ended.out, /^PASS {5}unknown-quantity +conformance\.no-such-quantity is answered "unsupported"$/m);
  assert.match(ended.out, /^PASS {5}malformed-run +a run whose request has no spec is refused with ok: false$/m);
  assert.match(ended.out, /^SKIPPED {2}echo\.matrix +the engine does not offer selftest\.echo$/m);
  assert.match(ended.out, /^PASS {5}deterministic /m);
  assert.match(ended.out, /^ref: conforms: 8 passed, 0 failed, 7 skipped$/m);
});

test("an engine that does not conform exits 1 and says which checks failed and why", async (t) => {
  const rootDir = rootWith(t, ENGINES);
  const biased = await engine(["conformance", "biased"], { rootDir });
  assert.equal(biased.code, EXIT_FAILURE);
  assert.match(biased.out, /^FAIL {5}echo\.scalar +the values are not the expected bytes: got /m);
  assert.match(biased.out, /^PASS {5}echo\.empty /m);
  assert.match(biased.out, /^biased: does not conform: 9 passed, 6 failed, 0 skipped$/m);

  // An engine that is configured and cannot be built, started or recognised is a failed check, not a usage error.
  const absent = await engine(["conformance", "absent"], { rootDir });
  assert.equal(absent.code, EXIT_FAILURE);
  assert.match(
    absent.out,
    /^FAIL {5}hello +engine absent is unavailable \(load-failed\): its module nowhere\.ts does not exist$/m,
  );
  assert.match(absent.out, /^absent: does not conform: 0 passed, 1 failed, 7 skipped$/m);
  const unstarted = await engine(["conformance", "unstarted"], { rootDir });
  assert.equal(unstarted.code, EXIT_FAILURE);
  assert.match(unstarted.out, /^FAIL {5}hello +engine unstarted is unavailable \(spawn-failed\)/m);
  const renamed = await engine(["conformance", "renamed"], { rootDir });
  assert.equal(renamed.code, EXIT_FAILURE);
  assert.match(renamed.out, /^FAIL {5}engine-id +engine renamed is unavailable \(id-mismatch\)/m);
});

test("skipped checks do not fail an engine, and are counted", async (t) => {
  const ended = await engine(["conformance", "none"], { rootDir: rootWith(t, ENGINES) });
  assert.equal(ended.code, EXIT_OK);
  assert.match(ended.out, /^SKIPPED {2}echo\.matrix +the engine does not offer selftest\.echo$/m);
  assert.match(ended.out, /^none: conforms: 8 passed, 0 failed, 7 skipped$/m);
});

test("--json prints the report as one object with sorted keys", async (t) => {
  const rootDir = rootWith(t, ENGINES);
  const ended = await engine(["conformance", "biased", "--json"], { rootDir });
  assert.equal(ended.code, EXIT_FAILURE);
  const report = JSON.parse(ended.out);
  assert.equal(ended.out, `${JSON.stringify(report, null, 2)}\n`);
  assert.deepEqual(Object.keys(report), ["checks", "engine", "passed"]);
  assert.equal(report.engine, "biased");
  assert.equal(report.passed, false);
  assert.equal(report.checks.length, 15);
  assert.deepEqual(Object.keys(report.checks[0]), ["detail", "id", "status"]);
  assert.deepEqual(report.checks[0], {
    detail: "the engine answered hello with a valid engine descriptor",
    id: "hello",
    status: "pass",
  });
  const good = await engine(["conformance", "--json", "good"], { rootDir });
  assert.equal(good.code, EXIT_OK);
  assert.equal(JSON.parse(good.out).passed, true);
});

test("--root names the configuration root, relative to the working directory", async (t) => {
  const rootDir = rootWith(t, ENGINES);
  const elsewhere = rootWith(t, {});
  for (const root of [["--root", "../root"], ["--root=../root"]]) {
    const ended = await engine(["conformance", "good", ...root], { rootDir: elsewhere, cwd: rootDir });
    assert.equal(ended.code, EXIT_OK, ended.err);
    assert.match(ended.out, /^good: conforms: /m);
  }

  const missing = await engine(["conformance", "good", "--root", "no-such-directory"], { rootDir });
  assert.equal(missing.code, EXIT_USAGE);
  assert.equal(missing.err, "lvrtc engine: --root no-such-directory: not a directory\n");
  assert.equal(missing.out, "");
});

test("an engine that is neither configured nor built in is a usage error that lists the engines there are", async (t) => {
  const builtin = Object.keys(BUILTIN_ENGINES).sort().join(", ");
  const ended = await engine(["conformance", "optiland"], { rootDir: rootWith(t, ENGINES) });
  assert.equal(ended.code, EXIT_USAGE);
  assert.equal(ended.out, "");
  assert.equal(
    ended.err,
    'lvrtc engine: unknown engine "optiland": the configuration defines ' +
      `absent, biased, good, none, renamed, unstarted, worker; built in: ${builtin}\n`,
  );
  const empty = await engine(["conformance", "good"], { rootDir: rootWith(t, {}) });
  assert.equal(empty.code, EXIT_USAGE);
  assert.equal(
    empty.err,
    `lvrtc engine: unknown engine "good": the configuration defines no engine; built in: ${builtin}\n`,
  );
  // A name every object inherits a member for is an engine id like any other, and not defined.
  const inherited = await engine(["conformance", "constructor"], { rootDir: rootWith(t, ENGINES) });
  assert.equal(inherited.code, EXIT_USAGE);
});

test("a command line that is not the synopsis is a usage error that shows it", async (t) => {
  const rootDir = rootWith(t, ENGINES);
  const cases: [string[], string][] = [
    [[], "no action was named: there is conformance"],
    [["describe", "good"], 'unknown action "describe": there is conformance'],
    [["good"], 'unknown action "good": there is conformance'],
    [["conformance"], "no engine was named"],
    [["conformance", "good", "biased"], "more than one engine was named: good, biased"],
    [["conformance", "good", "--verbose"], 'unknown option "--verbose"'],
    [["conformance", "good", "--root"], "--root needs a value"],
    [["conformance", "good", "--root", "--json"], "--root needs a value"],
    [["conformance", "good", "--root", "a", "--root", "b"], "--root is given more than once"],
    [["conformance", "good", "--root="], "--root needs a value"],
    [["conformance", "good", "--json=1"], 'unknown option "--json=1"'],
  ];
  for (const [args, problem] of cases) {
    const ended = await engine(args, { rootDir });
    assert.equal(ended.code, EXIT_USAGE, args.join(" "));
    assert.equal(ended.err, `lvrtc engine: ${problem}\n${SYNOPSIS}`);
    assert.equal(ended.out, "");
  }
  const help = await engine(["conformance", "good", "--help"], { rootDir });
  assert.equal(help.code, EXIT_OK);
  assert.ok(help.out.startsWith(SYNOPSIS));
});

test("a configuration file that cannot be used is an error, exit 1, as for doctor", async (t) => {
  const rootDir = rootWith(t, { good: { transport: "carrier-pigeon" } });
  const ended = await engine(["conformance", "good"], { rootDir });
  assert.equal(ended.code, EXIT_FAILURE);
  assert.match(ended.err, /^lvrtc engine: .*"engines\.good\.transport" must be "in-process" or "stdio"\n$/);
});
