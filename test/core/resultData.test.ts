import assert from "node:assert/strict";
import { test } from "node:test";

import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import type { QuantityModule } from "../../src/quantities/module.ts";
import { SELFTEST_ECHO_EXAMPLES } from "../contract/corpus.ts";

const echo = QUANTITIES.get(SELFTEST_ECHO) as QuantityModule;
/** A quantity whose schema accepts anything, so that only the arrays are judged. */
const anything: QuantityModule = { id: "test.anything", version: 1, validateSpec: () => [], validateData: () => [] };

const ARRAY = encodeNdArray(Float64Array.of(1, 2, 3));

/** `wire` with one member of its `$nd` replaced. */
function bent(wire: NdArrayWire, member: Partial<NdArrayWire["$nd"]>): NdArrayWire {
  return { $nd: { ...wire.$nd, ...member } };
}

test("the data of every conformance example has no problems", () => {
  for (const [name, { data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    assert.deepEqual(resultDataProblems(echo, data), [], name);
  }
});

test("data that is not the quantity's is one problem that lists every schema issue", () => {
  assert.deepEqual(resultDataProblems(echo, { values: "nope", total: 3 }), [
    'it is not selftest.echo data: (root) [required] missing property "sum"; ' +
      "/total [additionalProperties] unexpected property; /values [type] expected object, got string",
  ]);
  assert.equal(resultDataProblems(echo, undefined).length, 1);
  assert.equal(resultDataProblems(echo, null).length, 1);
});

test("an array whose bytes do not hash to its digest is a problem the schema cannot see", () => {
  const forged = bent(ARRAY, { sha256: "0".repeat(64) });
  assert.deepEqual(echo.validateData({ values: forged, sum: 6 }), []);
  const problems = resultDataProblems(echo, { values: forged, sum: 6 });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /^\/values: ndarray: sha256 mismatch/);
});

test("so is an array with fewer bytes than its shape needs, and one whose base64 is not canonical", () => {
  const short = bent(ARRAY, { shape: [4] });
  assert.match(resultDataProblems(echo, { values: short, sum: 6 })[0], /^\/values: ndarray: data is 24 bytes but/);
  // "AAAAAAAA8D8=" and "AAAAAAAA8D9=" decode to the same bytes; only the first is how those bytes are written.
  const one = encodeNdArray(Float64Array.of(1));
  assert.equal(one.$nd.data, "AAAAAAAA8D8=");
  const loose = bent(one, { data: "AAAAAAAA8D9=" });
  assert.match(resultDataProblems(echo, { values: loose, sum: 1 })[0], /^\/values: ndarray: data is not canonical/);
});

test("arrays are found wherever they sit, and each one that does not decode is named by its JSON Pointer", () => {
  const bad = bent(ARRAY, { sha256: "0".repeat(64) });
  const data = {
    fine: ARRAY,
    list: [ARRAY, bad, { deeper: bad }],
    "odd/key~name": { inner: bad },
    notAnArray: { nd: 1, text: "$nd" },
  };
  assert.deepEqual(
    resultDataProblems(anything, data).map((problem) => problem.split(": ")[0]),
    ["/list/1", "/list/2/deeper", "/odd~1key~0name/inner"],
  );
  assert.deepEqual(resultDataProblems(anything, { fine: ARRAY, list: [ARRAY] }), []);
  assert.match(resultDataProblems(anything, bad)[0], /^\(root\): ndarray: sha256 mismatch/);
});

test("something that only looks like an array is a problem too: it would not decode", () => {
  assert.match(resultDataProblems(anything, { values: { $nd: 3 } })[0], /^\/values: ndarray: "\$nd" must be an object/);
  assert.match(
    resultDataProblems(anything, { values: { $nd: ARRAY.$nd, extra: 1 } })[0],
    /^\/values: ndarray: unexpected key "extra" beside "\$nd"/,
  );
});
