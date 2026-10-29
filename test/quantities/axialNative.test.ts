// The quantity `axial.native`: registered at version 1, with the rules its schemas cannot state, and the stdlib
// Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import type { AxialNativeData } from "../../src/contract/quantities/axialNative.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { axialNativeQuantity } from "../../src/quantities/axialNative.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import {
  AXIAL_DATA_COLOUR,
  AXIAL_DATA_SPHERICAL,
  AXIAL_SPEC_COLOUR,
  AXIAL_SPEC_SPHERICAL,
} from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

const F = (...values: number[]) => encodeNdArray(Float64Array.from(values));

/** A copy of an answer with line `at` changed. */
function changed(data: AxialNativeData, change: Record<string, unknown>, at = 0): AxialNativeData {
  const copy = structuredClone(data);
  Object.assign(copy.fields[at], change);
  return copy;
}

/** The colour answer with its unavailable line's reason taken away. */
function reasonless(): AxialNativeData {
  const copy = structuredClone(AXIAL_DATA_COLOUR);
  delete (copy.fields[2] as { reason?: string }).reason;
  return copy;
}

/** Every answer the invariants refuse, each for one rule. */
function refused(): AxialNativeData[] {
  const rays = AXIAL_DATA_COLOUR.fields[0].rays!;
  const figures = AXIAL_DATA_SPHERICAL.fields[0].figures!;
  return [
    // An unavailable line without a reason, and one with figures.
    reasonless(),
    changed(AXIAL_DATA_COLOUR, { figures: { ...figures } }, 2),
    // An ok line with both, and with neither.
    changed(AXIAL_DATA_SPHERICAL, { rays }),
    changed(AXIAL_DATA_SPHERICAL, { figures: null }),
    // Figures of spherical aberration without the best focus; figures of colour with it.
    changed(AXIAL_DATA_SPHERICAL, { figures: { ...figures, bestFocusZ: null } }),
    { ...changed(AXIAL_DATA_SPHERICAL, {}), kind: "colour" },
    // Rays whose arrays do not agree, a fraction of 0, an arrival of 2.
    changed(AXIAL_DATA_COLOUR, { rays: { ...rays, fractions: F(0.875) } }),
    changed(AXIAL_DATA_COLOUR, { rays: { ...rays, exitPoint: encodeNdArray(new Float64Array(4), [2, 2]) } }),
    changed(AXIAL_DATA_COLOUR, { rays: { ...rays, fractions: F(0.875, 0) } }),
    changed(AXIAL_DATA_COLOUR, { rays: { ...rays, arrived: encodeNdArray(Uint8Array.of(2, 1)) } }),
  ];
}

test("axial.native is registered at version 1, and its invariants refuse what its schemas cannot", () => {
  assert.equal(QUANTITIES.get("axial.native"), axialNativeQuantity);
  assert.equal(axialNativeQuantity.version, 1);
  for (const spec of [AXIAL_SPEC_SPHERICAL, AXIAL_SPEC_COLOUR])
    assert.deepEqual(axialNativeQuantity.validateSpec(spec), []);
  for (const data of [AXIAL_DATA_SPHERICAL, AXIAL_DATA_COLOUR])
    assert.deepEqual(axialNativeQuantity.validateData(data), []);
  assert.deepEqual(
    axialNativeQuantity
      .validateSpec({ ...AXIAL_SPEC_COLOUR, lines: [0, 1, 0] })
      .map(({ path, keyword }) => [path, keyword]),
    [["/lines", "invariant"]],
  );
  for (const data of refused()) {
    const issues = axialNativeQuantity.validateData(data);
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  }
  // A ray that did not arrive is NaN in the exits, and that is no fault.
  assert.deepEqual(axialNativeQuantity.validateData(changed(AXIAL_DATA_COLOUR, {})), []);
});

test(
  "the Python port of the axial.native invariants returns the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const data = [AXIAL_DATA_SPHERICAL, AXIAL_DATA_COLOUR, ...refused()];
    const specs = [AXIAL_SPEC_SPHERICAL, AXIAL_SPEC_COLOUR, { ...AXIAL_SPEC_COLOUR, lines: [0, 1, 0] }];
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_axial_native",
      "given = json.load(sys.stdin)",
      "issues = lambda part, values: [[(i.path, i.keyword) for i in validate_axial_native(part, v)] for v in values]",
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
      data.map((d) => pairs(axialNativeQuantity.validateData(d))),
      specs.map((s) => pairs(axialNativeQuantity.validateSpec(s))),
    ]);
  },
);
