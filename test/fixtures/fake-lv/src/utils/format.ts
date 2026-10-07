import { SCALE } from "../optics/constants.js";
import { LABEL } from "./label.js";

export function describe(value: number): string {
  return `${LABEL}:${(value * SCALE).toFixed(3)}`;
}
