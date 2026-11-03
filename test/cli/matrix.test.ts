import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";

import { baselineText } from "../../src/baseline/build.ts";
import { createMatrixCommand } from "../../src/cli/commands/matrix.ts";
import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { COMMANDS, runCli } from "../../src/cli/main.ts";
import { MATRIX_JSON, MATRIX_MARKDOWN } from "../../src/report/matrix.ts";
import { MATRIX_POLICY, matrixInputs } from "../report/matrixFixture.ts";

function root(t: TestContext): string {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-matrix-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "baselines"));
  for (const input of matrixInputs()) writeFileSync(join(root, "baselines", input.file), baselineText(input.baseline));
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
      createMatrixCommand({ rootDir, cwd: rootDir }),
      createVerifyCommand({ rootDir, cwd: rootDir, policy: MATRIX_POLICY }),
    ],
  );
  return { code, ...output };
}

test("matrix command deterministically writes both files from the benchmark's baselines; verify holds each byte", async (t) => {
  assert.ok(COMMANDS.some((c) => c.name === "matrix"));
  const dir = root(t);
  const baselines = matrixInputs().map((input) => readFileSync(join(dir, "baselines", input.file), "utf8"));
  assert.equal((await command(dir, ["matrix", "--root", "."])).code, 0);
  const texts = [MATRIX_JSON, MATRIX_MARKDOWN].map((file) => readFileSync(join(dir, file), "utf8"));
  assert.equal((await command(dir, ["matrix"])).code, 0);
  assert.deepEqual(
    [MATRIX_JSON, MATRIX_MARKDOWN].map((file) => readFileSync(join(dir, file), "utf8")),
    texts,
  );
  assert.deepEqual(
    matrixInputs().map((input) => readFileSync(join(dir, "baselines", input.file), "utf8")),
    baselines,
  );
  // The per-suite reports are written by verify --write; the matrix is then held byte for byte.
  assert.equal((await command(dir, ["verify", "--write"])).code, 0);
  assert.equal((await command(dir, ["verify"])).code, 0, "verify holds what matrix wrote");
  for (const [index, file] of [MATRIX_JSON, MATRIX_MARKDOWN].entries()) {
    writeFileSync(join(dir, file), texts[index] + " ");
    const checked = await command(dir, ["verify"]);
    assert.equal(checked.code, 1);
    assert.ok(checked.err.includes(`${file}: it is missing or is not what the benchmark's two baselines render`));
    assert.equal((await command(dir, ["matrix"])).code, 0);
    assert.equal(readFileSync(join(dir, file), "utf8"), texts[index]);
  }
  for (const file of [MATRIX_JSON, MATRIX_MARKDOWN]) rmSync(join(dir, file));
  const missing = await command(dir, ["verify"]);
  assert.equal(missing.code, 1, "deleting both matrix files cannot bypass verify");
  assert.ok(missing.err.includes(`${MATRIX_MARKDOWN}: it is missing`));
  assert.equal((await command(dir, ["verify", "--write"])).code, 0);
  assert.deepEqual(
    [MATRIX_JSON, MATRIX_MARKDOWN].map((file) => readFileSync(join(dir, file), "utf8")),
    texts,
  );
  assert.equal((await command(dir, ["verify"])).code, 0);
});

test("a matrix file without the benchmark's baselines is a problem of verify, and matrix writes nothing then", async (t) => {
  const dir = root(t);
  assert.equal((await command(dir, ["matrix"])).code, 0);
  const before = readFileSync(join(dir, MATRIX_JSON), "utf8");
  const file = join(dir, "baselines", "benchmark.mtf.json");
  rmSync(file);
  const missing = await command(dir, ["matrix"]);
  assert.equal(missing.code, 1);
  assert.match(missing.err, /benchmark\.mtf\.json/);
  writeFileSync(file, "{}");
  assert.equal((await command(dir, ["matrix"])).code, 1);
  assert.equal(readFileSync(join(dir, MATRIX_JSON), "utf8"), before);
  rmSync(file);
  const stray = await command(dir, ["verify", "--write"]);
  assert.equal(stray.code, 1);
  assert.match(stray.err, /validation-matrix: .*benchmark\.mtf\.json/);
});

test("matrix command help and usage errors", async (t) => {
  const dir = root(t);
  const help = await command(dir, ["matrix", "--help"]);
  assert.equal(help.code, 0);
  assert.match(help.out, /^Usage: lvrtc matrix \[--root <dir>\]$/m);
  for (const args of [["--wat"], ["extra"], ["--root"], ["--root", "missing"]])
    assert.equal((await command(dir, ["matrix", ...args])).code, 2);
});
