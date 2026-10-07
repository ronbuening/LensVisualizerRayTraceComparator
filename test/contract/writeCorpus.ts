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
import { EXTERNAL_VALID, FIXTURE_DIR, INVALID, VALID, fixtureText } from "./corpus.ts";

function write(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fixtureText(value));
}

for (const kind of CONTRACT_KINDS) {
  for (const [name, value] of Object.entries(VALID[kind]))
    write(join(FIXTURE_DIR, "valid", kind, `${name}.json`), value);
  for (const [name, { value, expect }] of Object.entries(INVALID[kind])) {
    write(join(FIXTURE_DIR, "invalid", kind, `${name}.json`), value);
    write(join(FIXTURE_DIR, "invalid", kind, `${name}.expect.json`), expect);
  }
}
for (const name of EXTERNAL_VALID["optical-case"] ?? []) {
  const path = join(FIXTURE_DIR, "valid", "optical-case", `${name}.json`);
  write(path, finalizeCase(JSON.parse(readFileSync(path, "utf8"))));
}
