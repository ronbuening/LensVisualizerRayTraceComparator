// The light of a case: its lines, the index after every surface at each line, and where the object is. All three
// are LensVisualizer's decisions, taken from its MTF support gate and its index resolver, the path its own MTF
// traces with. Nothing here computes an index.
import type { ObjectConjugate, SpectralLine } from "../../contract/case.ts";
import type { RunLines } from "../../contract/runSpec.ts";
import type { ExportProblem } from "./exportProblems.ts";
import type { LvApi, LvMtfSupport, LvPreparedState } from "./types.ts";

/** The LensVisualizer exports that decide lines, indices and conjugate. */
export type LvLightApi = Pick<
  LvApi,
  "assessMtfSupport" | "mtfIndexResolver" | "mtfFiniteObjectPoint" | "spectralLinesNm"
>;

/** What `exportLight` gives when LensVisualizer can supply all of it. */
export interface CaseLight {
  readonly object: ObjectConjugate;
  /** The reference line first. */
  readonly lines: SpectralLine[];
  /** The index after each surface at each line, in C order: `[lines, surfaces]`. */
  readonly indexAfterSurface: Float64Array;
}

/** The light of a case, or every reason LensVisualizer cannot supply it. */
export type LightResult =
  { readonly ok: true; readonly light: CaseLight } | { readonly ok: false; readonly problems: ExportProblem[] };

/**
 * The reasons of LV's gate that do not speak about the glass data: its MTF path does not cover the lens at all. A
 * case can still be exported at the reference line, with the indices the prescription states.
 */
const PATH_REASONS: readonly string[] = ["unsupported-path", "unverified-scale"];

/**
 * True when what the contract can express accounts for LV's "unsupported-path": a fisheye projection or an annular
 * aperture. The exporter has by then ruled out the other causes in LV's gate (a folded path, a diffractive
 * surface, a surface that does not refract, a tilted image plane); an integration test pins the gate's condition,
 * so a cause LV adds is noticed.
 */
function pathIsExpressible(state: LvPreparedState): boolean {
  const fisheye = state.lens.projection.kind.startsWith("fisheye");
  return fisheye || state.surfaces.some((surface) => (surface.innerSd ?? 0) > 0);
}

/** The object of a state: at infinity at infinity focus, else at the point of the conjugate LV certifies. */
function objectOf(api: LvLightApi, state: LvPreparedState, support: LvMtfSupport): ObjectConjugate | ExportProblem {
  if (state.focusT === 0) return { kind: "infinity" };
  const point = support.conjugate === undefined ? null : api.mtfFiniteObjectPoint(state, support.conjugate, 0);
  if (point === null) {
    return {
      code: "finite-conjugate-unavailable",
      message:
        `focus position ${state.focusT} at zoom ${state.zoomT} is not a station whose object distance ` +
        "LensVisualizer certifies; only infinity focus and its documented stations can be exported",
    };
  }
  return { kind: "finite", z: point[2] };
}

/**
 * The lines, the index table and the object of a prepared state, as LensVisualizer's MTF path would trace it.
 *
 * LV's `assessMtfSupport` is asked for the spectrum of `runLines`: "reference", "cdf" or "photopic" as named, and
 * "cdf" for an explicit list, since explicit wavelengths take the indices of a spectral run. `seedRadius` fills
 * the two radii the gate requires to be positive; it reads them for nothing else.
 *
 * - **Lines.** A named spectrum has LV's lines and weights (`MtfSupport.spectralLines`), the reference line first.
 *   An explicit list has its own wavelengths, the first of them the reference line as in every LV spectrum, with
 *   the weights given, or 1 each; every wavelength must lie between LV's g and C lines, which its anchored
 *   indices are fitted between.
 * - **Indices.** For each line, `mtfIndexResolver(state, support, wavelength)`: where it gives a resolver, the
 *   line's indices are the resolver's and its source is "anchored"; where it gives none, they are each surface's
 *   authored `nd` and the source is "authored". Air stays exactly 1 either way.
 * - **Object.** At infinity focus, infinity. Elsewhere the z of `mtfFiniteObjectPoint` for the conjugate that LV
 *   certifies for exactly this state (`MtfSupport.conjugate`); without one the state is not exportable.
 *
 * When LV's gate does not pass, its reason is the problem's code. Two reasons say only that LV's MTF path does not
 * cover the lens ("unsupported-path", "unverified-scale"): the reference line of a lens with one index reference is
 * then still exported with the authored indices, which is what every LV tracer reads, provided the contract can
 * express what LV's path cannot (a fisheye projection, an annular aperture). Several lines, or mixed references,
 * need LV's per-wavelength indices, which it does not supply for such a lens.
 *
 * Throws when LV calls the exporter's own request invalid, or gives an explicit wavelength no resolver: either
 * means the exporter no longer asks LV correctly.
 */
export function exportLight(
  api: LvLightApi,
  state: LvPreparedState,
  runLines: RunLines | undefined,
  seedRadius: number,
): LightResult {
  const asked: RunLines = runLines ?? { kind: "reference" };
  const support = api.assessMtfSupport(state, {
    method: "geometric",
    spectrum: asked.kind === "explicit" ? "cdf" : asked.kind,
    pupilSemiDiameterMm: seedRadius,
    stopSemiDiameterMm: seedRadius,
    focus: "design",
  });
  const problems: ExportProblem[] = [];

  const object = objectOf(api, state, support);
  if ("code" in object) problems.push(object);

  if (!support.available) {
    const reason = support.reason ?? "unavailable";
    if (reason === "invalid-input" || reason === "active-movement") {
      throw new Error(`LensVisualizer refuses the exporter's own request (${reason}): ${support.message}`);
    }
    // The object's problem already says it, in the exporter's words; the lines are not looked at further.
    if (reason === "finite-conjugate-unavailable" && problems.length > 0) return { ok: false, problems };
    if (!PATH_REASONS.includes(reason)) {
      return { ok: false, problems: [...problems, { code: reason, message: support.message }] };
    }
    if (reason === "unsupported-path" && !pathIsExpressible(state)) {
      const message =
        "LensVisualizer does not support the optical path, for a reason the exporter does not know: " + support.message;
      return { ok: false, problems: [...problems, { code: reason, message }] };
    }
    if (asked.kind !== "reference" || support.useResolvedReference) {
      const message =
        `LensVisualizer's MTF path, the only source of per-wavelength indices, does not cover this lens ` +
        `(${support.message}); only the reference line of a lens with one index reference can be exported`;
      return { ok: false, problems: [...problems, { code: reason, message }] };
    }
  }

  let lines: { wavelengthNm: number; weight: number }[];
  if (asked.kind === "explicit") {
    const { g, C } = api.spectralLinesNm;
    const outside = asked.wavelengthsNm.filter((wavelength) => wavelength < g || wavelength > C);
    if (outside.length > 0) {
      const message =
        `${outside.join(", ")} nm is outside ${g} to ${C} nm, ` +
        "the lines LensVisualizer's indices are fitted between";
      problems.push({ code: "wavelength-outside-fitted-range", message });
    }
    lines = asked.wavelengthsNm.map((wavelengthNm, index) => ({ wavelengthNm, weight: asked.weights?.[index] ?? 1 }));
  } else {
    lines = support.spectralLines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight }));
    if (lines[0]?.wavelengthNm !== support.referenceWavelengthNm) {
      throw new Error(
        `LensVisualizer's first line (${lines[0]?.wavelengthNm} nm) is not its reference line ` +
          `(${support.referenceWavelengthNm} nm)`,
      );
    }
  }
  if ("code" in object || problems.length > 0) return { ok: false, problems };

  const surfaces = state.surfaces.length;
  const indexAfterSurface = new Float64Array(lines.length * surfaces);
  const withSources = lines.map((line, row): SpectralLine => {
    const resolver = api.mtfIndexResolver(state, support, line.wavelengthNm);
    if (resolver === undefined && asked.kind === "explicit") {
      throw new Error(`LensVisualizer gives no index resolver for the explicit wavelength ${line.wavelengthNm} nm`);
    }
    state.surfaces.forEach((surface, column) => {
      indexAfterSurface[row * surfaces + column] = resolver === undefined ? surface.nd : resolver(column, surface.nd);
    });
    return { ...line, indexSource: resolver === undefined ? "authored" : "anchored" };
  });
  return { ok: true, light: { object, lines: withSources, indexAfterSurface } };
}
