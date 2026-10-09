// The case exporter: one LensVisualizer lens in one state, as the optical case every engine is asked about.
//
// Everything is read from LV's PREPARED state and from the functions its own tracers use, never from authored
// surface fields: an error of translation here would later look like a disagreement between engines. What the
// contract cannot express is reported with a code, never approximated. See contract/CONTRACT.md, "Cases from
// LensVisualizer", for the mapping with its sources in LV.
import packageJson from "../../../package.json" with { type: "json" };
import { finalizeCase } from "../../contract/case.ts";
import type { OpticalCase, OpticalCaseDraft, SurfaceIR } from "../../contract/case.ts";
import type { LvProvenance } from "../../contract/provenance.ts";
import type { RunImagePlane, RunOptions, RunSampling } from "../../contract/runSpec.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { syntheticKind } from "./binding.ts";
import { stopRadius, surfaceAperture, wideOpenStopRadius } from "./exportAperture.ts";
import type { LvStopApi } from "./exportAperture.ts";
import { exportLight } from "./exportLines.ts";
import type { LvLightApi } from "./exportLines.ts";
import type { ExportProblem } from "./exportProblems.ts";
import { surfaceShape } from "./exportShape.ts";
import { lvBestAxialFocus } from "./focus.ts";
import type { LvFocusApi } from "./focus.ts";
import type { LvApi, LvPreparedState, LvRuntimeLens } from "./types.ts";

/** The LensVisualizer exports the exporter uses. A test hands it stand-ins; the binding hands it LV's own. */
export type LvExportApi = Pick<LvApi, "prepareRuntimeState" | "evaluateAperture"> & LvStopApi & LvLightApi & LvFocusApi;

/** The lens file a case is exported from, as the catalog knows it. */
export interface ExportedLens {
  readonly key: string;
  readonly name: string;
  /** The lens file, POSIX and relative to the LensVisualizer checkout. */
  readonly file: string;
  readonly fileSha256: string;
}

/**
 * What a case is exported under: the options of a run that concern the case, any of which may be left out and
 * takes its default. The image plane may also be stated as a position, `{ kind: "at", z }`, which is how a case
 * states it: a shift from the design plane does not always add up to the same double again. Of `sampling` only
 * the grid cap is read, and only for the image plane "lv-best-axial", whose focus search is of one cap.
 */
export interface ExportOptions extends Pick<RunOptions, "state" | "aperture" | "lines"> {
  readonly imagePlane?: RunImagePlane | { readonly kind: "at"; readonly z: number };
  readonly sampling?: Pick<RunSampling, "lvGridCap">;
}

/** What `exportCase` is given. */
export interface ExportCaseInput {
  readonly api: LvExportApi;
  readonly lens: ExportedLens;
  /** The lens as `buildLens` built it. */
  readonly runtime: LvRuntimeLens;
  readonly options: ExportOptions;
  /** The LensVisualizer checkout the lens was built by, for the case's provenance. */
  readonly lv: LvProvenance;
}

/** The case of a lens in a state, or every reason why it has none. */
export type ExportCaseResult =
  | { readonly ok: true; readonly opticalCase: OpticalCase }
  | { readonly ok: false; readonly problems: readonly ExportProblem[] };

/** The tolerance of LensVisualizer's own test for an image plane perpendicular to the axis (`assessMtfSupport`). */
const IMAGE_NORMAL_TOLERANCE = 1e-10;

/** The codes that say the contract cannot express the lens; with one of them, LV's gate is not asked about lines. */
const STRUCTURAL: ReadonlySet<string> = new Set([
  "folded-path",
  "non-refract-interaction",
  "diffractive-surface",
  "tilted-image-plane",
  "off-axis-image-plane",
  "synthetic-surface-unknown",
  "surface-profile-unsupported",
  "asphere-coefficient-unknown",
]);

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** What the state has that no optical case can say, whatever is asked of it. */
function structuralProblems(state: LvPreparedState): ExportProblem[] {
  const problems: ExportProblem[] = [];
  const labels = (pick: (surface: LvPreparedState["surfaces"][number]) => boolean): string =>
    state.surfaces
      .filter(pick)
      .map((surface) => surface.label)
      .join(", ");

  if (state.lens.flags.isFoldedOptics === true) {
    problems.push({ code: "folded-path", message: "the optical path is folded; a case is one pass along +z" });
  }
  const notRefracting = labels((surface) => surface.interaction.type !== "refract");
  if (notRefracting !== "") {
    const message = `surfaces that reflect or block instead of refracting: ${notRefracting}`;
    problems.push({ code: "non-refract-interaction", message });
  }
  const diffractive = labels((surface) => surface.diffractive !== null && surface.diffractive !== undefined);
  if (diffractive !== "") {
    problems.push({ code: "diffractive-surface", message: `surfaces with a diffractive phase: ${diffractive}` });
  }
  const [normalX, normalY, normalZ] = state.imagePlane.normal;
  if (Math.abs(normalX) > IMAGE_NORMAL_TOLERANCE || Math.abs(normalY) > IMAGE_NORMAL_TOLERANCE || !(normalZ > 0)) {
    problems.push({ code: "tilted-image-plane", message: "the image plane is not perpendicular to the optical axis" });
  }
  if (state.imagePlane.point[0] !== 0 || state.imagePlane.point[1] !== 0) {
    problems.push({ code: "off-axis-image-plane", message: "the image plane is not centred on the optical axis" });
  }
  const otherSynthetic = state.surfaces.filter((surface) => ![null, "rearPlate"].includes(syntheticKind(surface)));
  if (otherSynthetic.length > 0) {
    const named = otherSynthetic.map((surface) => `${surface.label} (${syntheticKind(surface)})`).join(", ");
    problems.push({ code: "synthetic-surface-unknown", message: `generated surfaces of an unknown kind: ${named}` });
  }
  return problems;
}

/**
 * The image plane of a case: the design plane, the design plane moved by a shift, or the position asked for.
 * `bestAxialShiftMm` is the shift of the plane "lv-best-axial", which is added as LensVisualizer adds it
 * (`context.imagePlaneZ = state.imgZ + result.focus.appliedShiftMm` in its `computeMtfSteps`).
 */
function imageZOf(
  imagePlane: NonNullable<ExportOptions["imagePlane"]>,
  designImageZ: number,
  bestAxialShiftMm: number,
): number {
  if (imagePlane.kind === "at") return imagePlane.z;
  if (imagePlane.kind === "lv-best-axial") return designImageZ + bestAxialShiftMm;
  return imagePlane.kind === "shift" ? designImageZ + imagePlane.mm : designImageZ;
}

/** What the lens has that changes no surface, and that the case therefore does not carry: provenance notes. */
function notesOf(state: LvPreparedState): string[] {
  const notes: string[] = [];
  const absorbing = state.lens.runtime.elements.some((element) => (element.absorptionCoefficientPerMm ?? 0) > 0);
  if (absorbing) notes.push("bulk-absorption");
  if (state.lens.projection.kind !== "rectilinear") notes.push(`projection:${state.lens.projection.kind}`);
  return notes.sort();
}

/**
 * Exports one lens in the state a run asks for.
 *
 * The state is `prepareRuntimeState(L, focusT, zoomT)`: `zoomT` of the run (0 when it states none, and 0 for a
 * prime, which has no zoom position, whatever the run states), and `focusT` 0 for infinity focus, or the run's
 * value. From it:
 *
 * - **surfaces**: `label`; `z` = `state.z[i]`; `thickness` = the resolved gap `d` after the surface, and after the
 *   last surface the distance to the image plane (LV's `d` where `z + d` is `imgZ`, as in every lens that is not
 *   folded, else `imgZ - z`); `shape` (`surfaceShape`); `aperture` (`surfaceAperture`); `elementId` = `elemId`;
 *   `synthetic` for a rear plate, which is a real pair of flat surfaces of the state.
 * - **stopIndex** = `state.lens.stop.surfaceIndex`; **lastLensSurfaceIndex** = `L.lastLensSurfaceIdx`;
 *   **designImageZ** = `state.imgZ`.
 * - **conditions.stopSemiDiameter** from the run's aperture (`stopRadius`); the stop surface's aperture carries the
 *   same radius, so every surface clips by its own aperture. **imageZ** = `designImageZ`, plus the run's shift, or
 *   the position that is asked for; for the image plane "lv-best-axial", `designImageZ` plus LensVisualizer's own
 *   best axial focus shift for the stop radius and the lines of the case (`lvBestAxialFocus`): the plane its MTF
 *   evaluates every field on when it is asked for its best focus, at the grid cap of `sampling.lvGridCap`, or at
 *   its own default without one.
 * - **lines, indexAfterSurface, object** from LV's MTF support gate and index resolver (`exportLight`).
 * - **provenance**: the lens file with its hash and the zoom and focus position of the state, the LV checkout, and
 *   the notes "bulk-absorption" and "projection:<kind>" for what changes no surface.
 *
 * A lens that cannot be exported as asked is a result with every problem found, each with a code: what the contract
 * cannot express (`structuralProblems`, a surface's shape), what LV does not supply (`exportLight`), an f-number
 * faster than wide open, the f/8 comparison of the MTF tab for a lens the tab offers none for, and the image plane
 * "lv-best-axial" where LV's focus search has no answer: for lines that are none of its spectra, or a state its
 * MTF does not cover.
 *
 * Throws, naming the lens, for what would be a defect of the exporter or a change in LV that it does not yet read
 * correctly: a draft that is not a valid case, LV's wide-open stop radius differing from the prepared stop
 * surface's, a clear aperture LV does not trace as its state says.
 */
export function exportCase(input: ExportCaseInput): ExportCaseResult {
  const { api, lens, runtime, options } = input;
  try {
    return exportChecked(api, lens, runtime, options, input.lv);
  } catch (error) {
    throw new Error(`lens ${lens.key}: ${reasonOf(error)}`, { cause: error });
  }
}

function exportChecked(
  api: LvExportApi,
  lens: ExportedLens,
  runtime: LvRuntimeLens,
  options: ExportCaseInput["options"],
  lv: LvProvenance,
): ExportCaseResult {
  // A prime has no zoom position: whatever is asked of it, its state and its provenance say 0.
  const zoomT = runtime.isZoom ? (options.state?.zoomT ?? 0) : 0;
  const focus = options.state?.focus;
  const focusT = focus?.kind === "focusT" ? focus.value : 0;

  let state: LvPreparedState;
  try {
    state = api.prepareRuntimeState(runtime, focusT, zoomT);
  } catch (error) {
    const message = `LensVisualizer cannot prepare focus ${focusT}, zoom ${zoomT}: ${reasonOf(error)}`;
    return { ok: false, problems: [{ code: "state-prepare-failed", message }] };
  }

  const problems = structuralProblems(state);
  const shapes = state.surfaces.map(surfaceShape);
  for (const shape of shapes) if (!shape.ok) problems.push(...shape.problems);

  const wideOpen = wideOpenStopRadius(api, runtime, state.zoomT);
  const stop = stopRadius(api, runtime, state.zoomT, options.aperture);
  if (!stop.ok) problems.push(stop.problem);

  const imagePlane = options.imagePlane ?? { kind: "design" };

  // LensVisualizer's own gate rejects what the structural problems name, with less to say about it.
  const light = problems.some((problem) => STRUCTURAL.has(problem.code))
    ? null
    : exportLight(api, state, options.lines, wideOpen);
  if (light !== null && !light.ok) problems.push(...light.problems);
  if (problems.length > 0 || light === null || !light.ok || !stop.ok) return { ok: false, problems };

  // Only now: LensVisualizer's focus search is of a stop radius and of lines, which the case has by here.
  let bestAxialShiftMm = 0;
  if (imagePlane.kind === "lv-best-axial") {
    const focus = lvBestAxialFocus(api, runtime, state, {
      stopSemiDiameterMm: stop.radius,
      lines: light.light.lines,
      gridCap: options.sampling?.lvGridCap,
    });
    if ("problem" in focus) return { ok: false, problems: [focus.problem] };
    bestAxialShiftMm = focus.shiftMm;
  }

  const stopIndex = state.lens.stop.surfaceIndex;
  const preparedStop = state.surfaces[stopIndex]?.sd;
  if (preparedStop !== wideOpen) {
    throw new Error(
      `LensVisualizer's wide-open stop radius ${wideOpen} is not the prepared stop surface's ${preparedStop}`,
    );
  }

  const last = state.surfaces.length - 1;
  // LV's own last gap wherever it reaches the image plane, so that no bit of it is recomputed.
  const toImage = (z: number, gap: number): number => (z + gap === state.imgZ ? gap : state.imgZ - z);
  const surfaces = state.surfaces.map((surface, index): SurfaceIR => {
    const shape = shapes[index];
    // Unreachable: a surface without a shape has a problem, and a state with problems has returned.
    if (!shape.ok) throw new Error(`surface ${surface.label} has no shape`);
    const z = state.z[index];
    return {
      label: surface.label,
      z,
      thickness: index === last ? toImage(z, surface.d) : surface.d,
      shape: shape.shape,
      aperture: surfaceAperture(api, state, surface, index === stopIndex ? stop.radius : undefined),
      elementId: surface.elemId,
      ...(syntheticKind(surface) === "rearPlate" ? { synthetic: "rearPlate" as const } : {}),
    };
  });

  const { object, lines, indexAfterSurface } = light.light;
  const notes = notesOf(state);
  const draft: OpticalCaseDraft = {
    label: {
      name: lens.name,
      lensKey: lens.key,
      ...(runtime.isZoom ? { zoomT: state.zoomT } : {}),
      focusT: state.focusT,
    },
    system: {
      surfaces,
      stopIndex,
      lastLensSurfaceIndex: runtime.lastLensSurfaceIdx,
      designImageZ: state.imgZ,
    },
    conditions: {
      object,
      stopSemiDiameter: stop.radius,
      imageZ: imageZOf(imagePlane, state.imgZ, bestAxialShiftMm),
      lines,
      indexAfterSurface: encodeNdArray(indexAfterSurface, [lines.length, surfaces.length]),
    },
    provenance: {
      source: {
        kind: "lv-lens",
        lensKey: lens.key,
        file: lens.file,
        fileSha256: lens.fileSha256,
        zoomT: state.zoomT,
        focusT: state.focusT,
      },
      lv,
      ...(notes.length > 0 ? { notes } : {}),
      producer: { tool: "lvrtc", version: packageJson.version },
    },
  };
  return { ok: true, opticalCase: finalizeCase(draft) };
}
