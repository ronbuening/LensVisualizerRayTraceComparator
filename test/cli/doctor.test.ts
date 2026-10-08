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
  type DoctorProbe,
} from "../../src/cli/commands/doctor.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";

const LV = "/checkouts/lv";
const OPTILAND_PYTHON = "/checkouts/optiland/.venv/bin/python";
const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const OPTILAND_SCRIPT = "import importlib.metadata as m; print(m.version('optiland'))";

/** A scripted machine: the files that exist and what each command line answers. Unlisted commands cannot start. */
interface Machine {
  nodeVersion: string;
  files: string[];
  commands: Record<string, CommandResult | null>;
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
      [`git -C ${LV} rev-parse HEAD`]: ok(`${COMMIT}\n`),
      [`git --no-optional-locks -C ${LV} status --porcelain`]: ok(""),
      "python3 --version": ok("Python 3.13.1\n"),
      [`${OPTILAND_PYTHON} --version`]: ok("Python 3.12.7\n"),
      [`${OPTILAND_PYTHON} -c ${OPTILAND_SCRIPT}`]: ok("0.6.2\n"),
    },
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
  options: { args?: string[]; config?: unknown; env?: Record<string, string> } = {},
): Promise<Run & { rootDir: string }> {
  const rootDir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-doctor-")));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const config = options.config ?? { lvPath: LV, engines: { optiland: { python: OPTILAND_PYTHON } } };
  writeFileSync(join(rootDir, CONFIG_FILE), typeof config === "string" ? config : JSON.stringify(config));

  const ran: string[] = [];
  const probe: DoctorProbe = {
    nodeVersion: () => machine.nodeVersion,
    exists: (path) => machine.files.includes(path),
    run: (command, args) => {
      const line = [command, ...args].join(" ");
      ran.push(line);
      return machine.commands[line] ?? null;
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
  assert.match(out.join(""), /^ {2}doctor {3}Report the Node version/m);
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
      "",
      "Python",
      "  command  python3",
      "  version  Python 3.13.1",
      "",
      "optiland",
      `  python       ${OPTILAND_PYTHON}`,
      "  interpreter  present (Python 3.12.7)",
      "  version      0.6.2",
      "",
    ].join("\n"),
  );
});

test("the probes only read: the exact commands run", async (t) => {
  const run = await runDoctor(t, healthyMachine());
  assert.deepEqual(run.ran, [
    `git -C ${LV} rev-parse HEAD`,
    `git --no-optional-locks -C ${LV} status --porcelain`,
    "python3 --version",
    `${OPTILAND_PYTHON} --version`,
    `${OPTILAND_PYTHON} -c ${OPTILAND_SCRIPT}`,
  ]);
});

test("a dirty LensVisualizer checkout is flagged", async (t) => {
  const machine = healthyMachine();
  machine.commands[`git --no-optional-locks -C ${LV} status --porcelain`] = ok(" M src/optics/buildLens.ts\n");
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.match(run.out, new RegExp(`^  git     ${COMMIT} \\(dirty\\)$`, "m"));
});

test("LensVisualizer outside git is present without a commit", async (t) => {
  const machine = healthyMachine();
  machine.commands[`git -C ${LV} rev-parse HEAD`] = failed("fatal: not a git repository\n");
  const run = await runDoctor(t, machine, { args: ["--json"] });
  assert.equal(run.code, EXIT_OK);
  assert.deepEqual(JSON.parse(run.out).lensVisualizer, { git: null, path: LV, status: "present" });
  assert.ok(!run.ran.some((line) => line.includes("status --porcelain")));

  const text = await runDoctor(t, machine);
  assert.match(text.out, /^ {2}git {5}not a git checkout$/m);
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

  const json = await runDoctor(t, machine, { args: ["--json"] });
  assert.deepEqual(JSON.parse(json.out).lensVisualizer, { git: null, path: LV, status: "missing" });
});

test("LensVisualizer and optiland not configured are reported, not a failure", async (t) => {
  const machine = healthyMachine();
  const run = await runDoctor(t, machine, { config: {} });
  assert.equal(run.code, EXIT_OK);
  assert.match(run.out, /^ {2}lvPath {19}\(not set\) {2}\[default\]$/m);
  assert.match(run.out, /^LensVisualizer\n {2}status {2}not configured\n\n/m);
  assert.match(run.out, /^optiland\n {2}interpreter {2}not configured\n$/m);
  assert.deepEqual(run.ran, ["python3 --version"]);

  const json = JSON.parse((await runDoctor(t, machine, { args: ["--json"], config: {} })).out);
  assert.deepEqual(json.lensVisualizer, { git: null, path: null, status: "not configured" });
  assert.deepEqual(json.optiland, {
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
  assert.match(run.out, /^Python\n {2}command {2}python3\n {2}version {2}not found$/m);
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
  });
});

test("a missing optiland interpreter is reported and not asked for optiland", async (t) => {
  const machine = healthyMachine();
  machine.commands[`${OPTILAND_PYTHON} --version`] = null;
  const run = await runDoctor(t, machine);
  assert.equal(run.code, EXIT_OK);
  assert.match(run.out, /^ {2}interpreter {2}missing\n$/m);
  assert.ok(!run.ran.some((line) => line.includes(" -c ")));
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
    lensVisualizer: { git: { commit: COMMIT, dirty: false }, path: LV, status: "present" },
    node: { ok: true, required: packageJson.engines.node, version: "24.15.0" },
    optiland: {
      interpreter: "present",
      interpreterVersion: "Python 3.12.7",
      python: OPTILAND_PYTHON,
      version: "0.6.2",
    },
    python: { command: "python3", version: "Python 3.13.1" },
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
  assert.equal(run.err, 'lvrtc doctor: unknown argument "--jsno"\nUsage: lvrtc doctor [--json]\n');
  assert.deepEqual(run.ran, []);
});

test("--help prints the usage", async (t) => {
  const run = await runDoctor(t, healthyMachine(), { args: ["--help"] });
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.out, "Usage: lvrtc doctor [--json]\n");
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
