import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { wavefrontNativeQuantity } from "../../src/quantities/wavefrontNative.ts";
import { WAVEFRONT_DATA, WAVEFRONT_SPEC } from "../contract/corpus.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { PYTHON_MISSING } from "../engines/support.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";

function changedSample(name: string, value: unknown) {
  const data = structuredClone(WAVEFRONT_DATA);
  Object.assign(data.fields[0].samples[0], { [name]: value });
  return data;
}
const F = (values: number[], shape?: number[]) => encodeNdArray(Float64Array.from(values), shape);

test("wavefront.native v1 invariants: even grids, shapes, finite values, row coordinates and light", () => {
  assert.equal(QUANTITIES.get("wavefront.native"), wavefrontNativeQuantity);
  assert.equal(wavefrontNativeQuantity.version, 1);
  assert.deepEqual(wavefrontNativeQuantity.validateData(WAVEFRONT_DATA), []);
  assert.deepEqual(wavefrontNativeQuantity.validateSpec(WAVEFRONT_SPEC), []);
  for (const grids of [[5], [8, 4]])
    assert.ok(wavefrontNativeQuantity.validateSpec({ ...WAVEFRONT_SPEC, grids }).length > 0);
  const bads = [
    changedSample("gridSize", 6),
    changedSample("pupilMm", F([0, 0, 0], [1, 3])),
    changedSample("opdWaves", F(new Array(16).fill(NaN))),
    changedSample("valid", encodeNdArray(new Uint8Array(16).fill(2))),
    changedSample("normalizedPupil", F(new Array(32).fill(0), [16, 2])),
    changedSample("intensity", F(new Array(16).fill(-1))),
  ];
  const unavailable = structuredClone(WAVEFRONT_DATA);
  delete (unavailable.fields[1] as { reason?: string }).reason;
  bads.push(unavailable);
  for (const data of bads) assert.ok(wavefrontNativeQuantity.validateData(data).length > 0);
});

test("the Python wavefront invariant port returns the same path and keyword", { skip: PYTHON_MISSING }, () => {
  const unavailable = structuredClone(WAVEFRONT_DATA);
  delete (unavailable.fields[1] as { reason?: string }).reason;
  const data = [
    WAVEFRONT_DATA,
    changedSample("gridSize", 6),
    changedSample("pupilMm", F([0, 0, 0], [1, 3])),
    changedSample("opdWaves", F(new Array(16).fill(NaN))),
    changedSample("valid", encodeNdArray(new Uint8Array(16).fill(2))),
    changedSample("normalizedPupil", F(new Array(32).fill(0), [16, 2])),
    changedSample("intensity", F(new Array(16).fill(-1))),
    unavailable,
  ];
  const script =
    'import json,sys\nfrom lvrtc_worker_kit.validate import validate_wavefront_native\nprint(json.dumps([[(i.path,i.keyword) for i in validate_wavefront_native("data",d)] for d in json.load(sys.stdin)]))';
  const ended = spawnSync("python3", ["-B", "-c", script], {
    input: JSON.stringify(data),
    encoding: "utf8",
    env: { ...process.env, PYTHONPATH: `${REPO_ROOT}/workers/python`, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.equal(ended.status, 0, ended.stderr);
  assert.deepEqual(
    JSON.parse(ended.stdout),
    data.map((d) => wavefrontNativeQuantity.validateData(d).map((i) => [i.path, i.keyword])),
  );
});
