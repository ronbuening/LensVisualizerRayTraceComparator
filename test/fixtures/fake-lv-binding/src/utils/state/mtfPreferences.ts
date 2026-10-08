// The options the fake's "MTF tab" opens with, under LV's name. They are the fake's own, and none is LV's default.
export const DEFAULT_MTF_PREFERENCES = Object.freeze({
  method: "diffraction",
  spectrum: "photopic",
  focus: "best-axial",
  view: "field",
  fieldStepPercent: 25,
  frequencies: Object.freeze([20, 40]),
  maxGridSize: 64,
  compareF8: false,
});
