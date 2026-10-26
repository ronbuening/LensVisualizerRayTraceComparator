import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { exportPhase } from "../../../src/engines/lv/exportPhase.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

test(
  "diffractive suite exports eight sequential states literally and retains the folded plate geometry refusals",
  { skip: LV_UNAVAILABLE },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    t.after(() => binding.close());
    const exporter = createLvExporter(binding);
    const { loadSuite } = await import("../../../src/core/suite.ts");
    const { createLvCaseSource } = await import("../../../src/engines/lv/caseSource.ts");
    const suite = await loadSuite(join(REPO_ROOT, "suites/diffractive.json"), {
      rootDir: REPO_ROOT,
      sources: { lv: createLvCaseSource(LV_PATH) },
    });
    assert.equal(suite.runs.length, 9);
    assert.equal(suite.runs.filter((run) => run.opticalCase).length, 8);
    for (const run of suite.runs) {
      if (run.spec.name === "reference-folded-diffractive-plate") {
        for (const code of [
          "tilted-surface",
          "tilted-image-plane",
          "off-axis-image-plane",
          "surface-profile-unsupported",
        ])
          assert.ok(
            run.problems.some((p) => p.startsWith(code + ":")),
            code,
          );
        continue;
      }
      assert.ok(run.opticalCase);
      assert.equal(run.opticalCase.contract, "1.5");
      const result = await exporter.exportLens(run.spec.lens.kind === "lv" ? run.spec.lens.key : "", {
        state: run.spec.state,
      });
      assert.ok(result.ok);
      const { data } = await binding.lens(run.opticalCase.label.lensKey!);
      const state = binding.api.prepareRuntimeState(binding.api.buildLens(data), 0, run.opticalCase.label.zoomT ?? 0);
      assert.deepEqual(
        run.opticalCase.system.surfaces.map((s) => s.diffractive ?? null),
        state.surfaces.map((s) => exportPhase(s.diffractive).phase ?? null),
      );
    }
  },
);

test(
  "benchmark/features non-diffractive cases and all R0-R3 request bytes match a read-only HEAD archive",
  { skip: LV_UNAVAILABLE, timeout: 180_000 },
  async (t) => {
    const archive = mkdtempSync(join(tmpdir(), "lvrtc-52b-head-"));
    t.after(() => rmSync(archive, { recursive: true, force: true }));
    const bytes = execFileSync("git", ["archive", "HEAD"], { cwd: REPO_ROOT, maxBuffer: 80 * 1024 * 1024 });
    execFileSync("tar", ["-x", "-C", archive], { input: bytes });
    async function snapshot(root: string) {
      const base = pathToFileURL(root + "/").href;
      const { createLvCaseSource } = await import(new URL("src/engines/lv/caseSource.ts", base).href);
      const { loadLvBinding } = await import(new URL("src/engines/lv/binding.ts", base).href);
      const { loadSuite } = await import(new URL("src/core/suite.ts", base).href);
      const { r0Rung, r1Rung, rayTraceRequests } = await import(new URL("src/core/rungs.ts", base).href);
      const rows = [];
      const source = createLvCaseSource(LV_PATH);
      try {
        for (const name of ["benchmark", "features"]) {
          const suite = await loadSuite(join(root, "suites", name + ".json"), {
            rootDir: root,
            sources: { lv: source },
          });
          for (const run of suite.runs) {
            assert.ok(run.opticalCase, run.spec.name);
            const opticalCase = run.opticalCase;
            const rays = await source.raySets(run.spec, opticalCase);
            assert.deepEqual(rays.problems, [], run.spec.name);
            const requests = [
              ...r0Rung.buildRequests(opticalCase, run.spec),
              ...r1Rung.buildRequests(opticalCase, run.spec),
              ...rayTraceRequests(opticalCase, { raySets: rays.sets }),
            ];
            rows.push(
              JSON.stringify({
                name: run.spec.name,
                contract: opticalCase.contract,
                id: opticalCase.id,
                systemId: opticalCase.systemId,
                requests,
              }),
            );
          }
        }
      } finally {
        await (await loadLvBinding(LV_PATH)).close();
      }
      return rows;
    }
    const before = await snapshot(archive),
      after = await snapshot(REPO_ROOT);
    assert.deepEqual(after, before);
    t.diagnostic(`${after.length} benchmark/features states preserve case ids, versions and exact R0-R3 request JSON`);
  },
);
