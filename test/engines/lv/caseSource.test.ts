// The LensVisualizer case source against the fake LV tree: the binding, the exporter and the suite seam together,
// with no LensVisualizer. The fake's numbers describe no real lens.
import assert from "node:assert/strict";
import { appendFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { pathToFileURL } from "node:url";

import { caseInvariantProblems, verifyCaseIdentity } from "../../../src/contract/case.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RunOptions, RunSpec } from "../../../src/contract/runSpec.ts";
import { validateKind } from "../../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { SOURCE_CHANGED } from "../../../src/core/manifest.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { runSuite } from "../../../src/core/orchestrator.ts";
import { createFixtureCaseSource, loadSuite } from "../../../src/core/suite.ts";
import type { CaseResolution } from "../../../src/core/suite.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { problemCode } from "../../../src/engines/lv/exportProblems.ts";
import { fakeEngine, tempDir, watchedRegistry } from "../../core/support.ts";
import { FAKE_ENGINE_FILES, FAKE_LENS_FILES, bind, closureOf, fileHash, freshLv } from "./support.ts";

const [SINGLET_FILE, ZOOM_FILE] = FAKE_LENS_FILES.map(([file]) => file);

/** A run of one LensVisualizer lens. */
function run(key: string, options: RunOptions = {}): RunSpec {
  return { contract: CONTRACT_VERSION, kind: "run-spec", name: "a-run", lens: { kind: "lv", key }, ...options };
}

function caseOf(resolution: CaseResolution): OpticalCase {
  assert.ok(resolution.ok, JSON.stringify(resolution));
  return resolution.opticalCase;
}

function problemsOf(resolution: CaseResolution): readonly string[] {
  assert.ok(!resolution.ok, "expected problems");
  return resolution.problems;
}

/** A suite file of the given runs, in a temporary directory. */
function suiteFile(t: TestContext, runs: readonly unknown[]): { rootDir: string; file: string } {
  const rootDir = tempDir(t);
  const file = join(rootDir, "suite.json");
  writeFileSync(file, JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name: "lv-suite", runs }));
  return { rootDir, file };
}

// ── Cases ────────────────────────────────────────────────────────────────────────────────────────────────────────

test("a lens key becomes the case of that lens, with the lens file and the checkout in its provenance", async (t) => {
  const lv = freshLv(t);
  const source = createLvCaseSource(lv);
  const opticalCase = caseOf(await source.resolve(run("acme-singlet-50")));
  assert.deepEqual(validateKind("optical-case", opticalCase), []);
  assert.deepEqual(caseInvariantProblems(opticalCase.system, opticalCase.conditions), []);
  assert.deepEqual(verifyCaseIdentity(opticalCase), []);
  assert.ok(Object.isFrozen(opticalCase));

  assert.deepEqual(opticalCase.label, { name: "ACME Singlet 50mm f/4", lensKey: "acme-singlet-50", focusT: 0 });
  assert.deepEqual(
    opticalCase.system.surfaces.map(({ label, z, thickness, shape }) => [label, z, thickness, shape.kind]),
    [
      ["1", 0, 4, "conic"],
      ["2", 4, 1, "conic"],
      ["STO", 5, 47.5, "plane"],
    ],
  );
  assert.equal(opticalCase.system.stopIndex, 2);
  assert.equal(opticalCase.system.lastLensSurfaceIndex, 2);
  assert.equal(opticalCase.system.designImageZ, 52.5);
  assert.equal(opticalCase.conditions.stopSemiDiameter, 6.25);
  assert.deepEqual([...decodeNdArray(opticalCase.conditions.indexAfterSurface).values], [1.5, 1, 1]);
  assert.deepEqual(opticalCase.provenance.source, {
    kind: "lv-lens",
    lensKey: "acme-singlet-50",
    file: SINGLET_FILE,
    fileSha256: fileHash(lv, SINGLET_FILE),
  });
  // A temporary directory is under no git repository.
  assert.deepEqual(opticalCase.provenance.lv, {
    commit: null,
    dirty: null,
    closureHash: closureOf(lv, FAKE_ENGINE_FILES),
  });
});

test("the run's state, aperture, lines and image plane reach the case", async (t) => {
  const source = createLvCaseSource(freshLv(t));
  const options: RunOptions = {
    state: { zoomT: 1 },
    aperture: { kind: "f-number", value: 8 },
    lines: { kind: "photopic" },
    imagePlane: { kind: "shift", mm: 0.25 },
  };
  const opticalCase = caseOf(await source.resolve(run("acme-zoom-24-48", options)));
  const { system, conditions } = opticalCase;
  assert.deepEqual(opticalCase.label, {
    name: "ACME Zoom 24-48mm f/4",
    lensKey: "acme-zoom-24-48",
    zoomT: 1,
    focusT: 0,
  });
  // The fake zoom opens its first gap by 10 mm and its iris from 3 to 6 mm between the ends.
  assert.equal(system.surfaces[0].thickness, 13);
  assert.equal(system.surfaces[2].label, "STO");
  assert.equal(conditions.stopSemiDiameter, (6 * 4) / 8);
  assert.equal(system.surfaces[2].aperture.nominalSemiDiameter, 3);
  assert.equal(conditions.imageZ, system.designImageZ + 0.25);
  assert.equal(conditions.lines.length, 5);
  assert.deepEqual(
    system.surfaces.map((surface) => surface.synthetic ?? null),
    [null, null, null, null, null, "rearPlate", "rearPlate"],
  );
  assert.equal(system.lastLensSurfaceIndex, 4);
  assert.deepEqual(system.surfaces[1].shape, {
    kind: "asphere",
    radius: -80,
    conic: -1,
    terms: [{ power: 4, coeff: 1e-6 }],
  });
  assert.deepEqual(opticalCase.features, ["lines.multiple", "surface.asphere.even", "surface.conic"]);

  // The same lens at the other end is another system; wide open its stop is the prepared one.
  const wide = caseOf(await source.resolve(run("acme-zoom-24-48")));
  assert.equal(wide.conditions.stopSemiDiameter, 3);
  assert.notEqual(wide.systemId, opticalCase.systemId);
});

test("a certified focus station is a finite object; any other focus position is a coded problem", async (t) => {
  const source = createLvCaseSource(freshLv(t));
  const closest = caseOf(
    await source.resolve(run("acme-singlet-50", { state: { focus: { kind: "focusT", value: 1 } } })),
  );
  assert.deepEqual(closest.conditions.object, { kind: "finite", z: -500 });
  assert.equal(closest.system.designImageZ, 57.5);
  assert.deepEqual(closest.features, ["object.finite"]);

  const between = await source.resolve(run("acme-singlet-50", { state: { focus: { kind: "focusT", value: 0.5 } } }));
  assert.deepEqual(problemsOf(between).map(problemCode), ["finite-conjugate-unavailable"]);
  // Focus position 0 is infinity focus, however it is asked for.
  const atZero = caseOf(
    await source.resolve(run("acme-singlet-50", { state: { focus: { kind: "focusT", value: 0 } } })),
  );
  assert.equal(atZero.id, caseOf(await source.resolve(run("acme-singlet-50"))).id);
});

test("every way a lens has no case is a problem of its run, as <code>: <message>, and never a rejection", async (t) => {
  const lv = freshLv(t);
  mkdirSync(join(lv, "src/lens-data/broken"));
  writeFileSync(
    join(lv, "src/lens-data/broken/NoStop.data.ts"),
    'export default { key: "no-stop", name: "No stop", surfaces: [{ label: "1", R: 50, d: 4, nd: 1.5, sd: 8 }] };\n',
  );
  const source = createLvCaseSource(lv);
  assert.deepEqual(problemsOf(await source.resolve(run("acme-singlet"))), [
    'unknown-lens: unknown lens "acme-singlet"; did you mean acme-singlet-50?',
  ]);
  assert.deepEqual(problemsOf(await source.resolve(run("no-stop"))), [
    "lens-build-failed: LensVisualizer cannot build the lens: no-stop: no STO surface",
  ]);
  assert.deepEqual(problemsOf(await source.resolve(run("zenith-doublet-100", { lines: { kind: "photopic" } }))), [
    "spectral-data-unavailable: Spectral MTF is unavailable because a glass has no Abbe number.",
  ]);
  const both = await source.resolve(
    run("acme-zoom-24-48", { aperture: { kind: "f-number", value: 2 }, imagePlane: { kind: "lv-best-axial" } }),
  );
  assert.deepEqual(problemsOf(both).map(problemCode), [
    "aperture-faster-than-wide-open",
    "lv-best-axial-needs-mtf-recipe",
  ]);
  // The lens that has no spectral data still has its reference line.
  assert.equal((await source.resolve(run("zenith-doublet-100"))).ok, true);
  const fixture: RunSpec = { ...run("x"), lens: { kind: "fixture", path: "a.json" } };
  assert.deepEqual(problemsOf(await source.resolve(fixture)), [
    'a lens of kind "fixture" is not a LensVisualizer lens',
  ]);
});

test("a LensVisualizer that cannot be loaded is the problem of every run, with a code and no path", async (t) => {
  const unconfigured = createLvCaseSource(null);
  const expected =
    "lv-not-configured: LensVisualizer is not configured: set lvPath in lvrtc.local.json or LVRTC_LV_PATH";
  assert.deepEqual(problemsOf(await unconfigured.resolve(run("acme-singlet-50"))), [expected]);
  assert.deepEqual(problemsOf(await unconfigured.resolve(run("acme-zoom-24-48"))), [expected]);
  assert.equal(unconfigured.audit(), null);

  const lv = freshLv(t);
  const missing = createLvCaseSource(join(lv, "nowhere"));
  assert.deepEqual(problemsOf(await missing.resolve(run("acme-singlet-50"))), [
    "lv-path-missing: LensVisualizer cannot be loaded; lvrtc doctor says why",
  ]);
  rmSync(join(lv, "src/optics/analysis/mtfTracing.ts"));
  const broken = createLvCaseSource(lv);
  const [problem] = problemsOf(await broken.resolve(run("acme-singlet-50")));
  assert.equal(problem, "lv-import-failed: LensVisualizer cannot be loaded; lvrtc doctor says why");
  assert.ok(!problem.includes(lv));
  assert.equal(broken.audit(), null);
});

// ── The audit ────────────────────────────────────────────────────────────────────────────────────────────────────

test("the audit gives the checkout's fingerprint, and names an engine file or an exported lens file that changed", async (t) => {
  const lv = freshLv(t);
  const source = createLvCaseSource(lv);
  assert.equal(source.audit(), null, "nothing was loaded yet");
  caseOf(await source.resolve(run("acme-singlet-50")));
  const fingerprint = {
    commit: null,
    dirty: null,
    engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES),
    engineFileCount: FAKE_ENGINE_FILES.length,
  };
  assert.deepEqual(source.audit(), { fingerprint, changed: [] });

  // A lens file no case was built from is no input of the cases.
  appendFileSync(join(lv, ZOOM_FILE), "// edited\n");
  assert.deepEqual(source.audit(), { fingerprint, changed: [] });
  appendFileSync(join(lv, SINGLET_FILE), "// edited\n");
  assert.deepEqual(source.audit(), { fingerprint, changed: [SINGLET_FILE] });
  appendFileSync(join(lv, "src/optics/trace/aperture.ts"), "// edited\n");
  rmSync(join(lv, "src/optics/apertureStop.ts"));
  // The fingerprint goes on describing what was loaded and built the cases.
  assert.deepEqual(source.audit(), {
    fingerprint,
    changed: ["src/optics/apertureStop.ts", "src/optics/trace/aperture.ts", SINGLET_FILE],
  });
});

test("an engine file LensVisualizer loads after a case was built is named by the audit: the closure grew", async (t) => {
  const lv = freshLv(t);
  const exporter = createLvExporter(await bind(t, lv));
  const first = await exporter.exportLens("acme-singlet-50", {});
  assert.ok(first.ok);
  const before = exporter.audit();
  assert.deepEqual(before.changed, []);
  assert.equal(first.opticalCase.provenance.lv?.closureHash, before.fingerprint.engineClosureHash);

  // A module of the tree that nothing had imported, loaded now: what a lazy import inside LensVisualizer would do.
  const late = "src/optics/late/extra.ts";
  mkdirSync(join(lv, "src/optics/late"), { recursive: true });
  writeFileSync(join(lv, late), "export const late = 1;\n");
  await import(pathToFileURL(join(lv, late)).href);

  const after = exporter.audit();
  assert.equal(after.fingerprint.engineFileCount, FAKE_ENGINE_FILES.length + 1);
  assert.equal(after.fingerprint.engineClosureHash, closureOf(lv, [...FAKE_ENGINE_FILES, late].sort()));
  assert.notEqual(after.fingerprint.engineClosureHash, before.fingerprint.engineClosureHash);
  // No file on disk differs from what was loaded: only the first case's stamp is no longer the closure.
  assert.deepEqual(after.changed, ["the engine closure (LensVisualizer loaded more files after a case was built)"]);
  // A case built from here on is stamped with the closure as it now is.
  const second = await exporter.exportLens("acme-zoom-24-48", {});
  assert.ok(second.ok);
  assert.equal(second.opticalCase.provenance.lv?.closureHash, after.fingerprint.engineClosureHash);
});

test("a lens whose export had a problem is no input of a case, and its file is not audited", async (t) => {
  const lv = freshLv(t);
  const exporter = createLvExporter(await bind(t, lv));
  assert.equal((await exporter.exportLens("zenith-doublet-100", { lines: { kind: "cdf" } })).ok, false);
  appendFileSync(join(lv, FAKE_LENS_FILES[2][0]), "// edited\n");
  assert.deepEqual(exporter.audit().changed, []);
});

test("the binding names the given lens files whose bytes changed since they were loaded, sorted and each once", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const { entries } = await binding.catalog();
  assert.deepEqual(binding.changedLensFiles(entries), []);
  appendFileSync(join(lv, ZOOM_FILE), "// edited\n");
  rmSync(join(lv, FAKE_LENS_FILES[2][0]));
  assert.deepEqual(binding.changedLensFiles([...entries].reverse()), [ZOOM_FILE, FAKE_LENS_FILES[2][0]]);
  assert.deepEqual(binding.changedLensFiles([entries[0], entries[0]]), []);
  assert.deepEqual(binding.changedLensFiles([entries[1], entries[1]]), [ZOOM_FILE]);
  assert.deepEqual(binding.rehash(), [], "a lens file is not engine code");
});

// ── In a suite ───────────────────────────────────────────────────────────────────────────────────────────────────

test("a suite of LensVisualizer lenses loads through the source, and its manifest records the checkout", async (t) => {
  const lv = freshLv(t);
  const { rootDir, file } = suiteFile(t, [
    { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } },
    { name: "zoom-tele", lens: { kind: "lv", key: "acme-zoom-24-48" }, state: { zoomT: 1 } },
    {
      name: "refocused",
      lens: { kind: "lv", key: "acme-zoom-24-48" },
      state: { focus: { kind: "focusT", value: 0.5 } },
    },
  ]);
  const sources = { fixture: createFixtureCaseSource(rootDir), lv: createLvCaseSource(lv) };
  const suite = await loadSuite(file, { rootDir, sources });
  assert.deepEqual(
    suite.runs.map((loaded) => [loaded.spec.name, loaded.opticalCase !== null, loaded.problems.map(problemCode)]),
    [
      ["singlet", true, []],
      ["zoom-tele", true, []],
      ["refocused", false, ["finite-conjugate-unavailable"]],
    ],
  );

  const runsDir = join(rootDir, "runs");
  const { registry } = watchedRegistry({ "fake-a": fakeEngine() });
  const result = await runSuite({ suite, registry, runsDir, sources, rungs: ["selftest"] });
  assert.deepEqual(result.manifest.sources, {
    lv: {
      fingerprint: {
        commit: null,
        dirty: null,
        engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES),
        engineFileCount: FAKE_ENGINE_FILES.length,
      },
      status: "unchanged",
    },
  });
  assert.deepEqual(
    result.manifest.jobs.map((job) => [job.run, job.status]),
    [
      ["singlet", "ok"],
      ["zoom-tele", "ok"],
    ],
  );
  assert.deepEqual(result.warnings, []);
});

test("a lens file edited between loading the suite and the end of its run marks the manifest", async (t) => {
  const lv = freshLv(t);
  const { rootDir, file } = suiteFile(t, [{ name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } }]);
  const sources = { lv: createLvCaseSource(lv) };
  const suite = await loadSuite(file, { rootDir, sources });
  const { registry } = watchedRegistry({ "fake-a": fakeEngine() });
  const result = await runSuite({
    suite,
    registry,
    runsDir: join(rootDir, "runs"),
    sources,
    onJob: () => appendFileSync(join(lv, SINGLET_FILE), "// edited while the suite ran\n"),
  });
  assert.equal(result.manifest.sources?.lv.status, SOURCE_CHANGED);
  assert.deepEqual(result.warnings, [`case source lv changed during the run: ${SINGLET_FILE}`]);
});
