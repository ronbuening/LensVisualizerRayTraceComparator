import { EPSILON } from "../constants.js";

/** Sag of a sphere of the given radius at the given height; a zero radius means a plane. */
export function sag(radius: number, height: number): number {
  if (Math.abs(radius) < EPSILON) return 0;
  return radius - Math.sign(radius) * Math.sqrt(radius * radius - height * height);
}
