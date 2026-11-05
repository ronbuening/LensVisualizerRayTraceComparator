// `lvrtc engine describe`: who engines say they are, in the shape and with the values a run's manifest records, and
// the dashboard's asking of it in a child, against the fake root's in-process engines only (never Python or LV).
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

import { createEngineCommand } from "../../src/cli/commands/engine.ts";
import { EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { askEngines, childDescribeRunner, parseDescribeOutput } from "../../src/dashboard/identity.ts";
import { createViews, startDashboard } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import { FAKE_ROOT, tempDir } from "../core/support.ts";
import { buildFixture, fetchFrom, readManifest } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));

let fixture: DashboardFixture;
before(async () => {
  fixture = await buildFixture();
});
after(() => fixture.remove());

async function describe(args: readonly string[], rootDir: string = FAKE_ROOT) {
  const out: string[] = [];
  const err: string[] = [];
  const command = createEngineCommand({ rootDir, env: {}, cwd: rootDir });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(["engine", "describe", ...args], io, [command]);
  return { code, out: out.join(""), err: err.join("") };
}

test("describe prints, per id in the order given, the engine a run's manifest records", async () => {
  const recorded = readManifest(fixture.runsDir, "fake-pair").engines;
  const ended = await describe(["fake-b", "fake-a", "no-such-engine", "--json"]);
  assert.equal(ended.code, EXIT_OK, ended.err);
  const printed = JSON.parse(ended.out);
  assert.equal(ended.out, `${canonicalJson(printed)}\n`, "canonical JSON and a newline");
  assert.deepEqual(printed.engines, [
    recorded.find((engine) => engine.id === "fake-b"),
    recorded.find((engine) => engine.id === "fake-a"),
    { id: "no-such-engine", status: "unavailable", code: "not-configured" },
  ]);
  const lines = await describe(["fake-a", "no-such-engine"]);
  assert.equal(lines.code, EXIT_OK);
  const fakeA = recorded.find((engine) => engine.id === "fake-a");
  assert.ok(fakeA?.status === "available");
  assert.equal(
    lines.out,
    `fake-a: available, version ${fakeA.version}, fingerprint ${fakeA.fingerprint}\nno-such-engine: unavailable (not-configured)\n`,
  );
});

test("describe without an engine, with an unknown option or a root that is no directory is a usage error", async (t) => {
  for (const args of [[], ["fake-a", "--verbose"], ["fake-a", "--root", join(tempDir(t), "nowhere")]]) {
    const ended = await describe(args);
    assert.equal(ended.code, EXIT_USAGE, args.join(" "));
    assert.equal(ended.out, "");
  }
});

test("the dashboard asks the engines in a child lvrtc engine describe, once, and judges the baselines by them", async () => {
  const asked = await askEngines(childDescribeRunner(FAKE_ROOT, process.env), ["fake-a", "fake-b"]);
  assert.equal(asked.state, "asked");
  const recorded = readManifest(fixture.runsDir, "fake-pair").engines;
  assert.deepEqual(asked.state === "asked" ? asked.engines : [], recorded);
  const views = createViews(createSources({ rootDir: fixture.rootDir, runsDir: fixture.runsDir }), () => asked);
  assert.deepEqual(
    [0, 1].map((place) => views.baselineRun("fake-pair", place)?.rungs[0].pairs[0].badge),
    ["CURRENT", "CURRENT"],
  );
});

test("a fake engine whose fingerprint moved is STALE(engine), asked through the real child after listening", async (t) => {
  // A root where fake-b has another bias than the fixture's: the same engine with other options, another fingerprint.
  const rootDir = join(tempDir(t), "moved-root");
  mkdirSync(rootDir);
  const definition = (options: Record<string, unknown>) => ({ transport: "in-process", module: FAKE_ENGINE, options });
  const engines = { "fake-a": definition({ id: "fake-a" }), "fake-b": definition({ id: "fake-b", bias: 0.002 }) };
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ engines }));
  // The dashboard's root is the fixture's (its baselines); the engines are asked under the moved root.
  const dashboard = await startDashboard({
    rootDir: fixture.rootDir,
    runsDir: fixture.runsDir,
    port: 0,
    runner: childDescribeRunner(rootDir, process.env),
  });
  t.after(() => dashboard.close());
  // It listens while the child is still asking: the pages judge by the last run until the answer comes.
  assert.equal(dashboard.asked().state, "asking");
  const early = JSON.parse((await fetchFrom(dashboard.port, "/api/baseline/fake-pair")).body);
  assert.deepEqual(early.bases, { engine: "last-run", case: "last-run", policy: "policy-at-hand", asked: "asking" });
  const asked = await dashboard.answered;
  assert.equal(asked.state, "asked");
  const view = JSON.parse((await fetchFrom(dashboard.port, "/api/baseline/fake-pair")).body);
  assert.equal(view.bases.engine, "asked");
  for (const place of [0, 1]) {
    const run = JSON.parse((await fetchFrom(dashboard.port, `/api/baseline/fake-pair/run/${place}`)).body);
    assert.equal(run.rungs[0].pairs[0].badge, "STALE(engine)");
  }
  // The child was asked for every engine of every baseline, fake-far and fake-near among them; it has neither.
  const fakeFar = (asked.state === "asked" ? asked.engines : []).find((engine) => engine.id === "fake-far");
  assert.deepEqual(fakeFar, { id: "fake-far", status: "unavailable", code: "not-configured" });
});

test("closing the dashboard while the engines are being asked ends the child", async () => {
  let aborted = false;
  const dashboard = await startDashboard({
    rootDir: fixture.rootDir,
    runsDir: fixture.runsDir,
    port: 0,
    runner: (_ids, signal) =>
      new Promise((resolve) => {
        signal?.addEventListener("abort", () => {
          aborted = true;
          resolve({ code: null, stdout: "" });
        });
      }),
  });
  assert.equal(dashboard.asked().state, "asking");
  await dashboard.close();
  assert.equal(aborted, true);
  assert.deepEqual(await dashboard.answered, { state: "failed", problem: "the dashboard closed first" });
});

test("an answer of the child that is not one engine per id, in order, is no answer", async () => {
  const one = { id: "a", status: "unavailable", code: "not-configured" };
  assert.deepEqual(parseDescribeOutput("not json", ["a"]), { problem: "its output is not JSON" });
  assert.deepEqual(parseDescribeOutput(JSON.stringify({ engines: [one] }), ["b"]), {
    problem: "its output is not one engine of each id asked, in order",
  });
  assert.deepEqual(parseDescribeOutput(JSON.stringify({ engines: [one] }), ["a"]), { engines: [one] });
  assert.deepEqual(await askEngines(async () => ({ code: 1, stdout: "" }), ["a"]), {
    state: "failed",
    problem: "the child ended with exit code 1",
  });
  assert.deepEqual(await askEngines(async () => Promise.reject(new Error("no")), ["a"]), {
    state: "failed",
    problem: "the child could not be run",
  });
  let called = false;
  assert.deepEqual(
    await askEngines(async () => {
      called = true;
      return { code: 0, stdout: "" };
    }, []),
    { state: "asked", engines: [] },
  );
  assert.equal(called, false, "no child for no engine");
});
