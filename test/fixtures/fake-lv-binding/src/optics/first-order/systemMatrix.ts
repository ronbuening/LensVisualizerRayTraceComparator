import { traceParaxialSurfaces2 } from "../math/paraxial.js";
import type { FakeState } from "../types.js";

export interface FakeSystemMatrix {
  A: number;
  B: number;
  C: number;
  D: number;
  objectIndex: number;
  imageIndex: number;
}

export function computeSystemMatrix2(state: FakeState): FakeSystemMatrix {
  const marginal = traceParaxialSurfaces2(state.surfaces, 1, 0, { skipLastTransfer: true });
  const chief = traceParaxialSurfaces2(state.surfaces, 0, 1, { skipLastTransfer: true });
  return {
    A: marginal.y,
    B: chief.y,
    C: marginal.n * marginal.u,
    D: marginal.n * chief.u,
    objectIndex: 1,
    imageIndex: marginal.n,
  };
}
