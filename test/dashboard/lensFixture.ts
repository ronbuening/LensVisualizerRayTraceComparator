// The lens of the dashboard's fixture (Stage 8.4): a stand-in zoom whose two ends are the singlet and the
// Double-Gauss case relabelled (a label is in no case id, so the R5 stand-ins answer them as they answer those
// cases), run into two run directories of the MTF part of the fixture. Every number is the stand-ins' own.
//
// - `lens-a`: R5 at both ends (`zoom-wide`, `zoom-tele`), on `lv`, `optiland` and `wave`; at the tele end optiland is
//   asked again at 512 rays (a step of its own), as the stand-ins of R5 are.
// - `lens-b`: the wide end again, R5 at frequencies of its own (the same number of them, the last another) on `lv`
//   and `optiland`, and R5g on `lv`, `optiland` and `replay` at the frequencies of R5.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { COMPARISONS_FILE, comparisonFileText } from "../../src/compare/comparisonFile.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { followUpsOf } from "../../src/compare/followUp.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeSpec } from "../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import type { DashboardViews } from "../../src/dashboard/server.ts";
import { SPEC } from "../compare/mtfNativeSupport.ts";
import { DOUBLE_GAUSS, SINGLET, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import { R5_FIXTURE_RUNG, standIns } from "../report/r5Fixture.ts";
import { R5G_FIXTURE_RUNG, geometricStandIns } from "../report/r5gFixture.ts";

/** The lens the fixture's two run directories have runs of. */
export const LENS_KEY = "stand-in-zoom";
/** Its run directories. */
export const LENS_A = "lens-a";
export const LENS_B = "lens-b";

/** A case of the stand-in zoom at one end: the case given, its label the lens's. */
function lensCase(base: OpticalCase, zoomT: number): OpticalCase {
  return { ...base, label: { name: "Stand-in zoom", lensKey: LENS_KEY, zoomT, focusT: 0 } };
}

/** R5's request at frequencies of its own: as many as `SPEC` has, the last another. */
export const OTHER_FREQUENCIES_SPEC: MtfNativeSpec = { ...SPEC, frequenciesPerMm: [10, 30, 50, 90] };

const OTHER_FREQUENCIES_RUNG: RungDefinition = {
  id: "r5",
  quantity: MTF_NATIVE,
  engines: ["lv", "optiland"],
  buildRequests: (opticalCase) => [
    makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec: OTHER_FREQUENCIES_SPEC }),
  ],
};

/** An engine that answers a geometric request as `geometric` does and any other as `diffraction` does. */
function byMethod(diffraction: EngineMaker, geometric: EngineMaker): EngineMaker {
  return async (id) => {
    const [one, two] = [await diffraction(id), await geometric(id)];
    return {
      id,
      describe: () => one.describe(),
      run: (request, opticalCase) =>
        ((request.spec as { method?: string }).method === "geometric" ? two : one).run(request, opticalCase),
      close: async () => {
        await one.close();
        await two.close();
      },
    };
  };
}

async function cycle(
  runsDir: string,
  name: string,
  runs: Parameters<typeof suiteOf>[1],
  rungDefinitions: readonly RungDefinition[],
  engines: { readonly [engine: string]: EngineMaker },
  policy: Policy,
): Promise<void> {
  const { registry } = watchedRegistry(engines);
  const { manifest } = await runSuite({
    suite: suiteOf(name, runs),
    registry,
    runsDir,
    rungDefinitions,
    rungs: rungDefinitions.map((rung) => rung.id),
    followUps: followUpsOf(policy),
  });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const comparisons = compareManifest({ manifest, store, policy, rungDefinitions });
  writeFileSync(join(runsDir, name, COMPARISONS_FILE), comparisonFileText(comparisons));
}

/** Runs and compares the two run directories of the stand-in zoom into `runsDir`, by `policy`. */
export async function lensCycles(runsDir: string, policy: Policy): Promise<void> {
  const wide = lensCase(SINGLET, 0);
  const tele = lensCase(DOUBLE_GAUSS, 1);
  await cycle(
    runsDir,
    LENS_A,
    [
      { name: "zoom-wide", opticalCase: wide },
      { name: "zoom-tele", opticalCase: tele },
    ],
    [R5_FIXTURE_RUNG],
    standIns(),
    policy,
  );
  const r5 = standIns();
  const r5g = geometricStandIns();
  await cycle(
    runsDir,
    LENS_B,
    [{ name: "zoom-wide", opticalCase: wide }],
    [OTHER_FREQUENCIES_RUNG, R5G_FIXTURE_RUNG],
    { lv: r5.lv, optiland: byMethod(r5.optiland, r5g.optiland), replay: r5g.replay },
    policy,
  );
}

/**
 * The choice of the golden lens page: every run, both rungs, every engine and step, the axis, the sagittal cut, against
 * `lv` at the wide end in `lens-a`. Of its twelve curves two answer the reference's request (optiland exactly the
 * band below it at 10 cycles/mm, wave on it), seven are of another run or run directory, and two are taken at other
 * frequencies.
 */
export function lensGoldenQuery(views: DashboardViews): string {
  const query = new URLSearchParams();
  const { picker } = views.lens(LENS_KEY, "");
  for (const option of picker.runs) query.append("run", option.id);
  for (const option of picker.rungs) query.append("rung", option.id);
  for (const option of picker.engines) query.append("engine", option.id);
  query.append("field", "fraction:0");
  query.append("cut", "sagittal");
  const reference = views
    .lens(LENS_KEY, query.toString())
    .curves.find((curve) => curve.suite === LENS_A && curve.runName === "zoom-wide" && curve.engine === "lv");
  if (reference === undefined) throw new Error("the golden choice has no curve of lv at the wide end of lens-a");
  query.append("ref", reference.id);
  return query.toString();
}
