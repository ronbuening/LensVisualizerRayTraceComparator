// Fake compatibility layer: the names the comparator's import manifest takes from LV's compat.ts.
import { DEFAULT_FOPEN, FLAT_RADIUS } from "../../lens-data/defaults.js";
import { ASPHERIC_POLYNOMIAL_TERMS } from "../../types/asphericSchema.js";
import { wideOpenStopAtZoom } from "./aperture.js";
import { FLAT_R_THRESHOLD } from "../geometry.js";
import { fakeChannelIndex } from "../analysis/axial.js";
import type { FakeLensData, FakeRuntimeLens, FakeState, FakeStateSurface, FakeSurfaceData } from "../types.js";


export function buildLens(data: FakeLensData): FakeRuntimeLens {
  const surfaces: FakeSurfaceData[] = data.surfaces.map((surface) => ({ ...surface }));
  const lastLensSurfaceIdx = surfaces.length - 1;
  if (data.rearPlate) {
    const { d, nd, gap } = data.rearPlate;
    // A published rim is an aperture. Without one the fake generates a rim of its own rule, twice the largest
    // authored semi-diameter, and marks it as one that does not clip.
    const rim =
      data.rearPlate.sd === undefined
        ? { sd: 2 * Math.max(...surfaces.map((surface) => surface.sd)), clips: false as const }
        : { sd: data.rearPlate.sd };
    surfaces.push({ label: "RP1a", R: FLAT_RADIUS, d, nd, ...rim, synthetic: "rearPlate" });
    surfaces.push({ label: "RP1b", R: FLAT_RADIUS, d: gap, nd: 1, ...rim, synthetic: "rearPlate" });
  }
  const stopIndex = surfaces.findIndex((surface) => surface.label === "STO");
  if (stopIndex < 0) throw new Error(`${data.key}: no STO surface`);
  const isZoom = Array.isArray(data.zoom?.stations) && data.zoom.stations.length >= 2;
  const stopPhysSD = isZoom && data.zoomStopSDs ? data.zoomStopSDs[0] : surfaces[stopIndex].sd;
  return Object.freeze({
    source: data,
    surfaces,
    lastLensSurfaceIdx,
    isZoom,
    stopIndex,
    stopPhysSD,
    zoomStopSDs: data.zoomStopSDs ?? null,
    FOPEN: data.fopen ?? DEFAULT_FOPEN,
    maxFstop: data.maxFstop ?? 16,
    // Stored pupil constants, as LV keeps them on the lens: none of them is a paraxial image of the stop.
    EP: { epSD: 2 * stopPhysSD },
    // The fraction of the half field the fake's coma fans are drawn at, as LV's lens authors it.
    offAxisFieldFrac: data.offAxisFieldFrac ?? 0.7,
    // The projection law, as LV's runtime lens carries it.
    projection: data.projection ?? { kind: "rectilinear" },
    epZRelStop: -1.5,
    xpZRelLastSurf: -12.5,
    xpSD: 3 * stopPhysSD,
    // One element per glass that follows an authored surface, as the state numbers them, with the line of its indices
    // where the lens states one. Rear plates are none of them, as LV's runtime lens leaves them out.
    elements: data.surfaces.flatMap((surface, index) =>
      surface.nd === 1
        ? []
        : [{ id: index + 1, ...(data.indexReference === undefined ? {} : { indexReference: data.indexReference }) }],
    ),
  });
}

// A conic with polynomial terms, as LV evaluates one: beyond the height at which the conic ends the root is clamped,
// so the sag stays finite there, and `finiteRadiusLimit` is what says that no surface is.
function profileOf(surface: FakeSurfaceData): FakeStateSurface["profile"] {
  const flat = Math.abs(surface.R) > FLAT_R_THRESHOLD;
  const kind = surface.asphere ? "aspheric" : flat ? "flat" : "spherical";
  const c = flat ? 0 : 1 / surface.R;
  const edge = (1 + (surface.asphere?.K ?? 0)) * c * c;
  const root = (radius: number): number => Math.sqrt(Math.max(1e-12, 1 - edge * radius * radius));
  const sag = (radius: number): number =>
    ASPHERIC_POLYNOMIAL_TERMS.reduce(
      (z, term) => z + (surface.asphere?.[term.key] ?? 0) * radius ** term.power,
      (c * radius * radius) / (1 + root(radius)),
    );
  const slope = (radius: number): number =>
    ASPHERIC_POLYNOMIAL_TERMS.reduce(
      (dz, term) => dz + term.power * (surface.asphere?.[term.key] ?? 0) * radius ** (term.power - 1),
      (c * radius) / root(radius),
    );
  return { kind, sag, slope, finiteRadiusLimit: () => (edge > 0 ? 1 / Math.sqrt(edge) : null) };
}

export function prepareRuntimeState(L: FakeRuntimeLens, focusT: number, zoomT: number, aberrationT = 0): FakeState {
  void aberrationT;
  const zoomGaps = L.isZoom ? (L.source.zoomGaps ?? null) : null;
  const zoomGap = zoomGaps === null ? 0 : zoomGaps[0] + (zoomGaps[zoomGaps.length - 1] - zoomGaps[0]) * zoomT;
  const surfaces: FakeStateSurface[] = [];
  const z: number[] = [];
  let position = 0;
  L.surfaces.forEach((source, index) => {
    // The fake moves the whole lens for focus and opens its first gap for zoom, so both sliders show in the state.
    let d = source.d;
    if (index === 0) d += zoomGap;
    if (index === L.lastLensSurfaceIdx) d += focusT * (L.source.focusTravel ?? 0);
    surfaces.push({
      physicalIndex: index,
      label: source.label,
      R: source.R,
      d,
      nd: source.nd,
      sd: index === L.stopIndex ? wideOpenStopAtZoom(zoomT, L) : source.sd,
      innerSd: null,
      clips: source.clips !== false,
      elemId: source.nd === 1 ? 0 : index + 1,
      asphere: source.asphere ?? null,
      diffractive: source.diffractive ?? null,
      interaction: source.interaction ?? { type: "refract", incidentSide: "both", inactiveSide: "ignore" },
      // A folded visit's hole, as LV's innerSd (the edit a test makes to innerSd above keeps working).
      ...(source.innerSd === undefined ? {} : { innerSd: source.innerSd }),
      profile: profileOf(source),
      source,
      z: position,
    });
    z.push(position);
    position += d;
  });
  return {
    traceGeometry: { stopSurfaceIndex: L.stopIndex },
    lens: {
      key: L.source.key,
      runtime: L,
      stop: { surfaceIndex: L.stopIndex },
      flags: { isZoom: L.isZoom, isFoldedOptics: !!L.source.opticalPath },
      opticalPath: L.source.opticalPath,
      // The projection, with the authored config LV's launch-surface rule reads; the fake's carries its bounding sphere.
      projection: {
        kind: "rectilinear",
        config: { kind: "rectilinear", vectorBeyondDeg: L.source.field?.vectorBeyondDeg },
      },
      // How far ahead of the first vertex the fake's skew rays start, as LV's lens constants say.
      constants: { rayLead: 10 },
      // Each medium at the chromatic tab's channels.
      dispersion: surfaces.map((surface) => ({
        quality: surface.nd === 1 ? "air" : "abbe",
        indexAt: (channel: string) => fakeChannelIndex(surface.nd, channel),
      })),
    },
    focusT,
    zoomT,
    surfaces,
    z,
    imagePlane: { point: [0, 0, L.source.imageZ ?? position], normal: [0, 0, 1] },
    imgZ: L.source.imageZ ?? position,
    totalTrack: position,
  };
}

export function traceRay(y0: number, u0: number): unknown {
  return { pts: [], ghostPts: [], y: y0, u: u0, clipped: false };
}

// The field geometry the fake's analyses share: its pupil ratio is the lens's, at any state.
export function computeAnalysisFieldGeometryAtState(_focusT: number, _zoomT: number, L: FakeRuntimeLens): unknown {
  return { yRatio: L.source.pupilRatio ?? 1, b: 0, epRatio: 1, halfFieldDeg: L.source.field?.edgeDeg ?? 20 };
}

export function entrancePupilAtState(
  stopSD: number,
  _focusT: number,
  _zoomT: number,
  L: FakeRuntimeLens,
  geometry?: { yRatio: number },
): unknown {
  const yRatio = geometry?.yRatio ?? L.source.pupilRatio ?? 1;
  return { epSD: Math.abs(stopSD / yRatio), yRatio, b: 0, epRatio: 1 };
}

export function fopenAtZoomClamped(_zoomT: number, L: FakeRuntimeLens): number {
  return L.FOPEN;
}

export function epAtZoomClamped(zoomT: number, L: FakeRuntimeLens): number {
  return L.EP.epSD + zoomT;
}
