// LensVisualizer's summary tab against rung R1, and the engine `lv`'s `summary.native` against the tab. The tab presents
// first-order readouts of the prepared state (`computeOpticalSummary` of the analysis drawer's request); `lv` answers
// `paraxial.first-order` with LensVisualizer's paraxial kernel on the same state (`answerLvFirstOrder`), which R1 judges
// against `ref` and optiland. Held here, on every exported state of the benchmark, states and focus-stations suites on
// the reference line and the design plane (the tab is of the authored indices and of the prepared state's plane):
//
// - to the bit: the cardinal focal length and the back focus (R1's `efl`, `backFocus`), the front focus and the hiatus
//   (the first vertex less R1's `frontFocalZ`, R1's `frontPrincipalZ` less its `rearPrincipalZ`), the image plane and
//   the total track (the case's `imageZ`, less its first vertex): the tab's cardinal construction is the one `lv`'s R1
//   answer assembles, on the same rows;
// - to the bit: the physical stop, against twice the case's stop radius: since LV #933 the hook's stop is the stop rule's
//   at the slider's f-number, which is the case's stop radius itself (wide open the iris, stopped down the same rule);
// - derived from those, to the bit: the breathing percentage and the telephoto ratio, by the tab's own expressions;
// - measured margins, held only while LensVisualizer's engine closure and the case are the ones they were measured
//   with (`PINNED_CLOSURE`, `MEASURED_CASES`), so that a lens edit cannot turn this test red; elsewhere they are written
//   down. The current and infinity focal lengths within `MARGINS` units in the last place of R1's (`-1 / u'` of one
//   ray, or the focal length LensVisualizer stores for the zoom position, against the cardinal construction, which
//   divides by the system matrix's C and subtracts the rear principal point from the rear focal point; measured below
//   `MARGINS`). The entrance pupil, the "Image-space f/#" and,
//   at infinity focus, the "Paraxial working f/#" (LV #933) within `MARGINS` units in the last place of
//   twice R1's `entrancePupilSemiDiameter`, of R1's `efl` over that diameter, and of the same over the image space's
//   index: since #933 the hook's pupil is the stop radius over the paraxial marginal ray's height ratio at the stop, a
//   paraxial quantity as R1's is, so the two differ by roundings of two paraxial traces only.
//
// What R1 does not cover is listed in `NOT_COVERED_BY_R1`; its numbers are written as diagnostics. Then `lv`'s answer is
// held to the tab asked with a request spelled out a second time. Nothing is written. Measured at LV 607ff23ae (engine
// closure f016b35b).
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RunAperture } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { answerLvFirstOrder } from "../../../src/engines/lv/firstOrder.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvSummary, lvSummaryRequest } from "../../../src/engines/lv/summary.ts";
import type { LvOpticalSummary } from "../../../src/engines/lv/types.ts";
import { ulp } from "../../engines/ref/support.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

/** The suites whose states the tab is held at. */
const SUITES = ["benchmark", "states", "focus-stations"] as const;

/** The engine closure the margins were measured with (LensVisualizer 607ff23ae). */
const PINNED_CLOSURE = "f016b35b258be0c4b00df43fdf103384e8fad21a75506213611c42136189f0cf";

/** The first 16 hex digits of the id of each case the margins were measured on at `PINNED_CLOSURE`: 119 at 607ff23ae. */
const MEASURED_CASES: ReadonlySet<string> = new Set([
  "02dd902ccabd7e9e",
  "032904853c0718dd",
  "0659c248d82dbf06",
  "094c8ed68417c334",
  "0c1e3e17b791b8b7",
  "10bff0b1d82d1387",
  "11e8a91c1e7e9666",
  "11fe04d53f56df0f",
  "17d8f3a57a99e178",
  "18b137c95a0dea4a",
  "199c2510c32fa327",
  "1a34a84b12ddaa76",
  "1a94040d1d518dd6",
  "1cf221df7808f788",
  "1ffeed7214f4c219",
  "22198c5be871fa98",
  "22234d65f21f2d91",
  "22f573c4dcca9f77",
  "26022f540fbb0f39",
  "2c3afcd18b34bc40",
  "2d27265e6b0031b0",
  "2e6f278dd2f1ec94",
  "2f48866c86a5c78c",
  "30e4a4eec70f588e",
  "32256a3f62cfc695",
  "3538c790a1ec7344",
  "3a6c0b2f69addb62",
  "40785d2e0c725183",
  "412e617abaf928fc",
  "449063f9188b5228",
  "4c007de74973def2",
  "53c5ca7e688cbf9f",
  "568f93341d119dcc",
  "58eb582de9ad963e",
  "5eb9db0466b9fe71",
  "61751a849d977beb",
  "617deed34e0bc25b",
  "62d4f5600679b10f",
  "650612fe98b240e9",
  "66629bfed7b0cb8a",
  "673095cfc1f5665f",
  "6fcf69c5570573dc",
  "70d5a589da4a7527",
  "72842c3de154ccbb",
  "739496a530c13d6d",
  "73f942b93db286a4",
  "75e87a15390874d2",
  "77240b3249fc2f96",
  "7c3073c4e7dbedf0",
  "7cdedfe0afa1f948",
  "7f0c3394b7c516d1",
  "817dcdb72789e4f1",
  "8270906e01b3faca",
  "827ce23a9b1f784a",
  "83bc7aa668f82b6b",
  "849578276ae0917f",
  "851b25697188fac9",
  "861a915ddd7dd32d",
  "874854625cf1dd58",
  "88fee4e84777e718",
  "894debefc6fdb16f",
  "8b15e190d96badcf",
  "8dd3c38f79512c8e",
  "904ae8663e1e2381",
  "9276015f4a09ae0d",
  "93370aead6b9eb8d",
  "9370a35911029626",
  "9876f2f2d40b0326",
  "998482d4e947545c",
  "99b6b35e6ae7faa9",
  "9aee102182725025",
  "9ff925fa82ee6749",
  "a6a31446c8e77964",
  "a76c758989f346f9",
  "a9fc28dc90bb6ec3",
  "acd7822027052cc1",
  "ae188d3eb305c520",
  "b0be2f20e5b95353",
  "b0f8f5466dfaa4f6",
  "b2e66abb6142cc75",
  "b3794c6c5924cee4",
  "b4a9bef13532c716",
  "b549e5c3c090d253",
  "b57c2bcd2ba8aa92",
  "b67aae200c54706f",
  "baf5883c8fe1fe3b",
  "bb47082c2e9124e5",
  "bbd4687c1f32e281",
  "bdba0ea2e9d167e3",
  "c4cafe389ff19f2b",
  "c7f1b99704f56d90",
  "ca2990fbd67f5671",
  "ca4650a2f1cab812",
  "cd2d5eb4481fbd7b",
  "ce632d6fe72f4ec5",
  "cf90a40810f02e10",
  "cfd2f4b05ff51140",
  "cfdaf3f52ab425d4",
  "cfe08daed58c95d0",
  "d1fd0633e961ca14",
  "d697f32194b1ab48",
  "d6dd88710ac133d1",
  "db455dd71151e3a2",
  "dc0cc7f4f4644e26",
  "e05ac48d6f62767a",
  "e2778a011e81560e",
  "e29835a068866e0e",
  "e3849910ab68459a",
  "e3c1b9c0842d88e4",
  "e44ac8f3c84fa88e",
  "e66d7ce98eb7ba9e",
  "e92c44ff169ec871",
  "ed8aaa73b01961d3",
  "ee0b49410666fe2b",
  "eeb1536ebab03437",
  "f2ba46d7a8b2499a",
  "f3fcc3b63cd7c8c3",
  "fb6313aafaef4cc6",
  "fc71d244aec38864",
]);

/**
 * The measured margins, in units in the last place (at 607ff23ae, on the 119 cases of `MEASURED_CASES`): the focal
 * lengths 16 (measured 15, the Olympus Zuiko Digital ED 7-14 mm, new at 607ff23ae, at its focus station of zoom
 * station 32; 7 at 098c91ef6 on the older cases), the pupil 0 (to the bit), the image-space and paraxial working
 * f-numbers 20 (measured 19 on the same station, and 3 for the paraxial working f-number at infinity).
 */
const MARGINS = { focalUnits: 16, pupilUnits: 0, fNumberUnits: 20 } as const;

/**
 * Each readout of the summary tab that R1 does not judge, and why, then what is presented beside the readouts. Each is
 * recorded by rung R12b where it is a value of `summary.native` (the half field, the working f-number), or in its
 * `sampling` (the focus distance); the controls are the state itself.
 */
export const NOT_COVERED_BY_R1: Readonly<Record<string, string>> = Object.freeze({
  halfFieldDeg:
    "the hook's analysis field geometry (computeAnalysisFieldGeometry): the field whose solved real chief ray lands " +
    "at the image corner, half the stated image circle or the format's diagonal, within 1e-4 mm; the last field " +
    "whose chief ray clears every aperture where one clips it short of the corner; or the projection's authored trace " +
    "field, no larger than the corner's; no engine has the quantity: R9a judges the chief ray at that angle (the " +
    "distortion curve's edge) at every infinity state, and the angle is LensVisualizer's solve",
  fullFieldDeg: "twice halfFieldDeg",
  focusDistanceM:
    "the authored close-focus distance over the focus position, a nominal readout: not the conjugate the case states",
  zoomT: "the state's zoom control, which the case states as it is",
  focusT: "the state's focus control, which the case states as it is",
  aberrationT: "the aberration control, neutral in every case",
  "Current Perspective Pose":
    "the section the tab shows above the readouts where the request's pose is active (a shift or tilt): no case has " +
    "one, and the readouts are of the lens without it",
  workingFNumber:
    "1 / (2 n' sin t') of the real marginal ray aimed at the stop rim (LV #933, computeWorkingFNumber): no first-order " +
    "quantity; R12b records it beside optiland's own get_working_FNO at infinity focus, and at a finite focus, where " +
    "LensVisualizer's object is the paraxial conjugate of the image plane and not the case's, under sampling",
  "paraxial working f/":
    "the aperture control's readout beside the mark (LV #933, the summary's paraxial working f-number), shown only " +
    "where it differs from the mark by more than PARAXIAL_WORKING_NOTE_DIFFERENCE (0.05) and showEffectiveAperture is " +
    "on: the readout of paraxialWorkingFNumber, which is covered",
});

/** The entries of `NOT_COVERED_BY_R1` that are no readout of `computeOpticalSummary`. */
const BESIDE_THE_READOUTS = ["Current Perspective Pose", "paraxial working f/"];

/** The readouts R1 or the case covers, and how: each is asserted below. */
const COVERED = [
  "currentEFLMm",
  "infinityEFLMm",
  "breathingPercent",
  "imageSpaceFNumber",
  "paraxialWorkingFNumber",
  "entrancePupilDiameterMm",
  "physicalStopDiameterMm",
  "imagePlaneZMm",
  "totalTrackMm",
  "telephotoRatio",
  "surfaceCount",
  "rearPlateCount",
  "rearPlateThicknessMm",
  "opticalPath",
  "cardinalEFLMm",
  "bfdMm",
  "ffdMm",
  "principalHiatusMm",
];

/** How far apart two doubles are, in units in the last place of the larger. */
function units(a: number, b: number): number {
  return a === b ? 0 : Math.abs(a - b) / ulp(Math.max(Math.abs(a), Math.abs(b)));
}

/** The relative difference of two numbers. */
function relative(a: number, b: number): number {
  return Math.abs(a - b) / Math.abs(b);
}

/** The value of a first-order answer at its only line. */
function valueOf(data: unknown, name: string): number {
  return decodeNdArray((data as Record<string, Parameters<typeof decodeNdArray>[0]>)[name]).values[0];
}

/** Whether a case is the tab's: the reference line of authored indices, on the prepared state's image plane. */
function isTabCase(opticalCase: OpticalCase, model: LvCaseModel): boolean {
  const { lines, imageZ } = opticalCase.conditions;
  return lines.length === 1 && lines[0].indexSource === "authored" && imageZ === model.state.imgZ;
}

/** One state of the tab: a run's case, rebuilt as LensVisualizer holds it, and the aperture the run asked. */
interface TabState {
  readonly name: string;
  readonly model: LvCaseModel;
  readonly aperture: RunAperture | undefined;
}

/** The tab's states of the three suites: each case once, rebuilt as LensVisualizer holds it. */
async function tabStates(binding: LvBinding): Promise<TabState[]> {
  const build = createLensBuilder(binding);
  const sources = { lv: createLvCaseSource(LV_PATH) };
  const seen = new Set<string>();
  const states: TabState[] = [];
  for (const suiteName of SUITES) {
    const suite = await loadSuite(suitePath(suiteName), { rootDir: REPO_ROOT, sources });
    for (const { spec, opticalCase } of suite.runs) {
      if (opticalCase === null || seen.has(opticalCase.id)) continue;
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      assert.ok(rebuilt.ok, spec.name);
      if (!isTabCase(opticalCase, rebuilt.model)) continue;
      seen.add(opticalCase.id);
      states.push({ name: `${suiteName}/${spec.name}`, model: rebuilt.model, aperture: spec.aperture });
    }
  }
  return states;
}

test(
  "the summary tab's first-order readouts are lv's R1 answer and the case's, at every state of three suites",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const exporter = createLvExporter(binding);
    const build = createLensBuilder(binding);
    const states = await tabStates(binding);
    const pinnedClosure = binding.fingerprint().engineClosureHash === PINNED_CLOSURE;
    const worst = { focal: 0, pupil: 0, fNumber: 0, paraxialWorking: 0 };
    const where = { focal: "", fNumber: "" };
    let held = 0;
    let finite = 0;
    const infinityEfl = new Map<string, number>();
    for (const { name, model } of states) {
      const summary: LvOpticalSummary = api.computeOpticalSummary(lvSummaryRequest(api, model));
      const answer = answerLvFirstOrder(api, model);
      assert.ok(answer.supported, name);
      const r1 = (value: string): number => valueOf(answer.data, value);
      const { exported, state, runtime } = model;
      const z0 = exported.system.surfaces[0].z;
      const { imageZ, stopSemiDiameter } = exported.conditions;
      // To the bit: the tab's cardinal construction is the one lv's R1 answer assembles.
      assert.equal(summary.cardinalEFLMm, r1("efl"), `${name}: cardinal EFL`);
      assert.equal(summary.bfdMm, r1("backFocus"), `${name}: BFD`);
      assert.equal(summary.ffdMm, z0 - r1("frontFocalZ"), `${name}: FFD`);
      assert.equal(summary.principalHiatusMm, r1("frontPrincipalZ") - r1("rearPrincipalZ"), `${name}: hiatus`);
      assert.equal(summary.imagePlaneZMm, imageZ, `${name}: image plane`);
      assert.equal(summary.totalTrackMm, imageZ - z0, `${name}: total track`);
      // A measured margin, held at the pinned closure and case: -1 / u' of one ray, or the stored focal length at
      // infinity, against the cardinal construction.
      const pinned = pinnedClosure && MEASURED_CASES.has(exported.id.slice(0, 16));
      if (pinned) held++;
      const current = units(summary.currentEFLMm!, r1("efl"));
      if (pinned)
        assert.ok(current <= MARGINS.focalUnits, `${name}: current EFL ${summary.currentEFLMm} against ${r1("efl")}`);
      const zoomKey = `${runtime.source.key}@${state.zoomT}`;
      if (!infinityEfl.has(zoomKey)) {
        const infinity = await exporter.exportLens(runtime.source.key, { state: { zoomT: state.zoomT } });
        assert.ok(infinity.ok, zoomKey);
        const rebuilt = await rebuildCase(binding, build, infinity.opticalCase);
        assert.ok(rebuilt.ok, zoomKey);
        const atInfinity = answerLvFirstOrder(api, rebuilt.model);
        assert.ok(atInfinity.supported, zoomKey);
        infinityEfl.set(zoomKey, valueOf(atInfinity.data, "efl"));
      }
      const infinity = units(summary.infinityEFLMm!, infinityEfl.get(zoomKey)!);
      if (pinned) {
        assert.ok(
          infinity <= MARGINS.focalUnits,
          `${name}: infinity EFL ${summary.infinityEFLMm} against ${infinityEfl.get(zoomKey)}`,
        );
      }
      if (Math.max(current, infinity) > worst.focal) where.focal = name;
      worst.focal = Math.max(worst.focal, current, infinity);
      // To the bit: the hook's stop is the stop rule's, which is the case's stop radius (LV #933).
      assert.equal(summary.physicalStopDiameterMm, 2 * stopSemiDiameter, `${name}: physical stop`);
      // A measured margin: the hook's paraxial pupil, and the f-numbers formed of it, against R1's paraxial ones.
      const diameter = 2 * r1("entrancePupilSemiDiameter");
      const pupil = units(summary.entrancePupilDiameterMm!, diameter);
      const fNumber = units(summary.imageSpaceFNumber!, Math.abs(r1("efl")) / diameter);
      if (pinned) {
        assert.ok(pupil <= MARGINS.pupilUnits, `${name}: entrance pupil ${pupil} units`);
        assert.ok(fNumber <= MARGINS.fNumberUnits, `${name}: Image-space f/# ${fNumber} units`);
      }
      worst.pupil = Math.max(worst.pupil, pupil);
      if (fNumber > worst.fNumber) where.fNumber = name;
      worst.fNumber = Math.max(worst.fNumber, fNumber);
      // At infinity focus the paraxial working f-number is the image-space one over the image space's index, the
      // marginal ray being parallel to the axis: R1's efl over its pupil's diameter, which lv states.
      if (exported.conditions.object.kind === "infinity") {
        const indices = decodeNdArray(exported.conditions.indexAfterSurface).values;
        const imageIndex = indices[exported.system.surfaces.length - 1];
        const working = units(summary.paraxialWorkingFNumber!, Math.abs(r1("efl")) / (imageIndex * diameter));
        if (pinned) assert.ok(working <= MARGINS.fNumberUnits, `${name}: Paraxial working f/# ${working} units`);
        worst.paraxialWorking = Math.max(worst.paraxialWorking, working);
      }
      // Derived, to the bit, by the tab's own expressions of the readouts held above.
      const breathing = (100 * (summary.currentEFLMm! - summary.infinityEFLMm!)) / summary.infinityEFLMm!;
      assert.equal(summary.breathingPercent, breathing, `${name}: breathing`);
      assert.equal(summary.telephotoRatio, summary.totalTrackMm! / Math.abs(summary.currentEFLMm!), `${name}: ratio`);
      // The structure of the case: its surfaces, a rear plate being two of them, and a sequential path.
      assert.equal(summary.surfaceCount + 2 * summary.rearPlateCount, exported.system.surfaces.length, name);
      assert.equal(summary.opticalPath, "sequential", name);
      const plates = exported.system.surfaces.filter((surface) => surface.synthetic === "rearPlate");
      const thickness = plates
        .filter((_plate, index) => index % 2 === 0)
        .reduce((sum, plate) => sum + plate.thickness, 0);
      assert.ok(Math.abs(summary.rearPlateThicknessMm - thickness) <= 1e-12, `${name}: plate thickness`);
      if (exported.conditions.object.kind === "finite") finite++;
    }
    assert.ok(states.length >= 100 && finite > 0, `${states.length} states, ${finite} finite`);
    // Every readout is either covered above or listed as not covered.
    const presented = Object.keys(api.computeOpticalSummary(lvSummaryRequest(api, states[0].model))).sort();
    const notCovered = Object.keys(NOT_COVERED_BY_R1).filter((name) => !BESIDE_THE_READOUTS.includes(name));
    assert.deepEqual(presented, [...COVERED, ...notCovered].sort());
    t.diagnostic(
      `${binding.fingerprint().commit}: ${states.length} states (${finite} finite), the margins held on ${held}; worst: focal lengths ` +
        `${worst.focal} units (${where.focal}), pupil ${worst.pupil} units, Image-space f/# ${worst.fNumber} units ` +
        `(${where.fNumber}), Paraxial working f/# at infinity ${worst.paraxialWorking} units`,
    );
  },
);

test(
  "what R1 does not cover: the half field, the focus distance, and the f-numbers LensVisualizer marks",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const states = await tabStates(binding);
    let authoredField = 0;
    // The landing of the solved chief ray at each half field that is not authored, mm to 1e-3: the image corners.
    const landings = new Map<string, number>();
    let largestMarked = { name: "", value: 0 };
    let largestWorking = { name: "", value: 0 };
    let vignettedMarginal = 0;
    let largestFocus = { name: "", value: 0 };
    for (const { name, model } of states) {
      const answer = answerLvSummary(api, model, { lines: [0] });
      assert.ok("data" in answer, name);
      const [line] = answer.data.lines;
      // The tab's half field is the projection's authored trace field where the lens states one.
      const { data } = await binding.lens(model.runtime.source.key);
      const projection = (data as { projection?: { maxTraceFieldDeg?: number; fullFieldDeg?: number } }).projection;
      const authored = projection?.maxTraceFieldDeg ?? (projection?.fullFieldDeg ?? Number.NaN) / 2;
      if (line.halfFieldDeg === authored) authoredField++;
      else {
        const { state, runtime } = model;
        const geometry = api.computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, runtime, 0);
        const landing = api.chiefRayImageHeightAccurateForRuntimeLens(
          line.halfFieldDeg!,
          [...state.z],
          state.focusT,
          state.zoomT,
          runtime,
          geometry,
          0,
        );
        const key = Math.abs(landing).toFixed(3);
        landings.set(key, (landings.get(key) ?? 0) + 1);
      }
      // The marked f-number against the tab's "Image-space f/#", and the real marginal ray's against it, at infinity.
      if (model.exported.conditions.object.kind === "infinity") {
        const marked = relative(line.imageSpaceFNumber!, line.nominalFNumber!);
        if (marked > largestMarked.value) largestMarked = { name, value: marked };
        if (line.workingFNumber !== null) {
          const working = relative(line.workingFNumber, line.imageSpaceFNumber!);
          if (working > largestWorking.value) largestWorking = { name, value: working };
        } else vignettedMarginal++;
      } else {
        // The focus distance readout against the case's object, measured to the image plane, in metres.
        const object = model.exported.conditions.object as { kind: "finite"; z: number };
        const distance = (model.exported.conditions.imageZ - object.z) / 1000;
        const apart = Math.abs(line.sampling.focusDistanceM - distance);
        if (apart > largestFocus.value) largestFocus = { name, value: apart };
      }
    }
    t.diagnostic(
      `${binding.fingerprint().commit}: ${authoredField} of ${states.length} states have the authored half field, ` +
        `the others' chief rays land at ${[...landings].map(([mm, count]) => `${mm} mm (${count})`).join(", ")}; ` +
        `the tab's Image-space f/# is furthest from the marked f-number at ${largestMarked.name}, ` +
        `${(100 * largestMarked.value).toFixed(4)}%; its Working f/# from its Image-space f/# at ${largestWorking.name}, ` +
        `${(100 * largestWorking.value).toFixed(2)}% (${vignettedMarginal} infinity states without one: the marginal ray ` +
        `vignetted, unaimed or not traced); the focus readout is furthest from the case's object distance ` +
        `at ${largestFocus.name}, ${(1000 * largestFocus.value).toFixed(3)} mm`,
    );
  },
);

test(
  "lv's summary.native is the tab asked with a request spelled out again, at every state",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const { api } = binding;
    const states = await tabStates(binding);
    let exact = 0;
    for (const { name, model, aperture } of states) {
      const { state, runtime, exported } = model;
      const { focusT, zoomT } = state;
      // The hook, as useLensComputation.ts writes it (LV #933), with the aperture slider at the f-number the run asked:
      // wide open, a number, or 8 for the MTF tab's f/8 comparison, whose stop is the slider's f/8 to the bit.
      const firstOrderRequest = api.createAnalysisRequest({
        preparedState: api.prepareRuntimeState(runtime, focusT, zoomT, 0),
        dynamicEFL: runtime.EFL as number,
        currentEPSD: (runtime.EP as { epSD: number }).epSD,
        currentPhysStopSD: runtime.stopPhysSD,
      });
      const dynamicEFL = api.computeFocusEFL(firstOrderRequest);
      const fieldGeometry = api.computeAnalysisFieldGeometryAtState(focusT, zoomT, runtime, 0);
      const slider = api.fNumberAtStopdown(0, zoomT, runtime);
      const fNumber =
        aperture?.kind === "f-number" ? aperture.value : aperture?.kind === "lv-f8-comparison" ? 8 : slider;
      const currentPhysStopSD = api.stopSemiDiameterForFNumber(fNumber, zoomT, runtime);
      const currentEPSD = api.entrancePupilAtState(currentPhysStopSD, focusT, zoomT, runtime, fieldGeometry, 0).epSD;
      const marked = fNumber;
      // The drawer, as AnalysisDrawerContent.tsx writes it, settled.
      const request = api.createAnalysisRequest({
        preparedState: state,
        dynamicEFL,
        currentEPSD,
        currentPhysStopSD,
        fieldGeometry,
      });
      const tab = api.computeOpticalSummary(request);
      const answer = answerLvSummary(api, model, { lines: [0] });
      assert.ok("data" in answer, name);
      const [line] = answer.data.lines;
      const atInfinity = exported.conditions.object.kind === "infinity";
      const traced = tab.workingFNumber.status === "traced" ? tab.workingFNumber.value : null;
      const presented: [string, number | null, number | null][] = [
        ["focalLengthMm", line.focalLengthMm, tab.currentEFLMm],
        ["entrancePupilDiameterMm", line.entrancePupilDiameterMm, tab.entrancePupilDiameterMm],
        ["stopDiameterMm", line.stopDiameterMm, tab.physicalStopDiameterMm],
        ["imageSpaceFNumber", line.imageSpaceFNumber, tab.imageSpaceFNumber],
        ["paraxialWorkingFNumber", line.paraxialWorkingFNumber, atInfinity ? tab.paraxialWorkingFNumber : null],
        ["workingFNumber", line.workingFNumber, atInfinity ? traced : null],
        ["totalTrackMm", line.totalTrackMm, tab.totalTrackMm],
        ["halfFieldDeg", line.halfFieldDeg, tab.halfFieldDeg],
      ];
      // The case's stop is the hook's to the bit, wide open and stopped down (LV #933): every value is the tab's.
      for (const [value, answered, expected] of presented) assert.equal(answered, expected, `${name}: ${value}`);
      if (!atInfinity) {
        assert.equal(line.sampling.lvParaxialWorkingFNumberAtParaxialObject, tab.paraxialWorkingFNumber, name);
        if (traced !== null) assert.equal(line.sampling.lvWorkingFNumberAtParaxialObject, traced, name);
      }
      // The mark: the slider's own wide open, and otherwise the rule's f-number taken back from the stop radius.
      const wideOpen = aperture === undefined || aperture.kind === "wide-open";
      if (wideOpen) assert.equal(line.nominalFNumber, marked, `${name}: nominalFNumber`);
      else assert.ok(units(line.nominalFNumber!, marked) <= 4, `${name}: nominalFNumber ${line.nominalFNumber}`);
      exact++;
      assert.equal(stopOf(exported), currentPhysStopSD, name);
      assert.ok(!("lvThinLensEffectiveFNumber" in line.sampling), name);
      assert.equal(line.rearFocalZ, api.computeCardinalElementsFromState(state)!.points.rearFocal.z, name);
    }
    assert.ok(exact > 0);
    t.diagnostic(
      `${binding.fingerprint().commit}: ${states.length} states; every value the tab's to the bit on ${exact}`,
    );
  },
);

/** The case's stop radius. */
function stopOf(opticalCase: OpticalCase): number {
  return opticalCase.conditions.stopSemiDiameter;
}
