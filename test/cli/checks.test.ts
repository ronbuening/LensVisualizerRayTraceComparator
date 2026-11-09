// The front door: the grouped top-level help, `lvrtc help <command>`, `lvrtc checks` and `lvrtc glossary`. Each list
// they print is held to its source (`RUNGS`, the limits file, the vocabulary), so a check or a term added there shows
// here without a word written by hand.
import assert from "node:assert/strict";
import { test } from "node:test";

import { COMMANDS, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import type { CliCommand } from "../../src/cli/main.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { wordingProblems } from "../../src/report/wording.ts";
import { CHECKS, CLI_TEXT, TERMS, jargonTerms, metricLabel } from "../../src/vocabulary/index.ts";

interface Said {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

async function lvrtc(args: readonly string[], commands: readonly CliCommand[] = COMMANDS): Promise<Said> {
  const out: string[] = [];
  const err: string[] = [];
  const code = await runCli(
    args,
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    commands,
  );
  return { code, out: out.join(""), err: err.join("") };
}

test("the top-level help groups every command, says what lvrtc is, and leaves none out", async () => {
  const help = await lvrtc(["--help"]);
  assert.equal(help.code, EXIT_OK);
  assert.ok(help.out.startsWith(`${CLI_TEXT.usage}\n\n${CLI_TEXT.intro.join("\n")}\n`), help.out);
  const titles = CLI_TEXT.groups.map((group) => group.title);
  assert.deepEqual(titles, ["Getting started", "Check LensVisualizer", "Look closer", "For maintainers"]);
  let at = 0;
  for (const title of titles) {
    const found = help.out.indexOf(`\n${title}:\n`, at);
    assert.ok(found > at, title);
    at = found;
  }
  // Every registered command is named by a group, and no group names one that is not registered.
  const named = new Set(CLI_TEXT.groups.flatMap((group) => group.entries.map((entry) => entry.command)));
  assert.deepEqual([...named].sort(), COMMANDS.map((command) => command.name).sort());
  assert.doesNotMatch(help.out, new RegExp(`\n${CLI_TEXT.other}:`));
  assert.match(help.out, /^ {2}baseline check +Run a suite again and say whether its committed results still hold$/m);
  assert.match(help.out, /^ {2}baseline write +Write a suite's committed results from a compared run$/m);
  assert.match(help.out, /^ {2}check-lv +Check LensVisualizer: /m);
  // `lvrtc help` alone is the same text, and so is no command at all.
  assert.equal((await lvrtc(["help"])).out, help.out);
  assert.equal((await lvrtc([])).out, help.out);
  // Its words: none of the tool's own, and no claim the reports may not make.
  assert.deepEqual(jargonTerms(help.out), []);
  assert.deepEqual(wordingProblems(help.out), []);
});

test("lvrtc help <command> prints that command's help; an unknown command is a usage error", async () => {
  for (const name of ["doctor", "check-lv", "baseline", "checks", "glossary", "run"]) {
    const help = await lvrtc(["help", name]);
    assert.equal(help.code, EXIT_OK, name);
    assert.equal(help.out, (await lvrtc([name, "--help"])).out, name);
    assert.match(help.out, new RegExp(`^Usage: lvrtc ${name} `), name);
  }
  // A subcommand after the command is the command's help, which covers its subcommands.
  assert.equal((await lvrtc(["help", "baseline", "check"])).out, (await lvrtc(["baseline", "--help"])).out);
  const unknown = await lvrtc(["help", "nope"]);
  assert.equal(unknown.code, EXIT_USAGE);
  assert.match(unknown.err, /^lvrtc help: there is no command "nope"\n\nUsage: lvrtc <command>/);
});

test("every command's help says how it exits, and run lists the checks and engines from their sources", async () => {
  for (const command of COMMANDS) {
    const help = await lvrtc([command.name, "--help"]);
    assert.equal(help.code, EXIT_OK, command.name);
    assert.match(help.out, /^Usage: /, command.name);
    assert.match(help.out, /Exit code/, command.name);
    for (const line of help.out.split("\n").slice(3)) assert.ok(line.length <= 118, `${command.name}: ${line}`);
  }
  const run = (await lvrtc(["run", "--help"])).out;
  for (const rung of RUNGS) {
    const check = CHECKS.find((each) => each.id === rung.id);
    assert.match(run, new RegExp(`^ +${rung.id} +${check?.title.replace(/[()]/g, "\\$&")}`, "m"), rung.id);
  }
  assert.match(run, /--checks <ids> +the checks of every run/);
  assert.match(run, /--rungs is the older spelling/);
  assert.match(run, /^ +reference-tracer +Reference tracer$/m);
});

test("lvrtc checks lists every check with its kind and what it compares", async () => {
  const list = await lvrtc(["checks"]);
  assert.equal(list.code, EXIT_OK);
  for (const check of CHECKS) {
    const kind = check.kind === "limit" ? "held to a limit" : "side by side, no limit";
    assert.ok(list.out.includes(`${check.id} (old id: ${check.oldId})  ${check.title}: ${kind}\n`), check.id);
  }
  // The list names each check's old id beside it, by design, and no other word of the tool's own.
  assert.deepEqual(jargonTerms(list.out), ["old check id"]);
  assert.deepEqual(wordingProblems(list.out), []);

  const json = JSON.parse((await lvrtc(["checks", "--json"])).out);
  assert.deepEqual(
    json.checks.map((check: { id: string }) => check.id),
    RUNGS.map((rung) => rung.id),
  );
  assert.equal(json.limitsFile, loadPolicy().version);
});

test("lvrtc checks <id> shows a check in full: its engines from the checks, its limits from the limits file", async () => {
  const policy = loadPolicy();
  for (const id of ["r2", "ray-trace"]) {
    const shown = await lvrtc(["checks", id]);
    assert.equal(shown.code, EXIT_OK, id);
    assert.ok(shown.out.startsWith("Ray trace\n"), shown.out);
    assert.match(shown.out, /^ {2}old id +r2$/m);
    // The id it had before the rename is read as today's, and the command says so once.
    if (id === "r2")
      assert.match(shown.err, /^note: some ids were read under their new names: check r2 is now ray-trace; /);
    else assert.equal(shown.err, "");
    assert.match(shown.out, /^ {2}engines +the suite's engines, or those --engines names$/m);
    assert.match(shown.out, /^ {2}runs +in every run, unless --checks names other checks$/m);
    assert.match(shown.out, new RegExp(`limits \\(from the limits file, version ${policy.version}\\):`));
    for (const [metric, limits] of Object.entries(policy.rungs["ray-trace"].metrics)) {
      assert.ok(shown.out.includes(`${metricLabel(metric)} (${metric}): limit ${limits.tolerance}`), metric);
    }
  }
  // A check about engines of its own names them, and a side-by-side check its bands and sorting limits.
  const r5 = (await lvrtc(["checks", "mtf-vs-optiland-fft"])).out;
  assert.match(
    r5,
    /^ {2}engines +lv \(LensVisualizer\), optiland, wave-mtf-of-lv-rays \(Wave MTF of LensVisualizer's rays\); asked of$/m,
  );
  assert.match(r5, /^ {2}runs +only where a suite or --checks names it$/m);
  assert.match(r5, /\(mtfOnAxis\.maxAbs\): review band 0\.005\./);
  assert.match(r5, /\(chiefLanding\.maxAbs\): sorting limit/);
  assert.match(
    (await lvrtc(["checks", "mtf-vs-optiland-wavefront"])).out,
    /1e-7 mm, 0\.001 mm when either answer has several\s+wavelengths/,
  );
  assert.match((await lvrtc(["checks", "seidel-vs-optiland"])).out, /\(SPHA\.maxAbs\): no review band\./);

  const json = JSON.parse((await lvrtc(["checks", "lv-mtf-replay", "--json"])).out);
  assert.deepEqual(json.engines, ["lv", "replay-of-lv-mtf"]);
  assert.equal(json.onlyWhereNamed, false);
  assert.deepEqual(
    json.limits.map((limit: { metric: string }) => limit.metric),
    Object.keys(policy.rungs["lv-mtf-replay"].metrics),
  );

  for (const args of [
    ["checks", "r99"],
    ["checks", "ray-trace", "optical-path"],
    ["checks", "--wat"],
  ]) {
    const refused = await lvrtc(args);
    assert.equal(refused.code, EXIT_USAGE, args.join(" "));
    assert.match(refused.err, /\nUsage: lvrtc checks /);
  }
});

test("lvrtc glossary prints the terms; a term is found by its word, a word it replaces, or a stored value", async () => {
  const all = await lvrtc(["glossary"]);
  assert.equal(all.code, EXIT_OK);
  for (const term of TERMS) assert.match(all.out, new RegExp(`^${term.term.replace(/[()]/g, "\\$&")}( \\(|$)`, "m"));
  assert.doesNotMatch(all.out, /\|/, "plain text, not a Markdown table");

  const rung = await lvrtc(["glossary", "rung"]);
  assert.equal(rung.code, EXIT_OK);
  assert.ok(rung.out.startsWith("check (replaces rung, ladder)\n    One comparison"), rung.out);
  assert.equal((await lvrtc(["glossary", "RUNG"])).out, rung.out, "in any case");
  assert.ok((await lvrtc(["glossary", "lens", "state"])).out.startsWith("lens state (replaces case)\n"));
  assert.ok(
    (await lvrtc(["glossary", "ATTENTION"])).out.startsWith("Side by side, worth a look (stored as ATTENTION)\n"),
  );
  // An engine by its id, or by the id it had before the rename, which the command says it read as today's.
  const engineById = await lvrtc(["glossary", "reference-tracer"]);
  assert.ok(engineById.out.startsWith("Reference tracer (replaces ref; stored as reference-tracer)\n"), engineById.out);
  const engineByOldId = await lvrtc(["glossary", "replay"]);
  assert.ok(
    engineByOldId.out.startsWith("Replay of LensVisualizer's MTF (replaces replay; stored as replay-of-lv-mtf)\n"),
  );
  assert.match(
    engineByOldId.err,
    /^note: some ids were read under their new names: engine replay is now replay-of-lv-mtf; /,
  );
  // The old word ref is both the term the reference tracer replaces and the engine's old id: both are found.
  const ref = await lvrtc(["glossary", "ref"]);
  assert.ok(ref.out.startsWith("reference tracer (replaces ref)\n"), ref.out);
  assert.ok(ref.out.includes("\n\nReference tracer (replaces ref; stored as reference-tracer)\n"), ref.out);
  // A check by its id, or by the id it had before the rename, which the command says it read as today's.
  const byId = await lvrtc(["glossary", "ray-trace"]);
  assert.ok(byId.out.startsWith("Ray trace (replaces r2; stored as ray-trace)\n"), byId.out);
  assert.equal(byId.err, "");
  const byOldId = await lvrtc(["glossary", "r2"]);
  assert.equal(byOldId.code, EXIT_OK);
  assert.equal(byOldId.out, byId.out);
  assert.match(byOldId.err, /^note: some ids were read under their new names: check r2 is now ray-trace; /);

  const json = JSON.parse((await lvrtc(["glossary", "manifest", "--json"])).out);
  assert.deepEqual(
    json.terms.map((entry: { term: string }) => entry.term),
    ["run record"],
  );
  assert.equal(JSON.parse((await lvrtc(["glossary", "--json"])).out).terms.length, TERMS.length);

  const unknown = await lvrtc(["glossary", "frobnitz"]);
  assert.equal(unknown.code, EXIT_USAGE);
  assert.match(
    unknown.err,
    /^lvrtc glossary: "frobnitz": no entry of the glossary is that word.*\nUsage: lvrtc glossary /,
  );
  assert.equal((await lvrtc(["glossary", "--wat"])).code, EXIT_USAGE);
});
