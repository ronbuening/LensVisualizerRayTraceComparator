// Every template of `DASHBOARD_TEXT`, with sample arguments, passes the wording lint on its own: a page rendered from
// the fixtures shows only some of them (`server.test.ts` lints those pages).
import assert from "node:assert/strict";
import { test } from "node:test";

import { DASHBOARD_TEXT, wordingProblems } from "../../src/report/wording.ts";

function sentences(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") return [String((value as (...args: unknown[]) => unknown)("ab12", "a problem"))];
  if (Array.isArray(value)) return value.flatMap(sentences);
  if (value !== null && typeof value === "object") return Object.values(value).flatMap(sentences);
  return [];
}

test("every sentence of DASHBOARD_TEXT passes the wording lint", () => {
  const all = sentences(DASHBOARD_TEXT);
  assert.ok(all.length > 30, `${all.length} sentences`);
  for (const sentence of all) assert.deepEqual(wordingProblems(sentence), [], sentence);
  assert.equal(DASHBOARD_TEXT.failing(3), "Pairs that are FAIL or ERROR: 3.");
  // The lint does reject a claim a dashboard must not make.
  assert.notDeepEqual(wordingProblems("The consensus is correct."), []);
});
