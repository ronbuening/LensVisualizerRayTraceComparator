// Stage 8.4's "Run this lens", from the UI: what a run of one lens is refused for before any child is started (its
// fields, the form of its key, its engines and aperture, and more jobs than the memory budget allows, as 400), then the
// fake LensVisualizer tree end to end: LensVisualizer's catalog read by a child `lvrtc lenses list`, a key not in it
// ending its job there with lvrtc mtf never run, and a key of it run as `lvrtc mtf <key> --profile benchmark`, after
// which its lens page gathers the run directory the command wrote. Every child loads only the fake tree.
import assert from "node:assert/strict";
import { cpSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";

import { controlChoices } from "../../src/cli/commands/serve.ts";
import { CONFIG_FILE, REPO_ROOT, loadConfig } from "../../src/core/config.ts";
import type { ControlOptions, ControlView, JobView } from "../../src/dashboard/control.ts";
import type { LensView } from "../../src/dashboard/lens.ts";
import { startDashboard } from "../../src/dashboard/server.ts";
import type { Dashboard } from "../../src/dashboard/server.ts";
import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";
import { tempDir } from "../core/support.ts";
import { FAKE_LV } from "../engines/lv/support.ts";
import { fetchFrom, titleTexts, treeOf, visibleText } from "./support.ts";

const TEXT = DASHBOARD_TEXT.control;
const FORM = "application/x-www-form-urlencoded";
const WAIT_MS = 180_000;
const LENS = "acme-singlet-50";

/** Every way an absolute path of this machine could show. */
const ABSOLUTE = [REPO_ROOT, tmpdir(), "/Users/", "/private/", "/home/", "/var/folders/"];

/** A root of its own whose LensVisualizer is a copy of the fake tree, and a runs directory beside it. */
function lensRoot(t: TestContext): { rootDir: string; runsDir: string } {
  const base = tempDir(t);
  const rootDir = join(base, "root");
  cpSync(FAKE_LV, join(rootDir, "lv"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv" }));
  return { rootDir, runsDir: join(base, "runs") };
}

/** The environment of the children: this process's, without the variables that would name another LV or runs. */
function childEnvironment(): Record<string, string | undefined> {
  const env = { ...process.env };
  delete env.LVRTC_LV_PATH;
  delete env.LVRTC_RUNS_DIR;
  return env;
}

/** A dashboard over the root, with run control's lists and the options given; closed when the test ends. */
async function served(
  t: TestContext,
  rootDir: string,
  runsDir: string,
  extra: Partial<ControlOptions> = {},
): Promise<Dashboard> {
  const env = childEnvironment();
  const control = { ...controlChoices(loadConfig({ rootDir, env }), [], env), killGraceMs: 300, ...extra };
  const dashboard = await startDashboard({ rootDir, runsDir, port: 0, control });
  t.after(() => dashboard.close());
  return dashboard;
}

async function tokenOf(port: number): Promise<string> {
  const page = await fetchFrom(port, "/control");
  const found = /name="token" value="([0-9a-f]{64})"/.exec(page.body);
  assert.ok(found !== null, "the control page carries a token");
  return found[1];
}

function post(port: number, fields: Readonly<Record<string, string>>) {
  return fetchFrom(port, "/control/lens", {
    method: "POST",
    body: new URLSearchParams(fields).toString(),
    headers: { "content-type": FORM, origin: `http://127.0.0.1:${port}`, "sec-fetch-site": "same-origin" },
  });
}

async function controlView(port: number): Promise<ControlView> {
  return JSON.parse((await fetchFrom(port, "/api/control")).body) as ControlView;
}

async function ended(port: number, job: number): Promise<JobView> {
  const until = Date.now() + WAIT_MS;
  for (;;) {
    const view = JSON.parse((await fetchFrom(port, `/api/control/job/${job}`)).body) as JobView;
    if (!view.running) return view;
    assert.ok(Date.now() < until, `job ${job} did not end`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/** A page and its twin: lint-free wording (but a step's own output), and no absolute path anywhere. */
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

test("a run of one lens is refused for its fields, its key's form and its jobs, and no child is started", async (t) => {
  const { rootDir, runsDir } = lensRoot(t);
  // A budget of 2 GiB, a 16 GB machine's: one job at the profile's 2.5 GiB a job, and 4 GiB with optiland (R6c).
  const dashboard = await served(t, rootDir, runsDir, { memoryBudgetGiB: 2 });
  const { port } = dashboard;
  const token = await tokenOf(port);
  const valid = { token, lens: LENS, engines: "lv,ref", aperture: "f/8", jobs: "1" };
  for (const [fields, status, reason] of [
    [{ ...valid, lens: "" }, 400, TEXT.noLens],
    [{ ...valid, lens: "../etc/passwd" }, 400, TEXT.badLensKey("../etc/passwd")],
    [{ ...valid, lens: "a key" }, 400, TEXT.badLensKey("a key")],
    [{ ...valid, engines: "lv,wave" }, 400, TEXT.unknownLensEngine("wave", "lv, ref, optiland")],
    [{ ...valid, engines: "lv,lv" }, 400, TEXT.repeatedId],
    [{ ...valid, aperture: "f/5.6" }, 400, TEXT.badAperture("f/5.6", "wide-open, f/8")],
    [{ ...valid, jobs: "0" }, 400, TEXT.badJobs("0", "4")],
    [{ ...valid, jobs: "5" }, 400, TEXT.badJobs("5", "4")],
    [{ ...valid, jobs: "two" }, 400, TEXT.badJobs("two", "4")],
    [{ ...valid, jobs: "2" }, 400, TEXT.tooManyJobs("2", "1", "2", "2.5")],
    [{ ...valid, engines: "lv,optiland", jobs: "2" }, 400, TEXT.tooManyJobs("2", "1", "2", "4")],
    [{ ...valid, suite: "fake-pair" }, 400, TEXT.unknownField("suite")],
    [{ ...valid, token: "0".repeat(64) }, 403, TEXT.refusedToken],
  ] as const) {
    const refused = await post(port, fields);
    assert.equal(refused.status, status, JSON.stringify(fields));
    assert.ok(visibleText(refused.body).includes(reason), `${JSON.stringify(fields)}: ${visibleText(refused.body)}`);
  }
  const repeated = await fetchFrom(port, "/control/lens", {
    method: "POST",
    body: `${new URLSearchParams(valid).toString()}&lens=${LENS}`,
    headers: { "content-type": FORM },
  });
  assert.equal(repeated.status, 400);
  assert.ok(visibleText(repeated.body).includes(TEXT.repeatedField("lens")));
  const got = await fetchFrom(port, "/control/lens");
  assert.equal(got.status, 405);
  assert.equal(got.headers.allow, "POST");
  assert.deepEqual((await controlView(port)).jobs, [], "no job was started");
  assert.equal(existsSync(runsDir), false, "nothing was written");

  // A dashboard without run control's lists runs no lens. A runner gives its control page a form, and so a token.
  const runner = async () => ({ code: 0, stdout: JSON.stringify({ engines: [] }) });
  const bare = await startDashboard({ rootDir, runsDir, port: 0, runner });
  t.after(() => bare.close());
  await bare.answered;
  const refused = await post(bare.port, { ...valid, token: await tokenOf(bare.port) });
  assert.equal(refused.status, 409);
  assert.ok(visibleText(refused.body).includes(TEXT.notConfigured));
  assert.equal(existsSync(runsDir), false, "nothing was written");
});

test("Run this lens from the UI on the fake tree: the catalog read, lvrtc mtf run, and the lens page of its runs", async (t) => {
  const { rootDir, runsDir } = lensRoot(t);
  const dashboard = await served(t, rootDir, runsDir);
  const { port } = dashboard;
  const control = await holdPage(port, "/control");
  assert.match(control, /<form method="post" action="\/control\/lens">/);
  const token = await tokenOf(port);

  // A key of the right form that is not in the catalog: the job reads the catalog and ends there.
  const missing = await post(port, { token, lens: "acme-nothing-99", engines: "lv,ref", jobs: "1" });
  assert.equal(missing.status, 303, missing.body);
  assert.equal(missing.headers.location, "/control/job/1");
  const none = await ended(port, 1);
  assert.deepEqual(
    none.steps.map((step) => [step.name, step.state, step.exitCode]),
    [
      ["catalog", "exited", 0],
      ["mtf", "not-run", null],
    ],
  );
  assert.deepEqual(none.catalog, { found: false, said: TEXT.lensNotInCatalog("acme-nothing-99") });
  assert.ok(!(existsSync(runsDir) && readdirSync(runsDir).includes("mtf-acme-nothing-99")), "lvrtc mtf never ran");
  const noneLens = await holdPage(port, "/lens/acme-nothing-99");
  assert.ok(visibleText(noneLens).includes(DASHBOARD_TEXT.lens.noRuns), "a job's lens has a page, with no run yet");

  // A key of the catalog: lvrtc mtf with the profile benchmark, wide open and at f/8 asked as f/8 alone.
  const started = await post(port, { token, lens: LENS, engines: "lv,ref", aperture: "f/8", jobs: "1" });
  assert.equal(started.status, 303, started.body);
  assert.equal(started.headers.location, "/control/job/2");
  // One job at a time: a second run while this one runs is refused.
  const busy = await post(port, { token, lens: LENS, jobs: "1" });
  assert.equal(busy.status, 409);
  assert.ok(visibleText(busy.body).includes(TEXT.busyJob("2")));
  const job = await ended(port, 2);
  assert.deepEqual(
    job.steps.map((step) => step.command),
    [
      "LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs lenses list --root <root> --json",
      `LVRTC_RUNS_DIR=<runsDir> node bin/lvrtc.mjs mtf ${LENS} --profile benchmark --root <root> --engines lv,ref --aperture f/8 --jobs 1`,
    ],
  );
  assert.equal(job.steps[0].state, "exited");
  assert.equal(job.steps[0].exitCode, 0);
  assert.ok(!job.steps[0].output.includes('"lenses"'), "the catalog's list is read, not shown");
  assert.deepEqual(job.catalog, { found: true, said: TEXT.lensInCatalog(LENS) });
  // lvrtc mtf exits 1 where a gated pair fails: the fake's geometric MTF is no sampling, so its replay is a FAIL.
  assert.equal(job.steps[1].state, "exited");
  assert.ok(job.steps[1].exitCode === 0 || job.steps[1].exitCode === 1, job.steps[1].output);
  assert.deepEqual(job.lens, LENS);
  const jobPage = await holdPage(port, "/control/job/2");
  assert.ok(jobPage.includes(`<a href="/lens/${LENS}">`) && jobPage.includes(`<a href="/run/mtf-${LENS}">`));

  // The lens page gathers the run directory lvrtc mtf wrote: four conditions at f/8.
  await holdPage(port, `/lens/${LENS}`);
  const view = JSON.parse((await fetchFrom(port, `/api/lens/${LENS}`)).body) as LensView;
  assert.deepEqual(
    view.runs.map((run) => [run.suite, run.run]),
    ["-f8-ref", "-f8-photopic", "-f8-best-ref", "-f8-best-photopic"].map((mark) => [`mtf-${LENS}`, `${LENS}${mark}`]),
  );
  for (const run of view.runs) {
    assert.ok(run.condition !== null && run.condition.plane !== null, `${run.run}: its condition and recipe plane`);
    assert.equal(run.condition.plane.kind, run.run.includes("-best-") ? "lv-best-axial" : "design");
    assert.deepEqual(
      run.requests.map((request) => request.rung),
      ["r4f", "r6b"],
    );
  }
  const quick = view.runs[0].requests[0].quick;
  assert.ok(quick !== null);
  const drawn = await holdPage(port, `/lens/${LENS}?${quick}`);
  const chosen = JSON.parse((await fetchFrom(port, `/api/lens/${LENS}?${quick}`)).body) as LensView;
  assert.deepEqual(
    chosen.curves.map((curve) => curve.engine),
    ["lv", "replay"],
  );
  assert.deepEqual(
    chosen.within?.view.pairs.map((pair) => [pair.a, pair.b]),
    [["replay", "lv"]],
  );
  assert.match(drawn, /<svg class="lvc"/);
  const index = JSON.parse((await fetchFrom(port, "/api/index")).body) as { lenses: { key: string }[] };
  assert.deepEqual(
    index.lenses.map((lens) => lens.key),
    [LENS],
  );
  assert.ok(
    treeOf(rootDir).every((entry) => !entry.startsWith("/runs")),
    "the root holds no run",
  );
});
