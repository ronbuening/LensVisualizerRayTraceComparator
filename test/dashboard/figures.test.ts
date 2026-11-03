// The verification of Stage 8.1: every view-model number equals the result JSON. Every view model of every page of
// the fixtures is walked: each number is inside a Figure, a Curve or a Derived, or is a count under a key of
// `COUNT_KEYS`; each Figure's and Curve's value is `Object.is` the value its pointer resolves to in the file the test
// reads from disk itself; each Derived is recomputed from the figures it names; and each count equals the test's own
// recount from the documents. A Figure must also be the right one: its pointer is checked against the place of the
// view that holds it (the set, pair, metric, participant, element, run and rung that place is of), and every cell is
// set against the independent path (`buildReport`, `buildBaselineReport`, `buildMtfBaselineReport`) that puts a
// value in the same cell, so that a view that leaves out a row, a column or a metric fails too.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { buildMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { buildBaselineReport } from "../../src/baseline/report.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { OFF_AXIS_METRIC, ON_AXIS_METRIC } from "../../src/compare/mtfNative.ts";
import { POLICY_FILE } from "../../src/compare/policyFile.ts";
import type { Baseline, BaselinePair } from "../../src/contract/baseline.ts";
import { VERDICTS } from "../../src/contract/comparison.ts";
import type { Verdict } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import type { ManifestEngine, RunManifest } from "../../src/core/manifest.ts";
import { encodeF8 } from "../../src/core/numeric/ndarray.ts";
import { decodeNdArray, isNdArray } from "../../src/core/numeric/ndarray.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { COUNT_KEYS, figureAt, pointerOf, pointerTokens, resolvePointer } from "../../src/dashboard/figure.ts";
import type { DocumentName, Figure } from "../../src/dashboard/figure.ts";
import type { AskedEngines } from "../../src/dashboard/identity.ts";
import { createViews } from "../../src/dashboard/server.ts";
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
import type { MtfComparison } from "../../src/report/mtfComparison.ts";
import { tempDir } from "../core/support.ts";
import { buildFixture, documentFromDisk, valueAtPointer, walkView } from "./support.ts";
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
  return expected;
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
  }
  expected.set("/failing", failing);
  return expected;
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
  return expected;
}

// ── Figures, curves and derived numbers against the files ────────────────────────────────────────────────────────

/** Recomputes a derived number from the sources it names. */
function recompute(derivation: string, values: readonly (number | null)[]): number | null {
  const numbers = values.filter((value): value is number => value !== null);
  if (derivation === "the first judged column minus the second") return values[0]! - values[1]!;
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
    values.forEach((value, index) => assert.ok(Object.is(value, curve.values[index]), `${what} ${path}/${index}`));
  }
  for (const { path, derived } of walked.derived) {
    const values = derived.of.map((source) => {
      const found = valueAtPointer(read(source.document), source.pointer);
      assert.ok(found.found, `${what} ${path}: ${source.document} has ${source.pointer}`);
      return found.value as number | null;
    });
    assert.ok(
      Object.is(recompute(derived.derivation, values), derived.value),
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
}

// ── Every page ───────────────────────────────────────────────────────────────────────────────────────────────────

/** Every page of a root and runs directory, held to its documents. */
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

test("every view-model number equals the result JSON: the R5 stand-ins, their MTF tables and MTF baseline", () => {
  const places = { rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile };
  const held = holdEveryPage(places, { state: "not-asked" });
  assert.ok(held.derived > 0, "the MTF tables have derived differences, each recomputed");
  assert.ok(held.figures > 300, `${held.figures} figures`);
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
    "count",
    "element",
    "failing",
    "place",
    "records",
    "requests",
    "section",
    "sectionCount",
  ]);
});
