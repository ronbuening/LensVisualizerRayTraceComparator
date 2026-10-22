// Rung R5g from end to end on stand-ins (`r5gFixture.ts`): the machinery of rung R5 on the geometric MTF. What is
// asked, what is asked again, what each pair and each row comes to, and the report as a golden file. Hermetic: no
// LensVisualizer, no optiland.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { COMPARATORS } from "../../src/compare/index.ts";
import { R5G_FOLLOW_UP_OPTIONS, R5G_FOLLOW_UP_STEP, followUpsOf } from "../../src/compare/followUp.ts";
import { mtfGeometricComparator, mtfNativeComparator } from "../../src/compare/mtfNative.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData } from "../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { waveFrequencies } from "../../src/core/mtfRecipe.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import type { MtfRecipe } from "../../src/core/mtfRecipe.ts";
import { R4F_ENGINES, R5G_ENGINES, geometricFieldMtfSpecs, r5Rung, r5gRung } from "../../src/core/rungs.ts";
import { renderMarkdown } from "../../src/report/markdown.ts";
import { buildReport } from "../../src/report/model.ts";
import type { MtfComparisonRow } from "../../src/report/mtfComparison.ts";
import {
  GEOMETRIC_SAMPLING,
  GEOMETRIC_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  NOT_COVERED,
  wordingProblems,
} from "../../src/report/wording.ts";
import { answer, raised } from "../compare/mtfNativeSupport.ts";
import { SINGLET, suiteOf, tempDir, watchedRegistry } from "../core/support.ts";
import { CHIEF_LANDING_LIMIT_MM, OFF_AXIS_BAND, ON_AXIS_BAND } from "./r5Fixture.ts";
import { GEOMETRIC_SPEC, R5G_FIXTURE_RUNG, R5G_GOLDEN, R5G_POLICY, geometricStandIns, r5gCycle } from "./r5gFixture.ts";
import { goldenFile } from "./support.ts";

test("r5g has the comparator of r5, made for it, the bands of r5 in the policy, and a follow-up of its own", () => {
  assert.deepEqual([mtfGeometricComparator.quantity, mtfGeometricComparator.rung], ["mtf.native", "r5g"]);
  assert.equal(COMPARATORS.get("mtf.native", "r5g"), mtfGeometricComparator);
  assert.equal(mtfGeometricComparator.compare, mtfNativeComparator.compare);
  assert.deepEqual(mtfGeometricComparator.metrics, mtfNativeComparator.metrics);
  const policy = loadPolicy();
  // The bands of r5; the limit on the chief rays' landing is the rung's own, a micrometre (the plan's Amendments).
  const [r5, r5g]: RungPolicy[] = [policy.rungs.r5, policy.rungs.r5g];
  assert.deepEqual(
    [r5g.metrics["mtfOnAxis.maxAbs"].attention, r5g.metrics["mtfOffAxis.maxAbs"].attention],
    [0.005, 0.01],
  );
  assert.deepEqual(r5g, { ...r5, metrics: { ...r5.metrics, "chiefLanding.maxAbs": { attention: 1e-3, unit: "mm" } } });
  assert.deepEqual([policy.rungs.r5g.mode, policy.rungs.r5g.class], ["independent-method", "recorded"]);
  assert.deepEqual(
    followUpsOf(policy).map(({ rung, engine, step, options }) => [rung, engine, step, options]),
    [
      ["r5", "optiland", "fft512", { fftRays: 512 }],
      ["r5g", "optiland", R5G_FOLLOW_UP_STEP, R5G_FOLLOW_UP_OPTIONS],
    ],
  );
  assert.deepEqual([R5G_FOLLOW_UP_STEP, R5G_FOLLOW_UP_OPTIONS], ["geo512", { geometricRays: 512 }]);
  assert.deepEqual(
    followUpsOf(R5G_POLICY).map((followUp) => followUp.rung),
    ["r5g"],
  );
});

test("r5g asks one request a field for the geometric MTF, at the fields and frequencies of r5, and hands optiland each angle", () => {
  assert.deepEqual([r5gRung.quantity, r5gRung.needsRecipe, r5gRung.onlyWhereNamed], ["mtf.native", true, true]);
  assert.deepEqual(r5gRung.engines, ["lv", "optiland", "replay"]);
  assert.equal(r5gRung.engines, R5G_ENGINES);
  // Synthetic: five fields with angles that are no multiple of each other, so that their order shows, and thirteen
  // frequencies, which are thinned to eleven as for r5.
  const frequenciesPerMm = Array.from({ length: 13 }, (_, index) => 5 * index);
  const recipe = {
    source: "lv",
    frequenciesPerMm,
    fields: [0, 0.25, 0.5, 0.75, 1].map((fraction, index) => ({
      fraction,
      angleDeg: [0, 3.5, 7.25, 10.125, 13.5][index],
      targetImageHeightMm: 16 * fraction,
    })),
  } as unknown as MtfRecipe;
  const run = { name: "run", sampling: { lvGridCap: 64 } } as Parameters<typeof r5gRung.buildRequests>[1];
  const inputs = { raySets: [], recipe };
  const requests = r5gRung.buildRequests(SINGLET, run, inputs);
  const [diffraction] = r5Rung.buildRequests(SINGLET, run, inputs);
  // The request of r5 for the other method, a field a request: the fields a run traces rays for, in their order.
  assert.deepEqual(
    requests.map((request) => request.spec),
    [0, 0.5, 1].map((fraction) => ({
      ...diffraction.spec,
      method: "geometric",
      fields: { kind: "image-height-fractions", values: [fraction] },
    })),
  );
  assert.deepEqual(
    requests.map((request) => request.spec),
    geometricFieldMtfSpecs(recipe),
  );
  assert.deepEqual(geometricFieldMtfSpecs(recipe)[0].frequenciesPerMm, waveFrequencies(frequenciesPerMm));
  assert.equal(geometricFieldMtfSpecs(recipe)[0].frequenciesPerMm.length, 11);
  assert.equal(new Set(requests.map((request) => request.id)).size, 3);
  // optiland is handed the angle of the field of the request it is asked, and nothing without a request.
  assert.deepEqual(
    requests.map((request) => r5gRung.engineOptions?.(run, inputs, "optiland", request)),
    [{ fieldAnglesDeg: [0] }, { fieldAnglesDeg: [7.25] }, { fieldAnglesDeg: [13.5] }],
  );
  assert.equal(r5gRung.engineOptions?.(run, inputs, "optiland"), undefined);
  for (const engine of R4F_ENGINES) {
    assert.deepEqual(r5gRung.engineOptions?.(run, inputs, engine, requests[1]), { lvGridCap: 64 });
  }
  // The fields a run states are the fields asked, in that order.
  const stated = { ...run, fields: { kind: "image-height-fractions" as const, values: [0.75, 0.25] } };
  const ofStated = r5gRung.buildRequests(SINGLET, stated, inputs);
  assert.deepEqual(
    ofStated.map((request) => r5gRung.engineOptions?.(stated, inputs, "optiland", request)),
    [{ fieldAnglesDeg: [10.125] }, { fieldAnglesDeg: [3.5] }],
  );
  // A recipe of a case file, and no recipe, ask nothing.
  assert.deepEqual(r5gRung.buildRequests(SINGLET, run, { raySets: [], recipe: { ...recipe, source: "run" } }), []);
  assert.deepEqual(r5gRung.buildRequests(SINGLET, run, { raySets: [], recipe: null }), []);
});

test("a rung is asked for the options of each of its requests, and an engine is handed those of the request it is asked", async (t) => {
  // Two requests that differ in their frequencies, and options that say which request they are for.
  const specs = [GEOMETRIC_SPEC, { ...GEOMETRIC_SPEC, frequenciesPerMm: [10, 30] }];
  const rung: RungDefinition = {
    ...R5G_FIXTURE_RUNG,
    buildRequests: (opticalCase) =>
      specs.map((spec) => makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec })),
    engineOptions: (_run, _inputs, engineId, request) =>
      engineId === "optiland"
        ? { frequencies: (request?.spec as typeof GEOMETRIC_SPEC | undefined)?.frequenciesPerMm.length ?? null }
        : undefined,
  };
  const watched = watchedRegistry(geometricStandIns());
  await runSuite({
    suite: suiteOf("options", [{ name: "edge", opticalCase: SINGLET }]),
    registry: watched.registry,
    runsDir: tempDir(t),
    rungDefinitions: [rung],
    rungs: ["r5g"],
  });
  assert.deepEqual(
    watched.requests.map((request, index) => [watched.ran[index], request.engineOptions]),
    [
      ["lv", undefined],
      ["lv", undefined],
      ["optiland", { frequencies: 4 }],
      ["optiland", { frequencies: 2 }],
      ["replay", undefined],
      ["replay", undefined],
    ],
  );
});

test("the finer step of r5g is asked of an answer of one line that is outside a band, and of no other", () => {
  const [followUp] = followUpsOf(R5G_POLICY);
  const context = { spec: GEOMETRIC_SPEC, opticalCase: SINGLET, recipe: null };
  const needed = (lv: MtfNativeData, optiland: MtfNativeData): boolean =>
    followUp.needed(
      new Map([
        ["lv", lv],
        ["optiland", optiland],
      ]),
      context,
    );
  const beyond = raised(-ON_AXIS_BAND * (1 + 2 ** -40), 2);
  const inside = raised(-ON_AXIS_BAND, 2);
  assert.equal(needed(answer("lv"), answer("geometric-mtf", [{ sagittal: beyond }, {}, {}])), true);
  assert.equal(needed(answer("lv"), answer("geometric-mtf", [{ sagittal: inside }, {}, {}])), false);
  // Several lines: outside the band, and not asked again.
  const lines = [486.1327, 587.5618];
  const summed = answer("spot-landings-sum", [{ sagittal: beyond }, {}, {}], lines);
  assert.equal(needed(answer("lv", [{}, {}, {}], lines), summed), false);
  // Without both answers nothing is asked.
  assert.equal(followUp.needed(new Map([["optiland", summed]]), context), false);
});

test("optiland is asked again once, with geometricRays 512, for the run of one line whose figure is outside its band", async (t) => {
  const runsDir = tempDir(t);
  const { outcomes, watched, comparisons } = await r5gCycle(runsDir);
  assert.deepEqual(
    outcomes.map(({ job }) => `${job.run} ${job.engine}${job.step === undefined ? "" : ` +${job.step}`} ${job.status}`),
    [
      "edge lv ok",
      "edge optiland ok",
      "edge replay ok",
      "beyond lv ok",
      "beyond optiland ok",
      "beyond replay ok",
      "beyond optiland +geo512 ok",
      "polychromatic lv ok",
      "polychromatic optiland ok",
      "polychromatic replay ok",
    ],
  );
  const asked = watched.requests.filter((_request, index) => watched.ran[index] === "optiland");
  assert.deepEqual(
    asked.map((request) => request.engineOptions),
    [undefined, undefined, { geometricRays: 512 }, undefined],
  );
  assert.ok(watched.requests.every((request) => (request.spec as typeof GEOMETRIC_SPEC).method === "geometric"));

  const verdicts = comparisons.comparisons
    .filter((set) => set.mode === "pairwise")
    .map((set) => `${set.run}: ${set.pairs.map((pair) => `${pair.a}-${pair.b} ${pair.verdict}`).join(", ")}`);
  assert.deepEqual(verdicts, [
    "edge: lv-optiland RECORDED, lv-replay RECORDED, optiland-replay RECORDED",
    "beyond: lv-optiland ATTENTION, lv-replay RECORDED, optiland-replay ATTENTION",
    "polychromatic: lv-optiland ATTENTION, lv-replay RECORDED, optiland-replay ATTENTION",
  ]);
  assert.ok(comparisons.comparisons.every((set) => set.rung === "r5g"));
  const beyond = comparisons.comparisons.find((set) => set.run === "beyond" && set.mode === "pairwise");
  const pair = beyond?.pairs.find(({ a, b }) => a === "lv" && b === "optiland");
  const value = (name: string) => pair?.metrics.find((metric) => metric.name === name)?.value;
  assert.equal(value("mtfOnAxis.maxAbs"), ON_AXIS_BAND * (1 + 2 ** -40));
  assert.equal(value("chiefLanding.maxAbs"), 2 * CHIEF_LANDING_LIMIT_MM);
  assert.equal(value("mtfFlagged.maxAbs"), 1 / 16);
  assert.deepEqual(
    ["compared", "flagged", "rimLost", "data", "unavailable"].map((kind) => value(`fields.${kind}`)),
    [1, 1, 0, 1, 0],
  );
});

test("the table of r5g is of the geometric MTF: bands at their edges, a field of two image points, an unsettled and a missing curve", async (t) => {
  const { manifest, comparisons } = await r5gCycle(tempDir(t));
  const model = buildReport(manifest, comparisons, R5G_POLICY);
  const [edge, beyond, polychromatic] = model.sections.map((section) => {
    assert.ok(section.mtf !== undefined);
    const mtf = section.mtf;
    const row = (field: number, cut: string, frequencyPerMm: number): MtfComparisonRow => {
      const found = mtf.rows.find((r) => r.field === field && r.cut === cut && r.frequencyPerMm === frequencyPerMm);
      assert.ok(found !== undefined, `${field} ${cut} ${frequencyPerMm}`);
      return found;
    };
    return { mtf, row };
  });
  for (const { mtf } of [edge, beyond, polychromatic]) assert.equal(mtf.kind, "geometric");
  assert.deepEqual(edge.mtf.columns, [
    { engine: "lv", step: null, judged: true },
    { engine: "optiland", step: null, judged: true },
    { engine: "replay", step: null, judged: false },
  ]);
  assert.deepEqual(edge.mtf.bands, {
    onAxis: ON_AXIS_BAND,
    offAxis: OFF_AXIS_BAND,
    chiefLandingMm: CHIEF_LANDING_LIMIT_MM,
  });
  assert.deepEqual(
    [edge.mtf.lineCounts, polychromatic.mtf.lineCounts],
    [
      [1, 1],
      [3, 3],
    ],
  );

  // At the edge of a band a row is RECORDED, on the axis and off it, each by its own band.
  const onAxis = edge.row(0, "sagittal", 10);
  assert.deepEqual(
    [onAxis.difference, onAxis.band, onAxis.status, onAxis.class],
    [ON_AXIS_BAND, ON_AXIS_BAND, "RECORDED", "method"],
  );
  const offAxis = edge.row(0.5, "tangential", 30);
  assert.deepEqual([offAxis.difference, offAxis.band, offAxis.status], [OFF_AXIS_BAND, OFF_AXIS_BAND, "RECORDED"]);
  // A field optiland has no curve of: the others' values, no difference, UNSUPPORTED.
  for (const row of edge.mtf.rows.filter((candidate) => candidate.field === 1)) {
    assert.deepEqual(
      [row.status, row.class, row.difference, row.values[1]],
      ["UNSUPPORTED", "unsupported", null, null],
    );
    assert.ok(row.values[0] !== null && row.values[2] !== null);
  }
  assert.deepEqual(
    edge.mtf.fields.map((field) => `${field.field} ${field.class} ${field.reason} ${field.flags.join("/")}`),
    ["0 method two-methods ok/ok/ok", "0.5 method two-methods ok/ok/ok", "1 unsupported no-curve ok/no curve/ok"],
  );

  // Beside each flag, what the column states of its own sampling of the field.
  assert.deepEqual(edge.mtf.fields[0].samplings, [
    { across: 64, lastChange: 1 / 512 },
    { across: 256, lastChange: 1 / 1024 },
    { across: null, lastChange: null },
  ]);
  assert.deepEqual(beyond.mtf.fields[0].samplings[2], { across: 512, lastChange: 1 / 2048 });

  // One unit in the last place beyond the band is ATTENTION, of optiland's last step.
  assert.deepEqual(
    beyond.mtf.columns.map((column) => `${column.engine} ${column.step} ${column.judged}`),
    ["lv null true", "optiland null false", "optiland geo512 true", "replay null false"],
  );
  const marked = beyond.row(0, "sagittal", 50);
  assert.deepEqual(
    [marked.difference, marked.band, marked.status],
    [ON_AXIS_BAND * (1 + 2 ** -40), ON_AXIS_BAND, "ATTENTION"],
  );
  assert.equal(beyond.row(0, "sagittal", 10).status, "RECORDED");
  // Two image points: values and no difference. An unsettled sampling: the difference, apart, in no band.
  const apart = beyond.mtf.fields[1];
  assert.deepEqual(
    [apart.class, apart.reason, apart.chiefLandingMm],
    ["data", "chief-landing-apart", 2 * CHIEF_LANDING_LIMIT_MM],
  );
  for (const row of beyond.mtf.rows.filter((candidate) => candidate.field === 0.5)) {
    assert.deepEqual([row.difference, row.band, row.status, row.class], [null, null, "SET ASIDE", "data"]);
  }
  const flagged = beyond.row(1, "tangential", 70);
  assert.deepEqual(
    [flagged.difference, flagged.band, flagged.status, flagged.class],
    [-1 / 16, null, "SET ASIDE", "numerical"],
  );
  assert.deepEqual([beyond.mtf.fields[2].class, beyond.mtf.fields[2].reason], ["numerical", "unconverged"]);

  // Several lines: twice the band, ATTENTION, and of optiland's one answer: no finer step was asked.
  const summed = polychromatic.row(0.5, "sagittal", 30);
  assert.deepEqual([summed.difference, summed.status], [-2 * OFF_AXIS_BAND, "ATTENTION"]);
  assert.deepEqual(
    polychromatic.mtf.columns.map((column) => `${column.engine} ${column.step}`),
    ["lv null", "optiland null", "replay null"],
  );
});

test("the report of the stand-ins is its golden file, says whose rays and whose sum a column is, and claims nothing it may not", async (t) => {
  const { manifest, comparisons, report } = await r5gCycle(tempDir(t));
  assert.equal(
    report.markdown,
    readFileSync(goldenFile(R5G_GOLDEN), "utf8"),
    "the report is not the golden file; if it is meant to change, run node test/report/writeGolden.ts",
  );
  assert.equal(renderMarkdown(buildReport(manifest, comparisons, R5G_POLICY)), report.markdown);
  assert.deepEqual(wordingProblems(report.markdown), []);
  for (const sentences of [MTF_COMPARISON_INTROS.geometric, GEOMETRIC_SAMPLING, GEOMETRIC_SEVERAL_LINES, NOT_COVERED]) {
    assert.deepEqual(wordingProblems(sentences.join("\n")), []);
  }
  const count = (text: string): number => report.markdown.split(text).length - 1;
  assert.equal(count("The engines' own geometric MTF, side by side."), 3);
  assert.equal(count(MTF_COMPARISON_INTROS.geometric.join("\n")), 3);
  assert.equal(count(MTF_COMPARISON_INTROS.diffraction.join("\n")), 0);
  assert.equal(count(GEOMETRIC_SAMPLING.join("\n")), 3);
  // Only the run of several lines says that the sum is the worker's.
  assert.equal(count(GEOMETRIC_SEVERAL_LINES.join("\n")), 1);
  assert.ok(report.markdown.indexOf(GEOMETRIC_SEVERAL_LINES[0]) > report.markdown.indexOf("### polychromatic"));
  // A geometric MTF has no rim rays, and the table no column of them.
  assert.doesNotMatch(report.markdown, /Rim rays/);
  assert.match(
    report.markdown,
    /^\| Field \| Angle \[deg\] \| lv \| optiland \| optiland geo512 \| replay \| lv: across \| lv: last change \| optiland geo512: across \| optiland geo512: last change \| Chief rays apart \[mm\] \| Class \| Reason \|$/m,
  );
  assert.match(
    report.markdown,
    /^\| 0 \| 0\.000 \| ok \| ok \| ok \| ok \| 64 \| 1\.95e-3 \| 512 \| 4\.88e-4 \| 0 \| method \|/m,
  );
  assert.match(
    report.markdown,
    /^\| 0 \| sagittal \| 50 \| 0\.5000 \| 0\.4961 \| 0\.4961 \| 0\.5000 \| 3\.91e-3 \| ATTENTION \| method \|$/m,
  );
  for (const sentence of NOT_COVERED) assert.ok(report.markdown.includes(`- ${sentence}\n`), sentence);
  assert.ok(NOT_COVERED.some((sentence) => /Rung R5g is recorded and never gated/.test(sentence)));
});

test("the lint takes a sentence about R5g as one of a recorded row", () => {
  for (const claim of [
    "R5g passes for every lens of the benchmark.",
    "| nikkor-z50f12-ref | r5g | lv | optiland | PASS |",
    "The geometric MTF of optiland agrees with LensVisualizer's.",
    "optiland's geometric MTF confirms the MTF of LensVisualizer.",
  ]) {
    assert.notDeepEqual(wordingProblems(claim), [], claim);
  }
  assert.deepEqual(wordingProblems("| edge | r5g | ok | ok | ok |"), []);
});
