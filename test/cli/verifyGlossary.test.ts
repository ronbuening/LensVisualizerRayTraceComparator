// `lvrtc verify` holds docs/GLOSSARY.md to what the vocabulary renders, byte for byte, on this repository (by real
// path) and on any root that has one, and `verify --write` writes it; any other root needs none, docs/ or not.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";

import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { runCli } from "../../src/cli/main.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { GLOSSARY_FILE, renderGlossary } from "../../src/vocabulary/glossary.ts";

function root(t: TestContext): string {
  const dir = mkdtempSync(join(tmpdir(), "lvrtc-glossary-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

async function verifyAt(rootDir: string, args: string[] = [], repositoryRoot?: string) {
  const output = { out: "", err: "" };
  const code = await runCli(
    ["verify", ...args],
    {
      stdout: (text) => {
        output.out += text;
      },
      stderr: (text) => {
        output.err += text;
      },
    },
    [createVerifyCommand({ rootDir, cwd: rootDir, repositoryRoot: repositoryRoot ?? join(rootDir, "elsewhere") })],
  );
  return { code, ...output };
}

test("the repository requires the glossary; verify --write writes it, then verify holds each byte", async (t) => {
  // The temporary root stands for the repository; a spelling of it through a symbolic link is the same root.
  const dir = root(t);
  const link = join(root(t), "link");
  symlinkSync(dir, link);
  const verify = (rootDir: string, args: string[] = []) => verifyAt(rootDir, args, link);
  const missing = await verify(dir);
  assert.equal(missing.code, 1);
  assert.match(
    missing.err,
    /^lvrtc verify: docs\/GLOSSARY\.md: it is missing or is not what src\/vocabulary renders; lvrtc verify --write writes it anew$/m,
  );
  assert.match(missing.out, /^verify: 0 baselines, 1 problem\./m);

  const written = await verify(dir, ["--write"]);
  assert.equal(written.code, 0, written.err);
  assert.match(written.out, /^docs\/GLOSSARY\.md is written from src\/vocabulary$/m);
  assert.equal(readFileSync(join(dir, GLOSSARY_FILE), "utf8"), renderGlossary());

  const held = await verify(dir);
  assert.equal(held.code, 0, held.err);
  assert.match(held.out, /^docs\/GLOSSARY\.md is what src\/vocabulary renders$/m);
  assert.match(held.out, /^verify: 0 baselines, 0 problems\./m);

  writeFileSync(join(dir, GLOSSARY_FILE), `${renderGlossary()} `);
  const edited = await verify(dir);
  assert.equal(edited.code, 1);
  assert.match(edited.err, /docs\/GLOSSARY\.md: it is missing or is not what src\/vocabulary renders/);
});

const verify = (rootDir: string, args: string[] = []) => verifyAt(rootDir, args);

test("another root needs no glossary, even with docs/, and verify says nothing of one", async (t) => {
  const dir = root(t);
  mkdirSync(join(dir, "docs"));
  for (const args of [[], ["--write"]]) {
    const result = await verify(dir, args);
    assert.equal(result.code, 0, result.err);
    assert.doesNotMatch(result.out + result.err, /GLOSSARY/);
  }
  // A glossary that is there is held all the same.
  writeFileSync(join(dir, GLOSSARY_FILE), "edited\n");
  const edited = await verify(dir);
  assert.equal(edited.code, 1);
  assert.match(edited.err, /docs\/GLOSSARY\.md: it is missing or is not what src\/vocabulary renders/);
});

test("the committed glossary is what the vocabulary renders", () => {
  assert.equal(readFileSync(join(REPO_ROOT, GLOSSARY_FILE), "utf8"), renderGlossary());
});
