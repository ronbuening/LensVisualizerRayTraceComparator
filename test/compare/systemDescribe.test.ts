// The comparator of `system.describe`: what counts as the same number, where the first mismatch is named, and how
// a difference of the sag is measured against the rounding its evaluation can have.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComputedMetric } from "../../src/compare/comparator.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { systemDescribeComparator } from "../../src/compare/systemDescribe.ts";
import type { AsphereTerm } from "../../src/contract/case.ts";
import type { SystemDescribeData } from "../../src/contract/quantities/systemDescribe.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../src/core/numeric/ndarray.ts";
import { DESCRIBE_DATA_ASPHERE, DESCRIBE_DATA_SINGLET } from "../contract/corpus.ts";

const R0 = loadPolicy().rungs.r0;
/** Two surfaces, two lines, two radii each: a paraboloid with two terms, and a ball whose second sag is a NaN. */
const BASE: SystemDescribeData = DESCRIBE_DATA_ASPHERE;

type ArrayMember = "vertexZ" | "curvature" | "conic" | "clipRadius" | "indexAfterSurface" | "sagRadii" | "sag";

/** `data` with one element of one of its arrays replaced. */
function withElement(data: SystemDescribeData, member: ArrayMember, index: number, value: number): SystemDescribeData {
  const decoded = decodeNdArray(data[member]);
  decoded.values[index] = value;
  return { ...data, [member]: encodeNdArray(decoded.values, decoded.shape) };
}

function elementOf(wire: NdArrayWire, index: number): number {
  return decodeNdArray(wire).values[index];
}

/** The next double above a positive one: the smallest change there is. */
function nextUp(value: number): number {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  view.setBigUint64(0, view.getBigUint64(0) + 1n);
  return view.getFloat64(0);
}

/** The metrics of two answers, by name; fails the test when they are not comparable. */
function metricsOf(a: SystemDescribeData, b: SystemDescribeData): Record<string, ComputedMetric> {
  const outcome = systemDescribeComparator.compare(a, b);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  // Swapping the two answers changes no value and no place.
  assert.deepEqual(systemDescribeComparator.compare(b, a), outcome);
  return Object.fromEntries(outcome.metrics.map((metric) => [metric.name, metric]));
}

const COUNTS = ["layout.mismatches", "shape.mismatches", "aperture.mismatches", "index.mismatches"] as const;

function participant(engine: string, data: SystemDescribeData): ParticipantResult {
  return { engine, fingerprint: `${engine} sources`, status: "ok", data };
}

// ── The same system ──────────────────────────────────────────────────────────────────────────────────────────────

test("the comparator reports four counts and two measures of the sag, in this order and these units", () => {
  assert.equal(systemDescribeComparator.quantity, "system.describe");
  assert.deepEqual(systemDescribeComparator.metrics, [
    { name: "layout.mismatches", unit: "elements" },
    { name: "shape.mismatches", unit: "elements" },
    { name: "aperture.mismatches", unit: "elements" },
    { name: "index.mismatches", unit: "elements" },
    { name: "sag.maxScaled", unit: "1" },
    { name: "sag.maxAbs", unit: "mm" },
  ]);
  const outcome = systemDescribeComparator.compare(BASE, BASE);
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map((metric) => metric.name),
    systemDescribeComparator.metrics.map((metric) => metric.name),
  );
});

test("an answer equals itself: every count is 0 and names no place, and a sag that neither has is no difference", () => {
  for (const data of [BASE, DESCRIBE_DATA_SINGLET]) {
    const metrics = metricsOf(data, structuredClone(data));
    for (const name of COUNTS) assert.deepEqual(metrics[name], { name, value: 0 });
    // The largest of no difference is the first element.
    assert.deepEqual(metrics["sag.maxAbs"], { name: "sag.maxAbs", value: 0, where: { surface: 0, sample: 0 } });
    assert.deepEqual(metrics["sag.maxScaled"], { name: "sag.maxScaled", value: 0, where: { surface: 0, sample: 0 } });
  }
  // The base has a NaN in its sag, in both answers: the ball has no surface out there.
  assert.ok(Number.isNaN(elementOf(BASE.sag, 3)));
  assert.equal(
    comparePair(participant("a", BASE), participant("b", BASE), R0, systemDescribeComparator).verdict,
    "PASS",
  );
});

test("-0 is 0 and a NaN is a NaN; any other two numbers that are not equal are a mismatch, however close", () => {
  // A plane's curvature written -0 by an engine that divides by a negative infinity.
  const flat = withElement(BASE, "curvature", 1, 0);
  assert.equal(metricsOf(flat, withElement(BASE, "curvature", 1, -0))["shape.mismatches"].value, 0);
  assert.equal(
    metricsOf(withElement(BASE, "conic", 0, NaN), withElement(BASE, "conic", 0, NaN))["shape.mismatches"].value,
    0,
  );
  // One unit in the last place of a curvature is another surface.
  const curvature = elementOf(BASE.curvature, 0);
  assert.deepEqual(metricsOf(BASE, withElement(BASE, "curvature", 0, nextUp(curvature)))["shape.mismatches"], {
    name: "shape.mismatches",
    value: 1,
    where: { field: "curvature", surface: 0 },
  });
  // A NaN against a number is a mismatch like any other.
  assert.equal(metricsOf(BASE, withElement(BASE, "vertexZ", 1, NaN))["layout.mismatches"].value, 1);
});

// ── Where the first mismatch is ──────────────────────────────────────────────────────────────────────────────────

test("each field is counted in its metric, and the first mismatch is named by field and surface", () => {
  const cases: [SystemDescribeData, string, ComputedMetric["where"]][] = [
    [withElement(BASE, "vertexZ", 1, 3.0000001), "layout.mismatches", { field: "vertexZ", surface: 1 }],
    [{ ...BASE, imageZ: 31.6 }, "layout.mismatches", { field: "imageZ" }],
    [withElement(BASE, "curvature", 1, -1 / 6.1), "shape.mismatches", { field: "curvature", surface: 1 }],
    [withElement(BASE, "conic", 0, -1.0001), "shape.mismatches", { field: "conic", surface: 0 }],
    [{ ...BASE, stopIndex: 0 }, "aperture.mismatches", { field: "stopIndex" }],
    [{ ...BASE, stopSemiDiameter: 2.2 }, "aperture.mismatches", { field: "stopSemiDiameter" }],
    [withElement(BASE, "clipRadius", 1, 2.25), "aperture.mismatches", { field: "clipRadius", surface: 1 }],
    // Element 3 of a [2, 2] array: surface 1, the second radius.
    [withElement(BASE, "sagRadii", 3, 8.5), "aperture.mismatches", { field: "sagRadii", surface: 1, sample: 1 }],
    // Element 2 of the [2, 2] index table: the second line, the first surface.
    [
      withElement(BASE, "indexAfterSurface", 2, 1.5225),
      "index.mismatches",
      { field: "indexAfterSurface", line: 1, surface: 0 },
    ],
  ];
  for (const [changed, name, where] of cases) {
    const metrics = metricsOf(BASE, changed);
    assert.deepEqual(metrics[name], { name, value: 1, where }, JSON.stringify(where));
    // No other count sees it.
    for (const other of COUNTS.filter((count) => count !== name)) assert.equal(metrics[other].value, 0, other);
  }
});

test("several mismatches are all counted, and the place is that of the first in the order of the fields", () => {
  let changed = withElement(BASE, "curvature", 1, 0.5);
  changed = withElement(changed, "conic", 0, 0);
  changed = withElement(changed, "conic", 1, 2);
  changed = withElement(changed, "clipRadius", 0, 13);
  changed = { ...changed, stopSemiDiameter: 3 };
  const metrics = metricsOf(BASE, changed);
  // curvature comes before conic, whatever the surface.
  assert.deepEqual(metrics["shape.mismatches"], {
    name: "shape.mismatches",
    value: 3,
    where: { field: "curvature", surface: 1 },
  });
  // stopSemiDiameter comes before clipRadius.
  assert.deepEqual(metrics["aperture.mismatches"], {
    name: "aperture.mismatches",
    value: 2,
    where: { field: "stopSemiDiameter" },
  });
});

test("two lists of terms are the same list or the surface is a mismatch, named with the power of the first term that differs", () => {
  const terms = BASE.terms[0];
  const withTerms = (first: readonly AsphereTerm[]): SystemDescribeData => ({ ...BASE, terms: [first, BASE.terms[1]] });
  const shape = (changed: readonly AsphereTerm[]): ComputedMetric =>
    metricsOf(BASE, withTerms(changed))["shape.mismatches"];
  const at = (power: number): ComputedMetric => ({
    name: "shape.mismatches",
    value: 1,
    where: { field: "terms", surface: 0, power },
  });

  // A coefficient shifted in its ninth digit.
  assert.deepEqual(shape([terms[0], { power: 6, coeff: -2.000000001e-9 }]), at(6));
  assert.deepEqual(shape([{ power: 4, coeff: nextUp(1e-6) }, terms[1]]), at(4));
  // A term left out, and a term too many.
  assert.deepEqual(shape([terms[0]]), at(6));
  assert.deepEqual(shape([...terms, { power: 8, coeff: 1e-12 }]), at(8));
  assert.deepEqual(shape([]), at(4));
  // Another power in the same place: the lower one is the term one of the two lacks.
  assert.deepEqual(shape([{ power: 3, coeff: 1e-6 }, terms[1]]), at(3));
  assert.deepEqual(shape([terms[0], { power: 8, coeff: -2e-9 }]), at(6));
  // The same list written out again is the same list.
  assert.equal(shape(terms.map(({ power, coeff }) => ({ power, coeff }))).value, 0);
  // A surface counts once, however many of its terms differ.
  assert.equal(
    shape([
      { power: 4, coeff: 2e-6 },
      { power: 6, coeff: 3e-9 },
    ]).value,
    1,
  );
});

// ── The sag ──────────────────────────────────────────────────────────────────────────────────────────────────────

test("the sag is compared by its largest difference, with the surface and the radius it occurs at", () => {
  const sag = elementOf(BASE.sag, 1);
  let changed = withElement(BASE, "sag", 1, sag + 3e-9);
  changed = withElement(changed, "sag", 2, elementOf(BASE.sag, 2) - 1e-9);
  const metrics = metricsOf(BASE, changed);
  assert.equal(metrics["sag.maxAbs"].name, "sag.maxAbs");
  assert.ok(Math.abs(metrics["sag.maxAbs"].value - 3e-9) < 1e-15);
  assert.deepEqual(metrics["sag.maxAbs"].where, { surface: 0, sample: 1 });
  for (const name of COUNTS) assert.equal(metrics[name].value, 0, name);
});

test("a sag that only one answer has is a NaN, which fails; one that neither has is none", () => {
  // Element 3 is the NaN of the base: one engine gives a number there.
  const one = metricsOf(BASE, withElement(BASE, "sag", 3, -6));
  assert.ok(Number.isNaN(one["sag.maxAbs"].value) && Number.isNaN(one["sag.maxScaled"].value));
  assert.deepEqual(one["sag.maxScaled"].where, { surface: 1, sample: 1 });
  // And the other way round: a NaN where the base has a number. A larger difference after it does not hide it.
  let lost = withElement(BASE, "sag", 0, NaN);
  lost = withElement(lost, "sag", 2, 100);
  const other = metricsOf(BASE, lost);
  assert.ok(Number.isNaN(other["sag.maxAbs"].value));
  assert.deepEqual(other["sag.maxAbs"].where, { surface: 0, sample: 0 });

  const pair = comparePair(participant("ref", BASE), participant("lv", lost), R0, systemDescribeComparator);
  assert.equal(pair.verdict, "FAIL");
  assert.equal(pair.reason, "sag.maxScaled is NaN at sample 0, surface 0");
  assert.equal(pair.metrics.find((metric) => metric.name === "sag.maxScaled")?.value, null);
});

test("a small sag without cancellation is measured in mm: the scale is 1 mm", () => {
  // The singlet's sags are 0.25 and 1 mm on spheres of 50 mm: what is added up is below 1 mm in size.
  const sag = elementOf(DESCRIBE_DATA_SINGLET.sag, 1);
  const metrics = metricsOf(DESCRIBE_DATA_SINGLET, withElement(DESCRIBE_DATA_SINGLET, "sag", 1, sag + 4e-13));
  assert.ok(Math.abs(metrics["sag.maxAbs"].value - 4e-13) < 1e-16);
  assert.equal(metrics["sag.maxScaled"].value, metrics["sag.maxAbs"].value);
  assert.deepEqual(metrics["sag.maxScaled"].where, { surface: 0, sample: 1 });
});

test("terms that cancel are measured against what they add up, not against what is left", () => {
  // On a flat base, 1000 r^4 - 62.5 r^6 at r = 4: 256 000 - 256 000. What is left is 0; what was added is 512 000.
  const terms = [
    { power: 4, coeff: 1000 },
    { power: 6, coeff: -62.5 },
  ];
  const data: SystemDescribeData = {
    ...DESCRIBE_DATA_SINGLET,
    curvature: encodeNdArray(Float64Array.of(0, -0.02)),
    sagRadii: encodeNdArray(Float64Array.of(0, 2, 4, 0, 5, 10), [2, 3]),
    sag: withElement(withElement(DESCRIBE_DATA_SINGLET, "sag", 1, 12000), "sag", 2, 0).sag,
    terms: [terms, []],
  };
  // Two engines that sum those terms in another order may differ by 1e-10 mm here, and that is rounding.
  const metrics = metricsOf(data, withElement(data, "sag", 2, 1e-10));
  assert.equal(metrics["sag.maxAbs"].value, 1e-10);
  assert.equal(metrics["sag.maxScaled"].value, 1e-10 / 512000);
  assert.deepEqual(metrics["sag.maxScaled"].where, { surface: 0, sample: 2 });
  const rounding = comparePair(
    participant("a", data),
    participant("b", withElement(data, "sag", 2, 1e-10)),
    R0,
    systemDescribeComparator,
  );
  assert.equal(rounding.verdict, "PASS");
  // A difference a wrong term would make is far above it: 1e-6 of one term is 0.256 mm.
  const wrong = comparePair(
    participant("a", data),
    participant("b", withElement(data, "sag", 2, 0.256)),
    R0,
    systemDescribeComparator,
  );
  assert.equal(wrong.verdict, "FAIL");
  assert.equal(wrong.reason, "sag.maxScaled 5.00e-7 exceeds its tolerance 1.00e-12 at sample 2, surface 0");
});

test("near the height where a conic ends the root magnifies a rounding, and the scale grows with it", () => {
  // A sphere of radius 5 at r = 4.999. With s = sqrt(R^2 - r^2), the sag is R - s, and a relative rounding of what
  // is under the root moves it by r^2 / (s (R + s)) times as much.
  const [radius, r] = [5, 4.999];
  const s = Math.sqrt(radius * radius - r * r);
  const sag = radius - s;
  const scale = sag * (1 + (r * r) / (s * (radius + s)));
  assert.ok(scale > 240 && scale < 250, `about fifty times the sag: ${scale}`);
  const data: SystemDescribeData = {
    ...DESCRIBE_DATA_SINGLET,
    curvature: encodeNdArray(Float64Array.of(1 / radius, -0.02)),
    sagRadii: encodeNdArray(Float64Array.of(0, 2.5, r, 0, 5, 10), [2, 3]),
    sag: withElement(DESCRIBE_DATA_SINGLET, "sag", 2, sag).sag,
  };
  const metrics = metricsOf(data, withElement(data, "sag", 2, sag + 2e-11));
  assert.ok(Math.abs(metrics["sag.maxAbs"].value - 2e-11) < 1e-15);
  const expected = metrics["sag.maxAbs"].value / scale;
  assert.ok(
    Math.abs(metrics["sag.maxScaled"].value - expected) <= 1e-9 * expected,
    `${metrics["sag.maxScaled"].value}`,
  );
  // At a quarter of the way out the same sphere is well conditioned: the scale is the floor of 1 mm.
  const inner = metricsOf(data, withElement(data, "sag", 1, elementOf(data.sag, 1) + 2e-11));
  assert.ok(Math.abs(inner["sag.maxScaled"].value - 2e-11) < 1e-15);
  // A conic constant enters the scale: a paraboloid's root never nears 0, whatever the height.
  const parabolic = { ...data, conic: encodeNdArray(Float64Array.of(-1, 0)) };
  const flat = metricsOf(parabolic, withElement(parabolic, "sag", 2, sag + 2e-11));
  assert.ok(flat["sag.maxScaled"].value > 4 * expected);
});

test("the scale is the larger of the two answers', so no answer can talk its own difference down", () => {
  const sag = elementOf(DESCRIBE_DATA_SINGLET.sag, 1);
  const honest = withElement(DESCRIBE_DATA_SINGLET, "sag", 1, sag + 1e-9);
  // The other answer claims a term of 1e6 mm on the surface that differs.
  const inflated: SystemDescribeData = { ...honest, terms: [[{ power: 4, coeff: 1600 }], []] };
  const metrics = metricsOf(DESCRIBE_DATA_SINGLET, inflated);
  assert.ok(metrics["sag.maxScaled"].value < 1e-14);
  // It does not get away with it: the terms are compared as well.
  assert.deepEqual(metrics["shape.mismatches"].where, { field: "terms", surface: 0, power: 4 });
  const pair = comparePair(
    participant("a", DESCRIBE_DATA_SINGLET),
    participant("b", inflated),
    R0,
    systemDescribeComparator,
  );
  assert.equal(pair.verdict, "FAIL");
  assert.equal(pair.reason, "shape.mismatches 1 exceeds its tolerance 0 at field terms, power 4, surface 0");
});

// ── Answers of different shapes ──────────────────────────────────────────────────────────────────────────────────

test("another number of surfaces is a mismatch, and the surfaces both answers have are still compared", () => {
  // The singlet with a third surface behind it, and its second surface moved.
  const three: SystemDescribeData = {
    ...DESCRIBE_DATA_SINGLET,
    surfaceCount: 3,
    vertexZ: encodeNdArray(Float64Array.of(0, 4.5, 9)),
    curvature: encodeNdArray(Float64Array.of(1 / 50, 1 / -50, 0)),
    conic: encodeNdArray(new Float64Array(3)),
    clipRadius: encodeNdArray(Float64Array.of(10, 10, 10)),
    indexAfterSurface: encodeNdArray(Float64Array.of(1.5168, 1, 1), [1, 3]),
    sagRadii: encodeNdArray(Float64Array.of(0, 5, 10, 0, 5, 10, 0, 5, 10), [3, 3]),
    sag: encodeNdArray(Float64Array.of(...decodeNdArray(DESCRIBE_DATA_SINGLET.sag).values, 0, 0, 0), [3, 3]),
    terms: [[], [], []],
  };
  const metrics = metricsOf(DESCRIBE_DATA_SINGLET, three);
  assert.deepEqual(metrics["layout.mismatches"], {
    name: "layout.mismatches",
    value: 2,
    where: { field: "surfaceCount" },
  });
  for (const name of ["shape.mismatches", "aperture.mismatches", "index.mismatches", "sag.maxAbs"]) {
    assert.equal(metrics[name].value, 0, name);
  }
  const pair = comparePair(
    participant("a", DESCRIBE_DATA_SINGLET),
    participant("b", three),
    R0,
    systemDescribeComparator,
  );
  assert.equal(pair.verdict, "FAIL");
  assert.equal(pair.reason, "layout.mismatches 2 exceeds its tolerance 0 at field surfaceCount");
});

test("with another number of surfaces and several lines, each answer's index table is read by its own row length", () => {
  // The base, two surfaces at two lines, and the same system with a third surface behind it: a plane in air.
  const three: SystemDescribeData = {
    ...BASE,
    surfaceCount: 3,
    vertexZ: encodeNdArray(Float64Array.of(0, 3, 5)),
    curvature: encodeNdArray(Float64Array.of(0.025, 1 / -6, 0)),
    conic: encodeNdArray(Float64Array.of(-1, 0, 0)),
    clipRadius: encodeNdArray(Float64Array.of(12.000000001, 2.250000001, 5)),
    // Row by row: the second line starts at element 3 here, and at element 2 in the base.
    indexAfterSurface: encodeNdArray(Float64Array.of(1.5168, 1, 1, 1.5224, 1, 1), [2, 3]),
    sagRadii: encodeNdArray(Float64Array.of(6, 12, 4, 8, 2.5, 5), [3, 2]),
    sag: encodeNdArray(Float64Array.of(...decodeNdArray(BASE.sag).values, 0, 0), [3, 2]),
    terms: [...BASE.terms, []],
  };
  const metrics = metricsOf(BASE, three);
  assert.deepEqual(metrics["layout.mismatches"], {
    name: "layout.mismatches",
    value: 1,
    where: { field: "surfaceCount" },
  });
  // The two surfaces both answers have are the same at both lines.
  for (const name of ["shape.mismatches", "aperture.mismatches", "index.mismatches", "sag.maxAbs"]) {
    assert.equal(metrics[name].value, 0, name);
  }
  // An index of the second line that differs is found at its line and surface, in either answer's layout.
  const other = withElement(three, "indexAfterSurface", 3, 1.5225);
  assert.deepEqual(metricsOf(BASE, other)["index.mismatches"], {
    name: "index.mismatches",
    value: 1,
    where: { field: "indexAfterSurface", line: 1, surface: 0 },
  });
});

test("answers for another number of lines, or with the sag at another number of radii, are not comparable", () => {
  const lines = { ...BASE, indexAfterSurface: encodeNdArray(Float64Array.of(1.5168, 1), [1, 2]) };
  assert.deepEqual(systemDescribeComparator.compare(BASE, lines), {
    comparable: false,
    reason: "the answers are for different numbers of lines: 2 and 1",
  });
  const radii = {
    ...BASE,
    sagRadii: encodeNdArray(Float64Array.of(6, 4), [2, 1]),
    sag: encodeNdArray(Float64Array.of(0.45, -1.5), [2, 1]),
  };
  assert.deepEqual(systemDescribeComparator.compare(BASE, radii), {
    comparable: false,
    reason: "the answers give the sag at different numbers of radii: 2 and 1",
  });
  const pair = comparePair(participant("a", BASE), participant("b", radii), R0, systemDescribeComparator);
  assert.equal(pair.verdict, "ERROR");
  assert.equal(pair.reason, "the answers give the sag at different numbers of radii: 2 and 1");
});

test("the comparator does not change the data it is given", () => {
  const [a, b] = [structuredClone(BASE), withElement(BASE, "sag", 0, 1)];
  const before = JSON.stringify([a, b]);
  systemDescribeComparator.compare(a, b);
  assert.equal(JSON.stringify([a, b]), before);
});
