// Rung R5 from end to end on stand-ins (`r5Fixture.ts`): what is asked, what is asked again, what each pair and
// each row comes to, and the report as a golden file. Hermetic: no LensVisualizer, no optiland.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { manifestText } from "../../src/core/manifest.ts";
import { renderMarkdown } from "../../src/report/markdown.ts";
import { buildReport } from "../../src/report/model.ts";
import type { MtfComparison, MtfComparisonRow } from "../../src/report/mtfComparison.ts";
import { MTF_SHOWN_FREQUENCIES } from "../../src/report/mtfComparison.ts";
import { NOT_COVERED, wordingProblems } from "../../src/report/wording.ts";
import { tempDir } from "../core/support.ts";
import { CHIEF_LANDING_LIMIT_MM, OFF_AXIS_BAND, ON_AXIS_BAND, R5_GOLDEN, R5_POLICY, r5Cycle } from "./r5Fixture.ts";
import { goldenFile } from "./support.ts";

test("optiland is asked again once, at 512 rays, for the run whose figure is outside its band, and for no other", async (t) => {
  const runsDir = tempDir(t);
  const { outcomes, watched, manifest } = await r5Cycle(runsDir);
  assert.deepEqual(
    outcomes.map(({ job }) => `${job.run} ${job.engine}${job.step === undefined ? "" : ` +${job.step}`} ${job.status}`),
    [
      "edge lv ok",
      "edge optiland ok",
      "edge wave ok",
      "beyond lv ok",
      "beyond optiland ok",
      "beyond wave ok",
      "beyond optiland +fft512 ok",
      "polychromatic lv ok",
      "polychromatic optiland unsupported",
      "polychromatic wave ok",
    ],
  );
  const asked = watched.requests.filter((_request, index) => watched.ran[index] === "optiland");
  assert.deepEqual(
    asked.map((request) => request.engineOptions),
    [undefined, undefined, { fftRays: 512 }, undefined],
  );
  // The second question is the first request again: one id, another store entry.
  const [first, again] = manifest.jobs.filter((job) => job.run === "beyond" && job.engine === "optiland");
  assert.equal(again.requestId, first.requestId);
  assert.notEqual(again.storeKey, first.storeKey);

  // A second run asks no engine anything and writes the same manifest: whether a step is asked is in the answers.
  const second = await r5Cycle(runsDir);
  assert.deepEqual(second.watched.ran, []);
  assert.equal(manifestText(second.manifest), manifestText(manifest));
});

test("each pair of the three is RECORDED, marked for ATTENTION or UNSUPPORTED, and none is an error", async (t) => {
  const { comparisons } = await r5Cycle(tempDir(t));
  const verdicts = comparisons.comparisons
    .filter((set) => set.mode === "pairwise")
    .map((set) => `${set.run}: ${set.pairs.map((pair) => `${pair.a}-${pair.b} ${pair.verdict}`).join(", ")}`);
  assert.deepEqual(verdicts, [
    "edge: lv-optiland RECORDED, lv-wave RECORDED, optiland-wave RECORDED",
    "beyond: lv-optiland ATTENTION, lv-wave RECORDED, optiland-wave ATTENTION",
    "polychromatic: lv-optiland UNSUPPORTED, lv-wave RECORDED, optiland-wave UNSUPPORTED",
  ]);
  // No engine is a participant twice: the step is its engine's, and its values stand beside the first answer's.
  for (const set of comparisons.comparisons) {
    assert.deepEqual(
      set.participants.map((participant) => participant.engine),
      ["lv", "optiland", "wave"],
    );
  }
  const beyond = comparisons.comparisons.find((set) => set.run === "beyond" && set.mode === "pairwise");
  const optiland = beyond?.participants.find((participant) => participant.engine === "optiland")?.recorded ?? {};
  assert.deepEqual(optiland.numRays, [256, 256, 256]);
  assert.deepEqual(optiland["numRays#fft512"], [512, 512, 512]);
  const pair = beyond?.pairs.find(({ a, b }) => a === "lv" && b === "optiland");
  const value = (name: string) => pair?.metrics.find((metric) => metric.name === name)?.value;
  // One unit in the last place of the band beyond it, at either step; the field at 0.5 is two image points.
  assert.equal(value("mtfOnAxis.maxAbs"), ON_AXIS_BAND * (1 + 2 ** -40));
  assert.equal(value("mtfOnAxis.firstStepMaxAbs"), ON_AXIS_BAND * (1 + 2 ** -40));
  assert.equal(value("chiefLanding.maxAbs"), 2 * CHIEF_LANDING_LIMIT_MM);
  assert.equal(value("mtfOffAxis.maxAbs"), 1 / 512);
  assert.equal(value("mtfOffAxis.firstStepMaxAbs"), 0);
  assert.equal(value("fields.data"), 1);
});

function tableOf(mtf: MtfComparison | undefined) {
  assert.ok(mtf !== undefined);
  const row = (field: number, cut: string, frequencyPerMm: number): MtfComparisonRow => {
    const found = mtf.rows.find((r) => r.field === field && r.cut === cut && r.frequencyPerMm === frequencyPerMm);
    assert.ok(found !== undefined, `${field} ${cut} ${frequencyPerMm}`);
    return found;
  };
  return { mtf, row };
}

test("the table has a row per field, cut and frequency, with the difference, its status and its class", async (t) => {
  const { manifest, comparisons } = await r5Cycle(tempDir(t));
  const model = buildReport(manifest, comparisons, R5_POLICY);
  assert.deepEqual(buildReport(manifest, comparisons, R5_POLICY), model, "a pure function");
  const [edge, beyond, polychromatic] = model.sections.map((section) => tableOf(section.mtf));
  assert.deepEqual(MTF_SHOWN_FREQUENCIES, [10, 30, 50]);

  // Three fields, two cuts and the four frequencies of the request; the report shows three of the four.
  assert.equal(edge.mtf.rows.length, 24);
  assert.equal(edge.mtf.rows.filter((row) => row.shown).length, 18);
  assert.deepEqual(edge.mtf.columns, [
    { engine: "lv", step: null, judged: true },
    { engine: "optiland", step: null, judged: true },
    { engine: "wave", step: null, judged: false },
  ]);
  assert.deepEqual(edge.mtf.bands, {
    onAxis: ON_AXIS_BAND,
    offAxis: OFF_AXIS_BAND,
    chiefLandingMm: CHIEF_LANDING_LIMIT_MM,
  });

  // At the edge of a band a row is RECORDED: on the axis and off it, each by its own band.
  const onAxis = edge.row(0, "sagittal", 10);
  assert.deepEqual(
    [onAxis.difference, onAxis.band, onAxis.status, onAxis.class],
    [ON_AXIS_BAND, ON_AXIS_BAND, "RECORDED", "method"],
  );
  assert.deepEqual(onAxis.values, [0.875, 0.875 - ON_AXIS_BAND, 0.875]);
  const offAxis = edge.row(0.5, "tangential", 30);
  assert.deepEqual([offAxis.difference, offAxis.band, offAxis.status], [OFF_AXIS_BAND, OFF_AXIS_BAND, "RECORDED"]);
  // A field optiland lost a rim ray of is set aside: its difference is shown, apart, and held to no band.
  const lost = edge.row(1, "sagittal", 50);
  assert.deepEqual([lost.difference, lost.band, lost.status, lost.class], [-0.125, null, "SET ASIDE", "method"]);
  assert.deepEqual(
    edge.mtf.fields.map((field) => [field.rimRaysLost, field.rimLandingSpreadMm]),
    [
      [0, null],
      [0, null],
      [1, 4.5],
    ],
  );
  assert.deepEqual(
    edge.mtf.fields.map((field) => `${field.field} ${field.class} ${field.reason} ${field.flags.join("/")}`),
    ["0 method two-methods ok/ok/ok", "0.5 method two-methods ok/ok/ok", "1 method rim-rays-lost ok/ok/unconverged"],
  );

  // One unit in the last place beyond the band is ATTENTION, and the difference is of optiland's last step.
  assert.deepEqual(
    beyond.mtf.columns.map((column) => `${column.engine} ${column.step} ${column.judged}`),
    ["lv null true", "optiland null false", "optiland fft512 true", "wave null false"],
  );
  const marked = beyond.row(0, "sagittal", 50);
  assert.deepEqual(
    [marked.difference, marked.band, marked.status],
    [ON_AXIS_BAND * (1 + 2 ** -40), ON_AXIS_BAND, "ATTENTION"],
  );
  assert.equal(beyond.row(0, "sagittal", 10).status, "RECORDED");
  const stepped = beyond.row(1, "tangential", 70);
  assert.deepEqual(stepped.values, [0.25, 0.25, 0.25 + 1 / 512, 0.25]);
  assert.deepEqual([stepped.difference, stepped.status, stepped.shown], [-1 / 512, "RECORDED", false]);
  // The field whose chief rays land apart shows the values and no difference.
  const apart = beyond.mtf.fields[1];
  assert.deepEqual(
    [apart.class, apart.reason, apart.chiefLandingMm],
    ["data", "chief-landing-apart", 2 * CHIEF_LANDING_LIMIT_MM],
  );
  for (const row of beyond.mtf.rows.filter((candidate) => candidate.field === 0.5)) {
    assert.deepEqual([row.difference, row.band, row.status, row.class], [null, null, "SET ASIDE", "data"]);
    assert.ok(row.values.every((value) => value !== null));
  }

  // An engine that cannot answer leaves rows that say so, with the other engines' values.
  assert.equal(polychromatic.mtf.pair.verdict, "UNSUPPORTED");
  assert.equal(polychromatic.mtf.pair.reason, "optiland is unsupported (feature lines.polychromatic)");
  for (const row of polychromatic.mtf.rows) {
    assert.deepEqual(
      [row.status, row.class, row.difference, row.values[1]],
      ["UNSUPPORTED", "unsupported", null, null],
    );
    assert.ok(row.values[0] !== null && row.values[2] !== null);
  }
  assert.deepEqual(
    polychromatic.mtf.fields.map((field) => field.class),
    [null, null, null],
  );
});

test("the report of the stand-ins is its golden file, claims nothing it may not, and names what is not covered", async (t) => {
  const { manifest, comparisons, report } = await r5Cycle(tempDir(t));
  assert.equal(
    report.markdown,
    readFileSync(goldenFile(R5_GOLDEN), "utf8"),
    "the report is not the golden file; if it is meant to change, run node test/report/writeGolden.ts",
  );
  assert.equal(renderMarkdown(buildReport(manifest, comparisons, R5_POLICY)), report.markdown);
  assert.deepEqual(wordingProblems(report.markdown), []);
  const model = JSON.parse(report.json) as { notCovered: string[] };
  assert.deepEqual(model.notCovered, [...NOT_COVERED]);
  const block = report.markdown.slice(
    report.markdown.indexOf("\n## Not covered\n"),
    report.markdown.indexOf("\n## How to read this\n"),
  );
  for (const sentence of NOT_COVERED) assert.ok(block.includes(`- ${sentence}\n`), sentence);
  // The table is of the shown frequencies; the model holds them all.
  assert.match(
    report.markdown,
    /^\| 0 \| sagittal \| 50 \| 0\.5000 \| 0\.4961 \| 0\.4961 \| 0\.5000 \| 3\.91e-3 \| ATTENTION \| method \|$/m,
  );
  assert.doesNotMatch(report.markdown, /^\| 1 \| tangential \| 70 \|/m);
  assert.match(report.markdown, /^### The engines' own MTF$/m);
});
