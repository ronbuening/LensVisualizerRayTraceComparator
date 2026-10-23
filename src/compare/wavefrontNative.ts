// Raw wavefront comparison is only defined on matching grids and reference spheres. R6c compares the OTFs
// instead (mtfWavefront.ts); this comparator makes the raw quantity usable without assigning it a gated rung.
import { WAVEFRONT_NATIVE } from "../contract/quantities/wavefrontNative.ts";
import type { WavefrontNativeData } from "../contract/quantities/wavefrontNative.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { QuantityComparator } from "./comparator.ts";

export const wavefrontNativeComparator: QuantityComparator = {
  quantity: WAVEFRONT_NATIVE,
  metrics: [{ name: "opd.maxAbs", unit: "waves" }],
  compare: (dataA, dataB) => {
    const [a, b] = [dataA as WavefrontNativeData, dataB as WavefrontNativeData];
    if (
      a.line.wavelengthNm !== b.line.wavelengthNm ||
      a.line.imageIndex !== b.line.imageIndex ||
      a.fields.length !== b.fields.length
    ) {
      return { comparable: false, reason: "raw wavefronts have different lines or fields" };
    }
    let worst: number | null = null;
    for (const [fi, fa] of a.fields.entries()) {
      const fb = b.fields[fi];
      if (fa.field !== fb.field || fa.fieldAngleDeg !== fb.fieldAngleDeg)
        return { comparable: false, reason: "raw fields differ" };
      if (fa.status !== "ok" || fb.status !== "ok") continue;
      if (fa.samples.length !== fb.samples.length) return { comparable: false, reason: "raw grids differ" };
      for (const [si, sa] of fa.samples.entries()) {
        const sb = fb.samples[si];
        if (
          sa.gridSize !== sb.gridSize ||
          JSON.stringify(sa.reference) !== JSON.stringify(sb.reference) ||
          sa.normalizedPupil.$nd.sha256 !== sb.normalizedPupil.$nd.sha256 ||
          sa.pupilMm.$nd.sha256 !== sb.pupilMm.$nd.sha256
        ) {
          return { comparable: false, reason: "raw pupils or reference spheres differ" };
        }
        const [va, vb, wa, wb] = [sa.valid, sb.valid, sa.opdWaves, sb.opdWaves].map(
          (wire) => decodeNdArray(wire).values,
        );
        for (let i = 0; i < va.length; i++) if (va[i] && vb[i]) worst = Math.max(worst ?? 0, Math.abs(wa[i] - wb[i]));
      }
    }
    return {
      comparable: true,
      metrics: worst === null ? [] : [{ name: "opd.maxAbs", value: worst }],
      ...(worst === null ? { unmeasured: [{ name: "opd.maxAbs", reason: "no common valid wavefront samples" }] } : {}),
    };
  },
};
