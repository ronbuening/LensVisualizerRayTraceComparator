// Entirely synthetic stand-ins of the benchmark's two baselines: counts, artificial names and hashes, no engine output.
import type { Baseline, BaselineEngine, BaselinePair, BaselineRung } from "../../src/contract/baseline.ts";
import type { Verdict } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { MATRIX_FILES } from "../../src/report/matrix.ts";
import type { StatementInput } from "../../src/report/statement.ts";

export const MATRIX_POLICY: Policy = { contract: "1.3", kind: "policy", version: 1, rungs: {} };
const policy = { version: 1, hash: hashCanonical(MATRIX_POLICY) };
const engines: BaselineEngine[] = ["lv", "optiland", "reference-tracer", "replay-of-lv-mtf", "wave-mtf-of-lv-rays"].map(
  (id) => ({
    id,
    version: "stand-in",
    fingerprint: (id === "lv" || id === "replay-of-lv-mtf" || id === "wave-mtf-of-lv-rays" ? "a" : "b").repeat(64),
    // The digit of the stand-in revision is the length of the engine's id before the rename (Stage 9.8).
    adapterRevision:
      { lv: "2", optiland: "8", "reference-tracer": "3", "replay-of-lv-mtf": "6" }[id]?.repeat(64) ?? "4".repeat(64),
    details: (id === "lv"
      ? { commit: "c".repeat(40), dirty: false, engineFileCount: 3 }
      : {}) as BaselineEngine["details"],
  }),
);

const QUANTITIES: Readonly<Record<string, string>> = {
  "built-system": "system.describe",
  "first-order": "paraxial.first-order",
  "lv-mtf-replay": "mtf.native",
  "mtf-vs-optiland-fft": "mtf.native",
  "mtf-vs-wave-estimate": "mtf.native",
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
    ...(id === "mtf-vs-optiland-fft" || id === "mtf-vs-wave-estimate" ? { bands: { "mtfOnAxis.maxAbs": 1 / 16 } } : {}),
    pairs,
  };
}

const TRACERS = ["lv", "optiland", "reference-tracer"];

/** The rays baseline holds R0 to R4 and R7a to R10a (no R11a); the MTF baseline R4, R4f, R5, R6a and R6b. */
export function matrixInputs(): StatementInput[] {
  return MATRIX_FILES.map((file) => {
    const mtf = file.endsWith(".mtf.json");
    const runs = [false, true].map((second) => ({
      name: second ? "artificial-second" : "artificial-first",
      caseId: (second ? "e" : "f").repeat(64),
      rungs: mtf
        ? [
            rung("geometric-mtf", TRACERS, ["PASS", "PASS"]),
            rung("lv-mtf-replay", ["lv", "replay-of-lv-mtf"], ["PASS"]),
            rung(
              "mtf-vs-optiland-fft",
              ["lv", "optiland", "wave-mtf-of-lv-rays"],
              ["ATTENTION"],
              second ? "optiland" : undefined,
            ),
            rung("wave-mtf", TRACERS, ["PASS", "PASS"]),
            rung("mtf-vs-wave-estimate", ["lv", "wave-mtf-of-lv-rays"], [second ? "ATTENTION" : "RECORDED"]),
          ]
        : [
            rung("built-system", TRACERS, ["PASS"]),
            rung("first-order", TRACERS, ["PASS"]),
            rung("ray-trace", TRACERS, ["PASS", "PASS", "PASS"]),
            rung("optical-path", TRACERS, ["PASS", "PASS", "PASS"]),
            rung("geometric-mtf", TRACERS, ["PASS", "PASS"]),
            rung("spot-rays", TRACERS, ["PASS", "PASS", "PASS", "PASS"], second ? "optiland" : undefined),
            rung("axial-rays", TRACERS, ["PASS", "PASS"]),
            rung("chief-rays", TRACERS, ["PASS"]),
            rung("field-curve-rays", TRACERS, ["PASS", "PASS"]),
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
