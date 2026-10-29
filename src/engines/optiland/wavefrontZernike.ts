// The comparator's `zernike.native` of raw optiland wavefronts: the Zernike estimator (src/estimators/zernike.ts) on
// the samples of one `wavefront.native` answer, field by field. The worker fits nothing for it.
import type { WavefrontNativeData } from "../../contract/quantities/wavefrontNative.ts";
import type {
  ZernikeNativeData,
  ZernikeNativeField,
  ZernikeNativeSpec,
} from "../../contract/quantities/zernikeNative.ts";
import { decodeNdArray } from "../../core/numeric/ndarray.ts";
import { fitZernike } from "../../estimators/zernike.ts";

/**
 * The fit and the figures of each field of a raw answer of one grid: the normalised pupil coordinates of the midpoint
 * square, the OPD in vacuum waves as optiland gives it and its validity, handed to `fitZernike` as they are (the frame
 * is optiland's, the contract's mirrored in y, as the worker's own fit). A field the worker could not sample, or the
 * estimator could not fit, is unavailable with the reason.
 */
export function wavefrontZernike(data: WavefrontNativeData, spec: ZernikeNativeSpec): ZernikeNativeData {
  const fields = data.fields.map((field): ZernikeNativeField => {
    const none = (reason: string): ZernikeNativeField => ({
      fieldAngleDeg: field.fieldAngleDeg,
      imageHeightMm: null,
      status: "unavailable",
      reason,
      coefficients: [],
      rmsToChiefWaves: null,
      pvToChiefWaves: null,
      fitResidualRmsWaves: null,
      fitCondition: null,
      validSamples: 0,
      sampling: {},
    });
    if (field.status !== "ok") return none(field.reason ?? "no-wavefront");
    const sample = field.samples.at(-1);
    if (sample === undefined) return none("no-wavefront");
    const pupil = decodeNdArray(sample.normalizedPupil).values;
    const cells = sample.gridSize * sample.gridSize;
    const x = Float64Array.from({ length: cells }, (_, cell) => pupil[2 * cell]);
    const y = Float64Array.from({ length: cells }, (_, cell) => pupil[2 * cell + 1]);
    const fit = fitZernike(
      { x, y, w: decodeNdArray(sample.opdWaves).values, valid: decodeNdArray(sample.valid).values },
      spec.ordering,
      spec.terms,
    );
    if (!fit.available) return none(fit.reason);
    return {
      fieldAngleDeg: field.fieldAngleDeg,
      imageHeightMm: field.imageHeightMm,
      status: "ok",
      coefficients: Array.from(fit.coefficients),
      rmsToChiefWaves: fit.rmsToChief,
      pvToChiefWaves: fit.pvToChief,
      fitResidualRmsWaves: fit.residualRms,
      fitCondition: fit.normalCondition,
      validSamples: fit.samples,
      sampling: { gridSize: sample.gridSize },
    };
  });
  return {
    line: { index: data.line.index, wavelengthNm: data.line.wavelengthNm },
    grid: spec.grid,
    ordering: spec.ordering,
    terms: spec.terms,
    fields,
    method: {
      name: "comparator-zernike-optiland-wavefront",
      params: {
        source: "Wavefront.get_data",
        fit: "normal-equations-compensated-cholesky",
        pupil: "stop-midpoints",
        frame: "mirrored-in-y",
        opdSign: "reference-minus-path",
        opdUnit: "vacuum-waves",
        removeTilt: false,
      },
    },
    notes: data.notes,
  };
}
