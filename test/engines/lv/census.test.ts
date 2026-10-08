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

const FOLDED = { ok: false as const, problems: [{ code: "folded-path", message: "m" }] };
const GATED = { ok: false as const, problems: [{ code: "spectral-data-unavailable", message: "m" }] };

// Three primes and four zooms: seven lenses in eleven states.
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
  // A zoom that is folded at both ends, given tele first.
  { key: "catadioptric", end: "tele", outcome: FOLDED },
  { key: "catadioptric", end: "wide", outcome: FOLDED },
  // Zooms with a reason at one end only, and a case at the other.
  { key: "long-end", end: "wide", outcome: TRIPLET_RESULT },
  { key: "long-end", end: "tele", outcome: GATED },
  { key: "short-end", end: "wide", outcome: GATED },
  { key: "short-end", end: "tele", outcome: NOTED_RESULT },
  // A zoom whose export threw at one end.
  { key: "broken", end: "wide", outcome: TRIPLET_RESULT },
  { key: "broken", end: "tele", outcome: { threw: "lens broken: something the exporter did not expect" } },
];

function census(lenses: readonly CensusLens[] = LENSES): ExportCensus {
  return buildCensus({ fingerprint: FINGERPRINT, unindexedFiles: 1, lenses });
}

test("the census counts what became of every state, and lists lens keys by reason, sorted, with the end of one end only", () => {
  assert.ok(TRIPLET_RESULT.ok && NOTED_RESULT.ok);
  assert.deepEqual(census(), {
    kind: "lv-export-census",
    contract: CONTRACT_VERSION,
    lensVisualizer: FINGERPRINT,
    request: { zoom: "both-ends", focus: "infinity", aperture: "wide-open", lines: "reference", imagePlane: "design" },
    lenses: 7,
    zooms: 4,
    unindexedFiles: 1,
    states: 11,
    exported: 5,
    notExportable: 5,
    byState: {
      prime: { states: 3, exported: 2, notExportable: 1, threw: 0 },
      wide: { states: 4, exported: 2, notExportable: 2, threw: 0 },
      tele: { states: 4, exported: 1, notExportable: 2, threw: 1 },
    },
    threw: ["broken (tele)"],
    reasons: {
      // A state with two problems of one code is under that code once; a zoom is one lens, in two states.
      "folded-path": { states: 3, lenses: ["catadioptric", "mirror"], wideOnly: [], teleOnly: [] },
      "non-refract-interaction": { states: 1, lenses: ["mirror"], wideOnly: [], teleOnly: [] },
      "spectral-data-unavailable": {
        states: 2,
        lenses: ["long-end", "short-end"],
        wideOnly: ["short-end"],
        teleOnly: ["long-end"],
      },
    },
    features: {
      "aperture.annular": 0,
      "lines.multiple": 0,
      "object.finite": 0,
      "surface.asphere.even": 3,
      "surface.asphere.flat-base": 3,
      "surface.asphere.odd": 3,
      "surface.conic": 3,
    },
    notes: { "bulk-absorption": 2, "projection:fisheye-equisolid": 2 },
    limits: {
      // The first state, by key and then wide before tele, that needs the largest value: with its end, for a zoom.
      "asphere.maxPower": { max: 8, lens: "broken", end: "wide" },
      "lines.count": { max: 1, lens: "alpha" },
      "surfaces.count": { max: 7, lens: "broken", end: "wide" },
    },
  });
});

test("a catalog of primes is one state per lens, and no end is named", () => {
  const primes = census(LENSES.filter((lens) => lens.end === undefined));
  assert.deepEqual([primes.lenses, primes.zooms, primes.states], [3, 0, 3]);
  assert.deepEqual(primes.byState.wide, { states: 0, exported: 0, notExportable: 0, threw: 0 });
  assert.deepEqual(primes.byState.tele, primes.byState.wide);
  assert.deepEqual(primes.limits["asphere.maxPower"], { max: 8, lens: "zeta" });
});

test("the census does not depend on the order the lenses are given in", () => {
  assert.deepEqual(census([...LENSES].reverse()), census());
  assert.equal(censusJsonText(census([...LENSES].reverse())), censusJsonText(census()));
});

test("of a zoom that needs a largest value at both ends, the limit names the wide end, whichever is given first", () => {
  assert.ok(TRIPLET_RESULT.ok);
  const wide: CensusLens = { key: "twin", end: "wide", outcome: TRIPLET_RESULT };
  const tele: CensusLens = { key: "twin", end: "tele", outcome: TRIPLET_RESULT };
  for (const given of [
    [wide, tele],
    [tele, wide],
  ]) {
    const { limits, byState } = census(given);
    assert.deepEqual([byState.wide.exported, byState.tele.exported], [1, 1]);
    for (const limit of ["asphere.maxPower", "surfaces.count", "lines.count"] as const) {
      assert.deepEqual([limits[limit].lens, limits[limit].end], ["twin", "wide"], limit);
    }
  }
});

test("a census of nothing has every flag and limit at zero", () => {
  const empty = census([]);
  assert.deepEqual([empty.lenses, empty.zooms, empty.states], [0, 0, 0]);
  assert.deepEqual([empty.exported, empty.notExportable, empty.threw], [0, 0, []]);
  assert.deepEqual(Object.keys(empty.features), [...FEATURE_FLAGS]);
  for (const limit of FEATURE_LIMITS) assert.deepEqual(empty.limits[limit], { max: 0, lens: null });
  assert.match(renderCensusMarkdown(empty), /Every state was exported\.\n/);
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
    "7 lenses, 4 of them zooms, in 11 states; 1 lens files not indexed.",
    "| States | Count | Exported | Not exportable | Threw |",
    "| Primes | 3 | 2 | 1 | 0 |",
    "| Zooms, wide end | 4 | 2 | 2 | 0 |",
    "| Zooms, tele end | 4 | 1 | 2 | 1 |",
    "| All | 11 | 5 | 5 | 1 |",
    "| `folded-path` | 3 | 2 |",
    "### `folded-path` (3 states, 2 lenses)",
    "- `catadioptric`",
    "- `mirror`",
    "### `non-refract-interaction` (1 state, 1 lens)",
    "### `spectral-data-unavailable` (2 states, 2 lenses)",
    "- `long-end` (tele end only)",
    "- `short-end` (wide end only)",
    "## Threw",
    "- `broken (tele)`",
    "| `surface.asphere.odd` | 3 |",
    "| `aperture.annular` | 0 |",
    "| `projection:fisheye-equisolid` | 2 |",
    "| `asphere.maxPower` | 8 | `broken` (wide) |",
    "| `lines.count` | 1 | `alpha` |",
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
  assert.equal(committed.exported + committed.notExportable + committed.threw.length, committed.states);
  // Every zoom is there at both ends, and every prime once.
  assert.equal(committed.states, committed.lenses + committed.zooms);
  const { prime, wide, tele } = committed.byState;
  assert.deepEqual(
    [prime.states, wide.states, tele.states],
    [committed.lenses - committed.zooms, committed.zooms, committed.zooms],
  );
  for (const member of ["exported", "notExportable"] as const) {
    assert.equal(prime[member] + wide[member] + tele[member], committed[member], member);
  }
  assert.deepEqual(committed.threw, [], "a committed census is a healthy one");
  assert.equal(committed.unindexedFiles, 0);
  const known: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];
  for (const [code, { states, lenses, wideOnly, teleOnly }] of Object.entries(committed.reasons)) {
    assert.ok(known.includes(code), code);
    // A lens with the reason has it in one state or in two; the ones named with an end have it in one.
    assert.ok(states >= lenses.length && states <= 2 * lenses.length, code);
    for (const key of [...wideOnly, ...teleOnly]) assert.ok(lenses.includes(key), `${code}: ${key}`);
    assert.deepEqual(
      wideOnly.filter((key) => teleOnly.includes(key)),
      [],
      code,
    );
  }
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
  const words = new Set([
    "lv-export-census",
    CONTRACT_VERSION,
    "both-ends",
    "infinity",
    "wide-open",
    "reference",
    "design",
    "wide",
    "tele",
  ]);
  for (const text of strings) {
    assert.ok(words.has(text) || slug.test(text) || /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(text), text);
  }
});
