import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import { buildStatement, renderStatement } from "../../src/report/statement.ts";
import { STATEMENT_TEXT, statementSupport, wordingProblems } from "../../src/report/wording.ts";
import { statementInputs } from "./statementFixture.ts";
import { GOLDEN_DIR } from "./support.ts";

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };
function mutable<T>(value: T): Mutable<T> {
  return structuredClone(value) as Mutable<T>;
}

test("synthetic statement golden, both files; fixed ordering, no engines or environment", () => {
  const inputs = statementInputs();
  for (const { baseline } of inputs) assert.ok("baseline" in parseBaseline(baselineText(baseline)));
  const rendered = renderStatement(inputs);
  for (const extension of ["json", "md"] as const)
    assert.equal(
      extension === "json" ? rendered.json : rendered.markdown,
      readFileSync(join(GOLDEN_DIR, `validation-statement.${extension}`), "utf8"),
    );
  assert.deepEqual(renderStatement([...inputs].reverse()), rendered);
  assert.deepEqual(wordingProblems(rendered.markdown), []);
  const s = rendered.statement;
  assert.equal(s.configurations, 8);
  assert.equal(s.agreementConfigurations, 8);
  assert.equal(s.agreementFigures.population, "agreementStates");
  assert.ok(rendered.markdown.includes(STATEMENT_TEXT.population));
  assert.equal(s.z50Attribution, null, "no lens-specific attribution without the named comparison");
  assert.deepEqual(s.wavelengthsNm, [400, 500, 600]);
  const r4 = s.rungs.find((r) => r.rung === "r4")!;
  assert.equal(r4.configurations, 8);
  assert.equal(r4.configurationPairs, 16);
  assert.equal(r4.requestPairs, 32); // R4 exists twice in each input suite, counted once.
  assert.deepEqual(r4.verdicts, [{ verdict: "PASS", count: 32 }]);
  assert.equal(s.suites[3].declared, 3);
  assert.deepEqual(s.suites[3].states[2].problems, ["finite-conjugate-unavailable"]);
  for (const c of s.counterparts) {
    assert.equal(c.worstBanded?.value, 1 / 8);
    assert.equal(c.worstBanded?.class, "method");
    assert.equal(c.worstSetAside?.value, 3 / 8);
    assert.deepEqual(
      c.classes,
      c.rung === "r5" ? { method: 4, numerical: 4, unsupported: 16 } : { method: 8, numerical: 8, unsupported: 8 },
    );
    assert.deepEqual(
      c.statuses,
      c.rung === "r5"
        ? { ATTENTION: 2, RECORDED: 2, "SET ASIDE": 4, UNSUPPORTED: 16 }
        : { ATTENTION: 4, RECORDED: 4, "SET ASIDE": 8, UNSUPPORTED: 8 },
    );
  }
});

test("support names landing when hits is larger, and formats the statement's own figures and counts", () => {
  const inputs = mutable(statementInputs());
  const r2 = inputs[0].baseline.runs[0].rungs[2];
  r2.pairs[0].metrics.push({ name: "hits.maxDistance", value: 1 / 32, tolerance: 1 / 8, unit: "mm" });
  const s = buildStatement(inputs);
  assert.equal(s.rungs.find((r) => r.rung === "r2")?.worst?.name, "hits.maxDistance");
  assert.match(s.supportable, /worst landing 0\.016 mm \(gate 0\.125 mm\)/);
  const changed = mutable(s);
  changed.agreementConfigurations = 7;
  changed.suites.pop();
  changed.wavelengthsNm.pop();
  const landing = changed.agreementFigures.landing!;
  landing.value = 1 / 32768;
  landing.tolerance = 1 / 16384;
  changed.counterparts[0].counterpartLinesNm.push(700);
  changed.counterparts[0].worstBanded!.value = 1 / 16;
  changed.counterparts[1].worstBanded!.value = 1 / 32;
  const sentence = statementSupport(changed, true);
  assert.match(sentence, /^On 7 configurations across three suites/);
  assert.ok(sentence.includes("worst landing 3.1e-5 mm (gate 6.103515625e-5 mm)"));
  assert.ok(sentence.includes("the benchmark covers two wavelengths"));
  assert.ok(sentence.includes("of two wavelengths, differs by up to 0.063"));
  assert.ok(sentence.includes("per wavelength and photopic, differs by up to 0.031"));
});

test("support quotes only the counted configurations' worsts while rung maxima keep their full populations", () => {
  const inputs = mutable(statementInputs());
  // The same named state in the other suites still counts. Only benchmark/artificial-line lacks
  // a measured R6a metric for both LV/external pairs, despite having the largest residuals.
  for (const input of inputs.filter((input) => input.baseline.suite.name === "benchmark")) {
    for (const rung of input.baseline.runs[0].rungs) {
      if (!["r2", "r3", "r4", "r6a"].includes(rung.rung)) continue;
      for (const pair of rung.pairs) {
        for (const metric of pair.metrics.filter((metric) => metric.name !== "synthetic.zero")) metric.value = 1 / 32;
        if (rung.rung === "r6a" && pair.b === "ref")
          pair.metrics = pair.metrics.filter((metric) => metric.name !== "waveMtf.maxAbs");
      }
    }
  }
  const s = renderStatement(inputs).statement;
  assert.equal(s.configurations, 8);
  assert.equal(s.agreementConfigurations, 7);
  assert.equal(s.agreementStates.filter((state) => state.run === "artificial-line").length, 3);
  for (const [rung, name] of [
    ["r2", "landing"],
    ["r3", "opticalPath"],
    ["r4", "geometricMtf"],
    ["r6a", "waveMtf"],
  ] as const) {
    const worst = s.rungs.find((r) => r.rung === rung)!.worst!;
    assert.equal(worst.value, 1 / 32);
    assert.equal(worst.suite, "benchmark");
    assert.equal(worst.run, "artificial-line");
    const quoted = s.agreementFigures[name]!;
    assert.equal(quoted.value, 1 / 64);
    assert.ok(s.agreementStates.some((state) => state.suite === quoted.suite && state.run === quoted.run));
  }
  assert.match(
    s.supportable,
    /worst landing 0\.016 mm \(gate 0\.125 mm\), optical path 0\.016 waves \(0\.125\), geometric MTF 0\.016 \(0\.125\), wave MTF 0\.016 \(0\.125\)/,
  );
});

test("ranks unlike gated metrics against their own gates, retains zero limits and where", () => {
  const inputs = statementInputs();
  const copy = mutable(inputs);
  const rung = copy[0].baseline.runs[0].rungs[2];
  copy[0].baseline.runs[0].rungs[2] = {
    ...rung,
    pairs: [
      {
        ...rung.pairs[0],
        metrics: [
          ...rung.pairs[0].metrics,
          { name: "small.maxAbs", value: 1 / 128, tolerance: 1 / 64, unit: "mm", where: { ray: 7 } },
        ],
      },
    ],
  };
  const s = buildStatement(copy);
  const r2 = s.rungs.find((r) => r.rung === "r2")!;
  assert.equal(r2.worst?.name, "small.maxAbs");
  assert.deepEqual(r2.worst?.where, { ray: 7 });
  assert.equal(r2.worst?.suite, "benchmark");
  assert.equal(r2.worst?.run, "artificial-line");
  assert.ok(r2.limits.some((limit) => limit.value === 0));
});

test("refuses missing, repeated, incompatible inventories and conflicting duplicate R4", () => {
  const inputs = statementInputs();
  assert.throws(() => buildStatement(inputs.slice(1)), /eight/);
  assert.throws(() => buildStatement([inputs[0], ...inputs.slice(0, -1)]), /eight/);
  const policy = mutable(inputs);
  policy[0].baseline = { ...policy[0].baseline, policy: { version: 999, hash: "f".repeat(64) } };
  assert.throws(() => buildStatement(policy), /policy differs/);
  const inventory = mutable(inputs);
  inventory[1].baseline = { ...inventory[1].baseline, runs: inventory[1].baseline.runs.slice(1) };
  assert.throws(() => buildStatement(inventory), /inventories differ/);
  const duplicate = mutable(inputs);
  const r4 = duplicate[1].baseline.runs[0].rungs[0];
  duplicate[1].baseline.runs[0].rungs[0] = { ...r4, requests: 99 };
  assert.throws(() => buildStatement(duplicate), /duplicate measurements differ/);
});

test("no agreement claim when a gate fails or a whole R6a configuration is unmeasured", () => {
  const inputs = mutable(statementInputs());
  const rung = inputs[0].baseline.runs[0].rungs[2];
  inputs[0].baseline.runs[0].rungs[2] = {
    ...rung,
    pairs: [{ ...rung.pairs[0], verdict: "FAIL", verdicts: [{ verdict: "FAIL", count: 2 }] }],
  };
  assert.match(buildStatement(inputs).supportable, /^The gated records do not support/);
  const missing = mutable(statementInputs());
  const r6a = missing[1].baseline.runs[0].rungs[2];
  missing[1].baseline.runs[0].rungs[2] = {
    ...r6a,
    pairs: r6a.pairs.map((pair) => ({ ...pair, metrics: pair.metrics.map((metric) => ({ ...metric, measured: 0 })) })),
  };
  assert.equal(buildStatement(missing).agreementConfigurations, 7);
});
