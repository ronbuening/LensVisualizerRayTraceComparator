// The file-exchange transport on its own and behind the adapter: hello from the configured descriptor, a run that
// hands its job over once and is pending, an answer in the inbox that is the reply as it is, and a run that moves
// nothing. The engine is the comparator's TypeScript fake, whose answers stand for an operator's.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import type { EngineDescriptor } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { EngineUnavailableError } from "../../src/engines/adapter.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { PRESCRIPTION_WRITERS } from "../../src/exchange/prescription.ts";
import {
  FileExchangeError,
  JOB_FILES,
  createFileExchangeTransport,
  exchangeDirectory,
  jobName,
} from "../../src/transports/fileExchange.ts";
import type { FileExchangeTransport } from "../../src/transports/fileExchange.ts";
import { tempDir } from "../core/support.ts";
import { CASE, echoRequest, runMessage } from "../engines/support.ts";

/** What the fake engine of this id says of itself: the descriptor an operator's definition states. */
async function descriptorOf(id: string): Promise<EngineDescriptor> {
  const reply = await createEngine({ id })({ contract: CONTRACT_VERSION, id: "1", method: "hello", params: {} });
  if (!reply.ok) throw new Error("the fake engine refused hello");
  return reply.result as EngineDescriptor;
}

/** The fake engine's own answer to `request`: what a careful operator would write into the inbox. */
async function answerOf(id: string, request: QuantityRequest): Promise<ResultEnvelope> {
  const reply = await createEngine({ id })(runMessage(request));
  if (!reply.ok) throw new Error("the fake engine refused run");
  return reply.result as ResultEnvelope;
}

interface Exchange {
  readonly directory: string;
  readonly descriptor: EngineDescriptor;
  readonly transport: FileExchangeTransport;
  readonly adapter: RemoteEngineAdapter;
}

/** A file-exchange engine `human` under a temporary runs directory, its adapter closed when the test ends. */
async function exchangeIn(t: TestContext, descriptor?: JsonObject): Promise<Exchange> {
  const said = await descriptorOf("human");
  const directory = exchangeDirectory(join(tempDir(t), "runs"), "human");
  const transport = createFileExchangeTransport({
    directory,
    descriptor: descriptor ?? (said as unknown as JsonObject),
    prescriptions: ["table"],
    options: { id: "human" },
  });
  const adapter = new RemoteEngineAdapter({ id: "human", transport });
  t.after(() => adapter.close());
  return { directory, descriptor: said, transport, adapter };
}

/** Every file below `directory`, as relative paths with their contents, sorted. */
function tree(directory: string): [string, string][] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry): [string, string] => {
      const path = join(entry.parentPath, entry.name);
      return [path.slice(directory.length + 1), readFileSync(path, "utf8")];
    })
    .sort(([a], [b]) => (a < b ? -1 : 1));
}

const REQUEST = echoRequest(Float64Array.of(1.5, -0, 2 ** -1074));

test("hello is answered with the configured descriptor, which the adapter judges as any engine's", async (t) => {
  const { adapter, descriptor, directory } = await exchangeIn(t);
  assert.deepEqual(await adapter.describe(), descriptor);
  // Nothing is made until a job is handed over.
  assert.equal(existsSync(directory), false);

  const other = await exchangeIn(t, (await descriptorOf("someone-else")) as unknown as JsonObject);
  await assert.rejects(other.adapter.describe(), (error: unknown) => {
    assert.ok(error instanceof EngineUnavailableError);
    assert.equal(error.code, "id-mismatch");
    return true;
  });
  const broken = await exchangeIn(t, { identity: { id: "human" } });
  await assert.rejects(broken.adapter.describe(), { code: "bad-descriptor" });
});

test("shutdown is answered with an empty object, and a call before open or after close is refused", async (t) => {
  const { transport } = await exchangeIn(t);
  const shutdown: ProtocolRequest = { contract: CONTRACT_VERSION, id: "9", method: "shutdown", params: {} };
  await assert.rejects(transport.call(shutdown, { timeoutMs: 1 }), /call\(\) before open\(\)/);
  await transport.open();
  assert.deepEqual(await transport.call(shutdown, { timeoutMs: 1 }), {
    contract: CONTRACT_VERSION,
    id: "9",
    ok: true,
    result: {},
  });
  await transport.close();
  await assert.rejects(transport.call(shutdown, { timeoutMs: 1 }), /call\(\) after close\(\)/);
  await assert.rejects(transport.open(), /open\(\) after close\(\)/);
});

test("a run hands its job over to the outbox whole, and is pending with a warning that names the job", async (t) => {
  const { adapter, descriptor, directory } = await exchangeIn(t);
  const result = await adapter.run(REQUEST, CASE);
  const job = jobName(REQUEST, descriptor);
  assert.equal(result.status, "pending");
  assert.equal(result.requestId, REQUEST.id);
  assert.equal(result.engine.fingerprint, descriptor.identity.fingerprint);
  assert.deepEqual(result.diagnostics.warnings, [
    `job ${job} is in exchange/human/outbox: answer it as inbox/${job}.json and run lvrtc collect`,
  ]);

  const files = tree(directory);
  assert.deepEqual(
    files.map(([path]) => path),
    ["answer-template.json", "job.json", "message.json", "prescription-table.txt"].map((file) =>
      join("outbox", job, file),
    ),
  );
  const read = (file: string): string => readFileSync(join(directory, "outbox", job, file), "utf8");
  // The message is the run message under the job's name, so that it is the same bytes whoever handed it over.
  const message = { contract: CONTRACT_VERSION, id: job, method: "run", params: { request: REQUEST, case: CASE } };
  assert.equal(read(JOB_FILES.message), `${canonicalJson(message)}\n`);
  assert.equal(read("prescription-table.txt"), PRESCRIPTION_WRITERS.table.write(CASE, REQUEST));
  assert.deepEqual(JSON.parse(read(JOB_FILES.job)), {
    engine: "human",
    job,
    answer: `inbox/${job}.json`,
    options: { id: "human" },
    files: ["message.json", "prescription-table.txt", "answer-template.json"],
  });
  const template = JSON.parse(read(JOB_FILES.template)) as ResultEnvelope;
  assert.deepEqual(
    [template.requestId, template.caseId, template.engine, template.status, template.data],
    [REQUEST.id, CASE.id, result.engine, "ok", {}],
  );
});

test("a job in the outbox or in pending is not handed over again", async (t) => {
  const { adapter, descriptor, directory } = await exchangeIn(t);
  const job = jobName(REQUEST, descriptor);
  await adapter.run(REQUEST, CASE);
  // A file the run would rewrite is changed: a second run leaves the job as it is.
  writeFileSync(join(directory, "outbox", job, JOB_FILES.message), "taken by hand\n");
  const before = tree(directory);
  assert.equal((await adapter.run(REQUEST, CASE)).status, "pending");
  assert.deepEqual(tree(directory), before);

  // The operator takes the job: it is in pending, and a run neither hands it over again nor moves it back.
  mkdirSync(join(directory, "pending"));
  renameSync(join(directory, "outbox", job), join(directory, "pending", job));
  const taken = tree(directory);
  const result = await adapter.run(REQUEST, CASE);
  assert.equal(result.status, "pending");
  assert.match(result.diagnostics.warnings[0], /is in exchange\/human\/pending:/);
  assert.deepEqual(tree(directory), taken);
  assert.deepEqual(readdirSync(join(directory, "outbox")), []);
});

test("a job is named by its store key: the request's engine options make another job", async (t) => {
  const { adapter, descriptor, directory } = await exchangeIn(t);
  const finer = makeRequest({ ...REQUEST, engineOptions: { rays: 512 } });
  assert.equal(finer.id, REQUEST.id);
  await adapter.run(REQUEST, CASE);
  await adapter.run(finer, CASE);
  const jobs = [jobName(REQUEST, descriptor), jobName(finer, descriptor)];
  assert.notEqual(jobs[0], jobs[1]);
  assert.deepEqual(readdirSync(join(directory, "outbox")).sort(), [...jobs].sort());
});

test("an answer in the inbox is the reply as it is, the adapter judges it, and nothing is moved", async (t) => {
  const { adapter, descriptor, directory, transport } = await exchangeIn(t);
  const job = jobName(REQUEST, descriptor);
  await adapter.run(REQUEST, CASE);
  const inbox = join(directory, "inbox");
  mkdirSync(inbox);
  const answer = await answerOf("human", REQUEST);
  writeFileSync(join(inbox, `${job}.json`), JSON.stringify(answer, null, 2));
  const before = tree(directory);
  assert.deepEqual(await adapter.run(REQUEST, CASE), answer);
  assert.deepEqual(tree(directory), before);

  // Whatever JSON the file holds is the reply's result: the transport judges nothing.
  writeFileSync(join(inbox, `${job}.json`), '{ "anything": [1, 2] }');
  const reply = (await transport.call(runMessage(REQUEST, "7"), { timeoutMs: 1 })) as ProtocolResponse & {
    result: unknown;
  };
  assert.deepEqual(reply, { contract: CONTRACT_VERSION, id: "7", ok: true, result: { anything: [1, 2] } });
  const judged = await adapter.run(REQUEST, CASE);
  assert.equal(judged.status, "error");
  assert.equal(judged.error?.code, "invalid-result");

  // A file that is not JSON is no reply: the call rejects, which the adapter makes a transport error.
  writeFileSync(join(inbox, `${job}.json`), "the answer is 42");
  await assert.rejects(transport.call(runMessage(REQUEST, "8"), { timeoutMs: 1 }), (error: unknown) => {
    assert.ok(error instanceof FileExchangeError);
    assert.equal(error.code, "not-json");
    return true;
  });
  assert.equal((await adapter.run(REQUEST, CASE)).error?.code, "transport-error");
  assert.equal(existsSync(join(inbox, `${job}.json`)), true);
  assert.equal(existsSync(join(directory, "outbox", job)), true);
});

test("an answer larger than the transport reads is no reply", async (t) => {
  const descriptor = await descriptorOf("human");
  const directory = join(tempDir(t), "human");
  const transport = createFileExchangeTransport({
    directory,
    descriptor: descriptor as unknown as JsonObject,
    prescriptions: [],
    options: {},
    maxAnswerBytes: 16,
  });
  await transport.open();
  mkdirSync(join(directory, "inbox"), { recursive: true });
  writeFileSync(
    join(directory, "inbox", `${jobName(REQUEST, descriptor)}.json`),
    JSON.stringify({ long: "x".repeat(20) }),
  );
  await assert.rejects(transport.call(runMessage(REQUEST), { timeoutMs: 1 }), { code: "oversized-answer" });
});

test("a case a prescription writer cannot write is no job: the call rejects naming the member", async (t) => {
  const { transport, directory } = await exchangeIn(t);
  await transport.open();
  await transport.call({ contract: CONTRACT_VERSION, id: "1", method: "hello", params: {} }, { timeoutMs: 1 });
  const surfaces = CASE.system.surfaces.map((surface, index) =>
    index === 1 ? { ...surface, coating: "MgF2" } : surface,
  );
  const odd = { ...CASE, system: { ...CASE.system, surfaces } };
  const message = { contract: CONTRACT_VERSION, id: "2", method: "run", params: { request: REQUEST, case: odd } };
  await assert.rejects(
    transport.call(message as ProtocolRequest, { timeoutMs: 1 }),
    /case\.system\.surfaces\[1\]\.coating is a member it does not know/,
  );
  assert.deepEqual(tree(directory), []);
});
