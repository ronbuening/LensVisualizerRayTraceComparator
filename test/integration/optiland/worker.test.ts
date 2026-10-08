// The engine `optiland` on the real optiland: the worker starts, says who it is, conforms to the contract, answers
// every quantity "unsupported" for now, and writes nothing into the optiland checkout or its environment.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { systemProbe } from "../../../src/cli/commands/doctor.ts";
import { createRunCommand } from "../../../src/cli/commands/run.ts";
import { EXIT_OK, runCli } from "../../../src/cli/main.ts";
import type { EngineIdentity } from "../../../src/contract/engine.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { RUNGS } from "../../../src/core/rungs.ts";
import { runConformance } from "../../../src/engines/conformance.ts";
import { PYTHON_WORKERS_DIRECTORY } from "../../../src/engines/optiland/definition.ts";
import { createEngineRegistry, createEngineTransport, engineTimeouts } from "../../../src/engines/registry.ts";
import { QUANTITIES } from "../../../src/quantities/index.ts";
import type { StdioTransport } from "../../../src/transports/stdio.ts";
import { caseFixture } from "../../core/support.ts";
import { CASE } from "../../engines/support.ts";
import {
  OPTILAND_PYTHON,
  OPTILAND_UNAVAILABLE,
  optilandCheckout,
  optilandCommit,
  optilandEnvironment,
  optilandPackageDir,
  optilandPython,
  optilandRoot,
  protectedDirectories,
  snapshot,
  snapshotChanges,
  tempDir,
} from "./support.ts";

const skip = OPTILAND_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const SHA256 = /^[0-9a-f]{64}$/;
/** The Python test that makes numba compile, and cache, a function of optiland. */
const JIT_TEST = "test_what_the_jit_compiles_is_cached_where_the_worker_said_and_not_beside_the_source";

/**
 * What the optiland checkout and its environment looked like before any test of this file ran. The last test
 * compares it with what they look like after all of them: git cannot see a `__pycache__` or a numba cache.
 */
const START = skip
  ? null
  : { directories: protectedDirectories(), commit: optilandCommit(), entries: snapshot(protectedDirectories()) };

/** Every `.py` file under a directory. */
function pythonFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true, encoding: "utf8" }).filter(
    (name) => name.endsWith(".py") && statSync(join(directory, name)).isFile(),
  );
}

test("the snapshot sees a file that came and went, a file that was rewritten and one that was touched", (t) => {
  const directory = tempDir(t);
  mkdirSync(join(directory, "package", "__pycache__"), { recursive: true });
  writeFileSync(join(directory, "package", "source.py"), "x = 1\n");
  const before = snapshot([directory]);
  assert.deepEqual(snapshotChanges(before, snapshot([directory])), []);
  assert.deepEqual(
    [...before.keys()],
    [
      directory,
      join(directory, "package"),
      join(directory, "package", "__pycache__"),
      join(directory, "package", "source.py"),
    ],
  );

  // What numba does to find out whether it may cache beside a source: no file is left, and the directory shows it.
  const old = new Date(Date.now() - 60_000);
  utimesSync(join(directory, "package", "__pycache__"), old, old);
  const aged = snapshot([directory]);
  writeFileSync(join(directory, "package", "__pycache__", "probe.tmp"), "");
  rmSync(join(directory, "package", "__pycache__", "probe.tmp"));
  const probed = snapshotChanges(aged, snapshot([directory]));
  assert.equal(probed.length, 1);
  assert.ok(probed[0].startsWith(`${join(directory, "package", "__pycache__")}: -1 `));

  writeFileSync(join(directory, "package", "source.py"), "x = 22\n");
  writeFileSync(join(directory, "package", "__pycache__", "source.cpython-314.pyc"), "\0");
  const written = snapshotChanges(before, snapshot([directory])).map((line) => line.slice(directory.length + 1));
  assert.equal(written.length, 3);
  assert.match(written[0], /^package\/__pycache__: -1 \d+ -> -1 \d+$/);
  assert.match(written[1], /^package\/__pycache__\/source\.cpython-314\.pyc: absent -> 1 \d+$/);
  assert.match(written[2], /^package\/source\.py: 6 \d+ -> 7 \d+$/);
});

test("the Python tests of the worker pass under the optiland interpreter, none skipped", { skip }, () => {
  const ended = optilandPython(
    [
      "-m",
      "unittest",
      "discover",
      "-s",
      join(PYTHON_WORKERS_DIRECTORY, "tests", "optiland"),
      "-t",
      PYTHON_WORKERS_DIRECTORY,
    ],
    { cwd: PYTHON_WORKERS_DIRECTORY },
  );
  assert.equal(ended.status, 0, ended.stderr.slice(-4000));
  // unittest reports on the standard error: "Ran N tests", then "OK", with "(skipped=N)" when any was skipped.
  assert.match(ended.stderr, /^Ran \d+ tests in /m);
  assert.match(ended.stderr, /^OK$/m, "no test was skipped: the tests of the real optiland ran");
});

test(
  "the engine passes the conformance kit: every check PASS, or SKIPPED for the quantity it does not offer",
  { skip },
  async (t) => {
    const loaded = optilandRoot(t);
    let transport: StdioTransport | undefined;
    const report = await runConformance({
      id: "optiland",
      createTransport: async () => {
        transport = (await createEngineTransport(loaded, "optiland")) as StdioTransport;
        return transport;
      },
      timeouts: engineTimeouts(loaded, "optiland"),
    });
    assert.equal(report.passed, true, JSON.stringify(report.checks, null, 2));
    assert.deepEqual(
      report.checks.filter((check) => check.status === "pass").map((check) => check.id),
      [
        "hello",
        "contract-range",
        "engine-id",
        "unknown-quantity",
        "malformed-run",
        "ids-echoed",
        "deterministic",
        "shutdown",
      ],
    );
    const skipped = report.checks.filter((check) => check.status === "skipped");
    assert.ok(skipped.length > 0);
    for (const check of skipped) {
      assert.match(check.id, /^echo\./);
      assert.equal(check.detail, "the engine does not offer selftest.echo");
    }
    assert.deepEqual(transport?.exitStatus(), { code: 0, signal: null, forced: false });
  },
);

test("the engine says which optiland it is: commit, sources, versions and the JIT", { skip }, async (t) => {
  const loaded = optilandRoot(t);
  const adapter = await createEngineRegistry(loaded).create("optiland");
  t.after(() => adapter.close());
  const { identity, capabilities, contract } = await adapter.describe();
  assert.deepEqual(contract, { min: CONTRACT_VERSION, max: CONTRACT_VERSION });
  assert.equal(identity.id, "optiland");
  assert.match(identity.fingerprint, SHA256);
  assert.match(identity.adapterRevision ?? "", SHA256);
  const { details } = identity;
  assert.equal(details.jit, true, "the JIT stays on");
  assert.deepEqual([details.backend, details.precision], ["numpy", "float64"]);
  assert.equal(details.distVersion, identity.version);
  assert.match(String(details.sourceHash), SHA256);
  assert.equal(details.sourceFiles, pythonFiles(optilandPackageDir()).length);
  for (const name of ["python", "numpy", "scipy", "numba"]) assert.match(String(details[name]), /^\d+\.\d+/, name);
  // The checkout's own state, read here by git and there by the worker.
  const commit = optilandCommit();
  assert.equal(details.commit, commit);
  assert.equal(typeof details.dirty, commit === null ? "object" : "boolean");

  assert.deepEqual(capabilities.quantities, {});
  assert.equal(capabilities.deterministic, true);

  // No quantity yet: the engine itself answers "unsupported" for each there is, and for one there is not.
  for (const quantity of [...QUANTITIES.list().map((module) => module.id), "conformance.no-such-quantity"]) {
    const result = await adapter.run(makeRequest({ caseId: CASE.id, quantity, spec: {} }), CASE);
    assert.equal(result.status, "unsupported", quantity);
    assert.deepEqual(result.unsupported, [
      { code: "quantity", item: quantity, message: `the engine optiland does not offer ${quantity}` },
    ]);
    assert.deepEqual(result.engine, {
      id: "optiland",
      fingerprint: identity.fingerprint,
      adapterRevision: identity.adapterRevision,
      details,
    });
  }
});

test("lvrtc run --engines optiland: every rung is answered unsupported, and nothing fails", { skip }, async (t) => {
  const loaded = optilandRoot(t);
  const { rootDir } = loaded;
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "singlet",
    runs: [{ name: "singlet", lens: { kind: "fixture", path: "cases/singlet.json" } }],
  };
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
  mkdirSync(join(rootDir, "cases"));
  copyFileSync(caseFixture("singlet"), join(rootDir, "cases", "singlet.json"));

  const out: string[] = [];
  const err: string[] = [];
  const command = createRunCommand({ rootDir, env: {}, cwd: rootDir });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const rungs = RUNGS.map((rung) => rung.id);
  const code = await runCli(["run", "suite.json", "--engines", "optiland", "--rungs", rungs.join(",")], io, [command]);
  // The standard error names the fields a case file gives no rays for; that fails nothing.
  assert.equal(code, EXIT_OK, out.join("") + err.join(""));
  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "singlet", MANIFEST_FILE), "utf8"));
  assert.ok(manifest.jobs.length >= rungs.length);
  assert.deepEqual([...new Set(manifest.jobs.map((job) => job.rung))].sort(), [...rungs].sort());
  for (const job of manifest.jobs) assert.deepEqual([job.engine, job.status], ["optiland", "unsupported"], job.rung);
  const [engine] = manifest.engines;
  assert.ok(engine.id === "optiland" && engine.status === "available");
  assert.match(engine.adapterRevision ?? "", SHA256);
});

test("lvrtc doctor reports the fingerprint of the optiland it finds", { skip }, async (t) => {
  // The probe that doctor uses, on a root whose caches are warm.
  const loaded = optilandRoot(t);
  const found = await systemProbe.optilandEngine(loaded);
  assert.ok(found.status === "available", JSON.stringify(found));
  assert.equal(found.details.commit, optilandCommit());

  // And the command itself, as it is run: on this repository's own configuration, whose caches are gitignored.
  const ended = spawnSync(process.execPath, [BIN, "doctor"], {
    encoding: "utf8",
    env: { ...process.env, LVRTC_OPTILAND_PYTHON: OPTILAND_PYTHON ?? "" },
    timeout: 600_000,
  });
  assert.equal(ended.status, 0, ended.stderr);
  const section = ended.stdout.slice(ended.stdout.lastIndexOf("\noptiland\n"));
  assert.match(section, new RegExp(`^  engine       fingerprint ${found.fingerprint}$`, "m"));
  assert.match(section, new RegExp(`^  git          ${String(found.details.commit)} \\((dirty|clean)\\)$`, "m"));
  assert.match(
    section,
    new RegExp(`^  sources      ${String(found.details.sourceFiles)} files, hash [0-9a-f]{64}$`, "m"),
  );
  assert.match(section, /^ {2}versions {5}Python \d+\.\d+\.\d+, numpy \d+\.\S+, scipy \d+\.\S+, numba \d+\.\S+$/m);
  assert.match(section, /^ {2}jit {10}on$/m);
  assert.match(section, new RegExp(`^  adapter      ${found.adapterRevision}$`, "m"));
  // The environment the tests gave the interpreter is the worker's own: stated once, used by both.
  assert.equal(optilandEnvironment().MPLBACKEND, "Agg");
});

test(
  "a cold start with the JIT on writes nothing into the optiland checkout or its environment",
  { skip },
  async (t) => {
    // A cache directory of this test's own: matplotlib builds its font cache again, numba compiles optiland's cached
    // functions again, and every module is compiled from its source, as on a machine that never ran the worker.
    const cacheDir = join(tempDir(t), "cache");
    const loaded = optilandRoot(t, cacheDir);
    // The snapshot was taken when this file was loaded, so everything the tests above did is inside it too: the
    // worker on warm caches, the Python tests of the worker, the run and doctor.
    assert.ok(START !== null);
    const { directories, commit, entries: before } = START;

    const identities: EngineIdentity[] = [];
    const helloMs: number[] = [];
    for (const start of ["cold", "warm"]) {
      const adapter = await createEngineRegistry(loaded).create("optiland");
      try {
        const started = performance.now();
        identities.push((await adapter.describe()).identity);
        helloMs.push(performance.now() - started);
        const result = await adapter.run(makeRequest({ caseId: CASE.id, quantity: "rays.trace", spec: {} }), CASE);
        assert.equal(result.status, "unsupported", start);
      } finally {
        await adapter.close();
      }
    }

    // The JIT at work, on the cold cache: the Python test that traces a ray, which numba compiles a function for.
    const traced = optilandPython(["-m", "unittest", `tests.optiland.test_real.RealOptilandTest.${JIT_TEST}`], {
      cacheDir,
      cwd: PYTHON_WORKERS_DIRECTORY,
    });
    assert.equal(traced.status, 0, traced.stderr.slice(-4000));
    assert.match(traced.stderr, /^Ran 1 test in /m);
    assert.match(traced.stderr, /^OK$/m);

    const after = snapshot(directories);
    t.diagnostic(`hello: cold ${(helloMs[0] / 1000).toFixed(1)} s, warm ${(helloMs[1] / 1000).toFixed(1)} s`);
    t.diagnostic(`fingerprint ${identities[0].fingerprint}`);
    t.diagnostic(`snapshot: ${before.size} entries under ${directories.join(", ")}`);

    // The JIT ran and cached: its files are under the cache directory the worker was given, and only there.
    assert.equal(identities[0].details.jit, true);
    const cached = readdirSync(join(cacheDir, "optiland", "numba"), { recursive: true, encoding: "utf8" });
    assert.ok(
      cached.some((name) => name.endsWith(".nbi")) && cached.some((name) => name.endsWith(".nbc")),
      `numba wrote its index and its machine code under the cache directory: ${cached.join(", ")}`,
    );
    assert.deepEqual(readdirSync(join(cacheDir, "optiland")).sort(), ["matplotlib", "numba", "pycache"]);

    const changes = snapshotChanges(before, after);
    if (changes.length > 0 && optilandCommit() !== commit) {
      // Not the worker's doing, and nothing can be said of what the worker wrote while the tree moved under it.
      t.skip(`the optiland checkout moved from ${commit} to ${optilandCommit()} while the test ran`);
      return;
    }
    assert.ok(before.size > 500, `the snapshot covers the checkout (${before.size} entries)`);
    assert.deepEqual(changes, [], `written under ${optilandCheckout()}`);

    // The same engine in two processes. Judged last: a checkout that changed between the two is reported above,
    // by the paths that changed, and not here as two identities that differ.
    assert.deepEqual(identities[1], identities[0]);
  },
);
