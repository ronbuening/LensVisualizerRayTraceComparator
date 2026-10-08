// The reference engine against the real LensVisualizer, on LensVisualizer's own lenses: its sag against the sag
// LV's surface profiles evaluate, by the comparator and the tolerance of rung R0, and its cardinal points against
// LV's first-order module and its pupils against LV's paraxial kernel, by the tolerance of rung R1. The engine
// `lv` that answers both quantities for itself is a later stage; here LV's own functions are called directly, so
// that `ref` is held to another implementation on real prescriptions before it arbitrates anything.
//
// The numbers quoted in comments were measured at LV commit d36f44b3 with the catalog of that commit.
import assert from "node:assert/strict";
import { test } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { systemDescribeComparator } from "../../../src/compare/systemDescribe.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import { FIRST_ORDER_VALUES } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import { DEFAULT_SAG_FRACTIONS } from "../../../src/contract/quantities/systemDescribe.ts";
import type { SystemDescribeData } from "../../../src/contract/quantities/systemDescribe.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { describeSystem } from "../../../src/engines/ref/describe.ts";
import { answerFirstOrder } from "../../../src/engines/ref/firstOrder.ts";
import { buildRefSystem } from "../../../src/engines/ref/model.ts";
import { systemDescribeQuantity } from "../../../src/quantities/systemDescribe.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const POLICY = loadPolicy();

/** The state LensVisualizer prepares for the zoom and focus position a case was exported at. */
async function preparedFor(binding: LvBinding, opticalCase: OpticalCase) {
  const key = opticalCase.label.lensKey;
  assert.ok(key !== undefined);
  const runtime = binding.api.buildLens((await binding.lens(key)).data);
  return binding.api.prepareRuntimeState(runtime, opticalCase.label.focusT ?? 0, opticalCase.label.zoomT ?? 0);
}

test(
  "on every exported lens, ref's sag is the sag of LensVisualizer's own profile, within the tolerance of R0",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const exporter = createLvExporter(binding);
    const tolerance = POLICY.rungs.r0.metrics["sag.maxScaled"].tolerance;
    assert.equal(tolerance, 1e-12);

    const worst = { scaled: 0, scaledAt: "", abs: 0, absAt: "" };
    const overPlainGate = new Set<string>();
    let lenses = 0;
    let surfaces = 0;
    for (const { key } of (await binding.catalog()).entries) {
      const result = await exporter.exportLens(key, {});
      if (!result.ok) continue;
      lenses++;
      const { opticalCase } = result;
      const state = await preparedFor(binding, opticalCase);
      const mine = describeSystem(buildRefSystem(opticalCase), DEFAULT_SAG_FRACTIONS);
      assert.deepEqual(systemDescribeQuantity.validateData(mine), [], key);
      surfaces += mine.surfaceCount;

      // LensVisualizer's answer to the same question: its own profile, asked at the same radii.
      const radii = decodeNdArray(mine.sagRadii).values as Float64Array;
      const samples = DEFAULT_SAG_FRACTIONS.length;
      const theirs: SystemDescribeData = {
        ...mine,
        sag: encodeNdArray(
          Float64Array.from(radii, (r, element) => state.surfaces[Math.floor(element / samples)].profile.sag(r) + 0),
          [mine.surfaceCount, samples],
        ),
      };
      const outcome = systemDescribeComparator.compare(mine, theirs);
      assert.ok(outcome.comparable, key);
      const metrics = Object.fromEntries(outcome.metrics.map((metric) => [metric.name, metric]));
      const [scaled, abs] = [metrics["sag.maxScaled"], metrics["sag.maxAbs"]];
      // A NaN here would be a sag that one of the two has and the other has not.
      assert.ok(scaled.value <= tolerance, `${key}: sag.maxScaled ${scaled.value} at ${JSON.stringify(scaled.where)}`);
      if (scaled.value > worst.scaled) Object.assign(worst, { scaled: scaled.value, scaledAt: key });
      if (abs.value > worst.abs) Object.assign(worst, { abs: abs.value, absAt: key });
      if (abs.value > 1e-12) overPlainGate.add(key);
    }
    t.diagnostic(
      `${lenses} lenses, ${surfaces} surfaces at ${DEFAULT_SAG_FRACTIONS.length} radii: largest scaled difference ` +
        `${worst.scaled} (${worst.scaledAt}); largest difference ${worst.abs} mm (${worst.absAt}); ` +
        `${overPlainGate.size} lenses differ by more than 1e-12 mm: ${[...overPlainGate].sort().join(", ")}`,
    );
    assert.ok(lenses > 800, `about 870 lenses export, found ${lenses}`);

    // At d36f44b3: 868 lenses, 18 678 surfaces. The largest scaled difference is 5.5e-16, a few units of rounding,
    // so the tolerance of 1e-12 has three orders of magnitude to spare.
    assert.ok(worst.scaled < 1e-14, `the scaled difference is rounding: ${worst.scaled} on ${worst.scaledAt}`);
    // The plain difference is not: 1.3e-10 mm on russar-22-70f8, whose second surface ends 1e-10 short of a
    // hemisphere's rim in the root, and up to 8e-12 mm on four Fujifilm lenses whose terms of 1e4 to 1e5 mm cancel
    // to a sag of a millimetre. A gate of 1e-12 mm on it would fail five lenses that two correct engines agree on.
    assert.ok(worst.abs > 1e-12 && worst.abs < 1e-9, `${worst.abs} mm on ${worst.absAt}`);
    assert.ok(overPlainGate.size >= 1 && overPlainGate.size < 20, String(overPlainGate.size));
  },
);

test(
  "on every exported lens and on the suites, ref's cardinal points are those of LensVisualizer's first-order module",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const tolerance = POLICY.rungs.r1.metrics["firstOrder.maxAbs"].tolerance;
    assert.equal(tolerance, 1e-9);

    const worst = { value: 0, at: "" };
    let compared = 0;
    /** Holds ref's answer about a case to LensVisualizer's own, for the state the case was exported at. */
    const hold = async (at: string, opticalCase: OpticalCase): Promise<void> => {
      // LensVisualizer's module reads each surface's authored index: the reference line of a case that has one.
      if (opticalCase.conditions.lines[0].indexSource !== "authored") return;
      const theirs = binding.api.computeCardinalElements2(await preparedFor(binding, opticalCase));
      assert.ok(theirs !== null, at);
      const answer = answerFirstOrder(buildRefSystem(opticalCase));
      assert.ok(answer.supported, `${at}: ${JSON.stringify(answer)}`);
      const mine = Object.fromEntries(
        FIRST_ORDER_VALUES.map((value) => [value, (decodeNdArray(answer.data[value]).values as Float64Array)[0]]),
      );
      // Every pupil of every lens is somewhere: no telecentric system among them, and no NaN.
      for (const value of FIRST_ORDER_VALUES) assert.ok(Number.isFinite(mine[value]), `${at}: ${value}`);
      const pairs: [quantity: string, mine: number, theirs: number][] = [
        ["efl", mine.efl, theirs.distances.efl.valueMm],
        ["backFocus", mine.backFocus, theirs.distances.bfd.valueMm],
        ["frontFocalZ", mine.frontFocalZ, theirs.points.frontFocal.z],
        ["rearFocalZ", mine.rearFocalZ, theirs.points.rearFocal.z],
        ["frontPrincipalZ", mine.frontPrincipalZ, theirs.points.frontPrincipal.z],
        ["rearPrincipalZ", mine.rearPrincipalZ, theirs.points.rearPrincipal.z],
      ];
      for (const [quantity, one, other] of pairs) {
        const difference = Math.abs(one - other);
        assert.ok(difference <= tolerance, `${at}: ${quantity} ${one} against LensVisualizer's ${other}`);
        if (difference > worst.value) Object.assign(worst, { value: difference, at: `${at} ${quantity}` });
      }
      compared++;
    };

    // Every lens that exports, at its default state.
    const exporter = createLvExporter(binding);
    for (const { key } of (await binding.catalog()).entries) {
      const result = await exporter.exportLens(key, {});
      if (result.ok) await hold(key, result.opticalCase);
    }
    const lenses = compared;
    // The runs of the two suites, which add the other end of a zoom and the lenses picked for a feature.
    const sources = { lv: createLvCaseSource(LV_PATH) };
    for (const name of ["benchmark", "features"] as const) {
      const suite = await loadSuite(suitePath(name), { rootDir: REPO_ROOT, sources });
      for (const { spec, opticalCase } of suite.runs) {
        if (opticalCase !== null) await hold(`${name}/${spec.name}`, opticalCase);
      }
    }
    t.diagnostic(
      `${lenses} lenses and ${compared - lenses} runs of the suites: largest difference ${worst.value} mm (${worst.at})`,
    );
    assert.ok(lenses > 800, String(lenses));
    assert.ok(compared - lenses >= 20, String(compared - lenses));
    // At d36f44b3, over 868 lenses and 20 runs, the largest difference is 1.1e-11 mm, on the front focal point of
    // sony-fe-400-800-f63-8-g-oss, which lies 1565 mm in front of the lens: 7e-15 of it, two matrix products in
    // another order. On the suites alone it is 2.7e-13 mm. The tolerance of 1e-9 mm has two orders to spare.
    assert.ok(worst.value < 1e-10, `${worst.value} mm on ${worst.at}`);
  },
);

test(
  "on every exported lens and at every line, ref's pupils are those of LensVisualizer's paraxial kernel",
  { skip },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const exporter = createLvExporter(binding);
    const trace = binding.api.traceParaxialSurfaces2;
    const tolerance = POLICY.rungs.r1.metrics["firstOrder.maxAbs"].tolerance;
    assert.equal(tolerance, 1e-9);

    const worst = { entrance: 0, entranceAt: "", exit: 0, exitAt: "" };
    const overPlainGate = new Map<string, number>();
    let compared = 0;
    for (const { key } of (await binding.catalog()).entries) {
      // The reference line reads the authored indices and the photopic lines the anchored ones: both index sources.
      for (const lines of [{ kind: "reference" }, { kind: "photopic" }] as const) {
        const result = await exporter.exportLens(key, { lines });
        if (!result.ok) continue;
        const { opticalCase } = result;
        const state = await preparedFor(binding, opticalCase);
        const answer = answerFirstOrder(buildRefSystem(opticalCase));
        assert.ok(answer.supported, `${key}: ${JSON.stringify(answer)}`);
        const table = decodeNdArray(opticalCase.conditions.indexAfterSurface).values as Float64Array;
        const count = state.surfaces.length;
        const stop = state.lens.stop.surfaceIndex;
        const stopRadius = opticalCase.conditions.stopSemiDiameter;

        opticalCase.conditions.lines.forEach((_line, line) => {
          const at = `${key} ${lines.kind} line ${line}`;
          // LensVisualizer's kernel on its own radii and gaps, with the indices of this line.
          const rows = state.surfaces.map(({ R, d }, index) => ({ R, d, nd: table[line * count + index] }));

          // The entrance pupil, by two rays from the first vertex plane to the stop's plane: one that enters at
          // height 1 along the axis and one that enters on the axis with the angle 1. The plane of the object
          // space from which every ray reaches one point of the stop is where their heights there cancel.
          const [height, angle] =
            stop === 0 ? [1, 0] : [trace(rows, 1, 0, { stopAt: stop }).y, trace(rows, 0, 1, { stopAt: stop }).y];
          const entranceZ = state.z[0] + angle / height;
          const entranceRadius = stopRadius / Math.abs(height);

          // The exit pupil, by a ray that leaves the centre of the stop: it crosses the axis again where the stop
          // is imaged, and the image of the stop is as much larger as the ray's reduced angle is smaller. The
          // kernel starts in air, so a plane in front, followed by the stop's own medium, puts the ray into that
          // medium with its reduced angle unchanged; the stop surface's own refraction moves no image of it.
          const behind = [{ R: Infinity, d: rows[stop].d, nd: rows[stop].nd }, ...rows.slice(stop + 1)];
          const chief = trace(behind, 0, 1, { skipLastTransfer: true });
          const exitZ = state.z[count - 1] - chief.y / chief.u;
          const exitRadius = stopRadius / Math.abs(rows[count - 1].nd * chief.u);

          const mine = (value: (typeof FIRST_ORDER_VALUES)[number]): number =>
            (decodeNdArray(answer.data[value]).values as Float64Array)[line];
          const pairs: [value: (typeof FIRST_ORDER_VALUES)[number], theirs: number][] = [
            ["entrancePupilZ", entranceZ],
            ["entrancePupilSemiDiameter", entranceRadius],
            ["exitPupilZ", exitZ],
            ["exitPupilSemiDiameter", exitRadius],
          ];
          for (const [value, theirs] of pairs) {
            assert.ok(Number.isFinite(theirs) && Number.isFinite(mine(value)), `${at}: ${value} is not finite`);
            const difference = Math.abs(mine(value) - theirs);
            // The tolerance of R1 up to a metre away, and that part of the distance beyond: a pupil ten metres
            // off is the quotient of a number near 1 and one near 0.001, and no arithmetic places it to 1e-9 mm.
            const allowed = tolerance * Math.max(1, Math.abs(theirs) / 1000);
            assert.ok(difference <= allowed, `${at}: ${value} ${mine(value)} against LensVisualizer's ${theirs}`);
            if (difference > tolerance) overPlainGate.set(key, Math.max(difference, overPlainGate.get(key) ?? 0));
            const side = value.startsWith("entrance") ? "entrance" : "exit";
            if (difference > worst[side]) Object.assign(worst, { [side]: difference, [`${side}At`]: `${at} ${value}` });
          }
          compared++;
        });
      }
    }
    t.diagnostic(
      `${compared} lines of lenses: largest difference of an entrance pupil ${worst.entrance} mm ` +
        `(${worst.entranceAt}), of an exit pupil ${worst.exit} mm (${worst.exitAt}); above ${tolerance} mm: ` +
        ([...overPlainGate].map(([key, difference]) => `${key} (${difference} mm)`).join(", ") || "none"),
    );
    assert.ok(compared > 4000, `about 4900 lines export, found ${compared}`);

    // At d36f44b3, over 4908 lines of 868 lenses: the entrance pupils agree within 3.9e-12 mm, and the exit pupils
    // of every lens but one within 1.9e-11 mm. That one, viltrox-af-75mm-f12-pro, is nearly telecentric: its exit
    // pupil lies 7.7 m behind the first vertex at the d line and, at the photopic lines, anywhere from 1.4 m to
    // 20 m behind it and 14 m in front of it. There the two differ by 1.1e-9 mm at the d line and by up to
    // 3.0e-9 mm at a photopic one: 2e-13 of the distance, and above the plain tolerance of R1. So an engine that
    // places its pupils with LensVisualizer's kernel fails R1 against `ref` on this lens by rounding alone.
    assert.ok(worst.entrance < 1e-10, `${worst.entrance} mm on ${worst.entranceAt}`);
    assert.ok(worst.exit < 1e-7, `${worst.exit} mm on ${worst.exitAt}`);
    assert.ok(overPlainGate.size < 10, `only a nearly telecentric lens is that far off: ${[...overPlainGate.keys()]}`);
  },
);
