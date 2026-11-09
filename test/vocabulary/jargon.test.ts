// The jargon ratchet: every user-facing surface is held to the list of the tool's own words it still uses
// (`JARGON`, `src/vocabulary/jargon.ts`). A word not on a surface's list fails, and so does a listed word the surface
// no longer uses: the lists only shrink, each to empty, as the plain-language stages land.
//
// Deferred: the commands' own output (stdout of run, compare, baseline check and the rest) joins the ratchet in
// Stage 9.3, and the dashboard's visible text in Stage 9.4. MATRIX_ROWS' about and notCovered text moves into the
// vocabulary in Stage 9.5, when the report wording changes.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { COMMANDS, runCli } from "../../src/cli/main.ts";
import { JARGON, jargonProblems, jargonTerms, withoutExemptions } from "../../src/vocabulary/jargon.ts";
import { OUTCOME_TEXT, VERDICT_TEXT } from "../../src/vocabulary/index.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** The words each surface still uses: a key is a command (`lvrtc` for the top-level help) or a file. */
type Allowlist = Readonly<Record<string, readonly string[]>>;

/** `lvrtc --help` and `lvrtc <command> --help`. `run` names --rungs, the older spelling of --checks. */
const CLI_HELP: Allowlist = {
  run: ["rung"],
};

/** The README, a reviewer's first page: it uses none of the tool's own words. */
const README: Allowlist = {};

/** Every committed `reports/**\/*.md`, by its path under reports/. */
const REPORTS: Allowlist = {
  "benchmark/mtf.md": ["rung", "gravest", "adapter revision", "fingerprint"],
  "benchmark/rays.md": ["rung", "adapter revision", "fingerprint"],
  "benchmark/validation-matrix.md": ["rung", "gravest", "adapter revision", "fingerprint"],
  "catalog.md": ["rung", "gravest"],
  "catalog/mtf.md": ["rung", "adapter revision", "fingerprint"],
  "catalog/rays.md": ["rung", "adapter revision", "fingerprint"],
  "diffractive/rays.md": ["rung", "adapter revision", "fingerprint"],
  "features/mtf.md": ["rung", "adapter revision", "fingerprint"],
  "features/rays.md": ["rung", "adapter revision", "fingerprint"],
  "focus-stations/mtf.md": ["rung", "adapter revision", "fingerprint"],
  "focus-stations/rays.md": ["rung", "adapter revision", "fingerprint"],
  "folded/rays.md": ["rung", "adapter revision", "fingerprint"],
  "states/mtf.md": ["rung", "adapter revision", "fingerprint"],
  "states/rays.md": ["rung", "adapter revision", "fingerprint"],
  "validation-statement.md": ["rung"],
};

/** Every golden `test/fixtures/golden/**\/*.md`, by its path under the golden directory. */
const GOLDENS: Allowlist = {
  "catalog.md": ["rung", "gravest"],
  "fake-3-engines-ts.report.md": ["rung", "fingerprint"],
  "fake-3-engines.report.md": ["rung", "fingerprint"],
  "fake-faults.report.md": ["rung", "fingerprint"],
  "fake-group.report.md": ["rung", "fingerprint"],
  "hand-built.report.md": ["rung", "fingerprint"],
  "r10a-stand-ins.report.md": ["rung", "adapter revision", "fingerprint"],
  "r10b-stand-ins.report.md": ["rung", "fingerprint"],
  "r11a-stand-ins.report.md": ["rung", "adapter revision", "fingerprint"],
  "r11b-stand-ins.report.md": ["rung", "fingerprint"],
  "r12b-stand-ins.report.md": ["rung", "fingerprint"],
  "r13b-stand-ins.report.md": ["rung", "fingerprint"],
  "r14b-stand-ins.report.md": ["rung", "fingerprint"],
  "r5-stand-ins.mtf.md": ["rung", "gravest", "adapter revision", "fingerprint"],
  "r5-stand-ins.report.md": ["rung", "fingerprint"],
  "r5g-stand-ins.mtf.md": ["rung", "gravest", "adapter revision", "fingerprint"],
  "r5g-stand-ins.report.md": ["rung", "fingerprint"],
  "r6c-stand-ins.mtf.md": ["rung", "adapter revision", "fingerprint"],
  "r6c-stand-ins.report.md": ["rung", "fingerprint"],
  "r7a-stand-ins.report.md": ["rung", "adapter revision", "fingerprint"],
  "r7b-stand-ins.report.md": ["rung", "fingerprint"],
  "r8a-stand-ins.report.md": ["rung", "adapter revision", "fingerprint"],
  "r8b-stand-ins.report.md": ["rung", "fingerprint"],
  "r9a-stand-ins.report.md": ["rung", "adapter revision", "fingerprint"],
  "r9b-stand-ins.report.md": ["rung", "fingerprint"],
  "validation-matrix.md": ["rung", "gravest", "adapter revision", "fingerprint"],
  "validation-statement.md": ["rung"],
};

/**
 * Holds every text of a surface to its allowlist: what it uses must be what is listed, no more (a new word, or a
 * word on a text with no entry) and no less (a word gone that is still listed: shrink the list). A listed text that
 * the surface no longer has must leave the list too.
 */
function ratchet(surface: string, texts: ReadonlyMap<string, string>, allowlist: Allowlist): void {
  const problems: string[] = [];
  for (const [key, text] of texts) {
    const found = jargonTerms(text);
    const allowed = allowlist[key] ?? [];
    for (const term of found.filter((each) => !allowed.includes(each))) {
      const said = jargonProblems(text).filter((line) => line.startsWith(`${term}:`));
      problems.push(`${surface} ${key}: uses ${said.join(", ")}`);
    }
    for (const term of allowed.filter((each) => !found.includes(each)))
      problems.push(`${surface} ${key}: no longer uses "${term}": remove it from the allowlist`);
  }
  for (const key of Object.keys(allowlist).filter((each) => !texts.has(each)))
    problems.push(`${surface} ${key}: there is no such text: remove it from the allowlist`);
  for (const terms of Object.values(allowlist))
    for (const term of terms)
      assert.ok(
        JARGON.some((jargon) => jargon.term === term),
        `${term} is a term of JARGON`,
      );
  assert.deepEqual(problems, []);
}

async function output(args: readonly string[]): Promise<string> {
  let text = "";
  const code = await runCli(args, {
    stdout: (chunk) => {
      text += chunk;
    },
    stderr: (chunk) => {
      text += chunk;
    },
  });
  assert.equal(code, 0, `lvrtc ${args.join(" ")}`);
  return text;
}

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(path);
      return entry.name.endsWith(".md") ? [path] : [];
    })
    .sort();
}

function filesUnder(directory: string): Map<string, string> {
  const root = join(ROOT, directory);
  assert.ok(existsSync(root), directory);
  return new Map(
    markdownFiles(root).map((file) => [relative(root, file).split("\\").join("/"), readFileSync(file, "utf8")]),
  );
}

test("jargonProblems names each word of the tool's own with what to say instead, on word boundaries in any case", () => {
  assert.deepEqual(jargonProblems("Two engines on one check, within the limit."), []);
  assert.deepEqual(jargonProblems("Each Rung of the ladder; the gravest verdict."), [
    'rung: "Rung"; say "check"',
    'ladder: "ladder"; say "the checks"',
    'gravest: "gravest"; say "worst"',
  ]);
  assert.deepEqual(jargonTerms("The manifest, its recipe, a span and the bases; Stage 8.2 and phase 9."), [
    "span",
    "recipe",
    "manifest",
    "basis",
    "Stage",
    "Phase",
  ]);
  assert.deepEqual(jargonTerms("The owner's adapter revisions and fingerprints, said by an implementer."), [
    "adapter revision",
    "fingerprint",
    "owner",
    "implementer",
  ]);
  // A word that only contains one is not it; a stage without a number is no stage of the plan.
  assert.deepEqual(jargonTerms("A lifespan, a manifestly basic stage, rungsten, an ownership."), []);
  // What is under a heading that is exactly "Identifiers" is exempt, to the next heading of its level or above.
  const text =
    "# Report\n\nA check.\n\n## Identifiers\n\nfingerprint ab12\n\n### Hashes\n\nmanifest\n\n## Next\n\nA rung.\n";
  assert.equal(withoutExemptions(text).includes("fingerprint"), false);
  assert.deepEqual(jargonTerms(text), ["rung"]);
  assert.deepEqual(jargonTerms("## identifiers\n\nfingerprint\n"), []);
  // A heading that only starts with the word is no exemption.
  assert.deepEqual(jargonTerms("## Identifiers of each run\n\nfingerprint ab12\n"), ["fingerprint"]);
  assert.deepEqual(jargonTerms("## Identifiers and owners\n\nA check.\n"), ["owner"]);
});

test("only a <details> whose <summary> is exactly Identifiers is exempt; every other <details> is checked", () => {
  assert.deepEqual(jargonTerms("<details><summary>Identifiers</summary>fingerprint ab12</details>\nA check."), []);
  assert.deepEqual(
    jargonTerms("<details open>\n<summary> identifiers </summary>\nadapter revision cd34\n</details>"),
    [],
  );
  assert.deepEqual(jargonTerms("<details><summary>How to read this page</summary>Each rung.</details>"), ["rung"]);
  assert.deepEqual(jargonTerms("<details><summary>Identifiers of runs</summary>the manifest</details>"), ["manifest"]);
  assert.deepEqual(jargonTerms("<details>the owner</details>"), ["owner"]);
});

test("the help of lvrtc and of every command uses no more of the tool's own words than its allowlist", async () => {
  const texts = new Map<string, string>([["lvrtc", await output(["--help"])]]);
  for (const command of COMMANDS) texts.set(command.name, await output([command.name, "--help"]));
  ratchet("help", texts, CLI_HELP);
});

test("the help of lvrtc help <command> is the command's own help", async () => {
  for (const command of COMMANDS)
    assert.equal(await output(["help", command.name]), await output([command.name, "--help"]));
});

test("the README uses none of the tool's own words, and shows every verdict and outcome by the vocabulary's label", () => {
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  ratchet("", new Map([["README.md", readme]]), README);
  for (const [stored, text] of [...Object.entries(VERDICT_TEXT), ...Object.entries(OUTCOME_TEXT)]) {
    assert.ok(readme.includes(text.label), text.label);
    assert.ok(readme.includes(`\`${stored}\``), stored);
  }
});

test("every committed report uses no more of the tool's own words than its allowlist", () => {
  ratchet("reports/", filesUnder("reports"), REPORTS);
});

test("every golden report uses no more of the tool's own words than its allowlist", () => {
  ratchet("test/fixtures/golden/", filesUnder("test/fixtures/golden"), GOLDENS);
});
