import assert from "node:assert/strict";
import { test } from "node:test";
import type { Suite } from "../../src/contract/runSpec.ts";
import { investigationSuite, pupilSummary } from "../../src/diagnostics/z50f12.ts";
import { validateKind } from "../../src/contract/schemas.ts";

test("the investigation preserves source conditions and recipe defaults while varying engine sampling only", () => {
  const benchmark: Suite = {
    contract: "1.0",
    kind: "suite",
    name: "synthetic",
    defaults: { aperture: { kind: "wide-open" } },
    runs: [],
  };
  const conditions = ["design", "lv-best-axial", "design", "lv-best-axial"] as const;
  const source: Suite = {
    ...benchmark,
    runs: conditions.map((kind, i) => ({
      name: `condition-${i}`,
      lens: { kind: "lv", key: "nikkor-z50f12" },
      lines: { kind: "reference" },
      imagePlane: { kind },
      ...(i > 1 ? { aperture: { kind: "lv-f8-comparison" as const } } : {}),
    })),
  };
  const made = investigationSuite(source);
  assert.deepEqual(validateKind("suite", made), []);
  assert.equal(made.runs.length, 12);
  for (const [i, run] of made.runs.entries()) {
    const original = source.runs[Math.floor(i / 3)];
    assert.deepEqual(run.imagePlane, original.imagePlane);
    assert.deepEqual(run.aperture, original.aperture);
    assert.equal(run.frequenciesPerMm, undefined, "use the source's recipe, not invented frequencies");
    assert.equal(run.sampling?.engines?.optiland.fftRays, [128, 256, 512][i % 3]);
  }
  assert.throws(() => investigationSuite(benchmark), /four reference-line/);
});

test("a sparse vignetted pupil measures actual extents and adjacent y pairs, without crossing gaps or rows", () => {
  const samples = [
    { row: 0, column: 0, y: -2, cosine: -0.25 },
    { row: 1, column: 0, y: -1, cosine: -0.125 },
    { row: 3, column: 0, y: 1, cosine: 0.25 },
    { row: 0, column: 1, y: -2, cosine: -0.25 },
    { row: 1, column: 1, y: -1, cosine: 0 },
  ];
  assert.deepEqual(pupilSummary(2, 4, samples), {
    columns: 2,
    rows: 4,
    lit: 5,
    y: [-2, 1],
    cosine: [-0.25, 0.25],
    pitch: [0.125, 0.25, 0.25],
  });
  assert.throws(() => pupilSummary(2, 2, []), /no lit/);
});

test("the evidence table retains unconverged flags and absent curves at every frequency", async (t) => {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { createResultStore } = await import("../../src/core/resultStore.ts");
  const { encodeF8 } = await import("../../src/core/numeric/ndarray.ts");
  const { makeRequest } = await import("../../src/contract/request.ts");
  const { makeResult } = await import("../../src/contract/result.ts");
  const { investigationTable, LEVELS } = await import("../../src/diagnostics/z50f12.ts");
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-evidence-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const store = createResultStore(join(directory, "store"));
  const jobs = [];
  const caseId = "a".repeat(64);
  const spec = {
    fields: { kind: "image-height-fractions", values: [0.5, 1] },
    frequenciesPerMm: [0, 10],
    method: "diffraction",
    focus: "design",
  };
  for (const { name } of LEVELS)
    for (const engine of ["lv", "wave", "optiland", "optiland-wave"]) {
      const request = makeRequest({ caseId, quantity: "mtf.native", spec });
      const result = makeResult(
        request,
        { id: engine, details: {}, fingerprint: "b".repeat(64) },
        {
          status: "ok",
          data: {
            fields: [0.5, 1].map((field) => ({
              field,
              status: engine === "wave" ? "unconverged" : engine === "optiland" ? "unavailable" : "ok",
              sagittal: encodeF8(engine === "optiland" ? [NaN, NaN] : [1, 0.125]),
              tangential: encodeF8(engine === "optiland" ? [NaN, NaN] : [1, 0.25]),
            })),
          },
        },
      );
      jobs.push({ run: `synthetic-${name}`, rung: "r6c", engine, storeKey: store.put(request, result) });
    }
  mkdirSync(join(directory, "z50f12-investigation"));
  writeFileSync(
    join(directory, "z50f12-investigation/manifest.json"),
    JSON.stringify({
      runs: LEVELS.map(({ name }) => ({ name: `synthetic-${name}` })),
      jobs,
    }),
  );
  const table = investigationTable(directory);
  assert.match(table, /\| 0.5 \| T \| 10 \| 0.250000 \| 0.250000\* \/ 0.250000\* \/ 0.250000\* \| — \/ — \/ — \|/);
  assert.equal(table.split("\n").filter((line) => /^\| [01]/.test(line)).length, 8);
});
