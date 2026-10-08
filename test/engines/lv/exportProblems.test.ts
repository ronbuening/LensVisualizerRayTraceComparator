import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { REPO_ROOT } from "../../../src/core/config.ts";
import {
  EXPORT_PROBLEM_CODES,
  LV_GATE_PROBLEM_CODES,
  problemCode,
  problemText,
} from "../../../src/engines/lv/exportProblems.ts";

const CODES: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];

test("every problem code is a lower-case word list, and none is in both lists", () => {
  for (const code of CODES) assert.match(code, /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
  assert.equal(new Set(CODES).size, CODES.length);
});

test("a problem is written as <code>: <message>, and its code is read back from the text", () => {
  for (const code of [...CODES, "lv-not-configured", "a-reason-added-later"]) {
    const text = problemText({ code, message: "what is wrong: in detail" });
    assert.equal(text, `${code}: what is wrong: in detail`);
    assert.equal(problemCode(text), code);
  }
  // A text that no exporter wrote has no code.
  for (const text of [
    "lens fixture cases/a.json: it cannot be read (ENOENT)",
    "No code here",
    "",
    "code:without a space",
  ]) {
    assert.equal(problemCode(text), null, text);
  }
});

test("the contract's document lists every code the exporter gives", () => {
  const contract = readFileSync(join(REPO_ROOT, "contract", "CONTRACT.md"), "utf8");
  for (const code of CODES) assert.ok(contract.includes(`\`${code}\``), `CONTRACT.md does not mention ${code}`);
});
