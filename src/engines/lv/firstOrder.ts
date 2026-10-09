// `paraxial.first-order` as the engine `lv` answers it: LensVisualizer's paraxial kernel on its own prepared
// state, line by line, with the indices LensVisualizer traces that line with.
//
// LensVisualizer's first-order module reads each surface's authored index and so answers for one line only. The
// kernel under it takes any rows of radius, gap and index, so every line is answered by the kernel, assembled here
// the way LensVisualizer assembles it: two basis rays give the system matrix (as its `computeSystemMatrix2` does),
// its own `buildCardinalElementsFromMatrix2` gives the cardinal points, and two rays to the stop give the entrance
// pupil (as its `paraxialPupilGeometry2` does). The values are the kernel's, not numbers LensVisualizer displays.
import type { OpticalCase } from "../../contract/case.ts";
import {
  AFOCAL_SYSTEM,
  FIRST_ORDER_VALUES,
  LINEAR_SAG_TERM,
  QUADRATIC_SAG_TERM,
} from "../../contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../../contract/quantities/paraxialFirstOrder.ts";
import type { UnsupportedItem } from "../../contract/result.ts";
import { decodeNdArray, encodeF8, ndRow } from "../../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { LvCaseModel } from "./caseModel.ts";
import type { LvApi, LvParaxialSurface } from "./types.ts";

/** The LensVisualizer exports the first-order data is made from. */
export type LvFirstOrderApi = Pick<
  LvApi,
  | "traceParaxialSurfaces2"
  | "buildCardinalElementsFromMatrix2"
  | "fopenAtZoom2"
  | "epAtZoom2"
  | "epZRelStopAtZoom"
  | "xpZRelLastSurfAtZoom"
  | "xpAtZoom"
>;

/** The first-order data of a model, or why it has none. */
export type LvFirstOrderAnswer =
  | { readonly supported: true; readonly data: ParaxialFirstOrderData }
  | { readonly supported: false; readonly items: readonly UnsupportedItem[] };

/**
 * The names under which LensVisualizer's stored pupil constants are recorded. Each says that it is stored or
 * nominal: none is the paraxial image of the stop that the compared value of a like name is.
 *
 * - `lvStoredEntrancePupilZ`, `lvStoredExitPupilZ`: the positions LensVisualizer draws its pupil markers at, the
 *   stop vertex plus `epZRelStop` and the last vertex plus `xpZRelLastSurf`; it finds both with real rays near the
 *   axis;
 * - `lvNominalEntrancePupilSemiDiameter`: its entrance-pupil semi-diameter, focal length over twice the f-number;
 * - `lvStoredExitPupilSemiDiameter`: its `xpSD`, scaled from that nominal entrance pupil;
 * - `lvNominalFNumber`: its wide-open f-number at the zoom position, whatever the stop setting of the case.
 */
export const LV_STORED_CONSTANTS = [
  "lvStoredEntrancePupilZ",
  "lvStoredExitPupilZ",
  "lvNominalEntrancePupilSemiDiameter",
  "lvStoredExitPupilSemiDiameter",
  "lvNominalFNumber",
] as const;
/** The name of one recorded constant of LensVisualizer. */
export type LvStoredConstant = (typeof LV_STORED_CONSTANTS)[number];

/** The first-order data of one line; null where LensVisualizer finds the system afocal. */
function lineValues(
  api: LvFirstOrderApi,
  model: LvCaseModel,
  rows: readonly LvParaxialSurface[],
): Record<FirstOrderValue, number> | null {
  const { state, runtime, exported } = model;
  const trace = api.traceParaxialSurfaces2;
  const last = rows.length - 1;
  const stop = state.lens.stop.surfaceIndex;
  const stopRadius = exported.conditions.stopSemiDiameter;

  // The system matrix from the first vertex to the last, by a ray of height 1 and a ray of angle 1.
  const marginal = trace(rows, 1, 0, { skipLastTransfer: true });
  const chief = trace(rows, 0, 1, { skipLastTransfer: true });
  const imageIndex = marginal.n;
  const cardinals = api.buildCardinalElementsFromMatrix2({
    A: marginal.y,
    B: chief.y,
    C: imageIndex * marginal.u,
    D: imageIndex * chief.u,
    objectIndex: 1,
    imageIndex,
    frontVertexZ: state.z[0],
    rearVertexZ: state.z[last],
    rearLensVertexZ: state.z[runtime.lastLensSurfaceIdx],
    imagePlaneZ: state.imgZ,
  });
  if (cardinals === null) return null;

  // The entrance pupil: the same two rays, stopped at the stop's vertex plane. The plane of the object space from
  // which every ray reaches one point of the stop is where their heights there cancel.
  const height = trace(rows, 1, 0, { stopAt: stop }).y;
  const angle = trace(rows, 0, 1, { stopAt: stop }).y;

  // The exit pupil: a ray that leaves the centre of the stop crosses the axis again where the stop is imaged, and
  // the image is as much larger as the ray's reduced angle is smaller. The kernel starts every ray in air, so a
  // plane in front, followed by the stop's own medium, puts the ray into that medium with its reduced angle
  // unchanged; the stop surface's own refraction moves no image of the stop.
  const behind = [{ R: Infinity, d: rows[stop].d, nd: rows[stop].nd }, ...rows.slice(stop + 1)];
  const fromStop = trace(behind, 0, 1, { skipLastTransfer: true });

  return {
    efl: cardinals.distances.efl.valueMm,
    frontFocalZ: cardinals.points.frontFocal.z,
    rearFocalZ: cardinals.points.rearFocal.z,
    frontPrincipalZ: cardinals.points.frontPrincipal.z,
    rearPrincipalZ: cardinals.points.rearPrincipal.z,
    backFocus: cardinals.distances.bfd.valueMm,
    entrancePupilZ: state.z[0] + angle / height,
    exitPupilZ: state.z[last] - fromStop.y / fromStop.u,
    entrancePupilSemiDiameter: stopRadius / Math.abs(height),
    exitPupilSemiDiameter: stopRadius / Math.abs(fromStop.n * fromStop.u),
  };
}

/**
 * LensVisualizer's stored pupil constants for the state of a model, in the contract frame, as LensVisualizer's own
 * accessors give them at the state's zoom position.
 */
function storedConstants(api: LvFirstOrderApi, model: LvCaseModel): Record<LvStoredConstant, number> {
  const { state, runtime } = model;
  const { zoomT } = state;
  return {
    lvStoredEntrancePupilZ: state.z[state.lens.stop.surfaceIndex] + api.epZRelStopAtZoom(zoomT, runtime),
    lvStoredExitPupilZ: state.z[state.surfaces.length - 1] + api.xpZRelLastSurfAtZoom(zoomT, runtime),
    lvNominalEntrancePupilSemiDiameter: api.epAtZoom2(zoomT, runtime),
    lvStoredExitPupilSemiDiameter: api.xpAtZoom(zoomT, runtime),
    lvNominalFNumber: api.fopenAtZoom2(zoomT, runtime),
  };
}

/**
 * What the polynomial terms of a case keep LensVisualizer's kernel from answering; empty when nothing does. The
 * kernel is handed the radius of a surface and nothing else of its shape, so it sees neither a term of power 1,
 * which has no first-order data in any engine, nor a term of power 2, which the contract counts as curvature at
 * the vertex. One item of code `feature` for each, naming the first surface that has one, the linear one first.
 *
 * No lens of LensVisualizer has either: its aspheric schema starts at `A3`. The rule is here so that one that came
 * to have one would be answered as unsupported, and not with the focal length of the lens without the term.
 */
function termItems(opticalCase: OpticalCase): UnsupportedItem[] {
  const reasons = [
    [1, LINEAR_SAG_TERM, "a cone has no curvature at its vertex"],
    [
      2,
      QUADRATIC_SAG_TERM,
      "LensVisualizer's paraxial kernel reads the radius of a surface alone, which does not see it",
    ],
  ] as const;
  const items: UnsupportedItem[] = [];
  for (const [power, item, why] of reasons) {
    const at = opticalCase.system.surfaces.findIndex(
      ({ shape }) => shape.kind === "asphere" && shape.terms.some((term) => term.power === power && term.coeff !== 0),
    );
    if (at >= 0) items.push({ code: "feature", item, message: `surface ${at} has a term of power ${power}: ${why}` });
  }
  return items;
}

/** The index of the medium after each surface at each line of a case: one row per line. */
function indexRows(opticalCase: OpticalCase): Float64Array[] {
  const table = decodeNdArray(opticalCase.conditions.indexAfterSurface);
  if (table.dtype !== "f8") throw new Error(`the index table is ${table.dtype}, not f8`);
  return opticalCase.conditions.lines.map((_line, row) => ndRow(table, row));
}

/**
 * The first-order data of a model at every line of its case. Each line is LensVisualizer's kernel on the rows
 * `{ R, d, nd }` of its state, with `nd` the index LensVisualizer traces that line with:
 *
 * - the cardinal points and `efl` are those of `buildCardinalElementsFromMatrix2` for the kernel's system matrix,
 *   and `backFocus` its `bfd`, which is measured from the last lens vertex, so that a rear plate lies inside it;
 * - the entrance pupil is where the kernel images the stop's vertex plane into object space, and the exit pupil
 *   where it images it into image space, each with the radius of the image of a stop of the case's radius.
 *
 * `recorded` holds two kinds of value, neither of which is judged:
 *
 * - `magnification`, for a finite object: the kernel's lateral magnification of the object plane;
 * - LensVisualizer's stored constants (`LV_STORED_CONSTANTS`), where they are defined: at infinity focus, and at
 *   a line it traces with the authored indices, since they are properties of the prescription as written. At any
 *   other line of such a case they are NaN, and a case without such a line, or away from infinity focus, has none.
 *
 * A system that LensVisualizer finds afocal at a line (its cardinal construction gives nothing) is answered as
 * unsupported, with one item of code `feature` and item `system.afocal` that names every such line. So is a case
 * with a term of power 1 or 2, which the kernel does not see (`termItems`), before the kernel is asked.
 */
export function answerLvFirstOrder(api: LvFirstOrderApi, model: LvCaseModel): LvFirstOrderAnswer {
  const { state, exported } = model;
  const { lines, object } = exported.conditions;
  const unseen = termItems(exported);
  if (unseen.length > 0) return { supported: false, items: unseen };
  const columns = Object.fromEntries(FIRST_ORDER_VALUES.map((name) => [name, []])) as unknown as Record<
    FirstOrderValue,
    number[]
  >;
  const magnifications: number[] = [];
  const afocal: number[] = [];
  indexRows(exported).forEach((indices, line) => {
    const rows = state.surfaces.map(({ R, d }, index) => ({ R, d, nd: indices[index] }));
    const values = lineValues(api, model, rows);
    if (values === null) return void afocal.push(line);
    for (const name of FIRST_ORDER_VALUES) columns[name].push(values[name]);
    if (object.kind === "finite") {
      // A ray from the axial object point with the angle 1 meets the first vertex plane at the object's distance.
      const image = api.traceParaxialSurfaces2(rows, state.z[0] - object.z, 1, { skipLastTransfer: true });
      magnifications.push(1 / (image.n * image.u));
    }
  });
  if (afocal.length > 0) {
    const named = `${afocal.length > 1 ? "lines" : "line"} ${afocal.join(", ")}`;
    const message = `LensVisualizer finds no finite focal length at ${named}`;
    return { supported: false, items: [{ code: "feature", item: AFOCAL_SYSTEM, message }] };
  }

  const values = Object.fromEntries(FIRST_ORDER_VALUES.map((name) => [name, encodeF8(columns[name])])) as Record<
    FirstOrderValue,
    NdArrayWire
  >;
  const recorded: Record<string, NdArrayWire> = {};
  if (object.kind === "finite") recorded.magnification = encodeF8(magnifications);
  const defined = lines.map((line) => state.focusT === 0 && line.indexSource === "authored");
  if (defined.includes(true)) {
    const stored = storedConstants(api, model);
    for (const name of LV_STORED_CONSTANTS) {
      recorded[name] = encodeF8(defined.map((here) => (here ? stored[name] : NaN)));
    }
  }
  return { supported: true, data: { ...values, recorded } };
}
