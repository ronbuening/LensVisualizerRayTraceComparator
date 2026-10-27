import type { FakeAnalysisRequest } from "../request.ts";
// The fake's MTF support gate: the lines of each spectrum, the conjugate of a refocused state, and the refusals
// the comparator's exporter has to pass on.
import { LINE_NM } from "../../chromatic.js";
import type { FakeMtfOptions, FakeMtfSupport, FakeState } from "../../types.js";
import { mtfFiniteConjugate, mtfFiniteObjectPoint } from "./mtfConjugates.js";

const CDF = [LINE_NM.d, LINE_NM.C, LINE_NM.F].map((wavelengthNm) => ({ wavelengthNm, weight: 1 / 3 }));
const PHOTOPIC = [
  { wavelengthNm: 555, weight: 1 },
  { wavelengthNm: 470, weight: 0.091 },
  { wavelengthNm: 510, weight: 0.503 },
  { wavelengthNm: 610, weight: 0.503 },
  { wavelengthNm: 650, weight: 0.107 },
];

export function resolveMtfOptions(request: FakeAnalysisRequest, options: Omit<FakeMtfOptions, "pupilSemiDiameterMm" | "stopSemiDiameterMm">): FakeMtfOptions {
  return { ...options, pupilSemiDiameterMm: request.aperture.entrancePupilSemiDiameterMm,
    stopSemiDiameterMm: request.aperture.stopSemiDiameterMm } as FakeMtfOptions;
}
// The gate's path and image-plane rules, under LV's names, which LV's vignetting tab asks on their own.
export function mtfSequentialRefractivePath(state: FakeState): boolean {
  return !(
    state.lens.flags.isFoldedOptics ||
    state.surfaces.some((surface) => surface.diffractive || (surface.innerSd ?? 0) > 0 || surface.interaction.type !== "refract")
  );
}
export function mtfAxialImagePlane(state: FakeState): boolean {
  const [x, y, z] = state.imagePlane.normal;
  return !(Math.abs(x) > 1e-10 || Math.abs(y) > 1e-10 || z <= 0);
}

export function assessMtfSupport(request: FakeAnalysisRequest, settings: Omit<FakeMtfOptions, "pupilSemiDiameterMm" | "stopSemiDiameterMm">): FakeMtfSupport {
  const state = request.preparedGeometry;
  const options = resolveMtfOptions(request, settings);
  const reference = { wavelengthNm: LINE_NM.d, weight: 1 };
  const lines = options.spectrum === "cdf" ? CDF : options.spectrum === "photopic" ? PHOTOPIC : [reference];
  const support: FakeMtfSupport = {
    available: true,
    reason: null,
    message: "",
    referenceWavelengthNm: LINE_NM.d,
    useResolvedReference: false,
    spectralLines: lines.map((line) => ({ ...line })),
    limitations: [],
  };
  const reject = (reason: string, message: string): FakeMtfSupport => ({ ...support, available: false, reason, message });

  if (state.focusT !== 0) {
    const conjugate = mtfFiniteConjugate(state);
    if (!conjugate || !mtfFiniteObjectPoint(state, conjugate, 0)) {
      return reject("finite-conjugate-unavailable", "Finite MTF requires a documented focus station.");
    }
    support.conjugate = conjugate;
  }
  if (!(options.pupilSemiDiameterMm > 0) || !(options.stopSemiDiameterMm > 0)) {
    return reject("invalid-input", "MTF requires finite physical apertures.");
  }
  // The fake's limits on one request, none of them LV's: 8 fields, 12 frequencies, 400 cycles/mm.
  const fields = options.fieldFractions ?? [];
  const frequencies = options.frequenciesPerMm ?? [];
  if (fields.length > 8 || frequencies.length > 12 || frequencies.some((frequency) => frequency > 400)) {
    return reject("invalid-input", "MTF requires fields and image-space frequencies within its limits.");
  }
  if (state.lens.flags.isFoldedOptics || state.surfaces.some(surface => surface.diffractive)) return reject("unsupported-path", "Fake MTF accepts sequential paths only.");
  if (state.lens.runtime.source.unverifiedScale) {
    return reject("unverified-scale", "Prescription scale needs verification before reporting lp/mm.");
  }
  if (options.spectrum !== "reference") {
    if (state.lens.runtime.source.noDispersionData) {
      return reject("spectral-data-unavailable", "Spectral MTF is unavailable because a glass has no Abbe number.");
    }
    support.referenceWavelengthNm = support.spectralLines[0].wavelengthNm;
    support.useResolvedReference = true;
  }
  return support;
}

// The spectrum the fake's "MTF tab" asks for: the preferred one, or the reference line for a lens without the glass
// data, with a note that says so.
export function resolveMtfSpectrum(
  state: FakeState,
  preferred: FakeMtfOptions["spectrum"],
): { spectrum: FakeMtfOptions["spectrum"]; note: string | null } {
  const hasData = !state.lens.runtime.source.noDispersionData;
  if (preferred === "reference" || hasData) return { spectrum: preferred, note: null };
  const label = preferred === "cdf" ? "C/d/F" : "Photopic";
  return {
    spectrum: "reference",
    note: `${label} MTF is unavailable because a glass has no Abbe number; showing the reference wavelength.`,
  };
}
