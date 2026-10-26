// The comparator of `axial.native` for rung R8b, on synthetic answers: an engine that states its figures beside one
// that states its rays, which the comparator forms figures of with its own estimator. The rays are aimed at the axis
// where the numbers are dyadic, so the figures of the rays are known in closed form; every number is synthetic, the
// limits of the sorting binary fractions.
import assert from "node:assert/strict";
import { test } from "node:test";

import { axialFactsOfRecorded, axialNativeComparator, classifyAxialLine } from "../../src/compare/axialNative.ts";
import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RungPolicy } from "../../src/contract/policy.ts";
import type {
  AxialFigures,
  AxialNativeData,
  AxialNativeField,
  AxialNativeSpec,
} from "../../src/contract/quantities/axialNative.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { axialIntercepts, heightAt, sphericalFigures } from "../../src/estimators/axialIntercept.ts";
import { axialNativeQuantity } from "../../src/quantities/axialNative.ts";
import { LENS } from "./raysSupport.ts";

/** The image plane of `LENS`, where the identifying rays land. */
const IMAGE_Z = LENS.conditions.imageZ;

const SPHERICAL: AxialNativeSpec = {
  kind: "spherical",
  lines: [0],
  nearAxis: 0.25,
  marginal: [1, 0.5],
  profile: [0.25, 0.5, 1],
};

const COLOUR: AxialNativeSpec = { kind: "colour", lines: [0, 1], marginal: [1, 0.5] };

const POLICY: RungPolicy = {
  quantity: "axial.native",
  mode: "independent-method",
  class: "recorded",
  metrics: {
    "landing.maxAbs": { attention: 2 ** -17, unit: "mm" },
    "pupilRadius.relative": { attention: 2 ** -30, unit: "1" },
  },
};

/** Where a ray of fraction f crosses the axis: f^2 in front of a focus, which `shift` moves along the axis. */
function interceptOf(fraction: number, shift = 0): number {
  return IMAGE_Z - fraction * fraction + shift;
}

/** The rays of signed fractions, leaving z = 50 at the height 8 f toward their crossing; the lost ones NaN. */
function raysOf(fractions: readonly number[], shift = 0, lost: readonly number[] = []): AxialNativeField["rays"] {
  const point: number[] = [];
  const direction: number[] = [];
  const arrived: number[] = [];
  for (const fraction of fractions) {
    const gone = lost.includes(fraction);
    arrived.push(gone ? 0 : 1);
    const y = 8 * fraction;
    point.push(...(gone ? [NaN, NaN, NaN] : [0, y, 50]));
    direction.push(...(gone ? [NaN, NaN, NaN] : [0, -y, interceptOf(Math.abs(fraction), shift) - 50]));
  }
  return {
    fractions: encodeNdArray(Float64Array.from(fractions)),
    arrived: encodeNdArray(Uint8Array.from(arrived)),
    exitPoint: encodeNdArray(Float64Array.from(point), [fractions.length, 3]),
    exitDirection: encodeNdArray(Float64Array.from(direction), [fractions.length, 3]),
  };
}

const SIGNED = [0.25, -0.25, 1, -1, 0.5, -0.5];

function field(line: number, more: Partial<AxialNativeField>): AxialNativeField {
  return {
    line,
    wavelengthNm: [587.5, 656.25][line],
    status: "ok",
    paraxialFocusZ: null,
    figures: null,
    rays: null,
    sampling: {},
    ...more,
  };
}

function answer(kind: AxialNativeData["kind"], fields: AxialNativeField[]): AxialNativeData {
  const data: AxialNativeData = {
    kind,
    pupilRadiusMm: 8,
    fields,
    method: { name: fields.some((each) => each.rays !== null) ? "rays" : "figures", params: {} },
    notes: [],
  };
  assert.deepEqual(axialNativeQuantity.validateData(data), []);
  return data;
}

/** The estimator's figures of a line of rays, as an engine that states figures would state them. */
function figuresOfRays(rays: NonNullable<AxialNativeField["rays"]>, marginal: readonly number[]): AxialFigures {
  const set = axialIntercepts({
    exitPoint: Float64Array.from(raysValues(rays.exitPoint)),
    exitDirection: Float64Array.from(raysValues(rays.exitDirection)),
    valid: Uint8Array.from(raysValues(rays.arrived)),
  });
  const made = sphericalFigures(
    set,
    { fractions: Float64Array.from(raysValues(rays.fractions)), nearAxis: 0.25, marginal, profile: [0.25, 0.5, 1] },
    IMAGE_Z,
  );
  assert.ok("figures" in made);
  return { ...made.figures, profileMm: encodeNdArray(made.figures.profileMm) };
}

function raysValues(wire: Parameters<typeof decodeNdArray>[0]): number[] {
  return Array.from(decodeNdArray(wire).values as ArrayLike<number>);
}

function compared(a: AxialNativeData, b: AxialNativeData, spec: AxialNativeSpec = SPHERICAL): ComparatorOutcome {
  return axialNativeComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, {
    spec: spec as unknown as JsonObject,
    opticalCase: LENS,
    policy: POLICY,
  });
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

test("an engine's figures beside the figures of another's rays: equal figures differ by nothing", () => {
  const rays = raysOf(SIGNED);
  const figures = figuresOfRays(rays!, [1, 0.5]);
  const outcome = compared(
    answer("spherical", [field(0, { figures })]),
    answer("spherical", [field(0, { rays, paraxialFocusZ: 59.75 })]),
  );
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["pupilRadius.relative", 0],
      ["landing.maxAbs", 0],
      ["marginalIntercept.maxAbs", 0],
      ["nearAxisIntercept.maxAbs", 0],
      ["longitudinalSa.maxAbs", 0],
      ["bestFocus.maxAbs", 0],
      ["bestFocusRms.maxAbs", 0],
      ["profile.maxAbs", 0],
      ["fields.compared", 1],
      ["fields.data", 0],
      ["fields.unavailable", 0],
    ],
  );
  assert.deepEqual(outcome.inapplicable, ["lineFocus.maxAbs", "relativeFocus.maxAbs", "paraxialFocalShift.maxAbs"]);
  // The near-axis pair crosses at f - 1/16, the marginal pair 1 at f - 1: closed forms of the rays.
  assert.equal(figures.nearAxisInterceptZ, IMAGE_Z - 0.0625);
  assert.equal(figures.marginalInterceptZ, IMAGE_Z - 1);
});

test("each figure of spherical aberration is the difference of the two answers' own", () => {
  const rays = raysOf(SIGNED);
  const base = figuresOfRays(rays!, [1, 0.5]);
  const profile = Float64Array.from(decodeNdArray(base.profileMm!).values as Float64Array);
  profile[1] += 2 ** -20;
  const figures: AxialFigures = {
    ...base,
    nearAxisInterceptZ: base.nearAxisInterceptZ! + 2 ** -10,
    marginalInterceptZ: base.marginalInterceptZ + 2 ** -12,
    bestFocusZ: base.bestFocusZ! - 2 ** -14,
    bestFocusRmsMm: base.bestFocusRmsMm! + 2 ** -16,
    profileMm: encodeNdArray(profile),
  };
  const outcome = compared(answer("spherical", [field(0, { figures })]), answer("spherical", [field(0, { rays })]));
  assert.equal(metric(outcome, "nearAxisIntercept.maxAbs")?.value, 2 ** -10);
  assert.equal(metric(outcome, "marginalIntercept.maxAbs")?.value, 2 ** -12);
  assert.equal(metric(outcome, "longitudinalSa.maxAbs")?.value, 2 ** -10 - 2 ** -12);
  assert.equal(metric(outcome, "bestFocus.maxAbs")?.value, 2 ** -14);
  assert.equal(metric(outcome, "bestFocusRms.maxAbs")?.value, 2 ** -16);
  const zone = metric(outcome, "profile.maxAbs");
  assert.deepEqual([zone?.value, zone?.where], [2 ** -20, { line: 0, ray: 1 }]);
});

test("the rays' figures are formed at the marginal fraction the other answer took", () => {
  // The marginal candidate 1 is lost in the rays: by their own rule they would take 0.5, as the figures do too.
  const rays = raysOf(SIGNED, 0, [-1]);
  const figures = figuresOfRays(raysOf(SIGNED)!, [0.5, 1]);
  assert.equal(figures.marginalFraction, 0.5);
  const outcome = compared(answer("spherical", [field(0, { figures })]), answer("spherical", [field(0, { rays })]));
  assert.equal(metric(outcome, "marginalIntercept.maxAbs")?.value, 0);
  // At a fraction whose pair the rays lost, the rays have no figures: the line is unsupported, and named.
  const outer = compared(
    answer("spherical", [field(0, { figures: figuresOfRays(raysOf(SIGNED)!, [1, 0.5]) })]),
    answer("spherical", [field(0, { rays })]),
  );
  assert.ok(outer.comparable);
  assert.equal(metric(outer, "fields.unavailable")?.value, 1);
  assert.match(outer.notes?.join("; ") ?? "", /line 0: unsupported, no-curve \(rays: no figures of its rays\)/);
});

test("a line is sorted first: landings apart are data, other wavelengths are data, a line without figures unsupported", () => {
  const rays = raysOf(SIGNED);
  const figures = figuresOfRays(rays!, [1, 0.5]);
  const apart = compared(
    answer("spherical", [field(0, { figures: { ...figures, landingMm: 2 ** -10 } })]),
    answer("spherical", [field(0, { rays })]),
  );
  assert.equal(metric(apart, "landing.maxAbs")?.value, 2 ** -10);
  assert.equal(metric(apart, "fields.data")?.value, 1);
  assert.equal(metric(apart, "marginalIntercept.maxAbs"), undefined);
  assert.ok(apart.comparable && apart.unmeasured?.some((each) => each.name === "marginalIntercept.maxAbs"));
  assert.match(
    apart.notes?.[0] ?? "",
    /^line 0: data, chief-landing-apart \(the identifying rays land 9\.77e-4 mm apart\)$/,
  );
  const other = compared(
    answer("spherical", [field(0, { figures, wavelengthNm: 546.07 })]),
    answer("spherical", [field(0, { rays })]),
  );
  assert.match(
    other.comparable ? (other.notes?.[0] ?? "") : "",
    /lines-differ \(the answers traced 546\.07 and 587\.5 nm\)/,
  );
  const without = compared(
    answer("spherical", [{ ...field(0, {}), status: "unavailable", reason: "lv-spherical-unavailable" }]),
    answer("spherical", [field(0, { rays })]),
  );
  assert.equal(metric(without, "fields.unavailable")?.value, 1);
  assert.match(
    without.comparable ? (without.notes?.[0] ?? "") : "",
    /figures: unavailable \(lv-spherical-unavailable\)/,
  );
});

test("pupils whose radii differ beyond the limit set every line aside as data; at the limit they are two methods", () => {
  // The near-axis pair's mean lands on the axis whatever the pupil: only the pupil's own limit tells the zones of
  // other radii apart. 2^-30 of the larger radius, the limit of POLICY, is within; 2^-29 beyond.
  const rays = raysOf(SIGNED);
  const figures = figuresOfRays(rays!, [1, 0.5]);
  const of = (radius: number) =>
    compared(
      { ...answer("spherical", [field(0, { figures })]), pupilRadiusMm: radius },
      answer("spherical", [field(0, { rays })]),
    );
  const at = of(8 - 8 * 2 ** -30);
  assert.equal(metric(at, "pupilRadius.relative")?.value, 2 ** -30);
  assert.equal(metric(at, "fields.compared")?.value, 1);
  assert.equal(metric(at, "nearAxisIntercept.maxAbs")?.value, 0);
  const beyond = of(8 - 8 * 2 ** -29);
  assert.equal(metric(beyond, "pupilRadius.relative")?.value, 2 ** -29);
  assert.equal(metric(beyond, "fields.data")?.value, 1);
  assert.equal(metric(beyond, "nearAxisIntercept.maxAbs"), undefined);
  // The landing of the near-axis pair is the same in both: it is not what set the line aside.
  assert.equal(metric(beyond, "landing.maxAbs")?.value, 0);
  assert.match(
    beyond.comparable ? (beyond.notes?.[0] ?? "") : "",
    /^line 0: data, pupils-apart \(the pupils' radii differ by 1\.86e-9 of the larger\)$/,
  );
  // Without a limit in the policy no line is set aside by its pupil, and the pair says so.
  const unlimited = axialNativeComparator.compare(
    { ...answer("spherical", [field(0, { figures })]), pupilRadiusMm: 4 } as unknown as JsonObject,
    answer("spherical", [field(0, { rays })]) as unknown as JsonObject,
    {
      spec: SPHERICAL as unknown as JsonObject,
      opticalCase: LENS,
      policy: { ...POLICY, metrics: { "landing.maxAbs": POLICY.metrics["landing.maxAbs"] } },
    },
  );
  assert.equal(metric(unlimited, "fields.compared")?.value, 1);
  assert.match(unlimited.comparable ? (unlimited.notes?.join("; ") ?? "") : "", /no line is set aside by its pupil/);
});

test("a line traced at indices other than the case's is data, however near its landing", () => {
  // The figures' engine states the indices it traced each line at against the case's. Above 0, the line is of other
  // indices: data, before its landing is looked at, which here is the rays' own. At 0, it is of two methods.
  const signed = [1, 0.5];
  const rayAnswer = answer("colour", [
    field(0, { rays: raysOf(signed, 0), paraxialFocusZ: 59.5 }),
    field(1, { rays: raysOf(signed, 2 ** -6), paraxialFocusZ: 59.5 + 2 ** -5 }),
  ]);
  const own = (shift: number): AxialFigures => {
    const intercept = interceptOf(1, shift);
    return {
      landingMm: heightAt(intercept, -8 / (intercept - 50), IMAGE_Z),
      marginalFraction: 1,
      marginalInterceptZ: intercept,
      nearAxisInterceptZ: null,
      bestFocusZ: null,
      bestFocusRmsMm: null,
      profileMm: null,
    };
  };
  const stated = (delta: number) =>
    answer("colour", [
      field(0, { figures: own(0), sampling: { indexMaxDelta: 0 } }),
      field(1, { figures: own(2 ** -6), sampling: { indexMaxDelta: delta } }),
    ]);
  const same = compared(stated(0), rayAnswer, COLOUR);
  assert.equal(metric(same, "fields.compared")?.value, 2);
  assert.equal(metric(same, "landing.maxAbs")?.value, 0);
  const other = compared(stated(2 ** -40), rayAnswer, COLOUR);
  assert.equal(metric(other, "fields.compared")?.value, 1);
  assert.equal(metric(other, "fields.data")?.value, 1);
  assert.equal(metric(other, "landing.maxAbs")?.value, 0);
  assert.equal(metric(other, "relativeFocus.maxAbs"), undefined);
  assert.match(
    other.comparable ? (other.notes?.[0] ?? "") : "",
    /^line 1: data, indices-differ \(figures traced indices up to 9\.09e-13 from the case's\)$/,
  );
  // Swapped, the same.
  const swapped = compared(rayAnswer, stated(2 ** -40), COLOUR);
  assert.deepEqual(swapped.comparable ? swapped.notes : [], other.comparable ? other.notes : []);
});

test("the sorting is repeated from the values a comparison records, line by line", () => {
  const signed = [1, 0.5];
  const rayAnswer = answer("colour", [
    field(0, { rays: raysOf(signed, 0) }),
    field(1, { rays: raysOf(signed, 2 ** -6) }),
  ]);
  const figures = (shift: number, landing = 0): AxialFigures => {
    const intercept = interceptOf(1, shift);
    return {
      landingMm: heightAt(intercept, -8 / (intercept - 50), IMAGE_Z) + landing,
      marginalFraction: 1,
      marginalInterceptZ: intercept,
      nearAxisInterceptZ: null,
      bestFocusZ: null,
      bestFocusRmsMm: null,
      profileMm: null,
    };
  };
  const context = { spec: COLOUR as unknown as JsonObject, opticalCase: LENS };
  const limits = [POLICY.metrics["landing.maxAbs"].attention!, POLICY.metrics["pupilRadius.relative"].attention!];
  const cases: [string, AxialNativeData][] = [
    [
      "two-methods two-methods",
      answer("colour", [field(0, { figures: figures(0) }), field(1, { figures: figures(2 ** -6) })]),
    ],
    [
      "indices-differ chief-landing-apart",
      answer("colour", [
        // Other indices and a landing apart: the indices are named, the cause before its consequence.
        field(0, { figures: figures(0, 2 ** -10), sampling: { indexMaxDelta: 2 ** -20 } }),
        field(1, { figures: figures(2 ** -6, 2 ** -10) }),
      ]),
    ],
    [
      "pupils-apart pupils-apart",
      {
        ...answer("colour", [field(0, { figures: figures(0) }), field(1, { figures: figures(2 ** -6) })]),
        pupilRadiusMm: 9,
      },
    ],
    [
      "no-curve two-methods",
      answer("colour", [
        { ...field(0, {}), status: "unavailable", reason: "lv-channel-clipped" },
        field(1, { figures: figures(2 ** -6) }),
      ]),
    ],
  ];
  for (const [expected, stated] of cases) {
    const [one, two] = [stated, rayAnswer].map((data) =>
      axialNativeComparator.recorded!(data as unknown as JsonObject, context),
    );
    const repeated = [0, 1].map(
      (line) =>
        classifyAxialLine(axialFactsOfRecorded(one, line), axialFactsOfRecorded(two, line), true, limits[0], limits[1])
          .reason,
    );
    assert.equal(repeated.join(" "), expected);
    // The comparator's own notes name the same reasons for the lines it sets aside.
    const outcome = compared(stated, rayAnswer, COLOUR);
    assert.ok(outcome.comparable);
    for (const [line, reason] of repeated.entries()) {
      const noted: boolean | undefined = outcome.notes?.some(
        (note) => note.startsWith(`line ${line}: `) && note.includes(`, ${reason} (`),
      );
      assert.equal(noted ?? false, reason !== "two-methods", `${expected}: line ${line}`);
    }
  }
});

test("axial colour: each line's focus relative to the first, real beside real and beside the paraxial shift", () => {
  // The rays of the second line cross 2^-6 further back, and its paraxial focus 2^-5 further back than the first's.
  const signed = [1, 0.5];
  const rayAnswer = answer("colour", [
    field(0, { rays: raysOf(signed, 0), paraxialFocusZ: 59.5 }),
    field(1, { rays: raysOf(signed, 2 ** -6), paraxialFocusZ: 59.5 + 2 ** -5 }),
  ]);
  // The engine of figures: its own landings, from the rays' heights at the plane, so that the lines are of two methods.
  const own = (shift: number): AxialFigures => {
    const intercept = interceptOf(1, shift);
    const landingMm = heightAt(intercept, -8 / (intercept - 50), IMAGE_Z);
    return {
      landingMm,
      marginalFraction: 1,
      marginalInterceptZ: intercept,
      nearAxisInterceptZ: null,
      bestFocusZ: null,
      bestFocusRmsMm: null,
      profileMm: null,
    };
  };
  const real = answer("colour", [
    field(0, { figures: own(0) }),
    field(1, { figures: { ...own(2 ** -6), marginalInterceptZ: interceptOf(1, 2 ** -6) + 2 ** -12 } }),
  ]);
  const outcome = compared(real, rayAnswer, COLOUR);
  assert.equal(metric(outcome, "fields.compared")?.value, 2);
  // Each line's own focus: the figures' second line is 2^-12 behind the rays'.
  const own2 = metric(outcome, "lineFocus.maxAbs");
  assert.deepEqual([own2?.value, own2?.where], [2 ** -12, { line: 1 }]);
  // Real against real: the figures' second line is 2^-12 further back.
  assert.equal(metric(outcome, "relativeFocus.maxAbs")?.value, 2 ** -12);
  // The figures' real shift, 2^-6 + 2^-12, beside the rays' engine's paraxial shift of 2^-5.
  const paraxial = metric(outcome, "paraxialFocalShift.maxAbs");
  assert.deepEqual([paraxial?.value, paraxial?.where], [Math.abs(2 ** -6 + 2 ** -12 - 2 ** -5), { line: 1 }]);
  assert.deepEqual(outcome.comparable ? outcome.inapplicable : [], [
    "marginalIntercept.maxAbs",
    "nearAxisIntercept.maxAbs",
    "longitudinalSa.maxAbs",
    "bestFocus.maxAbs",
    "bestFocusRms.maxAbs",
    "profile.maxAbs",
  ]);
  // Swapping the two answers changes no value.
  const swapped = compared(rayAnswer, real, COLOUR);
  assert.deepEqual(
    swapped.comparable ? swapped.metrics.map(({ value }) => value) : [],
    outcome.comparable ? outcome.metrics.map(({ value }) => value) : [],
  );
});

test("answers of other kinds, other lines, rays without the spec or the case, and other profiles are not comparable", () => {
  const rays = raysOf(SIGNED);
  const figures = figuresOfRays(rays!, [1, 0.5]);
  const spherical = answer("spherical", [field(0, { figures })]);
  const colour = answer("colour", [
    field(0, {
      figures: { ...figures, nearAxisInterceptZ: null, bestFocusZ: null, bestFocusRmsMm: null, profileMm: null },
    }),
  ]);
  assert.match((compared(spherical, colour) as { reason: string }).reason, /one answer is of spherical/);
  const twoLines = answer("spherical", [field(0, { figures }), field(1, { figures })]);
  assert.match((compared(spherical, twoLines) as { reason: string }).reason, /for 1 and 2 lines/);
  const raysAnswer = answer("spherical", [field(0, { rays })]);
  const without = axialNativeComparator.compare(
    spherical as unknown as JsonObject,
    raysAnswer as unknown as JsonObject,
    { opticalCase: LENS },
  );
  assert.match((without as { reason: string }).reason, /the spec or the case is not at hand/);
  const shorter = { ...figures, profileMm: encodeNdArray(Float64Array.of(0, 1)) };
  const outcome = compared(spherical, answer("spherical", [field(0, { figures: shorter })]));
  assert.match((outcome as { reason: string }).reason, /have 3 and 2 zones/);
});

test("an answer records its figures line by line, those of its rays formed by the comparator", () => {
  const rays = raysOf(SIGNED);
  const figures = figuresOfRays(rays!, [1, 0.5]);
  const context = { spec: SPHERICAL as unknown as JsonObject, opticalCase: LENS };
  const recorded = axialNativeComparator.recorded!(
    answer("spherical", [
      field(0, { rays, paraxialFocusZ: 59.75, sampling: { raysArrived: 6 } }),
    ]) as unknown as JsonObject,
    context,
  );
  assert.deepEqual(recorded.nearAxisInterceptZ, [figures.nearAxisInterceptZ]);
  assert.deepEqual(recorded.marginalInterceptZ, [figures.marginalInterceptZ]);
  assert.deepEqual(recorded.paraxialFocusZ, [59.75]);
  assert.deepEqual(recorded.raysArrived, [6]);
  assert.deepEqual(recorded.profileMm, Array.from(decodeNdArray(figures.profileMm!).values as Float64Array));
  assert.deepEqual(recorded.pupilRadiusMm, [8]);
  const blind = axialNativeComparator.recorded!(answer("spherical", [field(0, { rays })]) as unknown as JsonObject);
  assert.ok(Number.isNaN(blind.marginalInterceptZ[0]));
});
