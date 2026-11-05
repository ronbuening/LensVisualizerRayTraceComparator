// Stage 8.4's store maintenance from the UI, on temporary stores only (never `runs/store`): a plan of prune or of
// compress is a dry run that changes nothing and shows the command's report, the prune's notice and the digest of the
// store's state; the confirmation is a separate POST from that plan's page, held by the server (409) and again by the
// command to that state, and it changes exactly what the plan showed. A store that changed, a later plan, a digest
// the dashboard did not show, a temporary file of a writer and a running job are refused with nothing changed; a
// conflict of compress is shown as the command states it and never resolved.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { gunzipSync } from "node:zlib";

import { makeResult } from "../../src/contract/result.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { createResultStore } from "../../src/core/resultStore.ts";
import {
  PRUNE_NOTICE,
  StoreChangedError,
  committedBaselineEngines,
  compressStore,
  pruneStore,
  storeState,
} from "../../src/core/storeMaintenance.ts";
import type { JobView } from "../../src/dashboard/control.ts";
import { startDashboard } from "../../src/dashboard/server.ts";
import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";
import { tempDir } from "../core/support.ts";
import { echoRequest } from "../engines/support.ts";
import { fetchFrom, titleTexts, visibleText, walkView } from "./support.ts";

const STORE = DASHBOARD_TEXT.store;
const FORM = "application/x-www-form-urlencoded";
const ABSOLUTE = [REPO_ROOT, tmpdir(), "/Users/", "/private/", "/home/", "/var/folders/"];

const request = echoRequest(Float64Array.of(-0, 1, 2), 2);

/** A root whose HEAD is this repository's (its committed baselines protect), and a temporary store under its runs. */
function storeRoot(t: TestContext) {
  const root = tempDir(t);
  // A temporary work tree that reads this repository's immutable HEAD, with no Git write operation.
  const gitDir = execFileSync("git", ["-C", REPO_ROOT, "rev-parse", "--absolute-git-dir"], { encoding: "utf8" }).trim();
  writeFileSync(join(root, ".git"), `gitdir: ${gitDir}\n`);
  const runsDir = join(root, "runs");
  const directory = join(runsDir, "store");
  mkdirSync(directory, { recursive: true });
  const engines = committedBaselineEngines(root);
  const store = createResultStore(directory);
  /** An entry answered by `stamp`: one of a committed engine version is kept, any other removable. */
  const write = (stamp: { id: string; fingerprint: string; adapterRevision?: string }, size = 2): string =>
    store.put(
      echoRequest(
        Float64Array.from({ length: size }, (_unused, index) => index),
        size,
      ),
      makeResult(
        echoRequest(
          Float64Array.from({ length: size }, (_unused, index) => index),
          size,
        ),
        { ...stamp, details: {} },
        {
          status: "unsupported",
          unsupported: [{ code: "quantity", item: request.quantity, message: "fixture" }],
        },
      ),
    )!;
  return { root, runsDir, directory, engines, store, write };
}

/** The entries of a store, with their bytes: a snapshot. */
function files(directory: string): [string, string][] {
  return readdirSync(directory)
    .sort()
    .map((file) => [file, readFileSync(join(directory, file)).toString("base64")]);
}

async function served(t: TestContext, root: string, runsDir: string) {
  const env = { ...process.env };
  delete env.LVRTC_LV_PATH;
  delete env.LVRTC_RUNS_DIR;
  const control = { suites: [], engines: [], exchangeEngines: [], env, killGraceMs: 300 };
  const dashboard = await startDashboard({ rootDir: root, runsDir, port: 0, control });
  t.after(() => dashboard.close());
  const page = (await fetchFrom(dashboard.port, "/control")).body;
  const token = /name="token" value="([0-9a-f]{64})"/.exec(page)?.[1];
  assert.ok(token !== undefined);
  const post = (action: string, fields: Readonly<Record<string, string>> = {}) =>
    fetchFrom(dashboard.port, `/control/${action}`, {
      method: "POST",
      body: new URLSearchParams({ token, ...fields }).toString(),
      headers: { "content-type": FORM, origin: `http://127.0.0.1:${dashboard.port}`, "sec-fetch-site": "same-origin" },
    });
  const ended = async (job: number): Promise<JobView> => {
    for (let tries = 0; ; tries++) {
      const view = JSON.parse((await fetchFrom(dashboard.port, `/api/control/job/${job}`)).body) as JobView;
      if (!view.running) return view;
      assert.ok(tries < 1200, `job ${job} did not end`);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };
  /** A page: lint-free (but a step's own output), no absolute path; its twin too. */
  const hold = async (path: string): Promise<string> => {
    const answer = await fetchFrom(dashboard.port, path);
    assert.equal(answer.status, 200, path);
    const sentences = answer.body.replace(/<pre>[\s\S]*?<\/pre>/g, "").replace(/<code>[\s\S]*?<\/code>/g, "");
    assert.deepEqual(wordingProblems(visibleText(sentences)), [], path);
    assert.deepEqual(wordingProblems(titleTexts(answer.body).join("\n\n")), [], path);
    const twin = await fetchFrom(dashboard.port, `/api${path}`);
    for (const body of [answer.body, twin.body]) {
      for (const absolute of ABSOLUTE) assert.ok(!body.includes(absolute), `${path} names ${absolute}`);
    }
    return answer.body;
  };
  return { dashboard, post, ended, hold };
}

test("a plan of prune changes nothing, and its confirmation removes exactly the entries it planned", async (t) => {
  const { root, runsDir, directory, engines, write } = storeRoot(t);
  const engine = engines[0];
  const kept = write(engine);
  const removable = [write({ ...engine, fingerprint: "unreferenced fingerprint" }), write({ ...engine, id: "x" }, 3)];
  const before = files(directory);
  const { dashboard, post, ended, hold } = await served(t, root, runsDir);

  const control = await hold("/control");
  for (const sentence of [STORE.intro, STORE.writers, STORE.pruneRule, STORE.compressRule, STORE.temporary]) {
    assert.ok(visibleText(control).includes(sentence), sentence);
  }
  assert.match(control, /<form method="post" action="\/control\/plan-prune">/);

  const planned = await post("plan-prune");
  assert.equal(planned.status, 303, planned.body);
  assert.equal(planned.headers.location, "/control/job/1");
  const plan = await ended(1);
  assert.deepEqual(files(directory), before, "a plan changes nothing");
  assert.deepEqual(
    plan.steps.map((step) => [step.command, step.exitCode]),
    [["LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs store prune --root <root> --json", 0]],
  );
  const report = plan.store;
  assert.ok(report !== null && report.prune !== null);
  assert.equal(report.state, storeState(directory, engines), "the state the test computes of the store itself");
  assert.equal(report.dryRun, true);
  assert.equal(report.confirmable, true);
  assert.equal(report.prune.notice, PRUNE_NOTICE);
  assert.deepEqual(wordingProblems(PRUNE_NOTICE), [], "the notice passes the lint");
  // Every number of the report is a count, recounted from the store by the test.
  const size = (key: string): number => readFileSync(join(directory, `${key}.json.gz`)).length;
  const expected = new Map<string, number>([
    ["/job", 1],
    ["/steps/0/exitCode", 0],
    ["/store/prune/protectedEngines/count", new Set(engines.map((each) => JSON.stringify(each))).size],
    ["/store/prune/deleted/count", 0],
  ]);
  const byEngine = [
    { engine: engine.id, kept: [kept], removable: [removable[0]] },
    { engine: "x", kept: [], removable: [removable[1]] },
  ].sort((a, b) => a.engine.localeCompare(b.engine));
  byEngine.forEach((each, e) => {
    expected.set(`/store/prune/engines/${e}/kept/files`, each.kept.length);
    expected.set(
      `/store/prune/engines/${e}/kept/bytes`,
      each.kept.map(size).reduce((sum, n) => sum + n, 0),
    );
    expected.set(`/store/prune/engines/${e}/removable/files`, each.removable.length);
    expected.set(
      `/store/prune/engines/${e}/removable/bytes`,
      each.removable.map(size).reduce((sum, n) => sum + n, 0),
    );
  });
  report.prune.removable.forEach((version, v) => {
    const key = version.engine === "x" ? removable[1] : removable[0];
    expected.set(`/store/prune/removable/${v}/files`, 1);
    expected.set(`/store/prune/removable/${v}/bytes`, size(key));
  });
  const walked = walkView(plan);
  assert.deepEqual(walked.strays, []);
  const sorted = (map: Map<string, number>) => [...map].sort(([a], [b]) => (a < b ? -1 : 1));
  assert.deepEqual(sorted(walked.counts), sorted(expected), "every count, recounted from the store");

  const page = await hold("/control/job/1");
  assert.ok(page.includes(`<strong>${PRUNE_NOTICE.replaceAll("'", "&#39;")}</strong>`), "the notice, prominently");
  assert.match(page, /<form method="post" action="\/control\/prune">/);
  assert.ok(page.includes(`name="state" value="${report.state}"`));
  const jobPage = await fetchFrom(dashboard.port, "/control/job/1");
  assert.match(String(jobPage.headers["content-security-policy"]), /form-action 'self'/);
  assert.equal(jobPage.headers["referrer-policy"], "same-origin");

  const confirmed = await post("prune", { plan: "1", state: report.state! });
  assert.equal(confirmed.status, 303, confirmed.body);
  const done = await ended(2);
  assert.equal(done.steps[0].exitCode, 0, done.steps[0].output);
  assert.match(done.steps[0].command, / store prune --root <root> --yes --expect [0-9a-f]{64} --json$/);
  assert.equal(done.store?.dryRun, false);
  assert.equal(done.store?.prune?.deleted.count, 2);
  assert.deepEqual(
    files(directory),
    before.filter(([file]) => !removable.some((key) => file.startsWith(key))),
    "exactly the planned entries are gone",
  );
  await hold("/control/job/2");
  // The plan is consumed: its page takes no confirmation any more, and a second one is refused.
  assert.equal((await ended(1)).store?.confirmable, false);
  const again = await post("prune", { plan: "1", state: report.state! });
  assert.equal(again.status, 409);
  assert.ok(visibleText(again.body).includes(STORE.superseded("1")));
  assert.equal((await fetchFrom(dashboard.port, "/control/prune")).status, 405);
});

test("a confirmation is refused when the store changed, for a later plan, an unshown digest, a writer's file, or a job", async (t) => {
  const { root, runsDir, directory, engines, write } = storeRoot(t);
  write(engines[0]);
  write({ ...engines[0], fingerprint: "unreferenced fingerprint" });
  const { post, ended } = await served(t, root, runsDir);
  assert.equal((await post("plan-prune")).status, 303);
  const first = await ended(1);
  const state = first.store!.state!;

  // The store changed after the plan: a new entry. Nothing is deleted.
  const added = write({ ...engines[0], fingerprint: "another unreferenced" }, 5);
  const before = files(directory);
  const changed = await post("prune", { plan: "1", state });
  assert.equal(changed.status, 409);
  assert.ok(visibleText(changed.body).includes(STORE.changed("1")));
  assert.deepEqual(files(directory), before);

  // A later plan supersedes the first; a digest it did not show is refused.
  assert.equal((await post("plan-prune")).status, 303);
  const second = await ended(2);
  assert.notEqual(second.store?.state, state);
  const old = await post("prune", { plan: "1", state });
  assert.equal(old.status, 409);
  assert.ok(visibleText(old.body).includes(STORE.superseded("1")));
  const unshown = await post("prune", { plan: "2", state: "0".repeat(64) });
  assert.equal(unshown.status, 409);
  assert.ok(visibleText(unshown.body).includes(STORE.notShown("prune")));
  const wrongAction = await post("compress", { plan: "2", state: second.store!.state! });
  assert.equal(wrongAction.status, 409);
  for (const fields of [{ plan: "two", state }, { plan: "2" }, { plan: "2", state: "abc" }] as Record<
    string,
    string
  >[]) {
    const bad = await post("prune", fields);
    assert.equal(bad.status, 400, JSON.stringify(fields));
    assert.ok(visibleText(bad.body).includes(STORE.badConfirmation));
  }
  const extra = await post("prune", { plan: "2", state: second.store!.state!, yes: "1" });
  assert.equal(extra.status, 400);
  assert.ok(visibleText(extra.body).includes(DASHBOARD_TEXT.control.unknownField("yes")));

  // A temporary file of a writer in the store: refused, whatever the state.
  const temporary = join(directory, `${added}.json.gz.123.abc.tmp`);
  writeFileSync(temporary, "partial");
  const writing = await post("prune", { plan: "2", state: second.store!.state! });
  assert.equal(writing.status, 409);
  assert.ok(visibleText(writing.body).includes(STORE.writerFiles("1")));
  unlinkSync(temporary);
  assert.deepEqual(files(directory), before, "nothing was deleted");

  // While a job runs, neither a plan nor a confirmation is taken.
  assert.equal((await post("plan-compress")).status, 303);
  const busy = await post("plan-prune");
  assert.equal(busy.status, 409);
  assert.ok(visibleText(busy.body).includes(DASHBOARD_TEXT.control.busyJob("3")));
  await ended(3);
  assert.deepEqual(files(directory), before);
});

test("the command holds a change to the plan's state itself, and changes nothing where the store is another", (t) => {
  const { directory, engines, write } = storeRoot(t);
  write(engines[0]);
  write({ ...engines[0], fingerprint: "unreferenced fingerprint" });
  const before = files(directory);
  const plan = pruneStore(directory, engines);
  assert.equal(plan.state, storeState(directory, engines));
  assert.throws(() => pruneStore(directory, engines, true, "0".repeat(64)), StoreChangedError);
  assert.throws(() => compressStore(directory, true, "0".repeat(64)), StoreChangedError);
  assert.deepEqual(files(directory), before);
  // The protected engines are part of a prune's state: fewer protected, another state.
  const fewer = engines.filter((each) => JSON.stringify(each) !== JSON.stringify(engines[0]));
  assert.notEqual(storeState(directory, fewer), plan.state);
  assert.equal(pruneStore(directory, engines, true, plan.state).deleted, 1);
});

test("compress: a plan changes nothing, its confirmation gzips exactly the planned plain entries, a conflict is refused", async (t) => {
  const { root, runsDir, directory, engines, write } = storeRoot(t);
  const plain = write(engines[0]);
  const gzip = write(engines[0], 4);
  const compressed = readFileSync(join(directory, `${plain}.json.gz`));
  writeFileSync(join(directory, `${plain}.json`), gunzipSync(compressed));
  unlinkSync(join(directory, `${plain}.json.gz`));
  const before = files(directory);
  const { post, ended, hold } = await served(t, root, runsDir);

  assert.equal((await post("plan-compress")).status, 303);
  const plan = await ended(1);
  assert.deepEqual(files(directory), before, "a plan changes nothing");
  assert.deepEqual(
    [plan.store?.compress?.plain.files, plan.store?.compress?.compressed.files, plan.store?.compress?.changed.count],
    [1, 1, 0],
  );
  assert.equal(plan.store?.state, storeState(directory));
  assert.deepEqual(walkView(plan).strays, [], "every number of the report is a count");
  const page = await hold("/control/job/1");
  assert.match(page, /<form method="post" action="\/control\/compress">/);
  assert.equal((await post("compress", { plan: "1", state: plan.store!.state! })).status, 303);
  const done = await ended(2);
  assert.equal(done.steps[0].exitCode, 0, done.steps[0].output);
  assert.equal(done.store?.compress?.changed.count, 1);
  assert.deepEqual(readdirSync(directory).sort(), [`${gzip}.json.gz`, `${plain}.json.gz`].sort());
  assert.deepEqual(readFileSync(join(directory, `${plain}.json.gz`)), compressed, "the planned entry, its exact bytes");

  // A plain entry that differs from its gzip: the command refuses, the page says so as it states it, no form.
  writeFileSync(join(directory, `${gzip}.json`), "different");
  const conflicting = files(directory);
  assert.equal((await post("plan-compress")).status, 303);
  const refused = await ended(3);
  assert.equal(refused.steps[0].exitCode, 1);
  assert.match(refused.steps[0].output, /conflicting plain and gzip entries/);
  assert.equal(refused.store?.state, null);
  assert.equal(refused.store?.confirmable, false);
  const refusedPage = await hold("/control/job/3");
  assert.ok(visibleText(refusedPage).includes(DASHBOARD_TEXT.control.storeFailed("1")));
  assert.doesNotMatch(refusedPage, /action="\/control\/compress"/);
  assert.deepEqual(files(directory), conflicting, "the conflict is left as it is");
  rmSync(join(directory, `${gzip}.json`));
});
