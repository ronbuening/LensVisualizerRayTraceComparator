// The comparator's native-MTF-shaped view of raw optiland wavefronts. The worker computes no OTF.
import type { MtfNativeData, MtfNativeField, MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import type { WavefrontNativeData, WavefrontSample } from "../../contract/quantities/wavefrontNative.ts";
import { decodeNdArray, encodeF8 } from "../../core/numeric/ndarray.ts";
import { wavefrontOtf } from "../../estimators/wavefrontOtf.ts";
import { gridConvergence } from "../../estimators/waveOtf.ts";
import { waveFlags } from "../../estimators/waveValidity.ts";

/** Pure conversion: flags are facts of this estimate, never a gate or a replacement for a failed field. */
export function wavefrontMtf(data: WavefrontNativeData, spec: MtfNativeSpec): MtfNativeData {
  const fields = data.fields.map((field): MtfNativeField => {
    const base = { field: field.field, fieldAngleDeg: field.fieldAngleDeg, imageHeightMm: field.imageHeightMm };
    const none = (reason: string): MtfNativeField => ({
      ...base,
      status: "unavailable",
      reason,
      sampling: {},
      sagittal: encodeF8(spec.frequenciesPerMm.map(() => Number.NaN)),
      tangential: encodeF8(spec.frequenciesPerMm.map(() => Number.NaN)),
    });
    if (field.status !== "ok") return none(field.reason ?? "no-wavefront");
    const estimates = field.samples.map((sample) =>
      sampledWavefrontOtf(sample, data.line.wavelengthNm * 1e-6, data.line.imageIndex, spec.frequenciesPerMm),
    );
    const fine = estimates.at(-1);
    if (fine === undefined) return none("no-wavefront");
    if (!fine.available) return none(fine.reason);
    const coarse = estimates.at(-2);
    const convergence = coarse?.available === true ? gridConvergence(coarse, fine).maxAbs : null;
    const flags = waveFlags(fine.phaseStep.waves, convergence, field.field === 0);
    const finiteModuli = [fine.sagittal, fine.tangential].every((cut) =>
      cut.modulus.every((value) => value >= 0 && value <= 1 + 1e-12),
    );
    if (!finiteModuli) return none("mtf-not-a-modulus");
    return {
      ...base,
      status: flags.length === 0 ? "ok" : "unconverged",
      ...(flags.length === 0 ? {} : { reason: flags.join("+") }),
      // Only the rounding of a modulus above one is taken to one, as for the geometric worker.
      sagittal: encodeF8(Array.from(fine.sagittal.modulus, (value) => Math.min(1, value))),
      tangential: encodeF8(Array.from(fine.tangential.modulus, (value) => Math.min(1, value))),
      sampling: {
        gridSize: field.samples.at(-1)?.gridSize ?? 0,
        validRays: fine.cells,
        phaseStepWaves: fine.phaseStep.waves,
        ...(convergence === null ? {} : { maxDelta: convergence }),
      },
    };
  });
  return {
    fields,
    method: {
      name: "hopkins-optiland-wavefront",
      params: {
        source: "Wavefront.get_data",
        coordinate: "reference-sphere-optical-cosines",
        opdSign: "reference-minus-path",
        weight: "intensity-as-cell-flux",
        frame: "mirrored-in-y",
        removeTilt: false,
      },
    },
    focus: { mode: "design", appliedShiftMm: 0 },
    aperture: {},
    lines: [{ wavelengthNm: data.line.wavelengthNm, weight: data.line.weight }],
    notes: data.notes,
  };
}

/** Wire decoding stays in the adapter; the estimator knows only arrays of numbers. */
function sampledWavefrontOtf(
  sample: WavefrontSample,
  wavelengthMm: number,
  imageIndex: number,
  frequencies: ArrayLike<number>,
) {
  const values = (name: "pupilMm" | "opdWaves" | "intensity" | "valid") => decodeNdArray(sample[name]).values;
  return wavefrontOtf(
    {
      columns: sample.gridSize,
      rows: sample.gridSize,
      pupilMm: values("pupilMm"),
      opdWaves: values("opdWaves"),
      intensity: values("intensity"),
      valid: values("valid"),
      centerMm: sample.reference.sphereCenterMm,
      wavelengthMm,
      imageIndex,
    },
    frequencies,
  );
}
