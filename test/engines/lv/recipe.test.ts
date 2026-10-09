// The MTF recipe of a LensVisualizer lens against the fake LV tree: the plane, the fields and the frequencies as
// the fake's own first step of `computeMtfSteps` states them. The fake's numbers describe no real lens: its image
// height is 0.5 mm a degree out to 20 degrees, and its best focus lies a 128th of the stop radius in front of the
// design plane, a 64th with a grid capped at 32.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { RunOptions, RunSpec } from "../../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import type { MtfRecipeResolution } from "../../../src/core/mtfRecipe.ts";
import { createLvCaseSource } from "../../../src/engines/lv/caseSource.ts";
import { FAKE_LENS_FILES, freshLv } from "./support.ts";

const [SINGLET_FILE] = FAKE_LENS_FILES.map(([file]) => file);

/** A fresh tree with one of its files rewritten before anything loads it. */
function editedLv(t: TestContext, file: string, edit: (text: string) => string): string {
  const lv = freshLv(t);
  const path = join(lv, ...file.split("/"));
  const text = readFileSync(path, "utf8");
  assert.notEqual(edit(text), text, `${file} was to be edited`);
  writeFileSync(path, edit(text));
  return lv;
}

function run(options: RunOptions = {}, key = "acme-singlet-50"): RunSpec {
  return { contract: CONTRACT_VERSION, kind: "run-spec", name: "a-run", lens: { kind: "lv", key }, ...options };
}

/** The case of a run and its recipe, from one case source of a tree. */
async function resolved(
  lv: string,
  spec: RunSpec,
  source = createLvCaseSource(lv),
): Promise<{ opticalCase: OpticalCase; resolution: MtfRecipeResolution }> {
  const resolution = await source.resolve(spec);
  assert.ok(resolution.ok, JSON.stringify(resolution));
  return { opticalCase: resolution.opticalCase, resolution: await source.recipe(spec, resolution.opticalCase) };
}

test("the recipe of a lens is LensVisualizer's own: its default fields and frequencies, its angles, its best focus", async (t) => {
  const lv = freshLv(t);
  const { opticalCase, resolution } = await resolved(lv, run());
  assert.deepEqual(resolution.problems, []);
  const { recipe } = resolution;
  assert.deepEqual(recipe, {
    source: "lv",
    // The case is at its design plane; the fake's best focus for its stop of 6.25 mm is stated all the same.
    plane: { kind: "design", shiftMm: 0, lvBestAxialShiftMm: -6.25 / 128 },
    imageZ: opticalCase.conditions.imageZ,
    stopSemiDiameter: 6.25,
    lines: [{ wavelengthNm: 587.5618, weight: 1 }],
    // The fake's own defaults, which are none of LensVisualizer's.
    frequenciesPerMm: [0, 10, 20, 30, 40, 50],
    referenceHeightMm: 10,
    fields: [
      { fraction: 0, angleDeg: 0, targetImageHeightMm: 0 },
      { fraction: 0.5, angleDeg: 10, targetImageHeightMm: 5 },
      { fraction: 1, angleDeg: 20, targetImageHeightMm: 10 },
    ],
  });
  assert.deepEqual(JSON.parse(canonicalJson(recipe)), recipe, "it is recorded as JSON, to the bit");
});

test("the fields, the frequencies and the grid cap of the run are the recipe's, and the lines are the case's", async (t) => {
  const lv = freshLv(t);
  const spec = run({
    lines: { kind: "photopic" },
    fields: { kind: "image-height-fractions", values: [0.25, 1, 0.75] },
    frequenciesPerMm: [40, 10],
    sampling: { lvGridCap: 32 },
  });
  const { recipe } = (await resolved(lv, spec)).resolution;
  assert.deepEqual(recipe?.frequenciesPerMm, [10, 40]);
  assert.deepEqual(
    recipe?.fields.map((field) => [field.fraction, field.angleDeg, field.targetImageHeightMm]),
    [
      [0.25, 5, 2.5],
      [1, 20, 10],
      [0.75, 15, 7.5],
    ],
  );
  assert.equal(recipe?.lines.length, 5);
  assert.deepEqual(recipe?.lines[1], { wavelengthNm: 470, weight: 0.091 });
  // The focus search is of one grid cap: capped at 32 the fake's finds another plane.
  assert.equal(recipe?.lvGridCap, 32);
  assert.equal(recipe?.plane.lvBestAxialShiftMm, -6.25 / 64);
});

test("the plane is the case's: design, LensVisualizer's own best focus to the bit, or any other shift", async (t) => {
  const lv = freshLv(t);
  const source = createLvCaseSource(lv);
  const best = await resolved(lv, run({ imagePlane: { kind: "lv-best-axial" } }), source);
  const shift = -6.25 / 128;
  assert.deepEqual(best.resolution.recipe?.plane, {
    kind: "lv-best-axial",
    shiftMm: best.opticalCase.conditions.imageZ - best.opticalCase.system.designImageZ,
    lvBestAxialShiftMm: shift,
  });
  assert.equal(best.resolution.recipe?.imageZ, best.opticalCase.system.designImageZ + shift);

  // The same shift asked for by number is the same case, and so the same plane: a recipe reads the case, not the run.
  const byNumber = await resolved(lv, run({ imagePlane: { kind: "shift", mm: shift } }), source);
  assert.equal(byNumber.opticalCase.id, best.opticalCase.id);
  assert.equal(byNumber.resolution.recipe?.plane.kind, "lv-best-axial");
  const elsewhere = await resolved(lv, run({ imagePlane: { kind: "shift", mm: 0.25 } }), source);
  assert.deepEqual(elsewhere.resolution.recipe?.plane, { kind: "shift", shiftMm: 0.25, lvBestAxialShiftMm: shift });

  // A case at the best focus of one grid cap is at no best focus of another.
  const capped = run({ imagePlane: { kind: "lv-best-axial" }, sampling: { lvGridCap: 32 } });
  const coarse = await resolved(lv, capped, source);
  assert.equal(coarse.opticalCase.conditions.imageZ, coarse.opticalCase.system.designImageZ + -6.25 / 64);
  assert.equal(coarse.resolution.recipe?.plane.kind, "lv-best-axial");
  const uncapped = await source.recipe(run({ imagePlane: { kind: "lv-best-axial" } }), coarse.opticalCase);
  assert.equal(uncapped.recipe?.plane.kind, "shift");
});

test("a field LensVisualizer has no angle for is a field with its problem, and the others are not affected", async (t) => {
  // The format corner lies at 12 mm, beyond the modeled edge at 10 mm, and one fraction has no angle.
  const lv = editedLv(t, SINGLET_FILE, (text) =>
    text.replace("focusTravel: 5,", "focusTravel: 5,\n  field: { referenceHeightMm: 12, unsolvedFraction: 0.25 },"),
  );
  const spec = run({ fields: { kind: "image-height-fractions", values: [0, 0.25, 0.5, 1] } });
  const { resolution } = await resolved(lv, spec);
  assert.deepEqual(resolution.problems, []);
  assert.equal(resolution.recipe?.referenceHeightMm, 12);
  assert.deepEqual(resolution.recipe?.fields, [
    { fraction: 0, angleDeg: 0, targetImageHeightMm: 0 },
    {
      fraction: 0.25,
      angleDeg: null,
      targetImageHeightMm: 3,
      problem: "chief-ray-failed: LensVisualizer finds no chief-ray angle for the image height 3 mm",
    },
    { fraction: 0.5, angleDeg: 12, targetImageHeightMm: 6 },
    {
      fraction: 1,
      angleDeg: null,
      targetImageHeightMm: 12,
      problem: "outside-modeled-field: Outside the modeled field: beyond 10.0 mm.",
    },
  ]);
});

test("a run LensVisualizer's MTF does not cover has no recipe, and a coded problem says why", async (t) => {
  const lv = editedLv(t, "src/lens-data/zenith/ZenithDoublet100.data.ts", (text) =>
    text.replace("noDispersionData: true,", "noDispersionData: true,\n  unverifiedScale: true,"),
  );
  const source = createLvCaseSource(lv);
  const none = async (spec: RunSpec): Promise<readonly string[]> => {
    const { resolution } = await resolved(lv, spec, source);
    assert.equal(resolution.recipe, null);
    return resolution.problems;
  };
  assert.deepEqual(await none(run({ fields: { kind: "angles-deg", values: [0, 5] } })), [
    "fields.angles-deg: LensVisualizer's MTF takes its fields as fractions of its reference image height, not as angles",
  ]);
  assert.deepEqual(await none(run({ lines: { kind: "explicit", wavelengthsNm: [587.5618, 500] } })), [
    "lines.custom-spectrum: LensVisualizer's MTF has the spectra reference, cdf, photopic and no other: " +
      "the lines of the case (587.5618, 500 nm) are none of them",
  ]);
  // The fake's gate refuses a lens whose scale it has not verified, on every spectrum: its reason is the code.
  assert.deepEqual(await none(run({}, "zenith-doublet-100")), [
    "unverified-scale: LensVisualizer's MTF does not cover this state: " +
      "Prescription scale needs verification before reporting lp/mm.",
  ]);
  // More fields than the fake's MTF takes in one request: its gate refuses the request of the run.
  const many = run({ fields: { kind: "image-height-fractions", values: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8] } });
  assert.deepEqual(await none(many), [
    "invalid-input: LensVisualizer's MTF refuses the request of this run: " +
      "MTF requires fields and image-space frequencies within its limits.",
  ]);

  // A case that is no longer what LensVisualizer gives has no recipe either.
  const { opticalCase } = await resolved(lv, run(), source);
  const altered = { ...opticalCase, conditions: { ...opticalCase.conditions, stopSemiDiameter: 6 } };
  const stale = await source.recipe(run(), altered);
  assert.equal(stale.recipe, null);
  assert.match(stale.problems[0], /^stale-case: /);
});

test("without a LensVisualizer the source has no recipe, as it has no case", async () => {
  const source = createLvCaseSource(null);
  const lone = {} as OpticalCase;
  assert.deepEqual(await source.recipe(run(), lone), {
    recipe: null,
    problems: ["lv-not-configured: LensVisualizer is not configured: set lvPath in lvrtc.local.json or LVRTC_LV_PATH"],
  });
});
