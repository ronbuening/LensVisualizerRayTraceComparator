// The quantity `vignetting.native`: registered at version 1, with the rules its schemas cannot state, and the stdlib
// Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import type { VignettingNativeData, VignettingNativeSpec } from "../../src/contract/quantities/vignettingNative.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { vignettingNativeQuantity } from "../../src/quantities/vignettingNative.ts";
import {
  VIGNETTING_DATA_ONE_LINE,
  VIGNETTING_DATA_TWO_LINES,
  VIGNETTING_SPEC_ONE_LINE,
  VIGNETTING_SPEC_TWO_LINES,
} from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

/** A copy of an answer with field `at` changed. */
function changed(data: VignettingNativeData, change: Record<string, unknown>, at = 0): VignettingNativeData {
  const copy = structuredClone(data);
  Object.assign(copy.fields[at], change);
  return copy;
}

/** Every spec the invariants refuse, each for one rule. */
function refusedSpecs(): VignettingNativeSpec[] {
  // A line asked twice; a first angle that is not the axis; an angle beyond the half field.
  return [
    { ...VIGNETTING_SPEC_TWO_LINES, lines: [0, 1, 0] },
    { ...VIGNETTING_SPEC_TWO_LINES, fieldAnglesDeg: [10, 0, 20] },
    { ...VIGNETTING_SPEC_ONE_LINE, fieldAnglesDeg: [0, 25] },
  ];
}

/** Every answer the invariants refuse, each for one rule. */
function refused(): VignettingNativeData[] {
  const reasonless = structuredClone(VIGNETTING_DATA_ONE_LINE);
  delete (reasonless.fields[3] as { reason?: string }).reason;
  const unconvergedReasonless = structuredClone(VIGNETTING_DATA_TWO_LINES);
  delete (unconvergedReasonless.fields[5] as { reason?: string }).reason;
  return [
    // An unavailable field without a reason, and one with a figure.
    reasonless,
    changed(VIGNETTING_DATA_ONE_LINE, { relativeIllumination: 0.25 }, 3),
    // An ok field without its transmission; an unconverged field that does not say why.
    changed(VIGNETTING_DATA_ONE_LINE, { geometricTransmission: null }),
    unconvergedReasonless,
    // A figure of an ok field that is no finite number.
    changed(VIGNETTING_DATA_TWO_LINES, { relativeIllumination: Number.POSITIVE_INFINITY }),
  ];
}

test("vignetting.native is registered at version 1, and its invariants refuse what its schemas cannot", () => {
  assert.equal(QUANTITIES.get("vignetting.native"), vignettingNativeQuantity);
  assert.equal(vignettingNativeQuantity.version, 1);
  for (const spec of [VIGNETTING_SPEC_ONE_LINE, VIGNETTING_SPEC_TWO_LINES])
    assert.deepEqual(vignettingNativeQuantity.validateSpec(spec), []);
  for (const data of [VIGNETTING_DATA_ONE_LINE, VIGNETTING_DATA_TWO_LINES])
    assert.deepEqual(vignettingNativeQuantity.validateData(data), []);
  for (const spec of refusedSpecs()) {
    const issues = vignettingNativeQuantity.validateSpec(spec);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  for (const data of refused().slice(0, 4)) {
    const issues = vignettingNativeQuantity.validateData(data);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  // A figure that is no finite number is refused too, by one issue.
  assert.equal(vignettingNativeQuantity.validateData(refused()[4]).length, 1);
  // A field without a landing is an answer: an engine that states no landing.
  assert.deepEqual(
    vignettingNativeQuantity.validateData(changed(VIGNETTING_DATA_ONE_LINE, { chiefLandingMm: null })),
    [],
  );
});

test(
  "the Python port of the vignetting.native invariants returns the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const data = [VIGNETTING_DATA_ONE_LINE, VIGNETTING_DATA_TWO_LINES, ...refused().slice(0, 4)];
    const specs = [VIGNETTING_SPEC_ONE_LINE, VIGNETTING_SPEC_TWO_LINES, ...refusedSpecs()];
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_vignetting_native",
      "given = json.load(sys.stdin)",
      "issues = lambda part, values: [[(i.path, i.keyword) for i in validate_vignetting_native(part, v)] for v in values]",
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
      data.map((d) => pairs(vignettingNativeQuantity.validateData(d))),
      specs.map((s) => pairs(vignettingNativeQuantity.validateSpec(s))),
    ]);
  },
);
