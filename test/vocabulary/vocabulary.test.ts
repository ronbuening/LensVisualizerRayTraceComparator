// The vocabulary covers everything it names, every string of it passes the wording lint, and none of its words is the
// tool's own jargon. Its new ids follow the naming scheme: a check held to a limit never says `-vs-`, and a
// side-by-side check always does.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { CHECK_OUTCOMES, STALE_REASONS } from "../../src/baseline/check.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import { VERDICTS } from "../../src/contract/comparison.ts";
import { LEGACY_CHECK_IDS, LEGACY_ENGINE_IDS } from "../../src/core/legacyIds.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { RUNG_CLASSES, RUNG_MODES } from "../../src/contract/policy.ts";
import { badgeOf } from "../../src/dashboard/staleness.ts";
import { SUPPORT_STATUSES } from "../../src/dashboard/views.ts";
import { ENGINE_UNAVAILABLE_CODES } from "../../src/engines/adapter.ts";
import { BUILTIN_ENGINES } from "../../src/engines/builtin.ts";
import type { LvBindingErrorCode } from "../../src/engines/lv/errors.ts";
import { EXPORT_PROBLEM_CODES, LV_GATE_PROBLEM_CODES } from "../../src/engines/lv/exportProblems.ts";
import {
  DIFFERENCE_CLASS_TEXT,
  MATRIX_ROWS,
  MATRIX_RUNGS,
  MTF_ROW_STATUSES,
  STATEMENT_RUNGS,
  wordingProblems,
} from "../../src/report/wording.ts";
import * as vocabulary from "../../src/vocabulary/index.ts";
import {
  BADGE_TEXT,
  CHECKS,
  CLASS_KIND,
  LIMIT_KIND_TEXT,
  METHOD_TEXT,
  QUANTITY_TEXT,
  SUPPORT_STATUS_TEXT,
  quantityLabel,
  valueLabel,
  CLASS_TEXT,
  CODES,
  DIFFERENCE_CLASSES,
  ENGINES,
  engineOf,
  GLOSSARY_TEXT,
  JARGON,
  MATRIX_CHECKS,
  METRICS,
  OUTCOME_TEXT,
  ROW_STATUSES,
  ROW_STATUS_TEXT,
  STALE_REASON_TEXT,
  STATEMENT_CHECKS,
  SUITES,
  TERMS,
  UNIT_TEXT,
  VERDICT_TEXT,
  badgeLabel,
  checkTitle,
  classLabel,
  codeText,
  engineName,
  jargonProblems,
  metricLabel,
  metricUnit,
  outcomeLabel,
  renderGlossary,
  rowStatusLabel,
  staleText,
  verdictLabel,
} from "../../src/vocabulary/index.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** Every leaf string of a value. Functions are left to `calls`, which gives them arguments. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value instanceof RegExp) return [];
  if (value !== null && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** What the helpers say, called with samples: every code, verdict, outcome, class and metric they know, and others. */
function calls(): string[] {
  return [
    ...CHECKS.map((check) => checkTitle(check.id)),
    ...ENGINES.map((engine) => engineName(engine.id)),
    ...VERDICTS.map(verdictLabel),
    ...CHECK_OUTCOMES.map(outcomeLabel),
    staleText([...STALE_REASONS]),
    ...STALE_REASONS.map((reason) => staleText([reason])),
    badgeLabel([], ["engine", "case"]),
    badgeLabel(["policy"], []),
    badgeLabel([], []),
    ...DIFFERENCE_CLASSES.map(classLabel),
    ...ROW_STATUSES.map(rowStatusLabel),
    ...Object.keys(METRICS).map(metricLabel),
    ...Object.keys(METRICS).map((key) => metricUnit(key) ?? ""),
    metricLabel("mtfOnAxis.firstStepMaxAbs"),
    ...Object.keys(CODES).map(codeText),
  ];
}

/**
 * Every string of the vocabulary but the jargon it names on purpose: the words a term replaces, `JARGON`, each
 * check's and each engine's old id (`oldId`, the id it had before the rename, which the checks command, the glossary
 * and the help page show beside its id) and the note that names `--rungs`.
 */
function plainStrings(): string[] {
  const {
    TERMS: _terms,
    JARGON: _jargon,
    CHECKS: checks,
    ENGINES: engines,
    OLD_ID_TEXT: oldIdText,
    ...rest
  } = vocabulary;
  // The note on --rungs names the option, the older spelling of --checks.
  const { olderOption: _option, ...oldIdWords } = oldIdText;
  return [
    ...strings(rest),
    ...strings(oldIdWords),
    ...strings(checks.map(({ oldId: _oldId, ...check }) => check)),
    ...strings(engines.map(({ oldId: _oldId, ...engine }) => engine)),
    ...TERMS.flatMap((term) => [term.term, term.definition]),
    ...JARGON.map((jargon) => jargon.replacement),
    ...calls(),
  ];
}

test("every string of the vocabulary, and the glossary, passes the wording lint", () => {
  const all = [...strings(vocabulary), ...calls()];
  assert.ok(all.length > 300, `${all.length} strings`);
  for (const text of all) assert.deepEqual(wordingProblems(text), [], text);
  assert.deepEqual(wordingProblems(renderGlossary()), []);
  // The lint does reject what the vocabulary must not say.
  assert.notDeepEqual(wordingProblems("The side-by-side check validates LensVisualizer's MTF."), []);
});

test("no string of the vocabulary is the tool's own jargon, but the words a term replaces", () => {
  for (const text of plainStrings()) assert.deepEqual(jargonProblems(text), [], text);
  assert.ok(TERMS.some((term) => term.replaces.includes("rung")));
});

test("the statement and the matrix take their words from the checks, in RUNGS order, unchanged", () => {
  assert.equal(STATEMENT_RUNGS, STATEMENT_CHECKS);
  assert.equal(MATRIX_RUNGS, MATRIX_CHECKS);
  const order = RUNGS.map((rung) => rung.id);
  for (const ids of [Object.keys(STATEMENT_RUNGS), Object.keys(MATRIX_RUNGS)])
    assert.deepEqual(
      ids,
      order.filter((id) => ids.includes(id)),
    );
  assert.deepEqual(Object.keys(STATEMENT_RUNGS), Object.keys(MATRIX_RUNGS).slice(0, 11));
  // A sample, word for word as the committed statement prints it.
  assert.deepEqual(STATEMENT_RUNGS["ray-trace"], {
    mode: "gated",
    compares: "Hits, directions, image landings and masks of identical rays",
  });
});

test("there is a check for every rung, of its class in the limits file, and each matrix row names its own", () => {
  const policy = loadPolicy();
  assert.deepEqual(
    CHECKS.map((check) => check.id),
    RUNGS.map((rung) => rung.id),
  );
  for (const check of CHECKS) {
    assert.equal(check.kind, policy.rungs[check.id].class === "gated" ? "limit" : "side-by-side", check.id);
    if (check.inMatrix) assert.equal(MATRIX_RUNGS[check.id].mode, policy.rungs[check.id].class, check.id);
  }
  for (const check of CHECKS) {
    const rows = MATRIX_ROWS.filter((row) => [...row.gated, ...row.recorded].includes(check.id));
    assert.equal(check.tab, rows[0]?.tab ?? null, check.id);
    assert.equal(check.inMatrix, rows.length > 0, check.id);
  }
});

test("new ids are unique and kebab-case; a check held to a limit never says -vs-, a side-by-side check always does", () => {
  const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const list of [CHECKS.map((check) => check.id), ENGINES.map((engine) => engine.id)]) {
    assert.equal(new Set(list).size, list.length);
    for (const id of list) assert.match(id, kebab);
  }
  for (const check of CHECKS) assert.equal(check.id.includes("-vs-"), check.kind === "side-by-side", check.id);
  // No new id is an old one, and no old id a new one: each id has one name in each id space.
  const old = new Set(CHECKS.map((check) => check.oldId));
  for (const check of CHECKS) assert.ok(!old.has(check.id), check.id);
  const renamed = new Set(ENGINES.filter((engine) => engine.oldId !== engine.id).map((engine) => engine.oldId));
  for (const engine of ENGINES) assert.ok(!renamed.has(engine.id), engine.id);
  // LensVisualizer and optiland keep their ids, so their stored answers stay valid.
  assert.equal(ENGINES.find((engine) => engine.id === "lv")?.oldId, "lv");
  assert.equal(ENGINES.find((engine) => engine.id === "optiland")?.oldId, "optiland");
});

test("the new ids are the plan's, check by check and engine by engine, and the legacy map is the checks' own", () => {
  // Every check's old id to its id: the plan's table, and exactly the map the code reads old ids by.
  assert.deepEqual(Object.fromEntries(CHECKS.map((check) => [check.oldId, check.id])), LEGACY_CHECK_IDS);
  assert.deepEqual(Object.fromEntries(CHECKS.map((check) => [check.oldId, check.id])), {
    selftest: "pipeline-echo",
    r0: "built-system",
    r1: "first-order",
    r2: "ray-trace",
    r3: "optical-path",
    r4: "geometric-mtf",
    r4f: "lv-mtf-replay",
    r5: "mtf-vs-optiland-fft",
    r5g: "geometric-mtf-vs-optiland",
    r6a: "wave-mtf",
    r6b: "mtf-vs-wave-estimate",
    r6c: "mtf-vs-optiland-wavefront",
    r7a: "spot-rays",
    r7b: "spot-vs-optiland",
    r8a: "axial-rays",
    r8b: "axial-vs-optiland",
    r9a: "chief-rays",
    r9b: "chief-vs-optiland",
    r10a: "field-curve-rays",
    r10b: "field-curve-vs-optiland",
    r11a: "vignetting-rays",
    r11b: "vignetting-vs-flux-estimate",
    r12b: "summary-vs-optiland",
    r13b: "seidel-vs-optiland",
    r14b: "zernike-vs-optiland",
  });
  // Every engine's old id to its id: the plan's table, and, for the six renamed, exactly the map the code reads old
  // engine ids by; an engine is found by either id.
  const renamed = ENGINES.filter((engine) => engine.oldId !== engine.id);
  assert.deepEqual(Object.fromEntries(renamed.map((engine) => [engine.oldId, engine.id])), LEGACY_ENGINE_IDS);
  for (const engine of ENGINES) assert.equal(engineOf(engine.oldId), engine, engine.oldId);
  for (const engine of ENGINES) assert.equal(engineOf(engine.id), engine, engine.id);
  assert.deepEqual(Object.fromEntries(ENGINES.map((engine) => [engine.oldId, engine.id])), {
    lv: "lv",
    optiland: "optiland",
    ref: "reference-tracer",
    "ref-seidel": "reference-seidel",
    replay: "replay-of-lv-mtf",
    wave: "wave-mtf-of-lv-rays",
    flux: "flux-of-lv-rays",
    "optiland-wave": "otf-of-optiland-wavefront",
  });
});

test("every built-in engine has a name; an id that is none passes through", () => {
  assert.deepEqual(ENGINES.map((engine) => engine.id).sort(), Object.keys(BUILTIN_ENGINES).sort());
  assert.equal(engineName("ref"), "Reference tracer");
  assert.equal(engineName("fake-a"), "fake-a");
});

test("every verdict, outcome, stale reason, badge, class and row status has a label", () => {
  assert.deepEqual(Object.keys(VERDICT_TEXT), [...VERDICTS]);
  assert.deepEqual(Object.keys(OUTCOME_TEXT), [...CHECK_OUTCOMES]);
  assert.deepEqual(Object.keys(STALE_REASON_TEXT), [...STALE_REASONS]);
  // The badges are the words the dashboard's badges start with.
  const badges = [badgeOf(["case"], []), badgeOf([], []), badgeOf([], ["engine"])].map((badge) => badge.split("(")[0]);
  assert.deepEqual(Object.keys(BADGE_TEXT), badges);
  assert.deepEqual([...DIFFERENCE_CLASSES], Object.keys(DIFFERENCE_CLASS_TEXT));
  assert.deepEqual(Object.keys(CLASS_TEXT), [...DIFFERENCE_CLASSES]);
  assert.deepEqual([...ROW_STATUSES], [...MTF_ROW_STATUSES]);
  assert.deepEqual(Object.keys(ROW_STATUS_TEXT), [...ROW_STATUSES]);
  assert.equal(verdictLabel("PASS"), "Pass: within limit");
  assert.equal(verdictLabel("MAYBE"), "MAYBE");
  assert.equal(outcomeLabel("GONE"), "No longer run");
  assert.equal(staleText(["case", "engine"]), "Out of date: lens data, engine code changed");
  assert.equal(badgeLabel([], ["engine"]), "Unknown: engine code");
  assert.equal(badgeLabel([], []), "Up to date");
  assert.equal(classLabel("method"), "the methods differ");
  assert.equal(rowStatusLabel("SET ASIDE"), "Set aside");
});

test("every quantity, check method, limit kind, class and support status the dashboard shows has a label", () => {
  // The quantities of the contract, each a file of src/contract/quantities whose name constant is the stored name.
  const directory = join(ROOT, "src", "contract", "quantities");
  const names = readdirSync(directory)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => /export const [A-Z_]+ = "([a-z]+\.[a-z-]+)";/.exec(readFileSync(join(directory, file), "utf8"))?.[1])
    .filter((name): name is string => name !== undefined)
    .sort();
  assert.deepEqual(Object.keys(QUANTITY_TEXT).sort(), names);
  assert.equal(quantityLabel("rays.trace"), "Ray trace");
  assert.equal(quantityLabel("no.such"), "no.such");
  assert.deepEqual(Object.keys(METHOD_TEXT), [...RUNG_MODES]);
  assert.deepEqual(Object.keys(CLASS_KIND), [...RUNG_CLASSES]);
  for (const kind of Object.values(CLASS_KIND)) assert.ok(kind in GLOSSARY_TEXT.kinds, kind);
  assert.deepEqual(Object.keys(SUPPORT_STATUS_TEXT), [...SUPPORT_STATUSES]);
  assert.deepEqual(Object.keys(LIMIT_KIND_TEXT), ["tolerance", "attention"]);
  assert.equal(valueLabel(LIMIT_KIND_TEXT, "attention"), "review band");
  assert.equal(valueLabel(LIMIT_KIND_TEXT, "other"), "other");
});

/** Every metric name a committed baseline states. */
function baselineMetricNames(): Set<string> {
  const names = new Set<string>();
  const directory = join(ROOT, "baselines");
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".json"))) {
    const baseline = JSON.parse(readFileSync(join(directory, file), "utf8")) as Baseline;
    for (const run of baseline.runs)
      for (const rung of run.rungs)
        for (const pair of rung.pairs) for (const metric of pair.metrics) names.add(metric.name);
  }
  return names;
}

test("every metric of the limits file, of a comparator and of a committed baseline has a label and a unit", () => {
  const policy = loadPolicy();
  const keys = new Set<string>();
  for (const rung of Object.values(policy.rungs))
    for (const [key, metric] of Object.entries(rung.metrics)) {
      keys.add(key);
      assert.equal(METRICS[key]?.unit, metric.unit, key);
    }
  assert.ok(keys.size > 80, `${keys.size} keys`);
  // A comparator's declared unit is the vocabulary's too. The one exception, stated here: `lines.compared` is a count
  // of lines in R4 and R6a and of elements in R12b, both counts of wavelengths.
  const units = new Map<string, Set<string>>();
  for (const comparator of COMPARATORS.list())
    for (const metric of comparator.metrics) {
      keys.add(metric.name);
      units.set(metric.name, (units.get(metric.name) ?? new Set()).add(metric.unit));
    }
  // A figure of an engine's first answer is in its subject's unit (`metricLabel`'s suffix rule).
  const unitOf = (name: string): string =>
    (METRICS[name] ?? METRICS[name.replace(/\.firstStepMaxAbs$/, ".maxAbs")])?.unit ?? "";
  const declaredOtherwise = [...units].filter(([name, declared]) => declared.size !== 1 || !declared.has(unitOf(name)));
  assert.deepEqual(
    declaredOtherwise.map(([name, declared]) => [name, [...declared].sort()]),
    [["lines.compared", ["elements", "lines"]]],
  );
  assert.equal(METRICS["lines.compared"].unit, "lines");
  for (const name of baselineMetricNames()) keys.add(name);
  for (const key of keys) {
    assert.notEqual(metricLabel(key), key, key);
    assert.ok(metricUnit(key) !== null, key);
  }
  for (const metric of Object.values(METRICS)) assert.ok(Object.hasOwn(UNIT_TEXT, metric.unit), metric.unit);
  assert.equal(
    metricLabel("mtfOffAxis.firstStepMaxAbs"),
    "Largest MTF difference off the axis, at the engine's first, coarser sampling",
  );
  assert.equal(metricLabel("no.suchMetric"), "no.suchMetric");
  assert.equal(metricUnit("no.suchMetric"), null);
});

test("the codes a user meets have a sentence, and a remedy names the configuration key or its variable", () => {
  const lvBinding: Record<LvBindingErrorCode, true> = {
    "not-configured": true,
    "path-missing": true,
    "not-lv-checkout": true,
    "loader-conflict": true,
    "import-failed": true,
    "exports-missing": true,
    "unknown-lens": true,
  };
  // Every code of these lists has words: what makes an engine unavailable, what keeps LensVisualizer from loading
  // (also with the prefix lv-, as a run records it), and every code the exporter and LensVisualizer's MTF gate give;
  // then the codes of answers and jobs a user meets most.
  const expected = [
    ...ENGINE_UNAVAILABLE_CODES,
    ...Object.keys(lvBinding),
    ...Object.keys(lvBinding).map((code) => `lv-${code}`),
    ...EXPORT_PROBLEM_CODES,
    ...LV_GATE_PROBLEM_CODES,
    "stale-case",
    "bad-spec",
    "time-budget",
    "pending",
    "lines.polychromatic",
  ];
  for (const code of expected) assert.ok(Object.hasOwn(CODES, code), code);
  for (const [code, text] of Object.entries(CODES)) {
    assert.match(text.sentence, /\.$/, code);
    if (/lvPath|LVRTC_LV_PATH/.test(text.remedy)) assert.match(text.remedy, /lvrtc\.local\.json.*LVRTC_LV_PATH/, code);
    if (/optiland\.python/.test(text.remedy))
      assert.match(text.remedy, /engines\.optiland\.python in lvrtc\.local\.json.*LVRTC_OPTILAND_PYTHON/, code);
  }
  assert.match(codeText("not-configured"), /^not-configured: .*lvrtc\.local\.json/);
  assert.equal(codeText("no-such-code"), "no-such-code");
});

test("every committed suite has a line, and every line is of a committed suite", () => {
  const directory = join(ROOT, "suites");
  const names = readdirSync(directory)
    .filter((name) => name.endsWith(".json") || statSync(join(directory, name)).isDirectory())
    .map((name) => name.replace(/\.json$/, ""))
    .sort();
  assert.deepEqual(SUITES.map((suite) => suite.name).sort(), names);
});

test("the glossary has every section, term, check and engine, and is the same text whenever it is rendered", () => {
  const glossary = renderGlossary();
  assert.equal(renderGlossary(), glossary);
  assert.ok(glossary.endsWith("\n") && !glossary.endsWith("\n\n"));
  for (const heading of [
    GLOSSARY_TEXT.terms,
    GLOSSARY_TEXT.checks,
    GLOSSARY_TEXT.engines,
    GLOSSARY_TEXT.verdicts,
    GLOSSARY_TEXT.outcomes,
    GLOSSARY_TEXT.classes,
  ])
    assert.ok(glossary.includes(`\n## ${heading}\n`), heading);
  for (const term of TERMS) assert.ok(glossary.includes(`| ${term.term} |`), term.term);
  for (const check of CHECKS) assert.ok(glossary.includes(`### ${check.title}\n`), check.id);
  for (const engine of ENGINES) assert.ok(glossary.includes(`\`${engine.id}\``), engine.id);
  for (const text of strings(GLOSSARY_TEXT)) assert.doesNotMatch(text, /\|/);
  for (const text of [...TERMS.map((term) => term.definition), ...strings(ENGINES), ...strings(VERDICT_TEXT)])
    assert.doesNotMatch(text, /\|/, text);
  assert.ok(Object.keys(CODES).length > 30);
});
