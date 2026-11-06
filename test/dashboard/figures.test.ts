// The verification of Stage 8.1: every view-model number equals the result JSON. Every view model of every page of
// the fixtures is walked: each number is inside a Figure, a Curve or a Derived, or is a count under a key of
// `COUNT_KEYS`; each Figure's and Curve's value is `Object.is` the value its pointer resolves to in the file the test
// reads from disk itself; each Derived is recomputed from the figures it names; and each count equals the test's own
// recount from the documents. A Figure must also be the right one: its pointer is checked against the place of the
// view that holds it (the set, pair, metric, participant, element, run and rung that place is of), and every cell is
// set against the independent path (`buildReport`, `buildBaselineReport`, `buildMtfBaselineReport`) that puts a
// value in the same cell, so that a view that leaves out a row, a column or a metric fails too.
//
// The charts of Stage 8.2 are held the same way: an MTF curve is a Curve the test decodes from the store entry itself
// (a value that is not a finite number is null there: a gap), each held to the job, field and cut of its chart; a
// difference and a per-surface maximum are Derived numbers the test recomputes by its own loop from the arrays they
// name; a heat map's cells are recounted from the comparisons or the baseline.
//
// The lens pages of Stage 8.4 are held the same way: each run of a lens is the test's own reading of the case files,
// its condition's figures are of its own case file (and its manifest's recipe), each curve is a Curve of the store
// entry of its job at its field and cut, the curves are the test's own enumeration of the choice, and each
// difference is sorted (within the reference's request, apart, or left out) by the test's own restatement of the rule
// before it is recomputed.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

import { buildMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { controlChoices } from "../../src/cli/commands/serve.ts";
import { buildBaselineReport } from "../../src/baseline/report.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { OFF_AXIS_METRIC, ON_AXIS_METRIC } from "../../src/compare/mtfNative.ts";
import { POLICY_FILE } from "../../src/compare/policyFile.ts";
import type { Baseline, BaselinePair } from "../../src/contract/baseline.ts";
import { VERDICTS } from "../../src/contract/comparison.ts";
import type { Verdict } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { loadConfig } from "../../src/core/config.ts";
import type { ManifestEngine, ManifestJob, RunManifest } from "../../src/core/manifest.ts";
import { DASHBOARD_TEXT } from "../../src/report/wording.ts";
import type { StoreEntry } from "../../src/core/resultStore.ts";
import { encodeF8 } from "../../src/core/numeric/ndarray.ts";
import { decodeNdArray, isNdArray } from "../../src/core/numeric/ndarray.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { COUNT_KEYS, figureAt, pointerOf, pointerTokens, resolvePointer } from "../../src/dashboard/figure.ts";
import type { DocumentName, Figure, Source } from "../../src/dashboard/figure.ts";
import type { ControlView, JobView } from "../../src/dashboard/control.ts";
import type { AskedEngines } from "../../src/dashboard/identity.ts";
import { createViews, startDashboard } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import type {
  BaselineRunView,
  BaselineView,
  MetricView,
  MtfView,
  RunPartView,
  RunView,
  SectionView,
} from "../../src/dashboard/views.ts";
import { buildReport } from "../../src/report/model.ts";
import { MAX_LENS_CURVES } from "../../src/dashboard/lens.ts";
import { COMPARE_TABS } from "../../src/dashboard/compare.ts";
import type { CompareView, GatedLine } from "../../src/dashboard/compare.ts";
import type { LensView } from "../../src/dashboard/lens.ts";
import { LENS_KEY, lensGoldenQuery } from "./lensFixture.ts";
import type { MtfComparison } from "../../src/report/mtfComparison.ts";
import { FAKE_PAIR_SUITE, FAKE_ROOT, tempDir } from "../core/support.ts";
import { buildFixture, documentFromDisk, fetchFrom, valueAtPointer, walkView } from "./support.ts";
import type { DashboardFixture, DocumentPlaces } from "./support.ts";

let fixture: DashboardFixture;
before(async () => {
  fixture = await buildFixture();
});
after(() => fixture.remove());

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

/** The test's own reading of a run directory: its manifest and its comparisons, when they are JSON. */
function runDocuments(places: DocumentPlaces, name: string) {
  const comparisons = readJson<ComparisonFile>(join(places.runsDir, name, "comparisons.json"));
  return {
    manifest: readJson<RunManifest>(join(places.runsDir, name, "manifest.json")),
    comparisons: comparisons !== null && Array.isArray(comparisons.comparisons) ? comparisons : null,
  };
}

/** The sections of a comparison file, recounted: consecutive sets of one run, rung and request, each mode once. */
function groupsOf(file: ComparisonFile): number[][] {
  const groups: number[][] = [];
  file.comparisons.forEach((set, index) => {
    const last = groups[groups.length - 1];
    const head = last === undefined ? undefined : file.comparisons[last[0]];
    if (
      head !== undefined &&
      head.run === set.run &&
      head.rung === set.rung &&
      head.requestId === set.requestId &&
      last.every((other) => file.comparisons[other].mode !== set.mode)
    ) {
      last.push(index);
    } else groups.push([index]);
  });
  return groups;
}

const GRAVITY: readonly Verdict[] = [
  "PASS",
  "RECORDED",
  "FLOOR",
  "UNSUPPORTED",
  "ATTENTION",
  "BLOCKED",
  "FAIL",
  "ERROR",
];
function gravest(verdicts: readonly Verdict[]): Verdict | null {
  return verdicts.reduce<Verdict | null>(
    (worst, each) => (worst === null || GRAVITY.indexOf(each) > GRAVITY.indexOf(worst) ? each : worst),
    null,
  );
}

type Held = "stale" | "same" | "unknown";

/** What holds of each reason of a record, recounted from the documents by the rules of the design. */
function reasonsOf(
  baseline: Baseline,
  run: { name: string; caseId: string | null },
  pair: { a: string; b: string },
  lastRun: RunManifest | null,
  asked: readonly ManifestEngine[] | null,
  policyHash: string,
): Record<"case" | "engine" | "policy", Held> {
  const now = lastRun?.runs.find((each) => each.name === run.name);
  const engines = asked ?? lastRun?.engines ?? null;
  const states = [pair.a, pair.b].map((id): Held => {
    const was = baseline.engines.find((engine) => engine.id === id);
    const is = engines?.find((engine) => engine.id === id);
    if (was === undefined) return "stale";
    if (engines === null || is === undefined) return "unknown";
    if (is.status !== "available") return "stale";
    return is.fingerprint === was.fingerprint && is.adapterRevision === was.adapterRevision ? "same" : "stale";
  });
  return {
    case: now === undefined ? "unknown" : now.caseId === run.caseId ? "same" : "stale",
    engine: states.includes("stale") ? "stale" : states.includes("unknown") ? "unknown" : "same",
    policy: baseline.policy.hash === policyHash ? "same" : "stale",
  };
}

/** A record's badge from what holds of its reasons. */
function badgeOf(held: Record<"case" | "engine" | "policy", Held>): string {
  const reasons = (["case", "engine", "policy"] as const).filter((reason) => held[reason] === "stale");
  const unknown = (["case", "engine", "policy"] as const).filter((reason) => held[reason] === "unknown");
  if (reasons.length > 0) return `STALE(${reasons.join(",")})`;
  return unknown.length === 0 ? "CURRENT" : `NOT KNOWN(${unknown.join(",")})`;
}

/** Every record of a baseline: a pair of one rung of one run. */
function recordsOf(baseline: Baseline | null): { run: Baseline["runs"][number]; pair: BaselinePair }[] {
  if (baseline === null) return [];
  return baseline.runs.flatMap((run) => run.rungs.flatMap((rung) => rung.pairs.map((pair) => ({ run, pair }))));
}

/** Counts by value, in the order given, else sorted. */
function tally(values: readonly string[], order?: readonly string[]): [string, number][] {
  const keys = order ?? [...new Set(values)].sort();
  return keys.map((key) => [key, values.filter((each) => each === key).length]);
}

/** A baseline and what it is judged with, read by the test. */
function baselineDocuments(places: DocumentPlaces, stem: string) {
  const baseline = readJson<Baseline>(join(places.rootDir, "baselines", `${stem}.json`));
  const valid = baseline !== null && Array.isArray(baseline.runs) ? baseline : null;
  const manifestFile = valid === null ? null : join(places.runsDir, valid.suite.name, "manifest.json");
  const lastRun = manifestFile !== null && existsSync(manifestFile) ? readJson<RunManifest>(manifestFile) : null;
  const policyHash = hashCanonical(JSON.parse(readFileSync(places.policyFile, "utf8")));
  return { baseline: valid, lastRun, policyHash };
}

// ── Recounts ─────────────────────────────────────────────────────────────────────────────────────────────────────

function indexCounts(
  places: DocumentPlaces,
  runNames: readonly string[],
  stems: readonly string[],
  asked: readonly ManifestEngine[] | null,
): Map<string, number> {
  const expected = new Map<string, number>();
  runNames.forEach((name, i) => {
    const { manifest, comparisons } = runDocuments(places, name);
    if (manifest === null) return void expected.set(`/runs/${i}/failing`, 0);
    tally(
      manifest.jobs.map((job) => job.status),
      ["ok", "unsupported", "error", "pending"],
    ).forEach(([, n], k) => expected.set(`/runs/${i}/jobs/${k}/count`, n));
    const verdicts = (comparisons?.comparisons ?? []).flatMap((set) => set.pairs.map((pair) => pair.verdict));
    if (comparisons !== null) {
      tally(verdicts, VERDICTS).forEach(([, n], k) => expected.set(`/runs/${i}/verdicts/${k}/count`, n));
    }
    expected.set(`/runs/${i}/failing`, verdicts.filter((verdict) => verdict === "FAIL" || verdict === "ERROR").length);
  });
  stems.forEach((stem, j) => {
    const { baseline, lastRun, policyHash } = baselineDocuments(places, stem);
    const records = recordsOf(baseline);
    expected.set(`/baselines/${j}/records`, records.length);
    if (baseline === null) return;
    const present = VERDICTS.filter((verdict) => records.some(({ pair }) => pair.verdict === verdict));
    tally(
      records.map(({ pair }) => pair.verdict),
      present,
    ).forEach(([, n], k) => expected.set(`/baselines/${j}/verdicts/${k}/count`, n));
    tally(records.map(({ run, pair }) => badgeOf(reasonsOf(baseline, run, pair, lastRun, asked, policyHash)))).forEach(
      ([, n], k) => expected.set(`/baselines/${j}/badges/${k}/count`, n),
    );
  });
  [...lensRunsOf(places, runNames)].forEach(([, runs], l) => expected.set(`/lenses/${l}/runCount`, runs.length));
  return expected;
}

/** A run of a lens, as the test reads it: its run directory, its place there, its name and case. */
interface TestLensRun {
  readonly suite: string;
  readonly place: number;
  readonly run: string;
  readonly caseId: string;
  readonly manifest: RunManifest;
}

/** The lenses of the run directories, read by the test: every run whose case file's label names a lens, keys sorted. */
function lensRunsOf(places: DocumentPlaces, runNames: readonly string[]): Map<string, TestLensRun[]> {
  const lenses = new Map<string, TestLensRun[]>();
  for (const suite of runNames) {
    const { manifest } = runDocuments(places, suite);
    manifest?.runs.forEach((run, place) => {
      if (run.caseId === null) return;
      const file = readJson<{ label?: { lensKey?: string } }>(
        join(places.runsDir, suite, "cases", `${run.caseId}.json`),
      );
      const key = file?.label?.lensKey;
      if (key === undefined) return;
      lenses.set(key, [...(lenses.get(key) ?? []), { suite, place, run: run.name, caseId: run.caseId, manifest }]);
    });
  }
  return new Map([...lenses].sort(([a], [b]) => (a < b ? -1 : 1)));
}

function runCounts(places: DocumentPlaces, name: string, split: boolean): Map<string, number> {
  const expected = new Map<string, number>();
  const { manifest, comparisons } = runDocuments(places, name);
  if (manifest === null) return expected.set("/failing", 0);
  const rungs = [...new Set(manifest.jobs.map((job) => job.rung))];
  rungs.forEach((rung, g) => {
    const requests = [
      ...new Set(
        manifest.jobs.filter((job) => job.rung === rung).map((job) => JSON.stringify([job.run, job.requestId])),
      ),
    ];
    manifest.engines.forEach((engine, e) => {
      const statuses = requests.map((key) => {
        const [run, requestId] = JSON.parse(key) as [string, string];
        const job = manifest.jobs.find(
          (each) => each.run === run && each.rung === rung && each.requestId === requestId && each.engine === engine.id,
        );
        return job === undefined ? "not-run" : job.status;
      });
      tally(statuses, ["ok", "unsupported", "error", "pending", "not-run"]).forEach(([, n], k) =>
        expected.set(`/supportByRung/${g}/engines/${e}/counts/${k}/count`, n),
      );
    });
  });
  const groups = comparisons === null ? [] : groupsOf(comparisons);
  manifest.runs.forEach((run, k) => {
    expected.set(`/runs/${k}/place`, k);
    const requests = new Set(
      manifest.jobs.filter((job) => job.run === run.name).map((job) => JSON.stringify([job.rung, job.requestId])),
    );
    expected.set(`/runs/${k}/requests`, requests.size);
    const sections = groups.filter((group) => comparisons?.comparisons[group[0]].run === run.name);
    expected.set(`/runs/${k}/sectionCount`, sections.length);
  });
  let failing = 0;
  if (comparisons !== null) {
    ["reference-vs-each", "pairwise"].forEach((mode, m) => {
      const verdicts = comparisons.comparisons
        .filter((set) => set.mode === mode)
        .flatMap((set) => set.pairs.map((pair) => pair.verdict));
      tally(verdicts, VERDICTS).forEach(([, n], k) => expected.set(`/summary/${m}/counts/${k}/count`, n));
      failing += verdicts.filter((verdict) => verdict === "FAIL" || verdict === "ERROR").length;
    });
    if (!split) groups.forEach((_group, s) => expected.set(`/sections/${s}/section`, s));
    if (comparisons.comparisons.length > 0) {
      const rungs = [...new Set(comparisons.comparisons.map((set) => set.rung))];
      heatMapCounts(
        expected,
        manifest.runs.map((run) => run.name),
        rungs,
        (run, rung) =>
          comparisons.comparisons
            .filter((set) => set.run === run && set.rung === rung)
            .flatMap((set) => set.pairs.map((pair) => pair.verdict)),
      );
    }
  }
  expected.set("/failing", failing);
  return expected;
}

/** The most rows a heat map draws, as the design sets it. */
const HEAT_MAP_ROWS = 150;

/** A heat map's counts, recounted: each cell's pairs by verdict, each verdict it has; or how many rows were left out. */
function heatMapCounts(
  expected: Map<string, number>,
  runs: readonly string[],
  rungs: readonly string[],
  verdictsOf: (run: string, rung: string) => Verdict[],
): void {
  if (runs.length > HEAT_MAP_ROWS) return void expected.set("/heatMap/omitted/count", runs.length);
  runs.forEach((run, r) =>
    rungs.forEach((rung, g) => {
      const verdicts = verdictsOf(run, rung);
      const present = VERDICTS.filter((verdict) => verdicts.includes(verdict));
      tally(verdicts, present).forEach(([, n], k) =>
        expected.set(`/heatMap/rows/${r}/cells/${g}/counts/${k}/count`, n),
      );
    }),
  );
}

function runPartCounts(places: DocumentPlaces, name: string, place: number): Map<string, number> {
  const expected = new Map<string, number>([["/place", place]]);
  const { manifest, comparisons } = runDocuments(places, name);
  const run = manifest?.runs[place]?.name;
  if (comparisons === null) return expected;
  groupsOf(comparisons)
    .map((group, section) => ({ group, section }))
    .filter(({ group }) => comparisons.comparisons[group[0]].run === run)
    .forEach(({ section }, s) => expected.set(`/sections/${s}/section`, section));
  return expected;
}

function sectionCounts(places: DocumentPlaces, name: string, index: number, view: SectionView): Map<string, number> {
  const expected = new Map<string, number>([["/section", index]]);
  const { comparisons } = runDocuments(places, name);
  const first = comparisons?.comparisons[groupsOf(comparisons)[index][0]];
  const recorded = first?.participants.map((participant) => participant.recorded ?? {}) ?? [];
  const names = [...new Set(recorded.flatMap((values) => Object.keys(values)))].sort();
  let row = 0;
  for (const value of names) {
    const length = Math.max(...recorded.map((values) => values[value]?.length ?? 0));
    for (let element = 0; element < length; element++) expected.set(`/recorded/rows/${row++}/element`, element);
  }
  // An MTF table's elements: each field's place in the recorded lists, the rows of a field after it.
  const mtfElements = (mtf: MtfView, at: string): void => {
    mtf.fields.forEach((_field, element) => expected.set(`${at}/fields/${element}/element`, element));
    const perField = mtf.fields.length === 0 ? 0 : mtf.rows.length / mtf.fields.length;
    mtf.rows.forEach((_row, r) => expected.set(`${at}/rows/${r}/element`, Math.floor(r / perField)));
    mtf.peers.forEach((peer, p) => mtfElements(peer, `${at}/peers/${p}`));
  };
  if (view.mtf !== null) mtfElements(view.mtf, "/mtf");
  for (const [path, value] of chartCounts(places, name, index)) expected.set(path, value);
  return expected;
}

/** The store entry of a key, read by the test from disk; null where the store has none. */
function storeEntryOf(places: DocumentPlaces, key: string | null): StoreEntry | null {
  if (key === null) return null;
  const there = ["json.gz", "json"].some((extension) =>
    existsSync(join(places.runsDir, "store", `${key}.${extension}`)),
  );
  return there ? (documentFromDisk(places, `store:${key}`) as StoreEntry) : null;
}

/** The jobs of a section's request, read by the test: by engine, each engine's first answer before its steps. */
function jobsOfSection(places: DocumentPlaces, name: string, index: number) {
  const { manifest, comparisons } = runDocuments(places, name);
  assert.ok(manifest !== null && comparisons !== null);
  const group = groupsOf(comparisons)[index];
  const head = comparisons.comparisons[group[0]];
  const jobs = manifest.jobs.filter(
    (job) => job.run === head.run && job.rung === head.rung && job.requestId === head.requestId,
  );
  const engines = [...new Set(jobs.map((job) => job.engine))].sort();
  const pairs: { a: string; b: string; set: number; pair: number; verdict: Verdict }[] = [];
  for (const set of group) {
    comparisons.comparisons[set].pairs.forEach(({ a, b, verdict }, pair) => {
      if (!pairs.some((each) => [each.a, each.b].sort().join() === [a, b].sort().join()))
        pairs.push({ a, b, set, pair, verdict });
    });
  }
  return {
    head,
    comparisons,
    pairs,
    jobs: engines.flatMap((engine) => jobs.filter((job) => job.engine === engine)),
  };
}

/** The counts of a section's charts, recounted: each chart's field element and each bar's surface. */
function chartCounts(places: DocumentPlaces, name: string, index: number): Map<string, number> {
  const expected = new Map<string, number>();
  const { head, jobs, pairs } = jobsOfSection(places, name, index);
  if (head.quantity === "mtf.native") {
    const fields = Math.max(
      0,
      ...jobs.map((job) => {
        const entry = storeEntryOf(places, job.storeKey);
        return entry?.result.status === "ok" ? (entry.result.data as { fields: unknown[] }).fields.length : 0;
      }),
    );
    for (let field = 0; field < fields; field++) {
      ["sagittal", "tangential"].forEach((_cut, c) => {
        expected.set(`/charts/overlays/${field * 2 + c}/element`, field);
        expected.set(`/charts/differences/${field * 2 + c}/element`, field);
      });
    }
  }
  if (head.quantity === "rays.trace" && head.rung === "r2") {
    pairs.forEach(({ a, b }, d) => {
      const [one, two] = [a, b].map((engine) =>
        storeEntryOf(places, jobs.find((job) => job.engine === engine && job.step === undefined)?.storeKey ?? null),
      );
      if (one?.result.status !== "ok" || two?.result.status !== "ok") return;
      const surfaces = decoded((one.result.data as { hits: unknown }).hits).shape[0];
      for (let surface = 0; surface < surfaces; surface++) {
        expected.set(`/charts/deviations/${d}/bars/${surface}/surface`, surface);
      }
    });
  }
  return expected;
}

function baselineCounts(
  places: DocumentPlaces,
  stem: string,
  asked: readonly ManifestEngine[] | null,
): Map<string, number> {
  const expected = new Map<string, number>();
  const { baseline, lastRun, policyHash } = baselineDocuments(places, stem);
  const records = recordsOf(baseline);
  expected.set("/summary/records", records.length);
  if (baseline === null) return expected;
  const heldOf = (run: Baseline["runs"][number], pair: BaselinePair) =>
    reasonsOf(baseline, run, pair, lastRun, asked, policyHash);
  const held = records.map(({ run, pair }) => heldOf(run, pair));
  tally(held.map(badgeOf)).forEach(([, n], k) => expected.set(`/summary/badges/${k}/count`, n));
  (["case", "engine", "policy"] as const).forEach((reason, k) => {
    expected.set(`/summary/stale/${k}/count`, held.filter((each) => each[reason] === "stale").length);
    expected.set(`/summary/notKnown/${k}/count`, held.filter((each) => each[reason] === "unknown").length);
  });
  baseline.runs.forEach((run, r) => {
    expected.set(`/runs/${r}/place`, r);
    const pairs = run.rungs.flatMap((rung) => rung.pairs);
    expected.set(`/runs/${r}/records`, pairs.length);
    tally(pairs.map((pair) => badgeOf(heldOf(run, pair)))).forEach(([, n], k) =>
      expected.set(`/runs/${r}/badges/${k}/count`, n),
    );
  });
  heatMapCounts(
    expected,
    baseline.runs.map((run) => run.name),
    [...new Set(baseline.runs.flatMap((run) => run.rungs.map((rung) => rung.rung)))],
    (run, rung) =>
      baseline.runs
        .filter((each) => each.name === run)
        .flatMap((each) =>
          each.rungs.filter((one) => one.rung === rung).flatMap((one) => one.pairs.map((pair) => pair.verdict)),
        ),
  );
  return expected;
}

// ── Figures, curves and derived numbers against the files ────────────────────────────────────────────────────────

/** An encoded array of a store entry, decoded by the test with the contract's codec: its values and its shape. */
function decoded(value: unknown): { values: number[]; shape: readonly number[] } {
  assert.ok(isNdArray(value), "an encoded array");
  const array = decodeNdArray(value);
  return { values: Array.from(array.values as ArrayLike<number>), shape: array.shape };
}

/**
 * The largest distance between two answers' hits on one surface, by the test's own loop: over the rays whose status
 * is 0 (ok) in both, leaving out a visit either marks unrecorded; null where no ray is left.
 */
function largestHitDistance(surface: number, of: readonly Source[], values: readonly unknown[]): number | null {
  const documents = [...new Set(of.map((source) => source.document))];
  assert.equal(documents.length, 2, "the arrays of two answers");
  const arrays = documents.map((document) => {
    const member = (name: string) => {
      const at = of.findIndex((source) => source.document === document && source.pointer === `/result/data/${name}`);
      return at < 0 ? null : decoded(values[at]);
    };
    const hits = member("hits");
    const status = member("status");
    assert.ok(hits !== null && status !== null, "hits and status of each answer");
    return { hits, status, unrecorded: member("unrecordedHits") };
  });
  const [a, b] = arrays;
  const rays = a.status.values.length;
  let largest: number | null = null;
  for (let ray = 0; ray < rays; ray++) {
    if (a.status.values[ray] !== 0 || b.status.values[ray] !== 0) continue;
    const visit = surface * rays + ray;
    if (a.unrecorded?.values[visit] === 1 || b.unrecorded?.values[visit] === 1) continue;
    let squares = 0;
    for (let axis = 0; axis < 3; axis++) {
      const d = a.hits.values[visit * 3 + axis] - b.hits.values[visit * 3 + axis];
      squares += d * d;
    }
    const distance = Math.sqrt(squares);
    if (largest === null || distance > largest) largest = distance;
  }
  return largest;
}

/** Recomputes a derived number from the sources it names and the values the test read at them. */
function recompute(derivation: string, of: readonly Source[], read: readonly unknown[]): number | null {
  const difference = /^(.+) minus (.+) at element (\d+) of both curves$/.exec(derivation);
  if (difference !== null) {
    const element = Number(difference[3]);
    const [a, b] = read.map((value) => decoded(value).values[element]);
    assert.ok(Number.isFinite(a) && Number.isFinite(b), "a difference only of two finite values");
    return a - b;
  }
  const surface =
    /^the largest distance between the hits of .+ on (?:surface|visit) (\d+), over the rays ok in both answers/.exec(
      derivation,
    );
  if (surface !== null) return largestHitDistance(Number(surface[1]), of, read);
  const values = read as readonly (number | null)[];
  const numbers = values.filter((value): value is number => value !== null);
  if (derivation === "the first judged column minus the second") return values[0]! - values[1]!;
  if (/^.+'s .+ minus .+'s$/.test(derivation)) return values[0]! - values[1]!;
  if (derivation.startsWith("the distance between")) return Math.abs(values[0]! - values[1]!);
  if (derivation.startsWith("the larger") || derivation.startsWith("the largest")) return Math.max(...numbers);
  throw new Error(`a derivation the test does not know: ${derivation}`);
}

/**
 * What a figure is a figure of, held to where it sits in the view: the member its pointer ends at (the last token
 * that is not an index, without a step's `#<step>`) must be the one its key in the view names.
 */
function holdMeaning(view: unknown, path: string, pointer: string, what: string): void {
  const tokens = path.slice(1).split("/");
  const key = tokens[tokens.length - 1];
  const parentAt = (depth: number): Record<string, unknown> =>
    tokens
      .slice(0, tokens.length - depth)
      .reduce<unknown>((at, token) => (at as Record<string, unknown>)[token], view) as Record<string, unknown>;
  const raw = (
    pointer
      .split("/")
      .slice(1)
      .reverse()
      .find((token) => !/^\d+$/.test(token)) ?? ""
  )
    .replace(/~1/g, "/")
    .replace(/~0/g, "~");
  let member = raw.replace(/#.*$/, "");
  const allowed: Record<string, readonly string[]> = {
    tolerance: ["tolerance"],
    measured: ["measured"],
    version: ["version"],
    requests: ["requests", "count"],
    floorLimit: ["limit"],
    limit: ["tolerance", "attention"],
    onAxis: ["attention"],
    offAxis: ["attention"],
    chiefLandingMm: ["attention"],
    band: ["attention"],
    field: ["field"],
    fieldAngleDeg: ["fieldAngleDeg"],
    across: ["gridSize", "numRays"],
    lastChange: ["maxDelta"],
    policyVersion: ["version"],
    frequency: ["frequenciesPerMm"],
    gate: ["tolerance"],
    maxDistance: ["value"],
    zoomT: ["zoomT"],
    focusT: ["focusT"],
    stopSemiDiameterMm: ["stopSemiDiameter"],
    imageZ: ["imageZ"],
    z: ["z"],
    shiftMm: ["shiftMm"],
    wavelengthNm: ["wavelengthNm"],
    weight: ["weight"],
  };
  let expected: readonly string[];
  if (/^\d+$/.test(key)) {
    const owner = parentAt(2);
    if (Object.hasOwn(owner, "cut")) expected = [`${String(owner.cut)}@${String(owner.frequency)}`];
    else {
      expected = [String(owner.name)];
      member = raw;
    }
  } else if (key === "value") {
    const parent = parentAt(1);
    expected = Object.hasOwn(parent, "key") ? [String(parent.key)] : ["value"];
  } else expected = allowed[key] ?? [];
  assert.ok(
    expected.includes(member),
    `${what} ${path}: a figure of ${member}, where ${expected.join(" or ")} is shown`,
  );
}

/** Holds one view to its documents: figures, curves, derived numbers and counts. Returns how many figures. */
function holdView(places: DocumentPlaces, view: unknown, expectedCounts: Map<string, number>, what: string): number {
  const walked = walkView(view);
  assert.deepEqual(walked.strays, [], `${what}: every number is a figure, a derived number or a count`);
  const documents = new Map<DocumentName, unknown>();
  const read = (document: DocumentName): unknown => {
    if (!documents.has(document)) documents.set(document, documentFromDisk(places, document));
    return documents.get(document);
  };
  for (const { path, figure } of walked.figures) {
    const found = valueAtPointer(read(figure.source.document), figure.source.pointer);
    assert.ok(found.found, `${what} ${path}: ${figure.source.document} has ${figure.source.pointer}`);
    assert.ok(
      Object.is(found.value, figure.value),
      `${what} ${path}: ${String(figure.value)} is ${String(found.value)}`,
    );
    holdMeaning(view, path, figure.source.pointer, what);
  }
  for (const { path, curve } of walked.curves) {
    const found = valueAtPointer(read(curve.source.document), curve.source.pointer);
    assert.ok(found.found, `${what} ${path}: ${curve.source.document} has ${curve.source.pointer}`);
    // A list in the JSON, or an encoded ndarray of a store entry, decoded by the contract's codec.
    const values = isNdArray(found.value)
      ? Array.from(decodeNdArray(found.value).values as ArrayLike<number>)
      : (found.value as unknown[]);
    assert.equal(values.length, curve.values.length, `${what} ${path}: every value of the curve`);
    // A value that is not a finite number is null in the curve: the contract writes it so, and a chart draws a gap.
    values.forEach((value, index) =>
      assert.ok(
        typeof value === "number" && !Number.isFinite(value)
          ? curve.values[index] === null
          : Object.is(value, curve.values[index]),
        `${what} ${path}/${index}`,
      ),
    );
  }
  for (const { path, derived } of walked.derived) {
    const values = derived.of.map((source) => {
      const found = valueAtPointer(read(source.document), source.pointer);
      assert.ok(found.found, `${what} ${path}: ${source.document} has ${source.pointer}`);
      return found.value;
    });
    assert.ok(
      Object.is(recompute(derived.derivation, derived.of, values), derived.value),
      `${what} ${path}: ${derived.derivation}`,
    );
  }
  const sorted = (map: Map<string, number>): [string, number][] => [...map].sort(([a], [b]) => (a < b ? -1 : 1));
  assert.deepEqual(sorted(walked.counts), sorted(expectedCounts), `${what}: every count, recounted`);
  return walked.figures.length;
}

// ── Positions and the independent paths ──────────────────────────────────────────────────────────────────────────

/** The tokens of a pointer, read by the test: indices as numbers. */
function tokensOf(figure: Figure): (string | number)[] {
  return figure.source.pointer
    .slice(1)
    .split("/")
    .map((token) => token.replace(/~1/g, "/").replace(/~0/g, "~"))
    .map((token) => (/^\d+$/.test(token) ? Number(token) : token));
}

/** Holds a section's figures to the places of the view that hold them, and to the report model's same cells. */
function holdSection(places: DocumentPlaces, name: string, view: SectionView, policy: Policy): void {
  const { manifest, comparisons } = runDocuments(places, name);
  assert.ok(manifest !== null && comparisons !== null);
  const group = groupsOf(comparisons)[view.section];
  const section = buildReport(manifest, comparisons, policy).sections[view.section];
  const what = `section ${view.section} of ${name}`;
  const ofThisSection = (setIndex: number): void => {
    assert.ok(group.includes(setIndex), `${what}: set ${setIndex} is of the section`);
    const set = comparisons.comparisons[setIndex];
    assert.deepEqual([set.run, set.rung, set.requestId], [view.run, view.rung, view.requestId], what);
  };
  const metricAt = (metric: MetricView, mode: string, a: string, b: string, at: string): void => {
    const [, setIndex, , pairIndex, , metricIndex, member] = tokensOf(metric.value) as [
      string,
      number,
      string,
      number,
      string,
      number,
      string,
    ];
    ofThisSection(setIndex);
    const set = comparisons.comparisons[setIndex];
    assert.equal(set.mode, mode, `${what} ${at}: a set of the mode`);
    const pair = set.pairs[pairIndex];
    assert.deepEqual([pair.a, pair.b].sort(), [a, b].sort(), `${what} ${at}: the pair of the cell`);
    if (mode === "reference-vs-each") assert.equal(pair.a, a, `${what} ${at}: the reference first`);
    assert.equal(pair.metrics[metricIndex].name, metric.name, `${what} ${at}: the metric of the cell`);
    assert.equal(member, "value");
    for (const where of metric.where) {
      if (typeof where.value === "string") continue;
      assert.deepEqual(tokensOf(where.value).slice(0, 7), [...tokensOf(metric.value).slice(0, 6), "where"]);
      assert.equal(tokensOf(where.value)[7], where.key, `${what} ${at}: where ${where.key}`);
    }
  };

  assert.deepEqual(
    view.columns.map((column) => column.name),
    section.columns.map((column) => column.name),
    `${what}: every column`,
  );
  view.columns.forEach((column, c) => {
    const limit = section.columns[c].limit;
    assert.ok(Object.is(column.limit?.value ?? undefined, limit ?? undefined), `${what}: the limit of ${column.name}`);
    if (column.limit !== null && !("derivation" in column.limit)) {
      assert.deepEqual(tokensOf(column.limit).slice(0, 4), ["rungs", view.rung, "metrics", column.name], what);
    }
    assert.ok(Object.is(column.floorLimit?.value ?? undefined, section.columns[c].floorLimit), what);
  });

  assert.equal(view.referenceVsEach === null, section.referenceVsEach === null, `${what}: reference-vs-each`);
  view.referenceVsEach?.rows.forEach((row, r) => {
    const expected = section.referenceVsEach?.rows[r];
    assert.equal(row.engine, expected?.engine, what);
    assert.equal(row.verdict, expected?.verdict, what);
    assert.equal(row.metrics.length, expected?.metrics.length, `${what}: every metric of ${row.engine}`);
    row.metrics.forEach((metric, c) => {
      const cell = expected?.metrics[c] ?? null;
      assert.equal(metric === null, cell === null, `${what}: the cell of ${row.engine}, ${view.columns[c].name}`);
      if (metric === null || cell === null) return;
      assert.ok(Object.is(metric.value.value, cell.value), `${what}: ${row.engine}, ${metric.name}`);
      assert.equal(metric.name, view.columns[c].name);
      metricAt(metric, "reference-vs-each", view.referenceVsEach?.reference ?? "", row.engine, `${row.engine} ${c}`);
    });
  });
  assert.equal(view.pairwise === null, section.pairwise === null, `${what}: pairwise`);
  view.pairwise?.cells.forEach((cells, r) =>
    cells.forEach((cell, c) => {
      const expected = section.pairwise?.cells[r][c] ?? null;
      assert.equal(cell === null, expected === null, what);
      if (cell === null || expected === null) return;
      assert.equal(cell.verdict, expected.verdict, what);
      assert.equal(cell.worst === null, expected.worst === null, what);
      if (cell.worst === null || expected.worst === null) return;
      assert.ok(Object.is(cell.worst.value.value, expected.worst.value), `${what}: pairwise ${r} ${c}`);
      const engines = view.pairwise?.engines ?? [];
      metricAt(cell.worst, "pairwise", engines[r], engines[c], `pairwise ${r} ${c}`);
    }),
  );

  assert.equal(view.recorded === null, section.recorded === null, `${what}: recorded`);
  assert.equal(view.recorded?.rows.length, section.recorded?.rows.length, `${what}: every recorded row`);
  view.recorded?.rows.forEach((row, r) => {
    const expected = section.recorded?.rows[r];
    assert.deepEqual([row.name, row.element], [expected?.name, expected?.index], what);
    assert.equal(row.cells.length, expected?.cells.length, `${what}: every engine of ${row.name}`);
    row.cells.forEach((cell, c) => {
      const value = expected?.cells[c] ?? null;
      assert.equal(cell === null, value === null, `${what}: ${row.name}, column ${c}`);
      if (cell === null || value === null) return;
      assert.ok(Object.is(cell.value, value.value), `${what}: ${row.name} ${row.element}, column ${c}`);
      const [, setIndex, , participant, , valueName, element] = tokensOf(cell);
      ofThisSection(setIndex as number);
      const participants = comparisons.comparisons[setIndex as number].participants;
      assert.equal(participants[participant as number].engine, view.recorded?.engines[c], `${what}: the engine`);
      assert.deepEqual([valueName, element], [row.name, row.element], `${what}: the value and element`);
    });
  });

  assert.equal(view.mtf === null, section.mtf === undefined, `${what}: an MTF table`);
  if (view.mtf !== null && section.mtf !== undefined) holdMtf(comparisons, group, view.mtf, section.mtf, what);
  holdCharts(places, name, view, policy, section.mtf, what);
}

/**
 * The job of an engine whose answer a comparison of `mtf.native` judges, by the comparator's rule
 * (`src/compare/mtfNative.ts`: `(lastA?.data ?? a)`): the engine's last later step where that answer has data, and its
 * first answer where it has none (an error, a pending job, an unsupported answer) or there is no later step.
 */
function judgedJob(places: DocumentPlaces, jobs: readonly ManifestJob[], engine: string): ManifestJob | undefined {
  const own = jobs.filter((job) => job.engine === engine);
  const steps = own.filter((job) => job.step !== undefined);
  const lastA = steps.at(-1);
  const data = lastA === undefined ? undefined : storeEntryOf(places, lastA.storeKey)?.result.data;
  return data !== undefined ? lastA : own.find((job) => job.step === undefined);
}

/**
 * Holds a section's charts to their places: each overlay's series are the request's jobs, in order, each curve the
 * one of its job's store entry at the chart's field and cut; each difference is of the last answers of its pair's two
 * engines at that field and cut, at a frequency where both are finite, its limit the policy's for that field; each
 * deviation is of a pair of the section, of its two engines' entries, beside that pair's hits.maxDistance.
 */
function holdCharts(
  places: DocumentPlaces,
  name: string,
  view: SectionView,
  policy: Policy,
  table: MtfComparison | undefined,
  what: string,
): void {
  const { head, jobs, pairs, comparisons } = jobsOfSection(places, name, view.section);
  const storeOf = (engine: string, step: string | null | undefined): string => {
    const job = jobs.find((each) => each.engine === engine && (each.step ?? null) === (step ?? null));
    return `store:${job?.storeKey ?? "none"}`;
  };
  // The sorting of each pair the report model's MTF table (and its peers) is of: what a set-aside caption may claim.
  const tables: MtfComparison[] = [];
  const gather = (each: MtfComparison): void => {
    tables.push(each);
    (each.peers ?? []).forEach(gather);
  };
  if (table !== undefined) gather(table);
  const sameEngines = (x: { a: string; b: string }, y: { a: string; b: string }): boolean =>
    [x.a, x.b].sort().join() === [y.a, y.b].sort().join();
  const asideOf = (pair: { a: string; b: string }, element: number) => {
    const sorted = tables.find((each) => sameEngines(each.pair, pair));
    const field = sorted?.fields[element];
    if (sorted === undefined || field === undefined || field.class === null || field.class === "method") return null;
    return { a: sorted.pair.a, b: sorted.pair.b, class: field.class, reason: field.reason ?? "" };
  };
  const { overlays, differences, deviations } = view.charts;
  if (head.quantity !== "mtf.native") assert.equal(overlays.length + differences.length, 0, `${what}: no MTF chart`);
  if (head.quantity !== "rays.trace" || head.rung !== "r2") assert.equal(deviations.length, 0, `${what}: no deviation`);
  for (const overlay of overlays) {
    const at = `${what} overlay ${overlay.element} ${overlay.cut}`;
    assert.deepEqual(
      overlay.series.map((series) => [series.engine, series.step]),
      jobs.map((job) => [job.engine, job.step ?? null]),
      `${at}: a series for each job, in order`,
    );
    overlay.series.forEach((series) => {
      if (series.values !== null) {
        assert.equal(series.values.source.document, storeOf(series.engine, series.step), `${at}: the job's entry`);
        assert.equal(series.values.source.pointer, `/result/data/fields/${overlay.element}/${overlay.cut}`, at);
      }
      if (series.frequencies !== null) {
        assert.equal(series.frequencies.source.document, storeOf(series.engine, series.step), at);
        assert.equal(series.frequencies.source.pointer, "/request/spec/frequenciesPerMm", at);
      }
    });
    if (overlay.field !== null)
      assert.equal(overlay.field.source.pointer, `/result/data/fields/${overlay.element}/field`);
    assert.deepEqual(
      overlay.setAside,
      tables.flatMap((each) => asideOf(each.pair, overlay.element) ?? []),
      `${at}: each set-aside names the pair whose sorting it is`,
    );
  }
  for (const chart of differences) {
    const at = `${what} differences ${chart.element} ${chart.cut}`;
    assert.deepEqual(
      chart.pairs.map(({ a, b }) => [a, b]),
      pairs.map(({ a, b }) => [a, b]),
      `${at}: each pair of the section once`,
    );
    for (const pair of chart.pairs) {
      const [one, two] = [judgedJob(places, jobs, pair.a), judgedJob(places, jobs, pair.b)];
      assert.deepEqual([pair.aStep, pair.bStep], [one?.step ?? null, two?.step ?? null], `${at}: the judged answers`);
      assert.deepEqual(pair.setAside, asideOf(pair, chart.element), `${at}: the set-aside of this pair alone`);
      const verdict = pairs.find((each) => each.a === pair.a && each.b === pair.b)?.verdict;
      assert.equal(pair.verdict, verdict, `${at}: the pair's verdict`);
      const comparable = verdict !== "UNSUPPORTED" && verdict !== "ERROR";
      const curves = [one, two].map((job) => {
        const entry = storeEntryOf(places, job?.storeKey ?? null);
        const field = (entry?.result.data as { fields?: Record<string, unknown>[] } | undefined)?.fields?.[
          chart.element
        ];
        return field === undefined ? null : decoded(field[chart.cut]).values;
      });
      const finite = !comparable
        ? []
        : (curves[0] ?? []).flatMap((x, i) =>
            Number.isFinite(x) && Number.isFinite(curves[1]?.[i] ?? Number.NaN) ? [i] : [],
          );
      assert.deepEqual(
        pair.points.map((point) => Number(/element (\d+) of/.exec(point.difference.derivation)?.[1])),
        finite,
        `${at}: a point at each frequency where both are finite`,
      );
      for (const point of pair.points) {
        const element = Number(/element (\d+) of/.exec(point.difference.derivation)?.[1]);
        assert.deepEqual(
          point.difference.of.map((source) => [source.document, source.pointer]),
          [one, two].map((job) => [`store:${job?.storeKey}`, `/result/data/fields/${chart.element}/${chart.cut}`]),
          `${at}: the two curves`,
        );
        assert.deepEqual(
          [point.frequency.source.document, point.frequency.source.pointer],
          [`store:${one?.storeKey}`, `/request/spec/frequenciesPerMm/${element}`],
        );
      }
    }
    if (chart.limit !== null) {
      const metrics = policy.rungs[head.rung]?.metrics ?? {};
      const banded = Object.hasOwn(metrics, "mtfOnAxis.maxAbs");
      const metric = banded ? (chart.field?.value === 0 ? "mtfOnAxis.maxAbs" : "mtfOffAxis.maxAbs") : "mtf.maxAbs";
      assert.deepEqual(
        tokensOf(chart.limit),
        ["rungs", head.rung, "metrics", metric, banded ? "attention" : "tolerance"],
        `${at}: the limit of the field`,
      );
    }
  }
  assert.deepEqual(
    deviations.map(({ a, b }) => [a, b]),
    head.quantity === "rays.trace" && head.rung === "r2" ? pairs.map(({ a, b }) => [a, b]) : [],
    `${what}: a deviation for each pair`,
  );
  deviations.forEach((chart, d) => {
    const at = `${what} deviation ${chart.a} ${chart.b}`;
    const { set, pair } = pairs[d];
    const metric = comparisons.comparisons[set].pairs[pair].metrics.findIndex(
      (each) => each.name === "hits.maxDistance",
    );
    if (metric < 0) assert.equal(chart.maxDistance, null, at);
    else {
      assert.deepEqual(
        tokensOf(chart.maxDistance!),
        ["comparisons", set, "pairs", pair, "metrics", metric, "value"],
        at,
      );
    }
    if (chart.gate !== null) {
      assert.deepEqual(tokensOf(chart.gate), ["rungs", head.rung, "metrics", "hits.maxDistance", "tolerance"], at);
    }
    for (const bar of chart.bars) {
      assert.deepEqual(
        [...new Set(bar.distance.of.map((source) => source.document))],
        [storeOf(chart.a, null), storeOf(chart.b, null)],
        `${at}: the two answers`,
      );
    }
  });
}

/** Holds an MTF table's figures to their columns, fields and bands, and to the report model's table. */
function holdMtf(
  comparisons: ComparisonFile,
  group: readonly number[],
  view: MtfView,
  table: MtfComparison,
  what: string,
): void {
  assert.deepEqual(
    view.columns,
    table.columns.map(({ engine, step, judged }) => ({ engine, step, judged })),
    what,
  );
  assert.equal(view.fields.length, table.fields.length, `${what}: every field`);
  assert.equal(view.rows.length, table.rows.length, `${what}: every row`);
  const recordedAt = (figure: Figure, engine: string, name: string, element: number, at: string): void => {
    const [, setIndex, , participant, , valueName, place] = tokensOf(figure);
    assert.ok(group.includes(setIndex as number), `${what} ${at}: a set of the section`);
    const participants = comparisons.comparisons[setIndex as number].participants;
    assert.equal(participants[participant as number].engine, engine, `${what} ${at}: the column's engine`);
    assert.equal(valueName, name, `${what} ${at}: the value`);
    assert.equal(place, element, `${what} ${at}: the field's element`);
  };
  view.fields.forEach((field, f) => {
    assert.equal(field.element, f);
    assert.ok(Object.is(field.field?.value ?? Number.NaN, table.fields[f].field), `${what}: field ${f}`);
    if (field.field !== null) assert.equal(tokensOf(field.field)[6], f, `${what}: field ${f}'s element`);
    assert.ok(Object.is(field.chiefLandingMm?.value ?? null, table.fields[f].chiefLandingMm), what);
    assert.deepEqual([field.class, field.reason], [table.fields[f].class, table.fields[f].reason], what);
  });
  view.rows.forEach((row, r) => {
    const expected = table.rows[r];
    const at = `row ${r}`;
    assert.deepEqual(
      [row.cut, row.frequency, row.status],
      [expected.cut, String(expected.frequencyPerMm), expected.status],
    );
    assert.ok(Object.is(row.field?.value ?? Number.NaN, expected.field), `${what} ${at}: the field`);
    assert.equal(row.values.length, expected.values.length, `${what} ${at}: every column`);
    row.values.forEach((value, c) => {
      assert.ok(Object.is(value?.value ?? null, expected.values[c]), `${what} ${at}, column ${c}`);
      if (value === null) return;
      const column = view.columns[c];
      const name = `${row.cut}@${row.frequency}${column.step === null ? "" : `#${column.step}`}`;
      recordedAt(value, column.engine, name, row.element, `${at}, column ${c}`);
    });
    assert.ok(Object.is(row.difference?.value ?? null, expected.difference), `${what} ${at}: the difference`);
    assert.ok(Object.is(row.band?.value ?? null, expected.band), `${what} ${at}: the band`);
    if (row.band !== null && !("derivation" in row.band)) {
      const metric = expected.field === 0 ? ON_AXIS_METRIC : OFF_AXIS_METRIC;
      assert.equal(tokensOf(row.band)[3], metric, `${what} ${at}: the band of the row's field`);
    }
  });
  if (view.bands.onAxis !== null) assert.equal(tokensOf(view.bands.onAxis)[3], ON_AXIS_METRIC, what);
  if (view.bands.offAxis !== null) assert.equal(tokensOf(view.bands.offAxis)[3], OFF_AXIS_METRIC, what);
  assert.equal(view.peers.length, table.peers?.length ?? 0, `${what}: every peer`);
  view.peers.forEach((peer, p) => holdMtf(comparisons, group, peer, table.peers![p], `${what} peer ${p}`));
}

/** Holds a run page and its run pages to the report model: every section and every row of the support matrix. */
function holdRun(places: DocumentPlaces, name: string, view: RunView, parts: readonly RunPartView[], policy: Policy) {
  const { manifest, comparisons } = runDocuments(places, name);
  if (manifest === null) return;
  const report = buildReport(
    manifest,
    comparisons ?? { contract: "1.0", kind: "comparison-file", suite: "", manifest: "", policy: "", comparisons: [] },
    policy,
  );
  const key = (section: { run: string; rung: string; quantity: string; requestId: string; request: string | null }) =>
    [section.run, section.rung, section.quantity, section.requestId, section.request].join("\0");
  const sections = view.split ? parts.flatMap((part) => part.sections) : view.sections;
  assert.deepEqual(sections.map(key), report.sections.map(key), `${name}: every section`);
  const rows = view.split ? parts.flatMap((part) => part.rows) : view.supportByRun.flatMap((each) => each.rows);
  assert.deepEqual(rows, report.support, `${name}: every row of the support matrix`);
  parts.forEach((part) => assert.equal(part.run, manifest.runs[part.place].name));
  if (comparisons !== null && comparisons.comparisons.length > 0) {
    holdHeatMap(
      view.heatMap,
      manifest.runs.map((run) => run.name),
      [...new Set(comparisons.comparisons.map((set) => set.rung))],
      (run, rung) =>
        comparisons.comparisons
          .filter((set) => set.run === run && set.rung === rung)
          .flatMap((set) => set.pairs.map((pair) => pair.verdict)),
      name,
    );
  } else assert.equal(view.heatMap, null, `${name}: no heat map without comparisons`);
}

/**
 * Holds a heat map to the documents: a row for each run the manifest or baseline has (one with no comparison
 * included), a column for each rung, and each cell's verdict the gravest of its pairs by `VERDICT_GRAVITY`, recounted.
 */
function holdHeatMap(
  view: RunView["heatMap"],
  runs: readonly string[],
  rungs: readonly string[],
  verdictsOf: (run: string, rung: string) => Verdict[],
  what: string,
): void {
  assert.ok(view !== null, `${what}: a heat map`);
  assert.deepEqual(view.rungs, rungs, `${what}: a column for each rung`);
  if (runs.length > HEAT_MAP_ROWS) return void assert.deepEqual(view.rows, []);
  assert.deepEqual(
    view.rows.map((row) => row.run),
    runs,
    `${what}: a row for each run`,
  );
  view.rows.forEach((row) =>
    row.cells.forEach((cell, g) => {
      const verdicts = verdictsOf(row.run, rungs[g]);
      assert.equal(cell?.verdict ?? null, gravest(verdicts), `${what}: ${row.run} ${rungs[g]}, the gravest verdict`);
      assert.deepEqual(
        cell?.counts.map(({ verdict }) => verdict) ?? [],
        VERDICTS.filter((verdict) => verdicts.includes(verdict)),
      );
    }),
  );
}

/** Holds a baseline run page's figures to their run, rung, pair, verdict and metric, and to the baseline report. */
function holdBaselineRun(places: DocumentPlaces, view: BaselineRunView): void {
  const { baseline } = baselineDocuments(places, view.stem);
  assert.ok(baseline !== null);
  const what = `baseline ${view.stem} run ${view.place}`;
  const run = baseline.runs[view.place];
  assert.equal(view.name, run.name, what);
  assert.equal(view.rungs.length, run.rungs.length, `${what}: every rung`);
  const report = (view.baselineKind === "mtf" ? buildMtfBaselineReport : buildBaselineReport)(baseline);
  view.rungs.forEach((rung, g) => {
    const [, r, , rungIndex] = tokensOf(rung.requests);
    assert.equal(baseline.runs[r as number].name, view.name, `${what}: requests of the run`);
    assert.equal(
      baseline.runs[r as number].rungs[rungIndex as number].rung,
      rung.rung,
      `${what}: requests of the rung`,
    );
    const row = report.rungs.find((each) => each.rung === rung.rung)?.rows.find((each) => each.run === view.name);
    assert.ok(Object.is(rung.requests.value, row?.requests), `${what}: ${rung.rung} requests`);
    assert.equal(rung.pairs.length, run.rungs[g].pairs.length, `${what}: every pair of ${rung.rung}`);
    rung.pairs.forEach((pair, p) => {
      const at = `${what} ${rung.rung} ${pair.a} ${pair.b}`;
      const recorded = run.rungs[g].pairs[p];
      const reportPair = row?.pairs.find((each) => each.a === pair.a && each.b === pair.b);
      assert.equal(pair.verdict, reportPair?.verdict, at);
      assert.equal(pair.verdicts.length, recorded.verdicts.length, `${at}: every verdict`);
      assert.equal(pair.metrics.length, recorded.metrics.length, `${at}: every metric`);
      const ofThisPair = (figure: Figure): (string | number)[] => {
        const tokens = tokensOf(figure);
        const [, runIndex, , gIndex, , pIndex] = tokens;
        const there = baseline.runs[runIndex as number];
        assert.equal(there.name, view.name, `${at}: the run`);
        assert.equal(there.rungs[gIndex as number].rung, rung.rung, `${at}: the rung`);
        const stated = there.rungs[gIndex as number].pairs[pIndex as number];
        assert.deepEqual([stated.a, stated.b], [pair.a, pair.b], `${at}: the pair`);
        return tokens.slice(6);
      };
      pair.verdicts.forEach(({ verdict, requests }) => {
        const [, v] = ofThisPair(requests);
        assert.equal(recorded.verdicts[v as number].verdict, verdict, `${at}: the count of ${verdict}`);
      });
      pair.metrics.forEach((metric) => {
        for (const figure of [metric.value, metric.tolerance, metric.measured]) {
          if (figure === null) continue;
          const [, m] = ofThisPair(figure);
          assert.equal(recorded.metrics[m as number].name, metric.name, `${at}: the metric ${metric.name}`);
        }
      });
      if (reportPair?.worst !== undefined) {
        const shown = pair.metrics.find((metric) => metric.name === reportPair.worst?.name);
        assert.ok(Object.is(shown?.value.value, reportPair.worst.value), `${at}: the worst figure`);
      }
    });
  });
}

/** Holds a baseline page's rows to the baseline report: each run's gravest verdict by rung. */
function holdBaseline(places: DocumentPlaces, view: BaselineView): void {
  const { baseline } = baselineDocuments(places, view.stem);
  if (baseline === null) return;
  const report = (view.baselineKind === "mtf" ? buildMtfBaselineReport : buildBaselineReport)(baseline);
  assert.deepEqual(
    view.runs.map((run) => run.name),
    baseline.runs.map((run) => run.name),
  );
  assert.deepEqual(
    view.rungs,
    report.rungs.map((rung) => rung.rung),
    `${view.stem}: every rung`,
  );
  view.runs.forEach((run) =>
    view.rungs.forEach((rung, g) => {
      const row = report.rungs.find((each) => each.rung === rung)?.rows.find((each) => each.run === run.name);
      const expected = row === undefined ? null : gravest(row.pairs.map((pair) => pair.verdict));
      assert.equal(run.verdicts[g], expected, `${view.stem} ${run.name} ${rung}`);
    }),
  );
  if (view.policy !== null) assert.deepEqual(tokensOf(view.policy.version), ["policy", "version"]);
  holdHeatMap(
    view.heatMap,
    baseline.runs.map((run) => run.name),
    view.rungs,
    (run, rung) =>
      baseline.runs
        .filter((each) => each.name === run)
        .flatMap((each) =>
          each.rungs.filter((one) => one.rung === rung).flatMap((one) => one.pairs.map((pair) => pair.verdict)),
        ),
    view.stem,
  );
}

// ── Lens pages (Stage 8.4) ───────────────────────────────────────────────────────────────────────────────────────

/** A curve as the test enumerates a choice: its job and where in its answer it is. */
interface TestCurve {
  readonly lensRun: TestLensRun;
  readonly job: ManifestJob;
  readonly entry: StoreEntry;
  readonly element: number;
  readonly cut: string;
}

const engineLabelOf = (job: ManifestJob): string => (job.step === undefined ? job.engine : `${job.engine}#${job.step}`);

/**
 * The curves of a choice, enumerated by the test from the manifests and the store: the lens's runs chosen, in order;
 * each run's mtf.native requests in the order the manifest first has them; each request's engines sorted, an engine's
 * jobs in the manifest's order; each answer's fields chosen, in their order; the cuts chosen, sagittal first.
 */
function expectedCurves(places: DocumentPlaces, runs: readonly TestLensRun[], view: LensView): TestCurve[] {
  const chosen = (options: readonly { id: string; chosen: boolean }[]): string[] =>
    options.filter((option) => option.chosen).map((option) => option.id);
  const [runIds, rungs, engines, fields, cuts] = [
    chosen(view.picker.runs),
    chosen(view.picker.rungs),
    chosen(view.picker.engines),
    chosen(view.picker.fields),
    chosen(view.picker.cuts),
  ];
  const out: TestCurve[] = [];
  for (const lensRun of runs) {
    if (!runIds.includes(`${lensRun.suite}/${lensRun.place}`)) continue;
    const own = lensRun.manifest.jobs.filter((job) => job.run === lensRun.run && job.quantity === "mtf.native");
    const requests = [...new Set(own.map((job) => `${job.rung} ${job.requestId}`))];
    for (const request of requests) {
      const jobs = own.filter((job) => `${job.rung} ${job.requestId}` === request);
      for (const engine of [...new Set(jobs.map((job) => job.engine))].sort()) {
        for (const job of jobs.filter((each) => each.engine === engine)) {
          if (!rungs.includes(job.rung) || !engines.includes(engineLabelOf(job))) continue;
          const entry = storeEntryOf(places, job.storeKey);
          const data = entry?.result.status === "ok" ? (entry.result.data as { fields?: { field: number }[] }) : null;
          const kind = (entry?.request.spec as { fields?: { kind?: string } } | undefined)?.fields?.kind;
          const short = kind === "image-height-fractions" ? "fraction" : kind === "angles-deg" ? "angle" : "field";
          (data?.fields ?? []).forEach((field, element) => {
            if (!fields.includes(`${short}:${String(field.field)}`)) return;
            for (const cut of ["sagittal", "tangential"]) {
              if (cuts.includes(cut)) out.push({ lensRun, job, entry: entry!, element, cut });
            }
          });
        }
      }
    }
  }
  return out;
}

/** The section groups' place of a request in a run directory's comparisons, and the pairs of its sets. */
function sectionOfRequest(places: DocumentPlaces, suite: string, run: string, rung: string, requestId: string) {
  const { comparisons } = runDocuments(places, suite);
  if (comparisons === null) return null;
  const groups = groupsOf(comparisons);
  const section = groups.findIndex((group) => {
    const head = comparisons.comparisons[group[0]];
    return head.run === run && head.rung === rung && head.requestId === requestId;
  });
  if (section < 0) return null;
  return { section, pairs: groups[section].flatMap((set) => comparisons.comparisons[set].pairs) };
}

/**
 * Holds a lens page to its documents: its runs to the case files, its curves to the test's own enumeration and each
 * to its job's store entry, field and cut, and each difference to the test's own sorting: within the reference's
 * request (a pair of its section, with that pair's verdict and the policy's band of its rung), apart (with its
 * reason), or left out (another set of frequencies, or no values).
 */
function holdLens(places: DocumentPlaces, runs: readonly TestLensRun[], view: LensView, policy: Policy, what: string) {
  assert.deepEqual(
    view.runs.map((run) => [run.suite, run.place, run.run, run.caseId]),
    runs.map((run) => [run.suite, run.place, run.run, run.caseId]),
    `${what}: every run of the lens, in order`,
  );
  view.runs.forEach((run) => {
    const condition = run.condition;
    if (condition === null) return;
    const document = `case:${run.suite}/${run.caseId}`;
    const figures = [
      condition.zoomT,
      condition.focusT,
      condition.stopSemiDiameterMm,
      condition.imageZ,
      condition.object.kind === "finite" ? condition.object.z : null,
      ...condition.lines.flatMap((line) => [line.wavelengthNm, line.weight]),
    ];
    for (const figure of figures) {
      if (figure !== null) assert.equal(figure.source.document, document, `${what}: ${run.run}'s own case`);
    }
    condition.lines.forEach((line, l) =>
      assert.deepEqual(tokensOf(line.wavelengthNm), ["conditions", "lines", l, "wavelengthNm"], what),
    );
    if (condition.plane?.shiftMm) {
      assert.equal(condition.plane.shiftMm.source.document, `manifest:${run.suite}`);
      assert.deepEqual(tokensOf(condition.plane.shiftMm), ["runs", run.place, "recipe", "recipe", "plane", "shiftMm"]);
    }
  });
  assert.deepEqual(
    view.picker.runs.map((option) => option.id),
    runs
      .filter((run) => run.manifest.jobs.some((job) => job.run === run.run && job.quantity === "mtf.native"))
      .map((run) => `${run.suite}/${run.place}`),
    `${what}: a run of the picker for each run with an mtf.native job`,
  );
  const expected = expectedCurves(places, runs, view);
  if (expected.length > MAX_LENS_CURVES) {
    assert.deepEqual(view.curves, [], `${what}: too many curves draw none`);
    return;
  }
  assert.deepEqual(
    view.curves.map((curve) => [
      curve.suite,
      curve.runName,
      curve.rung,
      curve.requestId,
      curve.engine,
      curve.step,
      curve.element,
      curve.cut,
    ]),
    expected.map(({ lensRun, job, element, cut }) => [
      lensRun.suite,
      lensRun.run,
      job.rung,
      job.requestId,
      job.engine,
      job.step ?? null,
      element,
      cut,
    ]),
    `${what}: the curves of the choice, in order`,
  );
  view.curves.forEach((curve, c) => {
    const { job } = expected[c];
    const document = `store:${job.storeKey}`;
    for (const [figure, pointer] of [
      [curve.values, `/result/data/fields/${curve.element}/${curve.cut}`],
      [curve.frequencies, "/request/spec/frequenciesPerMm"],
      [curve.field, `/result/data/fields/${curve.element}/field`],
    ] as const) {
      if (figure === null) continue;
      assert.deepEqual([figure.source.document, figure.source.pointer], [document, pointer], `${what} curve ${c + 1}`);
    }
  });
  const reference = view.curves.find((curve) => curve.reference);
  if (reference === undefined || view.referenceNote !== null) {
    assert.equal(view.within, null, what);
    assert.equal(view.other, null, what);
    return;
  }
  // The test's own sorting of every other curve.
  const within: number[] = [];
  const apart: [number, string][] = [];
  let left = 0;
  const T = DASHBOARD_TEXT.lens;
  const refSection = sectionOfRequest(places, reference.suite, reference.runName, reference.rung, reference.requestId);
  for (const curve of view.curves) {
    if (curve.reference) continue;
    const values = curve.values?.values ?? [];
    const frequencies = curve.frequencies?.values ?? [];
    const same =
      frequencies.length === (reference.frequencies?.values.length ?? -1) &&
      frequencies.every((value, i) => Object.is(value, reference.frequencies?.values[i]));
    if (curve.state === "unavailable" || values.every((value) => value === null) || !same) {
      left++;
      continue;
    }
    const why =
      curve.suite !== reference.suite
        ? T.whyOtherDirectory
        : curve.run !== reference.run
          ? T.whyOtherRun
          : curve.rung !== reference.rung || curve.requestId !== reference.requestId
            ? T.whyOtherRequest
            : curve.element !== reference.element
              ? T.whyOtherField
              : curve.cut !== reference.cut
                ? T.whyOtherCut
                : curve.engine === reference.engine
                  ? T.whySameEngine
                  : refSection === null
                    ? T.whyNotCompared
                    : refSection.pairs.some(
                          (pair) => [pair.a, pair.b].sort().join() === [curve.engine, reference.engine].sort().join(),
                        )
                      ? null
                      : T.whyNoPair;
    if (why === null) within.push(curve.curve);
    else apart.push([curve.curve, why]);
  }
  assert.equal(view.unresolved.length, left, `${what}: what is left out of every difference`);
  assert.deepEqual(
    view.other?.lines.map((line) => [line.curve, line.why]) ?? [],
    apart,
    `${what}: the differences no comparison judges, each with its reason`,
  );
  const curveNumbered = (n: number) => view.curves[n - 1];
  /** A point is of the frequency of its own element, in the store entry of its curve. */
  const holdPoint = (
    point: { frequency: Figure; difference: { derivation: string } },
    curve: LensView["curves"][number],
  ): void => {
    const element = /at element (\d+) of both curves$/.exec(point.difference.derivation)?.[1];
    assert.deepEqual(
      [point.frequency.source.document, point.frequency.source.pointer],
      [curve.values?.source.document, `/request/spec/frequenciesPerMm/${element}`],
      `${what}: the frequency of the point's own element`,
    );
  };
  for (const line of view.other?.lines ?? []) {
    for (const point of line.points) {
      assert.deepEqual(point.difference.of, [curveNumbered(line.curve).values?.source, reference.values?.source], what);
      holdPoint(point, curveNumbered(line.curve));
    }
  }
  if (within.length === 0) return assert.equal(view.within, null, what);
  assert.ok(view.within !== null && refSection !== null, what);
  assert.equal(view.within.section?.section, refSection.section, `${what}: the reference's section`);
  assert.equal(view.within.view.pairs.length, within.length, `${what}: a pair for each curve within`);
  view.within.view.pairs.forEach((pair, p) => {
    const curve = curveNumbered(within[p]);
    assert.deepEqual(
      [pair.a, pair.aStep, pair.b, pair.bStep],
      [curve.engine, curve.step, reference.engine, reference.step],
    );
    const own = refSection.pairs.find((each) => [each.a, each.b].sort().join() === [pair.a, pair.b].sort().join());
    assert.equal(pair.verdict, own?.verdict, `${what}: the pair's verdict in the comparison`);
    for (const point of pair.points) {
      assert.deepEqual(point.difference.of, [curve.values?.source, reference.values?.source], what);
      holdPoint(point, curve);
    }
  });
  const limit = view.within.view.limit;
  if (limit !== null) {
    const metrics = policy.rungs[reference.rung]?.metrics ?? {};
    const banded = Object.hasOwn(metrics, "mtfOnAxis.maxAbs");
    const metric = banded ? (reference.field?.value === 0 ? "mtfOnAxis.maxAbs" : "mtfOffAxis.maxAbs") : "mtf.maxAbs";
    assert.deepEqual(tokensOf(limit), ["rungs", reference.rung, "metrics", metric, banded ? "attention" : "tolerance"]);
  }
}

/** A lens page's counts, recounted: the runs' places, the curves' numbers and fields, the reference's section. */
function lensCounts(places: DocumentPlaces, runs: readonly TestLensRun[], view: LensView): Map<string, number> {
  const expected = new Map<string, number>();
  runs.forEach((run, r) =>
    expected.set(
      `/runs/${r}/place`,
      run.manifest.runs.findIndex((each) => each.name === run.run),
    ),
  );
  const curves = expectedCurves(places, runs, view);
  view.curves.forEach((curve, c) => {
    expected.set(`/curves/${c}/curve`, c + 1);
    // The field's place in the answer, found by the test: the field of the answer whose value is the curve's.
    const fields = (curves[c]?.entry.result.data as { fields: { field: number }[] }).fields;
    expected.set(
      `/curves/${c}/element`,
      fields.findIndex((field) => field.field === curve.field?.value),
    );
  });
  const reference = view.curves.findIndex((curve) => curve.reference);
  if (view.reference !== null) expected.set("/reference/curve", reference + 1);
  if (view.within !== null) {
    const ref = view.curves[reference];
    const section = sectionOfRequest(places, ref.suite, ref.runName, ref.rung, ref.requestId);
    if (view.within.section !== null && section !== null) expected.set("/within/section/section", section.section);
    expected.set("/within/view/element", ref.element);
  }
  view.other?.lines.forEach((line, l) => {
    // A line's curve is the one whose values its differences are of.
    const of = line.points[0]?.difference.of[0];
    const same = (each: LensView["curves"][number]): boolean =>
      each.values !== null && each.values.source.document === of?.document && each.values.source.pointer === of.pointer;
    const curve = of === undefined ? line.curve : view.curves.findIndex(same) + 1;
    expected.set(`/other/lines/${l}/curve`, curve);
  });
  return expected;
}

/** The choices a lens page is held at: none, each run's links, all at the first field, and the golden one. */
function lensChoices(views: ReturnType<typeof createViews>, key: string): string[] {
  const empty = views.lens(key, "");
  const quick = empty.runs.flatMap((run) =>
    run.requests.flatMap((request) => (request.quick === null ? [] : [request.quick])),
  );
  const all = new URLSearchParams();
  for (const [name, options] of [
    ["run", empty.picker.runs],
    ["rung", empty.picker.rungs],
    ["engine", empty.picker.engines],
  ] as const) {
    for (const option of options) all.append(name, option.id);
  }
  if (empty.picker.fields[0] !== undefined) all.append("field", empty.picker.fields[0].id);
  for (const cut of ["sagittal", "tangential"]) all.append("cut", cut);
  const drawn = views.lens(key, all.toString());
  if (drawn.curves[0] !== undefined) all.append("ref", drawn.curves[0].id);
  // Every field and both cuts of the first run with an answer, against its last curve.
  const fields = new URLSearchParams();
  const first = empty.runs.find((run) => run.requests.length > 0);
  if (first !== undefined) {
    fields.append("run", first.id);
    for (const request of first.requests) fields.append("rung", request.rung);
    for (const engine of new Set(first.requests.flatMap((request) => request.engines))) fields.append("engine", engine);
    for (const field of empty.picker.fields) fields.append("field", field.id);
    for (const cut of ["sagittal", "tangential"]) fields.append("cut", cut);
    const last = views.lens(key, fields.toString()).curves.at(-1);
    if (last !== undefined) fields.append("ref", last.id);
  }
  return ["", ...quick, all.toString(), fields.toString(), ...(key === LENS_KEY ? [lensGoldenQuery(views)] : [])];
}

// ── Every page ───────────────────────────────────────────────────────────────────────────────────────────────────

/** Every page of a root and runs directory, held to its documents. */
// ── The compare pages (Stage 8.5) ────────────────────────────────────────────────────────────────────────────────

/** Every query a compare page's chips reach from the page opened without one, each once. */
function compareQueries(views: ReturnType<typeof createViews>, key: string): string[] {
  const queries = [""];
  for (let at = 0; at < queries.length; at++) {
    const view = views.compare(key, queries[at], null);
    assert.ok(view !== null);
    for (const facet of view.facets) {
      for (const option of facet.options) if (!queries.includes(option.query)) queries.push(option.query);
    }
  }
  return queries;
}

/** The case ids of a compare view's runs, read by the test from the manifests on disk. */
function compareCases(places: DocumentPlaces, view: CompareView): Set<string> {
  return new Set(
    view.runs.map((run) => {
      const manifest = readJson<RunManifest>(join(places.runsDir, run.suite, "manifest.json"));
      assert.ok(manifest !== null);
      assert.equal(manifest.runs[run.place]?.name, run.run, `${run.suite} has ${run.run} at ${run.place}`);
      return manifest.runs[run.place].caseId!;
    }),
  );
}

/** The gated pairs of a line by the test's own enumeration (each request's pair once, of either mode), and its values. */
function gatedRecount(
  places: DocumentPlaces,
  cases: ReadonlySet<string>,
  line: GatedLine,
): { pairs: { a: string; b: string; verdict: Verdict }[]; values: number[] } {
  const pairs: { a: string; b: string; verdict: Verdict }[] = [];
  const values: number[] = [];
  const metric = line.headline?.metric ?? line.unmeasured;
  const take = (found: { value: number | null } | undefined): void => {
    if (found !== undefined && found.value !== null) values.push(found.value);
  };
  if (line.source.kind === "runs") {
    // A request's pair once, whichever run directory, run or mode it is in: the same request is the same question.
    const seen = new Set<string>();
    for (const suite of line.source.suites) {
      const file = readJson<ComparisonFile>(join(places.runsDir, suite, "comparisons.json"));
      assert.ok(file !== null);
      for (const set of file.comparisons) {
        if (set.rung !== line.rung || !cases.has(set.caseId)) continue;
        for (const pair of set.pairs) {
          const [a, b] = [pair.a, pair.b].sort();
          const key = JSON.stringify([set.requestId, a, b]);
          if (seen.has(key)) continue;
          seen.add(key);
          pairs.push({ a, b, verdict: pair.verdict });
          take(pair.metrics.find((each) => each.name === metric));
        }
      }
    }
  }
  if (line.source.kind === "baselines") {
    for (const stem of line.source.stems) {
      const baseline = readJson<Baseline>(join(places.rootDir, "baselines", `${stem}.json`));
      assert.ok(baseline !== null);
      for (const run of baseline.runs) {
        if (run.caseId === null || !cases.has(run.caseId)) continue;
        for (const pair of run.rungs.find((each) => each.rung === line.rung)?.pairs ?? []) {
          for (const { verdict, count } of pair.verdicts) {
            for (let n = 0; n < count; n++) pairs.push({ a: pair.a, b: pair.b, verdict });
          }
          take(pair.metrics.find((each) => each.name === metric));
        }
      }
    }
  }
  return { pairs, values };
}

/** The comparison set a figure of a comparison file points into, by the test's own reading of its pointer. */
function setOf(
  places: DocumentPlaces,
  figure: { source: Source },
): { set: ComparisonFile["comparisons"][number]; tokens: (string | number)[] } {
  const tokens = tokensOf(figure as Figure);
  assert.equal(tokens[0], "comparisons");
  const file = documentFromDisk(places, figure.source.document) as ComparisonFile;
  return { set: file.comparisons[tokens[1] as number], tokens };
}

/** Holds a compare view's figures to the places of the view that hold them, and its sorting to the comparator's counts. */
function holdCompare(places: DocumentPlaces, view: CompareView, what: string): void {
  const cases = compareCases(places, view);
  for (const card of view.cards) {
    const tab = COMPARE_TABS.find((each) => each.tab === card.tab);
    assert.ok(tab !== undefined, `${what}: ${card.tab} is a tab`);
    for (const line of card.gated) {
      assert.ok(tab.gated.includes(line.rung), `${what}: ${line.rung} is a gated rung of ${card.tab}`);
      const found = gatedRecount(places, cases, line);
      // The pairs, recounted; each one's gravest verdict is the gravest of its requests'.
      const pairs = [...new Set(found.pairs.map((each) => JSON.stringify([each.a, each.b])))].sort();
      assert.deepEqual(
        line.pairs.map((pair) => JSON.stringify([pair.a, pair.b])),
        pairs,
        `${what}: ${line.rung} pairs`,
      );
      for (const pair of line.pairs) {
        const verdicts = found.pairs
          .filter((each) => each.a === pair.a && each.b === pair.b)
          .map((each) => each.verdict);
        assert.equal(pair.verdict, gravest(verdicts), `${what}: ${line.rung} ${pair.a} and ${pair.b}`);
      }
      if (line.headline !== null) {
        const tokens = tokensOf(line.headline.value);
        const values = found.values;
        assert.equal(line.headline.value.value, Math.max(...values), `${what}: the largest of ${line.rung}`);
        if (line.source.kind === "runs") {
          const { set } = setOf(places, line.headline.value);
          assert.equal(set.rung, line.rung, `${what}: the headline is of its rung`);
          assert.ok(cases.has(set.caseId), `${what}: the headline is of the condition's case`);
          const pair = set.pairs[tokens[3] as number];
          assert.deepEqual([pair.a, pair.b].sort(), [line.headline.a, line.headline.b], `${what}: its pair`);
          assert.equal(pair.metrics[tokens[5] as number].name, line.headline.metric, `${what}: its metric`);
        } else {
          assert.equal(tokens[0], "runs");
          assert.ok(line.headline.value.source.document.startsWith("baseline:"));
        }
        if (line.headline.gate !== null) {
          assert.equal(
            line.headline.gate.source.pointer,
            pointerOf(["rungs", line.rung, "metrics", line.headline.metric, "tolerance"]),
          );
        }
      }
    }
    for (const line of card.recorded) {
      assert.ok(tab.recorded.includes(line.rung), `${what}: ${line.rung} is a recorded rung of ${card.tab}`);
      assert.equal(line.a, "lv", `${what}: LensVisualizer first`);
      for (const metric of line.metrics) {
        if (line.source.kind === "run") {
          const { set, tokens } = setOf(places, metric.value);
          assert.equal(set.rung, line.rung);
          assert.equal(set.requestId, line.requestId, `${what}: the metric is of its request`);
          const pair = set.pairs[tokens[3] as number];
          assert.deepEqual([pair.a, pair.b].sort(), [line.a, line.b].sort(), `${what}: the metric is of its pair`);
          assert.equal(pair.metrics[tokens[5] as number].name, metric.name, `${what}: ${metric.name}`);
          assert.equal(pair.verdict, line.verdict, `${what}: the verdict is the pair's`);
        }
        for (const limit of [metric.band, metric.limit]) {
          if (limit !== null) {
            assert.equal(limit.source.pointer, pointerOf(["rungs", line.rung, "metrics", metric.name, "attention"]));
          }
        }
      }
      if (line.detail === null) continue;
      const compared = line.counts.find((each) => each.name === "fields.compared" || each.name === "lines.compared");
      for (const chart of line.detail.charts) {
        if (chart.kind === "points") {
          for (const series of chart.series) {
            for (const point of series.points) {
              for (const keyed of [point.x, point.y]) {
                if (!keyed.value.source.document.startsWith("comparisons:")) continue;
                const { set, tokens } = setOf(places, keyed.value);
                assert.equal(set.requestId, line.requestId, `${what}: a point of its request`);
                assert.equal(set.participants[tokens[3] as number].engine, series.engine, `${what}: of its engine`);
                assert.equal(tokens[5], keyed.key, `${what}: of its value`);
                assert.equal(tokens[6], point.element, `${what}: of its element`);
              }
            }
          }
          if (chart.axis === "profile" || compared === undefined) continue;
          // The elements of two methods are those the comparison counted as compared.
          const elements = new Set(chart.series.flatMap((series) => series.points.map((point) => point.element)));
          const all = Math.max(elements.size, ...chart.setAside.map((aside) => aside.element + 1));
          if (chart.values.length === 1) {
            assert.equal(
              all - chart.setAside.length,
              compared.value.value,
              `${what}: ${line.rung} elements of two methods`,
            );
          }
        }
        if (chart.kind === "values" && compared !== undefined) {
          const elements = new Set(chart.rows.map((row) => row.element));
          const banded = [...elements].filter((element) => !chart.setAside.some((aside) => aside.element === element));
          assert.equal(banded.length, compared.value.value, `${what}: ${line.rung} lines of two methods`);
        }
      }
      const fans = line.detail.charts.filter((chart) => chart.kind === "fan");
      if (fans.length > 0 && compared !== undefined) {
        assert.equal(fans.filter((chart) => chart.sorting.banded).length, compared.value.value, `${what}: fans`);
      }
    }
  }
}

/** The counts of a compare view, recounted: cases, places, verdicts, sections; elements read from the pointers. */
function compareCounts(places: DocumentPlaces, view: CompareView): Map<string, number> {
  const counts = new Map<string, number>();
  const cases = compareCases(places, view);
  counts.set("/count", cases.size);
  view.runs.forEach((run, index) => counts.set(`/runs/${index}/place`, run.place));
  const last = (pointer: string): number => Number(pointer.split("/").at(-1));
  view.cards.forEach((card, c) => {
    card.gated.forEach((line, l) => {
      const found = gatedRecount(places, cases, line);
      line.pairs.forEach((pair, p) => {
        pair.verdicts.forEach((each, v) => {
          const recount = found.pairs.filter(
            (one) => one.a === pair.a && one.b === pair.b && one.verdict === each.verdict,
          );
          counts.set(`/cards/${c}/gated/${l}/pairs/${p}/verdicts/${v}/count`, recount.length);
        });
      });
    });
    card.recorded.forEach((line, r) => {
      const base = `/cards/${c}/recorded/${r}`;
      if (line.source.kind === "run" && line.source.section !== null) {
        const file = readJson<ComparisonFile>(join(places.runsDir, line.source.suite, "comparisons.json"))!;
        const section = groupsOf(file).findIndex((group) => {
          const head = file.comparisons[group[0]];
          return head.run === line.source.run && head.rung === line.rung && head.requestId === line.requestId;
        });
        counts.set(`${base}/source/section`, section);
      }
      if (line.detail === null) return;
      line.detail.overlays.forEach((overlay, o) => counts.set(`${base}/detail/overlays/${o}/element`, overlay.element));
      line.detail.differences.forEach((difference, d) =>
        counts.set(`${base}/detail/differences/${d}/element`, difference.element),
      );
      line.detail.charts.forEach((chart, k) => {
        const at = `${base}/detail/charts/${k}`;
        if (chart.kind === "points") {
          chart.series.forEach((series, s) =>
            series.points.forEach((point, n) =>
              counts.set(`${at}/series/${s}/points/${n}/element`, last(point.y.value.source.pointer)),
            ),
          );
          chart.differences.forEach((group, g) =>
            group.points.forEach((point, n) =>
              counts.set(`${at}/differences/${g}/points/${n}/element`, last(point.difference.of[0].pointer)),
            ),
          );
        }
        if (chart.kind === "fan") {
          const pupil = chart.series.find((series) => series.pupil !== null)?.pupil;
          counts.set(
            `${at}/element`,
            pupil === undefined || pupil === null
              ? chart.element
              : Number(tokensOf({ value: 0, source: pupil.source })[3]),
          );
          chart.differences.forEach((point, n) => {
            const element = /at element (\d+) of both curves$/.exec(point.difference.derivation);
            counts.set(`${at}/differences/${n}/element`, Number(element?.[1]));
          });
        }
        if (chart.kind === "values") {
          chart.rows.forEach((row, n) =>
            counts.set(`${at}/rows/${n}/element`, last((row.a ?? row.b)!.value.source.pointer)),
          );
        }
        if (chart.kind !== "fan") {
          // Where the chart's axis has it, the element of an element set aside is its figure's place; else its own.
          chart.setAside.forEach((aside, n) =>
            counts.set(
              `${at}/setAside/${n}/element`,
              aside.at === null ? aside.element : last(aside.at.value.source.pointer),
            ),
          );
        }
      });
    });
  });
  return counts;
}

function holdEveryPage(
  places: DocumentPlaces,
  asked: AskedEngines,
  runPageRequests?: number,
): { figures: number; derived: number; pages: number } {
  const sources = createSources({ rootDir: places.rootDir, runsDir: places.runsDir, policyFile: places.policyFile });
  const views = createViews(sources, () => asked, { runPageRequests });
  const policy = JSON.parse(readFileSync(places.policyFile, "utf8")) as Policy;
  const askedEngines = asked.state === "asked" ? asked.engines : null;
  let figures = 0;
  let derived = 0;
  let pages = 0;
  const hold = (view: unknown, counts: Map<string, number>, what: string): void => {
    figures += holdView(places, view, counts, what);
    derived += walkView(view).derived.length;
    pages++;
  };
  hold(views.index(), indexCounts(places, sources.runNames(), sources.baselineStems(), askedEngines), "index");
  for (const name of sources.runNames()) {
    const run = views.run(name);
    hold(run, runCounts(places, name, run.split), `run ${name}`);
    const parts = run.runs.map(({ place }) => {
      const part = views.runPart(name, place);
      assert.ok(part !== null);
      hold(part, runPartCounts(places, name, place), `run ${place} of ${name}`);
      return part;
    });
    assert.equal(views.runPart(name, run.runs.length), null, "no run past the last");
    holdRun(places, name, run, parts, policy);
    const sections = run.split ? parts.flatMap((part) => part.sections) : run.sections;
    for (const { section } of sections) {
      const view = views.section(name, section);
      assert.ok(view !== null);
      hold(view, sectionCounts(places, name, section, view), `section ${section} of ${name}`);
      holdSection(places, name, view, policy);
    }
  }
  for (const [key, runs] of lensRunsOf(places, sources.runNames())) {
    for (const choice of lensChoices(views, key)) {
      const view = views.lens(key, choice);
      const what = `lens ${key}?${choice}`;
      hold(view, lensCounts(places, runs, view), what);
      holdLens(places, runs, view, policy, what);
    }
  }
  for (const key of views.index().compared.map((lens) => lens.key)) {
    for (const query of compareQueries(views, key)) {
      for (const tab of [null, ...COMPARE_TABS.map((each) => each.tab)]) {
        const view = views.compare(key, query, tab);
        assert.ok(view !== null);
        const what = `compare ${key}${tab === null ? "" : `/${tab}`}?${query}`;
        hold(view, compareCounts(places, view), what);
        holdCompare(places, view, what);
      }
    }
  }
  for (const stem of sources.baselineStems()) {
    const view = views.baseline(stem);
    hold(view, baselineCounts(places, stem, askedEngines), `baseline ${stem}`);
    holdBaseline(places, view);
    for (const { place } of view.runs) {
      const run = views.baselineRun(stem, place);
      assert.ok(run !== null);
      hold(run, new Map([["/place", place]]), `baseline ${stem} run ${place}`);
      holdBaselineRun(places, run);
    }
    assert.equal(views.baselineRun(stem, view.runs.length), null, "no run past the last");
  }
  return { figures, derived, pages };
}

test("every view-model number equals the result JSON: the fake suites and their baselines", () => {
  const places = { rootDir: fixture.rootDir, runsDir: fixture.runsDir, policyFile: POLICY_FILE };
  const held = holdEveryPage(places, { state: "not-asked" });
  assert.ok(held.pages >= 40, `${held.pages} pages`);
  assert.ok(held.figures > 100, `${held.figures} figures`);
});

test("every view-model number equals the result JSON: run pages split by run", () => {
  const places = { rootDir: fixture.rootDir, runsDir: fixture.runsDir, policyFile: POLICY_FILE };
  const sources = createSources(places);
  assert.equal(
    createViews(sources, () => ({ state: "not-asked" }), { runPageRequests: 1 }).run("fake-pair").split,
    true,
  );
  holdEveryPage(places, { state: "not-asked" }, 1);
});

test("every view-model number equals the result JSON: with the engines as asked", () => {
  const places = { rootDir: fixture.rootDir, runsDir: fixture.runsDir, policyFile: POLICY_FILE };
  const manifest = JSON.parse(readFileSync(join(fixture.runsDir, "fake-pair", "manifest.json"), "utf8")) as RunManifest;
  // fake-a as the run recorded it, fake-b another; fake-far and fake-near not answered at all.
  const engines = manifest.engines.map((engine) =>
    engine.id === "fake-b" && engine.status === "available" ? { ...engine, fingerprint: "e".repeat(64) } : engine,
  );
  holdEveryPage(places, { state: "asked", engines });
});

test("every view-model number equals the result JSON: the R5 and R5g stand-ins, their tables, charts and baseline", () => {
  const places = { rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile };
  const held = holdEveryPage(places, { state: "not-asked" });
  assert.ok(held.derived > 0, "the MTF tables and charts have derived differences, each recomputed");
  assert.ok(held.figures > 300, `${held.figures} figures`);
});

test("every view-model number equals the result JSON: the compare pages of R7a to R12b's stand-ins (Stage 8.5)", () => {
  const places = {
    rootDir: fixture.compareRootDir,
    runsDir: fixture.compareRunsDir,
    policyFile: fixture.comparePolicyFile,
  };
  const held = holdEveryPage(places, { state: "not-asked" });
  assert.ok(held.derived > 50, `${held.derived} derived differences, each recomputed`);
  assert.ok(held.figures > 500, `${held.figures} figures`);
});

test("every view-model number equals the result JSON: ref against its copies, R2's hit distance by surface", () => {
  const places = { rootDir: fixture.raysRootDir, runsDir: fixture.raysRunsDir, policyFile: fixture.raysPolicyFile };
  const held = holdEveryPage(places, { state: "not-asked" });
  assert.ok(held.derived >= 2 * 3 * 11, `${held.derived} derived numbers: a bar for each surface of each pair`);
});

test("a curve is held to its list in the JSON, or to the store's encoded ndarray decoded by the codec", (t) => {
  const runsDir = join(tempDir(t), "runs");
  const key = "a".repeat(64);
  mkdirSync(join(runsDir, "store"), { recursive: true });
  mkdirSync(join(runsDir, "suite"));
  const values = [0.5, 0.25, 2 ** -40];
  writeFileSync(join(runsDir, "store", `${key}.json`), JSON.stringify({ result: { data: { mtf: encodeF8(values) } } }));
  writeFileSync(join(runsDir, "suite", "comparisons.json"), JSON.stringify({ list: [1, null, 3] }));
  const places = { rootDir: runsDir, runsDir, policyFile: POLICY_FILE };
  const view = {
    stored: { values, source: { document: `store:${key}`, pointer: "/result/data/mtf" } },
    listed: { values: [1, null, 3], source: { document: "comparisons:suite", pointer: "/list" } },
  };
  holdView(places, view, new Map(), "curves");
  const wrong = { stored: { values: [0.5, 0.125, 2 ** -40], source: view.stored.source } };
  assert.throws(() => holdView(places, wrong, new Map(), "curves"), /stored\/1/);
});

test("a JSON pointer escapes ~ and /, and resolves members, indices and nothing else", () => {
  const document = { "a/b": { "c~d": [10, null, -0] }, plain: 1 };
  assert.equal(pointerOf(["a/b", "c~d", 2]), "/a~1b/c~0d/2");
  assert.deepEqual(pointerTokens("/a~1b/c~0d/2"), ["a/b", "c~d", "2"]);
  assert.ok(Object.is(figureAt("manifest:x", document, ["a/b", "c~d", 2]).value, -0));
  assert.equal(figureAt("manifest:x", document, ["a/b", "c~d", 1]).value, null);
  assert.deepEqual(resolvePointer(document, "/a~1b/c~0d/3"), { found: false });
  assert.deepEqual(resolvePointer(document, "/a~1b/c~0d/01"), { found: false });
  assert.deepEqual(resolvePointer(document, "/constructor"), { found: false });
  assert.throws(() => figureAt("manifest:x", document, ["a/b"]), /has no number at \/a~1b/);
  assert.deepEqual([...COUNT_KEYS].sort(), [
    "bytes",
    "count",
    "curve",
    "element",
    "exitCode",
    "failing",
    "files",
    "job",
    "place",
    "records",
    "requests",
    "runCount",
    "section",
    "sectionCount",
    "surface",
  ]);
});

/** The entries of an exchange folder, as the test reads them: neither hidden nor temporary; none if not there. */
function folderEntries(directory: string): string[] {
  return existsSync(directory)
    ? readdirSync(directory)
        .filter((name) => !name.startsWith(".") && !name.endsWith(".tmp"))
        .sort()
    : [];
}

test("every number of the control and job views is a count, recounted: jobs, exit codes, folders, collects", async (t) => {
  // Three jobs of run control on the fake root: a suite that is no suite (its run exits 2, and no step follows it),
  // the fake pair with fake-human (run 0; compare 1, its pending pairs ERROR; report 0), and a collect after the fake
  // operator answered (0). The exit codes are the commands' documented ones for those inputs.
  const directory = tempDir(t);
  const runsDir = join(directory, "runs");
  const broken = join(directory, "broken.json");
  writeFileSync(broken, "{ not a suite\n");
  const suites = [
    { name: "broken", file: broken },
    { name: "fake-pair", file: FAKE_PAIR_SUITE },
  ];
  const control = controlChoices(loadConfig({ rootDir: FAKE_ROOT, env: process.env }), suites, process.env);
  const dashboard = await startDashboard({ rootDir: FAKE_ROOT, runsDir, port: 0, control });
  t.after(() => dashboard.close());
  const { port } = dashboard;
  const token = /name="token" value="([0-9a-f]{64})"/.exec((await fetchFrom(port, "/control")).body)?.[1] ?? "";
  const act = async (action: string, fields: Record<string, string>, job: number): Promise<void> => {
    const answer = await fetchFrom(port, `/control/${action}`, {
      method: "POST",
      body: new URLSearchParams({ token, ...fields }).toString(),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    assert.equal(answer.headers.location, `/control/job/${job}`, answer.body);
    for (let tries = 0; JSON.parse((await fetchFrom(port, `/api/control/job/${job}`)).body).running; tries++) {
      assert.ok(tries < 900, `job ${job} ended`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };
  await act("start", { suite: "broken" }, 1);
  await act("start", { suite: "fake-pair", engines: "fake-a,fake-human", rungs: "selftest" }, 2);
  const exchange = join(runsDir, "exchange", "fake-human");
  const operator = fileURLToPath(new URL("../fixtures/fake-operator/operator.mjs", import.meta.url));
  assert.equal(spawnSync(process.execPath, [operator, exchange]).status, 0);
  await act("collect", {}, 3);

  const exitCodes: Record<number, (number | null)[]> = { 1: [2, null, null], 2: [0, 1, 0], 3: [0] };
  const places = { rootDir: FAKE_ROOT, runsDir, policyFile: POLICY_FILE };
  const view = JSON.parse((await fetchFrom(port, "/api/control")).body) as ControlView;
  const expected = new Map<string, number>();
  view.jobs.forEach((job, index) => {
    expected.set(`/jobs/${index}/job`, index + 1);
    exitCodes[index + 1].forEach((code, step) => {
      if (code !== null) expected.set(`/jobs/${index}/steps/${step}/exitCode`, code);
    });
  });
  assert.equal(view.jobs.length, 3);
  assert.deepEqual(
    view.exchange.map(({ engine }) => engine),
    ["fake-human"],
  );
  view.exchange[0].folders.forEach(({ folder }, index) =>
    expected.set(`/exchange/0/folders/${index}/count`, folderEntries(join(exchange, folder)).length),
  );
  holdView(places, view, expected, "control");
  for (const job of [1, 2, 3]) {
    const jobView = JSON.parse((await fetchFrom(port, `/api/control/job/${job}`)).body) as JobView;
    const counts = new Map<string, number>([["/job", job]]);
    exitCodes[job].forEach((code, step) => {
      if (code !== null) counts.set(`/steps/${step}/exitCode`, code);
    });
    if (job === 3) {
      // What the collect said, recounted from the exchange directory it moved the jobs into.
      const collected = folderEntries(join(exchange, "collected"));
      assert.deepEqual(jobView.collect?.engines[0].collected.jobs, collected);
      counts.set("/collect/engines/0/collected/count", collected.length);
      counts.set("/collect/engines/0/rejected/count", folderEntries(join(exchange, "rejected")).length);
      counts.set(
        "/collect/engines/0/pending/count",
        folderEntries(join(exchange, "outbox")).length + folderEntries(join(exchange, "pending")).length,
      );
    }
    holdView(places, jobView, counts, `job ${job}`);
  }
});
