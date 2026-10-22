// Synthetic `mtf.native` answers for the tests of rung R5: curves, landings and sampling written out by the test,
// so that every figure a test expects is a subtraction of two numbers it wrote. Nothing here is an engine's output.
import assert from "node:assert/strict";

import type {
  MtfFieldStatus,
  MtfNativeData,
  MtfNativeField,
  MtfNativeSpec,
} from "../../src/contract/quantities/mtfNative.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { mtfNativeQuantity } from "../../src/quantities/mtfNative.ts";

/** The request of every answer here: three fields, as fractions, at four frequencies of which a report shows three. */
export const SPEC: MtfNativeSpec = {
  frequenciesPerMm: [10, 30, 50, 70],
  fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
  method: "diffraction",
  focus: "design",
};

/** A curve that every engine has unless a test writes another: binary fractions, so a difference from it is exact. */
export const FLAT: readonly number[] = [0.875, 0.75, 0.5, 0.25];

/** What a field of an answer is made of; whatever is left out is a field the engine stands by, on `FLAT`. */
export interface FieldOf {
  readonly sagittal?: readonly number[];
  readonly tangential?: readonly number[];
  readonly status?: MtfFieldStatus;
  readonly reason?: string;
  /** Where the chief ray lands, mm; 16 times the fraction unless given, null for an answer that states none. */
  readonly imageHeightMm?: number | null;
  readonly sampling?: { readonly [name: string]: number };
}

function field(requested: number, of: FieldOf = {}): MtfNativeField {
  const unavailable = of.status === "unavailable";
  const curve = (values: readonly number[] = FLAT) =>
    encodeNdArray(Float64Array.from(unavailable ? values.map(() => Number.NaN) : values));
  return {
    field: requested,
    fieldAngleDeg: 8 * requested,
    imageHeightMm: of.imageHeightMm === undefined ? 16 * requested : of.imageHeightMm,
    sagittal: curve(of.sagittal),
    tangential: curve(of.tangential),
    status: of.status ?? "ok",
    ...(of.reason === undefined ? {} : { reason: of.reason }),
    sampling: of.sampling ?? {},
  };
}

/** The three fields of an answer. */
export type FieldsOf = readonly [FieldOf, FieldOf, FieldOf];

/**
 * An answer of the engine whose method is `name`, with the three fields of `SPEC`, at one line unless `lines`
 * gives others.
 */
export function answer(
  name: string,
  fields: FieldsOf = [{}, {}, {}],
  lines: readonly number[] = [587.5618],
): MtfNativeData {
  const data: MtfNativeData = {
    fields: SPEC.fields.values.map((requested, index) => field(requested, fields[index])),
    method: { name, params: {} },
    focus: { mode: "design", appliedShiftMm: 0 },
    aperture: {},
    lines: lines.map((wavelengthNm) => ({ wavelengthNm, weight: 1 })),
    notes: [],
  };
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, data), []);
  return data;
}

/** `FLAT` with `delta` added at the frequency of index `at`. */
export function raised(delta: number, at = 0): number[] {
  return FLAT.map((value, index) => (index === at ? value + delta : value));
}
