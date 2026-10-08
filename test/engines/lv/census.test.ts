import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { FEATURE_FLAGS, FEATURE_LIMITS } from "../../../src/contract/features.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { CENSUS_FILES, buildCensus, censusJsonText, renderCensusMarkdown } from "../../../src/engines/lv/census.ts";
import type { CensusLens, ExportCensus } from "../../../src/engines/lv/census.ts";
import { exportCase } from "../../../src/engines/lv/exportCase.ts";
import { EXPORT_PROBLEM_CODES, LV_GATE_PROBLEM_CODES } from "../../../src/engines/lv/exportProblems.ts";
import { TRIPLET, gate, inputFor, stateOf } from "./exportSupport.ts";

const FINGERPRINT = { commit: "c".repeat(40), dirty: true, engineClosureHash: "ab".repeat(32), engineFileCount: 141 };

/** The hand-built triplet, exported: a case with aspheres up to the eighth power and seven surfaces. */
const TRIPLET_RESULT = exportCase(inputFor(stateOf(TRIPLET, { stopIndex: 2 })));
/** A two-surface lens with a fisheye projection and an absorbing glass: two notes and no feature. */
const NOTED_RESULT = exportCase(
  inputFor(
    stateOf(
      [
        { label: "1", R: 30, d: 4, nd: 1.5 },
        { label: "STO", R: 1e15, d: 20, sd: 3 },
      ],
      {
        stopIndex: 1,
        projection: "fisheye-equisolid",
        runtime: { elements: [{ id: 1, absorptionCoefficientPerMm: 0.2 }] },
      },
    ),
    {},
    { assessMtfSupport: gate({ reason: "unsupported-path" }) },
  ),
);

const LENSES: readonly CensusLens[] = [
  { key: "zeta", outcome: TRIPLET_RESULT },
  { key: "alpha", outcome: NOTED_RESULT },
  {
    key: "mirror",
    outcome: {
      ok: false,
      problems: [
        { code: "folded-path", message: "m" },
        { code: "non-refract-interaction", message: "m" },
        { code: "non-refract-interaction", message: "again" },
      ],
    },
  },
  { key: "catadioptric", outcome: { ok: false, problems: [{ code: "folded-path", message: "m" }] } },
  { key: "broken", outcome: { threw: "lens broken: something the exporter did not expect" } },
];

function census(lenses: readonly CensusLens[] = LENSES): ExportCensus {
  return buildCensus({ fingerprint: FINGERPRINT, unindexedFiles: 1, lenses });
}

test("the census counts what became of every lens, and lists lens keys by reason, sorted", () => {
  assert.ok(TRIPLET_RESULT.ok && NOTED_RESULT.ok);
  assert.deepEqual(census(), {
    kind: "lv-export-census",
    contract: CONTRACT_VERSION,
    lensVisualizer: FINGERPRINT,
    request: { zoomT: 0, focus: "infinity", aperture: "wide-open", lines: "reference", imagePlane: "design" },
    lenses: 5,
    unindexedFiles: 1,
    exported: 2,
    notExportable: 2,
    threw: ["broken"],
    reasons: {
      // A lens with two problems of one code is under that code once.
      "folded-path": { count: 2, lenses: ["catadioptric", "mirror"] },
      "non-refract-interaction": { count: 1, lenses: ["mirror"] },
    },
    features: {
      "aperture.annular": 0,
      "lines.multiple": 0,
      "object.finite": 0,
      "surface.asphere.even": 1,
      "surface.asphere.flat-base": 1,
      "surface.asphere.odd": 1,
      "surface.conic": 1,
    },
    notes: { "bulk-absorption": 1, "projection:fisheye-equisolid": 1 },
    limits: {
      "asphere.maxPower": { max: 8, lens: "zeta" },
      // Both cases have one line: the limit names the first lens, by key, that needs the largest value.
      "lines.count": { max: 1, lens: "alpha" },
      "surfaces.count": { max: 7, lens: "zeta" },
    },
  });
});

test("the census does not depend on the order the lenses are given in", () => {
  assert.deepEqual(census([...LENSES].reverse()), census());
  assert.equal(censusJsonText(census([...LENSES].reverse())), censusJsonText(census()));
});

test("a census of nothing has every flag and limit at zero", () => {
  const empty = census([]);
  assert.deepEqual([empty.lenses, empty.exported, empty.notExportable, empty.threw], [0, 0, 0, []]);
  assert.deepEqual(Object.keys(empty.features), [...FEATURE_FLAGS]);
  for (const limit of FEATURE_LIMITS) assert.deepEqual(empty.limits[limit], { max: 0, lens: null });
  assert.match(renderCensusMarkdown(empty), /Every lens was exported\.\n/);
  assert.match(renderCensusMarkdown(empty), /No case carries a note\.\n/);
});

test("the JSON text has its keys sorted at every depth, and reads back as the census", () => {
  const text = censusJsonText(census());
  assert.deepEqual(JSON.parse(text), census());
  assert.ok(text.endsWith("}\n"));
  assert.deepEqual(Object.keys(JSON.parse(text)), Object.keys(census()).sort());
});

test("the Markdown states the checkout, the outcome, the lenses of each reason, the flags, the notes and the limits", () => {
  const markdown = renderCensusMarkdown(census());
  assert.equal(markdown, renderCensusMarkdown(census([...LENSES].reverse())));
  for (const line of [
    "# LensVisualizer export census",
    `| LensVisualizer commit | \`${"c".repeat(40)}\` (dirty) |`,
    `| Engine closure | \`${"ab".repeat(32)}\` (141 files) |`,
    "| Lenses | Exported | Not exportable | Threw | Lens files not indexed |",
    "| 5 | 2 | 2 | 1 | 1 |",
    "| `folded-path` | 2 |",
    "### `folded-path` (2)",
    "- `catadioptric`",
    "- `mirror`",
    "## Threw",
    "- `broken`",
    "| `surface.asphere.odd` | 1 |",
    "| `aperture.annular` | 0 |",
    "| `projection:fisheye-equisolid` | 1 |",
    "| `asphere.maxPower` | 8 | `zeta` |",
  ]) {
    assert.ok(markdown.split("\n").includes(line), line);
  }
  // What the exporter threw is for the console; the census names the lens only.
  assert.ok(!markdown.includes("did not expect"));
  assert.ok(!censusJsonText(census()).includes("did not expect"));
  const clean = renderCensusMarkdown({ ...census(), lensVisualizer: { ...FINGERPRINT, commit: null, dirty: null } });
  assert.ok(clean.includes("| LensVisualizer commit | not a git checkout (git state unknown) |"));
});

// ── The committed census ─────────────────────────────────────────────────────────────────────────────────────────
//
// A census is a snapshot and its numbers are asserted nowhere. What is held here is that the two committed files
// are one census, consistent in itself, and hold nothing but counts, hashes and lens keys.

const COMMITTED = join(REPO_ROOT, "reports", "census");

test("the committed census is one census in two files, and its counts add up", () => {
  const json = readFileSync(join(COMMITTED, CENSUS_FILES.json), "utf8");
  const committed: ExportCensus = JSON.parse(json);
  assert.equal(censusJsonText(committed), json, "the JSON file is the census as lvrtc writes it");
  assert.equal(readFileSync(join(COMMITTED, CENSUS_FILES.markdown), "utf8"), renderCensusMarkdown(committed));

  assert.equal(committed.kind, "lv-export-census");
  assert.equal(committed.exported + committed.notExportable + committed.threw.length, committed.lenses);
  assert.deepEqual(committed.threw, [], "a committed census is a healthy one");
  assert.equal(committed.unindexedFiles, 0);
  const known: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];
  const withReason = new Set<string>();
  for (const [code, { count, lenses }] of Object.entries(committed.reasons)) {
    assert.ok(known.includes(code), code);
    assert.equal(count, lenses.length, code);
    for (const key of lenses) withReason.add(key);
  }
  assert.equal(withReason.size, committed.notExportable);
  assert.match(String(committed.lensVisualizer.engineClosureHash), /^[0-9a-f]{64}$/);
});

test("the committed census holds counts, hashes and lens keys, and nothing else", () => {
  const committed: ExportCensus = JSON.parse(readFileSync(join(COMMITTED, CENSUS_FILES.json), "utf8"));
  const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const strings: string[] = [];
  const numbers: number[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === "string") strings.push(value);
    else if (typeof value === "number") numbers.push(value);
    else if (typeof value === "object" && value !== null) Object.values(value).forEach(walk);
  };
  walk(committed);
  // Every number is a count; every string is a lens key, a hash, or one of the census's own words.
  for (const number of numbers) assert.ok(Number.isInteger(number) && number >= 0, String(number));
  const words = new Set(["lv-export-census", CONTRACT_VERSION, "infinity", "wide-open", "reference", "design"]);
  for (const text of strings) {
    assert.ok(words.has(text) || slug.test(text) || /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(text), text);
  }
});
