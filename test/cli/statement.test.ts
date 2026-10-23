import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";

import { baselineText } from "../../src/baseline/build.ts";
import { createStatementCommand } from "../../src/cli/commands/statement.ts";
import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { runCli } from "../../src/cli/main.ts";
import { STATEMENT_JSON, STATEMENT_MARKDOWN } from "../../src/report/statement.ts";
import { STATEMENT_POLICY, statementInputs } from "../report/statementFixture.ts";

function root(t: TestContext): string {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-statement-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "baselines"));
  for (const input of statementInputs())
    writeFileSync(join(root, "baselines", input.file), baselineText(input.baseline));
  // Even a hostile config and absent engines cannot affect a baseline-only command.
  writeFileSync(join(root, "lvrtc.config.json"), "not json");
  return root;
}
async function command(rootDir: string, args: string[]) {
  const output = { out: "", err: "" };
  const code = await runCli(
    args,
    {
      stdout: (text) => {
        output.out += text;
      },
      stderr: (text) => {
        output.err += text;
      },
    },
    [
      createStatementCommand({ rootDir, cwd: rootDir }),
      createVerifyCommand({ rootDir, cwd: rootDir, policy: STATEMENT_POLICY }),
    ],
  );
  return { code, ...output };
}

test("statement command deterministically writes both files from baselines only; verify holds each byte", async (t) => {
  const dir = root(t);
  const baselines = statementInputs().map((input) => readFileSync(join(dir, "baselines", input.file), "utf8"));
  assert.equal((await command(dir, ["statement", "--root", "."])).code, 0);
  const texts = [STATEMENT_JSON, STATEMENT_MARKDOWN].map((file) => readFileSync(join(dir, file), "utf8"));
  assert.equal((await command(dir, ["statement"])).code, 0);
  assert.deepEqual(
    [STATEMENT_JSON, STATEMENT_MARKDOWN].map((file) => readFileSync(join(dir, file), "utf8")),
    texts,
  );
  assert.deepEqual(
    statementInputs().map((input) => readFileSync(join(dir, "baselines", input.file), "utf8")),
    baselines,
  );
  assert.equal((await command(dir, ["verify", "--write"])).code, 0);
  assert.equal((await command(dir, ["verify"])).code, 0);
  for (const [index, file] of [STATEMENT_JSON, STATEMENT_MARKDOWN].entries()) {
    writeFileSync(join(dir, file), texts[index] + " ");
    const checked = await command(dir, ["verify"]);
    assert.equal(checked.code, 1);
    assert.ok(checked.err.includes(`${file}: it is missing or is not what the eight baselines render`));
    assert.equal((await command(dir, ["statement"])).code, 0);
  }
  for (const file of [STATEMENT_JSON, STATEMENT_MARKDOWN]) rmSync(join(dir, file));
  assert.equal((await command(dir, ["verify"])).code, 1, "deleting both statements cannot bypass verify");
  assert.equal((await command(dir, ["verify", "--write"])).code, 0);
  assert.equal((await command(dir, ["verify"])).code, 0);
});

test("statement command rejects incomplete or malformed inputs before replacing either output", async (t) => {
  const dir = root(t);
  assert.equal((await command(dir, ["statement"])).code, 0);
  const before = readFileSync(join(dir, STATEMENT_JSON), "utf8");
  const file = join(dir, "baselines", "features.json");
  rmSync(file);
  const missing = await command(dir, ["statement"]);
  assert.equal(missing.code, 1);
  assert.match(missing.err, /features.json/);
  writeFileSync(file, "{}");
  assert.equal((await command(dir, ["statement"])).code, 1);
  assert.equal(readFileSync(join(dir, STATEMENT_JSON), "utf8"), before);
  assert.equal((await command(dir, ["verify"])).code, 1);
});

test("statement command help and usage errors", async (t) => {
  const dir = root(t);
  assert.equal((await command(dir, ["statement", "--help"])).code, 0);
  for (const args of [["--wat"], ["extra"], ["--root"], ["--root", "missing"]])
    assert.equal((await command(dir, ["statement", ...args])).code, 2);
});
