// The quantity `mtf.native`: its registration and the rules its schema files cannot state. The fixture corpus holds
// the schemas themselves; every number here is synthetic.
import assert from "node:assert/strict";
import { test } from "node:test";

import { MTF_DESIGN_PLANE, MTF_NATIVE, MTF_NATIVE_VERSION } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../src/contract/quantities/mtfNative.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { INVARIANT_KEYWORD } from "../../src/quantities/module.ts";
import { mtfNativeQuantity } from "../../src/quantities/mtfNative.ts";
import {
  MTF_DATA_BEST_FOCUS,
  MTF_DATA_FRACTIONS,
  MTF_SPEC_FRACTIONS,
  MTF_SPEC_PROFILE,
  edited,
} from "../contract/corpus.ts";

function curve(...values: number[]) {
  return encodeNdArray(Float64Array.from(values));
}

/** The invariant issues of a value, as `path: message`. */
function broken(part: "spec" | "data", value: unknown): string[] {
  const issues = part === "spec" ? mtfNativeQuantity.validateSpec(value) : mtfNativeQuantity.validateData(value);
  for (const issue of issues) assert.equal(issue.keyword, INVARIANT_KEYWORD, JSON.stringify(issue));
  return issues.map((issue) => `${issue.path}: ${issue.message}`);
}

test("mtf.native is registered at the version the contract states, and the rungs that ask for it are r4f and r6b", () => {
  assert.equal(MTF_NATIVE, "mtf.native");
  assert.equal(MTF_NATIVE_VERSION, 1);
  assert.equal(QUANTITIES.get("mtf.native"), mtfNativeQuantity);
  assert.deepEqual([mtfNativeQuantity.id, mtfNativeQuantity.version], [MTF_NATIVE, 1]);
  assert.deepEqual(
    RUNGS.filter((rung) => rung.quantity === MTF_NATIVE).map((rung) => rung.id),
    ["r4f", "r6b"],
  );
  assert.equal(MTF_DESIGN_PLANE, "design");
});

test("the examples of the contract are valid, and their arrays decode", () => {
  for (const spec of [MTF_SPEC_FRACTIONS, MTF_SPEC_PROFILE]) assert.deepEqual(mtfNativeQuantity.validateSpec(spec), []);
  for (const data of [MTF_DATA_FRACTIONS, MTF_DATA_BEST_FOCUS]) {
    assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  }
});

test("a spec's frequencies ascend", () => {
  const spec = (frequenciesPerMm: number[]): MtfNativeSpec => ({ ...MTF_SPEC_FRACTIONS, frequenciesPerMm });
  assert.deepEqual(broken("spec", spec([0, 10, 30])), []);
  assert.deepEqual(broken("spec", spec([30])), []);
  assert.deepEqual(broken("spec", spec([10, 30, 20])), [
    "/frequenciesPerMm/2: the frequencies must ascend: 20 follows 30",
  ]);
  // The schema, not the invariant, refuses a frequency that is given twice.
  assert.deepEqual(
    mtfNativeQuantity.validateSpec(spec([10, 10])).map((issue) => issue.keyword),
    ["uniqueItems"],
  );
});

test("every curve of an answer has one value per frequency", () => {
  const short = edited(MTF_DATA_FRACTIONS, "/fields/1/tangential", curve(0.5)) as MtfNativeData;
  assert.deepEqual(broken("data", short), [
    "/fields/1/tangential: it holds 1 values, the first curve holds 2: one per frequency",
  ]);
  const empty = edited(MTF_DATA_FRACTIONS, "/fields/0/sagittal", curve()) as MtfNativeData;
  assert.deepEqual(broken("data", empty), ["/fields/0/sagittal: it holds no value: a request has a frequency"]);
});

test("a field with curves holds values from 0 to 1, and an unavailable one NaN and a reason", () => {
  const above = edited(MTF_DATA_FRACTIONS, "/fields/0/sagittal", curve(0.875, 1.0625));
  assert.deepEqual(broken("data", above), [
    "/fields/0/sagittal: its value at frequency 1 is 1.0625, expected a number from 0 to 1",
  ]);
  const negative = edited(MTF_DATA_FRACTIONS, "/fields/1/tangential", curve(-0.125, 0.25));
  assert.deepEqual(broken("data", negative), [
    "/fields/1/tangential: its value at frequency 0 is -0.125, expected a number from 0 to 1",
  ]);
  // An unconverged field still has curves: a NaN in one is a value it does not have.
  const hole = edited(MTF_DATA_FRACTIONS, "/fields/1/sagittal", curve(0.75, NaN));
  assert.deepEqual(broken("data", hole), [
    "/fields/1/sagittal: its value at frequency 1 is NaN, expected a number from 0 to 1",
  ]);
  // The ends of the range are values like any other.
  assert.deepEqual(broken("data", edited(MTF_DATA_FRACTIONS, "/fields/0/sagittal", curve(1, 0))), []);

  const numbered = edited(MTF_DATA_FRACTIONS, "/fields/2/sagittal", curve(NaN, 0.5));
  assert.deepEqual(broken("data", numbered), [
    "/fields/2/sagittal: its value at frequency 1 is 0.5, expected NaN: the field is unavailable",
  ]);
  const { reason: _reason, ...unexplained } = MTF_DATA_FRACTIONS.fields[2];
  assert.deepEqual(broken("data", edited(MTF_DATA_FRACTIONS, "/fields/2", unexplained)), [
    "/fields/2: an unavailable field states a reason",
  ]);
  // A field that has curves may state a reason as well, and need not.
  assert.deepEqual(broken("data", edited(MTF_DATA_FRACTIONS, "/fields/1/reason", "sampling")), []);
});

test("a plane that is called the design plane is not shifted; any other name may be", () => {
  const shifted = edited(MTF_DATA_FRACTIONS, "/focus/appliedShiftMm", -0.03125);
  assert.deepEqual(broken("data", shifted), [
    "/focus/appliedShiftMm: the plane is called design and is shifted by -0.03125 mm",
  ]);
  assert.deepEqual(broken("data", edited(MTF_DATA_BEST_FOCUS, "/focus/appliedShiftMm", 0)), []);
  assert.deepEqual(broken("data", edited(MTF_DATA_FRACTIONS, "/focus/appliedShiftMm", -0)), []);
});

test("an array that does not decode is an issue of its curve", () => {
  const wire = structuredClone(MTF_DATA_FRACTIONS.fields[0].sagittal);
  const corrupt = edited(MTF_DATA_FRACTIONS, "/fields/0/sagittal", { $nd: { ...wire.$nd, sha256: "0".repeat(64) } });
  const issues = broken("data", corrupt);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /^\/fields\/0\/sagittal: /);
});
