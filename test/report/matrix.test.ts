import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import {
  MATRIX_JSON,
  MATRIX_MARKDOWN,
  UNBASELINED_RUNGS,
  buildMatrix,
  readMatrixInputs,
  renderMatrix,
} from "../../src/report/matrix.ts";
import { MATRIX_ROWS, MATRIX_RUNGS, MATRIX_TEXT, NOT_COVERED, wordingProblems } from "../../src/report/wording.ts";
import { matrixInputs } from "./matrixFixture.ts";
import { GOLDEN_DIR } from "./support.ts";

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };
function mutable<T>(value: T): Mutable<T> {
  return structuredClone(value) as Mutable<T>;
}

test("synthetic matrix golden, both files; fixed ordering, no engines or environment", () => {
  const inputs = matrixInputs();
  for (const { baseline } of inputs) assert.ok("baseline" in parseBaseline(baselineText(baseline)));
  const rendered = renderMatrix(inputs);
  for (const extension of ["json", "md"] as const)
    assert.equal(
      extension === "json" ? rendered.json : rendered.markdown,
      readFileSync(join(GOLDEN_DIR, `validation-matrix.${extension}`), "utf8"),
    );
  assert.deepEqual(renderMatrix([...inputs].reverse()), rendered);
  assert.deepEqual(wordingProblems(rendered.markdown), []);
  const m = rendered.matrix;
  assert.equal(m.declared, 3);
  assert.equal(m.configurations, 2);
  assert.deepEqual(
    m.rows.map((row) => row.tab),
    MATRIX_ROWS.map((row) => row.tab),
  );
  assert.deepEqual(m.notCovered, NOT_COVERED);
  const rungs = m.rows.flatMap((row) => [...row.gated, ...row.recorded]);
  const of = (id: string) => rungs.find((r) => r.rung === id)!;
  // R4 is in both baselines and counts once.
  const r4 = of("r4");
  assert.ok(r4.inBaseline);
  assert.equal(r4.configurations, 2);
  assert.equal(r4.configurationPairs, 6);
  assert.equal(r4.requestPairs, 12);
  assert.deepEqual(r4.baselines, ["baselines/benchmark.json", "baselines/benchmark.mtf.json"]);
  // Request pairs and configuration pairs are counted apart, an unsupported engine named.
  const r7a = of("r7a");
  assert.ok(r7a.inBaseline);
  assert.deepEqual(r7a.requestPairVerdicts, [
    { verdict: "PASS", count: 16 },
    { verdict: "UNSUPPORTED", count: 8 },
  ]);
  assert.deepEqual(r7a.configurationPairVerdicts, [
    { verdict: "PASS", count: 4 },
    { verdict: "UNSUPPORTED", count: 2 },
  ]);
  assert.deepEqual(r7a.support.find((s) => s.engine === "optiland")?.statuses, [
    { status: "ok", configurations: 1 },
    { status: "unsupported", configurations: 1 },
  ]);
  const r6b = of("r6b");
  assert.ok(r6b.inBaseline);
  assert.deepEqual(r6b.requestPairVerdicts, [
    { verdict: "RECORDED", count: 1 },
    { verdict: "ATTENTION", count: 1 },
  ]);
  // A baselined rung the baselines lack is said to be absent; a rung in no baseline has no figure, only its names.
  for (const id of ["r11a", "r5g", "r6c"])
    assert.deepEqual(Object.keys(of(id)).sort(), ["compares", "inBaseline", "mode", "rung"]);
  assert.ok(rendered.markdown.includes(MATRIX_TEXT.absent));
  const r7b = of("r7b");
  assert.deepEqual(r7b, {
    rung: "r7b",
    mode: "recorded",
    compares: MATRIX_RUNGS.r7b.compares,
    inBaseline: false,
    ...UNBASELINED_RUNGS.r7b,
  });
  assert.equal(m.lensVisualizer?.details.commit, "c".repeat(40));
  assert.match(
    rendered.markdown,
    /^\| r7b \| .* \| spot\.native \| lv, optiland \| in no baseline; run only where named \|$/m,
  );
});

test("refuses missing, repeated or inconsistent inputs, conflicting duplicates and a rung kept out of every baseline", () => {
  const inputs = matrixInputs();
  assert.throws(() => buildMatrix(inputs.slice(1)), /exactly the benchmark's rays and MTF baselines/);
  assert.throws(() => buildMatrix([inputs[0], inputs[0]]), /exactly/);
  const policy = mutable(inputs);
  policy[0].baseline.policy = { version: 999, hash: "f".repeat(64) };
  assert.throws(() => buildMatrix(policy), /differ in suite or policy/);
  const suite = mutable(inputs);
  suite[0].baseline.suite.name = "features";
  suite[1].baseline.suite.name = "features";
  assert.throws(() => buildMatrix(suite), /not of benchmark/);
  const inventory = mutable(inputs);
  inventory[1].baseline.runs = inventory[1].baseline.runs.slice(1);
  assert.throws(() => buildMatrix(inventory), /inventories differ/);
  const duplicate = mutable(inputs);
  duplicate[1].baseline.runs[0].rungs[0].requests = 99;
  assert.throws(() => buildMatrix(duplicate), /duplicate measurements differ/);
  const engine = mutable(inputs);
  // The two baselines share the engine objects of the fixture: replace, never mutate, the MTF baseline's.
  engine[1].baseline.engines[0] = { ...engine[1].baseline.engines[0], fingerprint: "9".repeat(64) };
  assert.throws(() => buildMatrix(engine), /engine lv differs/);
  const kept = mutable(inputs);
  kept[1].baseline.runs[0].rungs.push({ ...kept[1].baseline.runs[0].rungs[4], rung: "r12b" });
  assert.throws(() => buildMatrix(kept), /r12b: a rung kept out of every baseline/);
});

test("the rows name every rung of the policy, each by the mode, quantity and engines its definition states", () => {
  const policy = loadPolicy();
  const named = MATRIX_ROWS.flatMap((row) => [...row.gated, ...row.recorded]);
  assert.deepEqual(
    [...new Set(named)].sort(),
    Object.keys(policy.rungs)
      .filter((id) => id !== "selftest")
      .sort(),
  );
  for (const row of MATRIX_ROWS) {
    for (const id of row.gated) assert.equal(MATRIX_RUNGS[id].mode, "gated", id);
    for (const id of row.recorded) assert.equal(MATRIX_RUNGS[id].mode, "recorded", id);
  }
  for (const [id, { mode }] of Object.entries(MATRIX_RUNGS)) assert.equal(policy.rungs[id].class, mode, id);
  for (const [id, fixed] of Object.entries(UNBASELINED_RUNGS)) {
    const definition = RUNGS.find((rung) => rung.id === id)!;
    assert.equal(definition.quantity, fixed.quantity, id);
    assert.deepEqual([...(definition.engines ?? [])].sort(), fixed.engines, id);
    assert.equal(definition.onlyWhereNamed, true, id);
    assert.equal(MATRIX_RUNGS[id].mode, "recorded", id);
  }
  // Every sentence of a row ends, so that no two of them are read as one by the lint.
  for (const row of MATRIX_ROWS) for (const sentence of [row.about, ...row.notCovered]) assert.match(sentence, /\.$/);
});

test("a figure a row says has no attention band has none in the policy at hand", () => {
  const rungs = loadPolicy().rungs;
  const sentence = (tab: string, text: string): void =>
    assert.ok(
      MATRIX_ROWS.find((row) => row.tab === tab)!.notCovered.some((s) => s.includes(text)),
      `${tab}: ${text}`,
    );
  const unbanded = (rung: string, metrics: readonly string[]): void => {
    for (const metric of metrics)
      assert.equal(rungs[rung].metrics?.[metric]?.attention, undefined, `${rung} ${metric}`);
  };
  sentence("coma-bokeh", "The spot figures of R7b have no attention band");
  unbanded("r7b", ["spotCentroid.maxAbs", "spotRmsRadius.maxAbs"]);
  assert.notEqual(rungs.r7b.metrics?.["fanError.maxAbs"]?.attention, undefined, "only its fan figure has one");
  sentence("axial", "The colour figures of R8b have no attention band");
  unbanded("r8b", ["lineFocus.maxAbs", "relativeFocus.maxAbs"]);
  // R9b's one limit is the landing it sorts fields by, which is no band on a figure.
  sentence("chief", "The figures of R9b have no attention band");
  unbanded(
    "r9b",
    Object.keys(rungs.r9b.metrics ?? {}).filter((metric) => metric !== "chiefLanding.maxAbs"),
  );
  sentence("vignetting", "The relative illumination and the falloff of R11b have no attention band");
  unbanded("r11b", ["relativeIllumination.maxAbs", "falloff.maxAbs"]);
});

test("the committed matrix is what the benchmark's committed baselines render", () => {
  const rendered = renderMatrix(readMatrixInputs(REPO_ROOT));
  assert.equal(readFileSync(join(REPO_ROOT, MATRIX_JSON), "utf8"), rendered.json);
  assert.equal(readFileSync(join(REPO_ROOT, MATRIX_MARKDOWN), "utf8"), rendered.markdown);
  // Recorded rungs in no baseline carry no counts, whatever the baselines hold.
  for (const row of rendered.matrix.rows)
    for (const rung of row.recorded.filter((r) => Object.hasOwn(UNBASELINED_RUNGS, r.rung)))
      assert.ok(!("requestPairs" in rung), rung.rung);
});
