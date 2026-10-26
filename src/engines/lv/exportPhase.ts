// Read prepared compiled phase values, never authored `source` coefficients or a fitted substitute.
import type { DiffractivePhase } from "../../contract/case.ts";
import type { ExportProblem } from "./exportProblems.ts";

export function exportPhase(value: object | null | undefined): { phase?: DiffractivePhase; problem?: ExportProblem } {
  if (value == null) return {};
  const p = value as Record<string, unknown>;
  const fail = (): { problem: ExportProblem } => ({
    problem: {
      code: "diffractive-phase-unsupported",
      message: "prepared diffractive phase is not an exact compiled radial optical-path polynomial",
    },
  });
  if (
    Object.keys(p).some(
      (key) =>
        !["kind", "referenceWavelengthNm", "diffractionOrder", "quadraticCoefficient", "terms", "source"].includes(key),
    ) ||
    p.kind !== "radial-polynomial" ||
    typeof p.referenceWavelengthNm !== "number" ||
    !(p.referenceWavelengthNm > 0) ||
    !Number.isFinite(p.referenceWavelengthNm) ||
    !Number.isInteger(p.diffractionOrder) ||
    !Array.isArray(p.terms) ||
    p.terms.length === 0 ||
    p.terms.length > 16
  )
    return fail();
  let previous = 0;
  const terms: { radialPower: number; coefficient: number }[] = [];
  for (const term of p.terms as Record<string, unknown>[]) {
    if (
      typeof term !== "object" ||
      term === null ||
      Object.keys(term).some((key) => !["radialPower", "coefficient", "derivativeCoefficient"].includes(key))
    )
      return fail();
    const { radialPower, coefficient, derivativeCoefficient } = term;
    if (
      typeof radialPower !== "number" ||
      !Number.isInteger(radialPower) ||
      radialPower < 2 ||
      radialPower > 32 ||
      radialPower <= previous ||
      typeof coefficient !== "number" ||
      !Number.isFinite(coefficient) ||
      derivativeCoefficient !== radialPower * coefficient
    )
      return fail();
    terms.push({ radialPower, coefficient });
    previous = radialPower;
  }
  if (p.quadraticCoefficient !== (terms.find((term) => term.radialPower === 2)?.coefficient ?? 0)) return fail();
  return {
    phase: {
      kind: "radial-polynomial",
      referenceWavelengthNm: p.referenceWavelengthNm,
      diffractionOrder: p.diffractionOrder as number,
      terms,
    },
  };
}
