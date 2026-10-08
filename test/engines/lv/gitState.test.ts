import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { runSystemCommand } from "../../../src/core/systemCommand.ts";
import type { CommandResult } from "../../../src/core/systemCommand.ts";
import { lvGitState } from "../../../src/engines/lv/gitState.ts";

const LV = "/checkouts/lv";
const COMMIT = "0123456789abcdef0123456789abcdef01234567";

function ok(stdout: string): CommandResult {
  return { status: 0, stdout, stderr: "" };
}

/** A scripted git: what each command line answers, and the lines asked. Unlisted commands fail. */
function scripted(answers: Record<string, CommandResult | null>) {
  const ran: string[] = [];
  const run = (command: string, args: readonly string[]): CommandResult | null => {
    const line = [command, ...args].join(" ");
    ran.push(line);
    return line in answers ? answers[line] : { status: 128, stdout: "", stderr: "fatal" };
  };
  return { ran, run };
}

const TOP = `git -C ${LV} rev-parse --show-toplevel`;
const HEAD = `git -C ${LV} rev-parse HEAD`;
const LAST = `git -C ${LV} rev-list -1 HEAD -- .`;
const STATUS = `git --no-optional-locks -C ${LV} status --porcelain -- .`;

test("a checkout that is its own repository reports HEAD and whether anything differs", () => {
  const clean = scripted({ [TOP]: ok(`${LV}\n`), [HEAD]: ok(`${COMMIT}\n`), [STATUS]: ok("") });
  assert.deepEqual(lvGitState(LV, clean.run), { commit: COMMIT, dirty: false });
  assert.deepEqual(clean.ran, [TOP, HEAD, STATUS]);

  const dirty = scripted({ [TOP]: ok(`${LV}\n`), [HEAD]: ok(`${COMMIT}\n`), [STATUS]: ok("?? notes.txt\n") });
  assert.deepEqual(lvGitState(LV, dirty.run), { commit: COMMIT, dirty: true });
});

test("a directory inside another repository reports the last commit that touched it", () => {
  const git = scripted({ [TOP]: ok("/checkouts\n"), [LAST]: ok(`${COMMIT}\n`), [STATUS]: ok("") });
  assert.deepEqual(lvGitState(LV, git.run), { commit: COMMIT, dirty: false });
  assert.deepEqual(git.ran, [TOP, LAST, STATUS]);

  const untouched = scripted({ [TOP]: ok("/checkouts\n"), [LAST]: ok(""), [STATUS]: ok("?? lv/\n") });
  assert.equal(lvGitState(LV, untouched.run), null);
});

test("no git, no repository, no commit and a status that fails all give null", () => {
  assert.equal(lvGitState(LV, scripted({ [TOP]: null }).run), null);
  const outside = scripted({});
  assert.equal(lvGitState(LV, outside.run), null);
  assert.deepEqual(outside.ran, [TOP], "nothing more is asked outside a repository");
  assert.equal(lvGitState(LV, scripted({ [TOP]: ok(`${LV}\n`) }).run), null);
  assert.equal(lvGitState(LV, scripted({ [TOP]: ok(`${LV}\n`), [HEAD]: ok(`${COMMIT}\n`) }).run), null);
});

const GIT_MISSING: string | false =
  runSystemCommand("git", ["--version"])?.status === 0 ? false : "git is not available on this machine";

/** Runs git in a directory with an identity of its own, so that the test needs nothing of the user's configuration. */
function git(cwd: string, ...args: string[]): string {
  const identity = [
    "-c",
    "user.name=lvrtc test",
    "-c",
    "user.email=lvrtc@example.invalid",
    "-c",
    "commit.gpgsign=false",
  ];
  const env: NodeJS.ProcessEnv = { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_SYSTEM: "/dev/null" };
  for (const name of Object.keys(env))
    if (/^GIT_(DIR|WORK_TREE|INDEX_FILE|COMMON_DIR|PREFIX)$/.test(name)) delete env[name];
  return execFileSync("git", [...identity, ...args], { cwd, env, encoding: "utf8" }).trim();
}

function repository(t: TestContext): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-git-")));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  git(dir, "init", "--quiet");
  return dir;
}

test(
  "with real git: an LV directory inside another repository is not given that repository's HEAD",
  { skip: GIT_MISSING },
  (t) => {
    const outer = repository(t);
    const lv = join(outer, "vendor", "lv");
    mkdirSync(lv, { recursive: true });
    writeFileSync(join(lv, "engine.ts"), "export const A = 1;\n");
    git(outer, "add", ".");
    git(outer, "commit", "--quiet", "-m", "add lv");
    const lvCommit = git(outer, "rev-parse", "HEAD");
    writeFileSync(join(outer, "unrelated.txt"), "one\n");
    git(outer, "add", ".");
    git(outer, "commit", "--quiet", "-m", "unrelated");
    assert.notEqual(git(outer, "rev-parse", "HEAD"), lvCommit);

    assert.deepEqual(lvGitState(lv, runSystemCommand), { commit: lvCommit, dirty: false });
    // A change outside the LV directory does not make LV dirty; one inside does.
    writeFileSync(join(outer, "unrelated.txt"), "two\n");
    assert.deepEqual(lvGitState(lv, runSystemCommand), { commit: lvCommit, dirty: false });
    writeFileSync(join(lv, "engine.ts"), "export const A = 2;\n");
    assert.deepEqual(lvGitState(lv, runSystemCommand), { commit: lvCommit, dirty: true });

    // The enclosing repository itself reports its HEAD.
    assert.equal(lvGitState(outer, runSystemCommand)?.commit, git(outer, "rev-parse", "HEAD"));

    // A directory of the repository that no commit has touched has no git state, whatever its HEAD is.
    const untracked = join(outer, "vendor", "lv-copy");
    mkdirSync(untracked);
    writeFileSync(join(untracked, "engine.ts"), "export const A = 1;\n");
    assert.equal(lvGitState(untracked, runSystemCommand), null);
  },
);

test("with real git: a directory under no repository has no git state", { skip: GIT_MISSING }, (t) => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-nogit-")));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.equal(lvGitState(dir, runSystemCommand), null);
});
