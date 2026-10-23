// Hopkins autocorrelation of a sampled reference-sphere wavefront. No engine code is used here.
//
// The grid is even in the source pupil, not assumed even in optical cosines. A sphere point Q about C
// represents the reference plane wave along (C-Q)/|C-Q|; its optical cosines are n times its x,y components.
// OPD here has the engine-wavefront convention (reference path minus sample path), in vacuum waves, so
// W = -lambda OPD. Each midpoint brings its intensity as flux. The Jacobian, sqrt(flux/J), bilinear shear,
// compensated phasors and normalization are waveOtf's unchanged operations, through a synthetic lattice:
// point=C, path=W, launch=0. No trace is manufactured or reported as an engine's rays.
//
// This is a reference-sphere pupil model; its radial directions are not the aberrated rays' exit directions.
// The distinction is a method difference, not an identical-ray test. No phase or tilt is fitted away.
// On an affine map with constant amplitude, the staircase is the union of lit midpoint cells: the normalized
// overlap differs from a circular aperture by at most 3e/(1-e), e <= 4 sqrt(2)/n. An annulus has both rims;
// e <= 4 sqrt(2)(1+rho)/(n(1-rho^2)). A smooth phase adds midpoint/interpolation error of second order;
// the phaseStep and a second grid are reported, and neither removes the first-order rim error.
import { waveOtf } from "./waveOtf.ts";
import type { WaveOtf, WaveOtfUnavailable } from "./waveOtf.ts";

/** Decoded input, independent of any engine or wire format. */
export interface SampledWavefront {
  readonly columns: number;
  readonly rows: number;
  readonly pupilMm: ArrayLike<number>;
  readonly opdWaves: ArrayLike<number>;
  readonly intensity: ArrayLike<number>;
  readonly valid: ArrayLike<number>;
  readonly centerMm: ArrayLike<number>;
  readonly wavelengthMm: number;
  readonly imageIndex: number;
}

/** Complex OTF of a raw reference-sphere wavefront; unavailable with a reason, never a NaN. */
export function wavefrontOtf(input: SampledWavefront, frequencies: ArrayLike<number>): WaveOtf | WaveOtfUnavailable {
  const { columns, rows, valid, intensity, opdWaves, pupilMm, centerMm, wavelengthMm, imageIndex } = input;
  const count = columns * rows;
  if (
    pupilMm.length !== count * 3 ||
    opdWaves.length !== count ||
    intensity.length !== count ||
    valid.length !== count
  ) {
    throw new RangeError("wavefrontOtf: unequal grid arrays");
  }
  if (centerMm.length !== 3 || !Array.from(centerMm).every(Number.isFinite)) {
    return { available: false, reason: "no-reference", message: "the reference sphere has no finite center" };
  }
  const point = new Float64Array(3 * count);
  const direction = new Float64Array(3 * count);
  const path = new Float64Array(count);
  for (let cell = 0; cell < count; cell++) {
    if (!valid[cell]) continue;
    for (let axis = 0; axis < 3; axis++) {
      point[3 * cell + axis] = centerMm[axis];
      direction[3 * cell + axis] = centerMm[axis] - pupilMm[3 * cell + axis];
    }
    path[cell] = -opdWaves[cell] * wavelengthMm;
  }
  return waveOtf(
    {
      columns,
      rows,
      valid,
      weight: intensity,
      point,
      direction,
      path,
      launchPath: new Float64Array(count),
      wavelengthMm,
      imageIndex,
    },
    { x: centerMm[0], y: centerMm[1], z: centerMm[2] },
    frequencies,
  );
}
