// The fake's product MTF, under LV's names. Its curves are a closed form of the request, so that what was asked
// shows in what comes back: a straight fall to a cutoff that is the method's and the stop's, lowered with the
// field. The numbers describe no lens.
import type { FakeMtfFieldResult, FakeMtfOptions, FakeMtfResult, FakeState } from "../types.js";
import { mtfChiefHeight, mtfModeledHalfField, resolveMtfFieldGeometry, resolveMtfFieldTargets } from "./mtfFields.js";
import { assessMtfSupport } from "./mtfSupport.js";

/** The frequencies of a request that names none. */
export const MTF_FREQUENCIES: readonly number[] = Object.freeze([0, 10, 20, 30, 40, 50]);
const MTF_FIELDS: readonly number[] = [0, 0.5, 1];

interface FakeFieldGeometry {
  referenceHeightMm: number;
  modeledEdgeHeightMm: number;
}

interface FakeFieldTarget {
  fraction: number;
  targetImageHeightMm: number;
  fieldAngleDeg: number | null;
  outsideModel: boolean;
}

function emptyField(fraction: number, target?: FakeFieldTarget): FakeMtfFieldResult {
  return {
    fieldFraction: fraction,
    targetImageHeightMm: target?.targetImageHeightMm ?? null,
    fieldAngleDeg: target?.fieldAngleDeg ?? null,
    imageHeightMm: null,
    sagittal: [],
    tangential: [],
    status: "pending",
    reason: null,
    message: "Waiting to be traced.",
    notes: [],
    gridSize: 0,
    validRays: 0,
    blockedRays: 0,
    failedRays: 0,
    unknownFluxFraction: 0,
    maxDelta: null,
    convergedThroughLpMm: null,
  };
}

function unavailable(field: FakeMtfFieldResult, reason: string, message: string): FakeMtfFieldResult {
  return { ...field, status: "unavailable", reason, message };
}

export function computeMtf(state: FakeState, options: FakeMtfOptions): FakeMtfResult {
  const support = assessMtfSupport(state, options);
  const frequencies = [...(options.frequenciesPerMm ?? MTF_FREQUENCIES)];
  const fractions = options.fieldFractions ?? MTF_FIELDS;
  const result: FakeMtfResult = {
    method: options.method,
    spectrum: options.spectrum,
    support,
    frequenciesPerMm: frequencies,
    fields: [],
    geometry: null,
    focus: null,
    aperture: null,
  };
  if (!support.available) return result;

  const chiefHeight = mtfChiefHeight(state, options, support);
  const geometry = resolveMtfFieldGeometry(state, mtfModeledHalfField(state), chiefHeight) as FakeFieldGeometry | null;
  result.geometry = geometry;
  if (!geometry) {
    result.fields = fractions.map((fraction) =>
      unavailable(emptyField(fraction), "chief-ray-failed", "No valid chief ray reaches the image plane."),
    );
    return result;
  }
  const targets = resolveMtfFieldTargets(state, geometry, fractions) as FakeFieldTarget[];

  // The fake's best focus lies a 128th of the stop radius in front of the design plane, whatever the lens.
  const bestShift = -options.stopSemiDiameterMm / 128;
  const refocused = options.focus === "best-axial";
  result.focus = {
    requestedMode: options.focus,
    mode: refocused ? "best-axial" : "design",
    appliedShiftMm: refocused ? bestShift : 0,
    bestAxialShiftMm: bestShift,
  };
  const stated = state.lens.runtime.data.mtf ?? {};
  result.aperture = {
    tracedFNumber: state.imgZ / (2 * options.pupilSemiDiameterMm),
    limitingSurfaceLabel: stated.limitingSurfaceLabel ?? null,
  };

  const cap = options.maxGridSize ?? 128;
  const lines = support.spectralLines.length;
  const cutoff = (options.method === "diffraction" ? 32 : 64) * options.stopSemiDiameterMm;
  result.fields = targets.map((target) => {
    const field = emptyField(target.fraction, target);
    if (target.outsideModel) {
      const edge = geometry.modeledEdgeHeightMm.toFixed(1);
      return unavailable(field, "outside-modeled-field", `Outside the modeled field: beyond ${edge} mm.`);
    }
    if (target.fieldAngleDeg === null) {
      return unavailable(field, "chief-ray-failed", "No valid chief ray reaches this image height.");
    }
    const fall = 1 - target.fraction / 4;
    const unsettled = stated.unconvergedFraction === target.fraction;
    const clipped = stated.clippedChiefFraction === target.fraction;
    return {
      ...field,
      imageHeightMm: chiefHeight(target.fieldAngleDeg),
      sagittal: frequencies.map((frequency) => Math.max(0, 1 - frequency / cutoff) * fall),
      tangential: frequencies.map((frequency) => Math.max(0, 1 - frequency / cutoff) * fall * fall),
      status: unsettled ? "unconverged" : "converged",
      message: unsettled ? "Sampling has not converged within 0.01 MTF." : "Sampling converged within 0.01 MTF.",
      notes: clipped ? ["A clear aperture stops the chief ray at this height."] : [],
      gridSize: unsettled ? cap : 32,
      validRays: 800 * lines,
      blockedRays: 224 * lines,
      maxDelta: unsettled ? 0.03125 : 0.00390625,
      convergedThroughLpMm: unsettled ? null : frequencies[frequencies.length - 1],
    };
  });
  return result;
}
