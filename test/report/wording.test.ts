// The lint of a report's wording: each claim that no recorded comparison supports is rejected, in a sentence and
// in a row of a table, and every template and every golden report is accepted.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { renderReport } from "../../src/report/index.ts";
import {
  BANNED_CLAIMS,
  DIFFERENCE_CLASS_TEXT,
  FIELD_REASON_TEXT,
  MTF_COMPARISON_INTRO,
  MTF_COMPARISON_OUTRO,
  MTF_ROW_STATUSES,
  MTF_ROW_STATUS_TEXT,
  NOT_COVERED,
  sentencesOf,
  wordingProblems,
} from "../../src/report/wording.ts";
import { COMPARISONS, MANIFEST, POLICY } from "./handBuilt.ts";
import { GOLDEN_DIR } from "./support.ts";

/** A sentence that makes each banned claim, by the claim's name: every claim has at least two. */
const CLAIMS: { readonly [name: string]: readonly string[] } = {
  validated: [
    "LensVisualizer's MTF is validated by optiland.",
    "This run validates the product MTF.",
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
    "| canon-ef-135-f2l-usm-ref | r5 | lv | optiland | PASS |",
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
    MTF_COMPARISON_INTRO.join("\n"),
    MTF_COMPARISON_OUTRO.join("\n"),
    ...Object.values(FIELD_REASON_TEXT),
    ...Object.values(DIFFERENCE_CLASS_TEXT),
    ...MTF_ROW_STATUSES.map((status) => `| ${status} | ${MTF_ROW_STATUS_TEXT[status]} |`),
  ];
  for (const text of templates) assert.deepEqual(wordingProblems(text), [], text);
  for (const text of [
    "Only FAIL and ERROR fail a comparison. FLOOR is a pass that is counted apart from PASS.",
    "RECORDED and ATTENTION are not failures: a recorded rung compares methods that are expected to differ.",
    "| PASS | A gated rung: every judged metric is at or below its tolerance. |",
    "| r4 | lv | ref | PASS |\n| r5 | lv | optiland | RECORDED |",
    "Identical rays agree with optiland within 1e-8 mm.",
    "Quantity `mtf.native`, compared independent-method, recorded.",
    "sampling.mismatches 0, fields.mismatches 0",
    "| edge | r5 | ok | ok | ok |",
    "Rung R5 is recorded and never gated: it sets two methods side by side.",
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
});
