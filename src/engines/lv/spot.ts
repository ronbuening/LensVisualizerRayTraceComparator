// `spot.native` as the engine `lv` answers it: LensVisualizer's coma tab and bokeh tab asked as the analysis drawer
// asks them, and their numbers written down as the tabs present them. The point cloud of the coma tab and its two
// fans are LensVisualizer's `computeComaAnalysis`; a bokeh tile is its `computeBokehFieldFootprint`. Nothing of a
// spot is computed here: the comparator reads LensVisualizer's own figures, and states where its chief ray lands.
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import type { SpotNativeData, SpotNativeField, SpotNativeSpec } from "../../contract/quantities/spotNative.ts";
import { decodeNdArray, encodeNdArray, ndRow } from "../../core/numeric/ndarray.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvSpotSetup } from "./spotSetup.ts";
import type { LvSpotSetup } from "./spotSetup.ts";
import type { LvSpotApi } from "./spotRaySets.ts";
import type { LvAnalysisRequest, LvAnalysisSampling, LvApi, LvComaFanResult } from "./types.ts";

/** The LensVisualizer exports a spot is answered with. */
export type LvSpotAnswerApi = LvSpotApi &
  Pick<
    LvApi,
    | "createAnalysisRequest"
    | "computeComaAnalysis"
    | "computeBokehFieldFootprint"
    | "traceSkewRay"
    | "skewImagePlaneIntercept"
  >;

/** What the engine makes of a `spot.native` spec. */
export type LvSpotAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: SpotNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

const FEATURE = "feature";
const OPTION = "option";

/** The method names of the two tabs. */
export const LV_COMA_TAB = "lv-coma-tab";
export const LV_BOKEH_TAB = "lv-bokeh-tab";

/**
 * Whether the case's line `line` is the one the tabs trace: they trace every surface at its authored index `nd`
 * (no chromatic channel), so it is the reference line 0 whose index after every surface is that `nd`, to the bit.
 */
export function tracesAuthored(model: LvCaseModel, line: number): boolean {
  if (line !== 0) return false;
  const table = decodeNdArray(model.exported.conditions.indexAfterSurface);
  const indices = ndRow(table, 0);
  return model.state.surfaces.every((surface, index) => indices[index] === surface.nd);
}

/** Why the tabs cannot answer a spec about a case, before anything is asked of LensVisualizer. */
function refusals(model: LvCaseModel, spec: SpotNativeSpec): UnsupportedItem[] {
  const { conditions, system } = model.exported;
  const refused: UnsupportedItem[] = [];
  if (!tracesAuthored(model, spec.line)) {
    const message =
      "LensVisualizer's coma and bokeh tabs trace every surface at its authored index; the case's line " +
      `${spec.line} has other indices, or is not its reference line`;
    refused.push({ code: FEATURE, item: "lines.not-authored-reference", message });
  }
  if (spec.fields.kind !== "half-field-fractions") {
    const message = "LensVisualizer's tabs draw their fields as fractions of the half field of the state";
    refused.push({ code: OPTION, item: "fields.angles-deg", message });
  }
  if (conditions.object.kind !== "infinity") {
    const message = "LensVisualizer's coma and bokeh tabs launch collimated rays at every focus";
    refused.push({ code: FEATURE, item: "object.finite", message });
  }
  if (system.opticalPath !== undefined) {
    const message = "LensVisualizer hides its coma tab for a folded system";
    refused.push({ code: FEATURE, item: "path.folded", message });
  }
  return refused;
}

/** An unavailable field of an answer, with LensVisualizer's reason. */
function unavailableField(
  field: number,
  reason: string,
  sampling: { readonly [name: string]: number } = {},
): SpotNativeField {
  return {
    field,
    fieldAngleDeg: null,
    imageHeightMm: null,
    status: "unavailable",
    reason,
    spot: null,
    fan: null,
    sampling,
  };
}

/**
 * The analysis request the drawer hands the tabs for the case, restated from AnalysisDrawerContent.tsx with the
 * aperture of the case (`lvSpotSetup`) and the tab's sampling of the request: the prepared state, the two radii, the
 * hook's field geometry, the quality "settled", whose sampling is every family default. `dynamicEFL` is 0, as in
 * `lvMtfInputs`: the coma tab never reads it, and the bokeh tab makes a request of its own with `L.EFL`.
 */
function tabRequest(
  api: LvSpotAnswerApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  sampling: LvAnalysisSampling,
): LvAnalysisRequest {
  return api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: setup.pupilSemiDiameterMm,
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: setup.fieldGeometry,
    sampling,
  });
}

/** The image plane the coma tab lands its rays on, or why the case's is another. */
function designPlaneRefusal(api: LvSpotAnswerApi, model: LvCaseModel, setup: LvSpotSetup): UnsupportedItem | null {
  const geometry = api.computeOffAxisFieldGeometry(model.state, 0, setup.fieldGeometry);
  const planeZ = geometry?.imagePlaneZ ?? model.state.imgZ;
  const imageZ = model.exported.conditions.imageZ;
  if (imageZ === planeZ) return null;
  const message =
    `LensVisualizer's coma tab lands its rays on the design image plane, z = ${planeZ} mm; ` +
    `the case's plane is z = ${imageZ} mm`;
  return { code: FEATURE, item: "focus.off-design", message };
}

/** The coma tab's point cloud at the spec's fractions and rings. */
function comaRings(
  api: LvSpotAnswerApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  fractions: readonly number[],
  rings: readonly number[],
): SpotNativeField[] {
  const request = tabRequest(api, model, setup, { comaFieldFractions: fractions, comaRingSamples: rings });
  const preview = api.computeComaAnalysis(request).pointCloudPreview;
  // computeComaPointCloudPreviewFromContext: `if (usableFields.length < 2) return null;`
  if (preview === null) return fractions.map((fraction) => unavailableField(fraction, "lv-preview-unusable"));
  return fractions.map((fraction, index): SpotNativeField => {
    const field = preview.fields[index];
    const sampling = { raysLaunched: field.sampleCount, raysLanded: field.validSampleCount };
    if (!field.usable) return unavailableField(fraction, "lv-field-unusable", sampling);
    return {
      field: fraction,
      fieldAngleDeg: field.fieldAngleDeg,
      imageHeightMm: Math.abs(field.chiefIntercept),
      status: "ok",
      spot: {
        centroidMm: [field.centroidSagittalImageHeight, field.centroidTangentialImageHeight],
        rmsRadiusMm: field.rmsRadiusMm,
      },
      fan: null,
      sampling,
    };
  });
}

/**
 * Where a bokeh tile's chief ray lands on the plane `sensorZ`, x sagittal and y tangential, restated from bokeh.ts and
 * offAxis.ts, which trace it with the request's skew adapter and intercept it at the tile's plane:
 *
 * ```
 * const trace = adapter.skew(0 * entrancePupilSemiDiameter, geometry.yChief + 0 * entrancePupilSemiDiameter, 0, geometry.uField);
 * const chiefDefocused = skewImagePlaneIntercept(bundle.chiefRay.trace.x, bundle.chiefRay.trace.y, ..., geometry.lastSurfZ, sensorZ);
 * ```
 *
 * `traceSkewRay` is the adapter's launch and trace (`traceSkewRayExactCore` and `bindRayTrace` in rayAdapters.ts,
 * canaried) with the request's stop radius, `ghost` true as `prepareOffAxisTrace` asks, no channel and no aberration.
 * A tier-2 test holds it to the tile's own chief ray on the benchmark. Null where LensVisualizer has none.
 */
export function lvBokehChiefLanding(
  api: LvSpotAnswerApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  fraction: number,
  sensorZ: number,
): { readonly x: number; readonly y: number } | null {
  const { state, runtime } = model;
  const geometry = api.computeOffAxisFieldGeometry(state, fraction, setup.fieldGeometry);
  if (geometry === null || geometry.kind === "vector") return null;
  const epsd = setup.pupilSemiDiameterMm;
  const trace = api.traceSkewRay(
    0 * epsd,
    geometry.yChief + 0 * epsd,
    0,
    geometry.uField,
    state.focusT,
    state.zoomT,
    model.exported.conditions.stopSemiDiameter,
    true,
    runtime,
    0,
  );
  if (trace.clipped) return null;
  return api.skewImagePlaneIntercept(trace.x, trace.y, trace.ux, trace.uy, geometry.lastSurfZ, sensorZ);
}

/** How far from the axis a bokeh tile's chief ray lands (`lvBokehChiefLanding`), or null. */
function bokehChiefLanding(
  api: LvSpotAnswerApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  fraction: number,
  sensorZ: number,
): number | null {
  const landing = lvBokehChiefLanding(api, model, setup, fraction, sensorZ);
  return landing === null ? null : Math.hypot(landing.x, landing.y);
}

/** The bokeh tab's tiles at the spec's fractions, on the image plane of the case. */
function bokehRings(
  api: LvSpotAnswerApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  fractions: readonly number[],
): SpotNativeField[] {
  const request = tabRequest(api, model, setup, {});
  const sensorZ = model.exported.conditions.imageZ;
  return fractions.map((fraction): SpotNativeField => {
    const tile = api.computeBokehFieldFootprint(request, fraction, sensorZ);
    if (tile === null) return unavailableField(fraction, "lv-no-tile");
    const sampling = {
      raysLaunched: tile.totalRays,
      raysLanded: tile.passedRays,
      maxRadiusMm: tile.maxRadiusMm,
      transmission: tile.transmission,
    };
    if (!tile.usable) return unavailableField(fraction, "lv-field-unusable", sampling);
    return {
      field: fraction,
      fieldAngleDeg: tile.fieldAngleDeg,
      imageHeightMm: bokehChiefLanding(api, model, setup, fraction, sensorZ),
      status: "ok",
      spot: { centroidMm: [tile.centroidSagittal, tile.centroidTangential], rmsRadiusMm: tile.rmsRadiusMm },
      fan: null,
      sampling,
    };
  });
}

/** One fan of the coma tab at each fraction of the spec: its detail fan asked at that field. */
function comaFans(
  api: LvSpotAnswerApi,
  model: LvCaseModel,
  setup: LvSpotSetup,
  fractions: readonly number[],
  axis: "tangential" | "sagittal",
  samples: number,
): SpotNativeField[] {
  return fractions.map((fraction): SpotNativeField => {
    const request = tabRequest(api, model, setup, { comaDetailFieldFraction: fraction, comaFanSampleCount: samples });
    const analysis = api.computeComaAnalysis(request);
    const fan: LvComaFanResult | null = axis === "tangential" ? analysis.meridionalComa : analysis.sagittalComa;
    if (fan === null) return unavailableField(fraction, "lv-no-fan");
    const errors = fan.samples.map((sample) => {
      const relative = axis === "tangential" ? sample.relativeImageHeight : sample.relativeImageX;
      return sample.clipped || relative === null || relative === undefined ? Number.NaN : relative;
    });
    // The chief ray of both fans is one; the meridional fan states where it lands along y.
    const chiefY = analysis.meridionalComa?.centerIntercept;
    return {
      field: fraction,
      fieldAngleDeg: fan.fieldAngleDeg,
      imageHeightMm: chiefY === undefined ? null : Math.abs(chiefY),
      status: "ok",
      spot: null,
      fan: {
        pupil: encodeNdArray(Float64Array.from(fan.samples.map((sample) => sample.pupilFraction))),
        errorMm: encodeNdArray(Float64Array.from(errors)),
      },
      sampling: { raysLaunched: fan.sampleCount, raysLanded: fan.validSampleCount },
    };
  });
}

/**
 * LensVisualizer's coma or bokeh tab, asked for a spec about a case.
 *
 * - A rings pattern weighted by `area` is the coma tab's point cloud (`computeComaAnalysis`, its sampling of fields
 *   and rings the spec's); one weighted by `area-transmission` is the bokeh tab's tiles
 *   (`computeBokehFieldFootprint`), which sample only LensVisualizer's own rings. A fan is the coma tab's
 *   meridional (tangential) or sagittal fan, its detail field the spec's field.
 * - The coma tab lands its rays on the design image plane, and answers only a case of that plane; a bokeh tile is
 *   intercepted at the plane of the case, which is its own parameter.
 * - Every figure is LensVisualizer's, relative to its own chief ray; `imageHeightMm` is where that chief ray lands.
 *
 * Unsupported: a line other than the reference line 0 at the authored indices, fields as angles, a finite object, a folded path,
 * a plane other than the design plane for the coma tab, rings of the bokeh tab other than its own.
 */
export function answerLvSpot(api: LvSpotAnswerApi, model: LvCaseModel, spec: SpotNativeSpec): LvSpotAnswer {
  // What the case and the spec decide comes first, before LensVisualizer is asked anything.
  const refused = refusals(model, spec);
  const { pupil } = spec;
  const coma = pupil.kind === "fan" || pupil.weighting === "area";
  if (pupil.kind === "rings" && !coma && pupil.rings.join() !== api.bokehRingSamples.join()) {
    const message =
      `LensVisualizer's bokeh tile samples only its own rings, ${api.bokehRingSamples.join(", ")}; ` +
      `the spec asks ${pupil.rings.join(", ")}`;
    refused.push({ code: OPTION, item: "pupil.rings", message });
  }
  if (refused.length > 0) return { unsupported: refused };
  // Then what only LensVisualizer can say: the design plane of the coma tab.
  const setup = lvSpotSetup(api, model);
  if (coma) {
    const offDesign = designPlaneRefusal(api, model, setup);
    if (offDesign !== null) return { unsupported: [offDesign] };
  }

  const fractions = spec.fields.values;
  const fields =
    pupil.kind === "fan"
      ? comaFans(api, model, setup, fractions, pupil.axis, pupil.samples)
      : coma
        ? comaRings(api, model, setup, fractions, pupil.rings)
        : bokehRings(api, model, setup, fractions);
  const line = model.exported.conditions.lines[0];
  const data: SpotNativeData = {
    pattern: pupil.kind,
    fields,
    method: {
      name: coma ? LV_COMA_TAB : LV_BOKEH_TAB,
      params: {
        pupilSemiDiameterMm: setup.pupilSemiDiameterMm,
        stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter,
      },
    },
    lines: [{ wavelengthNm: line.wavelengthNm, weight: 1 }],
    notes: [
      "LensVisualizer launches a disc of the entrance pupil's radius about the chief ray, on the first vertex plane, collimated along the chief ray's slope",
    ],
  };
  return { data, counts: { fields: fields.length } };
}
