// The jargon ratchet: every user-facing surface is held to the list of the tool's own words it still uses
// (`JARGON`, `src/vocabulary/jargon.ts`). A word not on a surface's list fails, and so does a listed word the surface
// no longer uses: the lists only shrink, each to empty, as the plain-language stages land.
//
// The commands' own output joins the ratchet here (`CLI_OUTPUT`): what they print on a temporary root of fake
// engines. The dashboard joins it too (`DASHBOARD`): the visible text and the <title> text of every page its wording
// test renders, by kind of page.
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { createBaselineCommand } from "../../src/cli/commands/baseline.ts";
import { createChecksCommand } from "../../src/cli/commands/checks.ts";
import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createDoctorCommand } from "../../src/cli/commands/doctor.ts";
import type { DoctorProbe } from "../../src/cli/commands/doctor.ts";
import { createEngineCommand } from "../../src/cli/commands/engine.ts";
import { createGlossaryCommand } from "../../src/cli/commands/glossary.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { COMMANDS, runCli } from "../../src/cli/main.ts";
import type { CliCommand } from "../../src/cli/main.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { wordingProblems } from "../../src/report/wording.ts";
import { FAKE_ROOT, caseFixture, tempDir } from "../core/support.ts";
import { controlChoices } from "../../src/cli/commands/serve.ts";
import { CONFIG_FILE, loadConfig } from "../../src/core/config.ts";
import { createViews, startDashboard } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import { LENS_KEY, lensGoldenQuery } from "../dashboard/lensFixture.ts";
import { buildFixture, everyPage, fetchFrom, titleTexts, visibleText } from "../dashboard/support.ts";
import { JARGON, jargonProblems, jargonTerms, withoutExemptions } from "../../src/vocabulary/jargon.ts";
import { OUTCOME_TEXT, VERDICT_TEXT } from "../../src/vocabulary/index.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** The words each surface still uses: a key is a command (`lvrtc` for the top-level help) or a file. */
type Allowlist = Readonly<Record<string, readonly string[]>>;

/** `lvrtc --help` and `lvrtc <command> --help`. `run` names --rungs, the older spelling of --checks. */
const CLI_HELP: Allowlist = {
  run: ["rung"],
};

/**
 * What the commands print on a temporary root of fake engines, by command line. `run` and `baseline check` name the
 * run record's file, manifest.json, whose name is stored; `glossary` says which of the tool's own words each term
 * replaces; `checks` shows each check's old id beside its id (the id it had before the rename, which is still read).
 */
const CLI_OUTPUT: Allowlist = {
  "run suites/pair.json --engines fake-a,fake-near,fake-none": ["manifest"],
  "baseline check pair": ["manifest"],
  "baseline check pair, out of date": ["manifest"],
  checks: ["old check id"],
  "checks ray-trace": ["old check id"],
  glossary: ["rung", "ladder", "recipe", "manifest", "adapter revision", "fingerprint", "owner"],
};

/** The README, a reviewer's first page: it uses none of the tool's own words. */
const README: Allowlist = {};

/**
 * Every committed `reports/**\/*.md`, by its path under reports/. The catalog's statistics list each classified
 * failure with the command that reproduces it, as `docs/known-failures.json` stores it: `--rungs`, the older spelling
 * of `--checks`, until the catalog is refreshed. The catalog snapshot's reports name its checks by the ids it was
 * written with (`r2`) and its engines by theirs (`ref`), until the end-of-project catalog refresh.
 */
const REPORTS: Allowlist = {
  "catalog.md": ["rung", "old check id", "old engine id"],
  "catalog/mtf.md": ["old check id", "old engine id"],
  "catalog/rays.md": ["old check id", "old engine id"],
};

/**
 * Every golden `test/fixtures/golden/**\/*.md`, by its path under the golden directory. The catalog's stand-in keeps
 * its reproducer commands and its check and engine ids as the committed one does, and a blocked pair's reason is the
 * comparison's own, as `comparisons.json` stores it ("not judged: rung built-system failed ...").
 */
const GOLDENS: Allowlist = {
  "catalog.md": ["rung", "old check id", "old engine id"],
  "hand-built.report.md": ["rung"],
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

// ── What the commands print ──────────────────────────────────────────────────────────────────────────────────────

const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));

/** A root with two fake engines, the suite `pair` of two case files, and nothing run. */
function fakeRoot(t: TestContext, near: Readonly<Record<string, unknown>> = { bias: 2e-14 }): string {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  mkdirSync(join(rootDir, "suites"), { recursive: true });
  for (const each of ["singlet", "double-gauss"]) cpSync(caseFixture(each), join(rootDir, "cases", `${each}.json`));
  writeConfig(rootDir, near);
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "pair",
    defaults: { rungs: ["pipeline-echo"] },
    runs: ["singlet", "double-gauss"].map((name) => ({ name, lens: { kind: "fixture", path: `cases/${name}.json` } })),
  };
  writeFileSync(join(rootDir, "suites", "pair.json"), JSON.stringify(suite));
  return rootDir;
}

function writeConfig(rootDir: string, near: Readonly<Record<string, unknown>>): void {
  const engine = (id: string, more: Readonly<Record<string, unknown>> = {}) => ({
    transport: "in-process",
    module: FAKE_ENGINE,
    options: { id, ...more },
  });
  const engines = {
    "fake-a": engine("fake-a"),
    "fake-near": engine("fake-near", near),
    "fake-none": engine("fake-none", { offersQuantities: false }),
  };
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ engines }));
}

/** A machine with nothing on it: doctor's probes find no LensVisualizer, no Python and no optiland. */
const BARE_MACHINE: DoctorProbe = {
  nodeVersion: () => process.versions.node,
  exists: () => false,
  run: () => null,
  lvBinding: async () => ({ status: "failed", code: "path-missing", message: "no checkout" }),
  optilandEngine: async () => ({ status: "unavailable", code: "not-configured", message: "not configured" }),
};

/** The commands of a root, wired to it in this process. */
function commandsOf(rootDir: string): CliCommand[] {
  const inputs = { rootDir, cwd: rootDir, env: { LVRTC_RUNS_DIR: join(rootDir, "runs") } };
  return [
    createRunCommand(inputs),
    createCompareCommand(inputs),
    createReportCommand(inputs),
    createBaselineCommand(inputs),
    createVerifyCommand({ rootDir, cwd: rootDir }),
    createDoctorCommand({ ...inputs, probe: BARE_MACHINE }),
    createEngineCommand(inputs),
    createChecksCommand(),
    createGlossaryCommand(),
  ];
}

/** Everything a command line printed, on both streams. */
async function printed(rootDir: string, args: readonly string[]): Promise<string> {
  let text = "";
  const io = { stdout: (chunk: string) => void (text += chunk), stderr: (chunk: string) => void (text += chunk) };
  await runCli(args, io, commandsOf(rootDir));
  return text;
}

test("what the commands print uses no more of the tool's own words than its allowlist, and no banned claim", async (t) => {
  const rootDir = fakeRoot(t);
  const texts = new Map<string, string>();
  const say = async (args: readonly string[], key = args.join(" ")): Promise<void> => {
    texts.set(key, await printed(rootDir, args));
  };
  await say(["run", "suites/pair.json", "--engines", "fake-a,fake-near,fake-none"]);
  await say(["compare", "pair"]);
  await say(["report", "pair"]);
  // A baseline of agreeing engines: written, checked, and verified.
  await printed(rootDir, ["run", "suites/pair.json"]);
  await printed(rootDir, ["compare", "pair"]);
  await say(["baseline", "write", "pair"]);
  await say(["baseline", "check", "pair"]);
  await say(["verify"]);
  // Another build of an engine: out of date, and what moved.
  writeConfig(rootDir, { bias: 3e-14 });
  await say(["baseline", "check", "pair", "--details"], "baseline check pair, out of date");
  await say(["doctor"]);
  await say(["engine", "describe", "fake-a", "lv"]);
  await say(["checks"]);
  await say(["checks", "ray-trace"]);
  await say(["glossary"]);
  for (const [key, text] of texts) {
    assert.notEqual(text, "", key);
    assert.deepEqual(wordingProblems(text), [], key);
  }
  ratchet("output", texts, CLI_OUTPUT);
});

// ── The dashboard ────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * The dashboard's pages, by kind of page: every page of a kind read together. What remains is not the dashboard's own
 * words: a chart's tooltip names the source of each limit it draws, a JSON pointer into the limits file, whose member
 * is `rungs`. The checks page shows each check's old id beside its id, and the help page each engine's. Beside the
 * pages the wording test reads, a lens page (bare, and with its golden's curves) and a job page of run control are
 * read.
 */
const DASHBOARD: Allowlist = {
  checks: ["old check id"],
  help: ["old engine id"],
  section: ["rung"],
  "compare tab": ["rung"],
  lens: ["rung"],
};

/** The kind of a dashboard page by its path: what the allowlist is keyed by. */
function pageKind(path: string): string {
  const segments = path.split("?")[0].split("/").slice(1);
  if (segments[0] === "") return "index";
  if (segments[0] === "run") return segments.length === 2 ? "run" : segments[2] === "section" ? "section" : "run part";
  if (segments[0] === "baseline") return segments.length === 2 ? "baseline" : "baseline run";
  if (segments[0] === "compare") return segments.length === 2 ? "compare" : "compare tab";
  if (segments[0] === "control" && segments[1] === "job") return "job";
  return segments[0];
}

/** Adds a page's visible and <title> text, Identifiers left out, to the text of its kind. */
function addPage(texts: Map<string, string>, kind: string, html: string): void {
  const shown = withoutExemptions(html);
  texts.set(kind, [texts.get(kind) ?? "", visibleText(shown), ...titleTexts(shown)].join("\n\n"));
}

test("every page of the dashboard uses no more of the tool's own words than its allowlist; Identifiers are exempt", async (t) => {
  const fixture = await buildFixture();
  const roots = [
    { rootDir: fixture.rootDir, runsDir: fixture.runsDir },
    { rootDir: fixture.mtfRootDir, runsDir: fixture.mtfRunsDir, policyFile: fixture.mtfPolicyFile },
    { rootDir: fixture.raysRootDir, runsDir: fixture.raysRunsDir, policyFile: fixture.raysPolicyFile },
    { rootDir: fixture.compareRootDir, runsDir: fixture.compareRunsDir, policyFile: fixture.comparePolicyFile },
  ];
  const texts = new Map<string, string>();
  try {
    for (const root of roots) {
      const dashboard = await startDashboard({ ...root, port: 0 });
      try {
        const paths = [...(await everyPage(dashboard.port)), "/control"];
        // The lens page, bare and with the curves of its golden chosen.
        const views = createViews(createSources(root), () => ({ state: "not-asked" }));
        if (views.lensIndex().lenses.has(LENS_KEY)) {
          paths.push(`/lens/${LENS_KEY}`, `/lens/${LENS_KEY}?${lensGoldenQuery(views)}`);
        }
        for (const path of paths) {
          const answer = await fetchFrom(dashboard.port, path);
          assert.equal(answer.status, 200, path);
          addPage(texts, pageKind(path), answer.body);
        }
      } finally {
        await dashboard.close();
      }
    }
  } finally {
    fixture.remove();
  }
  // A job page of run control: a collect on the fixture root, its step's output (the command's own words, which the
  // CLI's surfaces hold) left out.
  const control = controlChoices(loadConfig({ rootDir: FAKE_ROOT, env: process.env }), [], process.env);
  const dashboard = await startDashboard({ rootDir: FAKE_ROOT, runsDir: join(tempDir(t), "runs"), port: 0, control });
  try {
    const token = /name="token" value="([0-9a-f]{64})"/.exec((await fetchFrom(dashboard.port, "/control")).body)?.[1];
    const posted = await fetchFrom(dashboard.port, "/control/collect", {
      method: "POST",
      body: new URLSearchParams({ token: token ?? "" }).toString(),
      headers: { "content-type": "application/x-www-form-urlencoded", origin: `http://127.0.0.1:${dashboard.port}` },
    });
    assert.equal(posted.status, 303, posted.body);
    for (let tries = 0; JSON.parse((await fetchFrom(dashboard.port, "/api/control/job/1")).body).running; tries++) {
      assert.ok(tries < 900, "the collect ended");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const job = await fetchFrom(dashboard.port, "/control/job/1");
    assert.equal(job.status, 200);
    addPage(texts, pageKind("/control/job/1"), job.body.replace(/<pre>[\s\S]*?<\/pre>/g, ""));
  } finally {
    await dashboard.close();
  }
  for (const kind of ["lens", "job"]) assert.ok(texts.has(kind), kind);
  ratchet("dashboard", texts, DASHBOARD);
});

test("an engine's old id is found only where it can be nothing but an id", () => {
  const found = (text: string): boolean => jargonTerms(text).includes("old engine id");
  for (const text of [
    "the pair lv – ref",
    "| lv / ref | 0.25 |",
    "ref – optiland",
    "the engine `wave`",
    "`replay` and `flux`",
    "asked of ref-seidel and optiland",
    "the column optiland-wave",
  ])
    assert.ok(found(text), text);
  for (const text of [
    "nikkor-z50f12-ref",
    "best-ref and best-photopic",
    "the reference tracer",
    "the wave MTF of the rays and their flux into the image",
    "a replay of LensVisualizer's sampling",
    "otf-of-optiland-wavefront",
    "lv – reference-tracer",
    "lv / wave-mtf-of-lv-rays",
    "waveMtf.maxAbs",
    "the method replay-geometric",
    "flux-of-lv-rays",
  ])
    assert.ok(!found(text), text);
});
