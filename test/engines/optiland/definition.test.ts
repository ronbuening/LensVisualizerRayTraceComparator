// The engine `optiland` as the comparator defines it: a stdio worker built from `engines.optiland.python` and
// nothing else. The worker runs here on a fake optiland (test/fixtures/fake-optiland), so nothing needs the real one.
import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { systemProbe } from "../../../src/cli/commands/doctor.ts";
import { createRunCommand } from "../../../src/cli/commands/run.ts";
import { EXIT_FAILURE, EXIT_OK, runCli } from "../../../src/cli/main.ts";
import { FEATURE_FLAGS } from "../../../src/contract/features.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { CONFIG_FILE, loadConfig } from "../../../src/core/config.ts";
import type { EngineDefinition } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { EngineUnavailableError } from "../../../src/engines/adapter.ts";
import type { EngineUnavailableCode } from "../../../src/engines/adapter.ts";
import { BUILTIN_ENGINES } from "../../../src/engines/builtin.ts";
import type { BuiltinEngines } from "../../../src/engines/builtin.ts";
import { runConformance } from "../../../src/engines/conformance.ts";
import { createEngine } from "../../../src/engines/fake/engine.ts";
import {
  OPTILAND_ENGINE_ID,
  OPTILAND_SETTING_HINT,
  OPTILAND_TIMEOUTS,
  PYTHON_WORKERS_DIRECTORY,
  optilandDefinition,
  optilandWorkerEnvironment,
  systemInterpreterProbe,
} from "../../../src/engines/optiland/definition.ts";
import type { InterpreterProbe } from "../../../src/engines/optiland/definition.ts";
import { createEngineRegistry, createEngineTransport, engineTimeouts } from "../../../src/engines/registry.ts";
import { DEFAULT_ENGINE_TIMEOUTS } from "../../../src/engines/remote.ts";
import type { StdioTransport } from "../../../src/transports/stdio.ts";
import type { Transport } from "../../../src/transports/transport.ts";
import { caseFixture, tempDir } from "../../core/support.ts";
import { CASE, echoRequest } from "../support.ts";
import { FAKE_OPTILAND_MISSING, fakeOptilandRoot } from "./support.ts";

const skip = FAKE_OPTILAND_MISSING;
const FAKE_ENGINE = fileURLToPath(new URL("../../../src/engines/fake/engine.ts", import.meta.url));
const SHA256 = /^[0-9a-f]{64}$/;

/** A configuration root with this configuration file, removed after the test. */
function rootWith(t: TestContext, config: unknown): string {
  const rootDir = tempDir(t);
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config));
  return rootDir;
}

/** A machine on which exactly these files exist, with this search path. */
function machine(files: readonly string[], searchPath: readonly string[] = []): InterpreterProbe {
  return { exists: (path) => files.includes(path), searchPath };
}

async function unavailable(attempt: Promise<unknown>, code: EngineUnavailableCode): Promise<EngineUnavailableError> {
  const error: unknown = await attempt.then(
    () => undefined,
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof EngineUnavailableError, `expected an EngineUnavailableError, got ${String(error)}`);
  assert.equal(error.code, code);
  return error;
}

/** Every file under a directory, relative to it, sorted. */
function filesUnder(directory: string): string[] {
  return readdirSync(directory, { recursive: true, encoding: "utf8" })
    .filter((name) => statSync(join(directory, name)).isFile())
    .sort();
}

// ── The definition ───────────────────────────────────────────────────────────────────────────────────────────────

test("the definition is the worker's command and environment, built from the interpreter and the cache directory", (t) => {
  const python = "/checkouts/optiland/.venv/bin/python";
  const rootDir = rootWith(t, { engines: { optiland: { python } } });
  const loaded = loadConfig({ rootDir, env: {} });
  const cache = join(rootDir, ".cache", "optiland");
  const expected: EngineDefinition = {
    transport: "stdio",
    command: [python, "-m", "lvrtc_optiland"],
    options: {},
    env: {
      PYTHONPATH: PYTHON_WORKERS_DIRECTORY,
      PYTHONDONTWRITEBYTECODE: "1",
      PYTHONPYCACHEPREFIX: join(cache, "pycache"),
      NUMBA_CACHE_DIR: join(cache, "numba"),
      MPLCONFIGDIR: join(cache, "matplotlib"),
      MPLBACKEND: "Agg",
      LVRTC_CACHE_DIR: cache,
    },
  };
  assert.deepEqual(optilandDefinition(loaded, machine([python])), expected);
  assert.deepEqual(optilandWorkerEnvironment(join(rootDir, ".cache")), expected.env);
  // The JIT is left on: nothing in the environment turns it off.
  assert.ok(!Object.keys(expected.env).some((name) => name.startsWith("NUMBA_DISABLE")));
  // The worker is the one beside this repository's sources, whatever the configuration root.
  assert.ok(existsSync(join(PYTHON_WORKERS_DIRECTORY, "lvrtc_optiland", "__main__.py")));
  assert.ok(existsSync(join(PYTHON_WORKERS_DIRECTORY, "lvrtc_worker_kit", "protocol.py")));

  // The caches follow the configuration's cacheDir, and the environment's interpreter wins over the file's.
  const elsewhere = rootWith(t, { cacheDir: "caches/here", engines: { optiland: { python } } });
  const fromEnv = loadConfig({ rootDir: elsewhere, env: { LVRTC_OPTILAND_PYTHON: "/other/python" } });
  const definition = optilandDefinition(fromEnv, machine(["/other/python"]));
  assert.deepEqual(definition.command, ["/other/python", "-m", "lvrtc_optiland"]);
  assert.equal(definition.env.NUMBA_CACHE_DIR, join(elsewhere, "caches", "here", "optiland", "numba"));
});

test("an interpreter named without a path is looked up on the search path, as it will be when it is started", (t) => {
  const loaded = loadConfig({ rootDir: rootWith(t, { engines: { optiland: { python: "python3.14" } } }), env: {} });
  const found = optilandDefinition(loaded, machine(["/opt/bin/python3.14"], ["/usr/bin", "/opt/bin"]));
  assert.deepEqual(found.command, ["python3.14", "-m", "lvrtc_optiland"]);
  assert.throws(
    () => optilandDefinition(loaded, machine(["/opt/bin/python3.14"], ["/usr/bin"])),
    (error: unknown) => error instanceof EngineUnavailableError && error.code === "spawn-failed",
  );
  const probe = systemInterpreterProbe({ PATH: ["/a", "", "/b"].join(process.platform === "win32" ? ";" : ":") });
  assert.deepEqual(probe.searchPath, ["/a", "/b"]);
  assert.deepEqual(systemInterpreterProbe({}).searchPath, []);
});

test("without an interpreter the engine is not-configured, and the message says what to set and where", (t) => {
  for (const config of [{}, { engines: { optiland: { python: null } } }, { engines: { optiland: {} } }]) {
    const loaded = loadConfig({ rootDir: rootWith(t, config), env: {} });
    assert.throws(
      () => optilandDefinition(loaded, machine([])),
      (error: unknown) => {
        assert.ok(error instanceof EngineUnavailableError);
        assert.deepEqual([error.engineId, error.code], ["optiland", "not-configured"]);
        assert.equal(
          error.message,
          "engine optiland is unavailable (not-configured): no interpreter is configured for it: " +
            "set engines.optiland.python in lvrtc.local.json (or LVRTC_OPTILAND_PYTHON) to an interpreter that can " +
            "import optiland, as lvrtc.local.example.json shows",
        );
        return true;
      },
    );
  }
  assert.match(OPTILAND_SETTING_HINT, /lvrtc\.local\.json/);
});

test("an interpreter that is not on this machine is spawn-failed, with the path and what to set", (t) => {
  const rootDir = rootWith(t, { engines: { optiland: { python: "../nowhere/.venv/bin/python" } } });
  const loaded = loadConfig({ rootDir, env: {} });
  const python = join(rootDir, "..", "nowhere", ".venv", "bin", "python");
  assert.throws(
    // The probe of this machine: the path is under a temporary directory and does not exist.
    () => optilandDefinition(loaded),
    (error: unknown) => {
      assert.ok(error instanceof EngineUnavailableError);
      assert.equal(error.code, "spawn-failed");
      assert.equal(
        error.message,
        `engine optiland is unavailable (spawn-failed): its interpreter ${python} does not exist: ` +
          OPTILAND_SETTING_HINT,
      );
      return true;
    },
  );
});

// ── In the registry ──────────────────────────────────────────────────────────────────────────────────────────────

test("optiland is a built-in engine: named under any root, unavailable alone when it has no interpreter", async (t) => {
  assert.equal(OPTILAND_ENGINE_ID, "optiland");
  assert.ok(Object.hasOwn(BUILTIN_ENGINES, "optiland"));
  const loaded = loadConfig({ rootDir: rootWith(t, {}), env: {} });
  const registry = createEngineRegistry(loaded);
  assert.deepEqual(registry.ids(), []);
  assert.ok(registry.builtinIds().includes("optiland"));
  const error = await unavailable(registry.create("optiland"), "not-configured");
  assert.match(error.message, /set engines\.optiland\.python in lvrtc\.local\.json \(or LVRTC_OPTILAND_PYTHON\)/);
  await unavailable(createEngineTransport(loaded, "optiland"), "not-configured");

  const wrong = loadConfig({ rootDir: rootWith(t, {}), env: { LVRTC_OPTILAND_PYTHON: "/nowhere/python" } });
  const missing = await unavailable(createEngineRegistry(wrong).create("optiland"), "spawn-failed");
  assert.match(missing.message, /its interpreter \/nowhere\/python does not exist: set engines\.optiland\.python/);

  // Every other engine carries on.
  const ref = await registry.create("ref");
  t.after(() => ref.close());
  assert.equal((await ref.describe()).identity.id, "ref");
});

test("the engine's own waits are used unless the configuration defines the id itself", (t) => {
  assert.deepEqual(OPTILAND_TIMEOUTS, { helloMs: 180_000 });
  assert.ok((OPTILAND_TIMEOUTS.helloMs ?? 0) > DEFAULT_ENGINE_TIMEOUTS.helloMs);
  const loaded = loadConfig({ rootDir: rootWith(t, {}), env: {} });
  assert.deepEqual(engineTimeouts(loaded, "optiland"), { helloMs: 180_000 });
  assert.deepEqual(engineTimeouts(loaded, "ref"), {});
  assert.deepEqual(engineTimeouts(loaded, "lv"), {});
  assert.deepEqual(engineTimeouts(loaded, "nobody"), {});
  assert.deepEqual(engineTimeouts(loaded, "constructor"), {});

  const own = { transport: "in-process", module: FAKE_ENGINE, options: { id: "optiland" } };
  const defined = loadConfig({ rootDir: rootWith(t, { engines: { optiland: own } }), env: {} });
  assert.deepEqual(engineTimeouts(defined, "optiland"), {}, "a definition replaces the built-in engine whole");

  const builtins: BuiltinEngines = {
    plain: () => createEngine({ id: "plain" }),
    slow: { worker: () => own as EngineDefinition, timeouts: { runMs: 5 } },
    quick: { worker: () => own as EngineDefinition },
  };
  assert.deepEqual(engineTimeouts(loaded, "slow", builtins), { runMs: 5 });
  assert.deepEqual(engineTimeouts(loaded, "quick", builtins), {});
  assert.deepEqual(engineTimeouts(loaded, "plain", builtins), {});
});

test("the adapter the registry makes waits as the engine says, for each kind of message", async (t) => {
  const own = { transport: "in-process", module: FAKE_ENGINE, options: { id: "slow" } } as const;
  const builtins: BuiltinEngines = { slow: { worker: () => own, timeouts: { helloMs: 7, runMs: 9 } } };
  // A transport that answers as the fake engine does and notes how long each message was given.
  const waitsOf = async (config: unknown): Promise<number[]> => {
    const waits: number[] = [];
    const fake = createEngine({ id: "slow" });
    const noted: Transport = {
      kind: "in-process",
      open: async () => {},
      call: async (message, { timeoutMs }) => {
        waits.push(timeoutMs);
        return fake(message);
      },
      close: async () => {},
    };
    const loaded = loadConfig({ rootDir: rootWith(t, config), env: {} });
    const adapter = await createEngineRegistry(loaded, { "in-process": async () => noted }, builtins).create("slow");
    assert.equal((await adapter.run(echoRequest(Float64Array.of(1)), CASE)).status, "ok");
    await adapter.close();
    return waits;
  };
  assert.deepEqual(await waitsOf({}), [7, 9, DEFAULT_ENGINE_TIMEOUTS.shutdownMs]);
  // An engine the configuration defines under the same id is not the built-in one, and waits as every other.
  const { helloMs, runMs, shutdownMs } = DEFAULT_ENGINE_TIMEOUTS;
  assert.deepEqual(await waitsOf({ engines: { slow: own } }), [helloMs, runMs, shutdownMs]);
});

test("a built-in engine in a worker is reached through the transport of the definition it builds", async (t) => {
  const rootDir = rootWith(t, {});
  const seen: string[] = [];
  const builtins: BuiltinEngines = {
    worker: {
      worker: (loaded) => {
        seen.push(loaded.rootDir);
        return { transport: "in-process", module: FAKE_ENGINE, options: { id: "worker", bias: 1 } };
      },
    },
    broken: {
      worker: () => {
        throw new Error("nothing to build it from");
      },
    },
  };
  const registry = createEngineRegistry(loadConfig({ rootDir, env: {} }), undefined, builtins);
  const adapter = await registry.create("worker");
  t.after(() => adapter.close());
  assert.deepEqual(seen, [rootDir]);
  assert.equal((await adapter.run(echoRequest(Float64Array.of(1)), CASE)).data?.sum, 2);

  const broken = await unavailable(registry.create("broken"), "create-failed");
  assert.equal(
    broken.message,
    "engine broken is unavailable (create-failed): the built-in engine could not be made: nothing to build it from",
  );
  // A transport without a factory is no more implemented for a built-in engine than for a configured one.
  const none = createEngineRegistry(loadConfig({ rootDir, env: {} }), {}, builtins);
  await unavailable(none.create("worker"), "unsupported-transport");
});

// ── The worker, on the fake optiland ─────────────────────────────────────────────────────────────────────────────

test("with an interpreter and no other configuration the engine answers hello as optiland", { skip }, async (t) => {
  const root = fakeOptilandRoot(t);
  const bytecode = join(PYTHON_WORKERS_DIRECTORY, "lvrtc_optiland", "__pycache__");
  const hadBytecode = existsSync(bytecode);
  const before = filesUnder(root.site);
  const loaded = root.load();
  assert.deepEqual(loaded.config.engineDefinitions, {}, "nothing but the interpreter is configured");

  const adapter = await createEngineRegistry(loaded).create("optiland");
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.deepEqual(descriptor.contract, { min: CONTRACT_VERSION, max: CONTRACT_VERSION });
  const { identity, capabilities } = descriptor;
  assert.equal(identity.id, "optiland");
  assert.equal(identity.version, "0.0.7+fake");
  assert.match(identity.fingerprint, SHA256);
  assert.match(identity.adapterRevision ?? "", SHA256);
  assert.notEqual(identity.adapterRevision, identity.fingerprint);
  assert.deepEqual(Object.keys(identity.details).sort(), [
    "backend",
    "commit",
    "dirty",
    "distVersion",
    "jit",
    "numba",
    "numpy",
    "precision",
    "python",
    "scipy",
    "sourceFiles",
    "sourceHash",
  ]);
  const { python: _python, sourceHash, ...stated } = identity.details;
  assert.match(String(sourceHash), SHA256);
  assert.deepEqual(stated, {
    backend: "numpy",
    commit: null,
    dirty: null,
    distVersion: "0.0.7+fake",
    jit: true,
    numba: "0.3.fake",
    numpy: "0.1.fake",
    precision: "float64",
    scipy: "0.2.fake",
    sourceFiles: 3,
  });
  assert.deepEqual(capabilities, {
    features: { supported: ["lines.multiple", "surface.asphere.even", "surface.conic"], limits: {} },
    quantities: {},
    deterministic: true,
    maxConcurrency: 1,
  });
  for (const flag of capabilities.features.supported) assert.ok((FEATURE_FLAGS as readonly string[]).includes(flag));

  // It offers no quantity yet: a run is answered "unsupported", by the engine itself, stamped with both hashes.
  const request = makeRequest({ caseId: CASE.id, quantity: "system.describe", spec: {} });
  const result = await adapter.run(request, CASE);
  assert.equal(result.status, "unsupported");
  assert.deepEqual(result.unsupported, [
    { code: "quantity", item: "system.describe", message: "the engine optiland does not offer system.describe" },
  ]);
  assert.deepEqual(result.engine, {
    id: "optiland",
    fingerprint: identity.fingerprint,
    adapterRevision: identity.adapterRevision,
    details: identity.details,
  });
  await adapter.close();

  // The caches are under the root's cache directory; nothing was written beside a source, the fake's or the worker's.
  assert.deepEqual(readdirSync(join(root.rootDir, ".cache", "optiland")).sort(), ["matplotlib", "numba", "pycache"]);
  assert.deepEqual(filesUnder(root.site), before);
  assert.equal(existsSync(bytecode), hadBytecode);
});

test("the engine on the fake optiland passes the conformance kit", { skip }, async (t) => {
  const loaded = fakeOptilandRoot(t).load();
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
  const skipped = report.checks.filter((check) => check.status === "skipped");
  // Skipped are the examples of the conformance quantity, which the engine does not offer, and nothing else.
  assert.ok(skipped.length > 0 && skipped.every((check) => check.id.startsWith("echo.")));
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
  assert.deepEqual(transport?.exitStatus(), { code: 0, signal: null, forced: false });
});

test("the fingerprint is the engine's and the adapter revision the worker's", { skip }, async (t) => {
  const root = fakeOptilandRoot(t);
  const identityOf = async (): Promise<{ fingerprint: string; adapterRevision?: string }> => {
    const adapter = await createEngineRegistry(root.load()).create("optiland");
    try {
      return (await adapter.describe()).identity;
    } finally {
      await adapter.close();
    }
  };
  const first = await identityOf();
  const again = await identityOf();
  assert.deepEqual([again.fingerprint, again.adapterRevision], [first.fingerprint, first.adapterRevision]);
  // An edit to a source of the engine changes the fingerprint, and the worker's revision stays.
  writeFileSync(join(root.site, "optiland", "optic", "__init__.py"), "class Optic:\n    edited = True\n");
  const edited = await identityOf();
  assert.notEqual(edited.fingerprint, first.fingerprint);
  assert.equal(edited.adapterRevision, first.adapterRevision);
});

test(
  "an interpreter that cannot import optiland is hello-failed, with the reason and what to set",
  { skip },
  async (t) => {
    const root = fakeOptilandRoot(t);
    writeFileSync(join(root.site, "optiland", "__init__.py"), 'raise ImportError("no vtk here")\n');
    const adapter = await createEngineRegistry(root.load()).create("optiland");
    t.after(() => adapter.close());
    const error = await unavailable(adapter.describe(), "hello-failed");
    assert.match(
      error.message,
      /^engine optiland is unavailable \(hello-failed\): the engine refused hello \(engine-failure\): EngineUnavailable: /,
    );
    assert.match(
      error.message,
      /cannot import optiland \(ImportError: no vtk here\): set engines\.optiland\.python in /,
    );
    assert.match(error.message, /lvrtc\.local\.json \(or LVRTC_OPTILAND_PYTHON\)/);
  },
);

test(
  "a cache directory inside the directory optiland is imported from is hello-failed, and nothing is made there",
  { skip },
  async (t) => {
    // The configuration's cacheDir points into the fake's own directory, as one that pointed into a checkout would.
    const root = fakeOptilandRoot(t, { cacheDir: "../site/cache" });
    const before = filesUnder(root.site);
    const adapter = await createEngineRegistry(root.load()).create("optiland");
    t.after(() => adapter.close());
    const error = await unavailable(adapter.describe(), "hello-failed");
    assert.match(error.message, /cannot run optiland for the comparator: the numba cache /);
    assert.ok(
      error.message.endsWith(
        `${join(root.site, "cache", "optiland", "numba")} lies inside ${root.site}, which the worker must not write to`,
      ),
      error.message,
    );
    await adapter.close();
    assert.deepEqual(filesUnder(root.site), before);
    assert.equal(existsSync(join(root.site, "cache")), false, "refused before the directory was made");
  },
);

// ── Through the commands ─────────────────────────────────────────────────────────────────────────────────────────

/** A root with the two fixture cases, a suite of both on the rungs given, the engine `fake-a` and `config`. */
function suiteRoot(t: TestContext, rungs: readonly string[], fake?: ReturnType<typeof fakeOptilandRoot>): string {
  const rootDir = fake?.rootDir ?? rootWith(t, {});
  const engines = {
    "fake-a": { transport: "in-process", module: FAKE_ENGINE, options: { id: "fake-a" } },
    ...(fake === undefined ? {} : { optiland: { python: fake.python } }),
  };
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ engines }));
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "pair",
    defaults: { rungs },
    runs: [{ name: "singlet", lens: { kind: "fixture", path: "cases/singlet.json" } }],
  };
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
  mkdirSync(join(rootDir, "cases"));
  copyFileSync(caseFixture("singlet"), join(rootDir, "cases", "singlet.json"));
  return rootDir;
}

async function run(rootDir: string, args: readonly string[]): Promise<{ code: number; out: string; err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createRunCommand({ rootDir, env: {}, cwd: rootDir });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(["run", "suite.json", ...args], io, [command]);
  return { code, out: out.join(""), err: err.join("") };
}

test("lvrtc run: optiland without an interpreter is unavailable, and the other engine's jobs are done", async (t) => {
  const rootDir = suiteRoot(t, ["selftest"]);
  const ended = await run(rootDir, ["--engines", "fake-a,optiland"]);
  assert.equal(ended.code, EXIT_FAILURE);
  assert.match(ended.out, /^singlet {2}selftest {2}fake-a {4}ok {11}computed$/m);
  assert.match(
    ended.out,
    /^singlet {2}selftest {2}optiland {2}error {8}unavailable {2}not-configured: engine optiland is unavailable \(not-configured\): no interpreter is configured for it: set engines\.optiland\.python in lvrtc\.local\.json/m,
  );
  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "pair", MANIFEST_FILE), "utf8"));
  assert.deepEqual(
    manifest.engines.map((engine) => [engine.id, engine.status]),
    [
      ["fake-a", "available"],
      ["optiland", "unavailable"],
    ],
  );
});

test("lvrtc run --engines optiland: every rung's quantity is answered unsupported", { skip }, async (t) => {
  const fake = fakeOptilandRoot(t);
  const rootDir = suiteRoot(t, ["selftest", "r0", "r1"], fake);
  const ended = await run(rootDir, ["--engines", "fake-a,optiland", "--rungs", "selftest,r0"]);
  assert.equal(ended.err, "");
  assert.equal(ended.code, EXIT_OK, ended.out);
  const rows = ended.out.split("\n").filter((line) => line.includes("optiland"));
  assert.deepEqual(rows, [
    "singlet  selftest  optiland  unsupported  negotiated   the engine does not offer selftest.echo",
    "singlet  r0        optiland  unsupported  negotiated   the engine does not offer system.describe",
  ]);
  assert.match(ended.out, /^singlet {2}selftest {2}fake-a {4}ok {11}computed$/m);
  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "pair", MANIFEST_FILE), "utf8"));
  const engine = manifest.engines.find((entry) => entry.id === "optiland");
  assert.ok(engine !== undefined && engine.status === "available");
  assert.match(engine.fingerprint, SHA256);
  assert.match(engine.adapterRevision ?? "", SHA256);
  assert.ok(existsSync(join(rootDir, ".cache", "optiland", "numba")));
});

test(
  "lvrtc doctor's probe of this machine reports who the engine is, or why it cannot be used",
  { skip },
  async (t) => {
    const root = fakeOptilandRoot(t);
    const found = await systemProbe.optilandEngine(root.load());
    assert.equal(found.status, "available");
    assert.ok(found.status === "available");
    assert.match(found.fingerprint, SHA256);
    assert.match(found.adapterRevision ?? "", SHA256);
    assert.deepEqual(
      [found.details.jit, found.details.numpy, found.details.sourceFiles, found.details.commit],
      [true, "0.1.fake", 3, null],
    );

    const none = await systemProbe.optilandEngine(loadConfig({ rootDir: rootWith(t, {}), env: {} }));
    assert.deepEqual([none.status, none.status === "unavailable" && none.code], ["unavailable", "not-configured"]);
    assert.match(none.status === "unavailable" ? none.message : "", /lvrtc\.local\.json/);

    writeFileSync(join(root.site, "numba", "__init__.py"), "raise ImportError('no llvmlite')\n");
    const broken = await systemProbe.optilandEngine(root.load());
    assert.deepEqual([broken.status, broken.status === "unavailable" && broken.code], ["unavailable", "hello-failed"]);
    assert.match(
      broken.status === "unavailable" ? broken.message : "",
      /cannot import optiland \(ImportError: no llvmlite\)/,
    );
  },
);
