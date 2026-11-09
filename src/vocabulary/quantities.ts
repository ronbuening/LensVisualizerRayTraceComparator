// The quantities an engine is asked for, in plain words. A quantity's name (`rays.trace`) stays the name stored in
// requests, results and comparisons; a screen shows its label with the name beside it.

/** Every quantity of the contract (`src/contract/quantities`), by its stored name. */
export const QUANTITY_TEXT: Readonly<Record<string, string>> = {
  "selftest.echo": "Echo of a test array",
  "system.describe": "The system as built",
  "paraxial.first-order": "First-order data",
  "rays.trace": "Ray trace",
  "mtf.native": "An engine's own MTF",
  "spot.native": "An engine's own spots and ray fans",
  "axial.native": "An engine's own axial intercepts and foci",
  "chief.native": "An engine's own distortion, chief rays and pupils",
  "curvature.native": "An engine's own field curves",
  "vignetting.native": "An engine's own vignetting and relative illumination",
  "summary.native": "An engine's own first-order summary and f-numbers",
  "seidel.native": "An engine's own Seidel sums",
  "zernike.native": "An engine's own Zernike fit of the wavefront",
  "wavefront.native": "An engine's raw wavefront samples",
};

/** The label of a quantity; a name with no label is returned unchanged. */
export function quantityLabel(name: string): string {
  return Object.hasOwn(QUANTITY_TEXT, name) ? QUANTITY_TEXT[name] : name;
}
