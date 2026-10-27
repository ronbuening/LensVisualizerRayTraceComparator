// Vignetting sets from LensVisualizer: the rays its vignetting tab launches, every field of them, and LensVisualizer's
// own lattice over the whole beam of each of the same fields, as `rays.trace` specs. "Identical rays" for the rung
// R11a are these: the tab's own sweeps and LensVisualizer's own launch lattices, traced as given by every engine.
//
// Which fields the tab samples, how many rays it sweeps across a pupil and where the sweep's fractions lie are
// LensVisualizer's own exports or restated from `computeVignettingCurve` (vignettingFields.ts), each restated line with
// a source canary (test/integration/lv/canaries.test.ts). The lattice of a field is the one LensVisualizer's MTF lays
// over the beam it finds (`lvFieldRaySets`, the generator of the run's own ray sets), so that a field's whole beam is
// sampled in two dimensions, wherever the stop's image lies: what the tab's one meridional line across a fixed pupil
// does not see. An integration test holds the sweeps to LensVisualizer's own: traced by LensVisualizer they give the
// tab's curve to the bit (test/integration/lv/vignettingRays.test.ts).
import type { VignettingNativeSpec } from "../../contract/quantities/vignettingNative.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import type { RunSampling } from "../../contract/runSpec.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { launchBehindProblem, startsInFront } from "../../rays/probe.ts";
import { DEFAULT_BUNDLE_GRID, rayProblem } from "../../rays/raySets.ts";
import type { VignettingSetResolution } from "../../rays/vignettingSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefGeometry } from "./chiefSetup.ts";
import type { LvChiefSetupApi } from "./chiefSetup.ts";
import { lvFieldRaySets, lvLaunchSetup, lvRayWeights } from "./raySets.ts";
import type { LvRaySetApi } from "./raySets.ts";
import { lvTabPupilSemiDiameter } from "./spotSetup.ts";
import type { LvApi } from "./types.ts";
import {
  isVignettingFieldRefusal,
  lvSweepLaunch,
  lvVignettingFields,
  lvVignettingLines,
  lvVignettingPupilFractions,
} from "./vignettingFields.ts";
import type { LvVignettingFieldsApi, LvVignettingLaunch } from "./vignettingFields.ts";

/** The LensVisualizer exports the vignetting sets are made with. */
export type LvVignettingApi = LvChiefSetupApi &
  LvVignettingFieldsApi &
  LvRaySetApi &
  Pick<LvApi, "directionFromMeridionalSlope">;

/** The two patterns of rays, in the order a run's sets are made. */
export const VIGNETTING_PATTERNS = ["sweep", "lattice"] as const;
/** One pattern of the vignetting rays. */
export type VignettingPattern = (typeof VIGNETTING_PATTERNS)[number];

/** The rays of one field's sweep: x, y, z of each origin and each direction, the tab's order. */
interface SweepField {
  readonly fieldAngleDeg: number;
  readonly origins: Float64Array;
  readonly directions: Float64Array;
}

/** What a case keeps the tab from launching vignetting sets for, or null. */
function caseProblem(model: LvCaseModel): string | null {
  const { exported } = model;
  if (exported.system.opticalPath !== undefined) {
    return rayProblem(
      "folded-path",
      "LensVisualizer's vignetting of a folded path is its generalized trace, which a rays.trace v1 request does not state",
    );
  }
  if (exported.conditions.object.kind !== "infinity") {
    return rayProblem(
      "object-not-at-infinity",
      "LensVisualizer's vignetting tab launches collimated rays at every focus; it is compared at infinity focus",
    );
  }
  return null;
}

/** The sweep of one field: a ray for each of the tab's pupil fractions, in the tab's order. */
function sweepOf(
  api: LvVignettingApi,
  model: LvCaseModel,
  fieldAngleDeg: number,
  launch: LvVignettingLaunch,
  fractions: readonly number[],
  entrancePupilSemiDiameter: number,
): SweepField {
  const origins = new Float64Array(3 * fractions.length);
  const directions = new Float64Array(3 * fractions.length);
  fractions.forEach((fraction, ray) => {
    const made = lvSweepLaunch(api, model, launch, fraction, entrancePupilSemiDiameter);
    origins.set(made.origin, 3 * ray);
    directions.set(made.direction, 3 * ray);
  });
  return { fieldAngleDeg, origins, directions };
}

/**
 * The sweep sets of the case: every field's sweep in the tab's order, one block a field, as one set at each line of the
 * case. A ray weighs its launch weight of 1 times LensVisualizer's bulk transmission along it at the line
 * (`lvRayWeights`), as the tab's `trace.transmission` weighs it.
 */
function sweepSets(api: LvVignettingApi, model: LvCaseModel, fields: readonly SweepField[]): RaysTraceSpec[] {
  const rays = fields.reduce((sum, field) => sum + field.origins.length / 3, 0);
  const origins = new Float64Array(3 * rays);
  const directions = new Float64Array(3 * rays);
  let at = 0;
  for (const field of fields) {
    origins.set(field.origins, at);
    directions.set(field.directions, at);
    at += field.origins.length;
  }
  const encoded = {
    origins: encodeNdArray(origins, [rays, 3]),
    directions: encodeNdArray(directions, [rays, 3]),
  };
  const launchWeights = new Float64Array(rays).fill(1);
  return model.exported.conditions.lines.map((_line, line) => {
    const weights = lvRayWeights(api, model, { origins, directions, launchWeights, chiefIndex: -1 }, line);
    return { line, ...encoded, weights: encodeNdArray(weights, [rays]) };
  });
}

/**
 * The vignetting sets of a case that came from a LensVisualizer lens: for each pattern (`VIGNETTING_PATTERNS`), in
 * that order, the rays of every field of the tab (`lvVignettingFields`, the fields `lv`'s answer is of too), the same
 * rays at every line of the case, in the order of the lines.
 *
 * 1. `sweep`: of each field, the tab's own meridional sweep across the pupil (`lvSweepLaunch` at each of
 *    `lvVignettingPupilFractions`), one block of rays a field, the axis first, every field in one set at each line;
 *    what the tab's geometric transmission and relative illumination are counted from.
 * 2. `lattice`: of each field, LensVisualizer's own launch lattice over the whole beam it finds for the field
 *    (`lvFieldRaySets`, at the run's `sampling.bundleGrid` cells across, `DEFAULT_BUNDLE_GRID` without it), one set a
 *    field and line, each stating its field, its lattice and its chief ray; what the comparator's flux in two
 *    dimensions is of.
 *
 * Beside the sets, the `vignetting.native` request of the tab: at the lines it traces (`lvVignettingLines`: the
 * authored reference line), at the angles of the fields with a sweep, the axis first; none for a run of no such line.
 *
 * A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`), a state without a
 * half field (`no-half-field`) or without a pupil (`no-pupil`), and one whose axis has no sweep (`no-axis-sweep`: the
 * tab's every figure is relative to the axis) have no sets and no request, one problem each. A field LensVisualizer
 * launches from a bounding sphere (`lv-vector-launch`), one without a slope (`lv-no-launch`) and one whose rays would
 * not start in front of the first surface (`launch-behind-first-surface`) is a coded problem, and the others are not
 * affected. A state LensVisualizer's MTF launch does not cover has no lattice sets, with the gate's reason as the
 * problem's code, and keeps its sweeps; so does a field the launch finds no chief ray or no beam for.
 */
export function lvVignettingRaySets(
  api: LvVignettingApi,
  model: LvCaseModel,
  options: { readonly sampling?: Pick<RunSampling, "bundleGrid"> } = {},
): VignettingSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const problem = rayProblem("no-half-field", "LensVisualizer's field geometry of the state has no half field");
    return { sets: [], problems: [problem], asks: [] };
  }
  const entrancePupilSemiDiameter = lvTabPupilSemiDiameter(api, model);
  if (!(entrancePupilSemiDiameter > 0)) {
    const problem = rayProblem("no-pupil", `the tabs' pupil radius is ${entrancePupilSemiDiameter} mm`);
    return { sets: [], problems: [problem], asks: [] };
  }
  const fractions = lvVignettingPupilFractions(api, model.runtime);
  const problems: string[] = [];
  const sweeps: SweepField[] = [];
  for (const { index, fieldAngleDeg, made } of lvVignettingFields(api, model, geometry)) {
    const field = isVignettingFieldRefusal(made)
      ? rayProblem(made.code, made.message)
      : sweepOf(api, model, fieldAngleDeg, made, fractions, entrancePupilSemiDiameter);
    const behind =
      typeof field !== "string" && !startsInFront(model.exported.system.surfaces[0], field.origins)
        ? launchBehindProblem(fieldAngleDeg)
        : null;
    if (typeof field === "string" || behind !== null) {
      problems.push(typeof field === "string" ? field : behind!);
      if (index === 0) {
        const message = "the vignetting tab's every figure is relative to the axis, and the axis has no sweep";
        return { sets: [], problems: [...problems, rayProblem("no-axis-sweep", message)], asks: [] };
      }
      continue;
    }
    sweeps.push(field);
  }

  const sets: RaysTraceSpec[] = [...sweepSets(api, model, sweeps)];
  const setup = lvLaunchSetup(api, model);
  if ("problem" in setup) problems.push(setup.problem);
  else {
    const cells = options.sampling?.bundleGrid ?? DEFAULT_BUNDLE_GRID;
    for (const { fieldAngleDeg } of sweeps) {
      const made = lvFieldRaySets(api, model, setup, { angleDeg: fieldAngleDeg }, cells);
      if ("problem" in made) problems.push(made.problem);
      else sets.push(...made.sets);
    }
  }
  // The ask is of the lines the tab traces: none of a run whose lines are no line of the tab's.
  const lines = lvVignettingLines(model);
  const asks: VignettingNativeSpec[] =
    lines.length === 0
      ? []
      : [{ lines, maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: sweeps.map((field) => field.fieldAngleDeg) }];
  return { sets, problems, asks };
}
