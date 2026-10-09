// The committed suites against the real LensVisualizer: every run exports, or reports a coded problem, and each
// lens of the feature suite has the translation path it is there for. Run output goes to a temporary directory.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import type { OpticalCase } from "../../../src/contract/case.ts";
import { deriveFeatures } from "../../../src/contract/features.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { CASES_DIRECTORY, MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import type { LoadedSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { EXPORT_PROBLEM_CODES, LV_GATE_PROBLEM_CODES } from "../../../src/engines/lv/exportProblems.ts";
import { SUITE_NAMES, suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const FAKE_ROOT = fileURLToPath(new URL("../../fixtures/fake-root", import.meta.url));
const KNOWN_CODES: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];

/**
 * The two translation paths the feature suite has no run for, at LV 5278694b, each with the lens that would serve
 * it and the codes of why that lens has no case (docs/gotchas.md). Until LV 5278694b the lens of mixed references
 * was sony-fe-14mm-f18-gm, which has one reference since and exports like any other lens.
 */
const NO_LENS_FOR: Readonly<Record<string, { readonly key: string; readonly codes: readonly string[] }>> = {
  // The one lens that mixes d- and e-referenced glasses lacks wavelength data for some of them.
  "mixed d and e references": { key: "samyang-af-35mm-f2p8-fe", codes: ["mixed-reference"] },
  // Every lens with an annular aperture is a mirror lens.
  "an annular aperture": { key: "nikon-reflex-nikkor-c-500mm-f8", codes: ["folded-path", "non-refract-interaction"] },
};

const loaded = new Map<string, Promise<LoadedSuite>>();
function suiteOf(name: (typeof SUITE_NAMES)[number]): Promise<LoadedSuite> {
  const sources = { lv: createLvCaseSource(LV_PATH) };
  let suite = loaded.get(name);
  if (suite === undefined) loaded.set(name, (suite = loadSuite(suitePath(name), { rootDir: REPO_ROOT, sources })));
  return suite;
}

/** The case of a run of the feature suite. */
async function featureCase(run: string): Promise<OpticalCase> {
  const found = (await suiteOf("features")).runs.find((candidate) => candidate.spec.name === run);
  assert.ok(found?.opticalCase, `features/${run} has no case: ${found?.problems.join("; ")}`);
  return found.opticalCase;
}

test("every committed suite loads, and every run of it exports", { skip }, async () => {
  for (const name of SUITE_NAMES) {
    const suite = await suiteOf(name);
    for (const run of suite.runs) {
      const at = `${name}/${run.spec.name}`;
      assert.ok(run.opticalCase !== null, `${at}: ${run.problems.join("; ")}`);
      assert.deepEqual(run.problems, [], at);
      assert.equal(run.opticalCase.label.lensKey, run.spec.lens.kind === "lv" ? run.spec.lens.key : null, at);
    }
  }
});

test(
  "the two translation paths the feature suite has no run for still have no lens with a case",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const exporter = createLvExporter(binding);
    for (const [path, { key, codes }] of Object.entries(NO_LENS_FOR)) {
      const exported = await exporter.exportLens(key, {});
      const found = exported.ok ? [] : exported.problems.map((problem) => problem.code);
      for (const code of found) assert.ok(KNOWN_CODES.includes(code), `${key}: ${code}`);
      // The day this fails, LensVisualizer can supply the lens: add its run to suites/features.json again.
      assert.deepEqual(found, codes, `${path}: ${key} can be exported now; give the feature suite a run of it`);
    }
    // No other lens serves either path: every lens of the catalog that mixes references, or has an annular
    // aperture, is refused the same way.
    const others: string[] = [];
    for (const { key } of (await binding.catalog()).entries) {
      const runtime = binding.api.buildLens((await binding.lens(key)).data);
      const state = binding.api.prepareRuntimeState(runtime, 0, 0);
      const annular = state.surfaces.some((surface) => (surface.innerSd ?? 0) > 0);
      const gate = binding.api.assessMtfSupport(state, {
        method: "geometric",
        spectrum: "reference",
        pupilSemiDiameterMm: 1,
        stopSemiDiameterMm: 1,
        focus: "design",
      });
      // A lens of mixed references is traced with resolved indices at its reference line, or refused for that.
      const mixed = gate.useResolvedReference || gate.reason === "mixed-reference";
      if (!annular && !mixed) continue;
      if ((await exporter.exportLens(key, {})).ok) others.push(key);
    }
    assert.deepEqual(
      others,
      [],
      "a lens with one of the two paths can be exported: give the feature suite a run of it",
    );
  },
);

test(
  "the benchmark cases are 96 different cases of 24 systems: the lines and the image plane change the conditions only",
  { skip },
  async () => {
    const cases = (await suiteOf("benchmark")).runs.map((run) => run.opticalCase);
    assert.equal(cases.length, 96);
    assert.equal(new Set(cases.map((opticalCase) => opticalCase?.id)).size, 96);
    // A stop radius is the aperture of the stop surface, which is of the system: 12 configurations wide open and 12
    // at the tab's f/8. The lines and the image plane are conditions.
    assert.equal(new Set(cases.map((opticalCase) => opticalCase?.systemId)).size, 24);
    for (let index = 0; index < cases.length; index += 2) {
      const [reference, photopic] = [cases[index], cases[index + 1]];
      assert.ok(reference !== null && photopic !== null);
      assert.equal(reference.systemId, photopic.systemId);
      assert.equal(reference.conditions.lines.length, 1);
      assert.equal(photopic.conditions.lines.length, 5);
      assert.equal(photopic.conditions.lines[0].wavelengthNm, 555);
      // The benchmark is d-referenced throughout.
      assert.deepEqual(reference.conditions.lines[0], { wavelengthNm: 587.5618, weight: 1, indexSource: "authored" });
    }
    // After the 24 runs of the lenses as they open: per configuration, the best focus wide open, the f/8
    // comparison at the design plane, and the f/8 comparison at its own best focus, each on both sets of lines.
    for (let configuration = 0; configuration < 12; configuration++) {
      const [open, openPhotopic] = cases.slice(2 * configuration, 2 * configuration + 2);
      const [best, bestPhotopic, f8, f8Photopic, f8Best, f8BestPhotopic] = cases.slice(
        24 + 6 * configuration,
        30 + 6 * configuration,
      );
      for (const each of [open, openPhotopic, best, bestPhotopic, f8, f8Photopic, f8Best, f8BestPhotopic]) {
        assert.ok(each !== null);
      }
      const at = open?.label.lensKey;
      // The best focus is of a stop and of lines: four different planes, none the design plane, each in front of
      // it or behind it by less than a millimetre.
      const planes = [best, bestPhotopic, f8Best, f8BestPhotopic].map(
        (each) => (each?.conditions.imageZ ?? NaN) - (each?.system.designImageZ ?? NaN),
      );
      assert.equal(new Set(planes).size, 4, `${at}: ${planes.join(", ")}`);
      for (const shift of planes) assert.ok(shift !== 0 && Math.abs(shift) < 1, `${at}: ${shift}`);
      for (const [moved, still] of [
        [best, open],
        [bestPhotopic, openPhotopic],
        [f8Best, f8],
        [f8BestPhotopic, f8Photopic],
      ]) {
        assert.equal(moved?.systemId, still?.systemId, at);
        assert.equal(moved?.conditions.stopSemiDiameter, still?.conditions.stopSemiDiameter, at);
        assert.equal(still?.conditions.imageZ, still?.system.designImageZ, at);
      }
      // The f/8 comparison is another stop in the same lens: a smaller one.
      assert.notEqual(f8?.systemId, open?.systemId, at);
      assert.equal(f8?.systemId, f8Photopic?.systemId, at);
      assert.ok((f8?.conditions.stopSemiDiameter ?? NaN) < (open?.conditions.stopSemiDiameter ?? NaN), at);
    }
  },
);

test("each lens of the feature suite has the translation path it is there for", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  const limits = (opticalCase: OpticalCase) => deriveFeatures(opticalCase.system, opticalCase.conditions).limits;

  const odd = await featureCase("odd-asphere-ref");
  assert.ok(odd.features.includes("surface.asphere.odd"));
  assert.ok(limits(odd)["asphere.maxPower"] % 2 === 1 || odd.features.includes("surface.asphere.even"));

  const eLine = await featureCase("e-line-ref");
  assert.deepEqual(eLine.conditions.lines, [{ wavelengthNm: 546.074, weight: 1, indexSource: "authored" }]);
  const ePhotopic = await featureCase("e-line-photopic");
  assert.deepEqual(
    ePhotopic.conditions.lines.map((line) => [line.wavelengthNm, line.indexSource]),
    [555, 470, 510, 610, 650].map((wavelength) => [wavelength, "anchored"]),
  );

  assert.equal(limits(await featureCase("asphere-a20-ref"))["asphere.maxPower"], 20);

  const flatBase = await featureCase("flat-base-asphere-ref");
  assert.ok(flatBase.features.includes("surface.asphere.flat-base"));
  assert.ok(
    flatBase.system.surfaces.some((surface) => surface.shape.kind === "asphere" && surface.shape.radius === null),
  );

  // The rim of the rear plate is the one the lens file authors, not one LensVisualizer generated.
  const rim = await featureCase("rear-plate-rim-ref");
  const plates = (await binding.lens("nikkor-z-35f18s")).data.rearPlates as { sd?: number }[];
  const plateRims = rim.system.surfaces.filter((surface) => surface.synthetic === "rearPlate");
  assert.equal(plateRims.length, 2 * plates.length);
  plateRims.forEach((surface, index) => {
    const authored = plates[Math.floor(index / 2)].sd;
    assert.ok(authored !== undefined, "the lens authors its plate's semi-diameter");
    assert.equal(surface.aperture.nominalSemiDiameter, authored);
  });

  // A fixed iris keeps its radius over the zoom range, and the widest f-number changes instead.
  // The suite states no position for it, so it is run at both ends: two runs for each run that is written.
  const [wide, tele] = [await featureCase("fixed-iris-zoom-ref-wide"), await featureCase("fixed-iris-zoom-ref-tele")];
  const zoom = binding.api.buildLens((await binding.lens("nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom")).data);
  assert.deepEqual([wide.label.zoomT, tele.label.zoomT], [0, 1]);
  assert.notEqual(wide.systemId, tele.systemId);
  assert.equal(wide.conditions.stopSemiDiameter, tele.conditions.stopSemiDiameter);
  assert.equal((await featureCase("fixed-iris-zoom-photopic-tele")).systemId, tele.systemId);
  assert.equal(tele.conditions.stopSemiDiameter, binding.api.wideOpenStopAtZoom(1, zoom));
  assert.equal(binding.api.wideOpenStopAtZoom(0, zoom), binding.api.wideOpenStopAtZoom(1, zoom));
  assert.ok(binding.api.fopenAtZoom2(1, zoom) > binding.api.fopenAtZoom2(0, zoom));

  // An asphere without a coefficient is the conic it equals, with its conic constant.
  const zero = await featureCase("zero-asphere-ref");
  const state = binding.api.prepareRuntimeState(
    binding.api.buildLens((await binding.lens("kinoptik-tegea-57mm-f18")).data),
    0,
    0,
  );
  const collapsed = state.surfaces.flatMap((surface, index) => (surface.asphere === null ? [] : [index]));
  assert.ok(collapsed.length > 0);
  for (const index of collapsed) {
    const { shape } = zero.system.surfaces[index];
    assert.ok(shape.kind === "conic" && shape.conic === state.surfaces[index].asphere?.K, `surface ${index}`);
  }
  assert.ok(!zero.features.includes("surface.asphere.even"));
  assert.ok(zero.features.includes("surface.conic"));

  // A stop inside an element is a surface with the same glass on both sides.
  const inside = await featureCase("stop-inside-element-ref");
  const { stopIndex, surfaces } = inside.system;
  assert.ok(surfaces[stopIndex].elementId > 0);
  assert.equal(surfaces[stopIndex].elementId, surfaces[stopIndex - 1].elementId);
});

test(
  "lvrtc run builds the cases of the smoke suite from LensVisualizer and records its fingerprint",
  { skip },
  async (t) => {
    const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-smoke-"));
    t.after(() => rmSync(runsDir, { recursive: true, force: true }));
    // On the fixture root's fake engine, which knows no optics and answers the selftest rung, and on the built-in
    // reference engine, which answers R0 and R1 for every one of these cases: each declines what the other offers.
    // The rungs that trace rays are left out: this is about the cases.
    const rungs = ["--rungs", "selftest,r0,r1"];
    const args = [BIN, "run", suitePath("smoke"), "--root", FAKE_ROOT, "--engines", "fake-a,ref", ...rungs];
    const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
    const child = spawnSync(process.execPath, args, { encoding: "utf8", cwd: REPO_ROOT, env });
    assert.equal(child.status, 0, child.stderr);
    assert.match(
      child.stdout,
      /^smoke: 30 jobs: 15 ok, 15 unsupported, 0 error, 0 pending \(15 computed, 0 cached\)$/m,
    );
    // The suite's zoom states no position: it is two runs, one for each end.
    const zoomRuns = ["minolta-af-35-70-f4-ref-wide", "minolta-af-35-70-f4-ref-tele"];
    for (const run of ["carl-zeiss-tessar-50f35-ref", "carl-zeiss-tessar-50f35-photopic", ...zoomRuns]) {
      for (const rung of ["r0", "r1"]) {
        assert.match(child.stdout, new RegExp(`^${run} +${rung} +ref +ok +computed$`, "m"), `${run} ${rung}`);
      }
      assert.match(child.stdout, new RegExp(`^${run} +selftest +fake-a +ok +computed$`, "m"), run);
    }

    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "smoke", MANIFEST_FILE), "utf8"));
    const { commit, dirty, engineClosureHash, engineFileCount } = (await loadLvBinding(LV_PATH)).fingerprint();
    assert.deepEqual(manifest.sources, {
      lv: { fingerprint: { commit, dirty, engineClosureHash, engineFileCount }, status: "unchanged" },
    });
    const suite = await suiteOf("smoke");
    assert.deepEqual(
      manifest.runs.map((run) => [run.name, run.caseId, run.problems]),
      suite.runs.map((run) => [run.spec.name, run.opticalCase?.id, []]),
    );
    assert.deepEqual(
      readdirSync(join(runsDir, "smoke", CASES_DIRECTORY)).sort(),
      suite.runs.map((run) => `${run.opticalCase?.id}.json`).sort(),
    );
    // Nothing of this machine is in the manifest.
    const text = readFileSync(join(runsDir, "smoke", MANIFEST_FILE), "utf8");
    for (const absent of [runsDir, REPO_ROOT, LV_PATH ?? "?"]) assert.ok(!text.includes(absent), absent);
  },
);

test(
  "a committed suite runs at the root of this repository as it is: on lv and ref, on every rung of the ladder",
  { skip },
  (t) => {
    const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-smoke-root-"));
    t.after(() => rmSync(runsDir, { recursive: true, force: true }));
    const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
    const lvrtc = (...args: string[]) =>
      spawnSync(process.execPath, [BIN, ...args], { encoding: "utf8", cwd: REPO_ROOT, env });
    // No --engines and no --rungs: the suite names the built-in engines, and a run gets every rung.
    const ran = lvrtc("run", suitePath("smoke"));
    assert.equal(ran.status, 0, ran.stderr);
    // Five runs, the zoom at both ends, and two engines. Neither answers the conformance quantity, both answer R0
    // and R1; and the runs have 27 ray sets between them (three fields, at one line four times and at five lines
    // once), which each engine traces once, for R2, and R3 finds in the store. The last rung, R4f, is about two
    // engines of its own, lv and the replay of its sampling: one request of each for a run.
    assert.match(
      ran.stdout,
      /^smoke: 148 jobs: 138 ok, 10 unsupported, 0 error, 0 pending \(84 computed, 54 cached\)$/m,
    );
    assert.match(ran.stdout, /^minolta-af-35-70-f4-ref-tele +r4f +replay +ok +computed$/m);
    for (const end of ["wide", "tele"]) {
      assert.match(ran.stdout, new RegExp(`^minolta-af-35-70-f4-ref-${end} +r3 +lv +ok +cached$`, "m"), end);
    }
    const compared = lvrtc("compare", "smoke");
    assert.equal(compared.status, 0, compared.stderr + compared.stdout);
    // At LV ed78cf40 every pair of the smoke suite passes outright: none needs the floor.
    assert.match(
      compared.stdout,
      /^smoke: 148 pairs: 138 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 10 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
    );
    const reported = lvrtc("report", "smoke");
    assert.equal(reported.status, 0, reported.stderr);
    // The manifest states, for each engine, the comparator's own code behind it beside the engine's fingerprint.
    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "smoke", MANIFEST_FILE), "utf8"));
    for (const engine of manifest.engines) {
      assert.ok(engine.status === "available", engine.id);
      assert.match(engine.adapterRevision ?? "", /^[0-9a-f]{64}$/, engine.id);
      assert.notEqual(engine.adapterRevision, engine.fingerprint, engine.id);
    }
    assert.deepEqual(
      manifest.engines.map((engine) => engine.id),
      ["lv", "ref", "replay"],
    );
  },
);
