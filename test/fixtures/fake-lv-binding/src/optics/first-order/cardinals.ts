import type { FakeState } from "../types.js";
import { computeSystemMatrix2 } from "./systemMatrix.js";

interface CardinalInput {
  A: number;
  B: number;
  C: number;
  D: number;
  frontVertexZ: number;
  rearVertexZ: number;
  rearLensVertexZ?: number;
  imagePlaneZ: number;
  objectIndex: number;
  imageIndex: number;
}

// The cardinal points of a system matrix, in LV's shape: positions under `points`, signed lengths under `distances`.
export function buildCardinalElementsFromMatrix2(input: CardinalInput): unknown {
  const { A, C, D, frontVertexZ, rearVertexZ, rearLensVertexZ = rearVertexZ, objectIndex, imageIndex } = input;
  if (!Number.isFinite(C) || Math.abs(C) < 1e-12) return null;
  const frontFocalZ = frontVertexZ + (objectIndex * D) / C;
  const rearFocalZ = rearVertexZ - (imageIndex * A) / C;
  const frontPrincipalZ = frontVertexZ + (objectIndex * (D - 1)) / C;
  const rearPrincipalZ = rearVertexZ + (imageIndex * (1 - A)) / C;
  return {
    points: {
      frontFocal: { id: "F", z: frontFocalZ },
      rearFocal: { id: "F'", z: rearFocalZ },
      frontPrincipal: { id: "H", z: frontPrincipalZ },
      rearPrincipal: { id: "H'", z: rearPrincipalZ },
    },
    distances: {
      efl: { id: "EFL", valueMm: rearFocalZ - rearPrincipalZ },
      bfd: { id: "BFD", valueMm: rearFocalZ - rearLensVertexZ },
    },
    frontVertexZ,
    rearVertexZ,
    rearLensVertexZ,
    imagePlaneZ: input.imagePlaneZ,
  };
}

export function computeCardinalElements2(state: FakeState): unknown {
  const last = state.surfaces.length - 1;
  return buildCardinalElementsFromMatrix2({
    ...computeSystemMatrix2(state),
    frontVertexZ: state.z[0],
    rearVertexZ: state.z[last],
    rearLensVertexZ: state.z[state.lens.runtime.lastLensSurfaceIdx],
    imagePlaneZ: state.imgZ,
  });
}
