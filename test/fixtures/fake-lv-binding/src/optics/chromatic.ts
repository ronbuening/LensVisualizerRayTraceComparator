// The fake's standard spectral lines in nm, under LV's name for them.
export const LINE_NM = { C: 656.2725, d: 587.5618, e: 546.074, F: 486.1327, g: 435.8343 } as const;

// The line a lens's chromatic channels are labelled at, under LV's name and by LV's rule: "e" only when every element
// is e-referenced.
export function lensChromaticReference(elements: readonly { indexReference?: string }[]): string {
  return elements.length > 0 && elements.every((element) => element.indexReference === "e") ? "e" : "d";
}

// The line of each of the fake's chromatic channels of a lens of d-line indices, under LV's name.
export const CHROMATIC_CHANNEL_WAVELENGTH_NM = Object.freeze({ R: LINE_NM.C, G: LINE_NM.d, B: LINE_NM.F, V: LINE_NM.g });

// The channels every chromatic readout traces to choose its zone, under LV's name (LV #930): LV's four.
export const CHROMATIC_ZONE_CHANNELS = Object.freeze(["R", "G", "B", "V"] as const);
