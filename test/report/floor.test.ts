// The numerical-floor digest: the pairs of the floored engine and its arbiter, rung by rung and run by run, as a
// pure function of a manifest, its comparisons and the policy. The inputs are written by hand.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { ComparisonMetric, ComparisonSet, PairComparison, Verdict } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import {
  COUNT_UNITS,
  buildFloorReport,
  floorFileNames,
  floorOf,
  renderFloorMarkdown,
  renderFloorReport,
} from "../../src/report/floor.ts";

const POLICY = loadPolicy();
const FLOOR = { engine: "lv", arbiter: "ref" } as const;
const CASE = "c".repeat(64);
const TELE_CASE = "d".repeat(64);

const MANIFEST: RunManifest = {
  contract: "1.0",
  kind: "run-manifest",
  suite: { name: "digest", hash: "5".repeat(64) },
  engines: [
    {
      id: "lv",
      status: "available",
      version: "1",
      fingerprint: "f".repeat(64),
      adapterRevision: "a".repeat(64),
      details: { commit: "abc123", dirty: false, engineFileCount: 3 },
    },
    { id: "other", status: "available", version: "2", fingerprint: "o".repeat(64), details: {} },
    { id: "ref", status: "available", version: "1", fingerprint: "e".repeat(64), details: { sourceFiles: 12 } },
  ],
  runs: [
    { name: "wide", caseId: CASE, problems: [] },
    { name: "never-compared", caseId: "9".repeat(64), problems: [] },
    { name: "tele", caseId: TELE_CASE, problems: [] },
  ],
  jobs: [],
};

function metric(name: string, value: number | null, unit: string, where?: ComparisonMetric["where"]): ComparisonMetric {
  return { name, value, unit, ...(where === undefined ? {} : { where }) };
}

function pair(a: string, b: string, verdict: Verdict, metrics: ComparisonMetric[], reason?: string): PairComparison {
  return { a, b, metrics, class: "gated", verdict, ...(reason === undefined ? {} : { reason }) };
}

/** The r2 metrics of one request: the largest hit distance at a ray, and the counts. */
function geometry(hits: number, ray: number, rim: number, compared: number): ComparisonMetric[] {
  return [
    metric("hits.maxDistance", hits, "mm", { line: 0, field: 12.5, ray, surface: 4 }),
    metric("mask.mismatches", 0, "rays"),
    metric("mask.rimBand", rim, "rays", { line: 0, field: 12.5, ray: 1, surface: 2 }),
    metric("rays.compared", compared, "rays"),
  ];
}

function set(
  run: string,
  rung: string,
  request: string,
  mode: ComparisonSet["mode"],
  pairs: PairComparison[],
): ComparisonSet {
  const counts = (ok: number, blocked: number, failed: number) => ({
    "rays.ok": [ok],
    "rays.blocked": [blocked],
    "rays.failed": [failed],
  });
  const rays = rung === "r2";
  return {
    contract: "1.0",
    kind: "comparison",
    suite: "digest",
    run,
    caseId: CASE,
    rung,
    quantity: rung === "r1" ? "paraxial.first-order" : "rays.trace",
    requestId: request.repeat(64),
    participants: [
      { engine: "lv", fingerprint: "f".repeat(64), status: "ok", ...(rays ? { recorded: counts(40, 9, 1) } : {}) },
      { engine: "other", fingerprint: "o".repeat(64), status: "ok" },
      { engine: "ref", fingerprint: "e".repeat(64), status: "ok", ...(rays ? { recorded: counts(41, 9, 0) } : {}) },
    ],
    mode,
    ...(mode === "reference-vs-each" ? { reference: "lv" } : {}),
    pairs,
  };
}

const R1 = [metric("firstOrder.maxAbs", 2e-13, "mm", { quantity: "efl", line: 0 })];
const COMPARISONS: ComparisonFile = {
  contract: "1.0",
  kind: "comparison-file",
  suite: "digest",
  manifest: hashCanonical(MANIFEST),
  policy: hashCanonical(POLICY),
  comparisons: [
    set("wide", "r1", "1", "pairwise", [
      pair("lv", "other", "PASS", [metric("firstOrder.maxAbs", 9, "mm")]),
      pair("lv", "ref", "PASS", R1),
      pair("other", "ref", "FAIL", [metric("firstOrder.maxAbs", 9, "mm")]),
    ]),
    // Two requests of r2 for the first run, each in both modes: the pairwise one is the one that is read.
    set("wide", "r2", "2", "reference-vs-each", [
      pair("lv", "other", "PASS", geometry(7, 0, 0, 1)),
      pair("lv", "ref", "PASS", geometry(4e-9, 3, 0, 30)),
    ]),
    set("wide", "r2", "2", "pairwise", [pair("lv", "ref", "PASS", geometry(4e-9, 3, 0, 30))]),
    set("wide", "r2", "3", "pairwise", [pair("lv", "ref", "FLOOR", geometry(2.5e-8, 17, 2, 28), "a floor")]),
    // The second run was compared against a reference only, and named the other way round.
    set("tele", "r2", "4", "reference-vs-each", [pair("ref", "lv", "PASS", geometry(9e-9, 5, 1, 12))]),
    set("tele", "r2", "5", "reference-vs-each", [
      pair("ref", "lv", "FAIL", geometry(null as unknown as number, 6, 0, 3)),
    ]),
  ],
};

test("the engine with a floor and its arbiter are the policy's; a policy without a floor has none", () => {
  assert.deepEqual(floorOf(POLICY), FLOOR);
  const { r2: _r2, r3: _r3, ...rungs } = POLICY.rungs;
  assert.equal(floorOf({ ...POLICY, rungs }), undefined);
  const other: Policy = {
    ...POLICY,
    rungs: { ...POLICY.rungs, r3: { ...POLICY.rungs.r3, floor: { engine: "x", arbiter: "ref" } } },
  };
  assert.throws(() => floorOf(other), /the policy names more than one floor/);
  assert.deepEqual(floorFileNames("lv"), { json: "lv-floor.json", markdown: "lv-floor.md" });
  assert.deepEqual([...COUNT_UNITS], ["rays", "elements"]);
});

test("the digest holds the pairs of the two engines only: per run and rung the worst figure, the verdicts, the rays", () => {
  const report = buildFloorReport(MANIFEST, COMPARISONS, POLICY, FLOOR);
  assert.deepEqual(
    { kind: report.kind, contract: report.contract, suite: report.suite, policy: report.policy },
    {
      kind: "floor-report",
      contract: "1.0",
      suite: { name: "digest", hash: "5".repeat(64) },
      policy: { version: POLICY.version, hash: hashCanonical(POLICY) },
    },
  );
  // Who was compared: the hashes of each, and what each says of itself, which for LensVisualizer is its commit.
  assert.deepEqual(report.engine, {
    id: "lv",
    fingerprint: "f".repeat(64),
    adapterRevision: "a".repeat(64),
    details: { commit: "abc123", dirty: false, engineFileCount: 3 },
  });
  assert.deepEqual(report.arbiter, { id: "ref", fingerprint: "e".repeat(64), details: { sourceFiles: 12 } });
  // What was traced: each run that has a row, in the suite's order, by the content hash of its case.
  assert.deepEqual(report.runs, [
    { name: "wide", caseId: CASE },
    { name: "tele", caseId: TELE_CASE },
  ]);

  assert.deepEqual(
    report.rows.map((row) => [row.run, row.rung, row.requests, row.verdicts]),
    [
      ["wide", "r1", 1, [{ verdict: "PASS", count: 1 }]],
      [
        "wide",
        "r2",
        2,
        [
          { verdict: "PASS", count: 1 },
          { verdict: "FLOOR", count: 1 },
        ],
      ],
      [
        "tele",
        "r2",
        2,
        [
          { verdict: "PASS", count: 1 },
          { verdict: "FAIL", count: 1 },
        ],
      ],
    ],
  );
  // The pair of the third engine is no part of it: 9 mm and 7 mm are nowhere.
  assert.ok(!canonicalJson(report).includes(":9,") && !canonicalJson(report).includes(":7,"));

  const [, wide, tele] = report.rows;
  // A maximum is the largest over the requests, with its place and its tolerance; a count is the sum, without one.
  assert.deepEqual(wide.metrics, [
    {
      name: "hits.maxDistance",
      unit: "mm",
      value: 2.5e-8,
      where: { line: 0, field: 12.5, ray: 17, surface: 4 },
      tolerance: 1e-8,
    },
    { name: "mask.mismatches", unit: "rays", value: 0, tolerance: 0 },
    { name: "mask.rimBand", unit: "rays", value: 2 },
    { name: "rays.compared", unit: "rays", value: 58 },
  ]);
  // How the rays of each engine ended, added up over the two requests.
  assert.deepEqual(wide.rays, { lv: { ok: 80, blocked: 18, failed: 2 }, ref: { ok: 82, blocked: 18, failed: 0 } });
  // A value that is not a number makes the worst of its run not a number: nothing hides it.
  assert.deepEqual(tele.metrics[0], {
    name: "hits.maxDistance",
    unit: "mm",
    value: null,
    where: { line: 0, field: 12.5, ray: 6, surface: 4 },
    tolerance: 1e-8,
  });
  assert.equal(tele.metrics[2].value, 1);
  assert.equal(report.rows[0].rays, undefined);

  // Each rung over the whole suite: every pair, and each maximum with the run it occurs in.
  assert.deepEqual(
    report.rungs.map((rung) => [rung.rung, rung.quantity, rung.requests, rung.verdicts]),
    [
      ["r1", "paraxial.first-order", 1, [{ verdict: "PASS", count: 1 }]],
      [
        "r2",
        "rays.trace",
        4,
        [
          { verdict: "PASS", count: 2 },
          { verdict: "FLOOR", count: 1 },
          { verdict: "FAIL", count: 1 },
        ],
      ],
    ],
  );
  assert.deepEqual(report.rungs[0].metrics, [
    {
      name: "firstOrder.maxAbs",
      unit: "mm",
      value: 2e-13,
      where: { quantity: "efl", line: 0 },
      tolerance: 1e-9,
      run: "wide",
    },
  ]);
  assert.deepEqual(report.rungs[1].metrics[0].run, "tele");
  assert.equal(report.rungs[1].metrics[0].value, null);
  assert.deepEqual(report.rungs[1].metrics[3], { name: "rays.compared", unit: "rays", value: 73 });
});

test("the digest is the same for equal inputs, in the same bytes, and holds nothing but results and names", () => {
  const { json, markdown } = renderFloorReport(MANIFEST, COMPARISONS, POLICY, FLOOR);
  const again = renderFloorReport(
    structuredClone(MANIFEST),
    structuredClone(COMPARISONS),
    structuredClone(POLICY),
    FLOOR,
  );
  assert.deepEqual(again, { json, markdown });
  assert.equal(json, `${canonicalJson(buildFloorReport(MANIFEST, COMPARISONS, POLICY, FLOOR))}\n`);
  assert.equal(markdown, renderFloorMarkdown(JSON.parse(json)));
  for (const text of [json, markdown]) {
    assert.ok(text.endsWith("\n") && !text.endsWith("\n\n") && !text.includes("\r"));
    assert.ok(!text.includes("$nd") && !text.includes("/Users/"));
  }
});

test("the Markdown names the two engines with their hashes, then each rung's worst figures, then a row per run", () => {
  const markdown = renderFloorMarkdown(buildFloorReport(MANIFEST, COMPARISONS, POLICY, FLOOR));
  assert.deepEqual(
    markdown.split("\n").filter((line) => /^#{1,3} /.test(line)),
    [
      "# Numerical floor of lv against ref: digest",
      "## Inputs",
      "## Worst figures",
      "### r1",
      "### r2",
      "## By run",
      "### r1",
      "### r2",
    ],
  );
  assert.ok(
    markdown.includes(`| lv | ${"f".repeat(64)} | ${"a".repeat(64)} | commit abc123, dirty false, engineFileCount 3 |`),
  );
  assert.ok(markdown.includes(`| ref | ${"e".repeat(64)} | — | sourceFiles 12 |`));
  assert.ok(markdown.includes(`\n| Run | Case |\n|---|---|\n| wide | ${CASE} |\n| tele | ${TELE_CASE} |\n\n## Worst`));
  assert.ok(!markdown.includes("never-compared"));
  assert.match(markdown, /^\| Policy \| rungs v10 \|$/m);
  assert.match(markdown, /^Quantity `rays\.trace`: 4 pairs, 2 PASS, 1 FLOOR, 1 FAIL\.$/m);
  // The worst figure of a rung, with its run and its place; a count has neither.
  assert.match(markdown, /^\| firstOrder\.maxAbs \(≤ 1\.00e-9 mm\) \| 2\.00e-13 \| wide \| line 0, quantity efl \|$/m);
  assert.match(
    markdown,
    /^\| hits\.maxDistance \(≤ 1\.00e-8 mm\) \| not finite \| tele \| field 1\.25e1, line 0, ray 6, surface 4 \|$/m,
  );
  assert.match(markdown, /^\| rays\.compared \[rays\] \| 73 \| — \| — \|$/m);
  // A row per run, with the verdicts and each engine's rays.
  const header =
    "| Run | Requests | Verdicts | hits.maxDistance (≤ 1.00e-8 mm) | mask.mismatches (≤ 0 rays) | mask.rimBand [rays] | " +
    "rays.compared [rays] | lv rays ok / blocked / failed | ref rays ok / blocked / failed |";
  assert.ok(markdown.includes(`\n${header}\n`), markdown);
  assert.ok(markdown.includes("\n| wide | 2 | 1 PASS, 1 FLOOR | 2.50e-8 | 0 | 2 | 58 | 80 / 18 / 2 | 82 / 18 / 0 |\n"));
  assert.ok(
    markdown.includes("\n| tele | 2 | 1 PASS, 1 FAIL | not finite | 0 | 1 | 15 | 80 / 18 / 2 | 82 / 18 / 0 |\n"),
  );
  assert.ok(markdown.includes("\n| wide | 1 | 1 PASS | 2.00e-13 |\n"));
});

test("a run in which the two engines were not compared has no row, and an engine that was not run no hashes", () => {
  const none = buildFloorReport(MANIFEST, { ...COMPARISONS, comparisons: [] }, POLICY, FLOOR);
  assert.deepEqual([none.rows, none.rungs, none.runs], [[], [], []]);
  assert.match(renderFloorMarkdown(none), /## Worst figures\n\n## By run\n$/);
  assert.ok(!renderFloorMarkdown(none).includes("| Run | Case |"));
  const absent = buildFloorReport(MANIFEST, COMPARISONS, POLICY, { engine: "zemax", arbiter: "ref" });
  assert.deepEqual(absent.engine, { id: "zemax", fingerprint: null, details: {} });
  assert.deepEqual(absent.rows, []);
});
