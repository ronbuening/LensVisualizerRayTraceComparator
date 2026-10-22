import { WAVEFRONT_NATIVE, WAVEFRONT_NATIVE_VERSION } from "../contract/quantities/wavefrontNative.ts";
import type { WavefrontNativeData, WavefrontNativeSpec } from "../contract/quantities/wavefrontNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

function spec(value: unknown): ValidationIssue[] {
  const { grids } = value as WavefrontNativeSpec;
  const at = grids.findIndex((grid, index) => grid % 2 !== 0 || (index > 0 && grid <= grids[index - 1]));
  return at < 0 ? [] : [invariantIssue(`/grids/${at}`, "grids are even and ascend")];
}

function data(value: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [fieldIndex, field] of (value as WavefrontNativeData).fields.entries()) {
    const base = `/fields/${fieldIndex}`;
    if (field.status === "unavailable") {
      if (field.reason === undefined || field.samples.length !== 0) {
        issues.push(invariantIssue(base, "an unavailable field has a reason and no samples"));
      }
      continue;
    }
    if (field.samples.length === 0) issues.push(invariantIssue(`${base}/samples`, "an ok field has samples"));
    for (const [index, sample] of field.samples.entries()) {
      const path = `${base}/samples/${index}`;
      const n = sample.gridSize;
      if (n % 2 !== 0 || (index > 0 && n <= field.samples[index - 1].gridSize)) {
        issues.push(invariantIssue(`${path}/gridSize`, "grids are even and ascend"));
      }
      const arrays = ["normalizedPupil", "pupilMm", "opdWaves", "intensity", "valid"] as const;
      for (const name of arrays) {
        try {
          const decoded = decodeNdArray(sample[name]);
          const width = name === "normalizedPupil" ? 2 : name === "pupilMm" ? 3 : 1;
          const shape = width === 1 ? [n * n] : [n * n, width];
          if (String(decoded.shape) !== String(shape) || !decoded.values.every(Number.isFinite)) {
            issues.push(invariantIssue(`${path}/${name}`, "samples are finite and have the grid's shape"));
          }
        } catch (error) {
          issues.push(invariantIssue(`${path}/${name}`, String(error)));
        }
      }
      if (issues.length > 0) continue;
      const valid = decodeNdArray(sample.valid).values;
      const intensity = decodeNdArray(sample.intensity).values;
      const normalized = decodeNdArray(sample.normalizedPupil).values;
      let bad = false;
      for (let cell = 0; cell < n * n; cell++) {
        const x = (2 * (cell % n) + 1) / n - 1;
        const y = (2 * Math.floor(cell / n) + 1) / n - 1;
        bad ||= normalized[2 * cell] !== x || normalized[2 * cell + 1] !== y;
        bad ||= valid[cell] !== 0 && valid[cell] !== 1;
        bad ||= !(intensity[cell] >= 0) || (valid[cell] === 1) !== intensity[cell] > 0;
        bad ||= valid[cell] === 1 && !(x * x + y * y < 1);
      }
      if (bad) issues.push(invariantIssue(path, "midpoint coordinates, circle, intensity and validity disagree"));
    }
  }
  return issues;
}

export const wavefrontNativeQuantity = schemaQuantity(WAVEFRONT_NATIVE, WAVEFRONT_NATIVE_VERSION, { spec, data });
