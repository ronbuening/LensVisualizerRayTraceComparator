// `mtf.native` as the engine `lv` answers it: LensVisualizer's product MTF, `computeMtf`, on its own prepared state.
// It is the MTF LensVisualizer presents, so nothing of it is the comparator's: the method, the sampling, the focus
// search and the spectra are LensVisualizer's, and the engine only builds the request and writes the answer down.
import type { SpectralLine } from "../../contract/case.ts";
import type { JsonObject } from "../../contract/json.ts";
import { MTF_DESIGN_PLANE } from "../../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeField, MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { LV_MTF_SPECTRA, lvBestAxialFocus, lvGeneralMtfOptions, lvSpectrumOf } from "./focus.ts";
import { LV_TAB_PROFILE, lvTabRequest, lvTabSpec } from "./tabRequest.ts";
import type { LvTabApi, LvTabRequest } from "./tabRequest.ts";
import type { LvApi, LvMtfFieldResult, LvMtfOptions, LvMtfResult, LvMtfSupport, LvPreparedState } from "./types.ts";

export { LV_MTF_SPECTRA, lvSpectrumOf } from "./focus.ts";

/** The LensVisualizer exports an MTF request is built with. */
export type LvMtfRequestApi = LvTabApi & Pick<LvApi, "assessMtfSupport" | "computeMtfSteps">;

/** The LensVisualizer exports an MTF is answered with. */
export type LvMtfApi = LvMtfRequestApi & Pick<LvApi, "computeMtf">;

/** The pupil grids LensVisualizer's refinement may be capped at. */
export const LV_GRID_CAPS: readonly number[] = [32, 64, 128, 256];

/** The grid cap of a request that states none: LensVisualizer's own default, and that of its MTF tab. */
export const LV_DEFAULT_GRID_CAP = 128;

/** The engine option that caps the pupil grid: `sampling.lvGridCap` of a run. A profile fixes it. */
export const LV_GRID_CAP_OPTION = "lvGridCap";

/**
 * The `item` of each "unsupported" answer that is the engine's own, beside the reasons of LensVisualizer's support
 * gate, which are items of code `feature` under LensVisualizer's names (`unsupported-path`, `unverified-scale`):
 *
 * - `customSpectrum` (`feature`): the lines of the case are none of LensVisualizer's three spectra;
 * - `shiftedImagePlane` (`feature`): the image plane of the case is neither the design plane nor LensVisualizer's
 *   own best axial focus for the request, and its MTF is of no other plane; or it is that best focus and the spec
 *   asks for the engine's best focus, which is asked of the design plane;
 * - `f8Comparison` (`feature`): the case is stopped down as the tab's f/8 comparison would be, for a lens the tab
 *   offers none for;
 * - `fieldAngles` (`option`): fields as angles, where LensVisualizer takes fractions of its reference image height;
 * - `profile` (`option`): a profile other than `LV_TAB_PROFILE`;
 * - `gridCap` (`option`): a grid cap that is none of `LV_GRID_CAPS`;
 * - `fieldLimits`, `frequencyLimits` (`option`): fields or frequencies beyond what LensVisualizer takes in one
 *   request: it limits how many of each there may be, and how high a frequency.
 */
export const LV_MTF_UNSUPPORTED = Object.freeze({
  customSpectrum: "lines.custom-spectrum",
  shiftedImagePlane: "image-plane.shifted",
  f8Comparison: "aperture.f8-comparison",
  fieldAngles: "fields.angles-deg",
  profile: "profile",
  gridCap: LV_GRID_CAP_OPTION,
  fieldLimits: "fields.limits",
  frequencyLimits: "frequenciesPerMm.limits",
} as const);

/** What the engine makes of an `mtf.native` spec: the MTF with its counts, or why there is none. */
export type LvMtfAnswer =
  | { readonly data: MtfNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly error: ErrorInfo };

function unsupported(code: UnsupportedItem["code"], item: string, message: string): LvMtfAnswer {
  return { unsupported: [{ code, item, message }] };
}

function badSpec(message: string): LvMtfAnswer {
  return { error: { code: "bad-spec", message } };
}

/**
 * LensVisualizer's refusal of a state, as the answer: "unsupported", with its reason as the item and its message.
 * Throws for the two reasons that say the engine itself asked wrongly, which no case can cause.
 */
function gateRefusal(support: LvMtfSupport): LvMtfAnswer {
  const reason = support.reason ?? "unavailable";
  if (reason === "invalid-input" || reason === "active-movement") {
    throw new Error(`LensVisualizer refuses the engine's own MTF request (${reason}): ${support.message}`);
  }
  return unsupported("feature", reason, support.message);
}

/**
 * What LensVisualizer does not take of a spec the contract allows, as the answer, or null when it takes all of it.
 * LensVisualizer limits how many fields and how many frequencies a request has, and how high a frequency may be.
 * The limits are its own and are not restated here: its gate has passed `accepted`, and is asked again with the
 * spec's fields alone and with its frequencies alone, so what it then refuses is that member, and the message is
 * the gate's.
 */
function specRefusal(
  api: Pick<LvApi, "assessMtfSupport">,
  state: LvPreparedState,
  accepted: LvMtfOptions,
  spec: MtfNativeSpec,
): LvMtfAnswer | null {
  const refused = (member: Partial<LvMtfOptions>): string | null => {
    const support = api.assessMtfSupport(state, { ...accepted, ...member });
    return support.available ? null : support.message;
  };
  const fields = spec.fields.values;
  const ofFields = refused({ fieldFractions: [...fields] });
  if (ofFields !== null) {
    const message =
      `LensVisualizer's MTF does not take the ${fields.length} fields of the spec in one request: ` + ofFields;
    return unsupported("option", LV_MTF_UNSUPPORTED.fieldLimits, message);
  }
  const frequencies = spec.frequenciesPerMm;
  const ofFrequencies = refused({ frequenciesPerMm: [...frequencies] });
  if (ofFrequencies !== null) {
    const message =
      `LensVisualizer's MTF does not take the ${frequencies.length} frequencies of the spec, up to ` +
      `${frequencies.at(-1)} cycles/mm, in one request: ${ofFrequencies}`;
    return unsupported("option", LV_MTF_UNSUPPORTED.frequencyLimits, message);
  }
  return null;
}

function linesText(lines: readonly Pick<SpectralLine, "wavelengthNm">[]): string {
  return `${lines.map((line) => line.wavelengthNm).join(", ")} nm`;
}

function sameList(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/** What a spec that names the tab's profile states otherwise than the profile, or null when it states the same. */
function profileMismatch(spec: MtfNativeSpec, expected: MtfNativeSpec): string | null {
  if (spec.method !== expected.method) return `method is ${spec.method}, and the tab's is ${expected.method}`;
  if (spec.focus !== expected.focus) return `focus is ${spec.focus}, and the tab's is ${expected.focus}`;
  if (spec.fields.kind !== expected.fields.kind || !sameList(spec.fields.values, expected.fields.values)) {
    return `fields are not the tab's, the fractions ${expected.fields.values.join(", ")}`;
  }
  if (!sameList(spec.frequenciesPerMm, expected.frequenciesPerMm)) {
    const [first, last] = [expected.frequenciesPerMm[0], expected.frequenciesPerMm.at(-1)];
    const said = `${expected.frequenciesPerMm.length} from ${first} to ${last} cycles/mm`;
    return `frequenciesPerMm are not the ones the tab computes (${said})`;
  }
  return null;
}

/** The members of a map that are finite numbers: what a JSON number can be. */
function finiteNumbers(values: Readonly<Record<string, number | null>>): { [name: string]: number } {
  const kept: [string, number][] = [];
  for (const [name, value] of Object.entries(values)) {
    if (value !== null && Number.isFinite(value)) kept.push([name, value]);
  }
  return Object.fromEntries(kept);
}

/**
 * One field of LensVisualizer's result as the contract states it. "converged" is `ok`; an unavailable field has
 * NaN at every frequency and LensVisualizer's reason; the angle and the image height are LensVisualizer's. Throws
 * when the field is not the one that was asked for, was left pending, or has curves of another length than the
 * request's frequencies.
 */
export function fieldOf(field: LvMtfFieldResult, requested: number, frequencies: number): MtfNativeField {
  if (field.fieldFraction !== requested) {
    throw new Error(`LensVisualizer answers the field ${requested} with the field ${field.fieldFraction}`);
  }
  if (field.status === "pending") throw new Error(`LensVisualizer left the field ${requested} pending`);
  const available = field.status !== "unavailable";
  const curve = (values: readonly number[], cut: string): Float64Array => {
    if (!available) return new Float64Array(frequencies).fill(NaN);
    if (values.length !== frequencies) {
      throw new Error(`LensVisualizer's ${cut} curve of the field ${requested} has ${values.length} values`);
    }
    return Float64Array.from(values);
  };
  const reason = field.reason ?? (available ? null : "unavailable");
  return {
    field: requested,
    fieldAngleDeg: field.fieldAngleDeg,
    imageHeightMm: field.imageHeightMm,
    sagittal: encodeNdArray(curve(field.sagittal, "sagittal")),
    tangential: encodeNdArray(curve(field.tangential, "tangential")),
    status: field.status === "converged" ? "ok" : field.status,
    ...(reason === null ? {} : { reason }),
    sampling: finiteNumbers({
      gridSize: field.gridSize,
      validRays: field.validRays,
      blockedRays: field.blockedRays,
      failedRays: field.failedRays,
      unknownFluxFraction: field.unknownFluxFraction,
      maxDelta: field.maxDelta,
      convergedThroughLpMm: field.convergedThroughLpMm,
    }),
  };
}

/** What LensVisualizer says of a field in words: why it has no curve or an unsettled one, and its qualifications. */
export function fieldNotes(field: LvMtfFieldResult): string[] {
  const said = field.status === "converged" ? [] : [field.message];
  return [...said, ...field.notes].map((note) => `field ${field.fieldFraction}: ${note}`);
}

/**
 * LensVisualizer's result as `mtf.native` data.
 *
 * - `fields`: one per requested fraction, in order (`fieldOf`). `sampling` holds LensVisualizer's `gridSize`, its
 *   three ray counts, which are summed over the lines, `unknownFluxFraction` and, where it has them, `maxDelta` and
 *   `convergedThroughLpMm`.
 * - `method`: LensVisualizer's own name of the method, and under `params` the request as it was made: `spectrum`,
 *   `focus` (LensVisualizer's mode), `maxGridSize`, both radii and, where it resolved a field axis, the height the
 *   fractions are of (`referenceHeightMm`) and what that height is (`fieldBasis`), with `extra` beside them.
 * - `focus`: the plane LensVisualizer applied, `design` or `best-axial`, and its shift from the image plane of the
 *   case. A request without a field axis has no focus search: the design plane. For a case whose image plane is
 *   LensVisualizer's own best axial focus (`caseAtBestAxial`), that plane is the plane of the case as it is: the
 *   mode is the contract's `design` and the shift 0, and `method.params.focus` says that LensVisualizer was asked
 *   for "best-axial". It throws when LensVisualizer's result is then of another plane than the case's.
 * - `aperture`: `tracedFNumber`, the working f-number of the axial beam LensVisualizer traced, and
 *   `limitingSurfaceIndex`, the index of the surface that bounds that beam: the stop's when LensVisualizer says
 *   the iris does. Empty when LensVisualizer found no axial rim.
 * - `lines`: the lines of LensVisualizer's support record for the request.
 * - `notes`: `notes` as given, then what LensVisualizer says of each field (`fieldNotes`).
 */
function mtfData(
  state: LvPreparedState,
  options: LvMtfOptions,
  fractions: readonly number[],
  result: LvMtfResult,
  extra: { readonly params: JsonObject; readonly notes: readonly string[] },
  caseAtBestAxial: { readonly imageZ: number } | null = null,
): MtfNativeData {
  const frequencies = result.frequenciesPerMm.length;
  if (caseAtBestAxial !== null) {
    const applied = result.focus === null ? Number.NaN : state.imgZ + result.focus.appliedShiftMm;
    if (applied !== caseAtBestAxial.imageZ) {
      throw new Error(
        `LensVisualizer's result is of the plane z = ${applied} mm, and the image plane of the case, which is its ` +
          `best axial focus, lies at ${caseAtBestAxial.imageZ} mm`,
      );
    }
  }
  if (result.fields.length !== fractions.length) {
    throw new Error(`LensVisualizer answers ${fractions.length} fields with ${result.fields.length}`);
  }
  const notes = [...extra.notes, ...result.fields.flatMap(fieldNotes)];
  const aperture: { [name: string]: number } = {};
  if (result.aperture !== null) {
    aperture.tracedFNumber = result.aperture.tracedFNumber;
    const label = result.aperture.limitingSurfaceLabel;
    const labelled = state.surfaces.flatMap((surface, index) => (surface.label === label ? [index] : []));
    if (label === null) aperture.limitingSurfaceIndex = state.lens.stop.surfaceIndex;
    else if (labelled.length === 1) aperture.limitingSurfaceIndex = labelled[0];
    else notes.push(`the axial beam is limited by a surface labelled ${label}, which ${labelled.length} surfaces are`);
  }
  const geometry =
    result.geometry === null
      ? {}
      : { referenceHeightMm: result.geometry.referenceHeightMm, fieldBasis: result.geometry.basis };
  return {
    fields: result.fields.map((field, index) => fieldOf(field, fractions[index], frequencies)),
    method: {
      name: result.method,
      params: {
        spectrum: result.spectrum,
        focus: options.focus,
        maxGridSize: options.maxGridSize,
        pupilSemiDiameterMm: options.pupilSemiDiameterMm,
        stopSemiDiameterMm: options.stopSemiDiameterMm,
        ...geometry,
        ...extra.params,
      },
    },
    focus:
      result.focus === null || caseAtBestAxial !== null
        ? { mode: MTF_DESIGN_PLANE, appliedShiftMm: 0 }
        : { mode: result.focus.mode, appliedShiftMm: result.focus.appliedShiftMm },
    aperture,
    lines: result.support.spectralLines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
    notes,
  };
}

/**
 * The view of the tab that the stop radius of a case is the stop of, or why it is the stop of neither. A lens that
 * is f/8 wide open has one radius for both, its comparison being scaled by 8 / 8: it is the wide-open view.
 */
function tabViewOf(api: LvTabApi, model: LvCaseModel): LvTabRequest | { readonly neither: string } {
  const { runtime, state, exported } = model;
  const stop = exported.conditions.stopSemiDiameter;
  const wideOpen = lvTabRequest(api, runtime, state, "wide-open");
  if (stop === wideOpen.options.stopSemiDiameterMm) return wideOpen;
  const comparison = lvTabRequest(api, runtime, state, "f8-comparison");
  if (stop === comparison.options.stopSemiDiameterMm) return comparison;
  return {
    neither:
      `the stop radius of the case, ${stop} mm, is neither the one LensVisualizer's MTF tab traces wide open, ` +
      `${wideOpen.options.stopSemiDiameterMm} mm, nor that of its f/8 comparison, ` +
      `${comparison.options.stopSemiDiameterMm} mm`,
  };
}

/** The request LensVisualizer's MTF is asked for a case and a spec. */
export interface LvMtfRequest {
  /** The options `computeMtf` is called with. */
  readonly options: LvMtfOptions;
  /** What the answer states beside LensVisualizer's result: of a profile, which request of the tab it was. */
  readonly extra: { readonly params: JsonObject; readonly notes: readonly string[] };
  /**
   * True when the image plane of the case is LensVisualizer's own best axial focus for the request: the request
   * then asks for the focus "best-axial", and the plane LensVisualizer applies is the plane of the case.
   */
  readonly atBestAxial: boolean;
}

/**
 * The request LensVisualizer's MTF is asked for a spec about the state of a case's model, or the answer that says
 * why there is none.
 *
 * **What LensVisualizer does not compute** is answered "unsupported", in this order:
 *
 * 1. a state its support gate refuses on the reference line, the least it can refuse: the gate's reason is the item
 *    and its message the message, word for word (a fisheye projection, an annular aperture, an unverified scale);
 * 2. a case whose lines are none of LensVisualizer's spectra (`lvSpectrumOf`);
 * 3. fields as angles, a profile other than `LV_TAB_PROFILE`, and a grid cap that is none of `LV_GRID_CAPS`;
 * 4. without a profile, more fields or frequencies, or a higher frequency, than LensVisualizer takes in one request
 *    (`specRefusal`): the limits are LensVisualizer's, and its gate is asked;
 * 5. a case whose image plane is not its design plane, unless that plane is LensVisualizer's own best axial focus
 *    for the request and the spec asks for the plane of the case (below).
 *
 * **Without a profile** the request is the spec's: its method, its frequencies and its fractions; the spectrum of
 * the case's lines; the focus "design", or LensVisualizer's "best-axial" for "engine-best"; the stop radius of the
 * case; as the seed of the footprint scan the pupil radius the tab's hook would hand over for that stop radius
 * (`lvPupilSeed`), never the nominal pupil LensVisualizer's audit scripts pass; and the grid cap of the engine
 * option `lvGridCap`, 128 without one.
 *
 * **A case at LensVisualizer's best axial focus.** LensVisualizer's MTF is of its design plane or of its own best
 * axial focus, and of no plane it is given. So a case whose image plane is not the design plane is answered only
 * when that plane is the one LensVisualizer's focus search finds for this very request (`lvBestAxialFocus`, at the
 * stop radius, the lines and the grid cap of the request): to the bit, `state.imgZ` plus the shift, as
 * LensVisualizer adds them. The spec then asks for the focus "design", the plane of the case as it is, and
 * LensVisualizer is asked for "best-axial". Any other plane, and "engine-best" on such a case, is "unsupported"
 * (`image-plane.shifted`). A profile is of the design plane.
 *
 * **With the profile `lv-tab-default`** the request is the one LensVisualizer's MTF tab makes for the state
 * (`lvTabRequest`), built from LensVisualizer's default preferences as they are when the engine runs. The case says
 * which of the tab's two requests: its stop radius is the tab's wide-open one, or that of the tab's f/8
 * comparison, to the bit. A case with any other stop radius, a case whose lines are not the spectrum the tab
 * resolves for the lens, a spec that states a method, a focus, fields or frequencies other than the tab's, and a
 * grid cap other than the tab's are errors of code `bad-spec`: the profile cannot be about that case, or is not what
 * the spec says. A comparison the tab does not offer for the lens is "unsupported", with the tab's reason.
 *
 * Throws when LensVisualizer refuses the comparator's own general request as invalid.
 */
export function lvMtfRequest(
  api: LvMtfRequestApi,
  model: LvCaseModel,
  spec: MtfNativeSpec,
  engineOptions: JsonObject = {},
): LvMtfRequest | { readonly refused: LvMtfAnswer } {
  const { runtime, state, exported } = model;
  const { conditions, system } = exported;
  const stop = conditions.stopSemiDiameter;
  const general = lvGeneralMtfOptions(api, runtime, state, stop);
  const gate = api.assessMtfSupport(state, general);
  if (!gate.available) return { refused: gateRefusal(gate) };

  const shifted = conditions.imageZ !== system.designImageZ;
  const offDesign = (why: string): { readonly refused: LvMtfAnswer } => {
    const message =
      "LensVisualizer's MTF is of its design image plane or of its own best axial focus, and of no plane it is " +
      `given: the image plane of the case lies ${conditions.imageZ - system.designImageZ} mm from the design plane` +
      why;
    return { refused: unsupported("feature", LV_MTF_UNSUPPORTED.shiftedImagePlane, message) };
  };
  const spectrum = lvSpectrumOf(api, state, general, conditions.lines);
  if (spectrum === null) {
    if (shifted) return offDesign("");
    const message =
      `LensVisualizer's MTF has the spectra ${LV_MTF_SPECTRA.join(", ")} and no other: ` +
      `the lines of the case (${linesText(conditions.lines)}) are none of them`;
    return { refused: unsupported("feature", LV_MTF_UNSUPPORTED.customSpectrum, message) };
  }
  if (spec.fields.kind !== "image-height-fractions") {
    const message = "LensVisualizer's MTF takes its fields as fractions of its reference image height, not as angles";
    return { refused: unsupported("option", LV_MTF_UNSUPPORTED.fieldAngles, message) };
  }
  if (spec.profile !== undefined && spec.profile !== LV_TAB_PROFILE) {
    const message = `the engine has no profile "${spec.profile}": its one profile is ${LV_TAB_PROFILE}`;
    return { refused: unsupported("option", LV_MTF_UNSUPPORTED.profile, message) };
  }
  const cap = Object.hasOwn(engineOptions, LV_GRID_CAP_OPTION) ? engineOptions[LV_GRID_CAP_OPTION] : undefined;
  if (cap !== undefined && !LV_GRID_CAPS.includes(cap as number)) {
    const caps = LV_GRID_CAPS.join(", ");
    const message = `${LV_GRID_CAP_OPTION} is ${JSON.stringify(cap)}: LensVisualizer caps its grid at ${caps}`;
    return { refused: unsupported("option", LV_MTF_UNSUPPORTED.gridCap, message) };
  }

  if (spec.profile === undefined) {
    const refusal = specRefusal(api, state, general, spec);
    if (refusal !== null) return { refused: refusal };
    const maxGridSize = (cap as number | undefined) ?? LV_DEFAULT_GRID_CAP;
    if (shifted) {
      if (spec.focus !== "design") {
        return offDesign(", and the engine's own best focus is asked of a case at its design plane");
      }
      const best = lvBestAxialFocus(api, runtime, state, {
        stopSemiDiameterMm: stop,
        lines: conditions.lines,
        gridCap: maxGridSize,
      });
      if ("problem" in best || state.imgZ + best.shiftMm !== conditions.imageZ) {
        const found = "problem" in best ? "has none here" : `lies ${best.shiftMm} mm from it`;
        return offDesign(
          `, and LensVisualizer's best axial focus for this stop, these lines and this grid cap ${found}`,
        );
      }
    }
    const options: LvMtfOptions = {
      ...general,
      method: spec.method,
      spectrum,
      focus: shifted || spec.focus !== "design" ? "best-axial" : "design",
      maxGridSize,
      fieldFractions: [...spec.fields.values],
      frequenciesPerMm: [...spec.frequenciesPerMm],
    };
    return { options, extra: { params: {}, notes: [] }, atBestAxial: shifted };
  }

  if (shifted) return offDesign(`, and the profile ${LV_TAB_PROFILE} is of a case at its design plane`);
  const tab = tabViewOf(api, model);
  const profileRefused = (message: string): { readonly refused: LvMtfAnswer } => ({ refused: badSpec(message) });
  if ("neither" in tab) return profileRefused(`the profile ${LV_TAB_PROFILE} is not about this case: ${tab.neither}`);
  if (tab.unavailable !== null) {
    return { refused: unsupported("feature", LV_MTF_UNSUPPORTED.f8Comparison, tab.unavailable) };
  }
  if (tab.options.spectrum !== spectrum) {
    const message =
      `the profile ${LV_TAB_PROFILE} is not about this case: LensVisualizer's MTF tab asks for its ` +
      `${tab.options.spectrum} spectrum for this lens, and the lines of the case (${linesText(conditions.lines)}) ` +
      `are its ${spectrum} spectrum; export the case on the ${tab.options.spectrum} lines, as lvrtc mtf does`;
    return profileRefused(message);
  }
  const mismatch = profileMismatch(spec, lvTabSpec(tab));
  if (mismatch !== null) return profileRefused(`the spec names the profile ${LV_TAB_PROFILE} and its ${mismatch}`);
  if (cap !== undefined && cap !== tab.options.maxGridSize) {
    const message =
      `the profile ${LV_TAB_PROFILE} caps the grid at ${tab.options.maxGridSize}, ` +
      `and ${LV_GRID_CAP_OPTION} asks for ${JSON.stringify(cap)}`;
    return profileRefused(message);
  }
  return {
    options: tab.options,
    extra: {
      params: {
        profile: LV_TAB_PROFILE,
        view: tab.view,
        fNumber: tab.fNumber,
        displayedFrequenciesPerMm: [...tab.displayedFrequenciesPerMm],
      },
      notes: tab.spectrumNote === null ? [] : [tab.spectrumNote],
    },
    atBestAxial: false,
  };
}

/**
 * Answers an `mtf.native` spec about the state of a case's model with LensVisualizer's `computeMtf`, asked the
 * request `lvMtfRequest` builds; what that refuses is the answer.
 *
 * The answer is `mtfData` of LensVisualizer's result. Under the profile `method.params` also holds `profile`,
 * `view` ("wide-open" or "f8-comparison"), `fNumber`, the f-number the view is labelled with, and
 * `displayedFrequenciesPerMm`, the frequencies of the request that the tab draws; and the note of
 * `resolveMtfSpectrum`, when it has one, is the first of `notes`.
 *
 * Throws when LensVisualizer refuses the request as invalid or answers something that is not an answer to it:
 * then the engine no longer asks or reads it correctly.
 */
export function answerLvMtf(
  api: LvMtfApi,
  model: LvCaseModel,
  spec: MtfNativeSpec,
  engineOptions: JsonObject = {},
): LvMtfAnswer {
  const request = lvMtfRequest(api, model, spec, engineOptions);
  if ("refused" in request) return request.refused;
  const { state, exported } = model;
  const { options } = request;

  const result = api.computeMtf(state, options);
  if (!result.support.available) return gateRefusal(result.support);
  if (!sameList(result.frequenciesPerMm, spec.frequenciesPerMm)) {
    throw new Error(
      `LensVisualizer answers ${result.frequenciesPerMm.length} frequencies where ${spec.frequenciesPerMm.length} ` +
        "were asked for, or other ones",
    );
  }
  const plane = request.atBestAxial ? { imageZ: exported.conditions.imageZ } : null;
  const data = mtfData(state, options, spec.fields.values, result, request.extra, plane);
  return { data, counts: mtfCounts(data, spec) };
}

/** The counts of an `mtf.native` answer: its fields, its frequencies, and the fields that have no curve. */
export function mtfCounts(data: MtfNativeData, spec: MtfNativeSpec): { [name: string]: number } {
  const unavailable = data.fields.filter((field) => field.status === "unavailable").length;
  return { fields: data.fields.length, frequencies: spec.frequenciesPerMm.length, unavailableFields: unavailable };
}
