// Reference-sphere wavefronts are centred on their own chief landings. Bring their complex OTFs to
// lines[0]'s chief landing BEFORE adding them. This is polychromaticOtf's convention, x sagittal, y
// tangential: exp(-2 pi i nu (chief_l - chief_0)). The stored optiland frame is mirrored in y throughout.
// wavefrontOtf evaluates every line at exactly the requested frequencies: no frequency interpolation.
import { createExactSum } from "../core/numeric/exact.ts";
import { spotSums } from "./geometricOtf.ts";
import type { OtfCut } from "./geometricOtf.ts";
import { wavefrontOtf } from "./wavefrontOtf.ts";
import type { SampledWavefront } from "./wavefrontOtf.ts";
import type { PhaseStep, PolychromaticWaveOtf, WaveOtfUnavailable } from "./waveOtf.ts";

export interface SpectralWavefront {
  readonly weight: number;
  readonly wavefront: SampledWavefront;
}

/** Sum weight * transmitted flux * OTF * chief phase, then normalize and take the modulus. No line is dropped. */
export function polychromaticWavefrontOtf(
  lines: readonly SpectralWavefront[],
  frequencies: ArrayLike<number>,
): PolychromaticWaveOtf | WaveOtfUnavailable {
  if (lines.length === 0) return { available: false, reason: "no-lines", message: "the spectrum has no line" };
  const sums = Array.from({ length: 4 * frequencies.length }, createExactSum);
  const flux = createExactSum();
  const perLine: PolychromaticWaveOtf["lines"][number][] = [];
  let worst: PhaseStep = { waves: 0, ray: -1, neighbour: -1 };
  const reference = lines[0].wavefront.centerMm;
  for (const [line, { weight, wavefront }] of lines.entries()) {
    const fail = (reason: WaveOtfUnavailable["reason"], message: string): WaveOtfUnavailable => ({
      available: false,
      reason,
      message: `line ${line}: ${message}`,
      line,
    });
    if (!Number.isFinite(weight) || !(weight > 0)) return fail("bad-line-weight", `invalid weight ${weight}`);
    const own = wavefrontOtf(wavefront, frequencies);
    if (!own.available) return { ...own, message: `line ${line}: ${own.message}`, line };
    // Use the unchanged exact-reduction/Taylor phasors, including their 2^32-cycle range check.
    const phase = spotSums(
      { x: [wavefront.centerMm[0]], y: [wavefront.centerMm[1]], weight: [1] },
      { x: reference[0], y: reference[1] },
      frequencies,
    );
    if (!phase.available) return fail(phase.reason === "bad-landing" ? "no-reference" : phase.reason, phase.message);
    const factor = weight * own.flux;
    if (!Number.isFinite(factor) || !(factor > 0))
      return fail("out-of-range", "weighted flux is not finite and positive");
    flux.add(weight, own.flux);
    const { cells, phaseStep, undersampled } = own;
    perLine.push({ cells, phaseStep, undersampled, flux: own.flux });
    if (line === 0 || phaseStep.waves > worst.waves) worst = { ...phaseStep, line };
    for (const [axis, cut] of ["sagittal", "tangential"].entries()) {
      const a = own[cut as "sagittal" | "tangential"];
      const b = phase[cut as "sagittal" | "tangential"];
      for (let at = 0; at < frequencies.length; at++) {
        const real = createExactSum(),
          imaginary = createExactSum();
        real.add(a.real[at], b.real[at]);
        real.add(-a.imaginary[at], b.imaginary[at]);
        imaginary.add(a.real[at], b.imaginary[at]);
        imaginary.add(a.imaginary[at], b.real[at]);
        sums[4 * at + 2 * axis].add(factor, real.value());
        sums[4 * at + 2 * axis + 1].add(factor, imaginary.value());
      }
    }
  }
  const total = flux.value();
  const cut = (axis: number): OtfCut => {
    const real = new Float64Array(frequencies.length),
      imaginary = new Float64Array(frequencies.length);
    const modulus = new Float64Array(frequencies.length);
    for (let at = 0; at < frequencies.length; at++) {
      real[at] = sums[4 * at + 2 * axis].value() / total;
      imaginary[at] = sums[4 * at + 2 * axis + 1].value() / total;
      modulus[at] = Math.sqrt(real[at] * real[at] + imaginary[at] * imaginary[at]);
    }
    return { real, imaginary, modulus };
  };
  const sagittal = cut(0),
    tangential = cut(1);
  if (
    !Number.isFinite(total) ||
    [sagittal, tangential].some((c) => [...c.real, ...c.imaginary, ...c.modulus].some((v) => !Number.isFinite(v)))
  )
    return { available: false, reason: "out-of-range", message: "the spectral sum is not finite" };
  return {
    available: true,
    flux: total,
    sagittal,
    tangential,
    cells: perLine.reduce((count, own) => count + own.cells, 0),
    phaseStep: worst,
    undersampled: perLine.some((own) => own.undersampled),
    lines: perLine,
  };
}
