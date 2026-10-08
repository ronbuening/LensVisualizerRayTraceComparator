// The Python fake engine, as the comparator reaches it: a stdio worker behind a RemoteEngineAdapter. It must be
// interchangeable with the TypeScript fake, byte for byte. These tests need Python 3.10 or later and are skipped,
// with the reason, where there is none; everything else about the stdio path is tested without it.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { EXIT_OK } from "../../src/cli/main.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { STORE_DIRECTORY } from "../../src/core/resultStore.ts";
import { runConformance } from "../../src/engines/conformance.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { createEngineRegistry, createEngineTransport } from "../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { createStdioTransport, workerEnvironment } from "../../src/transports/stdio.ts";
import type { StdioTransport } from "../../src/transports/stdio.ts";
import { REQUEST_MINIMAL, SELFTEST_ECHO_EXAMPLES, edited, f8FromBits, REMOVE } from "../contract/corpus.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "../core/support.ts";
import {
  CASE,
  PYTHON,
  PYTHON_MISSING,
  WORKER_KIT_PATH,
  bitsOf,
  echoRequest,
  echoRequestFor,
  echoedValues,
} from "./support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const skip = PYTHON_MISSING;
/** A fingerprint both fakes are given, so that their results can be equal in every member. */
const FINGERPRINT = "interchangeable-1";

/** The fixture root as the tests' interpreter sees it: `${python}` in its configuration is `PYTHON`. */
function fixtureRoot(): ReturnType<typeof loadConfig> {
  return loadConfig({ rootDir: FAKE_ROOT, env: { LVRTC_PYTHON: PYTHON } });
}

/** The Python fake as a worker with these options, and the TypeScript fake in this process with the same. */
function bothFakes(
  t: TestContext,
  options: Record<string, unknown>,
): { python: RemoteEngineAdapter; typescript: RemoteEngineAdapter; worker: StdioTransport } {
  const worker = createStdioTransport({
    command: [PYTHON, "-m", "lvrtc_worker_kit.fake_engine"],
    env: workerEnvironment(process.env, options, { PYTHONPATH: WORKER_KIT_PATH }),
    cwd: tempDir(t),
  });
  const python = new RemoteEngineAdapter({ id: String(options.id), transport: worker });
  const typescript = new RemoteEngineAdapter({
    id: String(options.id),
    transport: createInProcessTransport(createEngine(options)),
  });
  t.after(() => Promise.all([python.close(), typescript.close()]));
  return { python, typescript, worker };
}

/** Requests that reach every rule of `selftest.echo`, and the two answers that are not data. */
function requests(): QuantityRequest[] {
  const examples = Object.values(SELFTEST_ECHO_EXAMPLES).map((example) => echoRequestFor(example.spec));
  const specials = f8FromBits(
    0x7ff8_dead_beef_cafen,
    0xfff4_0000_00c0_ffeen,
    0x8000_0000_0000_0000n,
    0x7ff0_0000_0000_0000n,
    0xfff0_0000_0000_0000n,
    0x0000_0000_0000_0001n,
    0x800f_ffff_ffff_ffffn,
    0x7fef_ffff_ffff_ffffn,
    0x0010_0000_0000_0000n,
  );
  // Numbers whose products and partial sums all round: any other order or kind of arithmetic gives other bits.
  const awkward = Float64Array.from({ length: 257 }, (_, index) => Math.sin(index * 1.7) * 10 ** ((index % 40) - 20));
  return [
    ...examples,
    echoRequest(specials),
    echoRequest(specials, 0),
    echoRequest(specials, -1e-300),
    echoRequest(awkward, 0.1),
    echoRequest(awkward, 1 / 3, [257, 1]),
    echoRequest(Float64Array.of(0.1, 0.2, 0.3, 1e16, 1, -1e16), 3, [2, 3]),
    echoRequest(new Float64Array(0), 2, [0, 5]),
    echoRequest(Float64Array.of(1e308, 1e308), 10),
    REQUEST_MINIMAL,
    makeRequest({
      caseId: CASE.id,
      quantity: "selftest.echo",
      spec: edited(SELFTEST_ECHO_EXAMPLES.matrix.spec, "/scale", REMOVE) as Record<string, unknown>,
    }),
  ];
}

test("the Python fake describes itself as the TypeScript fake does, but for its fingerprint", { skip }, async (t) => {
  const { python, typescript } = bothFakes(t, { id: "fake", bias: 0.25 });
  const [fromPython, fromTypescript]: EngineDescriptor[] = [await python.describe(), await typescript.describe()];
  assert.deepEqual(fromPython.capabilities, fromTypescript.capabilities);
  assert.deepEqual(fromPython.contract, fromTypescript.contract);
  const { fingerprint, ...identity } = fromPython.identity;
  assert.deepEqual(identity, {
    id: "fake",
    version: "1",
    details: { bias: 0.25, offersQuantities: true, failMode: "none" },
  });
  // Its own fingerprint is a hash of its own sources: Python cannot compute the TypeScript fake's.
  assert.match(fingerprint, /^[0-9a-f]{64}$/);
  assert.notEqual(fingerprint, fromTypescript.identity.fingerprint);

  const none = bothFakes(t, { id: "fake-none", offersQuantities: false });
  assert.deepEqual((await none.python.describe()).capabilities, (await none.typescript.describe()).capabilities);
});

test(
  "for one request the two fakes give byte-identical results: arrays, sums, refusals and all",
  { skip },
  async (t) => {
    for (const options of [{ id: "fake" }, { id: "fake", bias: 0.001 }, { id: "fake", bias: -1e300 }]) {
      const { python, typescript } = bothFakes(t, { ...options, fingerprint: FINGERPRINT });
      const statuses = new Set<string>();
      for (const request of requests()) {
        const [fromPython, fromTypescript]: ResultEnvelope[] = [
          await python.run(request, CASE),
          await typescript.run(request, CASE),
        ];
        const label = `${JSON.stringify(options)} ${request.quantity} ${request.id.slice(0, 8)}`;
        assert.equal(canonicalJson(fromPython), canonicalJson(fromTypescript), label);
        statuses.add(fromPython.status);
        if (fromPython.status !== "ok") continue;
        // Said again without JSON in between: the same bits in every element, and the same sum.
        assert.deepEqual(bitsOf(echoedValues(fromPython)), bitsOf(echoedValues(fromTypescript)), label);
        assert.ok(Object.is(fromPython.data?.sum, fromTypescript.data?.sum), label);
      }
      assert.deepEqual([...statuses].sort(), ["error", "ok", "unsupported"]);
    }
  },
);

test("the Python fake answers the contract's examples byte for byte, through the adapter", { skip }, async (t) => {
  const { python } = bothFakes(t, { id: "fake" });
  for (const [name, { spec, data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    const result = await python.run(echoRequestFor(spec), CASE);
    assert.equal(result.status, "ok", name);
    assert.deepEqual(result.data, data, name);
  }
});

test("a run that is no request is refused by the worker, and the worker goes on answering", { skip }, async (t) => {
  const { python, worker } = bothFakes(t, { id: "fake" });
  const request = echoRequest(Float64Array.of(1, 2));
  const { spec: _spec, ...withoutSpec } = request;
  const refused = await python.run(withoutSpec as QuantityRequest, CASE);
  assert.equal(refused.status, "error");
  assert.deepEqual(refused.error, {
    code: "protocol-error",
    message:
      "the engine refused the message (bad-request): params.request is not a valid request: " +
      '(root) [required] missing property "spec"',
  });
  assert.equal((await python.run(request, CASE)).data?.sum, 3);
  await python.close();
  assert.deepEqual(worker.exitStatus(), { code: 0, signal: null, forced: false });
});

test("the fixture root's fake-py passes the conformance kit", { skip }, async () => {
  const loaded = fixtureRoot();
  const report = await runConformance({
    id: "fake-py",
    createTransport: () => createEngineTransport(loaded, "fake-py"),
  });
  assert.deepEqual(
    report.checks.filter((check) => check.status !== "pass"),
    [],
  );
  assert.equal(report.passed, true);
  assert.equal(report.checks.length, 15);
  assert.equal(report.checks.at(-1)?.detail, "the worker ended by itself with exit code 0");
});

test(
  "fake-py is configured with placeholders, and its worker is the kit beside this repository",
  { skip },
  async (t) => {
    const bytecode = join(WORKER_KIT_PATH, "lvrtc_worker_kit", "__pycache__");
    const hadBytecode = existsSync(bytecode);
    const loaded = fixtureRoot();
    assert.deepEqual(loaded.config.engineDefinitions["fake-py"], {
      transport: "stdio",
      command: [PYTHON, "-m", "lvrtc_worker_kit.fake_engine"],
      options: { id: "fake-py" },
      env: { PYTHONPATH: `${FAKE_ROOT}/../../../workers/python` },
    });
    const adapter = await createEngineRegistry(loaded).create("fake-py");
    t.after(() => adapter.close());
    assert.equal((await adapter.describe()).identity.id, "fake-py");
    assert.equal((await adapter.run(echoRequest(Float64Array.of(2, 3)), CASE)).data?.sum, 5);
    // The worker writes nothing beside the kit's sources: PYTHONDONTWRITEBYTECODE is part of its environment.
    await adapter.close();
    assert.equal(existsSync(bytecode), hadBytecode);
  },
);

test(
  "lvrtc run on the whole fixture root: fake-py computes what fake-a computes, and is cached like it",
  { skip },
  (t) => {
    const runsDir = join(tempDir(t), "runs");
    const run = (): { code: number | null; out: string; err: string } => {
      const child = spawnSync(process.execPath, [BIN, "run", FAKE_PAIR_SUITE, "--root", FAKE_ROOT], {
        encoding: "utf8",
        cwd: REPO_ROOT,
        env: { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_PYTHON: PYTHON },
      });
      return { code: child.status, out: child.stdout, err: child.stderr };
    };
    const first = run();
    assert.equal(first.code, EXIT_OK, first.out + first.err);
    assert.match(first.out, /^singlet {7}selftest {2}fake-py {4}ok {11}computed$/m);
    assert.match(first.out, /^double-gauss {2}selftest {2}fake-py {4}ok {11}computed$/m);
    assert.match(
      first.out,
      /^fake-pair: 12 jobs: 10 ok, 2 unsupported, 0 error, 0 pending \(10 computed, 0 cached\)$/m,
    );

    const manifestPath = join(runsDir, "fake-pair", MANIFEST_FILE);
    const manifestText = readFileSync(manifestPath, "utf8");
    const manifest: RunManifest = JSON.parse(manifestText);
    assert.deepEqual(
      manifest.engines.map((engine) => engine.id),
      ["fake-a", "fake-b", "fake-near", "fake-none", "fake-py", "fake-pyn"],
    );
    // The stored answers of the two unbiased fakes hold the same data, byte for byte.
    const stored = readdirSync(join(runsDir, STORE_DIRECTORY)).map(
      (file): ResultEnvelope => JSON.parse(readFileSync(join(runsDir, STORE_DIRECTORY, file), "utf8")).result,
    );
    assert.equal(stored.length, 10);
    const dataOf = (engine: string): string[] =>
      stored
        .filter((result) => result.engine.id === engine)
        .map((result) => canonicalJson([result.requestId, result.data]))
        .sort();
    assert.equal(dataOf("fake-py").length, 2);
    assert.deepEqual(dataOf("fake-py"), dataOf("fake-a"));
    assert.notDeepEqual(dataOf("fake-py"), dataOf("fake-b"));
    // The two fakes with the same small bias agree with each other bit for bit, and with neither of the unbiased.
    assert.deepEqual(dataOf("fake-pyn"), dataOf("fake-near"));
    assert.notDeepEqual(dataOf("fake-pyn"), dataOf("fake-py"));

    const second = run();
    assert.equal(second.code, EXIT_OK, second.err);
    assert.match(second.out, /\(0 computed, 10 cached\)$/m);
    assert.equal(readFileSync(manifestPath, "utf8"), manifestText);
    assert.equal(existsSync(join(runsDir, "fake-pair")), true);
  },
);
