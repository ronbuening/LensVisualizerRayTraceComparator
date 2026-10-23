// Raw engine wavefront samples, never a transfer function. Version 1 is independent of mtf.native.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { JsonObject } from "../json.ts";
import type { RunFields } from "../runSpec.ts";

export const WAVEFRONT_NATIVE = "wavefront.native";
export const WAVEFRONT_NATIVE_VERSION = 1;

/** One line, on even midpoint grids strictly inside the unit pupil circle. */
export type WavefrontNativeSpec = {
  readonly line: number;
  readonly fields: RunFields;
  readonly grids: readonly number[];
};

export type WavefrontSample = {
  readonly gridSize: number;
  /** Row-major square, including dark cells outside the circle. Normalised stop coordinates [N,2]. */
  readonly normalizedPupil: NdArrayWire;
  /** Wavefront.get_data's intersections with its reference sphere, mm, [N,3]. */
  readonly pupilMm: NdArrayWire;
  /** optiland's sign: (chief path - sample path) / vacuum wavelength; [N]. */
  readonly opdWaves: NdArrayWire;
  readonly intensity: NdArrayWire;
  /** 1 only for finite, positive-intensity samples; 0 elsewhere. Dark cells contribute no flux. */
  readonly valid: NdArrayWire;
  readonly reference: {
    readonly strategy: "chief_ray";
    readonly removeTilt: false;
    readonly sphereCenterMm: readonly number[];
    readonly radiusMm: number;
    readonly exitPupilMm: readonly number[];
  };
};

export type WavefrontNativeField = {
  readonly field: number;
  readonly fieldAngleDeg: number;
  readonly imageHeightMm: number | null;
  readonly status: "ok" | "unavailable";
  readonly reason?: string;
  readonly samples: readonly WavefrontSample[];
};

export type WavefrontNativeData = {
  readonly line: {
    readonly index: number;
    readonly wavelengthNm: number;
    readonly weight: number;
    readonly imageIndex: number;
  };
  readonly fields: readonly WavefrontNativeField[];
  readonly method: { readonly name: string; readonly params: JsonObject };
  readonly notes: readonly string[];
};
