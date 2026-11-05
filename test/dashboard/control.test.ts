// Stage 8.3's verification: run control from the dashboard. The fake suite end to end from the UI, as
// `test/cli/collect.test.ts` runs it from the command line: started from a form (lvrtc run, compare and report as
// children), its two fake-human jobs pending on the run page and in the exchange directory's outbox, answered by the
// fake operator, collected from a form, started again, every job ok from the store and four pairs PASS, and the
// manifest the bytes of a run whose fake-human answered at once. Then a rejected answer; what is refused (token,
// Origin, Sec-Fetch-Site, Host, method, size, the lists, a second job), with nothing started; a run that exits 2
// ending its job; output with no absolute path whatever HOME is; and a running job's process group ended (SIGTERM,
// then SIGKILL), a grandchild included, when the dashboard closes. No test starts Python or LensVisualizer: the
// engines are in-process fakes and fake-human.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { controlChoices, createServeCommand, rootSuites } from "../../src/cli/commands/serve.ts";
import { EXIT_OK, runCli } from "../../src/cli/main.ts";
import { CONFIG_FILE, REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import type { ControlOptions, ControlView, JobView } from "../../src/dashboard/control.ts";
import { readCollectOutput, redactor, tokenMatches } from "../../src/dashboard/control.ts";
import { startDashboard } from "../../src/dashboard/server.ts";
import type { Dashboard, DashboardOptions } from "../../src/dashboard/server.ts";
import { escapeHtml } from "../../src/dashboard/html.ts";
import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "../core/support.ts";
import { fetchFrom, titleTexts, treeOf, visibleText } from "./support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const OPERATOR = fileURLToPath(new URL("../fixtures/fake-operator/operator.mjs", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));
const FORM = "application/x-www-form-urlencoded";
const WAIT_MS = 90_000;

/** Every way an absolute path of this machine could show. */
const ABSOLUTE = [REPO_ROOT, tmpdir(), "/Users/", "/private/", "/home/", "/var/folders/"];

/** A dashboard over the root, with run control of the suites given; closed when the test ends. */
async function served(
  t: TestContext,
  rootDir: string,
  runsDir: string,
  suites: ControlOptions["suites"],
  extra: Partial<DashboardOptions> = {},
): Promise<Dashboard> {
  const control = {
    ...controlChoices(loadConfig({ rootDir, env: process.env }), suites, process.env),
    killGraceMs: 300,
  };
  const dashboard = await startDashboard({ rootDir, runsDir, port: 0, control, ...extra });
  t.after(() => dashboard.close());
  return dashboard;
}

/** The token of the dashboard's forms, read from its control page as a browser has it. */
async function tokenOf(port: number): Promise<string> {
  const page = await fetchFrom(port, "/control");
  const found = /name="token" value="([0-9a-f]{64})"/.exec(page.body);
  assert.ok(found !== null, "the control page carries a token");
  return found[1];
}

/** Posts a form to an action as the control page's own form would send it, with headers changed as given. */
function post(
  port: number,
  action: string,
  fields: Readonly<Record<string, string>>,
  headers: Readonly<Record<string, string>> = {},
  options: { readonly host?: string; readonly body?: string } = {},
) {
  return fetchFrom(port, `/control/${action}`, {
    method: "POST",
    host: options.host,
    body: options.body ?? new URLSearchParams(fields).toString(),
    headers: {
      "content-type": FORM,
      origin: `http://127.0.0.1:${port}`,
      "sec-fetch-site": "same-origin",
      ...headers,
    },
  });
}

async function controlView(port: number): Promise<ControlView> {
  return JSON.parse((await fetchFrom(port, "/api/control")).body) as ControlView;
}

/** Waits until job `n` has ended, and returns its view. */
async function ended(port: number, job: number): Promise<JobView> {
  const until = Date.now() + WAIT_MS;
  for (;;) {
    const view = JSON.parse((await fetchFrom(port, `/api/control/job/${job}`)).body) as JobView;
    if (!view.running) return view;
    assert.ok(Date.now() < until, `job ${job} did not end`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Holds a page and its twin to the rules: lint-free wording (visible text and tooltips; a step's output, in a <pre>,
 * and a reason lvrtc collect gave, in a <code>, are what the lvrtc command said and none of the dashboard's
 * sentences), and no absolute path anywhere.
 */
async function holdPage(port: number, path: string): Promise<string> {
  const page = await fetchFrom(port, path);
  assert.equal(page.status, 200, path);
  const sentences = page.body.replace(/<pre>[\s\S]*?<\/pre>/g, "").replace(/<code>[\s\S]*?<\/code>/g, "");
  assert.deepEqual(wordingProblems(visibleText(sentences)), [], path);
  assert.deepEqual(wordingProblems(titleTexts(page.body).join("\n\n")), [], `${path}: its titles`);
  const twin = await fetchFrom(port, `/api${path}`);
  assert.equal(twin.status, 200, `/api${path}`);
  for (const body of [page.body, twin.body]) {
    for (const absolute of ABSOLUTE) assert.ok(!body.includes(absolute), `${path} names ${absolute}`);
  }
  return page.body;
}

function node(runsDir: string, args: readonly string[]): { code: number | null; out: string; err: string } {
  const child = spawnSync(process.execPath, args, {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env: { ...process.env, LVRTC_RUNS_DIR: runsDir },
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

/**
 * A root of its own three levels below a directory (the fixture suite's lenses are named from there): the fake
 * engines in this process, fake-human, `slow`, `stubborn` and `parent` (whose `run` never answers, after writing the
 * pid of the process to `marker`; `stubborn` also ignores SIGTERM; `parent` first starts a grandchild that ignores
 * SIGTERM, as an engine worker might, and writes its pid after its own), and `suites/` with fake-pair and a file
 * that is no suite.
 */
function rootOf(t: TestContext): { rootDir: string; base: string; marker: string } {
  const base = tempDir(t);
  const rootDir = join(base, "test", "fixtures", "root");
  const cases = join("contract", "fixtures", "v1", "valid", "optical-case");
  mkdirSync(join(base, cases), { recursive: true });
  mkdirSync(join(rootDir, "suites"), { recursive: true });
  for (const name of ["singlet.json", "double-gauss.json"]) {
    copyFileSync(join(REPO_ROOT, cases, name), join(base, cases, name));
  }
  copyFileSync(FAKE_PAIR_SUITE, join(rootDir, "suites", "fake-pair.json"));
  writeFileSync(join(rootDir, "suites", "broken.json"), "{ not a suite\n");
  const marker = join(base, "marker");
  const slow = join(base, "slow.mjs");
  writeFileSync(
    slow,
    [
      'import { spawn } from "node:child_process";',
      'import { writeFileSync } from "node:fs";',
      `import { createEngine as fake } from ${JSON.stringify(pathToFileURL(FAKE_ENGINE).href)};`,
      "export function createEngine(options) {",
      "  const answer = fake({ id: options.id });",
      '  if (options.ignoreTerm) process.on("SIGTERM", () => {});',
      "  return (message) => {",
      '    if (message.method !== "run") return answer(message);',
      "    const pids = [process.pid];",
      "    if (options.grandchild) {",
      "      const script = \"process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);\";",
      '      pids.push(spawn(process.execPath, ["-e", script], { stdio: "ignore" }).pid);',
      "    }",
      '    writeFileSync(options.marker, pids.join(" "));',
      "    setInterval(() => {}, 1000);",
      "    return new Promise(() => {});",
      "  };",
      "}",
      "",
    ].join("\n"),
  );
  const fakeRoot = JSON.parse(readFileSync(join(FAKE_ROOT, CONFIG_FILE), "utf8"));
  const inProcess = (module: string, options: object) => ({ transport: "in-process", module, options });
  writeFileSync(
    join(rootDir, CONFIG_FILE),
    JSON.stringify({
      engines: {
        "fake-a": inProcess(FAKE_ENGINE, { id: "fake-a" }),
        "fake-human": fakeRoot.engines["fake-human"],
        slow: inProcess(slow, { id: "slow", marker }),
        stubborn: inProcess(slow, { id: "stubborn", marker, ignoreTerm: true }),
        parent: inProcess(slow, { id: "parent", marker, grandchild: true }),
      },
    }),
  );
  return { rootDir, base, marker };
}

async function untilExists(file: string): Promise<void> {
  const until = Date.now() + WAIT_MS;
  while (!existsSync(file)) {
    assert.ok(Date.now() < until, `${file} did not appear`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** Whether a process is gone, given a moment to be reaped (an orphan is reaped by the system, not by this test). */
async function gone(pid: number): Promise<boolean> {
  for (let tries = 0; tries < 100 && alive(pid); tries++) await new Promise((resolve) => setTimeout(resolve, 20));
  return !alive(pid);
}

test("the fake suite end to end from the UI: started, pending, answered, collected, started again, every job ok", async (t) => {
  // A temporary root with the suite under its suites/, as lvrtc serve lists it: no path of the checkout, whatever HOME.
  const { rootDir: root } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  const exchange = join(runsDir, "exchange", "fake-human");
  const dashboard = await served(t, root, runsDir, rootSuites(root));
  const { port } = dashboard;
  const control = await holdPage(port, "/control");
  assert.ok(control.includes('<option value="fake-pair">fake-pair</option>'));
  assert.ok(visibleText(control).includes(DASHBOARD_TEXT.control.heavy));
  const token = await tokenOf(port);
  const start = { token, suite: "fake-pair", engines: "fake-a,fake-human", rungs: "selftest", jobs: "1" };

  // 1. Started from the form: run, compare and report, each a child; the job page says every step exited. The
  // compare finds the pairs of the pending jobs ERROR (code 1), and the job still goes on to the report.
  const first = await post(port, "start", start);
  assert.equal(first.status, 303, first.body);
  assert.equal(first.headers.location, "/control/job/1");
  const job1 = await ended(port, 1);
  assert.deepEqual(
    job1.steps.map(({ name, state, exitCode }) => [name, state, exitCode]),
    [
      ["run", "exited", 0],
      ["compare", "exited", 1],
      ["report", "exited", 0],
    ],
  );
  assert.equal(
    job1.steps[0].command,
    "LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs run <root>/suites/fake-pair.json --root <root> --engines fake-a,fake-human --rungs selftest --jobs 1",
  );
  assert.equal(job1.steps[1].command, "LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs compare fake-pair --root <root>");
  assert.match(job1.steps[1].output, /^fake-pair: 4 pairs: 0 PASS, .* 4 ERROR$/m);
  assert.match(
    job1.steps[0].output,
    /^fake-pair: 4 jobs: 2 ok, 0 unsupported, 0 error, 2 pending \(4 computed, 0 cached\)$/m,
  );
  const page1 = await holdPage(port, "/control/job/1");
  assert.ok(!page1.includes('http-equiv="refresh"'), "an ended job's page does not reload");

  // 2. The run page and /control show the two pending fake-human jobs, and the outbox holds them.
  const run = JSON.parse((await fetchFrom(port, "/api/run/fake-pair")).body);
  assert.deepEqual(
    run.pending.map((job: { engine: string }) => job.engine),
    ["fake-human", "fake-human"],
  );
  let view = await controlView(port);
  assert.deepEqual(
    view.pending.map(({ suite, engine }) => [suite, engine]),
    [
      ["fake-pair", "fake-human"],
      ["fake-pair", "fake-human"],
    ],
  );
  const counts = () =>
    Object.fromEntries(
      (view.exchange.find(({ engine }) => engine === "fake-human")?.folders ?? []).map(({ folder, count }) => [
        folder,
        count,
      ]),
    );
  assert.deepEqual(counts(), { outbox: 2, pending: 0, inbox: 0, collected: 0, rejected: 0 });
  const controlPage = await holdPage(port, "/control");
  assert.ok(visibleText(controlPage).includes(DASHBOARD_TEXT.control.operator("fake-human")));

  // 3. The operator answers, as a person would, in a process of its own.
  const operator = node(runsDir, [OPERATOR, exchange]);
  assert.equal(operator.code, 0, operator.err);
  view = await controlView(port);
  assert.deepEqual(counts(), { outbox: 0, pending: 2, inbox: 2, collected: 0, rejected: 0 });

  // 4. Collected from the form: its page shows two collected.
  const collect = await post(port, "collect", { token });
  assert.equal(collect.status, 303, collect.body);
  assert.equal(collect.headers.location, "/control/job/2");
  const job2 = await ended(port, 2);
  assert.deepEqual(
    job2.steps.map(({ name, state, exitCode }) => [name, state, exitCode]),
    [["collect", "exited", 0]],
  );
  assert.equal(job2.collect?.problem, null);
  assert.deepEqual(
    job2.collect?.engines.map(({ engine, collected, rejected, pending }) => [
      engine,
      collected.count,
      rejected.count,
      pending.count,
    ]),
    [["fake-human", 2, 0, 0]],
  );
  const page2 = await holdPage(port, "/control/job/2");
  assert.ok(page2.includes("<tr><td>fake-human</td><td>2</td><td>0</td><td>0</td></tr>"), "two collected");
  view = await controlView(port);
  assert.deepEqual(counts(), { outbox: 0, pending: 0, inbox: 0, collected: 2, rejected: 0 });

  // 5. Started again: every job ok, from the store, and the four pairs PASS.
  const again = await post(port, "start", start);
  assert.equal(again.status, 303, again.body);
  assert.equal(again.headers.location, "/control/job/3");
  const job3 = await ended(port, 3);
  assert.deepEqual(
    job3.steps.map(({ state, exitCode }) => [state, exitCode]),
    [
      ["exited", 0],
      ["exited", 0],
      ["exited", 0],
    ],
  );
  assert.match(job3.steps[0].output, /\(0 computed, 4 cached\)$/m);
  const rerun = JSON.parse((await fetchFrom(port, "/api/run/fake-pair")).body);
  assert.deepEqual(rerun.pending, []);
  for (const { engines } of rerun.supportByRung as { engines: { counts: { status: string; count: number }[] }[] }[]) {
    for (const { counts: byStatus } of engines) {
      assert.deepEqual(
        byStatus.filter(({ count }) => count > 0),
        [{ status: "ok", count: 2 }],
      );
    }
  }
  assert.deepEqual(
    rerun.summary.flatMap(({ counts: byVerdict }: { counts: { verdict: string; count: number }[] }) =>
      byVerdict.filter(({ count }) => count > 0),
    ),
    [
      { verdict: "PASS", count: 2 },
      { verdict: "PASS", count: 2 },
    ],
    "two pairs in each mode, four PASS",
  );
  assert.equal(rerun.failing, 0);
  assert.match(job3.steps[1].output, /^fake-pair: 4 pairs: 4 PASS, /m);
  const manifestText = readFileSync(join(runsDir, "fake-pair", MANIFEST_FILE), "utf8");
  const manifest = JSON.parse(manifestText) as RunManifest;
  assert.ok(manifest.jobs.every((job) => job.status === "ok"));
  await holdPage(port, "/run/fake-pair");
  for (const path of ["/control", "/control/job/1", "/control/job/2", "/control/job/3"]) await holdPage(port, path);
  assert.deepEqual(
    (await controlView(port)).jobs.map(({ job, jobKind }) => [job, jobKind]),
    [
      [1, "suite"],
      [2, "collect"],
      [3, "suite"],
    ],
  );

  // 6. The same suite where fake-human is the fake engine in this process, answering at once: the same manifest.
  const { rootDir } = rootOf(t);
  const inProcess = (id: string) => ({ transport: "in-process", module: FAKE_ENGINE, options: { id } });
  writeFileSync(
    join(rootDir, CONFIG_FILE),
    JSON.stringify({ engines: { "fake-a": inProcess("fake-a"), "fake-human": inProcess("fake-human") } }),
  );
  const elsewhere = join(tempDir(t), "runs");
  const atOnce = node(elsewhere, [
    BIN,
    "run",
    join(rootDir, "suites", "fake-pair.json"),
    "--root",
    rootDir,
    "--engines",
    "fake-a,fake-human",
    "--rungs",
    "selftest",
    "--jobs",
    "1",
  ]);
  assert.equal(atOnce.code, 0, atOnce.err);
  assert.match(atOnce.out, /\(4 computed, 0 cached\)$/m);
  assert.equal(readFileSync(join(elsewhere, "fake-pair", MANIFEST_FILE), "utf8"), manifestText);
});

test("an action is refused for its token, origin, site, host, method, size and fields, and nothing is started", async (t) => {
  const { rootDir, marker } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  mkdirSync(runsDir);
  const dashboard = await served(t, rootDir, runsDir, rootSuites(rootDir));
  const { port } = dashboard;
  const token = await tokenOf(port);
  assert.notEqual(token, await tokenOf((await served(t, rootDir, runsDir, [])).port), "a token for each server");
  const tree = treeOf(runsDir);
  const valid = { token, suite: "fake-pair", engines: "fake-a", rungs: "selftest", jobs: "2" };
  const cases: [string, Promise<{ status: number; body: string; headers: Record<string, unknown> }>, number][] = [
    ["no token", post(port, "start", { ...valid, token: "" }), 403],
    ["no token field", post(port, "start", { suite: "fake-pair" }), 403],
    ["a wrong token", post(port, "start", { ...valid, token: "0".repeat(64) }), 403],
    ["a token twice", post(port, "start", {}, {}, { body: `${new URLSearchParams(valid)}&token=${token}` }), 403],
    ["a foreign Origin", post(port, "start", valid, { origin: "http://evil.example" }), 403],
    ["Origin null", post(port, "start", valid, { origin: "null" }), 403],
    ["another port's Origin", post(port, "start", valid, { origin: `http://127.0.0.1:${port + 1}` }), 403],
    ["a cross-site fetch", post(port, "start", valid, { "sec-fetch-site": "cross-site" }), 403],
    ["a same-site fetch", post(port, "collect", { token }, { "sec-fetch-site": "same-site" }), 403],
    ["a foreign Host", post(port, "start", valid, {}, { host: "evil.example" }), 403],
    ["not a form", post(port, "start", valid, { "content-type": "application/json" }), 415],
    ["a body over 16 KB", post(port, "start", { ...valid, rungs: "x".repeat(17 * 1024) }), 413],
    [
      "a chunked body over 16 KB",
      post(port, "start", { ...valid, rungs: "x".repeat(17 * 1024) }, { "transfer-encoding": "chunked" }),
      413,
    ],
    ["an unknown suite", post(port, "start", { ...valid, suite: "../../etc/passwd" }), 400],
    ["no suite", post(port, "start", { ...valid, suite: "" }), 400],
    ["an unknown engine", post(port, "start", { ...valid, engines: "fake-a,nobody" }), 400],
    ["an empty engine", post(port, "start", { ...valid, engines: "fake-a,,fake-human" }), 400],
    ["an unknown rung", post(port, "start", { ...valid, rungs: "selftest,r99" }), 400],
    ["jobs 0", post(port, "start", { ...valid, jobs: "0" }), 400],
    ["jobs 5", post(port, "start", { ...valid, jobs: "5" }), 400],
    ["jobs 1.5", post(port, "start", { ...valid, jobs: "1.5" }), 400],
    ["an unknown field", post(port, "start", { ...valid, root: "/" }), 400],
    ["a collect with a field", post(port, "collect", { token, suite: "fake-pair" }), 400],
    ["asking with no way to ask", post(port, "ask", { token }), 409],
  ];
  for (const [what, answer, status] of cases) {
    const got = await answer;
    assert.equal(got.status, status, `${what}: ${got.body}`);
    if (got.status !== 403 || what !== "a foreign Host") {
      assert.deepEqual(wordingProblems(visibleText(got.body)), [], what);
    }
  }
  for (const action of ["start", "collect", "ask"]) {
    for (const method of ["GET", "HEAD", "PUT"]) {
      const got = await fetchFrom(port, `/control/${action}`, { method });
      assert.equal(got.status, 405, `${method} /control/${action}`);
      assert.equal(got.headers.allow, "POST");
    }
  }
  // A page is not an action: a POST to it is 405 as before.
  assert.equal((await fetchFrom(port, "/control", { method: "POST" })).status, 405);
  assert.equal((await fetchFrom(port, "/control/job/1")).status, 404);
  assert.equal((await fetchFrom(port, "/api/control/job/0")).status, 404);
  assert.deepEqual((await controlView(port)).jobs, [], "nothing was started");
  assert.deepEqual(treeOf(runsDir), tree, "nothing was written");
  assert.ok(!existsSync(marker));

  // One job at a time: a second start, or a collect, while one runs is refused with a page that says so. The run is
  // serial: two jobs exceed the memory budget of a 16 GB machine (2 GiB), and its child would end at once.
  const slow = await post(port, "start", { ...valid, engines: "slow", jobs: "1" });
  assert.equal(slow.status, 303, slow.body);
  await untilExists(marker);
  for (const [action, fields] of [
    ["start", valid],
    ["collect", { token }],
  ] as const) {
    const busy = await post(port, action, fields);
    assert.equal(busy.status, 409, action);
    assert.ok(visibleText(busy.body).includes(DASHBOARD_TEXT.control.busyJob("1")), action);
  }
  const running = await controlView(port);
  assert.deepEqual(running.busy, { reason: "job", job: 1 });
  assert.equal(running.jobs.length, 1);
  const page = await holdPage(port, "/control/job/1");
  assert.ok(page.includes('<meta http-equiv="refresh" content="2">'), "a running job's page reloads");
  const pid = Number(readFileSync(marker, "utf8"));
  assert.ok(alive(pid));

  // Closing the dashboard ends the running child, and waits for it.
  await dashboard.close();
  assert.ok(!alive(pid), "the child was ended");
});

test("a start is held to the memory budget: over it a 400 naming budget and estimate, a serial start always taken", async (t) => {
  const { rootDir } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  const suites = rootSuites(rootDir);
  // Budgets stated by the test, so that it holds on a 16 GB machine and a 48 GiB one alike (CI, 5afa034).
  const budgeted = async (memoryBudgetGiB: number) => {
    const control = {
      ...controlChoices(loadConfig({ rootDir, env: process.env }), suites, process.env),
      memoryBudgetGiB,
    };
    const dashboard = await startDashboard({ rootDir, runsDir, port: 0, control: { ...control, killGraceMs: 300 } });
    t.after(() => dashboard.close());
    return { port: dashboard.port, token: await tokenOf(dashboard.port) };
  };
  const text = DASHBOARD_TEXT.control;
  const fields = { suite: "fake-pair", engines: "fake-a", rungs: "selftest" };
  // 2 GiB, a 16 GB machine's default: one job at 2.5 GiB a job.
  const small = await budgeted(2);
  const over = await post(small.port, "start", { token: small.token, ...fields, jobs: "2" });
  assert.equal(over.status, 400, over.body);
  assert.ok(visibleText(over.body).includes(text.tooManyJobs("2", "1", "2", "2.5")), visibleText(over.body));
  // R6c counts 4 GiB a job: 6 GiB holds one job of it, the estimate taken from the rungs the start names.
  const six = await budgeted(6);
  const r6c = await post(six.port, "start", { token: six.token, ...fields, rungs: "r6c", jobs: "2" });
  assert.equal(r6c.status, 400, r6c.body);
  assert.ok(visibleText(r6c.body).includes(text.tooManyJobs("2", "1", "6", "4")), visibleText(r6c.body));
  for (const port of [small.port, six.port]) assert.deepEqual((await controlView(port)).jobs, [], "nothing started");
  assert.equal(existsSync(runsDir), false, "nothing was written");

  // A serial start is always taken, whatever the budget, and the child is given the dashboard's budget.
  const tiny = await budgeted(0.5);
  const serial = await post(tiny.port, "start", { token: tiny.token, ...fields, jobs: "1" });
  assert.equal(serial.status, 303, serial.body);
  const job = await ended(tiny.port, 1);
  assert.match(job.steps[0].command, / --jobs 1 --memory-budget 0\.5$/);
  assert.equal(job.steps[0].exitCode, 0, job.steps[0].output);
});

test("a child that ignores SIGTERM is killed after the grace period when the dashboard closes", async (t) => {
  const { rootDir, marker } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  const dashboard = await served(t, rootDir, runsDir, rootSuites(rootDir));
  const token = await tokenOf(dashboard.port);
  const started = await post(dashboard.port, "start", { token, suite: "fake-pair", engines: "stubborn" });
  assert.equal(started.status, 303, started.body);
  await untilExists(marker);
  const pid = Number(readFileSync(marker, "utf8"));
  const before = Date.now();
  await dashboard.close();
  assert.ok(Date.now() - before >= 250, "SIGTERM did not end it: it was given its grace period");
  assert.ok(!alive(pid), "and then killed");
});

test("closing the dashboard ends the job's whole process group: a grandchild that ignores SIGTERM too", async (t) => {
  // lvrtc run serial, its engine having started a worker of its own (as a stdio engine does): the run dies of
  // SIGTERM, which a serial run does not hand on, and the worker, which ignores it, is killed with the group.
  const { rootDir, marker } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  const dashboard = await served(t, rootDir, runsDir, rootSuites(rootDir));
  const token = await tokenOf(dashboard.port);
  const started = await post(dashboard.port, "start", { token, suite: "fake-pair", engines: "parent" });
  assert.equal(started.status, 303, started.body);
  await untilExists(marker);
  const [pid, grandchild] = readFileSync(marker, "utf8").split(" ").map(Number);
  assert.ok(alive(pid) && alive(grandchild));
  await dashboard.close();
  assert.ok(await gone(pid), "the child was ended");
  assert.ok(await gone(grandchild), "and so was the grandchild");
});

test("with HOME elsewhere no page names an absolute path: a listed suite outside the root is a placeholder", async (t) => {
  const home = tempDir(t);
  const saved = process.env.HOME;
  process.env.HOME = home;
  t.after(() => {
    if (saved === undefined) delete process.env.HOME;
    else process.env.HOME = saved;
  });
  const outside = join(tempDir(t), "broken.json");
  writeFileSync(outside, "{ not a suite\n");
  const runsDir = join(tempDir(t), "runs");
  const suites = [
    { name: "broken", file: outside },
    { name: "fake-pair", file: FAKE_PAIR_SUITE },
  ];
  const dashboard = await served(t, FAKE_ROOT, runsDir, suites);
  const { port } = dashboard;
  const token = await tokenOf(port);
  assert.equal((await post(port, "start", { token, suite: "fake-pair", engines: "fake-a" })).status, 303);
  const pair = await ended(port, 1);
  assert.deepEqual(
    pair.steps.map(({ exitCode }) => exitCode),
    [0, 0, 0],
  );
  assert.equal(
    pair.steps[0].command,
    `LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs run ${DASHBOARD_TEXT.control.suitePlaceholder("fake-pair")} --root <root> --engines fake-a --jobs 1`,
  );
  assert.equal((await post(port, "start", { token, suite: "broken" })).status, 303);
  const broken = await ended(port, 2);
  assert.equal(broken.steps[0].exitCode, 2);
  assert.ok(broken.steps[0].output.includes("<suite:broken>"), broken.steps[0].output);
  for (const path of ["/control", "/control/job/1", "/control/job/2", "/run/fake-pair"]) await holdPage(port, path);
});

test("a collect that refuses an answer shows the job rejected with lvrtc's reason, redacted", async (t) => {
  const { rootDir } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  const exchange = join(runsDir, "exchange", "fake-human");
  const dashboard = await served(t, rootDir, runsDir, rootSuites(rootDir));
  const { port } = dashboard;
  const token = await tokenOf(port);
  const start = { token, suite: "fake-pair", engines: "fake-a,fake-human", rungs: "selftest" };
  assert.equal((await post(port, "start", start)).status, 303);
  await ended(port, 1);
  assert.equal(node(runsDir, [OPERATOR, exchange]).code, 0);
  // The operator left one answer that is not JSON.
  const [spoiled] = readdirSync(join(exchange, "inbox")).sort();
  writeFileSync(join(exchange, "inbox", spoiled), "{ not an answer\n");
  assert.equal((await post(port, "collect", { token })).status, 303);
  const job = await ended(port, 2);
  assert.equal(job.steps[0].exitCode, 1, "an answer was refused");
  const [engine] = job.collect?.engines ?? [];
  assert.deepEqual([engine.collected.count, engine.rejected.count, engine.pending.count], [1, 1, 0]);
  const [rejected] = engine.rejected.jobs;
  assert.equal(`${rejected.job}.json`, spoiled);
  assert.match(rejected.reason, /is not JSON/);
  assert.ok(!rejected.reason.includes(runsDir));
  const page = await holdPage(port, "/control/job/2");
  assert.ok(page.includes(`<td><code>${escapeHtml(rejected.reason)}</code></td>`), "the reason, in lvrtc's words");
  // A reason that names a path of the runs directory, as lvrtc's may, is redacted as the output is.
  const read = readCollectOutput(
    JSON.stringify({
      engines: [
        {
          engine: "fake-human",
          collected: [],
          pending: [],
          rejected: [{ job: rejected.job, reason: `${join(runsDir, "exchange")} cannot be read` }],
        },
      ],
    }),
    redactor({ rootDir, runsDir }),
  );
  assert.equal(read.engines[0].rejected.jobs[0].reason, "<runsDir>/exchange cannot be read");
});

test("lvrtc serve lists <root>/suites/*.json by name on /control, links followed, the catalog marked the owner's", async (t) => {
  const { rootDir } = rootOf(t);
  const suites = join(rootDir, "suites");
  copyFileSync(FAKE_PAIR_SUITE, join(suites, "catalog.json"));
  symlinkSync(join(suites, "fake-pair.json"), join(suites, "linked.json"));
  mkdirSync(join(rootDir, "elsewhere.json"));
  symlinkSync(join(rootDir, "elsewhere.json"), join(suites, "directory.json"));
  symlinkSync(join(rootDir, "nothing.json"), join(suites, "dangling.json"));
  mkdirSync(join(suites, "repro.json"));
  const runsDir = join(tempDir(t), "runs");
  let view: ControlView | null = null;
  let page = "";
  const command = createServeCommand({
    rootDir,
    cwd: rootDir,
    env: { ...process.env, LVRTC_RUNS_DIR: runsDir },
    untilStopped: async (dashboard) => {
      view = await controlView(dashboard.port);
      page = (await fetchFrom(dashboard.port, "/control")).body;
    },
  });
  const io = { stdout: () => undefined, stderr: () => undefined };
  assert.equal(await runCli(["serve", "--port", "0", "--no-ask"], io, [command]), EXIT_OK);
  assert.deepEqual(view!.suites, ["broken", "catalog", "fake-pair", "linked"]);
  assert.deepEqual(view!.ownerOnly, ["catalog"]);
  assert.deepEqual(
    view!.exchange.map(({ engine }) => engine),
    ["fake-human"],
  );
  assert.ok(
    page.includes(`<option value="catalog">${escapeHtml(DASHBOARD_TEXT.control.ownerOnlyOption("catalog"))}</option>`),
  );
  assert.ok(visibleText(page).includes(DASHBOARD_TEXT.control.ownerOnlySuite("catalog")));
  assert.deepEqual(wordingProblems(visibleText(page)), []);
});

test("a dashboard started without control's lists starts and collects nothing, and says so", async (t) => {
  const runsDir = join(tempDir(t), "runs");
  // A runner, so that the page has a form (asking again) and its token; no engine has a baseline to be asked of.
  const runner = async () => ({ code: 0, stdout: JSON.stringify({ engines: [] }) });
  const dashboard = await startDashboard({ rootDir: FAKE_ROOT, runsDir, port: 0, runner });
  t.after(() => dashboard.close());
  await dashboard.answered;
  const page = visibleText(await holdPage(dashboard.port, "/control"));
  assert.ok(page.includes(DASHBOARD_TEXT.control.notConfigured));
  assert.ok(!page.includes(DASHBOARD_TEXT.control.noExchange), "it never says that no engine would be collected for");
  const token = await tokenOf(dashboard.port);
  for (const [action, fields] of [
    ["start", { token, suite: "fake-pair" }],
    ["collect", { token }],
  ] as const) {
    const refused = await post(dashboard.port, action, fields);
    assert.equal(refused.status, 409, action);
    assert.ok(visibleText(refused.body).includes(DASHBOARD_TEXT.control.notConfigured), action);
  }
  assert.equal((await controlView(dashboard.port)).configured, false);
  assert.deepEqual((await controlView(dashboard.port)).jobs, []);
});

test("a job whose run exits 2 stops before compare, and its output names no absolute path", async (t) => {
  const { rootDir } = rootOf(t);
  const runsDir = join(tempDir(t), "runs");
  const suites = rootSuites(rootDir);
  assert.deepEqual(
    suites.map(({ name }) => name),
    ["broken", "fake-pair"],
  );
  const dashboard = await served(t, rootDir, runsDir, suites);
  const token = await tokenOf(dashboard.port);
  const started = await post(dashboard.port, "start", { token, suite: "broken" });
  assert.equal(started.status, 303, started.body);
  const job = await ended(dashboard.port, 1);
  assert.deepEqual(
    job.steps.map(({ name, state, exitCode }) => [name, state, exitCode]),
    [
      ["run", "exited", 2],
      ["compare", "not-run", null],
      ["report", "not-run", null],
    ],
  );
  assert.equal(
    job.steps[0].command,
    "LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs run <root>/suites/broken.json --root <root> --jobs 1",
  );
  // The run names the file it could not read: under the root, so as <root>.
  assert.match(job.steps[0].output, /<root>\/suites\/broken\.json/);
  const page = await holdPage(dashboard.port, "/control/job/1");
  assert.ok(visibleText(page).includes(DASHBOARD_TEXT.control.stateNotRun));
  assert.ok(!existsSync(join(runsDir, "broken")));
});

test("output is redacted: the root, the runs directory and the home directory, the nearest first, as whole paths", (t) => {
  const redact = redactor({ rootDir: "/h/me/work/root", runsDir: "/h/me/work/root/runs", home: "/h/me" });
  assert.equal(
    redact("a /h/me/work/root/runs/x b /h/me/work/root/suites c /h/me/notes /elsewhere"),
    "a <runsDir>/x b <root>/suites c ~/notes /elsewhere",
  );
  // A path is replaced only as a whole: not as the start of a longer name, nor inside another path.
  const home = redactor({ rootDir: "/nowhere/root", runsDir: "/nowhere/runs", home: "/Users/ron" });
  assert.equal(
    home("/Users/ron /Users/ron/x /Users/ronald/x /Users/ron.old '/Users/ron' /x/Users/ron (/Users/ron:)"),
    "~ ~/x /Users/ronald/x /Users/ron.old '~' /x/Users/ron (~:)",
  );
  // A trailing slash is no part of the path.
  const slashed = redactor({ rootDir: "/nowhere/root/", runsDir: "/nowhere/runs//", home: "/h/me/" });
  assert.equal(slashed("/nowhere/root/a /nowhere/runs /h/me/b"), "<root>/a <runsDir> ~/b");
  // A directory not made yet is known by the realpath of its nearest ancestor too (macOS: /var is /private/var).
  const base = tempDir(t);
  const linked = join(tempDir(t), "link");
  symlinkSync(base, linked);
  const later = redactor({ rootDir: "/nowhere/root", runsDir: join(linked, "runs", "later"), home: "/nowhere/home" });
  assert.equal(later(`${join(base, "runs", "later", "x")} ${join(linked, "runs", "later")}`), "<runsDir>/x <runsDir>");
  assert.ok(tokenMatches("ab".repeat(32), "ab".repeat(32)));
  assert.ok(!tokenMatches("ab".repeat(32), "ab".repeat(31)));
  assert.ok(!tokenMatches("ab".repeat(32), null));
});
