// The two ends of a zoom: the states a zoom lens is compared in wherever a comparison states no zoom position.
// Whether a lens is a zoom is LensVisualizer's own answer, as the catalog indexes it (`LvCatalogEntry.zoom`).

/** One end of a zoom: its name and its position on LensVisualizer's zoom slider. */
export interface ZoomEnd {
  readonly end: "wide" | "tele";
  readonly zoomT: 0 | 1;
}

/** The ends of a zoom, wide first. The authored stations between them are not states of this list. */
export const ZOOM_ENDS: readonly ZoomEnd[] = [
  { end: "wide", zoomT: 0 },
  { end: "tele", zoomT: 1 },
];

/** The end of a zoom that a zoom position is, or undefined for a position between the two. */
export function zoomEndAt(zoomT: number): ZoomEnd["end"] | undefined {
  return ZOOM_ENDS.find((candidate) => candidate.zoomT === zoomT)?.end;
}

/** What a tool that shows one state says of a zoom it was given no position for. */
export function teleHint(key: string): string {
  return `${key} is a zoom lens: this is its wide end (zoom 0); --zoom 1 gives the tele end`;
}

/** What a tool says of a zoom position it was given for a prime, which has none: the position is taken as 0. */
export function primeZoomNote(key: string): string {
  return `${key} is a prime: it has no zoom position, and --zoom is ignored`;
}
