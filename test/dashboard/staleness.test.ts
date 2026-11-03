// The STALE badges of the dashboard: each reason (case, engine, policy) against each basis (engines as asked, as the
// suite's last run recorded them, none), as a pure function and on the fixture's baselines.
import assert from "node:assert/strict";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import type { ManifestEngine, RunManifest } from "../../src/core/manifest.ts";
import { renderBaseline, renderBaselineRun, renderIndex } from "../../src/dashboard/html.ts";
import type { AskedEngines } from "../../src/dashboard/identity.ts";
import { createViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import {
  badgeOf,
  caseBasisOf,
  caseStale,
  engineBasisOf,
  engineStale,
  recordStaleness,
  stalenessBasis,
} from "../../src/dashboard/staleness.ts";
import type { StalenessBasis } from "../../src/dashboard/staleness.ts";
import { DASHBOARD_TEXT } from "../../src/report/wording.ts";
import { tempDir } from "../core/support.ts";
import { buildFixture, visibleText } from "./support.ts";
import type { DashboardFixture } from "./support.ts";

const ENGINE_A = { id: "a", version: "1", fingerprint: "fa", details: {} };
const ENGINE_B = { id: "b", version: "1", fingerprint: "fb", adapterRevision: "rb", details: {} };
const BASELINE: Baseline = {
  contract: "1.0",
  kind: "baseline",
  suite: { name: "s", hash: "h" },
  policy: { version: 1, hash: "p1" },
  engines: [ENGINE_A, ENGINE_B],
  runs: [{ name: "r", caseId: "c1", rungs: [] }],
};
const RUN = BASELINE.runs[0];
const available = (
  engine: typeof ENGINE_A | typeof ENGINE_B,
  fingerprint = engine.fingerprint,
): Extract<ManifestEngine, { status: "available" }> => ({
  ...engine,
  status: "available",
  fingerprint,
});
const basisOf = (over: Partial<StalenessBasis>): StalenessBasis => ({
  policyHash: "p1",
  engines: engineBasisOf("last-run", [available(ENGINE_A), available(ENGINE_B)]),
  cases: caseBasisOf([{ name: "r", caseId: "c1" }]),
  ...over,
});

test("a record is CURRENT where every reason is known and none holds, on either engine basis", () => {
  for (const kind of ["asked", "last-run"] as const) {
    const basis = basisOf({ engines: engineBasisOf(kind, [available(ENGINE_A), available(ENGINE_B)]) });
    assert.deepEqual(recordStaleness(BASELINE, RUN, "a", "b", basis), { stale: [], notKnown: [], badge: "CURRENT" });
  }
});

test("each reason holds alone, and together they are named in the order of STALE_REASONS", () => {
  const caseMoved = basisOf({ cases: caseBasisOf([{ name: "r", caseId: "c2" }]) });
  assert.equal(recordStaleness(BASELINE, RUN, "a", "b", caseMoved).badge, "STALE(case)");
  for (const kind of ["asked", "last-run"] as const) {
    const fingerprint = basisOf({ engines: engineBasisOf(kind, [available(ENGINE_A, "moved"), available(ENGINE_B)]) });
    assert.equal(recordStaleness(BASELINE, RUN, "a", "b", fingerprint).badge, "STALE(engine)");
    const revision = basisOf({
      engines: engineBasisOf(kind, [available(ENGINE_A), { ...available(ENGINE_B), adapterRevision: "moved" }]),
    });
    assert.equal(recordStaleness(BASELINE, RUN, "a", "b", revision).badge, "STALE(engine)");
    const gone = basisOf({
      engines: engineBasisOf(kind, [available(ENGINE_A), { id: "b", status: "unavailable", code: "not-configured" }]),
    });
    assert.equal(recordStaleness(BASELINE, RUN, "a", "b", gone).badge, "STALE(engine)");
  }
  assert.equal(recordStaleness(BASELINE, RUN, "a", "b", basisOf({ policyHash: "p2" })).badge, "STALE(policy)");
  const all = basisOf({
    policyHash: "p2",
    cases: caseBasisOf([{ name: "r", caseId: "c2" }]),
    engines: engineBasisOf("asked", [available(ENGINE_A, "moved"), available(ENGINE_B)]),
  });
  assert.deepEqual(recordStaleness(BASELINE, RUN, "a", "b", all).stale, ["case", "engine", "policy"]);
  assert.equal(recordStaleness(BASELINE, RUN, "a", "b", all).badge, "STALE(case,engine,policy)");
});

test("a reason without a basis is NOT KNOWN, and a stale reason still makes the badge STALE", () => {
  const none = basisOf({ engines: { kind: "none" }, cases: { kind: "none" } });
  assert.deepEqual(recordStaleness(BASELINE, RUN, "a", "b", none), {
    stale: [],
    notKnown: ["case", "engine"],
    badge: "NOT KNOWN(case,engine)",
  });
  // A basis that does not name an engine, or a run, says nothing of it.
  const silent = basisOf({
    engines: engineBasisOf("last-run", [available(ENGINE_A)]),
    cases: caseBasisOf([]),
  });
  assert.equal(recordStaleness(BASELINE, RUN, "a", "b", silent).badge, "NOT KNOWN(case,engine)");
  assert.equal(recordStaleness(BASELINE, RUN, "a", "b", basisOf({ policyHash: null })).badge, "NOT KNOWN(policy)");
  const mixed = basisOf({ policyHash: "p2", engines: { kind: "none" } });
  assert.deepEqual(recordStaleness(BASELINE, RUN, "a", "b", mixed), {
    stale: ["policy"],
    notKnown: ["engine"],
    badge: "STALE(policy)",
  });
  assert.equal(engineStale(ENGINE_A, engineBasisOf("asked", [])), null);
  // An engine the baseline does not list is stale, as checkBaseline judges it; no baseline that parses has one.
  assert.equal(engineStale(undefined, engineBasisOf("asked", [])), true);
  assert.equal(engineStale(undefined, { kind: "none" }), true);
  assert.equal(caseStale(RUN, { kind: "none" }), null);
  assert.equal(badgeOf([], []), "CURRENT");
});

test("the basis: engines as asked first, else as the last run recorded them, else none; cases of the last run", () => {
  const manifest = {
    engines: [available(ENGINE_A)],
    runs: [{ name: "r", caseId: "c1", problems: [] }],
  } as unknown as RunManifest;
  const asked: AskedEngines = { state: "asked", engines: [available(ENGINE_B)] };
  assert.deepEqual(stalenessBasis("p", asked, { state: "ok", value: manifest }).engines, {
    kind: "asked",
    engines: new Map([["b", available(ENGINE_B)]]),
  });
  const fallbacks: AskedEngines[] = [{ state: "not-asked" }, { state: "asking" }, { state: "failed", problem: "x" }];
  for (const fallback of fallbacks) {
    assert.equal(stalenessBasis("p", fallback, { state: "ok", value: manifest }).engines.kind, "last-run");
    assert.equal(stalenessBasis("p", fallback, { state: "missing" }).engines.kind, "none");
    assert.equal(stalenessBasis("p", fallback, { state: "invalid", problem: "x" }).cases.kind, "none");
  }
  assert.equal(stalenessBasis("p", asked, { state: "missing" }).cases.kind, "none");
});

// ── On the fixture's baselines ───────────────────────────────────────────────────────────────────────────────────

let fixture: DashboardFixture;
before(async () => {
  fixture = await buildFixture();
});
after(() => fixture.remove());

function viewsOf(asked: AskedEngines, policyFile?: string) {
  return createViews(createSources({ rootDir: fixture.rootDir, runsDir: fixture.runsDir, policyFile }), () => asked);
}

/** The badge of every record of a baseline, from the page of each of its runs. */
function badgesOf(views: ReturnType<typeof viewsOf>, stem: string): string[] {
  return views.baseline(stem).runs.flatMap(({ place }) => {
    const run = views.baselineRun(stem, place);
    return (run?.rungs ?? []).flatMap((rung) => rung.pairs.map((pair) => `${run?.name} ${pair.badge}`));
  });
}

test("against the suite's last run: current, a case that moved, an engine that moved, a policy that moved", () => {
  const views = viewsOf({ state: "not-asked" });
  const current = views.baseline("fake-pair");
  assert.deepEqual(current.bases, {
    engine: "last-run",
    case: "last-run",
    policy: "policy-at-hand",
    asked: "not-asked",
  });
  assert.deepEqual(badgesOf(views, "fake-pair"), ["singlet CURRENT", "double-gauss CURRENT"]);
  assert.deepEqual(badgesOf(views, "case-moved"), ["singlet STALE(case)", "double-gauss CURRENT"]);
  assert.deepEqual(badgesOf(views, "engine-moved"), ["singlet STALE(engine)", "double-gauss STALE(engine)"]);
  assert.ok(badgesOf(views, "policy-moved").every((badge) => badge.endsWith(" STALE(policy)")));
  assert.equal(views.baseline("policy-moved").policy?.atHand, false);
  // fake-b's fingerprint as the baseline has it, beside the one the last run recorded.
  const engineMoved = views.baseline("engine-moved").engines.find((engine) => engine.id === "fake-b");
  assert.equal(engineMoved?.fingerprint, "f".repeat(64));
  assert.notEqual(engineMoved?.now?.status === "available" ? engineMoved.now.fingerprint : null, "f".repeat(64));
  // The case of each run in the last run, found or not, as the badge judged it.
  const caseMoved = views.baselineRun("case-moved", 0);
  assert.equal(caseMoved?.caseNow?.found, true);
  assert.ok(visibleText(renderBaselineRun(caseMoved!)).includes(DASHBOARD_TEXT.staleness.caseMoved("")));
  assert.ok(
    visibleText(renderBaselineRun(views.baselineRun("case-moved", 1)!)).includes(DASHBOARD_TEXT.staleness.caseSame),
  );
});

test("a run the last run has without a case, and a run it does not have, are told apart", (t) => {
  // A last run whose singlet could not start (no case) and which has no double-gauss.
  const root = join(tempDir(t), "root");
  const runsDir = join(tempDir(t), "runs");
  mkdirSync(join(runsDir, "fake-pair"), { recursive: true });
  cpSync(join(fixture.rootDir, "baselines"), join(root, "baselines"), { recursive: true });
  const manifest: RunManifest = JSON.parse(readFileSync(join(fixture.runsDir, "fake-pair", "manifest.json"), "utf8"));
  const refused = { ...manifest, runs: [{ name: "singlet", caseId: null, problems: ["source: refused"] }], jobs: [] };
  writeFileSync(join(runsDir, "fake-pair", "manifest.json"), JSON.stringify(refused));
  const views = createViews(createSources({ rootDir: root, runsDir }), () => ({ state: "not-asked" }));
  const singlet = views.baselineRun("fake-pair", 0);
  const gauss = views.baselineRun("fake-pair", 1);
  assert.deepEqual(singlet?.caseNow, { found: true, caseId: null });
  assert.deepEqual(gauss?.caseNow, { found: false });
  assert.equal(singlet?.rungs[0].pairs[0].badge, "STALE(case)");
  assert.equal(gauss?.rungs[0].pairs[0].badge, "NOT KNOWN(case)");
  assert.ok(visibleText(renderBaselineRun(singlet!)).includes(DASHBOARD_TEXT.staleness.caseRefused));
  assert.ok(visibleText(renderBaselineRun(gauss!)).includes(DASHBOARD_TEXT.staleness.caseUnknown));
});

test("a suite with no run directory is NOT KNOWN by case and engine, and its page says why", () => {
  const views = viewsOf({ state: "not-asked" });
  const view = views.baseline("orphan");
  assert.deepEqual(view.bases, { engine: "none", case: "none", policy: "policy-at-hand", asked: "not-asked" });
  assert.ok(badgesOf(views, "orphan").every((badge) => badge.endsWith(" NOT KNOWN(case,engine)")));
  assert.deepEqual(view.summary.notKnown, [
    { reason: "case", count: 2 },
    { reason: "engine", count: 2 },
    { reason: "policy", count: 0 },
  ]);
  const text = visibleText(renderBaseline(view));
  assert.ok(text.includes(DASHBOARD_TEXT.staleness.engineNone));
  assert.ok(text.includes(DASHBOARD_TEXT.staleness.caseNone));
  assert.ok(text.includes(DASHBOARD_TEXT.staleness.policy));
});

test("the catalog is a dated snapshot: STALE(policy) like any other where the policy moved, with its note", () => {
  const views = viewsOf({ state: "not-asked" });
  const view = views.baseline("catalog");
  assert.equal(view.snapshot, true);
  assert.equal(views.baseline("fake-pair").snapshot, false);
  const text = visibleText(renderBaseline(view));
  assert.ok(text.includes(DASHBOARD_TEXT.staleness.snapshot(String(view.policy?.version.value))));
  // Judged by another policy, the snapshot's records say so.
  const moved = viewsOf({ state: "not-asked" }, fixture.mtfPolicyFile);
  assert.ok(badgesOf(moved, "catalog").every((badge) => badge.endsWith(" STALE(policy)")));
  assert.equal(moved.baseline("catalog").snapshot, true);
});

test("against the engines as asked: what they say now, whatever the last run recorded", () => {
  const manifest: RunManifest = JSON.parse(readFileSync(join(fixture.runsDir, "fake-pair", "manifest.json"), "utf8"));
  const recorded = manifest.engines;
  const same = viewsOf({ state: "asked", engines: recorded });
  assert.deepEqual(same.baseline("fake-pair").bases, {
    engine: "asked",
    case: "last-run",
    policy: "policy-at-hand",
    asked: "asked",
  });
  assert.deepEqual(badgesOf(same, "fake-pair"), ["singlet CURRENT", "double-gauss CURRENT"]);
  // The orphan's cases are still not known; its engines, now asked, are known.
  assert.ok(badgesOf(same, "orphan").every((badge) => badge.endsWith(" NOT KNOWN(case)")));
  const moved = recorded.map((engine) =>
    engine.id === "fake-a" && engine.status === "available" ? { ...engine, fingerprint: "moved" } : engine,
  );
  const views = viewsOf({ state: "asked", engines: moved });
  assert.deepEqual(badgesOf(views, "fake-pair"), ["singlet STALE(engine)", "double-gauss STALE(engine)"]);
  // An engine the answer leaves out is not known.
  const partial = viewsOf({ state: "asked", engines: recorded.filter((engine) => engine.id !== "fake-b") });
  assert.deepEqual(badgesOf(partial, "fake-pair"), ["singlet NOT KNOWN(engine)", "double-gauss NOT KNOWN(engine)"]);
  assert.ok(visibleText(renderIndex(views.index())).includes(DASHBOARD_TEXT.staleness.asked));
  assert.ok(visibleText(renderBaseline(views.baseline("fake-pair"))).includes(DASHBOARD_TEXT.staleness.engineAsked));
});

test("while the engines are being asked, every page says so and judges by the last run", () => {
  const views = viewsOf({ state: "asking" });
  assert.equal(views.baseline("fake-pair").bases?.engine, "last-run");
  assert.ok(visibleText(renderIndex(views.index())).includes(DASHBOARD_TEXT.staleness.asking));
  const text = (stem: string) => visibleText(renderBaseline(views.baseline(stem)));
  assert.ok(text("fake-pair").includes(DASHBOARD_TEXT.staleness.engineAskingLastRun));
  assert.ok(text("orphan").includes(DASHBOARD_TEXT.staleness.engineAskingNone));
});

test("engines that could not be asked: the index says so, and nothing promises a last run that is not there", () => {
  const views = viewsOf({ state: "failed", problem: "the child ended with exit code 1" });
  assert.equal(views.baseline("fake-pair").bases?.engine, "last-run");
  const index = visibleText(renderIndex(views.index()));
  assert.ok(index.includes(DASHBOARD_TEXT.staleness.askFailed("the child ended with exit code 1")));
  assert.ok(!index.includes(DASHBOARD_TEXT.staleness.notAsked));
  const text = (stem: string) => visibleText(renderBaseline(views.baseline(stem)));
  assert.ok(text("fake-pair").includes(DASHBOARD_TEXT.staleness.engineFailedLastRun));
  assert.ok(text("orphan").includes(DASHBOARD_TEXT.staleness.engineFailedNone));
  assert.ok(!text("orphan").includes(DASHBOARD_TEXT.staleness.engineNone));
  const notAsked = viewsOf({ state: "not-asked" });
  assert.ok(visibleText(renderIndex(notAsked.index())).includes(DASHBOARD_TEXT.staleness.notAsked));
});

test("the summary of a baseline on the index is that of its page", () => {
  const views = viewsOf({ state: "not-asked" });
  const index = views.index();
  for (const summary of index.baselines) {
    const page = views.baseline(summary.stem);
    assert.equal(summary.records, page.summary.records, summary.stem);
    assert.deepEqual(summary.badges, page.summary.badges, summary.stem);
    assert.deepEqual(summary.bases, page.bases, summary.stem);
  }
  const broken = index.baselines.find((summary) => summary.stem === "broken");
  assert.equal(broken?.problems.length, 1);
  assert.match(broken?.problems[0].problem ?? "", /not a valid baseline/);
});

test("a baseline whose pair names an engine it does not list never reaches a page: parseBaseline refuses it", () => {
  const text = readFileSync(join(fixture.rootDir, "baselines", "fake-pair.json"), "utf8");
  const baseline = JSON.parse(text);
  baseline.engines = baseline.engines.filter((engine: { id: string }) => engine.id !== "fake-b");
  const parsed = parseBaseline(baselineText(baseline));
  assert.ok("problems" in parsed);
  assert.ok(parsed.problems.some((problem) => /fake-b, which is no engine of the baseline/.test(problem)));
});
