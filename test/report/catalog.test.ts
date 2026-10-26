import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { baselineText } from "../../src/baseline/build.ts";
import { writeBaselineFiles } from "../../src/cli/commands/baseline.ts";
import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { createStatementCommand } from "../../src/cli/commands/statement.ts";
import { runCli } from "../../src/cli/main.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { renderCatalog, quantiles } from "../../src/report/catalog.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { tempDir } from "../core/support.ts";
import { catalogInputs, catalogKnown, catalogRaw } from "./catalogFixture.ts";
import { statementInputs, STATEMENT_POLICY } from "./statementFixture.ts";
import { GOLDEN_DIR } from "./support.ts";

test("catalog quantiles, distinct R4 pairs, refusal codes, classes and goldens", () => {
  assert.deepEqual(quantiles([0, 1, 2, 3, 4]), { min: 0, median: 2, p90: 3.6, p99: 3.96, max: 4 });
  assert.deepEqual(quantiles([]), { min: null, median: null, p90: null, p99: null, max: null });
  const rendered = renderCatalog(catalogInputs());
  assert.equal(rendered.report.complete, true);
  assert.equal(rendered.report.states, 3);
  assert.deepEqual(rendered.report.pairs, { FAIL: 1, UNSUPPORTED: 1 });
  assert.deepEqual(rendered.report.unsupported.source, { "invented-refusal": 1 });
  assert.deepEqual(rendered.report.unsupported.engineRungs, { "invented-code artificial.item": 1 });
  assert.equal(rendered.report.failures[0].classifications[0].class, "numerical");
  assert.equal(renderCatalog([...catalogInputs()].reverse()).json, rendered.json);
  assert.equal(readFileSync(join(GOLDEN_DIR, "catalog.md"), "utf8"), rendered.markdown);
  assert.equal(readFileSync(join(GOLDEN_DIR, "catalog.json"), "utf8"), rendered.json);
  const mismatched = catalogInputs();
  Object.assign(mismatched[1].baseline.runs[0].rungs[0].pairs[0].metrics[0], { value: 0 });
  assert.throws(() => renderCatalog(mismatched), /duplicate catalog figures/);
});
test("verify holds catalog statistics byte for byte and rejects removed classifications", async (t) => {
  const root = tempDir(t),
    policy = loadPolicy();
  mkdirSync(join(root, "docs"));
  writeFileSync(join(root, "docs/known-failures.json"), JSON.stringify(catalogKnown()));
  for (const input of catalogInputs())
    writeBaselineFiles(
      root,
      { ...input.baseline, policy: { version: policy.version, hash: hashCanonical(policy) } },
      input.file.includes(".mtf."),
    );
  const command = createVerifyCommand({ rootDir: root, cwd: root });
  let out = "";
  const io = {
    stdout: (s: string) => {
      out += s;
    },
    stderr: (s: string) => {
      out += s;
    },
  };
  assert.equal(await runCli(["verify", "--write"], io, [command]), 0, out);
  assert.equal(await runCli(["verify"], io, [command]), 0, out);
  writeFileSync(join(root, "reports/catalog.md"), "edited");
  assert.equal(await runCli(["verify"], io, [command]), 1);
  await runCli(["verify", "--write"], io, [command]);
  writeFileSync(join(root, "docs/known-failures.json"), "[]");
  assert.equal(await runCli(["verify"], io, [command]), 1);
  // An entry that no classification uses is stale, and verify says so.
  const stale = { ...catalogKnown()[0], rung: "r2" };
  writeFileSync(join(root, "docs/known-failures.json"), JSON.stringify([...catalogKnown(), stale]));
  out = "";
  assert.equal(await runCli(["verify"], io, [command]), 1);
  assert.match(out, /no catalog baseline classifies catalog-artificial-prime r2 lv ref mtf\.maxAbs/);
  writeFileSync(join(root, "docs/known-failures.json"), JSON.stringify(catalogKnown()));
  assert.equal(await runCli(["verify"], io, [command]), 0, out);
  // The list excuses nothing outside the catalog: a FAIL in any other baseline is a problem of verify.
  const raw = catalogRaw();
  const other = {
    ...raw,
    contract: "1.3",
    suite: { ...raw.suite, name: "other" },
    policy: { version: policy.version, hash: hashCanonical(policy) },
    runs: raw.runs.map(({ features: _features, ...run }) => run),
  };
  writeBaselineFiles(root, other, false);
  out = "";
  assert.equal(await runCli(["verify"], io, [command]), 1);
  assert.match(out, /baselines\/other\.json: catalog-artificial-prime r4 lv ref FAIL: no baseline records it/);
});
test("statement still reads exactly its eight files with folded, diffractive and catalog baselines present", async (t) => {
  const root = tempDir(t);
  for (const input of statementInputs()) writeBaselineFiles(root, input.baseline, input.file.includes(".mtf."));
  const command = createStatementCommand({ rootDir: root, cwd: root });
  const io = { stdout: (_s: string) => {}, stderr: (_s: string) => {} };
  assert.equal(await runCli(["statement"], io, [command]), 0);
  const before = readFileSync(join(root, "reports/validation-statement.json"), "utf8");
  for (const name of ["folded", "diffractive", "catalog"]) {
    const b = { ...statementInputs()[0].baseline, suite: { name, hash: "a".repeat(64) } };
    writeFileSync(join(root, "baselines", `${name}.json`), baselineText(b));
  }
  assert.equal(await runCli(["statement"], io, [command]), 0);
  assert.equal(readFileSync(join(root, "reports/validation-statement.json"), "utf8"), before);
  assert.equal((await import("../../src/report/statement.ts")).STATEMENT_FILES.length, 8);
  assert.equal(STATEMENT_POLICY.version, 1);
});
