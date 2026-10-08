import type { FakeState } from "../types.js";
import { computeSystemMatrix2 } from "./systemMatrix.js";

export function buildCardinalElementsFromMatrix2(matrix: Record<string, number>): unknown {
  if (Math.abs(matrix.C) < 1e-12) return null;
  return { distances: { efl: { valueMm: -matrix.imageIndex / matrix.C } } };
}

export function computeCardinalElements2(state: FakeState): unknown {
  return buildCardinalElementsFromMatrix2(computeSystemMatrix2(state));
}
