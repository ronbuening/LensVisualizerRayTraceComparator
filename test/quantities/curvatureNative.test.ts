// The quantity `curvature.native`: registered at version 1, with the rules its schemas cannot state, and the stdlib
// Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import type { CurvatureNativeData, CurvatureNativeSpec } from "../../src/contract/quantities/curvatureNative.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { curvatureNativeQuantity } from "../../src/quantities/curvatureNative.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import {
  CURVATURE_DATA_ONE_LINE,
  CURVATURE_DATA_TWO_LINES,
  CURVATURE_SPEC_ONE_LINE,
  CURVATURE_SPEC_TWO_LINES,
} from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

/** A copy of an answer with field `at` changed. */
function changed(data: CurvatureNativeData, change: Record<string, unknown>, at = 0): CurvatureNativeData {
  const copy = structuredClone(data);
  Object.assign(copy.fields[at], change);
  return copy;
}

/** Every spec the invariants refuse, each for one rule. */
function refusedSpecs(): CurvatureNativeSpec[] {
  // A line asked twice; an angle beyond the half field.
  return [
    { ...CURVATURE_SPEC_TWO_LINES, lines: [0, 1, 0] },
    { ...CURVATURE_SPEC_ONE_LINE, fieldAnglesDeg: [0, 25] },
  ];
}

/** Every answer the invariants refuse, each for one rule. */
function refused(): CurvatureNativeData[] {
  const reasonless = structuredClone(CURVATURE_DATA_ONE_LINE);
  delete (reasonless.fields[3] as { reason?: string }).reason;
  return [
    // An unavailable field without a reason, and one with a focus.
    reasonless,
    changed(CURVATURE_DATA_ONE_LINE, { tangentialShiftMm: 0.25 }, 3),
    // An ok field without its sagittal focus, and one whose tangential focus is no finite number.
    changed(CURVATURE_DATA_ONE_LINE, { sagittalShiftMm: null }),
    changed(CURVATURE_DATA_TWO_LINES, { tangentialShiftMm: Number.POSITIVE_INFINITY }),
  ];
}

test("curvature.native is registered at version 1, and its invariants refuse what its schemas cannot", () => {
  assert.equal(QUANTITIES.get("curvature.native"), curvatureNativeQuantity);
  assert.equal(curvatureNativeQuantity.version, 1);
  for (const spec of [CURVATURE_SPEC_ONE_LINE, CURVATURE_SPEC_TWO_LINES])
    assert.deepEqual(curvatureNativeQuantity.validateSpec(spec), []);
  for (const data of [CURVATURE_DATA_ONE_LINE, CURVATURE_DATA_TWO_LINES])
    assert.deepEqual(curvatureNativeQuantity.validateData(data), []);
  for (const spec of refusedSpecs()) {
    const issues = curvatureNativeQuantity.validateSpec(spec);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  for (const data of refused().slice(0, 3)) {
    const issues = curvatureNativeQuantity.validateData(data);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  // A focus of an ok field that is no finite number is refused too, by one issue.
  assert.equal(curvatureNativeQuantity.validateData(refused()[3]).length, 1);
  // An ok field without a landing is an answer: an engine that states no landing of the chief ray its foci are of.
  assert.deepEqual(
    curvatureNativeQuantity.validateData(changed(CURVATURE_DATA_ONE_LINE, { chiefLandingMm: null })),
    [],
  );
});

test(
  "the Python port of the curvature.native invariants returns the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const data = [CURVATURE_DATA_ONE_LINE, CURVATURE_DATA_TWO_LINES, ...refused().slice(0, 3)];
    const specs = [CURVATURE_SPEC_ONE_LINE, CURVATURE_SPEC_TWO_LINES, ...refusedSpecs()];
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_curvature_native",
      "given = json.load(sys.stdin)",
      "issues = lambda part, values: [[(i.path, i.keyword) for i in validate_curvature_native(part, v)] for v in values]",
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
      data.map((d) => pairs(curvatureNativeQuantity.validateData(d))),
      specs.map((s) => pairs(curvatureNativeQuantity.validateSpec(s))),
    ]);
  },
);
