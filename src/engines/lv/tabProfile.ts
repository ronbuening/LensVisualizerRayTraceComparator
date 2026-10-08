// The profile `lv-tab-default` from the asking side: for a lens key and a zoom position, the case LensVisualizer's
// MTF tab is about and the `mtf.native` spec its request is. The engine `lv` rebuilds the same request from the
// case and holds the spec to it (`answerLvMtf`); this is what builds a case and a spec that it will accept.
import type { OpticalCase } from "../../contract/case.ts";
import type { MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import type { LvBinding } from "./binding.ts";
import { exportCase } from "./exportCase.ts";
import type { ExportOptions } from "./exportCase.ts";
import type { ExportProblem } from "./exportProblems.ts";
import { createLensBuilder } from "./lensBuilder.ts";
import type { LensBuilder } from "./lensBuilder.ts";
import { LV_MTF_SPECTRA } from "./mtf.ts";
import { lvTabRequest, lvTabSpec } from "./tabRequest.ts";
import type { LvTabView } from "./tabRequest.ts";

/** What the profile is asked for: a lens of the catalog at a zoom position, at infinity focus, in one of its views. */
export interface LvTabProfileAsk {
  readonly lensKey: string;
  /** The zoom position, 0 (wide) to 1 (tele). A prime has none: it is taken as 0. */
  readonly zoomT: number;
  readonly view: LvTabView;
}

/** The tab's request for a lens as a case and a spec, or every reason the lens has no case. */
export type LvTabProfileResolution =
  | {
      readonly ok: true;
      /** The case the tab's request is about: its stop radius and its lines are the request's. */
      readonly opticalCase: OpticalCase;
      /** The spec of the request, which names the profile. */
      readonly spec: MtfNativeSpec;
      /** The frequencies of the spec that the tab draws. */
      readonly displayedFrequenciesPerMm: readonly number[];
      readonly view: LvTabView;
      /** The f-number the view is labelled with. */
      readonly fNumber: number;
      /** Why the tab makes no such request for the lens, by its own rule; null when it makes it. */
      readonly unavailable: string | null;
    }
  | { readonly ok: false; readonly problems: readonly ExportProblem[] };

/** Resolves the profile for the lenses of one bound checkout. */
export type LvTabProfileResolver = (ask: LvTabProfileAsk) => Promise<LvTabProfileResolution>;

function isLvSpectrum(spectrum: string): spectrum is (typeof LV_MTF_SPECTRA)[number] {
  return (LV_MTF_SPECTRA as readonly string[]).includes(spectrum);
}

/**
 * The resolver of the profile `lv-tab-default` on a bound LensVisualizer checkout. For a lens at a zoom position:
 *
 * 1. the lens is exported as it opens, wide open on its reference line. A lens that has no case at all (a folded
 *    path, a key the catalog does not hold) has those problems, and nothing of the tab is asked;
 * 2. the tab's request for the state is built (`lvTabRequest`) for the view that is asked for;
 * 3. the lens is exported again with the request's stop radius and on the lines of the request's spectrum: the
 *    case every engine is asked about is then the one the tab traces. The stop radius is the hook's, which is not
 *    always the prepared state's to the last bit, so this case need not be the one a run exports for "wide-open".
 *    Where LensVisualizer's support gate refuses the request, the tab shows no MTF and traces no lines: the case
 *    is then on the reference line, the one line such a lens can be exported on, and the engine answers it as the
 *    gate does.
 *
 * The f/8 comparison of a lens the tab offers none for is resolved all the same, with the radii the tab's scaling
 * gives, and `unavailable` says why the tab makes no such request: the engine then says "unsupported" with that
 * reason. One such lens has no case of its own for the comparison: a lens that is f/8 wide open is scaled by 8 / 8,
 * so its comparison is its wide-open case, and the engine answers that. Rejects where `exportCase` throws.
 */
export function createLvTabProfileResolver(
  binding: LvBinding,
  build: LensBuilder = createLensBuilder(binding),
): LvTabProfileResolver {
  return async ({ lensKey, zoomT: asked, view }) => {
    const lens = await build(lensKey);
    if (!lens.ok) return { ok: false, problems: [lens.problem] };
    const zoomT = lens.runtime.isZoom ? asked : 0;
    const { api } = binding;
    const { commit, dirty, engineClosureHash } = binding.fingerprint();
    const exported = (options: ExportOptions) =>
      exportCase({
        api,
        lens: lens.entry,
        runtime: lens.runtime,
        options: { state: { zoomT, focus: { kind: "infinity" } }, imagePlane: { kind: "design" }, ...options },
        lv: { commit, dirty, closureHash: engineClosureHash },
      });

    const asItOpens = exported({ aperture: { kind: "wide-open" }, lines: { kind: "reference" } });
    if (!asItOpens.ok) return asItOpens;

    const state = api.prepareRuntimeState(lens.runtime, 0, zoomT);
    const request = lvTabRequest(api, lens.runtime, state, view);
    const { spectrum } = request.options;
    if (!isLvSpectrum(spectrum)) {
      throw new Error(
        `lens ${lensKey}: LensVisualizer's MTF tab asks for the spectrum "${spectrum}", which is unknown`,
      );
    }
    const shown = api.assessMtfSupport(state, request.options).available;
    const tabCase = exported({
      aperture: { kind: "stop-radius", mm: request.options.stopSemiDiameterMm },
      lines: { kind: shown ? spectrum : "reference" },
    });
    if (!tabCase.ok) return tabCase;
    return {
      ok: true,
      opticalCase: tabCase.opticalCase,
      spec: lvTabSpec(request),
      displayedFrequenciesPerMm: request.displayedFrequenciesPerMm,
      view,
      fNumber: request.fNumber,
      unavailable: request.unavailable,
    };
  };
}
