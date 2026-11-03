// `lvrtc collect` on the fixture root's file-exchange engine `fake-human`, in this process: an answer admitted as a
// run admits one and its job moved to collected/, each kind of refusal moved to rejected/ with its reason, a
// collection that was cut short finished by the next, and the exit codes. Nothing here needs Python.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { createCollectCommand } from "../../src/cli/commands/collect.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { CONFIG_FILE, REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { EngineAdapter } from "../../src/engines/adapter.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { createEngineRegistry } from "../../src/engines/registry.ts";
import { exchangeDirectory, jobName } from "../../src/transports/fileExchange.ts";
import { FAKE_ROOT, tempDir } from "../core/support.ts";
import { CASE, echoRequest, runMessage } from "../engines/support.ts";

const ENGINE = "fake-human";

interface Desk {
  readonly runsDir: string;
  readonly directory: string;
  readonly adapter: EngineAdapter;
  readonly descriptor: EngineDescriptor;
}

/** The fixture root's `fake-human` over a temporary runs directory, its adapter closed when the test ends. */
async function desk(t: TestContext): Promise<Desk> {
  const runsDir = join(tempDir(t), "runs");
  const loaded = loadConfig({ rootDir: FAKE_ROOT, env: { LVRTC_RUNS_DIR: runsDir } });
  const adapter = await createEngineRegistry(loaded).create(ENGINE);
  t.after(() => adapter.close());
  return { runsDir, directory: exchangeDirectory(runsDir, ENGINE), adapter, descriptor: await adapter.describe() };
}

/** A request of its own for each number: a job of its own. */
function request(number: number): QuantityRequest {
  return echoRequest(Float64Array.of(number, number / 4));
}

/** Hands the job of `asked` over, as a run does, and says its name. */
async function handOver(at: Desk, asked: QuantityRequest): Promise<string> {
  assert.equal((await at.adapter.run(asked, CASE)).status, "pending");
  return jobName(asked, at.descriptor);
}

/** What a fake engine with these options answers to `asked`. */
async function fakeAnswer(asked: QuantityRequest, options: object = { id: ENGINE }): Promise<ResultEnvelope> {
  const reply = await createEngine(options)(runMessage(asked));
  if (!reply.ok) throw new Error("the fake engine refused run");
  return reply.result as ResultEnvelope;
}

/** Writes an answer into the inbox: an object as JSON, a string as it is. */
function answer(at: Desk, job: string, content: unknown): void {
  mkdirSync(join(at.directory, "inbox"), { recursive: true });
  writeFileSync(
    join(at.directory, "inbox", `${job}.json`),
    typeof content === "string" ? content : JSON.stringify(content),
  );
}

/** Runs `lvrtc collect` in this process on the fixture root, over the desk's runs directory. */
async function collect(
  runsDir: string,
  args: readonly string[] = [],
  rootDir: string = FAKE_ROOT,
): Promise<{ code: number; out: string; err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createCollectCommand({ rootDir, env: { LVRTC_RUNS_DIR: runsDir }, cwd: REPO_ROOT });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(["collect", ...args], io, [command]);
  return { code, out: out.join(""), err: err.join("") };
}

/** The entries of a folder of the exchange directory, sorted; none when it is not there. */
function list(at: Desk, ...path: string[]): string[] {
  const directory = join(at.directory, ...path);
  return existsSync(directory) ? readdirSync(directory).sort() : [];
}

test("an answer is admitted as a run admits one: stored, then its job moved whole to collected", async (t) => {
  const at = await desk(t);
  const asked = request(1);
  const job = await handOver(at, asked);
  const other = await handOver(at, request(2));
  const answered = await fakeAnswer(asked);
  answer(at, job, answered);

  const ended = await collect(at.runsDir, ["--json"]);
  assert.equal(ended.code, EXIT_OK, ended.err);
  assert.deepEqual(JSON.parse(ended.out), {
    engines: [
      {
        engine: ENGINE,
        collected: [job],
        rejected: [],
        pending: [other],
        counts: { collected: 1, rejected: 0, pending: 1 },
      },
    ],
  });
  assert.deepEqual(list(at, "collected"), [job]);
  assert.deepEqual(list(at, "collected", job), [
    "answer-template.json",
    "answer.json",
    "job.json",
    "message.json",
    "prescription-table.txt",
  ]);
  assert.deepEqual(JSON.parse(readFileSync(join(at.directory, "collected", job, "answer.json"), "utf8")), answered);
  assert.deepEqual(list(at, "inbox"), []);
  assert.deepEqual(list(at, "outbox"), [other]);
  // The store keeps it under the job's name, its store key, as the run would have.
  const stored = createResultStore(join(at.runsDir, STORE_DIRECTORY)).get(job);
  assert.equal(stored.kind, "hit");
  assert.deepEqual(stored.kind === "hit" ? stored.entry.result : undefined, answered);

  // The same in lines; the job still pending stays where it is.
  const again = await collect(at.runsDir);
  assert.equal(again.code, EXIT_OK);
  assert.equal(again.out, `${ENGINE}: 0 collected, 0 rejected, 1 still pending\n`);
});

test("every answer that is not one is refused and moved to rejected with its reason", async (t) => {
  const at = await desk(t);
  const jobs: string[] = [];
  for (let number = 1; number <= 8; number++) jobs.push(await handOver(at, request(number)));
  const stamp = engineStamp(at.descriptor.identity);
  const [notJson, notResult, otherRequest, otherFingerprint, invalidData, stillPending, unsupported, good] = jobs;
  answer(at, notJson, "the answer is 42");
  answer(at, notResult, { anything: [1, 2] });
  answer(at, otherRequest, await fakeAnswer(request(99)));
  answer(at, otherFingerprint, await fakeAnswer(request(4), { id: ENGINE, bias: 0.5 }));
  answer(at, invalidData, makeResult(request(5), stamp, { status: "ok", data: { sum: 3 } }));
  answer(at, stillPending, makeResult(request(6), stamp, { status: "pending" }));
  const refusal = { code: "feature" as const, item: "surface.conic", message: "the desk has no conics" };
  answer(at, unsupported, makeResult(request(7), stamp, { status: "unsupported", unsupported: [refusal] }));
  answer(at, good, await fakeAnswer(request(8)));
  const alone = "f".repeat(64);
  answer(at, alone, await fakeAnswer(request(9)));

  const ended = await collect(at.runsDir, [ENGINE]);
  assert.equal(ended.code, EXIT_FAILURE);
  const reasons = new Map(
    [notJson, notResult, otherRequest, otherFingerprint, invalidData, stillPending, alone].map((job) => [
      job,
      readFileSync(join(at.directory, "rejected", job, "reason.txt"), "utf8"),
    ]),
  );
  assert.match(
    reasons.get(notJson)!,
    /^transport-error: .*inbox\/[0-9a-f]{64}\.json is not JSON: "the answer is 42"\n$/,
  );
  assert.match(reasons.get(notResult)!, /^invalid-result: the reply is not a result: /);
  assert.match(reasons.get(otherRequest)!, /^request-id-mismatch: the result answers request [0-9a-f]{64}, not /);
  assert.match(
    reasons.get(otherFingerprint)!,
    /^fingerprint-mismatch: the result carries fingerprint [0-9a-f]{64}, the descriptor /,
  );
  assert.match(reasons.get(invalidData)!, /^invalid-data: the engine's data cannot be used: /);
  assert.equal(reasons.get(stillPending), 'the answer has status "pending", which answers nothing\n');
  assert.equal(reasons.get(alone), `no job ${alone} is in outbox or pending\n`);

  // An "unsupported" is an answer: stored and collected, as a run keeps one.
  assert.deepEqual(list(at, "collected"), [good, unsupported].sort());
  assert.deepEqual(list(at, "rejected"), [...reasons.keys()].sort());
  for (const job of reasons.keys()) assert.ok(list(at, "rejected", job).includes("answer.json"), job);
  assert.deepEqual(list(at, "rejected", alone), ["answer.json", "reason.txt"]);
  assert.deepEqual(list(at, "inbox"), []);
  assert.deepEqual(list(at, "outbox"), []);
  // Each refusal is a line with its reason; the counts come first.
  const lines = ended.out.split("\n");
  assert.equal(lines[0], `${ENGINE}: 2 collected, 7 rejected, 0 still pending`);
  assert.equal(lines.filter((line) => line.startsWith("  rejected ")).length, 7);

  // A refused job is handed over again by the next run: the operator gets it back.
  assert.equal((await at.adapter.run(request(1), CASE)).status, "pending");
  assert.deepEqual(list(at, "outbox"), [notJson]);
});

test("an answer to a job handed over to another version of the engine is refused", async (t) => {
  const at = await desk(t);
  const job = await handOver(at, request(1));
  // The job as another fingerprint would have named it: its message is the same request.
  const elsewhere = "e".repeat(64);
  renameSync(join(at.directory, "outbox", job), join(at.directory, "outbox", elsewhere));
  answer(at, elsewhere, await fakeAnswer(request(1)));
  const ended = await collect(at.runsDir);
  assert.equal(ended.code, EXIT_FAILURE);
  assert.match(
    readFileSync(join(at.directory, "rejected", elsewhere, "reason.txt"), "utf8"),
    new RegExp(
      `^the job was handed over to another version of engine ${ENGINE} .*, whose job of this request is ${job}\\n$`,
    ),
  );
});

test("a job whose message was edited is refused: its request and case must hash to their ids", async (t) => {
  const at = await desk(t);
  const [specEdited, caseEdited] = [await handOver(at, request(1)), await handOver(at, request(2))];
  const edit = (
    job: string,
    change: (message: { params: { request: QuantityRequest; case: typeof CASE } }) => void,
  ) => {
    const file = join(at.directory, "outbox", job, "message.json");
    const message = JSON.parse(readFileSync(file, "utf8"));
    change(message);
    writeFileSync(file, JSON.stringify(message));
  };
  // Another request's spec under the first's id; a case whose stop is not the one its id was made of.
  edit(specEdited, (message) => void (message.params.request = { ...request(1), spec: request(3).spec }));
  edit(caseEdited, (message) => {
    message.params.case = { ...CASE, conditions: { ...CASE.conditions, stopSemiDiameter: 3.25 } };
  });
  answer(at, specEdited, await fakeAnswer(request(1)));
  answer(at, caseEdited, await fakeAnswer(request(2)));

  const ended = await collect(at.runsDir, [ENGINE]);
  assert.equal(ended.code, EXIT_FAILURE, ended.err);
  const reason = (job: string): string => readFileSync(join(at.directory, "rejected", job, "reason.txt"), "utf8");
  assert.match(reason(specEdited), /^its job's request states the id [0-9a-f]{64}, but its content hashes to /);
  assert.match(reason(caseEdited), /^its job's case states the id [0-9a-f]{64}, but its content hashes to /);
  // Nothing was kept under either job's name.
  const store = createResultStore(join(at.runsDir, STORE_DIRECTORY));
  assert.deepEqual([store.has(specEdited), store.has(caseEdited)], [false, false]);
});

test("a job handed over again after its answer was stored is collected, not left pending", async (t) => {
  const at = await desk(t);
  const job = await handOver(at, request(1));
  const waiting = await handOver(at, request(2));
  answer(at, job, await fakeAnswer(request(1)));
  assert.equal((await collect(at.runsDir, [ENGINE])).code, EXIT_OK);
  // A run that missed the store while the collection moved the job away hands it over again (the transport alone
  // asks no store), and the operator has nothing more to answer.
  assert.equal((await at.adapter.run(request(1), CASE)).status, "pending");
  assert.deepEqual(list(at, "outbox"), [job, waiting].sort());

  const ended = await collect(at.runsDir, ["--json"]);
  assert.equal(ended.code, EXIT_OK, ended.err);
  const [report] = JSON.parse(ended.out).engines;
  assert.deepEqual([report.collected, report.pending], [[job], [waiting]]);
  assert.deepEqual(list(at, "collected"), [job, `${job}.2`]);
  assert.deepEqual(list(at, "collected", `${job}.2`), [
    "answer-template.json",
    "job.json",
    "message.json",
    "prescription-table.txt",
  ]);
  assert.deepEqual(list(at, "outbox"), [waiting]);
});

test("a collection cut short is finished by the next, every file whole", async (t) => {
  const at = await desk(t);
  const [stored, refused, lost, reasoned] = [
    await handOver(at, request(1)),
    await handOver(at, request(2)),
    await handOver(at, request(3)),
    await handOver(at, request(4)),
  ];
  // Stored, its answer moved into the job, which was not moved yet.
  answer(at, stored, await fakeAnswer(request(1)));
  assert.equal((await collect(at.runsDir, [ENGINE])).code, EXIT_OK);
  renameSync(join(at.directory, "collected", stored), join(at.directory, "outbox", stored));
  // Refused: its reason written and its answer moved into the job, which was taken to pending and not moved yet.
  mkdirSync(join(at.directory, "pending"));
  renameSync(join(at.directory, "outbox", refused), join(at.directory, "pending", refused));
  writeFileSync(join(at.directory, "pending", refused, "reason.txt"), "invalid-result: made up\n");
  writeFileSync(join(at.directory, "pending", refused, "answer.json"), "{}");
  // An answer moved into its job whose store entry is gone since: it goes back to the inbox and is judged again.
  writeFileSync(join(at.directory, "outbox", lost, "answer.json"), JSON.stringify(await fakeAnswer(request(3))));
  // A reason written and the answer still in the inbox: it is judged again, the reason replaced.
  writeFileSync(join(at.directory, "outbox", reasoned, "reason.txt"), "invalid-result: stale\n");
  answer(at, reasoned, await fakeAnswer(request(4)));
  // A refusal of an answer without a job whose answer did not follow its reason: that directory takes it.
  const alone = "f".repeat(64);
  mkdirSync(join(at.directory, "rejected", alone), { recursive: true });
  writeFileSync(join(at.directory, "rejected", alone, "reason.txt"), "no job\n");
  answer(at, alone, "{}");

  const ended = await collect(at.runsDir, ["--json"]);
  assert.equal(ended.code, EXIT_FAILURE);
  const [report] = JSON.parse(ended.out).engines;
  assert.deepEqual(report.collected, [stored, lost, reasoned].sort());
  assert.deepEqual(
    report.rejected,
    [
      { job: refused, reason: "invalid-result: made up" },
      { job: alone, reason: `no job ${alone} is in outbox or pending` },
    ].sort((a, b) => (a.job < b.job ? -1 : 1)),
  );
  assert.deepEqual(report.pending, []);
  assert.deepEqual(list(at, "collected"), [stored, lost, reasoned].sort());
  assert.deepEqual(list(at, "rejected"), [refused, alone].sort());
  assert.deepEqual(list(at, "rejected", alone), ["answer.json", "reason.txt"]);
  // The stale reason is gone: a job with a reason and an answer would be one being refused.
  assert.equal(existsSync(join(at.directory, "collected", reasoned, "reason.txt")), false);
  assert.deepEqual([list(at, "inbox"), list(at, "outbox"), list(at, "pending")], [[], [], []]);
});

test("exit codes: 2 for a command line, a root or an engine that cannot be used; 1 for an engine not described", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  for (const args of [["fake-a"], ["nobody"], ["--yes"], ["--root", join(runsDir, "missing")]]) {
    const ended = await collect(runsDir, args);
    assert.equal(ended.code, EXIT_USAGE, args.join(" "));
    assert.match(ended.err, /^lvrtc collect: .*\nUsage: lvrtc collect /);
  }
  assert.match(
    (await collect(runsDir, ["fake-a"])).err,
    /fake-a is not a file-exchange engine of the configuration: there are fake-human/,
  );
  // Nothing to collect is no failure.
  const quiet = await collect(runsDir);
  assert.deepEqual([quiet.code, quiet.out], [EXIT_OK, `${ENGINE}: 0 collected, 0 rejected, 0 still pending\n`]);

  const rootDir = tempDir(t);
  writeFileSync(
    join(rootDir, CONFIG_FILE),
    JSON.stringify({ engines: { desk: { transport: "file-exchange", descriptor: { identity: {} } } } }),
  );
  const broken = await collect(runsDir, [], rootDir);
  assert.equal(broken.code, EXIT_FAILURE);
  assert.match(broken.out, /^desk: not collected: engine desk is unavailable \(bad-descriptor\): /);
  rmSync(join(rootDir, CONFIG_FILE));
  const none = await collect(runsDir, [], rootDir);
  assert.deepEqual([none.code, none.out], [EXIT_OK, "no file-exchange engine is configured: nothing to collect\n"]);
});
