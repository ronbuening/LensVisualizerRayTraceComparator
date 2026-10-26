// `paraxial.first-order` as the reference engine answers it: the paraxial kernel on its model, line by line.
import { AFOCAL_SYSTEM, FIRST_ORDER_VALUES, LINEAR_SAG_TERM } from "../../contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../../contract/quantities/paraxialFirstOrder.ts";
import type { UnsupportedItem } from "../../contract/result.ts";
import { encodeF8 } from "../../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { RefSystem } from "./model.ts";
import { foldedSingularities } from "./foldedSingularities.ts";
import { phasePower } from "./phase.ts";
import { firstOrder, vertexCurvature } from "./paraxial.ts";

/** The first-order data of a model, or why it has none. */
export type FirstOrderAnswer =
  | { readonly supported: true; readonly data: ParaxialFirstOrderData }
  | { readonly supported: false; readonly items: readonly UnsupportedItem[] };

/**
 * The first-order data of a model at every line of its case, each surface with the indices of that line and the
 * curvature of its vertex (`vertexCurvature`). A finite object adds its paraxial magnification, under `recorded`.
 *
 * Two kinds of system have no first-order data, and are answered as unsupported, each with an item of code
 * `feature`: one with a surface that has a term of power 1 (`surface.asphere.linear-term`, once, naming the first
 * such surface), and one that is afocal at a line (`system.afocal`, once, naming every such line).
 */
export function answerFirstOrder(system: RefSystem): FirstOrderAnswer {
  const path = system.opticalPath;
  const stopVisit = path?.findIndex((step) => step.surfaceIndex === system.stopIndex);
  if (stopVisit === -1)
    return {
      supported: false,
      items: [
        {
          code: "feature",
          item: "folded-stop-not-visited",
          message: "the declared folded path does not visit the stop; no paraxial pupil of it is defined",
        },
      ],
    };
  const curvatures = system.surfaces.map((surface) => vertexCurvature(surface.profile));
  const cone = curvatures.indexOf(null);
  if (cone >= 0) {
    const message = `surface ${cone} has a term of power 1: a cone has no curvature at its vertex`;
    return { supported: false, items: [{ code: "feature", item: LINEAR_SAG_TERM, message }] };
  }

  const columns = Object.fromEntries(FIRST_ORDER_VALUES.map((name) => [name, []])) as unknown as Record<
    FirstOrderValue,
    number[]
  >;
  const magnifications: number[] = [];
  const afocal: number[] = [];
  system.indexAfter.forEach((indices, line) => {
    let sign = 1;
    let medium = 1;
    const rows =
      path === undefined
        ? system.surfaces.map((surface, index) => ({
            z: surface.z,
            curvature: curvatures[index] as number,
            indexAfter: indices[index],
            ...(surface.diffractive === undefined
              ? {}
              : { phasePower: phasePower(surface.diffractive, system.wavelengthsNm?.[line] ?? 587.5618) }),
          }))
        : path.map((step) => {
            const side = sign > 0 ? "front" : "rear";
            const active =
              step.incidentSide === undefined || step.incidentSide === "both" || step.incidentSide === side;
            const interaction = active ? step.interaction : "pass";
            const reference =
              side === "rear" && step.reverseMediumAfter !== undefined ? step.reverseMediumAfter : step.mediumAfter;
            if (interaction === "reflect") sign = -sign;
            if (interaction === "refract") medium = reference === null ? 1 : indices[reference ?? step.surfaceIndex];
            return {
              z: system.surfaces[step.surfaceIndex].z,
              curvature:
                interaction === "block" || interaction === "pass" ? 0 : (curvatures[step.surfaceIndex] as number),
              indexAfter: sign * medium,
              ...(interaction === "refract" && system.surfaces[step.surfaceIndex].diffractive !== undefined
                ? {
                    phasePower: phasePower(
                      system.surfaces[step.surfaceIndex].diffractive,
                      system.wavelengthsNm?.[line] ?? 587.5618,
                    ),
                  }
                : {}),
            };
          });
    const output = firstOrder({
      compensated: path !== undefined || system.surfaces.some((surface) => surface.diffractive !== undefined),
      surfaces: rows,
      stopIndex: stopVisit ?? system.stopIndex,
      stopSemiDiameter: system.stopSemiDiameter,
      lastLensSurfaceIndex: path === undefined ? system.lastLensSurfaceIndex : rows.length - 1,
      objectZ: system.objectZ,
    });
    if (output === null) return void afocal.push(line);
    const values = {
      ...output.values,
      backFocus: output.values.rearFocalZ - system.surfaces[system.lastLensSurfaceIndex].z,
    };
    if (path) {
      const singular = foldedSingularities(system, indices, system.wavelengthsNm?.[line]);
      if (singular.entrance !== null) {
        values.entrancePupilZ = singular.entrance;
        values.entrancePupilSemiDiameter = Infinity;
      }
      if (singular.exit !== null) {
        values.exitPupilZ = singular.exit;
        values.exitPupilSemiDiameter = Infinity;
      }
    }
    for (const name of FIRST_ORDER_VALUES) columns[name].push(values[name]);
    if (output.magnification !== null) magnifications.push(output.magnification);
  });
  if (afocal.length > 0) {
    const lines = `${afocal.length > 1 ? "lines" : "line"} ${afocal.join(", ")}`;
    const message = `the system has no finite focal length at ${lines}`;
    return { supported: false, items: [{ code: "feature", item: AFOCAL_SYSTEM, message }] };
  }

  const values = Object.fromEntries(FIRST_ORDER_VALUES.map((name) => [name, encodeF8(columns[name])])) as Record<
    FirstOrderValue,
    NdArrayWire
  >;
  const recorded: Record<string, NdArrayWire> = {};
  if (system.objectZ !== null) recorded.magnification = encodeF8(magnifications);
  return { supported: true, data: { ...values, recorded } };
}
