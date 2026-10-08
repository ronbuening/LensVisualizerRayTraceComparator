// The quantity `mtf.native`: its schema files, and the rules they cannot state.
import { MTF_DESIGN_PLANE, MTF_NATIVE, MTF_NATIVE_VERSION } from "../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire, NdValues } from "../core/numeric/ndarray.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";
import type { QuantityModule } from "./module.ts";

/** A spec's frequencies ascend. The schema has said that they are different numbers of at least 0. */
function specInvariants(value: unknown): ValidationIssue[] {
  const { frequenciesPerMm } = value as MtfNativeSpec;
  const at = frequenciesPerMm.findIndex((frequency, index) => index > 0 && !(frequency > frequenciesPerMm[index - 1]));
  if (at < 0) return [];
  const message = `the frequencies must ascend: ${frequenciesPerMm[at]} follows ${frequenciesPerMm[at - 1]}`;
  return [invariantIssue(`/frequenciesPerMm/${at}`, message)];
}

/** The elements of a curve, or the issue that says why its bytes are not the array it states. */
function decoded(path: string, wire: NdArrayWire, issues: ValidationIssue[]): NdValues | null {
  try {
    return decodeNdArray(wire).values;
  } catch (error) {
    issues.push(invariantIssue(path, error instanceof Error ? error.message : String(error)));
    return null;
  }
}

/**
 * The curves of an answer are those of one request: every field has a sagittal and a tangential curve of one length
 * F of at least 1, the same for every field. A field that is "unavailable" holds NaN at every frequency and states a
 * reason; any other field holds a number from 0 to 1 at every frequency. A plane that is called the design plane is
 * not shifted. Each curve reports the first frequency that breaks its rule.
 */
function dataInvariants(value: unknown): ValidationIssue[] {
  const data = value as MtfNativeData;
  const issues: ValidationIssue[] = [];
  const [frequencies] = data.fields[0].sagittal.$nd.shape;
  if (frequencies < 1) return [invariantIssue("/fields/0/sagittal", "it holds no value: a request has a frequency")];
  data.fields.forEach((field, index) => {
    const unavailable = field.status === "unavailable";
    if (unavailable && field.reason === undefined) {
      issues.push(invariantIssue(`/fields/${index}`, "an unavailable field states a reason"));
    }
    for (const cut of ["sagittal", "tangential"] as const) {
      const path = `/fields/${index}/${cut}`;
      const [length] = field[cut].$nd.shape;
      if (length !== frequencies) {
        const message = `it holds ${length} values, the first curve holds ${frequencies}: one per frequency`;
        issues.push(invariantIssue(path, message));
        continue;
      }
      const values = decoded(path, field[cut], issues);
      if (values === null) continue;
      const broken = values.findIndex((mtf) => (unavailable ? !Number.isNaN(mtf) : !(mtf >= 0 && mtf <= 1)));
      if (broken < 0) continue;
      const expected = unavailable ? "NaN: the field is unavailable" : "a number from 0 to 1";
      issues.push(invariantIssue(path, `its value at frequency ${broken} is ${values[broken]}, expected ${expected}`));
    }
  });
  if (data.focus.mode === MTF_DESIGN_PLANE && data.focus.appliedShiftMm !== 0) {
    const message = `the plane is called ${MTF_DESIGN_PLANE} and is shifted by ${data.focus.appliedShiftMm} mm`;
    issues.push(invariantIssue("/focus/appliedShiftMm", message));
  }
  return issues;
}

/**
 * The quantity `mtf.native`, validated by its two schema files and then by what they cannot state: a spec's
 * frequencies ascend, and an answer's curves have one length, with values from 0 to 1 where a field has curves and
 * NaN, with a reason, where it has none.
 */
export const mtfNativeQuantity: QuantityModule = schemaQuantity(MTF_NATIVE, MTF_NATIVE_VERSION, {
  spec: specInvariants,
  data: dataInvariants,
});
