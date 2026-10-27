// The vignetting sets of a LensVisualizer lens, with no LensVisualizer: on the fake LV tree, whose vignetting tab has
// LensVisualizer's name and rules, and a tracer and lenses of its own. What is held here is which rays the case source
// makes for the tab and that, traced, the sweeps are the tab's own: the fake's geometric transmission and relative
// illumination come back from them to the bit, an absorbing glass included; and that the lattices are LensVisualizer's
// launch lattices of the tab's fields. That the restatement is LensVisualizer's own is
// test/integration/lv/vignettingRays.test.ts, against the real one.
import assert from "node:assert/strict";
import { test } from "node:test";

import { sweepBlocks } from "../../../src/compare/raysVignetting.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import type { LvCaseModel } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { lvChiefGeometry, lvChiefRequest } from "../../../src/engines/lv/chiefSetup.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvFieldRaySets, lvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { lvVignettingFieldCount, lvVignettingPupilCount } from "../../../src/engines/lv/vignettingFields.ts";
import { VIGNETTING_PATTERNS, lvVignettingRaySets } from "../../../src/engines/lv/vignettingRaySets.ts";
import type { LvApi } from "../../../src/engines/lv/types.ts";
import { DEFAULT_BUNDLE_GRID } from "../../../src/rays/raySets.ts";
import { bind, freshLv, variantOf } from "./support.ts";

const SINGLET = "acme-singlet-50";
const SINGLET_FILE = "src/lens-data/acme/AcmeSinglet50.data.ts";

async function modelOf(
  binding: LvBinding,
  key: string,
  options: RunOptions = {},
): Promise<{ opticalCase: OpticalCase; model: LvCaseModel }> {
  const exported = await createLvExporter(binding).exportLens(key, options);
  assert.ok(exported.ok, JSON.stringify(exported));
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok, JSON.stringify(rebuilt));
  return { opticalCase: exported.opticalCase, model: rebuilt.model };
}

function f8(set: RaysTraceSpec, name: "origins" | "directions" | "weights"): Float64Array {
  return decodeNdArray(set[name]).values as Float64Array;
}

/** Whether a ray of a set passes the fake's tab: traced with its options, the stop radius the drawer hands. */
function passes(api: LvApi, model: LvCaseModel, set: RaysTraceSpec, ray: number): boolean {
  const [origins, directions] = [f8(set, "origins"), f8(set, "directions")];
  const trace = api.traceEngineRay(
    model.state,
    {
      origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
      direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
    },
    {
      checkSemiDiameter: true,
      stopSemiDiameter: model.exported.conditions.stopSemiDiameter,
      stopOnClip: true,
      directionNormalized: true,
    },
  );
  return trace.status === "ok";
}

/** The tab's curve of a sweep set, counted as the tab counts its sweeps, in its own arithmetic. */
function tabCurve(api: LvApi, model: LvCaseModel, sweep: RaysTraceSpec, halfFieldDeg: number) {
  const weights = f8(sweep, "weights");
  const blocks = sweepBlocks(sweep);
  const raw = blocks.map(({ first, end }) => {
    let [surviving, transmitted] = [0, 0];
    for (let ray = first; ray < end; ray++) {
      if (!passes(api, model, sweep, ray)) continue;
      surviving++;
      transmitted += weights[ray];
    }
    return { gt: surviving / (end - first), intensity: transmitted / (end - first) };
  });
  return raw.map(({ gt, intensity }, i) => {
    const fieldAngleDeg = api.uniformFieldFraction(i, blocks.length) * halfFieldDeg;
    const cos4 = Math.pow(Math.cos((fieldAngleDeg * Math.PI) / 180), 4);
    return {
      fieldAngleDeg,
      geometricTransmission: gt / raw[0].gt,
      relativeIllumination: (intensity * cos4) / raw[0].intensity,
    };
  });
}

test("the vignetting sets are the tab's sweeps, one set a line, and LensVisualizer's lattice of each field and line", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const { opticalCase, model } = await modelOf(binding, SINGLET, {
    lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725] },
  });
  const made = lvVignettingRaySets(api, model);
  assert.deepEqual(made.problems, []);
  assert.deepEqual(VIGNETTING_PATTERNS, ["sweep", "lattice"]);
  const geometry = lvChiefGeometry(api, model)!;
  const fields = lvVignettingFieldCount(geometry.halfFieldDeg);
  const rays = lvVignettingPupilCount(api, model.runtime);
  assert.deepEqual(
    [fields, rays],
    [8, 192],
    "LensVisualizer's counts, which the fake keeps: a half field of 20 degrees",
  );
  const lines = opticalCase.conditions.lines.length;
  assert.equal(made.sets.length, lines + fields * lines);
  const sweeps = made.sets.slice(0, lines);
  assert.deepEqual(
    sweeps.map((set) => set.line),
    [0, 1],
  );
  for (const set of sweeps) {
    assert.deepEqual(set.origins, sweeps[0].origins);
    assert.equal(set.groups, undefined, "a sweep set states no groups: its fields are read from its launches");
    assert.deepEqual(
      sweepBlocks(set).map(({ first, end }) => end - first),
      new Array(fields).fill(rays),
    );
  }
  // The lattices: LensVisualizer's own launch lattice of each of the tab's fields, at the run's bundle grid.
  const angles = made.asks[0].fieldAnglesDeg;
  const setup = lvLaunchSetup(api, model);
  assert.ok(!("problem" in setup));
  const lattices = made.sets.slice(lines);
  angles.forEach((angleDeg, field) => {
    const own = lvFieldRaySets(api, model, setup, { angleDeg }, DEFAULT_BUNDLE_GRID);
    assert.ok("sets" in own);
    assert.deepEqual(lattices.slice(field * lines, (field + 1) * lines), own.sets);
  });
  assert.deepEqual(
    lattices.map((set) => set.groups?.field?.angleDeg),
    angles.flatMap((angle) => [angle, angle]),
  );
  // The ask: the tab's line, the authored reference line, at its fields, the axis first.
  assert.deepEqual(made.asks, [{ lines: [0], maxFieldDeg: geometry.halfFieldDeg, fieldAnglesDeg: angles }]);
  assert.equal(angles[0], 0);
  // A run's bundle grid is the lattices'.
  const coarse = lvVignettingRaySets(api, model, { sampling: { bundleGrid: 8 } });
  assert.ok(
    coarse.sets.slice(lines).every((set) => set.groups?.lattice?.columns !== lattices[0].groups?.lattice?.columns),
  );
});

test("traced as the tab traces them, the sweeps give the fake's tab curve back to the bit, an absorbing glass included", async (t) => {
  const lv = freshLv(t);
  const absorbing = variantOf(lv, "absorbing", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  absorptionPerMm: 0.125,"),
  });
  for (const tree of [lv, absorbing]) {
    const binding = await bind(t, tree);
    const { api } = binding;
    const { model } = await modelOf(binding, SINGLET);
    const made = lvVignettingRaySets(api, model);
    const curve = api.computeVignettingCurve(lvChiefRequest(api, model));
    const halfFieldDeg = lvChiefGeometry(api, model)!.halfFieldDeg;
    assert.deepEqual(tabCurve(api, model, made.sets[0], halfFieldDeg), curve);
    assert.ok(
      curve.some((sample) => sample.geometricTransmission < 1),
      "the fake's singlet vignettes",
    );
    if (tree === absorbing) {
      assert.ok(
        f8(made.sets[0], "weights").some((weight) => weight < 1),
        "an absorbing glass weighs the rays",
      );
    }
    // lv's own trace of a sweep brings to the image exactly the rays the tab counts.
    const answer = answerLvRays(api, model, made.sets[0]);
    assert.ok("data" in answer);
    const status = decodeNdArray(answer.data.status).values as Uint8Array;
    status.forEach((each, ray) => assert.equal(each === 0, passes(api, model, made.sets[0], ray), `ray ${ray}`));
    binding.close();
  }
});

test("a field LensVisualizer launches from a bounding sphere is no field of a set or of the ask; the axis must be one", async (t) => {
  const lv = freshLv(t);
  const vector = variantOf(lv, "vector", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: 12 },"),
  });
  const binding = await bind(t, vector);
  const { model } = await modelOf(binding, SINGLET);
  const made = lvVignettingRaySets(binding.api, model);
  const beyond = made.problems.filter((problem) => problem.startsWith("lv-vector-launch: "));
  assert.equal(beyond.length, 3, made.problems.join("\n"));
  assert.ok(made.asks[0].fieldAnglesDeg.every((angle) => angle <= 12));
  assert.equal(sweepBlocks(made.sets[0]).length, made.asks[0].fieldAnglesDeg.length);
  binding.close();
  // Every field beyond 0 degrees from a bounding sphere, and the axis too: the tab's every figure has no axis.
  const all = variantOf(lv, "all-vector", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { vectorBeyondDeg: -1 },"),
  });
  const bound = await bind(t, all);
  const none = lvVignettingRaySets(bound.api, (await modelOf(bound, SINGLET)).model);
  assert.deepEqual([none.sets, none.asks], [[], []]);
  assert.match(none.problems.at(-1) ?? "", /^no-axis-sweep: /);
});

test("a folded path, a finite object and a run of no authored line are coded problems or no ask, never approximated", async (t) => {
  const binding = await bind(t, freshLv(t));
  const { api } = binding;
  const folded = await modelOf(binding, "zz-folded-mirror");
  assert.match(lvVignettingRaySets(api, folded.model).problems[0], /^folded-path: /);
  const close = await modelOf(binding, SINGLET, { state: { focus: { kind: "focusT", value: 1 } } });
  assert.match(lvVignettingRaySets(api, close.model).problems[0], /^object-not-at-infinity: /);
  // A photopic run's lines are none of them the authored indices: its sets are made, and nothing is asked.
  const photopic = await modelOf(binding, SINGLET, { lines: { kind: "photopic" } });
  const made = lvVignettingRaySets(api, photopic.model);
  assert.ok(made.sets.length > 0);
  assert.deepEqual(made.asks, []);
});
