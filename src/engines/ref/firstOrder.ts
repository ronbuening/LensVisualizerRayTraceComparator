// `paraxial.first-order` as the reference engine answers it: the paraxial kernel on its model, line by line.
import { AFOCAL_SYSTEM, FIRST_ORDER_VALUES, LINEAR_SAG_TERM } from "../../contract/quantities/paraxialFirstOrder.ts";
import type { FirstOrderValue, ParaxialFirstOrderData } from "../../contract/quantities/paraxialFirstOrder.ts";
import type { UnsupportedItem } from "../../contract/result.ts";
import { encodeF8 } from "../../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import type { RefSystem } from "./model.ts";
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
    const output = firstOrder({
      surfaces: system.surfaces.map((surface, index) => ({
        z: surface.z,
        curvature: curvatures[index] as number,
        indexAfter: indices[index],
      })),
      stopIndex: system.stopIndex,
      stopSemiDiameter: system.stopSemiDiameter,
      lastLensSurfaceIndex: system.lastLensSurfaceIndex,
      objectZ: system.objectZ,
    });
    if (output === null) return void afocal.push(line);
    for (const name of FIRST_ORDER_VALUES) columns[name].push(output.values[name]);
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
