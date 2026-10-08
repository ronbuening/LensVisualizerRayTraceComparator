// The quantity `paraxial.first-order`: its schema files, and the rule they cannot state.
import {
  FIRST_ORDER_VALUES,
  PARAXIAL_FIRST_ORDER,
  PARAXIAL_FIRST_ORDER_VERSION,
} from "../contract/quantities/paraxialFirstOrder.ts";
import type { ParaxialFirstOrderData } from "../contract/quantities/paraxialFirstOrder.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";
import type { QuantityModule } from "./module.ts";

/** Every array of an answer, the recorded ones included, has one value per line: one length, of at least 1. */
function dataInvariants(value: unknown): ValidationIssue[] {
  const data = value as ParaxialFirstOrderData;
  const [lines] = data.efl.$nd.shape;
  if (lines < 1) return [invariantIssue("/efl", "it holds no value: a case has at least one line")];
  const arrays: [path: string, length: number][] = [
    ...FIRST_ORDER_VALUES.map((name): [string, number] => [`/${name}`, data[name].$nd.shape[0]]),
    ...Object.keys(data.recorded)
      .sort()
      .map((name): [string, number] => [
        `/recorded/${name.replaceAll("~", "~0").replaceAll("/", "~1")}`,
        data.recorded[name].$nd.shape[0],
      ]),
  ];
  return arrays
    .filter(([, length]) => length !== lines)
    .map(([path, length]) => invariantIssue(path, `it holds ${length} values, efl holds ${lines}: one per line`));
}

/**
 * The quantity `paraxial.first-order`, validated by its two schema files and then by what they cannot state: every
 * array of an answer has the same length, one value per line.
 */
export const paraxialFirstOrderQuantity: QuantityModule = schemaQuantity(
  PARAXIAL_FIRST_ORDER,
  PARAXIAL_FIRST_ORDER_VERSION,
  { data: dataInvariants },
);
