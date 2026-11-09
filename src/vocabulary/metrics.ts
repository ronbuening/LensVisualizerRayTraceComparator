// The figures a comparison reports, in plain words: a metric key (`hits.maxDistance`) stays the key stored in
// comparisons, baselines and the limits file; a screen shows its label. "Largest" is over every ray, surface, field
// or frequency the comparison looked at; a difference is always of one engine's answer and the other's.

/** The units a figure is in, as the limits file and the comparators state them. */
export const UNIT_TEXT: Readonly<Record<string, string>> = {
  mm: "millimetres",
  waves: "waves of the wavelength it is of",
  "1": "a pure number, with no unit",
  percent: "percent",
  elements: "a count",
  rays: "a count of rays",
  cells: "a count of cells across the lattice",
  lines: "a count of wavelengths",
};

/** One figure: its label, and the unit it is in (a key of `UNIT_TEXT`). */
export interface MetricText {
  readonly label: string;
  readonly unit: string;
}

const mm = (label: string): MetricText => ({ label, unit: "mm" });
const waves = (label: string): MetricText => ({ label, unit: "waves" });
const pure = (label: string): MetricText => ({ label, unit: "1" });
const percent = (label: string): MetricText => ({ label, unit: "percent" });
const count = (label: string, unit = "elements"): MetricText => ({ label, unit });

/** Every metric key a comparison states, judged or shown beside the judged ones. */
export const METRICS: Readonly<Record<string, MetricText>> = {
  // The pipeline echo.
  "sum.abs": pure("Difference of the sums of the two echoed arrays"),
  "values.maxAbs": pure("Largest difference of an element of the two echoed arrays"),
  // The built system.
  "layout.mismatches": count("Surfaces whose count or place differs"),
  "shape.mismatches": count("Surfaces whose curvature, conic or asphere terms differ"),
  "aperture.mismatches": count("Stops and clear apertures that differ"),
  "index.mismatches": count("Refractive indices that differ"),
  "sag.maxScaled": pure("Largest sag difference at the sampled heights, over the size of a rounding there"),
  "sag.maxAbs": mm("Largest sag difference at the sampled heights"),
  // First-order data.
  "firstOrder.maxAbs": mm("Largest difference of a focal length, focal point, principal point or back focus"),
  "pupilZ.maxScaled": mm("Largest difference of a pupil position, scaled by its distance from the image plane"),
  "pupilZ.maxAbs": mm("Largest difference of a pupil position"),
  "pupilRadius.maxScaled": mm("Largest difference of a pupil radius, scaled by its pupil's distance from the image"),
  "pupilRadius.maxAbs": mm("Largest difference of a pupil radius"),
  // Ray trace and optical path.
  "hits.maxDistance": mm("Largest distance between the two engines' ray hits on a surface"),
  "direction.maxAbs": pure("Largest difference of a component of a ray's exit direction"),
  "landing.maxDistance": mm("Largest distance between the two engines' ray landings on the image plane"),
  "mask.mismatches": count("Rays one engine stops and the other lets through", "rays"),
  "mask.rimBand": count(
    "Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged)",
    "rays",
  ),
  "rays.compared": count("Rays both engines traced through", "rays"),
  "rays.dropped": count("Rays only one engine traced through, left out of both sums", "rays"),
  "opticalPath.maxAbs": waves("Largest difference of an optical path length to a surface"),
  "opticalPathToImage.maxAbs": waves("Largest difference of an optical path length to the image plane"),
  "opd.maxAbs": waves("Largest difference of an optical path difference from the chief ray"),
  "phasePath.maxAbs": waves("Largest difference of the phase a diffractive surface adds to a ray"),
  // The MTF.
  "mtf.maxAbs": pure("Largest difference of an MTF value"),
  "sampling.mismatches": count("Sampling grids, ray counts and ray outcomes that differ"),
  "fields.mismatches": count("Fields whose outcome differs"),
  "waveMtf.maxAbs": pure("Largest difference of a wave MTF value, on the finest lattice"),
  "waveMtf.flagged": pure(
    "Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged)",
  ),
  "phaseStep.waves": waves("Largest phase step between neighbouring cells of the lattice that carry light"),
  "convergence.maxAbs": pure("Largest move of a wave MTF value from the coarser lattice to the finer"),
  "lattice.columns": count("Cells across the finest lattice", "cells"),
  "lines.compared": count("Wavelengths compared", "lines"),
  "lines.data": count("Wavelengths whose two answers are of different inputs"),
  "lines.unavailable": count("Wavelengths an engine has no answer for"),
  "mtfOnAxis.maxAbs": pure("Largest MTF difference on the axis"),
  "mtfOffAxis.maxAbs": pure("Largest MTF difference off the axis"),
  "mtfFlagged.maxAbs": pure("Largest MTF difference in fields whose sampling did not settle (in no review band)"),
  "mtfRimLost.maxAbs": pure("Largest MTF difference in fields where an engine lost a rim ray (in no review band)"),
  "chiefLanding.maxAbs": mm("Largest distance between the two engines' chief-ray landings"),
  "fields.compared": count("Fields compared"),
  "fields.data": count("Fields whose two answers are of different inputs"),
  "fields.flagged": count("Fields set aside because a sampling did not settle"),
  "fields.rimLost": count("Fields set aside because an engine lost a rim ray"),
  "fields.unavailable": count("Fields an engine has no answer for"),
  "fields.unconverged": count("Fields an engine says did not converge"),
  "fields.numerical": count("Fields set aside as not converged"),
  // Spots and fans.
  "transverseError.maxAbs": mm("Largest difference of a ray's landing relative to the chief ray"),
  "centroid.maxAbs": mm("Largest difference of a spot centroid"),
  "rmsRadius.maxAbs": mm("Largest difference of a spot's RMS radius"),
  "spotCentroid.maxAbs": mm("Largest difference of a spot centroid"),
  "spotRmsRadius.maxAbs": mm("Largest difference of a spot's RMS radius"),
  "fanError.maxAbs": mm("Largest difference of a ray-fan error"),
  "fanSamples.unpaired": count("Ray-fan samples one answer has and the other lacks"),
  // Spherical aberration and axial colour.
  "intercept.maxScaled": mm("Largest difference of an axial crossing, times the larger of the two engines' slopes"),
  "intercept.maxAbs": mm("Largest difference of an axial crossing, along the axis"),
  "focus.maxScaled": mm("Difference of the best focus, times the rays' RMS slope"),
  "focus.maxAbs": mm("Difference of the best focus, along the axis"),
  "focusRms.maxAbs": mm("Difference of the RMS spot size at best focus"),
  "marginalIntercept.maxAbs": mm("Difference of the marginal ray's axial crossing"),
  "nearAxisIntercept.maxAbs": mm("Difference of the near-axis ray's axial crossing"),
  "longitudinalSa.maxAbs": mm("Difference of the longitudinal spherical aberration"),
  "bestFocus.maxAbs": mm("Difference of the best focus"),
  "bestFocusRms.maxAbs": mm("Difference of the RMS spot size at best focus"),
  "profile.maxAbs": mm("Largest difference along the spherical-aberration profile"),
  "lineFocus.maxAbs": mm("Largest difference of a wavelength's focus"),
  "relativeFocus.maxAbs": mm("Largest difference of a wavelength's focus relative to the reference wavelength"),
  "paraxialFocalShift.maxAbs": mm("Largest difference of a wavelength's paraxial focal shift"),
  "pupilRadius.relative": pure("How far apart the two pupil radii are, as a fraction of the larger"),
  "landing.maxAbs": mm("Largest difference, along x or y, of the two engines' landings of a chief or reference ray"),
  // Chief rays: distortion, pupils, lateral colour.
  "distortion.maxScaled": mm("Largest difference of a ray's distance from its ideal image point"),
  "distortion.maxAbs": percent("Largest difference of distortion"),
  "distortionPercent.maxAbs": percent("Largest difference of distortion"),
  "exitPupil.maxScaled": mm("Largest difference of a chief ray's axial crossing, times its exit slope"),
  "exitPupil.maxAbs": mm("Largest difference of an exit pupil position"),
  "entrancePupil.maxAbs": mm("Largest difference of an entrance pupil position"),
  "paraxialEntrancePupil.maxAbs": mm("Difference of the paraxial entrance pupil position"),
  "paraxialExitPupil.maxAbs": mm("Difference of the paraxial exit pupil position"),
  "lateralColour.maxAbs": mm("Largest difference of lateral colour"),
  "focalScale.relative": pure("How far apart the two distortion scales are, as a fraction of the larger"),
  "idealHeight.maxAbs": mm("Largest difference of an ideal image height"),
  "realHeight.maxAbs": mm("Largest difference of a real image height"),
  // Field curves.
  "tangentialFocus.maxScaled": mm("Largest difference of a tangential focus, times the fan's RMS slope"),
  "sagittalFocus.maxScaled": mm("Largest difference of a sagittal focus, times the fan's RMS slope"),
  "tangentialFocus.maxAbs": mm("Largest difference of a tangential focus, along the axis"),
  "sagittalFocus.maxAbs": mm("Largest difference of a sagittal focus, along the axis"),
  "astigmatism.maxAbs": mm("Largest difference of astigmatism"),
  "tangentialShift.maxAbs": mm("Largest difference of a tangential focus shift"),
  "sagittalShift.maxAbs": mm("Largest difference of a sagittal focus shift"),
  // Vignetting.
  "transmission.maxAbs": pure("Share of the axis's flux carried by rays one engine passes and the other stops"),
  "transmission.rimBandOrFailed": pure(
    "Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged)",
  ),
  "illumination.maxAbs": pure("Largest difference of a field's flux into the image, relative to the axis"),
  "geometricTransmission.maxAbs": pure("Largest difference of the share of the beam that gets through"),
  "relativeIllumination.maxAbs": pure("Largest difference of relative illumination"),
  "falloff.maxAbs": pure("Largest difference of the falloff that is not vignetting"),
  // Summary.
  "focalLength.maxAbs": mm("Difference of the focal length"),
  "rearFocus.maxAbs": mm("Distance between the two rear focal points"),
  "entrancePupilDiameter.maxAbs": mm("Difference of the entrance pupil diameter"),
  "stopDiameter.maxAbs": mm("Difference of the stop diameter"),
  "imageSpaceFNumber.maxAbs": pure("Difference of the image-space f-number"),
  "paraxialWorkingFNumber.maxAbs": pure("Difference of the paraxial working f-number"),
  "workingFNumber.maxAbs": pure("Difference of the working f-number"),
  "totalTrack.maxAbs": mm("Difference of the total track"),
  // Seidel sums.
  "SPHA.maxAbs": mm("Difference of the spherical aberration sum (SPHA)"),
  "COMA.maxAbs": mm("Difference of the coma sum (COMA)"),
  "ASTI.maxAbs": mm("Difference of the astigmatism sum (ASTI)"),
  "FCUR.maxAbs": mm("Difference of the field curvature sum (FCUR)"),
  "DIST.maxAbs": mm("Difference of the distortion sum (DIST)"),
  "CLA.maxAbs": mm("Difference of the axial colour sum (CLA)"),
  "CTR.maxAbs": mm("Difference of the lateral colour sum (CTR)"),
  "invariant.maxAbs": mm("Difference of the Lagrange invariant"),
  "total.maxScaled": pure("Largest difference of a total, over the sum of its surfaces' magnitudes"),
  "surfaces.maxAbs": mm("Largest difference of one surface's sum"),
  // Zernike fits.
  "coefficients.maxAbs": waves("Largest difference of a Zernike coefficient"),
  "rmsToChief.maxAbs": waves("Difference of the RMS wavefront error"),
  "pvToChief.maxAbs": waves("Difference of the peak-to-valley wavefront error"),
  "fitResidualRms.maxAbs": waves("Difference of the RMS residual of the fit"),
  "fitCondition.max": pure("Largest condition number of a fit's normal equations"),
  "fitCondition.setAsideMax": pure(
    "Largest condition number of a fit's normal equations, in the fields set aside as not converged (shown, not judged)",
  ),
};

/** The suffix of a figure of an engine's first answer, beside the same figure of its later one. */
const FIRST_STEP = ".firstStepMaxAbs";

/**
 * The label of a metric key. A `<subject>.firstStepMaxAbs` is labelled from its `<subject>.maxAbs`; a key with no
 * label is returned unchanged.
 */
export function metricLabel(key: string): string {
  const known = METRICS[key];
  if (known !== undefined) return known.label;
  if (key.endsWith(FIRST_STEP)) {
    const base = METRICS[`${key.slice(0, -FIRST_STEP.length)}.maxAbs`];
    if (base !== undefined) return `${base.label}, at the engine's first, coarser sampling`;
  }
  return key;
}

/** The unit of a metric key in words, or null when the key has no label. */
export function metricUnit(key: string): string | null {
  const known =
    METRICS[key] ?? (key.endsWith(FIRST_STEP) ? METRICS[`${key.slice(0, -FIRST_STEP.length)}.maxAbs`] : undefined);
  return known === undefined ? null : (UNIT_TEXT[known.unit] ?? known.unit);
}

/**
 * The metrics of a side-by-side check whose limit sorts a field or wavelength before any difference is taken (beyond
 * it the two answers are not of the same thing, or one has not converged): a limit of the sorting, not a review band.
 */
export const SORTING_LIMITS: readonly string[] = [
  "chiefLanding.maxAbs",
  "landing.maxAbs",
  "pupilRadius.relative",
  "rearFocus.maxAbs",
  "invariant.maxAbs",
  "fitCondition.max",
];
