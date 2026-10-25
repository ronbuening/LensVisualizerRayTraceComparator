import assert from "node:assert/strict";
import test from "node:test";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { answerLvFirstOrder } from "../../../src/engines/lv/firstOrder.ts";
import { decodeNdArray, encodeF8 } from "../../../src/core/numeric/ndarray.ts";
import { lvRaySets } from "../../../src/engines/lv/raySets.ts";
import { answerLvRays, lvTraceOptions } from "../../../src/engines/lv/rays.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";
import { createLvCaseSource } from "../../../src/engines/lv/caseSource.ts";
import { FOLDED_CONFIRMATION } from "../../../src/engines/lv/confirmPath.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { planJobs } from "../../../src/core/orchestrator.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { fakeEngine, watchedRegistry } from "../../core/support.ts";
import { join } from "node:path";

test(
  "the folded run preflight refuses Maksutov for every engine and confirms the other eight raw exports",
  { skip: LV_UNAVAILABLE },
  async () => {
    const source = createLvCaseSource(LV_PATH);
    const sources = { lv: source };
    const suite = await loadSuite(join(REPO_ROOT, "suites/folded.json"), { rootDir: REPO_ROOT, sources });
    assert.equal(suite.runs.filter((run) => run.opticalCase).length, 9);
    const watched = watchedRegistry({ lv: fakeEngine(), ref: fakeEngine(), optiland: fakeEngine() });
    const plan = await planJobs({ suite, sources, registry: watched.registry, runsDir: "unused" });
    assert.equal(plan.runs.filter((run) => run.opticalCase).length, 8);
    for (const run of plan.runs) {
      if (run.spec.name === "reference-maksutov-cassegrain-meniscus") {
        assert.equal(run.opticalCase, null);
        assert.match(run.problems[0], /^folded-post-path-reflection:/);
        assert.ok(plan.jobs.every((job) => job.run !== run.spec.name));
      } else if (run.opticalCase) {
        const note = run.opticalCase.provenance.notes?.find((note) => note.startsWith(FOLDED_CONFIRMATION));
        assert.ok(note, run.spec.name);
        assert.equal(
          note,
          `${FOLDED_CONFIRMATION}run:${Buffer.from(run.spec.name).toString("hex")}:coarse:${plan.raySets.get(run.spec.name)!.sets.join(".")}:fine:unrequested`,
        );
      }
    }
    assert.deepEqual(watched.created, []);
  },
);

// LV 2e046d71: record the native cardinal parity defect; no gate or reference value is adjusted to match it.
test(
  "LV's folded cardinal result preserves its native odd-reflection front-principal value",
  { skip: LV_UNAVAILABLE },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const exported = await createLvExporter(binding).exportLens("reference-spherical-primary-mirror", {});
    assert.ok(exported.ok);
    const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
    assert.ok(rebuilt.ok);
    const native = binding.api.computeCardinalElementsFromState(rebuilt.model.state);
    assert.ok(native);
    const answer = answerLvFirstOrder(binding.api, rebuilt.model);
    assert.ok(answer.supported);
    assert.equal(decodeNdArray(answer.data.frontPrincipalZ).values[0], native.points.frontPrincipal.z);
    const mirror = rebuilt.model.state.surfaces.find((surface) => surface.interaction.type === "reflect");
    assert.ok(mirror);
    // Both principal planes of a single mirror are its vertex plane. LV uses a determinant +1 cardinal formula
    // on a physical-slope reflection matrix of determinant -1, displacing the front principal point by one R.
    if (binding.fingerprint().commit === "2e046d712fa5f6631ace3b8963d18827b909a37f") {
      assert.equal(native.points.frontPrincipal.z - mirror.z, mirror.R);
    }
  },
);

// LV 2e046d71: what `alignFolded` (src/engines/lv/rays.ts) rests on, measured on two reference systems.
const PINNED_COMMIT = "2e046d712fa5f6631ace3b8963d18827b909a37f";

async function folded(binding: Awaited<ReturnType<typeof loadLvBinding>>, key: string) {
  const exported = await createLvExporter(binding).exportLens(key, {});
  assert.ok(exported.ok);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), exported.opticalCase);
  assert.ok(rebuilt.ok);
  return rebuilt.model;
}

test(
  "LV crosses an obscuration's complement without a record but keeps its height; the answer marks it unrecorded",
  { skip: LV_UNAVAILABLE },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const model = await folded(binding, "reference-annular-obscured-mirror");
    assert.deepEqual(
      model.exported.system.opticalPath?.map((step) => [step.surfaceIndex, step.interaction]),
      [
        [0, "refract"],
        [1, "block"],
        [2, "reflect"],
      ],
    );
    // An axial ray at 10 mm passes outside OBS's 6 mm band and is reflected by M1's annulus (6 to 30 mm).
    const ray = { origin: [0, 10, -10] as [number, number, number], direction: [0, 0, 1] as [number, number, number] };
    const trace = binding.api.traceEngineRay(model.state, ray, { ...lvTraceOptions(model, 0), recordHeights: true });
    if (binding.fingerprint().commit === PINNED_COMMIT) {
      assert.deepEqual(
        trace.hits.map((hit) => hit.surfaceIndex),
        [0, 2],
      );
      assert.equal(trace.heights?.length, 3);
    }
    const answer = answerLvRays(binding.api, model, {
      line: 0,
      origins: encodeF8(ray.origin, [1, 3]),
      directions: encodeF8(ray.direction, [1, 3]),
      weights: encodeF8([1]),
    });
    assert.ok("data" in answer);
    assert.deepEqual([...decodeNdArray(answer.data.status).values], [0]);
    assert.ok(answer.data.unrecordedHits !== undefined);
    assert.deepEqual([...decodeNdArray(answer.data.unrecordedHits).values], [0, 1, 0]);
  },
);

test(
  "LV's explicit Maksutov path goes on past its declared visits: the request is unsupported, never a fixed-path answer",
  { skip: LV_UNAVAILABLE },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const model = await folded(binding, "reference-maksutov-cassegrain-meniscus");
    const path = model.exported.system.opticalPath!.map((step) => step.surfaceIndex);
    const { sets } = lvRaySets(binding.api, model, {
      fields: { kind: "angles-deg", values: [0] },
      sampling: { bundleGrid: 16 },
    });
    const [set] = sets;
    const origins = decodeNdArray(set.origins).values;
    const directions = decodeNdArray(set.directions).values;
    let continued: number[] | null = null;
    for (let ray = 0; continued === null && ray < origins.length / 3; ray++) {
      const trace = binding.api.traceEngineRay(
        model.state,
        {
          origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
          direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
        },
        lvTraceOptions(model, 0),
      );
      if (trace.hits.length > path.length) continued = trace.hits.map((hit) => hit.surfaceIndex);
    }
    if (binding.fingerprint().commit === PINNED_COMMIT) {
      // MEN1, MEN2, M1, SEC declared; then M1 again (outside its 8.1 mm hole) and SEC's inactive back, which blocks.
      assert.deepEqual(path, [1, 2, 5, 3]);
      assert.deepEqual(continued, [1, 2, 5, 3, 5, 3]);
    }
    const answer = answerLvRays(binding.api, model, set);
    assert.ok("unsupported" in answer);
    assert.equal(answer.unsupported[0].item, "lv-folded-post-path-interaction");
  },
);
