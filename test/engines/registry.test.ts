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
import { parseFakeOptions } from "../../src/engines/fake/options.ts";
import { TRANSPORT_FACTORIES, createEngineRegistry } from "../../src/engines/registry.ts";
import type { EngineRegistry, TransportContext, TransportFactories } from "../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { CASE, echoRequest } from "./support.ts";

const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));
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

function registryOf(rootDir: string, factories?: TransportFactories): EngineRegistry {
  return createEngineRegistry(loadConfig({ rootDir, env: {} }), factories);
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

test("the README's example is a valid configuration that defines the comparator's own fake engine", (t) => {
  const readme = readFileSync(join(REPO_ROOT, "README.md"), "utf8");
  const example = /An engine is defined under[^\n]*\n+```json\n([\s\S]*?)\n```/.exec(readme);
  assert.ok(example !== null, "the README has the example");
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
  // This stage implements the in-process transport alone; the stage that adds stdio adds its factory to the map.
  assert.deepEqual(Object.keys(TRANSPORT_FACTORIES), ["in-process"]);
  const rootDir = rootWith(t, {
    worker: { transport: "stdio", command: ["python3", "-m", "worker"] },
    fake: inProcess("fake.ts", { id: "fake" }),
  });
  const error = await unavailable(registryOf(rootDir).create("worker"), "unsupported-transport");
  assert.equal(
    error.message,
    'engine worker is unavailable (unsupported-transport): no transport "stdio" is implemented',
  );
  // The same holds for in-process when a caller's map leaves it out.
  await unavailable(registryOf(rootDir, {}).create("fake"), "unsupported-transport");
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
