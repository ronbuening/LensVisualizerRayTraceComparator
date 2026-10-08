// The fake's field axis, under LV's names: image height is proportional to field angle, the model reaches a stated
// angle, and a lens may state a format corner beyond what its model reaches.
import type { FakeMtfOptions, FakeMtfSupport, FakeState } from "../types.js";

interface FieldModel {
  mmPerDeg: number;
  edgeDeg: number;
  referenceHeightMm: number | null;
  chiefLimitDeg: number;
}

function fieldModel(state: FakeState): FieldModel {
  const stated = state.lens.runtime.data.field ?? {};
  return {
    mmPerDeg: stated.mmPerDeg ?? 0.5,
    edgeDeg: stated.edgeDeg ?? 20,
    referenceHeightMm: stated.referenceHeightMm ?? null,
    chiefLimitDeg: stated.chiefLimitDeg ?? 60,
  };
}

export function mtfModeledHalfField(state: FakeState): number {
  return fieldModel(state).edgeDeg;
}

// The chief ray's height: none beyond the modeled edge when apertures are checked, none beyond the fake's limit.
export function mtfChiefHeight(
  state: FakeState,
  _options: FakeMtfOptions,
  _support: FakeMtfSupport,
  checkApertures = true,
): (fieldAngleDeg: number) => number {
  const model = fieldModel(state);
  const limit = checkApertures ? model.edgeDeg : model.chiefLimitDeg;
  return (fieldAngleDeg) => (Math.abs(fieldAngleDeg) <= limit ? Math.abs(fieldAngleDeg) * model.mmPerDeg : NaN);
}

export function mtfBeamHeight(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
): (fieldAngleDeg: number) => number {
  return mtfChiefHeight(state, options, support);
}

export function resolveMtfFieldGeometry(
  _state: FakeState,
  startDeg: number,
  chiefHeight: (fieldAngleDeg: number) => number,
): unknown {
  const edge = chiefHeight(startDeg);
  if (!(edge > 0)) return null;
  const stated = fieldModel(_state).referenceHeightMm;
  const reference = stated ?? edge;
  return {
    referenceHeightMm: reference,
    modeledEdgeHeightMm: Math.min(reference, edge),
    modeledEdgeAngleDeg: startDeg,
    chiefEdgeHeightMm: Math.min(reference, edge),
    chiefEdgeAngleDeg: startDeg,
    basis: stated === null ? "modeled-edge" : "format-corner",
  };
}

export function resolveMtfFieldTargets(
  state: FakeState,
  geometry: { referenceHeightMm: number; modeledEdgeHeightMm: number },
  fractions: readonly number[],
): unknown {
  const { mmPerDeg } = fieldModel(state);
  const unsolved = state.lens.runtime.data.field?.unsolvedFraction;
  return fractions.map((fraction) => {
    const targetImageHeightMm = fraction * geometry.referenceHeightMm;
    const outsideModel = targetImageHeightMm > geometry.modeledEdgeHeightMm + 1e-9;
    const fieldAngleDeg = outsideModel || fraction === unsolved ? null : targetImageHeightMm / mmPerDeg;
    return { fraction, targetImageHeightMm, fieldAngleDeg, outsideModel };
  });
}
