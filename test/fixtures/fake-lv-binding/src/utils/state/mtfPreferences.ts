// The options the fake's "MTF tab" opens with, under LV's name. They are the fake's own, and none the comparator reads
// is LV's default.
export const DEFAULT_MTF_PREFERENCES = Object.freeze({
  method: "diffraction",
  spectrum: "single",
  regularSpectrum: "photopic",
  wavelengthNm: 550,
  focus: "best-axial",
  view: "zoom",
  regularView: "field",
  fieldStepPercent: 25,
  frequencies: Object.freeze([20, 40]),
  maxGridSize: 64,
  compareF8: false,
  comparisonFNumber: 11,
  comparisonFocus: "refocus",
  advanced: false,
});

// The full stops the fake's comparison offers, under LV's name: of the fake's own, not LV's.
export const MTF_COMPARISON_F_NUMBERS = Object.freeze([1, 2, 4, 5.6, 8, 11, 16, 32]);

// As LV's: a finite marked f-number from 1 to 128.
export function isMtfComparisonFNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 128;
}

// As LV #988's: the regular choices stand in for the Advanced ones while Advanced is off, and a zoom sweep falls back
// to the regular view on a prime. The wavelength and the comparison f-number the fake falls back to are its own.
export function resolveMtfPreferences(preferences, isZoom = true) {
  return {
    ...preferences,
    ...(!preferences.advanced
      ? {
          spectrum: preferences.regularSpectrum,
          wavelengthNm: DEFAULT_MTF_PREFERENCES.wavelengthNm,
          // The fake's own comparison f-number with Advanced off (LV's is 8), so that a test tells the resolved
          // preference from a constant.
          comparisonFNumber: 11,
          view: preferences.regularView,
        }
      : {}),
    ...(preferences.advanced && preferences.view === "zoom" && !isZoom ? { view: preferences.regularView } : {}),
  };
}
