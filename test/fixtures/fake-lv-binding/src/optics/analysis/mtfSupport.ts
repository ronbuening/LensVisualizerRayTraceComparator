// The fake's MTF support gate: the lines of each spectrum, the conjugate of a refocused state, and the refusals
// the comparator's exporter has to pass on.
import { LINE_NM } from "../spectralLines.js";
import type { FakeMtfOptions, FakeMtfSupport, FakeState } from "../types.js";
import { mtfFiniteConjugate, mtfFiniteObjectPoint } from "./mtfConjugates.js";

const CDF = [LINE_NM.d, LINE_NM.C, LINE_NM.F].map((wavelengthNm) => ({ wavelengthNm, weight: 1 / 3 }));
const PHOTOPIC = [
  { wavelengthNm: 555, weight: 1 },
  { wavelengthNm: 470, weight: 0.091 },
  { wavelengthNm: 510, weight: 0.503 },
  { wavelengthNm: 610, weight: 0.503 },
  { wavelengthNm: 650, weight: 0.107 },
];

export function assessMtfSupport(state: FakeState, options: FakeMtfOptions): FakeMtfSupport {
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
  if (options.spectrum !== "reference") {
    if (state.lens.runtime.data.noDispersionData) {
      return reject("spectral-data-unavailable", "Spectral MTF is unavailable because a glass has no Abbe number.");
    }
    support.referenceWavelengthNm = support.spectralLines[0].wavelengthNm;
    support.useResolvedReference = true;
  }
  return support;
}
