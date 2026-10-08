// The report as a pure function: the model built from a hand-written manifest, comparisons and policy, and the
// Markdown laid out from it.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import type { ComparisonMetric } from "../../src/contract/comparison.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { renderReport } from "../../src/report/index.ts";
import { escapeCell, renderMarkdown } from "../../src/report/markdown.ts";
import { buildReport, reportInputProblems } from "../../src/report/model.ts";
import type { ReportModel } from "../../src/report/model.ts";
import { COMPARISONS, MANIFEST, POLICY } from "./handBuilt.ts";
import { goldenFile } from "./support.ts";

const MODEL = buildReport(MANIFEST, COMPARISONS, POLICY);
const MARKDOWN = renderMarkdown(MODEL);

/** The cells of every table row of the Markdown that starts with the given cell. */
function rowsStarting(markdown: string, first: string): string[][] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith(`| ${first} |`))
    .map((line) => line.slice(2, -2).split(/(?<!\\) \| /));
}

test("a cell cannot end its cell or its row: | and \\ are escaped and a line break becomes <br>", () => {
  assert.equal(escapeCell("a|b"), "a\\|b");
  assert.equal(escapeCell("||"), "\\|\\|");
  assert.equal(escapeCell("one\ntwo\r\nthree\rfour"), "one<br>two<br>three<br>four");
  assert.equal(escapeCell("C:\\dir\\|x"), "C:\\\\dir\\\\\\|x");
  assert.equal(escapeCell("plain text, 1.00e-12 ≤ — `code`"), "plain text, 1.00e-12 ≤ — `code`");
  assert.equal(escapeCell(""), "");
});

test("the hand-built report is its golden file, and renderReport gives the model and the Markdown", () => {
  assert.equal(MARKDOWN, readFileSync(goldenFile("hand-built"), "utf8"));
  const { json, markdown } = renderReport(MANIFEST, COMPARISONS, POLICY);
  assert.equal(markdown, MARKDOWN);
  assert.equal(json, `${canonicalJson(MODEL)}\n`);
  assert.deepEqual(JSON.parse(json), MODEL);
});

test("the Markdown has LF line endings, one newline at the end, and its sections in order", () => {
  assert.ok(!MARKDOWN.includes("\r"));
  assert.ok(MARKDOWN.endsWith("verdict in both.\n") && !MARKDOWN.endsWith("\n\n"));
  assert.deepEqual(
    MARKDOWN.split("\n").filter((line) => /^#{1,3} /.test(line)),
    [
      "# Comparison report: hand-built",
      "## Inputs",
      "### Engines",
      "### Runs",
      "## Verdict summary",
      "## Support matrix",
      "## Results",
      "### tele",
      "## How to read this",
    ],
  );
  assert.match(
    MARKDOWN,
    /^Only FAIL and ERROR fail a comparison\. FLOOR is a pass that is counted apart from PASS\. /m,
  );
});

test("every table row has as many cells as its header, whatever text its cells hold", () => {
  const lines = MARKDOWN.split("\n");
  let width = 0;
  let tables = 0;
  lines.forEach((line, index) => {
    if (!line.startsWith("|")) return void (width = 0);
    const cells = line.replaceAll("\\\\", "").replaceAll("\\|", "").split("|").length - 2;
    if (width === 0) {
      width = cells;
      tables++;
      assert.match(lines[index + 1], /^\|(---\|)+$/, line);
    }
    assert.equal(cells, width, line);
  });
  assert.equal(tables, 11);
});

test("text from the manifest and the comparisons is escaped where it enters a table", () => {
  assert.deepEqual(rowsStarting(MARKDOWN, "lv")[0], ["lv", "available", "0.9 \\| dev", "f".repeat(64)]);
  assert.deepEqual(rowsStarting(MARKDOWN, "optiland")[0], ["optiland", "available", "0.5.9", "operator<br>build"]);
  assert.deepEqual(rowsStarting(MARKDOWN, "zemax")[0], ["zemax", "unavailable: spawn-failed", "—", "—"]);
  assert.deepEqual(rowsStarting(MARKDOWN, "wide"), [
    ["wide", "—", "not started: lens fixture a\\|b.json: it cannot be read (ENOENT); second<br>problem"],
  ]);
  assert.match(MARKDOWN, /\| unsupported: feature surface\.asphere\.odd, option a\\\|b \|/);
});

test("the inputs name the suite, the contract version and the policy version", () => {
  assert.deepEqual(rowsStarting(MARKDOWN, "Suite"), [["Suite", "hand-built"]]);
  assert.deepEqual(rowsStarting(MARKDOWN, "Suite hash"), [["Suite hash", "5".repeat(64)]]);
  assert.deepEqual(rowsStarting(MARKDOWN, "Contract version"), [["Contract version", "1.0"]]);
  assert.deepEqual(rowsStarting(MARKDOWN, "Policy"), [["Policy", "rungs v3"]]);
  assert.deepEqual(MODEL.policy, { version: 3, hash: COMPARISONS.policy });
});

test("the summary counts the pairs of each mode by verdict, and says how many fail", () => {
  assert.deepEqual(MODEL.summary, [
    {
      mode: "reference-vs-each",
      counts: { PASS: 0, FLOOR: 0, FAIL: 0, RECORDED: 0, ATTENTION: 1, UNSUPPORTED: 0, BLOCKED: 1, ERROR: 1 },
    },
    {
      mode: "pairwise",
      counts: { PASS: 0, FLOOR: 0, FAIL: 0, RECORDED: 0, ATTENTION: 1, UNSUPPORTED: 1, BLOCKED: 0, ERROR: 2 },
    },
  ]);
  // A blocked pair is counted, and is not one of the failures: the rung that blocks it is.
  assert.equal(MODEL.failing, 3);
  assert.match(MARKDOWN, /^3 of 7 pairs are FAIL or ERROR\.$/m);
  assert.deepEqual(rowsStarting(MARKDOWN, "ATTENTION")[0], ["ATTENTION", "1", "1"]);
  assert.deepEqual(rowsStarting(MARKDOWN, "BLOCKED")[0], ["BLOCKED", "1", "0"]);
  assert.deepEqual(rowsStarting(MARKDOWN, "ERROR")[0], ["ERROR", "1", "2"]);

  const clean: ComparisonFile = { ...COMPARISONS, comparisons: COMPARISONS.comparisons.slice(2, 3) };
  const markdown = renderMarkdown(buildReport(MANIFEST, clean, POLICY));
  assert.match(markdown, /^No pair is FAIL or ERROR, of 1 compared\.$/m);
});

test("the support matrix has a row per request and a cell per engine, from the manifest alone", () => {
  assert.deepEqual(rowsStarting(MARKDOWN, "tele").slice(1), [
    ["tele", "r5, request 1 of 2", "ok", "ok", "error: spawn-failed"],
    ["tele", "r5, request 2 of 2", "ok", "unsupported: feature surface.asphere.odd, option a\\|b", "—"],
    ["tele", "r0", "ok", "pending", "—"],
    ["tele", "r1", "ok", "ok", "—"],
  ]);
  const nothingCompared = buildReport(MANIFEST, { ...COMPARISONS, comparisons: [] }, POLICY);
  assert.deepEqual(nothingCompared.support, MODEL.support);
  assert.deepEqual(nothingCompared.sections, []);
  assert.match(renderMarkdown(nothingCompared), /^## Results\n\nNothing was compared\.$/m);
});

test("a section has the policy's metrics by name, then any other, each with its limit and unit", () => {
  const [first, second, third] = MODEL.sections;
  assert.deepEqual(first.columns, [
    { name: "mtf.maxAbs", unit: "1", limit: 0.005, limitKind: "attention" },
    { name: "spot.rms", unit: "mm" },
    { name: "extra.count", unit: "rays" },
  ]);
  assert.match(
    MARKDOWN,
    /^\| Engine \| mtf\.maxAbs \(band 5\.00e-3\) \| spot\.rms \[mm\] \| extra\.count \[rays\] \| Verdict \| Note \|$/m,
  );
  assert.deepEqual([first.request, second.request, third.request], ["request 1 of 2", "request 2 of 2", null]);
  assert.deepEqual([first.mode, first.class], ["independent-method", "recorded"]);
  // A rung the policy has no entry for is shown without limits, and says so.
  assert.deepEqual([third.mode, third.class, third.columns], [null, null, []]);
  assert.match(MARKDOWN, /^Quantity `system\.describe`, the policy has no entry for this rung\. /m);
  assert.match(MARKDOWN, /^Reference vs each, against `lv`:\n\nNo other engine was compared\.$/m);
});

test("a gated metric shows its tolerance with its unit", () => {
  const gated: ComparisonFile = {
    ...COMPARISONS,
    comparisons: [{ ...COMPARISONS.comparisons[2], rung: "r2", quantity: "rays.trace" }],
  };
  const model = buildReport(MANIFEST, gated, POLICY);
  assert.deepEqual(model.sections[0].columns, [{ name: "hits.max", unit: "mm", limit: 0, limitKind: "tolerance" }]);
  const policy = { ...POLICY, rungs: { r2: POLICY.rungs.r2 } };
  const set = { ...COMPARISONS.comparisons[0], rung: "r2", quantity: "rays.trace" };
  const markdown = renderMarkdown(buildReport(MANIFEST, { ...COMPARISONS, comparisons: [set] }, policy));
  assert.match(
    markdown,
    /^\| Engine \| hits\.max \(≤ 0 mm\) \| mtf\.maxAbs \| spot\.rms \[mm\] \| extra\.count \[rays\] \|/m,
  );
});

test("a floor is a verdict of its own: counted apart from PASS, no failure, with its limit in the metric's heading", () => {
  const floor = { limit: 1e-7, agreement: 1e-10 };
  const r2 = {
    quantity: "rays.trace",
    mode: "identical-rays",
    class: "gated",
    metrics: {
      "hits.maxDistance": { tolerance: 1e-8, unit: "mm", floor },
      "direction.maxAbs": { tolerance: 1e-9, unit: "1" },
      "opd.maxAbs": { tolerance: 2e-5, unit: "waves", floor: { limit: 2e-4, agreement: 1e-7 } },
    },
    floor: { engine: "lv", arbiter: "optiland" },
  } as const;
  const reason =
    "hits.maxDistance 2.50e-8 exceeds its tolerance 1.00e-8 at ray 4, surface 6; floor of lv: lv against optiland " +
    "hits.maxDistance 2.50e-8 within 1.00e-7";
  const metrics: ComparisonMetric[] = [
    { name: "hits.maxDistance", value: 2.5e-8, unit: "mm", where: { ray: 4, surface: 6 } },
    { name: "direction.maxAbs", value: 3e-10, unit: "1", where: { ray: 4 } },
    { name: "mask.rimBand", value: 2, unit: "rays", where: { ray: 9, surface: 1 } },
  ];
  const pair = { a: "lv", b: "optiland", metrics, class: "gated", verdict: "FLOOR", reason } as const;
  const sets = [0, 1].map((index) => ({
    ...COMPARISONS.comparisons[index],
    rung: "r2",
    quantity: "rays.trace",
    pairs: [pair],
  }));
  const model = buildReport(MANIFEST, { ...COMPARISONS, comparisons: sets }, { ...POLICY, rungs: { r2 } });
  const markdown = renderMarkdown(model);

  // The floor limit is in the heading of each metric that has one, after its tolerance; a metric of the policy
  // that no pair measured has a column and an empty cell, and one the policy does not name comes last.
  assert.deepEqual(model.sections[0].columns, [
    { name: "direction.maxAbs", unit: "1", limit: 1e-9, limitKind: "tolerance" },
    { name: "hits.maxDistance", unit: "mm", limit: 1e-8, limitKind: "tolerance", floorLimit: 1e-7 },
    { name: "opd.maxAbs", unit: "waves", limit: 2e-5, limitKind: "tolerance", floorLimit: 2e-4 },
    { name: "mask.rimBand", unit: "rays" },
  ]);
  assert.match(
    markdown,
    /^\| Engine \| direction\.maxAbs \(≤ 1\.00e-9\) \| hits\.maxDistance \(≤ 1\.00e-8 mm; floor ≤ 1\.00e-7\) \| opd\.maxAbs \(≤ 2\.00e-5 waves; floor ≤ 2\.00e-4\) \| mask\.rimBand \[rays\] \| Verdict \| Note \|$/m,
  );
  assert.deepEqual(rowsStarting(markdown, "optiland")[1], [
    "optiland",
    "3.00e-10 at ray 4",
    "2.50e-8 at ray 4, surface 6",
    "—",
    "2 at ray 9, surface 1",
    "FLOOR",
    reason,
  ]);
  // Counted apart from PASS, in its own row, and not one of the failures.
  assert.deepEqual(
    model.summary.map(({ counts }) => [counts.PASS, counts.FLOOR, counts.FAIL]),
    [
      [0, 1, 0],
      [0, 1, 0],
    ],
  );
  assert.equal(model.failing, 0);
  assert.match(markdown, /^No pair is FAIL or ERROR, of 2 compared\.$/m);
  assert.deepEqual(rowsStarting(markdown, "PASS")[0], ["PASS", "0", "0"]);
  assert.deepEqual(rowsStarting(markdown, "FLOOR")[0], ["FLOOR", "1", "1"]);
  assert.match(
    markdown,
    /^\| FLOOR \| A gated rung: a judged metric is above its tolerance by the known numerical floor /m,
  );
  // The pairwise matrix names the metric furthest past its tolerance.
  assert.deepEqual(rowsStarting(markdown, "lv")[1], [
    "lv",
    "—",
    "FLOOR (hits.maxDistance 2.50e-8 at ray 4, surface 6)",
    "—",
  ]);
});

test("an engine of the comparator's own is listed with its adapter revision; a report without one has no column", () => {
  assert.deepEqual(rowsStarting(MARKDOWN, "Engine")[0], ["Engine", "Status", "Version", "Fingerprint"]);
  assert.ok(MODEL.engines.every((engine) => !Object.hasOwn(engine, "adapterRevision")));
  const [lv, ...others] = MANIFEST.engines;
  const adapted = { ...MANIFEST, engines: [{ ...lv, adapterRevision: "a".repeat(64) }, ...others] };
  const model = buildReport(adapted, COMPARISONS, POLICY);
  assert.deepEqual(model.engines[0], {
    id: "lv",
    status: "available",
    version: "0.9 | dev",
    fingerprint: "f".repeat(64),
    adapterRevision: "a".repeat(64),
  });
  const markdown = renderMarkdown(model);
  assert.deepEqual(rowsStarting(markdown, "Engine")[0], [
    "Engine",
    "Status",
    "Version",
    "Fingerprint",
    "Adapter revision",
  ]);
  assert.deepEqual(rowsStarting(markdown, "lv")[0], ["lv", "available", "0.9 \\| dev", "f".repeat(64), "a".repeat(64)]);
  // An engine without one, and one that could not be used, have nothing to state there.
  assert.deepEqual(rowsStarting(markdown, "optiland")[0].at(-1), "—");
  assert.deepEqual(rowsStarting(markdown, "zemax")[0], ["zemax", "unavailable: spawn-failed", "—", "—", "—"]);
});

test("a column shows the limit its rung is judged by: the band of a recorded rung, the tolerance of a gated one", () => {
  const limits = { tolerance: 1e-9, attention: 0.005, unit: "1" };
  const columnsOf = (rungClass: "gated" | "recorded"): unknown => {
    const r5 = { ...POLICY.rungs.r5, mode: "direct" as const, class: rungClass, metrics: { "mtf.maxAbs": limits } };
    return buildReport(MANIFEST, COMPARISONS, { ...POLICY, rungs: { r5 } }).sections[0].columns[0];
  };
  assert.deepEqual(columnsOf("recorded"), { name: "mtf.maxAbs", unit: "1", limit: 0.005, limitKind: "attention" });
  assert.deepEqual(columnsOf("gated"), { name: "mtf.maxAbs", unit: "1", limit: 1e-9, limitKind: "tolerance" });
});

test("numbers are laid out by the number formatter: three digits, 'not finite' for null, an index without exponent", () => {
  const [row] = MODEL.sections[0].referenceVsEach?.rows ?? [];
  assert.deepEqual(
    row.metrics.map((metric) => metric?.value),
    [0.0125, 0.00042, null],
  );
  assert.deepEqual(rowsStarting(MARKDOWN, "optiland")[1], [
    "optiland",
    "1.25e-2 at field 14 deg, frequencyPerMm 40, line 5.00e-1",
    "4.20e-4",
    "not finite at index 12",
    "ATTENTION",
    "mtf.maxAbs 1.25e-2 is outside its attention band 5.00e-3 at field 14 deg, frequencyPerMm 40, line 5.00e-1",
  ]);
  assert.deepEqual(rowsStarting(MARKDOWN, "zemax")[1], [
    "zemax",
    "—",
    "—",
    "—",
    "ERROR",
    "zemax ended as error (spawn-failed)",
  ]);
});

test("a whole number is written in full, so a count and a limit of 0 read as what they are", () => {
  const counting = { quantity: "system.describe", mode: "direct", class: "gated" } as const;
  const policy = {
    ...POLICY,
    rungs: { r0: { ...counting, metrics: { "shape.mismatches": { tolerance: 0, unit: "elements" } } } },
  };
  const metrics: ComparisonMetric[] = [
    { name: "shape.mismatches", value: 12, unit: "elements", where: { field: "curvature", surface: 4 } },
    { name: "sag.maxAbs", value: 2.5e-7, unit: "mm", where: { sample: 8, surface: 4 } },
  ];
  const reason = "shape.mismatches 12 exceeds its tolerance 0 at field curvature, surface 4";
  const pair = { a: "lv", b: "optiland", metrics, class: "gated", verdict: "FAIL", reason } as const;
  const set = { ...COMPARISONS.comparisons[0], rung: "r0", quantity: "system.describe", pairs: [pair] };
  const markdown = renderMarkdown(buildReport(MANIFEST, { ...COMPARISONS, comparisons: [set] }, policy));
  assert.match(
    markdown,
    /^\| Engine \| shape\.mismatches \(≤ 0 elements\) \| sag\.maxAbs \[mm\] \| Verdict \| Note \|$/m,
  );
  assert.deepEqual(rowsStarting(markdown, "optiland")[1], [
    "optiland",
    "12 at field curvature, surface 4",
    "2.50e-7 at sample 8, surface 4",
    "FAIL",
    reason,
  ]);
});

test("a blocked pair is a row with its reason, and no metric", () => {
  const section = MODEL.sections[3];
  assert.deepEqual([section.rung, section.mode, section.class], ["r1", "direct", "gated"]);
  assert.deepEqual(section.referenceVsEach, {
    reference: "lv",
    rows: [
      {
        engine: "optiland",
        metrics: [null],
        verdict: "BLOCKED",
        reason: "not judged: rung r0 failed for lv and optiland on this case",
      },
    ],
  });
  assert.deepEqual(rowsStarting(MARKDOWN, "optiland").at(-1), [
    "optiland",
    "—",
    "BLOCKED",
    "not judged: rung r0 failed for lv and optiland on this case",
  ]);
  assert.match(MARKDOWN, /^\| BLOCKED \| Both engines answered and the pair is not judged: /m);
});

test("recorded values are listed side by side: a row per element, a column per engine, nothing judged", () => {
  // Only an answer that records something has a table.
  assert.deepEqual(
    MODEL.sections.map((section) => section.recorded === null),
    [true, true, true, false],
  );
  assert.deepEqual(MODEL.sections[3].recorded, {
    engines: ["lv", "optiland"],
    rows: [
      { name: "epZ|RelStop", index: 0, cells: [{ value: -12.5 }, null] },
      { name: "epZ|RelStop", index: 1, cells: [{ value: null }, null] },
      { name: "magnification", index: 0, cells: [{ value: -0.25 }, { value: -0.2500000004 }] },
      { name: "magnification", index: 1, cells: [{ value: -0.2501 }, null] },
    ],
  });
  assert.match(MARKDOWN, /^Recorded values, as each engine reports them\. They are listed and never judged:$/m);
  assert.deepEqual(rowsStarting(MARKDOWN, "Value"), [["Value", "lv", "optiland"]]);
  // Nine digits, a name escaped like any text, and the two ways a cell has no number.
  assert.deepEqual(rowsStarting(MARKDOWN, "epZ\\|RelStop[0]"), [["epZ\\|RelStop[0]", "-1.25000000e1", "—"]]);
  assert.deepEqual(rowsStarting(MARKDOWN, "epZ\\|RelStop[1]"), [["epZ\\|RelStop[1]", "not finite", "—"]]);
  assert.deepEqual(rowsStarting(MARKDOWN, "magnification[0]"), [
    ["magnification[0]", "-2.50000000e-1", "-2.50000000e-1"],
  ]);
  assert.deepEqual(rowsStarting(MARKDOWN, "magnification[1]"), [["magnification[1]", "-2.50100000e-1", "—"]]);
});

test("the pairwise matrix is symmetric, empty on its diagonal, and names the judged metric nearest its limit", () => {
  const pairwise = MODEL.sections[0].pairwise;
  assert.ok(pairwise !== null);
  assert.deepEqual(pairwise.engines, ["lv", "optiland", "zemax"]);
  pairwise.cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      assert.deepEqual(cell, pairwise.cells[j][i]);
      assert.equal(cell === null, i === j);
    });
  });
  // The metric that is not finite has no limit, so the one outside its band is the worst.
  assert.equal(pairwise.cells[0][1]?.worst?.name, "mtf.maxAbs");
  assert.deepEqual(pairwise.cells[0][2], { verdict: "ERROR", worst: null });
  const worst = "ATTENTION (mtf.maxAbs 1.25e-2 at field 14 deg, frequencyPerMm 40, line 5.00e-1)";
  assert.deepEqual(rowsStarting(MARKDOWN, "lv")[1], ["lv", "—", worst, "ERROR"]);
  assert.deepEqual(rowsStarting(MARKDOWN, "optiland")[2], ["optiland", worst, "—", "ERROR"]);
  // A request compared in one mode has only that table.
  assert.equal(MODEL.sections[1].referenceVsEach, null);
  assert.equal(MODEL.sections[2].pairwise, null);
});

test("the worst metric is the one furthest past its limit, in units of the limit; a judged NaN is the worst of all", () => {
  const pair = (metrics: { name: string; value: number | null; unit: string }[]): ReportModel => {
    const set = { ...COMPARISONS.comparisons[1], pairs: [{ ...COMPARISONS.comparisons[1].pairs[0], metrics }] };
    const policy = {
      ...POLICY,
      rungs: {
        r5: {
          ...POLICY.rungs.r5,
          metrics: {
            a: { attention: 10, unit: "1" },
            b: { attention: 0.1, unit: "1" },
            c: { attention: 0, unit: "1" },
          },
        },
      },
    };
    return buildReport(MANIFEST, { ...COMPARISONS, comparisons: [set] }, policy);
  };
  const worstOf = (model: ReportModel): string | undefined => model.sections[0].pairwise?.cells[0][1]?.worst?.name;
  const metric = (name: string, value: number | null) => ({ name, value, unit: "1" });
  assert.equal(worstOf(pair([metric("a", 5), metric("b", 0.09), metric("c", 0)])), "b");
  assert.equal(worstOf(pair([metric("a", 5), metric("b", 0.01), metric("c", 0)])), "a");
  assert.equal(worstOf(pair([metric("a", 5), metric("b", 0.09), metric("c", 1e-300)])), "c");
  assert.equal(worstOf(pair([metric("a", null), metric("b", 99), metric("c", 0)])), "a");
  // Exact ties, with the metrics given in the other order than the columns: the earlier column wins.
  assert.equal(worstOf(pair([metric("c", 0), metric("a", 0)])), "a", "two metrics at 0 of their limits");
  assert.equal(worstOf(pair([metric("b", null), metric("a", null)])), "a", "two metrics that are not finite");
  assert.equal(worstOf(pair([metric("c", 1e-300), metric("b", null)])), "b", "not finite, and past a limit of 0");
  assert.equal(worstOf(pair([metric("unjudged", 1e9), metric("b", 0)])), "b");
  assert.equal(worstOf(pair([metric("unjudged", 1e9)])), "unjudged");
});

test("the model is the same for equal inputs, and holds nothing of the engines' own details", () => {
  const again = buildReport(structuredClone(MANIFEST), structuredClone(COMPARISONS), structuredClone(POLICY));
  assert.equal(canonicalJson(again), canonicalJson(MODEL));
  assert.ok(!canonicalJson(MODEL).includes("commit"));
  assert.deepEqual(MODEL.engines[2], { id: "zemax", status: "unavailable", code: "spawn-failed" });
});

test("comparisons made from another manifest, or judged by another policy, do not belong in a report", () => {
  assert.deepEqual(reportInputProblems(MANIFEST, COMPARISONS, POLICY), []);
  const otherManifest = { ...MANIFEST, suite: { ...MANIFEST.suite, hash: "6".repeat(64) } };
  const otherPolicy = { ...POLICY, version: 4 };
  assert.deepEqual(reportInputProblems(otherManifest, COMPARISONS, otherPolicy), [
    "the comparisons were made from another manifest",
    "the comparisons were judged by another policy",
  ]);
});
