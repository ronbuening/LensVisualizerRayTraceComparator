// The fake's MTF entry points, under the names of LV's barrel.
export { MTF_FIELDS, MTF_FREQUENCIES, computeMtf, computeMtfSteps } from "./analysis/mtf/mtf.js";
export { assessMtfSupport, resolveMtfSpectrum } from "./analysis/mtf/mtfSupport.js";

export { prepareMtfFieldLaunch, findMtfFieldFootprint, traceMtfBundle } from "./analysis/mtf/mtfTracing.ts";
// Diagnostic export: a deliberately synthetic zero-frequency pupil, never a port of LV's estimator.
export function shearedOtf(bundle, reference, wavelengthMm, frequencies) {
  const curve = () => ({ real: frequencies.map((f) => (f === 0 ? 1 : 0)), imaginary: frequencies.map(() => 0) });
  return {
    sagittal: curve(), tangential: curve(),
    limit: { sagittal: frequencies.map((f) => (f === 0 ? 1 : 0)), tangential: frequencies.map((f) => (f === 0 ? 1 : 0)) },
    straddling: frequencies.map(() => 0),
  };
}
