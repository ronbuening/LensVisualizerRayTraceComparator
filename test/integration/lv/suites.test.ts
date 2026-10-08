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
import { createLvCaseSource } from "../../../src/engines/lv/caseSource.ts";
import { EXPORT_PROBLEM_CODES, LV_GATE_PROBLEM_CODES, problemCode } from "../../../src/engines/lv/exportProblems.ts";
import { SUITE_NAMES, suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const FAKE_ROOT = fileURLToPath(new URL("../../fixtures/fake-root", import.meta.url));
const KNOWN_CODES: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];

/** The runs of the committed suites that have no case, with the codes of why, at LV d36f44b3. */
const NOT_EXPORTABLE: Readonly<Record<string, readonly string[]>> = {
  // The one lens that mixes d- and e-referenced glasses lacks wavelength data for some of them.
  "features/mixed-d-e-ref": ["mixed-reference"],
  // Every lens with an annular aperture is a mirror lens.
  "features/annular-aperture-ref": ["folded-path", "non-refract-interaction"],
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

test("every committed suite loads, and every run exports or reports a coded problem", { skip }, async () => {
  const withoutCase: Record<string, (string | null)[]> = {};
  for (const name of SUITE_NAMES) {
    const suite = await suiteOf(name);
    for (const run of suite.runs) {
      const at = `${name}/${run.spec.name}`;
      if (run.opticalCase !== null) {
        assert.deepEqual(run.problems, [], at);
        assert.equal(run.opticalCase.label.lensKey, run.spec.lens.kind === "lv" ? run.spec.lens.key : null, at);
        continue;
      }
      assert.ok(run.problems.length > 0, at);
      withoutCase[at] = run.problems.map(problemCode);
      for (const code of withoutCase[at]) assert.ok(code !== null && KNOWN_CODES.includes(code), `${at}: ${code}`);
    }
  }
  assert.deepEqual(withoutCase, NOT_EXPORTABLE);
});

test(
  "the benchmark cases are 24 different cases of 12 systems: the lines change the conditions only",
  { skip },
  async () => {
    const cases = (await suiteOf("benchmark")).runs.map((run) => run.opticalCase);
    assert.equal(cases.length, 24);
    assert.equal(new Set(cases.map((opticalCase) => opticalCase?.id)).size, 24);
    assert.equal(new Set(cases.map((opticalCase) => opticalCase?.systemId)).size, 12);
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
  const tele = await featureCase("fixed-iris-zoom-tele-ref");
  const zoom = binding.api.buildLens((await binding.lens("nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom")).data);
  assert.equal(tele.label.zoomT, 1);
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
    const args = [BIN, "run", suitePath("smoke"), "--root", FAKE_ROOT, "--engines", "fake-a,ref"];
    const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
    const child = spawnSync(process.execPath, args, { encoding: "utf8", cwd: REPO_ROOT, env });
    assert.equal(child.status, 0, child.stderr);
    assert.match(child.stdout, /^smoke: 18 jobs: 9 ok, 9 unsupported, 0 error, 0 pending \(9 computed, 0 cached\)$/m);
    for (const run of ["carl-zeiss-tessar-50f35-ref", "carl-zeiss-tessar-50f35-photopic"]) {
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
