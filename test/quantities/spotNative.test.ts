// The quantity `spot.native`: registered at version 1, with the rules its schemas cannot state, and the stdlib
// Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import { REPO_ROOT } from "../../src/core/config.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { spotNativeQuantity } from "../../src/quantities/spotNative.ts";
import { SPOT_DATA_FAN, SPOT_DATA_RINGS, SPOT_SPEC_FAN, SPOT_SPEC_RINGS } from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

const F = (...values: number[]) => encodeNdArray(Float64Array.from(values));

/** A copy of an answer with field 0 changed. */
function changed(data: typeof SPOT_DATA_RINGS, change: Record<string, unknown>) {
  const copy = structuredClone(data);
  Object.assign(copy.fields[0], change);
  return copy;
}

/** Every answer the invariants refuse, each for one rule. */
function refused() {
  const reasonless = structuredClone(SPOT_DATA_RINGS);
  delete (reasonless.fields[1] as { reason?: string }).reason;
  return [
    reasonless,
    changed(SPOT_DATA_RINGS, { spot: null }),
    changed(SPOT_DATA_RINGS, { fan: { pupil: F(0), errorMm: F(0) } }),
    changed(SPOT_DATA_FAN, { fan: null }),
    changed(SPOT_DATA_FAN, { spot: { centroidMm: [0, 0], rmsRadiusMm: 0 } }),
    changed(SPOT_DATA_FAN, { fan: { pupil: F(-1, 0, 1), errorMm: F(0, 0) } }),
    changed(SPOT_DATA_FAN, { fan: { pupil: F(), errorMm: F() } }),
    changed(SPOT_DATA_FAN, { fan: { pupil: F(-1, 0, 1.5), errorMm: F(0, 0, 0) } }),
    changed(SPOT_DATA_FAN, { fan: { pupil: F(-1, NaN, 1), errorMm: F(0, 0, 0) } }),
    {
      ...SPOT_DATA_RINGS,
      fields: [{ ...SPOT_DATA_RINGS.fields[1], spot: { centroidMm: [0, 0], rmsRadiusMm: 1 } }],
    },
  ];
}

test("spot.native is registered at version 1, and its invariants refuse what its schemas cannot", () => {
  assert.equal(QUANTITIES.get("spot.native"), spotNativeQuantity);
  assert.equal(spotNativeQuantity.version, 1);
  for (const spec of [SPOT_SPEC_RINGS, SPOT_SPEC_FAN]) assert.deepEqual(spotNativeQuantity.validateSpec(spec), []);
  for (const data of [SPOT_DATA_RINGS, SPOT_DATA_FAN]) assert.deepEqual(spotNativeQuantity.validateData(data), []);
  // A fan has an odd number of samples: its middle one is the chief ray's place.
  const even = { ...SPOT_SPEC_FAN, pupil: { kind: "fan", axis: "sagittal", samples: 6 } };
  assert.deepEqual(
    spotNativeQuantity.validateSpec(even).map(({ path, keyword }) => [path, keyword]),
    [["/pupil/samples", "invariant"]],
  );
  for (const data of refused()) {
    const issues = spotNativeQuantity.validateData(data);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  // A sample that did not land is NaN in the errors, and that is no fault.
  assert.deepEqual(spotNativeQuantity.validateData(changed(SPOT_DATA_FAN, {})), []);
});

test(
  "the Python port of the spot.native invariants returns the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const data = [SPOT_DATA_RINGS, SPOT_DATA_FAN, ...refused()];
    const specs = [
      SPOT_SPEC_RINGS,
      SPOT_SPEC_FAN,
      { ...SPOT_SPEC_FAN, pupil: { kind: "fan", axis: "sagittal", samples: 6 } },
    ];
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_spot_native",
      "given = json.load(sys.stdin)",
      "issues = lambda part, values: [[(i.path, i.keyword) for i in validate_spot_native(part, v)] for v in values]",
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
      data.map((d) => pairs(spotNativeQuantity.validateData(d))),
      specs.map((s) => pairs(spotNativeQuantity.validateSpec(s))),
    ]);
  },
);
