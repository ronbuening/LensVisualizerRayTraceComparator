// A manifest, its comparisons and a policy written by hand, for the renderer's tests: small, and with everything a
// report can hold that the fake suites do not produce.
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import type { ComparisonSet } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";

const CASE = "c".repeat(64);
const FIRST = "1".repeat(64);
const SECOND = "2".repeat(64);

/** Two rungs: a recorded one in millimetres with a band on one metric, and one the comparisons know nothing of. */
export const POLICY: Policy = {
  contract: "1.0",
  kind: "policy",
  version: 3,
  rungs: {
    r5: {
      quantity: "mtf.native",
      mode: "independent-method",
      class: "recorded",
      metrics: { "spot.rms": { unit: "mm" }, "mtf.maxAbs": { attention: 0.005, unit: "1" } },
    },
    r2: {
      quantity: "rays.trace",
      mode: "identical-rays",
      class: "gated",
      metrics: { "hits.max": { tolerance: 0, unit: "mm" } },
    },
  },
};

function job(run: string, rung: string, requestId: string, engine: string, more: Record<string, unknown> = {}) {
  const quantity = rung === "r5" ? "mtf.native" : rung === "r2" ? "rays.trace" : "system.describe";
  return {
    run,
    caseId: CASE,
    rung,
    quantity,
    requestId,
    engine,
    status: "ok" as const,
    storeKey: "k".repeat(64),
    ...more,
  };
}

/** Three engines, one of them unavailable; a run of two rungs, the first with two requests; a run not started. */
export const MANIFEST: RunManifest = {
  contract: "1.0",
  kind: "run-manifest",
  suite: { name: "hand-built", hash: "5".repeat(64) },
  engines: [
    { id: "lv", status: "available", version: "0.9 | dev", fingerprint: "f".repeat(64), details: { commit: "abc" } },
    { id: "optiland", status: "available", version: "0.5.9", fingerprint: "operator\nbuild", details: {} },
    { id: "zemax", status: "unavailable", code: "spawn-failed" },
  ],
  runs: [
    { name: "tele", caseId: CASE, problems: [], referenceEngine: "lv" },
    {
      name: "wide",
      caseId: null,
      problems: ["lens fixture a|b.json: it cannot be read (ENOENT)", "second\r\nproblem"],
    },
  ],
  jobs: [
    job("tele", "r5", FIRST, "lv"),
    job("tele", "r5", FIRST, "optiland"),
    job("tele", "r5", FIRST, "zemax", { status: "error", storeKey: null, error: { code: "spawn-failed" } }),
    job("tele", "r5", SECOND, "lv"),
    job("tele", "r5", SECOND, "optiland", {
      status: "unsupported",
      storeKey: null,
      unsupported: [
        { code: "feature", item: "surface.asphere.odd" },
        { code: "option", item: "a|b" },
      ],
    }),
    job("tele", "r0", FIRST, "lv"),
    job("tele", "r0", FIRST, "optiland", { status: "pending", storeKey: null }),
  ],
};

const SET = { contract: "1.0", kind: "comparison", suite: "hand-built", run: "tele", caseId: CASE } as const;
const PARTICIPANTS: ComparisonSet["participants"] = [
  { engine: "lv", fingerprint: "f".repeat(64), status: "ok" },
  { engine: "optiland", fingerprint: "operator\nbuild", status: "ok" },
  { engine: "zemax", fingerprint: null, status: "error" },
];
const LV_OPTILAND = {
  a: "lv",
  b: "optiland",
  metrics: [
    { name: "mtf.maxAbs", value: 0.0125, unit: "1", where: { field: "14 deg", frequencyPerMm: 40, line: 0.5 } },
    { name: "spot.rms", value: 0.00042, unit: "mm" },
    { name: "extra.count", value: null, unit: "rays", where: { index: 12 } },
  ],
  class: "recorded",
  verdict: "ATTENTION",
  reason: "mtf.maxAbs 1.25e-2 is outside its attention band 5.00e-3 at field 14 deg, frequencyPerMm 40, line 5.00e-1",
} as const;
const ZEMAX = {
  metrics: [],
  class: "recorded",
  verdict: "ERROR",
  reason: "zemax ended as error (spawn-failed)",
} as const;

/** The comparisons of `MANIFEST`: both modes of the first request, one mode each of the others. */
export const COMPARISONS: ComparisonFile = {
  contract: "1.0",
  kind: "comparison-file",
  suite: "hand-built",
  manifest: hashCanonical(MANIFEST),
  policy: hashCanonical(POLICY),
  comparisons: [
    {
      ...SET,
      rung: "r5",
      quantity: "mtf.native",
      requestId: FIRST,
      participants: PARTICIPANTS,
      mode: "reference-vs-each",
      reference: "lv",
      pairs: [LV_OPTILAND, { a: "lv", b: "zemax", ...ZEMAX }],
    },
    {
      ...SET,
      rung: "r5",
      quantity: "mtf.native",
      requestId: FIRST,
      participants: PARTICIPANTS,
      mode: "pairwise",
      pairs: [LV_OPTILAND, { a: "lv", b: "zemax", ...ZEMAX }, { a: "optiland", b: "zemax", ...ZEMAX }],
    },
    {
      ...SET,
      rung: "r5",
      quantity: "mtf.native",
      requestId: SECOND,
      participants: PARTICIPANTS.slice(0, 2).map((participant, index) =>
        index === 1 ? { ...participant, status: "unsupported" } : participant,
      ),
      mode: "pairwise",
      pairs: [
        {
          a: "lv",
          b: "optiland",
          metrics: [],
          class: "recorded",
          verdict: "UNSUPPORTED",
          reason: "optiland is unsupported (feature surface.asphere.odd, option a|b)",
        },
      ],
    },
    {
      ...SET,
      rung: "r0",
      quantity: "system.describe",
      requestId: FIRST,
      participants: [{ engine: "lv", fingerprint: "f".repeat(64), status: "ok" }],
      mode: "reference-vs-each",
      reference: "lv",
      pairs: [],
    },
  ],
};
