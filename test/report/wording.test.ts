// The lint of a report's wording: each claim that no recorded comparison supports is rejected, in a sentence and
// in a row of a table, and every template and every golden report is accepted.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { REPO_ROOT } from "../../src/core/config.ts";
import { renderReport } from "../../src/report/index.ts";
import {
  BANNED_CLAIMS,
  WAVEFRONT_SEVERAL_LINES,
  MTF_COMPARISON_INTROS,
  DIFFERENCE_CLASS_TEXT,
  FIELD_REASON_TEXT,
  MTF_COMPARISON_INTRO,
  MTF_COMPARISON_OUTRO,
  MTF_ROW_STATUSES,
  MTF_ROW_STATUS_TEXT,
  NOT_COVERED,
  STATEMENT_TEXT,
  severalLinesChiefLanding,
  sentencesOf,
  wordingProblems,
} from "../../src/report/wording.ts";
import { COMPARISONS, MANIFEST, POLICY } from "./handBuilt.ts";
import { GOLDEN_DIR } from "./support.ts";

const REPORTS_DIR = join(REPO_ROOT, "reports");

const SIGNED_STATEMENT =
  "On 251 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices " +
  "and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from " +
  "those rays agree within theirs: worst landing 9.7e-13 mm (gate 1e-8 mm), optical path 3.9e-9 waves (2e-5), geometric " +
  "MTF 1.5e-11 (1e-7), wave MTF 1.2e-9 (2e-8); the benchmark covers six wavelengths. LensVisualizer's diffraction MTF is " +
  "recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, " +
  "differs by up to 0.31, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per " +
  "wavelength and photopic, differs by up to 0.026. Dispersion, white-light weighting beyond the stated lines, focus " +
  "choice, stop sizing, states not named and the catalog beyond these suites are not covered.";

/** A sentence that makes each banned claim, by the claim's name: every claim has at least two. */
const CLAIMS: { readonly [name: string]: readonly string[] } = {
  validated: [
    "LensVisualizer's MTF is validated by optiland.",
    "This run validates the product MTF.",
    "R6c is validation of the result.",
    "| lv | optiland | certified |",
  ],
  "mtf-agrees": [
    "LensVisualizer agrees with optiland's diffraction MTF.",
    "The FFT MTF of optiland matches LensVisualizer's within 0.004.",
    "The two MTF curves are consistent.",
    "There is agreement of the product MTF and optiland's.",
  ],
  "mtf-confirmed": [
    "optiland confirms the diffraction MTF of LensVisualizer.",
    "The MTF was verified against optiland.",
    "optiland's FFT reproduces LensVisualizer's MTF.",
  ],
  "mtf-correct": [
    "LensVisualizer's MTF is correct at 30 cycles/mm.",
    "The comparison shows the accuracy of the product MTF.",
    "The MTF is accurate to 0.005.",
  ],
  "recorded-as-pass": [
    "Every RECORDED row passes.",
    "| 0 | sagittal | 10 | RECORDED | PASS |",
    "A recorded row has met its band.",
    "The recorded difference passed.",
    "R5 passes for every lens of the benchmark.",
    "R6c passes for every lens of the benchmark.",
    "| canon-ef-135-f2l-usm-ref | r5 | lv | optiland | PASS |",
  ],
  "recorded-authority": [
    "R5 is accurate.",
    "R6c proves the result.",
    "R6b proves the result.",
    "The recorded rung is trustworthy.",
  ],
  "counterpart-preference": [
    "The FFT counterpart is better.",
    "We prefer the raw wavefront counterpart.",
    "optiland-wave is the preferred reference.",
    "The FFT counterpart is superior to the wavefront counterpart.",
    "With no preference claimed, the FFT counterpart is better.",
    "With no preference between them, the FFT counterpart is better.",
    "The wavefront has no missing samples and is the preferred counterpart.",
  ],
  "band-as-tolerance": [
    "The difference is within tolerance of the attention band.",
    "All RECORDED rows are within the tolerance.",
  ],
};

test("each banned claim is rejected, in every wording of it here, and named", () => {
  assert.deepEqual(Object.keys(CLAIMS).sort(), BANNED_CLAIMS.map((claim) => claim.name).sort());
  for (const claim of BANNED_CLAIMS) {
    assert.ok(claim.why.length > 0, claim.name);
    for (const sentence of CLAIMS[claim.name]) {
      assert.ok(claim.matches(sentence), `${claim.name} does not reject: ${sentence}`);
      const problems = wordingProblems(`A heading\n\n${sentence}\n`);
      assert.ok(problems.includes(`${claim.name}: ${sentence}`), `${claim.name}: ${problems.join("; ")}`);
    }
  }
  // A claim is found wherever it stands: in the middle of a paragraph that is broken over lines, and in a list.
  const paragraph = "The table follows. LensVisualizer\nagrees with optiland's\ndiffraction MTF. Nothing else is said.";
  assert.deepEqual(wordingProblems(paragraph), ["mtf-agrees: LensVisualizer agrees with optiland's diffraction MTF."]);
  assert.deepEqual(wordingProblems("- optiland validated the MTF of this lens."), [
    "validated: - optiland validated the MTF of this lens.",
  ]);
});

test("what a report may say is accepted: every template, and sentences that only sound like a claim", () => {
  const templates = [
    ...NOT_COVERED,
    ...Object.values(STATEMENT_TEXT),
    MTF_COMPARISON_INTRO.join("\n"),
    MTF_COMPARISON_INTROS.wavefront.join("\n"),
    WAVEFRONT_SEVERAL_LINES.join("\n"),
    severalLinesChiefLanding("1.00e-3").join("\n"),
    MTF_COMPARISON_OUTRO.join("\n"),
    ...Object.values(FIELD_REASON_TEXT),
    ...Object.values(DIFFERENCE_CLASS_TEXT),
    ...MTF_ROW_STATUSES.map((status) => `| ${status} | ${MTF_ROW_STATUS_TEXT[status]} |`),
  ];
  for (const text of templates) assert.deepEqual(wordingProblems(text), [], text);
  for (const text of [
    SIGNED_STATEMENT,
    "Only FAIL and ERROR fail a comparison. FLOOR is a pass that is counted apart from PASS.",
    "RECORDED and ATTENTION are not failures: a recorded rung compares methods that are expected to differ.",
    "| PASS | A gated rung: every judged metric is at or below its tolerance. |",
    "| r4 | lv | ref | PASS |\n| r5 | lv | optiland | RECORDED |",
    "Identical rays agree with optiland within 1e-8 mm.",
    "Quantity `mtf.native`, compared independent-method, recorded.",
    "sampling.mismatches 0, fields.mismatches 0",
    "| edge | r5 | ok | ok | ok |",
    "Rung R5 is recorded and never gated: it sets two methods side by side.",
    "The R6c difference is recorded as method, with numerical rows set aside.",
    "The FFT and raw wavefront counterparts are recorded side by side, with no preference claimed.",
    "Within gated R4 and R6a limits, geometric MTF and wave MTF of identical rays agree.",
    "| certified-artificial-focus1 | finite-conjugate-unavailable |",
    "| certified-artificial-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose " +
      "object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |",
    "# Validation statement",
  ]) {
    assert.deepEqual(wordingProblems(text), [], text);
  }
});

test("a text is read sentence by sentence, a row of a table and a heading each as one", () => {
  assert.deepEqual(
    sentencesOf("# A title\n\nOne sentence\nover two lines. A second one!\n\n| a | b |\n|---|---|\n| c. d | e |\n"),
    ["# A title", "One sentence over two lines.", "A second one!", "| a | b |", "|---|---|", "| c. d | e |"],
  );
  assert.deepEqual(sentencesOf(""), []);
});

test("every golden report, and the committed reports, pass the lint", () => {
  const golden = readdirSync(GOLDEN_DIR).filter((name) => name.endsWith(".md"));
  assert.ok(golden.length >= 5);
  for (const name of golden) assert.deepEqual(wordingProblems(readFileSync(join(GOLDEN_DIR, name), "utf8")), [], name);
  assert.deepEqual(wordingProblems(renderReport(MANIFEST, COMPARISONS, POLICY).markdown), []);
  const committed = readdirSync(REPORTS_DIR, { recursive: true, encoding: "utf8" }).filter((name) =>
    name.endsWith(".md"),
  );
  assert.ok(committed.includes("validation-statement.md"));
  for (const name of committed)
    assert.deepEqual(wordingProblems(readFileSync(join(REPORTS_DIR, name), "utf8")), [], name);
});
