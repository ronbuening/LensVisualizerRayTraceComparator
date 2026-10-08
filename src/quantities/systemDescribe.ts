// The quantity `system.describe`: its schema files, and the rules they cannot state.
import { SYSTEM_DESCRIBE, SYSTEM_DESCRIBE_VERSION } from "../contract/quantities/systemDescribe.ts";
import type { SystemDescribeData, SystemDescribeSpec } from "../contract/quantities/systemDescribe.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";
import type { QuantityModule } from "./module.ts";

/** A spec's fractions ascend. The schema has said that they are different numbers in [0, 1]. */
function specInvariants(value: unknown): ValidationIssue[] {
  const { sagFractions = [] } = value as SystemDescribeSpec;
  const at = sagFractions.findIndex((fraction, index) => index > 0 && !(fraction > sagFractions[index - 1]));
  if (at < 0) return [];
  const message = `the fractions must ascend: ${sagFractions[at]} follows ${sagFractions[at - 1]}`;
  return [invariantIssue(`/sagFractions/${at}`, message)];
}

function shapeText(shape: readonly number[]): string {
  return `[${shape.join(", ")}]`;
}

/**
 * The parts of an answer describe one system: `stopIndex` is one of the S surfaces; the per-surface arrays have S
 * elements, the index table S columns and at least one row, the sag and its radii S rows and one shape with at
 * least one column; there are S term lists, each ascending in power.
 */
function dataInvariants(value: unknown): ValidationIssue[] {
  const data = value as SystemDescribeData;
  const issues: ValidationIssue[] = [];
  const surfaces = data.surfaceCount;
  if (data.stopIndex >= surfaces) {
    issues.push(invariantIssue("/stopIndex", `${data.stopIndex} is not the index of one of the ${surfaces} surfaces`));
  }
  for (const name of ["vertexZ", "curvature", "conic", "clipRadius", "innerClipRadius"] as const) {
    const { shape } = data[name].$nd;
    if (shape[0] !== surfaces) {
      issues.push(invariantIssue(`/${name}`, `its shape is ${shapeText(shape)}, expected [${surfaces}] (surfaces)`));
    }
  }
  const table = data.indexAfterSurface.$nd.shape;
  if (table[0] < 1 || table[1] !== surfaces) {
    const message = `its shape is ${shapeText(table)}, expected [lines, ${surfaces}] with at least one line`;
    issues.push(invariantIssue("/indexAfterSurface", message));
  }
  const radii = data.sagRadii.$nd.shape;
  if (radii[0] !== surfaces || radii[1] < 1) {
    const message = `its shape is ${shapeText(radii)}, expected [${surfaces}, radii] with at least one radius`;
    issues.push(invariantIssue("/sagRadii", message));
  }
  const sag = data.sag.$nd.shape;
  if (sag[0] !== radii[0] || sag[1] !== radii[1]) {
    issues.push(invariantIssue("/sag", `its shape is ${shapeText(sag)}, that of sagRadii ${shapeText(radii)}`));
  }
  if (data.terms.length !== surfaces) {
    issues.push(invariantIssue("/terms", `it has ${data.terms.length} term lists for ${surfaces} surfaces`));
  }
  data.terms.forEach((terms, surface) => {
    const at = terms.findIndex((term, index) => index > 0 && !(term.power > terms[index - 1].power));
    if (at >= 0) {
      const message = `the powers must ascend: ${terms[at].power} follows ${terms[at - 1].power}`;
      issues.push(invariantIssue(`/terms/${surface}/${at}/power`, message));
    }
  });
  return issues;
}

/**
 * The quantity `system.describe`, validated by its two schema files and then by what they cannot state: a spec's
 * fractions ascend, and the parts of an answer agree in the number of surfaces, lines and sag radii.
 */
export const systemDescribeQuantity: QuantityModule = schemaQuantity(SYSTEM_DESCRIBE, SYSTEM_DESCRIBE_VERSION, {
  spec: specInvariants,
  data: dataInvariants,
});
