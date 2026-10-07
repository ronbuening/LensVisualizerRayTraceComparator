// Fake LensVisualizer entry module. Like LV, it imports its TypeScript siblings with ".js" specifiers.
import { SCALE } from "./constants.js";
import { sag } from "./math/sag.js";
import type { FakeLens, FakeSurface } from "./types.js";

export default function buildLens(surfaces: readonly FakeSurface[]): FakeLens {
  return { surfaces, sagAtUnitHeight: surfaces.map((surface) => sag(surface.radius, 1) * SCALE) };
}
