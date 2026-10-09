// The floor rule: a pair of the engine with a known numerical floor that is above a tolerance is FLOOR, not FAIL,
// exactly when that engine is within the floor's limit of the arbiter and no witness sides with it against the
// arbiter. Each of the rule's conditions is failed here on its own, and a witness is shown in each of its three
// parts: corroborating, not corroborating, and siding with the floored engine.
import assert from "node:assert/strict";
import { test } from "node:test";

import { attributeFloor } from "../../src/compare/floor.ts";
import { compareGroup } from "../../src/compare/group.ts";
import type { ComparisonGroup } from "../../src/compare/group.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { comparisonInvariantProblems } from "../../src/contract/comparison.ts";
import type { PairComparison } from "../../src/contract/comparison.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type { RaysTraceData } from "../../src/contract/quantities/raysTrace.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { BASE, LENS, SPEC, STOP_CLIP, WAVE_MM, changed, hitAt, hitRadius, stopAt, tracer } from "./raysSupport.ts";

const POLICY = loadPolicy();
const CONTEXT = { spec: SPEC, opticalCase: LENS };

/** A trace whose hit of ray 2 on surface 1 lies `mm` from the base's, along z: one engine's own rounding. */
function offBy(mm: number, from: RaysTraceData = BASE): RaysTraceData {
  return changed(from, (arrays) => void (arrays.hits[hitAt(arrays, 1, 2) + 2] += mm));
}

/**
 * A trace whose exit direction of ray 2 is `by` from the base's in its x component, which is -0.0041 there: a
 * difference of a component of a unit vector, as an engine that met a steep surface a little way off reports it.
 */
function turnedBy(by: number, from: RaysTraceData = BASE): RaysTraceData {
  return changed(from, (arrays) => void (arrays.exitDirection[3 * 2] += by));
}

/** A trace whose path of ray 1 to the image is `waves` waves of the first line longer than the base's. */
function longerBy(waves: number): RaysTraceData {
  return changed(BASE, (arrays) => void (arrays.opticalPathToImage[1] += waves * WAVE_MM[0]));
}

function groupOf(rung: "r2" | "r3", participants: readonly ParticipantResult[], policy?: RungPolicy): ComparisonGroup {
  return {
    suite: "floor",
    run: "one",
    caseId: LENS.id,
    rung,
    quantity: "rays.trace",
    requestId: "1".repeat(64),
    participants,
    policy: policy ?? POLICY.rungs[rung],
    comparator: COMPARATORS.get("rays.trace", rung),
    context: CONTEXT,
  };
}

/** The pairs of a group compared pairwise, as `a b` to the pair. */
function pairsOf(group: ComparisonGroup): Record<string, PairComparison> {
  const set = compareGroup(group, "pairwise");
  assert.deepEqual(validateKind("comparison", set), []);
  assert.deepEqual(comparisonInvariantProblems(set), []);
  return Object.fromEntries(set.pairs.map((pair) => [`${pair.a} ${pair.b}`, pair]));
}

test("the policy gives lv a floor against ref, in the two rungs of traced rays, with limits around each gate", () => {
  for (const rung of ["r2", "r3"] as const)
    assert.deepEqual(POLICY.rungs[rung].floor, { engine: "lv", arbiter: "ref" });
  assert.deepEqual(POLICY.rungs.r2.metrics["hits.maxDistance"].floor, { limit: 1e-7, agreement: 1e-10 });
  assert.deepEqual(POLICY.rungs.r3.metrics["opticalPathToImage.maxAbs"].floor, { limit: 2e-4, agreement: 1e-7 });
  // The exit direction: ten times its gate of 1e-9, where every other engine is within 1e-12 of ref.
  assert.deepEqual(POLICY.rungs.r2.metrics["direction.maxAbs"], {
    tolerance: 1e-9,
    unit: "1",
    floor: { limit: 1e-8, agreement: 1e-12 },
  });
  // Which rays got through has no floor: a count is right or it is not.
  assert.equal(POLICY.rungs.r2.metrics["mask.mismatches"].floor, undefined);
});

test("lv against ref, a hit 3e-8 mm off: above the gate, within the floor's limit, and so FLOOR", () => {
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("ref", BASE)]));
  const pair = pairs["lv ref"];
  assert.equal(pair.verdict, "FLOOR");
  assert.equal(pair.class, "gated");
  // The reason keeps what exceeded which gate, and adds the figures against the arbiter for every floored metric.
  assert.equal(
    pair.reason,
    "hits.maxDistance 3.00e-8 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 2, surface 1; floor of lv: " +
      "lv against ref direction.maxAbs 0 within 1.00e-8, lv against ref hits.maxDistance 3.00e-8 within 1.00e-7, " +
      "lv against ref landing.maxDistance 0 within 1.00e-7",
  );
  // The metrics are the pair's own, as measured.
  assert.ok(Math.abs((pair.metrics[0].value ?? 0) - 3e-8) < 1e-14);
  // The same in the other mode, and with the reference named either way: a pair is judged alike everywhere.
  for (const reference of ["lv", "ref"]) {
    const set = compareGroup(
      groupOf("r2", [tracer("ref", BASE), tracer("lv", offBy(3e-8))]),
      "reference-vs-each",
      reference,
    );
    assert.deepEqual([set.pairs[0].verdict, set.pairs[0].reason], ["FLOOR", pair.reason], reference);
  }
});

test("condition 1: without a metric above its gate there is nothing to attribute: PASS, not FLOOR", () => {
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(9e-9)), tracer("ref", BASE)]));
  assert.deepEqual([pairs["lv ref"].verdict, pairs["lv ref"].reason], ["PASS", undefined]);
});

test("condition 2: lv more than the floor's limit from ref is no floor: FAIL, with the figure that is too large", () => {
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(1.5e-7)), tracer("ref", BASE)]));
  assert.equal(pairs["lv ref"].verdict, "FAIL");
  assert.equal(
    pairs["lv ref"].reason,
    "hits.maxDistance 1.50e-7 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 2, surface 1; " +
      "not a floor of lv: hits.maxDistance against ref 1.50e-7 exceeds the floor limit 1.00e-7",
  );
  // The limit is inclusive, as every limit of a policy is. On the stop's plane, at z = 7, an offset of 2^-24 mm is
  // the difference to the last bit.
  const policy: RungPolicy = {
    ...POLICY.rungs.r2,
    metrics: {
      ...POLICY.rungs.r2.metrics,
      "hits.maxDistance": { tolerance: 1e-8, unit: "mm", floor: { limit: 2 ** -24, agreement: 1e-10 } },
    },
  };
  const verdictAt = (mm: number): string => {
    const lv = changed(BASE, (arrays) => void (arrays.hits[hitAt(arrays, 2, 2) + 2] += mm));
    return pairsOf(groupOf("r2", [tracer("lv", lv), tracer("ref", BASE)], policy))["lv ref"].verdict;
  };
  assert.equal(verdictAt(2 ** -24), "FLOOR");
  assert.equal(verdictAt(2 ** -24 + 2 ** -50), "FAIL");
});

test("three engines: lv is FLOOR against ref and against the engine that agrees with ref, which itself passes", () => {
  // The third engine is ref to within 5e-11 mm: its own rounding, far inside the 1e-10 mm of agreement.
  const other = offBy(5e-11);
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("optiland", other), tracer("ref", BASE)]));
  assert.equal(pairs["optiland ref"].verdict, "PASS");
  assert.equal(pairs["lv ref"].verdict, "FLOOR");
  assert.equal(pairs["lv optiland"].verdict, "FLOOR");
  // The pair with the arbiter states the witness too, and the pair with the witness states lv against the arbiter.
  assert.equal(
    pairs["lv ref"].reason,
    "hits.maxDistance 3.00e-8 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 2, surface 1; floor of lv: " +
      "optiland against ref direction.maxAbs 0 within 1.00e-12, " +
      "optiland against ref hits.maxDistance 5.00e-11 within 1.00e-10, " +
      "optiland against ref landing.maxDistance 0 within 1.00e-10, " +
      "lv against ref direction.maxAbs 0 within 1.00e-8, lv against ref hits.maxDistance 3.00e-8 within 1.00e-7, " +
      "lv against ref landing.maxDistance 0 within 1.00e-7",
  );
  assert.match(
    pairs["lv optiland"].reason ?? "",
    /^hits\.maxDistance 2\.99e-8 exceeds its tolerance 1\.00e-8 at .*; floor of lv: optiland against ref direction\.maxAbs 0 within 1\.00e-12, optiland against ref hits\.maxDistance 5\.00e-11 within 1\.00e-10, .*lv against ref hits\.maxDistance 3\.00e-8 within 1\.00e-7/,
  );
});

test("a witness that does not corroborate withholds nothing: still FLOOR, and the reason says how far it is", () => {
  // The third engine is 3e-10 mm from ref: inside the gate, so it passes against ref, and outside the agreement.
  // It is a hundred times nearer to ref than to lv: whose rounding the excess is stays plain.
  const other = offBy(3e-10);
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("optiland", other), tracer("ref", BASE)]));
  assert.equal(pairs["optiland ref"].verdict, "PASS");
  for (const name of ["lv ref", "lv optiland"]) {
    assert.equal(pairs[name].verdict, "FLOOR", name);
    assert.match(
      pairs[name].reason ?? "",
      /; floor of lv: optiland against ref direction\.maxAbs 0 within 1\.00e-12, optiland against ref landing\.maxDistance 0 within 1\.00e-10, lv against ref direction\.maxAbs 0 within 1\.00e-8, lv against ref hits\.maxDistance 3\.00e-8 within 1\.00e-7, lv against ref landing\.maxDistance 0 within 1\.00e-7; the witness did not corroborate: optiland against ref hits\.maxDistance 3\.00e-10 exceeds 1\.00e-10$/,
    );
  }
  // A witness that is off the arbiter by more than the gate fails against the arbiter by itself; the floor of lv
  // is still lv's, as long as that witness is not nearer to lv.
  const far = pairsOf(
    groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("optiland", offBy(-5e-8)), tracer("ref", BASE)]),
  );
  assert.equal(far["optiland ref"].verdict, "FAIL");
  assert.equal(far["lv ref"].verdict, "FLOOR");
  assert.equal(far["lv optiland"].verdict, "FAIL");
  assert.match(
    far["lv optiland"].reason ?? "",
    /; not a floor of lv: the excess is of optiland: hits\.maxDistance 5\.00e-8 against ref, lv 3\.00e-8$/,
  );
  assert.match(
    far["lv ref"].reason ?? "",
    /; the witness did not corroborate: optiland against ref hits\.maxDistance 5\.00e-8 exceeds 1\.00e-10$/,
  );
});

test("condition 4: in the pair of lv with a witness that is as far from ref as lv is, the excess is no floor of lv", () => {
  // lv and the witness are the same distance from ref, on either side of it (a power of two, so the two distances
  // are the same double): the witness is nearer to ref than to lv, so it does not side with lv, and of the pair of
  // the two nobody can say whose the excess is.
  const pairs = pairsOf(
    groupOf("r2", [tracer("lv", offBy(2 ** -25)), tracer("optiland", offBy(-(2 ** -25))), tracer("ref", BASE)]),
  );
  assert.equal(pairs["lv ref"].verdict, "FLOOR");
  assert.equal(pairs["lv optiland"].verdict, "FAIL");
  assert.match(pairs["lv optiland"].reason ?? "", /; not a floor of lv: the excess is of optiland: hits\.maxDistance /);
});

test("condition 3: a witness that sides with lv against ref makes the arbiter suspect: FAIL", () => {
  // lv is 1.2e-8 mm from ref and the third engine 9e-9 mm, the same way: it passes against ref, and is three
  // times nearer to lv than to ref. Two engines of different code that agree against the arbiter are no floor.
  const pairs = pairsOf(
    groupOf("r2", [tracer("lv", offBy(1.2e-8)), tracer("optiland", offBy(9e-9)), tracer("ref", BASE)]),
  );
  assert.equal(pairs["optiland ref"].verdict, "PASS");
  assert.equal(pairs["lv optiland"].verdict, "PASS");
  assert.equal(pairs["lv ref"].verdict, "FAIL");
  assert.match(
    pairs["lv ref"].reason ?? "",
    /^hits\.maxDistance 1\.20e-8 exceeds its tolerance 1\.00e-8 at .*; not a floor of lv: arbiter-suspect: the witness optiland sides with lv against ref: hits\.maxDistance 3\.00e-9 against lv, 9\.00e-9 against ref$/,
  );
  // Exactly between the two it sides with neither: the comparison is strict.
  const between = pairsOf(
    groupOf("r2", [tracer("lv", offBy(2 ** -25)), tracer("optiland", offBy(2 ** -26)), tracer("ref", BASE)]),
  );
  assert.equal(between["lv ref"].verdict, "FLOOR");
  assert.match(
    between["lv ref"].reason ?? "",
    /; the witness did not corroborate: optiland against ref hits\.maxDistance /,
  );
  // A witness that sides with lv fails both pairs of lv that are above a gate.
  const both = pairsOf(
    groupOf("r2", [tracer("lv", offBy(6e-8)), tracer("optiland", offBy(4.5e-8)), tracer("ref", BASE)]),
  );
  for (const name of ["lv ref", "lv optiland"]) {
    assert.equal(both[name].verdict, "FAIL", name);
    assert.match(
      both[name].reason ?? "",
      /; not a floor of lv: arbiter-suspect: the witness optiland sides with lv against ref: /,
    );
  }
});

test("an engine that did not answer is no witness", () => {
  // An engine that did not answer is no witness for or against: the two that did are judged as two.
  const absent: ParticipantResult = {
    engine: "optiland",
    fingerprint: null,
    status: "unsupported",
    detail: "quantity rays.trace",
  };
  const withAbsent = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), absent, tracer("ref", BASE)]));
  assert.equal(withAbsent["lv ref"].verdict, "FLOOR");
  assert.equal(withAbsent["lv optiland"].verdict, "UNSUPPORTED");
});

test("only a pair of lv can be a floor: two other engines that far apart FAIL, whatever lv does", () => {
  const pairs = pairsOf(groupOf("r2", [tracer("lv", BASE), tracer("optiland", offBy(3e-8)), tracer("ref", BASE)]));
  assert.equal(pairs["optiland ref"].verdict, "FAIL");
  assert.equal(
    pairs["optiland ref"].reason,
    "hits.maxDistance 3.00e-8 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 2, surface 1",
  );
  assert.equal(pairs["lv ref"].verdict, "PASS");
  // lv against the engine that is off: lv is on ref, so the excess is not lv's, and the reason says whose it is.
  assert.equal(pairs["lv optiland"].verdict, "FAIL");
  assert.match(
    pairs["lv optiland"].reason ?? "",
    /; not a floor of lv: the excess is of optiland: hits\.maxDistance 3\.00e-8 against ref, lv 0$/,
  );
});

test("a metric without a floor never is one: a mask mismatch, or a number that is none", () => {
  // The hit is within the floor, and a ray is clipped by one engine well inside the stop.
  const masked = changed(offBy(3e-8), (arrays) => stopAt(arrays, 3, 2));
  const withRadius = changed(BASE, (arrays) => hitRadius(arrays, 2, 3, STOP_CLIP - 0.5));
  const mask = pairsOf(groupOf("r2", [tracer("lv", masked), tracer("ref", withRadius)]))["lv ref"];
  assert.equal(mask.verdict, "FAIL");
  assert.match(
    mask.reason ?? "",
    /mask\.mismatches 1 exceeds its tolerance 0 at .*; not a floor of lv: mask\.mismatches has no floor$/,
  );
  // In the rim band the same ray is no mismatch, and the pair is the floor it otherwise is.
  const atRim = changed(BASE, (arrays) => hitRadius(arrays, 2, 3, STOP_CLIP - 1e-9));
  assert.equal(pairsOf(groupOf("r2", [tracer("lv", masked), tracer("ref", atRim)]))["lv ref"].verdict, "FLOOR");
  // Nor does the direction's floor reach the mask: a direction within its floor, and the same ray clipped.
  const turnedAndMasked = changed(turnedBy(5e-9), (arrays) => stopAt(arrays, 3, 2));
  const both = pairsOf(groupOf("r2", [tracer("lv", turnedAndMasked), tracer("ref", withRadius)]))["lv ref"];
  assert.equal(both.verdict, "FAIL");
  assert.match(
    both.reason ?? "",
    /^direction\.maxAbs 5\.00e-9 exceeds .*; not a floor of lv: mask\.mismatches has no floor$/,
  );

  const broken = changed(BASE, (arrays) => void (arrays.hits[hitAt(arrays, 1, 2)] = NaN));
  const nan = pairsOf(groupOf("r2", [tracer("lv", broken), tracer("ref", BASE)]))["lv ref"];
  assert.equal(nan.verdict, "FAIL");
  assert.match(
    nan.reason ?? "",
    /^hits\.maxDistance is NaN at .*; not a floor of lv: hits\.maxDistance is not a number$/,
  );
  // A direction that is no number is no floor either.
  const lost = changed(BASE, (arrays) => void (arrays.exitDirection[3 * 2] = NaN));
  const none = pairsOf(groupOf("r2", [tracer("lv", lost), tracer("ref", BASE)]))["lv ref"];
  assert.equal(none.verdict, "FAIL");
  assert.match(
    none.reason ?? "",
    /^direction\.maxAbs is NaN at .*; not a floor of lv: direction\.maxAbs is not a number$/,
  );
});

test("the exit direction, lv against ref: 5e-9 is above the gate and within the floor's limit, and so FLOOR", () => {
  const pairs = pairsOf(groupOf("r2", [tracer("lv", turnedBy(5e-9)), tracer("ref", BASE)]));
  const pair = pairs["lv ref"];
  assert.equal(pair.verdict, "FLOOR");
  // Nothing else is off: the positions of the same rays are the base's, and the reason states each figure.
  assert.equal(
    pair.reason,
    "direction.maxAbs 5.00e-9 exceeds its tolerance 1.00e-9 at field 0, line 0, ray 2; floor of lv: " +
      "lv against ref direction.maxAbs 5.00e-9 within 1.00e-8, lv against ref hits.maxDistance 0 within 1.00e-7, " +
      "lv against ref landing.maxDistance 0 within 1.00e-7",
  );
  // Within the gate there is nothing to attribute: PASS, not FLOOR.
  const within = pairsOf(groupOf("r2", [tracer("lv", turnedBy(9e-10)), tracer("ref", BASE)]))["lv ref"];
  assert.deepEqual([within.verdict, within.reason], ["PASS", undefined]);
  // The same in the other mode, with the reference named either way.
  for (const reference of ["lv", "ref"]) {
    const set = compareGroup(
      groupOf("r2", [tracer("ref", BASE), tracer("lv", turnedBy(5e-9))]),
      "reference-vs-each",
      reference,
    );
    assert.deepEqual([set.pairs[0].verdict, set.pairs[0].reason], ["FLOOR", pair.reason], reference);
  }
  // Only lv has the floor: another engine as far from ref fails, and lv's pair with it is no floor of lv.
  const others = pairsOf(groupOf("r2", [tracer("lv", BASE), tracer("optiland", turnedBy(5e-9)), tracer("ref", BASE)]));
  assert.equal(others["optiland ref"].verdict, "FAIL");
  assert.equal(
    others["optiland ref"].reason,
    "direction.maxAbs 5.00e-9 exceeds its tolerance 1.00e-9 at field 0, line 0, ray 2",
  );
  assert.equal(others["lv ref"].verdict, "PASS");
  assert.equal(others["lv optiland"].verdict, "FAIL");
});

test("the exit direction, condition 3: lv beyond ten times the gate is no floor, and the limit is inclusive", () => {
  const pair = pairsOf(groupOf("r2", [tracer("lv", turnedBy(2e-8)), tracer("ref", BASE)]))["lv ref"];
  assert.equal(pair.verdict, "FAIL");
  assert.equal(
    pair.reason,
    "direction.maxAbs 2.00e-8 exceeds its tolerance 1.00e-9 at field 0, line 0, ray 2; " +
      "not a floor of lv: direction.maxAbs against ref 2.00e-8 exceeds the floor limit 1.00e-8",
  );
  // The policy's own limit, from both sides.
  const verdictOf = (by: number): string =>
    pairsOf(groupOf("r2", [tracer("lv", turnedBy(by)), tracer("ref", BASE)]))["lv ref"].verdict;
  assert.deepEqual([9.9e-9, 1.01e-8].map(verdictOf), ["FLOOR", "FAIL"]);

  // To the last bit: ray 0 starts on the meridional plane, so the x component of its direction is 0 in the base,
  // and a component of 2^-27 is that far from it exactly.
  const policy: RungPolicy = {
    ...POLICY.rungs.r2,
    metrics: {
      ...POLICY.rungs.r2.metrics,
      "direction.maxAbs": { tolerance: 1e-9, unit: "1", floor: { limit: 2 ** -27, agreement: 1e-12 } },
    },
  };
  const verdictAt = (component: number): string => {
    const lv = changed(BASE, (arrays) => {
      assert.equal(arrays.exitDirection[0], 0);
      arrays.exitDirection[0] = component;
    });
    return pairsOf(groupOf("r2", [tracer("lv", lv), tracer("ref", BASE)], policy))["lv ref"].verdict;
  };
  assert.equal(verdictAt(2 ** -27), "FLOOR");
  assert.equal(verdictAt(2 ** -27 * (1 + 2 ** -52)), "FAIL");
});

test("the exit direction: a third engine corroborates ref within 1e-12 in direction, and is named beyond it", () => {
  // The third engine's direction is 5e-13 from ref's: its own rounding, and a witness that ref is right.
  const near = pairsOf(
    groupOf("r2", [tracer("lv", turnedBy(5e-9)), tracer("optiland", turnedBy(5e-13)), tracer("ref", BASE)]),
  );
  assert.equal(near["optiland ref"].verdict, "PASS");
  assert.equal(near["lv ref"].verdict, "FLOOR");
  assert.equal(near["lv optiland"].verdict, "FLOOR");
  assert.equal(
    near["lv ref"].reason,
    "direction.maxAbs 5.00e-9 exceeds its tolerance 1.00e-9 at field 0, line 0, ray 2; floor of lv: " +
      "optiland against ref direction.maxAbs 5.00e-13 within 1.00e-12, " +
      "optiland against ref hits.maxDistance 0 within 1.00e-10, " +
      "optiland against ref landing.maxDistance 0 within 1.00e-10, " +
      "lv against ref direction.maxAbs 5.00e-9 within 1.00e-8, lv against ref hits.maxDistance 0 within 1.00e-7, " +
      "lv against ref landing.maxDistance 0 within 1.00e-7",
  );

  // 2e-12 from ref is far inside the gate, so that engine passes against ref, and outside the agreement: it does
  // not corroborate, and is named with its distance.
  const apart = pairsOf(
    groupOf("r2", [tracer("lv", turnedBy(5e-9)), tracer("optiland", turnedBy(2e-12)), tracer("ref", BASE)]),
  );
  assert.equal(apart["optiland ref"].verdict, "PASS");
  for (const name of ["lv ref", "lv optiland"]) {
    assert.equal(apart[name].verdict, "FLOOR", name);
    assert.match(
      apart[name].reason ?? "",
      /^direction\.maxAbs \d\.\d\de-9 exceeds its tolerance 1\.00e-9 at .*; floor of lv: .*; the witness did not corroborate: optiland against ref direction\.maxAbs 2\.00e-12 exceeds 1\.00e-12$/,
    );
  }
  // The witness is looked at in every metric that has floor limits, whichever of them lv exceeds.
  const hit = pairsOf(
    groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("optiland", turnedBy(2e-12)), tracer("ref", BASE)]),
  );
  assert.equal(hit["lv ref"].verdict, "FLOOR");
  assert.match(
    hit["lv ref"].reason ?? "",
    /^hits\.maxDistance 3\.00e-8 exceeds .*; the witness did not corroborate: optiland against ref direction\.maxAbs 2\.00e-12 exceeds 1\.00e-12$/,
  );
  // A witness whose direction is nearer to lv's than to ref's makes the arbiter suspect.
  const sided = pairsOf(
    groupOf("r2", [tracer("lv", turnedBy(5e-9)), tracer("optiland", turnedBy(4e-9)), tracer("ref", BASE)]),
  );
  assert.equal(sided["lv ref"].verdict, "FAIL");
  assert.match(
    sided["lv ref"].reason ?? "",
    /; not a floor of lv: arbiter-suspect: the witness optiland sides with lv against ref: direction\.maxAbs /,
  );
});

test("a direction and a position above their gates together: FLOOR when both are within their limits, FAIL when either is not", () => {
  const verdictOf = (hitMm: number, direction: number) =>
    pairsOf(groupOf("r2", [tracer("lv", turnedBy(direction, offBy(hitMm))), tracer("ref", BASE)]))["lv ref"];

  // Both above their gates, both within their limits: one floor, and the reason names both excesses.
  const both = verdictOf(3e-8, 5e-9);
  assert.equal(both.verdict, "FLOOR");
  assert.equal(
    both.reason,
    "direction.maxAbs 5.00e-9 exceeds its tolerance 1.00e-9 at field 0, line 0, ray 2; " +
      "hits.maxDistance 3.00e-8 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 2, surface 1; floor of lv: " +
      "lv against ref direction.maxAbs 5.00e-9 within 1.00e-8, lv against ref hits.maxDistance 3.00e-8 within 1.00e-7, " +
      "lv against ref landing.maxDistance 0 within 1.00e-7",
  );
  // The position beyond its limit: the direction's floor does not carry it.
  const hitBeyond = verdictOf(1.5e-7, 5e-9);
  assert.equal(hitBeyond.verdict, "FAIL");
  assert.match(
    hitBeyond.reason ?? "",
    /; not a floor of lv: hits\.maxDistance against ref 1\.50e-7 exceeds the floor limit 1\.00e-7$/,
  );
  // The direction beyond its limit: the position's floor does not carry it.
  const directionBeyond = verdictOf(3e-8, 2e-8);
  assert.equal(directionBeyond.verdict, "FAIL");
  assert.match(
    directionBeyond.reason ?? "",
    /; not a floor of lv: direction\.maxAbs against ref 2\.00e-8 exceeds the floor limit 1\.00e-8$/,
  );
  // A position above its gate with a direction inside its own gate is the floor it always was, and the other way
  // round: each metric's limit is held whether or not the metric is above its tolerance.
  assert.equal(verdictOf(3e-8, 5e-10).verdict, "FLOOR");
  assert.equal(verdictOf(5e-9, 5e-9).verdict, "FLOOR");
  assert.deepEqual([verdictOf(5e-9, 5e-10).verdict, verdictOf(5e-9, 5e-10).reason], ["PASS", undefined]);
});

test("without the arbiter there is nothing to hold lv to: a pair above its gate FAILs and says so", () => {
  const missing: ParticipantResult = { engine: "ref", fingerprint: null, status: "error", detail: "engine-failure" };
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("optiland", BASE), missing]));
  assert.equal(pairs["lv optiland"].verdict, "FAIL");
  assert.match(pairs["lv optiland"].reason ?? "", /; not a floor of lv: the arbiter ref has no answer$/);
  assert.equal(pairs["lv ref"].verdict, "ERROR");
  // Nor without ref in the comparison at all.
  const two = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("optiland", BASE)]));
  assert.match(two["lv optiland"].reason ?? "", /the arbiter ref has no answer$/);
});

test("rung r3: a path 5e-5 waves off is a floor, 3e-4 is beyond it, and a witness corroborates within 1e-7", () => {
  const floor = pairsOf(groupOf("r3", [tracer("lv", longerBy(5e-5)), tracer("ref", BASE)]))["lv ref"];
  assert.equal(floor.verdict, "FLOOR");
  assert.match(
    floor.reason ?? "",
    /^opd\.maxAbs 5\.00e-5 exceeds its tolerance 2\.00e-5 at .*; opticalPathToImage\.maxAbs 5\.00e-5 exceeds its tolerance 2\.00e-5 at .*; floor of lv: lv against ref opd\.maxAbs 5\.00e-5 within 2\.00e-4, lv against ref opticalPath\.maxAbs 0 within 2\.00e-4, lv against ref opticalPathToImage\.maxAbs 5\.00e-5 within 2\.00e-4$/,
  );
  const beyond = pairsOf(groupOf("r3", [tracer("lv", longerBy(3e-4)), tracer("ref", BASE)]))["lv ref"];
  assert.equal(beyond.verdict, "FAIL");
  assert.match(
    beyond.reason ?? "",
    /; not a floor of lv: opd\.maxAbs against ref 3\.00e-4 exceeds the floor limit 2\.00e-4$/,
  );
  // A third engine 5e-8 waves from ref corroborates it; one 5e-7 waves from it does not, and withholds nothing;
  // one 4e-5 waves from it is nearer to lv, and the arbiter is suspect.
  for (const [waves, verdict, said] of [
    [5e-8, "FLOOR", /floor of lv: optiland against ref opd\.maxAbs 5\.00e-8 within 1\.00e-7, [^;]*$/],
    [5e-7, "FLOOR", /; the witness did not corroborate: optiland against ref opd\.maxAbs 5\.00e-7 exceeds 1\.00e-7, /],
    [
      4e-5,
      "FAIL",
      /; not a floor of lv: arbiter-suspect: the witness optiland sides with lv against ref: opd\.maxAbs /,
    ],
  ] as const) {
    const pairs = pairsOf(
      groupOf("r3", [tracer("lv", longerBy(5e-5)), tracer("optiland", longerBy(waves)), tracer("ref", BASE)]),
    );
    assert.equal(pairs["lv ref"].verdict, verdict, String(waves));
    assert.match(pairs["lv ref"].reason ?? "", said);
    if (waves < 1e-5) {
      assert.equal(pairs["lv optiland"].verdict, verdict, String(waves));
      assert.equal(pairs["optiland ref"].verdict, "PASS");
    }
  }
  // A metric that was not measured is no part of the rule: without a chief ray the two raw paths decide.
  const { chiefIndex: _chief, ...groups } = SPEC.groups ?? {};
  const group = {
    ...groupOf("r3", [tracer("lv", longerBy(5e-5)), tracer("ref", BASE)]),
    context: { opticalCase: LENS, spec: { ...SPEC, groups } },
  };
  const unreferenced = pairsOf(group)["lv ref"];
  assert.equal(unreferenced.verdict, "FLOOR");
  assert.match(
    unreferenced.reason ?? "",
    /opd\.maxAbs was not measured: the set has no chief ray; floor of lv: lv against ref opticalPath\.maxAbs 0 within 2\.00e-4, lv against ref opticalPathToImage\.maxAbs 5\.00e-5 within 2\.00e-4$/,
  );
});

test("a rung without a floor, and a verdict that is no FAIL, come back as they are", () => {
  const { floor: _floor, ...plain } = POLICY.rungs.r2;
  const metrics = Object.fromEntries(
    Object.entries(plain.metrics).map(([name, { floor: _limits, ...metric }]) => [name, metric]),
  );
  const unfloored: RungPolicy = { ...plain, metrics };
  const pairs = pairsOf(groupOf("r2", [tracer("lv", offBy(3e-8)), tracer("ref", BASE)], unfloored));
  assert.equal(pairs["lv ref"].verdict, "FAIL");
  assert.equal(
    pairs["lv ref"].reason,
    "hits.maxDistance 3.00e-8 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 2, surface 1",
  );

  // attributeFloor is given a pair and returns it, the same object, unless it is a FAIL it makes a FLOOR of.
  const inputs = {
    participants: [tracer("lv", offBy(3e-8)), tracer("ref", BASE)],
    policy: POLICY.rungs.r2,
    comparator: COMPARATORS.get("rays.trace", "r2"),
    context: CONTEXT,
  };
  const failed = comparePair(
    inputs.participants[0],
    inputs.participants[1],
    inputs.policy,
    inputs.comparator,
    undefined,
    CONTEXT,
  );
  assert.equal(failed.verdict, "FAIL");
  assert.equal(attributeFloor(failed, inputs).verdict, "FLOOR");
  assert.equal(attributeFloor(failed, { ...inputs, policy: unfloored }), failed);
  for (const verdict of ["PASS", "ERROR", "BLOCKED", "UNSUPPORTED"] as const) {
    const pair: PairComparison = { ...failed, verdict };
    assert.equal(attributeFloor(pair, inputs), pair, verdict);
  }
  // A pure function: the same pair and inputs give the same pair again.
  assert.deepEqual(attributeFloor(failed, inputs), attributeFloor(structuredClone(failed), inputs));
});
