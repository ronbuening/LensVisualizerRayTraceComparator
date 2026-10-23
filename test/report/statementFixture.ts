// Entirely synthetic baseline stand-ins: fractions, artificial wavelengths and hashes, no engine output.
import type { Baseline, BaselineRung, BaselineSet } from "../../src/contract/baseline.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { STATEMENT_FILES } from "../../src/report/statement.ts";
import type { StatementInput } from "../../src/report/statement.ts";

export const STATEMENT_POLICY: Policy = { contract: "1.3", kind: "policy", version: 1, rungs: {} };
const policy = { version: 1, hash: hashCanonical(STATEMENT_POLICY) };
const engines = ["lv", "optiland", "optiland-wave", "ref", "replay", "wave"].map((id) => ({
  id,
  version: "stand-in",
  fingerprint: "a".repeat(64),
  details: {},
}));

function gated(id: string): BaselineRung {
  const metric =
    id === "r2"
      ? "landing.maxDistance"
      : id === "r3"
        ? "opticalPath.maxAbs"
        : id === "r6a"
          ? "waveMtf.maxAbs"
          : id.startsWith("r4")
            ? "mtf.maxAbs"
            : "synthetic.maxAbs";
  const unit = id === "r2" ? "mm" : id === "r3" ? "waves" : "1";
  const pairs = (id === "r4f" ? ["replay"] : ["optiland", "ref"]).map((b) => ({
    a: "lv",
    b,
    verdict: "PASS" as const,
    verdicts: [{ verdict: "PASS" as const, count: 2 }],
    metrics: [
      { name: metric, value: 1 / 64, tolerance: 1 / 8, unit, measured: id === "r6a" ? 1 : 2, where: { field: 0 } },
      { name: "synthetic.zero", value: 0, tolerance: 0, unit: "elements" },
    ],
  }));
  return {
    rung: id,
    quantity: "synthetic.measure",
    requests: 2,
    support: ["lv", ...pairs.map((p) => p.b)].sort().map((engine) => ({ engine, status: "ok" })),
    pairs,
  };
}

function native(id: string, several: boolean): BaselineRung {
  const engine = id === "r6c" ? "optiland-wave" : id === "r6b" ? "wave" : "optiland";
  const recorded = (external: boolean) => ({
    field: [0, 0.5, 1],
    lineWavelengthNm: several ? [400, 600] : [500],
    imageHeightMm: [0, 1, 2],
    settled: external ? [1, 0, null] : [1, 1, 1],
    "sagittal@0": [1, 1, 1],
    "sagittal@10": external ? [0.5, 0.25, null] : [0.625, 0.625, 0.625],
    "tangential@0": [1, 1, 1],
    "tangential@10": external ? [0.5, 0.25, null] : [0.625, 0.625, 0.625],
  });
  const pair = {
    a: "lv",
    b: engine,
    verdict: "ATTENTION" as const,
    metrics: [
      { name: "mtfOnAxis.maxAbs", value: 1 / 8, unit: "1", where: { field: 0, frequencyPerMm: 10, cut: "sagittal" } },
    ],
  };
  const set: BaselineSet = {
    participants: [
      { engine: "lv", status: "ok", recorded: recorded(false) },
      { engine, status: "ok", recorded: recorded(true) },
    ],
    pairs: [pair],
  };
  if (id === "r5" && several) {
    const unsupported = { a: "lv", b: engine, verdict: "UNSUPPORTED" as const, metrics: [] };
    return {
      rung: id,
      quantity: "mtf.native",
      requests: 1,
      support: [
        { engine: "lv", status: "ok" },
        { engine, status: "unsupported" },
      ],
      bands: { "chiefLanding.maxAbs": 1 / 64, "mtfOnAxis.maxAbs": 1 / 16, "mtfOffAxis.maxAbs": 1 / 8 },
      pairs: [{ ...unsupported, verdicts: [{ verdict: "UNSUPPORTED", count: 1 }] }],
      sets: [{ participants: [set.participants[0], { engine, status: "unsupported" }], pairs: [unsupported] }],
    };
  }
  return {
    rung: id,
    quantity: "mtf.native",
    requests: 1,
    support: [
      { engine: "lv", status: "ok" },
      { engine, status: "ok" },
    ],
    bands: { "chiefLanding.maxAbs": 1 / 64, "mtfOnAxis.maxAbs": 1 / 16, "mtfOffAxis.maxAbs": 1 / 8 },
    pairs: [{ ...pair, verdicts: [{ verdict: "ATTENTION", count: 1 }] }],
    sets: [set],
  };
}

export function statementInputs(): StatementInput[] {
  return STATEMENT_FILES.map((file) => {
    const suite = file.replace(/(?:\.mtf)?\.json$/, "");
    const mtf = file.endsWith(".mtf.json");
    const runs = [false, true].map((several) => ({
      name: several ? "artificial-several" : "artificial-line",
      caseId: (several ? "c" : "b").repeat(64),
      rungs: mtf
        ? [
            gated("r4"),
            gated("r4f"),
            gated("r6a"),
            ...(suite === "benchmark"
              ? [native("r5", several), native("r5g", several), native("r6b", several), native("r6c", several)]
              : []),
          ]
        : ["r0", "r1", "r2", "r3", "r4"].map(gated),
    }));
    const baseline: Baseline = {
      contract: "1.3",
      kind: "baseline",
      suite: { name: suite, hash: "d".repeat(64) },
      policy,
      engines,
      runs: [
        ...runs,
        ...(suite === "focus-stations"
          ? [
              {
                name: "refused-artificial",
                caseId: null,
                problems: ["finite-conjugate-unavailable: synthetic refusal"],
                rungs: [],
              },
            ]
          : []),
      ],
    };
    return { file, baseline };
  });
}
