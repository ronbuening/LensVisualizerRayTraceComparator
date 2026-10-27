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
// - within two units in the last place, derived: the physical stop, against twice the case's stop radius (the hook's
//   wide-open radius `(w * FOPEN) / FOPEN` is a product and a quotient, each rounded once: at most 2^-52 of `w`);
// - derived from those, to the bit: the breathing percentage and the telephoto ratio, by the tab's own expressions;
// - two measured margins, held only while LensVisualizer's engine closure and the case are the ones they were measured
//   with (`PINNED_CLOSURE`, `MEASURED_CASES`), so that a lens edit cannot turn this test red; elsewhere they are written
//   down. The current and infinity focal lengths within eight units in the last place of R1's (`-1 / u'` of one ray, or
//   the focal length LensVisualizer stores for the zoom position, against the cardinal construction, which divides by
//   the system matrix's C and subtracts the rear principal point from the rear focal point: measured 7 units at a catalog
//   focus station, the Leica Summilux-C 18 mm's, 2 on the benchmark). The entrance pupil and the "Working f/#" within
//   1e-10 relative of twice R1's `entrancePupilSemiDiameter` and R1's `efl` over it: the hook's pupil is the stop radius
//   over the height at the stop of a real ray 1e-4 mm from the axis, parallel to it, over 1e-4, which departs from the
//   paraxial ray's by terms of the order of (1e-4 / r)^2 of the surfaces' radii r and multiplies an absolute rounding of
//   that height by 1e4; measured at most 3.4e-11 relative (1.4e-11 on the benchmark, 1.6e-10 mm of a diameter), inside
//   R1's own 1e-9 mm gate of the radius.
//
// What R1 does not cover is listed in `NOT_COVERED_BY_R1`; its numbers are written as diagnostics. Then `lv`'s answer is
// held to the tab asked with a request spelled out a second time. Nothing is written. Measured at LV 098c91ef6 (engine
// closure fef2e248).
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

/** The engine closure the margins were measured with (LensVisualizer 098c91ef6). */
const PINNED_CLOSURE = "fef2e248117fc696015fe513b4b2a43f92ccde5bd7381536047ccab3ac3406bd";

/** The first 16 hex digits of the id of each case the margins were measured on, at `PINNED_CLOSURE`. */
const MEASURED_CASES: ReadonlySet<string> = new Set([
  "0403f9a540eed64c",
  "0521f47cf726e1b8",
  "062545109261a889",
  "09377d60ff786893",
  "094c8ed68417c334",
  "0974cc94e4d04caa",
  "0d53a895f4385bf5",
  "0e14dcf45d101f3f",
  "10bbcde40490c2a5",
  "1164cee682861c41",
  "132b9c776877d26b",
  "1477f4fdb398fd9b",
  "162fbfc11fb7a78c",
  "167e686b31a7497c",
  "187718db3b86895a",
  "1f2050f3ba63d376",
  "20ee691a337d6dc6",
  "21482843518999fe",
  "26022f540fbb0f39",
  "2e2afa23bd756f5a",
  "302349c7dd8c39bf",
  "327403ce09e2fc94",
  "32e225863877c36b",
  "344ffcebce2fd7e1",
  "3836e9fa92a4a9bd",
  "39044dfb4336cc45",
  "395bb2a10d84250b",
  "3960852d628118b4",
  "3d3cde4a639dbe26",
  "3e0050bebabe2ef3",
  "42d45f93538e8180",
  "42e0f9ef38bebc0d",
  "43123fa14ee4fbc8",
  "43d293e0d03b0d81",
  "440403e6acb4f563",
  "44edcde6e319adf1",
  "4796c91049d6d85a",
  "484c9d9c9b0574fa",
  "49fed327bafd0359",
  "4bd6eac33e3d5a17",
  "4fb64909817675ac",
  "504e25b011c410bf",
  "5074f7ae6e0a91f3",
  "54a6b4fd4493aa1c",
  "558d181f7fe332e3",
  "595902c51920e15a",
  "5cf10d8c8b6422ed",
  "5ee5d6fc109ea15c",
  "5f620f64d9e31190",
  "60619bd4baf81548",
  "61b10ec1e9b1f97c",
  "62626b3e8f2320cf",
  "65305725fdb42f1b",
  "66c1a2eaf12c6eeb",
  "6c56c2c2c0d95b39",
  "7234624d9e180264",
  "72e4c5b839a2e628",
  "79b9a2dd1a1f4b9e",
  "81be87b898b8d464",
  "84abefd3a467f7e9",
  "8babe67e5197b131",
  "8c21e5ccda69543a",
  "8f0d0bb5ce374c8c",
  "8f1f7d95653af82d",
  "913940f673fca99b",
  "94333a4c6df8cc43",
  "9533eca7053a8bc1",
  "9861b90fd6db9b9f",
  "a3f86b1b281dd0ad",
  "a4833d79d00d382f",
  "a5957b6f15c089d5",
  "a8647fae8029be2b",
  "a878f44443376f43",
  "a89f33e9185b8cf8",
  "ab9c8205a728d127",
  "ac0c53a9e6287256",
  "ac930dee61058699",
  "ad86753053be0d55",
  "af803a345eceb552",
  "afa106a51bdec89d",
  "b1088647562098bf",
  "b29a367787045441",
  "b29ffec9f36b8adf",
  "b5caeb649af604b6",
  "be7f2899b89eed48",
  "bebc9392adca28c3",
  "bf047195927f492d",
  "c0e87372783bbd8a",
  "c1783e5c5de7f829",
  "c2318d538a784c5e",
  "c722c7755ca07f86",
  "c7bd0cc65d8af8e0",
  "c80693a543423dc3",
  "ca355ce3e19a7e6e",
  "ccc14e33b434a6ec",
  "d146abd7b30bd4b6",
  "d444984ee236770b",
  "d5bb8d6ca615f6e5",
  "d6a1a73811dcd0b3",
  "d7cb9811dd23d692",
  "d8b0395277a164fd",
  "db7f14bc7e96feab",
  "de1fd91c6b96ca54",
  "e11ed3cae518f0c7",
  "e30f376ef3f6eb25",
  "e843015bc39fa4c3",
  "eb7807b4cfcfd269",
  "ef02f7b2a5e99dbf",
  "efa493ba8bf49dc6",
  "f0819763fb3976af",
  "f68826b235dcdb9b",
  "fc151b4a7fce9eb6",
  "fcc388dfb0932025",
]);

/** The measured margins: focal lengths in units in the last place, the pupil and the "Working f/#" relative. */
const MARGINS = { focalUnits: 8, pupilRelative: 1e-10 } as const;

/**
 * Each readout of the summary tab that R1 does not judge, and why, then what is presented beside the readouts. Each is
 * recorded by rung R12b where it is a value of `summary.native` (the half field), or in its `sampling` (the focus
 * distance, the "eff. f/"); the controls are the state itself.
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
  "eff. f/":
    "the aperture control's effective f-number, shown beside the mark only where it differs by more than 0.05 and " +
    "showEffectiveAperture is on: a thin-lens estimate of stored pupils, recorded under R12b's sampling",
});

/** The entries of `NOT_COVERED_BY_R1` that are no readout of `computeOpticalSummary`. */
const BESIDE_THE_READOUTS = ["Current Perspective Pose", "eff. f/"];

/** The readouts R1 or the case covers, and how: each is asserted below. */
const COVERED = [
  "currentEFLMm",
  "infinityEFLMm",
  "breathingPercent",
  "effectiveFNumber",
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
    const worst = { focal: 0, stop: 0, pupil: 0, fNumber: 0 };
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
      worst.focal = Math.max(worst.focal, current, infinity);
      // Within two units, derived: the hook's wide-open radius is a product and a quotient, each rounded once.
      const stop = units(summary.physicalStopDiameterMm!, 2 * stopSemiDiameter);
      assert.ok(stop <= 2, `${name}: physical stop ${summary.physicalStopDiameterMm} against ${2 * stopSemiDiameter}`);
      worst.stop = Math.max(worst.stop, stop);
      // Within 1e-10 relative: the hook's pupil of a real ray 1e-4 mm from the axis against the paraxial one.
      const pupil = relative(summary.entrancePupilDiameterMm!, 2 * r1("entrancePupilSemiDiameter"));
      const fNumber = relative(summary.effectiveFNumber!, Math.abs(r1("efl")) / (2 * r1("entrancePupilSemiDiameter")));
      if (pinned) {
        assert.ok(pupil <= MARGINS.pupilRelative, `${name}: entrance pupil ${pupil} relative`);
        assert.ok(fNumber <= MARGINS.pupilRelative, `${name}: Working f/# ${fNumber} relative`);
      }
      worst.pupil = Math.max(worst.pupil, pupil);
      worst.fNumber = Math.max(worst.fNumber, fNumber);
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
        `${worst.focal} units, stop ${worst.stop} unit, pupil ${worst.pupil.toExponential(2)} relative, ` +
        `Working f/# ${worst.fNumber.toExponential(2)} relative`,
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
      // The marked f-number against the tab's "Working f/#", at infinity focus.
      if (model.exported.conditions.object.kind === "infinity") {
        const marked = relative(line.imageSpaceFNumber!, line.nominalFNumber!);
        if (marked > largestMarked.value) largestMarked = { name, value: marked };
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
        `the tab's Working f/# is furthest from the marked f-number at ${largestMarked.name}, ` +
        `${(100 * largestMarked.value).toFixed(2)}%; the focus readout is furthest from the case's object distance ` +
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
      // The hook, as useLensComputation.ts writes it, with the aperture slider at the f-number the run asked: wide open,
      // a number, or the MTF tab's f/8 comparison, which scales the hook's two radii of wide open by fNumber / 8.
      const firstOrderRequest = api.createAnalysisRequest({
        preparedState: api.prepareRuntimeState(runtime, focusT, zoomT, 0),
        dynamicEFL: runtime.EFL as number,
        currentEPSD: (runtime.EP as { epSD: number }).epSD,
        currentPhysStopSD: runtime.stopPhysSD,
      });
      const dynamicEFL = api.computeFocusEFL(firstOrderRequest);
      const fieldGeometry = api.computeAnalysisFieldGeometryAtState(focusT, zoomT, runtime, 0);
      const currentFOPEN = api.fopenAtZoomClamped(zoomT, runtime);
      const wideOpenStopSD = api.wideOpenStopAtZoom(zoomT, runtime);
      const slider = api.fNumberAtStopdown(0, zoomT, runtime);
      const fNumber = aperture?.kind === "f-number" ? aperture.value : slider;
      let currentPhysStopSD = (wideOpenStopSD * currentFOPEN) / fNumber;
      const baseEPSD = api.entrancePupilAtState(wideOpenStopSD, focusT, zoomT, runtime, fieldGeometry, 0).epSD;
      let currentEPSD = (baseEPSD * currentFOPEN) / fNumber;
      let marked = fNumber;
      if (aperture?.kind === "lv-f8-comparison") {
        [currentEPSD, currentPhysStopSD, marked] = [currentEPSD * (slider / 8), currentPhysStopSD * (slider / 8), 8];
      }
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
      const presented: [string, number | null, number | null][] = [
        ["focalLengthMm", line.focalLengthMm, tab.currentEFLMm],
        ["entrancePupilDiameterMm", line.entrancePupilDiameterMm, tab.entrancePupilDiameterMm],
        ["stopDiameterMm", line.stopDiameterMm, tab.physicalStopDiameterMm],
        ["imageSpaceFNumber", line.imageSpaceFNumber, tab.effectiveFNumber],
        ["totalTrackMm", line.totalTrackMm, tab.totalTrackMm],
        ["halfFieldDeg", line.halfFieldDeg, tab.halfFieldDeg],
        ["nominalFNumber", line.nominalFNumber, marked],
        [
          "lvThinLensEffectiveFNumber",
          line.sampling.lvThinLensEffectiveFNumber,
          api.effectiveFNumber(marked, focusT, zoomT, runtime, 0),
        ],
      ];
      // Wide open the case's stop is the hook's state to the bit. Stopped down, the case carries its stop radius and
      // not the slider's f-number, which the engine takes back from the radius by the hook's rule (lvPupilSeed): a
      // product and a quotient, within two units in the last place of the hook's own.
      const wideOpen = aperture === undefined || aperture.kind === "wide-open";
      for (const [value, answered, expected] of presented) {
        if (wideOpen) assert.equal(answered, expected, `${name}: ${value}`);
        else assert.ok(units(answered!, expected!) <= 2, `${name}: ${value} ${answered} against ${expected}`);
      }
      if (wideOpen) exact++;
      assert.equal(stopOf(exported), aperture?.kind === "f-number" ? currentPhysStopSD : stopOf(exported));
      assert.equal(line.workingFNumber, null);
      assert.equal(line.paraxialWorkingFNumber, null);
      assert.equal(line.rearFocalZ, api.computeCardinalElementsFromState(state)!.points.rearFocal.z, name);
    }
    assert.ok(exact > 0);
    t.diagnostic(
      `${binding.fingerprint().commit}: ${states.length} states; ${exact} wide open, every value the tab's to the bit`,
    );
  },
);

/** The case's stop radius. */
function stopOf(opticalCase: OpticalCase): number {
  return opticalCase.conditions.stopSemiDiameter;
}
