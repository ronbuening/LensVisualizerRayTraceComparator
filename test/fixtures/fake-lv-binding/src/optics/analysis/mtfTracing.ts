import { LINE_NM } from "../spectralLines.js";
import type { FakeMtfSupport, FakeState } from "../types.js";

// A dispersion that is nothing like a glass's and easy to check: 1e-5 of index per nm from the d line, air at 1.
export function mtfIndexResolver(
  _state: FakeState,
  support: FakeMtfSupport,
  wavelengthNm: number,
): ((surfaceIndex: number, nd: number) => number) | undefined {
  if (!support.useResolvedReference) return undefined;
  return (_surfaceIndex, nd) => (nd === 1 ? 1 : nd + (LINE_NM.d - wavelengthNm) * 1e-5);
}
