// Entirely synthetic stand-ins of the benchmark's two baselines: counts, artificial names and hashes, no engine output.
import type { Baseline, BaselineEngine, BaselinePair, BaselineRung } from "../../src/contract/baseline.ts";
import type { Verdict } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { MATRIX_FILES } from "../../src/report/matrix.ts";
import type { StatementInput } from "../../src/report/statement.ts";

export const MATRIX_POLICY: Policy = { contract: "1.3", kind: "policy", version: 1, rungs: {} };
const policy = { version: 1, hash: hashCanonical(MATRIX_POLICY) };
const engines: BaselineEngine[] = ["lv", "optiland", "ref", "replay", "wave"].map((id) => ({
  id,
  version: "stand-in",
  fingerprint: (id === "lv" || id === "replay" || id === "wave" ? "a" : "b").repeat(64),
  adapterRevision: id.length.toString(16).repeat(64),
  details: (id === "lv"
    ? { commit: "c".repeat(40), dirty: false, engineFileCount: 3 }
    : {}) as BaselineEngine["details"],
}));

const QUANTITIES: Readonly<Record<string, string>> = {
  r0: "system.describe",
  r1: "paraxial.first-order",
  r4f: "mtf.native",
  r5: "mtf.native",
  r6b: "mtf.native",
};

/** One rung of one run: every pair of `engines` at the given request verdicts, the gravest the pair's verdict. */
function rung(
  id: string,
  members: readonly string[],
  verdicts: readonly Verdict[],
  unsupported?: string,
): BaselineRung {
  const pairs: BaselinePair[] = [];
  for (const [i, a] of members.entries())
    for (const b of members.slice(i + 1)) {
      const of = a === unsupported || b === unsupported ? verdicts.map(() => "UNSUPPORTED" as const) : verdicts;
      const order = ["PASS", "RECORDED", "UNSUPPORTED", "ATTENTION"] as const;
      const counted = (["PASS", "RECORDED", "ATTENTION", "UNSUPPORTED"] as const)
        .map((verdict) => ({ verdict, count: of.filter((v) => v === verdict).length }))
        .filter((v) => v.count > 0);
      const verdict = order.filter((v) => of.includes(v)).at(-1)!;
      pairs.push({ a, b, verdict, verdicts: counted, metrics: [] });
    }
  return {
    rung: id,
    quantity: QUANTITIES[id] ?? "rays.trace",
    requests: verdicts.length,
    support: members.map((engine) => ({ engine, status: engine === unsupported ? "unsupported" : "ok" })),
    ...(id === "r5" || id === "r6b" ? { bands: { "mtfOnAxis.maxAbs": 1 / 16 } } : {}),
    pairs,
  };
}

const TRACERS = ["lv", "optiland", "ref"];

/** The rays baseline holds R0 to R4 and R7a to R10a (no R11a); the MTF baseline R4, R4f, R5, R6a and R6b. */
export function matrixInputs(): StatementInput[] {
  return MATRIX_FILES.map((file) => {
    const mtf = file.endsWith(".mtf.json");
    const runs = [false, true].map((second) => ({
      name: second ? "artificial-second" : "artificial-first",
      caseId: (second ? "e" : "f").repeat(64),
      rungs: mtf
        ? [
            rung("r4", TRACERS, ["PASS", "PASS"]),
            rung("r4f", ["lv", "replay"], ["PASS"]),
            rung("r5", ["lv", "optiland", "wave"], ["ATTENTION"], second ? "optiland" : undefined),
            rung("r6a", TRACERS, ["PASS", "PASS"]),
            rung("r6b", ["lv", "wave"], [second ? "ATTENTION" : "RECORDED"]),
          ]
        : [
            rung("r0", TRACERS, ["PASS"]),
            rung("r1", TRACERS, ["PASS"]),
            rung("r2", TRACERS, ["PASS", "PASS", "PASS"]),
            rung("r3", TRACERS, ["PASS", "PASS", "PASS"]),
            rung("r4", TRACERS, ["PASS", "PASS"]),
            rung("r7a", TRACERS, ["PASS", "PASS", "PASS", "PASS"], second ? "optiland" : undefined),
            rung("r8a", TRACERS, ["PASS", "PASS"]),
            rung("r9a", TRACERS, ["PASS"]),
            rung("r10a", TRACERS, ["PASS", "PASS"]),
          ],
    }));
    const baseline: Baseline = {
      contract: "1.3",
      kind: "baseline",
      suite: { name: "benchmark", hash: "d".repeat(64) },
      policy,
      engines: mtf ? engines : engines.filter((e) => TRACERS.includes(e.id)),
      runs: [
        ...runs,
        { name: "refused-artificial", caseId: null, problems: ["synthetic-refusal: no case"], rungs: [] },
      ],
    };
    return { file, baseline };
  });
}
