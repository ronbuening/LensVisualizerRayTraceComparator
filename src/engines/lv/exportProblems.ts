// Why a LensVisualizer lens has no optical case: a code for programs and a sentence for people.

/**
 * The codes the exporter itself gives. A lens may have several problems, and every one is reported.
 *
 * What the contract cannot express (reported, never approximated):
 * - `folded-path`: the optical path turns at a mirror;
 * - `non-refract-interaction`: a surface reflects or blocks;
 * - `diffractive-surface`: a surface carries a diffractive phase;
 * - `tilted-image-plane` / `off-axis-image-plane`: the image plane is not perpendicular to the axis, or not on it;
 * - `surface-profile-unsupported`: LensVisualizer gives a surface a profile that its radius and asphere do not
 *   explain (a tilted plane, or a kind added since);
 * - `asphere-coefficient-unknown`: an asphere has a coefficient that is not `K` or `A<power>`;
 * - `synthetic-surface-unknown`: LensVisualizer generated a surface of a kind other than a rear plate.
 *
 * What was asked for and cannot be given:
 * - `aperture-faster-than-wide-open`: an f-number below the lens's widest at that zoom position;
 * - `lv-best-axial-needs-mtf-recipe`: the image plane "lv-best-axial" is known only from LensVisualizer's MTF
 *   result; the MTF recipe (Stage 3.2) resolves it;
 * - `wavelength-outside-fitted-range`: an explicit wavelength outside the lines LensVisualizer's anchored indices
 *   are fitted between (g to C).
 *
 * What LensVisualizer could not do with the lens:
 * - `unknown-lens`: its catalog holds no lens of the key;
 * - `lens-build-failed`: `buildLens` threw; `state-prepare-failed`: `prepareRuntimeState` threw.
 *
 * A LensVisualizer that cannot be loaded at all is `lv-<why>`, with the code of the binding's error
 * (`LvBindingErrorCode`): `lv-not-configured`, `lv-path-missing` and so on.
 */
export const EXPORT_PROBLEM_CODES = [
  "folded-path",
  "non-refract-interaction",
  "diffractive-surface",
  "tilted-image-plane",
  "off-axis-image-plane",
  "surface-profile-unsupported",
  "asphere-coefficient-unknown",
  "synthetic-surface-unknown",
  "aperture-faster-than-wide-open",
  "lv-best-axial-needs-mtf-recipe",
  "wavelength-outside-fitted-range",
  "unknown-lens",
  "lens-build-failed",
  "state-prepare-failed",
] as const;

/**
 * The reasons of LensVisualizer's own MTF support gate (`MtfSupport.reason`) that the exporter reports under
 * LensVisualizer's code, word for word: the conjugate, the lines and the per-wavelength indices of a case are
 * LensVisualizer's to give. Any reason it adds later is reported the same way.
 *
 * - `finite-conjugate-unavailable`: the focus position is not a station whose object distance LV certifies;
 * - `mixed-reference`: d- and e-referenced glasses without wavelength data for every glass;
 * - `spectral-data-unavailable`: a glass without the dispersion data that several lines need;
 * - `unsupported-path`, `unverified-scale`: LensVisualizer's MTF path does not cover the lens, so it supplies no
 *   per-wavelength indices; the reference line of such a lens is still exported when the contract can express the
 *   lens (a fisheye projection, an annular aperture).
 */
export const LV_GATE_PROBLEM_CODES = [
  "finite-conjugate-unavailable",
  "mixed-reference",
  "spectral-data-unavailable",
  "unsupported-path",
  "unverified-scale",
] as const;

/** One reason a lens has no case. `code` is one of the lists above, or a reason LensVisualizer added since. */
export interface ExportProblem {
  readonly code: string;
  /** Deterministic text without absolute paths: it is recorded with a run. */
  readonly message: string;
}

/** A problem as one line: `<code>: <message>`. This is the text a run of a suite records. */
export function problemText(problem: ExportProblem): string {
  return `${problem.code}: ${problem.message}`;
}

/** The code of a problem text that `problemText` wrote, or null for any other text. */
export function problemCode(text: string): string | null {
  return /^([a-z][a-z0-9-]*): /.exec(text)?.[1] ?? null;
}
