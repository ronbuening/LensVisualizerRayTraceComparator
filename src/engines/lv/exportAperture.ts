// The stop radius of a run and the clear aperture of each surface, taken from LensVisualizer's own functions.
import type { SurfaceAperture } from "../../contract/case.ts";
import type { RunAperture } from "../../contract/runSpec.ts";
import type { ExportProblem } from "./exportProblems.ts";
import { lvHookStop, lvTabComparison } from "./tabRequest.ts";
import type { LvApi, LvPreparedState, LvRuntimeLens, LvSurface, LvTraceGeometry } from "./types.ts";

/** The geometry LV clips against, always present after its engine rewrite. */
export function apertureGeometry(state: LvPreparedState): LvTraceGeometry {
  if (state.traceGeometry === undefined) throw new Error("LensVisualizer prepared state lacks traceGeometry");
  return state.traceGeometry;
}

/** The LensVisualizer functions that size the stop. */
export type LvStopApi = Pick<LvApi, "wideOpenStopAtZoom" | "fopenAtZoomClamped" | "fNumberAtStopdown">;

/** The code of the problem of a run that asks for the tab's f/8 comparison of a lens the tab offers none for. */
export const F8_COMPARISON_UNAVAILABLE = "f8-comparison-unavailable";

/** The stop radius of a run, mm, or why there is none. */
export type StopRadiusResult =
  { readonly ok: true; readonly radius: number } | { readonly ok: false; readonly problem: ExportProblem };

/**
 * LensVisualizer's wide-open stop radius at a zoom position, mm: `wideOpenStopAtZoom(zoomT, L)`, which is also the
 * prepared stop surface's `sd`. Throws when it is not a positive number, which no built lens has.
 */
export function wideOpenStopRadius(api: LvStopApi, runtime: LvRuntimeLens, zoomT: number): number {
  const wideOpen = api.wideOpenStopAtZoom(zoomT, runtime);
  if (!(Number.isFinite(wideOpen) && wideOpen > 0)) {
    throw new Error(`LensVisualizer's wide-open stop radius at zoom ${zoomT} is ${wideOpen}`);
  }
  return wideOpen;
}

/**
 * The stop radius a run's aperture asks for, at one zoom position.
 *
 * - `wide-open` (and no aperture at all): `wideOpenStopRadius`.
 * - `f-number` N: LensVisualizer stops down linearly, `wide-open radius × fopenAtZoom(zoomT, L) / N`. The rule
 *   exists only in its React hook (src/components/hooks/useLensComputation.ts, `currentPhysStopSD`), so it is
 *   mirrored here, in the hook's order of operations, and an integration test fails when the hook's expression
 *   changes. The widest f-number asked for by number, f/fopen, is therefore the hook's `(w × fopen) / fopen`, which
 *   can differ from `wide-open` in the last bit. An N below the widest or above maxFstop is a coded problem: it is outside the slider range.
 * - `lv-f8-comparison`: the stop of the f/8 comparison of LensVisualizer's MTF tab, which is not the hook's f/8:
 *   the radius the hook hands the tab wide open, `(wide-open radius × fopen) / fNumber` with the f-number of the
 *   aperture slider at wide open, times `fNumber / 8` (`lvHookStop`, `lvTabComparison`, both restated from
 *   LensVisualizer with source canaries). A lens the tab offers no comparison for, because it is not faster than
 *   f/7.95 wide open or does not stop down to f/8, is a problem with the tab's own reason
 *   (`F8_COMPARISON_UNAVAILABLE`).
 * - `stop-radius`: the radius as given.
 */
export function stopRadius(
  api: LvStopApi,
  runtime: LvRuntimeLens,
  zoomT: number,
  aperture: RunAperture | undefined,
): StopRadiusResult {
  if (aperture?.kind === "stop-radius") return { ok: true, radius: aperture.mm };
  const wideOpen = wideOpenStopRadius(api, runtime, zoomT);
  if (aperture === undefined || aperture.kind === "wide-open") return { ok: true, radius: wideOpen };
  if (aperture.kind === "lv-f8-comparison") {
    const hook = lvHookStop(api, runtime, zoomT);
    const { scale, unavailable } = lvTabComparison(hook, runtime);
    if (unavailable !== null) return { ok: false, problem: { code: F8_COMPARISON_UNAVAILABLE, message: unavailable } };
    return { ok: true, radius: hook.currentPhysStopSD * scale };
  }

  const widest = api.fopenAtZoomClamped(zoomT, runtime);
  if (aperture.value < widest) {
    return {
      ok: false,
      problem: {
        code: "aperture-faster-than-wide-open",
        message: `f/${aperture.value} is faster than the lens's widest aperture at zoom ${zoomT}, f/${widest}`,
      },
    };
  }
  if (aperture.value > runtime.maxFstop) {
    return {
      ok: false,
      problem: {
        code: "aperture-beyond-slider-range",
        message: `f/${aperture.value} is beyond the lens's aperture slider maximum, f/${runtime.maxFstop}`,
      },
    };
  }
  return { ok: true, radius: (wideOpen * widest) / aperture.value };
}

const view = new DataView(new ArrayBuffer(8));

/** The next double above a positive finite one. */
function nextUp(value: number): number {
  view.setFloat64(0, value);
  view.setBigUint64(0, view.getBigUint64(0) + 1n);
  return view.getFloat64(0);
}

/**
 * The largest radius that `outside` does not call outside a clear aperture of semi-diameter `sd`: LensVisualizer's
 * inclusive clip limit, found by asking it.
 *
 * LV clips a hit when `radius > sd + max(1e-9, |sd| × 1e-12)` (`exceedsAperture`, src/optics/trace/aperture.ts).
 * That sum is tried first, and accepted only if LV passes a ray there and clips one at the next double above it,
 * so in the ordinary case the answer is LV's own limit bit for bit after two questions. Should LV change its rule,
 * the limit is found by bisection between `sd`, which must pass, and `2 sd + 1`, which must not.
 *
 * Throws when LV clips at `sd` itself or passes at `2 sd + 1`: then it has no limit of this kind to export.
 */
export function inclusiveClipLimit(outside: (radius: number) => boolean, sd: number): number {
  const mirrored = sd + Math.max(1e-9, Math.abs(sd) * 1e-12);
  if (!outside(mirrored) && outside(nextUp(mirrored))) return mirrored;

  let low = sd;
  let high = 2 * sd + 1;
  if (outside(low)) throw new Error(`LensVisualizer clips a ray at the semi-diameter ${sd} itself`);
  if (!outside(high)) throw new Error(`LensVisualizer passes a ray at ${high}, beyond the semi-diameter ${sd}`);
  for (;;) {
    const middle = low + (high - low) / 2;
    if (middle <= low || middle >= high) return low;
    if (outside(middle)) high = middle;
    else low = middle;
  }
}

/**
 * The radii a surface LensVisualizer says it does not clip at is asked about, as multiples of its `sd` and beyond:
 * on the axis, at the envelope, where a clipping surface of that `sd` would first stop a ray, far outside, and at
 * the largest double.
 */
function unclippedProbeRadii(sd: number): number[] {
  return [0, sd, nextUp(sd + Math.max(1e-9, Math.abs(sd) * 1e-12)), 2 * sd + 1, 1e6 * sd, Number.MAX_VALUE];
}

/**
 * The contract aperture of one prepared surface, read from LensVisualizer's `evaluateAperture`, the function its
 * tracers clip with. `stopRadius` is the run's stop radius when the surface is the stop, and undefined otherwise:
 * LV's tracers override the stop surface's semi-diameter with it in exactly this way.
 *
 * - `nominalSemiDiameter`: the semi-diameter LV traces the surface with (`evaluateAperture(...).semiDiameter`): the
 *   prepared surface's `sd`, or the stop radius on the stop surface.
 * - `semiDiameter`: LV's inclusive clip limit for it (`inclusiveClipLimit`).
 * - `innerSemiDiameter`: LV's inner semi-diameter, 0 for none.
 *
 * **A surface LensVisualizer does not clip at** is one its state marks `clips: false`, the two surfaces of a rear
 * plate whose rim it generated because the prescription publishes none (src/optics/prescription/rearPlates.ts).
 * `evaluateAperture` reports no semi-diameter for it, and its `sd` is an envelope its ray launch and its
 * intersection bounds read. It is exported with `semiDiameter` null, `nominalSemiDiameter` that `sd` and no inner
 * semi-diameter, and only after LV has been asked: it must call no radius of `unclippedProbeRadii` outside, and
 * report no central obstruction.
 *
 * Throws when LV's answer is not the one its own state implies: a semi-diameter that is not the surface's `sd` (or
 * the stop radius), or not a positive number; no semi-diameter for a surface the state does not mark `clips:
 * false`, or one for a surface it does; a surface it does not clip at that it stops a ray at, or that has a hole.
 * Each means the exporter no longer reads LV correctly.
 */
export function surfaceAperture(
  api: Pick<LvApi, "evaluateAperture">,
  state: LvPreparedState,
  surface: LvSurface,
  stopRadius: number | undefined,
): SurfaceAperture {
  const evaluate = (radius: number) => api.evaluateAperture(apertureGeometry(state), surface, radius, stopRadius);
  const onAxis = evaluate(0);
  const nominal = onAxis.semiDiameter;
  const expected = stopRadius ?? surface.sd;
  if (nominal === null && surface.clips === false && stopRadius === undefined) {
    const envelope = surface.sd;
    if (!(Number.isFinite(envelope) && envelope > 0)) {
      throw new Error(`LensVisualizer's surface ${surface.label} does not clip and has the envelope ${envelope}`);
    }
    if (onAxis.innerSemiDiameter !== 0) {
      throw new Error(
        `LensVisualizer's surface ${surface.label} does not clip and has the inner semi-diameter ` +
          `${onAxis.innerSemiDiameter}`,
      );
    }
    for (const radius of unclippedProbeRadii(envelope)) {
      const { state: where, semiDiameter } = evaluate(radius);
      if (where !== "inside" || semiDiameter !== null) {
        throw new Error(
          `LensVisualizer's surface ${surface.label} is marked as one that does not clip, and a ray at the height ` +
            `${radius} is ${where} of the semi-diameter ${semiDiameter}`,
        );
      }
    }
    return { semiDiameter: null, nominalSemiDiameter: envelope, innerSemiDiameter: 0 };
  }
  if (nominal === null || nominal !== expected || !(Number.isFinite(nominal) && nominal > 0)) {
    throw new Error(
      `LensVisualizer traces surface ${surface.label} with the semi-diameter ${nominal}, expected ${expected}`,
    );
  }
  if (surface.clips === false && stopRadius === undefined) {
    throw new Error(
      `LensVisualizer's surface ${surface.label} is marked as one that does not clip, and it is traced with the ` +
        `semi-diameter ${nominal}`,
    );
  }
  return {
    semiDiameter: inclusiveClipLimit((radius) => evaluate(radius).state === "outside", nominal),
    nominalSemiDiameter: nominal,
    innerSemiDiameter:
      state.lens.flags.isFoldedOptics && onAxis.innerSemiDiameter > 0
        ? inclusiveInnerLimit((radius) => evaluate(radius).state === "inside-hole", onAxis.innerSemiDiameter)
        : onAxis.innerSemiDiameter,
  };
}

/** Smallest double on the active side of LV's annular boundary; no tolerance is guessed. */
function inclusiveInnerLimit(inHole: (radius: number) => boolean, nominal: number): number {
  let low = 0,
    high = nominal;
  if (!inHole(low) || inHole(high)) throw new Error("LV annular aperture has no inner boundary of the stated kind");
  for (;;) {
    const middle = low + (high - low) / 2;
    if (middle <= low || middle >= high) return high;
    if (inHole(middle)) low = middle;
    else high = middle;
  }
}
