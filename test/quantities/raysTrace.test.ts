// The quantity `rays.trace`: registered, validated by its schema files, and held to the rules those files cannot
// state: a spec is one set of rays, and an answer has numbers up to where each ray ended and NaN from there on.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DIRECTION_NORM_TOLERANCE,
  NO_END_SURFACE,
  RAYS_TRACE,
  RAYS_TRACE_VERSION,
  RAY_STATUS,
} from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { contractSchemas, quantitySchemaId } from "../../src/contract/schemas.ts";
import type { ValidationIssue } from "../../src/contract/validate.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import {
  RAYS_DATA_SINGLET,
  RAYS_DATA_STATUSES,
  RAYS_SPEC_LATTICE,
  RAYS_SPEC_SINGLET,
  edited,
} from "../contract/corpus.ts";

const { validateSpec, validateData } = raysTraceQuantity;

/** Issues as `<path> <keyword>`, which is all of an issue that every implementation agrees on. */
function found(issues: readonly ValidationIssue[]): string[] {
  return issues.map(({ path, keyword }) => `${path} ${keyword}`.trim());
}

function f8(values: readonly number[], shape?: readonly number[]): NdArrayWire {
  return encodeNdArray(Float64Array.from(values), shape);
}

/** An array of an example with one element replaced. */
function withElement(wire: NdArrayWire, index: number, value: number): NdArrayWire {
  const decoded = decodeNdArray(wire);
  const values = decoded.values.slice();
  values[index] = value;
  return encodeNdArray(values, decoded.shape);
}

test("rays.trace is registered at the version the contract states, with the three ways a ray ends", () => {
  assert.equal(RAYS_TRACE, "rays.trace");
  assert.equal(RAYS_TRACE_VERSION, 1);
  assert.equal(QUANTITIES.get("rays.trace"), raysTraceQuantity);
  assert.deepEqual([raysTraceQuantity.id, raysTraceQuantity.version], ["rays.trace", 1]);
  assert.deepEqual(RAY_STATUS, { ok: 0, blocked: 1, failed: 2 });
  assert.ok(Object.isFrozen(RAY_STATUS));
  assert.deepEqual([NO_END_SURFACE, DIRECTION_NORM_TOLERANCE], [-1, 1e-12]);
  // Every member of the data is required: an engine that traces rays reports all of a trace.
  const schema = contractSchemas().targets.get(quantitySchemaId(RAYS_TRACE, "data"));
  assert.deepEqual([...(schema?.required ?? [])].sort(), Object.keys(RAYS_DATA_SINGLET).sort());
  const spec = contractSchemas().targets.get(quantitySchemaId(RAYS_TRACE, "spec"));
  assert.deepEqual(spec?.required, ["line", "origins", "directions", "weights"]);
});

test("the examples of the corpus are a spec and an answer, by schema and by rule", () => {
  for (const spec of [RAYS_SPEC_SINGLET, RAYS_SPEC_LATTICE]) assert.deepEqual(validateSpec(spec), []);
  for (const data of [RAYS_DATA_SINGLET, RAYS_DATA_STATUSES]) {
    assert.deepEqual(validateData(data), []);
    assert.deepEqual(resultDataProblems(raysTraceQuantity, data), []);
  }
  // The answer is to the spec: as many rays, in the same order.
  assert.equal(RAYS_DATA_SINGLET.status.$nd.shape[0], RAYS_SPEC_SINGLET.weights.$nd.shape[0]);
});

test("the three arrays of a spec are one set of rays", () => {
  const broken = (pointer: string, value: unknown, base: RaysTraceSpec = RAYS_SPEC_SINGLET): string[] =>
    found(validateSpec(edited(base, pointer, value)));
  // n is the number of origins; every other array is held to it.
  assert.deepEqual(broken("/directions", f8([0, 0, 1], [1, 3])), ["/directions invariant"]);
  assert.deepEqual(broken("/weights", f8([1, 1, 1])), ["/weights invariant"]);
  assert.deepEqual(broken("/origins", f8([0, 0, -10, 0, 12, -10, 1, 1, -10], [3, 3])), [
    "/directions invariant",
    "/weights invariant",
  ]);
  // Three numbers a ray, in x, y and z.
  assert.deepEqual(broken("/origins", f8([0, 0, -10, 0], [2, 2])), ["/origins invariant"]);
  assert.deepEqual(broken("/directions", f8([0, 0, 1, 0, 0, 1, 0, 0], [2, 4])), ["/directions invariant"]);
  // A set has a ray.
  const none = { line: 0, origins: f8([], [0, 3]), directions: f8([], [0, 3]), weights: f8([]) };
  assert.deepEqual(validateSpec(none), [
    { path: "/origins", keyword: "invariant", message: "it holds no ray: a set has at least one" },
  ]);
  assert.match(
    validateSpec(edited(RAYS_SPEC_SINGLET, "/weights", f8([1])))[0].message,
    /^its shape is \[1\], expected \[2\] \(rays\)$/,
  );
});

test("an origin is finite, a direction a unit vector toward +z, a weight finite and not negative", () => {
  const issue = (member: "origins" | "directions" | "weights", index: number, value: number): ValidationIssue[] =>
    validateSpec({ ...RAYS_SPEC_SINGLET, [member]: withElement(RAYS_SPEC_SINGLET[member], index, value) });

  assert.deepEqual(issue("origins", 4, NaN), [
    { path: "/origins", keyword: "invariant", message: "the origin of ray 1 is not finite" },
  ]);
  assert.deepEqual(found(issue("origins", 2, -Infinity)), ["/origins invariant"]);

  const message = "the direction of ray 0 is not a unit vector with a z component above 0";
  assert.deepEqual(issue("directions", 2, 1 + 1e-9), [{ path: "/directions", keyword: "invariant", message }]);
  assert.deepEqual(found(issue("directions", 5, 0.999)), ["/directions invariant"]);
  assert.deepEqual(found(issue("directions", 2, NaN)), ["/directions invariant"]);
  // Within 1e-12 of a unit vector is a unit vector: a length computed in float64 is rarely 1 exactly.
  assert.deepEqual(issue("directions", 2, 1 + 5e-13), []);
  assert.deepEqual(issue("directions", 2, 1 - 5e-13), []);
  // A unit vector that travels toward -z, or across the axis, is no ray of a sequential trace.
  const backward = { ...RAYS_SPEC_SINGLET, directions: f8([0, 0, -1, 0, 0, 1], [2, 3]) };
  assert.deepEqual(found(validateSpec(backward)), ["/directions invariant"]);
  const across = { ...RAYS_SPEC_SINGLET, directions: f8([0, 0, 1, 0, 1, 0], [2, 3]) };
  assert.match(validateSpec(across)[0].message, /^the direction of ray 1 /);

  assert.deepEqual(issue("weights", 1, -0.5), [
    { path: "/weights", keyword: "invariant", message: "the weight of ray 1 is not a finite number of at least 0" },
  ]);
  assert.deepEqual(found(issue("weights", 0, NaN)), ["/weights invariant"]);
  assert.deepEqual(found(issue("weights", 0, Infinity)), ["/weights invariant"]);
  // A weight of 0 is a ray like any other: a chief ray is traced and counts for nothing.
  assert.deepEqual(issue("weights", 0, 0), []);
  // Each array reports its first such ray, and the three are reported side by side.
  const all = {
    ...RAYS_SPEC_SINGLET,
    origins: withElement(RAYS_SPEC_SINGLET.origins, 0, NaN),
    directions: withElement(RAYS_SPEC_SINGLET.directions, 5, 2),
    weights: withElement(RAYS_SPEC_SINGLET.weights, 1, -1),
  };
  assert.deepEqual(found(validateSpec(all)), ["/origins invariant", "/directions invariant", "/weights invariant"]);
});

test("a chief ray is one of the rays, and a lattice has no more cells than there are rays", () => {
  const broken = (pointer: string, value: unknown): string[] =>
    found(validateSpec(edited(RAYS_SPEC_LATTICE, pointer, value)));
  assert.deepEqual(broken("/groups/chiefIndex", 5), ["/groups/chiefIndex invariant"]);
  assert.deepEqual(broken("/groups/chiefIndex", 0), []);
  assert.deepEqual(broken("/groups/lattice/columns", 3), ["/groups/lattice invariant"]);
  // Five rays hold a lattice of four cells and a chief ray, or one of five cells.
  assert.deepEqual(broken("/groups/lattice", { columns: 5, rows: 1, step: 1 }), []);
  assert.deepEqual(broken("/groups", {}), []);
  assert.match(
    validateSpec(edited(RAYS_SPEC_LATTICE, "/groups/lattice/rows", 3))[0].message,
    /^a lattice of 2 x 3 cells needs more than the 5 rays$/,
  );
  // What the schema can say, it says: the rule is not asked about a spec of another shape.
  assert.deepEqual(broken("/groups/field/angleDeg", -90), ["/groups/field/angleDeg exclusiveMinimum"]);
  assert.deepEqual(found(validateSpec(edited(RAYS_SPEC_SINGLET, "/line", 1.5))), ["/line type"]);
});

test("an array whose bytes are not what it states is an issue of that array", () => {
  const { $nd } = RAYS_SPEC_SINGLET.origins;
  const forged = { ...RAYS_SPEC_SINGLET, origins: { $nd: { ...$nd, sha256: "0".repeat(64) } } };
  const issues = validateSpec(forged);
  assert.deepEqual(found(issues), ["/origins invariant"]);
  assert.match(issues[0].message, /^ndarray: sha256 mismatch/);
  const short = { ...RAYS_DATA_SINGLET, hits: { $nd: { ...RAYS_DATA_SINGLET.hits.$nd, data: "" } } };
  assert.deepEqual(found(validateData(short)), ["/hits invariant"]);
});

test("the arrays of an answer are one trace of n rays through S surfaces", () => {
  const broken = (pointer: string, value: unknown, base: RaysTraceData = RAYS_DATA_SINGLET): string[] =>
    found(validateData(edited(base, pointer, value)));
  assert.deepEqual(broken("/endSurface", encodeNdArray(Int32Array.of(-1, 0, 0))), ["/endSurface invariant"]);
  assert.deepEqual(broken("/opticalPath", f8([16.0672])), ["/opticalPath invariant"]);
  assert.deepEqual(broken("/exitPoint", f8([0, 0, 4, 0, 0, 4], [3, 2])), ["/exitPoint invariant"]);
  assert.deepEqual(broken("/imagePoint", f8([0, 0, 100], [1, 3])), ["/imagePoint invariant"]);
  // Surfaces first, then rays, then x, y and z.
  assert.deepEqual(broken("/hits", f8(new Array(12).fill(0), [2, 3, 2])), ["/hits invariant"]);
  assert.deepEqual(broken("/hits", f8([], [0, 2, 3])), ["/hits invariant"]);
  // n is the number of statuses; every other array is held to it.
  assert.deepEqual(broken("/status", encodeNdArray(Uint8Array.of(0))), [
    "/hits invariant",
    "/endSurface invariant",
    "/exitPoint invariant",
    "/exitDirection invariant",
    "/imagePoint invariant",
    "/opticalPath invariant",
    "/opticalPathToImage invariant",
  ]);
  assert.deepEqual(broken("/status", encodeNdArray(new Uint8Array(0))), ["/status invariant"]);
  // Another number of surfaces is another trace: the rules are then applied to the trace that is stated.
  assert.equal(
    validateData(edited(RAYS_DATA_SINGLET, "/hits", f8(new Array(18).fill(0), [3, 2, 3])))[0].message,
    "the hit of ray 1 on surface 0 is not NaN: the ray ended before it",
  );
});

test("a status is 0, 1 or 2, and the end surface is -1 exactly for a ray that is ok", () => {
  const status = (...values: number[]): unknown => ({
    ...RAYS_DATA_STATUSES,
    status: encodeNdArray(Uint8Array.from(values)),
  });
  const ends = (...values: number[]): unknown => ({
    ...RAYS_DATA_STATUSES,
    endSurface: encodeNdArray(Int32Array.from(values)),
  });
  assert.deepEqual(validateData(status(0, 1, 2, 1)), []);
  assert.deepEqual(validateData(status(0, 1, 7, 1))[0], {
    path: "/status",
    keyword: "invariant",
    message: "the status of ray 2 is 7",
  });
  // A failed ray and a blocked one differ in what the engine knows, not in what they carry.
  assert.deepEqual(validateData(status(0, 2, 1, 2)), []);
  // A ray that is ok ended nowhere; one that is not ended at a surface, or behind the last one.
  assert.deepEqual(validateData(ends(0, 1, 0, 2))[0], {
    path: "/endSurface",
    keyword: "invariant",
    message: "the end surface of ray 0 is 0, expected -1, as for every ray that is ok",
  });
  assert.deepEqual(validateData(ends(-1, -1, 0, 2))[0], {
    path: "/endSurface",
    keyword: "invariant",
    message: "the end surface of ray 1 is -1, expected from 0 to 2",
  });
  assert.deepEqual(found(validateData(ends(-1, 1, 0, 3))), ["/endSurface invariant"]);
  // A ray called ok whose trace stops short is not ok.
  assert.deepEqual(found(validateData(status(0, 0, 2, 1))), ["/endSurface invariant"]);
});

test("a ray has numbers up to where it ended and NaN from there on", () => {
  const issue = (member: keyof RaysTraceData, index: number, value: number): ValidationIssue[] =>
    validateData({ ...RAYS_DATA_STATUSES, [member]: withElement(RAYS_DATA_STATUSES[member], index, value) });

  // Ray 0 is ok: a number everywhere.
  assert.deepEqual(issue("hits", 2, NaN), [
    { path: "/hits", keyword: "invariant", message: "the hit of ray 0 on surface 0 is not a point" },
  ]);
  assert.deepEqual(found(issue("exitPoint", 0, NaN)), ["/exitPoint invariant"]);
  assert.deepEqual(found(issue("exitDirection", 1, Infinity)), ["/exitDirection invariant"]);
  assert.deepEqual(found(issue("imagePoint", 2, NaN)), ["/imagePoint invariant"]);
  assert.deepEqual(found(issue("opticalPath", 0, NaN)), ["/opticalPath invariant"]);
  assert.deepEqual(issue("opticalPathToImage", 0, NaN), [
    {
      path: "/opticalPathToImage",
      keyword: "invariant",
      message: "the optical path to the image of ray 0 is not a number",
    },
  ]);

  // Ray 1 was blocked at surface 1: it has a hit on surface 0, and nothing from surface 1 on, the hit there included.
  assert.deepEqual(issue("hits", 3, NaN), [
    { path: "/hits", keyword: "invariant", message: "the hit of ray 1 on surface 0 is not a point" },
  ]);
  assert.deepEqual(issue("hits", 12 + 3, 3.5), [
    {
      path: "/hits",
      keyword: "invariant",
      message: "the hit of ray 1 on surface 1 is not NaN: the ray ended before it",
    },
  ]);
  assert.deepEqual(issue("exitPoint", 3, 1), [
    {
      path: "/exitPoint",
      keyword: "invariant",
      message: "the exit point of ray 1 is not NaN: the ray did not pass the last surface",
    },
  ]);
  assert.deepEqual(found(issue("exitDirection", 5, 1)), ["/exitDirection invariant"]);
  assert.deepEqual(found(issue("opticalPath", 1, 12)), ["/opticalPath invariant"]);
  assert.deepEqual(found(issue("imagePoint", 4, 0)), ["/imagePoint invariant"]);
  assert.deepEqual(found(issue("opticalPathToImage", 1, 12)), ["/opticalPathToImage invariant"]);

  // Ray 2 failed at surface 0: nothing of it is a number.
  assert.deepEqual(found(issue("hits", 6, 0)), ["/hits invariant"]);

  // Ray 3 passed both surfaces and cannot reach the image plane: it keeps its exit, and has no landing.
  assert.deepEqual(found(issue("exitPoint", 9, NaN)), ["/exitPoint invariant"]);
  assert.deepEqual(found(issue("opticalPath", 3, NaN)), ["/opticalPath invariant"]);
  assert.deepEqual(issue("imagePoint", 9, 1), [
    {
      path: "/imagePoint",
      keyword: "invariant",
      message: "the image point of ray 3 is not NaN: the ray did not reach the image plane",
    },
  ]);
  assert.deepEqual(found(issue("opticalPathToImage", 3, 20)), ["/opticalPathToImage invariant"]);
  // Half a point is no point and no NaN: a hit is three numbers or three NaNs.
  assert.deepEqual(found(issue("hits", 12 + 3 + 1, 0)), ["/hits invariant"]);
});

test("each member reports the first ray that breaks its rule, and the members side by side", () => {
  const data = {
    ...RAYS_DATA_STATUSES,
    opticalPath: f8([NaN, 1, NaN, NaN]),
    imagePoint: f8(new Array(12).fill(NaN), [4, 3]),
  };
  assert.deepEqual(
    validateData(data).map(({ path, message }) => `${path}: ${message}`),
    [
      "/opticalPath: the optical path of ray 0 is not a number",
      "/imagePoint: the image point of ray 0 is not a number",
    ],
  );
  // Data that keeps its schema and breaks a rule is not stored.
  assert.deepEqual(resultDataProblems(raysTraceQuantity, data), [
    "it is not rays.trace data: /opticalPath [invariant] the optical path of ray 0 is not a number; " +
      "/imagePoint [invariant] the image point of ray 0 is not a number",
  ]);
});
