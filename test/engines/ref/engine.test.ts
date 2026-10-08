// The reference engine as an engine: what it says of itself, and its two quantities asked through the protocol,
// as a run asks them. The numbers are held to the contract's fixtures of the singlet, which corpus.ts works out
// from textbook formulas, and to optiland's focal length of the Double-Gauss sample.
import assert from "node:assert/strict";
import { cpSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { finalizeCase } from "../../../src/contract/case.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import { FEATURE_FLAGS } from "../../../src/contract/features.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import {
  AFOCAL_SYSTEM,
  FIRST_ORDER_VALUES,
  LINEAR_SAG_TERM,
  PARAXIAL_FIRST_ORDER,
} from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import type { ParaxialFirstOrderData } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../../../src/contract/quantities/systemDescribe.ts";
import type { SystemDescribeData } from "../../../src/contract/quantities/systemDescribe.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import { validateKind } from "../../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import { sha256Hex } from "../../../src/core/numeric/hash.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { negotiate } from "../../../src/core/negotiate.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { runConformance } from "../../../src/engines/conformance.ts";
import {
  REF_ENGINE_ID,
  REF_ENGINE_VERSION,
  REF_FEATURES,
  createRefEngine,
  refDescriptor,
} from "../../../src/engines/ref/engine.ts";
import { REF_SOURCE_DIRECTORY, refFingerprint } from "../../../src/engines/ref/fingerprint.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { QUANTITIES } from "../../../src/quantities/index.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import {
  ALL_FEATURES_CASE,
  DESCRIBE_DATA_SINGLET,
  DESCRIBE_SPEC_THREE,
  FIRST_ORDER_DATA_SINGLET,
  SINGLET_CASE,
} from "../../contract/corpus.ts";
import { DOUBLE_GAUSS, tempDir } from "../../core/support.ts";
import { caseOf, sphere } from "./support.ts";

/** The reference engine behind an adapter, as a run reaches it; closed when the test ends. */
function refEngine(t: TestContext): RemoteEngineAdapter {
  const adapter = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => adapter.close());
  return adapter;
}

/** The engine's answer to one quantity about one case. */
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

async function described(t: TestContext, opticalCase: OpticalCase, spec: JsonObject = {}): Promise<SystemDescribeData> {
  return dataOf(await ask(refEngine(t), opticalCase, SYSTEM_DESCRIBE, spec), SYSTEM_DESCRIBE);
}

async function firstOrderOf(t: TestContext, opticalCase: OpticalCase): Promise<ParaxialFirstOrderData> {
  return dataOf(await ask(refEngine(t), opticalCase, PARAXIAL_FIRST_ORDER), PARAXIAL_FIRST_ORDER);
}

function f8(wire: NdArrayWire): number[] {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return [...decoded.values];
}

// ── Who it is ────────────────────────────────────────────────────────────────────────────────────────────────────

test("ref describes itself: its id, a fingerprint of its sources, its features and its two quantities", async (t) => {
  const descriptor = await refEngine(t).describe();
  assert.deepEqual(validateKind("engine-descriptor", descriptor), []);
  assert.deepEqual(descriptor, refDescriptor());
  assert.deepEqual(descriptor.contract, { min: CONTRACT_VERSION, max: CONTRACT_VERSION });
  assert.equal(descriptor.identity.id, "ref");
  assert.equal(REF_ENGINE_ID, "ref");
  assert.equal(descriptor.identity.version, REF_ENGINE_VERSION);
  assert.match(descriptor.identity.fingerprint, /^[0-9a-f]{64}$/);
  assert.deepEqual(descriptor.capabilities.quantities, {
    "paraxial.first-order": { version: QUANTITIES.get("paraxial.first-order")?.version },
    "system.describe": { version: QUANTITIES.get("system.describe")?.version },
  });
  assert.equal(descriptor.capabilities.deterministic, true);
  // Every feature of a case but an annular aperture, in the order of the flags, and no limit of any kind.
  assert.deepEqual(
    descriptor.capabilities.features.supported,
    FEATURE_FLAGS.filter((flag) => flag !== "aperture.annular"),
  );
  assert.deepEqual(descriptor.capabilities.features.supported, [...REF_FEATURES]);
  assert.deepEqual(descriptor.capabilities.features.limits, {});
});

test("the fingerprint is a hash of the engine's own source files, by path and content", (t) => {
  const files = readdirSync(REF_SOURCE_DIRECTORY).sort();
  assert.ok(files.includes("engine.ts") && files.includes("surface.ts") && files.includes("paraxial.ts"));
  assert.ok(files.every((file) => file.endsWith(".ts")));
  const lines = files.map((file) => `${file}\0${sha256Hex(readFileSync(join(REF_SOURCE_DIRECTORY, file)))}\n`);
  assert.deepEqual(refFingerprint(), { fingerprint: sha256Hex(lines.join("")), fileCount: files.length });
  assert.equal(refDescriptor().identity.fingerprint, refFingerprint().fingerprint);
  assert.deepEqual(refDescriptor().identity.details, { sourceFiles: files.length });

  // A copy of the sources elsewhere has the same fingerprint: no path of this machine is in it.
  const copy = join(tempDir(t), "ref");
  cpSync(REF_SOURCE_DIRECTORY, copy, { recursive: true });
  assert.deepEqual(refFingerprint(copy), refFingerprint());
  // A file that is not a source changes nothing; an edit, a renamed file and a new source each do.
  writeFileSync(join(copy, "NOTES.md"), "not a source\n");
  assert.deepEqual(refFingerprint(copy), refFingerprint());
  const seen = new Set([refFingerprint().fingerprint]);
  writeFileSync(join(copy, "surface.ts"), `${readFileSync(join(copy, "surface.ts"), "utf8")}// edited\n`);
  seen.add(refFingerprint(copy).fingerprint);
  renameSync(join(copy, "describe.ts"), join(copy, "echo.ts"));
  seen.add(refFingerprint(copy).fingerprint);
  writeFileSync(join(copy, "deeper.ts"), "export {};\n");
  seen.add(refFingerprint(copy).fingerprint);
  assert.equal(seen.size, 4);
  assert.equal(refFingerprint(copy).fileCount, files.length + 1);
});

test("ref conforms to the protocol; it offers no selftest.echo, so those checks are skipped", async () => {
  const report = await runConformance({
    id: "ref",
    createTransport: () => createInProcessTransport(createRefEngine()),
  });
  assert.equal(report.passed, true, JSON.stringify(report.checks.filter((check) => check.status === "fail")));
  const ended = Object.fromEntries(report.checks.map((check) => [check.id, check.status]));
  for (const id of ["hello", "contract-range", "engine-id", "unknown-quantity", "malformed-run", "ids-echoed"]) {
    assert.equal(ended[id], "pass", id);
  }
  assert.equal(ended.deterministic, "pass");
  assert.equal(ended.shutdown, "pass");
  assert.equal(ended["echo.matrix"], "skipped");
});

// ── system.describe ──────────────────────────────────────────────────────────────────────────────────────────────

test("system.describe of the singlet is the contract's fixture: exact in what is copied, to rounding in the sag", async (t) => {
  const data = await described(t, SINGLET_CASE, DESCRIBE_SPEC_THREE);
  const { sag, ...copied } = data;
  const { sag: expectedSag, ...expected } = DESCRIBE_DATA_SINGLET;
  assert.deepEqual(copied, expected);
  const [actual, wanted] = [f8(sag), f8(expectedSag)];
  assert.equal(actual.length, 6);
  actual.forEach((value, index) => {
    assert.ok(Math.abs(value - wanted[index]) <= 2 ** -51 * Math.abs(wanted[index]), `sag ${index}: ${value}`);
  });
  // The stop is on the first surface, and it clips by its own aperture, not by the stop's radius.
  assert.equal(f8(data.clipRadius)[0], 10);
  assert.equal(data.stopSemiDiameter, 5);
});

test("without fractions the sag is given at nine radii, from the vertex to the nominal semi-diameter", async (t) => {
  const data = await described(t, DOUBLE_GAUSS);
  const surfaces = DOUBLE_GAUSS.system.surfaces;
  assert.equal(data.surfaceCount, surfaces.length);
  assert.deepEqual(data.sagRadii.$nd.shape, [surfaces.length, 9]);
  assert.deepEqual(data.sag.$nd.shape, [surfaces.length, 9]);
  const radii = f8(data.sagRadii);
  surfaces.forEach((surface, index) => {
    const row = radii.slice(index * 9, index * 9 + 9);
    assert.deepEqual(
      row,
      DEFAULT_SAG_FRACTIONS.map((fraction) => fraction * surface.aperture.nominalSemiDiameter),
    );
    assert.equal(row[0], 0);
    assert.equal(row[8], surface.aperture.nominalSemiDiameter);
  });
  // The same request with the fractions stated is the same answer.
  assert.deepEqual(await described(t, DOUBLE_GAUSS, { sagFractions: [...DEFAULT_SAG_FRACTIONS] }), data);
});

test("the Double-Gauss is described as the case states it, and its sag is that of each sphere", async (t) => {
  const data = await described(t, DOUBLE_GAUSS);
  const { surfaces, stopIndex } = DOUBLE_GAUSS.system;
  assert.equal(data.stopIndex, stopIndex);
  assert.equal(data.imageZ, DOUBLE_GAUSS.conditions.imageZ);
  assert.equal(data.stopSemiDiameter, DOUBLE_GAUSS.conditions.stopSemiDiameter);
  assert.deepEqual(
    f8(data.vertexZ),
    surfaces.map((surface) => surface.z),
  );
  assert.deepEqual(
    f8(data.curvature),
    surfaces.map(({ shape }) => (shape.kind === "plane" ? 0 : 1 / (shape.radius as number))),
  );
  assert.deepEqual(
    f8(data.conic),
    surfaces.map(() => 0),
  );
  // Every surface clips by its own aperture: the stop row is wider than the stop's radius in this fixture.
  assert.deepEqual(
    f8(data.clipRadius),
    surfaces.map((surface) => surface.aperture.semiDiameter),
  );
  assert.ok(f8(data.clipRadius)[stopIndex] > data.stopSemiDiameter);
  assert.deepEqual(data.indexAfterSurface, DOUBLE_GAUSS.conditions.indexAfterSurface);
  assert.deepEqual(
    data.terms,
    surfaces.map(() => []),
  );

  const [radii, sags] = [f8(data.sagRadii), f8(data.sag)];
  surfaces.forEach(({ shape }, index) => {
    for (let sample = 0; sample < 9; sample++) {
      const [r, z] = [radii[index * 9 + sample], sags[index * 9 + sample]];
      if (shape.kind === "plane") assert.equal(z, 0);
      else {
        // A point of a sphere: r^2 + (z - R)^2 = R^2.
        const radius = shape.radius as number;
        const residual = r * r + (z - radius) * (z - radius) - radius * radius;
        assert.ok(Math.abs(residual) <= 1e-12 * radius * radius, `surface ${index}, sample ${sample}`);
      }
    }
  });
});

test("an asphere is described with its terms, a flat base with curvature 0, and several lines with a row each", async (t) => {
  // The every-feature case has an annular aperture, which ref does not take: the same surfaces without it.
  const { label, system, conditions, provenance } = ALL_FEATURES_CASE;
  const surfaces = system.surfaces.map((surface) => ({
    ...surface,
    aperture: { ...surface.aperture, innerSemiDiameter: 0 },
  }));
  const plain = finalizeCase({ label, system: { ...system, surfaces }, conditions, provenance });
  assert.ok(!plain.features.includes("aperture.annular"));
  assert.ok(plain.features.includes("surface.asphere.flat-base") && plain.features.includes("lines.multiple"));

  const data = await described(t, plain, { sagFractions: [0.5, 1] });
  assert.deepEqual(
    data.terms,
    surfaces.map(({ shape }) => (shape.kind === "asphere" ? shape.terms : [])),
  );
  assert.deepEqual(
    f8(data.curvature),
    surfaces.map(({ shape }) => (shape.kind === "plane" || shape.radius === null ? 0 : 1 / shape.radius)),
  );
  assert.deepEqual(
    f8(data.conic),
    surfaces.map(({ shape }) => (shape.kind === "plane" ? 0 : shape.conic)),
  );
  assert.deepEqual(data.indexAfterSurface, plain.conditions.indexAfterSurface);
  assert.equal(data.indexAfterSurface.$nd.shape[0], plain.conditions.lines.length);

  // The flat-base asphere, surface 4 of the case: its sag is its two terms alone.
  const flat = surfaces.findIndex(({ shape }) => shape.kind === "asphere" && shape.radius === null);
  const shape = surfaces[flat].shape;
  assert.ok(shape.kind === "asphere");
  const r = surfaces[flat].aperture.nominalSemiDiameter;
  const expected = shape.terms.reduce((sum, { power, coeff }) => sum + coeff * r ** power, 0);
  const rim = f8(data.sag)[flat * 2 + 1];
  assert.ok(Math.abs(rim - expected) <= 1e-15 * Math.max(1, Math.abs(expected)), `${rim} against ${expected}`);
});

test("a sag the surface does not have is a NaN, and a -0 of the case is described as 0", async (t) => {
  // A ball: a sphere of radius 6 with a nominal semi-diameter of 8. Beyond r = 6 there is no surface.
  const ball = caseOf([
    { z: 0, shape: sphere(6), index: 1.5, semiDiameter: 8 },
    { z: 12, shape: sphere(-6), index: 1, semiDiameter: 8 },
  ]);
  const data = await described(t, ball, { sagFractions: [0.5, 0.75, 1] });
  const sags = f8(data.sag);
  assert.ok(Number.isFinite(sags[0]) && sags[0] > 0, "r = 4");
  assert.equal(sags[1], 6, "r = 6, the equator");
  assert.ok(Number.isNaN(sags[2]), "r = 8");
  assert.ok(Number.isFinite(sags[3]) && sags[3] < 0);
  assert.equal(sags[4], -6);
  assert.ok(Number.isNaN(sags[5]));

  // The same case with its first vertex and a conic constant spelled -0: the same identity, the same answer.
  const spelled: OpticalCase = JSON.parse(
    JSON.stringify(ball).replace('"z":0,', '"z":-0,').replace('"conic":0', '"conic":-0'),
  );
  assert.ok(Object.is(spelled.system.surfaces[0].z, -0));
  assert.equal(spelled.id, ball.id);
  const again = await described(t, spelled, { sagFractions: [0.5, 0.75, 1] });
  assert.ok(Object.is(f8(again.vertexZ)[0], 0) && Object.is(f8(again.conic)[0], 0));
  assert.deepEqual(again, data);
  // At the vertex of a surface that curves toward -z the sag is 0, not -0.
  const vertex = await described(t, ball, { sagFractions: [0] });
  assert.ok(f8(vertex.sag).every((value) => Object.is(value, 0)));
});

// ── paraxial.first-order ─────────────────────────────────────────────────────────────────────────────────────────

test("paraxial.first-order of the singlet is the contract's fixture, worked out from the thick-lens formulas", async (t) => {
  const data = await firstOrderOf(t, SINGLET_CASE);
  assert.deepEqual(data.recorded, {});
  for (const name of FIRST_ORDER_VALUES) {
    const [[actual], [expected]] = [f8(data[name]), f8(FIRST_ORDER_DATA_SINGLET[name])];
    assert.deepEqual(data[name].$nd.shape, [1], name);
    assert.ok(Math.abs(actual - expected) <= 1e-13 * Math.max(1, Math.abs(expected)), `${name}: ${actual}`);
  }
  // In numbers one can check on paper: P1 = P2 = 0.010336, P = 0.020672 - 0.000282, so f = 49.04 mm; and the lens
  // is its own entrance pupil.
  assert.ok(Math.abs(f8(data.efl)[0] - 49.043) < 1e-3, String(f8(data.efl)[0]));
  assert.equal(f8(data.entrancePupilZ)[0], 0);
  assert.equal(f8(data.entrancePupilSemiDiameter)[0], 5);
});

test("the Double-Gauss has optiland's focal length, 100.00372050801042 mm, within 1e-9", async (t) => {
  const data = await firstOrderOf(t, DOUBLE_GAUSS);
  const [efl] = f8(data.efl);
  // optiland's paraxial f2() for the same prescription at the d line (contract/CONTRACT.md, "The Double-Gauss case").
  assert.ok(Math.abs(efl - 100.00372050801042) <= 1e-9, `efl ${efl}`);
  // The fixture's stop radius is optiland's marginal-ray height at the stop for f/5: the entrance pupil that this
  // stop gives has the radius f / (2 * 5), which is a second number from outside.
  const [entrance] = f8(data.entrancePupilSemiDiameter);
  assert.ok(Math.abs(entrance - 100.00372050801042 / 10) <= 1e-9, `entrance pupil radius ${entrance}`);
  // The back focus is measured from the last lens vertex, and the focal length is between its two points.
  const last = DOUBLE_GAUSS.system.surfaces[DOUBLE_GAUSS.system.lastLensSurfaceIndex].z;
  assert.equal(f8(data.backFocus)[0], f8(data.rearFocalZ)[0] - last);
  assert.ok(Math.abs(f8(data.rearFocalZ)[0] - f8(data.rearPrincipalZ)[0] - efl) <= 1e-12);
  assert.ok(Math.abs(f8(data.frontPrincipalZ)[0] - f8(data.frontFocalZ)[0] - efl) <= 1e-12);
  // The sample's image plane is at its paraxial focus to the 0.05 um its numbers are rounded to.
  assert.ok(Math.abs(f8(data.rearFocalZ)[0] - DOUBLE_GAUSS.conditions.imageZ) < 5e-5);
});

test("every line has its own data, from its own row of the index table", async (t) => {
  // An equiconvex thin lens of R = 50: f = 50 at n = 1.5, 250/6 at n = 1.6 and 250/7 at n = 1.7.
  const lens = caseOf(
    [
      { z: 0, shape: sphere(50), index: [1.5, 1.6, 1.7] },
      { z: 0, shape: sphere(-50), index: [1, 1, 1] },
    ],
    { lines: 3 },
  );
  const data = await firstOrderOf(t, lens);
  const efl = f8(data.efl);
  assert.equal(efl.length, 3);
  [50, 250 / 6, 250 / 7].forEach((expected, line) => {
    assert.ok(Math.abs(efl[line] - expected) <= 1e-13 * expected, `line ${line}: ${efl[line]}`);
  });
  for (const name of FIRST_ORDER_VALUES) assert.deepEqual(data[name].$nd.shape, [3], name);
  // One line of the same lens is that line's column, bit for bit.
  const single = caseOf([
    { z: 0, shape: sphere(50), index: 1.6 },
    { z: 0, shape: sphere(-50), index: 1 },
  ]);
  const alone = await firstOrderOf(t, single);
  for (const name of FIRST_ORDER_VALUES) assert.equal(f8(alone[name])[0], f8(data[name])[1], name);
});

test("a rear plate lies inside the back focus, which is measured from the last lens vertex", async (t) => {
  const lens = [
    { z: 0, shape: sphere(60), index: 1.5168 },
    { z: 5, shape: sphere(-60), index: 1 },
  ];
  const plate = [
    { z: 12, shape: sphere(Infinity), index: 1.5168, synthetic: "rearPlate" as const },
    { z: 14.5, shape: sphere(Infinity), index: 1, synthetic: "rearPlate" as const },
  ];
  const bare = await firstOrderOf(t, caseOf(lens));
  const covered = caseOf([...lens, ...plate]);
  assert.equal(covered.system.lastLensSurfaceIndex, 1);
  const data = await firstOrderOf(t, covered);
  // A plate of thickness t and index n moves the focus back by t (1 - 1/n).
  const shift = 2.5 * (1 - 1 / 1.5168);
  assert.ok(Math.abs(f8(data.rearFocalZ)[0] - (f8(bare.rearFocalZ)[0] + shift)) <= 1e-12);
  assert.ok(Math.abs(f8(data.backFocus)[0] - (f8(bare.backFocus)[0] + shift)) <= 1e-12);
  assert.ok(Math.abs(f8(data.efl)[0] - f8(bare.efl)[0]) <= 1e-12);
  assert.equal(f8(data.backFocus)[0], f8(data.rearFocalZ)[0] - 5);
});

test("a finite object records its magnification, one per line, and changes no compared value", async (t) => {
  const surfaces = [
    { z: 0, shape: sphere(50), index: [1.5, 1.6] },
    { z: 0, shape: sphere(-50), index: [1, 1] },
  ];
  const atInfinity = await firstOrderOf(t, caseOf(surfaces, { lines: 2 }));
  const finite = await firstOrderOf(t, caseOf(surfaces, { lines: 2, objectZ: -100 }));
  assert.deepEqual(Object.keys(finite.recorded), ["magnification"]);
  const magnification = f8(finite.recorded.magnification);
  // f = 50: an object at 2f is imaged at -1. f = 250/6: 1/l' = 6/250 - 1/100, m = l' / -100 = -5/7.
  assert.ok(Math.abs(magnification[0] - -1) <= 1e-14);
  assert.ok(Math.abs(magnification[1] - -5 / 7) <= 1e-14);
  for (const name of FIRST_ORDER_VALUES) assert.deepEqual(finite[name], atInfinity[name], name);
  assert.deepEqual(atInfinity.recorded, {});
});

test("a term of power 2 is curvature to a paraxial ray; a conic constant and higher terms are not", async (t) => {
  const withShape = (shape: OpticalCase["system"]["surfaces"][number]["shape"]): OpticalCase =>
    caseOf([
      { z: 0, shape, index: 1.5 },
      { z: 4, shape: sphere(Infinity), index: 1 },
    ]);
  const spherical = await firstOrderOf(t, withShape(sphere(40)));
  // z = r^2 / 80 is the paraboloid that osculates the sphere of radius 40.
  const terms = [
    { power: 2, coeff: 1 / 80 },
    { power: 4, coeff: 3e-6 },
    { power: 5, coeff: -2e-8 },
  ];
  const parabolic = await firstOrderOf(t, withShape({ kind: "asphere", radius: null, conic: 0, terms }));
  const conicAsphere = await firstOrderOf(
    t,
    withShape({ kind: "asphere", radius: 40, conic: -2.5, terms: terms.slice(1) }),
  );
  for (const name of FIRST_ORDER_VALUES) {
    assert.ok(Math.abs(f8(parabolic[name])[0] - f8(spherical[name])[0]) <= 1e-12, name);
    assert.equal(f8(conicAsphere[name])[0], f8(spherical[name])[0], name);
  }
});

// ── What it does not answer ──────────────────────────────────────────────────────────────────────────────────────

test("a system without a focal length, and a cone, have no first-order data: unsupported, with the item", async (t) => {
  const engine = refEngine(t);
  const plate = caseOf([
    { z: 0, shape: sphere(Infinity), index: 1.5168 },
    { z: 3, shape: sphere(Infinity), index: 1 },
  ]);
  const afocal = await ask(engine, plate, PARAXIAL_FIRST_ORDER);
  assert.equal(afocal.status, "unsupported");
  assert.deepEqual(afocal.unsupported, [
    { code: "feature", item: AFOCAL_SYSTEM, message: "the system has no finite focal length at line 0" },
  ]);
  assert.equal(AFOCAL_SYSTEM, "system.afocal");
  // The plate is a system like any other to describe.
  assert.equal((await ask(engine, plate, SYSTEM_DESCRIBE)).status, "ok");

  // Afocal at one line of two is afocal: the answer has a value per line or none.
  const telescope = caseOf(
    [
      { z: 0, shape: sphere(100), index: [1.5, 1.5] },
      { z: 0, shape: sphere(-100), index: [1, 1] },
      { z: 150, shape: sphere(50), index: [1.5, 1.6] },
      { z: 150, shape: sphere(-50), index: [1, 1] },
    ],
    { lines: 2 },
  );
  const partly = await ask(engine, telescope, PARAXIAL_FIRST_ORDER);
  assert.equal(partly.status, "unsupported");
  assert.equal(partly.unsupported?.[0].message, "the system has no finite focal length at line 0");

  const cone = caseOf([
    { z: 0, shape: sphere(50), index: 1.5 },
    { z: 4, shape: { kind: "asphere", radius: -50, conic: 0, terms: [{ power: 1, coeff: 1e-3 }] }, index: 1 },
  ]);
  const linear = await ask(engine, cone, PARAXIAL_FIRST_ORDER);
  assert.equal(linear.status, "unsupported");
  assert.deepEqual(linear.unsupported, [
    {
      code: "feature",
      item: LINEAR_SAG_TERM,
      message: "surface 1 has a term of power 1: a cone has no curvature at its vertex",
    },
  ]);
  assert.equal(LINEAR_SAG_TERM, "surface.asphere.linear-term");
  // Its sag is defined, so it is described, with the term.
  const data: SystemDescribeData = dataOf(await ask(engine, cone, SYSTEM_DESCRIBE), SYSTEM_DESCRIBE);
  assert.deepEqual(data.terms[1], [{ power: 1, coeff: 1e-3 }]);
});

test("ref answers nothing its own descriptor rules out: another quantity, or a case with an annular aperture", async (t) => {
  const engine = refEngine(t);
  const descriptor = await engine.describe();
  for (const quantity of ["selftest.echo", "rays.trace", "mtf.native"]) {
    const result = await ask(engine, SINGLET_CASE, quantity);
    assert.equal(result.status, "unsupported", quantity);
    assert.deepEqual(
      result.unsupported?.map(({ code, item }) => [code, item]),
      [["quantity", quantity]],
    );
  }
  // The every-feature case has an inner semi-diameter, which the model does not keep.
  assert.ok(ALL_FEATURES_CASE.features.includes("aperture.annular"));
  for (const quantity of [SYSTEM_DESCRIBE, PARAXIAL_FIRST_ORDER]) {
    const request = makeRequest({ caseId: ALL_FEATURES_CASE.id, quantity, spec: {} });
    const result = await engine.run(request, ALL_FEATURES_CASE);
    assert.equal(result.status, "unsupported", quantity);
    // What it says when it is asked is what negotiation reads from its descriptor without asking.
    assert.deepEqual(result.unsupported, negotiate(ALL_FEATURES_CASE, request, descriptor));
    assert.deepEqual(
      result.unsupported?.map(({ code, item }) => [code, item]),
      [["feature", "aperture.annular"]],
    );
  }
});

test("a spec that is not the quantity's is an error with the code bad-spec, and says what is wrong", async (t) => {
  const engine = refEngine(t);
  const specs: [quantity: string, spec: JsonObject, said: RegExp][] = [
    [SYSTEM_DESCRIBE, { sagFractions: [0, 1, 0.5] }, /\/sagFractions\/2 \[invariant\] the fractions must ascend/],
    [SYSTEM_DESCRIBE, { sagFractions: [0, 1.5] }, /\/sagFractions\/1 \[maximum\]/],
    [SYSTEM_DESCRIBE, { sagFractions: [] }, /\/sagFractions \[minItems\]/],
    [SYSTEM_DESCRIBE, { radii: [1, 2] }, /\/radii \[additionalProperties\]/],
    [PARAXIAL_FIRST_ORDER, { line: 0 }, /\/line \[additionalProperties\]/],
  ];
  for (const [quantity, spec, said] of specs) {
    const result = await ask(engine, SINGLET_CASE, quantity, spec);
    assert.equal(result.status, "error", JSON.stringify(spec));
    assert.equal(result.error?.code, "bad-spec");
    assert.match(result.error?.message ?? "", said);
    assert.ok(result.error?.message.startsWith(`spec is not a ${quantity} spec: `));
  }
});

// ── As an engine ─────────────────────────────────────────────────────────────────────────────────────────────────

test("equal requests give byte-equal results, and a result says how it was computed and of what", async (t) => {
  const engine = refEngine(t);
  for (const [quantity, method] of [
    [SYSTEM_DESCRIBE, "model-echo"],
    [PARAXIAL_FIRST_ORDER, "ray-transfer-matrix"],
  ]) {
    const [first, second] = [await ask(engine, DOUBLE_GAUSS, quantity), await ask(engine, DOUBLE_GAUSS, quantity)];
    assert.equal(canonicalJson(first), canonicalJson(second), quantity);
    assert.deepEqual(first.method, { name: method, params: {} });
    assert.deepEqual(first.diagnostics, { warnings: [], counts: { surfaces: 11, lines: 1 } });
    assert.equal(first.engine.id, "ref");
    assert.equal(first.engine.fingerprint, refFingerprint().fingerprint);
    // Another instance of the engine gives the same bytes: it keeps no state.
    assert.equal(canonicalJson(await ask(refEngine(t), DOUBLE_GAUSS, quantity)), canonicalJson(first), quantity);
  }
});
