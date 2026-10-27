// Vignetting sets from LensVisualizer: the rays its vignetting tab launches, every field of them, as `rays.trace`
// specs. "Identical rays" for the rung R11a are these: the tab's own beams and the chief rays of its image mapping,
// traced as given by every engine.
//
// Since LensVisualizer 5ba17c20c the tab traces each field's whole beam in two dimensions on its MTF's launch lattice,
// and finds the image area a unit of object solid angle covers from the landings of chief rays (vignettingFields.ts,
// which decides the fields and restates what the tab does inline, each line with a source canary in
// test/integration/lv/canaries.test.ts). An integration test holds the sets to LensVisualizer's own: traced by
// LensVisualizer they give the tab's curve to the bit (test/integration/lv/vignettingRays.test.ts).
import type { VignettingNativeSpec } from "../../contract/quantities/vignettingNative.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { launchBehindProblem, startsInFront } from "../../rays/probe.ts";
import { rayProblem } from "../../rays/raySets.ts";
import type { VignettingSetResolution } from "../../rays/vignettingSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefGeometry } from "./chiefSetup.ts";
import { lvTraceOptions } from "./rays.ts";
import type { LvRay } from "./types.ts";
import {
  isVignettingRefusal,
  lvBeamCellRays,
  lvBeamLattice,
  lvMappingChiefRays,
  lvVignettingDecision,
  lvVignettingLines,
  lvVignettingMapping,
} from "./vignettingFields.ts";
import type { LvVignettingBeam, LvVignettingFieldsApi, LvVignettingSetup } from "./vignettingFields.ts";

/** The LensVisualizer exports the vignetting sets are made with. */
export type LvVignettingApi = LvVignettingFieldsApi;

/** The patterns of rays, in the order a run's sets are made: one, a beam set of each field and line. */
export const VIGNETTING_PATTERNS = ["beam"] as const;
/** One pattern of the vignetting rays. */
export type VignettingPattern = (typeof VIGNETTING_PATTERNS)[number];

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

/**
 * The weights of a beam set's rays at one line of the case: each cell's LensVisualizer bulk transmission along its
 * trace at the line, as the tab weighs a lit cell, restated from `traceBeam`:
 *
 * ```
 * const w = bulkTransmissionForTrace(state.lens, trace.hits);
 * ```
 *
 * and 0 for the chief rays after the cells, which are references and no samples of the beam.
 */
function beamWeights(
  api: LvVignettingApi,
  model: LvCaseModel,
  rays: readonly LvRay[],
  cells: number,
  line: number,
): Float64Array {
  const options = lvTraceOptions(model, line);
  return Float64Array.from(rays, (ray, at) =>
    at < cells ? api.bulkTransmissionForTrace(model.state.lens, api.traceEngineRay(model.state, ray, options).hits) : 0,
  );
}

/** The beam sets of one field, one at each line of the case. */
function beamSets(
  api: LvVignettingApi,
  model: LvCaseModel,
  setup: LvVignettingSetup,
  fieldAngleDeg: number,
  beam: LvVignettingBeam,
  rays: readonly LvRay[],
  cells: number,
): RaysTraceSpec[] {
  const origins = new Float64Array(3 * rays.length);
  const directions = new Float64Array(3 * rays.length);
  rays.forEach(({ origin, direction }, ray) => {
    origins.set(origin, 3 * ray);
    directions.set(direction, 3 * ray);
  });
  const { columns, rows, step } = lvBeamLattice(beam.grid, setup.mirror);
  const encoded = {
    origins: encodeNdArray(origins, [rays.length, 3]),
    directions: encodeNdArray(directions, [rays.length, 3]),
  };
  const groups = { field: { angleDeg: fieldAngleDeg }, lattice: { columns, rows, step }, chiefIndex: cells };
  return model.exported.conditions.lines.map((_line, line) => ({
    line,
    ...encoded,
    weights: encodeNdArray(beamWeights(api, model, rays, cells, line), [rays.length]),
    groups,
  }));
}

/**
 * The vignetting sets of a case that came from a LensVisualizer lens: for every field of the tab with a beam
 * (`lvVignettingDecision`, the fields `lv`'s answer is of too), the axis first, a beam set at each line of the case,
 * the same rays at every line, in the order of the lines:
 *
 * - the cells the tab traces of the beam's lattice of `LV_VIGNETTING_BEAM_CELLS` cells across (`lvBeamCellRays`): of
 *   each row, the columns from the middle on where the tab mirrors the other half, every column where it does not;
 *   stated as a lattice of their own under `groups.lattice`, row by row;
 * - then the chief rays of the tab's image mapping (`lvMappingChiefRays`): the field's (`groups.chiefIndex`), then
 *   those 0.01 degrees below and above it where the tab has their launches.
 *
 * A cell weighs LensVisualizer's bulk transmission along its trace at the line, as the tab weighs a lit cell; a chief
 * ray weighs 0. Beside the sets, the `vignetting.native` request of the tab: at the lines it traces
 * (`lvVignettingLines`: the authored reference line), at the angles of the fields with a beam, the axis first; none
 * for a run of no such line.
 *
 * A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`), a state without a
 * half field (`no-half-field`) or a pupil (`no-pupil`), one the tab draws no curve of (`lv-outside-beam-model`,
 * `lv-bounding-sphere-field`), and one whose axis has no beam a set can state (`no-axis-beam`: the tab's every figure
 * is relative to the axis) have no sets and no request, one problem each. A field without a chief-ray launch
 * (`chief-ray-failed`) or a footprint (`vignetted`), which the tab plots dark, and one whose rays would not start in
 * front of the first surface (`launch-behind-first-surface`) is a coded problem, and the others are not affected. A
 * field whose image mapping the tab takes of ray tubes traced without aperture checks keeps its set, and is named
 * (`lv-tube-mapping`): its relative illumination rests on rays no set holds.
 */
export function lvVignettingRaySets(api: LvVignettingApi, model: LvCaseModel): VignettingSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const problem = rayProblem("no-half-field", "LensVisualizer's field geometry of the state has no half field");
    return { sets: [], problems: [problem], asks: [] };
  }
  const decision = lvVignettingDecision(api, model, geometry);
  if ("refused" in decision) {
    return { sets: [], problems: [rayProblem(decision.refused.code, decision.refused.message)], asks: [] };
  }
  const { setup } = decision;
  const problems: string[] = [];
  const sets: RaysTraceSpec[] = [];
  const angles: number[] = [];
  for (const { index, fieldAngleDeg, made } of decision.fields) {
    const cellRays = isVignettingRefusal(made) ? [] : lvBeamCellRays(api, made, setup.mirror);
    const rays = isVignettingRefusal(made) ? [] : [...cellRays, ...lvMappingChiefRays(api, made)];
    const problem = isVignettingRefusal(made)
      ? rayProblem(made.code, made.message)
      : startsInFront(model.exported.system.surfaces[0], Float64Array.from(rays.flatMap((ray) => [...ray.origin])))
        ? null
        : launchBehindProblem(fieldAngleDeg);
    if (problem !== null || isVignettingRefusal(made)) {
      if (problem !== null) problems.push(problem);
      if (index === 0) {
        const message = "the vignetting tab's every figure is relative to the axis, and the axis has no beam";
        return { sets: [], problems: [...problems, rayProblem("no-axis-beam", message)], asks: [] };
      }
      continue;
    }
    if (lvVignettingMapping(api, model, setup, made) === "tube") {
      const message = `the vignetting tab's image mapping of the field at ${fieldAngleDeg} degrees is the median ray tube of its beam, of copies of its rays tilted and traced without aperture checks, which no rays.trace request states`;
      problems.push(rayProblem("lv-tube-mapping", message));
    }
    sets.push(...beamSets(api, model, setup, fieldAngleDeg, made, rays, cellRays.length));
    angles.push(fieldAngleDeg);
  }
  // The ask is of the lines the tab traces: none of a run whose lines are no line of the tab's.
  const lines = lvVignettingLines(model);
  const asks: VignettingNativeSpec[] =
    lines.length === 0 ? [] : [{ lines, maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: angles }];
  return { sets, problems, asks };
}
