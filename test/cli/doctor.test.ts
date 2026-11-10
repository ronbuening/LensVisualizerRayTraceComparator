import assert from "node:assert/strict";
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import packageJson from "../../package.json" with { type: "json" };
import {
  createDoctorCommand,
  systemProbe,
  type CommandResult,
  type DoctorLvBinding,
  type DoctorOptilandEngine,
  type DoctorProbe,
} from "../../src/cli/commands/doctor.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { CONFIG_FILE, LOCAL_CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { FAKE_ENGINE_FILES, closureOf, freshLv } from "../engines/lv/support.ts";

const LV = "/checkouts/lv";
const OPTILAND_PYTHON = "/checkouts/optiland/.venv/bin/python";
const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const CLOSURE = "c0ffee".repeat(10) + "abcd";
const GIT_TOP = `git -C ${LV} rev-parse --show-toplevel`;
const GIT_HEAD = `git -C ${LV} rev-parse HEAD`;
const GIT_STATUS = `git --no-optional-locks -C ${LV} status --porcelain -- .`;
const FINGERPRINT = "f".repeat(64);
const REVISION = "a".repeat(64);
const ENGINE_DETAILS = {
  commit: "e".repeat(40),
  dirty: true,
  jit: true,
  numba: "9.3",
  numpy: "9.1",
  python: "3.12.7",
  scipy: "9.2",
  sourceFiles: 7,
  sourceHash: "5".repeat(64),
};
const OPTILAND_SCRIPT = "import importlib.metadata as m; print(m.version('optiland'))";

/** A scripted machine: the files that exist and what each command line answers. Unlisted commands cannot start. */
interface Machine {
  nodeVersion: string;
  files: string[];
  commands: Record<string, CommandResult | null>;
  /** What loading LensVisualizer through the binding answers. */
  binding: DoctorLvBinding;
  /** What starting the engine `optiland` and asking it who it is answers. */
  engine: DoctorOptilandEngine;
}

function ok(stdout: string): CommandResult {
  return { status: 0, stdout, stderr: "" };
}

function failed(stderr: string): CommandResult {
  return { status: 1, stdout: "", stderr };
}

/** A machine with LensVisualizer, Python and optiland all in place. */
function healthyMachine(): Machine {
  return {
    nodeVersion: "24.15.0",
    files: [`${LV}/src/optics/buildLens.ts`],
    commands: {
      [GIT_TOP]: ok(`${LV}\n`),
      [GIT_HEAD]: ok(`${COMMIT}\n`),
      [GIT_STATUS]: ok(""),
      "python3 --version": ok("Python 3.13.1\n"),
      [`${OPTILAND_PYTHON} --version`]: ok("Python 3.12.7\n"),
      [`${OPTILAND_PYTHON} -c ${OPTILAND_SCRIPT}`]: ok("0.6.2\n"),
    },
    binding: { status: "loaded", engineFileCount: 141, engineClosureHash: CLOSURE },
    engine: { status: "available", fingerprint: FINGERPRINT, adapterRevision: REVISION, details: ENGINE_DETAILS },
  };
}

interface Run {
  readonly code: number;
  readonly out: string;
  readonly err: string;
  /** Every command line the probe was asked to run, in order. */
  readonly ran: readonly string[];
}

/** Runs `lvrtc doctor` through the real dispatcher against a scripted machine and a temporary root directory. */
async function runDoctor(
  t: TestContext,
  machine: Machine,
  options: { args?: string[]; config?: unknown; local?: unknown; env?: Record<string, string> } = {},
): Promise<Run & { rootDir: string }> {
  const rootDir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-doctor-")));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const config = options.config ?? { lvPath: LV, engines: { optiland: { python: OPTILAND_PYTHON } } };
  writeFileSync(join(rootDir, CONFIG_FILE), typeof config === "string" ? config : JSON.stringify(config));
  if (options.local !== undefined) writeFileSync(join(rootDir, LOCAL_CONFIG_FILE), JSON.stringify(options.local));

  const ran: string[] = [];
  const probe: DoctorProbe = {
    nodeVersion: () => machine.nodeVersion,
    exists: (path) => machine.files.includes(path),
    run: (command, args) => {
      const line = [command, ...args].join(" ");
      ran.push(line);
      return machine.commands[line] ?? null;
    },
    lvBinding: async (path) => {
      ran.push(`binding ${path}`);
      return machine.binding;
    },
    optilandEngine: async (loaded) => {
      ran.push(`engine optiland ${loaded.config.engines.optiland.python}`);
      return machine.engine;
    },
  };
  const out: string[] = [];
  const err: string[] = [];
  const code = await runCli(
    ["doctor", ...(options.args ?? [])],
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    [createDoctorCommand({ rootDir, env: options.env ?? {}, probe })],
  );
  return { code, out: out.join(""), err: err.join(""), ran, rootDir };
}

function assertKeysSorted(value: unknown, path = "$"): void {
  if (typeof value !== "object" || value === null) return;
  const keys = Object.keys(value);
  assert.deepEqual(keys, [...keys].sort(), `keys of ${path}`);
  for (const [key, child] of Object.entries(value)) assertKeysSorted(child, `${path}.${key}`);
}

test("doctor is a registered command", async () => {
  assert.ok(COMMANDS.some((command) => command.name === "doctor"));
  const out: string[] = [];
  assert.equal(await runCli(["--help"], { stdout: (text) => void out.push(text), stderr: () => {} }), EXIT_OK);
  assert.match(out.join(""), /^ {2}doctor +Say whether this machine is ready to check LensVisualizer/m);
});

test("everything present: the full report, exit 0", async (t) => {
  const run = await runDoctor(t, healthyMachine());
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.equal(
    run.out,
    [
      "Node",
      "  version   24.15.0",
      `  required  ${packageJson.engines.node}`,
      "  status    ok",
      "",
      "Config",
      `  lvPath                   ${LV}  [lvrtc.config.json]`,
      "  python                   python3  [default]",
      `  engines.optiland.python  ${OPTILAND_PYTHON}  [lvrtc.config.json]`,
      `  cacheDir                 ${join(run.rootDir, ".cache")}  [default]`,
      `  runsDir                  ${join(run.rootDir, "runs")}  [default]`,
      "",
      "LensVisualizer",
      `  path    ${LV}`,
      "  status  present",
      `  git     ${COMMIT} (clean)`,
      "  engine  loads (141 files)",
      "",
      "Python",
      "  role     runs the Python engines a configuration defines, such as the demonstration engines under",
      "           test/fixtures/fake-root; checking LensVisualizer does not need it (optiland has an interpreter of its own)",
      "  command  python3",
      "  version  Python 3.13.1",
      "",
      "optiland",
      `  python       ${OPTILAND_PYTHON}`,
      "  interpreter  present (Python 3.12.7)",
      "  version      0.6.2",
      "  engine       answers",
      `  git          ${"e".repeat(40)} (dirty)`,
      "  sources      7 files",
      "  versions     Python 3.12.7, numpy 9.1, scipy 9.2, numba 9.3",
      "  jit          on",
      "",
      "Ready",
      "  LensVisualizer  ready",
      "  optiland        ready",
      "  lvrtc check-lv  ready: it runs every check",
      "  Ready to check LensVisualizer: lvrtc check-lv can run.",
      "",
    ].join("\n"),
  );
  assert.doesNotMatch(run.out, new RegExp(`${CLOSURE}|${FINGERPRINT}|${REVISION}|${"5".repeat(64)}`), "no hash");

  // --details adds the hashes: of LensVisualizer's engine files, and of optiland's code, sources and this tool's code.
  const detailed = await runDoctor(t, healthyMachine(), { args: ["--details"] });
  assert.equal(detailed.code, EXIT_OK);
  assert.ok(
    detailed.out.includes(
      [
        "LensVisualizer",
        `  path        ${LV}`,
        "  status      present",
        `  git         ${COMMIT} (clean)`,
        "  engine      loads (141 files)",
        `  files hash  ${CLOSURE}`,
        "",
      ].join("\n"),
    ),
    detailed.out,
  );
  assert.ok(
    detailed.out.includes(
      [
        "  engine       answers",
        `  code hash    ${FINGERPRINT}`,
        `  git          ${"e".repeat(40)} (dirty)`,
        `  sources      7 files, hash ${"5".repeat(64)}`,
        "  versions     Python 3.12.7, numpy 9.1, scipy 9.2, numba 9.3",
        "  jit          on",
        `  tool code    ${REVISION}`,
        "",
      ].join("\n"),
    ),
    detailed.out,
  );
});

test("the probes only read: the exact commands run", async (t) => {
  const run = await runDoctor(t, healthyMachine());
  assert.deepEqual(run.ran, [
    GIT_TOP,
    GIT_HEAD,
    GIT_STATUS,
    `binding ${LV}`,
    "python3 --version",
    `${OPTILAND_PYTHON} --version`,
    `${OPTILAND_PYTHON} -c ${OPTILAND_SCRIPT}`,
    `engine optiland ${OPTILAND_PYTHON}`,
  ]);
});

test("a dirty LensVisualizer checkout is flagged", async (t) => {
  const machine = healthyMachine();
  machine.commands[GIT_STATUS] = ok(" M src/optics/buildLens.ts\n");
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.match(run.out, new RegExp(`^  git     ${COMMIT} \\(dirty\\)$`, "m"));
});

test("LensVisualizer outside git is present without a commit", async (t) => {
  const machine = healthyMachine();
  machine.commands[GIT_TOP] = failed("fatal: not a git repository\n");
  const run = await runDoctor(t, machine, { args: ["--json"] });
  assert.equal(run.code, EXIT_OK);
  assert.deepEqual(JSON.parse(run.out).lensVisualizer, {
    binding: { engineClosureHash: CLOSURE, engineFileCount: 141, status: "loaded" },
    git: null,
    path: LV,
    status: "present",
  });
  assert.ok(!run.ran.some((line) => line.includes("rev-parse HEAD")));
  assert.ok(!run.ran.some((line) => line.includes("status --porcelain")));

  const text = await runDoctor(t, machine);
  assert.match(text.out, /^ {2}git {5}not a git checkout$/m);
});

test("LensVisualizer inside another repository reports the last commit that touched it, not that repository's HEAD", async (t) => {
  const machine = healthyMachine();
  machine.commands[GIT_TOP] = ok("/checkouts\n");
  machine.commands[`git -C ${LV} rev-list -1 HEAD -- .`] = ok(`${COMMIT}\n`);
  const run = await runDoctor(t, machine);
  assert.match(run.out, new RegExp(`^  git     ${COMMIT} \\(clean\\)$`, "m"));
  assert.ok(!run.ran.includes(GIT_HEAD), "HEAD of the enclosing repository is not asked for");

  // A directory that no commit of the enclosing repository has touched has no git state of its own.
  machine.commands[`git -C ${LV} rev-list -1 HEAD -- .`] = ok("");
  assert.match((await runDoctor(t, machine)).out, /^ {2}git {5}not a git checkout$/m);
});

test("a LensVisualizer that is present and cannot be loaded is reported, not a failure", async (t) => {
  const machine = healthyMachine();
  machine.binding = { status: "failed", code: "exports-missing", message: "lacks 1 of the exports" };
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.match(run.out, /^ {2}engine {2}not loadable \(exports-missing\): lacks 1 of the exports$/m);

  const json = JSON.parse((await runDoctor(t, machine, { args: ["--json"] })).out);
  assert.deepEqual(json.lensVisualizer.binding, {
    code: "exports-missing",
    message: "lacks 1 of the exports",
    status: "failed",
  });
});

test("LensVisualizer missing is reported, not a failure", async (t) => {
  const machine = healthyMachine();
  machine.files = [];
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.match(
    run.out,
    /^LensVisualizer\n {2}path {4}\/checkouts\/lv\n {2}status {2}missing\n {2}reason {2}src\/optics/m,
  );
  assert.ok(!run.ran.some((line) => line.startsWith("git ")), "git is not asked about a missing checkout");
  assert.ok(!run.ran.some((line) => line.startsWith("binding ")), "a missing checkout is not loaded");

  const json = await runDoctor(t, machine, { args: ["--json"] });
  assert.deepEqual(JSON.parse(json.out).lensVisualizer, { binding: null, git: null, path: LV, status: "missing" });
});

test("LensVisualizer and optiland not configured are reported, not a failure", async (t) => {
  const machine = healthyMachine();
  const run = await runDoctor(t, machine, { config: {} });
  assert.equal(run.code, EXIT_OK);
  assert.match(run.out, /^ {2}lvPath {19}\(not set\) {2}\[default\]$/m);
  assert.match(
    run.out,
    /^LensVisualizer\n {2}status {2}not configured\n {2}fix {5}Set lvPath in lvrtc\.local\.json \(or the environment variable LVRTC_LV_PATH\)/m,
  );
  assert.match(
    run.out,
    /^optiland\n {2}interpreter {2}not configured\n {2}fix {10}Set engines\.optiland\.python in lvrtc\.local\.json \(or LVRTC_OPTILAND_PYTHON\)/m,
  );
  assert.match(run.out, /^ {2}LensVisualizer {2}not ready \(not configured\)$/m);
  assert.match(
    run.out,
    /^ {2}optiland {8}not ready \(not configured\): lvrtc check-lv and lvrtc baseline check need it; lvrtc lenses, export,$/m,
  );
  assert.match(run.out, /^ {2}Not ready to check LensVisualizer: do what the fix lines above say\./m);
  assert.deepEqual(run.ran, ["python3 --version"]);
  // No lvrtc.local.json yet: the two fix lines that name it say how to make it, and the Ready section is as it was.
  const flat = (text: string): string => text.replace(/\s+/g, " ");
  const hint = "There is no lvrtc.local.json yet: make it by copying lvrtc.local.example.json, then set the key in it.";
  assert.equal(flat(run.out).split(hint).length - 1, 2);
  assert.ok(!flat(run.out.slice(run.out.indexOf("\nReady\n"))).includes(hint));
  // With an lvrtc.local.json, the fix lines say nothing of making one.
  const withLocal = await runDoctor(t, machine, { config: {}, local: {} });
  assert.equal(withLocal.code, EXIT_OK);
  assert.ok(!flat(withLocal.out).includes(hint));
  assert.match(
    flat(withLocal.out),
    /fix Set lvPath in lvrtc\.local\.json \(or the environment variable LVRTC_LV_PATH\)/,
  );

  const json = JSON.parse((await runDoctor(t, machine, { args: ["--json"], config: {} })).out);
  assert.deepEqual(json.ready, { checkLv: false, lensVisualizer: false, optiland: false });
  assert.deepEqual(json.lensVisualizer, { binding: null, git: null, path: null, status: "not configured" });
  assert.deepEqual(json.optiland, {
    engine: null,
    interpreter: "not configured",
    interpreterVersion: null,
    python: null,
    version: null,
  });
});

test("Python not found is reported, not a failure", async (t) => {
  const machine = healthyMachine();
  machine.commands["python3 --version"] = null;
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.match(
    run.out,
    /^ {2}command {2}python3\n {2}version {2}not found\n {2}fix {6}Set python in lvrtc\.local\.json \(or the environment variable LVRTC_PYTHON\)/m,
  );
});

test("optiland not importable is reported, not a failure", async (t) => {
  const machine = healthyMachine();
  machine.commands[`${OPTILAND_PYTHON} -c ${OPTILAND_SCRIPT}`] = failed("PackageNotFoundError: optiland\n");
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.match(run.out, /^ {2}interpreter {2}present \(Python 3\.12\.7\)\n {2}version {6}not importable$/m);

  const json = JSON.parse((await runDoctor(t, machine, { args: ["--json"] })).out);
  assert.deepEqual(json.optiland, {
    interpreter: "present",
    interpreterVersion: "Python 3.12.7",
    python: OPTILAND_PYTHON,
    version: null,
    engine: { adapterRevision: REVISION, details: ENGINE_DETAILS, fingerprint: FINGERPRINT, status: "available" },
  });
});

test("an optiland engine that cannot be used is reported with its code and reason, not a failure", async (t) => {
  const machine = healthyMachine();
  const message = "engine optiland is unavailable (hello-failed): the engine refused hello (engine-failure): no numba";
  machine.engine = { status: "unavailable", code: "hello-failed", message };
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.ok(
    run.out.includes(
      `  version      0.6.2\n  engine       unavailable (hello-failed): ${message}\n  fix          Set engines.optiland.python`,
    ),
    run.out,
  );
  assert.match(
    run.out,
    /^ {2}optiland {8}not ready \(the engine cannot be used: hello-failed\): lvrtc check-lv and lvrtc baseline check/m,
  );
  assert.match(run.out, /^ {18}- the engine optiland cannot be used \(hello-failed: /m);
  assert.match(run.out, /^ {2}LensVisualizer can be looked at now: /m);
  assert.doesNotMatch(run.out, /Ready to check LensVisualizer/);
  const json = JSON.parse((await runDoctor(t, machine, { args: ["--json"] })).out);
  assert.deepEqual(json.optiland.engine, { code: "hello-failed", message, status: "unavailable" });
});

test("an optiland that is not a git checkout, and details that are missing, are said as such", async (t) => {
  const machine = healthyMachine();
  machine.engine = { status: "available", fingerprint: FINGERPRINT, adapterRevision: null, details: { commit: null } };
  const run = await runDoctor(t, machine, { args: ["--details"] });
  assert.ok(
    run.out.includes(
      [
        "  engine       answers",
        `  code hash    ${FINGERPRINT}`,
        "  git          not a git checkout",
        "  sources      unknown files, hash unknown",
        "  versions     Python unknown, numpy unknown, scipy unknown, numba unknown",
        "  jit          unknown",
        "  tool code    none stated",
        "",
        "Ready",
      ].join("\n"),
    ),
    run.out,
  );
});

test("a missing optiland interpreter is reported and not asked for optiland", async (t) => {
  const machine = healthyMachine();
  machine.commands[`${OPTILAND_PYTHON} --version`] = null;
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.match(
    run.out,
    /^ {2}interpreter {2}missing\n {2}fix {10}Set engines\.optiland\.python in lvrtc\.local\.json/m,
  );
  assert.match(run.out, /^ {2}optiland {8}not ready \(its interpreter does not run\)/m);
  assert.ok(!run.ran.some((line) => line.includes(" -c ") || line.startsWith("engine ")));
});

test("a Node version out of range exits 1 and still prints the report", async (t) => {
  for (const nodeVersion of ["24.14.9", "22.18.0", "25.0.0", "26.1.0", "not-a-version"]) {
    const run = await runDoctor(t, { ...healthyMachine(), nodeVersion });
    assert.equal(run.code, EXIT_FAILURE, nodeVersion);
    assert.match(run.out, /^ {2}status {4}out of range$/m);
    assert.match(run.out, /^ {2}interpreter {2}present/m);
    assert.equal(
      run.err,
      `lvrtc doctor: Node ${nodeVersion} is outside the supported range ${packageJson.engines.node}\n`,
    );
  }
  for (const nodeVersion of ["24.15.0", "24.15.1", "24.16.0", "24.99.99"]) {
    assert.equal((await runDoctor(t, { ...healthyMachine(), nodeVersion })).code, EXIT_OK, nodeVersion);
  }
});

test("--json prints one stable object with sorted keys", async (t) => {
  const run = await runDoctor(t, healthyMachine(), { args: ["--json"], env: { LVRTC_PYTHON: "python3" } });
  assert.equal(run.code, EXIT_OK);
  const expected = {
    config: {
      cacheDir: { source: "default", value: join(run.rootDir, ".cache") },
      "engines.optiland.python": { source: "lvrtc.config.json", value: OPTILAND_PYTHON },
      lvPath: { source: "lvrtc.config.json", value: LV },
      python: { source: "env", value: "python3" },
      runsDir: { source: "default", value: join(run.rootDir, "runs") },
    },
    lensVisualizer: {
      binding: { engineClosureHash: CLOSURE, engineFileCount: 141, status: "loaded" },
      git: { commit: COMMIT, dirty: false },
      path: LV,
      status: "present",
    },
    node: { ok: true, required: packageJson.engines.node, version: "24.15.0" },
    optiland: {
      engine: { adapterRevision: REVISION, details: ENGINE_DETAILS, fingerprint: FINGERPRINT, status: "available" },
      interpreter: "present",
      interpreterVersion: "Python 3.12.7",
      python: OPTILAND_PYTHON,
      version: "0.6.2",
    },
    python: { command: "python3", version: "Python 3.13.1" },
    ready: { checkLv: true, lensVisualizer: true, optiland: true },
  };
  assert.equal(run.out, `${JSON.stringify(expected, null, 2)}\n`);
  assertKeysSorted(JSON.parse(run.out));
});

test("--json with a Node version out of range still prints the object and exits 1", async (t) => {
  const run = await runDoctor(t, { ...healthyMachine(), nodeVersion: "25.2.0" }, { args: ["--json"] });
  assert.equal(run.code, EXIT_FAILURE);
  assert.deepEqual(JSON.parse(run.out).node, { ok: false, required: packageJson.engines.node, version: "25.2.0" });
});

test("an unknown argument is a usage error and probes nothing", async (t) => {
  const run = await runDoctor(t, healthyMachine(), { args: ["--jsno"] });
  assert.equal(run.code, EXIT_USAGE);
  assert.equal(run.out, "");
  assert.equal(
    run.err,
    'lvrtc doctor: unknown argument "--jsno"\nUsage: lvrtc doctor [--root <dir>] [--details] [--json]\n',
  );
  assert.deepEqual(run.ran, []);
});

test("--root reads the configuration of that root, and one that is no directory is a usage error", async (t) => {
  const other = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-doctor-root-")));
  t.after(() => rmSync(other, { recursive: true, force: true }));
  writeFileSync(join(other, CONFIG_FILE), JSON.stringify({ lvPath: "/elsewhere/lv" }));
  const run = await runDoctor(t, healthyMachine(), { args: ["--json", "--root", other] });
  assert.equal(run.code, EXIT_OK, run.err);
  const json = JSON.parse(run.out);
  assert.deepEqual(json.lensVisualizer, { binding: null, git: null, path: "/elsewhere/lv", status: "missing" });
  assert.equal(json.optiland.interpreter, "not configured");

  const absent = await runDoctor(t, healthyMachine(), { args: ["--root", join(other, "absent")] });
  assert.equal(absent.code, EXIT_USAGE);
  assert.match(absent.err, /^lvrtc doctor: --root .*absent: not a directory$/m);
  assert.deepEqual(absent.ran, []);
  assert.equal((await runDoctor(t, healthyMachine(), { args: ["--root"] })).code, EXIT_USAGE);
});

test("--help prints the usage", async (t) => {
  const run = await runDoctor(t, healthyMachine(), { args: ["--help"] });
  assert.equal(run.code, EXIT_OK);
  assert.ok(run.out.startsWith("Usage: lvrtc doctor [--root <dir>] [--details] [--json]\n\n"), run.out);
  assert.match(run.out, /fix line says what to set, in lvrtc\.local\.json or in the environment/);
  assert.match(run.out, /^Exit code: 0 when the Node version is in range/m);
  assert.deepEqual(run.ran, []);
});

test("a fix line stands under every row that is not as it should be, and Ready says what is ready", async (t) => {
  // LensVisualizer present and dirty, loaded: ready, with what check-lv needs said twice.
  const dirty = healthyMachine();
  dirty.commands[GIT_STATUS] = ok(" M src/optics/buildLens.ts\n");
  const dirtyRun = await runDoctor(t, dirty);
  assert.match(
    dirtyRun.out,
    /^ {2}git {5}\S+ \(dirty\)\n {2}fix {5}lvrtc check-lv needs LensVisualizer's checkout clean: [\s\S]*?lvrtc\.local\.json/m,
  );
  assert.match(
    dirtyRun.out,
    /^ {2}LensVisualizer {2}ready to load, but lvrtc check-lv refuses a checkout outside git or with uncommitted\s+changes$/m,
  );
  // optiland is ready, and still check-lv is not: the summary is check-lv's own rule of refusal.
  assert.match(dirtyRun.out, /^ {2}optiland {8}ready$/m);
  assert.match(
    dirtyRun.out,
    /^ {2}lvrtc check-lv {2}not ready: it refuses, running nothing, until each of these is fixed:$/m,
  );
  assert.match(dirtyRun.out, /^ {18}- LensVisualizer at \/checkouts\/lv has uncommitted changes/m);
  assert.doesNotMatch(dirtyRun.out, /Ready to check LensVisualizer/);
  assert.deepEqual(JSON.parse((await runDoctor(t, dirty, { args: ["--json"] })).out).ready, {
    checkLv: false,
    lensVisualizer: true,
    optiland: true,
  });
  const outsideGit = healthyMachine();
  outsideGit.commands[GIT_TOP] = failed("fatal: not a git repository\n");
  const outsideGitRun = await runDoctor(t, outsideGit);
  assert.match(outsideGitRun.out, /^ {18}- LensVisualizer at \/checkouts\/lv is not a git checkout/m);
  assert.doesNotMatch(outsideGitRun.out, /Ready to check LensVisualizer/);

  // A checkout that does not load: the remedy of its code.
  const unloadable = healthyMachine();
  unloadable.binding = { status: "failed", code: "import-failed", message: "1 of 40 modules cannot be imported" };
  const unloadableRun = await runDoctor(t, unloadable);
  assert.match(
    unloadableRun.out,
    /^ {2}fix {5}Update the LensVisualizer checkout, and check that lvPath in\s+lvrtc\.local\.json/m,
  );
  assert.match(unloadableRun.out, /^ {2}LensVisualizer {2}not ready \(it cannot be loaded: import-failed\)$/m);
  assert.match(unloadableRun.out, /^ {2}Not ready to check LensVisualizer/m);
  assert.deepEqual(JSON.parse((await runDoctor(t, unloadable, { args: ["--json"] })).out).ready, {
    checkLv: false,
    lensVisualizer: false,
    optiland: true,
  });

  // An interpreter that cannot import optiland: install it, or point at one that can.
  const noOptiland = healthyMachine();
  noOptiland.commands[`${OPTILAND_PYTHON} -c ${OPTILAND_SCRIPT}`] = failed("PackageNotFoundError: optiland\n");
  noOptiland.engine = { status: "unavailable", code: "hello-failed", message: "no module named optiland" };
  const noOptilandRun = await runDoctor(t, noOptiland);
  assert.match(
    noOptilandRun.out,
    /^ {2}version {6}not importable\n {2}fix {10}The interpreter runs but cannot import optiland/m,
  );
  assert.match(noOptilandRun.out, /^ {2}optiland {8}not ready \(its interpreter cannot import optiland\)/m);

  // Node out of range.
  const oldNode = await runDoctor(t, { ...healthyMachine(), nodeVersion: "22.18.0" });
  assert.match(oldNode.out, /^ {2}status {4}out of range\n {2}fix {7}Use Node 24\.15 or a later 24 release/m);
  assert.match(oldNode.out, /^ {18}- Node 22\.18\.0 is outside the supported range/m);
  assert.doesNotMatch(oldNode.out, /Ready to check LensVisualizer/);
  const oldNodeJson = await runDoctor(t, { ...healthyMachine(), nodeVersion: "22.18.0" }, { args: ["--json"] });
  assert.deepEqual(JSON.parse(oldNodeJson.out).ready, { checkLv: false, lensVisualizer: true, optiland: true });

  // Every row that is as it should be has no fix line.
  assert.doesNotMatch((await runDoctor(t, healthyMachine())).out, /^ {2}fix /m);
});

test("on a root with nothing configured, and with paths that are set but lead nowhere, every fix names where to set it", async (t) => {
  const envs: Record<string, string>[] = [
    {},
    { LVRTC_LV_PATH: "/nowhere/lv", LVRTC_OPTILAND_PYTHON: "/nowhere/python" },
  ];
  for (const env of envs) {
    const run = await runDoctor(t, { ...healthyMachine(), files: [] }, { config: {}, env });
    assert.equal(run.code, EXIT_OK);
    const fixes = run.out.split("\n").filter((line) => /^ {2}fix /.test(line));
    assert.equal(fixes.length, 2, run.out);
    assert.match(fixes[0], /lvPath in lvrtc\.local\.json \(or the environment variable LVRTC_LV_PATH\)/);
    assert.match(fixes[1], /engines\.optiland\.python in lvrtc\.local\.json \(or LVRTC_OPTILAND_PYTHON\)/);
    assert.match(run.out, /\nReady\n {2}LensVisualizer {2}not ready \(/);
    assert.ok(!run.ran.some((line) => line.startsWith("engine ")), "no engine is started");
  }
});

test("a configuration file that cannot be read is an error naming the file", async (t) => {
  const run = await runDoctor(t, healthyMachine(), { config: "{ not json" });
  assert.equal(run.code, EXIT_FAILURE);
  assert.equal(run.out, "");
  assert.ok(run.err.startsWith(`lvrtc doctor: ${join(run.rootDir, CONFIG_FILE)}: malformed JSON (`), run.err);
});

test("the system probe reads this machine", () => {
  assert.equal(systemProbe.nodeVersion(), process.versions.node);
  assert.equal(systemProbe.exists(join(REPO_ROOT, "package.json")), true);
  assert.equal(systemProbe.exists(join(REPO_ROOT, "no-such-file")), false);
  // stderr is not compared: a debugger or NODE_OPTIONS in the developer's environment may write to it.
  const version = systemProbe.run(process.execPath, ["--version"]);
  assert.equal(version?.status, 0);
  assert.equal(version?.stdout, `${process.version}\n`);
  assert.equal(systemProbe.run(process.execPath, ["--no-such-flag"])?.status, 9);
  assert.equal(systemProbe.run(join(REPO_ROOT, "no-such-command"), []), null);
});

test("the system probe does not hand a parent git's repository on to its commands", (t) => {
  // git exports these to its hooks and to `rebase --exec`. They outrank `git -C <LensVisualizer>`, so an inherited
  // GIT_DIR would make doctor report this repository's commit as LensVisualizer's.
  const names = ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY", "GIT_COMMON_DIR"];
  const saved = names.map((name) => process.env[name]);
  t.after(() => {
    names.forEach((name, index) => {
      if (saved[index] === undefined) delete process.env[name];
      else process.env[name] = saved[index];
    });
  });
  for (const name of names) process.env[name] = "/another/repository";
  process.env.LVRTC_PROBE_CANARY = "kept";
  t.after(() => delete process.env.LVRTC_PROBE_CANARY);

  const script =
    "console.log(Object.keys(process.env).filter((name) => /^(GIT_|LVRTC_PROBE_)/.test(name)).sort().join())";
  const inherited = (systemProbe.run(process.execPath, ["-e", script])?.stdout ?? "").trim().split(",");
  for (const name of names) assert.ok(!inherited.includes(name), name);
  assert.ok(inherited.includes("LVRTC_PROBE_CANARY"), "the rest of the environment is passed on");
});

test("the system probe answers null for a command line that cannot be spawned at all", () => {
  // A NUL byte makes spawnSync throw instead of reporting an error; a configured path may contain anything.
  assert.equal(systemProbe.run("python\0", ["--version"]), null);
  assert.equal(systemProbe.run(process.execPath, ["-C", "/lv\0"]), null);
});

test("the system probe loads a LensVisualizer tree through the binding and reports its engine closure", async (t) => {
  const lv = freshLv(t);
  assert.deepEqual(await systemProbe.lvBinding(lv), {
    status: "loaded",
    engineFileCount: FAKE_ENGINE_FILES.length,
    engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES),
  });
});

test("the system probe reports a tree that cannot be loaded instead of failing", async (t) => {
  const lv = freshLv(t);
  writeFileSync(join(lv, "src/optics/trace/aperture.ts"), "export const somethingElse = 1;\n");
  const report = await systemProbe.lvBinding(lv);
  assert.equal(report.status, "failed");
  assert.equal(report.status === "failed" && report.code, "exports-missing");
  assert.match(
    report.status === "failed" ? report.message : "",
    /evaluateAperture \(expected function, found undefined\)/,
  );
  assert.deepEqual(await systemProbe.lvBinding(join(lv, "nowhere")), {
    status: "failed",
    code: "path-missing",
    message: `LensVisualizer path is not a directory: ${join(lv, "nowhere")}`,
  });
});

test("doctor's binding probe explains a pre-rewrite LensVisualizer refusal", async (t) => {
  const lv = freshLv(t);
  writeFileSync(join(lv, "src/optics/compat.ts"), "export {};\n");
  rmSync(join(lv, "src/optics/fieldGeometry.ts"));
  const report = await systemProbe.lvBinding(lv);
  assert.equal(report.status, "failed");
  assert.ok(report.status === "failed");
  assert.equal(report.code, "import-failed");
  assert.match(report.message, /predates its engine rewrite.*460f841f or later/);
});
