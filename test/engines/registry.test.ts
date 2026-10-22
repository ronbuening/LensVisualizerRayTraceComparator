import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { CONFIG_FILE, REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import type { EngineDefinition } from "../../src/core/config.ts";
import { EngineUnavailableError } from "../../src/engines/adapter.ts";
import type { EngineUnavailableCode } from "../../src/engines/adapter.ts";
import { BUILTIN_ENGINES } from "../../src/engines/builtin.ts";
import type { BuiltinEngines } from "../../src/engines/builtin.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { parseFakeOptions } from "../../src/engines/fake/options.ts";
import { TRANSPORT_FACTORIES, createEngineRegistry, createEngineTransport } from "../../src/engines/registry.ts";
import type { EngineRegistry, TransportContext, TransportFactories } from "../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { INHERITED_VARIABLES } from "../../src/transports/stdio.ts";
import { CASE, echoRequest } from "./support.ts";

const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));
/** The fixture worker of the stdio transport's tests: it answers any message with what it was started with. */
const STDIO_WORKER = fileURLToPath(new URL("../fixtures/stdio-worker/worker.mjs", import.meta.url));
/** The TypeScript fake engine as a stdio worker. */
const STDIO_FAKE_ENGINE = fileURLToPath(new URL("../fixtures/stdio-worker/fakeEngine.mjs", import.meta.url));
/** A module that is the fake engine, wherever the file that holds this text is. */
const FAKE_MODULE = `export { createEngine } from ${JSON.stringify(pathToFileURL(FAKE_ENGINE).href)};\n`;
/** A module whose engine answers hello as the engine its options name, and refuses everything else. */
const TINY_MODULE = `
export function createEngine(options) {
  const error = { code: "tiny", message: JSON.stringify(options) };
  return (message) => ({ contract: message.contract, id: message.id, ok: false, error });
}
`;

/**
 * A fresh root directory with a configuration that defines `engines`, and the given files beside it. Node caches
 * modules by URL, so every test gets its own directory and so its own copy of each module.
 */
function rootWith(t: TestContext, engines: unknown, files: Record<string, string> = {}): string {
  const base = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-registry-")));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const rootDir = join(base, "project");
  for (const [name, text] of Object.entries({ [CONFIG_FILE]: JSON.stringify({ engines }), ...files })) {
    mkdirSync(dirname(join(rootDir, name)), { recursive: true });
    writeFileSync(join(rootDir, name), text);
  }
  return rootDir;
}

/** The registry of a root, without a built-in engine unless `builtins` gives some: what the configuration defines. */
function registryOf(rootDir: string, factories?: TransportFactories, builtins: BuiltinEngines = {}): EngineRegistry {
  return createEngineRegistry(loadConfig({ rootDir, env: {} }), factories, builtins);
}

/** The error a promise rejects with, which must be an `EngineUnavailableError` with this code. */
async function unavailable(promise: Promise<unknown>, code: EngineUnavailableCode): Promise<EngineUnavailableError> {
  const error = await promise.then(
    () => assert.fail(`resolved; expected the engine to be unavailable (${code})`),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof EngineUnavailableError, String(error));
  assert.equal(error.code, code, error.message);
  return error;
}

function inProcess(module: string, options?: Record<string, unknown>): Record<string, unknown> {
  return { transport: "in-process", module, ...(options === undefined ? {} : { options }) };
}

// ── Engines that work ────────────────────────────────────────────────────────────────────────────────────────────

test("an in-process engine is built from a module path relative to the configuration root, and answers", async (t) => {
  const rootDir = rootWith(
    t,
    {
      inside: inProcess("engines/fake.ts", { id: "inside" }),
      outside: inProcess("../shared/fake.ts", { id: "outside", bias: 1 }),
    },
    { "engines/fake.ts": FAKE_MODULE, "../shared/fake.ts": FAKE_MODULE },
  );
  const registry = registryOf(rootDir);

  const inside = await registry.create("inside");
  t.after(() => inside.close());
  assert.ok(inside instanceof RemoteEngineAdapter);
  assert.equal(inside.id, "inside");
  const descriptor = await inside.describe();
  assert.equal(descriptor.identity.id, "inside");
  assert.equal(descriptor.identity.fingerprint, parseFakeOptions({ id: "inside" }).fingerprint);
  const result = await inside.run(echoRequest(Float64Array.of(1, 2, 3), 2), CASE);
  assert.equal(result.status, "ok");
  assert.equal(result.data?.sum, 12);

  const outside = await registry.create("outside");
  t.after(() => outside.close());
  assert.equal((await outside.describe()).identity.id, "outside");
  assert.equal((await outside.run(echoRequest(Float64Array.of(1, 2, 3), 2), CASE)).data?.sum, 15);
});

test("an absolute module path is used as it is: the comparator's own fake engine, from any root", async (t) => {
  const registry = registryOf(rootWith(t, { fake: inProcess(FAKE_ENGINE, { id: "fake" }) }));
  const adapter = await registry.create("fake");
  t.after(() => adapter.close());
  assert.equal((await adapter.describe()).identity.id, "fake");
  assert.ok(FAKE_ENGINE.startsWith(REPO_ROOT));
});

test("the registry lists the configured engine ids, sorted", (t) => {
  const engines = {
    "fake-b": inProcess("fake.ts"),
    optiland: { python: "python3" },
    "fake-a": inProcess("fake.ts"),
    worker: { transport: "stdio", command: ["python3"] },
  };
  // An entry without a transport, such as optiland's interpreter alone, defines no engine.
  assert.deepEqual(registryOf(rootWith(t, engines)).ids(), ["fake-a", "fake-b", "worker"]);
  assert.deepEqual(registryOf(rootWith(t, {})).ids(), []);
});

test("one module serves several engines, each with its own options and its own handler", async (t) => {
  const rootDir = rootWith(
    t,
    {
      "fake-a": inProcess("fake.ts", { id: "fake-a" }),
      "fake-b": inProcess("fake.ts", { id: "fake-b", bias: 0.5 }),
      "fake-none": inProcess("fake.ts", { id: "fake-none", offersQuantities: false }),
    },
    { "fake.ts": FAKE_MODULE },
  );
  const registry = registryOf(rootDir);
  const adapters = await Promise.all(registry.ids().map((id) => registry.create(id)));
  t.after(() => Promise.all(adapters.map((adapter) => adapter.close())));

  const request = echoRequest(Float64Array.of(1, 1), 1);
  const results = await Promise.all(adapters.map((adapter) => adapter.run(request, CASE)));
  assert.deepEqual(
    results.map(({ engine, status, data }) => [engine.id, status, data?.sum]),
    [
      ["fake-a", "ok", 2],
      ["fake-b", "ok", 3],
      ["fake-none", "unsupported", undefined],
    ],
  );
  assert.equal(new Set(results.map(({ engine }) => engine.fingerprint)).size, 3);
});

test("every create builds a new adapter, and closing one leaves the other working", async (t) => {
  const registry = registryOf(rootWith(t, { fake: inProcess("fake.ts", { id: "fake" }) }, { "fake.ts": FAKE_MODULE }));
  const [first, second] = [await registry.create("fake"), await registry.create("fake")];
  t.after(() => second.close());
  assert.notEqual(first, second);
  await first.describe();
  await first.close();
  assert.equal((await second.run(echoRequest(Float64Array.of(4)), CASE)).data?.sum, 4);
});

test("create does not contact the engine: one that cannot say hello is found out by describe", async (t) => {
  const rootDir = rootWith(t, { tiny: inProcess("tiny.ts", { id: "tiny" }) }, { "tiny.ts": TINY_MODULE });
  const adapter = await registryOf(rootDir).create("tiny");
  t.after(() => adapter.close());
  const error = await unavailable(adapter.describe(), "hello-failed");
  assert.equal(
    error.message,
    'engine tiny is unavailable (hello-failed): the engine refused hello (tiny): {"id":"tiny"}',
  );
});

test("the module gets a copy of its options: it cannot change the configuration", async (t) => {
  const greedy = `
export function createEngine(options) {
  options.id = "changed";
  options.nested.list.push(4);
  return () => { throw new Error("unused"); };
}
`;
  const rootDir = rootWith(
    t,
    { greedy: inProcess("greedy.ts", { id: "greedy", nested: { list: [1, 2, 3] } }) },
    { "greedy.ts": greedy },
  );
  const loaded = loadConfig({ rootDir, env: {} });
  const adapter = await createEngineRegistry(loaded).create("greedy");
  t.after(() => adapter.close());
  assert.deepEqual(loaded.config.engineDefinitions.greedy.options, { id: "greedy", nested: { list: [1, 2, 3] } });
});

test("an engine without options is created with an empty object", async (t) => {
  const rootDir = rootWith(t, { tiny: inProcess("tiny.ts") }, { "tiny.ts": TINY_MODULE });
  const adapter = await registryOf(rootDir).create("tiny");
  t.after(() => adapter.close());
  const error = await unavailable(adapter.describe(), "hello-failed");
  assert.ok(error.message.endsWith("the engine refused hello (tiny): {}"), error.message);
});

test("the reference's example is a valid configuration that defines the comparator's own fake engine", (t) => {
  const reference = readFileSync(join(REPO_ROOT, "docs", "REFERENCE.md"), "utf8");
  const example = /An engine is defined under[^\n]*\n+```json\n([\s\S]*?)\n```/.exec(reference);
  assert.ok(example !== null, "docs/REFERENCE.md has the example");
  const rootDir = rootWith(t, (JSON.parse(example[1]) as { engines: unknown }).engines);
  const definitions = loadConfig({ rootDir, env: {} }).config.engineDefinitions;
  assert.deepEqual(Object.keys(definitions), ["fake-a", "worker"]);

  // The example is written for the repository root: read there, its module is the fake engine.
  const fake = definitions["fake-a"];
  assert.ok(fake.transport === "in-process");
  assert.equal(relative(rootDir, fake.module), relative(REPO_ROOT, FAKE_ENGINE));
  assert.equal(parseFakeOptions(fake.options).id, "fake-a");
});

// ── Engines that cannot be built ─────────────────────────────────────────────────────────────────────────────────

test("an engine id the configuration does not define is not-configured; the error says what is defined", async (t) => {
  const registry = registryOf(rootWith(t, { "fake-b": inProcess("fake.ts"), "fake-a": inProcess("fake.ts") }));
  for (const id of ["optiland", "fake", "fake-a ", "FAKE-A", ""]) {
    const error = await unavailable(registry.create(id), "not-configured");
    assert.equal(error.engineId, id);
    assert.equal(
      error.message,
      `engine ${id} is unavailable (not-configured): the configuration defines fake-a, fake-b`,
    );
  }
  // A name every object inherits a member for is not configured either.
  for (const id of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
    await unavailable(registry.create(id), "not-configured");
  }
  const empty = await unavailable(registryOf(rootWith(t, {})).create("fake"), "not-configured");
  assert.equal(empty.message, "engine fake is unavailable (not-configured): the configuration defines no engine");
});

test("a module that does not exist is load-failed, named by its path below the root", async (t) => {
  const rootDir = rootWith(t, { gone: inProcess("engines/gone.ts"), up: inProcess("../elsewhere/gone.ts") });
  const registry = registryOf(rootDir);
  const gone = await unavailable(registry.create("gone"), "load-failed");
  assert.equal(
    gone.message,
    `engine gone is unavailable (load-failed): its module ${join("engines", "gone.ts")} does not exist`,
  );
  // No absolute path: the message is the same wherever the project is checked out.
  assert.ok(!gone.message.includes(rootDir));
  const up = await unavailable(registry.create("up"), "load-failed");
  assert.ok(up.message.endsWith(`its module ${join("..", "elsewhere", "gone.ts")} does not exist`), up.message);
});

test("a module that fails while it is imported is load-failed, with the failure as the cause", async (t) => {
  const rootDir = rootWith(
    t,
    { throws: inProcess("throws.ts"), garbled: inProcess("garbled.ts"), folder: inProcess("folder") },
    {
      "throws.ts": 'throw new Error("no licence found");\n',
      "garbled.ts": "export const = ;\n",
      "folder/placeholder.txt": "",
    },
  );
  const registry = registryOf(rootDir);
  const throws = await unavailable(registry.create("throws"), "load-failed");
  assert.equal(
    throws.message,
    "engine throws is unavailable (load-failed): its module throws.ts could not be imported: no licence found",
  );
  assert.ok(throws.cause instanceof Error && throws.cause.message === "no licence found");

  const garbled = await unavailable(registry.create("garbled"), "load-failed");
  assert.match(
    garbled.message,
    /^engine garbled is unavailable \(load-failed\): its module garbled\.ts could not be imported: /,
  );
  assert.ok(garbled.cause instanceof Error);
  const folder = await unavailable(registry.create("folder"), "load-failed");
  assert.match(
    folder.message,
    /^engine folder is unavailable \(load-failed\): its module folder could not be imported: /,
  );
});

test("a module without a createEngine function is bad-module", async (t) => {
  const rootDir = rootWith(
    t,
    { none: inProcess("none.ts"), text: inProcess("text.ts"), other: inProcess("other.ts") },
    {
      "none.ts": "export const engine = 1;\n",
      "text.ts": 'export const createEngine = "soon";\n',
      // The export must be named createEngine: a default export is not looked at.
      "other.ts": "export default function createEngine() { return () => {}; }\n",
    },
  );
  const registry = registryOf(rootDir);
  for (const id of registry.ids()) {
    const error = await unavailable(registry.create(id), "bad-module");
    assert.equal(
      error.message,
      `engine ${id} is unavailable (bad-module): its module ${id}.ts does not export a createEngine function`,
    );
  }
});

test("a createEngine that throws, as the fake does for options it does not know, is create-failed", async (t) => {
  const rootDir = rootWith(
    t,
    {
      typo: inProcess("fake.ts", { id: "typo", baias: 0.1 }),
      nameless: inProcess("fake.ts"),
      hollow: inProcess("hollow.ts"),
      later: inProcess("later.ts"),
    },
    {
      "fake.ts": FAKE_MODULE,
      "hollow.ts": "export function createEngine() { return { hello: true }; }\n",
      // A promise of a handler is not a handler.
      "later.ts": "export async function createEngine() { return () => {}; }\n",
    },
  );
  const registry = registryOf(rootDir);
  const typo = await unavailable(registry.create("typo"), "create-failed");
  assert.equal(
    typo.message,
    "engine typo is unavailable (create-failed): createEngine of fake.ts threw: " +
      'fake engine: unknown option "baias" (it has bias, failMode, fingerprint, id, offersQuantities)',
  );
  assert.ok(typo.cause instanceof Error);
  const nameless = await unavailable(registry.create("nameless"), "create-failed");
  assert.match(nameless.message, /createEngine of fake\.ts threw: fake engine: option "id" must be an engine id/);

  for (const id of ["hollow", "later"]) {
    const error = await unavailable(registry.create(id), "create-failed");
    assert.equal(
      error.message,
      `engine ${id} is unavailable (create-failed): createEngine of ${id}.ts returned object, not a protocol handler`,
    );
  }
});

// ── Transports ───────────────────────────────────────────────────────────────────────────────────────────────────

test("a definition whose transport has no factory is unsupported-transport", async (t) => {
  // Every transport a definition can name is implemented; a caller's own map may leave one out.
  assert.deepEqual(Object.keys(TRANSPORT_FACTORIES), ["in-process", "stdio"]);
  const rootDir = rootWith(t, {
    worker: { transport: "stdio", command: ["python3", "-m", "worker"] },
    fake: inProcess("fake.ts", { id: "fake" }),
  });
  const inProcessOnly = { "in-process": TRANSPORT_FACTORIES["in-process"] };
  const error = await unavailable(registryOf(rootDir, inProcessOnly).create("worker"), "unsupported-transport");
  assert.equal(
    error.message,
    'engine worker is unavailable (unsupported-transport): no transport "stdio" is implemented',
  );
  await unavailable(registryOf(rootDir, {}).create("fake"), "unsupported-transport");
  await unavailable(createEngineTransport(loadConfig({ rootDir, env: {} }), "fake", {}), "unsupported-transport");
});

test("a stdio definition is a worker process: started by describe, in the root, with its options and env", async (t) => {
  const rootDir = rootWith(
    t,
    {
      "fake-node": {
        transport: "stdio",
        command: [process.execPath, "${root}/worker.mjs"],
        options: { id: "fake-node", bias: 0.5 },
        env: { WORKER_NOTE: "from ${root}" },
      },
      inspector: { transport: "stdio", command: [process.execPath, STDIO_WORKER, "well"], env: { WORKER_NOTE: "x" } },
    },
    { "worker.mjs": `import ${JSON.stringify(pathToFileURL(STDIO_FAKE_ENGINE).href)};\n` },
  );
  const adapter = await registryOf(rootDir).create("fake-node");
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  // The configured options reached the worker, through LVRTC_ENGINE_OPTIONS.
  assert.deepEqual(descriptor.identity.details, { bias: 0.5, offersQuantities: true, failMode: "none" });
  assert.equal(descriptor.identity.fingerprint, parseFakeOptions({ id: "fake-node", bias: 0.5 }).fingerprint);
  const result = await adapter.run(echoRequest(Float64Array.of(2, 3)), CASE);
  assert.equal(result.status, "ok");
  assert.equal(result.data?.sum, 6);

  // What the worker was started with, as a worker that reports it says.
  const transport = await createEngineTransport(loadConfig({ rootDir, env: {} }), "inspector");
  t.after(() => transport.close());
  assert.equal(transport.kind, "stdio");
  await transport.open();
  const reply = await transport.call({ contract: "1.0", id: "1", method: "hello", params: {} }, { timeoutMs: 30_000 });
  const seen = (reply as unknown as { result: { cwd: string; env: Record<string, string> } }).result;
  assert.equal(seen.cwd, rootDir);
  const set = { PYTHONDONTWRITEBYTECODE: "1", PYTHONUNBUFFERED: "1", LVRTC_ENGINE_OPTIONS: "{}", WORKER_NOTE: "x" };
  assert.partialDeepStrictEqual(seen.env, set);
  // Beside those, only the few variables a program needs to start: nothing else of this process is passed on.
  // (macOS gives every process a variable of its own, which no parent can withhold.)
  const others = Object.keys(seen.env).filter((name) => !Object.hasOwn(set, name) && !name.startsWith("__CF"));
  assert.deepEqual(
    others.filter((name) => !(INHERITED_VARIABLES as readonly string[]).includes(name)),
    [],
  );
});

test("a stdio engine whose command does not start, or is no engine, is unavailable when it is described", async (t) => {
  const rootDir = rootWith(t, {
    nowhere: { transport: "stdio", command: ["lvrtc-no-such-command"] },
    quitter: { transport: "stdio", command: [process.execPath, STDIO_WORKER, "exit-on-start"] },
    stranger: { transport: "stdio", command: [process.execPath, STDIO_WORKER, "well"] },
  });
  const registry = registryOf(rootDir);
  // Building the adapter starts nothing: the engine is found unavailable when it is first needed.
  const [nowhere, quitter, stranger] = await Promise.all(
    ["nowhere", "quitter", "stranger"].map((id) => registry.create(id)),
  );
  t.after(() => Promise.all([nowhere.close(), quitter.close(), stranger.close()]));

  const missing = await unavailable(nowhere.describe(), "spawn-failed");
  assert.equal(
    missing.message,
    "engine nowhere is unavailable (spawn-failed): its stdio transport did not open: stdio worker: " +
      "the command lvrtc-no-such-command did not start: spawn lvrtc-no-such-command ENOENT",
  );
  const gone = await unavailable(quitter.describe(), "hello-failed");
  assert.match(gone.message, /the transport failed: stdio worker: the worker exited with code 2/);
  assert.match(gone.message, /its log ends: cannot start: the licence file is missing$/);
  // A worker that answers, but not with a descriptor.
  await unavailable(stranger.describe(), "bad-descriptor");
});

test("a factory in the map builds the transport of its kind, from the definition and the context", async (t) => {
  const rootDir = rootWith(t, {
    worker: {
      transport: "stdio",
      command: ["./bin/worker", "--stdio"],
      options: { id: "worker" },
      env: { MODE: "test" },
    },
  });
  const seen: [EngineDefinition, TransportContext][] = [];
  const factories: TransportFactories = {
    ...TRANSPORT_FACTORIES,
    stdio: async (definition, context) => {
      seen.push([definition, context]);
      // Stands in for a worker process: an engine in this process that answers as the worker would.
      const { createEngine } = await import(pathToFileURL(FAKE_ENGINE).href);
      return createInProcessTransport(createEngine(definition.options));
    },
  };
  const adapter = await registryOf(rootDir, factories).create("worker");
  t.after(() => adapter.close());
  assert.deepEqual(seen, [
    [
      {
        transport: "stdio",
        command: [join(rootDir, "bin", "worker"), "--stdio"],
        options: { id: "worker" },
        env: { MODE: "test" },
      },
      { engineId: "worker", rootDir },
    ],
  ]);
  assert.equal((await adapter.describe()).identity.id, "worker");
  assert.equal((await adapter.run(echoRequest(Float64Array.of(2, 3)), CASE)).data?.sum, 5);
});

test("what a factory rejects with is what create rejects with", async (t) => {
  const rootDir = rootWith(t, { worker: { transport: "stdio", command: ["nowhere"] } });
  const failure = new EngineUnavailableError("worker", "spawn-failed", "nowhere did not start");
  const factories: TransportFactories = {
    stdio: async () => {
      throw failure;
    },
  };
  assert.equal(await unavailable(registryOf(rootDir, factories).create("worker"), "spawn-failed"), failure);
});

// ── Built-in engines ─────────────────────────────────────────────────────────────────────────────────────────────

test("the built-in engines are lv, optiland, ref, replay, wave and wave, and the registry lists them apart from the configured ones", (t) => {
  assert.deepEqual(Object.keys(BUILTIN_ENGINES), ["lv", "optiland", "ref", "replay", "wave"]);
  assert.ok(Object.isFrozen(BUILTIN_ENGINES));
  const registry = createEngineRegistry(
    loadConfig({ rootDir: rootWith(t, { fake: inProcess(FAKE_ENGINE) }), env: {} }),
  );
  assert.deepEqual(registry.ids(), ["fake"]);
  assert.deepEqual(registry.builtinIds(), ["lv", "optiland", "ref", "replay", "wave"]);
  assert.deepEqual(registryOf(rootWith(t, {})).builtinIds(), []);
});

test("a built-in engine is made without a definition, under any root, and answers as the engine it is", async (t) => {
  const registry = createEngineRegistry(loadConfig({ rootDir: rootWith(t, {}), env: {} }));
  const adapter = await registry.create("ref");
  t.after(() => adapter.close());
  assert.ok(adapter instanceof RemoteEngineAdapter);
  const descriptor = await adapter.describe();
  assert.equal(descriptor.identity.id, "ref");
  assert.deepEqual(Object.keys(descriptor.capabilities.quantities).sort(), [
    "paraxial.first-order",
    "rays.trace",
    "system.describe",
  ]);
  // It does not answer the conformance quantity, and says so as an answer.
  assert.equal((await adapter.run(echoRequest(Float64Array.of(1)), CASE)).status, "unsupported");
});

test("a built-in engine is given the configuration, and one made for each adapter", async (t) => {
  const rootDir = rootWith(t, {});
  const seen: string[] = [];
  const builtins: BuiltinEngines = {
    "fake-in": (loaded) => {
      seen.push(loaded.rootDir);
      return createEngine({ id: "fake-in", bias: seen.length });
    },
    later: async () => createEngine({ id: "later" }),
  };
  const registry = registryOf(rootDir, undefined, builtins);
  assert.deepEqual(registry.builtinIds(), ["fake-in", "later"]);
  const [first, second, later] = [
    await registry.create("fake-in"),
    await registry.create("fake-in"),
    await registry.create("later"),
  ];
  t.after(() => Promise.all([first, second, later].map((adapter) => adapter.close())));
  assert.deepEqual(seen, [rootDir, rootDir]);
  assert.equal((await first.run(echoRequest(Float64Array.of(1)), CASE)).data?.sum, 2);
  assert.equal((await second.run(echoRequest(Float64Array.of(1)), CASE)).data?.sum, 3);
  assert.equal((await later.describe()).identity.id, "later");
});

test("a definition replaces a built-in engine of the same id", async (t) => {
  const rootDir = rootWith(t, { ref: inProcess(FAKE_ENGINE, { id: "ref" }) });
  const registry = createEngineRegistry(loadConfig({ rootDir, env: {} }));
  assert.deepEqual(registry.ids(), ["ref"]);
  assert.deepEqual(registry.builtinIds(), ["lv", "optiland", "ref", "replay", "wave"]);
  const adapter = await registry.create("ref");
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.equal(descriptor.identity.fingerprint, parseFakeOptions({ id: "ref" }).fingerprint, "the fake, as configured");
});

test("a built-in engine that cannot be made is create-failed, and one that is not its id is id-mismatch", async (t) => {
  const builtins: BuiltinEngines = {
    broken: () => {
      throw new Error("no LensVisualizer is configured");
    },
    rejecting: () => Promise.reject(new Error("later")),
    misnamed: () => createEngine({ id: "someone-else" }),
  };
  const registry = registryOf(rootWith(t, {}), undefined, builtins);
  const broken = await unavailable(registry.create("broken"), "create-failed");
  assert.equal(
    broken.message,
    "engine broken is unavailable (create-failed): the built-in engine could not be made: " +
      "no LensVisualizer is configured",
  );
  await unavailable(registry.create("rejecting"), "create-failed");
  const misnamed = await registry.create("misnamed");
  t.after(() => misnamed.close());
  await unavailable(misnamed.describe(), "id-mismatch");
});

test("a built-in engine that says why it cannot be used is unavailable with its own code and words", async (t) => {
  const reason = new EngineUnavailableError("needy", "load-failed", "what it runs is not there");
  const builtins: BuiltinEngines = {
    needy: () => {
      throw reason;
    },
    later: () => Promise.reject(new EngineUnavailableError("later", "not-configured", "nothing says where it is")),
  };
  const registry = registryOf(rootWith(t, {}), undefined, builtins);
  assert.equal(await unavailable(registry.create("needy"), "load-failed"), reason);
  const later = await unavailable(registry.create("later"), "not-configured");
  assert.equal(later.message, "engine later is unavailable (not-configured): nothing says where it is");
});

test("an id that is neither configured nor built in is not-configured, and the error lists both", async (t) => {
  const rootDir = rootWith(t, { "fake-a": inProcess(FAKE_ENGINE, { id: "fake-a" }) });
  const builtins: BuiltinEngines = {
    zeta: () => createEngine({ id: "zeta" }),
    alpha: () => createEngine({ id: "alpha" }),
  };
  const error = await unavailable(registryOf(rootDir, undefined, builtins).create("optiland"), "not-configured");
  assert.equal(
    error.message,
    "engine optiland is unavailable (not-configured): the configuration defines fake-a; built in: alpha, zeta",
  );
  const bare = await unavailable(registryOf(rootWith(t, {}), undefined, builtins).create("ref"), "not-configured");
  assert.equal(
    bare.message,
    "engine ref is unavailable (not-configured): the configuration defines no engine; built in: alpha, zeta",
  );
  // A name every object inherits a member for is no built-in engine either.
  await unavailable(registryOf(rootDir, undefined, builtins).create("constructor"), "not-configured");
});
