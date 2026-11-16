// Listed failures of a suite other than the catalog (focus-stations, the owner's decision of 2026-11-16): admitted
// exactly as the catalog's are, at the ids of today, with a list of their own; synthetic figures only.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import {
  KNOWN_FAILURE_SUITES,
  classifyCatalog,
  failureEvidence,
  knownFailuresFile,
  pendingKnownFailures,
  readKnownFailures,
  reproducerSuiteName,
  unclassifiedFailures,
  unusedKnownFailures,
} from "../../src/baseline/catalog.ts";
import type { KnownFailure } from "../../src/baseline/catalog.ts";
import { checkBaseline, checkFails } from "../../src/baseline/check.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import { formatIssues, validateKind } from "../../src/contract/schemas.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { tempDir } from "../core/support.ts";

const policy = {
  contract: "1.3",
  kind: "policy" as const,
  version: 1,
  rungs: {
    "ray-trace": {
      quantity: "rays.trace",
      mode: "identical-rays" as const,
      class: "gated" as const,
      metrics: { "mask.mismatches": { unit: "rays", tolerance: 0 } },
    },
  },
};

/** A focus-stations rays baseline of one station whose optiland pairs fail by a mask mismatch. */
function stationsRaw(): Baseline {
  const pair = (a: string, b: string, fails: boolean) => ({
    a,
    b,
    verdict: fails ? ("FAIL" as const) : ("PASS" as const),
    verdicts: fails
      ? [
          { verdict: "PASS" as const, count: 2 },
          { verdict: "FAIL" as const, count: 1 },
        ]
      : [{ verdict: "PASS" as const, count: 3 }],
    metrics: [{ name: "mask.mismatches", unit: "rays", value: fails ? 2 : 0, tolerance: 0 }],
  });
  return {
    contract: "1.3",
    kind: "baseline",
    suite: { name: "focus-stations", hash: "a".repeat(64) },
    policy: { version: 1, hash: "b".repeat(64) },
    engines: ["lv", "optiland", "reference-tracer"].map((id) => ({
      id,
      version: "stand-in",
      fingerprint: "c".repeat(64),
      details: {},
    })),
    runs: [
      {
        name: "artificial-zoom0-focus1",
        caseId: "d".repeat(64),
        rungs: [
          {
            rung: "ray-trace",
            quantity: "rays.trace",
            requests: 3,
            support: ["lv", "optiland", "reference-tracer"].map((engine) => ({ engine, status: "ok" as const })),
            pairs: [
              pair("lv", "optiland", true),
              pair("lv", "reference-tracer", false),
              pair("optiland", "reference-tracer", true),
            ],
          },
        ],
      },
      { name: "artificial-refused", caseId: null, problems: ["invented-refusal: stand-in"], rungs: [] },
    ],
  };
}

function stationsKnown(raw: Baseline = stationsRaw()): KnownFailure[] {
  const rung = raw.runs[0].rungs[0];
  return rung.pairs
    .filter((pair) => pair.verdict === "FAIL")
    .map((pair) => ({
      run: raw.runs[0].name,
      rung: rung.rung,
      engines: [pair.a, pair.b] as [string, string],
      metric: "mask.mismatches",
      class: "method" as const,
      gotcha: "docs/gotchas.md#artificial-example",
      reproducer:
        "node bin/lvrtc.mjs run suites/focus-stations-repro/artificial-zoom0-focus1.json --checks ray-trace --jobs 4",
      evidenceHash: failureEvidence(rung.requests, pair),
    }));
}

test("focus-stations lists its failures in a file of its own, and no other suite but the catalog lists any", (t) => {
  assert.deepEqual(KNOWN_FAILURE_SUITES, ["catalog", "focus-stations"]);
  assert.equal(knownFailuresFile("catalog"), "docs/known-failures.json");
  assert.equal(knownFailuresFile("focus-stations"), "docs/known-failures.focus-stations.json");
  assert.equal(reproducerSuiteName("focus-stations"), "focus-stations-repro");
  const root = tempDir(t);
  assert.deepEqual(readKnownFailures(root, "focus-stations"), [], "no file: focus-stations lists none");
  assert.throws(() => readKnownFailures(root, "catalog"), /cannot read known failures/, "the catalog's is required");
  mkdirSync(join(root, "docs"));
  writeFileSync(join(root, "docs/known-failures.focus-stations.json"), JSON.stringify(stationsKnown()));
  assert.deepEqual(readKnownFailures(root, "focus-stations"), stationsKnown());
  // The catalog's list is another file, read only for the catalog; a suite with no list reads no file.
  assert.throws(() => readKnownFailures(root, "catalog"), /cannot read known failures/);
  assert.deepEqual(readKnownFailures(root, "benchmark"), []);
});

test("a focus-stations FAIL is admitted only as listed, keeps FAIL, and states contract minor 6 only then", () => {
  const raw = stationsRaw();
  assert.equal(unclassifiedFailures(raw).length, 2);
  const unlisted = classifyCatalog(raw, []);
  assert.equal(unclassifiedFailures(unlisted).length, 2);
  assert.equal(unlisted.contract, "1.3", "no classification, no minor 6");
  const classified = classifyCatalog(raw, stationsKnown());
  assert.equal(classified.contract, "1.6");
  assert.equal(unclassifiedFailures(classified).length, 0);
  const pairs = classified.runs[0].rungs[0].pairs;
  assert.deepEqual(
    pairs.map((pair) => [pair.verdict, pair.failures?.[0].class]),
    [
      ["FAIL", "method"],
      ["PASS", undefined],
      ["FAIL", "method"],
    ],
  );
  assert.ok("baseline" in parseBaseline(baselineText(classified)));
  // One listed pair of two: the other still fails to be admitted.
  assert.equal(unclassifiedFailures(classifyCatalog(raw, stationsKnown().slice(0, 1))).length, 1);
  // Another figure is another failure: its evidence is not the listed one.
  const moved = structuredClone(raw);
  Object.assign(moved.runs[0].rungs[0].pairs[0].metrics[0], { value: 3 });
  assert.equal(unclassifiedFailures(classifyCatalog(moved, stationsKnown())).length, 1);
  // Classifications stay out of every suite that lists none.
  const benchmark = { ...classified, suite: { ...classified.suite, name: "benchmark" } };
  const other = { ...raw, suite: benchmark.suite };
  assert.equal(classifyCatalog(other, stationsKnown()), other, "a suite that lists none is returned as it is");
  const leaked = parseBaseline(baselineText(benchmark));
  assert.ok("problems" in leaked && leaked.problems.some((p) => /a FAIL of a suite that lists known failures/.test(p)));
  assert.ok("problems" in parseBaseline(baselineText({ ...classified, contract: "1.5" })));
});

test("check: an unchanged listed FAIL is OK; a changed one, or an unlisted one, is DRIFT; a listed new one is NEW", () => {
  const baseline = classifyCatalog(stationsRaw(), stationsKnown());
  const same = checkBaseline(baseline, baseline, policy);
  assert.deepEqual(
    same.map((r) => [r.outcome, r.verdict, r.knownFailure ?? false]),
    [
      ["OK", "FAIL", true],
      ["OK", "PASS", false],
      ["OK", "FAIL", true],
    ],
  );
  assert.equal(checkFails(same), false);
  for (const change of ["figure", "count", "class", "unlisted"]) {
    const fresh = structuredClone(baseline);
    const rung = fresh.runs[0].rungs[0];
    const pair = rung.pairs[0];
    if (change === "figure") Object.assign(pair.metrics[0], { value: 3 });
    if (change === "count") Object.assign(rung, { requests: 4 });
    if (change === "class") Object.assign(pair.failures![0], { class: "numerical" });
    if (change === "unlisted") Object.assign(pair, { failures: undefined });
    const checked = checkBaseline(baseline, fresh, policy);
    assert.equal(checked[0].outcome, "DRIFT", change);
    assert.ok(checked[0].moved.includes("new, changed or unclassified focus-stations FAIL"), change);
    assert.equal(checkFails(checked), true, change);
  }
  // A station the baseline does not hold yet: its listed FAILs are NEW (pending in the list), an unlisted one DRIFT.
  const before = { ...baseline, runs: baseline.runs.slice(1) };
  const pending = checkBaseline(before, baseline, policy);
  assert.deepEqual(
    pending.map((r) => [r.outcome, r.verdict]),
    [
      ["NEW", "FAIL"],
      ["NEW", "PASS"],
      ["NEW", "FAIL"],
    ],
  );
  assert.equal(checkFails(pending), false);
  const unlisted = checkBaseline(before, classifyCatalog(stationsRaw(), []), policy);
  assert.deepEqual(
    unlisted.map((r) => r.outcome),
    ["DRIFT", "NEW", "DRIFT"],
  );
  assert.equal(checkFails(unlisted), true);
});

test("an entry whose run no baseline holds is pending; once held, it must classify a FAIL or it is unused", () => {
  const known = stationsKnown();
  const classified = classifyCatalog(stationsRaw(), known);
  const ahead = { ...known[0], run: "artificial-zoom0-focus2" };
  // Before the refresh: no committed baseline holds the station.
  const none = pendingKnownFailures([], [...known, ahead]);
  assert.equal(none.pending.length, 3);
  assert.deepEqual(none.held, []);
  // Held: every entry of a held run classifies its FAIL; the station not run yet stays pending.
  const split = pendingKnownFailures([classified], [...known, ahead]);
  assert.deepEqual(split.pending, [ahead]);
  assert.deepEqual(split.held, known);
  assert.deepEqual(unusedKnownFailures([classified], split.held), []);
  // An entry of a held run that classifies nothing (its hash another) is unused.
  const stale = { ...known[0], evidenceHash: "f".repeat(64) };
  assert.deepEqual(unusedKnownFailures([classifyCatalog(stationsRaw(), [stale, known[1]])], [stale, known[1]]), [
    "artificial-zoom0-focus1 ray-trace lv optiland mask.mismatches",
  ]);
});

test("the committed focus-stations list: today's ids, each entry's one-run reproducer of its own state", () => {
  const known = readKnownFailures(REPO_ROOT, "focus-stations");
  assert.ok(known.length > 0);
  const legacy = /^(?:r\d+[a-z]?|selftest|ref|ref-seidel|replay|wave|flux|optiland-wave)$/;
  for (const entry of known) {
    assert.ok(!legacy.test(entry.rung) && entry.engines.every((id) => !legacy.test(id)), JSON.stringify(entry));
    const [, path, checks] = /^node bin\/lvrtc\.mjs run (\S+\.json) --checks (\S+) --jobs [1-4]$/.exec(
      entry.reproducer,
    )!;
    assert.ok(checks.split(",").includes(entry.rung), entry.reproducer);
    const suite = JSON.parse(readFileSync(join(REPO_ROOT, path), "utf8"));
    assert.equal(formatIssues(validateKind("suite", suite)), "", path);
    assert.equal(suite.name, reproducerSuiteName("focus-stations"), path);
    assert.deepEqual(
      suite.runs.map((run: { name: string }) => run.name),
      [entry.run],
      path,
    );
  }
});

/** A heading's anchor as GitHub writes it: lower case, punctuation but hyphens dropped, each space a hyphen. */
function headingSlug(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
}

test("every entry of both lists links a heading of docs/gotchas.md", () => {
  const slugs = new Set(
    readFileSync(join(REPO_ROOT, "docs/gotchas.md"), "utf8")
      .split("\n")
      .flatMap((line) => {
        const heading = /^#{1,6} (.+)$/.exec(line);
        return heading === null ? [] : [headingSlug(heading[1])];
      }),
  );
  assert.equal(
    headingSlug("On an asphere optiland's iteration starts at the base conic, and goes where that leads"),
    "on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads",
  );
  for (const suite of KNOWN_FAILURE_SUITES) {
    const known = readKnownFailures(REPO_ROOT, suite);
    assert.ok(known.length > 0, suite);
    for (const entry of known) {
      const anchor = entry.gotcha.replace(/^docs\/gotchas\.md#/, "");
      assert.ok(slugs.has(anchor), `${knownFailuresFile(suite)}: ${entry.run} ${entry.gotcha}`);
    }
  }
});
