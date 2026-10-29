// The quantity `summary.native`: registered at version 1, with the rules its schemas cannot state, and the stdlib
// Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import { SUMMARY_VALUES } from "../../src/contract/quantities/summaryNative.ts";
import type { SummaryNativeData, SummaryNativeSpec } from "../../src/contract/quantities/summaryNative.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { summaryNativeQuantity } from "../../src/quantities/summaryNative.ts";
import {
  SUMMARY_DATA_ONE_LINE,
  SUMMARY_DATA_TWO_LINES,
  SUMMARY_SPEC_ONE_LINE,
  SUMMARY_SPEC_TWO_LINES,
} from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

/** A copy of an answer with line `at` changed. */
function changed(data: SummaryNativeData, change: Record<string, unknown>, at = 0): SummaryNativeData {
  const copy = structuredClone(data);
  Object.assign(copy.lines[at], change);
  return copy;
}

/** Every spec the invariants refuse, each for one rule: a line asked twice. */
function refusedSpecs(): SummaryNativeSpec[] {
  return [{ lines: [0, 1, 0] }];
}

/** Every answer the invariants refuse, each for one rule. */
function refused(): SummaryNativeData[] {
  const reasonless = structuredClone(SUMMARY_DATA_TWO_LINES);
  delete (reasonless.lines[1] as { reason?: string }).reason;
  const nothing = Object.fromEntries(SUMMARY_VALUES.map((name) => [name, null]));
  return [
    // An unavailable line without a reason, and one that states a value.
    reasonless,
    changed(SUMMARY_DATA_TWO_LINES, { focalLengthMm: 50.5 }, 1),
    // An ok line that states nothing.
    changed(SUMMARY_DATA_ONE_LINE, nothing),
    // A value of an ok line that is no finite number.
    changed(SUMMARY_DATA_ONE_LINE, { imageSpaceFNumber: Number.POSITIVE_INFINITY }),
  ];
}

test("summary.native is registered at version 1, and its invariants refuse what its schemas cannot", () => {
  assert.equal(QUANTITIES.get("summary.native"), summaryNativeQuantity);
  assert.equal(summaryNativeQuantity.version, 1);
  for (const spec of [SUMMARY_SPEC_ONE_LINE, SUMMARY_SPEC_TWO_LINES])
    assert.deepEqual(summaryNativeQuantity.validateSpec(spec), []);
  for (const data of [SUMMARY_DATA_ONE_LINE, SUMMARY_DATA_TWO_LINES])
    assert.deepEqual(summaryNativeQuantity.validateData(data), []);
  for (const spec of refusedSpecs()) {
    const issues = summaryNativeQuantity.validateSpec(spec);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  for (const data of refused().slice(0, 3)) {
    const issues = summaryNativeQuantity.validateData(data);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  // A value that is no finite number is refused too, by one issue: JSON has no infinity, so only code can say so.
  assert.equal(summaryNativeQuantity.validateData(refused()[3]).length, 1);
  // A line that states one value and no other is an answer: an engine that states that value alone.
  const one = Object.fromEntries(SUMMARY_VALUES.map((name) => [name, name === "nominalFNumber" ? 2 : null]));
  assert.deepEqual(summaryNativeQuantity.validateData(changed(SUMMARY_DATA_ONE_LINE, one)), []);
});

test(
  "the Python port of the summary.native invariants returns the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const data = [SUMMARY_DATA_ONE_LINE, SUMMARY_DATA_TWO_LINES, ...refused().slice(0, 3)];
    const specs = [SUMMARY_SPEC_ONE_LINE, SUMMARY_SPEC_TWO_LINES, ...refusedSpecs()];
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_summary_native",
      "given = json.load(sys.stdin)",
      "issues = lambda part, values: [[(i.path, i.keyword) for i in validate_summary_native(part, v)] for v in values]",
      'print(json.dumps([issues("data", given["data"]), issues("spec", given["specs"])]))',
    ].join("\n");
    const ended = spawnSync("python3", ["-B", "-c", script], {
      input: JSON.stringify({ data, specs }),
      encoding: "utf8",
      env: { ...process.env, PYTHONPATH: `${REPO_ROOT}/workers/python`, PYTHONDONTWRITEBYTECODE: "1" },
    });
    assert.equal(ended.status, 0, ended.stderr);
    const pairs = (issues: readonly { path: string; keyword: string }[]) => issues.map((i) => [i.path, i.keyword]);
    assert.deepEqual(JSON.parse(ended.stdout), [
      data.map((d) => pairs(summaryNativeQuantity.validateData(d))),
      specs.map((s) => pairs(summaryNativeQuantity.validateSpec(s))),
    ]);
  },
);
