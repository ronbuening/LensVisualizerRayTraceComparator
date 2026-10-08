// Probe ray sets: the rays of a case that is known only as a case, made from the case alone.
import assert from "node:assert/strict";
import { test } from "node:test";

import { finalizeCase } from "../../src/contract/case.ts";
import type { OpticalCase, SurfaceShape } from "../../src/contract/case.ts";
import { decodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../src/core/numeric/ndarray.ts";
import { createFixtureCaseSource } from "../../src/core/suite.ts";
import { profileOf, sag } from "../../src/engines/ref/surface.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import {
  LAUNCH_LEAD_MM,
  PROBE_SPAN,
  firstSurfaceFrontZ,
  launchBehindProblem,
  probeLattice,
  probeRaySets,
  startsInFront,
} from "../../src/rays/probe.ts";
import { DEFAULT_BUNDLE_GRID, DEFAULT_RAY_FIELDS, rayProblem, raySetId, raySetSpec } from "../../src/rays/raySets.ts";
import { ALL_FEATURES_CASE, SINGLET_CASE, SINGLET_DRAFT } from "../contract/corpus.ts";

function f8(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return decoded.values as Float64Array;
}

/** The singlet with another first surface. */
function withFirstSurface(shape: SurfaceShape, semiDiameter = 10): OpticalCase {
  const draft = structuredClone(SINGLET_DRAFT) as typeof SINGLET_DRAFT;
  const [first] = draft.system.surfaces;
  Object.assign(first, { shape, aperture: { semiDiameter, nominalSemiDiameter: semiDiameter, innerSemiDiameter: 0 } });
  return finalizeCase(draft);
}

test("the defaults are the fractions 0, 0.5 and 1 and 32 cells across", () => {
  assert.deepEqual(DEFAULT_RAY_FIELDS, { kind: "image-height-fractions", values: [0, 0.5, 1] });
  assert.equal(DEFAULT_BUNDLE_GRID, 32);
  assert.ok(Object.isFrozen(DEFAULT_RAY_FIELDS) && Object.isFrozen(DEFAULT_RAY_FIELDS.values));
  assert.equal(rayProblem("some-code", "what is wrong"), "some-code: what is wrong");
  assert.deepEqual([PROBE_SPAN, LAUNCH_LEAD_MM], [1.125, 10]);
});

test("a case has a probe lattice for the axis, and a coded problem for every fraction it cannot place", () => {
  const { sets, problems } = probeRaySets(SINGLET_CASE);
  assert.equal(sets.length, 1);
  assert.deepEqual(problems, [
    "field-fraction-unresolved: a case read from a file states no image height to take the fraction 0.5 of; " +
      "state the field as an angle (fields of kind angles-deg)",
    "field-fraction-unresolved: a case read from a file states no image height to take the fraction 1 of; " +
      "state the field as an angle (fields of kind angles-deg)",
  ]);
  const [spec] = sets;
  assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
  assert.equal(spec.line, 0);
  // 32 cells across 1.125 clip radii of 10 mm on either side: a step of 22.5 / 32 mm.
  assert.deepEqual(spec.groups, {
    field: { angleDeg: 0, heightFraction: 0 },
    lattice: { columns: 32, rows: 32, step: 22.5 / 32 },
  });
  assert.deepEqual(spec.origins.$nd.shape, [1024, 3]);
  const [origins, directions, weights] = [f8(spec.origins), f8(spec.directions), f8(spec.weights)];
  assert.ok(weights.every((weight) => weight === 1));
  let [inside, outside] = [0, 0];
  for (let ray = 0; ray < 1024; ray++) {
    assert.deepEqual([...directions.subarray(3 * ray, 3 * ray + 3)], [0, 0, 1]);
    // A convex first surface has nothing in front of its vertex: the launch plane is the lead in front of it.
    assert.equal(origins[3 * ray + 2], -LAUNCH_LEAD_MM);
    const radius = Math.hypot(origins[3 * ray], origins[3 * ray + 1]);
    assert.ok(
      radius > 0 && origins[3 * ray] !== 0 && origins[3 * ray + 1] !== 0,
      "no ray on the axis or in a plane through it",
    );
    if (radius > 10) outside++;
    else inside++;
  }
  // Most rays enter the first surface, and the ones past its rim are stopped at once.
  assert.ok(inside > 600 && outside > 150, `${inside} inside, ${outside} outside`);
  assert.equal(Math.max(...origins.filter((_value, index) => index % 3 === 0)), 11.25 - 22.5 / 64);
});

test("fields given as angles each have a lattice, in their order, and an odd grid is raised to an even one", () => {
  const fields = { kind: "angles-deg", values: [0, 12, -12] } as const;
  const { sets, problems } = probeRaySets(SINGLET_CASE, { fields, sampling: { bundleGrid: 5 } });
  assert.deepEqual(problems, []);
  assert.deepEqual(
    sets.map((spec) => spec.groups),
    [0, 12, -12].map((angleDeg) => ({ field: { angleDeg }, lattice: { columns: 6, rows: 6, step: 22.5 / 6 } })),
  );
  for (const spec of sets) {
    assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
    assert.equal(spec.weights.$nd.shape[0], 36);
    assert.ok(startsInFront(SINGLET_CASE.system.surfaces[0], f8(spec.origins)));
  }
  // A field toward +y sends its rays toward -y from above; the field toward -y is its mirror image.
  const [up, down] = [f8(sets[1].origins), f8(sets[2].origins)];
  assert.ok(f8(sets[1].directions)[1] < 0 && f8(sets[2].directions)[1] > 0);
  assert.ok(up[1] > f8(sets[0].origins)[1]);
  for (let ray = 0; ray < 36; ray++) {
    // Ray (row, column) of one is ray (5 - row, column) of the other, with y negated.
    const mirror = (5 - Math.floor(ray / 6)) * 6 + (ray % 6);
    assert.equal(up[3 * ray], down[3 * mirror]);
    assert.ok(Math.abs(up[3 * ray + 1] + down[3 * mirror + 1]) < 1e-13);
  }
});

test("every line of a case traces the same rays; a finite object sends them from its object point", () => {
  const fields = { kind: "angles-deg", values: [0, 3] } as const;
  const { sets, problems } = probeRaySets(ALL_FEATURES_CASE, { fields, sampling: { bundleGrid: 8 } });
  assert.deepEqual(problems, []);
  // Two fields at two lines: field by field, and line by line within a field.
  assert.deepEqual(
    sets.map((spec) => [spec.groups?.field?.angleDeg, spec.line]),
    [
      [0, 0],
      [0, 1],
      [3, 0],
      [3, 1],
    ],
  );
  assert.deepEqual({ ...sets[1], line: 0 }, sets[0]);
  assert.deepEqual({ ...sets[3], line: 0 }, sets[2]);
  assert.notDeepEqual(sets[2].origins, sets[0].origins);
  assert.equal(new Set(sets.map(raySetId)).size, 4);

  const object = ALL_FEATURES_CASE.conditions.object;
  assert.ok(object.kind === "finite");
  for (const [index, angleDeg] of [0, 3].entries()) {
    const spec = sets[2 * index];
    assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
    const [origins, directions, weights] = [f8(spec.origins), f8(spec.directions), f8(spec.weights)];
    // The object point of a field: on the object plane, toward +y for a positive angle, measured at the first vertex.
    const height: number = -object.z * Math.tan((angleDeg * Math.PI) / 180);
    for (let ray = 0; ray < 64; ray++) {
      assert.deepEqual([...origins.subarray(3 * ray, 3 * ray + 3)], [0, height, object.z]);
      assert.ok(directions[3 * ray + 2] > 0.99);
      assert.ok(weights[ray] > 0.9 && weights[ray] <= 1);
      assert.ok(Math.abs(weights[ray] - directions[3 * ray + 2] ** 3) < 1e-15);
    }
    assert.ok(startsInFront(ALL_FEATURES_CASE.system.surfaces[0], f8(spec.origins)));
  }
});

test("the launch plane lies in front of a first surface that is concave toward the object: in front of its rim", () => {
  // A sphere of radius -12 with a clear aperture of 10 mm: its rim is 5.4 mm in front of its vertex.
  const bowl = withFirstSurface({ kind: "conic", radius: -12, conic: 0 });
  const [first] = bowl.system.surfaces;
  const rim = sag(profileOf(first.shape), 10);
  assert.ok(rim < -5.3 && rim > -5.4);
  assert.equal(firstSurfaceFrontZ(first), rim);
  // A plane, a convex surface and a surface that is convex at its vertex have their front at the vertex.
  assert.equal(firstSurfaceFrontZ(withFirstSurface({ kind: "plane" }).system.surfaces[0]), 0);
  assert.equal(firstSurfaceFrontZ(SINGLET_CASE.system.surfaces[0]), 0);

  const fields = { kind: "angles-deg", values: [0, 15, -30, 60] } as const;
  const { sets, problems } = probeRaySets(bowl, { fields, sampling: { bundleGrid: 16 } });
  assert.deepEqual(problems, []);
  assert.equal(sets.length, 4);
  for (const spec of sets) {
    assert.deepEqual(raysTraceQuantity.validateSpec(spec), []);
    const origins = f8(spec.origins);
    // Every ray starts on one plane, the lead in front of the rim, however steep the field.
    for (let ray = 0; ray < 256; ray++) assert.equal(origins[3 * ray + 2], rim - LAUNCH_LEAD_MM);
    assert.ok(startsInFront(first, origins), `field at ${spec.groups?.field?.angleDeg} degrees`);
    // And each is still aimed at its cell of the lattice on the vertex plane, 15.4 mm further on.
    const [direction, step] = [f8(spec.directions), 22.5 / 16];
    const way = (0 - origins[2]) / direction[2];
    assert.ok(Math.abs(origins[0] + way * direction[0] - -7.5 * step) < 1e-12);
    assert.ok(Math.abs(origins[1] + way * direction[1] - -7.5 * step) < 1e-12);
  }

  // An asphere that turns forward toward its rim has its front at the rim; one that dips between vertex and rim
  // has it where it dips, which only sampling the sag finds.
  const gull = withFirstSurface({ kind: "asphere", radius: 40, conic: 0, terms: [{ power: 4, coeff: -1e-3 }] });
  const turned = sag(profileOf(gull.system.surfaces[0].shape), 10);
  assert.ok(turned < -8, String(turned));
  assert.equal(firstSurfaceFrontZ(gull.system.surfaces[0]), turned);
  const dipTerms = [
    { power: 2, coeff: -0.02 },
    { power: 4, coeff: 4e-4 },
  ];
  const dipped = withFirstSurface({ kind: "asphere", radius: null, conic: 0, terms: dipTerms });
  // -0.02 r^2 + 4e-4 r^4 is lowest at r = 5, where it is -0.25, and is back at 2 at the rim.
  assert.ok(Math.abs(firstSurfaceFrontZ(dipped.system.surfaces[0]) - -0.25) < 1e-3);
  assert.equal(sag(profileOf(dipped.system.surfaces[0].shape), 10), 2);
  // What the formula gives beyond the clear aperture is not the surface: a polynomial that plunges out there, where
  // the corner cells of the lattice are, moves no launch plane.
  const steep = withFirstSurface({ kind: "asphere", radius: 50, conic: 0, terms: [{ power: 12, coeff: -1e-9 }] }, 5);
  assert.ok(sag(profileOf(steep.system.surfaces[0].shape), 7.9) < -50);
  assert.equal(firstSurfaceFrontZ(steep.system.surfaces[0]), 0);
  const steepSets = probeRaySets(steep, { fields: { kind: "angles-deg", values: [20] } });
  assert.deepEqual(steepSets.problems, []);
  assert.equal(f8(steepSets.sets[0].origins)[2], -LAUNCH_LEAD_MM);
  // A clear aperture that reaches past the end of its conic has no sag out there, and nothing to be in front of.
  // The surface then ends at the height of its conic's end, where a hemisphere is a radius in front of its vertex.
  const dome = withFirstSurface({ kind: "conic", radius: -8, conic: 0 }, 10);
  const domeFront = firstSurfaceFrontZ(dome.system.surfaces[0]);
  assert.ok(domeFront >= -8 && domeFront < -8 + 1e-4, String(domeFront));
});

test("a ray that would not start in front of the first surface is no ray of a set: its field is a coded problem", () => {
  // An object point 3 mm in front of the vertex of a bowl whose rim is 5.4 mm in front of it: inside the bowl.
  const inside = structuredClone(SINGLET_DRAFT) as typeof SINGLET_DRAFT;
  Object.assign(inside.system.surfaces[0], { shape: { kind: "conic", radius: -12, conic: 0 } });
  Object.assign(inside.conditions, { object: { kind: "finite", z: -3 } });
  const close = finalizeCase(inside);
  assert.equal(probeLattice(close, 0, 8), null);
  assert.deepEqual(probeRaySets(close, { fields: { kind: "angles-deg", values: [0, 10] } }), {
    sets: [],
    problems: [
      "launch-behind-first-surface: the rays of the field at 0 degrees would not start in front of the first surface",
      "launch-behind-first-surface: the rays of the field at 10 degrees would not start in front of the first surface",
    ],
  });
  assert.equal(launchBehindProblem(-7.5).split(":")[0], "launch-behind-first-surface");
  // The same object in front of the rim is in front of the surface.
  Object.assign(inside.conditions, { object: { kind: "finite", z: -6 } });
  assert.ok(probeLattice(finalizeCase(inside), 0, 8) !== null);

  const [first] = close.system.surfaces;
  const front = firstSurfaceFrontZ(first);
  assert.equal(startsInFront(first, Float64Array.of(0, 0, front - 1e-9, 30, -40, -100)), true);
  // On the front plane is not in front of it; nor is a ray that starts nowhere.
  assert.equal(startsInFront(first, Float64Array.of(0, 0, front)), false);
  assert.equal(startsInFront(first, Float64Array.of(0, 0, -100, 0, 0, -1)), false);
  assert.equal(startsInFront(first, Float64Array.of(0, NaN, -100)), false);
  assert.equal(startsInFront(first, Float64Array.of(0, 0, -Infinity)), false);
});

test("the sets are a function of the case and the run: the same again, bit for bit, and another for any change", () => {
  const options = { fields: { kind: "angles-deg", values: [7.5] }, sampling: { bundleGrid: 12 } } as const;
  const first = probeRaySets(SINGLET_CASE, options);
  assert.deepEqual(probeRaySets(SINGLET_CASE, options), first);
  assert.deepEqual(probeRaySets(structuredClone(SINGLET_CASE), structuredClone(options)), first);
  const id = raySetId(first.sets[0]);
  assert.match(id, /^[0-9a-f]{64}$/);
  const others = [
    probeRaySets(SINGLET_CASE, { ...options, sampling: { bundleGrid: 14 } }),
    probeRaySets(SINGLET_CASE, { ...options, fields: { kind: "angles-deg", values: [7.500000000000001] } }),
    probeRaySets(withFirstSurface({ kind: "conic", radius: 50, conic: 0 }, 10.000000000000002), options),
  ].map(({ sets }) => raySetId(sets[0]));
  assert.equal(new Set([id, ...others]).size, 4);
  // What a ray set is not made of changes nothing: the second surface, the indices, the label.
  const draft = structuredClone(SINGLET_DRAFT) as typeof SINGLET_DRAFT;
  Object.assign(draft.system.surfaces[1].shape, { radius: -60 });
  Object.assign(draft.label, { name: "another name" });
  assert.equal(raySetId(probeRaySets(finalizeCase(draft), options).sets[0]), id);
  // A spec keeps every bit of the rays it was made from.
  const bundle = probeLattice(SINGLET_CASE, 7.5, 12);
  assert.ok(bundle !== null);
  assert.deepEqual(raySetSpec(0, bundle, first.sets[0].groups), first.sets[0]);
  assert.deepEqual([...f8(first.sets[0].origins)], [...bundle.origins]);
});

test("the case source of fixtures gives the probe sets of its cases", async () => {
  const source = createFixtureCaseSource("/nowhere");
  const run = {
    contract: "1.0",
    kind: "run-spec",
    name: "a-run",
    lens: { kind: "fixture", path: "case.json" },
    fields: { kind: "angles-deg", values: [0, 5] },
    sampling: { bundleGrid: 6 },
  } as const;
  assert.deepEqual(await source.raySets?.(run, SINGLET_CASE), probeRaySets(SINGLET_CASE, run));
  assert.equal((await source.raySets?.(run, SINGLET_CASE))?.sets.length, 2);
});
