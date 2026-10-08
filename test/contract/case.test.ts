import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import {
  Z_TOLERANCE_MM,
  caseIdentity,
  caseInvariantProblems,
  finalizeCase,
  verifyCaseIdentity,
} from "../../src/contract/case.ts";
import type { OpticalCase, OpticalCaseDraft } from "../../src/contract/case.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import {
  ALL_FEATURES_CASE,
  ALL_FEATURES_DRAFT,
  FIXTURE_DIR,
  REMOVE,
  SINGLET_CASE,
  SINGLET_DRAFT,
  edited,
} from "./corpus.ts";

/** The singlet draft with one member edited; see `edited`. */
function singletWith(pointer: string, replacement: unknown): OpticalCaseDraft {
  return edited(SINGLET_DRAFT, pointer, replacement) as OpticalCaseDraft;
}

function problemsOf(draft: OpticalCaseDraft): string[] {
  return caseInvariantProblems(draft.system, draft.conditions);
}

/** The JSON Pointer of every primitive inside a value. */
function leafPointers(value: unknown, pointer = ""): string[] {
  if (typeof value !== "object" || value === null) return [pointer];
  return Object.entries(value).flatMap(([key, member]) => leafPointers(member, `${pointer}/${key}`));
}

/** A primitive of the same type as the one given, and different from it. */
function otherThan(value: unknown): unknown {
  if (typeof value === "number") return value + 1;
  if (typeof value === "string") return `${value}0`;
  if (typeof value === "boolean") return !value;
  return 0;
}

function memberAt(value: unknown, pointer: string): unknown {
  let node = value;
  for (const token of pointer.slice(1).split("/")) node = (node as Record<string, unknown>)[token];
  return node;
}

function isDeeplyFrozen(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return true;
  return Object.isFrozen(value) && Object.values(value).every(isDeeplyFrozen);
}

// ── finalizeCase and identity ────────────────────────────────────────────────────────────────────────────────────

test("finalizeCase adds the contract version, the kind, both ids and the features to the draft", () => {
  assert.deepEqual(Object.keys(SINGLET_CASE), [
    "contract",
    "kind",
    "id",
    "systemId",
    "label",
    "system",
    "conditions",
    "features",
    "provenance",
  ]);
  assert.equal(SINGLET_CASE.contract, CONTRACT_VERSION);
  assert.equal(SINGLET_CASE.kind, "optical-case");
  assert.deepEqual(SINGLET_CASE.features, []);
  for (const part of ["label", "system", "conditions", "provenance"] as const) {
    assert.deepEqual(SINGLET_CASE[part], SINGLET_DRAFT[part], part);
  }
});

test("systemId hashes the canonical JSON of system, and id that of system with conditions", () => {
  const { system, conditions } = SINGLET_DRAFT;
  assert.equal(SINGLET_CASE.systemId, sha256Hex(canonicalJson(system)));
  assert.equal(SINGLET_CASE.id, sha256Hex(canonicalJson({ conditions, system })));
  assert.deepEqual(caseIdentity(system, conditions), { systemId: SINGLET_CASE.systemId, id: SINGLET_CASE.id });
});

test("the ids of the example cases are stable: pinned to values computed outside this codebase", () => {
  // Python: sha256 of json.dumps(value, sort_keys=True, separators=(",", ":")), which writes the singlet's numbers
  // as ECMAScript does.
  assert.equal(SINGLET_CASE.systemId, "f65e0747099c4d455b407a226af09d27af9abfa6a76f28bbd2b4862de3b8fa38");
  assert.equal(SINGLET_CASE.id, "0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8");
  // Python cannot reproduce these two: it writes the coefficient 1.2e-6 as 1.2e-06 where ECMAScript writes
  // 0.0000012. They are the sha256 of JSON.stringify over a copy with its keys sorted, with no code of this repo.
  assert.equal(ALL_FEATURES_CASE.systemId, "2c9f72aeb382b196a227487591574d939bd359d8fb5b0624f5cd40b0f51eac00");
  assert.equal(ALL_FEATURES_CASE.id, "f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625");
});

test("the ids do not depend on the order keys were written in", () => {
  const reversed = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(reversed);
    if (typeof value !== "object" || value === null) return value;
    return Object.fromEntries(
      Object.entries(value)
        .reverse()
        .map(([key, member]) => [key, reversed(member)]),
    );
  };
  const draft = reversed(ALL_FEATURES_DRAFT) as OpticalCaseDraft;
  assert.notEqual(JSON.stringify(draft), JSON.stringify(ALL_FEATURES_DRAFT));
  const { id, systemId } = finalizeCase(draft);
  assert.deepEqual({ id, systemId }, { id: ALL_FEATURES_CASE.id, systemId: ALL_FEATURES_CASE.systemId });
});

test("changing any value of system changes both ids", () => {
  const { system, conditions } = ALL_FEATURES_DRAFT;
  const pointers = leafPointers(system);
  assert.ok(pointers.length > 60);
  const seen = new Set([ALL_FEATURES_CASE.systemId]);
  for (const pointer of pointers) {
    const changed = edited(system, pointer, otherThan(memberAt(system, pointer))) as OpticalCase["system"];
    const { systemId, id } = caseIdentity(changed, conditions);
    assert.notEqual(id, ALL_FEATURES_CASE.id, pointer);
    assert.ok(!seen.has(systemId), pointer);
    seen.add(systemId);
  }
});

test("changing any value of conditions changes id and leaves systemId", () => {
  const { system, conditions } = ALL_FEATURES_DRAFT;
  const pointers = leafPointers(conditions);
  // Every member of the index table's wire form is among them: element type, shape, bytes and digest.
  for (const member of ["dtype", "shape/0", "shape/1", "data", "sha256"]) {
    assert.ok(pointers.includes(`/indexAfterSurface/$nd/${member}`), member);
  }
  const seen = new Set([ALL_FEATURES_CASE.id]);
  for (const pointer of pointers) {
    const changed = edited(conditions, pointer, otherThan(memberAt(conditions, pointer))) as OpticalCase["conditions"];
    const { systemId, id } = caseIdentity(system, changed);
    assert.equal(systemId, ALL_FEATURES_CASE.systemId, pointer);
    assert.ok(!seen.has(id), pointer);
    seen.add(id);
  }
});

test("adding or removing a member, a surface or a term changes the ids", () => {
  const { system, conditions } = ALL_FEATURES_DRAFT;
  const edits: [string, unknown][] = [
    ["/surfaces/0/synthetic", "rearPlate"],
    ["/surfaces/5/synthetic", REMOVE],
    ["/surfaces", system.surfaces.slice(0, -1)],
    ["/surfaces", [...system.surfaces].reverse()],
    ["/surfaces/0/shape/terms", [{ power: 4, coeff: 1.2e-6 }]],
    ["/surfaces/2/shape", { kind: "conic", radius: 1e15, conic: 0 }],
  ];
  for (const [pointer, replacement] of edits) {
    const changed = caseIdentity(edited(system, pointer, replacement) as OpticalCase["system"], conditions);
    assert.notEqual(changed.systemId, ALL_FEATURES_CASE.systemId, pointer);
    assert.notEqual(changed.id, ALL_FEATURES_CASE.id, pointer);
  }
});

test("label and provenance are not part of the identity", () => {
  const relabelled = finalizeCase({
    ...ALL_FEATURES_DRAFT,
    label: { name: "Another name" },
    provenance: { source: { kind: "fixture", name: "elsewhere" }, producer: { tool: "lvrtc", version: "9.9.9" } },
  });
  assert.equal(relabelled.id, ALL_FEATURES_CASE.id);
  assert.equal(relabelled.systemId, ALL_FEATURES_CASE.systemId);
  assert.deepEqual(relabelled.features, ALL_FEATURES_CASE.features);
  assert.notDeepEqual(relabelled.provenance, ALL_FEATURES_CASE.provenance);
});

test("cases of one lens under different conditions share a systemId", () => {
  const stoppedDown = finalizeCase(singletWith("/conditions/stopSemiDiameter", 2.5));
  assert.equal(stoppedDown.systemId, SINGLET_CASE.systemId);
  assert.notEqual(stoppedDown.id, SINGLET_CASE.id);
});

test("0 and -0 are one value in an identity", () => {
  const negativeZero = finalizeCase(singletWith("/system/surfaces/0/shape/conic", -0));
  assert.equal(negativeZero.id, SINGLET_CASE.id);
});

test("finalizeCase returns a case frozen at every depth", () => {
  assert.ok(isDeeplyFrozen(ALL_FEATURES_CASE));
  assert.throws(() => {
    (ALL_FEATURES_CASE.system as { stopIndex: number }).stopIndex = 0;
  }, TypeError);
  assert.throws(() => {
    (ALL_FEATURES_CASE.features as string[]).push("object.finite");
  }, TypeError);
});

test("finalizeCase copies the draft: the draft stays writable and later changes to it do not reach the case", () => {
  const draft = structuredClone(SINGLET_DRAFT);
  const finalized = finalizeCase(draft);
  assert.ok(!Object.isFrozen(draft) && !Object.isFrozen(draft.system) && !Object.isFrozen(draft.system.surfaces[0]));
  draft.system.surfaces[0].z = 5;
  draft.conditions.lines.push({ wavelengthNm: 500, weight: 1, indexSource: "authored" });
  draft.label.name = "changed";
  assert.deepEqual(finalized, SINGLET_CASE);
});

test("finalizeCase takes a finished case as a draft and derives everything again", () => {
  assert.deepEqual(finalizeCase(ALL_FEATURES_CASE), ALL_FEATURES_CASE);
  const forged = { ...ALL_FEATURES_CASE, id: "f".repeat(64), systemId: "e".repeat(64), features: [], contract: "1.7" };
  assert.deepEqual(finalizeCase(forged), ALL_FEATURES_CASE);
});

test("finalizeCase refuses a draft the schema rejects, naming every issue", () => {
  assert.throws(() => finalizeCase(singletWith("/system/stopIndex", "0")), {
    message: "contract: not a valid optical-case: /system/stopIndex [type] expected integer, got string",
  });
  assert.throws(() => finalizeCase(singletWith("/system/surfaces/1/z", NaN)), {
    message: "contract: not a valid optical-case: /system/surfaces/1/z [finite] NaN is not a finite number",
  });
  assert.throws(
    () => finalizeCase(singletWith("/provenance", REMOVE)),
    /^Error: contract: not a valid optical-case: \/provenance \[json\]/,
  );
  const twoFaults = edited(singletWith("/label/name", ""), "/conditions/imageZ", "100") as OpticalCaseDraft;
  assert.throws(() => finalizeCase(twoFaults), /\/conditions\/imageZ \[type\].*; \/label\/name \[minLength\]/);
});

test("finalizeCase refuses a draft that breaks an invariant, naming every one", () => {
  const broken = edited(singletWith("/system/stopIndex", 2), "/system/designImageZ", 101) as OpticalCaseDraft;
  assert.throws(() => finalizeCase(broken), {
    message:
      "contract: not a valid optical-case: " +
      "system.stopIndex is 2, which is not the index of one of the 2 surfaces; " +
      "system.designImageZ is 101, but the thicknesses sum to 100",
  });
});

// ── Invariants ───────────────────────────────────────────────────────────────────────────────────────────────────

test("the example cases keep every invariant", () => {
  assert.deepEqual(problemsOf(SINGLET_DRAFT), []);
  assert.deepEqual(problemsOf(ALL_FEATURES_DRAFT), []);
});

test("stopIndex and lastLensSurfaceIndex must be surface indices", () => {
  for (const name of ["stopIndex", "lastLensSurfaceIndex"]) {
    assert.deepEqual(problemsOf(singletWith(`/system/${name}`, 1)), []);
    for (const index of [2, 7, -1, 0.5]) {
      assert.deepEqual(problemsOf(singletWith(`/system/${name}`, index)), [
        `system.${name} is ${index}, which is not the index of one of the 2 surfaces`,
      ]);
    }
  }
});

test("lastLensSurfaceIndex is the last surface that is not a synthetic plate", () => {
  const withSystem = (pointer: string, replacement: unknown): OpticalCaseDraft =>
    edited(ALL_FEATURES_DRAFT, `/system${pointer}`, replacement) as OpticalCaseDraft;
  // The example has five lens surfaces and a rear plate of two: the rear lens vertex is surface 4.
  assert.equal(ALL_FEATURES_DRAFT.system.lastLensSurfaceIndex, 4);
  for (const index of [0, 3, 5, 6]) {
    assert.deepEqual(problemsOf(withSystem("/lastLensSurfaceIndex", index)), [
      `system.lastLensSurfaceIndex is ${index}, which is not the last surface that is not a synthetic plate: ` +
        "the last that is not is surface 4",
    ]);
  }
  // A plate that is no longer marked moves the rear lens vertex behind it.
  assert.deepEqual(problemsOf(withSystem("/surfaces/6/synthetic", REMOVE)), [
    "system.lastLensSurfaceIndex is 4, which is not the last surface that is not a synthetic plate: " +
      "the last that is not is surface 6",
  ]);
  assert.deepEqual(
    problemsOf(
      edited(withSystem("/surfaces/6/synthetic", REMOVE), "/system/lastLensSurfaceIndex", 6) as OpticalCaseDraft,
    ),
    [],
  );
  // A synthetic surface ahead of the rear lens vertex, as a plate in front of a converter is, changes nothing.
  assert.deepEqual(problemsOf(withSystem("/surfaces/1/synthetic", "rearPlate")), []);
  // A system of plates only has no lens vertex to name.
  const onlyPlate = edited(SINGLET_DRAFT, "/system/surfaces/0/synthetic", "rearPlate");
  assert.deepEqual(problemsOf(edited(onlyPlate, "/system/surfaces/1/synthetic", "rearPlate") as OpticalCaseDraft), [
    "system.lastLensSurfaceIndex is 1, which is not the last surface that is not a synthetic plate: " +
      "every surface is a synthetic plate",
  ]);
  // An index that is no surface is reported as that, once.
  assert.equal(problemsOf(withSystem("/lastLensSurfaceIndex", 7)).length, 1);
  assert.throws(() => finalizeCase(withSystem("/lastLensSurfaceIndex", 5)), /lastLensSurfaceIndex is 5, which is not/);
});

test("each vertex sits at the sum of the thicknesses before it, the first at 0", () => {
  assert.deepEqual(problemsOf(singletWith("/system/surfaces/1/z", 4.001)), [
    "system.surfaces[1].z is 4.001, but the thicknesses before it sum to 4",
  ]);
  assert.deepEqual(problemsOf(singletWith("/system/surfaces/0/z", 0.5)), [
    "system.surfaces[0].z is 0.5, but the thicknesses before it sum to 0",
  ]);
  // A thickness that changes moves everything behind it, the design image plane included.
  assert.deepEqual(problemsOf(singletWith("/system/surfaces/0/thickness", 5)), [
    "system.surfaces[1].z is 4, but the thicknesses before it sum to 5",
    "system.designImageZ is 100, but the thicknesses sum to 101",
  ]);
});

test("the design image plane sits one last thickness behind the last vertex", () => {
  assert.deepEqual(problemsOf(singletWith("/system/designImageZ", 96)), [
    "system.designImageZ is 96, but the thicknesses sum to 100",
  ]);
  // The image plane of the conditions is free: it is the design plane plus a focus shift.
  assert.deepEqual(problemsOf(singletWith("/conditions/imageZ", 96)), []);
});

test("positions agree with the thicknesses within 1e-9 mm, and no further", () => {
  assert.equal(Z_TOLERANCE_MM, 1e-9);
  assert.deepEqual(problemsOf(singletWith("/system/surfaces/1/z", 4 + 5e-10)), []);
  assert.deepEqual(problemsOf(singletWith("/system/surfaces/1/z", 4 - 5e-10)), []);
  assert.deepEqual(problemsOf(singletWith("/system/designImageZ", 100 + 5e-10)), []);
  assert.equal(problemsOf(singletWith("/system/surfaces/1/z", 4 + 2e-9)).length, 1);
  assert.equal(problemsOf(singletWith("/system/surfaces/1/z", 4 - 2e-9)).length, 1);
  assert.equal(problemsOf(singletWith("/system/designImageZ", 100 - 2e-9)).length, 1);
});

test("an asphere has at most one term of each power", () => {
  const repeated = [
    { power: 4, coeff: 1e-6 },
    { power: 6, coeff: 1e-9 },
    { power: 4, coeff: 2e-6 },
  ];
  const draft = edited(ALL_FEATURES_DRAFT, "/system/surfaces/3/shape/terms", repeated) as OpticalCaseDraft;
  assert.deepEqual(problemsOf(draft), ["system.surfaces[3].shape.terms has more than one term of power 4"]);
});

test("a case has a reference line, and every weight is positive", () => {
  assert.deepEqual(problemsOf(singletWith("/conditions/lines", [])), [
    "conditions.lines is empty: a case needs a reference line",
    "conditions.indexAfterSurface is f8 of shape [1, 2], expected f8 of shape [0, 2] (lines, surfaces)",
  ]);
  for (const weight of [0, -1]) {
    assert.deepEqual(problemsOf(singletWith("/conditions/lines/0/weight", weight)), [
      `conditions.lines[0].weight is ${weight}, which is not positive`,
    ]);
  }
});

test("the index table is float64 of shape [lines, surfaces]", () => {
  const table = (values: Float64Array | Int32Array, shape: number[]): OpticalCaseDraft =>
    singletWith("/conditions/indexAfterSurface", encodeNdArray(values, shape));
  const expected = "expected f8 of shape [1, 2] (lines, surfaces)";

  assert.deepEqual(problemsOf(table(Float64Array.of(1.5168, 1), [1, 2])), []);
  assert.deepEqual(problemsOf(table(Float64Array.of(1.5168, 1), [2, 1])), [
    `conditions.indexAfterSurface is f8 of shape [2, 1], ${expected}`,
  ]);
  assert.deepEqual(problemsOf(table(Float64Array.of(1.5168, 1, 1), [1, 3])), [
    `conditions.indexAfterSurface is f8 of shape [1, 3], ${expected}`,
  ]);
  assert.deepEqual(problemsOf(table(Float64Array.of(1.5, 1, 1.6, 1), [2, 2])), [
    `conditions.indexAfterSurface is f8 of shape [2, 2], ${expected}`,
  ]);
  assert.deepEqual(problemsOf(table(Float64Array.of(1.5168, 1), [2])), [
    `conditions.indexAfterSurface is f8 of shape [2], ${expected}`,
  ]);
  assert.deepEqual(problemsOf(table(Int32Array.of(2, 1), [1, 2])), [
    `conditions.indexAfterSurface is i4 of shape [1, 2], ${expected}`,
  ]);
});

test("the index table must decode, and hold positive finite indices", () => {
  const digest = singletWith("/conditions/indexAfterSurface/$nd/sha256", "0".repeat(64));
  assert.match(problemsOf(digest)[0], /^conditions\.indexAfterSurface: ndarray: sha256 mismatch/);
  const truncated = singletWith("/conditions/indexAfterSurface/$nd/data", "AAAA");
  assert.match(problemsOf(truncated)[0], /^conditions\.indexAfterSurface: ndarray: data is 3 bytes/);

  for (const bad of [NaN, Infinity, 0, -1.5]) {
    const draft = singletWith("/conditions/indexAfterSurface", encodeNdArray(Float64Array.of(1.5168, bad), [1, 2]));
    assert.deepEqual(
      problemsOf(draft),
      ["conditions.indexAfterSurface holds an index that is not a positive finite number"],
      String(bad),
    );
    // The schema cannot see inside the array, so this is where such a case is stopped.
    assert.throws(() => finalizeCase(draft), /holds an index that is not a positive finite number/);
  }
});

// ── verifyCaseIdentity ───────────────────────────────────────────────────────────────────────────────────────────

/** A stored case with one member edited after it was finalised. */
function tampered(pointer: string, replacement: unknown): OpticalCase {
  return edited(ALL_FEATURES_CASE, pointer, replacement) as OpticalCase;
}

test("verifyCaseIdentity finds nothing wrong with a case as finalizeCase made it", () => {
  assert.deepEqual(verifyCaseIdentity(SINGLET_CASE), []);
  assert.deepEqual(verifyCaseIdentity(ALL_FEATURES_CASE), []);
  assert.deepEqual(verifyCaseIdentity(JSON.parse(JSON.stringify(ALL_FEATURES_CASE)) as OpticalCase), []);
});

test("verifyCaseIdentity reports a changed system under both ids", () => {
  const changed = tampered("/system/surfaces/1/shape/radius", -121);
  const mismatches = verifyCaseIdentity(changed);
  assert.deepEqual(
    mismatches.map(({ field }) => field),
    ["systemId", "id"],
  );
  const derived = caseIdentity(changed.system, changed.conditions);
  assert.deepEqual(mismatches[0], {
    field: "systemId",
    stated: ALL_FEATURES_CASE.systemId,
    derived: derived.systemId,
  });
  assert.deepEqual(mismatches[1], { field: "id", stated: ALL_FEATURES_CASE.id, derived: derived.id });
});

test("verifyCaseIdentity reports changed conditions under id alone", () => {
  for (const [pointer, replacement] of [
    ["/conditions/stopSemiDiameter", 4.4],
    ["/conditions/imageZ", 47.5],
    ["/conditions/lines/1/weight", 0.5],
    ["/conditions/indexAfterSurface", encodeNdArray(new Float64Array(14).fill(1), [2, 7])],
  ] as const) {
    assert.deepEqual(
      verifyCaseIdentity(tampered(pointer, replacement)).map(({ field }) => field),
      ["id"],
      pointer,
    );
  }
});

test("verifyCaseIdentity reports a forged id, systemId or feature list", () => {
  assert.deepEqual(verifyCaseIdentity(tampered("/id", ALL_FEATURES_CASE.systemId)), [
    { field: "id", stated: ALL_FEATURES_CASE.systemId, derived: ALL_FEATURES_CASE.id },
  ]);
  assert.deepEqual(
    verifyCaseIdentity(tampered("/systemId", "0".repeat(64))).map(({ field }) => field),
    ["systemId"],
  );
  const allFlags = JSON.stringify(ALL_FEATURES_CASE.features);
  assert.deepEqual(verifyCaseIdentity(tampered("/features", ["surface.conic"])), [
    { field: "features", stated: '["surface.conic"]', derived: allFlags },
  ]);
  // The list is sorted: the same flags in another order are not the derived list.
  const unsorted = [...ALL_FEATURES_CASE.features].reverse();
  assert.deepEqual(
    verifyCaseIdentity(tampered("/features", unsorted)).map(({ field }) => field),
    ["features"],
  );
});

test("verifyCaseIdentity reports a change that also changes the features under each field it touches", () => {
  const fields = verifyCaseIdentity(tampered("/conditions/object", { kind: "infinity" })).map(({ field }) => field);
  assert.deepEqual(fields, ["id", "features"]);
});

test("verifyCaseIdentity does not look at label or provenance", () => {
  assert.deepEqual(verifyCaseIdentity(tampered("/label/name", "Renamed")), []);
  assert.deepEqual(verifyCaseIdentity(tampered("/provenance/lv/dirty", true)), []);
});

// ── The Double-Gauss fixture ─────────────────────────────────────────────────────────────────────────────────────

const DOUBLE_GAUSS = JSON.parse(
  readFileSync(join(FIXTURE_DIR, "valid", "optical-case", "double-gauss.json"), "utf8"),
) as OpticalCase;

/** The d-line indices of the fixture, one per surface. */
function doubleGaussIndices(): Float64Array {
  const table = decodeNdArray(DOUBLE_GAUSS.conditions.indexAfterSurface);
  assert.equal(table.dtype, "f8");
  assert.deepEqual(table.shape, [1, 11]);
  return table.values as Float64Array;
}

/**
 * A paraxial ray through the fixture, by the y-nu equations: its height at every surface, and its height and
 * slope as it leaves the last one. `y` and `u` are its height and slope at the first surface, in air.
 */
function paraxialTrace(y: number, u: number): { heights: number[]; y: number; u: number } {
  const indices = doubleGaussIndices();
  const heights: number[] = [];
  let before = 1;
  DOUBLE_GAUSS.system.surfaces.forEach((surface, index) => {
    heights.push(y);
    const curvature = surface.shape.kind === "plane" || surface.shape.radius === null ? 0 : 1 / surface.shape.radius;
    const after = indices[index];
    u = (before * u - y * curvature * (after - before)) / after;
    before = after;
    if (index < DOUBLE_GAUSS.system.surfaces.length - 1) y += u * surface.thickness;
  });
  return { heights, y, u };
}

test("the Double-Gauss fixture has the identity pinned outside this codebase", () => {
  // Python: sha256 of json.dumps(value, sort_keys=True, separators=(",", ":")).
  assert.equal(DOUBLE_GAUSS.systemId, "c59049213c1174a60de6b2faa6e3af63d9d356de0f0f7d7523346057f4a80daf");
  assert.equal(DOUBLE_GAUSS.id, "fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a");
  assert.deepEqual(verifyCaseIdentity(DOUBLE_GAUSS), []);
});

test("the Double-Gauss fixture is optiland's sample: eleven surfaces, the stop sixth, one authored d line", () => {
  const { system, conditions } = DOUBLE_GAUSS;
  assert.deepEqual(
    system.surfaces.map((surface) => surface.label),
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  );
  assert.deepEqual(
    system.surfaces.map(({ shape }) => (shape.kind === "conic" ? shape.radius : shape.kind)),
    [56.20238, 152.2858, 37.68262, "plane", 24.2313, "plane", -28.37731, "plane", -37.92546, 177.41176, -79.41143],
  );
  assert.deepEqual(
    system.surfaces.map((surface) => surface.thickness),
    [8.75, 0.5, 12.5, 3.8, 16.369445, 13.747957, 3.8, 11, 0.5, 7, 61.487536],
  );
  assert.equal(system.stopIndex, 5);
  assert.equal(system.lastLensSurfaceIndex, 10);
  assert.equal(system.designImageZ, 139.454938);
  assert.deepEqual(conditions.object, { kind: "infinity" });
  assert.equal(conditions.imageZ, system.designImageZ);
  assert.deepEqual(conditions.lines, [{ wavelengthNm: 587.5618, weight: 1, indexSource: "authored" }]);
  assert.deepEqual(DOUBLE_GAUSS.features, []);
});

test("the Double-Gauss indices are its glasses' d-line indices, and an element follows each glass surface", () => {
  const indices = [...doubleGaussIndices()];
  // N-SSK2, air, N-SK2, F5, air, air (stop), F5, N-SK16, air, N-SK16, air.
  const catalog = [1.62229, 1, 1.60738, 1.60342, 1, 1, 1.60342, 1.62041, 1, 1.62041, 1];
  indices.forEach((index, surface) => assert.ok(Math.abs(index - catalog[surface]) < 5e-6, `surface ${surface}`));
  assert.deepEqual(
    DOUBLE_GAUSS.system.surfaces.map((surface) => surface.elementId),
    [1, 0, 2, 3, 0, 0, 4, 5, 0, 6, 0],
  );
  indices.forEach((index, surface) => {
    assert.equal(index === 1, DOUBLE_GAUSS.system.surfaces[surface].elementId === 0, `surface ${surface}`);
  });
});

test("the Double-Gauss fixture has optiland's paraxial focal length, is f/5 and is focused on its image", () => {
  const axial = paraxialTrace(1, 0);
  const focalLength = -1 / axial.u;
  // optiland: DoubleGauss().paraxial.f2() at 0.5875618 um.
  assert.ok(Math.abs(focalLength - 100.00372050801042) < 1e-9, String(focalLength));

  const { stopIndex, surfaces } = DOUBLE_GAUSS.system;
  const entrancePupilRadius = DOUBLE_GAUSS.conditions.stopSemiDiameter / axial.heights[stopIndex];
  assert.ok(Math.abs(focalLength / (2 * entrancePupilRadius) - 5) < 1e-9);

  const backFocus = -axial.y / axial.u;
  assert.ok(Math.abs(backFocus - surfaces[surfaces.length - 1].thickness) < 1e-4, String(backFocus));
});

test("each Double-Gauss clear aperture is the paraxial marginal-plus-chief bound at 14 degrees, rounded up", () => {
  const { stopIndex, surfaces } = DOUBLE_GAUSS.system;
  const axial = paraxialTrace(1, 0);
  const oblique = paraxialTrace(0, 1);
  const marginalScale = DOUBLE_GAUSS.conditions.stopSemiDiameter / axial.heights[stopIndex];
  // The chief ray enters at slope tan(14 degrees) and crosses the axis at the stop.
  const slope = Math.tan((14 * Math.PI) / 180);
  const chiefHeight = (-slope * oblique.heights[stopIndex]) / axial.heights[stopIndex];
  surfaces.forEach((surface, index) => {
    const marginal = Math.abs(marginalScale * axial.heights[index]);
    const chief = Math.abs(chiefHeight * axial.heights[index] + slope * oblique.heights[index]);
    const bound = Math.ceil((marginal + chief) * 100) / 100;
    assert.equal(surface.aperture.semiDiameter, bound, `surface ${surface.label}`);
    assert.equal(surface.aperture.nominalSemiDiameter, bound);
    assert.equal(surface.aperture.innerSemiDiameter, 0);
  });
  assert.ok(DOUBLE_GAUSS.conditions.stopSemiDiameter <= surfaces[stopIndex].aperture.semiDiameter);
});
