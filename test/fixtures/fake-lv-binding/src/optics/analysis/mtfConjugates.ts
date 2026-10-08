import type { FakeFiniteConjugate, FakeState } from "../types.js";

export function mtfFiniteConjugate(state: FakeState): FakeFiniteConjugate | undefined {
  return state.lens.runtime.data.finiteConjugates?.find(
    (conjugate) => Math.abs(conjugate.focusT - state.focusT) < 1e-8 && Math.abs(conjugate.zoomT - state.zoomT) < 1e-8,
  );
}

export function mtfFiniteObjectPoint(
  state: FakeState,
  conjugate: FakeFiniteConjugate,
  fieldAngle: number,
): [number, number, number] | null {
  const first = state.surfaces[0];
  const z = (conjugate.distanceReference === "image-plane" ? state.imgZ : first.z) - conjugate.objectDistanceMm;
  if (z >= first.z - 1e-3) return null;
  return [0, (z - first.z) * -Math.tan((fieldAngle * Math.PI) / 180), z];
}
