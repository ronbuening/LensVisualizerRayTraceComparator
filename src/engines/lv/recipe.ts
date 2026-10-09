// The MTF recipe of a case that came from a LensVisualizer lens (`src/core/mtfRecipe.ts`): the plane, the fields
// and the frequencies as LensVisualizer itself resolves them for the stop radius and the lines of the case. Every
// number is asked of LensVisualizer: the first step of its own `computeMtfSteps` states the field axis, the angle
// of each fraction of the reference image height and its best axial focus, before any field is traced.
import type { RunOptions } from "../../contract/runSpec.ts";
import { recipeFrequencies, recipeOfCase, recipeProblem } from "../../core/mtfRecipe.ts";
import type { MtfRecipe, MtfRecipeField, MtfRecipeResolution } from "../../core/mtfRecipe.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { LV_MTF_SPECTRA, lvGeneralMtfOptions, lvSpectrumOf } from "./focus.ts";
import type { LvFocusApi } from "./focus.ts";
import type { LvApi, LvMtfFieldResult } from "./types.ts";

/** The LensVisualizer exports a recipe is asked with. */
export type LvRecipeApi = LvFocusApi & Pick<LvApi, "mtfDefaultFrequencies" | "mtfDefaultFields">;

/** A number a recipe can state, or null: a recipe is recorded as JSON, which has no NaN. */
function finite(value: number | null): number | null {
  return value !== null && Number.isFinite(value) ? value : null;
}

/** A field of LensVisualizer's first step as a field of a recipe. */
function fieldOf(field: LvMtfFieldResult): MtfRecipeField {
  const stated = {
    fraction: field.fieldFraction,
    angleDeg: finite(field.fieldAngleDeg),
    targetImageHeightMm: finite(field.targetImageHeightMm),
  };
  if (field.status === "unavailable") {
    return { ...stated, angleDeg: null, problem: recipeProblem(field.reason ?? "unavailable", field.message) };
  }
  if (stated.angleDeg !== null) return stated;
  const message = `LensVisualizer finds no chief-ray angle for the image height ${field.targetImageHeightMm} mm`;
  return { ...stated, problem: recipeProblem("chief-ray-failed", message) };
}

/**
 * The MTF recipe of a case's model, under the fields, the frequencies and the grid cap of a run.
 *
 * LensVisualizer is asked once: `computeMtfSteps` with the comparator's general request for the stop radius of the
 * case (`lvGeneralMtfOptions`), on the spectrum the lines of the case are (`lvSpectrumOf`), with the focus
 * "best-axial", the fractions of the run and its grid cap. Its first step gives:
 *
 * - **the fields**: for each fraction of the run (LensVisualizer's own `MTF_FIELDS` for a run that states none),
 *   the image height it is to land at and the chief-ray angle LensVisualizer solves for it. A fraction beyond the
 *   modeled edge, and one without an angle, is a field with a `problem` under LensVisualizer's own code
 *   (`outside-modeled-field`, `chief-ray-failed`), and no other field is affected;
 * - **the reference image height** the fractions are of;
 * - **the plane**: `design` when the image plane of the case is its design plane; `lv-best-axial` when it is, to
 *   the bit, the state's image plane plus the shift LensVisualizer's focus search found for this request; `shift`
 *   for any other. LensVisualizer's best axial shift is stated whichever it is.
 *
 * The frequencies are the run's, ascending, or LensVisualizer's own `MTF_FREQUENCIES`. The stop radius and the
 * lines are the case's.
 *
 * A run has no recipe, and a coded problem instead: where LensVisualizer's gate refuses the state (its reason);
 * where the lines of the case are none of its spectra (`lines.custom-spectrum`); where the run states its fields
 * as angles (`fields.angles-deg`), since LensVisualizer's MTF takes fractions of its reference image height.
 */
export function lvMtfRecipe(
  api: LvRecipeApi,
  model: LvCaseModel,
  run: Pick<RunOptions, "fields" | "frequenciesPerMm" | "sampling">,
): MtfRecipeResolution {
  const { runtime, state, exported } = model;
  const { conditions, system } = exported;
  const none = (code: string, message: string): MtfRecipeResolution => ({
    recipe: null,
    problems: [recipeProblem(code, message)],
  });
  const general = lvGeneralMtfOptions(api, runtime, state, conditions.stopSemiDiameter);
  const gate = api.assessMtfSupport(state, general);
  if (!gate.available) {
    return none(gate.reason ?? "mtf-unavailable", `LensVisualizer's MTF does not cover this state: ${gate.message}`);
  }
  const spectrum = lvSpectrumOf(api, state, general, conditions.lines);
  if (spectrum === null) {
    const wavelengths = conditions.lines.map((line) => line.wavelengthNm).join(", ");
    const message =
      `LensVisualizer's MTF has the spectra ${LV_MTF_SPECTRA.join(", ")} and no other: ` +
      `the lines of the case (${wavelengths} nm) are none of them`;
    return none("lines.custom-spectrum", message);
  }
  if (run.fields !== undefined && run.fields.kind !== "image-height-fractions") {
    const message = "LensVisualizer's MTF takes its fields as fractions of its reference image height, not as angles";
    return none("fields.angles-deg", message);
  }
  const fractions = [...(run.fields?.values ?? api.mtfDefaultFields)];
  const frequenciesPerMm = recipeFrequencies(run, api.mtfDefaultFrequencies);
  const lvGridCap = run.sampling?.lvGridCap;
  const first = api
    .computeMtfSteps(state, {
      ...general,
      spectrum,
      focus: "best-axial",
      fieldFractions: fractions,
      frequenciesPerMm,
      ...(lvGridCap === undefined ? {} : { maxGridSize: lvGridCap }),
    })
    .next().value;
  if (!first.support.available) {
    const reason = first.support.reason ?? "mtf-unavailable";
    return none(reason, `LensVisualizer's MTF refuses the request of this run: ${first.support.message}`);
  }
  const found = first.focus !== null && first.focus.mode === "best-axial" ? first.focus.appliedShiftMm : null;
  const lvBestAxialShiftMm = found !== null && Number.isFinite(found) ? found : null;
  const shiftMm = conditions.imageZ - system.designImageZ;
  const atBestAxial = lvBestAxialShiftMm !== null && state.imgZ + lvBestAxialShiftMm === conditions.imageZ;
  const kind = conditions.imageZ === system.designImageZ ? "design" : atBestAxial ? "lv-best-axial" : "shift";
  const recipe: MtfRecipe = {
    source: "lv",
    plane: { kind, shiftMm, lvBestAxialShiftMm },
    ...recipeOfCase(exported),
    frequenciesPerMm,
    referenceHeightMm: finite(first.geometry?.referenceHeightMm ?? null),
    fields: first.fields.map(fieldOf),
    ...(lvGridCap === undefined ? {} : { lvGridCap }),
  };
  return { recipe, problems: [] };
}
