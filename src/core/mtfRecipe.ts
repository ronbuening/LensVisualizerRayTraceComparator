// The MTF recipe of a run: the one object that parameterises every MTF request about the run's case, whichever
// engine is asked. An MTF is of a plane, of fields, of lines and of frequencies, and for a LensVisualizer lens each
// of those is LensVisualizer's own to state: where its best focus lies, which chief-ray angle a fraction of its
// image height is, which lines and weights its spectrum has. The recipe states them once, as numbers, so that no
// engine resolves them again by a rule of its own. It comes from the source of the run's case
// (`CaseSource.recipe`) and is recorded with the run.
import type { OpticalCase } from "../contract/case.ts";
import type { RunFields, RunOptions } from "../contract/runSpec.ts";

/**
 * The plane the MTF of a case is of, which is the image plane of the case: the design plane; LensVisualizer's own
 * best axial focus for the stop and the lines of the case; or any other plane, a shift someone stated.
 */
export type MtfRecipePlaneKind = "design" | "lv-best-axial" | "shift";

/** One field of a recipe. */
export type MtfRecipeField = {
  /** The fraction of the reference image height the field was asked as; null for a field asked as an angle. */
  readonly fraction: number | null;
  /** The chief-ray field angle, degrees, positive for an object toward +y; null where the source found none. */
  readonly angleDeg: number | null;
  /** The image height the field is to land at, mm; null where no reference image height is known. */
  readonly targetImageHeightMm: number | null;
  /** Why the field has no angle, as `<code>: <message>`; left out for a field that has one. */
  readonly problem?: string;
};

/** The MTF recipe of one case. Every number is finite: it is recorded as JSON. */
export type MtfRecipe = {
  /** Who resolved it: LensVisualizer, for one of its lenses, or the run itself, for a case read from a file. */
  readonly source: "lv" | "run";
  readonly plane: {
    readonly kind: MtfRecipePlaneKind;
    /** How far the image plane of the case lies from its design plane along +z, mm: 0 for the design plane. */
    readonly shiftMm: number;
    /**
     * LensVisualizer's best axial focus shift for the stop and the lines of the case, mm, whatever plane the case
     * is at; null where its search found none. Left out by a source that is not LensVisualizer.
     */
    readonly lvBestAxialShiftMm?: number | null;
  };
  /** The image plane of the case: `conditions.imageZ`. */
  readonly imageZ: number;
  /** The stop radius of the case, mm: `conditions.stopSemiDiameter`. */
  readonly stopSemiDiameter: number;
  /** The lines of the case with their weights, the reference line first. */
  readonly lines: readonly { readonly wavelengthNm: number; readonly weight: number }[];
  /** The spatial frequencies, cycles/mm, ascending. */
  readonly frequenciesPerMm: readonly number[];
  /** The image height the fractions are of, mm; null where none is known. */
  readonly referenceHeightMm: number | null;
  /** The fields, in the order the run states them. */
  readonly fields: readonly MtfRecipeField[];
  /** The largest pupil grid LensVisualizer's own sampling may refine to; left out where the run states none. */
  readonly lvGridCap?: number;
};

/** What a case source makes of a run's recipe: the recipe, or every reason why the run has none. */
export interface MtfRecipeResolution {
  readonly recipe: MtfRecipe | null;
  /** Each as `<code>: <message>`; deterministic text without absolute paths, since it is recorded with the run. */
  readonly problems: readonly string[];
}

/** The frequencies of a recipe whose run states none, for a case read from a file, cycles/mm. */
export const DEFAULT_RECIPE_FREQUENCIES: readonly number[] = Object.freeze([10, 30, 50]);

/** A coded problem of a recipe as one line: `<code>: <message>`. */
export function recipeProblem(code: string, message: string): string {
  return `${code}: ${message}`;
}

/** The frequencies of a run in ascending order, or `fallback` for a run that states none. */
export function recipeFrequencies(run: Pick<RunOptions, "frequenciesPerMm">, fallback: readonly number[]): number[] {
  return [...(run.frequenciesPerMm ?? fallback)].sort((a, b) => a - b);
}

/** What a recipe states of a case whatever its source: the plane's position, the stop radius and the lines. */
export function recipeOfCase(opticalCase: OpticalCase): Pick<MtfRecipe, "imageZ" | "stopSemiDiameter" | "lines"> {
  const { imageZ, stopSemiDiameter, lines } = opticalCase.conditions;
  return {
    imageZ,
    stopSemiDiameter,
    lines: lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
  };
}

/**
 * The recipe of a run whose case was read from a file: there is no LensVisualizer to resolve anything, so the run
 * states it, or has none.
 *
 * - **Fields** are the run's `fields` as angles in degrees (`{ kind: "angles-deg", values }`), taken as given, with
 *   no fraction and no image height. A run that states no fields, or states fractions of an image height, has no
 *   recipe (`recipe-needs-field-angles`): nothing says which angle a fraction of a case's image height is.
 * - **The plane** is the image plane of the case as the file has it: `design` when it is the case's design plane,
 *   else a `shift` of the difference. The run's `imagePlane` does not move a case that is a file.
 * - **Frequencies** are the run's, ascending, or `DEFAULT_RECIPE_FREQUENCIES`.
 * - **The stop radius and the lines** are the case's.
 */
export function fixtureRecipe(
  run: Pick<RunOptions, "fields" | "frequenciesPerMm">,
  opticalCase: OpticalCase,
): MtfRecipeResolution {
  const fields: RunFields | undefined = run.fields;
  if (fields?.kind !== "angles-deg") {
    const message =
      "a case read from a file has no image height that a fraction could be of: " +
      'state the fields of the run as angles, { "kind": "angles-deg", "values": [...] }';
    return { recipe: null, problems: [recipeProblem("recipe-needs-field-angles", message)] };
  }
  const { designImageZ } = opticalCase.system;
  const { imageZ } = opticalCase.conditions;
  return {
    recipe: {
      source: "run",
      plane: { kind: imageZ === designImageZ ? "design" : "shift", shiftMm: imageZ - designImageZ },
      ...recipeOfCase(opticalCase),
      frequenciesPerMm: recipeFrequencies(run, DEFAULT_RECIPE_FREQUENCIES),
      referenceHeightMm: null,
      fields: fields.values.map((angleDeg) => ({ fraction: null, angleDeg, targetImageHeightMm: null })),
    },
    problems: [],
  };
}
