// The dashboard's server and `lvrtc serve`: it listens on 127.0.0.1 only, refuses another Host (403), any method
// but GET and HEAD (405) and any name it did not list (404, traversal included); its pages and JSON twins agree,
// escape what they show, show a file that cannot be read as a problem, are the same bytes for the same files, name
// no absolute path, say nothing the wording lint rejects, and write nothing anywhere.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { connect } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { baselineText } from "../../src/baseline/build.ts";
import { createServeCommand } from "../../src/cli/commands/serve.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { escapeHtml, renderBaseline, renderBaselineRun } from "../../src/dashboard/html.ts";
import { createViews, pathSegments, startDashboard } from "../../src/dashboard/server.ts";
import type { Dashboard } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";
import { tempDir } from "../core/support.ts";
import { buildFixture, fetchFrom, treeOf, visibleText, walkView } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

let fixture: DashboardFixture;
let dashboard: Dashboard;
let mtfDashboard: Dashboard;
let before_: { root: string[]; runs: string[]; mtfRoot: string[]; mtfRuns: string[] };

before(async () => {
  fixture = await buildFixture();
  before_ = {
    root: treeOf(fixture.rootDir),
    runs: treeOf(fixture.runsDir),
    mtfRoot: treeOf(fixture.mtfRootDir),
    mtfRuns: treeOf(fixture.mtfRunsDir),
  };
  dashboard = await startDashboard({ rootDir: fixture.rootDir, runsDir: fixture.runsDir, port: 0 });
  mtfDashboard = await startDashboard({
    rootDir: fixture.mtfRootDir,
    runsDir: fixture.mtfRunsDir,
    port: 0,
    policyFile: fixture.mtfPolicyFile,
  });
});
after(async () => {
  await dashboard.close();
  await mtfDashboard.close();
  fixture.remove();
});

/** Every page path of a dashboard, read from its own index, run and baseline pages. */
async function everyPage(port: number): Promise<string[]> {
  const index = JSON.parse((await fetchFrom(port, "/api/index")).body);
  const paths = ["/"];
  const viewOf = async (path: string) => JSON.parse((await fetchFrom(port, `/api${path}`)).body);
  for (const run of index.runs as { name: string }[]) {
    const path = `/run/${encodeURIComponent(run.name)}`;
    paths.push(path);
    const view = await viewOf(path);
    const sections: { section: number }[] = [...view.sections];
    for (const { place } of view.runs as { place: number }[]) {
      paths.push(`${path}/run/${place}`);
      if (view.split) sections.push(...(await viewOf(`${path}/run/${place}`)).sections);
    }
    for (const section of sections) paths.push(`${path}/section/${section.section}`);
  }
  for (const baseline of index.baselines as { stem: string }[]) {
    const path = `/baseline/${encodeURIComponent(baseline.stem)}`;
    paths.push(path);
    for (const { place } of (await viewOf(path)).runs as { place: number }[]) paths.push(`${path}/run/${place}`);
  }
  return paths;
}

test("it listens on 127.0.0.1 alone, and answers its own host by address or as localhost", async () => {
  assert.match(dashboard.url, /^http:\/\/127\.0\.0\.1:\d+\/$/);
  assert.equal((await fetchFrom(dashboard.port, "/")).status, 200);
  assert.equal((await fetchFrom(dashboard.port, "/", { host: `localhost:${dashboard.port}` })).status, 200);
  // Not on the IPv6 loopback: nothing listens there.
  const reached = await new Promise<boolean>((resolve) => {
    const socket = connect({ host: "::1", port: dashboard.port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
  assert.equal(reached, false);
});

test("a Host header other than its own is refused with 403, whatever the path", async () => {
  for (const host of [
    "evil.example",
    `evil.example:${dashboard.port}`,
    `127.0.0.1:${dashboard.port + 1}`,
    "127.0.0.1",
  ]) {
    for (const path of ["/", "/api/index", "/run/fake-pair"]) {
      const answer = await fetchFrom(dashboard.port, path, { host });
      assert.equal(answer.status, 403, `${host} ${path}`);
      assert.doesNotMatch(answer.body, /fake-pair/);
    }
  }
});

test("only GET and HEAD: any other method is 405, and HEAD has GET's headers and no body", async () => {
  for (const method of ["POST", "PUT", "DELETE", "PATCH", "OPTIONS"]) {
    const answer = await fetchFrom(dashboard.port, "/", { method });
    assert.equal(answer.status, 405, method);
    assert.equal(answer.headers.allow, "GET, HEAD");
  }
  const got = await fetchFrom(dashboard.port, "/run/fake-pair");
  const head = await fetchFrom(dashboard.port, "/run/fake-pair", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.body, "");
  assert.equal(head.headers["content-length"], got.headers["content-length"]);
  assert.equal(head.headers["content-type"], "text/html; charset=utf-8");
});

test("a name the server did not list is 404, and so is every way of climbing out", async () => {
  const paths = [
    "/nothing",
    "/run/no-such-suite",
    "/run/../baselines",
    "/run/..",
    "/run/%2e%2e",
    "/run/%2E%2E/%2E%2E/etc",
    "/run/..%2F..%2Fetc%2Fpasswd",
    "/run/fake-pair%2F..%2Ffake-group",
    "/run/store",
    "/run/fake-pair/section/99",
    "/run/fake-pair/section/01",
    "/run/fake-pair/section/-1",
    "/run/corrupt/section/0",
    "/run/fake-pair/",
    "/baseline/..%2Fpolicy",
    "/baseline/fake-pair.json",
    "/baseline/%00",
    "/run/%E0%A4%A",
    "/api/run/no-such-suite",
    "/api/baseline/no-such",
    "/api",
    "/api/",
  ];
  for (const path of paths) {
    const answer = await fetchFrom(dashboard.port, path);
    assert.equal(answer.status, 404, path);
    assert.doesNotMatch(answer.body, /at .*\.ts:\d+/, "no stack trace");
  }
  assert.deepEqual(pathSegments("/run/%2e%2e"), ["run", ".."]);
  assert.equal(pathSegments("/run/%E0%A4%A"), null);
});

test("the HTML page and its JSON twin agree: the twin is the view, and the page shows every figure of it", async () => {
  for (const [server, sourcesOf] of [
    [dashboard, () => createSources({ rootDir: fixture.rootDir, runsDir: fixture.runsDir })],
    [
      mtfDashboard,
      () =>
        createSources({ rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile }),
    ],
  ] as const) {
    const views = createViews(sourcesOf(), () => ({ state: "not-asked" }));
    for (const path of await everyPage(server.port)) {
      const html = await fetchFrom(server.port, path);
      const twin = await fetchFrom(server.port, path === "/" ? "/api/index" : `/api${path}`);
      assert.equal(html.status, 200, path);
      assert.equal(twin.status, 200, path);
      assert.equal(twin.headers["content-type"], "application/json; charset=utf-8");
      const view = JSON.parse(twin.body);
      assert.equal(twin.body, `${canonicalJson(view)}\n`, `${path}: canonical JSON and a newline`);
      const segments = path.split("/").slice(1).map(decodeURIComponent);
      const built =
        path === "/"
          ? views.index()
          : segments[0] === "baseline"
            ? segments.length === 4
              ? views.baselineRun(segments[1], Number(segments[3]))
              : views.baseline(segments[1])
            : segments.length === 4
              ? segments[2] === "section"
                ? views.section(segments[1], Number(segments[3]))
                : views.runPart(segments[1], Number(segments[3]))
              : views.run(segments[1]);
      assert.equal(twin.body, `${canonicalJson(built)}\n`, `${path}: the twin is the view`);
      for (const { figure } of walkView(view).figures) {
        assert.ok(
          html.body.includes(escapeHtml(figure.source.pointer)),
          `${path}: the page shows ${figure.source.pointer}`,
        );
      }
    }
  }
});

test("a run name with < and & is escaped wherever a page shows it, and its page is found by it", async () => {
  const index = await fetchFrom(dashboard.port, "/");
  assert.ok(index.body.includes("a&lt;b&amp;c"));
  assert.ok(!index.body.includes("a<b&c"));
  assert.ok(index.body.includes('href="/run/a%3Cb%26c"'));
  const run = await fetchFrom(dashboard.port, "/run/a%3Cb%26c");
  assert.equal(run.status, 200);
  assert.ok(run.body.includes("Run of a&lt;b&amp;c"));
  assert.ok(!run.body.includes("a<b&c"));
});

test("a comparison file that is not JSON is a problem on the page and in its twin, never a failure", async () => {
  const run = await fetchFrom(dashboard.port, "/run/corrupt");
  assert.equal(run.status, 200);
  const problem = DASHBOARD_TEXT.documentProblem("corrupt/comparisons.json", "the file is not JSON");
  assert.ok(visibleText(run.body).includes(problem));
  const twin = JSON.parse((await fetchFrom(dashboard.port, "/api/run/corrupt")).body);
  assert.deepEqual(twin.problems, [{ document: "corrupt/comparisons.json", problem: "the file is not JSON" }]);
  assert.equal(twin.comparisons, "invalid");
  // Comparisons that cannot be read are a problem, not a run that was never compared.
  assert.ok(visibleText(run.body).includes(DASHBOARD_TEXT.comparisonsUnreadable));
  assert.ok(!visibleText(run.body).includes(DASHBOARD_TEXT.notCompared));
  const index = JSON.parse((await fetchFrom(dashboard.port, "/api/index")).body);
  const corrupt = index.runs.find((each: { name: string }) => each.name === "corrupt");
  assert.deepEqual(corrupt.problems, twin.problems);
  assert.equal(corrupt.comparisons, "invalid");
  const indexPage = await fetchFrom(dashboard.port, "/");
  const row = indexPage.body.split("<tr>").find((each) => each.includes('href="/run/corrupt"')) ?? "";
  assert.ok(!/<td>no<\/td>/.test(row), "an unreadable file is no run that was not compared");
  assert.ok(row.includes("corrupt/comparisons.json cannot be shown"));
  const broken = await fetchFrom(dashboard.port, "/baseline/broken");
  assert.equal(broken.status, 200);
  assert.match(visibleText(broken.body), /baselines\/broken\.json cannot be shown: not a valid baseline/);
});

test("the same files give the same bytes, and no page or view names an absolute path", async () => {
  const again = await startDashboard({ rootDir: fixture.rootDir, runsDir: fixture.runsDir, port: 0 });
  try {
    for (const path of await everyPage(dashboard.port)) {
      for (const asked of [path, path === "/" ? "/api/index" : `/api${path}`]) {
        const [one, two] = [await fetchFrom(dashboard.port, asked), await fetchFrom(again.port, asked)];
        assert.equal(one.body, two.body, asked);
        for (const absolute of [fixture.directory, REPO_ROOT, tmpdir(), "/Users/", "/private/", "/home/"]) {
          assert.ok(!one.body.includes(absolute), `${asked} names ${absolute}`);
        }
        assert.doesNotMatch(one.body, /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, `${asked}: no timestamp`);
      }
    }
  } finally {
    await again.close();
  }
});

test("every sentence of every page passes the wording lint", async () => {
  for (const server of [dashboard, mtfDashboard]) {
    for (const path of await everyPage(server.port)) {
      const text = visibleText((await fetchFrom(server.port, path)).body);
      assert.deepEqual(wordingProblems(text), [], path);
    }
  }
  // While asking, once asking failed, and with every run page split: those pages say other sentences.
  let answer: (outcome: { code: number; stdout: string }) => void = () => undefined;
  const asking = await startDashboard({
    rootDir: fixture.rootDir,
    runsDir: fixture.runsDir,
    port: 0,
    runPageRequests: 1,
    runner: () => new Promise((resolve) => (answer = resolve)),
  });
  try {
    for (const state of ["asking", "failed"]) {
      assert.equal(asking.asked().state, state);
      for (const path of await everyPage(asking.port)) {
        const text = visibleText((await fetchFrom(asking.port, path)).body);
        assert.deepEqual(wordingProblems(text), [], `${state} ${path}`);
      }
      answer({ code: 3, stdout: "" });
      await asking.answered;
    }
  } finally {
    await asking.close();
  }
});

test("nothing was written: the root and the runs directories, their stores included, are as they were", async () => {
  await everyPage(dashboard.port);
  await everyPage(mtfDashboard.port);
  assert.deepEqual(treeOf(fixture.rootDir), before_.root);
  assert.deepEqual(treeOf(fixture.runsDir), before_.runs);
  assert.deepEqual(treeOf(fixture.mtfRootDir), before_.mtfRoot);
  assert.deepEqual(treeOf(fixture.mtfRunsDir), before_.mtfRuns);
});

test("lvrtc serve: prints its URL, asks the engines once it listens, serves LVRTC_RUNS_DIR, and stops when told", async () => {
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const asked: string[][] = [];
  let seen = 0;
  let state = "";
  const inputs = {
    rootDir: fixture.rootDir,
    cwd: fixture.rootDir,
    env: { LVRTC_RUNS_DIR: fixture.runsDir },
    // A scripted child: every engine of every baseline is unavailable. No engine is started.
    runnerFor: () => async (ids: readonly string[]) => {
      asked.push([...ids]);
      const engines = ids.map((id) => ({ id, status: "unavailable", code: "not-configured" }));
      return { code: 0, stdout: JSON.stringify({ engines }) };
    },
  };
  const command = createServeCommand({
    ...inputs,
    untilStopped: async (served) => {
      assert.equal(out.join(""), `${served.url}\n`);
      seen = (await fetchFrom(served.port, "/api/run/fake-pair")).status;
      state = (await served.answered).state;
    },
  });
  assert.equal(await runCli(["serve", "--port", "0"], io, [command]), EXIT_OK, err.join(""));
  assert.equal(seen, 200);
  assert.equal(state, "asked");
  assert.deepEqual(asked, [["fake-a", "fake-b", "fake-far", "fake-near", "fake-none"]]);
  // --no-ask: no child at all, and the pages say the engines were not asked.
  asked.length = 0;
  const noAsk = createServeCommand({
    ...inputs,
    untilStopped: async (served) => {
      state = served.asked().state;
      const index = JSON.parse((await fetchFrom(served.port, "/api/index")).body);
      assert.deepEqual(index.engines, { state: "not-asked", problem: null });
    },
  });
  assert.equal(await runCli(["serve", "--port", "0", "--no-ask"], io, [noAsk]), EXIT_OK);
  assert.equal(state, "not-asked");
  assert.deepEqual(asked, []);
  // A port that is busy fails at once, before any engine is asked.
  const busy = await startDashboard({ rootDir: fixture.rootDir, runsDir: fixture.runsDir, port: 0 });
  try {
    const failed: string[] = [];
    const io2 = { stdout: () => undefined, stderr: (text: string) => void failed.push(text) };
    assert.equal(await runCli(["serve", "--port", String(busy.port)], io2, [command]), EXIT_FAILURE);
    assert.match(failed.join(""), /cannot listen on 127\.0\.0\.1:\d+ \(EADDRINUSE\)/);
    assert.deepEqual(asked, []);
  } finally {
    await busy.close();
  }
  for (const args of [
    ["--port", "70000"],
    ["--port", "x"],
    ["extra"],
    ["--root", "/nonexistent-root-of-lvrtc"],
    ["--ask-engines"],
  ]) {
    const usage: string[] = [];
    const code = await runCli(
      ["serve", ...args],
      { stdout: () => undefined, stderr: (text) => void usage.push(text) },
      [command],
    );
    assert.equal(code, EXIT_USAGE, args.join(" "));
    assert.match(usage.join(""), /Usage: lvrtc serve \[--root <dir>\] \[--port <n>\] \[--no-ask\]/);
  }
  const help: string[] = [];
  assert.equal(
    await runCli(["serve", "--help"], { stdout: (text) => void help.push(text), stderr: () => undefined }, [command]),
    EXIT_OK,
  );
  assert.match(help.join(""), /127\.0\.0\.1 only/);
});

test("an exception while answering is a bare 500 to the client and its stack on the server's error stream", async (t) => {
  const written: string[] = [];
  t.mock.method(process.stderr, "write", (chunk: string) => {
    written.push(String(chunk));
    return true;
  });
  // Sources that throw where none of their own checks would: what a mistake of the code looks like.
  const sources = createSources({ rootDir: fixture.rootDir, runsDir: fixture.runsDir });
  const throwing = {
    ...sources,
    runNames: (): string[] => {
      throw new TypeError("a mistake of the code");
    },
  };
  const broken = await startDashboard({
    rootDir: fixture.rootDir,
    runsDir: fixture.runsDir,
    port: 0,
    sources: throwing,
  });
  try {
    const answer = await fetchFrom(broken.port, "/");
    assert.equal(answer.status, 500);
    assert.equal(answer.body, "internal error\n");
    assert.ok(written.some((text) => text.startsWith("lvrtc serve: TypeError: a mistake of the code\n    at ")));
  } finally {
    await broken.close();
  }
});

test("a baseline page is a summary: a catalog of 1,341 runs stays within a few hundred KB, each run on its own page", (t) => {
  // The fixture's pair baseline, its runs repeated to the catalog's 1,341, five rungs a run.
  const pair = JSON.parse(readFileSync(join(fixture.rootDir, "baselines", "fake-pair.json"), "utf8")) as Baseline;
  const [template] = pair.runs;
  const rungs = ["r0", "r1", "r2", "r3", "r4"].map((rung) => ({ ...template.rungs[0], rung }));
  const large: Baseline = {
    ...pair,
    runs: Array.from({ length: 1341 }, (_unused, index) => ({ ...template, name: `lens-${index}-wide`, rungs })),
  };
  const root = join(tempDir(t), "root");
  mkdirSync(join(root, "baselines"), { recursive: true });
  writeFileSync(join(root, "baselines", "large.json"), baselineText(large));
  const views = createViews(createSources({ rootDir: root, runsDir: join(root, "runs") }), () => ({
    state: "not-asked",
  }));
  const view = views.baseline("large");
  assert.equal(view.summary.records, 1341 * 5);
  const size = (text: string): number => Buffer.byteLength(text) / 1024;
  assert.ok(size(renderBaseline(view)) < 600, `${size(renderBaseline(view))} KB of HTML`);
  assert.ok(size(canonicalJson(view)) < 400, `${size(canonicalJson(view))} KB of JSON`);
  const run = views.baselineRun("large", 1340);
  assert.equal(run?.name, "lens-1340-wide");
  assert.ok(size(renderBaselineRun(run!)) < 50);
});
