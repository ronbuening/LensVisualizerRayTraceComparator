// Stand-in catalog baselines: binary fractions and invented state names, no prescriptions.
import { classifyCatalog, failureEvidence } from "../../src/baseline/catalog.ts";
import type { KnownFailure } from "../../src/baseline/catalog.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import type { CatalogInput } from "../../src/report/catalog.ts";

export function catalogRaw(): Baseline {
  return {
    contract: "1.6",
    kind: "baseline",
    suite: { name: "catalog", hash: "a".repeat(64) },
    policy: { version: 1, hash: "b".repeat(64) },
    engines: ["lv", "ref"].map((id) => ({ id, version: "stand-in", fingerprint: "c".repeat(64), details: {} })),
    runs: [
      {
        name: "catalog-artificial-prime",
        caseId: "d".repeat(64),
        features: ["surface.asphere.even"],
        rungs: [
          {
            rung: "r4",
            quantity: "rays.trace",
            requests: 2,
            support: [
              { engine: "lv", status: "ok" },
              { engine: "ref", status: "ok" },
            ],
            pairs: [
              {
                a: "lv",
                b: "ref",
                verdict: "FAIL",
                verdicts: [
                  { verdict: "PASS", count: 1 },
                  { verdict: "FAIL", count: 1 },
                ],
                metrics: [
                  { name: "mtf.maxAbs", unit: "1", value: 1 / 4, tolerance: 1 / 8, where: { field: 0.5 } },
                  { name: "rays.dropped", unit: "rays", value: 0 },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "catalog-artificial-refused",
        caseId: null,
        features: [],
        problems: ["invented-refusal: stand-in refusal"],
        rungs: [],
      },
      {
        name: "catalog-artificial-zoom-wide",
        caseId: "e".repeat(64),
        features: [],
        rungs: [
          {
            rung: "r1",
            quantity: "paraxial.first-order",
            requests: 1,
            support: [
              { engine: "lv", status: "unsupported", detail: "invented-code artificial.item" },
              { engine: "ref", status: "ok" },
            ],
            pairs: [
              {
                a: "lv",
                b: "ref",
                verdict: "UNSUPPORTED",
                verdicts: [{ verdict: "UNSUPPORTED", count: 1 }],
                metrics: [],
              },
            ],
          },
        ],
      },
    ],
  };
}
export function catalogKnown(): KnownFailure[] {
  const raw = catalogRaw(),
    rung = raw.runs[0].rungs[0],
    pair = rung.pairs[0];
  return [
    {
      run: raw.runs[0].name,
      rung: rung.rung,
      engines: [pair.a, pair.b],
      metric: "mtf.maxAbs",
      class: "numerical",
      gotcha: "docs/gotchas.md#artificial-example",
      reproducer: "node bin/lvrtc.mjs run suites/catalog-repro/artificial.json --rungs r4 --jobs 4",
      evidenceHash: failureEvidence(rung.requests, pair),
    },
  ];
}
export function catalogInputs(): CatalogInput[] {
  const rays = classifyCatalog(catalogRaw(), catalogKnown());
  const mtf = {
    ...rays,
    runs: rays.runs.map((run) => ({
      ...run,
      rungs: run.rungs
        .filter((r) => r.rung === "r4")
        .map((r) => ({
          ...r,
          pairs: r.pairs.map((p) => ({ ...p, metrics: p.metrics.map((m) => ({ ...m, measured: 2 })) })),
        })),
    })),
  };
  return [
    { file: "catalog.json", baseline: rays },
    { file: "catalog.mtf.json", baseline: mtf },
  ];
}
