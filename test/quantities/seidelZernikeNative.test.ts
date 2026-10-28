// The quantities `seidel.native` and `zernike.native`: registered at version 1, with the rules their schemas cannot
// state, and the stdlib Python port of those rules giving the same issues.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import type { SeidelNativeData, SeidelNativeSpec } from "../../src/contract/quantities/seidelNative.ts";
import type { ZernikeNativeData, ZernikeNativeSpec } from "../../src/contract/quantities/zernikeNative.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { seidelNativeQuantity } from "../../src/quantities/seidelNative.ts";
import { zernikeNativeQuantity } from "../../src/quantities/zernikeNative.ts";
import {
  SEIDEL_DATA_TWO_SURFACES,
  SEIDEL_DATA_UNAVAILABLE,
  SEIDEL_SPEC_DISPERSION,
  SEIDEL_SPEC_ONE_LINE,
  ZERNIKE_DATA_FRINGE,
  ZERNIKE_DATA_STANDARD,
  ZERNIKE_SPEC_FRINGE,
  ZERNIKE_SPEC_STANDARD,
} from "../contract/corpus.ts";
import { PYTHON_MISSING } from "../engines/support.ts";

/** Every Seidel spec the invariants refuse, each for one rule: one dispersion line twice. */
const SEIDEL_REFUSED_SPECS: SeidelNativeSpec[] = [{ ...SEIDEL_SPEC_DISPERSION, dispersionLines: [1, 1] }];

/** Every Seidel answer the invariants refuse, each for one rule. */
function seidelRefused(): SeidelNativeData[] {
  const ok = SEIDEL_DATA_TWO_SURFACES;
  const reasonless = structuredClone(SEIDEL_DATA_UNAVAILABLE);
  delete (reasonless as { reason?: string }).reason;
  return [
    // An unavailable answer without a reason, and one that states a value.
    reasonless,
    { ...SEIDEL_DATA_UNAVAILABLE, invariant: 1.25 },
    // An ok answer without a total of third order.
    { ...ok, total: { ...ok.total, DIST: null } },
    // Surfaces that do not ascend.
    { ...ok, surfaces: [ok.surfaces[1], ok.surfaces[0]] },
    // A chromatic sum without dispersion lines.
    { ...ok, dispersionLines: null, total: { ...ok.total, CLA: 0.25, CTR: null } },
    // One dispersion line twice.
    { ...ok, dispersionLines: [1, 1] },
  ];
}

/** Every Zernike spec the invariants refuse, each for one rule: an odd grid, a Fringe fit of 38 terms. */
const ZERNIKE_REFUSED_SPECS: ZernikeNativeSpec[] = [
  { ...ZERNIKE_SPEC_STANDARD, grid: 9 },
  { ...ZERNIKE_SPEC_FRINGE, terms: 38 },
];

/** Every Zernike answer the invariants refuse, each for one rule. */
function zernikeRefused(): ZernikeNativeData[] {
  const [ok, dark] = ZERNIKE_DATA_STANDARD.fields;
  const answer = (fields: ZernikeNativeData["fields"]): ZernikeNativeData => ({ ...ZERNIKE_DATA_STANDARD, fields });
  return [
    // An unavailable field that states a figure.
    answer([ok, { ...dark, rmsToChiefWaves: 0.0625 }]),
    // An ok field of fewer coefficients than terms.
    answer([{ ...ok, coefficients: [0.125] }, dark]),
    // An ok field without a figure.
    answer([{ ...ok, pvToChiefWaves: null }, dark]),
    // An ok field of fewer valid samples than terms.
    answer([{ ...ok, validSamples: 3 }, dark]),
    // An odd grid.
    { ...ZERNIKE_DATA_STANDARD, grid: 9 },
  ];
}

test("seidel.native and zernike.native are registered at version 1, and their invariants refuse what schemas cannot", () => {
  assert.equal(QUANTITIES.get("seidel.native"), seidelNativeQuantity);
  assert.equal(QUANTITIES.get("zernike.native"), zernikeNativeQuantity);
  assert.equal(seidelNativeQuantity.version, 1);
  assert.equal(zernikeNativeQuantity.version, 1);
  for (const spec of [SEIDEL_SPEC_ONE_LINE, SEIDEL_SPEC_DISPERSION])
    assert.deepEqual(seidelNativeQuantity.validateSpec(spec), []);
  for (const data of [SEIDEL_DATA_TWO_SURFACES, SEIDEL_DATA_UNAVAILABLE])
    assert.deepEqual(seidelNativeQuantity.validateData(data), []);
  for (const spec of [ZERNIKE_SPEC_STANDARD, ZERNIKE_SPEC_FRINGE])
    assert.deepEqual(zernikeNativeQuantity.validateSpec(spec), []);
  for (const data of [ZERNIKE_DATA_STANDARD, ZERNIKE_DATA_FRINGE])
    assert.deepEqual(zernikeNativeQuantity.validateData(data), []);
  const one = (issues: readonly { keyword: string }[]): void => {
    assert.equal(issues.length, 1, JSON.stringify(issues));
    assert.equal(issues[0].keyword, "invariant");
  };
  for (const spec of SEIDEL_REFUSED_SPECS) one(seidelNativeQuantity.validateSpec(spec));
  for (const data of seidelRefused()) one(seidelNativeQuantity.validateData(data));
  for (const spec of ZERNIKE_REFUSED_SPECS) one(zernikeNativeQuantity.validateSpec(spec));
  for (const data of zernikeRefused()) one(zernikeNativeQuantity.validateData(data));
  // A value that is no finite number is refused too, by one issue: JSON has no infinity, so only code can say so.
  const infinite = { ...SEIDEL_DATA_TWO_SURFACES, total: { ...SEIDEL_DATA_TWO_SURFACES.total, SPHA: Infinity } };
  assert.equal(seidelNativeQuantity.validateData(infinite).length, 1);
});

test(
  "the Python ports of the seidel.native and zernike.native invariants return the same paths and keywords",
  { skip: PYTHON_MISSING },
  () => {
    const given = {
      seidel: {
        data: [SEIDEL_DATA_TWO_SURFACES, SEIDEL_DATA_UNAVAILABLE, ...seidelRefused()],
        specs: [SEIDEL_SPEC_ONE_LINE, SEIDEL_SPEC_DISPERSION, ...SEIDEL_REFUSED_SPECS],
      },
      zernike: {
        data: [ZERNIKE_DATA_STANDARD, ZERNIKE_DATA_FRINGE, ...zernikeRefused()],
        specs: [ZERNIKE_SPEC_STANDARD, ZERNIKE_SPEC_FRINGE, ...ZERNIKE_REFUSED_SPECS],
      },
    };
    const script = [
      "import json,sys",
      "from lvrtc_worker_kit.validate import validate_seidel_native, validate_zernike_native",
      "given = json.load(sys.stdin)",
      "out = {}",
      "for name, check in (('seidel', validate_seidel_native), ('zernike', validate_zernike_native)):",
      "    of = lambda part: [[(i.path, i.keyword) for i in check(part, v)] for v in given[name][part + 's' if part == 'spec' else part]]",
      "    out[name] = [of('data'), of('spec')]",
      "print(json.dumps(out))",
    ].join("\n");
    const ended = spawnSync("python3", ["-B", "-c", script], {
      input: JSON.stringify(given),
      encoding: "utf8",
      env: { ...process.env, PYTHONPATH: `${REPO_ROOT}/workers/python`, PYTHONDONTWRITEBYTECODE: "1" },
    });
    assert.equal(ended.status, 0, ended.stderr);
    const pairs = (issues: readonly { path: string; keyword: string }[]) => issues.map((i) => [i.path, i.keyword]);
    assert.deepEqual(JSON.parse(ended.stdout), {
      seidel: [
        given.seidel.data.map((d) => pairs(seidelNativeQuantity.validateData(d))),
        given.seidel.specs.map((s) => pairs(seidelNativeQuantity.validateSpec(s))),
      ],
      zernike: [
        given.zernike.data.map((d) => pairs(zernikeNativeQuantity.validateData(d))),
        given.zernike.specs.map((s) => pairs(zernikeNativeQuantity.validateSpec(s))),
      ],
    });
  },
);
