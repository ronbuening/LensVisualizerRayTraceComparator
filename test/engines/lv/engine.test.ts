// The engine `lv` against the fake LV tree: the binding, the exporter and the engine together, with no
// LensVisualizer. The fake has a paraxial kernel and conic surfaces of its own, so what the engine assembles from
// them is held to the reference engine here; its numbers describe no real lens.
import assert from "node:assert/strict";
import { appendFileSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { COMPARATORS } from "../../../src/compare/index.ts";
import { comparePair } from "../../../src/compare/pair.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import { finalizeCase } from "../../../src/contract/case.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import { FEATURE_FLAGS } from "../../../src/contract/features.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { PARAXIAL_FIRST_ORDER } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import type { ParaxialFirstOrderData } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import { SYSTEM_DESCRIBE } from "../../../src/contract/quantities/systemDescribe.ts";
import type { SystemDescribeData } from "../../../src/contract/quantities/systemDescribe.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { validateKind } from "../../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { loadConfig } from "../../../src/core/config.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { runSuite } from "../../../src/core/orchestrator.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { EngineUnavailableError } from "../../../src/engines/adapter.ts";
import { BUILTIN_ENGINES } from "../../../src/engines/builtin.ts";
import { runConformance } from "../../../src/engines/conformance.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { STALE_CASE } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import {
  LV_ENGINE_ID,
  LV_ENGINE_VERSION,
  createLvEngine,
  createLvEngineOn,
  lvDescriptor,
} from "../../../src/engines/lv/engine.ts";
import { LV_STORED_CONSTANTS } from "../../../src/engines/lv/firstOrder.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { QUANTITIES } from "../../../src/quantities/index.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { SINGLET_CASE } from "../../contract/corpus.ts";
import { suiteOf, tempDir } from "../../core/support.ts";
import { FAKE_ENGINE_FILES, FAKE_LENS_FILES, bind, closureOf, fileHash, freshLv } from "./support.ts";

const POLICY = loadPolicy();
const [SINGLET_FILE] = FAKE_LENS_FILES.map(([file]) => file);

/** The engine `lv` on a bound tree, behind an adapter, as a run reaches it; closed when the test ends. */
function engineOn(t: TestContext, binding: LvBinding): RemoteEngineAdapter {
  const transport = createInProcessTransport(createLvEngineOn(binding));
  const adapter = new RemoteEngineAdapter({ id: LV_ENGINE_ID, transport });
  t.after(() => adapter.close());
  return adapter;
}

function refEngine(t: TestContext): RemoteEngineAdapter {
  const adapter = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => adapter.close());
  return adapter;
}

/** The case of a lens of a bound tree under a run's options. */
async function exported(binding: LvBinding, key: string, options: RunOptions = {}): Promise<OpticalCase> {
  const result = await createLvExporter(binding).exportLens(key, options);
  assert.ok(result.ok, JSON.stringify(result));
  return result.opticalCase;
}

function ask(engine: RemoteEngineAdapter, opticalCase: OpticalCase, quantity: string, spec: JsonObject = {}) {
  return engine.run(makeRequest({ caseId: opticalCase.id, quantity, spec }), opticalCase);
}

/** The data of an "ok" answer, checked as the orchestrator checks it before it stores it. */
function dataOf<T>(result: ResultEnvelope, quantity: string): T {
  assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
  const module = QUANTITIES.get(quantity);
  assert.ok(module !== undefined);
  assert.deepEqual(resultDataProblems(module, result.data), []);
  return result.data as T;
}

function f8(wire: NdArrayWire): number[] {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return [...decoded.values];
}

/** The verdict of rung `rung` on what `lv` and `ref` answer about a case, with the reason of one that fails. */
async function verdictOf(
  rung: "r0" | "r1",
  lv: RemoteEngineAdapter,
  ref: RemoteEngineAdapter,
  opticalCase: OpticalCase,
): Promise<string> {
  const { quantity } = POLICY.rungs[rung];
  const [mine, theirs] = [await ask(lv, opticalCase, quantity), await ask(ref, opticalCase, quantity)];
  const participant = (engine: string, result: ResultEnvelope) => ({
    engine,
    fingerprint: result.engine.fingerprint,
    status: result.status,
    data: result.data,
  });
  const pair = comparePair(
    participant("lv", mine),
    participant("ref", theirs),
    POLICY.rungs[rung],
    COMPARATORS.get(quantity),
  );
  return pair.reason === undefined ? pair.verdict : `${pair.verdict}: ${pair.reason}`;
}

/** A copy of a tree with some of its files rewritten, in the same temporary directory; removed with it. */
function variantOf(lv: string, name: string, edits: Readonly<Record<string, (text: string) => string>>): string {
  const copy = join(dirname(lv), name);
  cpSync(lv, copy, { recursive: true });
  for (const [file, edit] of Object.entries(edits)) {
    const path = join(copy, ...file.split("/"));
    const text = readFileSync(path, "utf8");
    const edited = edit(text);
    assert.notEqual(edited, text, `${file} was to be edited`);
    writeFileSync(path, edited);
  }
  return copy;
}

/** A case with one member of its system or conditions replaced, finished again so that it is what it says. */
function altered(opticalCase: OpticalCase, change: (draft: OpticalCase) => void): OpticalCase {
  const draft: OpticalCase = structuredClone(opticalCase);
  change(draft);
  const { label, system, conditions, provenance } = draft;
  return finalizeCase({ label, system, conditions, provenance });
}

// ── Who it is ────────────────────────────────────────────────────────────────────────────────────────────────────

test("lv describes itself: LensVisualizer's engine closure, its commit and its two quantities", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const descriptor = await engineOn(t, binding).describe();
  assert.deepEqual(validateKind("engine-descriptor", descriptor), []);
  assert.deepEqual(descriptor, lvDescriptor(binding.fingerprint()));
  assert.deepEqual(descriptor.identity, {
    id: "lv",
    version: LV_ENGINE_VERSION,
    fingerprint: closureOf(lv, FAKE_ENGINE_FILES),
    // A temporary directory is under no git repository.
    details: { commit: null, dirty: null, engineFileCount: FAKE_ENGINE_FILES.length },
  });
  assert.deepEqual(descriptor.capabilities.quantities, {
    "paraxial.first-order": { version: QUANTITIES.get("paraxial.first-order")?.version },
    "system.describe": { version: QUANTITIES.get("system.describe")?.version },
  });
  // Whatever LensVisualizer's exporter writes, LensVisualizer answers for.
  assert.deepEqual(descriptor.capabilities.features, { supported: [...FEATURE_FLAGS], limits: {} });
  assert.equal(descriptor.capabilities.deterministic, true);
});

test("a lens file that is edited does not change the engine's fingerprint; an engine file does", async (t) => {
  const lv = freshLv(t);
  const fingerprint = lvDescriptor((await bind(t, lv)).fingerprint()).identity.fingerprint;
  (await bind(t, lv)).close();

  const lensEdited = variantOf(lv, "lens-edited", { [SINGLET_FILE]: (text) => text.replace("R: 50,", "R: 51,") });
  const lensBinding = await bind(t, lensEdited);
  assert.equal(lvDescriptor(lensBinding.fingerprint()).identity.fingerprint, fingerprint);
  lensBinding.close();

  const engineEdited = variantOf(lv, "engine-edited", {
    "src/optics/trace/aperture.ts": (text) => `${text}// edited\n`,
  });
  assert.notEqual(lvDescriptor((await bind(t, engineEdited)).fingerprint()).identity.fingerprint, fingerprint);
});

test("lv passes the conformance kit: it offers no selftest.echo, and refuses what it cannot answer", async (t) => {
  const binding = await bind(t, freshLv(t));
  const report = await runConformance({
    id: "lv",
    createTransport: () => createInProcessTransport(createLvEngineOn(binding)),
  });
  assert.equal(report.passed, true, JSON.stringify(report.checks.filter((check) => check.status === "fail")));
  assert.deepEqual(
    report.checks.filter((check) => check.status === "pass").map((check) => check.id),
    [
      "hello",
      "contract-range",
      "engine-id",
      "unknown-quantity",
      "malformed-run",
      "ids-echoed",
      "deterministic",
      "shutdown",
    ],
  );
});

// ── system.describe ──────────────────────────────────────────────────────────────────────────────────────────────

test("system.describe is the prepared state read back: vertices, shapes, clip radii, indices, sag", async (t) => {
  const binding = await bind(t, freshLv(t));
  const lv = engineOn(t, binding);
  const opticalCase = await exported(binding, "acme-zoom-24-48", {
    state: { zoomT: 1 },
    aperture: { kind: "f-number", value: 8 },
    lines: { kind: "photopic" },
    imagePlane: { kind: "shift", mm: 0.25 },
  });
  const result = await ask(lv, opticalCase, SYSTEM_DESCRIBE, { sagFractions: [0, 0.5, 1] });
  assert.deepEqual(result.method, { name: "prepared-state-echo", params: {} });
  assert.deepEqual(result.diagnostics.counts, { surfaces: 7, lines: 5 });
  const data = dataOf<SystemDescribeData>(result, SYSTEM_DESCRIBE);

  assert.equal(data.surfaceCount, 7);
  assert.equal(data.stopIndex, 2);
  // The fake zoom opens its first gap by 10 mm at the long end; the rear plate follows the lens.
  assert.deepEqual(f8(data.vertexZ), [0, 13, 15, 17, 20, 50, 51.5]);
  assert.equal(data.imageZ, 52.25);
  // f/8 of a lens that is f/4 at a stop of 6 mm.
  assert.equal(data.stopSemiDiameter, 3);
  assert.deepEqual(f8(data.curvature), [1 / 40, 1 / -80, 0, 1 / 60, 1 / -60, 0, 0]);
  assert.deepEqual(f8(data.conic), [0, -1, 0, 0, 0, 0, 0]);
  assert.deepEqual(data.terms, [[], [{ power: 4, coeff: 1e-6 }], [], [], [], [], []]);
  // The limit of the fake's clip rule, as LensVisualizer's: the stop row is the stop of the case, not wide open.
  assert.deepEqual(
    f8(data.clipRadius),
    [9, 9, 3, 7, 7, 12, 12].map((sd) => sd + 1e-9),
  );
  assert.deepEqual(f8(data.sagRadii), [0, 4.5, 9, 0, 4.5, 9, 0, 1.5, 3, 0, 3.5, 7, 0, 3.5, 7, 0, 6, 12, 0, 6, 12]);
  assert.deepEqual(data.indexAfterSurface, opticalCase.conditions.indexAfterSurface);
  assert.deepEqual(data.indexAfterSurface.$nd.shape, [5, 7]);

  const sag = f8(data.sag);
  assert.deepEqual(data.sag.$nd.shape, [7, 3]);
  // A sphere of radius 40 at 9 mm, and a paraboloid of radius -80 with a term of power 4 at 9 mm.
  assert.ok(Math.abs(sag[2] - (40 - Math.sqrt(40 * 40 - 81))) < 1e-14, String(sag[2]));
  assert.ok(Math.abs(sag[5] - (81 / -160 + 1e-6 * 9 ** 4)) < 1e-14, String(sag[5]));
  for (const flat of [6, 7, 8, 15, 16, 17, 18, 19, 20]) assert.equal(sag[flat], 0, `element ${flat}`);
  for (const value of sag) assert.ok(Object.is(value, 0) || value !== 0, "a zero is +0");
});

test("the sag is NaN beyond the height at which LensVisualizer says a surface ends", async (t) => {
  const lv = freshLv(t);
  mkdirSync(join(lv, "src/lens-data/steep"));
  // A ball lens whose clear aperture is authored wider than the ball: 8 mm on a radius of 5.5 mm.
  writeFileSync(
    join(lv, "src/lens-data/steep/Ball.data.ts"),
    [
      "export default {",
      '  key: "steep-ball", name: "STEEP Ball",',
      "  surfaces: [",
      '    { label: "1", R: 5.5, d: 11, nd: 1.5, sd: 8 },',
      '    { label: "STO", R: 1e15, d: 20, nd: 1, sd: 2 },',
      "  ],",
      "};",
      "",
    ].join("\n"),
  );
  const binding = await bind(t, lv);
  const opticalCase = await exported(binding, "steep-ball");
  const engine = engineOn(t, binding);
  const data = dataOf<SystemDescribeData>(await ask(engine, opticalCase, SYSTEM_DESCRIBE), SYSTEM_DESCRIBE);
  const [radii, sag] = [f8(data.sagRadii).slice(0, 9), f8(data.sag).slice(0, 9)];
  assert.deepEqual(radii, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(
    sag.map((value) => Number.isNaN(value)),
    radii.map((radius) => radius > 5.5),
  );
  // The fake's own sag function, like LensVisualizer's, is finite out there: the engine does not echo it.
  const state = binding.api.prepareRuntimeState(binding.api.buildLens((await binding.lens("steep-ball")).data), 0, 0);
  assert.ok(Number.isFinite(state.surfaces[0].profile.sag(8)));
  assert.equal(state.surfaces[0].profile.finiteRadiusLimit(), 5.5);
  // The reference engine has no sag there either, so the two still agree.
  assert.equal(await verdictOf("r0", engine, refEngine(t), opticalCase), "PASS");
});

// ── paraxial.first-order ─────────────────────────────────────────────────────────────────────────────────────────

test("paraxial.first-order is the kernel on the state: a thin stop behind a singlet, worked out by hand", async (t) => {
  const binding = await bind(t, freshLv(t));
  const opticalCase = await exported(binding, "acme-singlet-50");
  const result = await ask(engineOn(t, binding), opticalCase, PARAXIAL_FIRST_ORDER);
  assert.deepEqual(result.method, { name: "paraxial-kernel", params: {} });
  const data = dataOf<ParaxialFirstOrderData>(result, PARAXIAL_FIRST_ORDER);

  // A biconvex lens of radii 50 and -50, 4 mm thick, of index 1.5, by the formulas of a thick lens in air.
  const [n, r1, r2, d] = [1.5, 50, -50, 4];
  const power = (n - 1) * (1 / r1 - 1 / r2 + ((n - 1) * d) / (n * r1 * r2));
  const efl = 1 / power;
  const rearPrincipalZ = d - (efl * (n - 1) * d) / (n * r1);
  const close = (actual: number, expected: number, what: string): void =>
    assert.ok(Math.abs(actual - expected) < 1e-12, `${what}: ${actual} against ${expected}`);
  close(f8(data.efl)[0], efl, "efl");
  close(f8(data.rearPrincipalZ)[0], rearPrincipalZ, "rearPrincipalZ");
  close(f8(data.rearFocalZ)[0], rearPrincipalZ + efl, "rearFocalZ");
  close(f8(data.frontPrincipalZ)[0], -(efl * (n - 1) * d) / (n * r2), "frontPrincipalZ");
  close(f8(data.frontFocalZ)[0], -(efl * (n - 1) * d) / (n * r2) - efl, "frontFocalZ");
  // The last lens vertex of this lens is its stop surface, 5 mm behind the first vertex.
  close(f8(data.backFocus)[0], rearPrincipalZ + efl - 5, "backFocus");
  // The stop is the last surface, in air: it is its own exit pupil.
  assert.deepEqual(f8(data.exitPupilZ), [5]);
  assert.deepEqual(f8(data.exitPupilSemiDiameter), [6.25]);
  // Its entrance pupil is its image through the lens in front of it: virtual, behind the lens, and magnified.
  const stopFromRearPrincipal = 5 - rearPrincipalZ;
  const imageFromFrontPrincipal = 1 / (1 / efl - 1 / stopFromRearPrincipal);
  close(f8(data.entrancePupilZ)[0], -(efl * (n - 1) * d) / (n * r2) - imageFromFrontPrincipal, "entrancePupilZ");
  close(
    f8(data.entrancePupilSemiDiameter)[0],
    Math.abs((6.25 * imageFromFrontPrincipal) / stopFromRearPrincipal),
    "entrancePupilSemiDiameter",
  );
});

test("LensVisualizer's stored constants are recorded where they are defined, under telling names", async (t) => {
  const binding = await bind(t, freshLv(t));
  const lv = engineOn(t, binding);
  const firstOrder = async (key: string, options: RunOptions = {}): Promise<ParaxialFirstOrderData> =>
    dataOf(await ask(lv, await exported(binding, key, options), PARAXIAL_FIRST_ORDER), PARAXIAL_FIRST_ORDER);

  // The zoom at its long end, wide open, on its reference line: the fake's constants, moved by the zoom position.
  const tele = await firstOrder("acme-zoom-24-48", { state: { zoomT: 1 } });
  assert.deepEqual(Object.keys(tele.recorded).sort(), [...LV_STORED_CONSTANTS].sort());
  const recorded = Object.fromEntries(Object.entries(tele.recorded).map(([name, wire]) => [name, f8(wire)]));
  assert.deepEqual(recorded, {
    // The stop vertex at 15 mm and the last vertex, of the rear plate, at 51.5 mm.
    lvStoredEntrancePupilZ: [15 + (-1.5 + 1)],
    lvStoredExitPupilZ: [51.5 + (-12.5 + 1)],
    lvNominalEntrancePupilSemiDiameter: [2 * 3 + 1],
    lvStoredExitPupilSemiDiameter: [3 * 3 + 1],
    lvNominalFNumber: [4],
  });
  for (const name of LV_STORED_CONSTANTS) assert.match(name, /^lv(Stored|Nominal)[A-Z]/);
  // None of them is the compared value of a like name: the kernel's pupils are images of the stop.
  assert.notEqual(f8(tele.entrancePupilZ)[0], recorded.lvStoredEntrancePupilZ[0]);
  assert.notEqual(f8(tele.entrancePupilSemiDiameter)[0], recorded.lvNominalEntrancePupilSemiDiameter[0]);

  // They are constants of the prescription as written: no line of a spectral run is traced with its indices.
  const photopic = await firstOrder("acme-zoom-24-48", { lines: { kind: "photopic" } });
  assert.deepEqual(photopic.recorded, {});
  assert.deepEqual(photopic.efl.$nd.shape, [5]);
  // Nor are they defined away from infinity focus, where the object's magnification is recorded instead.
  const close = await firstOrder("acme-singlet-50", { state: { focus: { kind: "focusT", value: 1 } } });
  assert.deepEqual(Object.keys(close.recorded), ["magnification"]);
  const [magnification] = f8(close.recorded.magnification);
  assert.ok(magnification < 0 && magnification > -1, String(magnification));
});

test("lv and ref agree in R0 and R1 on every kind of case the fake tree gives", async (t) => {
  const binding = await bind(t, freshLv(t));
  const [lv, ref] = [engineOn(t, binding), refEngine(t)];
  const cases: [string, string, RunOptions][] = [
    // The stop behind the lens, and in front of it; a zoom with an asphere and a rear plate, at both ends.
    ["singlet", "acme-singlet-50", {}],
    ["doublet", "zenith-doublet-100", {}],
    ["zoom wide", "acme-zoom-24-48", {}],
    ["zoom tele", "acme-zoom-24-48", { state: { zoomT: 1 } }],
    // Several lines, with anchored indices; a stop setting; an image plane that is not the design plane.
    ["zoom photopic", "acme-zoom-24-48", { state: { zoomT: 0.5 }, lines: { kind: "photopic" } }],
    ["zoom cdf at f/11", "acme-zoom-24-48", { lines: { kind: "cdf" }, aperture: { kind: "f-number", value: 11 } }],
    ["zoom explicit", "acme-zoom-24-48", { lines: { kind: "explicit", wavelengthsNm: [600, 450], weights: [2, 1] } }],
    ["singlet shifted", "acme-singlet-50", { imagePlane: { kind: "shift", mm: -0.4 } }],
    ["singlet at a stop radius", "acme-singlet-50", { aperture: { kind: "stop-radius", mm: 2.5 } }],
    // A finite object, at the one focus station the fake certifies.
    ["singlet close", "acme-singlet-50", { state: { focus: { kind: "focusT", value: 1 } } }],
  ];
  for (const [name, key, options] of cases) {
    const opticalCase = await exported(binding, key, options);
    assert.equal(await verdictOf("r0", lv, ref, opticalCase), "PASS", `${name}: r0`);
    assert.equal(await verdictOf("r1", lv, ref, opticalCase), "PASS", `${name}: r1`);
  }
  // Both engines record the magnification of a finite object, each from its own kernel.
  const close = await exported(binding, "acme-singlet-50", { state: { focus: { kind: "focusT", value: 1 } } });
  const magnifications = await Promise.all(
    [lv, ref].map(async (engine) =>
      f8(
        dataOf<ParaxialFirstOrderData>(await ask(engine, close, PARAXIAL_FIRST_ORDER), PARAXIAL_FIRST_ORDER).recorded
          .magnification,
      ),
    ),
  );
  assert.ok(Math.abs(magnifications[0][0] - magnifications[1][0]) < 1e-15, JSON.stringify(magnifications));
});

/** Writes one more lens file into a tree that is not bound yet. */
function addLens(lv: string, key: string, surfaces: readonly string[]): void {
  mkdirSync(join(lv, "src/lens-data/added"), { recursive: true });
  const text = `export default { key: "${key}", name: "ADDED ${key}", surfaces: [\n${surfaces.join(",\n")},\n] };\n`;
  writeFileSync(join(lv, "src/lens-data/added", `${key}.data.ts`), text);
}

test("a stop inside an element has its pupils traced through the glass on both sides of it", async (t) => {
  const lv = freshLv(t);
  addLens(lv, "inner-stop", [
    '{ label: "1", R: 30, d: 3, nd: 1.6, sd: 8 }',
    // The glass goes on behind the stop: the surface bends nothing and is the stop all the same.
    '{ label: "STO", R: 1e15, d: 4, nd: 1.6, sd: 5 }',
    '{ label: "3", R: -45, d: 40, nd: 1, sd: 8 }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];
  const opticalCase = await exported(binding, "inner-stop", { lines: { kind: "cdf" } });
  assert.equal(await verdictOf("r0", engine, ref, opticalCase), "PASS");
  assert.equal(await verdictOf("r1", engine, ref, opticalCase), "PASS");
  // Neither pupil is the stop itself: each is its image through the glass and the surface on its side.
  const data = dataOf<ParaxialFirstOrderData>(
    await ask(engine, opticalCase, PARAXIAL_FIRST_ORDER),
    PARAXIAL_FIRST_ORDER,
  );
  assert.notEqual(f8(data.entrancePupilZ)[0], 3);
  assert.notEqual(f8(data.exitPupilZ)[0], 3);
  assert.ok(f8(data.entrancePupilSemiDiameter)[0] > 5 && f8(data.exitPupilSemiDiameter)[0] > 5);
});

test("a coefficient the exporter writes and LensVisualizer does not evaluate fails R0, which names the surface", async (t) => {
  const lv = freshLv(t);
  // A10 is no coefficient of the fake's aspheric schema: its sag never reads it. The exporter takes every A<n>.
  addLens(lv, "stray-term", [
    '{ label: "1", R: 40, d: 3, nd: 1.6, sd: 9 }',
    '{ label: "2A", R: -80, d: 2, nd: 1, sd: 9, asphere: { K: 0, A4: 1e-6, A10: 1e-13 } }',
    '{ label: "STO", R: 1e15, d: 30, nd: 1, sd: 3 }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];
  const opticalCase = await exported(binding, "stray-term");
  const { shape } = opticalCase.system.surfaces[1];
  assert.deepEqual(shape.kind === "asphere" && shape.terms.map((term) => term.power), [4, 10]);
  // lv echoes what LensVisualizer holds, not what the case says: one term, and the sag of one term.
  const data = dataOf<SystemDescribeData>(await ask(engine, opticalCase, SYSTEM_DESCRIBE), SYSTEM_DESCRIBE);
  assert.deepEqual(data.terms[1], [{ power: 4, coeff: 1e-6 }]);
  const verdict = await verdictOf("r0", engine, ref, opticalCase);
  assert.match(verdict, /^FAIL: /);
  assert.match(verdict, /shape\.mismatches 1 exceeds its tolerance 0 at field terms, power 10, surface 1/);
  assert.match(verdict, /sag\.maxScaled [0-9.e-]+ exceeds its tolerance 1\.00e-12 at sample 8, surface 1/);
});

test("an asphere without a term is the conic it equals, a plane on a flat base; terms come by ascending power", async (t) => {
  const lv = freshLv(t);
  addLens(lv, "bare-aspheres", [
    // Coefficients that are all 0 leave a conic, which LensVisualizer still holds as an asphere.
    '{ label: "1A", R: 40, d: 3, nd: 1.6, sd: 9, asphere: { K: -0.5, A4: 0 } }',
    // On a flat base without a term the conic constant shapes nothing: a plane, whatever K says.
    '{ label: "2A", R: 1e15, d: 2, nd: 1, sd: 9, asphere: { K: -2 } }',
    '{ label: "STO", R: 1e15, d: 2, nd: 1, sd: 3 }',
    // The fake's schema lists the even coefficients before the odd ones, as LensVisualizer's does.
    '{ label: "4A", R: 60, d: 3, nd: 1.7, sd: 7, asphere: { K: 0, A6: -2e-9, A4: 1e-6, A5: 3e-8, A3: 1e-5 } }',
    // A flat base with a term keeps its K: the shape is an asphere, and K is what LensVisualizer holds for it.
    '{ label: "5A", R: 1e15, d: 30, nd: 1, sd: 7, asphere: { K: 3, A4: -2e-6 } }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];
  const opticalCase = await exported(binding, "bare-aspheres");
  assert.deepEqual(
    opticalCase.system.surfaces.map((surface) => surface.shape.kind),
    ["conic", "plane", "plane", "asphere", "asphere"],
  );
  const data = dataOf<SystemDescribeData>(await ask(engine, opticalCase, SYSTEM_DESCRIBE), SYSTEM_DESCRIBE);
  assert.deepEqual(f8(data.curvature), [1 / 40, 0, 0, 1 / 60, 0]);
  assert.deepEqual(f8(data.conic), [-0.5, 0, 0, 0, 3]);
  assert.deepEqual(data.terms, [
    [],
    [],
    [],
    [
      { power: 3, coeff: 1e-5 },
      { power: 4, coeff: 1e-6 },
      { power: 5, coeff: 3e-8 },
      { power: 6, coeff: -2e-9 },
    ],
    [{ power: 4, coeff: -2e-6 }],
  ]);
  assert.equal(await verdictOf("r0", engine, ref, opticalCase), "PASS");
  assert.equal(await verdictOf("r1", engine, ref, opticalCase), "PASS");
});

test("a pupil that is an inverted image of the stop has a positive radius", async (t) => {
  const lv = freshLv(t);
  // A stop behind the focus of the lens in front of it, and a stop in front of the focus of the lens behind it:
  // a ray reaches the first stop on the other side of the axis, and leaves the second lens toward it.
  addLens(lv, "stop-behind-focus", [
    '{ label: "1", R: 20, d: 4, nd: 1.5, sd: 8 }',
    '{ label: "2", R: -20, d: 80, nd: 1, sd: 8 }',
    '{ label: "STO", R: 1e15, d: 10, nd: 1, sd: 3 }',
  ]);
  addLens(lv, "stop-before-focus", [
    '{ label: "STO", R: 1e15, d: 80, nd: 1, sd: 3 }',
    '{ label: "2", R: 20, d: 4, nd: 1.5, sd: 8 }',
    '{ label: "3", R: -20, d: 30, nd: 1, sd: 8 }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];

  const behind = await exported(binding, "stop-behind-focus");
  const state = binding.api.prepareRuntimeState(
    binding.api.buildLens((await binding.lens("stop-behind-focus")).data),
    0,
    0,
  );
  assert.ok(binding.api.traceParaxialSurfaces2(state.surfaces, 1, 0, { stopAt: 2 }).y < 0, "the stop is seen inverted");
  const front = dataOf<ParaxialFirstOrderData>(await ask(engine, behind, PARAXIAL_FIRST_ORDER), PARAXIAL_FIRST_ORDER);
  // The entrance pupil is a real image of the stop, in front of the lens.
  assert.ok(f8(front.entrancePupilZ)[0] < 0, String(f8(front.entrancePupilZ)[0]));
  assert.ok(f8(front.entrancePupilSemiDiameter)[0] > 0, String(f8(front.entrancePupilSemiDiameter)[0]));
  assert.equal(await verdictOf("r1", engine, ref, behind), "PASS");

  const before = await exported(binding, "stop-before-focus");
  const rear = dataOf<ParaxialFirstOrderData>(await ask(engine, before, PARAXIAL_FIRST_ORDER), PARAXIAL_FIRST_ORDER);
  // The exit pupil is a real image of the stop, behind the lens, whose last vertex is at 84 mm.
  assert.ok(f8(rear.exitPupilZ)[0] > 84, String(f8(rear.exitPupilZ)[0]));
  assert.ok(f8(rear.exitPupilSemiDiameter)[0] > 0, String(f8(rear.exitPupilSemiDiameter)[0]));
  // With the stop on the first surface the entrance pupil is the stop.
  assert.deepEqual([f8(rear.entrancePupilZ), f8(rear.entrancePupilSemiDiameter)], [[0], [3]]);
  assert.equal(await verdictOf("r1", engine, ref, before), "PASS");
});

test("an image space that is not air has its index in the focal length and in the exit pupil", async (t) => {
  const lv = freshLv(t);
  addLens(lv, "immersed", [
    '{ label: "STO", R: 1e15, d: 2, nd: 1, sd: 5 }',
    '{ label: "2", R: 30, d: 5, nd: 1.6, sd: 8 }',
    '{ label: "3", R: -40, d: 50, nd: 1.33, sd: 8 }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];
  const opticalCase = await exported(binding, "immersed");
  const data = dataOf<ParaxialFirstOrderData>(
    await ask(engine, opticalCase, PARAXIAL_FIRST_ORDER),
    PARAXIAL_FIRST_ORDER,
  );
  const close = (actual: number, expected: number, what: string): void =>
    assert.ok(Math.abs(actual - expected) < 1e-12, `${what}: ${actual} against ${expected}`);

  // A thick lens of index 1.6 between air and a medium of index 1.33, by its two surface powers.
  const [p1, p2] = [(1.6 - 1) / 30, (1.33 - 1.6) / -40];
  const power = p1 + p2 - (5 / 1.6) * p1 * p2;
  close(f8(data.efl)[0], 1.33 / power, "efl");
  // A ray from the centre of the stop with the reduced angle 1: 2 mm of air, the first surface, 5 mm of glass,
  // the second surface. It leaves at the height y with the reduced angle w, in the medium of index 1.33.
  const y = 2 + (5 / 1.6) * (1 - p1 * 2);
  const w = 1 - p1 * 2 - p2 * y;
  close(f8(data.exitPupilZ)[0], 7 - (1.33 * y) / w, "exitPupilZ");
  close(f8(data.exitPupilSemiDiameter)[0], 5 / w, "exitPupilSemiDiameter");
  assert.equal(await verdictOf("r0", engine, ref, opticalCase), "PASS");
  assert.equal(await verdictOf("r1", engine, ref, opticalCase), "PASS");
});

test("a telecentric system has its exit pupil at infinity: an infinity in place and in radius, never a NaN", async (t) => {
  const lv = freshLv(t);
  // One refracting surface of power 0.01/mm with the stop in its front focal plane, 100 mm ahead of it: every ray
  // from the centre of the stop runs parallel to the axis in the glass. The numbers make the angle exactly 0.
  addLens(lv, "telecentric", [
    '{ label: "STO", R: 1e15, d: 100, nd: 1, sd: 4 }',
    '{ label: "2", R: 50, d: 150, nd: 1.5, sd: 20 }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];
  const opticalCase = await exported(binding, "telecentric");
  const data = dataOf<ParaxialFirstOrderData>(
    await ask(engine, opticalCase, PARAXIAL_FIRST_ORDER),
    PARAXIAL_FIRST_ORDER,
  );
  assert.equal(Math.abs(f8(data.exitPupilZ)[0]), Infinity);
  assert.deepEqual(f8(data.exitPupilSemiDiameter), [Infinity]);
  // The rest is that of a single surface: the principal points at its vertex, the focal length n'/power.
  assert.deepEqual(f8(data.rearPrincipalZ), [100]);
  assert.ok(Math.abs(f8(data.efl)[0] - 150) < 1e-12, String(f8(data.efl)[0]));
  assert.ok(Math.abs(f8(data.rearFocalZ)[0] - 250) < 1e-12, String(f8(data.rearFocalZ)[0]));
  // The reference engine puts the pupil at the same infinity, and two equal infinities differ by nothing.
  assert.equal(await verdictOf("r1", engine, ref, opticalCase), "PASS");
});

test("a system LensVisualizer finds afocal is unsupported, with the item system.afocal and every line named", async (t) => {
  const lv = freshLv(t);
  addLens(lv, "window", [
    '{ label: "1", R: 1e15, d: 3, nd: 1.5, sd: 8 }',
    '{ label: "STO", R: 1e15, d: 10, nd: 1, sd: 4 }',
  ]);
  const binding = await bind(t, lv);
  const [engine, ref] = [engineOn(t, binding), refEngine(t)];
  const unsupportedFor = async (options: RunOptions): Promise<string> => {
    const opticalCase = await exported(binding, "window", options);
    const result = await ask(engine, opticalCase, PARAXIAL_FIRST_ORDER);
    assert.equal(result.status, "unsupported");
    assert.deepEqual(
      result.unsupported?.map(({ code, item }) => [code, item]),
      [["feature", "system.afocal"]],
    );
    assert.deepEqual(validateKind("result", result), []);
    // The system is described all the same, and the reference engine has no focal length for it either.
    assert.equal(await verdictOf("r0", engine, ref, opticalCase), "PASS");
    assert.match(
      await verdictOf("r1", engine, ref, opticalCase),
      /^UNSUPPORTED: lv is unsupported; ref is unsupported$/,
    );
    return result.unsupported?.[0].message ?? "";
  };
  assert.equal(await unsupportedFor({}), "LensVisualizer finds no finite focal length at line 0");
  assert.equal(
    await unsupportedFor({ lines: { kind: "photopic" } }),
    "LensVisualizer finds no finite focal length at lines 0, 1, 2, 3, 4",
  );
});

// ── What it does not answer ──────────────────────────────────────────────────────────────────────────────────────

test("a case from any other source is unsupported, with the code case-source and the kind of the source", async (t) => {
  const lv = engineOn(t, await bind(t, freshLv(t)));
  for (const quantity of [SYSTEM_DESCRIBE, PARAXIAL_FIRST_ORDER]) {
    const result = await ask(lv, SINGLET_CASE, quantity);
    assert.equal(result.status, "unsupported");
    assert.deepEqual(
      result.unsupported?.map(({ code, item }) => [code, item]),
      [["case-source", "fixture"]],
    );
    assert.match(result.unsupported?.[0].message ?? "", /came from a fixture, not from a LensVisualizer lens/);
    assert.deepEqual(validateKind("result", result), []);
  }
  // What its descriptor rules out is said first, in negotiation's own words.
  const unknown = await ask(lv, SINGLET_CASE, "rays.trace");
  assert.deepEqual(
    unknown.unsupported?.map(({ code, item }) => [code, item]),
    [["quantity", "rays.trace"]],
  );
});

test("a spec that is not the quantity's is an error with the code bad-spec", async (t) => {
  const binding = await bind(t, freshLv(t));
  const opticalCase = await exported(binding, "acme-singlet-50");
  const result = await ask(engineOn(t, binding), opticalCase, SYSTEM_DESCRIBE, { sagFractions: [0.5, 0.25] });
  assert.equal(result.status, "error");
  assert.equal(result.error?.code, "bad-spec");
  assert.match(result.error?.message ?? "", /the fractions must ascend/);
});

// ── Stale cases ──────────────────────────────────────────────────────────────────────────────────────────────────

test("a case whose lens file changed since it was exported is stale-case, and the lens file is named", async (t) => {
  const lv = freshLv(t);
  const first = await bind(t, lv);
  const opticalCase = await exported(first, "acme-singlet-50");
  assert.equal((await ask(engineOn(t, first), opticalCase, SYSTEM_DESCRIBE)).status, "ok");
  first.close();

  // The same checkout with the first radius of the lens rewritten: another system under the same key.
  const edited = variantOf(lv, "edited", { [SINGLET_FILE]: (text) => text.replace("R: 50,", "R: 51,") });
  const engine = engineOn(t, await bind(t, edited));
  for (const quantity of [SYSTEM_DESCRIBE, PARAXIAL_FIRST_ORDER]) {
    const result = await ask(engine, opticalCase, quantity);
    assert.equal(result.status, "error");
    assert.equal(result.error?.code, STALE_CASE);
    assert.equal(STALE_CASE, "stale-case");
    const message = result.error?.message ?? "";
    assert.match(message, /^the case of lens acme-singlet-50 is stale: its system is not the one LensVisualizer gives/);
    const [then, now] = [fileHash(lv, SINGLET_FILE), fileHash(edited, SINGLET_FILE)].map((hash) => hash.slice(0, 12));
    assert.ok(
      message.endsWith(
        `changed since it was exported: the lens file ${SINGLET_FILE} ` +
          `(sha256 ${then} when the case was exported, ${now} now)`,
      ),
      message,
    );
    assert.ok(!message.includes("engine code"), "the engine closure is the same in both trees");
  }
});

test("a case that other engine code exported otherwise is stale-case, and the closure is named", async (t) => {
  const lv = freshLv(t);
  const first = await bind(t, lv);
  const opticalCase = await exported(first, "acme-singlet-50");
  first.close();

  // The same lens under a clip rule with twice the tolerance: every clear aperture of the case is another number.
  const edited = variantOf(lv, "edited", {
    "src/optics/trace/aperture.ts": (text) => text.replace("Math.max(1e-9,", "Math.max(2e-9,"),
  });
  const binding = await bind(t, edited);
  const result = await ask(engineOn(t, binding), opticalCase, SYSTEM_DESCRIBE);
  assert.equal(result.error?.code, STALE_CASE);
  const [then, now] = [opticalCase.provenance.lv?.closureHash, binding.engineClosure().engineClosureHash];
  assert.notEqual(then, now);
  const message = result.error?.message ?? "";
  assert.ok(
    message.endsWith(
      "changed since it was exported: LensVisualizer's engine code " +
        `(closure ${then?.slice(0, 12)} when the case was exported, ${now.slice(0, 12)} now)`,
    ),
    message,
  );
  assert.ok(!message.includes("the lens file"), "the lens file is the same in both trees");
});

test("a file that changed without changing the case leaves the case fresh: identity is content", async (t) => {
  const lv = freshLv(t);
  const first = await bind(t, lv);
  const opticalCase = await exported(first, "acme-singlet-50");
  first.close();
  const edited = variantOf(lv, "edited", {
    [SINGLET_FILE]: (text) => `${text}// a comment\n`,
    "src/optics/trace/aperture.ts": (text) => `${text}// a comment\n`,
  });
  const binding = await bind(t, edited);
  assert.notEqual(binding.engineClosure().engineClosureHash, opticalCase.provenance.lv?.closureHash);
  assert.equal((await ask(engineOn(t, binding), opticalCase, SYSTEM_DESCRIBE)).status, "ok");
});

test("a case that was altered is stale-case, and the message says that nothing else changed", async (t) => {
  const binding = await bind(t, freshLv(t));
  const engine = engineOn(t, binding);
  const opticalCase = await exported(binding, "acme-zoom-24-48", { lines: { kind: "photopic" } });
  const untouched =
    "neither the lens file nor LensVisualizer's engine code has changed since it was exported: " +
    "the case itself was altered";

  // One index, of one glass at one line, nudged by a part in a million: the system is the same, the light is not.
  const nudged = altered(opticalCase, (draft) => {
    const table = decodeNdArray(draft.conditions.indexAfterSurface);
    assert.ok(table.dtype === "f8" && table.values[7] > 1);
    table.values[7] *= 1 + 1e-6;
    Object.assign(draft.conditions, { indexAfterSurface: encodeNdArray(table.values, table.shape) });
  });
  assert.equal(nudged.systemId, opticalCase.systemId);
  assert.notEqual(nudged.id, opticalCase.id);
  for (const quantity of [SYSTEM_DESCRIBE, PARAXIAL_FIRST_ORDER]) {
    const result = await ask(engine, nudged, quantity);
    assert.equal(result.error?.code, STALE_CASE, quantity);
    assert.equal(
      result.error?.message,
      "the case of lens acme-zoom-24-48 is stale: its conditions are not the ones LensVisualizer gives for the " +
        `same lines, stop and focus; ${untouched}`,
    );
  }

  // A radius of the system rewritten, a line called authored that is not, and a weight that is not the spectrum's.
  const reshaped = altered(opticalCase, (draft) => {
    Object.assign(draft.system.surfaces[0].shape, { radius: 40.001 });
  });
  const reshapedResult = await ask(engine, reshaped, SYSTEM_DESCRIBE);
  assert.equal(reshapedResult.error?.code, STALE_CASE);
  assert.match(reshapedResult.error?.message ?? "", /stale: its system is not the one LensVisualizer gives/);
  const relabelled = altered(opticalCase, (draft) => {
    Object.assign(draft.conditions.lines[0], { indexSource: "authored" });
  });
  assert.equal((await ask(engine, relabelled, SYSTEM_DESCRIBE)).error?.code, STALE_CASE);
  // A case that does not say which engine code exported it cannot be told that the code is unchanged.
  const unsigned = altered(nudged, (draft) => delete (draft.provenance as { lv?: unknown }).lv);
  const unsignedResult = await ask(engine, unsigned, SYSTEM_DESCRIBE);
  assert.equal(unsignedResult.error?.code, STALE_CASE);
  assert.ok(
    unsignedResult.error?.message.endsWith(
      "the lens file has not changed since it was exported, and the case does not say which engine code exported it",
    ),
    unsignedResult.error?.message,
  );
  // The untouched case is still answered.
  assert.equal((await ask(engine, opticalCase, SYSTEM_DESCRIBE)).status, "ok");
});

test("a case that states another state, no state, or a lens LensVisualizer does not have is stale-case", async (t) => {
  const binding = await bind(t, freshLv(t));
  const engine = engineOn(t, binding);
  const opticalCase = await exported(binding, "acme-zoom-24-48", { state: { zoomT: 1 } });
  const withSource = (edit: (source: Record<string, unknown>) => void): OpticalCase =>
    altered(opticalCase, (draft) => edit(draft.provenance.source as unknown as Record<string, unknown>));
  const staleFor = async (stale: OpticalCase): Promise<string> => {
    const result = await ask(engine, stale, PARAXIAL_FIRST_ORDER);
    assert.equal(result.error?.code, STALE_CASE);
    return result.error?.message ?? "";
  };

  // The label is for people: it is the provenance that says which state the case was read from.
  const relabelled = altered(opticalCase, (draft) => Object.assign(draft.label, { zoomT: 0 }));
  assert.equal((await ask(engine, relabelled, PARAXIAL_FIRST_ORDER)).status, "ok");
  assert.match(await staleFor(withSource((source) => (source.zoomT = 0))), /its system is not the one LensVisualizer/);
  assert.match(
    await staleFor(withSource((source) => delete source.focusT)),
    /stale: the case does not state the zoom and focus position it was exported at; export it again$/,
  );
  assert.match(
    await staleFor(withSource((source) => (source.lensKey = "acme-zoom-24-49"))),
    /stale: LensVisualizer has no such lens to build now: unknown-lens: unknown lens "acme-zoom-24-49"/,
  );
  // A focus position LensVisualizer certifies no object distance for cannot be exported, then or now.
  assert.match(
    await staleFor(withSource((source) => (source.focusT = 0.5))),
    /stale: LensVisualizer does not export the lens as the case states it \(finite-conjugate-unavailable: /,
  );
});

// ── Without LensVisualizer ───────────────────────────────────────────────────────────────────────────────────────

test("without a LensVisualizer the engine is unavailable, with a code that says why", async (t) => {
  const unavailable = async (lvPath: string | null): Promise<EngineUnavailableError> => {
    const error = await createLvEngine(lvPath).then(
      () => null,
      (reason: unknown) => reason,
    );
    assert.ok(error instanceof EngineUnavailableError, String(error));
    assert.equal(error.engineId, "lv");
    return error;
  };
  const unconfigured = await unavailable(null);
  assert.equal(unconfigured.code, "not-configured");
  assert.equal(
    unconfigured.message,
    "engine lv is unavailable (not-configured): LensVisualizer is not configured: " +
      "set lvPath in lvrtc.local.json or LVRTC_LV_PATH",
  );

  const lv = freshLv(t);
  const missing = await unavailable(join(lv, "nowhere"));
  assert.equal(missing.code, "load-failed");
  assert.match(
    missing.message,
    /^engine lv is unavailable \(load-failed\): LensVisualizer cannot be loaded \(path-missing\): /,
  );
  rmSync(join(lv, "src/optics/math/paraxial.ts"));
  const broken = await unavailable(lv);
  assert.equal(broken.code, "load-failed");
  assert.match(broken.message, /cannot be loaded \(import-failed\): .*src\/optics\/math\/paraxial\.ts/);
});

test("the built-in engine lv is LensVisualizer at the configuration's lvPath", async (t) => {
  const lv = freshLv(t);
  const rootDir = tempDir(t);
  writeFileSync(join(rootDir, "lvrtc.config.json"), JSON.stringify({ lvPath: lv }));
  const loaded = loadConfig({ rootDir, env: {} });
  assert.ok(Object.hasOwn(BUILTIN_ENGINES, LV_ENGINE_ID));
  const adapter = await createEngineRegistry(loaded).create("lv");
  t.after(() => adapter.close());
  const descriptor = await adapter.describe();
  assert.equal(descriptor.identity.id, "lv");
  assert.equal(descriptor.identity.fingerprint, closureOf(lv, FAKE_ENGINE_FILES));
  // Closing the engine leaves the binding to whoever else uses it: the case source of the same run does.
  const binding = await bind(t, lv);
  await adapter.close();
  assert.equal((await exported(binding, "acme-singlet-50")).label.lensKey, "acme-singlet-50");
});

test("a run with lv and no LensVisualizer fails lv's jobs with the code, and no other engine's", async (t) => {
  const rootDir = tempDir(t);
  writeFileSync(join(rootDir, "lvrtc.config.json"), JSON.stringify({ lvPath: null }));
  const registry = createEngineRegistry(loadConfig({ rootDir, env: {} }));
  const suite = suiteOf("no-lv", [{ name: "singlet", opticalCase: SINGLET_CASE }]);
  const result = await runSuite({
    suite,
    registry,
    runsDir: join(rootDir, "runs"),
    engines: ["lv", "ref"],
    rungs: ["r0", "r1"],
  });
  assert.deepEqual(
    result.manifest.jobs.map((job) => [job.rung, job.engine, job.status, job.error?.code ?? null]),
    [
      ["r0", "lv", "error", "not-configured"],
      ["r0", "ref", "ok", null],
      ["r1", "lv", "error", "not-configured"],
      ["r1", "ref", "ok", null],
    ],
  );
  assert.deepEqual(
    result.manifest.engines.map((engine) => [engine.id, engine.status]),
    [
      ["lv", "unavailable"],
      ["ref", "available"],
    ],
  );
  assert.match(result.outcomes[0].detail ?? "", /LensVisualizer is not configured/);
});

test("a run on lv of a fixture case records the refusal, which is an answer and is stored", async (t) => {
  const lv = freshLv(t);
  await bind(t, lv);
  const rootDir = tempDir(t);
  writeFileSync(join(rootDir, "lvrtc.config.json"), JSON.stringify({ lvPath: lv }));
  const registry = createEngineRegistry(loadConfig({ rootDir, env: {} }));
  const suite = suiteOf("fixture-on-lv", [{ name: "singlet", opticalCase: SINGLET_CASE }]);
  const input = { suite, registry, runsDir: join(rootDir, "runs"), engines: ["lv"], rungs: ["r0"] };
  const result = await runSuite(input);
  assert.deepEqual(
    result.manifest.jobs.map(({ status, unsupported }) => [status, unsupported]),
    [["unsupported", [{ code: "case-source", item: "fixture" }]]],
  );
  assert.equal(result.outcomes[0].source, "computed");
  assert.equal((await runSuite(input)).outcomes[0].source, "cached");
  assert.equal(CONTRACT_VERSION, result.manifest.contract);
});

test("a lens file edited after the engine loaded it does not reach the engine", async (t) => {
  const lv = freshLv(t);
  const binding = await bind(t, lv);
  const engine = engineOn(t, binding);
  const opticalCase = await exported(binding, "acme-singlet-50");
  appendFileSync(join(lv, SINGLET_FILE), "// edited after it was loaded\n");
  assert.equal((await ask(engine, opticalCase, SYSTEM_DESCRIBE)).status, "ok");
  // The case source's audit is what notices such an edit, at the end of a run.
  assert.deepEqual(binding.changedLensFiles((await binding.catalog()).entries), [SINGLET_FILE]);
});
