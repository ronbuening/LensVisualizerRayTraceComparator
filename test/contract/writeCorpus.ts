// Rewrites contract/fixtures/v1 from corpus.ts. Run it after changing the corpus or the contract:
//
//   node test/contract/writeCorpus.ts
//
// An optical case that is not written in corpus.ts (the Double-Gauss case) is finalised again from its own label,
// system, conditions and provenance, so its identity follows the contract. Any other file corpus.ts lists as
// external is written by hand and left alone. Nothing is deleted: corpus.test.ts names any file that no longer
// belongs.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { finalizeCase } from "../../src/contract/case.ts";
import { CONTRACT_KINDS } from "../../src/contract/schemas.ts";
import { EXTERNAL_VALID, FIXTURE_DIR, INVALID, QUANTITY_FIXTURES, VALID, fixtureText } from "./corpus.ts";
import type { InvalidFixture } from "./corpus.ts";

function write(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fixtureText(value));
}

/** Writes the fixtures of one schema below `valid/<directory>` and `invalid/<directory>`. */
function writeFixtures(
  directory: string,
  valid: Record<string, unknown>,
  invalid: Record<string, InvalidFixture>,
): void {
  for (const [name, value] of Object.entries(valid))
    write(join(FIXTURE_DIR, "valid", directory, `${name}.json`), value);
  for (const [name, { value, expect }] of Object.entries(invalid)) {
    write(join(FIXTURE_DIR, "invalid", directory, `${name}.json`), value);
    write(join(FIXTURE_DIR, "invalid", directory, `${name}.expect.json`), expect);
  }
}

for (const kind of CONTRACT_KINDS) writeFixtures(kind, VALID[kind], INVALID[kind]);
for (const [schema, { valid, invalid }] of Object.entries(QUANTITY_FIXTURES)) {
  writeFixtures(join("quantities", schema), valid, invalid);
}
for (const name of EXTERNAL_VALID["optical-case"] ?? []) {
  const path = join(FIXTURE_DIR, "valid", "optical-case", `${name}.json`);
  write(path, finalizeCase(JSON.parse(readFileSync(path, "utf8"))));
}
