// The quantity `chief.native`: registered at version 1, with the rules its schemas cannot state, and the stdlib
// Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import type { ChiefNativeData, ChiefNativeSpec } from "../../src/contract/quantities/chiefNative.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { chiefNativeQuantity } from "../../src/quantities/chiefNative.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import {
  CHIEF_DATA_DISTORTION,
  CHIEF_DATA_LATERAL,
  CHIEF_DATA_PUPILS,
  CHIEF_SPEC_DISTORTION,
  CHIEF_SPEC_LATERAL,
  CHIEF_SPEC_PUPILS,
} from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

/** A copy of an answer with field `at` changed. */
function changed(data: ChiefNativeData, change: Record<string, unknown>, at = 0): ChiefNativeData {
  const copy = structuredClone(data);
  Object.assign(copy.fields[at], change);
  return copy;
}

/** Every spec the invariants refuse, each for one rule. */
function refusedSpecs(): ChiefNativeSpec[] {
  return [
    // A line asked twice; distortion of two lines; an angle beyond the half field; an angle of 0 of pupils.
    { ...CHIEF_SPEC_LATERAL, lines: [0, 1, 0] },
    { ...CHIEF_SPEC_DISTORTION, lines: [0, 1] },
    { ...CHIEF_SPEC_DISTORTION, fieldAnglesDeg: [5, 25] },
    { ...CHIEF_SPEC_PUPILS, fieldAnglesDeg: [0, 10] },
  ];
}

/** Every answer the invariants refuse, each for one rule. */
function refused(): ChiefNativeData[] {
  const figures = CHIEF_DATA_DISTORTION.fields[0].figures!;
  const reasonless = structuredClone(CHIEF_DATA_DISTORTION);
  delete (reasonless.fields[2] as { reason?: string }).reason;
  return [
    // An unavailable field without a reason, and one with figures.
    reasonless,
    changed(CHIEF_DATA_DISTORTION, { figures: { ...figures } }, 2),
    // An ok field without its landing.
    changed(CHIEF_DATA_DISTORTION, { chiefLandingMm: null }),
    // Lateral colour with figures; distortion without them; pupils with both, and with neither.
    changed(CHIEF_DATA_LATERAL, { figures: { ...figures } }),
    changed(CHIEF_DATA_DISTORTION, { figures: null }),
    changed(CHIEF_DATA_PUPILS, { figures: { ...figures, realHeightMm: null, idealHeightMm: null, percent: null } }),
    changed(CHIEF_DATA_PUPILS, { chiefRay: null }),
    // Figures of distortion without a percent; figures of pupils with a percent.
    changed(CHIEF_DATA_DISTORTION, { figures: { ...figures, percent: null } }),
    changed(CHIEF_DATA_PUPILS, {
      chiefRay: null,
      figures: { ...figures, realHeightMm: null, idealHeightMm: null, entrancePupilZ: 1, exitPupilZ: 2 },
    }),
  ];
}

test("chief.native is registered at version 1, and its invariants refuse what its schemas cannot", () => {
  assert.equal(QUANTITIES.get("chief.native"), chiefNativeQuantity);
  assert.equal(chiefNativeQuantity.version, 1);
  for (const spec of [CHIEF_SPEC_DISTORTION, CHIEF_SPEC_LATERAL, CHIEF_SPEC_PUPILS])
    assert.deepEqual(chiefNativeQuantity.validateSpec(spec), []);
  for (const data of [CHIEF_DATA_DISTORTION, CHIEF_DATA_LATERAL, CHIEF_DATA_PUPILS])
    assert.deepEqual(chiefNativeQuantity.validateData(data), []);
  for (const spec of refusedSpecs()) {
    const issues = chiefNativeQuantity.validateSpec(spec);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  for (const data of refused()) {
    const issues = chiefNativeQuantity.validateData(data);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  // Pupils as figures, every member of the pupils' and no other, is an answer too.
  const figures = { realHeightMm: null, idealHeightMm: null, percent: null, entrancePupilZ: 1.5, exitPupilZ: 2.5 };
  assert.deepEqual(chiefNativeQuantity.validateData(changed(CHIEF_DATA_PUPILS, { chiefRay: null, figures })), []);
});

test(
  "the Python port of the chief.native invariants returns the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const data = [CHIEF_DATA_DISTORTION, CHIEF_DATA_LATERAL, CHIEF_DATA_PUPILS, ...refused()];
    const specs = [CHIEF_SPEC_DISTORTION, CHIEF_SPEC_LATERAL, CHIEF_SPEC_PUPILS, ...refusedSpecs()];
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_chief_native",
      "given = json.load(sys.stdin)",
      "issues = lambda part, values: [[(i.path, i.keyword) for i in validate_chief_native(part, v)] for v in values]",
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
      data.map((d) => pairs(chiefNativeQuantity.validateData(d))),
      specs.map((s) => pairs(chiefNativeQuantity.validateSpec(s))),
    ]);
  },
);
