// Fake compatibility layer: the names the comparator's import manifest takes from LV's compat.ts.
import { DEFAULT_FOPEN, FLAT_RADIUS } from "../lens-data/defaults.js";
import { wideOpenStopAtZoom } from "./apertureStop.js";
import type { FakeLensData, FakeRuntimeLens, FakeState, FakeStateSurface, FakeSurfaceData } from "./types.js";

export { computeCardinalElements2 } from "./first-order/cardinals.js";

export function buildLens2(data: FakeLensData): FakeRuntimeLens {
  const surfaces: FakeSurfaceData[] = data.surfaces.map((surface) => ({ ...surface }));
  const lastLensSurfaceIdx = surfaces.length - 1;
  if (data.rearPlate) {
    const { d, nd, gap, sd } = data.rearPlate;
    surfaces.push({ label: "RP1a", R: FLAT_RADIUS, d, nd, sd, synthetic: "rearPlate" });
    surfaces.push({ label: "RP1b", R: FLAT_RADIUS, d: gap, nd: 1, sd, synthetic: "rearPlate" });
  }
  const stopIndex = surfaces.findIndex((surface) => surface.label === "STO");
  if (stopIndex < 0) throw new Error(`${data.key}: no STO surface`);
  const isZoom = Array.isArray(data.zoomPositions) && data.zoomPositions.length >= 2;
  return Object.freeze({
    data,
    surfaces,
    lastLensSurfaceIdx,
    isZoom,
    stopIndex,
    stopPhysSD: isZoom && data.zoomStopSDs ? data.zoomStopSDs[0] : surfaces[stopIndex].sd,
    zoomStopSDs: data.zoomStopSDs ?? null,
    FOPEN: data.fopen ?? DEFAULT_FOPEN,
    // One element per glass that follows an authored surface, as the state numbers them.
    elements: data.surfaces.flatMap((surface, index) => (surface.nd === 1 ? [] : [{ id: index + 1 }])),
  });
}

function profileOf(surface: FakeSurfaceData): FakeStateSurface["profile"] {
  const flat = Math.abs(surface.R) > 1e10;
  const kind = surface.asphere ? "aspheric" : flat ? "flat" : "spherical";
  const sag = (radius: number): number => (flat ? 0 : (radius * radius) / (2 * surface.R));
  const slope = (radius: number): number => (flat ? 0 : radius / surface.R);
  return { kind, sag, slope };
}

export function prepareRuntimeState(L: FakeRuntimeLens, focusT: number, zoomT: number, aberrationT = 0): FakeState {
  void aberrationT;
  const zoomGaps = L.isZoom ? (L.data.zoomGaps ?? null) : null;
  const zoomGap = zoomGaps === null ? 0 : zoomGaps[0] + (zoomGaps[zoomGaps.length - 1] - zoomGaps[0]) * zoomT;
  const surfaces: FakeStateSurface[] = [];
  const z: number[] = [];
  let position = 0;
  L.surfaces.forEach((source, index) => {
    // The fake moves the whole lens for focus and opens its first gap for zoom, so both sliders show in the state.
    let d = source.d;
    if (index === 0) d += zoomGap;
    if (index === L.lastLensSurfaceIdx) d += focusT * (L.data.focusTravel ?? 0);
    surfaces.push({
      physicalIndex: index,
      label: source.label,
      R: source.R,
      d,
      nd: source.nd,
      sd: index === L.stopIndex ? wideOpenStopAtZoom(zoomT, L) : source.sd,
      innerSd: null,
      elemId: source.nd === 1 ? 0 : index + 1,
      asphere: source.asphere ?? null,
      diffractive: null,
      interaction: { type: "refract" },
      profile: profileOf(source),
      source,
      z: position,
    });
    z.push(position);
    position += d;
  });
  return {
    lens: {
      key: L.data.key,
      runtime: L,
      stop: { surfaceIndex: L.stopIndex },
      flags: { isZoom: L.isZoom, isFoldedOptics: false },
      projection: { kind: "rectilinear" },
    },
    focusT,
    zoomT,
    surfaces,
    z,
    imagePlane: { point: [0, 0, position], normal: [0, 0, 1] },
    imgZ: position,
    totalTrack: position,
  };
}

export function traceEngineRay2(state: FakeState, input: { origin: number[]; direction: number[] }): unknown {
  return { input, status: "ok", reachedImagePlane: true, terminalSurfaceIndex: state.surfaces.length - 1 };
}

export function traceRay2(y0: number, u0: number): unknown {
  return { pts: [], ghostPts: [], y: y0, u: u0, clipped: false };
}

export function entrancePupilAtState2(stopSD: number): unknown {
  return { epSD: stopSD, yRatio: 1, b: 0, epRatio: 1 };
}

export function fopenAtZoom2(_zoomT: number, L: FakeRuntimeLens): number {
  return L.FOPEN;
}
