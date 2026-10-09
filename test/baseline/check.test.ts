// The rules of a baseline, its report and the check of one baseline against another, on the contract's fixtures.
// Every number here is synthetic.
import assert from "node:assert/strict";
import { test } from "node:test";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import { checkBaseline, checkFails, stateText } from "../../src/baseline/check.ts";
import { buildBaselineReport, renderBaselineReport } from "../../src/baseline/report.ts";
import { baselineProblems, gravestVerdict } from "../../src/contract/baseline.ts";
import type { Baseline, BaselinePair } from "../../src/contract/baseline.ts";
import { VERDICTS } from "../../src/contract/comparison.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { BASELINE_RAYS, BASELINE_SELFTEST, POLICY_LADDER, edited } from "../contract/corpus.ts";

const R2 = "/runs/0/rungs/1";

function changed(pointer: string, replacement: unknown, base: Baseline = BASELINE_RAYS): Baseline {
  return edited(base, pointer, replacement) as Baseline;
}

test("the valid baseline fixtures keep the rules of a baseline, and read back from their text", () => {
  for (const baseline of [BASELINE_SELFTEST, BASELINE_RAYS]) {
    assert.deepEqual(validateKind("baseline", baseline), []);
    assert.deepEqual(baselineProblems(baseline), []);
    assert.deepEqual(parseBaseline(baselineText(baseline)), { baseline });
  }
  assert.deepEqual(parseBaseline("{"), { problems: ["malformed JSON"] });
  assert.deepEqual(parseBaseline(`${JSON.stringify(BASELINE_SELFTEST)}\n`), {
    problems: ["the file is not the canonical text of its content"],
  });
});

test("each rule of a baseline that its schema cannot state", () => {
  const broken: readonly (readonly [Baseline, RegExp])[] = [
    [changed("/engines/1/id", "zz"), /^engine ref is listed out of order or twice$/],
    [changed("/runs/1", BASELINE_RAYS.runs[0]), /^run zoom-wide is listed twice$/],
    [changed("/runs/0/rungs/1/rung", "r1"), /rung r1: the rung is listed twice$/],
    [changed(`${R2}/support/1/engine`, "lv"), /support lists lv out of order or twice/],
    [changed(`${R2}/rays/2/engine`, "zeta"), /rays names zeta, which is no engine of the baseline/],
    [changed(`${R2}/pairs/0/b`, "absent"), /lv and absent: absent is no engine of the rung/],
    [changed(`${R2}/pairs/1/a`, "ref"), /ref and ref: the first engine does not sort before the second/],
    [changed(`${R2}/pairs/2`, BASELINE_RAYS.runs[0].rungs[1].pairs[0]), /its pairs are out of order or listed twice/],
    [changed(`${R2}/pairs/0/verdicts/0/count`, 2), /its verdicts count 3 requests; the rung has 2/],
    [changed(`${R2}/pairs/0/verdict`, "PASS"), /its verdict is PASS; the gravest of its requests is FLOOR/],
    [
      changed(`${R2}/pairs/0/verdicts`, [...BASELINE_RAYS.runs[0].rungs[1].pairs[0].verdicts].reverse()),
      /its verdicts are out of order or listed twice/,
    ],
  ];
  for (const [baseline, pattern] of broken) {
    assert.deepEqual(validateKind("baseline", baseline), [], String(pattern));
    assert.ok(
      baselineProblems(baseline).some((problem) => pattern.test(problem)),
      `${String(pattern)}: ${baselineProblems(baseline).join("; ")}`,
    );
  }
});

test("the gravest verdict: a failure outweighs a floor, a floor a pass, and an error everything", () => {
  assert.equal(gravestVerdict([]), undefined);
  assert.equal(gravestVerdict(["PASS", "FLOOR", "PASS"]), "FLOOR");
  assert.equal(gravestVerdict(["FLOOR", "FAIL", "UNSUPPORTED"]), "FAIL");
  assert.equal(gravestVerdict(["FAIL", "ERROR", "BLOCKED"]), "ERROR");
  assert.equal(gravestVerdict([...VERDICTS]), "ERROR");
});

test("the report of a baseline: verdicts by run and by request, the worst figure, support and rays", () => {
  const report = buildBaselineReport(BASELINE_RAYS);
  assert.deepEqual(
    report.rungs.map((rung) => [rung.rung, rung.runs, rung.requests]),
    [
      ["r1", 1, 1],
      ["r2", 1, 2],
    ],
  );
  const [r1, r2] = report.rungs;
  assert.deepEqual(r1.support[1], {
    engine: "other",
    statuses: [{ status: "unsupported", runs: 1, details: ["quantity paraxial.first-order"] }],
  });
  const floor = r2.pairs[1];
  assert.deepEqual([floor.a, floor.b, floor.runs], ["lv", "ref", [{ verdict: "FLOOR", count: 1 }]]);
  assert.deepEqual(floor.verdicts, [
    { verdict: "PASS", count: 1 },
    { verdict: "FLOOR", count: 1 },
  ]);
  assert.deepEqual(floor.metrics[0], {
    name: "landing.maxDistance",
    unit: "mm",
    value: 1.25e-8,
    where: { field: 54, line: 0, ray: 4 },
    tolerance: 1e-8,
    run: "zoom-wide",
  });
  // The worst figure is the judged metric that is largest against its tolerance; one that is no number is worst.
  assert.deepEqual(r2.rows[0].pairs[1].worst, {
    name: "landing.maxDistance",
    unit: "mm",
    value: 1.25e-8,
    tolerance: 1e-8,
    ratio: 1.25,
  });
  assert.equal(r2.rows[0].pairs[2].worst?.value, null);

  const { markdown, json } = renderBaselineReport(BASELINE_RAYS);
  assert.deepEqual(renderBaselineReport(JSON.parse(baselineText(BASELINE_RAYS))), { markdown, json });
  assert.match(markdown, /^\| r2 \| rays\.trace \| 1 \| 2 \| lv – ref \| 1 FLOOR \| 1 PASS, 1 FLOOR \|$/m);
  assert.match(markdown, /^\| r1 \| other \| 1 unsupported \(quantity paraxial\.first-order\) \|$/m);
  assert.match(
    markdown,
    /^\| lv – ref \| landing\.maxDistance \(≤ 1\.00e-8 mm\) \| 1\.25e-8 \| zoom-wide \| field 54, line 0, ray 4 \|$/m,
  );
  assert.match(
    markdown,
    /^\| zoom-wide \| 2 \| FLOOR: landing\.maxDistance 1\.25e-8 mm \| FLOOR: landing\.maxDistance 1\.25e-8 mm \| PASS: landing\.maxDistance not finite \| 10 \/ 6 \/ 0 \| 10 \/ 6 \/ 0 \| 10 \/ 6 \/ 0 \|$/m,
  );
  assert.ok(markdown.endsWith("|\n") && !markdown.includes("\r"));
});

// ── The check ────────────────────────────────────────────────────────────────────────────────────────────────────

/** The outcome of every record as `run rung a b: state`. */
function states(committed: Baseline, fresh: Baseline): string[] {
  return checkBaseline(committed, fresh, POLICY_LADDER).map(
    (record) => `${record.rung} ${record.a} ${record.b}: ${stateText(record)}`,
  );
}

test("check: a baseline against itself is OK throughout", () => {
  const records = checkBaseline(BASELINE_RAYS, BASELINE_RAYS, POLICY_LADDER);
  assert.equal(records.length, 6);
  assert.ok(records.every((record) => record.outcome === "OK" && record.stale.length === 0));
  assert.equal(checkFails(records), false);
});

test("check: what makes a record stale: its case, either of its engines by fingerprint or adapter revision, the policy", () => {
  assert.ok(
    states(BASELINE_RAYS, changed("/runs/0/caseId", "0".repeat(64))).every((said) =>
      said.endsWith(": STALE(case) REFRESHABLE"),
    ),
  );
  // The fingerprint of one engine: its pairs, and no other.
  assert.deepEqual(states(BASELINE_RAYS, changed("/engines/1/fingerprint", "another")), [
    "r1 lv other: STALE(engine) REFRESHABLE",
    "r1 lv ref: OK",
    "r1 other ref: STALE(engine) REFRESHABLE",
    "r2 lv other: STALE(engine) REFRESHABLE",
    "r2 lv ref: OK",
    "r2 other ref: STALE(engine) REFRESHABLE",
  ]);
  // The adapter revision alone: the comparator's code behind the engine is another.
  assert.deepEqual(
    states(BASELINE_RAYS, changed("/engines/2/adapterRevision", "another")).filter((said) => said.endsWith(": OK")),
    ["r1 lv other: OK", "r2 lv other: OK"],
  );
  const repolicied = changed("/policy/hash", "f".repeat(64));
  assert.ok(states(BASELINE_RAYS, repolicied).every((said) => said.endsWith(": STALE(policy) REFRESHABLE")));
  const both = changed("/engines/0/fingerprint", "another", changed("/runs/0/caseId", "0".repeat(64)));
  assert.equal(states(BASELINE_RAYS, both)[1], "r1 lv ref: STALE(case,engine) REFRESHABLE");
  // Stale is no failure.
  assert.equal(checkFails(checkBaseline(BASELINE_RAYS, both, POLICY_LADDER)), false);
});

test("check: DRIFT is a verdict that changed or a judged metric that moved past its tolerance, stale or not", () => {
  const pairAt = `${R2}/pairs/1`;
  const pair: BaselinePair = BASELINE_RAYS.runs[0].rungs[1].pairs[1];
  // Within the tolerance of 1e-8 mm, in either direction: no drift.
  for (const value of [1.25e-8 + 9e-9, 1.25e-8 - 9e-9]) {
    assert.equal(states(BASELINE_RAYS, changed(`${pairAt}/metrics/0/value`, value))[4], "r2 lv ref: OK");
  }
  // Past it, with the verdicts as they were.
  const moved = checkBaseline(BASELINE_RAYS, changed(`${pairAt}/metrics/0/value`, 3e-8), POLICY_LADDER)[4];
  assert.equal(moved.outcome, "DRIFT");
  assert.deepEqual(moved.moved, ["landing.maxDistance was 1.25e-8, is 3.00e-8 (tolerance 1.00e-8)"]);
  // A count judged at 0 moves by any change; a metric the policy does not judge never does.
  assert.equal(states(BASELINE_RAYS, changed(`${pairAt}/metrics/1/value`, 1))[4], "r2 lv ref: DRIFT");
  assert.equal(states(BASELINE_RAYS, changed(`${pairAt}/metrics/2/value`, 7))[4], "r2 lv ref: OK");
  // A number that is no longer one.
  const lost = checkBaseline(BASELINE_RAYS, changed(`${pairAt}/metrics/0/value`, null), POLICY_LADDER)[4];
  assert.deepEqual(lost.moved, ["landing.maxDistance was 1.25e-8, is not finite (tolerance 1.00e-8)"]);
  // A verdict: one request that was a floor now passes.
  const passed = { ...pair, verdict: "PASS", verdicts: [{ verdict: "PASS", count: 2 }] };
  const verdict = checkBaseline(BASELINE_RAYS, changed(pairAt, passed), POLICY_LADDER)[4];
  assert.equal(verdict.outcome, "DRIFT");
  assert.deepEqual(verdict.moved, ["verdicts were 1 PASS, 1 FLOOR, are 2 PASS"]);
  // Stale and drifted is DRIFT, and it fails; so does a record that is OK and FAIL today as it was.
  const stale = changed(`${pairAt}/metrics/0/value`, 3e-8, changed("/runs/0/caseId", "0".repeat(64)));
  const records = checkBaseline(BASELINE_RAYS, stale, POLICY_LADDER);
  assert.equal(stateText(records[4]), "STALE(case) DRIFT");
  assert.equal(checkFails(records), true);
  const failing = changed(pairAt, { ...pair, verdict: "FAIL", verdicts: [{ verdict: "FAIL", count: 2 }] });
  const unchanged = checkBaseline(failing, failing, POLICY_LADDER);
  assert.equal(unchanged[4].outcome, "OK");
  assert.equal(checkFails(unchanged), true);
  // With other requests than the baseline's, the kinds of verdict are held, not their counts.
  const fewer = changed(`${R2}/requests`, 1, changed(`${pairAt}/verdicts`, [{ verdict: "FLOOR", count: 1 }]));
  assert.equal(checkBaseline(BASELINE_RAYS, fewer, POLICY_LADDER)[4].outcome, "DRIFT");
});

test("check: a record only one of the two has is GONE or NEW", () => {
  const without = changed("/runs/0/rungs", [BASELINE_RAYS.runs[0].rungs[0]]);
  assert.deepEqual(states(BASELINE_RAYS, without).slice(3), [
    "r2 lv other: GONE",
    "r2 lv ref: GONE",
    "r2 other ref: GONE",
  ]);
  assert.deepEqual(states(without, BASELINE_RAYS).slice(3), [
    "r2 lv other: NEW",
    "r2 lv ref: NEW",
    "r2 other ref: NEW",
  ]);
  assert.equal(checkFails(checkBaseline(without, BASELINE_RAYS, POLICY_LADDER)), false);
});
